import React, {} from 'react';
import {Table} from 'reactstrap';

const NotificationRecords = ({
    toggleView,
    selectedCompany,
    possibleCompanies,
    selectedCompanyEmails,
    selectedCompanyPhones,
    handleModalCreateRecord,
    handleModalLaunchUpdateRecord,
    handleCompanySearch,
    handleEmailSearch,
    companySearchResults,
    handleCompanySelect,
    companySearchTerm,
    handleUpdateRecord,
    handleModalUniversal,
    halfWindow,
    width
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
        <div className='col-12'>
            <div className='row mb-2'>
                <div className='col-1 pr-0'>
                    Company Search
                </div>
                <div className='col-3 pl-0'>
                    <input value={companySearchTerm} onChange={(e) => handleCompanySearch(e)} style={{width: '100%'}} />
                </div>
            </div>
            <div className='row mb-2'>
                <div className='col-1 pr-0'>
                    Email Search
                </div>
                <div className='col-3 pl-0'>
                    <input onChange={(e) => handleEmailSearch(e)} style={{width: '100%'}} />
                </div>
            </div>
            <div className='row'>
                <div className='col-4 px-1'>
                    <h4 className='py-1 mb-0'>Companies</h4>
                    <Table striped className='mb-0' style={{tableLayout: 'fixed'}}>
                        <thead className='thead-dark'>
                            <tr className='text-white'>
                                <th style={{width: '10%'}} className='py-1'></th>
                                <th style={{width: '10%'}} className='py-1'>ID</th>
                                <th style={{width: '70%'}} className='py-1'>Company Name</th>
                                <th style={{width: ''}} className='py-1' style={{textAlign: 'right'}}>
                                    <i className='fas fa-plus-square fa-plus-square-active' onClick={() => handleModalCreateRecord('record')}></i>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </Table>
                    <div style={{overflowY: 'scroll', height: '610px'}}>
                        <Table striped style={{tableLayout: 'fixed'}}>
                            <thead className='thead-dark'>
                            </thead>
                            <tbody>
                                {
                                    companySearchResults && companySearchResults.map((c, i) => 
                                        <tr key={i} id={c.id} onClick={(e) => handleCompanySelect(c.id)}>
                                            <td style={{width: '5%'}} id={c.id} onClick={() => handleCompanySelect(c.id)} className={`${selectedCompany && selectedCompany.id === c.id ? 'fas fa-circle' : 'far fa-circle'}`} ></td>
                                            <td style={{width: '10%'}}>{c.i_record}</td>
                                            <td style={{width: '70%'}}>{c.s_name}</td>
                                            <td style={{width: ''}}>
                                                {/* <i className="fas fa-edit notify-edit" id={c.id} onClick={() => handleModalUniversal('modalUpdateRecordOpen')}></i> */}
                                                <i className="fas fa-edit notify-edit" id={c.id} onClick={() => handleModalLaunchUpdateRecord('company', 'update', c.id, c.s_name)}></i>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className='col-3 px-1'>
                    <h4 className='py-1 mb-0'>Possibe Names:</h4>
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
                    <div style={{overflowY: 'scroll', height: '610px', width: '100%'}}>
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
                </div>
                <div className='col-3 px-1'>
                    <h4 className='py-1 mb-0'>Emails:</h4>
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
                    <div style={{overflowY: 'scroll', height: '610px', width: '100%'}}>
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
                </div>
                <div className='col-2 px-1'>
                    <h4 className='py-1 mb-0'>Phone Numbers</h4>
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
                    <div style={{overflowY: 'scroll', height: '610px', width: '100%'}}>
                        <Table striped className='mb-0' style={{tableLayout: 'fixed'}}>
                            <thead className='thead-dark text-white'>
                            </thead>
                            <tbody>
                                {
                                    selectedCompanyPhones && selectedCompanyPhones.map((p, i) => 
                                        <tr key={i}>
                                            <td style={{width: '86%'}}>{p.s_phone}</td>
                                            <td>
                                                <i className="fas fa-edit notify-edit" id={p.id} onClick={() => handleModalLaunchUpdateRecord('phone', 'update', p.id, p.s_phone)}></i>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotificationRecords;

