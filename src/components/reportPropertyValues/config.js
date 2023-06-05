export const PropertyValueEntities = {
    fontnames: {
        name: "Font Name",
        key: "fonts",
        responseKey: "fonts",
        apiBodyParam: "font",
        permissionKey: "fonts",
        tableConfig: {
            keys: ["code", "name", "created_at", "updated_at"],
            config: {
                code: {
                    isVisible: true,
                    label: "Code",
                    class: "reg-code",
                    searchKey: "code",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "fonts",
                    commonSearchKey: "fonts",
                    commonSearchObjectKey: "code"
                },
                name: {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "fonts",
                    commonSearchKey: "fonts",
                    commonSearchObjectKey: "name"
                },
                created_at: {
                    isVisible: true,
                    label: "Created At",
                    class: "",
                    searchKey: "created_at",
                    type: "date",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "fonts",
                    commonSearchKey: "fonts",
                    commonSearchObjectKey: "created_at"
                },
                updated_at: {
                    isVisible: true,
                    label: "Updated At",
                    class: "",
                    searchKey: "updated_at",
                    type: "date",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "fonts",
                    commonSearchKey: "fonts",
                    commonSearchObjectKey: "updated_at"
                }
            }
        }
    },
    tablestyles: {
        name: "Table Style",
        key: "table_styles",
        responseKey: "table_styles",
        apiBodyParam: "table_style",
        permissionKey: "table_styles",
        tableConfig: {
            keys: ["code", "name", "created_at", "updated_at"],
            config: {
                code: {
                    isVisible: true,
                    label: "Code",
                    class: "reg-code",
                    searchKey: "code",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "table_styles",
                    commonSearchKey: "table_styles",
                    commonSearchObjectKey: "code"
                },
                name: {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "table_styles",
                    commonSearchKey: "table_styles",
                    commonSearchObjectKey: "name"
                },
                created_at: {
                    isVisible: true,
                    label: "Created At",
                    class: "",
                    searchKey: "created_at",
                    type: "date",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "table_styles",
                    commonSearchKey: "table_styles",
                    commonSearchObjectKey: "created_at"
                },
                updated_at: {
                    isVisible: true,
                    label: "Updated At",
                    class: "",
                    searchKey: "updated_at",
                    type: "date",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "table_styles",
                    commonSearchKey: "table_styles",
                    commonSearchObjectKey: "updated_at"
                }
            }
        }
    }
};
