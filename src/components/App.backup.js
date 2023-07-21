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
import routes from './routes';

//Other Views
import Video from './views/Video';
import ViewError from './views/error';

import CacheBuster from 'react-cache-buster';
import packageInfo from '../package.json';
import Loading from './components/misc/Loading';

import Approvals from './views/Approvals';

const version = packageInfo.version;

export default function App () {

    const isAuthenticated = useIsAuthenticated();
    const baseApiUrl = process.env.REACT_APP_BASE_API_URL;
    const headerAuthCode = process.env.REACT_APP_HEADER_AUTH_CODE;

    const { 
        user, 
        setUser,
        units,
        createSuccessNotification
    } = useContext(AppContext);

    return (
        <CacheBuster
            currentVersion={version}
            isEnabled={true} //If false, the library is disabled.
            isVerboseMode={false} //If true, the library writes verbose logs to console.
            loadingComponent={<Loading />} //If not pass, nothing appears at the time of new version check.
        >
            <Switch>
                <Route exact path='/'>
                    {
                        isAuthenticated ?
                            <Redirect to="/EOS/Portal/Profile" /> :
                            <Login />
                    }
                </Route>
                {
                    routes.map(
                        category => category.subs.map(
                            sub => sub.values ?
                                sub.values.map(
                                    route => 
                                        <SecuredRouter 
                                            path={`/EOS/${category.name}/${sub.name}/${route.id}`}
                                            component={route.component}
                                            manager={route.manager ? route.manager : false}                    
                                            isAuthenticated={isAuthenticated}
                                            user={user}
                                            setUser={setUser}
                                            units={units}
                                            baseApiUrl={baseApiUrl}
                                            headerAuthCode={headerAuthCode}
                                            createSuccessNotification={createSuccessNotification}
                                            eightyWindow={() => false}
                                            mobile={false}
                                            width={1800}
                                        />
                                ) :
                                <SecuredRouter 
                                    path={`/EOS/${category.name}/${sub.id}`}
                                    component={sub.component}
                                    manager={sub.manager ? sub.manager : false}                    
                                    isAuthenticated={isAuthenticated}
                                    user={user}
                                    setUser={setUser}
                                    units={units}
                                    baseApiUrl={baseApiUrl}
                                    headerAuthCode={headerAuthCode}
                                    createSuccessNotification={createSuccessNotification}
                                    eightyWindow={() => false}
                                    mobile={false}
                                    width={1800}
                                />

                        )
                    )
                }

                <Route exact path='/approve'>
                    <Approvals />
                </Route>

                <Route
                    component={ViewError}
                />
                
            </Switch>
        </CacheBuster>
    );
}

