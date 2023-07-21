import React from 'react';
import {withRouter} from 'react-router-dom';

import ImportExportRecords from '../../components/shared/ImportExportRecords/ImportExportRecords';

const ExportRecords = ({
    user, baseApiUrl, headerAuthCode
}) => {

    return (
        <ImportExportRecords 
            user={user}
            s_type={'EXPORT'}
            baseApiUrl={baseApiUrl}
            headerAuthCode={headerAuthCode}
        />
    );
}

export default withRouter(ExportRecords);