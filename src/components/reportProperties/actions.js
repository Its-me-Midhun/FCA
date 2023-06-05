import * as actionTypes from "./constants";
import * as Service from "./services";

const getProperties = (params, project_id) => {
    params.project_id = project_id;
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PROPERTIES_REQUEST });
            const res = await Service.getProperties(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_PROPERTIES_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_PROPERTIES_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_PROPERTIES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_PROPERTIES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addProperty = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_PROPERTY_REQUEST });
            const res = await Service.addProperty(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.ADD_PROPERTY_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.ADD_PROPERTY_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_PROPERTY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_PROPERTY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getPropertyById = (id, tradeid) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PROPERTY_BY_ID_REQUEST });
            const res = await Service.getPropertyById(id, tradeid);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_PROPERTY_BY_ID_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_PROPERTY_BY_ID_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_PROPERTY_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_PROPERTY_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateProperty = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_PROPERTY_REQUEST });
            const res = await Service.updateProperty(params.id, params);
            if (res && (res.status === 200 || res.status === 201)) {
                const building_typeData = res.data;
                if (building_typeData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_PROPERTY_SUCCESS,
                        response: building_typeData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_PROPERTY_FAILURE,
                        error: building_typeData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_PROPERTY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_PROPERTY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updatePropertyEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_PROPERTY_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_PROPERTY_ENTITY_PARAMS_FAILURE,
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

const exportProperty = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PROPERTY_EXPORT_REQUEST });
            const response = await Service.exportProperty(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_PROPERTY_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_PROPERTY_EXPORT_SUCCESS, response: {} });
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

const getAllPropertyLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_PROPERTY_LOG_REQUEST });
            const res = await Service.getAllPropertyLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_PROPERTY_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_PROPERTY_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_PROPERTY_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_PROPERTY_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restorePropertyLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_PROPERTY_LOG_REQUEST });
            const res = await Service.restorePropertyLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_PROPERTY_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_PROPERTY_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_PROPERTY_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_PROPERTY_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deletePropertyLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_PROPERTY_LOG_REQUEST });
            const res = await Service.deletePropertyLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_PROPERTY_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_PROPERTY_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_PROPERTY_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_PROPERTY_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteProperty = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_PROPERTY_REQUEST });
            const res = await Service.deleteProperty(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_PROPERTY_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_PROPERTY_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_PROPERTY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_PROPERTY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const restoreProperty = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_PROPERTY_REQUEST });
            const res = await Service.restoreProperty(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.status) {
                    dispatch({ type: actionTypes.RESTORE_PROPERTY_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_PROPERTY_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_PROPERTY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_PROPERTY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const checkPropertyMapped = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.CHECK_PROPERTY_REQUEST });
            const res = await Service.checkPropertyMapped(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.CHECK_PROPERTY_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.CHECK_PROPERTY_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.CHECK_PROPERTY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.CHECK_PROPERTY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getDropdownList = entity => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PROPERTY_DROPDOWN_REQUEST });
            const res = await Service.getDropdownList(entity);
            if (res && res.status === 200) {
                const regionData = res.data;
                dispatch({ type: actionTypes.GET_PROPERTY_DROPDOWN_SUCCESS, response: regionData, entity });
            } else {
                dispatch({
                    type: actionTypes.GET_PROPERTY_DROPDOWN_FAILURE,
                    error: res.response && res.response.data,
                    entity
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_PROPERTY_DROPDOWN_FAILURE,
                error: e.response && e.response.data,
                entity
            });
        }
    };
};

export default {
    getProperties,
    addProperty,
    getPropertyById,
    updateProperty,
    updatePropertyEntityParams,
    getListForCommonFilter,
    exportProperty,
    getAllPropertyLogs,
    restorePropertyLog,
    deletePropertyLog,
    deleteProperty,
    restoreProperty,
    checkPropertyMapped,
    getDropdownList
};
