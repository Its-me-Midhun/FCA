import * as actionType from "./constants";

const initialState = {
    getSoftCosts: {},
    saveSoftCosts: {},
    excelData: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_SOFT_COSTS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SOFT_COSTS_SUCCESS:
            return {
                ...state,
                getSoftCosts: { success: true, ...action.response }
            };
        case actionType.GET_SOFT_COSTS_FAILURE:
            return {
                ...state,
                getSoftCosts: { success: false, ...action.error }
            };
        case actionType.SAVE_SOFT_COSTS_REQUEST:
            return {
                ...state
            };
        case actionType.SAVE_SOFT_COSTS_SUCCESS:
            return {
                ...state,
                saveSoftCosts: { success: true, ...action.response }
            };
        case actionType.SAVE_SOFT_COSTS_FAILURE:
            return {
                ...state,
                saveSoftCosts: { success: false, ...action.error }
            };
        case actionType.EXPORT_EXCEL_REQUEST:
            return {
                ...state
            };
        case actionType.EXPORT_EXCEL_SUCCESS:
            return {
                ...state,
                excelData: { success: true, ...action.response }
            };
        case actionType.EXPORT_EXCEL_FAILURE:
            return {
                ...state,
                excelData: { success: false, ...action.error }
            };
        default:
            return state;
    }
};
