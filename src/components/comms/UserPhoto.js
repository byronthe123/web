import React, {useState, useEffect} from 'react';
import axios from 'axios';
import classnames from 'classnames';
import {Buffer} from 'buffer';

export default function UserPhoto ({
    user,
    accessToken,
    fontSize,
    width,
    className,
    useChatPhoto,
    chatPhoto,
    setChatPhoto
}) {

    const [photo, setPhoto] = useState(useChatPhoto ? chatPhoto : null);
    const [attempt, setAttempt] = useState(false);

    useEffect(() => {
        const getUserPhoto = () => {
            const url = `https://graph.microsoft.com/v1.0/users/${user.s_email}/photo/$value`;
            axios(url, { headers: { Authorization: `Bearer ${accessToken}` }, responseType: 'arraybuffer' })
                .then(response => {
                    const photo = new Buffer(response.data, 'binary').toString('base64');
                    setPhoto(photo);
                    if (useChatPhoto) {
                        setChatPhoto(photo);
                    }
                }).catch(error => {
                    console.log(error);
                });
        }

        if (useChatPhoto && chatPhoto && chatPhoto.length > 0) {
            setPhoto(chatPhoto);
        } else if (user.s_email && accessToken && !attempt) {
            setAttempt(true);
            getUserPhoto();
        }
    }, [user, accessToken, attempt, useChatPhoto, chatPhoto]);

    const getInitials = () => {
        let string = '';

        if (user && user.displayName) {
            const names = user.displayName.split(' ');
            for (let i = 0; i < 2; i++) {
                if (names[i]) {
                    string += names[i].charAt(0)
                }
            }
        }

        return string;
    }

    return (
        photo ? 
            <img 
                src={`data:image/jpeg;base64, ${photo}`} 
                style={{borderRadius: '50%', width: width, border: '2px solid grey'}} 
                className={className}
            /> :
            <div className={classnames('mx-auto text-dark', className)} style={{backgroundColor: 'white', borderRadius: '50%', width: width, height: width, border: '2px solid grey', lineHeight: width, fontSize: fontSize, textAlign: 'center'}}>
                {getInitials()} 
            </div>
    );
}
