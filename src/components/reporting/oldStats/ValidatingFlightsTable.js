import React, {Fragment} from 'react';
import {Table, Row, Col} from 'reactstrap';

const ValidatingFlightsTable = ({
    validatingFlights,
    validatingFlightsFiltered
}) => {
    return (
        <Fragment>
            <Table>
                <thead>
                    <tr>
                        <td>Type</td>
                        <td>Date</td>
                        <td>Airline</td>
                        <td>FLT #</td>
                        <td>Validated</td>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </Table>
            <div>
                <Table>
                    <thead>

                    </thead>
                    <tbody>

                    </tbody>
                </Table>
            </div>
        </Fragment>
    );
}

export default ValidatingFlightsTable;
