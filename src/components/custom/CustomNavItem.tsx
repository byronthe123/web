import { NavItem } from "reactstrap";
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';

interface Props<T extends string> {
    tabName: string;
    tabId: T;
    activeTabId: T;
    toggleTab: (tabId: T) => void;
}

export default function CustomNavItem<T extends string> ({
    tabName,
    tabId,
    activeTabId,
    toggleTab
}: Props<T>) {
    return (
        <NavItem>
            <NavLink
                location={{}}
                to="#"
                className={classnames({
                    active: activeTabId === tabId,
                    "nav-link": true
                })}
                onClick={() => toggleTab(tabId)}
            >
                {tabName}
            </NavLink>
        </NavItem>
    );
}