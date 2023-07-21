import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'reactstrap';
import axios from 'axios';
import ReactTable from '../../components/custom/ReactTable';
import ModalViewBlob from './ModalViewBlob';
import { api } from '../../utils';

export default ({
    baseApiUrl,
    headerAuthCode,
    activeFirstTab,
    asyncHandler,
    setLoading
}) => {

    const [blobFiles, setBlobFiles] = useState([]);
    const [queryCompleted, setQueryCompleted] = useState(false);
    const [modal, setModal] = useState(false);
    const [accessLink, setAccessLink] = useState('');

    useEffect(() => {
        const selectAllBlobFiles = asyncHandler(async() => {
            setLoading(true);
            const res = await api('get', 'selectAllBlobFiles')

            setBlobFiles(res.data);
            setQueryCompleted(true);
            setLoading(false);
        });

        if (activeFirstTab === '3') {
            selectAllBlobFiles();
        }
    }, [activeFirstTab]);

    const getBlobAccessLink = asyncHandler(async (s_file_name, s_container) => {
        const data = {
            s_file_name,
            s_container
        }

        const res = await api('post', 'getBlobAccessLink', { data });

        return res.data;
    });


    const handleViewFile = async (item) => {
        const { s_file_name, s_container } = item;
        const accessLink = await getBlobAccessLink(s_file_name, s_container);
        console.log(accessLink);
        setAccessLink(accessLink);
        setModal(true);
    }

    return (
        <Row>
            <Col md={12}>
                <ReactTable 
                    data={blobFiles}
                    index={true}
                    enableClick={true}
                    handleClick={(item) => handleViewFile(item)}
                    mapping={[
                        {
                            name: 'GUID',
                            value: 's_guid'
                        },
                        {
                            name: 'Transaction ID',
                            value: 's_transaction_id'
                        }, 
                        {
                            name: 'Name',
                            value: 's_file_name'
                        }, 
                        {
                            name: 'Type',
                            value: 's_type'
                        },
                        {
                            name: 'Created By',
                            value: 's_created_by'
                        },
                        {
                            name: 'Created',
                            value: 't_created',
                            datetime: true,
                            utc: true
                        }
                    ]}
                />
            </Col>

            <ModalViewBlob 
                modal={modal}
                setModal={setModal}
                accessLink={accessLink}
            />
        </Row>
    );
}

