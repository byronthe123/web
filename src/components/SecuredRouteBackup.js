import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/index';
import { withRouter } from 'react-router-dom';
import { useIsAuthenticated } from "@azure/msal-react";

const SecuredRoute = (props) => {

    const isAuthenticated = useIsAuthenticated();

    const {component: Component, path} = props;
    const [authorized, setAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    setTimeout(() => {
        setIsLoading(false);
    }, 20000);

    useEffect(() => {
        const checkAuthorization = (accessTabs, path) => {
            const pathParts = path.split('/');
            const tab = pathParts[2].toUpperCase();
            return accessTabs.includes(tab);
        }

        if (props.user.accessTabs) {
            setIsLoading(false);
            setAuthorized(checkAuthorization(props.user.accessTabs, path));
        }
    }, [props.user.accessTabs, path]);

    useEffect(() => {
        if (!isAuthenticated || (!authorized && !isLoading)) {
            props.history.push('/error/401');
        }
    }, [path, authorized, isLoading, props.history, isAuthenticated]);

    return (
        <>
            {
                isAuthenticated ? 
                    isLoading ? 
                        <div className='text-center' style={{marginTop: '300px'}}>
                            <div className={`spinner-loading mx-auto`} style={{ height: '200px'  }}></div>
                        </div> :
                        <Component {...props}/> :
                    <h1>NOT AUTHORIZED</h1>
            }
        </>
    );
}

export default withRouter(SecuredRoute);