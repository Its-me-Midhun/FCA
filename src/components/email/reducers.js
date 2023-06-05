import * as actionType from "./constants";

const initialState = {
    allUserEmailList: [],
    allEmailListResponse:{},
    sendMailWithAttachmentResponse: {},
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
            filters: null,
            list: null,
            filterKeys: {},
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
        }
    }
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionType.GET_USER_EMAIL_REQUEST:
            return {
                ...state
            };
        case actionType.GET_USER_EMAIL_SUCCESS:
            return {
                ...state,
                allUserEmailList: [...action.response]
            };
        case actionType.GET_USER_EMAIL_FAILURE:
            return {
                ...state,
                allUserEmailList: [...action.error]
            };
        case actionType.SEND_EMAIL_REQUEST:
            return {
                ...state
            };
        case actionType.SEND_EMAIL_SUCCESS:
            return {
                ...state,
                sendMailWithAttachmentResponse: { success: true, ...action.response }
            };
        case actionType.SEND_EMAIL_FAILURE:
            return {
                ...state,
                sendMailWithAttachmentResponse: { success: false, ...action.error }
            };
        case actionType.GET_ALL_MAIL_DATA_REQUEST:
            return {
                ...state
            };
        case actionType.GET_ALL_MAIL_DATA_SUCCESS:
            return {
                ...state,
                allEmailListResponse:{ success: false, ...action.error }
            };
        case actionType.GET_ALL_MAIL_DATA_FAILURE:
            return {
                ...state,
                allEmailListResponse: { success: false, ...action.error }
            };
        case actionType.UPDATE_EMAIL_DATA_ENTITY_PARAMS_SUCCESS:
            return {
                ...state,
                entityParams: { ...action.response }
            };
        case actionType.UPDATE_EMAIL_DATA_ENTITY_PARAMS_FAILURE:
            return {
                ...state,
                entityParams: { ...action.error }
            };
        default:
            return state;
    }
};
