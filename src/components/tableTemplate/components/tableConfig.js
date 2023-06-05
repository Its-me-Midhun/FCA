export const tableTemplateTableData = {
    keys: ["name", "html_format", "double_header", "footer", "description", "created_at", "updated_at"],
    config: {
        name: {
            isVisible: true,
            label: "Name",
            class: "",
            searchKey: "table_templates.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "table_templates",
            commonSearchKey: "table_templates",
            commonSearchObjectKey: "name"
        },
        html_format: {
            isVisible: true,
            label: "Template",
            class: "",
            searchKey: "table_templates.html_format",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "table_templates",
            commonSearchKey: "table_templates",
            commonSearchObjectKey: "html_format"
        },
        double_header: {
            isVisible: true,
            label: "Has Double Header",
            class: "",
            searchKey: "table_templates.double_header",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "table_templates",
            commonSearchKey: "table_templates",
            commonSearchObjectKey: "double_header"
        },
        footer: {
            isVisible: true,
            label: "Has Footer",
            class: "",
            searchKey: "table_templates.footer",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "table_templates",
            commonSearchKey: "table_templates",
            commonSearchObjectKey: "footer"
        },
        description: {
            isVisible: true,
            label: "Description",
            class: "",
            searchKey: "table_templates.description",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "table_templates",
            commonSearchKey: "table_templates",
            commonSearchObjectKey: "description"
        },
        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "table_templates.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "table_templates",
            commonSearchKey: "table_templates",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "table_templates.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "table_templates",
            commonSearchKey: "table_templates",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};
