import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
import Clipboard from 'react-clipboard.js';
import ReactTable from '../../components/custom/ReactTable';

export default ({
    modal,
    setModal,
    wikis
}) => {

    const toggle = () => setModal(!modal);
    const [selectedWiki, setSelectedWiki] = useState({});

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader>Link to Wiki</ModalHeader>
            <ModalBody>
                <Row>
                    <Col md={12}>
                        <ReactTable 
                            data={wikis}
                            mapping={[
                                {
                                    name: 'Title',
                                    value: 's_title'
                                },
                                {
                                    name: 'Category',
                                    value: 's_category'
                                }, 
                                {
                                    name: 'Tags',
                                    value: 's_tags'
                                }
                            ]}
                            enableClick={true}
                            handleClick={(item) => setSelectedWiki(item)}
                            numRows={10}
                        />
                        {
                            selectedWiki.id && 
                            <div className={'mt-2'}>
                                <h4 className={'d-inline mr-3'}>Link: <span id={'copyLink'}>{`https://eos.choice.aero/EOS/Portal/Wiki?id=${selectedWiki.id}`}</span></h4>                          
                                <Clipboard data-clipboard-target="#copyLink" className={'btn btn-secondary d-inline'}>
                                    <i className={'fas fa-copy'} style={{ fontSize: '20px' }} />
                                </Clipboard>
                            </div>
                        }
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Exit</Button>
            </ModalFooter>
        </Modal>
    );
}