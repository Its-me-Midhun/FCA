import * as actionTypes from "./constants";
import * as Service from "./services";

const getSubSystems = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_MASTER_SUBSYSTEMS_REQUEST });
            const res = await Service.getSubSystems(params);
            if (res && res.status === 200) {
                const subSystemData = res.data;
                if (subSystemData.success) {
                    dispatch({
                        type: actionTypes.GET_MASTER_SUBSYSTEMS_SUCCESS,
                        response: subSystemData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_MASTER_SUBSYSTEMS_FAILURE,
                        error: subSystemData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_MASTER_SUBSYSTEMS_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_MASTER_SUBSYSTEMS_FAILURE,
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
                const subSystemData = res.data;
                if (subSystemData.success) {
                    dispatch({
                        type: actionTypes.GET_TRADE_DROPDOWN_SUCCESS,
                        response: subSystemData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_TRADE_DROPDOWN_FAILURE,
                        error: subSystemData
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

const getSystemByTradeDropdown = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SYSTEM_BY_TRADE_DROPDOWN_REQUEST });
            const res = await Service.getSystemByTradeDropdown(id);
            if (res && res.status === 200) {
                const subSystemData = res.data;
                if (subSystemData.success) {
                    dispatch({
                        type: actionTypes.GET_SYSTEM_BY_TRADE_DROPDOWN_SUCCESS,
                        response: subSystemData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SYSTEM_BY_TRADE_DROPDOWN_FAILURE,
                        error: subSystemData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SYSTEM_BY_TRADE_DROPDOWN_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SYSTEM_BY_TRADE_DROPDOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addSubSystem = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_MASTER_SUBSYSTEM_REQUEST });
            const res = await Service.addSubSystem(params);
            if (res && res.status === 200) {
                const subSystemData = res.data;
                if (subSystemData.success) {
                    dispatch({ type: actionTypes.ADD_MASTER_SUBSYSTEM_SUCCESS, response: subSystemData });
                } else {
                    dispatch({ type: actionTypes.ADD_MASTER_SUBSYSTEM_FAILURE, error: subSystemData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_MASTER_SUBSYSTEM_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_MASTER_SUBSYSTEM_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateSubSystem = (subSystem_id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_MASTER_SUBSYSTEM_REQUEST });
            const res = await Service.updateSubSystem(subSystem_id, params);
            if (res && (res.status === 200 || res.status === 201)) {
                const subSystemData = res.data;
                if (subSystemData.success) {
                    dispatch({ type: actionTypes.UPDATE_MASTER_SUBSYSTEM_SUCCESS, response: subSystemData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_MASTER_SUBSYSTEM_FAILURE, error: subSystemData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_MASTER_SUBSYSTEM_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_MASTER_SUBSYSTEM_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteSubSystem = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_MASTER_SUBSYSTEM_REQUEST });
            const res = await Service.deleteSubSystem(id);
            if (res && res.status === 200) {
                const subSystemData = res.data;
                if (subSystemData.success) {
                    dispatch({ type: actionTypes.DELETE_MASTER_SUBSYSTEM_SUCCESS, response: subSystemData });
                } else {
                    dispatch({ type: actionTypes.DELETE_MASTER_SUBSYSTEM_FAILURE, error: subSystemData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_MASTER_SUBSYSTEM_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_MASTER_SUBSYSTEM_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSubSystemById = subSystem_id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_MASTER_SUBSYSTEM_BY_ID_REQUEST });
            const res = await Service.getSubSystemById(subSystem_id);
            if (res && res.status === 200) {
                const subSystemData = res.data;
                if (subSystemData.success) {
                    dispatch({ type: actionTypes.GET_MASTER_SUBSYSTEM_BY_ID_SUCCESS, response: subSystemData });
                } else {
                    dispatch({ type: actionTypes.GET_MASTER_SUBSYSTEM_BY_ID_FAILURE, error: subSystemData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_MASTER_SUBSYSTEM_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_MASTER_SUBSYSTEM_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateSubSystemEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_MASTER_SUBSYSTEM_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_MASTER_SUBSYSTEM_ENTITY_PARAMS_FAILURE,
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
                const subSystemData = res.data;
                if (subSystemData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: subSystemData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: subSystemData
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

const exportSubSystems = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_MASTER_SUBSYSTEM_EXPORT_REQUEST });
            const response = await Service.exportSubSystems(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_MASTER_SUBSYSTEM_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_MASTER_SUBSYSTEM_EXPORT_SUCCESS, response: {} });
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

const getAllSubSystemLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_MASTER_SUBSYSTEM_LOG_REQUEST });
            const res = await Service.getAllSubSystemLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_MASTER_SUBSYSTEM_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_MASTER_SUBSYSTEM_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_MASTER_SUBSYSTEM_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_MASTER_SUBSYSTEM_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreSubSystemLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_MASTER_SUBSYSTEM_LOG_REQUEST });
            const res = await Service.restoreSubSystemLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_MASTER_SUBSYSTEM_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_MASTER_SUBSYSTEM_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_MASTER_SUBSYSTEM_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_MASTER_SUBSYSTEM_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteSubSystemLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_MASTER_SUBSYSTEM_LOG_REQUEST });
            const res = await Service.deleteSubSystemLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_MASTER_SUBSYSTEM_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_MASTER_SUBSYSTEM_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_MASTER_SUBSYSTEM_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_MASTER_SUBSYSTEM_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getSubSystems,
    addSubSystem,
    updateSubSystem,
    deleteSubSystem,
    getSubSystemById,
    updateSubSystemEntityParams,
    getListForCommonFilter,
    exportSubSystems,
    getAllSubSystemLogs,
    restoreSubSystemLog,
    deleteSubSystemLog,
    getTradeDropdown,
    getSystemByTradeDropdown
};
