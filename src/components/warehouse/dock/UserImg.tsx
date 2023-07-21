import React from 'react';

interface Props {
    imgSrc: string,
    classnames?: string
}

export default function UserImg ({
    imgSrc,
    classnames
}: Props) {

    if (imgSrc !== null) {
        return (
            <div
                style={{
                    background: `url(${imgSrc})`,
                    width: '75px',
                    height: '75px',
                    backgroundPosition: '50% 80%',
                    backgroundSize: '175px auto',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '50%'
                }}
                className={'float-right'}
            ></div>
        );
    } else {
        return (
            // <div
            //     style={{
            //         backgroundImage: `url('https://ewrstorage1.blob.core.windows.net/driver-photos/92e87f9c-1b6a-490a-b2d2-b5aac5457b63.png')`,
            //         width: '75px',
            //         height: '75px',
            //         backgroundPosition: '50% 80%',
            //         backgroundSize: '175px auto',
            //         backgroundRepeat: 'no-repeat',
            //         borderRadius: '50%'
            //     }}
            //     className={'float-right'}
            // ></div>
            <img 
                src={'/assets/img/user.png'} 
                className={classnames || ''} 
                style={{ width: '75px', height: 'auto' }}
            />
        );

        //https://ewrstorage1.blob.core.windows.net/driver-photos/92e87f9c-1b6a-490a-b2d2-b5aac5457b63.png
    }


}