import React, { useMemo } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonGroup, Label } from 'reactstrap';
import { Field } from 'formik';

export default ({
    modal,
    setModal,
    fhls,
    setFieldValue,
    values
}) => {

    const toggle = () => setModal(!modal);
    const hawbs = useMemo(() => {
        const map = {};
        for (let i = 0; i < fhls.length; i++) {
            map[fhls[i].s_hawb] = true;
        }
        const array = [];
        for (let key in map) {
            array.push(key);
        }
        return array;
    }, [fhls]);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader>Process by House</ModalHeader>
            <ModalBody>
                {
                    hawbs.length > 0 &&
                        <>
                            <Label className={'d-block'}>Select House</Label>
                            <ButtonGroup className={'d-block'}>
                                {
                                    hawbs.map((s_hawb, i) => (
                                        <Button
                                            key={i}
                                            onClick={() => setFieldValue('s_hawb', s_hawb)}
                                            active={values.s_hawb === s_hawb}
                                        >
                                            {s_hawb}
                                        </Button>
                                    ))
                                }
                            </ButtonGroup>
                        </>
                }
                <Label className={'mt-2'}>Search for House</Label>
                <Field name={'s_hawb'} type={'text'} className={'form-control'} />
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={toggle}>Submit</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}