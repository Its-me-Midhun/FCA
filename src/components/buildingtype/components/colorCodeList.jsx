import React, { Component } from "react";
import { connect } from "react-redux";

import ColorCodeForm from "../../project/components/ColorCodeForm";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import TableTopIcons from "../../common/components/TableTopIcons";
import buildingTypeActions from "../actions";
import { withRouter } from "react-router-dom";

class BuildingTypeColorSettings extends Component {
    state = {
        isloading: true,
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
        alertMessage: ""
    };

    componentDidMount() {
        this.props.getColorCodesBuildingType(this.props.match.params.id);
    }

    showAddForm() {
        this.setState({
            openForm: true,
            selectedItem: "",
            activeItem: {},
            name: "",
            from: "",
            to: "",
            colorCode: "",
            errorMessage: "",
            showErrorBorder: false
        });
    }

    validateForm() {
        const { name, from, to, colorCode } = this.state;
        if (!name.trim().length) {
            this.setState({
                showErrorBorder: true
            });
            return false;
        }
        if (!from.trim().length) {
            this.setState({
                showErrorBorder: true
            });
            return false;
        }
        if (!to.trim().length) {
            this.setState({
                showErrorBorder: true
            });
            return false;
        }
        if (!colorCode.trim().length) {
            this.setState({
                errorMessage: "* Color is required.",
                showErrorBorder: true
            });
            return false;
        }
        return true;
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

    addColorCode = async () => {
        const { name, from, to, colorCode } = this.state;
        if (this.validateForm()) {
            let data = {
                name,
                range_start: from,
                range_end: to,
                code: colorCode
            };
            await this.props.addColorCodeBuildingType(this.props.match.params.id, data);
            if (this.props.buildingTypeReducer.addColorCodeBuildingType && this.props.buildingTypeReducer.addColorCodeBuildingType.message) {
                await this.setState({
                    alertMessage: this.props.buildingTypeReducer.addColorCodeBuildingType.message
                });

                await this.showAlert();
            }

            await this.props.getColorCodesBuildingType(this.props.match.params.id);
            this.setState({
                openForm: false,
                activeButton: false,
                errorMessage: "",
                showErrorBorder: false
            });
        }
    };

    showAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = this.state.alertMessage;
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
                code: colorCode
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

    deleteColor = async id => {
        this.setState({
            showConfirmModal: true,
            selectedItem: id
        });
    };
    confirmDeleteColor = async () => {
        const { name, from, to, colorCode } = this.state;
        await this.props.deleteColorCodeBuildingType(this.props.match.params.id, this.state.selectedItem);
        await this.props.getColorCodesBuildingType(this.props.match.params.id);

        this.setState({ activeButton: false, showConfirmModal: false });
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you want to delete this Color Code ?"}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.confirmDeleteColor}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    renderFormModal = () => {
        const { openForm } = this.state;
        if (!openForm) return null;

        return (
            <Portal
                body={
                    <ColorCodeForm
                        onCancel={this.onCancel}
                        handleTo={this.handleTo}
                        handleName={this.handleName}
                        handleCode={this.handleCode}
                        handleFrom={this.handleFrom}
                        updateColor={this.updateColor}
                        addColorCode={this.addColorCode}
                        to={this.state.to}
                        activeButton={true}
                        name={this.state.name}
                        from={this.state.from}
                        activeItem={this.state.activeItem}
                        codeLoading={this.props.codeLoading}
                        errorMessage={this.state.errorMessage}
                        selectedItem={this.state.selectedItem}
                        showErrorBorder={this.state.showErrorBorder}
                    />
                }
                onCancel={this.onCancel}
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

    hadleEditButtonClick = code => {
        this.setState({
            openForm: true,
            selectedItem: code.id,
            activeItem: code,
            name: code.name,
            from: code.range_start,
            to: code.range_end,
            colorCode: code.code
        });
    };

    render() {
        const { getColorCodesBuildingType } = this.props.buildingTypeReducer;
        return (
            <div className={"tab-active project-settings-sec image-sec tab-grey settings-otr"}>
                <div className="dtl-sec col-md-12">
                    <div className="recomdn-table">
                        <div className="table-top-menu allign-right">
                            <div className="rgt">
                                <TableTopIcons
                                    hasGlobalSearch={false}
                                    hasSort={false}
                                    hasWildCardFilter={false}
                                    hasView={false}
                                    isExport={false}
                                    hasHelp={true}
                                    entity="color_codes"
                                />
                                <button className="add-btn" onClick={() => this.showAddForm()}>
                                    <i className="fas fa-plus" /> Add Color Code
                                </button>
                            </div>
                        </div>
                        <div data-testid="wrapper" className="_loading_overlay_wrapper css-79elbk">
                            <div className="dtl-sec system-building col-md-12">
                                <div className="tab-dtl region-mng fcl-clor bottom-table">
                                    <div
                                        className={`clor-lst ${
                                            getColorCodesBuildingType &&
                                            getColorCodesBuildingType.color_codes &&
                                            !getColorCodesBuildingType.color_codes.length
                                                ? "min-hgt"
                                                : ""
                                        }`}
                                    >
                                        {getColorCodesBuildingType &&
                                        getColorCodesBuildingType.color_codes &&
                                        !getColorCodesBuildingType.color_codes.length ? (
                                            <div className="h-ara">
                                                <div className="otr-topr">
                                                    <h2>No Data Found</h2>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="h-ara">
                                                    <div className="otr-topr">
                                                        <h2>Building Type FCI Color Setting</h2>
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
                                                                {getColorCodesBuildingType &&
                                                                    getColorCodesBuildingType.color_codes &&
                                                                    getColorCodesBuildingType.color_codes.length &&
                                                                    getColorCodesBuildingType.color_codes.map((code, i) => (
                                                                        <React.Fragment key={i}>
                                                                            <tr>
                                                                                <td>{code.name}</td>
                                                                                <td>
                                                                                    <div className="txt-set">
                                                                                        <div className="frm-set">
                                                                                            <input
                                                                                                className="form-control"
                                                                                                value={code.range_start}
                                                                                                disabled={true}
                                                                                            />
                                                                                        </div>
                                                                                        <h3>To</h3>
                                                                                        <div className="frm-set">
                                                                                            <input
                                                                                                type="text"
                                                                                                className="form-control"
                                                                                                value={code.range_end}
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
                                                                                                style={{ backgroundColor: `${code.code}` }}
                                                                                            ></div>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <span
                                                                                        className="left-sp cursor-hand"
                                                                                        onClick={() => {
                                                                                            this.hadleEditButtonClick(code);
                                                                                        }}
                                                                                    >
                                                                                        <i className="fas fa-pencil-alt" />{" "}
                                                                                    </span>
                                                                                    <span
                                                                                        className="cursor-hand"
                                                                                        onClick={() => this.deleteColor(code.id)}
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
                        </div>
                    </div>
                </div>
                {this.renderFormModal()}
                {this.renderConfirmationModal()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { buildingTypeReducer } = state;
    return { buildingTypeReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...buildingTypeActions
    })(BuildingTypeColorSettings)
);
