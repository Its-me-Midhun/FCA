import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";

import buildingTypeActions from "../actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";

class Form extends Component {
    state = {
        isLoading: false,
        errorMessage: "",
        dropDownList: [],
        template: {
            id: "",
            template_name: "",
            setting_id: "",
            uploaded_by: localStorage.getItem("user"),
            description: "",
            template_file: null,
            notes: "",
            active: true
        },
        initialValues: {},
        type: this.props.type,
        showConfirmModal: false,
        showErrorBorder: false,
        uploadError: ""
    };

    componentDidMount = async () => {
        const { selectedTemplate } = this.props;
        if (selectedTemplate.id) {
            this.setState({
                template: {
                    id: selectedTemplate.id,
                    template_name: selectedTemplate.template_name,
                    setting_id: selectedTemplate.setting_id,
                    uploaded_by: selectedTemplate.uploaded_by,
                    description: selectedTemplate.description,
                    template_file: selectedTemplate.template_file,
                    notes: selectedTemplate.notes,
                }
            });
        }
        let dropDownList = await this.props.getPropertyDropdown();
        await this.setState({ dropDownList, initialValues: this.state.template });
    };

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            template: {
                ...this.state.template,
                [name]: value
            }
        });
    };

    handleAddAttachment = e => {
        this.setState({
            uploadError: ""
        });
        if (e?.target?.files) {
            Object.values(e.target.files).map((attachment, i) => {
                let ext = attachment.name.split(".").pop();
                const acceptableExt = ["docx"];
                if (acceptableExt.includes(ext.toLowerCase())) {
                    if (attachment.size < 25000000) {
                        this.setState({
                            attachmentChanged: true,
                            template: { ...this.state.template, template_file: e.target.files[0] }
                        });
                    } else {
                        this.setState({
                            uploadError: "File is too big. Files with size greater than 25MB is not allowed."
                        });
                    }
                } else {
                    this.setState({
                        uploadError: "Accept only docx file format!"
                    });
                }
            });
        }
    };

    validate = () => {
        const { template } = this.state;
        const {
            selectedTemplate: { id }
        } = this.props;
        this.setState({
            showErrorBorder: false
        });
        if (!id && !template.template_file) {
            this.setState({
                uploadError: "*Template file is required",
                showErrorBorder: true
            });
            return false;
        }
        if (!template.template_name?.trim().length) {
            this.setState({
                errorMessage: "*Please enter template name",
                showErrorBorder: true
            });
            return false;
        }
        if (!template.description?.trim().length) {
            this.setState({
                errorMessage: "*Please enter description",
                showErrorBorder: true
            });
            return false;
        }
        return true;
    };

    addTemplate = async () => {
        const { template } = this.state;
        const { addTemplate } = this.props;
        if (this.validate()) {
            await addTemplate(template);
        }
    };

    updateTemplate = async () => {
        const { template } = this.state;
        const { updateTemplate } = this.props;
        if (this.validate()) {
            const { template_file, active , ...rest } = template;
            await updateTemplate(rest);
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
        if (_.isEqual(this.state.initialValues, this.state.template)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        this.setState({
            template: {
                id: "",
                template_name: "",
                setting_id: "",
                uploaded_by: localStorage.getItem("user"),
                description: "",
                template_file: null,
                notes: "",
                active: true
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

        const { template, showErrorBorder, uploadError, dropDownList } = this.state;
        const { selectedTemplate } = this.props;

        return (
            <React.Fragment>
                <div
                    className="modal modal-region add-new-template"
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
                                    {selectedTemplate.id ? "Edit Template Description" : "Add New Template"}
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.cancelForm()}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>

                            <div className="modal-body region-otr build-type-mod">
                                <form autoComplete={"nope"}>
                                    <div className="form-group">
                                        {!selectedTemplate.id && (
                                            <div className="formInp">
                                                <label className={`drag-otr cursor-pointer`} params htmlFor="attachmentFiles">
                                                    {template.template_file ? (
                                                        <>
                                                            <img src="/img/docIcon.webp" />
                                                            <p>{template.template_file?.name || ""}</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className={`fas fa-cloud-upload-alt`}></i>
                                                            <p>Click to upload</p>
                                                        </>
                                                    )}
                                                </label>
                                                <div className="text-center">
                                                    <small className="text-danger">{uploadError}</small>
                                                </div>
                                                <div className="col-md-12 upldFile btnAddCam p-0">
                                                    <input
                                                        type="file"
                                                        accept=".docx"
                                                        className="form-control"
                                                        id="attachmentFiles"
                                                        name="profilePic"
                                                        onChange={this.handleAddAttachment}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="formInp bgInp">
                                            <label>Template Name *</label>
                                            <input
                                                autoComplete="off"
                                                placeholder="Enter Template Name"
                                                className={`${
                                                    showErrorBorder && !template?.template_name?.trim().length ? "error-border " : ""
                                                }form-control`}
                                                name="template_name"
                                                value={template.template_name}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className="formInp bgInp">
                                            <label>Report Property </label>
                                            <div className="custom-selecbox">
                                                <select
                                                    autoComplete="off"
                                                    name="setting_id"
                                                    className={`custom-selecbox form-control`}
                                                    onChange={this.handleChange}
                                                    value={template.setting_id}
                                                >
                                                    <option value="">Select</option>
                                                    {dropDownList.map(item => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="formInp bgInp">
                                            <label>Description *</label>
                                            <input
                                                autoComplete="off"
                                                placeholder="Enter Description"
                                                className={`${
                                                    showErrorBorder && !template?.description?.trim().length ? "error-border " : ""
                                                }form-control`}
                                                name="description"
                                                value={template.description}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className="formInp bgInp">
                                            <label>Notes </label>
                                            <textarea
                                                autoComplete="off"
                                                placeholder="Notes"
                                                className={`form-control`}
                                                name="notes"
                                                value={template.notes}
                                                onChange={this.handleChange}
                                            ></textarea>
                                        </div>
                                    </div>
                                </form>
                                <div className="col-md-12 p-0 text-right btnOtr">
                                    {/* <button type="button" onClick={() => this.props.onCancel()} className="btn btn-primary btnRgion col-md-2">
                                        Cancel
                                    </button> */}
                                    {selectedTemplate.id ? (
                                        <button type="button" onClick={() => this.updateTemplate()} className="btn btn-primary btnRgion col-md-2">
                                            Update
                                        </button>
                                    ) : (
                                        <button type="button" onClick={() => this.addTemplate()} className="btn btn-primary btnRgion col-md-2">
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

export default Form;
