import { initial } from "lodash";
import * as actionType from "./constants";
const initialState = {
    getAllHeadingResponse: {},
    updateHeadingResponse: {},
    headingDataByIdResponse: {},
    headingExportResponse: {},
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
        case actionType.GET_ALL_HEADING_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_HEADING_SUCCESS:
            return {
                ...state,
                getAllHeadingResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_HEADING_FAILURE:
            return {
                ...state,
                getAllHeadingResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_HEADING_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_HEADING_SUCCESS:
            return {
                ...state,
                updateHeadingResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_HEADING_FAILURE:
            return {
                ...state,
                updateHeadingResponse: { success: false, ...action.error }
            };
        case actionType.GET_HEADING_DATA_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_HEADING_DATA_BY_ID_SUCCESS:
            return {
                ...state,
                headingDataByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_HEADING_DATA_BY_ID_FAILURE:
            return {
                ...state,
                headingDataByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_HEADING_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_HEADING_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        case actionType.GET_HEADING_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_HEADING_EXPORT_SUCCESS:
            return {
                ...state,
                headingExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_HEADING_EXPORT_FAILURE:
            return {
                ...state,
                headingExportResponse: { success: false, ...action.error }
            };
        default:
            return state;
    }
};
