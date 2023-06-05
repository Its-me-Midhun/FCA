import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import BasicDetails from "./basicDetailsSettings";
import InfoTabs from "../../../common/components/InfoTabs";
import Portal from "../../../common/components/Portal";
import FormModal from "../../../trade/components/Form";
import FormModalCategory from "../../../category/components/Form";
import FormModalFundingsource from "../../../fundingsource/components/Form";
import FormModalDepartment from "../../../department/components/Form";
import FormModalSub from "../../../subsystem/components/Form";
import FormModalSystem from "../../../system/components/Form";
import FormModalGeneral from "../../../generalsetting/components/Form";
import FormModalPriority from "../../../prioritysetting/components/Form";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import FormModalAssetCondition from "../../../assetcondition/components/Form";
import NarrativeTemplate from "../../../narrativeTemplate";
import TableTemplate from "../../../tableTemplate";
import ReportNoteTemplate from "../../../reportNoteTemplate";
import HelperIcon from "../../../helper/components/HelperIcon";
import {
    tradesettingsTableData,
    subsystemsettingsTableData,
    systemsettingsTableData,
    generalsettingsTableData,
    prioritysettingsTableData,
    assetconditionsettingsTableData
} from "../../../../config/tableData";
import InnerTabs from "./InnerTabs";
import SortOrderTable from "./SortOrderTable";
import RecommendationTemplate from "../../../recommendationTemplate";

class SettingsInfo extends Component {
    state = {
        isloading: true,
        tabledata:
            this.props.activetab === "subsystem"
                ? subsystemsettingsTableData
                : this.props.activetab === "system"
                ? systemsettingsTableData
                : this.props.activetab === "asset_condition"
                ? assetconditionsettingsTableData
                : this.props.activetab === "limit"
                ? generalsettingsTableData
                : this.props.activetab === "priority"
                ? prioritysettingsTableData
                : tradesettingsTableData,
        basicDetails: {
            name: "",
            display_name: "",
            systems: {},
            trades: {},
            project: {},
            clients: {},
            start: "",
            end: "",
            number: "",
            site: {},
            region: {},
            description: "",
            narrative_required: "",
            created_at: "",
            updated_at: ""
        },
        selectedProject: this.props.match.params.id || null,
        settingType: "",
        selectedTrade: null,
        showFormModal: false,
        showFormModalSub: false,
        showFormModalSystem: false,
        showFormModalGeneral: false,
        showFormModalCategory: false,
        showFormModalFundingsource: false,
        showFormModalDepartment: false,
        showFormModalPriority: false,
        showFormModalAssetCondition: false,
        showConfirmModal: false,
        innerActiveTab: "basicdetails",
        infoTabsData: [
            {
                key: "basicdetails",
                name: "Basic Details",
                path: null
            }
        ]
    };

    componentDidMount = async () => {
        await this.refreshinfoDetails();
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            await this.refreshinfoDetails();
        }
    };

    refreshinfoDetails = async () => {
        // const { activetab } = this.props;
        // let floorData = await this.props.getDataById(this.props.selectedOne, this.props.activetab);
        // if (activetab === "trade" || activetab === "system" || activetab === "subsystem") {
        //     await this.setInnerTabDetails();
        // }
        this.setInnerTabs();
        let floorData = await this.props.getDataById();
        if (floorData && floorData.success) {
            this.setState({
                basicDetails: {
                    name: floorData.name,
                    display_name: floorData.display_name,
                    systems: floorData.system,
                    trades: floorData.trade,
                    project: floorData.project,
                    client: floorData.client,
                    start: floorData.start,
                    end: floorData.end,
                    number: floorData.number,
                    site: floorData.site,
                    region: floorData.region,
                    description: floorData.description,
                    narrative_required: floorData.narrative_required,
                    created_at: floorData.created_at,
                    updated_at: floorData.updated_at
                },
                isloading: false
            });
        }
        return true;
    };

    setInnerTabs = async () => {
        const {
            match: {
                params: { settingType }
            }
        } = this.props;
        let infoTabsData = [];
        if (settingType === "trade") {
            infoTabsData = [
                {
                    key: "basicdetails",
                    name: "Basic Details",
                    path: this.getDynamicPath("basicdetails")
                },
                {
                    key: "assignednarrativetemplate",
                    name: "Assigned Narrative Templates",
                    path: this.getDynamicPath("assignednarrativetemplate")
                },
                {
                    key: "assignedtabletemplate",
                    name: "Assigned Table Templates",
                    path: this.getDynamicPath("assignedtabletemplate")
                },
                {
                    key: "systemSort",
                    name: "System Sort Order",
                    path: this.getDynamicPath("systemSort")
                }
            ];
        } else if (settingType === "system") {
            infoTabsData = [
                {
                    key: "basicdetails",
                    name: "Basic Details",
                    path: this.getDynamicPath("basicdetails")
                },
                {
                    key: "assignednarrativetemplate",
                    name: "Assigned Narrative Templates",
                    path: this.getDynamicPath("assignednarrativetemplate")
                },
                {
                    key: "assignedtabletemplate",
                    name: "Assigned Table Templates",
                    path: this.getDynamicPath("assignedtabletemplate")
                },
                {
                    key: "subSystemSort",
                    name: "Sub System Sort Order",
                    path: this.getDynamicPath("subSystemSort")
                }
            ];
        } else if (settingType === "subsystem") {
            infoTabsData = [
                {
                    key: "basicdetails",
                    name: "Basic Details",
                    path: this.getDynamicPath("basicdetails")
                },
                {
                    key: "assignednarrativetemplate",
                    name: "Assigned Narrative Templates",
                    path: this.getDynamicPath("assignednarrativetemplate")
                },
                {
                    key: "assignedtabletemplate",
                    name: "Assigned Table Templates",
                    path: this.getDynamicPath("assignedtabletemplate")
                },
                {
                    key: "assignedreportnotetemplate",
                    name: "Assigned Report Note Templates",
                    path: this.getDynamicPath("assignedreportnotetemplate")
                },
                {
                    key: "assignedrecommendationtemplate",
                    name: "Assigned Recommendation Templates",
                    path: this.getDynamicPath("assignedrecommendationtemplate")
                }
            ];
        }
        await this.setState({
            innerActiveTab: "basicdetails",
            infoTabsData
        });
    };

    getDynamicPath = key => {
        const { url } = this.props.match;
        let pathArr = url.split("/");
        pathArr.pop();
        let basePath = pathArr.join("/");
        basePath = `${basePath}/${key}`;
        return basePath;
    };

    uploadImages = async imageData => {
        this.setState({
            isloading: true
        });
        await this.props.uploadImages(imageData);
        await this.refreshinfoDetails();
    };

    deleteImage = async imageId => {
        this.setState({
            isloading: true
        });
        await this.props.deleteImages(imageId);
        await this.refreshinfoDetails();
    };

    showEditModal = async tradeId => {
        const { activetab } = this.props;
        await this.setState({
            selectedProject: this.props.match.params.id,
            selectedTrade: tradeId,
            settingType: activetab
        });
        if (activetab === "subsystem") {
            this.toggleShowFormModalSub();
        } else if (activetab === "system") {
            this.toggleShowFormModalSystem();
        } else if (activetab === "limit") {
            this.toggleShowFormModalGeneral();
        } else if (activetab === "priority") {
            this.toggleShowFormModalPriority();
        } else if (activetab === "category") {
            this.toggleShowFormModalCategory();
        } else if (activetab === "fundingsource") {
            this.toggleShowFormModalFundingsource();
        } else if (activetab === "department") {
            this.toggleShowFormModalDepartment();
        } else if (activetab === "asset_condition") {
            this.toggleShowFormModalAssetCondition();
        } else {
            this.toggleShowFormModal();
        }
    };

    updateTrade = async trade => {
        let type = this.props.activetab;
        const { selectedTrade } = this.state;
        await this.props.updateData(trade, selectedTrade);
        if (type === "subsystem") {
            this.toggleShowFormModalSub();
        } else if (type === "system") {
            this.toggleShowFormModalSystem();
        } else if (type === "limit") {
            this.toggleShowFormModalGeneral();
        } else if (type === "priority") {
            this.toggleShowFormModalPriority();
        } else if (type === "category") {
            this.toggleShowFormModalCategory();
        } else if (type === "fundingsource") {
            this.toggleShowFormModalFundingsource();
        } else if (type === "department") {
            this.toggleShowFormModalDepartment();
        } else if (type === "asset_condition") {
            this.toggleShowFormModalAssetCondition();
        } else {
            this.toggleShowFormModal();
        }
        this.handleGetAllSettingsLogs();
        await this.refreshinfoDetails();
    };

    getTradeById = async () => {
        const {
            match: {
                params: { subId }
            }
        } = this.props;
        await this.props.getDataById(subId);
    };

    toggleShowFormModal = () => {
        this.setState({
            showFormModal: !this.state.showFormModal
        });
    };
    toggleShowFormModalSub = () => {
        this.setState({
            showFormModalSub: !this.state.showFormModalSub
        });
    };
    toggleShowFormModalCategory = () => {
        this.setState({
            showFormModalCategory: !this.state.showFormModalCategory
        });
    };
    toggleShowFormModalFundingsource = () => {
        this.setState({
            showFormModalFundingsource: !this.state.showFormModalFundingsource
        });
    };
    toggleShowFormModalDepartment = () => {
        this.setState({
            showFormModalDepartment: !this.state.showFormModalDepartment
        });
    };
    toggleShowFormModalAssetCondition = () => {
        this.setState({
            showFormModalAssetCondition: !this.state.showFormModalAssetCondition
        });
    };
    toggleShowFormModalSystem = () => {
        this.setState({
            showFormModalSystem: !this.state.showFormModalSystem
        });
    };
    toggleShowFormModalGeneral = () => {
        this.setState({
            showFormModalGeneral: !this.state.showFormModalGeneral
        });
    };
    toggleShowFormModalPriority = () => {
        this.setState({
            showFormModalPriority: !this.state.showFormModalPriority
        });
    };

    renderFormModal = () => {
        const { showFormModal } = this.state;
        if (!showFormModal) return null;

        return (
            <Portal
                body={
                    <FormModal
                        onCancel={this.toggleShowFormModal}
                        selectedProject={this.state.selectedTrade}
                        addNewData={this.addNewTrade}
                        updateTradeData={this.updateTrade}
                        selectedTrade={this.state.selectedTrade}
                        getTradeByOne={this.getTradeById}
                        addNewCategoryData={this.addNewCategory}
                        type={this.state.settingType}
                    />
                }
                onCancel={this.toggleShowFormModal}
            />
        );
    };
    renderFormModalCategory = () => {
        const { showFormModalCategory } = this.state;
        if (!showFormModalCategory) return null;

        return (
            <Portal
                body={
                    <FormModalCategory
                        onCancel={this.toggleShowFormModalCategory}
                        selectedItem={this.state.selectedTrade}
                        handleUpdateCategory={this.updateTrade}
                        getCategoryByOne={this.getTradeById}
                    />
                }
                onCancel={this.toggleShowFormModalCategory}
            />
        );
    };
    renderFormModalFundingsource = () => {
        const { showFormModalFundingsource } = this.state;
        if (!showFormModalFundingsource) return null;

        return (
            <Portal
                body={
                    <FormModalFundingsource
                        onCancel={this.toggleShowFormModalFundingsource}
                        selectedProject={this.state.selectedTrade}
                        addNewData={this.addNewTrade}
                        updateTradeData={this.updateTrade}
                        selectedTrade={this.state.selectedTrade}
                        getFundingsourceByOne={this.getTradeById}
                        addNewCategoryData={this.addNewCategory}
                        type={this.state.settingType}
                    />
                }
                onCancel={this.toggleShowFormModalFundingsource}
            />
        );
    };
    renderFormModalDepartment = () => {
        const { showFormModalDepartment } = this.state;
        if (!showFormModalDepartment) return null;

        return (
            <Portal
                body={
                    <FormModalDepartment
                        onCancel={this.toggleShowFormModalDepartment}
                        selectedProject={this.state.selectedTrade}
                        addNewData={this.addNewTrade}
                        updateTradeData={this.updateTrade}
                        selectedTrade={this.state.selectedTrade}
                        getCategoryByOne={this.getTradeById}
                        addNewCategoryData={this.addNewCategory}
                        type={this.state.settingType}
                    />
                }
                onCancel={this.toggleShowFormModalDepartment}
            />
        );
    };
    renderFormModalSub = () => {
        const { showFormModalSub } = this.state;
        if (!showFormModalSub) return null;

        return (
            <Portal
                body={
                    <FormModalSub
                        onCancel={this.toggleShowFormModalSub}
                        selectedProject={this.state.selectedProject}
                        addNewData={this.addNewTrade}
                        updateTradeData={this.updateTrade}
                        selectedTrade={this.state.selectedTrade}
                        getSubsystemByOne={this.getTradeById}
                        addNewCategoryData={this.addNewCategory}
                        type={this.state.settingType}
                    />
                }
                onCancel={this.toggleShowFormModalSub}
            />
        );
    };

    renderFormModalSystem = () => {
        const { showFormModalSystem } = this.state;
        if (!showFormModalSystem) return null;

        return (
            <Portal
                body={
                    <FormModalSystem
                        onCancel={this.toggleShowFormModalSystem}
                        selectedProject={this.state.selectedProject}
                        addNewData={this.addNewTrade}
                        updateTradeData={this.updateTrade}
                        selectedTrade={this.state.selectedTrade}
                        getSystemByOne={this.getTradeById}
                        addNewCategoryData={this.addNewCategory}
                        type={this.state.settingType}
                    />
                }
                onCancel={this.toggleShowFormModalSystem}
            />
        );
    };

    renderFormModalGeneral = () => {
        const { showFormModalGeneral } = this.state;
        if (!showFormModalGeneral) return null;

        return (
            <Portal
                body={
                    <FormModalGeneral
                        onCancel={this.toggleShowFormModalGeneral}
                        selectedProject={this.state.selectedProject}
                        addNewData={this.addNewTrade}
                        updateTradeData={this.updateTrade}
                        selectedTrade={this.state.selectedTrade}
                        getGeneralByOne={this.getTradeById}
                        addNewCategoryData={this.addNewCategory}
                        type={this.state.settingType}
                    />
                }
                onCancel={this.toggleShowFormModalGeneral}
            />
        );
    };

    renderFormModalPriority = () => {
        const { showFormModalPriority } = this.state;
        if (!showFormModalPriority) return null;

        return (
            <Portal
                body={
                    <FormModalPriority
                        onCancel={this.toggleShowFormModalPriority}
                        selectedProject={this.state.selectedProject}
                        addNewData={this.addNewTrade}
                        updateTradeData={this.updateTrade}
                        selectedTrade={this.state.selectedTrade}
                        getPriorityByOne={this.getTradeById}
                        addNewCategoryData={this.addNewCategory}
                        type={this.state.settingType}
                    />
                }
                onCancel={this.toggleShowFormModalPriority}
            />
        );
    };

    renderFormModalAssetCondition = () => {
        const { showFormModalAssetCondition } = this.state;
        if (!showFormModalAssetCondition) return null;

        return (
            <Portal
                body={
                    <FormModalAssetCondition
                        onCancel={this.toggleShowFormModalAssetCondition}
                        selectedProject={this.state.selectedTrade}
                        addNewData={this.addNewTrade}
                        updateTradeData={this.updateTrade}
                        selectedTrade={this.state.selectedTrade}
                        getTradeByOne={this.getTradeById}
                        addNewCategoryData={this.addNewCategory}
                        type={this.state.settingType}
                    />
                }
                onCancel={this.toggleShowFormModalAssetCondition}
            />
        );
    };

    handleDeleteTrade = async id => {
        const { activetab } = this.props;
        await this.setState({
            showConfirmModal: true,
            selectedTrade: id,
            settingType: activetab
        });
    };
    deleteTradeOnConfirm = async () => {
        const { selectedTrade, settingType } = this.state;
        await this.props.deleteItemTemp(selectedTrade, settingType);
        this.setState({
            showConfirmModal: false,
            selectedTrade: null
        });
        await this.props.refreshset();
    };

    renderConfirmationModal = () => {
        const { showConfirmModal, settingType } = this.state;
        let msg = "";
        if (!showConfirmModal) return null;
        if (settingType === "category") {
            msg = "Do you want to delete this Category?";
        } else if (settingType === "trade") {
            msg = "Do you want to delete this Trade?";
        } else if (settingType === "system") {
            msg = "Do you want to delete this System?";
        } else if (settingType === "department") {
            msg = "Do you want to delete this Department?";
        } else if (settingType === "limit") {
            msg = "Do you want to delete this Limit?";
        } else if (settingType === "asset_condition") {
            msg = "Do you want to delete this Asset Condition?";
        } else {
            msg = "Do you want to delete this Subsystem?";
        }
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={msg}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteTradeOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };
    handleGetAllSettingsLogs = async id => {
        const {
            match: {
                params: { subId }
            }
        } = this.props;
        await this.props.getAllSettingsLogs(subId);
    };
    handleDeleteLog = async id => {
        const {
            match: {
                params: { subId }
            }
        } = this.props;
        await this.props.handleDeleteLog(id, subId);
    };
    handleGlobalSearchHistory = async search => {
        const {
            match: {
                params: { subId }
            }
        } = this.props;
        await this.props.handleGlobalSearchHistory(search, subId);
    };
    handlePerPageChangeHistory = async e => {
        const {
            match: {
                params: { subId }
            }
        } = this.props;
        await this.props.handlePerPageChangeHistory(e, subId);
    };
    handlePageClickHistory = async e => {
        const {
            match: {
                params: { subId }
            }
        } = this.props;
        await this.props.handlePageClickHistory(e, subId);
    };

    handleUpdateLogSortFilters = async key => {
        const {
            match: {
                params: { subId }
            }
        } = this.props;
        await this.props.updateLogSortFilters(key, subId);
    };

    handleInnerTabClick = async innerActiveTab => {
        await this.setState({
            innerActiveTab
        });
    };

    getDynamicUrl = () => {
        const {
            match: {
                params: { subTab, settingType, subId }
            }
        } = this.props;

        let dynamicUrl = "";

        if (settingType === "subsystem") {
            if (subTab === "assignednarrativetemplate") {
                dynamicUrl = `/sub_systems/${subId}/narrative_templates`;
            } else if (subTab === "assignedtabletemplate") {
                dynamicUrl = `/sub_systems/${subId}/table_templates`;
            } else if (subTab === "assignedreportnotetemplate") {
                dynamicUrl = `/sub_systems/${subId}/report_note_templates`;
            } else if (subTab === "assignedrecommendationtemplate") {
                dynamicUrl = `/sub_systems/${subId}/recommendation_templates`;
            }
        } else if (settingType === "system") {
            if (subTab === "assignednarrativetemplate") {
                dynamicUrl = `/systems/${subId}/narrative_templates`;
            } else if (subTab === "assignedtabletemplate") {
                dynamicUrl = `/systems/${subId}/table_templates`;
            } else if (subTab === "assignedreportnotetemplate") {
                dynamicUrl = `/systems/${subId}/report_note_templates`;
            }
        } else if (settingType === "trade") {
            if (subTab === "assignednarrativetemplate") {
                dynamicUrl = `/trades/${subId}/narrative_templates`;
            } else if (subTab === "assignedtabletemplate") {
                dynamicUrl = `/trades/${subId}/table_templates`;
            } else if (subTab === "assignedreportnotetemplate") {
                dynamicUrl = `/trades/${subId}/report_note_templates`;
            }
        }
        return dynamicUrl;
    };

    render() {
        const { isLoading } = this.state;

        if (isLoading) {
            return null;
        }

        const {
            handleDeleteItem,
            handleCloseItem,
            handleDeleteTrade,
            logData,
            globalSearchKeyHistory,
            historyPaginationParams,
            handleRestoreLog,
            historyParams,
            permissions,
            logPermission,
            hasDelete,
            hasEdit,
            hasLogView,
            hasLogDelete,
            hasLogRestore,
            hasInfoPage,
            entity,
            match: {
                params: { subTab, subId }
            }
        } = this.props;
        const { basicDetails, tabledata, infoTabsData } = this.state;
        localStorage.setItem("dynamicUrl", this.getDynamicUrl());
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl">
                        <InnerTabs infoTabsData={infoTabsData} isTabClass />
                        {subTab === "basicdetails" ? <HelperIcon entity={entity} /> : null}
                        {subTab === "basicdetails" ? (
                            <BasicDetails
                                keys={tabledata.keys}
                                config={tabledata.config}
                                basicDetails={basicDetails}
                                handleDeleteItem={handleDeleteItem}
                                showEditPage={this.showEditModal}
                                itemid={subId || this.props.selectedOne}
                                handleCloseItem={handleCloseItem}
                                handleDeleteTrade={handleDeleteTrade}
                                getAllSettingsLogs={this.handleGetAllSettingsLogs}
                                handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                                handlePageClickHistory={this.handlePageClickHistory}
                                handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                                globalSearchKeyHistory={globalSearchKeyHistory}
                                logData={logData}
                                handleDeleteLog={this.handleDeleteLog}
                                historyPaginationParams={historyPaginationParams}
                                HandleRestoreSettingsLog={handleRestoreLog}
                                refreshinfoDetails={this.refreshinfoDetails}
                                historyParams={historyParams}
                                updateLogSortFilters={this.handleUpdateLogSortFilters}
                                permissions={permissions}
                                logPermission={logPermission}
                                hasLogDelete={hasLogDelete}
                                hasLogRestore={hasLogRestore}
                                hasEdit={hasEdit}
                                hasDelete={hasDelete}
                                hasInfoPage={hasInfoPage}
                                hasLogView={hasLogView}
                                entity={entity}
                            />
                        ) : subTab === "assignednarrativetemplate" ? (
                            <div className="tab-active p-3 recomdn-table bg-grey-table">
                                <NarrativeTemplate hasAssign={false} />
                            </div>
                        ) : subTab === "assignedtabletemplate" ? (
                            <div className="tab-active p-3 recomdn-table bg-grey-table">
                                <TableTemplate hasAssign={false} />
                            </div>
                        ) : subTab === "assignedreportnotetemplate" ? (
                            <div className="tab-active p-3 recomdn-table bg-grey-table">
                                <ReportNoteTemplate hasAssign={false} />
                            </div>
                        ) : subTab === "assignedrecommendationtemplate" ? (
                            <div className="tab-active p-3 recomdn-table bg-grey-table">
                                <RecommendationTemplate hasAssign={false} />
                            </div>
                        ) : subTab === "systemSort" ? (
                            <div className="tab-active p-3 recomdn-table bg-grey-table">
                                <SortOrderTable entity="systems" />
                            </div>
                        ) : subTab === "subSystemSort" ? (
                            <div className="tab-active p-3 recomdn-table bg-grey-table">
                                <SortOrderTable entity="sub_systems" />
                            </div>
                        ) : null}
                    </div>
                </div>
                {this.renderFormModal()}
                {this.renderConfirmationModal()}
                {this.renderFormModalSub()}
                {this.renderFormModalSystem()}
                {this.renderFormModalGeneral()}
                {this.renderFormModalCategory()}
                {this.renderFormModalDepartment()}
                {this.renderFormModalFundingsource()}
                {this.renderFormModalPriority()}
                {this.renderFormModalAssetCondition()}
            </React.Fragment>
        );
    }
}

export default withRouter(SettingsInfo);
