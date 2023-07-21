import React from 'react';
import {Button} from 'reactstrap';

const CompanyCardDetails = ({detail, handleSetSelectedAwbs, handleExportAcceptPcs, handleModalReject}) => {

    const resolveBackground = () => {
        if(detail.s_type === 'EXPORT') {
            return `url(/assets/img/bg-blue-sm.png)`;
        }
        return `url(/assets/img/bg-green-sm.png)`;
    }

    return (
        <div className="card my-1 px-2 py-2" style={{borderRadius: "0.75rem 0.75rem", backgroundImage: resolveBackground(), backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
            {/* <h6 className="my-0 py-0 text-dark" style={{fontWeight: 'bold'}}>{company.s_type}</h6> */}
            <h4 className="my-0 py-0 text-dark" style={{fontWeight: 'bold'}}>
                <div className='row'>
                    <div className='col-12'>
                        <div className='row mx-0'>
                            <div className='col-5'>
                                <h4 className='mt-3' style={{color: 'white', fontWeight: 'bolder'}}>{detail.s_mawb}{detail.s_hawb && detail.s_hawb !== null && `/ ${detail.s_hawb}`}</h4>
                            </div>
                            <div className='col-3 px-0'>
                                {
                                    detail.s_type === 'IMPORT' ?
                                    <h4 className='mt-3' style={{color: 'white', fontWeight: 'bolder'}}>
                                        { detail.i_pieces && detail.i_pieces !== null ? detail.i_pieces : 0} Pieces
                                    </h4> :
                                    <h4 className='mt-3' style={{color: 'white', fontWeight: 'bolder'}}>{detail.export_pcs && detail.export_pcs !== null ? detail.export_pcs : 0} Pieces</h4>
                                }
                            </div> 
                            {
                                detail.s_status === 'DOCKING' && detail.s_type === 'IMPORT' &&
                                <div className='col-3 mt-2 px-0'>
                                    {
                                        detail.rack_status === 'DELIVERED' || detail.b_delivered ?
                                            <h4 className='mt-2' style={{color: 'white', fontWeight: 'bolder'}}>DELIVERED</h4> :
                                            <Button color='secondary' onClick={() => handleSetSelectedAwbs(detail)} style={{color: 'white', fontWeight: 'bolder'}}>Locations</Button>
                                    }
                                </div>
                            }
                            {
                                detail.s_status === 'DOCKING' && detail.s_type === 'EXPORT' &&
                                <div className='col-3 mt-2 px-0'>
                                    <Button color='info' onClick={() => handleExportAcceptPcs(detail)} style={{color: 'white', fontWeight: 'bolder'}}>Accept PCS</Button>
                                </div>
                            }
                            <div className='col-1'>
                                <i onClick={() => handleModalReject(detail)} className="mt-3 far fa-times-circle dock-reject"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </h4>
        </div>
    );
}

export default CompanyCardDetails;