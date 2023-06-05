import * as actionTypes from "./constants";
import * as Service from "./services";

const getRecommendationTemplates = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_RECOMMENDATION_TEMPLATES_REQUEST });
            const res = await Service.getRecommendationTemplates(params, dynamicUrl);
            if (res && res.status === 200) {
                const recommendationTemplateData = res.data;
                if (recommendationTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_RECOMMENDATION_TEMPLATES_SUCCESS,
                        response: recommendationTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_RECOMMENDATION_TEMPLATES_FAILURE,
                        error: recommendationTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_RECOMMENDATION_TEMPLATES_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_RECOMMENDATION_TEMPLATES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addRecommendationTemplate = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_RECOMMENDATION_TEMPLATE_REQUEST });
            const res = await Service.addRecommendationTemplate(params, dynamicUrl);
            if (res && res.status === 200) {
                const recommendationTemplateData = res.data;
                if (recommendationTemplateData.success) {
                    dispatch({ type: actionTypes.ADD_RECOMMENDATION_TEMPLATE_SUCCESS, response: recommendationTemplateData });
                } else {
                    dispatch({ type: actionTypes.ADD_RECOMMENDATION_TEMPLATE_FAILURE, error: recommendationTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_RECOMMENDATION_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_RECOMMENDATION_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateRecommendationTemplate = (recommendationTemplate_id, params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_RECOMMENDATION_TEMPLATE_REQUEST });
            const res = await Service.updateRecommendationTemplate(recommendationTemplate_id, params, dynamicUrl);
            if (res && (res.status === 200 || res.status === 201)) {
                const recommendationTemplateData = res.data;
                if (recommendationTemplateData.success) {
                    dispatch({ type: actionTypes.UPDATE_RECOMMENDATION_TEMPLATE_SUCCESS, response: recommendationTemplateData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_RECOMMENDATION_TEMPLATE_FAILURE, error: recommendationTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_RECOMMENDATION_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_RECOMMENDATION_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteRecommendationTemplate = (id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_RECOMMENDATION_TEMPLATE_REQUEST });
            const res = await Service.deleteRecommendationTemplate(id, dynamicUrl);
            if (res && res.status === 200) {
                const recommendationTemplateData = res.data;
                if (recommendationTemplateData.success) {
                    dispatch({ type: actionTypes.DELETE_RECOMMENDATION_TEMPLATE_SUCCESS, response: recommendationTemplateData });
                } else {
                    dispatch({ type: actionTypes.DELETE_RECOMMENDATION_TEMPLATE_FAILURE, error: recommendationTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_RECOMMENDATION_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_RECOMMENDATION_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getRecommendationTemplateById = (recommendationTemplate_id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_RECOMMENDATION_TEMPLATE_BY_ID_REQUEST });
            const res = await Service.getRecommendationTemplateById(recommendationTemplate_id, dynamicUrl);
            if (res && res.status === 200) {
                const recommendationTemplateData = res.data;
                if (recommendationTemplateData.success) {
                    dispatch({ type: actionTypes.GET_RECOMMENDATION_TEMPLATE_BY_ID_SUCCESS, response: recommendationTemplateData });
                } else {
                    dispatch({ type: actionTypes.GET_RECOMMENDATION_TEMPLATE_BY_ID_FAILURE, error: recommendationTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_RECOMMENDATION_TEMPLATE_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_RECOMMENDATION_TEMPLATE_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateRecommendationTemplateEntityParams = (entityParams,section) => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_RECOMMENDATION_TEMPLATE_ENTITY_PARAMS_SUCCESS,
                    response: entityParams,
                    section
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_RECOMMENDATION_TEMPLATE_ENTITY_PARAMS_FAILURE,
                error: entityParams,
                section
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
                const recommendationTemplateData = res.data;
                if (recommendationTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: recommendationTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: recommendationTemplateData
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

const exportRecommendationTemplates = (dynamicUrl, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_RECOMMENDATION_TEMPLATE_EXPORT_REQUEST });
            const response = await Service.exportRecommendationTemplates(dynamicUrl, params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_RECOMMENDATION_TEMPLATE_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_RECOMMENDATION_TEMPLATE_EXPORT_SUCCESS, response: {} });
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

const getAllRecommendationTemplateLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_RECOMMENDATION_TEMPLATE_LOG_REQUEST });
            const res = await Service.getAllRecommendationTemplateLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_RECOMMENDATION_TEMPLATE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_RECOMMENDATION_TEMPLATE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_RECOMMENDATION_TEMPLATE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_RECOMMENDATION_TEMPLATE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreRecommendationTemplateLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_RECOMMENDATION_TEMPLATE_LOG_REQUEST });
            const res = await Service.restoreRecommendationTemplateLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_RECOMMENDATION_TEMPLATE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_RECOMMENDATION_TEMPLATE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_RECOMMENDATION_TEMPLATE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_RECOMMENDATION_TEMPLATE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteRecommendationTemplateLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_RECOMMENDATION_TEMPLATE_LOG_REQUEST });
            const res = await Service.deleteRecommendationTemplateLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_RECOMMENDATION_TEMPLATE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_RECOMMENDATION_TEMPLATE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_RECOMMENDATION_TEMPLATE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_RECOMMENDATION_TEMPLATE_LOG_FAILURE,
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
    getRecommendationTemplates,
    addRecommendationTemplate,
    updateRecommendationTemplate,
    deleteRecommendationTemplate,
    getRecommendationTemplateById,
    updateRecommendationTemplateEntityParams,
    getListForCommonFilter,
    exportRecommendationTemplates,
    getAllRecommendationTemplateLogs,
    restoreRecommendationTemplateLog,
    deleteRecommendationTemplateLog,
    getAssignModalDetails,
    assignItems
};
