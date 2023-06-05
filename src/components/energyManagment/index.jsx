import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import qs from "query-string";

import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import AssignClientUserModal from "./components/AssignClientUserModal";
import AssignConsultancyUserModal from "./components/AssignConsultancyUserModal";
import meterReadingActions from "./actions";
import siteActions from "../site/actions";
import buildingActions from "../building/actions";
import _ from "lodash";
import ProjectMain from "./components/ProjectMain";
import Loader from "../common/components/Loader";
import {
    tradesettingsTableData,
    categorysettingsTableData,
    systemsettingsTableData,
    subsystemsettingsTableData,
    importHistoryTableData
} from "../../config/tableData";

import { clientTableData } from "./components/tableConfig";
import ProjectInfo from "./components/ProjectInfo";
import {
    addToBreadCrumpData,
    findPrevPathFromBreadCrump,
    popBreadCrumpData,
    findPrevPathFromBreadCrumpData,
    checkPermission
} from "../../config/utils";
import MergeOrReplaceModalSelection from "./components/MergeOrReplaceModalSelection";
import UploadDataModal from "./components/UploadDataModal";
import EFCILogs from "../common/components/CommonEFCI/EfciLogs";
import ColorCodeLog from "./components/ColorCodeLog";
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            logCount: 0,
            errorMessage: "",
            projectList: [],
            refreshProjectData: false,
            paginationParams: this.props.energyManagmentReducer.entityParams.paginationParams,
            currentViewAllUsers: null,
            currentActions: null,
            showViewModal: false,
            codeLoading: false,
            tableLoading: false,
            showWildCardFilter: false,
            showAssignConsultancyUsers: false,
            showUploadDataModal: false,
            showMergeOrReplaceModal: false,
            projectData: {},
            clients: [],
            colorCodes: [],
            regionList: [],
            consultancy_users: [],
            selectedRowId: this.props.energyManagmentReducer.entityParams.selectedRowId,
            params: this.props.energyManagmentReducer.entityParams.params,
            selectedClient: {},
            selectedClient: this.props.match.params.id || this.props.energyManagmentReducer.entityParams.selectedEntity,
            tableData: {
                keys: clientTableData.keys,
                config: this.props.energyManagmentReducer.entityParams.tableConfig || _.cloneDeep(clientTableData.config)
            },
            infoTabsData: [],
            wildCardFilterParams: this.props.energyManagmentReducer.entityParams.wildCardFilterParams,
            filterParams: this.props.energyManagmentReducer.entityParams.filterParams,
            alertMessage: "",
            showConfirmModal: false,
            showConfirmModalCategory: false,
            showFormModal: false,
            showFormModalCategory: false,
            selectedTrade: null,
            selectedCategory: null,
            tradeTableData: tradesettingsTableData,
            categoryTableData: categorysettingsTableData,
            systemTableData: systemsettingsTableData,
            subsystemTableData: subsystemsettingsTableData,
            settingType: "",
            historyPaginationParams: this.props.energyManagmentReducer.entityParams.historyPaginationParams,
            historyParams: this.props.energyManagmentReducer.entityParams.historyParams,
            logData: {
                count: "",
                data: []
            },
            logDataColorCode: {
                count: "",
                data: []
            },
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            importHistoryData: {
                count: "",
                data: []
            },
            importHistoryTableData: {
                keys: importHistoryTableData.keys,
                config: this.props.energyManagmentReducer.entityParams.importtableConfig || importHistoryTableData.config,
                data: []
            },
            showConfirmModalimportHistory: false,
            selectedHistory: "",
            importhistoryPaginationParams: this.props.energyManagmentReducer.entityParams.importhistoryPaginationParams,
            importhistoryParams: this.props.energyManagmentReducer.entityParams.importhistoryParams,
            showViewImportModal: false,
            showImportWildCardFilter: false,
            filterValues: this.props.energyManagmentReducer.entityParams.params,
            permissions: {},
            logPermission: {},
            logs: "",
            typeLog: "",
            noOfYears: null,
            openRenderLog: false,
            openLogPanel: false,
            // --------------------colorcodelog---
            openColorcodeLogPanel: false,
            // -----------------------colorcodelog--
            deleteId: null,
            restoreId: null,
            tempArray: [],
            showDeleteConfirmModal: false,
            sortParams: {
                order: {
                    "efci_versions.created_at": "desc"
                }
            },
            forcedChangeArray: [],
            isValueChanged: false,
            logPaginationParams: {
                totalPages: 0,
                perPage: 40,
                currentPage: 0,
                totalCount: 0
            },
            logParams: {
                limit: 40,
                offset: 0
            },
            loghistoryPaginationParams: {
                totalPages: 0,
                perPage: 40,
                currentPage: 0,
                totalCount: 0
            },
            hiddenFundingOptionList: [],
            isInitializingSpecialReport: false
        };
        this.exportTableXl = this.exportTableXl.bind(this);
    }

    componentDidMount = async () => {
        await this.refreshProjectList(true);
    };

    refreshProjectList = async init => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        // await this.props.getAllConsultancyUsers();
        // await this.props.getAllClients();
        // await this.props.getMenuItems();
        const {
            match: {
                params: { section }
            }
        } = this.props;
        // using same componet for project mangement and project listing in info page
        let clientList = [];
        let totalCount = 0;
        if (section === "userinfo") {
            const { limit, offset, search, filters, list, order } = this.state.params;
            let user_id = this.props.match.params.id;
            let userParams = {
                limit,
                offset,
                search,
                filters,
                list,
                order,
                user_id
            };
            await this.props.getAllClients(userParams);
            clientList = this.props.energyManagmentReducer.getAllMeterReadingsResponse
                ? this.props.energyManagmentReducer.getAllMeterReadingsResponse.readings || []
                : [];
            totalCount = this.props.energyManagmentReducer.getAllMeterReadingsResponse
                ? this.props.energyManagmentReducer.getAllMeterReadingsResponse.count || 0
                : 0;
        } else {
            await this.props.getClientDetails({ ...params, ...(init ? { order: { "clients.name": "asc" } } : { order: params?.order }) });
            clientList = this.props.energyManagmentReducer.getAllClientDetailsResponse
                ? this.props.energyManagmentReducer.getAllClientDetailsResponse.clients || []
                : [];
            totalCount = this.props.energyManagmentReducer.getAllClientDetailsResponse
                ? this.props.energyManagmentReducer.getAllClientDetailsResponse.count || 0
                : 0;
        }

        if (
            clientList &&
            !clientList.length &&
            this.props.energyManagmentReducer.getAllMeterReadingsResponse &&
            this.props.energyManagmentReducer.getAllMeterReadingsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.energyManagmentReducer.getAllMeterReadingsResponse.error });
            this.showAlerts();
        }

        this.setState({
            tableData: {
                ...tableData,
                data: clientList,
                config: this.props.energyManagmentReducer.entityParams.tableConfig || tableData.config
            },
            clientList,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            // clients,
            // consultancy_users,
            showWildCardFilter: this.state.params.filters ? true : false,
            // permissions: project_permission || {},
            // logPermission: region_logs,
            isLoading: false
        });
        this.updateEntityParams();
        return true;
    };

    updateWildCardFilter = async newFilter => {
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                filters: newFilter
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            }
        });
        this.updateEntityParams();
        await this.refreshProjectList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "Client",
            selectedEntity: this.state.selectedRegion,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams,
            importhistoryPaginationParams: this.state.importhistoryPaginationParams,
            importhistoryParams: this.state.importhistoryParams,
            importtableConfig: this.state.importHistoryTableData.config
        };
        await this.props.updateProjectEntityParams(entityParams);
    };

    resetAllFilters = async () => {
        await this.setState({
            selectedRegion: null,
            paginationParams: {
                totalPages: 0,
                perPage: 100,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                ...this.state.params,
                limit: 100,
                offset: 0,
                search: "",
                project_id: null,
                filters: null,
                list: null
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshProjectList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshProjectList();
    };
    resetAll = async () => {
        await this.setState({
            selectedRegion: null,
            paginationParams: {
                totalPages: 0,
                perPage: 100,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                ...this.state.params,
                limit: 100,
                offset: 0,
                search: "",
                project_id: null,
                filters: null,

                order: null,
                list: null
            },
            tableData: {
                ...this.state.tableData,
                config: _.cloneDeep(clientTableData.config)
            },

            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshProjectList();
    };
    getListForCommonFilter = async params => {
        const {
            match: {
                params: { section, tab }
            }
        } = this.props;
        const { search, filters, list } = this.state.params;
        params.search = search;
        params.filters = filters;
        params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
        // params.project_id=
        if (section === "userinfo") {
            params.user_id = this.props.match.params.id;
        }
        await this.props.getListForCommonFilterproject(params);
        return (this.props.projectReducer.getListForCommonFilterResponse && this.props.projectReducer.getListForCommonFilterResponse.list) || [];
    };

    updateCommonFilter = async commonFilters => {
        await this.setState({
            params: {
                ...this.state.params,
                offset: 0,
                list: commonFilters
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            }
        });
        this.updateEntityParams();
        await this.refreshProjectList();
    };

    updateTableSortFilters = async searchKey => {
        if (this.state.params.order) {
            await this.setState({
                params: {
                    ...this.state.params,
                    order: {
                        ...this.state.params.order,
                        [searchKey]: this.state.params.order[searchKey] === "desc" ? "asc" : "desc"
                    }
                }
            });
        } else {
            await this.setState({
                params: {
                    ...this.state.params,
                    order: { [searchKey]: "asc" }
                }
            });
        }
        this.updateEntityParams();
        await this.refreshProjectList();
    };

    handleHideColumn = async keyItem => {
        if (keyItem !== "selectAll" && keyItem !== "deselectAll") {
            await this.setState({
                tableData: {
                    ...this.state.tableData,
                    config: {
                        ...this.state.tableData.config,
                        [keyItem]: {
                            ...this.state.tableData.config[keyItem],
                            isVisible: !this.state.tableData.config[keyItem].isVisible
                        }
                    }
                }
            });
        } else {
            let tempConfig = this.state.tableData.config;
            this.state.tableData.keys.map(item => {
                if (keyItem === "selectAll") {
                    tempConfig[item].isVisible = true;
                } else {
                    tempConfig[item].isVisible = false;
                }
            });
            await this.setState({
                tableData: {
                    ...this.state.tableData,
                    config: tempConfig
                }
            });
        }
        await this.updateEntityParams();
        return true;
    };

    updateSelectedRow = async rowId => {
        await this.setState({
            selectedRowId: rowId
        });
        await this.updateEntityParams();
    };

    refreshSettingsData = async () => {
        let tradeSettingsData = await this.props.getTradeSettingsData(this.props.match.params.id);
        let systemSettingsData = await this.props.getSystemSettingsData(this.props.match.params.id);
        let subsystemSettingsData = await this.props.getSubsystemSettingsData(this.props.match.params.id);
        let categorySettingsData = await this.props.getCategorySettingsData(this.props.match.params.id);

        if (tradeSettingsData && tradeSettingsData.success) {
            this.setState({
                tradeTableData: {
                    ...this.state.tradeTableData,
                    data: tradeSettingsData.trades || []
                }
            });
        }
        if (categorySettingsData && categorySettingsData.success) {
            this.setState({
                categoryTableData: {
                    ...this.state.categoryTableData,
                    data: categorySettingsData.categories || []
                }
            });
        }
        if (systemSettingsData && systemSettingsData.success) {
            this.setState({
                systemTableData: {
                    ...this.state.systemTableData,
                    data: systemSettingsData.categories || []
                }
            });
        }
        if (subsystemSettingsData && subsystemSettingsData.success) {
            this.setState({
                subsystemTableData: {
                    ...this.state.subsystemTableData,
                    data: subsystemSettingsData.sub_systems || []
                }
            });
        }
        return true;
    };

    handlePerPageChange = async e => {
        const { paginationParams } = this.state;
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
        await this.refreshProjectList();
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
                // offset: page.selected * paginationParams.perPage
                offset: page.selected + 1
            }
        });
        await this.refreshProjectList();
    };

    updateCurrentActions = async key => {
        const { currentActions } = this.state;
        await this.setState({
            currentActions: currentActions === key ? null : key
        });
        return true;
    };

    updateCurrentViewAllUsers = async key => {
        const { currentViewAllUsers } = this.state;
        await this.setState({
            currentViewAllUsers: currentViewAllUsers === key ? null : key
        });
        return true;
    };

    showEditPage = projectId => {
        const { history } = this.props;
        this.setState({
            selectedClient: projectId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit Project",
            path: `/energymanagement/edit/${projectId}`
        });
        history.push(`/energymanagement/edit/${projectId}`);
    };

    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedClient: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add Project",
            path: `/energymanagement/add`
        });
        history.push(`/energymanagement/add`);
    };

    showViewModal = () => {
        this.setState({
            showViewModal: true
        });
    };

    getSiteListBasedOnRegion = async (projectId, params) => {
        await this.props.getSitesBasedOnRegionDropdown(projectId, params);
        const {
            buildingReducer: {
                getSitesBasedOnRegionResponse: { sites: siteList }
            }
        } = this.props;
        return siteList;
    };

    getRegionListBasedOnClient = async clientId => {
        await this.props.getRegionsBasedOnClient(clientId);
        const {
            projectReducer: {
                getRegionsBasedOnClientResponse: { regions: regionList }
            }
        } = this.props;
        return regionList;
    };

    toggleWildCardFilter = () => {
        const { showWildCardFilter } = this.state;
        this.setState({
            showWildCardFilter: !showWildCardFilter
        });
    };

    handleAssignConsultancyUsersModal = async projectData => {
        await this.setState({
            showAssignConsultancyUsers: true
        });
    };

    handleAssignClientUsersModal = async projectData => {
        await this.setState({
            showAssignClientUsers: true
        });
    };

    handleAddProject = async project => {
        const { history } = this.props;
        this.setState({
            isLoading: true
        });
        await this.props.addProject(project);
        if (this.props.projectReducer.addProjectResponse && this.props.projectReducer.addProjectResponse.is_existing) {
            this.toggleShowMergeOrReplaceModal();
            this.setState({
                isLoading: false
            });
        } else if (this.props.projectReducer.addProjectResponse && this.props.projectReducer.addProjectResponse.error) {
            await this.setState({
                alertMessage: this.props.projectReducer.addProjectResponse.error
            });
            this.showAlerts();
            this.setState({
                isLoading: false
            });
        } else {
            // calling python backend for copying global report templates to project level
            let project_id = this.props.projectReducer.addProjectResponse.id || "";
            await this.props.copyGlobalReportTemplates({ project_id });
            await this.props.addUserActivityLog({ text: "Copied global report templates" });
            const { success, error } = this.props.projectReducer.reportTemplateCopyResponse;
            if (!success) {
                this.setState(
                    {
                        alertMessage: error || "Oops..! Failed to copy report templates to the project level."
                    },
                    () => this.showAlerts()
                );
                this.setState({
                    isLoading: false
                });
            } else {
                await this.setState({
                    alertMessage: this.props.projectReducer.addProjectResponse && this.props.projectReducer.addProjectResponse.message
                });
                this.showAlerts();
                await this.refreshProjectList();
                this.setState({
                    isLoading: true
                });
                // await this.props.getMenuItems();
                this.setState({
                    isLoading: false
                });
                history.push(findPrevPathFromBreadCrump() || "/energymanagement");
            }
        }
        this.setState({
            isLoading: false
        });
    };

    handleUploadData = async project => {
        const { history } = this.props;

        let projectParseParams = {
            id: project.project_id,
            site_id: project.site_id,
            region_id: project.region_id,
            fca_sheet: project.fca_sheet
        };
        await this.props.parseFca(projectParseParams);
        if (this.props.projectReducer.parseFcaResponse && this.props.projectReducer.parseFcaResponse.is_existing) {
            this.toggleShowMergeOrReplaceModal();
        } else if (this.props.projectReducer.parseFcaResponse && this.props.projectReducer.parseFcaResponse.error) {
            await this.setState({
                alertMessage: "Something went wrong. please check the import history for more details",
                showUploadDataModal: false
            });
            this.showAlerts();
        } else {
            await this.setState({
                alertMessage:
                    this.props.projectReducer?.parseFcaResponse?.message || "Something went wrong. please check the import history for more details",
                showUploadDataModal: false
            });
            this.showAlerts();
            await this.refreshProjectList();
            this.setState({ refreshProjectData: !this.state.refreshProjectData });
            // await this.props.getMenuItems();
            history.push(findPrevPathFromBreadCrump() || "/energymanagement");
        }
    };

    onMergeOrReplaceModalSelection = async type => {
        this.setState({
            showMergeOrReplaceModal: false
        });
        let projectParseParams = {
            replace: type === "replace" ? "true" : "false",
            id: this.props.projectReducer.parseFcaResponse && this.props.projectReducer.parseFcaResponse.project_id,
            site_id: this.props.projectReducer.parseFcaResponse && this.props.projectReducer.parseFcaResponse.site_id
        };
        await this.props.parseFca(projectParseParams);
        await this.setState({
            alertMessage:
                this.props.projectReducer?.parseFcaResponse?.message || "Something went wrong. please check the import history for more details",
            selectedClient: null,
            showUploadDataModal: false
        });
        this.showAlerts();
        await this.refreshProjectList();
        this.setState({ refreshProjectData: !this.state.refreshProjectData });
        // await this.props.getMenuItems();
        this.props.history.push(findPrevPathFromBreadCrump() || "/energymanagement");
    };

    toggleShowMergeOrReplaceModal = () => {
        this.setState({
            showMergeOrReplaceModal: !this.state.showMergeOrReplaceModal
        });
    };

    toggleShowUploadDataModal = () => {
        this.setState({
            showUploadDataModal: !this.state.showUploadDataModal
        });
    };

    renderMergeOrReplaceModalSelection = () => {
        const { showMergeOrReplaceModal } = this.state;
        if (!showMergeOrReplaceModal) return null;
        return (
            <Portal
                body={
                    <MergeOrReplaceModalSelection
                        onCancel={this.toggleShowMergeOrReplaceModal}
                        message={"Building already exist?"}
                        buttonYes={{ label: "Replace", value: "replace" }}
                        buttonNo={{ label: "Merge", value: "merge" }}
                        onSelection={this.onMergeOrReplaceModalSelection}
                    />
                }
                onCancel={this.toggleShowMergeOrReplaceModal}
            />
        );
    };

    showAlerts = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show-long-alert";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show-long-alert", "");
            }, 6000);
        }
    };

    handleUpdateProject = async project => {
        const { history } = this.props;
        const { selectedClient } = this.state;
        this.setState({
            isLoading: true
        });
        await this.props.updateProject(project, selectedClient);
        if (this.props.projectReducer.updateProjectResponse && this.props.projectReducer.updateProjectResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.updateProjectResponse.error });
            this.showAlerts();
            this.setState({
                isLoading: false
            });
        } else {
            await this.setState({
                alertMessage: this.props.projectReducer.updateProjectResponse && this.props.projectReducer.updateProjectResponse.message,
                currentActions: null
            });
            this.showAlerts();
            await this.refreshProjectList();
            this.setState({
                isLoading: true
            });
            // await this.props.getMenuItems();
            this.setState({
                isLoading: false
            });
            history.push(findPrevPathFromBreadCrump() || "/energymanagement");
        }
    };

    handleDeleteProject = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedClient: id
        });
    };

    showUploadDataModal = async id => {
        await this.setState({
            showUploadDataModal: true,
            selectedClient: id
        });
    };

    renderUploadDataModal = () => {
        const { showUploadDataModal } = this.state;
        if (!showUploadDataModal) return null;
        return (
            <Portal
                body={
                    <UploadDataModal
                        getDataById={this.getDataById}
                        getRegionListBasedOnClient={this.getRegionListBasedOnClient}
                        handleUploadData={this.handleUploadData}
                        getSiteListBasedOnRegion={this.getSiteListBasedOnRegion}
                        onCancel={() => this.setState({ showUploadDataModal: false })}
                    />
                }
                onCancel={() => this.setState({ showUploadDataModal: false })}
            />
        );
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Project?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteProjectOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    updateHiddenFundingOption = async hiddenFundingOptionList => {
        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab == "dashboard") {
            await this.props.hideFundingOptionChart(hiddenFundingOptionList);
            await this.setState({
                hiddenFundingOptionList: this.props.projectReducer.hiddenFundingOptionListChart || []
            });
        } else {
            await this.props.hideFundingOption(hiddenFundingOptionList);
            await this.setState({
                hiddenFundingOptionList: this.props.projectReducer.hiddenFundingOptionList || []
            });
        }
    };

    deleteProjectOnConfirm = async () => {
        const { selectedClient } = this.state;
        const { history } = this.props;
        await this.setState({
            showConfirmModal: false,
            isLoading: true
        });
        await this.props.deleteProject(selectedClient);
        if (this.props.projectReducer.deleteProjectResponse && this.props.projectReducer.deleteProjectResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.deleteProjectResponse.error });
            this.showAlerts();
            await this.setState({
                isLoading: false
            });
        } else {
            await this.refreshProjectList();
            this.setState({
                isLoading: true
            });
            // await this.props.getMenuItems();
            await this.setState({
                selectedClient: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/energymanagement");
            }
            await this.setState({
                isLoading: false
            });
        }
        await this.setState({
            isLoading: false
        });
    };

    handleGlobalSearch = async search => {
        const { params } = this.state;
        await this.setState({
            params: {
                ...params,
                offset: 0,
                search
            },
            paginationParams: {
                ...this.state.paginationParams,
                currentPage: 0
            }
        });
        await this.refreshProjectList();
    };

    showInfoPage = projectId => {
        const { history } = this.props;
        const {
            location: { search },
            match: {
                params: { tab, settingType, subTab, subId, subSection },
                path
            }
        } = this.props;
        const query = qs.parse(search);
        let tempSearch = "";
        if (query.dashboardView) {
            tempSearch = search;
        }
        if (this.props.isReportView) {
            this.setState({
                selectedClient: projectId,
                infoTabsData: [
                    {
                        key: "basicdetails",
                        name: "Project",
                        path: `/reports/energyinfo/${projectId}/basicdetails${tempSearch}`
                    },
                    {
                        key: "settings",
                        name: "Settings",
                        path: `/reports/energyinfo/${projectId}/settings/exportReport`,
                        bcName: "Report Properties"
                    }
                ]
            });
        } else {
            this.setState({
                selectedClient: projectId,
                infoTabsData: [
                    {
                        key: "basicdetails",
                        name: "Client",
                        path: `/energymanagement/energyinfo/${projectId}/basicdetails${tempSearch}`
                    },
                    {
                        key: "regions",
                        name: "Regions",
                        path: `/energymanagement/energyinfo/${projectId}/regions`
                    },
                    {
                        key: "sites",
                        name: "Sites",
                        path: `/energymanagement/energyinfo/${projectId}/sites`
                    },
                    {
                        key: "buildings",
                        name: "Buildings",
                        path: `/energymanagement/energyinfo/${projectId}/buildings`
                    },

                    {
                        key: "Electricity",
                        name: "Electricity",
                        path: `/energymanagement/energyinfo/${projectId}/Electricity`,
                        bcName: "Electricity"
                    },
                    {
                        key: "Gas",
                        name: "Gas",
                        path: `/energymanagement/energyinfo/${projectId}/Gas`,
                        bcName: "Gas"
                    },
                    {
                        key: "Water",
                        name: "Water",
                        path: `/energymanagement/energyinfo/${projectId}/Water`,
                        bcName: "Water"
                    },
                    {
                        key: "Sewer",
                        name: "Sewer",
                        path: `/energymanagement/energyinfo/${projectId}/Sewer`,
                        bcName: "Sewer"
                    },
                    {
                        key: "energyStarRating",
                        name: "Energy Star",
                        path: `/energymanagement/energyinfo/${projectId}/energyStarRating`,
                        bcName: "energyStarRating"
                    },
                    {
                        key: "energydashboard",
                        name: "Charts & Graphs",
                        path: `/energymanagement/energyinfo/${projectId}/energydashboard`
                    },
                    {
                        key: "energyStar",
                        name: "Portfolio Manager",
                        path: `/energymanagement/energyinfo/${projectId}/energyStar`
                    }
                ]
            });
        }
        let tabKeyList = ["basicdetails", "regions", "sites", "buildings", "Electriciy", "Gas", "Water", "Sewer", "energydashboard", "energyStar"];
        if (path === "/efci") {
            history.push(`/efci/efciinfo/${projectId}/dashboard`);
        } else {
            let path = `/${this.props.isReportView ? "reports" : "energymanagement"}/energyinfo/${projectId}/${
                tabKeyList.includes(tab) ? tab : "basicdetails"
            }`;
            path +=
                tab === "settings"
                    ? `${settingType ? `/${settingType}` : ""}${subSection ? `/${subSection}` : ""}${subId ? `/${subId}` : ""}${
                          subTab ? `/${subTab}` : ""
                      }`
                    : tab === "reports"
                    ? `${settingType ? `/${settingType}` : ""}`
                    : "";

            history.push(path);
        }
    };

    getDataById = async projectId => {
        await this.props.getClientById(projectId);
        return this.props.energyManagmentReducer.getClientIdResponse;
    };

    getBuildingTypeSettingsData = async projectId => {
        await this.props.getBuildingTypeSettingsData(projectId);
        return this.props.projectReducer.getBuildingTypeSettingsDataResponse;
    };
    getTradeSettingsData = async projectId => {
        await this.props.getTradeSettingsData(projectId);
        return this.props.projectReducer.getTradeSettingsDataResponse;
    };
    getCategorySettingsData = async projectId => {
        await this.props.getCategorySettingsData(projectId);
        return this.props.projectReducer.getCategorySettingsDataResponse;
    };
    getDepartmentSettingsData = async (params, projectId) => {
        await this.props.getDepartmentSettingsData(params, projectId);
        return this.props.projectReducer.getDepartmentSettingsDataResponse;
    };
    getSystemSettingsData = async (params, projectId) => {
        await this.props.getSystemSettingsData(params, projectId);
        return this.props.projectReducer.getSystemSettingsDataResponse;
    };
    getSubsystemSettingsData = async (params, projectId) => {
        await this.props.getSubsystemSettingsData(params, projectId);
        return this.props.projectReducer.getSubsystemSettingsDataResponse;
    };
    getGeneralSettingsData = async projectId => {
        await this.props.getaddLimit(projectId);
        return this.props.projectReducer.getaddLimitResponse;
    };

    updateBuildingTypeSettings = async (projectId, params) => {
        await this.props.updateBuildingTypeSettings(projectId, params);
    };

    uploadImages = async (imageData = {}) => {
        const { selectedClient } = this.state;
        await this.props.uploadProjectImage(imageData, selectedClient || this.props.match.params.id);
        await this.getAllImageList(selectedClient);
        return true;
    };

    deleteImages = async imageId => {
        const { selectedClient } = this.state;
        await this.props.deleteProjectImage(imageId);
        await this.getAllImageList(selectedClient);
        return true;
    };

    getAllImageList = async projectId => {
        await this.props.getAllProjectImages(projectId);
        return this.props.projectReducer.getAllImagesResponse.images;
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, clientTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    addNewTrade = async (type, trade) => {
        const projectId = this.props.match.params.id;
        switch (type) {
            case "Trade":
                await this.props.addTrade(projectId, trade);
                await this.setState({
                    alertMessage: this.props.projectReducer.addTradeResponse && this.props.projectReducer.addTradeResponse.message,
                    selectedTrade: null
                });
                break;
            case "Category":
                await this.props.addCategory(projectId, trade);
                await this.setState({
                    alertMessage: this.props.projectReducer.addCategoryResponse && this.props.projectReducer.addCategoryResponse.message,
                    selectedTrade: null
                });
                break;
            case "System":
                await this.props.addSystem(projectId, trade);
                await this.setState({
                    alertMessage: this.props.projectReducer.addSystemResponse && this.props.projectReducer.addSystemResponse.message,
                    selectedTrade: null
                });
                break;
            case "Subsystem":
                await this.props.addSubsystem(projectId, trade);
                await this.setState({
                    alertMessage: this.props.projectReducer.addSubsystemResponse && this.props.projectReducer.addSubsystemResponse.message,
                    selectedTrade: null
                });
                break;
            case "Department":
                await this.props.addDepartment(projectId, trade);
                await this.setState({
                    alertMessage: this.props.projectReducer.addDepartmentResponse && this.props.projectReducer.addDepartmentResponse.message,
                    selectedTrade: null
                });
                break;
            case "Limit":
                await this.props.addLimit(projectId, trade);
                await this.setState({
                    alertMessage: this.props.projectReducer.addLimitResponse && this.props.projectReducer.addLimitResponse.message,
                    selectedTrade: null
                });
                break;

            default:
                break;
        }
        await this.refreshSettingsData();
        this.showAlerts();
    };
    updateTrade = async (type, trade, selectedtrade) => {
        const projectId = this.props.match.params.id;
        switch (type) {
            case "trade":
                await this.props.updateTrade(projectId, selectedtrade, trade);
                await this.refreshSettingsData();
                await this.setState({
                    alertMessage: this.props.projectReducer.updateTradeResponse && this.props.projectReducer.updateTradeResponse.message,
                    selectedTrade: null
                });
                this.showAlerts();
                break;
            case "category":
                await this.props.updateCategory(projectId, selectedtrade, trade);
                await this.refreshSettingsData();
                await this.setState({
                    alertMessage: this.props.projectReducer.updateCategoryResponse && this.props.projectReducer.updateCategoryResponse.message,
                    selectedTrade: null
                });
                this.showAlerts();
                break;
            case "system":
                await this.props.updateSystem(projectId, selectedtrade, trade);
                await this.refreshSettingsData();
                await this.setState({
                    alertMessage: this.props.projectReducer.updateSystemResponse && this.props.projectReducer.updateSystemResponse.message,
                    selectedTrade: null
                });
                this.showAlerts();
                break;
            case "subsystem":
                await this.props.updateSubsystem(projectId, selectedtrade, trade);
                await this.refreshSettingsData();
                await this.setState({
                    alertMessage: this.props.projectReducer.updateSubsystemResponse && this.props.projectReducer.updateSubsystemResponse.message,
                    selectedTrade: null
                });
                this.showAlerts();
                break;
            case "department":
                await this.props.updateDepartment(projectId, selectedtrade, trade);
                await this.refreshSettingsData();
                await this.setState({
                    alertMessage: this.props.projectReducer.updateDepartmentResponse && this.props.projectReducer.updateDepartmentResponse.message,
                    selectedTrade: null
                });
                this.showAlerts();
                break;
            case "limit":
                await this.props.updateGeneral(projectId, selectedtrade, trade);
                await this.refreshSettingsData();
                await this.setState({
                    alertMessage: this.props.projectReducer.updateGeneralResponse && this.props.projectReducer.updateGeneralResponse.message,
                    selectedTrade: null
                });
                this.showAlerts();
                break;
            default:
                break;
        }
    };
    getTradeById = async (tradeId, type) => {
        const projectId = this.props.match.params.id;
        switch (type) {
            case "trade":
                await this.props.getTradeById(projectId, tradeId);
                return this.props.projectReducer.getTradeByIdResponse;

            case "category":
                await this.props.getCategoryById(projectId, tradeId);
                return this.props.projectReducer.getCategoryByIdResponse;
            case "system":
                await this.props.getSystemById(projectId, tradeId);
                return this.props.projectReducer.getSystemByIdResponse;
            case "subsystem":
                await this.props.getSubsystemById(projectId, tradeId);
                return this.props.projectReducer.getSubsystemByIdResponse;
            case "department":
                await this.props.getDepartmentById(projectId, tradeId);
                return this.props.projectReducer.getDepartmentByIdResponse;
            case "limit":
                await this.props.getGeneralById(projectId, tradeId);
                return this.props.projectReducer.getGeneralByIdResponse;
            default:
                break;
        }
    };
    deleteTradeOnConfirm = async (trade, type) => {
        const projectId = this.props.match.params.id;
        switch (type) {
            case "category":
                await this.props.deleteCategory(projectId, trade);
                await this.refreshSettingsData();
                break;
            case "trade":
                await this.props.deleteTrade(projectId, trade);
                await this.refreshSettingsData();
                break;
            case "system":
                await this.props.deleteSystem(projectId, trade);
                await this.refreshSettingsData();
                break;
            case "subsystem":
                await this.props.deleteSubsystem(projectId, trade);
                await this.refreshSettingsData();
                break;
            case "department":
                await this.props.deleteDepartment(projectId, trade);
                await this.refreshSettingsData();
                break;
            case "limit":
                await this.props.deleteGeneral(projectId, trade);
                await this.refreshSettingsData();
                break;
            default:
                break;
        }
    };
    handleAddLimit = async limit => {
        const projectId = this.props.match.params.id;
        await this.props.addLimit(projectId, limit);
    };

    exportTableXl = async () => {
        const {
            match: {
                params: { section, tab }
            }
        } = this.props;
        await this.setState({ tableLoading: true });
        section === "userinfo"
            ? await this.props.exportProject({
                  user_id: this.props.match.params.id,
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order
              })
            : await this.props.exportProject({
                  search: this.state.params.search,
                  filters: this.state.params.filters,
                  list: this.state.params.list,
                  order: this.state.params.order
              });
        await this.setState({ tableLoading: false });
        if (this.props.projectReducer.projectExportResponse && this.props.projectReducer.projectExportResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.projectExportResponse.error });
            this.showAlerts();
        }
    };

    getEFCIColorCode = async params => {
        const projectId = this.props.match.params.id;
        if (projectId) {
            await this.props.getColorCodes(projectId);
            const colorCodes =
                (this.props.projectReducer && this.props.projectReducer.getColorCodes && this.props.projectReducer.getColorCodes.color_codes) || [];
            this.setState({
                colorCodes: colorCodes
            });
        }
    };

    addColor = async (name, from, to, code) => {
        this.setState({ codeLoading: true });
        const projectId = this.props.match.params.id;
        await this.props.addColorCode(projectId, {
            name: name,
            range_start: from,
            range_end: to,
            code: code
        });
        await this.getEFCIColorCode(projectId);
        this.setState({ codeLoading: false });
        const data = this.props.projectReducer && this.props.projectReducer.addColorCode && this.props.projectReducer.addColorCode.message;
        this.showAlert(data);
    };

    updateColors = async (id, name, from, to, code) => {
        this.setState({ codeLoading: true });
        const projectId = this.props.match.params.id;
        await this.props.updateColorCode(projectId, id, {
            name: name,
            range_start: from,
            range_end: to,
            code: code
        });
        await this.getEFCIColorCode(projectId);
        this.setState({ codeLoading: false });
        const data = this.props.projectReducer && this.props.projectReducer.updateColorCode && this.props.projectReducer.updateColorCode.message;
        this.showAlert(data);
    };

    deleteColors = async id => {
        this.setState({ codeLoading: true });
        const projectId = this.props.match.params.id;
        await this.props.deleteColorCode(projectId, id);
        await this.getEFCIColorCode(projectId);
        this.setState({ codeLoading: false });
        const data = this.props.projectReducer && this.props.projectReducer.deleteColorCode && this.props.projectReducer.deleteColorCode.message;
        this.showAlert(data);
    };

    showAlert = data => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = data;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };

    getLogData = async buildingId => {
        const { historyParams, historyPaginationParams } = this.state;
        await this.props.getAllProjectLogs(buildingId, historyParams);
        const {
            projectReducer: {
                getAllProjectLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.projectReducer.getAllProjectLogsResponse && this.props.projectReducer.getAllProjectLogsResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.getAllProjectLogsResponse.error });
            this.showAlerts();
        } else {
            await this.setState({
                logData: {
                    ...this.state.logData,
                    data: logs
                },
                historyPaginationParams: {
                    ...this.state.historyPaginationParams,
                    totalCount: count,
                    totalPages: Math.ceil(count / this.state.historyPaginationParams.perPage)
                }
            });
        }
        // return this.props.regionReducer.getAllLogsResponse;
    };

    getColorCodeLogData = async id => {
        const { historyParams, historyPaginationParams } = this.state;
        await this.props.getColorCodeLogs(id, historyParams);
        const {
            projectReducer: {
                colorCodeLogs: { logs, count }
            }
        } = this.props;
        if (this.props.projectReducer.colorCodeLogs && this.props.projectReducer.colorCodeLogs.error) {
            await this.setState({ alertMessage: this.props.projectReducer.colorCodeLogs.error });
            this.showAlerts();
        } else {
            await this.setState({
                logDataColorCode: {
                    ...this.state.logDataColorCode,
                    data: logs
                },
                historyPaginationParams: {
                    ...this.state.historyPaginationParams,
                    totalCount: count,
                    totalPages: Math.ceil(count / this.state.historyPaginationParams.perPage)
                }
            });
        }
        // return this.props.regionReducer.getAllLogsResponse;
    };

    handlePerPageChangeColorCodeHistory = async e => {
        const { historyPaginationParams } = this.state;
        await this.setState({
            historyPaginationParams: {
                ...historyPaginationParams,
                perPage: e.target.value,
                currentPage: 0
            },
            historyParams: {
                ...this.state.historyParams,
                offset: 0,
                limit: e.target.value
            }
        });
        await this.getColorCodeLogData(this.props.match.params.id);
    };

    handlePageClickColorCodeHistory = async page => {
        const { historyPaginationParams, historyParams } = this.state;
        await this.setState({
            historyPaginationParams: {
                ...historyPaginationParams,
                currentPage: page.selected
            },
            historyParams: {
                ...historyParams,
                offset: page.selected * historyPaginationParams.perPage
            }
        });
        await this.getColorCodeLogData(this.props.match.params.id);
    };
    // -------------------------------------colorcodelog-
    handlePageClickColorCode = async page => {
        const { logPaginationParams, logParams, selectedColumnId } = this.state;
        await this.setState({
            logPaginationParams: {
                ...logPaginationParams,
                currentPage: page.selected
            },
            logParams: {
                ...logParams,
                // offset: page.selected * paginationParams.perPage
                offset: page.selected + 1
            }
        });
        await this.showColorcodeLog(selectedColumnId);
    };
    // -----------------------------------colorcodelog---
    handleGlobalSearchHistory = async search => {
        const { historyParams, historyPaginationParams } = this.state;
        await this.setState({
            historyParams: {
                ...historyParams,
                offset: 0,
                search
            },
            historyPaginationParams: {
                ...historyPaginationParams,
                currentPage: 0
            }
        });
        await this.getLogData(this.props.match.params.id);
    };

    handlePageClickHistory = async page => {
        const { historyPaginationParams, historyParams } = this.state;
        await this.setState({
            historyPaginationParams: {
                ...historyPaginationParams,
                currentPage: page.selected
            },
            historyParams: {
                ...historyParams,
                offset: page.selected * historyPaginationParams.perPage
            }
        });
        await this.getLogData(this.props.match.params.id);
    };

    handleGlobalSearchHistory = async search => {
        const { historyParams, historyPaginationParams } = this.state;
        await this.setState({
            historyParams: {
                ...historyParams,
                offset: 0,
                search
            },
            historyPaginationParams: {
                ...historyPaginationParams,
                currentPage: 0
            }
        });
        await this.getLogData(this.props.match.params.id);
    };

    handleDeleteLog = async (id, choice) => {
        await this.setState({
            showConfirmModalLog: true,
            selectedLog: id,
            isRestoreOrDelete: choice
        });
    };

    renderConfirmationModalLog = () => {
        const { showConfirmModalLog, isRestoreOrDelete } = this.state;
        if (!showConfirmModalLog) return null;
        if (isRestoreOrDelete === "delete") {
            return (
                <Portal
                    body={
                        <ConfirmationModal
                            heading={"Do you want to delete this log?"}
                            message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                            onNo={() => this.setState({ showConfirmModalLog: false })}
                            onYes={this.deleteLogOnConfirm}
                        />
                    }
                    onCancel={() => this.setState({ showConfirmModalLog: false })}
                />
            );
        } else {
            return (
                <Portal
                    body={
                        <ConfirmationModal
                            heading={"Do you want to restore this log?"}
                            message={"This action cannot be reverted, are you sure that you need to restore this item?"}
                            onNo={() => this.setState({ showConfirmModalLog: false })}
                            onYes={this.restoreLogOnConfirm}
                            isRestore={true}
                            type={"restore"}
                        />
                    }
                    onCancel={() => this.setState({ showConfirmModalLog: false })}
                />
            );
        }
    };

    deleteLogOnConfirm = async () => {
        const { selectedLog } = this.state;
        await this.props.deleteProjectLog(selectedLog);

        if (this.props.projectReducer.deleteProjectLogResponse && this.props.projectReducer.deleteProjectLogResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.deleteProjectLogResponse.error });
            this.showAlerts();
        }
        await this.getLogData(this.props.match.params.id);
        // ------------------------------colorcodelog--
        await this.showColorcodeLog(this.state.selectedColumnId);
        // ---------------------------------colorcodelog---

        // await this.props.getMenuItems();
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        const { selectedLog } = this.state;
        await this.props.restoreProjectLog(id);
        if (this.props.projectReducer.restoreProjectLogResponse && this.props.projectReducer.restoreProjectLogResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.restoreProjectLogResponse.error });
            this.showAlerts();
        }
        await this.refreshProjectList();
    };

    updateLogSortFilters = async searchKey => {
        if (this.state.historyParams.order) {
            await this.setState({
                historyParams: {
                    ...this.state.historyParams,
                    order: {
                        ...this.state.historyParams.order,
                        [searchKey]: this.state.historyParams.order[searchKey] === "desc" ? "asc" : "desc"
                    }
                }
            });
        } else {
            await this.setState({
                historyParams: {
                    ...this.state.historyParams,
                    order: { [searchKey]: "asc" }
                }
            });
        }
        this.updateEntityParams();
        await this.getLogData(this.props.match.params.id);
    };

    getProjectImportHistory = async buildingId => {
        const { importhistoryParams, importhistoryPaginationParams, importHistoryTableData } = this.state;
        await this.props.getProjectImportHistory(buildingId, importhistoryParams);
        const {
            projectReducer: {
                getAllProjectImportHistoryResponse: { fca_sheets, count }
            }
        } = this.props;
        if (this.props.projectReducer.getAllProjectImportHistoryResponse && this.props.projectReducer.getAllProjectImportHistoryResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.getAllProjectImportHistoryResponse.error });
            this.showAlerts();
        }
        await this.setState({
            importHistoryTableData: {
                ...this.state.importHistoryTableData,
                data: fca_sheets
            },
            importhistoryPaginationParams: {
                ...this.state.importhistoryPaginationParams,
                totalCount: count,
                totalPages: Math.ceil(count / this.state.importhistoryPaginationParams.perPage)
            },
            showImportWildCardFilter: this.state.importhistoryParams.filters ? true : false
        });
        //console.log(this.state.importHistoryTableData);
        // return this.props.regionReducer.getAllLogsResponse;
    };

    handleDeleteHistory = async id => {
        await this.setState({
            showConfirmModalimportHistory: true,
            selectedHistory: id
        });
    };

    renderConfirmationModalimportHistory = () => {
        const { showConfirmModalimportHistory } = this.state;
        if (!showConfirmModalimportHistory) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this History?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModalimportHistory: false })}
                        onYes={this.deleteProjectHistoryOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModalimportHistory: false })}
            />
        );
    };

    deleteProjectHistoryOnConfirm = async () => {
        const { selectedHistory } = this.state;
        const { history } = this.props;
        await this.setState({
            showConfirmModalimportHistory: false,
            isLoading: true
        });
        await this.props.deleteProjectHistory(selectedHistory, this.props.match.params.id);
        await this.getProjectImportHistory(this.props.match.params.id);
        await this.setState({
            selectedHistory: null,
            isLoading: false
        });
    };

    handleGlobalSearchimportHistory = async search => {
        const { importhistoryParams } = this.state;
        await this.setState({
            importhistoryParams: {
                ...importhistoryParams,
                offset: 0,
                search
            },
            importhistoryPaginationParams: {
                ...this.state.importhistoryPaginationParams,
                currentPage: 0
            }
        });
        await this.getProjectImportHistory(this.props.match.params.id);
    };
    handleDownloadItem = async (url, file, type = "") => {
        if (!url) {
            this.setState({ alertMessage: "Oops..! File url not found." }, () => this.showAlerts());
        } else {
            const link = document.createElement("a");
            if (type === "logDownload") {
                // to download the file
                let blob = await fetch(url).then(r => r.blob());
                const downloadUrl = window.URL.createObjectURL(blob);
                link.href = downloadUrl;
                link.setAttribute("download", `${file}`);
            } else if (type === "logView") {
                // to open in new browser tab
                link.href = url;
                link.target = "_blank";
            } else {
                link.href = url;
                link.setAttribute("download", `${file}`);
            }
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    };
    handlePerPageChangeImportHistory = async e => {
        const { importhistoryPaginationParams } = this.state;
        await this.setState({
            importhistoryPaginationParams: {
                ...importhistoryPaginationParams,
                perPage: e.target.value,
                currentPage: 0
            },
            importHistoryParams: {
                ...this.state.importHistoryParams,
                offset: 0,
                limit: e.target.value
            }
        });
        await this.getProjectImportHistory(this.props.match.params.id);
    };

    handlePageClickImportHistory = async page => {
        const { importhistoryPaginationParams, importHistoryParams } = this.state;
        await this.setState({
            importhistoryPaginationParams: {
                ...importhistoryPaginationParams,
                currentPage: page.selected
            },
            importHistoryParams: {
                ...importHistoryParams,
                offset: page.selected * importhistoryPaginationParams.perPage
            }
        });
        await this.getProjectImportHistory(this.props.match.params.id);
    };

    updateImportTableSortFilters = async searchKey => {
        if (this.state.importhistoryParams.order) {
            await this.setState({
                importhistoryParams: {
                    ...this.state.importhistoryParams,
                    order: {
                        ...this.state.importhistoryParams.order,
                        [searchKey]: this.state.importhistoryParams.order[searchKey] === "desc" ? "asc" : "desc"
                    }
                }
            });
        } else {
            await this.setState({
                importhistoryParams: {
                    ...this.state.importhistoryParams,
                    order: { [searchKey]: "asc" }
                }
            });
        }
        this.updateEntityParams();
        await this.getProjectImportHistory(this.props.match.params.id);
    };

    resetAllImportFilters = async () => {
        await this.setState({
            // selectedRegion: null,
            importhistoryPaginationParams: {
                totalPages: 0,
                perPage: 40,
                currentPage: 0,
                totalCount: 0
            },
            importhistoryParams: {
                ...this.state.importhistoryParams,
                limit: 40,
                offset: 0,
                search: "",
                project_id: null,
                filters: null,
                list: null
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.getProjectImportHistory(this.props.match.params.id);
    };
    resetImportSort = async () => {
        await this.setState({
            importhistoryParams: {
                ...this.state.importhistoryParams,
                order: null
            }
        });
        this.updateEntityParams();
        await this.getProjectImportHistory(this.props.match.params.id);
    };

    showViewImportModal = () => {
        this.setState({
            showViewImportModal: true
        });
    };

    handleImportHideColumn = async keyItem => {
        if (keyItem !== "selectAll" && keyItem !== "deselectAll") {
            await this.setState({
                importHistoryTableData: {
                    ...this.state.importHistoryTableData,
                    config: {
                        ...this.state.importHistoryTableData.config,
                        [keyItem]: {
                            ...this.state.importHistoryTableData.config[keyItem],
                            isVisible: !this.state.importHistoryTableData.config[keyItem].isVisible
                        }
                    }
                }
            });
        } else {
            let tempConfig = this.state.importHistoryTableData.config;
            this.state.importHistoryTableData.keys.map(item => {
                if (keyItem === "selectAll") {
                    tempConfig[item].isVisible = true;
                } else {
                    tempConfig[item].isVisible = false;
                }
            });
            await this.setState({
                importHistoryTableData: {
                    ...this.state.importHistoryTableData,
                    config: tempConfig
                }
            });
        }
        await this.updateEntityParams();
        return true;
    };

    toggleImportWildCardFilter = () => {
        const { showImportWildCardFilter } = this.state;
        this.setState({
            showImportWildCardFilter: !showImportWildCardFilter
        });
    };

    updateImportWildCardFilter = async newFilter => {
        await this.setState({
            importhistoryParams: {
                ...this.state.importhistoryParams,
                offset: 0,
                filters: newFilter
            },
            importhistoryPaginationParams: {
                ...this.state.importhistoryPaginationParams,
                currentPage: 0
            }
        });
        this.updateEntityParams();
        await this.getProjectImportHistory(this.props.match.params.id);
    };

    exportImportTableXl = async () => {
        const projectId = this.props.match.params.id;
        await this.setState({ tableLoading: true });
        await this.props.exportImportProject(
            {
                search: this.state.importhistoryParams.search,
                filters: this.state.importhistoryParams.filters,
                list: this.state.importhistoryParams.list,
                order: this.state.importhistoryParams.order
            },
            projectId
        );
        await this.setState({ tableLoading: false });
        if (this.props.projectReducer.projectExportResponse && this.props.projectReducer.projectExportResponse.error) {
            await this.setState({ alertMessage: this.props.projectReducer.projectExportResponse.error });
            this.showAlerts();
        }
    };

    forceUpdateData = async (value, index, key) => {
        const { forcedChangeArray, tempArray } = this.state;
        let test = forcedChangeArray;
        this.setState({
            efciLoading: true,
            isValueChanged: true
        });
        let tempData = tempArray;
        tempData[key] = { value: parseFloat(value), index: index };
        // if (test.length) {
        let isElement = test.length && test.find(f => f.index == index);

        if (isElement) {
            test.length &&
                test.map((t, keyValue) => {
                    if (t.index == index) {
                        test[keyValue] = { value: parseFloat(value), index: index };
                    }
                });
            // test[value] = parseFloat(value)
        } else {
            test.push({ value: parseFloat(value), index: index });
        }
        // }
        this.setState({
            tempArray: tempData,
            forcedChangeArray: test
        });

        this.setState({
            efciLoading: false
        });
    };

    saveDataForce = async () => {
        const { forcedChangeArray, efciData, tempArray } = this.state;
        this.setState({
            efciLoading: true
        });
        let params = {
            project_id: this.props.match.params.id,
            fcis: forcedChangeArray
        };
        await this.props.forceUpdateProjectFundingCostEfci(params);
        await this.getEfciBasedOnProject();
        this.setState({
            efciLoading: false,
            forcedChangeArray: [],
            isValueChanged: false
        });
    };

    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            showAssignConsultancyUsers,
            showAssignClientUsers,
            clients,
            consultancy_users,
            tableData,
            selectedClient,
            infoTabsData,
            selectedRowId,
            logData,
            historyPaginationParams,
            historyParams,
            importHistoryData,
            importHistoryTableData,
            handleGlobalSearchimportHistory,
            importhistoryPaginationParams,
            showViewImportModal,
            showImportWildCardFilter,
            permissions,
            logPermission,
            isInitializingSpecialReport
        } = this.state;
        const {
            match: {
                params: { section },
                path
            }
        } = this.props;

        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {section === "energyinfo" ? (
                    <ProjectInfo
                        keys={tableData.keys}
                        projectId={this.props.match.params.id}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        handleUpdateData={this.handleUpdateProject}
                        uploadImages={this.uploadImages}
                        getAllImageList={this.getAllImageList}
                        deleteImages={this.deleteImages}
                        showInfoPage={this.showInfoPage}
                        showUploadDataModal={this.showUploadDataModal}
                        getBuildingTypeSettingsData={this.getBuildingTypeSettingsData}
                        updateBuildingTypeSettings={this.updateBuildingTypeSettings}
                        getTradeSettingsData={this.getTradeSettingsData}
                        getCategorySettingsData={this.getCategorySettingsData}
                        getDepartmentSettingsData={this.getDepartmentSettingsData}
                        getSystemSettingsData={this.getSystemSettingsData}
                        getSubsystemSettingsData={this.getSubsystemSettingsData}
                        getGeneralSettingsData={this.getGeneralSettingsData}
                        addNewData={this.addNewTrade}
                        getItem={this.getTradeById}
                        refreshProjectData={this.state.refreshProjectData}
                        updateData={this.updateTrade}
                        deleteItem={this.deleteTradeOnConfirm}
                        handleDeleteItem={this.handleDeleteProject}
                        updateSelectedRow={this.updateSelectedRow}
                        updateProjectEntityParams={this.props.updateProjectEntityParams}
                        selectedRowId={selectedRowId}
                        handleAddLimit={this.handleAddLimit}
                        colorCodes={this.state.colorCodes}
                        addColor={this.addColor}
                        codeLoading={this.state.codeLoading}
                        updateColors={this.updateColors}
                        deleteColors={this.deleteColors}
                        getEFCIColorCode={this.getEFCIColorCode}
                        getAllProjLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreProjectLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        importHistoryData={importHistoryData}
                        getAllImportHistoryLogs={this.getProjectImportHistory}
                        importHistoryTableData={importHistoryTableData}
                        handleDeleteHistory={this.handleDeleteHistory}
                        importHistoryParams={this.state.importhistoryParams}
                        handleGlobalSearchimportHistory={this.handleGlobalSearchimportHistory}
                        globalSearchKeyimportHistory={this.state.importhistoryParams.search}
                        handleDownloadItem={this.handleDownloadItem}
                        importhistoryPaginationParams={importhistoryPaginationParams}
                        handlePerPageChangeImportHistory={this.handlePerPageChangeImportHistory}
                        handlePageClickImportHistory={this.handlePageClickImportHistory}
                        updateImportTableSortFilters={this.updateImportTableSortFilters}
                        resetAllImportFilters={this.resetAllImportFilters}
                        resetImportSort={this.resetImportSort}
                        showViewImportModal={this.showViewImportModal}
                        toggleImportWildCardFilter={this.toggleImportWildCardFilter}
                        showImportWildCardFilter={showImportWildCardFilter}
                        updateImportWildCardFilter={this.updateImportWildCardFilter}
                        exportImportTableXl={this.exportImportTableXl}
                        tableLoading={this.state.tableLoading}
                        efciData={this.state.efciData}
                        efciLoading={this.state.efciLoading}
                        loadDataProject={this.loadDataProject}
                        loadData={this.loadData}
                        permissions={permissions}
                        logPermission={logPermission}
                        getEfciBasedOnProject={this.getEfciBasedOnProject}
                        saveData={this.saveData}
                        handleProjectCspSummary={this.handleProjectCspSummary}
                        updateProjectCspSummary={this.updateProjectCspSummary}
                        handleProjectAnnualEfci={this.handleProjectAnnualEfci}
                        updateProjectAnnualEFCI={this.updateProjectAnnualEFCI}
                        handleProjectAnnualFundingOption={this.handleProjectAnnualFundingOption}
                        updateProjectAnnualFunding={this.updateProjectAnnualFunding}
                        handleProjectFundingCostEfci={this.handleProjectFundingCostEfci}
                        updateProjectFundingEfci={this.updateProjectFundingEfci}
                        handleProjectEfciFundingCost={this.handleProjectEfciFundingCost}
                        updateProjectEfciFundingCost={this.updateProjectEfciFundingCost}
                        updateProjectEfciLock={this.updateProjectEfciLock}
                        initializeSpecialReport={this.initializeSpecialReport}
                        isInitializingSpecialReport={isInitializingSpecialReport}
                        showLog={this.showLog}
                        // --------------------colorcodelog-------
                        showColorcodeLog={this.showColorcodeLog}
                        // --------------colorcodelog-------------------
                        isValueChanged={this.state.isValueChanged}
                        tempArray={this.state.tempArray}
                        resetData={this.resetData}
                        forceUpdateData={this.forceUpdateData}
                        saveDataForce={this.saveDataForce}
                        updateHiddenFundingOption={this.updateHiddenFundingOption}
                        hiddenFundingOptionList={this.state.hiddenFundingOptionList}
                        hasEdit={false}
                        hasDelete={false}
                        hasLogView={false}
                        hasLogDelete={false}
                        hasLogRestore={false}
                        hasInfoPage={checkPermission("forms", "fca_projects", "view")}
                        isReportView={this.props.isReportView}
                        entity="fca_projects"
                    />
                ) : (
                    <ProjectMain
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        currentViewAllUsers={currentViewAllUsers}
                        showViewModal={this.showViewModal}
                        tableData={tableData}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={this.state.params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        selectedRowId={selectedRowId}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                        handleDeleteProject={this.handleDeleteProject}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterProject={this.getListForCommonFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        commonFilter={this.state.params.list}
                        resetAllFilters={this.resetAllFilters}
                        resetAll={this.resetAll}
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        permissions={permissions}
                        logPermission={logPermission}
                        isUser={this.props.isUser || false}
                        hasExport={checkPermission("forms", "fca_projects", "export")}
                        showAddButton={false}
                        hasEdit={false}
                        hasDelete={false}
                        hasInfoPage={checkPermission("forms", "fca_projects", "view")}
                        hasAssignToTrade={false}
                        hasAssignToSystem={false}
                        isReportView={this.props.isReportView}
                        entity="fca_projects"
                    />
                )}
                {this.renderConfirmationModal()}
                {this.renderUploadDataModal()}
                {this.renderMergeOrReplaceModalSelection()}
                {this.renderConfirmationModalLog()}
                {this.renderConfirmationModalimportHistory()}
                {showViewModal ? (
                    <Portal
                        body={
                            <ViewModal
                                keys={tableData.keys}
                                config={tableData.config}
                                handleHideColumn={this.handleHideColumn}
                                onCancel={() => this.setState({ showViewModal: false })}
                            />
                        }
                        onCancel={() => this.setState({ showViewModal: false })}
                    />
                ) : null}
                {showViewImportModal ? (
                    <Portal
                        body={
                            <ViewModal
                                keys={importHistoryTableData.keys}
                                config={importHistoryTableData.config}
                                handleHideColumn={this.handleImportHideColumn}
                                onCancel={() => this.setState({ showViewImportModal: false })}
                            />
                        }
                        onCancel={() => this.setState({ showViewImportModal: false })}
                    />
                ) : null}
                {showAssignConsultancyUsers ? (
                    <Portal
                        body={
                            <AssignConsultancyUserModal
                                onCancel={() => this.setState({ showAssignConsultancyUsers: false })}
                                userList={consultancy_users}
                            />
                        }
                        onCancel={() => this.setState({ showAssignConsultancyUsers: false })}
                    />
                ) : null}
                {showAssignClientUsers ? (
                    <Portal
                        body={<AssignClientUserModal onCancel={() => this.setState({ showAssignClientUsers: false })} userList={clients} />}
                        onCancel={() => this.setState({ showAssignClientUsers: false })}
                    />
                ) : null}
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { energyManagmentReducer } = state;
    return { energyManagmentReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...meterReadingActions,
        ...siteActions,
        ...buildingActions,
        ...CommonActions
    })(Index)
);
