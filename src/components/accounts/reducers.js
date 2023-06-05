import * as actionType from "./constants";

const initialState = {
    addAccountResponse: {},
    updateAccountResponse: {},
    deleteAccountResponse: {},
    getAccountByIdResponse: {},
    getAccountsResponse: {},
    getListForCommonFilterResponse: {},
    getAllAccountLogsResponse: {},
    restoreAccountLogResponse: {},
    deleteAccountLogResponse: {},
    AccountExportResponse: {},
    getAssignModalDetailsResponse: {},
    assignItemsResponse: {},
    entityParams: {
        entity: null,
        selectedEntity: null,
        selectedRowId: null,
        paginationParams: {
            totalPages: 0,
            perPage: 40,
            currentPage: 0,
            totalCount: 0
        },
        params: {
            limit: 40,
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
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_ACCOUNTS_BASED_ON_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ACCOUNTS_BASED_ON_BUILDING_SUCCESS:
            return {
                ...state,
                getAccountsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ACCOUNTS_BASED_ON_BUILDING_FAILURE:
            return {
                ...state,
                getAccountsResponse: { success: false, ...action.error }
            };

        case actionType.ADD_ACCOUNT_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_ACCOUNT_SUCCESS:
            return {
                ...state,
                addAccountResponse: { success: true, ...action.response }
            };
        case actionType.ADD_ACCOUNT_FAILURE:
            return {
                ...state,
                addAccountResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_ACCOUNT_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_ACCOUNT_SUCCESS:
            return {
                ...state,
                updateAccountResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_ACCOUNT_FAILURE:
            return {
                ...state,
                updateAccountResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_ACCOUNT_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_ACCOUNT_SUCCESS:
            return {
                ...state,
                deleteAccountResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_ACCOUNT_FAILURE:
            return {
                ...state,
                deleteAccountResponse: { success: false, ...action.error }
            };
        case actionType.GET_ACCOUNT_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ACCOUNT_BY_ID_SUCCESS:
            return {
                ...state,
                getAccountByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_ACCOUNT_BY_ID_FAILURE:
            return {
                ...state,
                getAccountByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_ACCOUNT_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_ACCOUNT_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ALL_ACCOUNT_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_ACCOUNT_LOG_SUCCESS:
            return {
                ...state,
                getAllAccountLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_ACCOUNT_LOG_FAILURE:
            return {
                ...state,
                getAllAccountLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_ACCOUNT_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_ACCOUNT_LOG_SUCCESS:
            return {
                ...state,
                restoreAccountLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_ACCOUNT_LOG_FAILURE:
            return {
                ...state,
                restoreAccountLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_ACCOUNT_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_ACCOUNT_LOG_SUCCESS:
            return {
                ...state,
                deleteAccountLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_ACCOUNT_LOG_FAILURE:
            return {
                ...state,
                deleteAccountLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_ACCOUNT_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ACCOUNT_EXPORT_SUCCESS:
            return {
                ...state,
                accountExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_ACCOUNT_EXPORT_FAILURE:
            return {
                ...state,
                accountExportResponse: { success: false, ...action.error }
            };

        case actionType.GET_ASSIGN_MODAL_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ASSIGN_MODAL_DETAILS_SUCCESS:
            return {
                ...state,
                getAssignModalDetailsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ASSIGN_MODAL_DETAILS_FAILURE:
            return {
                ...state,
                getAssignModalDetailsResponse: { success: false, ...action.error }
            };

        case actionType.ASSIGN_ITEMS_REQUEST:
            return {
                ...state
            };
        case actionType.ASSIGN_ITEMS_SUCCESS:
            return {
                ...state,
                assignItemsResponse: { success: true, ...action.response }
            };
        case actionType.ASSIGN_ITEMS_FAILURE:
            return {
                ...state,
                assignItemsResponse: { success: false, ...action.error }
            };

        default:
            return state;
    }
};
