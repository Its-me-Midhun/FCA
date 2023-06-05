import * as actionType from "./constants";

const initialState = {
    addReportParagraphResponse: {},
    updateReportParagraphResponse: {},
    deleteReportParagraphResponse: {},
    getReportParagraphByIdResponse: {},
    getReportParagraphsResponse: {},
    getListForCommonFilterResponse: {},
    getAllReportParagraphLogsResponse: {},
    restoreReportParagraphLogResponse: {},
    deleteReportParagraphLogResponse: {},
    reportParagraphExportResponse: {},
    getSpecialReportsDropdownResponse: {},
    getAssignModalDetailsResponse: {},
    assignItemsResponse: {},
    entityParams: {
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
            list: null
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
        }
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_REPORT_PARAGRAPHS_BASED_ON_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REPORT_PARAGRAPHS_BASED_ON_BUILDING_SUCCESS:
            return {
                ...state,
                getReportParagraphsResponse: { success: true, ...action.response }
            };
        case actionType.GET_REPORT_PARAGRAPHS_BASED_ON_BUILDING_FAILURE:
            return {
                ...state,
                getReportParagraphsResponse: { success: false, ...action.error }
            };

        case actionType.ADD_REPORT_PARAGRAPH_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_REPORT_PARAGRAPH_SUCCESS:
            return {
                ...state,
                addReportParagraphResponse: { success: true, ...action.response }
            };
        case actionType.ADD_REPORT_PARAGRAPH_FAILURE:
            return {
                ...state,
                addReportParagraphResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_REPORT_PARAGRAPH_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_REPORT_PARAGRAPH_SUCCESS:
            return {
                ...state,
                updateReportParagraphResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_REPORT_PARAGRAPH_FAILURE:
            return {
                ...state,
                updateReportParagraphResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_REPORT_PARAGRAPH_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_REPORT_PARAGRAPH_SUCCESS:
            return {
                ...state,
                deleteReportParagraphResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_REPORT_PARAGRAPH_FAILURE:
            return {
                ...state,
                deleteReportParagraphResponse: { success: false, ...action.error }
            };
        case actionType.GET_REPORT_PARAGRAPH_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REPORT_PARAGRAPH_BY_ID_SUCCESS:
            return {
                ...state,
                getReportParagraphByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_REPORT_PARAGRAPH_BY_ID_FAILURE:
            return {
                ...state,
                getReportParagraphByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_REPORT_PARAGRAPH_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_REPORT_PARAGRAPH_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ALL_REPORT_PARAGRAPH_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_REPORT_PARAGRAPH_LOG_SUCCESS:
            return {
                ...state,
                getAllReportParagraphLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_REPORT_PARAGRAPH_LOG_FAILURE:
            return {
                ...state,
                getAllReportParagraphLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_REPORT_PARAGRAPH_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_REPORT_PARAGRAPH_LOG_SUCCESS:
            return {
                ...state,
                restoreReportParagraphLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_REPORT_PARAGRAPH_LOG_FAILURE:
            return {
                ...state,
                restoreReportParagraphLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_REPORT_PARAGRAPH_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_REPORT_PARAGRAPH_LOG_SUCCESS:
            return {
                ...state,
                deleteReportParagraphLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_REPORT_PARAGRAPH_LOG_FAILURE:
            return {
                ...state,
                deleteReportParagraphLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_REPORT_PARAGRAPH_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REPORT_PARAGRAPH_EXPORT_SUCCESS:
            return {
                ...state,
                reportParagraphExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_REPORT_PARAGRAPH_EXPORT_FAILURE:
            return {
                ...state,
                reportParagraphExportResponse: { success: false, ...action.error }
            };

        case actionType.GET_SPECIAL_REPORTS_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SPECIAL_REPORTS_DROPDOWN_SUCCESS:
            return {
                ...state,
                getSpecialReportsDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_SPECIAL_REPORTS_DROPDOWN_FAILURE:
            return {
                ...state,
                getSpecialReportsDropdownResponse: { success: false, ...action.error }
            };

        default:
            return state;
    }
};
