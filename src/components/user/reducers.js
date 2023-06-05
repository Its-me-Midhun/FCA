import * as actionType from "./constants";
const initialState = {
    loginUser: {},
    logoutUser: {},
    forgotPassword: {},
    resetPassword: {},
    validateTokenResponse: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.LOGIN_REQUEST:
            return {
                ...state
            };
        case actionType.LOGIN_SUCCESS:
            return {
                ...state,
                loginUser: { success: true, ...action.response }
            };
        case actionType.LOGIN_FAILURE:
            return {
                ...state,
                loginUser: { success: false, ...action.error }
            };

        case actionType.LOGOUT_REQUEST:
            return {
                ...state
            };
        case actionType.LOGOUT_SUCCESS:
            return {
                ...state,
                logoutUser: { success: true, ...action.response }
            };
        case actionType.LOGOUT_FAILURE:
            return {
                ...state,
                logoutUser: { success: false, ...action.error }
            };
        case actionType.FORGOT_PASSWORD_REQUEST:
            return {
                ...state
            };
        case actionType.FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                forgotPassword: { success: true, ...action.response }
            };
        case actionType.FORGOT_PASSWORD_FAILURE:
            return {
                ...state,
                forgotPassword: { success: false, ...action.error }
            };
        case actionType.RESET_PASSWORD_REQUEST:
            return {
                ...state
            };
        case actionType.RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                resetPassword: { success: true, ...action.response }
            };
        case actionType.RESET_PASSWORD_FAILURE:
            return {
                ...state,
                resetPassword: { success: false, ...action.error }
            };
        case actionType.VALIDATE_TOKEN_REQUEST:
            return {
                ...state
            };
        case actionType.VALIDATE_TOKEN_SUCCESS:
            return {
                ...state,
                validateTokenResponse: { success: true, ...action.response }
            };
        case actionType.VALIDATE_TOKEN_FAILURE:
            return {
                ...state,
                validateTokenResponse: { success: false, ...action.error }
            };

        default:
            return state;
    }
}