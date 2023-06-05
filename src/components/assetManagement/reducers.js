import * as actionType from "./constants";

const initialState = {
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
            list: null,
            order: null
        },
        wildCardFilterParams: {},
        filterParams: {},
        tableConfig: null
    },
    chartDataResponse: {},
    selectedMasterFilters: {
        region_ids: [],
        site_ids: [],
        building_ids: [],
        building_type_ids: [],
        asset_status_ids: [],
        asset_condition_ids: [],
        asset_type_ids: [],
        recommendation_assigned: null
    },
    chartMasterFilterList: {
        regions: [],
        sites: [],
        buildings: [],
        building_types: [],
        asset_statuses: [],
        asset_conditions: [],
        asset_types: [],
        recommendation_filter: []
    },
    chartPopupData: { show: false, data: {} },
    chartTab: "dashboard",
    chartParams: {
        sfci_chart_sort_by: "value",
        sfci_chart_sort_order: "desc"
    },
    chartView: {
        End_Of_Life_By_Year: "column",
        Assets_Capital_Spending_Plan: "pie",
        Asset_Age_By_Condition: "column",
        SFCI: "bar"
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.UPDATE_ASSET_MANAGEMENT_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_ASSET_MANAGEMENT_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        case actionType.GET_CHARTS_DETAILS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHARTS_DETAILS_SUCCESS:
            return {
                ...state,
                chartDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_CHARTS_DETAILS_FAILURE:
            return {
                ...state,
                chartDataResponse: { success: false, ...action.error }
            };
        case actionType.GET_FILTER_LISTS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FILTER_LISTS_SUCCESS:
            return {
                ...state,
                chartMasterFilterList: { ...state.chartMasterFilterList, [action.filterKey]: [...action.response[action.filterKey]] }
            };
        case actionType.GET_FILTER_LISTS_FAILURE:
            return {
                ...state,
                chartMasterFilterList: { success: false, ...action.error }
            };
        case actionType.GET_SFCI_CHART_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SFCI_CHART_SUCCESS:
            return {
                ...state,
                chartDataResponse: { ...state.chartDataResponse, benchmark: action.response.benchmark }
            };
        case actionType.GET_SFCI_CHART_FAILURE:
            return {
                ...state,
                chartDataResponse: { success: false, ...action.error }
            };
        case actionType.SAVE_CHART_POPUP:
            return {
                ...state,
                chartPopupData: action.response
            };
        case actionType.SAVE_CHART_TAB:
            return {
                ...state,
                chartTab: action.response
            };
        case actionType.SAVE_CHART_VIEW:
            return {
                ...state,
                chartView: action.response
            };
        case actionType.SAVE_CHART_PARAMS:
            return {
                ...state,
                chartParams: action.response
            };
        case actionType.SAVE_SELECTED_MASTER_FILTER_LIST:
            return {
                ...state,
                selectedMasterFilters: action.response
            };
        default:
            return state;
    }
};
