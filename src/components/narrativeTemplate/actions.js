import * as actionTypes from "./constants";
import * as Service from "./services";

const getNarrativeTemplates = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_NARRATIVE_TEMPLATES_BASED_ON_BUILDING_REQUEST });
            const res = await Service.getNarrativeTemplates(params, dynamicUrl);
            if (res && res.status === 200) {
                const narrativeTemplateData = res.data;
                if (narrativeTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_NARRATIVE_TEMPLATES_BASED_ON_BUILDING_SUCCESS,
                        response: narrativeTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_NARRATIVE_TEMPLATES_BASED_ON_BUILDING_FAILURE,
                        error: narrativeTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_NARRATIVE_TEMPLATES_BASED_ON_BUILDING_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_NARRATIVE_TEMPLATES_BASED_ON_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addNarrativeTemplate = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_NARRATIVE_TEMPLATE_REQUEST });
            const res = await Service.addNarrativeTemplate(params, dynamicUrl);
            if (res && res.status === 200) {
                const narrativeTemplateData = res.data;
                if (narrativeTemplateData.success) {
                    dispatch({ type: actionTypes.ADD_NARRATIVE_TEMPLATE_SUCCESS, response: narrativeTemplateData });
                } else {
                    dispatch({ type: actionTypes.ADD_NARRATIVE_TEMPLATE_FAILURE, error: narrativeTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_NARRATIVE_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_NARRATIVE_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateNarrativeTemplate = (narrativeTemplate_id, params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_NARRATIVE_TEMPLATE_REQUEST });
            const res = await Service.updateNarrativeTemplate(narrativeTemplate_id, params, dynamicUrl);
            if (res && (res.status === 200 || res.status === 201)) {
                const narrativeTemplateData = res.data;
                if (narrativeTemplateData.success) {
                    dispatch({ type: actionTypes.UPDATE_NARRATIVE_TEMPLATE_SUCCESS, response: narrativeTemplateData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_NARRATIVE_TEMPLATE_FAILURE, error: narrativeTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_NARRATIVE_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_NARRATIVE_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteNarrativeTemplate = (id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_NARRATIVE_TEMPLATE_REQUEST });
            const res = await Service.deleteNarrativeTemplate(id, dynamicUrl);
            if (res && res.status === 200) {
                const narrativeTemplateData = res.data;
                if (narrativeTemplateData.success) {
                    dispatch({ type: actionTypes.DELETE_NARRATIVE_TEMPLATE_SUCCESS, response: narrativeTemplateData });
                } else {
                    dispatch({ type: actionTypes.DELETE_NARRATIVE_TEMPLATE_FAILURE, error: narrativeTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_NARRATIVE_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_NARRATIVE_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getNarrativeTemplateById = (narrativeTemplate_id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_NARRATIVE_TEMPLATE_BY_ID_REQUEST });
            const res = await Service.getNarrativeTemplateById(narrativeTemplate_id, dynamicUrl);
            if (res && res.status === 200) {
                const narrativeTemplateData = res.data;
                if (narrativeTemplateData.success) {
                    dispatch({ type: actionTypes.GET_NARRATIVE_TEMPLATE_BY_ID_SUCCESS, response: narrativeTemplateData });
                } else {
                    dispatch({ type: actionTypes.GET_NARRATIVE_TEMPLATE_BY_ID_FAILURE, error: narrativeTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_NARRATIVE_TEMPLATE_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_NARRATIVE_TEMPLATE_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateNarrativeTemplateEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_NARRATIVE_TEMPLATE_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_NARRATIVE_TEMPLATE_ENTITY_PARAMS_FAILURE,
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
                const narrativeTemplateData = res.data;
                if (narrativeTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: narrativeTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: narrativeTemplateData
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

const exportNarrativeTemplates = (dynamicUrl, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_NARRATIVE_TEMPLATE_EXPORT_REQUEST });
            const response = await Service.exportNarrativeTemplates(dynamicUrl, params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_NARRATIVE_TEMPLATE_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_NARRATIVE_TEMPLATE_EXPORT_SUCCESS, response: {} });
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

const getAllNarrativeTemplateLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_NARRATIVE_TEMPLATE_LOG_REQUEST });
            const res = await Service.getAllNarrativeTemplateLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_NARRATIVE_TEMPLATE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_NARRATIVE_TEMPLATE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_NARRATIVE_TEMPLATE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_NARRATIVE_TEMPLATE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreNarrativeTemplateLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_NARRATIVE_TEMPLATE_LOG_REQUEST });
            const res = await Service.restoreNarrativeTemplateLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_NARRATIVE_TEMPLATE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_NARRATIVE_TEMPLATE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_NARRATIVE_TEMPLATE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_NARRATIVE_TEMPLATE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteNarrativeTemplateLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_NARRATIVE_TEMPLATE_LOG_REQUEST });
            const res = await Service.deleteNarrativeTemplateLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_NARRATIVE_TEMPLATE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_NARRATIVE_TEMPLATE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_NARRATIVE_TEMPLATE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_NARRATIVE_TEMPLATE_LOG_FAILURE,
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
    getNarrativeTemplates,
    addNarrativeTemplate,
    updateNarrativeTemplate,
    deleteNarrativeTemplate,
    getNarrativeTemplateById,
    updateNarrativeTemplateEntityParams,
    getListForCommonFilter,
    exportNarrativeTemplates,
    getAllNarrativeTemplateLogs,
    restoreNarrativeTemplateLog,
    deleteNarrativeTemplateLog,
    getAssignModalDetails,
    assignItems
};
