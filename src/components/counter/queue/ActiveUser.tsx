/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col } from 'reactstrap';
import ReactTooltip from 'react-tooltip';
import { Buffer } from 'buffer';
import styled from 'styled-components';

import counterPaths from './counterPaths';
import { IActiveUser } from '../../../globals/interfaces';
import { ProcessingAgentsMap } from './interfaces';

interface ActiveUserProps {
    user: IActiveUser;
    accessToken: string;
    processingAgentsMap: ProcessingAgentsMap;
    showName: boolean;
    customWidth?: number;
    customColor?: string;
    darkMode?: boolean;
}

const ActiveUser = ({
    user,
    accessToken,
    processingAgentsMap,
    showName,
    customWidth,
    customColor,
    darkMode,
}: ActiveUserProps) => {

    const pathParts = (user.path || '').split('/');
    const dataTip = `${(user.displayName || ' ').split(' ')[0]}, ${
        pathParts[pathParts.length - 1]
    }`;
    const onCounter = counterPaths[user.path];
    const color = (customColor !== undefined)
        ? customColor
        : user.online && onCounter && !processingAgentsMap[user.s_email]
        ? 'green'
        : user.online && (processingAgentsMap[user.s_email] || !onCounter)
        ? 'red'
        : 'grey';

    if (user) {
        return (
            <div className="d-inline pt-2" style={{ maxWidth: '56px' }}>
                <ReactTooltip />
                <Row data-tip={dataTip}>
                    {showName ? (
                        <>
                            <Col md={3}>
                                <div
                                    style={{
                                        ...styles.dot,
                                        backgroundColor: color,
                                    }}
                                ></div>
                            </Col>
                            <Col
                                md={9}
                                className={
                                    darkMode ? 'text-light' : 'text-dark'
                                }
                            >
                                {(user.displayName || ' ').split(' ')[0]}
                            </Col>
                        </>
                    ) : (
                        <Col md={12}>
                            <Photo
                                user={user}
                                accessToken={accessToken}
                                color={color}
                                customWidth={customWidth}
                            />
                        </Col>
                    )}
                </Row>
            </div>
        );
    }

    return null;
};

const styles = {
    dot: {
        height: 10,
        width: 10,
        borderRadius: '50%',
    },
};

interface PhotoProps {
    user: IActiveUser;
    accessToken: string;
    color: string;
    customWidth?: number;
}

const Photo = ({ user, accessToken, color, customWidth }: PhotoProps) => {
    const [initialRun, setInitialRun] = useState(false);
    const [photo, setPhoto] = useState<string | null>(null);

    useEffect(() => {
        const getUserPhoto = () => {
            const url = `https://graph.microsoft.com/v1.0/users/${user.s_email}/photo/$value`;
            axios(url, {
                headers: { Authorization: `Bearer ${accessToken}` },
                responseType: 'arraybuffer',
            })
                .then((response) => {
                    const photo = new Buffer(response.data, 'binary').toString(
                        'base64'
                    );
                    setPhoto(photo);
                    setInitialRun(true);
                })
                .catch((error) => {
                    setInitialRun(true);
                });
        };
        if (user.s_email && accessToken && !initialRun) {
            getUserPhoto();
        }
    }, [user, accessToken, initialRun]);

    return (
        <Container
            borderColor={color}
            customWidth={customWidth}
        >
            <Img
                src={
                    photo
                        ? `data:image/jpeg;base64, ${photo}`
                        : require('../../../assets/img/head-side.jpg')
                }
                borderColor={color}
                customWidth={customWidth}
            />
        </Container>
    );
};

interface CssProps {
    borderColor: string; 
    customWidth?: number;
}

const Container = styled.div<CssProps>`
    width: ${(p) => p.customWidth ? `${p.customWidth}px` : '75px'};
    height: ${(p) => p.customWidth ? `${p.customWidth}px` : '75px'};
    /* width: 75px;
    height: 75px; */
    border: 5px solid ${(p) => p.borderColor};
    border-radius: 50%;
    overflow: hidden;
`;

const Img = styled.img<CssProps>`
    max-width: 100%;
    max-height: 100%;
`;

const InitialContainer = styled.div<CssProps>`
    background-color: white;
    /* line-height: ${(p) => `${p.customWidth}px` || '75px'};
    font-size: 45px; */
    text-align: center;
`;

export default ActiveUser;
