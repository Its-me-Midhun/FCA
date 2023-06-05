import * as actionType from "./constants";

const initialState = {
    getAllSitesResponse: {},
    addSiteResponse: {},
    updateSiteResponse: {},
    deleteSiteResponse: {},
    getRegionsBasedOnClientResponse: {},
    getAllConsultancyUsersResponse: {},
    getAllClientsResponse: {},
    getSiteByIdResponse: {},
    uploadImageResponse: {},
    getAllImagesResponse: {},
    deleteImagesResponse: {},
    updateImageCommentResponse: {},
    getListForCommonFilterResponse: {},
    getAllSiteLogsResponse: {},
    restoreSiteLogResponse: {},
    deleteSiteLogResponse: {},
    getProjectsBasedOnClientResponse:{},
    siteExportResponse:{},
    getAllClientUsersResponse:{},
    getAllConsultanciesDropdownResponse:{},
    entityParams: {
        entity: null,
        selectedEntity: null,
        selectedRowId: null,
        paginationParams: {
            totalPages: 0,
            perPage: 40,
            currentPage: 0,
            totalCount: 0
        },
        params: {
            limit: 40,
            offset: 0,
            search: "",
            project_id: null,
            filters: null,
            list: null
        },
        wildCardFilterParams: {},
        filterParams: {},
        tableConfig: null,
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
    graphDetails: {},
    getEfciBySite: {},
    updateCapitalSpendingPlan: {},
    updateFundingOption: {},
    hiddenFundingOptionList: [],
    efciTabData: {},
    getAnnualEfciLogs: {},
    getAnnualEfciByChartLogs: {},
    getAnnualFundingCalculationLogs: {},
    getAnnualFundingCalculationByChartLogs:{},
    getFundingOptionLog: {},
    getFundingOptionByChartLog: {},
    getFundingSiteEfciLog: {},
    getFundingSiteEfciByChartLog: {},
    getTotalFundingLog: {},
    getTotalFundingByChartLog: {},
    getCapitalSpendingPlanLogs: {},
    getCapitalSpendingPlanByChartLogs: {}

};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_ALL_SITES_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_SITES_SUCCESS:
            return {
                ...state,
                getAllSitesResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_SITES_FAILURE:
            return {
                ...state,
                getAllSitesResponse: { success: false, ...action.error }
            };

        case actionType.ADD_SITE_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_SITE_SUCCESS:
            return {
                ...state,
                addSiteResponse: { success: true, ...action.response }
            };
        case actionType.ADD_SITE_FAILURE:
            return {
                ...state,
                addSiteResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_SITE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_SITE_SUCCESS:
            return {
                ...state,
                updateSiteResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_SITE_FAILURE:
            return {
                ...state,
                updateSiteResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_SITE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_SITE_SUCCESS:
            return {
                ...state,
                deleteSiteResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_SITE_FAILURE:
            return {
                ...state,
                deleteSiteResponse: { success: false, ...action.error }
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

        case actionType.GET_SITE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SITE_BY_ID_SUCCESS:
            return {
                ...state,
                getSiteByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_SITE_BY_ID_FAILURE:
            return {
                ...state,
                getSiteByIdResponse: { success: false, ...action.error }
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

        case actionType.UPDATE_SITE_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_SITE_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        case actionType.GET_CHART_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_SUCCESS:
            return {
                ...state,
                graphDetails: { success: true, ...action.response }
            };
        case actionType.GET_CHART_FAILURE:
            return {
                ...state,
                graphDetails: { success: false, ...action.error }
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

        case actionType.GET_EFCI_BY_SITE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_EFCI_BY_SITE_SUCCESS:
            return {
                ...state,
                getEfciBySite: { success: true, ...action.response }
            };
        case actionType.GET_EFCI_BY_SITE_FAILURE:
            return {
                ...state,
                getEfciBySite: { success: false, ...action.error }
            };

        case actionType.UPDATE_CAPITAL_SPENDING_PLAN_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_CAPITAL_SPENDING_PLAN_SUCCESS:
            return {
                ...state,
                updateCapitalSpendingPlan: { success: true, ...action.response }
            };
        case actionType.UPDATE_CAPITAL_SPENDING_PLAN_FAILURE:
            return {
                ...state,
                updateCapitalSpendingPlan: { success: false, ...action.error }
            };

        case actionType.UPDATE_FUNDING_OPTION_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_FUNDING_OPTION_SUCCESS:
            return {
                ...state,
                updateFundingOption: { success: true, ...action.response }
            };
        case actionType.UPDATE_FUNDING_OPTION_FAILURE:
            return {
                ...state,
                updateFundingOption: { success: false, ...action.error }
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
        case actionType.RESET_EFCI_REQUEST:
            return {
                ...state
            };
        case actionType.RESET_EFCI_SUCCESS:
            return {
                ...state,
                resetEfci: { success: true, ...action.response }
            };
        case actionType.RESET_EFCI_FAILURE:
            return {
                ...state,
                resetEfci: { success: false, ...action.error }
            };
        case actionType.GET_CHART_EFCI_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_EFCI_SUCCESS:
            return {
                ...state,
                getEfciBySiteGraph: { success: true, ...action.response }
            };
        case actionType.GET_CHART_EFCI_FAILURE:
            return {
                ...state,
                getEfciBySiteGraph: { success: false, ...action.error }
            };

        case actionType.UPDATE_CAPITAL_SPENDING_PLAN_CHART_SUCCESS:
            return {
                ...state,
                updateCapitalSpendingPlanChart: { success: true, ...action.response }
            };
        case actionType.UPDATE_CAPITAL_SPENDING_PLAN_CHART_FAILURE:
            return {
                ...state,
                updateCapitalSpendingPlanChart: { success: false, ...action.error }
            };

        case actionType.UPDATE_FUNDING_OPTION_CHART_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_FUNDING_OPTION_CHART_SUCCESS:
            return {
                ...state,
                updateFundingOptionChart: { success: true, ...action.response }
            };
        case actionType.UPDATE_FUNDING_OPTION_CHART_FAILURE:
            return {
                ...state,
                updateFundingOptionChart: { success: false, ...action.error }
            };

        case actionType.HIDE_FUNDING_OPTION_CHART_REQUEST:   
            return {
                ...state
            };
        case actionType.HIDE_FUNDING_OPTION_CHART_SUCCESS:
            return {
                ...state,
                hiddenFundingOptionListChart: action.response
            };
        case actionType.HIDE_FUNDING_OPTION_CHART_FAILURE:
            return {
                ...state,
                hiddenFundingOptionListChart: []
            };

        case actionType.SAVE_EFCI_REQUEST:
            return {
                ...state
            };
        case actionType.SAVE_EFCI_SUCCESS:
            return {
                ...state,
                saveEfci: { success: true, ...action.response }
            };
        case actionType.SAVE_EFCI_FAILURE:
            return {
                ...state,
                saveEfci: { success: false, ...action.error }
            };
        case actionType.SAVE_EFCI_REQUEST:
            return {
                ...state
            };
        case actionType.LOAD_EFCI_SUCCESS:
            return {
                ...state,
                loadEfciChart: { success: true, ...action.response }
            };
        case actionType.LOAD_EFCI_FAILURE:
            return {
                ...state,
                loadEfciChart: { success: false, ...action.error }
            };

        case actionType.ADD_EFCI_ACTIVE_TAB_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_EFCI_ACTIVE_TAB_SUCCESS:
            return {
                ...state,
                efciTabData: { success: true, ...action.response }
            };
        case actionType.ADD_EFCI_ACTIVE_TAB_FAILURE:
            return {
                ...state,
                efciTabData: { success: false, ...action.error }
            };
        case actionType.GET_ALL_SITE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_SITE_LOG_SUCCESS:
            return {
                ...state,
                getAllSiteLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_SITE_LOG_FAILURE:
            return {
                ...state,
                getAllSiteLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_SITE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_SITE_LOG_SUCCESS:
            return {
                ...state,
                restoreSiteLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_SITE_LOG_FAILURE:
            return {
                ...state,
                restoreSiteLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_SITE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_SITE_LOG_SUCCESS:
            return {
                ...state,
                deleteSiteLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_SITE_LOG_FAILURE:
            return {
                ...state,
                deleteSiteLogResponse: { success: false, ...action.error }
            };

        case actionType.GET_ANNUAL_EFCI_LOGS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ANNUAL_EFCI_LOGS_SUCCESS:
            return {
                ...state,
                getAnnualEfciLogs: { success: true, ...action.response }
            };
        case actionType.GET_ANNUAL_EFCI_LOGS_FAILURE:
            return {
                ...state,
                getAnnualEfciLogs: { success: false, ...action.error }
            };

        case actionType.GET_ANNUAL_FUNDING_OPTIONS_LOGS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ANNUAL_FUNDING_OPTIONS_LOGS_SUCCESS:
            return {
                ...state,
                getAnnualFundingCalculationLogs: { success: true, ...action.response }
            };
        case actionType.GET_ANNUAL_FUNDING_OPTIONS_LOGS_FAILURE:
            return {
                ...state,
                getAnnualFundingCalculationLogs: { success: false, ...action.error }
            };

        case actionType.GET_FUNDING_OPTIONS_LOGS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FUNDING_OPTIONS_LOGS_SUCCESS:
            return {
                ...state,
                getFundingOptionLog: { success: true, ...action.response }
            };
        case actionType.GET_FUNDING_OPTIONS_LOGS_FAILURE:
            return {
                ...state,
                getFundingOptionLog: { success: false, ...action.error }
            };

        case actionType.GET_FUNDING_EFCI_LOGS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FUNDING_EFCI_LOGS_SUCCESS:
            return {
                ...state,
                getFundingSiteEfciLog: { success: true, ...action.response }
            };
        case actionType.GET_FUNDING_EFCI_LOGS_FAILURE:
            return {
                ...state,
                getFundingSiteEfciLog: { success: false, ...action.error }
            };

        case actionType.GET_TOTAL_FUNDING_EFCI_LOGS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TOTAL_FUNDING_EFCI_LOGS_SUCCESS:
            return {
                ...state,
                getTotalFundingLog: { success: true, ...action.response }
            };
        case actionType.GET_TOTAL_FUNDING_EFCI_LOGS_FAILURE:
            return {
                ...state,
                getTotalFundingLog: { success: false, ...action.error }
            };

        case actionType.GET_CSP_LOGS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CSP_LOGS_SUCCESS:
            return {
                ...state,
                getCapitalSpendingPlanLogs: { success: true, ...action.response }
            };
        case actionType.GET_CSP_LOGS_FAILURE:
            return {
                ...state,
                getCapitalSpendingPlanLogs: { success: false, ...action.error }
            };

            //log by chart
            case actionType.GET_FUNDING_OPTIONS_CHART_LOGS_REQUEST:
                return {
                    ...state
                };
            case actionType.GET_FUNDING_OPTIONS_CHART_LOGS_SUCCESS:
                return {
                    ...state,
                    getFundingOptionByChartLog: { success: true, ...action.response }
                };
            case actionType.GET_FUNDING_OPTIONS_CHART_LOGS_FAILURE:
                return {
                    ...state,
                    getFundingOptionByChartLog: { success: false, ...action.error }
                };

        case actionType.GET_FUNDING_OPTIONS_CHART_LOGS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FUNDING_OPTIONS_CHART_LOGS_SUCCESS:
            return {
                ...state,
                getFundingOptionByChartLog: { success: true, ...action.response }
            };
        case actionType.GET_FUNDING_OPTIONS_CHART_LOGS_FAILURE:
            return {
                ...state,
                getFundingOptionByChartLog: { success: false, ...action.error }
            };
        case actionType.GET_FUNDING_EFCI_CHART_LOGS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FUNDING_EFCI_CHART_LOGS_SUCCESS:
            return {
                ...state,
                getFundingSiteEfciByChartLog: { success: true, ...action.response }
            };
        case actionType.GET_FUNDING_EFCI_CHART_LOGS_FAILURE:
            return {
                ...state,
                getFundingSiteEfciByChartLog: { success: false, ...action.error }
            };
            case actionType.GET_TOTAL_FUNDING_EFCI_CHART_LOGS_REQUEST:
                return {
                    ...state
                };
            case actionType.GET_TOTAL_FUNDING_EFCI_CHART_LOGS_SUCCESS:
                return {
                    ...state,
                    getTotalFundingByChartLog: { success: true, ...action.response }
                };
            case actionType.GET_TOTAL_FUNDING_EFCI_CHART_LOGS_FAILURE:
                return {
                    ...state,
                    getTotalFundingByChartLog: { success: false, ...action.error }
                };
                case actionType.GET_CSP_CHART_LOGS_REQUEST:
                    return {
                        ...state
                    };
                case actionType.GET_CSP_CHART_LOGS_SUCCESS:
                    return {
                        ...state,
                        getCapitalSpendingPlanByChartLogs: { success: true, ...action.response }
                    };
                case actionType.GET_CSP_CHART_LOGS_FAILURE:
                    return {
                        ...state,
                        getCapitalSpendingPlanByChartLogs: { success: false, ...action.error }
                    };
                    case actionType.GET_ANNUAL_EFCI_CHART_LOGS_REQUEST:
                        return {
                            ...state
                        };
                    case actionType.GET_ANNUAL_EFCI_CHART_LOGS_SUCCESS:
                        return {
                            ...state,
                            getAnnualEfciByChartLogs: { success: true, ...action.response }
                        };
                    case actionType.GET_ANNUAL_EFCI_CHART_LOGS_FAILURE:
                        return {
                            ...state,
                            getAnnualEfciByChartLogs: { success: false, ...action.error }
                        };
            
                    case actionType.GET_ANNUAL_FUNDING_OPTIONS_CHART_LOGS_REQUEST:
                        return {
                            ...state
                        };
                    case actionType.GET_ANNUAL_FUNDING_OPTIONS_CHART_LOGS_SUCCESS:
                        return {
                            ...state,
                            getAnnualFundingCalculationByChartLogs: { success: true, ...action.response }
                        };
                    case actionType.GET_ANNUAL_FUNDING_OPTIONS_CHART_LOGS_FAILURE:
                        return {
                            ...state,
                            getAnnualFundingCalculationByChartLogs: { success: false, ...action.error }
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
        case actionType.GET_SITE_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SITE_EXPORT_SUCCESS:
            return {
                ...state,
                siteExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_SITE_EXPORT_FAILURE:
            return {
                ...state,
                siteExportResponse: { success: false, ...action.error }
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
            

        // getCapitalSpendingPlanLogs
        default:
            return state;
    }
};
