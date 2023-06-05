export const TradeSettingsEntities = {
    type: {
        name: "Trade Users",
        key: "trade_users",
        responseKey: "trade_users",
        apiBodyParam: "document_type",
        permissionKey: "trade_users",
        tableConfig: {
            keys: ["name", "username", "email", "phone"],
            config: {
                name: {
                    isVisible: true,
                    label: "Document Type",
                    class: "name",
                    searchKey: "name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "documents",
                    commonSearchKey: "documents",
                    commonSearchObjectKey: "document_type"
                },

                username: {
                    isVisible: true,
                    label: "Client",
                    searchKey: "username",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "client",
                    commonSearchKey: "clients",
                    commonSearchObjectKey: "name"
                },
                email: {
                    isVisible: true,
                    label: "Email",
                    class: "",
                    searchKey: "email",
                    type: "string",
                    hasWildCardSearch: "true",
                    hasCommonSearch: "false",
                    getListTable: "show_in_landing_page",
                    commonSearchKey: "document_types",
                    commonSearchObjectKey: "show_in_landing_page"
                },
                phone: {
                    isVisible: true,
                    label: "Phone",
                    class: "",
                    searchKey: "phone",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "document_types",
                    commonSearchKey: "document_types",
                    commonSearchObjectKey: "created_at"
                }
            }
        }
    }
};
