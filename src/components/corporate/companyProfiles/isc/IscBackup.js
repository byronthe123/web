import React, { Fragment, useState, useEffect } from 'react';
import { Row, Col, Button, Table } from 'reactstrap';
import axios from 'axios';
import moment from 'moment';

import { iscMapping } from './iscMapping';
import ModalIsc from './ModalIsc';

const ISC = ({
    baseApiUrl,
    headerAuthCode,
    user,
    eightyWindow,
    createSuccessNotification                         
}) => {

    const [iscData, setIscData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [createNew, setCreateNew] = useState(false);
    const [modalIsc, setModalIsc] = useState(false);

    const selectIscData = () => {
        user && 
        axios.get(`${baseApiUrl}/selectIscData`, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setIscData(response.data);
        }).catch(error => {
            
        }); 
    }

    useEffect(() => {
        selectIscData();
    }, []);

    const handleAddIsc = () => {
        setCreateNew(true);
        setModalIsc(true);
    }

    const selectItem = (item) => {
        setSelectedItem(item);
        setCreateNew(false);
        setModalIsc(true);
    }

    const addUpdateIsc = (values) => {

        const { email } = user;
        const now = moment().local().format('MM/DD/YYYY HH:mm:ss');
        let url;
        let notification;

        if (createNew) {
            values.t_created = now;
            values.s_created_by = email;
            url = 'addIsc';
            notification = 'Record Added';
        } else {
            values.id = selectedItem.id;
            url = 'updateIsc';
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
            setIscData(response.data);
            setModalIsc(false);
            createSuccessNotification(notification);
        }).catch(error => {
            
        }); 
    }

    const deleteIsc = (id) => {
        axios.post(`${baseApiUrl}/deleteIsc`, {
            id
        }, {
            headers: {'Authorization': `Bearer ${headerAuthCode}`}
        }).then(response => {
            setIscData(response.data);
            setModalIsc(false);
            createSuccessNotification(`Record Deleted`);
        });
    }


    return (
        <Fragment>
            <Row className='px-3 pb-2'>
                <h4>Station Profiles</h4>
                <Button className='ml-4' onClick={() => handleAddIsc()}>New</Button>
            </Row>
            <Row>
                <Col md={12}>
                    <Table>
                        <thead>
                            <tr>
                                {
                                    iscMapping.map((s, i) => 
                                        <th key={i}>{s.name}</th>
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody className='table-row-hover'>
                            {
                                iscData.map((d, i) => 
                                    <tr key={i} onClick={() => selectItem(d)} className={selectedItem && selectedItem.id === d.id ? 'table-row-selected' : ''}>
                                        {
                                            iscMapping.map(h => 
                                                h.datetime ?
                                                    <td>{moment(d[h.value]).format('MM/DD/YYYY HH:mm:ss')}</td> :
                                                    <td>{d[h.value]}</td>
                                            )
                                        }
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                    <Button className='ml-2' onClick={() => handleAddIsc()}>New</Button>
                </Col>
            </Row>
            <ModalIsc 
                open={modalIsc}
                handleModal={setModalIsc}
                item={selectedItem}
                createNew={createNew}
                selectedItem={selectedItem}
                iscMapping={iscMapping}
                iscData={iscData}
                addUpdateIsc={addUpdateIsc}
                deleteIsc={deleteIsc}
            />
        </Fragment>
    );      
}

export default ISC;