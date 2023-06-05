import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getSystemTables = (params, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.get(`${serviceEndpoints.systemTablesEndPoints.getSystemTables}${dynamicUrl}${spReportEntityData || ""}`, { params });
};
export const addSystemTables = (params, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.post(`${serviceEndpoints.systemTablesEndPoints.addSystemTables}${dynamicUrl}${spReportEntityData || ""}`, params);
};
export const getSystemTablesById = (systemTables_id, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.get(`${serviceEndpoints.systemTablesEndPoints.getSystemTablesById}${dynamicUrl}/${systemTables_id}${spReportEntityData || ""}`);
};
export const updateSystemTables = (systemTables_id, params, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.patch(
        `${serviceEndpoints.systemTablesEndPoints.updateSystemTables}${dynamicUrl}/${systemTables_id}${spReportEntityData || ""}`,
        params
    );
};
export const deleteSystemTables = (systemTables_id, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.delete(
        `${serviceEndpoints.systemTablesEndPoints.deleteSystemTables}${dynamicUrl}/${systemTables_id}${spReportEntityData || ""}`
    );
};
export const getListForCommonFilter = (params, url) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length
        ? localStorage.getItem("dynamicUrl").split("_")[0]
        : `/system_tables/get_list`;
    if (dynamicUrl === "/charts") {
        dynamicUrl = `/system_tables/get_list`;
    } else {
        dynamicUrl = `${dynamicUrl}_system_tables/get_list${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.systemTablesEndPoints.getListForCommonFilter}${dynamicUrl}`, {
        params
    });
};
export const exportSystemTables = (url, params) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length
        ? localStorage.getItem("dynamicUrl").split("_")[0]
        : `/system_tables/export_xl`;
    if (dynamicUrl === "/charts") {
        dynamicUrl = `/system_tables/export_xl`;
    } else {
        dynamicUrl = `${dynamicUrl}_system_tables/export_xl${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.systemTablesEndPoints.exportSystemTables}${dynamicUrl}`, {
        method: "GET",
        responseType: "blob",
        params
    });
};
export const getAllSystemTablesLogs = (id, params) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length
        ? localStorage.getItem("dynamicUrl").split("_")[0]
        : `/system_tables/${id}/logs`;
    if (dynamicUrl === "/charts") {
        dynamicUrl = `/system_tables/${id}/logs`;
    } else {
        dynamicUrl = `${dynamicUrl}_system_tables/${id}/logs${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.systemTablesEndPoints.getAllSystemTablesLogs}${dynamicUrl}`, { params });
};
export const restoreSystemTablesLog = id => fcaGateWay.patch(`${serviceEndpoints.systemTablesEndPoints.restoreSystemTablesLog}/${id}/restore`);
export const deleteSystemTablesLog = id => fcaGateWay.delete(`${serviceEndpoints.systemTablesEndPoints.deleteSystemTablesLog}/${id}`);
