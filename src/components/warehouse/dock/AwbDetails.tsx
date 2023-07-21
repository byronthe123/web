import React, { useMemo } from 'react';
import { Card, CardBody, Row, Col, Button, Table } from 'reactstrap';
import { formatMawb } from '../../../utils';
import { IAwbRackDataMap, IDockAwb, LaunchModalReject } from './interfaces';

interface Props {
    selectedAwb: IDockAwb,
    setModalLocations: (modal: boolean) => void,
    launchModalReject: LaunchModalReject,
    rackDataMap: IAwbRackDataMap
}

export default function AwbDetails ({
    selectedAwb,
    setModalLocations,
    launchModalReject,
    rackDataMap
}: Props) {

    console.log(selectedAwb);
    console.log(rackDataMap);

    const rackDataItem = useMemo(() => {
        return rackDataMap[selectedAwb.s_mawb] || {};
    }, [rackDataMap, selectedAwb]);

    return (
        <Card className={`custom-opacity-card mb-3 bg-light-grey`} style={{ borderRadius: '0.75rem', backgroundColor: '#606060' }}>
            <CardBody className='custom-card-transparent py-3 px-0'>
                <Row>
                    <Col md={12} className={'text-center'}>
                        <h1 className={'text-white mb-0'}>{formatMawb(selectedAwb.s_mawb)}</h1>
                        <h6 className={'text-white'}>HAWB: {selectedAwb.s_hawb}</h6>
                        <Button 
                            color={'danger'}
                            style={{ 
                                position: 'absolute',
                                right: '40px',
                                top: '4px'
                            }}
                            onClick={() => launchModalReject('AWB')}
                        >
                            REJECT
                        </Button>
                    </Col>
                    <Col md={12} className={'px-5'}>
                        <Table className={'bg-white text-left'} style={{ fontSize: '16px' }}>
                            <thead></thead>
                            <tbody>
                                <tr>
                                    <td># of Locations</td>
                                    <td className={'text-right'}>{rackDataItem.rackLocations}</td>
                                </tr>
                                <tr>
                                    <td># of Pieces</td>
                                    <td className={'text-right'}>{rackDataItem.rackPieces}</td>
                                </tr>
                                <tr>
                                    <td>Weight</td>
                                    <td className={'text-right'}>{rackDataItem.rackWeight && `${rackDataItem.rackWeight} KGS`}</td>
                                </tr>
                                <tr>
                                    <td>Commodity</td>
                                    <td className={'text-right'}>{rackDataItem.fwbCommodity}</td>
                                </tr>
                                <tr>
                                    <td>SHC</td>
                                    <td className={'text-right'}>{rackDataItem.rackShc}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col md={12} style={{ fontSize: '16px' }} className={'px-5'}>
                        <h6>Notes</h6>
                        <div className={'bg-white'}>
                            {
                                selectedAwb.s_notes
                            }
                        </div>
                    </Col>
                    <Col md={12} className={'text-center mt-1'}>
                        <Button 
                            color={'success'}
                            style={{ fontSize: '20px' }}
                            onClick={() => setModalLocations(true)}
                        >
                            LOCATIONS
                        </Button>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}