import React from 'react';
import classnames from 'classnames';

export default function SaveButton ({
    enableSave,
    handleSave,
    className
}) {

    return (
        <i 
            className={classnames("far fa-save text-primary hover-pointer text-large", className, { customDisabled: !enableSave })} 
            onClick={handleSave}
            data-tip={'Save'}
        ></i>
    );
}
