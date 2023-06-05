import * as actionType from "./constants";

const initialState = {
    addSubSystemResponse: {},
    updateSubSystemResponse: {},
    deleteSubSystemResponse: {},
    getSubSystemByIdResponse: {},
    getSubSystemsResponse: {},
    getListForCommonFilterResponse: {},
    getAllSubSystemLogsResponse: {},
    restoreSubSystemLogResponse: {},
    deleteSubSystemLogResponse: {},
    subSystemExportResponse: {},
    getTradeDropdownResponse: {},
    getSystemByTradeDropdownResponse: {},
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
        case actionType.GET_MASTER_SUBSYSTEMS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_MASTER_SUBSYSTEMS_SUCCESS:
            return {
                ...state,
                getSubSystemsResponse: { success: true, ...action.response }
            };
        case actionType.GET_MASTER_SUBSYSTEMS_FAILURE:
            return {
                ...state,
                getSubSystemsResponse: { success: false, ...action.error }
            };

        case actionType.ADD_MASTER_SUBSYSTEM_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_MASTER_SUBSYSTEM_SUCCESS:
            return {
                ...state,
                addSubSystemResponse: { success: true, ...action.response }
            };
        case actionType.ADD_MASTER_SUBSYSTEM_FAILURE:
            return {
                ...state,
                addSubSystemResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_MASTER_SUBSYSTEM_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_MASTER_SUBSYSTEM_SUCCESS:
            return {
                ...state,
                updateSubSystemResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_MASTER_SUBSYSTEM_FAILURE:
            return {
                ...state,
                updateSubSystemResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_MASTER_SUBSYSTEM_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_MASTER_SUBSYSTEM_SUCCESS:
            return {
                ...state,
                deleteSubSystemResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_MASTER_SUBSYSTEM_FAILURE:
            return {
                ...state,
                deleteSubSystemResponse: { success: false, ...action.error }
            };
        case actionType.GET_MASTER_SUBSYSTEM_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_MASTER_SUBSYSTEM_BY_ID_SUCCESS:
            return {
                ...state,
                getSubSystemByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_MASTER_SUBSYSTEM_BY_ID_FAILURE:
            return {
                ...state,
                getSubSystemByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_MASTER_SUBSYSTEM_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_MASTER_SUBSYSTEM_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ALL_MASTER_SUBSYSTEM_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_MASTER_SUBSYSTEM_LOG_SUCCESS:
            return {
                ...state,
                getAllSubSystemLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_MASTER_SUBSYSTEM_LOG_FAILURE:
            return {
                ...state,
                getAllSubSystemLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_MASTER_SUBSYSTEM_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_MASTER_SUBSYSTEM_LOG_SUCCESS:
            return {
                ...state,
                restoreSubSystemLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_MASTER_SUBSYSTEM_LOG_FAILURE:
            return {
                ...state,
                restoreSubSystemLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_MASTER_SUBSYSTEM_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_MASTER_SUBSYSTEM_LOG_SUCCESS:
            return {
                ...state,
                deleteSubSystemLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_MASTER_SUBSYSTEM_LOG_FAILURE:
            return {
                ...state,
                deleteSubSystemLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_MASTER_SUBSYSTEM_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_MASTER_SUBSYSTEM_EXPORT_SUCCESS:
            return {
                ...state,
                subSystemExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_MASTER_SUBSYSTEM_EXPORT_FAILURE:
            return {
                ...state,
                subSystemExportResponse: { success: false, ...action.error }
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

        case actionType.GET_SYSTEM_BY_TRADE_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SYSTEM_BY_TRADE_DROPDOWN_SUCCESS:
            return {
                ...state,
                getSystemByTradeDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_SYSTEM_BY_TRADE_DROPDOWN_FAILURE:
            return {
                ...state,
                getSystemByTradeDropdownResponse: { success: false, ...action.error }
            };

        default:
            return state;
    }
};
