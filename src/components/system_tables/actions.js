import * as actionTypes from "./constants";
import * as Service from "./services";

const getSystemTables = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SYSTEM_TABLES_REQUEST });
            const res = await Service.getSystemTables(params, dynamicUrl);
            if (res && res.status === 200) {
                const systemTablesData = res.data;
                if (systemTablesData.success) {
                    dispatch({
                        type: actionTypes.GET_SYSTEM_TABLES_SUCCESS,
                        response: systemTablesData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SYSTEM_TABLES_FAILURE,
                        error: systemTablesData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SYSTEM_TABLES_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SYSTEM_TABLES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addSystemTables = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_SYSTEM_TABLES_REQUEST });
            const res = await Service.addSystemTables(params, dynamicUrl);
            if (res && res.status === 200) {
                const systemTablesData = res.data;
                if (systemTablesData.success) {
                    dispatch({ type: actionTypes.ADD_SYSTEM_TABLES_SUCCESS, response: systemTablesData });
                } else {
                    dispatch({ type: actionTypes.ADD_SYSTEM_TABLES_FAILURE, error: systemTablesData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_SYSTEM_TABLES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_SYSTEM_TABLES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateSystemTables = (systemTables_id, params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_SYSTEM_TABLES_REQUEST });
            const res = await Service.updateSystemTables(systemTables_id, params, dynamicUrl);
            if (res && (res.status === 200 || res.status === 201)) {
                const systemTablesData = res.data;
                if (systemTablesData.success) {
                    dispatch({ type: actionTypes.UPDATE_SYSTEM_TABLES_SUCCESS, response: systemTablesData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_SYSTEM_TABLES_FAILURE, error: systemTablesData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_SYSTEM_TABLES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SYSTEM_TABLES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteSystemTables = (id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SYSTEM_TABLES_REQUEST });
            const res = await Service.deleteSystemTables(id, dynamicUrl);
            if (res && res.status === 200) {
                const systemTablesData = res.data;
                if (systemTablesData.success) {
                    dispatch({ type: actionTypes.DELETE_SYSTEM_TABLES_SUCCESS, response: systemTablesData });
                } else {
                    dispatch({ type: actionTypes.DELETE_SYSTEM_TABLES_FAILURE, error: systemTablesData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_SYSTEM_TABLES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_SYSTEM_TABLES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSystemTablesById = (systemTables_id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SYSTEM_TABLES_BY_ID_REQUEST });
            const res = await Service.getSystemTablesById(systemTables_id, dynamicUrl);
            if (res && res.status === 200) {
                const systemTablesData = res.data;
                if (systemTablesData.success) {
                    dispatch({ type: actionTypes.GET_SYSTEM_TABLES_BY_ID_SUCCESS, response: systemTablesData });
                } else {
                    dispatch({ type: actionTypes.GET_SYSTEM_TABLES_BY_ID_FAILURE, error: systemTablesData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SYSTEM_TABLES_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SYSTEM_TABLES_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateSystemTablesEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_SYSTEM_TABLES_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SYSTEM_TABLES_ENTITY_PARAMS_FAILURE,
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
                const systemTablesData = res.data;
                if (systemTablesData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: systemTablesData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: systemTablesData
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

const exportSystemTables = (dynamicUrl, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SYSTEM_TABLES_EXPORT_REQUEST });
            const response = await Service.exportSystemTables(dynamicUrl, params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_SYSTEM_TABLES_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_SYSTEM_TABLES_EXPORT_SUCCESS, response: {} });
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

const getAllSystemTablesLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_SYSTEM_TABLES_LOG_REQUEST });
            const res = await Service.getAllSystemTablesLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_SYSTEM_TABLES_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_SYSTEM_TABLES_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_SYSTEM_TABLES_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_SYSTEM_TABLES_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreSystemTablesLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_SYSTEM_TABLES_LOG_REQUEST });
            const res = await Service.restoreSystemTablesLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_SYSTEM_TABLES_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_SYSTEM_TABLES_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_SYSTEM_TABLES_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_SYSTEM_TABLES_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteSystemTablesLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SYSTEM_TABLES_LOG_REQUEST });
            const res = await Service.deleteSystemTablesLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_SYSTEM_TABLES_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_SYSTEM_TABLES_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_SYSTEM_TABLES_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_SYSTEM_TABLES_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getSystemTables,
    addSystemTables,
    updateSystemTables,
    deleteSystemTables,
    getSystemTablesById,
    updateSystemTablesEntityParams,
    getListForCommonFilter,
    exportSystemTables,
    getAllSystemTablesLogs,
    restoreSystemTablesLog,
    deleteSystemTablesLog
};
