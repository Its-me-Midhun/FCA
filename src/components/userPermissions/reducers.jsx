import * as actionType from "./constants";
const initialState = {
    getAllPermissions: {},
    getListForCommonFilterResponse: {},
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
        }
    },
    getAllTemplate: {},
    getDetailsTemplate: {},
    getPermissions: {},
    getPermissionById: {},
    permissionExportResponse: {},
    consultancyUser: {},
    getTemplateInitialValuesResponse: {},
    getUserListForPermissionsResponse: {},
    getUserPermissionsById: {},
    addUserPermissionsData: {},
    editUserPermissionsById: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_ALL_PERMISSION_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_PERMISSION_SUCCESS:
            return {
                ...state,
                getAllPermissions: { success: true, ...action.response }
            };
        case actionType.GET_ALL_PERMISSION_FAILURE:
            return {
                ...state,
                getAllPermissions: { success: false, ...action.error }
            };
        case actionType.UPDATE_USER_PERMISSION_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_USER_PERMISSION_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TEMPLATE_SUCCESS:
            return {
                ...state,
                getAllTemplate: { success: true, ...action.response }
            };
        case actionType.GET_TEMPLATE_FAILURE:
            return {
                ...state,
                getAllTemplate: { success: false, ...action.error }
            };

        case actionType.GET_BY_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_BY_TEMPLATE_SUCCESS:
            return {
                ...state,
                getDetailsTemplate: { success: true, ...action.response }
            };
        case actionType.GET_BY_TEMPLATE_FAILURE:
            return {
                ...state,
                getDetailsTemplate: { success: false, ...action.error }
            };

        case actionType.GET_PERMISSION_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PERMISSION_SUCCESS:
            return {
                ...state,
                getPermissions: { success: true, ...action.response }
            };
        case actionType.GET_PERMISSION_FAILURE:
            return {
                ...state,
                getPermissions: { success: false, ...action.error }
            };
        case actionType.GET_PERMISSION_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PERMISSION_BY_ID_SUCCESS:
            return {
                ...state,
                getPermissionById: { success: true, ...action.response }
            };
        case actionType.GET_PERMISSION_BY_ID_FAILURE:
            return {
                ...state,
                getPermissionById: { success: false, ...action.error }
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

        case actionType.CREATE_PERMISSION_REQUEST:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        case actionType.CREATE_PERMISSION_SUCCESS:
            return {
                ...state,
                createPermissions: { success: true, ...action.response }
            };
        case actionType.CREATE_PERMISSION_FAILURE:
            return {
                ...state,
                createPermissions: { success: true, ...action.response }
            };
        case actionType.GET_PERMISSION_EXPORT_SUCCESS:
            return {
                ...state,
                permissionExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_PERMISSION_EXPORT_FAILURE:
            return {
                ...state,
                permissionExportResponse: { success: false, ...action.error }
            };
        case actionType.GET_CONSULTANCY_USER_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CONSULTANCY_USER_SUCCESS:
            return {
                ...state,
                consultancyUser: { success: true, ...action.response }
            };
        case actionType.GET_CONSULTANCY_USER_FAILURE:
            return {
                ...state,
                consultancyUser: { success: false, ...action.error }
            };
        case actionType.GET_TEMPLATE_INITIAL_VALUES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TEMPLATE_INITIAL_VALUES_SUCCESS:
            return {
                ...state,
                getTemplateInitialValuesResponse: { success: true, ...action.response }
            };
        case actionType.GET_TEMPLATE_INITIAL_VALUES_FAILURE:
            return {
                ...state,
                getTemplateInitialValuesResponse: { success: false, ...action.error }
            };
        case actionType.GET_USER_LIST_FOR_PERMISSIONS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_USER_LIST_FOR_PERMISSIONS_SUCCESS:
            return {
                ...state,
                getUserListForPermissionsResponse: { success: true, ...action.response }
            };
        case actionType.GET_USER_LIST_FOR_PERMISSIONS_FAILURE:
            return {
                ...state,
                getUserListForPermissionsResponse: { success: false, ...action.error }
            };
        case actionType.GET_USER_PERMISSIONS_BYID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_USER_PERMISSIONS_BYID_SUCCESS:
            return {
                ...state,
                getUserPermissionsById: { success: true, ...action.response }
            };
        case actionType.GET_USER_PERMISSIONS_BYID_FAILURE:
            return {
                ...state,
                getUserPermissionsById: { success: false, ...action.error }
            };
        case actionType.ADD_USER_PERMISSIONS_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_USER_PERMISSIONS_SUCCESS:
            return {
                ...state,
                addUserPermissionsData: { success: true, ...action.response }
            };
        case actionType.ADD_USER_PERMISSIONS_FAILURE:
            return {
                ...state,
                addUserPermissionsData: { success: false, ...action.error }
            };
        case actionType.EDIT_USER_PERMISSIONS_BYID_REQUEST:
            return {
                ...state
            };
        case actionType.EDIT_USER_PERMISSIONS_BYID_SUCCESS:
            return {
                ...state,
                editUserPermissionsById: { success: true, ...action.response }
            };
        case actionType.EDIT_USER_PERMISSIONS_BYID_FAILURE:
            return {
                ...state,
                editUserPermissionsById: { success: false, ...action.error }
            };

        default:
            return state;
    }
};
