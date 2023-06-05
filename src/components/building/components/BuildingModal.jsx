import React, { Component } from "react";
import { connect } from "react-redux";
import { Multiselect } from "multiselect-react-dropdown";
import Select from "react-select";
import _ from "lodash";

import BuildingActions from "../actions";
import Loader from "../../common/components/Loader";
import MultiSelectCommon from "../../common/components/MultiSelectCommon";

class BuildingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            errorMessage: "",
            clients: "",
            consultancy_users: "",
            building: {
                name: "",
                code: "",
                site_id: "",
                client_id: "",
                region_id: "",
                zip_code: "",
                city: "",
                state: "",
                year: "",
                building_type: "",
                ownership: "",
                ownership_type: "",
                use: "",
                area: "",
                cost: "",
                enterprise_index: "",
                fca: "",
                manager: "",
                street: "",
                country: "",
                description: "",
                comments: "",
                number: ""
            },
            selectedClient: {},
            selectedRegion: {},
            regionList: [],
            siteList: [],
            selectedConsultancyUsers: []
        };
    }

    componentDidMount = async () => {
        await this.props.getAllCountries();
        const {
            buildingReducer: {
                getAllConsultancyUsersResponse: { users: consultancy_users },
                getAllClientsResponse: { clients },
                getAllCountriesResponse
            },
            selectedBuilding
        } = this.props;

        if (selectedBuilding) {
            await this.props.getBuildingById(selectedBuilding);
            const {
                buildingReducer: {
                    getBuildingByIdResponse: {
                        area,
                        building_type,
                        city,
                        client,
                        code,
                        comments,
                        cost,
                        description,
                        enterprise_index,
                        number,
                        fca,
                        manager,
                        year,
                        country,
                        message,
                        name,
                        ownership,
                        ownership_type,
                        region,
                        site,
                        state,
                        street,
                        success,
                        use,
                        users,
                        zip_code
                    }
                }
            } = this.props;
            if (success) {
                await this.props.getRegionsBasedOnClient(client.id);
                await this.props.getSitesBasedOnRegion(region.id);
                const {
                    buildingReducer: {
                        getRegionsBasedOnClientResponse: { regions: regionList }
                    }
                } = this.props;
                const {
                    buildingReducer: {
                        getSitesBasedOnRegionResponse: { sites: siteList }
                    }
                } = this.props;
                await this.setState({
                    regionList
                });
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
                    siteList,
                    building: {
                        client_id: client.id,
                        region_id: region.id,
                        site_id: site.id,
                        consultancy_user_ids,
                        name,
                        code,
                        comments,
                        area,
                        building_type,
                        city,
                        cost,
                        description,
                        enterprise_index,
                        fca,
                        manager,
                        message,
                        ownership,
                        ownership_type,
                        state,
                        number,
                        country,
                        street,
                        use,
                        year,
                        zip_code
                    }
                });
            }
        }
        let tempUserOptions = [];
        let tempClientOptions = [];
        if (consultancy_users && consultancy_users.length) {
            consultancy_users.map(item => tempUserOptions.push({ name: item.name, id: item.id }));
        }
        if (clients && clients.length) {
            clients.map(item => tempClientOptions.push({ label: item.name, value: item.id }));
        }
        await this.setState({
            clients,
            consultancy_users: tempUserOptions,
            allCountries: Object.values(getAllCountriesResponse),
            isLoading: false
        });
    };

    onSelectConsultancyUsers = async selectedConsultancyUsers => {
        const { building } = this.state;
        let tempUsers = [];
        if (selectedConsultancyUsers.length) {
            selectedConsultancyUsers.map(item => tempUsers.push(item.id));
        }
        await this.setState({
            building: {
                ...building,
                consultancy_user_ids: tempUsers
            },
            selectedConsultancyUsers
        });
    };

    handleClientSelect = async () => {
        const { building } = this.state;
        await this.props.getRegionsBasedOnClient(building.client_id);
        const {
            buildingReducer: {
                getRegionsBasedOnClientResponse: { regions: regionList }
            }
        } = this.props;
        await this.setState({
            regionList,
            building: {
                ...building,
                region_id: "",
                site_id: ""
            }
        });
    };

    handleRegionSelect = async () => {
        const { building } = this.state;
        await this.props.getSitesBasedOnRegion(building.region_id);
        const {
            buildingReducer: {
                getSitesBasedOnRegionResponse: { sites: siteList }
            }
        } = this.props;
        await this.setState({
            siteList,
            building: {
                ...building,
                site_id: ""
            }
        });
    };

    validate = () => {
        const { building } = this.state;
        if (!building.name.trim().length) {
            this.setState({
                errorMessage: "Please enter building name"
            });
            return false;
        } else if (!building.client_id.trim().length) {
            this.setState({
                errorMessage: "Please select client"
            });
            return false;
        } else if (!building.region_id.trim().length) {
            this.setState({
                errorMessage: "Please select region"
            });
            return false;
        } else if (!building.site_id.trim().length) {
            this.setState({
                errorMessage: "Please select site"
            });
            return false;
        }
        return true;
    };

    addBuilding = async () => {
        const { building } = this.state;
        const { handleAddBuilding } = this.props;
        if (this.validate()) {
            await handleAddBuilding(building);
            this.props.onCancel();
        }
    };

    updateBuilding = async () => {
        const { building } = this.state;
        const { handleUpdateBuilding } = this.props;
        if (this.validate()) {
            await handleUpdateBuilding(building);
            this.props.onCancel();
        }
    };

    clearForm = async () => {
        await this.setState({
            building: {
                name: "",
                site_id: "",
                client_id: "",
                region_id: "",
                zip_code: "",
                city: "",
                state: "",
                year: "",
                building_type: "",
                ownership: "",
                ownership_type: "",
                use: "",
                area: "",
                cost: "",
                enterprise_index: "",
                fca: "",
                manager: "",
                street: "",
                country: "",
                description: "",
                comments: "",
                number: "",
                consultancy_user_ids: []
            },
            selectedConsultancyUsers: []
        });
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return null;
        const { onCancel, selectedBuilding } = this.props;
        const {
            clients,
            consultancy_users,
            building,
            errorMessage,
            selectedConsultancyUsers,
            regionList,
            siteList,
            allCountries
        } = this.state;
        return (
            <React.Fragment>
                <div
                    id="modalId"
                    className="modal modal-region modal-build"
                    style={{ display: "block" }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    {selectedBuilding ? "Edit " : "Add New "}Building
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
                                <div className="form-group d-flex flex-wrap">
                                    <div className="col-md-12 p-0 addTxt">
                                        <h3>Basic Details</h3>
                                        <div className="line" />
                                    </div>
                                    {selectedBuilding ? (
                                        <div className="col-md-3 formInp">
                                            <label>Building Code</label>
                                            <input
                                                type="text"
                                                value={building.code}
                                                className="form-control"
                                                placeholder="Enter Building Code"
                                                readOnly="true"
                                            />
                                        </div>
                                    ) : null}
                                    <div className="col-md-3 formInp">
                                        <label>Building Name</label>
                                        <input
                                            type="text"
                                            value={building.name}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        name: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter Building Name"
                                        />
                                    </div>
                                    <div className="col-md-3 formInp">
                                        <label>Building Type</label>
                                        <input
                                            type="text"
                                            value={building.building_type}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        building_type: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter Building Type"
                                        />
                                    </div>
                                    <div className="col-md-3 formInp">
                                        <label>Client</label>
                                        <div className="selectOtr">
                                            <select
                                                className="form-control"
                                                onChange={async e => {
                                                    await this.setState({
                                                        building: {
                                                            ...building,
                                                            client_id: e.target.value
                                                        }
                                                    });
                                                    this.handleClientSelect();
                                                }}
                                                value={building.client_id}
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
                                    <div className="col-md-3 formInp">
                                        <label>Region</label>
                                        <div className="selectOtr">
                                            <select
                                                className="form-control"
                                                value={building.region_id}
                                                onChange={async e => {
                                                    await this.setState({
                                                        building: {
                                                            ...building,
                                                            region_id: e.target.value
                                                        }
                                                    });
                                                    this.handleRegionSelect();
                                                }}
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
                                    <div className="col-md-3 formInp">
                                        <label>Site</label>
                                        <div className="selectOtr">
                                            <select
                                                className="form-control"
                                                value={building.site_id}
                                                onChange={e =>
                                                    this.setState({
                                                        building: {
                                                            ...building,
                                                            site_id: e.target.value
                                                        }
                                                    })
                                                }
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
                                    <div className="col-md-3 formInp">
                                        <label>Associated FCA</label>
                                        <input
                                            type="text"
                                            value={building.fca}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        fca: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter Associated FCA"
                                        />
                                    </div>
                                    <div className="col-md-3 formInp">
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
                                </div>
                                <div className="form-group d-flex flex-wrap">
                                    <div className="col-md-12 p-0 addTxt">
                                        <h3>More Details</h3>
                                        <div className="line" />
                                    </div>
                                    <div className="col-md-3 formInp">
                                        <label>Area (Sq Ft)</label>
                                        <input
                                            type="number"
                                            value={building.area}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        area: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter Area"
                                        />
                                    </div>
                                    <div className="col-md-3 formInp">
                                        <label>Cost per Sq Ft</label>
                                        <input
                                            type="number"
                                            value={building.cost}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        cost: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter Cost"
                                        />
                                    </div>
                                    <div className="col-md-3 formInp">
                                        <label>Enterprise Index</label>
                                        <input
                                            type="text"
                                            value={building.enterprise_index}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        enterprise_index: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter Enterprise Index"
                                        />
                                    </div>
                                    <div className="col-md-3 formInp">
                                        <label>Ownership</label>
                                        <input
                                            type="text"
                                            value={building.ownership}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        ownership: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter Ownership"
                                        />
                                    </div>
                                    <div className="col-md-3 formInp">
                                        <label>Ownership Type</label>
                                        <input
                                            type="text"
                                            value={building.ownership_type}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        ownership_type: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter Ownership Type"
                                        />
                                    </div>
                                    <div className="col-md-3 formInp">
                                        <label>Use</label>
                                        <input
                                            type="text"
                                            value={building.use}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        use: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter Use"
                                        />
                                    </div>
                                    <div className="col-md-3 formInp">
                                        <label>Manager</label>
                                        <input
                                            type="text"
                                            value={building.manager}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        manager: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter Manager"
                                        />
                                    </div>
                                    <div className="col-md-3 formInp">
                                        <label>Year Built</label>
                                        <input
                                            type="number"
                                            value={building.year}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        year: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter Year Built"
                                        />
                                    </div>
                                </div>
                                <div className="form-group d-flex flex-wrap">
                                    <div className="col-md-12 p-0 addTxt">
                                        <h3>Address</h3>
                                        <div className="line" />
                                    </div>
                                    <div className="col-md-3 formInp">
                                        <label>Building No</label>
                                        <input
                                            type="text"
                                            value={building.number}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        number: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter Street"
                                        />
                                    </div>
                                    <div className="col-md-3 formInp">
                                        <label>Street</label>
                                        <input
                                            type="text"
                                            value={building.street}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        street: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter Street"
                                        />
                                    </div>
                                    <div className="col-md-3 formInp">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            value={building.city}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        city: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter City"
                                        />
                                    </div>
                                    <div className="col-md-3 formInp">
                                        <label>State</label>
                                        <input
                                            type="text"
                                            value={building.state}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        state: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter City"
                                        />
                                    </div>
                                    <div className="col-md-3 formInp">
                                        <label>Zipcode</label>
                                        <input
                                            type="text"
                                            value={building.zip_code}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        zip_code: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                            placeholder="Enter Zipcode"
                                        />
                                    </div>
                                    <div className="col-md-3 formInp">
                                        <label>Coutry</label>
                                        <div className="selectOtr">
                                            <select
                                                className="form-control"
                                                value={building.country}
                                                onChange={event =>
                                                    this.setState({
                                                        building: {
                                                            ...building,
                                                            country: event.target.value
                                                        }
                                                    })
                                                }
                                            >
                                                <option value="">Select Country</option>
                                                {allCountries.map((item, i) => (
                                                    <option key={i} value={item.alpha2Code}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group d-flex form-otr">
                                    <div className="col-md-6 formInp">
                                        <label>Description</label>
                                        <textarea
                                            placeholder="Description"
                                            value={building.description}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        description: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-md-6 formInp">
                                        <label>Comments</label>
                                        <textarea
                                            placeholder="Comments"
                                            value={building.comments}
                                            onChange={e =>
                                                this.setState({
                                                    building: {
                                                        ...building,
                                                        comments: e.target.value
                                                    }
                                                })
                                            }
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 p-0 pb-4 text-right text-danger">
                                    <small>{errorMessage}</small>
                                </div>
                                <div className="col-md-12 p-0 text-right btnOtr">
                                    <button
                                        type="button"
                                        className="btn btn-secondary btnClr col-md-2 mr-1"
                                        data-dismiss="modal"
                                        onClick={() => this.clearForm()}
                                    >
                                        Clear
                                    </button>
                                    {selectedBuilding ? (
                                        <button
                                            type="button"
                                            className="btn btn-primary btnRgion col-md-2"
                                            onClick={() => this.updateBuilding()}
                                        >
                                            Update Building
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-primary btnRgion col-md-2"
                                            onClick={() => this.addBuilding()}
                                        >
                                            Add New Building
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
    const { buildingReducer } = state;
    return { buildingReducer };
};

export default connect(mapStateToProps, { ...BuildingActions })(BuildingModal);
