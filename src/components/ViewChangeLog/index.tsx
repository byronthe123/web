import React, { useMemo } from 'react';
import { Label } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import BackButton from '../custom/BackButton';
import { formatDatetime } from '../../utils';
import { useAppContext } from '../../context';
import { IChangeLog } from '../../globals/interfaces';
import Item from './Item';
import Loading from '../misc/Loading';

export type Types = 'ADDED' | 'CHANGED' | 'FIXED';

interface Props {
    modal: boolean;
    setModal: (state: boolean) => void;
}

export default function ViewChangeLog({ modal, setModal }: Props) {
    const history = useHistory();
    const { appData } = useAppContext();
    const changeLogData: Array<IChangeLog> = appData.changeLogData;

    const toggle = () => setModal(!modal);

    return (
        <Modal isOpen={modal} toggle={toggle} size={'lg'}>
            <ModalHeader className={'d-flex'}>
                <HeaderContainer>
                    <BackButton onClick={toggle} />
                    <h4 className={'pl-2'}>Change Log</h4>
                </HeaderContainer>
            </ModalHeader>
            <CustomModalBody>
                <Body changeLogData={changeLogData} history={history} />
            </CustomModalBody>
        </Modal>
    );
}

interface BodyProps {
    changeLogData: Array<IChangeLog>;
    history: History;
}

const Body = ({ changeLogData, history }: BodyProps) => {
    const dataMap = useMemo(() => {
        const map: Record<
            string,
            {
                added: Array<IChangeLog>;
                changed: Array<IChangeLog>;
                fixed: Array<IChangeLog>;
            }
        > = {};
        const sorted = sortVersions(changeLogData);
        for (const item of sorted) {
            const { version, type } = item;
            if (!map[version]) {
                map[version] = { added: [], changed: [], fixed: [] };
            }
            if (type === 'ADDED') {
                map[version].added.push(item);
            } else if (type === 'CHANGED') {
                map[version].changed.push(item);
            } else {
                map[version].fixed.push(item);
            }
        }
        return map;
    }, [changeLogData]);

    if (!changeLogData.length) {
        return <Loading />;
    }

    return (
        <Section>
            {Object.keys(dataMap).map((version) => (
                <Section key={version}>
                    <Version>{version}</Version>
                    <RenderSection
                        dataArray={dataMap[version].added}
                        type="ADDED"
                        history={history}
                    />
                    <RenderSection
                        dataArray={dataMap[version].changed}
                        type="CHANGED"
                        history={history}
                    />
                    <RenderSection
                        dataArray={dataMap[version].fixed}
                        type="FIXED"
                        history={history}
                    />
                </Section>
            ))}
        </Section>
    );
};

interface RenderSectionProps {
    dataArray: Array<IChangeLog>;
    type: Types;
    history: History;
}

const RenderSection = ({ dataArray, type, history }: RenderSectionProps) => {
    if (!dataArray.length) {
        return null;
    }

    return (
        <div>
            <Subtitle>{type}</Subtitle>
            {dataArray.map((item, i) => (
                <Item item={item} type={type} key={i} history={history} />
            ))}
        </div>
    );
};

const HeaderContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const Version = styled.h3`
    font-weight: bold;
`;

const Section = styled.div`
    margin-bottom: 25px;
    text-transform: none;
`;

const Subtitle = styled.h5`
    font-style: italic;
`;

const CustomModalBody = styled(ModalBody)`
    max-height: 600px;
    overflow-y: scroll;
`;

function sortVersions(data: Array<IChangeLog>) {
    return data.sort((a, b) => {
        const [aMajor, aMinor, aPatch] = a.version.split('.').map(Number);
        const [bMajor, bMinor, bPatch] = b.version.split('.').map(Number);

        if (aMajor !== bMajor) {
            return bMajor - aMajor;
        }
        if (aMinor !== bMinor) {
            return bMinor - aMinor;
        }
        return bPatch - aPatch;
    });
}
