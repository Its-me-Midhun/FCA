import * as actionType from "./constants";

const initialState = {
    getDataResponse: {},
    addDataResponse: {},
    getDataByIdResponse: {},
    updateDataResponse: {},
    deleteDataResponse: {},
    getListForCommonFilterResponse: {},
    getDataLogsResponse: {},
    restoreDataLogResponse: {},
    deleteDataLogResponse: {},
    dataExportResponse: {},
    getAllImagesResponse: {},
    uploadImageResponse: {},
    deleteImagesResponse: {},
    updateImageResponse: {},
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
            list: null,
            recommendation_assigned_true: null
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
        dropDownList: {
            uniformat_level_1s: [],
            uniformat_level_2s: [],
            uniformat_level_3s: [],
            uniformat_level_4s: [],
            uniformat_level_5s: [],
            clients: [],
            trades: [],
            systems: [],
            sub_systems: [],
            regions: [],
            buildings: [],
            sites: [],
            additions: [],
            floors: [],
            asset_statuses: [],
            asset_types: []
        },
        locationState: {}
    },
    selectedAsset: {},
    scrollPosition: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.UPDATE_ASSET_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_ASSET_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ASSET_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ASSET_DATA_SUCCESS:
            return {
                ...state,
                getDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_ASSET_DATA_FAILURE:
            return {
                ...state,
                getDataResponse: { success: false, ...action.error }
            };
        case actionType.ADD_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_DATA_SUCCESS:
            return {
                ...state,
                addDataResponse: { success: true, ...action.response }
            };
        case actionType.ADD_DATA_FAILURE:
            return {
                ...state,
                addDataResponse: { success: false, ...action.error }
            };
        case actionType.GET_DATA_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DATA_BY_ID_SUCCESS:
            return {
                ...state,
                getDataByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_DATA_BY_ID_FAILURE:
            return {
                ...state,
                getDataByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_DATA_SUCCESS:
            return {
                ...state,
                updateDataResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_DATA_FAILURE:
            return {
                ...state,
                updateDataResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_DATA_SUCCESS:
            return {
                ...state,
                deleteDataResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_DATA_FAILURE:
            return {
                ...state,
                deleteDataResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_DATA_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_DATA_LOG_SUCCESS:
            return {
                ...state,
                getDataLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_DATA_LOG_FAILURE:
            return {
                ...state,
                getDataLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_DATA_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_DATA_LOG_SUCCESS:
            return {
                ...state,
                restoreDataLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_DATA_LOG_FAILURE:
            return {
                ...state,
                restoreDataLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_DATA_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_DATA_LOG_SUCCESS:
            return {
                ...state,
                deleteDataLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_DATA_LOG_FAILURE:
            return {
                ...state,
                deleteDataLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_DATA_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DATA_EXPORT_SUCCESS:
            return {
                ...state,
                dataExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_DATA_EXPORT_FAILURE:
            return {
                ...state,
                dataExportResponse: { success: false, ...action.error }
            };
        case actionType.GET_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DROPDOWN_SUCCESS:
            return {
                ...state,
                dropDownList: {
                    ...state.dropDownList,
                    [action.entity]: action.response[action.entity]
                }
            };
        case actionType.GET_DROPDOWN_FAILURE:
            return {
                ...state,
                dropDownList: {
                    ...state.dropDownList
                }
            };
        case actionType.GET_ALL_IMAGES:
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

        case actionType.UPDATE_ASSET_IMAGE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_ASSET_IMAGE_SUCCESS:
            return {
                ...state,
                updateImageResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_ASSET_IMAGE_FAILURE:
            return {
                ...state,
                updateImageResponse: { success: false, ...action.error }
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
        case actionType.UPDATE_SELECTED_ASSET_SUCCESS:
            return {
                ...state,
                selectedAsset: action.response
            };
        case actionType.UPDATE_SELECTED_ASSET_FAILURE:
            return {
                ...state,
                selectedAsset: action.response
            };
        case actionType.UPDATE_ASSET_SCROLL_POSITION_SUCCESS:
            return {
                ...state,
                scrollPosition: action.response
            };
        case actionType.UPDATE_ASSET_SCROLL_POSITION_FAILURE:
            return {
                ...state,
                scrollPosition: 0
            };
        default:
            return state;
    }
};
