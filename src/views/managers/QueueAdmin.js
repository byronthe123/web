import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import axios from 'axios';
import moment from 'moment';
import uuidv4 from 'uuid/v4';
import { NavLink } from "react-router-dom";
import classnames from "classnames";


import {
    Row,
    Card,
    CardBody,
    Nav,
    NavItem,
    Button,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownItem,
    DropdownMenu,
    TabContent,
    TabPane,
    Badge
  } from "reactstrap";

import LeftEarlyTable from '../../components/managers/queueAdmin/LeftEarlyTable';
import RestoreModal from '../../components/managers/queueAdmin/RestoreModal';
import ReserveDoors from '../../components/managers/queueAdmin/ReserveDoors';
import Override from '../../components/managers/queueAdmin/Override';


class QueueAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeFirstTab: "1",
            leftEarlyItems: [],
            modalRestore: false,
            companyToRestore: null,
            s_restored_reason: ''
        }
        this.toggleTab = this.toggleTab.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        //console.log(nextProps.user);
        if(prevState.user !== nextProps.user) {
            return {
                user: nextProps.user
            }
        }
        return null;
      }
    
      componentDidUpdate(prevProps) {
        if (this.props.user !== prevProps.user) {
            if (this.props.user.s_unit) {
              this.leftEarlyQuery();
            }
        }
      }

    componentDidMount() {
        this.leftEarlyQuery();
        this.interval = setInterval(this.leftEarlyQuery, 5000);
    }

    componentWillUnmount() {
        // Clear the interval right before component unmount
        clearInterval(this.interval);
    }

    leftEarlyQuery = () => {
        const s_unit = this.props.user.s_unit && this.props.user.s_unit;

        s_unit && this.props.baseApiUrl && this.props.headerAuthCode &&
        axios.post(`${this.props.baseApiUrl}/selectLeftEarly`, {
            s_unit
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {
            console.log(response.data);
            this.setState({
                leftEarlyItems: response.data
            }, () => {

            });
        }).catch(err => {
            console.log(err);
        });
    }

    setCompanyToRestore = (company) => {
        console.log(company);
        this.setState({
            companyToRestore: company,
        }, () => {
            this.handleModalRestore();
        });
    }

    handleRestoredReason = (e) => {
        this.setState({
            s_restored_reason: e.target.value
        });
    }

    handleModalRestore = () => {
        this.setState(prevState => ({
            modalRestore: !prevState.modalRestore
        }));
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeFirstTab: tab
          });
        }
    }

    restoreTruckingCompany = (dock=false) => {
        const now = moment().local().format('MM/DD/YYYY hh:mm A');
        const s_modified_by = this.props.user && this.props.user.s_email;
        const t_modified = now;
        const s_restored_reason = this.state.s_restored_reason;
        const { s_mawb_id, s_type } = this.state.companyToRestore;
        const { s_unit } = this.props.user;

        axios.put(`${this.props.baseApiUrl}/restoreCompany`, {
            s_unit,
            s_mawb_id,
            s_modified_by,
            t_modified,
            s_type,
            s_restored_reason
        }, {
            headers: {'Authorization': `Bearer ${this.props.headerAuthCode}`}
        }).then(response => {
            this.leftEarlyQuery();
            this.setState({
                modalRestore: false,
            });
        }).catch(error => {
           console.log(error); 
        });
    }

    render() {
        const {user, authButtonMethod, isAuthenticated, baseApiUrl, headerAuthCode, promptUserLocation, selectUserLocation, setUserLocation, saveUserLocation, launchModalChangeLocation, displaySubmenu, handleDisplaySubmenu, width, createSuccessNotification} = this.props;
        const {companyToRestore, s_restored_reason} = this.state;
        return (
            <Fragment>
                <AppLayout user={user} authButtonMethod={authButtonMethod} baseApiUrl={baseApiUrl} headerAuthCode={headerAuthCode}launchModalChangeLocation={launchModalChangeLocation} handleDisplaySubmenu={handleDisplaySubmenu}>
                    <div className={`card queue-card-container`} style={{height: 'calc(100vh - 120px)', overflowY: 'scroll', overflowX: 'hidden'}}>
                        <div className="card-body px-3 py-3">
                            <Nav tabs className="separator-tabs ml-0 mb-2">
                                <NavItem>
                                    <NavLink
                                    location={{}}
                                    to="#"
                                    className={classnames({
                                        active: this.state.activeFirstTab === "1",
                                        "nav-link": true
                                    })}
                                    onClick={() => {
                                        this.toggleTab("1");
                                    }}
                                    >
                                        Queue Management
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                    location={{}}
                                    to="#"
                                    className={classnames({
                                        active: this.state.activeFirstTab === "3",
                                        "nav-link": true
                                    })}
                                    onClick={() => {
                                        this.toggleTab("3");
                                    }}
                                    >
                                    Reserve Doors
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                    location={{}}
                                    to="#"
                                    className={classnames({
                                        active: this.state.activeFirstTab === "4",
                                        "nav-link": true
                                    })}
                                    onClick={() => {
                                        this.toggleTab("4");
                                    }}
                                    >
                                    Override
                                    </NavLink>
                                </NavItem>
                            </Nav>

                            <TabContent activeTab={this.state.activeFirstTab}>
                                <TabPane tabId="1">
                                    <Row>
                                        <div className='col-12'>
                                            <Card className="mb-4">
                                                <CardBody>
                                                    <div className='col-12'>
                                                        <LeftEarlyTable leftEarlyItems={this.state.leftEarlyItems} handleModal={this.handleModalRestore} setCompanyToRestore={this.setCompanyToRestore} width={width} />
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </Row>
                                </TabPane>
                                <TabPane tabId="2">
                                    <div className='col-12'>
                                        <Card className="mb-4">
                                            <CardBody>
                                                <div className='col-12'>
                                                    <LeftEarlyTable leftEarlyItems={this.state.leftEarlyItems.filter(i => i.s_status === 'LEFT DOCK')} handleModal={this.handleModalRestore} setCompanyToRestore={this.setCompanyToRestore} width={width} />
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </TabPane>
                                <TabPane tabId="3">
                                    <ReserveDoors
                                        user={user}
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        createSuccessNotification={createSuccessNotification}
                                    />
                                </TabPane>
                                <TabPane tabId="4">
                                    <Override
                                        user={user}
                                        baseApiUrl={baseApiUrl}
                                        headerAuthCode={headerAuthCode}
                                        createSuccessNotification={createSuccessNotification}
                                    />
                                </TabPane>
                            </TabContent>
                        </div>
                    </div>
                </AppLayout>

                <RestoreModal 
                    open={this.state.modalRestore}
                    handleModal={this.handleModalRestore}
                    companyToRestore={companyToRestore}
                    s_restored_reason={s_restored_reason}
                    handleRestoredReason={this.handleRestoredReason}
                    restoreTruckingCompany={this.restoreTruckingCompany}
                 />

            </Fragment>
        );
    }
}

export default withRouter(QueueAdmin);