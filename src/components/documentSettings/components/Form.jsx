import React, { Component } from "react";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import actions from "../actions";
import { connect } from "react-redux";
import { DocumentSettingsEntities } from "../config";
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
                show_in_landing_page:"yes"
               
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
        //client dropdown based on ascending order
        this.props.getDropdownList("clients", { order: { "clients.name": "asc" } });
        if (this.props.selectedData) {
            const { success, client,  name, show_in_landing_page } = await this.props.getSettingDataById();
            if (success) {
                await this.setState({
                    data: {
                        name,
                        client_id: client?.id,
                       
                        show_in_landing_page
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

     //form enthelum fill cheythitt cancel confirmation
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
        console.log(name);
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
            documentSettingsReducer: { dropDownList }
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
                                {selectedData ? `Edit ${DocumentSettingsEntities[settingType].name}` : `Add ${DocumentSettingsEntities[settingType].name}`}

                            </li>
                        </ul>
                        <form autoComplete={"nope"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Document Type *</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`${
                                                            showErrorBorder && errorParams.name ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={data.name}
                                                        name="name"
                                                        onChange={this.handleChange}
                                                        placeholder="Enter Document type"
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

                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Show In Landing Page</h4>
                                                    <label class="container-check mt-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.show_in_landing_page == "yes" ? true : false}
                                                            onClick={e => {
                                                                if (e.target.checked) {
                                                                    this.setState({
                                                                        data: {
                                                                            ...data,
                                                                            show_in_landing_page: "yes"
                                                                        }
                                                                    });
                                                                } else {
                                                                    this.setState({
                                                                        data: {
                                                                            ...data,
                                                                            show_in_landing_page: "no"
                                                                        }
                                                                    });
                                                                }
                                                            }}
                                                            name="is_bold"
                                                        />
                                                        <span class="checkmark"></span>
                                                    </label>
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
    const { documentSettingsReducer } = state;
    return { documentSettingsReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions
    })(Form)
);
