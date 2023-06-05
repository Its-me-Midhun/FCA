import * as actionType from "./constants";

const initialState = {
    getDashboardDetailsResponse: {},
    getClientIdResponse: {},
    getBuildingByIdResponse: {},
    getRegionByIdResponse: {},
    getSiteByIdResponse: {},
    getRegionFilter: {},
    getSiteFilter: {},
    getBuildingTypeFilter: {},
    getBuildingFilter: {},
    getYearFilter: {},
    entityParams: {
        entity: null,
        selectedEntity: null,
        selectedRowId: null,
        paginationParams: {
            totalPages: 0,
            perPage: 100,
            currentPage: 0,
            totalCount: 0
        },
        params: {
            limit: 100,
            offset: 0,
            search: "",
            filters: null,
            list: null
        },
        wildCardFilterParams: {},
        filterParams: {},
        tableConfig: null,
        importtableConfig: null,
        getColorCodes: {},
        addColorCode: {},
        updateColorCode: {},
        deleteColorCode: {},
        historyPaginationParams: {
            totalPages: 0,
            perPage: 40,
            currentPage: 0,
            totalCount: 0
        },
        historyParams: {
            limit: 40,
            offset: 0,
            search: ""
        },
        importhistoryPaginationParams: {
            totalPages: 0,
            perPage: 40,
            currentPage: 0,
            totalCount: 0
        },
        importhistoryParams: {
            limit: 40,
            offset: 0,
            search: "",
            filters: null,
            list: null
        }
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        // All dashboard details
        case actionType.GET_DASHBOARD_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DASHBOARD_DETAILS_SUCCESS:
            return {
                ...state,
                getDashboardDetailsResponse: { success: true, ...action.response }
            };
        case actionType.GET_DASHBOARD_DETAILS_FAILURE:
            return {
                ...state,
                getDashboardDetailsResponse: { success: false, ...action.error }
            };

        // client by Id
        case actionType.GET_CHART_CLIENT_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_CLIENT_ID_SUCCESS:
            return {
                ...state,
                getClientIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_CHART_CLIENT_ID_FAILURE:
            return {
                ...state,
                getClientIdResponse: { success: false, ...action.error }
            };
        // Get  Building by Id
        case actionType.GET_CHART_BUILDING_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_BUILDING_BY_ID_SUCCESS:
            return {
                ...state,
                getBuildingByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_CHART_BUILDING_BY_ID_FAILURE:
            return {
                ...state,
                getBuildingByIdResponse: { success: false, ...action.error }
            };

        // Get Region By Id
        case actionType.GET_CHART_REGION_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_REGION_BY_ID_SUCCESS:
            return {
                ...state,
                getRegionByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_CHART_REGION_BY_ID_FAILURE:
            return {
                ...state,
                getRegionByIdResponse: { success: false, ...action.error }
            };

        // Get Site By Id
        case actionType.GET_CHART_SITE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_SITE_BY_ID_SUCCESS:
            return {
                ...state,
                getSiteByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_CHART_SITE_BY_ID_FAILURE:
            return {
                ...state,
                getSiteByIdResponse: { success: false, ...action.error }
            };

        // Region Filter
        case actionType.GET_ENERGY_FILTER_REGIONS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ENERGY_FILTER_REGIONS_SUCCESS:
            return {
                ...state,
                getRegionFilter: { success: true, ...action.response }
            };
        case actionType.GET_ENERGY_FILTER_REGIONS_FAILURE:
            return {
                ...state,
                getRegionFilter: { success: false, ...action.error }
            };

        // Site Filter
        case actionType.GET_ENERGY_FILTER_SITES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ENERGY_FILTER_SITES_SUCCESS:
            return {
                ...state,
                getSiteFilter: { success: true, ...action.response }
            };
        case actionType.GET_ENERGY_FILTER_SITES_FAILURE:
            return {
                ...state,
                getSiteFilter: { success: false, ...action.error }
            };

        // Site Filter
        case actionType.GET_ENERGY_FILTER_YEAR_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ENERGY_FILTER_YEAR_SUCCESS:
            return {
                ...state,
                getYearFilter: { success: true, ...action.response }
            };
        case actionType.GET_ENERGY_FILTER_YEAR_FAILURE:
            return {
                ...state,
                getYearFilter: { success: false, ...action.error }
            };

        // Building FIlter
        case actionType.GET_ENERGY_FILTER_BUILDING_TYPE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ENERGY_FILTER_BUILDING_TYPE_SUCCESS:
            return {
                ...state,
                getBuildingTypeFilter: { success: true, ...action.response }
            };
        case actionType.GET_ENERGY_FILTER_BUILDING_TYPE_FAILURE:
            return {
                ...state,
                getBuildingTypeFilter: { success: false, ...action.error }
            };
        case actionType.GET_ENERGY_FILTER_BUILDINGS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ENERGY_FILTER_BUILDINGS_SUCCESS:
            return {
                ...state,
                getBuildingFilter: { success: true, ...action.response }
            };
        case actionType.GET_ENERGY_FILTER_BUILDINGS_FAILURE:
            return {
                ...state,
                getBuildingFilter: { success: false, ...action.error }
            };

        default:
            return state;
    }
};
