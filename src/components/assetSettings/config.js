export const AssetSettingsEntities = {
    status: {
        name: "Asset Status",
        key: "asset_statuses",
        responseKey: "asset_statuses",
        apiBodyParam: "asset_status",
        permissionKey: "asset_status",
        tableConfig: {
            keys: ["name", "client", "description", "created_at", "updated_at"],
            config: {
                name: {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "asset_statuses",
                    commonSearchKey: "asset_statuses",
                    commonSearchObjectKey: "name"
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
                description: {
                    isVisible: true,
                    label: "Description",
                    class: "",
                    searchKey: "description",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "asset_statuses",
                    commonSearchKey: "asset_statuses",
                    commonSearchObjectKey: "description"
                },
                created_at: {
                    isVisible: true,
                    label: "Created At",
                    class: "",
                    searchKey: "created_at",
                    type: "date",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "asset_statuses",
                    commonSearchKey: "asset_statuses",
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
                    getListTable: "asset_statuses",
                    commonSearchKey: "asset_statuses",
                    commonSearchObjectKey: "updated_at"
                }
            }
        }
    },
    type: {
        name: "Asset Type",
        key: "asset_types",
        responseKey: "asset_types",
        apiBodyParam: "asset_type",
        permissionKey: "asset_types",
        tableConfig: {
            keys: ["name", "client", "description", "created_at", "updated_at"],
            config: {
                name: {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "asset_types",
                    commonSearchKey: "asset_types",
                    commonSearchObjectKey: "name"
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
                description: {
                    isVisible: true,
                    label: "Description",
                    class: "",
                    searchKey: "description",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "asset_types",
                    commonSearchKey: "asset_types",
                    commonSearchObjectKey: "description"
                },
                created_at: {
                    isVisible: true,
                    label: "Created At",
                    class: "",
                    searchKey: "created_at",
                    type: "date",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "asset_types",
                    commonSearchKey: "asset_types",
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
                    getListTable: "asset_types",
                    commonSearchKey: "asset_types",
                    commonSearchObjectKey: "updated_at"
                }
            }
        }
    },
    condition: {
        name: "Asset Condition",
        key: "client_asset_conditions",
        responseKey: "asset_conditions",
        apiBodyParam: "client_asset_condition",
        permissionKey: "asset_conditions",
        tableConfig: {
            keys: ["name", "client", "description", "color_code", "created_at", "updated_at"],
            config: {
                name: {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "client_asset_conditions",
                    commonSearchKey: "client_asset_conditions",
                    commonSearchObjectKey: "name"
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
                description: {
                    isVisible: true,
                    label: "Description",
                    class: "",
                    searchKey: "description",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "",
                    commonSearchKey: "",
                    commonSearchObjectKey: "",
                    isTextArea:true
                },
                color_code: {
                    isVisible: false,
                    label: "Color",
                    class: "",
                    searchKey: "",
                    type: "string",
                    hasWildCardSearch: false,
                    hasCommonSearch: false,
                    getListTable: "",
                    commonSearchKey: "",
                    commonSearchObjectKey: ""
                },
                created_at: {
                    isVisible: true,
                    label: "Created At",
                    class: "",
                    searchKey: "created_at",
                    type: "date",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "client_asset_conditions",
                    commonSearchKey: "client_asset_conditions",
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
                    getListTable: "client_asset_conditions",
                    commonSearchKey: "client_asset_conditions",
                    commonSearchObjectKey: "updated_at"
                }
            }
        }
    },
    pie_chart: {
        name: "Asset Pie Chart",
        key: "asset_chart_colors",
        responseKey: "chart_colors",
        apiBodyParam: "asset_chart_colors",
        permissionKey: "asset_chart_colors",
        tableConfig: {
            keys: ["client","expired", "next_year", "two_years", "three_to_five", "six_to_ten", "ten_plus",  "unknown"],
            config: {
                client: {
                    isVisible: true,
                    label: "Client",
                    class: "width-200px",
                    searchKey: "asset_chart_colors.client",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "asset_chart_colors",
                    commonSearchKey: "asset_chart_colors",
                    commonSearchObjectKey: "name"
                },
                "next_year": {
                    isVisible: true,
                    label: "Next Year",
                    class: "width-100px",
                    searchKey: "asset_chart_colors.next_year",
                    type: "string",
                    hasWildCardSearch: false,
                    hasCommonSearch: false,
                    getListTable: "asset_chart_colors",
                    commonSearchKey: "asset_chart_colors",
                    commonSearchObjectKey: "next_year"
                },
                "two_years": {
                    isVisible: true,
                    label: "2 Years",
                    class: "width-100px",
                    searchKey: "asset_chart_colors.two_years",
                    type: "string",
                    hasWildCardSearch: false,
                    hasCommonSearch: false,
                    getListTable: "asset_chart_colors",
                    commonSearchKey: "asset_chart_colors",
                    commonSearchObjectKey: "two_years"
                },
                "three_to_five": {
                    isVisible: true,
                    label: "3-5 Years",
                    class: "width-100px",
                    searchKey: "asset_chart_colors.three_to_five",
                    type: "string",
                    hasWildCardSearch: false,
                    hasCommonSearch: false,
                    getListTable: "asset_chart_colors",
                    commonSearchKey: "asset_chart_colors",
                    commonSearchObjectKey: "three_to_five"
                },
                "six_to_ten": {
                    isVisible: true,
                    label: "6-10 Years",
                    class: "width-100px",
                    searchKey: "asset_chart_colors.six_to_ten",
                    type: "string",
                    hasWildCardSearch: false,
                    hasCommonSearch: false,
                    getListTable: "asset_chart_colors",
                    commonSearchKey: "asset_chart_colors",
                    commonSearchObjectKey: "six_to_ten"
                },
                "ten_plus": {
                    isVisible: true,
                    label: "10+ Years",
                    class: "width-100px",
                    searchKey: "asset_chart_colors.ten_plus",
                    type: "string",
                    hasWildCardSearch: false,
                    hasCommonSearch: false,
                    getListTable: "asset_chart_colors",
                    commonSearchKey: "asset_chart_colors",
                    commonSearchObjectKey: "ten_plus"
                },
                "unknown": {
                    isVisible: true,
                    label: "Unknown",
                    class: "width-100px",
                    searchKey: "asset_chart_colors.unknown",
                    type: "string",
                    hasWildCardSearch: false,
                    hasCommonSearch: false,
                    getListTable: "asset_chart_colors",
                    commonSearchKey: "asset_chart_colors",
                    commonSearchObjectKey: "unknown"
                },
              
                "expired": {
                    isVisible: true,
                    label: "Expired",
                    class: "width-100px",
                    searchKey: "asset_chart_colors.expired",
                    type: "string",
                    hasWildCardSearch: false,
                    hasCommonSearch: false,
                    getListTable: "asset_chart_colors",
                    commonSearchKey: "asset_chart_colors",
                    commonSearchObjectKey: "expired"
                },
                // color_code: {
                //     isVisible: true,
                //     label: "Color",
                //     class: "",
                //     searchKey: "",
                //     type: "string",
                //     hasWildCardSearch: false,
                //     hasCommonSearch: false,
                //     getListTable: "",
                //     commonSearchKey: "",
                //     commonSearchObjectKey: ""
                // }

                // description: {
                //     isVisible: true,
                //     label: "Description",
                //     class: "",
                //     searchKey: "description",
                //     type: "string",
                //     hasWildCardSearch: true,
                //     hasCommonSearch: false,
                //     getListTable: "client_asset_conditions",
                //     commonSearchKey: "client_asset_conditions",
                //     commonSearchObjectKey: "description"
                // },
                // color_code: {
                //     isVisible: false,
                //     label: "Color",
                //     class: "",
                //     searchKey: "",
                //     type: "string",
                //     hasWildCardSearch: false,
                //     hasCommonSearch: false,
                //     getListTable: "",
                //     commonSearchKey: "",
                //     commonSearchObjectKey: ""
                // },
            }
        }
    },
    mainCategory: {
        name: "Main Category",
        key: "main_categories",
        responseKey: "main_categories",
        apiBodyParam: "main_category",
        permissionKey: "main_categories",
        tableConfig: {
            keys: ["name", "client", "created_at", "updated_at"],
            config: {
                name: {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "main_categories",
                    commonSearchKey: "main_categories",
                    commonSearchObjectKey: "name"
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
                created_at: {
                    isVisible: true,
                    label: "Created At",
                    class: "",
                    searchKey: "created_at",
                    type: "date",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "main_categories",
                    commonSearchKey: "main_categories",
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
                    getListTable: "main_categories",
                    commonSearchKey: "main_categories",
                    commonSearchObjectKey: "updated_at"
                }
            }
        }
    },
    subCategory1: {
        name: "Sub Category 1",
        key: "sub_category_1",
        responseKey: "sub_category_1s",
        apiBodyParam: "sub_category_1",
        permissionKey: "sub_category_1",
        tableConfig: {
            keys: ["name", "client", "main_category", "created_at", "updated_at"],
            config: {
                name: {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "sub_category_1",
                    commonSearchKey: "sub_category_1",
                    commonSearchObjectKey: "name"
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
                main_category: {
                    isVisible: true,
                    label: "Main Category",
                    class: "",
                    searchKey: "main_categories.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "main_categories",
                    commonSearchKey: "main_categories",
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
                    getListTable: "sub_category_1",
                    commonSearchKey: "sub_category_1",
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
                    getListTable: "sub_category_1",
                    commonSearchKey: "sub_category_1",
                    commonSearchObjectKey: "updated_at"
                }
            }
        }
    },
    subCategory2: {
        name: "Sub Category 2",
        key: "sub_category_2",
        responseKey: "sub_category_2s",
        apiBodyParam: "sub_category_2",
        permissionKey: "sub_category_2",
        tableConfig: {
            keys: ["name", "client", "main_category", "sub_category_1", "subcategory2_description","created_at", "updated_at"],
            config: {
                name: {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "sub_category_2",
                    commonSearchKey: "sub_category_2",
                    commonSearchObjectKey: "name"
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
                main_category: {
                    isVisible: true,
                    label: "Main Category",
                    class: "",
                    searchKey: "main_categories.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "main_categories",
                    commonSearchKey: "main_categories",
                    commonSearchObjectKey: "name"
                },
                sub_category_1: {
                    isVisible: true,
                    label: "Sub Category 1",
                    class: "",
                    searchKey: "sub_category_1.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "sub_category_1",
                    commonSearchKey: "sub_category_1",
                    commonSearchObjectKey: "name"
                },
                subcategory2_description: {
                    isVisible: true,
                    label: "Sub Category 2 Description",
                    class: "",
                    searchKey: "subcategory2_description",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "",
                    commonSearchKey: "",
                    commonSearchObjectKey: ""
                },
                created_at: {
                    isVisible: true,
                    label: "Created At",
                    class: "",
                    searchKey: "created_at",
                    type: "date",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "sub_category_2",
                    commonSearchKey: "sub_category_2",
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
                    getListTable: "sub_category_2",
                    commonSearchKey: "sub_category_2",
                    commonSearchObjectKey: "updated_at"
                }
            }
        }
    },
    subCategory3: {
        name: "Sub Category 3",
        key: "sub_category_3",
        responseKey: "sub_category_3s",
        apiBodyParam: "sub_category_3",
        permissionKey: "sub_category_3",
        tableConfig: {
            keys: ["name", "client", "main_category", "sub_category_1", "sub_category_2", "created_at", "updated_at"],
            config: {
                name: {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "sub_category_3",
                    commonSearchKey: "sub_category_3",
                    commonSearchObjectKey: "name"
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
                main_category: {
                    isVisible: true,
                    label: "Main Category",
                    class: "",
                    searchKey: "main_categories.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "main_categories",
                    commonSearchKey: "main_categories",
                    commonSearchObjectKey: "name"
                },
                sub_category_1: {
                    isVisible: true,
                    label: "Sub Category 1",
                    class: "",
                    searchKey: "sub_category_1.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "sub_category_1",
                    commonSearchKey: "sub_category_1",
                    commonSearchObjectKey: "name"
                },
                sub_category_2: {
                    isVisible: true,
                    label: "Sub Category 2",
                    class: "",
                    searchKey: "sub_category_2.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "sub_category_2",
                    commonSearchKey: "sub_category_2",
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
                    getListTable: "sub_category_3",
                    commonSearchKey: "sub_category_3",
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
                    getListTable: "sub_category_3",
                    commonSearchKey: "sub_category_3",
                    commonSearchObjectKey: "updated_at"
                }
            }
        }
    },
    level1: {
        name: "Uniformat Level 1",
        key: "uniformat_level_1s",
        responseKey: "uniformat_level_1s",
        apiBodyParam: "uniformat_level_1",
        permissionKey: "uniformat_level_1",
        tableConfig: {
            keys: ["name", "created_at", "updated_at"],
            config: {
                name: {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "uniformat_level_1s",
                    commonSearchKey: "uniformat_level_1s",
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
                    getListTable: "uniformat_level_1s",
                    commonSearchKey: "uniformat_level_1s",
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
                    getListTable: "uniformat_level_1s",
                    commonSearchKey: "uniformat_level_1s",
                    commonSearchObjectKey: "updated_at"
                }
            }
        }
    },
    level2: {
        name: "Uniformat level 2",
        key: "uniformat_level_2s",
        responseKey: "uniformat_level_2s",
        apiBodyParam: "uniformat_level_2",
        permissionKey: "uniformat_level_2",
        tableConfig: {
            keys: ["name", "uniformat_level_1", "created_at", "updated_at"],
            config: {
                name: {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "uniformat_level_2s.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "uniformat_level_2s",
                    commonSearchKey: "uniformat_level_2s",
                    commonSearchObjectKey: "name"
                },
                uniformat_level_1: {
                    isVisible: true,
                    label: "Uniformat level 1",
                    class: "",
                    searchKey: "uniformat_level_1s.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "uniformat_level_1s",
                    commonSearchKey: "uniformat_level_1s",
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
                    getListTable: "uniformat_level_2s",
                    commonSearchKey: "uniformat_level_2s",
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
                    getListTable: "uniformat_level_2s",
                    commonSearchKey: "uniformat_level_2s",
                    commonSearchObjectKey: "updated_at"
                }
            }
        }
    },
    level3: {
        name: "Uniformat level 3",
        key: "uniformat_level_3s",
        responseKey: "uniformat_level_3s",
        apiBodyParam: "uniformat_level_3",
        permissionKey: "uniformat_level_3",
        tableConfig: {
            keys: ["name", "uniformat_level_1", "uniformat_level_2", "created_at", "updated_at"],
            config: {
                name: {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "uniformat_level_3s",
                    commonSearchKey: "uniformat_level_3s",
                    commonSearchObjectKey: "name"
                },
                uniformat_level_1: {
                    isVisible: true,
                    label: "Uniformat level 1",
                    class: "",
                    searchKey: "uniformat_level_1s.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "uniformat_level_1s",
                    commonSearchKey: "uniformat_level_1s",
                    commonSearchObjectKey: "name"
                },
                uniformat_level_2: {
                    isVisible: true,
                    label: "Uniformat level 2",
                    class: "",
                    searchKey: "uniformat_level_2s.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "uniformat_level_2s",
                    commonSearchKey: "uniformat_level_2s",
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
                    getListTable: "uniformat_level_3s",
                    commonSearchKey: "uniformat_level_3s",
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
                    getListTable: "uniformat_level_3s",
                    commonSearchKey: "uniformat_level_3s",
                    commonSearchObjectKey: "updated_at"
                }
            }
        }
    },
    level4: {
        name: "Uniformat level 4",
        key: "uniformat_level_4s",
        responseKey: "uniformat_level_4s",
        apiBodyParam: "uniformat_level_4",
        permissionKey: "uniformat_level_4",
        tableConfig: {
            keys: ["name", "uniformat_level_1", "uniformat_level_2", "uniformat_level_3", "created_at", "updated_at"],
            config: {
                name: {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "uniformat_level_4s",
                    commonSearchKey: "uniformat_level_4s",
                    commonSearchObjectKey: "name"
                },
                uniformat_level_1: {
                    isVisible: true,
                    label: "Uniformat level 1",
                    class: "",
                    searchKey: "uniformat_level_1s.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "uniformat_level_1s",
                    commonSearchKey: "uniformat_level_1s",
                    commonSearchObjectKey: "name"
                },
                uniformat_level_2: {
                    isVisible: true,
                    label: "Uniformat level 2",
                    class: "",
                    searchKey: "uniformat_level_2s.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "uniformat_level_2s",
                    commonSearchKey: "uniformat_level_2s",
                    commonSearchObjectKey: "name"
                },
                uniformat_level_3: {
                    isVisible: true,
                    label: "Uniformat level 3",
                    class: "",
                    searchKey: "uniformat_level_3s.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "uniformat_level_3s",
                    commonSearchKey: "uniformat_level_3s",
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
                    getListTable: "uniformat_level_4s",
                    commonSearchKey: "uniformat_level_4s",
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
                    getListTable: "uniformat_level_4s",
                    commonSearchKey: "uniformat_level_4s",
                    commonSearchObjectKey: "updated_at"
                }
            }
        }
    },
    level5: {
        name: "Uniformat level 5",
        key: "uniformat_level_5s",
        responseKey: "uniformat_level_5s",
        apiBodyParam: "uniformat_level_5",
        permissionKey: "uniformat_level_5",
        tableConfig: {
            keys: ["name", "uniformat_level_1", "uniformat_level_2", "uniformat_level_3", "uniformat_level_4", "created_at", "updated_at"],
            config: {
                name: {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "uniformat_level_5s",
                    commonSearchKey: "uniformat_level_5s",
                    commonSearchObjectKey: "name"
                },
                uniformat_level_1: {
                    isVisible: true,
                    label: "Uniformat level 1",
                    class: "",
                    searchKey: "uniformat_level_1s.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "uniformat_level_1s",
                    commonSearchKey: "uniformat_level_1s",
                    commonSearchObjectKey: "name"
                },
                uniformat_level_2: {
                    isVisible: true,
                    label: "Uniformat level 2",
                    class: "",
                    searchKey: "uniformat_level_2s.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "uniformat_level_2s",
                    commonSearchKey: "uniformat_level_2s",
                    commonSearchObjectKey: "name"
                },
                uniformat_level_3: {
                    isVisible: true,
                    label: "Uniformat level 3",
                    class: "",
                    searchKey: "uniformat_level_3s.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "uniformat_level_3s",
                    commonSearchKey: "uniformat_level_3s",
                    commonSearchObjectKey: "name"
                },
                uniformat_level_4: {
                    isVisible: true,
                    label: "Uniformat level 4",
                    class: "",
                    searchKey: "uniformat_level_4s.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "uniformat_level_4s",
                    commonSearchKey: "uniformat_level_4s",
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
                    getListTable: "uniformat_level_5s",
                    commonSearchKey: "uniformat_level_5s",
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
                    getListTable: "uniformat_level_5s",
                    commonSearchKey: "uniformat_level_5s",
                    commonSearchObjectKey: "updated_at"
                }
            }
        }
    },
    level6: {
        name: "Uniformat level 6",
        key: "uniformat_level_6s",
        responseKey: "uniformat_level_6s",
        apiBodyParam: "uniformat_level_6",
        permissionKey: "uniformat_level_6",
        tableConfig: {
            keys: ["name", "uniformat_level_1", "uniformat_level_2", "uniformat_level_3", "uniformat_level_4","uniformat_level_5" ,"uniformat_level_6_description", "created_at", "updated_at"],
            config: {
                name: {
                    isVisible: true,
                    label: "Name",
                    class: "",
                    searchKey: "name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "uniformat_level_6s",
                    commonSearchKey: "uniformat_level_6s",
                    commonSearchObjectKey: "name"
                },
                uniformat_level_1: {
                    isVisible: true,
                    label: "Uniformat level 1",
                    class: "",
                    searchKey: "uniformat_level_1s.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "uniformat_level_1s",
                    commonSearchKey: "uniformat_level_1s",
                    commonSearchObjectKey: "name"
                },
                uniformat_level_2: {
                    isVisible: true,
                    label: "Uniformat level 2",
                    class: "",
                    searchKey: "uniformat_level_2s.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "uniformat_level_2s",
                    commonSearchKey: "uniformat_level_2s",
                    commonSearchObjectKey: "name"
                },
                uniformat_level_3: {
                    isVisible: true,
                    label: "Uniformat level 3",
                    class: "",
                    searchKey: "uniformat_level_3s.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "uniformat_level_3s",
                    commonSearchKey: "uniformat_level_3s",
                    commonSearchObjectKey: "name"
                },
                uniformat_level_4: {
                    isVisible: true,
                    label: "Uniformat level 4",
                    class: "",
                    searchKey: "uniformat_level_4s.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "uniformat_level_4s",
                    commonSearchKey: "uniformat_level_4s",
                    commonSearchObjectKey: "name"
                },
                uniformat_level_5: {
                    isVisible: true,
                    label: "Uniformat level 5",
                    class: "",
                    searchKey: "uniformat_level_5s.name",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: true,
                    getListTable: "uniformat_level_5s",
                    commonSearchKey: "uniformat_level_5s",
                    commonSearchObjectKey: "name"
                },
                uniformat_level_6_description: {
                    isVisible: true,
                    label: "Uniformat level 6 Description",
                    class: "",
                    searchKey: "uniformat_level_6_description",
                    type: "string",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "",
                    commonSearchKey: "",
                    commonSearchObjectKey: ""
                },
                created_at: {
                    isVisible: true,
                    label: "Created At",
                    class: "",
                    searchKey: "created_at",
                    type: "date",
                    hasWildCardSearch: true,
                    hasCommonSearch: false,
                    getListTable: "uniformat_level_6s",
                    commonSearchKey: "uniformat_level_6s",
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
                    getListTable: "uniformat_level_6s",
                    commonSearchKey: "uniformat_level_6s",
                    commonSearchObjectKey: "updated_at"
                }
            }
        }
    }
};
