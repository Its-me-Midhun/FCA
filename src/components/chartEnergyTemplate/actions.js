import * as actionTypes from "./constants";
import * as Service from "./services";
import axios from "axios";

const getDashboardDetails = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DASHBOARD_DETAILS_REQUEST });
            const res = await Service.getDashboard(params);
            if (res && res.status === 200) {
                const chartData = res.data;
                if (chartData.success) {
                    dispatch({ type: actionTypes.GET_DASHBOARD_DETAILS_REQUEST, response: chartData });
                } else {
                    dispatch({ type: actionTypes.GET_DASHBOARD_DETAILS_FAILURE, error: chartData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_DASHBOARD_DETAILS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_DASHBOARD_DETAILS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getClientById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHART_CLIENT_ID_REQUEST });
            const res = await Service.getClientsId(id);
            if (res && res.status === 200) {
                const readingData = res.data;
                if (readingData.success) {
                    dispatch({ type: actionTypes.GET_CHART_CLIENT_ID_SUCCESS, response: readingData });
                } else {
                    dispatch({ type: actionTypes.GET_CHART_CLIENT_ID_FAILURE, error: readingData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHART_CLIENT_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHART_CLIENT_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getBuildingById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHART_BUILDING_BY_ID_REQUEST });
            const res = await Service.getBuildingById(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_CHART_BUILDING_BY_ID_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({ type: actionTypes.GET_CHART_BUILDING_BY_ID_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHART_BUILDING_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHART_BUILDING_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getRegionById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHART_REGION_BY_ID_REQUEST });
            const res = await Service.getRegionById(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_CHART_REGION_BY_ID_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_CHART_REGION_BY_ID_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHART_REGION_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHART_REGION_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSiteById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHART_SITE_BY_ID_REQUEST });
            const res = await Service.getSiteById(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_CHART_SITE_BY_ID_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_CHART_SITE_BY_ID_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHART_SITE_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHART_SITE_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getRegionFilter = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ENERGY_FILTER_REGIONS_REQUEST });
            const res = await Service.getRegionFilter(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.GET_ENERGY_FILTER_REGIONS_SUCCESS, response: codeData });
                } else {
                    dispatch({ type: actionTypes.GET_ENERGY_FILTER_REGIONS_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.GET_ENERGY_FILTER_REGIONS_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ENERGY_FILTER_REGIONS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getSiteFilter = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ENERGY_FILTER_SITES_REQUEST });
            const res = await Service.getSiteFilter(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.GET_ENERGY_FILTER_SITES_SUCCESS, response: codeData });
                } else {
                    dispatch({ type: actionTypes.GET_ENERGY_FILTER_SITES_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.GET_ENERGY_FILTER_SITES_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ENERGY_FILTER_SITES_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getBuildingTypeFilter = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ENERGY_FILTER_BUILDING_TYPE_REQUEST });
            const res = await Service.getBuildingTypeFilter(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.GET_ENERGY_FILTER_BUILDING_TYPE_SUCCESS, response: codeData });
                } else {
                    dispatch({ type: actionTypes.GET_ENERGY_FILTER_BUILDING_TYPE_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.GET_ENERGY_FILTER_BUILDING_TYPE_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ENERGY_FILTER_BUILDING_TYPE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getBuildingFilter = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ENERGY_FILTER_BUILDINGS_REQUEST });
            const res = await Service.getBuildingFilter(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.GET_ENERGY_FILTER_BUILDINGS_SUCCESS, response: codeData });
                } else {
                    dispatch({ type: actionTypes.GET_ENERGY_FILTER_BUILDINGS_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.GET_ENERGY_FILTER_BUILDINGS_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ENERGY_FILTER_BUILDINGS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getYearFilter = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ENERGY_FILTER_YEAR_REQUEST });
            const res = await Service.getYearFilter(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.GET_ENERGY_FILTER_YEAR_SUCCESS, response: codeData });
                } else {
                    dispatch({ type: actionTypes.GET_ENERGY_FILTER_YEAR_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.GET_ENERGY_FILTER_YEAR_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ENERGY_FILTER_YEAR_FAILURE, error: e.response && e.response.data });
        }
    };
};

export default {
    getDashboardDetails,
    getClientById,
    getRegionFilter,
    getSiteFilter,
    getBuildingTypeFilter,
    getBuildingFilter,
    getYearFilter,
    getBuildingById,
    getRegionById,
    getSiteById
};
