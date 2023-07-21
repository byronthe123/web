import React, {useState, useEffect} from 'react';
import TsaCheckWizard from './TsaCheckWizard';
import FoundIac from './FoundIac';
import FoundCcsf from './FoundCcsf';
import axios from 'axios';
import { Row, Col, Card, CardBody } from 'reactstrap';

const TsaCheckModal = ({
    baseApiUrl,
    headerAuthCode,
    values,
    setFieldValue,
    screeningType, 
    setScreeningType,
    foundIac, 
    setFoundIac,
    foundCcsf, 
    setFoundCcsf,
    airlines,
    selectAllAirlines,
    shipperType,
    setShipperType
}) => {

    useEffect(() => {
        setShipperType('');
    }, []);

    const checkIac = (s_iac) => {
        if(s_iac && s_iac.length === 9) {
            axios.post(`${baseApiUrl}/checkIac`, {
                checkIacNum: s_iac
            }, {
                headers: {'Authorization': `Bearer ${headerAuthCode}`}
            }).then(response => {
                setFoundIac(response.data[0]);
            }).catch(err => {
                alert(err);
            });
        } else {
            setFoundIac(null);
        }
    };

    const checkCcsf = (s_ccsf) => {
        if(s_ccsf && s_ccsf.length === 20) {
            axios.post(`${baseApiUrl}/checkCcsf`, {
                checkCcsfNum: s_ccsf
            }, {
                headers: {'Authorization': `Bearer ${headerAuthCode}`}
            }).then(response => {
                setFoundCcsf(response.data[0]);
            }).catch(err => {
                alert(err);
            });
        } else {
            setFoundCcsf(null);
        }
    };

    const reset = () => {
        setFieldValue('s_iac', null);
        setFieldValue('s_ccsf', null);
        setFieldValue('s_non_iac', null);
        setFieldValue('s_interline_transfer', '');
        setFoundIac(null);
        setFoundCcsf(null);
    }

    const handleIacNum = (e) => {
        setFieldValue('s_iac', e.target.value);
        checkIac(e.target.value);
    };

    const handleCcsfNum = (e) => {
        setFieldValue('s_ccsf', e.target.value);
        checkCcsf(e.target.value);
    };

    const handleInterlineTransfer = (option) => {
        setFieldValue('s_interline_transfer', option.value);
    };

    const handleNonIac = (e) => {
        setFieldValue('s_non_iac', e.target.value);
    };

    const handleBscreened = (e) => {
        setFieldValue('b_screened', JSON.parse(e.target.value));
        setScreeningType(null);
        reset();
    }

    const handleScreeningType = async (e) => {
        const { value } = e.target;
        setScreeningType(value);
        if (value === 'interlineTransfer') {
            setFieldValue('b_interline_transfer', true);
            if (airlines.length < 1) {
                await selectAllAirlines();
            }
        } else {
            setFieldValue('b_interline_transfer', false);
        }
        reset();
    }

    const validIacAlsoCcsf = () => {
        if(screeningType === 'iacAlsoCcsf' && values.s_iac !== null && values.s_iac.length === 9 && values.s_ccsf !== null && values.s_ccsf.length === 20) {
            if(foundIac && foundCcsf) {
                if(foundIac.approval_number === foundCcsf.iac_number) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    const handleSaveTsaCheck = () => {

        if(screeningType === 'unscreendOthers') {
            setFieldValue('s_iac', null);
            setFieldValue('s_ccsf', null);
            setFieldValue('b_screened', null);
        } else if(screeningType === 'unscreendIac') {
            setFieldValue('s_non_iac', null);
            setFieldValue('s_ccsf', null);
            setFieldValue('b_screened', null);
        } else if(screeningType === 'iacTenderCcsf') {
            setFieldValue('s_non_iac', null);
            setFieldValue('s_ccsf', null);
            setFieldValue('b_screened', null);
        } else if(screeningType === 'iacAlsoCcsf') {
            setFieldValue('s_non_iac', null);
            setFieldValue('b_screened', true);
        }

        // this.setState({
        //     tsaSaveInfo: {
        //         saved: true,
        //         time: moment().format('MM/DD/YYYY hh:mm A')
        //     },
        //     modalTsaCheck: false
        // });
    }

    return (
        <Row>
            <Col md={12}>
                <Card>
                    <CardBody>
                        <TsaCheckWizard 
                            b_screened={values.b_screened}
                            handleBscreened={handleBscreened}
                            handleScreeningType={handleScreeningType}
                            screeningType={screeningType}

                            s_iac={values.s_iac} 
                            checkIac={checkIac}
                            handleIacNum={handleIacNum}

                            s_ccsf={values.s_ccsf}
                            checkCcsf={checkCcsf}
                            handleCcsfNum={handleCcsfNum}

                            s_non_iac={values.s_non_iac}
                            handleNonIac={handleNonIac}

                            foundIac={foundIac}
                            validIacAlsoCcsf={validIacAlsoCcsf}
                            foundCcsf={foundCcsf}

                            airlines={airlines}
                            interlineTransfer={{
                                value: values.s_interline_transfer,
                                label: values.s_interline_transfer
                            }}
                            handleInterlineTransfer={handleInterlineTransfer}

                            shipperType={shipperType}
                            setShipperType={setShipperType}
                        />
                    </CardBody>
                </Card>
                
                {/* <h6 style={{position: 'relative', right: '120px', fontWeight: 'bolder', color: `${tsaSaveInfo.saved ? '#013220' : 'red'}`}}>
                    {tsaSaveInfo.saved ? `Saved at ${tsaSaveInfo.time}` : 'Not Saved'}
                </h6> */}
            </Col>
        </Row>
    );
}

export default TsaCheckModal;