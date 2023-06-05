import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import _ from "lodash";

import SideNavigation from "./components/SideMenu";
import BreadCrumbs from "./components/BreadCrumb";
import TopBar from "./components/TopBarSection";
import Narrative from "./components/Narrative";
import TopHeader from "./components/TopHeader";
import Portal from "../common/components/Portal";
import ImageBandModal from "./components/ImageBandModal";
import ViewModal from "../common/components/ViewModal";
import actions from "./actions";
import history from "../../config/history";
import InfoImages from "../common/components/InfoImages1";
import { narrativeRecommendationsTableData } from "../../config/tableData";
import Recommendations from "./components/recommendations/recommendations";
import { checkPermission, convertToXML, reorderArray, addToBreadCrumpData } from "../../config/utils";
import ConfirmationModal from "../common/components/ConfirmationModal";
import { BandTypes, SPECIAL_REPORT_NARRATABLES } from "./constants";
import { v4 as uuidv4 } from "uuid";
import Insert from "./components/inserts/Insert";
import Chart from "./components/charts/chart";
import RecommendationInfo from "./components/recommendations/recommendationInfo";
import RecomImage from "./components/recommendationImages/RecomImage";
import Project from "../project";
import commonActions from "../common/actions";
import HelperIcon from "../helper/components/HelperIcon";
import { entities } from "../common/constants";
import RecommendationForm from "./components/recommendations/RecommendationForm";
import RecommendationActions from "../recommendations/actions";
import BuildingActions from "../building/actions";
class Index extends Component {
    constructor(props) {
        super(props);
        this.narrativeEnd = React.createRef();
    }
    state = {
        showImageBandModal: false,
        breadCrumbData: [],
        menuData: [],
        infoTabsData: [],
        alertMessage: "",
        isSubmit: false,
        narratives: [],
        params: this.props.fcaReportReducer.entityParams.params,
        recomendationsParam: {},
        showWildCardFilter: false,
        paginationParams: this.props.fcaReportReducer.entityParams.paginationParams,
        currentViewAllUsers: null,
        showViewModal: false,
        tableData: {
            keys: narrativeRecommendationsTableData.keys,
            config: this.props.fcaReportReducer.entityParams.tableConfig || _.cloneDeep(narrativeRecommendationsTableData.config)
        },
        summaryRowData: {
            crv_total: "",
            year_totals: {}
        },
        permissions: {},
        logPermission: {},
        isLoading: false,
        showConfirmModal: false,
        selectedBand: null,
        showMenuSwitchConfirmModal: false,
        selectedMenu: null,
        isUnSaved: false,
        clickedMenuItem: { e: null, item: null },
        showTabSwitchConfirmModal: false,
        clickedTab: null,
        showExportConfirmModal: false,
        showRecommendationInfo: false,
        selectedRecommendationId: null,
        showDiscardChangesConfirmationModal: false,
        recomImageList: [],
        recomNoteList: [],
        selectedRecomImage: "",
        narrativeCompleted: false,
        warningModal: { show: false, type: "", heading: "", message: "" },
        narrativeId: null,
        showExportHistory: false,
        showLogs: false,
        narrativeTimes: {},
        siteId: null,
        graphData: {},
        showRecommendationEdit: false
    };

    componentDidMount = async () => {
        await this.renderData();
        const {
            match: {
                params: { id, section }
            }
        } = this.props;
        this.setInfoTab(section, id);
    };

    renderData = async () => {
        const {
            location: { search },
            match: {
                params: { id, section },
                path
            }
        } = this.props;
        if (section && section !== "projectinfo") {
            this.setState({ isLoading: true });
            const query = qs.parse(search);
            let param = {
                project_id: query.pid
            };
            if (section === "projects") {
                query.narratable_type = "Project";
            } else if (section === "regions") {
                query.narratable_type = "Region";
            } else if (section === "sites") {
                query.narratable_type = "Site";
            } else if (section === "building") {
                query.narratable_type = "Building";
            }
            query.narratable_id = id;
            let querystring = qs.stringify(query);

            history.push(`${this.props.match.url}?${querystring}`);
            let menu = null;
            let permissions = JSON.parse(localStorage.getItem("user_permissions"));
            if (section === "projects") {
                param.building_id = id;
                await this.props.getProjectMenu(param);
                menu = this.props.fcaReportReducer.getAllProjectMenu;
            } else if (section === "regions") {
                param.region_id = id;
                await this.props.getRegionMenu(param);
                menu = this.props.fcaReportReducer.getAllRegionMenu;
            } else if (section === "sites") {
                param.site_id = id;
                await this.props.getSiteMenu(param);
                menu = this.props.fcaReportReducer.getAllSiteMenu;
            } else if (section === "building") {
                param.building_id = id;
                await this.props.getBuildingMenu(param);
                menu = this.props.fcaReportReducer.getAllBuildingMenu;
            }

            if (menu) {
                let tempBreadCrumb = [];
                let tempMenu = [];
                tempMenu.push({
                    entity: menu.entity,
                    key: menu.key,
                    label: menu.label,
                    url: menu.url,
                    view_info: menu.view_info,
                    nodes: [],
                    bc: menu.bc,
                    has_recommendations: menu.has_recommendations,
                    has_narrative: menu.has_narrative,
                    narrative_completed: menu.narrative_completed,
                    children_completed: menu.children_completed,
                    global_completed: menu.global_completed,
                    has_child:
                        menu.has_child === "false" || menu.has_child === false
                            ? false
                            : menu.has_child === "true" || menu.has_child === true
                            ? true
                            : true
                });
                if (menu.bc) {
                    tempBreadCrumb = menu.bc;
                }
                this.setState({
                    breadCrumbData: tempBreadCrumb,
                    menuData: tempMenu,
                    selectedMenu: null,
                    permissions: permissions?.narratives
                });
            }
            this.setState({
                params: {
                    ...this.state.params,
                    ...param
                },
                isUnSaved: this.props.commonReducer.isFormDirty
            });
            await this.renderDetails();
        }
    };

    renderDetails = async () => {
        this.setState({ isLoading: true });
        const {
            location: { search },
            match: {
                params: { id, section, tab }
            }
        } = this.props;
        const query = qs.parse(search);
        const { params } = this.state;
        let recomendationsParam = params;
        recomendationsParam.narratable_id = query.narratable_id;
        recomendationsParam.narratable_type = query.narratable_type;
        recomendationsParam.building_id = query.building_id;
        if (tab === "narrative") {
            this.setState({ showExportHistory: false, showLogs: false });
            await this.getNarrative();
        } else if (tab === "recomendations") {
            this.setState({ showRecommendationInfo: false, showRecommendationEdit: false });
            await this.props.getNarrativeRecommendations(recomendationsParam);
            await this.refreshRecommendationsList();
        } else if (tab === "imagesRecommendation") {
            if (query.narratable_type !== "SubSystem") {
                history.push(`/reports/${section}/${id}/narrative${search}`);
            } else {
                this.setState({ showRecommendationInfo: false });
            }
        } else if (tab === "charts") {
            if (!SPECIAL_REPORT_NARRATABLES.includes(query.narratable_type)) {
                history.push(`/reports/${section}/${id}/narrative${search}`);
            }
        }
        this.setState({
            recomendationsParam,
            isLoading: false
        });
    };

    setInfoTab = (section, id, isSubsystem = false, isSpecialReport = false) => {
        let infoTabsData = [];
        infoTabsData = [
            {
                key: "narrative",
                name: "Narrative",
                path: `/reports/${section}/${id}/narrative`
            },
            {
                key: "insert",
                name: "Tables",
                path: `/reports/${section}/${id}/insert`
            },
            {
                key: "images",
                name: "Images",
                path: `/reports/${section}/${id}/images`
            },
            {
                key: "recomendations",
                name: "Recommendations",
                path: `/reports/${section}/${id}/recomendations`
            }
        ];
        if (isSubsystem) {
            let subsytemTab = {
                key: "imagesRecommendation",
                name: "Images - Recommendations",
                path: `/reports/${section}/${id}/imagesRecommendation`
            };
            infoTabsData.splice(1, 0, subsytemTab);
        }
        if (isSpecialReport) {
            let chartsTab = {
                key: "charts",
                name: "Charts",
                path: `/reports/${section}/${id}/charts`
            };
            infoTabsData.splice(1, 0, chartsTab);
        }
        this.setState({ infoTabsData });
    };

    componentDidUpdate = async (prevProps, prevState) => {
        const {
            location: { search },
            match: {
                params: { id, section, tab }
            }
        } = this.props;
        const query = qs.parse(search);

        if (prevProps.match.params.id !== id) {
            this.setInfoTab(section, id);
            await this.renderData();
        } else if (prevProps.match.params.section !== section) {
            await this.renderData();
        } else if (prevProps.match.params.tab !== tab) {
            await this.renderDetails();
        } else if (qs.parse(prevProps.location.search).narratable_id !== query.narratable_id) {
            await this.setState({
                narratives: []
            });
            await this.renderDetails();
            if (query.narratable_type === "SubSystem") {
                this.setInfoTab(section, id, { isSubsystem: true });
            }
            if (SPECIAL_REPORT_NARRATABLES.includes(query.narratable_type)) {
                this.setInfoTab(section, id, false, true);
            }
        }
    };

    renderImageBandModal = () => {
        const { showImageBandModal, narrativeCompleted } = this.state;
        if (!showImageBandModal) return null;
        return (
            <Portal
                body={
                    <ImageBandModal
                        onCancel={() => this.setState({ showImageBandModal: false })}
                        insertNarrativeBand={
                            narrativeCompleted
                                ? (type, subType) =>
                                      this.setState({
                                          warningModal: {
                                              show: true,
                                              heading: "Do you really want to edit the Narrative ?",
                                              message: "This narrative is marked as completed. This action will mark the narrative as incomplete.",
                                              type: "cancel",
                                              onYes: () => this.insertNarrativeBand(type, subType)
                                          }
                                      })
                                : this.insertNarrativeBand
                        }
                    />
                }
                onCancel={() => this.setState({ showImageBandModal: false })}
            />
        );
    };

    appendMenu = (menuItems, temp, item, open) => {
        const menuData = this.appendNodes(menuItems, temp, item, open);
        this.setState({ menuData });
    };
    appendNodes = (menuData, temp, item, open) => {
        if (open) {
            menuData =
                menuData?.length &&
                menuData.map(menu => {
                    if (menu?.nodes?.length) {
                        return {
                            ...menu,
                            nodes: this.appendNodes(menu.nodes, temp, item, open)
                        };
                    } else {
                        if (menu.key === item.key) return { ...menu, nodes: temp };
                        else return menu;
                    }
                });
        } else {
            menuData =
                menuData &&
                menuData.length &&
                menuData.map(menu => {
                    if (menu.nodes && menu.nodes.length && item.entity !== menu.entity) {
                        return {
                            ...menu,
                            nodes: this.appendNodes(menu.nodes, temp, item, open)
                        };
                    } else {
                        if (menu.key === item.key) return { ...menu, nodes: [] };
                        else return menu;
                    }
                });
        }
        return menuData;
    };

    isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, narrativeRecommendationsTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };

    getChildMenu = async (entity, param, entityId, parents) => {
        let childMenu = [];
        switch (entity) {
            case "Project":
                await this.props.getProjectsMenu(param);
                childMenu = this.props.fcaReportReducer.getAllProjectsMenu;
                break;
            case "region":
                await this.props.getRegionsMenu({
                    ...param,
                    region_id: entityId
                });
                childMenu = this.props.fcaReportReducer.getAllRegionsMenu;
                break;
            case "Region":
                await this.props.getRegionsMenu({
                    ...param,
                    region_id: entityId
                });
                childMenu = this.props.fcaReportReducer.getAllRegionsMenu;
                break;
            case "Site":
                await this.props.getSiteBuildings({
                    ...param,
                    building_id: null,
                    site_id: entityId
                });
                childMenu = this.props.fcaReportReducer.getAllSiteBuildingsMenu;
                break;
            case "Building":
                await this.props.getTradeMenu({
                    ...param,
                    building_id: entityId,
                    site_id: parents[0]?.key
                });
                childMenu = this.props.fcaReportReducer.getAllTradeMenu;
                break;
            case "Trade":
                await this.props.getSystemMenu({
                    ...param,
                    trade_id: entityId,
                    building_id: parents[0]?.key
                });
                childMenu = this.props.fcaReportReducer.getAllSystemMenu;
                break;
            case "System":
                await this.props.getSubsystemMenu({
                    ...param,
                    system_id: entityId,
                    trade_id: parents[0]?.key,
                    building_id: parents[1]?.key
                });
                childMenu = this.props.fcaReportReducer.getAllSubSystemMenu;
                break;
            case "BuildingSpecialReport":
                await this.props.getBuildingReportPrargraphsMenu({
                    ...param,
                    special_report_id: entityId,
                    building_id: parents[0]?.key
                });
                childMenu = this.props.fcaReportReducer.getBuildingReportPrargraphsMenu;
                break;
            case "BuildingReportParagraph":
                await this.props.getBuildingChildPrargraphsMenu({
                    ...param,
                    report_paragraph_id: entityId,
                    special_report_id: parents[0]?.key,
                    building_id: parents[1]?.key
                });
                childMenu = this.props.fcaReportReducer.getBuildingChildPrargraphsMenu;
                break;
            case "SiteSpecialReport":
                await this.props.getSiteReportPrargraphsMenu({
                    ...param,
                    special_report_id: entityId,
                    site_id: parents[0]?.key
                });
                childMenu = this.props.fcaReportReducer.getSiteReportPrargraphsMenu;
                break;
            case "SiteReportParagraph":
                await this.props.getSiteChildPrargraphsMenu({
                    ...param,
                    report_paragraph_id: entityId,
                    special_report_id: parents[0]?.key,
                    site_id: parents[1]?.key
                });
                childMenu = this.props.fcaReportReducer.getSiteChildPrargraphsMenu;
                break;
            case "RegionSpecialReport":
                await this.props.getRegionReportPrargraphsMenu({
                    ...param,
                    special_report_id: entityId,
                    region_id: parents[0]?.key
                });
                childMenu = this.props.fcaReportReducer.getRegionReportPrargraphsMenu;
                break;
            case "RegionReportParagraph":
                await this.props.getRegionChildPrargraphsMenu({
                    ...param,
                    report_paragraph_id: entityId,
                    special_report_id: parents[0]?.key,
                    region_id: parents[1]?.key
                });
                childMenu = this.props.fcaReportReducer.getRegionChildPrargraphsMenu;
                break;
            case "ProjectSpecialReport":
                await this.props.getProjectReportPrargraphsMenu({
                    ...param,
                    special_report_id: entityId
                });
                childMenu = this.props.fcaReportReducer.getProjectReportPrargraphsMenu;
                break;
            case "ProjectReportParagraph":
                await this.props.getProjectChildPrargraphsMenu({
                    ...param,
                    report_paragraph_id: entityId,
                    special_report_id: parents[0]?.key
                });
                childMenu = this.props.fcaReportReducer.getProjectChildPrargraphsMenu;
                break;

            default:
                break;
        }
        return childMenu;
    };
    showSubMenu = async (e, open, item, parents = []) => {
        e.stopPropagation();
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        let param = {
            project_id: query.pid,
            building_id: this.props.match.params.id
        };
        const { menuData } = this.state;
        if (!open) {
            this.appendMenu(menuData, [], item, false);
        } else {
            const childMenu = await this.getChildMenu(item.entity, param, item.key, parents);
            let newChildMenu = [];
            childMenu?.nodes?.length &&
                childMenu.nodes.forEach(childMenu =>
                    newChildMenu.push({
                        entity: childMenu.entity,
                        key: childMenu.key,
                        label: childMenu.label,
                        url: childMenu.url,
                        view_info: childMenu.view_info,
                        bc: childMenu.bc,
                        has_recommendations: childMenu.has_recommendations,
                        has_narrative: childMenu.has_narrative,
                        narrative_completed: childMenu.narrative_completed,
                        children_completed: childMenu.children_completed,
                        global_completed: childMenu.global_completed,
                        has_child:
                            childMenu.has_child === "false" || childMenu.has_child === false
                                ? false
                                : childMenu.has_child === "true" || childMenu.has_child === true
                                ? true
                                : true
                    })
                );
            this.appendMenu(menuData, newChildMenu, item, true);
        }
    };

    handleTab = async tab => {
        this.setState({ showTabSwitchConfirmModal: false });
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        let querystring = qs.stringify(query);
        history.push(`${tab.path}?${querystring}`);
    };

    confirmTabChange = tab => {
        this.setState({ showTabSwitchConfirmModal: true, clickedTab: tab });
    };

    confirmMenuChange = (e, item) => {
        this.setState({ showMenuSwitchConfirmModal: true, clickedMenuItem: { e, item } });
    };

    handleMenu = (e, item) => {
        this.setState({ showMenuSwitchConfirmModal: false, selectedMenu: item });
        e.stopPropagation();
        const {
            location: { search },
            match: {
                params,
                params: { id, section }
            }
        } = this.props;

        const query = qs.parse(search);
        if (section === "projects") {
            query.project_id = id;
        } else if (section === "regions") {
            query.region_id = id;
        } else if (section === "sites") {
            query.site_id = id;
        } else if (section === "building") {
            query.building_id = id;
        }
        query.narratable_type = item.entity;
        query.narratable_id = item.key;
        let url = qs.parse(item.url.split("?")[1]);
        query.trade_id = url.tid;
        query.c_id = url.cid;
        if (url.region_id) {
            query.region_id = url.region_id;
        }
        if (url.site_id) {
            query.site_id = url.site_id;
        }
        if (url.building_id) {
            query.building_id = url.building_id;
        }
        if (url.system_id) {
            query.system_id = url.system_id;
        }
        let querystring = qs.stringify(query);
        history.push(`${this.props.match.url}?${querystring}`);
        // if (item.entity === "SubSystem") {
        this.setInfoTab(section, id);
        this.setState({ breadCrumbData: item.bc });
        // }
    };

    addNarratives = async (data, isComplete) => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        let narrative = {
            text_format: data ? JSON.stringify(data) : "",
            project_id: query.pid,
            building_id: query.building_id,
            narratable_type: query.narratable_type,
            narratable_id: query.narratable_id
        };
        this.setState({
            isLoading: true
        });
        await this.props.addNarrative({ narrative });
        const { addNarrative } = this.props.fcaReportReducer;
        if (data && !isComplete) {
            this.setState(
                {
                    alertMessage: addNarrative?.message || "Something went wrong..!"
                },
                () => this.showAlert()
            );
        }
        await this.getNarrative();
        if (data) {
            this.setMenuData("has_narrative", "true");
            this.setMenuData("global_completed", false);
            this.setMenuData("narrative_completed", false, true);
        }
        this.setState({
            isLoading: false,
            alertMessage: "",
            isUnSaved: false,
            narrativeId: addNarrative.id
        });
        this.props.setFormDirty(false);
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

    getNarrativeChart = async (id, params) => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        let chartData = {
            project_id: query.pid,
            building_id: query.building_id,
            narratable_type: query.narratable_type,
            narratable_id: query.narratable_id
        };
        await this.props.getNarrativeChart({});
    };

    getChartDetails = async chart_type => {
        const {
            location: { search },
            match: {
                params: { section, id }
            }
        } = this.props;

        const query = qs.parse(search);
        let entity_type = null;
        let entity_id = null;
        if (query.narratable_type === "BuildingSpecialReport") {
            entity_type = "Building";
            entity_id = query.building_id;
        } else if (query.narratable_type === "BuildingReportParagraph") {
            entity_type = "Building";
            entity_id = query.building_id;
        } else if (query.narratable_type === "BuildingChildParagraph") {
            entity_type = "Building";
            entity_id = query.building_id;
        } else if (query.narratable_type === "SiteSpecialReport") {
            entity_type = "Site";
            entity_id = query.site_id;
        } else if (query.narratable_type === "SiteReportParagraph") {
            entity_type = "Site";
            entity_id = query.site_id;
        } else if (query.narratable_type === "SiteChildParagraph") {
            entity_type = "Site";
            entity_id = query.site_id;
        } else if (query.narratable_type === "RegionSpecialReport") {
            entity_type = "Region";
            entity_id = query.region_id;
        } else if (query.narratable_type === "RegionReportParagraph") {
            entity_type = "Region";
            entity_id = query.region_id;
        } else if (query.narratable_type === "RegionChildParagraph") {
            entity_type = "Region";
            entity_id = query.region_id;
        } else if (query.narratable_type === "ProjectSpecialReport") {
            entity_type = "Project";
            entity_id = query.project_id;
        } else if (query.narratable_type === "ProjectReportParagraph") {
            entity_type = "Project";
            entity_id = query.project_id;
        } else if (query.narratable_type === "ProjectChildParagraph") {
            entity_type = "Project";
            entity_id = query.project_id;
        }

        let chartData = {
            project_id: query.pid,
            chart_type: chart_type,
            entity_type,
            entity_id
        };
        await this.props.getChartDetails({ ...chartData });
        await this.setState({
            graphData: {
                chartData: this.props.fcaReportReducer.getChartDetailsResponse.chart,
                chartName: this.props.fcaReportReducer.getChartDetailsResponse.chart_name,
                projectName: this.props.fcaReportReducer.getChartDetailsResponse.project_name,
                xl_chart: this.props.fcaReportReducer.getChartDetailsResponse.xl_chart
            }
        });
    };

    getAllImages = async (id, params) => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        let imageData = {
            project_id: query.pid,
            building_id: query.building_id,
            narratable_type: query.narratable_type,
            narratable_id: query.narratable_id
        };
        await this.props.getAllImages({ ...imageData, ...params });
    };

    getAllImageRecommendation = async (id, paginationParams) => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const { params } = this.state;
        let recomendationsParam = {};
        recomendationsParam.narratable_id = query.narratable_id;
        recomendationsParam.narratable_type = query.narratable_type;
        recomendationsParam.project_id = params.project_id;
        recomendationsParam.site_id = params.site_id;
        recomendationsParam.building_id = query.building_id;
        this.setState({
            recomendationsParam
        });
        await this.props.getNarrativeRecommendationsImage({ ...recomendationsParam, ...paginationParams });
    };

    updloadImage = async imageData => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        imageData.project_id = query.pid;
        imageData.building_id = query.building_id;
        imageData.narratable_id = query.narratable_id;
        imageData.narratable_type = query.narratable_type;

        await this.props.uploadImage(imageData);
    };

    updateImageComment = async imageData => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        imageData.narratable_type = query.narratable_type;
        await this.props.updateImageComment(imageData);
        let usedImage = this.checkIfNarrativeImageUsed(imageData.id);
        if (usedImage) {
            this.setState({ narrativeCompleted: false });
            this.setMenuData("narrative_completed", false, true);
        }
    };

    updateRecomImage = async imageData => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        imageData.narratable_type = query.narratable_type;
        await this.props.updateRecomImage(imageData);
        let usedImage = this.checkIfNarrativeImageUsed(imageData.id);
        if (usedImage) {
            this.setState({ narrativeCompleted: false });
            this.setMenuData("narrative_completed", false, true);
        }
    };

    deleteImage = async imageId => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        let params = {};
        params.narratable_type = query.narratable_type;
        params.id = imageId;
        await this.props.deleteImage(params);
        const { deleteImagesResponse } = this.props.fcaReportReducer;
        this.setState(
            {
                alertMessage: deleteImagesResponse.message || "Image deleted successfully"
            },
            () => this.showAlert()
        );
        let usedImage = this.checkIfNarrativeImageUsed(imageId);
        if (usedImage) {
            this.setState({ narrativeCompleted: false });
            this.setMenuData("narrative_completed", false, true);
        }
    };

    getNarrative = async () => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        let narrativeParam = {};
        narrativeParam = {
            project_id: query.pid,
            building_id: query.building_id,
            narratable_type: query.narratable_type,
            narratable_id: query.narratable_id
        };
        let obj = {
            index: 0,
            id: uuidv4(),
            type: BandTypes.textBand,
            data: [],
            xml: null
        };
        await this.props.getNarrative(narrativeParam);
        const { narrative } = this.props.fcaReportReducer.getNarrative || {};
        let narratives = [];
        if (narrative?.text_format) {
            narratives = JSON.parse(narrative.text_format);
        } else {
            narratives = [obj];
            // To auto populate report notes and recommendation images
            if (query.narratable_type === "SubSystem") {
                await this.refreshRecommendationNotes();
                let reportNoteObj = {
                    index: 1,
                    id: uuidv4(),
                    type: BandTypes.reportNoteBand,
                    data: this.setAutoPopulateReportNoteBand() || [],
                    xml: null
                };
                narratives = [obj, reportNoteObj];
                await this.refreshImageRecommendation();
                const { recomImageList } = this.state;
                if (recomImageList && recomImageList.length) {
                    narratives = this.setAutoPopulateImageBands(recomImageList, narratives);
                }
            }
        }
        let narrativeCompleted = !!narrative?.completed;
        let narrativeId = narrative?.id;
        let childrenCompleted = narrative?.children_completed;
        let globalCompleted = narrative?.global_completed;
        let siteId = narrative?.site_id;
        let narrativeTimes = {
            created_at: narrative?.created_at,
            updated_at: narrative?.updated_at,
            completed_at: narrative?.completed_at
        };
        this.setState({ narratives, narrativeId, narrativeTimes, childrenCompleted, globalCompleted, siteId }, () =>
            this.setState({ narrativeCompleted })
        );
    };

    autoPopulateImages = async () => {
        this.setState({ isLoading: true });
        const { narratives } = this.state;
        let tempNarratives = narratives;
        await this.refreshImageRecommendation();
        const { recomImageList } = this.state;
        if (recomImageList && recomImageList.length) {
            tempNarratives = this.setAutoPopulateImageBands(recomImageList, narratives, true);
        }
        await this.setState(
            {
                narratives: tempNarratives,
                isLoading: false,
                isUnSaved: true
            },
            () => this.scrollToBottom()
        );
        this.props.setFormDirty(false);
    };

    autoPopulateReportNotes = async () => {
        this.setState({ isLoading: true });
        const { narratives } = this.state;
        let tempNarratives = narratives;
        await this.refreshRecommendationNotes();
        let reportNoteObj = {
            index: narratives.length,
            id: uuidv4(),
            type: BandTypes.reportNoteBand,
            data: this.setAutoPopulateReportNoteBand() || [],
            xml: null
        };
        tempNarratives.push(reportNoteObj);
        await this.setState(
            {
                narratives: tempNarratives,
                isLoading: false,
                isUnSaved: true
            },
            () => this.scrollToBottom()
        );
        this.props.setFormDirty(true);
    };

    autoPopulateTableTemplates = async () => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        let params = {
            narratable_id: query.narratable_id,
            narratable_type: query.narratable_type,
            project_id: query.pid,
            building_id: query.building_id
        };
        await this.props.autoPopulateTableTemplates(params);
        this.setState(
            {
                alertMessage: this.props.fcaReportReducer.autoPopulateTableTemplatesResponse?.message || ""
            },
            () => this.showAlert()
        );
        return true;
    };

    setAutoPopulateReportNoteBand = () => {
        const { recomNoteList = [] } = this.state;
        let returnArray = "";
        if (recomNoteList && recomNoteList.length) {
            recomNoteList.map(item => (returnArray = returnArray + `<p>${item.notes?.replaceAll("\n", "</p><p>")}</p>`));
        }
        return [returnArray];
    };

    setAutoPopulateImageBands = (recomImageList, arr, isManual = false) => {
        let respArray = arr;
        let printableImages = recomImageList.filter(image => image.printable);
        if (isManual) {
            printableImages = this.filterUsedImages(printableImages);
        }
        if (isManual && !printableImages.length) {
            this.setState(
                {
                    alertMessage: "No New Images!"
                },
                () => this.showAlert()
            );
        } else {
            for (let i = 0; i < Math.ceil(printableImages.length / 2); i++) {
                respArray.push({
                    index: respArray.length + i,
                    id: uuidv4(),
                    type: BandTypes.doubleImageBand,
                    data: [printableImages[i * 2], printableImages[i * 2 + 1]],
                    xml: null
                });
            }
        }
        return respArray;
    };

    insertNarrativeBand = async (type, subType = "") => {
        let data = [];
        if (type === BandTypes.recommendationBand) {
            data[0] = await this.insertNarrativeRecommendations();
        }
        let obj = {
            index: this.state.narratives.length,
            id: uuidv4(),
            type,
            subType,
            data,
            xml: null
        };
        this.setState(
            state => {
                const narratives = [...state.narratives, obj];
                return { narratives, showImageBandModal: false, isUnSaved: true, narrativeCompleted: false };
            },
            () => this.scrollToBottom()
        );
        this.props.setFormDirty(true);
    };

    insertNarrativeRecommendations = async () => {
        this.setState({ isLoading: true });
        let data = "";
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const { params } = this.state;
        let recomendationsParam = params;
        recomendationsParam.limit = 200; //********* limited to 200 data  ******/
        recomendationsParam.narratable_id = query.narratable_id;
        recomendationsParam.narratable_type = query.narratable_type;
        await this.props.getNarrativeRecommendations(recomendationsParam);
        let recommendation = this.props.fcaReportReducer.getNarrativeRecommendations.recommendations;
        if (recommendation && recommendation.length) {
            // ***** Sort ==> year asc & amount desc
            let sortedRecom = recommendation.sort(
                (objA, objB) =>
                    objA?.maintenance_years?.filter(a => a.amount > 0)?.sort((yA, yB) => yA.year - yB.year)[0]?.year -
                    objB?.maintenance_years?.filter(b => b.amount > 0)?.sort((yA, yB) => yA.year - yB.year)[0]?.year
            );
            let temp = sortedRecom
                ?.map(obj => {
                    let years = obj.maintenance_years
                        ?.filter(item => item.amount > 0)
                        .map(item => item.year)
                        .join(", ");
                    return `<li>${obj.description} - ${years} - $${obj.project_total?.toLocaleString()}</li>`;
                })
                .join("");
            data = `<ul>${temp}</ul>`;
        } else {
            data = "<ul><li> </li></ul>";
        }
        this.setState({ isLoading: false });
        return data;
    };

    scrollToBottom = () => {
        if (!this.narrativeEnd.current) return null;
        this.narrativeEnd.current.scrollIntoView({ block: "end", behavior: "smooth" });
    };

    // settings narrative data to curresponding band
    setNarrativeData = (data, idx, bandIndex = 0) => {
        this.setState(state => {
            const narratives = state.narratives.map((item, i) => {
                if (i === idx) {
                    item.data[bandIndex] = data;
                    return item;
                } else {
                    return item;
                }
            });
            return { narratives, isUnSaved: true, narrativeCompleted: false, globalCompleted: false };
        });
        this.props.setFormDirty(true);
    };

    deleteNarrativeBand = idx => {
        let bands = [...this.state.narratives];
        let newBands = bands.filter((item, index) => index !== idx);
        this.setState({ narratives: newBands, showConfirmModal: false, isUnSaved: true }, () => {
            this.setState({ narrativeCompleted: false });
        });
        this.props.setFormDirty(true);
    };

    saveNarrativeData = async (isComplete = false) => {
        if (this.validateNarrative()) {
            // formatting narratives data xml tags for report doc (python backend)
            await this.setState(state => {
                const narratives = state.narratives.map((item, i) => {
                    if (!item.data?.length) return item;
                    if (item.type === BandTypes.insertBand) {
                        item.xml = item.data[0]?.text_format;
                        item.footer = item.data[0]?.footer;
                    } else {
                        let convertedData = convertToXML(item.data, item.type, item.subType);
                        item.xml = convertedData;
                    }
                    return item;
                });
                return { narratives };
            });
            await this.addNarratives(this.state.narratives, isComplete);
            return true;
        } else return false;
    };

    validateNarrative = (needAlert = true) => {
        const { narratives } = this.state;
        let alertMessage = "";
        if (!narratives.length) {
            if (needAlert) {
                alertMessage = "Oops..! No narrative found";
                this.setState({ alertMessage }, () => this.showAlert());
            }
            return false;
        } else {
            let emptyBand = narratives.some(item =>
                item.type === BandTypes.doubleImageBand
                    ? !item.data[0] && !item.data[1]
                    : item.type !== BandTypes.reportNoteBand
                    ? !item.data[0]
                    : false
            );
            if (emptyBand) {
                if (needAlert) {
                    alertMessage = "Oops..! Empty band found, Scroll to review";
                    this.setState({ alertMessage }, () => this.showAlert());
                }
                return false;
            } else {
                let invalidRecom = narratives.some(
                    item =>
                        item.type === BandTypes.recommendationBand &&
                        (item.data[0].includes("<p>") ||
                            item.data[0].includes("</p>") ||
                            !item.data[0].startsWith("<ul>") ||
                            !item.data[0].endsWith("</ul>"))
                );
                if (invalidRecom) {
                    if (needAlert) {
                        alertMessage = "Oops..! Only bullet list is supported in Recommendation Band";
                        this.setState({ alertMessage }, () => this.showAlert());
                    }
                    return false;
                }
            }
        }
        return true;
    };

    deleteNarrative = async () => {
        const { narrativeId, selectedMenu } = this.state;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        let param = {
            id: narrativeId,
            narratable_type: query.narratable_type
        };
        await this.props.deleteNarrative(param);
        const { deleteNarrative } = this.props.fcaReportReducer;
        if (deleteNarrative?.success) {
            this.setState(
                {
                    alertMessage: deleteNarrative?.message
                },
                async () => {
                    this.showAlert();
                    await this.getNarrative();
                    this.setMenuData("has_narrative", "false");
                    this.setMenuData("narrative_completed", selectedMenu.has_recommendations === "true" ? false : null, true);
                }
            );
            await this.setState({
                alertMessage: "",
                narrativeCompleted: false,
                isUnSaved: false,
                narrative: []
            });
            await this.renderDetails();
            this.props.setFormDirty(false);
        }
    };

    toggleWildCardFilter = () => {
        const { showWildCardFilter } = this.state;
        this.setState({
            showWildCardFilter: !showWildCardFilter
        });
    };

    updateCurrentViewAllUsers = async key => {
        const { currentViewAllUsers } = this.state;
        await this.setState({
            currentViewAllUsers: currentViewAllUsers === key ? null : key
        });
        return true;
    };

    showViewModal = () => {
        this.setState({
            showViewModal: true
        });
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
        await this.renderDetails();
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
        await this.renderDetails();
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
        this.updateEntityParams();
        await this.renderDetails();
    };

    updateSelectedRow = async rowId => {
        await this.setState({
            selectedRowId: rowId
        });
        await this.updateEntityParams();
    };

    reorderNarrativeBands = async result => {
        const narratives = reorderArray(this.state.narratives, result.source.index, result.destination.index);
        await this.setState({
            narratives,
            isUnSaved: true,
            narrativeCompleted: false
        });
        this.props.setFormDirty(true);
    };

    exportTableXl = async () => {
        const {
            location: { search }
        } = this.props;
        const {
            tableData: { keys, config }
        } = this.state;
        const query = qs.parse(search);
        await this.setState({ tableLoading: true });
        let hide_columns = [];
        keys.map((keyItem, i) => {
            if (config && !config[keyItem]?.isVisible) {
                hide_columns.push(config[keyItem]?.label);
            }
        });
        await this.props.exportRecommendations({
            ...this.state.recomendationsParam,
            project_id: query.pid,
            search: this.state.params.search,
            filters: this.state.params.filters,
            list: this.state.params.list,
            order: this.state.params.order,
            building_ids: this.state.building_ids,
            capital_type: this.state.capital_type,
            start_year: this.state.start_year || null,
            end_year: this.state.end_year || null,
            year: this.state.year,
            dashboard: this.state.dashboard,
            narratable_id: this.state.params.narratable_id,
            narratable_type: this.state.params.narratable_type,
            building_id: query.building_id,
            state_id: this.state.params.state_id,
            hide_columns
        });

        this.setState({ tableLoading: false });
        if (this.props.fcaReportReducer.recommendationExportResponse && this.props.fcaReportReducer.recommendationExportResponse.error) {
            await this.setState({ alertMessage: this.props.fcaReportReducer.recommendationExportResponse.error });
            this.showAlert();
        }
    };

    refreshRecommendationsList = async () => {
        const { params, paginationParams } = this.state;

        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const projectId = params.project_id || query.pid || "";
        if (projectId) {
            await this.props.getPriorityElementDropDownData(projectId);
        }
        let recommendationsList = [];
        let totalCount = 0;
        let crv_total = "";
        let project_total = "";
        let year_totals = {};
        recommendationsList = this.props.fcaReportReducer.getNarrativeRecommendations.recommendations;
        totalCount = this.props.fcaReportReducer.getNarrativeRecommendations.count;
        crv_total = this.props.fcaReportReducer.getNarrativeRecommendations.crv_total;
        year_totals = this.props.fcaReportReducer.getNarrativeRecommendations.year_totals;
        project_total = this.props.fcaReportReducer.getNarrativeRecommendations.project_total;

        let tempRecommendationsList = recommendationsList;

        if (recommendationsList && recommendationsList.length) {
            if (this.props.recommendationsReducer.priorityElementsDropDownResponse?.priority_elements?.length) {
                let tempKeys = this.state.tableData.keys;
                let tempConfig = this.state.tableData.config;
                this.props.recommendationsReducer.priorityElementsDropDownResponse.priority_elements.map((item, i) => {
                    tempKeys.splice(16 + i + 1, 0, `priority_element${i + 1}`);
                    tempConfig[`priority_element${i + 1}`] = {
                        isVisible:
                            this.props.fcaReportReducer.entityParams[this.props.match.params.section]?.tableConfig &&
                            this.props.fcaReportReducer.entityParams[this.props.match.params.section]?.tableConfig[`priority_element${i + 1}`] &&
                            this.props.fcaReportReducer.entityParams[this.props.match.params.section]?.tableConfig[`priority_element${i + 1}`]
                                .isVisible == false
                                ? this.props.fcaReportReducer.entityParams[this.props.match.params.section]?.tableConfig[`priority_element${i + 1}`]
                                      .isVisible
                                : !item.recommendation_required
                                ? false
                                : true,
                        label: item.display_name ? item.display_name : `Priority Element ${i + 1}`,
                        class: "width-230px",
                        searchKey: `priority_elements.${i + 1}`,
                        type: "number",
                        hasWildCardSearch: true,
                        hasCommonSearch: false,
                        getListTable: "priority_element",
                        commonSearchKey: "priority_elements",
                        commonSearchObjectKey: `${i + 1}`
                    };
                });
                tempKeys = _.uniq(tempKeys);
                await this.setState({
                    tableData: {
                        ...this.state.tableData,
                        keys: tempKeys,
                        config: tempConfig
                    }
                });
            }

            recommendationsList.map((item, i) => {
                if (item.priority_elements && item.priority_elements.length) {
                    item.priority_elements.map(yearItem => {
                        tempRecommendationsList[i][`priority_element${yearItem.index}`] = yearItem.option_id || yearItem.element || null;
                    });
                }
            });

            if (recommendationsList[0].maintenance_years && recommendationsList[0].maintenance_years.length) {
                let tempKeys = this.state.tableData.keys;
                let tempConfig = this.state.tableData.config;
                recommendationsList[0].maintenance_years.sort((a, b) => (a.year > b.year ? 1 : -1));
                recommendationsList[0].maintenance_years.map(item => {
                    tempKeys.push(`year_${item.year}`);
                    tempConfig[`year_${item.year}`] = {
                        isVisible:
                            this.props.fcaReportReducer.entityParams.tableConfig &&
                            this.props.fcaReportReducer.entityParams.tableConfig[`year_${item.year}`] &&
                            this.props.fcaReportReducer.entityParams.tableConfig[`year_${item.year}`].isVisible == false
                                ? this.props.fcaReportReducer.entityParams.tableConfig[`year_${item.year}`].isVisible
                                : true,
                        label: item.year,
                        class: " width-140px ",
                        searchKey: `maintenance_years.${item.year}`,
                        type: "number",
                        hasWildCardSearch: true,
                        hasCommonSearch: false,
                        hasCutPaste: false,
                        getListTable: "maintenance_year",
                        commonSearchKey: "maintenance_years",
                        commonSearchObjectKey: `${item.year}`
                    };
                });
                tempKeys = _.uniq(tempKeys);
                this.setState({
                    tableData: {
                        ...this.state.tableData,
                        keys: tempKeys,
                        config: tempConfig
                    },
                    maintenance_years: [...recommendationsList[0].maintenance_years]
                });
            }
            recommendationsList.map((item, i) => {
                if (item.maintenance_years && item.maintenance_years.length) {
                    item.maintenance_years.map(yearItem => {
                        tempRecommendationsList[i][`year_${yearItem.year}`] = parseInt(yearItem.amount || 0);
                    });
                }
            });
        }

        // go to previous page is the last record of the current page is deleted
        if (recommendationsList && !recommendationsList.length && paginationParams.currentPage) {
            this.setState({
                params: {
                    ...params
                    // offset: (paginationParams.currentPage - 1) * paginationParams.perPage
                }
            });
            await this.props.getAllRecommendations(this.state.recomendationsParam);
        }
        if (
            recommendationsList &&
            !recommendationsList.length &&
            this.props.fcaReportReducer.getNarrativeRecommendations &&
            this.props.fcaReportReducer.getNarrativeRecommendations.error
        ) {
            await this.setState({ alertMessage: this.props.fcaReportReducer.getNarrativeRecommendations.error });
            this.showAlert();
        }
        this.setState({
            tableData: {
                ...this.state.tableData,
                data: tempRecommendationsList,
                config: this.props.fcaReportReducer.entityParams.tableConfig || this.state.tableData.config
            },
            tempRecommendationsList,
            paginationParams: {
                ...paginationParams,
                totalCount: totalCount,
                totalPages: Math.ceil(totalCount / paginationParams.perPage)
            },
            summaryRowData: {
                ...this.state.summaryRowData,
                crv_total: crv_total,
                year_totals: year_totals,
                project_total: project_total
            },
            showWildCardFilter: this.state.params.filters ? true : false
        });

        return true;
    };

    updateEntityParams = async value => {
        let entityParams = {
            entity: "Recommendation-Narrative",
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
        await this.props.updateNarrativeRecommendationEntityParams(entityParams);
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
        await this.updateEntityParams();
        await this.renderDetails();
    };

    selectFilterHandler = async e => {
        localStorage.removeItem("recommendationIds");
        localStorage.removeItem("selectAll");
        switch (e.target.value) {
            case "deleted":
                this.setState({
                    params: {
                        ...this.state.params,
                        deleted: true,
                        active: null,
                        locked: null,
                        unlocked: null,
                        view: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "active":
                this.setState({
                    params: {
                        ...this.state.params,
                        active: true,
                        deleted: null,
                        unlocked: null,
                        locked: null,
                        view: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "locked":
                this.setState({
                    params: {
                        ...this.state.params,
                        locked: true,
                        unlocked: null,
                        deleted: null,
                        active: null,
                        view: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "unlocked":
                this.setState({
                    params: {
                        ...this.state.params,
                        unlocked: true,
                        deleted: null,
                        active: null,
                        locked: null,
                        view: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "assigned":
                this.setState({
                    params: {
                        ...this.state.params,
                        view: "assigned",
                        unlocked: null,
                        deleted: null,
                        active: null,
                        locked: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "unassigned":
                this.setState({
                    params: {
                        ...this.state.params,
                        view: "unassigned",
                        unlocked: null,
                        deleted: null,
                        active: null,
                        locked: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "all":
                this.setState({
                    params: {
                        ...this.state.params,
                        deleted: null,
                        active: null,
                        locked: null,
                        unlocked: null,
                        view: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "completed":
                this.setState({
                    params: {
                        ...this.state.params,
                        deleted: null,
                        active: null,
                        locked: null,
                        unlocked: null,
                        view: null,
                        on_hold: null,
                        completed: true
                    },
                    selectedDropdown: e.target.value
                });
                break;
            case "on_hold":
                this.setState({
                    params: {
                        ...this.state.params,
                        deleted: null,
                        active: null,
                        locked: null,
                        unlocked: null,
                        view: null,
                        on_hold: true,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
                break;
            default:
                this.setState({
                    params: {
                        ...this.state.params,
                        deleted: null,
                        active: null,
                        locked: null,
                        unlocked: null,
                        view: null,
                        on_hold: null,
                        completed: null
                    },
                    selectedDropdown: e.target.value
                });
        }
        await this.updateEntityParams();
        await this.renderDetails();
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
                        maintenance_year: tempYear
                    }
                });
            } else {
                await this.setState({
                    params: {
                        ...this.state.params,
                        order: { ["maintenance_years.amount"]: "asc" },
                        maintenance_year: tempYear
                    }
                });
            }
        } else if (main_key === "priority_elements") {
            if (!tempIndex.includes(searchKey.split(".")[1])) {
                tempIndex.push(searchKey.split(".")[1]);
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
        await this.renderDetails();
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
                view: "active",
                locked: null,
                unlocked: null,
                active: true,
                on_hold: null,
                completed: null
            },
            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null,
            selectedDropdown: "active",
            selectedDropdownInitiaive: "active"
        });
        this.updateEntityParams();
        await this.renderDetails();
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
        await this.renderDetails();
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
                config: _.cloneDeep(narrativeRecommendationsTableData.config)
            },

            wildCardFilterParams: {},
            filterParams: {},
            selectedRowId: null
        });
        this.updateEntityParams();
        await this.renderDetails();
    };

    getListForCommonFilter = async params => {
        const {
            search,
            filters,
            list,
            view,
            deleted,
            on_hold,
            completed,
            locked,
            unlocked,
            active,
            narratable_type,
            narratable_id,
            building_id,
            site_id
        } = this.state.params;
        const query = qs.parse(this.props.location.search);
        params.project_id = query.pid;

        params.search = search;
        params.filters = filters;
        params.list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== params?.field)) : null;
        params.view = view;
        params.deleted = deleted;
        params.on_hold = on_hold;
        params.completed = completed;
        params.locked = locked;
        params.unlocked = unlocked;
        params.active = active;
        params.narratable_id = narratable_id;
        params.narratable_type = narratable_type;
        params.building_id = query.building_id;
        params.site_id = site_id;

        // if (section === "building") {
        //     params.building_id = this.props.match.params.id;
        // } else if (section === "site") {
        //     params.site_id = this.props.match.params.id;
        // }
        await this.props.getListForCommonFilterNarrativeRecommendation(params);
        return (this.props.fcaReportReducer.getListForCommonFilterResponse && this.props.fcaReportReducer.getListForCommonFilterResponse.list) || [];
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
        await this.renderDetails();
    };

    renderConfirmationModal = () => {
        const { showConfirmModal, narrativeCompleted } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to delete the band and lose all changes?"}
                        message={
                            narrativeCompleted
                                ? "This narrative is marked as completed. This action will mark the narrative as incomplete."
                                : "This action cannot be reverted, Are you sure that you need to remove this band?"
                        }
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={() => this.deleteNarrativeBand(this.state.selectedBand)}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    renderMenuSwitchConfirmationModal = () => {
        const {
            showMenuSwitchConfirmModal,
            clickedMenuItem: { e, item }
        } = this.state;
        if (!showMenuSwitchConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"You have unsaved changes that will be lost if you decide to continue."}
                        message={"Are you sure you want to leave this page?"}
                        onNo={() => this.setState({ showMenuSwitchConfirmModal: false })}
                        onYes={() => {
                            this.handleMenu(e, item);
                            this.setState({ isUnSaved: false });
                            this.props.setFormDirty(false);
                        }}
                    />
                }
                onCancel={() => this.setState({ showMenuSwitchConfirmModal: false })}
            />
        );
    };

    renderTabSwitchConfirmModal = () => {
        const { showTabSwitchConfirmModal, clickedTab } = this.state;
        if (!showTabSwitchConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"You have unsaved changes that will be lost if you decide to continue."}
                        message={"Are you sure you want to leave this page?"}
                        onNo={() => this.setState({ showTabSwitchConfirmModal: false })}
                        onYes={() => {
                            this.handleTab(clickedTab);
                            this.setState({ isUnSaved: false });
                            this.props.setFormDirty(false);
                        }}
                    />
                }
                onCancel={() => this.setState({ showTabSwitchConfirmModal: false })}
            />
        );
    };

    onNarrativeDelete = index => {
        this.setState({ selectedBand: index, showConfirmModal: true });
    };

    showInfoPage = recommendationsId => {
        this.setState({
            showRecommendationInfo: !this.state.showRecommendationInfo,
            selectedRecommendationId: recommendationsId
        });
    };

    showEditPage = recommendationsId => {
        const { showRecommendationEdit } = this.state;
        this.setState({
            showRecommendationInfo: false,
            showRecommendationEdit: !showRecommendationEdit,
            selectedRecommendationId: recommendationsId
        });
    };

    exportReport = async (type = "partial") => {
        let tradeName = this.props.fcaReportReducer.getNarrative.trade_name;
        if (!tradeName) return window.alert("Please provide a display name for the trade.");
        if (!this.state.narrativeId) {
            await this.addNarratives(null, false);
        }
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);

        const { narrativeId, selectedMenu, siteId } = this.state;
        let narratableName = query.narratable_type === "Trade" ? tradeName : selectedMenu?.label;
        let params = {
            project_id: query.pid,
            building_id: query.building_id,
            narratable_type: query.narratable_type,
            narratable_id: query.narratable_id,
            narratable_name: narratableName || "",
            username: localStorage.getItem("user"),
            trade_name: tradeName,
            export_type: type,
            narratives_id: narrativeId || "",
            site_id: siteId
        };
        this.setState({ isLoading: true });
        await this.props.exportReport(params);
        await this.props.addUserActivityLog({ text: "Exported report." });
        this.setState({ isLoading: false });
        const { success, pdfpath, Result, Error } = this.props.fcaReportReducer.reportExportResponse || {};
        if (!success) {
            this.setState(
                {
                    alertMessage: this.renderPythonErrorMessages(Error)
                },
                () => this.showAlert()
            );
            return false;
        }
        const link = document.createElement("a");
        link.href = pdfpath;
        link.download = pdfpath;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    confirmExportReport = () => {
        this.setState({ showExportConfirmModal: true });
    };

    renderExportConfirmModal = () => {
        const { showExportConfirmModal } = this.state;
        if (!showExportConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Changes you made may not be saved"}
                        message={"Export anyway?"}
                        onNo={() => this.setState({ showExportConfirmModal: false })}
                        onYes={() => {
                            this.exportReport();
                            this.setState({ showExportConfirmModal: false });
                        }}
                    />
                }
                onCancel={() => this.setState({ showExportConfirmModal: false })}
            />
        );
    };

    addInsert = async insertData => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        insertData.project_id = query.pid;
        insertData.building_id = query.building_id;
        insertData.narratable_id = query.narratable_id;
        insertData.narratable_type = query.narratable_type;

        await this.props.addInsert(insertData);
        const { addInsert } = this.props.fcaReportReducer;
        this.setState(
            {
                alertMessage: addInsert && addInsert.message
            },
            () => this.showAlert()
        );
        this.setState({ alertMessage: "" });
    };

    getAllInserts = async () => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        let params = {
            project_id: query.pid,
            building_id: query.building_id,
            narratable_type: query.narratable_type,
            narratable_id: query.narratable_id
        };
        await this.props.getInserts(params);
    };

    deleteInsert = async id => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        let params = {};
        params.id = id;
        params.narratable_type = query.narratable_type;
        await this.props.deleteInsert(params);
        const { deleteInsert } = this.props.fcaReportReducer;
        this.setState(
            {
                alertMessage: deleteInsert.message || "Table deleted successfully"
            },
            () => this.showAlert()
        );
        let usedTable = this.checkIfNarrativeTableUsed(id);
        if (usedTable) {
            this.setState({ narrativeCompleted: false });
            this.setMenuData("narrative_completed", false, true);
        }
    };

    updateInsert = async insertData => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        insertData.narratable_type = query.narratable_type;
        await this.props.updateInsert(insertData);
        const { updateInsert } = this.props.fcaReportReducer;
        this.setState(
            {
                alertMessage: updateInsert && updateInsert.message
            },
            () => this.showAlert()
        );
        let usedTable = this.checkIfNarrativeTableUsed(insertData.id);
        if (usedTable) {
            this.setState({ narrativeCompleted: false });
            this.setMenuData("narrative_completed", false, true);
        }
        this.setState({ alertMessage: "" });
    };

    setIsUnsaved = bool => {
        this.setState({ isUnSaved: bool });
        this.props.setFormDirty(bool);
    };

    getDataById = async () => {
        await this.props.getRecommendationById(this.state.selectedRecommendationId);
        return this.props.fcaReportReducer.getRecommendationByIdResponse || {};
    };

    discardChanges = async () => {
        this.setState({ showDiscardChangesConfirmationModal: true });
    };

    renderDiscardChangesConfirmationModal = () => {
        const { showDiscardChangesConfirmationModal } = this.state;
        if (!showDiscardChangesConfirmationModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to clear and lose all changes?"}
                        message={"This action cannot be reverted, Are you sure ?"}
                        onNo={() => this.setState({ showDiscardChangesConfirmationModal: false })}
                        onYes={async () => {
                            await this.getNarrative();
                            await this.setState({
                                narratives: []
                            });
                            await this.renderDetails();
                            this.setState({ isUnSaved: false, showDiscardChangesConfirmationModal: false });
                            this.props.setFormDirty(false);
                        }}
                    />
                }
                onCancel={() => this.setState({ showDiscardChangesConfirmationModal: false })}
            />
        );
    };
    //------> image recommendation methods #start
    refreshImageRecommendation = async () => {
        await this.getAllImageRecommendation();
        const { images } = this.props.fcaReportReducer.getNarrativeRecommendationsImage || {};
        await this.setState({
            recomImageList: images
        });
    };

    refreshRecommendationNotes = async () => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const { params } = this.state;
        let recomendationsParam = {};
        recomendationsParam.narratable_id = query.narratable_id;
        recomendationsParam.narratable_type = query.narratable_type;
        recomendationsParam.project_id = params.project_id;
        recomendationsParam.site_id = params.site_id;
        recomendationsParam.building_id = query.building_id;
        this.setState({
            recomendationsParam
        });
        await this.props.getAllRecommendationNotes(recomendationsParam);
        const {
            fcaReportReducer: {
                getAllRecommendationNotesRes: { notes }
            }
        } = this.props;
        await this.setState({
            recomNoteList: notes
        });
    };

    setSelectedRecomImage = async img => {
        const { recomImageList } = this.state;
        await this.setState({
            selectedRecomImage: img
        });
    };
    //------> image recommendation methods #end

    checkIfNarrativeImageUsed = imgId => {
        let imgFound = this.state.narratives
            .filter(narr => narr.type === 2 || narr.type === 3)
            .some(img => img.data.some(data => data?.id === imgId));
        return imgFound;
    };

    checkIfNarrativeTableUsed = tableId => {
        let tableFound = this.state.narratives.filter(narr => narr.type === BandTypes.insertBand).some(img => img.data[0]?.id === tableId);
        return tableFound;
    };

    filterUsedImages = (imgList = []) => {
        let narrImgArr = [];
        this.state.narratives
            .filter(narr => narr.type === BandTypes.singleImageBand || narr.type === BandTypes.doubleImageBand)
            .map(narrImg => narrImg.data.map(data => narrImgArr.push(data?.id)));
        const filtered = imgList.filter(img => narrImgArr.indexOf(img?.id) === -1);
        return filtered;
    };

    filterUsedInserts = (insertList = []) => {
        let narrInsert = [];
        this.state.narratives.filter(narr => narr.type === BandTypes.insertBand).map(insert => insert.data.map(data => narrInsert.push(data?.id)));
        const filtered = insertList.filter(img => narrInsert.indexOf(img?.id) === -1);
        return filtered;
    };

    markAsComplete = async (type = "local_complete") => {
        if (!this.state.narrativeId) {
            //creating empty narrative if no narrative present
            this.setState({ isLoading: true });
            await this.addNarratives(null, false);
        }

        this.setState({ isLoading: true });
        let tradeName = this.props.fcaReportReducer.getNarrative.trade_name;
        if (!tradeName) {
            this.setState({ isLoading: false });
            return window.alert("Please provide a display name for the trade.");
        }

        const {
            location: { search }
        } = this.props;
        const { narrativeId, selectedMenu, siteId } = this.state;
        const query = qs.parse(search);
        let narratableName = query.narratable_type === "Trade" ? tradeName : selectedMenu?.label;
        let params = {
            id: narrativeId,
            narratable_name: narratableName || "",
            username: localStorage.getItem("user"),
            trade_name: tradeName,
            completed: true,
            narratable_type: query.narratable_type,
            export_type: type,
            site_id: siteId
        };
        // calling python api
        await this.props.markAsCompletePython(params);
        await this.props.addUserActivityLog({ text: "Marked as completed." });
        const { markAsCompletePythonResponse } = this.props.fcaReportReducer;

        if (markAsCompletePythonResponse.success) {
            // calling ruby api
            await this.props.markAsCompleteRuby(params);
            const { markAsCompleteRubyResponse } = this.props.fcaReportReducer;
            if (!markAsCompleteRubyResponse.success) {
                this.setState({ alertMessage: markAsCompleteRubyResponse.error || "Something went wrong" }, () => this.showAlert());
            } else {
                this.setState(
                    { alertMessage: type === "local_complete" ? "Narrative marked as completed" : "Narrative marked as global complete" },
                    () => {
                        this.showAlert();
                        this.getNarrative();
                        this.setMenuData("narrative_completed", true);
                        if (type === "complete") {
                            this.setMenuData("global_completed", true);
                        }
                    }
                );
            }
        } else {
            this.setState({ alertMessage: this.renderPythonErrorMessages(markAsCompletePythonResponse.Error) }, () => this.showAlert());
        }
        this.setState({
            alertMessage: "",
            isLoading: false
        });
    };

    renderPythonErrorMessages = type => {
        switch (type) {
            case "TEMPLATE NOT FOUND":
                return "Oops ..! No template found for this project";

            case "SETTING NOT FOUND":
                return "Oops ..! No report property mapped for the template";

            case "XML PARSE ERROR":
                return "Oops ..! XML parse error";

            default:
                return "Something went wrong!";
        }
    };

    renderWarning = () => {
        const { warningModal } = this.state;
        if (!warningModal.show) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type={warningModal.type}
                        heading={warningModal.heading}
                        message={warningModal.message}
                        onNo={() => {
                            if (warningModal.onNo) {
                                warningModal.onNo();
                            }
                            this.setState({ warningModal: { show: false } });
                        }}
                        onYes={async () => {
                            this.setState({ warningModal: { show: false } });
                            await warningModal.onYes();
                        }}
                    />
                }
                onCancel={() => this.setState({ warningModal: { show: false } })}
            />
        );
    };

    getSelectedRecomImages = async (id, paginationParams) => {
        await this.props.getSelectedRecomImages(this.state.selectedRecommendationId, paginationParams);
    };
    // ===============> Updating visual identifiers  <================//
    setMenuData = (param, value, reflectParent = false) => {
        const {
            menuData,
            selectedMenu: { key, entity }
        } = this.state;
        let tempMenu = menuData;
        tempMenu.map(item =>
            item.entity === "Site"
                ? item.nodes.map(building => {
                      return {
                          ...building,
                          nodes: building?.nodes?.map(trade => {
                              if (entity === trade.entity && key === trade.key) {
                                  trade[param] = value;
                                  return trade;
                              } else {
                                  return {
                                      ...trade,
                                      nodes: trade?.nodes?.map(system => {
                                          if (entity === system.entity && key === system.key) {
                                              system[param] = value;
                                              if (reflectParent && this.isNotDeadBranch(trade.nodes)) {
                                                  trade.children_completed = false;
                                                  trade.global_completed = false;
                                              } else if (reflectParent && this.everyChildDead(trade.nodes)) {
                                                  trade.children_completed = null;
                                              } else if (reflectParent) {
                                                  trade.children_completed = true;
                                              }
                                              if (param === "narrative_completed" && value === true && this.everyChildCompleted(trade.nodes)) {
                                                  trade.children_completed = true;
                                              }
                                              return system;
                                          } else {
                                              return {
                                                  ...system,
                                                  nodes: system?.nodes?.map(subSystem => {
                                                      if (entity === subSystem.entity && key === subSystem.key) {
                                                          subSystem[param] = value;
                                                          if (reflectParent && this.isNotDeadBranch(system.nodes)) {
                                                              system.global_completed = false;
                                                              system.children_completed = false;
                                                          } else if (reflectParent && this.everyChildDead(system.nodes)) {
                                                              system.children_completed = null;
                                                          } else if (reflectParent) {
                                                              system.children_completed = true;
                                                          }
                                                          if (reflectParent && this.isNotDeadBranch(trade.nodes)) {
                                                              trade.global_completed = false;
                                                              trade.children_completed = false;
                                                          } else if (reflectParent && this.everyChildDead(trade.nodes)) {
                                                              trade.children_completed = null;
                                                          } else if (reflectParent) {
                                                              trade.children_completed = true;
                                                          }
                                                          if (
                                                              param === "narrative_completed" &&
                                                              value === true &&
                                                              this.everyChildCompleted(system.nodes)
                                                          ) {
                                                              system.children_completed = true;
                                                          }
                                                          if (
                                                              param === "narrative_completed" &&
                                                              value === true &&
                                                              this.everyChildCompleted(trade.nodes)
                                                          ) {
                                                              trade.children_completed = true;
                                                          }
                                                          return subSystem;
                                                      } else return subSystem;
                                                  })
                                              };
                                          }
                                      })
                                  };
                              }
                          })
                      };
                  })
                : item.nodes.map(trade => {
                      if (entity === trade.entity && key === trade.key) {
                          trade[param] = value;
                          return trade;
                      } else {
                          return {
                              ...trade,
                              nodes: trade?.nodes?.map(system => {
                                  if (entity === system.entity && key === system.key) {
                                      system[param] = value;
                                      if (reflectParent && this.isNotDeadBranch(trade.nodes)) {
                                          trade.global_completed = false;
                                          trade.children_completed = false;
                                      } else if (reflectParent && this.everyChildDead(trade.nodes)) {
                                          trade.children_completed = null;
                                      } else if (reflectParent) {
                                          trade.children_completed = true;
                                      }
                                      if (param === "narrative_completed" && value === true && this.everyChildCompleted(trade.nodes)) {
                                          trade.children_completed = true;
                                      }
                                      return system;
                                  } else {
                                      return {
                                          ...system,
                                          nodes: system?.nodes?.map(subSystem => {
                                              if (entity === subSystem.entity && key === subSystem.key) {
                                                  subSystem[param] = value;
                                                  if (reflectParent && this.isNotDeadBranch(system.nodes)) {
                                                      system.global_completed = false;
                                                      system.children_completed = false;
                                                  } else if (reflectParent && this.everyChildDead(system.nodes)) {
                                                      system.children_completed = null;
                                                  } else if (reflectParent) {
                                                      system.children_completed = true;
                                                  }
                                                  if (reflectParent && this.isNotDeadBranch(trade.nodes)) {
                                                      trade.global_completed = false;
                                                      trade.children_completed = false;
                                                  } else if (reflectParent && this.everyChildDead(trade.nodes)) {
                                                      trade.children_completed = null;
                                                  } else if (reflectParent) {
                                                      trade.children_completed = true;
                                                  }
                                                  if (param === "narrative_completed" && value === true && this.everyChildCompleted(system.nodes)) {
                                                      system.children_completed = true;
                                                  }
                                                  if (param === "narrative_completed" && value === true && this.everyChildCompleted(trade.nodes)) {
                                                      trade.children_completed = true;
                                                  }
                                                  return subSystem;
                                              } else return subSystem;
                                          })
                                      };
                                  }
                              })
                          };
                      }
                  })
        );
        this.setState({ menuData: tempMenu });
    };

    everyChildCompleted = (children = []) => {
        let flag = children?.some(child => child.children_completed === false || child.narrative_completed === false);
        return !flag;
    };

    everyChildDead = (children = []) => {
        let flag = children?.every(child => child.children_completed === null && child.narrative_completed === null);
        return flag;
    };

    isNotDeadBranch = (children = []) => {
        let flag = children?.some(
            child =>
                (child.entity !== "SubSystem" && child.children_completed === false) ||
                (!child.narrative_completed && (child.has_recommendations === "true" || child.has_narrative === "true"))
        );
        return flag;
    };

    previewPdfReport = async type => {
        const { narrativeId } = this.state;
        this.setState({ isLoading: true });
        await this.props.getPdfReport({ narratives_id: narrativeId, export_type: type });
        await this.props.addUserActivityLog({ text: "Downloaded pdf report!" });
        this.setState({ isLoading: false });
        const { success, pdf_url } = this.props.fcaReportReducer.latestPdfReport || {};
        if (!success) return window.alert("something went wrong !");
        const link = document.createElement("a");
        link.href = pdf_url;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    toggleExportHistory = () => {
        this.setState({ showExportHistory: !this.state.showExportHistory });
    };

    getExportHistory = async (type = "complete") => {
        this.setState({ isLoading: true });
        let params = {
            narratives_id: this.state.narrativeId,
            export_type: type
        };
        await this.props.getExportHistory(params);
        await this.props.addUserActivityLog({ text: "Visited export history." });
        this.setState({ isLoading: false });
    };

    hasPermission = (entity, action) => {
        let user_role = localStorage.getItem("role");
        if (user_role !== "super_admin") {
            let permissions = this.state.permissions;
            entity = entity === "Trade" ? "trade" : entity === "System" ? "system" : entity === "SubSystem" ? "sub_system" : entity;
            let flag = (permissions && permissions[entity] && permissions[entity][action]) || false;
            return flag;
        } else {
            return true;
        }
    };

    getAllLogs = async params => {
        this.setState({ isLoading: true });
        params.id = this.state.narrativeId;
        await this.props.getAllLogs(params);
        this.setState({ isLoading: false });
    };

    toggleLogs = () => {
        this.setState({ showLogs: !this.state.showLogs });
    };

    updateLogNote = async data => {
        this.setState({ isLoading: true });
        await this.props.updateLog(data);
        this.setState({ isLoading: false });
    };

    updateExportHistoryNote = async data => {
        this.setState({ isLoading: true });
        await this.props.updateExportHistory(data);
        await this.props.addUserActivityLog({ text: "Updated export history." });
        this.setState({ isLoading: false });
    };

    confirmMarkAsComplete = type => {
        const { narrativeId, narrativeCompleted, childrenCompleted } = this.state;

        if (!narrativeCompleted && type === "complete") {
            this.setState({ alertMessage: "Please complete local narrative before global complete." }, () => this.showAlert());
        } else if (childrenCompleted === false && type === "complete") {
            this.setState({ alertMessage: "Oops.! child narratives are not completed." }, () => this.showAlert());
        } else if (!narrativeId) {
            this.setState({
                warningModal: {
                    show: true,
                    heading: "Do you really want to mark as complete ?",
                    message: "No narrative found for this entity. this action will create an empty narrative for this entity.",
                    type: "cancel",
                    onYes: () => this.markAsComplete(type)
                }
            });
        } else {
            this.markAsComplete(type);
        }
    };

    handleAssignImagesFromMaster = async imageData => {
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        imageData.project_id = query.pid;
        imageData.building_id = query.building_id;
        imageData.narratable_id = query.narratable_id;
        imageData.narratable_type = query.narratable_type;

        await this.props.assignImagesFromMaster(imageData);
    };

    handleUpdateRecommendations = async (recommendation, selectedImage) => {
        const { selectedRecommendationId } = this.state;
        await this.props.updateRecommendation(recommendation, selectedRecommendationId, selectedImage);
        if (this.props.recommendationsReducer.updateRecommendationResponse && this.props.recommendationsReducer.updateRecommendationResponse.error) {
            await this.setState({
                alertMessage: this.props.recommendationsReducer.updateRecommendationResponse.error
            });
            this.showAlert();
        } else {
            this.setState({
                currentActions: null
            });
            this.renderDetails();
            await this.setState({
                alertMessage: this.props.recommendationsReducer.updateRecommendationResponse?.message
            });
            this.showAlert();
        }
    };

    getSiteListBasedOnRegion = async (recommendationsId, params) => {
        await this.props.getSitesBasedOnRegion(recommendationsId, params);
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
            recommendationsReducer: {
                getRegionsBasedOnClientResponse: { regions: regionList }
            }
        } = this.props;
        return regionList;
    };

    getPriorityElementDropDownData = async projectId => {
        await this.props.getPriorityElementDropDownData(projectId);
        return this.props.recommendationsReducer.priorityElementsDropDownResponse || {};
    };

    render() {
        const {
            breadCrumbData,
            menuData,
            infoTabsData,
            narratives,
            showWildCardFilter,
            currentViewAllUsers,
            showViewModal,
            tableData,
            paginationParams,
            summaryRowData,
            permissions,
            logPermission,
            isLoading,
            selectedMenu,
            isUnSaved,
            showRecommendationInfo,
            recomImageList,
            selectedRecomImage,
            narrativeCompleted,
            globalCompleted,
            childrenCompleted,
            narrativeId,
            showExportHistory,
            showLogs,
            narrativeTimes,
            showRecommendationEdit
        } = this.state;

        const {
            location: { search },
            match: {
                params: { section, tab },
                path
            }
        } = this.props;

        const query = qs.parse(search);
        let currentSection = query.narratable_type;
        let hasEdit = this.hasPermission(currentSection, "edit");
        let hasCreate = this.hasPermission(currentSection, "create");
        let hasLogView = checkPermission("logs", "fca_reports", "view");
        let isEmptyNarrative =
            this.props.fcaReportReducer.getNarrative?.narrative?.text_format === null ||
            this.props.fcaReportReducer.getNarrative?.narrative?.text_format === ""
                ? true
                : false;
        let entity = currentSection ? currentSection.toLowerCase() : "";
        if (entity === "subsystem") {
            entity = "sub_system";
        }
        let priorityElementsData = this.props.recommendationsReducer.priorityElementsDropDownResponse?.priority_elements || [];
        return (
            <>
                {section && section !== "projectinfo" ? (
                    <>
                        <div class="dtl-sec col-md-12 fc-new">
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
                            <div class="tab-dtl">
                                <div class="tab-nav-hed">
                                    <BreadCrumbs breadCrumbData={breadCrumbData} />
                                    <HelperIcon type={"narratives"} entity={entity} additoinalClass={"is-narrative"} />
                                    <TopBar infoTabsData={infoTabsData} handleTab={isUnSaved ? this.confirmTabChange : this.handleTab} />
                                </div>
                                <div class="tab-cnt-area tab-view-basic">
                                    <div class="tab-active">
                                        <SideNavigation
                                            menuData={menuData}
                                            showSubMenu={this.showSubMenu}
                                            handleMenu={isUnSaved ? this.confirmMenuChange : this.handleMenu}
                                            selectedMenu={selectedMenu}
                                            hasTradeView={isLoading ? false : this.hasPermission("trade", "view")}
                                            hasSystemView={isLoading ? false : this.hasPermission("system", "view")}
                                            hasSubSystemView={isLoading ? false : this.hasPermission("sub_system", "view")}
                                        />
                                        <div class="tab-cnt-sec">
                                            {currentSection ? (
                                                <>
                                                    {tab === "narrative" ? (
                                                        <>
                                                            {!showExportHistory && !showLogs && (
                                                                <TopHeader
                                                                    onAddImage={() => this.setState({ showImageBandModal: true })}
                                                                    insertNarrativeBand={
                                                                        narrativeCompleted
                                                                            ? type =>
                                                                                  this.setState({
                                                                                      warningModal: {
                                                                                          show: true,
                                                                                          heading: "Do you really want to edit the Narrative ?",
                                                                                          message:
                                                                                              "This narrative is marked as completed. This action will mark the narrative as incomplete.",
                                                                                          type: "cancel",
                                                                                          onYes: () => this.insertNarrativeBand(type)
                                                                                      }
                                                                                  })
                                                                            : this.insertNarrativeBand
                                                                    }
                                                                    selectedMenu={selectedMenu?.label}
                                                                    hasEdit={hasEdit}
                                                                    hasCreate={hasCreate}
                                                                    autoPopulateImages={this.autoPopulateImages}
                                                                    autoPopulateReportNotes={this.autoPopulateReportNotes}
                                                                    narratable_type={query.narratable_type}
                                                                />
                                                            )}
                                                            <Narrative
                                                                saveDoc={this.saveNarrativeData}
                                                                currentSection={currentSection}
                                                                onImageSelect={() => this.setState({ showImageSelectModal: true })}
                                                                imageResponse={this.props.fcaReportReducer.getAllImagesResponse.images}
                                                                recommendationImageResponse={
                                                                    currentSection === "SubSystem"
                                                                        ? this.props.fcaReportReducer.getNarrativeRecommendationsImage.images
                                                                        : []
                                                                }
                                                                setNarrativeData={
                                                                    narrativeCompleted
                                                                        ? (data, idx, bandIndex) => {
                                                                              this.setState({
                                                                                  warningModal: {
                                                                                      show: true,
                                                                                      heading: "Do you really want to edit the Narrative?",
                                                                                      message:
                                                                                          "This narrative is marked as completed. This action will mark the narrative as incomplete.",
                                                                                      type: "cancel",
                                                                                      onYes: () => this.setNarrativeData(data, idx, bandIndex),
                                                                                      onNo: () => {
                                                                                          //restart the editor instance
                                                                                          let narr = narratives;
                                                                                          narr[idx].id = uuidv4();
                                                                                          this.setState({ narratives: narr });
                                                                                      }
                                                                                  }
                                                                              });
                                                                          }
                                                                        : this.setNarrativeData
                                                                }
                                                                narratives={narratives}
                                                                onDragEnd={
                                                                    narrativeCompleted
                                                                        ? result =>
                                                                              this.setState({
                                                                                  warningModal: {
                                                                                      show: true,
                                                                                      heading: "Do you really want to edit the Narrative ?",
                                                                                      message:
                                                                                          "This narrative is marked as completed. This action will mark the narrative as incomplete.",
                                                                                      type: "cancel",
                                                                                      onYes: () => this.reorderNarrativeBands(result)
                                                                                  }
                                                                              })
                                                                        : this.reorderNarrativeBands
                                                                }
                                                                deleteBand={this.onNarrativeDelete}
                                                                isLoading={isLoading}
                                                                narrativeEnd={this.narrativeEnd}
                                                                getAllImages={this.getAllImages}
                                                                getNarrativeChart={this.getNarrativeChart}
                                                                getAllRecommendationImages={this.getAllImageRecommendation}
                                                                getAllInserts={this.getAllInserts}
                                                                insertResponse={this.props.fcaReportReducer.getInserts.inserts}
                                                                setIsUnsaved={this.setIsUnsaved}
                                                                discardChanges={this.discardChanges}
                                                                isUnSaved={isUnSaved}
                                                                filterUsedImages={this.filterUsedImages}
                                                                filterUsedInserts={this.filterUsedInserts}
                                                                exportReport={
                                                                    !narrativeId
                                                                        ? () =>
                                                                              this.setState({
                                                                                  warningModal: {
                                                                                      show: true,
                                                                                      heading: "Do you really want to export ?",
                                                                                      message:
                                                                                          "No narrative found for this entity. this action will create an empty narrative for this entity.",
                                                                                      type: "cancel",
                                                                                      onYes: () => this.exportReport()
                                                                                  }
                                                                              })
                                                                        : narratives.length && isUnSaved
                                                                        ? this.confirmExportReport
                                                                        : this.exportReport
                                                                }
                                                                narrativeCompleted={narrativeCompleted}
                                                                markAsComplete={this.confirmMarkAsComplete}
                                                                narrativeId={narrativeId}
                                                                deleteNarrative={() => {
                                                                    this.setState({
                                                                        warningModal: {
                                                                            show: true,
                                                                            heading: "Do you want to delete this Narrative ?",
                                                                            message:
                                                                                "This action cannot be reverted, are you sure that you need to delete this narrative?",
                                                                            type: "delete",
                                                                            onYes: () => this.deleteNarrative()
                                                                        }
                                                                    });
                                                                }}
                                                                previewPdfReport={this.previewPdfReport}
                                                                showExportHistory={showExportHistory}
                                                                getExportHistory={this.getExportHistory}
                                                                exportHistoryData={this.props.fcaReportReducer.getExportHistory.results}
                                                                toggleExportHistory={this.toggleExportHistory}
                                                                hasDelete={this.hasPermission(currentSection, "delete")}
                                                                hasExport={this.hasPermission(currentSection, "export")}
                                                                hasMarkAsComplete={this.hasPermission(currentSection, "mark_as_complete")}
                                                                hasCreate={hasCreate}
                                                                hasEdit={hasEdit}
                                                                toggleLogs={this.toggleLogs}
                                                                showLogs={showLogs}
                                                                logData={this.props.fcaReportReducer.getAllLogs}
                                                                getLogs={this.getAllLogs}
                                                                narrativeTimes={narrativeTimes}
                                                                updateLogNote={this.updateLogNote}
                                                                isEmptyNarrative={isEmptyNarrative}
                                                                updateExportHistoryNote={this.updateExportHistoryNote}
                                                                globalCompleted={globalCompleted}
                                                                childrenCompleted={childrenCompleted}
                                                                hasLogView={hasLogView}
                                                                chartList={this.props.fcaReportReducer.getNarrativeChartResponse.charts}
                                                                getChartDetails={this.getChartDetails}
                                                                graphData={this.state.graphData}
                                                            />
                                                        </>
                                                    ) : tab === "images" ? (
                                                        <InfoImages
                                                            getAllImageList={this.getAllImages}
                                                            uploadImages={this.updloadImage}
                                                            refreshinfoDetails={() => true}
                                                            updateImageComment={this.updateImageComment}
                                                            deleteImage={this.deleteImage}
                                                            isReportImage
                                                            imageResponse={this.props.fcaReportReducer.getAllImagesResponse}
                                                            checkIfNarrativeImageUsed={this.checkIfNarrativeImageUsed}
                                                            narrativeCompleted={narrativeCompleted}
                                                            hasEdit={hasEdit}
                                                            hasCreate={hasCreate}
                                                            imagesNotUsed={this.filterUsedImages(
                                                                this.props.fcaReportReducer.getAllImagesResponse.images
                                                            )}
                                                            handleAssignImagesFromMaster={this.handleAssignImagesFromMaster}
                                                            hasPullFromMasterImages={true}
                                                            entity={entities.NARRATIVES}
                                                        />
                                                    ) : tab === "imagesRecommendation" ? (
                                                        <>
                                                            {showRecommendationInfo ? (
                                                                <RecommendationInfo
                                                                    getDataById={this.getDataById}
                                                                    keys={tableData.keys}
                                                                    config={tableData.config}
                                                                    closeInfoPage={() => this.setState({ showRecommendationInfo: false })}
                                                                    getAllImageList={this.getSelectedRecomImages}
                                                                    imageResponse={this.props.fcaReportReducer.selectedRecomImages.images}
                                                                    getAllPriorityElementDropDownData={this.getPriorityElementDropDownData}
                                                                />
                                                            ) : (
                                                                <InfoImages
                                                                    getAllImageList={this.getAllImageRecommendation}
                                                                    imageResponse={this.props.fcaReportReducer.getNarrativeRecommendationsImage}
                                                                    isRecommendation
                                                                    isReportImage
                                                                    refreshinfoDetails={() => true}
                                                                    updateImageComment={this.updateRecomImage}
                                                                    showInfoPage={this.showInfoPage}
                                                                    checkIfNarrativeImageUsed={this.checkIfNarrativeImageUsed}
                                                                    imagesNotUsed={this.filterUsedImages(
                                                                        this.props.fcaReportReducer.getNarrativeRecommendationsImage.images
                                                                    )}
                                                                    narrativeCompleted={narrativeCompleted}
                                                                    hasEdit={hasEdit}
                                                                    hasCreate={hasCreate}
                                                                />
                                                            )}
                                                        </>
                                                    ) : tab === "insert" ? (
                                                        <Insert
                                                            getAllInserts={this.getAllInserts}
                                                            uploadInsert={this.addInsert}
                                                            deleteInsert={this.deleteInsert}
                                                            updateInsert={this.updateInsert}
                                                            insertResponse={this.props.fcaReportReducer.getInserts.inserts}
                                                            tableTemplates={this.props.fcaReportReducer.getInserts.table_templates}
                                                            setIsUnsaved={this.setIsUnsaved}
                                                            narrativeCompleted={narrativeCompleted}
                                                            checkIfNarrativeTableUsed={this.checkIfNarrativeTableUsed}
                                                            autoPopulateTableTemplates={this.autoPopulateTableTemplates}
                                                            hasEdit={hasEdit}
                                                            hasCreate={hasCreate}
                                                        />
                                                    ) : tab === "charts" ? (
                                                        <Chart
                                                            getNarrativeChart={this.getNarrativeChart}
                                                            chartList={this.props.fcaReportReducer.getNarrativeChartResponse.charts}
                                                            getChartDetails={this.getChartDetails}
                                                            graphData={this.state.graphData}
                                                        />
                                                    ) : tab === "recomendations" ? (
                                                        <>
                                                            {showRecommendationInfo ? (
                                                                <RecommendationInfo
                                                                    getDataById={this.getDataById}
                                                                    keys={tableData.keys}
                                                                    updateSelectedRow={this.updateSelectedRow}
                                                                    showEditPage={this.showEditPage}
                                                                    config={tableData.config}
                                                                    closeInfoPage={() => this.setState({ showRecommendationInfo: false })}
                                                                    getAllImageList={this.getSelectedRecomImages}
                                                                    imageResponse={this.props.fcaReportReducer.selectedRecomImages}
                                                                    getAllPriorityElementDropDownData={this.getPriorityElementDropDownData}
                                                                />
                                                            ) : showRecommendationEdit ? (
                                                                <RecommendationForm
                                                                    projectId={query?.pid}
                                                                    refreshRecommendationsList={this.refreshRecommendationsList}
                                                                    handleUpdateRecommendations={this.handleUpdateRecommendations}
                                                                    getSiteListBasedOnRegion={this.getSiteListBasedOnRegion}
                                                                    getRegionListBasedOnClient={this.getRegionListBasedOnClient}
                                                                    getDataById={this.getDataById}
                                                                    cancelForm={() => this.setState({ showRecommendationEdit: false })}
                                                                />
                                                            ) : (
                                                                <Recommendations
                                                                    isLoading={this.state.isLoading}
                                                                    showWildCardFilter={showWildCardFilter}
                                                                    paginationParams={paginationParams}
                                                                    currentViewAllUsers={currentViewAllUsers}
                                                                    showViewModal={this.showViewModal}
                                                                    tableData={tableData}
                                                                    handleGlobalSearch={this.handleGlobalSearch}
                                                                    globalSearchKey={this.state.params.search}
                                                                    updateSelectedRow={this.updateSelectedRow}
                                                                    toggleWildCardFilter={this.toggleWildCardFilter}
                                                                    updateCurrentViewAllUsers={this.updateCurrentViewAllUsers}
                                                                    handleDeleteRecommendations={this.handleDeleteRecommendations}
                                                                    showEditPage={this.showEditPage}
                                                                    handlePerPageChange={this.handlePerPageChange}
                                                                    handlePageClick={this.handlePageClick}
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
                                                                    isColunmVisibleChanged={this.isColunmVisibleChanged}
                                                                    updateTableSortFilters={this.updateTableSortFilters}
                                                                    resetSort={this.resetSort}
                                                                    tableParams={this.state.params}
                                                                    isBuildingLocked={this.props.isBuildingLocked}
                                                                    handleCutPaste={this.handleCutPaste}
                                                                    summaryRowData={summaryRowData}
                                                                    exportTableXl={this.exportTableXl}
                                                                    tableLoading={this.state.tableLoading}
                                                                    showRestoreModal={this.showRestoreModal}
                                                                    selectFilterHandler={this.selectFilterHandler}
                                                                    selectFilterHandlerInitiative={this.selectFilterHandlerInitiative}
                                                                    selectedDropdown={this.state.selectedDropdown}
                                                                    selectedDropdownInitiaive={this.state.selectedDropdownInitiaive}
                                                                    selectedDropdownInitiaiveFirst={this.state.selectedDropdownInitiaiveFirst}
                                                                    permissions={permissions}
                                                                    logPermission={logPermission}
                                                                    handleSelect={this.props.handleSelect}
                                                                    handleSelectAll={this.props.handleSelectAll}
                                                                    assignProjectModal={this.props.assignProjectModal}
                                                                    recomentationIds={this.props.recomentationIds}
                                                                    unAassignContent={this.unAassignContent}
                                                                    hasEdit={checkPermission("forms", "recommendations", "edit")}
                                                                    priorityElementsData={priorityElementsData}
                                                                />
                                                            )}
                                                        </>
                                                    ) : null}
                                                </>
                                            ) : (
                                                <div className="coming-soon bg-wh">
                                                    <div className="coming-soon-img">
                                                        <img src="/img/coming-soon.svg" alt="" />
                                                    </div>
                                                    <h3>COMING SOON</h3>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.renderConfirmationModal()}
                        {this.renderImageBandModal()}
                        {this.renderMenuSwitchConfirmationModal()}
                        {this.renderTabSwitchConfirmModal()}
                        {this.renderExportConfirmModal()}
                        {this.renderDiscardChangesConfirmationModal()}
                        {this.renderWarning()}
                    </>
                ) : (
                    <Project isReportView={true} />
                )}
            </>
        );
    }
}

const mapStateToProps = state => {
    const { fcaReportReducer, commonReducer, recommendationsReducer, buildingReducer } = state;
    return { fcaReportReducer, commonReducer, recommendationsReducer, buildingReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions,
        ...commonActions,
        ...RecommendationActions,
        ...BuildingActions
    })(Index)
);
