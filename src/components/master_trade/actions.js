import * as actionTypes from "./constants";
import * as Service from "./services";

const getTrades = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TRADES_BASED_ON_BUILDING_REQUEST });
            const res = await Service.getTrades(params);
            if (res && res.status === 200) {
                const tradeData = res.data;
                if (tradeData.success) {
                    dispatch({
                        type: actionTypes.GET_TRADES_BASED_ON_BUILDING_SUCCESS,
                        response: tradeData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_TRADES_BASED_ON_BUILDING_FAILURE,
                        error: tradeData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_TRADES_BASED_ON_BUILDING_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_TRADES_BASED_ON_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addTrade = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_TRADE_REQUEST });
            const res = await Service.addTrade(params);
            if (res && res.status === 200) {
                const tradeData = res.data;
                if (tradeData.success) {
                    dispatch({ type: actionTypes.ADD_TRADE_SUCCESS, response: tradeData });
                } else {
                    dispatch({ type: actionTypes.ADD_TRADE_FAILURE, error: tradeData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_TRADE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_TRADE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateTrade = (trade_id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_TRADE_REQUEST });
            const res = await Service.updateTrade(trade_id, params);
            if (res && (res.status === 200 || res.status === 201)) {
                const tradeData = res.data;
                if (tradeData.success) {
                    dispatch({ type: actionTypes.UPDATE_TRADE_SUCCESS, response: tradeData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_TRADE_FAILURE, error: tradeData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_TRADE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_TRADE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteTrade = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_TRADE_REQUEST });
            const res = await Service.deleteTrade(id);
            if (res && res.status === 200) {
                const tradeData = res.data;
                if (tradeData.success) {
                    dispatch({ type: actionTypes.DELETE_TRADE_SUCCESS, response: tradeData });
                } else {
                    dispatch({ type: actionTypes.DELETE_TRADE_FAILURE, error: tradeData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_TRADE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_TRADE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getTradeById = trade_id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TRADE_BY_ID_REQUEST });
            const res = await Service.getTradeById(trade_id);
            if (res && res.status === 200) {
                const tradeData = res.data;
                if (tradeData.success) {
                    dispatch({ type: actionTypes.GET_TRADE_BY_ID_SUCCESS, response: tradeData });
                } else {
                    dispatch({ type: actionTypes.GET_TRADE_BY_ID_FAILURE, error: tradeData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_TRADE_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_TRADE_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateTradeEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_TRADE_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_TRADE_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const getListForCommonFilter = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilter(params);
            if (res && res.status === 200) {
                const tradeData = res.data;
                if (tradeData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: tradeData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: tradeData
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

const exportTrades = params => {
    console.log("paramxccxcs", params);
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TRADE_EXPORT_REQUEST });
            const response = await Service.exportTrades(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_TRADE_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_TRADE_EXPORT_SUCCESS, response: {} });
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

const getAllTradeLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_TRADE_LOG_REQUEST });
            const res = await Service.getAllTradeLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_TRADE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_TRADE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_TRADE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_TRADE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreTradeLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_TRADE_LOG_REQUEST });
            const res = await Service.restoreTradeLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_TRADE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_TRADE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_TRADE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_TRADE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteTradeLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_TRADE_LOG_REQUEST });
            const res = await Service.deleteTradeLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_TRADE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_TRADE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_TRADE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_TRADE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getTrades,
    addTrade,
    updateTrade,
    deleteTrade,
    getTradeById,
    updateTradeEntityParams,
    getListForCommonFilter,
    exportTrades,
    getAllTradeLogs,
    restoreTradeLog,
    deleteTradeLog
};
