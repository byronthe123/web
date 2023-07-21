import dayjs from 'dayjs';
import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Table, Input } from 'reactstrap';
import useBreakpoint from '../../customHooks/useBreakpoint';
import { formatCost } from '../../utils';
import { IFWB } from '../../globals/interfaces';

import Header from './Header';

type Props = {
    data: Array<IFWB>;
    toggle: () => void;
}

export default function FWB ({ data, toggle }: Props) {
    const { breakpoint } = useBreakpoint();
    const [selectedItem, setSelectedItem] = useState<IFWB>();

    useEffect(() => {
        if (data.length > 0) {
            setSelectedItem(data[0]);
        }
    }, [data]);

    const handleSelectItem = (id: number) => {
        const found = data.find(d => d.id === id);
        setSelectedItem(found || undefined);
    }

    const TableRow = ({ name, value, date }: { name: string, value: string, date?: boolean }) => {
        
        if (!selectedItem) {
            return null;
        }
        
        return (
            <tr>
                <td className={'custom-table-row'}>{name}</td>
                {/* @ts-ignore */}
                <td>{date ? dayjs(selectedItem[value]).format('MM/DD/YYYY') : selectedItem[value]}</td>
            </tr>
        );
    }

    return  (
        <Row>
            <Col md={12}>
                <div className={'float-left'}>
                    <h6 className={'d-inline font-weight-bold'}>Air Waybill received on</h6>
                    <Input type={'select'} className={'d-inline ml-2 font-weight-bold'} onChange={(e: any) => handleSelectItem(e.target.value)} style={{ width: '200px', fontSize: '16px' }}>
                        {
                            data.map(d => (
                                <option value={d.id} key={d.id}>{dayjs(d.t_created).local().format('MM/DD/YYYY HH:mm')}</option>
                            ))
                        }
                    </Input>
                </div>
                <div className={'float-right'}>
                    <Header 
                        title={``}
                        navigation={{
                            path: '/EOS/Operations/EDI/EdiFWB',
                            toggle: () => toggle()
                        }}
                    />
                </div>
            </Col>
            <Col md={breakpoint ? 12 : 6}>
                <Row>
                    <Col md={12}>
                        <h6>Waybill Details</h6>
                        <Table striped>
                            <thead></thead>
                            <tbody>
                                <TableRow name={'Pieces'} value={'i_total_pieces'} />
                                <TableRow name={'Weight'} value={'f_weight'} />
                                <TableRow name={'Weight Unit'} value={'s_weight_unit'} />
                                <TableRow name={'Name and Quantity of Goods'} value={'s_goods_description'} />
                                <TableRow name={'Special Handling Codes'} value={'s_special_handling_codes'} />
                                <TableRow name={'Handling Information'} value={'s_other_service_information'} />
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <h6>Other Waybill Details</h6>
                        {
                            selectedItem &&
                            <Table striped>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td className={'custom-table-row'}>Shipper</td>
                                        <td>
                                            {selectedItem.s_shipper_name1} {selectedItem.s_shipper_streetaddress1} {selectedItem.s_shipper_place} {selectedItem.s_shipper_country} {selectedItem.s_shipper_postcode}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={'custom-table-row'}>Consignee</td>
                                        <td>
                                            {selectedItem.s_consignee_name1} {selectedItem.s_carriers_execution_airport}
                                        </td>
                                    </tr>
                                    <TableRow name={`Agent's IATA`} value={'s_agent_iata_cargo_agent_numeric_code'} />
                                    <TableRow name={`Account No`} value={'s_agent_iata_cargo_agent_cass_address'} />
                                    <TableRow name={`Currency`} value={'s_iso_currency_code'} />
                                    <TableRow name={`SCI`} value={'s_customs_origin_code'} />
                                    <TableRow name={`Total Weight Charge`} value={'f_total_weight_charge'} />
                                    <TableRow name={`Total other charges due agent`} value={'f_total_weight_charge'} />
                                    <tr>
                                        <td className={'custom-table-row'}>Total other charges due agent</td>
                                        <td>
                                            {
                                                formatCost(selectedItem.f_total_other_charges_due_agent)
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={'custom-table-row'}>Total other charges due carrier</td>
                                        <td>
                                            {
                                                formatCost(selectedItem.f_total_other_charges_due_carrier)
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={'custom-table-row'}>Total prepaid</td>
                                        <td>
                                            {
                                                formatCost(selectedItem.f_charge_summary_total)
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        }
                    </Col>
                </Row>
            </Col>
            <Col md={breakpoint ? 12 : 6}>
                <h6>Waybill Flight Details</h6>
                <Table striped>
                    <thead></thead>
                    <tbody>
                        <TableRow name={`Airport of Dept.`} value={'s_origin'} />
                        <TableRow name={`First Route`} value={'s_route_destination_1'} />
                        <TableRow name={`First Carrier`} value={'s_route_carrier_code_1'} />
                        <TableRow name={`Second Route`} value={'s_route_destination_2'} />
                        <TableRow name={`Second Carrier`} value={'s_route_carrier_code_2'} />
                        <TableRow name={`Third Route`} value={'s_route_destination_3'} />
                        <TableRow name={`Third Carrier`} value={'s_route_carrier_code_3'} />
                        <TableRow name={`Airport of Destination`} value={'s_destination'} />
                        <TableRow name={`First Flight`} value={'d_flight_1_schedule'} date={true} />
                        <TableRow name={`Second Flight`} value={'d_flight_2_schedule'} date={true} />
                        <TableRow name={`Special Service Request`} value={'s_agent_special_service_request'} />
                        <TableRow name={`Agent Name`} value={'s_agent_name'} />
                        <TableRow name={`Carrier's signature`} value={'s_carriers_execution_authorisation_signature'} />
                        <TableRow name={`Carrier's execution`} value={'d_carriers_execution'} date={true} />
                        <TableRow name={`Carrier's execution airport`} value={'s_carriers_execution_airport'} />
                    </tbody>
                </Table>
            </Col>
            <Col md={12}>
                {
                    selectedItem && 
                    <h6>Created on {dayjs(selectedItem.t_created).utc().format('MM/DD/YYYY HH:mm')} by {selectedItem.s_created_by} | Last modified on {dayjs(selectedItem.t_modified).utc().format('MM/DD/YYYY HH:mm')} by {selectedItem.s_modified_by}</h6>
                }
            </Col>
        </Row>
    );
}