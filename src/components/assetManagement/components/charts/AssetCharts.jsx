/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { connect } from "react-redux";
import Highcharts from "highcharts";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsMore from "highcharts/highcharts-more";
import LabelModule from "highcharts/modules/series-label";
import GridLight from "highcharts/themes/grid-light";
import Portal from "../../../common/components/Portal";
import FilterValue from "../../../site/components/FilterValues";
import ChartDashboard from "./ChartDashboard";
import { withRouter } from "react-router-dom";
import HelperIcon from "../../../helper/components/HelperIcon";
import actions from "../../actions";
import TopFilter from "./MasterFilter";
import SfciColorPopUp from "../charts/ColorModal";
import ChartView from "./ChartView";
import ChartDataPopUp from "./ChartDataPopUp";
highchartsMore(Highcharts);
highcharts3d(Highcharts);
GridLight(Highcharts);
LabelModule(Highcharts);

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            infoSubTabs: [
                {
                    key: "dashboard",
                    name: "Dashboard"
                },
                {
                    key: "End_Of_Life_By_Year",
                    name: "Assets End of Service Life by Year and Condition"
                },
                {
                    key: "Assets_Capital_Spending_Plan",
                    name: "Assets Capital Spending Plan by End of Service Life"
                },
                {
                    key: "Asset_Age_By_Condition",
                    name: "Assets Age By Condition"
                },
                {
                    key: "SFCI",
                    name: "System Facility Condition Index"
                }
            ],
            chartType: null,
            chartData: {},
            selectedMasterFilters: this.props.assetManagementReducer.selectedMasterFilters,
            chartParams: this.props.assetManagementReducer.chartParams,
            clientName: "",
            alertMessage: "",
            sfciSortName: false,
            sfciSortValue: false,
            clientId: ""
        };
    }

    componentDidMount = async () => {
        if (document.addEventListener) {
            document.addEventListener("webkitfullscreenchange", this.onFullscreenChange);
            document.addEventListener("mozfullscreenchange", this.onFullscreenChange);
            document.addEventListener("fullscreenchange", this.onFullscreenChange);
            document.addEventListener("MSFullscreenChange", this.onFullscreenChange);
        }
        await this.getDashboardData();
    };

    componentWillUnmount = () => {
        document.removeEventListener("webkitfullscreenchange", this.onFullscreenChange);
        document.removeEventListener("mozfullscreenchange", this.onFullscreenChange);
        document.removeEventListener("fullscreenchange", this.onFullscreenChange);
        document.removeEventListener("MSFullscreenChange", this.onFullscreenChange);
    };

    onFullscreenChange = () => {
        const isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;
        this.setState({ isFullscreen });
    };

    getDashboardData = async () => {
        await this.setState({ isLoading: true });
        const {
            match: {
                params: { id, section }
            },
            basicDetails
        } = this.props;
        const { chartParams, selectedMasterFilters } = this.state;
        let params = {};
        let chartData = {};
        let clientName = "";
        switch (section) {
            case "assetinfo":
                params.client_id = id;
                clientName = basicDetails.name;
                break;
            case "regioninfo":
                params.region_ids = [id];
                params.client_id = basicDetails?.client?.id;
                clientName = basicDetails?.client?.name;
                break;
            case "siteinfo":
                params.site_ids = [id];
                params.client_id = basicDetails?.client?.id;
                clientName = basicDetails?.client?.name;
                break;
            case "buildinginfo":
                params.building_ids = [id];
                params.client_id = basicDetails?.client?.id;
                clientName = basicDetails?.client?.name;
                break;
            default:
                break;
        }
        await this.props.getChartData({ ...chartParams, ...params });
        chartData = this.props?.assetManagementReducer?.chartDataResponse || [];
        if (chartData?.success) {
            await this.setState({ chartData, clientName, clientId: params.client_id, isLoading: false });
        } else {
            await this.setState({
                chartData: {},
                alertMessage: chartData?.error || chartData?.message || "Something went wrong !",
                clientName,
                isLoading: false
            });
            // this.showAlert();
        }
        this.props.saveMasterFilters(chartParams);
        this.props.saveSelectedMasterFilterList(selectedMasterFilters);
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

    handleChartTab = currentTab => {
        this.props.saveChartTab(currentTab);
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
        element.classList.add("full-left-scrn");
        efciBody && efciBody.classList.add("flr-srn-efci");
        // chartBody && chartBody.classList.add("fln-src");
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
                myDiv && myDiv.classList.remove("full-left-scrn");
                chartBody && chartBody.classList.remove("fln-src");
                efciBody && efciBody.classList.remove("flr-srn-efci");
                document.querySelector("#ModalCopy") && document.querySelector("#ModalCopy").remove();
            }
        }
    };

    handleChart = e => {
        this.setState({
            chartType: e.target.value
        });
    };

    updateMasterFilters = () => {
        const { selectedMasterFilters, chartParams } = this.state;
        this.setState(
            {
                chartParams: {
                    ...chartParams,
                    ...selectedMasterFilters
                }
            },
            () => {
                this.getDashboardData();
            }
        );
    };

    handleMasterFilterSelect = async (selectedFilter, selectedData, isChecked) => {
        const { selectedMasterFilters } = this.state;
        if (isChecked) {
            await this.setState({
                selectedMasterFilters: { ...selectedMasterFilters, [selectedFilter]: [...selectedMasterFilters[selectedFilter], selectedData] }
            });
        } else {
            await this.setState({
                selectedMasterFilters: {
                    ...selectedMasterFilters,
                    [selectedFilter]: selectedMasterFilters[selectedFilter].filter(k => k !== selectedData)
                }
            });
        }
    };

    handleAdvanceFilterSelect = async (selectedFilter, selectedData, isChecked) => {
        const { selectedMasterFilters } = this.state;
        await this.setState({
            selectedMasterFilters: { ...selectedMasterFilters, [selectedFilter]: isChecked ? selectedData : null }
        });
    };

    handleMasterFilterSelectAll = async (selectedFilter, selectedDatas, isChecked) => {
        const { selectedMasterFilters } = this.state;
        let temp = [];
        selectedDatas.map(data => temp.push(data.id));
        await this.setState({ selectedMasterFilters: { ...selectedMasterFilters, [selectedFilter]: isChecked ? temp : [] } });
    };

    resetMasterFilters = () => {
        this.setState(
            {
                chartParams: {},
                selectedMasterFilters: {
                    region_ids: [],
                    site_ids: [],
                    building_ids: [],
                    building_type_ids: [],
                    asset_status_ids: [],
                    asset_condition_ids: [],
                    asset_type_ids: [],
                    recommendation_assigned: null
                }
            },
            () => {
                this.getDashboardData();
            }
        );
    };

    showChartPopup = data => {
        this.props.saveChartPopup({ show: true, data });
    };

    saveChartView = data => {
        this.props.saveChartView(data);
    };

    filterSfciChart = async (sortValue, sortOrder) => {
        const {
            match: {
                params: { id, section }
            },
            basicDetails
        } = this.props;
        let params = {};
        switch (section) {
            case "assetinfo":
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
        await this.setState({
            chartParams: { ...this.state.chartParams, sfci_chart_sort_by: sortValue, sfci_chart_sort_order: sortOrder ? "asc" : "desc" },
            sfciSortName: sortValue === "name" && !this.state.sfciSortName,
            sfciSortValue: sortValue === "value" && !this.state.sfciSortValue
        });
        await this.props.getSfciChart({ ...this.state.chartParams, ...params });
        const chartData = this.props?.assetManagementReducer?.chartDataResponse || [];
        this.setState({ chartData });
    };

    render() {
        const { filterValues, infoSubTabs, chartData, chartType, isLoading, chartParams, selectedMasterFilters, clientName, clientId, isFullscreen } =
            this.state;
        const {
            match: {
                params: { section }
            }
        } = this.props;
        const { chartTab, chartPopupData: chartPopup, chartView } = this.props.assetManagementReducer;
        return (
            <div id={"chartBody"} className={isFullscreen ? "full-left-scrn" : ""}>
                <div className={`tab-active min-head`}>
                    <div className="min-nav  min-nav-long min-nav-bg">
                        <ul className={"pl-3"}>
                            {infoSubTabs?.map(item => (
                                <li
                                    key={item.key}
                                    className={`${chartTab === item.key ? "active" : null} ${item.key === "dashboard" ? "dashboard-bg" : ""}`}
                                    onClick={() => this.handleChartTab(item.key)}
                                >
                                    {item.key === "dashboard" && <i class="fa fa-home mr-2" />}
                                    {item.name}
                                </li>
                            ))}
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
                        <TopFilter
                            selectedMasterFilters={selectedMasterFilters}
                            updateMasterFilters={this.updateMasterFilters}
                            handleAdvanceFilterSelect={this.handleAdvanceFilterSelect}
                            handleValueSelect={this.handleMasterFilterSelect}
                            handleValueSelectAll={this.handleMasterFilterSelectAll}
                            chartParams={chartParams}
                            resetMasterFilters={this.resetMasterFilters}
                            basicDetails={this.props.basicDetails}
                        />
                    </div>
                </div>

                {chartTab === "dashboard" ? (
                    <ChartDashboard
                        graphData={chartData}
                        handleChartClick={this.handleChartTab}
                        isLoading={isLoading}
                        filterValues={filterValues}
                        showChartPopup={this.showChartPopup}
                        chartPopup={chartPopup}
                        isFullscreen={isFullscreen}
                        chartView={chartView}
                        handleChartView={this.saveChartView}
                        filterSfciChart={this.filterSfciChart}
                        sfciSortName={this.state.sfciSortName}
                        sfciSortValue={this.state.sfciSortValue}
                        sfci_sort_by={chartParams.sfci_chart_sort_by}
                    />
                ) : (
                    <ChartView
                        graphData={chartData}
                        selectedMasterFilters={selectedMasterFilters}
                        showChartPopup={this.showChartPopup}
                        handleChartClick={this.handleChartTab}
                        currentTab={chartTab}
                        filterValues={filterValues}
                        chartType={chartType}
                        handleChart={this.handleChart}
                        isLoading={isLoading}
                        hasChartExport={true}
                        clientName={clientName}
                        clientId={clientId}
                        chartPopup={chartPopup}
                        chartView={chartView}
                        handleChartView={this.saveChartView}
                        filterSfciChart={this.filterSfciChart}
                        sfciSortName={this.state.sfciSortName}
                        sfciSortValue={this.state.sfciSortValue}
                        sfci_sort_by={chartParams.sfci_chart_sort_by}
                    />
                )}
                {chartPopup.show ? (
                    <>
                        {chartPopup.data.type === "SFCI" ? (
                            <SfciColorPopUp
                                chartData={chartPopup.data}
                                color_code={chartData.color_codes}
                                onCancel={() => {
                                    this.setState({ chartPopup: { show: false, data: {} } });
                                    this.props.saveChartPopup({ show: false, data: {} });
                                }}
                                isSingleView={chartTab !== "dashboard"}
                            />
                        ) : (
                            <ChartDataPopUp
                                chartData={chartPopup.data}
                                onCancel={() => {
                                    this.setState({ chartPopup: { show: false, data: {} } });
                                    this.props.saveChartPopup({ show: false, data: {} });
                                }}
                                isSingleView={chartTab !== "dashboard"}
                                chartParams={chartParams}
                            />
                        )}
                    </>
                ) : null}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { assetManagementReducer } = state;
    return { assetManagementReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(Dashboard));
