import React, { useContext, useEffect, useState } from "react";
import { AppContext } from '../context/index';
import { connect } from "react-redux";
import { withRouter} from "react-router-dom";
import classnames from 'classnames';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion'; 


import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import ModalConfirmLocation from '../components/ModalConfirmLocation';
import ModalLoading from '../components/custom/ModalLoading';
import ModalComms from './comms/ModalComms';
import ModalSearchAwb from './searchAwb/index';
import Chat from './comms/Chat';
import LogAddNotes from "./logNotes/LogAddNotes";
import { socket } from '../context/socket';
import { notify } from "../utils";
import ActiveUsersFooter from "./activeUsersFooter";
import ModalConfirmation from "./custom/ModalConfirmation";
import ViewChangeLog from "./ViewChangeLog";
import PasswordManager from "./passwordManager";

const AppLayout = (props) => {

    const { 
        user, 
        setUser, 
        displaySubmenu,
        setDisplaySubmenu, 
        modalLocation, 
        setModalLocation,
        loading, 
        setLoading,
        appData: { readingSigns },
        accessMap,
        accessMapAssigned,
        darkMode
    } = useContext(AppContext);

    const { path, containerClassnames, history, children, width, padding } = props;

    const [broadcastUpdate, setBroadcastUpdate] = useState(false);
    const [viewChangeLog, setViewChangeLog] = useState(false);

    useEffect(() => {
        const socketBroadcast = (message, update) => {
            notify(message.toUpperCase(), 'info');
            if (update) {
                setBroadcastUpdate(true);
            }
        }
        socket.on('broadcast', socketBroadcast);
        return () => {
            socket.off('broadcast', socketBroadcast);
        }
    }, []);

    return (
        <div id="app-container" className={containerClassnames} style={{ padding }}>
            <TopNav 
                path={path} 
                history={history} 
                user={user} 
                setModalLocation={setModalLocation} 
                handleDisplaySubmenu={setDisplaySubmenu} 
                width={width} 
                broadcastUpdate={broadcastUpdate}
                setViewChangeLog={setViewChangeLog}
            />
            <Sidebar 
                user={user} 
                readingSigns={readingSigns} 
                handleDisplaySubmenu={setDisplaySubmenu} 
                darkMode={darkMode}
                accessMap={accessMap}
                accessMapAssigned={accessMapAssigned}
            />
            <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: 100 }}
            >
                <main className={'main-container'} style={{margin: `75px 0px 0px 120px`, overflowY: 'hidden'}}>
                    <div className={classnames(`container-fluid`, { 'reduced-width': displaySubmenu })} style={{overflowY: 'hidden'}}>
                        {children}
                    </div>
                    <ActiveUsersFooter />
                </main>
            </motion.div>
            <ModalConfirmLocation 
                open={modalLocation}
                handleModal={setModalLocation}
                user={user}
                setUser={setUser}
                units={user.authorizedUnits}
            />
            <ModalLoading 
                modal={loading}
                setModal={setLoading}
            />
            <ModalComms />
            <ModalSearchAwb />
            <Chat />
            <LogAddNotes />
            <ToastContainer />
            <ViewChangeLog 
                modal={viewChangeLog}
                setModal={setViewChangeLog}
            />
            <PasswordManager />
        </div>
    );
}

const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

const mapActionToProps={}

export default withRouter(connect(
  mapStateToProps,
  mapActionToProps
)(React.memo(AppLayout)));
