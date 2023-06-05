import * as actionTypes from "./constants";
import * as Service from "./services";
//impo
const getDataList = (params, entity) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DOCUMENT_TYPE_REQUEST });
            const res = await Service.getDataList(params, entity);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_DOCUMENT_TYPE_SUCCESS,
                        response: regionData,
                        entity
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_DOCUMENT_TYPE_FAILURE,
                        error: regionData,
                        entity
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_DOCUMENT_TYPE_FAILURE,
                    error: res.response && res.response.data,
                    entity
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_DOCUMENT_TYPE_FAILURE,
                error: e.response && e.response.data,
                entity
            });
        }
    };
};
//add data api
const addData = (params, entity) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_DOCUMENT_TYPE_REQUEST });
            const res = await Service.addData(params, entity);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.ADD_DOCUMENT_TYPE_SUCCESS, response: regionData, entity });
                } else {
                    dispatch({ type: actionTypes.ADD_DOCUMENT_TYPE_FAILURE, error: regionData, entity });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_DOCUMENT_TYPE_FAILURE,
                    error: res.response && res.response.data,
                    entity
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_DOCUMENT_TYPE_FAILURE,
                error: e.response && e.response.data,
                entity
            });
        }
    };
};
//idbase data,single data when clik on a row
const getDataById = (id, entity) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DOCUMENT_TYPE_BY_ID_REQUEST });
            const res = await Service.getDataById(id, entity);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_DOCUMENT_TYPE_BY_ID_SUCCESS,
                        response: regionData,
                        entity
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_DOCUMENT_TYPE_BY_ID_FAILURE,
                        error: regionData,
                        entity
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_DOCUMENT_TYPE_BY_ID_FAILURE,
                    error: res.response && res.response.data,
                    entity
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_DOCUMENT_TYPE_BY_ID_FAILURE,
                error: e.response && e.response.data,
                entity
            });
        }
    };
};
//data update api
const updateData = (id, params, entity) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_DOCUMENT_TYPE_REQUEST });
            const res = await Service.updateData(id, params, entity);
            if (res && (res.status === 200 || res.status === 201)) {
                const building_typeData = res.data;
                if (building_typeData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_DOCUMENT_TYPE_SUCCESS,
                        response: building_typeData,
                        entity
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_DOCUMENT_TYPE_FAILURE,
                        error: building_typeData,
                        entity
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_DOCUMENT_TYPE_FAILURE,
                    error: res.response && res.response.data,
                    entity
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_DOCUMENT_TYPE_FAILURE,
                error: e.response && e.response.data,
                entity
            });
        }
    };
};

const updateDataEntityParams = (entityParams, entity) => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_DOCUMENT_TYPE_ENTITY_PARAMS_SUCCESS,
                    response: entityParams,
                    entity
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_DOCUMENT_TYPE_ENTITY_PARAMS_FAILURE,
                error: entityParams,
                entity
            });
        }
    };
};
//wild card filter api
const getListForCommonFilter = (params, entity) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilter(params, entity);
            if (res && res.status === 200) {
                const floorData = res.data;
                if (floorData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: floorData,
                        entity
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: floorData,
                        entity
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                    error: res.response && res.response.data,
                    entity
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                error: e.response && e.response.data,
                entity
            });
        }
    };
};

const exportData = (params, entity) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DOCUMENT_TYPE_EXPORT_REQUEST });
            const response = await Service.exportData(params, entity);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_DOCUMENT_TYPE_EXPORT_SUCCESS, response: { error: text.split('"')[3] }, entity });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_DOCUMENT_TYPE_EXPORT_SUCCESS, response: {}, entity });
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

const getAllDataLogs = (id, params, entity) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_DOCUMENT_TYPE_LOG_REQUEST });
            const res = await Service.getAllDataLogs(id, params, entity);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_DOCUMENT_TYPE_LOG_SUCCESS, response: regionData, entity });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_DOCUMENT_TYPE_LOG_FAILURE, error: regionData, entity });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_DOCUMENT_TYPE_LOG_FAILURE,
                    error: res.response && res.response.data,
                    entity
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_DOCUMENT_TYPE_LOG_FAILURE,
                error: e.response && e.response.data,
                entity
            });
        }
    };
};

const restoreDataLog = (id, entity) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_DOCUMENT_TYPE_LOG_REQUEST });
            const res = await Service.restoreDataLog(id, entity);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_DOCUMENT_TYPE_LOG_SUCCESS, response: regionData, entity });
                } else {
                    dispatch({ type: actionTypes.RESTORE_DOCUMENT_TYPE_LOG_FAILURE, error: regionData, entity });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_DOCUMENT_TYPE_LOG_FAILURE,
                    error: res.response && res.response.data,
                    entity
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_DOCUMENT_TYPE_LOG_FAILURE,
                error: e.response && e.response.data,
                entity
            });
        }
    };
};

const deleteDataLog = (id, entity) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_DOCUMENT_TYPE_LOG_REQUEST });
            const res = await Service.deleteDataLog(id, entity);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_DOCUMENT_TYPE_LOG_SUCCESS, response: regionData, entity });
                } else {
                    dispatch({ type: actionTypes.DELETE_DOCUMENT_TYPE_LOG_FAILURE, error: regionData, entity });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_DOCUMENT_TYPE_LOG_FAILURE,
                    error: res.response && res.response.data,
                    entity
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_DOCUMENT_TYPE_LOG_FAILURE,
                error: e.response && e.response.data,
                entity
            });
        }
    };
};

const deleteData = (id, entity) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_DOCUMENT_TYPE_REQUEST });
            const res = await Service.deleteData(id, entity);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_DOCUMENT_TYPE_SUCCESS, response: regionData, entity });
                } else {
                    dispatch({ type: actionTypes.DELETE_DOCUMENT_TYPE_FAILURE, error: regionData, entity });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_DOCUMENT_TYPE_FAILURE,
                    error: res.response && res.response.data,
                    entity
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_DOCUMENT_TYPE_FAILURE,
                error: e.response && e.response.data,
                entity
            });
        }
    };
};

//form dropdownil all clients name
const getDropdownList = (level, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CLIENT_DROPDOWN_REQUEST });
            const res = await Service.getDropdownList(level, params);
            if (res && res.status === 200) {
                const regionData = res.data; 
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_CLIENT_DROPDOWN_SUCCESS, response: regionData, level });
                } else {
                    dispatch({ type: actionTypes.GET_CLIENT_DROPDOWN_FAILURE, error: regionData, level });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CLIENT_DROPDOWN_FAILURE,
                    error: res.response && res.response.data,
                    level
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CLIENT_DROPDOWN_FAILURE,
                error: e.response && e.response.data,
                level
            });
        }
    };
};

export default {
    getDataList,
    addData,
    getDataById,
    updateData,
    updateDataEntityParams,
    getListForCommonFilter,
    exportData,
 getAllDataLogs,
    restoreDataLog,
    deleteDataLog,
    deleteData,
    getDropdownList //used for client drop down
    // updateDataPiechart
};
