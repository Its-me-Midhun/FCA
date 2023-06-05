import * as actionType from "./constants";

const initialState = {
    addReportNoteTemplateResponse: {},
    updateReportNoteTemplateResponse: {},
    deleteReportNoteTemplateResponse: {},
    getReportNoteTemplateByIdResponse: {},
    getReportNoteTemplatesResponse: {},
    getListForCommonFilterResponse: {},
    getAllReportNoteTemplateLogsResponse: {},
    restoreReportNoteTemplateLogResponse: {},
    deleteReportNoteTemplateLogResponse: {},
    reportNoteTemplateExportResponse: {},
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
        case actionType.GET_REPORT_NOTE_TEMPLATES_BASED_ON_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REPORT_NOTE_TEMPLATES_BASED_ON_BUILDING_SUCCESS:
            return {
                ...state,
                getReportNoteTemplatesResponse: { success: true, ...action.response }
            };
        case actionType.GET_REPORT_NOTE_TEMPLATES_BASED_ON_BUILDING_FAILURE:
            return {
                ...state,
                getReportNoteTemplatesResponse: { success: false, ...action.error }
            };

        case actionType.ADD_REPORT_NOTE_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_REPORT_NOTE_TEMPLATE_SUCCESS:
            return {
                ...state,
                addReportNoteTemplateResponse: { success: true, ...action.response }
            };
        case actionType.ADD_REPORT_NOTE_TEMPLATE_FAILURE:
            return {
                ...state,
                addReportNoteTemplateResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_REPORT_NOTE_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_REPORT_NOTE_TEMPLATE_SUCCESS:
            return {
                ...state,
                updateReportNoteTemplateResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_REPORT_NOTE_TEMPLATE_FAILURE:
            return {
                ...state,
                updateReportNoteTemplateResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_REPORT_NOTE_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_REPORT_NOTE_TEMPLATE_SUCCESS:
            return {
                ...state,
                deleteReportNoteTemplateResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_REPORT_NOTE_TEMPLATE_FAILURE:
            return {
                ...state,
                deleteReportNoteTemplateResponse: { success: false, ...action.error }
            };
        case actionType.GET_REPORT_NOTE_TEMPLATE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REPORT_NOTE_TEMPLATE_BY_ID_SUCCESS:
            return {
                ...state,
                getReportNoteTemplateByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_REPORT_NOTE_TEMPLATE_BY_ID_FAILURE:
            return {
                ...state,
                getReportNoteTemplateByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_REPORT_NOTE_TEMPLATE_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_REPORT_NOTE_TEMPLATE_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ALL_REPORT_NOTE_TEMPLATE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_REPORT_NOTE_TEMPLATE_LOG_SUCCESS:
            return {
                ...state,
                getAllReportNoteTemplateLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_REPORT_NOTE_TEMPLATE_LOG_FAILURE:
            return {
                ...state,
                getAllReportNoteTemplateLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_REPORT_NOTE_TEMPLATE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_REPORT_NOTE_TEMPLATE_LOG_SUCCESS:
            return {
                ...state,
                restoreReportNoteTemplateLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_REPORT_NOTE_TEMPLATE_LOG_FAILURE:
            return {
                ...state,
                restoreReportNoteTemplateLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_REPORT_NOTE_TEMPLATE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_REPORT_NOTE_TEMPLATE_LOG_SUCCESS:
            return {
                ...state,
                deleteReportNoteTemplateLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_REPORT_NOTE_TEMPLATE_LOG_FAILURE:
            return {
                ...state,
                deleteReportNoteTemplateLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_REPORT_NOTE_TEMPLATE_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REPORT_NOTE_TEMPLATE_EXPORT_SUCCESS:
            return {
                ...state,
                reportNoteTemplateExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_REPORT_NOTE_TEMPLATE_EXPORT_FAILURE:
            return {
                ...state,
                reportNoteTemplateExportResponse: { success: false, ...action.error }
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
