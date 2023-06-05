import * as actionType from "./constants";

const initialState = {
    getAllBuildingsDropdownResponse: {},
    getAllFloorsResponse: {},
    addFloorResponse: {},
    updateFloorResponse: {},
    deleteFloorResponse: {},
    getFloorByIdResponse: {},
    getFloorsBasedOnBuildingResponse: {},
    getAllConsultancyUsersResponse: {},
    getListForCommonFilterResponse: {},
    getAllFloorLogsResponse: {},
    restoreFloorLogResponse: {},
    deleteFloorLogResponse: {},
    floorExportResponse: {},
    getAllClientUsersResponse: {},
    getAllConsultanciesDropdownResponse: {},
    getAllClientsResponse: {},
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
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_FLOORS_BASED_ON_BUILDING_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FLOORS_BASED_ON_BUILDING_SUCCESS:
            return {
                ...state,
                getFloorsBasedOnBuildingResponse: { success: true, ...action.response }
            };
        case actionType.GET_FLOORS_BASED_ON_BUILDING_FAILURE:
            return {
                ...state,
                getFloorsBasedOnBuildingResponse: { success: false, ...action.error }
            };

        case actionType.ADD_FLOOR_REQUEST:
            return {
                ...state
            };
        case actionType.ADD_FLOOR_SUCCESS:
            return {
                ...state,
                addFloorResponse: { success: true, ...action.response }
            };
        case actionType.ADD_FLOOR_FAILURE:
            return {
                ...state,
                addFloorResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_FLOOR_REQUEST:
            return {
                ...state
            };
        case actionType.UPDATE_FLOOR_SUCCESS:
            return {
                ...state,
                updateFloorResponse: { success: true, ...action.response }
            };
        case actionType.UPDATE_FLOOR_FAILURE:
            return {
                ...state,
                updateFloorResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_FLOOR_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_FLOOR_SUCCESS:
            return {
                ...state,
                deleteFloorResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_FLOOR_FAILURE:
            return {
                ...state,
                deleteFloorResponse: { success: false, ...action.error }
            };
        case actionType.GET_FLOOR_BY_ID_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FLOOR_BY_ID_SUCCESS:
            return {
                ...state,
                getFloorByIdResponse: { success: true, ...action.response }
            };
        case actionType.GET_FLOOR_BY_ID_FAILURE:
            return {
                ...state,
                getFloorByIdResponse: { success: false, ...action.error }
            };

        case actionType.UPDATE_FLOOR_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_FLOOR_ENTITY_PARAMS_FAILURE:
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
        case actionType.GET_ALL_FLOOR_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_FLOOR_LOG_SUCCESS:
            return {
                ...state,
                getAllFloorLogsResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_FLOOR_LOG_FAILURE:
            return {
                ...state,
                getAllFloorLogsResponse: { success: false, ...action.error }
            };
        case actionType.RESTORE_FLOOR_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.RESTORE_FLOOR_LOG_SUCCESS:
            return {
                ...state,
                restoreFloorLogResponse: { success: true, ...action.response }
            };
        case actionType.RESTORE_FLOOR_LOG_FAILURE:
            return {
                ...state,
                restoreFloorLogResponse: { success: false, ...action.error }
            };

        case actionType.DELETE_FLOOR_LOG_REQUEST:
            return {
                ...state
            };
        case actionType.DELETE_FLOOR_LOG_SUCCESS:
            return {
                ...state,
                deleteFloorLogResponse: { success: true, ...action.response }
            };
        case actionType.DELETE_FLOOR_LOG_FAILURE:
            return {
                ...state,
                deleteFloorLogResponse: { success: false, ...action.error }
            };
        case actionType.GET_FLOOR_EXPORT_REQUEST:
            return {
                ...state
            };
        case actionType.GET_FLOOR_EXPORT_SUCCESS:
            return {
                ...state,
                floorExportResponse: { success: true, ...action.response }
            };
        case actionType.GET_FLOOR_EXPORT_FAILURE:
            return {
                ...state,
                floorExportResponse: { success: false, ...action.error }
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

        case actionType.GET_ALL_BUILDINGS_DROP_DOWN_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_BUILDINGS_DROP_DOWN_SUCCESS:
            return {
                ...state,
                getAllBuildingsDropdownResponse: { success: true, ...action.response }
            };
        case actionType.GET_ALL_BUILDINGS_DROP_DOWN_FAILURE:
            return {
                ...state,
                getAllBuildingsDropdownResponse: { success: false, ...action.error }
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
        default:
            return state;
    }
};
