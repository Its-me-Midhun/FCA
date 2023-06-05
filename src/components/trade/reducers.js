import * as actionType from "./constants";

const initialState = {
    getTradeSettingsDataResponse: {},
    addTradeResponse: {},
    getTradeByIdResponse: {},
    updateTradeResponse: {},
    deleteTradeResponse: {},
    getListForCommonFilterResponse:{},
    getAllTradeLogsResponse: {},
    restoreSettingsLogResponse: {},
    deleteSettingsLogResponse: {},
    tradeExportResponse:{},
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
        case actionType.UPDATE_TRADE_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_TRADE_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_TRADE_SETTINGS_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TRADE_SETTINGS_DATA_SUCCESS:
            return {
                ...state,
                getTradeSettingsDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_TRADE_SETTINGS_DATA_FAILURE:
            return {
                ...state,
                getTradeSettingsDataResponse: { success: false, ...action.error }
            };
        case actionType.ADD_TRADE_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_TRADE_SUCCESS:
            return {
                ...state,
                addTradeResponse: { success: true, ...action.response }
            };
        case actionType.ADD_TRADE_FAILURE:
            return {
                ...state,
                addTradeResponse: { success: false, ...action.error }
            };
        case actionType.GET_TRADE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TRADE_BY_ID_SUCCESS:
            return {
                ...state,
                getTradeByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_TRADE_BY_ID_FAILURE:
            return {
                ...state,
                getTradeByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_TRADE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_TRADE_SUCCESS:
            return {
                ...state,
                updateTradeResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_TRADE_FAILURE:
            return {
                ...state,
                updateTradeResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_TRADE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_TRADE_SUCCESS:
            return {
                ...state,
                deleteTradeResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_TRADE_FAILURE:
            return {
                ...state,
                deleteTradeResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_TRADE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_TRADE_LOG_SUCCESS:
            return {
                ...state,
                getAllTradeLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_TRADE_LOG_FAILURE:
            return {
                ...state,
                getAllTradeLogsResponse: { success: false, ...action.error }
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
        case actionType.GET_TRADE_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TRADE_EXPORT_SUCCESS:
            return {
                ...state,
                tradeExportResponse : { success: true, ...action.response }
            };
        case actionType.GET_TRADE_EXPORT_FAILURE:
            return {
                ...state,
                tradeExportResponse: { success: false, ...action.error }
            };    

        default:
            return state;
    }
};
