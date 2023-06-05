import React, { Component } from "react";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";
import Portal from "../../../common/components/Portal";
import ConfirmationModal from "../../../common/components/ConfirmationModal";

class CriticalityForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            criticality: {
                name: "",
                start_range: "",
                end_range: "",
                color_code: ""
            },
            showPicker: false,
            activeColor: "",
            showErrorBorder: false,
            defaultColors: ["#95cd50", "#ffe242", "#ffa105", "#ff0305"],
            showUpdateConfirm: false
        };
    }

    componentDidMount() {
        const { selectedItem } = this.props;
        if (selectedItem) {
            this.setState({
                criticality: {
                    name: selectedItem.name,
                    start_range: parseFloat(selectedItem.start_range),
                    end_range: parseFloat(selectedItem.end_range),
                    color_code: selectedItem?.color_code
                }
            });
        }
    }

    validateForm() {
        const { name, start_range, end_range, color_code } = this.state.criticality;
        if (!name.trim().length) {
            this.setState({
                showErrorBorder: true
            });
            return false;
        }
        if (start_range === "") {
            this.setState({
                showErrorBorder: true
            });
            return false;
        }
        if (end_range === "") {
            this.setState({
                showErrorBorder: true
            });
            return false;
        }
        if (color_code === "") {
            this.setState({
                showErrorBorder: true
            });
            return false;
        }
        return true;
    }

    handleSubmitForm = () => {
        this.setState({ showUpdateConfirm: false });
        const { selectedItem } = this.props;
        let project_id = this.props.match.params.id || "";
        let params = {
            ...this.state.criticality
        };
        if (this.validateForm()) {
            selectedItem ? this.props.updateCriticalityData(selectedItem.id, params, project_id) : this.props.addCriticalityData(params, project_id);
        }
    };

    handleConfirmUpdate = () => {
        this.setState({ showUpdateConfirm: true });
    };

    hanldeNewColorChange = color => {
        const { criticality, defaultColors } = this.state;
        this.setState({
            activeColor: color.hex,
            criticality: {
                ...criticality,
                color_code: color.hex
            },
            defaultColors: [color.hex, ...defaultColors.slice(1, defaultColors.length)]
        });
    };

    renderOverwriteConfirmation = () => {
        const { showUpdateConfirm } = this.state;
        if (!showUpdateConfirm) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Updating criticality will OVERWRITE any existing recommendation data"}
                        message={"This action cannot be undone.Are you sure you want to continue?"}
                        onNo={() => this.setState({ showUpdateConfirm: false })}
                        onYes={this.handleSubmitForm}
                        type={"load"}
                    />
                }
                onCancel={() => this.setState({ showUpdateConfirm: false })}
            />
        );
    };

    render() {
        const { selectedItem } = this.props;
        const { criticality, showErrorBorder, showPicker } = this.state;
        const styles = reactCSS({
            default: {
                color: {
                    width: "40px",
                    height: "15px",
                    borderRadius: "3px",
                    background: criticality.color_code,
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
            <>
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
                                        {selectedItem ? "Edit " : "Add"} {"Criticality"}
                                    </h5>
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                        onClick={() => this.props.onCancel()}
                                    >
                                        <span aria-hidden="true">
                                            <img src="/img/close.svg" alt="" />
                                        </span>
                                    </button>
                                </div>
                                <div className="modal-body region-otr build-type-mod">
                                    <div className="form-group">
                                        <div className="formInp">
                                            <label>Name *</label>
                                            <input
                                                type="text"
                                                className={`${showErrorBorder && !criticality.name.trim().length ? "error-border " : ""}form-control`}
                                                value={criticality.name}
                                                onChange={e => {
                                                    this.setState({
                                                        criticality: {
                                                            ...criticality,
                                                            name: e.target.value
                                                        }
                                                    });
                                                    this.props.handleName(e);
                                                }}
                                                placeholder="Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="formInp">
                                            <label>Scale From *</label>
                                            <input
                                                type="number"
                                                className={`${showErrorBorder && criticality.start_range === "" ? "error-border " : ""}form-control`}
                                                value={criticality.start_range}
                                                onChange={e => {
                                                    this.setState({
                                                        criticality: {
                                                            ...criticality,
                                                            start_range: parseFloat(e.target.value)
                                                        }
                                                    });
                                                }}
                                                placeholder="Scale From"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="formInp">
                                            <label> Scale To *</label>
                                            <input
                                                type="number"
                                                className={`${showErrorBorder && criticality.end_range === "" ? "error-border " : ""}form-control`}
                                                value={criticality.end_range}
                                                onChange={e => {
                                                    this.setState({
                                                        criticality: {
                                                            ...criticality,
                                                            end_range: parseFloat(e.target.value)
                                                        }
                                                    });
                                                }}
                                                placeholder="Scale To"
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="form-group">
                                        <div className="formInp">
                                            <label>Color </label>
                                            <div className="clr-set">
                                                {defaultColors.map(colorValue => {
                                                    return (
                                                        <div className="col-se cursor-hand">
                                                            <div
                                                                className="set"
                                                                style={{ backgroundColor: colorValue }}
                                                                onClick={() => {
                                                                    this.setState({
                                                                        criticality: {
                                                                            ...criticality,
                                                                            color_code: colorValue
                                                                        },
                                                                        activeColor: colorValue
                                                                    });
                                                                }}
                                                            >
                                                                <div className={`${criticality.color_code === colorValue ? "tic" : ""}`}></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                <div className="col-se cursor-hand">
                                                    <div className="set">
                                                        <img
                                                            src="/img/color-wheel.svg"
                                                            alt=""
                                                            className="img-whel"
                                                            onClick={() =>
                                                                this.setState({
                                                                    openColorCode: !this.state.openColorCode
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    {/* {openColorCode ? (
                                        <div className="color-code">
                                            {console.log("this.state.tempColor", this.state.activeColor)}
                                            <CompactPicker color={this.state.activeColor} onChangeComplete={this.hanldeNewColorChange} />
                                        </div>
                                    ) : null} */}
                                    <div className="form-group">
                                        <div class="formInp">
                                            <label>Color</label>
                                            <div>
                                                <div class="close-icon-right position-relative">
                                                    <span
                                                        onClick={e =>
                                                            this.setState({
                                                                criticality: {
                                                                    ...criticality,
                                                                    color_code: ""
                                                                }
                                                            })
                                                        }
                                                    >
                                                        <i class="fas fa-times"></i>
                                                    </span>
                                                </div>
                                                <div
                                                    style={styles.swatch}
                                                    onClick={() =>
                                                        this.setState({
                                                            showPicker: !showPicker
                                                        })
                                                    }
                                                >
                                                    <div style={styles.color} />
                                                </div>

                                                {showPicker ? (
                                                    <div style={styles.popover}>
                                                        <div
                                                            style={styles.cover}
                                                            onClick={() =>
                                                                this.setState({
                                                                    showPicker: false
                                                                })
                                                            }
                                                        />
                                                        <SketchPicker
                                                            position="right"
                                                            color={criticality.color_code}
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
                                                            onChange={color =>
                                                                this.setState({
                                                                    criticality: {
                                                                        ...this.state.criticality,
                                                                        color_code: color.hex
                                                                    }
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 p-0 text-right btnOtr">
                                        <button
                                            type="button"
                                            onClick={() => (selectedItem ? this.handleConfirmUpdate() : this.handleSubmitForm())}
                                            className="btn btn-primary btnRgion col-md-2"
                                        >
                                            {this.props.codeLoading ? (
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            ) : selectedItem ? (
                                                "Update"
                                            ) : (
                                                "Add"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.renderOverwriteConfirmation()}
                </React.Fragment>
            </>
        );
    }
}
export default withRouter(CriticalityForm);
