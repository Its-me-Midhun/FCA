import * as actionType from "./constants";

const initialState = {
    addChildParagraphResponse: {},
    updateChildParagraphResponse: {},
    deleteChildParagraphResponse: {},
    getChildParagraphByIdResponse: {},
    getChildParagraphsResponse: {},
    getListForCommonFilterResponse: {},
    getAllChildParagraphLogsResponse: {},
    restoreChildParagraphLogResponse: {},
    deleteChildParagraphLogResponse: {},
    childParagraphExportResponse: {},
    getSpecialReportsDropdownResponse: {},
    getReportParagraphsDropdownResponse: {},
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
        case actionType.GET_CHILD_PARAGRAPHS_BASED_ON_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHILD_PARAGRAPHS_BASED_ON_BUILDING_SUCCESS:
            return {
                ...state,
                getChildParagraphsResponse: { success: true, ...action.response }
            };
        case actionType.GET_CHILD_PARAGRAPHS_BASED_ON_BUILDING_FAILURE:
            return {
                ...state,
                getChildParagraphsResponse: { success: false, ...action.error }
            };

        case actionType.ADD_CHILD_PARAGRAPH_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_CHILD_PARAGRAPH_SUCCESS:
            return {
                ...state,
                addChildParagraphResponse: { success: true, ...action.response }
            };
        case actionType.ADD_CHILD_PARAGRAPH_FAILURE:
            return {
                ...state,
                addChildParagraphResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_CHILD_PARAGRAPH_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_CHILD_PARAGRAPH_SUCCESS:
            return {
                ...state,
                updateChildParagraphResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_CHILD_PARAGRAPH_FAILURE:
            return {
                ...state,
                updateChildParagraphResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_CHILD_PARAGRAPH_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_CHILD_PARAGRAPH_SUCCESS:
            return {
                ...state,
                deleteChildParagraphResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_CHILD_PARAGRAPH_FAILURE:
            return {
                ...state,
                deleteChildParagraphResponse: { success: false, ...action.error }
            };
        case actionType.GET_CHILD_PARAGRAPH_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHILD_PARAGRAPH_BY_ID_SUCCESS:
            return {
                ...state,
                getChildParagraphByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_CHILD_PARAGRAPH_BY_ID_FAILURE:
            return {
                ...state,
                getChildParagraphByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_CHILD_PARAGRAPH_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_CHILD_PARAGRAPH_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ALL_CHILD_PARAGRAPH_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CHILD_PARAGRAPH_LOG_SUCCESS:
            return {
                ...state,
                getAllChildParagraphLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CHILD_PARAGRAPH_LOG_FAILURE:
            return {
                ...state,
                getAllChildParagraphLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_CHILD_PARAGRAPH_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_CHILD_PARAGRAPH_LOG_SUCCESS:
            return {
                ...state,
                restoreChildParagraphLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_CHILD_PARAGRAPH_LOG_FAILURE:
            return {
                ...state,
                restoreChildParagraphLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_CHILD_PARAGRAPH_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_CHILD_PARAGRAPH_LOG_SUCCESS:
            return {
                ...state,
                deleteChildParagraphLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_CHILD_PARAGRAPH_LOG_FAILURE:
            return {
                ...state,
                deleteChildParagraphLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_CHILD_PARAGRAPH_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHILD_PARAGRAPH_EXPORT_SUCCESS:
            return {
                ...state,
                childParagraphExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_CHILD_PARAGRAPH_EXPORT_FAILURE:
            return {
                ...state,
                childParagraphExportResponse: { success: false, ...action.error }
            };

        case actionType.GET_SPECIAL_REPORTS_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SPECIAL_REPORTS_DROPDOWN_SUCCESS:
            return {
                ...state,
                getSpecialReportsDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_SPECIAL_REPORTS_DROPDOWN_FAILURE:
            return {
                ...state,
                getSpecialReportsDropdownResponse: { success: false, ...action.error }
            };

        case actionType.GET_REPORT_PARAGRAPHS_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REPORT_PARAGRAPHS_DROPDOWN_SUCCESS:
            return {
                ...state,
                getReportParagraphsDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_REPORT_PARAGRAPHS_DROPDOWN_FAILURE:
            return {
                ...state,
                getReportParagraphsDropdownResponse: { success: false, ...action.error }
            };

        default:
            return state;
    }
};
