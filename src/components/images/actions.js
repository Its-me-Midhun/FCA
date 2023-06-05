import * as actionTypes from "./constants";
import * as Service from "./services";

const uploadImage = (data, totalChunk, initialPerc, isAssetImage) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPLOAD_IMAGE_REQUEST });
            let config = {
                onUploadProgress: function (progressEvent) {
                    let percentCompleted = initialPerc + Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    let percentByChunk = Math.round(percentCompleted / totalChunk);
                    dispatch({
                        type: actionTypes.ADD_UPLOAD_PROGRESS,
                        response: percentByChunk
                    });
                }
            };
            const res = isAssetImage ? await Service.uploadMultiImageAsset(data, config) : await Service.uploadMultiImage(data, config);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.Result === "Success") {
                    dispatch({
                        type: actionTypes.UPLOAD_IMAGE_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPLOAD_IMAGE_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPLOAD_IMAGE_FAILURE,
                    error: res.response.data
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
const setProgressZero = data => {
    return async dispatch => {
        dispatch({
            type: actionTypes.SET_UPLOAD_PROGRESS,
            response: data
        });
    };
};

const updateImage = data => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_IMAGE_REQUEST });
            const res = await Service.updateImage(data);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_IMAGE_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_IMAGE_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_IMAGE_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_IMAGE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const checkDuplicateImages = (data, isAssetImage) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.CHECK_DUPLICATE_IMAGE_REQUEST });
            const res = isAssetImage ? await Service.checkDuplicateImagesAsset(data) : await Service.checkDuplicateImages(data);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.CHECK_DUPLICATE_IMAGE_SUCCESS,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.CHECK_DUPLICATE_IMAGE_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.CHECK_DUPLICATE_IMAGE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getProjectList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PROJECT_LIST_REQUEST });
            const res = await Service.getProjectList(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.GET_PROJECT_LIST_SUCCESS,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_PROJECT_LIST_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_PROJECT_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getBuildingList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_LIST_REQUEST });
            const res = await Service.getBuildingList(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.GET_BUILDING_LIST_SUCCESS,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_BUILDING_LIST_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_BUILDING_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getSelectedProject = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SELECTED_PROJECT_REQUEST });
            const res = await Service.getSelectedProject(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.GET_SELECTED_PROJECT_SUCCESS,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_SELECTED_PROJECT_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SELECTED_PROJECT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getTradeList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TRADE_LIST_REQUEST });
            const res = await Service.getTradeList(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.GET_TRADE_LIST_SUCCESS,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_TRADE_LIST_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_TRADE_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getSystemList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SYSTEM_LIST_REQUEST });
            const res = await Service.getSystemList(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.GET_SYSTEM_LIST_SUCCESS,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_SYSTEM_LIST_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SYSTEM_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getSubsystemList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SUBSYSTEM_LIST_REQUEST });
            const res = await Service.getSubsystemList(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.GET_SUBSYSTEM_LIST_SUCCESS,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_SUBSYSTEM_LIST_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SUBSYSTEM_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllImages = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_IMAGES1_REQUEST });
            const res = await Service.getAllImages(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_IMAGES1_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_IMAGES1_FAILURE,
                        response: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_IMAGES1_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_IMAGES1_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getFilterLists = (filterKey, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FILTER_LISTS_REQUEST });
            const res = await Service.getFilterLists(filterKey, params);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.GET_FILTER_LISTS_SUCCESS,
                    filterKey,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.GET_FILTER_LISTS_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_FILTER_LISTS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getAllImagesByRecommendation = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_IMAGES1_REQUEST });
            const res = await Service.getAllImagesByRecommendation(params, id);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_IMAGES1_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_IMAGES1_FAILURE,
                        response: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_IMAGES1_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_IMAGES1_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getAllImagesByNarrative = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_IMAGES1_REQUEST });
            const res = await Service.getAllImagesByNarrative(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_IMAGES1_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_IMAGES1_FAILURE,
                        response: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_IMAGES1_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_IMAGES1_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const updateSelectedImages = images => {
    return async dispatch => {
        dispatch({
            type: actionTypes.UPDATE_SELECTED_IMAGES,
            response: images
        });
    };
};
const checkImageMapped = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.CHECK_IMAGE_MAPPED_REQUEST });
            const res = await Service.checkImageMapped(id);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.success) {
                    dispatch({
                        type: actionTypes.CHECK_IMAGE_MAPPED_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.CHECK_IMAGE_MAPPED_FAILURE,
                        response: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.CHECK_IMAGE_MAPPED_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.CHECK_IMAGE_MAPPED_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const deleteImage = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_IMAGE_REQUEST });
            const res = await Service.deleteImage(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.status) {
                    dispatch({
                        type: actionTypes.DELETE_IMAGE_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.DELETE_IMAGE_FAILURE,
                        response: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_IMAGE_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_IMAGE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const addToFav = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_TO_FAV_REQUEST });
            const res = await Service.addToFav(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.status) {
                    dispatch({
                        type: actionTypes.ADD_TO_FAV_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.ADD_TO_FAV_FAILURE,
                        response: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_TO_FAV_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_TO_FAV_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getImageLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_IMAGE_LOG_REQUEST });
            const res = await Service.getImageLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_IMAGE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_IMAGE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_IMAGE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_IMAGE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ENTITY_PARAMS_FAILURE,
                error: entityParams
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
const setImgScrollPosition = pos => {
    return async dispatch => {
        try {
            if (pos) {
                dispatch({
                    type: actionTypes.UPDATE_IMG_SCROLL_POSITION_SUCCESS,
                    response: pos
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_IMG_SCROLL_POSITION_FAILURE,
                error: pos
            });
        }
    };
};
const getLabelList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LABEL_LIST_REQUEST });
            const res = await Service.getLabelList(params);
            if (res && res.status === 200) {
                const resData = res.data;
                if (resData.success) {
                    dispatch({
                        type: actionTypes.GET_LABEL_LIST_SUCCESS,
                        response: resData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LABEL_LIST_FAILURE,
                        error: resData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_LABEL_LIST_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_LABEL_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

//export images
const exportImages = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_IMAGES_LIST_REQUEST });
            const res = await Service.exportImages(params);
            if (res && res.data) {
                const text = await new Response(res.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_IMAGES_LIST_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.EXPORT_IMAGES_LIST_SUCCESS, response: {} });
                }
            }
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
        } catch (e) {
            dispatch({
                type: actionTypes.EXPORT_IMAGES_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const exportImagesPdf = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_IMAGES_LIST_REQUEST });
            const response = await Service.exportImagesPdf(params);
            if (response && response.data) {
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
            }
        } catch (e) {
            dispatch({
                type: actionTypes.EXPORT_IMAGES_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

//crop and rotate images
// const rotateImages = params => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.ROTATE_IMAGES_LIST_REQUEST });
//             const res = await Service.rotateImages(params);
//             if (res && res.data) {
//                 const text = await new Response(res.data).text();
//                 if (text && text.split('"')[1] === "error") {
//                     dispatch({ type: actionTypes.ROTATE_IMAGES_LIST_SUCCESS, response: { error: text.split('"')[3] } });
//                     return true;
//                 } else {
//                     dispatch({ type: actionTypes.ROTATE_IMAGES_LIST_SUCCESS, response: {} });
//                 }
//             }
//             const { data } = res;
//             const name = res.headers["content-disposition"].split("filename=");
//             const fileName = name[1].split('"')[1];
//             const downloadUrl = window.URL.createObjectURL(new Blob([data]));
//             const link = document.createElement("a");
//             link.href = downloadUrl;
//             link.setAttribute("download", `${fileName}`); //any other extension
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.ROTATE_IMAGES_LIST_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

const rotateImages = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ROTATE_IMAGES_LIST_REQUEST });
            const res = await Service.rotateImages(params);
            if (res && res.status === 200) {
                const responseData = res.data;
                if (responseData.Result === "Success") {
                    dispatch({
                        type: actionTypes.ROTATE_IMAGES_LIST_SUCCESS,
                        response: responseData
                    });
                } else {
                    dispatch({
                        type: actionTypes.ROTATE_IMAGES_LIST_FAILURE,
                        error: responseData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.ROTATE_IMAGES_LIST_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ROTATE_IMAGES_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const saveEditedImage = data => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.SAVE_EDITED_IMAGE_REQUEST });
            const res = await Service.saveEditedImage(data);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.SAVE_EDITED_IMAGE_SUCCESS,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.SAVE_EDITED_IMAGE_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.SAVE_EDITED_IMAGE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreEditedImage = data => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_EDITED_IMAGE_REQUEST });
            const res = await Service.restoreEditedImage(data);
            if (res && res.status === 200) {
                const responseData = res.data;
                dispatch({
                    type: actionTypes.RESTORE_EDITED_IMAGE_SUCCESS,
                    response: responseData
                });
            } else {
                dispatch({
                    type: actionTypes.RESTORE_EDITED_IMAGE_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_EDITED_IMAGE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    uploadImage,
    updateImage,
    checkDuplicateImages,
    getProjectList,
    getBuildingList,
    getSelectedProject,
    getTradeList,
    getSystemList,
    getSubsystemList,
    getAllImages,
    getFilterLists,
    getImageLogs,
    getAllImagesByRecommendation,
    updateSelectedImages,
    checkImageMapped,
    deleteImage,
    setProgressZero,
    getUserDefaultTrade,
    addToFav,
    updateEntityParams,
    getAllImagesByNarrative,
    setImgScrollPosition,
    getLabelList,
    exportImages,
    exportImagesPdf,
    rotateImages,
    saveEditedImage,
    restoreEditedImage
};
