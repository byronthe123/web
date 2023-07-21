import React from 'react';
import _ from 'lodash';
import { Modal } from 'reactstrap';

export default ({
    open,
    handleModal,
    selectedAwb,
    markAsMailOrDelivered
}) => {

    const deliveredCount = _.get(selectedAwb, 'processedCount', 0);

    return (
        <Modal isOpen={open} toggle={(e) => handleModal(!open)}>
            <div className="modal-content" style={{width: '600px'}}>
                <div className="modal-header mx-auto pb-3">
                    <h4 className="modal-title" id="exampleModalLabel">Mark Processed/Exempt</h4>
                </div>
                <div className="modal-body mx-auto pt-3">
                    <div className='row mx-auto text-center'>
                        <button className={`btn btn-info ml-3 ${deliveredCount > 0 && 'pulse'}`} disabled={deliveredCount > 0 ? false : true} onClick={() => markAsMailOrDelivered('ALREADY DELIVERED')} style={{width: '180px', backgroundColor: 'rgba(30,144,255, 1)'}}>Mark Already Delivered: {deliveredCount}</button>
                        <button className='btn btn-primary' onClick={() => markAsMailOrDelivered('EXEMPT')} style={{marginLeft: '100px', widtd: '150px'}}>Mail/Comat [Exempt]</button>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => handleModal(!open)}>Close</button>
                </div>
            </div>
        </Modal>

    );
}
