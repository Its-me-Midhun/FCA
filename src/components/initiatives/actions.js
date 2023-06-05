import * as actionTypes from "./constants";
import * as Service from "./services";

const getAllInitiatives = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_INITIATIVES_REQUEST });
            const res = await Service.getAllInitiatives(params, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_INITIATIVES_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_INITIATIVES_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_INITIATIVES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_INITIATIVES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateInitiativeEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_INITIATIVE_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_INITIATIVE_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const getListForCommonFilterInitiatives = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilterInitiatives(params);
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

const exportInitative = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_INITIATIVE_EXPORT_REQUEST });
            const response = await Service.exportInitative(params);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_INITIATIVE_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.GET_INITIATIVE_EXPORT_SUCCESS, response: {} });
                }
            }
            const { data } = response;
            const name = response.headers['content-disposition'].split('filename=');
            const fileName = name[1].split('"')[1];
            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `${fileName}`); //any other extension
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
        }
    };
};

const getAllProjectsDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_PROJECT_DROPDOWN_REQUEST });
            const res = await Service.getAllProjectsDropdown(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_ALL_PROJECT_DROPDOWN_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ALL_PROJECT_DROPDOWN_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_PROJECT_DROPDOWN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_PROJECT_DROPDOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addInitiatives = params => {
    // let initiative_data = new FormData();
    // initiative_data.append("initiative", JSON.stringify(params));
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_INITIATIVES_REQUEST });
            const res = await Service.addInitiatives(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.ADD_INITIATIVES_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.ADD_INITIATIVES_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_INITIATIVES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_INITIATIVES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateInitiatives = (params, id) => {
    // let initiative_data = new FormData();
    // initiative_data.append("initiative", JSON.stringify(params));
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_INITIATIVES_REQUEST });
            const res = await Service.updateInitiatives(params, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_INITIATIVES_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_INITIATIVES_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_INITIATIVES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_INITIATIVES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteInitiatives = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_INITIATIVES_REQUEST });
            const res = await Service.deleteInitiatives(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.DELETE_INITIATIVES_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.DELETE_INITIATIVES_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_INITIATIVES_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_INITIATIVES_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getInitiativeById = (id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_INITIATIVE_REQUEST });
            const res = await Service.getInitiativeById(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_INITIATIVE_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_INITIATIVE_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_INITIATIVE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_INITIATIVE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

// const getInitiativeById = (id) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_INITIATIVE_REQUEST });
//             const res = await Service.getInitiativeById( id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_INITIATIVE_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_INITIATIVE_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_INITIATIVE_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_INITIATIVE_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

const getInitiativeLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_INITIATIVE_LOG_REQUEST });
            const res = await Service.getInitiativeLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_INITIATIVE_LOG_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_INITIATIVE_LOG_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_INITIATIVE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_INITIATIVE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreInitiativeLog = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_INITIATIVE_LOG_REQUEST });
            const res = await Service.restoreInitiativeLog(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.RESTORE_INITIATIVE_LOG_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.RESTORE_INITIATIVE_LOG_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_INITIATIVE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_INITIATIVE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteInitiativeLog = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_INITIATIVE_LOG_REQUEST });
            const res = await Service.deleteInitiativeLog(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.DELETE_INITIATIVE_LOG_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.DELETE_INITIATIVE_LOG_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_INITIATIVE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_INITIATIVE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};


const assignProject = (param, id, params) => {
    console.log("params-->",{...params, ...param})
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_INITIATIVE_REQUEST });
            const res = await Service.assignProject(id, { ...params, ...param });
            if (res && res.status === 200) {
                const regionData = res;
                if (regionData && regionData.data.success) {
                    dispatch({
                        type: actionTypes.ASSIGN_INITIATIVE_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.ASSIGN_INITIATIVE_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.ASSIGN_INITIATIVE_FAILURE,
                    error: res.response
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ASSIGN_INITIATIVE_FAILURE,
                error: e.response
            });
        }
    };
};

const unAssignProject = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UN_ASSIGN_INITIATIVE_REQUEST });
            const res = await Service.unAssignProject(params, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.UN_ASSIGN_INITIATIVE_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UN_ASSIGN_INITIATIVE_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UN_ASSIGN_INITIATIVE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UN_ASSIGN_INITIATIVE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getAllInitiatives,
    updateInitiativeEntityParams,
    getListForCommonFilterInitiatives,
    exportInitative,
    getAllProjectsDropdown,
    addInitiatives,
    updateInitiatives,
    deleteInitiatives,
    getInitiativeById,
    getInitiativeLogs,
    restoreInitiativeLog,
    deleteInitiativeLog,
    assignProject,
    unAssignProject

}