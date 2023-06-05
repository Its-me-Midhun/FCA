import * as actionTypes from "./constants";
import * as Service from "./services";

const getSoftCostsData = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.GET_SOFT_COSTS_REQUEST });
            const res = await Service.getSoftCostsData(params);
            if (res && res.status === 200) {
                const capitalTypeData = res.data;
                if (capitalTypeData.success) {
                    dispatch({ type: actionTypes.GET_SOFT_COSTS_SUCCESS, response: capitalTypeData });
                } else {
                    dispatch({ type: actionTypes.GET_SOFT_COSTS_FAILURE, error: capitalTypeData });
                }
            } else {
                dispatch({
                    type: actionTypes.GET_SOFT_COSTS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.GET_SOFT_COSTS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const saveSoftCostsData = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.SAVE_SOFT_COSTS_REQUEST });
            const res = await Service.saveSoftCostsData(params);
            if (res && res.status === 200) {
                const capitalTypeData = res.data;
                if (capitalTypeData.success) {
                    dispatch({ type: actionTypes.SAVE_SOFT_COSTS_SUCCESS, response: capitalTypeData });
                } else {
                    dispatch({ type: actionTypes.SAVE_SOFT_COSTS_FAILURE, error: capitalTypeData });
                }
            } else {
                dispatch({
                    type: actionTypes.SAVE_SOFT_COSTS_FAILURE,
                    error: res.response && res.response.data
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.SAVE_SOFT_COSTS_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
const exportExcel = params => {
    return async dispatch => {
        try {
            dispatch({ type: actionTypes.EXPORT_EXCEL_REQUEST });
            const response = await Service.exportExcel(params);

            if (response && response.data) {
                const text = await new Response(response.data).text();
                if (text && text.split('"')[1] === "error") {
                    dispatch({ type: actionTypes.EXPORT_EXCEL_FAILURE, response: { error: text.split('"')[3] } });
                    return true;
                } else {
                    dispatch({ type: actionTypes.EXPORT_EXCEL_SUCCESS, response: {} });
                }
            }
            const { data } = response;
            const name = response.headers["content-disposition"].split("filename=");
            const fileName = name[1].split('"')[1];
            let blob = new Blob([data]);
            let url = window.URL || window.webkitURL;
            let downloadUrl = url.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", `${fileName}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            // if (res && res.status === 200) {
            //     dispatch({ type: actionTypes.EXPORT_EXCEL_SUCCESS, response: res });
            // } else {
            //     dispatch({
            //         type: actionTypes.EXPORT_EXCEL_FAILURE,
            //         error: res.response && res.response.data
            //     });
            // }
        } catch (e) {
            dispatch({
                type: actionTypes.EXPORT_EXCEL_FAILURE,
                error: e.response && e.response.data
            });
        }
    };
};
export default {
    getSoftCostsData,
    saveSoftCostsData,
    exportExcel
};
