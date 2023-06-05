import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getChildParagraphs = (params, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.get(`${serviceEndpoints.childParagraphEndPoints.getChildParagraphs}${dynamicUrl}${spReportEntityData || ""}`, { params });
};
export const addChildParagraph = (params, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.post(`${serviceEndpoints.childParagraphEndPoints.addChildParagraph}${dynamicUrl}${spReportEntityData || ""}`, params);
};
export const getChildParagraphById = (childParagraph_id, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.get(
        `${serviceEndpoints.childParagraphEndPoints.getChildParagraphById}${dynamicUrl}/${childParagraph_id}${spReportEntityData || ""}`
    );
};
export const updateChildParagraph = (childParagraph_id, params, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.patch(
        `${serviceEndpoints.childParagraphEndPoints.updateChildParagraph}${dynamicUrl}/${childParagraph_id}${spReportEntityData || ""}`,
        params
    );
};
export const deleteChildParagraph = (childParagraph_id, dynamicUrl) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    return fcaGateWay.delete(
        `${serviceEndpoints.childParagraphEndPoints.deleteChildParagraph}${dynamicUrl}/${childParagraph_id}${spReportEntityData || ""}`
    );
};
export const getListForCommonFilter = params => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length
        ? localStorage.getItem("dynamicUrl").split("_")[0]
        : "/child_paragraphs/get_list";
    if (dynamicUrl === "/child") {
        dynamicUrl = `/child_paragraphs/get_list`;
    } else {
        dynamicUrl = `${dynamicUrl}_child_paragraphs/get_list${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.childParagraphEndPoints.getListForCommonFilter}${dynamicUrl}`, {
        params
    });
};
export const exportChildParagraphs = (url, params) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length
        ? localStorage.getItem("dynamicUrl").split("_")[0]
        : "/child_paragraphs/export_xl";
    if (dynamicUrl === "/child") {
        dynamicUrl = `/child_paragraphs/export_xl`;
    } else {
        dynamicUrl = `${dynamicUrl}_child_paragraphs/export_xl${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.childParagraphEndPoints.exportChildParagraph}${dynamicUrl}`, {
        method: "GET",
        responseType: "blob",
        params
    });
};
export const getAllChildParagraphLogs = (id, params) => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");
    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length
        ? localStorage.getItem("dynamicUrl").split("_")[0]
        : `/child_paragraphs/${id}/logs`;
    if (dynamicUrl === "/child") {
        dynamicUrl = `/child_paragraphs/${id}/logs`;
    } else {
        dynamicUrl = `${dynamicUrl}_child_paragraphs/${id}/logs${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.childParagraphEndPoints.getAllChildParagraphLogs}${dynamicUrl}`, { params });
};
export const restoreChildParagraphLog = id => fcaGateWay.patch(`${serviceEndpoints.childParagraphEndPoints.restoreChildParagraphLog}/${id}/restore`);
export const deleteChildParagraphLog = id => fcaGateWay.delete(`${serviceEndpoints.childParagraphEndPoints.deleteChildParagraphLog}/${id}`);
export const getSpecialReportsDropdown = () => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");

    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length ? localStorage.getItem("dynamicUrl").split("_")[0] : "/special_reports";
    if (dynamicUrl === "/child") {
        dynamicUrl = `/special_reports/dropdown`;
    } else {
        dynamicUrl = dynamicUrl + `_special_reports/dropdown${spReportEntityData || ""}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.childParagraphEndPoints.getSpecialReportsDropdown}${dynamicUrl}`);
};
export const getReportParagraphsDropdown = id => {
    let spReportEntityData = localStorage.getItem("spReportEntityData");

    let dynamicUrl = localStorage.getItem("dynamicUrl").split("_").length ? localStorage.getItem("dynamicUrl").split("_")[0] : "/report_paragraphs";
    if (dynamicUrl === "/child") {
        dynamicUrl = `/report_paragraphs/dropdown?special_report_id=${id}`;
    } else {
        dynamicUrl =
            dynamicUrl +
            `_report_paragraphs/dropdown${spReportEntityData ? `${spReportEntityData}&special_report_id=${id}` : `?special_report_id=${id}`}`;
    }
    return fcaGateWay.get(`${serviceEndpoints.childParagraphEndPoints.getReportParagraphsDropdown}${dynamicUrl}`);
};
