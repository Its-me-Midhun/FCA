import * as actionTypes from "./constants";
import * as Service from "./services";

const addPriority = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_PRIORITY_REQUEST });
            const res = await Service.addPriority(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.ADD_PRIORITY_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.ADD_PRIORITY_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_PRIORITY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_PRIORITY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getPriority = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PRIORITY_REQUEST });
            const res = await Service.getPriority(params, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_PRIORITY_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_PRIORITY_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_PRIORITY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_PRIORITY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getPriorityById = (id, subsystemid) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PRIORITY_BY_ID_REQUEST });
            const res = await Service.getPriorityById(id, subsystemid);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_PRIORITY_BY_ID_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_PRIORITY_BY_ID_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_PRIORITY_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_PRIORITY_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updatePriority = (projectId, subsystemId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_PRIORITY_REQUEST });
            const res = await Service.updatePriority(projectId, subsystemId, params);
            if (res && (res.status === 200 || res.status === 201)) {
                const building_typeData = res.data;
                if (building_typeData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_PRIORITY_SUCCESS,
                        response: building_typeData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_PRIORITY_FAILURE,
                        error: building_typeData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_PRIORITY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_PRIORITY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deletePriority = (id, subsystemId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_PRIORITY_REQUEST });
            const res = await Service.deletePriority(id, subsystemId);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.DELETE_PRIORITY_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({ type: actionTypes.DELETE_PRIORITY_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_PRIORITY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_PRIORITY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updatePriorityEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_PRIORITY_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_PRIORITY_ENTITY_PARAMS_FAILURE,
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

const exportPrioritySettings = (projectId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PRIORITY_EXPORT_REQUEST });
            const response = await Service.exportPrioritySettings(projectId, params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1]==="error") {
                    dispatch({ type: actionTypes.GET_PRIORITY_EXPORT_SUCCESS, response: {error:text.split('"')[3]} });
                    return true;
                }
                else{
                    dispatch({ type: actionTypes.GET_PRIORITY_EXPORT_SUCCESS, response: {}});
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

const getAllPriorityLogs = (id,params,projectId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_PRIORITY_LOG_REQUEST });
            const res = await Service.getAllPriorityLogs(id,params,projectId);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_PRIORITY_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_PRIORITY_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_PRIORITY_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_PRIORITY_LOG_FAILURE,
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

const getSitesByRegionInPriority = (id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SITES_BY_REGION_IN_PRIORITY_REQUEST });
            const res = await Service.getSitesByRegionInPriority(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                dispatch({
                    type: actionTypes.GET_SITES_BY_REGION_IN_PRIORITY_SUCCESS,
                    response: regionData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_SITES_BY_REGION_IN_PRIORITY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SITES_BY_REGION_IN_PRIORITY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};


export default {
    addPriority,
    getPriority,
    getPriorityById,
    updatePriority,
    deletePriority,
    updatePriorityEntityParams,
    getListForCommonFilter,
    exportPrioritySettings,
    getAllPriorityLogs,
    restoreSettingsLog,
    deleteSettingsLog,
    getSitesByRegionInPriority
};
