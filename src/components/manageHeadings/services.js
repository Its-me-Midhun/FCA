import { fcaReportGateway } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getAllExportHeading = params => fcaReportGateway.get(`${serviceEndpoints.manageHeadingsEndPoints.manageHeading}`, { params });
export const updateExportHeading = (params, id) => fcaReportGateway.patch(`${serviceEndpoints.manageHeadingsEndPoints.manageHeading}${id}/`, params);
export const getHeadingDataById = id => fcaReportGateway.get(`${serviceEndpoints.manageHeadingsEndPoints.manageHeading}${id}/`);
export const exportHeadings = params =>
    fcaReportGateway.get(`${serviceEndpoints.manageHeadingsEndPoints.headingExportExcel}`, { responseType: "blob", method: "GET", params });
