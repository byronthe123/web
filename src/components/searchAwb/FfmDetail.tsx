import dayjs from 'dayjs';
import React from 'react';
import _ from 'lodash';
import { Row, Col, Table } from 'reactstrap';
import Select from 'react-select';
import {  ISelectOption, IFWB } from '../../globals/interfaces';

type Props = {
    searchAwbNum: string,
    step: string,
    ffmOptions: Array<ISelectOption>,
    totalPcs: number,
    totalWgt: number,
    origin: string,
    dest: string,
    lastFreeDate: string,
    storageStart: string,
    ffmOption: ISelectOption,
    handleSetFfmOption: (ffmOption: ISelectOption) => void, 
    fwbs: Array<IFWB>
}

export default function FfmDetail ({ 
    searchAwbNum, 
    step,
    ffmOptions,
    totalPcs,
    totalWgt,
    origin,
    dest,
    lastFreeDate,
    storageStart,
    ffmOption,
    handleSetFfmOption, 
    fwbs 
}: Props) {

    return (
        <Row>
            <Col md={12}>
                <h4>MAWB: {searchAwbNum}</h4>
                <Table striped>
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>Pieces: {totalPcs}</td>
                            <td>Weight: {totalWgt}</td>
                        </tr>
                        <tr>
                            <td>Origin: {origin}</td>
                            <td>Destination: {dest}</td>
                        </tr>
                        <tr>
                            <td>Goods</td>
                            {/* @ts-ignore */}
                            <td>{_.get(fwbs, '[0]', {}).s_goods_description}</td>
                        </tr>
                        <tr>
                            <td>LFD: {dayjs(lastFreeDate).format('MM/DD/YYYY')}</td>
                            <td>Storage: {dayjs(storageStart).format('MM/DD/YYYY')}</td>
                        </tr>
                    </tbody>
                </Table>

                <h4>Flight Manifest - FFM {ffmOptions.length}</h4>
                <Select 
                    options={ffmOptions}
                    value={ffmOption}
                    onChange={(option: ISelectOption) => handleSetFfmOption(option)}
                />

            </Col>
        </Row>
    );
}
