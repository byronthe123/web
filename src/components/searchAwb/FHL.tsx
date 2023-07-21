import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Input } from 'reactstrap';
import useBreakpoint from '../../customHooks/useBreakpoint';
import dayjs from 'dayjs';
import { formatEmail } from '../../utils';
import { IFHL, IMap } from '../../globals/interfaces';
import _ from 'lodash';

import Header from './Header';

type Props = {
    data: Array<IFHL>;
    toggle: () => void;
}

type CustomRowProps = {
    name: string,
    value: string
}

export default function FHL ({ data, toggle }: Props) {

    const { breakpoint } = useBreakpoint();
    const [selectedItem, setSelectedItem] = useState<IFHL>();
    const [fhlMap, setFhlMap] = useState<IMap<IFHL>>({});
    const [selectedHawb, setSelectedHawb] = useState('');

    const CustomRow = ({ name, value }: CustomRowProps) => {
        return (
            <tr>
                <td className={'custom-table-row'}>{name}</td>
                {/* @ts-ignore */}
                <td>{selectedItem && selectedItem[value]}</td>
            </tr>
        )
    }

    useEffect(() => {
        if (data.length > 0) {
            setSelectedHawb(_.get(data, '[0].s_hawb', ''));

            const map: IMap<IFHL> = {};

            for (let i = 0; i < data.length; i++) {
                const current = data[i];
                if (!map[current.s_hawb]) {
                    map[current.s_hawb] = current;
                }
            }

            setFhlMap(map);
        }
    }, [data]);

    useEffect(() => {
        if (fhlMap[selectedHawb]) {
            setSelectedItem(fhlMap[selectedHawb]);
        }
    }, [fhlMap, selectedHawb]);

    return (
        <Row>
            <Col md={12}>
                <div className={'float-left'}>
                    <h6 className={'d-inline mr-2 font-weight-bold'}>HAWB Manifest ({Object.keys(fhlMap).length})</h6>
                    <Input type={'select'} className={'d-inline font-weight-bold'} style={{ width: '200px', fontSize: '16px'  }} onClick={(e: any) => setSelectedHawb(e.target.value)}>
                        {
                            Object.keys(fhlMap).map((key, i) => (
                                <option value={fhlMap[key].s_hawb} key={i}>{fhlMap[key].s_hawb}</option>
                            ))
                        }
                    </Input>
                </div>
                <div className={'float-right'}>
                    <Header 
                        title={``}
                        navigation={{
                            path: '/EOS/Operations/EDI/EdiFHL',
                            toggle: () => toggle()
                        }}
                    />
                </div>
            </Col>
            <Col md={breakpoint ? 12 : 6}>
                <h6>HAWB Details</h6>
                <Table striped>
                    <thead></thead>
                    <tbody>
                        <CustomRow name={'HAWB'} value={'s_hawb'} />
                        <CustomRow name={'Origin'} value={'s_origin'} />
                        <CustomRow name={'Destination'} value={'s_destination'} />
                        <CustomRow name={'Pieces'} value={'i_pieces'} />
                        <tr>
                            <td className={'custom-table-row'}>Weight</td>
                            <td>{selectedItem && selectedItem.f_weight} {selectedItem && selectedItem.s_mawb_weight_unit}</td>
                        </tr>
                        <CustomRow name={'Nature of Goods'} value={'s_nature_of_goods'} />
                        <CustomRow name={'Description of Goods'} value={'s_free_text_description_of_goods'} />
                        <CustomRow name={'Special Handling Code'} value={'s_special_handling_codes'} />
                        <CustomRow name={'ISO Currency Code'} value={'s_iso_currency_code'} />
                        <CustomRow name={'Load Count'} value={'i_shippers_load_and_count'} />
                        <CustomRow name={'Payment Evaluation'} value={'s_payment_weight_valuation'} />
                        <CustomRow name={'Other Charges'} value={'s_payment_other_charges'} />
                    </tbody>
                </Table>
            </Col>
            <Col md={breakpoint ? 12 : 6}>
                <h6>Shipper Details</h6>
                <Table striped>
                    <thead></thead>
                    <tbody>
                        <CustomRow name={'Shipper'} value={'s_shipper_address_name1'} />
                        <CustomRow name={'Address'} value={'s_shipper_street_address1'} />
                        <CustomRow name={'Place'} value={'s_shipper_place'} />
                        <CustomRow name={'State'} value={'s_shipper_state_province'} />
                        <CustomRow name={'Country'} value={'s_shipper_country'} />
                        <CustomRow name={'Post Code'} value={'s_shipper_postcode'} />
                        <CustomRow name={'Contact ID'} value={'s_shipper_contact_id'} />
                        <CustomRow name={'Contact Number'} value={'s_shipper_contact_number'} />
                    </tbody>
                </Table>
                <h6>Consignee Details</h6>
                <Table striped>
                    <thead></thead>
                    <tbody>
                        <CustomRow name={'Consignee'} value={'s_consignee_address_name1'} />
                        <CustomRow name={'Address'} value={'s_consignee_street_address1'} />
                        <CustomRow name={'Place'} value={'s_consignee_place'} />
                        <CustomRow name={'State'} value={'s_consignee_state_province'} />
                        <CustomRow name={'Country'} value={'s_consignee_country'} />
                        <CustomRow name={'Post Code'} value={'s_consignee_postcode'} />
                        <CustomRow name={'Contact ID'} value={'s_consignee_contact_id'} />
                        <CustomRow name={'Contact Number'} value={'s_consignee_contact_number'} />
                    </tbody>
                </Table>
            </Col>
            <Col md={12}>
                {
                    selectedItem &&
                    <h6>
                        Created on {dayjs(selectedItem.t_created).format('MM/DD/YYYY HH:mm')} by {formatEmail(selectedItem.s_created_by)} |
                        Last modified on {dayjs(selectedItem.t_modified).format('MM/DD/YYYY HH:mm')} by {formatEmail(selectedItem.s_modified_by)}
                    </h6>
                }
            </Col>
        </Row>
    );
}