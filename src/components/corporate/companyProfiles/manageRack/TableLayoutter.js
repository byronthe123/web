import React from 'react';
import { useWindowWidth } from '@react-hook/window-size';
import { Table, Card, CardBody, Button, Row, Col } from 'reactstrap';

const TableLayoutter = ({
    tower,
    levels,
    handleOperation
}) => {

    const width = useWindowWidth();

    return (
        <Card className='custom-opacity-card mb-3' style={{borderRadius: '0.75rem'}}>
            <CardBody className='custom-card-transparent py-3 px-2' style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                <Row className={'mb-1'}>
                    <Col md={12}>
                        <div className={'float-left'}>
                            <h4 className={'d-inline mr-2'}>Tower {tower}</h4>
                            <Button 
                                className={'d-inline'}
                                onClick={() => handleOperation('CREATE', 'LEVEL', tower)}
                            >
                                <i className="fas fa-plus-circle mr-2"></i>
                                Level
                            </Button>
                        </div>
                        <div className={'float-right'}>
                            <i 
                                className={'fas fa-trash'} 
                                onClick={() => handleOperation('UPDATE', 'TOWER', tower)}
                            />
                        </div>
                    </Col>
                </Row>
                <Table responsive bordered className='mb-0'>
                    <thead>

                    </thead>
                    <tbody>
                        <tr>
                            {
                                width > 1000 && 
                                <td 
                                    rowSpan={Object.keys(levels).length + 1} 
                                    className='text-center align-middle bg-primary' 
                                    style={{fontSize: '48px', fontWeight: 'bolder'}}
                                >
                                    {tower}
                                </td>
                            }
                        </tr>
                        {
                            Object.keys(levels).map((level, i) => (
                                <tr key={i}>
                                    <td 
                                        className={'text-center bg-info align-middle text-white'} 
                                        style={{ width: '25px' }}
                                        onClick={() => handleOperation('UPDATE', 'LEVEL', tower, level)}
                                    >
                                        {level}
                                    </td>
                                    {
                                        Object.keys(levels[level]).sort((a, b) => Number(a) - Number(b)).map((loc, j) => (
                                            <td 
                                                className='text-center align-middle hover-pointer'
                                                onClick={() => handleOperation('UPDATE', 'LOCATION', tower, level, `${loc}`, levels[level][loc].allowDuplicates)}
                                                key={j}
                                            >
                                                { `${level}${loc}` }
                                            </td>
                                        ))
                                    }
                                    <td className={'text-center align-middle'}>
                                        <i 
                                            className="fad fa-plus-circle text-large hover-pointer text-success"
                                            onClick={() => handleOperation('CREATE', 'LOCATION', tower, level)}
                                        />
                                    </td>
                                </tr>  
                            ))
                        }
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
}

export default TableLayoutter;