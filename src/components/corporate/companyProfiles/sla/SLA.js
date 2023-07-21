import React, { Fragment, useState, useEffect } from 'react';
import { Row, Col, Button, Table } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';

import { slaMapping } from './slaMapping';
import ModalSla from './ModalSla';

const SLA = ({
    baseApiUrl,
    headerAuthCode,
    user,
    eightyWindow,
    createSuccessNotification                         
}) => {

    const [slaData, setSlaData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [createNew, setCreateNew] = useState(false);
    const [modalSla, setModalSla] = useState(false);

    const selectSlaData = () => {
        user && 
        axios.get(`${baseApiUrl}/selectSlaData`, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setSlaData(response.data);
        }).catch(error => {
            
        }); 
    }

    useEffect(() => {
        selectSlaData();
    }, []);

    const handleAddSla = () => {
        setCreateNew(true);
        setModalSla(true);
    }

    const selectItem = (item) => {
        setSelectedItem(item);
        setModalSla(true);
    }

    const addUpdateSla = (values) => {

        const { email } = user;
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        let url;
        let notification;

        if (createNew) {
            values.t_created = now;
            values.s_created_by = email;
            url = 'addSla';
            notification = 'Record Added';
        } else {
            values.id = selectedItem.id;
            url = 'updateSla';
            notification = 'Record Updated';
        }        

        values.t_modified = now;
        values.s_modified_by = email;

        const data = values;
        
        axios.post(`${baseApiUrl}/${url}`, {
            data
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setSlaData(response.data);
            setModalSla(false);
            createSuccessNotification(notification);
        }).catch(error => {
            
        }); 
    }

    const deleteSla = (id) => {
        axios.post(`${baseApiUrl}/deleteSla`, {
            id
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setSlaData(response.data);
            setModalSla(false);
            createSuccessNotification(`Record Deleted`);
        });
    }


    return (
        <Fragment>
            <Row className='px-3'>
                <h4>Station Profiles</h4>
            </Row>
            <Row>
                <Col md={12}>
                    <Table>
                        <thead>
                            <tr>
                                {
                                    slaMapping.map((s, i) => 
                                        <th key={i}>{s.name}</th>
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody className='table-row-hover'>
                            {
                                slaData.map((d, i) => 
                                    <tr key={i} onClick={() => selectItem(d)} className={selectedItem && selectedItem.id === d.id ? 'table-row-selected' : ''}>
                                        {
                                            slaMapping.map((h, i) => 
                                                h.value === 'b_default' ? 
                                                    <td key={i}>{d[h.value] === false ? 'NO' : 'YES'}</td> :
                                                h.value === 't_modified' ?
                                                    <td key={i}>{moment(d[h.value]).format('MM/DD/YYYY HH:mm:ss')}</td> :
                                                    <td key={i}>{d[h.value]}</td>
                                            )
                                        }
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                    <Button className='ml-2' onClick={() => handleAddSla()}>New</Button>
                </Col>
            </Row>
            <ModalSla 
                open={modalSla}
                handleModal={setModalSla}
                item={selectedItem}
                createNew={createNew}
                selectedItem={selectedItem}
                slaMapping={slaMapping}
                slaData={slaData}
                addUpdateSla={addUpdateSla}
                deleteSla={deleteSla}
            />
        </Fragment>
    );      
}

export default SLA;