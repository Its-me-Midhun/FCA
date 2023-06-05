import * as actionType from "./constants";

const initialState = {
    getAllReports: {},
    getAllDocumentssResponse: {},
    addDocumentsResponse: {},
    updateDocumentsResponse: {},
    deleteDocumentsResponse: {},
    getDocumentsByIdResponse: {},
    getDocumentssBasedOnBuildingResponse: {},
    getAllConsultancyUsersResponse: {},
    getListForCommonFilterResponse: {},
    getAllDocumentsLogsResponse: {},
    restoreDocumentsLogResponse: {},
    deleteDocumentsLogResponse: {},
    documentExportResponse: {},
    getAllRegionDropdownDocument: {},
    getSitesByRegionResponse: {},
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
            order: null
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
        recommendationDropdown: {},
        initiativeDropdown: {},
        masterFilters: {
            client_ids: []
        }
    },
    masterFilterList: {}
};
export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_REPORTS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REPORTS_SUCCESS:
            return {
                ...state,
                getAllReports: { ...action.response }
            };
        case actionType.GET_REPORTS_FAILURE:
            return {
                ...state,
                getAllReports: { ...action.error }
            };
        case actionType.UPDATE_REPORT_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_REPORT_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        case actionType.ADD_REPORTS_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_REPORTS_SUCCESS:
            return {
                ...state,
                addDocumentsResponse: { success: true, ...action.response }
            };
        case actionType.ADD_REPORTS_FAILURE:
            return {
                ...state,
                addDocumentsResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_REPORTS_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_REPORTS_SUCCESS:
            return {
                ...state,
                updateDocumentsResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_REPORTS_FAILURE:
            return {
                ...state,
                updateDocumentsResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_REPORTS_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_REPORTS_SUCCESS:
            return {
                ...state,
                deleteDocumentsResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_REPORTS_FAILURE:
            return {
                ...state,
                deleteDocumentsResponse: { success: false, ...action.error }
            };
        case actionType.GET_REPORTS_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REPORTS_BY_ID_SUCCESS:
            return {
                ...state,
                getDocumentsByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_REPORTS_BY_ID_FAILURE:
            return {
                ...state,
                getDocumentsByIdResponse: { success: false, ...action.error }
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
        case actionType.GET_ALL_REPORTS_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_REPORTS_LOG_SUCCESS:
            return {
                ...state,
                getAllDocumentsLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_REPORTS_LOG_FAILURE:
            return {
                ...state,
                getAllDocumentsLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_REPORTS_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_REPORTS_LOG_SUCCESS:
            return {
                ...state,
                restoreDocumentsLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_REPORTS_LOG_FAILURE:
            return {
                ...state,
                restoreDocumentsLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_REPORTS_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_REPORTS_LOG_SUCCESS:
            return {
                ...state,
                deleteDocumentsLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_REPORTS_LOG_FAILURE:
            return {
                ...state,
                deleteDocumentsLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_REPORTS_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REPORTS_EXPORT_SUCCESS:
            return {
                ...state,
                documentExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_REPORTS_EXPORT_FAILURE:
            return {
                ...state,
                documentExportResponse: { success: false, ...action.error }
            };
        case actionType.GET_INITIATIVE_DROP_DOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_INITIATIVE_DROP_DOWN_SUCCESS:
            return {
                ...state,
                initiativeDropdown: { success: true, ...action.response }
            };
        case actionType.GET_INITIATIVE_DROP_DOWN_FAILURE:
            return {
                ...state,
                initiativeDropdown: { success: false, ...action.error }
            };
        case actionType.GET_RECOMMENDATION_DROP_DOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_RECOMMENDATION_DROP_DOWN_SUCCESS:
            return {
                ...state,
                recommendationDropdown: { success: true, ...action.response }
            };
        case actionType.GET_RECOMMENDATION_DROP_DOWN_FAILURE:
            return {
                ...state,
                recommendationDropdown: { success: false, ...action.error }
            };
        case actionType.GET_ALL_REGION_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_REGION_DROPDOWN_SUCCESS:
            return {
                ...state,
                getAllRegionDropdownDocument: { success: true, ...action.response }
            };
        case actionType.GET_ALL_REGION_DROPDOWN_FAILURE:
            return {
                ...state,
                getAllRegionDropdownDocument: { success: false, ...action.error }
            };

        case actionType.GET_ALL_DOCUMENTS_TYPE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_DOCUMENTS_TYPE_SUCCESS:
            return {
                ...state,
                getAllDocumentResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_DOCUMENTS_TYPE_FAILURE:
            return {
                ...state,
                getAllDocumentResponse: { success: false, ...action.error }
            };
        case actionType.GET_SITES_BY_REGION_IN_DOCUMENTS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SITES_BY_REGION_IN_DOCUMENTS_SUCCESS:
            return {
                ...state,
                getSitesByRegionResponse: { success: true, ...action.response }
            };
        case actionType.GET_SITES_BY_REGION_IN_DOCUMENTS_FAILURE:
            return {
                ...state,
                getSitesByRegionResponse: { success: false, ...action.error }
            };
        case actionType.GET_DOCUMENT_MASTER_FILTER_LISTS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DOCUMENT_MASTER_FILTER_LISTS_SUCCESS:
            const defaultClient = action.response?.default_client || state.defaultClient;
            return {
                ...state,
                masterFilterList: { ...state.masterFilterList, [action.filterKey]: [...action.response[action.filterKey]], defaultClient }
            };
        case actionType.GET_DOCUMENT_MASTER_FILTER_LISTS_FAILURE:
            return {
                ...state,
                masterFilterList: { success: false, ...action.error }
            };
        default:
            return state;
    }
};
