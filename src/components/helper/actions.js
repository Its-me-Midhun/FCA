import * as actionTypes from "./constants";
import * as Service from "./services";

const getHelperData = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_HELPER_DATA_REQUEST });
            const res = await Service.getHelperData(param);
            if (res && res.status === 200) {
                const resData = res.data;
                if (resData) {
                    dispatch({ type: actionTypes.GET_HELPER_DATA_SUCCESS, response: resData });
                } else {
                    dispatch({ type: actionTypes.GET_HELPER_DATA_FAILURE, error: resData });
                }
            } else {
                dispatch({ type: actionTypes.GET_HELPER_DATA_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_HELPER_DATA_FAILURE, error: e.response && e.response.data });
        }
    };
};

const uploadHelperDocToAWS = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPLOAD_HELPER_DOC_TO_AWS_REQUEST });
            const res = await Service.uploadHelperDocToAWS(param);
            if (res && res.status === 200) {
                const resData = res.data;
                if (resData) {
                    dispatch({ type: actionTypes.UPLOAD_HELPER_DOC_TO_AWS_SUCCESS, response: resData });
                } else {
                    dispatch({ type: actionTypes.UPLOAD_HELPER_DOC_TO_AWS_FAILURE, error: resData });
                }
            } else {
                dispatch({ type: actionTypes.UPLOAD_HELPER_DOC_TO_AWS_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.UPLOAD_HELPER_DOC_TO_AWS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateHelper = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_HELPER_REQUEST });
            const res = await Service.updateHelper(param);
            if (res && res.status === 200) {
                const resData = res.data;
                if (resData) {
                    dispatch({ type: actionTypes.UPDATE_HELPER_SUCCESS, response: resData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_HELPER_FAILURE, error: resData });
                }
            } else {
                dispatch({ type: actionTypes.UPDATE_HELPER_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.UPDATE_HELPER_FAILURE, error: e.response && e.response.data });
        }
    };
};

export default {
    getHelperData,
    updateHelper,
    uploadHelperDocToAWS
};
