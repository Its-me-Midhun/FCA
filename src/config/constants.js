const baseUrl = process.env.REACT_APP_BASE_URL;
const originUrl = process.env.REACT_APP_ORIGIN_URL;
const reportUrl = process.env.REACT_APP_REPORT_URL;
const appMode = process.env.REACT_APP_MODE;
if (!baseUrl) {
    throw new Error("API Url is not provided.");
} else if (!originUrl) {
    throw new Error("API Url is not provided.");
} else if (!reportUrl) {
    throw new Error("Report url is not provided");
}
export const MAIN_ROUTE = `${baseUrl}/`;
export const API_ROUTE = `${baseUrl}`;
export const ORIGIN_URL = originUrl;
export const REPORT_URL = reportUrl;
export const APP_MODE = appMode || "tracker";
