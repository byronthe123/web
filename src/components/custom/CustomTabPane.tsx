import { TabPane } from 'reactstrap';

interface Props<T extends string> {
    tabId: T;
    children: React.ReactNode;
}

export default function CustomTabPane<T extends string>({
    tabId,
    children,
}: Props<T>) {
    return <TabPane tabId={tabId}>{children}</TabPane>;
}
