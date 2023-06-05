import * as actionType from "./constants";

const initialState = {
    addRecommendationTemplateResponse: {},
    updateRecommendationTemplateResponse: {},
    deleteRecommendationTemplateResponse: {},
    getRecommendationTemplateByIdResponse: {},
    getRecommendationTemplatesResponse: {},
    getListForCommonFilterResponse: {},
    getAllRecommendationTemplateLogsResponse: {},
    restoreRecommendationTemplateLogResponse: {},
    deleteRecommendationTemplateLogResponse: {},
    recommendationTemplateExportResponse: {},
    getAssignModalDetailsResponse: {},
    assignItemsResponse: {},
    entityParams: {
        subSysteminfo: {
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
        },
        projectinfo: {
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
    },
   
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_RECOMMENDATION_TEMPLATES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_RECOMMENDATION_TEMPLATES_SUCCESS:
            return {
                ...state,
                getRecommendationTemplatesResponse: { success: true, ...action.response }
            };
        case actionType.GET_RECOMMENDATION_TEMPLATES_FAILURE:
            return {
                ...state,
                getRecommendationTemplatesResponse: { success: false, ...action.error }
            };

        case actionType.ADD_RECOMMENDATION_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_RECOMMENDATION_TEMPLATE_SUCCESS:
            return {
                ...state,
                addRecommendationTemplateResponse: { success: true, ...action.response }
            };
        case actionType.ADD_RECOMMENDATION_TEMPLATE_FAILURE:
            return {
                ...state,
                addRecommendationTemplateResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_RECOMMENDATION_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_RECOMMENDATION_TEMPLATE_SUCCESS:
            return {
                ...state,
                updateRecommendationTemplateResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_RECOMMENDATION_TEMPLATE_FAILURE:
            return {
                ...state,
                updateRecommendationTemplateResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_RECOMMENDATION_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_RECOMMENDATION_TEMPLATE_SUCCESS:
            return {
                ...state,
                deleteRecommendationTemplateResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_RECOMMENDATION_TEMPLATE_FAILURE:
            return {
                ...state,
                deleteRecommendationTemplateResponse: { success: false, ...action.error }
            };
        case actionType.GET_RECOMMENDATION_TEMPLATE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_RECOMMENDATION_TEMPLATE_BY_ID_SUCCESS:
            return {
                ...state,
                getRecommendationTemplateByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_RECOMMENDATION_TEMPLATE_BY_ID_FAILURE:
            return {
                ...state,
                getRecommendationTemplateByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_RECOMMENDATION_TEMPLATE_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...state.entityParams, [action.section]: { ...action.response } }

            };
        case actionType.UPDATE_RECOMMENDATION_TEMPLATE_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...state.entityParams, [action.section]: { ...action.error } }
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
        case actionType.GET_ALL_RECOMMENDATION_TEMPLATE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_RECOMMENDATION_TEMPLATE_LOG_SUCCESS:
            return {
                ...state,
                getAllRecommendationTemplateLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_RECOMMENDATION_TEMPLATE_LOG_FAILURE:
            return {
                ...state,
                getAllRecommendationTemplateLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_RECOMMENDATION_TEMPLATE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_RECOMMENDATION_TEMPLATE_LOG_SUCCESS:
            return {
                ...state,
                restoreRecommendationTemplateLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_RECOMMENDATION_TEMPLATE_LOG_FAILURE:
            return {
                ...state,
                restoreRecommendationTemplateLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_RECOMMENDATION_TEMPLATE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_RECOMMENDATION_TEMPLATE_LOG_SUCCESS:
            return {
                ...state,
                deleteRecommendationTemplateLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_RECOMMENDATION_TEMPLATE_LOG_FAILURE:
            return {
                ...state,
                deleteRecommendationTemplateLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_RECOMMENDATION_TEMPLATE_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_RECOMMENDATION_TEMPLATE_EXPORT_SUCCESS:
            return {
                ...state,
                recommendationTemplateExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_RECOMMENDATION_TEMPLATE_EXPORT_FAILURE:
            return {
                ...state,
                recommendationTemplateExportResponse: { success: false, ...action.error }
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
