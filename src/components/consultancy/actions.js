import * as actionTypes from "./constants";
import * as Service from "./services";

const getAllConsultancies = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_REQUEST });
            const res = await Service.getAllConsultancies(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_CONSULTANCY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_CONSULTANCY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addConsultancy = params => {
    let rec_data = new FormData();
    rec_data.append("image", params.image);
    rec_data.append("description", params.comments);
    rec_data.append("consultancy", JSON.stringify(params));
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_CONSULTANCY_REQUEST });
            const res = await Service.addConsultancy(rec_data);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.ADD_CONSULTANCY_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.ADD_CONSULTANCY_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_CONSULTANCY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_CONSULTANCY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateConsultancy = (params, id, selectedImage) => {
    console.log(params, id, selectedImage, "from consultancy");
    let rec_data = new FormData();
    if (selectedImage && selectedImage.name !== params.image.name) {
        rec_data.append("image", params.image);
    } else if (!params.image_id && params.image) {
        rec_data.append("image", params.image);
    } else {
        rec_data.append("image", params.image);
    }
    rec_data.append("description", params.comments);
    rec_data.append("consultancy", JSON.stringify(params));
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_CONSULTANCY_REQUEST });
            const res = await Service.updateConsultancy(rec_data, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.UPDATE_CONSULTANCY_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_CONSULTANCY_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_CONSULTANCY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CONSULTANCY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteConsultancy = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CONSULTANCY_REQUEST });
            const res = await Service.deleteConsultancy(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_CONSULTANCY_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_CONSULTANCY_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_CONSULTANCY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_CONSULTANCY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

// const getAllConsultancyUsers = () => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_USERS_REQUEST });
//             const res = await Service.getAllConsultancyUsers();
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_ALL_CONSULTANCY_USERS_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_ALL_CONSULTANCY_USERS_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_ALL_CONSULTANCY_USERS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_ALL_CONSULTANCY_USERS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

const getAllClients = () => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CLIENTS_REQUEST });
            const res = await Service.getAllClients();
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

const getConsultancyById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CONSULTANCY_BY_ID_REQUEST });
            const res = await Service.getConsultancyById(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_BY_ID_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_BY_ID_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CONSULTANCY_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CONSULTANCY_BY_ID_FAILURE,
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

const getAllRegionImages = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_IMAGES_REQUEST });
            const res = await Service.getAllImages(id);
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

const updateConsultancyEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_CONSULTANCY_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CONSULTANCY_ENTITY_PARAMS_FAILURE,
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

const exportConsultancy = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CONSULTANCY_EXPORT_REQUEST });
            const response = await Service.exportConsultancy(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_EXPORT_SUCCESS, response: {} });
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
                type: actionTypes.GET_CONSULTANCY_EXPORT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllConsultancyLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_LOGS_REQUEST });
            const res = await Service.getAllConsultancyLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_LOGS_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_LOGS_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_CONSULTANCY_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_CONSULTANCY_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreConsultancyLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_CONSULTANCY_LOG_REQUEST });
            const res = await Service.restoreConsultancyLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_CONSULTANCY_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_CONSULTANCY_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_CONSULTANCY_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_CONSULTANCY_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteConsultancyLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOG_REQUEST });
            const res = await Service.deleteConsultancyLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_CONSULTANCY_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_CONSULTANCY_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_CONSULTANCY_LOG_FAILURE,
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

const getProjectsBasedOnClient = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PROJECTS_BASED_ON_CLIENT_REQUEST });
            const res = await Service.getProjectsBasedOnClient(id);
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

export default {
    getAllConsultancies,
    addConsultancy,
    updateConsultancy,
    deleteConsultancy,
    // getAllConsultancyUsers,
    getAllClients,
    getConsultancyById,
    uploadRegionImage,
    getAllRegionImages,
    deleteRegionImage,
    updateRegionImageComment,
    updateConsultancyEntityParams,
    getListForCommonFilter,
    exportConsultancy,
    // exportRegionByProject,
    getAllConsultancyLogs,
    restoreConsultancyLog,
    deleteConsultancyLog,
    getChartsByRegion,
    getProjectsBasedOnClient,
    getEfciByRegion,
    getChartEfciRegion,
    loadChartDataRegion,
    updateRegionFundingCost,
    updateRegionFundingCostEfci,
    updateRegionAnnualFundingOption,
    updateRegionAnnualEfci
};
