import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import reactCSS from "reactcss";
import ReactTooltip from "react-tooltip";
import categoryActions from "../actions";
import buildingActions from "../../building/actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { SketchPicker } from "react-color";
import ReactSelect from "react-select";

const bands = [
    { value: "energy_band", label: "Energy" },
    { value: "water_band", label: "Water" }
];
class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            category: {
                name: "",
                description: "",
                color_code: "",
                assigned_bands: []
            },
            showPicker: false,
            selectedCategory: props.selectedItem,
            showConfirmModal: false,
            showErrorBorder: false
        };
    }

    componentDidMount = async () => {
        const { selectedCategory } = this.state;
        if (selectedCategory) {
            await this.props.getCategoryByOne(selectedCategory);
            const {
                categoryReducer: {
                    getCategoryByIdResponse: { description, name, success, color_code, assigned_bands = [] }
                }
            } = this.props;
            let formatedAssignedBands = bands.filter(elem => assigned_bands.includes(elem.value));
            if (success) {
                await this.setState({
                    category: {
                        name,
                        description,
                        color_code: color_code || "",
                        assigned_bands: formatedAssignedBands
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
            category: {
                ...this.state.category,
                color_code: color.hex
            }
        });
    };
    validate = () => {
        const { category } = this.state;
        this.setState({
            showErrorBorder: false
        });
        if (!category.name && !category.name.trim().length) {
            this.setState({
                showErrorBorder: true
            });
            return false;
        }
        return true;
    };

    addCategory = async () => {
        let { category } = this.state;
        category.assigned_bands = category?.assigned_bands?.map(elem => elem.value) || [];
        const { handleAddCategory } = this.props;
        if (this.validate()) {
            await handleAddCategory(category);
        }
    };

    updateCategory = async () => {
        let { category } = this.state;
        category.assigned_bands = category?.assigned_bands?.map(elem => elem.value) || [];
        const { handleUpdateCategory } = this.props;
        if (this.validate()) {
            await handleUpdateCategory(category);
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

        const { category, selectedCategory, showErrorBorder } = this.state;
        const styles = reactCSS({
            default: {
                color: {
                    width: "40px",
                    height: "15px",
                    borderRadius: "3px",
                    background: this.state.category.color_code,
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
                <ReactTooltip />
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
                                    {selectedCategory ? "Edit Category" : "Add New Category"}
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
                                            <label>Name *</label>
                                            <input
                                                autoComplete="nope"
                                                type="text"
                                                className={`${showErrorBorder && !category.name.trim().length ? "error-border " : ""}form-control`}
                                                value={category.name}
                                                onChange={e =>
                                                    this.setState({
                                                        category: {
                                                            ...category,
                                                            name: e.target.value
                                                        }
                                                    })
                                                }
                                                placeholder="Name"
                                            />
                                        </div>
                                        <div class="formInp">
                                            <label>Assigned Bands</label>
                                            <ReactSelect
                                                options={bands}
                                                value={category.assigned_bands}
                                                isMulti
                                                isClearable
                                                // className="form-control"
                                                classNamePrefix="react-select"
                                                onChange={value => {
                                                    console.log(value);
                                                    this.setState({
                                                        category: {
                                                            ...category,
                                                            assigned_bands: value
                                                        }
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div class="formInp">
                                            <label>Description</label>
                                            <textarea
                                                autoComplete="nope"
                                                placeholder="Description"
                                                class="form-control"
                                                value={category.description}
                                                onChange={e =>
                                                    this.setState({
                                                        category: {
                                                            ...category,
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
                                                                category: {
                                                                    ...category,
                                                                    color_code: ""
                                                                }
                                                            })
                                                        }
                                                        // data-tip={"Click here"}
                                                        // data-multiline={true}
                                                        // data-place="top"
                                                        // data-effect="solid"
                                                        // data-background-color="#4991ff"
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
                                                            color={this.state.category.color_code}
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
                                    {selectedCategory ? (
                                        <button type="button" onClick={() => this.updateCategory()} className="btn btn-primary btnRgion col-md-2">
                                            Update
                                        </button>
                                    ) : (
                                        <button type="button" onClick={() => this.addCategory()} className="btn btn-primary btnRgion col-md-2">
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
    const { categoryReducer } = state;
    return { categoryReducer };
};

export default withRouter(connect(mapStateToProps, { ...categoryActions, ...buildingActions })(Form));
