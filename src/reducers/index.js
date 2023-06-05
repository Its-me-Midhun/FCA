import { combineReducers } from "redux";
import loginReducer from "../components/user/reducers";
import regionReducer from "../components/region/reducers";
import siteReducer from "../components/site/reducers";
import projectReducer from "../components/project/reducers";
import buildingReducer from "../components/building/reducers";
import recommendationsReducer from "../components/recommendations/reducers";
import floorReducer from "../components/floor/reducers";
import buildingTypeReducer from "../components/buildingtype/reducers";
import commonReducer from "../components/common/reducers";
import tradeReducer from "../components/trade/reducers";
import categoryReducer from "../components/category/reducers";
import departmentReducer from "../components/department/reducers";
import systemReducer from "../components/system/reducers";
import subsystemReducer from "../components/subsystem/reducers";
import generalsettingReducer from "../components/generalsetting/reducers";
import fundingsourceReducer from "../components/fundingsource/reducers";
import prioritysettingReducer from "../components/prioritysetting/reducers";
import clientReducer from "../components/client/reducers";
import userReducer from "../components/users/reducers";
import assetconditionReducer from "../components/assetcondition/reducers";
import userPermissionReducer from "../components/userPermissions/reducers";
import consultancyReducer from "../components/consultancy/reducers";
import dashboardReducer from "../components/dashboard/reducers";
import templateReducer from "../components/template/reducers";
import initativeReducer from "../components/initiatives/reducers";
import reportReducer from "../components/documents/reducers";
import fcaReportReducer from "../components/reports/reducers";
// import globalSettingsReducer from "../components/globalSettings/reducers";
import narrativeTemplateReducer from "../components/narrativeTemplate/reducers";
import specialReportReducer from "../components/special_report/reducers";
import reportParagraphReducer from "../components/report_paragraph/reducers";
import childParagraphReducer from "../components/child_paragraph/reducers";
import chartsAndGraphsReducer from "../components/charts_and_graphs/reducers";
import systemTablesReducer from "../components/system_tables/reducers";
import tableTemplateReducer from "../components/tableTemplate/reducers";
import reportNoteTemplateReducer from "../components/reportNoteTemplate/reducers";
import masterTradeReducer from "../components/master_trade/reducers";
import masterSystemReducer from "../components/master_system/reducers";
import masterSubSystemReducer from "../components/master_subsystem/reducers";
import helperReducer from "../components/helper/reducers";
import logReducer from "../components/log/reducers";
import reportPropertyReducer from "../components/reportProperties/reducers";
import reportTemplateReducer from "../components/reportTemplates/reducers";
import buildingAdditionReducer from "../components/buildingAddition/reducers";
import imageReducer from "../components/images/reducers";
import assetReducer from "../components/assets/reducers";
import assetSettingsReducer from "../components/assetSettings/reducers";
import propertyValueReducer from "../components/reportPropertyValues/reducers";
import recommendationTemplateReducer from "../components/recommendationTemplate/reducers";
import meterReducer from "../components/meterManagement/reducers";
import energyManagmentReducer from "../components/energyManagment/reducers";
import electricReducer from "../components/electricity/reducers";
import waterReducer from "../components/water/reducers";
import sewerReducer from "../components/sewer/reducers";
import gasReducer from "../components/gas/reducers";
import accountReducer from "../components/accounts/reducers";
import chartEnergyReducer from "../components/chartEnergyTemplate/reducers";
import assetManagementReducer from "../components/assetManagement/reducers";
import energyStarReducer from "../components/energyStar/reducers";
import documentSettingsReducer from "../components/documentSettings/reducers";
import chartTemplateReducer from "../components/chartTemplates/reducers";
import chartPropertyReducer from "../components/chartProperties/reducers";
import manageHeadingReducer from "../components/manageHeadings/reducers";
import capitalTypeReducer from "../components/capitalType/reducers";
import emailReducer from "../components/email/reducers"
import notificationReducer from "../components/notification/reducers";
import smartChartReducer from "../components/smartCharts/reducer"
import softCostReducer from "../components/softCosts/reducers"
const rootReducer = combineReducers({
    loginReducer,
    regionReducer,
    siteReducer,
    buildingReducer,
    projectReducer,
    recommendationsReducer,
    floorReducer,
    commonReducer,
    buildingTypeReducer,
    tradeReducer,
    categoryReducer,
    departmentReducer,
    systemReducer,
    subsystemReducer,
    generalsettingReducer,
    fundingsourceReducer,
    prioritysettingReducer,
    clientReducer,
    userReducer,
    assetconditionReducer,
    userPermissionReducer,
    consultancyReducer,
    dashboardReducer,
    templateReducer,
    initativeReducer,
    reportReducer,
    fcaReportReducer,
    // globalSettingsReducer,
    narrativeTemplateReducer,
    tableTemplateReducer,
    reportNoteTemplateReducer,
    masterTradeReducer,
    masterSystemReducer,
    masterSubSystemReducer,
    helperReducer,
    logReducer,
    reportPropertyReducer,
    reportTemplateReducer,
    buildingAdditionReducer,
    imageReducer,
    assetReducer,
    assetSettingsReducer,
    specialReportReducer,
    reportParagraphReducer,
    childParagraphReducer,
    chartsAndGraphsReducer,
    systemTablesReducer,
    propertyValueReducer,
    recommendationTemplateReducer,
    meterReducer,
    energyManagmentReducer,
    electricReducer,
    waterReducer,
    sewerReducer,
    gasReducer,
    accountReducer,
    chartEnergyReducer,
    assetManagementReducer,
    energyStarReducer,
    documentSettingsReducer,
    chartTemplateReducer,
    chartPropertyReducer,
    manageHeadingReducer,
    capitalTypeReducer,
    emailReducer,
    notificationReducer,
    smartChartReducer,
    softCostReducer
});

const AppReducer = (state, action) => {
    if (action.type === "LOGOUT_SUCCESS") {
        return rootReducer(undefined, action);
    }
    return rootReducer(state, action);
};

export default AppReducer;
