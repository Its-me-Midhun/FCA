import React, { Component } from "react";
import { connect } from "react-redux";
import { Multiselect } from "multiselect-react-dropdown";
import Select from "react-select";
import _ from "lodash";

import siteActions from "../actions";
import Loader from "../../common/components/Loader";
import MultiSelectCommon from "../../common/components/MultiSelectCommon";

class SiteModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            errorMessage: "",
            clients: "",
            consultancy_users: "",
            site: {
                consultancy_user_ids: [],
                client_id: "",
                region_id: "",
                name: "",
                code: "",
                comments: ""
            },
            selectedClient: {},
            selectedRegion: {},
            regionList: [],
            selectedConsultancyUsers: []
        };
    }

    componentDidMount = async () => {
        const {
            siteReducer: {
                getAllConsultancyUsersResponse: { users: consultancy_users },
                getAllClientsResponse: { clients }
            },
            selectedSite
        } = this.props;

        if (selectedSite) {
            await this.props.getSiteById(selectedSite);
            const {
                siteReducer: {
                    getSiteByIdResponse: {
                        client,
                        code,
                        comments,
                        id,
                        message,
                        name,
                        region,
                        success,
                        users = []
                    }
                }
            } = this.props;
            await this.props.getRegionsBasedOnClient(client.id);
            const {
                siteReducer: {
                    getRegionsBasedOnClientResponse: { regions: regionList }
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
                    regionList,
                    site: {
                        client_id: client.id,
                        region_id: region.id,
                        consultancy_user_ids,
                        name,
                        code,
                        comments
                    }
                });
            }
        }

        let tempUserOptions = [];
        if (consultancy_users && consultancy_users.length) {
            consultancy_users.map(item => tempUserOptions.push({ name: item.name, id: item.id }));
        }
        await this.setState({
            clients,
            consultancy_users: tempUserOptions,
            isLoading: false
        });
    };

    onSelectConsultancyUsers = async selectedConsultancyUsers => {
        const { site } = this.state;
        let tempUsers = [];
        if (selectedConsultancyUsers.length) {
            selectedConsultancyUsers.map(item => tempUsers.push(item.id));
        }

        await this.setState({
            site: {
                ...site,
                consultancy_user_ids: tempUsers
            },
            selectedConsultancyUsers
        });
    };

    handleClientSelect = async e => {
        const { site } = this.state;
        await this.props.getRegionsBasedOnClient(site.client_id);
        const {
            siteReducer: {
                getRegionsBasedOnClientResponse: { regions: regionList }
            }
        } = this.props;
        await this.setState({
            regionList,
            site: {
                ...site,
                region_id: ""
            }
        });
    };

    validate = () => {
        const { site } = this.state;
        if (!site.name.trim().length) {
            this.setState({
                errorMessage: "Please enter site name"
            });
            return false;
        } else if (!site.client_id.trim().length) {
            this.setState({
                errorMessage: "Please select client"
            });
            return false;
        } else if (!site.region_id.trim().length) {
            this.setState({
                errorMessage: "Please select region"
            });
            return false;
        } else if (!site.consultancy_user_ids.length) {
            this.setState({
                errorMessage: "Please select consultancy user"
            });
            return false;
        }
        return true;
    };

    addSite = async () => {
        const { site } = this.state;
        const { handleAddSite } = this.props;
        if (this.validate()) {
            await handleAddSite(site);
            this.props.onCancel();
        }
    };

    updateSite = async () => {
        const { site } = this.state;
        const { handleUpdateSite } = this.props;
        if (this.validate()) {
            await handleUpdateSite(site);
            this.props.onCancel();
        }
    };

    clearForm = async () => {
        await this.setState({
            site: {
                consultancy_user_ids: [],
                client_id: "",
                name: "",
                comments: "",
                region_id: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: []
        });
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return null;
        const { onCancel, selectedSite } = this.props;
        const {
            clients,
            consultancy_users,
            site,
            errorMessage,
            selectedConsultancyUsers,
            regionList
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
                                    {selectedSite ? "Edit " : "Add New "}Site
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
                                    {selectedSite ? (
                                        <div className="formInp">
                                            <label>Site Code</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={site.code}
                                                readOnly="true"
                                                placeholder="Enter Site code"
                                            />
                                        </div>
                                    ) : null}
                                    <div className="formInp">
                                        <label>Site Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={site.name}
                                            onChange={e =>
                                                this.setState({
                                                    site: {
                                                        ...site,
                                                        name: e.target.value
                                                    }
                                                })
                                            }
                                            placeholder="Enter Site Name"
                                        />
                                    </div>
                                    <div className="formInp">
                                        <label>Client</label>
                                        <div className="selectOtr">
                                            <select
                                                className="form-control"
                                                onChange={async e => {
                                                    await this.setState({
                                                        site: {
                                                            ...site,
                                                            client_id: e.target.value
                                                        }
                                                    });
                                                    this.handleClientSelect();
                                                }}
                                                value={site.client_id}
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
                                    <div className="formInp">
                                        <label>Region</label>
                                        <div className="selectOtr">
                                            <select
                                                className="form-control"
                                                onChange={e =>
                                                    this.setState({
                                                        site: {
                                                            ...site,
                                                            region_id: e.target.value
                                                        }
                                                    })
                                                }
                                                value={site.region_id}
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
                                            value={site.comments}
                                            onChange={e =>
                                                this.setState({
                                                    site: {
                                                        ...site,
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
                                    {selectedSite ? (
                                        <button
                                            type="button"
                                            onClick={() => this.updateSite()}
                                            className="btn btn-primary btnRgion"
                                        >
                                            Update Site
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => this.addSite()}
                                            className="btn btn-primary btnRgion"
                                        >
                                            Add New Site
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
    const { siteReducer } = state;
    return { siteReducer };
};

export default connect(mapStateToProps, { ...siteActions })(SiteModal);
