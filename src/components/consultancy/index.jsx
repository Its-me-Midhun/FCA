import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import Loader from "../common/components/Loader";
import CommonActions from "../common/actions";
import Portal from "../common/components/Portal";
import ViewModal from "../common/components/ViewModal";
import ConfirmationModal from "../common/components/ConfirmationModal";
import AssignConsultancyUserModal from "./components/AssignConsultancyUserModal";
import AssignClientUserModal from "./components/AssignClientUserModal";
import regionActions from "./actions";
import projectActions from "../project/actions";
import ConsultancyMain from "./components/ConsultancyMain";
import ConsultancyInfo from "./components/ConsultancyInfo";
import Form from "./components/Form";
import { consultancyTableData } from "../../config/tableData";
import recommendationActions from "../recommendations/actions";
import {
    addToBreadCrumpData,
    findPrevPathFromBreadCrump,
    popBreadCrumpData,
    findPrevPathFromBreadCrumpData,
    checkPermission
} from "../../config/utils";
import EfciInfo from "./components/EfciInfo";

class index extends Component {
    constructor(props) {
        super(props);
        const {
            location: { search = "" }
        } = this.props;
        this.state = {
            isLoading: true,
            errorMessage: "",
            regionList: [],
            paginationParams: this.props.consultancyReducer.entityParams.paginationParams,
            currentViewAllUsers: null,
            currentActions: null,
            efciLoading: false,
            showRegionModal: false,
            efciRegionData: [],
            showViewModal: false,
            tableLoading: false,
            colorCodes: [],
            showWildCardFilter: false,
            showAssignConsultancyUsers: false,
            clients: [],
            consultancy_users: [],
            selectedRowId: this.props.consultancyReducer.entityParams.selectedRowId,
            params: this.props.consultancyReducer.entityParams.params,
            tableData: {
                keys: consultancyTableData.keys,
                config: this.props.consultancyReducer.entityParams.tableConfig || _.cloneDeep(consultancyTableData.config)
            },
            selectedRegion: this.props.match.params.id || this.props.consultancyReducer.entityParams.selectedEntity,
            infoTabsData: [],
            filterParams: this.props.consultancyReducer.entityParams.filterParams,
            alertMessage: "",
            historyPaginationParams: this.props.consultancyReducer.entityParams.historyPaginationParams,
            historyParams: this.props.consultancyReducer.entityParams.historyParams,
            logData: {
                count: "",
                data: []
            },
            showConfirmModalLog: false,
            selectedLog: "",
            isRestoreOrDelete: "",
            permissions: {},
            logPermission: {}
        };
        this.exportTableXl = this.exportTableXl.bind(this);
    }

    componentDidMount = async () => {
        const {
            match: {
                params: { section }
            }
        } = this.props;

        await this.refreshConsultancyList();
    };

    getEfciBasedOnRegion = async tempParams => {
        this.setState({
            efciLoading: true
        });
        const regionId = this.props.match.params.id;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const projectId = query.pid;

        const {
            match: {
                params: { tab }
            }
        } = this.props;
        if (tab == "dashboard") {
            let buildingDatas = JSON.parse(localStorage.getItem(query.pid));
            let chartParams = {
                regionId: regionId,
                projectId: query.pid
            };
            let tempData = {
                ...tempParams,
                project_id: query.pid
            };
            await this.props.getMiscSettings(query.pid);
            await this.props.getChartsByRegion(chartParams, tempData);
            console.log("this.props.consultancyReducer.getEfciBySiteGraph", this.props.consultancyReducer);
            let buildingChecked = [];
            if (buildingDatas && query.pid == buildingDatas.id) {
                buildingChecked = buildingDatas ? (buildingDatas.tempBuilding ? buildingDatas.tempBuilding : []) : [];
            }
            let param = { reset: true };
            if (buildingChecked && buildingChecked.length) {
                param = {
                    ...param,
                    building_ids: buildingChecked
                };
            }
            await this.props.getChartEfciRegion(regionId, query.pid);
            await this.setState({
                efciSiteData: this.props.consultancyReducer.getEfciBySiteGraph ? this.props.consultancyReducer.getEfciBySiteGraph.region || {} : {}
            });
        } else if (tab == "efci") {
            await this.props.getEfciByRegion(projectId, regionId);
            this.setState({
                efciRegionData: this.props.consultancyReducer.getEfciByRegion.region || {},
                efciLoading: false
            });
        }
    };

    loadDataRegion = async params => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const regionId = this.props.match.params.id;
        await this.props.loadChartDataRegion(regionId, query.pid);
        await this.getEfciBasedOnRegion(this.props.recommendationsReducer.entityParams[this.props.match.params.section]?.params);
    };

    // saveData = async params => {
    //     const {
    //         location: { search }
    //     } = this.props;
    //     const query = qs.parse(search);
    //     const siteId = this.props.match.params.id;
    //     await this.props.saveDataEfciChart(siteId, query.pid);
    //     await this.getEfciBasedOnSite();
    // };

    getColorCode = async () => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        await this.props.getColorCodes(query.pid);
        const colorCodes =
            (this.props.projectReducer && this.props.projectReducer.getColorCodes && this.props.projectReducer.getColorCodes.color_codes) || [];
        this.setState({
            colorCodes: colorCodes
        });
    };

    refreshConsultancyList = async () => {
        await this.setState({ isLoading: true });
        const { params, paginationParams, tableData } = this.state;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        await this.setState({
            params: {
                ...this.state.params,
                project_id: null
            }
        });
        if (query.pid && query.pid.trim().length) {
            await this.setInFoPage(this.props.match.params.id);
            await this.setState({
                params: {
                    ...this.state.params,
                    project_id: query.pid || null
                }
            });
        }
        if (this.props.projectId) {
            await this.setState({
                params: {
                    ...this.state.params,
                    project_id: this.props.projectId
                }
            });
        }

        await this.props.getAllConsultancies(this.state.params);
        // await this.props.getAllConsultancyUsers();
        // await this.props.getAllClients();
        // await this.props.getMenuItems();

        // go to previous page is the last record of the current page is deleted
        if (
            this.props.consultancyReducer.getAllConsultancyResponse.consultancies &&
            !this.props.consultancyReducer.getAllConsultancyResponse.consultancies.length &&
            paginationParams.currentPage
        ) {
            this.setState({
                params: {
                    ...this.state.params,
                    offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getAllConsultancies(this.state.params);
        }
        if (
            this.props.consultancyReducer.getAllConsultancyResponse.consultancies &&
            !this.props.consultancyReducer.getAllConsultancyResponse.consultancies.length &&
            this.props.consultancyReducer.getAllConsultancyResponse &&
            this.props.consultancyReducer.getAllConsultancyResponse.error
        ) {
            await this.setState({ alertMessage: this.props.consultancyReducer.getAllConsultancyResponse.error });
            this.showAlerts();
        }

        const {
            consultancyReducer: {
                getAllConsultancyResponse: { consultancies, count },
                getAllConsultancyUsersResponse: { users: consultancy_users },
                getAllClientsResponse: { clients }
            }
        } = this.props;
        let project_permission = {};
        project_permission =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.consultancies
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.consultancies || {}
                : {};
        let region_logs = {};
        region_logs =
            this.props.commonReducer.getMenuItemsResponse &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions &&
            this.props.commonReducer.getMenuItemsResponse.user_permissions.consultancy_logs
                ? this.props.commonReducer.getMenuItemsResponse.user_permissions.consultancy_logs || {}
                : {};

        this.setState({
            tableData: {
                ...tableData,
                data: consultancies,
                config: this.props.consultancyReducer.entityParams.tableConfig || tableData.config
            },
            regionList: consultancies,
            paginationParams: {
                ...paginationParams,
                totalCount: count,
                totalPages: Math.ceil(count / paginationParams.perPage)
            },
            clients,
            consultancy_users,
            showWildCardFilter: this.state.params.filters ? true : false,
            permissions: project_permission,
            logPermission: region_logs,
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
        await this.refreshConsultancyList();
    };

    updateEntityParams = async () => {
        let entityParams = {
            entity: "Consultancy",
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
        await this.props.updateConsultancyEntityParams(entityParams);
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
        await this.refreshConsultancyList();
    };

    resetSort = async () => {
        await this.setState({
            params: {
                ...this.state.params,
                order: null
            }
        });
        this.updateEntityParams();
        await this.refreshConsultancyList();
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
                config: _.cloneDeep(consultancyTableData.config)
            },

            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.refreshConsultancyList();
    };

    getListForCommonFilter = async params => {
        const { search, filters, list } = this.state.params;
        const project_id = this.state.project_id;
        params.search = search;
        params.filters = filters;
        params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field?.split(".")[0])) : null;
        params.project_id = project_id;
        await this.props.getListForCommonFilter(params);
        return (
            (this.props.consultancyReducer.getListForCommonFilterResponse && this.props.consultancyReducer.getListForCommonFilterResponse.list) || []
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
        await this.refreshConsultancyList();
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
        await this.refreshConsultancyList();
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
        await this.refreshConsultancyList();
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
        await this.refreshConsultancyList();
    };
    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, consultancyTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
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

    showEditPage = regionId => {
        const { history } = this.props;
        this.setState({
            selectedRegion: regionId
        });
        addToBreadCrumpData({ key: "edit", name: "Edit Consultancy", path: `/consultancy/edit/${regionId}` });
        history.push(`/consultancy/edit/${regionId}`);
    };

    getDataById = async regionId => {
        await this.props.getConsultancyById(regionId);
        return true;
    };

    setInFoPage = regionId => {
        const {
            location: { search },
            match: {
                params: { section, id }
            }
        } = this.props;

        let tempSearch = search;
        if (section === "projectinfo") {
            tempSearch = `?pid=${id}`;
        }
        this.setState({
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Basic Details",
                    path: `/consultancy/consultancyinfo/${regionId}/basicdetails${tempSearch}`
                }
            ]
        });
    };

    showInfoPage = regionId => {
        const { history } = this.props;
        const {
            location: { search },
            match: {
                params: { section, id }
            }
        } = this.props;

        let tempSearch = search;
        if (section === "projectinfo") {
            tempSearch = `?pid=${id}`;
        }

        const query = qs.parse(search);
        this.setState({
            selectedRegion: regionId,
            infoTabsData: [
                {
                    key: "basicdetails",
                    name: "Consultancy",
                    path: `/consultancy/consultancyinfo/${regionId}/basicdetails${tempSearch}`
                }
            ]
        });
        if (query.pid && query.pid.trim().length) {
            this.setInFoPage(this.props.match.params.id);
        }
        let tabKeyList = ["basicdetails"];
        history.push(
            `/consultancy/consultancyinfo/${regionId}/${
                this.props.match.params && tabKeyList.includes(this.props.match.params.tab) ? this.props.match.params.tab : "basicdetails"
            }${tempSearch}`
        );
    };

    showAddForm = regionId => {
        const { history } = this.props;
        this.setState({
            selectedRegion: null
        });
        addToBreadCrumpData({ key: "add", name: "Add Consultancy", path: "/consultancy/add" });
        history.push("/consultancy/add");
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

    handleAssignConsultancyUsersModal = async () => {
        await this.setState({
            showAssignConsultancyUsers: true
        });
    };

    handleAssignClientUsersModal = async () => {
        await this.setState({
            showAssignClientUsers: true
        });
    };

    handleAddRegion = async region => {
        const { history } = this.props;
        this.setState({
            isLoading: true
        });
        await this.props.addConsultancy(region);
        if (this.props.consultancyReducer.addConsultancyResponse && this.props.consultancyReducer.addConsultancyResponse.error) {
            await this.setState({
                alertMessage: this.props.consultancyReducer.addConsultancyResponse.error
            });
            this.showAlerts();
            this.setState({
                isLoading: false
            });
        } else {
            this.setState({
                isLoading: true
            });
            // await this.props.getMenuItems();
            await this.refreshConsultancyList();
            this.setState({
                isLoading: false
            });
            history.push(findPrevPathFromBreadCrump() || "/consultancy");
        }
        this.setState({
            isLoading: false
        });
    };

    showAlerts = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };

    handleUpdateRegion = async (region, selectedImage, isMap = false) => {
        const { selectedRegion } = this.state;
        const { history } = this.props;
        this.setState({
            isLoading: true
        });
        await this.props.updateConsultancy(region, selectedRegion || region.id, selectedImage);
        if (this.props.consultancyReducer.updateConsultancyResponse && this.props.consultancyReducer.updateConsultancyResponse.error) {
            await this.setState({ alertMessage: this.props.consultancyReducer.updateConsultancyResponse.error });
            this.showAlerts();
            this.setState({
                isLoading: false
            });
        } else {
            await this.setState({
                alertMessage:
                    this.props.consultancyReducer.updateConsultancyResponse && this.props.consultancyReducer.updateConsultancyResponse.message,
                currentActions: null
            });
            this.setState({
                isLoading: true
            });
            this.showAlerts();
            // await this.props.getMenuItems();
            await this.refreshConsultancyList();
            this.setState({
                isLoading: false
            });
            if (!isMap) {
                history.push(findPrevPathFromBreadCrump() || "/consultancy");
            }
        }
    };

    handleDeleteRegion = async id => {
        await this.setState({
            showConfirmModal: true,
            selectedRegion: id
        });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Consultancy?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteRegionOnConfirm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    deleteRegionOnConfirm = async () => {
        const { selectedRegion } = this.state;
        const { history } = this.props;
        this.setState({
            isLoading: true,
            showConfirmModal: false
        });
        await this.props.deleteConsultancy(selectedRegion);
        if (this.props.consultancyReducer.deleteConsultancyResponse && this.props.consultancyReducer.deleteConsultancyResponse.error) {
            await this.setState({ alertMessage: this.props.consultancyReducer.deleteConsultancyResponse.error });
            this.setState({
                showConfirmModal: false,
                selectedRegion: null
            });
            this.showAlerts();

            await this.setState({
                isLoading: false
            });
        } else {
            this.setState({
                isLoading: true
            });
            // await this.props.getMenuItems();
            this.setState({
                showConfirmModal: false,
                selectedRegion: null
            });
            await this.refreshConsultancyList();
            this.setState({
                isLoading: false
            });
            if (this.props.match.params.tab === "basicdetails") {
                popBreadCrumpData();
                popBreadCrumpData();
                history.push(findPrevPathFromBreadCrumpData() || "/Consultancy");
            }
        }
        // else {
        //     await this.refreshConsultancyList();
        //     await this.props.getMenuItems();
        //     this.setState({
        //         showConfirmModal: false,
        //         selectedRegion: null
        //     });
        //     if (this.props.match.params.tab === "basicdetails") {
        //         popBreadCrumpData();
        //         popBreadCrumpData();
        //         history.push(findPrevPathFromBreadCrumpData() || "/Region");
        //     }
        // }
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
        await this.refreshConsultancyList();
    };

    uploadImages = async (imageData = {}) => {
        const { selectedRegion } = this.state;
        await this.props.uploadRegionImage(imageData, selectedRegion || this.props.match.params.id);
        await this.getAllImageList(selectedRegion);
        return true;
    };

    deleteImages = async imageId => {
        const { selectedRegion } = this.state;
        await this.props.deleteRegionImage(imageId);
        await this.getAllImageList(selectedRegion);
        return true;
    };

    updateImageComment = async imageData => {
        const { selectedRegion } = this.state;
        this.setState({
            isLoading: true
        });
        await this.props.updateRegionImageComment(imageData);
        await this.getAllImageList(selectedRegion);
        this.setState({
            isLoading: false
        });
        return true;
    };

    getAllImageList = async regionId => {
        await this.props.getAllRegionImages(regionId);
        return true;
    };

    exportTableXl = async () => {
        const {
            location: { search }
        } = this.props;
        const entityId = this.props.match.params.id;
        const {
            match: {
                params: { section }
            }
        } = this.props;
        const query = qs.parse(search);
        this.setState({ tableLoading: true });

        await this.props.exportConsultancy({
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order
        });
        this.setState({
            tableLoading: false
        });
        if (this.props.consultancyReducer.consultancyExportResponse && this.props.consultancyReducer.consultancyExportResponse.error) {
            await this.setState({ alertMessage: this.props.consultancyReducer.consultancyExportResponse.error });
            this.showAlerts();
        }
    };

    getLogData = async regionId => {
        const { historyParams, historyPaginationParams } = this.state;
        //console.log(historyPaginationParams);
        await this.props.getAllConsultancyLogs(regionId, historyParams);
        const {
            consultancyReducer: {
                getAllConsultancyLogsResponse: { logs, count }
            }
        } = this.props;
        if (this.props.consultancyReducer.getAllConsultancyLogsResponse && this.props.consultancyReducer.getAllConsultancyLogsResponse.error) {
            await this.setState({ alertMessage: this.props.consultancyReducer.getAllConsultancyLogsResponse.error });
            this.showAlerts();
        } else {
            await this.setState({
                ...this.state,
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
        // console.log(search);
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
        await this.props.deleteConsultancyLog(selectedLog);
        if (this.props.consultancyReducer.deleteConsultancyLogResponse && this.props.consultancyReducer.deleteConsultancyLogResponse.error) {
            await this.setState({ alertMessage: this.props.consultancyReducer.deleteConsultancyLogResponse.error });
            this.showAlerts();
        }
        await this.getLogData(this.props.match.params.id);
        // await this.props.getMenuItems();
        this.setState({
            showConfirmModalLog: false,
            selectedLog: null
        });
    };

    HandleRestoreRegionLog = async id => {
        const { selectedLog } = this.state;
        await this.props.restoreConsultancyLog(id);
        if (this.props.consultancyReducer.restoreConsultancyLogResponse && this.props.consultancyReducer.restoreConsultancyLogResponse.error) {
            await this.setState({ alertMessage: this.props.consultancyReducer.restoreConsultancyLogResponse.error });
            this.showAlerts();
        }
        await this.refreshConsultancyList();
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

    handleRegionEfciFundingCost = async (id, value) => {
        let tempRegionEfciFC = this.state.efciRegionData;
        tempRegionEfciFC &&
            tempRegionEfciFC.funding_options.length &&
            tempRegionEfciFC.funding_options.map(fo => {
                if (fo.id === id) {
                    fo.value = value;
                }
            });
        this.setState({
            efciRegionData: tempRegionEfciFC
        });
    };

    updateRegionEfciFundingCost = async (id, value) => {
        this.setState({
            efciLoading: true
        });
        await this.props.updateRegionFundingCost(value, id);
        await this.getEfciBasedOnRegion();
        this.setState({
            efciLoading: false
        });
    };

    handleRegionFundingCostEfci = async (id, value) => {
        let tempRegionEfciFC = this.state.efciRegionData;
        tempRegionEfciFC &&
            tempRegionEfciFC.expected_fcis.length &&
            tempRegionEfciFC.expected_fcis.map(efci => {
                if (efci.id === id) {
                    efci.value = value;
                }
            });
        this.setState({
            efciRegionData: tempRegionEfciFC
        });
    };

    updateRegionFundingEfci = async (id, value) => {
        this.setState({
            efciLoading: true
        });
        await this.props.updateRegionFundingCostEfci(value, id);
        await this.getEfciBasedOnRegion();
        this.setState({
            efciLoading: false
        });
    };

    handleRegionAnnualFundingOption = async (id, amount, index) => {
        let tempRegionEfciFC = this.state.efciRegionData;
        tempRegionEfciFC &&
            tempRegionEfciFC.annual_fundings &&
            tempRegionEfciFC.annual_fundings[index].map(item => {
                if (item.id === id) {
                    item.amount = amount;
                }
            });
        this.setState({
            efciRegionData: tempRegionEfciFC
        });
    };

    updateRegionAnnualFunding = async (id, amount) => {
        this.setState({
            efciLoading: true
        });
        await this.props.updateRegionAnnualFundingOption(amount, id);
        await this.getEfciBasedOnRegion();
        this.setState({
            efciLoading: false
        });
    };

    handleRegionAnnualEfci = async (id, amount, index) => {
        let tempRegionEfciFC = this.state.efciRegionData;
        tempRegionEfciFC &&
            tempRegionEfciFC.annual_fcis &&
            tempRegionEfciFC.annual_fcis[index].map(item => {
                if (item.id === id) {
                    item.value = amount;
                }
            });
        this.setState({
            efciRegionData: tempRegionEfciFC
        });
    };

    updateRegionAnnualEFCI = async (id, amount) => {
        this.setState({
            efciLoading: true
        });
        await this.props.updateRegionAnnualEfci(id, amount);
        await this.getEfciBasedOnRegion();
        this.setState({
            efciLoading: false
        });
    };

    render() {
        const {
            tableData,
            showWildCardFilter,
            selectedRegion,
            paginationParams,
            currentViewAllUsers,
            showViewModal,
            showAssignConsultancyUsers,
            showAssignClientUsers,
            clients,
            consultancy_users,
            infoTabsData,
            selectedRowId,
            logData,
            historyPaginationParams,
            historyParams,
            permissions,
            logPermission
        } = this.state;

        const {
            match: {
                params: { section }
            }
        } = this.props;

        return (
            <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                {section === "add" || section === "edit" ? (
                    <Form
                        selectedRegion={selectedRegion}
                        refreshConsultancyList={this.refreshConsultancyList}
                        handleAddRegion={this.handleAddRegion}
                        handleUpdateRegion={this.handleUpdateRegion}
                        getDataById={this.getDataById}
                    />
                ) : section === "consultancyinfo" ? (
                    <ConsultancyInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        showInfoPage={this.showInfoPage}
                        getDataById={this.getDataById}
                        handleUpdateData={this.handleUpdateRegion}
                        uploadImages={this.uploadImages}
                        getAllImageList={this.getAllImageList}
                        deleteImages={this.deleteImages}
                        updateRegionImageComment={this.updateImageComment}
                        handleDeleteItem={this.handleDeleteRegion}
                        getAllRegionLogs={this.getLogData}
                        handlePerPageChangeHistory={this.handlePerPageChangeHistory}
                        handlePageClickHistory={this.handlePageClickHistory}
                        handleGlobalSearchHistory={this.handleGlobalSearchHistory}
                        globalSearchKeyHistory={this.state.historyParams && this.state.historyParams.search ? this.state.historyParams.search : ""}
                        logData={logData}
                        handleDeleteLog={this.handleDeleteLog}
                        historyPaginationParams={historyPaginationParams}
                        HandleRestoreRegionLog={this.HandleRestoreRegionLog}
                        historyParams={historyParams}
                        updateLogSortFilters={this.updateLogSortFilters}
                        regionId={this.props.match.params.id}
                        tableLoading={this.state.tableLoading}
                        efciRegionData={this.state.efciRegionData}
                        colorCodes={this.state.colorCodes}
                        efciLoading={this.state.efciLoading}
                        loadDataRegion={this.loadDataRegion}
                        handleRegionEfciFundingCost={this.handleRegionEfciFundingCost}
                        updateRegionEfciFundingCost={this.updateRegionEfciFundingCost}
                        handleRegionFundingCostEfci={this.handleRegionFundingCostEfci}
                        updateRegionFundingEfci={this.updateRegionFundingEfci}
                        handleRegionAnnualFundingOption={this.handleRegionAnnualFundingOption}
                        updateRegionAnnualFunding={this.updateRegionAnnualFunding}
                        handleRegionAnnualEfci={this.handleRegionAnnualEfci}
                        updateRegionAnnualEFCI={this.updateRegionAnnualEFCI}
                        permissions={permissions}
                        logPermission={logPermission}
                        entity="consultancies"
                        hasEdit={checkPermission("forms", "consultancies", "edit")}
                        hasDelete={checkPermission("forms", "consultancies", "delete")}
                        hasLogView={checkPermission("logs", "consultancies", "view")}
                        hasLogDelete={checkPermission("logs", "consultancies", "delete")}
                        hasLogRestore={checkPermission("logs", "consultancies", "restore")}
                        hasInfoPage={checkPermission("forms", "consultancies", "view")}
                    />
                ) : section === "efciinfo" ? (
                    <EfciInfo
                        keys={tableData.keys}
                        config={tableData.config}
                        infoTabsData={infoTabsData}
                        showInfoPage={this.showInfoPage}
                        getDataById={this.getDataById}
                        handleUpdateData={this.handleUpdateRegion}
                        uploadImages={this.uploadImages}
                        getAllImageList={this.getAllImageList}
                        deleteImages={this.deleteImages}
                        updateRegionImageComment={this.updateImageComment}
                        handleDeleteItem={this.handleDeleteRegion}
                        efciRegionData={this.state.efciRegionData}
                        colorCodes={this.state.colorCodes}
                        efciLoading={this.state.efciLoading}
                        handleRegionEfciFundingCost={this.handleRegionEfciFundingCost}
                        updateRegionEfciFundingCost={this.updateRegionEfciFundingCost}
                        handleRegionFundingCostEfci={this.handleRegionFundingCostEfci}
                        updateRegionFundingEfci={this.updateRegionFundingEfci}
                        handleRegionAnnualFundingOption={this.handleRegionAnnualFundingOption}
                        updateRegionAnnualFunding={this.updateRegionAnnualFunding}
                        handleRegionAnnualEfci={this.handleRegionAnnualEfci}
                        updateRegionAnnualEFCI={this.updateRegionAnnualEFCI}
                    />
                ) : (
                    <ConsultancyMain
                        tableData={tableData}
                        showWildCardFilter={showWildCardFilter}
                        paginationParams={paginationParams}
                        currentViewAllUsers={currentViewAllUsers}
                        handleGlobalSearch={this.handleGlobalSearch}
                        globalSearchKey={this.state.params.search}
                        updateSelectedRow={this.updateSelectedRow}
                        isColunmVisibleChanged={this.isColunmVisibleChanged}
                        selectedRowId={selectedRowId}
                        toggleWildCardFilter={this.toggleWildCardFilter}
                        showViewModal={this.showViewModal}
                        updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                        handleDeleteRegion={this.handleDeleteRegion}
                        showEditPage={this.showEditPage}
                        showInfoPage={this.showInfoPage}
                        showAddForm={this.showAddForm}
                        handlePerPageChange={this.handlePerPageChange}
                        handlePageClick={this.handlePageClick}
                        updateWildCardFilter={this.updateWildCardFilter}
                        wildCardFilter={this.state.params.filters}
                        handleHideColumn={this.handleHideColumn}
                        getListForCommonFilter={this.getListForCommonFilter}
                        updateCommonFilter={this.updateCommonFilter}
                        commonFilter={this.state.params.list}
                        resetAllFilters={this.resetAllFilters}
                        resetAll={this.resetAll}
                        updateTableSortFilters={this.updateTableSortFilters}
                        resetSort={this.resetSort}
                        tableParams={this.state.params}
                        exportRegionTable={this.exportRegionTable}
                        exportTableXl={this.exportTableXl}
                        tableLoading={this.state.tableLoading}
                        permissions={permissions}
                        entity="consultancies"
                        hasExport={checkPermission("forms", "consultancies", "export")}
                        showAddButton={checkPermission("forms", "consultancies", "create")}
                        hasEdit={checkPermission("forms", "consultancies", "edit")}
                        hasDelete={checkPermission("forms", "consultancies", "delete")}
                        hasInfoPage={checkPermission("forms", "consultancies", "view")}
                    />
                )}
                {this.renderConfirmationModal()}
                {this.renderConfirmationModalLog()}
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
    const { consultancyReducer, commonReducer, recommendationsReducer, projectReducer } = state;
    return { consultancyReducer, commonReducer, projectReducer, recommendationsReducer };
};

export default withRouter(connect(mapStateToProps, { ...regionActions, ...CommonActions, ...projectActions })(index));
