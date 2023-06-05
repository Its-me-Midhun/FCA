import * as actionTypes from "./constants";
import * as Service from "./services";

const getTableTemplates = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TABLE_TEMPLATES_REQUEST });
            const res = await Service.getTableTemplates(params, dynamicUrl);
            if (res && res.status === 200) {
                const tableTemplateData = res.data;
                if (tableTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_TABLE_TEMPLATES_SUCCESS,
                        response: tableTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_TABLE_TEMPLATES_FAILURE,
                        error: tableTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_TABLE_TEMPLATES_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_TABLE_TEMPLATES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addTableTemplate = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_TABLE_TEMPLATE_REQUEST });
            const res = await Service.addTableTemplate(params, dynamicUrl);
            if (res && res.status === 200) {
                const tableTemplateData = res.data;
                if (tableTemplateData.success) {
                    dispatch({ type: actionTypes.ADD_TABLE_TEMPLATE_SUCCESS, response: tableTemplateData });
                } else {
                    dispatch({ type: actionTypes.ADD_TABLE_TEMPLATE_FAILURE, error: tableTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_TABLE_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_TABLE_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateTableTemplate = (tableTemplate_id, params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_TABLE_TEMPLATE_REQUEST });
            const res = await Service.updateTableTemplate(tableTemplate_id, params, dynamicUrl);
            if (res && (res.status === 200 || res.status === 201)) {
                const tableTemplateData = res.data;
                if (tableTemplateData.success) {
                    dispatch({ type: actionTypes.UPDATE_TABLE_TEMPLATE_SUCCESS, response: tableTemplateData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_TABLE_TEMPLATE_FAILURE, error: tableTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_TABLE_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_TABLE_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteTableTemplate = (id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_TABLE_TEMPLATE_REQUEST });
            const res = await Service.deleteTableTemplate(id, dynamicUrl);
            if (res && res.status === 200) {
                const tableTemplateData = res.data;
                if (tableTemplateData.success) {
                    dispatch({ type: actionTypes.DELETE_TABLE_TEMPLATE_SUCCESS, response: tableTemplateData });
                } else {
                    dispatch({ type: actionTypes.DELETE_TABLE_TEMPLATE_FAILURE, error: tableTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_TABLE_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_TABLE_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getTableTemplateById = (tableTemplate_id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TABLE_TEMPLATE_BY_ID_REQUEST });
            const res = await Service.getTableTemplateById(tableTemplate_id, dynamicUrl);
            if (res && res.status === 200) {
                const tableTemplateData = res.data;
                if (tableTemplateData.success) {
                    dispatch({ type: actionTypes.GET_TABLE_TEMPLATE_BY_ID_SUCCESS, response: tableTemplateData });
                } else {
                    dispatch({ type: actionTypes.GET_TABLE_TEMPLATE_BY_ID_FAILURE, error: tableTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_TABLE_TEMPLATE_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_TABLE_TEMPLATE_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateTableTemplateEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_TABLE_TEMPLATE_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_TABLE_TEMPLATE_ENTITY_PARAMS_FAILURE,
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
                const tableTemplateData = res.data;
                if (tableTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: tableTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: tableTemplateData
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

const exportTableTemplates = (dynamicUrl, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TABLE_TEMPLATE_EXPORT_REQUEST });
            const response = await Service.exportTableTemplates(dynamicUrl, params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_TABLE_TEMPLATE_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_TABLE_TEMPLATE_EXPORT_SUCCESS, response: {} });
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

const getAllTableTemplateLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_TABLE_TEMPLATE_LOG_REQUEST });
            const res = await Service.getAllTableTemplateLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_TABLE_TEMPLATE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_TABLE_TEMPLATE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_TABLE_TEMPLATE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_TABLE_TEMPLATE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreTableTemplateLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_TABLE_TEMPLATE_LOG_REQUEST });
            const res = await Service.restoreTableTemplateLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_TABLE_TEMPLATE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_TABLE_TEMPLATE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_TABLE_TEMPLATE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_TABLE_TEMPLATE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteTableTemplateLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_TABLE_TEMPLATE_LOG_REQUEST });
            const res = await Service.deleteTableTemplateLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_TABLE_TEMPLATE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_TABLE_TEMPLATE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_TABLE_TEMPLATE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_TABLE_TEMPLATE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAssignModalDetails = (id, type) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_MODAL_DETAILS_REQUEST });
            const res = await Service.getAssignModalDetails(id, type);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ASSIGN_MODAL_DETAILS_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_MODAL_DETAILS_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ASSIGN_MODAL_DETAILS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ASSIGN_MODAL_DETAILS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const assignItems = (id, params, type) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_ITEMS_REQUEST });
            const res = await Service.assignItems(id, params, type);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.ASSIGN_ITEMS_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_ITEMS_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.ASSIGN_ITEMS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ASSIGN_ITEMS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getTableTemplates,
    addTableTemplate,
    updateTableTemplate,
    deleteTableTemplate,
    getTableTemplateById,
    updateTableTemplateEntityParams,
    getListForCommonFilter,
    exportTableTemplates,
    getAllTableTemplateLogs,
    restoreTableTemplateLog,
    deleteTableTemplateLog,
    getAssignModalDetails,
    assignItems
};
