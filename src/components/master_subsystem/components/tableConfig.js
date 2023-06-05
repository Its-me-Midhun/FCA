export const subSystemTableData = {
    keys: ["name", "trade", "system", "description", "benchmark","service_life" ,"created_at", "updated_at"],
    config: {
        name: {
            isVisible: true,
            label: "Name",
            class: "",
            searchKey: "master_sub_systems.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "master_sub_systems",
            commonSearchKey: "master_sub_systems",
            commonSearchObjectKey: "name"
        },
        description: {
            isVisible: true,
            label: "Description",
            class: "",
            searchKey: "master_sub_systems.description",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "master_sub_systems",
            commonSearchKey: "master_sub_systems",
            commonSearchObjectKey: "description"
        },
        trade: {
            isVisible: true,
            label: "Trade",
            class: "",
            searchKey: "master_trades.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "master_trades",
            commonSearchKey: "master_trades",
            commonSearchObjectKey: "name"
        },
        system: {
            isVisible: true,
            label: "System",
            class: "",
            searchKey: "master_systems.name",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "master_systems",
            commonSearchKey: "master_systems",
            commonSearchObjectKey: "name"
        },
        benchmark: {
            isVisible: true,
            label: "Benchmark",
            class: "",
            searchKey: "master_sub_systems.benchmark",
            type: "string",
            hasWildCardSearch: true,
            hasCommonSearch: true,
            getListTable: "master_sub_systems",
            commonSearchKey: "master_sub_systems",
            commonSearchObjectKey: "benchmark"
        },
        service_life: {
            isVisible: true,
            label: "Service Life",
            class: "",
            searchKey: "master_sub_systems.service_life",
            type: "number",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "master_sub_systems",
            commonSearchKey: "master_sub_systems",
            commonSearchObjectKey: "service_life"
        },
        created_at: {
            isVisible: true,
            label: "Created At",
            class: "",
            searchKey: "master_sub_systems.created_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "master_sub_systems",
            commonSearchKey: "master_sub_systems",
            commonSearchObjectKey: "created_at"
        },
        updated_at: {
            isVisible: true,
            label: "Updated At",
            class: "",
            searchKey: "master_sub_systems.updated_at",
            type: "date",
            hasWildCardSearch: true,
            hasCommonSearch: false,
            getListTable: "master_sub_systems",
            commonSearchKey: "master_sub_systems",
            commonSearchObjectKey: "updated_at"
        }
    },
    data: []
};
