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
            tradesDropDown: "",
            system: {
                name: "",
                master_trade_id: "",
                description: ""
            },
            errorParams: {
                name: "",
                master_trade_id: ""
            },
            initiaValues: {},
            selectedSystem: props.match.params.id,
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false
        };
    }

    componentDidMount = async () => {
        const { selectedSystem } = this.props;
        await this.props.getTradeDropdown();
        const {
            masterSystemReducer: {
                getTradeDropdownResponse: { list }
            }
        } = this.props;
        if (selectedSystem) {
            await this.props.getDataById(selectedSystem);
            const {
                masterSystemReducer: {
                    getSystemByIdResponse: { success, name, trade, description }
                }
            } = this.props;

            if (success) {
                await this.setState({
                    system: {
                        name,
                        master_trade_id: trade.id,
                        description
                    }
                });
            }
        }
        await this.setState({
            initiaValues: this.state.system,
            tradesDropDown: list,
            isLoading: false
        });
    };

    validate = () => {
        const { system } = this.state;
        let errorParams = {
            name: false,
            master_trade_id: false
        };
        let showErrorBorder = false;

        if (!system.name || !system.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!system.master_trade_id || !system.master_trade_id.trim().length) {
            errorParams.master_trade_id = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    addSystem = async () => {
        const { system } = this.state;
        const { handleAddSystem } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleAddSystem(system);
            this.setState({
                isUploading: false
            });
        }
    };

    updateSystem = async () => {
        const { system } = this.state;
        const system_id = this.props.match.params.id;
        const { handleUpdateSystem } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleUpdateSystem(system_id, system);
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
        if (_.isEqual(this.state.initiaValues, this.state.system)) {
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
            system: {
                name: "",
                comments: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: []
        });
        history.push(findPrevPathFromBreadCrump() || "/system");
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

        const { system, showErrorBorder, errorParams, tradesDropDown } = this.state;
        const { selectedSystem } = this.props;

        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">{selectedSystem ? "Edit System" : "Add System"}</li>
                        </ul>
                        <form autoComplete={"nope"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>System Name *</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`${
                                                            showErrorBorder && errorParams.name ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={system.name}
                                                        onChange={e =>
                                                            this.setState({
                                                                system: {
                                                                    ...system,
                                                                    name: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Enter System Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Trade *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            autoComplete={"nope"}
                                                            className={`${
                                                                showErrorBorder && errorParams.master_trade_id ? "error-border " : ""
                                                            }custom-selecbox form-control`}
                                                            onChange={async e => {
                                                                await this.setState({
                                                                    system: {
                                                                        ...system,
                                                                        master_trade_id: e.target.value
                                                                    }
                                                                });
                                                            }}
                                                            value={system.master_trade_id}
                                                        >
                                                            <option value="">Select</option>
                                                            {tradesDropDown && tradesDropDown.length
                                                                ? tradesDropDown.map((item, i) => (
                                                                      <option value={item.id} key={i}>
                                                                          {item.name}
                                                                      </option>
                                                                  ))
                                                                : null}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Description</h4>
                                                    <textarea
                                                        autoComplete={"nope"}
                                                        placeholder="Comments"
                                                        className="custom-input form-control"
                                                        value={system.description}
                                                        onChange={e =>
                                                            this.setState({
                                                                system: {
                                                                    ...system,
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
                                    {selectedSystem ? (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.updateSystem()}>
                                            Update System
                                        </button>
                                    ) : (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.addSystem()}>
                                            Add System
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
    const { projectReducer, buildingReducer, masterSystemReducer } = state;
    return { projectReducer, buildingReducer, masterSystemReducer };
};

export default withRouter(connect(mapStateToProps, { ...projectActions, ...buildingActions })(From));
