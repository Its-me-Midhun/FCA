import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import LoadingOverlay from "react-loading-overlay";

import recommendationsActions from "../recommendations/actions";
import initativeAction from "../initiatives/actions";
import Loader from "../common/components/Loader";
import InfoTabs from "../common/components/InfoTabs";
import InitiativeMain from "./components/InitiativeMain";
import { initiativeTableData } from "../../config/tableData";
import {
    addToBreadCrumpData,
    findPrevPathFromBreadCrump,
    findPrevPathFromBreadCrumpData,
    findPrevPathFromBreadCrumpRecData,
    popBreadCrumpRecData,
    resetBreadCrumpData,
    popBreadCrumpData
} from "../../config/utils";
import _ from "lodash";
import Recommendation from "../recommendations";
import regionActions from "../region/actions";
import Form from "./components/Form";
import ConfirmationModal from "../common/components/ConfirmationModal";
import Portal from "../common/components/Portal";
import BasicDetails from "./components/basicDetails";
import EditHistory from "../region/components/EditHistory";
import AssignModal from "../initiatives/components/assignProject";
import ViewModal from "../common/components/ViewModal";
import HelperIcon from "../helper/components/HelperIcon";
import Documents from "../documents/index";

class index extends Component {
    state = {
        isLoading: false,
        errorMessage: "",
        confirmUnAssign: false,
        infoTabsData: [
            {
                key: "initiatives",
                name: "Project Initiatives",
                path: `/initiatives`
            },
            {
                key: "recommendations",
                name: "Recommendations",
                path: `/initiatives/initiativeInfo/recommendations`
            }
        ],
        infosubTabsData: [],
        selectedInitiative: {},
        showConfirmModalLogModal: false,
        tableData: {
            keys: initiativeTableData.keys,
            config: this.props.initativeReducer.entityParams.tableConfig || _.cloneDeep(initiativeTableData.config)
        },
        showWildCardFilter: false,
        initiativeList: [],
        params: this.props.initativeReducer.entityParams.params,
        paginationParams: this.props.initativeReducer.entityParams.paginationParams,

        wildCardFilterParams: this.props.initativeReducer.entityParams.wildCardFilterParams,
        filterParams: this.props.initativeReducer.entityParams.filterParams,
        historyPaginationParams: this.props.initativeReducer.entityParams.historyPaginationParams,
        historyParams: this.props.initativeReducer.entityParams.historyParams,
        selectedDropdown: this.props.initativeReducer.entityParams.selectedDropdown || "",
        assignModal: false,
        recomentationIds: [],
        showViewModal: false,
        basicDetails: {
            code: "",
            name: "",
            performed_by: "",
            status: "pending",
            initiative_type: "",
            actual_cost: "",
            client_id: "",
            consultancy_id: "",
            project_id: "",
            funding: "",
            total_sf: "",
            recommendations_cost: "",
            recommendations_count: "",
            identifier: "",
            description: "",
            note: ""
        },
        isHistory: false,
        logChanges: {},
        associated_changes: [],
        breadCrumbsData: [{ key: "main", name: "Initiatives", path: "/initiatives" }],
        logPermission: {},
        logData: {
            count: "",
            data: []
        },
        initiativeIds: [],
        idList: [],
        recommendationParams: this.props.recommendationsReducer.entityParams[this.props.match.params.section],
        submitAssign: false
    };

    componentDidMount = async () => {
        if (
            this.props.match.params.tab == "basicdetails" ||
            this.props.match.params.tab == "recommendation" ||
            this.props.match.params.tab == "documents"
        ) {
            await this.refreshinfoDetails();
            await this.showInfoPage(this.props.match.params.id);
            await this.refreshInitiativesList();
        } else {
            this.setState({
                infoTabsData: [
                    {
                        key: "initiatives",
                        name: "Project Initiatives",
                        path: `/initiatives`
                    },
                    {
                        key: "recommendations",
                        name: "Recommendations",
                        path: `/initiatives/initiativeInfo/recommendations`
                    }
                ]
            });
            await this.refreshInitiativesList();
        }
    };

    componentDidUpdate = async (prevProps, prevState) => {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            if (this.props.match.params.id) {
                this.showInfoPage(this.props.match.params.id);
            }
            await this.refreshinfoDetails();
        }
        if (prevProps.recommendationsReducer.getAllRecommendationsResponse != this.props.recommendationsReducer.getAllRecommendationsResponse) {
            if (
                this.props.recommendationsReducer.getAllRecommendationsResponse &&
                this.props.recommendationsReducer.getAllRecommendationsResponse.initiative_ids
            ) {
                this.setState(
                    {
                        idList: this.props.recommendationsReducer.getAllRecommendationsResponse.initiative_ids,
                        // selectedDropdown: "assigned",
                        params: {
                            ...this.state.params,
                            initiative_ids: this.props.recommendationsReducer.getAllRecommendationsResponse.initiative_ids
                            // view: "assigned",
                        }
                    },
                    () => this.refreshInitiativesList()
                );
            }
        }
    };

    refreshInitiativesList = async () => {
        this.setState({
            isLoading: true
        });
        const { params, paginationParams } = this.state;
        let totalCount = 0;
        let initiativeList = [];
        await this.props.getAllInitiatives(params);
        this.setState({
            isLoading: false
        });
        const { getAllInitiatives } = this.props.initativeReducer;
        totalCount = this.props.initativeReducer.getAllInitiatives.count;
        let initiative_logs = {};
        initiative_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.initiative_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.initiative_logs || {}
                : {};

        this.setState({
            initiativeList: getAllInitiatives,
            tableData: {
                ...this.state.tableData,
                data: getAllInitiatives && getAllInitiatives.initiatives,
                config: this.props.initativeReducer.entityParams.tableConfig || this.state.tableData.config
            },
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            showWildCardFilter: this.state.params.filters ? true : false,
            logPermission: initiative_logs
        });
        this.updateEntityParams();
    };

    updateEntityParams = async value => {
        let entityParams = {
            entity: "Initiatives",
            selectedEntity: this.state.selectedRegion,
            paginationParams: this.state.paginationParams,
            params: this.state.params,
            wildCardFilterParams: this.state.wildCardFilterParams,
            filterParams: this.state.filterParams,
            tableConfig: this.state.tableData.config,
            selectedRowId: this.state.selectedRowId,
            historyPaginationParams: this.state.historyPaginationParams,
            historyParams: this.state.historyParams,
            selectedDropdown: this.state.selectedDropdown
        };
        await this.props.updateInitiativeEntityParams(entityParams);

        const { getAllInitiatives } = this.props.initativeReducer;
        let recomentationEntityParams = {
            ...this.props.recommendationsReducer.entityParams[this.props.match.params.section],
            initiative_ids: (getAllInitiatives && getAllInitiatives.initiative_ids) || []
        };

        await this.props.updateRecommendationEntityParams(recomentationEntityParams);
    };

    updateSelectedRow = async rowId => {
        await this.setState({
            selectedRowId: rowId
        });
        await this.updateEntityParams();
    };
    toggleWildCardFilter = () => {
        const { showWildCardFilter } = this.state;
        this.setState({
            showWildCardFilter: !showWildCardFilter
        });
    };

    handleAssignConsultancyUsersModal = async recommendationsData => {
        this.setState({
            showAssignConsultancyUsers: true
        });
    };

    handleAssignClientUsersModal = async recommendationsData => {
        this.setState({
            showAssignClientUsers: true
        });
    };

    // setInFoPage = siteId => {
    //     const { history } = this.props;
    //     const {
    //         location: { search },
    //         match: {
    //             params: { section, id }
    //         }
    //     } = this.props;
    //     let tempSearch = search;
    //     this.setState({
    //         infoTabsData: [
    //             {
    //                 key: "initiatives",
    //                 name: "Initiatives",
    //                 path: `/initiatives`
    //             },
    //             {
    //                 key: "recommendations",
    //                 name: "Recommendation",
    //                 path: `/initiatives/initiativeInfo/recommendations`
    //             },

    //         ]
    //     });

    // };

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
        await this.refreshInitiativesList();
    };

    handleDeleteInitiatives = async (id, isDeleted) => {
        await this.setState({
            showConfirmModal: true,
            selectedInitiative: id,
            isDeleted: isDeleted
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal, isDeleted } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Initiative?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteInitiativeOnConfirm}
                        // onHardDelete={this.deleteInitiativeOnConfirm}
                        // isHard={true}
                        isDeleted={isDeleted}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteInitiativeOnConfirm = async (ishardDelete = false) => {
        const { selectedInitiative } = this.state;

        // if (ishardDelete) {
        //     await this.props.deleteInitiatives(selectedInitiative, true);
        // } else {
        await this.props.deleteInitiatives(selectedInitiative);

        // }
        if (this.props.initativeReducer.deleteInitiatives && this.props.initativeReducer.deleteInitiatives.error) {
            await this.setState({
                alertMessage: this.props.initativeReducer.deleteInitiatives.error,
                showConfirmModal: false,
                isRedirectionOnDelete: false,
                selectedInitiative: null
            });
            this.showAlert();
        } else {
            if (this.props.initativeReducer.deleteInitiatives && this.props.initativeReducer.deleteInitiatives.success) {
                await this.setState({
                    alertMessage: this.props.initativeReducer.deleteInitiatives.message
                });
                this.showAlert();
            }
            await this.refreshInitiativesList();
            // await this.props.getMenuItems();
            // popBreadCrumpRecData();
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpRecData();
                // const redirectionurl = findPrevPathFromBreadCrumpRecData();
                this.props.history.push(findPrevPathFromBreadCrumpData() || "/initiatives");
                // this.props.history.push(redirectionurl[2].path || "/recommendations");
            }
            this.setState({
                showConfirmModal: false,
                isRedirectionOnDelete: false,
                selectedInitiative: null
            });
        }
    };

    showEditPage = initiativeId => {
        const { history } = this.props;
        this.setState({
            selectedInitiative: initiativeId
        });
        addToBreadCrumpData({
            key: "edit",
            name: "Edit Initiative",
            path: `/initiatives/edit/${initiativeId}`
        });
        history.push(`/initiatives/edit/${initiativeId}`);
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
        await this.refreshInitiativesList();
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
        await this.refreshInitiativesList();
    };
    showAddForm = () => {
        const { history } = this.props;
        this.setState({
            selectedInitiative: null
        });
        addToBreadCrumpData({
            key: "add",
            name: "Add Initiative",
            path: `/initiatives/add`
        });
        history.push(`/initiatives/add`);
    };

    showViewModal = () => {
        this.setState({
            showViewModal: true
        });
    };

    showInfoPage = async (initiativeId, pid) => {
        const { history } = this.props;
        // let pid = this.props.initativeReducer.getInitiativeById
        //     && this.props.initativeReducer.getInitiativeById.project
        //     && this.props.initativeReducer.getInitiativeById.project.id
        let tempSearch = `?pid=${pid}`;
        if (!pid) {
            await this.getDataById(initiativeId);
            pid =
                this.props.initativeReducer.getInitiativeById &&
                this.props.initativeReducer.getInitiativeById.project &&
                this.props.initativeReducer.getInitiativeById.project.id;
            tempSearch = `?pid=${pid}`;
        }
        this.setState({
            infosubTabsData: [
                {
                    key: "basicdetails",
                    name: "Initiative",
                    path: `/initiatives/initiativeInfo/${initiativeId}/basicdetails${tempSearch}`
                },
                {
                    key: "recommendation",
                    name: "Recommendations",
                    path: `/initiatives/initiativeInfo/${initiativeId}/recommendation${tempSearch}`
                },
                {
                    key: "documents",
                    name: "Documents",
                    path: `/initiatives/initiativeInfo/${initiativeId}/documents${tempSearch}`
                }
            ]
        });
        let tabKeyList = ["basicdetails", "recommendation", "documents"];
        if (pid) {
            history.push(
                `/initiatives/initiativeInfo/${initiativeId}/${
                    this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
                }${tempSearch}`
            );
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
        await this.refreshInitiativesList();
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

    getListForCommonFilter = async params => {
        const {
            match: {
                params: { section }
            }
        } = this.props;

        const { search, filters, list } = this.state.params;
        params.search = search;
        params.filters = filters;
        params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field)) : null;
        params.view = this.state.params.view;
        await this.props.getListForCommonFilterInitiatives(params);
        return (this.props.initativeReducer.getListForCommonFilterResponse && this.props.initativeReducer.getListForCommonFilterResponse.list) || [];
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
        await this.refreshInitiativesList();
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
                list: null,
                deleted: null,
                locked: null,
                unlocked: null,
                active: null
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null,
            selectedDropdown: ""
        });
        this.updateEntityParams();
        await this.refreshInitiativesList();
    };

    updateTableSortFilters = async (searchKey, val) => {
        let tempYear = [];
        let tempIndex = [];
        let main_key = searchKey.split(".")[0];
        if (main_key === "maintenance_years") {
            if (!tempYear.includes(val)) {
                tempYear.push(val);
            }
            if (this.state.params.order) {
                await this.setState({
                    params: {
                        ...this.state.params,
                        order: {
                            ...this.state.params.order,
                            ["maintenance_years.amount"]: this.state.params.order["maintenance_years.amount"] === "desc" ? "asc" : "desc"
                        },
                        year: tempYear
                    }
                });
            } else {
                await this.setState({
                    params: {
                        ...this.state.params,
                        order: { ["maintenance_years.amount"]: "asc" },
                        year: tempYear
                    }
                });
            }
        } else if (main_key === "priority_elements") {
            if (!tempIndex.includes(val.split(" ")[2])) {
                tempIndex.push(val.split(" ")[2]);
            }
            if (this.state.params.order) {
                await this.setState({
                    params: {
                        ...this.state.params,
                        order: {
                            ...this.state.params.order,
                            ["priority_elements.element"]: this.state.params.order["priority_elements.element"] === "desc" ? "asc" : "desc"
                        },
                        index: tempIndex
                    }
                });
            } else {
                await this.setState({
                    params: {
                        ...this.state.params,
                        order: { ["priority_elements.element"]: "asc" },
                        index: tempIndex
                    }
                });
            }
        } else {
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
        }
        this.updateEntityParams();
        await this.refreshInitiativesList();
    };

    handleCutPaste = async current_year => {
        await this.setState({
            selectedYear: current_year.split("_")[1]
        });

        // this.toggleShowCutPasteModal();
    };
    exportTableXl = async () => {
        const entityId = this.props.match.params.id;
        const {
            match: {
                params: { section }
            }
        } = this.props;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        await this.setState({ tableLoading: true });

        await this.props.exportInitative(this.state.params);
        this.setState({ tableLoading: false });
        if (this.props.initativeReducer.initiativeExportResponse && this.props.initativeReducer.initiativeExportResponse.error) {
            await this.setState({ alertMessage: this.props.initativeReducer.initiativeExportResponse.error });
            this.showAlert();
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

    showRestoreModal = async id => {
        await this.setState({
            showRestoreConfirmModal: true,
            selectedInitiative: id
        });
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null,
                index: [],
                year: []
            }
        });
        this.updateEntityParams();
        await this.refreshInitiativesList();
    };

    selectFilterHandler = async e => {
        switch (e.target.value) {
            case "assigned":
                await this.setState({
                    params: {
                        ...this.state.params,
                        view: "assigned",
                        initiative_ids: []
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "unassigned":
                await this.setState({
                    params: {
                        ...this.state.params,
                        view: "unassigned",
                        initiative_ids: []
                    },
                    selectedDropdown: e.target.value
                });
                break;

            case "all":
                await this.setState({
                    params: {
                        ...this.state.params,
                        view: null,
                        initiative_ids: []
                    },
                    selectedDropdown: e.target.value
                });
                break;
        }
        this.updateEntityParams();
        await this.refreshInitiativesList();
    };
    handleAddInitiataive = async data => {
        let type = data.initiative_type;
        if (data.initiative_type && data.initiative_type.length) {
            type = data.initiative_type.join(",");
            // type=type.split(",")
        }
        let initiativeData = {
            ...data,
            initiative_type: type
        };
        const { history } = this.props;
        await this.props.addInitiatives({ initiative: initiativeData });

        if (this.props.initativeReducer.addInitiatives && this.props.initativeReducer.addInitiatives.error) {
            await this.setState({
                alertMessage: this.props.initativeReducer.addInitiatives.error
            });
            this.showAlert();
        } else {
            if (this.props.initativeReducer.addInitiatives && this.props.initativeReducer.addInitiatives.success) {
                await this.setState({
                    alertMessage: this.props.initativeReducer.addInitiatives.message
                });
                this.showAlert();
            }
            await this.refreshInitiativesList();
            // await this.props.getMenuItems();
            history.push(findPrevPathFromBreadCrumpData() || "/initiatives");
        }
    };
    handleUpdateInitiataive = async data => {
        let type = data.initiative_type;
        if (data.initiative_type && data.initiative_type.length) {
            type = data.initiative_type.join(",");
            // type=type.split(",")
        }
        let initiativeData = {
            ...data,
            initiative_type: type
        };
        const { history } = this.props;
        await this.props.updateInitiatives({ initiative: initiativeData }, this.props.match.params.tab);
        await this.refreshinfoDetails();
        if (this.props.initativeReducer.updateInitiatives && this.props.initativeReducer.updateInitiatives.error) {
            await this.setState({
                alertMessage: this.props.initativeReducer.updateInitiatives.error
            });
            this.showAlert();
        } else {
            if (this.props.initativeReducer.updateInitiatives && this.props.initativeReducer.updateInitiatives.success) {
                await this.setState({
                    alertMessage: this.props.initativeReducer.updateInitiatives.message
                });
                this.showAlert();
            }
            await this.refreshInitiativesList();
            // await this.props.getMenuItems();
            history.push(findPrevPathFromBreadCrumpData() || "/initiatives");
        }
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, initiativeTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };
    getDataById = async id => {
        if (id) {
            // this.setState({
            //     isLoading: true
            // })
            await this.props.getInitiativeById(id);
            this.setState({
                isLoading: false
            });
        }
    };

    refreshinfoDetails = async () => {
        await this.getDataById(this.props.match.params.id);
        const {
            initativeReducer: {
                getInitiativeById: {
                    code,
                    name,
                    performed_by,
                    status,
                    initiative_type,
                    actual_cost,
                    client,
                    consultancy,
                    project,
                    funding,
                    total_sf,
                    success,
                    recommendations_cost,
                    recommendations_count,
                    description,
                    note,
                    identifier,
                    created_at,
                    updated_at
                }
            }
        } = this.props;

        if (success) {
            await this.setState({
                basicDetails: {
                    code,
                    name,
                    performed_by,
                    status,
                    initiative_type: initiative_type ? initiative_type.split(",") : [],
                    actual_cost,
                    client,
                    consultancy,
                    project,
                    funding,
                    description,
                    note,
                    recommendations_cost,
                    recommendations_count,
                    identifier,
                    total_sf,
                    created_at,
                    updated_at
                },

                breadCrumbsData: [
                    { key: "main", name: "Project Initiatives", path: "/initiatives" },
                    {
                        key: "info",
                        name: name,
                        path: `/initiatives/initiativeInfo/${this.props.match.params.id}/basicdetails`
                    }
                ],
                isloading: false,
                isHistory: false
            });
            // let breadCrumbsData= [
            //     { key: "main", name: "Initiatives", path: "/initiatives" },
            //     {
            //         key: "info",
            //         name: name,
            //         path: `/initiatives/initiatives/${this.props.match.params.id}/basicdetails`
            //     }
            // ]
            // console.log("breadCrumbsData",breadCrumbsData)
            // addToresetBreadCrumpDataBreadCrumpData(breadCrumbsData)
        }
        return true;
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
                config: _.cloneDeep(initiativeTableData.config)
            },

            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshInitiativesList();
    };
    getAllDropdowns = async () => {
        let role = localStorage.getItem("role") || "";
        await this.props.getAllConsultancyUsers();
        if (role === "consultancy_user") {
            await this.props.getAllClients();
        }
        await this.props.getAllConsultanciesDropdown();
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
        await this.props.deleteInitiativeLog(selectedLog);
        if (this.props.initativeReducer.deleteInitiativeLog && this.props.initativeReducer.deleteInitiativeLog.error) {
            await this.setState({ alertMessage: this.props.initativeReducer.deleteInitiativeLog.error });
            this.showAlert();
        } else if (this.props.initativeReducer.deleteInitiativeLog && this.props.initativeReducer.deleteInitiativeLog.success) {
            await this.setState({ alertMessage: this.props.initativeReducer.deleteInitiativeLog.message });
            this.showAlert();
        }
        await this.getLogData(this.props.match.params.id);
        // await this.props.getMenuItems();
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
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

    handleRestoreLog = async (id, choice, changes, associated_changes) => {
        await this.setState({
            showConfirmModalLogModal: true,
            selectedLog: id,
            logChanges: changes,
            associated_changes: associated_changes
        });
    };

    renderConfirmationRestoreModalLog = () => {
        const { showConfirmModalLogModal, isRestoreOrDelete, logChanges, associated_changes } = this.state;
        if (!showConfirmModalLogModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to restore this log?"}
                        message={logChanges}
                        associatedchanges={associated_changes}
                        onNo={() => this.setState({ showConfirmModalLogModal: false })}
                        onYes={this.restoreLogOnConfirm}
                        isRestore={true}
                        type={"restore"}
                        isLogChange={true}
                    />
                }
                onCancel={() => this.setState({ showConfirmModalLogModal: false })}
            />
        );
    };

    restoreLogOnConfirm = async () => {
        const { selectedLog } = this.state;
        await this.props.restoreInitiativeLog(selectedLog);
        this.setState({
            showConfirmModalLogModal: false,
            selectedLog: null,
            isHistory: false
        });
        this.setState({
            isloading: true
        });
        if (this.props.initativeReducer.restoreInitiativeLog && this.props.initativeReducer.restoreInitiativeLog.error) {
            await this.setState({ alertMessage: this.props.initativeReducer.restoreInitiativeLog.error });
            this.showAlert();
        } else if (this.props.initativeReducer.restoreInitiativeLog && this.props.initativeReducer.restoreInitiativeLog.success) {
            await this.setState({ alertMessage: this.props.initativeReducer.restoreInitiativeLog.message });
            this.showAlert();
        }
        await this.refreshinfoDetails();
        await this.getLogData(this.props.match.params.id);
        // await this.props.getMenuItems();
    };

    getLogData = async initiativeId => {
        const { historyParams, historyPaginationParams } = this.state;
        await this.props.getInitiativeLogs(initiativeId, historyParams);
        const {
            initativeReducer: {
                getInitiativeLog: { logs, count }
            }
        } = this.props;
        if (this.props.initativeReducer.getInitiativeLog && this.props.initativeReducer.getInitiativeLog.error) {
            await this.setState({ alertMessage: this.props.initativeReducer.getInitiativeLog.error });
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

    changeToHistory = async () => {
        await this.setState({ isHistory: !this.state.isHistory });
    };

    handleSelectAll = (e, dataItem) => {
        let temp = [];
        if (e.target.checked) {
            if (dataItem && dataItem.data) {
                dataItem.data.map(d => temp.push(d.id));
            }
        } else {
            temp = [];
        }
        if (this.state.assignModal) {
            // this.setState({
            //     initiativeIds: temp
            // })
        } else {
            this.setState({
                recomentationIds: temp
            });
        }
    };

    handleSelect = (e, id) => {
        if (this.state.assignModal) {
            const { initiativeIds } = this.state;
            let temp = [];
            if (e.target.checked) {
                temp.push(id);
                this.setState({
                    initiativeIds: temp,
                    initiative_id: id
                });
            } else {
                temp = temp.filter(t => t != id);
                this.setState({
                    initiativeIds: temp,
                    initiative_id: null
                });
            }
        } else {
            const { recomentationIds } = this.state;
            let temp = recomentationIds;

            if (e.target.checked) {
                temp.push(id);
                this.setState({
                    recomentationIds: temp
                });
            } else {
                temp = temp.filter(t => t != id);
                this.setState({
                    recomentationIds: temp
                });
            }
        }
    };

    assignProject = () => {
        this.setState({ assignModal: true });
    };

    renderAssignModal = () => {
        const {
            showWildCardFilter,
            paginationParams,
            tableData,
            selectedRowId,
            summaryRowData,
            permissions,
            logPermission,
            selectedInitiative,
            basicDetails,
            isHistory,
            infosubTabsData,
            logData,
            historyPaginationParams,
            historyParams,
            isLoading
        } = this.state;
        const { assignModal, initiativeIds, recomentationIds } = this.state;
        if (!assignModal) return null;
        let tempIds = localStorage.getItem("recommendationIds") ? JSON.parse(localStorage.getItem("recommendationIds")) : [];
        return (
            <Portal
                body={
                    <AssignModal
                        isLoading={isLoading}
                        recomentationIds={tempIds}
                        initiativeIds={initiativeIds}
                        onCancel={() => {
                            this.setState({
                                assignModal: false,
                                // recomentationIds: [],
                                initiativeIds: [],
                                initiative_id: null
                            });
                            // localStorage.removeItem("recommendationIds")
                        }}
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        showViewModal={this.showViewModal}
                        tableData={tableData}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={this.state.params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        selectedRowId={selectedRowId}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        handleDeleteInitiatives={this.handleDeleteInitiatives}
                        showEditPage={this.showEditPage}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        showAddForm={this.showAddForm}
                        showInfoPage={this.showInfoPage}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilterRecommendation={this.getListForCommonFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        commonFilter={this.state.params.list}
                        isChartView={this.props.isChartView}
                        resetAllFilters={this.resetAllFilters}
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        isChartView={this.props.isChartView}
                        isBuildingLocked={this.props.isBuildingLocked}
                        handleCutPaste={this.handleCutPaste}
                        summaryRowData={summaryRowData}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        showRestoreModal={this.showRestoreModal}
                        selectFilterHandler={this.selectFilterHandler}
                        selectedDropdown={this.state.selectedDropdown}
                        permissions={permissions}
                        logPermission={logPermission}
                        handleSelect={this.handleSelect}
                        handleSelectAll={this.handleSelectAll}
                        handleAssign={this.handleAssign}
                        submitAssign={this.state.submitAssign}
                    />
                }
                onCancel={() => {
                    this.setState({
                        assignModal: false,
                        assignModal: false,
                        // recomentationIds: [],
                        initiativeIds: [],
                        initiative_id: null
                    });
                    // localStorage.removeItem("recommendationIds")
                }}
            />
        );
    };

    handleAssign = async () => {
        let tempIds = localStorage.getItem("recommendationIds") ? JSON.parse(localStorage.getItem("recommendationIds")) : [];
        let selectedAll = localStorage.getItem("selectAll");
        let selectedAllClicked = localStorage.getItem("selectAllClicked");
        let params =
            selectedAll == "true" && selectedAllClicked == "true"
                ? this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params
                : null;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        let data = {};
        if (selectedAll == "true" && selectedAllClicked == "true") {
            data = {
                all: true,
                recommendation_ids: [],
                process: "false",
                initiative_id: this.state.initiative_id,
                project_id: query.pid
            };
        } else {
            data = {
                recommendation_ids: tempIds,
                process: "false"
            };
        }
        await this.props.assignProject(data, this.state.initiative_id, params);
        this.setState({
            isLoading: true,
            assignModal: false
        });
        if (this.props.initativeReducer.assignProject && this.props.initativeReducer.assignProject.error) {
            await this.setState({
                alertMessage: this.props.initativeReducer.assignProject.error,
                showConfirmModal: false,
                isRedirectionOnDelete: false,
                selectedInitiative: null,
                isLoading: false
            });
            this.showAlert();
        } else {
            if (this.props.initativeReducer.assignProject && this.props.initativeReducer.assignProject.success) {
                if (this.props.initativeReducer.assignProject.status == 200) {
                    let selectedAll = localStorage.getItem("selectAll");
                    let selectedAllClicked = localStorage.getItem("selectAllClicked");

                    let data = {};
                    if (selectedAll == "true" && selectedAllClicked == "true") {
                        data = {
                            all: true,
                            recommendation_ids: [],
                            process: "true",
                            initiative_id: this.state.initiative_id,
                            project_id: query.pid
                        };
                    } else {
                        data = {
                            recommendation_ids: tempIds,
                            process: "true"
                        };
                    }
                    await this.props.assignProject(data, this.state.initiative_id, params);
                    await this.refreshinfoDetails();
                    await this.refreshInitiativesList();
                    await localStorage.removeItem("recommendationIds");
                    await localStorage.removeItem("selectAll");
                    await localStorage.setItem("selectAllClicked", false);
                    this.setState({
                        assignModal: false,
                        recomentationIds: [],
                        initiativeIds: [],
                        initiative_id: null,
                        submitAssign: false
                    });
                    if (this.props.initativeReducer.assignProject && this.props.initativeReducer.assignProject.success) {
                        await this.setState({
                            alertMessage: this.props.initativeReducer.assignProject.message
                        });
                        this.showAlert();
                    } else if (this.props.initativeReducer.assignProject && this.props.initativeReducer.assignProject.error) {
                        await this.setState({
                            alertMessage: this.props.initativeReducer.assignProject.message
                        });
                        this.showAlert();
                    }
                } else {
                    if (this.props.initativeReducer.assignProject && this.props.initativeReducer.assignProject.success) {
                        await this.setState({
                            alertMessage: this.props.initativeReducer.assignProject.message
                        });
                    }
                    this.setState({
                        confirmAssign: true,
                        isLoading: false
                    });
                }
            }
        }
    };

    renderConfirmationModalAssign = () => {
        const { confirmAssign } = this.state;
        if (!confirmAssign) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to continue ?"}
                        message={this.state.alertMessage}
                        onNo={() => this.setState({ confirmAssign: false })}
                        onYes={this.handleAssignConfirm}
                        type={"unassign"}
                        isUnAssign={true}
                    />
                }
                onCancel={() => this.setState({ confirmAssign: false })}
            />
        );
    };

    handleAssignConfirm = async () => {
        let tempIds = localStorage.getItem("recommendationIds") ? JSON.parse(localStorage.getItem("recommendationIds")) : [];
        let selectedAll = localStorage.getItem("selectAll");
        let selectedAllClicked = localStorage.getItem("selectAllClicked");
        let data = {};
        let params =
            selectedAll == "true" && selectedAllClicked == "true"
                ? this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params
                : null;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        if (selectedAll == "true" && selectedAllClicked == "true") {
            data = {
                all: true,
                recommendation_ids: [],
                process: "true",
                initiative_id: this.state.initiative_id,
                project_id: query.pid
            };
        } else {
            data = {
                recommendation_ids: tempIds,
                process: "true"
            };
        }
        this.setState({
            confirmAssign: false
        });
        await this.props.assignProject(data, this.state.initiative_id, params);
        this.setState({
            submitAssign: true
        });
        await this.refreshinfoDetails();
        await this.refreshInitiativesList();
        await localStorage.removeItem("recommendationIds");
        await localStorage.removeItem("selectAll");
        await await localStorage.setItem("selectAllClicked", false);
        this.setState({
            assignModal: false,
            recomentationIds: [],
            initiativeIds: [],
            initiative_id: null,
            submitAssign: false
        });
        if (this.props.initativeReducer.assignProject && this.props.initativeReducer.assignProject.error) {
            await this.setState({
                alertMessage: this.props.initativeReducer.assignProject.error,
                showConfirmModal: false,
                isRedirectionOnDelete: false,
                selectedInitiative: null
            });
            this.showAlert();
        } else {
            if (this.props.initativeReducer.assignProject && this.props.initativeReducer.assignProject.success) {
                await this.setState({
                    alertMessage: this.props.initativeReducer.assignProject.message,
                    showConfirmModal: false,
                    isRedirectionOnDelete: false,
                    selectedInitiative: null
                });
                this.showAlert();
            }
        }
    };

    handleUnassign = async () => {
        let tempIds = localStorage.getItem("recommendationIds") ? JSON.parse(localStorage.getItem("recommendationIds")) : [];
        let data = {
            recommendation_ids: tempIds
        };

        await this.props.unAssignProject(data, this.props.match.params.id);
        await localStorage.removeItem("recommendationIds");
        await localStorage.removeItem("selectAll");
        this.setState({
            confirmUnAssign: false,
            recomentationIds: [],
            initiativeIds: [],
            initiative_id: null
        });
        if (this.props.initativeReducer.unAssignProject && this.props.initativeReducer.unAssignProject.error) {
            await this.setState({
                alertMessage: this.props.initativeReducer.unAssignProject.error,
                showConfirmModal: false,
                isRedirectionOnDelete: false,
                selectedInitiative: null
            });
            this.showAlert();
        } else {
            if (this.props.initativeReducer.unAssignProject && this.props.initativeReducer.unAssignProject.success) {
                await this.setState({
                    alertMessage: this.props.initativeReducer.unAssignProject.message
                });
                this.showAlert();
            }
        }
    };

    unAassignContent = async () => {
        // this.setState({
        //     confirmUnAssign: true
        // })
        this.setState({
            confirmUnAssign: false,
            recomentationIds: [],
            initiativeIds: [],
            initiative_id: null
        });
    };

    render() {
        const {
            showWildCardFilter,
            paginationParams,
            currentViewAllUsers,
            tableData,
            infoTabsData,
            selectedRowId,
            summaryRowData,
            permissions,
            logPermission,
            selectedInitiative,
            basicDetails,
            isHistory,
            infosubTabsData,
            logData,
            historyPaginationParams,
            historyParams,
            showViewModal
        } = this.state;
        const {
            match: {
                params: { section, id }
            },
            entity = "initiatives"
        } = this.props;

        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {this.renderConfirmationModal()}
                {this.renderConfirmationModalLog()}
                {this.renderConfirmationRestoreModalLog()}
                {this.renderAssignModal()}
                {this.renderConfirmationModalAssign()}
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
                {section == "add" || section === "edit" ? (
                    <Form
                        selectedInitiative={selectedInitiative}
                        refreshInitiativesList={this.refreshInitiativesList}
                        handleAddInitiataive={this.handleAddInitiataive}
                        handleUpdateInitiataive={this.handleUpdateInitiataive}
                        getDataById={this.getDataById}
                        getAllDropdowns={this.getAllDropdowns}
                    />
                ) : (
                    <>
                        <div className="dtl-sec system-building col-md-12 ">
                            <div className="tab-dtl region-mng">
                                <InfoTabs
                                    infoTabsData={
                                        this.props.match.params.tab == "basicdetails" ||
                                        this.props.match.params.tab == "recommendation" ||
                                        this.props.match.params.tab == "documents"
                                            ? infosubTabsData
                                            : infoTabsData
                                    }
                                />
                                {this.props.match.params.tab === "basicdetails" ? (
                                    <HelperIcon isHistory={isHistory} entity={isHistory ? "general" : entity} />
                                ) : null}
                                {isHistory && this.props.match.params.tab === "basicdetails" ? (
                                    <EditHistory
                                        handleDeleteItem={this.handleDeleteInitiatives}
                                        getAllRegionLogs={this.getLogData}
                                        changeToHistory={this.changeToHistory}
                                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                                        handlePageClickHistory={this.handlePageClickHistory}
                                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                                        globalSearchKeyHistory={
                                            this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""
                                        }
                                        logData={logData}
                                        handleDeleteLog={this.handleDeleteLog}
                                        historyPaginationParams={historyPaginationParams}
                                        handleRestoreLog={this.handleRestoreLog}
                                        isHistory={isHistory}
                                        historyParams={historyParams}
                                        updateLogSortFilters={this.updateLogSortFilters}
                                        logPermission={logPermission}
                                        permissions={permissions}
                                        entity={"initiatives"}
                                    />
                                ) : this.props.match.params.tab == "basicdetails" ? (
                                    <BasicDetails
                                        keys={tableData.keys}
                                        config={tableData.config}
                                        basicDetails={basicDetails}
                                        handleDeleteInitiatives={this.handleDeleteInitiatives}
                                        isHistoryView={true}
                                        changeToHistory={this.changeToHistory}
                                        isHistory={isHistory}
                                        permissions={permissions}
                                        logPermission={logPermission}
                                        entity={"initiatives"}
                                    />
                                ) : this.props.match.params.tab == "documents" ? (
                                    <div className="tab-active recomdn-table bg-grey-table">
                                        <Documents initiativeId={this.props.match.params.id} basicDetails={basicDetails} />
                                    </div>
                                ) : this.props.match.params.section == "initiativeInfo" || this.props.match.params.tab == "recommendation" ? (
                                    <div className="tab-active recomdn-table bg-grey-table">
                                        <Recommendation
                                            handleSelect={this.handleSelect}
                                            assignProjectModal={this.assignProject}
                                            recomentationIds={this.state.recomentationIds}
                                            basicDetails={basicDetails}
                                            assignModal={this.state.assignModal}
                                            unAassignContent={this.unAassignContent}
                                            submitAssign={this.state.submitAssign}
                                            refreshinfoDetails={this.refreshinfoDetails}
                                            handleSelectAll={this.handleSelectAll}
                                        />
                                    </div>
                                ) : (
                                    <div className="tab-active recomdn-table bg-grey-table">
                                        <InitiativeMain
                                            showWildCardFilter={showWildCardFilter}
                                            paginationParams={paginationParams}
                                            showViewModal={this.showViewModal}
                                            tableData={tableData}
                                            isColunmVisibleChanged={this.isColunmVisibleChanged}
                                            handleGlobalSearch={this.handleGlobalSearch}
                                            globalSearchKey={this.state.params.search}
                                            updateSelectedRow={this.updateSelectedRow}
                                            selectedRowId={selectedRowId}
                                            toggleWildCardFilter={this.toggleWildCardFilter}
                                            handleDeleteInitiatives={this.handleDeleteInitiatives}
                                            showEditPage={this.showEditPage}
                                            handlePerPageChange={this.handlePerPageChange}
                                            handlePageClick={this.handlePageClick}
                                            showAddForm={this.showAddForm}
                                            showInfoPage={this.showInfoPage}
                                            updateWildCardFilter={this.updateWildCardFilter}
                                            wildCardFilter={this.state.params.filters}
                                            handleHideColumn={this.handleHideColumn}
                                            getListForCommonFilterRecommendation={this.getListForCommonFilter}
                                            updateCommonFilter={this.updateCommonFilter}
                                            commonFilter={this.state.params.list}
                                            isChartView={this.props.isChartView}
                                            resetAllFilters={this.resetAllFilters}
                                            resetAll={this.resetAll}
                                            updateTableSortFilters={this.updateTableSortFilters}
                                            resetSort={this.resetSort}
                                            tableParams={this.state.params}
                                            isChartView={this.props.isChartView}
                                            isBuildingLocked={this.props.isBuildingLocked}
                                            handleCutPaste={this.handleCutPaste}
                                            summaryRowData={summaryRowData}
                                            exportTableXl={this.exportTableXl}
                                            tableLoading={this.state.tableLoading}
                                            showRestoreModal={this.showRestoreModal}
                                            selectFilterHandler={this.selectFilterHandler}
                                            selectedDropdown={this.state.selectedDropdown}
                                            permissions={permissions}
                                            logPermission={logPermission}
                                            handleSelect={this.handleSelect}
                                            handleSelectAll={this.handleSelectAll}
                                            recomentationIds={this.state.recomentationIds}
                                            entity="initiatives"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </LoadingOverlay>
        );
    }
}
const mapStateToProps = state => {
    const { initativeReducer, regionReducer, commonReducer, recommendationsReducer } = state;
    return { initativeReducer, regionReducer, commonReducer, recommendationsReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...initativeAction,
        ...regionActions,
        ...recommendationsActions
    })(index)
);
