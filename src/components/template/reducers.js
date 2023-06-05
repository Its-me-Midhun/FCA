import * as actionType from "./constants";
const initialState = {
    getAllTemplateList: {},
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
    },
    getListForCommonFilterResponse:{}
}

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_ALL_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_TEMPLATE_SUCCESS:
            return {
                ...state,
                getAllTemplateList: { success: true, ...action.response }
            };
        case actionType.GET_ALL_TEMPLATE_FAILURE:
            return {
                ...state,
                getAllTemplateList: { success: false, ...action.error }
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
        case actionType.UPDATE_TEMPLATE_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_TEMPLATE_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };

        default:
            return state;
    }
}
