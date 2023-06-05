import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import meterActions from "../actions";
import { popBreadCrumpData, findPrevPathFromBreadCrump } from "../../../config/utils";

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            clients: [],
            regions: [],
            sites: [],
            buildings: [],
            accounts: [],
            meterTemplate: {
                client_id: "",
                region_id: "",
                site_id: "",
                building_id: "",
                account_id: "",
                meter_type: "",
                meter: "",
                description: "",
                account_description: "",
                account_type: ""
            },
            errorParams: {
                client_id: "",
                region_id: "",
                site_id: "",
                building_id: "",
                account_id: "",
                meter_type: "",
                meter: ""
            },
            initiaValues: {},
            isNewProject: true,
            selectedClient: {},
            projectList: [],
            selectedConsultancyUsers: [],
            selectedClientUsers: [],
            selectedMeterTemplate: props.match.params.id,
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false,
            selectedBuilding: qs.parse(this.props.location.search.bid) || null,
            initialConsultancyUsers: [],
            initialClientUsers: [],
            userRole: localStorage.getItem("role")
        };
    }

    componentDidMount = async () => {
        this.handleClientDetails();
        if (this.state.selectedMeterTemplate) {
            await this.props.getDataById(this.state.selectedMeterTemplate);
            const {
                meterReducer: {
                    getMeterTemplateByIdResponse: { success, client, region, site, building, meter_type, meter, account, description }
                }
            } = this.props;

            if (success) {
                await this.setState({
                    meterTemplate: {
                        client_id: client?.id,
                        region_id: region?.id,
                        site_id: site?.id,
                        building_id: building?.id,
                        account_id: account?.id,
                        meter_type,
                        meter,
                        account_description: account?.description,
                        account_type: account?.account_type,
                        description: description
                    }
                });
            }
        }

        await this.setState({
            initiaValues: this.state.meterTemplate,
            isLoading: false
        });
    };

    componentDidUpdate = (prevProps, prevState) => {
        let { client_id, region_id, site_id, building_id } = this.state?.meterTemplate;

        if (client_id !== prevState?.meterTemplate?.client_id) {
            client_id && this.handleRegionDetails(client_id);
        }
        if (region_id !== prevState?.meterTemplate?.region_id) {
            region_id && this.handleSiteDetails(client_id, { region_id });
        }
        if (site_id !== prevState?.meterTemplate?.site_id) {
            site_id && this.handleBuildingDetails(client_id, { site_id });
        }
        if (building_id !== prevState?.meterTemplate?.building_id) {
            building_id && this.handleAccountDetails({ building_id });
        }
    };

    handleAccountDetails = async params => {
        const { getMeterAccounts } = this.props;
        await getMeterAccounts(params);
        let { accounts } = this.props.meterReducer?.getAccountsListResponse;
        this.setState({
            accounts
        });
    };

    handleClientDetails = async () => {
        const { getMeterClientList } = this.props;
        const clientID = localStorage.getItem("clientId");

        if (this.state.userRole === "client_user") {
            await getMeterClientList();
            let { clients } = this.props.meterReducer?.getClientListResponse;
            this.setState({
                clients: clients.filter(item => item.id === clientID),
                meterTemplate: {
                    client_id: clientID
                }
            });
        } else {
            await getMeterClientList();
            let { clients } = this.props.meterReducer?.getClientListResponse;
            this.setState({
                clients
            });
        }
    };

    handleRegionDetails = async id => {
        const { getMeterRegionList } = this.props;
        await getMeterRegionList(id);
        let { regions } = this.props.meterReducer?.getRegionListResponse;
        this.setState({
            regions
        });
    };

    handleSiteDetails = async (id, params) => {
        const { getMeterSiteList } = this.props;
        await getMeterSiteList(id, params);
        let { sites } = this.props.meterReducer?.getSiteListResponse;
        this.setState({
            sites
        });
    };

    handleBuildingDetails = async (id, params) => {
        const { getMeterBuildingList } = this.props;
        await getMeterBuildingList(id, params);
        let { buildings } = this.props.meterReducer?.getBuildingListResponse;
        this.setState({
            buildings
        });
    };

    validate = () => {
        const { meterTemplate } = this.state;
        let errorParams = {
            client_id: false,
            region_id: false,
            site_id: false,
            building_id: false,
            account_id: false,
            // meter_type: false,
            meter: false,
            description: false
        };
        let showErrorBorder = false;

        if (!meterTemplate.client_id || !meterTemplate.client_id.trim().length) {
            errorParams.client_id = true;
            showErrorBorder = true;
        }
        if (!meterTemplate.region_id || !meterTemplate.region_id.trim().length) {
            errorParams.region_id = true;
            showErrorBorder = true;
        }
        if (!meterTemplate.site_id || !meterTemplate.site_id.trim().length) {
            errorParams.site_id = true;
            showErrorBorder = true;
        }
        if (!meterTemplate.building_id || !meterTemplate.building_id.trim().length) {
            errorParams.building_id = true;
            showErrorBorder = true;
        }
        if (!meterTemplate.account_id || !meterTemplate.account_id.trim().length) {
            errorParams.account_id = true;
            showErrorBorder = true;
        }
        // if (!meterTemplate.meter_type || !meterTemplate.meter_type.trim().length) {
        //     errorParams.meter_type = true;
        //     showErrorBorder = true;
        // }
        if (!meterTemplate.meter || !meterTemplate.meter.trim().length) {
            errorParams.meter = true;
            showErrorBorder = true;
        }
        if (!meterTemplate.description || !meterTemplate.description.trim().length) {
            errorParams.description = true;
            showErrorBorder = true;
        }

        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    addTemplate = async () => {
        const { meterTemplate } = this.state;
        const { handleAddMeterTemplate } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            let tmpObj = { ...meterTemplate };
            delete tmpObj.account_type;
            delete tmpObj.account_description;
            await handleAddMeterTemplate({ ...tmpObj });
            this.setState({
                isUploading: false
            });
        }
    };

    updateMeterTemplate = async () => {
        const { meterTemplate } = this.state;
        const meterTemplate_id = this.props.match.params.id;
        const { handleUpdateMeterTemplate } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            let tmpObj = { ...meterTemplate };
            delete tmpObj.account_type;
            delete tmpObj.account_description;
            await handleUpdateMeterTemplate(meterTemplate_id, tmpObj);
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
        if (_.isEqual(this.state.initiaValues, this.state.meterTemplate)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        const { history } = this.props;
        await this.setState({
            meterTemplate: {
                client_id: "",
                region_id: "",
                site_id: "",
                building_id: "",
                account_id: "",
                meter_type: "",
                meter: "",
                description: ""
            },
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
        if (isLoading) return <Loader />;

        const { meterTemplate, showErrorBorder, errorParams } = this.state;
        const { selectedMeterTemplate } = this.props;
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <li className="active">Basic Details</li>
                        </ul>
                        <form autoComplete={"nope"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Select Client *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            disabled={this.state.userRole === "client_user"}
                                                            autoComplete="nope"
                                                            className={`${
                                                                showErrorBorder && errorParams.client_id ? "error-border " : ""
                                                            }custom-selecbox form-control`}
                                                            onChange={e =>
                                                                this.setState({
                                                                    meterTemplate: {
                                                                        ...meterTemplate,
                                                                        client_id: e.target.value,
                                                                        region_id: ""
                                                                    }
                                                                })
                                                            }
                                                            value={this.state?.meterTemplate?.client_id}
                                                        >
                                                            <option value="">Select</option>
                                                            {this.state?.clients?.map(item => (
                                                                <option value={item?.id}>{item?.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Select Region *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            autoComplete="nope"
                                                            className={`${
                                                                showErrorBorder && errorParams.region_id ? "error-border " : ""
                                                            }custom-selecbox form-control`}
                                                            onChange={e =>
                                                                this.setState({
                                                                    meterTemplate: {
                                                                        ...meterTemplate,
                                                                        region_id: e.target.value,
                                                                        site_id: ""
                                                                    }
                                                                })
                                                            }
                                                            value={this.state?.meterTemplate?.region_id}
                                                            disabled={!this.state?.regions?.length}
                                                        >
                                                            <option value="">Select</option>
                                                            {this.state?.regions?.map(item => (
                                                                <option value={item?.id}>{item?.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Select Site *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            autoComplete="nope"
                                                            className={`${
                                                                showErrorBorder && errorParams.site_id ? "error-border " : ""
                                                            }custom-selecbox form-control`}
                                                            onChange={e =>
                                                                this.setState({
                                                                    meterTemplate: {
                                                                        ...meterTemplate,
                                                                        site_id: e.target.value,
                                                                        building_id: ""
                                                                    }
                                                                })
                                                            }
                                                            value={this.state?.meterTemplate?.site_id}
                                                            disabled={!this.state?.sites?.length}
                                                        >
                                                            <option value="">Select</option>
                                                            {this.state?.sites?.map(item => (
                                                                <option value={item?.id}>{item?.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Select Building *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            autoComplete="nope"
                                                            className={`${
                                                                showErrorBorder && errorParams.building_id ? "error-border " : ""
                                                            }custom-selecbox form-control`}
                                                            onChange={e =>
                                                                this.setState({
                                                                    meterTemplate: {
                                                                        ...meterTemplate,
                                                                        building_id: e.target.value,
                                                                        account_id: ""
                                                                    }
                                                                })
                                                            }
                                                            value={this.state?.meterTemplate?.building_id}
                                                            disabled={!this.state?.buildings?.length}
                                                        >
                                                            <option value="">Select</option>
                                                            {this.state?.buildings?.map(item => (
                                                                <option value={item?.id}>
                                                                    {item.name} {item.description ? `(${item.description})` : ""}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Select Account Number *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            autoComplete="nope"
                                                            className={`${
                                                                showErrorBorder && errorParams.account_id ? "error-border " : ""
                                                            }custom-selecbox form-control`}
                                                            onChange={e => {
                                                                let tempAcc = this.state?.accounts.find(state => state.id === e.target.value);

                                                                this.setState({
                                                                    meterTemplate: {
                                                                        ...meterTemplate,
                                                                        account_id: e.target.value,
                                                                        meter_type: tempAcc?.account_type,
                                                                        account_type: tempAcc?.account_type,
                                                                        account_description: tempAcc?.description
                                                                    }
                                                                });
                                                            }}
                                                            value={this.state?.meterTemplate?.account_id}
                                                            disabled={!this.state?.accounts?.length}
                                                        >
                                                            <option value="">Select</option>
                                                            {this.state?.accounts?.map(item => (
                                                                <option value={item?.id}>
                                                                    {item?.number}
                                                                    {item?.account_type ? ` (${item?.account_type})` : null}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Account Type</h4>
                                                    <input
                                                        disabled={true}
                                                        autoComplete="nope"
                                                        type="text"
                                                        className={`custom-input form-control`}
                                                        onChange={e =>
                                                            this.setState({
                                                                meterTemplate: {
                                                                    ...meterTemplate,
                                                                    meter: e.target.value
                                                                }
                                                            })
                                                        }
                                                        value={this?.state?.meterTemplate?.account_type}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Account Description</h4>
                                                    <textarea
                                                        disabled={true}
                                                        autoComplete="nope"
                                                        type="text"
                                                        className={`custom-input form-control height-70px`}
                                                        value={this?.state?.meterTemplate?.account_description}
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Enter Meter Number *</h4>
                                                    <input
                                                        autoComplete="nope"
                                                        type="text"
                                                        className={`${
                                                            showErrorBorder && errorParams.meter ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        placeholder="Enter Meter Name"
                                                        onChange={e =>
                                                            this.setState({
                                                                meterTemplate: {
                                                                    ...meterTemplate,
                                                                    meter: e.target.value
                                                                }
                                                            })
                                                        }
                                                        value={this.state?.meterTemplate?.meter}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Select Meter Type</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            autoComplete="nope"
                                                            className={`${
                                                                showErrorBorder && errorParams.meter_type ? "error-border " : ""
                                                            }custom-selecbox form-control`}
                                                            // onChange={e =>
                                                            //     this.setState({
                                                            //         meterTemplate: {
                                                            //             ...meterTemplate,
                                                            //             meter_type: e.target.value
                                                            //         }
                                                            //     })
                                                            // }
                                                            disabled={true}
                                                            value={this.state?.meterTemplate?.meter_type}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="Electricity">Electricity</option>
                                                            <option value="Gas">Gas</option>
                                                            <option value="Water">Water</option>
                                                            <option value="Sewer">Sewer</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-8 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Description *</h4>
                                                    <textarea
                                                        autoComplete="nope"
                                                        placeholder="Notes"
                                                        className={`${
                                                            showErrorBorder && errorParams.description ? "error-border " : ""
                                                        }custom-input form-control height-70px`}
                                                        onChange={e =>
                                                            this.setState({
                                                                meterTemplate: {
                                                                    ...meterTemplate,
                                                                    description: e.target.value
                                                                }
                                                            })
                                                        }
                                                        value={this.state?.meterTemplate?.description}
                                                    />
                                                </div>
                                            </div>
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
                                            Update Meter Template
                                        </button>
                                    ) : (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.addTemplate()}>
                                            Add Meter Value
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { meterReducer } = state;
    return { meterReducer };
};

export default withRouter(connect(mapStateToProps, { ...meterActions })(Form));
