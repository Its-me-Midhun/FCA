import * as actionTypes from "./constants";
import * as Service from "./services";
const getAllExportHeading = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_ALL_HEADING_REQUEST });
            const res = await Service.getAllExportHeading(params);
            if (res && res.status === 200) {
                const regionData = res.data;
                dispatch({ type: actionTypes.GET_ALL_HEADING_SUCCESS, response: regionData });
            } else {
                dispatch({
                    type: actionTypes.GET_ALL_HEADING_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_ALL_HEADING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const updateExportHeading = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.UPDATE_HEADING_REQUEST });
            const res = await Service.updateExportHeading(params, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                if (regionData.success) {
                    dispatch({ type: actionTypes.UPDATE_HEADING_SUCCESS, response: regionData });
                } else {
                    dispatch({ type: actionTypes.UPDATE_HEADING_FAILURE, error: regionData });
                }
            } else {
                dispatch({
                    type: actionTypes.UPDATE_HEADING_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_HEADING_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const updateHeadingEntityParams = entityParams => {
    return async dispatch => {
        try {
            if (entityParams) {
                dispatch({
                    type: actionTypes.UPDATE_HEADING_ENTITY_PARAMS_SUCCESS,
                    response: entityParams
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.UPDATE_HEADING_ENTITY_PARAMS_FAILURE,
                error: entityParams
            });
        }
    };
};
const getHeadingDataById = (params, id) => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_HEADING_DATA_BY_ID_REQUEST });
            const res = await Service.getHeadingDataById(params, id);
            if (res && res.status === 200) {
                const regionData = res.data;
                dispatch({ type: actionTypes.GET_HEADING_DATA_BY_ID_SUCCESS, response: regionData });
            } else {
                dispatch({
                    type: actionTypes.GET_HEADING_DATA_BY_ID_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_HEADING_DATA_BY_ID_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const exportHeadings = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_HEADING_EXPORT_REQUEST });
            const response = await Service.exportHeadings(params);
            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.GET_HEADING_EXPORT_FAILURE, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.GET_HEADING_EXPORT_SUCCESS, response: {} });
                }
            }
            const { data } = response;
            const name = response.headers["content-disposition"].split("filename=");
            const fileName = name[1];
            let blob = new Blob([data]);
            let url = window.URL || window.webkitURL;
            let downloadUrl = url.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", `${fileName}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            dispatch({
                type: actionTypes.GET_HEADING_EXPORT_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};

export default {
    getAllExportHeading,
    updateExportHeading,
    updateHeadingEntityParams,
    getHeadingDataById,
    exportHeadings
};
