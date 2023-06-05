import React, { Component } from "react";
import { useState } from "react";
import { connect } from "react-redux";

import Assets from "../../assets";
import BuildModalHeader from "../../common/components/BuildModalHeader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import assetActions from "../../assets/actions";
class AssetModal extends Component {
    state = {
        isLoading: false,
        showConfirmModal: false,
        isDifferentLocation: false
    };

    handleAssign = async () => {
        const {
            assetReducer: { selectedAsset }
        } = this.props;
        if (
            (this.props.selectedData?.region_id && selectedAsset?.region?.id != this.props.selectedData?.region_id) ||
            (this.props.selectedData?.room && selectedAsset?.room_number != this.props.selectedData?.room) ||
            (this.props.selectedData?.site_id && selectedAsset?.site?.id != this.props.selectedData?.site_id) ||
            (this.props.selectedData?.building_id && selectedAsset?.building?.id != this.props.selectedData?.building_id) ||
            (this.props.selectedData?.floor_id && selectedAsset?.floor?.id != this.props.selectedData?.floor_id) ||
            (this.props.selectedData?.addition_id && selectedAsset?.addition?.id != this.props.selectedData?.addition_id) ||
            (this.props.selectedData?.trade_id && selectedAsset?.trade?.id != this.props.selectedData?.trade_id) ||
            (this.props.selectedData?.system_id && selectedAsset?.system?.id != this.props.selectedData?.system_id) ||
            (this.props.selectedData?.sub_system_id && selectedAsset?.sub_system?.id != this.props.selectedData?.sub_system_id)
        ) {
            this.setState({ isDifferentLocation: true, showConfirmModal: true });
        } else if (this.props.selectedData?.asset?.id) {
            this.setState({ showConfirmModal: true });
        } else {
            this.handleAssignAsset();
        }
    };

    handleUpdateAsset = async () => {
        const {
            assetReducer: { selectedAsset }
        } = this.props;
        let assetData = {
            region_id: this.props.selectedData?.region_id,
            room_number: this.props.selectedData?.room,
            site_id: this.props.selectedData?.site_id,
            building_id: this.props.selectedData?.building_id,
            floor_id: this.props.selectedData?.floor_id,
            addition_id: this.props.selectedData?.addition_id,
            building_type: this.props.selectedData?.building_type,
            trade_id: this.props.selectedData?.trade_id,
            system_id: this.props.selectedData?.system_id,
            sub_system_id: this.props.selectedData?.sub_system_id
        };
        await this.props.updateData(selectedAsset?.id, assetData);
    };

    handleAssignAsset = async () => {
        const {
            assetReducer: { selectedAsset }
        } = this.props;
        await this.props.getAssetDataById(selectedAsset.id);
        const resData = this.props.assetReducer.getDataByIdResponse;
        this.props.handleAssignAsset(resData);
        this.props.onCancel();
    };

    renderConfirmationModal = () => {
        if (!this.state.showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={
                            this.state.isDifferentLocation
                                ? "The selected Asset's Geo Hierarchy is different from the selected recommendation. Do you want to overwrite the Asset's geo hierarchy?"
                                : "An Asset has already been assigned to the Recommendation. Do you want to overwrite the Asset?"
                        }
                        type="cancel"
                        message={"This action cannot be reverted, are you sure ?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.onYes}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    onYes = async () => {
        this.setState({ showConfirmModal: false, isLoading: true });
        if (this.state.isDifferentLocation) {
            await this.handleUpdateAsset();
        }
        await this.handleAssignAsset();
        this.setState({ isLoading: false });
    };
    render() {
        const {
            assetReducer: { selectedAsset }
        } = this.props;
        const { isLoading } = this.state;
        return (
            <React.Fragment>
                <div
                    className="modal assign-init-modal image-pull-modal"
                    style={{ display: "block" }}
                    id="modalId"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog assignModal" role="document">
                        <div className="modal-content">
                            <BuildModalHeader title="Assets" onCancel={this.props.onCancel} modalClass="assignModal" />

                            <form autoComplete="nope">
                                <div className="modal-body ">
                                    <div className="form-group">
                                        <div className="formInp">
                                            <div className="dashboard-outer">
                                                <div className="outer-detail">
                                                    <div className="right-panel-section">
                                                        <div className="dtl-sec">
                                                            <div className="dtl-sec system-building col-md-12 ">
                                                                <div className="tab-dtl region-mng">
                                                                    <div className="tab-active recomdn-table bg-grey-table modal-table-scroll">
                                                                        <Assets isAssignView clientId={this.props.clientId} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 p-0 text-right btnOtr">
                                            {this.props.submitAssign ? (
                                                <button type="button" className="btn btn-primary btnRgion col-md-2">
                                                    <div className="button-loader d-flex justify-content-center align-items-center">
                                                        <div className="spinner-border text-white" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            ) : (
                                                <button
                                                    disabled={!selectedAsset?.id || isLoading}
                                                    type="button"
                                                    onClick={() => this.handleAssign()}
                                                    className="btn btn-primary btnRgion col-md-2"
                                                >
                                                    Assign{" "}
                                                    {isLoading && <span className="spinner-border spinner-border-sm pl-2" role="status"></span>}
                                                </button>
                                            )}
                                        </div>
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
    const { assetReducer } = state;
    return { assetReducer };
};

export default connect(mapStateToProps, { ...assetActions })(AssetModal);
