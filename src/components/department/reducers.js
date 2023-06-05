import * as actionType from "./constants";

const initialState = {
    getDepartmentSettingsDataResponse:{},
    addDepartmentResponse: {},
    getDepartmentByIdResponse: {},
    updateDepartmentResponse: {},
    deleteDepartmentResponse: {},
    getListForCommonFilterResponse:{},
    getAllDepartmentLogsResponse: {},
    restoreSettingsLogResponse: {},
    deleteSettingsLogResponse: {},
    departmentExportResponse:{},
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
        case actionType.UPDATE_DEPARTMENT_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_DEPARTMENT_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_DEPARTMENT_SETTINGS_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DEPARTMENT_SETTINGS_DATA_SUCCESS:
            return {
                ...state,
                getDepartmentSettingsDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_DEPARTMENT_SETTINGS_DATA_FAILURE:
            return {
                ...state,
                getDepartmentSettingsDataResponse: { success: false, ...action.error }
            };
        case actionType.ADD_DEPARTMENT_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_DEPARTMENT_SUCCESS:
            return {
                ...state,
                addDepartmentResponse: { success: true, ...action.response }
            };
        case actionType.ADD_DEPARTMENT_FAILURE:
            return {
                ...state,
                addDepartmentResponse: { success: false, ...action.error }
            };
        case actionType.GET_DEPARTMENT_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DEPARTMENT_BY_ID_SUCCESS:
            return {
                ...state,
                getDepartmentByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_DEPARTMENT_BY_ID_FAILURE:
            return {
                ...state,
                getDepartmentByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_DEPARTMENT_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_DEPARTMENT_SUCCESS:
            return {
                ...state,
                updateDepartmentResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_DEPARTMENT_FAILURE:
            return {
                ...state,
                updateDepartmentResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_DEPARTMENT_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_DEPARTMENT_SUCCESS:
            return {
                ...state,
                deleteDepartmentResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_DEPARTMENT_FAILURE:
            return {
                ...state,
                deleteDepartmentResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_DEPARTMENT_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_DEPARTMENT_LOG_SUCCESS:
            return {
                ...state,
                getAllDepartmentLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_DEPARTMENT_LOG_FAILURE:
            return {
                ...state,
                getAllDepartmentLogsResponse: { success: false, ...action.error }
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
        case actionType.GET_DEPARTMENT_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DEPARTMENT_EXPORT_SUCCESS:
            return {
                ...state,
                departmentExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_DEPARTMENT_EXPORT_FAILURE:
            return {
                ...state,
                departmentExportResponse: { success: false, ...action.error }
            }; 
        
           

        default:
            return state;
    }
};
