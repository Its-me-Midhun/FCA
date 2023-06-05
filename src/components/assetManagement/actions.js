import * as actionTypes from "./constants";
import * as Service from "./services";

const updateAssetManagementEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_ASSET_MANAGEMENT_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ASSET_MANAGEMENT_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const getChartData = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHARTS_DETAILS_REQUEST });
            const res = await Service.getChartData(params);

            if (res && res.status === 200) {
                const chartData = res.data;
                if (chartData.success) {
                    dispatch({ type: actionTypes.GET_CHARTS_DETAILS_SUCCESS, response: chartData });
                } else {
                    dispatch({ type: actionTypes.GET_CHARTS_DETAILS_FAILURE, error: chartData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHARTS_DETAILS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHARTS_DETAILS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getFilterLists = (filterKey, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FILTER_LISTS_REQUEST });
            const res = await Service.getFilterLists(filterKey, params);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.GET_FILTER_LISTS_SUCCESS,
                    filterKey,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_FILTER_LISTS_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_FILTER_LISTS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getSfciChart = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SFCI_CHART_REQUEST });
            const res = await Service.getSfciChart(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                dispatch({ type: actionTypes.GET_SFCI_CHART_SUCCESS, response: codeData });
            } else {
                dispatch({ type: actionTypes.GET_SFCI_CHART_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_SFCI_CHART_FAILURE, error: e.response && e.response.data });
        }
    };
};

const saveChartPopup = data => {
    return async dispatch => {
        dispatch({
            type: actionTypes.SAVE_CHART_POPUP,
            response: data
        });
    };
};
const saveChartTab = data => {
    return async dispatch => {
        dispatch({
            type: actionTypes.SAVE_CHART_TAB,
            response: data
        });
    };
};

const saveMasterFilters = params => {
    return async dispatch => {
        dispatch({
            type: actionTypes.SAVE_CHART_PARAMS,
            response: params
        });
    };
};
const saveSelectedMasterFilterList = params => {
    return async dispatch => {
        dispatch({
            type: actionTypes.SAVE_SELECTED_MASTER_FILTER_LIST,
            response: params
        });
    };
};
const saveChartView = params => {
    return async dispatch => {
        dispatch({
            type: actionTypes.SAVE_CHART_VIEW,
            response: params
        });
    };
};
export default {
    updateAssetManagementEntityParams,
    getChartData,
    getFilterLists,
    saveChartPopup,
    saveChartTab,
    saveMasterFilters,
    saveSelectedMasterFilterList,
    saveChartView,
    getSfciChart
};
