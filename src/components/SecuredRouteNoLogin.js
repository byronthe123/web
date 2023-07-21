import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

const SecuredRoute = (props) => {

    const isAuthenticated = true;

    const {component: Component, path} = props;
    const [authorized, setAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    setTimeout(() => {
        setIsLoading(false);
    }, 20000);

    useEffect(() => {
        setIsLoading(false);
        setAuthorized(true);
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