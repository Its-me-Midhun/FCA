import * as actionTypes from "./constants";
import * as Service from "./services";

const getAllSites = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_SITES_REQUEST });
            const res = await Service.getAllSites(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_SITES_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_SITES_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_SITES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_SITES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addSite = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_SITE_REQUEST });
            const res = await Service.addSite(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.ADD_SITE_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.ADD_SITE_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_SITE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_SITE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateSite = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_SITE_REQUEST });
            const res = await Service.updateSite(params, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.UPDATE_SITE_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_SITE_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_SITE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SITE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteSite = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SITE_REQUEST });
            const res = await Service.deleteSite(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_SITE_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_SITE_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_SITE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_SITE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getRegionsBasedOnClient = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REGIONS_BASED_ON_CLIENT_REQUEST });
            const res = await Service.getRegionsBasedOnClient(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_REGIONS_BASED_ON_CLIENT_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_REGIONS_BASED_ON_CLIENT_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_REGIONS_BASED_ON_CLIENT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REGIONS_BASED_ON_CLIENT_FAILURE,
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

const getSiteById = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SITE_BY_ID_REQUEST });
            const res = await Service.getSiteById(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_SITE_BY_ID_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_SITE_BY_ID_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SITE_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SITE_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const uploadSiteImage = (imageData, id) => {
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

const getAllSiteImages = (id, params) => {
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

const deleteSiteImage = id => {
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

const updateSiteImageComment = imageData => {
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

const updateSiteEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_SITE_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SITE_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const getChartData = (chartParams, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHART_REQUEST });
            const res = await Service.getChartData(chartParams, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_CHART_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({ type: actionTypes.GET_CHART_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHART_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHART_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getListForCommonFiltersite = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilter(params);
            if (res && res.status === 200) {
                const siteEfci = res.data;
                if (siteEfci.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: siteEfci
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: siteEfci
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

const getEfciBySite = (siteId, projectId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_EFCI_BY_SITE_REQUEST });
            const res = await Service.getEfciBySite(siteId, projectId);
            if (res && res.status === 200) {
                const siteData = res.data;
                if (siteData.success) {
                    dispatch({
                        type: actionTypes.GET_EFCI_BY_SITE_SUCCESS,
                        response: siteData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_EFCI_BY_SITE_FAILURE,
                        error: siteData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_EFCI_BY_SITE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_EFCI_BY_SITE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateCapitalSpendingPlan = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_CAPITAL_SPENDING_PLAN_REQUEST });
            const res = await Service.updateCapitalSpendingPlan(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_CAPITAL_SPENDING_PLAN_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_CAPITAL_SPENDING_PLAN_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_CAPITAL_SPENDING_PLAN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CAPITAL_SPENDING_PLAN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateFundingOption = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_FUNDING_OPTION_REQUEST });
            const res = await Service.updateFundingOption(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_FUNDING_OPTION_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_FUNDING_OPTION_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_FUNDING_OPTION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_FUNDING_OPTION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

// const updateAnnualEfci = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_ANNUAL_EFCI_REQUEST });
//             const res = await Service.updateAnnualEfci(id, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.UPDATE_ANNUAL_EFCI_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.UPDATE_ANNUAL_EFCI_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_ANNUAL_EFCI_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_ANNUAL_EFCI_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };
const updateAnnualEfci = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_ANNUAL_EFCI_REQUEST });
            const res = await Service.updateAnnualEfci(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_ANNUAL_EFCI_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_ANNUAL_EFCI_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_ANNUAL_EFCI_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ANNUAL_EFCI_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const updateAnnualFunding = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_ANNUAL_FUNDING_REQUEST });
            const res = await Service.updateAnnualFunding(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_ANNUAL_FUNDING_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_ANNUAL_FUNDING_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_ANNUAL_FUNDING_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ANNUAL_FUNDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
  
const updateFundingSiteEfci = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_FUNDING_EFCI_REQUEST });
            const res = await Service.updateFundingSiteEfci(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_FUNDING_EFCI_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_FUNDING_EFCI_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_FUNDING_EFCI_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_FUNDING_EFCI_FAILURE,
                error: e.response && e.response.data
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

const resetEfciData = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESET_EFCI_REQUEST });
            const res = await Service.resetEfciData(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.RESET_EFCI_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.RESET_EFCI_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.RESET_EFCI_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESET_EFCI_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getChartEfci = (siteId, projectId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHART_EFCI_REQUEST });
            const res = await Service.getChartEfci(siteId, projectId, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_CHART_EFCI_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_CHART_EFCI_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHART_EFCI_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHART_EFCI_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateCapitalSpendingPlanChart = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_CAPITAL_SPENDING_PLAN_CHART_REQUEST });
            const res = await Service.updateCapitalSpendingPlanChart(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_CAPITAL_SPENDING_PLAN_CHART_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_CAPITAL_SPENDING_PLAN_CHART_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_CAPITAL_SPENDING_PLAN_CHART_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CAPITAL_SPENDING_PLAN_CHART_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateFundingOptionChart = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_FUNDING_OPTION_CHART_REQUEST });
            const res = await Service.updateFundingOptionChart(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_FUNDING_OPTION_CHART_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_FUNDING_OPTION_CHART_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_FUNDING_OPTION_CHART_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_FUNDING_OPTION_CHART_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateAnnualEfciChart = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_ANNUAL_EFCI_CHART_REQUEST });
            const res = await Service.updateAnnualEfciChart(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_ANNUAL_EFCI_CHART_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_ANNUAL_EFCI_CHART_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_ANNUAL_EFCI_CHART_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ANNUAL_EFCI_CHART_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const updateAnnualFundingChart = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_ANNUAL_FUNDING_CHART_REQUEST });
            const res = await Service.updateAnnualFundingChart(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_ANNUAL_FUNDING_CHART_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_ANNUAL_FUNDING_CHART_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_ANNUAL_FUNDING_CHART_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ANNUAL_FUNDING_CHART_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateFundingSiteEfciChart = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_FUNDING_EFCI_CHART_REQUEST });
            const res = await Service.updateFundingSiteEfciChart(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_FUNDING_EFCI_CHART_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_FUNDING_EFCI_CHART_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_FUNDING_EFCI_CHART_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_FUNDING_EFCI_FAILURE,
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

const saveDataEfciChart = (siteId, projectId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.SAVE_EFCI_REQUEST });
            const res = await Service.saveDataEfciChart(siteId, projectId);
            if (res && res.status === 200) {
                const siteData = res.data;
                if (siteData.success) {
                    dispatch({
                        type: actionTypes.SAVE_EFCI_SUCCESS,
                        response: siteData
                    });
                } else {
                    dispatch({
                        type: actionTypes.SAVE_EFCI_FAILURE,
                        error: siteData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.SAVE_EFCI_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.SAVE_EFCI_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const loadChartData = (siteId, projectId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.LOAD_EFCI_REQUEST });
            const res = await Service.loadChartData(siteId, projectId);
            if (res && res.status === 200) {
                const siteData = res.data;
                if (siteData.success) {
                    dispatch({
                        type: actionTypes.LOAD_EFCI_SUCCESS,
                        response: siteData
                    });
                } else {
                    dispatch({
                        type: actionTypes.LOAD_EFCI_FAILURE,
                        error: siteData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.LOAD_EFCI_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.LOAD_EFCI_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const exportSite = params => {
    return async dispatch => {
        try {
            await Service.exportSite(params).then(response => {
                if (response && response.status === 200) {
                    const regionData = response.data;
                    if (regionData.error) {
                        dispatch({ type: actionTypes.GET_SITE_EXPORT_SUCCESS, response: regionData });
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
            });
        } catch (e) {}
    };
};

const efciTabData = activeTab => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_EFCI_ACTIVE_TAB_REQUEST });
            dispatch({
                type: actionTypes.ADD_EFCI_ACTIVE_TAB_SUCCESS,
                response: activeTab
            });
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_EFCI_ACTIVE_TAB_FAILURE
                // error: e.response && e.response.data
            });
        }
    };
};

const exportSiteByRegion = params => {
    return async dispatch => {
        try {
            await Service.exportSiteByRegion(params).then(response => {
                if (response && response.status === 200) {
                    const regionData = response.data;
                    if (regionData.error) {
                        dispatch({ type: actionTypes.GET_SITE_EXPORT_SUCCESS, response: regionData });
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
            });
        } catch (e) {}
    };
};

const exportSiteUnderRegion = params => {
    return async dispatch => {
        try {
            await Service.exportSiteUnderRegion(params).then(response => {
                if (response && response.status === 200) {
                    const regionData = response.data;
                    if (regionData.error) {
                        dispatch({ type: actionTypes.GET_SITE_EXPORT_SUCCESS, response: regionData });
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
            });
        } catch (e) {}
    };
};

const getAllSiteLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_SITE_LOG_REQUEST });
            const res = await Service.getAllSiteLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_SITE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_SITE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_SITE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_SITE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreSiteLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_SITE_LOG_REQUEST });
            const res = await Service.restoreSiteLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_SITE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_SITE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_SITE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_SITE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteSiteLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SITE_LOG_REQUEST });
            const res = await Service.deleteSiteLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_SITE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_SITE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_SITE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_SITE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAnnualEfciLogs = (columnId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ANNUAL_EFCI_LOGS_REQUEST });
            const res = await Service.getAnnualEfciLogs(columnId, params);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ANNUAL_EFCI_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ANNUAL_EFCI_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ANNUAL_EFCI_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ANNUAL_EFCI_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAnnualFundingCalculationLogs = (columnId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ANNUAL_FUNDING_OPTIONS_LOGS_REQUEST });
            const res = await Service.getAnnualFundingCalculationLogs(columnId, params);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ANNUAL_FUNDING_OPTIONS_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ANNUAL_FUNDING_OPTIONS_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ANNUAL_FUNDING_OPTIONS_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ANNUAL_FUNDING_OPTIONS_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreAnnualEFCI = columnId => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_ANNUAL_EFCI_LOGS_REQUEST });
            const res = await Service.restoreAnnualEFCI(columnId);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.RESTORE_ANNUAL_EFCI_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.RESTORE_ANNUAL_EFCI_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_ANNUAL_EFCI_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_ANNUAL_EFCI_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreAnnualFundingCalculation = columnId => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_ANNUAL_FUNDING_LOGS_REQUEST });
            const res = await Service.restoreAnnualFundingCalculation(columnId);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.RESTORE_ANNUAL_FUNDING_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.RESTORE_ANNUAL_FUNDING_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_ANNUAL_FUNDING_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_ANNUAL_FUNDING_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getFundingOptionLog = (columnId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FUNDING_OPTIONS_LOGS_REQUEST });
            const res = await Service.getFundingOptionLog(columnId, params);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_FUNDING_OPTIONS_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_FUNDING_OPTIONS_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_FUNDING_OPTIONS_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_FUNDING_OPTIONS_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreFundingOptionLogs = columnId => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_FUNDING_LOGS_REQUEST });
            const res = await Service.restoreFundingOptionLogs(columnId);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.RESTORE_FUNDING_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.RESTORE_FUNDING_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_FUNDING_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_FUNDING_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getFundingSiteEfciLog = (columnId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FUNDING_EFCI_LOGS_REQUEST });
            const res = await Service.getFundingSiteEfciLog(columnId, params);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_FUNDING_EFCI_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_FUNDING_EFCI_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_FUNDING_EFCI_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_FUNDING_EFCI_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreFundingEfciLogs = columnId => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_FUNDING_EFCI_LOGS_REQUEST });
            const res = await Service.restoreFundingEfciLogs(columnId);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.RESTORE_FUNDING_EFCI_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.RESTORE_FUNDING_EFCI_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_FUNDING_EFCI_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_FUNDING_EFCI_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getTotalFundingLog = (columnId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TOTAL_FUNDING_EFCI_LOGS_REQUEST });
            const res = await Service.getTotalFundingLog(columnId, params);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_TOTAL_FUNDING_EFCI_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_TOTAL_FUNDING_EFCI_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_TOTAL_FUNDING_EFCI_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_TOTAL_FUNDING_EFCI_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreFundingTotalLogs = columnId => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_TOTAL_FUNDING_EFCI_LOGS_REQUEST });
            const res = await Service.restoreFundingTotalLogs(columnId);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.RESTORE_TOTAL_FUNDING_EFCI_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.RESTORE_TOTAL_FUNDING_EFCI_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_TOTAL_FUNDING_EFCI_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_TOTAL_FUNDING_EFCI_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getCapitalSpendingPlanLogs = (columnId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CSP_LOGS_REQUEST });
            const res = await Service.getCapitalSpendingPlanLogs(columnId, params);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_CSP_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_CSP_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CSP_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CSP_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreCapitalSpendingPlanLogs = columnId => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_CSP_LOGS_REQUEST });
            const res = await Service.restoreCapitalSpendingPlanLogs(columnId);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.RESTORE_CSP_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.RESTORE_CSP_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_CSP_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_CSP_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteEFCILog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_EFCI_LOG_REQUEST });
            const res = await Service.deleteEFCILog(id);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.DELETE_EFCI_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.DELETE_EFCI_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_EFCI_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_EFCI_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

//logs for chart

const getAllSiteByChartLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_SITE_CHART_LOG_REQUEST });
            const res = await Service.getAllSiteByChartLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_SITE_CHART_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_SITE_CHART_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_SITE_CHART_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_SITE_CHART_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreSiteByChartLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_SITE_CHART_LOG_REQUEST });
            const res = await Service.restoreSiteByChartLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_SITE_CHART_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_SITE_CHART_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_SITE_CHART_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_SITE_CHART_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteSiteByChartLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_SITE_CHART_LOG_REQUEST });
            const res = await Service.deleteSiteByChartLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_SITE_CHART_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_SITE_CHART_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_SITE_CHART_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_SITE_CHART_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAnnualEfciByChartLogs = (columnId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ANNUAL_EFCI_CHART_LOGS_REQUEST });
            const res = await Service.getAnnualEfciByChartLogs(columnId, params);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ANNUAL_EFCI_CHART_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ANNUAL_EFCI_CHART_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ANNUAL_EFCI_CHART_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ANNUAL_EFCI_CHART_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAnnualFundingCalculationByChartLogs = (columnId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ANNUAL_FUNDING_OPTIONS_CHART_LOGS_REQUEST });
            const res = await Service.getAnnualFundingCalculationByChartLogs(columnId, params);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ANNUAL_FUNDING_OPTIONS_CHART_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ANNUAL_FUNDING_OPTIONS_CHART_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ANNUAL_FUNDING_OPTIONS_CHART_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ANNUAL_FUNDING_OPTIONS_CHART_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreAnnualByChartEFCI = columnId => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_ANNUAL_EFCI_CHART_LOGS_REQUEST });
            const res = await Service.restoreAnnualByChartEFCI(columnId);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.RESTORE_ANNUAL_EFCI_CHART_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.RESTORE_ANNUAL_EFCI_CHART_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_ANNUAL_EFCI_CHART_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_ANNUAL_EFCI_CHART_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreAnnualFundingByChartCalculation = columnId => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_ANNUAL_FUNDING_CHART_LOGS_REQUEST });
            const res = await Service.restoreAnnualFundingByChartCalculation(columnId);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.RESTORE_ANNUAL_FUNDING_CHART_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.RESTORE_ANNUAL_FUNDING_CHART_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_ANNUAL_FUNDING_CHART_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_ANNUAL_FUNDING_CHART_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getFundingOptionByChartLog = (columnId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FUNDING_OPTIONS_CHART_LOGS_REQUEST });
            const res = await Service.getFundingOptionByChartLog(columnId, params);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_FUNDING_OPTIONS_CHART_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_FUNDING_OPTIONS_CHART_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_FUNDING_OPTIONS_CHART_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_FUNDING_OPTIONS_CHART_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreFundingOptionByChartLogs = columnId => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_FUNDING_CHART_LOGS_REQUEST });
            const res = await Service.restoreFundingOptionByChartLogs(columnId);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.RESTORE_FUNDING_CHART_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.RESTORE_FUNDING_CHART_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_FUNDING_CHART_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_FUNDING_CHART_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getFundingSiteEfciByChartLog = (columnId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FUNDING_EFCI_CHART_LOGS_REQUEST });
            const res = await Service.getFundingSiteEfciByChartLog(columnId, params);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_FUNDING_EFCI_CHART_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_FUNDING_EFCI_CHART_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_FUNDING_EFCI_CHART_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_FUNDING_EFCI_CHART_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreFundingEfciByChartLogs = columnId => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_FUNDING_EFCI_CHART_LOGS_REQUEST });
            const res = await Service.restoreFundingEfciByChartLogs(columnId);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.RESTORE_FUNDING_EFCI_CHART_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.RESTORE_FUNDING_EFCI_CHART_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_FUNDING_EFCI_CHART_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_FUNDING_EFCI_CHART_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getTotalFundingByChartLog = (columnId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TOTAL_FUNDING_EFCI_CHART_LOGS_REQUEST });
            const res = await Service.getTotalFundingByChartLog(columnId, params);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_TOTAL_FUNDING_EFCI_CHART_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_TOTAL_FUNDING_EFCI_CHART_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_TOTAL_FUNDING_EFCI_CHART_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_TOTAL_FUNDING_EFCI_CHART_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreFundingTotalByChartLogs = columnId => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_TOTAL_FUNDING_EFCI_CHART_LOGS_REQUEST });
            const res = await Service.restoreFundingTotalByChartLogs(columnId);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.RESTORE_TOTAL_FUNDING_EFCI_CHART_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.RESTORE_TOTAL_FUNDING_EFCI_CHART_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_TOTAL_FUNDING_EFCI_CHART_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_TOTAL_FUNDING_EFCI_CHART_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getCapitalSpendingPlanByChartLogs = (columnId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CSP_LOGS_REQUEST });
            const res = await Service.getCapitalSpendingPlanByChartLogs(columnId, params);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_CSP_CHART_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_CSP_CHART_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CSP_CHART_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CSP_CHART_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreCapitalSpendingPlanByChartLogs = columnId => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_CSP_CHART_LOGS_REQUEST });
            const res = await Service.restoreCapitalSpendingPlanByChartLogs(columnId);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.RESTORE_CSP_CHART_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.RESTORE_CSP_CHART_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_CSP_CHART_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_CSP_CHART_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteEFCIByChartLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_EFCI_CHART_LOG_REQUEST });
            const res = await Service.deleteEFCIByChartLog(id);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.DELETE_EFCI_CHART_LOGS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.DELETE_EFCI_CHART_LOGS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_EFCI_CHART_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_EFCI_CHART_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getChartExport = (chartParams, params) => {
    // return async dispatch => {
    //     try {
    //         dispatch({ type: actionTypes.GET_CHART_EXPORT_REQUEST });
    //         const res = await Service.getChartExport(chartParams,params);

    //         if (res && res.status === 200) {
    //             const regionData = res.data;
    //             if (regionData.success) {
    //                 dispatch({
    //                     type: actionTypes.GET_CHART_EXPORT_SUCCESS,
    //                     response: regionData
    //                 });
    //             } else {
    //                 dispatch({
    //                     type: actionTypes.GET_CHART_EXPORT_FAILURE,
    //                     error: regionData
    //                 });
    //             }
    //         } else {
    //             dispatch({
    //                 type: actionTypes.GET_CHART_EXPORT_FAILURE,
    //                 error: res.response && res.response.data
    //             });
    //         }
    //     } catch (e) {
    //         dispatch({
    //             type: actionTypes.GET_CHART_EXPORT_FAILURE,
    //             error: e.response && e.response.data
    //         });
    //     }
    // };
    return async dispatch => {
        try {
            const response = await Service.getChartExport(chartParams, params);
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

const lockSite = (id, siteId, lock) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.LOCK_SITE_REQUEST });
            const res = await Service.lockSite(id, siteId, lock);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.LOCK_SITE_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.LOCK_SITE_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.LOCK_SITE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.LOCK_SITE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const lockSiteSandbox = (id, siteId, lock) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.LOCK_SITE_REQUEST });
            const res = await Service.lockSiteSandbox(id, siteId, lock);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.LOCK_SITE_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.LOCK_SITE_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.LOCK_SITE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.LOCK_SITE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getAllSites,
    addSite,
    updateSite,
    deleteSite,
    getRegionsBasedOnClient,
    getAllConsultancyUsers,
    getAllClients,
    getSiteById,
    uploadSiteImage,
    getAllSiteImages,
    deleteSiteImage,
    updateSiteImageComment,
    updateSiteEntityParams,
    getChartData,
    getListForCommonFiltersite,
    getEfciBySite,
    updateCapitalSpendingPlan,
    updateFundingOption,
    updateAnnualEfci,
    updateAnnualFunding,
    updateFundingSiteEfci,
    hideFundingOption,
    resetEfciData,
    getChartEfci,
    updateCapitalSpendingPlanChart,
    updateFundingOptionChart,
    updateAnnualEfciChart,
    updateAnnualFundingChart,
    updateFundingSiteEfciChart,
    hideFundingOptionChart,
    saveDataEfciChart,
    loadChartData,
    exportSite,
    efciTabData,
    exportSiteByRegion,
    exportSiteUnderRegion,
    getAllSiteLogs,
    restoreSiteLog,
    deleteSiteLog,
    getAnnualEfciLogs,
    getAnnualFundingCalculationLogs,
    restoreAnnualEFCI,
    restoreAnnualFundingCalculation,
    getFundingOptionLog,
    restoreFundingOptionLogs,
    getFundingSiteEfciLog,
    restoreFundingEfciLogs,
    getTotalFundingLog,
    restoreFundingTotalLogs,
    getCapitalSpendingPlanLogs,
    restoreCapitalSpendingPlanLogs,
    deleteEFCILog,

    getAllSiteByChartLogs,
    restoreSiteByChartLog,
    deleteSiteByChartLog,
    getAnnualEfciByChartLogs,
    getAnnualFundingCalculationByChartLogs,
    restoreAnnualByChartEFCI,
    restoreAnnualFundingByChartCalculation,
    getFundingOptionByChartLog,
    restoreFundingOptionByChartLogs,
    getFundingSiteEfciByChartLog,
    restoreFundingEfciByChartLogs,
    getTotalFundingByChartLog,
    restoreFundingTotalByChartLogs,
    getCapitalSpendingPlanByChartLogs,
    restoreCapitalSpendingPlanByChartLogs,
    deleteEFCIByChartLog,

    getChartExport,
    getProjectsBasedOnClient,
    getAllClientUsers,
    getAllConsultanciesDropdown,
    lockSite,
    lockSiteSandbox
};
