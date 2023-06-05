import * as actionType from "./constants";

const initialState = {
    getUsersResponse: {},
    addUserResponse: {},
    updateUserResponse: {},
    deleteUserResponse: {},
    getUserByIdResponse: {},
    getListForCommonFilterResponse:{},
    getAllUserLogsResponse: {},
    restoreUserLogResponse: {},
    deleteUserLogResponse: {},
    userExportResponse:{},
    getAllProjectsDropdownResponse:{},
    getAllBuildingsDropdownResponse:{},
    getAllRolesDropdownResponse:{},
    getAllGroupsDropdownResponse:{},
    getAllConsultanciesDropdownResponse:{},
    getAllClientDropdownResponse:{},
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
        case actionType.GET_USERS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_USERS_SUCCESS:
            return {
                ...state,
                getUsersResponse: { success: true, ...action.response }
            };
        case actionType.GET_USERS_FAILURE:
            return {
                ...state,
                getUsersResponse: { success: false, ...action.error }
            };

        case actionType.ADD_USER_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_USER_SUCCESS:
            return {
                ...state,
                addUserResponse: { success: true, ...action.response }
            };
        case actionType.ADD_USER_FAILURE:
            return {
                ...state,
                addUserResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_USER_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_USER_SUCCESS:
            return {
                ...state,
                updateUserResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_USER_FAILURE:
            return {
                ...state,
                updateUserResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_USER_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_USER_SUCCESS:
            return {
                ...state,
                deleteUserResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_USER_FAILURE:
            return {
                ...state,
                deleteUserResponse: { success: false, ...action.error }
            };

        case actionType.GET_USER_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_USER_BY_ID_SUCCESS:
            return {
                ...state,
                getUserByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_USER_BY_ID_FAILURE:
            return {
                ...state,
                getUserByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_USER_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_USER_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ALL_USER_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_USER_LOG_SUCCESS:
            return {
                ...state,
                getAllUserLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_USER_LOG_FAILURE:
            return {
                ...state,
                getAllUserLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_USER_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_USER_LOG_SUCCESS:
            return {
                ...state,
                restoreUserLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_USER_LOG_FAILURE:
            return {
                ...state,
                restoreUserLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_USER_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_USER_LOG_SUCCESS:
            return {
                ...state,
                deleteUserLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_USER_LOG_FAILURE:
            return {
                ...state,
                deleteUserLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_USER_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_USER_EXPORT_SUCCESS:
            return {
                ...state,
                userExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_USER_EXPORT_FAILURE:
            return {
                ...state,
                userExportResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_PROJECTS_DROP_DOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_PROJECTS_DROP_DOWN_SUCCESS:
            return {
                ...state,
                getAllProjectsDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_PROJECTS_DROP_DOWN_FAILURE:
            return {
                ...state,
                getAllProjectsDropdownResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_BUILDINGS_DROP_DOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_BUILDINGS_DROP_DOWN_SUCCESS:
            return {
                ...state,
                getAllBuildingsDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_BUILDINGS_DROP_DOWN_FAILURE:
            return {
                ...state,
                getAllBuildingsDropdownResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_ROLES_DROP_DOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_ROLES_DROP_DOWN_SUCCESS:
            return {
                ...state,
                getAllRolesDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_ROLES_DROP_DOWN_FAILURE:
            return {
                ...state,
                getAllRolesDropdownResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_GROUPS_DROP_DOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_GROUPS_DROP_DOWN_SUCCESS:
            return {
                ...state,
                getAllGroupsDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_GROUPS_DROP_DOWN_FAILURE:
            return {
                ...state,
                getAllGroupsDropdownResponse: { success: false, ...action.error }
            };
        case actionType.GET_CONSULTANCIES_BASED_ON_ROLE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CONSULTANCIES_BASED_ON_ROLE_SUCCESS:
            return {
                ...state,
                getAllConsultanciesDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_CONSULTANCIES_BASED_ON_ROLE_FAILURE:
            return {
                ...state,
                getAllConsultanciesDropdownResponse: { success: false, ...action.error }
            };
        case actionType.GET_CLIENTS_BASED_ON_ROLE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CLIENTS_BASED_ON_ROLE_SUCCESS:
            return {
                ...state,
                getAllClientDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_CLIENTS_BASED_ON_ROLE_FAILURE:
            return {
                ...state,
                getAllClientDropdownResponse: { success: false, ...action.error }
            };     

        default:
            return state;
    }
};
