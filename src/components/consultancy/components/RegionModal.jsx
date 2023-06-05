import React, { Component } from "react";
import { connect } from "react-redux";
import { Multiselect } from "multiselect-react-dropdown";
import { withRouter } from "react-router-dom";

import regionActions from "../actions";
import Loader from "../../common/components/Loader";
import MultiSelectCommon from "../../common/components/MultiSelectCommon";

class RegionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            errorMessage: "",
            clients: "",
            consultancy_users: "",
            region: {
                consultancy_user_ids: [],
                client_id: "",
                name: "",
                code: "",
                comments: ""
            },
            selectedConsultancyUsers: []
        };
    }

    componentDidMount = async () => {
        const {
            selectedRegion,
            regionReducer: {
                getAllConsultancyUsersResponse: { users: consultancy_users },
                getAllClientsResponse: { clients }
            }
        } = this.props;

        if (selectedRegion) {
            await this.props.getRegionById(selectedRegion);
            const {
                regionReducer: {
                    getRegionByIdResponse: { client, users, code, comments, name, success }
                }
            } = this.props;
            if (success) {
                let selectedConsultancyUsers = [];
                let consultancy_user_ids = [];
                if (users.length) {
                    users.map(item =>
                        selectedConsultancyUsers.push({ name: item.name, id: item.id })
                    );
                    users.map(item => consultancy_user_ids.push(item.id));
                }
                await this.setState({
                    selectedConsultancyUsers,
                    region: {
                        client_id: client.id,
                        consultancy_user_ids,
                        name,
                        code,
                        comments
                    }
                });
            }
        }
        let tempUserOptions = [];
        if (consultancy_users.length) {
            consultancy_users.map(item => tempUserOptions.push({ name: item.name, id: item.id }));
        }
        await this.setState({
            clients,
            consultancy_users: tempUserOptions,
            isLoading: false
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

    handleClientSelect = async selectedClient => {
        const { region } = this.state;
        await this.setState({
            region: {
                ...region,
                client_id: selectedClient.value
            },
            selectedClient
        });
    };

    validate = () => {
        const { region } = this.state;
        if (!region.name.trim().length) {
            this.setState({
                errorMessage: "Please enter region name"
            });
            return false;
        } else if (!region.client_id.trim().length) {
            this.setState({
                errorMessage: "Please select client"
            });
            return false;
        } else if (!region.consultancy_user_ids.length) {
            this.setState({
                errorMessage: "Please select consultancy user"
            });
            return false;
        }
        return true;
    };

    addRegion = async () => {
        const { region } = this.state;
        const { handleAddRegion } = this.props;
        if (this.validate()) {
            await handleAddRegion(region);
            this.props.onCancel();
        }
    };

    updateRegion = async () => {
        const { region } = this.state;
        const { handleUpdateRegion } = this.props;
        if (this.validate()) {
            await handleUpdateRegion(region);
            this.props.onCancel();
        }
    };

    clearForm = async () => {
        await this.setState({
            region: {
                consultancy_user_ids: [],
                client_id: "",
                name: "",
                comments: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: []
        });
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return null;
        const { onCancel, selectedRegion } = this.props;
        const {
            clients,
            consultancy_users,
            region,
            errorMessage,
            selectedConsultancyUsers
        } = this.state;
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
                                    {selectedRegion ? "Edit " : "Add New "}Region
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={onCancel}
                                >
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body region-otr">
                                <div className="form-group">
                                    {selectedRegion ? (
                                        <div className="formInp">
                                            <label>Region Code</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={region.code}
                                                readOnly="true"
                                                placeholder="Enter Region code"
                                            />
                                        </div>
                                    ) : null}
                                    <div className="formInp">
                                        <label>Region Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
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
                                    <div className="formInp">
                                        <label>Client</label>
                                        <div className="selectOtr" placeholder="Select">
                                            <select
                                                className="form-control"
                                                onChange={e =>
                                                    this.setState({
                                                        region: {
                                                            ...region,
                                                            client_id: e.target.value
                                                        }
                                                    })
                                                }
                                                value={region.client_id}
                                            >
                                                <option value="">Select</option>
                                                {clients.length
                                                    ? clients.map((item, i) => (
                                                          <option value={item.id} key={i}>
                                                              {item.name}
                                                          </option>
                                                      ))
                                                    : null}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="formInp">
                                        <label>Consultancy User</label>
                                        <div className="selectOtr">
                                            <Multiselect
                                                options={consultancy_users}
                                                selectedValues={selectedConsultancyUsers}
                                                onSelect={this.onSelectConsultancyUsers}
                                                className="form-control"
                                                displayValue="name"
                                            />
                                        </div>
                                    </div>
                                    <div className="formInp">
                                        <label>Comments</label>
                                        <textarea
                                            placeholder="Comments"
                                            className="form-control"
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
                                <div className="col-md-12 p-0 pb-4 text-right text-danger">
                                    <small>{errorMessage}</small>
                                </div>
                                <div className="col-md-12 p-0 text-right btnOtr d-flex justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-secondary btnClr"
                                        data-dismiss="modal"
                                        onClick={() => this.clearForm()}
                                    >
                                        Clear
                                    </button>
                                    {selectedRegion ? (
                                        <button
                                            type="button"
                                            onClick={() => this.updateRegion()}
                                            className="btn btn-primary btnRgion"
                                        >
                                            Update Region
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => this.addRegion()}
                                            className="btn btn-primary btnRgion"
                                        >
                                            Add New Region
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { regionReducer } = state;
    return { regionReducer };
};

export default withRouter(connect(mapStateToProps, { ...regionActions })(RegionModal));
