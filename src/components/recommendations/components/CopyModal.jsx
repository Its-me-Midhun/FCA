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
            trade: {
                target_year: ""
            },
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
        await this.setState({ isLoading: false });
    };

    validate = () => {
        const { trade } = this.state;
        this.setState({
            showErrorBorder: false
        });
        if (!trade.target_year) {
            this.setState({
                errorMessage: "Please select traget year",
                showErrorBorder: true
            });
            return false;
        }
        return true;
    };

    HandleCopy = async () => {
        const { target_year } = this.state.trade;
        const { HandleCutPasteSubmit } = this.props;
        if (this.validate()) {
            await HandleCutPasteSubmit(target_year);
        }
    };

    updateBuildingType = async () => {
        const { trade } = this.state;
        const { updateTradeData } = this.props;
        if (this.validate()) {
            await updateTradeData(trade);
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

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { clients, trade, selectedProject, showErrorBorder } = this.state;
        const { maintenance_years, startYear } = this.props;
        //console.log(maintenance_years)

        return (
            <React.Fragment>
                <div
                    class="modal modal-region year-filter"
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
                                    Move Costs to Another Year
                                </h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={() => this.props.onCancel()}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div class="modal-body region-otr build-type-mod">
                                <div class="form-group">
                                    <label>From</label>
                                    <div class="selectOtr">
                                        <input type="text" className="form-control" readOnly="true" value={startYear} />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>To *</label>
                                    <div class="selectOtr">
                                        <select
                                            onChange={async e => {
                                                await this.setState({
                                                    trade: {
                                                        ...trade,
                                                        target_year: e.target.value
                                                    }
                                                });
                                            }}
                                            value={trade.target_year}
                                            className={`${showErrorBorder && !trade.target_year ? "error-border " : ""}form-control`}
                                        >
                                            <option value="">Select</option>
                                            {maintenance_years && maintenance_years.length
                                                ? maintenance_years.map(
                                                      (item, i) =>
                                                          item != startYear && (
                                                              <option value={item} key={i}>
                                                                  {item}
                                                              </option>
                                                          )
                                                  )
                                                : null}
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-12 p-0 text-right btnOtr">
                                    <button type="button" onClick={() => this.props.onCancel()} className="btn btn-primary btnClr">
                                        Cancel
                                    </button>
                                    <button type="button" onClick={() => this.HandleCopy()} className="btn btn-primary btnRgion col-md-2">
                                        Move
                                    </button>
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
    const { buildingTypeReducer, buildingReducer, tradeReducer } = state;
    return { buildingTypeReducer, buildingReducer, tradeReducer };
};

export default withRouter(connect(mapStateToProps, { ...buildingTypeActions, ...buildingActions })(From));
