import React, { useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { Row, Col, Button, Card, CardBody} from 'reactstrap';
import axios from 'axios';

import ExportTable from './ExportTable';
import CreateAcceptanceSheet from '../../counter/export/CreateAcceptanceSheet';
import { useAppContext } from '../../../context';
import PulseLoader from 'react-spinners/PulseLoader';

const AcceptanceSheet = ({
    s_unit,
    user,
    baseApiUrl,
    headerAuthCode
}) => {

    const [s_mawb, set_s_mawb] = useState('');
    const [exportAwbs, setExportAwbs] = useState([]);
    
    const selectAwb = (awb) => {
        generateImportDeliverySheet(awb);
    }

    const searchAwb = () => {
        
        const data = {
            s_mawb: s_mawb.replace(/-/g, ''),
            s_unit
        }

        baseApiUrl && headerAuthCode && 
        axios.post(`${baseApiUrl}/searchExportAwbs`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            const notRejected = response.data.filter(awb => awb.s_status !== 'REJECTED');
            setExportAwbs(notRejected);
        }).catch(error => {

        });
    }

    const formatMawb = (mawb) => {
        return mawb.substr(0, 13).replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }

    useEffect(() => {
        set_s_mawb(formatMawb(s_mawb));
    }, [s_mawb]);

    const enableSearch = () => {
        return s_mawb.length >= 4;
    }

    const {
        appData
    } = useAppContext();

    const { shcs } = appData;

    const generateImportDeliverySheet = (selectedAwb) => {

        const {    
            b_dg,
            b_screened,
            s_mawb,
            i_pieces,
            i_weight,
            s_transport_type,
            s_airline_code,
            s_flight_number,
            s_airline,
            t_depart_date,
            s_origin,
            s_destination,
            s_port_of_unlading,
            s_commodity,
            s_iac,
            s_ccsf,
            s_shc1,
            s_shc2,
            s_shc3,
            s_shc4,
            s_shc5,
            s_company_driver_name,
            s_company,
            s_company_driver_id_type_1,
            s_company_driver_id_num_1,
            d_company_driver_id_expiration_1,
            b_company_driver_photo_match_1,
            s_company_driver_id_type_2,
            s_company_driver_id_num_2,
            d_company_driver_id_expiration_2,
            b_company_driver_photo_match_2,
            s_kiosk_submitted_agent,
            t_created,
            s_first_name,
            s_last_name,
            s_logo
        } = selectedAwb;

        const deliverySheetPrint = renderToString(
            <CreateAcceptanceSheet 
                b_dg={b_dg}
                b_screened={b_screened}
                s_mawb={s_mawb}
                i_pieces={i_pieces}
                i_weight={i_weight}
                s_transport_type={s_transport_type}
                s_airline_code={s_airline_code}
                s_flight_number={s_flight_number}
                s_airline={s_airline}
                t_depart_date={t_depart_date}
                s_origin={s_origin}
                s_destination={s_destination}
                s_port_of_unlading={s_port_of_unlading}
                s_commodity={s_commodity}
                s_iac={s_iac}
                s_ccsf={s_ccsf}
                s_shc1={s_shc1}
                s_shc2={s_shc2}
                s_shc3={s_shc3}
                s_shc4={s_shc4}
                s_shc5={s_shc5}
                s_company_driver_name={s_company_driver_name}
                s_company={s_company}
                s_company_driver_id_type_1={s_company_driver_id_type_1}
                s_company_driver_id_num_1={s_company_driver_id_num_1}
                d_company_driver_id_expiration_1={d_company_driver_id_expiration_1}
                b_company_driver_photo_match_1={b_company_driver_photo_match_1}
                s_company_driver_id_type_2={s_company_driver_id_type_2}
                s_company_driver_id_num_2={s_company_driver_id_num_2}
                d_company_driver_id_expiration_2={d_company_driver_id_expiration_2}
                b_company_driver_photo_match_2={b_company_driver_photo_match_2}
                s_kiosk_submitted_agent={s_kiosk_submitted_agent}      
                getProcessAgentName={true}
                agentName={`${s_first_name} ${s_last_name}`}
                user={user}   
                t_created={t_created}   
                s_logo={s_logo}
                shcs={shcs}
            />
        );

        const myWindow = window.open("", "MsgWindow", "width=1920,height=1080");
        myWindow.document.write(deliverySheetPrint);
    }

    return (
        <div className='mx-4 my-3'>
            <Card className='custom-opacity-card' style={{borderRadius: '0.75rem'}}>
                <CardBody className='custom-card-transparent py-3 px-5' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                    <Row>
                        <Col md='12' lg='12'>
                            <h4 style={{display: 'inline'}}>AWB Search: </h4>
                            <input type='text' value={s_mawb} onChange={(e) => set_s_mawb(e.target.value)} className='mr-2' style={{width: '25%', display: 'inline'}} />
                            {
                                shcs.length > 0 ? (
                                    <Button disabled={!enableSearch()} style={{display: 'inline'}} onClick={() => searchAwb()}>Search</Button>
                                ) : (
                                    <Button disabled>
                                        Loading Data
                                        <PulseLoader />
                                    </Button>
                                )
                            }
                        </Col>
                    </Row>
                    <ExportTable 
                        exportAwbs={exportAwbs}
                        selectAwb={selectAwb}
                    />
                </CardBody>
            </Card>
        </div>
    );
}

export default AcceptanceSheet;