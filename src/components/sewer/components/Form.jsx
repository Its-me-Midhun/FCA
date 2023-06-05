import React, { Component } from "react";
import { connect } from "react-redux";
import _, { values } from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import sewerActions from "../actions";
import { popBreadCrumpData, findPrevPathFromBreadCrump } from "../../../config/utils";
import LoadingOverlay from "react-loading-overlay";
import NumberFormat from "react-number-format";
import { month, year, disabledRegion, disabledSite, disabledBuilding, yearCraetor } from "../utils";

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            regions: [],
            sites: [],
            buildings: [],
            accounts: [],
            meters: [],
            client_id: "",
            values: {},
            meterTemplate: [
                { key: "region_id", type: "id", arr: "regions", label: "Select Region *", disabled: disabledRegion.includes(this.props.sect) },
                { key: "site_id", type: "id", arr: "sites", label: "Select Site *", disabled: disabledSite.includes(this.props.sect) },
                {
                    key: "building_id",
                    type: "id",
                    arr: "buildings",
                    label: "Select Building *",
                    disabled: disabledBuilding.includes(this.props.sect)
                },
                { key: "account_id", type: "id", arr: "accounts", label: "Select Account Number *" },
                { key: "account_description", type: "input", arr: "", label: "Account Description", disabled: true },
                { key: "meter_id", type: "id", arr: "meters", label: "Select Meter *" },
                { key: "meter_description", type: "input", arr: "", label: "Meter Description", disabled: true }
            ],
            subTemplates: [
                // { key: "kw_cost", type: "number", label: "kw cost" },
                // { key: "kw_usage", type: "number", label: "kw usage" },
                // { key: "kwh_cost", type: "number", label: "kwh cost" },
                // { key: "kwh_usage", type: "number", label: "kwh usage" },
                // { key: "mmbtu_usage", type: "number", label: "MMBTU usage" },
                // { key: "total_electric_cost", type: "number", label: "Total Electric Cost" },
                { key: "year", type: "year", arr: "year", label: "Year *" },
                { key: "month", type: "month", arr: "month", label: "Month *" },
                { key: "ccf_usage", type: "number", label: "CCF usage *" },
                // { key: "mmbtu_transport_cost", type: "number", label: "MMBTU Transport Cost" },
                // { key: "mmbtu_well_head_cost", type: "number", label: "MMBTU Well Head Cost" },
                // { key: "mmbtu_total_gas_cost", type: "number", label: "MMBTU Total Gas Cost" },
                { key: "ccf_cost", type: "number", label: "CCF Cost ($) *", prefix: true }
            ],
            errorParams: {
                region_id: "",
                site_id: "",
                building_id: "",
                account_id: "",
                meter: ""
            },
            initiaValues: {},
            isNewProject: true,
            selectedClient: {},
            selectedConsultancyUsers: [],
            selectedClientUsers: [],
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false,
            selectedBuilding: qs.parse(this.props.location.search.bid) || null,
            initialConsultancyUsers: [],
            initialClientUsers: []
        };
    }

    paramFetcher = async () => {
        const { sect, sectId } = this.props;
        let client_id = localStorage.getItem("energyclientID");
        let tempVal = this.state.values;
        if (sect === "energyinfo") {
            this.setState({ client_id: client_id });
            return "client_id";
        }
        if (sect === "buildinginfo") {
            let {
                sewerReducer: { getBuildingByIdResponse }
            } = this.props;
            await this.props.getBuildingById(sectId);
            this.setState({
                client_id: client_id,
                values: {
                    ...tempVal,
                    region_id: getBuildingByIdResponse?.region?.id,
                    site_id: getBuildingByIdResponse?.site?.id,
                    building_id: sectId
                }
            });
            return "building_id";
        }
        if (sect === "regioninfo") {
            this.setState({ client_id: client_id, values: { ...tempVal, region_id: sectId } });
            return "region_id";
        }
        if (sect === "siteinfo") {
            await this.props.getSiteById(sectId);
            let {
                sewerReducer: { getSiteByIdResponse }
            } = this.props;
            this.setState({ client_id: client_id, values: { ...tempVal, region_id: getSiteByIdResponse?.region?.id, site_id: sectId } });
            return "site_id";
        }
        return null;
    };

    componentDidMount = async () => {
        await this.paramFetcher();

        if (this.props.selectedMeterTemplate) {
            await this.props.getMeterTemplateById(this.props.selectedMeterTemplate);
            const {
                sewerReducer: {
                    getMeterTemplateByIdResponse: {
                        success,
                        region,
                        site,
                        building,
                        year: yearId,
                        month: monthId,
                        meter,
                        account,
                        kw_cost,
                        kw_usage,
                        kwh_cost,
                        kwh_usage,
                        mmbtu_total_gas_cost,
                        mmbtu_transport_cost,
                        mmbtu_usage,
                        mmbtu_well_head_cost,
                        ccf_cost,
                        ccf_usage,
                        total_electric_cost
                    }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    values: {
                        meter_id: meter?.id,
                        meter_description: meter?.description,
                        account_id: account?.id,
                        account_description: account?.description,
                        region_id: region?.id,
                        site_id: site?.id,
                        building_id: building?.id,
                        year: yearId,
                        month: monthId,
                        // kwh_usage: kwh_usage,
                        // mmbtu_usage: mmbtu_usage,
                        // kw_usage: kw_usage,
                        // kwh_cost: kwh_cost,
                        // kw_cost: kw_cost,
                        // total_electric_cost: total_electric_cost
                        ccf_usage: ccf_usage,
                        // mmbtu_transport_cost: mmbtu_transport_cost,
                        // mmbtu_well_head_cost: mmbtu_well_head_cost,
                        // mmbtu_total_gas_cost: mmbtu_total_gas_cost
                        ccf_cost: ccf_cost
                    }
                });
            }
        }
        this.setState({
            initiaValues: this.state.values,
            isLoading: false
        });
    };

    componentDidUpdate = (prevProps, prevState) => {
        let currVal = this.state?.values;

        if (this.state.client_id !== prevState?.client_id) {
            this.state.client_id && this.handleRegionDetails(this.state.client_id);
        }
        if (currVal?.region_id !== prevState?.values?.region_id) {
            currVal?.region_id && this.handleSiteDetails(this.state.client_id, { region_id: currVal?.region_id });
        }
        if (currVal?.site_id !== prevState?.values?.site_id) {
            currVal?.site_id && this.handleBuildingDetails(this.state.client_id, { site_id: currVal?.site_id });
        }
        if (currVal?.building_id !== prevState?.values?.building_id) {
            currVal?.building_id && this.handleAccountDetails({ building_id: currVal?.building_id, account_type: "Sewer" });
        }
        if (currVal?.account_id !== prevState?.values?.account_id) {
            currVal?.account_id && this.handleMeterDetails({ account_id: currVal?.account_id, account_type: "Sewer" });
        }
    };

    handleAccountDetails = async params => {
        const { getMeterAccounts } = this.props;
        await getMeterAccounts(params);
        let { accounts } = this.props.sewerReducer?.getAccountsListResponse;
        this.setState({
            accounts
        });
    };

    handleRegionDetails = async id => {
        const { getMeterRegionList } = this.props;
        await getMeterRegionList(id);
        let { regions } = this.props.sewerReducer?.getRegionListResponse;
        this.setState({
            regions
        });
    };

    handleSiteDetails = async (id, params) => {
        const { getMeterSiteList } = this.props;
        await getMeterSiteList(id, params);
        let { sites } = this.props.sewerReducer?.getSiteListResponse;
        this.setState({
            sites
        });
    };

    handleBuildingDetails = async (id, params) => {
        const { getMeterBuildingList } = this.props;
        await getMeterBuildingList(id, params);
        let { buildings } = this.props.sewerReducer?.getBuildingListResponse;
        this.setState({
            buildings
        });
    };
    handleMeterDetails = async params => {
        const { getMeterList } = this.props;
        await getMeterList(params);
        let { meters } = this.props.sewerReducer?.getMeterListResponse;
        this.setState({
            meters
        });
    };

    handleChange = (key, val, options) => {
        let tempVal = this.state.values;
        switch (key) {
            case "region_id":
                this.setState({ values: { ...tempVal, region_id: val, site_id: "" } });
                break;
            case "site_id":
                this.setState({ values: { ...tempVal, site_id: val, building_id: "" } });
                break;
            case "building_id":
                this.setState({ values: { ...tempVal, building_id: val, account_id: "" } });
                break;
            case "account_id":
                const account_description = options?.find(elem => elem.id === val)?.description || "";
                this.setState({ values: { ...tempVal, account_id: val, account_description, meter_id: "" } });
                break;
            case "meter_id":
                const meter_description = options?.find(elem => elem.id === val)?.description || "";
                this.setState({ values: { ...tempVal, meter_id: val, meter_description } });
                break;
            default:
                this.setState({ values: { ...tempVal, [key]: val } });
                break;
        }
    };

    validate = () => {
        const { values, meterTemplate, subTemplates } = this.state;
        let errorParams = {};
        meterTemplate.map(item => (errorParams[item?.key] = false));
        subTemplates.map(item => (errorParams[item?.key] = false));

        let showErrorBorder = false;

        Object.keys(errorParams).forEach(item => {
            if (!values?.[item]?.toString().trim().length) {
                errorParams[item] = true;
                showErrorBorder = true;
            }
        });

        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    addTemplate = async () => {
        const { values } = this.state;
        const { handleAddMeterTemplate } = this.props;
        let client_id = localStorage.getItem("energyclientID");
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleAddMeterTemplate({
                ...values,
                meter_type: "Sewer",
                client_id,
                kw_cost: null,
                kw_usage: null,
                kwh_cost: null,
                kwh_usage: null,
                mmbtu_total_gas_cost: null,
                mmbtu_transport_cost: null,
                mmbtu_usage: null,
                mmbtu_well_head_cost: null,
                total_electric_cost: null
            });
            this.setState({
                isUploading: false
            });
        }
    };

    updateMeterTemplate = async () => {
        const { values } = this.state;
        const meterTemplate_id = this.props.selectedMeterTemplate;
        const { handleUpdateMeterTemplate } = this.props;
        let client_id = localStorage.getItem("energyclientID");
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleUpdateMeterTemplate(meterTemplate_id, {
                ...values,
                meter_type: "Sewer",
                client_id,
                kw_cost: null,
                kw_usage: null,
                kwh_cost: null,
                kwh_usage: null,
                mmbtu_total_gas_cost: null,
                mmbtu_transport_cost: null,
                mmbtu_usage: null,
                mmbtu_well_head_cost: null,
                total_electric_cost: null
            });
            this.setState({
                isUploading: false
            });
        }
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to clear and lose all changes?"}
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.clearForm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    cancelForm = () => {
        if (_.isEqual(this.state.initiaValues, this.state.values)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
        // const { history } = this.props;
        // const { location } = history;
        // let path = location.pathname;
        // // path = path.slice(0, path.lastIndexOf("/"));
        // history.push(findPrevPathFromBreadCrump());
        // popBreadCrumpData();
    };

    clearForm = async () => {
        const { history } = this.props;
        await this.setState({
            values: {},
            selectedClient: {},
            selectedConsultancyUsers: []
        });
        history.goBack();
        // history.push(findPrevPathFromBreadCrump() || "/narrativeTemplate");
        popBreadCrumpData();
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };

    render() {
        const { isLoading } = this.state;

        const { meterTemplate, subTemplates, values, showErrorBorder, errorParams } = this.state;
        const { selectedMeterTemplate, type } = this.props;

        return (
            <React.Fragment>
                <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                    <div className="dtl-sec col-md-12">
                        <div className="tab-dtl region-mng">
                            <ul>
                                <li className="active">{`${type === "add" ? "Add" : "Edit"} Details`}</li>
                            </ul>
                            <form autoComplete={"nope"}>
                                <div className="tab-active build-dtl">
                                    <div className="otr-common-edit custom-col">
                                        <div className="basic-otr">
                                            <div className="basic-dtl-otr basic-sec">
                                                {meterTemplate.map(item => (
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>{item?.label}</h4>
                                                            {item.type === "input" ? (
                                                                <input
                                                                    autoComplete="nope"
                                                                    placeholder={item.label}
                                                                    className={`custom-input form-control ${item.disabled ? "cursor-diabled" : ""}`}
                                                                    onChange={e => this.handleChange(item?.key, e.target.value)}
                                                                    value={values?.[item?.key]}
                                                                    disabled={item.disabled}
                                                                />
                                                            ) : (
                                                                <div className="custom-selecbox">
                                                                    <select
                                                                        autoComplete="nope"
                                                                        className={`${
                                                                            showErrorBorder && errorParams?.[item?.key] ? "error-border " : ""
                                                                        }custom-selecbox form-control`}
                                                                        onChange={e =>
                                                                            this.handleChange(item?.key, e.target.value, this.state?.[item?.arr])
                                                                        }
                                                                        value={values?.[item?.key]}
                                                                        disabled={!this.state?.[item?.arr]?.length || item?.disabled}
                                                                    >
                                                                        <option value="">Select</option>
                                                                        {this.state?.[item?.arr]?.map(x => (
                                                                            <option value={x?.id}>
                                                                                {`${x?.name || x?.number || x?.meter} ${
                                                                                    x?.description ? `(${x.description})` : ""
                                                                                }`}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                                {subTemplates.map(item => (
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            {(() => {
                                                                switch (item?.type) {
                                                                    case "number":
                                                                        return (
                                                                            <>
                                                                                <h4>{item?.label}</h4>
                                                                                <NumberFormat
                                                                                    autoComplete="nope"
                                                                                    placeholder="Enter details"
                                                                                    prefix={item?.prefix ? "$" : ""}
                                                                                    thousandSeparator={true}
                                                                                    className={`${
                                                                                        showErrorBorder && errorParams?.[item?.key]
                                                                                            ? "error-border"
                                                                                            : ""
                                                                                    } custom-input form-control`}
                                                                                    onValueChange={values => {
                                                                                        const { value } = values;
                                                                                        this.handleChange(item?.key, value);
                                                                                    }}
                                                                                    value={values?.[item?.key]}
                                                                                />
                                                                            </>
                                                                        );
                                                                    case "id":
                                                                        return (
                                                                            <>
                                                                                <h4>{item?.label}</h4>
                                                                                <div className="custom-selecbox">
                                                                                    <select
                                                                                        autoComplete="nope"
                                                                                        className={`${
                                                                                            showErrorBorder && errorParams?.[item?.key]
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        }custom-selecbox form-control`}
                                                                                        onChange={e => this.handleChange(item?.key, e.target.value)}
                                                                                        value={values?.[item?.key]}
                                                                                        disabled={!this.state?.[item?.arr]?.length}
                                                                                    >
                                                                                        <option value="">Select</option>
                                                                                        {this.state?.[item?.arr]?.map(x => (
                                                                                            <option value={x?.id}>
                                                                                                {x?.name || x?.number || x?.meter}
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>
                                                                            </>
                                                                        );
                                                                    case "month":
                                                                        return (
                                                                            <>
                                                                                <h4>{item?.label}</h4>
                                                                                <div className="custom-selecbox">
                                                                                    <select
                                                                                        autoComplete="nope"
                                                                                        className={`${
                                                                                            showErrorBorder && errorParams?.[item?.key]
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        }custom-selecbox form-control`}
                                                                                        onChange={e => this.handleChange(item?.key, e.target.value)}
                                                                                        value={values?.[item?.key]}
                                                                                        disabled={!month?.length}
                                                                                    >
                                                                                        <option value="">Select Month</option>
                                                                                        {month?.map(x => (
                                                                                            <option value={x}>{x}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>
                                                                            </>
                                                                        );
                                                                    case "year":
                                                                        return (
                                                                            <>
                                                                                <h4>{item?.label}</h4>
                                                                                <div className="custom-selecbox">
                                                                                    <select
                                                                                        autoComplete="nope"
                                                                                        className={`${
                                                                                            showErrorBorder && errorParams?.[item?.key]
                                                                                                ? "error-border "
                                                                                                : ""
                                                                                        }custom-selecbox form-control`}
                                                                                        onChange={e => this.handleChange(item?.key, e.target.value)}
                                                                                        value={values?.[item?.key]}
                                                                                        disabled={!year?.length}
                                                                                    >
                                                                                        <option value="">Select Year</option>
                                                                                        {yearCraetor()?.map(x => (
                                                                                            <option value={x}>{x}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>
                                                                            </>
                                                                        );

                                                                    default:
                                                                        break;
                                                                }
                                                            })()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 text-right btnOtr edit-cmn-btn">
                                        <button
                                            type="button"
                                            className="btn btn-secondary btnClr col-md-2 mr-1"
                                            data-dismiss="modal"
                                            onClick={() => this.cancelForm()}
                                        >
                                            Cancel
                                        </button>
                                        {selectedMeterTemplate ? (
                                            <button
                                                type="button"
                                                className="btn btn-primary btnRgion col-md-2"
                                                onClick={() => this.updateMeterTemplate()}
                                            >
                                                Update Sewer Reading
                                            </button>
                                        ) : (
                                            <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.addTemplate()}>
                                                Add Sewer Reading
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    {this.renderConfirmationModal()}
                </LoadingOverlay>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { sewerReducer } = state;
    return { sewerReducer };
};

export default withRouter(connect(mapStateToProps, { ...sewerActions })(Form));
