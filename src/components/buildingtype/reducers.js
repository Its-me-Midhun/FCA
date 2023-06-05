import * as actionType from "./constants";

const initialState = {
    getAllBuildingTypesResponse: {},
    addBuildingTypeResponse: {},
    parseFcaResponse: {},
    updateBuildingTypeResponse: {},
    deleteBuildingTypeResponse: {},
    getRegionsBasedOnClientResponse: {},
    getAllConsultancyUsersResponse: {},
    getAllClientsResponse: {},
    getBuildingTypeByIdResponse: {},
    uploadImageResponse: {},
    getAllImagesResponse: {},
    deleteImagesResponse: {},
    getListForCommonFilterResponse: {},
    getAllBuildingTypeLogsResponse: {},
    restoreBuildingTypeLogResponse: {},
    deleteBuildingTypeLogResponse: {},
    buildingTypeExportResponse: {},
    getColorCodesBuildingType :{},
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
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_ALL_BUILDING_TYPES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_BUILDING_TYPES_SUCCESS:
            return {
                ...state,
                getAllBuildingTypesResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_BUILDING_TYPES_FAILURE:
            return {
                ...state,
                getAllBuildingTypesResponse: { success: false, ...action.error }
            };

        case actionType.ADD_BUILDING_TYPE_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_BUILDING_TYPE_SUCCESS:
            return {
                ...state,
                addBuildingTypeResponse: { success: true, ...action.response }
            };
        case actionType.ADD_BUILDING_TYPE_FAILURE:
            return {
                ...state,
                addBuildingTypeResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_BUILDING_TYPE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_BUILDING_TYPE_SUCCESS:
            return {
                ...state,
                updateBuildingTypeResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_BUILDING_TYPE_FAILURE:
            return {
                ...state,
                updateBuildingTypeResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_BUILDING_TYPE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_BUILDING_TYPE_SUCCESS:
            return {
                ...state,
                deleteBuildingTypeResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_BUILDING_TYPE_FAILURE:
            return {
                ...state,
                deleteBuildingTypeResponse: { success: false, ...action.error }
            };

        case actionType.GET_REGIONS_BASED_ON_CLIENT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REGIONS_BASED_ON_CLIENT_SUCCESS:
            return {
                ...state,
                getRegionsBasedOnClientResponse: { success: true, ...action.response }
            };
        case actionType.GET_REGIONS_BASED_ON_CLIENT_FAILURE:
            return {
                ...state,
                getRegionsBasedOnClientResponse: { success: false, ...action.error }
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

        case actionType.GET_BUILDING_TYPE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_BUILDING_TYPE_BY_ID_SUCCESS:
            return {
                ...state,
                getBuildingTypeByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_BUILDING_TYPE_BY_ID_FAILURE:
            return {
                ...state,
                getBuildingTypeByIdResponse: { success: false, ...action.error }
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

        case actionType.PARSE_FCA_REQUEST:
            return {
                ...state
            };
        case actionType.PARSE_FCA_SUCCESS:
            return {
                ...state,
                parseFcaResponse: { success: true, ...action.response }
            };
        case actionType.PARSE_FCA_FAILURE:
            return {
                ...state,
                parseFcaResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_BUILDING_TYPE_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_BUILDING_TYPE_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ALL_BUILDING_TYPE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_BUILDING_TYPE_LOG_SUCCESS:
            return {
                ...state,
                getAllBuildingTypeLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_BUILDING_TYPE_LOG_FAILURE:
            return {
                ...state,
                getAllBuildingTypeLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_BUILDING_TYPE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_BUILDING_TYPE_LOG_SUCCESS:
            return {
                ...state,
                restoreBuildingTypeLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_BUILDING_TYPE_LOG_FAILURE:
            return {
                ...state,
                restoreBuildingTypeLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_BUILDING_TYPE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_BUILDING_TYPE_LOG_SUCCESS:
            return {
                ...state,
                deleteBuildingTypeLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_BUILDING_TYPE_LOG_FAILURE:
            return {
                ...state,
                deleteBuildingTypeLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_BUILDING_TYPE_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_BUILDING_TYPE_EXPORT_SUCCESS:
            return {
                ...state,
                buildingTypeExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_BUILDING_TYPE_EXPORT_FAILURE:
            return {
                ...state,
                buildingTypeExportResponse: { success: false, ...action.error }
            };
        case actionType.GET_BUILDING_TYPE_COLOR_CODE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_BUILDING_TYPE_COLOR_CODE_SUCCESS:
            return {
                ...state,
                getColorCodesBuildingType: { success: true, ...action.response }
            };
        case actionType.GET_BUILDING_TYPE_COLOR_CODE_FAILURE:
            return {
                ...state,
                getColorCodesBuildingType: { success: false, ...action.error }
            };

        case actionType.ADD_BUILDING_TYPE_COLOR_CODE_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_BUILDING_TYPE_COLOR_CODE_SUCCESS:
            return {
                ...state,
                addColorCodeBuildingType: { success: true, ...action.response }
            };
        case actionType.ADD_BUILDING_TYPE_COLOR_CODE_FAILURE:
            return {
                ...state,
                addColorCodeBuildingType: { success: false, ...action.error }
            };

        case actionType.UPDATE_BUILDING_TYPE_COLOR_CODE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_BUILDING_TYPE_COLOR_CODE_SUCCESS:
            return {
                ...state,
                updateColorCodeBuildingType: { success: true, ...action.response }
            };
        case actionType.UPDATE_BUILDING_TYPE_COLOR_CODE_FAILURE:
            return {
                ...state,
                updateColorCodeBuildingType: { success: false, ...action.error }
            };

        case actionType.DELETE_BUILDING_TYPE_COLOR_CODE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_BUILDING_TYPE_COLOR_CODE_SUCCESS:
            return {
                ...state,
                deleteColorCodeBuildingType: { success: true, ...action.response }
            };
        case actionType.DELETE_BUILDING_TYPE_COLOR_CODE_FAILURE:
            return {
                ...state,
                deleteColorCodeBuildingType: { success: false, ...action.error }
            };

        default:
            return state;
    }
};
