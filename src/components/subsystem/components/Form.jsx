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
import { addToBreadCrumpData, popBreadCrumpData, findPrevPathFromBreadCrump } from "../../../config/utils";
import NumberFormat from "react-number-format";

class From extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            clients: "",
            systems: "",
            trades: "",
            consultancy_users: "",
            trade: {
                name: "",
                trade_id: "",
                system_id: "",
                description: "",
                narrative_required: "no",
                benchmark: "no",
                service_life: ""
            },
            initiaValues: {},
            isNewBuildingType: true,
            selectedClient: {},
            regionList: [],
            siteList: [],
            buildingTypeList: [],
            selectedConsultancyUsers: [],
            selectedProject: props.selectedProject,
            selectedTrade: props.selectedProject,
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
        await this.props.getTradeSettingsDropdown(this.props.match.params.id);
        const {
            subsystemReducer: {
                getTradeSettingsDropdownResponse: { trades }
            }
        } = this.props;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const { selectedProject, selectedTrade } = this.state;
        let buildingTypeList = [];
        if (query.inp || selectedProject) {
            buildingTypeList = this.props.buildingTypeReducer.getAllBuildingTypesResponse.buildingTypes;
        }
        if (selectedTrade) {
            await this.props.getSubsystemByOne(selectedTrade);
            const {
                subsystemReducer: {
                    getSubsystemByIdResponse: { description, name, system, trade, success, narrative_required, benchmark,service_life }
                }
            } = this.props;
            if (success) {
                const systemParam = { trade_id: trade.id };
                await this.props.getSystemSettingsDropdown(systemParam, this.props.match.params.id);
                const {
                    subsystemReducer: {
                        getSystemSettingsDropdownResponse: { systems }
                    }
                } = this.props;
                await this.setState({
                    systems,
                    trade: {
                        name,
                        description,
                        trade_id: trade.id,
                        system_id: system.id,
                        narrative_required,
                        benchmark,
                        service_life
                    }
                });
            }
        }

        let tempUserOptions = [];
        if (consultancy_users && consultancy_users.length) {
            consultancy_users.map(item => tempUserOptions.push({ name: item.name, id: item.id }));
        }
        await this.setState({
            clients,
            // systems,
            trades,
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
        } else if (!trade.system_id) {
            this.setState({
                errorMessage: "Please select System",
                showErrorBorder: true
            });
            return false;
        } else if (!trade.trade_id) {
            this.setState({
                errorMessage: "Please select trade",
                showErrorBorder: true
            });
            return false;
        }
        return true;
    };

    addBuildingType = async () => {
        const { trade } = this.state;
        const { addNewData } = this.props;
        if (this.validate()) {
            await addNewData(trade);
        }
    };

    updateBuildingType = async () => {
        const { trade } = this.state;
        const { updateTradeData } = this.props;
        if (this.validate()) {
            await updateTradeData(trade);
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
                description: "",
                narrative_required: "no"
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
    handleTradeSelect = async () => {
        const { trade } = this.state;
        const systemParam = { trade_id: trade.trade_id };
        await this.props.getSystemSettingsDropdown(systemParam, this.props.match.params.id);
        const {
            subsystemReducer: {
                getSystemSettingsDropdownResponse: { systems }
            }
        } = this.props;
        await this.setState({
            systems: trade.trade_id ? systems : {},
            trade: {
                ...trade,
                system_id: ""
            }
        });
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { systems, trades, trade, selectedProject, showErrorBorder, type } = this.state;

        return (
            <React.Fragment>
                <div
                    className="modal modal-region"
                    style={{ display: "block" }}
                    id="modalId"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    {selectedProject ? "Edit " : "Add New "} {type}
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onCancel()}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body region-otr build-type-mod">
                                <form autoComplete={"nope"}>
                                    <div className="form-group">
                                        <div className="formInp">
                                            <label>Name *</label>
                                            <input
                                                autoComplete={"nope"}
                                                type="text"
                                                className={`${showErrorBorder && !trade.name.trim().length ? "error-border " : ""}form-control`}
                                                value={trade.name}
                                                onChange={e =>
                                                    this.setState({
                                                        trade: {
                                                            ...trade,
                                                            name: e.target.value
                                                        }
                                                    })
                                                }
                                                placeholder="Name"
                                            />
                                        </div>
                                        <div className="formInp">
                                            <label>Trade *</label>
                                            <div className="selectOtr">
                                                <select
                                                    autoComplete={"nope"}
                                                    onChange={async e => {
                                                        await this.setState({
                                                            trade: {
                                                                ...trade,
                                                                trade_id: e.target.value
                                                            }
                                                        });
                                                        this.handleTradeSelect();
                                                    }}
                                                    value={trade.trade_id}
                                                    className={`${showErrorBorder && !trade.trade_id ? "error-border " : ""}form-control`}
                                                >
                                                    <option value="">Select</option>
                                                    {trades && trades.length
                                                        ? trades.map((item, i) => (
                                                              <option value={item.id} key={i}>
                                                                  {item.name}
                                                              </option>
                                                          ))
                                                        : null}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="formInp">
                                            <label>System *</label>
                                            <div className="selectOtr">
                                                <select
                                                    autoComplete={"nope"}
                                                    onChange={async e => {
                                                        await this.setState({
                                                            trade: {
                                                                ...trade,
                                                                system_id: e.target.value
                                                            }
                                                        });
                                                    }}
                                                    value={trade.system_id}
                                                    className={`${showErrorBorder && !trade.system_id ? "error-border " : ""}form-control`}
                                                >
                                                    <option value="">Select</option>
                                                    {systems && systems.length
                                                        ? systems.map((item, i) => (
                                                              <option value={item.id} key={i}>
                                                                  {item.name}
                                                              </option>
                                                          ))
                                                        : null}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="formInp">
                                            <label>Description</label>
                                            <textarea
                                                autoComplete={"nope"}
                                                placeholder="Description"
                                                className="form-control"
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
                                        <div className="formInp">
                                            {/* <div className="codeOtr"> */}
                                            <label>Service Life</label>
                                            <NumberFormat
                                                autoComplete={"nope"}
                                                className=" custom-input form-control"
                                                placeholder="Service Life"
                                                value={parseInt(trade.service_life) || ""}
                                                format="####"
                                                displayType={"input"}
                                                onValueChange={values => {
                                                    const { value } = values;
                                                    this.setState({
                                                        trade: {
                                                            ...trade,
                                                            service_life: value
                                                        }
                                                    });
                                                }}
                                            />
                                        </div>
                                        {/* </div> */}
                                        <div className="formInp d-flex">
                                            <label class="container-checkbox cursor-hand">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        trade.narrative_required === "no" ? false : trade.narrative_required === "yes" ? true : false
                                                    }
                                                    onChange={e => {
                                                        this.setState({
                                                            trade: {
                                                                ...trade,
                                                                narrative_required:
                                                                    trade.narrative_required === "no"
                                                                        ? "yes"
                                                                        : trade.narrative_required === "yes"
                                                                        ? "no"
                                                                        : "yes"
                                                            }
                                                        });
                                                    }}
                                                />
                                                <span class="checkmark"></span>Narrative Required
                                            </label>
                                            <label class="container-checkbox cursor-hand ml-5">
                                                <input
                                                    type="checkbox"
                                                    checked={trade.benchmark === "no" ? false : trade.benchmark === "yes" ? true : false}
                                                    onChange={e => {
                                                        this.setState({
                                                            trade: {
                                                                ...trade,
                                                                benchmark: trade.benchmark === "no" ? "yes" : trade.benchmark === "yes" ? "no" : "yes"
                                                            }
                                                        });
                                                    }}
                                                />
                                                <span class="checkmark"></span>Benchmark
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-12 p-0 text-right btnOtr">
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
                                </form>
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
    const { buildingTypeReducer, buildingReducer, subsystemReducer } = state;
    return { buildingTypeReducer, buildingReducer, subsystemReducer };
};

export default withRouter(connect(mapStateToProps, { ...buildingTypeActions, ...buildingActions })(From));
