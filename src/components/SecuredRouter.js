import React from 'react';
import { withRouter } from 'react-router-dom';
import SecuredRoute from "./SecuredRoute";
import SecuredRouteNoLogin from "./SecuredRouteNoLogin";
const REACT_APP_NO_LOGIN = JSON.parse(process.env.REACT_APP_NO_LOGIN || false);

const SecuredRouter = (props) => {
    if (REACT_APP_NO_LOGIN) {
        return <SecuredRouteNoLogin {...props} />
    } else {
        return <SecuredRoute {...props} />
    }
}

export default withRouter(SecuredRouter);