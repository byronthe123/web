import React from 'react';
import moment from 'moment';

export default ({
    update
}) => {

    const { s_title, t_changed_date, s_description, s_image_url  } = update && update;

    return (
        <div>
            <h5 style={{ fontWeight: 'bold' }}>{ moment(t_changed_date).format('MM/DD/YYYY HH:mm:ss') }: { s_title }</h5>
            <div dangerouslySetInnerHTML={{
                __html: s_description
            }}></div>
            {
                s_image_url && 
                <img src={`${s_image_url}`} style={{ maxWidth: '500px', height: 'auto' }} />
            }
        </div>
    );
}