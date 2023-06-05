// not using this config. settings the keys and config dynamically in index.jsx
export const recommendationTemplateTableData = {
    keys: ["name", "text_format", "cost_per_unit", "unit", "description", "created_at", "updated_at"],
    config: {
        name: {
            isVisible: true,
            label: "Name",
            class: "",
            searchKey: "recommendation_templates.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "recommendation_templates",
            commonSearchKey: "recommendation_templates",
            commonSearchObjectKey: "name"
        },
        text_format: {
            isVisible: true,
            label: "Template",
            class: "",
            searchKey: "recommendation_templates.text_format",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "recommendation_templates",
            commonSearchKey: "recommendation_templates",
            commonSearchObjectKey: "text_format"
        },
        cost_per_unit: {
            isVisible: true,
            label: "Cost Per Unit",
            class: "",
            searchKey: "recommendation_templates.cost_per_unit",
            type: "number",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "recommendation_templates",
            commonSearchKey: "recommendation_templates",
            commonSearchObjectKey: "cost_per_unit"
        },
        unit: {
            isVisible: true,
            label: "Unit",
            class: "",
            searchKey: "recommendation_templates.unit",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "recommendation_templates",
            commonSearchKey: "recommendation_templates",
            commonSearchObjectKey: "unit"
        },
        description: {
            isVisible: true,
            label: "Report Notes",
            class: "",
            searchKey: "recommendation_templates.description",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "recommendation_templates",
            commonSearchKey: "recommendation_templates",
            commonSearchObjectKey: "description"
        },
        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "recommendation_templates.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "recommendation_templates",
            commonSearchKey: "recommendation_templates",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "recommendation_templates.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "recommendation_templates",
            commonSearchKey: "recommendation_templates",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};
