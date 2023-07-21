import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from 'framer-motion';

import { useAppContext } from "../../context";
import { IActiverUsers, IActiveUser, IMap } from "../../globals/interfaces";
import ActiveUser from "../counter/queue/ActiveUser";

const exclude: IMap<boolean> = {
    '/EOS/Portal/Profile': true,
    '/EOS/Operations/Counter/Queue': true
}

export default function ActiveUsersFooter () {
    const { user, socket, appData: { accessToken } } = useAppContext();
    const activeUsers: IActiverUsers = socket.activeUsers;    
    const [open, setOpen] = useState(true);

    const displayUsers: Array<IActiveUser> = [];

    for (const key in activeUsers) {
        const current = activeUsers[key];
        if (current.online && 
            current.s_unit === user.s_unit &&
            current.path === window.location.pathname && 
            current.s_email !== user.s_email
        ) {
            displayUsers.push(current);
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
            }, 7000);
        }, 1000); 
    }, []);

    if (exclude[window.location.pathname] === true) {
        return null;
    }

    return (
        <AnimatePresence>
            {
                open && (
                    <Container
                        as={motion.div}
                        initial={{ y: 100 }}
                        animate={{ y: -35  }}
                        exit={{ y: 100 }}
                        numUsers={displayUsers.length}
                    >
                        <UsersContainer>
                            <UsersText>{displayUsers.length}</UsersText>
                            <AddTextContainer>
                                <p>user{displayUsers.length === 1 ? '' : 's'}</p>
                                <p>here</p>
                            </AddTextContainer>
                        </UsersContainer>
                        {
                            displayUsers.map(user => (
                                <ActiveUser 
                                    user={user} 
                                    accessToken={accessToken}
                                    processingAgentsMap={{}}
                                    showName={false}
                                    customColor={'grey'}
                                    // customWidth={50}
                                />
                            ))
                        }
                    </Container>
                )   
            }
        </AnimatePresence>
    );
}

const Container = styled.div<{numUsers: number}>`
    display: flex;
    /* justify-content: center; */
    align-items: center;
    height: ${p => p.numUsers > 0 ? 'fit-content' : '75px'};
    width: 100%;
    background-color: white;
    box-shadow: 0 1px 15px rgb(0 0 0 / 4%), 0 1px 6px rgb(0 0 0 / 4%);
`;

const UsersContainer = styled.div`
    display: flex;
    padding-right: 15px;
    align-items: center;
`;

const UsersText = styled.h1`
    font-size: 42px;
    margin: 0;
    padding: 0;
`;

const AddTextContainer = styled.div`
    p {
        margin: 0;
    }
`;