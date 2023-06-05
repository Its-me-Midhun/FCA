import React, { useEffect } from "react";
import { Route, Router, Switch } from "react-router-dom";
import history from "./config/history";
import PublicRoute from "./components/common/components/publicRoute";
import PrivateRoute from "./components/common/components/PrivateRoute";
import ResetPassword from "./components/user/components/resetPassword";
import PageNotFound from "./components/common/components/PageNotFound";
import Project from "./components/project/index";
import ExportLinkRoutingPage from "./components/common/components/ExportLinkRoutingPage";
import { ToastContainer } from "react-toastify";
import TradeSettings from "./components/tradeSettings";
import NotificationTest from "./components/common/components/NotificationTest";
import TestImageEditor from "./components/common/components/TestImageEditor";
import PrivacyPolicy from "./components/common/components/PrivacyPolicy";
import MetersGeneral from "./components/MetersGeneral";
const LoginForm = React.lazy(() => import("./components/user/components/LoginForm"));
const Dashboard = React.lazy(() => import("./components/dashboard"));
const Region = React.lazy(() => import("./components/region"));
const Site = React.lazy(() => import("./components/site"));
const Building = React.lazy(() => import("./components/building"));
const Recommendations = React.lazy(() => import("./components/recommendations/index"));
const Floor = React.lazy(() => import("./components/floor"));
const BuildingType = React.lazy(() => import("./components/buildingtype"));
const Client = React.lazy(() => import("./components/client"));
const User = React.lazy(() => import("./components/users"));
const UserPermissions = React.lazy(() => import("./components/userPermissions"));
const Templates = React.lazy(() => import("./components/template"));
const Helpers = React.lazy(() => import("./components/helper"));
const Logs = React.lazy(() => import("./components/log"));
const Consultancy = React.lazy(() => import("./components/consultancy"));
const ForgotPassword = React.lazy(() => import("./components/user/components/forgotPassword"));
const Initiatives = React.lazy(() => import("./components/initiatives"));
const Documents = React.lazy(() => import("./components/documents"));
const Reports = React.lazy(() => import("./components/reports"));
const MasterTrade = React.lazy(() => import("./components/master_trade"));
const MasterSystem = React.lazy(() => import("./components/master_system"));
const MasterSubSystem = React.lazy(() => import("./components/master_subsystem"));
const SpecialReport = React.lazy(() => import("./components/special_report"));
const ReportParagraph = React.lazy(() => import("./components/report_paragraph"));
const ChildParagraph = React.lazy(() => import("./components/child_paragraph"));
const ChartsAndGraphs = React.lazy(() => import("./components/charts_and_graphs"));
const SystemTables = React.lazy(() => import("./components/system_tables"));
const NarrativeTemplate = React.lazy(() => import("./components/narrativeTemplate"));
const TableTemplate = React.lazy(() => import("./components/tableTemplate"));
const ReportNoteTemplate = React.lazy(() => import("./components/reportNoteTemplate"));
const ReportTemplates = React.lazy(() => import("./components/reportTemplates"));
const ReportProperties = React.lazy(() => import("./components/reportProperties"));
const BuildingAddition = React.lazy(() => import("./components/buildingAddition"));
const Images = React.lazy(() => import("./components/images"));
const LandingPage = React.lazy(() => import("./components/landingPage"));
const ManageLandingPage = React.lazy(() => import("./components/manageLandingPage"));
const manageHeadings = React.lazy(() => import("./components/manageHeadings"));
const Assets = React.lazy(() => import("./components/assets"));
const AssetSettings = React.lazy(() => import("./components/assetSettings"));
const DocumentSettings = React.lazy(() => import("./components/documentSettings"));
const PropertyValues = React.lazy(() => import("./components/reportPropertyValues"));
const RecommendationTemplate = React.lazy(() => import("./components/recommendationTemplate"));
const Meters = React.lazy(() => import("./components/meterManagement"));
const EnergyManagement = React.lazy(() => import("./components/energyManagment"));
const Accounts = React.lazy(() => import("./components/accounts"));
const AssetManagement = React.lazy(() => import("./components/assetManagement"));
const chartTemplates = React.lazy(() => import("./components/chartTemplates"));
const ComingSoon = React.lazy(() => import("./components/common/components/ComingSoon"));
const ChartProperties = React.lazy(() => import("./components/chartProperties"));
const Email = React.lazy(() => import("./components/email"));
const Notifications = React.lazy(() => import("./components/notification/index"));
const SmartCharts = React.lazy(() => import("./components/smartCharts/index"));
const SignInWithSSO = React.lazy(() => import("./components/user/components/SignInWithSSO"));
// const Escalation = React.lazy(() => import("./components/common/components/Escalation"));
const Escalation = React.lazy(() => import("./components/site/components/FutureCapital"));

const App = () => {
    useEffect(() => {
        const tabsOpen = localStorage.getItem("tabsOpen");
        if (tabsOpen == null) {
            localStorage.setItem("tabsOpen", 1);
        } else {
            localStorage.setItem("tabsOpen", parseInt(tabsOpen) + parseInt(1));
        }

        // define decrement counter part
        window.onunload = function (e) {
            const newTabCount = localStorage.getItem("tabsOpen");
            if (newTabCount !== null) {
                localStorage.setItem("tabsOpen", newTabCount - 1);
            }
        };
    }, []);

    return (
        <>
            <ToastContainer />
            <Router history={history}>
                <Switch>
                    <PublicRoute exact path="/" component={LoginForm} />
                    <PublicRoute exact path="/login" component={LoginForm} />
                    <Route exact path="/reset_password/:token" component={ResetPassword} />
                    <PublicRoute exact path="/forgot_password" component={ForgotPassword} />
                    <PublicRoute exact path="/signinwith_sso" component={SignInWithSSO} />
                    <PrivateRoute path="/home" exact component={LandingPage} />
                    <PrivateRoute path="/dashboard" component={Dashboard} />

                    <PrivateRoute path="/tradeSettings/:settingType" component={TradeSettings} />
                    <PrivateRoute path="/tradeSettings" component={TradeSettings} />
                    <PrivateRoute exact path="/meters/:settingType" component={MetersGeneral} />
                    <PrivateRoute exact path="/meters" component={MetersGeneral} />

                    <PrivateRoute path="/initiatives" exact component={Initiatives} />
                    <PrivateRoute path="/initiatives/:section" exact component={Initiatives} />
                    <PrivateRoute path="/initiatives/:section/:tab" exact component={Initiatives} />
                    <PrivateRoute path="/initiatives/:section/:id/:tab" exact component={Initiatives} />

                    <PrivateRoute path="/region" exact component={Region} />
                    <PrivateRoute path="/region/:section" exact component={Region} />
                    <PrivateRoute path="/region/:section/:id/" exact component={Region} />
                    <PrivateRoute path="/region/:section/:id/:tab" exact component={Region} />
                    <PrivateRoute path="/region/:section/:id/:tab/:settingType" exact component={Region} />
                    <PrivateRoute path="/region/:section/:id/:tab/:subTab" exact component={Region} />

                    <PrivateRoute path="/efci" exact component={Project} />
                    <PrivateRoute path="/efci/:section/:id/:tab" exact component={Project} />

                    <PrivateRoute path="/project" exact component={Project} />
                    <PrivateRoute path="/project/:section" exact component={Project} />
                    <PrivateRoute path="/project/:section/:id/" exact component={Project} />
                    <PrivateRoute path="/project/:section/:id/:tab" exact component={Project} />
                    <PrivateRoute path="/project/:section/:id/:tab/:settingType" exact component={Project} />
                    <PrivateRoute path="/project/:section/:id/:tab/:settingType/:subSection" exact component={Project} />
                    <PrivateRoute path="/project/:section/:id/:tab/:settingType/:subSection/:subId" exact component={Project} />
                    <PrivateRoute path="/project/:section/:id/:tab/:settingType/:subSection/:subId/:subTab" exact component={Project} />

                    <PrivateRoute path="/site" exact component={Site} />
                    <PrivateRoute path="/site/:section" exact component={Site} />
                    <PrivateRoute path="/site/:section/:id" exact component={Site} />
                    <PrivateRoute path="/site/:section/:id/:tab" exact component={Site} />
                    <PrivateRoute path="/site/:section/:id/:tab/:settingType" exact component={Site} />
                    <PrivateRoute path="/site/:section/:id/:tab/:subTab" exact component={Site} />

                    <PrivateRoute path="/building" exact component={Building} />
                    <PrivateRoute path="/building/:section" exact component={Building} />
                    <PrivateRoute path="/building/:section/:id" exact component={Building} />
                    <PrivateRoute path="/building/:section/:id/:tab" exact component={Building} />
                    <PrivateRoute path="/building/:section/:id/:tab/:settingType" exact component={Building} />
                    <PrivateRoute path="/building/:section/:id/:tab/:subTab" exact component={Building} />

                    <PrivateRoute path="/settings/buildingtype" exact component={BuildingType} />
                    <PrivateRoute path="/buildingtype/:section/:id/:tab" exact component={BuildingType} />

                    <PrivateRoute path="/recommendations" exact component={Recommendations} />
                    <PrivateRoute path="/recommendations/:section" exact component={Recommendations} />
                    <PrivateRoute path="/recommendations/:section/:id" exact component={Recommendations} />
                    <PrivateRoute path="/recommendations/:section/:id/:tab" exact component={Recommendations} />

                    <PrivateRoute path="/floor/:section" exact component={Floor} />
                    <PrivateRoute path="/floor/:section/:id" exact component={Floor} />
                    <PrivateRoute path="/floor/:section/:id/:tab" exact component={Floor} />

                    <PrivateRoute path="/buildingAddition/:section" exact component={BuildingAddition} />
                    <PrivateRoute path="/buildingAddition/:section/:id" exact component={BuildingAddition} />
                    <PrivateRoute path="/buildingAddition/:section/:id/:tab" exact component={BuildingAddition} />

                    <PrivateRoute path="/client" exact component={Client} />
                    <PrivateRoute path="/client/:section" exact component={Client} />
                    <PrivateRoute path="/client/:section/:id/" exact component={Client} />
                    <PrivateRoute path="/client/:section/:id/:tab" exact component={Client} />

                    <PrivateRoute path="/settings/user" exact component={User} />
                    <PrivateRoute path="/settings/userPermissions" exact component={UserPermissions} />
                    <PrivateRoute path="/settings/userPermissions/:section" exact component={UserPermissions} />
                    <PrivateRoute path="/settings/userPermissions/:section/:id" exact component={UserPermissions} />
                    <PrivateRoute path="/settings/templates" exact component={Templates} />
                    <PrivateRoute path="/settings/templates/:section" exact component={Templates} />
                    <PrivateRoute path="/settings/templates/:section/:id" exact component={Templates} />

                    <PrivateRoute path="/user/:section" exact component={User} />
                    <PrivateRoute path="/user/:section/:id" exact component={User} />
                    <PrivateRoute path="/user/:section/:id/:tab" exact component={User} />

                    <PrivateRoute path="/consultancy" exact component={Consultancy} />
                    <PrivateRoute path="/consultancy/:section" exact component={Consultancy} />
                    <PrivateRoute path="/consultancy/:section/:id/" exact component={Consultancy} />
                    <PrivateRoute path="/consultancy/:section/:id/:tab" exact component={Consultancy} />

                    <PrivateRoute path="/documents" exact component={Documents} />
                    <PrivateRoute path="/documents/:section" exact component={Documents} />
                    <PrivateRoute path="/documents/:section/:id" exact component={Documents} />
                    <PrivateRoute path="/documents/:section/:id/:tab" exact component={Documents} />

                    <PrivateRoute path="/reports" exact component={Reports} />
                    <PrivateRoute path="/reports/:section" exact component={Reports} />
                    <PrivateRoute path="/reports/:section/:id" exact component={Reports} />
                    <PrivateRoute path="/reports/:section/:id/:tab" exact component={Reports} />
                    <PrivateRoute path="/reports/:section/:id/:tab/:settingType" exact component={Reports} />
                    <PrivateRoute path="/reports/:section/:id/:tab/:settingType/:subSection" exact component={Reports} />
                    <PrivateRoute path="/reports/:section/:id/:tab/:settingType/:subSection/:subId" exact component={Reports} />
                    <PrivateRoute path="/reports/:section/:id/:tab/:settingType/:subSection/:subId/:subTab" exact component={Reports} />

                    <PrivateRoute path="/settings/reportProperties" exact component={ReportProperties} />
                    <PrivateRoute path="/settings/reportProperties/:section" exact component={ReportProperties} />
                    <PrivateRoute path="/settings/reportProperties/:section/:id" exact component={ReportProperties} />
                    <PrivateRoute path="/settings/reportProperties/:section/:id/:tab" exact component={ReportProperties} />

                    <PrivateRoute path="/settings/reportTemplates" exact component={ReportTemplates} />
                    <PrivateRoute path="/settings/reportTemplates/:section" exact component={ReportTemplates} />
                    <PrivateRoute path="/settings/reportTemplates/:section/:id" exact component={ReportTemplates} />

                    <PrivateRoute path="/images" exact component={Images} />
                    <PrivateRoute path="/images/:section" exact component={Images} />
                    <PrivateRoute path="/images/:section/:id" exact component={Images} />
                    <PrivateRoute path="/images/:section/:id/:tab" exact component={Images} />

                    <PrivateRoute path="/trade" exact component={MasterTrade} />
                    <PrivateRoute path="/trade/:section" exact component={MasterTrade} />
                    <PrivateRoute path="/trade/:section/:id" exact component={MasterTrade} />
                    <PrivateRoute path="/trade/:section/:id/:tab" exact component={MasterTrade} />

                    <PrivateRoute path="/system" exact component={MasterSystem} />
                    <PrivateRoute path="/system/:section" exact component={MasterSystem} />
                    <PrivateRoute path="/system/:section/:id" exact component={MasterSystem} />
                    <PrivateRoute path="/system/:section/:id/:tab" exact component={MasterSystem} />

                    <PrivateRoute path="/subsystem" exact component={MasterSubSystem} />
                    <PrivateRoute path="/subsystem/:section" exact component={MasterSubSystem} />
                    <PrivateRoute path="/subsystem/:section/:id" exact component={MasterSubSystem} />
                    <PrivateRoute path="/subsystem/:section/:id/:tab" exact component={MasterSubSystem} />

                    <PrivateRoute path="/specialreport" exact component={SpecialReport} />
                    <PrivateRoute path="/specialreport/:section" exact component={SpecialReport} />
                    <PrivateRoute path="/specialreport/:section/:id" exact component={SpecialReport} />
                    <PrivateRoute path="/specialreport/:section/:id/:tab" exact component={SpecialReport} />

                    <PrivateRoute path="/reportparagraph" exact component={ReportParagraph} />
                    <PrivateRoute path="/reportparagraph/:section" exact component={ReportParagraph} />
                    <PrivateRoute path="/reportparagraph/:section/:id" exact component={ReportParagraph} />
                    <PrivateRoute path="/reportparagraph/:section/:id/:tab" exact component={ReportParagraph} />

                    <PrivateRoute path="/childparagraph" exact component={ChildParagraph} />
                    <PrivateRoute path="/childparagraph/:section" exact component={ChildParagraph} />
                    <PrivateRoute path="/childparagraph/:section/:id" exact component={ChildParagraph} />
                    <PrivateRoute path="/childparagraph/:section/:id/:tab" exact component={ChildParagraph} />

                    <PrivateRoute path="/chartsandgraphs" exact component={ChartsAndGraphs} />
                    <PrivateRoute path="/chartsandgraphs/:section" exact component={ChartsAndGraphs} />
                    <PrivateRoute path="/chartsandgraphs/:section/:id" exact component={ChartsAndGraphs} />
                    <PrivateRoute path="/chartsandgraphs/:section/:id/:tab" exact component={ChartsAndGraphs} />

                    <PrivateRoute path="/systemtables" exact component={SystemTables} />
                    <PrivateRoute path="/systemtables/:section" exact component={SystemTables} />
                    <PrivateRoute path="/systemtables/:section/:id" exact component={SystemTables} />
                    <PrivateRoute path="/systemtables/:section/:id/:tab" exact component={SystemTables} />

                    <PrivateRoute path="/narrativetemplate" exact component={NarrativeTemplate} />
                    <PrivateRoute path="/narrativetemplate/:section" exact component={NarrativeTemplate} />
                    <PrivateRoute path="/narrativetemplate/:section/:id" exact component={NarrativeTemplate} />
                    <PrivateRoute path="/narrativetemplate/:section/:id/:tab" exact component={NarrativeTemplate} />

                    <PrivateRoute path="/tabletemplate" exact component={TableTemplate} />
                    <PrivateRoute path="/tabletemplate/:section" exact component={TableTemplate} />
                    <PrivateRoute path="/tabletemplate/:section/:id" exact component={TableTemplate} />
                    <PrivateRoute path="/tabletemplate/:section/:id/:tab" exact component={TableTemplate} />

                    <PrivateRoute path="/reportnotetemplate" exact component={ReportNoteTemplate} />
                    <PrivateRoute path="/reportnotetemplate/:section" exact component={ReportNoteTemplate} />
                    <PrivateRoute path="/reportnotetemplate/:section/:id" exact component={ReportNoteTemplate} />
                    <PrivateRoute path="/reportnotetemplate/:section/:id/:tab" exact component={ReportNoteTemplate} />

                    <PrivateRoute path="/energymanagement" exact component={EnergyManagement} />
                    <PrivateRoute path="/energymanagement/:section" exact component={EnergyManagement} />
                    <PrivateRoute path="/energymanagement/:section/:id/" exact component={EnergyManagement} />
                    <PrivateRoute path="/energymanagement/:section/:id/:tab" exact component={EnergyManagement} />
                    <PrivateRoute path="/energymanagement/:section/:id/:tab/:settingType" exact component={EnergyManagement} />
                    <PrivateRoute path="/energymanagement/:section/:id/:tab/:settingType/:subSection/:subId" exact component={EnergyManagement} />
                    <PrivateRoute
                        path="/energymanagement/:section/:id/:tab/:settingType/:subSection/:subId/:subTab"
                        exact
                        component={EnergyManagement}
                    />

                    <PrivateRoute path="/meter" exact component={Meters} />
                    <PrivateRoute path="/meter/:section" exact component={Meters} />
                    <PrivateRoute path="/meter/:section/:id" exact component={Meters} />
                    <PrivateRoute path="/meter/:section/:id/:tab" exact component={Meters} />

                    <PrivateRoute path="/accounts" exact component={Accounts} />
                    <PrivateRoute path="/accounts/:section" exact component={Accounts} />
                    <PrivateRoute path="/accounts/:section/:id" exact component={Accounts} />
                    <PrivateRoute path="/accounts/:section/:id/:tab" exact component={Accounts} />

                    <PrivateRoute path="/settings/helpers" exact component={Helpers} />
                    <PrivateRoute path="/settings/logs" exact component={Logs} />
                    <PrivateRoute path="/settings/manageLandingPage" exact component={ManageLandingPage} />
                    <PrivateRoute path="/settings/manageLandingPage/:section" exact component={ManageLandingPage} />
                    <PrivateRoute path="/settings/manageLandingPage/:section/:id" exact component={ManageLandingPage} />

                    <PrivateRoute path="/settings/helpers" exact component={Helpers} />
                    <PrivateRoute path="/settings/logs" exact component={Logs} />
                    <PrivateRoute path="/settings/manageHeadings" exact component={manageHeadings} />
                    <PrivateRoute path="/settings/manageHeadings/:section" exact component={manageHeadings} />
                    <PrivateRoute path="/settings/manageHeadings/:section/:id" exact component={manageHeadings} />

                    <PrivateRoute path="/assetmanagement" exact component={AssetManagement} />
                    <PrivateRoute path="/assetmanagement/:section" exact component={AssetManagement} />
                    <PrivateRoute path="/assetmanagement/:section/:id" exact component={AssetManagement} />
                    <PrivateRoute path="/assetmanagement/:section/:id/:tab" exact component={AssetManagement} />

                    <PrivateRoute path="/assets" exact component={Assets} />
                    <PrivateRoute path="/assets/:section" exact component={Assets} />
                    <PrivateRoute path="/assets/:section/:id" exact component={Assets} />
                    <PrivateRoute path="/assets/:section/:id/:tab" exact component={Assets} />

                    <PrivateRoute path="/asset-settings/:settingType" exact component={AssetSettings} />
                    <PrivateRoute path="/asset-settings/:settingType/:section" exact component={AssetSettings} />
                    <PrivateRoute path="/asset-settings/:settingType/:section/:id" exact component={AssetSettings} />
                    <PrivateRoute path="/asset-settings/:settingType/:section/:id/:tab" exact component={AssetSettings} />

                    <PrivateRoute path="/document-settings/:settingType" exact component={DocumentSettings} />
                    <PrivateRoute path="/document-settings/:settingType/:section" exact component={DocumentSettings} />
                    <PrivateRoute path="/document-settings/:settingType/:section/:id" exact component={DocumentSettings} />
                    <PrivateRoute path="/document-settings/:settingType/:section/:id/:tab" exact component={DocumentSettings} />

                    <PrivateRoute path="/settings/reportpropertyvalues/:tab" exact component={PropertyValues} />
                    <PrivateRoute path="/settings/reportpropertyvalues/:tab/:section" exact component={PropertyValues} />
                    <PrivateRoute path="/settings/reportpropertyvalues/:tab/:section/:id" exact component={PropertyValues} />

                    <PrivateRoute path="/recommendationtemplate" exact component={RecommendationTemplate} />
                    <PrivateRoute path="/recommendationtemplate/:section" exact component={RecommendationTemplate} />
                    <PrivateRoute path="/recommendationtemplate/:section/:id" exact component={RecommendationTemplate} />
                    <PrivateRoute path="/recommendationtemplate/:section/:id/:tab" exact component={RecommendationTemplate} />

                    <PrivateRoute path="/chartTemplates" exact component={chartTemplates} />
                    <PrivateRoute path="/chartTemplates/:section" exact component={chartTemplates} />
                    <PrivateRoute path="/chartTemplates/:section/:id" exact component={chartTemplates} />
                    <PrivateRoute path="/chartTemplates/:section/:id/:tab" exact component={chartTemplates} />

                    <PrivateRoute path="/chartProperties" exact component={ChartProperties} />
                    <PrivateRoute path="/chartProperties/:section" exact component={ChartProperties} />
                    <PrivateRoute path="/chartProperties/:section/:id" exact component={ChartProperties} />
                    <PrivateRoute path="/chartProperties/:section/:id/:tab" exact component={ChartProperties} />

                    <PrivateRoute path="/settings/email" exact component={Email} />
                    <PrivateRoute path="/settings/email/:section" exact component={Email} />
                    <PrivateRoute path="/settings/email/:section/:id" exact component={Email} />

                    <PrivateRoute path="/settings/notifications" exact component={Notifications} />
                    <PrivateRoute path="/settings/notifications/:section" exact component={Notifications} />
                    <PrivateRoute path="/settings/notifications/:section/:id" exact component={Notifications} />

                    <PrivateRoute path="/smartcharts" exact component={SmartCharts} />
                    <PrivateRoute path="/smartcharts/:section" exact component={SmartCharts} />
                    <PrivateRoute path="/smartcharts/:section/:viewType" exact component={SmartCharts} />
                    <PrivateRoute path="/smartcharts/:section/:viewType/:id" exact component={SmartCharts} />

                    <Route path="/notificationTest" exact component={NotificationTest} />
                    <Route path="/TestImageEditor" exact component={TestImageEditor} />
                    <PrivateRoute path="/coming-soon" exact component={ComingSoon} />

                    <PrivateRoute path="/escalation" exact component={Escalation} />

                    <Route path="/export-routing-link/:id" exact component={ExportLinkRoutingPage} />

                    <Route path="/privacypolicy" exact component={PrivacyPolicy} />
                    <Route component={PageNotFound} />
                </Switch>
            </Router>
        </>
    );
};

export default App;
