import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import ReactTooltip from "react-tooltip";
import { resetBreadCrumpData } from "../../../config/utils";
import userAction from "../../user/actions";
import Portal from "../../common/components/Portal";
import ForgotModal from "../../common/components/forgotPasswordModal";
import history from "../../../config/history";
import ShowHelperModal from "../../helper/components/ShowHelperModal";
import { unSubscribeDevice } from "../../../config/firebase";
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
        building_types: [],
        color_scale: [],
        color_scale_names: [],
        building_types_names: [],
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
        selectedHelperItem: {}
    };

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

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
        if (prevProps.getDashboard != this.props.getDashboard) {
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
        if (prevProps.filterNames != this.props.filterNames) {
            if (this.props.filterNames && this.props.filterNames.length) {
                this.setState({
                    consultrancy_id_names: this.props.filterNames.find(fn => fn.name == "Consultancy")
                        ? this.props.filterNames.find(fn => fn.name == "Consultancy").value
                        : [],
                    client_names: this.props.filterNames.find(fn => fn.name == "Clients")
                        ? this.props.filterNames.find(fn => fn.name == "Clients").value
                        : [],
                    project_names: this.props.filterNames.find(fn => fn.name == "FCA Projects")
                        ? this.props.filterNames.find(fn => fn.name == "FCA Projects").value
                        : [],
                    site_names: this.props.filterNames.find(fn => fn.name == "Sites")
                        ? this.props.filterNames.find(fn => fn.name == "Sites").value
                        : [],
                    region_names: this.props.filterNames.find(fn => fn.name == "Regions")
                        ? this.props.filterNames.find(fn => fn.name == "Regions").value
                        : [],
                    building_names: this.props.filterNames.find(fn => fn.name == "Buildings")
                        ? this.props.filterNames.find(fn => fn.name == "Buildings").value
                        : [],
                    color_scale_names: this.props.filterNames.find(fn => fn.name == "FCI")
                        ? this.props.filterNames.find(fn => fn.name == "FCI").value
                        : [],
                    building_types_names: this.props.filterNames.find(fn => fn.name == "Building Types")
                        ? this.props.filterNames.find(fn => fn.name == "Building Types").value
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
                    site_names: [],
                    region_ids: [],
                    region_names: [],
                    building_ids: [],
                    building_names: [],
                    building_types: [],
                    color_scale: [],
                    color_scale_names: [],
                    building_types_names: []
                });
            }
        }
        if (prevProps.dashboardFilterParams != this.props.dashboardFilterParams) {
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
                color_scale: this.props.dashboardFilterParams.fci_color || [],
                building_types: this.props.dashboardFilterParams.building_types || [],
                year: {
                    start: this.props.dashboardFilterParams.start_year || (graphData && graphData.start),
                    end: this.props.dashboardFilterParams.end_year || (graphData && graphData.end)
                }
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
            color_scale: [],
            color_scale_names: [],
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
            building_types: [],
            color_scale: [],
            color_scale_names: [],
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
        } else {
            element.requestFullScreen();
        }
        isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();
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
        resetBreadCrumpData({
            key: "main",
            name: "User",
            path: `/user/userinfo/${userId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }`
        });
        history.push(
            `/user/userinfo/${userId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }`
        );

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
            history,
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

    render() {
        const {
            showDropDown,
            consultrancy_ids,
            client_names,
            consultrancy_id_names,
            client_ids,
            project_ids,
            project_names,
            site_ids,
            site_names,
            region_ids,
            region_names,
            building_names,
            building_ids,
            building_types_names,
            color_scale,
            color_scale_names,
            yearValues,
            totalCsp,
            building_types
        } = this.state;
        const {
            getAllConsultanciesDropdownResponse = [],
            getDashboard,
            getClientFilter,
            getProjectFilter,
            getSiteFilter,
            getBuildingTypeFilter,
            getBuildingFilter,
            dashboardFilterParams,
            getFilterColors,
            getRegionFilter
        } = this.props;
        let graphData = getDashboard && getDashboard.chart;
        let labelValues = graphData && graphData.length ? graphData.map(gd => gd.data) : [];
        let mergedArray = [].concat.apply([], labelValues);
        let sumOfAllValues = mergedArray.reduce((total, obj) => obj.amount + total, 0);
        let role = localStorage.getItem("role");

        return (
            <div className="dtl-sec dshb mt-2">
                <div className="row mb-1">
                    <div className="col-md-12" id={"top-fltr"} ref={this.setWrapperRef}>
                        {this.renderPasswordModal()}
                        <div className="d-flex itm-nmb">
                            <div
                                className={
                                    dashboardFilterParams?.region_ids && dashboardFilterParams?.region_ids.length
                                        ? "col bg-th-filtered p-1"
                                        : "col p-1"
                                }
                            >
                                <div
                                    className={this.state.showDropDown == "regions" ? "dropdown-container dropdown-open" : "dropdown-container"}
                                    onClick={async () => {
                                        showDropDown != "regions" && (await this.props.handleFilterView("region"));
                                        await this.setState({
                                            showDropDown: showDropDown == "regions" ? "" : "regions"
                                        });
                                    }}
                                >
                                    <div className="dropdown-toggle click-dropdown">
                                        Regions
                                        <span className="close-reg">
                                            <i className="fas fa-chevron-down"></i>
                                        </span>
                                    </div>

                                    <div className={this.state.showDropDown == "regions" ? "dropdown-menu  dropdown-active" : "dropdown-menu "}>
                                        {/* <div className="col-md-12 p-0 slt-ara slt"><span className="dropdown-item"><label className="container-check">Select all<input type="checkbox" /><span className="checkmark"></span></label></span></div> */}

                                        {getRegionFilter && getRegionFilter.regions && getRegionFilter.regions.length ? (
                                            <>
                                                {" "}
                                                <div
                                                    className="drop-filtr"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <div className="col-md-12 p-0 border-bottom pt-1">
                                                        <span className="dropdown-item">
                                                            <label className="container-check">
                                                                Select all
                                                                <input
                                                                    type="checkbox"
                                                                    checked={getRegionFilter.regions.length == region_ids.length ? true : false}
                                                                    onChange={e => {
                                                                        let temp = [];
                                                                        let tempName = [];
                                                                        if (e.target.checked) {
                                                                            getRegionFilter.regions.map(item => {
                                                                                temp.push(item.id);
                                                                                tempName.push(item.name);
                                                                            });
                                                                            this.setState({
                                                                                region_flag: true,
                                                                                region_ids: temp,
                                                                                region_names: tempName
                                                                            });
                                                                        } else {
                                                                            this.setState({
                                                                                region_flag: this.state.region_ids.length > 0 ? true : false,
                                                                                region_ids: [],
                                                                                region_names: []
                                                                            });
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="checkmark"></span>
                                                            </label>
                                                        </span>
                                                    </div>
                                                    <div className="col-md-12 p-0 slt-ara">
                                                        {getRegionFilter.regions.map(item => (
                                                            <span className="dropdown-item">
                                                                <label className="container-check">
                                                                    {item.name} ({item.count})
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={this.state.region_ids.find(ci => ci == item.id) ? true : false}
                                                                        onChange={e => {
                                                                            if (e.target.checked) {
                                                                                this.setState({
                                                                                    region_flag: true,
                                                                                    region_ids: [...this.state.region_ids, item.id],
                                                                                    region_names: [...region_names, item.name]
                                                                                });
                                                                            } else {
                                                                                let test = this.state.region_ids;
                                                                                test = test.filter(t => t !== item.id);
                                                                                let name = this.state.region_names;
                                                                                name = name.filter(t => t !== item.name);
                                                                                this.setState({
                                                                                    region_flag: this.state.region_ids.length > 0 ? true : false,
                                                                                    region_ids: test,
                                                                                    region_names: name
                                                                                });
                                                                            }
                                                                        }}
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="col-md-12 mt-3 drp-btn">
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btnRgion"
                                                            onClick={() => {
                                                                this.setState({
                                                                    showDropDown: ""
                                                                });
                                                                if (this.state.region_flag) {
                                                                    this.props.handleFilter("region_ids", region_ids, region_names, "Regions");
                                                                    this.setState({
                                                                        region_flag: false
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            Update Chart
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="col-md-12 p-2"> No Data Found</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div
                                className={
                                    dashboardFilterParams?.site_ids && dashboardFilterParams?.site_ids.length ? "col bg-th-filtered p-1" : "col p-1"
                                }
                            >
                                <div
                                    className={this.state.showDropDown == "site" ? "dropdown-container dropdown-open" : "dropdown-container"}
                                    onClick={async () => {
                                        showDropDown != "site" && (await this.props.handleFilterView("site"));
                                        await this.setState({
                                            showDropDown: showDropDown == "site" ? "" : "site"
                                        });
                                    }}
                                >
                                    <div className="dropdown-toggle click-dropdown">
                                        Sites
                                        <span className="close-reg">
                                            <i className="fas fa-chevron-down"></i>
                                        </span>
                                    </div>

                                    <div className={this.state.showDropDown == "site" ? "dropdown-menu  dropdown-active" : "dropdown-menu "}>
                                        {/* <div className="col-md-12 p-0 slt-ara slt"><span className="dropdown-item"><label className="container-check">Select all<input type="checkbox" /><span className="checkmark"></span></label></span></div> */}

                                        {getSiteFilter && getSiteFilter.sites && getSiteFilter.sites.length ? (
                                            <>
                                                <div
                                                    className="drop-filtr"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <div className="col-md-12 p-0 border-bottom pt-1">
                                                        <span className="dropdown-item">
                                                            <label className="container-check">
                                                                Select all
                                                                <input
                                                                    type="checkbox"
                                                                    checked={getSiteFilter.sites.length == site_ids.length ? true : false}
                                                                    onChange={e => {
                                                                        let temp = [];
                                                                        let tempName = [];
                                                                        if (e.target.checked) {
                                                                            getSiteFilter.sites.map(item => {
                                                                                temp.push(item.id);
                                                                                tempName.push(item.name);
                                                                            });
                                                                            this.setState({
                                                                                site_flag: true,
                                                                                site_ids: temp,
                                                                                site_names: tempName
                                                                            });
                                                                        } else {
                                                                            this.setState({
                                                                                site_flag: this.state.site_ids.length > 0 ? true : false,
                                                                                site_ids: [],
                                                                                site_names: []
                                                                            });
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="checkmark"></span>
                                                            </label>
                                                        </span>
                                                    </div>
                                                    <div className="col-md-12 p-0 slt-ara">
                                                        {getSiteFilter.sites.map(item => (
                                                            <span className="dropdown-item">
                                                                <label className="container-check">
                                                                    {item.name} ({item.count})
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={this.state.site_ids.find(ci => ci == item.id) ? true : false}
                                                                        onChange={e => {
                                                                            if (e.target.checked) {
                                                                                this.setState({
                                                                                    site_flag: true,
                                                                                    site_ids: [...this.state.site_ids, item.id],
                                                                                    site_names: [...site_names, item.name]
                                                                                });
                                                                            } else {
                                                                                let test = this.state.site_ids;
                                                                                test = test.filter(t => t !== item.id);
                                                                                let name = this.state.site_names;
                                                                                name = name.filter(t => t !== item.name);
                                                                                this.setState({
                                                                                    site_flag: this.state.site_ids.length > 0 ? true : false,
                                                                                    site_ids: test,
                                                                                    site_names: name
                                                                                });
                                                                            }
                                                                        }}
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="col-md-12 mt-3 drp-btn">
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btnRgion"
                                                            onClick={() => {
                                                                this.setState({
                                                                    showDropDown: ""
                                                                });
                                                                if (this.state.site_flag) {
                                                                    this.props.handleFilter("site_ids", site_ids, site_names, "Sites");
                                                                    this.setState({
                                                                        site_flag: false
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            Update Chart
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="col-md-12 p-2"> No Data Found</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div
                                className={
                                    dashboardFilterParams?.building_types && dashboardFilterParams?.building_types.length
                                        ? "col bg-th-filtered p-1"
                                        : "col p-1"
                                }
                            >
                                <div
                                    className={this.state.showDropDown == "buildingType" ? "dropdown-container dropdown-open" : "dropdown-container"}
                                    onClick={async () => {
                                        showDropDown != "buildingType" && (await this.props.handleFilterView("buildingType"));
                                        await this.setState({
                                            showDropDown: showDropDown == "buildingType" ? "" : "buildingType"
                                        });
                                    }}
                                >
                                    <div className="dropdown-toggle click-dropdown bld">
                                        B.Types
                                        <span className="close-reg">
                                            <i className="fas fa-chevron-down"></i>
                                        </span>
                                    </div>

                                    <div className={this.state.showDropDown == "buildingType" ? "dropdown-menu  dropdown-active" : "dropdown-menu "}>
                                        {/* <div className="col-md-12 p-0 slt-ara slt"><span className="dropdown-item"><label className="container-check">Select all<input type="checkbox" /><span className="checkmark"></span></label></span></div> */}

                                        {getBuildingTypeFilter &&
                                        getBuildingTypeFilter.building_types &&
                                        getBuildingTypeFilter.building_types.length ? (
                                            <>
                                                {" "}
                                                <div
                                                    className="drop-filtr"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <div className="col-md-12 p-0 border-bottom pt-1">
                                                        <span className="dropdown-item">
                                                            <label className="container-check">
                                                                Select all
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        getBuildingTypeFilter.building_types.length == building_types.length
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    onChange={e => {
                                                                        let temp = [];
                                                                        let tempName = [];
                                                                        if (e.target.checked) {
                                                                            getBuildingTypeFilter.building_types.map(item => {
                                                                                temp.push(item);
                                                                                tempName.push(item);
                                                                            });
                                                                            this.setState({
                                                                                btype_flag: true,
                                                                                building_types: temp,
                                                                                building_types_names: tempName
                                                                            });
                                                                        } else {
                                                                            this.setState({
                                                                                btype_flag: this.state.building_types.length > 0 ? true : false,
                                                                                building_types: [],
                                                                                building_types_names: []
                                                                            });
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="checkmark"></span>
                                                            </label>
                                                        </span>
                                                    </div>
                                                    <div className="col-md-12 p-0 slt-ara">
                                                        {getBuildingTypeFilter.building_types.map(item => (
                                                            <span className="dropdown-item">
                                                                <label className="container-check">
                                                                    {item} ({item.count})
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={this.state.building_types.find(ci => ci == item) ? true : false}
                                                                        onChange={e => {
                                                                            if (e.target.checked) {
                                                                                this.setState({
                                                                                    btype_flag: true,
                                                                                    building_types: [...this.state.building_types, item],
                                                                                    building_types_names: [...building_types_names, item]
                                                                                });
                                                                            } else {
                                                                                let test = this.state.building_types;
                                                                                test = test.filter(t => t !== item);
                                                                                let name = this.state.building_types_names;
                                                                                name = name.filter(t => t !== item);
                                                                                this.setState({
                                                                                    btype_flag: this.state.building_types.length > 0 ? true : false,
                                                                                    building_types: test,
                                                                                    building_types_names: name
                                                                                });
                                                                            }
                                                                        }}
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="col-md-12 mt-3 drp-btn">
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btnRgion"
                                                            onClick={() => {
                                                                this.setState({
                                                                    showDropDown: ""
                                                                });
                                                                if (this.state.btype_flag) {
                                                                    this.props.handleFilter(
                                                                        "building_types",
                                                                        building_types,
                                                                        building_types_names,
                                                                        "Building Types"
                                                                    );
                                                                    this.setState({
                                                                        btype_flag: false
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            Update Chart
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="col-md-12 p-2"> No Data Found</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div
                                className={
                                    dashboardFilterParams?.building_ids && dashboardFilterParams?.building_ids.length
                                        ? "col bg-th-filtered p-1"
                                        : "col p-1"
                                }
                            >
                                <div
                                    className={this.state.showDropDown == "building" ? "dropdown-container dropdown-open" : "dropdown-container"}
                                    onClick={async () => {
                                        showDropDown != "building" && (await this.props.handleFilterView("building"));
                                        await this.setState({
                                            showDropDown: showDropDown == "building" ? "" : "building"
                                        });
                                    }}
                                >
                                    <div className="dropdown-toggle click-dropdown">
                                        Buildings
                                        <span className="close-reg">
                                            <i className="fas fa-chevron-down"></i>
                                        </span>
                                    </div>

                                    <div className={this.state.showDropDown == "building" ? "dropdown-menu  dropdown-active" : "dropdown-menu "}>
                                        {/* <div className="col-md-12 p-0 slt-ara slt"><span className="dropdown-item"><label className="container-check">Select all<input type="checkbox" /><span className="checkmark"></span></label></span></div> */}
                                        {getBuildingFilter && getBuildingFilter.buildings && getBuildingFilter.buildings.length ? (
                                            <>
                                                <div
                                                    className="drop-filtr"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <div className="col-md-12 p-0 border-bottom pt-1">
                                                        <span className="dropdown-item">
                                                            <label className="container-check">
                                                                Select all
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        getBuildingFilter &&
                                                                        getBuildingFilter.buildings &&
                                                                        getBuildingFilter.buildings.length == building_ids.length
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    onChange={e => {
                                                                        let temp = [];
                                                                        let tempName = [];
                                                                        if (e.target.checked) {
                                                                            getBuildingFilter.buildings.map(item => {
                                                                                temp.push(item.id);
                                                                                tempName.push(item.name);
                                                                            });
                                                                            this.setState({
                                                                                building_flag: true,
                                                                                building_ids: temp,
                                                                                building_names: tempName
                                                                            });
                                                                        } else {
                                                                            this.setState({
                                                                                building_flag: this.state.building_ids.length > 0 ? true : false,
                                                                                building_ids: [],
                                                                                building_names: []
                                                                            });
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="checkmark"></span>
                                                            </label>
                                                        </span>
                                                    </div>
                                                    <div className="col-md-12 p-0 slt-ara">
                                                        {getBuildingFilter.buildings.map(item => (
                                                            <span className="dropdown-item">
                                                                <label className="container-check">
                                                                    {item.name} ({item.count})
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={this.state.building_ids.find(ci => ci == item.id) ? true : false}
                                                                        onChange={e => {
                                                                            if (e.target.checked) {
                                                                                this.setState({
                                                                                    building_flag: true,
                                                                                    building_ids: [...this.state.building_ids, item.id],
                                                                                    building_names: [...building_names, item.name]
                                                                                });
                                                                            } else {
                                                                                let test = this.state.building_ids;
                                                                                test = test.filter(t => t !== item.id);
                                                                                let name = this.state.building_names;
                                                                                name = name.filter(t => t !== item.name);
                                                                                this.setState({
                                                                                    building_flag: this.state.building_ids.length > 0 ? true : false,
                                                                                    building_ids: test,
                                                                                    building_names: name
                                                                                });
                                                                            }
                                                                        }}
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="col-md-12 mt-3 drp-btn">
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btnRgion"
                                                            onClick={() => {
                                                                this.setState({
                                                                    showDropDown: ""
                                                                });
                                                                if (this.state.building_flag) {
                                                                    this.props.handleFilter(
                                                                        "building_ids",
                                                                        building_ids,
                                                                        building_names,
                                                                        "Buildings"
                                                                    );
                                                                    this.setState({
                                                                        building_flag: false
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            Update Chart
                                                        </button>
                                                    </div>
                                                </div>{" "}
                                            </>
                                        ) : (
                                            <div className="col-md-12 p-2"> No Data Found</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div
                                className={
                                    dashboardFilterParams?.building_ids && dashboardFilterParams?.building_ids.length
                                        ? "col bg-th-filtered d-flex p-1"
                                        : "col d-flex p-1"
                                }
                            >
                                <div class="col-xl-6 p-0 selecbox-otr d-flex align-items-center">
                                    <label>Start Year</label>
                                    <div class="custom-selecbox">
                                        <select name="startYear">
                                            <option value="2023">2023</option>
                                            <option value="2024">2024</option>
                                            <option value="2025">2025</option>
                                            <option value="2026">2026</option>
                                            <option value="2027">2027</option>
                                            <option value="2028">2028</option>
                                            <option value="2029">2029</option>
                                            <option value="2030">2030</option>
                                            <option value="2031">2031</option>
                                            <option value="2032">2032</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-xl-6 p-0 selecbox-otr d-flex align-items-center">
                                    <label>End Year</label>
                                    <div class="custom-selecbox">
                                        <select name="endYear">
                                            <option value="2023">2023</option>
                                            <option value="2024">2024</option>
                                            <option value="2025">2025</option>
                                            <option value="2026">2026</option>
                                            <option value="2027">2027</option>
                                            <option value="2028">2028</option>
                                            <option value="2029">2029</option>
                                            <option value="2030">2030</option>
                                            <option value="2031">2031</option>
                                            <option value="2032">2032</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="view p-1 mx-2 my-auto">
                                <div
                                    className="view-inner"
                                    data-tip={`Reset Filters`}
                                    data-effect="solid"
                                    data-for="dashboard-icons"
                                    data-place="bottom"
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
                        </div>
                        {this.renderUploadHelperModal()}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { loginReducer } = state;
    return {
        state,
        loginReducer
    };
};
export default withRouter(connect(mapStateToProps, { ...userAction })(TopFilter));
