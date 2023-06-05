import React, { Component } from "react";
import { connect } from "react-redux";
import { Multiselect } from "multiselect-react-dropdown";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import qs from "query-string";
import reactCSS from "reactcss";
import regionActions from "../actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { popBreadCrumpData, findPrevPathFromBreadCrump, addToBreadCrumpData } from "../../../config/utils";
import exclmIcon from "../../../assets/img/recom-icon.svg";
import { SketchPicker } from "react-color";
import { MultiSelectionModal } from "../../common/components/MultiSelectionModal";
import LoadingOverlay from "react-loading-overlay";

class Form extends Component {
    constructor(props) {
        super(props);
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        this.state = {
            isLoading: true,
            errorMessage: "",
            clients: "",
            consultancy_users: [],
            consultancies: "",
            client_users: [],
            region: {
                consultancy_user_ids: [],
                client_user_ids: [],

                project_ids: [],
                client_id: query.c_id || "",

                consultancy_id: query.cty_id || "",
                name: "",
                code: "",
                comments: "",
                removed_users: [],
                color_code: ""
            },
            showPicker: false,
            initiaValues: {},
            showErrorBorder: false,
            selectedConsultancyUsers: [],
            selectedClientUsers: [],
            selectedRegion: props.match.params.id,
            showConfirmModal: false,
            initialConsultancyUsers: [],
            initialClientUsers: [],
            AllProjects: "",
            selectedProjects: [],
            addButton: false,
            multiSelectionModalParams: {}
        };
    }

    componentDidMount = async () => {
        await this.props.getAllDropdowns();
        const {
            regionReducer: {
                //getAllConsultancyUsersResponse: { users: consultancy_users },
                getAllClientsResponse: { clients },
                getAllConsultanciesDropdownResponse: { consultancies }
            }
        } = this.props;

        let role = localStorage.getItem("role");
        if (role === "client_user") {
            await this.props.getAllClientUsers();
            await this.props.getProjectsBasedOnClient("");
            const {
                regionReducer: {
                    getAllClientUsersResponse: { client_users },
                    getProjectsBasedOnClientResponse: { projects: AllProjects }
                }
            } = this.props;

            await this.setState({
                client_users,
                AllProjects
            });
        }
        if (this.state.region.consultancy_id && role === "super_admin") {
            await this.props.getAllClients({ consultancy_id: this.state.region.consultancy_id });
            await this.props.getProjectsBasedOnClient({ client_id: this.state.region.client_id });
            const {
                regionReducer: {
                    getAllClientsResponse: { clients },
                    getProjectsBasedOnClientResponse: { projects: AllProjects }
                }
            } = this.props;
            await this.setState({
                clients,
                AllProjects,
                // -----------for defaultproject----------
                selectedProjects: AllProjects,
                region: {
                    ...this.state.region,
                    project_ids: this.state.selectedProjects ? AllProjects && AllProjects[0].id : []
                }
                // --------------------------
            });
        }
        const { selectedRegion } = this.state;
        if (selectedRegion) {
            await this.props.getDataById(selectedRegion);
            const {
                regionReducer: {
                    getRegionByIdResponse: { client, users, code, comments, client_users, name, consultancy, color_code, success, projects }
                }
            } = this.props;

            if (success) {
                await this.props.getAllConsultancyUsers({ consultancy_id: consultancy.id });
                const {
                    regionReducer: {
                        getAllConsultancyUsersResponse: { users: consultancy_users }
                    }
                } = this.props;
                let tempUserOptions = [];
                if (consultancy_users && consultancy_users.length) {
                    consultancy_users.map(item => tempUserOptions.push({ name: item.name, id: item.id }));
                }
                await this.setState({ consultancy_users: tempUserOptions });

                if (role === "super_admin") {
                    await this.props.getAllClients({ consultancy_id: consultancy.id });
                    const {
                        regionReducer: {
                            getAllClientsResponse: { clients }
                        }
                    } = this.props;
                    await this.setState({ clients });
                }
                await this.props.getAllClientUsers(client.id);
                const {
                    regionReducer: {
                        getAllClientUsersResponse: { client_users: clientusers }
                    }
                } = this.props;
                await this.props.getProjectsBasedOnClient({ client_id: client.id });
                const {
                    regionReducer: {
                        getProjectsBasedOnClientResponse: { projects: AllProjects }
                    }
                } = this.props;
                await this.setState({
                    AllProjects
                });
                let selectedConsultancyUsers = [];
                let consultancy_user_ids = [];
                if (users.length) {
                    users.map(item => selectedConsultancyUsers.push({ name: item.name, id: item.id }));
                    users.map(item => consultancy_user_ids.push(item.id));
                }
                let selectedClientUsers = [];
                let client_user_ids = [];
                if (client_users.length) {
                    client_users.map(item => selectedClientUsers.push({ name: item.name, id: item.id }));
                    client_users.map(item => client_user_ids.push(item.id));
                }

                let selectedProjects = [];
                let project_ids = [];
                if (projects.length) {
                    projects.map(item => selectedProjects.push({ name: item.name, id: item.id }));
                    projects.map(item => project_ids.push(item.id));
                }
                await this.setState({
                    selectedConsultancyUsers,
                    selectedClientUsers,
                    selectedProjects,
                    consultancy_users: consultancy_users,
                    client_users: clientusers,
                    region: {
                        client_id: client.id,
                        consultancy_user_ids,
                        client_user_ids,
                        consultancy_id: consultancy ? consultancy.id : "",
                        project_ids,
                        name,
                        code,
                        comments,
                        color_code: color_code || ""
                    },
                    initialConsultancyUsers: consultancy_user_ids,
                    initialClientUsers: client_user_ids
                });
            }
        }

        if (role === "consultancy_user") {
            await this.setState({ clients });
        }
        await this.setState({
            consultancies,
            initiaValues: this.state.region,
            //consultancy_users: tempUserOptions,
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
            region: {
                ...this.state.region,
                color_code: color.hex
            }
        });
    };
    onSelectConsultancyUsers = async selectedConsultancyUsers => {
        const { region } = this.state;
        let tempUsers = [];
        if (selectedConsultancyUsers.length) {
            selectedConsultancyUsers.map(item => tempUsers.push(item.id));
        }

        await this.setState({
            region: {
                ...region,
                consultancy_user_ids: tempUsers
            },
            selectedConsultancyUsers
        });
    };
    onSelectClientUsers = async selectedClientUsers => {
        const { region } = this.state;
        let tempUsers = [];
        if (selectedClientUsers.length) {
            selectedClientUsers.map(item => tempUsers.push(item.id));
        }

        await this.setState({
            region: {
                ...region,
                client_user_ids: tempUsers
            },
            selectedClientUsers
        });
    };

    handleClientSelect = async e => {
        const { region } = this.state;
        await this.props.getAllClientUsers(region.client_id);
        const {
            regionReducer: {
                getAllClientUsersResponse: { client_users }
            }
        } = this.props;
        await this.props.getProjectsBasedOnClient({ client_id: region.client_id });
        const {
            regionReducer: {
                getProjectsBasedOnClientResponse: { projects: AllProjects }
            }
        } = this.props;
        await this.setState({
            AllProjects,
            client_users,
            region: {
                ...region,
                client_user_ids: [],
                project_ids: ""
            }
        });
    };

    validate = () => {
        const { region } = this.state;
        let role = localStorage.getItem("role") || "";
        this.setState({
            showErrorBorder: false
        });
        if (!region.name.trim().length) {
            this.setState({
                errorMessage: "Please enter region name",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (role === "super_admin" && !region.consultancy_id.trim().length) {
            this.setState({
                errorMessage: "Please select consultancy",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if ((role === "super_admin" || role === "consultancy_user") && !region.client_id.trim().length) {
            this.setState({
                errorMessage: "Please select client",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }
        return true;
    };

    addRegion = async () => {
        this.setState({ addButton: true });
        const { region } = this.state;
        const { handleAddRegion } = this.props;
        if (this.validate()) {
            popBreadCrumpData();
            await handleAddRegion(region);
        }
    };

    updateRegion = async () => {
        const { region, initialConsultancyUsers, initialClientUsers } = this.state;
        const { consultancy_user_ids, client_user_ids } = this.state.region;
        let tempRemovedUsers = [];
        if (initialConsultancyUsers && initialConsultancyUsers.length) {
            initialConsultancyUsers.map(item => {
                if (!consultancy_user_ids.includes(item)) {
                    tempRemovedUsers.push(item);
                }
            });
        }
        if (initialClientUsers && initialClientUsers.length) {
            initialClientUsers.map(item => {
                if (!client_user_ids.includes(item)) {
                    tempRemovedUsers.push(item);
                }
            });
        }
        await this.setState({
            region: {
                ...region,
                removed_users: tempRemovedUsers
            }
        });
        const { handleUpdateRegion } = this.props;

        // if (this.validate()) {
        //     popBreadCrumpData();
        //     if (!findPrevPathFromBreadCrump()) {
        //         addToBreadCrumpData({
        //             key: "main",
        //             name: "Regions",
        //             path: "/region"
        //         });
        //     }

        //     await handleUpdateRegion(this.state.region);
        //     //this.props.history.push(findPrevPathFromBreadCrump() || "/region");
        // }

        if (this.validate()) {
            if (!findPrevPathFromBreadCrump()) {
                addToBreadCrumpData({
                    key: "main",
                    name: "Regions",
                    path: "/region"
                });
            }

            await handleUpdateRegion(this.state.region);
            this.props.history.push(findPrevPathFromBreadCrump() || "/region");
            popBreadCrumpData();
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
        if (_.isEqual(this.state.initiaValues, this.state.region)) {
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
            region: {
                consultancy_user_ids: [],
                client_id: "",
                name: "",
                comments: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: [],
            showConfirmModal: false
        });

        if (!findPrevPathFromBreadCrump()) {
            addToBreadCrumpData({ key: "main", name: "Regions", path: "/region" });
        }
        history.push(findPrevPathFromBreadCrump() || "/region");
        popBreadCrumpData();
    };

    onSelectProjects = async selectedProjects => {
        const { region } = this.state;
        let tempProjects = [];
        if (selectedProjects.length) {
            selectedProjects.map(item => tempProjects.push(item.id));
        }
        await this.setState({
            region: {
                ...region,
                project_ids: tempProjects
            },
            selectedProjects
        });
    };

    handleConsultancySelect = async e => {
        const { region } = this.state;
        await this.props.getAllClients({ consultancy_id: region.consultancy_id });
        await this.props.getAllConsultancyUsers({ consultancy_id: region.consultancy_id });
        const {
            regionReducer: {
                getAllClientsResponse: { clients },
                getAllConsultancyUsersResponse: { users: consultancy_users }
            }
        } = this.props;
        await this.setState({
            clients,
            consultancy_users: consultancy_users,
            region: {
                ...region,
                client_id: "",
                client_user_ids: []
            }
        });
    };
    renderMultiSelectionModal = () => {
        const { multiSelectionModalParams } = this.state;
        if (!multiSelectionModalParams.show) return null;
        const { heading, options, onSelection, selectedValues } = multiSelectionModalParams || {};
        return (
            <Portal
                body={
                    <MultiSelectionModal
                        currentSelection={selectedValues}
                        options={options}
                        heading={heading}
                        onCancel={this.cancelMultiSelectionModal}
                        onSelection={onSelection}
                    />
                }
                onCancel={this.cancelMultiSelectionModal}
            />
        );
    };

    setMultiSelectionModalParams = params => {
        this.setState({
            multiSelectionModalParams: params
        });
    };

    cancelMultiSelectionModal = () => {
        this.setState({
            multiSelectionModalParams: { show: false }
        });
    };
    render() {
        let role = localStorage.getItem("role") || "";
        const { isLoading } = this.state;
        // if (isLoading) return <Loader />;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const {
            clients,
            consultancy_users,
            region,
            selectedConsultancyUsers,
            selectedRegion,
            showErrorBorder,
            AllProjects,
            selectedProjects,
            client_users,
            selectedClientUsers,
            consultancies,
            addButton
        } = this.state;
        const styles = reactCSS({
            default: {
                color: {
                    width: "40px",
                    height: "15px",
                    borderRadius: "3px",
                    background: this.state.region.color_code,
                    zoom: "107%"
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
                            <li className="active pl-4">{selectedRegion ? "Edit Region" : "Add Region"}</li>
                        </ul>
                        <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                            <div className="tab-active build-dtl">
                                <form autoComplete={"nope"}>
                                    <div className="otr-common-edit custom-col">
                                        <div className="basic-otr">
                                            <div className="basic-dtl-otr basic-sec">
                                                {selectedRegion ? (
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Region Code</h4>
                                                            <input
                                                                autoComplete={"nope"}
                                                                autoFill={"off"}
                                                                type="text"
                                                                className="custom-input form-control"
                                                                value={region.code || ""}
                                                                readOnly={true}
                                                                placeholder="Enter Region code"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : null}
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Region Name *</h4>
                                                        <input
                                                            autoComplete={"nope"}
                                                            type="text"
                                                            className={`${
                                                                showErrorBorder && !region.name.trim().length ? "error-border " : ""
                                                            }custom-input form-control`}
                                                            value={region.name}
                                                            onChange={e =>
                                                                this.setState({
                                                                    region: {
                                                                        ...region,
                                                                        name: e.target.value
                                                                    }
                                                                })
                                                            }
                                                            placeholder="Enter Region Name"
                                                        />
                                                    </div>
                                                </div>
                                                {role === "super_admin" ? (
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Consultancy *</h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    autoComplete={"nope"}
                                                                    disabled={query.cty_id ? true : false}
                                                                    className={`${
                                                                        showErrorBorder &&
                                                                        (!region.consultancy_id || !region.consultancy_id.trim().length)
                                                                            ? "error-border "
                                                                            : ""
                                                                    } ${
                                                                        query.cty_id ? "custom-selecbox cursor-notallowed" : "custom-selecbox"
                                                                    }  form-control`}
                                                                    onChange={async e => {
                                                                        await this.setState({
                                                                            region: {
                                                                                ...region,
                                                                                consultancy_id: e.target.value
                                                                            }
                                                                        });
                                                                        this.handleConsultancySelect();
                                                                    }}
                                                                    value={region.consultancy_id}
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
                                                ) : null}
                                                {role === "client_user" ? (
                                                    ""
                                                ) : (
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Client *</h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    autoComplete={"nope"}
                                                                    disabled={query.c_id ? true : false}
                                                                    className={`${
                                                                        showErrorBorder && !region.client_id.trim().length ? "error-border " : ""
                                                                    }
                                                            ${query.c_id ? "custom-selecbox cursor-notallowed" : "custom-selecbox"} form-control`}
                                                                    onChange={async e => {
                                                                        await this.setState({
                                                                            region: {
                                                                                ...region,
                                                                                client_id: e.target.value
                                                                            }
                                                                        });
                                                                        this.handleClientSelect();
                                                                    }}
                                                                    value={region.client_id}
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
                                                )}
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Associated Projects</h4>
                                                        <div
                                                            class="custom-selecbox select-multi-box"
                                                            onClick={() =>
                                                                this.setMultiSelectionModalParams({
                                                                    show: true,
                                                                    selectedValues: selectedProjects,
                                                                    heading: "Associated Projects",
                                                                    options: AllProjects,
                                                                    onSelection: this.onSelectProjects
                                                                })
                                                            }
                                                        >
                                                            <div class="badge-num"> {selectedProjects.length}</div>
                                                            <div class="badge-sub-txt">Selected</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {role !== "client_user" && (
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Consultancy User</h4>
                                                            <div
                                                                class="custom-selecbox select-multi-box"
                                                                onClick={() =>
                                                                    this.setMultiSelectionModalParams({
                                                                        show: true,
                                                                        selectedValues: selectedConsultancyUsers,
                                                                        heading: "Consultancy Users",
                                                                        options: consultancy_users,
                                                                        onSelection: this.onSelectConsultancyUsers
                                                                    })
                                                                }
                                                            >
                                                                <div class="badge-num"> {selectedConsultancyUsers.length}</div>
                                                                <div class="badge-sub-txt">Selected</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Client User</h4>
                                                        <div
                                                            class="custom-selecbox select-multi-box"
                                                            onClick={() =>
                                                                this.setMultiSelectionModalParams({
                                                                    show: true,
                                                                    selectedValues: selectedClientUsers,
                                                                    heading: "Client Users",
                                                                    options: client_users,
                                                                    onSelection: this.onSelectClientUsers
                                                                })
                                                            }
                                                        >
                                                            <div class="badge-num"> {selectedClientUsers.length}</div>
                                                            <div class="badge-sub-txt">Selected</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Color</h4>
                                                        <div>
                                                            <div class="close-icon-right position-relative">
                                                                <span
                                                                    onClick={e =>
                                                                        this.setState({
                                                                            region: {
                                                                                ...region,
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
                                                                        color={this.state.region.color_code}
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
                                                <div className="col-md-4 basic-box comment-form">
                                                    <div className="codeOtr">
                                                        <h4>Comments</h4>
                                                        <textarea
                                                            autoComplete={"nope"}
                                                            placeholder="Comments"
                                                            className="custom-input form-control"
                                                            value={region.comments}
                                                            onChange={e =>
                                                                this.setState({
                                                                    region: {
                                                                        ...region,
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
                                    {selectedRegion ? (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.updateRegion()}>
                                            Update Region
                                        </button>
                                    ) : (
                                        <button
                                            disabled={addButton}
                                            type="button"
                                            className="btn btn-primary btnRgion col-md-2"
                                            onClick={() => this.addRegion()}
                                        >
                                            Add New Region
                                        </button>
                                    )}
                                </div>
                            </div>
                        </LoadingOverlay>
                    </div>
                </div>
                {this.renderMultiSelectionModal()}
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { regionReducer } = state;
    return { regionReducer };
};

export default withRouter(connect(mapStateToProps, { ...regionActions })(Form));
