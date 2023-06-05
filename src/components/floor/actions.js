import * as actionTypes from "./constants";
import * as Service from "./services";

const getFloorsBasedOnBuilding = (building_id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FLOORS_BASED_ON_BUILDING_REQUEST });
            const res = await Service.getFloorsBasedOnBuilding(building_id, params);
            if (res && res.status === 200) {
                const floorData = res.data;
                if (floorData.success) {
                    dispatch({
                        type: actionTypes.GET_FLOORS_BASED_ON_BUILDING_SUCCESS,
                        response: floorData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_FLOORS_BASED_ON_BUILDING_FAILURE,
                        error: floorData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_FLOORS_BASED_ON_BUILDING_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_FLOORS_BASED_ON_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addFloor = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_FLOOR_REQUEST });
            const res = await Service.addFloor(id, params);
            if (res && res.status === 200) {
                const floorData = res.data;
                if (floorData.success) {
                    dispatch({ type: actionTypes.ADD_FLOOR_SUCCESS, response: floorData });
                } else {
                    dispatch({ type: actionTypes.ADD_FLOOR_FAILURE, error: floorData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_FLOOR_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_FLOOR_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateFloor = (building_id, floor_id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_FLOOR_REQUEST });
            const res = await Service.updateFloor(building_id, floor_id, params);
            if (res && (res.status === 200 || res.status === 201)) {
                const floorData = res.data;
                if (floorData.success) {
                    dispatch({ type: actionTypes.UPDATE_FLOOR_SUCCESS, response: floorData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_FLOOR_FAILURE, error: floorData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_FLOOR_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_FLOOR_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteFloor = (building_id, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_FLOOR_REQUEST });
            const res = await Service.deleteFloor(building_id, id);
            if (res && res.status === 200) {
                const floorData = res.data;
                if (floorData.success) {
                    dispatch({ type: actionTypes.DELETE_FLOOR_SUCCESS, response: floorData });
                } else {
                    dispatch({ type: actionTypes.DELETE_FLOOR_FAILURE, error: floorData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_FLOOR_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_FLOOR_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getFloorById = (building_id, floor_id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FLOOR_BY_ID_REQUEST });
            const res = await Service.getFloorById(building_id, floor_id);
            if (res && res.status === 200) {
                const floorData = res.data;
                if (floorData.success) {
                    dispatch({ type: actionTypes.GET_FLOOR_BY_ID_SUCCESS, response: floorData });
                } else {
                    dispatch({ type: actionTypes.GET_FLOOR_BY_ID_FAILURE, error: floorData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_FLOOR_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_FLOOR_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateFloorEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_FLOOR_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_FLOOR_ENTITY_PARAMS_FAILURE,
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

const exportFloorsByBuilding = (buildingId) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_FLOOR_EXPORT_REQUEST });
            const response = await Service.exportFloorsByBuilding(buildingId);
            if (response && response.data) {
                const text = await (new Response(response.data)).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_FLOOR_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                }
                else {
                    dispatch({ type: actionTypes.GET_FLOOR_EXPORT_SUCCESS, response: {} });
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

const getAllFloorLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_FLOOR_LOG_REQUEST });
            const res = await Service.getAllFloorLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_FLOOR_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_FLOOR_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_FLOOR_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_FLOOR_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreFloorLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_FLOOR_LOG_REQUEST });
            const res = await Service.restoreFloorLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_FLOOR_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_FLOOR_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_FLOOR_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_FLOOR_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteFloorLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_FLOOR_LOG_REQUEST });
            const res = await Service.deleteFloorLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_FLOOR_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_FLOOR_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_FLOOR_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_FLOOR_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getAllClientUsers = (id) => {
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



const getAllBuildingsDropdown = (params) => {
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

const getAllClientss = (params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CLIENTS_REQUEST });
            const res = await Service.getAllClientss(params);
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



const getAllConsultanciesDropdown = (id) => {
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




const getAllConsultancyUsers = (params) => {

    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_USERS_REQUEST });
            const res = await Service.getAllConsultancyUsers(params);
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
export default {
    getFloorsBasedOnBuilding,
    addFloor,
    updateFloor,
    deleteFloor,
    getFloorById,
    updateFloorEntityParams,
    getListForCommonFilter,
    exportFloorsByBuilding,
    getAllFloorLogs,
    restoreFloorLog,
    deleteFloorLog,
    getAllClientUsers,
    getAllConsultancyUsers,
    getAllConsultanciesDropdown,
    getAllClientss,
    getAllBuildingsDropdown
};
