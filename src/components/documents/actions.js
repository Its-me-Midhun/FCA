import * as actionTypes from "./constants";
import * as Service from "./services";

const getAllReports = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REPORTS_REQUEST });
            const res = await Service.getAllReports(params, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_REPORTS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_REPORTS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_REPORTS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REPORTS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateReportEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_REPORT_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_REPORT_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const addDocument = (params, file) => {
    let rec_data = new FormData();
    rec_data.append("file", params.file);
    rec_data.append("document", JSON.stringify(params));
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_REPORTS_REQUEST });
            const res = await Service.addDocument(rec_data);
            if (res && res.status === 200) {
                const documentData = res.data;
                if (documentData.success) {
                    dispatch({ type: actionTypes.ADD_REPORTS_SUCCESS, response: documentData });
                } else {
                    dispatch({ type: actionTypes.ADD_REPORTS_FAILURE, error: documentData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_REPORTS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_REPORTS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateDocument = (id,params,imageChanged) => {
    let rec_data = new FormData();
    if(imageChanged){
        rec_data.append("file", params.file);

    }
    rec_data.append("document", JSON.stringify(params));
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_REPORTS_REQUEST });
            const res = await Service.updateDocument(id,rec_data);
            if (res && (res.status === 200 || res.status === 201)) {
                const documentData = res.data;
                if (documentData.success) {
                    dispatch({ type: actionTypes.UPDATE_REPORTS_SUCCESS, response: documentData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_REPORTS_FAILURE, error: documentData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_REPORTS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_REPORTS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteDocument = (building_id, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_REPORTS_REQUEST });
            const res = await Service.deleteDocument(building_id, id);
            if (res && res.status === 200) {
                const documentData = res.data;
                if (documentData.success) {
                    dispatch({ type: actionTypes.DELETE_REPORTS_SUCCESS, response: documentData });
                } else {
                    dispatch({ type: actionTypes.DELETE_REPORTS_FAILURE, error: documentData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_REPORTS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_REPORTS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getDocumentById = (building_id, document_id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REPORTS_BY_ID_REQUEST });
            const res = await Service.getDocumentById(building_id, document_id);
            if (res && res.status === 200) {
                const documentData = res.data;
                if (documentData.success) {
                    dispatch({ type: actionTypes.GET_REPORTS_BY_ID_SUCCESS, response: documentData });
                } else {
                    dispatch({ type: actionTypes.GET_REPORTS_BY_ID_FAILURE, error: documentData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_REPORTS_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REPORTS_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getListForCommonFilter = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilter(params);
            if (res && res.status === 200) {
                const documentData = res.data;
                if (documentData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: documentData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: documentData
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

const exportDocuments = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REPORTS_EXPORT_REQUEST });
            const response = await Service.exportDocuments(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_REPORTS_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.GET_REPORTS_EXPORT_SUCCESS, response: {} });
                }
            }
            const { data } = response;
            const name = response.headers['content-disposition'].split('filename=');
            const fileName = name[1].split('"')[1];
            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `${fileName}`); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
        }
    };
};

const getAllDocumentLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_REPORTS_LOG_REQUEST });
            const res = await Service.getAllDocumentLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_REPORTS_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_REPORTS_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_REPORTS_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_REPORTS_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreDocumentLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_REPORTS_LOG_REQUEST });
            const res = await Service.restoreDocumentLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_REPORTS_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_REPORTS_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_REPORTS_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_REPORTS_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteDocumentLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_REPORTS_LOG_REQUEST });
            const res = await Service.deleteDocumentLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_REPORTS_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_REPORTS_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_REPORTS_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_REPORTS_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getInitiativeDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_INITIATIVE_DROP_DOWN_REQUEST });
            const res = await Service.getInitiativeDropdown(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_INITIATIVE_DROP_DOWN_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_INITIATIVE_DROP_DOWN_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_INITIATIVE_DROP_DOWN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_INITIATIVE_DROP_DOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getRecommendationDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_RECOMMENDATION_DROP_DOWN_REQUEST });
            const res = await Service.getRecommendationDropdown(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_RECOMMENDATION_DROP_DOWN_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_RECOMMENDATION_DROP_DOWN_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_RECOMMENDATION_DROP_DOWN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_RECOMMENDATION_DROP_DOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getAllDocuments = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_DOCUMENTS_TYPE_REQUEST });
            const res = await Service.getAllDocuments(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_DOCUMENTS_TYPE_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_DOCUMENTS_TYPE_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_DOCUMENTS_TYPE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_DOCUMENTS_TYPE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllRegionDropdownDocument = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_REGION_DROPDOWN_REQUEST });
            const res = await Service.getAllRegionDropdownDocument(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_REGION_DROPDOWN_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_REGION_DROPDOWN_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_REGION_DROPDOWN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_REGION_DROPDOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSitesByRegionInDocuments = (id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SITES_BY_REGION_IN_DOCUMENTS_REQUEST });
            const res = await Service.getSitesByRegionInDocuments(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                dispatch({
                    type: actionTypes.GET_SITES_BY_REGION_IN_DOCUMENTS_SUCCESS,
                    response: regionData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_SITES_BY_REGION_IN_DOCUMENTS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SITES_BY_REGION_IN_DOCUMENTS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getMasterFilterLists = (filterKey, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DOCUMENT_MASTER_FILTER_LISTS_REQUEST });
            const res = await Service.getMasterFilterLists(filterKey, params);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.GET_DOCUMENT_MASTER_FILTER_LISTS_SUCCESS,
                    filterKey,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_DOCUMENT_MASTER_FILTER_LISTS_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_DOCUMENT_MASTER_FILTER_LISTS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getAllReports,
    updateReportEntityParams,
    updateDocument,
    getDocumentById,
    deleteDocument,
    addDocument,
    getAllDocuments,
    getListForCommonFilter,
    exportDocuments,
    getAllDocumentLogs,
    restoreDocumentLog,
    deleteDocumentLog,
    getInitiativeDropdown,
    getRecommendationDropdown,
    getAllRegionDropdownDocument,
    getSitesByRegionInDocuments,
    getMasterFilterLists
}