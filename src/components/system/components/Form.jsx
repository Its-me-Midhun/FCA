import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import reactCSS from "reactcss";
import buildingTypeActions from "../actions";
import buildingActions from "../../building/actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { SketchPicker } from "react-color";

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
                description: "",
                color_code: "",
                narrative_required: "no"
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
            showErrorBorder: false,
            showPicker: false
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
            systemReducer: {
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
            await this.props.getSystemByOne(selectedTrade);
            const {
                systemReducer: {
                    getSystemByIdResponse: { description, name, trade, color_code, success, narrative_required }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    trade: {
                        name,
                        description,
                        trade_id: trade.id,
                        narrative_required,
                        color_code: color_code || ""
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

    onChange = color => {
        this.setState({
            trade: {
                ...this.state.trade,
                color_code: color.hex
            }
        });
    };
    onClick = () => {
        this.setState({
            showPicker: !this.state.showPicker
        });
    };

    onClose = () => {
        this.setState({
            showPicker: false
        });
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { trades, trade, selectedProject, showErrorBorder } = this.state;
        const styles = reactCSS({
            default: {
                color: {
                    width: "40px",
                    height: "15px",
                    borderRadius: "3px",
                    background: this.state.trade.color_code
                },
                popover: {
                    position: "absolute",
                    zIndex: "3",
                    left: "111px",
                    top: "172px"
                },
                cover: {
                    position: "fixed",
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    left: "0px"
                },
                swatch: {
                    padding: "6px",
                    background: "#ffffff",
                    borderRadius: "2px",
                    cursor: "pointer",
                    display: "inline-block",
                    boxShadow: "0 0 0 1px rgba(0,0,0,.2)"
                }
            }
        });
        return (
            <React.Fragment>
                <div
                    className="modal modal-region"
                    style={{ display: "block" }}
                    id="modalId"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    {selectedProject ? "Edit System" : "Add New System"}
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
                                        <div class="formInp">
                                            <label>Color</label>
                                            <div>
                                                <div class="close-icon-right position-relative">
                                                    <span
                                                        onClick={e =>
                                                            this.setState({
                                                                trade: {
                                                                    ...trade,
                                                                    color_code: ""
                                                                }
                                                            })
                                                        }
                                                    >
                                                        <i class="fas fa-times"></i>
                                                    </span>
                                                </div>
                                                <div style={styles.swatch} onClick={this.onClick}>
                                                    <div style={styles.color} />
                                                </div>

                                                {this.state.showPicker ? (
                                                    <div style={styles.popover}>
                                                        <div style={styles.cover} onClick={this.onClose} />
                                                        <SketchPicker
                                                            color={this.state.trade.color_code}
                                                            presetColors={[
                                                                "#95cd50",
                                                                "#ffe242",
                                                                "#ffa105",
                                                                "#ff0305",
                                                                "#0018A8",
                                                                "#800080",
                                                                "#3E8EDE",
                                                                "#417505"
                                                            ]}
                                                            onChange={this.onChange}
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="formInp">
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
    const { buildingTypeReducer, buildingReducer, systemReducer } = state;
    return { buildingTypeReducer, buildingReducer, systemReducer };
};

export default withRouter(connect(mapStateToProps, { ...buildingTypeActions, ...buildingActions })(From));
