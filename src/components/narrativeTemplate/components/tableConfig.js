export const narrativeTemplateTableData = {
    keys: ["name", "text_format", "description", "created_at", "updated_at"],
    config: {
        name: {
            isVisible: true,
            label: "Name",
            class: "",
            searchKey: "narrative_templates.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "narrative_templates",
            commonSearchKey: "narrative_templates",
            commonSearchObjectKey: "name"
        },
        text_format: {
            isVisible: true,
            label: "Template",
            class: "",
            searchKey: "narrative_templates.text_format",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "narrative_templates",
            commonSearchKey: "narrative_templates",
            commonSearchObjectKey: "text_format"
        },
        description: {
            isVisible: true,
            label: "Description",
            class: "",
            searchKey: "narrative_templates.description",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "narrative_templates",
            commonSearchKey: "narrative_templates",
            commonSearchObjectKey: "description"
        },
        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "narrative_templates.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "narrative_templates",
            commonSearchKey: "narrative_templates",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "narrative_templates.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "narrative_templates",
            commonSearchKey: "narrative_templates",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};
