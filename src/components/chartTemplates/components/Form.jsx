import React, { Component } from "react";
import _ from "lodash";

import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { TEMPLATE_CHOICES } from "../constants";
import HelperIcon from "../../helper/components/HelperIcon";

class Form extends Component {
    state = {
        isLoading: false,
        errorMessage: "",
        dropDownList: [],
        templateData: {
            id: "",
            name: "",
            chart_propertie_id: "",
            uploaded_by: localStorage.getItem("userId"),
            description: "",
            template: null,
            notes: "",
            active: true,
            template_type: ""
        },
        file: "",
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
                templateData: {
                    id: selectedTemplate.id,
                    name: selectedTemplate.name,
                    chart_propertie_id: selectedTemplate.chart_properties?.id || "",
                    uploaded_by: selectedTemplate.uploaded_by,
                    description: selectedTemplate.description,
                    template: selectedTemplate.template,
                    notes: selectedTemplate.notes,
                    template_type: selectedTemplate.template_type === "Client" ? "CLI" : selectedTemplate.template_type === "Consultant" ? "CON" : ""
                },
                file: selectedTemplate.file
            });
        }
        let dropDownList = await this.props.getChartPropertyDropdown();
        await this.setState({ dropDownList, initialValues: this.state.templateData });
    };

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            templateData: {
                ...this.state.templateData,
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
                            templateData: { ...this.state.templateData, template: e.target.files[0] }
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
        const { templateData } = this.state;
        const {
            selectedTemplate: { id }
        } = this.props;
        this.setState({
            showErrorBorder: false
        });
        if (!id && !templateData.template) {
            this.setState({
                uploadError: "*Template file is required",
                showErrorBorder: true
            });
            return false;
        }
        if (!templateData.name?.trim().length) {
            this.setState({
                errorMessage: "*Please enter template name",
                showErrorBorder: true
            });
            return false;
        }
        if (!templateData.description?.trim().length) {
            this.setState({
                errorMessage: "*Please enter description",
                showErrorBorder: true
            });
            return false;
        }
        if (!templateData.chart_propertie_id?.trim().length) {
            this.setState({
                errorMessage: "*Please select a Chart Property",
                showErrorBorder: true
            });
            return false;
        }
        if (!templateData.template_type?.trim().length) {
            this.setState({
                errorMessage: "*Please select a Template Type",
                showErrorBorder: true
            });
            return false;
        }
        return true;
    };

    addTemplate = async () => {
        const { templateData } = this.state;
        const { addTemplate } = this.props;
        if (this.validate()) {
            await addTemplate(templateData);
        }
    };

    updateTemplate = async () => {
        const { templateData } = this.state;
        const { updateTemplate } = this.props;
        if (this.validate()) {
            const { active, ...rest } = templateData;
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
        if (_.isEqual(this.state.initialValues, this.state.templateData)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        this.setState({
            templateData: {
                id: "",
                name: "",
                chart_propertie_id: "",
                uploaded_by: localStorage.getItem("user"),
                description: "",
                template: null,
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
        const { isLoading, file } = this.state;
        if (isLoading) return <Loader />;

        const { templateData, showErrorBorder, uploadError, dropDownList } = this.state;
        const { selectedTemplate } = this.props;
        let file_name = file?.split("/");
        file_name = file_name ? file_name[file_name?.length - 1] : "";
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
                                <HelperIcon entity={"fca_projects"} />
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.cancelForm()}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>

                            <div className="modal-body region-otr build-type-mod">
                                <form autoComplete={"nope"}>
                                    <div className="form-group">
                                        <div className="formInp">
                                            <label className={`drag-otr cursor-pointer`} params htmlFor="attachmentFiles">
                                                {templateData.template || file_name ? (
                                                    <>
                                                        <img src="/img/docIcon.webp" />
                                                        <p>{templateData.template?.name || file_name || ""}</p>
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
                                        <div className="formInp bgInp">
                                            <label>Template Name *</label>
                                            <input
                                                autoComplete="off"
                                                placeholder="Enter Template Name"
                                                className={`${
                                                    showErrorBorder && !templateData?.name?.trim().length ? "error-border " : ""
                                                }form-control`}
                                                name="name"
                                                value={templateData.name}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        <div className="formInp bgInp">
                                            <label>Export Property *</label>
                                            <div className="custom-selecbox">
                                                <select
                                                    autoComplete="off"
                                                    name="chart_propertie_id"
                                                    className={`${
                                                        showErrorBorder && !templateData?.chart_propertie_id?.trim().length ? "error-border " : ""
                                                    }custom-selecbox form-control`}
                                                    onChange={this.handleChange}
                                                    value={templateData.chart_propertie_id}
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
                                            <label>Template Type *</label>
                                            <div className="custom-selecbox">
                                                <select
                                                    autoComplete="off"
                                                    name="template_type"
                                                    className={`${
                                                        showErrorBorder && !templateData?.template_type?.trim().length ? "error-border " : ""
                                                    }custom-selecbox form-control`}
                                                    onChange={this.handleChange}
                                                    value={templateData.template_type}
                                                >
                                                    <option value="">Select</option>
                                                    {TEMPLATE_CHOICES.map(item => (
                                                        <option key={item.value} value={item.value}>
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
                                                    showErrorBorder && !templateData?.description?.trim().length ? "error-border " : ""
                                                }form-control`}
                                                name="description"
                                                value={templateData.description}
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
                                                value={templateData.notes}
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
