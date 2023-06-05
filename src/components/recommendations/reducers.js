import * as actionType from "./constants";

const initialEntityParams = {
    entity: null,
    selectedEntity: null,
    selectedRowId: null,
    paginationParams: {
        totalPages: 0,
        perPage: 40,
        currentPage: 0,
        totalCount: 0
    },
    params: {
        limit: 40,
        offset: 0,
        search: "",
        filters: null,
        list: null,
        year: [],
        index: [],
        active: true,
        surveyor: null,
        image_or_not: null
    },
    wildCardFilterParams: {},
    filterParams: {},
    tableConfig: null,
    initialTableConfig: null,
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
    selectedDropdownInitiative: "active",
    recommendationList: []
};
const initialState = {
    getAllRecommendationsResponse: {},
    addRecommendationResponse: {},
    parseFcaResponse: {},
    updateRecommendationResponse: {},
    updateMultipleRecommendationsResponse: {},
    deleteRecommendationResponse: {},
    getRegionsBasedOnClientResponse: {},
    getAllConsultancyUsersResponse: {},
    getAllClientsResponse: {},
    getRecommendationByIdResponse: {},
    uploadImageResponse: {},
    getAllImagesResponse: {},
    deleteImagesResponse: {},
    updateImageCommentResponse: {},
    getDepaartmentsByProject: {},
    getCategoryByProject: {},
    getCapitalTypeBasedOnProject: {},
    getSystemByProject: {},
    getSubSystemByProject: {},
    getFloorByBuilding: {},
    getAdditionByBuilding: {},
    getTradeByProject: {},
    getListForCommonFilterResponse: {},
    updateMaintenanceYearCutPasteResponse: {},
    recoverRecommendationResponse: {},
    getAllRecommendationLogsResponse: {},
    restoreRecommendationLogResponse: {},
    deleteRecommendationLogResponse: {},
    recommendationExportResponse: {},
    exportAllTradesResponse: {},
    entityParams: {},
    getCostYearByProject: {},
    getFundingSourceByProject: {},
    getConditionBasedOnProject: {},
    getInitiativeDropdown: {},
    getReportNoteTemplatesResponse: {},
    pdfReportResponse: {},
    assignImageResponse: {},
    unAssignImageResponse: {},
    updateBudgetPriorityResponse: {},
    scrollPosition: 0,
    getRecommendationTemplatesResponse: {},
    getUserDefaultTradeResponse: {},
    updateFMPResponse: {},
    getRecommendationCommonDataByIdsResponse: {},
    getWholeRecommendationIdsResponse: {},
    priorityElementsDropDownResponse: {},
    exportReportPdf: {},
    updateRLResponse: {},
    criticalitiesDropDownResponse: {},
    capitalTypeDropDownResponse: {},
    exportWordTableResponse: {},
    exportWordDataResponse: {},
    updateNoteResponse: {},
    exportExcelResponse: {},
    exportExcelDataResponse: {},
    getExportItems: {},
    AddExportItems: {},
    exportPropertyList: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_ALL_RECOMMENDATIONS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_RECOMMENDATIONS_SUCCESS:
            return {
                ...state,
                getAllRecommendationsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_RECOMMENDATIONS_FAILURE:
            return {
                ...state,
                getAllRecommendationsResponse: { success: false, ...action.error }
            };

        case actionType.ADD_RECOMMENDATION_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_RECOMMENDATION_SUCCESS:
            return {
                ...state,
                addRecommendationResponse: { success: true, ...action.response }
            };
        case actionType.ADD_RECOMMENDATION_FAILURE:
            return {
                ...state,
                addRecommendationResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_RECOMMENDATION_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_RECOMMENDATION_SUCCESS:
            return {
                ...state,
                updateRecommendationResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_RECOMMENDATION_FAILURE:
            return {
                ...state,
                updateRecommendationResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_MULTIPLE_RECOMMENDATIONS_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_MULTIPLE_RECOMMENDATIONS_SUCCESS:
            return {
                ...state,
                updateMultipleRecommendationsResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_MULTIPLE_RECOMMENDATIONS_FAILURE:
            return {
                ...state,
                updateMultipleRecommendationsResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_RECOMMENDATION_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_RECOMMENDATION_SUCCESS:
            return {
                ...state,
                deleteRecommendationResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_RECOMMENDATION_FAILURE:
            return {
                ...state,
                deleteRecommendationResponse: { success: false, ...action.error }
            };

        case actionType.GET_REGIONS_BASED_ON_CLIENT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REGIONS_BASED_ON_CLIENT_SUCCESS:
            return {
                ...state,
                getRegionsBasedOnClientResponse: { success: true, ...action.response }
            };
        case actionType.GET_REGIONS_BASED_ON_CLIENT_FAILURE:
            return {
                ...state,
                getRegionsBasedOnClientResponse: { success: false, ...action.error }
            };

        case actionType.GET_DEPARTMENT_BASED_ON_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DEPARTMENT_BASED_ON_PROJECT_SUCCESS:
            return {
                ...state,
                getDepaartmentsByProject: { success: true, ...action.response }
            };
        case actionType.GET_DEPARTMENT_BASED_ON_PROJECT_FAILURE:
            return {
                ...state,
                getDepaartmentsByProject: { success: false, ...action.error }
            };
        case actionType.GET_ALL_CONSULTANCY_USERS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CONSULTANCY_USERS_SUCCESS:
            return {
                ...state,
                getAllConsultancyUsersResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CONSULTANCY_USERS_FAILURE:
            return {
                ...state,
                getAllConsultancyUsersResponse: { success: false, ...action.error }
            };

        case actionType.GET_ALL_CLIENTS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CLIENTS_SUCCESS:
            return {
                ...state,
                getAllClientsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CLIENTS_FAILURE:
            return {
                ...state,
                getAllClientsResponse: { success: false, ...action.error }
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

        case actionType.PARSE_FCA_REQUEST:
            return {
                ...state
            };
        case actionType.PARSE_FCA_SUCCESS:
            return {
                ...state,
                parseFcaResponse: { success: true, ...action.response }
            };
        case actionType.PARSE_FCA_FAILURE:
            return {
                ...state,
                parseFcaResponse: { success: false, ...action.error }
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

        case actionType.GET_CATEGORY_BASED_ON_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CATEGORY_BASED_ON_PROJECT_SUCCESS:
            return {
                ...state,
                getCategoryByProject: { success: true, ...action.response }
            };
        case actionType.GET_CATEGORY_BASED_ON_PROJECT_FAILURE:
            return {
                ...state,
                getCategoryByProject: { success: false, ...action.error }
            };

        case actionType.GET_CAPITAL_TYPE_BASED_ON_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CAPITAL_TYPE_BASED_ON_PROJECT_SUCCESS:
            return {
                ...state,
                getCapitalTypeBasedOnProject: { success: true, ...action.response }
            };
        case actionType.GET_CAPITAL_TYPE_BASED_ON_PROJECT_FAILURE:
            return {
                ...state,
                getCapitalTypeBasedOnProject: { success: false, ...action.error }
            };

        case actionType.GET_SYSTEM_BASED_ON_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SYSTEM_BASED_ON_PROJECT_SUCCESS:
            return {
                ...state,
                getSystemByProject: { success: true, ...action.response }
            };
        case actionType.GET_SYSTEM_BASED_ON_PROJECT_FAILURE:
            return {
                ...state,
                getSystemByProject: { success: false, ...action.error }
            };

        case actionType.GET_SYSTEM_BASED_ON_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SUBSYSTEM_BASED_ON_PROJECT_SUCCESS:
            return {
                ...state,
                getSubSystemByProject: { success: true, ...action.response }
            };
        case actionType.GET_SUBSYSTEM_BASED_ON_PROJECT_FAILURE:
            return {
                ...state,
                getSubSystemByProject: { success: false, ...action.error }
            };
        case actionType.GET_TRADE_BASED_ON_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TRADE_BASED_ON_PROJECT_SUCCESS:
            return {
                ...state,
                getTradeByProject: { success: true, ...action.response }
            };
        case actionType.GET_TRADE_BASED_ON_PROJECT_FAILURE:
            return {
                ...state,
                getTradeByProject: { success: false, ...action.error }
            };

        case actionType.GET_FLOOR_BASED_ON_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FLOOR_BASED_ON_BUILDING_SUCCESS:
            return {
                ...state,
                getFloorByBuilding: { success: true, ...action.response }
            };
        case actionType.GET_FLOOR_BASED_ON_BUILDING_FAILURE:
            return {
                ...state,
                getFloorByBuilding: { success: false, ...action.error }
            };
        case actionType.GET_ADDITION_BASED_ON_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ADDITION_BASED_ON_BUILDING_SUCCESS:
            return {
                ...state,
                getAdditionByBuilding: { success: true, ...action.response }
            };
        case actionType.GET_ADDITION_BASED_ON_BUILDING_FAILURE:
            return {
                ...state,
                getAdditionByBuilding: { success: false, ...action.error }
            };

        case actionType.UPDATE_RECOMMENDATION_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...state.entityParams, [action.section]: { ...action.response } }
            };
        case actionType.UPDATE_RECOMMENDATION_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...state.entityParams, [action.section]: { ...action.error } }
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

        case actionType.GET_COST_PER_YEAR_BY_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_COST_PER_YEAR_BY_PROJECT_SUCCESS:
            return {
                ...state,
                getCostYearByProject: { success: true, ...action.response }
            };
        case actionType.GET_COST_PER_YEAR_BY_PROJECT_FAILURE:
            return {
                ...state,
                getCostYearByProject: { success: false, ...action.error }
            };

        case actionType.GET_FUNDING_SOURCE_BASED_ON_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FUNDING_SOURCE_BASED_ON_PROJECT_SUCCESS:
            return {
                ...state,
                getFundingSourceByProject: { success: true, ...action.response }
            };
        case actionType.GET_FUNDING_SOURCE_BASED_ON_PROJECT_FAILURE:
            return {
                ...state,
                getFundingSourceByProject: { success: false, ...action.error }
            };
        case actionType.UPDATE_MAINTENANCE_YEARS_CUT_PASTE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_MAINTENANCE_YEARS_CUT_PASTE_SUCCESS:
            return {
                ...state,
                updateMaintenanceYearCutPasteResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_MAINTENANCE_YEARS_CUT_PASTE_FAILURE:
            return {
                ...state,
                updateMaintenanceYearCutPasteResponse: { success: false, ...action.error }
            };
        case actionType.RECOVER_RECOMMENDATION_REQUEST:
            return {
                ...state
            };
        case actionType.RECOVER_RECOMMENDATION_SUCCESS:
            return {
                ...state,
                recoverRecommendationResponse: { success: true, ...action.response }
            };
        case actionType.RECOVER_RECOMMENDATION_FAILURE:
            return {
                ...state,
                recoverRecommendationResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_RECOMMENDATION_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_RECOMMENDATION_LOG_SUCCESS:
            return {
                ...state,
                getAllRecommendationLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_RECOMMENDATION_LOG_FAILURE:
            return {
                ...state,
                getAllRecommendationLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_RECOMMENDATION_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_RECOMMENDATION_LOG_SUCCESS:
            return {
                ...state,
                restoreRecommendationLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_RECOMMENDATION_LOG_FAILURE:
            return {
                ...state,
                restoreRecommendationLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_RECOMMENDATION_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_RECOMMENDATION_LOG_SUCCESS:
            return {
                ...state,
                deleteRecommendationLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_RECOMMENDATION_LOG_FAILURE:
            return {
                ...state,
                deleteRecommendationLogResponse: { success: false, ...action.error }
            };

        case actionType.GET_ASSET_CONDITION_BASED_ON_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ASSET_CONDITION_BASED_ON_PROJECT_SUCCESS:
            return {
                ...state,
                getConditionBasedOnProject: { success: true, ...action.response }
            };
        case actionType.GET_ASSET_CONDITION_BASED_ON_PROJECT_FAILURE:
            return {
                ...state,
                getConditionBasedOnProject: { success: false, ...action.error }
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

        case actionType.EXPORT_ALL_TRADES_REQUEST:
            return {
                ...state
            };
        case actionType.EXPORT_ALL_TRADES_SUCCESS:
            return {
                ...state,
                exportAllTradesResponse: { success: true, ...action.response }
            };
        case actionType.EXPORT_ALL_TRADES_FAILURE:
            return {
                ...state,
                exportAllTradesResponse: { success: false, ...action.error }
            };
        // getConditionBasedOnProject
        case actionType.GET_INTITIATIVE_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_INTITIATIVE_DROPDOWN_SUCCESS:
            return {
                ...state,
                getInitiativeDropdown: { success: true, ...action.response }
            };
        case actionType.GET_INTITIATIVE_DROPDOWN_FAILURE:
            return {
                ...state,
                getInitiativeDropdown: { success: false, ...action.error }
            };
        case actionType.DOWNLOAD_PDF_REPORT_REQUEST:
            return {
                ...state
            };
        case actionType.DOWNLOAD_PDF_REPORT_SUCCESS:
            return {
                ...state,
                pdfReportResponse: { success: true, ...action.response }
            };
        case actionType.DOWNLOAD_PDF_REPORT_FAILURE:
            return {
                ...state,
                pdfReportResponse: { success: false, ...action.error }
            };

        case actionType.GET_REPORT_NOTE_TEMPLATES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REPORT_NOTE_TEMPLATES_SUCCESS:
            return {
                ...state,
                getReportNoteTemplatesResponse: { success: true, ...action.response }
            };
        case actionType.GET_REPORT_NOTE_TEMPLATES_FAILURE:
            return {
                ...state,
                getReportNoteTemplatesResponse: { success: false, ...action.error }
            };
        case actionType.ASSIGN_IMAGES_TO_RECOM_REQUEST:
            return {
                ...state
            };
        case actionType.ASSIGN_IMAGES_TO_RECOM_SUCCESS:
            return {
                ...state,
                assignImageResponse: { success: true, ...action.response }
            };
        case actionType.ASSIGN_IMAGES_TO_RECOM_FAILURE:
            return {
                ...state,
                assignImageResponse: { success: false, ...action.error }
            };
        case actionType.UNASSIGN_IMAGE_REQUEST:
            return {
                ...state
            };
        case actionType.UNASSIGN_IMAGE_SUCCESS:
            return {
                ...state,
                unAssignImageResponse: { success: true, ...action.response }
            };
        case actionType.UNASSIGN_IMAGE_FAILURE:
            return {
                ...state,
                unAssignImageResponse: { success: false, ...action.error }
            };
        //updatebudgetpriority
        case actionType.UPDATE_BUDGET_PRIORITY_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_BUDGET_PRIORITY_SUCCESS:
            return {
                ...state,
                updateBudgetPriorityResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_BUDGET_PRIORITY_FAILURE:
            return {
                ...state,
                updateBudgetPriorityResponse: { success: false, ...action.error }
            };
        //update fmp
        case actionType.UPDATE_FMP_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_FMP_SUCCESS:
            return {
                ...state,
                updateFMPResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_FMP_FAILURE:
            return {
                ...state,
                updateFMPResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_RL_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_RL_SUCCESS:
            return {
                ...state,
                updateRLResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_RL_FAILURE:
            return {
                ...state,
                updateRLResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_RECOMMENDATION_SCROLL_POSITION_SUCCESS:
            return {
                ...state,
                scrollPosition: action.response
            };
        case actionType.UPDATE_RECOMMENDATION_SCROLL_POSITION_FAILURE:
            return {
                ...state,
                scrollPosition: 0
            };
        case actionType.GET_RECOMMENDATION_TEMPLATES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_RECOMMENDATION_TEMPLATES_SUCCESS:
            return {
                ...state,
                getRecommendationTemplatesResponse: { success: true, ...action.response }
            };
        case actionType.GET_RECOMMENDATION_TEMPLATES_FAILURE:
            return {
                ...state,
                getRecommendationTemplatesResponse: { success: false, ...action.error }
            };
        case actionType.GET_USER_DEFAULT_TRADE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_USER_DEFAULT_TRADE_SUCCESS:
            return {
                ...state,
                getUserDefaultTradeResponse: { success: true, ...action.response }
            };
        case actionType.GET_USER_DEFAULT_TRADE_FAILURE:
            return {
                ...state,
                getUserDefaultTradeResponse: { success: false, ...action.error }
            };
        case actionType.GET_RECOMMENDATION_COMMON_DATA_BY_IDS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_RECOMMENDATION_COMMON_DATA_BY_IDS_SUCCESS:
            let commonDataByIdResponse = { ...action.response };
            if (commonDataByIdResponse?.common_fields?.priority_elements?.length) {
                commonDataByIdResponse.common_fields.priority_elements.sort((a, b) => (a.index > b.index ? 1 : -1));
            }
            return {
                ...state,
                getRecommendationCommonDataByIdsResponse: { success: true, ...commonDataByIdResponse }
            };
        case actionType.GET_RECOMMENDATION_COMMON_DATA_BY_IDS_FAILURE:
            return {
                ...state,
                getRecommendationCommonDataByIdsResponse: { success: false, ...action.error }
            };
        case actionType.GET_WHOLE_RECOMMENDATION_IDS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_WHOLE_RECOMMENDATION_IDS_SUCCESS:
            return {
                ...state,
                getWholeRecommendationIdsResponse: { success: true, ...action.response }
            };
        case actionType.GET_WHOLE_RECOMMENDATION_IDS_FAILURE:
            return {
                ...state,
                getWholeRecommendationIdsResponse: { success: false, ...action.error }
            };
        case actionType.GET_PRIORITY_ELEMENT_DROPDOWN_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PRIORITY_ELEMENT_DROPDOWN_DATA_SUCCESS:
            return {
                ...state,
                priorityElementsDropDownResponse: { success: true, ...action.response }
            };
        case actionType.GET_PRIORITY_ELEMENT_DROPDOWN_DATA_FAILURE:
            return {
                ...state,
                priorityElementsDropDownResponse: { success: false, ...action.error }
            };
        case actionType.EXPORT_REPORT_PDF_REQUEST:
            return {
                ...state
            };
        case actionType.EXPORT_REPORT_PDF_SUCCESS:
            return {
                ...state,
                exportReportPdf: { success: true, ...action.response }
            };
        case actionType.EXPORT_REPORT_PDF_FAILURE:
            return {
                ...state,
                exportReportPdf: { success: false, ...action.error }
            };
        case actionType.GET_CRITICALITY_DROPDOWN_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CRITICALITY_DROPDOWN_DATA_SUCCESS:
            return {
                ...state,
                criticalitiesDropDownResponse: { success: true, ...action.response }
            };
        case actionType.GET_CRITICALITY_DROPDOWN_DATA_FAILURE:
            return {
                ...state,
                criticalitiesDropDownResponse: { success: false, ...action.error }
            };
        case actionType.GET_CAPITAL_TYPE_DROPDOWN_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CAPITAL_TYPE_DROPDOWN_DATA_SUCCESS:
            return {
                ...state,
                capitalTypeDropDownResponse: { success: true, ...action.response }
            };
        case actionType.GET_CAPITAL_TYPE_DROPDOWN_DATA_FAILURE:
            return {
                ...state,
                capitalTypeDropDownResponse: { success: false, ...action.error }
            };

        case actionType.GET_IMPORT_VIEW_TABLE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_IMPORT_VIEW_TABLE_SUCCESS:
            return {
                ...state,
                exportWordTableResponse: { success: true, ...action.response }
            };
        case actionType.GET_IMPORT_VIEW_TABLE_FAILURE:
            return {
                ...state,
                exportWordTableResponse: { success: false, ...action.error }
            };

        case actionType.GET_EXPORT_WORD_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_EXPORT_WORD_DATA_SUCCESS:
            return {
                ...state,
                exportWordDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_EXPORT_WORD_DATA_FAILURE:
            return {
                ...state,
                exportWordDataResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_NOTE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_NOTE_SUCCESS:
            return {
                ...state,
                updateNoteResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_NOTE_FAILURE:
            return {
                ...state,
                updateNoteResponse: { success: false, ...action.error }
            };
        case actionType.EXPORT_EXCEL_HISTORY_REQUEST:
            return {
                ...state
            };
        case actionType.EXPORT_EXCEL_HISTORY_SUCCESS:
            return {
                ...state,
                exportExcelResponse: { success: true, ...action.response }
            };
        case actionType.EXPORT_EXCEL_HISTORY_FAILURE:
            return {
                ...state,
                exportExcelResponse: { success: false, ...action.error }
            };
        case actionType.GET_EXPORT_EXCEL_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_EXPORT_EXCEL_DATA_SUCCESS:
            return {
                ...state,
                exportExcelDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_EXPORT_EXCEL_DATA_FAILURE:
            return {
                ...state,
                exportExcelDataResponse: { success: false, ...action.error }
            };
        case actionType.GET_EXPORT_ITEMS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_EXPORT_ITEMS_SUCCESS:
            return {
                ...state,
                getExportItems: { success: true, ...action.response }
            };
        case actionType.GET_EXPORT_ITEMS_FAILURE:
            return {
                ...state,
                getExportItems: { success: false, ...action.error }
            };
        case actionType.GET_EXPORT_PROPERTY_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_EXPORT_PROPERTY_DROPDOWN_SUCCESS:
            return {
                ...state,
                exportPropertyList: { success: true, ...action.response }
            };
        case actionType.GET_EXPORT_PROPERTY_DROPDOWN_FAILURE:
            return {
                ...state,
                exportPropertyList: { success: false, ...action.error }
            };
        case actionType.ADD_EXPORT_ITEMS_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_EXPORT_ITEMS_SUCCESS:
            return {
                ...state,
                AddExportItems: { success: true, ...action.response }
            };
        case actionType.ADD_EXPORT_ITEMS_FAILURE:
            return {
                ...state,
                AddExportItems: { success: false, ...action.error }
            };
        default:
            return state;
        //eport report pdf
    }
};
