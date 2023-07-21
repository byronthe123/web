import React from 'react';
import moment from 'moment';

const FoundCcsf = ({foundCcsf, validIacAlsoCcsf}) => {
    return(
        <div className="div-out-iac-ccsf mt-2 mx-auto" style={{ fontSize: '16px' }}>
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">CCSF #:</th>
                        <th scope="col">Certified Cargo Screening Facility:</th>
                        <th scope="col">Address:</th>
                        <th scope="col">Expiration:</th>
                        <th scope="col">IAC Number</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row" style={{backgroundColor: `${foundCcsf.valid ? 'white' : 'red'}`, fontWeight: 'bold'}}>
                            {foundCcsf.approval_number}
                        </th>
                        <td>{foundCcsf.certified_cargo_screening_facility_name}</td>
                        <td>{foundCcsf.street_address}, {foundCcsf.city}, {foundCcsf.state}</td>
                        <td style={{backgroundColor: `${foundCcsf.valid ? 'white' : 'red'}`, color: `${foundCcsf.valid ? '#037d50' : 'black'}`, fontWeight: 'bolder'}}>
                            {moment.utc(foundCcsf.ccsf_expiration_date).format('MM/DD/YYYY')}
                        </td>
                        <td style={{backgroundColor: `${validIacAlsoCcsf() ? '#90ee90' : 'red'}`, fontWeight: 'bolder'}}>
                            {foundCcsf.iac_number}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default FoundCcsf;