import * as actionType from "./constants";

const initialState = {
    addLimitResponse:{},
    getaddLimitResponse:{},
    getGeneralByIdResponse: {},
    updateGeneralResponse: {},
    deleteGeneralResponse: {},
    getListForCommonFilterResponse:{},
    getAllGeneralLogsResponse: {},
    restoreSettingsLogResponse: {},
    deleteSettingsLogResponse: {},
    generalsettingExportResponse:{},
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
        case actionType.UPDATE_GENERAL_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_GENERAL_ENTITY_PARAMS_FAILURE:
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
        case actionType.ADD_LIMIT_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_LIMIT_SUCCESS:
            return {
                ...state,
                addLimitResponse: { success: true, ...action.response }
            };
        case actionType.ADD_LIMIT_FAILURE:
            return {
                ...state,
                addLimitResponse: { success: false, ...action.error }
            };
        case actionType.GET_ADD_LIMIT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ADD_LIMIT_SUCCESS:
            return {
                ...state,
                getaddLimitResponse: { success: true, ...action.response }
            };
        case actionType.GET_ADD_LIMIT_FAILURE:
            return {
                ...state,
                getaddLimitResponse: { success: false, ...action.error }
            };
        case actionType.GET_GENERAL_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_GENERAL_BY_ID_SUCCESS:
            return {
                ...state,
                getGeneralByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_GENERAL_BY_ID_FAILURE:
            return {
                ...state,
                getGeneralByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_GENERAL_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_GENERAL_SUCCESS:
            return {
                ...state,
                updateGeneralResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_GENERAL_FAILURE:
            return {
                ...state,
                updateGeneralResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_GENERAL_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_GENERAL_SUCCESS:
            return {
                ...state,
                deleteGeneralResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_GENERAL_FAILURE:
            return {
                ...state,
                deleteGeneralResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_GENERAL_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_GENERAL_LOG_SUCCESS:
            return {
                ...state,
                getAllGeneralLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_GENERAL_LOG_FAILURE:
            return {
                ...state,
                getAllGeneralLogsResponse: { success: false, ...action.error }
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
        case actionType.GET_GENERAL_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_GENERAL_EXPORT_SUCCESS:
            return {
                ...state,
                generalsettingExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_GENERAL_EXPORT_FAILURE:
            return {
                ...state,
                generalsettingExportResponse: { success: false, ...action.error }
            };    
        
        
        
           

        default:
            return state;
    }
};
