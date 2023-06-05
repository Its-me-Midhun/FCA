import * as actionTypes from "./constants";
import * as Service from "./services";

const getAllBuildings = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_BUILDINGS_REQUEST });
            const res = await Service.getAllBuildings(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_BUILDINGS_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_BUILDINGS_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_BUILDINGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_BUILDINGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addBuilding = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_BUILDING_REQUEST });
            const res = await Service.addBuilding(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.ADD_BUILDING_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.ADD_BUILDING_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_BUILDING_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateBuilding = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_BUILDING_REQUEST });
            const res = await Service.updateBuilding(params, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.UPDATE_BUILDING_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_BUILDING_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_BUILDING_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteBuilding = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_BUILDING_REQUEST });
            const res = await Service.deleteBuilding(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_BUILDING_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_BUILDING_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_BUILDING_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getRegionsBasedOnClient = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REGIONS_BASED_ON_CLIENT_REQUEST });
            const res = await Service.getRegionsBasedOnClient(id);
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

const getSitesBasedOnRegion = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SITES_BASED_ON_REGION_REQUEST });
            const res = await Service.getSitesBasedOnRegion(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_SITES_BASED_ON_REGION_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SITES_BASED_ON_REGION_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SITES_BASED_ON_REGION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SITES_BASED_ON_REGION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllBuldingConsultancyUsers = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_USERS_REQUEST });
            const res = await Service.getAllBuldingConsultancyUsers(params);
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

const BuildinggetAllClients = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CLIENTS_REQUEST });
            const res = await Service.BuildinggetAllClients(params);
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

const getBuildingById = (id, projectId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_BY_ID_REQUEST });
            const res = await Service.getBuildingById(id, projectId);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_BUILDING_BY_ID_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({ type: actionTypes.GET_BUILDING_BY_ID_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_BUILDING_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_BUILDING_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllCountries = () => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_COUNTRIES_REQUEST });
            const res = await Service.getAllCountries();
            if (res && res.status === 200) {
                const billingDetails = res.data;
                if (billingDetails.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_COUNTRIES_SUCCESS,
                        response: billingDetails
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_COUNTRIES_FAILURE,
                        error: billingDetails
                    });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_COUNTRIES_FAILURE, error: res.response.data });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_COUNTRIES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getBuildingsBasedOnSite = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDINGS_BASED_ON_SITE_REQUEST });
            const res = await Service.getBuildingsBasedOnSite(id, params);
            if (res && res.status === 200) {
                const billingDetails = res.data;
                if (billingDetails.success) {
                    dispatch({
                        type: actionTypes.GET_BUILDINGS_BASED_ON_SITE_SUCCESS,
                        response: billingDetails
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_BUILDINGS_BASED_ON_SITE_FAILURE,
                        error: billingDetails
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_BUILDINGS_BASED_ON_SITE_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_BUILDINGS_BASED_ON_SITE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getDepartmentByProject = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DEPARTMENT_BASED_ON_PROJECT_REQUEST });
            const res = await Service.getDepartmentByProject(id);
            if (res && res.status === 200) {
                const billingDetails = res.data;
                if (billingDetails.success) {
                    dispatch({
                        type: actionTypes.GET_DEPARTMENT_BASED_ON_PROJECT_SUCCESS,
                        response: billingDetails
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_DEPARTMENT_BASED_ON_PROJECT_FAILURE,
                        error: billingDetails
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_DEPARTMENT_BASED_ON_PROJECT_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_DEPARTMENT_BASED_ON_PROJECT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const uploadBuildingImage = (imageData, id) => {
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

const getAllBuildingImages = (id, params) => {
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

const deleteBuildingImage = id => {
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

const updateBuildingImageComment = imageData => {
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

const updateBuildingEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_BUILDING_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_BUILDING_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const getEfciBasedOnProject = (projectId, buildingId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_EFCI_BASED_ON_BUILDING_REQUEST });
            const res = await Service.getEfciBasedOnProject(projectId, buildingId);
            if (res && res.status === 200) {
                const efciData = res.data;
                if (efciData.success) {
                    dispatch({
                        type: actionTypes.GET_EFCI_BASED_ON_BUILDING_SUCCESS,
                        response: efciData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_EFCI_BASED_ON_BUILDING_FAILURE,
                        error: efciData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_EFCI_BASED_ON_BUILDING_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_EFCI_BASED_ON_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateCapitalSpendingPercentage = (id, capitalSpending) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_CAPITAL_SPENDING_PERCENT_REQUEST });
            const res = await Service.updateCapitalSpendingPercentage(id, capitalSpending);
            if (res && res.success) {
                const spendingPercent = res.data;
                if (spendingPercent.success) {
                    dispatch({
                        type: actionTypes.UPDATE_CAPITAL_SPENDING_PERCENT_SUCCESS,
                        response: spendingPercent
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_CAPITAL_SPENDING_PERCENT_FAILURE,
                        error: spendingPercent
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_CAPITAL_SPENDING_PERCENT_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_CAPITAL_SPENDING_PERCENT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateFundingCost = (id, fundingOption) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_FUNDING_COST_REQUEST });
            const res = await Service.updateFundingCost(id, fundingOption);
            if (res && res.status === 200) {
                const spendingPercent = res.data;
                if (spendingPercent.success) {
                    dispatch({
                        type: actionTypes.UPDATE_FUNDING_COST_SUCCESS,
                        response: spendingPercent
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_FUNDING_COST_FAILURE,
                        error: spendingPercent
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_FUNDING_COST_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_FUNDING_COST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateAnnualFundingOption = (id, fundingOption) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_ANNUAL_FUNDING_OPTION_REQUEST });
            const res = await Service.updateAnnualFundingOption(id, fundingOption);
            if (res && res.status === 200) {
                const spendingPercent = res.data;
                if (spendingPercent.success) {
                    dispatch({
                        type: actionTypes.UPDATE_ANNUAL_FUNDING_OPTION_SUCCESS,
                        response: spendingPercent
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_ANNUAL_FUNDING_OPTION_FAILURE,
                        error: spendingPercent
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_ANNUAL_FUNDING_OPTION_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ANNUAL_FUNDING_OPTION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateFci = (id, fci) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_FCI_AMOUNT_REQUEST });
            const res = await Service.updateFci(id, fci);
            if (res && res.status === 200) {
                const spendingPercent = res.data;
                if (spendingPercent.success) {
                    dispatch({
                        type: actionTypes.UPDATE_FCI_AMOUNT_SUCCESS,
                        response: spendingPercent
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_FCI_AMOUNT_FAILURE,
                        error: spendingPercent
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_FCI_AMOUNT_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_FCI_AMOUNT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateFundingEfci = (id, fundingEfci) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_FUNDING_EFCI_REQUEST });
            const res = await Service.updateFundingEfci(id, fundingEfci);
            if (res && res.status === 200) {
                const spendingPercent = res.data;
                if (spendingPercent.success) {
                    dispatch({
                        type: actionTypes.UPDATE_FUNDING_EFCI_SUCCESS,
                        response: spendingPercent
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_EFCI_BASED_ON_BUILDING_FAILURE,
                        error: spendingPercent
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_EFCI_BASED_ON_BUILDING_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_EFCI_BASED_ON_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getListForCommonFilterbuilding = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilter(params);
            if (res && res.status === 200) {
                const buildingData = res.data;
                if (buildingData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: buildingData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: buildingData
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

const getBuildingTypesBasedOnClient = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_TYPES_BASED_ON_CLIENT_REQUEST });
            const res = await Service.getBuildingTypesBasedOnClient(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_BUILDING_TYPES_BASED_ON_CLIENT_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_BUILDING_TYPES_BASED_ON_CLIENT_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_BUILDING_TYPES_BASED_ON_CLIENT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_BUILDING_TYPES_BASED_ON_CLIENT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateBuildingLock = (id, buildingEfci) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_BUILDING_LOCK_EFCI_REQUEST });
            const res = await Service.updateBuildingLock(id, buildingEfci);
            if (res && res.status === 200) {
                const spendingPercent = res.data;
                if (spendingPercent.success) {
                    dispatch({
                        type: actionTypes.UPDATE_BUILDING_LOCK_EFCI_SUCCESS,
                        response: spendingPercent
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_BUILDING_LOCK_EFCI_FAILURE,
                        error: spendingPercent
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_BUILDING_LOCK_EFCI_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_BUILDING_LOCK_EFCI_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const hideFundingOptionBuildingSite = id => {
    let spendingPercent = id;
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.HIDE_FUNDING_OPTION_BUILDING_SITE_REQUEST });
            if (id.length >= 0) {
                if (id.length > 0) {
                    dispatch({
                        type: actionTypes.HIDE_FUNDING_OPTION_BUILDING_SITE_SUCCESS,
                        response: spendingPercent
                    });
                } else {
                    dispatch({
                        type: actionTypes.HIDE_FUNDING_OPTION_BUILDING_SITE_FAILURE,
                        error: spendingPercent
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.HIDE_FUNDING_OPTION_BUILDING_SITE_FAILURE,
                    error: spendingPercent
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.HIDE_FUNDING_OPTION_BUILDING_SITE_FAILURE,
                error: spendingPercent
            });
        }
    };
};

const getChartsBuilding = (chartParams, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHART_BUILDING_REQUEST });
            const res = await Service.getChartsBuilding(chartParams, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_CHART_BUILDING_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({ type: actionTypes.GET_CHART_BUILDING_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHART_BUILDING_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHART_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getChartEfciBuilding = (chartParams, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHART_BUILDING_EFCI_REQUEST });
            const res = await Service.getChartEfciBuilding(chartParams, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_CHART_BUILDING_EFCI_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_CHART_BUILDING_EFCI_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHART_BUILDING_EFCI_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHART_BUILDING_EFCI_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const saveDataEfciChartBuilding = chartParams => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.SAVE_EFCI_BUILDING_REQUEST });
            const res = await Service.saveDataEfciChartBuilding(chartParams);
            if (res && res.status === 200) {
                const siteData = res.data;
                if (siteData.success) {
                    dispatch({
                        type: actionTypes.SAVE_EFCI_BUILDING_SUCCESS,
                        response: siteData
                    });
                } else {
                    dispatch({
                        type: actionTypes.SAVE_EFCI_BUILDING_FAILURE,
                        error: siteData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.SAVE_EFCI_BUILDING_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.SAVE_EFCI_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const loadChartDataBuilding = chartParams => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.LOAD_EFCI_BUILDING_REQUEST });
            const res = await Service.loadChartDataBuilding(chartParams);
            if (res && res.status === 200) {
                const siteData = res.data;
                if (siteData.success) {
                    dispatch({
                        type: actionTypes.LOAD_EFCI_BUILDING_SUCCESS,
                        response: siteData
                    });
                } else {
                    dispatch({
                        type: actionTypes.LOAD_EFCI_BUILDING_FAILURE,
                        error: siteData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.LOAD_EFCI_BUILDING_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.LOAD_EFCI_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const dashboardBuildingLock = (chartParams, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.LOCK_EFCI_BUILDING_REQUEST });
            const res = await Service.dashboardBuildingLock(chartParams, params);
            if (res && res.status === 200) {
                const siteData = res.data;
                if (siteData.success) {
                    dispatch({
                        type: actionTypes.LOCK_EFCI_BUILDING_SUCCESS,
                        response: siteData
                    });
                } else {
                    dispatch({
                        type: actionTypes.LOCK_EFCI_BUILDING_FAILURE,
                        error: siteData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.LOCK_EFCI_BUILDING_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.LOCK_EFCI_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const exportBuildings = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_EXPORT_REQUEST });
            const response = await Service.exportBuildings(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_BUILDING_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_BUILDING_EXPORT_SUCCESS, response: {} });
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

const exportBuildingsBySite = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_EXPORT_REQUEST });
            const response = await Service.exportBuildingsBySite(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_BUILDING_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_BUILDING_EXPORT_SUCCESS, response: {} });
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

const exportBuildingsUnderSite = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_EXPORT_REQUEST });
            const response = await Service.exportBuildingsUnderSite(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_BUILDING_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_BUILDING_EXPORT_SUCCESS, response: {} });
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

const getAllBuildingLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_BUILDING_LOG_REQUEST });
            const res = await Service.getAllBuildingLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_BUILDING_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_BUILDING_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_BUILDING_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_BUILDING_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreBuildingLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_BUILDING_LOG_REQUEST });
            const res = await Service.restoreBuildingLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_BUILDING_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_BUILDING_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_BUILDING_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_BUILDING_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteBuildingLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_BUILDING_LOG_REQUEST });
            const res = await Service.deleteBuildingLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_BUILDING_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_BUILDING_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_BUILDING_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_BUILDING_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getCSPLog = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CSP_LOG_REQUEST });
            const res = await Service.getCSPLog(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_CSP_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_CSP_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CSP_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CSP_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreCSPLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_CSP_LOG_REQUEST });
            const res = await Service.restoreCSPLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_CSP_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_CSP_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_CSP_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_CSP_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getFundingCostLog = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FUNDING_COST_LOG_REQUEST });
            const res = await Service.getFundingCostLog(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_FUNDING_COST_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_FUNDING_COST_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_FUNDING_COST_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_FUNDING_COST_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreFundingCost = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_FUNDING_COST_LOG_REQUEST });
            const res = await Service.restoreFundingCost(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_FUNDING_COST_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_FUNDING_COST_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_FUNDING_COST_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_FUNDING_COST_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getFundingEfciLog = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FUNDING_COST_EFCI_LOG_REQUEST });
            const res = await Service.getFundingEfciLog(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_FUNDING_COST_EFCI_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_FUNDING_COST_EFCI_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_FUNDING_COST_EFCI_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_FUNDING_COST_EFCI_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreFundingEfciLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_FUNDING_COST_EFCI_LOG_REQUEST });
            const res = await Service.restoreFundingEfciLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_FUNDING_COST_EFCI_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_FUNDING_COST_EFCI_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_FUNDING_COST_EFCI_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_FUNDING_COST_EFCI_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getTotalFundingCostLog = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TOTAL_FUNDING_COST_EFCI_LOG_REQUEST });
            const res = await Service.getTotalFundingCostLog(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_TOTAL__FUNDING_COST_EFCI_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_TOTAL_FUNDING_COST_EFCI_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_TOTAL_FUNDING_COST_EFCI_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_TOTAL_FUNDING_COST_EFCI_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreTotalFundingCost = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_TOTAL_FUNDING_COST_EFCI_LOG_REQUEST });
            const res = await Service.restoreTotalFundingCost(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_TOTAL_FUNDING_COST_EFCI_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_TOTAL_FUNDING_COST_EFCI_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_TOTAL_FUNDING_COST_EFCI_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_TOTAL_FUNDING_COST_EFCI_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAnnualFundingOptionLog = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ANNUAL_FUNDING_COST_EFCI_LOG_REQUEST });
            const res = await Service.getAnnualFundingOptionLog(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ANNUAL_FUNDING_COST_EFCI_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ANNUAL_FUNDING_COST_EFCI_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ANNUAL_FUNDING_COST_EFCI_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ANNUAL_FUNDING_COST_EFCI_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreAnnualFundingCost = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_ANNUAL_FUNDING_COST_EFCI_LOG_REQUEST });
            const res = await Service.restoreAnnualFundingCost(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_ANNUAL_FUNDING_COST_EFCI_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_ANNUAL_FUNDING_COST_EFCI_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_ANNUAL_FUNDING_COST_EFCI_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_ANNUAL_FUNDING_COST_EFCI_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAnnualEFCILog = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ANNUAL_EFCI_LOG_REQUEST });
            const res = await Service.getAnnualEFCILog(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ANNUAL_EFCI_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ANNUAL_EFCI_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ANNUAL_EFCI_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ANNUAL_EFCI_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreAnnualEFCILog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_ANNUAL_EFCI_LOG_REQUEST });
            const res = await Service.restoreAnnualEFCILog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORET_ANNUAL_EFCI_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_ANNUAL_EFCI_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_ANNUAL_EFCI_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_ANNUAL_EFCI_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getChartExportBuilding = (chartParams, params) => {
    return async dispatch => {
        try {
            const response = await Service.getChartExportBuilding(chartParams, params);
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

const getSitesBasedOnRegionDropdown = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SITES_BASED_ON_REGION_REQUEST });
            const res = await Service.getSitesBasedOnRegionDropdown(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_SITES_BASED_ON_REGION_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SITES_BASED_ON_REGION_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SITES_BASED_ON_REGION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SITES_BASED_ON_REGION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};


export default {
    getAllBuildings,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    getRegionsBasedOnClient,
    getProjectsBasedOnClient,
    getAllBuldingConsultancyUsers,
    BuildinggetAllClients,
    getBuildingById,
    getDepartmentByProject,
    getSitesBasedOnRegion,
    getAllCountries,
    getBuildingsBasedOnSite,
    uploadBuildingImage,
    getAllBuildingImages,
    deleteBuildingImage,
    updateBuildingImageComment,
    updateBuildingEntityParams,
    getEfciBasedOnProject,
    updateCapitalSpendingPercentage,
    updateAnnualFundingOption,
    updateFundingCost,
    updateFci,
    updateFundingEfci,
    getListForCommonFilterbuilding,
    hideFundingOption,
    getBuildingTypesBasedOnClient,
    updateBuildingLock,
    hideFundingOptionBuildingSite,
    getChartsBuilding,
    saveDataEfciChartBuilding,
    loadChartDataBuilding,
    getChartEfciBuilding,
    dashboardBuildingLock,
    exportBuildings,
    exportBuildingsBySite,
    exportBuildingsUnderSite,
    getAllBuildingLogs,
    restoreBuildingLog,
    deleteBuildingLog,
    getCSPLog,
    restoreCSPLog,
    getFundingCostLog,
    restoreFundingCost,
    getFundingEfciLog,
    restoreFundingEfciLog,
    getTotalFundingCostLog,
    restoreTotalFundingCost,
    getAnnualFundingOptionLog,
    restoreAnnualFundingCost,
    getAnnualEFCILog,
    restoreAnnualEFCILog,
    getChartExportBuilding,
    getAllClientUsers,
    getAllConsultanciesDropdown,
    getSitesBasedOnRegionDropdown
};
