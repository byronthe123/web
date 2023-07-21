import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Nav, NavItem, Collapse } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withRouter } from 'react-router-dom';
import ScaleLoader from 'react-spinners/ScaleLoader';

import sidebar from '../constants/sidebarMap';

import {
    setContainerClassnames,
    addContainerClassname,
    changeDefaultClassnames,
    changeSelectedMenuHasSubItems,
} from '../redux/actions';

import menuItems from '../constants/menu';
import menuAirlines from '../constants/menuAirlines';
import classNames from 'classnames';
import moment from 'moment';

const REACT_APP_NO_LOGIN = process.env.REACT_APP_NO_LOGIN;

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedParentMenu: '',
            viewingParentMenu: '',
            collapsedMenus: [],
            overdueReadingSign: false,
            accessMap: {},
            accessMapAssigned: this.props.accessMapAssigned,
        };
    }

    handleWindowResize = (event) => {
        // if (event && !event.isTrusted) {
        //   return;
        // }
        // const { containerClassnames } = this.props;
        // let nextClasses = this.getMenuClassesForResize(containerClassnames);
        // this.props.setContainerClassnames(
        //   0,
        //   nextClasses.join(' '),
        //   this.props.selectedMenuHasSubItems
        // );
    };

    handleDocumentClick = (e) => {
        const { containerClassnames, menuClickCount } = this.props;
        const currentClasses = containerClassnames
            ? containerClassnames.split(' ').filter((x) => x !== '')
            : '';

        if (currentClasses.indexOf('sub-hidden') !== -1) {
            this.props.handleDisplaySubmenu(false);
        } else {
            this.props.handleDisplaySubmenu(true);
        }

        const container = this.getContainer();
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
            (e.target.parentElement.parentElement.classList.contains(
                'menu-button'
            ) ||
                e.target.parentElement.parentElement.classList.contains(
                    'menu-button-mobile'
                ))
        ) {
            isMenuClick = true;
        }
        if (
            container.contains(e.target) ||
            container === e.target ||
            isMenuClick
        ) {
            return;
        }
        this.setState({
            viewingParentMenu: '',
        });
        this.toggle();
    };

    isMobile = () => {
        const hasSubItems = this.getIsHasSubItem();
        const {
            menuHiddenBreakpoint,
            subHiddenBreakpoint,
            containerClassnames,
        } = this.props;
        const windowWidth = window.innerWidth;
        if (windowWidth < menuHiddenBreakpoint) {
            document.getElementById('app-container').className =
                'main-hidden sub-hidden';
        }
    };

    getMenuClassesForResize = (classes) => {
        const { menuHiddenBreakpoint, subHiddenBreakpoint } = this.props;
        let nextClasses = classes.split(' ').filter((x) => x !== '');
        const windowWidth = window.innerWidth;
        if (windowWidth < menuHiddenBreakpoint) {
            nextClasses.push('menu-mobile');
        } else if (windowWidth < subHiddenBreakpoint) {
            nextClasses = nextClasses.filter((x) => x !== 'menu-mobile');
            if (
                nextClasses.includes('menu-default') &&
                !nextClasses.includes('menu-sub-hidden')
            ) {
                nextClasses.push('menu-sub-hidden');
            }
        } else {
            nextClasses = nextClasses.filter((x) => x !== 'menu-mobile');
            if (
                nextClasses.includes('menu-default') &&
                nextClasses.includes('menu-sub-hidden')
            ) {
                nextClasses = nextClasses.filter(
                    (x) => x !== 'menu-sub-hidden'
                );
            }
        }
        return nextClasses;
    };

    getContainer = () => {
        return ReactDOM.findDOMNode(this);
    };

    toggle = () => {
        const hasSubItems = this.getIsHasSubItem();
        this.props.changeSelectedMenuHasSubItems(hasSubItems);
        const { containerClassnames, menuClickCount } = this.props;
        const currentClasses = containerClassnames
            ? containerClassnames.split(' ').filter((x) => x !== '')
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
            if (
                currentClasses.includes('menu-sub-hidden') &&
                menuClickCount === 3
            ) {
                clickIndex = 2;
            } else if (
                currentClasses.includes('menu-hidden') ||
                currentClasses.includes('menu-mobile')
            ) {
                clickIndex = 0;
            }
        }
        if (clickIndex >= 0) {
            this.props.setContainerClassnames(
                clickIndex,
                containerClassnames,
                hasSubItems
            );
        }
    };

    handleProps = () => {
        this.addEvents();
    };

    addEvents = () => {
        ['click', 'touchstart', 'touchend'].forEach((event) =>
            document.addEventListener(event, this.handleDocumentClick, true)
        );
    };

    removeEvents = () => {
        ['click', 'touchstart', 'touchend'].forEach((event) =>
            document.removeEventListener(event, this.handleDocumentClick, true)
        );
    };

    setSelectedLiActive = (callback) => {
        const oldli = document.querySelector('.sub-menu  li.active');
        if (oldli != null) {
            oldli.classList.remove('active');
        }

        const oldliSub = document.querySelector('.third-level-menu  li.active');
        if (oldliSub != null) {
            oldliSub.classList.remove('active');
        }

        /* set selected parent menu */
        const selectedSublink = document.querySelector(
            '.third-level-menu  a.active'
        );
        if (selectedSublink != null) {
            selectedSublink.parentElement.classList.add('active');
        }

        const selectedlink = document.querySelector('.sub-menu  a.active');
        if (selectedlink != null) {
            selectedlink.parentElement.classList.add('active');
            console.log(selectedlink.parentElement.getAttribute(
                'data-parent'
            ));
            console.log(selectedlink.parentElement.parentElement.getAttribute(
                'data-parent'
            ));
            this.setState(
                {
                    selectedParentMenu:
                        selectedlink.parentElement.parentElement.getAttribute(
                            'data-parent'
                        ),
                },
                callback
            );
        } else {
            var selectedParentNoSubItem = document.querySelector(
                '.main-menu  li a.active'
            );
            if (selectedParentNoSubItem != null) {
                this.setState(
                    {
                        selectedParentMenu:
                            selectedParentNoSubItem.getAttribute('data-flag'),
                    },
                    callback
                );
            } else if (this.state.selectedParentMenu === '') {
                this.setState(
                    {
                        selectedParentMenu: menuItems[0].id,
                    },
                    callback
                );
            }
        }
    };

    setHasSubItemStatus = () => {
        const hasSubmenu = this.getIsHasSubItem();
        this.props.changeSelectedMenuHasSubItems(hasSubmenu);
        this.toggle();
    };

    // getIsHasSubItem = () => {
    //   const { selectedParentMenu } = this.state;
    //   const menuItem = menuItems.find(x => x.id === selectedParentMenu);
    //   if (menuItem)
    //     return menuItem && menuItem.subs && menuItem.subs.length > 0
    //       ? true
    //       : false;
    //   else return false;
    // };

    getIsHasSubItem = () => {
        const { selectedParentMenu } = this.state;
        const menuItem = menuItems.find((x) => x.id === selectedParentMenu);
        if (menuItem)
            if (menuItem && menuItem.subs && menuItem.subs.length > 0) {
                return true;
            } else {
                this.props.handleDisplaySubmenu(false);
                return false;
            }
        else {
            this.props.handleDisplaySubmenu(false);
            return false;
        }
    };

    resolveOverdueReadingSign = () => {
        const readingSigns = this.props.readingSigns || [];
        let overdue = false;
        for (let i = 0; i < readingSigns.length; i++) {
            if (
                readingSigns[i] &&
                !readingSigns[i].acknowledged &&
                readingSigns[i].readingSignId &&
                readingSigns[i].readingSignId.dueDate &&
                moment(
                    moment(readingSigns[i].readingSignId.dueDate).format(
                        'YYYY-MM-DD'
                    )
                ).isBefore(moment().format('YYYY-MM-DD'))
            ) {
                overdue = true;
                break;
            }
        }
        this.setState({
            overdueReadingSign: overdue,
        });
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        //console.log(nextProps.user);
        const updates = {};
        if (prevState.readingSigns !== nextProps.readingSigns) {
            updates.readingSigns = nextProps.readingSigns;
        }
        if (prevState.accessMap !== nextProps.accessMap) {
            updates.accessMap = nextProps.accessMap;
        }
        if (prevState.accessMapAssigned !== nextProps.accessMapAssigned) {
            updates.accessMapAssigned = nextProps.accessMapAssigned;
        }
        return updates;
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.setSelectedLiActive(this.setHasSubItemStatus);

            window.scrollTo(0, 0);
        }
        if (this.props.readingSigns !== prevProps.readingSigns) {
            this.resolveOverdueReadingSign();
        }
        if (this.props.accessMap !== prevProps.accessMap) {
            this.setState({
                accessMap: this.props.accessMap,
            });
        }
        if (this.props.accessMapAssigned !== prevProps.accessMapAssigned) {
            this.setState({
                accessMapAssigned: this.props.accessMapAssigned,
            });
        }
        this.handleProps();
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize);
        this.handleWindowResize();
        this.handleProps();
        this.setSelectedLiActive(this.setHasSubItemStatus);
        let collapsedMenus = this.state.collapsedMenus;
        this.closeCollapse();
        this.minimizeSubmenu();
        this.resolveOverdueReadingSign();
    }

    componentWillUnmount() {
        this.removeEvents();
        window.removeEventListener('resize', this.handleWindowResize);
    }

    openSubMenu = (e, menuItem) => {
        console.log(menuItem);

        const { containerClassnames, menuClickCount } = this.props;
        const currentClasses = containerClassnames
            ? containerClassnames.split(' ').filter((x) => x !== '')
            : '';

        const selectedParent = menuItem.id;
        const hasSubMenu = Object.keys(menuItem.subs).length > 0;

        alert(selectedParent);

        this.props.changeSelectedMenuHasSubItems(hasSubMenu);
        if (!hasSubMenu) {
            this.props.handleDisplaySubmenu(false);
            this.setState({
                viewingParentMenu: selectedParent,
                selectedParentMenu: selectedParent,
            });
            this.toggle();
        } else {
            e.preventDefault();
            this.props.handleDisplaySubmenu(true);

            const { containerClassnames, menuClickCount } = this.props;
            const currentClasses = containerClassnames
                ? containerClassnames.split(' ').filter((x) => x !== '')
                : '';

            if (!currentClasses.includes('menu-mobile')) {
                if (
                    currentClasses.includes('menu-sub-hidden') &&
                    (menuClickCount === 2 || menuClickCount === 0)
                ) {
                    this.props.setContainerClassnames(
                        3,
                        containerClassnames,
                        hasSubMenu
                    );
                } else if (
                    currentClasses.includes('menu-hidden') &&
                    (menuClickCount === 1 || menuClickCount === 3)
                ) {
                    this.props.setContainerClassnames(
                        2,
                        containerClassnames,
                        hasSubMenu
                    );
                } else if (
                    currentClasses.includes('menu-default') &&
                    !currentClasses.includes('menu-sub-hidden') &&
                    (menuClickCount === 1 || menuClickCount === 3)
                ) {
                    this.props.setContainerClassnames(
                        0,
                        containerClassnames,
                        hasSubMenu
                    );
                }
            } else {
                this.props.addContainerClassname(
                    'sub-show-temporary',
                    containerClassnames
                );
            }
            this.setState({
                viewingParentMenu: selectedParent,
                selectedParentMenu: selectedParent
            });
        }
    };

    closeCollapse = () => {
        this.isMobile();
        // const collapsed = menuItems && menuItems.map((item, i) => `${item.id}_${i}`);
        // const collapsed = menuItems && menuItems[1].subs.map((item, i) => `Operations_${i}`);
        const collapsed = [];

        for (let i = 0; i < menuItems.length; i++) {
            for (let j = 0; j < menuItems[i].subs.length; j++) {
                collapsed.push(`${menuItems[i].id}_${j}`);
            }
        }

        this.setState({
            collapsedMenus: collapsed,
        });
    };

    toggleMenuCollapse = (e, menuKey) => {
        e.preventDefault();

        let collapsedMenus = this.state.collapsedMenus;
        if (collapsedMenus.indexOf(menuKey) > -1) {
            this.setState(
                {
                    collapsedMenus: collapsedMenus.filter((x) => x !== menuKey),
                },
                () => {}
            );
        } else {
            collapsedMenus.push(menuKey);
            this.setState(
                {
                    collapsedMenus,
                },
                () => {}
            );
        }
        return false;
    };

    minimizeSubmenu = () => {
        this.props.handleDisplaySubmenu(false);
        this.props.changeSelectedMenuHasSubItems(false);
        const { containerClassnames, menuClickCount } = this.props;
        this.props.setContainerClassnames(1, containerClassnames, false);
        // this.toggle();
        // const { containerClassnames, menuClickCount } = this.props;
        // const currentClasses = containerClassnames
        //   ? containerClassnames.split(' ').filter(x => x !== '')
        //   : '';
        // this.props.addContainerClassname(
        //   'menu-sub-hidden',
        //   containerClassnames
        // );
    };

    renderItem = (item) => {
        if (REACT_APP_NO_LOGIN) {
            return true;
        } else {
            const { accessTabs } = this.props.user && this.props.user;
            return accessTabs && accessTabs.includes(item.id.toUpperCase());
        }
    };

    render() {
        const {
            selectedParentMenu,
            viewingParentMenu,
            collapsedMenus,
            accessMap,
            accessMapAssigned,
        } = this.state;

        const { containerClassnames, menuClickCount } = this.props;
        const currentClasses = containerClassnames
            ? containerClassnames.split(' ').filter((x) => x !== '')
            : '';

        const accessTabs = [
            // 'Portal',
            // 'Operations'
        ];

        const isActive = (selectedParentMenu, viewingParentMenu, item) => {
            if (
                (selectedParentMenu === item.id && viewingParentMenu === '') ||
                viewingParentMenu === item.id
            ) {
                return true;
            }
            return false;
        };

        const resolveRenderSubs = () => {
            if (this.props.user.b_airline) {
                return menuAirlines;
            }
            return menuItems;
        };

        const { darkMode } = this.props;
        const darkModeBg = { 'bg-dark': darkMode };
        const darkModeTextClass = darkMode ? 'text-light' : '';
        console.log({selectedParentMenu}, {viewingParentMenu});

        return (
            <div
                className={`sidebar ${
                    this.state.overdueReadingSign && 'customDisabled'
                }`}
                style={{ marginRight: '500px' }}
            >
                {accessMapAssigned ? (
                    <>
                        <div
                            className={classNames(darkModeBg, 'main-menu')}
                            style={{
                                top: '50px',
                                borderRadius: '0.7rem',
                                height: '100%',
                            }}
                        >
                            <div className="scroll">
                                <PerfectScrollbar
                                    options={{
                                        suppressScrollX: true,
                                        wheelPropagation: false,
                                    }}
                                >
                                    <Nav vertical className="list-unstyled">
                                        {this.props.user.b_airline
                                            ? Object.keys(accessMap).map(
                                                    (key, i) => (
                                                        <NavItem
                                                            key={sidebar[key].id}
                                                            className={classnames(
                                                                {
                                                                    active:
                                                                        (selectedParentMenu ===
                                                                            sidebar[key].id &&
                                                                            viewingParentMenu === '') ||
                                                                        viewingParentMenu === sidebar[key].id,
                                                                }
                                                            )}
                                                        >
                                                            <NavLink
                                                                to={
                                                                    sidebar[key].to
                                                                }
                                                                onClick={(e) =>
                                                                    this.openSubMenu(
                                                                        e,
                                                                        sidebar[key]
                                                                    )
                                                                }
                                                                data-flag={
                                                                    sidebar[key].id
                                                                }
                                                            >
                                                                <i
                                                                    style={{
                                                                        fontSize:
                                                                            '48px',
                                                                    }}
                                                                    className={classnames(
                                                                        'pt-4',
                                                                        sidebar[key].icon,
                                                                        `${
                                                                            isActive(
                                                                                selectedParentMenu,
                                                                                viewingParentMenu,
                                                                                sidebar[key]
                                                                            )
                                                                                ? 'fa-duotone'
                                                                                : `fa-light ${darkModeTextClass}`
                                                                        }`
                                                                    )}
                                                                />{' '}
                                                                <h6
                                                                    className={`mt-2 ${darkModeTextClass}`}
                                                                >
                                                                    {
                                                                        sidebar[key].label
                                                                    }
                                                                </h6>
                                                          </NavLink>
                                                      </NavItem>
                                                    )
                                              )
                                            : Object.keys(accessMap).map(
                                                  (key, i) => (
                                                      <NavItem
                                                          key={sidebar[key].id}
                                                          className={classnames(
                                                              {
                                                                  active:
                                                                      (selectedParentMenu ===
                                                                          sidebar[key].id &&
                                                                          viewingParentMenu === '') ||
                                                                      viewingParentMenu === sidebar[key].id,
                                                              }
                                                          )}
                                                      >
                                                          <NavLink
                                                              to={
                                                                  sidebar[key].to
                                                              }
                                                              onClick={(e) =>
                                                                  this.openSubMenu(
                                                                      e,
                                                                      sidebar[key]
                                                                  )
                                                              }
                                                              data-flag={
                                                                  sidebar[key].id
                                                              }
                                                          >
                                                              <i
                                                                style={{
                                                                    fontSize:
                                                                        '48px',
                                                                }}
                                                                className={classnames(
                                                                    'pt-4',
                                                                    sidebar[key].icon,
                                                                    `${
                                                                        isActive(
                                                                            selectedParentMenu,
                                                                            viewingParentMenu,
                                                                            sidebar[key]
                                                                        )
                                                                            ? 'fa-duotone'
                                                                            : `fa-light ${darkModeTextClass}`
                                                                        }`
                                                                )}
                                                              />{' '}
                                                              <h6
                                                                  className={`mt-2 ${darkModeTextClass}`}
                                                              >
                                                                    {
                                                                        sidebar[key].label
                                                                    }
                                                              </h6>
                                                          </NavLink>
                                                      </NavItem>
                                                  )
                                              )}
                                    </Nav>
                                </PerfectScrollbar>
                            </div>
                        </div>

                        <div
                            className={classNames('sub-menu', darkModeBg)}
                            style={{
                                top: '50px',
                                borderRadius: '0.7rem',
                                width: `${
                                    currentClasses.indexOf('sub-hidden') !== -1
                                        ? '120px'
                                        : '270px'
                                }`,
                                height: '100%',
                            }}
                        >
                            <div className="scroll">
                                <PerfectScrollbar
                                    options={{
                                        suppressScrollX: true,
                                        wheelPropagation: false,
                                    }}
                                >
                                    {Object.keys(accessMap).map((key) => (
                                        <Nav
                                            key={accessMap[key].id}
                                            className={classnames({
                                                'd-block':
                                                    (this.state.selectedParentMenu ===
                                                        accessMap[key].id &&
                                                        this.state.viewingParentMenu === '') ||
                                                    this.state
                                                        .viewingParentMenu ===
                                                        accessMap[key].id,
                                            })}
                                            data-parent={accessMap[key].id}
                                        >
                                            {accessMap[key].subs &&
                                                Object.keys(
                                                    accessMap[key].subs
                                                ).map((sub, index) => (
                                                    <NavItem
                                                        key={`${accessMap[key].id}_${index}`}
                                                        className={`${
                                                            Object.keys(
                                                                accessMap[key]
                                                                    .subs
                                                            ).length > 0
                                                                ? 'has-sub-item'
                                                                : ''
                                                        }`}
                                                    >
                                                        {accessMap[key].subs[sub].subs &&
                                                            Object.keys(accessMap[key].subs[sub].subs).length > 0 ? (
                                                            <Fragment>
                                                                <NavLink
                                                                    className={`rotate-arrow-icon ${darkModeTextClass} ${
                                                                        collapsedMenus.indexOf(
                                                                            `${accessMap[key].id}_${index}`
                                                                        ) === -1
                                                                            ? ''
                                                                            : 'collapsed'
                                                                    }`}
                                                                    to={
                                                                        accessMap[key].subs[sub].to
                                                                    }
                                                                    id={`${accessMap[key].id}_${index}`}
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        this.toggleMenuCollapse(
                                                                            e,
                                                                            `${accessMap[key].id}_${index}`
                                                                        )
                                                                    }
                                                                    style={{
                                                                        fontWeight:
                                                                            'bold',
                                                                        fontSize:
                                                                            '18px',
                                                                    }}
                                                                >
                                                                    <i className="simple-icon-arrow-down" />
                                                                    {
                                                                        accessMap[key].subs[sub].label
                                                                    }
                                                                </NavLink>

                                                                <Collapse
                                                                    isOpen={
                                                                        collapsedMenus.indexOf(
                                                                            `${accessMap[key].id}_${index}`
                                                                        ) === -1
                                                                    }
                                                                >
                                                                    <Nav className="third-level-menu">
                                                                        {Object.keys(
                                                                            accessMap[key].subs[sub].subs
                                                                        ).map(
                                                                            (
                                                                                thirdSub,
                                                                                thirdIndex
                                                                            ) => (
                                                                                <NavItem
                                                                                    key={`${accessMap[key].id}_${index}_${thirdIndex}`}
                                                                                >
                                                                                    <NavLink
                                                                                        className={
                                                                                            darkModeTextClass
                                                                                        }
                                                                                        to={
                                                                                            accessMap[key].subs[sub].subs[thirdSub].to
                                                                                        }
                                                                                        onClick={() =>
                                                                                            this.minimizeSubmenu()
                                                                                        }
                                                                                        style={{
                                                                                            fontWeight:
                                                                                                'bold',
                                                                                            fontSize:
                                                                                                '16px',
                                                                                        }}
                                                                                    >
                                                                                        <i
                                                                                            style={{
                                                                                                fontSize:
                                                                                                    '36px',
                                                                                            }}
                                                                                            className={`${accessMap[key].subs[sub].subs[thirdSub].icon} ${darkModeTextClass}`}
                                                                                        />
                                                                                        {accessMap[key].id}{' '}{
                                                                                            accessMap[key]
                                                                                                .subs[sub]
                                                                                                .subs[thirdSub].label
                                                                                        }
                                                                                    </NavLink>
                                                                                </NavItem>
                                                                            )
                                                                        )}
                                                                    </Nav>
                                                                </Collapse>
                                                            </Fragment>
                                                        ) : (
                                                            <NavLink
                                                                to={
                                                                    accessMap[key].subs[sub].to
                                                                }
                                                                style={{
                                                                    fontSize:
                                                                        '20px',
                                                                }}
                                                                onClick={() =>
                                                                    this.minimizeSubmenu()
                                                                }
                                                            >
                                                                <i
                                                                    className={accessMap[key].subs[sub].icon}
                                                                />
                                                                {
                                                                    accessMap[key].subs[sub].label
                                                                }
                                                            </NavLink>
                                                        )}
                                                    </NavItem>
                                                ))}
                                        </Nav>
                                    ))}
                                </PerfectScrollbar>
                            </div>
                        </div>
                    </>
                ) : (
                    <div
                        style={{
                            height: 'calc(100vh - 250px)',
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: '25px',
                        }}
                    >
                        <div>
                            <ScaleLoader color={'#6fb327'} />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = ({ menu }) => {
    const {
        containerClassnames,
        subHiddenBreakpoint,
        menuHiddenBreakpoint,
        menuClickCount,
        selectedMenuHasSubItems,
    } = menu;
    return {
        containerClassnames,
        subHiddenBreakpoint,
        menuHiddenBreakpoint,
        menuClickCount,
        selectedMenuHasSubItems,
    };
};
export default withRouter(
    connect(mapStateToProps, {
        setContainerClassnames,
        addContainerClassname,
        changeDefaultClassnames,
        changeSelectedMenuHasSubItems,
    })(Sidebar)
);
