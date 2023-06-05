import * as actionTypes from "./constants";
import * as Service from "./services";

const getClients = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CLIENTS_REQUEST });
            const res = await Service.getClients(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_CLIENTS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_CLIENTS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CLIENTS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CLIENTS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addClient = params => {
    let rec_data1 = new FormData();
    rec_data1.append("image", params.image);
    rec_data1.append("description", params.comments ? params.comments : "");
    rec_data1.append("client", JSON.stringify(params));

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_CLIENT_REQUEST });
            const res = await Service.addClient(rec_data1);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.ADD_CLIENT_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.ADD_CLIENT_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_CLIENT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_CLIENT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateClient = (params, id, selectedImage) => {
    let rec_data = new FormData();
    if (selectedImage && selectedImage.name !== params.image.name) {
        rec_data.append("image", params.image);
    } else if (!params.image_id && params.image) {
        rec_data.append("image", params.image);
    } else {
        rec_data.append("image", params.image);
    }
    rec_data.append("description", params.comments ? params.comments : "");
    rec_data.append("client", JSON.stringify(params));

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_CLIENT_REQUEST });
            const res = await Service.updateClient(rec_data, id);

            if (res && (res.status === 200 || res.status === 201)) {
                const building_typeData = res.data;
                if (building_typeData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_CLIENT_SUCCESS,
                        response: building_typeData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_CLIENT_FAILURE,
                        error: building_typeData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_CLIENT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CLIENT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteClient = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CLIENT_REQUEST });
            const res = await Service.deleteClient(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.DELETE_CLIENT_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({ type: actionTypes.DELETE_CLIENT_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_CLIENT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_CLIENT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getClientById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CLIENT_BY_ID_REQUEST });
            const res = await Service.getClientById(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_CLIENT_BY_ID_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_CLIENT_BY_ID_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CLIENT_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CLIENT_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateBuildingTypeEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_CLIENT_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CLIENT_ENTITY_PARAMS_FAILURE,
                error: entityParams
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
                const siteData = res.data;
                if (siteData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: siteData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: siteData
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

const getAllClientLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CLIENT_LOG_REQUEST });
            const res = await Service.getAllClientLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_CLIENT_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CLIENT_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_CLIENT_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_CLIENT_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreClientLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_CLIENT_LOG_REQUEST });
            const res = await Service.restoreClientLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_CLIENT_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_CLIENT_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_CLIENT_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_CLIENT_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteClientLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CLIENT_LOG_REQUEST });
            const res = await Service.deleteClientLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_CLIENT_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_CLIENT_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_CLIENT_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_CLIENT_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const exportClient = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CLIENT_EXPORT_REQUEST });
            const response = await Service.exportClient(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_CLIENT_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
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
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CLIENT_EXPORT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getLandingPageData = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LANDING_PAGE_DATA_REQUEST });
            const res = await Service.getLandingPageData(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_LANDING_PAGE_DATA_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LANDING_PAGE_DATA_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_LANDING_PAGE_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_LANDING_PAGE_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const updateLandingPageData = (params,file_change) => {
    let formData = new FormData()
    formData.append("landing_page", JSON.stringify(params))
    if(file_change.cbre_logo_change){
        formData.append("cbre_logo", params.cbre_logo)
    }
    if(file_change.logo_change){
        formData.append("logo", params.logo)
    }
    if(file_change.image_change){
        formData.append("image", params.image)
    }
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_LANDING_PAGE_DATA_REQUEST });
            const res = await Service.updateLandingPageData(formData);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_LANDING_PAGE_DATA_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_LANDING_PAGE_DATA_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_LANDING_PAGE_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_LANDING_PAGE_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addLandingPageData = (params,file_change) => {
    let formData = new FormData()
    formData.append("landing_page", JSON.stringify(params))
    if(file_change.cbre_logo_change){
        formData.append("cbre_logo", params.cbre_logo)
    }
    if(file_change.logo_change){
        formData.append("logo", params.logo)
    }
    if(file_change.image_change){
        formData.append("image", params.image)
    }
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_LANDING_PAGE_DATA_REQUEST });
            const res = await Service.addLandingPageData(formData);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.ADD_LANDING_PAGE_DATA_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.ADD_LANDING_PAGE_DATA_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_LANDING_PAGE_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_LANDING_PAGE_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const copyGlobalChartTemplates = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.COPY_CHART_TEMPLATE_REQUEST });
            const res = await Service.copyGlobalChartTemplates(params);
            if (res && (res.status === 200 || res.status === 201)) {
                const resData = res.data;
                dispatch({ type: actionTypes.COPY_CHART_TEMPLATE_SUCCESS, response: resData });
            } else {
                dispatch({
                    type: actionTypes.COPY_CHART_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.COPY_CHART_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};


export default {
    getClients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    updateBuildingTypeEntityParams,
    getListForCommonFilter,
    getAllClientLogs,
    restoreClientLog,
    deleteClientLog,
    exportClient,
    getLandingPageData,
    addLandingPageData,
    updateLandingPageData,
    copyGlobalChartTemplates
};
