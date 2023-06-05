import * as actionType from "./constants";

const initialState = {
    rotateImageResponse: {},
    exportImageResponse: {},
    imageUploadResponse: {},
    imageLogsResponse: {},
    imageUpdateResponse: {},
    projectList: {},
    buildingList: {},
    tradeList: {},
    systemList: {},
    subsystemList: {},
    recommendationsList: {},
    duplicateImages: {},
    imagesResponse: {},
    masterFilterList: {
        clients: [],
        projects: [],
        reagions: [],
        sites: [],
        buildings: [],
        trade: [],
        system: [],
        subSystem: [],
        labels: []
    },
    selectedProject: {},
    selectedImages: [],
    checkImageMapped: {},
    deleteImageResponse: {},
    getUserDefaultTradeResponse: {},
    uploadProgress: 0,
    defaultProject: "",
    defaultClient: "",
    addToFav: {},
    entityParams: {
        master: {
            isGridView: true,
            imageParams: {
                limit: 100,
                offset: 1,
                search: "",
                filters: {},
                order: { name: "asc" }
            },
            sortOrder: "asc",
            masterFilters: {
                client_ids: [],
                project_ids: [],
                region_ids: [],
                site_ids: [],
                building_ids: [],
                trade_ids: [],
                system_ids: [],
                sub_system_ids: [],
                user_ids: [],
                image_tag_ids: []
            },
            isFilterReset: false,
            showSelected: false,
            selectedImages: []
        },
        assign: {
            isGridView: true,
            imageParams: {
                limit: 100,
                offset: 1,
                search: "",
                filters: {},
                order: { name: "asc" }
            },
            sortOrder: "asc",
            masterFilters: {
                client_ids: [],
                project_ids: [],
                region_ids: [],
                site_ids: [],
                building_ids: [],
                trade_ids: [],
                system_ids: [],
                sub_system_ids: [],
                user_ids: [],
                image_tag_ids: []
            },
            isFilterReset: false,
            showSelected: false,
            selectedImages: []
        }
    },
    scrollPosition: 0,
    getLabelList: [],
    saveEditedImageResponse: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.UPLOAD_IMAGE_REQUEST:
            return {
                ...state
            };
        case actionType.UPLOAD_IMAGE_SUCCESS:
            return {
                ...state,
                imageUploadResponse: { success: true, ...action.response }
            };
        case actionType.UPLOAD_IMAGE_FAILURE:
            return {
                ...state,
                imageUploadResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_IMAGE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_IMAGE_SUCCESS:
            return {
                ...state,
                imageUpdateResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_IMAGE_FAILURE:
            return {
                ...state,
                imageUpdateResponse: { success: false, ...action.error }
            };
        case actionType.GET_PROJECT_LIST_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROJECT_LIST_SUCCESS:
            return {
                ...state,
                projectList: { success: true, ...action.response }
            };
        case actionType.GET_PROJECT_LIST_FAILURE:
            return {
                ...state,
                projectList: { success: false, ...action.error }
            };
        case actionType.GET_BUILDING_LIST_REQUEST:
            return {
                ...state
            };
        case actionType.GET_BUILDING_LIST_SUCCESS:
            return {
                ...state,
                buildingList: { success: true, ...action.response }
            };
        case actionType.GET_BUILDING_LIST_FAILURE:
            return {
                ...state,
                buildingList: { success: false, ...action.error }
            };

        case actionType.GET_SELECTED_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SELECTED_PROJECT_SUCCESS:
            return {
                ...state,
                selectedProject: { success: true, ...action.response }
            };
        case actionType.GET_SELECTED_PROJECT_FAILURE:
            return {
                ...state,
                selectedProject: { success: false, ...action.error }
            };

        case actionType.GET_TRADE_LIST_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TRADE_LIST_SUCCESS:
            return {
                ...state,
                tradeList: { success: true, ...action.response }
            };
        case actionType.GET_TRADE_LIST_FAILURE:
            return {
                ...state,
                tradeList: { success: false, ...action.error }
            };
        case actionType.GET_SYSTEM_LIST_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SYSTEM_LIST_SUCCESS:
            return {
                ...state,
                systemList: { success: true, ...action.response }
            };
        case actionType.GET_SYSTEM_LIST_FAILURE:
            return {
                ...state,
                systemList: { success: false, ...action.error }
            };
        case actionType.GET_SUBSYSTEM_LIST_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SUBSYSTEM_LIST_SUCCESS:
            return {
                ...state,
                subsystemList: { success: true, ...action.response }
            };
        case actionType.GET_SUBSYSTEM_LIST_FAILURE:
            return {
                ...state,
                subsystemList: { success: false, ...action.error }
            };
        case actionType.CHECK_DUPLICATE_IMAGE_REQUEST:
            return {
                ...state
            };
        case actionType.CHECK_DUPLICATE_IMAGE_SUCCESS:
            return {
                ...state,
                duplicateImages: { success: true, ...action.response }
            };
        case actionType.CHECK_DUPLICATE_IMAGE_FAILURE:
            return {
                ...state,
                duplicateImages: { success: false, ...action.error }
            };
        case actionType.GET_ALL_IMAGES1_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_IMAGES1_SUCCESS:
            return {
                ...state,
                imagesResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_IMAGES1_FAILURE:
            return {
                ...state,
                imagesResponse: { success: false, ...action.error }
            };
        case actionType.GET_FILTER_LISTS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FILTER_LISTS_SUCCESS:
            return {
                ...state,
                masterFilterList: { ...state.masterFilterList, [action.filterKey]: [...action.response[action.filterKey]] },
                defaultProject: action.response?.default_project || state.defaultProject,
                defaultClient: action.response?.default_client || state.defaultClient
            };
        case actionType.GET_FILTER_LISTS_FAILURE:
            return {
                ...state,
                masterFilterList: { success: false, ...action.error }
            };
        case actionType.GET_IMAGE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_IMAGE_LOG_SUCCESS:
            return {
                ...state,
                imageLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_IMAGE_LOG_FAILURE:
            return {
                ...state,
                imageLogsResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_SELECTED_IMAGES:
            return {
                ...state,
                selectedImages: action.response
            };
        case actionType.CHECK_IMAGE_MAPPED_REQUEST:
            return {
                ...state
            };
        case actionType.CHECK_IMAGE_MAPPED_SUCCESS:
            return {
                ...state,
                checkImageMapped: { success: true, ...action.response }
            };
        case actionType.CHECK_IMAGE_MAPPED_FAILURE:
            return {
                ...state,
                checkImageMapped: { success: false, ...action.error }
            };
        case actionType.DELETE_IMAGE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_IMAGE_SUCCESS:
            return {
                ...state,
                deleteImageResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_IMAGE_FAILURE:
            return {
                ...state,
                deleteImageResponse: { success: false, ...action.error }
            };
        case actionType.ADD_UPLOAD_PROGRESS:
            return {
                ...state,
                uploadProgress: action.response
            };
        case actionType.SET_UPLOAD_PROGRESS:
            return {
                ...state,
                uploadProgress: action.response
            };
        case actionType.ADD_TO_FAV_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_TO_FAV_SUCCESS:
            return {
                ...state,
                addToFav: { success: true, ...action.response }
            };
        case actionType.ADD_TO_FAV_FAILURE:
            return {
                ...state,
                addToFav: { success: false, ...action.error }
            };
        case actionType.UPDATE_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...state.entityParams, [action.response.type]: { ...action.response } }
            };
        case actionType.UPDATE_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        case actionType.UPDATE_IMG_SCROLL_POSITION_SUCCESS:
            return {
                ...state,
                scrollPosition: action.response
            };
        case actionType.UPDATE_IMG_SCROLL_POSITION_FAILURE:
            return {
                ...state,
                scrollPosition: 0
            };
        case actionType.GET_USER_DEFAULT_TRADE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_USER_DEFAULT_TRADE_SUCCESS:
            return {
                ...state,
                getUserDefaultTradeResponse: { success: true, ...action.response }
            };
        case actionType.GET_USER_DEFAULT_TRADE_FAILURE:
            return {
                ...state,
                getUserDefaultTradeResponse: { success: false, ...action.error }
            };
        case actionType.GET_LABEL_LIST_REQUEST:
            return {
                ...state
            };
        case actionType.GET_LABEL_LIST_SUCCESS:
            return {
                ...state,
                getLabelList: { success: true, ...action.response }
            };
        case actionType.GET_LABEL_LIST_FAILURE:
            return {
                ...state,
                getLabelList: { success: false, ...action.error }
            };
        case actionType.EXPORT_IMAGES_LIST_REQUEST:
            return {
                ...state
            };
        case actionType.EXPORT_IMAGES_LIST_SUCCESS:
            return {
                ...state,
                exportImageResponse: { success: true, ...action.response }
            };
        case actionType.EXPORT_IMAGES_LIST_FAILURE:
            return {
                ...state,
                exportImageResponse: { success: false, ...action.error }
            };
        //rotate images
        case actionType.ROTATE_IMAGES_LIST_REQUEST:
            return {
                ...state
            };
        case actionType.ROTATE_IMAGES_LIST_SUCCESS:
            return {
                ...state,
                rotateImageResponse: { success: true, ...action.response }
            };
        case actionType.ROTATE_IMAGES_LIST_FAILURE:
            return {
                ...state,
                rotateImageResponse: { success: false, ...action.error }
            };
        case actionType.SAVE_EDITED_IMAGE_REQUEST:
            return {
                ...state
            };
        case actionType.SAVE_EDITED_IMAGE_SUCCESS:
            return {
                ...state,
                saveEditedImageResponse: { success: true, ...action.response }
            };
        case actionType.SAVE_EDITED_IMAGE_FAILURE:
            return {
                ...state,
                saveEditedImageResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_EDITED_IMAGE_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_EDITED_IMAGE_SUCCESS:
            return {
                ...state,
                saveEditedImageResponse: { success: true }
            };
        case actionType.RESTORE_EDITED_IMAGE_FAILURE:
            return {
                ...state,
                saveEditedImageResponse: { success: false, ...action.error }
            };
        default:
            return state;
    }
};
