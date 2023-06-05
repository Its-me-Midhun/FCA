import * as actionType from "./constants";

const initialState = {
    getSubsystemSettingsDataResponse:{},
    addSubsystemResponse: {},
    getSubsystemByIdResponse: {},
    updateSubsystemResponse: {},
    deleteSubsystemResponse: {},
    getTradeSettingsDropdownResponse:{},
    getSystemSettingsDropdownResponse:{},
    getListForCommonFilterResponse:{},
    getAllSubSystemLogsResponse: {},
    restoreSettingsLogResponse: {},
    deleteSettingsLogResponse: {},
    subsystemExportResponse:{},
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
            filters:null,
            list:null
        },
        wildCardFilterParams: {},
        filterParams: {},
        tableConfig: null,
        historyPaginationParams:{
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
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.UPDATE_SUB_SYSTEM_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_SUB_SYSTEM_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_SUB_SYSTEM_SETTINGS_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SUB_SYSTEM_SETTINGS_DATA_SUCCESS:
            return {
                ...state,
                getSubsystemSettingsDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_SUB_SYSTEM_SETTINGS_DATA_FAILURE:
            return {
                ...state,
                getSubystemSettingsDataResponse: { success: false, ...action.error }
            };
        case actionType.ADD_SUB_SYSTEM_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_SUB_SYSTEM_SUCCESS:
            return {
                ...state,
                addSubsystemResponse: { success: true, ...action.response }
            };
        case actionType.ADD_SUB_SYSTEM_FAILURE:
            return {
                ...state,
                addSubsystemResponse: { success: false, ...action.error }
            };
        case actionType.GET_SUB_SYSTEM_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SUB_SYSTEM_BY_ID_SUCCESS:
            return {
                ...state,
                getSubsystemByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_SUB_SYSTEM_BY_ID_FAILURE:
            return {
                ...state,
                getSubsystemByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_SUB_SYSTEM_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_SUB_SYSTEM_SUCCESS:
            return {
                ...state,
                updateSubsystemResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_SUB_SYSTEM_FAILURE:
            return {
                ...state,
                updateSubsystemResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_SUB_SYSTEM_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_SUB_SYSTEM_SUCCESS:
            return {
                ...state,
                deleteSubsystemResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_SUB_SYSTEM_FAILURE:
            return {
                ...state,
                deleteSubsystemResponse: { success: false, ...action.error }
            };
        
        case actionType.GET_TRADE_SETTINGS_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TRADE_SETTINGS_DROPDOWN_SUCCESS:
            return {
                ...state,
                getTradeSettingsDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_TRADE_SETTINGS_DROPDOWN_FAILURE:
            return {
                ...state,
                getTradeSettingsDropdownResponse: { success: false, ...action.error }
            };
        case actionType.GET_SYSTEM_SETTINGS_BY_TRADE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SYSTEM_SETTINGS_BY_TRADE_SUCCESS:
            return {
                ...state,
                getSystemSettingsDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_SYSTEM_SETTINGS_BY_TRADE_FAILURE:
            return {
                ...state,
                getSystemSettingsDropdownResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_SUB_SYSTEM_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_SUB_SYSTEM_LOG_SUCCESS:
            return {
                ...state,
                getAllSubSystemLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_SUB_SYSTEM_LOG_FAILURE:
            return {
                ...state,
                getAllSubSystemLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_SETTINGS_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_SETTINGS_LOG_SUCCESS:
            return {
                ...state,
                restoreSettingsLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_SETTINGS_LOG_FAILURE:
            return {
                ...state,
                restoreSettingsLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_SETTINGS_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_SETTINGS_LOG_SUCCESS:
            return {
                ...state,
                deleteSettingsLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_SETTINGS_LOG_FAILURE:
            return {
                ...state,
                deleteSettingsLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_SUB_SYSTEM_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SUB_SYSTEM_EXPORT_SUCCESS:
            return {
                ...state,
                subsystemExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_SUB_SYSTEM_EXPORT_FAILURE:
            return {
                ...state,
                subsystemExportResponse: { success: false, ...action.error }
            }; 
        
        
           

        default:
            return state;
    }
};
