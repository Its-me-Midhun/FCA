import * as actionTypes from "./constants";
import * as Service from "./services";

const getSmartChartMasterFilterDropDown = (key, entity, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_MASTER_FILTER_IN_SMART_CHART_REQUEST });
            const res = await Service.getSmartChartMasterFilterDropDown(key, params);
            if (res && res.status === 200) {
                const dropdownData = res.data;
                dispatch({
                    type: actionTypes.GET_MASTER_FILTER_IN_SMART_CHART_SUCCESS,
                    response: dropdownData,
                    filterKey: key,
                    entity: entity
                });
            } else {
                dispatch({
                    type: actionTypes.GET_MASTER_FILTER_IN_SMART_CHART_FAILURE,
                    error: res.response && res.response.data,
                    filterKey: key,
                    entity: entity
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_MASTER_FILTER_IN_SMART_CHART_FAILURE,
                error: e.response && e.response.data,
                filterKey: key,
                entity: entity
            });
        }
    };
};

const exportSmartChartData = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_SMART_CHART_DATA_REQUEST });
            const res = await Service.exportSmartChartData(params);
            if (res && res.status === 200) {
                const smartChartData = res.data;
                dispatch({
                    type: actionTypes.EXPORT_SMART_CHART_DATA_SUCCESS,
                    response: smartChartData
                });
            } else {
                dispatch({
                    type: actionTypes.EXPORT_SMART_CHART_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.EXPORT_SMART_CHART_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const saveSmartChartData = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.SAVE_SMART_CHART_DATA_REQUEST });
            const res = await Service.saveSmartChartData(params);
            if (res && res.status === 201) {
                const smartChartData = res.data;
                dispatch({
                    type: actionTypes.SAVE_SMART_CHART_DATA_SUCCESS,
                    response: smartChartData
                });
            } else {
                dispatch({
                    type: actionTypes.SAVE_SMART_CHART_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.SAVE_SMART_CHART_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getExportedSmartChartList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_EXPORTED_SMART_CHART_LIST_REQUEST });
            const res = await Service.getExportedSmartChartList(params);
            if (res && res.status === 200) {
                const smartChartList = res.data;
                dispatch({
                    type: actionTypes.GET_EXPORTED_SMART_CHART_LIST_SUCCESS,
                    response: smartChartList
                });
            } else {
                dispatch({
                    type: actionTypes.GET_EXPORTED_SMART_CHART_LIST_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_EXPORTED_SMART_CHART_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteSmartChartReport = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SMART_CHART_REPORT_REQUEST });
            const res = await Service.deleteSmartChartReport(id);
            if (res && res.status === 200) {
                const deleteSmartChartData = res.data;
                dispatch({
                    type: actionTypes.DELETE_SMART_CHART_REPORT_SUCCESS,
                    response: deleteSmartChartData
                });
            } else {
                dispatch({
                    type: actionTypes.DELETE_SMART_CHART_REPORT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_SMART_CHART_REPORT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const uploadDocsForSmartReport = params => {
    let docData = new FormData();
    docData.append("name", params.name);
    docData.append("file", params.file);
    docData.append("user", params.user);
    docData.append("client_id", params.client_id);
    docData.append("notes", params.notes);
    if (params.is_image) {
        docData.append("is_image", params.is_image);
    }
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPLOAD_DOC_FOR_SMART_REPORT_REQUEST });
            const res = await Service.uploadDocsForSmartReport(docData);
            if (res && res.status === 201) {
                const smartChartData = res.data;
                dispatch({
                    type: actionTypes.UPLOAD_DOC_FOR_SMART_REPORT_SUCCESS,
                    response: smartChartData
                });
            } else {
                dispatch({
                    type: actionTypes.UPLOAD_DOC_FOR_SMART_REPORT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPLOAD_DOC_FOR_SMART_REPORT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getUploadedDocList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_UPLOADED_DOC_LIST_REQUEST });
            const res = await Service.getUploadedDocList(params);
            if (res && res.status === 200) {
                const smartChartList = res.data;
                dispatch({
                    type: actionTypes.GET_UPLOADED_DOC_LIST_SUCCESS,
                    response: smartChartList
                });
            } else {
                dispatch({
                    type: actionTypes.GET_UPLOADED_DOC_LIST_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_UPLOADED_DOC_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateSmartReportData = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_SMART_REPORT_DATA_REQUEST });
            const res = await Service.updateSmartReportData(id, params);
            if (res && res.status === 200) {
                const smartChartData = res.data;
                dispatch({
                    type: actionTypes.UPDATE_SMART_REPORT_DATA_SUCCESS,
                    response: smartChartData
                });
            } else {
                dispatch({
                    type: actionTypes.UPDATE_SMART_REPORT_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SMART_REPORT_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getTemplatePropertiesList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TEMPLATE_PROPERTIES_LIST_REQUEST });
            const res = await Service.getTemplatePropertiesList(params);
            if (res && res.status === 200) {
                const propertiesList = res.data;
                dispatch({
                    type: actionTypes.GET_TEMPLATE_PROPERTIES_LIST_SUCCESS,
                    response: propertiesList
                });
            } else {
                dispatch({
                    type: actionTypes.GET_TEMPLATE_PROPERTIES_LIST_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_TEMPLATE_PROPERTIES_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getTemplateList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TEMPLATE_LIST_REQUEST });
            const res = await Service.getTemplateList(params);
            if (res && res.status === 200) {
                const propertiesList = res.data;
                dispatch({
                    type: actionTypes.GET_TEMPLATE_LIST_SUCCESS,
                    response: propertiesList
                });
            } else {
                dispatch({
                    type: actionTypes.GET_TEMPLATE_LIST_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_TEMPLATE_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteUserDocs = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_USER_DOC_REQUEST });
            const res = await Service.deleteUserDocs({ id: id });
            if (res && res.status === 204) {
                const deleteUserDocRes = res.data;
                dispatch({
                    type: actionTypes.DELETE_USER_DOC_SUCCESS,
                    response: deleteUserDocRes
                });
            } else {
                dispatch({
                    type: actionTypes.DELETE_USER_DOC_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_USER_DOC_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getClientDropDownData = () => {
    let currentUser = localStorage.getItem("userId") || "";
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CLIENTS_LIST_FOR_SMART_CHART_REQUEST });
            const res = await Service.getClientDropDownData({ user_id: currentUser });
            if (res && res.status === 200) {
                const clientList = res.data;
                dispatch({
                    type: actionTypes.GET_CLIENTS_LIST_FOR_SMART_CHART_SUCCESS,
                    response: clientList
                });
            } else {
                dispatch({
                    type: actionTypes.GET_CLIENTS_LIST_FOR_SMART_CHART_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CLIENTS_LIST_FOR_SMART_CHART_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateDocOrder = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_DOC_ORDER_REQUEST });
            const res = await Service.updateDocOrder(params);
            if (res && res.status === 200) {
                const docOrderData = res.data;
                dispatch({
                    type: actionTypes.UPDATE_DOC_ORDER_SUCCESS,
                    response: docOrderData
                });
            } else {
                dispatch({
                    type: actionTypes.UPDATE_DOC_ORDER_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_DOC_ORDER_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateUserDocData = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_USER_DOC_DATA_REQUEST });
            const res = await Service.updateUserDocData(id, params);
            if (res && res.status === 200) {
                const userDocData = res.data;
                dispatch({
                    type: actionTypes.UPDATE_USER_DOC_DATA_SUCCESS,
                    response: userDocData
                });
            } else {
                dispatch({
                    type: actionTypes.UPDATE_USER_DOC_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_USER_DOC_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateSmartChartProperty = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_SMART_CHART_PROPERTY_REQUEST });
            const res = await Service.updateSmartChartProperty(id, params);
            if (res && res.status === 200) {
                const smartChartData = res.data;
                dispatch({
                    type: actionTypes.UPDATE_SMART_CHART_PROPERTY_SUCCESS,
                    response: smartChartData
                });
            } else {
                dispatch({
                    type: actionTypes.UPDATE_SMART_CHART_PROPERTY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SMART_CHART_PROPERTY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSmartChartPropertyList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SMART_CHART_PROPERTIES_LIST_REQUEST });
            const res = await Service.getSmartChartPropertyList(params);
            if (res && res.status === 200) {
                const smartChartList = res.data;
                dispatch({
                    type: actionTypes.GET_SMART_CHART_PROPERTIES_LIST_SUCCESS,
                    response: smartChartList
                });
            } else {
                dispatch({
                    type: actionTypes.GET_SMART_CHART_PROPERTIES_LIST_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SMART_CHART_PROPERTIES_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSmartChartPropertyById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SMART_CHART_PROPERTY_BY_ID_REQUEST });
            const res = await Service.getSmartChartPropertyById(id);
            if (res && res.status === 200) {
                const smartChartData = res.data;
                dispatch({
                    type: actionTypes.GET_SMART_CHART_PROPERTY_BY_ID_SUCCESS,
                    response: smartChartData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_SMART_CHART_PROPERTY_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SMART_CHART_PROPERTY_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateSmartReportsEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_SMART_REPORT_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SMART_REPORT_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const getUploadedImageList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_UPLOADED_IMAGE_LIST_REQUEST });
            const res = await Service.getUploadedDocList(params);
            if (res && res.status === 200) {
                const ImageList = res.data;
                dispatch({
                    type: actionTypes.GET_UPLOADED_IMAGE_LIST_SUCCESS,
                    response: ImageList
                });
            } else {
                dispatch({
                    type: actionTypes.GET_UPLOADED_IMAGE_LIST_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_UPLOADED_IMAGE_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const saveAndExportSmartChartData = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.SAVE_AND_EXPORT_SMART_CHART_DATA_REQUEST });
            const res = await Service.exportSmartChartData(params);
            if (res && res.status === 200) {
                const smartChartData = res.data;
                dispatch({
                    type: actionTypes.SAVE_AND_EXPORT_SMART_CHART_DATA_SUCCESS,
                    response: smartChartData
                });
            } else {
                dispatch({
                    type: actionTypes.SAVE_AND_EXPORT_SMART_CHART_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.SAVE_AND_EXPORT_SMART_CHART_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteSmartChartReportTemplate = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SMART_CHART_REPORT_TEMPLATE_REQUEST });
            const res = await Service.deleteSmartChartReportTemplate(params);
            if (res && res.status === 204) {
                const deleteSmartChartData = res.data;
                dispatch({
                    type: actionTypes.DELETE_SMART_CHART_REPORT_TEMPLATE_SUCCESS,
                    response: deleteSmartChartData
                });
            } else {
                dispatch({
                    type: actionTypes.DELETE_SMART_CHART_REPORT_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_SMART_CHART_REPORT_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getReportsByTemplateList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REPORTS_BY_TEMPLATE_LIST_REQUEST });
            const res = await Service.getExportedSmartChartList(params);
            if (res && res.status === 200) {
                const smartChartList = res.data;
                dispatch({
                    type: actionTypes.GET_REPORTS_BY_TEMPLATE_LIST_SUCCESS,
                    response: smartChartList
                });
            } else {
                dispatch({
                    type: actionTypes.GET_REPORTS_BY_TEMPLATE_LIST_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REPORTS_BY_TEMPLATE_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const assignImagesToSmartCharts = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_IMAGES_TO_SMART_CHARTS_REQUEST });
            const res = await Service.assignImagesToSmartCharts(params);
            if (res && res.status === 200) {
                const smartChartData = res.data;

                dispatch({
                    type: actionTypes.ASSIGN_IMAGES_TO_SMART_CHARTS_SUCCESS,
                    response: smartChartData
                });
            } else {
                dispatch({
                    type: actionTypes.ASSIGN_IMAGES_TO_SMART_CHARTS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ASSIGN_IMAGES_TO_SMART_CHARTS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const lockSmartChartTemplate = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.LOCK_SMART_CHART_TEMPLATE_REQUEST });
            const res = await Service.lockSmartChartTemplate(params);
            if (res && res.status === 200) {
                const templateData = res.data;
                dispatch({
                    type: actionTypes.LOCK_SMART_CHART_TEMPLATE_SUCCESS,
                    response: templateData
                });
            } else {
                dispatch({
                    type: actionTypes.LOCK_SMART_CHART_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.LOCK_SMART_CHART_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getSmartChartMasterFilterDropDown,
    exportSmartChartData,
    saveSmartChartData,
    getExportedSmartChartList,
    deleteSmartChartReport,
    uploadDocsForSmartReport,
    getUploadedDocList,
    updateSmartReportData,
    getTemplatePropertiesList,
    getTemplateList,
    deleteUserDocs,
    getClientDropDownData,
    updateDocOrder,
    updateUserDocData,
    updateSmartChartProperty,
    getSmartChartPropertyList,
    getSmartChartPropertyById,
    updateSmartReportsEntityParams,
    getUploadedImageList,
    saveAndExportSmartChartData,
    deleteSmartChartReportTemplate,
    getReportsByTemplateList,
    assignImagesToSmartCharts,
    lockSmartChartTemplate
};
