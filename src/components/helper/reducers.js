import * as actionType from "./constants";
const initialState = {
    getHelperDataResponse: {},
    uploadHelperDocToAWSResponse: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_HELPER_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_HELPER_DATA_SUCCESS:
            return {
                ...state,
                getHelperDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_HELPER_DATA_FAILURE:
            return {
                ...state,
                getHelperDataResponse: { success: false, ...action.error }
            };

        case actionType.UPLOAD_HELPER_DOC_TO_AWS_REQUEST:
            return {
                ...state
            };
        case actionType.UPLOAD_HELPER_DOC_TO_AWS_SUCCESS:
            return {
                ...state,
                uploadHelperDocToAWSResponse: { success: true, ...action.response }
            };
        case actionType.UPLOAD_HELPER_DOC_TO_AWS_FAILURE:
            return {
                ...state,
                uploadHelperDocToAWSResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_HELPER_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_HELPER_SUCCESS:
            return {
                ...state,
                updateHelperResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_HELPER_FAILURE:
            return {
                ...state,
                updateHelperResponse: { success: false, ...action.error }
            };

        default:
            return state;
    }
};
