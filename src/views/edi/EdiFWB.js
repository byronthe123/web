import React from 'react';
import { tablesMap } from '../../components/edi/tablesMap';
import EdiComponent from '../../components/edi/EdiComponent';

export default function EdiFFM () {

    const { s_table, fieldsMapping } = tablesMap.fwb;

    return (
        <EdiComponent 
            s_type={'IMPORT'}
            s_table={s_table}
            fieldsMapping={fieldsMapping}
        />
    );
}