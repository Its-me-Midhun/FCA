import * as actionTypes from "./constants";
import * as Service from "./services";

export const getMeterList = params => {
    return async dispatch => {
        try {
            console.log("paramsaction", params);

            dispatch({ type: actionTypes.GET_METER_LIST_REQUEST });
            const res = await Service.getMeterList(params);
            console.log("res", res);
            if (res && res.status === 200) {
                const meterTemplateData = res.data;
                if (meterTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_METER_LIST_SUCCESS,
                        response: meterTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_METER_LIST_FAILURE,
                        error: meterTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_METER_LIST_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_METER_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export const addMeterTemplate = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_METER_TEMPLATE_REQUEST });
            const res = await Service.addMeterTemplate(params);
            if (res && res.status === 200) {
                const meterTemplateData = res.data;
                if (meterTemplateData.success) {
                    dispatch({ type: actionTypes.ADD_METER_TEMPLATE_SUCCESS, response: meterTemplateData });
                } else {
                    dispatch({ type: actionTypes.ADD_METER_TEMPLATE_FAILURE, error: meterTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_METER_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_METER_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export const updateMeterTemplate = (meterTemplate_id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_METER_TEMPLATE_REQUEST });
            const res = await Service.updateMeterTemplate(meterTemplate_id, params);
            if (res && (res.status === 200 || res.status === 201)) {
                const meterTemplateData = res.data;
                if (meterTemplateData.success) {
                    dispatch({ type: actionTypes.UPDATE_METER_TEMPLATE_SUCCESS, response: meterTemplateData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_METER_TEMPLATE_FAILURE, error: meterTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_METER_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_METER_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export const getMeterTemplateById = narrativeTemplate_id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_METER_TEMPLATE_BY_ID_REQUEST });
            const res = await Service.getMeterTemplateById(narrativeTemplate_id);
            if (res && res.status === 200) {
                const meterTemplateData = res.data;
                if (meterTemplateData.success) {
                    dispatch({ type: actionTypes.GET_METER_TEMPLATE_BY_ID_SUCCESS, response: meterTemplateData });
                } else {
                    dispatch({ type: actionTypes.GET_METER_TEMPLATE_BY_ID_FAILURE, error: meterTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_METER_TEMPLATE_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_METER_TEMPLATE_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export const getMeterClientList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_METER_CLIENTS_REQUEST });
            const res = await Service.getMeterClients(params);
            if (res && res.status === 200) {
                const meterTemplateData = res.data;
                if (meterTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_METER_CLIENTS_SUCCESS,
                        response: meterTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_METER_CLIENTS_FAILURE,
                        error: meterTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_METER_CLIENTS_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_METER_CLIENTS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export const getMeterAccounts = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_METER_ACCOUNTS_REQUEST });
            const res = await Service.getMeterAccounts(params);
            if (res && res.status === 200) {
                const meterTemplateData = res.data;
                if (meterTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_METER_ACCOUNTS_SUCCESS,
                        response: meterTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_METER_ACCOUNTS_FAILURE,
                        error: meterTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_METER_ACCOUNTS_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_METER_ACCOUNTS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export const getMeterRegionList = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_METER_REGION_REQUEST });
            const res = await Service.getMeterRegion(id);
            if (res && res.status === 200) {
                const meterTemplateData = res.data;
                if (meterTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_METER_REGION_SUCCESS,
                        response: meterTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_METER_REGION_FAILURE,
                        error: meterTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_METER_REGION_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_METER_REGION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export const getMeterSiteList = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_METER_SITE_REQUEST });
            const res = await Service.getMeterSite(id, params);
            if (res && res.status === 200) {
                const meterTemplateData = res.data;
                if (meterTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_METER_SITE_SUCCESS,
                        response: meterTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_METER_SITE_FAILURE,
                        error: meterTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_METER_SITE_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_METER_SITE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export const getMeterBuildingList = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_METER_BUILDING_REQUEST });
            const res = await Service.getMeterBuilding(id, params);
            if (res && res.status === 200) {
                const meterTemplateData = res.data;
                if (meterTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_METER_BUILDING_SUCCESS,
                        response: meterTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_METER_BUILDING_FAILURE,
                        error: meterTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_METER_BUILDING_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_METER_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
