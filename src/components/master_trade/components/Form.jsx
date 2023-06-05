import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";

import projectActions from "../actions";
import buildingActions from "../../building/actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { popBreadCrumpData, findPrevPathFromBreadCrump } from "../../../config/utils";
import exclmIcon from "../../../assets/img/recom-icon.svg";

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
            trade: {
                name: "",
                display_name: "",
                description: ""
            },
            errorParams: {
                name: "",
                display_name: ""
            },
            initiaValues: {},
            isNewProject: true,
            selectedClient: {},
            regionList: [],
            siteList: [],
            projectList: [],
            selectedConsultancyUsers: [],
            selectedClientUsers: [],

            selectedTrade: props.match.params.id,
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false,
            selectedBuilding: qs.parse(this.props.location.search.bid) || null,
            initialConsultancyUsers: [],
            initialClientUsers: []
        };
    }

    componentDidMount = async () => {
        const { selectedTrade } = this.props;
        if (selectedTrade) {
            await this.props.getDataById(selectedTrade);
            const {
                masterTradeReducer: {
                    getTradeByIdResponse: { success, name, display_name, description }
                }
            } = this.props;

            if (success) {
                await this.setState({
                    trade: {
                        name,
                        display_name,
                        description
                    }
                });
            }
        }

        await this.setState({
            initiaValues: this.state.trade,
            isLoading: false
        });
    };

    validate = () => {
        const { trade } = this.state;
        let errorParams = {
            name: false,
            display_name: false
        };
        let showErrorBorder = false;

        if (!trade.name || !trade.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!trade.display_name || !trade.display_name.trim().length) {
            errorParams.display_name = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    addTrade = async () => {
        const { trade } = this.state;
        const { handleAddTrade } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleAddTrade(trade);
            this.setState({
                isUploading: false
            });
        }
    };

    updateTrade = async () => {
        const { trade } = this.state;
        const trade_id = this.props.match.params.id;
        const { handleUpdateTrade } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleUpdateTrade(trade_id, trade);
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
        if (_.isEqual(this.state.initiaValues, this.state.trade)) {
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
            trade: {
                name: "",
                comments: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: []
        });
        history.push(findPrevPathFromBreadCrump() || "/trade");
        popBreadCrumpData();
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };

    handleConsultancySelect = async e => {
        const { trade } = this.state;
        if (trade.client_id && trade.consultancy_id) {
            await this.props.getAllBuildingsDropdown({ client_id: trade.client_id, consultancy_id: trade.consultancy_id });
        }

        await this.props.getAllClientss({ consultancy_id: trade.consultancy_id });
        await this.props.getAllConsultancyUsers({ consultancy_id: trade.consultancy_id });
        const {
            masterTradeReducer: {
                getAllClientsResponse: { clients },
                getAllConsultancyUsersResponse: { users: consultancy_users }
            }
        } = this.props;
        await this.setState({
            clients,
            consultancy_users: consultancy_users,
            trade: {
                ...trade,
                client_id: "",
                client_user_ids: []
            }
        });
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { trade, showErrorBorder, errorParams } = this.state;
        const { selectedTrade } = this.props;

        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">{selectedTrade ? "Edit Trade" : "Add Trade"}</li>
                        </ul>
                        <form autoComplete={"nope"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Trade Name *</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`${
                                                            showErrorBorder && errorParams.name ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={trade.name}
                                                        onChange={e =>
                                                            this.setState({
                                                                trade: {
                                                                    ...trade,
                                                                    name: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Enter Trade Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Display Name *</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`${
                                                            showErrorBorder && errorParams.display_name ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={trade.display_name}
                                                        onChange={e =>
                                                            this.setState({
                                                                trade: {
                                                                    ...trade,
                                                                    display_name: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Enter Trade Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Description</h4>
                                                    <textarea
                                                        autoComplete={"nope"}
                                                        placeholder="Comments"
                                                        className="custom-input form-control"
                                                        value={trade.description}
                                                        onChange={e =>
                                                            this.setState({
                                                                trade: {
                                                                    ...trade,
                                                                    description: e.target.value
                                                                }
                                                            })
                                                        }
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
                                    {selectedTrade ? (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.updateTrade()}>
                                            Update Trade
                                        </button>
                                    ) : (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.addTrade()}>
                                            Add Trade
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
    const { projectReducer, buildingReducer, masterTradeReducer } = state;
    return { projectReducer, buildingReducer, masterTradeReducer };
};

export default withRouter(connect(mapStateToProps, { ...projectActions, ...buildingActions })(From));
