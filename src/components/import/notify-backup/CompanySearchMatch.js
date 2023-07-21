import React, {Fragment} from 'react';
import {Table} from 'reactstrap';

const CompanySearchMatch = ({
    selectedCompany,
    possibleCompanies,
    handleCompanySelect,
    selectedCompanyEmails,
    selectedCompanyPhones,
    handleModalCreateRecord,
    handleModalLaunchUpdateRecord
}) => {

    const enableAddNameEmailPhone = () => {
        return selectedCompany && selectedCompany !== null;
    }

    const preHandleModalCreateRecord = (type) => {
        if (enableAddNameEmailPhone()) {
            handleModalCreateRecord(type);
        }
    }

    return (
        <Fragment>
            <div className='col-12'>
                <div className='row mb-2'>
                    <Table striped className='mb-0'>
                        <thead className='thead-dark text-white'>
                            <th className='py-1'>Possible Names</th>
                            <th className='py-1' style={{textAlign: 'right'}}>
                                <i className={`fas fa-plus-square ${enableAddNameEmailPhone() ? 'fa-plus-square-active' : 'fa-plus-square-disabled'}`} onClick={() => preHandleModalCreateRecord('name')}></i>
                            </th>
                        </thead>
                        <tbody>
                        </tbody>
                    </Table>
                    <div style={{overflowY: 'scroll', height: '125px', width: '100%'}}>
                        <Table striped>
                            <thead className='thead-dark text-white'>
                            </thead>
                            <tbody>
                                {
                                    possibleCompanies && possibleCompanies.map((c, i) => 
                                        <tr key={i}>
                                            <td style={{width: '90%'}}>{c.s_name}</td>
                                            <td>
                                                <i className="fas fa-edit notify-edit" id={c.id} onClick={() => handleModalLaunchUpdateRecord('name', 'update', c.id, c.s_name)}></i>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </div>
                    {/* <button className='btn btn-primary mt-2' disabled={enableAddNameEmailPhone()} onClick={() => handleModalCreateRecord('name')}>Add Name</button> */}
                </div>
                <div className='row mb-2'>
                <Table striped className='mb-0'>
                    <thead className='thead-dark text-white'>
                        <th className='py-1'>Emails</th>
                        <th className='py-1' style={{textAlign: 'right'}}>
                            <i className={`fas fa-plus-square ${enableAddNameEmailPhone() ? 'fa-plus-square-active' : 'fa-plus-square-disabled'}`} onClick={() => preHandleModalCreateRecord('email')}></i>
                        </th>
                    </thead>
                    <tbody>
                    </tbody>
                    </Table>
                    <div style={{overflowY: 'scroll', height: '150px', width: '100%'}}>
                        <Table striped style={{tableLayout: 'fixed'}}>
                            <thead className='thead-dark text-white'>
                            </thead>
                            <tbody>
                                {
                                    selectedCompanyEmails && selectedCompanyEmails.map((e, i) => 
                                        <tr key={i}>
                                            <td style={{width: '90%'}}>{e.s_email}</td>
                                            <td>
                                                <i className="fas fa-edit notify-edit" id={e.id} onClick={() => handleModalLaunchUpdateRecord('email', 'update', e.id, e.s_email)}></i>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </div>
                    {/* <button className='btn btn-primary mt-2' disabled={enableAddNameEmailPhone()} onClick={() => handleModalCreateRecord('email')}>Add Email</button>                                    */}
                </div>
                <div className='row'>
                    <Table striped className='mb-0'>
                        <thead className='thead-dark text-white'>
                            <th className='py-1'>Phone Numbers</th>
                            <th className='py-1' style={{textAlign: 'right'}}>
                                <i className={`fas fa-plus-square ${enableAddNameEmailPhone() ? 'fa-plus-square-active' : 'fa-plus-square-disabled'}`} onClick={() => preHandleModalCreateRecord('phone')}></i>
                            </th>
                        </thead>
                        <tbody>
                        </tbody>
                    </Table>
                        <div style={{overflowY: 'scroll', height: '150px', width: '100%'}}>
                            <Table striped className='mb-0' style={{tableLayout: 'fixed'}}>
                                <thead className='thead-dark text-white'>
                                </thead>
                                <tbody>
                                    {
                                        selectedCompanyPhones && selectedCompanyPhones.map((p, i) => 
                                            <tr key={i}>
                                                <td style={{width: '90%'}}>{p.s_phone}</td>
                                                <td>
                                                    <i className="fas fa-edit notify-edit" id={p.id} onClick={() => handleModalLaunchUpdateRecord('phone', 'update', p.id, p.s_phone)}></i>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                        </div>
                        {/* <button className='btn btn-primary mt-2' disabled={enableAddNameEmailPhone()} onClick={() => handleModalCreateRecord('phone')}>Add Phone Number</button> */}
                    </div>
                </div>
        </Fragment>
    );
}

export default CompanySearchMatch;