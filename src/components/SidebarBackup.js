import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Nav, NavItem, Collapse } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withRouter } from 'react-router-dom';

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

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedParentMenu: '',
      viewingParentMenu: '',
      collapsedMenus: [],
      overdueReadingSign: false
    };
  }
  
  handleWindowResize = event => {
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

  handleDocumentClick = e => {
    const { containerClassnames, menuClickCount } = this.props;
    const currentClasses = containerClassnames
      ? containerClassnames.split(' ').filter(x => x !== '')
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
    this.setState({
      viewingParentMenu: ''
    });
    this.toggle();
  };

  isMobile = () => {
    const hasSubItems = this.getIsHasSubItem();
    const { menuHiddenBreakpoint, subHiddenBreakpoint, containerClassnames } = this.props;
    const windowWidth = window.innerWidth;
    if (windowWidth < menuHiddenBreakpoint) {
        // alert('working');
        document.getElementById('app-container').className = 'main-hidden sub-hidden';
    }
  }

  getMenuClassesForResize = classes => {
    const { menuHiddenBreakpoint, subHiddenBreakpoint } = this.props;
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

  getContainer = () => {
    return ReactDOM.findDOMNode(this);
  };

  toggle = () => {
    const hasSubItems = this.getIsHasSubItem();
    this.props.changeSelectedMenuHasSubItems(hasSubItems);
    const { containerClassnames, menuClickCount } = this.props;
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
    ['click', 'touchstart', 'touchend'].forEach(event =>
      document.addEventListener(event, this.handleDocumentClick, true)
    );
  };

  removeEvents = () => {
    ['click', 'touchstart', 'touchend'].forEach(event =>
      document.removeEventListener(event, this.handleDocumentClick, true)
    );
  };

  setSelectedLiActive = callback => {
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
      this.setState(
        {
          selectedParentMenu: selectedlink.parentElement.parentElement.getAttribute(
            'data-parent'
          )
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
            selectedParentMenu: selectedParentNoSubItem.getAttribute(
              'data-flag'
            )
          },
          callback
        );
      } else if (this.state.selectedParentMenu === '') {
        this.setState(
          {
            selectedParentMenu: menuItems[0].id
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
    const menuItem = menuItems.find(x => x.id === selectedParentMenu);
    if (menuItem)
      if (menuItem && menuItem.subs && menuItem.subs.length > 0) {
        return true;
      } else {
        //alert('false')
        this.props.handleDisplaySubmenu(false);
        return false;
      }
    else {
      //alert('false')
      this.props.handleDisplaySubmenu(false);
      return false;
    }
  };

  resolveOverdueReadingSign = () => {
    const readingSigns = this.props.readingSigns || [];
    let overdue = false;
    for (let i = 0; i < readingSigns.length; i++) {
        if (readingSigns[i] && !readingSigns[i].acknowledged && readingSigns[i].readingSignId && readingSigns[i].readingSignId.dueDate && moment(moment(readingSigns[i].readingSignId.dueDate).format('YYYY-MM-DD')).isBefore(moment().format('YYYY-MM-DD'))) {
            overdue = true;
            break;
        }
    }
    this.setState({
        overdueReadingSign: overdue
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
        //console.log(nextProps.user);
        if(prevState.readingSigns !== nextProps.readingSigns) {
            return {
                readingSigns: nextProps.readingSigns
            }
        }
        return null;
    }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setSelectedLiActive(this.setHasSubItemStatus);

      window.scrollTo(0, 0);
    }
    if (this.props.readingSigns !== prevProps.readingSigns) {
        this.resolveOverdueReadingSign();
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

    const { containerClassnames, menuClickCount } = this.props;
    const currentClasses = containerClassnames
      ? containerClassnames.split(' ').filter(x => x !== '')
      : '';

    const selectedParent = menuItem.id;
    const hasSubMenu = menuItem.subs && menuItem.subs.length > 0;

    this.props.changeSelectedMenuHasSubItems(hasSubMenu);
    if (!hasSubMenu) {
      this.props.handleDisplaySubmenu(false);
      this.setState({
        viewingParentMenu: selectedParent,
        selectedParentMenu: selectedParent
      });
      this.toggle();
    } else {
      e.preventDefault();
      this.props.handleDisplaySubmenu(true);

      const { containerClassnames, menuClickCount } = this.props;
      const currentClasses = containerClassnames
        ? containerClassnames.split(' ').filter(x => x !== '')
        : '';

      if (!currentClasses.includes('menu-mobile')) {
        if (
          currentClasses.includes('menu-sub-hidden') &&
          (menuClickCount === 2 || menuClickCount === 0)
        ) {
          this.props.setContainerClassnames(3, containerClassnames, hasSubMenu);
        } else if (
          currentClasses.includes('menu-hidden') &&
          (menuClickCount === 1 || menuClickCount === 3)
        ) {
          this.props.setContainerClassnames(2, containerClassnames, hasSubMenu);
        } else if (
          currentClasses.includes('menu-default') &&
          !currentClasses.includes('menu-sub-hidden') &&
          (menuClickCount === 1 || menuClickCount === 3)
        ) {
          this.props.setContainerClassnames(0, containerClassnames, hasSubMenu);
        }
      } else {
        this.props.addContainerClassname(
          'sub-show-temporary',
          containerClassnames
        );
      }
      this.setState({
        viewingParentMenu: selectedParent
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
        collapsed.push(`${menuItems[i].id}_${j}`)
      }
    }

    this.setState({
      collapsedMenus: collapsed
    });
  }


  toggleMenuCollapse = (e, menuKey) => {

    e.preventDefault();

    let collapsedMenus = this.state.collapsedMenus;
    if (collapsedMenus.indexOf(menuKey) > -1) {
      this.setState({
        collapsedMenus: collapsedMenus.filter(x => x !== menuKey)
      }, () => {
      });
    } else {
      collapsedMenus.push(menuKey);
      this.setState({
        collapsedMenus
      }, () => {
      });    
    }
    return false;
  };

  minimizeSubmenu = () => {

    this.props.handleDisplaySubmenu(false);
    this.props.changeSelectedMenuHasSubItems(false);
    const { containerClassnames, menuClickCount } = this.props;
    this.props.setContainerClassnames(
      1,
      containerClassnames,
      false
    );
    // this.toggle();
    // const { containerClassnames, menuClickCount } = this.props;
    // const currentClasses = containerClassnames
    //   ? containerClassnames.split(' ').filter(x => x !== '')
    //   : '';
    // this.props.addContainerClassname(
    //   'menu-sub-hidden',
    //   containerClassnames
    // );
  }

  resolveCountMapping = (_label) => {
    const {outQueueCount, outExportCount, outImportCount} = this.props;
    const label = _label.toUpperCase();
    switch(label) {
      case 'QUEUE':
        return outQueueCount;
      case 'EXPORT':
        return outExportCount;
      case 'IMPORT':
        return outImportCount;
    }
  }

  renderItem = (item) => {
      if (REACT_APP_NO_LOGIN) {
        return true;
      } else {
        const { accessTabs } = this.props.user && this.props.user;
        return accessTabs && accessTabs.includes(item.id.toUpperCase());  
      }
  }

  render() {
    const {
      selectedParentMenu,
      viewingParentMenu,
      collapsedMenus
    } = this.state;

    const { containerClassnames, menuClickCount } = this.props;
    const currentClasses = containerClassnames
      ? containerClassnames.split(' ').filter(x => x !== '')
      : '';

    const accessTabs = [
        // 'Portal',
        // 'Operations'
    ];  

    const isActive = (selectedParentMenu, viewingParentMenu, item)  => {
        if ( (selectedParentMenu === item.id && viewingParentMenu === '') || (viewingParentMenu === item.id)  ) {
            return true;
        }
        return false;
    }

    const resolveRenderSubs = () => {
        if (this.props.user.b_airline) {
            return menuAirlines;
        }
        return menuItems;
    }

    const { darkMode } = this.props;
    const darkModeBg = {'bg-dark': darkMode};
    const darkModeTextClass = darkMode ? 'text-light' : '';

    return (
      <div className={`sidebar ${this.state.overdueReadingSign && 'customDisabled'}`} style={{ marginRight: '500px' }}>
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
                this.props.user.b_airline ? 
                    menuAirlines.map(item => 
                        <NavItem
                            key={item.id}
                            className={classnames({
                                active:
                                (selectedParentMenu === item.id &&
                                    viewingParentMenu === '') ||
                                viewingParentMenu === item.id
                            })}
                            >
                            {item.newWindow ? (
                                <a
                                href={item.to}
                                rel="noopener noreferrer"
                                target="_blank"
                                >
                                <i className={item.icon} />{' '}
                                </a>
                            ) : (
                                <NavLink
                                to={item.to}
                                onClick={e => this.openSubMenu(e, item)}
                                data-flag={item.id}
                                >
                                <i 
                                    style={{fontSize: '48px'}} 
                                    className={classnames('pt-4', item.icon, `${isActive(selectedParentMenu, viewingParentMenu, item) ? 'fad' : 'fal'}`)} 
                                />{' '}
                                <h6 className='mt-2'>{item.label}</h6>
                                </NavLink>
                            )}
                        </NavItem>    
                    ) :
                  menuItems.map(item => this.renderItem(item) &&
                    <NavItem
                        key={item.id}
                        className={classnames({
                            active:
                            (selectedParentMenu === item.id &&
                                viewingParentMenu === '') ||
                            viewingParentMenu === item.id
                        })}
                        >
                        {item.newWindow ? (
                            <a
                                href={item.to}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                            <i className={item.icon} />{' '}
                            </a>
                        ) : (
                            <NavLink
                            to={item.to}
                            onClick={e => this.openSubMenu(e, item)}
                            data-flag={item.id}
                            >
                            <i 
                                style={{fontSize: '48px'}} 
                                className={classnames(
                                    'pt-4', 
                                    item.icon, 
                                    `${isActive(selectedParentMenu, viewingParentMenu, item) ? 'fa-duotone' : `fa-light ${darkModeTextClass}`}`,
                                )} 
                            />{' '}
                            <h6 className={`mt-2 ${darkModeTextClass}`}>{item.label}</h6>
                            </NavLink>
                        )}
                    </NavItem>
                  )}
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
                resolveRenderSubs().map(item => {
                  return (
                    <Nav
                      key={item.id}
                      className={classnames({
                        'd-block':
                          (this.state.selectedParentMenu === item.id &&
                            this.state.viewingParentMenu === '') ||
                          this.state.viewingParentMenu === item.id
                      })}
                      data-parent={item.id}
                    >
                      {item.subs &&
                        item.subs.map((sub, index) => {
                          return (
                            <NavItem
                              key={`${item.id}_${index}`}
                              className={`${
                                sub.subs && sub.subs.length > 0
                                  ? 'has-sub-item'
                                  : ''
                              }`}
                            >
                              {sub.newWindow ? (
                                <a
                                  href={sub.to}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  <i className={sub.icon} />{sub.label}
                                </a>
                              ) : sub.subs && sub.subs.length > 0 ? (
                                <Fragment>
                                  <NavLink
                                    className={`rotate-arrow-icon ${darkModeTextClass} ${
                                      collapsedMenus.indexOf(
                                        `${item.id}_${index}`
                                      ) === -1
                                        ? ''
                                        : 'collapsed'
                                    }`}
                                    to={sub.to}
                                    id={`${item.id}_${index}`}
                                    onClick={e =>
                                      this.toggleMenuCollapse(
                                        e,
                                        `${item.id}_${index}`
                                      )
                                    }
                                    style={{fontWeight: 'bold', fontSize: '18px'}} 
                                  >
                                    <i className="simple-icon-arrow-down" />{sub.label}
                                  </NavLink>

                                  <Collapse
                                    isOpen={
                                      collapsedMenus.indexOf(
                                        `${item.id}_${index}`
                                      ) === -1
                                    }
                                  >
                                    <Nav className="third-level-menu">
                                      {sub.subs.map((thirdSub, thirdIndex) => {
                                        return (
                                          <NavItem
                                            key={`${
                                              item.id
                                            }_${index}_${thirdIndex}`}
                                          >
                                            {thirdSub.newWindow ? (
                                              <a
                                                href={thirdSub.to}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                              >
                                                <i className={thirdSub.icon} />{''}
                                              </a>
                                            ) : (
                                              <NavLink className={darkModeTextClass} to={thirdSub.to} onClick={() => this.minimizeSubmenu()} style={{fontWeight: 'bold', fontSize: '16px'}}>
                                                <i style={{fontSize: '36px'}} className={`${thirdSub.icon} ${darkModeTextClass}`} />{thirdSub.label}
                                              </NavLink>
                                            )}
                                          </NavItem>
                                        );
                                      })}
                                    </Nav>
                                  </Collapse>
                                </Fragment>
                              ) : (
                                <NavLink to={sub.to} style={{fontSize: '20px'}} onClick={() => this.minimizeSubmenu()}>
                                  {/* make these inline */}
                                  <i className={sub.icon} />{sub.label}
                                  {/* <h6>{sub.label}</h6> */}
                                </NavLink>
                              )}
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
