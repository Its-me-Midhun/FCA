import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";
import { Multiselect } from "multiselect-react-dropdown";

import userActions from "../actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { EMAIL } from "../../../config/validation";
import ReactTooltip from "react-tooltip";
import { addToBreadCrumpData, popBreadCrumpData, findPrevPathFromBreadCrump, passwordStrengthTooltip } from "../../../config/utils";
import ImageUploadModal from "../../common/components/ImagesModal";
import exclmIcon from "../../../assets/img/recom-icon.svg";
import DropDownModal from "../../users/components/DropDownModal";

class From extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            errorMessage: "",
            roles: "",
            groups: "",
            consultancies: "",
            clients: "",
            projects: "",
            buildings: "",
            user: {
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                first_name: "",
                last_name: "",
                title: "",
                role_id: "",
                group_id: "",
                work_phone: "",
                cell_phone: "",
                room_number: "",
                room_name: "",
                emergency_contact_no: "",
                emergency_contact_name: "",
                notes: "",
                address: "",
                printed_name: "",
                image: "",
                img_desc: "",
                image_name: "",
                project_ids: [],
                building_ids: [],
                city: "",
                location: "",
                state: "",
                credentials: "",
                department: "",
                zip_code: "",
                building_name: "",
                floor: "",
                consultancy_id: "",
                client_id: "",
                default_project: "",
                landing_page_lock: false,
                infrastructure_request: "",
                fmp: ""
            },
            initiaValues: {},
            selectedBuildingType: props.selectedBuildingType,
            showConfirmModal: false,
            showErrorBorder: false,
            imageUploadModal: false,
            selectedImage: "",
            uploadError: "",
            attachmentChanged: false,
            selectedProjects: [],
            selectedBuildings: [],
            perrorMessage: "",
            cerrorMessage: "",
            role_name: "",
            addButton: false,
            user_client: "",
            showSelectModal: false,
            typeOfModal: "",
            passwordVisible: {
                newPassword: false,
                confirmPassword: false
            }
        };
    }

    componentDidMount = async () => {
        await this.props.getAllUserDropdowns();
        const {
            userReducer: {
                getAllRolesDropdownResponse: { roles },
                getAllClientDropdownResponse: { clients },
                getAllProjectsDropdownResponse: { projects },
                getAllBuildingsDropdownResponse: { buildings },
                getAllConsultanciesDropdownResponse: { consultancies }
            }
        } = this.props;
        const { selectedBuildingType } = this.state;
        if (selectedBuildingType) {
            await this.props.getDataById(selectedBuildingType);
            const {
                userReducer: {
                    getUserByIdResponse: {
                        name,
                        email,
                        password,
                        first_name,
                        last_name,
                        title,
                        work_phone,
                        cell_phone,
                        room_number,
                        room_name,
                        emergency_contact_no,
                        emergency_contact_name,
                        notes,
                        role,
                        group,
                        printed_name,
                        address,
                        projects,
                        buildings,
                        city,
                        location,
                        state,
                        credentials,
                        department,
                        image,
                        building_name,
                        floor,
                        zip_code,
                        consultancy,
                        client,
                        default_project,
                        landing_page_lock,
                        success,
                        assetmanagement_client_id,
                        energymanagement_client_id,
                        infrastructure_request,
                        fmp
                    }
                }
            } = this.props;

            if (success) {
                let selectedProjects = [];
                let project_ids = [];
                if (projects.length) {
                    projects.map(item => selectedProjects.push({ name: item.name, id: item.id }));
                    projects.map(item => project_ids.push(item.id));
                }
                let selectedBuildings = [];
                let building_ids = [];
                if (buildings.length) {
                    buildings.map(item => selectedBuildings.push({ name: item.name, id: item.id }));
                    buildings.map(item => building_ids.push(item.id));
                }

                await this.setState({
                    selectedProjects,
                    selectedBuildings,
                    role_name: role.name || "",
                    user: {
                        name,
                        email,
                        password,
                        confirmPassword: password,
                        first_name,
                        last_name,
                        role_id: role.id || "",
                        group_id: group ? group.id : "",
                        consultancy_id: consultancy.id || "",
                        client_id: client ? client.id : "",
                        title,
                        work_phone,
                        cell_phone,
                        room_number,
                        room_name,
                        emergency_contact_no,
                        emergency_contact_name,
                        notes,
                        printed_name,
                        address,
                        project_ids,
                        building_ids,
                        city,
                        location,
                        state,
                        credentials,
                        department,
                        zip_code,
                        building_name,
                        floor,
                        default_project_id: default_project ? default_project.id : "",
                        image: image.id ? image : [],
                        image_id: image ? image.id : "",
                        img_desc: image.description || "",
                        landing_page_lock,
                        assetmanagement_client_id: assetmanagement_client_id?.id,
                        energymanagement_client_id: energymanagement_client_id?.id,
                        infrastructure_request,
                        fmp
                    },
                    previewImage: image?.url || ""
                });
                if (this.state.user.consultancy_id) {
                    this.handleConsultancySelect();
                }
            }
        }

        let tempProjectOptions = [];
        if (projects && projects.length) {
            projects.map(item => tempProjectOptions.push({ name: item.name, id: item.id }));
        }
        let tempBuildingOptions = [];
        if (buildings && buildings.length) {
            buildings.map(item => tempBuildingOptions.push({ name: item.name, id: item.id }));
        }
        await this.setState({
            // initiaValues: tempUser, // originally
            initiaValues: this.state.user, // to avoid popup message on cancellation
            roles,
            clients,
            consultancies,
            projects: tempProjectOptions,
            buildings: tempBuildingOptions,
            isLoading: false
        });
    };

    renderSelectionModal = () => {
        const { showSelectModal } = this.state;
        if (!showSelectModal) return null;

        return (
            <Portal
                body={
                    <DropDownModal
                        selectedProjects={this.state.selectedProjects}
                        selectedBuildings={this.state.selectedBuildings}
                        buildings={this.state.buildings}
                        projects={this.state.projects}
                        typeOfModal={this.state.typeOfModal}
                        onCancel={this.toggleShowFormModal}
                        handleBuildingSelect={this.onSelectBuildings}
                        handleProjectSelect={this.onSelectProjects}
                    />
                }
                onCancel={() => this.setState({ showSelectModal: false })}
            />
        );
    };
    toggleShowFormModal = () => {
        this.setState({
            showSelectModal: !this.state.showSelectModal
        });
    };

    validate = () => {
        const { user } = this.state;
        let regularExpression = /^(?=.{6,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?\W).*$/;
        this.setState({
            showErrorBorder: false
        });
        let currentUser = this.props.match.params.id;
        let userId = localStorage.getItem("userId");
        if (!user.email.trim().length || !EMAIL(user.email)) {
            this.setState({
                errorMessage: "*Invalid Email",
                showErrorBorder: true,
                addButton: false
            });

            return false;
        } else if (!user.name && !user.name.trim().length) {
            this.setState({
                errorMessage: "",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (!user.role_id && !user.role_id.trim().length) {
            this.setState({
                errorMessage: "",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (currentUser !== userId && !user.consultancy_id && !user.consultancy_id.trim().length) {
            this.setState({
                errorMessage: "",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (this.state.role_name === "client_user" && !user.client_id) {
            this.setState({
                errorMessage: "",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (this.state.role_name === "client_user" && user.client_id && !user.client_id.trim().length) {
            this.setState({
                errorMessage: "",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (!this.state.selectedBuildingType && (!user.password.trim().length || !regularExpression.test(user.password))) {
            this.setState({
                perrorMessage: "Please enter valid Password",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (user.password && user.password.trim().length && !regularExpression.test(user.password)) {
            this.setState({
                perrorMessage: "Please enter valid Password",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (user.password && !user.confirmPassword) {
            this.setState({
                cerrorMessage: "Please enter confirm Password",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (user.password && user.confirmPassword && user.password !== user.confirmPassword) {
            this.setState({
                cerrorMessage: "confirm password not matching",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }

        return true;
    };

    addBuildingType = async () => {
        this.setState({ addButton: true });
        const { user } = this.state;
        const { handleAddClient } = this.props;
        if (this.validate()) {
            await handleAddClient(user);
        }
    };

    updateBuildingType = async () => {
        const {
            user: { image, ...rest },
            selectedImage
        } = this.state;
        const { handleUpdateClient } = this.props;
        if (this.validate()) {
            await handleUpdateClient(rest, selectedImage);
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
        if (_.isEqual(this.state.initiaValues, this.state.user)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };
    clearForm = async () => {
        const { history } = this.props;
        this.setState({
            user: {
                name: "",
                email: "",
                password: "",
                first_name: "",
                last_name: "",
                title: "",
                work_phone: "",
                cell_phone: "",
                room_number: "",
                room_name: "",
                emergency_contact_no: "",
                emergency_contact_name: "",
                notes: "",
                address: "",
                printed_name: ""
            }
        });
        if (!findPrevPathFromBreadCrump()) {
            addToBreadCrumpData({ key: "main", name: "User", path: "/user" });
        }
        history.push(findPrevPathFromBreadCrump() || "/user");
        popBreadCrumpData();
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };
    handleAddAttachment = e => {
        this.setState({
            imageUploadModal: true
        });
    };

    onSelectProjects = async selectedProjects => {
        const { user } = this.state;
        let default_project_id = user.default_project_id;
        let tempProjects = [];
        if (selectedProjects.length) {
            selectedProjects.map(item => tempProjects.push(item.id));
        }
        let isProject = false;
        if (default_project_id) {
            isProject = tempProjects && tempProjects.length && tempProjects.find(t => t === default_project_id);
        }
        await this.setState({
            user: {
                ...user,
                project_ids: tempProjects,
                default_project_id: isProject ? default_project_id : ""
            },
            selectedProjects,
            showSelectModal: false
        });
    };

    onSelectBuildings = async selectedBuildings => {
        const { user } = this.state;

        let tempBuildings = [];
        if (selectedBuildings.length) {
            selectedBuildings.map(item => tempBuildings.push(item.id));
        }

        await this.setState({
            user: {
                ...user,
                building_ids: tempBuildings
            },
            selectedBuildings,
            showSelectModal: false
        });
        // this.setState({ showSelectModal: false });
    };

    handleImage = e => {};

    deleteImage = () => {
        this.setState({
            attachmentChanged: true,
            user: {
                ...this.state.user,
                image: null,
                img_desc: null,
                image_id: null,
                image_name: ""
            },
            selectedImage: null,
            previewImage: null
        });
    };

    handleAddImage = imageData => {
        this.setState({
            uploadError: "",
            imageUploadModal: false
        });
        if (!imageData.id) {
            this.setState({
                attachmentChanged: true,
                user: {
                    ...this.state.user,
                    image: imageData.file,
                    img_desc: imageData.comments
                },
                selectedImage: imageData.file,
                previewImage: URL.createObjectURL(imageData.file)
            });
        } else if (imageData.comments) {
            this.setState({
                user: {
                    ...this.state.user,
                    img_desc: imageData.comments
                }
            });
        }
    };

    handleConsultancySelect = async e => {
        const { user } = this.state;
        await this.props.getAllGroupsDropdown(user.consultancy_id);
        await this.props.getAllBuildingsDropdown({ consultancy_id: user.consultancy_id });
        await this.props.getAllProjectsDropdown({ consultancy_id: user.consultancy_id });
        await this.props.getClientsBasedOnRole({ consultancy_id: user.consultancy_id });
        const {
            userReducer: {
                getAllGroupsDropdownResponse: { templates },
                getAllProjectsDropdownResponse: { projects },
                getAllBuildingsDropdownResponse: { buildings },
                getAllClientDropdownResponse: { clients }
            }
        } = this.props;
        await this.setState({
            groups: templates,
            buildings: buildings,
            projects: projects,
            clients: clients
        });
    };

    handleSelectRoleName = async roleId => {
        const { roles } = this.state;
        let temprole = "";
        roles.forEach(item => {
            if (item.id === roleId) {
                temprole = item.name;
                return true;
            }
        });
        await this.setState({
            role_name: temprole
        });
    };

    render() {
        let regularExpression = /^(?=.{6,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?\W).*$/;
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const {
            user,
            selectedBuildingType,
            showErrorBorder,
            roles,
            groups,
            projects,
            selectedProjects,
            buildings,
            selectedBuildings,
            consultancies,
            clients,
            role_name,
            addButton,
            passwordVisible
        } = this.state;
        let currentUser = this.props.match.params.id;
        let userId = localStorage.getItem("userId");
        const userClients = role_name === "client_user" && user.client_id ? clients.filter(c => c.id === user.client_id) : clients;
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    {/* <div className="add-building add-project col-md-8 m-auto"> */}
                    <div className="tab-dtl region-mng usr-pg">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">{selectedBuildingType ? "Edit" : "Add New"} User </li>
                        </ul>

                        <div className="tab-active location-sec recom-sec main-dtl p-0">
                            <form autocomplete="off">
                                <div className="otr-common-edit custom-col">
                                    <div className="row m-0">
                                        <div className="col-md-8 pl-0">
                                            <div className="basic-otr">
                                                <div className="basic-dtl-otr basic-sec p-0">
                                                    <div className="col-md-6 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Email *</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`${
                                                                    showErrorBorder && (!user.email.trim().length || !EMAIL(user.email))
                                                                        ? "error-border "
                                                                        : ""
                                                                }custom-input form-control ${
                                                                    currentUser === userId ? "fc-no-dot cursor-notallowed" : ""
                                                                }`}
                                                                value={user.email}
                                                                disabled={currentUser === userId}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            email: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="Email"
                                                            />
                                                            {this.state.showErrorBorder && this.state.errorMessage ? (
                                                                <span className="errorMessage">{this.state.errorMessage}</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>User Name *</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`${
                                                                    showErrorBorder && !user.name.trim().length ? "error-border " : ""
                                                                }custom-input form-control`}
                                                                value={user.name}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            name: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="User Name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>First Name</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control`}
                                                                value={user.first_name}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            first_name: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="First Name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Last Name</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control`}
                                                                value={user.last_name}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            last_name: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="Last Name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Printed Name</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control`}
                                                                value={user.printed_name}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            printed_name: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="Printed Name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box"></div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Role *</h4>
                                                            <div className="custom-selecbox">
                                                                {role_name === "super_admin" ? (
                                                                    <input
                                                                        autoComplete="nope"
                                                                        type="text"
                                                                        className={`custom-input form-control fc-no-dot cursor-notallowed`}
                                                                        value={role_name}
                                                                        disabled
                                                                        placeholder="Role"
                                                                    />
                                                                ) : (
                                                                    <select
                                                                        autoComplete="nope"
                                                                        className={`${
                                                                            showErrorBorder && !user.role_id.trim().length ? "error-border " : ""
                                                                        }custom-selecbox form-control ${
                                                                            currentUser === userId ? "fc-no-dot cursor-notallowed" : ""
                                                                        }`}
                                                                        disabled={currentUser === userId}
                                                                        onChange={async e => {
                                                                            await this.setState({
                                                                                user: {
                                                                                    ...user,
                                                                                    role_id: e.target.value,
                                                                                    infrastructure_request: "",
                                                                                    fmp: "",
                                                                                    client_id: ""
                                                                                }
                                                                            });
                                                                            await this.handleSelectRoleName(this.state.user.role_id);
                                                                        }}
                                                                        value={user.role_id}
                                                                    >
                                                                        <option value="">Select</option>
                                                                        {roles && roles.length
                                                                            ? roles.map((item, i) => (
                                                                                  <option value={item.id} key={i} name={item.name}>
                                                                                      {item.name}
                                                                                  </option>
                                                                              ))
                                                                            : null}
                                                                    </select>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Consultancy *</h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    autoComplete="nope"
                                                                    className={`${
                                                                        showErrorBorder && !user.consultancy_id.trim().length ? "error-border " : ""
                                                                    }custom-selecbox form-control ${
                                                                        currentUser === userId ? "fc-no-dot cursor-notallowed" : ""
                                                                    }`}
                                                                    disabled={currentUser === userId}
                                                                    onChange={async e => {
                                                                        await this.setState({
                                                                            user: {
                                                                                ...user,
                                                                                consultancy_id: e.target.value,
                                                                                group_id: "",
                                                                                assetmanagement_client_id: "",
                                                                                energymanagement_client_id: "",
                                                                                client_id: ""
                                                                            }
                                                                        });
                                                                        this.handleConsultancySelect();
                                                                    }}
                                                                    value={user.consultancy_id}
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
                                                    </div>

                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>{`Client ${role_name !== "consultancy_user" ? "*" : ""}`}</h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    autoComplete="nope"
                                                                    className={`${
                                                                        showErrorBorder && user.client_id && !user.client_id.trim().length
                                                                            ? "error-border "
                                                                            : ""
                                                                    }custom-selecbox form-control ${
                                                                        currentUser === userId ? "fc-no-dot cursor-notallowed" : ""
                                                                    } ${role_name === "consultancy_user" ? "field-blurred" : ""}`}
                                                                    disabled={currentUser === userId || role_name === "consultancy_user"}
                                                                    onChange={async e => {
                                                                        await this.setState({
                                                                            user: {
                                                                                ...user,
                                                                                client_id: e.target.value,
                                                                                assetmanagement_client_id: "",
                                                                                energymanagement_client_id: ""
                                                                            }
                                                                        });
                                                                    }}
                                                                    value={user.client_id}
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
                                                    <div className="col-md-3 basic-box"></div>
                                                    {currentUser !== userId && (
                                                        <>
                                                            <div className="col-md-3 basic-box">
                                                                <div className="codeOtr">
                                                                    <h4>User Permission</h4>
                                                                    <div className="custom-selecbox">
                                                                        <select
                                                                            autoComplete="nope"
                                                                            className={`custom-selecbox form-control`}
                                                                            onChange={async e => {
                                                                                await this.setState({
                                                                                    user: {
                                                                                        ...user,
                                                                                        group_id: e.target.value
                                                                                    }
                                                                                });
                                                                                // this.handleClientSelect();
                                                                            }}
                                                                            value={user.group_id}
                                                                        >
                                                                            <option value="">Select</option>
                                                                            {groups && groups.length
                                                                                ? groups.map((item, i) => (
                                                                                      <option value={item.id} key={i}>
                                                                                          {item.name}
                                                                                      </option>
                                                                                  ))
                                                                                : null}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3 basic-box">
                                                                <div className="codeOtr">
                                                                    <h4>Associated Projects</h4>
                                                                    <div className={`custom-selecbox-multi`}>
                                                                        <div
                                                                            class="custom-selecbox select-multi-box"
                                                                            onClick={() => {
                                                                                this.setState({
                                                                                    ...this.state,
                                                                                    showSelectModal: true,
                                                                                    typeOfModal: "Associated Projects"
                                                                                });
                                                                            }}
                                                                        >
                                                                            <div class="badge-num"> {selectedProjects.length}</div>
                                                                            <div class="badge-sub-txt">Selected</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3 basic-box">
                                                                <div className="codeOtr">
                                                                    <h4>Buildings</h4>
                                                                    <div className={`custom-selecbox-multi`}>
                                                                        <div
                                                                            class="custom-selecbox select-multi-box"
                                                                            onClick={() => {
                                                                                this.setState({
                                                                                    ...this.state,
                                                                                    showSelectModal: true,
                                                                                    typeOfModal: "Buildings"
                                                                                });
                                                                            }}
                                                                        >
                                                                            <div class="badge-num">{selectedBuildings.length}</div>
                                                                            <div class="badge-sub-txt">Selected</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {this.state.role_name === "client_user" ? (
                                                                <div className="col-md-3 basic-box">
                                                                    <div className="codeOtr d-flex flex-column checkbox-hgt-align">
                                                                        <h4>Infrastructure Request User</h4>
                                                                        <label class="container-check mt-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={user.infrastructure_request === "yes" ? true : false}
                                                                                onChange={e =>
                                                                                    this.setState({
                                                                                        user: {
                                                                                            ...user,
                                                                                            infrastructure_request:
                                                                                                user.infrastructure_request === "yes" ? "no" : "yes"
                                                                                        }
                                                                                    })
                                                                                }
                                                                                name="infrastructure_request"
                                                                            />
                                                                            <span class="checkmark"></span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="col-md-3 basic-box">
                                                                    <div className="codeOtr d-flex flex-column checkbox-hgt-align">
                                                                        <h4>FMP User</h4>
                                                                        <label class="container-check mt-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={user.fmp === "yes" ? true : false}
                                                                                onChange={e =>
                                                                                    this.setState({
                                                                                        user: {
                                                                                            ...user,
                                                                                            fmp: user.fmp === "yes" ? "no" : "yes"
                                                                                        }
                                                                                    })
                                                                                }
                                                                                name="fmp"
                                                                            />
                                                                            <span class="checkmark"></span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}

                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Default Project </h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    autoComplete="nope"
                                                                    className={`custom-selecbox form-control`}
                                                                    onChange={async e => {
                                                                        await this.setState({
                                                                            user: {
                                                                                ...user,
                                                                                default_project_id: e.target.value
                                                                            }
                                                                        });
                                                                    }}
                                                                    value={user.default_project_id}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {currentUser === userId
                                                                        ? projects && projects.length
                                                                            ? projects.map((item, i) => (
                                                                                  <option value={item.id} key={i}>
                                                                                      {item.name}
                                                                                  </option>
                                                                              ))
                                                                            : null
                                                                        : // (selectedProjects && selectedProjects.length
                                                                        //     ? selectedProjects.map((item, i) => (
                                                                        //         <option value={item.id} key={i}>
                                                                        //             {item.name}
                                                                        //         </option>
                                                                        //     ))
                                                                        //     : null)
                                                                        projects && projects.length
                                                                        ? projects.map((item, i) => (
                                                                              <option value={item.id} key={i}>
                                                                                  {item.name}
                                                                              </option>
                                                                          ))
                                                                        : null}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr d-flex flex-column checkbox-hgt-align">
                                                            <h4>Has Landing Page</h4>
                                                            <label class="container-check mt-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={user.landing_page_lock}
                                                                    onChange={e =>
                                                                        this.setState({
                                                                            user: {
                                                                                ...user,
                                                                                landing_page_lock: !user.landing_page_lock
                                                                            }
                                                                        })
                                                                    }
                                                                    name="is_bold"
                                                                />
                                                                <span class="checkmark"></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Asset Mgmt. Client</h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    autoComplete="nope"
                                                                    className={`${
                                                                        showErrorBorder &&
                                                                        user.assetmanagement_client_id &&
                                                                        !user.assetmanagement_client_id.trim().length
                                                                            ? "error-border "
                                                                            : ""
                                                                    }custom-selecbox form-control`}
                                                                    onChange={async e => {
                                                                        await this.setState({
                                                                            user: {
                                                                                ...user,
                                                                                assetmanagement_client_id: e.target.value
                                                                            }
                                                                        });
                                                                    }}
                                                                    value={user.assetmanagement_client_id}
                                                                >
                                                                    <option value="">Select</option>

                                                                    {userClients?.length
                                                                        ? userClients.map((item, i) => (
                                                                              <option value={item.id} key={i}>
                                                                                  {item.name}
                                                                              </option>
                                                                          ))
                                                                        : null}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Energy Mgmt. Client</h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    autoComplete="nope"
                                                                    className={`${
                                                                        showErrorBorder &&
                                                                        user.energymanagement_client_id &&
                                                                        !user.energymanagement_client_id.trim().length
                                                                            ? "error-border "
                                                                            : ""
                                                                    }custom-selecbox form-control`}
                                                                    onChange={async e => {
                                                                        await this.setState({
                                                                            user: {
                                                                                ...user,
                                                                                energymanagement_client_id: e.target.value
                                                                            }
                                                                        });
                                                                    }}
                                                                    value={user.energymanagement_client_id}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {userClients?.length
                                                                        ? userClients.map((item, i) => (
                                                                              <option value={item.id} key={i}>
                                                                                  {item.name}
                                                                              </option>
                                                                          ))
                                                                        : null}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {currentUser !== userId && (
                                                        <>
                                                            <div className="col-md-6 basic-box">
                                                                <div className="codeOtr">
                                                                    <h4>
                                                                        Password *
                                                                        <span
                                                                            className="content-block-card"
                                                                            data-tip={passwordStrengthTooltip}
                                                                            data-multiline={true}
                                                                            data-place="left"
                                                                            data-effect="solid"
                                                                            data-background-color="#4991ff"
                                                                        >
                                                                            <i class="fas fa-info-circle"></i>
                                                                        </span>
                                                                    </h4>
                                                                    <input
                                                                        autoComplete="new-password"
                                                                        // autoComplete="nope"
                                                                        type={passwordVisible.newPassword ? "text" : "password"}
                                                                        className={`${
                                                                            showErrorBorder &&
                                                                            (!this.state.selectedBuildingType || user.password) &&
                                                                            !regularExpression.test(user.password)
                                                                                ? "error-border "
                                                                                : ""
                                                                        }custom-input form-control`}
                                                                        value={user.password}
                                                                        onChange={e =>
                                                                            this.setState({
                                                                                user: {
                                                                                    ...user,
                                                                                    password: e.target.value
                                                                                }
                                                                            })
                                                                        }
                                                                        placeholder="Password"
                                                                    />
                                                                    <div class="eye-icon-outer">
                                                                        <i
                                                                            className={`fa eye-icon ${
                                                                                !passwordVisible.newPassword ? "fa-eye-slash" : "fa-eye"
                                                                            }`}
                                                                            onClick={() => {
                                                                                this.setState({
                                                                                    passwordVisible: {
                                                                                        ...passwordVisible,
                                                                                        newPassword: !passwordVisible.newPassword
                                                                                    }
                                                                                });
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    {this.state.showErrorBorder && this.state.perrorMessage ? (
                                                                        <span className="errorMessage">{this.state.perrorMessage}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 basic-box">
                                                                <div className="codeOtr">
                                                                    <h4>Confirm Password *</h4>
                                                                    <input
                                                                        autoComplete="new-passwoord"
                                                                        type={passwordVisible.confirmPassword ? "text" : "password"}
                                                                        className={`${
                                                                            showErrorBorder &&
                                                                            (!this.state.selectedBuildingType || user.confirmPassword)
                                                                                ? "error-border "
                                                                                : ""
                                                                        }custom-input form-control`}
                                                                        value={user.confirmPassword}
                                                                        onChange={e =>
                                                                            this.setState({
                                                                                user: {
                                                                                    ...user,
                                                                                    confirmPassword: e.target.value
                                                                                }
                                                                            })
                                                                        }
                                                                        placeholder="Confirm Password"
                                                                    />
                                                                    <div class="eye-icon-outer">
                                                                        <i
                                                                            className={`fa eye-icon ${
                                                                                !passwordVisible.confirmPassword ? "fa-eye-slash" : "fa-eye"
                                                                            }`}
                                                                            onClick={() => {
                                                                                this.setState({
                                                                                    passwordVisible: {
                                                                                        ...passwordVisible,
                                                                                        confirmPassword: !passwordVisible.confirmPassword
                                                                                    }
                                                                                });
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    {this.state.showErrorBorder && this.state.cerrorMessage ? (
                                                                        <span className="errorMessage">{this.state.cerrorMessage}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 back-set">
                                            <div className="details-img-block details-img-new">
                                                <>
                                                    {this.state.previewImage ? (
                                                        <>
                                                            <div className="custom-image-upload edit-addtn" onClick={this.handleAddAttachment}>
                                                                <label for="file-input">
                                                                    {this.state.user.image && this.state.user.image.name ? (
                                                                        <i className="fas fa-pencil-alt"></i>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </label>
                                                            </div>
                                                            <img src={`${this.state.previewImage}`} alt="" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="custom-image-upload " onClick={this.handleAddAttachment}>
                                                                <label for="file-input">Add Image</label>
                                                            </div>
                                                            <img src="/img/no-image.png" alt="" />
                                                        </>
                                                    )}
                                                </>
                                                {this.state.imageUploadModal ? (
                                                    <>
                                                        <Portal
                                                            body={
                                                                <ImageUploadModal
                                                                    imageList={this.state.user.image ? [this.state.user.image] : []}
                                                                    img_desc={this.state.user.img_desc ? this.state.user.img_desc : ""}
                                                                    isRecomentaionView={true}
                                                                    handleImage={this.handleImage}
                                                                    handleAddImage={this.handleAddImage}
                                                                    deleteImageRecomention={this.deleteImage}
                                                                    onCancel={() =>
                                                                        this.setState({
                                                                            imageUploadModal: false
                                                                        })
                                                                    }
                                                                />
                                                            }
                                                            onCancel={() =>
                                                                this.setState({
                                                                    imageUploadModal: false
                                                                })
                                                            }
                                                        />{" "}
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    {currentUser === userId ? null : (
                                        <>
                                            <div className="basic-otr mt-3 new-sec">
                                                <div className="basic-dtl-otr basic-sec pl-0 pr-0">
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Title</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control`}
                                                                value={user.title}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            title: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="Title"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Credentials</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control`}
                                                                value={user.credentials}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            credentials: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="Credentials"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Department</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control`}
                                                                value={user.department}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            department: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="Department"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Work Phone</h4>
                                                            <NumberFormat
                                                                autoComplete="nope"
                                                                value={user.work_phone}
                                                                // thousandSeparator={true}
                                                                decimalScale={0}
                                                                className="custom-input form-control"
                                                                placeholder="Work Phone"
                                                                format="(###) ###-####"
                                                                onValueChange={values => {
                                                                    const { value } = values;
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            work_phone: value
                                                                        }
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Cell Phone</h4>
                                                            <NumberFormat
                                                                autoComplete="nope"
                                                                value={user.cell_phone}
                                                                // thousandSeparator={true}
                                                                decimalScale={0}
                                                                className="custom-input form-control"
                                                                placeholder="Cell Phone"
                                                                format="(###) ###-####"
                                                                onValueChange={values => {
                                                                    const { value } = values;
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            cell_phone: value
                                                                        }
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Building Name</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control`}
                                                                value={user.building_name}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            building_name: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="Building Name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Floor</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control`}
                                                                value={user.floor}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            floor: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="Floor"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Room Number</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control`}
                                                                value={user.room_number}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            room_number: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="Room Number"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Room Name</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control`}
                                                                value={user.room_name}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            room_name: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="Room Name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Location</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control`}
                                                                value={user.location}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            location: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="Location"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>City</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control`}
                                                                value={user.city}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            city: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="City"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>State</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control`}
                                                                value={user.state}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            state: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="State"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Zip Code</h4>
                                                            <NumberFormat
                                                                autoComplete="nope"
                                                                value={user.zip_code}
                                                                // thousandSeparator={true}
                                                                decimalScale={0}
                                                                className="custom-input form-control"
                                                                placeholder="Zip Code"
                                                                onValueChange={values => {
                                                                    const { value } = values;
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            zip_code: value
                                                                        }
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Address</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control`}
                                                                value={user.address}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            address: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="Address"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Emergency Contact Number</h4>
                                                            <NumberFormat
                                                                autoComplete="nope"
                                                                value={user.emergency_contact_no}
                                                                // thousandSeparator={true}
                                                                decimalScale={0}
                                                                className="custom-input form-control"
                                                                placeholder="Emergency Contact Number"
                                                                format="(###) ###-####"
                                                                onValueChange={values => {
                                                                    const { value } = values;
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            emergency_contact_no: value
                                                                        }
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Emergency Contact Name</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control`}
                                                                value={user.emergency_contact_name}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            emergency_contact_name: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="Emergency Contact Name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={`col-md-12 basic-box`}>
                                                        <div className="codeOtr">
                                                            <h4>Notes</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control`}
                                                                value={user.notes}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        user: {
                                                                            ...user,
                                                                            notes: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="Notes"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <ReactTooltip />
                                            </div>
                                        </>
                                    )}
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
                                {selectedBuildingType ? (
                                    <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.updateBuildingType()}>
                                        Update User
                                    </button>
                                ) : (
                                    <button
                                        disabled={addButton}
                                        type="button"
                                        className="btn btn-primary btnRgion col-md-2"
                                        onClick={() => this.addBuildingType()}
                                    >
                                        Add New User
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* </div> */}
                </div>
                {this.renderConfirmationModal()}
                {this.renderSelectionModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { userReducer } = state;
    return { userReducer };
};

export default withRouter(connect(mapStateToProps, { ...userActions })(From));
