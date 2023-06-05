import * as actionTypes from "./constants";
import * as Service from "./services";

const getAllBuildingTypes = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_BUILDING_TYPES_REQUEST });
            const res = await Service.getAllBuildingTypes(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_BUILDING_TYPES_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_BUILDING_TYPES_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_BUILDING_TYPES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_BUILDING_TYPES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addBuildingType = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_BUILDING_TYPE_REQUEST });
            const res = await Service.addBuildingType(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.ADD_BUILDING_TYPE_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.ADD_BUILDING_TYPE_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_BUILDING_TYPE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_BUILDING_TYPE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const parseFca = params => {
    let newBuildingTypeData = new FormData();
    newBuildingTypeData.append("id", params.id);
    if (params.region_id && params.region_id.length) {
        newBuildingTypeData.append("region_id", params.region_id);
    }
    if (params.replace && params.replace.length) {
        newBuildingTypeData.append("replace", params.replace);
    }
    if (params.fca_sheet && params.fca_sheet !== "undefined") {
        newBuildingTypeData.append("fca_sheet", params.fca_sheet);
    }
    newBuildingTypeData.append("site_id", params.site_id);
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.PARSE_FCA_REQUEST });
            const res = await Service.parseFca(newBuildingTypeData, params.id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.PARSE_FCA_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.PARSE_FCA_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.PARSE_FCA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.PARSE_FCA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateBuildingType = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_BUILDING_TYPE_REQUEST });
            const res = await Service.updateBuildingType(params, id);
            if (res && (res.status === 200 || res.status === 201)) {
                const building_typeData = res.data;
                if (building_typeData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_BUILDING_TYPE_SUCCESS,
                        response: building_typeData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_BUILDING_TYPE_FAILURE,
                        error: building_typeData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_BUILDING_TYPE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_BUILDING_TYPE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteBuildingType = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_BUILDING_TYPE_REQUEST });
            const res = await Service.deleteBuildingType(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.DELETE_BUILDING_TYPE_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({ type: actionTypes.DELETE_BUILDING_TYPE_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_BUILDING_TYPE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_BUILDING_TYPE_FAILURE,
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

const getAllClients = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CLIENTS_REQUEST });
            const res = await Service.getAllClients(param);
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

const getBuildingTypeById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_TYPE_BY_ID_REQUEST });
            const res = await Service.getBuildingTypeById(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_BUILDING_TYPE_BY_ID_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_BUILDING_TYPE_BY_ID_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_BUILDING_TYPE_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_BUILDING_TYPE_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const uploadBuildingTypeImage = (imageData, id) => {
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

const getAllBuildingTypeImages = id => {
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

const deleteBuildingTypeImage = id => {
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

const updateBuildingTypeEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_BUILDING_TYPE_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_BUILDING_TYPE_ENTITY_PARAMS_FAILURE,
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

const getAllBuildingTypeLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_BUILDING_TYPE_LOG_REQUEST });
            const res = await Service.getAllBuildingTypeLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_BUILDING_TYPE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_BUILDING_TYPE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_BUILDING_TYPE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_BUILDING_TYPE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreBuildingTypeLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_BUILDING_TYPE_LOG_REQUEST });
            const res = await Service.restoreBuildingTypeLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_BUILDING_TYPE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_BUILDING_TYPE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_BUILDING_TYPE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_BUILDING_TYPE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteBuildingTypeLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_BUILDING_TYPE_LOG_REQUEST });
            const res = await Service.deleteBuildingTypeLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_BUILDING_TYPE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_BUILDING_TYPE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_BUILDING_TYPE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_BUILDING_TYPE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const exportBuildingType = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_TYPE_EXPORT_REQUEST });
            const response = await Service.exportBuildingType(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_BUILDING_TYPE_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_BUILDING_TYPE_EXPORT_SUCCESS, response: {} });
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

const getColorCodesBuildingType = (buildingTypeId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_TYPE_COLOR_CODE_REQUEST });
            const res = await Service.getColorCodesBuildingType(buildingTypeId, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_BUILDING_TYPE_COLOR_CODE_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_BUILDING_TYPE_COLOR_CODE_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_BUILDING_TYPE_COLOR_CODE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_BUILDING_TYPE_COLOR_CODE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addColorCodeBuildingType = (buildingTypeId, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_BUILDING_TYPE_COLOR_CODE_REQUEST });
            const res = await Service.addColorCodeBuildingType(buildingTypeId, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.ADD_BUILDING_TYPE_COLOR_CODE_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.ADD_BUILDING_TYPE_COLOR_CODE_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_BUILDING_TYPE_COLOR_CODE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_BUILDING_TYPE_COLOR_CODE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateColorCodeBuildingType = (buildingTypeId, id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_BUILDING_TYPE_COLOR_CODE_REQUEST });
            const res = await Service.updateColorCodeBuildingType(buildingTypeId, id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_BUILDING_TYPE_COLOR_CODE_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_BUILDING_TYPE_COLOR_CODE_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_BUILDING_TYPE_COLOR_CODE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_BUILDING_TYPE_COLOR_CODE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteColorCodeBuildingType = (buildingTypeId, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_BUILDING_TYPE_COLOR_CODE_REQUEST });
            const res = await Service.deleteColorCodeBuildingType(buildingTypeId, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.DELETE_BUILDING_TYPE_COLOR_CODE_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.DELETE_BUILDING_TYPE_COLOR_CODE_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_BUILDING_TYPE_COLOR_CODE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_BUILDING_TYPE_COLOR_CODE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getAllBuildingTypes,
    addBuildingType,
    updateBuildingType,
    deleteBuildingType,
    getRegionsBasedOnClient,
    getAllConsultancyUsers,
    getAllClients,
    getBuildingTypeById,
    uploadBuildingTypeImage,
    getAllBuildingTypeImages,
    deleteBuildingTypeImage,
    parseFca,
    updateBuildingTypeEntityParams,
    getListForCommonFilter,
    getAllBuildingTypeLogs,
    restoreBuildingTypeLog,
    deleteBuildingTypeLog,
    exportBuildingType,

    getColorCodesBuildingType,
    deleteColorCodeBuildingType,
    updateColorCodeBuildingType,
    addColorCodeBuildingType
};
