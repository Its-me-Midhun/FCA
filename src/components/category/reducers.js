import * as actionType from "./constants";

const initialState = {
    getCategorySettingsDataResponse: {},
    addCategoryResponse: {},
    getCategoryByIdResponse: {},
    updateCategoryResponse: {},
    deleteCategoryResponse: {},
    getListForCommonFilterResponse:{},
    getAllCategoryLogsResponse: {},
    restoreSettingsLogResponse: {},
    deleteSettingsLogResponse: {},
    categoryExportResponse:{},
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
        case actionType.UPDATE_CATEGORY_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_CATEGORY_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_CATEGORY_SETTINGS_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CATEGORY_SETTINGS_DATA_SUCCESS:
            return {
                ...state,
                getCategorySettingsDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_CATEGORY_SETTINGS_DATA_FAILURE:
            return {
                ...state,
                getCategorySettingsDataResponse: { success: false, ...action.error }
            };
        case actionType.ADD_CATEGORY_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_CATEGORY_SUCCESS:
            return {
                ...state,
                addCategoryResponse: { success: true, ...action.response }
            };
        case actionType.ADD_CATEGORY_FAILURE:
            return {
                ...state,
                addCategoryResponse: { success: false, ...action.error }
            };
        case actionType.GET_CATEGORY_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CATEGORY_BY_ID_SUCCESS:
            return {
                ...state,
                getCategoryByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_CATEGORY_BY_ID_FAILURE:
            return {
                ...state,
                getCategoryByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_CATEGORY_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_CATEGORY_SUCCESS:
            return {
                ...state,
                updateCategoryResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_CATEGORY_FAILURE:
            return {
                ...state,
                updateCategoryResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_CATEGORY_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_CATEGORY_SUCCESS:
            return {
                ...state,
                deleteCategoryResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_CATEGORY_FAILURE:
            return {
                ...state,
                deleteCategoryResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_CATEGORY_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CATEGORY_LOG_SUCCESS:
            return {
                ...state,
                getAllCategoryLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CATEGORY_LOG_FAILURE:
            return {
                ...state,
                getAllCategoryLogsResponse: { success: false, ...action.error }
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
        case actionType.GET_CATEGORY_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CATEGORY_EXPORT_SUCCESS:
            return {
                ...state,
                categoryExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_CATEGORY_EXPORT_FAILURE:
            return {
                ...state,
                categoryExportResponse: { success: false, ...action.error }
            }; 
           

        default:
            return state;
    }
};
