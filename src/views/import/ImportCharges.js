import React from 'react';
import {withRouter} from 'react-router-dom';

import { useAppContext } from '../../context';
import ManagePayments from '../../components/shared/payments/ManagePayments';

const ImportCharges = () => {

    const { appData: {charges} } = useAppContext();

    return (
        <ManagePayments 
            s_payment_method={'CHARGES'}
            charges={charges}
        />
    );
}

export default withRouter(ImportCharges);