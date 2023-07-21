import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';

import ReactTable from '../custom/ReactTable';
import { IFsnCbpJoin } from './interfaces';
import FSNModal from './FSNModal';

interface Props {
    data: Array<IFsnCbpJoin>
}

export default function FSN ({ data }: Props) {

    const [modal, setModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IFsnCbpJoin>();

    const handleViewDetails = (item: IFsnCbpJoin) => {
        setSelectedItem(item);
        setModal(true);
    }

    return (
        <Row>
            <Col md={12}>
                <h6 className={'font-weight-bold'}>Clearance Codes for this AWB: {data.length}</h6>
                {/* @ts-ignore */}
                <ReactTable 
                    data={data}
                    mapping={[
                        {
                            name: 'Created',
                            value: 't_created',
                            datetime: true,
                            utc: true
                        },
                        {
                            name: 'HAWB',
                            value: 's_hawb',
                            customWidth: 100
                        },
                        {
                            name: 'Clearance',
                            value: 's_csn_code',
                            customWidth: 76
                        },
                        {
                            name: 'Description',
                            value: 's_description'
                        },
                        {
                            name: 'Flight',
                            value: 's_arr',
                            customWidth: 117
                        },
                        {
                            name: 'FSN',
                            value: 's_csn',
                            customWidth: 246
                        }
                    ]}
                    numRows={10}
                    enableClick={true}
                    handleClick={handleViewDetails}
                />
            </Col>
            <FSNModal 
                modal={modal}
                setModal={setModal}
                selectedItem={selectedItem}
            />
        </Row>
    );
}