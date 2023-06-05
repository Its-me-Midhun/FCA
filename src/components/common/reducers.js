import * as actionType from "./constants";
const initialState = {
    getMenuItemsResponse: {},
    getEmailItemResponse: {},
    // getProjectMenuItemsResponse:{},
    // getReportMenuItemsResponse:{},
    isFormDirty: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_MENU_ITEMS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_MENU_ITEMS_SUCCESS:
            return {
                ...state,
                getMenuItemsResponse: { success: true, ...action.response }
            };
        case actionType.GET_MENU_ITEMS_FAILURE:
            return {
                ...state,
                getMenuItemsResponse: { success: false, ...action.error }
            };
        case actionType.GET_PROJECT_MENU_ITEMS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROJECT_MENU_ITEMS_SUCCESS:
            return {
                ...state,
                [action.key]: { success: true, ...action.response }
            };
        case actionType.GET_PROJECT_MENU_ITEMS_FAILURE:
            return {
                ...state
                // getProjectMenuItemsResponse: { success: false, ...action.error }
            };

        case actionType.SET_FORM_DIRTY_SUCCESS:
            return {
                ...state,
                isFormDirty: action.response
            };
        case actionType.SET_FORM_DIRTY_FAILURE:
            return {
                ...state,
                isFormDirty: action.error
            };
        case actionType.GET_MENU_LINK_EMAIL_REQUEST:
            return {
                ...state
            };
        case actionType.GET_MENU_LINK_EMAIL_SUCCESS:
            return {
                ...state,
                getEmailItemResponse: { success: true, ...action.response }
            };
        case actionType.GET_MENU_LINK_EMAIL_FAILURE:
            return {
                ...state,
                getEmailItemResponse: { success: false, ...action.error }
            };
        default:
            return state;
    }
};
