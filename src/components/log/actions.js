import * as actionTypes from "./constants";
import * as Service from "./services";

const getAllLogs = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_LOGS_REQUEST });
            const res = await Service.getAllLogs(params);
            if (res && res.status === 200) {
                const logData = res.data;
                if (logData.success) {
                    dispatch({ type: actionTypes.GET_ALL_LOGS_SUCCESS, response: logData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_LOGS_FAILURE, error: logData });
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

const addLog = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_LOG_REQUEST });
            const res = await Service.addLog(params);
            if (res && res.status === 200) {
                const logData = res.data;
                if (logData.success) {
                    dispatch({ type: actionTypes.ADD_LOG_SUCCESS, response: logData });
                } else {
                    dispatch({ type: actionTypes.ADD_LOG_FAILURE, error: logData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateLog = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_LOG_REQUEST });
            const res = await Service.updateLog(params, id);
            if (res && res.status === 200) {
                const logData = res.data;
                if (logData.success) {
                    dispatch({ type: actionTypes.UPDATE_LOG_SUCCESS, response: logData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_LOG_FAILURE, error: logData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_LOG_REQUEST });
            const res = await Service.deleteLog(id);
            if (res && res.status === 200) {
                const logData = res.data;
                if (logData.success) {
                    dispatch({ type: actionTypes.DELETE_LOG_SUCCESS, response: logData });
                } else {
                    dispatch({ type: actionTypes.DELETE_LOG_FAILURE, error: logData });
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

const getAllConsultancyUsers = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_USERS_REQUEST });
            const res = await Service.getAllConsultancyUsers(params);
            if (res && res.status === 200) {
                const logData = res.data;
                if (logData.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_CONSULTANCY_USERS_SUCCESS,
                        response: logData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_CONSULTANCY_USERS_FAILURE,
                        error: logData
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
                const logData = res.data;
                if (logData.success) {
                    dispatch({ type: actionTypes.GET_ALL_CLIENTS_SUCCESS, response: logData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CLIENTS_FAILURE, error: logData });
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

const getLogById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LOG_BY_ID_REQUEST });
            const res = await Service.getLogById(id);
            if (res && res.status === 200) {
                const logData = res.data;
                if (logData.success) {
                    dispatch({ type: actionTypes.GET_LOG_BY_ID_SUCCESS, response: logData });
                } else {
                    dispatch({ type: actionTypes.GET_LOG_BY_ID_FAILURE, error: logData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_LOG_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_LOG_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const uploadLogImage = (imageData, id) => {
    let newImageData = new FormData();
    newImageData.append("image", imageData.file);
    newImageData.append("description", imageData.comments);

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPLOAD_IMAGE_REQUEST });
            const res = await Service.uploadImage(newImageData, id);
            if (res && res.status === 200) {
                const logData = res.data;
                if (logData.success) {
                    dispatch({ type: actionTypes.UPLOAD_IMAGE_SUCCESS, response: logData });
                } else {
                    dispatch({ type: actionTypes.UPLOAD_IMAGE_FAILURE, error: logData });
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

const getAllLogImages = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_IMAGES_REQUEST });
            const res = await Service.getAllImages(id);
            if (res && res.status === 200) {
                const logData = res.data;
                if (logData.success) {
                    dispatch({ type: actionTypes.GET_ALL_IMAGES_SUCCESS, response: logData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_IMAGES_FAILURE, error: logData });
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

const deleteLogImage = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_IMAGES_REQUEST });
            const res = await Service.deleteImages(id);
            if (res && res.status === 200) {
                const logData = res.data;
                if (logData.success) {
                    dispatch({ type: actionTypes.DELETE_IMAGES_SUCCESS, response: logData });
                } else {
                    dispatch({ type: actionTypes.DELETE_IMAGES_FAILURE, error: logData });
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

const updateLogImageComment = imageData => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_IMAGE_COMMENT_REQUEST });
            const res = await Service.updateImageComment(imageData);
            if (res && res.status === 200) {
                const logData = res.data;
                if (logData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_IMAGE_COMMENT_SUCCESS,
                        response: logData
                    });
                } else {
                    dispatch({ type: actionTypes.UPDATE_IMAGE_COMMENT_FAILURE, error: logData });
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

const updateLogEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_LOG_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_LOG_ENTITY_PARAMS_FAILURE,
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
                const logData = res.data;
                if (logData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: logData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: logData
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

const exportLog = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LOG_EXPORT_REQUEST });
            const response = await Service.exportLog(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_LOG_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_LOG_EXPORT_SUCCESS, response: {} });
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
                type: actionTypes.GET_LOG_EXPORT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const exportLogByProject = (projectId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LOG_EXPORT_REQUEST });
            const response = await Service.exportLogByProject(projectId, params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_LOG_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_LOG_EXPORT_SUCCESS, response: {} });
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

// const getAllLogs = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_ALL_LOGS_REQUEST });
//             const res = await Service.getAllLogs(id, params);
//             if (res && res.status === 200) {
//                 const logData = res.data;
//                 if (logData.success) {
//                     dispatch({ type: actionTypes.GET_ALL_LOGS_SUCCESS, response: logData });
//                 } else {
//                     dispatch({ type: actionTypes.GET_ALL_LOGS_FAILURE, error: logData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_ALL_LOGS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_ALL_LOGS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

const restoreLogLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_LOG_REQUEST });
            const res = await Service.restoreLogLog(id);
            if (res && res.status === 200) {
                const logData = res.data;
                if (logData.success) {
                    dispatch({ type: actionTypes.RESTORE_LOG_SUCCESS, response: logData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_LOG_FAILURE, error: logData });
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

const deleteLogLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_LOG_REQUEST });
            const res = await Service.deleteLogLog(id);
            if (res && res.status === 200) {
                const logData = res.data;
                if (logData.success) {
                    dispatch({ type: actionTypes.DELETE_LOG_SUCCESS, response: logData });
                } else {
                    dispatch({ type: actionTypes.DELETE_LOG_FAILURE, error: logData });
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

const getChartsByLog = (chartParams, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHART_LOG_REQUEST });
            const res = await Service.getChartsByLog(chartParams, params);
            if (res && res.status === 200) {
                const logData = res.data;
                if (logData.success) {
                    dispatch({ type: actionTypes.GET_CHART_LOG_SUCCESS, response: logData });
                } else {
                    dispatch({ type: actionTypes.GET_CHART_LOG_FAILURE, error: logData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHART_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHART_LOG_FAILURE,
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

const getEfciByLog = (projectId, logId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_EFCI_BASED_ON_LOG_REQUEST });
            const res = await Service.getEfciByLog(projectId, logId);
            if (res && res.status === 200) {
                const projectData = res.data;
                if (projectData.success) {
                    dispatch({
                        type: actionTypes.GET_EFCI_BASED_ON_LOG_SUCCESS,
                        response: projectData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_EFCI_BASED_ON_LOG_FAILURE,
                        error: projectData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_EFCI_BASED_ON_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_EFCI_BASED_ON_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateLogFundingCost = (value, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_LOG_FUNDING_COST_REQUEST });
            const res = await Service.updateLogFundingCost(value, id);
            if (res && res.status === 200) {
                const projectData = res.data;
                if (projectData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_LOG_FUNDING_COST_SUCCESS,
                        response: projectData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_LOG_FUNDING_COST_FAILURE,
                        error: projectData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_LOG_FUNDING_COST_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_LOG_FUNDING_COST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateLogFundingCostEfci = (value, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_LOG_FUNDING_COST_EFCI_REQUEST });
            const res = await Service.updateLogFundingCostEfci(value, id);
            if (res && res.status === 200) {
                const projectData = res.data;
                if (projectData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_LOG_FUNDING_COST_EFCI_SUCCESS,
                        response: projectData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_LOG_FUNDING_COST_EFCI_FAILURE,
                        error: projectData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_LOG_FUNDING_COST_EFCI_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_LOG_FUNDING_COST_EFCI_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateLogAnnualFundingOption = (amount, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_LOG_ANNUAL_FUNDING_REQUEST });
            const res = await Service.updateLogAnnualFundingOption(amount, id);
            if (res && res.status === 200) {
                const projectData = res.data;
                if (projectData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_LOG_ANNUAL_FUNDING_SUCCESS,
                        response: projectData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_LOG_ANNUAL_FUNDING_FAILURE,
                        error: projectData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_LOG_ANNUAL_FUNDING_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_LOG_ANNUAL_FUNDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateLogAnnualEfci = (id, value) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_LOG_ANNUAL_EFCI_REQUEST });
            const res = await Service.updateLogAnnualEfci(id, value);
            if (res && res.status === 200) {
                const projectData = res.data;
                if (projectData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_LOG_ANNUAL_EFCI_SUCCESS,
                        response: projectData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_LOG_ANNUAL_EFCI_FAILURE,
                        error: projectData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_LOG_ANNUAL_EFCI_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_LOG_ANNUAL_EFCI_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getChartEfciLog = (logId, projectId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHART_EFCI_LOG_REQUEST });
            const res = await Service.getChartEfciLog(logId, projectId, params);
            if (res && res.status === 200) {
                const logData = res.data;
                if (logData.success) {
                    dispatch({
                        type: actionTypes.GET_CHART_EFCI_LOG_SUCCESS,
                        response: logData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_CHART_EFCI_LOG_FAILURE,
                        error: logData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHART_EFCI_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHART_EFCI_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const loadChartDataLog = (siteId, projectId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.LOAD_EFCI_LOG_REQUEST });
            const res = await Service.loadChartDataLog(siteId, projectId);
            if (res && res.status === 200) {
                const siteData = res.data;
                if (siteData.success) {
                    dispatch({
                        type: actionTypes.LOAD_EFCI_LOG_SUCCESS,
                        response: siteData
                    });
                } else {
                    dispatch({
                        type: actionTypes.LOAD_EFCI_LOG_FAILURE,
                        error: siteData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.LOAD_EFCI_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.LOAD_EFCI_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateCspSummary = (id, value) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_LOG_CSP_SUMMARY_REQUEST });
            const res = await Service.updateCspSummary(id, value);
            if (res && res.status === 200) {
                const projectData = res.data;
                if (projectData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_LOG_CSP_SUMMARY_SUCCESS,
                        response: projectData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_LOG_CSP_SUMMARY_FAILURE,
                        error: projectData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_LOG_CSP_SUMMARY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_LOG_CSP_SUMMARY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getCspLogById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_LOG_CSP_SUMMARY_REQUEST });
            const res = await Service.getCspLogById(id);
            if (res && res.status === 200) {
                const projectData = res.data;
                if (projectData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_LOG_CSP_SUMMARY_SUCCESS,
                        response: projectData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_LOG_CSP_SUMMARY_FAILURE,
                        error: projectData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_LOG_CSP_SUMMARY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_LOG_CSP_SUMMARY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const saveDataEfciChartLog = (logId, projectId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.SAVE_CHART_LOG_REQUEST });
            const res = await Service.saveDataEfciChartLog(logId, projectId);
            if (res && res.status === 200) {
                const siteData = res.data;
                if (siteData.success) {
                    dispatch({
                        type: actionTypes.SAVE_CHART_LOG_SUCCESS,
                        response: siteData
                    });
                } else {
                    dispatch({
                        type: actionTypes.SAVE_CHART_LOG_FAILURE,
                        error: siteData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.SAVE_CHART_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.SAVE_CHART_LOG_FAILURE,
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
                const logData = res.data;
                if (logData.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_CLIENT_USERS_SUCCESS,
                        response: logData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_CLIENT_USERS_FAILURE,
                        error: logData
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

const lockLog = (id, logId, lock) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.LOCK_LOG_REQUEST });
            const res = await Service.lockLog(id, logId, lock);
            if (res && res.status === 200) {
                const logData = res.data;
                if (logData.success) {
                    dispatch({
                        type: actionTypes.LOCK_LOG_SUCCESS,
                        response: logData
                    });
                } else {
                    dispatch({
                        type: actionTypes.LOCK_LOG_FAILURE,
                        error: logData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.LOCK_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.LOCK_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const lockLogSandbox = (id, logId, lock) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.LOCK_LOG_REQUEST });
            const res = await Service.lockLogSandbox(id, logId, lock);
            if (res && res.status === 200) {
                const logData = res.data;
                if (logData.success) {
                    dispatch({
                        type: actionTypes.LOCK_LOG_SUCCESS,
                        response: logData
                    });
                } else {
                    dispatch({
                        type: actionTypes.LOCK_LOG_FAILURE,
                        error: logData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.LOCK_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.LOCK_LOG_FAILURE,
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
                const logData = res.data;
                if (logData.success) {
                    dispatch({ type: actionTypes.GET_ALL_CONSULTANCIES_DROPDOWN_SUCCESS, response: logData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CONSULTANCIES_DROPDOWN_FAILURE, error: logData });
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

export default {
    getAllLogs,
    addLog,
    updateLog,
    deleteLog,
    getAllConsultancyUsers,
    getAllClients,
    getLogById,
    uploadLogImage,
    getAllLogImages,
    deleteLogImage,
    updateLogImageComment,
    updateLogEntityParams,
    getListForCommonFilter,
    exportLog,
    exportLogByProject,
    // getAllLogs,
    restoreLogLog,
    deleteLogLog,
    getChartsByLog,
    getProjectsBasedOnClient,
    getEfciByLog,
    getChartEfciLog,
    loadChartDataLog,
    updateLogFundingCost,
    updateLogFundingCostEfci,
    updateLogAnnualFundingOption,
    updateLogAnnualEfci,
    updateCspSummary,
    getCspLogById,
    saveDataEfciChartLog,
    getAllClientUsers,

    lockLog,
    lockLogSandbox,
    getAllConsultanciesDropdown,
    hideFundingOption,
    hideFundingOptionChart
};
