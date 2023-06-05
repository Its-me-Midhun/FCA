import * as actionTypes from "./constants";
import * as Service from "./services";

const getReportNoteTemplates = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REPORT_NOTE_TEMPLATES_BASED_ON_BUILDING_REQUEST });
            const res = await Service.getReportNoteTemplates(params, dynamicUrl);
            if (res && res.status === 200) {
                const reportNoteTemplateData = res.data;
                if (reportNoteTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_REPORT_NOTE_TEMPLATES_BASED_ON_BUILDING_SUCCESS,
                        response: reportNoteTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_REPORT_NOTE_TEMPLATES_BASED_ON_BUILDING_FAILURE,
                        error: reportNoteTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_REPORT_NOTE_TEMPLATES_BASED_ON_BUILDING_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REPORT_NOTE_TEMPLATES_BASED_ON_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addReportNoteTemplate = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_REPORT_NOTE_TEMPLATE_REQUEST });
            const res = await Service.addReportNoteTemplate(params, dynamicUrl);
            if (res && res.status === 200) {
                const reportNoteTemplateData = res.data;
                if (reportNoteTemplateData.success) {
                    dispatch({ type: actionTypes.ADD_REPORT_NOTE_TEMPLATE_SUCCESS, response: reportNoteTemplateData });
                } else {
                    dispatch({ type: actionTypes.ADD_REPORT_NOTE_TEMPLATE_FAILURE, error: reportNoteTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_REPORT_NOTE_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_REPORT_NOTE_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateReportNoteTemplate = (reportNoteTemplate_id, params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_REPORT_NOTE_TEMPLATE_REQUEST });
            const res = await Service.updateReportNoteTemplate(reportNoteTemplate_id, params, dynamicUrl);
            if (res && (res.status === 200 || res.status === 201)) {
                const reportNoteTemplateData = res.data;
                if (reportNoteTemplateData.success) {
                    dispatch({ type: actionTypes.UPDATE_REPORT_NOTE_TEMPLATE_SUCCESS, response: reportNoteTemplateData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_REPORT_NOTE_TEMPLATE_FAILURE, error: reportNoteTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_REPORT_NOTE_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_REPORT_NOTE_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteReportNoteTemplate = (id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_REPORT_NOTE_TEMPLATE_REQUEST });
            const res = await Service.deleteReportNoteTemplate(id, dynamicUrl);
            if (res && res.status === 200) {
                const reportNoteTemplateData = res.data;
                if (reportNoteTemplateData.success) {
                    dispatch({ type: actionTypes.DELETE_REPORT_NOTE_TEMPLATE_SUCCESS, response: reportNoteTemplateData });
                } else {
                    dispatch({ type: actionTypes.DELETE_REPORT_NOTE_TEMPLATE_FAILURE, error: reportNoteTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_REPORT_NOTE_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_REPORT_NOTE_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getReportNoteTemplateById = (reportNoteTemplate_id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REPORT_NOTE_TEMPLATE_BY_ID_REQUEST });
            const res = await Service.getReportNoteTemplateById(reportNoteTemplate_id, dynamicUrl);
            if (res && res.status === 200) {
                const reportNoteTemplateData = res.data;
                if (reportNoteTemplateData.success) {
                    dispatch({ type: actionTypes.GET_REPORT_NOTE_TEMPLATE_BY_ID_SUCCESS, response: reportNoteTemplateData });
                } else {
                    dispatch({ type: actionTypes.GET_REPORT_NOTE_TEMPLATE_BY_ID_FAILURE, error: reportNoteTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_REPORT_NOTE_TEMPLATE_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REPORT_NOTE_TEMPLATE_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateReportNoteTemplateEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_REPORT_NOTE_TEMPLATE_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_REPORT_NOTE_TEMPLATE_ENTITY_PARAMS_FAILURE,
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
                const reportNoteTemplateData = res.data;
                if (reportNoteTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: reportNoteTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: reportNoteTemplateData
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

const exportReportNoteTemplates = (dynamicUrl, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REPORT_NOTE_TEMPLATE_EXPORT_REQUEST });
            const response = await Service.exportReportNoteTemplates(dynamicUrl, params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_REPORT_NOTE_TEMPLATE_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_REPORT_NOTE_TEMPLATE_EXPORT_SUCCESS, response: {} });
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

const getAllReportNoteTemplateLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_REPORT_NOTE_TEMPLATE_LOG_REQUEST });
            const res = await Service.getAllReportNoteTemplateLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_REPORT_NOTE_TEMPLATE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_REPORT_NOTE_TEMPLATE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_REPORT_NOTE_TEMPLATE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_REPORT_NOTE_TEMPLATE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreReportNoteTemplateLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_REPORT_NOTE_TEMPLATE_LOG_REQUEST });
            const res = await Service.restoreReportNoteTemplateLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_REPORT_NOTE_TEMPLATE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_REPORT_NOTE_TEMPLATE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_REPORT_NOTE_TEMPLATE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_REPORT_NOTE_TEMPLATE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteReportNoteTemplateLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_REPORT_NOTE_TEMPLATE_LOG_REQUEST });
            const res = await Service.deleteReportNoteTemplateLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_REPORT_NOTE_TEMPLATE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_REPORT_NOTE_TEMPLATE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_REPORT_NOTE_TEMPLATE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_REPORT_NOTE_TEMPLATE_LOG_FAILURE,
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
    getReportNoteTemplates,
    addReportNoteTemplate,
    updateReportNoteTemplate,
    deleteReportNoteTemplate,
    getReportNoteTemplateById,
    updateReportNoteTemplateEntityParams,
    getListForCommonFilter,
    exportReportNoteTemplates,
    getAllReportNoteTemplateLogs,
    restoreReportNoteTemplateLog,
    deleteReportNoteTemplateLog,
    getAssignModalDetails,
    assignItems
};
