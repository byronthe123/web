import React, {useState, useEffect} from 'react';
import { store } from 'react-notifications-component';
import { NavLink } from 'react-router-dom';
import ModalFeedback from './ModalFeedback';
import axios from 'axios';

const Footer = ({user, baseApiUrl, headerAuthCode}) => {

    const [modalFeedbackOpen, setModalFeedbackOpen] = useState(false);
    const [s_feedback, set_s_feedback] = useState('');

    const getFirstName = () => {
        const namesArray = user && user.displayName && user.displayName.split(' ');
        return namesArray && namesArray.length > 0 ? namesArray[0] : '';
    }

    const createSuccessNotification = (message, type='success') => {
        // NotificationManager.success(message);
        store.addNotification({
          title: message,
          message: ' ',
          type,
          container: 'top-center',                // where to position the notifications
          animationIn: ["animated", "fadeInDown"],     // animate.css classes that's applied
          animationOut: ["animated", "fadeOutUp"],   // animate.css classes that's applied
          dismiss: {
            duration: 3000
          }
        })
    
      }

      const provideFeedback = () => {

        const data = {
          s_feedback,
          email: user.s_email
        }

        axios.post(`${baseApiUrl}/provideFeedback`, {
          data
        }, {
          headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
          setModalFeedbackOpen(false);
          set_s_feedback('');
          createSuccessNotification(`Thank you for your feedback, ${getFirstName()}`);
        }).catch(error => {

        });
      }


    return (
        <div className='footer'>
            <p style={{ display: 'inline-block' }} className='pb-0 mb-0 mr-4'>Was this page helpful?<i onClick={() => createSuccessNotification(`Thank you for your feedback, ${getFirstName()}.`)} className="far fa-thumbs-up pl-3 pr-3"></i><i className="far fa-thumbs-down" onClick={() => setModalFeedbackOpen(true)}></i></p>
            |
            <p style={{ display: 'inline-block' }} className='ml-3'>
                <NavLink
                    to="/EOS/Portal/SiteMap"
                    location={{}}
                    className="menu-button d-none d-md-block"
                    
                >
                    Site Map
                </NavLink>
            </p>

            <ModalFeedback 
              open={modalFeedbackOpen}
              handleModal={setModalFeedbackOpen}
              name={getFirstName()}
              s_feedback={s_feedback}
              set_s_feedback={set_s_feedback}
              provideFeedback={provideFeedback}
            />
        </div>
    );   
}

export default Footer;