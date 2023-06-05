import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

import Highcharts from "highcharts";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsMore from "highcharts/highcharts-more";
// import HighChartExport from 'highcharts/modules/exporting';
import HighChartExportModule from "highcharts/modules/export-data";
import LabelModule from "highcharts/modules/series-label";
import GridLight from "highcharts/themes/grid-light";
import GridLightSource from "highcharts/themes/grid-light.src";
import Loader from "../../common/components/Loader";
import ChartView from "./chartView";

import Portal from "../../common/components/Portal";
import FilterValue from "../../site/components/FilterValues";
import LoadingOverlay from "react-loading-overlay";
import ChartDashboard1 from "./chartDashboard1";
import ChartDashboard2 from "./chartDashboard2";
import ChartDashboard3 from "./chartDashboard3";
import ChartDashboard4 from "./chartDashboard4";
import ChartDashboard5 from "./chartDashboard5";

import { addToBreadCrumpData, resetBreadCrumpData, popBreadCrumpData, findPrevPathFromBreadCrumpData } from "../../../config/utils";

import Topfilter from "./topFilter";

import { withRouter } from "react-router-dom";
import { API_ROUTE } from "../../../config/constants";
import HelperIcon from "../../helper/components/HelperIcon";
import energyChartActions from "../actions";

highchartsMore(Highcharts);
// require('highcharts/modules/export-data')(Highcharts);

highcharts3d(Highcharts);
// HighChartExport(Highcharts);
// HighChartExportModule(Highcharts)
GridLight(Highcharts);
// GridLightSource(Highcharts)
LabelModule(Highcharts);

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenColorCode: false,
            locked: false,
            isLoading: false,
            isLoadingEFCI: false,
            alertMessage: "",
            errorMessage: "",
            siteList: [],
            chartData: {},
            paginationParams: this.props.chartEnergyReducer.entityParams.paginationParams,
            currentViewAllUsers: null,
            currentActions: null,
            showSiteModal: false,
            showViewModal: false,
            showWildCardFilter: false,
            showAssignConsultancyUsers: false,
            siteData: {},
            clients: [],
            regionList: [],
            selectedRowId: this.props.chartEnergyReducer.entityParams.selectedRowId,
            params: this.props.chartEnergyReducer.entityParams.params,
            wildCardFilterParams: this.props.chartEnergyReducer.entityParams.wildCardFilterParams,
            filterParams: this.props.chartEnergyReducer.entityParams.filterParams,
            efciSiteData: {},
            hiddenFundingOptionList: [],
            currentTab: "dashboard3",
            viewContent: "totalView",
            activeTab: "",
            startYear: null,
            endYear: null,
            filterValues: this.props.chartEnergyReducer.entityParams.params,
            viewFilterModal: false,
            filterView: "both",
            chartType: null,
            checkedArray: [],
            loading: false,
            master_filter: {
                years: [],
                region_ids: [],
                site_ids: [],
                building_ids: [],
                building_types: []
            },
            master_names: {
                years: [],
                regions: [],
                sites: [],
                buildings: [],
                buildingTypes: []
            }
        };
    }

    toggleLoader = async () => {
        await this.setState({
            loading: !this.state.loading
        });
    };

    componentDidMount = async () => {
        this.initiateFullScreen();
        await this.getDashboardData();
        await this.getClientData();
    };

    componentDidUpdate = async (prevProps, prevState) => {};

    paramFetcher = master => {
        let res = {};
        const {
            match: {
                params: { id, section }
            },
            basicDetails
        } = this.props;
        let params = {};
        switch (section) {
            case "energyinfo":
                params.client_id = id;
                break;
            case "regioninfo":
                params.region_ids = [id];
                params.client_id = basicDetails?.client?.id;
                break;
            case "siteinfo":
                params.site_ids = [id];
                params.client_id = basicDetails?.client?.id;
                break;
            case "buildinginfo":
                params.building_ids = [id];
                params.client_id = basicDetails?.client?.id;
                break;
            default:
                break;
        }
        if (master) {
            res = { ...master, ...params };
        } else {
            res = { ...params };
        }
        return res;
    };

    getDashboardData = async master => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;

        let dashData = {};

        let subParams = this.paramFetcher(master);

        await this.props.getDashboardDetails({ ...params, ...subParams });

        dashData = this.props?.chartEnergyReducer?.getDashboardDetailsResponse?.charts || {};

        await this.setState({ chartData: dashData, isLoading: false });
    };

    getClientData = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;

        const subPrams = {};
        const {
            match: {
                params: { section, id }
            }
        } = this.props;

        let clientData = {};
        if (section === "energyinfo") {
            subPrams.client_id = id;
            await this.props.getClientById(id);
            clientData = this.props?.chartEnergyReducer?.getClientIdResponse || {};
            await this.setState({ clientData: clientData, isLoading: false });
        }

        if (section === "buildinginfo") {
            subPrams.building_id = id;
            await this.props.getBuildingById(id);
            clientData = this.props?.chartEnergyReducer?.getBuildingByIdResponse || {};
            await this.setState({ clientData: clientData, isLoading: false });
        }

        if (section === "regioninfo") {
            subPrams.region_id = id;
            await this.props.getRegionById(id);
            clientData = this.props?.chartEnergyReducer?.getRegionByIdResponse || {};
            await this.setState({ clientData: clientData, isLoading: false });
        }

        if (section === "siteinfo") {
            subPrams.site_id = id;
            await this.props.getSiteById(id);
            clientData = this.props?.chartEnergyReducer?.getSiteByIdResponse || {};
            await this.setState({ clientData: clientData, isLoading: false });
        }
    };

    handleFilterValues = params => {
        // let isFilterValues = params && params.filters
        this.setState({
            filterValues: params
        });
    };

    setFilterModal = () => {
        this.setState({
            viewFilterModal: true
        });
    };

    handleGraphView = e => {
        if (e.target.checked) {
            this.setState({
                filterView: e.target.value
            });
        } else {
            this.setState({
                filterView: "both"
            });
        }
    };

    handleChart = e => {
        this.setState({
            chartType: e.target.value
        });
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

    handleChartView = type => {
        switch (type) {
            case "monthly_electricity_cost": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard1"
                });
                break;
            }
            case "monthly_electricity_usage": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard1"
                });
                break;
            }
            case "monthly_gas_cost": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard1"
                });
                break;
            }
            case "monthly_gas_usage": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard1"
                });
                break;
            }
            case "monthly_total_energy_cost": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard1"
                });
                break;
            }
            case "monthly_total_energy_usage": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard1"
                });
                break;
            }
            case "cooling_degree_days": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard5"
                });
                break;
            }
            case "heating_degree_days": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard5"
                });
                break;
            }
            case "building_energy_cost_intensity": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard4"
                });
                break;
            }
            case "building_energy_usage_intensity": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard3"
                });
                break;
            }
            case "site_energy_cost_intensity": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard4"
                });
                break;
            }
            case "site_energy_use_intensity": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard3"
                });
                break;
            }
            case "building_total_energy_cost": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard4"
                });
                break;
            }
            case "building_total_energy_usage": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard3"
                });
                break;
            }
            case "energy_unit_analysis": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard4"
                });
                break;
            }
            case "usage_analysis": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard3"
                });
                break;
            }
            case "building_energy_star_ratings": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn2d",
                    activeTab: "dashboard6"
                });
                break;
            }

            default:
                break;
        }
    };

    closeHandler = tab => {
        switch (tab) {
            case "monthly_electricity_cost":
            case "monthly_electricity_usage":
            case "monthly_gas_cost":
            case "monthly_gas_usage":
            case "monthly_total_energy_cost":
            case "monthly_total_energy_usage": {
                this.setState({
                    currentTab: "dashboard1",
                    viewContent: "totalView",
                    activeTab: "dashboard1"
                });
                break;
            }
            case "cooling_degree_days":
            case "heating_degree_days": {
                this.setState({
                    currentTab: "dashboard5",
                    viewContent: "totalView",
                    activeTab: "dashboard5"
                });
                break;
            }
            case "building_energy_cost_intensity":
            case "site_energy_cost_intensity":
            case "building_total_energy_cost":
            case "energy_unit_analysis": {
                this.setState({
                    currentTab: "dashboard4",
                    viewContent: "totalView",
                    activeTab: "dashboard4"
                });
                break;
            }
            case "building_energy_usage_intensity":
            case "site_energy_use_intensity":
            case "building_total_energy_usage":
            case "usage_analysis": {
                this.setState({
                    currentTab: "dashboard3",
                    viewContent: "totalView",
                    activeTab: "dashboard3"
                });
                break;
            }
            default:
                break;
        }
    };

    exportToXsl = async () => {
        let url_string = window.location.href;
        let url = new URL(url_string);
        let id = url.searchParams.get("pid");
        let id2 = this.props.projectId;

        if (this.props.dataView == "building") {
            let chartParams = {
                buildingId: this.props.buildingId,
                projectId: id2
            };
            let params = {
                chart: this.state.currentTab,
                start_year: this.state.startYear,
                end_year: this.state.endYear
            };
            await this.props.getChartExportBuilding(chartParams, params);
        }
        if (this.props.dataView == "project") {
            let chartParams = {
                buildingId: this.props.buildingId,
                projectId: id2
            };
            let params = {
                chart: this.state.currentTab,
                start_year: this.state.startYear,
                end_year: this.state.endYear
            };
            await this.props.getChartExportProject(chartParams, params);
        }
        if (this.props.dataView == "region") {
            console.log("region");
            let chartParams = {
                regionId: this.props.regionId,
                projectId: id
            };
            let params = {
                chart: this.state.currentTab,
                start_year: this.state.startYear,
                end_year: this.state.endYear
            };
            await this.props.getChartExportRegion(chartParams, params);
        }
    };

    initiateFullScreen = () => {
        var element = document.documentElement;

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
        } else {
            element.requestFullScreen();
        }
        isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();

        if (document.addEventListener) {
            document.addEventListener("webkitfullscreenchange", exitHandler, false);
            document.addEventListener("mozfullscreenchange", exitHandler, false);
            document.addEventListener("fullscreenchange", exitHandler, false);
            document.addEventListener("MSFullscreenChange", exitHandler, false);
        }

        function exitHandler() {
            if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
                var myDiv = document.getElementById("chartBody");
                var efciBody = document.getElementById("efciData");
                let chartBody = document.getElementById("dashboard");
                myDiv && myDiv.classList.remove("fl-srn");
                chartBody && chartBody.classList.remove("fln-src");
                efciBody && efciBody.classList.remove("flr-srn-efci");
                document.querySelector("#ModalCopy") && document.querySelector("#ModalCopy").remove();
            }
        }
    };

    toggleFullscreen = event => {
        // var element = document.getElementById('navBar')
        var element = document.getElementById("chartBody");
        var chartBody = document.getElementById("dashboard");
        var efciBody = document.getElementById("efciData");
        var modalCopy = document.createElement("div");
        modalCopy.id = "ModalCopy";

        var modalDiv = document.createElement("div");
        modalDiv.id = "commonModal";
        modalCopy.appendChild(modalDiv);
        element.appendChild(modalCopy);
        element.classList.add("fl-srn");
        efciBody && efciBody.classList.add("flr-srn-efci");
        chartBody && chartBody.classList.add("fln-src");
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

        if (document.addEventListener) {
            document.addEventListener("webkitfullscreenchange", exitHandler, false);
            document.addEventListener("mozfullscreenchange", exitHandler, false);
            document.addEventListener("fullscreenchange", exitHandler, false);
            document.addEventListener("MSFullscreenChange", exitHandler, false);
        }

        function exitHandler() {
            if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
                var myDiv = document.getElementById("chartBody");
                var efciBody = document.getElementById("efciData");
                let chartBody = document.getElementById("dashboard");
                myDiv && myDiv.classList.remove("fl-srn");
                chartBody && chartBody.classList.remove("fln-src");
                efciBody && efciBody.classList.remove("flr-srn-efci");
                document.querySelector("#ModalCopy") && document.querySelector("#ModalCopy").remove();
            }
        }
    };

    renderGraphData = () => {
        switch (this.props.dataView) {
            case "region":
                return this.props.chartEnergyReducer.graphDetails;
            case "project":
                return this.props.chartEnergyReducer.graphDetails;
        }
    };

    handleTab = tabData => {
        if (tabData === "dashboard6") {
            this.setState({
                currentTab: tabData
                // viewContent: "totalView"
            });
            return;
        }

        if (tabData == "dashboard1" || "dashboard2" || "dashboard3" || "dashboard4" || "dashboard5") {
            var isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;
            if (isFullscreen) {
                var chartBody = document.getElementById("dashboard");

                chartBody && chartBody.classList.add("fln-src");
            }

            this.setState({
                currentTab: tabData,
                viewContent: "totalView"
            });
        } else {
            this.setState({
                currentTab: tabData
                // viewContent: "totalView"
            });
        }
    };

    handleFilter = async (key, ids, head, names) => {
        let tempFilter = this.state.master_filter;
        let tempFilterNames = this.state.master_names;

        tempFilter[key] = ids;
        tempFilterNames[head] = names;

        await this.getDashboardData({ ...tempFilter });

        this.setState(prevState => ({
            master_filter: {
                ...prevState.master_filter,
                [key]: ids
            }
        }));
        this.setState(prevState => ({
            master_names: {
                ...prevState.master_names,
                [head]: names
            }
        }));
    };

    clearAllFilter = async () => {
        let subParams = this.paramFetcher();

        this.setState({
            master_filter: {
                years: subParams?.years || [],
                region_ids: subParams?.region_ids || [],
                site_ids: subParams?.site_ids || [],
                building_ids: subParams?.building_ids || [],
                building_types: subParams?.building_types || []
            }
        });
        this.setState({
            master_names: {
                years: [],
                region_ids: [],
                site_ids: [],
                building_ids: [],
                building_types: []
            }
        });
        await this.getDashboardData();
    };

    render() {
        const { viewContent, startYear, errorBuilding, endYear, currentTab, viewFilterModal, filterValues, filterView, chartType, checkedArray } =
            this.state;
        const {
            updateFundingOptionEfci,

            match: {
                params: { section }
            },
            loading,
            hasChartExport
        } = this.props;

        return (
            <LoadingOverlay active={this.props.loading || this.props.isLoading || this.state.hasLoading} spinner={<Loader />} fadeSpeed={10}>
                <div id={"chartBody"}>
                    <div className={`tab-active min-head ${this.state.currentTab === "csp&efci" ? "chart-building" : ""}`}>
                        <div className="min-nav energy-nav">
                            <ul className={"pl-3"}>
                                {/* <li
                                    className={`${this.state.currentTab === "dashboard2" ? "active" : null}`}
                                    onClick={() => this.handleTab("dashboard2")}
                                >
                                    Energy Benchmarking
                                </li> */}

                                <li
                                    className={`${this.state.currentTab === "dashboard3" || this.state.activeTab === "dashboard3" ? "active" : null}`}
                                    onClick={() => {
                                        this.handleTab("dashboard3");
                                        this.setState({ activeTab: "dashboard3" });
                                    }}
                                >
                                    {`EUI (Energy Use Intensity)`}
                                </li>
                                <li
                                    className={`${this.state.currentTab === "dashboard4" || this.state.activeTab === "dashboard4" ? "active" : null}`}
                                    onClick={() => {
                                        this.handleTab("dashboard4");
                                        this.setState({ activeTab: "dashboard4" });
                                    }}
                                >
                                    {`ECI (Energy Cost Index)`}
                                </li>
                                <li
                                    className={`${this.state.currentTab === "dashboard1" || this.state.activeTab === "dashboard1" ? "active" : null}`}
                                    onClick={() => {
                                        this.handleTab("dashboard1");
                                        this.setState({ activeTab: "dashboard1" });
                                    }}
                                >
                                    Monthly Analysis
                                </li>
                                <li
                                    className={`${this.state.currentTab === "dashboard5" || this.state.activeTab === "dashboard5" ? "active" : null}`}
                                    onClick={() => {
                                        this.handleTab("dashboard5");
                                        this.setState({ activeTab: "dashboard5" });
                                    }}
                                >
                                    {`CDD & HDD`}
                                </li>
                                <li
                                    className={`${
                                        this.state.currentTab === "building_energy_star_ratings" || this.state.activeTab === "dashboard6"
                                            ? "active"
                                            : null
                                    }`}
                                    onClick={() => {
                                        this.handleTab("dashboard6");
                                        this.setState({ activeTab: null });
                                        this.handleChartView("building_energy_star_ratings");
                                    }}
                                >
                                    Energy Star Ratings
                                </li>
                            </ul>
                            <div className="d-flex align-items-center">
                                <HelperIcon
                                    type={"charts_and_graph"}
                                    entity={section === "regioninfo" ? "region" : "fca_projects"}
                                    additoinalClass={"charts_and_graph"}
                                />
                                <a className="nav-link calcicons min-mize" onClick={e => this.toggleFullscreen(e)}>
                                    <img src="/img/restore.svg" alt="" className="set-icon-width" />
                                </a>
                            </div>
                        </div>
                        <div className="d-flex min-loc">
                            <Topfilter
                                handleFilter={this.handleFilter}
                                clearAllFilter={this.clearAllFilter}
                                filterStat={this.state.master_filter}
                                filterNames={this.state.master_names}
                                years={this.state.chartData?.all_years || []}
                            />
                        </div>
                        {/* {viewContent !== "totalView" && (
                        <div className="right-section col-md-12">
                            <div className="min-tab-buttons">
                                <button
                                    className={`${this.state.viewContent === "detailView" ? "active" : null} border-0`}
                                    // onClick={() => this.handleView("detailView")}
                                >
                                    <i>
                                        <img src="/img/detail-view.png" alt="" />
                                    </i>
                                    Detailed View{" "}
                                </button>
                            </div>
                        </div>
                    )} */}
                    </div>

                    {viewContent === "totalView" ? (
                        (() => {
                            switch (this.state.currentTab) {
                                case "dashboard1":
                                    return (
                                        <ChartDashboard1
                                            graphData={this.state.chartData}
                                            handleChartView={this.handleChartView}
                                            dataView={this.props.dataView}
                                            isLoading={this.state.isLoading}
                                            filterValues={filterValues}
                                            clientDetails={this.state.clientData}
                                            match={this.props.match}
                                        />
                                    );

                                case "dashboard2":
                                    return (
                                        <ChartDashboard2
                                            graphData={this.state.chartData}
                                            handleChartView={this.handleChartView}
                                            dataView={this.props.dataView}
                                            isLoading={this.state.isLoading}
                                            filterValues={filterValues}
                                            clientDetails={this.state.clientData}
                                        />
                                    );

                                case "dashboard3":
                                    return (
                                        <ChartDashboard3
                                            graphData={this.state.chartData}
                                            handleChartView={this.handleChartView}
                                            dataView={this.props.dataView}
                                            isLoading={this.state.isLoading}
                                            filterValues={filterValues}
                                            clientDetails={this.state.clientData}
                                            match={this.props.match}
                                        />
                                    );
                                case "dashboard4":
                                    return (
                                        <ChartDashboard4
                                            graphData={this.state.chartData}
                                            handleChartView={this.handleChartView}
                                            dataView={this.props.dataView}
                                            isLoading={this.state.isLoading}
                                            filterValues={filterValues}
                                            clientDetails={this.state.clientData}
                                            match={this.props.match}
                                        />
                                    );
                                case "dashboard5":
                                    return (
                                        <ChartDashboard5
                                            graphData={this.state.chartData}
                                            handleChartView={this.handleChartView}
                                            dataView={this.props.dataView}
                                            isLoading={this.state.isLoading}
                                            filterValues={filterValues}
                                            clientDetails={this.state.clientData}
                                            match={this.props.match}
                                        />
                                    );

                                default:
                                    break;
                            }
                        })()
                    ) : (
                        <ChartView
                            exportToXsl={this.exportToXsl}
                            colorCodes={this.props.colorCodes}
                            graphData={this.state.chartData}
                            loadData={this.loadData}
                            startYear={startYear}
                            endYear={endYear}
                            currentTab={currentTab}
                            viewContent={viewContent}
                            filterValues={filterValues}
                            filterView={filterView}
                            chartType={chartType}
                            handleChart={this.handleChart}
                            checkedArray={checkedArray}
                            isLoading={this.state.isLoading}
                            //project&region
                            setColor={this.props.setColor}
                            disableClick={this.props.disableClick}
                            hasChartExport={true}
                            // hasChartExport={hasChartExport}
                            clientDetails={this.state.clientData}
                            match={this.props.match}
                            closeHandler={this.closeHandler}
                            masterFilters={this.state.master_filter}
                        />
                    )}
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { chartEnergyReducer } = state;
    return { chartEnergyReducer };
};

export default withRouter(connect(mapStateToProps, { ...energyChartActions })(Dashboard));
