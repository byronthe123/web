import React, { useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import "rc-switch/assets/index.css";

import {Row, Col} from 'reactstrap';

import AppLayout from '../../components/AppLayout';
import WikiComponent from '../../components/portal/WikiComponent';

const Wiki = ({
    user, authButtonMethod, baseApiUrl, headerAuthCode, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, createSuccessNotification, eightyWindow, width
}) => {

    const history = useHistory();

    const [wikiId, setWikiId] = useState('');

    useEffect(() => {
        console.log(history.location.search);
        const id = history.location.search && history.location.search.split('=')[1];
        console.log(`id = ${id}`);
        setWikiId(id);
    }, []);

    return (
        <AppLayout user={user} authButtonMethod={authButtonMethod} baseApiUrl={baseApiUrl} headerAuthCode={headerAuthCode} launchModalChangeLocation={launchModalChangeLocation} handleDisplaySubmenu={handleDisplaySubmenu}>
            <div className={`card queue-card-container`} style={{backgroundColor: '#f8f8f8', height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                <div className="card-body mb-5 px-1 py-1">
                    <Row className='px-3 py-3'>
                        <Col md={12}>
                            <WikiComponent 
                                user={user}
                                baseApiUrl={baseApiUrl}
                                headerAuthCode={headerAuthCode}
                                wikiTitle={null}
                                wikiId={wikiId}
                                edit={true}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </AppLayout>
    );
}

export default withRouter(Wiki);