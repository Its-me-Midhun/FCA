import * as actionTypes from "./constants";
import * as Service from "./services";

const getDashboard = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DASHBOARD_REQUEST });
            const res = await Service.getDashboard(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.GET_DASHBOARD_SUCCESS, response: codeData });
                } else {
                    dispatch({ type: actionTypes.GET_DASHBOARD_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.GET_DASHBOARD_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_DASHBOARD_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getFcaChartExcelExport = params => {
    return async dispatch => {
        try {
            const response = await Service.getFcaChartExcelExport(params);
            const { data } = response;
            const name = response.headers["content-disposition"].split("filename=");
            const fileName = name[1].split('"')[1];
            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", `${fileName}`); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {}
    };
};

const getFciChartExcelExport = params => {
    return async dispatch => {
        try {
            const response = await Service.getFciChartExcelExport(params);
            const { data } = response;
            const name = response.headers["content-disposition"].split("filename=");
            const fileName = name[1].split('"')[1];
            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", `${fileName}`); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {}
    };
};

const getHorizontalChartExport = params => {
    return async dispatch => {
        try {
            const response = await Service.getHorizontalChartExport(params);
            const { data } = response;
            const name = response.headers["content-disposition"].split("filename=");
            const fileName = name[1].split('"')[1];
            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", `${fileName}`); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {}
    };
};

const getChartsDashboard = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DASHBOARD_CHART_REQUEST });
            const res = await Service.getChartsDashboard(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.GET_DASHBOARD_CHART_SUCCESS, response: codeData });
                } else {
                    dispatch({ type: actionTypes.GET_DASHBOARD_CHART_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.GET_DASHBOARD_CHART_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_DASHBOARD_CHART_FAILURE, error: e.response && e.response.data });
        }
    };
};
const getChartsDashboardPython = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DASHBOARD_CHART_REQUEST });
            const res = await Service.getChartsDashboardPython(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                dispatch({ type: actionTypes.GET_DASHBOARD_CHART_SUCCESS, response: codeData });
            } else {
                dispatch({ type: actionTypes.GET_DASHBOARD_CHART_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_DASHBOARD_CHART_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getFciChart = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DASHBOARD_FCI_CHART_REQUEST });
            const res = await Service.getFciChart(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.GET_DASHBOARD_FCI_CHART_SUCCESS, response: codeData });
                } else {
                    dispatch({ type: actionTypes.GET_DASHBOARD_FCI_CHART_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.GET_DASHBOARD_FCI_CHART_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_DASHBOARD_FCI_CHART_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getMap = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DASHBOARD_MAP_CHART_REQUEST });
            const res = await Service.getMap(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.GET_DASHBOARD_MAP_CHART_SUCCESS, response: codeData });
                } else {
                    dispatch({ type: actionTypes.GET_DASHBOARD_MAP_CHART_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.GET_DASHBOARD_MAP_CHART_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_DASHBOARD_MAP_CHART_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getHorizontalChart = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DASHBOARD_HORIZONTAL_CHART_REQUEST });
            const res = await Service.getHorizontalChart(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.GET_DASHBOARD_HORIZONTAL_CHART_SUCCESS, response: codeData });
                } else {
                    dispatch({ type: actionTypes.GET_DASHBOARD_HORIZONTAL_CHART_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.GET_DASHBOARD_HORIZONTAL_CHART_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_DASHBOARD_HORIZONTAL_CHART_FAILURE, error: e.response && e.response.data });
        }
    };
};
const getHorizontalChartPython = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DASHBOARD_HORIZONTAL_CHART_REQUEST });
            const res = await Service.getChartsDashboardPython(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                dispatch({ type: actionTypes.GET_DASHBOARD_HORIZONTAL_CHART_SUCCESS, response: codeData });
            } else {
                dispatch({ type: actionTypes.GET_DASHBOARD_HORIZONTAL_CHART_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_DASHBOARD_HORIZONTAL_CHART_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getMasterFilter = (param, key) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FILTER_PROJECT_REQUEST });
            const res = await Service.getMasterFilter(param, key);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.GET_FILTER_PROJECT_SUCCESS, response: codeData, key: key });
                } else {
                    dispatch({ type: actionTypes.GET_FILTER_PROJECT_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.GET_FILTER_PROJECT_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_FILTER_PROJECT_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAllLegents = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LEGENTS_REQUEST });
            const res = await Service.getAllLegents(param);
            if (res && res.status === 200) {
                const codeData = res.data;
                if (codeData.success) {
                    dispatch({ type: actionTypes.GET_LEGENTS_SUCCESS, response: codeData });
                } else {
                    dispatch({ type: actionTypes.GET_LEGENTS_FAILURE, error: codeData });
                }
            } else {
                dispatch({ type: actionTypes.GET_LEGENTS_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_LEGENTS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const modifyFilter = (param, values, dashboardExtraFilters, backUpNames, backUpValues) => {
    return async dispatch => {
        let test = {
            param,
            values,
            dashboardExtraFilters,
            backUpNames,
            backUpValues
        };
        dispatch({ type: actionTypes.MODIFY_FILTER_REQUEST, response: test });
    };
};

const savePopUpData = data => {
    return async dispatch => {
        let test = {
            data
        };
        dispatch({ type: actionTypes.MODIFY_POP_UP_REQUEST, response: test });
    };
};

const getLandingPageData = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LANDING_PAGE_REQUEST });
            const res = await Service.getLandingPageData(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                // Midhun Mohan - To see response of landing page
                console.log(responseData, "midhun");
                dispatch({
                    type: actionTypes.GET_LANDING_PAGE_SUCCESS,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_LANDING_PAGE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_LANDING_PAGE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getLandingPageReports = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LANDING_PAGE_REPORT_REQUEST });
            const res = await Service.getLandingPageReports(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.GET_LANDING_PAGE_REPORT_SUCCESS,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_LANDING_PAGE_REPORT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_LANDING_PAGE_REPORT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getWidgetData = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_WIDGET_DATA_REQUEST });
            const res = await Service.getWidgetData(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.GET_WIDGET_DATA_SUCCESS,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_WIDGET_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_WIDGET_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateFullScreenValue = value => {
    return async dispatch => {
        try {
            dispatch({
                type: actionTypes.UPDATE_FULL_SCREEN_SUCCESS,
                response: value
            });
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_FULL_SCREEN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const toggleSecondChartView = value => {
    return async dispatch => {
        try {
            dispatch({
                type: actionTypes.UPDATE_IS_BUDGET_PRIORITY_VIEW_SUCCESS,
                response: value
            });
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_IS_BUDGET_PRIORITY_VIEW_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const accordianOpen = value => {
    return async dispatch => {
        dispatch({
            type: actionTypes.UPDATE_TRACKER_MENU_SUCCESS,
            response: value
        });
    };
};
const setActiveMenu = value => {
    return async dispatch => {
        dispatch({
            type: actionTypes.SET_ACTIVE_MENU_SUCCESS,
            response: value
        });
    };
};

export default {
    getDashboard,
    getChartsDashboard,
    getFciChart,
    getMap,
    getHorizontalChart,
    getMasterFilter,
    getAllLegents,
    modifyFilter,
    savePopUpData,
    getFcaChartExcelExport,
    getFciChartExcelExport,
    getHorizontalChartExport,
    getLandingPageData,
    getLandingPageReports,
    getWidgetData,
    updateFullScreenValue,
    toggleSecondChartView,
    accordianOpen,
    setActiveMenu,
    getChartsDashboardPython,
    getHorizontalChartPython
};
