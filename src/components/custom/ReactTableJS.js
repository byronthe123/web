import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Button } from 'reactstrap';
import ReactTable from "react-table";
import { formatMawb, formatPercent } from '../../utils';
import _ from 'lodash';

import {
    useWindowSize,
} from '@react-hook/window-size';

export default ({
    data,
    mapping,
    handleClick,
    numRows,
    locked,
    index,
    enableClick,
    customHeight,
    defaultFiltered,
    reactTableRef,
    className,
    selectedIds,
    disableGlobalFilter
}) => {

    /* 
        export const mapping = [
            {
                name: 'ID',
                value: 'id',
                datetime: true,
                utc: true,
                email: true,
                money: true,
                icon: true,
                nested: true,
                subvalue: '',
                function: (item) => removeStationCustomer(item.stationCustomerRecordId)
            },
        ]
    */

    const [selectedRow, setSelectedRow] = useState('');
    const [dataTableColumns, setDataTableColumns] = useState([]);

    useEffect(() => {
        const resolveDataTableColumns = () => {
            const dataTableColumns = [];
    
            if (index) {
                dataTableColumns.push({
                    Header: "#",
                    id: "row",
                    maxWidth: 50,
                    filterable: true,
                    Cell: (row) => {
                        return <div>{row.index + 1}</div>;
                    }
                });
            }
    
            for (let i = 0; i < mapping.length; i++) {
    
                const current = mapping[i];
                !current.exclude && dataTableColumns.push({
                    id: current.id ? current.id : `id${i}`,
                    Header: current.name,
                    accessor: (d) => 
                        current.datetime || current.date ?
                            moment(d[current.value]).isValid() ? 
                                current.utc ?
                                    current.datetime ?
                                        moment.utc(d[current.value]).format('MM/DD/YYYY HH:mm:ss') :
                                        moment.utc(d[current.value]).format('MM/DD/YYYY') :
                                    current.datetime ?
                                        moment(d[current.value]).format('MM/DD/YYYY HH:mm:ss') : 
                                        moment(d[current.value]).format('MM/DD/YYYY') :
                                '' :
                        current.shortDate ?
                            current.utc ? 
                                moment.utc(d[current.value]).format('MM-DD HH:mm') :
                                moment(d[current.value]).format('MM-DD HH:mm'):
                        current.money ? 
                            `$${formatCost(d[current.value])}` : 
                        current.decimal ? 
                            _.get(d, `[${current.value}]`, '').toFixed(1) :
                        current.email ? 
                            d[current.value] && `${d[current.value].toUpperCase().replace('@CHOICE.AERO', '')}` :
                        current.icon && current.selectable && selectedIds[d.id] ? 
                            <i style={{width: 50}} className={current.value} onClick={() => current.function && current.function(d)} /> :
                        current.icon && current.selectable && !selectedIds[d.id] ? 
                            <i style={{width: 50}} className={current.valueOther} onClick={() => current.function && current.function(d)} /> :
                        current.icon && current.showCondition && current.showCondition(d) ?
                            <i style={{width: 50}} className={current.value} onClick={() => current.function && current.function(d)} /> :
                        current.icon && !current.showCondition ?
                            <i style={{width: 50}} className={current.value} onClick={() => current.function && current.function(d)} /> :
                        current.boolean ?
                            d[current.value] ? (current.labelTrue || 'YES') : (current.labelFalse || 'NO') :
                        current.button ?
                            <Button 
                                color={current.color || 'primary'} 
                                onClick={() => current.function && current.function(d)}
                                disabled={(current.disabled && current.disabled(d)) || false}
                            >
                                {current.value}
                            </Button> :
                        current.concat ?
                            <span>{resolveConcatValues(d, current.values, current.operator)}</span> :
                        current.nested ?                        
                            d[current.value] && d[current.value][current.subvalue] && d[current.value][current.subvalue] :
                        current.deepNested ?
                            resolveDeepNested(d, current.keys) :
                        current.nestedArray     ? 
                            <span>{resolveNestedArray(d, current.value, current.subvalue, current.operator)}</span> :
                        current.image ?
                            current.square ?
                                <span className={'mx-auto text-center'}><img src={`${getSquareImage(d[current.value])}`} style={{ width: 30, height: 30 }} /></span> :
                            <span className={'mx-auto text-center'}><img src={`${current.square ? `${getSquareImage(d[current.value])}` : d[current.value]}`} style={{ width: current.imageWidth || '200px', height: current.imageHeight || 'auto' }} /></span> :
                        current.importPaymentMethod ? 
                            d['f_amount'] < 0 ? 'CHARGE' :
                            d['f_amount'] > 0 && d[current.value] !== 'OVERRIDE' ? 'PAYMENT' : d[current.value] :
                        current.s_mawb ? 
                            formatMawb(d[current.value]) :
                        current.percent ? 
                            formatPercent(d[current.value]) :
                        current.breakdownUnder ? 
                            Math.abs(Math.max(d['i_actual_piece_count'] - d['rackPieces'], 0)) :
                        current.breakdownOver? 
                            Math.abs(Math.min(d['i_actual_piece_count'] - d['rackPieces'], 0)) :
                        d[current.value],
                    columns: current.multiple ? [] : null,
                    style: { 
                        textAlign: `${(current.money || current.percent || current.number) ? 'right' : current.icon || current.button ? 'center' : 'left'}`
                    },
                    width: current.icon && 50 || current.smallWidth && 50 || 
                           current.percent && 65 ||
                           current.mediumWidth && 75 ||
                           current.medLargeWidth && 125 ||
                           current.largeWidth && 250 ||
                           current.extraLargeWidth && 350 ||
                           current.maxWidth && 500 ||
                           current.date && 100 ||
                           current.datetime && 160 ||
                           current.s_mawb && 136 ||
                           current.square && 35 ||
                           current.customWidth && current.customWidth,
                    filterable: 
                        disableGlobalFilter ? false : 
                        (current.icon || current.button || current.image) ? false : 
                        true,
                    sortMethod: current.sortMethod && current.sortMethod
                });
            }
            return dataTableColumns;
        }
        setDataTableColumns(resolveDataTableColumns(data));
    }, [data, selectedIds]);

    const getSquareImage = (url) => {
        if (url && url.length > 0) {
            return url.replace('.png', '-sq.png');
        }
        return '';
    }

    const filterCaseInsensitive = (filter, row) => {
        const id = filter.pivotId || filter.id;
        if (row[id] !== null && typeof row[id] === 'string') {
            return (
                row[id] !== undefined ?
                    String(row[id].toLowerCase()).includes(filter.value.toLowerCase()) : true
            )
        }
        else {
            return (
                String(row[filter.id]) === filter.value
            )
        }
    }

    const onRowClick = (state, rowInfo, column, instance) => {
        return {
            onClick: e => {
                handleClick && handleClick(rowInfo.original);
                setSelectedRow(rowInfo.index);
                // console.log('A Td Element was clicked!')
                // console.log('it produced this event:', e)
                // console.log('It was in this column:', column)
                // console.log('It was in this row:', rowInfo) //rowInfo.original
                // console.log('It was in this table instance:', instance)
            },
            style: {
                backgroundColor: enableClick && rowInfo && rowInfo.index === selectedRow ? '#6fb327' : null,
                color: enableClick && rowInfo && rowInfo.index === selectedRow ? 'white' : 'black'
            }
        }
    }

    const formatCost = (cost) => {
        if (cost < 0) {
            const useCost = parseFloat(Math.abs(cost)); 
            return `${useCost.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
        }
        const toFormat = cost && cost !== null && cost > 0 ? parseFloat(cost) : 0;
        return `${toFormat.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    }

    const resolveConcatValues = (d, values, operator) => {
        let string = '';

        values && values.map(v => string += `${d[v]}${operator}`);

        if(string[string.length-1] === operator) {
            string = string.substring(0, string.length-1);
        }

        return string;
    }

    const resolveNestedArray = (d, value, subvalue, operator) => {
        let string = '';
        const array = d[value] || [];
        array.map(a => string += `${a[subvalue]}${operator} `);
        string = string.substr(0, string.length - 2);
        return string;
    }

    const resolveDeepNested = (d, keys) => {
        for (let i = 0; i < keys.length; i++) {
            d = d[keys[i]];
        }
        return d;
    }
    
    // for (let i = 0; i < mapping.length; i++) {
    //     const current = mapping[i];
    //     dataTableColumns.push({
    //         Header: current.name,
    //         accessor: current.value,
    //         Cell: props => <p className="list-item-heading">
    //             {
    //                 current.datetime ? 
    //                     moment(props.value).format('MM/DD/YYYY HH:mm:ss') : 
    //                 current.money ? 
    //                     `$${formatCost(props.value)}` : 
    //                 current.email ? 
    //                     `${props.value.replace('@choice.aero', '')}` :
    //                 props.value
    //             }
    //         </p>,
    //         style: { textAlign: `${current.money ? 'right' : 'left'}` }
    //     });
    // }

    return (
        <ReactTable
            data={data}
            columns={dataTableColumns}
            defaultPageSize={numRows}
            showPageSizeOptions={ locked ? false : true }
            filterable={true}
            defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
            getTrProps={onRowClick}
            className={`-striped -highlight ${className}`}
            style={{
                height: `${customHeight && customHeight}`
            }}
            defaultFiltered={defaultFiltered}
            ref={reactTableRef}
        />
    );
}