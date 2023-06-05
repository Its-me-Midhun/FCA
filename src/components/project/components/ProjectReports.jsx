import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import qs from "query-string";

import Loader from "../../common/components/Loader";
import { addToBreadCrumpData, checkPermission } from "../../../config/utils";
import history from "../../../config/history";
import SpecialReport from "../../special_report";
import ReportParagraph from "../../report_paragraph";
import ChildParagraph from "../../child_paragraph";

class ProjectInfo extends Component {
    state = {
        isLoading: true,
        selectedProject: this.props.match.params.id || null,
        showFormModal: false,
        infoTabsData: [],
        basicDetails: {
            client: {},
            users: [],
            name: "",
            code: "",
            comments: "",
            regions: [],
            sites: [],
            created_at: "",
            updated_at: ""
        },
        tabs: []
    };

    componentDidMount = () => {
        this.setTabs();
        const {
            match: {
                params: { settingType }
            }
        } = this.props;
        this.setDynamicUrl(settingType);
    };

    setTabs = () => {
        let tabs = [];
        let projectId = this.state.selectedProject;
        if (this.props.isReportView) {
            tabs = [
                {
                    key: "specialReports",
                    name: "Special Reports",
                    path: `/reports/projectinfo/${projectId}/reports/specialReports`
                },
                {
                    key: "reportParagraphs",
                    name: "Report Paragraphs",
                    path: `/reports/projectinfo/${projectId}/reports/reportParagraphs`
                },
                {
                    key: "childParagraphs",
                    name: "Child Paragraphs",
                    path: `/reports/projectinfo/${projectId}/reports/childParagraphs`
                }
            ];
        } else {
            tabs = [
                {
                    key: "specialReports",
                    name: "Special Reports",
                    path: `/project/projectinfo/${projectId}/reports/specialReports`
                },
                {
                    key: "reportParagraphs",
                    name: "Report Paragraphs",
                    path: `/project/projectinfo/${projectId}/reports/reportParagraphs`
                },
                {
                    key: "childParagraphs",
                    name: "Child Paragraphs",
                    path: `/project/projectinfo/${projectId}/reports/childParagraphs`
                }
            ];
        }
        this.setState({
            tabs,
            isLoading: false
        });
    };

    toggleLoader = async () => {
        await this.setState({
            isLoading: !this.state.isLoading
        });
    };

    temp = async id => {
        const { showEditPage } = this.props;
        const { activeTab } = this.state;
        await showEditPage(id, activeTab);
    };
    tempDelete = async id => {
        const { handleDeleteTrade } = this.props;
        const { activeTab } = this.state;
        await handleDeleteTrade(id, activeTab);
    };
    tempconfirmdelete = async (selectedProject, settingType) => {
        await this.props.deleteItem(selectedProject, settingType);
        await this.setState({ showSettingInfo: false });
    };

    setDynamicUrl = (key = null) => {
        const { spReportEntityData } = this.props;
        let tempSearch = "?" + qs.stringify(spReportEntityData);
        localStorage.setItem("spReportEntityData", tempSearch);
        switch (key) {
            case "specialReports":
                localStorage.setItem("dynamicUrl", `/project_special_reports`);
                break;
            case "reportParagraphs":
                localStorage.setItem("dynamicUrl", `/project_report_paragraphs`);
                break;
            case "childParagraphs":
                localStorage.setItem("dynamicUrl", `/project_child_paragraphs`);
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
            buildingTypetableData,
            updateBuildingTypeSettings,
            match: {
                params: { settingType }
            }
        } = this.props;
        const { tabs } = this.state;
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                <div className="tab-active project-settings-sec image-sec tab-grey settings-otr">
                    <div className="dtl-sec col-md-12">
                        <div className="table-topper p-0">
                            <ul className="custom-ul">
                                {tabs.length &&
                                    tabs.map((item, i) => (
                                        <li
                                            key={i}
                                            onClick={() => this.setActiveTab(item)}
                                            className={`${settingType === item.key ? "active" : ""} cursor-pointer`}
                                        >
                                            {item.name}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        {settingType === "specialReports" ? (
                            <div className=" recomdn-table sort-table">
                                <SpecialReport />
                            </div>
                        ) : settingType === "reportParagraphs" ? (
                            <div className=" recomdn-table sort-table">
                                <ReportParagraph />
                            </div>
                        ) : settingType === "childParagraphs" ? (
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

export default withRouter(ProjectInfo);
