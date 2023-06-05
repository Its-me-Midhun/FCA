import * as actionTypes from "./constants";
import * as Service from "./services";
import axios from "axios";

const getClientDetails = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CLIENT_DETAILS_REQUEST });
            const res = await Service.getAllClients(params);
            if (res && res.status === 200) {
                const readingData = res.data;
                if (readingData.success) {
                    dispatch({ type: actionTypes.GET_ALL_CLIENT_DETAILS_SUCCESS, response: readingData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CLIENT_DETAILS_FAILURE, error: readingData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_CLIENT_DETAILS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_CLIENT_DETAILS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getClientById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_CLIENT_ID_REQUEST });
            const res = await Service.getClientsId(id);
            if (res && res.status === 200) {
                const readingData = res.data;
                if (readingData.success) {
                    dispatch({ type: actionTypes.GET_ALL_CLIENT_ID_SUCCESS, response: readingData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_CLIENT_ID_FAILURE, error: readingData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_CLIENT_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_CLIENT_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const getAllReadings = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_METER_READINGS_REQUEST });
            const res = await Service.getAllMeterReadings(params);
            if (res && res.status === 200) {
                const readingData = res.data;
                if (readingData.success) {
                    dispatch({ type: actionTypes.GET_ALL_METER_READINGS_SUCCESS, response: readingData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_METER_READINGS_FAILURE, error: readingData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_METER_READINGS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_METER_READINGS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateProjectEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_ENERGY_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ENERGY_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

// Regions
const getAllRegions = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_REGIONS_ENERGY_REQUEST });
            const res = await Service.getAllRegions(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_REGIONS_ENERGY_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_REGIONS_ENERGY_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_REGIONS_ENERGY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_REGIONS_ENERGY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getRegionById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_REGION_BY_ID_ENERGY_REQUEST });
            const res = await Service.getRegionById(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_REGION_BY_ID_ENERGY_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_REGION_BY_ID_ENERGY_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_REGION_BY_ID_ENERGY_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_REGION_BY_ID_ENERGY_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateRegionEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_REGION_ENTITY_PARAMS_ENERGY_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_REGION_ENTITY_PARAMS_ENERGY_FAILURE,
                error: entityParams
            });
        }
    };
};

const updateElectricEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_ELECTRIC_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_ELECTRIC_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};

// const getChartExportProject = (chartParams, params) => {
//     return async dispatch => {
//         try {
//             const response = await Service.getChartExportProject(chartParams, params);
//             const { data } = response;
//             const name = response.headers["content-disposition"].split("filename=");
//             const fileName = name[1].split('"')[1];
//             const downloadUrl = window.URL.createObjectURL(new Blob([data]));
//             const link = document.createElement("a");
//             link.href = downloadUrl;
//             link.setAttribute("download", `${fileName}`); //any other extension
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch (e) {}
//     };
// };
// const addProject = params => {
//     let newProjectData = new FormData();
//     newProjectData.append("fca_sheet", params.fca_sheet);
//     newProjectData.append("client_id", params.client_id);
//     newProjectData.append("region_id", params.region_id);
//     newProjectData.append("site_id", params.site_id);
//     if (params.project_id) {
//         newProjectData.append("id", params.project_id);
//     }
//     if (params.name && params.name.length) {
//         newProjectData.append("name", params.name);
//     }
//     newProjectData.append("code", params.code);
//     newProjectData.append("comments", params.comments);
//     newProjectData.append("consultancy_user_ids", JSON.stringify(params.consultancy_user_ids));
//     newProjectData.append("client_user_ids", JSON.stringify(params.client_user_ids));
//     newProjectData.append("consultancy_id", params.consultancy_id);

//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.ADD_PROJECT_REQUEST });
//             const res = await Service.addProject(newProjectData);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.ADD_PROJECT_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.ADD_PROJECT_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.ADD_PROJECT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.ADD_PROJECT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const parseFca = params => {
//     let newProjectData = new FormData();
//     newProjectData.append("id", params.id);
//     if (params.region_id && params.region_id.length) {
//         newProjectData.append("region_id", params.region_id);
//     }
//     if (params.replace && params.replace.length) {
//         newProjectData.append("replace", params.replace);
//     }
//     if (params.fca_sheet && params.fca_sheet !== "undefined") {
//         newProjectData.append("fca_sheet", params.fca_sheet);
//     }
//     newProjectData.append("site_id", params.site_id);
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.PARSE_FCA_REQUEST });
//             const res = await Service.parseFca(newProjectData, params.id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.PARSE_FCA_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.PARSE_FCA_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.PARSE_FCA_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.PARSE_FCA_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const updateProject = (params, id) => {
//     let newProjectData = new FormData();
//     if (params.name && params.name.length) {
//         newProjectData.append("name", params.name);
//     }
//     newProjectData.append("comments", params.comments);
//     newProjectData.append("consultancy_user_ids", JSON.stringify(params.consultancy_user_ids));
//     newProjectData.append("removed_users", JSON.stringify(params.removed_users));
//     newProjectData.append("client_user_ids", JSON.stringify(params.client_user_ids));

//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_PROJECT_REQUEST });
//             const res = await Service.updateProject(newProjectData, id);
//             if (res && (res.status === 200 || res.status === 201)) {
//                 const projectData = res.data;
//                 if (projectData.success) {
//                     dispatch({ type: actionTypes.UPDATE_PROJECT_SUCCESS, response: projectData });
//                 } else {
//                     dispatch({ type: actionTypes.UPDATE_PROJECT_FAILURE, error: projectData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_PROJECT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_PROJECT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const deleteProject = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.DELETE_PROJECT_REQUEST });
//             const res = await Service.deleteProject(id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.DELETE_PROJECT_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.DELETE_PROJECT_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.DELETE_PROJECT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.DELETE_PROJECT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getRegionsBasedOnClient = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_REGIONS_BASED_ON_CLIENT_REQUEST });
//             const res = await Service.getRegionsBasedOnClient(id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_REGIONS_BASED_ON_CLIENT_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_REGIONS_BASED_ON_CLIENT_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_REGIONS_BASED_ON_CLIENT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_REGIONS_BASED_ON_CLIENT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getAllConsultancyUsers = params => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_ALL_CONSULTANCY_USERS_REQUEST });
//             const res = await Service.getAllConsultancyUsers(params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_ALL_CONSULTANCY_USERS_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_ALL_CONSULTANCY_USERS_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_ALL_CONSULTANCY_USERS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_ALL_CONSULTANCY_USERS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getAllClients = params => {
//     console.log("clients are", params);
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_ALL_CLIENTS_REQUEST });
//             const res = await Service.getAllClients(params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.GET_ALL_CLIENTS_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.GET_ALL_CLIENTS_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_ALL_CLIENTS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_ALL_CLIENTS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getProjectById = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_PROJECT_BY_ID_REQUEST });
//             const res = await Service.getProjectById(id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.GET_PROJECT_BY_ID_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.GET_PROJECT_BY_ID_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_PROJECT_BY_ID_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_PROJECT_BY_ID_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getBuildingTypeSettingsData = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_BUILDING_TYPE_SETTINGS_DATA_REQUEST });
//             const res = await Service.getBuildingTypeSettingsData(id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_BUILDING_TYPE_SETTINGS_DATA_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_BUILDING_TYPE_SETTINGS_DATA_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_BUILDING_TYPE_SETTINGS_DATA_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_BUILDING_TYPE_SETTINGS_DATA_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const updateBuildingTypeSettings = (projectId, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_BUILDING_TYPE_SETTINGS_REQUEST });
//             const res = await Service.updateBuildingTypeSettings(projectId, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.UPDATE_BUILDING_TYPE_SETTINGS_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.UPDATE_BUILDING_TYPE_SETTINGS_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_BUILDING_TYPE_SETTINGS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_BUILDING_TYPE_SETTINGS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const uploadProjectImage = (imageData, id) => {
//     let newImageData = new FormData();
//     newImageData.append("image", imageData.file);
//     newImageData.append("description", imageData.comments);

//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPLOAD_IMAGE_REQUEST });
//             const res = await Service.uploadImage(newImageData, id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.UPLOAD_IMAGE_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.UPLOAD_IMAGE_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPLOAD_IMAGE_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPLOAD_IMAGE_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getAllProjectImages = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_ALL_IMAGES_REQUEST });
//             const res = await Service.getAllImages(id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.GET_ALL_IMAGES_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.GET_ALL_IMAGES_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_ALL_IMAGES_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_ALL_IMAGES_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const deleteProjectImage = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.DELETE_IMAGES_REQUEST });
//             const res = await Service.deleteImages(id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.DELETE_IMAGES_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.DELETE_IMAGES_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.DELETE_IMAGES_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.DELETE_IMAGES_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getTradeSettingsData = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_TRADE_SETTINGS_DATA_REQUEST });
//             const res = await Service.getTradeSettingsData(id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_TRADE_SETTINGS_DATA_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_TRADE_SETTINGS_DATA_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_TRADE_SETTINGS_DATA_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_TRADE_SETTINGS_DATA_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getFutureCapitalBySite = (projectId, siteId) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_FUTURE_CAPITAL_BY_SITE_REQUEST });
//             const res = await Service.getFutureCapitalBySite(projectId, siteId);
//             if (res && res.status === 200) {
//                 const futureCapital = res.data;
//                 if (futureCapital.success) {
//                     dispatch({
//                         type: actionTypes.GET_FUTURE_CAPITAL_BY_SITE_SUCCESS,
//                         response: futureCapital
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_FUTURE_CAPITAL_BY_SITE_FAILURE,
//                         error: futureCapital
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_FUTURE_CAPITAL_BY_SITE_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_FUTURE_CAPITAL_BY_SITE_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const addTrade = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.ADD_TRADE_REQUEST });
//             const res = await Service.addTrade(id, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.ADD_TRADE_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.ADD_TRADE_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.ADD_TRADE_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.ADD_TRADE_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getTradeById = (id, tradeid) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_TRADE_BY_ID_REQUEST });
//             const res = await Service.getTradeById(id, tradeid);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_TRADE_BY_ID_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_TRADE_BY_ID_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_TRADE_BY_ID_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_TRADE_BY_ID_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const updateTrade = (projectId, tradeId, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_TRADE_REQUEST });
//             const res = await Service.updateTrade(projectId, tradeId, params);
//             if (res && (res.status === 200 || res.status === 201)) {
//                 const building_typeData = res.data;
//                 if (building_typeData.success) {
//                     dispatch({
//                         type: actionTypes.UPDATE_TRADE_SUCCESS,
//                         response: building_typeData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.UPDATE_TRADE_FAILURE,
//                         error: building_typeData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_TRADE_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_TRADE_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const deleteTrade = (id, tradeId) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.DELETE_TRADE_REQUEST });
//             const res = await Service.deleteTrade(id, tradeId);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.DELETE_TRADE_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({ type: actionTypes.DELETE_TRADE_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.DELETE_TRADE_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.DELETE_TRADE_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getCategorySettingsData = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_CATEGORY_SETTINGS_DATA_REQUEST });
//             const res = await Service.getCategorySettingsData(id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_CATEGORY_SETTINGS_DATA_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_CATEGORY_SETTINGS_DATA_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_CATEGORY_SETTINGS_DATA_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_CATEGORY_SETTINGS_DATA_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getDifferedMaintenanceBySite = (projectId, siteId) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_DIFFERED_MAINTENANCE_BY_SITE_REQUEST });
//             const res = await Service.getDifferedMaintenanceBySite(projectId, siteId);
//             if (res && res.status === 200) {
//                 const differedMaintenance = res.data;
//                 if (differedMaintenance.success) {
//                     dispatch({
//                         type: actionTypes.GET_DIFFERED_MAINTENANCE_BY_SITE_SUCCESS,
//                         response: differedMaintenance
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_DIFFERED_MAINTENANCE_BY_SITE_FAILURE,
//                         error: differedMaintenance
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_DIFFERED_MAINTENANCE_BY_SITE_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_DIFFERED_MAINTENANCE_BY_SITE_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const addCategory = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.ADD_CATEGORY_REQUEST });
//             const res = await Service.addCategory(id, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.ADD_CATEGORY_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.ADD_CATEGORY_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.ADD_CATEGORY_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.ADD_CATEGORY_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getCategoryById = (id, tradeid) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_CATEGORY_BY_ID_REQUEST });
//             const res = await Service.getCategoryById(id, tradeid);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_CATEGORY_BY_ID_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_CATEGORY_BY_ID_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_CATEGORY_BY_ID_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_CATEGORY_BY_ID_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const updateCategory = (projectId, tradeId, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_CATEGORY_REQUEST });
//             const res = await Service.updateCategory(projectId, tradeId, params);
//             if (res && (res.status === 200 || res.status === 201)) {
//                 const building_typeData = res.data;
//                 if (building_typeData.success) {
//                     dispatch({
//                         type: actionTypes.UPDATE_CATEGORY_SUCCESS,
//                         response: building_typeData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.UPDATE_CATEGORY_FAILURE,
//                         error: building_typeData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_CATEGORY_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_CATEGORY_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const deleteCategory = (id, tradeId) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.DELETE_CATEGORY_REQUEST });
//             const res = await Service.deleteCategory(id, tradeId);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.DELETE_CATEGORY_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({ type: actionTypes.DELETE_CATEGORY_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.DELETE_CATEGORY_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.DELETE_CATEGORY_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getListForCommonFilterproject = params => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_LIST_FOR_COMMON_FILTER_REQUEST });
//             const res = await Service.getListForCommonFilter(params);
//             if (res && res.status === 200) {
//                 const siteData = res.data;
//                 if (siteData.success) {
//                     dispatch({
//                         type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
//                         response: siteData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
//                         error: siteData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getSystemSettingsData = (params, id) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_SYSTEM_SETTINGS_DATA_REQUEST });
//             const res = await Service.getSystemSettingsData(params, id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_SYSTEM_SETTINGS_DATA_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_SYSTEM_SETTINGS_DATA_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_SYSTEM_SETTINGS_DATA_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_SYSTEM_SETTINGS_DATA_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const addSystem = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.ADD_SYSTEM_REQUEST });
//             const res = await Service.addSystem(id, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.ADD_SYSTEM_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.ADD_SYSTEM_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.ADD_SYSTEM_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.ADD_SYSTEM_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getSystemById = (id, systemid) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_SYSTEM_BY_ID_REQUEST });
//             const res = await Service.getSystemById(id, systemid);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_SYSTEM_BY_ID_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_SYSTEM_BY_ID_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_SYSTEM_BY_ID_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_SYSTEM_BY_ID_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const updateSystem = (projectId, systemId, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_SYSTEM_REQUEST });
//             const res = await Service.updateSystem(projectId, systemId, params);
//             if (res && (res.status === 200 || res.status === 201)) {
//                 const building_typeData = res.data;
//                 if (building_typeData.success) {
//                     dispatch({
//                         type: actionTypes.UPDATE_SYSTEM_SUCCESS,
//                         response: building_typeData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.UPDATE_SYSTEM_FAILURE,
//                         error: building_typeData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_SYSTEM_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_SYSTEM_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const deleteSystem = (id, systemId) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.DELETE_SYSTEM_REQUEST });
//             const res = await Service.deleteSystem(id, systemId);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.DELETE_SYSTEM_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({ type: actionTypes.DELETE_SYSTEM_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.DELETE_SYSTEM_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.DELETE_SYSTEM_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getSubsystemSettingsData = (params, id) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_SUB_SYSTEM_SETTINGS_DATA_REQUEST });
//             const res = await Service.getSubsystemSettingsData(params, id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_SUB_SYSTEM_SETTINGS_DATA_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_SUB_SYSTEM_SETTINGS_DATA_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_SUB_SYSTEM_SETTINGS_DATA_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_SUB_SYSTEM_SETTINGS_DATA_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const addSubsystem = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.ADD_SUB_SYSTEM_REQUEST });
//             const res = await Service.addSubsystem(id, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.ADD_SUB_SYSTEM_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.ADD_SUB_SYSTEM_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.ADD_SUB_SYSTEM_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.ADD_SUB_SYSTEM_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getSubsystemById = (id, subsystemid) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_SUB_SYSTEM_BY_ID_REQUEST });
//             const res = await Service.getSubsystemById(id, subsystemid);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_SUB_SYSTEM_BY_ID_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_SUB_SYSTEM_BY_ID_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_SUB_SYSTEM_BY_ID_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_SUB_SYSTEM_BY_ID_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const updateSubsystem = (projectId, subsystemId, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_SUB_SYSTEM_REQUEST });
//             const res = await Service.updateSubsystem(projectId, subsystemId, params);
//             if (res && (res.status === 200 || res.status === 201)) {
//                 const building_typeData = res.data;
//                 if (building_typeData.success) {
//                     dispatch({
//                         type: actionTypes.UPDATE_SUB_SYSTEM_SUCCESS,
//                         response: building_typeData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.UPDATE_SUB_SYSTEM_FAILURE,
//                         error: building_typeData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_SUB_SYSTEM_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_SUB_SYSTEM_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const deleteSubsystem = (id, subsystemId) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.DELETE_SUB_SYSTEM_REQUEST });
//             const res = await Service.deleteSubsystem(id, subsystemId);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.DELETE_SUB_SYSTEM_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({ type: actionTypes.DELETE_SUB_SYSTEM_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.DELETE_SUB_SYSTEM_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.DELETE_SUB_SYSTEM_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getDepartmentSettingsData = (params, id) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_DEPARTMENT_SETTINGS_DATA_REQUEST });
//             const res = await Service.getDepartmentSettingsData(params, id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_DEPARTMENT_SETTINGS_DATA_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_DEPARTMENT_SETTINGS_DATA_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_DEPARTMENT_SETTINGS_DATA_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_DEPARTMENT_SETTINGS_DATA_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const addDepartment = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.ADD_DEPARTMENT_REQUEST });
//             const res = await Service.addDepartment(id, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.ADD_DEPARTMENT_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.ADD_DEPARTMENT_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.ADD_DEPARTMENT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.ADD_DEPARTMENT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getDepartmentById = (id, subsystemid) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_DEPARTMENT_BY_ID_REQUEST });
//             const res = await Service.getDepartmentById(id, subsystemid);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_DEPARTMENT_BY_ID_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_DEPARTMENT_BY_ID_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_DEPARTMENT_BY_ID_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_DEPARTMENT_BY_ID_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const updateDepartment = (projectId, subsystemId, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_DEPARTMENT_REQUEST });
//             const res = await Service.updateDepartment(projectId, subsystemId, params);
//             if (res && (res.status === 200 || res.status === 201)) {
//                 const building_typeData = res.data;
//                 if (building_typeData.success) {
//                     dispatch({
//                         type: actionTypes.UPDATE_DEPARTMENT_SUCCESS,
//                         response: building_typeData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.UPDATE_DEPARTMENT_FAILURE,
//                         error: building_typeData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_DEPARTMENT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_DEPARTMENT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const deleteDepartment = (id, subsystemId) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.DELETE_DEPARTMENT_REQUEST });
//             const res = await Service.deleteDepartment(id, subsystemId);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.DELETE_DEPARTMENT_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({ type: actionTypes.DELETE_DEPARTMENT_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.DELETE_DEPARTMENT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.DELETE_DEPARTMENT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const addLimit = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.ADD_LIMIT_REQUEST });
//             const res = await Service.addLimit(id, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.ADD_LIMIT_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.ADD_LIMIT_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.ADD_LIMIT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.ADD_LIMIT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getaddLimit = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_ADD_LIMIT_REQUEST });
//             const res = await Service.getaddLimit(id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.GET_ADD_LIMIT_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.GET_ADD_LIMIT_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_ADD_LIMIT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_ADD_LIMIT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getGeneralById = (id, subsystemid) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_GENERAL_BY_ID_REQUEST });
//             const res = await Service.getGeneralById(id, subsystemid);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_GENERAL_BY_ID_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_GENERAL_BY_ID_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_GENERAL_BY_ID_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_GENERAL_BY_ID_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const updateGeneral = (projectId, subsystemId, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_GENERAL_REQUEST });
//             const res = await Service.updateGeneral(projectId, subsystemId, params);
//             if (res && (res.status === 200 || res.status === 201)) {
//                 const building_typeData = res.data;
//                 if (building_typeData.success) {
//                     dispatch({
//                         type: actionTypes.UPDATE_GENERAL_SUCCESS,
//                         response: building_typeData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.UPDATE_GENERAL_FAILURE,
//                         error: building_typeData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_GENERAL_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_GENERAL_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const deleteGeneral = (id, subsystemId) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.DELETE_GENERAL_REQUEST });
//             const res = await Service.deleteGeneral(id, subsystemId);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.DELETE_GENERAL_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({ type: actionTypes.DELETE_GENERAL_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.DELETE_GENERAL_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.DELETE_GENERAL_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getTradeSettingsDropdown = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_TRADE_SETTINGS_DROPDOWN_REQUEST });
//             const res = await Service.getTradeSettingsDropdown(id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_TRADE_SETTINGS_DROPDOWN_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_TRADE_SETTINGS_DROPDOWN_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_TRADE_SETTINGS_DROPDOWN_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_TRADE_SETTINGS_DROPDOWN_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getSystemSettingsDropdown = (params, id) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_SYSTEM_SETTINGS_BY_TRADE_REQUEST });
//             const res = await Service.getSystemSettingsDropdown(params, id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_SYSTEM_SETTINGS_BY_TRADE_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_SYSTEM_SETTINGS_BY_TRADE_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_SYSTEM_SETTINGS_BY_TRADE_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_SYSTEM_SETTINGS_BY_TRADE_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const exportProject = params => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_PROJECTS_EXPORT_REQUEST });
//             const response = await Service.exportProject(params);
//             if (response && response.data) {
//                 const text = await new Response(response.data).text();
//                 if (text && text.split('"')[1] === "error") {
//                     dispatch({ type: actionTypes.GET_PROJECTS_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
//                     return true;
//                 } else {
//                     dispatch({ type: actionTypes.GET_PROJECTS_EXPORT_SUCCESS, response: {} });
//                 }
//             }
//             const { data } = response;
//             const name = response.headers["content-disposition"].split("filename=");
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
//                 type: actionTypes.GET_PROJECTS_EXPORT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getColorCodes = (projectId, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_EFCI_COLOR_CODE_REQUEST });
//             const res = await Service.getColorCodes(projectId, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_EFCI_COLOR_CODE_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_EFCI_COLOR_CODE_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_EFCI_COLOR_CODE_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_EFCI_COLOR_CODE_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const addColorCode = (projectId, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.ADD_EFCI_COLOR_CODE_REQUEST });
//             const res = await Service.addColorCode(projectId, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.ADD_EFCI_COLOR_CODE_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.ADD_EFCI_COLOR_CODE_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.ADD_EFCI_COLOR_CODE_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.ADD_EFCI_COLOR_CODE_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const updateColorCode = (projectId, id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_EFCI_COLOR_CODE_REQUEST });
//             const res = await Service.updateColorCode(projectId, id, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.UPDATE_EFCI_COLOR_CODE_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.UPDATE_EFCI_COLOR_CODE_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_EFCI_COLOR_CODE_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_EFCI_COLOR_CODE_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const deleteColorCode = (projectId, id) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.DELETE_EFCI_COLOR_CODE_REQUEST });
//             const res = await Service.deleteColorCode(projectId, id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.DELETE_EFCI_COLOR_CODE_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.DELETE_EFCI_COLOR_CODE_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.DELETE_EFCI_COLOR_CODE_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.DELETE_EFCI_COLOR_CODE_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getAllProjectLogs = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_ALL_PROJECT_LOG_REQUEST });
//             const res = await Service.getAllProjectLogs(id, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.GET_ALL_PROJECT_LOG_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.GET_ALL_PROJECT_LOG_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_ALL_PROJECT_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_ALL_PROJECT_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const restoreProjectLog = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.RESTORE_PROJECT_LOG_REQUEST });
//             const res = await Service.restoreProjectLog(id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.RESTORE_PROJECT_LOG_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.RESTORE_PROJECT_LOG_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.RESTORE_PROJECT_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.RESTORE_PROJECT_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const deleteProjectLog = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.DELETE_PROJECT_LOG_REQUEST });
//             const res = await Service.deleteProjectLog(id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.DELETE_PROJECT_LOG_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.DELETE_PROJECT_LOG_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.DELETE_PROJECT_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.DELETE_PROJECT_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getChartByProject = (chartParams, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_CHARTS_PROJECT_REQUEST });
//             const res = await Service.getChartByProject(chartParams, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.GET_CHARTS_PROJECT_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.GET_CHARTS_PROJECT_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_CHARTS_PROJECT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_CHARTS_PROJECT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getProjectImportHistory = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_ALL_PROJECT_IMPORT_LOG_REQUEST });
//             const res = await Service.getProjectImportHistory(id, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.GET_ALL_PROJECT_IMPORT_LOG_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.GET_ALL_PROJECT_IMPORT_LOG_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_ALL_PROJECT_IMPORT_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_ALL_PROJECT_IMPORT_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const deleteProjectHistory = (id, projectId) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.DELETE_PROJECT_IMPORT_LOG_REQUEST });
//             const res = await Service.deleteProjectHistory(id, projectId);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.DELETE_PROJECT_IMPORT_LOG_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.DELETE_PROJECT_IMPORT_LOG_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.DELETE_PROJECT_IMPORT_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.DELETE_PROJECT_IMPORT_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const exportImportProject = (params, id) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_IMPORT_PROJECTS_EXPORT_REQUEST });
//             const response = await Service.exportImportProject(params, id);
//             if (response && response.status === 200) {
//                 const regionData = response.data;
//                 if (regionData.error) {
//                     dispatch({ type: actionTypes.GET_IMPORT_PROJECTS_EXPORT_SUCCESS, response: regionData });
//                     return true;
//                 }
//             }
//             const { data } = response;
//             const name = response.headers["content-disposition"].split("filename=");
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
//                 type: actionTypes.GET_IMPORT_PROJECTS_EXPORT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getEfciByProject = projectId => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_EFCI_BY_PROJECT_REQUEST });
//             const res = await Service.getEfciByProject(projectId);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.GET_EFCI_BY_PROJECT_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.GET_EFCI_BY_PROJECT_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_EFCI_BY_PROJECT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_EFCI_BY_PROJECT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// //logSectionForChart

// const getAllSiteByChartProjectLogs = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_ALL_SITE_CHART_LOG_REQUEST });
//             const res = await Service.getAllSiteByChartProjectLogs(id, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.GET_ALL_SITE_CHART_LOG_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.GET_ALL_SITE_CHART_LOG_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_ALL_SITE_CHART_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_ALL_SITE_CHART_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const restoreSiteByChartProjectLog = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.RESTORE_SITE_CHART_LOG_REQUEST });
//             const res = await Service.restoreSiteByChartProjectLog(id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.RESTORE_SITE_CHART_LOG_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.RESTORE_SITE_CHART_LOG_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.RESTORE_SITE_CHART_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.RESTORE_SITE_CHART_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const deleteSiteByChartProjectLog = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.DELETE_SITE_CHART_LOG_REQUEST });
//             const res = await Service.deleteSiteByChartProjectLog(id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.DELETE_SITE_CHART_LOG_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.DELETE_SITE_CHART_LOG_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.DELETE_SITE_CHART_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.DELETE_SITE_CHART_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// // const getAnnualEfciByChartProjectLogs = (columnId, params) => {
// //     return async dispatch => {
// //         try {
// //             dispatch({ type: actionTypes.GET_ANNUAL_EFCI_CHART_LOGS_PROJECT_REQUEST });
// //             const res = await Service.getAnnualEfciByChartProjectLogs(columnId, params);

// //             if (res && res.status === 200) {
// //                 const regionData = res.data;
// //                 if (regionData.success) {
// //                     dispatch({
// //                         type: actionTypes.GET_ANNUAL_EFCI_CHART_LOGS_PROJECT_SUCCESS,
// //                         response: regionData
// //                     });
// //                 } else {
// //                     dispatch({
// //                         type: actionTypes.GET_ANNUAL_EFCI_CHART_LOGS_PROJECT_FAILURE,
// //                         error: regionData
// //                     });
// //                 }
// //             } else {
// //                 dispatch({
// //                     type: actionTypes.GET_ANNUAL_EFCI_CHART_LOGS_PROJECT_FAILURE,
// //                     error: res.response && res.response.data
// //                 });
// //             }
// //         } catch (e) {
// //             dispatch({
// //                 type: actionTypes.GET_ANNUAL_EFCI_CHART_LOGS_PROJECT_FAILURE,
// //                 error: e.response && e.response.data
// //             });
// //         }
// //     };
// // };

// // const getAnnualFundingCalculationByChartProjectLogs = (columnId, params) => {
// //     return async dispatch => {
// //         try {
// //             dispatch({ type: actionTypes.GET_ANNUAL_FUNDING_OPTIONS_CHART_LOGS_PROJECT__REQUEST });
// //             const res = await Service.getAnnualFundingCalculationByChartProjectLogs(columnId, params);

// //             if (res && res.status === 200) {
// //                 const regionData = res.data;
// //                 if (regionData.success) {
// //                     dispatch({
// //                         type: actionTypes.GET_ANNUAL_FUNDING_OPTIONS_CHART_LOGS_PROJECT__SUCCESS,
// //                         response: regionData
// //                     });
// //                 } else {
// //                     dispatch({
// //                         type: actionTypes.GET_ANNUAL_FUNDING_OPTIONS_CHART_LOGS_PROJECT_FAILURE,
// //                         error: regionData
// //                     });
// //                 }
// //             } else {
// //                 dispatch({
// //                     type: actionTypes.GET_ANNUAL_FUNDING_OPTIONS_CHART_LOGS_PROJECT_FAILURE,
// //                     error: res.response && res.response.data
// //                 });
// //             }
// //         } catch (e) {
// //             dispatch({
// //                 type: actionTypes.GET_ANNUAL_FUNDING_OPTIONS_CHART_LOGS_PROJECT_FAILURE,
// //                 error: e.response && e.response.data
// //             });
// //         }
// //     };
// // };

// const restoreAnnualByChartEFCIProject = columnId => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.RESTORE_ANNUAL_EFCI_CHART_LOGS_REQUEST });
//             const res = await Service.restoreAnnualByChartEFCIProject(columnId);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.RESTORE_ANNUAL_EFCI_CHART_LOGS_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.RESTORE_ANNUAL_EFCI_CHART_LOGS_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.RESTORE_ANNUAL_EFCI_CHART_LOGS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.RESTORE_ANNUAL_EFCI_CHART_LOGS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const restoreAnnualFundingByChartCalculationProject = columnId => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.RESTORE_ANNUAL_FUNDING_CHART_LOGS_REQUEST });
//             const res = await Service.restoreAnnualFundingByChartCalculationProject(columnId);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.RESTORE_ANNUAL_FUNDING_CHART_LOGS_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.RESTORE_ANNUAL_FUNDING_CHART_LOGS_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.RESTORE_ANNUAL_FUNDING_CHART_LOGS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.RESTORE_ANNUAL_FUNDING_CHART_LOGS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getFundingOptionByChartProjectLog = (columnId, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_FUNDING_OPTIONS_CHART_LOGS_PROJECT_REQUEST });
//             const res = await Service.getFundingOptionByChartProjectLog(columnId, params);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_FUNDING_OPTIONS_CHART_LOGS_PROJECT_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_FUNDING_OPTIONS_CHART_LOGS_PROJECT_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_FUNDING_OPTIONS_CHART_LOGS_PROJECT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_FUNDING_OPTIONS_CHART_LOGS_PROJECT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const restoreFundingOptionByChartProjectLogs = columnId => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.RESTORE_FUNDING_CHART_LOGS_REQUEST });
//             const res = await Service.restoreFundingOptionByChartProjectLogs(columnId);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.RESTORE_FUNDING_CHART_LOGS_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.RESTORE_FUNDING_CHART_LOGS_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.RESTORE_FUNDING_CHART_LOGS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.RESTORE_FUNDING_CHART_LOGS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getFundingSiteEfciByChartProjectLog = (columnId, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_FUNDING_EFCI_CHART_LOGS_PROJECT_REQUEST });
//             const res = await Service.getFundingSiteEfciByChartProjectLog(columnId, params);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_FUNDING_EFCI_CHART_LOGS_PROJECT_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_FUNDING_EFCI_CHART_LOGS_PROJECT_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_FUNDING_EFCI_CHART_LOGS_PROJECT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_FUNDING_EFCI_CHART_LOGS_PROJECT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const restoreFundingEfciByChartProjectLogs = columnId => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.RESTORE_FUNDING_EFCI_CHART_LOGS_REQUEST });
//             const res = await Service.restoreFundingEfciByChartProjectLogs(columnId);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.RESTORE_FUNDING_EFCI_CHART_LOGS_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.RESTORE_FUNDING_EFCI_CHART_LOGS_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.RESTORE_FUNDING_EFCI_CHART_LOGS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.RESTORE_FUNDING_EFCI_CHART_LOGS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getTotalFundingByChartProjectLog = (columnId, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_TOTAL_FUNDING_EFCI_CHART_LOGS_PROJECT_REQUEST });
//             const res = await Service.getTotalFundingByChartProjectLog(columnId, params);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_TOTAL_FUNDING_EFCI_CHART_LOGS_PROJECT_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_TOTAL_FUNDING_EFCI_CHART_LOGS_PROJECT_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_TOTAL_FUNDING_EFCI_CHART_LOGS_PROJECT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_TOTAL_FUNDING_EFCI_CHART_LOGS_PROJECT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const restoreFundingTotalByChartProjectLogs = columnId => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.RESTORE_TOTAL_FUNDING_EFCI_CHART_LOGS_REQUEST });
//             const res = await Service.restoreFundingTotalByChartProjectLogs(columnId);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.RESTORE_TOTAL_FUNDING_EFCI_CHART_LOGS_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.RESTORE_TOTAL_FUNDING_EFCI_CHART_LOGS_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.RESTORE_TOTAL_FUNDING_EFCI_CHART_LOGS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.RESTORE_TOTAL_FUNDING_EFCI_CHART_LOGS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// // const getCapitalSpendingPlanByChartProjectLogs = (columnId, params) => {
// //     return async dispatch => {
// //         try {
// //             dispatch({ type: actionTypes.GET_CSP_CHART_LOGS_PROJECT_REQUEST });
// //             const res = await Service.getCapitalSpendingPlanByChartProjectLogs(columnId, params);

// //             if (res && res.status === 200) {
// //                 const regionData = res.data;
// //                 if (regionData.success) {
// //                     dispatch({
// //                         type: actionTypes.GET_CSP_CHART_LOGS_PROJECT_SUCCESS,
// //                         response: regionData
// //                     });
// //                 } else {
// //                     dispatch({
// //                         type: actionTypes.GET_CSP_CHART_LOGS_PROJECT_FAILURE,
// //                         error: regionData
// //                     });
// //                 }
// //             } else {
// //                 dispatch({
// //                     type: actionTypes.GET_CSP_CHART_LOGS_PROJECT_FAILURE,
// //                     error: res.response && res.response.data
// //                 });
// //             }
// //         } catch (e) {
// //             dispatch({
// //                 type: actionTypes.GET_CSP_CHART_LOGS_PROJECT_FAILURE,
// //                 error: e.response && e.response.data
// //             });
// //         }
// //     };
// // };

// const restoreCapitalSpendingPlanByChartProjectLogs = columnId => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.RESTORE_CSP_CHART_LOGS_REQUEST });
//             const res = await Service.restoreCapitalSpendingPlanByChartProjectLogs(columnId);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.RESTORE_CSP_CHART_LOGS_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.RESTORE_CSP_CHART_LOGS_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.RESTORE_CSP_CHART_LOGS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.RESTORE_CSP_CHART_LOGS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const deleteEFCIByChartProjectLog = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.DELETE_EFCI_CHART_LOG_REQUEST });
//             const res = await Service.deleteEFCIByChartProjectLog(id);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.DELETE_EFCI_CHART_LOGS_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.DELETE_EFCI_CHART_LOGS_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.DELETE_EFCI_CHART_LOGS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.DELETE_EFCI_CHART_LOGS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// //efci chart

// const getChartEfciProject = (projectId, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_CHART_EFCI_PROJECT_REQUEST });
//             const res = await Service.getChartEfciProject(projectId, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_CHART_EFCI_PROJECT_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_CHART_EFCI_PROJECT_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_CHART_EFCI_PROJECT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_CHART_EFCI_PROJECT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// // const updateCapitalSpendingPlanChartProject = (id, params) => {
// //     return async dispatch => {
// //         try {
// //             dispatch({ type: actionTypes.UPDATE_CAPITAL_SPENDING_PLAN_CHART_PROJECT_REQUEST });
// //             const res = await Service.updateCapitalSpendingPlanChartProject(id, params);
// //             if (res && res.status === 200) {
// //                 const regionData = res.data;
// //                 if (regionData.success) {
// //                     dispatch({
// //                         type: actionTypes.UPDATE_CAPITAL_SPENDING_PLAN_CHART_PROJECT_SUCCESS,
// //                         response: regionData
// //                     });
// //                 } else {
// //                     dispatch({
// //                         type: actionTypes.UPDATE_CAPITAL_SPENDING_PLAN_CHART_PROJECT_FAILURE,
// //                         error: regionData
// //                     });
// //                 }
// //             } else {
// //                 dispatch({
// //                     type: actionTypes.UPDATE_CAPITAL_SPENDING_PLAN_CHART_PROJECT_FAILURE,
// //                     error: res.response && res.response.data
// //                 });
// //             }
// //         } catch (e) {
// //             dispatch({
// //                 type: actionTypes.UPDATE_CAPITAL_SPENDING_PLAN_CHART_PROJECT_FAILURE,
// //                 error: e.response && e.response.data
// //             });
// //         }
// //     };
// // };

// // const updateFundingOptionChartProject = (id, params) => {
// //     return async dispatch => {
// //         try {
// //             dispatch({ type: actionTypes.UPDATE_FUNDING_OPTION_CHART_PROJECT_REQUEST });
// //             const res = await Service.updateFundingOptionChartProject(id, params);
// //             if (res && res.status === 200) {
// //                 const regionData = res.data;
// //                 if (regionData.success) {
// //                     dispatch({
// //                         type: actionTypes.UPDATE_FUNDING_OPTION_CHART_PROJECT_SUCCESS,
// //                         response: regionData
// //                     });
// //                 } else {
// //                     dispatch({
// //                         type: actionTypes.UPDATE_FUNDING_OPTION_CHART_PROJECT_FAILURE,
// //                         error: regionData
// //                     });
// //                 }
// //             } else {
// //                 dispatch({
// //                     type: actionTypes.UPDATE_FUNDING_OPTION_CHART_PROJECT_FAILURE,
// //                     error: res.response && res.response.data
// //                 });
// //             }
// //         } catch (e) {
// //             dispatch({
// //                 type: actionTypes.UPDATE_FUNDING_OPTION_CHART_PROJECT_FAILURE,
// //                 error: e.response && e.response.data
// //             });
// //         }
// //     };
// // };

// // const updateAnnualEfciChartProject = (id, params) => {
// //     return async dispatch => {
// //         try {
// //             dispatch({ type: actionTypes.UPDATE_ANNUAL_EFCI_CHART_PROJECT_REQUEST });
// //             const res = await Service.updateAnnualEfciChartProject(id, params);
// //             if (res && res.status === 200) {
// //                 const regionData = res.data;
// //                 if (regionData.success) {
// //                     dispatch({
// //                         type: actionTypes.UPDATE_ANNUAL_EFCI_CHART_PROJECT_SUCCESS,
// //                         response: regionData
// //                     });
// //                 } else {
// //                     dispatch({
// //                         type: actionTypes.UPDATE_ANNUAL_EFCI_CHART_PROJECT_FAILURE,
// //                         error: regionData
// //                     });
// //                 }
// //             } else {
// //                 dispatch({
// //                     type: actionTypes.UPDATE_ANNUAL_EFCI_CHART_PROJECT_FAILURE,
// //                     error: res.response && res.response.data
// //                 });
// //             }
// //         } catch (e) {
// //             dispatch({
// //                 type: actionTypes.UPDATE_ANNUAL_EFCI_CHART_PROJECT_FAILURE,
// //                 error: e.response && e.response.data
// //             });
// //         }
// //     };
// // };
// // const updateAnnualFundingChartProject = (id, params) => {
// //     return async dispatch => {
// //         try {
// //             dispatch({ type: actionTypes.UPDATE_ANNUAL_FUNDING_CHART_PROJECT_REQUEST });
// //             const res = await Service.updateAnnualFundingChartProject(id, params);
// //             if (res && res.status === 200) {
// //                 const regionData = res.data;
// //                 if (regionData.success) {
// //                     dispatch({
// //                         type: actionTypes.UPDATE_ANNUAL_FUNDING_CHART_PROJECT_SUCCESS,
// //                         response: regionData
// //                     });
// //                 } else {
// //                     dispatch({
// //                         type: actionTypes.UPDATE_ANNUAL_FUNDING_CHART_PROJECT_FAILURE,
// //                         error: regionData
// //                     });
// //                 }
// //             } else {
// //                 dispatch({
// //                     type: actionTypes.UPDATE_ANNUAL_FUNDING_CHART_PROJECT_FAILURE,
// //                     error: res.response && res.response.data
// //                 });
// //             }
// //         } catch (e) {
// //             dispatch({
// //                 type: actionTypes.UPDATE_ANNUAL_FUNDING_CHART_PROJECT_FAILURE,
// //                 error: e.response && e.response.data
// //             });
// //         }
// //     };
// // };

// // const updateFundingSiteEfciChartProject = (id, params) => {
// //     return async dispatch => {
// //         try {
// //             dispatch({ type: actionTypes.UPDATE_FUNDING_EFCI_CHART_PROJECT_REQUEST });
// //             const res = await Service.updateFundingSiteEfciChart(id, params);
// //             if (res && res.status === 200) {
// //                 const regionData = res.data;
// //                 if (regionData.success) {
// //                     dispatch({
// //                         type: actionTypes.UPDATE_FUNDING_EFCI_CHART_PROJECT_SUCCESS,
// //                         response: regionData
// //                     });
// //                 } else {
// //                     dispatch({
// //                         type: actionTypes.UPDATE_FUNDING_EFCI_CHART_PROJECT_FAILURE,
// //                         error: regionData
// //                     });
// //                 }
// //             } else {
// //                 dispatch({
// //                     type: actionTypes.UPDATE_FUNDING_EFCI_CHART_PROJECT_FAILURE,
// //                     error: res.response && res.response.data
// //                 });
// //             }
// //         } catch (e) {
// //             dispatch({
// //                 type: actionTypes.UPDATE_FUNDING_EFCI_PROJECT_FAILURE,
// //                 error: e.response && e.response.data
// //             });
// //         }
// //     };
// // };

// // const hideFundingOptionChartProject = id => {
// //     let spendingPercent = id;
// //     return async dispatch => {
// //         try {
// //             dispatch({ type: actionTypes.HIDE_FUNDING_OPTION_CHART_PROJECT_REQUEST });
// //             if (id.length >= 0) {
// //                 if (id.length > 0) {
// //                     dispatch({
// //                         type: actionTypes.HIDE_FUNDING_OPTION_CHART_PROJECT_SUCCESS,
// //                         response: spendingPercent
// //                     });
// //                 } else {
// //                     dispatch({
// //                         type: actionTypes.HIDE_FUNDING_OPTION_CHART_PROJECT_FAILURE,
// //                         error: spendingPercent
// //                     });
// //                 }
// //             } else {
// //                 dispatch({
// //                     type: actionTypes.HIDE_FUNDING_OPTION_CHART_PROJECT_FAILURE,
// //                     error: spendingPercent
// //                 });
// //             }
// //         } catch (e) {
// //             dispatch({
// //                 type: actionTypes.HIDE_FUNDING_OPTION_CHART_PROJECT_FAILURE,
// //                 error: spendingPercent
// //             });
// //         }
// //     };
// // };

// const saveDataEfciChartProject = projectId => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.SAVE_CHART_PROJECT_REQUEST });
//             const res = await Service.saveDataEfciChartProject(projectId);
//             if (res && res.status === 200) {
//                 const siteData = res.data;
//                 if (siteData.success) {
//                     dispatch({
//                         type: actionTypes.SAVE_CHART_PROJECT_SUCCESS,
//                         response: siteData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.SAVE_CHART_PROJECT_FAILURE,
//                         error: siteData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.SAVE_CHART_PROJECT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.SAVE_CHART_PROJECT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const loadChartDataProject = projectId => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.LOAD_EFCI_PROJECT_REQUEST });
//             const res = await Service.loadChartDataProject(projectId);
//             if (res && res.status === 200) {
//                 const siteData = res.data;
//                 if (siteData.success) {
//                     dispatch({
//                         type: actionTypes.LOAD_EFCI_PROJECT_SUCCESS,
//                         response: siteData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.LOAD_EFCI_PROJECT_FAILURE,
//                         error: siteData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.LOAD_EFCI_PROJECT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.LOAD_EFCI_PROJECT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// // const exportSiteProject = (params) => {
// //     return async dispatch => {
// //         try {
// //             await Service.exportSiteProject(params)
// //                 .then(response => {
// //                     if (response && response.status === 200) {
// //                         const regionData = response.data;
// //                         if (regionData.error) {
// //                             dispatch({ type: actionTypes.GET_SITE_EXPORT_SUCCESS, response: regionData });
// //                             return true;
// //                         }
// //                     }
// //                     const { data } = response;
// //                     const name = response.headers['content-disposition'].split('filename=');
// //                     const fileName = name[1].split('"')[1];
// //                     const downloadUrl = window.URL.createObjectURL(new Blob([data]));
// //                     const link = document.createElement('a');
// //                     link.href = downloadUrl;
// //                     link.setAttribute('download', `${fileName}`); //any other extension
// //                     document.body.appendChild(link);
// //                     link.click();
// //                     link.remove();
// //                 })
// //         } catch (e) {
// //         }
// //     };
// // };

// // const efciTabDataProject = (activeTab) => {
// //     return async dispatch => {
// //         try {
// //             dispatch({ type: actionTypes.ADD_EFCI_ACTIVE_TAB_PROJECT_REQUEST });
// //             dispatch({
// //                 type: actionTypes.ADD_EFCI_ACTIVE_TAB_PROJECT_SUCCESS,
// //                 response: activeTab
// //             });
// //         } catch (e) {
// //             dispatch({
// //                 type: actionTypes.ADD_EFCI_ACTIVE_TAB_PROJECT_FAILURE,
// //                 // error: e.response && e.response.data
// //             });
// //         }
// //     };
// // };

// const updateProjectCspSummaryData = (id, percentage) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_PROJECT_CSP_SUMMARY_REQUEST });
//             const res = await Service.updateProjectCspSummaryData(id, percentage);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.UPDATE_PROJECT_CSP_SUMMARY_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.UPDATE_PROJECT_CSP_SUMMARY_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_PROJECT_CSP_SUMMARY_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_PROJECT_CSP_SUMMARY_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getProjectCspSummaryDataLogs = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_PROJECT_CSP_SUMMARY_LOG_REQUEST });
//             const res = await Service.getProjectCspSummaryDataLogs(id, params);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_CSP_SUMMARY_LOG_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_CSP_SUMMARY_LOG_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_PROJECT_CSP_SUMMARY_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_PROJECT_CSP_SUMMARY_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const restoreProjectCspSummaryDataLogs = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_PROJECT_CSP_SUMMARY_LOG_REQUEST });
//             const res = await Service.restoreProjectCspSummaryDataLogs(id);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_CSP_SUMMARY_LOG_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_CSP_SUMMARY_LOG_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_PROJECT_CSP_SUMMARY_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_PROJECT_CSP_SUMMARY_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const updateProjectAnnualEfci = (id, value) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_PROJECT_ANNUAL_EFCI_REQUEST });
//             const res = await Service.updateProjectAnnualEfci(id, value);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.UPDATE_PROJECT_ANNUAL_EFCI_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.UPDATE_PROJECT_ANNUAL_EFCI_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_PROJECT_ANNUAL_EFCI_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_PROJECT_ANNUAL_EFCI_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const updateProjectAnnualFundingOption = (id, value) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_PROJECT_ANNUAL_EFCI_REQUEST });
//             const res = await Service.updateProjectAnnualFundingOption(id, value);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.UPDATE_PROJECT_ANNUAL_EFCI_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.UPDATE_PROJECT_ANNUAL_EFCI_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_PROJECT_ANNUAL_EFCI_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_PROJECT_ANNUAL_EFCI_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getProjectAnnualEfciLogs = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_PROJECT_ANNUAL_EFCI_LOG_REQUEST });
//             const res = await Service.getProjectAnnualEfciLogs(id, params);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_ANNUAL_EFCI_LOG_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_ANNUAL_EFCI_LOG_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_PROJECT_ANNUAL_EFCI_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_PROJECT_ANNUAL_EFCI_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const restoreProjectAnnualEfciLogs = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_PROJECT_ANNUAL_EFCI_LOG_REQUEST });
//             const res = await Service.restoreProjectAnnualEfciLogs(id);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_ANNUAL_EFCI_LOG_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_ANNUAL_EFCI_LOG_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_PROJECT_ANNUAL_EFCI_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_PROJECT_ANNUAL_EFCI_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getProjectAnnualFundingOptionLogs = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_PROJECT_ANNUAL_FUNDING_LOG_REQUEST });
//             const res = await Service.getProjectAnnualFundingOptionLogs(id, params);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_ANNUAL_FUNDING_LOG_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_ANNUAL_FUNDING_LOG_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_PROJECT_ANNUAL_FUNDING_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_PROJECT_ANNUAL_FUNDING_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const restoreProjectAnnualFundingOptionLogs = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_PROJECT_ANNUAL_FUNDING_LOG_REQUEST });
//             const res = await Service.restoreProjectAnnualFundingOptionLogs(id);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_ANNUAL_FUNDING_LOG_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_ANNUAL_FUNDING_LOG_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_PROJECT_ANNUAL_FUNDING_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_PROJECT_ANNUAL_FUNDING_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const updateProjectFundingCostEfci = (value, id) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_PROJECT_FUNDING_EFCI_REQUEST });
//             const res = await Service.updateProjectFundingCostEfci(value, id);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.UPDATE_PROJECT_FUNDING_EFCI_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.UPDATE_PROJECT_FUNDING_EFCI_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_PROJECT_FUNDING_EFCI_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_PROJECT_FUNDING_EFCI_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getProjectFundingCostEfciLogs = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_PROJECT_FUNDING_EFCI_LOG_REQUEST });
//             const res = await Service.getProjectFundingCostEfciLogs(id, params);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_FUNDING_EFCI_LOG_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_FUNDING_EFCI_LOG_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_PROJECT_FUNDING_EFCI_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_PROJECT_FUNDING_EFCI_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const restoreProjectFundingCostEfciLogs = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_PROJECT_FUNDING_EFCI_LOG_REQUEST });
//             const res = await Service.restoreProjectFundingCostEfciLogs(id, params);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_FUNDING_EFCI_LOG_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_FUNDING_EFCI_LOG_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_PROJECT_FUNDING_EFCI_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_PROJECT_FUNDING_EFCI_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const updateProjectFundingCost = (value, id) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_PROJECT_FUNDING_COST_REQUEST });
//             const res = await Service.updateProjectFundingCost(value, id);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.UPDATE_PROJECT_FUNDING_COST_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.UPDATE_PROJECT_FUNDING_COST_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_PROJECT_FUNDING_COST_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_PROJECT_FUNDING_COST_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getProjectFundingCostLogs = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_PROJECT_FUNDING_COST_LOG_REQUEST });
//             const res = await Service.getProjectFundingCostLogs(id, params);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_FUNDING_COST_LOG_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_FUNDING_COST_LOG_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_PROJECT_FUNDING_COST_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_PROJECT_FUNDING_COST_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const restoreProjectFundingCostLogs = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_PROJECT_FUNDING_COST_LOG_REQUEST });
//             const res = await Service.restoreProjectFundingCostLogs(id, params);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_FUNDING_COST_LOG_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_PROJECT_FUNDING_COST_LOG_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_PROJECT_FUNDING_COST_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_PROJECT_FUNDING_COST_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getAllClientUsers = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_ALL_CLIENT_USERS_REQUEST });
//             const res = await Service.getAllClientUsers({ client_id: id });
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.GET_ALL_CLIENT_USERS_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.GET_ALL_CLIENT_USERS_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_ALL_CLIENT_USERS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_ALL_CLIENT_USERS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const lockProject = (id, lock) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.LOCK_PROJECT_REQUEST });
//             const res = await Service.lockProject(id, lock);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.LOCK_PROJECT_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.LOCK_PROJECT_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.LOCK_PROJECT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.LOCK_PROJECT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const lockProjectSandbox = (id, lock) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.LOCK_PROJECT_REQUEST });
//             const res = await Service.lockProjectSandbox(id, lock);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.LOCK_PROJECT_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.LOCK_PROJECT_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.LOCK_PROJECT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.LOCK_PROJECT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getAllConsultanciesDropdown = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_ALL_CONSULTANCIES_DROPDOWN_REQUEST });
//             const res = await Service.getAllConsultanciesDropdown({ consultancy_id: id });
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.GET_ALL_CONSULTANCIES_DROPDOWN_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.GET_ALL_CONSULTANCIES_DROPDOWN_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_ALL_CONSULTANCIES_DROPDOWN_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_ALL_CONSULTANCIES_DROPDOWN_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };
// const forceUpdateProjectFundingCostEfci = params => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_PROJECT_FUNDING_EFCI_REQUEST });
//             const res = await Service.forceUpdateProjectFundingCostEfci(params);

//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({
//                         type: actionTypes.UPDATE_PROJECT_FUNDING_EFCI_SUCCESS,
//                         response: regionData
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.UPDATE_PROJECT_FUNDING_EFCI_FAILURE,
//                         error: regionData
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_PROJECT_FUNDING_EFCI_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_PROJECT_FUNDING_EFCI_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const hideFundingOptionChart = id => {
//     let spendingPercent = id;
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.HIDE_FUNDING_OPTION_CHART_REQUEST });
//             if (id.length >= 0) {
//                 if (id.length > 0) {
//                     dispatch({
//                         type: actionTypes.HIDE_FUNDING_OPTION_CHART_SUCCESS,
//                         response: spendingPercent
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.HIDE_FUNDING_OPTION_CHART_FAILURE,
//                         error: spendingPercent
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.HIDE_FUNDING_OPTION_CHART_FAILURE,
//                     error: spendingPercent
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.HIDE_FUNDING_OPTION_CHART_FAILURE,
//                 error: spendingPercent
//             });
//         }
//     };
// };

// const hideFundingOption = id => {
//     let spendingPercent = id;
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.HIDE_FUNDING_OPTION_REQUEST });
//             if (id.length >= 0) {
//                 if (id.length > 0) {
//                     dispatch({
//                         type: actionTypes.HIDE_FUNDING_OPTION_SUCCESS,
//                         response: spendingPercent
//                     });
//                 } else {
//                     dispatch({
//                         type: actionTypes.HIDE_FUNDING_OPTION_FAILURE,
//                         error: spendingPercent
//                     });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.HIDE_FUNDING_OPTION_FAILURE,
//                     error: spendingPercent
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.HIDE_FUNDING_OPTION_FAILURE,
//                 error: spendingPercent
//             });
//         }
//     };
// };

// const getColorCodeLogs = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_COLOR_CODE_LOG_REQUEST });
//             const res = await Service.getColorCodeLogs(id, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.GET_COLOR_CODE_LOG_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.GET_COLOR_CODE_LOG_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_COLOR_CODE_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_COLOR_CODE_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const copyGlobalReportTemplates = body => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.COPY_REPORT_TEMPLATE_REQUEST });
//             const res = await Service.copyGlobalReportTemplates(body);
//             if (res && (res.status === 200 || res.status === 201)) {
//                 const resData = res.data;
//                 dispatch({ type: actionTypes.COPY_REPORT_TEMPLATE_SUCCESS, response: resData });
//             } else {
//                 dispatch({
//                     type: actionTypes.COPY_REPORT_TEMPLATE_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.COPY_REPORT_TEMPLATE_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const addUserActivityLog = text => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.ADD_USER_ACTIVITY_LOG_REQUEST });
//             const res = await Service.addUserActivityLog(text);
//             if (res && (res.status === 200 || res.status === 201)) {
//                 const resData = res.data;
//                 dispatch({ type: actionTypes.ADD_USER_ACTIVITY_LOG_SUCCESS, response: resData });
//             } else {
//                 dispatch({
//                     type: actionTypes.ADD_USER_ACTIVITY_LOG_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.ADD_USER_ACTIVITY_LOG_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const getMiscSettings = id => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_MISC_SETTINGS_REQUEST });
//             const res = await Service.getMiscSettings(id);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.GET_MISC_SETTINGS_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.GET_MISC_SETTINGS_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_MISC_SETTINGS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_MISC_SETTINGS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };
// const updateMiscSettings = (id, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_MISC_SETTINGS_REQUEST });
//             const res = await Service.updateMiscSettings(id, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.UPDATE_MISC_SETTINGS_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.UPDATE_MISC_SETTINGS_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_MISC_SETTINGS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_MISC_SETTINGS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };
// const updateDisplayOrder = (entity, projectId, params) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.UPDATE_DISPLAY_ORDER_REQUEST });
//             const res = await Service.updateDisplayOrder(entity, projectId, params);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.UPDATE_DISPLAY_ORDER_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.UPDATE_DISPLAY_ORDER_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.UPDATE_DISPLAY_ORDER_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.UPDATE_DISPLAY_ORDER_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };
// const initializeSpecialReport = projectId => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.INITIALIZE_SPECIAL_REPORT_REQUEST });
//             const res = await Service.initializeSpecialReport(projectId);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.INITIALIZE_SPECIAL_REPORT_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.INITIALIZE_SPECIAL_REPORT_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.INITIALIZE_SPECIAL_REPORT_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.INITIALIZE_SPECIAL_REPORT_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

export default {
    getClientDetails,
    getClientById,
    getAllReadings,
    updateProjectEntityParams,
    getAllRegions,
    getRegionById,
    updateRegionEntityParams,
    updateElectricEntityParams

    // addProject,
    // updateProject,
    // deleteProject,
    // getRegionsBasedOnClient,
    // getAllConsultancyUsers,
    // getAllClients,
    // getProjectById,
    // getBuildingTypeSettingsData,
    // updateBuildingTypeSettings,
    // uploadProjectImage,
    // getAllProjectImages,
    // deleteProjectImage,
    // parseFca,
    // getTradeSettingsData,
    // addTrade,
    // getTradeById,
    // updateTrade,
    // deleteTrade,
    // getCategorySettingsData,
    // addCategory,
    // getCategoryById,
    // updateCategory,
    // deleteCategory,
    // getFutureCapitalBySite,
    // getDifferedMaintenanceBySite,
    // updateProjectEntityParams,
    // getListForCommonFilterproject,
    // getSystemSettingsData,
    // addSystem,
    // getSystemById,
    // updateSystem,
    // deleteSystem,
    // getSubsystemSettingsData,
    // addSubsystem,
    // getSubsystemById,
    // updateSubsystem,
    // deleteSubsystem,
    // getDepartmentSettingsData,
    // addDepartment,
    // getDepartmentById,
    // updateDepartment,
    // deleteDepartment,
    // addLimit,
    // getaddLimit,
    // getGeneralById,
    // updateGeneral,
    // deleteGeneral,
    // getTradeSettingsDropdown,
    // getSystemSettingsDropdown,
    // exportProject,
    // getColorCodes,
    // addColorCode,
    // updateColorCode,
    // deleteColorCode,
    // getAllProjectLogs,
    // restoreProjectLog,
    // deleteProjectLog,
    // getChartByProject,
    // getProjectImportHistory,
    // deleteProjectHistory,
    // exportImportProject,
    // getEfciByProject,

    // getChartExportProject,
    // getAllSiteByChartProjectLogs,
    // restoreSiteByChartProjectLog,
    // deleteSiteByChartProjectLog,
    // // getAnnualEfciByChartProjectLogs,
    // // getAnnualFundingCalculationByChartProjectLogs,
    // restoreAnnualByChartEFCIProject,
    // restoreAnnualFundingByChartCalculationProject,
    // getFundingOptionByChartProjectLog,
    // restoreFundingOptionByChartProjectLogs,
    // getFundingSiteEfciByChartProjectLog,
    // restoreFundingEfciByChartProjectLogs,
    // getTotalFundingByChartProjectLog,
    // restoreFundingTotalByChartProjectLogs,
    // // getCapitalSpendingPlanByChartProjectLogs,
    // restoreCapitalSpendingPlanByChartProjectLogs,
    // deleteEFCIByChartProjectLog,
    // updateProjectCspSummaryData,
    // updateProjectAnnualEfci,
    // updateProjectFundingCostEfci,
    // updateProjectFundingCost,
    // updateProjectAnnualFundingOption,
    // getChartEfciProject,
    // // updateCapitalSpendingPlanChartProject,
    // // updateFundingOptionChartProject,
    // // updateAnnualEfciChartProject,
    // // updateAnnualFundingChartProject,
    // // updateFundingSiteEfciChartProject,
    // // hideFundingOptionChartProject,
    // saveDataEfciChartProject,
    // loadChartDataProject,
    // // exportSiteProject,
    // // efciTabDataProject,

    // getProjectAnnualFundingOptionLogs,
    // getProjectFundingCostEfciLogs,
    // getProjectFundingCostLogs,
    // getProjectAnnualEfciLogs,
    // getProjectCspSummaryDataLogs,

    // restoreProjectAnnualFundingOptionLogs,
    // restoreProjectFundingCostEfciLogs,
    // restoreProjectFundingCostLogs,
    // restoreProjectAnnualEfciLogs,
    // restoreProjectCspSummaryDataLogs,

    // getAllClientUsers,

    // lockProject,
    // lockProjectSandbox,
    // getAllConsultanciesDropdown,
    // forceUpdateProjectFundingCostEfci,
    // hideFundingOption,
    // hideFundingOptionChart,
    // getColorCodeLogs,
    // copyGlobalReportTemplates,
    // addUserActivityLog,
    // getMiscSettings,
    // updateMiscSettings,
    // updateDisplayOrder,
    // initializeSpecialReport
};
