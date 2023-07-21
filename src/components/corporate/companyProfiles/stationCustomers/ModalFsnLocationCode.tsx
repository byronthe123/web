import dayjs from 'dayjs';
import _ from 'lodash';
import React, { useEffect, useState, useMemo } from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import styled from 'styled-components';

import { IFsnLocationCode, IMap, IUser } from '../../../../globals/interfaces';
import { api, getDate } from '../../../../utils';
import ActionIcon from '../../../custom/ActionIcon';
import BackButton from '../../../custom/BackButton';
import { IAirlineMappingDetailExtended } from './interfaces';
import { validateData } from './utils';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
    update: boolean;
    user: IUser;
    selectedAirlineDetail: IAirlineMappingDetailExtended;
    setSelectedAirlineDetail: React.Dispatch<React.SetStateAction<IAirlineMappingDetailExtended>>
    setSelectedStationCustomers: React.Dispatch<React.SetStateAction<Array<IAirlineMappingDetailExtended>>>
    selectedItem?: IFsnLocationCode;
}

export default function ModalFsnLocationCode ({
    modal,
    setModal,
    update,
    user,
    selectedAirlineDetail,
    setSelectedAirlineDetail,
    setSelectedStationCustomers,
    selectedItem
}: Props) {

    const [s_code, set_s_code] = useState('');
    const [existingCodes, setExistingCodes] = useState<Array<IFsnLocationCode>>([]);
    const [existingCodesMap, setExistingCodesMap] = useState<IMap<boolean>>({});
    
    useEffect(() => {
        if (update && selectedItem) {
            set_s_code(selectedItem.s_code);
        } else {
            set_s_code('');
        }
    }, [modal, update, selectedItem]);

    useEffect(() => {
        const selectExistingFnsLocationCodes = async () => {
            const res = await api('get', 'fsnLocationCode');
            setExistingCodes(res.data);
        }
        
        if (modal && existingCodes.length === 0) {
            selectExistingFnsLocationCodes();
        }
    }, [modal, existingCodes]);

    useEffect(() => {
        const map: IMap<boolean> = {};
        for (let i = 0; i < existingCodes.length; i++) {
            const s_code = _.get(existingCodes[i], 's_code', null);
            if (s_code) {
                map[s_code.toUpperCase()] = true;
            }
        }
        setExistingCodesMap(map);
    }, [existingCodes]);

    const updateLocalFsnCodes = (
        airlineMappingDetail: IAirlineMappingDetailExtended,
        data: IFsnLocationCode,
        s_email: string,
        now: string
    ) => {
        const copy = _.cloneDeep(airlineMappingDetail);

        const { fsnLocationCodes } = copy;
        if (update && selectedItem) {
            for (let i = 0; i < fsnLocationCodes.length; i++) {
                if (fsnLocationCodes[i].id === selectedItem.id) {
                    for (let key in data) {
                        // @ts-ignore
                        fsnLocationCodes[i][key] = data[key];
                    }
                }
            }
        } else {
            fsnLocationCodes.push(data);
        }
        copy.s_modified_by = s_email;
        copy.t_modified = now;
        return copy;
    }

    const createUpdateFsnLocationCode = async () => {
        let method = 'post';
        const now = dayjs().local().format('MM/DD/YYYY HH:mm');

        const data: IMap<any> = {
            s_modified_by: user.s_email,
            t_modified: now,
            s_status: selectedAirlineDetail.s_status,
            s_code,
            i_airline_mapping_detail_id: selectedAirlineDetail.id
        };

        if (update && selectedItem) {
            method = 'put';
            data.id = selectedItem.id;
        } else {
            data.s_created_by = user.s_email;
            data.t_created = now;
        }

        const validData = await validateData(update, data);
        if (validData) {
            const res = await api(method, 'fsnLocationCode', data);

            setSelectedAirlineDetail((prev: IAirlineMappingDetailExtended) => 
                updateLocalFsnCodes(prev, update ? data : res.data, user.s_email, now)
            );

            setSelectedStationCustomers(prev => (
                prev.map(airlineMappingDetail => {
                    if (airlineMappingDetail.id === selectedAirlineDetail.id) {
                        return updateLocalFsnCodes(airlineMappingDetail, update ? data : res.data, user.s_email, now)
                    } else {    
                        return airlineMappingDetail;
                    }
                })
            ));

            if (update && selectedItem) {
                setExistingCodesMap(prev => {
                    const copy = _.cloneDeep(prev);
                    delete copy[selectedItem.s_code];
                    return copy;
                });
            }
            setExistingCodesMap(prev => {
                const copy = _.cloneDeep(prev);
                copy[s_code] = true;
                return copy;
            });
            setModal(false);
        }
    }

    const deleteFsnLocationCode = async () => {
        if (selectedItem) {
            const now = getDate();
            await api('post', 'deleteFsnLocationCode', {
                id: selectedItem.id,
                i_airline_mapping_detail_id: selectedAirlineDetail.id, 
                s_modified_by: user.s_email, 
                t_modified: now
            });
            setSelectedAirlineDetail(prev => {
                const copy = _.cloneDeep(prev);
                copy.s_modified_by = user.s_email;
                copy.t_modified = now;
                copy.fsnLocationCodes = copy.fsnLocationCodes.filter(c => c.id !== selectedItem.id);
                return copy;
            });
            setModal(false);
        }
    }

    const checkCodeExists = (s_code: string): boolean => {
        if (s_code && s_code.length > 0) {
            return existingCodesMap[s_code.toUpperCase()];
        }
        return false;
    }

    const toggle = () => setModal(!modal);
    
    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className={'d-flex'}>
                <FooterHeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2 pt-2'}>
                        {update ? 'Update' : 'Create'} FSN Location Code
                    </h4>
                </FooterHeaderContainer>
            </ModalHeader>
            <ModalBody className={'d-flex align-items-center'}>
                <Label className={'pr-3'}>FSN Location Code:</Label>
                <CustomInput value={s_code} onChange={(e: any) => set_s_code(e.target.value)} />
                {
                    checkCodeExists(s_code) && 
                        <Label className={'text-danger ml-2'}>Code already used</Label>
                }
            </ModalBody>
            <ExpandedFooter>
                <FooterContentContainer>
                    {
                        selectedItem && 
                            <Label>Modified by {selectedItem.s_modified_by} at {dayjs(selectedItem.t_modified).format('MM/DD/YYYY HH:mm')}</Label>
                    }
                    <FooterButtonsContainer>
                        <ActionIcon 
                            type={'delete'}
                            onClick={() => deleteFsnLocationCode()}
                            disabled={!selectedItem}
                        />
                        <ActionIcon 
                            type={'save'}
                            onClick={() => createUpdateFsnLocationCode()}
                            disabled={_.get(s_code, 'length', 0) === 0 || checkCodeExists(s_code)}
                        />
                    </FooterButtonsContainer> 
                </FooterContentContainer>
            </ExpandedFooter>
        </Modal>
    );
}

const CustomInput = styled(Input)`
    width: 100px;
`;

const FooterHeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const ExpandedFooter = styled(ModalFooter)`
    width: 100%;
`;

const FooterContentContainer = styled.div`
    width: 100%;
`;

const FooterButtonsContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;