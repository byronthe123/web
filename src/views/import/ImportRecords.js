import React from 'react';
import {withRouter} from 'react-router-dom';

import ImportExportRecords from '../../components/shared/ImportExportRecords/ImportExportRecords';

const ImportRecords = ({
    user, baseApiUrl, headerAuthCode
}) => {

    return (
        <ImportExportRecords 
            user={user}
            s_type={'IMPORT'}
            baseApiUrl={baseApiUrl}
            headerAuthCode={headerAuthCode}
        />
    );
}

export default withRouter(ImportRecords);