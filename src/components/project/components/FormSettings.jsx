import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";

import buildingTypeActions from "../actions";
import buildingActions from "../../building/actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import {
    addToBreadCrumpData,
    popBreadCrumpData,
    findPrevPathFromBreadCrump
} from "../../../config/utils";

class From extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            clients: "",
            consultancy_users: "",
            trade: {
                name: "",
                description: ""
            },
            initiaValues: {},
            isNewBuildingType: true,
            selectedClient: {},
            regionList: [],
            siteList: [],
            buildingTypeList: [],
            selectedConsultancyUsers: [],
            selectedProject: props.selectedProject,
            selectedTrade: props.selectedTrade,
            type: props.type,
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false
        };
    }

    componentDidMount = async () => {
        const {
            buildingTypeReducer: {
                getAllConsultancyUsersResponse: { users: consultancy_users },
                getAllClientsResponse: { clients }
            }
        } = this.props;

        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const { selectedProject, selectedTrade } = this.state;
        let buildingTypeList = [];
        if (query.inp || selectedProject) {
            buildingTypeList = this.props.buildingTypeReducer.getAllBuildingTypesResponse
                .buildingTypes;
        }
        if (selectedTrade) {
            const { type } = this.state;
            if (type === "trade") {
                await this.props.getTradeByOne(type, selectedTrade);
                const {
                    projectReducer: {
                        getTradeByIdResponse: { description, name, success }
                    }
                } = this.props;
                if (success) {
                    await this.setState({
                        trade: {
                            name,
                            description
                        }
                    });
                }
            } else if(type==="category"){
                await this.props.getTradeByOne(type, selectedTrade);
                const {
                    projectReducer: {
                        getCategoryByIdResponse: { description, name, success }
                    }
                } = this.props;
                if (success) {
                    await this.setState({
                        trade: {
                            name,
                            description
                        }
                    });
                }
            } else if(type==="system"){
                await this.props.getTradeByOne(type, selectedTrade);
                const {
                    projectReducer: {
                        getSystemByIdResponse: { description, name, success }
                    }
                } = this.props;
                if (success) {
                    await this.setState({
                        trade: {
                            name,
                            description
                        }
                    });
                }
            }else if(type==="department"){
                await this.props.getTradeByOne(type, selectedTrade);
                const {
                    projectReducer: {
                        getDepartmentByIdResponse: { description, name, success }
                    }
                } = this.props;
                if (success) {
                    await this.setState({
                        trade: {
                            name,
                            description
                        }
                    });
                }
            }

        }

        let tempUserOptions = [];
        if (consultancy_users && consultancy_users.length) {
            consultancy_users.map(item => tempUserOptions.push({ name: item.name, id: item.id }));
        }
        await this.setState({
            clients,
            consultancy_users: tempUserOptions,
            buildingTypeList,
            initiaValues: this.state.buildingType,
            isNewBuildingType: query.inp,
            isLoading: false
        });
    };

    validate = () => {
        const { trade } = this.state;
        this.setState({
            showErrorBorder: false
        });
        if (!trade.name && !trade.name.trim().length) {
            this.setState({
                errorMessage: "Please enter building type name",
                showErrorBorder: true
            });
            return false;
        }
        return true;
    };

    addBuildingType = async () => {
        const { trade, type } = this.state;
        const { addNewData } = this.props;
        if (this.validate()) {
            await addNewData(type, trade);
        }
    };

    updateBuildingType = async () => {
        const { trade, type } = this.state;
        const { updateTradeData } = this.props;
        if (this.validate()) {
            await updateTradeData(type, trade);
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
                        message={
                            "This action cannot be reverted, are you sure that you need to cancel?"
                        }
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.clearForm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    cancelForm = () => {
        if (_.isEqual(this.state.initiaValues, this.state.buildingType)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        this.setState({
            trade: {
                name: "",
                description: ""
            }
        });
        this.props.onCancel();
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

        const { clients, trade, selectedProject, showErrorBorder, type } = this.state;

        return (
            <React.Fragment>
                <div
                    class="modal modal-region"
                    style={{ display: "block" }}
                    id="modalId"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">
                                    {selectedProject ? "Edit " : "Add New "} {type}
                                </h5>
                                <button
                                    type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => this.props.onCancel()}
                                >
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div class="modal-body region-otr build-type-mod">
                                <div class="form-group">
                                    <div class="formInp">
                                        <label>Name *</label>
                                        <input
                                            type="text"
                                            className={`${
                                                showErrorBorder && !trade.name.trim().length
                                                    ? "error-border "
                                                    : ""
                                            }form-control`}
                                            value={trade.name}
                                            onChange={e =>
                                                this.setState({
                                                    trade: {
                                                        ...trade,
                                                        name: e.target.value
                                                    }
                                                })
                                            }
                                            placeholder="Enter Name"
                                        />
                                    </div>
                                    
                                    <div class="formInp">
                                        <label>Description</label>
                                        <textarea
                                            placeholder="Description"
                                            class="form-control"
                                            value={trade.description}
                                            onChange={e =>
                                                this.setState({
                                                    trade: {
                                                        ...trade,
                                                        description: e.target.value
                                                    }
                                                })
                                            }
                                        ></textarea>
                                    </div>
                                </div>
                                <div class="col-md-12 p-0 text-right btnOtr">
                                    {selectedProject ? (
                                        <button
                                            type="button"
                                            onClick={() => this.updateBuildingType()}
                                            className="btn btn-primary btnRgion col-md-2"
                                        >
                                            Update
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => this.addBuildingType()}
                                            className="btn btn-primary btnRgion col-md-2"
                                        >
                                            Add
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { buildingTypeReducer, buildingReducer, projectReducer } = state;
    return { buildingTypeReducer, buildingReducer, projectReducer };
};

export default withRouter(
    connect(mapStateToProps, { ...buildingTypeActions, ...buildingActions })(From)
);
