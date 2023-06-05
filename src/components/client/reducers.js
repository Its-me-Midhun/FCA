import * as actionType from "./constants";

const initialState = {
    getClientsResponse: {},
    addClientResponse: {},
    updateClientResponse: {},
    deleteClientResponse: {},
    getClientByIdResponse: {},
    getLandingPageDataResponse: {},
    addLandingPageDataResponse: {},
    updateLandingPageDataResponse: {},
    getListForCommonFilterResponse: {},
    getAllClientLogsResponse: {},
    restoreClientLogResponse: {},
    deleteClientLogResponse: {},
    clientExportResponse: {},
    chartTemplateCopyResponse:{},
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
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_CLIENTS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CLIENTS_SUCCESS:
            return {
                ...state,
                getClientsResponse: { success: true, ...action.response }
            };
        case actionType.GET_CLIENTS_FAILURE:
            return {
                ...state,
                getClientsResponse: { success: false, ...action.error }
            };

        case actionType.ADD_CLIENT_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_CLIENT_SUCCESS:
            return {
                ...state,
                addClientResponse: { success: true, ...action.response }
            };
        case actionType.ADD_CLIENT_FAILURE:
            return {
                ...state,
                addClientResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_CLIENT_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_CLIENT_SUCCESS:
            return {
                ...state,
                updateClientResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_CLIENT_FAILURE:
            return {
                ...state,
                updateClientResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_CLIENT_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_CLIENT_SUCCESS:
            return {
                ...state,
                deleteClientResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_CLIENT_FAILURE:
            return {
                ...state,
                deleteClientResponse: { success: false, ...action.error }
            };

        case actionType.GET_CLIENT_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CLIENT_BY_ID_SUCCESS:
            return {
                ...state,
                getClientByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_CLIENT_BY_ID_FAILURE:
            return {
                ...state,
                getClientByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_CLIENT_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_CLIENT_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ALL_CLIENT_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CLIENT_LOG_SUCCESS:
            return {
                ...state,
                getAllClientLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CLIENT_LOG_FAILURE:
            return {
                ...state,
                getAllClientLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_CLIENT_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_CLIENT_LOG_SUCCESS:
            return {
                ...state,
                restoreClientLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_CLIENT_LOG_FAILURE:
            return {
                ...state,
                restoreClientLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_CLIENT_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_CLIENT_LOG_SUCCESS:
            return {
                ...state,
                deleteClientLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_CLIENT_LOG_FAILURE:
            return {
                ...state,
                deleteClientLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_CLIENT_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CLIENT_EXPORT_SUCCESS:
            return {
                ...state,
                clientExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_CLIENT_EXPORT_FAILURE:
            return {
                ...state,
                clientExportResponse: { success: false, ...action.error }
            };
        case actionType.GET_LANDING_PAGE_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_LANDING_PAGE_DATA_SUCCESS:
            return {
                ...state,
                getLandingPageDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_LANDING_PAGE_DATA_FAILURE:
            return {
                ...state,
                getLandingPageDataResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_LANDING_PAGE_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_LANDING_PAGE_DATA_SUCCESS:
            return {
                ...state,
                updateLandingPageDataResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_LANDING_PAGE_DATA_FAILURE:
            return {
                ...state,
                updateLandingPageDataResponse: { success: false, ...action.error }
            };
        case actionType.ADD_LANDING_PAGE_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_LANDING_PAGE_DATA_SUCCESS:
            return {
                ...state,
                addLandingPageDataResponse: { success: true, ...action.response }
            };
        case actionType.ADD_LANDING_PAGE_DATA_FAILURE:
            return {
                ...state,
                addLandingPageDataResponse: { success: false, ...action.error }
            };
        case actionType.COPY_CHART_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.COPY_CHART_TEMPLATE_SUCCESS:
            return {
                ...state,
                chartTemplateCopyResponse: { success: true, ...action.response }
            };
        case actionType.COPY_CHART_TEMPLATE_FAILURE:
            return {
                ...state,
                chartTemplateCopyResponse: { success: false, ...action.error }
            };

        default:
            return state;
    }
};
