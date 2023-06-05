import * as actionTypes from "./constants";
import * as Service from "./services";

const getSystems = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SYSTEMS_REQUEST });
            const res = await Service.getSystems(params);
            if (res && res.status === 200) {
                const systemData = res.data;
                if (systemData.success) {
                    dispatch({
                        type: actionTypes.GET_SYSTEMS_SUCCESS,
                        response: systemData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SYSTEMS_FAILURE,
                        error: systemData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SYSTEMS_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SYSTEMS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getTradeDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TRADE_DROPDOWN_REQUEST });
            const res = await Service.getTradeDropdown(params);
            if (res && res.status === 200) {
                const systemData = res.data;
                if (systemData.success) {
                    dispatch({
                        type: actionTypes.GET_TRADE_DROPDOWN_SUCCESS,
                        response: systemData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_TRADE_DROPDOWN_FAILURE,
                        error: systemData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_TRADE_DROPDOWN_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_TRADE_DROPDOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addSystem = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_SYSTEM_REQUEST });
            const res = await Service.addSystem(params);
            if (res && res.status === 200) {
                const systemData = res.data;
                if (systemData.success) {
                    dispatch({ type: actionTypes.ADD_SYSTEM_SUCCESS, response: systemData });
                } else {
                    dispatch({ type: actionTypes.ADD_SYSTEM_FAILURE, error: systemData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_SYSTEM_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_SYSTEM_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateSystem = (system_id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_SYSTEM_REQUEST });
            const res = await Service.updateSystem(system_id, params);
            if (res && (res.status === 200 || res.status === 201)) {
                const systemData = res.data;
                if (systemData.success) {
                    dispatch({ type: actionTypes.UPDATE_SYSTEM_SUCCESS, response: systemData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_SYSTEM_FAILURE, error: systemData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_SYSTEM_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SYSTEM_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteSystem = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SYSTEM_REQUEST });
            const res = await Service.deleteSystem(id);
            if (res && res.status === 200) {
                const systemData = res.data;
                if (systemData.success) {
                    dispatch({ type: actionTypes.DELETE_SYSTEM_SUCCESS, response: systemData });
                } else {
                    dispatch({ type: actionTypes.DELETE_SYSTEM_FAILURE, error: systemData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_SYSTEM_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_SYSTEM_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSystemById = system_id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SYSTEM_BY_ID_REQUEST });
            const res = await Service.getSystemById(system_id);
            if (res && res.status === 200) {
                const systemData = res.data;
                if (systemData.success) {
                    dispatch({ type: actionTypes.GET_SYSTEM_BY_ID_SUCCESS, response: systemData });
                } else {
                    dispatch({ type: actionTypes.GET_SYSTEM_BY_ID_FAILURE, error: systemData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SYSTEM_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SYSTEM_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateSystemEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_SYSTEM_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SYSTEM_ENTITY_PARAMS_FAILURE,
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
                const systemData = res.data;
                if (systemData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: systemData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: systemData
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

const exportSystems = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SYSTEM_EXPORT_REQUEST });
            const response = await Service.exportSystems(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_SYSTEM_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_SYSTEM_EXPORT_SUCCESS, response: {} });
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

const getAllSystemLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_SYSTEM_LOG_REQUEST });
            const res = await Service.getAllSystemLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_SYSTEM_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_SYSTEM_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_SYSTEM_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_SYSTEM_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreSystemLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_SYSTEM_LOG_REQUEST });
            const res = await Service.restoreSystemLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_SYSTEM_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_SYSTEM_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_SYSTEM_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_SYSTEM_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteSystemLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SYSTEM_LOG_REQUEST });
            const res = await Service.deleteSystemLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_SYSTEM_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_SYSTEM_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_SYSTEM_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_SYSTEM_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getSystems,
    addSystem,
    updateSystem,
    deleteSystem,
    getSystemById,
    updateSystemEntityParams,
    getListForCommonFilter,
    exportSystems,
    getAllSystemLogs,
    restoreSystemLog,
    deleteSystemLog,
    getTradeDropdown
};
