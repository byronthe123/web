import React from 'react';
import moment from 'moment';

const FoundIac = ({foundIac, validIacAlsoCcsf}) => {
    return(
        <div className="div-out-iac-ccsf mx-auto my-2" style={{ fontSize: '16px' }}>
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">IAC #:</th>
                        <th scope="col">Indirect Carrier Name:</th>
                        <th scope="col">Address:</th>
                        <th scope="col">Expiration:</th>
                        <th scope="col">IACSSP_08_001</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row" style={{backgroundColor: `${validIacAlsoCcsf() ? '#90ee90' : 'red'}`}}>{foundIac.approval_number}</th>
                        <td>{foundIac.indirect_carrier_name}</td>
                        <td>{foundIac.city}, {foundIac.state}, {foundIac.postal_code}</td>
                        <td style={{backgroundColor: `${foundIac.valid ? 'white' : 'red'}`, color: `${foundIac.valid ? '#037d50' : 'black'}`, fontWeight: 'bolder'}}>
                            {moment.utc(foundIac.expiration_date).format('MM/DD/YYYY')}
                        </td>
                        <td>{foundIac.IACSSP_08_001}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default FoundIac;