import * as actionTypes from "./constants";
import * as Service from "./services";

const getMeterList = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_METER_LIST_REQUEST });
            const res = await Service.getMeterList(params);
            if (res && res.status === 200) {
                const meterTemplateData = res.data;
                if (meterTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_METER_LIST_SUCCESS,
                        response: meterTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_METER_LIST_FAILURE,
                        error: meterTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_METER_LIST_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_METER_LIST_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getMeterTemplateById = narrativeTemplate_id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_METER_TEMPLATE_BY_ID_REQUEST });
            const res = await Service.getMeterTemplateById(narrativeTemplate_id);
            if (res && res.status === 200) {
                const meterTemplateData = res.data;
                if (meterTemplateData.success) {
                    dispatch({ type: actionTypes.GET_METER_TEMPLATE_BY_ID_SUCCESS, response: meterTemplateData });
                } else {
                    dispatch({ type: actionTypes.GET_METER_TEMPLATE_BY_ID_FAILURE, error: meterTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_METER_TEMPLATE_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_METER_TEMPLATE_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getMeterRegionList = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_METER_REGION_REQUEST });
            const res = await Service.getMeterRegion(id);
            if (res && res.status === 200) {
                const meterTemplateData = res.data;
                if (meterTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_METER_REGION_SUCCESS,
                        response: meterTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_METER_REGION_FAILURE,
                        error: meterTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_METER_REGION_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_METER_REGION_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getMeterSiteList = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_METER_SITE_REQUEST });
            const res = await Service.getMeterSite(id, params);
            if (res && res.status === 200) {
                const meterTemplateData = res.data;
                if (meterTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_METER_SITE_SUCCESS,
                        response: meterTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_METER_SITE_FAILURE,
                        error: meterTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_METER_SITE_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_METER_SITE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getMeterBuildingList = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_METER_BUILDING_REQUEST });
            const res = await Service.getMeterBuilding(id, params);
            if (res && res.status === 200) {
                const meterTemplateData = res.data;
                if (meterTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_METER_BUILDING_SUCCESS,
                        response: meterTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_METER_BUILDING_FAILURE,
                        error: meterTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_METER_BUILDING_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_METER_BUILDING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getMeterAccounts = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_METER_ACCOUNTS_REQUEST });
            const res = await Service.getMeterAccounts(params);
            if (res && res.status === 200) {
                const meterTemplateData = res.data;
                if (meterTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_METER_ACCOUNTS_SUCCESS,
                        response: meterTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_METER_ACCOUNTS_FAILURE,
                        error: meterTemplateData
                    });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_METER_ACCOUNTS_FAILURE,
                    error: res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_METER_ACCOUNTS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const addMeterTemplate = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.ADD_METER_TEMPLATE_REQUEST });
            const res = await Service.addMeterTemplate(params);

            if (res && res.status === 200) {
                const meterTemplateData = res.data;

                if (meterTemplateData.success) {
                    dispatch({ type: actionTypes.ADD_METER_TEMPLATE_SUCCESS, response: meterTemplateData });
                } else {
                    dispatch({ type: actionTypes.ADD_METER_TEMPLATE_FAILURE, error: meterTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.ADD_METER_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.ADD_METER_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateMeterTemplate = (meterTemplate_id, payload) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_METER_TEMPLATE_REQUEST });
            const res = await Service.updateMeterTemplate(meterTemplate_id, payload);
            if (res && (res.status === 200 || res.status === 201)) {
                const meterTemplateData = res.data;
                if (meterTemplateData.success) {
                    dispatch({ type: actionTypes.UPDATE_METER_TEMPLATE_SUCCESS, response: meterTemplateData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_METER_TEMPLATE_FAILURE, error: meterTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_METER_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_METER_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteMeterTemplate = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_METER_TEMPLATE_REQUEST });
            const res = await Service.deleteMeterTemplate(id);
            if (res && res.status === 200) {
                const narrativeTemplateData = res.data;
                if (narrativeTemplateData.success) {
                    dispatch({ type: actionTypes.DELETE_METER_TEMPLATE_SUCCESS, response: narrativeTemplateData });
                } else {
                    dispatch({ type: actionTypes.DELETE_METER_TEMPLATE_FAILURE, error: narrativeTemplateData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_METER_TEMPLATE_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_METER_TEMPLATE_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const exportNarrativeTemplates = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_NARRATIVE_TEMPLATE_EXPORT_REQUEST });
            const response = await Service.exportNarrativeTemplates(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_NARRATIVE_TEMPLATE_EXPORT_SUCCESS, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_NARRATIVE_TEMPLATE_EXPORT_SUCCESS, response: {} });
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

const getAllReadings = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_METER_READINGS_ELECTRIC_REQUEST });
            const res = await Service.getAllMeterReadings(params);
            if (res && res.status === 200) {
                const readingData = res.data;
                if (readingData.success) {
                    dispatch({ type: actionTypes.GET_ALL_METER_READINGS_ELECTRIC_SUCCESS, response: readingData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_METER_READINGS_ELECTRIC_FAILURE, error: readingData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_METER_READINGS_ELECTRIC_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_METER_READINGS_ELECTRIC_FAILURE,
                error: e.response && e.response.data
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
                const narrativeTemplateData = res.data;
                if (narrativeTemplateData.success) {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_SUCCESS,
                        response: narrativeTemplateData
                    });
                } else {
                    dispatch({
                        type: actionTypes.GET_LIST_FOR_COMMON_FILTER_FAILURE,
                        error: narrativeTemplateData
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

const getSiteById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SITE_BY_ID_REQUEST });
            const res = await Service.getSiteById(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_SITE_BY_ID_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_SITE_BY_ID_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SITE_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SITE_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const getBuildingById = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_BUILDING_BY_ID_REQUEST });
            const res = await Service.getBuildingById(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({
                        type: actionTypes.GET_BUILDING_BY_ID_SUCCESS,
                        response: regionData
                    });
                } else {
                    dispatch({ type: actionTypes.GET_BUILDING_BY_ID_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_BUILDING_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_BUILDING_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const updateNarrativeTemplateEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_NARRATIVE_TEMPLATE_ENTITY_PARAMS_SUCCESS_ELECTRIC,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_NARRATIVE_TEMPLATE_ENTITY_PARAMS_FAILURE_ELECTRIC,
                error: entityParams
            });
        }
    };
};

const getAllNarrativeTemplateLogs = (id, params) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_NARRATIVE_TEMPLATE_LOG_REQUEST });
            const res = await Service.getAllNarrativeTemplateLogs(id, params);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.GET_ALL_NARRATIVE_TEMPLATE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.GET_ALL_NARRATIVE_TEMPLATE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_NARRATIVE_TEMPLATE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_NARRATIVE_TEMPLATE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const restoreNarrativeTemplateLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.RESTORE_NARRATIVE_TEMPLATE_LOG_REQUEST });
            const res = await Service.restoreNarrativeTemplateLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.RESTORE_NARRATIVE_TEMPLATE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.RESTORE_NARRATIVE_TEMPLATE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.RESTORE_NARRATIVE_TEMPLATE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.RESTORE_NARRATIVE_TEMPLATE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

const deleteNarrativeTemplateLog = id => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.DELETE_NARRATIVE_TEMPLATE_LOG_REQUEST });
            const res = await Service.deleteNarrativeTemplateLog(id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.DELETE_NARRATIVE_TEMPLATE_LOG_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.DELETE_NARRATIVE_TEMPLATE_LOG_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.DELETE_NARRATIVE_TEMPLATE_LOG_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_NARRATIVE_TEMPLATE_LOG_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

// const getAssignModalDetails = (id, type) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.GET_ASSIGN_MODAL_DETAILS_REQUEST });
//             const res = await Service.getAssignModalDetails(id, type);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.GET_ASSIGN_MODAL_DETAILS_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.GET_ASSIGN_MODAL_DETAILS_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.GET_ASSIGN_MODAL_DETAILS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.GET_ASSIGN_MODAL_DETAILS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

// const assignItems = (id, params, type) => {
//     return async dispatch => {
//         try {
//             dispatch({ type: actionTypes.ASSIGN_ITEMS_REQUEST });
//             const res = await Service.assignItems(id, params, type);
//             if (res && res.status === 200) {
//                 const regionData = res.data;
//                 if (regionData.success) {
//                     dispatch({ type: actionTypes.ASSIGN_ITEMS_SUCCESS, response: regionData });
//                 } else {
//                     dispatch({ type: actionTypes.ASSIGN_ITEMS_FAILURE, error: regionData });
//                 }
//             } else {
//                 dispatch({
//                     type: actionTypes.ASSIGN_ITEMS_FAILURE,
//                     error: res.response && res.response.data
//                 });
//             }
//         } catch (e) {
//             dispatch({
//                 type: actionTypes.ASSIGN_ITEMS_FAILURE,
//                 error: e.response && e.response.data
//             });
//         }
//     };
// };

export default {
    getMeterList,
    getMeterAccounts,
    getMeterRegionList,
    getMeterBuildingList,
    addMeterTemplate,
    updateMeterTemplate,
    deleteMeterTemplate,
    exportNarrativeTemplates,
    getAllReadings,
    getListForCommonFilter,
    getMeterSiteList,
    getMeterTemplateById,
    getSiteById,
    getBuildingById,
    updateNarrativeTemplateEntityParams,
    getAllNarrativeTemplateLogs,
    // addNarrativeTemplate,
    // updateNarrativeTemplate,
    // deleteNarrativeTemplate,
    // getNarrativeTemplateById,
    // updateNarrativeTemplateEntityParams,
    // getListForCommonFilter,
    // exportNarrativeTemplates,
    // getAllNarrativeTemplateLogs,
    restoreNarrativeTemplateLog,
    deleteNarrativeTemplateLog
    // getAssignModalDetails,
    // assignItems
};
