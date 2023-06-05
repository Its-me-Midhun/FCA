import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import Loader from "../../common/components/Loader";
import BuildingTypeSettings from "./BuildingTypeSettings";
import TradeSettings from "../../trade/index";
import TradeSettingsInfo from "./settings/settingsInfo";
import CategorySettings from "../../category/index";
import SystemSettings from "../../system/index";
import SubsystemSettings from "../../subsystem/index";
import GeneralSettings from "../../generalsetting/index";
import DepartmentSettings from "../../department/index";
import Fundingsource from "../../fundingsource/index";
import PrioritySettings from "../../prioritysetting/index";
import EFCIColorSettings from "./settings/EFCIColorSettings";
import AssetCondition from "../../assetcondition/index";
import ReportProperties from "../../reportProperties";
import ReportTemplates from "../../reportTemplates";
import { addToBreadCrumpData, checkPermission } from "../../../config/utils";
import history from "../../../config/history";
import MiscSettings from "./settings/MiscSettings";
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
    };

    setTabs = () => {
        let tabs = [];
        let projectId = this.state.selectedProject;
        if (this.props.isReportView) {
            tabs = [
                {
                    key: "exportReport",
                    name: "Report Properties",
                    path: `/reports/projectinfo/${projectId}/settings/exportReport`
                },
                {
                    key: "reportTemplates",
                    name: "Report Templates",
                    path: `/reports/projectinfo/${projectId}/settings/reportTemplates`
                },
                {
                    key: "trade",
                    name: "Trade",
                    path: `/reports/projectinfo/${projectId}/settings/trade`
                },
                {
                    key: "system",
                    name: "System",
                    path: `/reports/projectinfo/${projectId}/settings/system`
                },
                {
                    key: "subsystem",
                    name: "Subsystem",
                    path: `/reports/projectinfo/${projectId}/settings/subsystem`
                }
            ];
        } else {
            tabs = [
                {
                    key: "limit",
                    name: "General",
                    path: `/project/projectinfo/${projectId}/settings/limit`
                },
                {
                    key: "exportReport",
                    name: "Report Properties",
                    path: `/project/projectinfo/${projectId}/settings/exportReport`
                },
                {
                    key: "reportTemplates",
                    name: "Report Templates",
                    path: `/project/projectinfo/${projectId}/settings/reportTemplates`
                },
                {
                    key: "efcicolor",
                    name: "EFCI Color",
                    path: `/project/projectinfo/${projectId}/settings/efcicolor`
                },
                {
                    key: "priority",
                    name: "Priority",
                    path: `/project/projectinfo/${projectId}/settings/priority`
                },
                {
                    key: "fundingsource",
                    name: "Funding Source",
                    path: `/project/projectinfo/${projectId}/settings/fundingsource`
                },
                {
                    key: "category",
                    name: "Category",
                    path: `/project/projectinfo/${projectId}/settings/category`
                },
                {
                    key: "department",
                    name: "Department",
                    path: `/project/projectinfo/${projectId}/settings/department`
                },
                {
                    key: "trade",
                    name: "Trade",
                    path: `/project/projectinfo/${projectId}/settings/trade`
                },
                {
                    key: "system",
                    name: "System",
                    path: `/project/projectinfo/${projectId}/settings/system`
                },
                {
                    key: "subsystem",
                    name: "Subsystem",
                    path: `/project/projectinfo/${projectId}/settings/subsystem`
                },
                {
                    key: "asset_condition",
                    name: "Condition",
                    path: `/project/projectinfo/${projectId}/settings/asset_condition`
                },
                {
                    key: "building_type",
                    name: "Building Type",
                    path: `/project/projectinfo/${projectId}/settings/building_type`
                },
                {
                    key: "miscellaneous",
                    name: "Miscellaneous",
                    path: `/project/projectinfo/${projectId}/settings/miscellaneous`
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

    setActiveTab = tab => {
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
                        {settingType === "system" ? (
                            <div className=" recomdn-table sort-table">
                                <SystemSettings activeTab={"system"} />
                            </div>
                        ) : settingType === "trade" ? (
                            <div className=" recomdn-table sort-table">
                                <TradeSettings activeTab={"trade"} />
                            </div>
                        ) : settingType === "priority" ? (
                            <div className=" recomdn-table">
                                <PrioritySettings activeTab={"priority"} />
                            </div>
                        ) : settingType === "category" ? (
                            <div className=" recomdn-table">
                                <CategorySettings activeTab={"category"} />
                            </div>
                        ) : settingType === "fundingsource" ? (
                            <div className=" recomdn-table">
                                <Fundingsource activeTab={"fundingsource"} />
                            </div>
                        ) : settingType === "department" ? (
                            <div className=" recomdn-table">
                                <DepartmentSettings activeTab={"department"} />
                            </div>
                        ) : settingType === "subsystem" ? (
                            <div className=" recomdn-table">
                                <SubsystemSettings activeTab={"subsystem"} />
                            </div>
                        ) : settingType === "limit" ? (
                            <div className=" recomdn-table">
                                <GeneralSettings activeTab={"limit"} />
                            </div>
                        ) : settingType === "asset_condition" ? (
                            <div className=" recomdn-table">
                                <AssetCondition activeTab={"asset_condition"} />
                            </div>
                        ) : settingType === "efcicolor" ? (
                            <div className=" recomdn-table">
                                <EFCIColorSettings
                                    colorCodes={this.props.colorCodes}
                                    addColor={this.props.addColor}
                                    codeLoading={this.props.codeLoading}
                                    updateColors={this.props.updateColors}
                                    deleteColors={this.props.deleteColors}
                                    getEFCIColorCode={this.props.getEFCIColorCode}
                                    // -------------colorcodelog-----------
                                    showColorcodeLog={this.props.showColorcodeLog}
                                    // ------------colorcodelog-------------
                                />
                            </div>
                        ) : settingType === "exportReport" ? (
                            <div className="recomdn-table">
                                {checkPermission("forms", "project_report_properties", "view") && <ReportProperties isLocalSettings />}
                            </div>
                        ) : settingType === "reportTemplates" ? (
                            <div className="recomdn-table">
                                {checkPermission("forms", "project_report_templates", "view") && <ReportTemplates isLocalSettings />}
                            </div>
                        ) : settingType === "miscellaneous" ? (
                            <div className="recomdn-table">
                                <MiscSettings />
                            </div>
                        ) : (
                            <BuildingTypeSettings
                                buildingTypetableData={buildingTypetableData}
                                updateBuildingTypeSettings={updateBuildingTypeSettings}
                                toggleLoader={this.toggleLoader}
                                handleSelectTrue={this.props.handleSelectTrue}
                                handleSelectRow={this.props.handleSelectRow}
                                handleColumnselect={this.props.handleColumnselect}
                                revertBuildingData={this.props.revertBuildingData}
                            />
                        )}
                        {this.renderFormModal}
                    </div>
                </div>
            </LoadingOverlay>
        );
    }
}

export default withRouter(ProjectInfo);
