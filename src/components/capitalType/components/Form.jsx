import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";

import capitalTypeActions from "../actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            capitalType: {
                name: "",
                description: "",
                display_name: "",
                color_code: ""
            },
            showPicker: false,
            selectedCapitalType: props.selectedItem,
            showConfirmModal: false,
            showErrorBorder: false
        };
    }

    componentDidMount = async () => {
        const { selectedCapitalType } = this.state;
        if (selectedCapitalType) {
            await this.props.getCapitalTypeByOne(selectedCapitalType);
            const {
                capitalTypeReducer: {
                    getCapitalTypeByIdResponse: { description, name, display_name, success, color_code }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    capitalType: {
                        name,
                        description,
                        display_name,
                        color_code: color_code || ""
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
            capitalType: {
                ...this.state.capitalType,
                color_code: color.hex
            }
        });
    };
    validate = () => {
        const { capitalType } = this.state;
        this.setState({
            showErrorBorder: false
        });
        return true;
    };

    updateCapitalType = async () => {
        const { capitalType } = this.state;
        const { handleUpdateCapitalType } = this.props;
        if (this.validate()) {
            await handleUpdateCapitalType({
                recommendation_capital_type: {
                    description: capitalType.description,
                    display_name: capitalType.display_name,
                    color_code: capitalType.color_code
                }
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

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { capitalType } = this.state;
        const styles = reactCSS({
            default: {
                color: {
                    width: "40px",
                    height: "15px",
                    borderRadius: "3px",
                    background: this.state.capitalType.color_code,
                    zoom: "107%"
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
                                    Edit Capital Type
                                </h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onCancel()}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div class="modal-body region-otr build-type-mod">
                                <form autoComplete="nope">
                                    <div class="form-group">
                                        <div class="formInp">
                                            <label>Name</label>
                                            <input
                                                autoComplete="nope"
                                                type="text"
                                                className={`form-control cursor-diabled`}
                                                value={capitalType.name}
                                                readOnly
                                                placeholder="Name"
                                            />
                                        </div>

                                        <div class="formInp">
                                            <label>Display Name</label>
                                            <input
                                                autoComplete="nope"
                                                class="form-control"
                                                value={capitalType.display_name}
                                                onChange={e =>
                                                    this.setState({
                                                        capitalType: {
                                                            ...capitalType,
                                                            display_name: e.target.value
                                                        }
                                                    })
                                                }
                                                placeholder="Display Name"
                                            />
                                        </div>
                                        <div class="formInp">
                                            <label>Description</label>
                                            <textarea
                                                autoComplete="nope"
                                                placeholder="Description"
                                                class="form-control"
                                                value={capitalType.description}
                                                onChange={e =>
                                                    this.setState({
                                                        capitalType: {
                                                            ...capitalType,
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
                                                                capitalType: {
                                                                    ...capitalType,
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
                                                            position="right"
                                                            color={this.state.capitalType.color_code}
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
                                    </div>
                                </form>
                                <div class="col-md-12 p-0 text-right btnOtr">
                                    <button type="button" onClick={() => this.updateCapitalType()} className="btn btn-primary btnRgion col-md-2">
                                        Update
                                    </button>
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
    const { capitalTypeReducer } = state;
    return { capitalTypeReducer };
};

export default withRouter(connect(mapStateToProps, { ...capitalTypeActions })(Form));
