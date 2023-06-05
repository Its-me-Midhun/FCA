import * as actionType from "./constants";

const initialState = {
    getDashboard: {},
    getDashboardChart: {},
    getFciChart: {},
    getHorizontalChart: {},
    getMap: {},
    getAllLegents: {},
    getFilterColors: {},
    filterValues: {},
    dashboardExtraFilters: {},
    backUpNames: {},
    backUpValues: {},
    popUpData: {},
    filterContents: [],
    landingPageData: {},
    widgetData: {},
    landingPageReport: {},
    isFullScreen: "",
    secondChartView: "",
    accordianOpen: null,
    activeLandingPageMenu: "",
    masterFilterList: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_DASHBOARD_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DASHBOARD_SUCCESS:
            return {
                ...state,
                getDashboard: { success: true, ...action.response }
            };
        case actionType.GET_DASHBOARD_FAILURE:
            return {
                ...state,
                getDashboard: { success: false, ...action.error }
            };
        case actionType.GET_DASHBOARD_CHART_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DASHBOARD_CHART_SUCCESS:
            return {
                ...state,
                getDashboardChart: { success: true, ...action.response }
            };
        case actionType.GET_DASHBOARD_CHART_FAILURE:
            return {
                ...state,
                getDashboardChart: { success: false, ...action.error }
            };
        case actionType.GET_DASHBOARD_FCI_CHART_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DASHBOARD_FCI_CHART_SUCCESS:
            return {
                ...state,
                getFciChart: { success: true, ...action.response }
            };
        case actionType.GET_DASHBOARD_FCI_CHART_FAILURE:
            return {
                ...state,
                getFciChart: { success: false, ...action.error }
            };
        case actionType.GET_DASHBOARD_MAP_CHART_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DASHBOARD_MAP_CHART_SUCCESS:
            return {
                ...state,
                getMap: { success: true, ...action.response }
            };
        case actionType.GET_DASHBOARD_MAP_CHART_FAILURE:
            return {
                ...state,
                getMap: { success: false, ...action.error }
            };
        case actionType.GET_DASHBOARD_HORIZONTAL_CHART_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DASHBOARD_HORIZONTAL_CHART_SUCCESS:
            return {
                ...state,
                getHorizontalChart: { success: true, ...action.response }
            };
        case actionType.GET_DASHBOARD_HORIZONTAL_CHART_FAILURE:
            return {
                ...state,
                getHorizontalChart: { success: false, ...action.error }
            };
        //filter values
        case actionType.GET_FILTER_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FILTER_PROJECT_SUCCESS:
            return {
                ...state,
                masterFilterList: { ...state.masterFilterList, [action.key]: [...action.response?.[action.key]] }
            };
        case actionType.GET_FILTER_PROJECT_FAILURE:
            return {
                ...state,
                masterFilterList: {}
            };

        case actionType.GET_LEGENTS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_LEGENTS_SUCCESS:
            return {
                ...state,
                getAllLegents: { success: true, ...action.response }
            };
        case actionType.GET_LEGENTS_FAILURE:
            return {
                ...state,
                getAllLegents: { success: false, ...action.error }
            };

        case actionType.MODIFY_FILTER_REQUEST:
            return {
                ...state,
                filterContents: action.response.param || [],
                filterValues: { ...action.response.values },
                dashboardExtraFilters: { ...action.response.dashboardExtraFilters },
                backUpNames: action.response.backUpNames,
                backUpValues: action.response.backUpValues
            };

        case actionType.MODIFY_POP_UP_REQUEST:
            return {
                ...state,
                popUpData: action.response.data
            };

        case actionType.GET_LANDING_PAGE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_LANDING_PAGE_SUCCESS:
            return {
                ...state,
                landingPageData: { success: true, ...action.response }
            };
        case actionType.GET_LANDING_PAGE_FAILURE:
            return {
                ...state,
                landingPageData: { success: false, ...action.error }
            };
        case actionType.GET_LANDING_PAGE_REPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_LANDING_PAGE_REPORT_SUCCESS:
            return {
                ...state,
                landingPageReport: { success: true, ...action.response }
            };
        case actionType.GET_LANDING_PAGE_REPORT_FAILURE:
            return {
                ...state,
                landingPageReport: { success: false, ...action.error }
            };
        case actionType.GET_WIDGET_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_WIDGET_DATA_SUCCESS:
            return {
                ...state,
                widgetData: { success: true, ...action.response }
            };
        case actionType.GET_WIDGET_DATA_FAILURE:
            return {
                ...state,
                widgetData: { success: false, ...action.error }
            };
        case actionType.UPDATE_FULL_SCREEN_SUCCESS:
            return {
                ...state,
                isFullScreen: action.response
            };
        case actionType.UPDATE_FULL_SCREEN_FAILURE:
            return {
                ...state,
                isFullScreen: false
            };
        case actionType.UPDATE_IS_BUDGET_PRIORITY_VIEW_SUCCESS:
            return {
                ...state,
                secondChartView: action.response
            };
        case actionType.UPDATE_IS_BUDGET_PRIORITY_VIEW_FAILURE:
            return {
                ...state,
                secondChartView: ""
            };
        case actionType.UPDATE_TRACKER_MENU_SUCCESS:
            return {
                ...state,
                accordianOpen: action.response
            };
        case actionType.SET_ACTIVE_MENU_SUCCESS:
            return {
                ...state,
                activeLandingPageMenu: action.response
            };

        default:
            return state;
    }
};
