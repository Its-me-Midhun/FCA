import * as actionType from "./constants";

const initialState = {
    addSystemTablesResponse: {},
    updateSystemTablesResponse: {},
    deleteSystemTablesResponse: {},
    getSystemTablesByIdResponse: {},
    getSystemTablesResponse: {},
    getListForCommonFilterResponse: {},
    getAllSystemTablesLogsResponse: {},
    restoreSystemTablesLogResponse: {},
    deleteSystemTablesLogResponse: {},
    systemTablesExportResponse: {},
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
        case actionType.GET_SYSTEM_TABLES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SYSTEM_TABLES_SUCCESS:
            return {
                ...state,
                getSystemTablesResponse: { success: true, ...action.response }
            };
        case actionType.GET_SYSTEM_TABLES_FAILURE:
            return {
                ...state,
                getSystemTablesResponse: { success: false, ...action.error }
            };

        case actionType.ADD_SYSTEM_TABLES_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_SYSTEM_TABLES_SUCCESS:
            return {
                ...state,
                addSystemTablesResponse: { success: true, ...action.response }
            };
        case actionType.ADD_SYSTEM_TABLES_FAILURE:
            return {
                ...state,
                addSystemTablesResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_SYSTEM_TABLES_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_SYSTEM_TABLES_SUCCESS:
            return {
                ...state,
                updateSystemTablesResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_SYSTEM_TABLES_FAILURE:
            return {
                ...state,
                updateSystemTablesResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_SYSTEM_TABLES_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_SYSTEM_TABLES_SUCCESS:
            return {
                ...state,
                deleteSystemTablesResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_SYSTEM_TABLES_FAILURE:
            return {
                ...state,
                deleteSystemTablesResponse: { success: false, ...action.error }
            };
        case actionType.GET_SYSTEM_TABLES_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SYSTEM_TABLES_BY_ID_SUCCESS:
            return {
                ...state,
                getSystemTablesByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_SYSTEM_TABLES_BY_ID_FAILURE:
            return {
                ...state,
                getSystemTablesByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_SYSTEM_TABLES_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_SYSTEM_TABLES_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ALL_SYSTEM_TABLES_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_SYSTEM_TABLES_LOG_SUCCESS:
            return {
                ...state,
                getAllSystemTablesLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_SYSTEM_TABLES_LOG_FAILURE:
            return {
                ...state,
                getAllSystemTablesLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_SYSTEM_TABLES_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_SYSTEM_TABLES_LOG_SUCCESS:
            return {
                ...state,
                restoreSystemTablesLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_SYSTEM_TABLES_LOG_FAILURE:
            return {
                ...state,
                restoreSystemTablesLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_SYSTEM_TABLES_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_SYSTEM_TABLES_LOG_SUCCESS:
            return {
                ...state,
                deleteSystemTablesLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_SYSTEM_TABLES_LOG_FAILURE:
            return {
                ...state,
                deleteSystemTablesLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_SYSTEM_TABLES_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SYSTEM_TABLES_EXPORT_SUCCESS:
            return {
                ...state,
                systemTablesExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_SYSTEM_TABLES_EXPORT_FAILURE:
            return {
                ...state,
                systemTablesExportResponse: { success: false, ...action.error }
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
