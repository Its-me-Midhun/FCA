export const clientTableData = {
    keys: ["code", "name", "consultancy", "created_at", "updated_at"],
    config: {
        code: {
            isVisible: true,
            label: "Client Code",
            class: "reg-code",
            searchKey: "clients.code",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "clients",
            commonSearchKey: "clients",
            commonSearchObjectKey: "code"
        },

        name: {
            isVisible: true,
            label: "Client Name",
            class: "reg-name",
            searchKey: "clients.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "clients",
            commonSearchKey: "clients",
            commonSearchObjectKey: "name"
        },
        consultancy: {
            isVisible: true,
            label: "Consultancy",
            class: "width-220px",
            searchKey: "consultancies.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "clients",
            commonSearchKey: "clients",
            commonSearchObjectKey: "consultancy"
        },

        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "clients.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "clients",
            commonSearchKey: "clients",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "clients.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "clients",
            commonSearchKey: "clients",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};

export const regionTableData = {
    keys: ["code", "name", "consultancy", "client", "projects", "users", "client_users", "comments", "created_at", "updated_at"],
    config: {
        code: {
            isVisible: true,
            label: "Region Code",
            class: "reg-code",
            searchKey: "regions.code",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "regions",
            commonSearchKey: "regions",
            commonSearchObjectKey: "code"
        },
        name: {
            isVisible: true,
            label: "Region Name",
            class: "reg-name",
            searchKey: "regions.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "regions",
            commonSearchKey: "regions",
            commonSearchObjectKey: "name"
        },
        consultancy: {
            isVisible: true,
            label: "Consultancy",
            class: "width-220px",
            searchKey: "consultancies.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "consultancies",
            commonSearchKey: "consultancies",
            commonSearchObjectKey: "name"
        },
        client: {
            isVisible: true,
            label: "Client",
            class: "width-220px",
            searchKey: "clients.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "client",
            commonSearchKey: "clients",
            commonSearchObjectKey: "name"
        },
        projects: {
            isVisible: true,
            label: "Associated Projects",
            class: "",
            searchKey: "projects.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "projects",
            commonSearchKey: "projects",
            commonSearchObjectKey: "name"
        },
        users: {
            isVisible: true,
            label: "Consultancy Users",
            class: "",
            searchKey: "users.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "consultancy_users",
            commonSearchKey: "users",
            commonSearchObjectKey: "name"
        },
        client_users: {
            isVisible: true,
            label: "Client Users",
            class: "",
            searchKey: "client_users.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "client_users",
            commonSearchKey: "client_users",
            commonSearchObjectKey: "name"
        },
        comments: {
            isVisible: true,
            label: "Comments",
            class: "",
            searchKey: "regions.comments",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "regions",
            commonSearchKey: "regions",
            commonSearchObjectKey: "comments"
        },
        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "regions.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "regions",
            commonSearchKey: "regions",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "regions.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "regions",
            commonSearchKey: "regions",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};
