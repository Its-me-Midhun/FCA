import * as actionTypes from "./constants";
import * as Service from "./services";

const getDataList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSET_DATA_REQUEST });
            const res = await Service.getDataList(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ASSET_DATA_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ASSET_DATA_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ASSET_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ASSET_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getChartAssetDataList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSET_DATA_REQUEST });
            const res = await Service.getChartAssetDataList(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ASSET_DATA_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ASSET_DATA_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ASSET_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ASSET_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addData = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_DATA_REQUEST });
            const res = await Service.addData(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.ADD_DATA_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.ADD_DATA_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAssetDataById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DATA_BY_ID_REQUEST });
            const res = await Service.getDataById(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_DATA_BY_ID_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_DATA_BY_ID_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_DATA_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_DATA_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateData = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_DATA_REQUEST });
            const res = await Service.updateData(id, params);
            if (res && (res.status === 200 || res.status === 201)) {
                const building_typeData = res.data;
                if (building_typeData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_DATA_SUCCESS,
                        response: building_typeData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_DATA_FAILURE,
                        error: building_typeData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateDataEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_ASSET_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ASSET_ENTITY_PARAMS_FAILURE,
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
                const floorData = res.data;
                if (floorData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: floorData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: floorData
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

const exportData = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DATA_EXPORT_REQUEST });
            const response = await Service.exportData(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_DATA_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_DATA_EXPORT_SUCCESS, response: {} });
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

const exportCustomExcel = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DATA_EXPORT_REQUEST });
            const response = await Service.exportCustomExcel(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_DATA_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_DATA_EXPORT_SUCCESS, response: {} });
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

const getAllDataLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_DATA_LOG_REQUEST });
            const res = await Service.getAllDataLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_DATA_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_DATA_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_DATA_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_DATA_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreDataLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_DATA_LOG_REQUEST });
            const res = await Service.restoreDataLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_DATA_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_DATA_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_DATA_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_DATA_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteDataLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_DATA_LOG_REQUEST });
            const res = await Service.deleteDataLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_DATA_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_DATA_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_DATA_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_DATA_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteData = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_DATA_REQUEST });
            const res = await Service.deleteData(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_DATA_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_DATA_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_DATA_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_DATA_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getDropdownList = (entity, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_DROPDOWN_REQUEST });
            const res = await Service.getDropdownList(entity, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_DROPDOWN_SUCCESS, response: regionData, entity });
                } else {
                    dispatch({ type: actionTypes.GET_DROPDOWN_FAILURE, error: regionData, entity });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_DROPDOWN_FAILURE,
                    error: res.response && res.response.data,
                    entity
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_DROPDOWN_FAILURE,
                error: e.response && e.response.data,
                entity
            });
        }
    };
};

const getAllImages = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_IMAGES });
            const res = await Service.getAllImages(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_IMAGES_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_IMAGES_FAILURE,
                        error: regionData
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

const uploadAssetImage = (imageData, id) => {
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

const updateAssetImage = imageData => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_ASSET_IMAGE_REQUEST });
            const res = await Service.updateAssetImage(imageData);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_ASSET_IMAGE_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({ type: actionTypes.UPDATE_ASSET_IMAGE_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_ASSET_IMAGE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ASSET_IMAGE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteAssetImage = id => {
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

const handleSelectAsset = (data, isChecked) => {
    return async dispatch => {
        try {
            dispatch({
                type: actionTypes.UPDATE_SELECTED_ASSET_SUCCESS,
                response: isChecked ? data : {}
            });
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_SELECTED_ASSET_FAILURE,
                error: ""
            });
        }
    };
};
const setAssetScrollPosition = pos => {
    return async dispatch => {
        try {
            if (pos) {
                dispatch({
                    type: actionTypes.UPDATE_ASSET_SCROLL_POSITION_SUCCESS,
                    response: pos
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ASSET_SCROLL_POSITION_FAILURE,
                error: pos
            });
        }
    };
};
export default {
    getDataList,
    addData,
    getAssetDataById,
    updateData,
    updateDataEntityParams,
    getListForCommonFilter,
    exportData,
    getAllDataLogs,
    restoreDataLog,
    deleteDataLog,
    deleteData,
    getDropdownList,
    getAllImages,
    uploadAssetImage,
    updateAssetImage,
    deleteAssetImage,
    handleSelectAsset,
    exportCustomExcel,
    setAssetScrollPosition,
    getChartAssetDataList
};
