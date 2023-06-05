import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getChartsAndGraphs = (params, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.get(`${serviceEndpoints.chartsAndGraphsEndPoints.getChartsAndGraphs}${dynamicUrl}${spReportEntityData || ""}`, { params });
};
export const addChartsAndGraphs = (params, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.post(`${serviceEndpoints.chartsAndGraphsEndPoints.addChartsAndGraphs}${dynamicUrl}${spReportEntityData || ""}`, params);
};
export const getChartsAndGraphsById = (chartsAndGraphs_id, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.get(
        `${serviceEndpoints.chartsAndGraphsEndPoints.getChartsAndGraphsById}${dynamicUrl}/${chartsAndGraphs_id}${spReportEntityData || ""}`
    );
};
export const updateChartsAndGraphs = (chartsAndGraphs_id, params, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.patch(
        `${serviceEndpoints.chartsAndGraphsEndPoints.updateChartsAndGraphs}${dynamicUrl}/${chartsAndGraphs_id}${spReportEntityData || ""}`,
        params
    );
};
export const deleteChartsAndGraphs = (chartsAndGraphs_id, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.delete(
        `${serviceEndpoints.chartsAndGraphsEndPoints.deleteChartsAndGraphs}${dynamicUrl}/${chartsAndGraphs_id}${spReportEntityData || ""}`
    );
};
export const getListForCommonFilter = (params, url) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length
        ? localStorage.getItem("dynamicUrl").split("_")[0]
        : `/charts_and_graphs/get_list`;
    if (dynamicUrl === "/charts") {
        dynamicUrl = `/charts_and_graphs/get_list`;
    } else {
        dynamicUrl = `${dynamicUrl}_charts_and_graphs/get_list${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.chartsAndGraphsEndPoints.getListForCommonFilter}${dynamicUrl}`, {
        params
    });
};
export const exportChartsAndGraphs = (url, params) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length
        ? localStorage.getItem("dynamicUrl").split("_")[0]
        : `/charts_and_graphs/export_xl`;
    if (dynamicUrl === "/charts") {
        dynamicUrl = `/charts_and_graphs/export_xl`;
    } else {
        dynamicUrl = `${dynamicUrl}_charts_and_graphs/export_xl${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.chartsAndGraphsEndPoints.exportChartsAndGraphs}${dynamicUrl}`, {
        method: "GET",
        responseType: "blob",
        params
    });
};
export const getAllChartsAndGraphsLogs = (id, params) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length
        ? localStorage.getItem("dynamicUrl").split("_")[0]
        : `/charts_and_graphs/${id}/logs`;
    if (dynamicUrl === "/charts") {
        dynamicUrl = `/charts_and_graphs/${id}/logs`;
    } else {
        dynamicUrl = `${dynamicUrl}_charts_and_graphs/${id}/logs${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.chartsAndGraphsEndPoints.getAllChartsAndGraphsLogs}${dynamicUrl}`, { params });
};
export const restoreChartsAndGraphsLog = id =>
    fcaGateWay.patch(`${serviceEndpoints.chartsAndGraphsEndPoints.restoreChartsAndGraphsLog}/${id}/restore`);
export const deleteChartsAndGraphsLog = id => fcaGateWay.delete(`${serviceEndpoints.chartsAndGraphsEndPoints.deleteChartsAndGraphsLog}/${id}`);
