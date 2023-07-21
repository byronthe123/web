import React, {Fragment} from 'react';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from 'react-loader-spinner';
import { WithWizard } from 'react-albus';

import {
    Button,
    Modal,
  } from "reactstrap";
import moment from 'moment';

export default ({
    open, 
    handleModal,
    selectedCompanyEmails,
    sendEmail,
    loadingSendEmail,
    ccEmails
}) => {

    return (
        <Fragment>
            <Modal isOpen={open} toggle={() => handleModal()}>
            <div className="modal-content" style={{width: '600px'}}>
                <div className="modal-header mx-auto pb-3">
                    <h4 className="modal-title" id="exampleModalLabel">Send Email</h4>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                {
                    loadingSendEmail && loadingSendEmail ?
                    <div className='d-flex justify-content-center align-items-center' style={{marginTop: '100px', paddingBottom: '100px'}}>
                        <Loader type="ThreeDots" color="lightblue" className='loader-search' />
                    </div>  :
                    <Fragment>
                        <div className="modal-body mx-auto pt-3">
                            <div className='row'>
                                <div className="form-group mr-3" style={{width: '100%'}}>
                                    <h6 className='mb-2'>Emails will be sent to the following addresses:</h6>
                                    <div className='col-12' style={{backgroundColor: '#D3D3D3', height: '100px', width: '100%'}}>
                                        {
                                            <p style={{width: '450px'}}>
                                                {selectedCompanyEmails && selectedCompanyEmails.length > 0 && selectedCompanyEmails.map(e => e + '; ')}
                                            </p>
                                        }
                                    </div>
                                    <h6 className='mb-0 mt-2'>Carbon Copied Emails:</h6>
                                    <div className='col-12 mt-0' style={{backgroundColor: '#D3D3D3', height: '100px', width: '100%'}}>
                                        {
                                            <p>
                                                {ccEmails && ccEmails.length > 0 ? ccEmails.map(e => e + '; ') : '\u00A0'}
                                            </p>
                                        }
                                    </div>
                                </div>

                                <h6>Email will be sent from noreply@choice.aero</h6>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => handleModal()}>Close</button>
                            <WithWizard
                                render={({ push }) => (
                                    <button className="btn btn-primary ml-2 py-0" style={{height: '42px'}} type="button" onClick={() => sendEmail(push)}>Send Email</button>
                                )}
                            />
                        </div>
                    </Fragment> 
                }
            </div>
            </Modal>
        </Fragment>
    );
}