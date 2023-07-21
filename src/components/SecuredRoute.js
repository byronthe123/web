import React, { useState, useEffect } from 'react';
import { AppContext } from '../context/index';
import { withRouter } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';
import { useIsAuthenticated } from "@azure/msal-react";

const Loading = () => {
    return (
        <div className='text-center' style={{marginTop: '300px'}}>
            <div className={`pulse-loading mx-auto`} style={{ height: '200px'  }}></div>
        </div>
    );
}

const SecuredRoute = (props) => {

    const isAuthenticated = useIsAuthenticated();

    const {component: Component, path} = props;
    const [renderDisplay, setRenderDisplay] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    setTimeout(() => {
        setIsLoading(false);
    }, 5000);

    useEffect(() => {
        if (path.includes('/Display')) {
            setRenderDisplay(true);
            return;
        }
        if (!isAuthenticated && !props.signOut) {
            props.history.push('/error/401');
        } else if (props.accessMapAssigned) {
            setIsLoading(false);
        }
    }, [path, isLoading, props.history, isAuthenticated, props.accessMapAssigned, props.signOut]);

    if (renderDisplay) {
        return <Component {...props}/>;
    }

    if (props.signOut) {
        return <Loading />
    }

    return (
        <>
            {
                isAuthenticated ? 
                    isLoading ? 
                        <Loading /> :
                        <Component {...props}/> :
                    <h1>NOT AUTHORIZED</h1>
            }
        </>
    );
}

export default withRouter(SecuredRoute);