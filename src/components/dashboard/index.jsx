import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import TopFilter from "./components/topFilter";
import ChartSection from "./components/chartDetails";
import dashboardAction from "./actions";
import Loader from "../common/components/Loader";
import buildingAction from "../building/actions";
import siteAction from "../site/actions";
import regionAction from "../region/actions";
import projectActions from "../project/actions";
import recomentationActions from "../recommendations/actions";
import Portal from "../common/components/Portal";
import FilterModal from "./components/filterModal";
import ColorModal from "./components/colorCodeModal";
import userAction from "../user/actions";
import history from "../../config/history";
import HorizontalDetails from "./components/horizontalData";
import ChartPopUp from "./components/chartDataPopUp";
import { unSubscribeDevice } from "../../config/firebase";

class index extends Component {
    state = {
        horizontalParams: {},
        isLoading: false,
        chartParams: {
            chart_type: "categories"
        },
        dashboardFilterParams: {},
        enableFilter: false,
        chartLoader: null,
        fci_params: null,
        individualFilters: {
            chart_type: "categories",
            fci_type: "regions",
            display: "region",
            horizontal_chart_type: "categories",
            map_type: "site",
            map_mode: "silver",
            chart_sort_by: "value",
            chart_sort_order: null,
            fci_sort_by: "value",
            fci_sort_order: null,
            reco_type: "with_recommmendation"
        },
        showFilterModal: false,
        totalCsp: 0,
        isCodeLoading: false,
        colorCodes: [],
        fciSortName: false,
        fciSortValue: false,
        horizontalSortName: false,
        horizontalSortValue: false,
        filterNames: [],
        colorCodeDetails: {},
        isFullScreen: this.props.dashboardReducer.isFullScreen,
        showHorizontalData: false,
        showChartData: false,
        horizontalSubData: {},
        horizontalChartDta: {},
        fciDataDetails: {},
        chartData: {},
        chartSubData: {},
        historyPaginationParams: this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.historyPaginationParams,
        historyParams: this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.historyParams,
        dropDown: false
    };

    componentDidMount = async () => {
        let test = this.props.dashboardReducer.filterContents || [];
        let backUpNames = this.props.dashboardReducer.backUpNames;
        let backUpValues = this.props.dashboardReducer.backUpValues;
        // let testFilters = this.props.dashboardReducer.filterValues
        let limitedArray = ["Building", "Capital Type", "Site", "Region", "FCA Project", "Year"];
        test = test && test.length && test.filter(t => limitedArray.indexOf(t.name) === -1);

        if (test && backUpNames) {
            test = test.concat(backUpNames);
        }
        // this.props.dashboardReducer.filterContents && this.props.dashboardReducer.filterContents.length
        //    && this.props.dashboardReducer.filterContents.map((fc =>
        //       console.log("testdscsdcfs", fc,)))
        let dashboardFilterParams = {
            ...this.props.dashboardReducer.filterValues,
            ...backUpValues,
            chart_type: this.props.dashboardReducer.filterValues.chart_type || "categories",
            fci_type: this.props.dashboardReducer.filterValues.fci_type || "regions",
            display: this.props.dashboardReducer.filterValues.display || "region",
            horizontal_chart_type: this.props.dashboardReducer.filterValues.horizontal_chart_type || "categories",
            map_type: this.props.dashboardReducer.filterValues.map_type || "site",
            map_mode: this.props.dashboardReducer.filterValues.map_mode || "silver",
            chart_sort_by: this.props.dashboardReducer.filterValues.chart_sort_by || "value",
            chart_sort_order: this.props.dashboardReducer.filterValues.chart_sort_order || null,
            fci_sort_by: this.props.dashboardReducer.filterValues.fci_sort_by || "value",
            fci_sort_order: this.props.dashboardReducer.filterValues.fci_sort_order || null,
            reco_type: this.props.dashboardReducer.filterValues.reco_type || "with_recommmendation"
        };
        await this.props.modifyFilter(test, this.props.dashboardReducer.filterValues, {});
        this.setState(
            {
                dashboardFilterParams,
                filterNames: test || [],
                individualFilters: {
                    chart_type: this.props.dashboardReducer.filterValues.chart_type || "categories",
                    fci_type: this.props.dashboardReducer.filterValues.fci_type || "regions",
                    display: this.props.dashboardReducer.filterValues.display || "region",
                    horizontal_chart_type: this.props.dashboardReducer.filterValues.horizontal_chart_type || "categories",
                    map_type: this.props.dashboardReducer.filterValues.map_type || "site",
                    map_mode: this.props.dashboardReducer.filterValues.map_mode || "silver",
                    chart_sort_by: this.props.dashboardReducer.filterValues.chart_sort_by || "value",
                    chart_sort_order: this.props.dashboardReducer.filterValues.chart_sort_order || null,
                    fci_sort_by: this.props.dashboardReducer.filterValues.fci_sort_by || "value",
                    fci_sort_order: this.props.dashboardReducer.filterValues.fci_sort_order || null,
                    reco_type: this.props.dashboardReducer.filterValues.reco_type || "with_recommmendation"
                }
            },
            async () => {
                await this.getTradeDropdown();
                await this.props.getDashboard(this.state.dashboardFilterParams);
                // get system charts (python side)
                this.getSystemCharts();
            }
        );
        if (this.props.dashboardReducer.popUpData) {
            this.setState({
                ...this.props.dashboardReducer.popUpData
            });
        }
        // await this.props.modifyFilter()
    };
    getSystemCharts = async () => {
        const { chart_type, horizontal_chart_type, display } = this.state.individualFilters;
        const user_id = localStorage.getItem("userId");
        if (chart_type?.split("_")[0] === "system") {
            const project_ids = [this.props.dashboardReducer?.getDashboard?.chart[0]?.project_id];
            let params = {
                chart_type: "fca_chart",
                export_type: "system",
                trade_ids: [chart_type?.split("_")[1]],
                project_ids,
                user_id,
                ...this.getSystemChartParams()
            };
            await this.props.getChartsDashboardPython(params);
        }
        if (horizontal_chart_type?.split("_")[0] === "system") {
            const project_ids = [this.props.dashboardReducer?.getDashboard?.chart[0]?.project_id];
            let params = {
                chart_type: "horizontal_chart",
                horizontal_chart_type: "system",
                trade_ids: [horizontal_chart_type?.split("_")[1]],
                project_ids,
                display,
                user_id,
                ...this.getSystemChartParams()
            };
            await this.props.getChartsDashboardPython(params);
        }
    };

    handleMapModeChange = async value => {
        this.setState({
            dashboardFilterParams: {
                ...this.state.dashboardFilterParams,
                map_mode: value
            },
            individualFilters: {
                ...this.state.individualFilters,
                map_mode: value
            }
        });
    };

    getTradeDropdown = async () => {
        const default_project = localStorage.getItem("default_project");
        const { dashboardFilterParams } = this.state;
        const projectId = !dashboardFilterParams?.project_ids?.length
            ? [default_project]
            : dashboardFilterParams?.project_ids?.length === 1
            ? dashboardFilterParams?.project_ids
            : null;
        if (projectId) {
            await this.props.getTradeSettingsDropdown(projectId);
        }
    };
    handleMapChange = async (e, name, type) => {
        let params = {};
        let value = ["chart", "horizontal_chart", "fci_charts", "recommendation", "map"].includes(name) ? e : e.target?.value;
        if (name === "chart") {
            this.setState({
                chartParams: {
                    chart_type: value
                },
                dashboardFilterParams: {
                    ...this.state.dashboardFilterParams,
                    chart_type: value
                },
                individualFilters: {
                    ...this.state.individualFilters,
                    chart_type: value
                },
                chartLoader: "chart"
            });
            if (value?.split("_") && value?.split("_")[0] === "system") {
                const project_ids = [this.props.dashboardReducer?.getDashboard?.chart[0]?.project_id];
                params = {
                    chart_type: "fca_chart",
                    export_type: "system",
                    trade_ids: [value?.split("_")[1]],
                    project_ids,
                    user_id: localStorage.getItem("userId"),
                    ...this.getSystemChartParams()
                };
                await this.props.getChartsDashboardPython(params);
            } else {
                params = {
                    ...this.state.dashboardFilterParams,
                    chart_type: value
                };
                await this.props.getChartsDashboard(params);
            }
            // await this.props.modifyFilter(params)
            this.setState({
                chartLoader: null
            });
        } else if (name === "map") {
            params = {
                ...this.state.dashboardFilterParams,
                map_type: value
            };
            this.setState({
                chartLoader: "map",
                dashboardFilterParams: {
                    ...this.state.dashboardFilterParams,
                    map_type: value
                },
                individualFilters: {
                    ...this.state.individualFilters,
                    map_type: value
                }
            });
            await this.props.getMap(params);
            this.setState({
                chartLoader: null
            });
        } else if (name === "recommendation") {
            params = {
                ...this.state.dashboardFilterParams,
                reco_type: value
            };
            this.setState({
                chartLoader: "map",
                dashboardFilterParams: {
                    ...this.state.dashboardFilterParams,
                    reco_type: value
                },
                individualFilters: {
                    ...this.state.individualFilters,
                    reco_type: value
                }
            });
            await this.props.getMap(params);
            this.setState({
                chartLoader: null
            });
        } else if (name === "horizontal_chart") {
            const { horizontalParams } = this.state;
            params = {
                ...this.state.dashboardFilterParams,
                ...horizontalParams,
                [type]: value
            };
            await this.setState({
                horizontalParams: params,
                dashboardFilterParams: {
                    ...horizontalParams,
                    ...this.state.dashboardFilterParams,
                    [type]: value
                },
                individualFilters: {
                    ...horizontalParams,
                    ...this.state.individualFilters,
                    [type]: value
                },
                chartLoader: "horizontal_chart"
            });
            if (params?.horizontal_chart_type?.split("_") && params?.horizontal_chart_type?.split("_")[0] === "system") {
                const project_ids = [this.props.dashboardReducer?.getDashboard?.chart[0]?.project_id];
                const systemParams = {
                    chart_type: "horizontal_chart",
                    horizontal_chart_type: "system",
                    trade_ids: [params?.horizontal_chart_type?.split("_")[1]],
                    project_ids,
                    display: params.display,
                    user_id: localStorage.getItem("userId"),
                    ...this.getSystemChartParams()
                };
                await this.props.getHorizontalChartPython(systemParams);
            } else {
                await this.props.getHorizontalChart(params);
            }
            this.setState({
                chartLoader: null
            });
        } else if (name === "fci_charts") {
            const { fci_params } = this.state;
            params = {
                ...this.state.dashboardFilterParams,
                ...fci_params,
                [type]: value
            };
            this.setState({
                horizontalParams: params,
                dashboardFilterParams: {
                    ...this.state.dashboardFilterParams,
                    ...fci_params,
                    [type]: value
                },
                individualFilters: {
                    ...this.state.individualFilters,
                    ...fci_params,
                    [type]: value
                },
                chartLoader: "fci_params"
            });
            await this.props.getFciChart(params);
            this.setState({
                chartLoader: null
            });
        }
    };

    getSystemChartParams = () => {
        const { dashboardFilterParams } = this.state;
        const { getBuildingTypeFilter } = this.props.dashboardReducer;
        let params = {};
        const building_type_ids =
            getBuildingTypeFilter?.building_types
                ?.filter(item => dashboardFilterParams?.building_types?.some(elm => elm === item.name))
                .map(item => item.id) || [];
        params.consultrancy_ids = dashboardFilterParams.consultancy_ids || [];
        params.client_ids = dashboardFilterParams.client_ids || [];
        params.region_ids = dashboardFilterParams.region_ids || [];
        params.site_ids = dashboardFilterParams.site_ids || [];
        params.building_ids = dashboardFilterParams.building_ids || [];
        params.building_types = building_type_ids.length ? building_type_ids : [];
        params.color_scale = dashboardFilterParams.fci_color || [];
        params.start = dashboardFilterParams.start_year;
        params.end = dashboardFilterParams.end_year;
        params.infrastructure_requests = dashboardFilterParams.infrastructure_requests || [];
        return params;
    };

    handleFilter = async (name, value, nameValue, text, isUpdate) => {
        const {
            filterNames,
            dashboardFilterParams: { chart_type, horizontal_chart_type }
        } = this.state;
        let tempNames = filterNames || [];
        let isOject = filterNames && filterNames.length && filterNames.find(f => f.name === text);
        if (name === "project_ids") {
            this.toggleSecondChartView("");
            // resetting chart type if project changed and selected chart type is system
            if (chart_type?.split("_")[0] === "system") {
                await this.setState({
                    dashboardFilterParams: {
                        ...this.state.dashboardFilterParams,
                        chart_type: "categories"
                    },
                    individualFilters: {
                        ...this.state.individualFilters,
                        chart_type: "categories"
                    }
                });
            }
            if (horizontal_chart_type?.split("_")[0] === "system") {
                await this.setState({
                    dashboardFilterParams: {
                        ...this.state.dashboardFilterParams,
                        horizontal_chart_type: "categories"
                    },
                    individualFilters: {
                        ...this.state.individualFilters,
                        horizontal_chart_type: "categories"
                    }
                });
            }
        }
        if (isOject) {
            // if (nameValue && nameValue.length) {
            tempNames.forEach((tv, key) => {
                if (tv.name === text) {
                    tempNames[key] = { name: text, value: nameValue };
                }
            });
            // }
        } else {
            tempNames.push({ name: text, value: nameValue });
        }
        if (name === "year") {
            this.setState(
                {
                    dashboardFilterParams: {
                        ...this.state.dashboardFilterParams,
                        start_year: value.start,
                        end_year: value.end,
                        update_fci: isUpdate
                    },
                    filterNames: tempNames,
                    enableFilter: true
                },
                async () => {
                    await this.props.getDashboard(this.state.dashboardFilterParams);
                    this.getSystemCharts();
                    this.props.modifyFilter(this.state.filterNames, this.state.dashboardFilterParams);
                }
            );
        } else {
            this.setState(
                {
                    dashboardFilterParams: {
                        ...this.state.dashboardFilterParams,
                        [name]: value
                    },
                    enableFilter: true
                },
                async () => {
                    await this.props.getDashboard(this.state.dashboardFilterParams);
                    this.getSystemCharts();
                    this.props.modifyFilter(this.state.filterNames, this.state.dashboardFilterParams);
                }
            );
        }

        // if (name == "consultrancy_ids") {
        //    await this.props.getClientFilter({ [name]: value })
        // }
        // else if (name == "client_ids") {
        //    await this.props.getProjectFilter({ [name]: value })
        //    await this.props.getBuildingTypeFilter({ [name]: value })
        // }
        // else if (name == "project_ids") {
        //    await this.props.getRegionFilter({ [name]: value })
        // }
        // else if (name == "region_ids") {
        //    await this.props.getSiteFilter({ [name]: value })
        // }
        // else if (name == "site_ids") {
        //    await this.props.getBuildingFilter({ [name]: value })
        // }
        // else if (name == "building_types") {
        //    await this.props.getBuildingFilter({
        //       [name]: value,
        //       project_ids: dashboardFilterParams.project_ids,
        //       site_ids: dashboardFilterParams.site_ids
        //    })
        // }
    };

    applyFilter = async () => {
        await this.props.getDashboard(this.state.dashboardFilterParams);
        await this.props.modifyFilter(this.state.filterNames, this.state.dashboardFilterParams);
    };

    clearAllFilter = async () => {
        this.setState({
            dashboardFilterParams: {
                individualFilters: this.state.individualFilters
            },
            enableFilter: false,
            // individualFilters: {
            //    fci_type: "categories",
            //    display: "building",
            //    horizontal_chart_type: "categories",
            //    map_type: "site",
            //    chart_type: "categories",
            //    chart_sort_by: "value",
            //    chart_sort_order: null,
            //    fci_sort_by: "value",
            //    fci_sort_order: null
            // },

            filterNames: []
        });
        await this.props.getDashboard(this.state.individualFilters);
        await this.props.modifyFilter();
    };

    resetDashboard = async () => {
        await this.setState({
            dashboardFilterParams: {},
            enableFilter: false,
            individualFilters: {
                fci_type: "regions",
                display: "region",
                horizontal_chart_type: "categories",
                map_type: "site",
                map_mode: "silver",
                chart_type: "categories",
                chart_sort_by: "value",
                chart_sort_order: null,
                fci_sort_by: "value",
                fci_sort_order: null,
                reco_type: "with_recommmendation"
            },
            horizontalParams: {
                fci_type: "regions",
                display: "region",
                horizontal_chart_type: "categories",
                map_type: "site",
                map_mode: "silver",
                chart_type: "categories",
                chart_sort_by: "value",
                chart_sort_order: null,
                fci_sort_by: "value",
                fci_sort_order: null,
                reco_type: "with_recommmendation"
            },
            filterNames: []
        });

        await this.props.getDashboard(this.state.individualFilters);

        await this.props.modifyFilter();
    };

    filterFcaChart = async (sortValue, sortOrder) => {
        this.setState({
            chartLoader: "fci_charts"
        });

        let params = {
            ...this.state.dashboardFilterParams,
            fci_sort_by: sortValue,
            fci_sort_order: sortOrder ? "asc" : "desc"
        };
        await this.props.getFciChart(params);
        this.setState({
            dashboardFilterParams: {
                ...this.state.fci_params,
                ...this.state.dashboardFilterParams,
                fci_sort_by: sortValue,
                fci_sort_order: sortOrder ? "asc" : "desc"
            },
            individualFilters: {
                ...this.state.individualFilters,
                ...this.state.fci_params,
                fci_sort_by: sortValue,
                fci_sort_order: sortOrder ? "asc" : "desc"
            },
            chartLoader: null,
            fciSortName: sortValue === "name" && !this.state.fciSortName,
            fciSortValue: sortValue === "value" && !this.state.fciSortValue
        });
    };

    filterHorizontalChart = async (sortValue, sortOrder) => {
        this.setState({
            chartLoader: "horizontal_chart"
        });
        let params = {
            ...this.state.horizontalParams,
            ...this.state.dashboardFilterParams,
            chart_sort_by: sortValue,
            chart_sort_order: sortOrder ? "asc" : "desc"
        };
        await this.props.getHorizontalChart(params);
        this.setState({
            dashboardFilterParams: {
                ...this.state.dashboardFilterParams,
                chart_sort_by: sortValue,
                chart_sort_order: sortOrder ? "asc" : "desc"
            },
            individualFilters: {
                ...this.state.horizontalParams,
                ...this.state.individualFilters,
                chart_sort_by: sortValue,
                chart_sort_order: sortOrder ? "asc" : "desc"
            },
            chartLoader: null,
            horizontalSortName: sortValue === "name" && !this.state.horizontalSortName,
            horizontalSortValue: sortValue === "value" && !this.state.horizontalSortValue
        });
    };

    openFilterModal = () => {
        this.setState({
            showFilterModal: true
        });
    };

    renderFilterModal = () => {
        const { showFilterModal } = this.state;
        if (!showFilterModal) return null;
        return (
            <Portal
                body={<FilterModal onCancel={() => this.setState({ showFilterModal: false })} filterValues={this.state.filterNames} />}
                onCancel={() => this.setState({ showFilterModal: false })}
            />
        );
    };

    renderColorModal = () => {
        const { showColorModal } = this.state;
        if (!showColorModal) return null;
        const { getAllLegents } = this.props.dashboardReducer;
        return (
            <Portal
                body={
                    <ColorModal
                        colorCodes={getAllLegents ? getAllLegents.color_codes : []}
                        onCancel={() => {
                            this.setState({ showColorModal: false });
                            this.cancelModal();
                        }}
                    />
                }
                onCancel={() => {
                    this.setState({ showColorModal: false });
                    this.cancelModal();
                }}
            />
        );
    };

    cancelModal = async () => {
        //  await this.props.savePopUpData({})
    };

    componentDidUpdate = async prevProps => {
        if (this.state.isCodeLoading && prevProps.getAllLegents !== this.props.dashboardReducer.getAllLegents) {
            if (this.props.dashboardReducer.getAllLegents) {
                const { getAllLegents } = this.props.dashboardReducer;

                this.setState({
                    showColorModal: true,
                    isCodeLoading: false,
                    colorCodes: getAllLegents ? getAllLegents.color_codes : []
                });
            }
        }

        if (prevProps.dashboardReducer.filterContents !== this.props.dashboardReducer.filterContents) {
            this.setState({
                filterNames: this.props.dashboardReducer.filterContents,
                dashboardFilterParams: this.props.dashboardReducer.filterValues
            });
        }
        if (prevProps.dashboardReducer.filterValues?.project_ids !== this.props.dashboardReducer.filterValues?.project_ids) {
            this.getTradeDropdown();
        }
    };
    handleViewLegent = async (data, param, current, currentSite, isSelectedOne) => {
        console.log({ data, param, current, currentSite, isSelectedOne });
        let fullData = data;
        let dataDetails = null;
        let barDetails = {
            building_type: data.building_type,
            building: data.name,
            hospital_name: data.hospital_name,
            project_name: data.project_name || data.name,
            project_id: data.project_id,
            DM_ID: data.DM_ID
        };

        await this.props.getAllLegents(param);
        const { getAllLegents } = this.props.dashboardReducer;
        dataDetails = {
            showColorModal: true,
            colorCodeDetails: barDetails,
            fciDataDetails: fullData,
            param,
            colorCodes: getAllLegents ? getAllLegents.color_codes : [],
            current,
            currentSite,
            isSelectedOne
        };
        await this.setState({
            isCodeLoading: true,
            colorCodeDetails: barDetails,
            fciDataDetails: fullData
        });

        await this.props.savePopUpData(dataDetails);
    };

    fullScreenHandle = value => {
        this.setState(
            {
                isFullScreen: value
            },
            () => this.props.updateFullScreenValue(value)
        );
    };

    logoutUser = async () => {
        await this.props.logoutUser();
        await this.props.savePopUpData({});
        if (this.props.loginReducer && this.props.loginReducer.logoutUser && this.props.loginReducer.logoutUser.success) {
            let userId = localStorage.getItem("userId");
            unSubscribeDevice(userId);
            localStorage.clear();
            sessionStorage.removeItem("bc-data");
            history.push("/");
        }
    };

    viewDetails = async (point, current, isSelectedOne, currentHorizontal, currentPosition) => {
        let dataDetails = {
            showHorizontalData: true,
            horizontalSubData: point,
            horizontalChartDta: current,
            isSelectedOne,
            currentHorizontal,
            currentPosition
        };
        this.setState({
            showHorizontalData: true,
            horizontalSubData: point,
            horizontalChartDta: current
        });
        await this.props.savePopUpData(dataDetails);
    };

    viewDetailsChart = async (point, current, isSelectedOne, currentChart) => {
        let dataDetails = {
            showChartData: true,
            chartSubData: point,
            chartData: current,
            isSelectedOne,
            currentChart
        };
        this.setState({
            showChartData: true,
            chartSubData: point,
            chartData: current
        });
        await this.props.savePopUpData(dataDetails);
    };

    setAllFilters = async () => {
        const { getDashboard } = this.props.dashboardReducer;
        let buildingEntityParams = {
            entity: "Building",
            paginationParams: {
                totalPages: 0,
                perPage: 100,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                limit: 100,
                offset: 0,
                search: "",
                project_id: null,
                filters: null,
                list: null,
                //list: null,
                deleted: null,
                locked: null,
                unlocked: null,
                active: true
            },
            historyPaginationParams: this.props.buildingReducer.entityParams.historyPaginationParams,
            historyParams: this.props.buildingReducer.entityParams.historyParams,
            dashboard: true,
            building_ids: getDashboard && getDashboard.side_panel && getDashboard.side_panel.recommendation_building_ids,
            start_year: this.state.dashboardFilterParams.start_year,
            end_year: this.state.dashboardFilterParams.end_year,
            infrastructure_requests: this.state.dashboardFilterParams.infrastructure_requests,
            facility_master_plan: this.state.dashboardFilterParams.facility_master_plan
        };

        let regionEntityParams = {
            entity: "Region",
            paginationParams: {
                totalPages: 0,
                perPage: 100,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                limit: 100,
                offset: 0,
                search: "",
                project_id: null,
                filters: null,
                list: null,
                //list: null,
                deleted: null,
                locked: null,
                unlocked: null,
                active: true
            },
            historyPaginationParams: this.props.regionReducer.entityParams.historyPaginationParams,
            historyParams: this.props.regionReducer.entityParams.historyParams,
            dashboard: true,
            building_ids: getDashboard && getDashboard.side_panel && getDashboard.side_panel.recommendation_building_ids,
            start_year: this.state.dashboardFilterParams.start_year,
            end_year: this.state.dashboardFilterParams.end_year,
            infrastructure_requests: this.state.dashboardFilterParams.infrastructure_requests,
            facility_master_plan: this.state.dashboardFilterParams.facility_master_plan
        };

        let siteEntityParams = {
            entity: "Site",
            paginationParams: {
                totalPages: 0,
                perPage: 100,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                limit: 100,
                offset: 0,
                search: "",
                project_id: null,
                filters: null,
                list: null,
                //list: null,
                deleted: null,
                locked: null,
                unlocked: null,
                active: true
            },
            historyPaginationParams: this.props.siteReducer.entityParams.historyPaginationParams,
            historyParams: this.props.siteReducer.entityParams.historyParams,
            dashboard: true,
            building_ids: getDashboard && getDashboard.side_panel && getDashboard.side_panel.recommendation_building_ids,
            start_year: this.state.dashboardFilterParams.start_year,
            end_year: this.state.dashboardFilterParams.end_year,
            infrastructure_requests: this.state.dashboardFilterParams.infrastructure_requests,
            facility_master_plan: this.state.dashboardFilterParams.facility_master_plan
        };
        await this.props.updateBuildingEntityParams(buildingEntityParams);
        await this.props.updateRegionEntityParams(regionEntityParams);
        await this.props.updateSiteEntityParams(siteEntityParams);
    };

    setRecomentationFilter = async (param, data, isHorizontal, isMap) => {
        let currentFilter = this.state.dashboardFilterParams;
        const { chart_type, horizontal_chart_type } = currentFilter || {};
        const trade_id =
            chart_type?.split("_")[0] === "system"
                ? chart_type?.split("_")[1]
                : horizontal_chart_type?.split("_")[0] === "system"
                ? horizontal_chart_type?.split("_")[1]
                : null;
        const trade_name =
            chart_type?.split("_")[0] === "system"
                ? chart_type?.split("_")[2]
                : horizontal_chart_type?.split("_")[0] === "system"
                ? horizontal_chart_type?.split("_")[2]
                : "";

        if (isMap) {
            await this.props.savePopUpData({});
        }

        let commonFilter = {
            paginationParams: {
                totalPages: 0,
                perPage: 100,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                limit: 100,
                offset: 0,
                search: "",
                project_id: null,
                filters: null,
                list: null,
                //list: null,
                deleted: null,
                locked: null,
                unlocked: null,
                active: true
            },
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams,
            dashboard: true,
            capital_type: isHorizontal ? null : "DM",
            // building_ids: getDashboard && getDashboard.side_panel && getDashboard.side_panel.recommendation_building_ids,
            dashboardFilterParams: this.state.dashboardFilterParams,
            year: data.name === "Year" ? (data.value && data.value && data.value[0]) || null : null,
            start_year: this.state.dashboardFilterParams.start_year,
            end_year: this.state.dashboardFilterParams.end_year,
            infrastructure_requests: this.state.dashboardFilterParams.infrastructure_requests,
            facility_master_plan: this.state.dashboardFilterParams.facility_master_plan
            //year: data.value && data.value && data.value[0] || null
        };

        let section = "";
        switch (data.name) {
            case "Year":
                section = "projectinfo";
                break;
            case "Building":
                section = "buildinginfo";
                break;
            case "Site":
                section = "siteinfo";
                break;
            case "FCA Project":
                section = "projectinfo";
                break;
            case "Region":
                section = "regioninfo";
                break;

            default:
                break;
        }

        await this.props.updateRecommendationEntityParams(commonFilter, section);
        await this.setAllFilters();
        let currentFilterValue = [];
        let backupValues = [];
        Object.keys(currentFilter).forEach(dp => {
            let isValue = param[dp];
            if (isValue) {
                currentFilterValue = currentFilter[dp];
                backupValues = { [dp]: currentFilterValue };
                currentFilter[dp] = param[dp];

                // delete currentFilter[dp]
            }
        });
        let testParams = {
            ...currentFilter,
            ...param,
            trade_id
        };

        let backupNames = [];
        let tempFilterName = [];
        this.state.filterNames &&
            this.state.filterNames.length &&
            this.state.filterNames.forEach(tf => {
                if (tf.name === "Buildings" && data.name === "Building") {
                    backupNames.push(tf);
                } else if (tf.name === "Sites" && data.name === "Site") {
                    backupNames.push(tf);
                } else if (tf.name === "Regions" && data.name === "Region") {
                    backupNames.push(tf);
                } else if (tf.name === "FCA Projects" && data.name === "FCA Project") {
                    backupNames.push(tf);
                } else {
                    tempFilterName.push(tf);
                }
            });

        if (isHorizontal) {
            tempFilterName.push(data);
            if (trade_name) {
                tempFilterName.push({ name: "Trade", value: [trade_name] });
            }
            // }
            await this.props.modifyFilter(tempFilterName, currentFilter, param, backupNames, backupValues);
        } else {
            tempFilterName.push(data);
            tempFilterName.push({ name: "Capital Type", value: ["DM"] });
            await this.props.modifyFilter(tempFilterName, currentFilter, param, backupNames, backupValues);
        }
        await this.props.getDashboard({ ...testParams, capital_type: isHorizontal ? null : "DM" }, param);
    };

    exportToExcel = async chart => {
        if (chart === "fcaChart") {
            await this.props.getFcaChartExcelExport(this.state.dashboardFilterParams);
        } else if (chart === "fciChart") {
            await this.props.getFciChartExcelExport(this.state.dashboardFilterParams);
        } else if (chart === "horizontalChart") {
            await this.props.getHorizontalChartExport(this.state.dashboardFilterParams);
        }
    };

    toggleSecondChartView = value => {
        this.props.toggleSecondChartView(value);
    };

    render() {
        const { getDashboard, getDashboardChart, getFciChart, getHorizontalChart, getMap, getFilterColors, getAllLegents } =
            this.props.dashboardReducer;
        return (
            <React.Fragment>
                <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                    <div className="dtl-sec dshb">
                        <div className="row mb-1">
                            {this.renderFilterModal()}
                            <TopFilter
                                handleFilter={this.handleFilter}
                                applyFilter={this.applyFilter}
                                showFilter
                                handleConsultancy={this.handleConsultancy}
                                getDashboard={getDashboard}
                                clearAllFilter={this.clearAllFilter}
                                enableFilter={this.state.enableFilter}
                                handleFilterView={this.handleFilterView}
                                dashboardFilterParams={this.state.dashboardFilterParams}
                                totalCsp={this.state.totalCsp}
                                openFilterModal={this.openFilterModal}
                                getFilterColors={getFilterColors}
                                resetDashboard={this.resetDashboard}
                                logoutUser={this.logoutUser}
                                filterNames={this.state.filterNames}
                            />
                        </div>
                        {getDashboard && (
                            <ChartSection
                                exportToExcel={this.exportToExcel}
                                getDashboardValue={getDashboard}
                                handleMapChange={this.handleMapChange}
                                handleMapModeChange={this.handleMapModeChange}
                                getDashboardChartValue={getDashboardChart}
                                getFciChartValue={getFciChart}
                                getHorizontalChartValue={getHorizontalChart}
                                getMapValue={getMap}
                                chartParams={this.state.chartParams}
                                filterFcaChart={this.filterFcaChart}
                                filterHorizontalChart={this.filterHorizontalChart}
                                chartLoader={this.state.chartLoader}
                                dashboardFilterParams={this.state.dashboardFilterParams}
                                handleViewLegent={this.handleViewLegent}
                                showColorModal={this.state.showColorModal}
                                colorCodes={getAllLegents ? getAllLegents.color_codes : []}
                                individualFilters={this.state.individualFilters}
                                fciSortName={this.state.fciSortName}
                                fciSortValue={this.state.fciSortValue}
                                horizontalSortName={this.state.horizontalSortName}
                                horizontalSortValue={this.state.horizontalSortValue}
                                fullScreenHandle={this.fullScreenHandle}
                                viewDetails={this.viewDetails}
                                showHorizontalData={this.state.showHorizontalData}
                                showChartData={this.state.showChartData}
                                viewDetailsChart={this.viewDetailsChart}
                                setRecomentationFilter={this.setRecomentationFilter}
                                popUpData={this.props.dashboardReducer.popUpData}
                                isFullScreen={this.state.isFullScreen}
                                secondChartView={this.props.dashboardReducer.secondChartView}
                                toggleSecondChartView={this.toggleSecondChartView}
                            />
                        )}
                        {this.state.showColorModal ? (
                            <ColorModal
                                isOpenColorCode={this.state.showColorModal}
                                colorCodes={this.state.colorCodes}
                                isDashboardColor={true}
                                onCancel={() => {
                                    this.setState({ showColorModal: false });
                                    this.cancelModal();
                                }}
                                isCodeLoading={this.state.isCodeLoading}
                                colorCodeDetails={this.state.colorCodeDetails}
                                isFullScreen={this.state.isFullScreen}
                                fciDataDetails={this.state.fciDataDetails}
                                individualFilters={this.state.individualFilters}
                                setRecomentationFilter={this.setRecomentationFilter}
                            />
                        ) : null}
                        {this.state.showHorizontalData ? (
                            <HorizontalDetails
                                showHorizontalData={this.state.showHorizontalData}
                                horizontalSubData={this.state.horizontalSubData}
                                horizontalChartDta={this.state.horizontalChartDta}
                                isCodeLoading={this.state.isCodeLoading}
                                isFullScreen={this.state.isFullScreen}
                                individualFilters={this.state.individualFilters}
                                dashboardFilterParams={this.state.dashboardFilterParams}
                                onCancel={() => {
                                    this.setState({ showHorizontalData: false });
                                    this.cancelModal();
                                }}
                                setRecomentationFilter={this.setRecomentationFilter}
                            />
                        ) : null}
                        {this.state.showChartData ? (
                            <ChartPopUp
                                showChartData={this.state.showChartData}
                                horizontalSubData={this.state.chartSubData}
                                chartData={this.state.chartData}
                                isCodeLoading={this.state.isCodeLoading}
                                isFullScreen={this.state.isFullScreen}
                                individualFilters={this.state.individualFilters}
                                dashboardFilterParams={this.state.dashboardFilterParams}
                                onCancel={() => {
                                    this.setState({ showChartData: false });
                                    this.cancelModal();
                                }}
                                setRecomentationFilter={this.setRecomentationFilter}
                            />
                        ) : null}
                    </div>
                </LoadingOverlay>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { commonReducer, dashboardReducer, loginReducer, buildingReducer, recommendationsReducer, regionReducer, siteReducer } = state;
    return {
        commonReducer,
        dashboardReducer,
        loginReducer,
        buildingReducer,
        regionReducer,
        recommendationsReducer,
        siteReducer
    };
};
let { getTradeSettingsDropdown } = projectActions;
export default withRouter(
    connect(mapStateToProps, {
        ...dashboardAction,
        ...buildingAction,
        ...userAction,
        ...recomentationActions,
        ...siteAction,
        ...regionAction,
        getTradeSettingsDropdown
    })(index)
);
