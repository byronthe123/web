import React, { useContext } from 'react';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import Login from './views/Login';

// MSAL
import { useIsAuthenticated } from "@azure/msal-react";

import SecuredRouter from './components/SecuredRouter';
import { AppContext } from './context/index';

//Other Views
import Video from './views/Video';
import ViewError from './views/error';

import CacheBuster from 'react-cache-buster';
import packageInfo from '../package.json';
import Loading from './components/misc/Loading';

import Approvals from './views/Approvals';
import _ from 'lodash';

import SiteMap from './views/portal/SiteMap';

const version = packageInfo.version;

export const FragmentSupportingSwitch = ({children}) => {
    const flattenedChildren = [];
    flatten(flattenedChildren, children);
    return React.createElement.apply(React, [Switch, null].concat(flattenedChildren));
  }
  
  function flatten(target, children) {
    React.Children.forEach(children, child => {
      if (React.isValidElement(child)) {
        if (child.type === React.Fragment) {
          flatten(target, child.props.children);
        } else {
          target.push(child);
        }
      }
    });
  }

export default function App () {

    const isAuthenticated = useIsAuthenticated();
    const baseApiUrl = process.env.REACT_APP_BASE_API_URL;
    const headerAuthCode = process.env.REACT_APP_HEADER_AUTH_CODE;

    const { 
        user, 
        setUser,
        units,
        createSuccessNotification,
        accessMap,
        accessMapAssigned,
        signOut
    } = useContext(AppContext);

    return (
        <CacheBuster
            currentVersion={version}
            isEnabled={true} //If false, the library is disabled.
            isVerboseMode={false} //If true, the library writes verbose logs to console.
            loadingComponent={<Loading />} //If not pass, nothing appears at the time of new version check.
        >
            <Switch>
                <FragmentSupportingSwitch>
                    <Route exact path='/'>
                        {
                            isAuthenticated ?
                                <Redirect to="/EOS/Portal/Profile" /> :
                                <Login />
                        }
                    </Route>
                    {
                        accessMap && Object.keys(accessMap).map(tabId => (
                            Object.keys(_.get(accessMap[tabId], 'subs', {})).map(subId => (
                                <>
                                    {
                                        accessMap[tabId].subs && accessMap[tabId].subs[subId].component &&
                                            <SecuredRouter 
                                                key={accessMap[tabId].subs[subId].id}
                                                path={accessMap[tabId].subs[subId].to}
                                                component={accessMap[tabId].subs[subId].component}
                                                manager={accessMap[tabId].subs[subId].manager}                    
                                                isAuthenticated={isAuthenticated}
                                                user={user}
                                                setUser={setUser}
                                                units={units}
                                                accessMapAssigned={accessMapAssigned}
                                                signOut={signOut}
                                                baseApiUrl={baseApiUrl}
                                                headerAuthCode={headerAuthCode}
                                                createSuccessNotification={createSuccessNotification}
                                                eightyWindow={() => false}
                                                mobile={false}
                                                width={1800}
                                            />
                                    }
                                    {
                                        (accessMap[tabId].subs && accessMap[tabId].subs[subId].subs) && Object.keys(accessMap[tabId].subs[subId].subs).map(finalSubId => (
                                                accessMap[tabId].subs[subId].subs[finalSubId].component &&
                                                    <SecuredRouter 
                                                        key={accessMap[tabId].subs[subId].subs[finalSubId].id}
                                                        path={accessMap[tabId].subs[subId].subs[finalSubId].to}
                                                        component={accessMap[tabId].subs[subId].subs[finalSubId].component}
                                                        manager={accessMap[tabId].subs[subId].subs[finalSubId].manager}                    
                                                        isAuthenticated={isAuthenticated}
                                                        user={user}
                                                        setUser={setUser}
                                                        units={units}
                                                        accessMapAssigned={accessMapAssigned}
                                                        signOut={signOut}
                                                        baseApiUrl={baseApiUrl}
                                                        headerAuthCode={headerAuthCode}
                                                        createSuccessNotification={createSuccessNotification}
                                                        eightyWindow={() => false}
                                                        mobile={false}
                                                        width={1800}
                                                    />
                                        ))
                                    }
                                </>
                            ))
                        ))
                    }

                    <Route exact path='/approve'>
                        <Approvals />
                    </Route>

                    <Route exact path='/EOS/Portal/SiteMap'>
                        <SiteMap />
                    </Route>

                    <Route
                        component={ViewError}
                    />
                </FragmentSupportingSwitch>
            </Switch>
        </CacheBuster>
    );
}

