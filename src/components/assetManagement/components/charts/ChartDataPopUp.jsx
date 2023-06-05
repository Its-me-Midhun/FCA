import React, { Component } from "react";
import Draggable from "react-draggable";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../../common/components/Loader";
import history from "../../../../config/history";
import { resetBreadCrumpData, bulkResetBreadCrumpData, addToBreadCrumpData } from "../../../../config/utils";
import { withRouter } from "react-router-dom";

class ChartDataPopUp extends Component {
    constructor(props) {
        super(props);

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    renderChartHeading = () => {
        return "Sample Heading";
    };

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.onCancel();
        }
    }

    viewAssets = () => {
        const {
            chartData,
            location: { pathname }
        } = this.props;
        let tempPath = pathname.split("/");
        tempPath[tempPath.length - 1] = "assets";
        tempPath = tempPath.join("/");
        addToBreadCrumpData({
            key: "info",
            name: "Assets",
            path: tempPath
        });
        let assetData = { ...this.props.chartParams };
        if (chartData.type === "End_Of_Life_By_Year") {
            assetData.asset_condition_name = chartData.name;
            assetData.asset_condition_id = chartData.entityId;
            assetData.end_of_life_chart_range = chartData.category;
        } else if (chartData.type === "Asset_Age_By_Condition") {
            assetData.asset_condition_name = chartData.name;
            assetData.assets_age_chart_range = chartData.category;
        } else if (chartData.type === "Assets_Capital_Spending_Plan") {
            if (chartData.chartView === "pie") {
                assetData.money_chart_range = chartData.name;
            } else {
                assetData.asset_condition_name = chartData.name;
                assetData.money_bar_chart_range = chartData.category;
            }
        }
        history.push(tempPath, assetData);
    };

    renderTableHeading = (type, chartView) => {
        let th = [];
        switch (type) {
            case "End_Of_Life_By_Year":
                th = ["Condition", "Asset Count"];
                break;
            case "Asset_Age_By_Condition":
                th = ["Condition", "Asset Count"];
                break;
            case "Assets_Capital_Spending_Plan":
                if (chartView === "pie") {
                    th = ["Useful Life Remaining", "Cost"];
                } else {
                    th = ["Condition", "Cost"];
                }
                break;
            case "SFCI":
                th = ["Condition", "Asset Count"];
                break;

            default:
                break;
        }
        return th;
    };

    renderCategoryText = type => {
        let text = "";
        switch (type) {
            case "End_Of_Life_By_Year":
                text = "Useful Life Remaining";
                break;
            case "Asset_Age_By_Condition":
                text = "Age";
                break;
            case "Assets_Capital_Spending_Plan":
                text = "Useful Life Remaining";
                break;
            case "SFCI":
                text = "";
                break;

            default:
                break;
        }
        return text;
    };

    render() {
        const { chartData, isFullScreen, isSingleView } = this.props;
        const chartMainClass =
            chartData.chartView === "pie" && isSingleView
                ? "chart-6"
                : isSingleView
                ? "chart-5"
                : chartData.type === "End_Of_Life_By_Year"
                ? "chart-1"
                : chartData.type === "Assets_Capital_Spending_Plan"
                ? "chart-2"
                : chartData.type === "Asset_Age_By_Condition"
                ? "chart-3"
                : "chart-4";
        return (
            <>
                <Draggable>
                    <div
                        className={`dropdown-menu-view efci-clr  fca-pup view_chart_asset ${chartMainClass}`}
                        aria-labelledby="dropdownMenuButton"
                        style={{ display: "block", cursor: "move" }}
                        ref={this.setWrapperRef}
                    >
                        <LoadingOverlay active={this.props.isCodeLoading} spinner={<Loader />} fadeSpeed={10}>
                            <div class="btn-ara">
                                <div>
                                    <h3>{chartData.heading}</h3>
                                    {chartData.category && (
                                        <h4 class="mt-0 mb-2">{`${this.renderCategoryText(chartData.type)}: ${chartData.category}`}</h4>
                                    )}
                                </div>
                                <button class="btn btn-outline-secondary act-btn" onClick={() => this.viewAssets()}>
                                    View Assets
                                </button>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onCancel()}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>

                            <div className="table-section">
                                <table className="table table-common table-bordered">
                                    <thead>
                                        <tr>
                                            <th>{this.renderTableHeading(chartData.type, chartData.chartView)[0]}</th>
                                            <th>{this.renderTableHeading(chartData.type, chartData.chartView)[1]}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chartData.series?.length ? (
                                            <>
                                                {chartData.series.map((item, i) => (
                                                    <tr key={`series-${i}`}>
                                                        <td>
                                                            <b>{item.name}</b>
                                                        </td>
                                                        <td>
                                                            {chartData.type === "Assets_Capital_Spending_Plan"
                                                                ? `$ ${(item.data[chartData.rangeIndex]?.y / 1000000).toFixed(3)} M`
                                                                : item.data[chartData.rangeIndex]?.y}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </>
                                        ) : (
                                            <tr>
                                                <td>
                                                    <b>{chartData.name}</b>
                                                </td>
                                                <td>
                                                    {chartData.type === "Assets_Capital_Spending_Plan"
                                                        ? `$ ${(chartData.data / 1000000).toFixed(2)} M`
                                                        : chartData.data}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </LoadingOverlay>
                    </div>
                </Draggable>
            </>
        );
    }
}

export default withRouter(ChartDataPopUp);
