import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Form from "./CriticalityForm";
import Portal from "../../../common/components/Portal";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import TableTopIcons from "../../../common/components/TableTopIcons";
import projectActions from "../../actions";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../../common/components/Loader";

class CriticalitySettings extends Component {
    state = {
        isLoading: false,
        openForm: false,
        openColorCode: false,
        name: "",
        from: "",
        to: "",
        colorCode: "",
        selectedItem: "",
        activeButton: false,
        activeItem: {},
        errorMessage: "",
        showErrorBorder: false,
        showConfirmModal: false,
        alertMessage: "",
        showRecalculateConfirmation: false
    };

    componentDidMount() {
        this.refreshCriticalityData();
    }

    refreshCriticalityData = async () => {
        await this.props.getCriticalityData({ project_id: this.props.match.params.id });
    };

    showAddForm() {
        this.setState({
            openForm: true,
            selectedItem: null
        });
    }

    handleCode = color => {
        this.setState({
            colorCode: color,
            activeButton: true
        });
    };

    openColorCode(id) {
        this.setState({
            openColorCode: !this.state.openColorCode,
            selectedItem: id
        });
    }

    handleColorCode(color) {}

    onCancel = () => {
        this.setState({
            openForm: !this.state.openForm,
            errorMessage: "",
            showErrorBorder: false
        });
    };

    addCriticalityData = async (params, projectId) => {
        await this.props.addCriticality(params, projectId);
        if (this.props.projectReducer.addCriticalityData?.message) {
            await this.showAlert(this.props.projectReducer.addCriticalityData.message);
            this.setState({ openForm: false });
        }
        this.refreshCriticalityData();
    };

    showAlert = message => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = message;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };
    updateColor = async () => {
        const { name, from, to, colorCode } = this.state;
        if (this.validateForm()) {
            let data = {
                name,
                range_start: from,
                range_end: to,
                color_code: colorCode
            };
            await this.props.updateColorCodeBuildingType(this.props.match.params.id, this.state.selectedItem, data);
            await this.props.getColorCodesBuildingType(this.props.match.params.id);
            this.setState({
                openForm: false,
                activeButton: false,
                errorMessage: "",
                showErrorBorder: false
            });
        }
    };

    deleteCriticality = async id => {
        this.setState({
            showConfirmModal: true,
            selectedItem: id
        });
    };

    confirmDeleteCriticality = async () => {
        let projectId = this.props.match.params.id || "";
        await this.props.deleteCriticality(this.state.selectedItem, projectId);
        this.setState({ showConfirmModal: false });
        this.refreshCriticalityData();
    };

    updateCriticalityData = async (id, params, projectId) => {
        await this.props.updateCriticality(id, params, projectId);
        if (this.props.projectReducer.updateCriticalityData?.message) {
            await this.showAlert(this.props.projectReducer.updateCriticalityData.message);
            this.setState({ openForm: false });
        }
        this.refreshCriticalityData();
    };

    recalculateCriticality = async () => {
        let projectId = this.props.match.params.id || "";
        this.setState({ isLoading: true });
        await this.props.recalculateCriticality(projectId);
        const { success, error, message } = this.props.projectReducer.recalculateCriticalityResponse;
        this.setState({ isLoading: false });
        if (success) {
            this.showAlert(message);
        } else {
            this.showAlert(message || error);
        }
    };

    renderFormModal = () => {
        const { openForm } = this.state;
        if (!openForm) return null;

        return (
            <Portal
                body={
                    <Form
                        onCancel={this.onCancel}
                        handleTo={this.handleTo}
                        handleName={this.handleName}
                        handleCode={this.handleCode}
                        handleFrom={this.handleFrom}
                        updateColor={this.updateColor}
                        addCriticalityData={this.addCriticalityData}
                        updateCriticalityData={this.updateCriticalityData}
                        selectedItem={this.state.selectedItem}
                    />
                }
                onCancel={this.onCancel}
            />
        );
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Criticality ?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.confirmDeleteCriticality}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    handleName = e => {
        this.setState({
            name: e.target.value,
            activeButton: true
        });
    };

    handleFrom = e => {
        this.setState({
            from: e.target.value,
            activeButton: true
        });
    };
    handleTo = e => {
        this.setState({
            to: e.target.value,
            activeButton: true
        });
    };

    handleEditCriticality = data => {
        this.setState({
            openForm: true,
            selectedItem: data
        });
    };

    renderRecalculateConfirmation = () => {
        const { showRecalculateConfirmation } = this.state;
        if (!showRecalculateConfirmation) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={
                            "Recalculating the criticality may result in modifications to the existing criticality values of recommendations, as it will be based on the updated criticality scoring system"
                        }
                        message={"This action cannot be undone. Are you sure you want to continue?"}
                        onNo={() => this.setState({ showRecalculateConfirmation: false })}
                        onYes={() => {
                            this.setState({ showRecalculateConfirmation: false });
                            this.recalculateCriticality();
                        }}
                        type={"load"}
                    />
                }
                onCancel={() => this.setState({ showRecalculateConfirmation: false })}
            />
        );
    };

    render() {
        const { criticalityData } = this.props.projectReducer;
        return (
            <>
                <div className="recomdn-table">
                    {this.renderRecalculateConfirmation()}
                    <div className="table-top-menu allign-right">
                        <div className="rgt" style={{ paddingRight: "11rem" }}>
                            <TableTopIcons
                                hasGlobalSearch={false}
                                hasSort={false}
                                hasWildCardFilter={false}
                                hasView={false}
                                isExport={false}
                                hasHelp={true}
                                entity="color_codes"
                            />
                            <button className="add-btn mr-2" onClick={() => this.setState({ showRecalculateConfirmation: true })}>
                                <i className="fas fa-sync-alt" /> Refresh
                            </button>
                            <button className="add-btn" onClick={() => this.showAddForm()}>
                                <i className="fas fa-plus" /> Add Criticality
                            </button>
                        </div>
                    </div>
                    <LoadingOverlay active={this.state.isLoading} spinner={<Loader />} fadeSpeed={10}>
                        <div className="dtl-sec system-building col-md-12">
                            <div className="tab-dtl region-mng fcl-clor bottom-table">
                                <div className={`clor-lst ${!criticalityData.criticalities?.length ? "min-hgt" : ""}`}>
                                    {!criticalityData.criticalities?.length ? (
                                        <div className="h-ara">
                                            <div className="otr-topr">
                                                <h2>No Data Found</h2>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="h-ara">
                                                <div className="otr-topr">
                                                    <h2>{`Criticalities (Based On ${
                                                        criticalityData.criticality_score === "year" ? "Year" : "Priority"
                                                    })`}</h2>
                                                </div>
                                            </div>
                                            <div className="clr-list">
                                                <div className="table-section table-scroll">
                                                    <table className="table table-common">
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Scale</th>
                                                                <th className="clr-cen">Color</th>
                                                                <th className="width-au">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {criticalityData.criticalities?.length &&
                                                                criticalityData.criticalities.map((criticalityData, i) => (
                                                                    <React.Fragment key={i}>
                                                                        <tr>
                                                                            <td>{criticalityData.name}</td>
                                                                            <td>
                                                                                <div className="txt-set">
                                                                                    <div className="frm-set">
                                                                                        <input
                                                                                            className="form-control"
                                                                                            value={criticalityData.start_range}
                                                                                            disabled={true}
                                                                                        />
                                                                                    </div>
                                                                                    <h3>To</h3>
                                                                                    <div className="frm-set">
                                                                                        <input
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            value={criticalityData.end_range}
                                                                                            disabled={true}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div className="clr-set">
                                                                                    <div className="col-se">
                                                                                        <div
                                                                                            className="set"
                                                                                            style={{
                                                                                                backgroundColor: `${criticalityData.color_code}`
                                                                                            }}
                                                                                        ></div>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <span
                                                                                    className="left-sp cursor-hand"
                                                                                    onClick={() => {
                                                                                        this.handleEditCriticality(criticalityData);
                                                                                    }}
                                                                                >
                                                                                    <i className="fas fa-pencil-alt" />{" "}
                                                                                </span>
                                                                                <span
                                                                                    className="cursor-hand"
                                                                                    onClick={() => this.deleteCriticality(criticalityData.id)}
                                                                                >
                                                                                    <i className="far fa-trash-alt" />{" "}
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    </React.Fragment>
                                                                ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </LoadingOverlay>
                    {this.renderFormModal()}
                    {this.renderConfirmationModal()}
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    const { projectReducer } = state;
    return { projectReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...projectActions
    })(CriticalitySettings)
);
