import React from 'react';
import {Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const DropDownButton = ({
    dropDownOpen,
    toggleDropDownButton,
    title,
    dropDownArray,
    setDropDownOpen
}) => {

    console.log(dropDownArray);

    return (
        <ButtonDropdown isOpen={dropDownOpen} onClick={() => setDropDownOpen(!dropDownOpen)}>
            <DropdownToggle caret color='info'>
                {title}
            </DropdownToggle>
            <DropdownMenu>
                {
                    dropDownArray.map((d, i) => 
                        <DropdownItem key={i} onClick={() => d.action()}>{d.title}</DropdownItem>
                    )
                }
                <DropdownItem >test</DropdownItem>
            </DropdownMenu>
        </ButtonDropdown>
    );
}

export default DropDownButton;