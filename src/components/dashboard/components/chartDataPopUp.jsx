import React, { Component } from "react";
import Draggable from "react-draggable";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";
import history from "../../../config/history";
import { bulkResetBreadCrumpData } from "../../../config/utils";
import ReactTooltip from "react-tooltip";

class ViewModal extends Component {
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
        const { dashboardFilterParams } = this.props;
        let noOfYears = 10;
        if (dashboardFilterParams.start_year) {
            noOfYears = 1 + dashboardFilterParams.end_year - dashboardFilterParams.start_year;
        }

        const { individualFilters } = this.props;
        switch (individualFilters.chart_type) {
            case "trades":
                return `FCA ${noOfYears} Year CSP By Trade `;
            case "categories":
                return `FCA ${noOfYears} Year CSP By Category `;
            case "funding_sources":
                return `FCA ${noOfYears} Year CSP  By  Funding Source `;
            case "projects":
                return `FCA ${noOfYears} Year CSP  By Project `;
            case "priorities":
                return `FCA ${noOfYears} Year CSP  By Priority `;
            case "sites":
                return `FCA ${noOfYears} Year CSP  By Sites `;
            case "buildings":
                return `FCA ${noOfYears} Year CSP  By Buildings `;
            case "regions":
                return `FCA ${noOfYears} Year CSP  By Regions `;
            default:
                return "";
        }
    };

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.onCancel();
        }
    }

    viewBuilding = () => {
        const { chartData } = this.props;
        this.props.setRecomentationFilter(
            { project_ids: [chartData.project_id], year: chartData.year },
            { name: "Year", value: [chartData.year] },
            true
        );
        history.push(`/project/projectinfo/${chartData.project_id}/recommendations?info=true&pid=${chartData.project_id}`);
        let bc = [
            { key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
            { key: "info", name: "FCA Projects", path: "/project", index: 1 },
            {
                key: "projectName",
                name: chartData.project_name,
                path: `/project/projectinfo/${chartData.project_id}/basicdetails`,
                index: 2
            },
            {
                key: "info",
                name: "Recommendations",
                path: `/project/projectinfo/${chartData.project_id}/recommendations`,
                index: 3
            }
        ];
        bulkResetBreadCrumpData(bc);

        this.props.onCancel();
    };

    render() {
        const { chartData, isFullScreen } = this.props;

        return (
            <>
                <Draggable>
                    <div
                        className={`${
                            this.props.showChartData
                                ? isFullScreen === "chart"
                                    ? "dropdown-menu-view efci-clr clr-dsbrd fixed-bot"
                                    : "dropdown-menu-view efci-clr clr-dsbrd top-mar fca-pup"
                                : "dropdown-menu-view efci-clr  fca-pup"
                        }`}
                        aria-labelledby="dropdownMenuButton"
                        style={{ display: "block" }}
                        ref={this.setWrapperRef}
                    >
                        <LoadingOverlay active={this.props.isCodeLoading} spinner={<Loader />} fadeSpeed={10}>
                            <div class="btn-ara">
                                <ReactTooltip id="filter-icons" />
                                <div>
                                    <h3>{this.renderChartHeading()}</h3>
                                    <h4 class="mt-0"> {chartData ? `Year - ${chartData.year}` : null}</h4>
                                </div>
                                <div
                                    className="cursor-hand"
                                    data-delay-show="500"
                                    data-tip={`Click To View Recommendation`}
                                    data-effect="solid"
                                    data-for="filter-icons"
                                    data-place="right"
                                    data-background-color="#007bff"
                                >
                                    {chartData.project_id ? (
                                        <button class="btn btn-outline-secondary act-btn" onClick={() => this.viewBuilding()}>
                                            Check Details
                                        </button>
                                    ) : null}
                                </div>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onCancel()}>
                                    <div
                                        className="cursor-hand"
                                        data-delay-show="500"
                                        data-tip={`Close`}
                                        data-effect="solid"
                                        data-for="filter-icons"
                                        data-place="right"
                                        data-background-color="#007bff"
                                    >
                                        <span aria-hidden="true">
                                            <img src="/img/close.svg" alt="" />
                                        </span>
                                    </div>
                                </button>
                            </div>

                            <div className="table-section">
                                <table className="table table-common table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Amount</th>
                                            {/* <th className="">Color</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chartData && chartData.data && chartData.data.length ? (
                                            chartData.data.map((code, i) => (
                                                <React.Fragment key={i}>
                                                    <tr>
                                                        <td>
                                                            <b>{code.name}</b>
                                                        </td>
                                                        <td>${code.amount ? (code.amount / 1000000).toFixed(2) : 0} M</td>
                                                        {/* <td>
                                                            <div className="clr-set">
                                                                <div className="col-se">
                                                                    <div
                                                                        className="set"
                                                                        //  style={{ backgroundColor: `${horizontalSubData.series.userOptions.code}` }}
                                                                         >
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td> */}
                                                    </tr>
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <td colSpan={3}>No Data found.</td>
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

export default ViewModal;
