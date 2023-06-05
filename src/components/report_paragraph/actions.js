import * as actionTypes from "./constants";
import * as Service from "./services";

const getReportParagraphs = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REPORT_PARAGRAPHS_BASED_ON_BUILDING_REQUEST });
            const res = await Service.getReportParagraphs(params, dynamicUrl);
            if (res && res.status === 200) {
                const reportParagraphData = res.data;
                if (reportParagraphData.success) {
                    dispatch({
                        type: actionTypes.GET_REPORT_PARAGRAPHS_BASED_ON_BUILDING_SUCCESS,
                        response: reportParagraphData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_REPORT_PARAGRAPHS_BASED_ON_BUILDING_FAILURE,
                        error: reportParagraphData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_REPORT_PARAGRAPHS_BASED_ON_BUILDING_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REPORT_PARAGRAPHS_BASED_ON_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addReportParagraph = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_REPORT_PARAGRAPH_REQUEST });
            const res = await Service.addReportParagraph(params, dynamicUrl);
            if (res && res.status === 200) {
                const reportParagraphData = res.data;
                if (reportParagraphData.success) {
                    dispatch({ type: actionTypes.ADD_REPORT_PARAGRAPH_SUCCESS, response: reportParagraphData });
                } else {
                    dispatch({ type: actionTypes.ADD_REPORT_PARAGRAPH_FAILURE, error: reportParagraphData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_REPORT_PARAGRAPH_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_REPORT_PARAGRAPH_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateReportParagraph = (reportParagraph_id, params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_REPORT_PARAGRAPH_REQUEST });
            const res = await Service.updateReportParagraph(reportParagraph_id, params, dynamicUrl);
            if (res && (res.status === 200 || res.status === 201)) {
                const reportParagraphData = res.data;
                if (reportParagraphData.success) {
                    dispatch({ type: actionTypes.UPDATE_REPORT_PARAGRAPH_SUCCESS, response: reportParagraphData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_REPORT_PARAGRAPH_FAILURE, error: reportParagraphData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_REPORT_PARAGRAPH_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_REPORT_PARAGRAPH_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteReportParagraph = (id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_REPORT_PARAGRAPH_REQUEST });
            const res = await Service.deleteReportParagraph(id, dynamicUrl);
            if (res && res.status === 200) {
                const reportParagraphData = res.data;
                if (reportParagraphData.success) {
                    dispatch({ type: actionTypes.DELETE_REPORT_PARAGRAPH_SUCCESS, response: reportParagraphData });
                } else {
                    dispatch({ type: actionTypes.DELETE_REPORT_PARAGRAPH_FAILURE, error: reportParagraphData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_REPORT_PARAGRAPH_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_REPORT_PARAGRAPH_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getReportParagraphById = (reportParagraph_id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REPORT_PARAGRAPH_BY_ID_REQUEST });
            const res = await Service.getReportParagraphById(reportParagraph_id, dynamicUrl);
            if (res && res.status === 200) {
                const reportParagraphData = res.data;
                if (reportParagraphData.success) {
                    dispatch({ type: actionTypes.GET_REPORT_PARAGRAPH_BY_ID_SUCCESS, response: reportParagraphData });
                } else {
                    dispatch({ type: actionTypes.GET_REPORT_PARAGRAPH_BY_ID_FAILURE, error: reportParagraphData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_REPORT_PARAGRAPH_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REPORT_PARAGRAPH_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateReportParagraphEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_REPORT_PARAGRAPH_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_REPORT_PARAGRAPH_ENTITY_PARAMS_FAILURE,
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
                const reportParagraphData = res.data;
                if (reportParagraphData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: reportParagraphData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: reportParagraphData
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

const exportReportParagraphs = (dynamicUrl, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REPORT_PARAGRAPH_EXPORT_REQUEST });
            const response = await Service.exportReportParagraphs(dynamicUrl, params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_REPORT_PARAGRAPH_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_REPORT_PARAGRAPH_EXPORT_SUCCESS, response: {} });
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

const getAllReportParagraphLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_REPORT_PARAGRAPH_LOG_REQUEST });
            const res = await Service.getAllReportParagraphLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_REPORT_PARAGRAPH_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_REPORT_PARAGRAPH_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_REPORT_PARAGRAPH_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_REPORT_PARAGRAPH_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreReportParagraphLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_REPORT_PARAGRAPH_LOG_REQUEST });
            const res = await Service.restoreReportParagraphLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_REPORT_PARAGRAPH_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_REPORT_PARAGRAPH_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_REPORT_PARAGRAPH_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_REPORT_PARAGRAPH_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteReportParagraphLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_REPORT_PARAGRAPH_LOG_REQUEST });
            const res = await Service.deleteReportParagraphLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_REPORT_PARAGRAPH_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_REPORT_PARAGRAPH_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_REPORT_PARAGRAPH_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_REPORT_PARAGRAPH_LOG_FAILURE,
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

export default {
    getReportParagraphs,
    addReportParagraph,
    updateReportParagraph,
    deleteReportParagraph,
    getReportParagraphById,
    updateReportParagraphEntityParams,
    getListForCommonFilter,
    exportReportParagraphs,
    getAllReportParagraphLogs,
    restoreReportParagraphLog,
    deleteReportParagraphLog,
    getSpecialReportsDropdown
};
