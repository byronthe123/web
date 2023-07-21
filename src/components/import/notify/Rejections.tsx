import { useEffect, useMemo, useState } from 'react';
import { ButtonGroup, Button } from 'reactstrap';
import { IUser } from '../../../globals/interfaces';
import { api, getTsDate, notify } from '../../../utils';

import Card from '../../custom/Card';
import ReactTable from '../../custom/ReactTable';
import ManageRejectionsModal from './ManageRejections';

interface Props {
    user: IUser;
}

export default function Rejections({ user }: Props) {
    const [issues, setIssues] = useState<Array<NotificationIssue>>([]);
    const [showResolved, setShowResolved] = useState(false);
    const showIssues = useMemo(() => {
        return issues.filter(i => i.b_resolved === showResolved);
    }, [issues, showResolved]);
    const [modal, setModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<NotificationIssue>();

    useEffect(() => {
        const getData = async () => {
            const res = await api('get', '/notification-issue');
            setIssues(res.data);
        };
        getData();
    }, []);

    const handleSelectIssue = (issue: NotificationIssue) => {
        setSelectedIssue(issue);
        setModal(true);
    }

    const updateIssue = async (b_resolved: boolean) => {
        const data = {...selectedIssue} as NotificationIssue;
        data.b_resolved = b_resolved;
        data.s_modified_by = user.s_email;
        data.t_modified = getTsDate();

        const res = await api('put', 'notification-issue', data);
        if (res.status === 204) {
            setModal(false);
            setIssues(prev => {
                const copy = [...prev];
                const updateIssue = copy.find(issue => issue.id === data.id);
                if (updateIssue) {
                    updateIssue.b_resolved = data.b_resolved;
                    updateIssue.t_modified = data.t_modified;
                    updateIssue.s_modified_by = data.s_modified_by;
                }
                return copy;
            });
            notify('Updated');
        }
    }

    return (
        <Card>
            <ButtonGroup className={'mb-2'}>
                <Button
                    onClick={() => setShowResolved(false)}
                    active={!showResolved}
                >
                    Open
                </Button>
                <Button
                    onClick={() => setShowResolved(true)}
                    active={showResolved}
                >
                    Resolved
                </Button>
            </ButtonGroup>
            <ReactTable
                data={showIssues}
                mapping={[
                    {
                        name: 'MAWB',
                        value: 's_mawb',
                        s_mawb: true,
                    },
                    {
                        name: 'Email',
                        value: 's_email',
                    },
                ]}
                index
                numRows={10}
                enableClick
                handleClick={handleSelectIssue}
            />
            <ManageRejectionsModal 
                modal={modal}
                setModal={setModal}
                issue={selectedIssue}
                updateIssue={updateIssue}
            />
        </Card>
    );
}

export interface NotificationIssue {
    id: number;
    s_mawb: string;
    s_email: string;
    s_created_by: string;
    t_created: Date;
    s_modified_by: string;
    t_modified: Date;
    b_resolved: boolean;
}
