import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import NumberFormat from "react-number-format";
import reactCSS from "reactcss";
import buildingTypeActions from "../../buildingtype/actions";
import buildingActions from "../../building/actions";
import projectActions from "../../project/actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import actions from "../actions";
import { SketchPicker } from "react-color";

class From extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            clients: "",
            sites: "",
            regions: "",
            consultancy_users: "",
            limit: {
                name: "",
                start: "",
                end: "",
                region_id: "",
                site_id: "",
                color_code: ""
            },
            showPicker: false,
            initiaValues: {},
            isNewBuildingType: true,
            selectedClient: {},
            regionList: [],
            siteList: [],
            buildingTypeList: [],
            selectedConsultancyUsers: [],
            selectedProject: props.selectedProject,
            selectedTrade: props.selectedProject,
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
            buildingTypeList = this.props.buildingTypeReducer.getAllBuildingTypesResponse.buildingTypes;
        }
        if (selectedTrade) {
            await this.props.getPriorityByOne(selectedTrade);
            const {
                prioritysettingReducer: {
                    getPriorityByIdResponse: { name, start, end, site, region, success, color_code }
                }
            } = this.props;
            if (success) {
                // await this.props.getSitesBasedOnRegion(region.id);
                // const {
                //     buildingReducer: {
                //         getSitesBasedOnRegionResponse: { sites }
                //     }
                // } = this.props;
                await this.props.getSitesByRegionInPriority(region.id);
                const {
                    prioritysettingReducer: {
                        getSitesByRegionResponse: { sites }
                    }
                } = this.props;
                await this.setState({
                    sites,
                    limit: {
                        name,
                        start,
                        end,
                        region_id: region.id,
                        site_id: site.id,
                        color_code: color_code || ""
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
            // systems,
            regions,
            consultancy_users: tempUserOptions,
            buildingTypeList,
            initiaValues: this.state.buildingType,
            isNewBuildingType: query.inp,
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
            limit: {
                ...this.state.limit,
                color_code: color.hex
            }
        });
    };
    validate = () => {
        const { limit } = this.state;
        this.setState({
            showErrorBorder: false
        });
        if (!limit.name && !limit.start.trim().length) {
            this.setState({
                errorMessage: "Please enter building type name",
                showErrorBorder: true
            });
            return false;
        } else if (!limit.start && (!limit.start.trim().length || limit.start.trim().length < 4)) {
            this.setState({
                errorMessage: "Please enter building type name",
                showErrorBorder: true
            });
            return false;
        } else if (!limit.end && (!limit.end.trim().length || limit.end.trim().length < 4)) {
            this.setState({
                errorMessage: "Please enter building type name",
                showErrorBorder: true
            });
            return false;
        } else if (!limit.site_id) {
            this.setState({
                errorMessage: "Please select System",
                showErrorBorder: true
            });
            return false;
        } else if (!limit.region_id) {
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
        const general = {
            name: limit.name,
            start: limit.start,
            end: limit.end,
            site_id: limit.site_id,
            color_code: limit.color_code
        };
        if (this.validate()) {
            await addNewData(general);
        }
    };

    updateBuildingType = async () => {
        const { limit, type } = this.state;
        const { updateTradeData } = this.props;
        const general = {
            name: limit.name,
            start: limit.start,
            end: limit.end,
            site_id: limit.site_id,
            color_code: limit.color_code
        };
        if (this.validate()) {
            await updateTradeData(general);
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
        // await this.props.getSitesBasedOnRegion(limit.region_id);
        // const {
        //     buildingReducer: {
        //         getSitesBasedOnRegionResponse: { sites }
        //     }
        // } = this.props;
        await this.props.getSitesByRegionInPriority(limit.region_id);
        const {
            prioritysettingReducer: {
                getSitesByRegionResponse: { sites }
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

        const { sites, regions, limit, selectedProject, showErrorBorder, type } = this.state;
        const styles = reactCSS({
            default: {
                color: {
                    width: "40px",
                    height: "15px",
                    borderRadius: "3px",
                    background: this.state.limit.color_code
                },
                popover: {
                    position: "absolute",
                    zIndex: "3",
                    left: "111px",
                    top: "172px"
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
                <div
                    class="modal modal-region"
                    style={{ display: "block" }}
                    id="modalId"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    {selectedProject ? "Edit Term" : "Add New Term"}
                                </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onCancel()}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body region-otr build-type-mod">
                                <form autoComplete={"nope"}>
                                    <div className="form-group">
                                        <div className="formInp">
                                            <label>Name *</label>
                                            <input
                                                autoComplete={"nope"}
                                                type="text"
                                                className={`${showErrorBorder && !limit.name.trim().length ? "error-border " : ""}form-control`}
                                                value={limit.name}
                                                onChange={e =>
                                                    this.setState({
                                                        limit: {
                                                            ...limit,
                                                            name: e.target.value
                                                        }
                                                    })
                                                }
                                                placeholder="Name"
                                            />
                                        </div>
                                        <div className="formInp">
                                            <label>Start Year *</label>
                                            <NumberFormat
                                                autoComplete={"nope"}
                                                value={limit.start}
                                                thousandSeparator={false}
                                                className={`${
                                                    showErrorBorder && (!limit.start || limit.start.length < 4) ? "error-border " : ""
                                                }form-control`}
                                                placeholder="Start Year"
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
                                        <div className="formInp">
                                            <label>End Year *</label>
                                            <NumberFormat
                                                autoComplete={"nope"}
                                                value={limit.end}
                                                thousandSeparator={false}
                                                className={`${
                                                    showErrorBorder && (!limit.end || limit.end.length < 4) ? "error-border " : ""
                                                }form-control`}
                                                placeholder="End Year"
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
                                            <label>Color</label>
                                            <div>
                                                <div class="close-icon-right position-relative">
                                                    <span
                                                        onClick={e =>
                                                            this.setState({
                                                                limit: {
                                                                    ...limit,
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
                                                            color={this.state.limit.color_code}
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
                                        <div className="formInp">
                                            <label>Region *</label>
                                            <div className="selectOtr">
                                                <select
                                                    autoComplete={"nope"}
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
                                                    className={`${showErrorBorder && !limit.region_id ? "error-border " : ""}form-control`}
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
                                        <div className="formInp">
                                            <label>Site *</label>
                                            <div className="selectOtr">
                                                <select
                                                    autoComplete={"nope"}
                                                    onChange={async e => {
                                                        await this.setState({
                                                            limit: {
                                                                ...limit,
                                                                site_id: e.target.value
                                                            }
                                                        });
                                                    }}
                                                    value={limit.site_id}
                                                    className={`${showErrorBorder && !limit.site_id ? "error-border " : ""}form-control`}
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
                                    <div className="col-md-12 p-0 text-right btnOtr">
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
                                </form>
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
    const { buildingTypeReducer, buildingReducer, projectReducer, prioritysettingReducer } = state;
    return { buildingTypeReducer, buildingReducer, projectReducer, prioritysettingReducer };
};

export default withRouter(connect(mapStateToProps, { ...buildingTypeActions, ...buildingActions, ...projectActions, ...actions })(From));
