import * as actionTypes from "./constants";
import * as Service from "./services";

const getMenuItems = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_MENU_ITEMS_REQUEST });
            const res = await Service.getMenuItems(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_MENU_ITEMS_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_MENU_ITEMS_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_MENU_ITEMS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_MENU_ITEMS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSideMenuItems = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PROJECT_MENU_ITEMS_REQUEST });
            const res = await Service.getSideMenuItems(params.entity, params.params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_PROJECT_MENU_ITEMS_SUCCESS, response: regionData, key: params.response });
                } else {
                    dispatch({ type: actionTypes.GET_PROJECT_MENU_ITEMS_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_PROJECT_MENU_ITEMS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_PROJECT_MENU_ITEMS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const setFormDirty = value => {
    return dispatch => {
        try {
            dispatch({
                type: actionTypes.SET_FORM_DIRTY_SUCCESS,
                response: value
            });
        } catch (e) {
            dispatch({
                type: actionTypes.SET_FORM_DIRTY_FAILURE,
                error: false
            });
        }
    };
};

const getLinkEmail = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_MENU_LINK_EMAIL_REQUEST });
            const res = await Service.getLinkEmail(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                const { s3_url, message, status } = regionData;
                if (regionData.status) {
                    const link = document.createElement("a");
                    link.href = s3_url;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    dispatch({
                        type: actionTypes.GET_MENU_LINK_EMAIL_SUCCESS,
                        response: { message_status: "File Exported Successfully", message: message, status, s3_url }
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_MENU_LINK_EMAIL_SUCCESS,
                        response: { message_status: "File Exported Successfully", message: message, status }
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_MENU_LINK_EMAIL_FAILURE,
                    error: res.response && res.response.data,
                    message: "Something Went Wrong"
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_MENU_LINK_EMAIL_FAILURE,
                error: e.response && e.response.data,
                message: "Something Went Wrong"
            });
        }
    };
};

export default {
    getMenuItems,
    getSideMenuItems,
    setFormDirty,
    getLinkEmail
};
