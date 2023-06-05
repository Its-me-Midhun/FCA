import React, { Component } from "react";
import { connect } from "react-redux";
import { Multiselect } from "multiselect-react-dropdown";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import NumberFormat from "react-number-format";


import regionActions from "../../region/actions";
import initativeAction from "../actions";

import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { popBreadCrumpData, findPrevPathFromBreadCrump, addToBreadCrumpData } from "../../../config/utils";
import exclmIcon from "../../../assets/img/recom-icon.svg";

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            errorMessage: "",
            clients: "",
            consultancy_users: [],
            consultancies: "",
            client_users: [],
            initiative: {
                name: null,
                performed_by: "",
                status: "pending",
                initiative_type: [],
                identifier: "",
                actual_cost: "",
                client_id: "",
                consultancy_id: "",
                project_id: "",
                funding: "",
                total_sf: "",
                description: "",
                note: "",
                recommendations_cost: "",
                recommendations_count: "",


            },
            initiaValues: {},
            showErrorBorder: false,
            selectedConsultancyUsers: [],
            selectedClientUsers: [],
            selectedInitiative: props.match.params.tab,
            showConfirmModal: false,
            initialConsultancyUsers: [],
            initialClientUsers: [],
            AllProjects: "",
            selectedProjects: [],
            addButton: false,
            isSubmit:false
        };
    }

    componentDidMount = async () => {
        await this.props.getAllDropdowns();
        await this.props.getAllProjectsDropdown()
        const {
            regionReducer: {
                //getAllConsultancyUsersResponse: { users: consultancy_users },
                getAllClientsResponse: { clients },
                getAllConsultanciesDropdownResponse: { consultancies }
            },
            // initativeReducer: {
            //     getAllProjectsDropdown
            // }
        } = this.props;


        let role = localStorage.getItem("role");
        const { selectedInitiative } = this.state;
        if (selectedInitiative) {

            await this.props.getInitiativeById(selectedInitiative);
            const {
                initativeReducer: {
                    getInitiativeById: {
                        code,
                        name,
                        performed_by,
                        status,
                        initiative_type,
                        actual_cost,
                        client,
                        consultancy,
                        project,
                        funding,
                        total_sf,
                        identifier,
                        recommendations_cost,
                        recommendations_count,
                        description,
                        note,
                        success
                    }
                }
            } = this.props;

            if (success) {

                await this.props.getAllConsultancyUsers({ consultancy_id: consultancy.id });
                const {
                    regionReducer: {
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
                        regionReducer: {
                            getAllClientsResponse: { clients }
                        }
                    } = this.props;
                    await this.setState({ clients })
                    await this.props.getAllProjectsDropdown({ client_id: client.id });
                }

                await this.setState({

                    initiative: {
                        code,
                        name,
                        performed_by,
                        status,
                        initiative_type: initiative_type ? initiative_type.split(",") : [],
                        actual_cost,
                        client_id: client.id,
                        consultancy_id: consultancy.id,
                        project_id: project.id,
                        funding,
                        total_sf,
                        identifier,
                        description,
                        note,
                        recommendations_cost,
                        recommendations_count,

                    },

                });
            }
        }


        if (role === "consultancy_user") {
            await this.setState({ clients })
        }
        await this.setState({
            consultancies,
            initiaValues: this.state.initiative,
            //consultancy_users: tempUserOptions,
            isLoading: false
        });
    };





    validate = () => {
        const { initiative } = this.state;
        let role = localStorage.getItem("role") || ""
        this.setState({
            showErrorBorder: false
        });
        if ((!initiative.name || (initiative.name && !initiative.name.trim().length))) {
            this.setState({
                errorMessage: "Please enter initiative name",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }
        else if (role == "super_admin" && (!initiative.consultancy_id || (initiative.consultancy_id && !initiative.consultancy_id.trim().length))) {
            this.setState({
                errorMessage: "Please select consultancy",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }
        else if ((role === "consultancy_user" || role == "super_admin") && (!initiative.client_id || (initiative.client_id && !initiative.client_id.trim().length))) {
            this.setState({
                errorMessage: "Please select client",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }
        else if (!initiative.project_id || (initiative.project_id && !initiative.project_id.trim().length)) {
            this.setState({
                errorMessage: "Please select Project",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }
        return true;
    };

    addInitiative = async () => {
        this.setState({ addButton: true })
        const { initiative } = this.state;
        const { handleAddInitiataive } = this.props;
        if (this.validate()) {
            this.setState({
                isSubmit:true
            })
            popBreadCrumpData();
            await handleAddInitiataive(initiative);
            this.setState({
                isSubmit:false
            })
        }
    };

    updateInitiative = async () => {

        const { handleUpdateInitiataive } = this.props;
        if (this.validate()) {
            this.setState({
                isSubmit:true
            })
            popBreadCrumpData();
            if (!findPrevPathFromBreadCrump()) {
                addToBreadCrumpData({
                    key: "initiatives",
                    name: "Project Initiatives",
                    path: `/initiatives`
                });
            }

            await handleUpdateInitiataive(this.state.initiative);
            this.setState({
                isSubmit:false
            })
            //this.props.history.push(findPrevPathFromBreadCrump() || "/initiative");
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
        if (_.isEqual(this.state.initiaValues, this.state.initiative)) {
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
            initiative: {
                name: "",
                performed_by: "",
                status: "pending",
                initiative_type: [],
                actual_cost: "",
                client_id: "",
                consultancy_id: "",
                project_id: "",
                funding: "",
                total_sf: "",
                identifier: "",
                description: "",
                note: "",
                recommendations_cost: "",
                recommendations_count: ""

            },
            selectedClient: {},
            selectedConsultancyUsers: [],
            showConfirmModal: false
        });

        if (!findPrevPathFromBreadCrump()) {
            addToBreadCrumpData({
                key: "initiatives",
                name: "Project Initiatives",
                path: `/initiatives`
            });
        }
        history.push(findPrevPathFromBreadCrump() || "/initiatives");
        popBreadCrumpData();
    };

    handleConsultancySelect = async e => {
        const { initiative } = this.state;
        await this.props.getAllClients({ consultancy_id: initiative.consultancy_id });
        await this.props.getAllConsultancyUsers({ consultancy_id: initiative.consultancy_id });
        const {
            regionReducer: {
                getAllClientsResponse: { clients },
                getAllConsultancyUsersResponse: { users: consultancy_users }
            }
        } = this.props;
        await this.setState({
            clients,
            consultancy_users: consultancy_users,
            initiative: {
                ...initiative,
                client_id: "",
            }
        });
    };


    handleClientSelect = async e => {
        const { initiative } = this.state;
        await this.props.getAllProjectsDropdown({ client_id: initiative.client_id });
    };

    render() {
        let role = localStorage.getItem("role") || ""
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;
        const { getAllProjectsDropdown } = this.props.initativeReducer
        const { clients, consultancy_users, initiative, selectedConsultancyUsers, selectedInitiative, showErrorBorder, AllProjects, selectedProjects, client_users, selectedClientUsers, consultancies, addButton } = this.state;
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">{ selectedInitiative? "Edit Initiative" :  "Add Initiative" }</li>
                        </ul>
                        <div className="tab-active build-dtl">
                            <form autoComplete={"nope"} >

                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            {selectedInitiative ? (
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>initiative Code</h4>
                                                        <input
                                                            autoComplete={"nope"}
                                                            autoFill={"off"}
                                                            type="text"
                                                            className="custom-input form-control"
                                                            value={initiative.code || ''}
                                                            readOnly={true}
                                                            placeholder="Enter initiative code"
                                                        />
                                                    </div>
                                                </div>
                                            ) : null}
                                            <div className="col-md-4 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Initiative Identifier</h4>

                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`custom-input form-control`}
                                                        value={initiative.identifier}
                                                        onChange={e =>
                                                            this.setState({
                                                                initiative: {
                                                                    ...initiative,
                                                                    identifier: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Enter Identifier"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>initiative Name *</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`${showErrorBorder &&
                                                            (!initiative.name || (initiative.name && !initiative.name.trim().length)) ? "error-border " : ""}custom-input form-control`}
                                                        value={initiative.name}
                                                        onChange={e =>
                                                            this.setState({
                                                                initiative: {
                                                                    ...initiative,
                                                                    name: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Enter initiative Name"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-4 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Performed By</h4>

                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`custom-input form-control`}
                                                        value={initiative.performed_by}
                                                        onChange={e =>
                                                            this.setState({
                                                                initiative: {
                                                                    ...initiative,
                                                                    performed_by: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Enter Performed By"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="form-group">
                                                    <h4>Initiative Type</h4>
                                                    <div className="rem-txt">
                                                        <label className="container-check">
                                                            Vendor
                                                          <input type="checkbox" name="initiative_type"
                                                                checked={this.state.initiative.initiative_type.find(i => i == "vendor") ? true : false}
                                                                onChange={e => {
                                                                    const { initiative_type } = this.state.initiative
                                                                    let temp = initiative_type
                                                                    if (e.target.checked) {
                                                                        temp.push("vendor")
                                                                        this.setState({
                                                                            initiative: {
                                                                                ...initiative,
                                                                                initiative_type: temp
                                                                            }
                                                                        })
                                                                    }
                                                                    else {
                                                                        this.setState({
                                                                            initiative: {
                                                                                ...initiative,
                                                                                initiative_type: initiative_type.filter(i => i != "vendor")
                                                                            }
                                                                        })
                                                                    }
                                                                }}
                                                            />
                                                            <span className="checkmark" />
                                                        </label>
                                                    </div>
                                                    <div className="rem-txt">
                                                        <label className="container-check">
                                                            In-House
                                                          <input type="checkbox" name="initiative_type"
                                                                checked={this.state.initiative.initiative_type.find(type => type == "in-house") ? true : false}
                                                                onChange={e => {
                                                                    const { initiative_type } = this.state.initiative
                                                                    let temp = initiative_type
                                                                    if (e.target.checked) {
                                                                        temp.push("in-house")
                                                                        this.setState({
                                                                            initiative: {
                                                                                ...initiative,
                                                                                initiative_type: temp
                                                                            }
                                                                        })
                                                                    }
                                                                    else {
                                                                        temp = temp.filter(i => i != "in-house")
                                                                        this.setState({
                                                                            initiative: {
                                                                                ...initiative,
                                                                                initiative_type: temp
                                                                            }
                                                                        })
                                                                    }
                                                                }}
                                                            />
                                                            <span className="checkmark" />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            {role === "super_admin" ?
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Consultancy *</h4>
                                                        <div className="custom-selecbox">
                                                            <select
                                                                autoComplete={"nope"}
                                                                className={`${showErrorBorder &&
                                                                    (!initiative.consultancy_id ||
                                                                        (initiative.consultancy_id && !initiative.consultancy_id.trim().length))
                                                                    ? "error-border "
                                                                    : ""
                                                                    }custom-selecbox form-control`}
                                                                onChange={async e => {
                                                                    await this.setState({
                                                                        initiative: {
                                                                            ...initiative,
                                                                            consultancy_id: e.target.value,
                                                                            project_id: ''
                                                                        }
                                                                    });
                                                                    this.handleConsultancySelect();
                                                                }}
                                                                value={initiative.consultancy_id}
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

                                            {role === "client_user" ? ("") : (<div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Client *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            autoComplete={"nope"}
                                                            className={`${showErrorBorder && (!initiative.client_id ||
                                                                (initiative.client_id && !initiative.client_id.trim().length)) ? "error-border " : ""}custom-selecbox form-control`}
                                                            onChange={async e => {
                                                                await this.setState({
                                                                    initiative: {
                                                                        ...initiative,
                                                                        client_id: e.target.value,
                                                                        project_id: ''
                                                                    }
                                                                })
                                                                this.handleClientSelect(e)
                                                            }
                                                            }
                                                            value={initiative.client_id}
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
                                            </div>)}
                                            <div className="col-md- basic-box">
                                                <div className="codeOtr">
                                                    <h4>FCA Project *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            autoComplete={"nope"}
                                                            className={`${showErrorBorder &&
                                                                (!initiative.project_id ||
                                                                    !initiative.project_id.trim().length)
                                                                ? "error-border "
                                                                : ""
                                                                }custom-selecbox form-control`}
                                                            onChange={async e => {
                                                                await this.setState({
                                                                    initiative: {
                                                                        ...initiative,
                                                                        project_id: e.target.value
                                                                    }
                                                                });

                                                            }}
                                                            value={initiative.project_id}
                                                        >
                                                            <option value="">Select</option>
                                                            {getAllProjectsDropdown && getAllProjectsDropdown.projects && getAllProjectsDropdown.projects.length
                                                                ? getAllProjectsDropdown.projects.map((item, i) => (
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
                                                <div className="form-group">
                                                    <h4>Status</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            autoComplete={"nope"}
                                                            defaultValue={this.state.initiative.status}
                                                            onChange={e =>
                                                                this.setState({
                                                                    initiative: {
                                                                        ...initiative,
                                                                        status: e.target.value
                                                                    }
                                                                })
                                                            } >
                                                            <option value="" >  Select</option>
                                                            <option value={"active"} key={"active"}>
                                                                {"Active"}
                                                            </option>
                                                            <option value={"in_progress"} key={"in_progress"}>
                                                                {"In Progress"}
                                                            </option>
                                                            <option value={"pending"} key={"pending"}>
                                                                {"Pending"}
                                                            </option>
                                                            <option value={"on_hold"} key={"on_hold"}>
                                                                {"On Hold"}
                                                            </option>
                                                            <option value={"completed"} key={"completed "}>
                                                                {"Completed "}
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                    <div className="basic-otr custom-col">
                                        <div className="basic-dtl-otr basic-sec">
                                            {selectedInitiative ? <>
                                                <div className="col-md-6 basic-box initRec">
                                                    <div className="codeOtr">
                                                        <h4>Recommendation Cost</h4>
                                                        <NumberFormat
                                                            autocomplete="off"
                                                            value={initiative.recommendations_cost || 0}
                                                            thousandSeparator={true}
                                                            decimalScale={0}
                                                            disabled={true}
                                                            className="custom-input form-control"
                                                            prefix={
                                                                "$ "
                                                            }

                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-md-6 basic-box initRec">
                                                    <div className="codeOtr">
                                                        <h4>Recommendation Count</h4>
                                                        <NumberFormat
                                                            autocomplete="off"
                                                            value={initiative.recommendations_count | 0}
                                                            thousandSeparator={true}
                                                            decimalScale={0}
                                                            disabled={true}
                                                            className="custom-input form-control"


                                                        />
                                                    </div>
                                                </div>



                                            </> : null}

                                        </div>
                                        <div className="basic-otr ">
                                            <div className="basic-dtl-otr basic-sec">

                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Actual Cost</h4>
                                                        <NumberFormat
                                                            autocomplete="off"
                                                            value={initiative.actual_cost}
                                                            thousandSeparator={true}
                                                            decimalScale={0}
                                                            className="custom-input form-control"
                                                            placeholder="Cost"
                                                            prefix={
                                                                initiative.actual_cost ? "$ " : ""
                                                            }
                                                            onValueChange={values => {
                                                                const { value } = values;
                                                                this.setState({
                                                                    initiative: {
                                                                        ...initiative,
                                                                        actual_cost: value
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Funding</h4>
                                                        <NumberFormat
                                                            autocomplete="off"
                                                            value={initiative.funding}
                                                            thousandSeparator={true}
                                                            decimalScale={0}
                                                            className="custom-input form-control"
                                                            placeholder="Cost"
                                                            prefix={
                                                                initiative.funding ? "$ " : ""
                                                            }
                                                            onValueChange={values => {
                                                                const { value } = values;
                                                                this.setState({
                                                                    initiative: {
                                                                        ...initiative,
                                                                        funding: value
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Total SF</h4>
                                                        <NumberFormat
                                                            autocomplete="off"
                                                            value={initiative.total_sf}
                                                            thousandSeparator={true}
                                                            decimalScale={0}
                                                            className="custom-input form-control"
                                                            placeholder="Cost"

                                                            onValueChange={values => {
                                                                const { value } = values;
                                                                this.setState({
                                                                    initiative: {
                                                                        ...initiative,
                                                                        total_sf: value
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                        <div className="basic-otr custom-col ">
                                            <div className="basic-dtl-otr basic-sec">

                                                <div className="col-md-4 basic-box comment-form">
                                                    <div className="codeOtr">
                                                        <h4>Description</h4>
                                                        <textarea
                                                            autoComplete="off"
                                                            placeholder="Description"
                                                            className="custom-input form-control"
                                                            value={this.state.initiative.description || ''}
                                                            onChange={e =>
                                                                this.setState({
                                                                    initiative: {
                                                                        ...initiative,
                                                                        description: e.target.value
                                                                    }
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4 basic-box comment-form">
                                                    <div className="codeOtr">
                                                        <h4>Notes</h4>
                                                        <textarea
                                                            autoComplete="nope"
                                                            placeholder="Notes"
                                                            className="custom-input form-control"
                                                            value={this.state.initiative.note || ''}
                                                            onChange={e =>
                                                                this.setState({
                                                                    initiative: {
                                                                        ...initiative,
                                                                        note: e.target.value
                                                                    }
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4 text-right btnOtr edit-cmn-btn pt-5 pr-4 edit-cmn-btn-padding">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btnClr col-md-2 mr-1"
                                                        data-dismiss="modal"
                                                        onClick={() => this.cancelForm()}
                                                    >
                                                        Cancel
                                                   </button>
                                                    {selectedInitiative ? (
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btnRgion col-md-2"
                                                            onClick={() => this.updateInitiative()}
                                                        >
                                                            Update initiative {this.state.isSubmit ? <span className="spinner-border spinner-border-sm pl-2" role="status">

                                                            </span> : null}
                                                        </button>
                                                    ) : (
                                                            <button
                                                                disabled={addButton}
                                                                type="button"
                                                                className="btn btn-primary btnRgion col-md-2"
                                                                onClick={() => this.addInitiative()}
                                                            >
                                                                Add initiative {this.state.isSubmit ? <span className="spinner-border spinner-border-sm pl-2" role="status">

                                                                </span> : null}
                                                            </button>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { regionReducer, initativeReducer } = state;
    return { regionReducer, initativeReducer };
};

export default withRouter(connect(mapStateToProps, { ...regionActions, ...initativeAction })(Form));
