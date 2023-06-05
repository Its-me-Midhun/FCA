import { fcaReportGateway } from "../../services/authorizationService";
import * as serviceEndpoints from "../../config/serviceEndPoints";

export const getAllUserMailid = params => fcaReportGateway.get(`${serviceEndpoints.emailEndPoints.getAllUserMailid}`);
export const sendEmail = (params, path) => fcaReportGateway.post(serviceEndpoints.emailEndPoints.sendEmail, params);
export const getAllMail = params => fcaReportGateway.get(`${serviceEndpoints.emailEndPoints.getAllMail}`, { params });
