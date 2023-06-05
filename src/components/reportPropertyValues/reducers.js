import * as actionType from "./constants";

const initialData = {
    getDataResponse: {},
    addDataResponse: {},
    getDataByIdResponse: {},
    updateDataResponse: {},
    deleteDataResponse: {},
    getListForCommonFilterResponse: {},
    getDataLogsResponse: {},
    restoreDataLogResponse: {},
    deleteDataLogResponse: {},
    dataExportResponse: {},
    checkIfPropertyMappedResponse: {},
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
        },
        selectedDropdown: "active"
    }
};
const initialState = {
    fontnames: initialData,
    tablestyles: initialData
};
export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.UPDATE_PROPERTY_VALUE_DATA_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], entityParams: { ...action.response } }
            };
        case actionType.UPDATE_PROPERTY_VALUE_DATA_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], entityParams: { ...action.error } }
            };
        case actionType.GET_LIST_FOR_COMMON_FILTER_REQUEST:
            return {
                ...state
            };
        case actionType.GET_LIST_FOR_COMMON_FILTER_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], getListForCommonFilterResponse: { success: true, ...action.response } }
            };
        case actionType.GET_LIST_FOR_COMMON_FILTER_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], getListForCommonFilterResponse: { success: false, ...action.error } }
            };
        case actionType.GET_PROPERTY_VALUE_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROPERTY_VALUE_DATA_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], getDataResponse: { success: true, ...action.response } }
            };
        case actionType.GET_PROPERTY_VALUE_DATA_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], getDataResponse: { success: false, ...action.error } }
            };
        case actionType.ADD_PROPERTY_VALUE_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_PROPERTY_VALUE_DATA_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], addDataResponse: { success: true, ...action.response } }
            };
        case actionType.ADD_PROPERTY_VALUE_DATA_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], addDataResponse: { success: false, ...action.error } }
            };
        case actionType.GET_PROPERTY_VALUE_DATA_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROPERTY_VALUE_DATA_BY_ID_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], getDataByIdResponse: { success: true, ...action.response } }
            };
        case actionType.GET_PROPERTY_VALUE_DATA_BY_ID_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], getDataByIdResponse: { success: false, ...action.error } }
            };
        case actionType.UPDATE_PROPERTY_VALUE_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_PROPERTY_VALUE_DATA_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], updateDataResponse: { success: true, ...action.response } }
            };
        case actionType.UPDATE_PROPERTY_VALUE_DATA_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], updateDataResponse: { success: false, ...action.error } }
            };
        case actionType.DELETE_PROPERTY_VALUE_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_PROPERTY_VALUE_DATA_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], deleteDataResponse: { success: true, ...action.response } }
            };
        case actionType.DELETE_PROPERTY_VALUE_DATA_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], deleteDataResponse: { success: false, ...action.error } }
            };
        case actionType.GET_ALL_PROPERTY_VALUE_DATA_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_PROPERTY_VALUE_DATA_LOG_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], getDataLogsResponse: { success: true, ...action.response } }
            };
        case actionType.GET_ALL_PROPERTY_VALUE_DATA_LOG_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], getDataLogsResponse: { success: false, ...action.error } }
            };
        case actionType.RESTORE_PROPERTY_VALUE_DATA_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_PROPERTY_VALUE_DATA_LOG_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], restoreDataLogResponse: { success: true, ...action.response } }
            };
        case actionType.RESTORE_PROPERTY_VALUE_DATA_LOG_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], restoreDataLogResponse: { success: false, ...action.error } }
            };

        case actionType.DELETE_PROPERTY_VALUE_DATA_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_PROPERTY_VALUE_DATA_LOG_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], deleteDataLogResponse: { success: true, ...action.response } }
            };
        case actionType.DELETE_PROPERTY_VALUE_DATA_LOG_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], deleteDataLogResponse: { success: false, ...action.error } }
            };
        case actionType.GET_PROPERTY_VALUE_DATA_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROPERTY_VALUE_DATA_EXPORT_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], dataExportResponse: { success: true, ...action.response } }
            };
        case actionType.GET_PROPERTY_VALUE_DATA_EXPORT_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], dataExportResponse: { success: false, ...action.error } }
            };
        case actionType.CHECK_PROPERTY_VALUE_REQUEST:
            return {
                ...state
            };
        case actionType.CHECK_PROPERTY_VALUE_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], checkIfPropertyMappedResponse: { success: true, ...action.response } }
            };
        case actionType.CHECK_PROPERTY_VALUE_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], checkIfPropertyMappedResponse: { success: false, ...action.error } }
            };

        default:
            return state;
    }
};
