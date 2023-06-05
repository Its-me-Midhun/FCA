import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import NumberFormat from "react-number-format";

import buildingTypeActions from "../../actions";
import buildingActions from "../../../building/actions";
import Loader from "../../../common/components/Loader";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import Portal from "../../../common/components/Portal";


class From extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            clients: "",
            sites:"",
            regions:"",
            consultancy_users: "",
            limit: {
                start: "",
                end:"",
                region_id:"",
                site_id:"" 
            },
            initiaValues: {},
            isNewBuildingType: true,
            selectedClient: {},
            regionList: [],
            siteList: [],
            buildingTypeList: [],
            selectedConsultancyUsers: [],
            selectedProject: props.selectedProject,
            selectedTrade: props.selectedTrade,
            type: props.type,
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false
        };
    }

    componentDidMount = async () => {
        const {
            buildingTypeReducer: {
                getAllConsultancyUsersResponse: { users: consultancy_users },
                getAllClientsResponse: { clients }
            }
        } = this.props;
        const {
            projectReducer: {
                getProjectByIdResponse: { success, client }
            }
        } = this.props;
        await this.props.getRegionsBasedOnClient(client.id);
        const {
            projectReducer: {
                getRegionsBasedOnClientResponse: { regions }
            }
        } = this.props;
        const {
            location: { search }
        } = this.props;
        const query = qs.parse(search);
        const { selectedProject, selectedTrade } = this.state;
        let buildingTypeList = [];
        if (query.inp || selectedProject) {
            buildingTypeList = this.props.buildingTypeReducer.getAllBuildingTypesResponse
                .buildingTypes;
        }
        if (selectedTrade) {
            const { type } = this.state;
            if (type==="limit") {
                await this.props.getTradeByOne(type, selectedTrade);
                const {
                    projectReducer: {
                        getGeneralByIdResponse: { start, end,site,region, success }
                    }
                } = this.props;
                if (success) {
                    await this.props.getSitesBasedOnRegion(region.id);
                        const {
                            buildingReducer: {
                                getSitesBasedOnRegionResponse : { sites }
                                }
                            } = this.props;
                    await this.setState({
                        sites,
                        limit: {
                            start,
                            end,
                            region_id:region.id,
                            site_id:site.id
                        }
                    });
                }
            }
        }

        let tempUserOptions = [];
        if (consultancy_users && consultancy_users.length) {
            consultancy_users.map(item => tempUserOptions.push({ name: item.name, id: item.id }));
        }
        await this.setState({
            clients,
            // systems,
            regions,
            consultancy_users: tempUserOptions,
            buildingTypeList,
            initiaValues: this.state.buildingType,
            isNewBuildingType: query.inp,
            isLoading: false
        });
    };

    validate = () => {
        const { limit } = this.state;
        this.setState({
            showErrorBorder: false
        });
        if (!limit.start && (!limit.start.trim().length||limit.start.trim().length<4)) {
            this.setState({
                errorMessage: "Please enter building type name",
                showErrorBorder: true
            });
            return false;
        }else if (!limit.end && (!limit.end.trim().length||limit.end.trim().length<4)) {
                this.setState({
                    errorMessage: "Please enter building type name",
                    showErrorBorder: true
                });
                return false;
        }else if (!limit.site_id) {
            this.setState({
                errorMessage: "Please select System",
                showErrorBorder: true
            });
            return false;
        }
        else if (!limit.region_id) {
            this.setState({
                errorMessage: "Please select trade",
                showErrorBorder: true
            });
            return false;
        }
        return true;
    };

    addBuildingType = async () => {
        const { limit, type } = this.state;
        const { addNewData } = this.props;
        const general={
            start:limit.start,
            end:limit.end,
            site_id:limit.site_id
        }
        if (this.validate()) {
            await addNewData(type, general);
        }
    };

    updateBuildingType = async () => {
        const { limit, type } = this.state;
        const { updateTradeData } = this.props;
        const general={
            start:limit.start,
            end:limit.end,
            site_id:limit.site_id
        }
        if (this.validate()) {
            await updateTradeData(type, general);
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
                        message={
                            "This action cannot be reverted, are you sure that you need to cancel?"
                        }
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
            trade: {
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
    handleRegionSelect = async () => {
        const { limit } = this.state;
        await this.props.getSitesBasedOnRegion(limit.region_id);
        const {
            buildingReducer: {
                getSitesBasedOnRegionResponse : { sites }
            }
        } = this.props;
        this.setState({
            sites,
            limit: {
                ...limit,
                site_id: ""
            }
        });
    
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { sites,regions, limit, selectedProject, showErrorBorder, type } = this.state;

        return (
            <React.Fragment>
                <div
                    class="modal modal-region"
                    style={{ display: "block" }}
                    id="modalId"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">
                                    {selectedProject ? "Edit Year Limit" : "Add New Year Limit"}
                                </h5>
                                <button
                                    type="button"
                                    class="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => this.props.onCancel()}
                                >
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div class="modal-body region-otr build-type-mod">
                                <div class="form-group">
                                    <div class="formInp">
                                        <label>Start Year *</label>
                                        <NumberFormat
                                            value={limit.start}
                                            thousandSeparator={false}
                                            className={`${
                                                showErrorBorder &&
                                                (!limit.start || limit.start.length<4)
                                                    ? "error-border "
                                                    : ""
                                            }form-control`}
                                            placeholder="Enter Start Year"
                                            format="####"
                                            onValueChange={values => {
                                                const { value } = values;
                                                if (parseInt(value.length) < 6) {
                                                    this.setState({
                                                        limit: {
                                                            ...limit,
                                                            start: value
                                                        }
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div class="formInp">
                                        <label>End Year *</label>
                                        <NumberFormat
                                            value={limit.end}
                                            thousandSeparator={false}
                                            className={`${
                                                showErrorBorder &&
                                                (!limit.end || limit.end.length<4)
                                                    ? "error-border "
                                                    : ""
                                            }form-control`}
                                            placeholder="Enter Start Year"
                                            format="####"
                                            onValueChange={values => {
                                                const { value } = values;
                                                if (parseInt(value.length) < 6) {
                                                    this.setState({
                                                        limit: {
                                                            ...limit,
                                                            end: value
                                                        }
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                    <div class="formInp">
                                        <label>Region *</label>
                                        <div class="selectOtr">
                                            <select
                                                onChange={async e => {
                                                    await this.setState({
                                                        limit: {
                                                            ...limit,
                                                            region_id: e.target.value
                                                        }
                                                    });
                                                    this.handleRegionSelect();
                                                }}
                                                value={limit.region_id}
                                                className={`${
                                                    showErrorBorder &&
                                                    !limit.region_id
                                                        ? "error-border "
                                                        : ""
                                                }form-control`}
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
                                    <div class="formInp">
                                        <label>Site *</label>
                                        <div class="selectOtr">
                                            <select
                                                onChange={async e => {
                                                    await this.setState({
                                                        limit: {
                                                            ...limit,
                                                            site_id: e.target.value
                                                        }
                                                    });
                                                }}
                                                value={limit.site_id}
                                                className={`${
                                                    showErrorBorder &&
                                                    !limit.site_id
                                                        ? "error-border "
                                                        : ""
                                                }form-control`}
                                            >
                                                <option value="">Select</option>
                                                {sites && sites.length
                                                    ? sites.map((item, i) => (
                                                          <option value={item.id} key={i}>
                                                              {item.name}
                                                          </option>
                                                      ))
                                                    : null}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-12 p-0 text-right btnOtr">
                                    {selectedProject ? (
                                        <button
                                            type="button"
                                            onClick={() => this.updateBuildingType()}
                                            className="btn btn-primary btnRgion col-md-2"
                                        >
                                            Update
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => this.addBuildingType()}
                                            className="btn btn-primary btnRgion col-md-2"
                                        >
                                            Add
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { buildingTypeReducer, buildingReducer, projectReducer } = state;
    return { buildingTypeReducer, buildingReducer, projectReducer };
};

export default withRouter(
    connect(mapStateToProps, { ...buildingTypeActions, ...buildingActions })(From)
);
