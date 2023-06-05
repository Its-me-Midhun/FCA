import * as actionType from "./constants";

const initialState = {
    addPriorityResponse:{},
    getPriorityResponse:{},
    getPriorityByIdResponse: {},
    updatePriorityResponse: {},
    deletePriorityResponse: {},
    getListForCommonFilterResponse:{},
    getAllPriorityLogsResponse: {},
    restoreSettingsLogResponse: {},
    deleteSettingsLogResponse: {},
    prioritysettingExportResponse:{},
    getSitesByRegionResponse:{},
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
        case actionType.UPDATE_PRIORITY_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_PRIORITY_ENTITY_PARAMS_FAILURE:
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
        case actionType.ADD_PRIORITY_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_PRIORITY_SUCCESS:
            return {
                ...state,
                addPriorityResponse: { success: true, ...action.response }
            };
        case actionType.ADD_PRIORITY_FAILURE:
            return {
                ...state,
                addPriorityResponse: { success: false, ...action.error }
            };
        case actionType.GET_PRIORITY_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PRIORITY_SUCCESS:
            return {
                ...state,
                getPriorityResponse: { success: true, ...action.response }
            };
        case actionType.GET_PRIORITY_FAILURE:
            return {
                ...state,
                getPriorityResponse: { success: false, ...action.error }
            };
        case actionType.GET_PRIORITY_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PRIORITY_BY_ID_SUCCESS:
            return {
                ...state,
                getPriorityByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_PRIORITY_BY_ID_FAILURE:
            return {
                ...state,
                getPriorityByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_PRIORITY_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_PRIORITY_SUCCESS:
            return {
                ...state,
                updatePriorityResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_PRIORITY_FAILURE:
            return {
                ...state,
                updatePriorityResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_PRIORITY_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_PRIORITY_SUCCESS:
            return {
                ...state,
                deletePriorityResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_PRIORITY_FAILURE:
            return {
                ...state,
                deletePriorityResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_PRIORITY_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_PRIORITY_LOG_SUCCESS:
            return {
                ...state,
                getAllPriorityLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_PRIORITY_LOG_FAILURE:
            return {
                ...state,
                getAllPriorityLogsResponse: { success: false, ...action.error }
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
        case actionType.GET_PRIORITY_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PRIORITY_EXPORT_SUCCESS:
            return {
                ...state,
                prioritysettingExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_PRIORITY_EXPORT_FAILURE:
            return {
                ...state,
                prioritysettingExportResponse: { success: false, ...action.error }
            };
        case actionType.GET_SITES_BY_REGION_IN_PRIORITY_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SITES_BY_REGION_IN_PRIORITY_SUCCESS:
            return {
                ...state,
                getSitesByRegionResponse: { success: true, ...action.response }
            };
        case actionType.GET_SITES_BY_REGION_IN_PRIORITY_FAILURE:
            return {
                ...state,
                getSitesByRegionResponse: { success: false, ...action.error }
            };    
        
        
        
           

        default:
            return state;
    }
};
