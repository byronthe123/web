
import React from 'react';
import { DefaultToastContainer } from 'react-toast-notifications';

export default function ToastContainer (props) {
    return (
        <DefaultToastContainer
            className="toast-container"
            style={{ zIndex: "999999" }}
            {...props}
        />
    );
};