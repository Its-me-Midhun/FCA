import * as actionType from "./constants";
const initialState = {
    getAllLogsResponse: {},
    addLogResponse: {},
    updateLogResponse: {},
    deleteLogResponse: {},
    getAllConsultancyUsersResponse: {},
    getAllClientsResponse: {},
    getLogByIdResponse: {},
    uploadImageResponse: {},
    getAllImagesResponse: {},
    deleteImagesResponse: {},
    updateImageCommentResponse: {},
    getListForCommonFilterResponse: {},
    restoreLogLogResponse: {},
    deleteLogLogResponse: {},
    getProjectsBasedOnClientResponse: {},
    logExportResponse: {},
    getEfciBySiteGraph: {},
    getAllClientUsersResponse: {},
    getAllConsultanciesDropdownResponse: {},
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
            project_id: null,
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
        }
    },
    getEfciByLog: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_ALL_LOGS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_LOGS_SUCCESS:
            return {
                ...state,
                getAllLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_LOGS_FAILURE:
            return {
                ...state,
                getAllLogsResponse: { success: false, ...action.error }
            };

        case actionType.ADD_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_LOG_SUCCESS:
            return {
                ...state,
                addLogResponse: { success: true, ...action.response }
            };
        case actionType.ADD_LOG_FAILURE:
            return {
                ...state,
                addLogResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_LOG_SUCCESS:
            return {
                ...state,
                updateLogResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_LOG_FAILURE:
            return {
                ...state,
                updateLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_LOG_SUCCESS:
            return {
                ...state,
                deleteLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_LOG_FAILURE:
            return {
                ...state,
                deleteLogResponse: { success: false, ...action.error }
            };

        case actionType.GET_ALL_CONSULTANCY_USERS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CONSULTANCY_USERS_SUCCESS:
            return {
                ...state,
                getAllConsultancyUsersResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CONSULTANCY_USERS_FAILURE:
            return {
                ...state,
                getAllConsultancyUsersResponse: { success: false, ...action.error }
            };

        case actionType.GET_ALL_CLIENTS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CLIENTS_SUCCESS:
            return {
                ...state,
                getAllClientsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CLIENTS_FAILURE:
            return {
                ...state,
                getAllClientsResponse: { success: false, ...action.error }
            };

        case actionType.GET_LOG_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_LOG_BY_ID_SUCCESS:
            return {
                ...state,
                getLogByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_LOG_BY_ID_FAILURE:
            return {
                ...state,
                getLogByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPLOAD_IMAGE_REQUEST:
            return {
                ...state
            };
        case actionType.UPLOAD_IMAGE_SUCCESS:
            return {
                ...state,
                uploadImageResponse: { success: true, ...action.response }
            };
        case actionType.UPLOAD_IMAGE_FAILURE:
            return {
                ...state,
                uploadImageResponse: { success: false, ...action.error }
            };

        case actionType.GET_ALL_IMAGES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_IMAGES_SUCCESS:
            return {
                ...state,
                getAllImagesResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_IMAGES_FAILURE:
            return {
                ...state,
                getAllImagesResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_IMAGES_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_IMAGES_SUCCESS:
            return {
                ...state,
                deleteImagesResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_IMAGES_FAILURE:
            return {
                ...state,
                deleteImagesResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_IMAGE_COMMENT_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_IMAGE_COMMENT_SUCCESS:
            return {
                ...state,
                updateImageCommentResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_IMAGE_COMMENT_FAILURE:
            return {
                ...state,
                updateImageCommentResponse: { success: false, ...action.error }
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

        case actionType.UPDATE_LOG_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_LOG_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        case actionType.RESTORE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_LOG_SUCCESS:
            return {
                ...state,
                restoreLogLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_LOG_FAILURE:
            return {
                ...state,
                restoreLogLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_CHART_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_LOG_SUCCESS:
            return {
                ...state,
                graphDetails: { success: true, ...action.response }
            };
        case actionType.GET_CHART_LOG_FAILURE:
            return {
                ...state,
                graphDetails: { success: false, ...action.error }
            };
        case actionType.GET_PROJECTS_BASED_ON_CLIENT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROJECTS_BASED_ON_CLIENT_SUCCESS:
            return {
                ...state,
                getProjectsBasedOnClientResponse: { success: true, ...action.response }
            };
        case actionType.GET_PROJECTS_BASED_ON_CLIENT_FAILURE:
            return {
                ...state,
                getProjectsBasedOnClientResponse: { success: false, ...action.error }
            };
        case actionType.GET_EFCI_BASED_ON_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_EFCI_BASED_ON_LOG_SUCCESS:
            return {
                ...state,
                getEfciByLog: { success: true, ...action.response }
            };
        case actionType.GET_EFCI_BASED_ON_LOG_FAILURE:
            return {
                ...state,
                getEfciByLog: { success: false, ...action.error }
            };
        case actionType.GET_LOG_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_LOG_EXPORT_SUCCESS:
            return {
                ...state,
                logExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_LOG_EXPORT_FAILURE:
            return {
                ...state,
                logExportResponse: { success: false, ...action.error }
            };

        case actionType.GET_CHART_EFCI_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_EFCI_LOG_SUCCESS:
            return {
                ...state,
                getEfciBySiteGraph: { success: true, ...action.response }
            };
        case actionType.GET_CHART_EFCI_LOG_FAILURE:
            return {
                ...state,
                getEfciBySiteGraph: { success: false, ...action.error }
            };
        case actionType.SAVE_EFCI_LOG_FAILURE:
            return {
                ...state,
                saveEfci: { success: false, ...action.error }
            };
        case actionType.SAVE_EFCI_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.LOAD_EFCI_LOG_SUCCESS:
            return {
                ...state,
                loadEfciChart: { success: true, ...action.response }
            };
        case actionType.LOAD_EFCI_LOG_FAILURE:
            return {
                ...state,
                loadEfciChart: { success: false, ...action.error }
            };
        case actionType.GET_ALL_CLIENT_USERS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CLIENT_USERS_SUCCESS:
            return {
                ...state,
                getAllClientUsersResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CLIENT_USERS_FAILURE:
            return {
                ...state,
                getAllClientUsersResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_CONSULTANCIES_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CONSULTANCIES_DROPDOWN_SUCCESS:
            return {
                ...state,
                getAllConsultanciesDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CONSULTANCIES_DROPDOWN_FAILURE:
            return {
                ...state,
                getAllConsultanciesDropdownResponse: { success: false, ...action.error }
            };

        case actionType.HIDE_FUNDING_OPTION_CHART_SUCCESS:
            return {
                ...state,
                hiddenFundingOptionListChart: action.response
            };
        case actionType.HIDE_FUNDING_OPTION_CHART_FAILURE:
            return {
                ...state,
                hiddenFundingOptionListChart: []
            };
        case actionType.HIDE_FUNDING_OPTION_REQUEST:
            return {
                ...state
            };
        case actionType.HIDE_FUNDING_OPTION_SUCCESS:
            return {
                ...state,
                hiddenFundingOptionList: action.response
            };
        case actionType.HIDE_FUNDING_OPTION_FAILURE:
            return {
                ...state,
                hiddenFundingOptionList: []
            };
        default:
            return state;
    }
};
