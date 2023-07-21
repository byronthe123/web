

import { useEffect, useState } from 'react';
import styled from 'styled-components';

import apiClient from '../../../apiClient';
import { ITaskItem } from '../../../globals/interfaces';
import TaskModal from './TaskModal'; 
import Layout from '../../../components/custom/Layout';
import _ from 'lodash';

export default function TasksList () {
    const [modal, setModal] = useState(false);
    const [workItemsMap, setWorkItemsMap] = useState<
        Record<string, Array<ITaskItem>>
    >({});
    const [selectedItem, setSelectedItem] = useState<ITaskItem>();
    const boardColumns = ['To Do', 'Develop', 'Test', 'Confirm', 'Done'];

    const resolveWorkItemsMap = (arr: Array<ITaskItem>) => {
        const map: Record<string, Array<ITaskItem>> = {};
        for (const item of arr) {
            const { boardColumn } = item;
            if (!map[boardColumn]) {
                map[boardColumn] = [];
            }
            map[boardColumn].push(item);
        }
        return map;
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await apiClient.get(`/work-items`);
                setWorkItemsMap(resolveWorkItemsMap(res.data));
                console.log(res.data);
            } catch (err) {
                alert(err);
            }
        };
        getData();
    }, []);

    const handleViewItem = (item: ITaskItem) => {
        setModal(true);
        setSelectedItem(item);
    };

    return (
        <Layout>
            <LanesContainer>
                {boardColumns.map((cat, i) => (
                    <Lane key={i} color={colorsMap[cat]}>
                        <BoardColumnName>{cat}: {_.get(workItemsMap, [cat], []).length}</BoardColumnName>
                        {_.get(workItemsMap, [cat], []).map((item, i) => (
                                <WorkItem
                                    item={item}
                                    key={i}
                                    handleViewItem={handleViewItem}
                                />
                            ))}
                    </Lane>
                ))}
            </LanesContainer>
            <TaskModal 
                modal={modal}
                setModal={setModal}
                workItem={selectedItem}
            />
        </Layout>
    );
}

interface WorkItemProps {
    item: ITaskItem;
    handleViewItem: (item: ITaskItem) => void;
}

const WorkItem = ({ item, handleViewItem }: WorkItemProps) => {

    const assignedTo = _.get(item, ['assignedTo'], '').substring(0, 1);

    return (
        <div>
            <h6 className={'hover'} onClick={() => handleViewItem(item)}>
                <Icon
                    className={
                        item.workItemType === 'Bug'
                            ? 'fa-duotone fa-bug'
                            : 'fa-duotone fa-star'
                    }
                    bug={item.workItemType === 'Bug'}
                />{' '}
                <b>{item.id}</b> {assignedTo && `(${assignedTo})`} <i>[{item.project}]</i> {item.title}
            </h6>
        </div>
    );
};

const colorsMap: Record<string, string> = {
    'To Do': 'B7E4C7',
    'Develop': '74C69D',
    'Test': '52B788',
    'Confirm': '40916C',
    'Done': 'ADB5BD'
}

const LanesContainer = styled.div`
    display: flex;
    gap: 10px;
    height: 100%;
`;

const Lane = styled.div<{color: string}>`
    background-color: #${p => p.color};
    border: 3px solid black;
    padding: 10px;
    overflow-y: scroll;
`;

const BoardColumnName = styled.h2`
    font-weight: bold;
`;

const Icon = styled.i<{bug: Boolean}>`
    color: ${p => p.bug ? 'red' : '#e85d04'}
`;