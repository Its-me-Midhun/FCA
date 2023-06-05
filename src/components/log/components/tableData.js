export const logTableData = {
    keys: ["code", "consultancy", "client", "name", "email", "text", "created_at"],
    config: {
        code: {
            isVisible: true,
            label: "Log Code",
            class: "width-120px",
            searchKey: "logs.code",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "logs",
            commonSearchKey: "logs",
            commonSearchObjectKey: "code"
        },
        client: {
            isVisible: true,
            label: "Client",
            class: "width-180px",
            searchKey: "logs.client",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "logs",
            commonSearchKey: "logs",
            commonSearchObjectKey: "client"
        },
        consultancy: {
            isVisible: true,
            label: "Consultancy",
            class: "width-180px",
            searchKey: "logs.consultancy",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "logs",
            commonSearchKey: "logs",
            commonSearchObjectKey: "consultancy"
        },
        name: {
            isVisible: true,
            label: "User Name",
            class: "width-160px",
            searchKey: "logs.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "logs",
            commonSearchKey: "logs",
            commonSearchObjectKey: "name"
        },
        text: {
            isVisible: true,
            label: "Action",
            class: "width-380px",
            searchKey: "logs.text",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "logs",
            commonSearchKey: "logs",
            commonSearchObjectKey: "text"
        },
        email: {
            isVisible: true,
            label: "User Email",
            class: "width-250px",
            searchKey: "logs.email",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "logs",
            commonSearchKey: "logs",
            commonSearchObjectKey: "email"
        },
        created_at: {
            isVisible: true,
            label: "Action Date",
            class: "width-220px",
            searchKey: "logs.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "logs",
            commonSearchKey: "logs",
            commonSearchObjectKey: "created_at"
        }
    },
    data: []
};
