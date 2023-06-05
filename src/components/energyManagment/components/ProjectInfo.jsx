import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";

import BasicDetails from "./basicDetails";
import InfoTabs from "../../common/components/InfoTabs";

import Regions from "../../region";
import Sites from "../../site/index";
import Buildings from "../../building/index";

import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import FormModal from "../components/FormSettings";
import FormModalSub from "../components/SubsystemForm";
import FormModalSystem from "../components/SystemForm";
import FormModalGeneral from "../components/settings/GeneralSettingsForm";
import { projectSettingsBuildingTypeTableData } from "../../../config/tableData";
import { checkPermission } from "../../../config/utils";
import { clientTableData } from "./tableConfig";
import {
    categorysettingsTableData,
    systemsettingsTableData,
    subsystemsettingsTableData,
    departmentsettingsTableData,
    generalsettingsTableData
} from "../../../config/tableData";
import Loader from "../../common/components/Loader";
import EditHistory from "./editHistory";

import EnergyStarTab from "../../energyStar/index";
import ElectricityTab from "../../electricity/index";
import WaterTab from "../../water/index";
import GasTab from "../../gas/index";
import SewerTab from "../../sewer/index";
import HelperIcon from "../../helper/components/HelperIcon";
import qs from "query-string";
import Dashboard from "../../chartEnergyTemplate/components/dashboard";

class ProjectInfo extends Component {
    state = {
        isloading: true,
        basicDetails: {
            code: "",
            consultancy: "",
            name: "",
            comments: "",
            created_at: "",
            updated_at: ""
        },
        buildingTypetableData: projectSettingsBuildingTypeTableData,
        initialBuildingType: projectSettingsBuildingTypeTableData,
        tradeTableData: clientTableData,
        systemTableData: systemsettingsTableData,
        subsystemTableData: subsystemsettingsTableData,
        categoryTableData: categorysettingsTableData,
        departmentTableData: departmentsettingsTableData,
        generalTableData: generalsettingsTableData,
        selectedProject: this.props.match.params.id || null,
        settingType: "",
        selectedTrade: null,
        alertMessage: "",
        showConfirmModal: false,
        showInitSpecialReportConfirmModal: false,
        showFormModal: false,
        showFormModalSub: false,
        showFormModalSystem: false,
        showFormModalGeneral: false,
        paginationParams: this.props.energyManagmentReducer.entityParams.paginationParams,
        params: this.props.energyManagmentReducer.entityParams.params,
        paginationParamsSystem: this.props.energyManagmentReducer.entityParams.paginationParams,
        paramsSystem: this.props.energyManagmentReducer.entityParams.params,
        paginationParamsDepartment: this.props.energyManagmentReducer.entityParams.paginationParams,
        paramsDepartment: this.props.energyManagmentReducer.entityParams.params,
        isHistory: false,
        showConfirmModalLog: false,
        selectedLog: "",
        logChanges: {},
        associated_changes: []
    };

    componentDidMount = async () => {
        this.props.showInfoPage(this.props.match.params.id);
        await this.refreshinfoDetails();
        localStorage.setItem("energyclientID", this.props.match.params.id);
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.props.showInfoPage(this.props.match.params.id);
            await this.refreshinfoDetails();
        }
        if (prevProps.refreshProjectData !== this.props.refreshProjectData) {
            await this.refreshinfoDetails();
        }
    };

    refreshinfoDetails = async () => {
        const { params, paramsSystem, paramsDepartment } = this.state;
        let projectData = await this.props.getDataById(this.props.match.params.id);
        if (projectData && projectData.success) {
            this.setState({
                basicDetails: {
                    name: projectData.name,
                    code: projectData.code,
                    comments: projectData.comments,
                    created_at: projectData.created_at,
                    updated_at: projectData.updated_at,
                    consultancy: projectData.consultancy
                },
                isloading: false,
                isHistory: false
            });
        }

        return true;
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

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateBuildingTypeSettings = async (projectId, params) => {
        await this.props.updateBuildingTypeSettings(projectId, params);
        await this.sleep(2000);
        let buildingTypeSettingsData = await this.props.getBuildingTypeSettingsData(this.props.match.params.id);
        if (buildingTypeSettingsData && buildingTypeSettingsData.success) {
            this.setState({
                buildingTypetableData: {
                    ...this.state.buildingTypetableData,
                    data: buildingTypeSettingsData.building_types || []
                }
            });
        }
    };

    showEditModal = async (tradeId, type) => {
        await this.setState({
            selectedProject: this.props.match.params.id,
            selectedTrade: tradeId,
            settingType: type
        });
        if (type === "subsystem") {
            this.toggleShowFormModalSub();
        } else if (type === "system") {
            this.toggleShowFormModalSystem();
        } else if (type === "limit") {
            this.toggleShowFormModalGeneral();
        } else {
            this.toggleShowFormModal();
        }
    };
    addNewTrade = async (type, trade) => {
        await this.props.addNewData(type, trade);
        if (type === "Subsystem") {
            this.toggleShowFormModalSub();
        } else if (type === "System") {
            this.toggleShowFormModalSystem();
        } else if (type === "Limit") {
            this.toggleShowFormModalGeneral();
        } else {
            this.toggleShowFormModal();
        }
        await this.refreshinfoDetails();
    };
    updateTrade = async (type, trade) => {
        const { selectedTrade } = this.state;
        await this.props.updateData(type, trade, selectedTrade);
        if (type === "subsystem") {
            this.toggleShowFormModalSub();
        } else if (type === "system") {
            this.toggleShowFormModalSystem();
        } else if (type === "limit") {
            this.toggleShowFormModalGeneral();
        } else {
            this.toggleShowFormModal();
        }
        await this.refreshinfoDetails();
    };
    getTradeById = async (tradeId, type) => {
        await this.props.getItem(type, tradeId);
    };
    showAddModal = type => {
        this.setState({
            selectedProject: null,
            settingType: type
        });
        if (type === "Subsystem") {
            this.toggleShowFormModalSub();
        } else if (type === "System") {
            this.toggleShowFormModalSystem();
        } else if (type === "Limit") {
            this.toggleShowFormModalGeneral();
        } else {
            this.toggleShowFormModal();
        }
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
    handleDeleteTrade = async (id, type) => {
        await this.setState({
            showConfirmModal: true,
            selectedTrade: id,
            settingType: type
        });
    };
    deleteTradeOnConfirm = async () => {
        const { selectedTrade, settingType } = this.state;
        await this.props.deleteItem(selectedTrade, settingType);
        this.setState({
            showConfirmModal: false,
            selectedTrade: null
        });
        await this.refreshinfoDetails();
    };
    renderFormModal = () => {
        const { showFormModal } = this.state;
        if (!showFormModal) return null;

        return (
            <Portal
                body={
                    <FormModal
                        onCancel={this.toggleShowFormModal}
                        selectedProject={this.state.selectedProject}
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
                        getTradeByOne={this.getTradeById}
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
                        getTradeByOne={this.getTradeById}
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
                        getTradeByOne={this.getTradeById}
                        addNewCategoryData={this.addNewCategory}
                        type={this.state.settingType}
                    />
                }
                onCancel={this.toggleShowFormModalGeneral}
            />
        );
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

    renderInitSpecialReportConfirmationModal = () => {
        const { showInitSpecialReportConfirmModal } = this.state;
        if (!showInitSpecialReportConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Are you Sure?"}
                        message={
                            "Sync Reports button will assign all new Special Reports definitions and settings from Master Report Settings to current Project. All existing reports in current Project will not change. Do you want to continue?"
                        }
                        onNo={() => this.setState({ showInitSpecialReportConfirmModal: false })}
                        onYes={() => this.initializeSpecialReportOnYes()}
                        type={null}
                    />
                }
                onCancel={() => this.setState({ showInitSpecialReportConfirmModal: false })}
            />
        );
    };

    initializeSpecialReportOnYes = async () => {
        const { selectedProject } = this.state;
        await this.setState({
            showInitSpecialReportConfirmModal: false
        });
        await this.props.initializeSpecialReport(selectedProject);
    };

    initializeSpecialReport = selectedProject => {
        this.setState({
            selectedProject,
            showInitSpecialReportConfirmModal: true
        });
    };

    handlePerPageChange = async e => {
        const { paginationParams, params } = this.state;
        await this.setState({
            paginationParams: {
                ...paginationParams,
                perPage: e.target.value,
                currentPage: 0
            },
            params: {
                ...this.state.params,
                offset: 0,
                limit: e.target.value
            }
        });
        await this.refreshinfoDetails();
    };

    handlePageClick = async page => {
        const { paginationParams, params } = this.state;
        await this.setState({
            paginationParams: {
                ...paginationParams,
                currentPage: page.selected
            },
            params: {
                ...params,
                offset: page.selected * paginationParams.perPage
            }
        });
        await this.refreshinfoDetails();
    };

    handlePerPageChangeSystem = async e => {
        const { paginationParamsSystem, paramsSystem } = this.state;
        await this.setState({
            paginationParamsSystem: {
                ...paginationParamsSystem,
                perPage: e.target.value,
                currentPage: 0
            },
            paramsSystem: {
                offset: 0,
                limit: e.target.value
            }
        });
        await this.refreshinfoDetails();
    };

    handlePageClickSystem = async page => {
        const { paginationParamsSystem, paramsSystem } = this.state;
        await this.setState({
            paginationParamsSystem: {
                ...paginationParamsSystem,
                currentPage: page.selected
            },
            paramsSystem: {
                ...paramsSystem,
                offset: page.selected * paginationParamsSystem.perPage
            }
        });
        await this.refreshinfoDetails();
    };

    handlePerPageChangeDepartment = async e => {
        const { paginationParamsDepartment, paramsDepartment } = this.state;
        await this.setState({
            paginationParamsDepartment: {
                ...paginationParamsDepartment,
                perPage: e.target.value,
                currentPage: 0
            },
            paramsDepartment: {
                offset: 0,
                limit: e.target.value
            }
        });
        await this.refreshinfoDetails();
    };

    handlePageClickDepartment = async page => {
        const { paginationParamsDepartment, paramsDepartment } = this.state;
        await this.setState({
            paginationParamsDepartment: {
                ...paginationParamsDepartment,
                currentPage: page.selected
            },
            paramsDepartment: {
                ...paramsDepartment,
                offset: page.selected * paginationParamsDepartment.perPage
            }
        });
        await this.refreshinfoDetails();
    };

    changeToHistory = async () => {
        await this.setState({ isHistory: !this.state.isHistory });
    };
    handleRestoreLog = async (id, choice, changes, associated_changes) => {
        await this.setState({
            showConfirmModalLog: true,
            selectedLog: id,
            logChanges: changes,
            associated_changes: associated_changes
        });
    };

    renderConfirmationModalLog = () => {
        const { showConfirmModalLog, isRestoreOrDelete, logChanges, associated_changes } = this.state;
        if (!showConfirmModalLog) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={logChanges}
                        associatedchanges={associated_changes}
                        onNo={() => this.setState({ showConfirmModalLog: false })}
                        onYes={this.restoreLogOnConfirm}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ showConfirmModalLog: false })}
            />
        );
    };

    restoreLogOnConfirm = async () => {
        const { selectedLog } = this.state;
        await this.props.HandleRestoreProjectLog(selectedLog);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null,
            isHistory: false
        });
        this.setState({
            isloading: true
        });
        await this.refreshinfoDetails();
        // await this.getLogData(this.props.match.params.id)
        // await this.props.getMenuItems();
    };

    handleSelectTrue = (id, key, value) => {
        const { buildingTypetableData } = this.state;
        let tempData = buildingTypetableData;
        tempData &&
            tempData.data.map(item => {
                if (item.id === id) {
                    if (key === "listed_in_dm_site") {
                        item.listed_in_dm_site = value;
                    }
                    if (key === "give_in_fc_site") {
                        item.give_in_fc_site = value;
                    }
                    if (key === "has_own_efci") {
                        item.has_own_efci = value;
                    }
                    if (key === "listed_in_fc_site") {
                        item.listed_in_fc_site = value;
                    }
                    if (key === "listed_in_site_efci") {
                        item.listed_in_site_efci = value;
                    }
                    if (key === "receive_in_dm_site") {
                        item.receive_in_dm_site = value;
                    }
                    if (key === "receive_in_fc_site") {
                        item.receive_in_fc_site = value;
                    }
                    if (key === "site_fc_dm_efci") {
                        item.site_fc_dm_efci = value;
                    }
                    if (key === "give_in_dm_site") {
                        item.give_in_dm_site = value;
                    }
                }
            });
        this.setState({
            buildingTypetableData: tempData
        });
    };

    handleSelectRow = (key, checked) => {
        const { buildingTypetableData } = this.state;
        let tempData1 = buildingTypetableData;
        let rowSelect = {};
        let value = checked;
        tempData1.data.map(item => {
            if (key === "listed_in_dm_site") {
                item.listed_in_dm_site = value;
            }
            if (key === "give_in_fc_site") {
                item.give_in_fc_site = value;
            }
            if (key === "has_own_efci") {
                item.has_own_efci = value;
            }
            if (key === "listed_in_fc_site") {
                item.listed_in_fc_site = value;
            }
            if (key === "listed_in_site_efci") {
                item.listed_in_site_efci = value;
            }
            if (key === "receive_in_dm_site") {
                item.receive_in_dm_site = value;
            }
            if (key === "receive_in_fc_site") {
                item.receive_in_fc_site = value;
            }
            if (key === "site_fc_dm_efci") {
                item.site_fc_dm_efci = value;
            }
            if (key === "give_in_dm_site") {
                item.give_in_dm_site = value;
            }
        });
        this.setState({
            buildingTypetableData: tempData1
        });
    };

    handleColumnselect = (id, checked) => {
        const { buildingTypetableData } = this.state;
        let tempData1 = buildingTypetableData;
        let value = checked;
        tempData1.data.map(item => {
            if (item.id === id) {
                item.give_in_fc_site = value;
                item.has_own_efci = value;
                item.listed_in_fc_site = value;
                item.listed_in_site_efci = value;
                item.receive_in_dm_site = value;
                item.receive_in_fc_site = value;
                item.site_fc_dm_efci = value;
                item.give_in_dm_site = value;
                item.listed_in_dm_site = value;
            }
        });
        this.setState({
            buildingTypetableData: tempData1
        });
    };

    revertBuildingData = () => {
        this.refreshinfoDetails();
    };

    render() {
        const { isLoading } = this.state;

        if (isLoading) {
            return <Loader />;
        }

        const {
            infoTabsData,
            keys,
            config,
            location: { search },
            match: {
                params: { tab, id, settingType }
            },
            showUploadDataModal,
            handleDeleteItem,
            updateSelectedRow,
            selectedRowId,
            handleAddLimit,
            getItem,
            updateData,
            deleteItem,
            getAllProjLogs,
            logData,
            handlePerPageChangeHistory,
            handlePageClickHistory,
            handleGlobalSearchHistory,
            globalSearchKeyHistory,
            handleDeleteLog,
            historyPaginationParams,
            historyParams,
            updateLogSortFilters,
            getAllImportHistoryLogs,
            importHistoryTableData,
            handleDeleteHistory,
            importHistoryParams,
            handleGlobalSearchimportHistory,
            globalSearchKeyimportHistory,
            handleDownloadItem,
            importhistoryPaginationParams,
            handlePerPageChangeImportHistory,
            handlePageClickImportHistory,
            updateImportTableSortFilters,
            resetAllImportFilters,
            resetImportSort,
            showViewImportModal,
            toggleImportWildCardFilter,
            showImportWildCardFilter,
            updateImportWildCardFilter,
            exportImportTableXl,
            tableLoading,
            permissions,
            logPermission,
            hasDelete,
            hasEdit,
            hasLogView,
            hasLogDelete,
            hasLogRestore,
            hasInfoPage,
            isReportView = false,
            entity,
            isInitializingSpecialReport
        } = this.props;

        const {
            basicDetails,
            buildingTypetableData,
            tradeTableData,
            categoryTableData,
            systemTableData,
            subsystemTableData,
            departmentTableData,
            generalTableData,
            paginationParams,
            params,
            paginationParamsSystem,
            paramsSystem,
            paginationParamsDepartment,
            paramsDepartment,
            isHistory
        } = this.state;
        let query = qs.parse(search);
        let spReportEntityData = { project_id: this.props.projectId };

        return (
            <React.Fragment>
                <ReactTooltip id={`init-sp-rep-btn`} />
                <div className="dtl-sec system-building col-md-12">
                    <div className="tab-dtl region-mng">
                        {!settingType && <InfoTabs infoTabsData={infoTabsData} isTabClass={true} />}
                        {tab === "basicdetails" ? <HelperIcon isHistory={isHistory} entity={isHistory ? "general" : entity} /> : null}

                        {isHistory && tab === "basicdetails" ? (
                            <EditHistory
                                handleDeleteItem={handleDeleteItem}
                                getAllRegionLogs={getAllProjLogs}
                                changeToHistory={this.changeToHistory}
                                handlePerPageChangeHistory={handlePerPageChangeHistory}
                                handlePageClickHistory={handlePageClickHistory}
                                handleGlobalSearchHistory={handleGlobalSearchHistory}
                                globalSearchKeyHistory={globalSearchKeyHistory}
                                logData={logData}
                                handleDeleteLog={handleDeleteLog}
                                historyPaginationParams={historyPaginationParams}
                                handleRestoreLog={this.handleRestoreLog}
                                isHistory={isHistory}
                                historyParams={historyParams}
                                updateLogSortFilters={updateLogSortFilters}
                                logPermission={logPermission}
                                permissions={permissions}
                                hasLogDelete={hasLogDelete}
                                hasLogRestore={hasLogRestore}
                                hasEdit={hasEdit}
                                hasDelete={hasDelete}
                                hasInfoPage={hasInfoPage}
                                entity={entity}
                            />
                        ) : tab === "basicdetails" ? (
                            <BasicDetails
                                keys={keys}
                                config={config}
                                basicDetails={basicDetails}
                                handleDeleteItem={handleDeleteItem}
                                isHistoryView={true}
                                changeToHistory={this.changeToHistory}
                                isHistory={isHistory}
                                permissions={permissions}
                                logPermission={logPermission}
                                hasEdit={hasEdit}
                                hasDelete={hasDelete}
                                hasLogView={hasLogView}
                                isReportView={isReportView}
                                entity={entity}
                            />
                        ) : tab === "Electricity" ? (
                            <>
                                <ElectricityTab />
                            </>
                        ) : tab === "Water" ? (
                            <>
                                <WaterTab />
                            </>
                        ) : tab === "Gas" ? (
                            <>
                                <GasTab />
                            </>
                        ) : tab === "Sewer" ? (
                            <>
                                <SewerTab />
                            </>
                        ) : tab === "regions" ? (
                            <div className="tab-active recomdn-table bg-grey-table">
                                <Regions clientId={this.props.match.params.id} basicDetails={basicDetails} />
                            </div>
                        ) : tab === "sites" ? (
                            <div className="tab-active recomdn-table bg-grey-table">
                                <Sites clientId={this.props.match.params.id} isProjectView={true} basicDetails={basicDetails} />
                            </div>
                        ) : tab === "buildings" ? (
                            <div className="tab-active recomdn-table bg-grey-table">
                                <Buildings clientId={this.props.match.params.id} basicDetails={basicDetails} />
                            </div>
                        ) : tab === "energyStarRating" ? (
                            <>
                                <EnergyStarTab />
                            </>
                        ) : tab === "energyStar" ? (
                            <iframe
                                src="https://portfoliomanager.energystar.gov/pm/login.html"
                                width="100%"
                                height="770"
                                allowfullscreen
                                sandbox
                            ></iframe>
                        ) : tab === "energydashboard"  && basicDetails.name ? (
                            <Dashboard
                                dataView={"project"}
                                basicDetails={basicDetails}
                                projectId={this.props.projectId}
                                loadData={this.props.loadData}
                                getEfciBasedOnProject={this.props.getEfciBasedOnProject}
                                saveData={this.props.saveData}
                                efciRegionData={this.props.efciData}
                                entityName={basicDetails.name}
                                efciLoading={this.props.efciLoading}
                                colorCodes={this.props.colorCodes}
                                entity={"Project"}
                                mainEntity={""}
                                hideMainEntity={true}
                                handleCspSummary={this.props.handleProjectCspSummary}
                                updateCspSummary={this.props.updateProjectCspSummary}
                                handleAnnualEfci={this.props.handleProjectAnnualEfci}
                                updateAnnualEFCI={this.props.updateProjectAnnualEFCI}
                                updateAnnualFundingOption={this.props.updateProjectAnnualFunding}
                                handleAnnualFundingOption={this.props.handleProjectAnnualFundingOption}
                                handleFundingCostEfci={this.props.handleProjectFundingCostEfci}
                                updateFundingCostEfci={this.props.updateProjectFundingEfci}
                                handleFundingCostData={this.props.handleProjectEfciFundingCost}
                                updateFundingCostData={this.props.updateProjectEfciFundingCost}
                                showLog={this.props.showLog}
                                updateEfciLock={this.props.updateProjectEfciLock}
                                forceUpdateData={this.props.forceUpdateData}
                                saveDataForce={this.props.saveDataForce}
                                tempArray={this.props.tempArray}
                                resetData={this.props.resetData}
                                logCount={this.props.logCount}
                                logPaginationParams={this.props.logPaginationParams}
                                handlePageClickLogs={this.props.handlePageClickLogs}
                                handlePerPageChangeLogs={this.props.handlePerPageChangeLogs}
                                updateHiddenFundingOption={this.props.updateHiddenFundingOption}
                                hiddenFundingOptionList={this.props.hiddenFundingOptionList}
                                hasChartExport={checkPermission("charts_and_graph", "fca_projects", "export")}
                            />
                        ) : null}
                    </div>
                </div>
                {this.renderFormModal()}
                {this.renderConfirmationModal()}
                {this.renderFormModalSub()}
                {this.renderFormModalSystem()}
                {this.renderFormModalGeneral()}
                {this.renderConfirmationModalLog()}
                {this.renderInitSpecialReportConfirmationModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { energyManagmentReducer } = state;
    return { energyManagmentReducer };
};

export default withRouter(connect(mapStateToProps)(ProjectInfo));
