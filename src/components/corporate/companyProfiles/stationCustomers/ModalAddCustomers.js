import React, { Fragment, useState, useEffect } from 'react';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactTable from '../../../custom/ReactTable';

import {
    Button,
    Modal,
    FormGroup,
    Input,
    Label,
    Row,
    Col,
    Form
  } from "reactstrap";
import moment from 'moment';

export default ({
    open, 
    handleModal,
    selectedStation,
    airlinesMapping,
    airlines
}) => {

    return (
        <Fragment>
            <Modal isOpen={open} toggle={(e) => handleModal(!open)}>
                <div className="modal-content" style={{width: '1100px', position: 'absolute', right: '-70%'}}>
                    <div className="modal-body mx-auto">
                        <div className='text-center'>
                            <h1>Add Customers to Station {selectedStation && selectedStation.s_unit}</h1>
                        </div>
                        <div style={{width: '900px', height: '700px', overflowY: 'scroll'}}>
                            <ReactTable 
                                data={airlines}
                                mapping={airlinesMapping}
                                numRows={20}
                                index={false}
                                customPagination={true}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
}
