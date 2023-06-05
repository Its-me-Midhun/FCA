import React, { Component } from "react";

import ColorCodeForm from "../ColorCodeForm";
import Portal from "../../../common/components/Portal";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import TableTopIcons from "../../../common/components/TableTopIcons";
import { checkPermission } from "../../../../config/utils";

class EFCIColorSettings extends Component {
    state = {
        isloading: true,
        openForm: false,
        openColorCode: false,
        name: "",
        from: "",
        to: "",
        from_flag: false,
        to_flag: false,
        colorCode: "",
        selectedItem: "",
        activeButton: false,
        activeItem: {},
        errorMessage: "",
        showErrorBorder: false,
        showConfirmModal: false
    };

    componentDidMount() {
        this.props.getEFCIColorCode();
    }

    showAddForm() {
        this.setState({
            openForm: true,
            selectedItem: "",
            activeItem: {},
            name: "",
            from: "",
            from_flag: false,
            to_flag: false,
            to: "",
            colorCode: "",
            errorMessage: "",
            showErrorBorder: false
        });
    }

    validateForm() {
        const { name, from, to, colorCode } = this.state;
        var max = 4; //  number of digits after decimal places
        var f = from.toString().split(".");
        var t = to.toString().split(".");
        var a = parseFloat(from);
        var b = parseFloat(to);

        this.setState({
            from_flag: false,
            to_flag: false
        });
        if (!name.trim().length) {
            this.setState({
                showErrorBorder: true
            });
            return false;
        }
        if (!from.trim().length) {
            this.setState({
                from_flag: true,
                errorMessage: "* Scale value is required.",
                showErrorBorder: true
            });
            return false;
        }
        if (f[1] && f[1].length < max) {
            this.setState({
                from_flag: true,
                errorMessage: "* Minimum 4 decimal is required.",
                showErrorBorder: true
            });
            return false;
        }
        if (isNaN(a)) {
            this.setState({
                from_flag: true,
                errorMessage: "* Please enter a number.",
                showErrorBorder: true
            });
            return false;
        }
        if (!to.trim().length) {
            this.setState({
                to_flag: true,
                errorMessage: "* Scale value is required.",
                showErrorBorder: true
            });
            return false;
        }
        if (t[1] && t[1].length < max) {
            this.setState({
                to_flag: true,
                errorMessage: "* Minimum 4 decimal is required.",
                showErrorBorder: true
            });
            return false;
        }
        if (isNaN(b)) {
            this.setState({
                to_flag: true,
                errorMessage: "* Please enter a number.",
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
            showErrorBorder: false,
            from_flag: false,
            to_flag: false
        });
    };

    addColorCode = async () => {
        const { name, from, to, colorCode } = this.state;
        if (this.validateForm()) {
            await this.props.addColor(name, from, to, colorCode);
            this.setState({
                openForm: false,
                activeButton: false,
                errorMessage: "",
                showErrorBorder: false
            });
        }
    };

    updateColor = async () => {
        const { name, from, to, colorCode } = this.state;
        if (this.validateForm()) {
            await this.props.updateColors(this.state.selectedItem, name, from, to, colorCode);
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
        await this.props.deleteColors(this.state.selectedItem);
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
                        from_flag={this.state.from_flag}
                        to_flag={this.state.to_flag}
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
        const { colorCodes } = this.props;
        return (
            <>
                <div className="table-top-menu allign-right">
                    <div className="rgt">
                        <TableTopIcons
                            hasGlobalSearch={false}
                            hasSort={false}
                            hasWildCardFilter={false}
                            hasView={false}
                            isExport={false}
                            hasHelp={true}
                            entity="efci_colors"
                        />
                        {checkPermission("forms", "efci_colors", "create") && (
                            <button className="add-btn" onClick={() => this.showAddForm()}>
                                <i className="fas fa-plus" /> Add Color Code
                            </button>
                        )}
                    </div>
                </div>
                <div data-testid="wrapper" className="_loading_overlay_wrapper css-79elbk">
                    <div className="dtl-sec system-building col-md-12">
                        <div className="tab-dtl region-mng fcl-clor bottom-table">
                            <div className={`clor-lst ${!colorCodes.length ? "min-hgt" : ""}`}>
                                {colorCodes && !colorCodes.length ? (
                                    <div className="h-ara">
                                        <div className="otr-topr">
                                            <h2>No Data Found</h2>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="h-ara">
                                            <div className="otr-topr">
                                                <h2>EFCI Color Setting</h2>
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
                                                        {colorCodes &&
                                                            colorCodes.length &&
                                                            colorCodes.map((code, i) => (
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
                                                                            {/* -----------colorcodelog------------------- */}
                                                                            {checkPermission("logs", "efci_colors", "view") && (
                                                                                <span
                                                                                    className="left-sp cursor-hand"
                                                                                    onClick={() => {
                                                                                        this.props.showColorcodeLog(code.id);
                                                                                    }}
                                                                                >
                                                                                    <i className="fas fa-history cursor-hand" />
                                                                                </span>
                                                                            )}
                                                                            {/* ---------------colorcodelog------------------- */}
                                                                            {checkPermission("forms", "efci_colors", "edit") && (
                                                                                <span
                                                                                    className="left-sp cursor-hand"
                                                                                    onClick={() => {
                                                                                        this.hadleEditButtonClick(code);
                                                                                    }}
                                                                                >
                                                                                    <i className="fas fa-pencil-alt" />{" "}
                                                                                </span>
                                                                            )}
                                                                            {checkPermission("forms", "efci_colors", "delete") && (
                                                                                <span
                                                                                    className="cursor-hand"
                                                                                    onClick={() => this.deleteColor(code.id)}
                                                                                >
                                                                                    <i className="far fa-trash-alt" />{" "}
                                                                                </span>
                                                                            )}
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
                {this.renderFormModal()}
                {this.renderConfirmationModal()}
            </>
        );
    }
}
export default EFCIColorSettings;
