import React from 'react';

const CompanyCardDetails = ({company, myAssignment, removeOwnership, hover, handleSelectAwb, awbsArray}) => {

    const resolveBackground = () => {
        if(company.s_type === 'EXPORT') {
            return `url(/assets/img/bg-blue-sm.png)`;
        }
        return `url(/assets/img/bg-green-sm.png)`;
    }

    return (
        <div className={`card my-1 px-2 py-2 ${hover ? 'company-card-details-hover' : ''}`} style={{borderRadius: "0.75rem 0.75rem", backgroundImage: resolveBackground(), backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}} onClick={() => handleSelectAwb && handleSelectAwb(company, awbsArray)}>
            {/* <h6 className="my-0 py-0 text-dark" style={{fontWeight: 'bold'}}>{company.s_type}</h6> */}
            <h4 className="my-0 py-0 text-dark" style={{fontWeight: 'bold'}}>
                <div className='row'>
                    <div className='col-10'>
                        {/* <div className='row mx-0'>
                            <img src={company.logo_url} style={{width: '120px', height: 'auto'}} />
                        </div> */}
                        <div className='row mx-0'>
                            <div className='col-6 pl-0'>
                                <h1 className='mt-3'>{company.s_mawb}</h1>
                            </div>
                            <div className='col-6'>
                                <img src={company.logo_url} style={{width: '240px', height: 'auto'}} />
                            </div>
                        </div>
                    </div>
                    <div className='col-2 pt-4' style={{color: 'grey'}}>
                        {myAssignment ? <span className='fas fa-trash-alt mr-1' onClick={() => removeOwnership(company.s_mawb_id)} style={{float: 'right', fontSize: '20px'}}></span> : null}
                    </div>
                </div>
            </h4>
        </div>
    );
}

export default CompanyCardDetails;