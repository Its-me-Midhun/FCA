import React, { Component } from "react";
import { connect } from "react-redux";
import { Multiselect } from "multiselect-react-dropdown";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";
import _ from "lodash";
import { CountryDropdown, RegionDropdown, CountryRegionData } from "react-country-region-selector";
import qs from "query-string";
import reactCSS from "reactcss";
import BuildingActions from "../actions";
import ProjectActions from "../../project/actions";
import BuildingTypeActions from "../../buildingtype/actions";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import {
    popBreadCrumpData,
    findPrevPathFromBreadCrump,
    findPrevPathFromBreadCrumpRecData,
    addToBreadCrumpData,
    splitAddressComponents
} from "../../../config/utils";
import exclmIcon from "../../../assets/img/recom-icon.svg";
import { SketchPicker } from "react-color";
import Loader from "../../common/components/Loader";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { MultiSelectionModal } from "../../common/components/MultiSelectionModal";

class BuildingModal extends Component {
    constructor(props) {
        super(props);
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        this.state = {
            isLoading: true,
            errorMessage: "",
            showErrorBorder: false,
            clients: "",
            buildingtypes: "",
            consultancy_users: [],
            client_users: [],
            consultancies: "",
            building: {
                name: "",
                code: "",
                site_id: query.s_id || "",
                client_id: query.c_id || "",

                region_id: query.r_id || "",
                consultancy_id: query.cty_id || "",
                zip_code: "",
                city: "",
                state: "",
                year: "",
                main_building_type_id: "",
                ownership: "",
                ownership_type: "",
                use: "",
                division: "",
                area: "",
                cost: "",
                enterprise_index: "",
                fca: "",
                manager: "",
                street: "",
                country: "United States",
                ministry: "",
                hospital_name: "",
                description: "",
                comments: "",
                number: "",
                project_ids: [],
                client_user_ids: [],
                removed_users: [],
                color_code: "",
                sort_order: "",
                crv: 0,
                major_renovation_year: "",
                secondary_use: "",
                sector: "",
                internal_group: "",
                lat: "",
                long: "",
                place: ""
            },
            showPicker: false,
            initiaValues: {},
            selectedClient: {},
            selectedRegion: {},
            regionList: [],
            siteList: [],
            selectedConsultancyUsers: [],
            selectedClientUsers: [],
            AllProjects: "",
            selectedProjects: [],
            breadCrumbsData: [
                { key: "main", name: "Buildings", path: "/building" },
                { key: "form", name: "Add building", path: "/building/add" }
            ],
            selectedBuilding: props.match.params.id,
            showConfirmModal: false,
            initialConsultancyUsers: [],
            initialClientUsers: [],
            addButton: false,
            multiSelectionModalParams: {}
        };
    }

    componentDidMount = async () => {
        let role = localStorage.getItem("role");
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        if (query.p_id) {
            this.props.getMiscSettings(query.p_id);
        }
        await this.props.getAllBuildingDropdowns();

        if (role === "client_user") {
            await Promise.all([
                this.props.getRegionsBasedOnClient({ client_id: this.state.building.client_id }),
                this.props.getBuildingTypesBasedOnClient({ client_id: this.state.building.client_id }),
                this.props.getAllClientUsers(),
                this.props.getProjectsBasedOnClient("")
            ]);
            const {
                buildingReducer: {
                    getBuildingTypesBasedOnClientResponse: { building_types: buildingtypes },
                    getRegionsBasedOnClientResponse: { regions: regionList },
                    getAllClientUsersResponse: { client_users },
                    getProjectsBasedOnClientResponse: { projects: AllProjects }
                }
            } = this.props;
            await this.setState({
                regionList,
                buildingtypes,
                client_users,
                AllProjects
            });
        }

        if (this.state.building.consultancy_id && (role === "super_admin" || role === "consultancy_user")) {
            await Promise.all([
                this.props.BuildinggetAllClients({ consultancy_id: this.state.building.consultancy_id }),
                this.props.getBuildingTypesBasedOnClient({ client_id: this.state.building.client_id }),
                this.props.getProjectsBasedOnClient({ client_id: this.state.building.client_id }),
                this.props.getAllBuldingConsultancyUsers({ consultancy_id: this.state.building.consultancy_id }),
                this.props.getAllClientUsers(this.state.building.client_id)
            ]);

            const {
                buildingReducer: {
                    getBuildingTypesBasedOnClientResponse: { building_types: buildingtypes },
                    getProjectsBasedOnClientResponse: { projects: AllProjects },
                    getAllClientsResponse: { clients },
                    getAllConsultancyUsersResponse: { users: consultancy_users },
                    getAllClientUsersResponse: { client_users }
                }
            } = this.props;
            let tempUserOptions = [];
            if (consultancy_users && consultancy_users.length) {
                consultancy_users.map(item => tempUserOptions.push({ name: item.name, id: item.id }));
            }

            await this.setState({
                clients,
                buildingtypes,
                AllProjects,
                consultancy_users: tempUserOptions,
                client_users,
                // -----------for defaultproject----------
                selectedProjects: AllProjects,
                building: {
                    ...this.state.building,
                    project_ids: this.state.selectedProjects ? AllProjects && AllProjects[0].id : []
                }
                // --------------------------
            });
        }

        const {
            buildingReducer: {
                //getAllConsultancyUsersResponse: { users: consultancy_users },
                getAllClientsResponse: { clients },
                getAllConsultanciesDropdownResponse: { consultancies }
                // getAllCountriesResponse
            }
        } = this.props;
        //let role = localStorage.getItem("role");
        if (this.state.building.client_id) {
            await this.props.getRegionsBasedOnClient({ client_id: this.state.building.client_id });
            const {
                buildingReducer: {
                    getRegionsBasedOnClientResponse: { regions: regionList }
                }
            } = this.props;
            await this.props.getSitesBasedOnRegion(this.state.building.region_id);
            const {
                buildingReducer: {
                    getSitesBasedOnRegionResponse: { sites: siteList }
                }
            } = this.props;
            await this.setState({
                regionList,
                siteList
            });
        }
        await this.props.getAllProjects();
        const { selectedBuilding } = this.state;
        if (selectedBuilding) {
            let newBreadCrumpData = [
                { key: "main", name: "Buildings", path: "/building" },
                { key: "form", name: "Edit building", path: "/building/edit" }
            ];
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
                        consultancy,
                        message,
                        name,
                        ownership,
                        ownership_type,
                        region,
                        site,
                        state,
                        street,
                        ministry,
                        hospital_name,
                        success,
                        use,
                        division,
                        users,
                        zip_code,
                        projects,
                        client_users,
                        color_code,
                        sort_order,
                        internal_group,
                        secondary_use,
                        sector,
                        major_renovation_year,
                        crv,
                        latitude,
                        longitude,
                        place
                    }
                }
            } = this.props;
            if (success) {
                await this.props.getAllBuldingConsultancyUsers({ consultancy_id: consultancy.id });
                const {
                    buildingReducer: {
                        getAllConsultancyUsersResponse: { users: consultancy_users }
                    }
                } = this.props;
                let tempUserOptions = [];
                if (consultancy_users && consultancy_users.length) {
                    consultancy_users.map(item => tempUserOptions.push({ name: item.name, id: item.id }));
                }
                await this.setState({ consultancy_users: tempUserOptions });
                if (role === "super_admin" || role === "consultancy_user") {
                    await this.props.BuildinggetAllClients({ consultancy_id: consultancy.id });
                    const {
                        buildingReducer: {
                            getAllClientsResponse: { clients }
                        }
                    } = this.props;
                    await this.setState({ clients });
                }
                await this.props.getAllClientUsers(client.id);
                const {
                    buildingReducer: {
                        getAllClientUsersResponse: { client_users: clientusers }
                    }
                } = this.props;
                await this.props.getRegionsBasedOnClient({ client_id: client.id });
                await this.props.getProjectsBasedOnClient({ client_id: client.id });
                await this.props.getSitesBasedOnRegion(region.id);
                const typeParam = { client_id: client.id };
                await this.props.getBuildingTypesBasedOnClient(typeParam);
                const {
                    buildingReducer: {
                        getBuildingTypesBasedOnClientResponse: { building_types: buildingtypes }
                    }
                } = this.props;
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
                const {
                    buildingReducer: {
                        getProjectsBasedOnClientResponse: { projects: AllProjects }
                    }
                } = this.props;
                await this.setState({
                    regionList,
                    AllProjects,
                    buildingtypes
                });
                let selectedConsultancyUsers = [];
                let consultancy_user_ids = [];
                if (users.length) {
                    users.map(item => selectedConsultancyUsers.push({ name: item.name, id: item.id }));
                    users.map(item => consultancy_user_ids.push(item.id));
                }
                let selectedProjects = [];
                let project_ids = [];
                if (projects.length) {
                    projects.map(item => selectedProjects.push({ name: item.name, id: item.id }));
                    projects.map(item => project_ids.push(item.id));
                }
                let selectedClientUsers = [];
                let client_user_ids = [];
                if (client_users.length) {
                    client_users.map(item => selectedClientUsers.push({ name: item.name, id: item.id }));
                    client_users.map(item => client_user_ids.push(item.id));
                }
                await this.setState({
                    selectedConsultancyUsers,
                    selectedProjects,
                    regionList,
                    siteList,
                    selectedClientUsers,
                    consultancy_users: consultancy_users,
                    client_users: clientusers,
                    building: {
                        client_id: client.id,
                        region_id: region.id,
                        site_id: site.id,
                        consultancy_user_ids,
                        client_user_ids,
                        project_ids,
                        consultancy_id: consultancy ? consultancy.id : "",
                        name,
                        code,
                        comments,
                        area,
                        main_building_type_id: building_type.id,
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
                        ministry,
                        hospital_name,
                        street,
                        use,
                        division,
                        year,
                        zip_code,
                        color_code: color_code || "",
                        sort_order,
                        secondary_use,
                        sector,
                        internal_group,
                        major_renovation_year,
                        crv,
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
        //let tempUserOptions = [];
        let tempClientOptions = [];
        // if (consultancy_users && consultancy_users.length) {
        //     consultancy_users.map(item => tempUserOptions.push({ name: item.name, id: item.id }));
        // }
        if (clients && clients.length) {
            clients.map(item => tempClientOptions.push({ label: item.name, value: item.id }));
        }
        if (this.props.location.state) {
            this.onSelectConsultancyUsers(this.props.location.state?.consultancy_users);
            // this.onSelectClientUsers(this.props.location.state?.client_users);
        }
        if (role === "consultancy_user") {
            await this.setState({ clients });
        }
        await this.setState({
            consultancies,
            //consultancy_users: tempUserOptions,
            initiaValues: this.state.building,
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
            building: {
                ...this.state.building,
                color_code: color.hex
            }
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

    onSelectClientUsers = async selectedClientUsers => {
        const { building } = this.state;
        let tempUsers = [];
        if (selectedClientUsers.length) {
            selectedClientUsers.map(item => tempUsers.push(item.id));
        }

        await this.setState({
            building: {
                ...building,
                client_user_ids: tempUsers
            },
            selectedClientUsers
        });
    };

    onSelectProjects = async selectedProjects => {
        const { building } = this.state;
        let tempProjects = [];
        if (selectedProjects.length) {
            selectedProjects.map(item => tempProjects.push(item.id));
        }
        await this.setState({
            building: {
                ...building,
                project_ids: tempProjects
            },
            selectedProjects
        });
    };

    handleClientSelect = async () => {
        const { building } = this.state;
        const typeParam = { client_id: building.client_id };
        await this.props.getBuildingTypesBasedOnClient(typeParam);
        const {
            buildingReducer: {
                getBuildingTypesBasedOnClientResponse: { building_types: buildingtypes }
            }
        } = this.props;
        await this.props.getRegionsBasedOnClient({ client_id: building.client_id });
        const {
            buildingReducer: {
                getRegionsBasedOnClientResponse: { regions: regionList }
            }
        } = this.props;
        await this.props.getProjectsBasedOnClient({ client_id: building.client_id });
        const {
            buildingReducer: {
                getProjectsBasedOnClientResponse: { projects: AllProjects }
            }
        } = this.props;
        await this.props.getAllClientUsers(building.client_id);
        const {
            buildingReducer: {
                getAllClientUsersResponse: { client_users }
            }
        } = this.props;
        await this.setState({
            AllProjects,
            client_users,
            regionList,
            buildingtypes,
            building: {
                ...building,
                region_id: "",
                main_building_type_id: "",
                site_id: "",
                project_ids: "",
                client_user_ids: []
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
        let role = localStorage.getItem("role") || "";
        this.setState({
            showErrorBorder: false
        });
        if (!building.name && !building.name.trim().length) {
            this.setState({
                errorMessage: "Please enter building name",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (role === "super_admin" && !building.consultancy_id) {
            this.setState({
                errorMessage: "Please select consultancy",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (role === "super_admin" && (!building.consultancy_id || (building.consultancy_id && !building.consultancy_id.trim().length))) {
            this.setState({
                errorMessage: "Please select consultancy",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (
            (role === "super_admin" || role === "consultancy_user") &&
            (!building.client_id || (building.client_id && !building.client_id.trim().length))
        ) {
            this.setState({
                errorMessage: "Please select client",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (
            (role === "super_admin" || role === "consultancy_user") &&
            (!building.region_id || (building.region_id && !building.region_id.trim().length))
        ) {
            this.setState({
                errorMessage: "Please select region",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (
            (role === "super_admin" || role === "consultancy_user") &&
            (!building.site_id || (building.site_id && !building.site_id.trim().length))
        ) {
            this.setState({
                errorMessage: "Please select site",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        } else if (!building.main_building_type_id || (building.main_building_type_id && !building.main_building_type_id.trim().length)) {
            this.setState({
                errorMessage: "Please select Building Type",
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }
        return true;
    };

    addBuilding = async () => {
        this.setState({ addButton: true });
        const { building } = this.state;
        const { handleAddBuilding } = this.props;
        if (this.validate()) {
            popBreadCrumpData();
            await handleAddBuilding(building);
        }
    };

    updateBuilding = async () => {
        const { building, initialConsultancyUsers, initialClientUsers } = this.state;
        const { consultancy_user_ids, client_user_ids } = this.state.building;
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
            building: {
                ...building,
                removed_users: tempRemovedUsers
            }
        });
        const { handleUpdateBuilding } = this.props;

        if (this.validate()) {
            // popBreadCrumpData();
            if (!findPrevPathFromBreadCrump()) {
                addToBreadCrumpData({
                    key: "main",
                    name: "Buildings",
                    path: "/building"
                });
            }
            await handleUpdateBuilding(this.state.building);
            await this.props.history.push(findPrevPathFromBreadCrump() || "/building");
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
        if (_.isEqual(this.state.initiaValues, this.state.building)) {
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
            building: {
                name: "",
                site_id: "",
                client_id: "",
                region_id: "",
                zip_code: "",
                city: "",
                state: "",
                year: "",
                main_building_type_id: "",
                ownership: "",
                ownership_type: "",
                use: "",
                division: "",
                area: "",
                cost: "",
                enterprise_index: "",
                fca: "",
                manager: "",
                street: "",
                country: "",
                ministry: "",
                hospital_name: "",
                description: "",
                comments: "",
                number: "",
                consultancy_user_ids: [],
                color_code: "",
                sort_order: ""
            },
            selectedConsultancyUsers: [],
            showConfirmModal: false
        });

        if (!findPrevPathFromBreadCrump()) {
            addToBreadCrumpData({ key: "main", name: "Buildings", path: "/building" });
        }
        history.push(findPrevPathFromBreadCrump() || "/building");
        popBreadCrumpData();
    };
    selectRegion(val) {
        this.setState({ state: val });
    }
    handleConsultancySelect = async e => {
        const { building } = this.state;
        await this.props.BuildinggetAllClients({ consultancy_id: building.consultancy_id });
        await this.props.getAllBuldingConsultancyUsers({ consultancy_id: building.consultancy_id });
        const {
            buildingReducer: {
                getAllClientsResponse: { clients },
                getAllConsultancyUsersResponse: { users: consultancy_users }
            }
        } = this.props;
        await this.setState({
            clients,
            consultancy_users: consultancy_users,
            building: {
                ...building,
                client_id: "",
                region_id: "",
                main_building_type_id: "",
                site_id: "",
                project_ids: "",
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
                building: {
                    ...this.state.building,
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
            building,
            selectedConsultancyUsers,
            regionList,
            siteList,
            selectedBuilding,
            showErrorBorder,
            AllProjects,
            selectedProjects,
            buildingtypes,
            client_users,
            selectedClientUsers,
            consultancies,
            addButton
        } = this.state;
        const {
            location: { search }
        } = this.props;
        const {
            primary_uses = [],
            divisions = [],
            secondary_uses = [],
            sectors = [],
            internal_groups = []
        } = this.props.projectReducer?.miscSettingsResponse?.miscellaneous || {};
        const query = qs.parse(search);
        const styles = reactCSS({
            default: {
                color: {
                    width: "40px",
                    height: "15px",
                    borderRadius: "3px",
                    background: this.state.building.color_code,
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
                            <li className="cursor-pointer active pl-4">{selectedBuilding ? "Edit Building" : "Add Building"}</li>
                        </ul>
                        <div className="tab-active build-dtl">
                            <form autocomplete="off">
                                <div className="otr-common-edit">
                                    <div className="basic-otr">
                                        <div className="col-md-12 hed-dtl">
                                            <div className="col-md-12 basic-dtl">
                                                <h3>Basic Details</h3>
                                                <div className="edit-icn-bx text-right"></div>
                                            </div>
                                        </div>
                                        <div className="basic-dtl-otr basic-sec">
                                            {selectedBuilding ? (
                                                <div className="col-md-3 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Building Code</h4>
                                                        <input
                                                            type="text"
                                                            value={building.code || ""}
                                                            className="custom-input form-control"
                                                            placeholder="Building Code"
                                                            readOnly={true}
                                                        />
                                                    </div>
                                                </div>
                                            ) : null}
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Building Name *</h4>
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
                                                        className={`${
                                                            showErrorBorder && !building?.name?.trim().length ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        placeholder="Building Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Parent Building</h4>
                                                    <input
                                                        type="text"
                                                        value={building.hospital_name || ""}
                                                        onChange={e =>
                                                            this.setState({
                                                                building: {
                                                                    ...building,
                                                                    hospital_name: e.target.value
                                                                }
                                                            })
                                                        }
                                                        className={`custom-input form-control`}
                                                        placeholder="Parent Building"
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
                                                                    showErrorBorder &&
                                                                    (!building.consultancy_id || !building.consultancy_id.trim().length)
                                                                        ? "error-border "
                                                                        : ""
                                                                }${
                                                                    query.cty_id ? "custom-selecbox cursor-notallowed" : "custom-selecbox"
                                                                } form-control`}
                                                                onChange={async e => {
                                                                    await this.setState({
                                                                        building: {
                                                                            ...building,
                                                                            consultancy_id: e.target.value
                                                                        }
                                                                    });
                                                                    this.handleConsultancySelect();
                                                                }}
                                                                value={building.consultancy_id}
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
                                                                // className={`${showErrorBorder && !building.client_id &&
                                                                //     (building.client_id && !building.client_id.trim().length)
                                                                //     ? "error-border "
                                                                //     : ""
                                                                //     }custom-selecbox`}
                                                                className={`${
                                                                    showErrorBorder && !building.client_id && !building.client_id.trim().length
                                                                        ? "error-border "
                                                                        : ""
                                                                }${query.c_id ? "custom-selecbox cursor-notallowed" : "custom-selecbox"}`}
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
                                                    <h4>Building Type *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            onChange={async e => {
                                                                await this.setState({
                                                                    building: {
                                                                        ...building,
                                                                        main_building_type_id: e.target.value
                                                                    }
                                                                });
                                                            }}
                                                            value={building.main_building_type_id}
                                                            className={`${
                                                                showErrorBorder && !building.main_building_type_id.trim().length
                                                                    ? "error-border "
                                                                    : ""
                                                            }custom-selectbox  `}
                                                        >
                                                            <option value="">Select</option>
                                                            {buildingtypes && buildingtypes.length
                                                                ? buildingtypes.map((item, i) => (
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
                                                    <h4>Region *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            disabled={query.r_id ? true : false}
                                                            className={`${
                                                                showErrorBorder && !building.region_id.trim().length ? "error-border " : ""
                                                            }${query.r_id ? "custom-selecbox cursor-notallowed" : "custom-selecbox"}  `}
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
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Site *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            disabled={query.s_id ? true : false}
                                                            className={`${showErrorBorder && !building.site_id.trim().length ? "error-border " : ""}${
                                                                query.s_id ? "custom-selecbox cursor-notallowed" : "custom-selecbox"
                                                            }  `}
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
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Description</h4>
                                                    <textarea
                                                        placeholder="Description"
                                                        value={building.description || ""}
                                                        onChange={e =>
                                                            this.setState({
                                                                building: {
                                                                    ...building,
                                                                    description: e.target.value
                                                                }
                                                            })
                                                        }
                                                        className="custom-input form-control"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Building Number</h4>
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
                                                        className={`custom-input form-control`}
                                                        placeholder="Building No"
                                                    />
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
                                            {role === "client_user" ? (
                                                ""
                                            ) : (
                                                <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>Consultancy Users</h4>
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
                                                    <h4>Client Users</h4>
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
                                                                        building: {
                                                                            ...building,
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
                                                                    color={this.state.building.color_code}
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
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Export Sort Order</h4>
                                                    <NumberFormat
                                                        autocomplete="off"
                                                        value={parseInt(building.sort_order)}
                                                        thousandSeparator={true}
                                                        decimalScale={0}
                                                        className="custom-input form-control"
                                                        placeholder="Export Sort Order"
                                                        onValueChange={values => {
                                                            const { value } = values;
                                                            this.setState({
                                                                building: {
                                                                    ...building,
                                                                    sort_order: value
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="basic-otr">
                                        <div className="col-md-12 hed-dtl">
                                            <div className="col-md-12 basic-dtl">
                                                <h3>More Details</h3>
                                                <div className="edit-icn-bx text-right"></div>
                                            </div>
                                        </div>
                                        <div className="basic-dtl-otr more-sec">
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Area (Sq Ft)</h4>
                                                    <NumberFormat
                                                        autocomplete="off"
                                                        value={parseInt(building.area)}
                                                        thousandSeparator={true}
                                                        decimalScale={0}
                                                        className="custom-input form-control"
                                                        placeholder="Area"
                                                        onValueChange={values => {
                                                            const { value } = values;
                                                            this.setState({
                                                                building: {
                                                                    ...building,
                                                                    area: value,
                                                                    crv: parseFloat(value) * parseFloat(building.cost || 0)
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
                                                        value={building.cost}
                                                        thousandSeparator={true}
                                                        decimalScale={0}
                                                        className="custom-input form-control"
                                                        placeholder="Cost"
                                                        prefix={building.cost && building.cost.length ? "$ " : ""}
                                                        onValueChange={values => {
                                                            const { value } = values;
                                                            this.setState({
                                                                building: {
                                                                    ...building,
                                                                    cost: value,
                                                                    crv: parseFloat(value) * parseFloat(building.area || 0)
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
                                                        disabled={true}
                                                        value={parseInt(building.crv)}
                                                        thousandSeparator={true}
                                                        decimalScale={0}
                                                        className="custom-input form-control cursor-diabled"
                                                        placeholder="CRV"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Year Built</h4>
                                                    <NumberFormat
                                                        value={building.year}
                                                        autocomplete="off"
                                                        thousandSeparator={false}
                                                        className="custom-input form-control"
                                                        placeholder="Year Built"
                                                        format="####"
                                                        onValueChange={values => {
                                                            const { value } = values;
                                                            if (parseInt(value.length) < 6) {
                                                                this.setState({
                                                                    building: {
                                                                        ...building,
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
                                                    <h4>Year of Major Renovation</h4>
                                                    <NumberFormat
                                                        value={building.major_renovation_year}
                                                        autocomplete="off"
                                                        thousandSeparator={false}
                                                        className="custom-input form-control"
                                                        placeholder="Year of Major Renovation"
                                                        format="####"
                                                        onValueChange={values => {
                                                            const { value } = values;
                                                            if (parseInt(value.length) < 6) {
                                                                this.setState({
                                                                    building: {
                                                                        ...building,
                                                                        major_renovation_year: value
                                                                    }
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Enterprise Index</h4>
                                                    <input
                                                        type="text"
                                                        autoComplete="nope"
                                                        value={building.enterprise_index}
                                                        onChange={e =>
                                                            this.setState({
                                                                building: {
                                                                    ...building,
                                                                    enterprise_index: e.target.value
                                                                }
                                                            })
                                                        }
                                                        className="custom-input form-control"
                                                        placeholder="Enterprise Index"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Ownership</h4>
                                                    <input
                                                        type="text"
                                                        autoComplete="nope"
                                                        value={building.ownership}
                                                        onChange={e =>
                                                            this.setState({
                                                                building: {
                                                                    ...building,
                                                                    ownership: e.target.value
                                                                }
                                                            })
                                                        }
                                                        className="custom-input form-control"
                                                        placeholder="Ownership"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Ownership Type</h4>
                                                    <input
                                                        type="text"
                                                        autoComplete="nope"
                                                        value={building.ownership_type}
                                                        onChange={e =>
                                                            this.setState({
                                                                building: {
                                                                    ...building,
                                                                    ownership_type: e.target.value
                                                                }
                                                            })
                                                        }
                                                        className="custom-input form-control"
                                                        placeholder="Ownership Type"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Manager</h4>
                                                    <input
                                                        type="text"
                                                        autoComplete="nope"
                                                        value={building.manager}
                                                        onChange={e =>
                                                            this.setState({
                                                                building: {
                                                                    ...building,
                                                                    manager: e.target.value
                                                                }
                                                            })
                                                        }
                                                        className="custom-input form-control"
                                                        placeholder="Manager"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Ministry</h4>
                                                    <input
                                                        type="text"
                                                        autoComplete="nope"
                                                        value={building.ministry || ""}
                                                        onChange={e =>
                                                            this.setState({
                                                                building: {
                                                                    ...building,
                                                                    ministry: e.target.value
                                                                }
                                                            })
                                                        }
                                                        className={`custom-input form-control`}
                                                        placeholder="Ministry"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Primary Use</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            className={`custom-selecbox form-control`}
                                                            value={building.use}
                                                            onChange={e =>
                                                                this.setState({
                                                                    building: {
                                                                        ...building,
                                                                        use: e.target.value
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {primary_uses?.map((item, i) => (
                                                                <option value={item} key={i}>
                                                                    {item}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Secondary Use</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            className={`custom-selecbox form-control`}
                                                            value={building.secondary_use}
                                                            onChange={e =>
                                                                this.setState({
                                                                    building: {
                                                                        ...building,
                                                                        secondary_use: e.target.value
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {secondary_uses?.map((item, i) => (
                                                                <option value={item} key={i}>
                                                                    {item}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Sector</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            className={`custom-selecbox form-control`}
                                                            value={building.sector}
                                                            onChange={e =>
                                                                this.setState({
                                                                    building: {
                                                                        ...building,
                                                                        sector: e.target.value
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {sectors?.map((item, i) => (
                                                                <option value={item} key={i}>
                                                                    {item}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Internal Group</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            className={`custom-selecbox form-control`}
                                                            value={building.internal_group}
                                                            onChange={e =>
                                                                this.setState({
                                                                    building: {
                                                                        ...building,
                                                                        internal_group: e.target.value
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {internal_groups?.map((item, i) => (
                                                                <option value={item} key={i}>
                                                                    {item}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Division</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            className={`custom-selecbox form-control`}
                                                            value={building.division}
                                                            onChange={e =>
                                                                this.setState({
                                                                    building: {
                                                                        ...building,
                                                                        division: e.target.value
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {divisions?.map((item, i) => (
                                                                <option value={item} key={i}>
                                                                    {item}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
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
                                                        value={building.place}
                                                        onChange={address => {
                                                            this.setState({
                                                                building: {
                                                                    ...building,
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
                                                        value={building.street}
                                                        onChange={e =>
                                                            this.setState({
                                                                building: {
                                                                    ...building,
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
                                                        value={building.city}
                                                        onChange={e =>
                                                            this.setState({
                                                                building: {
                                                                    ...building,
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
                                                            country={building.country || "select"}
                                                            value={building.state}
                                                            onChange={state =>
                                                                this.setState({
                                                                    building: {
                                                                        ...building,
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
                                                            value={building.country}
                                                            onChange={country =>
                                                                this.setState({
                                                                    building: {
                                                                        ...building,
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
                                                    <input
                                                        autoComplete={"nope"}
                                                        value={building.zip_code}
                                                        type="text"
                                                        className="custom-input form-control"
                                                        placeholder="Zip Code"
                                                        onChange={e => {
                                                            this.setState({
                                                                building: {
                                                                    ...building,
                                                                    zip_code: e.target.value
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
                                                        value={building.lat}
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
                                                        value={building.long}
                                                        type="text"
                                                        className="custom-input form-control"
                                                        placeholder="Longitude"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box comments">
                                                <div className="codeOtr">
                                                    <h4>Comments</h4>
                                                    <textarea
                                                        autoComplete="nope"
                                                        placeholder="Comments"
                                                        value={building.comments || ""}
                                                        onChange={e =>
                                                            this.setState({
                                                                building: {
                                                                    ...building,
                                                                    comments: e.target.value
                                                                }
                                                            })
                                                        }
                                                        className="custom-input form-control"
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
                                {selectedBuilding ? (
                                    <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.updateBuilding()}>
                                        Update Building
                                    </button>
                                ) : (
                                    <button
                                        disabled={addButton}
                                        type="button"
                                        className="btn btn-primary btnRgion col-md-2"
                                        onClick={() => this.addBuilding()}
                                    >
                                        Add Building
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderMultiSelectionModal()}
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { buildingReducer, projectReducer, buildingTypeReducer } = state;
    return { buildingReducer, projectReducer, buildingTypeReducer };
};

export default withRouter(connect(mapStateToProps, { ...BuildingActions, ...ProjectActions, ...BuildingTypeActions })(BuildingModal));
