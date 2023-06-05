import * as actionTypes from "./constants";
import * as Service from "./services";

const getUsers = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_USERS_REQUEST });
            const res = await Service.getUsers(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_USERS_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_USERS_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_USERS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_USERS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addUser = params => {
    let rec_data = new FormData();
    rec_data.append("image", params.image);
    rec_data.append("description", params.img_desc);
    rec_data.append("user", JSON.stringify(params));
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_USER_REQUEST });
            const res = await Service.addUser(rec_data);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.ADD_USER_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.ADD_USER_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_USER_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_USER_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateUser = (params, id, selectedImage) => {
    let rec_data = new FormData();
    if (selectedImage) {
        rec_data.append("image", selectedImage);
    }
    if (params.img_desc) {
        rec_data.append("description", params.img_desc);
    }
    rec_data.append("user", JSON.stringify(params));
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_USER_REQUEST });
            const res = await Service.updateUser(rec_data, id);
            if (res && (res.status === 200 || res.status === 201)) {
                const building_typeData = res.data;
                if (building_typeData.success) {
                    dispatch({
                        type: actionTypes.UPDATE_USER_SUCCESS,
                        response: building_typeData
                    });
                } else {
                    dispatch({
                        type: actionTypes.UPDATE_USER_FAILURE,
                        error: building_typeData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_USER_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_USER_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteUser = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_USER_REQUEST });
            const res = await Service.deleteUser(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.DELETE_USER_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({ type: actionTypes.DELETE_USER_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_USER_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_USER_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getUserById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_USER_BY_ID_REQUEST });
            const res = await Service.getUserById(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_USER_BY_ID_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_USER_BY_ID_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_USER_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_USER_BY_ID_FAILURE,
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
                    type: actionTypes.UPDATE_USER_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_USER_ENTITY_PARAMS_FAILURE,
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

const getAllUserLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_USER_LOG_REQUEST });
            const res = await Service.getAllUserLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_USER_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_USER_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_USER_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_USER_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreUserLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_USER_LOG_REQUEST });
            const res = await Service.restoreUserLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_USER_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_USER_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_USER_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_USER_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteUserLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_USER_LOG_REQUEST });
            const res = await Service.deleteUserLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_USER_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_USER_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_USER_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_USER_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const exportUser = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_USER_EXPORT_REQUEST });
            const response = await Service.exportUser(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_USER_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_USER_EXPORT_SUCCESS, response: {} });
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
                type: actionTypes.GET_USER_EXPORT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllProjectsDropdown = () => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_PROJECTS_DROP_DOWN_REQUEST });
            const res = await Service.getAllProjectsDropdown();
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_PROJECTS_DROP_DOWN_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_PROJECTS_DROP_DOWN_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_PROJECTS_DROP_DOWN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_PROJECTS_DROP_DOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllBuildingsDropdown = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_BUILDINGS_DROP_DOWN_REQUEST });
            const res = await Service.getAllBuildingsDropdown(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_BUILDINGS_DROP_DOWN_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_BUILDINGS_DROP_DOWN_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_BUILDINGS_DROP_DOWN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_BUILDINGS_DROP_DOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllRolesDropdown = () => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_ROLES_DROP_DOWN_REQUEST });
            const res = await Service.getAllRolesDropdown();
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_ROLES_DROP_DOWN_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_ROLES_DROP_DOWN_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_ROLES_DROP_DOWN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_ROLES_DROP_DOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllGroupsDropdown = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_GROUPS_DROP_DOWN_REQUEST });
            const res = await Service.getAllGroupsDropdown({ consultancy_id: id });
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_GROUPS_DROP_DOWN_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_GROUPS_DROP_DOWN_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_GROUPS_DROP_DOWN_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_GROUPS_DROP_DOWN_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getConsultanciesBasedOnRole = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CONSULTANCIES_BASED_ON_ROLE_REQUEST });
            const res = await Service.getConsultanciesBasedOnRole(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_CONSULTANCIES_BASED_ON_ROLE_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_CONSULTANCIES_BASED_ON_ROLE_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CONSULTANCIES_BASED_ON_ROLE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CONSULTANCIES_BASED_ON_ROLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getClientsBasedOnRole = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CLIENTS_BASED_ON_ROLE_REQUEST });
            const res = await Service.getClientsBasedOnRole(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_CLIENTS_BASED_ON_ROLE_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_CLIENTS_BASED_ON_ROLE_FAILURE,
                        error: regionData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_CLIENTS_BASED_ON_ROLE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_CLIENTS_BASED_ON_ROLE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    updateBuildingTypeEntityParams,
    getListForCommonFilter,
    getAllUserLogs,
    restoreUserLog,
    deleteUserLog,
    exportUser,
    getAllBuildingsDropdown,
    getAllGroupsDropdown,
    getAllProjectsDropdown,
    getAllRolesDropdown,
    getConsultanciesBasedOnRole,
    getClientsBasedOnRole
};
