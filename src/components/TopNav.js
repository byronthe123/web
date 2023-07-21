import React, { useState, useEffect, useContext } from "react";
import { AppContext } from '../context/index';
import ReactTooltip from 'react-tooltip';
import Cleave from 'cleave.js/react';
import moment from 'moment';
import { asyncHandler, validateAwb, notify } from '../utils';
import ModalWiki from './ModalWiki';
import classnames from 'classnames';
import { api } from "../utils";
import packageInfo from '../../package.json';

import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Input
} from "reactstrap";

import {
    useWindowSize,
} from '@react-hook/window-size'

import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import ModalReportBug from '../components/ModalReportBug';
import ModalAppsMenu from '../components/appsMenu/ModalAppsMenu';
import TopnavDarkSwitch from '../components/TopnavDarkSwitch';
import ModalBombThreat from './misc/bombTreatReport/ModalBombThreat';
import useBrowser from '../customHooks/useBrowser';

import {
  setContainerClassnames,
  clickOnMobileMenu,
  changeLocale
} from "../redux/actions";

import { MobileMenuIcon, MenuIcon } from "../components/svg";

import { useMsal } from "@azure/msal-react";
import useLoading from "../customHooks/useLoading";
import { Button } from "reactstrap";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import { passwordManagerState } from "./passwordManager";

const baseApiUrl = process.env.REACT_APP_BASE_API_URL;
const headerAuthCode = process.env.REACT_APP_HEADER_AUTH_CODE;
const version = packageInfo.version;

const TopNav = (props) => {

    const { instance } = useMsal();
    const { 
        history, 
        containerClassnames, 
        menuClickCount, 
        selectedMenuHasSubItems, 
        setContainerClassnamesAction, 
        broadcastUpdate,
        setViewChangeLog
    } = props && props; 
    const { 
        user,
        wiki, 
        setModalLocation, 
        setDisplaySubmenu, 
        comms, 
        appData: { airlineData },
        searchAwb,
        darkMode,
        setDarkMode,
        setSignOut,
        logAddNotes
    } = useContext(AppContext);

    const {
        setModalSearchAwb,
        searchAwbNum, 
        setSearchAwbNum,
        searchAwbDataMap,
        setSearchAwbDataMap,
        setAdditionalSearchAwbData,
        handleSearchAwb
    } = searchAwb;

    const { handleAddNotes } = logAddNotes;

    const { customWikiTitle, setCustomWikiTitle } = wiki;
    const [isInFullScreen, setIsFullScreen] = useState(false);
    const [modalBugReportingOpen, setModalBugReportingOpen] = useState(false);
    const [modalAppsMenuOpen, setModalAppsMenuOpen] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [width, height] = useWindowSize();
    const [submittingBug, setSubmittingBug] = useState(false);
    const [wikiTitle, setWikiTitle] = useState('');
    const [modalBombThreat, setModalBombThreat] = useState(false);
    const { setModalComms, ringIncomingCall, loggedIn } = comms;
    const [airlineLogo, setAirlineLogo] = useState('');
    const { setLoading } = useLoading();

    useEffect(() => {
        if (user && user.displayName) {
            const { displayName } = user;
            const names = displayName.split(' ');
            if (names.length > 0) {
                setFirstName(names[0]);
            }
        }
    }, [user]);

    const checkIsInFullScreen = () => {
        return (
          (document.fullscreenElement && document.fullscreenElement !== null) ||
          (document.webkitFullscreenElement &&
            document.webkitFullscreenElement !== null) ||
          (document.mozFullScreenElement &&
            document.mozFullScreenElement !== null) ||
          (document.msFullscreenElement && document.msFullscreenElement !== null)
        );
    };

    const toggleFullScreen = () => {
        const isInFullScreen = checkIsInFullScreen();
    
        var docElm = document.documentElement;
        if (!isInFullScreen) {
          if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
          } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
          } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
          } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
        setIsFullScreen(!isInFullScreen);
    };

    const reportBug = asyncHandler(async(data) => {
        const payment = data.selectedBugType === 'PAYMENT';
        data.subject = `${payment ? 'PAYMENT ' : ''}BUG: ${history.location.pathname.replace('/EOS/', '')} at ${moment().local().format('MM/DD/YYYY HH:mm:ss')} by ${user.s_email}`;
        data.submittedBy = firstName;
        data.unit = user.s_unit;

        setSubmittingBug(true);

        const res = await api('post', 'reportBug', { data });
        
        setSubmittingBug(false);

        if (res.status === 200) {
            setModalBugReportingOpen(false);
            notify('Bug reported, thank you.');
        }
    })

    const menuButtonClick = (e, _clickCount, _conClassnames) => {
        e.preventDefault();
    
        setTimeout(() => {
          const event = document.createEvent('HTMLEvents');
          event.initEvent('resize', false, false);
          window.dispatchEvent(event);
        }, 350);
        setContainerClassnamesAction(
          _clickCount + 1,
          _conClassnames,
          selectedMenuHasSubItems
        );
        if (_clickCount === 0) {
            setDisplaySubmenu(false);
        } else if (_clickCount === 3) {
            setDisplaySubmenu(true);
        }
    };
    
    const clickOnMobileMenu = () => {
        const currentClasses = document.getElementById('app-container').classList;
        if (currentClasses.value.includes('main-hidden')) {
            document.getElementById('app-container').classList.remove('main-hidden');
        } else {
            document.getElementById('app-container').classList.add('main-hidden');
        }
    };

    const browser = useBrowser();
    const isChrome = browser === 'Chrome';

    const isMobile = width <= 600;

    const [modalWiki, setModalWiki] = useState(false);
    
    useEffect(() => {
        setCustomWikiTitle(null);
        if (history.location.pathname) {
            setWikiTitle(history.location.pathname.replace('/EOS/', '').toUpperCase());
        }
    }, [history.location]);

    useEffect(() => {
        if (customWikiTitle && customWikiTitle.length > 0) {
            setWikiTitle(customWikiTitle);
            setModalWiki(true);
        }
    }, [customWikiTitle]);

    useEffect(() => {
        if (!modalWiki) {
            setCustomWikiTitle(null);
        }
    }, [modalWiki]);

    const handleLogout = () => {
        setSignOut(true);
        instance.logout();
        localStorage.clear();
    }

    useEffect(() => {
        if (airlineData && airlineData.length > 0) {
            const airline = airlineData.find(a => a.s_airline_code === user.s_airline_code);
            setAirlineLogo(airline.s_logo);
        } else {
            setAirlineLogo('/assets/img/choice-logo.png');
        }
    }, [airlineData, user.s_airline_code]);

    const invalidSearchMawb = searchAwbNum.length > 0 && !validateAwb(searchAwbNum);

    let REACT_APP_NO_LOGIN;
    try {
        REACT_APP_NO_LOGIN = JSON.parse(process.env.REACT_APP_NO_LOGIN || false);
    } catch (err) {};

    const setOpenVault = useSetRecoilState(passwordManagerState);

    const managePasswords = () => setOpenVault(true);

    return (
        <nav className="navbar fixed-top py-0" style={{height: '75px'}} data-testid={'component-top-nav'}>
            <div className="d-flex align-items-center navbar-left">
                <ReactTooltip />
                <NavLink
                    to="#"
                    location={{}}
                    className="menu-button d-none d-md-block"
                    onClick={e =>
                        menuButtonClick(e, menuClickCount, containerClassnames)
                    }
                >
                    <MenuIcon />
                </NavLink>
                {
                    !isMobile && 
                    <div className="header-icons d-inline-block align-middle mr-4" data-tip={user.connectedToBackend ? 'Connected': 'Connecting'}>
                        <i className={`ml-4 fad fa-database ${user.connectedToBackend ? 'text-success' : 'text-danger'}`} style={{ fontSize: '24px' }}></i> 
                    </div>
                }
                {/* <div className="header-icons d-inline-block align-middle hover-title" data-tip='Comms'>
                    <i className={classnames(`fad mx-2`, loggedIn ? 'fa-phone text-success' : 'fa-phone-slash text-danger', { 'pulse': ringIncomingCall })} style={{ fontSize: '24px' }} onClick={() => loggedIn && setModalComms(true)}/>
                </div> */}
                {
                    width > 1080 && 
                    <div className="header-icons d-inline-block align-middle">
                        <i className={'fad fa-question text-success'} style={{ fontSize: '24px' }} onClick={() => setModalWiki(true)} data-tip={'Wiki'} />
                    </div>
                }
                <div className="d-inline-block mx-2" style={{fontSize: '14px'}}>
                    <div className="header-icons d-inline-block align-middle hover-title" data-tip={'Apps'}>
                        <i className="fad fa-grip-horizontal mx-2 text-success" onClick={() => setModalAppsMenuOpen(true)} style={{ fontSize: '24px' }}></i>
                    </div>
                </div>
                <Button onClick={() => setViewChangeLog(true)}>
                    {version}
                </Button>
                {
                    broadcastUpdate &&
                    <div className="d-inline-block mx-2" style={{fontSize: '14px'}}>
                        <div className="header-icons d-inline-block align-middle hover-title" data-tip={'Click to Update'}>
                            <UpdateBroadcastBtn 
                                className={'pulse'}     
                                onClick={() => window.location.href = window.location.href.replace(/#.*$/, '')}
                            >
                                Update Now
                            </UpdateBroadcastBtn>
                        </div>
                    </div>
                }
                {
                    REACT_APP_NO_LOGIN ? 'NO LOGIN' : ''
                }
            </div>
            <a className="navbar-logo" href="/" style={{marginTop: '0px', bottom: '27px', width: '420px'}}>
                <img src='/assets/img/eos-logo-1.png' style={{height: '50px', width: 'auto', display: 'inline'}} className={'mr-3'}></img>
                <img src={airlineLogo} style={{height: '50px', width: 'auto', display: 'inline'}}></img>
            </a>

            <div className="navbar-right">
                {/* <TopnavDarkSwitch/> */}   
                {
                    !isMobile && 
                    <div className='d-inline-block align-middle'>
                        <div className="d-inline-block mr-5">
                            <div className="header-icons d-inline-block align-middle hover-title" data-tip={''}>
                                <form onSubmit={(e) => handleSearchAwb(e)}>
                                    <Cleave 
                                        placeholder=''
                                        options={{
                                            delimiter: '-',
                                            blocks: [3, 4, 4],
                                            numericOnly: true
                                        }} 
                                        onChange={e => setSearchAwbNum(e.target.rawValue)}
                                        value={searchAwbNum}
                                        className={`search-awb-input`}
                                        style={{ width: '150px', border: invalidSearchMawb ? '2px solid red' : ''  }}
                                        
                                    />
                                    <i className={`fad fa-search search-awb-icon ${invalidSearchMawb ? 'text-danger' : 'text-success'}`} onClick={() => handleSearchAwb(null)} style={{ fontSize: '24px' }}></i>
                                </form>
                            </div>
                        </div>
                        <div className="d-inline-block">
                            <div className="header-icons d-inline-block align-middle hover-title" data-tip={'Add Notes'}>
                                <i onClick={() => handleAddNotes(true)} className="fa-solid fa-memo-pad text-success" style={{ fontSize: '24px' }}></i>
                            </div>
                        </div>
                        <div className="d-inline-block">
                            <div className="header-icons d-inline-block align-middle hover-title" data-tip={'Report Bug'}>
                                <i onClick={() => setModalBugReportingOpen(true)} className="fad fa-bug mx-2" style={{ fontSize: '24px', "--fa-primary-color": "#c90202", "--fa-secondary-color": "black"  }}></i>
                            </div>
                        </div>
                        <div className="d-inline-block" style={{fontSize: '14px'}}>
                            <div className="header-icons d-inline-block align-middle" data-tip={'Email'}>
                            <a href='https://outlook.office.com/mail/inbox' target='blank'>
                                <i className="fad fa-envelope text-success" style={{ fontSize: '24px' }}></i>
                                <span style={{position: 'absolute', bottom: '21px'}}>{user.unreadEmailCount}</span>
                            </a>
                            </div>
                        </div>
                        <div className="d-inline-block ml-2" style={{fontSize: '14px'}}>
                            <div className="header-icons d-inline-block align-middle" data-tip={'Passwords'}>
                                <i className="fa-duotone fa-vault text-success" onClick={managePasswords} style={{ fontSize: '24px' }}></i>
                            </div>
                        </div>
                    </div>
                }

                <div className="user mx-2 d-inline-block">
                    <UncontrolledDropdown className="dropdown-menu-right">
                        <DropdownToggle className="p-0" color="empty" data-testid={'top-nav-drop-down'}>
                            <img style={{borderRadius: '50%', height: '40px', width: 'auto'}} src={user && user.photo && user.photo !== null ? `data:image/jpeg;base64,${user.photo}` : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'} />
                        </DropdownToggle>
                        <DropdownMenu className="mt-3" right data-testid={'top-nav-drop-down-menu'}>
                            <DropdownItem>
                                {firstName}
                            </DropdownItem>
                            <DropdownItem onClick={() => setModalLocation(true)}>
                                {user.s_unit} { user.b_airline && ` - ${user.s_airline_code}` }
                            </DropdownItem>
                            <NavLink
                                to="/EOS/Portal/SiteMap"
                                location={{}}
                            >
                                <DropdownItem>
                                    Site Map
                                </DropdownItem>
                            </NavLink>
                            <DropdownItem onClick={() => setModalBombThreat(true)} className={'text-danger'} data-testid={'btn-bomb-threat'}>
                                Bomb Threat
                            </DropdownItem>
                            <DropdownItem onClick={() => handleLogout()}>
                                Sign out
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            </div>
            <ModalReportBug 
                open={modalBugReportingOpen}
                handleModal={setModalBugReportingOpen}
                reportBug={reportBug}
                history={history}
                submittingBug={submittingBug}
                setCustomWikiTitle={setCustomWikiTitle}
            />
            <ModalWiki 
                modal={modalWiki}
                setModal={setModalWiki}
                user={user}
                baseApiUrl={baseApiUrl}
                headerAuthCode={props.headerAuthCode}
                wikiTitle={wikiTitle}
            />
            <ModalAppsMenu 
                modal={modalAppsMenuOpen}
                setModal={setModalAppsMenuOpen}
            />
            <ModalBombThreat 
                modal={modalBombThreat}
                setModal={setModalBombThreat}
                user={user}
                baseApiUrl={baseApiUrl}
                headerAuthCode={headerAuthCode}
                notify={notify}
            />
        </nav>
    );
}
const mapStateToProps = ({ menu, settings }) => {
    const { containerClassnames, menuClickCount, selectedMenuHasSubItems } = menu;
    const { locale } = settings;
    return {
      containerClassnames,
      menuClickCount,
      selectedMenuHasSubItems,
      locale,
    };
};

const UpdateBroadcastBtn = styled.button`
    color: black;
    background-color: gold;
    animation: pulse 1s infinite;
    border-radius: 25px;
    border: none;

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0px rgba(249,213,4, 1);
        }

        100% {
            box-shadow: 0 0 0 30px rgba(249,213,4, 0);
        }
    }
`;

export default (
    connect(mapStateToProps, {
      setContainerClassnamesAction: setContainerClassnames,
      clickOnMobileMenuAction: clickOnMobileMenu,
      changeLocaleAction: changeLocale,
    })(TopNav)
  );