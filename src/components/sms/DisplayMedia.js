import React, {Fragment} from 'react';
import { Card, CardBody, Form, FormGroup, Input, Label, CustomInput, Button } from "reactstrap";

const DisplayMedia = ({mediaObj, deleteSmsMedia}) => {

    const resolveContent = (mediaObj) => {
        if(mediaObj.type === 'image') {
            return <img className='media-size' style={{width: '100%', height: 'auto'}} src={mediaObj.sc_file_link}/>;
        } else if(mediaObj.type === 'video') {
            const setType = `video/${mediaObj.extension}`;
            return  <video className='media-size' controls>
                        <source src={mediaObj.sc_file_link} type={setType} ></source>
                    </video>;
        } else if(mediaObj.type === 'pdf') {
            return <img className='media-size' src='/assets/img/pdf.png' />;
        } else if(mediaObj.type === 'excel') {
            return <img className='media-size' src='/assets/img/excel.png' />;
        } else if(mediaObj.type === 'word') {
            return <img className='media-size' src='/assets/img/word.png' />;
        }
    }

    return (
        <Fragment>
            <div className='col-3 mb-1 media-container'>
                {resolveContent(mediaObj)}
                <div className="overlay">{mediaObj.s_comments}</div>
                <a href={mediaObj.sc_file_link} target='_blank'><i className="fas fa-download"></i></a>
                <i className="fas fa-trash delete-sms-media" id={mediaObj.s_file_name} onClick={(e) => deleteSmsMedia(e)}></i>
            </div>
        </Fragment>
    );
}

export default DisplayMedia;