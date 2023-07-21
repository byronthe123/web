import { useEffect, useState } from 'react';
import styled from 'styled-components';

import apiClient from '../../../apiClient';
import { ITaskItem } from '../../../globals/interfaces';
import WorkItemModal from './WorkItemModal'; 

export default function WorkItems() {
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
        <div>
            <LanesContainer>
                {boardColumns.map((cat, i) => (
                    <Lane key={i}>
                        <BoardColumnName>{cat}</BoardColumnName>
                        {workItemsMap[cat] &&
                            workItemsMap[cat].map((item, i) => (
                                <WorkItem
                                    item={item}
                                    key={i}
                                    handleViewItem={handleViewItem}
                                />
                            ))}
                    </Lane>
                ))}
            </LanesContainer>
            <WorkItemModal 
                modal={modal}
                setModal={setModal}
                workItem={selectedItem}
            />
        </div>
    );
}

interface WorkItemProps {
    item: ITaskItem;
    handleViewItem: (item: ITaskItem) => void;
}

const WorkItem = ({ item, handleViewItem }: WorkItemProps) => {
    return (
        <div>
            <h6 className={'hover'} onClick={() => handleViewItem(item)}>
                <i
                    className={
                        item.workItemType === 'Bug'
                            ? 'fa-duotone fa-bug'
                            : 'fa-duotone fa-star'
                    }
                />{' '}
                <b>{item.id}</b> <i>[{item.project}]</i> {item.title}
            </h6>
        </div>
    );
};

const LanesContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const Lane = styled.div`
    background-color: #dfddd
    border: 3px solid black;
    padding: 10px;
`;

const BoardColumnName = styled.h2`
    font-weight: bold;
`;
