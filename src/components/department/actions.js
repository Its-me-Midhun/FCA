import * as actionTypes from "./constants";
import * as Service from "./services";

const getDepartmentSettingsData = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DEPARTMENT_SETTINGS_DATA_REQUEST });
            const res = await Service.getDepartmentSettingsData(params, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_DEPARTMENT_SETTINGS_DATA_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_DEPARTMENT_SETTINGS_DATA_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_DEPARTMENT_SETTINGS_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_DEPARTMENT_SETTINGS_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addDepartment = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_DEPARTMENT_REQUEST });
            const res = await Service.addDepartment(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.ADD_DEPARTMENT_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.ADD_DEPARTMENT_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_DEPARTMENT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_DEPARTMENT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getDepartmentById = (id, subsystemid) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DEPARTMENT_BY_ID_REQUEST });
            const res = await Service.getDepartmentById(id, subsystemid);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_DEPARTMENT_BY_ID_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_DEPARTMENT_BY_ID_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_DEPARTMENT_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_DEPARTMENT_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateDepartment = (projectId, subsystemId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_DEPARTMENT_REQUEST });
            const res = await Service.updateDepartment(projectId, subsystemId, params);
            if (res && (res.status === 200 || res.status === 201)) {
                const building_typeData = res.data;
                if (building_typeData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_DEPARTMENT_SUCCESS,
                        response: building_typeData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_DEPARTMENT_FAILURE,
                        error: building_typeData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_DEPARTMENT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_DEPARTMENT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteDepartment = (id, subsystemId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_DEPARTMENT_REQUEST });
            const res = await Service.deleteDepartment(id, subsystemId);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.DELETE_DEPARTMENT_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({ type: actionTypes.DELETE_DEPARTMENT_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_DEPARTMENT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_DEPARTMENT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateDepartmentEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_DEPARTMENT_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_DEPARTMENT_ENTITY_PARAMS_FAILURE,
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

const exportDepartmentSettings = (projectId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DEPARTMENT_EXPORT_REQUEST });
            const response = await Service.exportDepartmentSettings(projectId, params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1]==="error") {
                    dispatch({ type: actionTypes.GET_DEPARTMENT_EXPORT_SUCCESS, response: {error:text.split('"')[3]} });
                    return true;
                }
                else{
                    dispatch({ type: actionTypes.GET_DEPARTMENT_EXPORT_SUCCESS, response: {}});
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

const getAllDepartmentLogs = (id, params, projectId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_DEPARTMENT_LOG_REQUEST });
            const res = await Service.getAllDepartmentLogs(id, params, projectId);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_DEPARTMENT_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_DEPARTMENT_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_DEPARTMENT_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_DEPARTMENT_LOG_FAILURE,
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
    getDepartmentSettingsData,
    addDepartment,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    updateDepartmentEntityParams,
    getListForCommonFilter,
    exportDepartmentSettings,
    getAllDepartmentLogs,
    restoreSettingsLog,
    deleteSettingsLog
};
