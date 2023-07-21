import React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import MoonLoader from 'react-spinners/MoonLoader';


type Types = 'save' | 'print' | 'delete' | 'add' | 'update' | 'csv' | 'check' | 'cancel' | 'download';

interface Props {
    onClick: () => void;
    type: Types,
    className?: string;
    disabled?: boolean;
    baseline?: boolean;
    size?: number;
    disabledDataTip?: string;
    loading?: boolean;
}

interface MapProps {
    icon: string;
    color: string;
    tip: string;
}

const map: Record<Types, MapProps> = {
    save: {
        icon: 'fa-floppy-disk',
        color: 'success',
        tip: 'Save'
    },
    print: {
        icon: 'fa-print',
        color: 'success',
        tip: 'Print'
    },
    csv: {
        icon: 'fa-file-download',
        color: 'success',
        tip: 'Export to CSV'
    },
    delete: {
        icon: 'fa-trash-can',
        color: 'danger',
        tip: 'Delete'
    },
    add: {
        icon: 'fa-plus-circle',
        color: 'success',
        tip: 'Add' 
    },
    update: {
        icon: 'fa-edit',
        color: 'success',
        tip: 'Update' 
    },
    check: {
        icon: 'fa-duotone fa-circle-check',
        color: 'success',
        tip: 'Confirm' 
    },
    cancel: {
        icon: 'fa-duotone fa-circle-xmark',
        color: 'danger',
        tip: 'Cancel' 
    },
    download: {
        icon: 'fa-duotone fa-file-arrow-down',
        color: 'success',
        tip: 'Download' 
    }
}

export default function ActionIcon ({
    onClick,
    className,
    type,
    disabled,
    baseline,
    size,
    disabledDataTip,
    loading
}: Props) {

    if (loading) {
        return (
            <MoonLoader 
                size={28}
                color={'#176c33'}
            />
        );
    }

    return (
        <>
            <Icon 
                className={
                    classnames(
                        'fa-duotone', 
                        map[type].icon,  
                        `text-${map[type].color}`,
                        className,
                        { 'custom-disabled': disabled }
                    )
                } 
                onClick={() => onClick()}
                data-tip={disabled ? (disabledDataTip || '') : map[type].tip}
                baseline={baseline}
                size={size}
            />
            <ReactTooltip />
        </>
    );
}

interface IconProps {
    baseline?: boolean;
    size?: number;
}

const Icon = styled.i<IconProps>`
    font-size: ${p => p.size ? p.size + 'px' : '36px'};
    position: ${p => p.baseline ? 'relative' : null};
    top: ${p => p.baseline ? '10px' : null};

    &:hover {
        cursor: pointer;
    }
`;