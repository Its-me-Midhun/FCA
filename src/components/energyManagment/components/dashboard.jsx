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

import ChartView from "./chartView";
import regionActions from "../../region/actions";
import siteActions from "../../site/actions";
import projectActions from "../../project/actions";
import Recommendations from "../../recommendations/index";
import buildingAction from "../../building/actions";
import Portal from "../../common/components/Portal";
import FilterValue from "../../site/components/FilterValues";
import BootstrapSwitchButton from "bootstrap";
import EFCIMain from "../../common/components/CommonEFCI/EFCIMain";
import ReactTooltip from "react-tooltip";
import { siteTableData } from "../../../config/tableData";
import qs from "query-string";
import Loader from "../../common/components/Loader";
import LoadingOverlay from "react-loading-overlay";
import ChartDashboard1 from "./chartDashboard1";
import ChartDashboard2 from "./chartDashboard2";
import NumberFormat from "react-number-format";
import InfoSubTab from "../../common/components/infoSubTab";
import { addToBreadCrumpData, resetBreadCrumpData, popBreadCrumpData, findPrevPathFromBreadCrumpData } from "../../../config/utils";

import Topfilter from "./topFilter";
import { futureCapitalTableData, differedMaintenanceTableData } from "../../../config/tableData";

import ConfirmationModal from "../../common/components/ConfirmationModal";
import { withRouter } from "react-router-dom";
import { API_ROUTE } from "../../../config/constants";
import HelperIcon from "../../helper/components/HelperIcon";

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
            infoSubTabs: [
                {
                    key: "all",
                    name: "Dashboard",
                    path: `/site/siteinfo/${this.props.siteId}/dashboard/all?info=true&pid=${new URL(window.location.href).searchParams.get("pid")}`
                },
                {
                    key: "Electricity",
                    name: "Electricity",
                    path: `/site/siteinfo/${this.props.siteId}/dashboard/trade?info=true&pid=${new URL(window.location.href).searchParams.get("pid")}`
                },
                {
                    key: "category",
                    name: "Category",
                    path: `/site/siteinfo/${this.props.siteId}/dashboard/category?info=true&pid=${new URL(window.location.href).searchParams.get(
                        "pid"
                    )}`
                },
                {
                    key: "building",
                    name: "Building",
                    path: `/site/siteinfo/${this.props.siteId}/dashboard/building?info=true&pid=${new URL(window.location.href).searchParams.get(
                        "pid"
                    )}`
                },
                {
                    key: "funding_source",
                    name: "Funding Source",
                    path: `/site/siteinfo/${this.props.siteId}/dashboard/fundingSource?info=true&pid=${new URL(window.location.href).searchParams.get(
                        "pid"
                    )}`
                },
                {
                    key: "proprity",
                    name: "Priority",
                    path: `/site/siteinfo/${this.props.siteId}/dashboard/proprity?info=true&pid=${new URL(window.location.href).searchParams.get(
                        "pid"
                    )}`
                },
                {
                    key: "csp&efci",
                    name: "CSP & EFCI",
                    path: `/site/siteinfo/${this.props.siteId}/csp&efci${new URL(window.location.href).searchParams.get("pid")}`
                }
            ],
            wildCardFilterParams: this.props.siteReducer.entityParams.wildCardFilterParams,
            filterParams: this.props.siteReducer.entityParams.filterParams,
            efciSiteData: {},
            hiddenFundingOptionList: [],

            currentTab: this.props.match.params.section === "efciinfo" ? "csp&efci" : "dashboard1",
            viewContent: "totalView",
            startYear: null,
            endYear: null,
            filterValues: this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params,
            viewFilterModal: false,
            filterView: "both",
            chartType: null,
            showConfirmModal: false,
            showConfirmModalLoad: false,
            checkedArray: [],
            errorBuilding: null,
            loading: false,
            building_ids: this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.building_ids
        };
    }

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
        let id = this.props.dataView == "project" ? this.props.projectId : url.searchParams.get("pid");
        let entityId = this.props.projectId || this.props.regionId;
        const { dataView } = this.props;
        this.setState({
            isLoading: true,
            isLoadingEFCI: true
        });
        if (dataView == "region") {
            let params = {
                siteId: this.props.regionId,
                projectId: id
            };
            let tempCheckedValues = JSON.parse(localStorage.getItem(entityId));

            let tempCheckedData = [];
            if (tempCheckedValues && id == tempCheckedValues.id) {
                tempCheckedData = tempCheckedValues ? (tempCheckedValues[this.props.dataView] ? tempCheckedValues[this.props.dataView] : []) : [];
            }
            const { graphDetails } = this.props.regionReducer;
            let checkedData = [];
            let checkedIds = [];
            this.props.regionReducer.getEfciBySiteGraph &&
                this.props.regionReducer.getEfciBySiteGraph.region &&
                this.props.regionReducer.getEfciBySiteGraph.region.sites &&
                this.props.regionReducer.getEfciBySiteGraph.region.sites.length &&
                this.props.regionReducer.getEfciBySiteGraph.region.sites.map(b => {
                    checkedData.push({
                        id: b.id,
                        name: b.name,
                        checked: tempCheckedData.length ? (tempCheckedData.find(bu => bu == b.id) ? true : false) : true,
                        locked: b.locked
                    });
                    checkedIds.push(b.id);
                });
            this.setState({
                startYear: graphDetails && graphDetails.start_year,
                endYear: graphDetails && graphDetails.end_year,
                checkedArray: checkedData,
                checkedIds: tempCheckedData.length ? tempCheckedData : checkedIds,
                isLoadingEFCI: false
            });
        } else if (dataView == "project") {
            let chartParams = {
                projectId: this.props.projectId
            };
            let params = {
                ...this.state.filterValues,
                project_id: id
            };
            let tempCheckedValues = JSON.parse(localStorage.getItem(entityId));
            let tempCheckedData = [];
            if (tempCheckedValues && entityId == tempCheckedValues.id) {
                tempCheckedData = tempCheckedValues ? (tempCheckedValues[this.props.dataView] ? tempCheckedValues[this.props.dataView] : []) : [];
            }

            const { graphDetails } = this.props.projectReducer;
            let checkedData = [];
            let checkedIds = [];
            this.props.projectReducer.getEfciBySiteGraph &&
                this.props.projectReducer.getEfciBySiteGraph.region &&
                this.props.projectReducer.getEfciBySiteGraph.region.regions &&
                this.props.projectReducer.getEfciBySiteGraph.region.regions.length &&
                this.props.projectReducer.getEfciBySiteGraph.region.regions.map(b => {
                    checkedData.push({
                        id: b.id,
                        name: b.name,
                        checked: tempCheckedData.length ? (tempCheckedData.find(bu => bu == b.id) ? true : false) : true,
                        locked: b.locked
                    });
                    checkedIds.push(b.id);
                });

            this.setState({
                startYear: graphDetails && graphDetails.start_year,
                endYear: graphDetails && graphDetails.end_year,
                checkedArray: checkedData,
                checkedIds: tempCheckedData.length ? tempCheckedData : checkedIds,
                isLoadingEFCI: false
            });
        }
        // this.setState({
        //     isLoading: false
        // })
    };

    componentDidUpdate = async (prevProps, prevState) => {
        const { efciBuildingData } = this.props.buildingReducer;
        let url_string = window.location.href;
        let url = new URL(url_string);
        let id = this.props.dataView == "project" ? this.props.projectId : url.searchParams.get("pid");
        let entityId = this.props.projectId || this.props.regionId;

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

        //project

        if (this.props.dataView == "project" && prevProps.projectReducer.graphDetails != this.props.projectReducer.graphDetails) {
            this.setState({
                isLoading: false
            });

            let tempCheckedValues = JSON.parse(localStorage.getItem(entityId));

            let tempCheckedData = [];
            if (tempCheckedValues && entityId == tempCheckedValues.id) {
                tempCheckedData = tempCheckedValues ? (tempCheckedValues[this.props.dataView] ? tempCheckedValues[this.props.dataView] : []) : [];
            }
            const { graphDetails } = this.props.projectReducer;
            let checkedData = [];
            let checkedIds = [];

            // if (this.props.projectReducer.getEfciBySiteGraph &&
            //     this.props.projectReducer.getEfciBySiteGraph.region &&
            //     this.props.projectReducer.getEfciBySiteGraph.region.regions) {
            //     this.props.projectReducer.getEfciBySiteGraph.region.regions.map(bd => {
            //         return checkedData.push({
            //             id: bd.id,
            //             name: bd.name,
            //             checked: tempCheckedData.length ? tempCheckedData.find(bu => bu == bd.id)
            //                 ? true : false : true,
            //             // locked: this.props.regionReducer.getEfciBySiteGraph.region.sites.locked
            //         }),
            //             checkedIds.push(bd.id)
            //     }
            //     )

            // }

            this.setState({
                startYear: graphDetails && graphDetails.start_year,
                endYear: graphDetails && graphDetails.end_year
                // checkedArray: checkedData,
                // checkedIds:tempCheckedData.length ? tempCheckedData : checkedIds,
            });
        }
        if (this.props.dataView == "project" && prevProps.projectReducer.getEfciBySiteGraph != this.props.projectReducer.getEfciBySiteGraph) {
            let params = {
                buildingId: this.props.buildingId,
                projectId: id
            };
            // await this.props.getChartsBuilding(params, this.state.filterValues)
            // await this.props.getChartEfciBuilding(params)
            this.setState({
                isLoadingEFCI: true
            });
            let tempCheckedValues = JSON.parse(localStorage.getItem(entityId));
            let tempCheckedData = [];
            if (tempCheckedValues && entityId == tempCheckedValues.id) {
                tempCheckedData = tempCheckedValues ? (tempCheckedValues[this.props.dataView] ? tempCheckedValues[this.props.dataView] : []) : [];
            }
            const { graphDetails } = this.props.projectReducer;
            let checkedData = [];
            let checkedIds = [];
            if (
                this.props.projectReducer.getEfciBySiteGraph &&
                this.props.projectReducer.getEfciBySiteGraph.region &&
                this.props.projectReducer.getEfciBySiteGraph.region.regions
            ) {
                this.props.projectReducer.getEfciBySiteGraph.region.regions.map(bd => {
                    return (
                        checkedData.push({
                            id: bd.id,
                            name: bd.name,
                            checked: tempCheckedData.length ? (tempCheckedData.find(bu => bu == bd.id) ? true : false) : true
                            // locked: this.props.regionReducer.getEfciBySiteGraph.region.sites.locked
                        }),
                        checkedIds.push(bd.id)
                    );
                });
            }

            this.setState({
                startYear: graphDetails && graphDetails.start_year,
                endYear: graphDetails && graphDetails.end_year,
                checkedArray: checkedData,
                checkedIds: tempCheckedData.length ? tempCheckedData : checkedIds,
                isLoadingEFCI: false
            });
        }

        //region
        if (this.props.dataView == "region" && prevProps.regionReducer.graphDetails != this.props.regionReducer.graphDetails) {
            let params = {
                buildingId: this.props.buildingId,
                projectId: id
            };
            // await this.props.getChartsBuilding(params, this.state.filterValues)
            // await this.props.getChartEfciBuilding(params)
            this.setState({
                isLoading: false
            });

            let tempCheckedValues = JSON.parse(localStorage.getItem(entityId));
            let tempCheckedData = [];
            if (tempCheckedValues && entityId == tempCheckedValues.id) {
                tempCheckedData = tempCheckedValues ? (tempCheckedValues[this.props.dataView] ? tempCheckedValues[this.props.dataView] : []) : [];
            }
            // await this.props.getChartData(params, this.state.filterValues)
            // await this.props.getChartEfci(this.props.siteId, { project_id: id })

            // await this.refreshSiteList();
            // await this.props.getEfciBasedOnSite(this.state.filterValues);

            const { graphDetails } = this.props.regionReducer;
            // let checkedData = []
            // let checkedIds = []
            // this.props.regionReducer.getEfciByProject &&
            //     this.props.projectReducer.getEfciByProject.region &&
            //     this.props.projectReducer.getEfciByProject.region.sites &&
            //     this.props.projectReducer.getEfciByProject.region.sites.length
            //     && this.props.projectReducer.getEfciByProject.region.sites.map(b => {
            //         checkedData.push({
            //             id: b.id, name: b.name, checked: tempCheckedData.length ? tempCheckedData.find(bu => bu == b.id)
            //                 ? true : false : true, locked: b.locked
            //         })
            //         checkedIds.push(b.id)
            //     })

            // const { graphDetails } = this.props.regionReducer
            // let checkedData = []
            // let checkedIds = []
            // if (this.props.regionReducer.getEfciBySiteGraph &&
            //     this.props.regionReducer.getEfciBySiteGraph.buildings) {
            //     checkedData.push({
            //         id: this.props.regionReducer.getEfciBySiteGraph.buildings.id,
            //         name: this.props.regionReducer.getEfciBySiteGraph.buildings.name, checked: true,
            //         locked: this.props.regionReducer.getEfciBySiteGraph.buildings.locked
            //     })
            //     checkedIds.push(this.props.regionReducer.getEfciBySiteGraph.buildings.id)
            // }
            this.setState({
                startYear: graphDetails && graphDetails.start_year,
                endYear: graphDetails && graphDetails.end_year
                // checkedArray: checkedData,
                // checkedIds:tempCheckedData.length ? tempCheckedData : checkedIds,
            });
        }
        if (this.props.dataView == "region" && prevProps.regionReducer.getEfciBySiteGraph != this.props.regionReducer.getEfciBySiteGraph) {
            let params = {
                buildingId: this.props.buildingId,
                projectId: id
            };
            // await this.props.getChartsBuilding(params, this.state.filterValues)
            // await this.props.getChartEfciBuilding(params)
            this.setState({
                isLoading: false
            });
            let tempCheckedValues = JSON.parse(localStorage.getItem(entityId));
            let tempCheckedData = [];
            if (tempCheckedValues && entityId == tempCheckedValues.id) {
                tempCheckedData = tempCheckedValues ? (tempCheckedValues[this.props.dataView] ? tempCheckedValues[this.props.dataView] : []) : [];
            }

            const { graphDetails } = this.props.regionReducer;
            let checkedData = [];
            let checkedIds = [];
            if (
                this.props.regionReducer.getEfciBySiteGraph &&
                this.props.regionReducer.getEfciBySiteGraph.region &&
                this.props.regionReducer.getEfciBySiteGraph.region.sites
            ) {
                this.props.regionReducer.getEfciBySiteGraph.region.sites.map(bd => {
                    return (
                        checkedData.push({
                            id: bd.id,
                            name: bd.name,
                            checked: tempCheckedData.length ? (tempCheckedData.find(bu => bu == bd.id) ? true : false) : true
                            // locked: this.props.regionReducer.getEfciBySiteGraph.region.sites.locked
                        }),
                        checkedIds.push(bd.id)
                    );
                });
            }

            this.setState({
                startYear: graphDetails && graphDetails.start_year,
                endYear: graphDetails && graphDetails.end_year,
                checkedArray: checkedData,
                checkedIds: tempCheckedData.length ? tempCheckedData : checkedIds,
                isLoadingEFCI: false
            });
        }
        // 6
    };

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
        if (this.props.dataView == "region") {
            let params = {
                buildingId: this.props.buildingId,
                projectId: id
            };
            await this.props.loadDataRegion(params);
            this.setState({ showConfirmModalLoad: false });
            //await this.props.getChartEfciBuilding(params)
            await this.setState({
                alertMessage:
                    this.props.regionReducer.loadEfciChart && this.props.regionReducer.loadEfciChart.success
                        ? this.props.regionReducer.loadEfciChart.message
                        : "Error occured while loading!!"
            });
        } else {
            await this.props.loadData(this.props.projectId);
            this.setState({ showConfirmModalLoad: false });
            // await this.props.getChartEfci(this.props.siteId, { project_id: id })
            await this.setState({
                alertMessage:
                    this.props.projectReducer.loadEfciChart && this.props.projectReducer.loadEfciChart.success
                        ? this.props.projectReducer.loadEfciChart.message
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
    };

    handleView = viewData => {
        this.setState({
            viewContent: viewData,
            chartType: this.state.viewContent === "totalView" && this.state.chartType != "csp&efci" ? "pie2d" : "stackedcolumn2d"
        });
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

    handleCheck = async (e, checkData, index) => {
        this.setState({
            errorBuilding: false,
            loading: true
        });
        const { checkedArray, checkedIds } = this.state;
        let tempCheckValue = checkedIds;

        let tempChecked = checkedArray;
        if (e.target.checked) {
            tempChecked[index].checked = true;
            tempCheckValue.push(checkData.id);
        } else {
            tempCheckValue = tempCheckValue.filter(bu => bu != checkData.id);
            if (tempCheckValue.length) {
                tempChecked[index].checked = false;
            }
        }
        if (tempCheckValue.length) {
            let url_string = window.location.href;
            let url = new URL(url_string);
            let id = this.props.dataView == "project" ? this.props.projectId : url.searchParams.get("pid");
            let entityId = this.props.projectId || this.props.regionId;

            let obj = { id: entityId, [this.props.dataView]: tempCheckValue };
            localStorage.setItem(entityId, JSON.stringify(obj));
            this.setState({
                checkedArray: tempChecked,
                checkedIds: tempCheckValue
            });
            let params = {};
            if (this.props.dataView == "project") {
                params = {
                    region_ids: tempCheckValue,
                    reset: true
                };
                await this.props.getEfciBasedOnProject(this.state.filterValues);
            } else {
                params = {
                    site_ids: tempCheckValue,
                    reset: true
                };
                await this.props.getEfciBasedOnRegion(this.state.filterValues);
            }

            this.setState({
                loading: false
            });
        } else {
            this.setState({
                errorBuilding: true,
                checkedArray,
                checkedIds,
                loading: false
            });
        }
    };

    handleSelectAllBuilding = async e => {
        this.setState({
            errorBuilding: false,
            loading: true
        });
        const { checkedArray, checkedIds } = this.state;
        let tempCheckValue = checkedIds;
        let tempChecked = checkedArray;
        if (e.target.checked) {
            tempCheckValue = [];
            tempChecked.map((tc, index) => {
                tempChecked[index].checked = true;
                tempCheckValue.push(tc.id);
            });
        } else {
            tempCheckValue = [];
            tempChecked.map((tc, index) => {
                tempChecked[index].checked = false;
            });
            tempChecked[0].checked = true;
            tempCheckValue.push(tempChecked[0].id);
        }
        if (tempCheckValue.length) {
            let url_string = window.location.href;
            let url = new URL(url_string);
            let id = this.props.dataView == "project" ? this.props.projectId : url.searchParams.get("pid");
            let entityId = this.props.projectId || this.props.regionId;
            let obj = { id: entityId, [this.props.dataView]: tempCheckValue };
            localStorage.setItem(entityId, JSON.stringify(obj));
            let params = {};
            if (this.props.dataView == "project") {
                params = {
                    region_ids: tempCheckValue,
                    reset: true
                };
                await this.props.getEfciBasedOnProject(this.state.filterValues);
            } else if (this.props.dataView == "region") {
                params = {
                    site_ids: tempCheckValue,
                    reset: true
                };
                await this.props.getEfciBasedOnRegion(this.state.filterValues);
            }

            this.setState({
                checkedArray: tempChecked,
                checkedIds: tempCheckValue
            });

            this.setState({
                loading: false
            });
        } else {
            this.setState({
                errorBuilding: true,
                checkedArray,
                checkedIds,
                loading: false
            });
        }
    };

    viewOneData = async (building, index) => {
        this.setState({
            errorBuilding: false,
            loading: true
        });
        const { checkedArray, checkedIds } = this.state;
        let tempCheckValue = [];
        let checkedData = [];
        tempCheckValue.push(building.id);
        const { graphDetails } = this.props.buildingReducer;
        let entityId = this.props.projectId || this.props.regionId;

        if (tempCheckValue.length) {
            let url_string = window.location.href;
            let url = new URL(url_string);
            let id = this.props.dataView == "project" ? this.props.projectId : url.searchParams.get("pid");
            let entityId = this.props.projectId || this.props.regionId;
            let obj = { id: entityId, [this.props.dataView]: tempCheckValue };
            localStorage.setItem(entityId, JSON.stringify(obj));
            let params = {};
            let tempCheckedValues = JSON.parse(localStorage.getItem(entityId));
            let tempCheckedData = [];

            if (tempCheckedValues && entityId == tempCheckedValues.id) {
                tempCheckedData = tempCheckedValues ? (tempCheckedValues[this.props.dataView] ? tempCheckedValues[this.props.dataView] : []) : [];
            }
            if (this.props.dataView == "project") {
                this.props.projectReducer.getEfciBySiteGraph &&
                    this.props.projectReducer.getEfciBySiteGraph.region &&
                    this.props.projectReducer.getEfciBySiteGraph.region.regions &&
                    this.props.projectReducer.getEfciBySiteGraph.region.regions.length &&
                    this.props.projectReducer.getEfciBySiteGraph.region.regions.map(b => {
                        checkedData.push({
                            id: b.id,
                            name: b.name,
                            checked: tempCheckedData.length ? (tempCheckedData.find(bu => bu == b.id) ? true : false) : true,
                            locked: b.locked
                        });
                        checkedIds.push(b.id);
                    });

                params = {
                    region_ids: tempCheckValue,
                    reset: true
                };
                this.setState({
                    checkedArray: checkedData,
                    checkedIds: tempCheckValue
                });

                await this.props.getEfciBasedOnProject(this.state.filterValues);
            } else if (this.props.dataView == "region") {
                if (
                    this.props.regionReducer.getEfciBySiteGraph &&
                    this.props.regionReducer.getEfciBySiteGraph.region &&
                    this.props.regionReducer.getEfciBySiteGraph.region.sites
                ) {
                    this.props.regionReducer.getEfciBySiteGraph.region.sites.map(bd => {
                        return (
                            checkedData.push({
                                id: bd.id,
                                name: bd.name,
                                checked: true
                                // locked: this.props.regionReducer.getEfciBySiteGraph.region.sites.locked
                            }),
                            checkedIds.push(bd.id)
                        );
                    });
                }
                params = {
                    site_ids: tempCheckValue,
                    reset: true
                };
                await this.props.getEfciBasedOnRegion(this.state.filterValues);
            }
            // this.setState({
            //     checkedArray: checkedData,
            //     checkedIds: tempCheckValue,

            // })

            this.setState({
                loading: false
            });
        } else {
            this.setState({
                errorBuilding: true,
                checkedArray,
                checkedIds,
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
            await this.props.updateBuildingEfciLock(!this.state.checkedArray[0].locked);
            await this.props.getChartEfciBuilding(params);
            const { graphDetails } = this.props.buildingReducer;
            let checkedData = [];
            let checkedIds = [];
            if (this.props.buildingReducer.getEfciByBuildingGraph && this.props.buildingReducer.getEfciByBuildingGraph.buildings) {
                checkedData.push({
                    id: this.props.buildingReducer.getEfciByBuildingGraph.buildings.id,
                    name: this.props.buildingReducer.getEfciByBuildingGraph.buildings.name,
                    checked: true,
                    locked: this.props.buildingReducer.getEfciByBuildingGraph.buildings.locked
                });
                checkedIds.push(this.props.buildingReducer.getEfciByBuildingGraph.buildings.id);
            }
            this.setState({
                startYear: graphDetails && graphDetails.start_year,
                endYear: graphDetails && graphDetails.end_year,
                checkedArray: checkedData,
                checkedIds
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
            let checkedData = [];
            let checkedIds = [];
            this.props.siteReducer.getEfciBySiteGraph &&
                this.props.siteReducer.getEfciBySiteGraph.buildings &&
                this.props.siteReducer.getEfciBySiteGraph.buildings.length &&
                this.props.siteReducer.getEfciBySiteGraph.buildings.map(b => {
                    checkedData.push({ id: b.id, name: b.name, checked: true, locked: b.locked });
                    checkedIds.push(b.id);
                });
            this.setState({
                startYear: graphDetails && graphDetails.start_year,
                endYear: graphDetails && graphDetails.end_year,
                checkedArray: checkedData,
                checkedIds
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
        await this.props.updateBuildingEfciLock(!this.state.checkedArray[0].locked);
        await this.props.getChartEfciBuilding(params);
        let checkedData = [];
        let checkedIds = [];
        if (this.props.buildingReducer.getEfciByBuildingGraph && this.props.buildingReducer.getEfciByBuildingGraph.buildings) {
            checkedData.push({
                id: this.props.buildingReducer.getEfciByBuildingGraph.buildings.id,
                name: this.props.buildingReducer.getEfciByBuildingGraph.buildings.name,
                checked: true,
                locked: this.props.buildingReducer.getEfciByBuildingGraph.buildings.locked
            });
            checkedIds.push(this.props.buildingReducer.getEfciByBuildingGraph.buildings.id);
        }
        this.setState({
            checkedArray: checkedData,
            checkedIds
        });
    };

    handleChartView = type => {
        switch (type) {
            case "Electricity": {
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
            case "EFCI": {
                this.setState({
                    currentTab: "csp&efci",
                    viewContent: "totalView"
                });
                break;
            }
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
                return this.props.regionReducer.graphDetails;
            case "project":
                return this.props.projectReducer.graphDetails;
        }
    };

    handleFilterView = async name => {
        const { dashboardFilterParams } = this.state;
        if (name == "consultancy") {
            await this.props.getConsultancyFilter(dashboardFilterParams);
        } else if (name == "client") {
            await this.props.getClientFilter(dashboardFilterParams);
        } else if (name == "project") {
            await this.props.getProjectFilter(dashboardFilterParams);
        } else if (name == "region") {
            await this.props.getRegionFilter(dashboardFilterParams);
        } else if (name == "site") {
            await this.props.getSiteFilter(dashboardFilterParams);
        } else if (name == "buildingType") {
            await this.props.getBuildingTypeFilter(dashboardFilterParams);
        } else if (name == "building") {
            await this.props.getBuildingFilter(dashboardFilterParams);
        } else if (name == "colorScale") {
            await this.props.getColorFilter(dashboardFilterParams);
        }
    };

    render() {
        const { viewContent, startYear, errorBuilding, endYear, currentTab, viewFilterModal, filterValues, filterView, chartType, checkedArray } =
            this.state;
        const {
            efciBuildingData,
            updateCapitalSpendingPercent,
            updateAnnualFundingOptions,
            updateFcis,
            updateFundingOption,
            updateFundingOptionEfci,
            updateFundingPercentage,
            updateHiddenFundingOption,
            hiddenFundingOptionList,
            updateProjectAnnualFunding,
            updateEfciInInitialFundingOptions,
            updateTotalProjectFunding,
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

        this.props.dataView == "region"
            ? (getEfciBySite = this.props.regionReducer.getEfciBySiteGraph)
            : (getEfciBySite = this.props.projectReducer.getEfciBySiteGraph);
        graphDetails = this.renderGraphData();
        let graphData =
            graphDetails &&
            graphDetails.charts &&
            (currentTab != "csp&efci" ? (currentTab == "all" ? graphDetails.charts : graphDetails.charts[currentTab]) : []);
        let chartSum = 0;
        let sumMerged = [];
        let capital_spending_plans = [];
        getEfciBySite &&
            getEfciBySite.region &&
            getEfciBySite.region.charts &&
            Object.keys(getEfciBySite.region.charts).map(cs => capital_spending_plans.push({ year: cs, amount: getEfciBySite.region.charts[cs] }));

        capital_spending_plans =
            capital_spending_plans && capital_spending_plans.filter(gd => parseInt(gd.year) >= startYear && parseInt(gd.year) <= endYear);
        let funding_options = [];
        if (getEfciBySite && getEfciBySite.region && getEfciBySite.region && getEfciBySite.region.annual_fundings) {
            Object.keys(getEfciBySite.region.annual_fundings).map(fo =>
                funding_options.push({
                    index: `Funding Option ${getEfciBySite.region.annual_fundings[fo][0].index}`,
                    annual_funding_options:
                        getEfciBySite.region.annual_fundings[fo] &&
                        getEfciBySite.region.annual_fundings[fo].map(gd => {
                            return { year: gd.year, amount: gd.amount };
                        }),
                    annual_efcis:
                        getEfciBySite.region.annual_fcis[fo] &&
                        getEfciBySite.region.annual_fcis[fo].map(gd => {
                            return { year: gd.year, value: gd.value };
                        }),
                    order: getEfciBySite.region.annual_fundings[fo][0].index
                    // actual_cost: "486970.0",
                    // funding_cost: "25630"
                })
            );
        }

        // getEfciBySite && getEfciBySite.charts && getEfciBySite.charts.funding_options
        //     && getEfciBySite.charts.funding_options.length ? getEfciBySite.charts.funding_options.map(f => {
        //         return {
        //             index: f.index, actual_cost: f.actual_cost, funding_cost: f.funding_cost, annual_funding_options: f.annual_funding_options && f.annual_funding_options.filter(gd => gd.year >= startYear && gd.year <= endYear)
        //             , order: f.order, annual_efcis: f.annual_efcis && f.annual_efcis.filter(gd => gd.year >= startYear && gd.year <= endYear)
        //         }
        //     })
        //     : []
        let filteredData = currentTab === "dashboard1" ? {} : [];

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
        console.log("filterezxzxdData", filteredData);

        funding_options =
            funding_options && funding_options.length
                ? funding_options.map(fo => {
                      return {
                          ...fo,
                          annual_efcis:
                              fo.annual_efcis && fo.annual_efcis.length
                                  ? fo.annual_efcis.filter(gd => gd.year >= startYear && gd.year <= endYear)
                                  : [],
                          annual_funding_options:
                              fo.annual_funding_options && fo.annual_funding_options.length
                                  ? fo.annual_funding_options.filter(gd => gd.year >= startYear && gd.year <= endYear)
                                  : []
                      };
                  })
                : [];

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
                    {section === "efciinfo" ? null : (
                        <div className="min-nav">
                            <ul className={"pl-3"}>
                                {/* <InfoSubTab infoSubTabs={this.state.infoSubTabs}
                                        handleTab={this.handleTab}
                                        currentTab={this.state.currentTab} /> */}
                                {/* 0 */}

                                <li
                                    className={`${this.state.currentTab === "dashboard1" ? "active" : null}`}
                                    onClick={() => this.handleTab("dashboard1")}
                                >
                                    Dashboard 1
                                </li>
                                <li
                                    className={`${this.state.currentTab === "dashboard2" ? "active" : null}`}
                                    onClick={() => this.handleTab("dashboard2")}
                                >
                                    Dashboard 2
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
                    )}
                    {this.state.currentTab != "csp&efci" ? (
                        <div className="d-flex min-loc">{currentTab != "all" ? <Topfilter handleFilterView={this.handleFilterView} /> : null}</div>
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
                    this.state.currentTab === "dashboard1" ? (
                        <>
                            <ChartDashboard1
                                graphData={filteredData}
                                capital_spending_plans={capital_spending_plans}
                                funding_options={funding_options}
                                handleChartView={this.handleChartView}
                                dataView={this.props.dataView}
                                isLoading={this.state.isLoading}
                                isLoadingEFCI={this.state.isLoadingEFCI}
                                filterValues={filterValues}
                            />
                        </>
                    ) : (
                        <ChartDashboard2
                            graphData={filteredData}
                            capital_spending_plans={capital_spending_plans}
                            funding_options={funding_options}
                            handleChartView={this.handleChartView}
                            dataView={this.props.dataView}
                            isLoading={this.state.isLoading}
                            isLoadingEFCI={this.state.isLoadingEFCI}
                            filterValues={filterValues}
                        />
                    )
                ) : null}
                {viewContent === "tableView" && this.state.currentTab === "csp&efci" ? (
                    this.props.dataView == "project" ? (
                        <EFCIMain
                            efciRegionData={this.props.efciRegionData}
                            entityName={this.props.entityName}
                            efciLoading={this.props.efciLoading}
                            colorCodes={this.props.colorCodes}
                            entity={this.props.entity}
                            mainEntity={""}
                            hideMainEntity={true}
                            handleCspSummary={this.props.handleCspSummary}
                            updateCspSummary={this.props.updateCspSummary}
                            handleAnnualEfci={this.props.handleAnnualEfci}
                            updateAnnualEFCI={this.props.updateAnnualEFCI}
                            updateAnnualFundingOption={this.props.updateAnnualFundingOption}
                            handleAnnualFundingOption={this.props.handleAnnualFundingOption}
                            handleFundingCostEfci={this.props.handleFundingCostEfci}
                            updateFundingCostEfci={this.props.updateFundingCostEfci}
                            handleFundingCostData={this.props.handleFundingCostData}
                            updateFundingCostData={this.props.updateFundingCostData}
                            showLog={this.props.showLog}
                            updateEfciLock={this.props.updateEfciLock}
                            forceUpdateData={this.props.forceUpdateData}
                            isChartView={true}
                            logCount={this.props.logCount}
                            logPaginationParams={this.props.logPaginationParams}
                            handlePageClickLogs={this.props.handlePageClickLogs}
                            handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                            updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                            hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                        />
                    ) : (
                        <EFCIMain
                            isChartView={true}
                            entity={this.props.entity}
                            mainEntity={this.props.mainEntity}
                            entityName={this.props.entityName}
                            colorCodes={this.props.colorCodes}
                            efciLoading={this.props.efciLoading}
                            efciRegionData={this.props.efciRegionData}
                            handleAnnualEfci={this.props.handleAnnualEfci}
                            updateAnnualEFCI={this.props.updateAnnualEFCI}
                            updateAnnualFundingOption={this.props.updateAnnualFundingOption}
                            handleAnnualFundingOption={this.props.handleAnnualFundingOption}
                            handleFundingCostEfci={this.props.handleFundingCostEfci}
                            updateFundingCostEfci={this.props.updateFundingCostEfci}
                            handleFundingCostData={this.props.handleFundingCostData}
                            updateFundingCostData={this.props.updateFundingCostData}
                            handleCspSummary={this.props.handleCspSummary}
                            updateCspSummary={this.props.updateCspSummary}
                            efciMainEntityData={this.props.efciMainEntityData}
                            updateMainEntityAnnualEFCI={this.props.updateMainEntityAnnualEFCI}
                            handleMainEntityAnnualEfci={this.props.handleMainEntityAnnualEfci}
                            handleMainEntityAnnualFundingOption={this.props.handleMainEntityAnnualFundingOption}
                            updateMainEntityAnnualFunding={this.props.updateMainEntityAnnualFunding}
                            handleMainEntityEfciFundingCost={this.props.handleMainEntityEfciFundingCost}
                            updateMainEntityEfciFundingCost={this.props.updateMainEntityEfciFundingCost}
                            handleMainEntityFundingCostEfci={this.props.handleMainEntityFundingCostEfci}
                            updateMainEntityFundingEfci={this.props.updateMainEntityFundingEfci}
                            showLog={this.props.showLog}
                            updateEfciLock={this.props.updateEfciLock}
                            forceUpdateData={this.props.forceUpdateData}
                            logCount={this.props.logCount}
                            logPaginationParams={this.props.logPaginationParams}
                            handlePageClickLogs={this.props.handlePageClickLogs}
                            handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                            updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                            hiddenFundingOptionList={this.props.hiddenFundingOptionList}
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

export default withRouter(connect(mapStateToProps, { ...regionActions, ...siteActions, ...projectActions })(Dashboard));
