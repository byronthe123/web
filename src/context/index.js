import React, {
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo,
} from 'react';
import { renderToString } from 'react-dom/server';

// MSAL
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';

import { useToasts } from 'react-toast-notifications';

import axios from 'axios';
import dayjs from 'dayjs';
import _ from 'lodash';
import { api, asyncHandler, validateAwb } from '../utils';
import { socket } from './socket';

// Comms
import { CallClient } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
    isCommunicationUserIdentifier,
    isPhoneNumberIdentifier,
    isMicrosoftTeamsUserIdentifier,
    isUnknownIdentifier,
} from '@azure/communication-common';
import { ChatClient } from '@azure/communication-chat';
import useSound from 'use-sound';
import callRing from '../assets/audio/callRing.mp3';
import chat from '../assets/audio/chat.mp3';
import GenerateChatTranscript from '../components/comms/GenerateChatTranscript';
import moment from 'moment';
import { Buffer } from 'buffer';
import { useHistory } from 'react-router-dom';

import sidebarMap from '../constants/sidebarMap';
import { addAccessTokenInterceptor } from '../apiClient';

const REACT_APP_ENDPOINT_URL = process.env.REACT_APP_ENDPOINT_URL;
const REACT_APP_ENDPOINT_AUTH_CODE = `_*xP-Q97MTB5sb_CvK^wwzaX8yz^H5&fu6^%Ae_J2PC@aXc6SADH8Gf2m3vJAc^G*s@T9pqZ8$EmZXb6`;
const REACT_APP_NO_LOGIN = JSON.parse(process.env.REACT_APP_NO_LOGIN || false);

export const AppContext = React.createContext();

export default function Provider(props) {
    const history = useHistory();

    // Routes
    const [accessMap, setAcessMap] = useState(sidebarMap);
    const [accessMapAssigned, setAccessMapAssigned] = useState(false);

    // User
    const isAuthenticated = useIsAuthenticated();
    const { instance, accounts } = useMsal();
    const [user, setUser] = useState({});
    const [airlineData, setAirlineData] = useState([]);
    const [userDataLoaded, setUserDataLoaded] = useState(false);

    // Wikis
    const [wikis, setWikis] = useState([]);
    const [customWikiTitle, setCustomWikiTitle] = useState(null);
    const [accessLevels, setAccessLevels] = useState([]);

    // Units
    const [stations, setStations] = useState([]);

    // SearchAwb
    const [modalSearchAwb, setModalSearchAwb] = useState(false);
    const [searchAwbNum, setSearchAwbNum] = useState('');
    const [searchAwbDataMap, setSearchAwbDataMap] = useState({
        fwb: {
            key: 'fwb',
            name: 'Freight Waybill (FWB)',
            data: [],
            hasData: false,
        },
        fhl: {
            key: 'fhl',
            name: 'Consolidation List (FHL)',
            data: [],
            hasData: false,
        },
        ffm: {
            key: 'ffm',
            name: 'Flight Manifest (FFM)',
            data: [],
            hasData: false,
            dataCount: 0,
        },
        locations: {
            key: 'locations',
            name: 'Warehouse Locations',
            data: [],
            hasData: false,
        },
        notifications: {
            key: 'notifications',
            name: 'Shipment Notification (NFD)',
            data: [],
            hasData: false,
        },
        payments: {
            key: 'payments',
            name: 'Cargo Payment',
            data: [],
            hasData: false,
        },
        import: {
            key: 'import',
            name: 'Delivery Process',
            data: [],
            hasData: false,
        },
        export: {
            key: 'export',
            name: 'Acceptance Process',
            data: [],
            hasData: false,
        },
        fsn: {
            key: 'fsn',
            name: 'Freight Status Notification (FSN)',
            data: [],
            hasData: false,
        },
        warehouse: {
            key: 'warehouse',
            name: 'Warehouse Check In',
            data: [],
            hasData: false,
        },
        dlv: {
            key: 'dlv',
            name: 'Freight Status Delivered (DLV)',
            data: [],
            hasData: false,
        },
        cdr: {
            key: 'cdr',
            name: 'Cargo Damage Report',
            data: [],
            hasData: false,
        },
        log: {
            key: 'log',
            name: 'Log/Notes',
            data: [],
            hasData: false,
        },
        visualReporting: {
            key: 'visualReporting',
            name: 'Visual Reporting',
            data: [],
            hasData: false,
        },
    });
    const [additionalSearchAwbData, setAdditionalSearchAwbData] = useState({});

    const [addNotesModal, setAddNotesModal] = useState(false);
    const [showNotes, setShowNotes] = useState();
    const handleAddNotes = (showNotes) => {
        setShowNotes(showNotes);
        setAddNotesModal(true);
    };

    const [signOut, setSignOut] = useState(false);

    const handleSearchAwb = useCallback(async (e, overrideSearchAwb = null) => {
        if (e) {
            e.preventDefault();
        }

        if (overrideSearchAwb) {
            setSearchAwbNum(overrideSearchAwb);
        }

        const s_mawb = overrideSearchAwb || searchAwbNum;
        const normalized = (s_mawb || '').replace(/-/g, '');

        if (normalized && normalized.length === 11 && validateAwb(normalized)) {
            setLoading(true);
            const map = searchAwbDataMap;
            const res = await api('post', 'searchAwbDashboard', {
                s_mawb,
                s_unit: user.s_unit,
                map,
                s_airline_codes: user.b_airline ? user.s_airline_codes : []
            });
            setLoading(false);

            if (res.status === 200) {
                setSearchAwbDataMap(res.data.map);
                setAdditionalSearchAwbData(res.data.additional);
                setModalSearchAwb(true);
            }
        }
    }, [searchAwbDataMap, searchAwbNum, user.s_unit]);

    // Updates
    const [updates, setUpdates] = useState([]);

    // Reading Signs
    const [readingSigns, setReadingSigns] = useState([]);

    // Select Location/Station/s_unit
    const [modalLocation, setModalLocation] = useState(false);

    const [menuApps, setMenuApps] = useState({
        system: [],
        user: [],
    });

    // Create Notification
    const { addToast } = useToasts();
    const createSuccessNotification = useCallback(
        (message, type = 'success') => {
            addToast(message, {
                appearance: type,
                autoDismiss: true,
            });
        },
        [addToast]
    );

    // Charges
    const [charges, setCharges] = useState([]);

    // Handle Display Submenu:
    const [displaySubmenu, setDisplaySubmenu] = useState(false);

    // API token
    const [accessToken, setAccessToken] = useState('');

    const [appDataLoaded, setAppDataLoaded] = useState(false);
    const [changeLogData, setChangeLogData] = useState([]);

    const [shcs, setShcs] = useState([]);

    // Comms:
    // let callClient = null, callAgent = null, destinationUserIds = null;
    const [callClient, setCallClient] = useState(null);
    const [callAgent, setCallAgent] = useState(null);
    const [deviceManager, setDeviceManager] = useState(null);

    // const [id, setId] = useState(undefined);
    const [loggedIn, setLoggedIn] = useState(false);
    const [call, setCall] = useState(undefined);
    const [incomingCall, setIncomingCall] = useState(undefined);
    const [ringIncomingCall, setRingIncomingCall] = useState(false);

    const [commsData, setCommsData] = useState({});
    const [modalComms, setModalComms] = useState(false);
    const [play, { stop }] = useSound(callRing, { volume: 0.1 });
    const [playChat] = useSound(chat, { volume: 0.1 });

    // Chat
    const [chatClient, setChatClient] = useState(null);
    const [chatThreadClient, setChatThreadClient] = useState(null);
    const [chatThreadId, setChatThreadId] = useState(null);
    const [activeChat, setActiveChat] = useState(false);
    // const [chatReceived, setChatReceived] = useState('');
    const [chatReceived, setChatReceived] = useState({});
    const [lastMsgId, setLastMsgId] = useState('');
    const [triggerChat, setTriggerChat] = useState(false);
    const [chatParticipant, setChatParticipant] = useState({});
    const [chatThreadDeleted, setChatThreadDeleted] = useState(false);

    const getIdentifierText = (identifier) => {
        if (isCommunicationUserIdentifier(identifier)) {
            return identifier.communicationUserId;
        } else if (isPhoneNumberIdentifier(identifier)) {
            return identifier.phoneNumber;
        } else if (isMicrosoftTeamsUserIdentifier(identifier)) {
            return identifier.microsoftTeamsUserId;
        } else if (
            isUnknownIdentifier(identifier) &&
            identifier.id === '8:echo123'
        ) {
            return 'Echo Bot';
        } else {
            return 'Unknown Identifier';
        }
    };

    const handleLogIn = async (userDetails) => {
        if (userDetails) {
            try {
                const tokenCredential = new AzureCommunicationTokenCredential(
                    userDetails.token
                );
                const callClient = new CallClient();
                setCallClient(callClient);

                const callAgent = await callClient.createCallAgent(
                    tokenCredential,
                    { displayName: userDetails.displayName }
                );
                window.callAgent = callAgent;

                const deviceManager = await callClient.getDeviceManager();

                if (!navigator.userAgent.match('CriOS')) {
                    await deviceManager.askDevicePermission({ audio: true });
                    await deviceManager.askDevicePermission({ video: true });
                }

                setDeviceManager(deviceManager);
                setCallAgent(callAgent);
                setLoggedIn(true);
                const chatCredential = new AzureCommunicationTokenCredential(
                    userDetails.chatToken.token
                );
                const chatClient = new ChatClient(
                    process.env.REACT_APP_COMMS_ENDPOINT,
                    chatCredential
                );
                setChatClient(chatClient);
            } catch (e) {
                console.error(e);
            }
        }
    };

    callAgent &&
        callAgent.on('incomingCall', (args) => {
            setRingIncomingCall(true);
            play();
            const incomingCall = args.incomingCall;
            if (call && call.state === 'Notified') {
                incomingCall.reject();
                return;
            }

            //this.setState({incomingCall: incomingCall});
            setIncomingCall(incomingCall);

            incomingCall.on('callEnded', (args) => {
                setRingIncomingCall(false);
                stop();
                //this.displayCallEndReason(args.callEndReason);
                // TODO
            });
        });

    callAgent &&
        callAgent.on('callsUpdated', (e) => {
            stop();

            e.added.forEach((call) => {
                //this.setState({ call: call })
                setCall(call);
            });

            e.removed.forEach((_call) => {
                if (call && call === _call) {
                    //this.displayCallEndReason(this.state.call.callEndReason);
                    // TODO
                }
            });
        });

    useEffect(() => {
        const startChatNotifications = async () => {
            await chatClient.startRealtimeNotifications();
        };
        if (loggedIn && chatClient) {
            setTriggerChat(true);
            startChatNotifications();
        }
    }, [chatClient, loggedIn]);

    useEffect(() => {
        if (triggerChat && chatClient) {
            chatClient.on('chatThreadCreated', (e) => {
                setActiveChat(true);
                setChatThreadDeleted(false);
            });

            chatClient.on('chatMessageReceived', (e) => {
                if (!activeChat) {
                    setActiveChat(true);
                }

                if (chatThreadId !== e.threadId) {
                    setChatThreadId(e.threadId);

                    const chatThreadClient = chatClient.getChatThreadClient(
                        e.threadId
                    );
                    setChatThreadClient(chatThreadClient);

                    const { id, message, sender, senderDisplayName } = e;

                    if (sender.communicationUserId !== user.commsId) {
                        playChat();

                        setChatReceived({
                            id,
                            message,
                        });
                        setLastMsgId(id);

                        if (
                            (chatParticipant && chatParticipant.displayName) !==
                            senderDisplayName
                        ) {
                            const activeUser = activeUsers.find(
                                (u) => u.commsId === sender.communicationUserId
                            );
                            setChatParticipant({
                                commsId: sender.communicationUserId,
                                displayName: senderDisplayName,
                                s_email: activeUser.s_email,
                            });
                        }
                    }
                }
            });

            chatClient.on('chatThreadDeleted', (e) => {
                setChatThreadDeleted(true);
                setTimeout(() => {
                    setActiveChat(false);
                }, 1500);
            });
        }

        return () => {
            chatThreadId &&
                chatClient &&
                chatClient.deleteChatThread(chatThreadId);
        };
    }, [triggerChat, chatClient, chatThreadId, commsData && commsData.user]);

    const endChat = async () => {
        if (chatThreadClient) {
            const messagesArray = [];
            const messages = chatThreadClient.listMessages();
            for await (const message of messages) {
                messagesArray.unshift(message);
            }

            if (messagesArray.length > 2) {
                const transcript = renderToString(
                    <GenerateChatTranscript
                        user={user}
                        chatParticipant={chatParticipant}
                        messagesArray={messagesArray.splice(2)}
                    />
                );

                const data = {
                    transcript,
                    emailTo: `${user.s_email}, ${chatParticipant.s_email}`,
                };

                await api('post', 'emailChatTranscript', data);
                createSuccessNotification(
                    'You will receive the chat transcript by email'
                );
            }
        }

        chatClient.deleteChatThread(chatThreadId);
        setChatThreadClient(null);
    };

    useEffect(() => {
        if (triggerChat && chatClient) {
            //updateBusyStatus(activeChat);
        }
    }, [activeChat, triggerChat, chatClient]);

    const handleCallEnd = () => {
        setCall(undefined);
        setIncomingCall(undefined);
    };

    const initializeChatThread = async (participant, _threadId = null) => {
        if (chatClient) {
            const createChatThreadRequest = {
                topic: 'Chat',
            };

            const createChatThreadOptions = {
                participants: [
                    {
                        id: {
                            communicationUserId: user.commsId,
                        },
                        displayName: user.displayName,
                    },
                    {
                        id: {
                            communicationUserId: participant.commsId,
                        },
                        displayName: participant.displayName,
                    },
                ],
            };

            const createChatThreadResult = await chatClient.createChatThread(
                createChatThreadRequest,
                createChatThreadOptions
            );

            const threadId = _threadId
                ? _threadId
                : createChatThreadResult.chatThread
                ? createChatThreadResult.chatThread.id
                : '';
            const chatThreadClient = chatClient.getChatThreadClient(threadId);

            setChatThreadClient(chatThreadClient);
            setChatThreadId(threadId);
            setChatParticipant(participant);
        }
    };

    // User functions:

    const getAccessToken = async () => {
        try {
            const response = await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
            });
            return response.accessToken;
        } catch (error) {
            console.log(error);
            return '';
        }
    };

    const createAccessRecord = async (user) => {
        if (user && user.s_email.toLowerCase() !== 'byron@choice.aeros') {
            try {
                const res = await axios.get(
                    `https://ipgeolocation.abstractapi.com/v1/?api_key=${process.env.REACT_APP_ABSTRACT_API_KEY}`
                );
                if (res.status === 200) {
                    const { data } = res;
                    data.page = window.location.pathname;
                    data.user = user.s_email;
                    data.date = moment().local().format('MM/DD/YYYY HH:mm');
                    data.displayName = user.displayName;
                    data.unit = user.s_unit;
                    await api('post', 'createAccessRecord', data);
                }
            } catch (err) {
                // do nothing
            }
        }
    };

    useEffect(() => {
        const resolveAccessMap = (userAccessMap) => {
            for (let tabId in userAccessMap) {
                if (sidebarMap[tabId].component) {
                    userAccessMap[tabId].component = sidebarMap[tabId].component;
                    userAccessMap[tabId].icon = sidebarMap[tabId].icon;
                }
                const subs = userAccessMap[tabId].subs;
                for (let subId in subs) {
                    if (
                        sidebarMap[tabId].subs[subId] &&
                        sidebarMap[tabId].subs[subId].component
                    ) {
                        userAccessMap[tabId].subs[subId].component =
                            sidebarMap[tabId].subs[subId].component;
                        userAccessMap[tabId].subs[subId].icon =
                            sidebarMap[tabId].subs[subId].icon;
                    }
                    const finalSubs = subs[subId].subs;
                    for (let finalSubId in finalSubs) {
                        if (
                            _.get(
                                sidebarMap,
                                `[${tabId}].subs[${subId}].subs[${finalSubId}].component`,
                                null
                            )
                        ) {
                            userAccessMap[tabId].subs[subId].subs[
                                finalSubId
                            ].component =
                                sidebarMap[tabId].subs[subId].subs[
                                    finalSubId
                                ].component;
                            userAccessMap[tabId].subs[subId].subs[finalSubId].icon =
                                sidebarMap[tabId].subs[subId].subs[finalSubId].icon;
                        }
                    }
                }
            }
            return userAccessMap;
        };

        const getUserPhoto = async (id) => {
            if (id === undefined) {
                return '';
            }
    
            const accessToken = await getAccessToken();
    
            let photo = '';
    
            try {
                const url = `https://graph.microsoft.com/v1.0/users/${id}/photo/$value`;
                const res = await axios(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    responseType: 'arraybuffer',
                });
    
                const _photo = new Buffer(res.data, 'binary').toString('base64');
                photo = _photo;
            } catch (err) {
                console.log(err);
            }
    
            return photo;
        };

        console.log(accounts);
    
        if (
            isAuthenticated &&
            accounts &&
            accounts.length > 0 &&
            !REACT_APP_NO_LOGIN
        ) {
            /* 
                Get the access token here using getAccessToken;
                send the token to the backend to be verified.
                The token could be stored in context to be reused
                and would need to be re-obtained on refresh.
                The api function would need to be modified to
                use the token every time, it would most likely need to 
                turned into a hook.
            */
            const getUserData = async () => {
                const s_email = accounts[0].username;
                const { testRegUser } = props;
                localStorage.setItem('eosUser', s_email);
                if (s_email) {
                    let ipAddress, city, longitude, latitude, is_vpn;
                    try {
                        const ipRes = await axios.get(
                            `https://ipgeolocation.abstractapi.com/v1/?api_key=${process.env.REACT_APP_ABSTRACT_API_KEY}`
                        );
                        if (ipRes.status === 200) {
                            const { ip_address } = ipRes.data;
                            ipAddress = ip_address;
                            longitude = ipRes.data.longitude;
                            latitude = ipRes.data.latitude;
                            city = ipRes.data.city;
                            is_vpn = ipRes.data.is_vpn;
                        }
                    } catch (err) {
                        alert('Error getting IP Address from Abstract API');
                    }

                    if (ipAddress !== undefined) {
                        const res = await api('post', 'userData', {
                            s_email,
                            testRegUser,
                            ipAddress,
                            city,
                            longitude,
                            latitude,
                            is_vpn,
                        });

                        if (res && res.status === 200) {
                            const {
                                user,
                                stations,
                                updates,
                                readingSigns,
                                apiToken,
                                airlineData,
                                accessMap
                            } = res.data;
                            const units = stations.map((s) => s.s_unit);
                            const userUnits = user.s_unit.split(',');
                            user.authorizedUnits =
                                parseInt(user.i_access_level) >= 6
                                    ? units
                                    : userUnits;

                            if (
                                user.i_access_level < 6 ||
                                user.s_unit.length > 5
                            ) {
                                user.s_unit = userUnits[0];
                            }

                            if (user.s_unit === 'HDQ') {
                                setModalLocation(true);
                            }

                            // if (process.env.REACT_APP_NODE_ENV === 'TEST') {
                            //     user.s_unit = 'TEST';
                            // }
                            user.s_destination = user.s_unit.substr(1, 3);
                            user.connectedToBackend = true;
                            user.s_airline_code =
                                user.s_airline_codes[0] || null;
                            user.localAccountId = accounts[0].localAccountId;
                            //user.s_phone_num = s_phone_num;

                            const sharedVaultAccess = _.get(accessMap, ['managers', 'subs', 'sharedPasswords'], null) !== null;
                            user.sharedVaultAccess = sharedVaultAccess;
                            
                            setUser(user);
                            setStations(stations);
                            setUpdates(updates);
                            setReadingSigns(readingSigns);
                            setAccessToken(apiToken);
                            setAirlineData(airlineData);

                            // Get photo
                            const photo = await getUserPhoto(s_email);
                            const copy = { ...user };
                            copy.photo = photo;
                            setUser(copy);

                            setAcessMap(resolveAccessMap(accessMap));
                            setAccessMapAssigned(true);

                            // Save username in localStorage
                            localStorage.setItem(
                                'eosUser',
                                s_email.split('@')[0]
                            );

                            // Create Login AccessRecord:
                            await createAccessRecord(copy);

                            setUserDataLoaded(true);

                            addAccessTokenInterceptor(process.env.REACT_APP_HEADER_AUTH_CODE);
                        } else {
                            history.replace('/error/401');
                        }
                    }
                }
            };
            getUserData();
        }
    }, [isAuthenticated, accounts]);

    useEffect(() => {
        const getUserDataAlt = asyncHandler(async () => {
            const useUnits = ['CEWR1', 'CJFK1', 'CORD1'];
            const s_email = 'byron@choice.aero';
            const { testRegUser } = props;
            user.authorizedUnits = useUnits;
            user.s_unit = 'CEWR1';

            if (user.s_unit === 'HDQ') {
                setModalLocation(true);
            }

            // if (process.env.REACT_APP_NODE_ENV === 'TEST') {
            //     user.s_unit = 'TEST';
            // }
            user.s_destination = user.s_unit.substr(1, 3);
            user.i_access_level = 9;
            user.connectedToBackend = true;
            user.s_airline_code = null;
            user.s_email = 'byron@choice.aero';
            user.displayName = 'Byron';
            user.accessMap = sidebarMap;

            setUser(user);
            setStations(useUnits);
            setUpdates([]);
            setReadingSigns([]);
            setAccessToken('');
            setAirlineData(airlineData);
            setAccessMapAssigned(true);

            // Get photo
            const copy = { ...user };
            setUser(copy);

            // Save username in localStorage
            localStorage.setItem('eosUser', s_email.split('@')[0]);
        });

        if (REACT_APP_NO_LOGIN === true) {
            getUserDataAlt();
            history.push('/EOS/Portal/Profile');
        }
    }, []);

    useEffect(() => {
        const getAppData = async () => {
            const res = await api('post', 'appData', {
                today: moment().local().format('YYYY-MM-DD'),
                s_unit: user.s_unit,
                s_email: user.s_email,
            });

            if (res.status === 200 && res.data) {
                const { commsId, comms, loggedInUsers, charges, menuApps, specialHandlingCodes , changeLogData} =
                    res.data;

                setCommsData(comms);
                setActiveUsers((prev) => {
                    const copy = { ...prev };
                    for (let key in loggedInUsers) {
                        if (!copy[key]) {
                            copy[key] = loggedInUsers[key];
                            copy[key].online = false;
                        }
                    }
                    return copy;
                });
                setUser((prev) => {
                    const copy = { ...prev };
                    copy.commsId = commsId;
                    return copy;
                });
                setMenuApps(menuApps);
                if (charges) {
                    setCharges(charges);
                }
                setChangeLogData(changeLogData);
                setAppDataLoaded(true);
                setShcs(specialHandlingCodes);
            }
        };
        if (userDataLoaded) {
            getAppData();
        }
    }, [user.s_email, user.s_unit, userDataLoaded]);

    useEffect(() => {
        const getSocketUser = (user) => {
            const { displayName, s_email, s_unit, commsId, activeChat } = user;
            const socketUser = {
                    displayName,
                    s_email,
                    s_unit,
                    commsId,
                    activeChat,
                    path: window.location.pathname,
                };
            return socketUser;
        };
        if (user.s_email) {
            socket.emit('addUpdateUser', getSocketUser(user));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.s_email, user.s_unit, window.location.pathname]);

    useEffect(() => {
        const handleInitComms = async (user, commsData) => {
            if (commsData && commsData.token) {
                const id = getIdentifierText(commsData.user);
                await handleLogIn({
                    id,
                    token: commsData.token,
                    displayName: user.displayName,
                    chatToken: commsData.chatToken,
                });
            }
        };
        if (user.commsId && Object.keys(commsData).length > 0) {
            // Init comms:
            handleInitComms(user, commsData);
        }
    }, [user.commsId, commsData]);

    // Import/Export Files:
    const [counterFiles, setCounterFiles] = useState([]);

    const addCounterFile = useCallback((file) => {
        const previousFiles = Object.assign([], counterFiles);
        const index = previousFiles.findIndex((f) => f.guid === file.guid);
        if (index === -1) {
            previousFiles.push(file);
            setCounterFiles(previousFiles);
        }
    }, [counterFiles]);

    const removeCounterFile = useCallback((file) => {
        const filtered = counterFiles.filter((f) => f.guid !== file.guid);
        setCounterFiles(filtered);
    }, [counterFiles]);

    const clearCounterFiles = () => {
        setCounterFiles([]);
    };

    // Modal Loading
    const [loading, setLoading] = useState(false);

    // Socket
    const [activeUsers, setActiveUsers] = useState({});

    useEffect(() => {
        const resolveActiveUsers = (users) => {
            console.log('running resolveActiveUsers');
            const now = moment().format('HH:mm');
            setActiveUsers((prev) => {
                const copy = _.cloneDeep(prev);
                for (let key in copy) {
                    if (!users[key]) {
                        copy[key].online = false;
                        copy[key].status = `Last seen ${now}`;
                    }
                }
    
                for (let key in users) {
                    copy[key] = users[key];
                    copy[key].online = true;
                    copy[key].status = 'Active';
                }
    
                return copy;
            });
        }

        socket.on('users', resolveActiveUsers);

        return () => {
            socket.off('users', resolveActiveUsers);
        };
    }, []);

    const [darkMode, setDarkMode] = useState(false);

    const memoizedValue = useMemo(() => {
        return {
            wiki: {
                wikis,
                setWikis,
                accessLevels,
                setAccessLevels,
                customWikiTitle,
                setCustomWikiTitle,
            },
            counter: {
                counterFiles,
                addCounterFile,
                removeCounterFile,
                clearCounterFiles,
            },
            socket: {
                _socket: {},
                activeUsers,
            },
            comms: {
                callClient,
                callAgent,
                deviceManager,
                loggedIn,
                call,
                incomingCall,
                data: commsData,
                modalComms,
                setModalComms,
                ringIncomingCall,
                handleCallEnd,
                activeChat,
                chatReceived,
                initializeChatThread,
                chatThreadClient,
                chatParticipant,
                lastMsgId,
                endChat,
                chatThreadId,
                chatThreadDeleted,
            },
            searchAwb: {
                modalSearchAwb,
                setModalSearchAwb,
                searchAwbNum,
                setSearchAwbNum,
                searchAwbDataMap,
                setSearchAwbDataMap,
                additionalSearchAwbData,
                setAdditionalSearchAwbData,
                handleSearchAwb,
            },
            logAddNotes: {
                addNotesModal,
                setAddNotesModal,
                showNotes,
                handleAddNotes,
            },
            appData: {
                appDataLoaded,
                menuApps,
                setMenuApps,
                updates,
                setUpdates,
                charges,
                setCharges,
                stations,
                setStations,
                readingSigns,
                setReadingSigns,
                airlineData,
                accessToken,
                shcs,
                changeLogData
            },
            user,
            setUser,
            accessMap,
            accessMapAssigned,
            createSuccessNotification,
            modalLocation,
            setModalLocation,
            displaySubmenu,
            setDisplaySubmenu,
            loading,
            setLoading,
            darkMode,
            setDarkMode,
            signOut,
            setSignOut,
            shcs
        };
    }, [accessLevels, accessMap, accessMapAssigned, accessToken, activeChat, activeUsers, addCounterFile, addNotesModal, additionalSearchAwbData, airlineData, appDataLoaded, call, callAgent, callClient, charges, chatParticipant, chatReceived, chatThreadClient, chatThreadDeleted, chatThreadId, commsData, counterFiles, createSuccessNotification, customWikiTitle, darkMode, deviceManager, displaySubmenu, endChat, handleSearchAwb, incomingCall, initializeChatThread, lastMsgId, loading, loggedIn, menuApps, modalComms, modalLocation, modalSearchAwb, readingSigns, removeCounterFile, ringIncomingCall, searchAwbDataMap, searchAwbNum, showNotes, signOut, stations, updates, user, wikis]);

    return (
        <AppContext.Provider value={memoizedValue}>
            {props.children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('AppContext is missing');
    }
    return context;
};
