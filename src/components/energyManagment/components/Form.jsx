import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import { Multiselect } from "multiselect-react-dropdown";

import projectActions from "../actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import {
    addToBreadCrumpData,
    popBreadCrumpData,
    findPrevPathFromBreadCrump
} from "../../../config/utils";

class From extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            clients: "",
            consultancy_users: [],
            client_users: [],
            consultancies: "",
            project: {
                consultancy_user_ids: [],
                client_user_ids: [],
                client_id: "",
                region_id: "",
                site_id: "",
                name: "",
                project_id: props.match.params.id || "",
                code: "",
                comments: "",
                fca_sheet: "",
                consultancy_id: "",
                removed_users: [],

            },
            initiaValues: {},
            isNewProject: true,
            selectedClient: {},
            regionList: [],
            siteList: [],
            projectList: [],
            selectedConsultancyUsers: [],
            selectedClientUsers: [],
            selectedProject: props.match.params.id,
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false,
            initialConsultancyUsers: [],
            initialClientUsers: [],

        };
    }

    componentDidMount = async () => {
        await this.props.getAllProjectDropdowns();
        const {
            projectReducer: {
                getAllConsultancyUsersResponse: { users: consultancy_users },
                getAllClientsResponse: { clients },
                getAllConsultanciesDropdownResponse: { consultancies }
            }
        } = this.props;
        let role = localStorage.getItem("role");
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const { selectedProject } = this.state;
        let projectList = [];
        if (query.inp || selectedProject) {
            projectList = this.props.projectReducer.getAllProjectsResponse.projects;
        }
        if (selectedProject) {
            await this.props.getDataById(selectedProject);
            const {
                projectReducer: {
                    getProjectByIdResponse: { code, comments, users, name, client_users, success, client, consultancy }
                }
            } = this.props;

            if (success) {
                await this.props.getAllConsultancyUsers({ consultancy_id: consultancy.id });
                const {
                    projectReducer: {
                        getAllConsultancyUsersResponse: { users: consultancy_users },
                    }
                } = this.props;
                let tempUserOptions = [];
                if (consultancy_users && consultancy_users.length) {
                    consultancy_users.map(item => tempUserOptions.push({ name: item.name, id: item.id }));
                }
                await this.setState({ consultancy_users: tempUserOptions })

                if (role === "super_admin") {
                    await this.props.getAllClients({ consultancy_id: consultancy.id });
                    const {
                        projectReducer: {
                            getAllClientsResponse: { clients }
                        }
                    } = this.props;
                    await this.setState({ clients })
                }
                let selectedClientUsers = [];
                let client_user_ids = [];
                if (this.props.projectReducer &&
                    this.props.projectReducer.getProjectByIdResponse &&
                    this.props.projectReducer.getProjectByIdResponse.client_users &&
                    this.props.projectReducer.getProjectByIdResponse.client_users.length) {
                    this.props.projectReducer.getProjectByIdResponse.client_users.map(item => selectedClientUsers.push({ name: item.name, id: item.id }));
                }
                if (this.props.projectReducer &&
                    this.props.projectReducer.getProjectByIdResponse &&
                    this.props.projectReducer.getProjectByIdResponse.client_users &&
                    this.props.projectReducer.getProjectByIdResponse.client_users.length) {
                    this.props.projectReducer.getProjectByIdResponse.client_users.map(item => client_user_ids.push(item.id));
                }
                await this.props.getAllClientUsers(client.id);
                const {
                    projectReducer: {
                        getAllClientUsersResponse: { client_users }
                    }
                } = this.props;
                let selectedConsultancyUsers = [];
                let consultancy_user_ids = [];
                if (users.length) {
                    users.map(item => selectedConsultancyUsers.push({ name: item.name, id: item.id }));
                    users.map(item => consultancy_user_ids.push(item.id));
                }
                await this.setState({
                    selectedConsultancyUsers,
                    selectedClientUsers,
                    consultancy_users: consultancy_users,
                    client_users,
                    project: {
                        name,
                        code,
                        comments,
                        consultancy_id: consultancy ? consultancy.id : "",
                        consultancy_user_ids,
                        client_user_ids

                    },
                    initialConsultancyUsers: consultancy_user_ids,
                    initialClientUsers: client_user_ids
                });
            }
        }

        if (role === "consultancy_user") {
            await this.setState({ clients })
        }
        await this.setState({
            projectList,
            consultancies,
            initiaValues: this.state.project,
            isNewProject: query.inp,
            isLoading: false
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
        console.log(this.state.project)
    };
    onSelectClientUsers = async selectedClientUsers => {
        const { project } = this.state;
        let tempUsers = [];
        if (selectedClientUsers.length) {
            selectedClientUsers.map(item => tempUsers.push(item.id));
        }

        await this.setState({
            project: {
                ...project,
                client_user_ids: tempUsers
            },
            selectedClientUsers
        });
    };

    handleClientSelect = async e => {
        const { project } = this.state;
        let regionList = await this.props.getRegionListBasedOnClient(project.client_id);
        await this.props.getAllClientUsers(project.client_id);
        const {
            projectReducer: {
                getAllClientUsersResponse: { client_users }
            }
        } = this.props;
        this.setState({
            regionList,
            client_users,
            project: {
                ...project,
                region_id: "",
                site_id: "",
                client_user_ids: []
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
        const { project, selectedProject } = this.state;
        let role = localStorage.getItem("role") || ""
        this.setState({
            showErrorBorder: false
        });
        if (!project.name.trim().length && !project.project_id) {
            this.setState({
                errorMessage: "Please enter project name",
                showErrorBorder: true
            });
            return false;
        }
        else if (role === "super_admin" && !project.consultancy_id.trim().length) {
            this.setState({
                errorMessage: "Please select consultancy",
                showErrorBorder: true
            });
            return false;
        }
        else if ((role === "super_admin" || role === "consultancy_user") && (!project.client_id || !project.client_id.trim().length) && !selectedProject) {
            this.setState({
                errorMessage: "Please select client",
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
            this.setState({
                isUploading: false
            });
        }
    };

    updateProject = async () => {
        const { project, initialConsultancyUsers, initialClientUsers } = this.state;
        const { consultancy_user_ids, client_user_ids } = this.state.project
        let tempRemovedUsers = [];
        if (initialConsultancyUsers && initialConsultancyUsers.length) {
            initialConsultancyUsers.map(item => {
                if (!consultancy_user_ids.includes(item)) {
                    tempRemovedUsers.push(item)
                }
            })
        }
        console.log("client_user_ids", initialClientUsers, client_user_ids)

        if (initialClientUsers && initialClientUsers.length) {
            initialClientUsers.map(item => {
                if (!client_user_ids.includes(item)) {
                    tempRemovedUsers.push(item)
                }
            })
        }
        console.log("client_user_ids", client_user_ids)
        await this.setState({
            project: {
                ...project,
                removed_users: tempRemovedUsers
            },
        });
        const { handleUpdateProject } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            if (!findPrevPathFromBreadCrump()) {
                addToBreadCrumpData({
                    key: "main",
                    name: "FCA Projects",
                    path: "/project"
                });
            }
            await handleUpdateProject(this.state.project);
            await this.props.history.push(findPrevPathFromBreadCrump() || "/project");
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
                        message={
                            "This action cannot be reverted, are you sure that you need to cancel?"
                        }
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
        const { history } = this.props;
        await this.setState({
            project: {
                consultancy_user_ids: [],
                client_id: "",
                name: "",
                comments: "",
                region_id: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: []
        });
        popBreadCrumpData();
        if (!findPrevPathFromBreadCrump()) {
            addToBreadCrumpData({ key: "main", name: "FCA Projects", path: "/project" });
        }
        history.push(findPrevPathFromBreadCrump() || "/project");
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
                const acceptableExt = ["xls", "xlsm"];
                if (acceptableExt.includes(ext)) {
                    if (attachment.size < 25000000) {
                        this.setState({
                            attachmentChanged: true,
                            project: {
                                ...this.state.project,
                                fca_sheet: e.target.files[0]
                            }
                        });
                    } else {
                        this.setState({
                            uploadError:
                                "File is too big. Files with size greater than 25MB is not allowed."
                        });
                    }
                } else {
                    this.setState({
                        attachmentChanged: false,
                        uploadError: "* Upload xls or xlsm Files !!!"
                    });
                }
            });
        }
    };

    handleConsultancySelect = async e => {
        const { project } = this.state;
        await this.props.getAllClients({ consultancy_id: project.consultancy_id });
        await this.props.getAllConsultancyUsers({ consultancy_id: project.consultancy_id });
        const {
            projectReducer: {
                getAllClientsResponse: { clients },
                getAllConsultancyUsersResponse: { users: consultancy_users }
            }
        } = this.props;
        await this.setState({
            clients,
            consultancy_users: consultancy_users,
            project: {
                ...project,
                client_id: "",
                region_id: "",
                site_id: "",
                client_user_ids: []
            }
        });
    };

    render() {
        let role = localStorage.getItem("role") || ""
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { clients, project, selectedProject, showErrorBorder, consultancy_users, selectedConsultancyUsers, client_users, selectedClientUsers, consultancies } = this.state;

        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <li className="active">{ selectedProject ? "Edit Project" : "Add Project"} </li>
                        </ul>
                        <div className="tab-active build-dtl">
                            <form autoComplete="nope" >
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            {selectedProject ? (
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Project Code</h4>
                                                        <input
                                                            autoComplete="nope"
                                                            type="text"
                                                            className="custom-input form-control"
                                                            value={project.code || ''}
                                                            readOnly={true}
                                                            placeholder="Enter Project code"
                                                        />
                                                    </div>
                                                </div>
                                            ) : null}
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Project Name *</h4>
                                                    <input
                                                        autoComplete="nope"
                                                        type="text"
                                                        className={`${showErrorBorder && !project.name.trim().length
                                                            ? "error-border "
                                                            : ""
                                                            }custom-input form-control`}
                                                        value={project.name}
                                                        onChange={e =>
                                                            this.setState({
                                                                project: {
                                                                    ...project,
                                                                    name: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Enter Project Name"
                                                    />
                                                </div>
                                            </div>
                                            {role === "super_admin" && !selectedProject ? <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Consultancy *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            autoComplete="nope"
                                                            className={`${showErrorBorder &&
                                                                (!project.consultancy_id ||
                                                                    !project.consultancy_id.trim().length)
                                                                ? "error-border "
                                                                : ""
                                                                }custom-selecbox form-control`}
                                                            onChange={async e => {
                                                                await this.setState({
                                                                    project: {
                                                                        ...project,
                                                                        consultancy_id: e.target.value
                                                                    }
                                                                });
                                                                this.handleConsultancySelect();
                                                            }}
                                                            value={project.consultancy_id}
                                                        >
                                                            <option value="">Select</option>
                                                            {consultancies && consultancies.length
                                                                ? consultancies.map((item, i) => (
                                                                    <option value={item.id} key={i}>
                                                                        {item.name}
                                                                    </option>
                                                                ))
                                                                : null}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div> : null}
                                            {role === "client_user" ? ("") : !selectedProject ? (
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Client *</h4>
                                                        <div className="custom-selecbox">
                                                            <select
                                                                autoComplete="nope"
                                                                className={`${showErrorBorder &&
                                                                    (!project.client_id ||
                                                                        !project.client_id.trim().length)
                                                                    ? "error-border "
                                                                    : ""
                                                                    }custom-selecbox form-control`}
                                                                onChange={async e => {
                                                                    await this.setState({
                                                                        project: {
                                                                            ...project,
                                                                            client_id: e.target.value
                                                                        }
                                                                    });
                                                                    this.handleClientSelect();
                                                                }}
                                                                value={project.client_id}
                                                            >
                                                                <option value="">Select</option>
                                                                {clients && clients.length
                                                                    ? clients.map((item, i) => (
                                                                        <option value={item.id} key={i}>
                                                                            {item.name}
                                                                        </option>
                                                                    ))
                                                                    : null}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null} 
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Client User</h4>
                                                    <div className={`custom-selecbox`}>
                                                        <Multiselect
                                                            autoComplete="nope"
                                                            options={client_users}
                                                            selectedValues={selectedClientUsers}
                                                            onSelect={this.onSelectClientUsers}
                                                            onRemove={this.onSelectClientUsers}
                                                            displayValue="name"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="basic-otr custom-col">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-4 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Consultancy User</h4>
                                                    <div className={`custom-selecbox`}>
                                                        <Multiselect
                                                            autoComplete="nope"
                                                            options={consultancy_users}
                                                            selectedValues={selectedConsultancyUsers}
                                                            onSelect={this.onSelectConsultancyUsers}
                                                            onRemove={this.onSelectConsultancyUsers}
                                                            displayValue="name"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Comments</h4>
                                                    <textarea
                                                        autoComplete="nope"
                                                        placeholder="Comments"
                                                        className="custom-input form-control"
                                                        value={project.comments}
                                                        onChange={e =>
                                                            this.setState({
                                                                project: {
                                                                    ...project,
                                                                    comments: e.target.value
                                                                }
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div className="col-md-12 text-right btnOtr edit-cmn-btn">
                                <button
                                    type="button"
                                    className="btn btn-secondary btnClr col-md-2 mr-1"
                                    data-dismiss="modal"
                                    onClick={() => this.cancelForm()}
                                >
                                    Cancel
                        </button>
                                {this.state.isUploading ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary btnRgion col-md-2"
                                    >
                                        <div className="button-loader d-flex justify-content-center align-items-center">
                                            <div
                                                className="spinner-border text-white"
                                                role="status"
                                            >
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                    </button>
                                ) : selectedProject ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary btnRgion col-md-2"
                                        onClick={() => this.updateProject()}
                                    >
                                        Update Project
                                    </button>
                                ) : (
                                            <button
                                                type="button"
                                                className="btn btn-primary btnRgion col-md-2"
                                                onClick={() => this.addProject()}
                                            >
                                                Add Project
                                            </button>
                                        )}
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

export default withRouter(
    connect(mapStateToProps, { ...projectActions })(From)
);
