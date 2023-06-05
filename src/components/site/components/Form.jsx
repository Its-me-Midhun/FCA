import React, { Component } from "react";
import { connect } from "react-redux";
import { Multiselect } from "multiselect-react-dropdown";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import reactCSS from "reactcss";
import { CountryDropdown, RegionDropdown, CountryRegionData } from "react-country-region-selector";
import NumberFormat from "react-number-format";
import siteActions from "../actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import {
    addToBreadCrumpData,
    popBreadCrumpData,
    findPrevPathFromBreadCrump,
    findPrevPathFromBreadCrumpData,
    splitAddressComponents
} from "../../../config/utils";
import exclmIcon from "../../../assets/img/recom-icon.svg";
import { SketchPicker } from "react-color";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { MultiSelectionModal } from "../../common/components/MultiSelectionModal";

class From extends Component {
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
            client_users: [],
            consultancies: "",
            site: {
                consultancy_user_ids: [],
                client_user_ids: [],
                client_id: query.c_id || "",
                region_id: query.r_id || "",
                consultancy_id: query.cty_id || "",
                project_ids: [],
                name: "",
                code: "",
                comments: "",
                removed_users: [],
                street: "",
                country: "United States",
                zip_code: "",
                city: "",
                state: "",
                color_code: "",
                sort_order: "",
                lat: "",
                long: "",
                place: ""
            },
            showPicker: false,
            initiaValues: {},
            selectedClient: {},
            regionList: [],
            selectedConsultancyUsers: [],
            selectedClientUsers: [],
            breadCrumbsData: [
                { key: "main", name: "Sites", path: "/site" },
                { key: "form", name: "Add site", path: "/site/add" }
            ],
            showErrorBorder: false,
            selectedSite: props.match.params.id,
            showConfirmModal: false,
            AllProjects: "",
            selectedProjects: [],
            initialConsultancyUsers: [],
            initialClientUsers: [],
            addButton: false,
            multiSelectionModalParams: {}
        };
    }

    componentDidMount = async () => {
        let role = localStorage.getItem("role");
        await this.props.getAllSiteDropdowns();
        if (role === "client_user") {
            await this.props.getRegionsBasedOnClient({ client_id: this.state.site.client_id });
            const {
                siteReducer: {
                    getRegionsBasedOnClientResponse: { regions: regionList }
                }
            } = this.props;
            await this.props.getAllClientUsers();
            const {
                siteReducer: {
                    getAllClientUsersResponse: { client_users }
                }
            } = this.props;
            await this.props.getProjectsBasedOnClient("");
            const {
                siteReducer: {
                    getProjectsBasedOnClientResponse: { projects: AllProjects }
                }
            } = this.props;
            await this.setState({
                regionList,
                client_users,
                AllProjects
            });
        }
        if (this.state.site.consultancy_id && role === "super_admin") {
            await this.props.getAllClients({ consultancy_id: this.state.site.consultancy_id });
            const {
                siteReducer: {
                    getAllClientsResponse: { clients }
                }
            } = this.props;
            await this.setState({
                clients
            });
            await this.props.getProjectsBasedOnClient({ client_id: this.state.site.client_id });
            const {
                siteReducer: {
                    getProjectsBasedOnClientResponse: { projects: AllProjects }
                }
            } = this.props;

            await this.props.getAllConsultancyUsers({ consultancy_id: this.state.site.consultancy_id });
            const {
                siteReducer: {
                    getAllConsultancyUsersResponse: { users: consultancy_users }
                }
            } = this.props;

            let tempUserOptions = [];
            if (consultancy_users && consultancy_users.length) {
                consultancy_users.map(item => tempUserOptions.push({ name: item.name, id: item.id }));
            }
            await this.props.getAllClientUsers(this.state.site.client_id);
            const {
                siteReducer: {
                    getAllClientUsersResponse: { client_users }
                }
            } = this.props;
            await this.setState({
                consultancy_users: tempUserOptions,
                AllProjects,
                client_users,
                // -----------for defaultproject----------
                selectedProjects: AllProjects,
                site: {
                    ...this.state.site,
                    project_ids: this.state.selectedProjects ? AllProjects && AllProjects[0] && AllProjects[0].id : []
                }
                // --------------------------
            });
        }
        const {
            siteReducer: {
                //getAllConsultancyUsersResponse: { users: consultancy_users },
                getAllClientsResponse: { clients },
                getAllConsultanciesDropdownResponse: { consultancies }
            }
        } = this.props;

        if (this.state.site.client_id) {
            await this.props.getRegionsBasedOnClient({ client_id: this.state.site.client_id });
            const {
                siteReducer: {
                    getRegionsBasedOnClientResponse: { regions: regionList }
                }
            } = this.props;
            await this.setState({
                regionList
            });
        }
        const { selectedSite } = this.state;

        if (selectedSite) {
            let newBreadCrumpData = [
                { key: "main", name: "Sites", path: "/site" },
                { key: "form", name: "Edit site", path: "/site/edit" }
            ];
            await this.props.getSiteById(selectedSite);
            const {
                siteReducer: {
                    getSiteByIdResponse: {
                        client,
                        code,
                        comments,
                        name,
                        region,
                        consultancy,
                        success,
                        client_users,
                        users = [],
                        projects,
                        city,
                        country,
                        state,
                        street,
                        zip_code,
                        color_code,
                        sort_order,
                        latitude,
                        longitude,
                        place
                    }
                }
            } = this.props;
            await this.props.getRegionsBasedOnClient({ client_id: client.id });
            const {
                siteReducer: {
                    getRegionsBasedOnClientResponse: { regions: regionList }
                }
            } = this.props;
            await this.props.getProjectsBasedOnClient({ client_id: client.id });
            const {
                siteReducer: {
                    getProjectsBasedOnClientResponse: { projects: AllProjects }
                }
            } = this.props;
            if (success) {
                await this.props.getAllConsultancyUsers({ consultancy_id: consultancy.id });
                const {
                    siteReducer: {
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
                        siteReducer: {
                            getAllClientsResponse: { clients }
                        }
                    } = this.props;
                    await this.setState({ clients });
                }
                await this.props.getAllClientUsers(client.id);
                const {
                    siteReducer: {
                        getAllClientUsersResponse: { client_users: clientusers }
                    }
                } = this.props;
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
                    selectedProjects,
                    regionList,
                    selectedClientUsers,
                    consultancy_users: consultancy_users,
                    client_users: clientusers,
                    AllProjects,
                    site: {
                        client_id: client.id,
                        region_id: region.id,
                        consultancy_user_ids,
                        client_user_ids,
                        consultancy_id: consultancy ? consultancy.id : "",
                        project_ids,
                        name,
                        code,
                        comments,
                        city,
                        country,
                        state,
                        street,
                        zip_code,
                        color_code: color_code || "",
                        sort_order,
                        lat: latitude,
                        long: longitude,
                        place
                    },
                    breadCrumbsData: newBreadCrumpData,
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
            //consultancy_users: tempUserOptions,
            initiaValues: this.state.site,
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

    onSelectClientUsers = async selectedClientUsers => {
        const { site } = this.state;
        let tempUsers = [];
        if (selectedClientUsers.length) {
            selectedClientUsers.map(item => tempUsers.push(item.id));
        }

        await this.setState({
            site: {
                ...site,
                client_user_ids: tempUsers
            },
            selectedClientUsers
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
            site: {
                ...this.state.site,
                color_code: color.hex
            }
        });
    };
    handleClientSelect = async e => {
        const { site } = this.state;
        await this.props.getRegionsBasedOnClient({ client_id: site.client_id });
        const {
            siteReducer: {
                getRegionsBasedOnClientResponse: { regions: regionList }
            }
        } = this.props;
        await this.props.getAllClientUsers(site.client_id);
        const {
            siteReducer: {
                getAllClientUsersResponse: { client_users }
            }
        } = this.props;
        await this.props.getProjectsBasedOnClient({ client_id: site.client_id });
        const {
            siteReducer: {
                getProjectsBasedOnClientResponse: { projects: AllProjects }
            }
        } = this.props;
        await this.setState({
            regionList,
            client_users,
            AllProjects,
            site: {
                ...site,
                //region_id: "",
                client_user_ids: [],
                project_ids: ""
            }
        });
    };

    validate = () => {
        const { site } = this.state;
        let role = localStorage.getItem("role") || "";
        this.setState({
            showErrorBorder: false
        });
        if (!site.name.trim().length) {
            this.setState({
                errorMessage: "Please enter site name",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (role === "super_admin" && !site.consultancy_id.trim().length) {
            this.setState({
                errorMessage: "Please select consultancy",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if ((role === "super_admin" || role === "consultancy_user") && !site.client_id.trim().length) {
            this.setState({
                errorMessage: "Please select client",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if ((role === "super_admin" || role === "consultancy_user") && !site.region_id.trim().length) {
            this.setState({
                errorMessage: "Please select region",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }
        return true;
    };

    addSite = async () => {
        this.setState({ addButton: true });
        const { site } = this.state;
        const { handleAddSite } = this.props;
        if (this.validate()) {
            popBreadCrumpData();
            await handleAddSite(site);
        }
    };

    updateSite = async () => {
        const { site, initialConsultancyUsers, initialClientUsers } = this.state;
        const { consultancy_user_ids, client_user_ids } = this.state.site;
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
            site: {
                ...site,
                removed_users: tempRemovedUsers
            }
        });
        const { handleUpdateSite } = this.props;

        // if (this.validate()) {
        //     popBreadCrumpData();
        //     if (!findPrevPathFromBreadCrump()) {
        //         addToBreadCrumpData({ key: "main", name: "Sites", path: "/site" });
        //     }

        //     await handleUpdateSite(this.state.site);
        //     this.props.history.push(findPrevPathFromBreadCrump() || "/site");
        // }

        if (this.validate()) {
            if (!findPrevPathFromBreadCrump()) {
                addToBreadCrumpData({ key: "main", name: "Sites", path: "/site" });
            }

            await handleUpdateSite(this.state.site);
            this.props.history.push(findPrevPathFromBreadCrump() || "/site");
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
                        heading={"Do you want to clear and lose all changes?"}
                        type="cancel"
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
        if (_.isEqual(this.state.initiaValues, this.state.site)) {
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
            site: {
                consultancy_user_ids: [],
                client_id: "",
                name: "",
                comments: "",
                region_id: "",
                city: "",
                country: "",
                state: "",
                street: "",
                zip_code: "",
                sort_order: ""
            },
            selectedClient: {},
            selectedConsultancyUsers: [],
            showConfirmModal: false
        });

        if (!findPrevPathFromBreadCrump()) {
            addToBreadCrumpData({ key: "main", name: "Sites", path: "/site" });
        }
        history.push(findPrevPathFromBreadCrump() || "/site");
        popBreadCrumpData();
    };

    onSelectProjects = async selectedProjects => {
        const { site } = this.state;
        let tempProjects = [];
        if (selectedProjects.length) {
            selectedProjects.map(item => tempProjects.push(item.id));
        }
        await this.setState({
            site: {
                ...site,
                project_ids: tempProjects
            },
            selectedProjects
        });
    };

    handleConsultancySelect = async e => {
        const { site } = this.state;
        await this.props.getAllClients({ consultancy_id: site.consultancy_id });
        await this.props.getAllConsultancyUsers({ consultancy_id: site.consultancy_id });
        const {
            siteReducer: {
                getAllClientsResponse: { clients },
                getAllConsultancyUsersResponse: { users: consultancy_users }
            }
        } = this.props;
        await this.setState({
            clients,
            consultancy_users: consultancy_users,
            site: {
                ...site,
                client_id: "",
                // region_id: "",
                client_user_ids: []
            }
        });
    };

    handleSelect = async address => {
        try {
            const results = await geocodeByAddress(address);
            const latLng = await getLatLng(results[0]);
            const addressComponents = results[0]?.address_components;
            const addressObj = splitAddressComponents(addressComponents);
            this.setState({
                site: {
                    ...this.state.site,
                    place: address,
                    lat: latLng?.lat,
                    long: latLng?.lng,
                    ...addressObj
                }
            });
        } catch (error) {
            console.log(error);
        }
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
        if (isLoading) return <Loader />;

        const {
            clients,
            consultancy_users,
            site,
            selectedConsultancyUsers,
            regionList,
            showErrorBorder,
            selectedSite,
            AllProjects,
            selectedProjects,
            client_users,
            selectedClientUsers,
            consultancies,
            addButton
        } = this.state;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const styles = reactCSS({
            default: {
                color: {
                    width: "40px",
                    height: "15px",
                    borderRadius: "3px",
                    background: this.state.site.color_code,
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
                    {/* <div className="add-building add-project col-md-8 m-auto"> */}
                    <div className="tab-dtl region-mng">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">{selectedSite ? "Edit Site" : "Add Site"}</li>
                        </ul>
                        <div className="tab-active build-dtl">
                            <form autocomplete="off">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            {selectedSite ? (
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Site Code</h4>
                                                        <input
                                                            type="text"
                                                            className="custom-input form-control"
                                                            value={site.code || ""}
                                                            readOnly={true}
                                                            placeholder="Enter Site code"
                                                        />
                                                    </div>
                                                </div>
                                            ) : null}
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Site Name *</h4>
                                                    <input
                                                        type="text"
                                                        className={`${
                                                            showErrorBorder && !site.name.trim().length ? "error-border " : ""
                                                        }custom-input form-control`}
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
                                            </div>
                                            {role === "super_admin" ? (
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Consultancy *</h4>
                                                        <div className="custom-selecbox">
                                                            <select
                                                                disabled={query.cty_id ? true : false}
                                                                className={`${
                                                                    showErrorBorder && (!site.consultancy_id || !site.consultancy_id.trim().length)
                                                                        ? "error-border "
                                                                        : ""
                                                                } ${
                                                                    query.cty_id ? "custom-selecbox cursor-notallowed" : "custom-selecbox"
                                                                } form-control`}
                                                                onChange={async e => {
                                                                    await this.setState({
                                                                        site: {
                                                                            ...site,
                                                                            consultancy_id: e.target.value
                                                                        }
                                                                    });
                                                                    this.handleConsultancySelect();
                                                                }}
                                                                value={site.consultancy_id}
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
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Client *</h4>
                                                        <div className="custom-selecbox">
                                                            <select
                                                                disabled={query.c_id ? true : false}
                                                                className={`${
                                                                    showErrorBorder && !site.client_id.trim().length ? "error-border " : ""
                                                                } ${
                                                                    query.c_id ? "custom-selecbox cursor-notallowed" : "custom-selecbox"
                                                                } form-control`}
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
                                                </div>
                                            )}
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Region *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            disabled={query.r_id ? true : false}
                                                            className={`${showErrorBorder && !site.region_id.trim().length ? "error-border " : ""} ${
                                                                query.r_id ? "custom-selecbox cursor-notallowed" : "custom-selecbox"
                                                            }  form-control`}
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
                                            </div>
                                            <div className="col-md-3 basic-box">
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
                                            <div className="col-md-3 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Color</h4>
                                                    <div>
                                                        <div class="close-icon-right position-relative">
                                                            <span
                                                                onClick={e =>
                                                                    this.setState({
                                                                        site: {
                                                                            ...site,
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
                                                                    color={this.state.site.color_code}
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
                                            <div className="col-md-3 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Export Sort Order</h4>
                                                    <NumberFormat
                                                        autoComplete={"nope"}
                                                        value={site.sort_order}
                                                        thousandSeparator={false}
                                                        className="custom-input form-control"
                                                        placeholder="Order"
                                                        format="######"
                                                        onValueChange={values => {
                                                            const { value } = values;
                                                            this.setState({
                                                                site: {
                                                                    ...site,
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
                                            {role === "client_user" ? (
                                                ""
                                            ) : (
                                                <div className="col-md-3 basic-box comment-form">
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
                                            <div className="col-md-3 basic-box">
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

                                            <div className="col-md-6 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Comments</h4>
                                                    <textarea
                                                        autoComplete="nope"
                                                        placeholder="Comments"
                                                        className="custom-input form-control"
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
                                        </div>
                                    </div>

                                    <div className="basic-otr">
                                        <div className="col-md-12 hed-dtl">
                                            <div className="col-md-12 basic-dtl">
                                                <h3>Address</h3>
                                            </div>
                                        </div>
                                        <div className="basic-dtl-otr adr-sec">
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Location</h4>
                                                    <PlacesAutocomplete
                                                        value={site.place}
                                                        onChange={address => {
                                                            this.setState({
                                                                site: {
                                                                    ...site,
                                                                    place: address
                                                                }
                                                            });
                                                        }}
                                                        onSelect={this.handleSelect}
                                                    >
                                                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                            <div className="autocompleteOuter">
                                                                <input
                                                                    {...getInputProps({
                                                                        placeholder: "Location",
                                                                        className: "custom-input form-control"
                                                                    })}
                                                                />
                                                                <div className="autocomplete-dropdown-container">
                                                                    {loading && <div className="loader">Loading...</div>}
                                                                    {suggestions.map((suggestion, suggKey) => {
                                                                        const className = suggestion.active
                                                                            ? "suggestion-item--active"
                                                                            : "suggestion-item";
                                                                        return (
                                                                            <div
                                                                                {...getSuggestionItemProps(suggestion, {
                                                                                    className
                                                                                })}
                                                                            >
                                                                                <span key={suggKey}>{suggestion.description}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </PlacesAutocomplete>
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Street</h4>
                                                    <input
                                                        type="text"
                                                        autoComplete="nope"
                                                        value={site.street}
                                                        onChange={e =>
                                                            this.setState({
                                                                site: {
                                                                    ...site,
                                                                    street: e.target.value
                                                                }
                                                            })
                                                        }
                                                        className="custom-input form-control"
                                                        placeholder="Street"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>City</h4>
                                                    <input
                                                        type="text"
                                                        autoComplete="nope"
                                                        value={site.city}
                                                        onChange={e =>
                                                            this.setState({
                                                                site: {
                                                                    ...site,
                                                                    city: e.target.value
                                                                }
                                                            })
                                                        }
                                                        className="custom-input form-control"
                                                        placeholder="City"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>State</h4>
                                                    <div className="custom-selecbox">
                                                        <RegionDropdown
                                                            autocomplete="off"
                                                            className="custom-selecbox"
                                                            defaultOptionLabel="Select State"
                                                            country={site.country || "select"}
                                                            value={site.state}
                                                            onChange={state =>
                                                                this.setState({
                                                                    site: {
                                                                        ...site,
                                                                        state: state
                                                                    }
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Country</h4>
                                                    <div className="custom-selecbox">
                                                        <CountryDropdown
                                                            autocomplete="off"
                                                            className="custom-selecbox"
                                                            defaultOptionLabel="Select Country"
                                                            value={site.country}
                                                            onChange={country =>
                                                                this.setState({
                                                                    site: {
                                                                        ...site,
                                                                        country: country
                                                                    }
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Zip Code</h4>
                                                    <NumberFormat
                                                        autoComplete={"nope"}
                                                        value={site.zip_code}
                                                        thousandSeparator={false}
                                                        className="custom-input form-control"
                                                        placeholder="Zipcode"
                                                        format="######"
                                                        onValueChange={values => {
                                                            const { value } = values;

                                                            this.setState({
                                                                site: {
                                                                    ...site,
                                                                    zip_code: value
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Latitude</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        value={site.lat}
                                                        type="text"
                                                        className="custom-input form-control"
                                                        placeholder="Latitude"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Longitude</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        value={site.long}
                                                        type="text"
                                                        className="custom-input form-control"
                                                        placeholder="Longitude"
                                                        readOnly
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
                                {selectedSite ? (
                                    <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.updateSite()}>
                                        Update Site
                                    </button>
                                ) : (
                                    <button
                                        disabled={addButton}
                                        type="button"
                                        className="btn btn-primary btnRgion col-md-2"
                                        onClick={() => this.addSite()}
                                    >
                                        Add New Site
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* </div> */}
                </div>
                {this.renderMultiSelectionModal()}
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { siteReducer } = state;
    return { siteReducer };
};

export default withRouter(connect(mapStateToProps, { ...siteActions })(From));
