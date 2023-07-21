import React, { useEffect, useMemo } from 'react';

import { Modal, ModalHeader, ModalBody, Row, Col, Table } from "reactstrap";
import { getUnitsMap } from '../utils';

const ModalConfirmLocation = ({
    open, 
    handleModal,
    user,
    setUser,
    units
}) => {

    const unitsMap = useMemo(() => {
        return getUnitsMap(units);
    }, [units]);

    const selectUserLocation = (s_unit) => {
        const copy = { ...user };

        if (copy.s_unit !== s_unit) {
            copy.s_unit = s_unit;
            copy.s_destination = copy.s_unit.substr(1, 3);

            setUser(copy);
        }

        if (!user.b_airline) {
            handleModal(false);
        }
    }

    const selectUserAirline = (e) => {
        const copy = { ...user };
        const airlineCode = e.target.value;

        if (copy.s_airline_code !== airlineCode) {
            copy.s_airline_code = airlineCode;
            setUser(copy);
        }
    }

    useEffect(() => {
        if (process.env.REACT_APP_NODE_ENV  === 'TEST') {
            if (units && units.indexOf('TEST') === -1) {
                units.push('TEST');
            }
        }
    }, [process.env.REACT_APP_NODE_ENV ]);

    return (
        <Modal isOpen={open} toggle={handleModal} size={'lg'}>
            <ModalHeader>Please Confirm your Office Location:</ModalHeader>
            <ModalBody>
                <Row className={'d-flex justify-content-center'}>
                    {
                        Object.keys(unitsMap).map((key, i) => (
                            <Col md={2} key={i}>
                                <Table className={`bg-${unitsMap[key].color} font-weight-bold`}>
                                    <thead></thead>
                                    <tbody>
                                        {
                                            unitsMap[key].array.map((unit, j) => (
                                                <tr key={`${unit}-${j}`} style={{ backgroundColor: user.s_unit === unit ? 'gold' : 'inhert' }}>
                                                    <td 
                                                        className={'text-center hover-pointer hover-transform'}
                                                        onClick={() => selectUserLocation(unit)}
                                                        
                                                    >
                                                        {unit}
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                            </Col> 
                        ))
                    }
                </Row>
                {
                    user.b_airline && 
                    <>
                        <div className="mx-auto mt-0">
                            <h5 className="mt-0 mb-0 mb-1" id="exampleModalLabel">Airline:</h5>
                        </div>
                        <div className="modal-body mx-auto mt-0">
                            <div className="row">
                                <div className="col-12">
                                    <div className={`btn-group aircraft-type ml-2`} data-toggle="buttons">
                                        {
                                            user.s_airline_codes && user.s_airline_codes.map((c, i) => 
                                                <label className="btn btn-info mr-2" style={{backgroundColor: `${user && user.s_airline_code === c ? '#4d7058' : '#6fb327'}`, border: '1px solid darkgreen'}} key={i}>
                                                    <input type="radio" id='createAwbType' value={c} onClick={(e) => selectUserAirline(e)} style={{display: 'none'}} />{c}
                                                </label>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='row mt-3'>
                                <div className={'col-12 text-center'}>
                                    <button className={'btn btn-outline-dark'} onClick={() => handleModal()}>Close</button>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </ModalBody>
        </Modal>
    );
}

export default ModalConfirmLocation;