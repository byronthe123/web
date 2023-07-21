import React from 'react';
import {Table} from 'reactstrap';

const CompanySearch = ({
    handleCompanySearch,
    companySearchResults,
    handleCompanySelect,
    companySearchTerm,
    selectedCompany,
    handleModalCreateRecord,
    handleUpdateRecord,
    handleModalUniversal,
    handleModalLaunchUpdateRecord
}) => {
    return (
        <div className='col-12 mt-0 mb-2 pr-0 pl-0'>
            <div className='row mb-2'>
                <div className='col-3 pr-0'>
                    Company Search
                </div>
                <div className='col-9 pl-0'>
                    <input value={companySearchTerm} onChange={(e) => handleCompanySearch(e)} style={{width: '100%'}} />
                </div>
            </div>
            <Table striped className='mb-0' style={{tableLayout: 'fixed'}}>
                <thead className='thead-dark'>
                    <tr className='text-white'>
                        <th style={{width: '10%'}} className='py-1'></th>
                        <th style={{width: '15%'}} className='py-1'>ID</th>
                        <th style={{width: '65%'}} className='py-1'>Company Name</th>
                        <th style={{width: ''}} className='py-1' style={{textAlign: 'right'}}>
                            <i className='fas fa-plus-square fa-plus-square-active' onClick={() => handleModalCreateRecord('record')}></i>
                        </th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </Table>
            <div style={{overflowY: 'scroll', height: '200px'}}>
                <Table striped style={{tableLayout: 'fixed'}}>
                    <thead className='thead-dark'>
                    </thead>
                    <tbody>
                        {
                            companySearchResults && companySearchResults.map((c, i) => 
                                <tr key={i} id={c.id} onClick={(e) => handleCompanySelect(c.id)}>
                                    <td style={{width: '5%'}} id={c.id} onClick={(e) => handleCompanySelect(e)} className={`${selectedCompany && selectedCompany.id === c.id ? 'fas fa-circle' : 'far fa-circle'}`} ></td>
                                    {/* <td style={{width: '5%'}} id={c.s_name} onClick={(e) => handleCompanySelect(e)} className={`${selectedCompany && selectedCompany.s_name === c.s_name ? 'fas fa-circle' : 'far fa-circle'}`} ></td> */}
                                    <td style={{width: '15%'}}>{c.i_record}</td>
                                    <td style={{width: '65%'}}>{c.s_name}</td>
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
    );
}

export default CompanySearch;
