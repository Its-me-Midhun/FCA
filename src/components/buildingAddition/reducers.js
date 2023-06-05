import * as actionType from "./constants";

const initialState = {
    getAllBuildingsDropdownResponse: {},
    getAllAdditionsResponse: {},
    addAdditionResponse: {},
    updateAdditionResponse: {},
    deleteAdditionResponse: {},
    getAdditionByIdResponse: {},
    getAdditionsBasedOnBuildingResponse: {},
    getAllConsultancyUsersResponse: {},
    getListForCommonFilterResponse: {},
    getAllAdditionLogsResponse: {},
    restoreAdditionLogResponse: {},
    deleteAdditionLogResponse: {},
    additionExportResponse: {},
    getAllClientUsersResponse: {},
    getAllConsultanciesDropdownResponse: {},
    getAllClientsResponse: {},
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
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_ADDITIONS_BASED_ON_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ADDITIONS_BASED_ON_BUILDING_SUCCESS:
            return {
                ...state,
                getAdditionsBasedOnBuildingResponse: { success: true, ...action.response }
            };
        case actionType.GET_ADDITIONS_BASED_ON_BUILDING_FAILURE:
            return {
                ...state,
                getAdditionsBasedOnBuildingResponse: { success: false, ...action.error }
            };

        case actionType.ADD_ADDITION_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_ADDITION_SUCCESS:
            return {
                ...state,
                addAdditionResponse: { success: true, ...action.response }
            };
        case actionType.ADD_ADDITION_FAILURE:
            return {
                ...state,
                addAdditionResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_ADDITION_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_ADDITION_SUCCESS:
            return {
                ...state,
                updateAdditionResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_ADDITION_FAILURE:
            return {
                ...state,
                updateAdditionResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_ADDITION_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_ADDITION_SUCCESS:
            return {
                ...state,
                deleteAdditionResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_ADDITION_FAILURE:
            return {
                ...state,
                deleteAdditionResponse: { success: false, ...action.error }
            };
        case actionType.GET_ADDITION_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ADDITION_BY_ID_SUCCESS:
            return {
                ...state,
                getAdditionByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_ADDITION_BY_ID_FAILURE:
            return {
                ...state,
                getAdditionByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_ADDITION_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_ADDITION_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ALL_ADDITION_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_ADDITION_LOG_SUCCESS:
            return {
                ...state,
                getAllAdditionLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_ADDITION_LOG_FAILURE:
            return {
                ...state,
                getAllAdditionLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_ADDITION_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_ADDITION_LOG_SUCCESS:
            return {
                ...state,
                restoreAdditionLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_ADDITION_LOG_FAILURE:
            return {
                ...state,
                restoreAdditionLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_ADDITION_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_ADDITION_LOG_SUCCESS:
            return {
                ...state,
                deleteAdditionLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_ADDITION_LOG_FAILURE:
            return {
                ...state,
                deleteAdditionLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_ADDITION_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ADDITION_EXPORT_SUCCESS:
            return {
                ...state,
                additionExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_ADDITION_EXPORT_FAILURE:
            return {
                ...state,
                additionExportResponse: { success: false, ...action.error }
            };


        case actionType.GET_ALL_CLIENTS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CLIENTS_SUCCESS:
            return {
                ...state,
                getAllClientsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CLIENTS_FAILURE:
            return {
                ...state,
                getAllClientsResponse: { success: false, ...action.error }
            };

        case actionType.GET_ALL_CLIENT_USERS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CLIENT_USERS_SUCCESS:
            return {
                ...state,
                getAllClientUsersResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CLIENT_USERS_FAILURE:
            return {
                ...state,
                getAllClientUsersResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_CONSULTANCY_USERS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CONSULTANCY_USERS_SUCCESS:
            return {
                ...state,
                getAllConsultancyUsersResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CONSULTANCY_USERS_FAILURE:
            return {
                ...state,
                getAllConsultancyUsersResponse: { success: false, ...action.error }
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
        case actionType.GET_ALL_CONSULTANCIES_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CONSULTANCIES_DROPDOWN_SUCCESS:
            return {
                ...state,
                getAllConsultanciesDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CONSULTANCIES_DROPDOWN_FAILURE:
            return {
                ...state,
                getAllConsultanciesDropdownResponse: { success: false, ...action.error }
            };
        default:
            return state;
    }
};
