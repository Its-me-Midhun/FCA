import * as actionType from "./constants";
const initialState = {
    getAllConsultancyResponse: {},
    addConsultancyResponse: {},
    updateConsultancyResponse: {},
    deleteConsultancyResponse: {},
    getAllConsultancyUsersResponse: {},
    getAllClientsResponse: {},
    getConsultancyByIdResponse: {},
    uploadImageResponse: {},
    getAllImagesResponse: {},
    deleteImagesResponse: {},
    updateImageCommentResponse: {},
    getListForCommonFilterResponse: {},
    getAllConsultancyLogsResponse: {},
    restoreConsultancyLogResponse: {},
    deleteConsultancyLogResponse: {},
    getProjectsBasedOnClientResponse: {},
    consultancyExportResponse: {},
    getEfciBySiteGraph:{},
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
        },
    },
    getEfciByRegion: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_ALL_CONSULTANCY_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CONSULTANCY_SUCCESS:
            return {
                ...state,
                getAllConsultancyResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CONSULTANCY_FAILURE:
            return {
                ...state,
                getAllConsultancyResponse: { success: false, ...action.error }
            };

        case actionType.ADD_CONSULTANCY_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_CONSULTANCY_SUCCESS:
            return {
                ...state,
                addConsultancyResponse: { success: true, ...action.response }
            };
        case actionType.ADD_CONSULTANCY_FAILURE:
            return {
                ...state,
                addConsultancyResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_CONSULTANCY_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_CONSULTANCY_SUCCESS:
            return {
                ...state,
                updateConsultancyResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_CONSULTANCY_FAILURE:
            return {
                ...state,
                updateConsultancyResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_CONSULTANCY_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_CONSULTANCY_SUCCESS:
            return {
                ...state,
                deleteConsultancyResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_CONSULTANCY_FAILURE:
            return {
                ...state,
                deleteConsultancyResponse: { success: false, ...action.error }
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

        case actionType.GET_CONSULTANCY_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CONSULTANCY_BY_ID_SUCCESS:
            return {
                ...state,
                getConsultancyByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_CONSULTANCY_BY_ID_FAILURE:
            return {
                ...state,
                getConsultancyByIdResponse: { success: false, ...action.error }
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

        case actionType.UPDATE_CONSULTANCY_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_CONSULTANCY_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        case actionType.GET_ALL_CONSULTANCY_LOGS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CONSULTANCY_LOGS_SUCCESS:
            return {
                ...state,
                getAllConsultancyLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CONSULTANCY_LOGS_FAILURE:
            return {
                ...state,
                getAllConsultancyLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_CONSULTANCY_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_CONSULTANCY_LOG_SUCCESS:
            return {
                ...state,
                restoreConsultancyLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_CONSULTANCY_LOG_FAILURE:
            return {
                ...state,
                restoreConsultancyLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_CONSULTANCY_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_CONSULTANCY_LOG_SUCCESS:
            return {
                ...state,
                deleteConsultancyLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_CONSULTANCY_LOG_FAILURE:
            return {
                ...state,
                deleteConsultancyLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_CHART_REGION_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_REGION_SUCCESS:

            return {
                ...state,
                graphDetails: { success: true, ...action.response }
            };
        case actionType.GET_CHART_REGION_FAILURE:
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
        case actionType.GET_EFCI_BASED_ON_REGION_REQUEST:
            return {
                ...state
            };
        case actionType.GET_EFCI_BASED_ON_REGION_SUCCESS:
            return {
                ...state,
                getEfciByRegion: { success: true, ...action.response }
            };
        case actionType.GET_EFCI_BASED_ON_REGION_FAILURE:
            return {
                ...state,
                getEfciByRegion: { success: false, ...action.error }
            };
        case actionType.GET_CONSULTANCY_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CONSULTANCY_EXPORT_SUCCESS:
            return {
                ...state,
                consultancyExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_CONSULTANCY_EXPORT_FAILURE:
            return {
                ...state,
                consultancyExportResponse: { success: false, ...action.error }
            };

        case actionType.GET_CHART_EFCI_REGION_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_EFCI_REGION_SUCCESS:
            console.log("this.props.regionReducer.getEfciBySiteGraph",action)

            return {
                ...state,
                getEfciBySiteGraph: { success: true, ...action.response }
            };
        case actionType.GET_CHART_EFCI_REGION_FAILURE:
            return {
                ...state,
                getEfciBySiteGraph: { success: false, ...action.error }
            };
        case actionType.SAVE_EFCI_REGION_FAILURE:
            return {
                ...state,
                saveEfci: { success: false, ...action.error }
            };
        case actionType.SAVE_EFCI_REGION_REQUEST:
            return {
                ...state
            };
        case actionType.LOAD_EFCI_REGION_SUCCESS:
            return {
                ...state,
                loadEfciChart: { success: true, ...action.response }
            };
        case actionType.LOAD_EFCI_REGION_FAILURE:
            return {
                ...state,
                loadEfciChart: { success: false, ...action.error }
            };


        default:
            return state;
    }
};
