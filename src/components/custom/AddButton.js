import React from 'react';
import classnames from 'classnames';

export default function AddButton ({
    enableAdd,
    handleAdd,
    className
}) {

    return (
        <i 
            className={classnames("fad fa-plus-circle text-primary hover-pointer text-large", className, { customDisabled: !enableAdd })} 
            onClick={handleAdd}
            data-tip={'Add'}
        ></i>
    );
}
