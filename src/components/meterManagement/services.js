import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

// Get
export const getMeterList = params => fcaGateWay.get(`${serviceEndpoints.meterEndponts?.getMeterTemplates}/energy_management/meters`, { params });
export const getMeterClients = params => {
    if (params) {
        return fcaGateWay.get(`${serviceEndpoints.meterEndponts?.getMeterDropDowns}/client_dropdown`, { params });
    }
    return fcaGateWay.get(`${serviceEndpoints.meterEndponts?.getMeterDropDowns}/client_dropdown`);
};
export const getMeterRegion = id => fcaGateWay.get(`${serviceEndpoints.meterEndponts?.getMeterDropDowns}/${id}/region_dropdown`);
export const getMeterSite = (id, params) => fcaGateWay.get(`${serviceEndpoints.meterEndponts?.getMeterDropDowns}/${id}/site_dropdown`, { params });

export const getMeterBuilding = (id, params) =>
    fcaGateWay.get(`${serviceEndpoints.meterEndponts?.getMeterDropDowns}/${id}/building_dropdown`, { params });

export const getMeterAccounts = params => fcaGateWay.get(`${serviceEndpoints.meterEndponts?.getAccountDetails}/accounts_dropdown`, { params });

export const addMeterTemplate = payload => fcaGateWay.post(`${serviceEndpoints.meterEndponts?.getMeterTemplates}/energy_management/meters`, payload);

export const getMeterTemplateById = meterTemplate_id => fcaGateWay.get(`${serviceEndpoints.meterEndponts.getMeterDetailsId}/${meterTemplate_id}`);

export const updateMeterTemplate = (meterTemplate_id, params) =>
    fcaGateWay.patch(`${serviceEndpoints.meterEndponts.updateMeterDetailsId}/${meterTemplate_id}`, params);
export const deleteMeterTemplate = meterTemplate_id =>
    fcaGateWay.delete(`${serviceEndpoints.meterEndponts.deleteMeterDetailsId}/${meterTemplate_id}`);
export const getListForCommonFilter = params =>
    fcaGateWay.get(`${serviceEndpoints.narrativeTemplateEndPoints.getListForCommonFilter}/energy_management/meters/get_list`, {
        params
    });
export const exportNarrativeTemplates = params =>
    fcaGateWay.get(`${serviceEndpoints.narrativeTemplateEndPoints.exportNarrativeTemplate}/energy_management/meters/export_xl`, {
        method: "GET",
        responseType: "blob",
        params
    });
export const getAllNarrativeTemplateLogs = (id, params) => {
    // let dynamicUrl = localStorage.getItem("dynamicUrl");
    return fcaGateWay.get(`${serviceEndpoints.meterEndponts.getAllNarrativeTemplateLogs}/energy_management/meters/${id}/logs`, {
        params
    });
};
export const restoreNarrativeTemplateLog = id => {
    return fcaGateWay.patch(`${serviceEndpoints.narrativeTemplateEndPoints.restoreNarrativeTemplateLog}/${id}/restore`);
};
export const deleteNarrativeTemplateLog = id => {
    return fcaGateWay.delete(`${serviceEndpoints.narrativeTemplateEndPoints.deleteNarrativeTemplateLog}/logs/${id}`);
};
// export const getAssignModalDetails = (id, type) => {
//     return fcaGateWay.get(`${serviceEndpoints.narrativeTemplateEndPoints.getAssignModalDetails}/${id}/${type}`);
// };
// export const assignItems = (id, params, type) => fcaGateWay.post(`${serviceEndpoints.narrativeTemplateEndPoints.assignItems}/${id}/${type}`, params);
