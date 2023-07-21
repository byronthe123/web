import React, { useEffect, useState } from 'react';

import { Row, Card } from "reactstrap";
import { Colxx } from '../components/common/CustomBootstrap';
import MenuButton from '../components/login/MenuButton';

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import useBrowser from '../customHooks/useBrowser';

const baseButtons = [{
    title: 'Microsoft 365',
    logoUrl: '/assets/img/365.png',
    link: 'https://www.office.com/?auth=2',
    direct: false
},
{
    title: 'OneDrive',
    logoUrl: '/assets/img/onedrive.png',
    link: 'https://choiceaviationsvc-my.sharepoint.com/',
    direct: false
},
{
    title: 'Mail',
    logoUrl: '/assets/img/outlook.png',
    link: 'https://outlook.office365.com/mail/inbox',
    direct: false
},
{
    title: 'Planner',
    logoUrl: '/assets/img/planner.png',
    link: 'https://tasks.office.com/choice.aero/en-US/Home/Planner/',
    direct: false
},
{
    title: 'Portal',
    logoUrl: '/assets/img/portal.png',
    link: 'https://choiceaviationsvc.sharepoint.com/sites/Portal',
    direct: false
},
{
    title: 'Excel',
    logoUrl: '/assets/img/excel.png',
    link: 'https://www.office.com/launch/excel?auth=2',
    direct: false
},
{
    title: 'Word',
    logoUrl: '/assets/img/word.png',
    link: 'https://www.office.com/launch/word?auth=2',
    direct: false
},
{
    title: 'ADP',
    logoUrl: '/assets/img/adp.png',
    link: 'https://workforcenow.adp.com/workforcenow/login.html',
    direct: false
}];


const Login = (props) => {

    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginPopup(loginRequest);
    }

    const broswer = useBrowser();

    const [menuButtonsArray, setMenuButtonsArray] = useState(baseButtons);

    useEffect(() => {
        const copy = Object.assign([], baseButtons);
        if (broswer === 'Chrome' || process.env.REACT_APP_NODE_ENV === 'TEST') {
            copy.unshift({
                title: 'EOS',
                logoUrl: '/assets/img/eos-logo-icon-1.png',
                link: handleLogin,
                direct: true
            });
        } else {
            copy.unshift({
                title: 'EOS',
                logoUrl: '/assets/img/eos-logo-chrome.jpg',
                link: null,
                direct: true
            });
        }
        setMenuButtonsArray(copy);
    }, [broswer]);

    return (
    <div className='login-2' data-testid={'div-login'}>
        <div className="fixed-background" />
        <div className='login-bg-2' style={{overflowY: 'scroll', overflowX: 'hidden'}}>
            <Row className="h-100">
                <Colxx xxs="12" sm='10' md="10" lg='auto' className="mx-auto my-auto col-login">
                    <Card className="auth-card" style={{borderRadius: '0.75rem', backgroundColor: 'rgba(255,255,255, 1)'}}>
                        <div className="position-relative image-side" style={{backgroundImage: 'url(/assets/img/login.jpg)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', borderRadius: '0.75rem'}}>
                        {/* <div className="position-relative image-side d-flex align-items-center px-0 py-0">
                            <img src={'assets/img/choice-logo.png'} style={{maxWidth: '100%'}} className='px-5' /> */}
                        </div>
                        <div className="form-side">
                            <Row>
                                {
                                    menuButtonsArray.map((m, i) => 
                                        <MenuButton 
                                            title={m.title}
                                            logoUrl={m.logoUrl}
                                            link={m.link}
                                            direct={m.direct}
                                            key={i}
                                            size={4}
                                        />
                                    )
                                }
                            </Row>
                        </div>
                    </Card>
                </Colxx>
            </Row>
        </div>
    </div>
    );
}

export default Login;