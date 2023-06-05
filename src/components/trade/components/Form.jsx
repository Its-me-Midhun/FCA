import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import reactCSS from "reactcss";
import buildingTypeActions from "../actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { CompactPicker, SketchPicker } from "react-color";
import { ALIGNMENTS, FONT_COLOR, HEADINGS, LIST_STYLES, SPACING_RULE } from "../constants";
class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            errorMessage: "",
            trade: {
                name: "",
                display_name: "",
                description: "",
                color_code: "",
                narrative_required: "no"
            },
            showPicker: false,
            initiaValues: {},
            selectedTrade: props.selectedProject,
            type: props.type,
            showConfirmModal: false,
            showErrorBorder: false
        };
    }

    componentDidMount = async () => {
        const { selectedTrade } = this.state;
        if (selectedTrade) {
            await this.props.getTradeByOne(selectedTrade);
            const {
                tradeReducer: {
                    getTradeByIdResponse: { description, name, display_name, success, color_code, narrative_required }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    trade: {
                        name,
                        description,
                        display_name,
                        color_code: color_code || "",
                        narrative_required
                    }
                });
            }
        }
        await this.setState({
            isLoading: false
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

    onChange = color => {
        this.setState({
            trade: {
                ...this.state.trade,
                color_code: color.hex
            }
        });
    };

    validate = () => {
        const { trade } = this.state;
        this.setState({
            showErrorBorder: false
        });
        if (!trade.name && !trade.name?.trim().length) {
            this.setState({
                errorMessage: "Please enter trade name",
                showErrorBorder: true
            });
            return false;
        }
        if (!trade.display_name && !trade.display_name?.trim().length) {
            this.setState({
                errorMessage: "Please enter trade display name",
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
                display_name: "",
                narrative_required: "no",
                color_code: ""
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

        const { trade, selectedTrade, showErrorBorder } = this.state;
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
                                    {selectedTrade ? "Edit Trade" : "Add New Trade"}
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
                                            <label>Display Name *</label>
                                            <input
                                                autoComplete={"nope"}
                                                type="text"
                                                className={`${
                                                    showErrorBorder && !trade.display_name?.trim().length ? "error-border " : ""
                                                }form-control`}
                                                value={trade.display_name}
                                                onChange={e =>
                                                    this.setState({
                                                        trade: {
                                                            ...trade,
                                                            display_name: e.target.value
                                                        }
                                                    })
                                                }
                                                placeholder="Display Name"
                                            />
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
                                </form>
                                <div className="col-md-12 p-0 text-right btnOtr">
                                    {selectedTrade ? (
                                        <button type="button" onClick={() => this.updateBuildingType()} className="btn btn-primary btnRgion col-md-2">
                                            Update
                                        </button>
                                    ) : (
                                        <button type="button" onClick={() => this.addBuildingType()} className="btn btn-primary btnRgion col-md-2">
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
    const { tradeReducer } = state;
    return { tradeReducer };
};

export default withRouter(connect(mapStateToProps, { ...buildingTypeActions })(Form));
