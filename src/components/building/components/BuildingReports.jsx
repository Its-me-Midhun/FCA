import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import qs from "query-string";

import Loader from "../../common/components/Loader";
import { addToBreadCrumpData } from "../../../config/utils";
import history from "../../../config/history";
import SpecialReport from "../../special_report";
import ReportParagraph from "../../report_paragraph";
import ChildParagraph from "../../child_paragraph";

class BuildingReports extends Component {
    state = {
        isLoading: true,
        selectedBuilding: this.props.match.params.id || null,
        tabs: []
    };

    componentDidMount = () => {
        this.setTabs();
        const {
            match: {
                params: { subTab }
            }
        } = this.props;
        this.setDynamicUrl(subTab);
    };

    setTabs = () => {
        const {
            location: { search }
        } = this.props;
        let query = qs.parse(search);
        let tempSearch = "?" + qs.stringify(query);
        let buildingId = this.state.selectedBuilding;
        let tabs = [
            {
                key: "specialReports",
                name: "Special Reports",
                path: `/building/buildinginfo/${buildingId}/reports/specialReports${tempSearch}`
            },
            {
                key: "reportParagraphs",
                name: "Report Paragraphs",
                path: `/building/buildinginfo/${buildingId}/reports/reportParagraphs${tempSearch}`
            },
            {
                key: "childParagraphs",
                name: "Child Paragraphs",
                path: `/building/buildinginfo/${buildingId}/reports/childParagraphs${tempSearch}`
            }
        ];
        this.setState({
            tabs,
            isLoading: false
        });
    };

    setDynamicUrl = (key = null) => {
        const { spReportEntityData } = this.props;
        let tempSearch = "?" + qs.stringify(spReportEntityData);
        localStorage.setItem("spReportEntityData", tempSearch);
        switch (key) {
            case "specialReports":
                localStorage.setItem("dynamicUrl", `/building_special_reports`);
                break;
            case "reportParagraphs":
                localStorage.setItem("dynamicUrl", `/building_report_paragraphs`);
                break;
            case "childParagraphs":
                localStorage.setItem("dynamicUrl", `/building_child_paragraphs`);
                break;
            default:
                break;
        }
    };

    setActiveTab = tab => {
        this.setDynamicUrl(tab.key);
        addToBreadCrumpData({
            key: "info",
            name: tab.name,
            path: tab.path
        });
        history.push(tab.path);
    };

    exportTableXl = async () => {
        await this.setState({ tableLoading: true });
        // await this.props.exportProject();
        await this.setState({ tableLoading: false });
    };

    render() {
        const {
            match: {
                params: { subTab }
            }
        } = this.props;
        const { tabs } = this.state;

        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                <div className="tab-active project-settings-sec image-sec tab-grey settings-otr">
                    <div className="dtl-sec system-building col-md-12">
                        <div className="table-topper p-0">
                            <ul className="custom-ul">
                                {tabs.length &&
                                    tabs.map((item, i) => (
                                        <li
                                            key={i}
                                            onClick={() => this.setActiveTab(item)}
                                            className={`${subTab === item.key ? "active" : ""} cursor-pointer`}
                                        >
                                            {item.name}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        {subTab === "specialReports" ? (
                            <div className=" recomdn-table sort-table">
                                <SpecialReport />
                            </div>
                        ) : subTab === "reportParagraphs" ? (
                            <div className=" recomdn-table sort-table">
                                <ReportParagraph />
                            </div>
                        ) : subTab === "childParagraphs" ? (
                            <div className=" recomdn-table">
                                <ChildParagraph />
                            </div>
                        ) : (
                            <></>
                        )}
                        {this.renderFormModal}
                    </div>
                </div>
            </LoadingOverlay>
        );
    }
}

export default withRouter(BuildingReports);
