import React, { Component } from "react";
import Highcharts from "highcharts/highstock";
import highcharts3d from "highcharts/highcharts-3d";
import highchartsMore from "highcharts/highcharts-more";
import LabelModule from "highcharts/modules/series-label";
import GridLight from "highcharts/themes/grid-light";
import Marker from "./marker";
import Chart from "./fcaChart";
import FCIChart from "./fciChart";
import HorizontalChart from "./horizontalChart";
import BudgetPriority from "./BudgetPriority";

highchartsMore(Highcharts);
highcharts3d(Highcharts);
GridLight(Highcharts);
LabelModule(Highcharts);

Highcharts.setOptions({
    lang: {
        thousandsSep: ","
    }
});
class ChartDetails extends Component {
    state = {
        fciArray: null,
        chartArray: null,
        mapArray: null,
        horizontalChartArray: null,
        viewContent: this.props.isFullScreen
    };

    componentDidUpdate = async (prevProps, prevState) => {
        const { getDashboardValue, getDashboardChartValue, getFciChartValue, getHorizontalChartValue, getMapValue } = this.props;
        let tempArray = [];
        if (prevProps.getDashboardValue !== this.props.getDashboardValue) {
            if (getDashboardValue) {
                Object.keys(getDashboardValue).forEach(dashboard => {
                    if (dashboard !== "success" && dashboard !== "years" && dashboard !== "side_panel") {
                        tempArray.push({ name: dashboard, value: getDashboardValue[dashboard] });
                    }
                });

                let allEqual = tempArray
                    ?.find(t => t.name === "fci_charts")
                    ?.value?.every(item => item.dashboard_view === tempArray.find(t => t.name === "fci_charts")?.value[0]?.dashboard_view);
                this.setState({
                    chartArray: tempArray.find(t => t.name === "chart"),
                    fciArray: tempArray.find(t => t.name === "fci_charts"),
                    mapArray: tempArray.find(t => t.name === "map"),
                    horizontalChartArray: tempArray.find(t => t.name === "horizontal_chart")
                });
                if (!this.props.secondChartView && tempArray.length) {
                    this.toggleSecondChartView(
                        allEqual && tempArray.find(t => t.name === "fci_charts")?.value[0]?.dashboard_view === "budget priority"
                            ? "budget_priority"
                            : "fci_charts"
                    );
                }
            }
        }
        if (prevProps.getDashboardChartValue !== getDashboardChartValue) {
            if (getDashboardChartValue) {
                this.setState({
                    chartArray: { name: "chart", value: getDashboardChartValue.chart }
                });
            }
        }
        if (prevProps.getFciChartValue !== this.props.getFciChartValue) {
            if (getFciChartValue) {
                this.setState({
                    fciArray: { name: "fci_charts", value: getFciChartValue.fci_charts }
                });
            }
        }
        if (prevProps.getHorizontalChartValue !== this.props.getHorizontalChartValue) {
            if (getHorizontalChartValue) {
                this.setState({
                    horizontalChartArray: { name: "horizontal_chart", value: getHorizontalChartValue.horizontal_chart }
                });
            }
        }
        if (prevProps.getMapValue !== this.props.getMapValue) {
            if (getMapValue) {
                this.setState({
                    mapArray: { name: "map", value: getMapValue.map }
                });
            }
        }
    };

    renderHeading = type => {
        let totalYears = this.getTotalYears();
        switch (type) {
            case "chart":
                return this.renderChartHeading();
            case "fci_charts":
                return "FCI Chart";
            case "map":
                return "Map";
            case "horizontal_chart":
                return `FCA ${totalYears} Year CSP`;
            case "budget_priority":
                return `Budget Priorities`;
            default:
                break;
        }
    };

    getTotalYears = () => {
        const { dashboardFilterParams, getDashboardValue } = this.props;
        let filteredYear = 0;
        if (dashboardFilterParams.start_year) {
            filteredYear = 1 + dashboardFilterParams.end_year - dashboardFilterParams.start_year;
        }
        let initialYear = 0;
        if (getDashboardValue.years.start) {
            initialYear = 1 + getDashboardValue.years.end - getDashboardValue.years.start;
        }
        let totalYears = filteredYear || initialYear;
        return totalYears;
    };

    renderChartHeading = () => {
        let noOfYears = this.getTotalYears();

        const { chartParams } = this.props;
        switch (chartParams.chart_type?.split("_")[0] ? chartParams.chart_type?.split("_")[0] : chartParams.chart_type) {
            case "trades":
                return `FCA ${noOfYears} Year Annual CSP By Trade Chart`;
            case "categories":
                return `FCA ${noOfYears} Year Annual CSP By Category Chart`;
            case "funding_sources":
                return `FCA ${noOfYears} Year Annual CSP  By  Funding Source Chart`;
            case "projects":
                return `FCA ${noOfYears} Year Annual CSP  By Project Chart`;
            case "priorities":
                return `FCA ${noOfYears} Year Annual CSP  By Term Chart`;
            case "sites":
                return `FCA ${noOfYears} Year Annual CSP  By Site Chart`;
            case "buildings":
                return `FCA ${noOfYears} Year Annual CSP  By Building Chart`;
            case "regions":
                return `FCA ${noOfYears} Year Annual CSP  By Region Chart`;
            case "criticality":
                return `FCA ${noOfYears} Year Annual CSP  By Criticality Chart`;
            case "capital_type":
                return `FCA ${noOfYears} Year Annual CSP  By Capital Type Chart`;
            case "system":
                const trade_name = chartParams.chart_type?.split("_")[2] || "";
                return `FCA ${noOfYears} Year Annual CSP  By ${trade_name} System Chart`;
            default:
                return "";
        }
    };

    handleViewDetails = async name => {
        if (!this.state.viewContent) {
            this.setState(
                {
                    viewContent: name
                },
                () => this.props.fullScreenHandle(this.state.viewContent)
            );
        } else {
            this.setState(
                {
                    viewContent: null
                },
                () => this.props.fullScreenHandle(this.state.viewContent)
            );
        }
    };

    toggleSecondChartView = val => {
        if (this.state.viewContent === "budget_priority" || this.state.viewContent === "fci_charts") {
            this.setState({ viewContent: val }, () => this.props.fullScreenHandle(this.state.viewContent));
        }
        this.props.toggleSecondChartView(val);
    };

    render() {
        const { mapArray, horizontalChartArray, fciArray, chartArray, viewContent } = this.state;
        const { dashboardFilterParams, fciSortName, fciSortValue, horizontalSortName, horizontalSortValue, popUpData, secondChartView } = this.props;
        return (
            <React.Fragment>
                <div className="row ">
                    <div className={"col-md-12"}>
                        {this.props.getDashboardValue && this.props.getDashboardValue.success && (
                            <div className="w-100 float-left ">
                                {((viewContent && viewContent === "chart") || !viewContent) && chartArray && (
                                    <Chart
                                        chartArray={chartArray}
                                        renderHeading={this.renderHeading}
                                        individualFilters={this.props.individualFilters}
                                        handleMapChange={this.props.handleMapChange}
                                        handleViewDetails={this.handleViewDetails}
                                        viewContent={this.state.viewContent}
                                        viewDetailsChart={this.props.viewDetailsChart}
                                        showChartData={this.props.showChartData}
                                        popUpData={popUpData}
                                        exportToExcel={this.props.exportToExcel}
                                        dashboardFilterParams={dashboardFilterParams}
                                        isFullScreen={viewContent}
                                        getTotalYears={this.getTotalYears}
                                    />
                                )}
                                {secondChartView === "budget_priority" ? (
                                    <>
                                        {((viewContent && viewContent === "budget_priority") || !viewContent) && fciArray && (
                                            <BudgetPriority
                                                handleViewDetails={this.handleViewDetails}
                                                dashboardFilterParams={dashboardFilterParams}
                                                isFullScreen={viewContent}
                                                getDashboardValue={this.props.getDashboardValue}
                                                toggleSecondChartView={() =>
                                                    this.toggleSecondChartView(
                                                        secondChartView === "budget_priority" ? "fci_charts" : "budget_priority"
                                                    )
                                                }
                                            />
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {((viewContent && viewContent === "fci_charts") || !viewContent) && fciArray && (
                                            <FCIChart
                                                fciArray={fciArray}
                                                renderHeading={this.renderHeading}
                                                individualFilters={this.props.individualFilters}
                                                handleMapChange={this.props.handleMapChange}
                                                fciSortValue={fciSortValue}
                                                fciSortName={fciSortName}
                                                filterFcaChart={this.props.filterFcaChart}
                                                handleViewLegent={this.props.handleViewLegent}
                                                showColorModal={this.props.showColorModal}
                                                handleViewDetails={this.handleViewDetails}
                                                popUpData={popUpData}
                                                exportToExcel={this.props.exportToExcel}
                                                isFullScreen={viewContent}
                                                dashboardFilterParams={dashboardFilterParams}
                                                toggleSecondChartView={() =>
                                                    this.toggleSecondChartView(
                                                        secondChartView === "budget_priority" ? "fci_charts" : "budget_priority"
                                                    )
                                                }
                                                getTotalYears={this.getTotalYears}
                                            />
                                        )}
                                    </>
                                )}

                                {((viewContent && viewContent === "horizontal_chart") || !viewContent) && horizontalChartArray && (
                                    <HorizontalChart
                                        horizontalChartArray={horizontalChartArray}
                                        renderHeading={this.renderHeading}
                                        individualFilters={this.props.individualFilters}
                                        handleMapChange={this.props.handleMapChange}
                                        filterHorizontalChart={this.props.filterHorizontalChart}
                                        horizontalSortName={horizontalSortName}
                                        horizontalSortValue={horizontalSortValue}
                                        viewDetails={this.props.viewDetails}
                                        showHorizontalData={this.props.showHorizontalData}
                                        handleViewDetails={this.handleViewDetails}
                                        popUpData={popUpData}
                                        dashboardFilterParams={this.props.dashboardFilterParams}
                                        exportToExcel={this.props.exportToExcel}
                                        isFullScreen={viewContent}
                                        getTotalYears={this.getTotalYears}
                                    />
                                )}
                                {((viewContent && viewContent === "map") || !viewContent) && mapArray && mapArray.value && (
                                    <Marker
                                        markers={mapArray && mapArray.value}
                                        dashboardFilterParams={dashboardFilterParams}
                                        renderHeading={this.renderHeading}
                                        individualFilters={this.props.individualFilters}
                                        handleMapChange={this.props.handleMapChange}
                                        handleMapModeChange={this.props.handleMapModeChange}
                                        handleViewDetails={this.handleViewDetails}
                                        viewContent={this.state.viewContent}
                                        setRecomentationFilter={this.props.setRecomentationFilter}
                                        popUpData={popUpData}
                                        isFullScreen={viewContent}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default ChartDetails;
