import * as actionType from "./constants";

const initialState = {
    getCapitalTypeSettingsDataResponse: {},
    getCapitalTypeByIdResponse: {},
    updateCapitalTypeResponse: {},
    deleteAssetConditionResponse: {},
    getListForCommonFilterResponse:{},
    getAllAssetConditionLogsResponse: {},
    restoreSettingsLogResponse: {},
    deleteSettingsLogResponse: {},
    assetconditionExportResponse:{},
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
        case actionType.UPDATE_CAPITAL_TYPE_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_CAPITAL_TYPE_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_CAPITAL_TYPE_SETTINGS_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CAPITAL_TYPE_SETTINGS_DATA_SUCCESS:
            return {
                ...state,
                getCapitalTypeSettingsDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_CAPITAL_TYPE_SETTINGS_DATA_FAILURE:
            return {
                ...state,
                getCapitalTypeSettingsDataResponse: { success: false, ...action.error }
            };
        case actionType.GET_CAPITAL_TYPE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CAPITAL_TYPE_BY_ID_SUCCESS:
            return {
                ...state,
                getCapitalTypeByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_CAPITAL_TYPE_BY_ID_FAILURE:
            return {
                ...state,
                getCapitalTypeByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_CAPITAL_TYPE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_CAPITAL_TYPE_SUCCESS:
            return {
                ...state,
                updateCapitalTypeResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_CAPITAL_TYPE_FAILURE:
            return {
                ...state,
                updateCapitalTypeResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_ASSET_CONDITION_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_ASSET_CONDITION_SUCCESS:
            return {
                ...state,
                deleteAssetConditionResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_ASSET_CONDITION_FAILURE:
            return {
                ...state,
                deleteAssetConditionResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_ASSET_CONDITION_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_ASSET_CONDITION_LOG_SUCCESS:
            return {
                ...state,
                getAllAssetConditionLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_ASSET_CONDITION_LOG_FAILURE:
            return {
                ...state,
                getAllAssetConditionLogsResponse: { success: false, ...action.error }
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
        case actionType.GET_ASSET_CONDITION_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ASSET_CONDITION_EXPORT_SUCCESS:
            return {
                ...state,
                assetconditionExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_ASSET_CONDITION_EXPORT_FAILURE:
            return {
                ...state,
                assetconditionExportResponse: { success: false, ...action.error }
            };   

        default:
            return state;
    }
};
