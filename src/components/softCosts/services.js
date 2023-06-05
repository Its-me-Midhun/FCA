import { fcaGateWay } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getSoftCostsData = params => fcaGateWay.get(`${serviceEndpoints.softCosts.softCosts}`, { params });
export const saveSoftCostsData = data => fcaGateWay.post(`${serviceEndpoints.softCosts.saveSoftCosts}`, data);
export const exportExcel = params => fcaGateWay.get(`${serviceEndpoints.softCosts.exportExcel}`, { method: "GET", responseType: "blob", params });
