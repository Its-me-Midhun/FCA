import * as actionTypes from "./constants";
import * as Service from "./services";

const getChildParagraphs = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHILD_PARAGRAPHS_BASED_ON_BUILDING_REQUEST });
            const res = await Service.getChildParagraphs(params, dynamicUrl);
            if (res && res.status === 200) {
                const childParagraphData = res.data;
                if (childParagraphData.success) {
                    dispatch({
                        type: actionTypes.GET_CHILD_PARAGRAPHS_BASED_ON_BUILDING_SUCCESS,
                        response: childParagraphData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_CHILD_PARAGRAPHS_BASED_ON_BUILDING_FAILURE,
                        error: childParagraphData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHILD_PARAGRAPHS_BASED_ON_BUILDING_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHILD_PARAGRAPHS_BASED_ON_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addChildParagraph = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_CHILD_PARAGRAPH_REQUEST });
            const res = await Service.addChildParagraph(params, dynamicUrl);
            if (res && res.status === 200) {
                const childParagraphData = res.data;
                if (childParagraphData.success) {
                    dispatch({ type: actionTypes.ADD_CHILD_PARAGRAPH_SUCCESS, response: childParagraphData });
                } else {
                    dispatch({ type: actionTypes.ADD_CHILD_PARAGRAPH_FAILURE, error: childParagraphData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_CHILD_PARAGRAPH_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_CHILD_PARAGRAPH_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateChildParagraph = (childParagraph_id, params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_CHILD_PARAGRAPH_REQUEST });
            const res = await Service.updateChildParagraph(childParagraph_id, params, dynamicUrl);
            if (res && (res.status === 200 || res.status === 201)) {
                const childParagraphData = res.data;
                if (childParagraphData.success) {
                    dispatch({ type: actionTypes.UPDATE_CHILD_PARAGRAPH_SUCCESS, response: childParagraphData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_CHILD_PARAGRAPH_FAILURE, error: childParagraphData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_CHILD_PARAGRAPH_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CHILD_PARAGRAPH_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteChildParagraph = (id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CHILD_PARAGRAPH_REQUEST });
            const res = await Service.deleteChildParagraph(id, dynamicUrl);
            if (res && res.status === 200) {
                const childParagraphData = res.data;
                if (childParagraphData.success) {
                    dispatch({ type: actionTypes.DELETE_CHILD_PARAGRAPH_SUCCESS, response: childParagraphData });
                } else {
                    dispatch({ type: actionTypes.DELETE_CHILD_PARAGRAPH_FAILURE, error: childParagraphData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_CHILD_PARAGRAPH_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_CHILD_PARAGRAPH_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getChildParagraphById = (childParagraph_id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHILD_PARAGRAPH_BY_ID_REQUEST });
            const res = await Service.getChildParagraphById(childParagraph_id, dynamicUrl);
            if (res && res.status === 200) {
                const childParagraphData = res.data;
                if (childParagraphData.success) {
                    dispatch({ type: actionTypes.GET_CHILD_PARAGRAPH_BY_ID_SUCCESS, response: childParagraphData });
                } else {
                    dispatch({ type: actionTypes.GET_CHILD_PARAGRAPH_BY_ID_FAILURE, error: childParagraphData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHILD_PARAGRAPH_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHILD_PARAGRAPH_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateChildParagraphEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_CHILD_PARAGRAPH_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CHILD_PARAGRAPH_ENTITY_PARAMS_FAILURE,
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
                const childParagraphData = res.data;
                if (childParagraphData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: childParagraphData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: childParagraphData
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

const exportChildParagraphs = (dynamicUrl, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHILD_PARAGRAPH_EXPORT_REQUEST });
            const response = await Service.exportChildParagraphs(dynamicUrl, params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_CHILD_PARAGRAPH_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_CHILD_PARAGRAPH_EXPORT_SUCCESS, response: {} });
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

const getAllChildParagraphLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CHILD_PARAGRAPH_LOG_REQUEST });
            const res = await Service.getAllChildParagraphLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_CHILD_PARAGRAPH_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CHILD_PARAGRAPH_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_CHILD_PARAGRAPH_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_CHILD_PARAGRAPH_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreChildParagraphLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_CHILD_PARAGRAPH_LOG_REQUEST });
            const res = await Service.restoreChildParagraphLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_CHILD_PARAGRAPH_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_CHILD_PARAGRAPH_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_CHILD_PARAGRAPH_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_CHILD_PARAGRAPH_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteChildParagraphLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CHILD_PARAGRAPH_LOG_REQUEST });
            const res = await Service.deleteChildParagraphLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_CHILD_PARAGRAPH_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_CHILD_PARAGRAPH_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_CHILD_PARAGRAPH_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_CHILD_PARAGRAPH_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSpecialReportsDropdown = () => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SPECIAL_REPORTS_DROPDOWN_REQUEST });
            const res = await Service.getSpecialReportsDropdown();
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_SPECIAL_REPORTS_DROPDOWN_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_SPECIAL_REPORTS_DROPDOWN_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SPECIAL_REPORTS_DROPDOWN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SPECIAL_REPORTS_DROPDOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getReportParagraphsDropdown = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REPORT_PARAGRAPHS_DROPDOWN_REQUEST });
            const res = await Service.getReportParagraphsDropdown(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_REPORT_PARAGRAPHS_DROPDOWN_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_REPORT_PARAGRAPHS_DROPDOWN_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_REPORT_PARAGRAPHS_DROPDOWN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REPORT_PARAGRAPHS_DROPDOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getChildParagraphs,
    addChildParagraph,
    updateChildParagraph,
    deleteChildParagraph,
    getChildParagraphById,
    updateChildParagraphEntityParams,
    getListForCommonFilter,
    exportChildParagraphs,
    getAllChildParagraphLogs,
    restoreChildParagraphLog,
    deleteChildParagraphLog,
    getSpecialReportsDropdown,
    getReportParagraphsDropdown
};
