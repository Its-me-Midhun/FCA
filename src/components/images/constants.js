export const MASTER_FILTERS = [
    { label: "Clients", key: "clients", paramKey: "client_ids" },
    { label: "Projects", key: "projects", paramKey: "project_ids" },
    { label: "Regions", key: "regions", paramKey: "region_ids" },
    { label: "Sites", key: "sites", paramKey: "site_ids" },
    { label: "Buildings", key: "buildings", paramKey: "building_ids" },
    { label: "Trade", key: "trades", paramKey: "trade_ids" },
    { label: "System", key: "systems", paramKey: "system_ids" },
    { label: "Sub System", key: "sub_systems", paramKey: "sub_system_ids" },
    { label: "Uploaded By", key: "users", paramKey: "user_ids" },
    { label: "Labels", key: "labels", paramKey: "image_tag_ids" }
];
export const ADVANCED_FILTERS = [
    { label: "File Name", key: "file_name", type: "string", paramKey: "image_upload.name" },
    { label: "Caption", key: "caption", type: "string", paramKey: "image_upload.caption" },
    { label: "Date Uploaded", key: "uploaded_date", type: "date", paramKey: "image_upload.created_date" },
    { label: "Date Taken", key: "date_taken", type: "date", paramKey: "image_metadata.date_taken" },
    {
        label: "Favorites",
        key: "favourites",
        type: "select",
        paramKey: "image_upload.favourite",
        options: [
            { value: "true", label: "Favorites" },
            { value: "false", label: "Non Favorites" }
        ],
        filterType: "equals"
    },
    // {
    //     label: "Recommendations",
    //     key: "recommendations",
    //     type: "recom",
    //     paramKey: "recommendation_image_assigned_true",
    //     options: [
    //         { value: "true", label: "Assigned" },
    //         { value: "false", label: "Not Assigned" }
    //     ],
    //     filterType: "exclude"
    // }
];

export const SORT_KEYS = [
    { label: "File Name", sortKey: "name" },
    { label: "Caption", sortKey: "image_upload.caption" },
    { label: "Uploaded By", sortKey: "users.name" },
    { label: "Date Uploaded", sortKey: "image_upload.created_date" },
    { label: "Date Modified" , sortKey: "image_upload.date_modified"},
    { label: "Date Taken", sortKey: "image_metadata.date_taken" }
];

export const ADVANCED_FILTERS1 = {
    keys: ["file_name", "caption", "uploaded_by", "uploaded_date", "date_taken"],
    config: {
        file_name: {
            isVisible: true,
            label: "File Name",
            searchKey: "image_upload.name",
            type: "string",
            hasWildCardSearch: true
        },
        caption: {
            isVisible: true,
            label: "Caption",
            searchKey: "image_upload.caption",
            type: "string",
            hasWildCardSearch: true
        },
        uploaded_by: {
            isVisible: true,
            label: "Uploaded By",
            searchKey: "users.name",
            type: "string",
            hasWildCardSearch: true
        },
        uploaded_date: {
            isVisible: true,
            label: "Date Uploaded",
            searchKey: "image_upload.created_date",
            type: "date",
            hasWildCardSearch: true
        },
        date_taken: {
            isVisible: true,
            label: "Date Taken",
            searchKey: "image_metadata.date_taken",
            type: "date",
            hasWildCardSearch: true
        }
    }
};

export const UPLOAD_IMAGE_REQUEST = "UPLOAD_IMAGE_REQUEST";
export const UPLOAD_IMAGE_SUCCESS = "UPLOAD_IMAGE_SUCCESS";
export const UPLOAD_IMAGE_FAILURE = "UPLOAD_IMAGE_FAILURE";

export const UPDATE_IMAGE_REQUEST = "UPDATE_IMAGE_REQUEST";
export const UPDATE_IMAGE_SUCCESS = "UPDATE_IMAGE_SUCCESS";
export const UPDATE_IMAGE_FAILURE = "UPDATE_IMAGE_FAILURE";

export const CHECK_DUPLICATE_IMAGE_REQUEST = "CHECK_DUPLICATE_IMAGE_REQUEST";
export const CHECK_DUPLICATE_IMAGE_SUCCESS = "CHECK_DUPLICATE_IMAGE_SUCCESS";
export const CHECK_DUPLICATE_IMAGE_FAILURE = "CHECK_DUPLICATE_IMAGE_FAILURE";

export const GET_PROJECT_LIST_REQUEST = "GET_PROJECT_LIST_REQUEST";
export const GET_PROJECT_LIST_SUCCESS = "GET_PROJECT_LIST_SUCCESS";
export const GET_PROJECT_LIST_FAILURE = "GET_PROJECT_LIST_FAILURE";

export const GET_BUILDING_LIST_REQUEST = "GET_BUILDING_LIST_REQUEST";
export const GET_BUILDING_LIST_SUCCESS = "GET_BUILDING_LIST_SUCCESS";
export const GET_BUILDING_LIST_FAILURE = "GET_BUILDING_LIST_FAILURE";

export const GET_TRADE_LIST_REQUEST = "GET_TRADE_LIST_REQUEST";
export const GET_TRADE_LIST_SUCCESS = "GET_TRADE_LIST_SUCCESS";
export const GET_TRADE_LIST_FAILURE = "GET_TRADE_LIST_FAILURE";

export const GET_SYSTEM_LIST_REQUEST = "GET_SYSTEM_LIST_REQUEST";
export const GET_SYSTEM_LIST_SUCCESS = "GET_SYSTEM_LIST_SUCCESS";
export const GET_SYSTEM_LIST_FAILURE = "GET_SYSTEM_LIST_FAILURE";

export const GET_SUBSYSTEM_LIST_REQUEST = "GET_SUBSYSTEM_LIST_REQUEST";
export const GET_SUBSYSTEM_LIST_SUCCESS = "GET_SUBSYSTEM_LIST_SUCCESS";
export const GET_SUBSYSTEM_LIST_FAILURE = "GET_SUBSYSTEM_LIST_FAILURE";

export const GET_ALL_IMAGES1_REQUEST = "GET_ALL_IMAGES1_REQUEST";
export const GET_ALL_IMAGES1_SUCCESS = "GET_ALL_IMAGES1_SUCCESS";
export const GET_ALL_IMAGES1_FAILURE = "GET_ALL_IMAGES1_FAILURE";

export const GET_FILTER_LISTS_REQUEST = "GET_FILTER_LISTS_REQUEST";
export const GET_FILTER_LISTS_SUCCESS = "GET_FILTER_LISTS_SUCCESS";
export const GET_FILTER_LISTS_FAILURE = "GET_FILTER_LISTS_FAILURE";

export const GET_IMAGE_LOG_REQUEST = "GET_IMAGE_LOG_REQUEST";
export const GET_IMAGE_LOG_SUCCESS = "GET_IMAGE_LOG_SUCCESS";
export const GET_IMAGE_LOG_FAILURE = "GET_IMAGE_LOG_FAILURE";

export const UPDATE_SELECTED_IMAGES = "UPDATE_SELECTED_IMAGES";

export const CHECK_IMAGE_MAPPED_REQUEST = "CHECK_IMAGE_MAPPED_REQUEST";
export const CHECK_IMAGE_MAPPED_SUCCESS = "CHECK_IMAGE_MAPPED_SUCCESS";
export const CHECK_IMAGE_MAPPED_FAILURE = "CHECK_IMAGE_MAPPED_FAILURE";

export const DELETE_IMAGE_REQUEST = "DELETE_IMAGE_REQUEST";
export const DELETE_IMAGE_SUCCESS = "DELETE_IMAGE_SUCCESS";
export const DELETE_IMAGE_FAILURE = "DELETE_IMAGE_FAILURE";

export const SET_UPLOAD_PROGRESS = "SET_UPLOAD_PROGRESS";
export const ADD_UPLOAD_PROGRESS = "ADD_UPLOAD_PROGRESS";

export const ADD_TO_FAV_REQUEST = "ADD_TO_FAV_REQUEST";
export const ADD_TO_FAV_SUCCESS = "ADD_TO_FAV_SUCCESS";
export const ADD_TO_FAV_FAILURE = "ADD_TO_FAV_FAILURE";

export const UPDATE_ENTITY_PARAMS_SUCCESS = "UPDATE_ENTITY_PARAMS_SUCCESS";
export const UPDATE_ENTITY_PARAMS_FAILURE = "UPDATE_ENTITY_PARAMS_FAILURE";

export const UPDATE_IMG_SCROLL_POSITION_SUCCESS = "UPDATE_IMG_SCROLL_POSITION_SUCCESS";
export const UPDATE_IMG_SCROLL_POSITION_FAILURE = "UPDATE_IMG_SCROLL_POSITION_FAILURE";

export const GET_USER_DEFAULT_TRADE_REQUEST = "GET_USER_DEFAULT_TRADE_REQUEST";
export const GET_USER_DEFAULT_TRADE_SUCCESS = "GET_USER_DEFAULT_TRADE_SUCCESS";
export const GET_USER_DEFAULT_TRADE_FAILURE = "GET_USER_DEFAULT_TRADE_FAILURE";

export const GET_SELECTED_PROJECT_REQUEST = "GET_SELECTED_PROJECT_REQUEST";
export const GET_SELECTED_PROJECT_SUCCESS = "GET_SELECTED_PROJECT_SUCCESS";
export const GET_SELECTED_PROJECT_FAILURE = "GET_SELECTED_PROJECT_FAILURE";

export const GET_LABEL_LIST_REQUEST = "GET_LABEL_LIST_REQUEST";
export const GET_LABEL_LIST_SUCCESS = "GET_LABEL_LIST_SUCCESS";
export const GET_LABEL_LIST_FAILURE = "GET_LABEL_LIST_FAILURE";

//export Images
export const EXPORT_IMAGES_LIST_REQUEST = "EXPORT_IMAGES_LIST_REQUEST";
export const EXPORT_IMAGES_LIST_SUCCESS = "EXPORT_IMAGES_LIST_SUCCESS";
export const EXPORT_IMAGES_LIST_FAILURE = "EXPORT_IMAGES_LIST_FAILURE";

//crop and rotate images
export const ROTATE_IMAGES_LIST_REQUEST = "ROTATE_IMAGES_LIST_REQUEST";
export const ROTATE_IMAGES_LIST_SUCCESS = "ROTATE_IMAGES_LIST_SUCCESS";
export const ROTATE_IMAGES_LIST_FAILURE = "ROTATE_IMAGES_LIST_FAILURE";

export const SAVE_EDITED_IMAGE_REQUEST = "SAVE_EDITED_IMAGE_REQUEST";
export const SAVE_EDITED_IMAGE_SUCCESS = "SAVE_EDITED_IMAGE_SUCCESS";
export const SAVE_EDITED_IMAGE_FAILURE = "SAVE_EDITED_IMAGE_FAILURE";

export const RESTORE_EDITED_IMAGE_REQUEST = "RESTORE_EDITED_IMAGE_REQUEST";
export const RESTORE_EDITED_IMAGE_SUCCESS = "RESTORE_EDITED_IMAGE_SUCCESS";
export const RESTORE_EDITED_IMAGE_FAILURE = "RESTORE_EDITED_IMAGE_FAILURE";