import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import ReactTooltip from "react-tooltip";
import { resetBreadCrumpData } from "../../../config/utils";
import energyChartActions from "../actions";
import Portal from "../../common/components/Portal";
import ForgotModal from "../../common/components/forgotPasswordModal";
import history from "../../../config/history";
import ShowHelperModal from "../../helper/components/ShowHelperModal";
import FilterValue from "./filterValues";
import { forEach } from "lodash";
import { unSubscribeDevice } from "../../../config/firebase";

class TopFilter extends Component {
    constructor(props) {
        super(props);

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    state = {
        site_ids: [],
        site_names: [],
        region_ids: [],
        region_names: [],
        building_ids: [],
        building_names: [],
        building_types: [],
        year_ids: [],
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
        year_flag: false,
        fci_flag: false,
        flag: false,
        showResetPasswordModal: false,
        showHelperModal: false,
        selectedHelperItem: {},
        dashboardFilterParams: {},
        showDropDown: "",
        getRegionFilter: {},
        getSiteFilter: {},
        getBuildingTypeFilter: {},
        getBuildingFilter: {},
        viewFilterModal: false,
        section: "",
        search: ""
    };

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);

        const {
            match: {
                params: { section }
            }
        } = this.props;
        this.setState({ section: section });
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

    componentDidUpdate = async (prevProps, prevState) => {};

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
            year_ids: [],
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
            year_flag: false,
            fci_flag: false,
            getRegionFilter: {},
            getSiteFilter: {},
            getBuildingTypeFilter: {},
            getBuildingFilter: {},
            getYearFilter: {
                years: ["2010", "2012", "2015"]
            }
        });
        await this.props.clearAllFilter();
    };

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

    handleFilterView = async name => {
        if (name === "region") {
            await this.fetchRegionData();
        } else if (name == "site") {
            await this.fetchSiteData();
        } else if (name == "buildingType") {
            await this.fetchBuildingTypeData();
        } else if (name == "building") {
            await this.fetchBuildingData();
        } else if (name == "years") {
            // await this.fetchYearData();
            this.setState({
                getYearFilter: {
                    years: this.props.years
                }
            });
        }
    };

    paramFetcher = () => {
        const {
            match: {
                params: { id, section }
            }
        } = this.props;

        let client_id = localStorage.getItem("energyclientID");

        const subParams = {};
        switch (section) {
            case "energyinfo":
                subParams.client_id = client_id;
                break;
            case "regioninfo":
                subParams.region_id = id;
                subParams.client_id = client_id;
                break;
            case "siteinfo":
                subParams.site_id = id;
                subParams.client_id = client_id;
                break;
            case "buildinginfo":
                subParams.building_id = id;
                subParams.client_id = client_id;
                break;

            default:
                break;
        }

        return subParams;
    };

    fetchRegionData = async () => {
        let param = this.paramFetcher();
        const { dashboardFilterParams } = this.state;
        await this.props.getRegionFilter({ ...dashboardFilterParams, ...param });
        let { getRegionFilter } = this.props?.chartEnergyReducer || {};
        this.setState({
            getRegionFilter
        });
    };

    fetchSiteData = async () => {
        let param = this.paramFetcher();
        const { dashboardFilterParams, region_ids } = this.state;
        await this.props.getSiteFilter({ ...dashboardFilterParams, ...param, region_ids: region_ids?.length ? region_ids : [] });
        let { getSiteFilter } = this.props?.chartEnergyReducer || {};
        this.setState({
            getSiteFilter
        });
    };

    fetchBuildingTypeData = async () => {
        let param = this.paramFetcher();
        const { dashboardFilterParams, building_ids } = this.state;
        await this.props.getBuildingTypeFilter({ ...dashboardFilterParams, ...param, building_ids: building_ids?.length ? building_ids : [] });
        let { getBuildingTypeFilter } = this.props?.chartEnergyReducer || {};
        this.setState({
            getBuildingTypeFilter
        });
    };

    fetchBuildingData = async () => {
        let param = this.paramFetcher();
        const { dashboardFilterParams, site_ids } = this.state;
        await this.props.getBuildingFilter({ ...dashboardFilterParams, ...param, site_ids: site_ids?.length ? site_ids : [] });
        let { getBuildingFilter } = this.props?.chartEnergyReducer || {};
        this.setState({
            getBuildingFilter
        });
    };

    fetchYearData = async () => {
        let param = this.paramFetcher();
        const { dashboardFilterParams } = this.state;
        await this.props.getYearFilter({ ...dashboardFilterParams, ...param });
        let { getYearFilter } = this.props?.chartEnergyReducer || {};

        // this.setState({
        //     getBuildingFilter
        // });
    };

    setFilterModal = () => {
        this.setState({
            viewFilterModal: true
        });
    };

    checkFilter = obj => {
        let allEmpty = Object.keys(obj).every(function (key) {
            return obj[key].length === 0;
        });
        return !allEmpty;
    };

    checkFilterCount = obj => {
        let count = 0;
        Object.keys(obj).forEach(item => {
            if (obj[item].length) {
                count = count + 1;
            }
        });
        return count;
    };

    render() {
        const {
            site_ids,
            site_names,
            region_ids,
            region_names,
            building_names,
            building_ids,
            year_ids,
            building_types_names,
            building_types,
            getSiteFilter,
            getBuildingTypeFilter,
            getBuildingFilter,
            getRegionFilter,
            getYearFilter,
            showDropDown,
            viewFilterModal,
            section
        } = this.state;
        const { filterStat, filterNames } = this.props;

        return (
            <>
                {viewFilterModal ? (
                    <Portal
                        body={
                            <FilterValue
                                onCancel={() => this.setState({ viewFilterModal: false })}
                                filterValues={filterStat}
                                filterNames={filterNames}
                            />
                        }
                        onCancel={() => this.setState({ showViewModal: false })}
                    />
                ) : null}
                <div className="dtl-sec dshb mt-2 custom-topfilter">
                    <div className="row mb-1">
                        <div className="col-md-12 custom-topfilter-col" id={"top-fltr"} ref={this.setWrapperRef}>
                            {this.renderPasswordModal()}
                            <div className="d-flex itm-nmb">
                                {section !== "buildinginfo" && section !== "siteinfo" && section !== "regioninfo" && (
                                    <div className={filterStat?.region_ids && filterStat?.region_ids.length ? "col bg-th-filtered" : "col"}>
                                        <div
                                            className={
                                                this.state.showDropDown == "regions" ? "dropdown-container dropdown-open" : "dropdown-container"
                                            }
                                            onClick={async () => {
                                                showDropDown != "regions" && (await this.handleFilterView("region"));
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

                                            <div
                                                className={this.state.showDropDown == "regions" ? "dropdown-menu  dropdown-active" : "dropdown-menu "}
                                            >
                                                {/* <div className="col-md-12 p-0 slt-ara slt"><span className="dropdown-item"><label className="container-check">Select all<input type="checkbox" /><span className="checkmark"></span></label></span></div> */}

                                                {getRegionFilter && getRegionFilter.regions && getRegionFilter.regions.length ? (
                                                    <>
                                                        {" "}
                                                        <div
                                                            className="dropdown-menu drop-filtr pos-abs dp-rcm-overflow mt-0"
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                            }}
                                                        >
                                                            <div className="col-md-12 p-0">
                                                                <span className="dropdown-item build_search_drp">
                                                                    <input
                                                                        type="search"
                                                                        placeholder="Search..."
                                                                        value={this.state.search}
                                                                        onChange={e =>
                                                                            this.setState({
                                                                                search: e.target.value
                                                                            })
                                                                        }
                                                                    />
                                                                    <i
                                                                        class="fas fa-times cursor-pointer cls-close"
                                                                        onClick={() => this.setState({ search: "" })}
                                                                    />
                                                                    {/* <div className="col-md-12 p-0 border-bottom pt-1">
                                                                        <span className="dropdown-item"> */}
                                                                    <label className="container-check">
                                                                        Select all (
                                                                        {
                                                                            getRegionFilter.regions
                                                                                .filter(fi => this.state.region_ids?.includes(fi.id))
                                                                                ?.map(item => item).length
                                                                        }
                                                                        )
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={
                                                                                getRegionFilter.regions.length == region_ids.length ? true : false
                                                                            }
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
                                                                        <button
                                                                            className="clear-btn-selection"
                                                                            // class="fas fa-times cursor-pointer cls-close"
                                                                            onClick={() =>
                                                                                this.setState({
                                                                                    region_flag: this.state.region_ids.length > 0 ? true : false,
                                                                                    region_ids: [],
                                                                                    region_names: []
                                                                                })
                                                                            }
                                                                        >
                                                                            Clear
                                                                        </button>
                                                                    </label>
                                                                </span>
                                                            </div>
                                                            <div className="col-md-12 p-0 slt-ara border-bottom">
                                                                {getRegionFilter.regions
                                                                    .filter(fi => this.state.region_ids?.includes(fi.id))
                                                                    .map(item => (
                                                                        <span className="dropdown-item">
                                                                            <label className="container-check">
                                                                                {item.name} ({item.count})
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={
                                                                                        this.state.region_ids.find(ci => ci == item.id) ? true : false
                                                                                    }
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
                                                                                                region_flag:
                                                                                                    this.state.region_ids.length > 0 ? true : false,
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
                                                            <div className="col-md-12 p-0 slt-ara">
                                                                {getRegionFilter.regions
                                                                    .filter(fi => !this.state.region_ids?.includes(fi.id))
                                                                    .filter(item =>
                                                                        item?.name
                                                                            ?.toString()
                                                                            ?.toLowerCase()
                                                                            ?.includes(this.state.search?.toLocaleLowerCase())
                                                                    )
                                                                    ?.map(item => (
                                                                        <span className="dropdown-item">
                                                                            <label className="container-check">
                                                                                {item.name} ({item.count})
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={
                                                                                        this.state.region_ids.find(ci => ci == item.id) ? true : false
                                                                                    }
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
                                                                                                region_flag:
                                                                                                    this.state.region_ids.length > 0 ? true : false,
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

                                                            {!getRegionFilter.regions
                                                                .filter(fi => !this.state.region_ids?.includes(fi.id))
                                                                .filter(item =>
                                                                    item?.name
                                                                        ?.toString()
                                                                        ?.toLowerCase()
                                                                        ?.includes(this.state.search?.toLocaleLowerCase())
                                                                )
                                                                .map(item => item)?.length &&
                                                            !getRegionFilter.regions
                                                                ?.filter(fi => this.state.region_ids?.includes(fi.id))
                                                                .map(item => item).length ? (
                                                                <div className="col-md-6 no-wrap">NO DATA</div>
                                                            ) : (
                                                                getRegionFilter.regions
                                                                    .filter(fi => !this.state.region_ids?.includes(fi.id))
                                                                    .filter(item =>
                                                                        item?.name
                                                                            ?.toString()
                                                                            ?.toLowerCase()
                                                                            ?.includes(this.state.search?.toLocaleLowerCase())
                                                                    )
                                                                    ?.map(item => item).length === 0 && (
                                                                    <div className="col-md-6 no-wrap">NO MORE VALUES TO DISPLAY</div>
                                                                )
                                                            )}
                                                            <div className="col-md-12 mt-3 drp-btn">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary btnRgion mr-2"
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            showDropDown: ""
                                                                        });
                                                                        if (this.state.region_flag) {
                                                                            this.props.handleFilter(
                                                                                "region_ids",
                                                                                region_ids,
                                                                                "regions",
                                                                                region_names
                                                                            );

                                                                            this.setState({
                                                                                region_flag: false
                                                                            });
                                                                        }
                                                                    }}
                                                                >
                                                                    Ok
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary btnClr"
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            showDropDown: "",
                                                                            region_flag: false,
                                                                            region_ids: [],
                                                                            region_names: []
                                                                        });
                                                                        if (filterStat?.region_ids?.length) {
                                                                            this.props.handleFilter("region_ids", [], [], "regions");
                                                                        }
                                                                    }}
                                                                >
                                                                    Cancel
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
                                )}

                                {section !== "buildinginfo" && section !== "siteinfo" && (
                                    <div className={filterStat?.site_ids && filterStat?.site_ids.length ? "col bg-th-filtered" : "col"}>
                                        <div
                                            className={this.state.showDropDown == "site" ? "dropdown-container dropdown-open" : "dropdown-container"}
                                            onClick={async () => {
                                                showDropDown != "site" && (await this.handleFilterView("site"));
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
                                                            className="dropdown-menu drop-filtr pos-abs dp-rcm-overflow mt-0"
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                            }}
                                                        >
                                                            <div className="col-md-12 p-0">
                                                                <span className="dropdown-item build_search_drp">
                                                                    <input
                                                                        type="search"
                                                                        placeholder="Search..."
                                                                        value={this.state.search}
                                                                        onChange={e =>
                                                                            this.setState({
                                                                                search: e.target.value
                                                                            })
                                                                        }
                                                                    />
                                                                    <i
                                                                        class="fas fa-times cursor-pointer cls-close"
                                                                        onClick={() => this.setState({ search: "" })}
                                                                    />

                                                                    <label className="container-check">
                                                                        Select all (
                                                                        {
                                                                            getSiteFilter.sites
                                                                                .filter(fi => this.state.site_ids?.includes(fi.id))
                                                                                ?.map(item => item).length
                                                                        }
                                                                        )
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
                                                                        <button
                                                                            className="clear-btn-selection"
                                                                            // class="fas fa-times cursor-pointer cls-close"
                                                                            onClick={() =>
                                                                                this.setState({
                                                                                    site_flag: this.state.site_ids.length > 0 ? true : false,
                                                                                    site_ids: [],
                                                                                    site_names: []
                                                                                })
                                                                            }
                                                                        >
                                                                            Clear
                                                                        </button>
                                                                    </label>
                                                                </span>
                                                            </div>
                                                            <div className="col-md-12 p-0 slt-ara border-bottom">
                                                                {getSiteFilter.sites
                                                                    .filter(fi => this.state.site_ids?.includes(fi.id))
                                                                    .map(item => (
                                                                        <span className="dropdown-item">
                                                                            <label className="container-check">
                                                                                {item.name} ({item.count})
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={
                                                                                        this.state.site_ids.find(ci => ci == item.id) ? true : false
                                                                                    }
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
                                                                                                site_flag:
                                                                                                    this.state.site_ids.length > 0 ? true : false,
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
                                                            <div className="col-md-12 p-0 slt-ara">
                                                                {getSiteFilter.sites
                                                                    .filter(fi => !this.state.site_ids?.includes(fi.id))
                                                                    .filter(item =>
                                                                        item?.name
                                                                            ?.toString()
                                                                            ?.toLowerCase()
                                                                            ?.includes(this.state.search?.toLocaleLowerCase())
                                                                    )
                                                                    ?.map(item => (
                                                                        <span className="dropdown-item">
                                                                            <label className="container-check">
                                                                                {item.name} ({item.count})
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={
                                                                                        this.state.site_ids.find(ci => ci == item.id) ? true : false
                                                                                    }
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
                                                                                                site_flag:
                                                                                                    this.state.site_ids.length > 0 ? true : false,
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

                                                            {!getSiteFilter.sites
                                                                .filter(fi => !this.state.site_ids?.includes(fi.id))
                                                                .filter(item =>
                                                                    item?.name
                                                                        ?.toString()
                                                                        ?.toLowerCase()
                                                                        ?.includes(this.state.search?.toLocaleLowerCase())
                                                                )
                                                                .map(item => item)?.length &&
                                                            !getSiteFilter.sites?.filter(fi => this.state.site_ids?.includes(fi.id)).map(item => item)
                                                                .length ? (
                                                                <div className="col-md-6 no-wrap">NO DATA</div>
                                                            ) : (
                                                                getSiteFilter.sites
                                                                    .filter(fi => !this.state.site_ids?.includes(fi.id))
                                                                    .filter(item =>
                                                                        item?.name
                                                                            ?.toString()
                                                                            ?.toLowerCase()
                                                                            ?.includes(this.state.search?.toLocaleLowerCase())
                                                                    )
                                                                    ?.map(item => item).length === 0 && (
                                                                    <div className="col-md-6 no-wrap">NO MORE VALUES TO DISPLAY</div>
                                                                )
                                                            )}
                                                            <div className="col-md-12 mt-3 drp-btn">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary btnRgion mr-2"
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            showDropDown: ""
                                                                        });
                                                                        if (this.state.site_flag) {
                                                                            this.props.handleFilter("site_ids", site_ids, "sites", site_names);
                                                                            this.setState({
                                                                                site_flag: false
                                                                            });
                                                                        }
                                                                    }}
                                                                >
                                                                    Ok
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary btnClr"
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            showDropDown: "",
                                                                            site_flag: false,
                                                                            site_ids: [],
                                                                            site_names: []
                                                                        });
                                                                        if (filterStat?.site_ids?.length) {
                                                                            this.props.handleFilter("site_ids", [], [], "sites");
                                                                        }
                                                                    }}
                                                                >
                                                                    Cancel
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
                                )}

                                {
                                    <div className={filterStat?.building_types && filterStat?.building_types.length ? "col bg-th-filtered" : "col"}>
                                        <div
                                            className={
                                                this.state.showDropDown == "buildingType" ? "dropdown-container dropdown-open" : "dropdown-container"
                                            }
                                            onClick={async () => {
                                                showDropDown != "buildingType" && (await this.handleFilterView("buildingType"));
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

                                            <div
                                                className={
                                                    this.state.showDropDown == "buildingType" ? "dropdown-menu  dropdown-active" : "dropdown-menu "
                                                }
                                            >
                                                {/* <div className="col-md-12 p-0 slt-ara slt"><span className="dropdown-item"><label className="container-check">Select all<input type="checkbox" /><span className="checkmark"></span></label></span></div> */}

                                                {getBuildingTypeFilter &&
                                                getBuildingTypeFilter.building_types &&
                                                getBuildingTypeFilter.building_types.length ? (
                                                    <>
                                                        {" "}
                                                        <div
                                                            className="dropdown-menu drop-filtr pos-abs dp-rcm-overflow mt-0"
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                            }}
                                                        >
                                                            <div className="col-md-12 p-0">
                                                                <span className="dropdown-item build_search_drp">
                                                                    <input
                                                                        type="search"
                                                                        placeholder="Search..."
                                                                        value={this.state.search}
                                                                        onChange={e =>
                                                                            this.setState({
                                                                                search: e.target.value
                                                                            })
                                                                        }
                                                                    />
                                                                    <i
                                                                        class="fas fa-times cursor-pointer cls-close"
                                                                        onClick={() => this.setState({ search: "" })}
                                                                    />
                                                                    {/* <div className="col-md-12 p-0 border-bottom pt-1">
                                                                <span className="dropdown-item"> */}
                                                                    <label className="container-check">
                                                                        Select all (
                                                                        {
                                                                            getBuildingTypeFilter.building_types
                                                                                .filter(fi => this.state.building_types?.includes(fi.name))
                                                                                ?.map(item => item).length
                                                                        }
                                                                        )
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
                                                                                        temp.push(item.name);
                                                                                        tempName.push(item.name);
                                                                                    });
                                                                                    this.setState({
                                                                                        btype_flag: true,
                                                                                        building_types: temp,
                                                                                        building_types_names: tempName
                                                                                    });
                                                                                } else {
                                                                                    this.setState({
                                                                                        btype_flag:
                                                                                            this.state.building_types.length > 0 ? true : false,
                                                                                        building_types: [],
                                                                                        building_types_names: []
                                                                                    });
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span className="checkmark"></span>
                                                                        <button
                                                                            className="clear-btn-selection"
                                                                            // class="fas fa-times cursor-pointer cls-close"
                                                                            onClick={() =>
                                                                                this.setState({
                                                                                    btype_flag: this.state.building_types.length > 0 ? true : false,
                                                                                    building_types: [],
                                                                                    building_types_names: []
                                                                                })
                                                                            }
                                                                        >
                                                                            Clear
                                                                        </button>
                                                                    </label>
                                                                </span>
                                                            </div>
                                                            <div className="col-md-12 p-0 slt-ara border-bottom">
                                                                {getBuildingTypeFilter.building_types
                                                                    .filter(fi => this.state.building_types?.includes(fi.name))
                                                                    .map(item => (
                                                                        <span className="dropdown-item">
                                                                            <label className="container-check">
                                                                                {item.name} ({item.count})
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={
                                                                                        this.state.building_types.find(ci => ci == item.name)
                                                                                            ? true
                                                                                            : false
                                                                                    }
                                                                                    onChange={e => {
                                                                                        if (e.target.checked) {
                                                                                            this.setState({
                                                                                                btype_flag: true,
                                                                                                building_types: [
                                                                                                    ...this.state.building_types,
                                                                                                    item.name
                                                                                                ],
                                                                                                building_types_names: [
                                                                                                    ...building_types_names,
                                                                                                    item.name
                                                                                                ]
                                                                                            });
                                                                                        } else {
                                                                                            let test = this.state.building_types;
                                                                                            test = test.filter(t => t !== item.name);
                                                                                            let name = this.state.building_types_names;
                                                                                            name = name.filter(t => t !== item.name);
                                                                                            this.setState({
                                                                                                btype_flag:
                                                                                                    this.state.building_types.length > 0
                                                                                                        ? true
                                                                                                        : false,
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
                                                            <div className="col-md-12 p-0 slt-ara">
                                                                {getBuildingTypeFilter.building_types
                                                                    .filter(fi => !this.state.building_types?.includes(fi.name))
                                                                    .filter(item =>
                                                                        item?.name
                                                                            ?.toString()
                                                                            ?.toLowerCase()
                                                                            ?.includes(this.state.search?.toLocaleLowerCase())
                                                                    )
                                                                    ?.map(item => (
                                                                        <span className="dropdown-item">
                                                                            <label className="container-check">
                                                                                {item.name} ({item.count})
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={
                                                                                        this.state.building_types.find(ci => ci == item.name)
                                                                                            ? true
                                                                                            : false
                                                                                    }
                                                                                    onChange={e => {
                                                                                        if (e.target.checked) {
                                                                                            this.setState({
                                                                                                btype_flag: true,
                                                                                                building_types: [
                                                                                                    ...this.state.building_types,
                                                                                                    item.name
                                                                                                ],
                                                                                                building_types_names: [
                                                                                                    ...building_types_names,
                                                                                                    item.name
                                                                                                ]
                                                                                            });
                                                                                        } else {
                                                                                            let test = this.state.building_types;
                                                                                            test = test.filter(t => t !== item.name);
                                                                                            let name = this.state.building_types_names;
                                                                                            name = name.filter(t => t !== item.name);
                                                                                            this.setState({
                                                                                                btype_flag:
                                                                                                    this.state.building_types.length > 0
                                                                                                        ? true
                                                                                                        : false,
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
                                                            {!getBuildingTypeFilter.building_types
                                                                .filter(fi => !this.state.site_building_typesids?.includes(fi.name))
                                                                .filter(item =>
                                                                    item?.name
                                                                        ?.toString()
                                                                        ?.toLowerCase()
                                                                        ?.includes(this.state.search?.toLocaleLowerCase())
                                                                )
                                                                .map(item => item)?.length &&
                                                            !getBuildingTypeFilter.building_types
                                                                ?.filter(fi => this.state.building_types?.includes(fi.name))
                                                                .map(item => item).length ? (
                                                                <div className="col-md-6 no-wrap">NO DATA</div>
                                                            ) : (
                                                                getBuildingTypeFilter.building_types
                                                                    .filter(fi => !this.state.building_types?.includes(fi.name))
                                                                    .filter(item =>
                                                                        item?.name
                                                                            ?.toString()
                                                                            ?.toLowerCase()
                                                                            ?.includes(this.state.search?.toLocaleLowerCase())
                                                                    )
                                                                    ?.map(item => item).length === 0 && (
                                                                    <div className="col-md-6 no-wrap">NO MORE VALUES TO DISPLAY</div>
                                                                )
                                                            )}
                                                            <div className="col-md-12 mt-3 drp-btn">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary btnRgion mr-2"
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            showDropDown: ""
                                                                        });
                                                                        if (this.state.btype_flag) {
                                                                            this.props.handleFilter(
                                                                                "building_types",
                                                                                building_types,
                                                                                "buildingTypes",
                                                                                building_types_names
                                                                            );
                                                                            this.setState({
                                                                                btype_flag: false
                                                                            });
                                                                        }
                                                                    }}
                                                                >
                                                                    Ok
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary btnClr"
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            showDropDown: "",
                                                                            btype_flag: false,
                                                                            building_types: [],
                                                                            building_types_names: []
                                                                        });
                                                                        if (filterStat?.building_types?.length) {
                                                                            this.props.handleFilter("building_types", [], [], "buildingTypes");
                                                                        }
                                                                    }}
                                                                >
                                                                    Cancel
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
                                }
                                {section !== "buildinginfo" && (
                                    <div className={filterStat?.building_ids && filterStat?.building_ids.length ? "col bg-th-filtered" : "col"}>
                                        <div
                                            className={
                                                this.state.showDropDown == "building" ? "dropdown-container dropdown-open" : "dropdown-container"
                                            }
                                            onClick={async () => {
                                                showDropDown != "building" && (await this.handleFilterView("building"));
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

                                            <div
                                                className={
                                                    this.state.showDropDown == "building" ? "dropdown-menu  dropdown-active" : "dropdown-menu "
                                                }
                                            >
                                                {/* <div className="col-md-12 p-0 slt-ara slt"><span className="dropdown-item"><label className="container-check">Select all<input type="checkbox" /><span className="checkmark"></span></label></span></div> */}
                                                {getBuildingFilter && getBuildingFilter.buildings && getBuildingFilter.buildings.length ? (
                                                    <>
                                                        <div
                                                            className="dropdown-menu drop-filtr pos-abs dp-rcm-overflow mt-0"
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                            }}
                                                        >
                                                            <div className="col-md-12 p-0">
                                                                <span className="dropdown-item build_search_drp">
                                                                    <input
                                                                        type="search"
                                                                        placeholder="Search..."
                                                                        value={this.state.search}
                                                                        onChange={e =>
                                                                            this.setState({
                                                                                search: e.target.value
                                                                            })
                                                                        }
                                                                    />
                                                                    <i
                                                                        class="fas fa-times cursor-pointer cls-close"
                                                                        onClick={() => this.setState({ search: "" })}
                                                                    />
                                                                    {/* <div className="col-md-12 p-0 border-bottom pt-1">
                                                                <span className="dropdown-item"> */}
                                                                    <label className="container-check">
                                                                        Select all (
                                                                        {
                                                                            getBuildingFilter.buildings
                                                                                .filter(fi => this.state.building_ids?.includes(fi.id))
                                                                                ?.map(item => item).length
                                                                        }
                                                                        )
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
                                                                                        building_flag:
                                                                                            this.state.building_ids.length > 0 ? true : false,
                                                                                        building_ids: [],
                                                                                        building_names: []
                                                                                    });
                                                                                }
                                                                            }}
                                                                        />
                                                                        <span className="checkmark"></span>
                                                                        <button
                                                                            className="clear-btn-selection"
                                                                            // class="fas fa-times cursor-pointer cls-close"
                                                                            onClick={() =>
                                                                                this.setState({
                                                                                    building_flag: this.state.building_ids.length > 0 ? true : false,
                                                                                    building_ids: [],
                                                                                    building_names: []
                                                                                })
                                                                            }
                                                                        >
                                                                            Clear
                                                                        </button>
                                                                    </label>
                                                                </span>
                                                            </div>
                                                            <div className="col-md-12 p-0 slt-ara border-bottom">
                                                                {getBuildingFilter.buildings
                                                                    .filter(fi => this.state.building_ids?.includes(fi.id))
                                                                    .map(item => (
                                                                        <span className="dropdown-item">
                                                                            <label className="container-check">
                                                                                {item.name} ({item.count})
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={
                                                                                        this.state.building_ids.find(ci => ci == item.id)
                                                                                            ? true
                                                                                            : false
                                                                                    }
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
                                                                                                building_flag:
                                                                                                    this.state.building_ids.length > 0 ? true : false,
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
                                                            <div className="col-md-12 p-0 slt-ara">
                                                                {getBuildingFilter.buildings
                                                                    .filter(fi => !this.state.building_ids?.includes(fi.id))
                                                                    .filter(item =>
                                                                        item?.name
                                                                            ?.toString()
                                                                            ?.toLowerCase()
                                                                            ?.includes(this.state.search?.toLocaleLowerCase())
                                                                    )
                                                                    ?.map(item => (
                                                                        <span className="dropdown-item">
                                                                            <label className="container-check">
                                                                                {item.name} ({item.count})
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={
                                                                                        this.state.building_ids.find(ci => ci == item.name)
                                                                                            ? true
                                                                                            : false
                                                                                    }
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
                                                                                                building_flag:
                                                                                                    this.state.building_ids.length > 0 ? true : false,
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
                                                            {!getBuildingFilter.buildings
                                                                .filter(fi => !this.state.building_ids?.includes(fi.id))
                                                                .filter(item =>
                                                                    item?.name
                                                                        ?.toString()
                                                                        ?.toLowerCase()
                                                                        ?.includes(this.state.search?.toLocaleLowerCase())
                                                                )
                                                                .map(item => item)?.length &&
                                                            !getBuildingFilter.buildings
                                                                ?.filter(fi => this.state.building_ids?.includes(fi.id))
                                                                .map(item => item).length ? (
                                                                <div className="col-md-6 no-wrap">NO DATA</div>
                                                            ) : (
                                                                getBuildingFilter.buildings
                                                                    .filter(fi => !this.state.building_ids?.includes(fi.id))
                                                                    .filter(item =>
                                                                        item?.name
                                                                            ?.toString()
                                                                            ?.toLowerCase()
                                                                            ?.includes(this.state.search?.toLocaleLowerCase())
                                                                    )
                                                                    ?.map(item => item).length === 0 && (
                                                                    <div className="col-md-6 no-wrap">NO MORE VALUES TO DISPLAY</div>
                                                                )
                                                            )}
                                                            <div className="col-md-12 mt-3 drp-btn  ">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary btnRgion mr-2 "
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            showDropDown: ""
                                                                        });
                                                                        if (this.state.building_flag) {
                                                                            this.props.handleFilter(
                                                                                "building_ids",
                                                                                building_ids,
                                                                                "buildings",
                                                                                building_names
                                                                            );
                                                                            this.setState({
                                                                                building_flag: false
                                                                            });
                                                                        }
                                                                    }}
                                                                >
                                                                    Ok
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary btnClr"
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            showDropDown: "",
                                                                            building_flag: false,
                                                                            building_ids: [],
                                                                            building_names: []
                                                                        });
                                                                        if (filterStat?.building_ids?.length) {
                                                                            this.props.handleFilter("building_ids", [], [], "buildings");
                                                                        }
                                                                    }}
                                                                >
                                                                    Cancel
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
                                )}
                                <div className={filterStat?.years && filterStat?.years.length ? "col bg-th-filtered" : "col"}>
                                    <div
                                        className={this.state.showDropDown == "years" ? "dropdown-container dropdown-open" : "dropdown-container"}
                                        onClick={async () => {
                                            showDropDown != "years" && (await this.handleFilterView("years"));
                                            await this.setState({
                                                showDropDown: showDropDown == "years" ? "" : "years"
                                            });
                                        }}
                                    >
                                        <div className="dropdown-toggle click-dropdown">
                                            Years
                                            <span className="close-reg">
                                                <i className="fas fa-chevron-down"></i>
                                            </span>
                                        </div>

                                        <div className={this.state.showDropDown == "years" ? "dropdown-menu  dropdown-active" : "dropdown-menu "}>
                                            {/* <div className="col-md-12 p-0 slt-ara slt"><span className="dropdown-item"><label className="container-check">Select all<input type="checkbox" /><span className="checkmark"></span></label></span></div> */}
                                            {getYearFilter && getYearFilter.years && getYearFilter.years.length ? (
                                                <>
                                                    <div
                                                        className="dropdown-menu drop-filtr pos-abs dp-rcm-overflow mt-0"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <div className="col-md-12 p-0 border-bottom">
                                                            <span className="dropdown-item build_search_drp p-1">
                                                                <input
                                                                    type="search"
                                                                    placeholder="Search..."
                                                                    value={this.state.search}
                                                                    onChange={e =>
                                                                        this.setState({
                                                                            search: e.target.value
                                                                        })
                                                                    }
                                                                />
                                                                <i
                                                                    class="fas fa-times cursor-pointer cls-close"
                                                                    onClick={() => this.setState({ search: "" })}
                                                                />

                                                                <label className="container-check">
                                                                    Select all(
                                                                    {
                                                                        getYearFilter.years
                                                                            .filter(fi => this.state.year_ids?.includes(fi))
                                                                            ?.map(item => item).length
                                                                    }
                                                                    )
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            getYearFilter &&
                                                                            getYearFilter.years &&
                                                                            getYearFilter.years.length == year_ids.length
                                                                                ? true
                                                                                : false
                                                                        }
                                                                        onChange={e => {
                                                                            let temp = [];

                                                                            if (e.target.checked) {
                                                                                getYearFilter.years.map(item => {
                                                                                    temp.push(item.toString());
                                                                                });
                                                                                this.setState({
                                                                                    year_flag: true,
                                                                                    year_ids: temp
                                                                                });
                                                                            } else {
                                                                                this.setState({
                                                                                    year_flag: this.state.year_ids.length > 0 ? true : false,
                                                                                    year_ids: []
                                                                                });
                                                                            }
                                                                        }}
                                                                    />
                                                                    <span className="checkmark"></span>
                                                                    <button
                                                                        className="clear-btn-selection"
                                                                        // class="fas fa-times cursor-pointer cls-close"
                                                                        onClick={() =>
                                                                            this.setState({
                                                                                year_flag: this.state.year_ids.length > 0 ? true : false,
                                                                                year_ids: []
                                                                                // building_types_names: []
                                                                            })
                                                                        }
                                                                    >
                                                                        Clear
                                                                    </button>
                                                                </label>
                                                            </span>
                                                        </div>
                                                        <div className="col-md-12 p-0 slt-ara border-bottom">
                                                            {getYearFilter.years
                                                                .filter(fi => this.state.year_ids?.includes(fi))
                                                                .map(item => (
                                                                    <span className="dropdown-item">
                                                                        <label className="container-check">
                                                                            {item}
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={this.state.year_ids.find(ci => ci == item) ? true : false}
                                                                                onChange={e => {
                                                                                    if (e.target.checked) {
                                                                                        this.setState({
                                                                                            year_flag: true,
                                                                                            year_ids: [...this.state.year_ids, item.id]
                                                                                            // building_types_names: [...building_types_names, item.name]
                                                                                        });
                                                                                    } else {
                                                                                        let test = this.state.year_ids;
                                                                                        test = test.filter(t => t !== item);
                                                                                        // let name = this.state.building_types_names;
                                                                                        // name = name.filter(t => t !== item.name);
                                                                                        this.setState({
                                                                                            year_flag: this.state.year_ids.length > 0 ? true : false,
                                                                                            year_ids: test
                                                                                            // building_types_names: name
                                                                                        });
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <span className="checkmark"></span>
                                                                        </label>
                                                                    </span>
                                                                ))}
                                                        </div>
                                                        <div className="col-md-12 p-0 slt-ara">
                                                            {getYearFilter.years
                                                                .filter(fi => !this.state.year_ids?.includes(fi))
                                                                .filter(item =>
                                                                    item?.toString()?.toLowerCase()?.includes(this.state.search?.toLocaleLowerCase())
                                                                )
                                                                ?.map(item => (
                                                                    <span className="dropdown-item">
                                                                        <label className="container-check">
                                                                            {item}
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={this.state.year_ids.find(ci => ci == item) ? true : false}
                                                                                onChange={e => {
                                                                                    if (e.target.checked) {
                                                                                        this.setState({
                                                                                            year_flag: true,
                                                                                            year_ids: [...this.state.year_ids, item]
                                                                                        });
                                                                                    } else {
                                                                                        let test = this.state.year_ids;
                                                                                        test = test.filter(t => t !== item);

                                                                                        this.setState({
                                                                                            year_flag: this.state.year_ids.length > 0 ? true : false,
                                                                                            year_ids: test
                                                                                        });
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <span className="checkmark"></span>
                                                                        </label>
                                                                    </span>
                                                                ))}
                                                        </div>
                                                        {!getYearFilter.years
                                                            .filter(fi => !this.state.year_ids?.includes(fi))
                                                            .filter(item =>
                                                                item?.toString()?.toLowerCase()?.includes(this.state.search?.toLocaleLowerCase())
                                                            )
                                                            .map(item => item)?.length &&
                                                        !getYearFilter.years?.filter(fi => this.state.year_ids?.includes(fi)).map(item => item)
                                                            .length ? (
                                                            <div className="col-md-6 no-wrap">NO DATA</div>
                                                        ) : (
                                                            getYearFilter.years
                                                                .filter(fi => !this.state.year_ids?.includes(fi))
                                                                .filter(item =>
                                                                    item?.toString()?.toLowerCase()?.includes(this.state.search?.toLocaleLowerCase())
                                                                )
                                                                ?.map(item => item).length === 0 && (
                                                                <div className="col-md-6 no-wrap">NO MORE VALUES TO DISPLAY</div>
                                                            )
                                                        )}
                                                        <div className="col-md-12 mt-3 drp-btn">
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary btnRgion mr-2"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        showDropDown: ""
                                                                    });
                                                                    if (this.state.year_flag) {
                                                                        this.props.handleFilter("years", year_ids, "years", year_ids);
                                                                        this.setState({
                                                                            year_flag: false
                                                                        });
                                                                    }
                                                                }}
                                                            >
                                                                Ok
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary btnClr"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        showDropDown: "",
                                                                        year_flag: false,
                                                                        year_ids: []
                                                                        // building_names: []
                                                                    });
                                                                    if (filterStat?.years?.length) {
                                                                        this.props.handleFilter("years", [], [], "years");
                                                                    }
                                                                }}
                                                            >
                                                                Cancel
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

                                <div className="view mx-2 my-auto">
                                    <div
                                        className="view-inner topfilter-cursor"
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
                                {this.checkFilter(filterNames) && (
                                    <div className="d-flex justify-content-center align-items-center">
                                        <div className="view-inner filter-apply filter-numbr topfilter-cursor" onClick={this.setFilterModal}>
                                            <img
                                                src=" /img/filter.svg"
                                                alt=""
                                                className={"filtrImg"}
                                                data-tip="Applied Filters"
                                                data-background-color="#007bff"
                                                currentitem="false"
                                            />
                                            <div className="arrow-sec"></div>
                                            <span className="notifyTxt">{this.checkFilterCount(filterNames)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    const { chartEnergyReducer } = state;
    return {
        chartEnergyReducer
    };
};
export default withRouter(connect(mapStateToProps, { ...energyChartActions })(TopFilter));
