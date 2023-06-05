import * as actionType from "./constants";

const initialState = {
    getprojectsInMasterDropdownData: {},
    exportSmartChartDataResponse: {},
    masterFilterList: {
        project: {},
        energy_mng: {},
        documents: {}
    },
    saveSmartChartDataResponse: {},
    exportedSmartChartListResponse: {},
    deleteSmartChartReportResponse: {},
    uploadDocForSmartChartResponse: {},
    uploadedDocListResponse: {},
    updateSmartChartDataResponse: {},
    getTemplatePropertiesListResponse: {},
    getTemplateListResponse: {},
    getClientDropDownDataResponse: {},
    userDocOrderChangeResponse: {},
    deleteUserDocResponse: {},
    getSmartChartPropertiesListResponse: {},
    getSmartChartPropertyByIdResponse: {},
    uploadedImageListResponse: {},
    saveAndExportSmartChartDataResponse: {},
    deleteSmartChartReportTemplateResponse: {},
    reportsByTemplateListResponse: {},
    lockSmartChartTemplateResponse: {},
    mFilters: {},
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
            active: true
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
        selectedDropdown: "active"
    },
    propertyEntityParams: {
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
            active: true
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
        selectedDropdown: "active"
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_MASTER_FILTER_IN_SMART_CHART_REQUEST:
            return {
                ...state
            };
        case actionType.GET_MASTER_FILTER_IN_SMART_CHART_SUCCESS:
            let dropDownData = [];
            if (action.filterKey === "energy_mng_years") {
                dropDownData = action.response?.data?.map(year => {
                    return { id: year, name: year };
                });
            } else if (action.filterKey === "fmp" || action.filterKey === "infrastructure_requests" || action.filterKey === "fci") {
                dropDownData = action.response?.data?.map(data => {
                    return { id: data.name, name: data.name };
                });
            } else {
                dropDownData = [...action.response?.data];
            }
            return {
                ...state,
                masterFilterList: {
                    ...state.masterFilterList,
                    [action.entity]: {
                        ...state.masterFilterList[action.entity],
                        [action.filterKey]: [...dropDownData]
                    }
                }
            };
        case actionType.GET_MASTER_FILTER_IN_SMART_CHART_FAILURE:
            return {
                ...state,
                masterFilterList: {
                    ...state.masterFilterList,
                    [action.entity]: {
                        ...state.masterFilterList[action.entity],
                        [action.filterKey]: []
                    }
                }
            };
        case actionType.EXPORT_SMART_CHART_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.EXPORT_SMART_CHART_DATA_SUCCESS:
            return {
                ...state,
                exportSmartChartDataResponse: { success: true, ...action.response }
            };
        case actionType.EXPORT_SMART_CHART_DATA_FAILURE:
            return {
                ...state,
                exportSmartChartDataResponse: { success: false, ...action.error }
            };
        case actionType.SAVE_SMART_CHART_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.SAVE_SMART_CHART_DATA_SUCCESS:
            return {
                ...state,
                saveSmartChartDataResponse: { success: true, ...action.response }
            };
        case actionType.SAVE_SMART_CHART_DATA_FAILURE:
            return {
                ...state,
                saveSmartChartDataResponse: { success: false, ...action.error }
            };
        case actionType.GET_EXPORTED_SMART_CHART_LIST_REQUEST:
            return {
                ...state
            };
        case actionType.GET_EXPORTED_SMART_CHART_LIST_SUCCESS:
            return {
                ...state,
                exportedSmartChartListResponse: { success: true, ...action.response }
            };
        case actionType.GET_EXPORTED_SMART_CHART_LIST_FAILURE:
            return {
                ...state,
                exportedSmartChartListResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_SMART_CHART_REPORT_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_SMART_CHART_REPORT_SUCCESS:
            return {
                ...state,
                deleteSmartChartReportResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_SMART_CHART_REPORT_FAILURE:
            return {
                ...state,
                deleteSmartChartReportResponse: { success: false, ...action.error }
            };
        case actionType.UPLOAD_DOC_FOR_SMART_REPORT_REQUEST:
            return {
                ...state
            };
        case actionType.UPLOAD_DOC_FOR_SMART_REPORT_SUCCESS:
            return {
                ...state,
                uploadDocForSmartChartResponse: { success: true, ...action.response }
            };
        case actionType.UPLOAD_DOC_FOR_SMART_REPORT_FAILURE:
            return {
                ...state,
                uploadDocForSmartChartResponse: { success: false, ...action.error }
            };
        case actionType.GET_UPLOADED_DOC_LIST_REQUEST:
            return {
                ...state
            };
        case actionType.GET_UPLOADED_DOC_LIST_SUCCESS:
            return {
                ...state,
                uploadedDocListResponse: { success: true, ...action.response }
            };
        case actionType.GET_UPLOADED_DOC_LIST_FAILURE:
            return {
                ...state,
                uploadedDocListResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_SMART_REPORT_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_SMART_REPORT_DATA_SUCCESS:
            return {
                ...state,
                updateSmartChartDataResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_SMART_REPORT_DATA_FAILURE:
            return {
                ...state,
                updateSmartChartDataResponse: { success: false, ...action.error }
            };
        case actionType.GET_TEMPLATE_PROPERTIES_LIST_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TEMPLATE_PROPERTIES_LIST_SUCCESS:
            let propertyList = [...action.response?.data];
            return {
                ...state,
                getTemplatePropertiesListResponse: { success: true, data: [...propertyList] }
            };
        case actionType.GET_TEMPLATE_PROPERTIES_LIST_FAILURE:
            return {
                ...state,
                getTemplatePropertiesListResponse: { success: false, ...action.error }
            };
        case actionType.GET_TEMPLATE_LIST_REQUEST:
            return {
                ...state
            };
        case actionType.GET_TEMPLATE_LIST_SUCCESS:
            let templateList = [...action.response?.data];
            return {
                ...state,
                getTemplateListResponse: { success: true, data: [...templateList] }
            };
        case actionType.GET_TEMPLATE_LIST_FAILURE:
            return {
                ...state,
                getTemplateListResponse: { success: false, ...action.error }
            };
        case actionType.GET_CLIENTS_LIST_FOR_SMART_CHART_REQUEST:
            return {
                ...state
            };
        case actionType.GET_CLIENTS_LIST_FOR_SMART_CHART_SUCCESS:
            return {
                ...state,
                getClientDropDownDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_CLIENTS_LIST_FOR_SMART_CHART_FAILURE:
            return {
                ...state,
                getClientDropDownDataResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_DOC_ORDER_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_DOC_ORDER_SUCCESS:
            return {
                ...state,
                userDocOrderChangeResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_DOC_ORDER_FAILURE:
            return {
                ...state,
                userDocOrderChangeResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_USER_DOC_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_USER_DOC_SUCCESS:
            return {
                ...state,
                deleteUserDocResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_USER_DOC_FAILURE:
            return {
                ...state,
                deleteUserDocResponse: { success: false, ...action.error }
            };
        case actionType.GET_SMART_CHART_PROPERTIES_LIST_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SMART_CHART_PROPERTIES_LIST_SUCCESS:
            return {
                ...state,
                getSmartChartPropertiesListResponse: { success: true, ...action.response }
            };
        case actionType.GET_SMART_CHART_PROPERTIES_LIST_FAILURE:
            return {
                ...state,
                getSmartChartPropertiesListResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_SMART_CHART_PROPERTY_SUCCESS:
            return {
                ...state,
                saveSmartChartDataResponse: { success: true, ...action.response }
            };
        case actionType.GET_SMART_CHART_PROPERTY_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_SMART_CHART_PROPERTY_BY_ID_SUCCESS:
            return {
                ...state,
                getSmartChartPropertyByIdResponse: { success: true, data: { ...action.response } }
            };
        case actionType.GET_SMART_CHART_PROPERTY_BY_ID_FAILURE:
            return {
                ...state,
                getSmartChartPropertyByIdResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_SMART_REPORT_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                mFilters: { ...action.response }
            };
        case actionType.GET_UPLOADED_IMAGE_LIST_REQUEST:
            return {
                ...state
            };
        case actionType.GET_UPLOADED_IMAGE_LIST_SUCCESS:
            return {
                ...state,
                uploadedImageListResponse: { success: true, ...action.response }
            };
        case actionType.GET_UPLOADED_IMAGE_LIST_FAILURE:
            return {
                ...state,
                uploadedImageListResponse: { success: false, ...action.error }
            };
        case actionType.SAVE_AND_EXPORT_SMART_CHART_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.SAVE_AND_EXPORT_SMART_CHART_DATA_SUCCESS:
            return {
                ...state,
                saveAndExportSmartChartDataResponse: { success: true, ...action.response }
            };
        case actionType.SAVE_AND_EXPORT_SMART_CHART_DATA_FAILURE:
            return {
                ...state,
                saveAndExportSmartChartDataResponse: { success: false, ...action.error }
            };
        case actionType.DELETE_SMART_CHART_REPORT_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_SMART_CHART_REPORT_TEMPLATE_SUCCESS:
            return {
                ...state,
                deleteSmartChartReportTemplateResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_SMART_CHART_REPORT_TEMPLATE_FAILURE:
            return {
                ...state,
                deleteSmartChartReportTemplateResponse: { success: false, ...action.error }
            };
        case actionType.GET_REPORTS_BY_TEMPLATE_LIST_REQUEST:
            return {
                ...state
            };
        case actionType.GET_REPORTS_BY_TEMPLATE_LIST_SUCCESS:
            return {
                ...state,
                reportsByTemplateListResponse: { success: true, ...action.response }
            };
        case actionType.GET_REPORTS_BY_TEMPLATE_LIST_FAILURE:
            return {
                ...state,
                reportsByTemplateListResponse: { success: false, ...action.error }
            };
        case actionType.LOCK_SMART_CHART_TEMPLATE_REQUEST:
            return {
                ...state
            };
        case actionType.LOCK_SMART_CHART_TEMPLATE_SUCCESS:
            return {
                ...state,
                lockSmartChartTemplateResponse: { success: true, ...action.response }
            };
        case actionType.LOCK_SMART_CHART_TEMPLATE_FAILURE:
            return {
                ...state,
                lockSmartChartTemplateResponse: { success: false, ...action.error }
            };
        default:
            return state;
    }
};
