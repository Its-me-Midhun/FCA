import * as actionType from "./constants";

const initialState = {
    addTableTemplateResponse: {},
    updateTableTemplateResponse: {},
    deleteTableTemplateResponse: {},
    getTableTemplateByIdResponse: {},
    getTableTemplatesResponse: {},
    getListForCommonFilterResponse: {},
    getAllTableTemplateLogsResponse: {},
    restoreTableTemplateLogResponse: {},
    deleteTableTemplateLogResponse: {},
    tableTemplateExportResponse: {},
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
        case actionType.GET_TABLE_TEMPLATES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TABLE_TEMPLATES_SUCCESS:
            return {
                ...state,
                getTableTemplatesResponse: { success: true, ...action.response }
            };
        case actionType.GET_TABLE_TEMPLATES_FAILURE:
            return {
                ...state,
                getTableTemplatesResponse: { success: false, ...action.error }
            };

        case actionType.ADD_TABLE_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_TABLE_TEMPLATE_SUCCESS:
            return {
                ...state,
                addTableTemplateResponse: { success: true, ...action.response }
            };
        case actionType.ADD_TABLE_TEMPLATE_FAILURE:
            return {
                ...state,
                addTableTemplateResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_TABLE_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_TABLE_TEMPLATE_SUCCESS:
            return {
                ...state,
                updateTableTemplateResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_TABLE_TEMPLATE_FAILURE:
            return {
                ...state,
                updateTableTemplateResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_TABLE_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_TABLE_TEMPLATE_SUCCESS:
            return {
                ...state,
                deleteTableTemplateResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_TABLE_TEMPLATE_FAILURE:
            return {
                ...state,
                deleteTableTemplateResponse: { success: false, ...action.error }
            };
        case actionType.GET_TABLE_TEMPLATE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TABLE_TEMPLATE_BY_ID_SUCCESS:
            return {
                ...state,
                getTableTemplateByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_TABLE_TEMPLATE_BY_ID_FAILURE:
            return {
                ...state,
                getTableTemplateByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_TABLE_TEMPLATE_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_TABLE_TEMPLATE_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ALL_TABLE_TEMPLATE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_TABLE_TEMPLATE_LOG_SUCCESS:
            return {
                ...state,
                getAllTableTemplateLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_TABLE_TEMPLATE_LOG_FAILURE:
            return {
                ...state,
                getAllTableTemplateLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_TABLE_TEMPLATE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_TABLE_TEMPLATE_LOG_SUCCESS:
            return {
                ...state,
                restoreTableTemplateLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_TABLE_TEMPLATE_LOG_FAILURE:
            return {
                ...state,
                restoreTableTemplateLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_TABLE_TEMPLATE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_TABLE_TEMPLATE_LOG_SUCCESS:
            return {
                ...state,
                deleteTableTemplateLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_TABLE_TEMPLATE_LOG_FAILURE:
            return {
                ...state,
                deleteTableTemplateLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_TABLE_TEMPLATE_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TABLE_TEMPLATE_EXPORT_SUCCESS:
            return {
                ...state,
                tableTemplateExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_TABLE_TEMPLATE_EXPORT_FAILURE:
            return {
                ...state,
                tableTemplateExportResponse: { success: false, ...action.error }
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
