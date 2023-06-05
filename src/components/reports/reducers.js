import * as actionType from "./constants";

const initialState = {
    getAllBuildingMenu: {},
    getAllTradeMenu: {},
    getAllSystemMenu: {},
    getBuildingReportPrargraphsMenu: {},
    getBuildingChildPrargraphsMenu: {},
    getSiteReportPrargraphsMenu: {},
    getSiteChildPrargraphsMenu: {},
    getRegionReportPrargraphsMenu: {},
    getRegionChildPrargraphsMenu: {},
    getProjectReportPrargraphsMenu: {},
    getProjectChildPrargraphsMenu: {},
    getAllSubSystemMenu: {},
    getAllSiteMenu: {},
    getAllRegionMenu: {},
    getAllProjectMenu: {},
    getAllSiteBuildingsMenu: {},
    uploadImageResponse: {},
    getAllImagesResponse: {},
    getNarrativeChart: {},
    deleteImagesResponse: {},
    updateImageCommentResponse: {},
    addNarrative: {},
    getNarrative: {},
    getNarrativeRecommendationsImage: {},
    getAllRecommendationNotesRes: {},
    updateNarrativeRecommendationsImage: {},
    getNarrativeRecommendations: {},
    getRecommendationByIdResponse: {},
    getNarrativeChartResponse: {},
    getChartDetailsResponse: {},
    entityParams: {
        entity: null,
        selectedEntity: null,
        selectedRowId: null,
        paginationParams: {
            totalPages: 0,
            perPage: 100,
            currentPage: 0,
            totalCount: 0
        },
        params: {
            limit: 100,
            offset: 0,
            search: "",
            filters: null,
            list: null,
            year: [],
            index: [],
            active: true
        },
        wildCardFilterParams: {},
        filterParams: {},
        tableConfig: null,
        historyPaginationParams: {
            totalPages: 0,
            perPage: 40,
            currentPage: 0,
            totalCount: 0
        },
        historyParams: {
            limit: 40,
            offset: 0,
            search: ""
        },
        selectedDropdown: "active",
        selectedDropdownInitiative: "active"
    },
    getListForCommonFilterResponse: {},
    recommendationExportResponse: {},
    reportExportResponse: {},
    addInsert: {},
    getInserts: {},
    deleteInsert: {},
    updateInsert: {},
    markAsCompletePythonResponse: {},
    markAsCompleteRubyResponse: {},
    selectedRecomImages: {},
    deleteNarrative: {},
    latestPdfReport: {},
    getExportHistory: {},
    getAllLogs: {},
    updateLog: {},
    updateExportHistory: {},
    getNarrativeTemplatesResponse: {},
    autoPopulateTableTemplatesResponse: {},
    assignImagesFromMaster: {},
    getAllProjectsMenu: {},
    getAllRegionsMenu: {}
};
export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_BUILDING_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_BUILDING_MENU_SUCCESS:
            return {
                ...state,
                getAllBuildingMenu: { ...action.response }
            };
        case actionType.GET_BUILDING_MENU_FAILURE:
            return {
                ...state,
                getAllBuildingMenu: { ...action.error }
            };

        case actionType.GET_TRADE_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TRADE_MENU_SUCCESS:
            return {
                ...state,
                getAllTradeMenu: { ...action.response }
            };
        case actionType.GET_TRADE_MENU_FAILURE:
            return {
                ...state,
                getAllTradeMenu: { ...action.error }
            };

        case actionType.GET_SYSTEM_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SYSTEM_MENU_SUCCESS:
            return {
                ...state,
                getAllSystemMenu: { ...action.response }
            };
        case actionType.GET_SYSTEM_MENU_FAILURE:
            return {
                ...state,
                getAllSystemMenu: { ...action.error }
            };

        case actionType.GET_BUILDING_REPORT_PRARGRAPHS_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_BUILDING_REPORT_PRARGRAPHS_MENU_SUCCESS:
            return {
                ...state,
                getBuildingReportPrargraphsMenu: { ...action.response }
            };
        case actionType.GET_BUILDING_REPORT_PRARGRAPHS_MENU_FAILURE:
            return {
                ...state,
                getBuildingReportPrargraphsMenu: { ...action.error }
            };

        case actionType.GET_BUILDING_CHILD_PRARGRAPHS_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_BUILDING_CHILD_PRARGRAPHS_MENU_SUCCESS:
            return {
                ...state,
                getBuildingChildPrargraphsMenu: { ...action.response }
            };
        case actionType.GET_BUILDING_CHILD_PRARGRAPHS_MENU_FAILURE:
            return {
                ...state,
                getBuildingChildPrargraphsMenu: { ...action.error }
            };

        case actionType.GET_SITE_REPORT_PRARGRAPHS_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SITE_REPORT_PRARGRAPHS_MENU_SUCCESS:
            return {
                ...state,
                getSiteReportPrargraphsMenu: { ...action.response }
            };
        case actionType.GET_SITE_REPORT_PRARGRAPHS_MENU_FAILURE:
            return {
                ...state,
                getSiteReportPrargraphsMenu: { ...action.error }
            };

        case actionType.GET_SITE_CHILD_PRARGRAPHS_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SITE_CHILD_PRARGRAPHS_MENU_SUCCESS:
            return {
                ...state,
                getSiteChildPrargraphsMenu: { ...action.response }
            };
        case actionType.GET_SITE_CHILD_PRARGRAPHS_MENU_FAILURE:
            return {
                ...state,
                getSiteChildPrargraphsMenu: { ...action.error }
            };

        case actionType.GET_REGION_REPORT_PRARGRAPHS_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REGION_REPORT_PRARGRAPHS_MENU_SUCCESS:
            return {
                ...state,
                getRegionReportPrargraphsMenu: { ...action.response }
            };
        case actionType.GET_REGION_REPORT_PRARGRAPHS_MENU_FAILURE:
            return {
                ...state,
                getRegionReportPrargraphsMenu: { ...action.error }
            };

        case actionType.GET_REGION_CHILD_PRARGRAPHS_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REGION_CHILD_PRARGRAPHS_MENU_SUCCESS:
            return {
                ...state,
                getRegionChildPrargraphsMenu: { ...action.response }
            };
        case actionType.GET_REGION_CHILD_PRARGRAPHS_MENU_FAILURE:
            return {
                ...state,
                getRegionChildPrargraphsMenu: { ...action.error }
            };

        case actionType.GET_PROJECT_REPORT_PRARGRAPHS_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROJECT_REPORT_PRARGRAPHS_MENU_SUCCESS:
            return {
                ...state,
                getProjectReportPrargraphsMenu: { ...action.response }
            };
        case actionType.GET_PROJECT_REPORT_PRARGRAPHS_MENU_FAILURE:
            return {
                ...state,
                getProjectReportPrargraphsMenu: { ...action.error }
            };

        case actionType.GET_PROJECT_CHILD_PRARGRAPHS_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROJECT_CHILD_PRARGRAPHS_MENU_SUCCESS:
            return {
                ...state,
                getProjectChildPrargraphsMenu: { ...action.response }
            };
        case actionType.GET_PROJECT_CHILD_PRARGRAPHS_MENU_FAILURE:
            return {
                ...state,
                getProjectChildPrargraphsMenu: { ...action.error }
            };

        case actionType.GET_SUB_SYSTEM_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SUB_SYSTEM_MENU_SUCCESS:
            return {
                ...state,
                getAllSubSystemMenu: { ...action.response }
            };
        case actionType.GET_SUB_SYSTEM_MENU_FAILURE:
            return {
                ...state,
                getAllSubSystemMenu: { ...action.error }
            };

        case actionType.GET_SITE_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SITE_MENU_SUCCESS:
            return {
                ...state,
                getAllSiteMenu: { ...action.response }
            };
        case actionType.GET_SITE_MENU_FAILURE:
            return {
                ...state,
                getAllSiteMenu: { ...action.error }
            };

        case actionType.GET_REGION_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REGION_MENU_SUCCESS:
            return {
                ...state,
                getAllRegionMenu: { ...action.response }
            };
        case actionType.GET_REGION_MENU_FAILURE:
            return {
                ...state,
                getAllRegionMenu: { ...action.error }
            };

        case actionType.GET_PROJECT_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROJECT_MENU_SUCCESS:
            return {
                ...state,
                getAllProjectMenu: { ...action.response }
            };
        case actionType.GET_PROJECT_MENU_FAILURE:
            return {
                ...state,
                getAllProjectMenu: { ...action.error }
            };

        case actionType.GET_SITE_BUILDING_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SITE_BUILDING_MENU_SUCCESS:
            return {
                ...state,
                getAllSiteBuildingsMenu: { ...action.response }
            };
        case actionType.GET_SITE_BUILDING_MENU_FAILURE:
            return {
                ...state,
                getAllSiteBuildingsMenu: { ...action.error }
            };

        case actionType.GET_PROJECTS_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROJECTS_MENU_SUCCESS:
            return {
                ...state,
                getAllProjectsMenu: { ...action.response }
            };
        case actionType.GET_PROJECTS_MENU_FAILURE:
            return {
                ...state,
                getAllProjectsMenu: { ...action.error }
            };

        case actionType.GET_REGIONS_MENU_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REGIONS_MENU_SUCCESS:
            return {
                ...state,
                getAllRegionsMenu: { ...action.response }
            };
        case actionType.GET_REGIONS_MENU_FAILURE:
            return {
                ...state,
                getAllRegionsMenu: { ...action.error }
            };

        case actionType.UPLOAD_IMAGE_REQUEST:
            return {
                ...state
            };
        case actionType.UPLOAD_IMAGE_SUCCESS:
            return {
                ...state,
                uploadImageResponse: { success: true, ...action.response }
            };
        case actionType.UPLOAD_IMAGE_FAILURE:
            return {
                ...state,
                uploadImageResponse: { success: false, ...action.error }
            };

        case actionType.GET_ALL_IMAGES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_IMAGES_SUCCESS:
            return {
                ...state,
                getAllImagesResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_IMAGES_FAILURE:
            return {
                ...state,
                getAllImagesResponse: { success: false, ...action.error }
            };

        case actionType.GET_NARRATIVE_CHART_REQUEST:
            return {
                ...state
            };
        case actionType.GET_NARRATIVE_CHART_SUCCESS:
            return {
                ...state,
                getNarrativeChartResponse: { success: true, ...action.response }
            };
        case actionType.GET_NARRATIVE_CHART_FAILURE:
            return {
                ...state,
                getNarrativeChartResponse: { success: false, ...action.error }
            };

        case actionType.GET_CHART_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_DETAILS_SUCCESS:
            return {
                ...state,
                getChartDetailsResponse: { success: true, ...action.response }
            };
        case actionType.GET_CHART_DETAILS_FAILURE:
            return {
                ...state,
                getChartDetailsResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_IMAGES_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_IMAGES_SUCCESS:
            return {
                ...state,
                deleteImagesResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_IMAGES_FAILURE:
            return {
                ...state,
                deleteImagesResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_IMAGE_COMMENT_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_IMAGE_COMMENT_SUCCESS:
            return {
                ...state,
                updateImageCommentResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_IMAGE_COMMENT_FAILURE:
            return {
                ...state,
                updateImageCommentResponse: { success: false, ...action.error }
            };

        case actionType.ADD_NARRATIVE_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_NARRATIVE_SUCCESS:
            return {
                ...state,
                addNarrative: { ...action.response }
            };
        case actionType.ADD_NARRATIVE_FAILURE:
            return {
                ...state,
                addNarrative: { ...action.error }
            };
        case actionType.GET_NARRATIVE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_NARRATIVE_SUCCESS:
            return {
                ...state,
                getNarrative: { ...action.response }
            };
        case actionType.GET_NARRATIVE_FAILURE:
            return {
                ...state,
                getNarrative: { ...action.error }
            };

        case actionType.GET_RECOMMENDATION_IMAGES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_RECOMMENDATION_IMAGES_SUCCESS:
            return {
                ...state,
                getNarrativeRecommendationsImage: { success: true, ...action.response }
            };
        case actionType.GET_RECOMMENDATION_IMAGES_FAILURE:
            return {
                ...state,
                getNarrativeRecommendationsImage: { success: false, ...action.error }
            };

        case actionType.GET_RECOMMENDATION_NOTES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_RECOMMENDATION_NOTES_SUCCESS:
            return {
                ...state,
                getAllRecommendationNotesRes: { success: true, ...action.response }
            };
        case actionType.GET_RECOMMENDATION_NOTES_FAILURE:
            return {
                ...state,
                getAllRecommendationNotesRes: { success: false, ...action.error }
            };

        case actionType.UPDATE_RECOM_IMAGE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_RECOM_IMAGE_SUCCESS:
            return {
                ...state,
                updateNarrativeRecommendationsImage: { success: true, ...action.response }
            };
        case actionType.UPDATE_RECOM_IMAGE_FAILURE:
            return {
                ...state,
                updateNarrativeRecommendationsImage: { success: false, ...action.error }
            };

        case actionType.GET_NARRATIVE_RECOMMENDATION_REQUEST:
            return {
                ...state
            };
        case actionType.GET_NARRATIVE_RECOMMENDATION_SUCCESS:
            return {
                ...state,
                getNarrativeRecommendations: { success: true, ...action.response }
            };
        case actionType.GET_NARRATIVE_RECOMMENDATION_FAILURE:
            return {
                ...state,
                getNarrativeRecommendations: { success: false, ...action.error }
            };
        case actionType.GET_RECOMMENDATION_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_RECOMMENDATION_BY_ID_SUCCESS:
            return {
                ...state,
                getRecommendationByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_RECOMMENDATION_BY_ID_FAILURE:
            return {
                ...state,
                getRecommendationByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_NARRATIVE_RECOMMENDATION_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_NARRATIVE_RECOMMENDATION_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        case actionType.GET_LIST_FOR_COMMON_FILTER_REQUEST:
            return {
                ...state
            };
        case actionType.GET_LIST_FOR_COMMON_FILTER_SUCCESS:
            return {
                ...state,
                getListForCommonFilterResponse: { success: true, ...action.response }
            };
        case actionType.GET_LIST_FOR_COMMON_FILTER_FAILURE:
            return {
                ...state,
                getListForCommonFilterResponse: { success: false, ...action.error }
            };

        case actionType.GET_RECOMMENDATION_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_RECOMMENDATION_EXPORT_SUCCESS:
            return {
                ...state,
                recommendationExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_RECOMMENDATION_EXPORT_FAILURE:
            return {
                ...state,
                recommendationExportResponse: { success: false, ...action.error }
            };
        case actionType.GET_REPORT_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REPORT_EXPORT_SUCCESS:
            return {
                ...state,
                reportExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_REPORT_EXPORT_FAILURE:
            return {
                ...state,
                reportExportResponse: { success: false, ...action.error }
            };
        case actionType.GET_INSERT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_INSERT_SUCCESS:
            return {
                ...state,
                getInserts: { success: true, ...action.response }
            };
        case actionType.GET_INSERT_FAILURE:
            return {
                ...state,
                getInserts: { success: false, ...action.error }
            };
        case actionType.ADD_INSERT_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_INSERT_SUCCESS:
            return {
                ...state,
                addInsert: { success: true, ...action.response }
            };
        case actionType.ADD_INSERT_FAILURE:
            return {
                ...state,
                addInsert: { success: false, ...action.error }
            };
        case actionType.DELETE_INSERT_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_INSERT_SUCCESS:
            return {
                ...state,
                deleteInsert: { success: true, ...action.response }
            };
        case actionType.DELETE_INSERT_FAILURE:
            return {
                ...state,
                deleteInsert: { success: false, ...action.error }
            };
        case actionType.UPDATE_INSERT_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_INSERT_SUCCESS:
            return {
                ...state,
                updateInsert: { success: true, ...action.response }
            };
        case actionType.UPDATE_INSERT_FAILURE:
            return {
                ...state,
                updateInsert: { success: false, ...action.error }
            };
        case actionType.MARK_AS_COMPLETE_PYTHON_REQUEST:
            return {
                ...state
            };
        case actionType.MARK_AS_COMPLETE_PYTHON_SUCCESS:
            return {
                ...state,
                markAsCompletePythonResponse: { success: true, ...action.response }
            };
        case actionType.MARK_AS_COMPLETE_PYTHON_FAILURE:
            return {
                ...state,
                markAsCompletePythonResponse: { success: false, ...action.error }
            };
        case actionType.MARK_AS_COMPLETE_RUBY_REQUEST:
            return {
                ...state
            };
        case actionType.MARK_AS_COMPLETE_RUBY_SUCCESS:
            return {
                ...state,
                markAsCompleteRubyResponse: { success: true, ...action.response }
            };
        case actionType.MARK_AS_COMPLETE_RUBY_FAILURE:
            return {
                ...state,
                markAsCompleteRubyResponse: { success: false, ...action.error }
            };
        case actionType.GET_SELECTED_RECOM_IMAGES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SELECTED_RECOM_IMAGES_SUCCESS:
            return {
                ...state,
                selectedRecomImages: { success: true, ...action.response }
            };
        case actionType.GET_SELECTED_RECOM_IMAGES_FAILURE:
            return {
                ...state,
                selectedRecomImages: { success: false, ...action.error }
            };
        case actionType.DELETE_NARRATIVE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_NARRATIVE_SUCCESS:
            return {
                ...state,
                deleteNarrative: { success: true, ...action.response }
            };
        case actionType.DELETE_NARRATIVE_FAILURE:
            return {
                ...state,
                deleteNarrative: { success: false, ...action.error }
            };
        case actionType.PDF_REPORT_REQUEST:
            return {
                ...state
            };
        case actionType.PDF_REPORT_SUCCESS:
            return {
                ...state,
                latestPdfReport: { success: true, ...action.response }
            };
        case actionType.PDF_REPORT_FAILURE:
            return {
                ...state,
                latestPdfReport: { success: false, ...action.error }
            };
        case actionType.GET_EXPORT_HISTORY_REQUEST:
            return {
                ...state
            };
        case actionType.GET_EXPORT_HISTORY_SUCCESS:
            return {
                ...state,
                getExportHistory: { success: true, ...action.response }
            };
        case actionType.GET_EXPORT_HISTORY_FAILURE:
            return {
                ...state,
                getExportHistory: { success: false, ...action.error }
            };
        case actionType.GET_LOGS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_LOGS_SUCCESS:
            return {
                ...state,
                getAllLogs: { success: true, ...action.response }
            };
        case actionType.GET_LOGS_FAILURE:
            return {
                ...state,
                getAllLogs: { success: false, ...action.error }
            };
        case actionType.UPDATE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_LOG_SUCCESS:
            return {
                ...state,
                updateLog: { success: true, ...action.response }
            };
        case actionType.UPDATE_LOG_FAILURE:
            return {
                ...state,
                updateLog: { success: false, ...action.error }
            };
        case actionType.UPDATE_EXPORT_HISTORY_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_EXPORT_HISTORY_SUCCESS:
            return {
                ...state,
                updateExportHistory: { success: true, ...action.response }
            };
        case actionType.UPDATE_EXPORT_HISTORY_FAILURE:
            return {
                ...state,
                updateExportHistory: { success: false, ...action.error }
            };

        case actionType.GET_NARRATIVE_TEMPLATES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_NARRATIVE_TEMPLATES_SUCCESS:
            return {
                ...state,
                getNarrativeTemplatesResponse: { success: true, ...action.response }
            };
        case actionType.GET_NARRATIVE_TEMPLATES_FAILURE:
            return {
                ...state,
                getNarrativeTemplatesResponse: { success: false, ...action.error }
            };

        case actionType.AUTO_POPULATE_TABLE_TEMPLATES_REQUEST:
            return {
                ...state
            };
        case actionType.AUTO_POPULATE_TABLE_TEMPLATES_SUCCESS:
            return {
                ...state,
                autoPopulateTableTemplatesResponse: { success: true, ...action.response }
            };
        case actionType.AUTO_POPULATE_TABLE_TEMPLATES_FAILURE:
            return {
                ...state,
                autoPopulateTableTemplatesResponse: { success: false, ...action.error }
            };
        case actionType.ASSIGN_IMAGES_FROM_MASTER_REQUEST:
            return {
                ...state
            };
        case actionType.ASSIGN_IMAGES_FROM_MASTER_SUCCESS:
            return {
                ...state,
                assignImagesFromMaster: { success: true, ...action.response }
            };
        case actionType.ASSIGN_IMAGES_FROM_MASTER_FAILURE:
            return {
                ...state,
                assignImagesFromMaster: { success: false, ...action.error }
            };

        default:
            return state;
    }
};
