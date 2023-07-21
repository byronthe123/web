import React, { useState, useEffect } from 'react';
import { Row, Col, Button, FormGroup, Table } from 'reactstrap';
import { Field } from 'formik';
import moment from 'moment';
import classnames from 'classnames';
import { FSN } from './interfaces';
import { IMap, IStep } from '../../../globals/interfaces';
import useBalanceCheck from './useBalanceCheck';

/**
 * TODO: Define interfaces for selectedAwb, paymentsCharges
*/

interface Props {
    selectedAwb: any,
    values: IMap<any>,
    createImportItem: (reject: boolean, push: (id: string) => void) => Promise<void>,
    step: IStep,
    push: (id: string) => void,
    awbs: Array<any>,
    clearanceData: Array<FSN>,
    paymentsCharges: any
}

export default function CheckClearance ({
    selectedAwb,
    values,
    createImportItem,
    step,
    push,
    awbs,
    clearanceData,
    paymentsCharges
}: Props) {

    const { balanceDue } = paymentsCharges;

    const openBalance = useBalanceCheck(step.id, balanceDue, selectedAwb.s_type);

    if (openBalance) {
        push('2');
    }

    const [useClearance, setUseClearance] = useState<Array<FSN>>([]);
    const [hold, setHold] = useState(false);

    useEffect(() => {
        if (clearanceData && clearanceData.length > 0) {
            let useFiltered, hold = false;
            if (values.s_hawb) {
                const filtered = clearanceData.filter(item => item.s_hawb && item.s_hawb.replace(/\r/, '') === values.s_hawb);
                useFiltered = filtered || [];
            } else {
                useFiltered = clearanceData || [];
            }
    
            for (let i = 0; i < useFiltered.length; i++) {
                if (useFiltered[i].s_csn_code.includes('H')) {
                    useFiltered[i].hold = true;
                    hold = true;
                }
            }
    
            setUseClearance(useFiltered);
            setHold(hold);
        }
    }, [values.s_hawb, clearanceData]);

    return (
        <Row>
            <Col md={6}>
                <h4>MAWB: {selectedAwb.s_mawb} / HAWB: {values.s_hawb}</h4>
                <FormGroup>
                    <h4>Copy and Paste Cargo Clearance here:</h4>
                    <Field name={'s_customs_release'} component={'textarea'} className={'form-control'} style={{ height: '400px' }} />
                </FormGroup>
                <FormGroup className={'mt-2'}>
                    <h4>Notes:</h4>
                    <Field name={'s_notes'} component={'textarea'} className={'form-control'} style={{ height: '100px' }} />
                </FormGroup>
            </Col>
            <Col md={6}>
                <h4>Customs Clearances: {hold && <span className={'text-danger text-bold'}>| This shipment may be on hold</span>}</h4>
                <Table striped>
                    <thead>
                        <tr>
                            <th>Created</th>
                            <th>Flight</th>
                            <th>HAWB</th>
                            <th>Clearance</th>
                            <th>Station</th>
                            <th>CSN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            useClearance && useClearance.map((item, i) => (
                                <tr key={i} className={classnames({ 'table-warning': item.hold })}>
                                    <td>{moment(item.t_created).format('MM/DD/YYYY HH:mm:ss')}</td>
                                    <td>{item.s_arr}</td>
                                    <td>{item.s_hawb}</td>
                                    <td className={classnames({'text-bold text-danger': item.hold})}>{item.s_csn_code}</td>
                                    <td>{item.s_location}</td>
                                    <td>{item.s_csn}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </Col>
            <Col md={12} className={'text-right mt-2'}>
                <Button 
                    disabled={values.s_customs_release.length < 1}
                    onClick={() => createImportItem(false, push)}
                >
                    { awbs.length > 1 ? 'Accept Cargo Delivery' : 'Accept Delivery and Release all AWBs to the Warehouse' }
                </Button>
            </Col>
        </Row>
    );
}