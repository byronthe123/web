import React, {Fragment} from 'react';
import Switch from "rc-switch";
import "rc-switch/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Input,
    Label,
  } from "reactstrap";
import moment from 'moment';

const ModalEditEquipmentRecord = ({
    open, 
    handleModal, 
    editEquipmentId, 
    editEquipmentType, 
    editIncidentNotes, 
    editMaintenanceHistory,
    editMaintenanceItemFound,
    setEditEquipmentId,
    setEditEquipmentType,
    setEditIncidentNotes,
    setEditMaintenanceHistory,
    setEditMaintenanceItemFound,
    editSmsEquipmentRecord,
    deleteEquipmentHistoryRecord
}) => {

    return (
        <Fragment>
            <Modal isOpen={open} toggle={handleModal}>
            <div className="modal-content" style={{width: '600px'}}>
                <div className="modal-header mx-auto">
                    <h5 className="modal-title" id="exampleModalLabel">Edit Equipment History Record</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body mx-auto">
                    <div className="row">
                        <div className="col-12">

                            <h4>Equipment Type:</h4>
                            <input type="text" value={editEquipmentType} onChange={(e) => setEditEquipmentType(e.target.value)} style={{width: '405px'}} className="mb-4 form-control"/>

                            <h4>Equipment ID:</h4>
                            <input className="form-control mb-4" value={editEquipmentId} onChange={(e) => setEditEquipmentId(e.target.value)}  type="text" style={{width: '405px'}}/>

                            <h4>Incident Notes:</h4>
                            <input className="form-control mb-4" value={editIncidentNotes} onChange={(e) => setEditIncidentNotes(e.target.value)}  type="text" style={{width: '405px'}}/>

                            <h4>Maintenance History:</h4>
                            <input className="form-control mb-4" value={editMaintenanceHistory} onChange={(e) => setEditMaintenanceHistory(e.target.value)}  type="text" style={{width: '405px'}}/>
                            
                            <h4>Maintenance Item Found:</h4>
                            <input className="form-control mb-4" value={editMaintenanceItemFound} onChange={(e) => setEditMaintenanceItemFound(e.target.value)}  type="text" style={{width: '405px'}}/>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger" style={{position: 'relative', right: '260px'}} onClick={() => deleteEquipmentHistoryRecord()}>Delete Record</button>
                    <button type="button" className="btn btn-secondary" onClick={handleModal}>Close</button>
                    <button type="button" className="btn btn-primary" onClick={() => editSmsEquipmentRecord()}>Save</button>
                </div>
            </div>
            </Modal>
        </Fragment>
    );
}

export default ModalEditEquipmentRecord;