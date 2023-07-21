import _ from 'lodash';
import React, { useMemo } from 'react';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import CustomCard from '../../custom/CustomCard';
import AwbCard from './AwbCard';
import { IAwbRackDataMap, ICompany, IDockAwb, LaunchModalReject } from './interfaces';
import UserImg from './UserImg';
import AwbDetails from './AwbDetails';
import { IMap } from '../../../globals/interfaces';

interface Props {
    setStep: (step: number) => void;
    selectedCompany: ICompany;
    selectedAwb: IDockAwb;
    setSelectedAwb: (awb: IDockAwb) => void;
    rackDataMap: IAwbRackDataMap;
    handleSelectCompany: (
        company: ICompany,
        viewDetails?: boolean,
        viewAwbs?: boolean
    ) => void;
    setModalLocations: (modal: boolean) => void;
    launchModalReject: LaunchModalReject;
    setModalChecklist: (modal: boolean) => void;
}

export default function Awbs({
    setStep,
    selectedCompany,
    selectedAwb,
    setSelectedAwb,
    rackDataMap,
    handleSelectCompany,
    setModalLocations,
    launchModalReject,
    setModalChecklist,
}: Props) {
    const enableFinish = useMemo(() => {
        const validStatusMap: IMap<boolean> = {
            DELIVERED: true,
            'PARTIAL DELIVERED': true,
            ACCEPTED: true,
            'DOCK PROCESSED': true,
        };

        const awbs = _.get(selectedCompany, 'awbs', []);

        for (let i = 0; i < awbs.length; i++) {
            if (!validStatusMap[awbs[i].s_status]) {
                return false;
            }
        }

        return true;
    }, [selectedCompany]);

    return (
        <Row className="px-0 py-3">
            <Col md={12}>
                <Row>
                    <Col md={6}>
                        <i
                            className="fa-solid fa-left d-inline mr-2"
                            style={{ fontSize: '60px' }}
                            onClick={() => setStep(1)}
                        ></i>
                        <h1>AWBS: {selectedCompany.awbs.length}</h1>
                    </Col>
                    <Col
                        md={6}
                        className={'text-right'}
                        onClick={() =>
                            handleSelectCompany(selectedCompany, true, false)
                        }
                    >
                        <h1 className={'d-inline mr-2 mt-2'}>
                            {selectedCompany.s_trucking_driver || ''}
                        </h1>
                        <UserImg
                            imgSrc={_.get(
                                selectedCompany,
                                'awbs[0].s_driver_photo_link',
                                ''
                            )}
                            classnames={'d-inline text-right'}
                        />
                    </Col>
                </Row>
            </Col>
            <Col md={12}>
                <Card
                    className={`custom-opacity-card mb-3 bg-light-grey`}
                    style={{ borderRadius: '0.75rem' }}
                >
                    <CardBody
                        className="custom-card-transparent py-3 px-0"
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                        <Row>
                            <Col md={6} className={'pl-5'}>
                                <Row
                                    style={{
                                        height: 'calc(100vh - 300px)',
                                        overflowY: 'scroll',
                                    }}
                                >
                                    <Col md={12}>
                                        {selectedCompany.awbs.map((awb, i) => (
                                            <AwbCard
                                                awb={awb}
                                                selectedAwb={selectedAwb}
                                                setSelectedAwb={setSelectedAwb}
                                                key={i}
                                            />
                                        ))}
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={6} className={'pr-4 text-center'}>
                                {selectedAwb.s_mawb.length > 0 && (
                                    <AwbDetails
                                        selectedAwb={selectedAwb}
                                        setModalLocations={setModalLocations}
                                        launchModalReject={launchModalReject}
                                        rackDataMap={rackDataMap}
                                    />
                                )}
                                <Button
                                    className={'extra-large-button-text'}
                                    disabled={!enableFinish}
                                    onClick={() => setModalChecklist(true)}
                                >
                                    Finish
                                </Button>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}
