import React, { useState } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { tablesMap } from '../../components/edi/tablesMap';
import EdiComponent from '../../components/edi/EdiComponent';
import ImportFlightManifest from '../../components/edi/ImportFlightManifest';
import FfmManualEntry from '../../components/edi/FfmManualEntry';

export default function EdiFFM () {

    const { s_table, fieldsMapping } = tablesMap.ffm;

    return (
        <EdiComponent 
            s_type={'IMPORT'}
            s_table={s_table}
            fieldsMapping={fieldsMapping}
            tab2={{
                name: 'Import Flight Manifest',
                component: ImportFlightManifest
            }}
            tab3={{
                name: 'Manual Entry',
                component: FfmManualEntry
            }}
        />
    );
}