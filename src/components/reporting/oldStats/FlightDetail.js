import React, { Fragment } from 'react';
import { Row, Table, Col } from 'reactstrap';
import moment from 'moment';

const FlightDetail = ({
    selectedStat,
    type
}) => {

    const resolveType = (string) => {
        const strArray = Array.from(string);
        const prefix = strArray[0];
        switch (prefix) {
            case 's':
                return 'varchar';
            case 'd':
                return 'date';
            case 't':
                return 'datetime';
            case 'b':
                return 'boolean';
            case 'i':
                return 'varchar';
            case 'f':
                return 'varchar';
        }
    }

    const getFormattedValue = (value, type) => {
        if (type === 'date') {
            return moment(value).format('MM/DD/YYYY');
        } else if (type === 'datetime') {
            return moment(value).format('MM/DD/YYYY hh:mm: A');
        } else if (type === 'boolean') {
            const toReturn = value ? 'Yes' : 'No';
            return toReturn;
        } else {
            return value;
        }
    }

    const displayStatValue = (property) => {
        if (selectedStat && selectedStat !== null) {
            const type = resolveType(property);

            let formattedValue = getFormattedValue(selectedStat[property], type);

            return formattedValue;
        }
        return '';
    }

    return (
        <Row>
            <Col md='12' lg='12'>
                <Row>
                    {
                        selectedStat && 
                        <h4>{`${selectedStat.s_airline} ${selectedStat.s_airline_code}${selectedStat.s_flight_number && selectedStat.s_flight_number !== null ? selectedStat.s_flight_number : ''} ${moment(selectedStat.d_flight).format('MM/DD/YYYY')}`}</h4>
                    }
                </Row>
                <Row>
                    {
                        type && type ==='ramp' ?
                        <Fragment>
                            <Table striped className='mb-0'>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td className='table-heading'>Airline Handling</td>
                                        <td className='table-heading'>Airline Parking</td>
                                        <td className='table-heading'>Drayage</td>
                                    </tr>
                                    <tr>
                                        <td>{displayStatValue('f_aircraft_handling')}</td>
                                        <td>{displayStatValue('f_aircraft_parking')}</td>
                                        <td>{displayStatValue('f_drayage')}</td>
                                    </tr>
                                    <tr>
                                        <td className='table-heading'>Cancelled</td>
                                        <td className='table-heading'>NIL</td>
                                        <td className='table-heading'>Validated</td>
                                    </tr>
                                    <tr>
                                        <td>{displayStatValue('b_cancelled')}</td>
                                        <td>{displayStatValue('b_nil')}</td>
                                        <td>{displayStatValue('b_validated')}</td>
                                    </tr>
                                    <tr>
                                        <td className='table-heading'>Created</td>
                                        <td className='table-heading'>Created by</td>
                                        <td className='table-heading'>Unit</td>
                                    </tr>
                                    <tr>
                                        <td>{displayStatValue('t_created')}</td>
                                        <td>{displayStatValue('s_created_by')}</td>
                                        <td>{displayStatValue('s_unit')}</td>
                                    </tr>
                                    <tr>
                                        <td className='table-heading'>Modified</td>
                                        <td className='table-heading'>Modified by</td>
                                        <td className='table-heading'>Type</td>
                                    </tr>
                                    <tr>
                                        <td>{displayStatValue('t_modified')}</td>
                                        <td>{displayStatValue('s_modified_by')}</td>
                                        <td>{displayStatValue('s_type')}</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <Table striped>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td className='table-heading'>Notes</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>
                                                {displayStatValue('s_notes')}
                                            </p>
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Fragment>
                        : type === 'misc' ? 
                        <Fragment>
                            <Table striped className='mb-0'>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td className='table-heading'>ULD Overage</td>
                                        <td className='table-heading'>Labor</td>
                                        <td className='table-heading'>Transfer Skid</td>
                                        <td className='table-heading'>Space</td>
                                    </tr>
                                    <tr>
                                        <td>{displayStatValue('f_uld_overage')}</td>
                                        <td>{displayStatValue('f_security_labor')}</td>
                                        <td>{displayStatValue('f_transfer_skid')}</td>
                                        <td>{displayStatValue('f_security_space')}</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <Table striped className='mb-0'>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td className='table-heading'>Cancelled</td>
                                        <td className='table-heading'>NIL</td>
                                        <td className='table-heading'>Validated</td>
                                    </tr>
                                    <tr>
                                        <td>{displayStatValue('b_cancelled')}</td>
                                        <td>{displayStatValue('b_nil')}</td>
                                        <td>{displayStatValue('b_validated')}</td>
                                    </tr>
                                    <tr>
                                        <td className='table-heading'>Created</td>
                                        <td className='table-heading'>Created by</td>
                                        <td className='table-heading'>Unit</td>
                                    </tr>
                                    <tr>
                                        <td>{displayStatValue('t_created')}</td>
                                        <td>{displayStatValue('s_created_by')}</td>
                                        <td>{displayStatValue('s_unit')}</td>
                                    </tr>
                                    <tr>
                                        <td className='table-heading'>Modified</td>
                                        <td className='table-heading'>Modified by</td>
                                        <td className='table-heading'>Type</td>
                                    </tr>
                                    <tr>
                                        <td>{displayStatValue('t_modified')}</td>
                                        <td>{displayStatValue('s_modified_by')}</td>
                                        <td>{displayStatValue('s_type')}</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <Table striped>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td className='table-heading'>Notes</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>
                                                {displayStatValue('s_notes')}
                                            </p>
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Fragment> :
                        <Table striped style={{tableLayout: 'fixed'}}>
                            <thead>

                            </thead>
                            <tbody>
                                <tr>
                                    <td className='table-heading'>AWB</td>
                                    <td>{displayStatValue('i_awb')}</td>
                                    <td className='table-heading'>LD3</td>
                                    <td>{displayStatValue('i_ld3')}</td>
                                    <td className='table-heading'>Cargo KG</td>
                                    <td>{displayStatValue('f_total_kg')}</td>
                                    <td className='table-heading'>Flight KG</td>
                                    <td>{displayStatValue('f_flight_kg')}</td>
                                </tr>
                                <tr>
                                    <td className='table-heading'>Pieces</td>
                                    <td>{displayStatValue('i_pieces')}</td>
                                    <td className='table-heading'>LD3 BUP</td>
                                    <td>{displayStatValue('i_ld3_bup')}</td>
                                    <td className='table-heading'>BUP</td>
                                    <td>{displayStatValue('f_bup_kg')}</td>
                                    <td className='table-heading'>Transfer KG</td>
                                    <td>{displayStatValue('f_transfer_kg')}</td>
                                </tr>
                                <tr>
                                    <td className='table-heading'>AWB DG</td>
                                    <td>{displayStatValue('i_awb_dg')}</td>
                                    <td className='table-heading'>LD7</td>
                                    <td>{displayStatValue('i_ld7')}</td>
                                    <td className='table-heading'>Loose KG</td>
                                    <td>{displayStatValue('f_loose_kg')}</td>
                                    <td className='table-heading'>AWB Transfer</td>
                                    <td>{displayStatValue('i_awb_transfer')}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td className='table-heading'>LD7 BUP</td>
                                    <td>{displayStatValue('i_ld7_bup')}</td>
                                    <td className='table-heading'>Mail KG</td>
                                    <td>{displayStatValue('f_mail_kg')}</td>
                                    <td className='table-heading'>Courier</td>
                                    <td>{displayStatValue('f_courier_kg')}</td>
                                </tr>
                                <tr>
                                    <td className='table-heading'>Cancelled</td>
                                    <td>{displayStatValue('b_cancelled')}</td>
                                    <td className='table-heading'>NIL</td>
                                    <td>{displayStatValue('b_nil')}</td>
                                    <td className='table-heading'>Validated</td>
                                    <td>{displayStatValue('b_validated')}</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className='table-heading'>Created</td>
                                    <td>
                                        {displayStatValue('t_created')}
                                    </td>
                                    <td className='table-heading'>Modified</td>
                                    <td>{displayStatValue('t_modified')}</td>
                                    <td className='table-heading'>Unit</td>
                                    <td>{displayStatValue('s_unit')}</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className='table-heading'>Created by</td>
                                    <td>{displayStatValue('s_created_by').toUpperCase().replace('@CHOICE.AERO', '')}</td>
                                    <td className='table-heading'>Modified by</td>
                                    <td>{displayStatValue('s_modified_by').toUpperCase().replace('@CHOICE.AERO', '')}</td>
                                    <td className='table-heading'>Type</td>
                                    <td>{displayStatValue('s_type')}</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td className='table-heading'>Notes</td>
                                    <td>
                                        <p style={{width: '850px'}}>
                                            {displayStatValue('s_notes')}
                                        </p>       
                                    </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </Table>
                    }
                </Row>
            </Col>
        </Row>
    );
}

export default FlightDetail;