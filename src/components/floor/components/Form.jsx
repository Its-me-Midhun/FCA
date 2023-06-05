import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import { Multiselect } from "multiselect-react-dropdown";
import qs from "query-string";

import floorActions from "../actions";
import buildingActions from "../../building/actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { popBreadCrumpData, findPrevPathFromBreadCrump } from "../../../config/utils";

class From extends Component {
    constructor(props) {
        super(props);
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            clients: "",
            consultancies: "",
            consultancy_users: [],
            client_users: [],
            buildings: [],
            floor: {
                name: "",
                comment: "",
                building_id: query.b_id,
                consultancy_user_ids: [],
                client_user_ids: [],
                removed_users: [],
                consultancy_id: query.cty_id,
                client_id: query.c_id
            },
            initiaValues: {},
            isNewProject: true,
            selectedClient: {},
            regionList: [],
            siteList: [],
            selectedConsultancyUsers: [],
            selectedClientUsers: [],

            selectedFloor: props.match.params.id,
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false,
            selectedBuilding: qs.parse(this.props.location.search.bid) || null,
            initialConsultancyUsers: [],
            initialClientUsers: []
        };
    }

    componentDidMount = async () => {
        await this.props.getAllConsultanciesDropdown();
        const {
            floorReducer: {
                getAllConsultanciesDropdownResponse: { consultancies }
            }
        } = this.props;

        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const { selectedFloor } = this.props;

        if (selectedFloor) {
            await this.props.getDataById(selectedFloor);
            const {
                floorReducer: {
                    getFloorByIdResponse: { client, comments, name, users, success, client_users, consultancy, building }
                }
            } = this.props;

            if (success) {
                await this.props.getAllBuildingsDropdown({ client_id: client.id, consultancy_id: consultancy.id });
                await this.props.getAllConsultancyUsers({ consultancy_id: consultancy.id });
                await this.props.getAllClientss({ consultancy_id: consultancy.id });
                await this.props.getAllClientUsers(client.id);
                const {
                    floorReducer: {
                        getAllConsultancyUsersResponse: { users: consultancy_users },
                        getAllBuildingsDropdownResponse: { buildings },
                        getAllClientsResponse: { clients },
                        getAllClientUsersResponse: { client_users: all_client_users }
                    }
                } = this.props;
                await this.setState({ consultancy_users, buildings, clients, client_users: all_client_users });

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

                await this.setState({
                    selectedConsultancyUsers,
                    selectedClientUsers,
                    floor: {
                        name,
                        client,
                        client_id: client ? client.id : "",
                        comment: comments,
                        building,
                        building_id: building.id,
                        consultancy_user_ids,
                        client_user_ids,
                        consultancy_id: consultancy ? consultancy.id : ""
                    },
                    initialConsultancyUsers: consultancy_user_ids,
                    initialClientUsers: client_user_ids
                });
            }
        } else {
            const { client_id, consultancy_id } = this.state.floor;
            if (consultancy_id) {
                await this.handleConsultancySelect();
            }
            if (client_id && consultancy_id) {
                await this.handleClientSelect();
            }
            if (this.props.location.state) {
                this.onSelectConsultancyUsers(this.props.location.state?.consultancy_users);
                this.onSelectClientUsers(this.props.location.state?.client_users);
            }
        }

        await this.setState({
            consultancies,
            initiaValues: this.state.floor,
            selectedBuilding: query.b_id || this.state.floor.building_id,
            isLoading: false
        });
    };

    handleClientSelect = async e => {
        const { floor } = this.state;
        await this.props.getAllBuildingsDropdown({ client_id: floor.client_id, consultancy_id: floor.consultancy_id });
        await this.props.getAllClientUsers(floor.client_id);
        const {
            floorReducer: {
                getAllClientUsersResponse: { client_users },
                getAllBuildingsDropdownResponse: { buildings }
            }
        } = this.props;
        await this.setState({
            client_users,
            buildings
        });
    };

    validate = () => {
        const { floor, selectedFloor } = this.state;
        let role = localStorage.getItem("role") || "";
        this.setState({
            showErrorBorder: false
        });
        if (!floor.name.trim().length /*&& !project.project_id*/) {
            this.setState({
                errorMessage: "Please enter floor name",
                showErrorBorder: true
            });
            return false;
        } else if (role === "super_admin" && !floor.consultancy_id && !floor.consultancy_id.trim().length) {
            this.setState({
                errorMessage: "Please select consultancy",
                showErrorBorder: true
            });
            return false;
        } else if ((role === "super_admin" || role === "consultancy_user") && !floor.client_id && !floor.client_id.trim().length) {
            this.setState({
                errorMessage: "Please select client",
                showErrorBorder: true
            });
            return false;
        } else if ((role === "super_admin" || role === "consultancy_user") && !floor.building_id && !floor.building_id.trim().length) {
            this.setState({
                errorMessage: "Please select Building",
                showErrorBorder: true
            });
            return false;
        }
        return true;
    };

    onSelectConsultancyUsers = async selectedConsultancyUsers => {
        const { floor } = this.state;
        let tempUsers = [];
        if (selectedConsultancyUsers.length) {
            selectedConsultancyUsers.map(item => tempUsers.push(item.id));
        }

        await this.setState({
            floor: {
                ...floor,
                consultancy_user_ids: tempUsers
            },
            selectedConsultancyUsers
        });
    };
    onSelectClientUsers = async selectedClientUsers => {
        const { floor } = this.state;
        let tempUsers = [];
        if (selectedClientUsers.length) {
            selectedClientUsers.map(item => tempUsers.push(item.id));
        }

        await this.setState({
            floor: {
                ...floor,
                client_user_ids: tempUsers
            },
            selectedClientUsers
        });
    };
    // onSelectBuilding = async selectedBuildings => {
    //     const { floor } = this.state;
    //     let tempUsers = [];
    //     if (selectedBuildings.length) {
    //         selectedBuildings.map(item => tempUsers.push(item.id));
    //     }

    //     await this.setState({
    //         floor: {
    //             ...floor,
    //             building_id: tempUsers
    //         },
    //         selectedBuildings
    //     });
    // };
    addFloor = async () => {
        const { floor, selectedBuilding } = this.state;
        const { handleAddFloor } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleAddFloor(selectedBuilding, floor);
            this.setState({
                isUploading: false
            });
        }
    };

    updateFloor = async () => {
        const { floor, selectedBuilding, selectedFloor, initialConsultancyUsers, initialClientUsers } = this.state;

        const floor_id = this.props.match.params.id;
        const { consultancy_user_ids, client_user_ids } = this.state.floor;
        let tempRemovedUsers = [];
        if (initialConsultancyUsers && initialConsultancyUsers.length && consultancy_user_ids && consultancy_user_ids.length) {
            initialConsultancyUsers.map(item => {
                if (!consultancy_user_ids.includes(item)) {
                    tempRemovedUsers.push(item);
                }
            });
        }
        if (initialClientUsers && initialClientUsers.length && client_user_ids && client_user_ids.length) {
            initialClientUsers.map(item => {
                if (!client_user_ids.includes(item)) {
                    tempRemovedUsers.push(item);
                }
            });
        }
        await this.setState({
            floor: {
                ...floor,
                removed_users: tempRemovedUsers
            }
        });
        const { handleUpdateFloor, history } = this.props;
        if (!selectedBuilding) {
            history.push(`/floor/floorinfo/${selectedFloor}/basicdetails`);
        }
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleUpdateFloor(selectedBuilding, floor_id, this.state.floor);
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
        if (_.isEqual(this.state.initiaValues, this.state.floor)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        const { history } = this.props;
        const { selectedBuilding, selectedFloor } = this.state;
        await this.setState({
            floor: {
                name: "",
                comments: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: []
        });
        history.push(findPrevPathFromBreadCrump() || "/floor");
        popBreadCrumpData();
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };
    handleConsultancySelect = async e => {
        const { floor } = this.state;
        await this.props.getAllClientss({ consultancy_id: floor.consultancy_id });
        await this.props.getAllConsultancyUsers({ consultancy_id: floor.consultancy_id });
        const {
            floorReducer: {
                getAllClientsResponse: { clients },
                getAllConsultancyUsersResponse: { users: consultancy_users }
            }
        } = this.props;
        await this.setState({
            clients,
            consultancy_users: consultancy_users
        });
    };
    render() {
        let role = localStorage.getItem("role") || "";
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const {
            buildings,
            clients,
            floor,
            showErrorBorder,
            consultancy_users,
            selectedConsultancyUsers,
            client_users,
            selectedClientUsers,
            consultancies
        } = this.state;
        const { selectedFloor } = this.props;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <li className="active">{selectedFloor ? "Edit Floor" : "Add Floor"}</li>
                        </ul>
                        <form autoComplete={"nope"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Floor Name *</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`${
                                                            showErrorBorder && !floor.name.trim().length ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={floor.name}
                                                        onChange={e =>
                                                            this.setState({
                                                                floor: {
                                                                    ...floor,
                                                                    name: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Enter Floor Name"
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
                                                                disabled
                                                                className={`${
                                                                    showErrorBorder && (!floor.consultancy_id || !floor.consultancy_id.trim().length)
                                                                        ? "error-border "
                                                                        : ""
                                                                } cursor-notallowed custom-selecbox form-control`}
                                                                onChange={async e => {
                                                                    await this.setState({
                                                                        floor: {
                                                                            ...floor,
                                                                            consultancy_id: e.target.value
                                                                        }
                                                                    });
                                                                    this.handleConsultancySelect();
                                                                }}
                                                                value={floor.consultancy_id}
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
                                                                disabled
                                                                className={`${
                                                                    showErrorBorder && (!floor.client_id || !floor.client_id.trim().length)
                                                                        ? "error-border "
                                                                        : ""
                                                                } cursor-notallowed custom-selecbox form-control`}
                                                                onChange={async e => {
                                                                    await this.setState({
                                                                        floor: {
                                                                            ...floor,
                                                                            client_id: e.target.value
                                                                        }
                                                                    });
                                                                    this.handleClientSelect();
                                                                }}
                                                                value={floor.client_id}
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
                                                    <h4>Client User</h4>
                                                    <div className={`custom-selecbox`}>
                                                        <Multiselect
                                                            autoComplete={"nope"}
                                                            options={client_users}
                                                            selectedValues={selectedClientUsers}
                                                            onSelect={this.onSelectClientUsers}
                                                            onRemove={this.onSelectClientUsers}
                                                            displayValue="name"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Building *</h4>
                                                    <div className={`custom-selecbox`}>
                                                        <select
                                                            autoComplete={"nope"}
                                                            disabled
                                                            className={`${
                                                                showErrorBorder && (!floor.building_id || !floor.building_id.trim().length)
                                                                    ? "error-border "
                                                                    : ""
                                                            } cursor-notallowed custom-selecbox form-control`}
                                                            onChange={async e => {
                                                                await this.setState({
                                                                    floor: {
                                                                        ...floor,
                                                                        building_id: e.target.value
                                                                    }
                                                                });
                                                            }}
                                                            value={floor.building_id}
                                                        >
                                                            <option value="">Select</option>
                                                            {buildings && buildings.length
                                                                ? buildings.map((item, i) => (
                                                                      <option value={item.id} key={i}>
                                                                          {item.name}
                                                                      </option>
                                                                  ))
                                                                : null}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="basic-otr custom-col">
                                        <div className="basic-dtl-otr basic-sec">
                                            {role === "client_user" ? (
                                                ""
                                            ) : (
                                                <div className="col-md-4 basic-box comment-form">
                                                    <div className="codeOtr">
                                                        <h4>Consultancy User</h4>
                                                        <div className={`custom-selecbox`}>
                                                            <Multiselect
                                                                autoComplete={"nope"}
                                                                options={consultancy_users}
                                                                selectedValues={selectedConsultancyUsers}
                                                                onSelect={this.onSelectConsultancyUsers}
                                                                onRemove={this.onSelectConsultancyUsers}
                                                                displayValue="name"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="col-md-4 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Comments</h4>
                                                    <textarea
                                                        autoComplete={"nope"}
                                                        placeholder="Comments"
                                                        className="custom-input form-control"
                                                        value={floor.comment}
                                                        onChange={e =>
                                                            this.setState({
                                                                floor: {
                                                                    ...floor,
                                                                    comment: e.target.value
                                                                }
                                                            })
                                                        }
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
                                    {selectedFloor ? (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.updateFloor()}>
                                            Update Floor
                                        </button>
                                    ) : (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.addFloor()}>
                                            Add Floor
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
    const { floorReducer } = state;
    return { floorReducer };
};

export default withRouter(connect(mapStateToProps, { ...floorActions, ...buildingActions })(From));
