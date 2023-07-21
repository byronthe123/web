import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Nav, NavItem, Collapse } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withRouter } from 'react-router-dom';
import sidebar from '../components/dev/dynamicSidebar/map';

import {
  setContainerClassnames,
  addContainerClassname,
  changeDefaultClassnames,
  changeSelectedMenuHasSubItems
} from '../redux/actions'

import menuItems from '../constants/menu';
import menuAirlines from '../constants/menuAirlines';
import classNames from 'classnames';
import moment from 'moment';

const REACT_APP_NO_LOGIN = process.env.REACT_APP_NO_LOGIN;

const Sidebar = ({ props }) => {

    const [selectedParentMenu, setSelectedParentMenu] = useState('');
    const [viewingParentMenu, setViewingParentMenu] = useState('');
    const [collapsedMenus, setCollapsedMenus] = useState('');
    const [overdueReadingSign, setOverdueReadingSign] = useState('');

    const handleDocumentClick = e => {
        const { containerClassnames, menuClickCount } = props;
        const currentClasses = containerClassnames
        ? containerClassnames.split(' ').filter(x => x !== '')
        : '';

        if (currentClasses.indexOf('sub-hidden') !== -1) {
        props.handleDisplaySubmenu(false);
        } else {
        props.handleDisplaySubmenu(true);
        }

        const container = getContainer();
        let isMenuClick = false;
        if (
        e.target &&
        e.target.classList &&
        (e.target.classList.contains('menu-button') ||
            e.target.classList.contains('menu-button-mobile'))
        ) {
        isMenuClick = true;
        } else if (
        e.target.parentElement &&
        e.target.parentElement.classList &&
        (e.target.parentElement.classList.contains('menu-button') ||
            e.target.parentElement.classList.contains('menu-button-mobile'))
        ) {
        isMenuClick = true;
        } else if (
        e.target.parentElement &&
        e.target.parentElement.parentElement &&
        e.target.parentElement.parentElement.classList &&
        (e.target.parentElement.parentElement.classList.contains('menu-button') ||
            e.target.parentElement.parentElement.classList.contains(
            'menu-button-mobile'
            ))
        ) {
        isMenuClick = true;
        }
        if (container.contains(e.target) || container === e.target || isMenuClick) {
        return;
        }
        setViewingParentMenu('');
        toggle();
    };

    const isMobile = () => {
        const hasSubItems = getIsHasSubItem();
        const { menuHiddenBreakpoint, subHiddenBreakpoint, containerClassnames } = props;
        const windowWidth = window.innerWidth;
        if (windowWidth < menuHiddenBreakpoint) {
            // alert('working');
            document.getElementById('app-container').className = 'main-hidden sub-hidden';
        }
    }

    const getMenuClassesForResize = classes => {
        const { menuHiddenBreakpoint, subHiddenBreakpoint } = props;
        let nextClasses = classes.split(' ').filter(x => x !== '');
        const windowWidth = window.innerWidth;
        if (windowWidth < menuHiddenBreakpoint) {
        nextClasses.push('menu-mobile');
        } else if (windowWidth < subHiddenBreakpoint) {
        nextClasses = nextClasses.filter(x => x !== 'menu-mobile');
        if (
            nextClasses.includes('menu-default') &&
            !nextClasses.includes('menu-sub-hidden')
        ) {
            nextClasses.push('menu-sub-hidden');
        }
        } else {
        nextClasses = nextClasses.filter(x => x !== 'menu-mobile');
        if (
            nextClasses.includes('menu-default') &&
            nextClasses.includes('menu-sub-hidden')
        ) {
            nextClasses = nextClasses.filter(x => x !== 'menu-sub-hidden');
        }
        }
        return nextClasses;
    };

    const getContainer = () => {
        return ReactDOM.findDOMNode(this);
    };

    const toggle = () => {
        const hasSubItems = getIsHasSubItem();
        props.changeSelectedMenuHasSubItems(hasSubItems);
        const { containerClassnames, menuClickCount } = props;
        const currentClasses = containerClassnames
        ? containerClassnames.split(' ').filter(x => x !== '')
        : '';

        let clickIndex = -1;

        if (!hasSubItems) {
        if (
            currentClasses.includes('menu-default') &&
            (menuClickCount % 4 === 0 || menuClickCount % 4 === 3)
        ) {
            clickIndex = 1;
        } else if (
            currentClasses.includes('menu-sub-hidden') &&
            (menuClickCount === 2 || menuClickCount === 3)
        ) {
            clickIndex = 0;
        } else if (
            currentClasses.includes('menu-hidden') ||
            currentClasses.includes('menu-mobile')
        ) {
            clickIndex = 0;
        }
        } else {
        if (currentClasses.includes('menu-sub-hidden') && menuClickCount === 3) {
            clickIndex = 2;
        } else if (
            currentClasses.includes('menu-hidden') ||
            currentClasses.includes('menu-mobile')
        ) {
            clickIndex = 0;
        }
        }
        if (clickIndex >= 0) {
        props.setContainerClassnames(
            clickIndex,
            containerClassnames,
            hasSubItems
        );
        }
    };

    const handleProps = () => {
        addEvents();
    };

    const addEvents = () => {
        ['click', 'touchstart', 'touchend'].forEach(event =>
        document.addEventListener(event, handleDocumentClick, true)
        );
    };

    const removeEvents = () => {
        ['click', 'touchstart', 'touchend'].forEach(event =>
        document.removeEventListener(event, handleDocumentClick, true)
        );
    };

    const setSelectedLiActive = callback => {
        const oldli = document.querySelector('.sub-menu  li.active');
        if (oldli != null) {
        oldli.classList.remove('active');
        }

        const oldliSub = document.querySelector('.third-level-menu  li.active');
        if (oldliSub != null) {
        oldliSub.classList.remove('active');
        }

        /* set selected parent menu */
        const selectedSublink = document.querySelector('.third-level-menu  a.active');
        if (selectedSublink != null) {
        selectedSublink.parentElement.classList.add('active');
        }

        const selectedlink = document.querySelector('.sub-menu  a.active');
        if (selectedlink != null) {
        selectedlink.parentElement.classList.add('active');
        setSelectedParentMenu(selectedlink.parentElement.parentElement.getAttribute(
            'data-parent'
        ));
        callback();
        } else {
        var selectedParentNoSubItem = document.querySelector(
            '.main-menu  li a.active'
        );
        if (selectedParentNoSubItem != null) {
            setSelectedParentMenu(selectedParentNoSubItem.getAttribute(
                'data-flag'
            ));
            callback();
        } else if (selectedParentMenu === '') {
            setSelectedParentMenu(menuItems[0].id);
            callback();
        }
    }   
    };

    const setHasSubItemStatus = () => {
        const hasSubmenu = getIsHasSubItem();
        props.changeSelectedMenuHasSubItems(hasSubmenu);
        toggle();
    };

    const getIsHasSubItem = () => {
        const menuItem = menuItems.find(x => x.id === selectedParentMenu);
        if (menuItem)
        if (menuItem && menuItem.subs && menuItem.subs.length > 0) {
            return true;
        } else {
            props.handleDisplaySubmenu(false);
            return false;
        } else {
            props.handleDisplaySubmenu(false);
            return false;
        }
    };

    useEffect(() => {

    }, [props.readingSigns]);

    useEffect(() => {
        const resolveOverdueReadingSign = () => {
            const readingSigns = props.readingSigns || [];
            let overdue = false;
            for (let i = 0; i < readingSigns.length; i++) {
                if (readingSigns[i] && !readingSigns[i].acknowledged && readingSigns[i].readingSignId && readingSigns[i].readingSignId.dueDate && moment(moment(readingSigns[i].readingSignId.dueDate).format('YYYY-MM-DD')).isBefore(moment().format('YYYY-MM-DD'))) {
                    overdue = true;
                    break;
                }
            }
            setOverdueReadingSign(overdue);
        }

        resolveOverdueReadingSign();

        setSelectedLiActive(setHasSubItemStatus);
    
        window.scrollTo(0, 0);

        handleProps();
    }, [props]);

    useEffect(() => {
        handleProps();
        setSelectedLiActive(setHasSubItemStatus);
        closeCollapse();
        minimizeSubmenu();

        return () => {
            removeEvents();
        }
    }, []);

    const openSubMenu = (e, menuItem) => {

        console.log(menuItem);

        const { containerClassnames, menuClickCount } = props;
        const currentClasses = containerClassnames
        ? containerClassnames.split(' ').filter(x => x !== '')
        : '';

        const selectedParent = menuItem.id;
        const hasSubMenu = Object.keys(menuItem.subs).length > 0;

        props.changeSelectedMenuHasSubItems(hasSubMenu);
        if (!hasSubMenu) {
        props.handleDisplaySubmenu(false);
        setViewingParentMenu(selectedParent);
        setSelectedParentMenu(selectedParent);
        toggle();
        } else {
        e.preventDefault();
        props.handleDisplaySubmenu(true);

        const { containerClassnames, menuClickCount } = props;
        const currentClasses = containerClassnames
            ? containerClassnames.split(' ').filter(x => x !== '')
            : '';

        if (!currentClasses.includes('menu-mobile')) {
            if (
            currentClasses.includes('menu-sub-hidden') &&
            (menuClickCount === 2 || menuClickCount === 0)
            ) {
            props.setContainerClassnames(3, containerClassnames, hasSubMenu);
            } else if (
            currentClasses.includes('menu-hidden') &&
            (menuClickCount === 1 || menuClickCount === 3)
            ) {
            props.setContainerClassnames(2, containerClassnames, hasSubMenu);
            } else if (
            currentClasses.includes('menu-default') &&
            !currentClasses.includes('menu-sub-hidden') &&
            (menuClickCount === 1 || menuClickCount === 3)
            ) {
            props.setContainerClassnames(0, containerClassnames, hasSubMenu);
            }
        } else {
            props.addContainerClassname(
            'sub-show-temporary',
            containerClassnames
            );
        }
        setViewingParentMenu(selectedParent)
        }
    };

    const closeCollapse = () => {
        isMobile();
        // const collapsed = menuItems && menuItems.map((item, i) => `${item.id}_${i}`);
        // const collapsed = menuItems && menuItems[1].subs.map((item, i) => `Operations_${i}`);
        const collapsed = [];

        for (let i = 0; i < menuItems.length; i++) {
        for (let j = 0; j < menuItems[i].subs.length; j++) {
            collapsed.push(`${menuItems[i].id}_${j}`)
        }
        }

        setCollapsedMenus(collapsed);
    }


    const toggleMenuCollapse = (e, menuKey) => {

        e.preventDefault();

        if (collapsedMenus.indexOf(menuKey) > -1) {
        setCollapsedMenus(collapsedMenus.filter(x => x !== menuKey));
        } else {
        collapsedMenus.push(menuKey);
        setCollapsedMenus(collapsedMenus);   
        }
        return false;
    };

    const minimizeSubmenu = () => {
        props.handleDisplaySubmenu(false);
        props.changeSelectedMenuHasSubItems(false);
        const { containerClassnames, menuClickCount } = props;
        props.setContainerClassnames(
        1,
        containerClassnames,
        false
        );
        // toggle();
        // const { containerClassnames, menuClickCount } = props;
        // const currentClasses = containerClassnames
        //   ? containerClassnames.split(' ').filter(x => x !== '')
        //   : '';
        // props.addContainerClassname(
        //   'menu-sub-hidden',
        //   containerClassnames
        // );
    }

    const renderItem = (item) => {
        if (REACT_APP_NO_LOGIN) {
            return true;
        } else {
            const { accessTabs } = props.user && props.user;
            return accessTabs && accessTabs.includes(item.id.toUpperCase());  
        }
    }

    const { containerClassnames, menuClickCount } = props;
    const currentClasses = containerClassnames
    ? containerClassnames.split(' ').filter(x => x !== '')
    : '';

    const isActive = (selectedParentMenu, viewingParentMenu, item)  => {
        if ( (selectedParentMenu === item.id && viewingParentMenu === '') || (viewingParentMenu === item.id)  ) {
            return true;
        }
        return false;
    }

    const resolveRenderSubs = () => {
        if (props.user.b_airline) {
            return menuAirlines;
        }
        return menuItems;
    }

    const { darkMode } = props;
    const darkModeBg = {'bg-dark': darkMode};
    const darkModeTextClass = darkMode ? 'text-light' : '';

    return (
        <div className={`sidebar ${overdueReadingSign && 'customDisabled'}`} style={{ marginRight: '500px' }}>
            {/* <div className={`sidebar`} style={{ marginRight: '500px' }}> */}
            <div 
                className={classNames(
                    darkModeBg,
                    'main-menu'
                )} 
                style={{top: '50px', borderRadius: '0.7rem', height: '100%'}}
            >
            <div className="scroll">
                <PerfectScrollbar
                options={{ suppressScrollX: true, wheelPropagation: false }}
                >
                <Nav vertical className="list-unstyled">
                    {
                        Object.keys(sidebar).map((key, i) => sidebar[key].access &&
                            <NavItem
                                key={sidebar[key].id}
                                className={classnames({
                                    active:
                                    (selectedParentMenu === sidebar[key].id &&
                                        viewingParentMenu === '') ||
                                    viewingParentMenu === sidebar[key].id
                                })}
                            >
                                    <NavLink
                                        to={sidebar[key].to}
                                        onClick={e => openSubMenu(e, sidebar[key])}
                                        data-flag={sidebar[key].id}
                                    >
                                        <i 
                                            style={{fontSize: '48px'}} 
                                            className={classnames(
                                                'pt-4', 
                                                sidebar[key].icon, 
                                                `${isActive(selectedParentMenu, viewingParentMenu, sidebar[key]) ? 'fa-duotone' : `fa-light ${darkModeTextClass}`}`,
                                            )} 
                                        />{' '}
                                        <h6 className={`mt-2 ${darkModeTextClass}`}>{sidebar[key].label}</h6>
                                    </NavLink>
                            </NavItem>
                        )
                    }
                </Nav>
                </PerfectScrollbar>
            </div>
            </div>

            <div className={classNames("sub-menu", darkModeBg)} style={{top: '50px', borderRadius: '0.7rem', width: `${currentClasses.indexOf('sub-hidden') !== -1 ? '120px' : '270px'}`, height: '100%'}}>
            <div className="scroll">
                <PerfectScrollbar
                options={{ suppressScrollX: true, wheelPropagation: false }}
                >
                    {
                        Object.keys(sidebar).map(key => {
                            return (
                            <Nav
                                key={sidebar[key].id}
                                className={classnames({
                                    'd-block':
                                    (selectedParentMenu === sidebar[key].id &&
                                        viewingParentMenu === '') ||
                                    viewingParentMenu === sidebar[key].id
                                })}
                                data-parent={sidebar[key].id}
                            >
                                {Object.keys(sidebar[key].subs).map((sub, index) => {
                                    return (
                                        <NavItem
                                        key={`${sidebar[key].id}_${index}`}
                                        className={`${
                                            Object.keys(sidebar[key].subs).length > 0
                                            ? 'has-sub-item'
                                            : ''
                                        }`}
                                        >
                                            {
                                                Object.keys(sidebar[key].subs[sub].subs).length > 0 ? (
                                                <Fragment>
                                                    <NavLink
                                                        className={`rotate-arrow-icon ${darkModeTextClass} ${
                                                        collapsedMenus.indexOf(
                                                            `${sidebar[key].id}_${index}`
                                                        ) === -1
                                                            ? ''
                                                            : 'collapsed'
                                                        }`}
                                                        to={sidebar[key].subs[sub].to}
                                                        id={`${sidebar[key].id}_${index}`}
                                                        onClick={e =>
                                                        toggleMenuCollapse(
                                                            e,
                                                            `${sidebar[key].id}_${index}`
                                                        )
                                                        }
                                                        style={{fontWeight: 'bold', fontSize: '18px'}} 
                                                    >
                                                        <i className="simple-icon-arrow-down" />{sidebar[key].subs[sub].label}
                                                    </NavLink>
                    
                                                    <Collapse
                                                        isOpen={
                                                        collapsedMenus.indexOf(
                                                            `${sidebar[key].id}_${index}`
                                                        ) === -1
                                                        }
                                                    >
                                                        <Nav className="third-level-menu">
                                                        {Object.keys(sidebar[key].subs[sub].subs).map((thirdSub, thirdIndex) => {
                                                            return (
                                                            <NavItem
                                                                key={`${
                                                                sidebar[key].id
                                                                }_${index}_${thirdIndex}`}
                                                            >
                                                                <NavLink className={darkModeTextClass} to={sidebar[key].subs[sub].subs[thirdSub].to} onClick={() => minimizeSubmenu()} style={{fontWeight: 'bold', fontSize: '16px'}}>
                                                                    <i style={{fontSize: '36px'}} className={`${sidebar[key].subs[sub].subs[thirdSub].icon} ${darkModeTextClass}`} />{sidebar[key].subs[sub].subs[thirdSub].label}
                                                                </NavLink>
                                                            </NavItem>
                                                            );
                                                        })}
                                                        </Nav>
                                                    </Collapse>
                                                </Fragment>
                                                ) : (
                                                    <NavLink to={sidebar[key].subs[sub].to} style={{fontSize: '20px'}} onClick={() => minimizeSubmenu()}>
                                                    {/* make these inline */}
                                                    <i className={sidebar[key].subs[sub].icon} />{sidebar[key].subs[sub].label}
                                                    {/* <h6>{sub.label}</h6> */}
                                                    </NavLink>
                                                )
                                            }
                                        </NavItem>
                                    );
                                    })}
                                </Nav>
                            );
                    })}
                </PerfectScrollbar>
            </div>
            </div>
        </div>
        );
}

const mapStateToProps = ({ menu }) => {
  const {
    containerClassnames,
    subHiddenBreakpoint,
    menuHiddenBreakpoint,
    menuClickCount,
    selectedMenuHasSubItems
  } = menu;
  return {
    containerClassnames,
    subHiddenBreakpoint,
    menuHiddenBreakpoint,
    menuClickCount,
    selectedMenuHasSubItems
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    {
      setContainerClassnames,
      addContainerClassname,
      changeDefaultClassnames,
      changeSelectedMenuHasSubItems
    }
  )(Sidebar)
);
