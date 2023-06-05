import * as actionType from "./constants";

const initialState = {
    addSpecialReportResponse: {},
    updateSpecialReportResponse: {},
    deleteSpecialReportResponse: {},
    getSpecialReportByIdResponse: {},
    getSpecialReportsResponse: {},
    getListForCommonFilterResponse: {},
    getAllSpecialReportLogsResponse: {},
    restoreSpecialReportLogResponse: {},
    deleteSpecialReportLogResponse: {},
    specialReportExportResponse: {},
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
        case actionType.GET_SPECIAL_REPORTS_BASED_ON_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SPECIAL_REPORTS_BASED_ON_BUILDING_SUCCESS:
            return {
                ...state,
                getSpecialReportsResponse: { success: true, ...action.response }
            };
        case actionType.GET_SPECIAL_REPORTS_BASED_ON_BUILDING_FAILURE:
            return {
                ...state,
                getSpecialReportsResponse: { success: false, ...action.error }
            };

        case actionType.ADD_SPECIAL_REPORT_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_SPECIAL_REPORT_SUCCESS:
            return {
                ...state,
                addSpecialReportResponse: { success: true, ...action.response }
            };
        case actionType.ADD_SPECIAL_REPORT_FAILURE:
            return {
                ...state,
                addSpecialReportResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_SPECIAL_REPORT_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_SPECIAL_REPORT_SUCCESS:
            return {
                ...state,
                updateSpecialReportResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_SPECIAL_REPORT_FAILURE:
            return {
                ...state,
                updateSpecialReportResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_SPECIAL_REPORT_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_SPECIAL_REPORT_SUCCESS:
            return {
                ...state,
                deleteSpecialReportResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_SPECIAL_REPORT_FAILURE:
            return {
                ...state,
                deleteSpecialReportResponse: { success: false, ...action.error }
            };
        case actionType.GET_SPECIAL_REPORT_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SPECIAL_REPORT_BY_ID_SUCCESS:
            return {
                ...state,
                getSpecialReportByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_SPECIAL_REPORT_BY_ID_FAILURE:
            return {
                ...state,
                getSpecialReportByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_SPECIAL_REPORT_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_SPECIAL_REPORT_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ALL_SPECIAL_REPORT_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_SPECIAL_REPORT_LOG_SUCCESS:
            return {
                ...state,
                getAllSpecialReportLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_SPECIAL_REPORT_LOG_FAILURE:
            return {
                ...state,
                getAllSpecialReportLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_SPECIAL_REPORT_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_SPECIAL_REPORT_LOG_SUCCESS:
            return {
                ...state,
                restoreSpecialReportLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_SPECIAL_REPORT_LOG_FAILURE:
            return {
                ...state,
                restoreSpecialReportLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_SPECIAL_REPORT_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_SPECIAL_REPORT_LOG_SUCCESS:
            return {
                ...state,
                deleteSpecialReportLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_SPECIAL_REPORT_LOG_FAILURE:
            return {
                ...state,
                deleteSpecialReportLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_SPECIAL_REPORT_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SPECIAL_REPORT_EXPORT_SUCCESS:
            return {
                ...state,
                specialReportExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_SPECIAL_REPORT_EXPORT_FAILURE:
            return {
                ...state,
                specialReportExportResponse: { success: false, ...action.error }
            };

        case actionType.GET_ASSIGN_MODAL_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ASSIGN_MODAL_DETAILS_SUCCESS:
            return {
                ...state,
                getAssignModalDetailsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ASSIGN_MODAL_DETAILS_FAILURE:
            return {
                ...state,
                getAssignModalDetailsResponse: { success: false, ...action.error }
            };

        case actionType.ASSIGN_ITEMS_REQUEST:
            return {
                ...state
            };
        case actionType.ASSIGN_ITEMS_SUCCESS:
            return {
                ...state,
                assignItemsResponse: { success: true, ...action.response }
            };
        case actionType.ASSIGN_ITEMS_FAILURE:
            return {
                ...state,
                assignItemsResponse: { success: false, ...action.error }
            };

        default:
            return state;
    }
};
