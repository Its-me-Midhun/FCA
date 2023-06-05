import * as actionTypes from "./constants";
import * as Service from "./services";

const getBuildingMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_MENU_REQUEST });
            const res = await Service.getBuildingMenu(params);
            if (res && res.status === 200) {
                const buildingData = res.data;
                if (buildingData.success) {
                    dispatch({
                        type: actionTypes.GET_BUILDING_MENU_SUCCESS,
                        response: buildingData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_BUILDING_MENU_FAILURE,
                        error: buildingData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_BUILDING_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_BUILDING_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getTradeMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TRADE_MENU_REQUEST });
            const res = await Service.getTradeMenu(params);
            if (res && res.status === 200) {
                const tradeData = res.data;
                if (tradeData.success) {
                    dispatch({
                        type: actionTypes.GET_TRADE_MENU_SUCCESS,
                        response: tradeData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_TRADE_MENU_FAILURE,
                        error: tradeData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_TRADE_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_TRADE_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSystemMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SYSTEM_MENU_REQUEST });
            const res = await Service.getSystemMenu(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_SYSTEM_MENU_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SYSTEM_MENU_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SYSTEM_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SYSTEM_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getBuildingReportPrargraphsMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_REPORT_PRARGRAPHS_MENU_REQUEST });
            const res = await Service.getBuildingReportPrargraphsMenu(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_BUILDING_REPORT_PRARGRAPHS_MENU_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_BUILDING_REPORT_PRARGRAPHS_MENU_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_BUILDING_REPORT_PRARGRAPHS_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_BUILDING_REPORT_PRARGRAPHS_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getBuildingChildPrargraphsMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_CHILD_PRARGRAPHS_MENU_REQUEST });
            const res = await Service.getBuildingChildPrargraphsMenu(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_BUILDING_CHILD_PRARGRAPHS_MENU_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_BUILDING_CHILD_PRARGRAPHS_MENU_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_BUILDING_CHILD_PRARGRAPHS_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_BUILDING_CHILD_PRARGRAPHS_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSiteReportPrargraphsMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SITE_REPORT_PRARGRAPHS_MENU_REQUEST });
            const res = await Service.getSiteReportPrargraphsMenu(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_SITE_REPORT_PRARGRAPHS_MENU_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SITE_REPORT_PRARGRAPHS_MENU_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SITE_REPORT_PRARGRAPHS_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SITE_REPORT_PRARGRAPHS_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSiteChildPrargraphsMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SITE_CHILD_PRARGRAPHS_MENU_REQUEST });
            const res = await Service.getSiteChildPrargraphsMenu(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_SITE_CHILD_PRARGRAPHS_MENU_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SITE_CHILD_PRARGRAPHS_MENU_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SITE_CHILD_PRARGRAPHS_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SITE_CHILD_PRARGRAPHS_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getRegionReportPrargraphsMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REGION_REPORT_PRARGRAPHS_MENU_REQUEST });
            const res = await Service.getRegionReportPrargraphsMenu(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_REGION_REPORT_PRARGRAPHS_MENU_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_REGION_REPORT_PRARGRAPHS_MENU_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_REGION_REPORT_PRARGRAPHS_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REGION_REPORT_PRARGRAPHS_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getRegionChildPrargraphsMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REGION_CHILD_PRARGRAPHS_MENU_REQUEST });
            const res = await Service.getRegionChildPrargraphsMenu(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_REGION_CHILD_PRARGRAPHS_MENU_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_REGION_CHILD_PRARGRAPHS_MENU_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_REGION_CHILD_PRARGRAPHS_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REGION_CHILD_PRARGRAPHS_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getProjectReportPrargraphsMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PROJECT_REPORT_PRARGRAPHS_MENU_REQUEST });
            const res = await Service.getProjectReportPrargraphsMenu(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_PROJECT_REPORT_PRARGRAPHS_MENU_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_PROJECT_REPORT_PRARGRAPHS_MENU_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_PROJECT_REPORT_PRARGRAPHS_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_PROJECT_REPORT_PRARGRAPHS_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getProjectChildPrargraphsMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PROJECT_CHILD_PRARGRAPHS_MENU_REQUEST });
            const res = await Service.getProjectChildPrargraphsMenu(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_PROJECT_CHILD_PRARGRAPHS_MENU_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_PROJECT_CHILD_PRARGRAPHS_MENU_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_PROJECT_CHILD_PRARGRAPHS_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_PROJECT_CHILD_PRARGRAPHS_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSubsystemMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SUB_SYSTEM_MENU_REQUEST });
            const res = await Service.getSubsystemMenu(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_SUB_SYSTEM_MENU_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SUB_SYSTEM_MENU_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SUB_SYSTEM_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SUB_SYSTEM_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSiteMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SITE_MENU_REQUEST });
            const res = await Service.getSiteMenu(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_SITE_MENU_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SITE_MENU_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SITE_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SITE_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getRegionMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REGION_MENU_REQUEST });
            const res = await Service.getRegionMenu(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_REGION_MENU_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_REGION_MENU_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_REGION_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REGION_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getProjectMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PROJECT_MENU_REQUEST });
            const res = await Service.getProjectMenu(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_PROJECT_MENU_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_PROJECT_MENU_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_PROJECT_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_PROJECT_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSiteBuildings = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SITE_BUILDING_MENU_REQUEST });
            const res = await Service.getSiteBuildings(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_SITE_BUILDING_MENU_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SITE_BUILDING_MENU_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SITE_BUILDING_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SITE_BUILDING_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getProjectsMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PROJECTS_MENU_REQUEST });
            const res = await Service.getProjectsMenu(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_PROJECTS_MENU_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_PROJECTS_MENU_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_PROJECTS_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_PROJECTS_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getRegionsMenu = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REGIONS_MENU_REQUEST });
            const res = await Service.getRegionsMenu(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_REGIONS_MENU_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_REGIONS_MENU_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_REGIONS_MENU_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REGIONS_MENU_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getNarrativeChart = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_NARRATIVE_CHART_REQUEST });
            const res = await Service.getNarrativeChart(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_NARRATIVE_CHART_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_NARRATIVE_CHART_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_NARRATIVE_CHART_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_NARRATIVE_CHART_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getChartDetails = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CHART_DETAILS_REQUEST });
            const res = await Service.getChartDetails(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_CHART_DETAILS_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_CHART_DETAILS_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CHART_DETAILS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CHART_DETAILS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllImages = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_IMAGES_REQUEST });
            const res = await Service.getAllImages(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_IMAGES_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_IMAGES_FAILURE,
                        error: responseData
                    });
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

const uploadImage = imageData => {
    let narrative_image = new FormData();
    narrative_image.append("image", imageData.file);
    narrative_image.append("description", imageData.comments);
    narrative_image.append("project_id", imageData.project_id);
    narrative_image.append("building_id", imageData.building_id);
    narrative_image.append("narratable_type", imageData.narratable_type);
    narrative_image.append("narratable_id", imageData.narratable_id);
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPLOAD_IMAGE_REQUEST });
            const res = await Service.uploadImage(narrative_image);
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
const deleteImage = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_IMAGES_REQUEST });
            const res = await Service.deleteImage(params);
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

const updateImageComment = imageData => {
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

const updateRecomImage = imageData => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_RECOM_IMAGE_REQUEST });
            const res = await Service.updateRecomImage(imageData);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_RECOM_IMAGE_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({ type: actionTypes.UPDATE_RECOM_IMAGE_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_RECOM_IMAGE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_RECOM_IMAGE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addNarrative = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_NARRATIVE_REQUEST });
            const res = await Service.addNarrative(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.ADD_NARRATIVE_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.ADD_NARRATIVE_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_NARRATIVE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_NARRATIVE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getNarrative = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_NARRATIVE_REQUEST });
            const res = await Service.getNarrative(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_NARRATIVE_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_NARRATIVE_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_NARRATIVE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_NARRATIVE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getNarrativeRecommendations = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_NARRATIVE_RECOMMENDATION_REQUEST });
            const res = await Service.getNarrativeRecommendations(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_NARRATIVE_RECOMMENDATION_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_NARRATIVE_RECOMMENDATION_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_NARRATIVE_RECOMMENDATION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_NARRATIVE_RECOMMENDATION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getRecommendationById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_RECOMMENDATION_BY_ID_REQUEST });
            const res = await Service.getRecommendationById(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_RECOMMENDATION_BY_ID_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_RECOMMENDATION_BY_ID_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_RECOMMENDATION_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_RECOMMENDATION_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getNarrativeRecommendationsImage = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_RECOMMENDATION_IMAGES_REQUEST });
            const res = await Service.getNarrativeRecommendationsImage(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_RECOMMENDATION_IMAGES_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_RECOMMENDATION_IMAGES_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_RECOMMENDATION_IMAGES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_RECOMMENDATION_IMAGES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllRecommendationNotes = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_RECOMMENDATION_NOTES_REQUEST });
            const res = await Service.getAllRecommendationNotes(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_RECOMMENDATION_NOTES_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_RECOMMENDATION_NOTES_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_RECOMMENDATION_NOTES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_RECOMMENDATION_NOTES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateNarrativeRecommendationEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_NARRATIVE_RECOMMENDATION_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_NARRATIVE_RECOMMENDATION_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};
const getListForCommonFilterNarrativeRecommendation = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterNarrativeRecommendation(params);
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

const exportRecommendations = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_RECOMMENDATION_EXPORT_REQUEST });
            const response = await Service.exportRecommendations(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_RECOMMENDATION_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_RECOMMENDATION_EXPORT_SUCCESS, response: {} });
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

const exportReport = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REPORT_EXPORT_REQUEST });
            const res = await Service.exportReport(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.Result === "Success") {
                    dispatch({
                        type: actionTypes.GET_REPORT_EXPORT_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_REPORT_EXPORT_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_REPORT_EXPORT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REPORT_EXPORT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addInsert = insertData => {
    let narrative_insert = new FormData();
    narrative_insert.append("image", insertData.image);
    narrative_insert.append("description", insertData.description);
    narrative_insert.append("html_format", insertData.html_format);
    narrative_insert.append("project_id", insertData.project_id);
    narrative_insert.append("building_id", insertData.building_id);
    narrative_insert.append("narratable_type", insertData.narratable_type);
    narrative_insert.append("narratable_id", insertData.narratable_id);
    narrative_insert.append("double_header", insertData.double_header);
    narrative_insert.append("footer", insertData.footer);
    narrative_insert.append("text_format", insertData.text_format);
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_INSERT_REQUEST });
            const res = await Service.uploadInsert(narrative_insert);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.ADD_INSERT_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.ADD_INSERT_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_INSERT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_INSERT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getInserts = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_INSERT_REQUEST });
            const res = await Service.getInserts(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_INSERT_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_INSERT_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_INSERT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_INSERT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const deleteInsert = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_INSERT_REQUEST });
            const res = await Service.deleteInsert(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.DELETE_INSERT_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.DELETE_INSERT_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_INSERT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_INSERT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const updateInsert = insertData => {
    let narrative_insert = new FormData();
    narrative_insert.append("image", insertData.image);
    narrative_insert.append("description", insertData.description);
    narrative_insert.append("html_format", insertData.html_format);
    narrative_insert.append("double_header", insertData.double_header);
    narrative_insert.append("footer", insertData.footer);
    narrative_insert.append("text_format", insertData.text_format);
    narrative_insert.append("narratable_type", insertData.narratable_type);
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_INSERT_REQUEST });
            const res = await Service.updateInsert(insertData.id, narrative_insert);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_INSERT_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_INSERT_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_INSERT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_INSERT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
// calling python api
const markAsCompletePython = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.MARK_AS_COMPLETE_PYTHON_REQUEST });
            const res = await Service.markAsCompletePython(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.Result === "Success") {
                    dispatch({
                        type: actionTypes.MARK_AS_COMPLETE_PYTHON_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.MARK_AS_COMPLETE_PYTHON_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.MARK_AS_COMPLETE_PYTHON_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.MARK_AS_COMPLETE_PYTHON_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const markAsCompleteRuby = params => {
    let rubyParams = {
        id: params.id,
        narratable_type: params.narratable_type,
        export_type: params.export_type === "local_complete" ? "local" : "global"
    };
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.MARK_AS_COMPLETE_RUBY_REQUEST });
            const resRuby = await Service.markAsCompleteRuby(rubyParams);
            if (resRuby && resRuby.status === 200) {
                const responseRubyData = resRuby.data;
                if (responseRubyData.success) {
                    dispatch({
                        type: actionTypes.MARK_AS_COMPLETE_RUBY_SUCCESS,
                        response: responseRubyData
                    });
                } else {
                    dispatch({
                        type: actionTypes.MARK_AS_COMPLETE_RUBY_FAILURE,
                        error: responseRubyData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.MARK_AS_COMPLETE_RUBY_FAILURE,
                    error: resRuby.response && resRuby.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.MARK_AS_COMPLETE_RUBY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSelectedRecomImages = (id,paginationparams) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SELECTED_RECOM_IMAGES_REQUEST });
            const res = await Service.getSelectedRecomImages(id,paginationparams);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.Result === "Success") {
                    dispatch({
                        type: actionTypes.GET_SELECTED_RECOM_IMAGES_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SELECTED_RECOM_IMAGES_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SELECTED_RECOM_IMAGES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SELECTED_RECOM_IMAGES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const deleteNarrative = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_NARRATIVE_REQUEST });
            const res = await Service.deleteNarrative(param);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.Result === "Success") {
                    dispatch({
                        type: actionTypes.DELETE_NARRATIVE_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.DELETE_NARRATIVE_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_NARRATIVE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_NARRATIVE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getPdfReport = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.PDF_REPORT_REQUEST });
            const res = await Service.getPdfReport(id);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.PDF_REPORT_SUCCESS,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.PDF_REPORT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.PDF_REPORT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getExportHistory = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_EXPORT_HISTORY_REQUEST });
            const res = await Service.getExportHistory(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.GET_EXPORT_HISTORY_SUCCESS,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_EXPORT_HISTORY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_EXPORT_HISTORY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getAllLogs = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LOGS_REQUEST });
            const res = await Service.getAllLogs(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.GET_LOGS_SUCCESS,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_LOGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_LOGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const updateLog = data => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_LOG_REQUEST });
            const res = await Service.updateLog(data);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.UPDATE_LOG_SUCCESS,
                    response: responseData
                });
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
const updateExportHistory = data => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_EXPORT_HISTORY_REQUEST });
            const res = await Service.updateExportHistory(data);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.UPDATE_EXPORT_HISTORY_SUCCESS,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.UPDATE_EXPORT_HISTORY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_EXPORT_HISTORY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getNarrativeTemplates = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_NARRATIVE_TEMPLATES_REQUEST });
            const res = await Service.getNarrativeTemplates(params, dynamicUrl);
            if (res && res.status === 200) {
                const narrativeTemplateData = res.data;
                if (narrativeTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_NARRATIVE_TEMPLATES_SUCCESS,
                        response: narrativeTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_NARRATIVE_TEMPLATES_FAILURE,
                        error: narrativeTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_NARRATIVE_TEMPLATES_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_NARRATIVE_TEMPLATES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const autoPopulateTableTemplates = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.AUTO_POPULATE_TABLE_TEMPLATES_REQUEST });
            const res = await Service.autoPopulateTableTemplates(params, dynamicUrl);
            if (res && res.status === 200) {
                const narrativeTemplateData = res.data;
                if (narrativeTemplateData.success) {
                    dispatch({
                        type: actionTypes.AUTO_POPULATE_TABLE_TEMPLATES_SUCCESS,
                        response: narrativeTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.AUTO_POPULATE_TABLE_TEMPLATES_FAILURE,
                        error: narrativeTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.AUTO_POPULATE_TABLE_TEMPLATES_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.AUTO_POPULATE_TABLE_TEMPLATES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addUserActivityLog = text => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_USER_ACTIVITY_LOG_REQUEST });
            const res = await Service.addUserActivityLog(text);
            if (res && (res.status === 200 || res.status === 201)) {
                const resData = res.data;
                dispatch({ type: actionTypes.ADD_USER_ACTIVITY_LOG_SUCCESS, response: resData });
            } else {
                dispatch({
                    type: actionTypes.ADD_USER_ACTIVITY_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_USER_ACTIVITY_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const assignImagesFromMaster = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_IMAGES_FROM_MASTER_REQUEST });
            const res = await Service.assignImagesFromMaster(params);
            if (res && res.status === 200) {
                const narrativeTemplateData = res.data;
                if (narrativeTemplateData.success) {
                    dispatch({
                        type: actionTypes.ASSIGN_IMAGES_FROM_MASTER_SUCCESS,
                        response: narrativeTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.ASSIGN_IMAGES_FROM_MASTER_FAILURE,
                        error: narrativeTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.ASSIGN_IMAGES_FROM_MASTER_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ASSIGN_IMAGES_FROM_MASTER_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
export default {
    getTradeMenu,
    getBuildingMenu,
    getSystemMenu,
    getBuildingReportPrargraphsMenu,
    getBuildingChildPrargraphsMenu,
    getSiteReportPrargraphsMenu,
    getSiteChildPrargraphsMenu,
    getRegionReportPrargraphsMenu,
    getRegionChildPrargraphsMenu,
    getProjectReportPrargraphsMenu,
    getProjectChildPrargraphsMenu,
    getSubsystemMenu,
    getSiteMenu,
    getSiteBuildings,
    getAllImages,
    getNarrativeChart,
    getChartDetails,
    uploadImage,
    updateImageComment,
    deleteImage,
    addNarrative,
    getNarrative,
    getNarrativeRecommendations,
    getNarrativeRecommendationsImage,
    updateNarrativeRecommendationEntityParams,
    getListForCommonFilterNarrativeRecommendation,
    exportRecommendations,
    exportReport,
    addInsert,
    getInserts,
    deleteInsert,
    updateInsert,
    getRecommendationById,
    updateRecomImage,
    markAsCompletePython,
    markAsCompleteRuby,
    getSelectedRecomImages,
    deleteNarrative,
    getPdfReport,
    getExportHistory,
    getAllLogs,
    updateLog,
    updateExportHistory,
    getNarrativeTemplates,
    getAllRecommendationNotes,
    autoPopulateTableTemplates,
    addUserActivityLog,
    assignImagesFromMaster,
    getRegionMenu,
    getProjectMenu,
    getProjectsMenu,
    getRegionsMenu
};
