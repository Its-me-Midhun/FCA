import * as actionTypes from "./constants";
import * as Service from "./services";

const getAllPermissions = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_PERMISSION_REQUEST });
            const res = await Service.getAllPermissions(param);
            if (res && res.status === 200) {
                const loginData = res.data;
                //TODO change loginData.access_token to emailData.success (change api response)
                if (loginData.access_token) {
                    dispatch({ type: actionTypes.GET_ALL_PERMISSION_SUCCESS, response: loginData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_PERMISSION_FAILURE, error: loginData });
                }
            } else {
                dispatch({ type: actionTypes.GET_ALL_PERMISSION_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_ALL_PERMISSION_FAILURE, error: e.response && e.response.data });
        }
    };
};

const deletePermissions = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_PERMISSION_REQUEST });
            const res = await Service.deletePermissions(param);
            if (res && res.status === 200) {
                const loginData = res.data;
                //TODO change loginData.access_token to emailData.success (change api response)
                if (loginData.access_token) {
                    dispatch({ type: actionTypes.DELETE_PERMISSION_SUCCESS, response: loginData });
                } else {
                    dispatch({ type: actionTypes.DELETE_PERMISSION_FAILURE, error: loginData });
                }
            } else {
                dispatch({ type: actionTypes.DELETE_PERMISSION_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.DELETE_PERMISSION_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getPermissions = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PERMISSION_REQUEST });
            const res = await Service.getPermissions(param);
            if (res && res.status === 200) {
                const loginData = res.data;
                //TODO change loginData.access_token to emailData.success (change api response)
                if (loginData.access_token) {
                    dispatch({ type: actionTypes.GET_PERMISSION_SUCCESS, response: loginData });
                } else {
                    dispatch({ type: actionTypes.GET_PERMISSION_FAILURE, error: loginData });
                }
            } else {
                dispatch({ type: actionTypes.GET_PERMISSION_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_PERMISSION_FAILURE, error: e.response && e.response.data });
        }
    };
};

const createPermission = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.CREATE_PERMISSION_REQUEST });
            const res = await Service.createPermissions(param);
            if (res && res.status === 200) {
                const loginData = res.data;
                //TODO change loginData.access_token to emailData.success (change api response)
                if (loginData.success) {
                    dispatch({ type: actionTypes.CREATE_PERMISSION_SUCCESS, response: loginData });
                } else {
                    dispatch({ type: actionTypes.CREATE_PERMISSION_FAILURE, error: loginData });
                }
            } else {
                dispatch({ type: actionTypes.CREATE_PERMISSION_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.CREATE_PERMISSION_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updatePermissions = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.CREATE_PERMISSION_REQUEST });
            const res = await Service.updatePermissions(param);
            if (res && res.status === 200) {
                const loginData = res.data;
                //TODO change loginData.access_token to emailData.success (change api response)
                if (loginData.success) {
                    dispatch({ type: actionTypes.CREATE_PERMISSION_SUCCESS, response: loginData });
                } else {
                    dispatch({ type: actionTypes.CREATE_PERMISSION_FAILURE, error: loginData });
                }
            } else {
                dispatch({ type: actionTypes.CREATE_PERMISSION_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.CREATE_PERMISSION_FAILURE, error: e.response && e.response.data });
        }
    };
};

const updateUserPermissionEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_USER_PERMISSION_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_USER_PERMISSION_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const getAllTemplate = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TEMPLATE_REQUEST });
            const res = await Service.getAllTemplate(param);
            if (res && res.status === 200) {
                const loginData = res.data;
                //TODO change loginData.access_token to emailData.success (change api response)
                if (loginData.success) {
                    dispatch({ type: actionTypes.GET_TEMPLATE_SUCCESS, response: loginData });
                } else {
                    dispatch({ type: actionTypes.GET_TEMPLATE_FAILURE, error: loginData });
                }
            } else {
                dispatch({ type: actionTypes.GET_TEMPLATE_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_TEMPLATE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getAllConsultancyUser = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_CONSULTANCY_USER_REQUEST });
            const res = await Service.getAllConsultancyUser(param);
            if (res && res.status === 200) {
                const loginData = res.data;
                //TODO change loginData.access_token to emailData.success (change api response)
                if (loginData.access_token) {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_USER_SUCCESS, response: loginData });
                } else {
                    dispatch({ type: actionTypes.GET_CONSULTANCY_USER_FAILURE, error: loginData });
                }
            } else {
                dispatch({ type: actionTypes.GET_CONSULTANCY_USER_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_CONSULTANCY_USER_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getDetailsTemplate = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BY_TEMPLATE_REQUEST });
            const res = await Service.getDetailsTemplate(param);
            if (res && res.status === 200) {
                const loginData = res.data;
                //TODO change loginData.access_token to emailData.success (change api response)
                if (loginData.access_token) {
                    dispatch({ type: actionTypes.GET_BY_TEMPLATE_SUCCESS, response: loginData });
                } else {
                    dispatch({ type: actionTypes.GET_BY_TEMPLATE_FAILURE, error: loginData });
                }
            } else {
                dispatch({ type: actionTypes.GET_BY_TEMPLATE_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_BY_TEMPLATE_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getPermissionById = param => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PERMISSION_BY_ID_REQUEST });
            const res = await Service.getPermissionById(param);
            if (res && res.status === 200) {
                const loginData = res.data;
                //TODO change loginData.access_token to emailData.success (change api response)
                if (loginData.access_token) {
                    dispatch({ type: actionTypes.GET_PERMISSION_BY_ID_SUCCESS, response: loginData });
                } else {
                    dispatch({ type: actionTypes.GET_PERMISSION_BY_ID_FAILURE, error: loginData });
                }
            } else {
                dispatch({ type: actionTypes.GET_PERMISSION_BY_ID_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_PERMISSION_BY_ID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getListForCommonFilter = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilter(params, id);
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

const exportPermissions = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_PERMISSION_EXPORT_REQUEST });
            const response = await Service.exportPermissions(params);
            if (response && response.status === 200) {
                const regionData = response.data;
                if (regionData.error) {
                    dispatch({ type: actionTypes.GET_PERMISSION_EXPORT_SUCCESS, response: regionData });
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
        } catch (e) {}
    };
};

const getTemplateInitialValues = () => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_TEMPLATE_INITIAL_VALUES_REQUEST });
            const res = await Service.getTemplateInitialValues();
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_TEMPLATE_INITIAL_VALUES_SUCCESS, response: res });
                } else {
                    dispatch({ type: actionTypes.GET_TEMPLATE_INITIAL_VALUES_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_TEMPLATE_INITIAL_VALUES_FAILURE, error: res.response && res.response.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_TEMPLATE_INITIAL_VALUES_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getUserListForPermissions = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_USER_LIST_FOR_PERMISSIONS_REQUEST });
            const res = await Service.getUserListForPermissions(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_USER_LIST_FOR_PERMISSIONS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_USER_LIST_FOR_PERMISSIONS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_USER_LIST_FOR_PERMISSIONS_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_USER_LIST_FOR_PERMISSIONS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const getUserPermissionsById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_USER_PERMISSIONS_BYID_REQUEST });
            const res = await Service.getUserPermissionsById(id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.GET_USER_PERMISSIONS_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.GET_USER_PERMISSIONS_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.GET_USER_PERMISSIONS_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.GET_USER_PERMISSIONS_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

const addUserPermissions = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_USER_PERMISSIONS_REQUEST });
            const res = await Service.addUserPermissions(params);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.ADD_USER_PERMISSIONS_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.ADD_USER_PERMISSIONS_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.ADD_USER_PERMISSIONS_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.ADD_USER_PERMISSIONS_FAILURE, error: e.response && e.response.data });
        }
    };
};

const editUserPermissionsById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EDIT_USER_PERMISSIONS_BYID_REQUEST });
            const res = await Service.editUserPermissionsById(params, id);
            if (res && res.status === 200) {
                if (res.data) {
                    dispatch({ type: actionTypes.EDIT_USER_PERMISSIONS_BYID_SUCCESS, response: res.data });
                } else {
                    dispatch({ type: actionTypes.EDIT_USER_PERMISSIONS_BYID_FAILURE, error: res.data });
                }
            } else {
                dispatch({ type: actionTypes.EDIT_USER_PERMISSIONS_BYID_FAILURE, error: res.data });
            }
        } catch (e) {
            dispatch({ type: actionTypes.EDIT_USER_PERMISSIONS_BYID_FAILURE, error: e.response && e.response.data });
        }
    };
};

export default {
    getAllPermissions,
    deletePermissions,
    getPermissions,
    createPermission,
    updateUserPermissionEntityParams,
    getAllTemplate,
    getDetailsTemplate,
    getPermissionById,
    getListForCommonFilter,
    updatePermissions,
    exportPermissions,
    getAllConsultancyUser,
    getTemplateInitialValues,
    getUserListForPermissions,
    getUserPermissionsById,
    addUserPermissions,
    editUserPermissionsById
};
