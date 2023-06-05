import * as actionType from "./constants";

const initialState = {
    getNotificationsResponse: {},
    updateClientResponse: {},
    getClientByIdResponse: {},
    getListForCommonFilterResponse: {},
    notificationExportResponse: {},
    getUnreadNotificationsResponse:{},
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
            filterKeys: {},
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
        case actionType.GET_NOTIFICATION_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_NOTIFICATION_DATA_SUCCESS:
            return {
                ...state,
                getNotificationsResponse: { success: true,...action.response }
            };
        case actionType.GET_NOTIFICATION_DATA_FAILURE:
            return {
                ...state,
                getNotificationsResponse: { success: false, ...action.error }
            };
        // case actionType.UPDATE_CLIENT_REQUEST:
        //     return {
        //         ...state
        //     };
        // case actionType.UPDATE_CLIENT_SUCCESS:
        //     return {
        //         ...state,
        //         updateClientResponse: { success: true, ...action.response }
        //     };
        // case actionType.UPDATE_CLIENT_FAILURE:
        //     return {
        //         ...state,
        //         updateClientResponse: { success: false, ...action.error }
        //     };
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

        case actionType.UPDATE_NOTIFICATION_DATA_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_NOTIFICATION_DATA_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_NOTIFICATION_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_NOTIFICATION_EXPORT_SUCCESS:
            return {
                ...state,
                notificationExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_NOTIFICATION_EXPORT_FAILURE:
            return {
                ...state,
                notificationExportResponse: { success: false, ...action.error }
            };
        case actionType.GET_UNREAD_NOTIFICATION_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_UNREAD_NOTIFICATION_DATA_SUCCESS:
            return {
                ...state,
                getUnreadNotificationsResponse: { success: true,...action.response }
            };
        case actionType.GET_UNREAD_NOTIFICATION_DATA_FAILURE:
            return {
                ...state,
                getUnreadNotificationsResponse: { success: false, ...action.error }
            };
        default:
            return state;
    }
};
