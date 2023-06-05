import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";

import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import regionAction from "../../region/actions";
import { addToBreadCrumpData, popBreadCrumpData, findPrevPathFromBreadCrump } from "../../../config/utils";
import clientActions from "../../client/actions";
import initiativeActions from "../../initiatives/actions";
import buildingActions from "../../building/actions";
import floorAction from "../../floor/actions";
import RecommendationAction from "../../recommendations/actions";
import actions from "../actions";
import DocumentUpload from "./documentsModal";
import Iframe from "react-iframe";
import siteActons from "../../site/actions";
import exclmIcon from "../../../assets/img/recom-icon.svg";

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
            roles: "",
            reports: {
                identifier: "",
                file_name: "",
                code: "",
                file: "",
                description: "",
                document_type_id: "",
                file_type: "",
                consultancy_id: query.cty_id || "",
                client_id: query.c_id || "",
                project_id: query.p_id || "",
                region_id: query.r_id || "",
                site_id: query.s_id || "",
                building_id: query.b_id || "",
                floor_id: "",
                recommendation_id: query.rec_id || "",
                initiative_id: query.i_id || "",
                notes: "",
                version_no: "",
                url: ""
            },
            initiaValues: {},
            selectedDocument: props.selectedDocument || this.props.match.params.id,
            showConfirmModal: false,
            showErrorBorder: false,
            imageUploadModal: false,
            selectedImage: "",
            uploadError: "",
            attachmentChanged: false,
            selectedProjects: [],
            selectedBuildings: [],
            passwordMessage: "",
            role_name: "",
            addButton: false,
            regions: [],
            siteList: [],
            buildings: [],
            documentChanged: false,
            isProjectUpdated: false
        };
    }

    componentDidMount = async () => {
        const {
            selectedDocument,
            reports: { consultancy_id, client_id, region_id, site_id, document_type_id, building_id, project_id }
        } = this.state;
        await this.props.getAllConsultanciesDropdown();

        const {
            siteReducer: {
                getAllConsultanciesDropdownResponse: { consultancies }
            }
        } = this.props;

        if (selectedDocument) {
            await this.props.getDataById(selectedDocument);
            const {
                reportReducer: {
                    getDocumentsByIdResponse: {
                        identifier,
                        file_name,
                        code,
                        file,
                        url,
                        description,
                        document_type,
                        file_type,
                        consultancy,
                        client,
                        project,
                        region,
                        site,
                        building,
                        floor,
                        recommendation,
                        initiative,
                        notes,
                        version_no,
                        success
                    }
                }
            } = this.props;

            if (success) {
                if (consultancy && consultancy.id) {
                    this.getClientsDropDownData(consultancy?.id, client?.id);
                }
                if (client && client.id) {
                    await this.props.getAllProjectsDropdown({ client_id: client.id });
                    this.props.getAllDocuments({ client_id: client.id });
                }
                if (region && region.id) {
                    this.getSiteDropDownData(region.id);
                }
                if (site && site.id) {
                    this.getBuildingDropDownData(site.id, project?.id);
                }
                if (building && building.id) {
                    await this.props.getFloorBasedOnBuilding(building.id);
                }
                if (building && building.id) {
                    await this.props.getFloorBasedOnBuilding(building.id);
                }
                if (project && project.id) {
                    await this.props.getRecommendationDropdown({ project_id: project.id });
                    await this.props.getInitiativeDropdown({ project_id: project.id });
                    this.getRegionDropDownData({ project_id: project.id, client_id: client.id });
                }
                if (initiative && initiative.id) {
                    await this.props.getRecommendationDropdown({ project_id: project.id, initiative_id: initiative.id });
                }

                await this.setState({
                    reports: {
                        code,
                        // file: url,
                        file_id: file,
                        consultancy_id: consultancy ? consultancy.id : null,
                        client_id: client ? client.id : null,
                        identifier,
                        file_name,
                        description,
                        document_type_id: document_type ? document_type.id : null,
                        file_type,
                        project_id: project ? project.id : null,
                        region_id: region ? region.id : null,
                        site_id: site ? site.id : null,
                        building_id: building ? building.id : null,
                        floor_id: floor ? floor.id : null,
                        recommendation_id: recommendation ? recommendation.id : null,
                        initiative_id: initiative ? initiative.id : null,
                        notes,
                        version_no: version_no,
                        url
                    },
                    selectedImage: url
                });
            }
        } else {
            if (consultancy_id) {
                this.getClientsDropDownData(consultancy_id, client_id);
            }
            if (client_id) {
                await this.props.getAllProjectsDropdown({ client_id: this.state.reports.client_id });
                this.props.getAllDocuments({ client_id: this.state.reports.client_id });
            }
            if (region_id) {
                this.getSiteDropDownData(region_id);
            }
            if (site_id) {
                this.getBuildingDropDownData(site_id);
            }
            if (project_id) {
                await this.props.getRecommendationDropdown({ project_id: project_id });
                await this.props.getInitiativeDropdown({ project_id: project_id });
                this.getRegionDropDownData({ project_id: project_id, client_id: client_id });
            }
            if (building_id) {
                await this.props.getFloorBasedOnBuilding(building_id);
            }
        }

        await this.setState({
            initiaValues: this.state.reports,
            consultancies,
            isLoading: false
        });
    };

    validate = () => {
        let role = localStorage.getItem("role");
        const { reports, documentChanged } = this.state;
        this.setState({
            showErrorBorder: false
        });

        if (role === "super_admin" && !reports.consultancy_id) {
            this.setState({
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }
        if (role === "super_admin" && !reports.client_id) {
            this.setState({
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }
        if (documentChanged && !reports.file) {
            this.setState({
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }
        if (!reports.file_name) {
            this.setState({
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }
        if (!reports.description) {
            this.setState({
                showErrorBorder: true,
                addButton: false
            });
            return false;
        }

        return true;
    };

    addDocument = async () => {
        this.setState({ addButton: true });
        const { reports, documentChanged } = this.state;
        const { handleAddDocument } = this.props;
        if (this.validate()) {
            await handleAddDocument(reports, documentChanged);
        }
    };

    updateDocument = async () => {
        const { reports, documentChanged } = this.state;
        const { handleUpdateDocument } = this.props;

        if (this.validate()) {
            await handleUpdateDocument(reports, documentChanged);
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
        if (_.isEqual(this.state.initiaValues, this.state.reports)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        const { history } = this.props;
        this.setState({
            reports: {
                name: ""
            }
        });
        if (!findPrevPathFromBreadCrump()) {
            addToBreadCrumpData({ key: "main", name: "reports", path: "/documents" });
        }
        history.push(findPrevPathFromBreadCrump() || "/documents");
        popBreadCrumpData();
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };
    handleAddAttachment = e => {
        this.setState({
            imageUploadModal: true
        });
    };

    handleImage = e => {};

    deleteImage = () => {
        this.setState({
            attachmentChanged: true,
            reports: {
                ...this.state.reports,
                image: null,
                img_desc: null,
                image_id: null,
                image_name: ""
            },
            selectedImage: null
        });
    };

    handleAddImage = imageData => {
        this.setState({
            uploadError: "",
            imageUploadModal: false
        });
        if (!imageData.file.url) {
            let ext = imageData.file.name.split(".").pop();
            this.setState({
                attachmentChanged: true,
                reports: {
                    ...this.state.reports,
                    file: imageData.file,
                    file_type: ext,
                    file_name: imageData.file.name
                },
                previewImage: URL.createObjectURL(imageData.file),
                documentChanged: true
            });
        } else if (imageData.comments) {
            this.setState({
                reports: {
                    ...this.state.reports,
                    img_desc: imageData.comments,
                    documentChanged: true
                }
            });
        }
    };

    handleConsultancySelect = async e => {
        this.setState({
            reports: {
                ...this.state.reports,
                consultancy_id: e.target.value
            }
        });
        this.getClientsDropDownData(e.target.value);
    };

    getClientsDropDownData = async (consultancyId, clientId = "") => {
        let param = {
            consultancy_id: consultancyId
        };
        await this.props.getAllClients(param);
        const {
            getAllClientsResponse: { clients }
        } = this.props.regionReducer;
        this.setState({
            clients,
            reports: {
                ...this.state.reports,
                client_id: clientId,
                document_type_id: ""
            }
        });
    };

    getRegionDropDownData = async params => {
        await this.props.getAllRegionDropdownDocument(params);
        const {
            reportReducer: {
                getAllRegionDropdownDocument: { regions: regionList }
            }
        } = this.props;
        this.setState({
            regions: regionList
        });
    };

    getSiteDropDownData = async regionId => {
        // await this.props.getSitesBasedOnRegion(regionId);
        // const {
        //     buildingReducer: {
        //         getSitesBasedOnRegionResponse: { sites: siteList }
        //     }
        // } = this.props;
        await this.props.getSitesByRegionInDocuments(regionId);
        const {
            reportReducer: {
                getSitesByRegionResponse: { sites: siteList }
            }
        } = this.props;
        this.setState({
            siteList,
            reports: {
                ...this.state.reports
            }
        });
    };

    getBuildingDropDownData = async (siteId, projectId) => {
        await this.props.getAllBuildingsDropdown({ site_id: siteId, project_id: this.state.reports.project_id || projectId });
        const {
            getAllBuildingsDropdownResponse: { buildings }
        } = this.props.floorReducer;
        this.setState({
            buildings
        });
    };

    handleProjectSelect = async () => {
        await this.props.getAllRegionDropdownDocument({ project_id: this.state.reports.project_id, client_id: this.state.reports.client_id });
        await this.props.getRecommendationDropdown({ project_id: this.state.reports.project_id });
        await this.props.getInitiativeDropdown({ project_id: this.state.reports.project_id });
        const {
            reportReducer: {
                getAllRegionDropdownDocument: { regions: regionList }
            }
        } = this.props;
        this.setState({
            regions: regionList,
            isProjectUpdated: true,
            reports: {
                ...this.state.reports,
                region_id: "",
                site_id: "",
                building_id: "",
                floor_id: "",
                recommendation_id: "",
                initiative_id: ""
            }
        });
    };
    handleDropdownSelect = async () => {
        await this.props.getAllRegionDropdownDocument({ project_id: this.state.reports.project_id, client_id: this.state.reports.client_id });
        await this.props.getRecommendationDropdown({ project_id: this.state.reports.project_id });
        await this.props.getInitiativeDropdown({ project_id: this.state.reports.project_id });
        const {
            reportReducer: {
                getAllRegionDropdownDocument: { regions: regionList }
            }
        } = this.props;
        this.setState({
            regions: regionList,
            isProjectUpdated: true,
            reports: {
                ...this.state.reports,
                region_id: "",
                site_id: "",
                building_id: "",
                floor_id: "",
                recommendation_id: "",
                initiative_id: ""
            }
        });
    };
    handleClientChange = async id => {
        // await this.props.getAllRegionDropdownDocument({ client_id: id });
        await this.props.getAllProjectsDropdown({ client_id: this.state.reports.client_id });
        await this.props.getAllDocuments({ client_id: this.state.reports.client_id });

        // const {
        //     reportReducer: {
        //         getAllRegionDropdownDocument: { regions: regionList }
        //     }
        // } = this.props;
        this.setState({
            // regions: regionList,
            project_id: "",
            document_type_id: ""
        });
    };

    handleRegionSelect = async () => {
        const { reports } = this.state;
        // await this.props.getSitesBasedOnRegion(reports.region_id);
        // const {
        //     buildingReducer: {
        //         getSitesBasedOnRegionResponse: { sites: siteList }
        //     }
        // } = this.props;
        await this.props.getSitesByRegionInDocuments(reports.region_id);
        const {
            reportReducer: {
                getSitesByRegionResponse: { sites: siteList }
            }
        } = this.props;
        this.setState({
            siteList,
            reports: {
                ...this.state.reports,
                site_id: ""
            }
        });
    };

    handleSiteSelect = async e => {
        await this.props.getAllBuildingsDropdown({ site_id: this.state.reports.site_id, project_id: this.state.reports.project_id });
        const {
            getAllBuildingsDropdownResponse: { buildings }
        } = this.props.floorReducer;
        this.setState({
            buildings,
            reports: {
                ...this.state.reports,
                building_id: ""
            }
        });
    };

    handleBuilding = async () => {
        await this.props.getFloorBasedOnBuilding(this.state.reports.building_id);
        this.setState({
            reports: {
                ...this.state.reports,
                floor_id: ""
            }
        });
    };

    handleInitiativeSelect = async () => {
        await this.props.getRecommendationDropdown({ project_id: this.state.reports.project_id, initiative_id: this.state.reports.initiative_id });
    };

    render() {
        let role = localStorage.getItem("role");
        const { initiativeDropdown, recommendationDropdown, getAllDocumentResponse } = this.props.reportReducer;
        const { getAllProjectsDropdown } = this.props.initativeReducer;

        const { reports, siteList, buildings, regions, showErrorBorder, consultancies, clients, addButton, selectedDocument, isProjectUpdated } =
            this.state;
        let isImage = false;
        const imgExt = ["png", "jpg", "ttf", "jpeg", "svg"];
        if (this.state.reports.file_type) {
            if (imgExt.includes(this.state.reports.file_type.toLowerCase())) {
                isImage = true;
            }
        }
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);

        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng usr-pg">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">{selectedDocument ? "Edit Document" : "Add Document"}</li>
                        </ul>

                        <div className="tab-active location-sec recom-sec main-dtl p-0">
                            <form autocomplete="off">
                                <div className="otr-common-edit custom-col">
                                    <div className="row m-0">
                                        <div className="col-md-8 pl-0">
                                            <div className="basic-otr">
                                                <div className="basic-dtl-otr basic-sec p-0">
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Identifier</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`form-control custom-input`}
                                                                value={reports.identifier}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        reports: {
                                                                            ...reports,
                                                                            identifier: e.target.value
                                                                        }
                                                                    })
                                                                }
                                                                placeholder="Identifier"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>File Name *</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`${
                                                                    showErrorBorder && !reports.file_name.trim().length ? "error-border " : ""
                                                                } custom-input form-control cursor-notallowed`}
                                                                value={reports.file_name}
                                                                readOnly={true}
                                                                placeholder="File Name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>File Type *</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`${
                                                                    showErrorBorder && !reports.file_type.trim().length ? "error-border " : ""
                                                                } custom-input form-control cursor-notallowed`}
                                                                value={reports.file_type}
                                                                readOnly={true}
                                                                placeholder="File Name"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* {role === "super_admin" ? ( */}
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Consultancy *</h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    disabled={query.cty_id ? true : false}
                                                                    autoComplete="nope"
                                                                    className={`${
                                                                        showErrorBorder && !reports.consultancy_id.trim().length
                                                                            ? "error-border "
                                                                            : ""
                                                                    }custom-selecbox ${query.cty_id ? "cursor-notallowed" : ""} form-control`}
                                                                    onChange={async e => {
                                                                        this.handleConsultancySelect(e);
                                                                    }}
                                                                    value={reports.consultancy_id}
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
                                                    {/* ) : null} */}
                                                    {/* {role === "client_user" ? null : ( */}
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Client *</h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    disabled={query.c_id ? true : false}
                                                                    autoComplete="nope"
                                                                    className={`${
                                                                        showErrorBorder && !reports.client_id.trim().length ? "error-border " : ""
                                                                    }custom-selecbox ${query.c_id ? "cursor-notallowed" : ""} form-control`}
                                                                    onChange={async e => {
                                                                        await this.setState(
                                                                            {
                                                                                reports: {
                                                                                    ...reports,
                                                                                    document_type_id: "",
                                                                                    client_id: e.target.value
                                                                                }
                                                                            },
                                                                            () => this.handleClientChange(this.state.reports.client_id)
                                                                        );
                                                                    }}
                                                                    value={reports.client_id}
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
                                                    {/* )} */}
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Document Type *</h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    autoComplete="nope"
                                                                    className={`${
                                                                        showErrorBorder && !reports.document_type_id ? "error-border " : ""
                                                                    }custom-selecbox form-control" : ""}`}
                                                                    onChange={async e => {
                                                                        await this.setState({
                                                                            reports: {
                                                                                ...reports,
                                                                                document_type_id: e.target.value
                                                                            }
                                                                        });
                                                                        //  await this.handleProjectSelect();
                                                                    }}
                                                                    value={reports.document_type_id}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {getAllDocumentResponse &&
                                                                    getAllDocumentResponse.document_types &&
                                                                    getAllDocumentResponse.document_types.length
                                                                        ? getAllDocumentResponse.document_types.map((item, i) => (
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
                                                        <div className="codeOtr">
                                                            <h4>Project </h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    disabled={query.p_id ? true : false}
                                                                    autoComplete="nope"
                                                                    className={`custom-selecbox form-control ${
                                                                        query.p_id ? "cursor-notallowed" : ""
                                                                    } `}
                                                                    onChange={async e => {
                                                                        await this.setState({
                                                                            reports: {
                                                                                ...reports,
                                                                                project_id: e.target.value
                                                                            }
                                                                        });
                                                                        await this.handleDropdownSelect();
                                                                    }}
                                                                    value={reports.project_id}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {getAllProjectsDropdown &&
                                                                    getAllProjectsDropdown.projects &&
                                                                    getAllProjectsDropdown.projects.length
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
                                                        <div className="codeOtr">
                                                            <h4>Region </h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    disabled={
                                                                        query.r_id && reports.region_id !== "" && !isProjectUpdated ? true : false
                                                                    }
                                                                    autoComplete="nope"
                                                                    className={`custom-selecbox form-control ${
                                                                        query.r_id && reports.region_id !== "" && !isProjectUpdated
                                                                            ? "cursor-notallowed"
                                                                            : ""
                                                                    }`}
                                                                    onChange={async e => {
                                                                        await this.setState({
                                                                            reports: {
                                                                                ...reports,
                                                                                region_id: e.target.value
                                                                            }
                                                                        });
                                                                        await this.handleRegionSelect();
                                                                    }}
                                                                    value={reports.region_id}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {regions && regions.length
                                                                        ? regions.map((item, i) => (
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
                                                        <div className="codeOtr">
                                                            <h4>Site </h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    disabled={
                                                                        query.s_id && reports.site_id !== "" && !isProjectUpdated ? true : false
                                                                    }
                                                                    autoComplete="nope"
                                                                    className={`custom-selecbox form-control ${
                                                                        query.s_id && reports.site_id !== "" && !isProjectUpdated
                                                                            ? "cursor-notallowed"
                                                                            : ""
                                                                    }`}
                                                                    onChange={async e => {
                                                                        await this.setState({
                                                                            reports: {
                                                                                ...reports,
                                                                                site_id: e.target.value
                                                                            }
                                                                        });
                                                                        await this.handleSiteSelect();
                                                                    }}
                                                                    value={reports.site_id}
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
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Building </h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    disabled={
                                                                        query.b_id && reports.building_id !== "" && !isProjectUpdated ? true : false
                                                                    }
                                                                    autoComplete="nope"
                                                                    className={`custom-selecbox form-control ${
                                                                        query.b_id && reports.building_id !== "" && !isProjectUpdated
                                                                            ? "cursor-notallowed"
                                                                            : ""
                                                                    }`}
                                                                    onChange={async e => {
                                                                        await this.setState({
                                                                            reports: {
                                                                                ...reports,
                                                                                building_id: e.target.value
                                                                            }
                                                                        });
                                                                        await this.handleBuilding();
                                                                    }}
                                                                    value={reports.building_id}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {buildings && buildings.length
                                                                        ? buildings.map((item, i) => (
                                                                              <option value={item.id} key={i}>
                                                                                  {item.name}
                                                                                  &nbsp;
                                                                                  {item.building_description ? `(${item.building_description})` : ""}
                                                                              </option>
                                                                          ))
                                                                        : null}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Floors </h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    autoComplete="nope"
                                                                    className={`custom-selecbox form-control`}
                                                                    onChange={async e => {
                                                                        await this.setState({
                                                                            reports: {
                                                                                ...reports,
                                                                                floor_id: e.target.value
                                                                            }
                                                                        });
                                                                    }}
                                                                    value={reports.floor_id}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {this.props.recommendationsReducer &&
                                                                    this.props.recommendationsReducer.getFloorByBuilding &&
                                                                    this.props.recommendationsReducer.getFloorByBuilding.floors &&
                                                                    this.props.recommendationsReducer.getFloorByBuilding.floors.length
                                                                        ? this.props.recommendationsReducer.getFloorByBuilding.floors.map(
                                                                              (item, i) => (
                                                                                  <option value={item.id} key={i}>
                                                                                      {item.name}
                                                                                  </option>
                                                                              )
                                                                          )
                                                                        : null}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Initiative </h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    disabled={
                                                                        query.i_id && reports.initiative_id !== "" && !isProjectUpdated ? true : false
                                                                    }
                                                                    autoComplete="nope"
                                                                    className={`custom-selecbox form-control ${
                                                                        query.i_id && reports.initiative_id !== "" && !isProjectUpdated
                                                                            ? "cursor-notallowed"
                                                                            : ""
                                                                    }`}
                                                                    onChange={async e => {
                                                                        await this.setState({
                                                                            reports: {
                                                                                ...reports,
                                                                                initiative_id: e.target.value
                                                                            }
                                                                        });
                                                                        await this.handleInitiativeSelect();
                                                                    }}
                                                                    value={reports.initiative_id}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {initiativeDropdown &&
                                                                    initiativeDropdown.projects &&
                                                                    initiativeDropdown.projects.length
                                                                        ? initiativeDropdown.projects.map((item, i) => (
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
                                                        <div className="codeOtr">
                                                            <h4>Recommendation </h4>
                                                            <div className="custom-selecbox">
                                                                <select
                                                                    disabled={
                                                                        query.rec_id && reports.recommendation_id !== "" && !isProjectUpdated
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    autoComplete="nope"
                                                                    className={`custom-selecbox form-control ${
                                                                        query.rec_id && reports.recommendation_id !== "" && !isProjectUpdated
                                                                            ? "cursor-notallowed"
                                                                            : ""
                                                                    }`}
                                                                    onChange={async e => {
                                                                        await this.setState({
                                                                            reports: {
                                                                                ...reports,
                                                                                recommendation_id: e.target.value
                                                                            }
                                                                        });
                                                                    }}
                                                                    value={reports.recommendation_id}
                                                                >
                                                                    <option value="">Select</option>
                                                                    {recommendationDropdown &&
                                                                    recommendationDropdown.recommendations &&
                                                                    recommendationDropdown.recommendations.length
                                                                        ? recommendationDropdown.recommendations.map((item, i) => (
                                                                              <option value={item.id} key={i}>
                                                                                  {item.description}
                                                                              </option>
                                                                          ))
                                                                        : null}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 basic-box">
                                                        <div className="codeOtr">
                                                            <h4>Version</h4>
                                                            <input
                                                                autoComplete="nope"
                                                                type="text"
                                                                className={`custom-input form-control `}
                                                                value={reports.version_no}
                                                                placeholder="Versioning"
                                                                onChange={async e => {
                                                                    await this.setState({
                                                                        reports: {
                                                                            ...reports,
                                                                            version_no: e.target.value
                                                                        }
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={
                                                showErrorBorder && !this.state.reports.file_name
                                                    ? "col-md-4 back-set error-border"
                                                    : "col-md-4 back-set"
                                            }
                                        >
                                            <div className="details-img-block details-img-new">
                                                {this.state.selectedImage ? (
                                                    <>
                                                        {this.state.documentChanged ? (
                                                            <>
                                                                <div
                                                                    className={
                                                                        selectedDocument ? "custom-image-upload edit-addtn" : "custom-image-upload"
                                                                    }
                                                                    onClick={this.handleAddAttachment}
                                                                >
                                                                    <label for="file-input">
                                                                        {this.state.reports.file.name ? <i className="fas fa-pencil-alt"></i> : ""}
                                                                    </label>
                                                                </div>
                                                                {isImage ? (
                                                                    <img src={`${this.state.previewImage}`} alt="" />
                                                                ) : this.state.reports.file_type == "pdf" ? (
                                                                    <Iframe
                                                                        url={this.state.previewImage}
                                                                        width="100%"
                                                                        height="100%"
                                                                        display="initial"
                                                                        position="relative"
                                                                    />
                                                                ) : (
                                                                    <img src="/img/docIcon.webp" alt="" />
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="custom-image-upload edit-addtn" onClick={this.handleAddAttachment}>
                                                                    <label for="file-input">
                                                                        {this.state.reports.file_name ? <i className="fas fa-pencil-alt"></i> : ""}
                                                                    </label>
                                                                </div>
                                                                {this.state.reports.url &&
                                                                this.state.reports.file_type &&
                                                                ["png", "jpg", "ttf", "jpeg", "svg"].includes(
                                                                    this.state.reports.file_type.toLowerCase()
                                                                ) ? (
                                                                    <img src={`${this.state.selectedImage}`} alt="" />
                                                                ) : this.state.reports.url &&
                                                                  this.state.reports.file_type &&
                                                                  (this.state.reports.file_type == "pdf" || this.state.reports.file_type == "PDF") ? (
                                                                    <>
                                                                        <Iframe
                                                                            url={this.state.reports.url}
                                                                            width="100%"
                                                                            height="100%"
                                                                            display="initial"
                                                                            position="relative"
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <img src="/img/docIcon.webp" alt=""></img>
                                                                )}
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {this.state.previewImage ? (
                                                            <>
                                                                <div className="custom-image-upload edit-addtn" onClick={this.handleAddAttachment}>
                                                                    <label for="file-input">
                                                                        {this.state.reports.file && this.state.reports.file.name ? (
                                                                            <i className="fas fa-pencil-alt"></i>
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </label>
                                                                </div>
                                                                {this.state.reports.file_type == "pdf" ? (
                                                                    // <img
                                                                    //     src="/img/pdfIcon.jpeg"/>
                                                                    <Iframe
                                                                        url={this.state.previewImage}
                                                                        width="100%"
                                                                        height="100%"
                                                                        display="initial"
                                                                        position="relative"
                                                                    />
                                                                ) : isImage ? (
                                                                    <img src={`${this.state.previewImage}`} alt="" />
                                                                ) : (
                                                                    <img src="/img/docIcon.webp" alt="" />
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div
                                                                    className="custom-image-upload  cstm-width-btn "
                                                                    onClick={this.handleAddAttachment}
                                                                >
                                                                    <label for="file-input">Add Document</label>
                                                                </div>
                                                                <img src="/img/no-image.png" alt="" />
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="basic-otr mt-3 new-sec">
                                        <div className="basic-dtl-otr basic-sec pl-0 pr-0">
                                            <div className="col-md-4 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Description*</h4>
                                                    <textarea
                                                        autoComplete="nope"
                                                        className={`${
                                                            showErrorBorder && !reports.description.trim().length ? "error-border " : ""
                                                        } custom-input form-control`}
                                                        onChange={async e => {
                                                            await this.setState({
                                                                reports: {
                                                                    ...reports,
                                                                    description: e.target.value
                                                                }
                                                            });
                                                        }}
                                                        value={reports.description}
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Notes</h4>
                                                    <textarea
                                                        autoComplete="nope"
                                                        className={`custom-input form-control`}
                                                        onChange={async e => {
                                                            await this.setState({
                                                                reports: {
                                                                    ...reports,
                                                                    notes: e.target.value
                                                                }
                                                            });
                                                        }}
                                                        value={reports.notes}
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="col-md-4 basic-box btn-sec-cnt">
                                                <div className=" text-right btnOtr edit-cmn-btn">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btnClr col-md-2 mr-1"
                                                        data-dismiss="modal"
                                                        onClick={() => this.cancelForm()}
                                                    >
                                                        Cancel
                                                    </button>
                                                    {selectedDocument ? (
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btnRgion col-md-2"
                                                            onClick={() => this.updateDocument()}
                                                        >
                                                            Update Document
                                                        </button>
                                                    ) : (
                                                        <button
                                                            disabled={addButton}
                                                            type="button"
                                                            className="btn btn-primary btnRgion col-md-2"
                                                            onClick={() => this.addDocument()}
                                                        >
                                                            Add New Document
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
                    {/* </div> */}
                    {this.state.imageUploadModal ? (
                        <>
                            <Portal
                                body={
                                    <DocumentUpload
                                        imageList={
                                            !this.state.documentChanged
                                                ? [{ name: this.state.reports.file_name, url: this.state.reports.url }]
                                                : this.state.reports.file
                                                ? [this.state.reports.file]
                                                : []
                                        }
                                        img_desc={this.state.reports.img_desc ? this.state.reports.img_desc : ""}
                                        isRecomentaionView={true}
                                        handleImage={this.handleImage}
                                        handleAddImage={this.handleAddImage}
                                        file_name={this.state.reports.file_name}
                                        deleteImageRecomention={this.deleteImage}
                                        onCancel={() =>
                                            this.setState({
                                                imageUploadModal: false
                                            })
                                        }
                                    />
                                }
                                onCancel={() =>
                                    this.setState({
                                        imageUploadModal: false
                                    })
                                }
                            />{" "}
                        </>
                    ) : null}
                </div>
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { clientReducer, regionReducer, siteReducer, reportReducer, initativeReducer, buildingReducer, floorReducer, recommendationsReducer } =
        state;
    return { clientReducer, regionReducer, siteReducer, reportReducer, initativeReducer, buildingReducer, floorReducer, recommendationsReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...siteActons,
        ...clientActions,
        ...RecommendationAction,
        ...actions,
        ...floorAction,
        ...regionAction,
        ...initiativeActions,
        ...buildingActions
    })(From)
);
