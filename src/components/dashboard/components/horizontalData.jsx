import React, { Component } from "react";
import Draggable from "react-draggable";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";
import history from "../../../config/history";
import { resetBreadCrumpData, bulkResetBreadCrumpData } from "../../../config/utils";
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
        switch (individualFilters.horizontal_chart_type) {
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

    viewBuilding = async () => {
        const { horizontalChartDta, individualFilters } = this.props;
        // await this.props.setRecomentationFilter(horizontalChartDta.entity_id,true)
        if (individualFilters.display == "building") {
            this.props.setRecomentationFilter(
                { building_ids: [horizontalChartDta.entity_id], year: horizontalChartDta.year },
                { name: "Building", value: [horizontalChartDta.name] },
                true
            );

            // resetBreadCrumpData({
            //     key: "info",
            //     name: "Basic Details",
            //     path: `/building/buildinginfo/${horizontalChartDta.entity_id}/basicdetails?info=true&pid=${horizontalChartDta.project_id}`
            // })

            let bc = [
                { key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
                { key: "info", name: "FCA Projects", path: "/project", index: 1 },
                {
                    key: "projectName",
                    name: horizontalChartDta.project_name,
                    path: `/project/projectinfo/${horizontalChartDta.project_id}/basicdetails`,
                    index: 2
                },
                { key: "info", name: "Buildings", path: "/building", index: 3 },
                {
                    key: "buildingName",
                    name: horizontalChartDta.name,
                    path: `/building/buildinginfo/${horizontalChartDta.entity_id}/basicdetails?dashboardView=true`,
                    index: 4
                },
                {
                    key: "info",
                    name: "Recommendations",
                    path: `/building/buildinginfo/${horizontalChartDta.entity_id}/recommendations?info=true&pid=${horizontalChartDta.project_id}&dashboardView=true`,
                    index: 5
                }
            ];
            await bulkResetBreadCrumpData(bc);
            await history.push(
                `/building/buildinginfo/${horizontalChartDta.entity_id}/recommendations?info=true&pid=${horizontalChartDta.project_id}&dashboardView=true`
            );
        } else if (individualFilters.display == "site") {
            this.props.setRecomentationFilter({ site_ids: [horizontalChartDta.entity_id] }, { name: "Site", value: [horizontalChartDta.name] }, true);

            let bc = [
                { key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
                { key: "info", name: "FCA Projects", path: "/project", index: 1 },
                {
                    key: "projectName",
                    name: horizontalChartDta.project_name,
                    path: `/project/projectinfo/${horizontalChartDta.project_id}/basicdetails?info=true&pid=${horizontalChartDta.project_id}&dashboardView=true`,
                    index: 2
                },
                { key: "info", name: "Sites", path: "/site", index: 3 },
                {
                    key: "basicdetails",
                    name: horizontalChartDta.name,
                    path: `/site/siteinfo/${horizontalChartDta.entity_id}/basicdetails?info=true&pid=${horizontalChartDta.project_id}&dashboardView=true`,
                    index: 4
                },
                {
                    key: "info",
                    name: "Recommendations",
                    path: `/site/siteinfo/${horizontalChartDta.entity_id}/recommendations?info=true&pid=${horizontalChartDta.project_id}&dashboardView=true`,
                    index: 5
                }
            ];

            await bulkResetBreadCrumpData(bc);
            await history.push(
                `/site/siteinfo/${horizontalChartDta.entity_id}/recommendations?info=true&pid=${horizontalChartDta.project_id}&dashboardView=true`
            );
        } else if (individualFilters.display == "project") {
            this.props.setRecomentationFilter(
                { project_ids: [horizontalChartDta.entity_id] },
                { name: "FCA Project", value: [horizontalChartDta.name] },
                true
            );

            let bc = [
                { key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
                { key: "info", name: "FCA Projects", path: "/project", index: 1 },
                {
                    key: "projectName",
                    name: horizontalChartDta.name,
                    path: `/project/projectinfo/${horizontalChartDta.entity_id}/basicdetails?dashboardView=true`,
                    index: 2
                },
                {
                    key: "info",
                    name: "Recommendations",
                    path: `/project/projectinfo/${horizontalChartDta.entity_id}/recommendations?dashboardView=true`,
                    index: 3
                }
            ];
            await bulkResetBreadCrumpData(bc);
            await history.push(
                `/project/projectinfo/${horizontalChartDta.entity_id}/recommendations?info=true&pid=${horizontalChartDta.project_id}&dashboardView=true`
            );
        } else if (individualFilters.display == "region") {
            this.props.setRecomentationFilter(
                { region_ids: [horizontalChartDta.entity_id] },
                { name: "Region", value: [horizontalChartDta.name] },
                true
            );

            let bc = [
                { key: "dashboard", name: "Dashboard", path: "/dashboard", index: 0 },
                { key: "info", name: "FCA Projects", path: "/project", index: 1 },
                {
                    key: "projectName",
                    name: horizontalChartDta.project_name,
                    path: `/project/projectinfo/${horizontalChartDta.project_id}/basicdetails?dashboardView=true`,
                    index: 2
                },
                { key: "info", name: "Regions", path: "/region", index: 3 },
                {
                    key: "regionName",
                    name: horizontalChartDta.name,
                    path: `/region/regioninfo/${horizontalChartDta.entity_id}/basicdetails?dashboardView=true`,
                    index: 4
                },
                // {
                //     key: "info", name: "Basic Details",
                //     path: `/region/regioninfo/${horizontalChartDta.entity_id}/basicdetails?info=true&pid=${horizontalChartDta.project_id}`, index: 5
                // },
                {
                    key: "info",
                    name: "Recommendations",
                    path: `/region/regioninfo/${horizontalChartDta.entity_id}/recommendations?info=true&pid=${horizontalChartDta.project_id}&dashboardView=true`,
                    index: 5
                }
            ];
            await bulkResetBreadCrumpData(bc);
            await history.push(
                `/region/regioninfo/${horizontalChartDta.entity_id}/recommendations?info=true&pid=${horizontalChartDta.project_id}&dashboardView=true`
            );
        }

        this.props.onCancel();
    };

    render() {
        const { horizontalChartDta, individualFilters, horizontalSubData, isFullScreen } = this.props;
        return (
            <>
                <Draggable>
                    <div
                        className={`${
                            this.props.showHorizontalData
                                ? isFullScreen == "horizontal_chart"
                                    ? "dropdown-menu-view efci-clr clr-dsbrd fixed-bot"
                                    : "dropdown-menu-view efci-clr clr-dsbrd top-mar"
                                : "dropdown-menu-view efci-clr"
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
                                    <h4 class="mt-0">
                                        {" "}
                                        {horizontalChartDta && horizontalChartDta.hospital_name
                                            ? ` ${horizontalChartDta.hospital_name} -`
                                            : null}{" "}
                                        {horizontalChartDta && horizontalChartDta.name ? `  ${horizontalChartDta.name}` : null}
                                        {horizontalChartDta && horizontalChartDta.building_type ? ` ( ${horizontalChartDta.building_type} )` : null}
                                    </h4>
                                </div>
                                <div
                                    className="cursor-hand"
                                    data-delay-show="500"
                                    data-tip={`Click To View Recommendation `}
                                    data-effect="solid"
                                    data-for="filter-icons"
                                    data-place="right"
                                    data-background-color="#007bff"
                                >
                                    <button class="btn btn-outline-secondary act-btn" onClick={() => this.viewBuilding()}>
                                        Check Details
                                    </button>
                                </div>
                            </div>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onCancel()}>
                                <div
                                    className="cursor-hand"
                                    data-delay-show="500"
                                    data-tip={`Close `}
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
                                        {horizontalChartDta && horizontalChartDta.data && horizontalChartDta.data.length ? (
                                            horizontalChartDta.data.map((code, i) => (
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
                                            <td colSpan={2}>No Data found.</td>
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
