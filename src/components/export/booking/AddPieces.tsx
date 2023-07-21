import React, { useState, useMemo } from 'react';
import styled from 'styled-components';

import ReactTable from '../../custom/ReactTable';
import {
    IBookingMawb,
    IBookingMawbPiece,
    CreateUpdateBookingMawbPieces,
    DeleteBookMawbPieces,
} from './interfaces';
import { Label } from 'reactstrap';
import ActionIcon from '../../custom/ActionIcon';
import ModalAddPieces from './ModalAddPieces';
import { ISpecialHandlingCode, IUser } from '../../../globals/interfaces';
import Card from '../../custom/Card';
import { bookingMawbPiecesMapping } from './tableMapping';

interface Props {
    user: IUser;
    bookingMawb: IBookingMawb | undefined;
    bookingMawbPieces: Array<IBookingMawbPiece>;
    shcs: Array<ISpecialHandlingCode>;
    createUpdateBookingMawbPieces: CreateUpdateBookingMawbPieces;
    deleteBookMawbPieces: DeleteBookMawbPieces;
}

export default function AddPieces({
    user,
    bookingMawb,
    bookingMawbPieces,
    shcs,
    createUpdateBookingMawbPieces,
    deleteBookMawbPieces,
}: Props) {
    const [modal, setModal] = useState(false);
    const [selectedMawbPiece, setSelectedMawbPiece] =
        useState<IBookingMawbPiece>();

    const totalCalculatedWeight: number = useMemo(() => {
        return bookingMawbPieces.reduce(
            (total: number, current: IBookingMawbPiece) =>
                (total += current.f_weight),
            0
        );
    }, [bookingMawbPieces]);

    const handleCreateUpdate = (selectedMawbPiece?: IBookingMawbPiece) => {
        if (selectedMawbPiece) {
            setSelectedMawbPiece(selectedMawbPiece);
        } else {
            setSelectedMawbPiece(undefined);
        }
        setModal(true);
    };

    if (!bookingMawb) {
        return null;
    }

    return (
        <Container>
            <Card>
                <CustomTable>
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>Total Weight</td>
                            <td>{bookingMawb.f_weight} KG</td>
                        </tr>
                        <tr>
                            <td>Total Calculated Weight</td>
                            <td>{totalCalculatedWeight} KG</td>
                        </tr>
                    </tbody>
                </CustomTable>
                <TableHeading>
                    <Label>Details</Label>
                    <ActionIcon type={'add'} onClick={() => handleCreateUpdate()} />
                </TableHeading>
                <ReactTable
                    data={bookingMawbPieces}
                    mapping={bookingMawbPiecesMapping}
                    numRows={10}
                    index
                    enableClick
                    handleClick={handleCreateUpdate}
                />
                <ModalAddPieces
                    modal={modal}
                    setModal={setModal}
                    user={user}
                    bookingMawb={bookingMawb}
                    selectedMawbPiece={selectedMawbPiece}
                    shcs={shcs}
                    createUpdateBookingMawbPieces={createUpdateBookingMawbPieces}
                    deleteBookMawbPieces={deleteBookMawbPieces}
                />
            </Card>
        </Container>
    );
}

const Container = styled.div`
    max-width: 1000px;
    margin: 0 auto;
`;

const TableHeading = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
`;

const CustomTable = styled.table`
    width: 300px;
`;
