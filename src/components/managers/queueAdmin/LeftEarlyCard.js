import React from 'react';
import moment from 'moment';

const LeftEarlyCard = ({company, setCompanyToRestore, width, processingCompany, user}) => {

    const timeSince = (_start) => {
        const start = moment(_start)
        const now = moment();
        const diff = moment.duration(moment(now).diff(moment(start)));
        var days = parseInt(diff.asDays()); //84
        var hours = parseInt(diff.asHours()); //2039 hours, but it gives total hours in given miliseconds which is not expacted.
        hours = hours - days*24;  // 23 hours
        var minutes = parseInt(diff.asMinutes()); //122360 minutes,but it gives total minutes in given miliseconds which is not expacted.
        minutes = minutes - (days*24*60 + hours*60);
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        hours = hours - 5;
        return `${hours}:${minutes}`;
    }

    const getTruckingCoTimeWaiting = (company) => {
        return timeSince(company.t_kiosk_submitted);
    };

    const resolveBackground = (company) => {
        const state = company.s_state;
        switch(state) {
            case 'EXPORT':
                return '#61B996';
            case 'IMPORT':
                return '#6BB4DD';
            case 'MIXED': 
                return 'goldenrod';
        }
    };

    const resovleOwnershipName = (email) => {
        return email !== null ? email.replace('@choice.aero', '') : '';
    }

    const resolveWaitingTime = () => {
        const ownershipTime = moment.utc(company.t_counter_ownership).format('MM/DD/YYYY hh:mm A');
        const timeWaitingSinceOwnership = timeSince(company.t_counter_ownership);
        return `${ownershipTime} ${timeWaitingSinceOwnership}`;
    }

    const resolveTruckingCompanyName = (name) => {
        if (name.length > 20) {
            return `${name.substr(0, 28)}..`;
        }
        return name;
    }

    return(
        <div className={`px-2 col-4`}>
            <div className={`card pb-3 my-2 px-0`} style={{borderRadius: '0.75rem', backgroundColor: resolveBackground(company), boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', fontSize: '16px', position: 'relative'}}>
                <div className="card-body-waiting my-auto px-3 pt-3 pb-2">
                    <h5 className="mt-0 mb-2"><span className="fas fa-undo mr-1" onClick={() => setCompanyToRestore(company)}></span>{company.s_trucking_company}</h5>
                    <div style={{position: 'absolute', right: '2%', top: '10%'}}>
                        <span className="bg-info px-1 ml-1">{company.exportCount}</span>
                        <span className="bg-success px-1">{company.importCount}</span>
                    </div>
                    <div className={`d-flex align-content-center flex-wrap justify-content-center my-auto waiting-card-subtitle bg-white mb-1 text-center`}>
                        {company.s_trucking_driver}
                    </div>                
                    <div className="mt-2" style={{height: '45px'}}>
                        <p style={{float: 'left', fontSize: '16px'}} className='mb-0'>{moment.utc(company.t_kiosk_submitted).format('MM/DD/YYYY hh:mm A')}</p>
                        <p style={{float: 'right', fontSize: '16px'}} className="mb-0">{getTruckingCoTimeWaiting(company)}</p>
                    </div>
                </div>
                <div className='div-processing-agent' style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', position: 'absolute', bottom: 0}}>
                    <p className='mb-0'>Agent: {resovleOwnershipName(company.s_abandoned_agent)}</p>
                    <p className='mb-0'>Removed: {moment(company.t_abandoned).format('MM/DD/YYYY hh:mm A')}</p>
                </div>
            </div>
        </div>
    );
}

export default LeftEarlyCard;