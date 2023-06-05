import * as actionType from "./constants";

const initialState = {
    getPropertyResponse: {},
    addPropertyResponse: {},
    getPropertyByIdResponse: {},
    updatePropertyResponse: {},
    updateSortPropertyResponse:{},
    deletePropertyResponse: {},
    restorePropertyResponse: {},
    getListForCommonFilterResponse: {},
    getPropertyLogsResponse: {},
    restorePropertyLogResponse: {},
    deletePropertyLogResponse: {},
    propertyExportResponse: {},
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
            active: true,
            filterKeys: {},
            template_filter: "active"
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
        selectedDropdown: "active"
    },
    checkIfPropertyMappedResponse: {},
    dropDownList: {
        fonts: [],
        table_styles: []
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.UPDATE_CHART_PROPERTY_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_CHART_PROPERTY_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_CHART_PROPERTIES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_PROPERTIES_SUCCESS:
            return {
                ...state,
                getPropertyResponse: { success: true, ...action.response }
            };
        case actionType.GET_CHART_PROPERTIES_FAILURE:
            return {
                ...state,
                getPropertyResponse: { success: false, ...action.error }
            };
        case actionType.ADD_CHART_PROPERTY_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_CHART_PROPERTY_SUCCESS:
            return {
                ...state,
                addPropertyResponse: { success: true, ...action.response }
            };
        case actionType.ADD_CHART_PROPERTY_FAILURE:
            return {
                ...state,
                addPropertyResponse: { success: false, ...action.error }
            };
        case actionType.GET_CHART_PROPERTY_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_PROPERTY_BY_ID_SUCCESS:
            return {
                ...state,
                getPropertyByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_CHART_PROPERTY_BY_ID_FAILURE:
            return {
                ...state,
                getPropertyByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_CHART_PROPERTY_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_CHART_PROPERTY_SUCCESS:
            return {
                ...state,
                updatePropertyResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_CHART_PROPERTY_FAILURE:
            return {
                ...state,
                updatePropertyResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_CHART_PROPERTY_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_CHART_PROPERTY_SUCCESS:
            return {
                ...state,
                deletePropertyResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_CHART_PROPERTY_FAILURE:
            return {
                ...state,
                deletePropertyResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_CHART_PROPERTY_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_CHART_PROPERTY_SUCCESS:
            return {
                ...state,
                restorePropertyResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_CHART_PROPERTY_FAILURE:
            return {
                ...state,
                restorePropertyResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_CHART_PROPERTY_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CHART_PROPERTY_LOG_SUCCESS:
            return {
                ...state,
                getPropertyLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CHART_PROPERTY_LOG_FAILURE:
            return {
                ...state,
                getPropertyLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_CHART_PROPERTY_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_CHART_PROPERTY_LOG_SUCCESS:
            return {
                ...state,
                restorePropertyLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_CHART_PROPERTY_LOG_FAILURE:
            return {
                ...state,
                restorePropertyLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_CHART_PROPERTY_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_CHART_PROPERTY_LOG_SUCCESS:
            return {
                ...state,
                deletePropertyLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_CHART_PROPERTY_LOG_FAILURE:
            return {
                ...state,
                deletePropertyLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_CHART_PROPERTY_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_PROPERTY_EXPORT_SUCCESS:
            return {
                ...state,
                propertyExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_CHART_PROPERTY_EXPORT_FAILURE:
            return {
                ...state,
                propertyExportResponse: { success: false, ...action.error }
            };
        case actionType.CHECK_CHART_PROPERTY_REQUEST:
            return {
                ...state
            };
        case actionType.CHECK_CHART_PROPERTY_SUCCESS:
            return {
                ...state,
                checkIfPropertyMappedResponse: { success: true, ...action.response }
            };
        case actionType.CHECK_CHART_PROPERTY_FAILURE:
            return {
                ...state,
                checkIfPropertyMappedResponse: { success: false, ...action.error }
            };
        case actionType.GET_CHART_PROPERTY_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_PROPERTY_DROPDOWN_SUCCESS:
            return {
                ...state,
                dropDownList: {
                    ...state.dropDownList,
                    [action.entity]: action.response[action.entity]
                }
            };
        case actionType.GET_CHART_PROPERTY_DROPDOWN_FAILURE:
            return {
                ...state,
                dropDownList: {
                    ...state.dropDownList
                }
            };
            case actionType.UPDATE_CHART_SORT_PROPERTY_REQUEST:
                return {
                    ...state
                };
            case actionType.UPDATE_CHART_SORT_PROPERTY_SUCCESS:
                return {
                    ...state,
                    updateSortPropertyResponse: { success: true, ...action.response }
                };
            case actionType.UPDATE_CHART_SORT_PROPERTY_FAILURE:
                return {
                    ...state,
                    updateSortPropertyResponse: { success: false, ...action.error }
                };

        default:
            return state;
    }
};
