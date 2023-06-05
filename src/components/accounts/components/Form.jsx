import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";

import projectActions from "../actions";
import meterActions from "../../meterManagement/actions";
import buildingActions from "../../building/actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { popBreadCrumpData } from "../../../config/utils";
import NumberFormat from "react-number-format";

class From extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            clients: "",
            consultancies: "",
            consultancy_users: [],
            client_users: [],
            buildings: [],
            errorParams: {
                name: false,
                client_id: false,
                region_id: false,
                site_id: false,
                building_id: false,
                // building_sf: false,
                account_type: false,
                status: false,
                rate: false,
                number: false
            },
            initiaValues: {},
            isNewProject: true,
            selectedClient: {},
            regionList: [],
            siteList: [],
            statusList: ["Complete", "Incomplete", "Need Data"],
            accountTypeList: ["Electricity", "Gas", "Water", "Sewer"],
            rateList: ["LPL ", "LPTL (TOU)", "LPLE", "LPL Primary", "HLTU-SE", "LPL"],
            projectList: [],
            selectedConsultancyUsers: [],
            selectedClientUsers: [],
            selectedAccount: props.match.params.id,
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false,
            initialConsultancyUsers: [],
            initialClientUsers: [],
            account: {
                client_id: "",
                region_id: "",
                site_id: "",
                building_id: "",
                building_sf: "",
                account_type: "",
                status: "",
                rate: "",
                number: "",
                description: "",
                company: ""
            },
            userRole: localStorage.getItem("role")
        };
    }

    componentDidMount = async () => {
        this.handleClientDetails();
        const { selectedAccount } = this.props;
        if (selectedAccount) {
            await this.props.getAccountById(selectedAccount);
            const {
                accountReducer: {
                    getAccountByIdResponse: {
                        success,
                        client,
                        region,
                        site,
                        building,
                        area,
                        account_type,
                        status,
                        rate,
                        number,
                        description,
                        company
                    }
                }
            } = this.props;

            if (success) {
                this.setState({
                    account: {
                        client_id: client.id,
                        region_id: region.id,
                        site_id: site.id,
                        building_id: building.id,
                        building_sf: area ?? "",
                        account_type: account_type ?? "",
                        status: status ?? "",
                        rate: rate ?? "",
                        number: number ?? "",
                        description: description ?? "",
                        company: company ?? ""
                    }
                });
            }
        }

        this.setState({
            initiaValues: this.state.account,
            isLoading: false
        });
    };

    componentDidUpdate = (prevProps, prevState) => {
        let { client_id, region_id, site_id } = this.state?.account;

        if (client_id !== prevState?.account?.client_id) {
            client_id && this.handleRegionDetails(client_id);
        }
        if (region_id !== prevState?.account?.region_id) {
            client_id && region_id && this.handleSiteDetails(client_id, { region_id });
        }
        if (site_id !== prevState?.account?.site_id) {
            client_id && site_id && this.handleBuildingDetails(client_id, { site_id });
        }
    };

    handleClientDetails = async () => {
        const { getMeterClientList } = this.props;
        const clientID = localStorage.getItem("clientId");

        if (this.state.userRole === "client_user") {
            await getMeterClientList();
            let { clients } = this.props.meterReducer?.getClientListResponse;
            this.setState({
                clients: clients.filter(item => item.id === clientID),
                account: {
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
            regionList: regions
        });
    };

    handleSiteDetails = async (id, params) => {
        const { getMeterSiteList } = this.props;
        await getMeterSiteList(id, params);
        let { sites } = this.props.meterReducer?.getSiteListResponse;
        this.setState({
            siteList: sites ? sites : []
        });
    };

    handleBuildingDetails = async (id, params) => {
        const { getMeterBuildingList } = this.props;
        await getMeterBuildingList(id, params);
        let { buildings } = this.props.meterReducer?.getBuildingListResponse;
        this.setState({
            buildings: buildings
        });
    };

    validate = () => {
        const { account } = this.state;
        let errorParams = {
            name: false,
            client_id: false,
            region_id: false,
            site_id: false,
            building_id: false,
            building_sf: false,
            account_type: false,
            status: false,
            rate: false,
            number: false,
            description: false,
            company: false
        };
        let showErrorBorder = false;

        if (!account.client_id || !account.client_id.trim().length) {
            errorParams.client_id = true;
            showErrorBorder = true;
        }
        if (!account.region_id || !account.region_id.trim().length) {
            errorParams.region_id = true;
            showErrorBorder = true;
        }
        if (!account.site_id || !account.site_id.trim().length) {
            errorParams.site_id = true;
            showErrorBorder = true;
        }
        if (!account.building_id || !account.building_id.trim().length) {
            errorParams.building_id = true;
            showErrorBorder = true;
        }
        // if (!account.building_sf || !account.building_sf.trim().length) {
        //     errorParams.building_sf = true;
        //     showErrorBorder = true;
        // }
        if (!account.account_type || !account.account_type.trim().length) {
            errorParams.account_type = true;
            showErrorBorder = true;
        }
        if (!account.number || !account.number.trim().length) {
            errorParams.number = true;
            showErrorBorder = true;
        }
        if (!account.rate || !account.rate.trim().length) {
            errorParams.rate = true;
            showErrorBorder = true;
        }
        if (!account.status || !account.status.trim().length) {
            errorParams.status = true;
            showErrorBorder = true;
        }
        if (!account.description || !account.description.trim().length) {
            errorParams.description = true;
            showErrorBorder = true;
        }
        if (!account.company || !account.company.trim().length) {
            errorParams.company = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    addAccount = async () => {
        const { account } = this.state;
        const { handleAddAccount } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleAddAccount(account);
            this.setState({
                isUploading: false
            });
        }
    };

    updateAccount = async () => {
        const { account } = this.state;
        const account_id = this.props.match.params.id;
        const { handleUpdateAccount } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleUpdateAccount(account_id, account);
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
        if (_.isEqual(this.state.initiaValues, this.state.account)) {
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
            account: {
                id: "",
                name: "",
                client_id: "",
                region_id: "",
                site_id: "",
                building_id: "",
                // building_sf: "",
                account_type: "",
                status: "",
                rate: "",
                number: "",
                description: "",
                company: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: []
        });
        history.goBack();
        // history.push(findPrevPathFromBreadCrump() || "/account");
        popBreadCrumpData();
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };

    handleConsultancySelect = async e => {
        const { account } = this.state;
        if (account.client_id && account.consultancy_id) {
            await this.props.getAllBuildingsDropdown({ client_id: account.client_id, consultancy_id: account.consultancy_id });
        }

        await this.props.getAllClientss({ consultancy_id: account.consultancy_id });
        await this.props.getAllConsultancyUsers({ consultancy_id: account.consultancy_id });
        const {
            accountReducer: {
                getAllClientsResponse: { clients },
                getAllConsultancyUsersResponse: { users: consultancy_users }
            }
        } = this.props;
        await this.setState({
            clients,
            consultancy_users: consultancy_users,
            account: {
                ...account,
                client_id: "",
                client_user_ids: []
            }
        });
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { account, clients, buildings, regionList, siteList, statusList, accountTypeList, rateList, showErrorBorder, errorParams } = this.state;
        const { selectedAccount } = this.props;

        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <li className="active">{selectedAccount ? "Edit Account" : "Add Account"}</li>
                        </ul>
                        <form autoComplete={"nope"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-3 basic-box">
                                                <h4>Client *</h4>
                                                <div className="custom-selecbox">
                                                    <select
                                                        disabled={this.state.userRole === "client_user"}
                                                        onChange={async e => {
                                                            await this.setState({
                                                                account: {
                                                                    ...account,
                                                                    client_id: e.target.value
                                                                }
                                                            });
                                                        }}
                                                        value={account.client_id}
                                                        className={`${showErrorBorder && errorParams.client_id ? "error-border " : ""}${
                                                            // query?.c_id
                                                            false ? "custom-selecbox cursor-notallowed" : "custom-selecbox"
                                                        }`}
                                                    >
                                                        <option value="">Select</option>
                                                        {clients && clients.length
                                                            ? clients.map((item, i) => (
                                                                  <option value={item.id} key={i}>
                                                                      {item.name}
                                                                  </option>
                                                              ))
                                                            : null}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Region *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            // disabled={query?.r_id ? true : false}
                                                            className={`${showErrorBorder && errorParams.region_id ? "error-border " : ""}${
                                                                // query?.r_id
                                                                false ? "custom-selecbox cursor-notallowed" : "custom-selecbox"
                                                            }  `}
                                                            value={account.region_id}
                                                            onChange={async e => {
                                                                await this.setState({
                                                                    account: {
                                                                        ...account,
                                                                        region_id: e.target.value
                                                                    }
                                                                });
                                                            }}
                                                        >
                                                            <option value="">Select</option>
                                                            {regionList && regionList.length
                                                                ? regionList.map((item, i) => (
                                                                      <option value={item.id} key={i}>
                                                                          {item.name}
                                                                      </option>
                                                                  ))
                                                                : null}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Site *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            // disabled={query?.s_id ? true : false}
                                                            className={`${showErrorBorder && errorParams.site_id ? "error-border " : ""}${
                                                                // query?.s_id
                                                                false ? "custom-selecbox cursor-notallowed" : "custom-selecbox"
                                                            }  `}
                                                            value={account.site_id}
                                                            onChange={e =>
                                                                this.setState({
                                                                    account: {
                                                                        ...account,
                                                                        site_id: e.target.value
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {siteList && siteList.length
                                                                ? siteList.map((item, i) => (
                                                                      <option value={item.id} key={i}>
                                                                          {item.name}
                                                                      </option>
                                                                  ))
                                                                : null}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Building *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            onChange={async e => {
                                                                await this.setState({
                                                                    account: {
                                                                        ...account,
                                                                        building_sf: buildings.find(state => state.id === e.target.value).area,
                                                                        building_id: e.target.value
                                                                    }
                                                                });
                                                            }}
                                                            value={account.building_id}
                                                            className={`${
                                                                showErrorBorder && errorParams.building_id ? "error-border " : ""
                                                            }custom-selectbox  `}
                                                        >
                                                            <option value="">Select</option>
                                                            {buildings && buildings.length
                                                                ? buildings.map((item, i) => (
                                                                      <option value={item.id} key={i}>
                                                                          {item.name} {item.description ? `(${item.description})` : ""}
                                                                      </option>
                                                                  ))
                                                                : null}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Company *</h4>
                                                    <input
                                                        type="text"
                                                        value={account.company}
                                                        className={`${
                                                            showErrorBorder && errorParams.company ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        onChange={e =>
                                                            this.setState({
                                                                account: {
                                                                    ...account,
                                                                    company: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Company Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Account Number *</h4>
                                                    <input
                                                        type="text"
                                                        value={account.number}
                                                        className={`${
                                                            showErrorBorder && errorParams.number ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        onChange={e =>
                                                            this.setState({
                                                                account: {
                                                                    ...account,
                                                                    number: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Number"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Account Type *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            // disabled={query?.s_id ? true : false}
                                                            className={`${showErrorBorder && errorParams.account_type ? "error-border " : ""}${
                                                                // query?.s_id
                                                                false ? "custom-selecbox cursor-notallowed" : "custom-selecbox"
                                                            }  `}
                                                            value={account.account_type}
                                                            onChange={e =>
                                                                this.setState({
                                                                    account: {
                                                                        ...account,
                                                                        account_type: e.target.value
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {accountTypeList && accountTypeList.length
                                                                ? accountTypeList.map((item, i) => (
                                                                      <option value={item} key={i}>
                                                                          {item}
                                                                      </option>
                                                                  ))
                                                                : null}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Status</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            // disabled={query?.s_id ? true : false}
                                                            className={`${showErrorBorder && errorParams.status ? "error-border " : ""}${
                                                                // query?.s_id
                                                                false ? "custom-selecbox cursor-notallowed" : "custom-selecbox"
                                                            }  `}
                                                            value={account.status}
                                                            onChange={e =>
                                                                this.setState({
                                                                    account: {
                                                                        ...account,
                                                                        status: e.target.value
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {statusList && statusList.length
                                                                ? statusList.map((item, i) => (
                                                                      <option value={item} key={i}>
                                                                          {item}
                                                                      </option>
                                                                  ))
                                                                : null}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Rate *</h4>
                                                    <input
                                                        type="text"
                                                        value={account.rate}
                                                        className={`${
                                                            showErrorBorder && errorParams.rate ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        onChange={e =>
                                                            this.setState({
                                                                account: {
                                                                    ...account,
                                                                    rate: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Rate"
                                                    />
                                                    {/* <div className="custom-selecbox">
                                                        <select
                                                            // disabled={query?.s_id ? true : false}
                                                            className={`${showErrorBorder &&
                                                                !account.rate.trim().length
                                                                ? "error-border "
                                                                : ""
                                                                }${
                                                                // query?.s_id 
                                                                false ? "custom-selecbox cursor-notallowed" : "custom-selecbox"
                                                                }  `}
                                                            value={account.rate}
                                                            onChange={e =>
                                                                this.setState({
                                                                    account: {
                                                                        ...account,
                                                                        rate: e.target.value
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {rateList && rateList.length
                                                                ? rateList.map((item, i) => (
                                                                    <option value={item} key={i}>
                                                                        {item}
                                                                    </option>
                                                                ))
                                                                : null}
                                                        </select>
                                                    </div> */}
                                                </div>
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Description *</h4>
                                                    <textarea
                                                        autoComplete="nope"
                                                        placeholder="Notes"
                                                        className={`${
                                                            showErrorBorder && errorParams.description ? "error-border " : ""
                                                        }custom-input form-control height-70px`}
                                                        value={account?.description}
                                                        onChange={e =>
                                                            this.setState({
                                                                account: {
                                                                    ...account,
                                                                    description: e.target.value
                                                                }
                                                            })
                                                        }
                                                    />
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
                                        {selectedAccount ? (
                                            <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.updateAccount()}>
                                                Update Account
                                            </button>
                                        ) : (
                                            <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.addAccount()}>
                                                Add Account
                                            </button>
                                        )}
                                    </div>
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
    const { projectReducer, buildingReducer, accountReducer, meterReducer } = state;
    return { projectReducer, buildingReducer, accountReducer, meterReducer };
};

export default withRouter(connect(mapStateToProps, { ...projectActions, ...buildingActions, ...meterActions })(From));
