import * as actionType from "./constants";

const initialState = {
    getFundingsourceSettingsDataResponse: {},
    addFundingsourceResponse: {},
    getFundingsourceByIdResponse: {},
    updateFundingsourceResponse: {},
    deleteFundingsourceResponse: {},
    getListForCommonFilterResponse:{},
    getAllFundingSourceLogsResponse: {},
    restoreSettingsLogResponse: {},
    deleteSettingsLogResponse: {},
    fundingsourceExportResponse:{},
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
        case actionType.UPDATE_FUNDING_SOURCE_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_FUNDING_SOURCE_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_FUNDING_SOURCE_SETTINGS_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FUNDING_SOURCE_SETTINGS_DATA_SUCCESS:
            return {
                ...state,
                getFundingsourceSettingsDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_FUNDING_SOURCE_SETTINGS_DATA_FAILURE:
            return {
                ...state,
                getFundingsourceSettingsDataResponse: { success: false, ...action.error }
            };
        case actionType.ADD_FUNDING_SOURCE_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_FUNDING_SOURCE_SUCCESS:
            return {
                ...state,
                addFundingsourceResponse: { success: true, ...action.response }
            };
        case actionType.ADD_FUNDING_SOURCE_FAILURE:
            return {
                ...state,
                addFundingsourceResponse: { success: false, ...action.error }
            };
        case actionType.GET_FUNDING_SOURCE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FUNDING_SOURCE_BY_ID_SUCCESS:
            return {
                ...state,
                getFundingsourceByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_FUNDING_SOURCE_BY_ID_FAILURE:
            return {
                ...state,
                getFundingsourceByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_FUNDING_SOURCE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_FUNDING_SOURCE_SUCCESS:
            return {
                ...state,
                updateFundingsourceResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_FUNDING_SOURCE_FAILURE:
            return {
                ...state,
                updateFundingsourceResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_FUNDING_SOURCE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_FUNDING_SOURCE_SUCCESS:
            return {
                ...state,
                deleteFundingsourceResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_FUNDING_SOURCE_FAILURE:
            return {
                ...state,
                deleteFundingsourceResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_FUNDING_SOURCE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_FUNDING_SOURCE_LOG_SUCCESS:
            return {
                ...state,
                getAllFundingSourceLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_FUNDING_SOURCE_LOG_FAILURE:
            return {
                ...state,
                getAllFundingSourceLogsResponse: { success: false, ...action.error }
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
        case actionType.GET_FUNDING_SOURCE_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FUNDING_SOURCE_EXPORT_SUCCESS:
            return {
                ...state,
                fundingsourceExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_FUNDING_SOURCE_EXPORT_FAILURE:
            return {
                ...state,
                fundingsourceExportResponse: { success: false, ...action.error }
            };    
           

        default:
            return state;
    }
};
