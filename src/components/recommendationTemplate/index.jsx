import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";

import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import CommonActions from "../common/actions";
import ViewModal from "../common/components/ViewModal";
import recommendationTemplateActions from "./actions";
import RecommendationTemplateMain from "./components/RecommendationTemplateMain";
import Form from "./components/Form";
import Loader from "../common/components/Loader";
import { recommendationTemplateTableData } from "./components/tableConfig";
import RecommendationTemplateInfo from "./components/RecommendationTemplateInfo";
import { addToBreadCrumpData, findPrevPathFromBreadCrumpData, popBreadCrumpData, checkPermission } from "../../config/utils";
import AssignModal from "../common/components/AssignPopups/assign";

class index extends Component {
    state = {
        isLoading: false,
        errorMessage: "",
        projectList: [],
        paginationParams: this.props.recommendationTemplateReducer.entityParams[this.props.match.params.section]?.paginationParams,
        showViewModal: false,
        showWildCardFilter: false,
        showAssignConsultancyUsers: false,
        showUploadDataModal: false,
        showMergeOrReplaceModal: false,
        tableLoading: false,
        projectData: {},
        selectedRowId: this.props.recommendationTemplateReducer.entityParams[this.props.match.params.section]?.selectedRowId,
        params: this.props.recommendationTemplateReducer.entityParams[this.props.match.params.section]?.params,
        selectedBuilding: this.props.match.params.id || null,
        selectedRecommendationTemplate:
            this.props.match.params.id || this.props.recommendationTemplateReducer.entityParams[this.props.match.params.section]?.selectedEntity,
        tableData: {
            keys: recommendationTemplateTableData.keys,
            config:
                this.props.recommendationTemplateReducer.entityParams[this.props.match.params.section]?.tableConfig ||
                recommendationTemplateTableData.config
        },
        infoTabsData: [],
        alertMessage: "",
        wildCardFilterParams: this.props.recommendationTemplateReducer.entityParams[this.props.match.params.section]?.wildCardFilterParams,
        filterParams: this.props.recommendationTemplateReducer.entityParams[this.props.match.params.section]?.filterParams,
        historyPaginationParams: this.props.recommendationTemplateReducer.entityParams[this.props.match.params.section]?.historyPaginationParams,
        historyParams: this.props.recommendationTemplateReducer.entityParams[this.props.match.params.section]?.historyParams,
        logData: {
            count: "",
            data: []
        },
        showConfirmModalLog: false,
        selectedLog: "",
        isRestoreOrDelete: "",
        permissions: {},
        logPermission: {},
        showAssignModal: false,
        assignToDetails: {
            type: "",
            label: "",
            details: null,
            assignedItems: [],
            availableItems: []
        }
    };

    componentDidMount = async () => {
        const {
            match: {
                params: { section }
            }
        } = this.props;
        if (section !== "add" && section !== "edit" && section !== "recommendationtemplateinfo") {
            await this.getConfig();
            await this.refreshRecommendationTemplateList();
        }
    };

    refreshRecommendationTemplateList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        let dynamicUrl = localStorage.getItem("dynamicUrl");

        let recommendationTemplateList = [];
        let totalCount = 0;
        await this.props.getRecommendationTemplates(params, dynamicUrl);

        if (dynamicUrl?.split("/")[1] === "sub_systems") {
            recommendationTemplateList = this.props.recommendationTemplateReducer.getRecommendationTemplatesResponse
                ? this.props.recommendationTemplateReducer.getRecommendationTemplatesResponse.project_sub_system_recommendation_templates || []
                : [];
        } else if (dynamicUrl?.split("/")[1] === "master_sub_systems") {
            recommendationTemplateList = this.props.recommendationTemplateReducer.getRecommendationTemplatesResponse
                ? this.props.recommendationTemplateReducer.getRecommendationTemplatesResponse.master_sub_system_recommendation_templates || []
                : [];
        }
        totalCount = this.props.recommendationTemplateReducer.getRecommendationTemplatesResponse
            ? this.props.recommendationTemplateReducer.getRecommendationTemplatesResponse.count || 0
            : 0;

        if (recommendationTemplateList && !recommendationTemplateList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getRecommendationTemplates(this.state.params, dynamicUrl);
            recommendationTemplateList = this.props.recommendationTemplateReducer.getRecommendationTemplatesResponse
                ? this.props.recommendationTemplateReducer.getRecommendationTemplatesResponse.master_sub_system_recommendation_templates || []
                : [];
            totalCount = this.props.recommendationTemplateReducer.getRecommendationTemplatesResponse
                ? this.props.recommendationTemplateReducer.getRecommendationTemplatesResponse.count || 0
                : 0;
        }
        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.recommendationTemplates
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.recommendationTemplates || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.recommendationTemplate_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.recommendationTemplate_logs || {}
                : {};

        if (
            recommendationTemplateList &&
            !recommendationTemplateList.length &&
            this.props.recommendationTemplateReducer.getRecommendationTemplatesResponse &&
            this.props.recommendationTemplateReducer.getRecommendationTemplatesResponse.error
        ) {
            await this.setState({ alertMessage: this.props.recommendationTemplateReducer.getRecommendationTemplatesResponse.error });
            this.showAlert();
        }
        this.setState({
            tableData: {
                ...tableData,
                data: recommendationTemplateList,
                config: this.props.recommendationTemplateReducer.entityParams[this.props.match.params.section]?.tableConfig || tableData.config
            },
            recommendationTemplateList,
            showWildCardFilter: this.state.params?.filters ? true : false,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams?.perPage)
            },
            permissions: project_permission,
            logPermission: region_logs,
            isLoading: false
        });
        this.updateEntityParams();
        return true;
    };

    getConfig = async () => {
        // await this.setState({
        //     selectedRegion: null,
        //     paginationParams: {
        //         totalPages: 0,
        //         perPage: 40,
        //         currentPage: 0,
        //         totalCount: 0
        //     },
        //     params: {
        //         ...this.state.params,
        //         limit: 40,
        //         offset: 0,
        //         search: "",
        //         project_id: null,
        //         filters: null,
        //         list: null,
        //         order: null
        //     },

        //     wildCardFilterParams: {},
        //     filterParams: {},
        //     selectedRowId: null
        // });
        // console.log("bv",recommendationTemplateTableData.config["text_format"] );
        if (recommendationTemplateTableData.config) {
            let dynamicUrl = localStorage.getItem("dynamicUrl");
            let tempKeys = this.state.tableData.keys;
            let tempConfig = this.state.tableData.config;
            if (dynamicUrl?.split("/")[1] === "sub_systems") {
                tempConfig["name"] = {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "project_sub_system_recommendation_templates.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "project_sub_system_recommendation_templates",
                    commonSearchKey: "project_sub_system_recommendation_templates",
                    commonSearchObjectKey: "name"
                };
                tempConfig["text_format"] = {
                    isVisible: true,
                    label: "Template",
                    class: "",
                    searchKey: "project_sub_system_recommendation_templates.text_format",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "project_sub_system_recommendation_templates",
                    commonSearchKey: "project_sub_system_recommendation_templates",
                    commonSearchObjectKey: "text_format"
                };
                tempConfig["cost_per_unit"] = {
                    isVisible: true,
                    label: "Cost Per Unit",
                    class: "width-140px",
                    searchKey: "project_sub_system_recommendation_templates.cost_per_unit",
                    type: "number",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "project_sub_system_recommendation_templates",
                    commonSearchKey: "project_sub_system_recommendation_templates",
                    commonSearchObjectKey: "cost_per_unit"
                };
                tempConfig["unit"] = {
                    isVisible: true,
                    label: "Unit",
                    class: "width-120px",
                    searchKey: "project_sub_system_recommendation_templates.unit",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "project_sub_system_recommendation_templates",
                    commonSearchKey: "project_sub_system_recommendation_templates",
                    commonSearchObjectKey: "unit"
                };
                tempConfig["description"] = {
                    isVisible: true,
                    label: "Report Notes",
                    class: "",
                    isTextArea: true,
                    searchKey: "project_sub_system_recommendation_templates.description",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "project_sub_system_recommendation_templates",
                    commonSearchKey: "project_sub_system_recommendation_templates",
                    commonSearchObjectKey: "description"
                };
                tempConfig["created_at"] = {
                    isVisible: true,
                    label: "Created At",
                    class: "",
                    searchKey: "project_sub_system_recommendation_templates.created_at",
                    type: "date",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "project_sub_system_recommendation_templates",
                    commonSearchKey: "project_sub_system_recommendation_templates",
                    commonSearchObjectKey: "created_at"
                };
                tempConfig["updated_at"] = {
                    isVisible: true,
                    label: "Updated At",
                    class: "",
                    searchKey: "project_sub_system_recommendation_templates.updated_at",
                    type: "date",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "project_sub_system_recommendation_templates",
                    commonSearchKey: "project_sub_system_recommendation_templates",
                    commonSearchObjectKey: "updated_at"
                };
                await this.setState({
                    tableData: {
                        ...this.state.tableData,
                        keys: tempKeys,
                        config: tempConfig
                    }
                });
            } else if (dynamicUrl?.split("/")[1] === "master_sub_systems") {
                tempConfig["name"] = {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "master_sub_system_recommendation_templates.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "master_sub_system_recommendation_templates",
                    commonSearchKey: "master_sub_system_recommendation_templates",
                    commonSearchObjectKey: "name"
                };
                tempConfig["text_format"] = {
                    isVisible: true,
                    label: "Template",
                    class: "",
                    searchKey: "master_sub_system_recommendation_templates.text_format",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "master_sub_system_recommendation_templates",
                    commonSearchKey: "master_sub_system_recommendation_templates",
                    commonSearchObjectKey: "text_format"
                };
                tempConfig["cost_per_unit"] = {
                    isVisible: true,
                    label: "Cost Per Unit",
                    class: "width-140px",
                    searchKey: "master_sub_system_recommendation_templates.cost_per_unit",
                    type: "number",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "master_sub_system_recommendation_templates",
                    commonSearchKey: "master_sub_system_recommendation_templates",
                    commonSearchObjectKey: "cost_per_unit"
                };
                tempConfig["unit"] = {
                    isVisible: true,
                    label: "Unit",
                    class: "width-120px",
                    searchKey: "master_sub_system_recommendation_templates.unit",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "master_sub_system_recommendation_templates",
                    commonSearchKey: "master_sub_system_recommendation_templates",
                    commonSearchObjectKey: "unit"
                };
                tempConfig["description"] = {
                    isVisible: true,
                    label: "Report Notes",
                    class: "",
                    isTextArea: true,
                    searchKey: "master_sub_system_recommendation_templates.description",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "master_sub_system_recommendation_templates",
                    commonSearchKey: "master_sub_system_recommendation_templates",
                    commonSearchObjectKey: "description"
                };
                tempConfig["created_at"] = {
                    isVisible: true,
                    label: "Created At",
                    class: "",
                    searchKey: "master_sub_system_recommendation_templates.created_at",
                    type: "date",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "master_sub_system_recommendation_templates",
                    commonSearchKey: "master_sub_system_recommendation_templates",
                    commonSearchObjectKey: "created_at"
                };
                tempConfig["updated_at"] = {
                    isVisible: true,
                    label: "Updated At",
                    class: "",
                    searchKey: "master_sub_system_recommendation_templates.updated_at",
                    type: "date",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "master_sub_system_recommendation_templates",
                    commonSearchKey: "master_sub_system_recommendation_templates",
                    commonSearchObjectKey: "updated_at"
                };
                await this.setState({
                    tableData: {
                        ...this.state.tableData,
                        keys: tempKeys,
                        config: tempConfig
                    }
                });
            }
        }
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
        await this.refreshRecommendationTemplateList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "RecommendationTemplate",
            selectedEntity: this.state.selectedRegion,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams
        };
        await this.props.updateRecommendationTemplateEntityParams(entityParams, this.props.match.params.section);
    };

    resetAllFilters = async () => {
        await this.setState({
            selectedRegion: null,
            paginationParams: {
                totalPages: 0,
                perPage: 40,
                currentPage: 0,
                totalCount: 0
            },
            params: {
                ...this.state.params,
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
        await this.refreshRecommendationTemplateList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshRecommendationTemplateList();
    };

    getListForCommonFilter = async params => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        const { search, filters, list } = this.state.params;
        await this.props.getListForCommonFilter({ ...params, search, filters, list }, dynamicUrl);
        return (
            (this.props.recommendationTemplateReducer.getListForCommonFilterResponse &&
                this.props.recommendationTemplateReducer.getListForCommonFilterResponse.list) ||
            []
        );
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
        await this.refreshRecommendationTemplateList();
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
        await this.refreshRecommendationTemplateList();
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
        await this.refreshRecommendationTemplateList();
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
        await this.refreshRecommendationTemplateList();
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

    showEditPage = async recommendationTemplateId => {
        const { history } = this.props;
        await this.setState({
            selectedRecommendationTemplate: recommendationTemplateId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit RecommendationTemplate",
            path: `/recommendationtemplate/edit/${recommendationTemplateId}`,
            isInnerTab: true
        });
        history.push(`/recommendationtemplate/edit/${recommendationTemplateId}`);
    };

    showAddForm = () => {
        const { history } = this.props;

        this.setState({
            selectedRecommendationTemplate: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add RecommendationTemplate",
            path: `/recommendationtemplate/add`,
            isInnerTab: true
        });
        history.push(`/recommendationtemplate/add`);
    };

    showViewModal = () => {
        this.setState({
            showViewModal: true
        });
    };

    toggleWildCardFilter = () => {
        const { showWildCardFilter } = this.state;
        this.setState({
            showWildCardFilter: !showWildCardFilter
        });
    };

    handleAddRecommendationTemplate = async recommendationTemplate => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        if (dynamicUrl?.split("/")[1] === "sub_systems") {
            recommendationTemplate.sub_system_id = dynamicUrl.split("/")[2];
            await this.props.addRecommendationTemplate({ project_sub_system_recommendation_template: recommendationTemplate }, dynamicUrl);
        } else if (dynamicUrl?.split("/")[1] === "master_sub_systems") {
            recommendationTemplate.master_sub_system_id = dynamicUrl.split("/")[2];
            await this.props.addRecommendationTemplate({ master_sub_system_recommendation_template: recommendationTemplate }, dynamicUrl);
        }
        if (
            this.props.recommendationTemplateReducer.addRecommendationTemplateResponse &&
            this.props.recommendationTemplateReducer.addRecommendationTemplateResponse.error
        ) {
            await this.setState({
                alertMessage: this.props.recommendationTemplateReducer.addRecommendationTemplateResponse.error
            });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    this.props.recommendationTemplateReducer.addRecommendationTemplateResponse &&
                    this.props.recommendationTemplateReducer.addRecommendationTemplateResponse.message
            });
            this.showAlert();
            await this.refreshRecommendationTemplateList();
            history.push(findPrevPathFromBreadCrumpData() || `/subSystem/subSysteminfo/${dynamicUrl.split("/")[2]}/assignedrecommendationtemplate`);
        }
    };

    handleUpdateRecommendationTemplate = async (recommendationTemplate_id, recommendationTemplate) => {
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        if (dynamicUrl?.split("/")[1] === "sub_systems") {
            recommendationTemplate.sub_system_id = dynamicUrl.split("/")[2];
            await this.props.updateRecommendationTemplate(
                recommendationTemplate_id,
                { project_sub_system_recommendation_template: recommendationTemplate },
                dynamicUrl
            );
        } else if (dynamicUrl?.split("/")[1] === "master_sub_systems") {
            recommendationTemplate.master_sub_system_id = dynamicUrl.split("/")[2];
            await this.props.updateRecommendationTemplate(
                recommendationTemplate_id,
                { master_sub_system_recommendation_template: recommendationTemplate },
                dynamicUrl
            );
        }
        if (
            this.props.recommendationTemplateReducer.updateRecommendationTemplateResponse &&
            this.props.recommendationTemplateReducer.updateRecommendationTemplateResponse.error
        ) {
            await this.setState({ alertMessage: this.props.recommendationTemplateReducer.updateRecommendationTemplateResponse.error });
            this.showAlert();
        } else {
            this.setState({
                alertMessage:
                    (this.props.recommendationTemplateReducer.updateRecommendationTemplateResponse &&
                        this.props.recommendationTemplateReducer.updateRecommendationTemplateResponse.message) ||
                    "RecommendationTemplate updated successfully"
            });
            this.showAlert();
            await this.refreshRecommendationTemplateList();
            history.push(findPrevPathFromBreadCrumpData() || `/subSystem/subSysteminfo/${dynamicUrl.split("/")[2]}/assignedrecommendationtemplate`);
        }
    };

    showAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };

    handleDeleteRecommendationTemplate = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedRecommendationTemplate: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this RecommendationTemplate?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteRecommendationTemplateOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteRecommendationTemplateOnConfirm = async () => {
        const { selectedRecommendationTemplate } = this.state;
        const { history } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.deleteRecommendationTemplate(selectedRecommendationTemplate, dynamicUrl);
        if (
            this.props.recommendationTemplateReducer.deleteRecommendationTemplateResponse &&
            this.props.recommendationTemplateReducer.deleteRecommendationTemplateResponse.error
        ) {
            await this.setState({ alertMessage: this.props.recommendationTemplateReducer.deleteRecommendationTemplateResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            this.showAlert();
        } else {
            await this.refreshRecommendationTemplateList();
            this.setState({
                showConfirmModal: false,
                selectedBuilding: null
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/recommendationtemplate");
            }
        }
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
        await this.refreshRecommendationTemplateList();
    };

    showInfoPage = (projectId, id, rowData) => {
        const { history } = this.props;
        this.setState({
            selectedBuilding: projectId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Basic Details",
                    path: `/recommendationtemplate/recommendationtemplateinfo/${projectId}/basicdetails`
                }
            ]
        });
        let tabKeyList = ["basicdetails"];
        if (rowData) {
            addToBreadCrumpData({
                key: "templateName",
                name: rowData?.name,
                isInnerTab: true,
                path: `/recommendationtemplate/recommendationtemplateinfo/${rowData.id}/basicdetails`
            });
            addToBreadCrumpData({
                key: "info",
                name: "Basic Details",
                isInnerTab: true,
                path: `/recommendationtemplate/recommendationtemplateinfo/${rowData.id}/basicdetails`
            });
        }
        history.push(
            `/recommendationtemplate/recommendationtemplateinfo/${projectId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }`
        );
    };

    getDataById = async recommendationTemplateId => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        await this.props.getRecommendationTemplateById(recommendationTemplateId, dynamicUrl);
        return this.props.recommendationTemplateReducer.getRecommendationTemplateByIdResponse;
    };

    exportTableXl = async () => {
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        const {
            tableData: { keys, config }
        } = this.state;
        await this.setState({ tableLoading: true });
        let hide_columns = [""];
        keys.map((keyItem, i) => {
            if (config && !config[keyItem]?.isVisible) {
                hide_columns.push(config[keyItem]?.label);
            }
        });
        await this.props.exportRecommendationTemplates(dynamicUrl, {
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            hide_columns
        });
        this.setState({ tableLoading: false });
        if (
            this.props.recommendationTemplateReducer.recommendationTemplateExportResponse &&
            this.props.recommendationTemplateReducer.recommendationTemplateExportResponse.error
        ) {
            await this.setState({ alertMessage: this.props.recommendationTemplateReducer.recommendationTemplateExportResponse.error });
            this.showAlert();
        }
    };

    getLogData = async buildingId => {
        const { historyParams } = this.state;
        await this.props.getAllRecommendationTemplateLogs(buildingId, historyParams);
        const {
            recommendationTemplateReducer: {
                getAllRecommendationTemplateLogsResponse: { logs, count }
            }
        } = this.props;
        if (
            this.props.recommendationTemplateReducer.getAllRecommendationTemplateLogsResponse &&
            this.props.recommendationTemplateReducer.getAllRecommendationTemplateLogsResponse.error
        ) {
            await this.setState({ alertMessage: this.props.recommendationTemplateReducer.getAllRecommendationTemplateLogsResponse.error });
            this.showAlert();
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
    };

    handlePerPageChangeHistory = async e => {
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
        await this.props.deleteRecommendationTemplateLog(selectedLog);
        if (
            this.props.recommendationTemplateReducer.deleteRecommendationTemplateLogResponse &&
            this.props.recommendationTemplateReducer.deleteRecommendationTemplateLogResponse.error
        ) {
            await this.setState({ alertMessage: this.props.recommendationTemplateReducer.deleteRecommendationTemplateLogResponse.error });
            this.showAlert();
        }
        await this.getLogData(this.props.match.params.id);
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        await this.props.restoreRecommendationTemplateLog(id);
        if (
            this.props.recommendationTemplateReducer.restoreRecommendationTemplateLogResponse &&
            this.props.recommendationTemplateReducer.restoreRecommendationTemplateLogResponse.error
        ) {
            await this.setState({ alertMessage: this.props.recommendationTemplateReducer.restoreRecommendationTemplateLogResponse.error });
            this.showAlert();
        }
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

    renderAssignModalLog = () => {
        const { showAssignModal, assignToDetails } = this.state;
        if (!showAssignModal) return null;
        return (
            <Portal
                body={
                    <AssignModal
                        assignTo={assignToDetails.label}
                        type={assignToDetails.type}
                        itemDetails={assignToDetails.details}
                        availableItems={assignToDetails.availableItems}
                        assignedItems={assignToDetails.assignedItems}
                        onCancel={() => this.setState({ showAssignModal: false })}
                        onAssign={this.onAssignItem}
                    />
                }
                onCancel={() => this.setState({ showAssignModal: false })}
            />
        );
    };

    handleAssignToTrade = async item => {
        const { assignToDetails } = this.state;
        await this.props.getAssignModalDetails(item.id, "trades");
        const {
            recommendationTemplateReducer: {
                getAssignModalDetailsResponse: { trades }
            }
        } = this.props;

        await this.setState({
            assignToDetails: {
                ...assignToDetails,
                type: "trade",
                label: "Trades",
                details: item,
                availableItems: trades && (trades.available_trades || []),
                assignedItems: trades && (trades.assigned_trades || [])
            },
            showAssignModal: true
        });
    };

    handleAssignToSystem = async item => {
        const { assignToDetails } = this.state;
        await this.props.getAssignModalDetails(item.id, "systems");
        const {
            recommendationTemplateReducer: {
                getAssignModalDetailsResponse: { systems }
            }
        } = this.props;
        await this.setState({
            assignToDetails: {
                ...assignToDetails,
                type: "system",
                label: "Systems",
                details: item,
                availableItems: systems && (systems.available_systems || []),
                assignedItems: systems && (systems.assigned_systems || [])
            },
            showAssignModal: true
        });
    };

    handleAssignToSubSystem = async item => {
        const { assignToDetails } = this.state;
        await this.props.getAssignModalDetails(item.id, "sub_systems");
        const {
            recommendationTemplateReducer: {
                getAssignModalDetailsResponse: { sub_systems }
            }
        } = this.props;
        await this.setState({
            assignToDetails: {
                ...assignToDetails,
                type: "subsystem",
                label: "Sub Systems",
                details: item,
                availableItems: sub_systems && (sub_systems.available_sub_systems || []),
                assignedItems: sub_systems && (sub_systems.assigned_sub_systems || [])
            },
            showAssignModal: true
        });
    };

    onAssignItem = async data => {
        const { assignToDetails } = this.state;
        if (assignToDetails.type === "trade") {
            await this.props.assignItems(assignToDetails.details.id, { master_trade_ids: data }, "assign_trades");
        } else if (assignToDetails.type === "system") {
            await this.props.assignItems(assignToDetails.details.id, { master_system_ids: data }, "assign_systems");
        } else if (assignToDetails.type === "subsystem") {
            await this.props.assignItems(assignToDetails.details.id, { master_sub_system_ids: data }, "assign_sub_systems");
        }
        const {
            recommendationTemplateReducer: {
                assignItemsResponse: { success, message }
            }
        } = this.props;
        await this.setState({ alertMessage: message });
        this.showAlert();
        if (success) {
            this.setState({
                showAssignModal: false
            });
        }
    };

    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            tableData,
            infoTabsData,
            selectedRecommendationTemplate,
            selectedRowId,
            logData,
            historyPaginationParams,
            historyParams,
            permissions,
            logPermission
        } = this.state;
        const {
            match: {
                params: { section, id }
            },
            hasAssign = true,
            hasEdit = true,
            hasAdd = true
        } = this.props;
        let dynamicUrl = localStorage.getItem("dynamicUrl");
        let isProjectSettings = dynamicUrl?.split("/")[1] === "sub_systems" ? true : false;
        let permissionKey = isProjectSettings ? "project_recommendation_templates" : "master_recommendation_templates";
        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {section === "add" || section === "edit" ? (
                    <Form
                        selectedRecommendationTemplate={id || selectedRecommendationTemplate}
                        handleAddRecommendationTemplate={this.handleAddRecommendationTemplate}
                        handleUpdateRecommendationTemplate={this.handleUpdateRecommendationTemplate}
                        getDataById={this.getDataById}
                    />
                ) : section === "recommendationtemplateinfo" ? (
                    <RecommendationTemplateInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        getDataById={this.getDataById}
                        showInfoPage={this.showInfoPage}
                        handleDeleteItem={this.handleDeleteRecommendationTemplate}
                        getAllFlooLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreRecommendationTemplateLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasEdit={hasEdit && checkPermission("forms", permissionKey, "edit")}
                        hasDelete={checkPermission("forms", permissionKey, "delete")}
                        hasLogView={checkPermission("logs", permissionKey, "view")}
                        hasLogDelete={checkPermission("logs", permissionKey, "delete")}
                        hasLogRestore={checkPermission("logs", permissionKey, "restore")}
                        hasInfoPage={checkPermission("forms", permissionKey, "view")}
                        entity={permissionKey}
                    />
                ) : (
                    <RecommendationTemplateMain
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        currentViewAllUsers={currentViewAllUsers}
                        showViewModal={this.showViewModal}
                        tableData={tableData}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={this.state.params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        selectedRowId={selectedRowId}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                        handleDeleteRecommendationTemplate={this.handleDeleteRecommendationTemplate}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterRecommendationTemplate={this.getListForCommonFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        commonFilter={this.state.params.list}
                        resetAllFilters={this.resetAllFilters}
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        tableLoading={this.state.tableLoading}
                        exportTableXl={this.exportTableXl}
                        permissions={permissions}
                        logPermission={logPermission}
                        hasAssignToTrade={false}
                        hasAssignToSystem={false}
                        hasAssignToSubSystem={hasAssign}
                        handleAssignToTrade={this.handleAssignToTrade}
                        handleAssignToSystem={this.handleAssignToSystem}
                        handleAssignToSubSystem={this.handleAssignToSubSystem}
                        hasExport={checkPermission("forms", permissionKey, "export")}
                        showAddButton={hasAdd && checkPermission("forms", permissionKey, "create")}
                        hasEdit={hasEdit && checkPermission("forms", permissionKey, "edit")}
                        hasDelete={checkPermission("forms", permissionKey, "delete")}
                        hasInfoPage={checkPermission("forms", permissionKey, "view")}
                        entity={permissionKey}
                    />
                )}
                {this.renderConfirmationModal()}
                {this.renderConfirmationModalLog()}
                {this.renderAssignModalLog()}
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
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { projectReducer, commonReducer, recommendationTemplateReducer } = state;
    return { projectReducer, commonReducer, recommendationTemplateReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...recommendationTemplateActions,
        ...CommonActions
    })(index)
);
