import React from 'react'
import _ from 'lodash';

import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import { IUser } from '../../../globals/interfaces';
import ReactTable from '../../custom/ReactTable';
import { Location } from './interfaces';

interface Props {
    user: any,
    locations: Array<Location>,
    locatedPieces: number,
    pieces: number,
    allMasterPiecesLocated: boolean,
    overrideLocateAllByHouse: boolean,
    setOverrideLocateAllByHouse: (state: boolean) => void,
    processByHouse: boolean,
    hold: boolean
}

export default ({
    user,
    locations,
    locatedPieces,
    pieces,
    allMasterPiecesLocated,
    overrideLocateAllByHouse,
    setOverrideLocateAllByHouse,
    processByHouse,
    hold
}: Props) => {

    const invalidLocationsPieces = 
        overrideLocateAllByHouse ? false : 
        locations.length < 1 || (locatedPieces < pieces);

    return (
        <Row className={'mt-2'}>
            <Col md={12}>
                <Card>
                    <CardBody>
                        <Row>
                            <Col md={12} style={{ fontSize: '18px' }}>
                                <span className={`${invalidLocationsPieces && 'bg-warning'} float-left`}>
                                    Locations: 
                                    {
                                        !overrideLocateAllByHouse &&
                                        <span>{locations.length < 1 && 'None Found'} { `${locatedPieces} pieces located, ${pieces} total` }</span>
                                    }
                                </span>
                                {
                                    hold && 
                                    <span className={'float-right text-danger'}>
                                        Cannot continue because shipment is on hold.
                                    </span>
                                }
                                {
                                    (!hold && allMasterPiecesLocated && processByHouse && ['mozart@choice.aero', 'byron@choice.aero'].includes(_.get(user, 's_email.toLowerCase()', ''))) && 
                                    <span className={'float-right'}>
                                        <Button 
                                            onClick={() => setOverrideLocateAllByHouse(!overrideLocateAllByHouse)}
                                            active={overrideLocateAllByHouse}
                                        >
                                            Picking up all Pieces
                                        </Button>
                                    </span>
                                }
                            </Col>
                        </Row>
                        <ReactTable 
                            data={locations.filter(l => l.selected)}
                            mapping={[
                                {
                                    name: 'Last modified',
                                    value: 't_modified',
                                    date: true,
                                    utc: true
                                },
                                {
                                    name: 'Flight',
                                    value: 'd_flight',
                                    date: true,
                                    utc: true
                                },
                                {
                                    name: 'House',
                                    value: 's_hawb'
                                },
                                {
                                    name: 'CBP',
                                    value: 'fad fa-ban text-danger',
                                    icon: true,
                                    showCondition: (item: any) => item.b_customs_hold
                                },
                                {
                                    name: 'USDA',
                                    value: 'fad fa-ban text-danger',
                                    icon: true,
                                    showCondition: (item: any) => item.b_usda_hold
                                },
                                {
                                    name: 'Hold',
                                    value: 'fad fa-ban text-danger',
                                    icon: true,
                                    showCondition: (item: any) => item.b_hold
                                },
                                {
                                    name: 'Locations',
                                    value: 's_location',
                                    customWidth: 125
                                },
                                {
                                    name: 'Pieces',
                                    value: 'i_pieces',
                                    customWidth: 80
                                },
                                {
                                    name: 'User',
                                    value: 's_modified_by',
                                    email: true,
                                    customWidth: 80
                                }
                            ]}
                            index={true}
                            numRows={5}
                            locked={true}
                        />
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}