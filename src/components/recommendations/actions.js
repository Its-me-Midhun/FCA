import { fileReader } from "../../config/utils";
import * as actionTypes from "./constants";
import * as Service from "./services";

const getAllRecommendations = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_RECOMMENDATIONS_REQUEST });
            const res = await Service.getAllRecommendations(params, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_RECOMMENDATIONS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_RECOMMENDATIONS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_RECOMMENDATIONS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_RECOMMENDATIONS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addRecommendation = params => {
    let rec_data = new FormData();
    rec_data.append("image", params.image);
    rec_data.append("img_desc", params.img_desc);
    rec_data.append("recommendation", JSON.stringify(params));

    const rData = {
        rec_data,
        recommendation: params
    };
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_RECOMMENDATION_REQUEST });
            const res = await Service.addRecommendation(rec_data);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.ADD_RECOMMENDATION_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({ type: actionTypes.ADD_RECOMMENDATION_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_RECOMMENDATION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_RECOMMENDATION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateRecommendation = (params, id, selectedImage) => {
    let rec_data = new FormData();
    if (selectedImage && params.image && selectedImage?.name !== params?.image?.name) {
        rec_data.append("image", params.image);
    } else if (!params.image_id && params.image) {
        rec_data.append("image", params.image);
    }
    if (params.img_desc) {
        rec_data.append("img_desc", params.img_desc);
    }
    rec_data.append("recommendation", JSON.stringify(params));

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_RECOMMENDATION_REQUEST });
            const res = await Service.updateRecommendation(rec_data, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_RECOMMENDATION_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_RECOMMENDATION_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_RECOMMENDATION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_RECOMMENDATION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteRecommendation = (id, param) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_RECOMMENDATION_REQUEST });
            const res = await Service.deleteRecommendation(id, param);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.DELETE_RECOMMENDATION_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.DELETE_RECOMMENDATION_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_RECOMMENDATION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_RECOMMENDATION_FAILURE,
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
const getFloorBasedOnBuilding = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FLOOR_BASED_ON_BUILDING_REQUEST });
            const res = await Service.getFloorBasedOnBuilding(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_FLOOR_BASED_ON_BUILDING_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_FLOOR_BASED_ON_BUILDING_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_FLOOR_BASED_ON_BUILDING_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_FLOOR_BASED_ON_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getAdditionBasedOnBuilding = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ADDITION_BASED_ON_BUILDING_REQUEST });
            const res = await Service.getAdditionBasedOnBuilding(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ADDITION_BASED_ON_BUILDING_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ADDITION_BASED_ON_BUILDING_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ADDITION_BASED_ON_BUILDING_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ADDITION_BASED_ON_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getCategoryBasedOnProject = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CATEGORY_BASED_ON_PROJECT_REQUEST });
            const res = await Service.getCategoryBasedOnProject(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_CATEGORY_BASED_ON_PROJECT_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_CATEGORY_BASED_ON_PROJECT_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CATEGORY_BASED_ON_PROJECT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CATEGORY_BASED_ON_PROJECT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getCapitalTypeBasedOnProject = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CAPITAL_TYPE_BASED_ON_PROJECT_REQUEST });
            const res = await Service.getCapitalTypeBasedOnProject(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_CAPITAL_TYPE_BASED_ON_PROJECT_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_CAPITAL_TYPE_BASED_ON_PROJECT_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CAPITAL_TYPE_BASED_ON_PROJECT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CAPITAL_TYPE_BASED_ON_PROJECT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSystemBasedOnProject = (id, tradeId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SYSTEM_BASED_ON_PROJECT_REQUEST });
            const res = await Service.getSystemBasedOnProject(id, tradeId);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_SYSTEM_BASED_ON_PROJECT_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SYSTEM_BASED_ON_PROJECT_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SYSTEM_BASED_ON_PROJECT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SYSTEM_BASED_ON_PROJECT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getSubSystemBasedOnProject = (id, systemId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SUBSYSTEM_BASED_ON_PROJECT_REQUEST });
            const res = await Service.getSubSystemBasedOnProject(id, systemId);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_SUBSYSTEM_BASED_ON_PROJECT_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_SUBSYSTEM_BASED_ON_PROJECT_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SUBSYSTEM_BASED_ON_PROJECT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SUBSYSTEM_BASED_ON_PROJECT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getTradeBasedOnProject = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TRADE_BASED_ON_PROJECT_REQUEST });
            const res = await Service.getTradeBasedOnProject(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_TRADE_BASED_ON_PROJECT_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_TRADE_BASED_ON_PROJECT_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_TRADE_BASED_ON_PROJECT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_TRADE_BASED_ON_PROJECT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getBuildingsBasedOnSite = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REGIONS_BASED_ON_CLIENT_REQUEST });
            const res = await Service.getBuildingsBasedOnSite(id);
            // if (res && res.status === 200) {
            //     const regionData = res.data;
            //     if (regionData.success) {
            //         dispatch({
            //             type: actionTypes.GET_REGIONS_BASED_ON_CLIENT_SUCCESS,
            //             response: regionData
            //         });
            //     } else {
            //         dispatch({
            //             type: actionTypes.GET_REGIONS_BASED_ON_CLIENT_FAILURE,
            //             error: regionData
            //         });
            //     }
            // } else {
            //     dispatch({
            //         type: actionTypes.GET_REGIONS_BASED_ON_CLIENT_FAILURE,
            //         error: res.response && res.response.data
            //     });
            // }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REGIONS_BASED_ON_CLIENT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllConsultancyUsers = () => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_USERS_REQUEST });
            const res = await Service.getAllConsultancyUsers();
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

const getAllClientsRecomentation = () => {
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

const uploadRecommendationImage = (imageData, id) => {
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

const getAllRecommendationImages = (id, params) => {
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

const deleteRecommendationImage = id => {
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

const updateRecommendationImageComment = imageData => {
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

const updateRecommendationEntityParams = (entityParams, section) => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_RECOMMENDATION_ENTITY_PARAMS_SUCCESS,
                    response: entityParams,
                    section
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_RECOMMENDATION_ENTITY_PARAMS_FAILURE,
                error: entityParams,
                section
            });
        }
    };
};

const getListForCommonFilterrecommendation = params => {
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

const getCostYearByProject = (projectId, siteId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_COST_PER_YEAR_BY_PROJECT_REQUEST });
            const res = await Service.getCostYearByProject(projectId, siteId);

            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_COST_PER_YEAR_BY_PROJECT_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_COST_PER_YEAR_BY_PROJECT_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_COST_PER_YEAR_BY_PROJECT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_COST_PER_YEAR_BY_PROJECT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllRecommendationsRegion = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_RECOMMENDATIONS_REQUEST });
            const res = await Service.getAllRecommendationsRegion(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_RECOMMENDATIONS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_RECOMMENDATIONS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_RECOMMENDATIONS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_RECOMMENDATIONS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getFundingSourceByProject = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FUNDING_SOURCE_BASED_ON_PROJECT_REQUEST });
            const res = await Service.getFundingSourceByProject(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_FUNDING_SOURCE_BASED_ON_PROJECT_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_FUNDING_SOURCE_BASED_ON_PROJECT_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_FUNDING_SOURCE_BASED_ON_PROJECT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_FUNDING_SOURCE_BASED_ON_PROJECT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateMaintenanceYearCutPaste = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_MAINTENANCE_YEARS_CUT_PASTE_REQUEST });
            const res = await Service.updateMaintenanceYearCutPaste(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_MAINTENANCE_YEARS_CUT_PASTE_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_MAINTENANCE_YEARS_CUT_PASTE_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_MAINTENANCE_YEARS_CUT_PASTE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_MAINTENANCE_YEARS_CUT_PASTE_FAILURE,
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

const exportAllTrades = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_ALL_TRADES_REQUEST });
            const response = await Service.exportAllTrades(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_ALL_TRADES_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.EXPORT_ALL_TRADES_SUCCESS, response: {} });
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

const exportRecommendationByRegion = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_RECOMMENDATION_EXPORT_REQUEST });
            const response = await Service.exportRecommendationByRegion(params);
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

const exportRecommendationBySite = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_RECOMMENDATION_EXPORT_REQUEST });
            const response = await Service.exportRecommendationBySite(params);
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

const exportRecommendationByBuilding = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_RECOMMENDATION_EXPORT_REQUEST });
            const response = await Service.exportRecommendationByBuilding(params);
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

const getRestoreRecommendation = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RECOVER_RECOMMENDATION_REQUEST });
            const res = await Service.recoverRecommendation(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.RECOVER_RECOMMENDATION_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.RECOVER_RECOMMENDATION_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.RECOVER_RECOMMENDATION_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RECOVER_RECOMMENDATION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getConditionBasedOnProject = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSET_CONDITION_BASED_ON_PROJECT_REQUEST });
            const res = await Service.getConditionBasedOnProject(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ASSET_CONDITION_BASED_ON_PROJECT_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ASSET_CONDITION_BASED_ON_PROJECT_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ASSET_CONDITION_BASED_ON_PROJECT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ASSET_CONDITION_BASED_ON_PROJECT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getAllRecommendationLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_RECOMMENDATION_LOG_REQUEST });
            const res = await Service.getAllRecommendationLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_RECOMMENDATION_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_RECOMMENDATION_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_RECOMMENDATION_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_RECOMMENDATION_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreRecommendationLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_RECOMMENDATION_LOG_REQUEST });
            const res = await Service.restoreRecommendationLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_RECOMMENDATION_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_RECOMMENDATION_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_RECOMMENDATION_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_RECOMMENDATION_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteRecommendationLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_RECOMMENDATION_LOG_REQUEST });
            const res = await Service.deleteRecommendationLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_RECOMMENDATION_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_RECOMMENDATION_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_RECOMMENDATION_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_RECOMMENDATION_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getInitiativeDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_INTITIATIVE_DROPDOWN_REQUEST });
            const res = await Service.getInitiativeDropdown(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_INTITIATIVE_DROPDOWN_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_INTITIATIVE_DROPDOWN_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_INTITIATIVE_DROPDOWN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_INTITIATIVE_DROPDOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const downloadPdfReport = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DOWNLOAD_PDF_REPORT_REQUEST });
            const res = await Service.downloadPdfReport(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.Result === "Success") {
                    dispatch({ type: actionTypes.DOWNLOAD_PDF_REPORT_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DOWNLOAD_PDF_REPORT_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DOWNLOAD_PDF_REPORT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DOWNLOAD_PDF_REPORT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getReportNoteTemplates = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REPORT_NOTE_TEMPLATES_REQUEST });
            const res = await Service.getReportNoteTemplates(params, dynamicUrl);
            if (res && res.status === 200) {
                const reportNoteTemplateData = res.data;
                if (reportNoteTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_REPORT_NOTE_TEMPLATES_SUCCESS,
                        response: reportNoteTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_REPORT_NOTE_TEMPLATES_FAILURE,
                        error: reportNoteTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_REPORT_NOTE_TEMPLATES_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REPORT_NOTE_TEMPLATES_FAILURE,
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
const assignImagesToRecom = (imgData, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_IMAGES_TO_RECOM_REQUEST });
            const res = await Service.assignImagesToRecom(imgData, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.ASSIGN_IMAGES_TO_RECOM_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_IMAGES_TO_RECOM_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.ASSIGN_IMAGES_TO_RECOM_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ASSIGN_IMAGES_TO_RECOM_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const unAssignImage = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UNASSIGN_IMAGE_REQUEST });
            const res = await Service.unAssignImage(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.UNASSIGN_IMAGE_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.UNASSIGN_IMAGE_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.UNASSIGN_IMAGE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UNASSIGN_IMAGE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const updateBudgetPriority = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_BUDGET_PRIORITY_REQUEST });
            const res = await Service.updateBudgetPriority(params, id);
            if (res && res.status === 200) {
                const budgetData = res.data;
                if (budgetData.success) {
                    dispatch({ type: actionTypes.UPDATE_BUDGET_PRIORITY_SUCCESS, response: budgetData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_BUDGET_PRIORITY_FAILURE, error: budgetData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_BUDGET_PRIORITY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_BUDGET_PRIORITY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllBudgetPriorityRecommendations = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_RECOMMENDATIONS_REQUEST });
            const res = await Service.getAllBudgetPriorityRecommendations(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_RECOMMENDATIONS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_RECOMMENDATIONS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_RECOMMENDATIONS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_RECOMMENDATIONS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const exportBudgetPriorityRecommendations = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_RECOMMENDATION_EXPORT_REQUEST });
            const response = await Service.exportBudgetPriorityRecommendations(params);
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

const getListForBudgetPriorityFilter = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForBudgetPriorityFilter(params);
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

const setRecommendationScrollPosition = pos => {
    return async dispatch => {
        try {
            if (pos) {
                dispatch({
                    type: actionTypes.UPDATE_RECOMMENDATION_SCROLL_POSITION_SUCCESS,
                    response: pos
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_RECOMMENDATION_SCROLL_POSITION_FAILURE,
                error: pos
            });
        }
    };
};

const getRecommendationTemplates = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_RECOMMENDATION_TEMPLATES_REQUEST });
            const res = await Service.getRecommendationTemplates(params, dynamicUrl);
            if (res && res.status === 200) {
                const recommendationTemplateData = res.data;
                if (recommendationTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_RECOMMENDATION_TEMPLATES_SUCCESS,
                        response: recommendationTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_RECOMMENDATION_TEMPLATES_FAILURE,
                        error: recommendationTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_RECOMMENDATION_TEMPLATES_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_RECOMMENDATION_TEMPLATES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getUserDefaultTrade = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_USER_DEFAULT_TRADE_REQUEST });
            const res = await Service.getUserDefaultTrade(id);
            if (res && res.status === 200) {
                const resData = res.data;
                if (resData.success) {
                    dispatch({
                        type: actionTypes.GET_USER_DEFAULT_TRADE_SUCCESS,
                        response: resData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_USER_DEFAULT_TRADE_FAILURE,
                        error: resData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_USER_DEFAULT_TRADE_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_USER_DEFAULT_TRADE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateMultipleRecommendations = (data, recomIds) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_MULTIPLE_RECOMMENDATIONS_REQUEST });
            const res = await Service.updateMultipleRecommendations(data, recomIds);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_MULTIPLE_RECOMMENDATIONS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_MULTIPLE_RECOMMENDATIONS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_MULTIPLE_RECOMMENDATIONS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_MULTIPLE_RECOMMENDATIONS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateFMP = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_FMP_REQUEST });
            const res = await Service.updateFMP(params, id);
            if (res && res.status === 200) {
                const budgetData = res.data;
                if (budgetData.success) {
                    dispatch({ type: actionTypes.UPDATE_FMP_SUCCESS, response: budgetData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_FMP_FAILURE, error: budgetData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_FMP_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_FMP_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const updateIR = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_IR_REQUEST });
            const res = await Service.updateIR(params, id);
            if (res && res.status === 200) {
                const budgetData = res.data;
                if (budgetData.success) {
                    dispatch({ type: actionTypes.UPDATE_IR_SUCCESS, response: budgetData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_IR_FAILURE, error: budgetData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_IR_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_IR_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const updateRL = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_RL_REQUEST });
            const res = await Service.updateRL(params, id);
            if (res && res.status === 200) {
                const budgetData = res.data;
                if (budgetData.success) {
                    dispatch({ type: actionTypes.UPDATE_RL_SUCCESS, response: budgetData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_RL_FAILURE, error: budgetData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_RL_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_RL_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getRecommendationCommonDataByIds = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_RECOMMENDATION_COMMON_DATA_BY_IDS_REQUEST });
            const res = await Service.getRecommendationCommonDataByIds(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_RECOMMENDATION_COMMON_DATA_BY_IDS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_RECOMMENDATION_COMMON_DATA_BY_IDS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_RECOMMENDATION_COMMON_DATA_BY_IDS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_RECOMMENDATION_COMMON_DATA_BY_IDS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getAllRecommendationIds = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_WHOLE_RECOMMENDATION_IDS_REQUEST });
            const res = await Service.getAllRecommendationIds(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_WHOLE_RECOMMENDATION_IDS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_WHOLE_RECOMMENDATION_IDS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_WHOLE_RECOMMENDATION_IDS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_WHOLE_RECOMMENDATION_IDS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getPriorityElementDropDownData = projectId => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PRIORITY_ELEMENT_DROPDOWN_DATA_REQUEST });
            const res = await Service.getPriorityElementDropDownData(projectId);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_PRIORITY_ELEMENT_DROPDOWN_DATA_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_PRIORITY_ELEMENT_DROPDOWN_DATA_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_PRIORITY_ELEMENT_DROPDOWN_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_PRIORITY_ELEMENT_DROPDOWN_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

//export pdf report
const exportReportPdf = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_REPORT_PDF_REQUEST });
            const res = await Service.exportReportPdf(params);
            if (res && res.data) {
                const { data } = res;
                const name = res.headers["content-disposition"].split("filename=");
                const fileName = name[1].split('"')[1];
                const downloadUrl = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.setAttribute("download", `${fileName}`); //any other extension
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        } catch (e) {}
    };
};
//export multiple recommendations (word file)
const exportSelectedRecomWord = params => {
    return async () => {
        try {
            const res = await Service.exportSelectedRecomWord(params);
            if (res && res.data) {
                const text = await new Response(res.data).text();
                const { data } = res;
                const name = res.headers["content-disposition"].split("filename=");
                const fileName = name[1].split('"')[1];
                const downloadUrl = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.setAttribute("download", `${fileName}`); //any other extension
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        } catch (e) {}
    };
};
//export multiple recommendations (pdf file)
const exportSelectedRecomPDF = params => {
    return async () => {
        try {
            const res = await Service.exportSelectedRecomPDF(params);
            if (res && res.data) {
                const { data } = res;
                const name = res.headers["content-disposition"].split("filename=");
                const fileName = name[1].split('"')[1];
                const downloadUrl = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.setAttribute("download", `${fileName}`); //any other extension
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        } catch (e) {}
    };
};

const getCriticalityDropDownData = projectId => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CRITICALITY_DROPDOWN_DATA_REQUEST });
            const res = await Service.getCriticalityDropDownData(projectId);
            if (res && res.status === 200) {
                const criticalityData = res.data;
                if (criticalityData.success) {
                    dispatch({ type: actionTypes.GET_CRITICALITY_DROPDOWN_DATA_SUCCESS, response: criticalityData });
                } else {
                    dispatch({ type: actionTypes.GET_CRITICALITY_DROPDOWN_DATA_FAILURE, error: criticalityData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CRITICALITY_DROPDOWN_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CRITICALITY_DROPDOWN_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getImportViewTableModal = projectId => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_IMPORT_VIEW_TABLE_REQUEST });
            const res = await Service.getImportViewTableModal(projectId);
            if (res && res.status === 200) {
                const criticalityData = res.data;
                if (criticalityData.success) {
                    dispatch({ type: actionTypes.GET_IMPORT_VIEW_TABLE_SUCCESS, response: criticalityData });
                } else {
                    dispatch({ type: actionTypes.GET_IMPORT_VIEW_TABLE_FAILURE, error: criticalityData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_IMPORT_VIEW_TABLE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_IMPORT_VIEW_TABLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const exportToWord = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_EXPORT_WORD_DATA_REQUEST });
            const res = await Service.exportToWord(params);
            if (res && res.status) {
                const wordData = res.data;
                if (res.status === 201) {
                    const { data } = res;
                    const link = document.createElement("a");
                    link.href = data.doc_url;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    dispatch({
                        type: actionTypes.GET_EXPORT_WORD_DATA_SUCCESS,
                        response: { message_status: "File Exported Successfully", message: data.message }
                    });
                } else if (res.status === 200) {
                    dispatch({
                        type: actionTypes.GET_EXPORT_WORD_DATA_SUCCESS,
                        response: { message_status: "Word Export Initiated, Please check Export History Later", message: wordData.message }
                    });
                } else {
                    dispatch({ type: actionTypes.GET_EXPORT_WORD_DATA_FAILURE, error: wordData.message });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_EXPORT_WORD_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            if (e.response.status === 406) {
                const { message } = e.response?.data || {};
                dispatch({
                    type: actionTypes.GET_EXPORT_WORD_DATA_SUCCESS,
                    response: {
                        message_status:
                            message === "file_not_exist" ? "Uploaded Template File Not Exist" : "Settings Not Found Or Template File Not Found",
                        message
                    }
                });
            } else if (e.response.status === 415) {
                dispatch({
                    type: actionTypes.GET_EXPORT_WORD_DATA_SUCCESS,
                    response: { message_status: "Unsupported Media Type", message: e.response.data?.message }
                });
            } else {
                dispatch({ type: actionTypes.GET_EXPORT_WORD_DATA_FAILURE, error: e.response && e.response.data });
            }
        }
    };
};
const exportToExcelFile = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_EXPORT_EXCEL_DATA_REQUEST });
            const res = await Service.exportToExcelFile(params);
            if (res.status === 200) {
                const { data } = res;
                const name = res.headers["content-disposition"].split("filename=");
                const fileName = name[1];
                const downloadUrl = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.setAttribute("download", `${fileName}`); //any other extension
                document.body.appendChild(link);
                link.click();
                link.remove();
                dispatch({
                    type: actionTypes.GET_EXPORT_EXCEL_DATA_SUCCESS,
                    response: { message_status: "File Exported Successfully" }
                });
            } else {
                dispatch({ type: actionTypes.GET_EXPORT_EXCEL_DATA_FAILURE, error: "Export Failed" });
            }
        } catch (e) {
            if (e.response.status === 406 || e.response.status === 404) {
                const file = await fileReader(e.response.data);
                const { message } = JSON.parse(file);
                dispatch({
                    type: actionTypes.GET_EXPORT_EXCEL_DATA_SUCCESS,
                    response: {
                        message_status:
                            message === "file_not_exist" ? "Uploaded Template File Not Exist" : "Settings Not Found Or Template File Not Found",
                        message
                    }
                });
            } else if (e.response.status === 415) {
                dispatch({
                    type: actionTypes.GET_EXPORT_EXCEL_DATA_SUCCESS,
                    response: { message_status: "Unsupported Media Type", message: e.response.data?.message }
                });
            } else {
                dispatch({ type: actionTypes.GET_EXPORT_EXCEL_DATA_FAILURE, error: e.response && e.response.data });
            }
        }
    };
};

const getCapitalTypeDropDownData = projectId => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CAPITAL_TYPE_DROPDOWN_DATA_REQUEST });
            const res = await Service.getCapitalTypeDropDownData(projectId);
            if (res && res.status === 200) {
                const capitalTypeData = res.data;
                if (capitalTypeData.success) {
                    dispatch({ type: actionTypes.GET_CAPITAL_TYPE_DROPDOWN_DATA_SUCCESS, response: capitalTypeData });
                } else {
                    dispatch({ type: actionTypes.GET_CAPITAL_TYPE_DROPDOWN_DATA_FAILURE, error: capitalTypeData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CAPITAL_TYPE_DROPDOWN_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CAPITAL_TYPE_DROPDOWN_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateNoteImportViewTableModal = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_NOTE_REQUEST });
            const res = await Service.updateNoteImportViewTableModal(params, id);
            if (res && res.status === 200) {
                const export_note = res.data;
                if (export_note.success) {
                    dispatch({ type: actionTypes.UPDATE_NOTE_SUCCESS, response: export_note });
                } else {
                    dispatch({ type: actionTypes.UPDATE_NOTE_FAILURE, error: export_note });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_NOTE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_NOTE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

// const exportToExcel= params => {
//     return async () => {
//         try {
//             const res = await Service.getExportExcelFromExport(params);
//             if (res && res.data) {
//                 const text = await new Response(res.data).text();
//                 const { data } = res;
//                 const name = res.headers["content-disposition"].split("filename=");
//                 const fileName = name[1].split('"')[1];
//                 const downloadUrl = window.URL.createObjectURL(new Blob([data]));
//                 const link = document.createElement("a");
//                 link.href = downloadUrl;
//                 link.setAttribute("download", `${fileName}`); //any other extension
//                 document.body.appendChild(link);
//                 link.click();
//                 link.remove();
//                 // const { data } = res;
//                 // const link = document.createElement("a");
//                 // link.href = data.doc_url;
//                 // document.body.appendChild(link);
//                 // link.click();
//                 // link.remove();
//             }
//         } catch (e) {}
//     };
// };

const exportToExcel = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_EXCEL_HISTORY_REQUEST });
            const response = await Service.getExportExcelFromExport(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_EXCEL_HISTORY_FAILURE, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.EXPORT_EXCEL_HISTORY_SUCCESS, response: {} });
                }
            }
            const { data } = response;
            const name = response.headers["content-disposition"].split("filename=");
            const fileName = name[1];
            let blob = new Blob([data]);
            let url = window.URL || window.webkitURL;
            let downloadUrl = url.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", `${fileName}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            dispatch({
                type: actionTypes.EXPORT_EXCEL_HISTORY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getExportRecom = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_EXPORT_ITEMS_REQUEST });
            const res = await Service.getExportRecom(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_EXPORT_ITEMS_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_EXPORT_ITEMS_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_EXPORT_ITEMS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_EXPORT_ITEMS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const postExportRecom = params => {
    return async dispatch => {
        let exportData = new FormData();
        params.file && exportData.append("file", params.file);
        exportData.append("project_id", params.project_id);
        exportData.append("properties", JSON.stringify(params.properties));
        exportData.append("recom_property", params.recom_property);
        try {
            dispatch({ type: actionTypes.ADD_EXPORT_ITEMS_REQUEST });

            const res = await Service.postExportRecom(exportData);
            if (res && res.status === 200) {
                const regionData = res.data;
                const text = await new Response(res.data).text();
                if (text.status) {
                    dispatch({
                        type: actionTypes.ADD_EXPORT_ITEMS_SUCCESS,
                        response: JSON.parse(text)
                    });
                } else {
                    dispatch({ type: actionTypes.ADD_EXPORT_ITEMS_FAILURE, error: JSON.parse(text) });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_EXPORT_ITEMS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_EXPORT_ITEMS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getExportPropertyDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_EXPORT_PROPERTY_DROPDOWN_REQUEST });
            const res = await Service.getExportPropertyDropdown(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                dispatch({ type: actionTypes.GET_EXPORT_PROPERTY_DROPDOWN_SUCCESS, response: regionData });
            } else {
                dispatch({
                    type: actionTypes.GET_EXPORT_PROPERTY_DROPDOWN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_EXPORT_PROPERTY_DROPDOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getAllRecommendations,
    addRecommendation,
    updateRecommendation,
    deleteRecommendation,
    getRegionsBasedOnClient,
    getBuildingsBasedOnSite,
    getAllConsultancyUsers,
    getAllClientsRecomentation,
    getRecommendationById,
    uploadRecommendationImage,
    getAllRecommendationImages,
    getCategoryBasedOnProject,
    deleteRecommendationImage,
    getSystemBasedOnProject,
    getFloorBasedOnBuilding,
    getSubSystemBasedOnProject,
    getTradeBasedOnProject,
    updateRecommendationImageComment,
    updateRecommendationEntityParams,
    getListForCommonFilterrecommendation,
    getCostYearByProject,
    getAllRecommendationsRegion,
    getFundingSourceByProject,
    updateMaintenanceYearCutPaste,
    exportRecommendations,
    exportRecommendationByRegion,
    exportRecommendationBySite,
    exportRecommendationByBuilding,
    getRestoreRecommendation,
    getConditionBasedOnProject,
    getAllRecommendationLogs,
    restoreRecommendationLog,
    deleteRecommendationLog,
    getInitiativeDropdown,
    getReportNoteTemplates,
    downloadPdfReport,
    addUserActivityLog,
    getAdditionBasedOnBuilding,
    assignImagesToRecom,
    exportAllTrades,
    unAssignImage,
    updateBudgetPriority,
    getAllBudgetPriorityRecommendations,
    exportBudgetPriorityRecommendations,
    getListForBudgetPriorityFilter,
    setRecommendationScrollPosition,
    getRecommendationTemplates,
    getUserDefaultTrade,
    updateMultipleRecommendations,
    updateFMP,
    getRecommendationCommonDataByIds,
    getAllRecommendationIds,
    getPriorityElementDropDownData,
    updateIR,
    exportReportPdf,
    updateRL,
    getCapitalTypeBasedOnProject,
    exportSelectedRecomWord,
    exportSelectedRecomPDF,
    getCriticalityDropDownData,
    exportToWord,
    getCapitalTypeDropDownData,
    getImportViewTableModal,
    updateNoteImportViewTableModal,
    exportToExcel,
    exportToExcelFile,
    getExportRecom,
    postExportRecom,
    getExportPropertyDropdown
};
