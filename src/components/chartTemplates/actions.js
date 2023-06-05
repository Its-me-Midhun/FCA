import * as actionTypes from "./constants";
import * as Service from "./services";
import * as serviceEndpoints from "../../config/serviceEndPoints";
import { REPORT_URL } from "../../config/constants";

const getChartTemplates = (params, id) => {
    params.client_id = id || null;
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHART_TEMPLATES_REQUEST });
            const res = await Service.getChartTemplates(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                dispatch({
                    type: actionTypes.GET_CHART_TEMPLATES_SUCCESS,
                    response: regionData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_CHART_TEMPLATES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHART_TEMPLATES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addChartTemplate = params => {
    let templateData = new FormData();
    templateData.append("name", params.name);
    templateData.append("chart_propertie_id", params.chart_propertie_id);
    templateData.append("uploaded_by", params.uploaded_by);
    templateData.append("description", params.description);
    templateData.append("template", params.template);
    templateData.append("active", params.active);
    templateData.append("notes", params.notes);
    templateData.append("template_type", params.template_type);
    if (params.client_id) {
        templateData.append("client_id", params.client_id);
    }
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_CHART_TEMPLATE_REQUEST });
            const res = await Service.addChartTemplate(templateData);
            if (res && res.status === 200) {
                const regionData = res.data;
                dispatch({ type: actionTypes.ADD_CHART_TEMPLATE_SUCCESS, response: regionData });
            } else {
                dispatch({
                    type: actionTypes.ADD_CHART_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_CHART_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getChartTemplateById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHART_TEMPLATE_BY_ID_REQUEST });
            const res = await Service.getChartTemplateById(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_CHART_TEMPLATE_BY_ID_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_CHART_TEMPLATE_BY_ID_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHART_TEMPLATE_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHART_TEMPLATE_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateChartTemplate = (params, isActiveChange = false) => {
    let templateData = new FormData();
    templateData.append("name", params.name);
    templateData.append("chart_properties", params.chart_propertie_id);
    templateData.append("description", params.description);
    templateData.append("notes", params.notes);
    templateData.append("template_type", params.template_type);
    if (params.template) {
        templateData.append("file", params.template);
    }
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_CHART_TEMPLATE_REQUEST });
            const res = await Service.updateChartTemplate(templateData, params.id);
            if (res && (res.status === 200 || res.status === 201)) {
                const resultTemplateData = res.data;
                dispatch({
                    type: actionTypes.UPDATE_CHART_TEMPLATE_SUCCESS,
                    response: resultTemplateData
                });
            } else {
                dispatch({
                    type: actionTypes.UPDATE_CHART_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CHART_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteChartTemplate = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CHART_TEMPLATE_REQUEST });
            const res = await Service.deleteChartTemplate({ id });
            if (res && res.status === 204) {
                const regionData = res.data;
                dispatch({
                    type: actionTypes.DELETE_CHART_TEMPLATE_SUCCESS,
                    response: regionData
                });
            } else {
                dispatch({
                    type: actionTypes.DELETE_CHART_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_CHART_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
// const restoreTemplate = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.RESTORE_TEMPLATE_REQUEST });
//             const res = await Service.restoreTemplate(id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 dispatch({
//                     type: actionTypes.RESTORE_TEMPLATE_SUCCESS,
//                     response: regionData
//                 });
//             } else {
//                 dispatch({
//                     type: actionTypes.RESTORE_TEMPLATE_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.RESTORE_TEMPLATE_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

const updateChartTemplateEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_CHART_TEMPLATE_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CHART_TEMPLATE_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const exportChartTemplate = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_CHART_TEMPLATE_REQUEST });
            const response = await Service.exportChartTemplate(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_CHART_TEMPLATE_FAILURE, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.EXPORT_CHART_TEMPLATE_SUCCESS, response: {} });
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
                type: actionTypes.EXPORT_CHART_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getChartPropertyDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHART_PROPERTY_DROPDOWN_REQUEST });
            const res = await Service.getChartPropertyDropdown(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                dispatch({ type: actionTypes.GET_CHART_PROPERTY_DROPDOWN_SUCCESS, response: regionData });
            } else {
                dispatch({
                    type: actionTypes.GET_CHART_PROPERTY_DROPDOWN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHART_PROPERTY_DROPDOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

// const addUserActivityLog = text => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.ADD_USER_ACTIVITY_LOG_REQUEST });
//             const res = await Service.addUserActivityLog(text);
//             if (res && (res.status === 200 || res.status === 201)) {
//                 const resData = res.data;
//                 dispatch({ type: actionTypes.ADD_USER_ACTIVITY_LOG_SUCCESS, response: resData });
//             } else {
//                 dispatch({
//                     type: actionTypes.ADD_USER_ACTIVITY_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.ADD_USER_ACTIVITY_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

const updateTemplateStatus = params => {
    const isSmartChartStatus = params.hasOwnProperty("sm_active");
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_CHART_TEMPLATE_STATUS_REQUEST });
            const res = isSmartChartStatus ? await Service.updateTemplateSmartChartStatus(params) : await Service.updateTemplateStatus(params);
            if (res && (res.status === 200 || res.status === 201)) {
                const resultTemplateData = res.data;
                dispatch({
                    type: actionTypes.UPDATE_CHART_TEMPLATE_STATUS_SUCCESS,
                    response: resultTemplateData
                });
            } else {
                dispatch({
                    type: actionTypes.UPDATE_CHART_TEMPLATE_STATUS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CHART_TEMPLATE_STATUS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getChartTemplates,
    addChartTemplate,
    getChartTemplateById,
    updateChartTemplate,
    deleteChartTemplate,
    updateChartTemplateEntityParams,
    exportChartTemplate,
    getChartPropertyDropdown,
    // restoreTemplate,
    // addUserActivityLog
    updateTemplateStatus
};
