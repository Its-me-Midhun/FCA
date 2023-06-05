import * as actionTypes from "./constants";
import * as Service from "./services";

const getNotifications = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_NOTIFICATION_DATA_REQUEST });
            const res = await Service.getNotifications(params);
            if (res && res.status === 200) {
                const notificationData = res.data;
                    dispatch({
                        type: actionTypes.GET_NOTIFICATION_DATA_SUCCESS,
                        response: notificationData
                    });          
            } else {
                dispatch({
                    type: actionTypes.GET_NOTIFICATION_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_NOTIFICATION_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getUnreadNotifications = params => {
    let currentUserId=localStorage.getItem("userId");
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_UNREAD_NOTIFICATION_DATA_REQUEST });
            const res = await Service.getUnreadNotifications({...params,per_page_count: 10,
                page_number: 1,user_id:currentUserId,read_at:"null"});
            if (res && res.status === 200) {
                const notificationData = res.data;
                    dispatch({
                        type: actionTypes.GET_UNREAD_NOTIFICATION_DATA_SUCCESS,
                        response: notificationData
                    });          
            } else {
                dispatch({
                    type: actionTypes.GET_UNREAD_NOTIFICATION_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_UNREAD_NOTIFICATION_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateNotificationsEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_NOTIFICATION_DATA_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_NOTIFICATION_DATA_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const getListForCommonFilter = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilter(params);
            if (res && res.status === 200) {
                const siteData = res.data;
                if (siteData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: siteData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: siteData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};


const exportNotification = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_NOTIFICATION_EXPORT_REQUEST });
            const response = await Service.exportNotification(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_NOTIFICATION_EXPORT_FAILURE, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_NOTIFICATION_EXPORT_SUCCESS, response: {} });
                }
            }
            const { data } = response;
            const name = response.headers["content-disposition"].split("filename=");
            const fileName = name[1];
            let blob = new Blob([data]);
            let url = window.URL || window.webkitURL;
            let downloadUrl = url.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", `${fileName}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            dispatch({
                type: actionTypes.GET_NOTIFICATION_EXPORT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateNotifications = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_NOTIFICATION_REQUEST });
            const res = await Service.updateNotifications(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.UPDATE_NOTIFICATION_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_NOTIFICATION_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_NOTIFICATION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_NOTIFICATION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};


export default {
    getNotifications,
    updateNotificationsEntityParams,
    getUnreadNotifications,
    updateNotifications,
    exportNotification
};
