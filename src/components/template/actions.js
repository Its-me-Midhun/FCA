import * as actionTypes from "./constants";
import * as Service from "./services";

const getAllTemplateData = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_TEMPLATE_REQUEST });
            const res = await Service.getAllTemplateData(param);
            if (res && res.status === 200) {
                const loginData = res.data;
                //TODO change loginData.access_token to emailData.success (change api response)
                if (loginData.access_token) {
                    dispatch({ type: actionTypes.GET_ALL_TEMPLATE_SUCCESS, response: loginData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_TEMPLATE_FAILURE, error: loginData });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_TEMPLATE_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_TEMPLATE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateTemplateEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_TEMPLATE_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_TEMPLATE_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const getListForCommonFilterTemplate = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterTemplate(params, id);
            if (res && res.status === 200) {
                const floorData = res.data;
                if (floorData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: floorData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: floorData
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

export default {
    getAllTemplateData,
    updateTemplateEntityParams,
    getListForCommonFilterTemplate
}