import * as actionTypes from "./constants";
import * as Service from "./services";

const loginUser = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.LOGIN_REQUEST });
            const res = await Service.loginUser(param);
            if (res && res.status === 200) {
                const loginData = res.data;
                //TODO change loginData.access_token to emailData.success (change api response)
                if (loginData.access_token) {
                    dispatch({ type: actionTypes.LOGIN_SUCCESS, response: loginData });
                } else {
                    dispatch({ type: actionTypes.LOGIN_FAILURE, error: loginData });
                }
            } else {
                dispatch({ type: actionTypes.LOGIN_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.LOGIN_FAILURE, error: e.response && e.response.data });
        }
    };
};


const logoutUser = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.LOGOUT_REQUEST });
            const res = await Service.logoutUser(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.LOGOUT_SUCCESS, response: codeData });
                } else {
                    dispatch({ type: actionTypes.LOGOUT_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.LOGOUT_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.LOGOUT_FAILURE, error: e.response && e.response.data });
        }
    };
};

const forgotPassword = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.FORGOT_PASSWORD_REQUEST });
            const res = await Service.forgotPassword(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.FORGOT_PASSWORD_SUCCESS, response: codeData });
                } else {
                    dispatch({ type: actionTypes.FORGOT_PASSWORD_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.FORGOT_PASSWORD_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.FORGOT_PASSWORD_FAILURE, error: e.response && e.response.data });
        }
    };
};

const resetPassword = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESET_PASSWORD_REQUEST });
            const res = await Service.resetPassword(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.RESET_PASSWORD_SUCCESS, response: codeData });
                } else {
                    dispatch({ type: actionTypes.RESET_PASSWORD_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.RESET_PASSWORD_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESET_PASSWORD_FAILURE, error: e.response && e.response.data });
        }
    };
};

const resetPasswordProfile = (id,param) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESET_PASSWORD_REQUEST });
            const res = await Service.resetPasswordProfile(id,param);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.RESET_PASSWORD_SUCCESS, response: codeData });
                } else {
                    dispatch({ type: actionTypes.RESET_PASSWORD_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.RESET_PASSWORD_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.RESET_PASSWORD_FAILURE, error: e.response && e.response.data });
        }
    };
};
const validateToken = (token) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.VALIDATE_TOKEN_REQUEST });
            const res = await Service.validateToken(token);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.VALIDATE_TOKEN_SUCCESS, response: codeData });
                } else {
                    dispatch({ type: actionTypes.VALIDATE_TOKEN_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.VALIDATE_TOKEN_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.VALIDATE_TOKEN_FAILURE, error: e.response && e.response.data });
        }
    };
}

export default {
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    resetPasswordProfile,
    validateToken
}