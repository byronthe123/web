import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Table, Input } from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import { useAppContext } from '../../../context';
import AppLayout from '../../AppLayout';
import MawbInput from '../../custom/MawbInput';
import { api, getDate, validateAwb, rackUpdate } from '../../../utils';
import { IFHL, IFWB, IRack } from '../../../globals/interfaces';
import ReactTable from '../../custom/ReactTable';
import ModalUpdateLocation from './ModalUpdateLocation';
import ActionIcon from '../../custom/ActionIcon';
import Card from '../../custom/Card';

export default function DeliverAllLocations() {
    const { user, createSuccessNotification } = useAppContext();
    const [s_mawb, set_s_mawb] = useState('');
    const [latestFwb, setLatestFwb] = useState<IFWB>();
    const [fhls, setFhls] = useState<Array<IFHL>>([]);
    const [locations, setLocations] = useState<Array<IRack>>([]);
    const [selectedFhl, setSelectedFhl] = useState<IFHL>();
    const [selectedLocation, setSelectedLocation] = useState<IRack>();
    const [locatePcs, setLocatePcs] = useState<number>();
    const [updateLocationPcs, setUpdateLocationPcs] = useState<number | string>(0);
    const [updateLocationHawb, setUpdateLocationHawb] = useState<string>('');
    const [modal, setModal] = useState(false);

    const locatedPcs: number = useMemo(() => {
        return locations.reduce(
            (total, current) => (total += Number(current.i_pieces)),
            0
        );
    }, [locations]);

    useEffect(() => {
        const deliverHawbData = async () => {
            const res = await api('get', `deliverHawbs/${s_mawb}`);
            console.log(res.data);
            const { fhls, locations, latestFwb } = res.data;
            setLatestFwb(latestFwb);
            setFhls(fhls);
            setLocations(locations);
        };
        if (validateAwb(s_mawb)) {
            deliverHawbData();
        }
    }, [s_mawb]);

    const handleSelectFhl = (fhl: IFHL) => {
        setSelectedFhl(fhl);
        setLocatePcs(fhl.i_pieces);
    };

    const handleUpdateLocation = (location: IRack) => {
        setSelectedLocation(location);
        setUpdateLocationPcs(location.i_pieces);
        setUpdateLocationHawb(location.s_hawb || '');
        setModal(true);
    };

    const deliverHawbCreateLocation = async () => {
        const res = await api('post', 'deliverHawbs', {
            s_mawb,
            s_hawb: selectedFhl?.s_hawb,
            i_pieces: locatePcs,
            s_created_by: user.s_email,
            t_created: getDate(),
            s_modified_by: user.s_email,
            t_modified: getDate(),
            s_status: 'LOCATED',
            s_unit: user.s_unit,
            s_location: selectedLocation?.s_location,
            s_destination: latestFwb?.s_destination,
            s_guid: uuidv4(),
            s_platform: 'EOS'
        });

        if (res.status === 200) {
            setLocatePcs(0);
            setSelectedFhl(undefined);
            setSelectedLocation(undefined);
            setLocations((prev) => {
                const copy = _.cloneDeep(prev);
                copy.unshift(res.data);
                return copy;
            });
            createSuccessNotification('Location Created');
            rackUpdate(s_mawb, user.s_unit);
        }
    };

    const deliverHawbUpdateLocation = async () => {
        if (!selectedLocation) {
            return;
        }
        const locationCopy = _.cloneDeep(selectedLocation);
        locationCopy.i_pieces = updateLocationPcs;
        locationCopy.s_hawb = updateLocationHawb;
        locationCopy.s_modified_by = user.s_email;
        locationCopy.t_modified = getDate();
        locationCopy.s_platform = 'EOS';

        const res = await api('put', 'deliverHawbs', locationCopy);
        if (res.status === 204) {
            setModal(false);
            createSuccessNotification('Sucess');
            rackUpdate(s_mawb, user.s_unit);
            setLocations((prev) => {
                const locationsCopy = _.cloneDeep(prev);
                const updateIndex = locationsCopy.findIndex(
                    (l) => l.id === selectedLocation.id
                );
                locationsCopy[updateIndex] = locationCopy;
                return locationsCopy;
            });
        }
    };

    return (
        <AppLayout padding={'10px'}>
            <h1>Deliver all HAWBS</h1>
            <MainContainer>
                <DataCol>
                    <Card>
                        <SpaceBetweenContainer className={'mb-2'}>
                            <h6>MAWB: </h6>
                            <MawbInput value={s_mawb} onChange={set_s_mawb} />
                        </SpaceBetweenContainer>
                        <SpaceBetweenContainer>
                            <h6>FWB Pieces</h6>
                            <h6>{latestFwb?.i_total_pieces}</h6>
                        </SpaceBetweenContainer>
                        <SpaceBetweenContainer>
                            <h6>Located</h6>
                            <h6>{locatedPcs}</h6>
                        </SpaceBetweenContainer>
                        <SpaceBetweenContainer>
                            <h6>Destination</h6>
                            <h6>{latestFwb?.s_destination}</h6>
                        </SpaceBetweenContainer>
                        <div className={'mt-2'}>
                            <h6>Create Location: Select HAWB & Location</h6>
                            <CustomTable outline>
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>HAWB</td>
                                        <td>Pieces</td>
                                        <td>Location</td>
                                    </tr>
                                    <tr>
                                        <td>{selectedFhl?.s_hawb}</td>
                                        <td width={100}>
                                            {selectedFhl &&
                                                selectedLocation && (
                                                    <Input
                                                        type={'number'}
                                                        value={locatePcs}
                                                        onChange={(e: any) =>
                                                            setLocatePcs(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                )}
                                        </td>
                                        <td>{selectedLocation?.s_location}</td>
                                    </tr>
                                </tbody>
                            </CustomTable>
                        </div>
                        <SpaceBetweenContainerSaveBtn>
                            <ActionIcon
                                type={'save'}
                                onClick={deliverHawbCreateLocation}
                                disabled={
                                    !selectedFhl ||
                                    !selectedLocation ||
                                    !locatePcs ||
                                    locatePcs < 1
                                }
                            />
                        </SpaceBetweenContainerSaveBtn>
                    </Card>
                </DataCol>
                <TableCol>
                    <h6>FHLS Found</h6>
                    <ReactTable
                        data={fhls}
                        mapping={[
                            {
                                name: 'FHL',
                                value: 's_hawb',
                            },
                            {
                                name: 'Pieces',
                                value: 'i_pieces',
                            },
                        ]}
                        index
                        numRows={10}
                        enableClick
                        handleClick={handleSelectFhl}
                    />
                </TableCol>
                <TableCol>
                    <h6>Rack Locations</h6>
                    <ReactTable
                        data={locations}
                        mapping={[
                            {
                                name: 'Location',
                                value: 's_location',
                            },
                            {
                                name: 'HAWB',
                                value: 's_hawb',
                            },
                            {
                                name: 'Pieces',
                                value: 'i_pieces',
                            },
                            {
                                name: 'Destination',
                                value: 's_destination',
                            },
                            {
                                name: '',
                                value: 'fa fa-edit text-success',
                                icon: true,
                                function: (item: IRack) =>
                                    handleUpdateLocation(item),
                            },
                        ]}
                        index
                        numRows={10}
                        enableClick
                        handleClick={setSelectedLocation}
                    />
                </TableCol>
            </MainContainer>
            <ModalUpdateLocation
                modal={modal}
                setModal={setModal}
                selectedLocation={selectedLocation}
                fhls={fhls}
                updateLocationPcs={updateLocationPcs}
                setUpdateLocationPcs={setUpdateLocationPcs}
                updateLocationHawb={updateLocationHawb}
                setUpdateLocationHawb={setUpdateLocationHawb}
                deliverHawbUpdateLocation={deliverHawbUpdateLocation}
            />
        </AppLayout>
    );
}

const MainContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
`;

const SpaceBetweenContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const SpaceBetweenContainerSaveBtn = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const DataCol = styled.div`
    flex: 25% 0 0;
`;

const TableCol = styled.div`
    flex: 1;
`;

const CustomTable = styled(Table)`
    font-size: 16px;
`;
