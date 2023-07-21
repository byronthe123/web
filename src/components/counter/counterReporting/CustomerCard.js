import React, {useState, useEffect} from 'react';
import moment from 'moment';
import tz from 'moment-timezone';
import ReactTooltip from 'react-tooltip';
import CompanyCardDetails from './CompanyCardDetails';
import { withRouter, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Row, Col } from 'reactstrap';

export default ({company, myAssignment, items, removeOwnership, setType, resolveGivenName, eightyWindow, setSelectedAwb, handleSelectAwb}) => {
    
    const [showAwbDetails, setShowAwbDetails] = useState(false);
    const [givenName, setGivenName] = useState('');
    const history = useHistory();

    const resolveBackground = (company) => {
        const state = company.s_state;
        switch(state) {
            case 'EXPORT':
                return '#6BB4DD';
            case 'IMPORT':
                return '#61B996';
            case 'MIXED': 
                return 'goldenrod';
        }
    }

    const resolveTruckingCompanyName = (name) => {
        if (name.length > 20) {
            return `${name.substr(0, 28)}..`;
        }
        return name;
    }

    const jumpToProcess = () => {
        if (company.s_type === 'EXPORT') {
            history.push('/EOS/Operations/Counter/Acceptance');
        } else {
            history.push('/EOS/Operations/Counter/Delivery');
        }
    } 

    useEffect(() => {
        if (company.accessToken) {
            resolveGivenName(company.accessToken, company.s_counter_ownership_agent, (givenName) => {
               setGivenName(givenName); 
            });
        }   
    }, [company]);
    

    return(
        <div className={`card pb-0 pt-1 my-2 px-0 mr-3`} style={{borderRadius: '0.75rem', backgroundColor: resolveBackground(company), boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', fontSize: '16px'}}>
            <div className="card-body-waiting my-auto px-3 pt-3 mb-5">
                <h5 style={{fontWeight: 'bold'}} className={`my-assignment-card mt-0 mb-2`} onClick={() => jumpToProcess()}>
                    {resolveTruckingCompanyName(company.s_trucking_company)}: <span style={{fontWeight: 'normal', fontSize: '16px'}}>{company.s_trucking_driver}</span> 
                </h5>

                <div style={{position: 'absolute', right: '2%', top: '5%'}}>
                    <span className="bg-info px-1 ml-1">{company.exportCount}</span>
                    <span className="bg-success px-1">{company.importCount}</span>
                </div>
                <div>
                    <Row>
                        <Col md={12} className='text-center'>
                            <img style={{width: '475px', height: 'auto'}} src={`${company.sm_driver_photo}`} />
                        </Col>
                    </Row>
                </div>
                <div style={{display: showAwbDetails ? 'block' : 'none'}}>
                    {
                        items.map((item, i) => item.s_transaction_id === company.s_transaction_id && <CompanyCardDetails company={item} key={i} hover={true} handleSelectAwb={handleSelectAwb} awbsArray={company.awbs} />)
                    }
                </div>
                <div className="queue-card-details mb-0 mt-1">
                    {/* <p style={{float: 'left', fontSize: '16px'}} className='mb-0'>{moment.utc(company.t_kiosk_submitted).format('MM/DD/YYYY hh:mm A')}</p> */}
                    <p style={{float: 'right', marginLeft: '10px', fontSize: '16px'}}>
                        <span className="fas fa-chevron-down" onClick={() => setShowAwbDetails(!showAwbDetails)} style={{fontSize: '28px'}}></span>
                    </p>    
                    {/* <p style={{float: 'right', fontSize: '16px'}} className="mb-0">{getTruckingCoTimeWaiting(company)}</p> */}
                </div>

            </div>
        </div>
    );
}
