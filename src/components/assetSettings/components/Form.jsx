import React, { Component } from "react";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import actions from "../actions";
import { connect } from "react-redux";
import { AssetSettingsEntities } from "../config";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";
import exclmIcon from "../../../assets/img/recom-icon.svg";
class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            data: {
                name: "",
                client_id: "",
                description: "",
                color_code: ""
            },
            showPicker: false,
            errorParams: {
                name: ""
            },
            initialValues: {},
            showConfirmModal: false,
            showErrorBorder: false
        };
    }

    componentDidMount = async () => {
        this.props.getDropdownList("clients", { order: { "clients.name": "asc" } });
        if (this.props.selectedData) {
            const { name, success, client, description, color_code } = await this.props.getSettingDataById();
            if (success) {
                await this.setState({
                    data: {
                        name,
                        client_id: client?.id,
                        description,
                        color_code: color_code || ""
                    }
                });
            }
        }
        await this.setState({
            initialValues: this.state.data,
            isLoading: false
        });
    };
    onClick = () => {
        this.setState({
            showPicker: !this.state.showPicker
        });
        console.log(this.props.settingType);
    };

    onClose = () => {
        this.setState({
            showPicker: false
        });
    };

    onChange = color => {
        this.setState({
            data: {
                ...this.state.data,
                color_code: color.hex
            }
        });
    };

    validate = () => {
        const { data } = this.state;
        let errorParams = {
            name: false
        };
        let showErrorBorder = false;

        if (!data.name || !data.name?.trim()?.length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!data.client_id || !data.client_id?.trim()?.length) {
            errorParams.client_id = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    addData = async () => {
        const { data } = this.state;
        const { handleAddData } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            await handleAddData(data);
            this.setState({
                isUploading: false
            });
        }
    };

    updateData = async () => {
        const { data } = this.state;
        const { handleUpdateData } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            await handleUpdateData(data);
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
        if (_.isEqual(this.state.initialValues, this.state.data)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        const { cancelForm } = this.props;
        await this.setState({
            data: {
                name: ""
            }
        });
        cancelForm();
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            data: {
                ...this.state.data,
                [name]: value
            }
        });
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { data, showErrorBorder, errorParams } = this.state;
        const {
            selectedData,
            match: {
                params: { settingType }
            },
            assetSettingsReducer: { dropDownList }
        } = this.props;
        const styles = reactCSS({
            default: {
                color: {
                    width: "40px",
                    height: "15px",
                    borderRadius: "3px",
                    background: this.state.data.color_code
                },
                popover: {
                    position: "absolute",
                    zIndex: "3"
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
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">
                                {selectedData ? `Edit ${AssetSettingsEntities[settingType].name}` : `Add ${AssetSettingsEntities[settingType].name}`}
                            </li>
                        </ul>
                        <form autoComplete={"nope"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Name *</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`${
                                                            showErrorBorder && errorParams.name ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={data.name}
                                                        name="name"
                                                        onChange={this.handleChange}
                                                        placeholder="Enter Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Client *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            autoComplete={"nope"}
                                                            className={`${
                                                                showErrorBorder && errorParams.client_id ? "error-border " : ""
                                                            }custom-selecbox form-control`}
                                                            name="client_id"
                                                            onChange={this.handleChange}
                                                            value={data.client_id}
                                                        >
                                                            <option value="">Select</option>
                                                            {dropDownList["clients"]?.length
                                                                ? dropDownList["clients"].map((item, i) => (
                                                                      <option value={item.id} key={i}>
                                                                          {item.name}
                                                                      </option>
                                                                  ))
                                                                : null}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            {settingType === "condition" && (
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Color</h4>
                                                        <div>
                                                            <div style={styles.swatch} onClick={this.onClick}>
                                                                <div style={styles.color} />
                                                            </div>
                                                            {this.state.showPicker ? (
                                                                <div style={styles.popover}>
                                                                    <div style={styles.cover} onClick={this.onClose} />
                                                                    <SketchPicker
                                                                        color={this.state.data.color_code}
                                                                      
                                                                        presetColors={[
                                                                            "#95cd50",
                                                                            "#ffe242",
                                                                            "#ffa105",
                                                                            "#ff0305",
                                                                            "#525252",
                                                                            "#343C65",
                                                                            "#8B572A",
                                                                            "#417505"
                                                                        ]}
                                                                        onChange={this.onChange}
                                                                    />
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Asset Condition Description</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`custom-input form-control`}
                                                        value={data.description}
                                                        name="description"
                                                        onChange={this.handleChange}
                                                        placeholder="Enter Asset Condition  Description"
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
                                    {selectedData ? (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.updateData()}>
                                            Update
                                        </button>
                                    ) : (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.addData()}>
                                            Add
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
    const { assetSettingsReducer } = state;
    return { assetSettingsReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions
    })(Form)
);
