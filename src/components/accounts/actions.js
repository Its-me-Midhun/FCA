import * as actionTypes from "./constants";
import * as Service from "./services";

const getAccounts = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ACCOUNTS_BASED_ON_BUILDING_REQUEST });
            const res = await Service.getAccounts(params, dynamicUrl);
            if (res && res.status === 200) {
                const accountData = res.data;
                if (accountData.success) {
                    dispatch({
                        type: actionTypes.GET_ACCOUNTS_BASED_ON_BUILDING_SUCCESS,
                        response: accountData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_ACCOUNTS_BASED_ON_BUILDING_FAILURE,
                        error: accountData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ACCOUNTS_BASED_ON_BUILDING_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ACCOUNTS_BASED_ON_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addAccount = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_ACCOUNT_REQUEST });
            const res = await Service.addAccount(params, dynamicUrl);
            console.log("SAVE::::", res, { params })
            if (res && res.status === 200) {
                const accountData = res.data;
                if (accountData.success) {
                    dispatch({ type: actionTypes.ADD_ACCOUNT_SUCCESS, response: accountData });
                } else {
                    dispatch({ type: actionTypes.ADD_ACCOUNT_FAILURE, error: accountData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_ACCOUNT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_ACCOUNT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateAccount = (account_id, params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_ACCOUNT_REQUEST });
            const res = await Service.updateAccount(account_id, params, dynamicUrl);
            if (res && (res.status === 200 || res.status === 201)) {
                const accountData = res.data;
                if (accountData.success) {
                    dispatch({ type: actionTypes.UPDATE_ACCOUNT_SUCCESS, response: accountData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_ACCOUNT_FAILURE, error: accountData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_ACCOUNT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ACCOUNT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteAccount = (id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_ACCOUNT_REQUEST });
            const res = await Service.deleteAccount(id, dynamicUrl);
            if (res && res.status === 200) {
                const accountData = res.data;
                if (accountData.success) {
                    dispatch({ type: actionTypes.DELETE_ACCOUNT_SUCCESS, response: accountData });
                } else {
                    dispatch({ type: actionTypes.DELETE_ACCOUNT_FAILURE, error: accountData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_ACCOUNT_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_ACCOUNT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAccountById = (account_id, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ACCOUNT_BY_ID_REQUEST });
            const res = await Service.getAccountById(account_id, dynamicUrl);
            if (res && res.status === 200) {
                const accountData = res.data;
                if (accountData.success) {
                    dispatch({ type: actionTypes.GET_ACCOUNT_BY_ID_SUCCESS, response: accountData });
                } else {
                    dispatch({ type: actionTypes.GET_ACCOUNT_BY_ID_FAILURE, error: accountData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ACCOUNT_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ACCOUNT_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateAccountEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_ACCOUNT_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ACCOUNT_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

const getListForCommonFilter = (params, dynamicUrl) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
            const res = await Service.getListForCommonFilter(params, dynamicUrl);
            if (res && res.status === 200) {
                const accountData = res.data;
                if (accountData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: accountData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: accountData
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

const exportAccounts = (dynamicUrl, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ACCOUNT_EXPORT_REQUEST });
            const response = await Service.exportAccounts(dynamicUrl, params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_ACCOUNT_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_ACCOUNT_EXPORT_SUCCESS, response: {} });
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
        } catch (e) { }
    };
};

const getAllAccountLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_ACCOUNT_LOG_REQUEST });
            const res = await Service.getAllAccountLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_ACCOUNT_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_ACCOUNT_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_ACCOUNT_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_ACCOUNT_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreAccountLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_ACCOUNT_LOG_REQUEST });
            const res = await Service.restoreAccountLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_ACCOUNT_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_ACCOUNT_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_ACCOUNT_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_ACCOUNT_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteAccountLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_ACCOUNT_LOG_REQUEST });
            const res = await Service.deleteAccountLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_ACCOUNT_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_ACCOUNT_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_ACCOUNT_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_ACCOUNT_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAssignModalDetails = (id, type) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ASSIGN_MODAL_DETAILS_REQUEST });
            const res = await Service.getAssignModalDetails(id, type);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ASSIGN_MODAL_DETAILS_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ASSIGN_MODAL_DETAILS_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ASSIGN_MODAL_DETAILS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ASSIGN_MODAL_DETAILS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const assignItems = (id, params, type) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ASSIGN_ITEMS_REQUEST });
            const res = await Service.assignItems(id, params, type);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.ASSIGN_ITEMS_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.ASSIGN_ITEMS_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.ASSIGN_ITEMS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ASSIGN_ITEMS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    getAccountById,
    updateAccountEntityParams,
    getListForCommonFilter,
    exportAccounts,
    getAllAccountLogs,
    restoreAccountLog,
    deleteAccountLog,
    getAssignModalDetails,
    assignItems
};
