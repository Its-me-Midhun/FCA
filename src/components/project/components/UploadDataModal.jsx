import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import projectActions from "../actions";
import buildingActions from "../../building/actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { popBreadCrumpData } from "../../../config/utils";

class From extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            clients: "",
            consultancy_users: "",
            project: {
                client_id: "",
                region_id: "",
                site_id: "",
                name: "",
                project_id: props.match.params.id || "",
                code: "",
                comments: "",
                fca_sheet: ""
            },
            initiaValues: {},
            isNewProject: true,
            selectedClient: {},
            regionList: [],
            siteList: [],
            projectList: [],
            selectedConsultancyUsers: [],
            selectedProject: props.match.params.id,
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false
        };
    }

    componentDidMount = async () => {
        const { selectedProject } = this.state;
        if (selectedProject) {
            await this.props.getDataById(selectedProject);
            const {
                projectReducer: {
                    getProjectByIdResponse: { success, client }
                }
            } = this.props;
            if (success) {
                let regionList = await this.props.getRegionListBasedOnClient(client.id);
                await this.setState({
                    regionList,
                    project: {
                        region_id: "",
                        site_id: "",
                        project_id: this.props.match.params.id
                    },
                    siteList: [],
                    isLoading: false
                });
            }
        }
        this.setState({
            initiaValues: this.state.project
        });
    };

    onSelectConsultancyUsers = async selectedConsultancyUsers => {
        const { project } = this.state;
        let tempUsers = [];
        if (selectedConsultancyUsers.length) {
            selectedConsultancyUsers.map(item => tempUsers.push(item.id));
        }

        await this.setState({
            project: {
                ...project,
                consultancy_user_ids: tempUsers
            },
            selectedConsultancyUsers
        });
    };

    handleClientSelect = async e => {
        const { project } = this.state;
        let regionList = await this.props.getRegionListBasedOnClient(project.client_id);
        this.setState({
            regionList,
            project: {
                ...project,
                region_id: "",
                site_id: ""
            },
            siteList: []
        });
    };

    handleRegionSelect = async e => {
        const { project } = this.state;
        let siteList = await this.props.getSiteListBasedOnRegion(project.region_id);
        this.setState({
            siteList,
            project: {
                ...project,
                site_id: ""
            }
        });
    };

    validate = () => {
        const { project } = this.state;
        this.setState({
            showErrorBorder: false
        });
        if (!project.region_id || !project.region_id.trim().length) {
            this.setState({
                errorMessage: "Please select region",
                showErrorBorder: true
            });
            return false;
        } else if (!project.site_id || !project.site_id.length) {
            this.setState({
                errorMessage: "Please select site",
                showErrorBorder: true
            });
            return false;
        } else if (!project.fca_sheet) {
            this.setState({
                errorMessage: "Please choose file",
                showErrorBorder: true
            });
            return false;
        }
        return true;
    };

    addProject = async () => {
        const { project } = this.state;
        const { handleAddProject } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleAddProject(project);
        }
    };

    updateProject = async () => {
        const { project } = this.state;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            await this.props.handleUploadData(project);
        }
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to clear and lose all changes?"}
                        type="cancel"
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
        if (_.isEqual(this.state.initiaValues, this.state.project)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        await this.setState({
            project: {
                region_id: "",
                site_id: "",
                fca_sheet: {}
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

    handleAddAttachment = e => {
        this.setState({
            uploadError: ""
        });
        if (this.isIterable(e.target.files)) {
            Object.values(e.target.files).map((attachment, i) => {
                let ext = attachment.name.split(".").pop();
                const acceptableExt = ["xls", "xlsx", "xlsm"];
                if (acceptableExt.includes(ext)) {
                    if (attachment.size < 100000000) {
                        this.setState({
                            attachmentChanged: true,
                            project: {
                                ...this.state.project,
                                fca_sheet: e.target.files[0]
                            }
                        });
                    } else {
                        this.setState({
                            uploadError: "File is too big. Files with size greater than 100MB is not allowed."
                        });
                    }
                } else {
                    this.setState({
                        attachmentChanged: false,
                        uploadError: "* Upload xls or xlsm or xlsx Files !!!"
                    });
                }
            });
        }
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { project, regionList, selectedProject, siteList, showErrorBorder, uploadError } = this.state;

        return (
            <React.Fragment>
                <div
                    className="modal modal-region"
                    id="modalId"
                    style={{ display: "block" }}
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Upload Data
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onCancel}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="add-project">
                                <div className="modal-body region-otr">
                                    <div className="building-form">
                                        <div className="form-group">
                                            <div className="formInp">
                                                <label>Region *</label>
                                                <div className="selectOtr">
                                                    <select
                                                        className={`${
                                                            showErrorBorder && (!project.region_id || !project.region_id.trim().length)
                                                                ? "error-border "
                                                                : ""
                                                        }form-control`}
                                                        onChange={async e => {
                                                            await this.setState({
                                                                project: {
                                                                    ...project,
                                                                    region_id: e.target.value
                                                                }
                                                            });
                                                            this.handleRegionSelect();
                                                        }}
                                                        value={project.region_id}
                                                    >
                                                        <option value="">Select</option>
                                                        {regionList && regionList.length
                                                            ? regionList.map((item, i) => (
                                                                  <option value={item.id} key={i}>
                                                                      {item.name}
                                                                  </option>
                                                              ))
                                                            : null}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="formInp">
                                                <label>Site *</label>
                                                <div className="selectOtr">
                                                    <select
                                                        className={`${
                                                            showErrorBorder && (!project.site_id || !project.site_id.trim().length)
                                                                ? "error-border "
                                                                : ""
                                                        }form-control`}
                                                        onChange={e =>
                                                            this.setState({
                                                                project: {
                                                                    ...project,
                                                                    site_id: e.target.value
                                                                }
                                                            })
                                                        }
                                                        value={project.site_id}
                                                    >
                                                        <option value="">Select</option>
                                                        {siteList && siteList.length
                                                            ? siteList.map((item, i) => (
                                                                  <option value={item.id} key={i}>
                                                                      {item.name}
                                                                  </option>
                                                              ))
                                                            : null}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 upldFile btnAddCam p-0">
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="attachmentFiles"
                                                name="projectFile"
                                                onChange={this.handleAddAttachment}
                                            />
                                            <div className="upld-otr d-flex">
                                                <label
                                                    htmlFor="attachmentFiles"
                                                    className={`${
                                                        showErrorBorder && !project.fca_sheet ? "error-border " : ""
                                                    }custom-file-uploadd cursor-pointer`}
                                                    title={project.fca_sheet && project.fca_sheet.name ? project.fca_sheet.name : null}
                                                >
                                                    {project.fca_sheet ? (
                                                        project.fca_sheet.name && project.fca_sheet.name.length > 25 ? (
                                                            project.fca_sheet.name.substring(0, 25) + "..."
                                                        ) : (
                                                            project.fca_sheet.name
                                                        )
                                                    ) : (
                                                        <>
                                                            <img src="/img/upload.png" alt="" />
                                                            Upload Files *
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                            <div className="text-center">
                                                <span className="text-danger">{uploadError}</span>
                                            </div>
                                            <p className="upld">Upload xls or xlsm or xlsx Files</p>
                                        </div>
                                        <div className="text-center btnOtr">
                                            <button
                                                type="button"
                                                className="btn btn-secondary btnClr col-md-6"
                                                data-dismiss="modal"
                                                onClick={() => this.cancelForm()}
                                            >
                                                Cancel
                                            </button>
                                            {this.state.isUploading ? (
                                                <button type="button" className="btn btn-primary btnRgion col-md-6">
                                                    <div className="button-loader d-flex justify-content-center align-items-center">
                                                        <div className="spinner-border text-white" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            ) : selectedProject ? (
                                                <button
                                                    type="button"
                                                    onClick={() => this.updateProject()}
                                                    className="btn btn-primary btnRgion col-md-6"
                                                >
                                                    Update Project
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
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
    const { projectReducer, buildingReducer } = state;
    return { projectReducer, buildingReducer };
};

export default withRouter(connect(mapStateToProps, { ...projectActions, ...buildingActions })(From));
