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
import NumberFormat from "react-number-format";

class From extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            tradesDropDown: "",
            systemsDropDown: "",
            subSystem: {
                name: "",
                master_trade_id: "",
                master_system_id: "",
                description: "",
                service_life:""
            },
            errorParams: {
                name: "",
                master_trade_id: "",
                master_system_id: ""
            },
            initiaValues: {},
            selectedSubSystem: props.match.params.id,
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false
        };
    }

    componentDidMount = async () => {
        const { selectedSubSystem } = this.props;
        await this.props.getTradeDropdown();
        const {
            masterSubSystemReducer: {
                getTradeDropdownResponse: { list }
            }
        } = this.props;
        if (selectedSubSystem) {
            await this.props.getDataById(selectedSubSystem);
            const {
                masterSubSystemReducer: {
                    getSubSystemByIdResponse: { success, name, trade, system, description, service_life }
                }
            } = this.props;
            if (success) {
                await this.getSystemByTrade(trade.id);
                await this.setState({
                    subSystem: {
                        name,
                        master_trade_id: trade.id,
                        master_system_id: system.id,
                        description,
                        service_life
                    }
                });
            }
        }
        await this.setState({
            initiaValues: this.state.subSystem,
            tradesDropDown: list,
            isLoading: false
        });
    };

    getSystemByTrade = async tradeId => {
        const { subSystem } = this.state;
        await this.props.getSystemByTradeDropdown(tradeId);
        const {
            masterSubSystemReducer: {
                getSystemByTradeDropdownResponse: { list }
            }
        } = this.props;
        await this.setState({
            systemsDropDown: list,
            subSystem: {
                ...subSystem,
                master_system_id: ""
            }
        });
    };

    validate = () => {
        const { subSystem } = this.state;
        let errorParams = {
            name: false,
            master_trade_id: false,
            master_system_id: false
        };
        let showErrorBorder = false;

        if (!subSystem.name || !subSystem.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!subSystem.master_trade_id || !subSystem.master_trade_id.trim().length) {
            errorParams.master_trade_id = true;
            showErrorBorder = true;
        }
        if (!subSystem.master_system_id || !subSystem.master_system_id.trim().length) {
            errorParams.master_system_id = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    addSubSystem = async () => {
        const { subSystem } = this.state;
        const { handleAddSubSystem } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleAddSubSystem(subSystem);
            this.setState({
                isUploading: false
            });
        }
    };

    updateSubSystem = async () => {
        const { subSystem } = this.state;
        const subSystem_id = this.props.match.params.id;
        const { handleUpdateSubSystem } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleUpdateSubSystem(subSystem_id, subSystem);
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
        if (_.isEqual(this.state.initiaValues, this.state.subSystem)) {
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
            subSystem: {
                name: "",
                comments: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: []
        });
        history.push(findPrevPathFromBreadCrump() || "/subSystem");
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

        const { subSystem, showErrorBorder, errorParams, tradesDropDown, systemsDropDown } = this.state;
        const { selectedSubSystem } = this.props;

        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">{selectedSubSystem ? "Edit SubSystem" : "Add SubSystem"}</li>
                        </ul>
                        <form autoComplete={"nope"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Sub System Name *</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`${
                                                            showErrorBorder && errorParams.name ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={subSystem.name}
                                                        onChange={e =>
                                                            this.setState({
                                                                subSystem: {
                                                                    ...subSystem,
                                                                    name: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Enter Sub System Name"
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
                                                                    subSystem: {
                                                                        ...subSystem,
                                                                        master_trade_id: e.target.value
                                                                    }
                                                                });
                                                                await this.getSystemByTrade(this.state.subSystem.master_trade_id);
                                                            }}
                                                            value={subSystem.master_trade_id}
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
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>System *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            autoComplete={"nope"}
                                                            className={`${
                                                                showErrorBorder && errorParams.master_system_id ? "error-border " : ""
                                                            }custom-selecbox form-control`}
                                                            onChange={async e => {
                                                                await this.setState({
                                                                    subSystem: {
                                                                        ...subSystem,
                                                                        master_system_id: e.target.value
                                                                    }
                                                                });
                                                            }}
                                                            value={subSystem.master_system_id}
                                                        >
                                                            <option value="">Select</option>
                                                            {systemsDropDown && systemsDropDown.length
                                                                ? systemsDropDown.map((item, i) => (
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
                                                        value={subSystem.description}
                                                        onChange={e =>
                                                            this.setState({
                                                                subSystem: {
                                                                    ...subSystem,
                                                                    description: e.target.value
                                                                }
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Service Life</h4>
                                                    <NumberFormat
                                                        autoComplete={"nope"}
                                                        className=" custom-input form-control"
                                                        placeholder="Service Life"
                                                        value={parseInt(subSystem.service_life) || ""}
                                                        format="####"
                                                        displayType={"input"}
                                                        onValueChange={values => {
                                                            const { value } = values;
                                                            this.setState({
                                                                subSystem: {
                                                                    ...subSystem,
                                                                    service_life: value,
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {/* </div> */}
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
                                    {selectedSubSystem ? (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.updateSubSystem()}>
                                            Update Sub System
                                        </button>
                                    ) : (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.addSubSystem()}>
                                            Add Sub System
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
    const { projectReducer, buildingReducer, masterSubSystemReducer } = state;
    return { projectReducer, buildingReducer, masterSubSystemReducer };
};

export default withRouter(connect(mapStateToProps, { ...projectActions, ...buildingActions })(From));
