export const DocumentSettingsEntities = {
    type: {
        name: "Document Types",
        key: "document_types",
        responseKey: "document_types",
        apiBodyParam: "document_type",
        permissionKey: "document_types",
        tableConfig: {
            keys: ["name", "client", "show_in_landing_page", "created_at", "updated_at"],
            config: {
                name: {
                    isVisible: true,
                    label: "Document Type",
                    class: "name",
                    searchKey: "document_types.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "documents",
                    commonSearchKey: "documents",
                    commonSearchObjectKey: "document_type"
                },

                client: {
                    isVisible: true,
                    label: "Client",
                    searchKey: "clients.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "client",
                    commonSearchKey: "clients",
                    commonSearchObjectKey: "name"
                },
                show_in_landing_page: {
                    isVisible: true,
                    label: "Show In LandingPage",
                    class: "",
                    searchKey: "show_in_landing_page",
                    type: "boolean",
                    hasWildCardSearch: "true",
                    hasCommonSearch: "false",
                    getListTable: "show_in_landing_page",
                    commonSearchKey: "document_types",
                    commonSearchObjectKey: "show_in_landing_page"
                },
                created_at: {
                    isVisible: true,
                    label: "Created At",
                    class: "",
                    searchKey: "document_types.created_at",
                    type: "date",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "document_types",
                    commonSearchKey: "document_types",
                    commonSearchObjectKey: "created_at"
                },
                updated_at: {
                    isVisible: true,
                    label: "Updated At",
                    class: "",
                    searchKey: "document_types.updated_at",
                    type: "date",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "document_types",
                    commonSearchKey: "document_types",
                    commonSearchObjectKey: "updated_at"
                }
            }
        }
    }
};
