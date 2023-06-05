import * as actionTypes from "./constants";
import * as Service from "./services";

const getAllRegions = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_REGIONS_REQUEST });
            const res = await Service.getAllRegions(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_REGIONS_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_REGIONS_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_REGIONS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_REGIONS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addRegion = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_REGION_REQUEST });
            const res = await Service.addRegion(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.ADD_REGION_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.ADD_REGION_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_REGION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_REGION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateRegion = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_REGION_REQUEST });
            const res = await Service.updateRegion(params, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.UPDATE_REGION_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_REGION_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_REGION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_REGION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteRegion = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_REGION_REQUEST });
            const res = await Service.deleteRegion(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_REGION_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_REGION_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_REGION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_REGION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllConsultancyUsers = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_USERS_REQUEST });
            const res = await Service.getAllConsultancyUsers(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_CONSULTANCY_USERS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_CONSULTANCY_USERS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_CONSULTANCY_USERS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_CONSULTANCY_USERS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllClients = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CLIENTS_REQUEST });
            const res = await Service.getAllClients(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_CLIENTS_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CLIENTS_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_CLIENTS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_CLIENTS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getRegionById = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REGION_BY_ID_REQUEST });
            const res = await Service.getRegionById(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_REGION_BY_ID_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_REGION_BY_ID_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_REGION_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REGION_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const uploadRegionImage = (imageData, id) => {
    let newImageData = new FormData();
    newImageData.append("image", imageData.file);
    newImageData.append("description", imageData.comments);

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPLOAD_IMAGE_REQUEST });
            const res = await Service.uploadImage(newImageData, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.UPLOAD_IMAGE_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.UPLOAD_IMAGE_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPLOAD_IMAGE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPLOAD_IMAGE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllRegionImages = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_IMAGES_REQUEST });
            const res = await Service.getAllImages(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_IMAGES_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_IMAGES_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_IMAGES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_IMAGES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteRegionImage = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_IMAGES_REQUEST });
            const res = await Service.deleteImages(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_IMAGES_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_IMAGES_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_IMAGES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_IMAGES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateRegionImageComment = imageData => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_IMAGE_COMMENT_REQUEST });
            const res = await Service.updateImageComment(imageData);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_IMAGE_COMMENT_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({ type: actionTypes.UPDATE_IMAGE_COMMENT_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_IMAGE_COMMENT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_IMAGE_COMMENT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateRegionEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_REGION_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_REGION_ENTITY_PARAMS_FAILURE,
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
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: regionData
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

const exportRegion = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REGION_EXPORT_REQUEST });
            const response = await Service.exportRegion(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_REGION_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_REGION_EXPORT_SUCCESS, response: {} });
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
                type: actionTypes.GET_REGION_EXPORT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const exportRegionByProject = (projectId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REGION_EXPORT_REQUEST });
            const response = await Service.exportRegionByProject(projectId, params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_REGION_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_REGION_EXPORT_SUCCESS, response: {} });
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

const getAllLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_LOGS_REQUEST });
            const res = await Service.getAllLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_LOGS_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_LOGS_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreRegionLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_LOG_REQUEST });
            const res = await Service.restoreRegionLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteRegionLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_LOG_REQUEST });
            const res = await Service.deleteRegionLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getChartsByRegion = (chartParams, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHART_REGION_REQUEST });
            const res = await Service.getChartsByRegion(chartParams, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_CHART_REGION_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_CHART_REGION_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHART_REGION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHART_REGION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getProjectsBasedOnClient = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PROJECTS_BASED_ON_CLIENT_REQUEST });
            const res = await Service.getProjectsBasedOnClient(params);
            if (res && res.status === 200) {
                const projectData = res.data;
                if (projectData.success) {
                    dispatch({
                        type: actionTypes.GET_PROJECTS_BASED_ON_CLIENT_SUCCESS,
                        response: projectData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_PROJECTS_BASED_ON_CLIENT_FAILURE,
                        error: projectData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_PROJECTS_BASED_ON_CLIENT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_PROJECTS_BASED_ON_CLIENT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getEfciByRegion = (projectId, regionId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_EFCI_BASED_ON_REGION_REQUEST });
            const res = await Service.getEfciByRegion(projectId, regionId);
            if (res && res.status === 200) {
                const projectData = res.data;
                if (projectData.success) {
                    dispatch({
                        type: actionTypes.GET_EFCI_BASED_ON_REGION_SUCCESS,
                        response: projectData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_EFCI_BASED_ON_REGION_FAILURE,
                        error: projectData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_EFCI_BASED_ON_REGION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_EFCI_BASED_ON_REGION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateRegionFundingCost = (value, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_REGION_FUNDING_COST_REQUEST });
            const res = await Service.updateRegionFundingCost(value, id);
            if (res && res.status === 200) {
                const projectData = res.data;
                if (projectData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_REGION_FUNDING_COST_SUCCESS,
                        response: projectData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_REGION_FUNDING_COST_FAILURE,
                        error: projectData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_REGION_FUNDING_COST_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_REGION_FUNDING_COST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateRegionFundingCostEfci = (value, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_REGION_FUNDING_COST_EFCI_REQUEST });
            const res = await Service.updateRegionFundingCostEfci(value, id);
            if (res && res.status === 200) {
                const projectData = res.data;
                if (projectData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_REGION_FUNDING_COST_EFCI_SUCCESS,
                        response: projectData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_REGION_FUNDING_COST_EFCI_FAILURE,
                        error: projectData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_REGION_FUNDING_COST_EFCI_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_REGION_FUNDING_COST_EFCI_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateRegionAnnualFundingOption = (amount, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_REGION_ANNUAL_FUNDING_REQUEST });
            const res = await Service.updateRegionAnnualFundingOption(amount, id);
            if (res && res.status === 200) {
                const projectData = res.data;
                if (projectData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_REGION_ANNUAL_FUNDING_SUCCESS,
                        response: projectData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_REGION_ANNUAL_FUNDING_FAILURE,
                        error: projectData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_REGION_ANNUAL_FUNDING_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_REGION_ANNUAL_FUNDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateRegionAnnualEfci = (id, value) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_REGION_ANNUAL_EFCI_REQUEST });
            const res = await Service.updateRegionAnnualEfci(id, value);
            if (res && res.status === 200) {
                const projectData = res.data;
                if (projectData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_REGION_ANNUAL_EFCI_SUCCESS,
                        response: projectData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_REGION_ANNUAL_EFCI_FAILURE,
                        error: projectData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_REGION_ANNUAL_EFCI_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_REGION_ANNUAL_EFCI_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getChartEfciRegion = (regionId, projectId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHART_EFCI_REGION_REQUEST });
            const res = await Service.getChartEfciRegion(regionId, projectId, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_CHART_EFCI_REGION_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_CHART_EFCI_REGION_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHART_EFCI_REGION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHART_EFCI_REGION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const loadChartDataRegion = (siteId, projectId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.LOAD_EFCI_REGION_REQUEST });
            const res = await Service.loadChartDataRegion(siteId, projectId);
            if (res && res.status === 200) {
                const siteData = res.data;
                if (siteData.success) {
                    dispatch({
                        type: actionTypes.LOAD_EFCI_REGION_SUCCESS,
                        response: siteData
                    });
                } else {
                    dispatch({
                        type: actionTypes.LOAD_EFCI_REGION_FAILURE,
                        error: siteData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.LOAD_EFCI_REGION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.LOAD_EFCI_REGION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateCspSummary = (id, value) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_REGION_CSP_SUMMARY_REQUEST });
            const res = await Service.updateCspSummary(id, value);
            if (res && res.status === 200) {
                const projectData = res.data;
                if (projectData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_REGION_CSP_SUMMARY_SUCCESS,
                        response: projectData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_REGION_CSP_SUMMARY_FAILURE,
                        error: projectData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_REGION_CSP_SUMMARY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_REGION_CSP_SUMMARY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getCspLogById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_REGION_CSP_SUMMARY_REQUEST });
            const res = await Service.getCspLogById(id);
            if (res && res.status === 200) {
                const projectData = res.data;
                if (projectData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_REGION_CSP_SUMMARY_SUCCESS,
                        response: projectData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_REGION_CSP_SUMMARY_FAILURE,
                        error: projectData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_REGION_CSP_SUMMARY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_REGION_CSP_SUMMARY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const saveDataEfciChartRegion = (regionId, projectId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.SAVE_CHART_REGION_REQUEST });
            const res = await Service.saveDataEfciChartRegion(regionId, projectId);
            if (res && res.status === 200) {
                const siteData = res.data;
                if (siteData.success) {
                    dispatch({
                        type: actionTypes.SAVE_CHART_REGION_SUCCESS,
                        response: siteData
                    });
                } else {
                    dispatch({
                        type: actionTypes.SAVE_CHART_REGION_FAILURE,
                        error: siteData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.SAVE_CHART_REGION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.SAVE_CHART_REGION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllClientUsers = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CLIENT_USERS_REQUEST });
            const res = await Service.getAllClientUsers({ client_id: id });
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_CLIENT_USERS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_CLIENT_USERS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_CLIENT_USERS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_CLIENT_USERS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const lockRegion = (id, regionId, lock) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.LOCK_REGION_REQUEST });
            const res = await Service.lockRegion(id, regionId, lock);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.LOCK_REGION_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.LOCK_REGION_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.LOCK_REGION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.LOCK_REGION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const lockRegionSandbox = (id, regionId, lock) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.LOCK_REGION_REQUEST });
            const res = await Service.lockRegionSandbox(id, regionId, lock);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.LOCK_REGION_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.LOCK_REGION_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.LOCK_REGION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.LOCK_REGION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllConsultanciesDropdown = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CONSULTANCIES_DROPDOWN_REQUEST });
            const res = await Service.getAllConsultanciesDropdown({ consultancy_id: id });
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_CONSULTANCIES_DROPDOWN_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CONSULTANCIES_DROPDOWN_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_CONSULTANCIES_DROPDOWN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_CONSULTANCIES_DROPDOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const hideFundingOptionChart = id => {
    let spendingPercent = id;
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.HIDE_FUNDING_OPTION_CHART_REQUEST });
            if (id.length >= 0) {
                if (id.length > 0) {
                    dispatch({
                        type: actionTypes.HIDE_FUNDING_OPTION_CHART_SUCCESS,
                        response: spendingPercent
                    });
                } else {
                    dispatch({
                        type: actionTypes.HIDE_FUNDING_OPTION_CHART_FAILURE,
                        error: spendingPercent
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.HIDE_FUNDING_OPTION_CHART_FAILURE,
                    error: spendingPercent
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.HIDE_FUNDING_OPTION_CHART_FAILURE,
                error: spendingPercent
            });
        }
    };
};

const hideFundingOption = id => {
    let spendingPercent = id;
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.HIDE_FUNDING_OPTION_REQUEST });
            if (id.length >= 0) {
                if (id.length > 0) {
                    dispatch({
                        type: actionTypes.HIDE_FUNDING_OPTION_SUCCESS,
                        response: spendingPercent
                    });
                } else {
                    dispatch({
                        type: actionTypes.HIDE_FUNDING_OPTION_FAILURE,
                        error: spendingPercent
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.HIDE_FUNDING_OPTION_FAILURE,
                    error: spendingPercent
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.HIDE_FUNDING_OPTION_FAILURE,
                error: spendingPercent
            });
        }
    };
};

const getChartExportRegion = (chartParams, params) => {
    return async dispatch => {
        try {
            const response = await Service.getChartExportRegion(chartParams, params);
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

export default {
    getAllRegions,
    addRegion,
    updateRegion,
    deleteRegion,
    getAllConsultancyUsers,
    getAllClients,
    getRegionById,
    uploadRegionImage,
    getAllRegionImages,
    deleteRegionImage,
    updateRegionImageComment,
    updateRegionEntityParams,
    getListForCommonFilter,
    exportRegion,
    exportRegionByProject,
    getAllLogs,
    restoreRegionLog,
    deleteRegionLog,
    getChartsByRegion,
    getProjectsBasedOnClient,
    getEfciByRegion,
    getChartEfciRegion,
    loadChartDataRegion,
    updateRegionFundingCost,
    updateRegionFundingCostEfci,
    updateRegionAnnualFundingOption,
    updateRegionAnnualEfci,
    updateCspSummary,
    getCspLogById,
    saveDataEfciChartRegion,
    getAllClientUsers,
    getChartExportRegion,

    lockRegion,
    lockRegionSandbox,
    getAllConsultanciesDropdown,
    hideFundingOption,
    hideFundingOptionChart
};
