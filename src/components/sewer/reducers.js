import * as actionType from "./constants";

const initialState = {
    getMeterListResponse: {},
    getClientListResponse: {},
    getRegionListResponse: {},
    getSiteListResponse: {},
    getBuildingListResponse: {},
    getAccountsListResponse: {},
    addMeterTemplateResponse: {},
    getMeterTemplateByIdResponse: {},
    updateMeterTemplateResponse: {},
    deleteMeterTemplateResponse: {},
    getAllMeterReadingsResponse: {},
    getListForCommonFilterResponse: {},
    getSiteByIdResponse: {},
    getBuildingByIdResponse: {},
    getAllNarrativeTemplateLogsResponse: {},
    restoreNarrativeTemplateLogResponse: {},
    deleteNarrativeTemplateLogResponse: {},
    narrativeTemplateExportResponse: {},
    // getAssignModalDetailsResponse: {},
    // assignItemsResponse: {},
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
            limit: 40
            // offset: 0,
            // search: "",
            // filters: null,
            // list: null
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
        // Gen List
        case actionType.GET_METER_LIST_REQUEST:
            return {
                ...state
            };
        case actionType.GET_METER_LIST_SUCCESS:
            return {
                ...state,
                getMeterListResponse: { success: true, ...action.response }
            };
        case actionType.GET_METER_LIST_FAILURE:
            return {
                ...state,
                getMeterListResponse: { success: false, ...action.error }
            };

        // CLient List
        case actionType.GET_METER_CLIENTS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_METER_CLIENTS_SUCCESS:
            return {
                ...state,
                getClientListResponse: { success: true, ...action.response }
            };
        case actionType.GET_METER_CLIENTS_FAILURE:
            return {
                ...state,
                getClientListResponse: { success: false, ...action.error }
            };

        // Region List
        case actionType.GET_METER_REGION_REQUEST:
            return {
                ...state
            };
        case actionType.GET_METER_REGION_SUCCESS:
            return {
                ...state,
                getRegionListResponse: { success: true, ...action.response }
            };
        case actionType.GET_METER_REGION_FAILURE:
            return {
                ...state,
                getRegionListResponse: { success: false, ...action.error }
            };

        // Site List
        case actionType.GET_METER_SITE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_METER_SITE_SUCCESS:
            return {
                ...state,
                getSiteListResponse: { success: true, ...action.response }
            };
        case actionType.GET_METER_SITE_FAILURE:
            return {
                ...state,
                getSiteListResponse: { success: false, ...action.error }
            };

        // Building List
        case actionType.GET_METER_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.GET_METER_BUILDING_SUCCESS:
            return {
                ...state,
                getBuildingListResponse: { success: true, ...action.response }
            };
        case actionType.GET_METER_BUILDING_FAILURE:
            return {
                ...state,
                getBuildingListResponse: { success: false, ...action.error }
            };

        // Account List
        case actionType.GET_METER_ACCOUNTS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_METER_ACCOUNTS_SUCCESS:
            return {
                ...state,
                getAccountsListResponse: { success: true, ...action.response }
            };
        case actionType.GET_METER_ACCOUNTS_FAILURE:
            return {
                ...state,
                getAccountsListResponse: { success: false, ...action.error }
            };
        // Add Meter
        case actionType.ADD_METER_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_METER_TEMPLATE_SUCCESS:
            return {
                ...state,
                addMeterTemplateResponse: { success: true, ...action.response }
            };
        case actionType.ADD_METER_TEMPLATE_FAILURE:
            return {
                ...state,
                addMeterTemplateResponse: { success: false, ...action.error }
            };

        // Get by Id
        case actionType.GET_METER_TEMPLATE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_METER_TEMPLATE_BY_ID_SUCCESS:
            return {
                ...state,
                getMeterTemplateByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_METER_TEMPLATE_BY_ID_FAILURE:
            return {
                ...state,
                getMeterTemplateByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_METER_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_METER_TEMPLATE_SUCCESS:
            return {
                ...state,
                updateMeterTemplateResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_METER_TEMPLATE_FAILURE:
            return {
                ...state,
                updateMeterTemplateResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_METER_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_METER_TEMPLATE_SUCCESS:
            return {
                ...state,
                deleteMeterTemplateResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_METER_TEMPLATE_FAILURE:
            return {
                ...state,
                deleteMeterTemplateResponse: { success: false, ...action.error }
            };
        // All meter readings
        case actionType.GET_ALL_METER_READINGS_ELECTRIC_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_METER_READINGS_ELECTRIC_SUCCESS:
            return {
                ...state,
                getAllMeterReadingsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_METER_READINGS_ELECTRIC_FAILURE:
            return {
                ...state,
                getAllMeterReadingsResponse: { success: false, ...action.error }
            };
        // Common filter
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

        // Get site Id
        case actionType.GET_SITE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SITE_BY_ID_SUCCESS:
            return {
                ...state,
                getSiteByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_SITE_BY_ID_FAILURE:
            return {
                ...state,
                getSiteByIdResponse: { success: false, ...action.error }
            };

        // Get Building Id
        case actionType.GET_BUILDING_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_BUILDING_BY_ID_SUCCESS:
            return {
                ...state,
                getBuildingByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_BUILDING_BY_ID_FAILURE:
            return {
                ...state,
                getBuildingByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_NARRATIVE_TEMPLATE_ENTITY_PARAMS_SUCCESS_SEWER:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_NARRATIVE_TEMPLATE_ENTITY_PARAMS_FAILURE_SEWER:
            return {
                ...state,
                entityParams: { ...action.error }
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

        // case actionType.GET_ASSIGN_MODAL_DETAILS_REQUEST:
        //     return {
        //         ...state
        //     };
        // case actionType.GET_ASSIGN_MODAL_DETAILS_SUCCESS:
        //     return {
        //         ...state,
        //         getAssignModalDetailsResponse: { success: true, ...action.response }
        //     };
        // case actionType.GET_ASSIGN_MODAL_DETAILS_FAILURE:
        //     return {
        //         ...state,
        //         getAssignModalDetailsResponse: { success: false, ...action.error }
        //     };

        // case actionType.ASSIGN_ITEMS_REQUEST:
        //     return {
        //         ...state
        //     };
        // case actionType.ASSIGN_ITEMS_SUCCESS:
        //     return {
        //         ...state,
        //         assignItemsResponse: { success: true, ...action.response }
        //     };
        // case actionType.ASSIGN_ITEMS_FAILURE:
        //     return {
        //         ...state,
        //         assignItemsResponse: { success: false, ...action.error }
        //     };

        default:
            return state;
    }
};
