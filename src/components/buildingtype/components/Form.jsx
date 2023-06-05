import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";

import buildingTypeActions from "../actions";
import buildingActions from "../../building/actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { addToBreadCrumpData, popBreadCrumpData, findPrevPathFromBreadCrump } from "../../../config/utils";

class From extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            clients: "",
            consultancy_users: "",
            buildingType: {
                name: "",
                client_id: null,
                description: "",
                display_in_stats: "yes",
                consultancy_id: null
            },
            initiaValues: {},
            isNewBuildingType: true,
            selectedClient: {},
            regionList: [],
            siteList: [],
            buildingTypeList: [],
            selectedConsultancyUsers: [],
            selectedBuildingType: props.selectedBuildingType,
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false,
            addButton: false
        };
    }

    componentDidMount = async () => {
        await this.props.getAllBuildingTypeDropdowns();
        await this.props.getAllConsultanciesDropdown();
        const {
            buildingTypeReducer: {
                getAllClientsResponse: { clients }
            }
        } = this.props;
        const { getAllConsultanciesDropdownResponse } = this.props.buildingReducer;

        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const { selectedBuildingType } = this.state;
        let buildingTypeList = [];
        if (query.inp || selectedBuildingType) {
            buildingTypeList = this.props.buildingTypeReducer.getAllBuildingTypesResponse.buildingTypes;
        }
        if (selectedBuildingType) {
            await this.props.getDataById(selectedBuildingType);
            const {
                buildingTypeReducer: {
                    getBuildingTypeByIdResponse: { description, client, name, success, display_in_stats, consultancy }
                }
            } = this.props;
            if (success) {
                await this.setState({
                    buildingType: {
                        name,
                        client_id: client.id,
                        description,
                        display_in_stats,
                        consultancy_id: consultancy.id
                    }
                });
            }
        }
        await this.setState({
            clients,
            buildingTypeList,
            initiaValues: this.state.buildingType,
            isNewBuildingType: query.inp,
            isLoading: false
        });
    };

    validate = () => {
        const { buildingType } = this.state;
        this.setState({
            showErrorBorder: false
        });
        let role = localStorage.getItem("role") || "";

        if (!buildingType.name && !buildingType.name.trim().length) {
            this.setState({
                errorMessage: "Please enter building type name",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (
            (role === "super_admin" || role === "consultancy_user") &&
            (!buildingType.client_id || (buildingType.client_id && !buildingType.client_id.trim().length))
        ) {
            this.setState({
                errorMessage: "Please select client",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (
            role == "super_admin" &&
            (!buildingType.consultancy_id || (buildingType.consultancy_id && !buildingType.consultancy_id.trim().length))
        ) {
            this.setState({
                errorMessage: "Please select Counsultancy",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }
        return true;
    };

    addBuildingType = async () => {
        this.setState({ addButton: true });
        const { buildingType } = this.state;
        const { handleAddBuildingType } = this.props;
        if (this.validate()) {
            await handleAddBuildingType(buildingType);
        }
    };

    updateBuildingType = async () => {
        const { buildingType } = this.state;
        const { handleUpdateBuildingType } = this.props;
        if (this.validate()) {
            await handleUpdateBuildingType(buildingType);
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
        if (_.isEqual(this.state.initiaValues, this.state.buildingType)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        this.setState({
            buildingType: {
                name: "",
                description: ""
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
        const { getAllConsultanciesDropdownResponse } = this.props.buildingReducer;
        let role = localStorage.getItem("role") || "";
        const { clients, buildingType, selectedBuildingType, showErrorBorder, addButton } = this.state;
        return (
            <React.Fragment>
                <div
                    className="modal modal-region"
                    style={{ display: "block" }}
                    id="modalId"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    {selectedBuildingType ? "Edit " : "Add New "}Building Type
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onCancel()}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <form autoComplete="nope">
                                <div className="modal-body region-otr build-type-mod">
                                    <div className="form-group">
                                        <div className="formInp">
                                            <label>Name *</label>
                                            <input
                                                autoComplete="nope"
                                                type="text"
                                                className={`${
                                                    showErrorBorder && !buildingType.name.trim().length ? "error-border " : ""
                                                }form-control`}
                                                value={buildingType.name}
                                                onChange={e =>
                                                    this.setState({
                                                        buildingType: {
                                                            ...buildingType,
                                                            name: e.target.value
                                                        }
                                                    })
                                                }
                                                placeholder="Enter Name"
                                            />
                                        </div>
                                        {role === "super_admin" ? (
                                            <div className="formInp">
                                                <label>Consultancy *</label>
                                                <div className="selectOtr">
                                                    <select
                                                        autoComplete="nope"
                                                        onChange={async e => {
                                                            await this.setState({
                                                                buildingType: {
                                                                    ...buildingType,
                                                                    consultancy_id: e.target.value
                                                                }
                                                            });
                                                            await this.props.getAllBuildingTypeDropdowns({
                                                                consultancy_id: this.state.buildingType.consultancy_id
                                                            });
                                                        }}
                                                        value={buildingType.consultancy_id}
                                                        className={`${
                                                            showErrorBorder &&
                                                            (!buildingType.consultancy_id ||
                                                                (buildingType.consultancy_id && !buildingType.consultancy_id.trim().length))
                                                                ? "error-border "
                                                                : ""
                                                        }form-control`}
                                                    >
                                                        <option value="">Select</option>
                                                        {getAllConsultanciesDropdownResponse &&
                                                        getAllConsultanciesDropdownResponse.consultancies &&
                                                        getAllConsultanciesDropdownResponse.consultancies.length
                                                            ? getAllConsultanciesDropdownResponse.consultancies.map((item, i) => (
                                                                  <option value={item.id} key={i}>
                                                                      {item.name}
                                                                  </option>
                                                              ))
                                                            : null}
                                                    </select>
                                                </div>
                                            </div>
                                        ) : null}
                                        {role === "super_admin" || role === "consultancy_user" ? (
                                            <div className="formInp">
                                                <label>Client *</label>
                                                <div className="selectOtr">
                                                    <select
                                                        autoComplete="nope"
                                                        onChange={async e => {
                                                            await this.setState({
                                                                buildingType: {
                                                                    ...buildingType,
                                                                    client_id: e.target.value
                                                                }
                                                            });
                                                        }}
                                                        value={buildingType.client_id}
                                                        className={`${
                                                            showErrorBorder &&
                                                            (!buildingType.client_id ||
                                                                (buildingType.client_id && !buildingType.client_id.trim().length))
                                                                ? "error-border "
                                                                : ""
                                                        }form-control`}
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
                                        ) : null}
                                        <div className="formInp">
                                            <div className="col-md-12 checkbox-cover">
                                                <span className="dropdown-item">
                                                    <label className="container-check">
                                                        Display in Stats
                                                        <input
                                                            type="checkbox"
                                                            checked={buildingType.display_in_stats == "yes" ? true : false}
                                                            onClick={e => {
                                                                if (e.target.checked) {
                                                                    this.setState({
                                                                        buildingType: {
                                                                            ...buildingType,
                                                                            display_in_stats: "yes"
                                                                        }
                                                                    });
                                                                } else {
                                                                    this.setState({
                                                                        buildingType: {
                                                                            ...buildingType,
                                                                            display_in_stats: "no"
                                                                        }
                                                                    });
                                                                }
                                                            }}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="formInp">
                                            <label>Description</label>
                                            <textarea
                                                autoComplete="nope"
                                                placeholder="Description"
                                                className="form-control"
                                                value={buildingType.description || ""}
                                                onChange={e =>
                                                    this.setState({
                                                        buildingType: {
                                                            ...buildingType,
                                                            description: e.target.value
                                                        }
                                                    })
                                                }
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="col-md-12 p-0 text-right btnOtr">
                                        {selectedBuildingType ? (
                                            <button
                                                type="button"
                                                onClick={() => this.updateBuildingType()}
                                                className="btn btn-primary btnRgion col-md-2"
                                            >
                                                Update
                                            </button>
                                        ) : (
                                            <button
                                                disabled={addButton}
                                                type="button"
                                                onClick={() => this.addBuildingType()}
                                                className="btn btn-primary btnRgion col-md-2"
                                            >
                                                Add
                                            </button>
                                        )}
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
    const { buildingTypeReducer, buildingReducer } = state;
    return { buildingTypeReducer, buildingReducer };
};

export default withRouter(connect(mapStateToProps, { ...buildingTypeActions, ...buildingActions })(From));
