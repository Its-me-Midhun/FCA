import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import { Multiselect } from "multiselect-react-dropdown";
import qs from "query-string";

import actions from "../actions";
import buildingActions from "../../building/actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { popBreadCrumpOnPageClose, findPrevPathFromBreadCrumpData } from "../../../config/utils";
import NumberFormat from "react-number-format";
import reactCSS from "reactcss";
import { SketchPicker } from "react-color";
import { MultiSelectionModal } from "../../common/components/MultiSelectionModal";
import LoadingOverlay from "react-loading-overlay";

class AdditionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            consultancy_users: [],
            client_users: [],
            addition: {
                name: "",
                comment: "",
                building: "",
                building_id: "",
                consultancy_user_ids: [],
                client_user_ids: [],
                removed_users: [],
                consultancy: "",
                consultancy_id: "",
                client: "",
                client_id: "",
                area: "",
                year: "",
                cost: "",
                crv: "",
                renovation_year: "",
                color_code: "",
                description: "",
                sort_order: ""
            },
            initiaValues: {},
            isNewProject: true,
            selectedConsultancyUsers: [],
            selectedClientUsers: [],
            selectedAddition: props.match.params.id,
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false,
            selectedBuilding: qs.parse(this.props.location.search.b_id) || null,
            initialConsultancyUsers: [],
            initialClientUsers: [],
            showPicker: false,
            multiSelectionModalParams: {}
        };
    }

    componentDidMount = async () => {
        const { selectedAddition } = this.state;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);

        if (selectedAddition) {
            await this.props.getDataById(selectedAddition);
            const {
                buildingAdditionReducer: {
                    getAdditionByIdResponse: {
                        comments,
                        name,
                        users: initial_consultancy_users,
                        area,
                        year,
                        cost,
                        success,
                        client_users: initial_client_users,
                        building,
                        client,
                        consultancy,
                        renovation_year,
                        color_code,
                        sort_order,
                        description,
                        crv
                    }
                }
            } = this.props;

            if (success) {
                await this.props.getAllConsultancyUsers({ consultancy_id: consultancy.id });
                await this.props.getAllClientUsers(client.id);
                const {
                    buildingAdditionReducer: {
                        getAllConsultancyUsersResponse: { users: consultancy_users },
                        getAllClientUsersResponse: { client_users }
                    }
                } = this.props;

                let tempConsultancyUsers = [];
                if (consultancy_users?.length) {
                    consultancy_users.map(item => tempConsultancyUsers.push({ name: item.name, id: item.id }));
                }

                let selectedConsultancyUsers = [];
                let consultancy_user_ids = [];
                if (initial_consultancy_users.length) {
                    initial_consultancy_users.map(item => selectedConsultancyUsers.push({ name: item.name, id: item.id }));
                    initial_consultancy_users.map(item => consultancy_user_ids.push(item.id));
                }

                let selectedClientUsers = [];
                let client_user_ids = [];
                if (initial_client_users.length) {
                    initial_client_users.map(item => selectedClientUsers.push({ name: item.name, id: item.id }));
                    initial_client_users.map(item => client_user_ids.push(item.id));
                }

                await this.setState({
                    consultancy_users: tempConsultancyUsers,
                    client_users,
                    selectedConsultancyUsers,
                    selectedClientUsers,
                    addition: {
                        ...this.state.addition,
                        client: client.name,
                        client_id: client?.id || "",
                        building: building.name,
                        building_id: building.id,
                        consultancy: consultancy.name,
                        consultancy_id: consultancy?.id || "",
                        name,
                        comment: comments,
                        consultancy_user_ids,
                        client_user_ids,
                        area,
                        sort_order,
                        year,
                        cost,
                        renovation_year,
                        description,
                        color_code: color_code || "",
                        crv
                    },
                    initialConsultancyUsers: consultancy_user_ids,
                    initialClientUsers: client_user_ids
                });
            }
        } else {
            await this.props.getBuildingById(query.b_id);
            const {
                buildingReducer: {
                    getBuildingByIdResponse: { client, consultancy, name, client_users: initial_client_users, users: initial_consultancy_users }
                }
            } = this.props;

            await this.props.getAllConsultancyUsers({ consultancy_id: consultancy.id });
            await this.props.getAllClientUsers(client.id);
            const {
                buildingAdditionReducer: {
                    getAllConsultancyUsersResponse: { users: consultancy_users },
                    getAllClientUsersResponse: { client_users }
                }
            } = this.props;

            let tempConsultancyUsers = [];
            if (consultancy_users?.length) {
                consultancy_users.map(item => tempConsultancyUsers.push({ name: item.name, id: item.id }));
            }

            let selectedConsultancyUsers = [];
            let consultancy_user_ids = [];
            if (initial_consultancy_users.length) {
                initial_consultancy_users.map(item => selectedConsultancyUsers.push({ name: item.name, id: item.id }));
                initial_consultancy_users.map(item => consultancy_user_ids.push(item.id));
            }

            let selectedClientUsers = [];
            let client_user_ids = [];
            if (initial_client_users.length) {
                initial_client_users.map(item => selectedClientUsers.push({ name: item.name, id: item.id }));
                initial_client_users.map(item => client_user_ids.push(item.id));
            }

            await this.setState({
                consultancy_users: tempConsultancyUsers,
                client_users,
                addition: {
                    client: client.name,
                    client_id: client ? client.id : "",
                    building: name,
                    building_id: query.b_id,
                    consultancy: consultancy.name,
                    consultancy_id: consultancy ? consultancy.id : "",
                    consultancy_user_ids,
                    client_user_ids
                },
                selectedConsultancyUsers,
                selectedClientUsers
            });
        }

        await this.setState({
            initiaValues: this.state.addition,
            selectedBuilding: query.b_id || this.state.addition.building_id,
            isLoading: false
        });
    };

    validate = () => {
        const { addition, selectedAddition } = this.state;
        let role = localStorage.getItem("role") || "";
        this.setState({
            showErrorBorder: false
        });
        if (!addition.name?.trim().length /*&& !project.project_id*/) {
            this.setState({
                errorMessage: "Please enter addition name",
                showErrorBorder: true
            });
            return false;
        } else if (role === "super_admin" && !addition.consultancy_id && !addition.consultancy_id?.trim().length) {
            this.setState({
                errorMessage: "Please select consultancy",
                showErrorBorder: true
            });
            return false;
        } else if ((role === "super_admin" || role === "consultancy_user") && !addition.client_id && !addition.client_id?.trim().length) {
            this.setState({
                errorMessage: "Please select client",
                showErrorBorder: true
            });
            return false;
        } else if ((role === "super_admin" || role === "consultancy_user") && !addition.building_id && !addition.building_id?.trim().length) {
            this.setState({
                errorMessage: "Please select Building",
                showErrorBorder: true
            });
            return false;
        }
        return true;
    };

    onSelectConsultancyUsers = async selectedConsultancyUsers => {
        const { addition } = this.state;
        let tempUsers = [];
        if (selectedConsultancyUsers.length) {
            selectedConsultancyUsers.map(item => tempUsers.push(item.id));
        }

        await this.setState({
            addition: {
                ...addition,
                consultancy_user_ids: tempUsers
            },
            selectedConsultancyUsers
        });
    };
    onSelectClientUsers = async selectedClientUsers => {
        const { addition } = this.state;
        let tempUsers = [];
        if (selectedClientUsers.length) {
            selectedClientUsers.map(item => tempUsers.push(item.id));
        }

        await this.setState({
            addition: {
                ...addition,
                client_user_ids: tempUsers
            },
            selectedClientUsers
        });
    };
    addAddition = async () => {
        const { addition, selectedBuilding } = this.state;
        const { handleAddAddition } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            await handleAddAddition(selectedBuilding, addition);
            this.setState({
                isUploading: false
            });
        }
    };

    updateAddition = async () => {
        const { addition, selectedBuilding, selectedAddition, initialConsultancyUsers, initialClientUsers } = this.state;

        const addition_id = this.props.match.params.id;
        const { consultancy_user_ids, client_user_ids } = this.state.addition;
        let tempRemovedUsers = [];
        if (initialConsultancyUsers?.length) {
            initialConsultancyUsers.map(item => {
                if (!consultancy_user_ids?.includes(item)) {
                    tempRemovedUsers.push(item);
                }
            });
        }
        if (initialClientUsers?.length) {
            initialClientUsers.map(item => {
                console.log({ item, client_user_ids });
                if (!client_user_ids?.includes(item)) {
                    tempRemovedUsers.push(item);
                }
            });
        }
        await this.setState({
            addition: {
                ...addition,
                removed_users: tempRemovedUsers
            }
        });
        const { handleUpdateAddition, history } = this.props;

        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            await handleUpdateAddition(selectedBuilding, addition_id, this.state.addition);
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
        if (_.isEqual(this.state.initiaValues, this.state.addition)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        const {
            location: { search },
            history
        } = this.props;
        const query = qs.parse(search);

        await this.setState({
            addition: {
                name: "",
                comments: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: []
        });
        popBreadCrumpOnPageClose();
        history.push(findPrevPathFromBreadCrumpData() || `/building/buildinginfo/${query.b_id}/buildingAddition`);
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
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

        const { addition, showErrorBorder, consultancy_users, selectedConsultancyUsers, client_users, selectedClientUsers, showPicker } = this.state;
        const { selectedAddition } = this.props;

        const styles = reactCSS({
            default: {
                color: {
                    width: "40px",
                    height: "15px",
                    borderRadius: "3px",
                    background: addition.color_code,
                    zoom: "107%"
                },
                popover: {
                    position: "absolute",
                    zIndex: "3",
                    left: "69px",
                    top: "-145px"
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
                            <li className="active">{selectedAddition ? "Edit Addition" : "Add Addition"}</li>
                        </ul>
                        <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                            <form autoComplete={"nope"}>
                                <div className="tab-active build-dtl">
                                    <div className="otr-common-edit custom-col">
                                        <div className="basic-otr">
                                            <div className="basic-dtl-otr basic-sec">
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Addition Name *</h4>
                                                        <input
                                                            autoComplete={"nope"}
                                                            type="text"
                                                            className={`${
                                                                showErrorBorder && !addition.name?.trim().length ? "error-border " : ""
                                                            }custom-input form-control`}
                                                            value={addition.name}
                                                            onChange={e =>
                                                                this.setState({
                                                                    addition: {
                                                                        ...addition,
                                                                        name: e.target.value
                                                                    }
                                                                })
                                                            }
                                                            placeholder="Enter Addition Name"
                                                        />
                                                    </div>
                                                </div>
                                                {role === "super_admin" ? (
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Consultancy *</h4>
                                                            <input
                                                                autoComplete={"nope"}
                                                                type="text"
                                                                className={`custom-input form-control cursor-notallowed`}
                                                                value={addition.consultancy}
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>
                                                ) : null}
                                                {role === "client_user" ? (
                                                    ""
                                                ) : (
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Client *</h4>
                                                            <input
                                                                autoComplete={"nope"}
                                                                type="text"
                                                                className={`cursor-notallowed custom-input form-control`}
                                                                value={addition.client}
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Building *</h4>
                                                        <input
                                                            autoComplete={"nope"}
                                                            type="text"
                                                            className={`cursor-notallowed custom-input form-control`}
                                                            value={addition.building}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Description *</h4>
                                                        <input
                                                            autoComplete={"nope"}
                                                            type="text"
                                                            className={`custom-input form-control`}
                                                            value={addition.description}
                                                            onChange={e =>
                                                                this.setState({
                                                                    addition: {
                                                                        ...addition,
                                                                        description: e.target.value
                                                                    }
                                                                })
                                                            }
                                                            // disabled
                                                        />
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
                                                                            addition: {
                                                                                ...addition,
                                                                                color_code: ""
                                                                            }
                                                                        })
                                                                    }
                                                                >
                                                                    <i class="fas fa-times"></i>
                                                                </span>
                                                            </div>
                                                            <div
                                                                style={styles.swatch}
                                                                onClick={() =>
                                                                    this.setState({
                                                                        showPicker: !showPicker
                                                                    })
                                                                }
                                                            >
                                                                <div style={styles.color} />
                                                            </div>
                                                            {showPicker ? (
                                                                <div style={styles.popover}>
                                                                    <div
                                                                        style={styles.cover}
                                                                        onClick={() =>
                                                                            this.setState({
                                                                                showPicker: false
                                                                            })
                                                                        }
                                                                    />
                                                                    <SketchPicker
                                                                        color={addition.color_code}
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
                                                                        onChange={color =>
                                                                            this.setState({
                                                                                addition: {
                                                                                    ...addition,
                                                                                    color_code: color.hex
                                                                                }
                                                                            })
                                                                        }
                                                                    />
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Export Sort Order</h4>
                                                        <NumberFormat
                                                            autocomplete="off"
                                                            value={parseInt(addition.sort_order)}
                                                            thousandSeparator={true}
                                                            decimalScale={0}
                                                            className="custom-input form-control"
                                                            placeholder="Export Sort Order"
                                                            onValueChange={values => {
                                                                const { value } = values;
                                                                this.setState({
                                                                    addition: {
                                                                        ...addition,
                                                                        sort_order: value
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="basic-otr custom-col">
                                            <div className="basic-dtl-otr basic-sec">
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Area (Sq Ft)</h4>
                                                        <NumberFormat
                                                            autocomplete="off"
                                                            value={parseInt(addition.area)}
                                                            thousandSeparator={true}
                                                            decimalScale={0}
                                                            className="custom-input form-control"
                                                            placeholder="Area"
                                                            onValueChange={values => {
                                                                const { value } = values;
                                                                this.setState({
                                                                    addition: {
                                                                        ...addition,
                                                                        area: value,
                                                                        crv: parseFloat(value) * parseFloat(addition.cost || 0)
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Cost</h4>
                                                        <NumberFormat
                                                            autocomplete="off"
                                                            value={addition.cost}
                                                            thousandSeparator={true}
                                                            decimalScale={0}
                                                            className="custom-input form-control"
                                                            placeholder="Cost"
                                                            prefix={addition.cost && addition.cost.length ? "$ " : ""}
                                                            onValueChange={values => {
                                                                const { value } = values;
                                                                this.setState({
                                                                    addition: {
                                                                        ...addition,
                                                                        cost: value,
                                                                        crv: parseFloat(value) * parseFloat(addition.area || 0)
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>CRV</h4>
                                                        <NumberFormat
                                                            autocomplete="off"
                                                            value={addition.crv}
                                                            thousandSeparator={true}
                                                            displayType="text"
                                                            decimalScale={0}
                                                            disabled
                                                            className="custom-input form-control"
                                                            placeholder="crv"
                                                            prefix={addition.crv ? "$ " : ""}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Year Built</h4>
                                                        <NumberFormat
                                                            value={addition.year}
                                                            autocomplete="off"
                                                            thousandSeparator={false}
                                                            className="custom-input form-control"
                                                            placeholder="Year Built"
                                                            format="####"
                                                            onValueChange={values => {
                                                                const { value } = values;
                                                                if (parseInt(value.length) < 6) {
                                                                    this.setState({
                                                                        addition: {
                                                                            ...addition,
                                                                            year: value
                                                                        }
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Year Of Major Renovation</h4>
                                                        <NumberFormat
                                                            value={addition.renovation_year}
                                                            autocomplete="off"
                                                            thousandSeparator={false}
                                                            className="custom-input form-control"
                                                            placeholder="Year Of Major Renovation"
                                                            format="####"
                                                            onValueChange={values => {
                                                                const { value } = values;
                                                                if (parseInt(value.length) < 6) {
                                                                    this.setState({
                                                                        addition: {
                                                                            ...addition,
                                                                            renovation_year: value
                                                                        }
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-4 basic-box comment-form">
                                                    <div className="codeOtr">
                                                        <h4>Comments</h4>
                                                        <textarea
                                                            autoComplete={"nope"}
                                                            placeholder="Comments"
                                                            className="custom-input form-control"
                                                            value={addition.comment}
                                                            onChange={e =>
                                                                this.setState({
                                                                    addition: {
                                                                        ...addition,
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
                                        {selectedAddition ? (
                                            <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.updateAddition()}>
                                                Update Addition
                                            </button>
                                        ) : (
                                            <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.addAddition()}>
                                                Add Addition
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
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
    const { buildingAdditionReducer, buildingReducer } = state;
    return { buildingAdditionReducer, buildingReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions, ...buildingActions })(AdditionForm));
