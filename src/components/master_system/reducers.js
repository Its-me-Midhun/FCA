import * as actionType from "./constants";

const initialState = {
    addSystemResponse: {},
    updateSystemResponse: {},
    deleteSystemResponse: {},
    getSystemByIdResponse: {},
    getSystemsResponse: {},
    getListForCommonFilterResponse: {},
    getAllSystemLogsResponse: {},
    restoreSystemLogResponse: {},
    deleteSystemLogResponse: {},
    systemExportResponse: {},
    getTradeDropdownResponse: {},
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
        case actionType.GET_SYSTEMS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SYSTEMS_SUCCESS:
            return {
                ...state,
                getSystemsResponse: { success: true, ...action.response }
            };
        case actionType.GET_SYSTEMS_FAILURE:
            return {
                ...state,
                getSystemsResponse: { success: false, ...action.error }
            };

        case actionType.ADD_SYSTEM_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_SYSTEM_SUCCESS:
            return {
                ...state,
                addSystemResponse: { success: true, ...action.response }
            };
        case actionType.ADD_SYSTEM_FAILURE:
            return {
                ...state,
                addSystemResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_SYSTEM_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_SYSTEM_SUCCESS:
            return {
                ...state,
                updateSystemResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_SYSTEM_FAILURE:
            return {
                ...state,
                updateSystemResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_SYSTEM_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_SYSTEM_SUCCESS:
            return {
                ...state,
                deleteSystemResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_SYSTEM_FAILURE:
            return {
                ...state,
                deleteSystemResponse: { success: false, ...action.error }
            };
        case actionType.GET_SYSTEM_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SYSTEM_BY_ID_SUCCESS:
            return {
                ...state,
                getSystemByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_SYSTEM_BY_ID_FAILURE:
            return {
                ...state,
                getSystemByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_SYSTEM_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_SYSTEM_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ALL_SYSTEM_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_SYSTEM_LOG_SUCCESS:
            return {
                ...state,
                getAllSystemLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_SYSTEM_LOG_FAILURE:
            return {
                ...state,
                getAllSystemLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_SYSTEM_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_SYSTEM_LOG_SUCCESS:
            return {
                ...state,
                restoreSystemLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_SYSTEM_LOG_FAILURE:
            return {
                ...state,
                restoreSystemLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_SYSTEM_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_SYSTEM_LOG_SUCCESS:
            return {
                ...state,
                deleteSystemLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_SYSTEM_LOG_FAILURE:
            return {
                ...state,
                deleteSystemLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_SYSTEM_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SYSTEM_EXPORT_SUCCESS:
            return {
                ...state,
                systemExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_SYSTEM_EXPORT_FAILURE:
            return {
                ...state,
                systemExportResponse: { success: false, ...action.error }
            };

        case actionType.GET_TRADE_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TRADE_DROPDOWN_SUCCESS:
            return {
                ...state,
                getTradeDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_TRADE_DROPDOWN_FAILURE:
            return {
                ...state,
                getTradeDropdownResponse: { success: false, ...action.error }
            };

        default:
            return state;
    }
};
