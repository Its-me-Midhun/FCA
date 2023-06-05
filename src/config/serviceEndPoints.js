export const commonEndPoints = {
    exportChartsToPdf: "/fca/graph/pdf/",
    exportChartsWord: "/fca/graph/word/",
    exportChartsPpt: "/fca/graph/pptx/",
    getActiveChartProperties: "/chart/template/active_property/",

    getLinkEmail: "/fca/recommendation/file/validate_link/",
    exportDataTableToWord: "/fca/recommendation/graph-data/word/",
    exportDataTableToExcel: "/fca/recommendation/graph-data/excel/",
    exportEFCIDataTableToExcel: "/fca/export/graph-data/efci/excel/",
    exportEfciDataTableToWord: "/fca/export/graph-data/efci/word/"
};

export const userEndPoints = {
    loginUser: "/oauth/token",
    logoutUser: "api/v1/sessions",
    getMenuItems: "/api/v1/users/menu",
    forgotPassword: "/api/v1/passwords/forgot",
    resetPassword: "/api/v1/passwords/reset",
    resetPasswordProfile: "/api/v1/users",
    verifyToken: "/api/v1/passwords/token_verification"
};
export const initiativeEndPoints = {
    getInitiatives: "api/v1/initiatives",
    getAllProjectDropdown: "api/v1/consultancies/projects_dropdown",
    logDetails: "api/v1/logs",
    assignProject: "api/v1/initiatives/assign"
};
export const landingPageEndPoints = {
    getBuildingStatistics: "/api/v1/dashboard/landing_page_widget",
    getLandingPageData: "/api/v1/landing_pages"
};
export const dashboardEndPoints = {
    getDashboard: "api/v1/dashboard",
    getFciChart: "api/v1/dashboard/fci_chart",
    getMap: "api/v1/dashboard/map",
    getHorizontalChart: "api/v1/dashboard/horizontal_chart",
    getChartsDashboard: "api/v1/dashboard/charts",
    getAllLegents: "/api/v1/dashboard/legends",
    getFcaChartExcelExport: "/api/v1/dashboard/export_chart",
    getHorizontalChartExport: "/api/v1/dashboard/export_horizontal_chart",
    getFciChartExcelExport: "/api/v1/dashboard/export_fci_chart",
    landingPageData: "/api/v1/landing_pages",
    widgetData: "/api/v1/dashboard/landing_page_widget",
    getChartsDashboardPython: "/fca/recommendation/graph-data/chart/",
    getMasterFilter: {
        projects: "api/v1/master_filters/projects",
        sites: "api/v1/master_filters/sites",
        regions: "api/v1/master_filters/regions",
        building_types: "api/v1/master_filters/building_types",
        buildings: "api/v1/master_filters/buildings",
        clients: "api/v1/master_filters/clients",
        color_codes: "/api/v1/master_filters/color_codes",
        infrastructure_requests: "/api/v1/master_filters/infrastructure_requests",
        fmp: "/api/v1/master_filters/facility_master_plan",
        additions: "/api/v1/master_filters/additions",
        divisions: "/api/v1/master_filters/divisions",
        primary_use: "/api/v1/master_filters/primary_use",
        secondary_use: "/api/v1/master_filters/secondary_use",
        sectors: "/api/v1/master_filters/sectors",
        internal_groups: "/api/v1/master_filters/internal_groups"
    }
};

export const regionEndPoints = {
    getAllRegions: "/api/v1/regions",
    getAllRegionsByProject: "/api/v1/projects",
    addRegion: "/api/v1/regions",
    updateRegion: "/api/v1/regions",
    deleteRegion: "/api/v1/regions",
    getAllConsultancyUsers: "/api/v1/consultancies/users",
    getAllClients: "/api/v1/consultancies/clients",
    getRegionById: "/api/v1/regions",
    uploadImage: "/api/v1/regions",
    getAllImages: "/api/v1/regions",
    deleteImages: "/api/v1/regions",
    updateImageComment: "/api/v1/regions",
    getListForCommonFilter: "/api/v1/regions",
    exportRegion: "/api/v1/regions",
    getAllLogs: "/api/v1/regions",
    restoreRegionLog: "/api/v1/logs",
    deleteRegionLog: "/api/v1/logs",
    getEfciByRegion: "/api/v1/projects",
    updateEfciData: "/api/v1/main_funding_options",
    updateFCEfci: "/api/v1/main_fcis",
    updateRegionAnnualFundingOption: "/api/v1/main_annual_fundings",
    updateRegionAnnualEfci: "/api/v1/main_annual_fcis",
    updateCspSummary: "/api/v1/main_csps",
    getAllClientUsers: "api/v1/consultancies",
    getAllConsultanciesDropdown: "api/v1/groups"
};

export const logEndPoints = {
    getAllLogs: "/api/v1/user_activity_logs",
    addLog: "/api/v1/user_activity_logs",
    getAllLogsByProject: "/api/v1/projects",
    updateLog: "/api/v1/regions",
    deleteLog: "/api/v1/regions",
    getAllConsultancyUsers: "/api/v1/consultancies/users",
    getAllClients: "/api/v1/consultancies/clients",
    getLogById: "/api/v1/regions",
    uploadImage: "/api/v1/regions",
    getAllImages: "/api/v1/regions",
    deleteImages: "/api/v1/regions",
    updateImageComment: "/api/v1/regions",
    getListForCommonFilter: "/api/v1/regions",
    exportLog: "/api/v1/regions",
    restoreLogLog: "/api/v1/logs",
    deleteLogLog: "/api/v1/logs",
    getEfciByLog: "/api/v1/projects",
    updateEfciData: "/api/v1/main_funding_options",
    updateFCEfci: "/api/v1/main_fcis",
    updateLogAnnualFundingOption: "/api/v1/main_annual_fundings",
    updateLogAnnualEfci: "/api/v1/main_annual_fcis",
    updateCspSummary: "/api/v1/main_csps",
    getAllClientUsers: "api/v1/consultancies",
    getAllConsultanciesDropdown: "api/v1/groups"
};

export const siteEndPoints = {
    getAllSites: "/api/v1/sites",
    addSite: "/api/v1/sites",
    updateSite: "/api/v1/sites",
    deleteSite: "/api/v1/sites",
    getRegionsBasedOnClient: "api/v1/consultancies/regions_dropdown",
    getAllConsultancyUsers: "/api/v1/consultancies/users",
    getAllClients: "/api/v1/consultancies/clients",
    getSiteById: "/api/v1/sites",
    uploadImage: "/api/v1/sites",
    getAllImages: "/api/v1/sites",
    deleteImages: "/api/v1/sites",
    updateImageComment: "/api/v1/sites",
    getChart: "/api/v1/projects",
    getListForCommonFilter: "/api/v1/sites",
    getEfci: "api/v1/sites",
    exportSite: "api/v1/sites",

    updateCapitalSpendingPlan: "api/v1/site_csps",
    updateFundingOption: "api/v1/site_funding_options",
    updateAnnualEfci: "api/v1/site_annual_fcis",
    updateAnnualFunding: "api/v1/site_annual_fundings",
    updateFundingSiteEfci: "api/v1/site_fcis",

    updateCapitalSpendingPlanChart: "api/v1/temp_csps",
    updateFundingOptionChart: "api/v1/temp_funding_options",
    updateAnnualEfciChart: "api/v1/temp_annual_fcis",
    updateAnnualFundingChart: "api/v1/temp_annual_fundings",
    updateFundingSiteEfciChart: "api/v1/temp_fcis",

    getAllSiteLogs: "/api/v1/sites",
    restoreSiteLog: "/api/v1/logs",
    deleteSiteLog: "/api/v1/logs",
    deleteEfciLog: "api/v1/efci_versions",
    getAllClientUsers: "api/v1/consultancies",
    getAllConsultanciesDropdown: "api/v1/groups"
};

export const projectEndPoints = {
    getAllProjects: "/api/v1/projects",
    addProject: "/api/v1/projects",
    updateProject: "/api/v1/projects",
    deleteProject: "/api/v1/projects",
    getRegionsBasedOnClient: "/api/v1/clients",
    getAllConsultancyUsers: "/api/v1/consultancies/users",
    getAllClients: "/api/v1/consultancies/clients",
    getProjectById: "/api/v1/projects",
    getFutureCapitalBySite: "api/v1/projects",
    getDepartmentByProject: "/api/v1/projects",
    getDifferedMaintenanceBySite: "/api/v1/projects",
    uploadImage: "/api/v1/projects",
    getAllImages: "/api/v1/projects",
    deleteImages: "/api/v1/projects",
    parseFca: "/api/v1/projects",
    updateImageComment: "/api/v1/projects",
    getBuildingTypeSettingsData: "/api/v1/projects",
    updateBuildingTypeSettings: "/api/v1/projects",
    getTradeSettingsData: "/api/v1/projects",
    addTrade: "/api/v1/projects",
    getTradeById: "/api/v1/projects",
    updateTrade: "/api/v1/projects",
    deleteTrade: "/api/v1/projects",
    getCategorySettingsData: "/api/v1/projects",
    addCategory: "/api/v1/projects",
    getCategoryById: "/api/v1/projects",
    updateCategory: "/api/v1/projects",
    deleteCategory: "/api/v1/projects",
    getListForCommonFilter: "/api/v1/projects",
    getSystemSettingsData: "/api/v1/projects",
    addSystem: "/api/v1/projects",
    getSystemById: "/api/v1/projects",
    updateSystem: "/api/v1/projects",
    deleteSystem: "/api/v1/projects",
    getSubsystemSettingsData: "/api/v1/projects",
    addSubsystem: "/api/v1/projects",
    getSubsystemById: "/api/v1/projects",
    updateSubsystem: "/api/v1/projects",
    deleteSubsystem: "/api/v1/projects",
    getDepartmentSettingsData: "/api/v1/projects",
    addDepartment: "/api/v1/projects",
    getDepartmentById: "/api/v1/projects",
    updateDepartment: "/api/v1/projects",
    deleteDepartment: "/api/v1/projects",
    addLimit: "/api/v1/projects",
    getaddLimit: "/api/v1/projects",
    getGeneralById: "/api/v1/projects",
    updateGeneral: "/api/v1/projects",
    deleteGeneral: "/api/v1/projects",
    getTradeSettingsDropdown: "/api/v1/projects",
    getSystemSettingsDropdown: "/api/v1/projects",
    getFundingsourceSettingsData: "/api/v1/projects",
    addFundingsource: "/api/v1/projects",
    getFundingsourceById: "/api/v1/projects",
    updateFundingsource: "/api/v1/projects",
    deleteFundingsource: "/api/v1/projects",
    addPriority: "/api/v1/projects",
    getPriority: "/api/v1/projects",
    getPriorityById: "/api/v1/projects",
    updatePriority: "/api/v1/projects",
    deletePriority: "/api/v1/projects",
    exportProject: "api/v1/projects",
    getColorCodes: "api/v1/projects",
    getAllProjectLogs: "/api/v1/projects",
    restoreProjectLog: "/api/v1/logs",
    deleteProjectLog: "/api/v1/logs",
    getAllDepartmentLogs: "/api/v1/projects",
    restoreSettingsLog: "/api/v1/logs",
    deleteSettingsLog: "/api/v1/logs",
    getAllTradeLogs: "/api/v1/projects",
    getAllCategoryLogs: "/api/v1/projects",
    getAllSystemLogs: "/api/v1/projects",
    getAllGeneralLogs: "/api/v1/projects",
    getAllSubSystemLogs: "/api/v1/projects",
    getAllFundingSourceLogs: "/api/v1/projects",
    getAllPriorityLogs: "/api/v1/projects",
    getProjectImportHistory: "/api/v1/projects",
    deleteProjectHistory: "/api/v1/projects",
    exportImportProject: "/api/v1/projects",
    getAssetConditionSettingsData: "/api/v1/projects",
    addAssetCondition: "/api/v1/projects",
    getAssetConditionById: "/api/v1/projects",
    updateAssetCondition: "/api/v1/projects",
    deleteAssetCondition: "/api/v1/projects",
    getAllAssetConditionLogs: "/api/v1/projects",
    getEfciByProject: "/api/v1/projects",
    getAllClientUsers: "api/v1/consultancies",
    getAllConsultanciesDropdown: "api/v1/groups",
    forceUpdate: "/api/v1/annual_funding_options/force_efci_update",
    getMiscSettings: "/api/v1/projects",
    updateDisplayOrder: "/api/v1/projects",
    initializeSpecialReport: "/api/v1/projects",
    getRecommendationPriorityData: "/api/v1/priority_elements",
    updateRecommendationPriority: "/api/v1/priority_elements",
    getCriticalityData: "/api/v1/projects",
    addCriticality: "/api/v1/projects",
    updateCriticality: "/api/v1/projects",
    deleteCriticality: "/api/v1/projects",
    recalculate: "/api/v1/projects",
    getSitesByRegionInPriority: "/api/v1/regions",
    getCapitalTypeSettingsData: "/api/v1/projects",

    //python end points
    copyGlobalReportTemplates: "/reports/global_to_project/"
};

export const buildingTypeEndPoints = {
    getAllBuildingTypes: "/api/v1/main_building_types",
    addBuildingType: "/api/v1/main_building_types",
    updateBuildingType: "/api/v1/main_building_types",
    deleteBuildingType: "/api/v1/main_building_types",
    getRegionsBasedOnClient: "api/v1/consultancies/regions_dropdown",
    getAllConsultancyUsers: "/api/v1/consultancies/users",
    getAllClients: "/api/v1/consultancies/clients",
    getBuildingTypeById: "/api/v1/main_building_types",
    uploadImage: "/api/v1/main_building_types",
    getAllImages: "/api/v1/main_building_types",
    deleteImages: "/api/v1/main_building_types",
    parseFca: "/api/v1/main_building_types",
    updateImageComment: "/api/v1/main_building_types",
    getListForCommonFilter: "/api/v1/main_building_types",
    getAllBuildingTypeLogs: "/api/v1/main_building_types",
    restoreBuildingTypeLog: "/api/v1/logs",
    deleteBuildingTypeLog: "/api/v1/logs",
    exportBuildingType: "/api/v1/main_building_types",
    colorCodeBuildingType: "/api/v1/main_building_types"
};

export const recommendationEndPoints = {
    getAllRecommendationsById: "/api/v1/projects",
    getAllRecommendationsByIdRegion: "/api/v1/recommendations",
    getAllRecommendations: "/api/v1/recommendations",
    addRecommendation: "/api/v1/recommendations",
    updateRecommendation: "/api/v1/recommendations",
    updateMultipleRecommendations: "/api/v1/recommendations/update_multiple",
    deleteRecommendation: "/api/v1/recommendations",
    getRegionsBasedOnClient: "/api/v1/clients",
    getBuildingsBasedOnSite: "/api/v1/sites",
    getCategoryBasedOnProject: "/api/v1/projects",
    getCapitalTypeBasedOnProject: "/api/v1/projects",
    getFloorBasedOnBuilding: "/api/v1/buildings",
    getAdditionBasedOnBuilding: "/api/v1/buildings",
    getCostYearByProject: "/api/v1/projects",
    getSystemBasedOnProject: "/api/v1/projects",
    getFundingSourceByProject: "/api/v1/projects",
    getSubSystemBasedOnProject: "/api/v1/projects",
    getTradeBasedOnProject: "/api/v1/projects",
    getAllConsultancyUsers: "/api/v1/consultancies/users",
    getAllClients: "/api/v1/consultancies/clients",
    getRecommendationById: "/api/v1/recommendations",
    uploadImage: "/api/v1/recommendations",
    getAllImages: "/api/v1/recommendations",
    deleteImages: "/api/v1/recommendations",
    updateImageComment: "/api/v1/recommendations",
    getListForCommonFilter: "/api/v1/recommendations",
    updateMaintenanceYearCutPaste: "/api/v1/recommendations",
    exportRecommendations: "/api/v1/recommendations",
    exportAllTrades: "/api/v1/recommendations",
    recoverRecommendation: "/api/v1/recommendations",
    getAllRecommendationLogs: "/api/v1/recommendations",
    restoreRecommendationLog: "/api/v1/recommendation_versions",
    deleteRecommendationLog: "/api/v1/recommendation_versions",
    getInitiativeDropdown: "api/v1/consultancies/initiatives_dropdown",
    getReportNoteTemplates: "api/v1",
    downloadPdfReport: "/reports/recommendation_report/",
    assignImagesToRecom: "/api/v1/recommendations",
    unAssignImage: "/api/v1/images",
    updateBudgetPriority: "/api/v1/recommendations",
    updateFMP: "/api/v1/recommendations",
    updateIR: "/api/v1/recommendations",
    getAllBudgetPriorityRecommendations: "/api/v1/dashboard/budget_priority",
    exportBudgetPriority: "/api/v1/dashboard/export_budget_priority",
    getListForBudgetPriorityFilter: "/api/v1/dashboard/get_list",
    getRecommendationTemplates: "/api/v1",
    getUserDefaultTrade: "/api/v1/projects",
    getRecommendationCommonDataByIds: "/api/v1/recommendations/edit_multiple",
    getAllRecommendationIds: "/api/v1/recommendations/recommendation_ids",
    getPriorityElementDropDownData: "/api/v1/projects",
    getPdfforReport: "/fca/recommendation/pager/",
    exportSelectedRecomWord: "/fca/recommendations/report/word/",
    exportSelectedRecomPDF: "/fca/recommendations/report/pdf/",
    getCriticalityDropDownData: "/api/v1/projects",
    exportToWord: "/fca/recommendation/export/word/",
    getCapitalTypeDropDownData: "/api/v1/projects",
    getImportTableWord: "/fca/recommendation/file/list/",
    updateNoteImportTableWord: "/fca/recommendation/file/",
    getExportExcelFromExport: "/fca/recommendation/file/excel/",
    exportToExcelFile: "/fca/recommendation/export/excel/",
    getExportColumns: "/fca/recommendation/table/settings/",
    getExportPropertyDropdown: "/fca/recommendation/table/property/list/",
    postExportColumns: "/fca/recommendation/table/create-update/",
    lockRecommendation: "/api/v1/recommendations"
};

export const buildingEndPoints = {
    getAllBuildings: "/api/v1/buildings",
    addBuilding: "/api/v1/buildings",
    updateBuilding: "/api/v1/buildings",
    deleteBuilding: "/api/v1/buildings",
    getRegionsBasedOnClient: "/api/v1/clients",
    getProjectsBasedOnClient: "/api/v1/consultancies",
    getSitesBasedOnRegion: "/api/v1/regions",
    getAllConsultancyUsers: "/api/v1/consultancies/users",
    getAllClients: "/api/v1/consultancies/clients",
    getBuildingById: "/api/v1/buildings",
    getEfciBasedOnProject: "/api/v1/projects",
    updateCapitalSpendingPercentage: "/api/v1/capital_spending_plans",
    updateAnnualFundingOption: "api/v1/annual_funding_options",
    updateFci: "api/v1/annual_fcis",
    updateFundingCost: "api/v1/funding_options",
    updateFundingEfci: "api/v1/fcis",
    getAllCountries: "/rest/v2/all",
    getBuildingsBasedOnSite: "/api/v1/sites",
    uploadImage: "/api/v1/buildings",
    getAllImages: "/api/v1/buildings",
    deleteImages: "/api/v1/buildings",
    updateImageComment: "/api/v1/buildings",
    getListForCommonFilter: "/api/v1/buildings",
    getBuildingTypesBasedOnClient: "/api/v1/buildings",
    updateBuildingLock: "/api/v1/buildings",
    exportBuildings: "/api/v1/buildings",
    getAllBuildingLogs: "/api/v1/buildings",
    restoreBuildingLog: "/api/v1/logs",
    deleteBuildingLog: "/api/v1/logs",
    getAllClientUsers: "api/v1/consultancies",
    getAllConsultanciesDropdown: "api/v1/groups"
};

export const floorEndPoints = {
    getFloorsBasedOnBuilding: "/api/v1/buildings",
    addFloor: "api/v1/buildings",
    getFloorById: "api/v1/buildings",
    updateFloor: "api/v1/buildings",
    deleteFloor: "api/v1/buildings",
    getListForCommonFilter: "/api/v1/buildings",
    getAllFloorLogs: "/api/v1/floors",
    restoreFloorLog: "/api/v1/logs",
    deleteFloorLog: "/api/v1/logs",
    getAllClientUsers: "api/v1/consultancies",
    getAllConsultancyUsers: "/api/v1/consultancies/users",
    getAllConsultanciesDropdown: "api/v1/groups",
    getAllClients: "/api/v1/consultancies/clients",
    getAllBuildingsDropdown: "api/v1/consultancies"
};

export const additionEndPoints = {
    getAdditionsBasedOnBuilding: "/api/v1/buildings",
    addAddition: "api/v1/buildings",
    getAdditionById: "api/v1/buildings",
    updateAddition: "api/v1/buildings",
    deleteAddition: "api/v1/buildings",
    getListForCommonFilter: "/api/v1/buildings",
    getAllAdditionLogs: "/api/v1/additions",
    restoreAdditionLog: "/api/v1/logs",
    deleteAdditionLog: "/api/v1/logs",
    getAllClientUsers: "api/v1/consultancies",
    getAllConsultancyUsers: "/api/v1/consultancies/users",
    getAllConsultanciesDropdown: "api/v1/groups",
    getAllClients: "/api/v1/consultancies/clients",
    getAllBuildingsDropdown: "api/v1/consultancies"
};

export const clientEndPoints = {
    getAllClients: "/api/v1/clients",
    addClient: "api/v1/clients",
    getClientById: "api/v1/clients",
    updateClient: "api/v1/clients",
    deleteClient: "api/v1/clients",
    getListForCommonFilter: "/api/v1/clients",
    getAllClientLogs: "/api/v1/clients",
    restoreClientLog: "/api/v1/logs",
    deleteClientLog: "/api/v1/logs",
    exportClient: "/api/v1/clients",
    copyGlobalChartTemplates: "/chart/template/copy_properties/"
};

export const usersEndPoints = {
    getAllUsers: "/api/v1/users",
    addUser: "api/v1/users",
    getUserById: "api/v1/users",
    updateUser: "api/v1/users",
    deleteUser: "api/v1/users",
    getListForCommonFilter: "/api/v1/users",
    getAllUserLogs: "/api/v1/users",
    restoreUserLog: "/api/v1/logs",
    deleteUserLog: "/api/v1/logs",
    exportUser: "/api/v1/users",
    userPermissions: "/api/v1/groups",
    getAllProjectsDropdown: "api/v1/consultancies",
    getAllBuildingsDropdown: "api/v1/consultancies",
    getAllRolesDropdown: "api/v1/consultancies",
    getAllGroupsDropdown: "api/v1/consultancies",
    getConsultanciesBasedOnRole: "api/v1/groups",
    getClientsBasedOnRole: "api/v1/consultancies/clients",
    getTemplateInitialValues: "/api/v1/permissions/initial_values",
    getUserListForPermissions: "/api/v1/permissions/assign_users",
    getUserPermissions: "/api/v1/permissions"
};

export const consultancyEndPoints = {
    getAllConsultancies: "/api/v1/consultancies",
    addConsultancy: "api/v1/consultancies",
    getConsultancyById: "api/v1/consultancies",
    updateConsultancy: "api/v1/consultancies",
    deleteConsultancy: "api/v1/consultancies",
    getListForCommonFilter: "/api/v1/consultancies",
    getAllConsultancyLogs: "/api/v1/consultancies",
    restoreConsultancyLog: "/api/v1/logs",
    deleteConsultancyLog: "/api/v1/logs",
    exportConsultancy: "/api/v1/consultancies"
};

export const reportEndPoints = {
    getAllReports: "/api/v1/documents",
    restoreDocumentLog: "/api/v1/logs",
    deleteDocumentLog: "/api/v1/logs",
    getInitiativeDropdown: "/api/v1/consultancies/initiatives_dropdown",
    getRecommendationDropdown: "/api/v1/consultancies/recommendations_dropdown",
    getDocumentTypeBased: "/api/v1/document_types/document_type_dropdown",
    getSitesByRegionInDocuments: "/api/v1/regions",
    filterLists: {
        clients: "/api/v1/documents/clients"
    }
};

export const fcaReportEndPoints = {
    getBuildingMenu: "/api/v1/narratives/building_menu",
    getTradeMenu: "api/v1/narratives/trades_menu",
    getSystemMenu: "api/v1/narratives/systems_menu",
    getSubsystemMenu: "api/v1/narratives/sub_systems_menu",
    getBuildingReportPrargraphsMenu: "api/v1/narratives/building_report_paragraphs_menu",
    getBuildingChildPrargraphsMenu: "api/v1/narratives/building_child_paragraphs_menu",
    getSiteReportPrargraphsMenu: "api/v1/narratives/site_report_paragraphs_menu",
    getSiteChildPrargraphsMenu: "api/v1/narratives/site_child_paragraphs_menu",
    getRegionReportPrargraphsMenu: "api/v1/narratives/region_report_paragraphs_menu",
    getRegionChildPrargraphsMenu: "api/v1/narratives/region_child_paragraphs_menu",
    getProjectReportPrargraphsMenu: "api/v1/narratives/project_report_paragraphs_menu",
    getProjectChildPrargraphsMenu: "api/v1/narratives/project_child_paragraphs_menu",
    getSiteMenu: "api/v1/narratives/site_menu",
    getRegionMenu: "api/v1/narratives/region_menu",
    getProjectMenu: "api/v1/narratives/project_menu",
    getSiteBuildings: "/api/v1/narratives/buildings_menu",
    getProjectsMenu: "/api/v1/narratives/regions_menu",
    getRegionsMenu: "/api/v1/narratives/sites_menu",
    getAllImages: "/api/v1/narratives/images",
    uploadImage: "/api/v1/narratives/upload_image",
    deleteImage: "api/v1/narratives",
    updateImageComment: "/api/v1/narratives",
    addNarrative: "api/v1/narratives",
    deleteNarrative: "api/v1/narratives",
    getNarrativeRecommendationsImage: "api/v1/narratives/recommendation_images",
    getNarrativeChart: "api/v1/narratives/charts_and_graphs",
    getChartDetails: "api/v1/narratives/chart",
    getAllRecommendationNotes: "api/v1/narratives/recommendation_notes",
    updateNarrativeRecomImage: "api/v1/recommendation_images",
    getNarrativeRecommendations: "api/v1/narratives/recommendations",
    getNarrative: "/api/v1/narratives/get_narrative",
    exportReport: "/reports/create_report/",
    uploadInsert: "/api/v1/narratives/upload_insert",
    getInserts: "/api/v1/narratives/inserts",
    deleteInsert: "/api/v1/narratives",
    updateInsert: "/api/v1/narratives",
    markAsComplete: "/reports/narratives",
    markAsCompleteRuby: "/api/v1/narratives",
    getLatestPdfReport: "/reports/latest_report/",
    getExportHistory: "/reports/report_list/",
    updateExportHistory: "/reports/report_notes/",
    getAllLogs: "/api/v1/narratives",
    updateLog: "/api/v1/logs",
    autoPopulateTableTemplates: "/api/v1/narratives/initialize_report",
    assignImagesFromMaster: "/api/v1/narratives/assign_master_images"
};

export const menuEndPoints = {
    getSideMenuItems: "api/v1/menu"
};

export const reportPropertiesEndPoints = {
    reportProperty: "/api/v1/excel_settings",
    logs: "/api/v1/logs",
    reportPropertyDropdown: "/api/v1/excel_settings/report_properties_dropdown",
    dropdown: {
        fonts: "/api/v1/fonts/font_dropdown",
        table_styles: "/api/v1/table_styles/table_style_dropdown"
    }
};

export const specialReportEndPoints = {
    getListForCommonFilter: "/api/v1",
    getSpecialReports: "/api/v1",
    addSpecialReport: "/api/v1",
    getSpecialReportById: "/api/v1",
    updateSpecialReport: "/api/v1",
    deleteSpecialReport: "/api/v1",
    exportSpecialReport: "/api/v1",
    getAllSpecialReportLogs: "/api/v1",
    restoreSpecialReportLog: "/api/v1/logs",
    deleteSpecialReportLog: "/api/v1/logs",
    getAssignModalDetails: "/api/v1/narrative_templates",
    assignItems: "/api/v1/narrative_templates"
};

export const chartsAndGraphsEndPoints = {
    getListForCommonFilter: "/api/v1",
    getChartsAndGraphs: "/api/v1",
    addChartsAndGraphs: "/api/v1",
    getChartsAndGraphsById: "/api/v1",
    updateChartsAndGraphs: "/api/v1",
    deleteChartsAndGraphs: "/api/v1",
    exportChartsAndGraphs: "/api/v1",
    getAllChartsAndGraphsLogs: "/api/v1",
    restoreChartsAndGraphsLog: "/api/v1/logs",
    deleteChartsAndGraphsLog: "/api/v1/logs",
    getAssignModalDetails: "/api/v1/narrative_templates",
    assignItems: "/api/v1/narrative_templates"
};

export const systemTablesEndPoints = {
    getListForCommonFilter: "/api/v1",
    getSystemTables: "/api/v1",
    addSystemTables: "/api/v1",
    getSystemTablesById: "/api/v1",
    updateSystemTables: "/api/v1",
    deleteSystemTables: "/api/v1",
    exportSystemTables: "/api/v1",
    getAllSystemTablesLogs: "/api/v1",
    restoreSystemTablesLog: "/api/v1/logs",
    deleteSystemTablesLog: "/api/v1/logs",
    getAssignModalDetails: "/api/v1/narrative_templates",
    assignItems: "/api/v1/narrative_templates"
};

export const reportParagraphEndPoints = {
    getListForCommonFilter: "/api/v1",
    getReportParagraphs: "/api/v1",
    addReportParagraph: "/api/v1",
    getReportParagraphById: "/api/v1",
    updateReportParagraph: "/api/v1",
    deleteReportParagraph: "/api/v1",
    exportReportParagraph: "/api/v1",
    getAllReportParagraphLogs: "/api/v1",
    restoreReportParagraphLog: "/api/v1/logs",
    deleteReportParagraphLog: "/api/v1/logs",
    getSpecialReportsDropdown: "/api/v1"
};

export const childParagraphEndPoints = {
    getListForCommonFilter: "/api/v1",
    getChildParagraphs: "/api/v1",
    addChildParagraph: "/api/v1",
    getChildParagraphById: "/api/v1",
    updateChildParagraph: "/api/v1",
    deleteChildParagraph: "/api/v1",
    exportChildParagraph: "/api/v1",
    getAllChildParagraphLogs: "/api/v1",
    restoreChildParagraphLog: "/api/v1/logs",
    deleteChildParagraphLog: "/api/v1/logs",
    getSpecialReportsDropdown: "/api/v1",
    getReportParagraphsDropdown: "/api/v1"
};

export const narrativeTemplateEndPoints = {
    getListForCommonFilter: "/api/v1",
    getNarrativeTemplates: "/api/v1",
    addNarrativeTemplate: "/api/v1",
    getNarrativeTemplateById: "/api/v1",
    updateNarrativeTemplate: "/api/v1",
    deleteNarrativeTemplate: "/api/v1",
    exportNarrativeTemplate: "/api/v1",
    getAllNarrativeTemplateLogs: "/api/v1/logs",
    restoreNarrativeTemplateLog: "/api/v1/logs",
    deleteNarrativeTemplateLog: "/api/v1",

    getAssignModalDetails: "/api/v1/narrative_templates",
    assignItems: "/api/v1/narrative_templates"
};

export const reportNoteTemplateEndPoints = {
    getListForCommonFilter: "/api/v1",
    getReportNoteTemplates: "/api/v1",
    addReportNoteTemplate: "/api/v1",
    getReportNoteTemplateById: "/api/v1",
    updateReportNoteTemplate: "/api/v1",
    deleteReportNoteTemplate: "/api/v1",
    exportReportNoteTemplate: "/api/v1",
    getAllReportNoteTemplateLogs: "/api/v1",
    restoreReportNoteTemplateLog: "/api/v1/logs",
    deleteReportNoteTemplateLog: "/api/v1/logs",
    getAssignModalDetails: "/api/v1/report_note_templates",
    assignItems: "/api/v1/report_note_templates"
};

export const recommendationTemplateEndPoints = {
    getListForCommonFilter: "/api/v1",
    getRecommendationTemplates: "/api/v1",
    addRecommendationTemplate: "/api/v1",
    getRecommendationTemplateById: "/api/v1",
    updateRecommendationTemplate: "/api/v1",
    deleteRecommendationTemplate: "/api/v1",
    exportRecommendationTemplate: "/api/v1",
    getAllRecommendationTemplateLogs: "/api/v1",
    restoreRecommendationTemplateLog: "/api/v1/logs",
    deleteRecommendationTemplateLog: "/api/v1/logs",
    getAssignModalDetails: "/api/v1/recommendation_templates",
    assignItems: "/api/v1/recommendation_templates"
};

export const tableTemplateEndPoints = {
    getListForCommonFilter: "/api/v1",
    getTableTemplates: "/api/v1",
    addTableTemplate: "/api/v1",
    getTableTemplateById: "/api/v1",
    updateTableTemplate: "/api/v1",
    deleteTableTemplate: "/api/v1",
    exportTableTemplate: "/api/v1",
    getAllTableTemplateLogs: "/api/v1",
    restoreTableTemplateLog: "/api/v1/logs",
    deleteTableTemplateLog: "/api/v1/logs",
    getAssignModalDetails: "/api/v1/table_templates",
    assignItems: "/api/v1/table_templates"
};

export const tradeEndPoints = {
    getListForCommonFilter: "/api/v1/master_trades",
    getTrades: "/api/v1/master_trades",
    addTrade: "/api/v1/master_trades",
    getTradeById: "/api/v1/master_trades",
    updateTrade: "/api/v1/master_trades",
    deleteTrade: "/api/v1/master_trades",
    exportTrade: "/api/v1/master_trades/export_xl",
    getAllTradeLogs: "/api/v1/master_trades",
    restoreTradeLog: "/api/v1/logs",
    deleteTradeLog: "/api/v1/logs"
};

export const systemEndPoints = {
    getListForCommonFilter: "/api/v1/master_systems",
    getSystems: "/api/v1/master_systems",
    addSystem: "/api/v1/master_systems",
    getSystemById: "/api/v1/master_systems",
    updateSystem: "/api/v1/master_systems",
    deleteSystem: "/api/v1/master_systems",
    exportSystem: "/api/v1/master_systems/export_xl",
    getAllSystemLogs: "/api/v1/master_systems",
    restoreSystemLog: "/api/v1/logs",
    deleteSystemLog: "/api/v1/logs",
    getTradeDropdown: "/api/v1/master_trades/trades_dropdown"
};

export const subSystemEndPoints = {
    getListForCommonFilter: "/api/v1/master_sub_systems",
    getSubSystems: "/api/v1/master_sub_systems",
    addSubSystem: "/api/v1/master_sub_systems",
    getSubSystemById: "/api/v1/master_sub_systems",
    updateSubSystem: "/api/v1/master_sub_systems",
    deleteSubSystem: "/api/v1/master_sub_systems",
    exportSubSystem: "/api/v1/master_sub_systems/export_xl",
    getAllSubSystemLogs: "/api/v1/master_sub_systems",
    restoreSubSystemLog: "/api/v1/logs",
    deleteSubSystemLog: "/api/v1/logs",
    getTradeDropdown: "/api/v1/master_trades/trades_dropdown",
    getSystemByTradeDropdown: "/api/v1/master_systems/systems_dropdown"
};

export const helperEndPoints = {
    getHelperData: "/api/v1/page_infos",
    uploadHelperDocToAWS: "/api/v1/page_infos/upload_document",
    updateHelper: "/api/v1/page_infos"
};

// python backend
export const reportTemplateEndPoints = {
    template: "/reports/word_template/",
    exportExcel: "/reports/excel_template/"
};

export const imageEndPoints = {
    upload: "/reports/multi_upload/",
    uploadAssetImage: "/fca/asset/multi-image/upload/",
    update: "/api/v1/images/edit",
    checkDuplicate: "/reports/duplicate_check/",
    checkDuplicateAsset: "/fca/asset/multi-image/duplicate-check/",
    projectList: "/api/v1/consultancies/projects_dropdown",
    buildingList: "/api/v1/images/buildings_dropdown",
    tradeList: "/api/v1/projects",
    systemList: "/api/v1/projects",
    subsystemList: "/api/v1/projects",
    allImages: "/api/v1/images",
    imageLogs: "/reports/image_logs/",
    getUserDefaultTrade: "/api/v1/projects",
    // allImages: "/reports/image_list/",
    filterLists: {
        clients: "/api/v1/image_master_filters/clients",
        projects: "/api/v1/image_master_filters/projects",
        regions: "/api/v1/image_master_filters/regions",
        sites: "/api/v1/image_master_filters/sites",
        buildings: "/api/v1/image_master_filters/buildings",
        trades: "/api/v1/image_master_filters/trades",
        systems: "/api/v1/image_master_filters/systems",
        sub_systems: "/api/v1/image_master_filters/sub_systems",
        users: "/api/v1/image_master_filters/users",
        labels: "/api/v1/image_master_filters/labels"
    },
    getImagesByRecommendations: "/api/v1/recommendations",
    getImagesByNarrative: "/api/v1/narratives/master_images",
    checkImageMapped: "/api/v1/images",
    deleteImage: "/api/v1/images/delete_images",
    addToFav: "/api/v1/images/favourite",
    getSelectedProject: "/api/v1/projects",
    getAllLabels: "/api/v1/image_master_filters/labels",
    export: "/fca/gallery/download/",
    exportPdf: "/fca/gallery/download/pdf/",
    rotateImages: "/image_management/process/rotate/",
    saveEditedImage: "/image_management/process/edit/",
    restoreEditedImage: "/image_management/process/image/reset/"
};

export const assetSettingsEndPoints = {
    assetSettings: "/api/v1",
    logs: "/api/v1/logs",
    dropdown: {
        clients: "/api/v1/clients",
        main_categories: "/api/v1/main_categories/main_category_dropdown",
        sub_category_1s: "/api/v1/sub_category_1/sub_category_1_dropdown",
        sub_category_2s: "/api/v1/sub_category_2/sub_category_2_dropdown",
        sub_category_3s: "/api/v1/sub_category_3/sub_category_3_dropdown",
        uniformat_level_1s: "/api/v1/uniformat_level_1s/uniformat_level_1_dropdown",
        uniformat_level_2s: "/api/v1/uniformat_level_2s/uniformat_level_2_dropdown",
        uniformat_level_3s: "/api/v1/uniformat_level_3s/uniformat_level_3_dropdown",
        uniformat_level_4s: "/api/v1/uniformat_level_4s/uniformat_level_4_dropdown",
        uniformat_level_5s: "/api/v1/uniformat_level_5s/uniformat_level_5_dropdown"
    }
};
export const documentSettingEndPoints = {
    documentSetting: "/api/v1",
    logs: "/api/v1/logs",
    dropdown: {
        clients: "/api/v1/clients"
    }
    // getDataList:" /api/v1/document_types",
    // addData:"/api/v1/document_types",
    // deleteData:" /api/v1/document_types",

    // getDataById:"/api/v1/document_types",
    // updateData:"  /api/v1/document_types",
};

export const assetEndPoints = {
    assets: "/api/v1/assets",
    chartAssets: "/api/v1/asset_charts/assets",
    logs: "/api/v1/logs",
    dropdown: {
        uniformat_level_1s: "/api/v1/uniformat_level_1s/uniformat_level_1_dropdown",
        uniformat_level_2s: "/api/v1/uniformat_level_2s/uniformat_level_2_dropdown",
        uniformat_level_3s: "/api/v1/uniformat_level_3s/uniformat_level_3_dropdown",
        uniformat_level_4s: "/api/v1/uniformat_level_4s/uniformat_level_4_dropdown",
        uniformat_level_5s: "/api/v1/uniformat_level_5s/uniformat_level_5_dropdown",
        uniformat_level_6s: "/api/v1/uniformat_level_6s/uniformat_level_6_dropdown",
        clients: "/api/v1/clients",
        regions: "/api/v1/regions",
        sites: "/api/v1/sites",
        buildings: "/api/v1/buildings",
        additions: "/api/v1/additions",
        floors: "/api/v1/floors",
        asset_statuses: "/api/v1/asset_statuses/asset_status_dropdown",
        asset_types: "/api/v1/asset_types/asset_type_dropdown",
        asset_condition: "/api/v1/asset_conditions/asset_conditions_dropdown",
        asset_conditions: "/api/v1/client_asset_conditions/asset_condition_dropdown",
        main_categories: "/api/v1/main_categories/main_category_dropdown",
        sub_category_1s: "/api/v1/sub_category_1/sub_category_1_dropdown",
        sub_category_2s: "/api/v1/sub_category_2/sub_category_2_dropdown",
        sub_category_3s: "/api/v1/sub_category_3/sub_category_3_dropdown",
        trades: "/api/v1/assets/trades_dropdown",
        systems: "/api/v1/assets/systems_dropdown",
        sub_systems: "/api/v1/assets/sub_systems_dropdown"
    }
};

export const meterEndponts = {
    getMeterTemplates: "/api/v1",
    getAllNarrativeTemplateLogs: "/api/v1",
    getAccountDetails: "/api/v1/energy_management/accounts",
    getMeterDropDowns: "api/v1/clients",
    getMeterDetailsId: "api/v1/energy_management/meters",
    updateMeterDetailsId: "api/v1/energy_management/meters",
    deleteMeterDetailsId: "api/v1/energy_management/meters",
    getMeterDropdown: "api/v1/energy_management/meters/meters_dropdown"
};

export const accountEndPoints = {
    getListForCommonFilter: "/api/v1/energy_management/accounts",
    getAccounts: "/api/v1/energy_management/accounts",
    addAccount: "/api/v1/energy_management/accounts",
    getAccountById: "/api/v1/energy_management/accounts",
    updateAccount: "/api/v1/energy_management/accounts",
    deleteAccount: "/api/v1/energy_management/accounts",
    exportAccount: "/api/v1/energy_management/accounts",
    getAllAccountLogs: "/api/v1/energy_management/accounts",
    restoreAccountLog: "/api/v1/energy_management/accounts",
    deleteAccountLog: "/api/v1/energy_management/accounts",

    getAssignModalDetails: "/api/v1/narrative_templates",
    assignItems: "/api/v1/narrative_templates"
};

export const energyManagementEndponts = {
    getReadingDetails: "/api/v1/energy_management/meter_readings",
    getClients: "/api/v1/clients",
    getMeterDropDowns: "api/v1/clients",
    getAllNarrativeTemplateLogs: "/api/v1/energy_management/meter_readings",
    postReadingDetails: "/api/v1/energy_management/meter_readings",
    patchReadingDetails: "/api/v1/energy_management/meter_readings",
    deleteReadingDetails: "/api/v1/energy_management/meter_readings"
};

export const energyStarEndpoints = {
    getReadingDetails: "api/v1/energy_management/energy_star_ratings",
    postReadingDetails: "api/v1/energy_management/energy_star_ratings",
    patchReadingDetails: "api/v1/energy_management/energy_star_ratings",
    deleteReadingDetails: "api/v1/energy_management/energy_star_ratings"
};

export const energyChartEndpoints = {
    getDashboard: "/api/v1/energy_management/dashboards",
    getClients: "/api/v1/clients",
    getBuildingById: "/api/v1/buildings",
    getRegionById: "/api/v1/regions",
    getSiteById: "/api/v1/sites",
    getRegionFilter: "/api/v1/energy_management/master_filters/regions",
    getSiteFilter: "/api/v1/energy_management/master_filters/sites",
    getBuildingTypeFilter: "/api/v1/energy_management/master_filters/building_types",
    getBuildingFilter: "/api/v1/energy_management/master_filters/buildings",
    getYearFilter: "/api/v1/energy_management/master_filters/years",
    exportDataTableToWord: "/fca/energy-management/eui/word/energy-management/",
    exportDataTableToExcel: "/fca/energy-management/eui/excel/energy-management/"
};

export const assetManagementEndpoints = {
    getChart: "/api/v1/asset_charts",
    getSfciChart: "/api/v1/asset_charts/asset_benchmark",
    masterFilters: {
        regions: "/api/v1/asset_master_filters/regions",
        sites: "/api/v1/asset_master_filters/sites",
        buildings: "/api/v1/asset_master_filters/buildings",
        building_types: "/api/v1/asset_master_filters/building_types",
        asset_statuses: "/api/v1/asset_master_filters/asset_statuses",
        asset_types: "/api/v1/asset_master_filters/asset_types",
        asset_conditions: "/api/v1/asset_master_filters/asset_conditions",
        recommendation_filter: "/api/v1/asset_master_filters/recommendation_assigned_dropdown"
    },
    exportDataTableToWord: "/fca/export/graph-data/asset/word/",
    exportDataTableToExcel: "/fca/export/graph-data/asset/excel/"
};

export const chartTemplateEndPoints = {
    chartTemplates: "/chart/template/",
    getChartPropertyDropdown: "/chart/template/properties/",
    exportExcel: ""
};
export const chartPropertiesEntPoints = {
    addProperty: "/chart/template/create_properties/",
    getPropertyById: "/chart/template/property",
    getProperties: "/chart/template/list_properties/",
    updateProperty: "/chart/template/update_properties/",
    logs: "/api/v1/logs",
    reportPropertyDropdown: "/api/v1/excel_settings/report_properties_dropdown",
    dropdown: {
        fonts: "/api/v1/fonts/font_dropdown",
        table_styles: "/api/v1/table_styles/table_style_dropdown"
    },
    checkPropertyMapped: "/chart/template/mapped_to_template/",
    deleteProperty: "/chart/template",
    exportExcel: "/chart/properties/excel/",
    updateRecommendationSortProperty: "/chart/template/update_properties/"
};
export const manageHeadingsEndPoints = {
    manageHeading: "/fca/recommendation/heading-settings/",
    headingExportExcel: "fca/recommendation/heading-settings/export-excel/"
};

export const notificationEndPoints = {
    getNotifications: "/fca/notification/",
    getUnreadNotifications: "/fca/notification/",
    updateNotifications: "/fca/notification/read-seen/",
    exportExcel: "/fca/notification/export-excel/"
};
export const emailEndPoints = {
    getAllUserMailid: "/fca/send_mail/user-email/",
    sendEmail: "/fca/send_mail/sent-email/",
    getAllMail: "/fca/send_mail/"
};
export const smartChartEndPoints = {
    exportSmartChartData: "/smart-chart/export/initiate/",
    saveSmartChartData: "/smart-chart/property/",
    getExportedSmartChartList: "/smart-chart/export-data/",
    deleteSmartChartReport: "/smart-chart/export-data/",
    uploadDocsForSmartReport: "/smart-chart/user_doc/",
    getUploadedDocList: "/smart-chart/user_doc/",
    updateSmartReportData: "/smart-chart/export-data/",
    getTemplatePropertiesList: "/smart-chart/template-settings/properties/",
    getTemplateList: "/smart-chart/template-settings/templates/",
    deleteUserDocs: "/smart-chart/user_doc/soft-delete/",
    getClientDropDownData: "/smart-chart/template-settings/clients/",
    updateDocOrder: "/smart-chart/user_doc/bulk-update/",
    updateUserDocData: "/smart-chart/user_doc/",
    updateSmartChartProperty: "/smart-chart/property/",
    getSmartChartPropertyList: "/smart-chart/property/",
    getSmartChartPropertyById: "/smart-chart/property/",
    deleteSmartChartReportTemplate: "/smart-chart/property/delete-property/",
    assignImagesToSmartCharts: "/smart-chart/user_doc/pull-image/",
    lockSmartChartTemplate: "/smart-chart/property/lock-unlock-property/",
    masterFilters: {
        projects: "/smart-chart/master/filter/project/",
        regions: "/smart-chart/master/filter/region/",
        sites: "/smart-chart/master/filter/site/",
        buildings: "/smart-chart/master/filter/building/",
        building_types: "/smart-chart/master/filter/building_type/",
        energy_mng_regions: "/smart-chart/em/filter/region/",
        energy_mng_projects: "/smart-chart/master/filter/project/",
        energy_mng_sites: "/smart-chart/em/filter/site/",
        energy_mng_buildings: "/smart-chart/em/filter/building/",
        energy_mng_years: "/smart-chart/em/filter/year/",
        clients: "/smart-chart/template-settings/clients/",
        asset_regions: "/smart-chart/em/filter/region/",
        asset_sites: "/smart-chart/em/filter/site/",
        asset_buildings: "/smart-chart/em/filter/building/",
        years: "/smart-chart/master/filter/years/",
        fmp: "/smart-chart/master/filter/fmp/",
        infrastructure_requests: "/smart-chart/master/filter/infrastructure_requests/",
        additions: "/smart-chart/master/filter/additions/",
        fci: "/smart-chart/master/filter/fci/"
    }
};

export const softCosts = {
    softCosts: "/api/v1/soft_costs",
    saveSoftCosts: "/api/v1/soft_costs/project_soft_costs",
    exportExcel: "/api/v1/soft_costs/export_xl"
};
