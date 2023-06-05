import * as actionType from "./constants";

const initialState = {
    getTemplatesResponse: {},
    addTemplateResponse: {},
    getTemplateByIdResponse: {},
    updateTemplateResponse: {},
    deleteTemplateResponse: {},
    templateExportResponse: {},
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
            template_filter: "active"
        },
        tableConfig: null
    },
    propertyDropdownResponse: {},
    restoreTemplateResponse: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.UPDATE_TRADE_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_TRADE_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        case actionType.GET_TEMPLATES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TEMPLATES_SUCCESS:
            return {
                ...state,
                getTemplatesResponse: { success: true, ...action.response }
            };
        case actionType.GET_TEMPLATES_FAILURE:
            return {
                ...state,
                getTemplatesResponse: { success: false, ...action.error }
            };
        case actionType.ADD_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_TEMPLATE_SUCCESS:
            return {
                ...state,
                addTemplateResponse: { success: true, ...action.response }
            };
        case actionType.ADD_TEMPLATE_FAILURE:
            return {
                ...state,
                addTemplateResponse: { success: false, ...action.error }
            };
        case actionType.GET_TEMPLATE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TEMPLATE_BY_ID_SUCCESS:
            return {
                ...state,
                getTemplateByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_TEMPLATE_BY_ID_FAILURE:
            return {
                ...state,
                getTemplateByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_TEMPLATE_SUCCESS:
            return {
                ...state,
                updateTemplateResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_TEMPLATE_FAILURE:
            return {
                ...state,
                updateTemplateResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_TEMPLATE_SUCCESS:
            return {
                ...state,
                deleteTemplateResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_TEMPLATE_FAILURE:
            return {
                ...state,
                deleteTemplateResponse: { success: false, ...action.error }
            };
        case actionType.EXPORT_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.EXPORT_TEMPLATE_SUCCESS:
            return {
                ...state,
                templateExportResponse: { success: true, ...action.response }
            };
        case actionType.EXPORT_TEMPLATE_FAILURE:
            return {
                ...state,
                templateExportResponse: { success: false, ...action.error }
            };
        case actionType.GET_PROPERTY_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROPERTY_DROPDOWN_SUCCESS:
            return {
                ...state,
                propertyDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_PROPERTY_DROPDOWN_FAILURE:
            return {
                ...state,
                propertyDropdownResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_TEMPLATE_SUCCESS:
            return {
                ...state,
                restoreTemplateResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_TEMPLATE_FAILURE:
            return {
                ...state,
                restoreTemplateResponse: { success: false, ...action.error }
            };

        default:
            return state;
    }
};
