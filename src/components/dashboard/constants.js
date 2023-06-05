const role = localStorage.getItem("role");
export const MASTER_FILTERS = [
    {
        label: "Clients",
        key: "clients",
        nameKey: "client_names",
        flag: "client_flag",
        paramKey: "client_ids",
        visible: role === "super_admin" || role === "consultancy_user"
    },
    {
        label: "FCA Projects",
        key: "projects",
        nameKey: "project_names",
        flag: "projects_flag",
        paramKey: "project_ids",
        visible: true
    },
    { label: "Regions", key: "regions", nameKey: "region_names", flag: "region_flag", paramKey: "region_ids", visible: true },
    { label: "Sites", key: "sites", nameKey: "site_names", flag: "site_flag", paramKey: "site_ids", visible: true },
    { label: "B.Types", key: "building_types", nameKey: "building_types_names", flag: "btype_flag", paramKey: "building_types", visible: true },
    { label: "Buildings", key: "buildings", nameKey: "building_names", flag: "building_flag", paramKey: "building_ids", visible: true },
    { label: "FCI", key: "color_codes", nameKey: "color_scale_names", flag: "fci_flag", paramKey: "fci_color", visible: true },
    {
        label: "IR",
        key: "infrastructure_requests",
        nameKey: "infrastructure_requests",
        flag: "infrastructure_requests_flag",
        paramKey: "infrastructure_requests",
        visible: true,
        isMore: true
    },
    {
        label: "FMP",
        key: "fmp",
        nameKey: "facility_master_plan",
        flag: "facility_master_plan_flag",
        paramKey: "facility_master_plan",
        visible: true,
        isMore: true
    },
    { label: "Additions", key: "additions", nameKey: "addition_names", flag: "addition_flag", paramKey: "addition_ids", visible: true, isMore: true },
    {
        label: "Primary Uses",
        key: "primary_use",
        nameKey: "primary_use_names",
        flag: "primary_use_flag",
        paramKey: "primary_use_ids",
        visible: true,
        isMore: true
    },
    {
        label: "Secondary Uses",
        key: "secondary_use",
        nameKey: "secondary_use_names",
        flag: "secondary_use_flag",
        paramKey: "secondary_use_ids",
        visible: true,
        isMore: true
    },
    { label: "Sectors", key: "sectors", nameKey: "sector_names", flag: "sector_flag", paramKey: "sector_ids", visible: true, isMore: true },
    {
        label: "Internal Groups",
        key: "internal_groups",
        nameKey: "internal_group_names",
        flag: "internal_group_flag",
        paramKey: "internal_group_ids",
        visible: true,
        isMore: true
    },
    { label: "Divisions", key: "divisions", nameKey: "division_names", flag: "division_flag", paramKey: "division_ids", visible: true, isMore: true }
];

//get dashboard

export const GET_DASHBOARD_REQUEST = "GET_DASHBOARD_REQUEST";
export const GET_DASHBOARD_SUCCESS = "GET_DASHBOARD_SUCCESS";
export const GET_DASHBOARD_FAILURE = "GET_DASHBOARD_FAILURE";

//get charts
export const GET_DASHBOARD_CHART_REQUEST = "GET_DASHBOARD_CHART_REQUEST";
export const GET_DASHBOARD_CHART_SUCCESS = "GET_DASHBOARD_CHART_SUCCESS";
export const GET_DASHBOARD_CHART_FAILURE = "GET_DASHBOARD_CHART_FAILURE";

//get fcicharts
export const GET_DASHBOARD_FCI_CHART_REQUEST = "GET_DASHBOARD_FCI_CHART_REQUEST";
export const GET_DASHBOARD_FCI_CHART_SUCCESS = "GET_DASHBOARD_FCI_CHART_SUCCESS";
export const GET_DASHBOARD_FCI_CHART_FAILURE = "GET_DASHBOARD_FCI_CHART_FAILURE";

//get map
export const GET_DASHBOARD_MAP_CHART_REQUEST = "GET_DASHBOARD_MAP_CHART_REQUEST";
export const GET_DASHBOARD_MAP_CHART_SUCCESS = "GET_DASHBOARD_MAP_CHART_SUCCESS";
export const GET_DASHBOARD_MAP_CHART_FAILURE = "GET_DASHBOARD_MAP_CHART_FAILURE";

//get horizontal charts
export const GET_DASHBOARD_HORIZONTAL_CHART_REQUEST = "GET_DASHBOARD_HORIZONTAL_CHART_REQUEST";
export const GET_DASHBOARD_HORIZONTAL_CHART_SUCCESS = "GET_DASHBOARD_HORIZONTAL_CHART_SUCCESS";
export const GET_DASHBOARD_HORIZONTAL_CHART_FAILURE = "GET_DASHBOARD_HORIZONTAL_CHART_FAILURE";

//get filter project
export const GET_FILTER_PROJECT_REQUEST = "GET_FILTER_PROJECT_REQUEST";
export const GET_FILTER_PROJECT_SUCCESS = "GET_FILTER_PROJECT_SUCCESS";
export const GET_FILTER_PROJECT_FAILURE = "GET_FILTER_PROJECT_FAILURE";

//get legents
export const GET_LEGENTS_REQUEST = "GET_LEGENTS_REQUEST";
export const GET_LEGENTS_SUCCESS = "GET_LEGENTS_SUCCESS";
export const GET_LEGENTS_FAILURE = "GET_LEGENTS_FAILURE";

export const MODIFY_FILTER_REQUEST = "MODIFY_FILTER_REQUEST";

export const MODIFY_POP_UP_REQUEST = "MODIFY_POP_UP_REQUEST";

//get landing page data
export const GET_LANDING_PAGE_REQUEST = "GET_LANDING_PAGE_REQUEST";
export const GET_LANDING_PAGE_SUCCESS = "GET_LANDING_PAGE_SUCCESS";
export const GET_LANDING_PAGE_FAILURE = "GET_LANDING_PAGE_FAILURE";

//get landing page reports
export const GET_LANDING_PAGE_REPORT_REQUEST = "GET_LANDING_PAGE_REPORT_REQUEST";
export const GET_LANDING_PAGE_REPORT_SUCCESS = "GET_LANDING_PAGE_REPORT_SUCCESS";
export const GET_LANDING_PAGE_REPORT_FAILURE = "GET_LANDING_PAGE_REPORT_FAILURE";

//get widget data
export const GET_WIDGET_DATA_REQUEST = "GET_WIDGET_DATA_REQUEST";
export const GET_WIDGET_DATA_SUCCESS = "GET_WIDGET_DATA_SUCCESS";
export const GET_WIDGET_DATA_FAILURE = "GET_WIDGET_DATA_FAILURE";

export const UPDATE_FULL_SCREEN_SUCCESS = "UPDATE_FULL_SCREEN_SUCCESS";
export const UPDATE_FULL_SCREEN_FAILURE = "UPDATE_FULL_SCREEN_FAILURE";

export const UPDATE_IS_BUDGET_PRIORITY_VIEW_SUCCESS = "UPDATE_IS_BUDGET_PRIORITY_VIEW_SUCCESS";
export const UPDATE_IS_BUDGET_PRIORITY_VIEW_FAILURE = "UPDATE_IS_BUDGET_PRIORITY_VIEW_FAILURE";

export const UPDATE_TRACKER_MENU_SUCCESS = "UPDATE_TRACKER_MENU_SUCCESS";
export const SET_ACTIVE_MENU_SUCCESS = "SET_ACTIVE_MENU_SUCCESS";
