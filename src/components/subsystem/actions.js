import * as actionTypes from "./constants";
import * as Service from "./services";

const getSubsystemSettingsData = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SUB_SYSTEM_SETTINGS_DATA_REQUEST });
            const res = await Service.getSubsystemSettingsData(params, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_SUB_SYSTEM_SETTINGS_DATA_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SUB_SYSTEM_SETTINGS_DATA_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SUB_SYSTEM_SETTINGS_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SUB_SYSTEM_SETTINGS_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addSubsystem = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_SUB_SYSTEM_REQUEST });
            const res = await Service.addSubsystem(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.ADD_SUB_SYSTEM_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.ADD_SUB_SYSTEM_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_SUB_SYSTEM_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_SUB_SYSTEM_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSubsystemById = (id, subsystemid) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SUB_SYSTEM_BY_ID_REQUEST });
            const res = await Service.getSubsystemById(id, subsystemid);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_SUB_SYSTEM_BY_ID_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SUB_SYSTEM_BY_ID_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SUB_SYSTEM_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SUB_SYSTEM_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateSubsystem = (projectId, subsystemId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_SUB_SYSTEM_REQUEST });
            const res = await Service.updateSubsystem(projectId, subsystemId, params);
            if (res && (res.status === 200 || res.status === 201)) {
                const building_typeData = res.data;
                if (building_typeData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_SUB_SYSTEM_SUCCESS,
                        response: building_typeData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_SUB_SYSTEM_FAILURE,
                        error: building_typeData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_SUB_SYSTEM_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SUB_SYSTEM_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteSubsystem = (id, subsystemId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SUB_SYSTEM_REQUEST });
            const res = await Service.deleteSubsystem(id, subsystemId);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.DELETE_SUB_SYSTEM_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({ type: actionTypes.DELETE_SUB_SYSTEM_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_SUB_SYSTEM_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_SUB_SYSTEM_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateSubsystemEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_SUB_SYSTEM_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SUB_SYSTEM_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const getListForCommonFilter = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilter(params, id);
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
const getTradeSettingsDropdown = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TRADE_SETTINGS_DROPDOWN_REQUEST });
            const res = await Service.getTradeSettingsDropdown(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_TRADE_SETTINGS_DROPDOWN_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_TRADE_SETTINGS_DROPDOWN_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_TRADE_SETTINGS_DROPDOWN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_TRADE_SETTINGS_DROPDOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getSystemSettingsDropdown = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SYSTEM_SETTINGS_BY_TRADE_REQUEST });
            const res = await Service.getSystemSettingsDropdown(params, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_SYSTEM_SETTINGS_BY_TRADE_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SYSTEM_SETTINGS_BY_TRADE_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SYSTEM_SETTINGS_BY_TRADE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SYSTEM_SETTINGS_BY_TRADE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const exportSubSystemSettings = (projectId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SUB_SYSTEM_EXPORT_REQUEST });
            const response = await Service.exportSubSystemSettings(projectId, params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1]==="error") {
                    dispatch({ type: actionTypes.GET_SUB_SYSTEM_EXPORT_SUCCESS, response: {error:text.split('"')[3]} });
                    return true;
                }
                else{
                    dispatch({ type: actionTypes.GET_SUB_SYSTEM_EXPORT_SUCCESS, response: {}});
                }
            }
            const { data } = response;
            const name = response.headers['content-disposition'].split('filename=');
            const fileName = name[1].split('"')[1];
            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `${fileName}`); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
        }
    };
};

const getAllSubSystemLogs = (id, params, projectId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_SUB_SYSTEM_LOG_REQUEST });
            const res = await Service.getAllSubSystemLogs(id, params, projectId);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_SUB_SYSTEM_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_SUB_SYSTEM_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_SUB_SYSTEM_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_SUB_SYSTEM_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreSettingsLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_SETTINGS_LOG_REQUEST });
            const res = await Service.restoreSettingsLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_SETTINGS_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_SETTINGS_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_SETTINGS_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_SETTINGS_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteSettingsLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SETTINGS_LOG_REQUEST });
            const res = await Service.deleteSettingsLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_SETTINGS_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_SETTINGS_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_SETTINGS_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_SETTINGS_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getSubsystemSettingsData,
    addSubsystem,
    getSubsystemById,
    updateSubsystem,
    deleteSubsystem,
    getSystemSettingsDropdown,
    getTradeSettingsDropdown,
    updateSubsystemEntityParams,
    getListForCommonFilter,
    exportSubSystemSettings,
    getAllSubSystemLogs,
    restoreSettingsLog,
    deleteSettingsLog
};
