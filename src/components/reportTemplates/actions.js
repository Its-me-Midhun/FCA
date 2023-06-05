import * as actionTypes from "./constants";
import * as Service from "./services";
import * as serviceEndpoints from "../../config/serviceEndPoints";
import { REPORT_URL } from "../../config/constants";

const getTemplates = (params, id) => {
    params.project_id = id || null;
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TEMPLATES_REQUEST });
            const res = await Service.getTemplates(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                dispatch({
                    type: actionTypes.GET_TEMPLATES_SUCCESS,
                    response: regionData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_TEMPLATES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_TEMPLATES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addTemplate = params => {
    let templateData = new FormData();
    templateData.append("template_name", params.template_name);
    templateData.append("setting_id", params.setting_id);
    templateData.append("uploaded_by", params.uploaded_by);
    templateData.append("description", params.description);
    templateData.append("template_file", params.template_file);
    templateData.append("active", params.active);
    templateData.append("notes", params.notes);
    if (params.project_id) {
        templateData.append("project_id", params.project_id);
    }
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_TEMPLATE_REQUEST });
            const res = await Service.addTemplate(templateData);
            if (res && res.status === 201) {
                const regionData = res.data;
                dispatch({ type: actionTypes.ADD_TEMPLATE_SUCCESS, response: regionData });
            } else {
                dispatch({
                    type: actionTypes.ADD_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getTemplateById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TEMPLATE_BY_ID_REQUEST });
            const res = await Service.getTemplateById(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_TEMPLATE_BY_ID_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_TEMPLATE_BY_ID_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_TEMPLATE_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_TEMPLATE_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateTemplate = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_TEMPLATE_REQUEST });
            const res = await Service.updateTemplate(params);
            if (res && (res.status === 200 || res.status === 201)) {
                const building_typeData = res.data;
                dispatch({
                    type: actionTypes.UPDATE_TEMPLATE_SUCCESS,
                    response: building_typeData
                });
            } else {
                dispatch({
                    type: actionTypes.UPDATE_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteTemplate = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_TEMPLATE_REQUEST });
            const res = await Service.deleteTemplate(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                dispatch({
                    type: actionTypes.DELETE_TEMPLATE_SUCCESS,
                    response: regionData
                });
            } else {
                dispatch({
                    type: actionTypes.DELETE_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const restoreTemplate = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_TEMPLATE_REQUEST });
            const res = await Service.restoreTemplate(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                dispatch({
                    type: actionTypes.RESTORE_TEMPLATE_SUCCESS,
                    response: regionData
                });
            } else {
                dispatch({
                    type: actionTypes.RESTORE_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateTemplateEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_TRADE_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_TRADE_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const exportReportTemplate = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_TEMPLATE_REQUEST });
            const response = await Service.exportReportTemplate(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_TEMPLATE_FAILURE, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.EXPORT_TEMPLATE_SUCCESS, response: {} });
                }
            }
            const { data } = response;
            const name = response.headers["content-disposition"].split("filename=");
            const fileName = name[1];
            let blob = new Blob([data]);
            let url = window.URL || window.webkitURL;
            let downloadUrl = url.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", `${fileName}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            dispatch({
                type: actionTypes.EXPORT_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getPropertyDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PROPERTY_DROPDOWN_REQUEST });
            const res = await Service.getPropertyDropdown(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_PROPERTY_DROPDOWN_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_PROPERTY_DROPDOWN_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_PROPERTY_DROPDOWN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_PROPERTY_DROPDOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addUserActivityLog = text => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_USER_ACTIVITY_LOG_REQUEST });
            const res = await Service.addUserActivityLog(text);
            if (res && (res.status === 200 || res.status === 201)) {
                const resData = res.data;
                dispatch({ type: actionTypes.ADD_USER_ACTIVITY_LOG_SUCCESS, response: resData });
            } else {
                dispatch({
                    type: actionTypes.ADD_USER_ACTIVITY_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_USER_ACTIVITY_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getTemplates,
    addTemplate,
    getTemplateById,
    updateTemplate,
    deleteTemplate,
    updateTemplateEntityParams,
    exportReportTemplate,
    getPropertyDropdown,
    restoreTemplate,
    addUserActivityLog
};
