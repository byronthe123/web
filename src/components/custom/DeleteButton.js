import React from 'react';
import classnames from 'classnames';

export default function DeleteButton ({
    handleDelete,
    className
}) {
    return (
        <i 
            className={classnames(`far fa-trash-alt text-danger hover-pointer text-large`, className)} 
            onClick={() => handleDelete()}
            data-tip={'Delete'}
        ></i>
    );
}
