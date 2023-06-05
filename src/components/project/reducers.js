import * as actionType from "./constants";

const initialState = {
    getAllProjectsResponse: {},
    addProjectResponse: {},
    parseFcaResponse: {},
    updateProjectResponse: {},
    deleteProjectResponse: {},
    getRegionsBasedOnClientResponse: {},
    getAllConsultancyUsersResponse: {},
    getAllClientsResponse: {},
    getProjectByIdResponse: {},
    getBuildingTypeSettingsDataResponse: {},
    uploadImageResponse: {},
    getAllImagesResponse: {},
    deleteImagesResponse: {},
    getTradeSettingsDataResponse: {},
    addTradeResponse: {},
    getTradeByIdResponse: {},
    updateTradeResponse: {},
    deleteTradeResponse: {},
    getCategorySettingsDataResponse: {},
    addCategoryResponse: {},
    getCategoryByIdResponse: {},
    updateCategoryResponse: {},
    deleteCategoryResponse: {},
    getFutureCapitalBySite: {},
    getDifferedMaintenanceBySite: {},
    getListForCommonFilterResponse: {},
    getSystemSettingsDataResponse: {},
    addSystemResponse: {},
    getSystemByIdResponse: {},
    updateSystemResponse: {},
    deleteSystemResponse: {},
    getSubsystemSettingsDataResponse: {},
    addSubsystemResponse: {},
    getSubsystemByIdResponse: {},
    updateSubsystemResponse: {},
    deleteSubsystemResponse: {},
    getDepartmentSettingsDataResponse: {},
    addDepartmentResponse: {},
    getDepartmentByIdResponse: {},
    updateDepartmentResponse: {},
    deleteDepartmentResponse: {},
    getTradeSettingsDropdownResponse: {},
    getSystemSettingsDropdownResponse: {},
    addLimitResponse: {},
    getaddLimitResponse: {},
    getGeneralByIdResponse: {},
    updateGeneralResponse: {},
    deleteGeneralResponse: {},
    getAllProjectLogsResponse: {},
    restoreProjectLogResponse: {},
    deleteProjectLogResponse: {},
    getAllProjectImportHistoryResponse: {},
    deleteProjectHistoryResponse: {},
    projectExportResponse: {},
    getAllClientUsersResponse: {},
    getAllConsultanciesDropdownResponse: {},
    priorityElementsData: {},
    updatePriorityElementsResponse: {},
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
        getColorCodeSfci: {},
        addColorCodeSfci: {},
        updateColorCodeSfci: {},
        deleteColorCodeSfci: {},
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
    },
    getEfciByProject: {},
    FundingCostLogs: {},
    cspSummaryLog: {},
    annualEfciLogs: {},
    FundingEFCILogs: {},
    annualFundingLogs: {},
    hiddenFundingOptionListChart: {},
    colorCodeLogs: {},
    reportTemplateCopyResponse: {},
    miscSettingsResponse: {},
    updateMiscSettings: {},
    updateDisplayOrder: {},
    initializeSpecialReportRes: {},
    criticalityData: {},
    addCriticalityData: {},
    updateCriticalityData: {},
    deleteCriticalityData: {},
    recalculateCriticalityResponse: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_ALL_PROJECTS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_PROJECTS_SUCCESS:
            return {
                ...state,
                getAllProjectsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_PROJECTS_FAILURE:
            return {
                ...state,
                getAllProjectsResponse: { success: false, ...action.error }
            };

        case actionType.ADD_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_PROJECT_SUCCESS:
            return {
                ...state,
                addProjectResponse: { success: true, ...action.response }
            };
        case actionType.ADD_PROJECT_FAILURE:
            return {
                ...state,
                addProjectResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_PROJECT_SUCCESS:
            return {
                ...state,
                updateProjectResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_PROJECT_FAILURE:
            return {
                ...state,
                updateProjectResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_PROJECT_SUCCESS:
            return {
                ...state,
                deleteProjectResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_PROJECT_FAILURE:
            return {
                ...state,
                deleteProjectResponse: { success: false, ...action.error }
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

        case actionType.GET_PROJECT_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROJECT_BY_ID_SUCCESS:
            return {
                ...state,
                getProjectByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_PROJECT_BY_ID_FAILURE:
            return {
                ...state,
                getProjectByIdResponse: { success: false, ...action.error }
            };

        case actionType.GET_BUILDING_TYPE_SETTINGS_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_BUILDING_TYPE_SETTINGS_DATA_SUCCESS:
            return {
                ...state,
                getBuildingTypeSettingsDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_BUILDING_TYPE_SETTINGS_DATA_FAILURE:
            return {
                ...state,
                getBuildingTypeSettingsDataResponse: { success: false, ...action.error }
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

        case actionType.PARSE_FCA_REQUEST:
            return {
                ...state
            };
        case actionType.PARSE_FCA_SUCCESS:
            return {
                ...state,
                parseFcaResponse: { success: true, ...action.response }
            };
        case actionType.PARSE_FCA_FAILURE:
            return {
                ...state,
                parseFcaResponse: { success: false, ...action.error }
            };
        case actionType.GET_TRADE_SETTINGS_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TRADE_SETTINGS_DATA_SUCCESS:
            return {
                ...state,
                getTradeSettingsDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_TRADE_SETTINGS_DATA_FAILURE:
            return {
                ...state,
                getTradeSettingsDataResponse: { success: false, ...action.error }
            };
        case actionType.ADD_TRADE_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_TRADE_SUCCESS:
            return {
                ...state,
                addTradeResponse: { success: true, ...action.response }
            };
        case actionType.ADD_TRADE_FAILURE:
            return {
                ...state,
                addTradeResponse: { success: false, ...action.error }
            };
        case actionType.GET_TRADE_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TRADE_BY_ID_SUCCESS:
            return {
                ...state,
                getTradeByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_TRADE_BY_ID_FAILURE:
            return {
                ...state,
                getTradeByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_TRADE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_TRADE_SUCCESS:
            return {
                ...state,
                updateTradeResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_TRADE_FAILURE:
            return {
                ...state,
                updateTradeResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_TRADE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_TRADE_SUCCESS:
            return {
                ...state,
                deleteTradeResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_TRADE_FAILURE:
            return {
                ...state,
                deleteTradeResponse: { success: false, ...action.error }
            };

        case actionType.GET_CATEGORY_SETTINGS_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CATEGORY_SETTINGS_DATA_SUCCESS:
            return {
                ...state,
                getCategorySettingsDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_CATEGORY_SETTINGS_DATA_FAILURE:
            return {
                ...state,
                getCategorySettingsDataResponse: { success: false, ...action.error }
            };
        case actionType.ADD_CATEGORY_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_CATEGORY_SUCCESS:
            return {
                ...state,
                addCategoryResponse: { success: true, ...action.response }
            };
        case actionType.ADD_CATEGORY_FAILURE:
            return {
                ...state,
                addCategoryResponse: { success: false, ...action.error }
            };
        case actionType.GET_CATEGORY_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CATEGORY_BY_ID_SUCCESS:
            return {
                ...state,
                getCategoryByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_CATEGORY_BY_ID_FAILURE:
            return {
                ...state,
                getCategoryByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_CATEGORY_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_CATEGORY_SUCCESS:
            return {
                ...state,
                updateCategoryResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_CATEGORY_FAILURE:
            return {
                ...state,
                updateCategoryResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_CATEGORY_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_CATEGORY_SUCCESS:
            return {
                ...state,
                deleteCategoryResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_CATEGORY_FAILURE:
            return {
                ...state,
                deleteCategoryResponse: { success: false, ...action.error }
            };

        case actionType.GET_FUTURE_CAPITAL_BY_SITE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FUTURE_CAPITAL_BY_SITE_SUCCESS:
            return {
                ...state,
                getFutureCapitalBySite: { success: true, ...action.response }
            };
        case actionType.GET_FUTURE_CAPITAL_BY_SITE_FAILURE:
            return {
                ...state,
                getFutureCapitalBySite: { success: false, ...action.error }
            };

        case actionType.GET_DIFFERED_MAINTENANCE_BY_SITE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DIFFERED_MAINTENANCE_BY_SITE_SUCCESS:
            return {
                ...state,
                getDifferedMaintenanceBySite: { success: true, ...action.response }
            };
        case actionType.GET_DIFFERED_MAINTENANCE_BY_SITE_FAILURE:
            return {
                ...state,
                getDifferedMaintenanceBySite: { success: false, ...action.error }
            };

        case actionType.UPDATE_PROJECT_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_PROJECT_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
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
        case actionType.GET_SYSTEM_SETTINGS_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SYSTEM_SETTINGS_DATA_SUCCESS:
            return {
                ...state,
                getSystemSettingsDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_SYSTEM_SETTINGS_DATA_FAILURE:
            return {
                ...state,
                getSystemSettingsDataResponse: { success: false, ...action.error }
            };
        case actionType.ADD_SYSTEM_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_SYSTEM_SUCCESS:
            return {
                ...state,
                addSystemResponse: { success: true, ...action.response }
            };
        case actionType.ADD_SYSTEM_FAILURE:
            return {
                ...state,
                addSystemResponse: { success: false, ...action.error }
            };
        case actionType.GET_SYSTEM_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SYSTEM_BY_ID_SUCCESS:
            return {
                ...state,
                getSystemByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_SYSTEM_BY_ID_FAILURE:
            return {
                ...state,
                getSystemByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_SYSTEM_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_SYSTEM_SUCCESS:
            return {
                ...state,
                updateSystemResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_SYSTEM_FAILURE:
            return {
                ...state,
                updateSystemResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_SYSTEM_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_SYSTEM_SUCCESS:
            return {
                ...state,
                deleteSystemResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_SYSTEM_FAILURE:
            return {
                ...state,
                deleteSystemResponse: { success: false, ...action.error }
            };
        case actionType.GET_SUB_SYSTEM_SETTINGS_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SUB_SYSTEM_SETTINGS_DATA_SUCCESS:
            return {
                ...state,
                getSubsystemSettingsDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_SUB_SYSTEM_SETTINGS_DATA_FAILURE:
            return {
                ...state,
                getSubystemSettingsDataResponse: { success: false, ...action.error }
            };
        case actionType.ADD_SUB_SYSTEM_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_SUB_SYSTEM_SUCCESS:
            return {
                ...state,
                addSubsystemResponse: { success: true, ...action.response }
            };
        case actionType.ADD_SUB_SYSTEM_FAILURE:
            return {
                ...state,
                addSubsystemResponse: { success: false, ...action.error }
            };
        case actionType.GET_SUB_SYSTEM_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SUB_SYSTEM_BY_ID_SUCCESS:
            return {
                ...state,
                getSubsystemByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_SUB_SYSTEM_BY_ID_FAILURE:
            return {
                ...state,
                getSubsystemByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_SUB_SYSTEM_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_SUB_SYSTEM_SUCCESS:
            return {
                ...state,
                updateSubsystemResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_SUB_SYSTEM_FAILURE:
            return {
                ...state,
                updateSubsystemResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_SUB_SYSTEM_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_SUB_SYSTEM_SUCCESS:
            return {
                ...state,
                deleteSubsystemResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_SUB_SYSTEM_FAILURE:
            return {
                ...state,
                deleteSubsystemResponse: { success: false, ...action.error }
            };
        case actionType.GET_DEPARTMENT_SETTINGS_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DEPARTMENT_SETTINGS_DATA_SUCCESS:
            return {
                ...state,
                getDepartmentSettingsDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_DEPARTMENT_SETTINGS_DATA_FAILURE:
            return {
                ...state,
                getDepartmentSettingsDataResponse: { success: false, ...action.error }
            };
        case actionType.ADD_DEPARTMENT_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_DEPARTMENT_SUCCESS:
            return {
                ...state,
                addDepartmentResponse: { success: true, ...action.response }
            };
        case actionType.ADD_DEPARTMENT_FAILURE:
            return {
                ...state,
                addDepartmentResponse: { success: false, ...action.error }
            };
        case actionType.GET_DEPARTMENT_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_DEPARTMENT_BY_ID_SUCCESS:
            return {
                ...state,
                getDepartmentByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_DEPARTMENT_BY_ID_FAILURE:
            return {
                ...state,
                getDepartmentByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_DEPARTMENT_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_DEPARTMENT_SUCCESS:
            return {
                ...state,
                updateDepartmentResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_DEPARTMENT_FAILURE:
            return {
                ...state,
                updateDepartmentResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_DEPARTMENT_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_DEPARTMENT_SUCCESS:
            return {
                ...state,
                deleteDepartmentResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_DEPARTMENT_FAILURE:
            return {
                ...state,
                deleteDepartmentResponse: { success: false, ...action.error }
            };
        case actionType.GET_TRADE_SETTINGS_DROPDOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TRADE_SETTINGS_DROPDOWN_SUCCESS:
            return {
                ...state,
                getTradeSettingsDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_TRADE_SETTINGS_DROPDOWN_FAILURE:
            return {
                ...state,
                getTradeSettingsDropdownResponse: { success: false, ...action.error }
            };
        case actionType.GET_SYSTEM_SETTINGS_BY_TRADE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SYSTEM_SETTINGS_BY_TRADE_SUCCESS:
            return {
                ...state,
                getSystemSettingsDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_SYSTEM_SETTINGS_BY_TRADE_FAILURE:
            return {
                ...state,
                getSystemSettingsDropdownResponse: { success: false, ...action.error }
            };
        case actionType.ADD_LIMIT_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_LIMIT_SUCCESS:
            return {
                ...state,
                addLimitResponse: { success: true, ...action.response }
            };
        case actionType.ADD_LIMIT_FAILURE:
            return {
                ...state,
                addLimitResponse: { success: false, ...action.error }
            };
        case actionType.GET_ADD_LIMIT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ADD_LIMIT_SUCCESS:
            return {
                ...state,
                getaddLimitResponse: { success: true, ...action.response }
            };
        case actionType.GET_ADD_LIMIT_FAILURE:
            return {
                ...state,
                getaddLimitResponse: { success: false, ...action.error }
            };
        case actionType.GET_GENERAL_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_GENERAL_BY_ID_SUCCESS:
            return {
                ...state,
                getGeneralByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_GENERAL_BY_ID_FAILURE:
            return {
                ...state,
                getGeneralByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_GENERAL_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_GENERAL_SUCCESS:
            return {
                ...state,
                updateGeneralResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_GENERAL_FAILURE:
            return {
                ...state,
                updateGeneralResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_GENERAL_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_GENERAL_SUCCESS:
            return {
                ...state,
                deleteGeneralResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_GENERAL_FAILURE:
            return {
                ...state,
                deleteGeneralResponse: { success: false, ...action.error }
            };

        case actionType.GET_EFCI_COLOR_CODE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_EFCI_COLOR_CODE_SUCCESS:
            return {
                ...state,
                getColorCodes: { success: true, ...action.response }
            };
        case actionType.GET_EFCI_COLOR_CODE_FAILURE:
            return {
                ...state,
                getColorCodes: { success: false, ...action.error }
            };

        case actionType.ADD_EFCI_COLOR_CODE_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_EFCI_COLOR_CODE_SUCCESS:
            return {
                ...state,
                addColorCode: { success: true, ...action.response }
            };
        case actionType.ADD_EFCI_COLOR_CODE_FAILURE:
            return {
                ...state,
                addColorCode: { success: false, ...action.error }
            };

        case actionType.UPDATE_EFCI_COLOR_CODE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_EFCI_COLOR_CODE_SUCCESS:
            return {
                ...state,
                updateColorCode: { success: true, ...action.response }
            };
        case actionType.UPDATE_EFCI_COLOR_CODE_FAILURE:
            return {
                ...state,
                updateColorCode: { success: false, ...action.error }
            };

        case actionType.DELETE_EFCI_COLOR_CODE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_EFCI_COLOR_CODE_SUCCESS:
            return {
                ...state,
                deleteColorCode: { success: true, ...action.response }
            };
        case actionType.DELETE_EFCI_COLOR_CODE_FAILURE:
            return {
                ...state,
                deleteColorCode: { success: false, ...action.error }
            };
        case actionType.GET_ALL_PROJECT_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_PROJECT_LOG_SUCCESS:
            return {
                ...state,
                getAllProjectLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_PROJECT_LOG_FAILURE:
            return {
                ...state,
                getAllProjectLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_PROJECT_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_PROJECT_LOG_SUCCESS:
            return {
                ...state,
                restoreProjectLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_PROJECT_LOG_FAILURE:
            return {
                ...state,
                restoreProjectLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_PROJECT_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_PROJECT_LOG_SUCCESS:
            return {
                ...state,
                deleteProjectLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_PROJECT_LOG_FAILURE:
            return {
                ...state,
                deleteProjectLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_CHARTS_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHARTS_PROJECT_SUCCESS:
            return {
                ...state,
                graphDetails: { success: true, ...action.response }
            };
        case actionType.GET_CHARTS_PROJECT_FAILURE:
            return {
                ...state,
                graphDetails: { success: false, ...action.error }
            };
        case actionType.GET_ALL_PROJECT_IMPORT_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_PROJECT_IMPORT_LOG_SUCCESS:
            return {
                ...state,
                getAllProjectImportHistoryResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_PROJECT_IMPORT_LOG_FAILURE:
            return {
                ...state,
                getAllProjectImportHistoryResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_PROJECT_IMPORT_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_PROJECT_IMPORT_LOG_SUCCESS:
            return {
                ...state,
                deleteProjectHistoryResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_PROJECT_IMPORT_LOG_FAILURE:
            return {
                ...state,
                deleteProjectHistoryResponse: { success: false, ...action.error }
            };
        case actionType.GET_PROJECTS_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROJECTS_EXPORT_SUCCESS:
            return {
                ...state,
                projectExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_PROJECTS_EXPORT_FAILURE:
            return {
                ...state,
                projectExportResponse: { success: false, ...action.error }
            };

        case actionType.GET_EFCI_BY_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_EFCI_BY_PROJECT_SUCCESS:
            return {
                ...state,
                getEfciByProject: { success: true, ...action.response }
            };
        case actionType.GET_EFCI_BY_PROJECT_FAILURE:
            return {
                ...state,
                getEfciByProject: { success: false, ...action.error }
            };

        //log by chart

        // case actionType.GET_ANNUAL_FUNDING_OPTIONS_CHART_LOGS_PROJECT_REQUEST:
        //     return {
        //         ...state
        //     };
        // case actionType.GET_ANNUAL_FUNDING_OPTIONS_CHART_LOGS_PROJECT_SUCCESS:
        //     return {
        //         ...state,
        //         getFundingOptionByChartLog: { success: true, ...action.response }
        //     };
        // case actionType.GET_ANNUAL_FUNDING_OPTIONS_CHART_LOGS_PROJECT_FAILURE:
        //     return {
        //         ...state,
        //         getFundingOptionByChartLog: { success: false, ...action.error }
        //     };
        case actionType.GET_FUNDING_EFCI_CHART_LOGS_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FUNDING_EFCI_CHART_LOGS_PROJECT_SUCCESS:
            return {
                ...state,
                getFundingSiteEfciByChartLog: { success: true, ...action.response }
            };
        case actionType.GET_FUNDING_EFCI_CHART_LOGS_PROJECT_FAILURE:
            return {
                ...state,
                getFundingSiteEfciByChartLog: { success: false, ...action.error }
            };
        case actionType.GET_TOTAL_FUNDING_EFCI_CHART_LOGS_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TOTAL_FUNDING_EFCI_CHART_LOGS_PROJECT_SUCCESS:
            return {
                ...state,
                getTotalFundingByChartLog: { success: true, ...action.response }
            };
        case actionType.GET_TOTAL_FUNDING_EFCI_CHART_LOGS_PROJECT_FAILURE:
            return {
                ...state,
                getTotalFundingByChartLog: { success: false, ...action.error }
            };
        // case actionType.GET_CSP_CHART_LOGS_PROJECT_REQUEST:
        //     return {
        //         ...state
        //     };
        // case actionType.GET_CSP_CHART_LOGS_PROJECT_SUCCESS:
        //     return {
        //         ...state,
        //         getCapitalSpendingPlanByChartLogs: { success: true, ...action.response }
        //     };
        // case actionType.GET_CSP_CHART_LOGS_PROJECT_FAILURE:
        //     return {
        //         ...state,
        //         getCapitalSpendingPlanByChartLogs: { success: false, ...action.error }
        //     };
        // case actionType.GET_ANNUAL_EFCI_CHART_LOGS_PROJECT_REQUEST:
        //     return {
        //         ...state
        //     };
        // case actionType.GET_ANNUAL_EFCI_CHART_LOGS_PROJECT_SUCCESS:
        //     return {
        //         ...state,
        //         getAnnualEfciByChartLogs: { success: true, ...action.response }
        //     };
        // case actionType.GET_ANNUAL_EFCI_CHART_LOGS_PROJECT_FAILURE:
        //     return {
        //         ...state,
        //         getAnnualEfciByChartLogs: { success: false, ...action.error }
        //     };

        // chart efci
        case actionType.GET_CHART_EFCI_PROJECT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CHART_EFCI_PROJECT_SUCCESS:
            console.log("");
            return {
                ...state,
                getEfciBySiteGraph: { success: true, ...action.response }
            };
        case actionType.GET_CHART_EFCI_PROJECT_FAILURE:
            return {
                ...state,
                getEfciBySiteGraph: { success: false, ...action.error }
            };

        // case actionType.UPDATE_CAPITAL_SPENDING_PLAN_CHART_PROJECT_SUCCESS:
        //     return {
        //         ...state,
        //         updateCapitalSpendingPlanChart: { success: true, ...action.response }
        //     };
        // case actionType.UPDATE_CAPITAL_SPENDING_PLAN_CHART_PROJECT_FAILURE:
        //     return {
        //         ...state,
        //         updateCapitalSpendingPlanChart: { success: false, ...action.error }
        //     };

        // case actionType.UPDATE_FUNDING_OPTION_CHART_PROJECT_REQUEST:
        //     return {
        //         ...state
        //     };
        // case actionType.UPDATE_FUNDING_OPTION_CHART_PROJECT_SUCCESS:
        //     return {
        //         ...state,
        //         updateFundingOptionChart: { success: true, ...action.response }
        //     };
        // case actionType.UPDATE_FUNDING_OPTION_CHART_PROJECT_FAILURE:
        //     return {
        //         ...state,
        //         updateFundingOptionChart: { success: false, ...action.error }
        //     };

        // case actionType.HIDE_FUNDING_OPTION_CHART_PROJECT_REQUEST:
        //     return {
        //         ...state
        //     };
        // case actionType.HIDE_FUNDING_OPTION_CHART_PROJECT_SUCCESS:
        //     return {
        //         ...state,
        //         hiddenFundingOptionListChart: action.response
        //     };
        // case actionType.HIDE_FUNDING_OPTION_CHART_PROJECT_FAILURE:
        //     return {
        //         ...state,
        //         hiddenFundingOptionListChart: []
        //     };

        // case actionType.SAVE_EFCI_PROJECT_REQUEST:
        //     return {
        //         ...state
        //     };
        // case actionType.SAVE_EFCI_PROJECT_SUCCESS:
        //     return {
        //         ...state,
        //         saveEfci: { success: true, ...action.response }
        //     };
        // case actionType.SAVE_EFCI_PROJECT_FAILURE:
        //     return {
        //         ...state,
        //         saveEfci: { success: false, ...action.error }
        //     };
        // case actionType.SAVE_EFCI_PROJECT_REQUEST:
        //     return {
        //         ...state
        //     };
        case actionType.LOAD_EFCI_PROJECT_SUCCESS:
            return {
                ...state,
                loadEfciChart: { success: true, ...action.response }
            };
        case actionType.LOAD_EFCI_PROJECT_FAILURE:
            return {
                ...state,
                loadEfciChart: { success: false, ...action.error }
            };

        // case actionType.ADD_EFCI_ACTIVE_TAB_PROJECT_REQUEST:
        //     return {
        //         ...state
        //     };
        // case actionType.ADD_EFCI_ACTIVE_TAB_PROJECT_SUCCESS:
        //     return {
        //         ...state,
        //         efciTabData: { success: true, ...action.response }
        //     };
        // case actionType.ADD_EFCI_ACTIVE_TAB_PROJECT_FAILURE:
        //     return {
        //         ...state,
        //         efciTabData: { success: false, ...action.error }
        //     };
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

        //Efci Logs
        case actionType.GET_PROJECT_ANNUAL_FUNDING_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROJECT_ANNUAL_FUNDING_LOG_SUCCESS:
            return {
                ...state,
                annualFundingLogs: { success: true, ...action.response }
            };
        case actionType.GET_PROJECT_ANNUAL_FUNDING_LOG_FAILURE:
            return {
                ...state,
                annualFundingLogs: { success: false, ...action.error }
            };
        case actionType.GET_PROJECT_FUNDING_EFCI_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROJECT_FUNDING_EFCI_LOG_SUCCESS:
            return {
                ...state,
                FundingEFCILogs: { success: true, ...action.response }
            };
        case actionType.GET_PROJECT_FUNDING_EFCI_LOG_FAILURE:
            return {
                ...state,
                FundingEFCILogs: { success: false, ...action.error }
            };
        case actionType.GET_PROJECT_FUNDING_COST_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROJECT_FUNDING_COST_LOG_SUCCESS:
            return {
                ...state,
                FundingCostLogs: { success: true, ...action.response }
            };
        case actionType.GET_PROJECT_FUNDING_COST_LOG_FAILURE:
            return {
                ...state,
                FundingCostLogs: { success: false, ...action.error }
            };
        case actionType.GET_PROJECT_ANNUAL_EFCI_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROJECT_ANNUAL_EFCI_LOG_SUCCESS:
            return {
                ...state,
                annualEfciLogs: { success: true, ...action.response }
            };
        case actionType.GET_PROJECT_ANNUAL_EFCI_LOG_FAILURE:
            return {
                ...state,
                annualEfciLogs: { success: false, ...action.error }
            };
        case actionType.GET_PROJECT_CSP_SUMMARY_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_PROJECT_CSP_SUMMARY_LOG_SUCCESS:
            return {
                ...state,
                cspSummaryLog: { success: true, ...action.response }
            };
        case actionType.GET_PROJECT_CSP_SUMMARY_LOG_FAILURE:
            return {
                ...state,
                cspSummaryLog: { success: false, ...action.error }
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
        case actionType.GET_COLOR_CODE_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_COLOR_CODE_LOG_SUCCESS:
            return {
                ...state,
                colorCodeLogs: { success: true, ...action.response }
            };
        case actionType.GET_COLOR_CODE_LOG_FAILURE:
            return {
                ...state,
                colorCodeLogs: { success: false, ...action.error }
            };
        case actionType.COPY_REPORT_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.COPY_REPORT_TEMPLATE_SUCCESS:
            return {
                ...state,
                reportTemplateCopyResponse: { success: true, ...action.response }
            };
        case actionType.COPY_REPORT_TEMPLATE_FAILURE:
            return {
                ...state,
                reportTemplateCopyResponse: { success: false, ...action.error }
            };
        case actionType.GET_MISC_SETTINGS_REQUEST:
            return {
                ...state
            };
        case actionType.GET_MISC_SETTINGS_SUCCESS:
            return {
                ...state,
                miscSettingsResponse: { success: true, ...action.response }
            };
        case actionType.GET_MISC_SETTINGS_FAILURE:
            return {
                ...state,
                miscSettingsResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_MISC_SETTINGS_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_MISC_SETTINGS_SUCCESS:
            return {
                ...state,
                updateMiscSettings: { success: true, ...action.response }
            };
        case actionType.UPDATE_MISC_SETTINGS_FAILURE:
            return {
                ...state,
                updateMiscSettings: { success: false, ...action.error }
            };
        case actionType.UPDATE_DISPLAY_ORDER_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_DISPLAY_ORDER_SUCCESS:
            return {
                ...state,
                updateDisplayOrder: { success: true, ...action.response }
            };
        case actionType.UPDATE_DISPLAY_ORDER_FAILURE:
            return {
                ...state,
                updateDisplayOrder: { success: false, ...action.error }
            };

        case actionType.INITIALIZE_SPECIAL_REPORT_REQUEST:
            return {
                ...state
            };
        case actionType.INITIALIZE_SPECIAL_REPORT_SUCCESS:
            return {
                ...state,
                initializeSpecialReportRes: { success: true, ...action.response }
            };
        case actionType.INITIALIZE_SPECIAL_REPORT_FAILURE:
            return {
                ...state,
                initializeSpecialReportRes: { success: false, ...action.error }
            };

        //sfci

        case actionType.GET_SFCI_COLOR_CODE_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SFCI_COLOR_CODE_SUCCESS:
            return {
                ...state,
                getColorCodeSfci: { success: true, ...action.response }
            };
        case actionType.GET_SFCI_COLOR_CODE_FAILURE:
            return {
                ...state,
                getColorCodeSfci: { success: false, ...action.error }
            };

        case actionType.ADD_SFCI_COLOR_CODE_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_SFCI_COLOR_CODE_SUCCESS:
            return {
                ...state,
                addColorCodeSfci: { success: true, ...action.response }
            };
        case actionType.ADD_SFCI_COLOR_CODE_FAILURE:
            return {
                ...state,
                addColorCodeSfci: { success: false, ...action.error }
            };

        case actionType.UPDATE_SFCI_COLOR_CODE_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_SFCI_COLOR_CODE_SUCCESS:
            return {
                ...state,
                updateColorCodeSfci: { success: true, ...action.response }
            };
        case actionType.UPDATE_SFCI_COLOR_CODE_FAILURE:
            return {
                ...state,
                updateColorCodeSfci: { success: false, ...action.error }
            };

        case actionType.DELETE_SFCI_COLOR_CODE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_SFCI_COLOR_CODE_SUCCESS:
            return {
                ...state,
                deleteColorCodeSfci: { success: true, ...action.response }
            };
        case actionType.DELETE_SFCI_COLOR_CODE_FAILURE:
            return {
                ...state,
                deleteColorCodeSfci: { success: false, ...action.error }
            };
        case actionType.GET_RECOMMENDATION_PRIORITY_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_RECOMMENDATION_PRIORITY_DATA_SUCCESS:
            return {
                ...state,
                priorityElementsData: { success: true, ...action.response }
            };
        case actionType.GET_RECOMMENDATION_PRIORITY_DATA_FAILURE:
            return {
                ...state,
                priorityElementsData: { success: false, ...action.error }
            };
        case actionType.UPDATE_RECOMMENDATION_PRIORITY_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_RECOMMENDATION_PRIORITY_DATA_SUCCESS:
            return {
                ...state,
                updatePriorityElementsResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_RECOMMENDATION_PRIORITY_DATA_FAILURE:
            return {
                ...state,
                updatePriorityElementsResponse: { success: false, ...action.error }
            };
        case actionType.GET_CRITICALITY_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CRITICALITY_DATA_SUCCESS:
            return {
                ...state,
                criticalityData: { success: true, ...action.response }
            };
        case actionType.GET_CRITICALITY_DATA_FAILURE:
            return {
                ...state,
                criticalityData: { success: false, ...action.error }
            };
        case actionType.ADD_CRITICALITY_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_CRITICALITY_DATA_SUCCESS:
            return {
                ...state,
                addCriticalityData: { success: true, ...action.response }
            };
        case actionType.ADD_CRITICALITY_DATA_FAILURE:
            return {
                ...state,
                addCriticalityData: { success: false, ...action.error }
            };
        case actionType.UPDATE_CRITICALITY_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_CRITICALITY_DATA_SUCCESS:
            return {
                ...state,
                updateCriticalityData: { success: true, ...action.response }
            };
        case actionType.UPDATE_CRITICALITY_DATA_FAILURE:
            return {
                ...state,
                updateCriticalityData: { success: false, ...action.error }
            };
        case actionType.DELETE_CRITICALITY_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_CRITICALITY_DATA_SUCCESS:
            return {
                ...state,
                deleteCriticalityData: { success: true, ...action.response }
            };
        case actionType.DELETE_CRITICALITY_DATA_FAILURE:
            return {
                ...state,
                deleteCriticalityData: { success: false, ...action.error }
            };
        case actionType.RECALCULATE_CRITICALITY_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.RECALCULATE_CRITICALITY_DATA_SUCCESS:
            return {
                ...state,
                recalculateCriticalityResponse: { success: true, ...action.response }
            };
        case actionType.RECALCULATE_CRITICALITY_DATA_FAILURE:
            return {
                ...state,
                recalculateCriticalityResponse: { success: false, ...action.error }
            };
        default:
            return state;
    }
};
