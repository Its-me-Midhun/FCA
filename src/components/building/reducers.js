import * as actionType from "./constants";

const initialState = {
    getAllBuildingsResponse: {},
    addBuildingResponse: {},
    updateBuildingResponse: {},
    deleteBuildingResponse: {},
    getRegionsBasedOnClientResponse: {},
    getProjectsBasedOnClientResponse: {},
    getAllConsultancyUsersResponse: {},
    getAllClientsResponse: {},
    getBuildingByIdResponse: {},
    getBuildingsBasedOnSiteResponse: {},
    getEfciBasedOnProject: {},
    updateImageCommentResponse: {},
    updateCapitalSpendingPercentResponse: {},
    updateAnnualFundingOption: {},
    getListForCommonFilterResponse: {},
    getBuildingTypesBasedOnClientResponse: {},
    getAllBuildingLogsResponse: {},
    restoreBuildingLogResponse: {},
    deleteBuildingLogResponse: {},
    buildingExportResponse:{},
    getAllClientUsersResponse:{},
    getAllConsultanciesDropdownResponse:{},
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
            project_id: null,
            filters: null,
            list: null
        },
        wildCardFilterParams: {},
        filterParams: {},
        tableConfig: null,
        hiddenFundingOptionList: [],
        updateBuildingLock: {},
        hideFundingOptionBuildingSite: [],
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
    },
    getEfciByBuildingGraph: {},
    getCSPLog: {},
    getFundingCostLog: {},
    getFundingEfciLog: {},
    getTotalFundingCostLog: {},
    getAnnualFundingOptionLog: {},
    getAnnualEFCILog: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_ALL_BUILDINGS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_BUILDINGS_SUCCESS:
            return {
                ...state,
                getAllBuildingsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_BUILDINGS_FAILURE:
            return {
                ...state,
                getAllBuildingsResponse: { success: false, ...action.error }
            };

        case actionType.ADD_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_BUILDING_SUCCESS:
            return {
                ...state,
                addBuildingResponse: { success: true, ...action.response }
            };
        case actionType.ADD_BUILDING_FAILURE:
            return {
                ...state,
                addBuildingResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_BUILDING_SUCCESS:
            return {
                ...state,
                updateBuildingResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_BUILDING_FAILURE:
            return {
                ...state,
                updateBuildingResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_BUILDING_SUCCESS:
            return {
                ...state,
                deleteBuildingResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_BUILDING_FAILURE:
            return {
                ...state,
                deleteBuildingResponse: { success: false, ...action.error }
            };

        case actionType.GET_REGIONS_BASED_ON_CLIENT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REGIONS_BASED_ON_CLIENT_SUCCESS:
            return {
                ...state,
                getRegionsBasedOnClientResponse: { success: true, ...action.response }
            };
        case actionType.GET_REGIONS_BASED_ON_CLIENT_FAILURE:
            return {
                ...state,
                getRegionsBasedOnClientResponse: { success: false, ...action.error }
            };

        case actionType.GET_SITES_BASED_ON_REGION_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SITES_BASED_ON_REGION_SUCCESS:
            return {
                ...state,
                getSitesBasedOnRegionResponse: { success: true, ...action.response }
            };
        case actionType.GET_SITES_BASED_ON_REGION_FAILURE:
            return {
                ...state,
                getSitesBasedOnRegionResponse: { success: false, ...action.error }
            };

        case actionType.GET_ALL_CONSULTANCY_USERS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CONSULTANCY_USERS_SUCCESS:
            return {
                ...state,
                getAllConsultancyUsersResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CONSULTANCY_USERS_FAILURE:
            return {
                ...state,
                getAllConsultancyUsersResponse: { success: false, ...action.error }
            };

        case actionType.GET_ALL_CLIENTS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CLIENTS_SUCCESS:
            return {
                ...state,
                getAllClientsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CLIENTS_FAILURE:
            return {
                ...state,
                getAllClientsResponse: { success: false, ...action.error }
            };

        case actionType.GET_BUILDING_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_BUILDING_BY_ID_SUCCESS:
            return {
                ...state,
                getBuildingByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_BUILDING_BY_ID_FAILURE:
            return {
                ...state,
                getBuildingByIdResponse: { success: false, ...action.error }
            };

        case actionType.GET_ALL_COUNTRIES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_COUNTRIES_SUCCESS:
            return {
                ...state,
                getAllCountriesResponse: { success: true, ...action.response.data }
            };
        case actionType.GET_ALL_COUNTRIES_FAILURE:
            return {
                ...state,
                getAllCountriesResponse: { success: false, ...action.error }
            };

        case actionType.GET_BUILDINGS_BASED_ON_SITE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_BUILDINGS_BASED_ON_SITE_SUCCESS:
            return {
                ...state,
                getBuildingsBasedOnSiteResponse: { success: true, ...action.response }
            };
        case actionType.GET_BUILDINGS_BASED_ON_SITE_FAILURE:
            return {
                ...state,
                getBuildingsBasedOnSiteResponse: { success: false, ...action.error }
            };
        case actionType.UPLOAD_IMAGE_REQUEST:
            return {
                ...state
            };
        case actionType.UPLOAD_IMAGE_SUCCESS:
            return {
                ...state,
                uploadImageResponse: { success: true, ...action.response }
            };
        case actionType.UPLOAD_IMAGE_FAILURE:
            return {
                ...state,
                uploadImageResponse: { success: false, ...action.error }
            };

        case actionType.GET_ALL_IMAGES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_IMAGES_SUCCESS:
            return {
                ...state,
                getAllImagesResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_IMAGES_FAILURE:
            return {
                ...state,
                getAllImagesResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_IMAGES_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_IMAGES_SUCCESS:
            return {
                ...state,
                deleteImagesResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_IMAGES_FAILURE:
            return {
                ...state,
                deleteImagesResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_IMAGE_COMMENT_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_IMAGE_COMMENT_SUCCESS:
            return {
                ...state,
                updateImageCommentResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_IMAGE_COMMENT_FAILURE:
            return {
                ...state,
                updateImageCommentResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_BUILDING_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_BUILDING_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        case actionType.GET_PROJECTS_BASED_ON_CLIENT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROJECTS_BASED_ON_CLIENT_SUCCESS:
            return {
                ...state,
                getProjectsBasedOnClientResponse: { success: true, ...action.response }
            };
        case actionType.GET_PROJECTS_BASED_ON_CLIENT_FAILURE:
            return {
                ...state,
                getProjectsBasedOnClientResponse: { success: false, ...action.error }
            };

        case actionType.GET_EFCI_BASED_ON_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.GET_EFCI_BASED_ON_BUILDING_SUCCESS:
            return {
                ...state,
                getEfciBasedOnProject: { success: true, ...action.response }
            };
        case actionType.GET_EFCI_BASED_ON_BUILDING_FAILURE:
            return {
                ...state,
                getEfciBasedOnProject: { success: false, ...action.error }
            };

        case actionType.UPDATE_CAPITAL_SPENDING_PERCENT_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_CAPITAL_SPENDING_PERCENT_SUCCESS:
            return {
                ...state,
                updateCapitalSpendingPercentResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_CAPITAL_SPENDING_PERCENT_FAILURE:
            return {
                ...state,
                updateCapitalSpendingPercentResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_ANNUAL_FUNDING_OPTION_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_ANNUAL_FUNDING_OPTION_SUCCESS:
            return {
                ...state,
                updateAnnualFundingOption: { success: true, ...action.response }
            };
        case actionType.UPDATE_ANNUAL_FUNDING_OPTION_FAILURE:
            return {
                ...state,
                updateAnnualFundingOption: { success: false, ...action.error }
            };
        case actionType.GET_LIST_FOR_COMMON_FILTER_REQUEST:
            return {
                ...state
            };
        case actionType.GET_LIST_FOR_COMMON_FILTER_SUCCESS:
            return {
                ...state,
                getListForCommonFilterResponse: { success: true, ...action.response }
            };
        case actionType.GET_LIST_FOR_COMMON_FILTER_FAILURE:
            return {
                ...state,
                getListForCommonFilterResponse: { success: false, ...action.error }
            };

        case actionType.HIDE_FUNDING_OPTION_REQUEST:
            return {
                ...state
            };
        case actionType.HIDE_FUNDING_OPTION_SUCCESS:
            return {
                ...state,
                hiddenFundingOptionList: action.response
            };
        case actionType.HIDE_FUNDING_OPTION_FAILURE:
            return {
                ...state,
                hiddenFundingOptionList: []
            };
        case actionType.GET_BUILDING_TYPES_BASED_ON_CLIENT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_BUILDING_TYPES_BASED_ON_CLIENT_SUCCESS:
            return {
                ...state,
                getBuildingTypesBasedOnClientResponse: { success: true, ...action.response }
            };
        case actionType.GET_BUILDING_TYPES_BASED_ON_CLIENT_FAILURE:
            return {
                ...state,
                getBuildingTypesBasedOnClientResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_BUILDING_LOCK_EFCI_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_BUILDING_LOCK_EFCI_SUCCESS:
            return {
                ...state,
                updateBuildingLock: { success: true, ...action.response }
            };
        case actionType.UPDATE_BUILDING_LOCK_EFCI_FAILURE:
            return {
                ...state,
                updateBuildingLock: { success: false, ...action.error }
            };

        case actionType.HIDE_FUNDING_OPTION_BUILDING_SITE_REQUEST:
            return {
                ...state
            };
        case actionType.HIDE_FUNDING_OPTION_BUILDING_SITE_SUCCESS:
            return {
                ...state,
                hideFundingOptionBuildingSite: action.response
            };
        case actionType.HIDE_FUNDING_OPTION_BUILDING_SITE_FAILURE:
            return {
                ...state,
                hideFundingOptionBuildingSite: []
            };
        case actionType.GET_CHART_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_BUILDING_SUCCESS:
            return {
                ...state,
                graphDetails: { success: true, ...action.response }
            };
        case actionType.GET_CHART_BUILDING_FAILURE:
            return {
                ...state,
                graphDetails: { success: false, ...action.error }
            };
        case actionType.SAVE_EFCI_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.SAVE_EFCI_BUILDING_SUCCESS:
            return {
                ...state,
                saveEfciBuilding: { success: true, ...action.response }
            };
        case actionType.SAVE_EFCI_BUILDING_FAILURE:
            return {
                ...state,
                saveEfciBuilding: { success: false, ...action.error }
            };
        case actionType.SAVE_EFCI_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.LOAD_EFCI_BUILDING_SUCCESS:
            return {
                ...state,
                loadEfciChartBuilding: { success: true, ...action.response }
            };
        case actionType.LOAD_EFCI_BUILDING_FAILURE:
            return {
                ...state,
                loadEfciChartBuilding: { success: false, ...action.error }
            };
        case actionType.GET_CHART_BUILDING_EFCI_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_BUILDING_EFCI_SUCCESS:
            return {
                ...state,
                getEfciByBuildingGraph: { success: true, ...action.response }
            };
        case actionType.GET_CHART_BUILDING_EFCI_FAILURE:
            return {
                ...state,
                getEfciByBuildingGraph: { success: false, ...action.error }
            };
        case actionType.LOCK_EFCI_BUILDING_SUCCESS:
            return {
                ...state,
                lockEfciChartBuilding: { success: true, ...action.response }
            };
        case actionType.LOCK_EFCI_BUILDING_FAILURE:
            return {
                ...state,
                lockEfciChartBuilding: { success: false, ...action.error }
            };
        case actionType.GET_ALL_BUILDING_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_BUILDING_LOG_SUCCESS:
            return {
                ...state,
                getAllBuildingLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_BUILDING_LOG_FAILURE:
            return {
                ...state,
                getAllBuildingLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_BUILDING_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_BUILDING_LOG_SUCCESS:
            return {
                ...state,
                restoreBuildingLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_BUILDING_LOG_FAILURE:
            return {
                ...state,
                restoreBuildingLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_BUILDING_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_BUILDING_LOG_SUCCESS:
            return {
                ...state,
                deleteBuildingLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_BUILDING_LOG_FAILURE:
            return {
                ...state,
                deleteBuildingLogResponse: { success: false, ...action.error }
            };

        case actionType.GET_CSP_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CSP_LOG_SUCCESS:
            return {
                ...state,
                getCSPLog: { success: true, ...action.response }
            };
        case actionType.GET_CSP_LOG_FAILURE:
            return {
                ...state,
                getCSPLog: { success: false, ...action.error }
            };

        case actionType.GET_FUNDING_COST_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FUNDING_COST_LOG_SUCCESS:
            return {
                ...state,
                getFundingCostLog: { success: true, ...action.response }
            };
        case actionType.GET_FUNDING_COST_LOG_FAILURE:
            return {
                ...state,
                getFundingCostLog: { success: false, ...action.error }
            };

        case actionType.GET_FUNDING_COST_EFCI_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FUNDING_COST_EFCI_LOG_SUCCESS:
            return {
                ...state,
                getFundingEfciLog: { success: true, ...action.response }
            };
        case actionType.GET_FUNDING_COST_EFCI_LOG_FAILURE:
            return {
                ...state,
                getFundingEfciLog: { success: false, ...action.error }
            };
        case actionType.GET_TOTAL_FUNDING_COST_EFCI_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TOTAL__FUNDING_COST_EFCI_LOG_SUCCESS:
            return {
                ...state,
                getTotalFundingCostLog: { success: true, ...action.response }
            };
        case actionType.GET_TOTAL_FUNDING_COST_EFCI_LOG_FAILURE:
            return {
                ...state,
                getTotalFundingCostLog: { success: false, ...action.error }
            };
        case actionType.GET_ANNUAL_FUNDING_COST_EFCI_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ANNUAL_FUNDING_COST_EFCI_LOG_SUCCESS:
            return {
                ...state,
                getAnnualFundingOptionLog: { success: true, ...action.response }
            };
        case actionType.GET_ANNUAL_FUNDING_COST_EFCI_LOG_FAILURE:
            return {
                ...state,
                getAnnualFundingOptionLog: { success: false, ...action.error }
            };

        case actionType.GET_ANNUAL_EFCI_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ANNUAL_EFCI_LOG_SUCCESS:
            return {
                ...state,
                getAnnualEFCILog: { success: true, ...action.response }
            };
        case actionType.GET_ANNUAL_EFCI_LOG_FAILURE:
            return {
                ...state,
                getAnnualEFCILog: { success: false, ...action.error }
            };
        case actionType.GET_BUILDING_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_BUILDING_EXPORT_SUCCESS:
            return {
                ...state,
                buildingExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_BUILDING_EXPORT_FAILURE:
            return {
                ...state,
                buildingExportResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_CLIENT_USERS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CLIENT_USERS_SUCCESS:
            return {
                ...state,
                getAllClientUsersResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CLIENT_USERS_FAILURE:
            return {
                ...state,
                getAllClientUsersResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_CONSULTANCIES_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_CONSULTANCIES_DROPDOWN_SUCCESS:
            return {
                ...state,
                getAllConsultanciesDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_CONSULTANCIES_DROPDOWN_FAILURE:
            return {
                ...state,
                getAllConsultanciesDropdownResponse: { success: false, ...action.error }
            };

        // getAnnualEFCILog
        default:
            return state;
    }
};
