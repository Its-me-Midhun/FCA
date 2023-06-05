import * as actionType from "./constants";
const initialState = {
    getAllInitiatives: {},
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
            list: null,
            year: [],
            index: []
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
        selectedDropdown: ""
    },
    getAllProjectsDropdown: {},
    deleteInitiatives: {},
    getInitiativeById: {},
    updateInitiatives: {},
    addInitiatives: {},
    getInitiativeLog: {},
    deleteInitiativeLog: {},
    restoreInitiativeLog: {},
    assignProject: {},
    unAssignProject: {}

};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_ALL_INITIATIVES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_INITIATIVES_SUCCESS:
            return {
                ...state,
                getAllInitiatives: { success: true, ...action.response }
            };
        case actionType.GET_ALL_INITIATIVES_FAILURE:
            return {
                ...state,
                getAllInitiatives: { success: false, ...action.error }
            };
        case actionType.UPDATE_INITIATIVE_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_INITIATIVE_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_INITIATIVE_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_INITIATIVE_EXPORT_SUCCESS:
            return {
                ...state,
                initiativeExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_INITIATIVE_EXPORT_FAILURE:
            return {
                ...state,
                initiativeExportResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_PROJECT_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_PROJECT_DROPDOWN_SUCCESS:
            return {
                ...state,
                getAllProjectsDropdown: { success: true, ...action.response }
            };
        case actionType.GET_ALL_PROJECT_DROPDOWN_FAILURE:
            return {
                ...state,
                getAllProjectsDropdown: { success: false, ...action.error }
            };
        case actionType.ADD_INITIATIVES_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_INITIATIVES_SUCCESS:
            return {
                ...state,
                addInitiatives: { success: true, ...action.response }
            };
        case actionType.ADD_INITIATIVES_FAILURE:
            return {
                ...state,
                addInitiatives: { success: false, ...action.error }
            }; case actionType.UPDATE_INITIATIVES_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_INITIATIVES_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_INITIATIVES_SUCCESS:
            return {
                ...state,
                updateInitiatives: { success: true, ...action.response }
            };
        case actionType.UPDATE_INITIATIVES_FAILURE:
            return {
                ...state,
                updateInitiatives: { success: false, ...action.error }
            };
        case actionType.DELETE_INITIATIVES_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_INITIATIVES_SUCCESS:
            return {
                ...state,
                deleteInitiatives: { success: true, ...action.response }
            };
        case actionType.DELETE_INITIATIVES_FAILURE:
            return {
                ...state,
                deleteInitiatives: { success: false, ...action.error }
            };
        case actionType.GET_INITIATIVE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_INITIATIVE_SUCCESS:
            return {
                ...state,
                getInitiativeById: { success: true, ...action.response }
            };
        case actionType.GET_INITIATIVE_FAILURE:
            return {
                ...state,
                getInitiativeById: { success: false, ...action.error }
            };
        case actionType.GET_INITIATIVE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_INITIATIVE_LOG_SUCCESS:
            return {
                ...state,
                getInitiativeLog: { success: true, ...action.response }
            };
        case actionType.GET_INITIATIVE_LOG_FAILURE:
            return {
                ...state,
                getInitiativeLog: { success: false, ...action.error }
            };
        case actionType.DELETE_INITIATIVE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_INITIATIVE_LOG_SUCCESS:
            return {
                ...state,
                deleteInitiativeLog: { success: true, ...action.response }
            };
        case actionType.DELETE_INITIATIVE_LOG_FAILURE:
            return {
                ...state,
                deleteInitiativeLog: { success: false, ...action.error }
            };
        case actionType.RESTORE_INITIATIVE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_INITIATIVE_LOG_SUCCESS:
            return {
                ...state,
                restoreInitiativeLog: { success: true, ...action.response }
            };
        case actionType.RESTORE_INITIATIVE_LOG_FAILURE:
            return {
                ...state,
                restoreInitiativeLog: { success: false, ...action.error }
            };
        case actionType.ASSIGN_INITIATIVE_REQUEST:
            return {
                ...state
            };
        case actionType.ASSIGN_INITIATIVE_SUCCESS:
            return {
                ...state,
                assignProject: { success: true, ...action.response.data, status: action.response.status }
            };
        case actionType.ASSIGN_INITIATIVE_FAILURE:

            return {
                ...state,
                assignProject: { success: false, ...action.error.data, status: action.error.status }
            };

        case actionType.UN_ASSIGN_INITIATIVE_REQUEST:
            return {
                ...state
            };
        case actionType.UN_ASSIGN_INITIATIVE_SUCCESS:
            return {
                ...state,
                unAssignProject: { success: true, ...action.response }
            };
        case actionType.UN_ASSIGN_INITIATIVE_FAILURE:
            return {
                ...state,
                unAssignProject: { success: false, ...action.error }
            };
        default:
            return state;
    }
}