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
    // status: initialData,
    //    / pie_chart:initialData,
    type: initialData,
    // condition: initialData,
    // mainCategory: initialData,
    // subCategory1: initialData,
    // subCategory2: initialData,
    // subCategory3: initialData,
    // level1: initialData,
    // level2: initialData,
    // level3: initialData,
    // level4: initialData,
    // level5: initialData,
    dropDownList: []
};
export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_DOCUMENT_TYPE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DOCUMENT_TYPE_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], getDataResponse: { success: true, ...action.response } }
            };
        case actionType.GET_DOCUMENT_TYPE_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], getDataResponse: { success: false, ...action.error } }
            };

        case actionType.ADD_DOCUMENT_TYPE_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_DOCUMENT_TYPE_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], addDataResponse: { success: true, ...action.response } }
            };
        case actionType.ADD_DOCUMENT_TYPE_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], addDataResponse: { success: false, ...action.error } }
            };

        case actionType.UPDATE_DOCUMENT_TYPE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_DOCUMENT_TYPE_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], updateDataResponse: { success: true, ...action.response } }
            };
        case actionType.UPDATE_DOCUMENT_TYPE_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], updateDataResponse: { success: false, ...action.error } }
            };

        case actionType.UPDATE_DOCUMENT_TYPE_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], entityParams: { ...action.response } }
            };
        case actionType.UPDATE_DOCUMENT_TYPE_ENTITY_PARAMS_FAILURE:
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

        case actionType.GET_DOCUMENT_TYPE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DOCUMENT_TYPE_BY_ID_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], getDataByIdResponse: { success: true, ...action.response } }
            };
        case actionType.GET_DOCUMENT_TYPE_BY_ID_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], getDataByIdResponse: { success: false, ...action.error } }
            };

        case actionType.DELETE_DOCUMENT_TYPE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_DOCUMENT_TYPE_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], deleteDataResponse: { success: true, ...action.response } }
            };
        case actionType.DELETE_DOCUMENT_TYPE_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], deleteDataResponse: { success: false, ...action.error } }
            };

        case actionType.GET_ALL_DOCUMENT_TYPE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_DOCUMENT_TYPE_LOG_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], getDataLogsResponse: { success: true, ...action.response } }
            };
        case actionType.GET_ALL_DOCUMENT_TYPE_LOG_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], getDataLogsResponse: { success: false, ...action.error } }
            };

        case actionType.RESTORE_DOCUMENT_TYPE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_DOCUMENT_TYPE_LOG_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], restoreDataLogResponse: { success: true, ...action.response } }
            };
        case actionType.RESTORE_DOCUMENT_TYPE_LOG_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], restoreDataLogResponse: { success: false, ...action.error } }
            };

        case actionType.DELETE_DOCUMENT_TYPE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_DOCUMENT_TYPE_LOG_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], deleteDataLogResponse: { success: true, ...action.response } }
            };
        case actionType.DELETE_DOCUMENT_TYPE_LOG_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], deleteDataLogResponse: { success: false, ...action.error } }
            };

        case actionType.GET_DOCUMENT_TYPE_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DOCUMENT_TYPE_EXPORT_SUCCESS:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], dataExportResponse: { success: true, ...action.response } }
            };
        case actionType.GET_DOCUMENT_TYPE_EXPORT_FAILURE:
            return {
                ...state,
                [action.entity]: { ...state[action.entity], dataExportResponse: { success: false, ...action.error } }
            };
        case actionType.GET_CLIENT_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CLIENT_DROPDOWN_SUCCESS:
            return {
                ...state,
                dropDownList: {
                    ...state.dropDownList,
                    [action.level]: action.response[action.level]
                }
            };
        case actionType.GET_CLIENT_DROPDOWN_FAILURE:
            return {
                ...state,
                dropDownList: {
                    ...state.dropDownList
                }
            };

        default:
            return state;
    }
};
