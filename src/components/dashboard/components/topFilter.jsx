import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import ReactTooltip from "react-tooltip";
import { resetBreadCrumpData } from "../../../config/utils";
import Portal from "../../common/components/Portal";
import ForgotModal from "../../common/components/forgotPasswordModal";
import history from "../../../config/history";
import ShowHelperModal from "../../helper/components/ShowHelperModal";
import dashboardAction from "../actions";
import userAction from "../../user/actions";
import { unSubscribeDevice } from "../../../config/firebase";
import { MASTER_FILTERS } from "../constants";
import { FilterItem } from "./FilterItem";
import { ProfilePopup } from "./ProfilePopup";
import profileIcon from "../../../assets/img/dsh-prof.svg";
class TopFilter extends Component {
    constructor(props) {
        super(props);

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    state = {
        consultrancy_ids: [],
        consultrancy_id_names: [],
        client_ids: [],
        client_names: [],
        project_ids: [],
        project_names: [],
        site_ids: [],
        site_names: [],
        region_ids: [],
        region_names: [],
        building_ids: [],
        building_names: [],
        isFullView: true,
        building_types: [],
        building_types_names: [],
        fci_color: [],
        color_scale_names: [],
        infrastructure_requests: [],
        facility_master_plan: [],
        infrastructure_requests_names: [],
        scree: true,
        start: null,
        end: null,
        year: {},
        showSettingsDropDown: false,
        updateFCI: true,
        consultancy_flag: false,
        client_flag: false,
        projects_flag: false,
        region_flag: false,
        site_flag: false,
        btype_flag: false,
        building_flag: false,
        fci_flag: false,
        flag: false,
        showResetPasswordModal: false,
        showHelperModal: false,
        selectedHelperItem: {},
        search: "",
        dropDownLoader: {},
        showMore: false
    };

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
        this.exitFullScreen();
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    exitFullScreen = () => {
        var element = document.getElementsByTagName("BODY")[0];
        var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;
        element.requestFullScreen =
            element.requestFullScreen ||
            element.webkitRequestFullScreen ||
            element.mozRequestFullScreen ||
            function () {
                return false;
            };
        document.cancelFullScreen =
            document.cancelFullScreen ||
            document.webkitCancelFullScreen ||
            document.mozCancelFullScreen ||
            function () {
                return false;
            };

        if (isFullscreen) {
            document.cancelFullScreen();
        }
    };

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({
                showDropDown: ""
            });
        }
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.getDashboard !== this.props.getDashboard) {
            if (this.props.getDashboard && this.props.getDashboard.years) {
                let graphData = this.props.getDashboard.years;

                let yearValues = [];
                for (let i = graphData.start; i <= graphData.end; i++) yearValues.push(i);

                this.setState({
                    yearValues,
                    year: {
                        start: graphData.start,
                        end: graphData.end
                    }
                });
            }
        }
        if (prevProps.filterNames !== this.props.filterNames) {
            if (this.props.filterNames && this.props.filterNames.length) {
                this.setState({
                    consultrancy_id_names: this.props.filterNames.find(fn => fn.name === "Consultancy")
                        ? this.props.filterNames.find(fn => fn.name === "Consultancy").value
                        : [],
                    client_names: this.props.filterNames.find(fn => fn.name === "Clients")
                        ? this.props.filterNames.find(fn => fn.name === "Clients").value
                        : [],
                    project_names: this.props.filterNames.find(fn => fn.name === "FCA Projects")
                        ? this.props.filterNames.find(fn => fn.name === "FCA Projects").value
                        : [],
                    site_names: this.props.filterNames.find(fn => fn.name === "Sites")
                        ? this.props.filterNames.find(fn => fn.name === "Sites").value
                        : [],
                    region_names: this.props.filterNames.find(fn => fn.name === "Regions")
                        ? this.props.filterNames.find(fn => fn.name === "Regions").value
                        : [],
                    building_names: this.props.filterNames.find(fn => fn.name === "Buildings")
                        ? this.props.filterNames.find(fn => fn.name === "Buildings").value
                        : [],
                    color_scale_names: this.props.filterNames.find(fn => fn.name === "FCI")
                        ? this.props.filterNames.find(fn => fn.name === "FCI").value
                        : [],
                    building_types_names: this.props.filterNames.find(fn => fn.name === "Building Types")
                        ? this.props.filterNames.find(fn => fn.name === "Building Types").value
                        : []
                });
            } else {
                this.setState({
                    consultrancy_ids: [],
                    consultrancy_id_names: [],
                    client_ids: [],
                    client_names: [],
                    project_ids: [],
                    project_names: [],
                    site_ids: [],
                    // infrastructure_requests_ids: [],
                    // infrastructure_requests_names: [],
                    site_names: [],
                    region_ids: [],
                    region_names: [],
                    building_ids: [],
                    building_names: [],
                    building_types: [],
                    fci_color: [],
                    color_scale_names: [],
                    building_types_names: []
                });
            }
        }
        if (prevProps.dashboardFilterParams !== this.props.dashboardFilterParams) {
            let graphData = this.props.getDashboard.years;
            let yearValues = [];
            if (graphData) {
                for (let i = graphData.start; i <= graphData.end; i++) yearValues.push(i);
            }
            this.setState({
                yearValues,
                building_ids: this.props.dashboardFilterParams.building_ids || [],
                consultrancy_ids: this.props.dashboardFilterParams.consultancy_ids || [],
                client_ids: this.props.dashboardFilterParams.client_ids || [],
                project_ids: this.props.dashboardFilterParams.project_ids || [],
                site_ids: this.props.dashboardFilterParams.site_ids || [],
                region_ids: this.props.dashboardFilterParams.region_ids || [],
                fci_color: this.props.dashboardFilterParams.fci_color || [],
                building_types: this.props.dashboardFilterParams.building_types || [],
                year: {
                    start: this.props.dashboardFilterParams.start_year || (graphData && graphData.start),
                    end: this.props.dashboardFilterParams.end_year || (graphData && graphData.end)
                },
                infrastructure_requests: this.props.dashboardFilterParams.infrastructure_requests || []
            });
        }
    };

    clearFilter = async () => {
        this.setState({
            consultrancy_ids: [],
            consultrancy_id_names: [],
            client_ids: [],
            client_names: [],
            project_ids: [],
            project_names: [],
            site_ids: [],
            site_names: [],
            region_ids: [],
            region_names: [],
            building_ids: [],
            building_names: [],
            building_types: [],
            fci_color: [],
            color_scale_names: [],
            infrastructure_requests: [],
            facility_master_plan: [],
            infrastructure_requests_names: [],
            building_types_names: [],
            year: {
                start: this.props.getDashboard && this.props.getDashboard.years && this.props.getDashboard.years.start,
                end: this.props.getDashboard && this.props.getDashboard.years && this.props.getDashboard.years.end
            },
            updateFCI: true,
            flag: false,
            consultancy_flag: false,
            client_flag: false,
            projects_flag: false,
            region_flag: false,
            site_flag: false,
            btype_flag: false,
            building_flag: false,
            fci_flag: false
        });
        await this.props.clearAllFilter();
    };

    resetDashboard = async () => {
        this.setState({
            consultrancy_ids: [],
            consultrancy_id_names: [],
            client_ids: [],
            client_names: [],
            project_ids: [],
            project_names: [],
            site_ids: [],
            site_names: [],
            region_ids: [],
            region_names: [],
            building_ids: [],
            building_names: [],
            building_types_names: [],
            building_types: [],
            fci_color: [],
            color_scale_names: [],
            infrastructure_requests: [],
            facility_master_plan: [],
            infrastructure_requests_names: [],

            year: {
                start: this.props.getDashboard && this.props.getDashboard.years && this.props.getDashboard.years.start,
                end: this.props.getDashboard && this.props.getDashboard.years && this.props.getDashboard.years.end
            },
            updateFCI: true,
            flag: false,
            consultancy_flag: false,
            client_flag: false,
            projects_flag: false,
            region_flag: false,
            site_flag: false,
            btype_flag: false,
            building_flag: false,
            fci_flag: false
        });
        await this.props.resetDashboard();
    };

    handleClickArrow = () => {};

    toggleFullscreen = event => {
        var element = document.getElementsByTagName("BODY")[0];
        var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;
        if (event instanceof HTMLElement) {
            element = event;
        }

        element.requestFullScreen =
            element.requestFullScreen ||
            element.webkitRequestFullScreen ||
            element.mozRequestFullScreen ||
            function () {
                return false;
            };
        document.cancelFullScreen =
            document.cancelFullScreen ||
            document.webkitCancelFullScreen ||
            document.mozCancelFullScreen ||
            function () {
                return false;
            };

        if (isFullscreen) {
            document.cancelFullScreen();
            console.log(isFullscreen);
        } else {
            element.requestFullScreen();
        }
        isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();
        this.setState({
            isFullView: isFullscreen
        });
    };

    logoutUserConfirm = async () => {
        await this.props.logoutUser();
        if (this.props.loginReducer && this.props.loginReducer.logoutUser && this.props.loginReducer.logoutUser.success) {
            let userId = localStorage.getItem("userId");
            unSubscribeDevice(userId);
            localStorage.clear();
            sessionStorage.removeItem("bc-data");
            history.push("/");
        }
    };

    viewUser = () => {
        this.setState({ showSettingsDropDown: false });
        let userId = localStorage.getItem("userId");
        const { history } = this.props;
        const {
            location: { search }
        } = this.props;
        this.setState({
            selectedUser: userId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Basic Details",
                    path: `/user/userinfo/${userId}/basicdetails`
                },
                {
                    key: "buildings",
                    name: "Buildings",
                    path: `/user/userinfo/${userId}/buildings${search}`
                },
                {
                    key: "projects",
                    name: "FCA Projects",
                    path: `/user/userinfo/${userId}/projects${search}`
                }
            ]
        });
        let tabKeyList = ["basicdetails", "buildings", "projects"];
        let tab = "basicdetails";
        resetBreadCrumpData({
            key: "main",
            name: "User",
            path: `/user/userinfo/${userId}/${tab}`
        });
        history.push(`/user/userinfo/${userId}/${tab}`);

        // history.push("/");
    };

    handleResetPassword = () => {
        this.setState({ showSettingsDropDown: false, showResetPasswordModal: true });
    };

    renderPasswordModal = () => {
        const { showResetPasswordModal } = this.state;
        if (!showResetPasswordModal) return null;

        return <Portal body={<ForgotModal onCancel={this.onCancel} resetPasswordProfile={this.resetPasswordProfile} />} onCancel={this.onCancel} />;
    };

    resetPasswordProfile = async param => {
        let userId = localStorage.getItem("userId");
        await this.props.resetPasswordProfile(userId, param);
        const {
            loginReducer: { resetPassword }
        } = this.props;

        if (resetPassword?.success) {
            await this.setState({
                errorMessage: "",
                alertMessage: resetPassword.message,
                subimitDisabled: true,
                showResetPasswordModal: false
            });

            this.showAlert();
            return null;
        } else {
            return resetPassword?.message || "Error while resetting password";
        }
    };

    showAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };

    onCancel = () => {
        this.setState({
            showResetPasswordModal: false
        });
    };

    showHelperModal = async (item, subItem) => {
        await this.setState({
            showHelperModal: true,
            selectedHelperItem: {
                item,
                subItem
            }
        });
    };

    renderUploadHelperModal = () => {
        const { showHelperModal, selectedHelperItem } = this.state;
        if (!showHelperModal) return null;
        return (
            <Portal
                body={<ShowHelperModal selectedHelperItem={selectedHelperItem} onCancel={() => this.setState({ showHelperModal: false })} />}
                onCancel={() => this.setState({ showHelperModal: false })}
            />
        );
    };

    handleFilterView = async (name, paramKey) => {
        const { dashboardFilterParams } = this.props;
        const { dropDownLoader } = this.state;
        this.setState({
            dropDownLoader: {
                ...dropDownLoader,
                [name]: true
            }
        });
        const { [paramKey]: omit, ...rest } = dashboardFilterParams;
        await this.props.getMasterFilter(rest, name);
        this.setState({
            dropDownLoader: {
                ...dropDownLoader,
                [name]: false
            }
        });

        ReactTooltip.rebuild();
    };

    isMoreHighlighted = () => {
        const { dashboardFilterParams } = this.props;
        return MASTER_FILTERS.filter(elem => elem.isMore).some(elem => dashboardFilterParams?.[elem.paramKey]?.length);
    };

    setMyState = state => {
        this.setState(state);
    };

    render() {
        const { showDropDown, yearValues, isFullView, showMore } = this.state;
        const { dashboardFilterParams } = this.props;
        const { masterFilterList: dropdownValues } = this.props.dashboardReducer;
        const userName = localStorage.getItem("user");
        return (
            <div className="col-md-12" id={"top-fltr"} ref={this.setWrapperRef}>
                {this.renderPasswordModal()}
                <div className="d-flex itm-nmb">
                    <ReactTooltip id="dashboard-icons" place="left" className="rc-tooltip-custom-class" />
                    {MASTER_FILTERS?.filter(elem => !elem.isMore)?.map(elem => (
                        <FilterItem
                            elem={elem}
                            dashboardFilterParams={dashboardFilterParams}
                            state={this.state}
                            setState={this.setMyState}
                            handleFilter={this.props.handleFilter}
                            showDropDown={showDropDown}
                            handleFilterView={this.handleFilterView}
                            dropdownValues={dropdownValues}
                        />
                    ))}
                    <div
                        className={
                            dashboardFilterParams.start_year && dashboardFilterParams.start_year ? "col bg-th-filtered year-width" : "col year-width"
                        }
                    >
                        <div
                            className={this.state.showDropDown === "year" ? "dropdown-container dropdown-open" : "dropdown-container"}
                            onClick={e => {
                                e.preventDefault();
                                this.setState({
                                    showDropDown: showDropDown === "year" ? "" : "year"
                                });
                            }}
                        >
                            <div
                                className="dropdown-toggle click-dropdown yer"
                                data-delay-show="500"
                                data-tip={`Select Master Dashboard Filters `}
                                data-effect="solid"
                                data-for="dashboard-icons"
                                data-place="left"
                                data-background-color="#007bff"
                            >
                                Years
                                <span className="close-reg">
                                    <i className="fas fa-chevron-down"></i>
                                </span>
                            </div>

                            <div className={this.state.showDropDown === "year" ? "dropdown-menu year-drop  dropdown-active" : "dropdown-menu "}>
                                <div
                                    className="drop-filtr pb-3"
                                    onClick={e => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <div className="col-md-12 p-0 slt-ara">
                                        <div className="year-outer ">
                                            <div className="col-xl-12 selecbox-otr p-0 mb-4">
                                                <span className="dropdown-item p-0">
                                                    <label>Start Year</label>
                                                    <div className="custom-selecbox w-100">
                                                        <select
                                                            value={this.state.year.start}
                                                            name={"start"}
                                                            onChange={e => {
                                                                e.stopPropagation();
                                                                this.setState({
                                                                    flag: true,
                                                                    year: {
                                                                        ...this.state.year,
                                                                        start: parseInt(e.target.value)
                                                                    },
                                                                    showDropDown: "year"
                                                                });
                                                            }}
                                                        >
                                                            {yearValues &&
                                                                yearValues.length &&
                                                                yearValues.map(year => {
                                                                    return <option value={year}>{year}</option>;
                                                                })}
                                                        </select>
                                                    </div>
                                                </span>
                                            </div>
                                            <div className="col-xl-12 p-0 selecbox-otr p-0">
                                                <span className="dropdown-item  p-0">
                                                    <label>End Year</label>
                                                    <div className="custom-selecbox w-100">
                                                        <select
                                                            value={this.state.year.end}
                                                            name={"end"}
                                                            onChange={e => {
                                                                e.stopPropagation();
                                                                this.setState({
                                                                    flag: true,
                                                                    year: {
                                                                        ...this.state.year,
                                                                        end: parseInt(e.target.value)
                                                                    },
                                                                    showDropDown: "year"
                                                                });
                                                            }}
                                                        >
                                                            {yearValues &&
                                                                yearValues.length &&
                                                                yearValues.map(year => {
                                                                    return <option value={year}>{year}</option>;
                                                                })}{" "}
                                                        </select>
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12 p-0  pt-1">
                                        <span className="dropdown-item">
                                            <label className="container-check">
                                                Static FCI
                                                <input
                                                    type="checkbox"
                                                    checked={this.state.updateFCI}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            this.setState({
                                                                flag: true,
                                                                updateFCI: true
                                                            });
                                                        } else {
                                                            this.setState({
                                                                flag: true,
                                                                updateFCI: false
                                                            });
                                                        }
                                                    }}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        </span>
                                    </div>

                                    <div className="col-md-12 mt-3 drp-btn">
                                        <button
                                            type="button"
                                            className="btn btn-primary btnRgion mr-2"
                                            onClick={() => {
                                                this.setState({
                                                    showDropDown: ""
                                                });
                                                if (this.state.flag) {
                                                    this.props.handleFilter("year", this.state.year, this.state.year, "Years", this.state.updateFCI);
                                                }
                                            }}
                                        >
                                            OK
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary btnClr"
                                            onClick={() =>
                                                this.setState({
                                                    showDropDown: ""
                                                })
                                            }
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={this.isMoreHighlighted() ? "col bg-th-filtered" : "col"}>
                        <div
                            className={"dropdown-container"}
                            onClick={() => {
                                this.setState({
                                    showMore: !showMore
                                });
                            }}
                        >
                            <div
                                className="dropdown-toggle click-dropdown"
                                data-delay-show="500"
                                data-tip={`Open More Filters`}
                                data-effect="solid"
                                data-for="dashboard-icons"
                                data-place="left"
                                data-background-color="#007bff"
                            >
                                <img src="/img/recom-blue-icon.svg" alt="" />
                                More
                                <span className="close-reg">
                                    <i className={`fas ${showMore ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="view ">
                            <ReactTooltip id="dashboard-icons-right" place="left" className="rc-tooltip-custom-class" />
                            <div className="view">
                                <div
                                    className="view-inner help-icon"
                                    data-tip={`Help`}
                                    data-for="dashboard-icons-right"
                                    data-effect="solid"
                                    data-place="left"
                                    data-background-color="#007bff"
                                    onClick={() => {
                                        this.showHelperModal("menu", "dashboard");
                                    }}
                                >
                                    <img src="/img/question-mark-icon.png" alt="" className="fil-ico" />
                                </div>
                            </div>
                            <div className="view">
                                <div
                                    className="view-inner"
                                    data-tip={`Reset Filters`}
                                    data-effect="solid"
                                    data-for="dashboard-icons-right"
                                    data-place="left"
                                    data-background-color="#007bff"
                                    onClick={() => {
                                        this.setState({
                                            showDropDown: ""
                                        });
                                        this.clearFilter();
                                    }}
                                >
                                    <img src="/img/filter-off.svg" alt="" className="fil-ico" />
                                </div>
                            </div>
                            <div className="view">
                                <div
                                    className="view-inner"
                                    data-place="left"
                                    data-effect="solid"
                                    data-for="dashboard-icons-right"
                                    data-tip={`Reset Dashboard`}
                                    data-background-color="#007bff"
                                    onClick={() => {
                                        this.setState({
                                            showDropDown: ""
                                        });
                                        this.resetDashboard();
                                    }}
                                >
                                    <img src="/img/refresh-dsh.svg" alt="" className="fil-ico" />
                                </div>
                            </div>
                            <div className="view">
                                <div
                                    className="view-inner"
                                    data-place="left"
                                    data-effect="solid"
                                    data-tip={isFullView ? `View FullScreen` : ` Back To Normal View`}
                                    data-for="dashboard-icons-right"
                                    data-background-color="#007bff"
                                    onClick={() => {
                                        this.setState({
                                            showDropDown: ""
                                        });

                                        this.toggleFullscreen();
                                    }}
                                >
                                    <img src="/img/restore_icon.svg" alt="" className="fil-ico" />
                                </div>
                            </div>
                            <div className="view">
                                <div className="view-inner lgout">
                                    <div
                                        className="nav-item dropdown profileImg profileImgdsh"
                                        onClick={() =>
                                            this.setState({
                                                showSettingsDropDown: !this.state.showSettingsDropDown
                                            })
                                        }
                                    >
                                        <div
                                            class="nav-link dropdown-toggle"
                                            data-place="left"
                                            data-effect="solid"
                                            data-for="dashboard-icons-right"
                                            data-tip={`${userName} - Profile Settings`}
                                            data-background-color="#007bff"
                                        >
                                            <img src={profileIcon} alt="" class="fil-ico menu-ico" />
                                        </div>

                                        {this.state.showSettingsDropDown && (
                                            <ProfilePopup
                                                viewUser={this.viewUser}
                                                handleLogout={this.logoutUserConfirm}
                                                handleResetPassword={this.handleResetPassword}
                                                className="logout"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {showMore && (
                    <div className="d-flex itm-nmb brdt-top flex-auto flex-wrap">
                        <ReactTooltip id="dashboard-icons" place="left" className="rc-tooltip-custom-class" />

                        {MASTER_FILTERS?.filter(elem => elem.isMore)?.map(elem => (
                            <FilterItem
                                elem={elem}
                                dashboardFilterParams={dashboardFilterParams}
                                state={this.state}
                                setState={this.setMyState}
                                handleFilter={this.props.handleFilter}
                                showDropDown={showDropDown}
                                handleFilterView={this.handleFilterView}
                                dropdownValues={dropdownValues}
                            />
                        ))}
                        <div className={"col"}></div>
                    </div>
                )}
                {this.renderUploadHelperModal()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { dashboardReducer, loginReducer } = state;
    return {
        dashboardReducer,
        loginReducer
    };
};
let { getMasterFilter } = dashboardAction;
let { resetPasswordProfile } = userAction;
export default withRouter(
    connect(mapStateToProps, {
        getMasterFilter,
        resetPasswordProfile
    })(TopFilter)
);
