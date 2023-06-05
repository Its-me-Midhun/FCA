import * as actionTypes from "./constants";
import * as Service from "./services";
const getAllUserMailid = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_USER_EMAIL_REQUEST });
            const res = await Service.getAllUserMailid(params);
            if (res && res.status === 200) {
                const subSystemData = res.data;
                if (subSystemData.success) {
                    dispatch({
                        type: actionTypes.GET_USER_EMAIL_SUCCESS,
                        response: subSystemData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_USER_EMAIL_FAILURE,
                        error: subSystemData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_USER_EMAIL_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_USER_EMAIL_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const sendEmail = (params, path = null) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.SEND_EMAIL_REQUEST });
            const res = await Service.sendEmail(params,path);
            if (res && res.status === 200) {
                const subSystemData = res.data;
                if (subSystemData.success) {
                    dispatch({
                        type: actionTypes.SEND_EMAIL_SUCCESS,
                        response: subSystemData
                    });
                } else {
                    dispatch({
                        type: actionTypes.SEND_EMAIL_FAILURE,
                        error: subSystemData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.SEND_EMAIL_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.SEND_EMAIL_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getAllMail = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_MAIL_DATA_REQUEST });
            const res = await Service.getAllMail(params, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_MAIL_DATA_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_MAIL_DATA_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_MAIL_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_MAIL_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const EmailEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_EMAIL_DATA_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_EMAIL_DATA_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

export default {getAllUserMailid,sendEmail,getAllMail,EmailEntityParams}