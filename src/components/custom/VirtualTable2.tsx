import React, { useState, useEffect, useContext, useMemo } from 'react';
import moment from 'moment';
import { Button } from 'reactstrap';
import ReactTable from 'react-table';
import _ from 'lodash';
import { WithWizard } from 'react-albus';
import classnames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { AppContext } from '../../context/index';
import { IMap } from '../../globals/interfaces';
import { formatMawb, formatPercent } from '../../utils';
import useDev from '../../customHooks/useDev';
import styled from 'styled-components';

const getSquareImage = (url: string) => {
    if (url && url.length > 0) {
        return url.replace('.png', '-sq.png');
    }
    return '';
};

interface RenderImageProps {
    value: string;
    square?: boolean;
    imageWidth?: string;
    imageHeight?: string;
}

const RenderImage = ({
    value,
    square,
    imageWidth,
    imageHeight,
}: RenderImageProps) => {
    console.log(imageHeight);

    const useValue = square ? getSquareImage(value) : value;

    return (
        <span className={'mx-auto text-center'}>
            <img
                alt={''}
                src={useValue}
                style={
                    square
                        ? { width: '30px', height: '30px' }
                        : { width: imageWidth, height: imageHeight || 'auto' }
                }
            />
        </span>
    );
};

interface Props {
    data: Array<any>;
    mapping: Array<IMap<any>>;
    handleClick?: (item: any) => void;
    numRows?: number;
    locked?: boolean;
    index?: boolean;
    enableClick?: boolean;
    customHeight?: string;
    defaultFiltered?: Array<any>;
    reactTableRef?: any;
    className?: string;
    disableGlobalFilter?: any;
    wizardNext?: boolean;
    onClickNext?: any;
    defaultSorting?: any;
    noPagination?: boolean;
    customPagination?: boolean;
    selectable?: boolean;
    updatedSelectedIds?: (ids: Set<string>) => void;
}

export default function VirtualTable({
    data,
    mapping,
    handleClick,
    numRows,
    locked,
    index = true,
    enableClick,
    customHeight,
    defaultFiltered,
    reactTableRef,
    className,
    disableGlobalFilter,
    wizardNext,
    onClickNext,
    defaultSorting,
    noPagination,
    selectable,
    updatedSelectedIds
}: Props) {

    const { searchAwb, user } = useContext(AppContext);
    const { handleSearchAwb } = searchAwb;
    const [selectedRow, setSelectedRow] = useState('');
    const isDev = useDev(user);
    const [waitNext, setWaitNext] = useState(false);
    // Initial state for selectedRows set
    const [selectedRows, setSelectedRows] = useState(new Set<string>());

    console.log(selectedRows);

    // Function to toggle row selection
    const toggleRowSelection = (rowId: string | number) => {
        console.log(rowId);
        setSelectedRows(prevSelectedRows => {
            if (prevSelectedRows.has(String(rowId))) {
                const newSelectedRows = new Set(prevSelectedRows);
                newSelectedRows.delete(String(rowId));
                return newSelectedRows;
            } else {
                return new Set(prevSelectedRows.add(String(rowId)));
            }
        });
    };

    useEffect(() => {
        updatedSelectedIds && updatedSelectedIds(selectedRows);
    }, [selectedRows]);

    const handleNext = (item: any) => {
        handleClick && handleClick(item);
        setWaitNext(true);
    };

    const dataTableColumns = useMemo(() => {
        const columns = [];

        columns.push({
            Header: '#',
            id: 'row',
            maxWidth: 50,
            filterable: false,
            Cell: (row: any) => {
                return (
                    <div style={{ textAlign: 'right' }}>{row.index + 1}</div>
                );
            },
        });

        for (let i = 0; i < mapping.length; i++) {
            const current = mapping[i];
            if (current.exlude) continue;

            const column = {
                id: current.id ? current.id : `id${i}`,
                Header: current.name,
                accessor: (d: any) =>
                    current.datetime || current.date ? (
                        d[current.value] &&
                        moment(d[current.value]).isValid() ? (
                            current.utc ? (
                                current.datetime ? (
                                    moment
                                        .utc(d[current.value])
                                        .format('MM/DD/YYYY HH:mm')
                                ) : (
                                    moment
                                        .utc(d[current.value])
                                        .format('MM/DD/YYYY')
                                )
                            ) : current.datetime ? (
                                moment(d[current.value]).format(
                                    'MM/DD/YYYY HH:mm'
                                )
                            ) : (
                                moment(d[current.value]).format('MM/DD/YYYY')
                            )
                        ) : (
                            ''
                        )
                    ) : current.shortDate ? (
                        current.utc ? (
                            moment.utc(d[current.value]).format('MM-DD HH:mm')
                        ) : (
                            moment(d[current.value]).format('MM-DD HH:mm')
                        )
                    ) : current.monthYear && d[current.value] ? (
                        current.utc ? (
                            moment.utc(d[current.value]).format('MM/YY HH:mm')
                        ) : (
                            moment(d[current.value]).format('MM/YY HH:mm')
                        )
                    ) : current.monthDay && d[current.value] ? (
                        current.utc ? (
                            moment.utc(d[current.value]).format('MM/DD HH:mm')
                        ) : (
                            moment(d[current.value]).format('MM/DD HH:mm')
                        )
                    ) : current.money ? (
                        `$${formatCost(d[current.value])}`
                    ) : current.decimal ? (
                        _.get(d, `[${current.value}]`, '').toFixed(1)
                    ) : current.email ? (
                        d[current.value] &&
                        `${d[current.value]
                            .toUpperCase()
                            .replace('@CHOICE.AERO', '')}`
                    ) : current.icon &&
                      current.showCondition &&
                      current.showCondition(d) ? (
                        <i
                            style={{ width: current.customWidth || 50 }}
                            className={current.value}
                            onClick={() =>
                                current.function && current.function(d)
                            }
                        />
                    ) : current.icon && !current.showCondition ? (
                        <i
                            style={{ width: current.customWidth || 50 }}
                            className={current.value}
                            onClick={() =>
                                current.function && current.function(d)
                            }
                        />
                    ) : current.boolean && current.showCondition ? (
                        current.showCondition(d) ? (
                            'YES'
                        ) : (
                            'NO'
                        )
                    ) : current.boolean && !current.showCondition ? (
                        d[current.value] ? (
                            current.labelTrue || 'YES'
                        ) : (
                            current.labelFalse || 'NO'
                        )
                    ) : current.button ? (
                        <Button
                            color={current.color || 'primary'}
                            onClick={() =>
                                current.function && current.function(d)
                            }
                            disabled={
                                (current.disabled && current.disabled(d)) ||
                                false
                            }
                        >
                            {current.value}
                        </Button>
                    ) : current.concat ? (
                        <span>
                            {resolveConcatValues(
                                d,
                                current.values,
                                current.operator
                            )}
                        </span>
                    ) : current.nested ? (
                        current.image ? (
                            <RenderImage
                                value={_.get(
                                    d,
                                    `[${current.value}][${current.subvalue}]`,
                                    ''
                                )}
                                square={current.square}
                                imageWidth={current.imageWidth}
                                imageHeight={current.imageHeight}
                            />
                        ) : (
                            _.get(
                                d,
                                `[${current.value}][${current.subvalue}]`,
                                ''
                            )
                        )
                    ) : current.deepNested ? (
                        resolveDeepNested(d, current.keys)
                    ) : current.nestedArray ? (
                        <span>
                            {resolveNestedArray(
                                d,
                                current.value,
                                current.subvalue,
                                current.operator
                            )}
                        </span>
                    ) : current.image ? (
                        <RenderImage
                            value={d[current.value]}
                            square={current.square}
                            imageWidth={current.imageWidth}
                            imageHeight={current.imageHeight}
                        />
                    ) : current.importPaymentMethod ? (
                        !['OVERRIDE', 'CHARGE'].includes(d[current.value]) ? (
                            'PAYMENT'
                        ) : (
                            d[current.value]
                        )
                    ) : current.s_mawb ? (
                        formatMawb(d[current.value])
                    ) : current.percent ? (
                        formatPercent(d[current.value], current.percentDecimal)
                    ) : current.breakdownUnder ? (
                        Math.abs(
                            Math.max(
                                d['i_actual_piece_count'] - d['rackPieces'],
                                0
                            )
                        )
                    ) : current.breakdownOver ? (
                        Math.abs(
                            Math.min(
                                d['i_actual_piece_count'] - d['rackPieces'],
                                0
                            )
                        )
                    ) : current.substring ? (
                        d[current.value].substring(0, current.count)
                    ) : current.hardValue ? (
                        current.value
                    ) : (
                        d[current.value]
                    ),
                columns: current.multiple ? [] : null,
                style: {
                    textAlign: `${
                        current.money || current.percent || current.number
                            ? 'right'
                            : current.icon || current.button
                            ? 'center'
                            : 'left'
                    }`,
                },
                width:
                    (current.customWidth && current.customWidth) ||
                    ((current.icon || current.smallWidth) && 50) ||
                    (current.percent && 65) ||
                    (current.mediumWidth && 75) ||
                    (current.medLargeWidth && 125) ||
                    (current.largeWidth && 250) ||
                    (current.extraLargeWidth && 350) ||
                    (current.maxWidth && 500) ||
                    (current.date && 100) ||
                    (current.datetime && 160) ||
                    (current.s_mawb && 136) ||
                    (current.square && 35),
                filterable: disableGlobalFilter
                    ? false
                    : current.icon || current.button || current.image
                    ? false
                    : true,
                sortMethod: current.sortMethod && current.sortMethod,
                sortType: current.sortType && current.sortType,
            };

            // If the column is for passwords, customize the Cell function
            if (current.password) {
                // @ts-ignore
                column.Cell = (row: any) => {
                    return (
                        <div className={'text-center'}>
                            <CopyToClipboard text={row.original[current.value]}>
                                <CopyIcon className="fa-duotone fa-copy text-success" />
                            </CopyToClipboard>
                        </div>
                    );
                };
            }

            columns.push(column);
        }

        const hasMawb = mapping.find((m) => m.s_mawb === true);

        if (hasMawb) {
            columns.push({
                Header: '',
                id: 'mawb-search',
                maxWidth: 50,
                filterable: false,
                Cell: (row: any) => {
                    return (
                        <i
                            className={'fad fa-search pl-2 text-success'}
                            onClick={() =>
                                handleSearchAwb(
                                    null,
                                    _.get(row, 'original.s_mawb', null)
                                )
                            }
                        />
                    );
                },
            });
        }

        if (wizardNext) {
            columns.push({
                Header: '',
                id: 'row',
                maxWidth: 50,
                filterable: true,
                Cell: (row: any) => {
                    return (
                        <WithWizard
                            render={({
                                next,
                                previous,
                                step,
                                steps,
                                push,
                            }: any) => (
                                <i
                                    className={classnames(
                                        'fas fa-chevron-circle-right text-success',
                                        { 'custom-disabled': waitNext }
                                    )}
                                    onClick={() => {
                                        handleNext(row.original);
                                        setSelectedRow(row.index);
                                        setTimeout(() => {
                                            onClickNext(
                                                next,
                                                steps,
                                                step,
                                                push
                                            );
                                            setWaitNext(false);
                                        }, 1000);
                                    }}
                                ></i>
                            )}
                        ></WithWizard>
                    );
                },
            });
        }

        if (selectable) {
            columns.push({
                Header: '',
                id: 'row',
                maxWidth: 50,
                filterable: true,
                Cell: (row: any) => {
                    if (row && row.original.id && selectedRows.has(String(row.original.id))) {
                        return <i className={'fas fa-check-circle'} />
                    }
                    return <div></div>
                },
            });
        }

        return columns;
    }, [mapping, index, selectedRows, waitNext, selectable]);

    const filterCaseInsensitive = (filter: any, row: any) => {
        const id = filter.pivotId || filter.id;
        if (row[id] !== null && typeof row[id] === 'string') {
            return row[id] !== undefined
                ? String(row[id].toLowerCase()).includes(
                      filter.value.toLowerCase()
                  )
                : true;
        } else {
            return String(row[filter.id]) === filter.value;
        }
    };

    const onRowClick = (
        state: any,
        rowInfo: any,
        column: any,
        instance: any
    ) => {
        return {
            onClick: (e: any) => {
                if (!e.target.className.includes('fa-search')) {
                    handleClick && handleClick(rowInfo.original);
                    setSelectedRow(rowInfo.index);
                    if (selectable) {
                        toggleRowSelection(rowInfo.original.id);
                    }
                }
                // console.log(state);
                // console.log('A Td Element was clicked!')
                // console.log('it produced this event:', e)
                // console.log(e.target.className);
                // console.log('It was in this column:', column)
                // console.log('It was in this row:', rowInfo) //rowInfo.original
                // console.log('It was in this table instance:', instance)
            },
            style: {
                backgroundColor: selectedRows.has(String(_.get(rowInfo, ['original', 'id'], ''))) ? '#6fb327' : null,
                color: selectedRows.has(String(_.get(rowInfo, ['original', 'id'], ''))) ? 'white' : 'black'
            },
        };
    };

    const formatCost = (cost: string | number) => {
        if (Number(cost) < 0) {
            const useCost = Math.abs(Number(cost));
            return `${useCost.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
        }
        const toFormat =
            cost && cost !== null && Number(cost) > 0 ? Number(cost) : 0;
        return `${toFormat.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    };

    const resolveConcatValues = (
        d: any,
        values: Array<string>,
        operator: string
    ) => {
        let string = '';

        values && values.map((v) => (string += `${d[v]}${operator}`));

        if (string[string.length - 1] === operator) {
            string = string.substring(0, string.length - 1);
        }

        return string;
    };

    const resolveNestedArray = (
        d: any,
        value: string,
        subvalue: string,
        operator: string
    ) => {
        let string = '';
        const array = d[value] || [];
        array.map((a: any) => (string += `${a[subvalue]}${operator} `));
        string = string.substr(0, string.length - 2);
        return string;
    };

    const resolveDeepNested = (d: any, keys: Array<string>) => {
        for (let i = 0; i < keys.length; i++) {
            d = d[keys[i]];
        }
        return d;
    };

    return (
        <ReactTable
            data={data}
            key={JSON.stringify(Array.from(selectedRows))}
            // @ts-ignore
            columns={dataTableColumns}
            defaultPageSize={numRows}
            showPageSizeOptions={locked ? false : true}
            showPagination={noPagination ? false : true}
            filterable={true}
            defaultFilterMethod={(filter, row) =>
                filterCaseInsensitive(filter, row)
            }
            getTrProps={onRowClick}
            className={`-striped -highlight ${className}`}
            style={{
                height: `${customHeight && customHeight}`,
            }}
            //@ts-ignore
            defaultFiltered={defaultFiltered}
            // sorted={sortOptions}
            // onSortedChange={val => {
            //     setSortOptions({ sortOptions: val }) }}
            defaultSorting={defaultSorting}
            ref={reactTableRef}
            // sorted={defaultSorting && defaultSorting}
            // sorted={[
            //     {
            //      id: 'Consignee',
            //      desc: true
            //     }
            // ]}
        />
    );
}

const CopyIcon = styled.i`
    font-size: 22px;
    &:hover {
        cursor: pointer;
    }
`;