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

import ChartView from "./ChartView";
import siteActions from "../actions";
import regionActions from "../../region/actions";
import projectActions from "../../project/actions";
import Recommendations from "../../recommendations/index";
import buildingAction from "../../building/actions";
import Portal from "../../common/components/Portal";
import FilterValue from "./FilterValues";
import BootstrapSwitchButton from "bootstrap";
import EFCISite from "./EFCISite";
import EFCI from "../../building/components/EFCI";
import ReactTooltip from "react-tooltip";
import { siteTableData } from "../../../config/tableData";
import qs from "query-string";
import Loader from "../../common/components/Loader";
import LoadingOverlay from "react-loading-overlay";
import ChartDashboard from "./ChartDashboard";
import NumberFormat from "react-number-format";
import InfoSubTab from "../../common/components/infoSubTab";
import { addToBreadCrumpData, resetBreadCrumpData, popBreadCrumpData, findPrevPathFromBreadCrumpData } from "../../../config/utils";

import { futureCapitalTableData, differedMaintenanceTableData } from "../../../config/tableData";

import ConfirmationModal from "../../common/components/ConfirmationModal";
import { withRouter } from "react-router-dom";
import { API_ROUTE } from "../../../config/constants";
import HelperIcon from "../../helper/components/HelperIcon";
import dashboardActions from "../../dashboard/actions";
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
            locked: false,
            isLoading: false,
            isLoadingEFCI: false,
            alertMessage: "",
            errorMessage: "",
            siteList: [],
            paginationParams: this.props.siteReducer.entityParams.paginationParams,
            currentViewAllUsers: null,
            currentActions: null,
            showSiteModal: false,
            showViewModal: false,
            showWildCardFilter: false,
            showAssignConsultancyUsers: false,
            siteData: {},
            clients: [],
            regionList: [],
            consultancy_users: [],
            selectedRowId: this.props.siteReducer.entityParams.selectedRowId,
            params: this.props.siteReducer.entityParams.params,
            selectedClient: {},
            // selectedSite: this.props.match.params.id || this.props.siteReducer.entityParams.selectedEntity,
            // tableData: {
            //     keys: siteTableData.keys,
            //     config: this.props.siteReducer.entityParams.tableConfig || siteTableData.config
            // },
            futureCapitalData: futureCapitalTableData,
            nonFutureCapitalData: futureCapitalTableData,
            differedMaintenanceData: differedMaintenanceTableData,
            proDifferedMaintenanceData: differedMaintenanceTableData,
            tabs: [
                { name: "Dashboard", key: "all" },
                { name: "Trade", key: "trade" },
                { name: "System", key: "system" },
                { name: "Category", key: "category" },
                { name: this.renderTabName(), key: "building" },
                { name: "Funding Source", key: "funding_source" },
                { name: "Term", key: "priority" },
                { name: "CSP & EFCI", key: "csp&efci", orderKey: "EFCI" },
                { name: "Criticality", key: "criticalities" },
                { name: "Capital Type", key: "capital_types" }
            ],
            wildCardFilterParams: this.props.siteReducer.entityParams.wildCardFilterParams,
            filterParams: this.props.siteReducer.entityParams.filterParams,
            efciSiteData: {},
            hiddenFundingOptionList: [],

            currentTab: this.props.match.params.section === "efciinfo" || this.props.isEfciSandbox ? "csp&efci" : "all",
            viewContent: "totalView",
            startYear: null,
            endYear: null,
            filterValues: this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params || { active: true },
            viewFilterModal: false,
            filterView: "both",
            chartType: null,
            showConfirmModal: false,
            showConfirmModalLoad: false,
            buildingArray: [],
            errorBuilding: null,
            loading: false,
            selectedSystem: { id: "", name: "" }
        };
    }

    UNSAFE_componentWillReceiveProps = nextProps => {
        if (this.props.projectReducer.getTradeSettingsDropdownResponse?.trades?.length && !this.state.selectedSystem.id) {
            this.setState({
                selectedSystem: this.props.projectReducer.getTradeSettingsDropdownResponse?.trades[0]
            });
        }
        if (
            this.props.projectReducer.miscSettingsResponse?.miscellaneous?.chart_display_order !==
            nextProps.projectReducer.miscSettingsResponse?.miscellaneous?.chart_display_order
        ) {
            this.reArrangeTabs(nextProps.projectReducer.miscSettingsResponse?.miscellaneous?.chart_display_order);
        }
    };

    toggleLoader = async () => {
        await this.setState({
            loading: !this.state.loading
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Saving current Simulation data will OVERWRITE any existing Production data,"}
                        message={"for this entity and for any dependent entities.This action cannot be undone.Are you sure you want to continue?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.resetDataConfirm}
                        type={"save"}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    renderConfirmationLoad = () => {
        const { showConfirmModalLoad } = this.state;
        if (!showConfirmModalLoad) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Loading current Production data will OVERWRITE any existing Simulation data,"}
                        message={"for this entity and for any dependent entities.This action cannot be undone.Are you sure you want to continue?"}
                        onNo={() => this.setState({ showConfirmModalLoad: false })}
                        onYes={this.loadDataConfirm}
                        type={"load"}
                    />
                }
                onCancel={() => this.setState({ showConfirmModalLoad: false })}
            />
        );
    };

    componentDidMount = async () => {
        let url_string = window.location.href;
        let url = new URL(url_string);
        let id = url.searchParams.get("pid");
        const { dataView } = this.props;
        const sessionCurrentTab = sessionStorage.getItem("chartCurrentTab");
        const sessionCurrentView = sessionStorage.getItem("chartView");
        if (sessionCurrentTab && !this.props.isEfciSandbox) {
            this.setState({ currentTab: sessionCurrentTab });
            sessionStorage.removeItem("chartCurrentTab");
        }
        if (sessionCurrentView && !this.props.isEfciSandbox) {
            this.setState({ viewContent: sessionCurrentView });
            sessionStorage.removeItem("chartView");
        }
        this.setState({
            isLoading: true,
            isLoadingEFCI: true
        });
        if (dataView == "building") {
            let params = {
                buildingId: this.props.buildingId,
                projectId: id
            };
            await this.props.getTradeSettingsDropdown(id);
            const { trades } = this.props.projectReducer.getTradeSettingsDropdownResponse || {};
            const trade_ids = trades?.length ? [trades[0]?.id] : [];
            const systemParams = {
                chart_type: "proj_fca_chart",
                export_type: "system",
                trade_ids,
                project_ids: [id],
                building_ids: [this.props.buildingId],
                user_id: localStorage.getItem("userId")
            };
            await Promise.all([
                this.props.getChartsBuilding(params, this.state.filterValues),
                this.props.getChartEfciBuilding(params),
                this.props.getChartsDashboardPython(systemParams)
            ]);
            this.setState({
                isLoading: false,
                isLoadingEFCI: false
            });

            const { graphDetails } = this.props.buildingReducer;
            let buildingData = [];
            let buildingIds = [];
            if (this.props.buildingReducer.getEfciByBuildingGraph && this.props.buildingReducer.getEfciByBuildingGraph.buildings) {
                buildingData.push({
                    id: this.props.buildingReducer.getEfciByBuildingGraph.buildings.id,
                    name: this.props.buildingReducer.getEfciByBuildingGraph.buildings.name,
                    checked: true,
                    locked: this.props.buildingReducer.getEfciByBuildingGraph.buildings.locked
                });
                buildingIds.push(this.props.buildingReducer.getEfciByBuildingGraph.buildings.id);
            }

            this.setState({
                startYear: graphDetails && graphDetails.start_year,
                endYear: graphDetails && graphDetails.end_year,
                buildingArray: buildingData,
                buildingIds
            });
        } else {
            let params = {
                siteId: this.props.siteId,
                projectId: id
            };
            let buildingDatas = JSON.parse(localStorage.getItem(this.props.siteId || this.props.buildingId));
            let buildingChecked = [];
            if (buildingDatas && id == buildingDatas.id) {
                buildingChecked = buildingDatas ? (buildingDatas.tempBuilding ? buildingDatas.tempBuilding : []) : [];
            }
            const { graphDetails } = this.props.siteReducer;
            let buildingData = [];
            let buildingIds = [];
            this.props.siteReducer.getEfciBySiteGraph &&
                this.props.siteReducer.getEfciBySiteGraph.buildings &&
                this.props.siteReducer.getEfciBySiteGraph.buildings.length &&
                this.props.siteReducer.getEfciBySiteGraph.buildings.map(b => {
                    buildingData.push({
                        id: b.id,
                        name: b.name,
                        checked: buildingChecked.length ? (buildingChecked.find(bu => bu == b.id) ? true : false) : true,
                        locked: b.locked
                    });
                    buildingIds.push(b.id);
                });

            this.setState({
                startYear: graphDetails && graphDetails.start_year,
                endYear: graphDetails && graphDetails.end_year,
                buildingArray: buildingData,
                buildingIds: buildingChecked.length ? buildingChecked : buildingIds,
                isLoadingEFCI: false
            });
        }
        // this.setState({
        //     isLoading: false
        // })
    };

    componentDidUpdate = async prevProps => {
        const { efciBuildingData } = this.props.buildingReducer;
        let url_string = window.location.href;
        let url = new URL(url_string);
        let id = url.searchParams.get("pid");
        let entityId = this.props.siteId || this.props.buildingId;
        if (prevProps.isEfciSandbox !== this.props.isEfciSandbox) {
            this.setState({ currentTab: this.props.match.params.section === "efciinfo" || this.props.isEfciSandbox ? "csp&efci" : "all" });
        }
        if (
            this.props.dataView == "building" &&
            prevProps.buildingReducer.getEfciByBuildingGraph !== this.props.buildingReducer.getEfciByBuildingGraph
        ) {
            let buildingData = [];
            let buildingIds = [];
            if (this.props.buildingReducer.getEfciByBuildingGraph && this.props.buildingReducer.getEfciByBuildingGraph.buildings) {
                buildingData.push({
                    id: this.props.buildingReducer.getEfciByBuildingGraph.buildings.id,
                    name: this.props.buildingReducer.getEfciByBuildingGraph.buildings.name,
                    checked: true,
                    locked: this.props.buildingReducer.getEfciByBuildingGraph.buildings.locked
                });
                buildingIds.push(this.props.buildingReducer.getEfciByBuildingGraph.buildings.id);
            }

            this.setState({
                buildingArray: buildingData,
                buildingIds
            });
        }
        if (prevProps.match.params.subTab != this.props.match.params.subTab) {
            let tabData = this.props.match.params.subTab;
            if (tabData == "0") {
                this.setState({
                    currentTab: tabData,
                    viewContent: "totalView"
                });
            } else if (tabData == "all") {
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
        }
        if (this.props.dataView == "site" && prevProps.siteReducer.graphDetails != this.props.siteReducer.graphDetails) {
            this.setState({
                isLoading: true
                // isLoadingEFCI:false
            });

            // const { dataView } = this.props
            // let params = {
            //     siteId: this.props.siteId,
            //     projectId: id
            // }
            let buildingDatas = JSON.parse(localStorage.getItem(entityId));
            let buildingChecked = [];
            if (buildingDatas && entityId == buildingDatas.id) {
                buildingChecked = buildingDatas ? (buildingDatas.tempBuilding ? buildingDatas.tempBuilding : []) : [];
            }
            // await this.props.getChartData(params, this.state.filterValues)
            // await this.props.getChartEfci(this.props.siteId, { project_id: id })

            // await this.refreshSiteList();
            // await this.props.getEfciBasedOnSite(this.state.filterValues);

            const { graphDetails } = this.props.siteReducer;
            let buildingData = [];
            let buildingIds = [];
            this.props.siteReducer.getEfciBySiteGraph &&
                this.props.siteReducer.getEfciBySiteGraph.buildings &&
                this.props.siteReducer.getEfciBySiteGraph.buildings.length &&
                this.props.siteReducer.getEfciBySiteGraph.buildings.map(b => {
                    buildingData.push({
                        id: b.id,
                        name: b.name,
                        checked: buildingChecked.length ? (buildingChecked.find(bu => bu == b.id) ? true : false) : true,
                        locked: b.locked
                    });
                    buildingIds.push(b.id);
                });

            this.setState({
                startYear: graphDetails && graphDetails.start_year,
                endYear: graphDetails && graphDetails.end_year,
                buildingArray: buildingData,
                buildingIds: buildingChecked.length ? buildingChecked : buildingIds,
                isLoading: false
                //isLoadingEFCI:false
            });
        }
        if (this.props.dataView == "site" && prevProps.siteReducer.getEfciBySiteGraph != this.props.siteReducer.getEfciBySiteGraph) {
            this.setState({
                isLoading: true
            });
            let buildingDatas = JSON.parse(localStorage.getItem(entityId));
            let buildingChecked = [];
            if (buildingDatas && entityId == buildingDatas.id) {
                buildingChecked = buildingDatas ? (buildingDatas.tempBuilding ? buildingDatas.tempBuilding : []) : [];
            }
            const { graphDetails } = this.props.siteReducer;
            let buildingData = [];
            let buildingIds = [];
            this.props.siteReducer.getEfciBySiteGraph &&
                this.props.siteReducer.getEfciBySiteGraph.buildings &&
                this.props.siteReducer.getEfciBySiteGraph.buildings.length &&
                this.props.siteReducer.getEfciBySiteGraph.buildings.map(b => {
                    buildingData.push({
                        id: b.id,
                        name: b.name,
                        checked: buildingChecked.length ? (buildingChecked.find(bu => bu == b.id) ? true : false) : true,
                        locked: b.locked
                    });
                    buildingIds.push(b.id);
                });

            this.setState({
                startYear: graphDetails && graphDetails.start_year,
                endYear: graphDetails && graphDetails.end_year,
                buildingArray: buildingData,
                buildingIds: buildingChecked.length ? buildingChecked : buildingIds
            });
            // if (
            //     this.props.siteReducer.getEfciBySiteGraph &&
            //     this.props.siteReducer.getEfciBySiteGraph.buildings &&
            //     this.props.siteReducer.getEfciBySiteGraph.buildings.length &&
            //     this.props.siteReducer.getEfciBySiteGraph.buildings
            // ) {
            this.setState({
                isLoadingEFCI: false,
                isLoading: false
            });
            // }
        }

        //building
        if (this.props.dataView == "building" && prevProps.buildingReducer.graphDetails != this.props.buildingReducer.graphDetails) {
            let params = {
                buildingId: this.props.buildingId,
                projectId: id
            };
            // await this.props.getChartsBuilding(params, this.state.filterValues)
            // await this.props.getChartEfciBuilding(params)
            this.setState({
                isLoading: false
            });

            const { graphDetails } = this.props.buildingReducer;
            let buildingData = [];
            let buildingIds = [];
            if (this.props.buildingReducer.getEfciByBuildingGraph && this.props.buildingReducer.getEfciByBuildingGraph.buildings) {
                buildingData.push({
                    id: this.props.buildingReducer.getEfciByBuildingGraph.buildings.id,
                    name: this.props.buildingReducer.getEfciByBuildingGraph.buildings.name,
                    checked: true,
                    locked: this.props.buildingReducer.getEfciByBuildingGraph.buildings.locked
                });
                buildingIds.push(this.props.buildingReducer.getEfciByBuildingGraph.buildings.id);
            }

            this.setState({
                startYear: graphDetails && graphDetails.start_year,
                endYear: graphDetails && graphDetails.end_year,
                buildingArray: buildingData,
                buildingIds
            });
        }
        if (
            this.props.dataView == "building" &&
            prevProps.buildingReducer.getEfciByBuildingGraph != this.props.buildingReducer.getEfciByBuildingGraph
        ) {
            let params = {
                buildingId: this.props.buildingId,
                projectId: id
            };
            // await this.props.getChartsBuilding(params, this.state.filterValues)
            // await this.props.getChartEfciBuilding(params)
            this.setState({
                isLoading: false
            });

            const { graphDetails } = this.props.buildingReducer;
            let buildingData = [];
            let buildingIds = [];
            if (this.props.buildingReducer.getEfciByBuildingGraph && this.props.buildingReducer.getEfciByBuildingGraph.buildings) {
                buildingData.push({
                    id: this.props.buildingReducer.getEfciByBuildingGraph.buildings.id,
                    name: this.props.buildingReducer.getEfciByBuildingGraph.buildings.name,
                    checked: true,
                    locked: this.props.buildingReducer.getEfciByBuildingGraph.buildings.locked
                });
                buildingIds.push(this.props.buildingReducer.getEfciByBuildingGraph.buildings.id);
            }

            this.setState({
                startYear: graphDetails && graphDetails.start_year,
                endYear: graphDetails && graphDetails.end_year,
                buildingArray: buildingData,
                buildingIds,
                isLoadingEFCI: false
            });
        }
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.setState({
                isLoading: true,
                errorBuilding: false
            });
        }
    };

    // getEfciBasedOnSite = async () => {
    //     let url_string = window.location.href
    //     let url = new URL(url_string);
    //     let id = url.searchParams.get("pid");
    //     const siteId = this.props.siteId;
    //     await this.props.getChartEfci(siteId, { project_id: id });
    //     await this.setState({
    //         efciSiteData: this.props.siteReducer.getEfciBySiteGraph ? this.props.siteReducer.getEfciBySiteGraph.site || {} : {}
    //     });
    // };

    resetDataConfirm = async () => {
        let url_string = window.location.href;
        let url = new URL(url_string);
        let id = url.searchParams.get("pid");
        this.setState({
            loading: true
        });
        if (this.props.dataView == "building") {
            let params = {
                buildingId: this.props.buildingId,
                projectId: id
            };
            await this.props.saveDataBuilding(params);
            this.setState({ showConfirmModal: false });
            await this.props.getChartEfciBuilding(params);
            await this.setState({
                alertMessage:
                    this.props.buildingReducer.saveEfciBuilding && this.props.buildingReducer.saveEfciBuilding.success
                        ? this.props.buildingReducer.saveEfciBuilding.message
                        : "Error while saving data!!"
            });
        } else {
            let params = {
                siteId: this.props.siteId,
                projectId: id
            };
            await this.props.saveData(params);
            this.setState({ showConfirmModal: false });
            await this.props.getChartEfci(this.props.siteId, { project_id: id });
            await this.setState({
                alertMessage:
                    this.props.siteReducer.saveEfci && this.props.siteReducer.saveEfci.success
                        ? this.props.siteReducer.saveEfci.message
                        : "Error while saving data!!"
            });
        }
        this.setState({
            loading: false
        });
        this.showAlert();
    };

    loadDataConfirm = async () => {
        let url_string = window.location.href;
        let url = new URL(url_string);
        let id = url.searchParams.get("pid");
        // let params = {
        //     buildingId: this.props.siteId,
        //     projectId: id
        // }
        const { dataView } = this.props;
        this.setState({
            loading: true
        });
        if (this.props.dataView == "building") {
            let params = {
                buildingId: this.props.buildingId,
                projectId: id
            };
            await this.props.loadDataBuilding(params);
            this.setState({ showConfirmModalLoad: false });
            await this.props.getChartEfciBuilding(params);
            await this.setState({
                alertMessage:
                    this.props.buildingReducer.loadEfciChartBuilding && this.props.buildingReducer.loadEfciChartBuilding.success
                        ? this.props.buildingReducer.loadEfciChartBuilding.message
                        : "Error occured while loading!!"
            });
        } else {
            await this.props.loadData(this.props.siteId, id);
            this.setState({ showConfirmModalLoad: false });
            await this.props.getChartEfci(this.props.siteId, { project_id: id });
            await this.setState({
                alertMessage:
                    this.props.siteReducer.loadEfciChart && this.props.siteReducer.loadEfciChart.success
                        ? this.props.siteReducer.loadEfciChart.message
                        : "Error occured while loading!!"
            });
        }
        this.setState({
            loading: false
        });
        this.showAlert();
    };

    saveData = () => {
        this.setState({
            showConfirmModal: true
        });
    };

    resetEfci = () => {
        this.setState({
            showConfirmModal: true
        });
    };

    loadData = async () => {
        this.setState({
            showConfirmModalLoad: true
        });
    };

    handleTab = tabData => {
        if (tabData == "csp&efci") {
            this.setState({
                currentTab: tabData,
                viewContent: "totalView"
            });
        } else if (tabData == "all") {
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
        sessionStorage.setItem("chartCurrentTab", tabData);
    };

    handleView = viewData => {
        this.setState({
            viewContent: viewData,
            chartType: this.state.viewContent === "totalView" && this.state.chartType != "csp&efci" ? "pie2d" : "stackedcolumn2d"
        });
        sessionStorage.setItem("chartView", viewData);
    };

    handleYear = e => {
        const { name, value } = e.target;

        this.setState({
            [name]: value
        });
    };

    renderOptions = () => {
        const { dataView } = this.props;
        if (dataView == "building" && this.props.buildingReducer.graphDetails) {
            const {
                graphDetails: { start_year, end_year }
            } = this.props.buildingReducer;
            let years = [];
            let startYear = start_year || moment().format("YYYY");
            while (startYear <= end_year) {
                years.push(startYear++);
            }
            return (
                years &&
                years.map(year => {
                    return <option value={year}>{year}</option>;
                })
            );
        } else if (dataView == "region" && this.props.regionReducer.graphDetails) {
            const {
                graphDetails: { start_year, end_year }
            } = this.props.regionReducer;
            // let start_year=2020
            // let end_year=2029
            let years = [];
            let startYear = start_year || moment().format("YYYY");
            while (startYear <= end_year) {
                years.push(startYear++);
            }
            return (
                years &&
                years.map(year => {
                    return <option value={year}>{year}</option>;
                })
            );
        } else if (dataView == "project" && this.props.projectReducer.graphDetails) {
            const {
                graphDetails: { start_year, end_year }
            } = this.props.projectReducer;
            // let start_year=2020
            // let end_year=2029
            let years = [];
            let startYear = start_year || moment().format("YYYY");
            while (startYear <= end_year) {
                years.push(startYear++);
            }
            return (
                years &&
                years.map(year => {
                    return <option value={year}>{year}</option>;
                })
            );
        } else {
            const {
                graphDetails: { start_year, end_year }
            } = this.props.siteReducer;
            let years = [];
            let startYear = start_year || moment().format("YYYY");
            while (startYear <= end_year) {
                years.push(startYear++);
            }
            return (
                years &&
                years.map(year => {
                    return <option value={year}>{year}</option>;
                })
            );
        }
    };

    handleFilterValues = params => {
        // let isFilterValues = params && params.filters
        // isFilterValues && Object.keys(isFilterValues).map(filter=> console.log("params", filter))
        // console.log("params",isFilterValues &&  isFilterValues[recommendations.code])
        this.setState({
            filterValues: params
        });
    };

    setFilterModal = () => {
        this.setState({
            viewFilterModal: true
        });
    };

    // renderGraphdata = (graphData) => {
    //     console.log("efciSiteData", graphData)
    //     const { startYear, endYear } = this.state

    //     let capital_spending_plans = graphData && graphData.capital_spending_plans &&
    //         graphData.capital_spending_plans.length ? graphData.capital_spending_plans.filter(gd => gd.year >= startYear && gd.year <= endYear) : []
    //     let funding_options = graphData && graphData.funding_options && graphData.funding_options.length ? graphData.funding_options : []
    //     this.setState({
    //         capital_spending_plans,
    //         funding_options
    //     })
    // }

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

    updatePercentage = async (id, value) => {
        //handle csp %
        let tempEfciSiteData = this.state.efciSiteData;
        tempEfciSiteData.capital_spending_plans.map(csp => {
            csp.fundings.map(funding => {
                if (funding.id === id) {
                    funding.percentage = value;
                }
            });
        });
        await this.setState({
            efciSiteData: tempEfciSiteData
        });
    };

    updateSiteCapitalSpending = async (id, percentage) => {
        await this.props.updateCapitalSpendingPlanChart(id, { percentage: percentage });
        await this.getEfciBasedOnSite(this.state.filterValues);
    };

    updateProjectAnnualFunding = async (id, value) => {
        let tempEfciSiteData = this.state.efciSiteData;
        tempEfciSiteData.funding_options.map(f_o => {
            if (f_o.id === id) {
                f_o.funding_cost = value;
            }
        });
        await this.setState({
            efciSiteData: tempEfciSiteData
        });
    };

    updateSiteFundingOption = async (id, fundingCost) => {
        await this.props.updateFundingOptionChart(id, fundingCost);
        await this.getEfciBasedOnSite(this.state.filterValues);
    };

    updateEfciInInitialFundingOptions = async (efci_id, value) => {
        let tempEfciSiteData = this.state.efciSiteData;
        tempEfciSiteData.funding_options.map(f_o => {
            if (f_o.efci_id === efci_id) {
                f_o.efci = value;
            }
        });
        await this.setState({
            efciSiteData: tempEfciSiteData
        });
    };

    updateAnnualEfciCalculation = async (id, value) => {
        let tempEfciSiteData = this.state.efciSiteData;
        tempEfciSiteData.funding_options.map(f_o => {
            f_o.annual_efcis.map(aEfci => {
                if (aEfci.id === id) {
                    aEfci.value = value;
                }
            });
        });
        await this.setState({
            efciSiteData: tempEfciSiteData
        });
    };

    updateFcis = async (id, fci) => {
        await this.props.updateAnnualEfciChart(id, fci);
        await this.getEfciBasedOnSite(this.state.filterValues);
    };

    updateAnnualFundingOptionCalculation = async (id, value) => {
        let tempEfciSiteData = this.state.efciSiteData;
        tempEfciSiteData.funding_options.map(f_o => {
            f_o.annual_funding_options.map(afo => {
                if (afo.id === id) {
                    afo.amount = value;
                }
            });
        });
        await this.setState({
            efciSiteData: tempEfciSiteData
        });
    };

    updateAnnualFundingOption1 = async (id, amount) => {
        await this.props.updateAnnualFundingChart(id, amount);
        await this.getEfciBasedOnSite(this.state.filterValues);
    };

    updateFundingEfciData = async (id, value) => {
        await this.props.updateFundingSiteEfciChart(id, value.value);
        await this.getEfciBasedOnSite(this.state.filterValues);
    };

    updateTotalProjectFunding = async (id, value) => {
        let tempEfciSiteData = this.state.efciSiteData;
        tempEfciSiteData.funding_options.map(f_o => {
            if (f_o.id === id) {
                f_o.expected_cost = value;
            }
        });
        await this.setState({
            efciSiteData: tempEfciSiteData
        });
    };

    updateHiddenFundingOption = async hiddenFundingOptionList => {
        await this.props.hideFundingOptionChart(hiddenFundingOptionList);
        await this.setState({
            hiddenFundingOptionList: this.props.siteReducer.hiddenFundingOptionListChart || []
        });
    };

    handleBuilding = async (e, building, index) => {
        this.setState({
            errorBuilding: false,
            loading: true
        });
        const { buildingArray, buildingIds } = this.state;
        let tempBuilding = buildingIds;
        let tempChecked = buildingArray;
        if (e.target.checked) {
            tempChecked[index].checked = true;
            tempBuilding.push(building.id);
        } else {
            tempBuilding = tempBuilding.filter(bu => bu != building.id);
            if (tempBuilding.length) {
                tempChecked[index].checked = false;
            }
        }
        if (tempBuilding.length) {
            let url_string = window.location.href;
            let url = new URL(url_string);
            let id = this.props.siteId || this.props.buildingId;
            let obj = { id: id, tempBuilding: tempBuilding };
            localStorage.setItem(id, JSON.stringify(obj));
            let params = {
                building_ids: tempBuilding,
                reset: true
            };
            this.setState({
                buildingArray: tempChecked,
                buildingIds: tempBuilding
            });

            await this.props.getEfciBasedOnSite(this.state.filterValues);
            this.setState({
                loading: false
            });
        } else {
            this.setState({
                errorBuilding: true,
                buildingArray,
                buildingIds,
                loading: false
            });
        }
    };

    handleSelectAllBuilding = async e => {
        this.setState({
            errorBuilding: false,
            loading: true
        });
        const { buildingArray, buildingIds } = this.state;
        let tempBuilding = buildingIds;
        let tempChecked = buildingArray;
        if (e.target.checked) {
            tempBuilding = [];
            tempChecked.map((tc, index) => {
                tempChecked[index].checked = true;
                tempBuilding.push(tc.id);
            });
        } else {
            tempBuilding = [];
            tempChecked.map((tc, index) => {
                tempChecked[index].checked = false;
            });
            tempChecked[0].checked = true;
            tempBuilding.push(tempChecked[0].id);
        }
        if (tempBuilding.length) {
            let url_string = window.location.href;
            let url = new URL(url_string);
            let id = this.props.siteId || this.props.buildingId;
            let obj = { id: id, tempBuilding: tempBuilding };
            localStorage.setItem(id, JSON.stringify(obj));
            let params = {
                building_ids: tempBuilding,
                reset: true
            };
            this.setState({
                buildingArray: tempChecked,
                buildingIds: tempBuilding
            });
            await this.props.getEfciBasedOnSite(this.state.filterValues);
            this.setState({
                loading: false
            });
        } else {
            this.setState({
                errorBuilding: true,
                buildingArray,
                buildingIds,
                loading: false
            });
        }
    };

    viewOneBuilding = async (building, index) => {
        this.setState({
            errorBuilding: false,
            loading: true
        });
        const { buildingArray, buildingIds } = this.state;
        let tempBuilding = [];
        let buildingData = [];
        // if (e.target.checked) {
        tempBuilding.push(building.id);
        const { graphDetails } = this.props.buildingReducer;
        this.props.siteReducer.getEfciBySiteGraph &&
            this.props.siteReducer.getEfciBySiteGraph.buildings &&
            this.props.siteReducer.getEfciBySiteGraph.buildings.length &&
            this.props.siteReducer.getEfciBySiteGraph.buildings.map(b => {
                buildingData.push({
                    id: b.id,
                    name: b.name,
                    checked: tempBuilding.length ? (tempBuilding.find(bu => bu == b.id) ? true : false) : true,
                    locked: b.locked
                });
            });

        // // }
        // else {
        //     tempBuilding = tempBuilding.filter(bu => bu != building.id)
        //     const { graphDetails } = this.props.buildingReducer
        //     let buildingData = []
        //     let buildingIds = []
        //     if (this.props.buildingReducer.getEfciByBuildingGraph &&
        //         this.props.buildingReducer.getEfciByBuildingGraph.buildings) {
        //         buildingData.push({
        //             id: this.props.buildingReducer.getEfciByBuildingGraph.buildings.id,
        //             name: this.props.buildingReducer.getEfciByBuildingGraph.buildings.name, checked: true,
        //             locked: this.props.buildingReducer.getEfciByBuildingGraph.buildings.locked
        //         })
        //         buildingIds.push(this.props.buildingReducer.getEfciByBuildingGraph.buildings.id)
        //     }
        //     tempBuilding=tempBuilding,
        //     tempChecked =buildingArray
        //     // this.setState({
        //     //     startYear: graphDetails && graphDetails.start_year,
        //     //     endYear: graphDetails && graphDetails.end_year,
        //     //     buildingArray: buildingData,
        //     //     buildingIds

        //     // })
        //     // if (tempBuilding.length) {
        //     //     tempChecked[index].checked = false
        //     // }

        // }
        if (tempBuilding.length) {
            let url_string = window.location.href;
            let url = new URL(url_string);
            let id = this.props.siteId || this.props.buildingId;
            let obj = { id: id, tempBuilding: tempBuilding };
            localStorage.setItem(id, JSON.stringify(obj));
            let params = {
                building_ids: tempBuilding,
                reset: true
            };
            this.setState({
                buildingArray: buildingData,
                buildingIds: tempBuilding
            });

            await this.props.getEfciBasedOnSite(this.state.filterValues);
            this.setState({
                loading: false
            });
        } else {
            this.setState({
                errorBuilding: true,
                buildingArray,
                buildingIds,
                loading: false
            });
        }
    };

    handleRedirect = id => {
        const {
            location: { search }
        } = this.props;
        const { history } = this.props;
        let url_string = window.location.href;
        let url = new URL(url_string);
        let pid = url.searchParams.get("pid");
        addToBreadCrumpData({
            key: "dashboard",
            name: "Charts & Graphs",
            path: `/building/buildinginfo/${id}/dashboard${search}`
        });

        history.push(`/building/buildinginfo/${id}/dashboard${search}`);
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

    handleLock = async (buildingId, lockValue) => {
        let url_string = window.location.href;
        let url = new URL(url_string);
        let id = url.searchParams.get("pid");
        let chartParams = {
            buildingId: buildingId,
            projectId: id
        };
        this.setState({
            loading: true
        });
        if (this.props.dataView == "building") {
            let params = {
                buildingId: this.props.buildingId,
                projectId: id
            };
            await this.props.updateBuildingEfciLock(!this.state.buildingArray[0].locked);
            await this.props.getChartEfciBuilding(params);
            const { graphDetails } = this.props.buildingReducer;
            let buildingData = [];
            let buildingIds = [];
            if (this.props.buildingReducer.getEfciByBuildingGraph && this.props.buildingReducer.getEfciByBuildingGraph.buildings) {
                buildingData.push({
                    id: this.props.buildingReducer.getEfciByBuildingGraph.buildings.id,
                    name: this.props.buildingReducer.getEfciByBuildingGraph.buildings.name,
                    checked: true,
                    locked: this.props.buildingReducer.getEfciByBuildingGraph.buildings.locked
                });
                buildingIds.push(this.props.buildingReducer.getEfciByBuildingGraph.buildings.id);
            }
            this.setState({
                startYear: graphDetails && graphDetails.start_year,
                endYear: graphDetails && graphDetails.end_year,
                buildingArray: buildingData,
                buildingIds
            });
        } else {
            let params = {
                siteId: this.props.siteId,
                projectId: id
            };
            await this.props.updateBuildingEfciLock(buildingId, lockValue);
            await this.props.getChartEfci(this.props.siteId, { project_id: id });
            // await this.refreshSiteList();
            // this.props.getEfciBasedOnSite(this.state.filterValues);
            const { graphDetails } = this.props.siteReducer;
            let buildingData = [];
            let buildingIds = [];
            this.props.siteReducer.getEfciBySiteGraph &&
                this.props.siteReducer.getEfciBySiteGraph.buildings &&
                this.props.siteReducer.getEfciBySiteGraph.buildings.length &&
                this.props.siteReducer.getEfciBySiteGraph.buildings.map(b => {
                    buildingData.push({ id: b.id, name: b.name, checked: true, locked: b.locked });
                    buildingIds.push(b.id);
                });
            this.setState({
                startYear: graphDetails && graphDetails.start_year,
                endYear: graphDetails && graphDetails.end_year,
                buildingArray: buildingData,
                buildingIds
            });
        }
        this.setState({
            loading: false
        });
    };

    updateLock = async () => {
        let url_string = window.location.href;
        let url = new URL(url_string);
        let id = url.searchParams.get("pid");
        let params = {
            buildingId: this.props.buildingId,
            projectId: id
        };
        await this.props.updateBuildingEfciLock(!this.state.buildingArray[0].locked);
        await this.props.getChartEfciBuilding(params);
        let buildingData = [];
        let buildingIds = [];
        if (this.props.buildingReducer.getEfciByBuildingGraph && this.props.buildingReducer.getEfciByBuildingGraph.buildings) {
            buildingData.push({
                id: this.props.buildingReducer.getEfciByBuildingGraph.buildings.id,
                name: this.props.buildingReducer.getEfciByBuildingGraph.buildings.name,
                checked: true,
                locked: this.props.buildingReducer.getEfciByBuildingGraph.buildings.locked
            });
            buildingIds.push(this.props.buildingReducer.getEfciByBuildingGraph.buildings.id);
        }
        this.setState({
            buildingArray: buildingData,
            buildingIds
        });
    };

    handleChartView = type => {
        switch (type) {
            case "trade": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn3d"
                });
                break;
            }
            case "system": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn3d"
                });
                break;
            }
            case "category": {
                this.setState({
                    currentTab: type,
                    viewContent: "totalView",
                    chartType: "pie3d"
                });
                break;
            }
            case "building": {
                this.setState({
                    currentTab: type,
                    viewContent: "totalView",
                    chartType: "pie3d"
                });
                break;
            }
            case "funding_source": {
                this.setState({
                    currentTab: "funding_source",
                    viewContent: "totalView",
                    chartType: "pie3d"
                });
                break;
            }
            case "priority": {
                this.setState({
                    currentTab: type,
                    viewContent: "detailView",
                    chartType: "stackedcolumn3d"
                });
                break;
            }
            case "all": {
                this.setState({
                    currentTab: "all",
                    viewContent: "totalView"
                    // chartType: "stackedcolumn3d"
                });
                break;
            }
            case "EFCI": {
                this.setState({
                    currentTab: "csp&efci",
                    viewContent: "totalView"
                });
                break;
            }
            case "criticalities": {
                this.setState({
                    currentTab: type,
                    viewContent: "totalView",
                    chartType: "pie3d"
                });
                break;
            }
            case "capital_types": {
                this.setState({
                    currentTab: type,
                    viewContent: "totalView",
                    chartType: "pie3d"
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
        if (this.props.dataView == "site") {
            let chartParams = {
                siteId: this.props.siteId,
                projectId: id
            };
            let params = {
                chart: this.state.currentTab,
                start_year: this.state.startYear,
                end_year: this.state.endYear
            };
            await this.props.getChartExport(chartParams, params);
        } else if (this.props.dataView == "building") {
            let chartParams = {
                buildingId: this.props.buildingId,
                projectId: id
            };
            let params = {
                chart: this.state.currentTab,
                start_year: this.state.startYear,
                end_year: this.state.endYear
            };
            await this.props.getChartExportBuilding(chartParams, params);
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
        let graphData = {};
        const { chart: systemChart } = this.props.dashboardReducer?.getDashboardChart || {};
        let sysetmChart = { system: systemChart };
        switch (this.props.dataView) {
            case "building":
                graphData = this.props.buildingReducer.graphDetails;
                break;
            case "site":
                graphData = this.props.siteReducer.graphDetails;
                break;
            case "region":
                graphData = this.props.regionReducer.graphDetails;
                break;
            case "project":
                graphData = this.props.projectReducer.graphDetails;
                break;
            default:
                break;
        }

        graphData = { ...graphData, charts: { ...graphData?.charts, ...sysetmChart } };
        return graphData;
    };

    renderTabName = () => {
        const { dataView = "" } = this.props;
        switch (dataView) {
            case "project":
                return "Region";
            case "region":
                return "Site";
            case "site":
                return "Building";
            case "building":
                return "Building Addition";
            case "default":
                return "";
            default:
                return "";
        }
    };

    handleChangeSystemChart = async value => {
        let selectedSystem = this.props.projectReducer.getTradeSettingsDropdownResponse?.trades?.find(item => item.id === value);
        this.setState({ selectedSystem });
        const { dataView, siteId, buildingId } = this.props;
        let url_string = window.location.href;
        let url = new URL(url_string);
        let project_id = dataView === "project" ? this.props.projectId : url.searchParams.get("pid");
        let systemParams = {
            chart_type: "proj_fca_chart",
            export_type: "system",
            trade_ids: [value],
            project_ids: [project_id],
            user_id: localStorage.getItem("userId")
        };
        if (dataView === "site") {
            systemParams.site_ids = [siteId];
        } else if (dataView === "building") {
            systemParams.building_ids = [buildingId];
        }
        this.props.getChartsDashboardPython(systemParams);
    };

    renderSystemTradeOptions = () => {
        const system_nodes = this.props.projectReducer.getTradeSettingsDropdownResponse?.trades;
        if (system_nodes?.length) {
            return system_nodes.map(item => <option value={item.id}>{`${item.name} System`}</option>);
        }
    };

    reArrangeTabs = (chart_display_order = []) => {
        const { tabs } = this.state;
        if (chart_display_order?.length) {
            const orderedTabs = [
                tabs.find(tab => tab.key === "all"),
                ...chart_display_order
                    .filter(tabKey => tabKey !== "all")
                    .map(tabKey => {
                        const tab = tabs.find(tab => tab.orderKey === tabKey || tab.key === tabKey);
                        return { ...tab };
                    })
            ];
            this.setState({ tabs: orderedTabs });
        }
    };

    render() {
        const {
            viewContent,
            startYear,
            errorBuilding,
            endYear,
            currentTab,
            viewFilterModal,
            filterValues,
            filterView,
            chartType,
            buildingArray,
            selectedSystem,
            tabs
        } = this.state;
        const {
            efciBuildingData,
            updateCapitalSpendingPercent,
            updateFcis,
            updateFundingOptionEfci,
            updateEfciInInitialFundingOptions,
            updateAnnualFundingOptionCalculation,
            updateAnnualEfciCalculation,
            match: {
                params: { section }
            },
            loading,
            hasChartExport
        } = this.props;
        let graphDetails = {};
        let getEfciBySite = {};

        this.props.dataView == "building"
            ? (getEfciBySite = this.props.buildingReducer.getEfciByBuildingGraph)
            : (getEfciBySite = this.props.siteReducer.getEfciBySiteGraph);
        graphDetails = this.renderGraphData();
        let graphData =
            graphDetails &&
            graphDetails.charts &&
            (currentTab != "csp&efci" ? (currentTab == "all" ? graphDetails.charts : graphDetails.charts[currentTab]) : []);
        let chartSum = 0;
        let sumMerged = [];
        let capital_spending_plans =
            getEfciBySite && getEfciBySite.charts && getEfciBySite.charts.capital_spending_plans && getEfciBySite.charts.capital_spending_plans.length
                ? getEfciBySite.charts.capital_spending_plans.filter(gd => gd.year >= startYear && gd.year <= endYear)
                : [];

        let funding_options =
            getEfciBySite && getEfciBySite.charts && getEfciBySite.charts.funding_options && getEfciBySite.charts.funding_options.length
                ? getEfciBySite.charts.funding_options.map(f => {
                      return {
                          index: f.index,
                          actual_cost: f.actual_cost,
                          funding_cost: f.funding_cost,
                          annual_funding_options:
                              f.annual_funding_options && f.annual_funding_options.filter(gd => gd.year >= startYear && gd.year <= endYear),
                          order: f.order,
                          annual_efcis: f.annual_efcis && f.annual_efcis.filter(gd => gd.year >= startYear && gd.year <= endYear)
                      };
                  })
                : [];
        let filteredData = currentTab == "all" ? {} : [];
        if (currentTab == "all" && graphData) {
            Object.keys(graphData).map((gd, key) => {
                if (Array.isArray(graphData[gd])) {
                    filteredData[gd] =
                        graphData[gd] && graphData[gd].length ? graphData[gd].filter(gd => gd.year >= startYear && gd.year <= endYear) : [];
                    let fiteredBuilding =
                        graphData["building"] && graphData["building"].length
                            ? graphData["building"].filter(gd => gd.year >= startYear && gd.year <= endYear)
                            : [];
                    let sumValue = fiteredBuilding && fiteredBuilding.length ? fiteredBuilding.map(gd => gd.data) : [];
                    sumMerged = [].concat.apply([], sumValue);
                    chartSum = sumMerged.reduce((total, obj) => obj.amount + total, 0);
                    return (filteredData[gd] =
                        graphData[gd] && graphData[gd].length ? graphData[gd].filter(gd => gd.year >= startYear && gd.year <= endYear) : []);
                } else return (filteredData[gd] = graphData[gd]);
            });
        } else {
            filteredData = graphData && graphData.length ? graphData.filter(gd => gd.year >= startYear && gd.year <= endYear) : [];
        }
        let url_string = window.location.href;
        let url = new URL(url_string);
        let id = url.searchParams.get("pid");
        let projectData = graphDetails && graphDetails.charts;
        let noOfYears = endYear - startYear + 1;
        let filterCount = 0;

        filterValues &&
            Object.keys(filterValues).map(f =>
                ((f == "list" && filterValues[f] && typeof filterValues[f] === "object" && Object.entries(filterValues[f]).length != 0) ||
                    (f == "filters" && filterValues[f] && Object.keys(filterValues[f]).find(fi => filterValues[f][fi].key)) ||
                    f == "search") &&
                filterValues[f]
                    ? (filterCount = filterCount + 1)
                    : null
            );
        let chart_display_order = this.props.projectReducer.miscSettingsResponse?.miscellaneous?.chart_display_order || [];
        return (
            <div id={"chartBody"}>
                <div className={`tab-active min-head ${this.state.currentTab === "csp&efci" ? "chart-building" : ""}`}>
                    {viewFilterModal ? (
                        <Portal
                            body={<FilterValue filterValues={filterValues} onCancel={() => this.setState({ viewFilterModal: false })} />}
                            onCancel={() => this.setState({ showViewModal: false })}
                        />
                    ) : null}
                    {this.renderConfirmationModal()}
                    {this.renderConfirmationLoad()}
                    {section === "efciinfo" || this.props.isEfciSandbox ? null : (
                        <div className="min-nav">
                            <ul className={"pl-3"}>
                                {tabs.map(tab => (
                                    <li
                                        key={tab.key}
                                        className={`${this.state.currentTab === tab.key ? "active" : null}`}
                                        onClick={() => this.handleTab(tab.key)}
                                    >
                                        {tab.name}
                                    </li>
                                ))}
                            </ul>
                            <div className="d-flex align-items-center">
                                <HelperIcon
                                    type={"charts_and_graph"}
                                    entity={section === "buildinginfo" ? "building" : "site"}
                                    additoinalClass={"charts_and_graph"}
                                />
                                <a className="nav-link calcicons min-mize" onClick={e => this.toggleFullscreen(e)}>
                                    <img src="/img/restore.svg" alt="" className="set-icon-width" />
                                </a>
                            </div>
                        </div>
                    )}
                    {this.state.currentTab !== "csp&efci" ? (
                        <div className="d-flex min-loc">
                            <div className="year-outer col-md-4">
                                {startYear && (
                                    <div className="col-xl-6 p-0 selecbox-otr">
                                        <label>Start Year</label>
                                        <div className="custom-selecbox">
                                            <select value={startYear} name={"startYear"} onChange={e => this.handleYear(e)}>
                                                {this.renderOptions()}
                                            </select>
                                        </div>
                                    </div>
                                )}
                                {endYear && (
                                    <div className="col-xl-6 p-0 selecbox-otr">
                                        <label>End Year</label>
                                        <div className="custom-selecbox">
                                            <select value={endYear} name={"endYear"} onChange={e => this.handleYear(e)}>
                                                {this.renderOptions()}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {currentTab === "all" && (
                                <h3 className="line">
                                    <span>
                                        {projectData && projectData.project_name ? `${projectData.project_name} - ` : ""}{" "}
                                        {projectData.description ? `${projectData.description} (${projectData.name})` : projectData?.name || ""}{" "}
                                    </span>
                                    {noOfYears ? noOfYears : 0}-Year Capital Spending Plan - {startYear} to {endYear}{" "}
                                </h3>
                            )}
                            <div className="chrt-right-grph">
                                {(currentTab === "all" || currentTab === "system") && selectedSystem?.id && (
                                    <div className="custom-selecbox mr-2">
                                        <select
                                            value={selectedSystem?.id}
                                            name={"system"}
                                            onChange={e => this.handleChangeSystemChart(e.target.value)}
                                        >
                                            {this.renderSystemTradeOptions()}
                                        </select>
                                    </div>
                                )}
                                {currentTab === "all" && (
                                    <>
                                        {" "}
                                        <h4>
                                            <div className="amount">
                                                Total :{" "}
                                                <NumberFormat
                                                    value={parseFloat((chartSum ? chartSum : 1) / 1000000).toFixed(2)}
                                                    suffix={"M"}
                                                    thousandSeparator={true}
                                                    displayType={"text"}
                                                    prefix={"$ "}
                                                />
                                            </div>
                                        </h4>
                                        {filterValues && filterCount != 0 ? (
                                            <div className="view-inner filter-apply filter-numbr mt-4 pr-3" onClick={this.setFilterModal}>
                                                <img
                                                    src=" /img/filter.svg"
                                                    alt=""
                                                    className={"filtrImg"}
                                                    data-tip="Applied Filters"
                                                    data-background-color="#007bff"
                                                    currentitem="false"
                                                />
                                                <div className="arrow-sec"></div>
                                                <span className="notifyTxt">{filterCount}</span>
                                            </div>
                                        ) : null}
                                        {(viewContent === "totalView" || viewContent === "detailView") && this.state.currentTab === "all" ? (
                                            <HelperIcon
                                                type={"charts_and_graph"}
                                                entity={"dashboard"}
                                                additoinalClass={"charts_and_graph_dashboard"}
                                            />
                                        ) : null}
                                    </>
                                )}
                            </div>
                            {currentTab !== "all" ? (
                                <div className="right-section col-md-7">
                                    <div className="min-tab-buttons">
                                        <button
                                            className={`${this.state.viewContent === "tableView" ? "active" : null}`}
                                            onClick={() => this.handleView("tableView")}
                                        >
                                            <i>
                                                <img src="/img/table-view.png" alt="" />
                                            </i>
                                            Table View
                                        </button>
                                        <button
                                            className={`${this.state.viewContent === "totalView" ? "active" : null}`}
                                            onClick={() => this.handleView("totalView")}
                                        >
                                            <i className="fas fa-chart-pie"></i>Summary View{" "}
                                        </button>
                                        <button
                                            className={`${this.state.viewContent === "detailView" ? "active" : null}`}
                                            onClick={() => this.handleView("detailView")}
                                        >
                                            <i>
                                                <img src="/img/detail-view.png" alt="" />
                                            </i>
                                            Detailed View{" "}
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="d-flex min-loc">
                            <div className="year-outer  col-md-4">
                                {startYear && (
                                    <div className="col-xl-6 p-0 selecbox-otr">
                                        <label>Start Year</label>
                                        <div className="custom-selecbox">
                                            <select value={startYear} name={"startYear"} onChange={e => this.handleYear(e)}>
                                                {this.renderOptions()}
                                            </select>
                                        </div>
                                    </div>
                                )}
                                {endYear && (
                                    <div className="col-xl-6 p-0 selecbox-otr">
                                        <label>End Year</label>
                                        <div className="custom-selecbox">
                                            <select value={endYear} name={"endYear"} onChange={e => this.handleYear(e)}>
                                                {this.renderOptions()}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* <div className="year-outer col-md-3">
                                <div className='custom-control custom-switch'>
                                    <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='customSwitches'
                                        value={"csp"}
                                        onChange={(e) => this.handleGraphView(e)}
                                        checked={filterView == "csp" ? true : false}
                                    />
                                    <label className='custom-control-label' htmlFor='customSwitches'>
                                        CSP
                            </label>
                                </div>
                                <div className='custom-control custom-switch '>
                                    <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id='customSwitchesChecked'
                                        value={"efci"}
                                        onChange={(e) => this.handleGraphView(e)}
                                        checked={filterView == "efci" ? true : false}
                                    />
                                    <label className='custom-control-label' htmlFor='customSwitchesChecked'>
                                        EFCI
        </label>
                                </div>
                            </div> */}

                            <div className="right-section">
                                <div className="min-tab-buttons">
                                    <button
                                        className={`${this.state.viewContent === "tableView" ? "active" : null}`}
                                        onClick={() => this.handleView("tableView")}
                                    >
                                        <i>
                                            <img src="/img/table-view.png" alt="" />
                                        </i>
                                        EFCI Sandbox
                                    </button>
                                    <button
                                        className={`${this.state.viewContent === "totalView" ? "active" : null}`}
                                        onClick={() => this.handleView("totalView")}
                                    >
                                        <i>
                                            <img src="/img/detail-view.png" alt="" />
                                        </i>
                                        Detailed View{" "}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {viewContent === "totalView" || viewContent === "detailView" ? (
                    this.state.currentTab === "all" ? (
                        <>
                            <ChartDashboard
                                graphData={filteredData}
                                capital_spending_plans={capital_spending_plans}
                                funding_options={funding_options}
                                handleChartView={this.handleChartView}
                                dataView={this.props.dataView}
                                isLoading={this.state.isLoading}
                                isLoadingEFCI={this.state.isLoadingEFCI}
                                chartDisplayOrder={chart_display_order}
                                selectedSystem={selectedSystem}
                            />
                        </>
                    ) : (
                        <ChartView
                            colorCodes={this.props.colorCodes}
                            exportToXsl={this.exportToXsl}
                            graphData={filteredData}
                            projectData={projectData}
                            loadData={this.loadData}
                            handleChartView={this.handleChartView}
                            efciBuildingData={efciBuildingData}
                            startYear={startYear}
                            endYear={endYear}
                            buildingIds={this.state.buildingIds}
                            currentTab={currentTab}
                            viewContent={viewContent}
                            filterValues={filterValues}
                            capital_spending_plans={capital_spending_plans}
                            setFilterModal={this.setFilterModal}
                            funding_options={funding_options}
                            filterView={filterView}
                            chartType={chartType}
                            handleChart={this.handleChart}
                            resetEfci={this.resetEfci}
                            saveEfci={this.saveEfci}
                            dataView={this.props.dataView}
                            saveData={this.saveData}
                            buildingArray={buildingArray}
                            handleLock={this.handleLock}
                            handleBuilding={this.handleBuilding}
                            viewOneBuilding={this.viewOneBuilding}
                            handleRedirect={this.handleRedirect}
                            errorBuilding={errorBuilding}
                            updateProjectAnnualFundingSite={this.props.updateProjectAnnualFundingSite}
                            efciSiteData={
                                this.props.dataView == "building" ? (getEfciBySite ? efciBuildingData : {}) : getEfciBySite ? getEfciBySite.site : {}
                            }
                            updatePercentage={this.props.updatePercentage}
                            updateSiteCapitalSpending={this.props.updateSiteCapitalSpending}
                            updateProjectAnnualFunding={this.props.updateProjectAnnualFunding}
                            updateSiteFundingOption={this.props.updateSiteFundingOption}
                            updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                            updateAnnualEfciCalculation={this.props.updateAnnualEfciCalculation}
                            updateFcis={this.props.updateFcis}
                            updateAnnualFundingOptionCalculation={this.props.updateAnnualFundingOptionCalculation}
                            updateAnnualFundingOption1={this.props.updateAnnualFundingOption1}
                            updateFundingEfciData={this.props.updateFundingEfciData}
                            updateTotalProjectFunding={this.props.updateTotalProjectFunding}
                            updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                            hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                            updateTotalProjectFundingSite={this.props.updateTotalProjectFundingSite}
                            updateSiteFundingOptionSite={this.props.updateSiteFundingOptionSite}
                            updateFundingEfciDataBuilding={this.props.updateFundingEfciDataBuilding}
                            updateFundingOption1={this.props.updateFundingOption1}
                            updateFundingOptionEfci={updateFundingOptionEfci}
                            loading={this.state.loading}
                            toggleLoader={this.toggleLoader}
                            isLoading={this.state.isLoading}
                            renderConfirmationModal={this.renderConfirmationModal}
                            renderConfirmationLoad={this.renderConfirmationLoad}
                            getFundingOptionLogs={this.props.getFundingOptionLogs}
                            getFundingEfciLog1={this.props.getFundingEfciLog1}
                            getTotalFundingLogs={this.props.getTotalFundingLogs}
                            annualEfciLog={this.props.annualEfciLog}
                            annualEfciLogsLoading={this.props.annualEfciLogsLoading}
                            restoreTotalFundingLog={this.props.restoreTotalFundingLog}
                            deleteEfciLogData={this.props.deleteEfciLogData}
                            sortSiteEfciLog={this.props.sortSiteEfciLog}
                            restoreFundingEFCILog={this.props.restoreFundingEFCILog}
                            sortBuildingEfciLog={this.props.sortBuildingEfciLog}
                            getFundingCostEfciLogs={this.props.getFundingCostEfciLogs}
                            getTotalFundingCostEfciLogs={this.props.getTotalFundingCostEfciLogs}
                            efciLog={this.props.efciLog}
                            restoreFundingCostEfciLog={this.props.restoreFundingCostEfciLog}
                            restoreTotalFundingCostEfciLog={this.props.restoreTotalFundingCostEfciLog}
                            handleSelectAllBuilding={this.handleSelectAllBuilding}
                            logCount={this.props.logCount}
                            logPaginationParams={this.props.logPaginationParams}
                            handlePageClickLogs={this.props.handlePageClickLogs}
                            handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                            hasChartExport={hasChartExport}
                            sectionId={this.props.match.params.id}
                            selectedSystem={selectedSystem}
                            hasGoBackToDashboard={this.props.match.params.section !== "efciinfo" && !this.props.isEfciSandbox}
                        />
                    )
                ) : null}
                {viewContent === "tableView" && this.state.currentTab === "csp&efci" ? (
                    this.props.dataView == "building" ? (
                        <EFCI
                            dataView={this.props.dataView}
                            isChartView={true}
                            loading={loading}
                            updateFcis={updateFcis}
                            basicDetails={this.props.basicDetails}
                            efciBuildingData={efciBuildingData}
                            efciSiteData={this.props.efciSiteData}
                            getEfciBasedOnSite={this.props.getEfciBasedOnSite}
                            loadData={this.props.loadData}
                            saveData={this.props.saveData}
                            updateBuildingEfciLock={this.props.updateBuildingEfciLock}
                            annualEfciLog={this.props.annualEfciLog}
                            annualEfciLogsLoading={this.props.annualEfciLogsLoading}
                            updateFundingOption={this.props.updateFundingOption}
                            updateFcisSite={this.props.updateFcisSite}
                            updateFundingPercentage={this.props.updateFundingPercentage}
                            updateFundingOptionEfci={this.props.updateFundingOptionEfci}
                            hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                            updateTotalProjectFunding={this.props.updateTotalProjectFunding}
                            updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                            updateFundingOption1={this.props.updateFundingOption1}
                            updateAnnualFundingOption={this.props.updateAnnualFundingOptions}
                            updateProjectAnnualFunding={this.props.updateProjectAnnualFunding}
                            hideFundingOptionSite={this.props.hideFundingOptionSite}
                            updateFundingEfciData={this.props.updateFundingEfciData}
                            updateAnnualEfciCalculation={updateAnnualEfciCalculation}
                            // updateBuildingEfciLock={this.props.updateBuildingEfciLock}
                            updateCapitalSpendingPercent={updateCapitalSpendingPercent}
                            hideFundingOptionSiteList={this.props.hideFundingOptionSiteList}
                            updateSiteFundingOptionSite={this.props.updateSiteFundingOptionSite}
                            updateEfciInInitialFundingOptions={updateEfciInInitialFundingOptions}
                            updateTotalProjectFundingSite={this.props.updateTotalProjectFundingSite}
                            updateAnnualFundingOptionSite={this.props.updateAnnualFundingOptionSite}
                            updateProjectAnnualFundingSite={this.props.updateProjectAnnualFundingSite}
                            updateAnnualFundingOptionCalculation={updateAnnualFundingOptionCalculation}
                            updateAnnualEfciCalculationSite={this.props.updateAnnualEfciCalculationSite}
                            updateEfciInInitialFundingOptionsSite={this.props.updateEfciInInitialFundingOptionsSite}
                            updateAnnualFundingOptionCalculationSite={this.props.updateAnnualFundingOptionCalculationSite}
                            efciLog={this.props.efciLog}
                            getCSPLogs={this.props.getCSPLogs}
                            restoreCSP={this.props.restoreCSP}
                            getFundingCostLogs={this.props.getFundingCostLogs}
                            restoreFundingCostLog={this.props.restoreFundingCostLog}
                            getFundingCostEfciLogs={this.props.getFundingCostEfciLogs}
                            restoreFundingCostEfciLog={this.props.restoreFundingCostEfciLog}
                            // getFundingCostEfciLogs={this.props.getFundingCostEfciLogs}
                            restoreTotalFundingCostEfciLog={this.props.restoreTotalFundingCostEfciLog}
                            getAnnualFundingOptionLogs={this.props.getAnnualFundingOptionLogs}
                            restoreAnnualFundingOptionLog={this.props.restoreAnnualFundingOptionLog}
                            getAnnualEFCILogs={this.props.getAnnualEFCILogs}
                            restoreAnnualEFCILogs={this.props.restoreAnnualEFCILogs}
                            getSiteAnnualEfciColumnLogs={this.props.getSiteAnnualEfciColumnLogs}
                            restoreSiteAnnualEfciCalculation={this.props.restoreSiteAnnualEfciCalculation}
                            getSiteAnnualFundingCalculationColumnLogs={this.props.getSiteAnnualFundingCalculationColumnLogs}
                            restoreSiteAnnualFundingOption={this.props.restoreSiteAnnualFundingOption}
                            getSiteFundingOptionLogs={this.props.getSiteFundingOptionLogs}
                            restoreSiteFundingOptionLog={this.props.restoreSiteFundingOptionLog}
                            getSiteFundingEfciLog={this.props.getSiteFundingEfciLog}
                            restoreSiteFundingEFCILog={this.props.restoreSiteFundingEFCILog}
                            getSiteTotalFundingLogs={this.props.getSiteTotalFundingLogs}
                            restoreSiteTotalFundingLog={this.props.restoreSiteTotalFundingLog}
                            getTotalFundingCostEfciLogs={this.props.getTotalFundingCostEfciLogs}
                            deleteEfciLogData={this.props.deleteEfciLogData}
                            restoreAnnualFundingOption={this.props.restoreAnnualFundingOption}
                            getFundingOptionLogs={this.props.getFundingOptionLogs}
                            getFundingEfciLog1={this.props.getFundingEfciLog1}
                            getAnnualFundingCalculationColumnLogs={this.props.getAnnualFundingCalculationColumnLogs}
                            getAnnualEfciColumnLogs={this.props.getAnnualEfciColumnLogs}
                            getTotalFundingLogs={this.props.getTotalFundingLogs}
                            restoreTotalFundingLog={this.props.restoreTotalFundingLog}
                            sortBuildingEfciLog={this.props.sortBuildingEfciLog}
                            restoreFundingEFCILog={this.restoreFundingEFCILog}
                            efciLoading={this.props.efciLoading}
                            colorCodes={this.props.colorCodes}
                            logCount={this.props.logCount}
                            logPaginationParams={this.props.logPaginationParams}
                            handlePageClickLogs={this.props.handlePageClickLogs}
                            handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                        />
                    ) : (
                        <EFCISite
                            efciByRegion={this.props.efciByRegion}
                            efciSiteData={this.props.dataView == "building" ? efciBuildingData : this.props.efciSiteData}
                            dataView={this.props.dataView}
                            isChartView={true}
                            updatePercentage={this.props.updatePercentage}
                            updateSiteCapitalSpending={this.props.updateSiteCapitalSpending}
                            updateProjectAnnualFunding={this.props.updateProjectAnnualFunding}
                            updateSiteFundingOption={this.props.updateSiteFundingOption}
                            updateAnnualEfciCalculation={this.props.updateAnnualEfciCalculation}
                            updateFcis={this.props.updateFcis}
                            updateAnnualFundingOptionCalculation={this.props.updateAnnualFundingOptionCalculation}
                            updateAnnualFundingOption1={this.props.updateAnnualFundingOption1}
                            updateEfciInInitialFundingOptions={this.props.updateEfciInInitialFundingOptions}
                            updateFundingEfciData={this.props.updateFundingEfciData}
                            updateTotalProjectFunding={this.props.updateTotalProjectFunding}
                            updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                            hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                            basicDetails={this.props.basicDetails}
                            updateLock={this.updateLock}
                            annualEfciLog={this.props.annualEfciLog}
                            annualEfciLogsLoading={this.props.annualEfciLogsLoading}
                            efciLog={this.props.efciLog}
                            getCSPLogs={this.props.getCSPLogs}
                            restoreCSP={this.props.restoreCSP}
                            getFundingCostLogs={this.props.getFundingCostLogs}
                            restoreFundingCostLog={this.props.restoreFundingCostLog}
                            getFundingCostEfciLogs={this.props.getFundingCostEfciLogs}
                            restoreFundingCostEfciLog={this.props.restoreFundingCostEfciLog}
                            // getFundingCostEfciLogs={this.props.getFundingCostEfciLogs}
                            restoreTotalFundingCostEfciLog={this.props.restoreTotalFundingCostEfciLog}
                            getAnnualFundingOptionLogs={this.props.getAnnualFundingOptionLogs}
                            restoreAnnualFundingOptionLog={this.props.restoreAnnualFundingOptionLog}
                            getAnnualEFCILogs={this.props.getAnnualEFCILogs}
                            restoreAnnualEFCILogs={this.props.restoreAnnualEFCILogs}
                            getSiteAnnualEfciColumnLogs={this.props.getSiteAnnualEfciColumnLogs}
                            restoreSiteAnnualEfciCalculation={this.props.restoreSiteAnnualEfciCalculation}
                            getSiteAnnualFundingCalculationColumnLogs={this.props.getSiteAnnualFundingCalculationColumnLogs}
                            restoreSiteAnnualFundingOption={this.props.restoreSiteAnnualFundingOption}
                            getSiteFundingOptionLogs={this.props.getSiteFundingOptionLogs}
                            restoreSiteFundingOptionLog={this.props.restoreSiteFundingOptionLog}
                            getSiteFundingEfciLog={this.props.getSiteFundingEfciLog}
                            restoreSiteFundingEFCILog={this.props.restoreSiteFundingEFCILog}
                            getSiteTotalFundingLogs={this.props.getSiteTotalFundingLogs}
                            restoreSiteTotalFundingLog={this.props.restoreSiteTotalFundingLog}
                            getTotalFundingCostEfciLogs={this.props.getTotalFundingCostEfciLogs}
                            deleteEfciLogData={this.props.deleteEfciLogData}
                            getFundingOptionLogs={this.props.getFundingOptionLogs}
                            restoreAnnualFundingOption={this.props.restoreAnnualFundingOption}
                            getFundingEfciLog1={this.props.getFundingEfciLog1}
                            getAnnualFundingCalculationColumnLogs={this.props.getAnnualFundingCalculationColumnLogs}
                            getAnnualEfciColumnLogs={this.props.getAnnualEfciColumnLogs}
                            getTotalFundingLogs={this.props.getTotalFundingLogs}
                            restoreTotalFundingLog={this.props.restoreTotalFundingLog}
                            sortSiteEfciLog={this.props.sortSiteEfciLog}
                            restoreFundingOptionLog={this.props.restoreFundingOptionLog}
                            restoreFundingEFCILog={this.props.restoreFundingEFCILog}
                            restoreAnnualEfciCalculation={this.props.restoreAnnualEfciCalculation}
                            getColorCode={this.props.getColorCode}
                            colorCodes={this.props.colorCodes}
                            efciLoading={this.props.efciLoading}
                            showLog={this.props.showLog}
                            updateSiteEfciLock={this.props.updateSiteEfciLock}
                            handleRegionEfciFundingCost={this.props.handleRegionEfciFundingCost}
                            updateRegionEfciFundingCost={this.props.updateRegionEfciFundingCost}
                            handleRegionFundingCostEfci={this.props.handleRegionFundingCostEfci}
                            updateRegionFundingEfci={this.props.updateRegionFundingEfci}
                            handleRegionAnnualFundingOption={this.props.handleRegionAnnualFundingOption}
                            updateRegionAnnualFunding={this.props.updateRegionAnnualFunding}
                            handleRegionAnnualEfci={this.props.handleRegionAnnualEfci}
                            updateRegionAnnualEFCI={this.props.updateRegionAnnualEFCI}
                            // updateSiteEfciLock={this.props.updateSiteEfciLock}
                            forceUpdateData={this.props.forceUpdateData}
                            logCount={this.props.logCount}
                            logPaginationParams={this.props.logPaginationParams}
                            handlePageClickLogs={this.props.handlePageClickLogs}
                            handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                        />
                    )
                ) : viewContent === "tableView" ? (
                    <div className="tab-active pt-3 recomdn-table bg-grey-table">
                        <Recommendations
                            projectIdDashboard={id}
                            isChartView={true}
                            siteId={this.props.siteId}
                            regionId={this.props.regionId}
                            handleFilterValues={this.handleFilterValues}
                            dataView={this.props.dataView}
                            buildingIdDashboard={this.props.buildingId}
                            projectIdChart={this.props.projectId}
                            restoreTotalFundingLog={this.props.restoreTotalFundingLog}
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { siteReducer, recommendationsReducer, buildingReducer, regionReducer, projectReducer, dashboardReducer } = state;
    return { siteReducer, recommendationsReducer, buildingReducer, regionReducer, projectReducer, dashboardReducer };
};
let { getChartsDashboardPython } = dashboardActions;

export default withRouter(
    connect(mapStateToProps, { ...regionActions, ...buildingAction, ...siteActions, ...projectActions, getChartsDashboardPython })(Dashboard)
);
