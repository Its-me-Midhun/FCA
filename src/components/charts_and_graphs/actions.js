import * as actionTypes from "./constants";
import * as Service from "./services";

const getChartsAndGraphs = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHARTS_AND_GRAPHS_REQUEST });
            const res = await Service.getChartsAndGraphs(params, dynamicUrl);
            if (res && res.status === 200) {
                const chartsAndGraphsData = res.data;
                if (chartsAndGraphsData.success) {
                    dispatch({
                        type: actionTypes.GET_CHARTS_AND_GRAPHS_SUCCESS,
                        response: chartsAndGraphsData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_CHARTS_AND_GRAPHS_FAILURE,
                        error: chartsAndGraphsData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHARTS_AND_GRAPHS_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHARTS_AND_GRAPHS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addChartsAndGraphs = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_CHARTS_AND_GRAPHS_REQUEST });
            const res = await Service.addChartsAndGraphs(params, dynamicUrl);
            if (res && res.status === 200) {
                const chartsAndGraphsData = res.data;
                if (chartsAndGraphsData.success) {
                    dispatch({ type: actionTypes.ADD_CHARTS_AND_GRAPHS_SUCCESS, response: chartsAndGraphsData });
                } else {
                    dispatch({ type: actionTypes.ADD_CHARTS_AND_GRAPHS_FAILURE, error: chartsAndGraphsData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_CHARTS_AND_GRAPHS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_CHARTS_AND_GRAPHS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateChartsAndGraphs = (chartsAndGraphs_id, params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_CHARTS_AND_GRAPHS_REQUEST });
            const res = await Service.updateChartsAndGraphs(chartsAndGraphs_id, params, dynamicUrl);
            if (res && (res.status === 200 || res.status === 201)) {
                const chartsAndGraphsData = res.data;
                if (chartsAndGraphsData.success) {
                    dispatch({ type: actionTypes.UPDATE_CHARTS_AND_GRAPHS_SUCCESS, response: chartsAndGraphsData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_CHARTS_AND_GRAPHS_FAILURE, error: chartsAndGraphsData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_CHARTS_AND_GRAPHS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CHARTS_AND_GRAPHS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteChartsAndGraphs = (id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CHARTS_AND_GRAPHS_REQUEST });
            const res = await Service.deleteChartsAndGraphs(id, dynamicUrl);
            if (res && res.status === 200) {
                const chartsAndGraphsData = res.data;
                if (chartsAndGraphsData.success) {
                    dispatch({ type: actionTypes.DELETE_CHARTS_AND_GRAPHS_SUCCESS, response: chartsAndGraphsData });
                } else {
                    dispatch({ type: actionTypes.DELETE_CHARTS_AND_GRAPHS_FAILURE, error: chartsAndGraphsData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_CHARTS_AND_GRAPHS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_CHARTS_AND_GRAPHS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getChartsAndGraphsById = (chartsAndGraphs_id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHARTS_AND_GRAPHS_BY_ID_REQUEST });
            const res = await Service.getChartsAndGraphsById(chartsAndGraphs_id, dynamicUrl);
            if (res && res.status === 200) {
                const chartsAndGraphsData = res.data;
                if (chartsAndGraphsData.success) {
                    dispatch({ type: actionTypes.GET_CHARTS_AND_GRAPHS_BY_ID_SUCCESS, response: chartsAndGraphsData });
                } else {
                    dispatch({ type: actionTypes.GET_CHARTS_AND_GRAPHS_BY_ID_FAILURE, error: chartsAndGraphsData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHARTS_AND_GRAPHS_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHARTS_AND_GRAPHS_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateChartsAndGraphsEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_CHARTS_AND_GRAPHS_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CHARTS_AND_GRAPHS_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const getListForCommonFilter = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilter(params, dynamicUrl);
            if (res && res.status === 200) {
                const chartsAndGraphsData = res.data;
                if (chartsAndGraphsData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: chartsAndGraphsData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: chartsAndGraphsData
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

const exportChartsAndGraphs = (dynamicUrl, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHARTS_AND_GRAPHS_EXPORT_REQUEST });
            const response = await Service.exportChartsAndGraphs(dynamicUrl, params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_CHARTS_AND_GRAPHS_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_CHARTS_AND_GRAPHS_EXPORT_SUCCESS, response: {} });
                }
            }
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

const getAllChartsAndGraphsLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CHARTS_AND_GRAPHS_LOG_REQUEST });
            const res = await Service.getAllChartsAndGraphsLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_CHARTS_AND_GRAPHS_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CHARTS_AND_GRAPHS_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_CHARTS_AND_GRAPHS_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_CHARTS_AND_GRAPHS_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreChartsAndGraphsLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_CHARTS_AND_GRAPHS_LOG_REQUEST });
            const res = await Service.restoreChartsAndGraphsLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_CHARTS_AND_GRAPHS_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_CHARTS_AND_GRAPHS_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_CHARTS_AND_GRAPHS_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_CHARTS_AND_GRAPHS_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteChartsAndGraphsLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CHARTS_AND_GRAPHS_LOG_REQUEST });
            const res = await Service.deleteChartsAndGraphsLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_CHARTS_AND_GRAPHS_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_CHARTS_AND_GRAPHS_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_CHARTS_AND_GRAPHS_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_CHARTS_AND_GRAPHS_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getChartsAndGraphs,
    addChartsAndGraphs,
    updateChartsAndGraphs,
    deleteChartsAndGraphs,
    getChartsAndGraphsById,
    updateChartsAndGraphsEntityParams,
    getListForCommonFilter,
    exportChartsAndGraphs,
    getAllChartsAndGraphsLogs,
    restoreChartsAndGraphsLog,
    deleteChartsAndGraphsLog
};
