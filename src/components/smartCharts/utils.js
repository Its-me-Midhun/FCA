const getDisplayNameFromKey = (key, isDocName = false) => {
    if (isDocName) {
        return key;
    }
    switch (key) {
        case "trades":
            return "Trade";
        case "categories":
            return "Categories";
        case "priorities":
            return "Term";
        case "funding_sources":
            return "Funding Sources";
        case "criticality":
            return "Criticality";
        case "capital_type":
            return "Capital Type";
        case "additions":
            return "Additions";
        case "EFCI":
            return "CSP & EFCI";
        case "regions":
            return "Regions";
        case "sites":
            return "Sites";
        case "buildings":
            return "Buildings";
        case "sorted_recom":
            return "Sorted Recommendations";
        case "energy_band":
            return "Energy Band";
        case "water_band":
            return "Water Band";
        case "project":
            return "FCA Reporting";
        case "energy_mng":
            return "Energy Reporting";
        case "em_eui_building_breakdown":
            return "Building Breakdown Energy Use Intensity (kBTU per SF)";
        case "bld_brkdown_energy_usage":
            return "Annual Average Building Breakdown Total Energy Usage";
        case "em_eui_site_brkdown_energy_use":
            return "Site Breakdown Energy Use Intensity (kBTU per SF)";
        case "em_eui_energy_usage":
            return "Annual Average Energy Unit Usage Analysis (kBTU)";
        case "bld_brkdown_energy_cost":
            return "Annual Average Building Breakdown Total Energy Cost ($)";
        case "em_eci_site_cost":
            return "Site Breakdown Energy Cost Index ($ per SF)";
        case "em_eci_energy_cost":
            return "Annual Average Energy Unit Cost Analysis ($ per MMBTU)";
        case "assets":
            return "Asset Reporting";
        case "end_servicelife_year_condition":
            return "Assets End of Service Life by Year and Condition";
        case "asset_age_by_condition":
            return "Assets Age by Condition";
        case "asset_capital_spending_plan":
            return "Assets Capital Spending Plan by End of Service Life";
        case "asset_system_facility":
            return "System Facility Condition Index";
        case "system":
            return "System";
        case "summary_view":
            return "Summary View";
        case "detailed_view":
            return "Detailed View";
        case "table_view":
            return "Table View";
        case "pie_2d":
            return "Pie 2D";
        case "pie_3d":
            return "Pie 3D";
        case "donut_2d":
            return "Donut 2D";
        case "donut_3d":
            return "Donut 3D";
        case "stacked_column_2d":
            return "Stacked Column 2D";
        case "stacked_column_3d":
            return "Stacked Column 3D";
        case "line_column_2d":
            return "Line Column 2D";
        default:
            return key;
    }
};

const shiftObjectProps = (data, keyList = []) => {
    let shiftedObjectData = {};
    shiftedObjectData = keyList.reduce((resultData, currentProp, index) => {
        if (!data.hasOwnProperty(currentProp)) {
            return resultData;
        }
        return { ...resultData, [currentProp]: data[currentProp] };
    }, {});
    return shiftedObjectData;
};

export { getDisplayNameFromKey, shiftObjectProps };
