export const reportNoteTemplateTableData = {
    keys: ["name", "text_format", "description", "created_at", "updated_at"],
    config: {
        name: {
            isVisible: true,
            label: "Name",
            class: "",
            searchKey: "report_note_templates.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "report_note_templates",
            commonSearchKey: "report_note_templates",
            commonSearchObjectKey: "name"
        },
        text_format: {
            isVisible: true,
            label: "Template",
            class: "",
            searchKey: "report_note_templates.text_format",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "report_note_templates",
            commonSearchKey: "report_note_templates",
            commonSearchObjectKey: "text_format"
        },
        description: {
            isVisible: true,
            label: "Description",
            class: "",
            searchKey: "report_note_templates.description",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "report_note_templates",
            commonSearchKey: "report_note_templates",
            commonSearchObjectKey: "description"
        },
        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "report_note_templates.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "report_note_templates",
            commonSearchKey: "report_note_templates",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "report_note_templates.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "report_note_templates",
            commonSearchKey: "report_note_templates",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};
