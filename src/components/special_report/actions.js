import * as actionTypes from "./constants";
import * as Service from "./services";

const getSpecialReports = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SPECIAL_REPORTS_BASED_ON_BUILDING_REQUEST });
            const res = await Service.getSpecialReports(params, dynamicUrl);
            if (res && res.status === 200) {
                const specialReportData = res.data;
                if (specialReportData.success) {
                    dispatch({
                        type: actionTypes.GET_SPECIAL_REPORTS_BASED_ON_BUILDING_SUCCESS,
                        response: specialReportData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SPECIAL_REPORTS_BASED_ON_BUILDING_FAILURE,
                        error: specialReportData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SPECIAL_REPORTS_BASED_ON_BUILDING_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SPECIAL_REPORTS_BASED_ON_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addSpecialReport = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_SPECIAL_REPORT_REQUEST });
            const res = await Service.addSpecialReport(params, dynamicUrl);
            if (res && res.status === 200) {
                const specialReportData = res.data;
                if (specialReportData.success) {
                    dispatch({ type: actionTypes.ADD_SPECIAL_REPORT_SUCCESS, response: specialReportData });
                } else {
                    dispatch({ type: actionTypes.ADD_SPECIAL_REPORT_FAILURE, error: specialReportData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_SPECIAL_REPORT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_SPECIAL_REPORT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateSpecialReport = (specialReport_id, params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_SPECIAL_REPORT_REQUEST });
            const res = await Service.updateSpecialReport(specialReport_id, params, dynamicUrl);
            if (res && (res.status === 200 || res.status === 201)) {
                const specialReportData = res.data;
                if (specialReportData.success) {
                    dispatch({ type: actionTypes.UPDATE_SPECIAL_REPORT_SUCCESS, response: specialReportData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_SPECIAL_REPORT_FAILURE, error: specialReportData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_SPECIAL_REPORT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SPECIAL_REPORT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteSpecialReport = (id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SPECIAL_REPORT_REQUEST });
            const res = await Service.deleteSpecialReport(id, dynamicUrl);
            if (res && res.status === 200) {
                const specialReportData = res.data;
                if (specialReportData.success) {
                    dispatch({ type: actionTypes.DELETE_SPECIAL_REPORT_SUCCESS, response: specialReportData });
                } else {
                    dispatch({ type: actionTypes.DELETE_SPECIAL_REPORT_FAILURE, error: specialReportData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_SPECIAL_REPORT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_SPECIAL_REPORT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSpecialReportById = (specialReport_id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SPECIAL_REPORT_BY_ID_REQUEST });
            const res = await Service.getSpecialReportById(specialReport_id, dynamicUrl);
            if (res && res.status === 200) {
                const specialReportData = res.data;
                if (specialReportData.success) {
                    dispatch({ type: actionTypes.GET_SPECIAL_REPORT_BY_ID_SUCCESS, response: specialReportData });
                } else {
                    dispatch({ type: actionTypes.GET_SPECIAL_REPORT_BY_ID_FAILURE, error: specialReportData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SPECIAL_REPORT_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SPECIAL_REPORT_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateSpecialReportEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_SPECIAL_REPORT_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SPECIAL_REPORT_ENTITY_PARAMS_FAILURE,
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
                const specialReportData = res.data;
                if (specialReportData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: specialReportData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: specialReportData
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

const exportSpecialReports = (dynamicUrl, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SPECIAL_REPORT_EXPORT_REQUEST });
            const response = await Service.exportSpecialReports(dynamicUrl, params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_SPECIAL_REPORT_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_SPECIAL_REPORT_EXPORT_SUCCESS, response: {} });
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

const getAllSpecialReportLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_SPECIAL_REPORT_LOG_REQUEST });
            const res = await Service.getAllSpecialReportLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_SPECIAL_REPORT_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_SPECIAL_REPORT_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_SPECIAL_REPORT_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_SPECIAL_REPORT_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreSpecialReportLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_SPECIAL_REPORT_LOG_REQUEST });
            const res = await Service.restoreSpecialReportLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_SPECIAL_REPORT_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_SPECIAL_REPORT_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_SPECIAL_REPORT_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_SPECIAL_REPORT_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteSpecialReportLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SPECIAL_REPORT_LOG_REQUEST });
            const res = await Service.deleteSpecialReportLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_SPECIAL_REPORT_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_SPECIAL_REPORT_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_SPECIAL_REPORT_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_SPECIAL_REPORT_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getSpecialReports,
    addSpecialReport,
    updateSpecialReport,
    deleteSpecialReport,
    getSpecialReportById,
    updateSpecialReportEntityParams,
    getListForCommonFilter,
    exportSpecialReports,
    getAllSpecialReportLogs,
    restoreSpecialReportLog,
    deleteSpecialReportLog
};
