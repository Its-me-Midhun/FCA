import * as actionType from "./constants";

const initialState = {
    addNarrativeTemplateResponse: {},
    updateNarrativeTemplateResponse: {},
    deleteNarrativeTemplateResponse: {},
    getNarrativeTemplateByIdResponse: {},
    getNarrativeTemplatesResponse: {},
    getListForCommonFilterResponse: {},
    getAllNarrativeTemplateLogsResponse: {},
    restoreNarrativeTemplateLogResponse: {},
    deleteNarrativeTemplateLogResponse: {},
    narrativeTemplateExportResponse: {},
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
        case actionType.GET_NARRATIVE_TEMPLATES_BASED_ON_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.GET_NARRATIVE_TEMPLATES_BASED_ON_BUILDING_SUCCESS:
            return {
                ...state,
                getNarrativeTemplatesResponse: { success: true, ...action.response }
            };
        case actionType.GET_NARRATIVE_TEMPLATES_BASED_ON_BUILDING_FAILURE:
            return {
                ...state,
                getNarrativeTemplatesResponse: { success: false, ...action.error }
            };

        case actionType.ADD_NARRATIVE_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_NARRATIVE_TEMPLATE_SUCCESS:
            return {
                ...state,
                addNarrativeTemplateResponse: { success: true, ...action.response }
            };
        case actionType.ADD_NARRATIVE_TEMPLATE_FAILURE:
            return {
                ...state,
                addNarrativeTemplateResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_NARRATIVE_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_NARRATIVE_TEMPLATE_SUCCESS:
            return {
                ...state,
                updateNarrativeTemplateResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_NARRATIVE_TEMPLATE_FAILURE:
            return {
                ...state,
                updateNarrativeTemplateResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_NARRATIVE_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_NARRATIVE_TEMPLATE_SUCCESS:
            return {
                ...state,
                deleteNarrativeTemplateResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_NARRATIVE_TEMPLATE_FAILURE:
            return {
                ...state,
                deleteNarrativeTemplateResponse: { success: false, ...action.error }
            };
        case actionType.GET_NARRATIVE_TEMPLATE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_NARRATIVE_TEMPLATE_BY_ID_SUCCESS:
            return {
                ...state,
                getNarrativeTemplateByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_NARRATIVE_TEMPLATE_BY_ID_FAILURE:
            return {
                ...state,
                getNarrativeTemplateByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_NARRATIVE_TEMPLATE_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_NARRATIVE_TEMPLATE_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ALL_NARRATIVE_TEMPLATE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_NARRATIVE_TEMPLATE_LOG_SUCCESS:
            return {
                ...state,
                getAllNarrativeTemplateLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_NARRATIVE_TEMPLATE_LOG_FAILURE:
            return {
                ...state,
                getAllNarrativeTemplateLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_NARRATIVE_TEMPLATE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_NARRATIVE_TEMPLATE_LOG_SUCCESS:
            return {
                ...state,
                restoreNarrativeTemplateLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_NARRATIVE_TEMPLATE_LOG_FAILURE:
            return {
                ...state,
                restoreNarrativeTemplateLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_NARRATIVE_TEMPLATE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_NARRATIVE_TEMPLATE_LOG_SUCCESS:
            return {
                ...state,
                deleteNarrativeTemplateLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_NARRATIVE_TEMPLATE_LOG_FAILURE:
            return {
                ...state,
                deleteNarrativeTemplateLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_NARRATIVE_TEMPLATE_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_NARRATIVE_TEMPLATE_EXPORT_SUCCESS:
            return {
                ...state,
                narrativeTemplateExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_NARRATIVE_TEMPLATE_EXPORT_FAILURE:
            return {
                ...state,
                narrativeTemplateExportResponse: { success: false, ...action.error }
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
