import * as actionType from "./constants";

const initialState = {
    addChartsAndGraphsResponse: {},
    updateChartsAndGraphsResponse: {},
    deleteChartsAndGraphsResponse: {},
    getChartsAndGraphsByIdResponse: {},
    getChartsAndGraphsResponse: {},
    getListForCommonFilterResponse: {},
    getAllChartsAndGraphsLogsResponse: {},
    restoreChartsAndGraphsLogResponse: {},
    deleteChartsAndGraphsLogResponse: {},
    chartsAndGraphsExportResponse: {},
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
        case actionType.GET_CHARTS_AND_GRAPHS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHARTS_AND_GRAPHS_SUCCESS:
            return {
                ...state,
                getChartsAndGraphsResponse: { success: true, ...action.response }
            };
        case actionType.GET_CHARTS_AND_GRAPHS_FAILURE:
            return {
                ...state,
                getChartsAndGraphsResponse: { success: false, ...action.error }
            };

        case actionType.ADD_CHARTS_AND_GRAPHS_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_CHARTS_AND_GRAPHS_SUCCESS:
            return {
                ...state,
                addChartsAndGraphsResponse: { success: true, ...action.response }
            };
        case actionType.ADD_CHARTS_AND_GRAPHS_FAILURE:
            return {
                ...state,
                addChartsAndGraphsResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_CHARTS_AND_GRAPHS_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_CHARTS_AND_GRAPHS_SUCCESS:
            return {
                ...state,
                updateChartsAndGraphsResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_CHARTS_AND_GRAPHS_FAILURE:
            return {
                ...state,
                updateChartsAndGraphsResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_CHARTS_AND_GRAPHS_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_CHARTS_AND_GRAPHS_SUCCESS:
            return {
                ...state,
                deleteChartsAndGraphsResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_CHARTS_AND_GRAPHS_FAILURE:
            return {
                ...state,
                deleteChartsAndGraphsResponse: { success: false, ...action.error }
            };
        case actionType.GET_CHARTS_AND_GRAPHS_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHARTS_AND_GRAPHS_BY_ID_SUCCESS:
            return {
                ...state,
                getChartsAndGraphsByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_CHARTS_AND_GRAPHS_BY_ID_FAILURE:
            return {
                ...state,
                getChartsAndGraphsByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_CHARTS_AND_GRAPHS_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_CHARTS_AND_GRAPHS_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ALL_CHARTS_AND_GRAPHS_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CHARTS_AND_GRAPHS_LOG_SUCCESS:
            return {
                ...state,
                getAllChartsAndGraphsLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CHARTS_AND_GRAPHS_LOG_FAILURE:
            return {
                ...state,
                getAllChartsAndGraphsLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_CHARTS_AND_GRAPHS_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_CHARTS_AND_GRAPHS_LOG_SUCCESS:
            return {
                ...state,
                restoreChartsAndGraphsLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_CHARTS_AND_GRAPHS_LOG_FAILURE:
            return {
                ...state,
                restoreChartsAndGraphsLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_CHARTS_AND_GRAPHS_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_CHARTS_AND_GRAPHS_LOG_SUCCESS:
            return {
                ...state,
                deleteChartsAndGraphsLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_CHARTS_AND_GRAPHS_LOG_FAILURE:
            return {
                ...state,
                deleteChartsAndGraphsLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_CHARTS_AND_GRAPHS_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHARTS_AND_GRAPHS_EXPORT_SUCCESS:
            return {
                ...state,
                chartsAndGraphsExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_CHARTS_AND_GRAPHS_EXPORT_FAILURE:
            return {
                ...state,
                chartsAndGraphsExportResponse: { success: false, ...action.error }
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
