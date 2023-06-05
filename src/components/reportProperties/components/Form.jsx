import React, { Component } from "react";
import { CompactPicker } from "react-color";

import { ALIGNMENTS, FONT_COLOR, HEADINGS, LIST_STYLES, SPACING_RULE } from "../constants";
import NumberFormat from "react-number-format";
import { withRouter } from "react-router-dom";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import _ from "lodash";
import actions from "../actions";
import { connect } from "react-redux";
let initial_state = {
    id: "",
    name: "",
    description: "",
    notes: "",
    header_style1: {
        trade: { tag: "", font_size: null, font_id: "", font_color: "" },
        system: { tag: "", font_size: null, font_id: "", font_color: "" },
        subsystem: { tag: "", font_size: null, font_id: "", font_color: "" }
    },
    header_style2: {
        recommendations: {
            text: "",
            tag: "",
            header_font_id: "",
            header_font_size: null,
            header_font_color: "",
            para_font_id: "",
            para_font_size: null,
            para_font_color: "",
            line_spacing_rule: "",
            line_spacing: null,
            para_spacing: null,
            style_list: ""
        }
    },
    para_style: {
        font_id: "",
        font_color: "",
        font_size: null,
        highlight_color: "",
        line_spacing_rule: "",
        line_spacing: null,
        para_spacing: null,
        style_list: ""
    },
    caption_style: {
        font_id: "",
        font_color: "",
        font_size: null,
        alignment: ""
    },
    caption_style1: {
        font_id: "",
        font_color: "",
        font_size: null,
        alignment: ""
    },
    table_style: {
        table_style_id: "",
        header_font_id: "",
        header_font_size: null,
        body_font_id: "",
        body_font_size: null,
        body_font_color: "",
        footer_bkg_color: "",
        footer_font_id: "",
        footer_font_size: null,
        footer_font_color: ""
    },
    title_style: null
};
class Form extends Component {
    state = {
        showErrorBorder: false,
        excel_settings: initial_state,
        openColorModal1: false,
        openColorModal2: false,
        openColorModal3: false,
        openColorModal4: false,
        openColorModal5: false,
        openColorModal6: false,
        openColorModal7: false,
        openColorModal8: false,
        openColorModal9: false,
        openColorModal10: false,
        openColorModal11: false,
        openColorModal12: false,
        showConfirmModal: false,
        initialValues: {}
    };

    componentDidMount = async () => {
        this.getInitialDropdowns();
        if (this.props.selectedProperty) {
            let propertyData = await this.props.getPropertyDataById();
            await this.setState({
                excel_settings: {
                    id: propertyData.id,
                    name: propertyData.name,
                    description: propertyData.description,
                    notes: propertyData.notes,
                    header_style1: propertyData.header_style1,
                    header_style2: propertyData.header_style2,
                    para_style: propertyData.para_style,
                    caption_style: propertyData.caption_style,
                    caption_style1: propertyData.caption_style1,
                    table_style: propertyData.table_style,
                    title_style: null
                }
            });
        }
        this.setState({ initialValues: _.cloneDeep(this.state.excel_settings) });
    };

    getInitialDropdowns = () => {
        this.props.getDropdownList("fonts");
        this.props.getDropdownList("table_styles");
    };

    handleChangeFontColor = (color, style) => {
        let temp = this.state.excel_settings;
        temp[style].font_color = color.hex?.replace("#", "");
        this.setState({
            excel_settings: temp,
            openColorModal1: false,
            openColorModal2: false,
            openColorModal3: false,
            openColorModal4: false,
            openColorModal5: false,
            openColorModal6: false,
            openColorModal7: false,
            openColorModal8: false,
            openColorModal9: false
        });
    };

    handleChangeFontColorTabelstyle = (color, name) => {
        let temp = this.state.excel_settings;
        temp.table_style[name] = color.hex?.replace("#", "");
        this.setState({
            excel_settings: temp,
            openColorModal8: false,
            openColorModal9: false,
            openColorModal10: false
        });
    };

    handleChangeFontFamily = (e, style) => {
        let temp = this.state.excel_settings;
        temp[style].font_id = e.target.value;
        this.setState({
            excel_settings: temp
        });
    };

    handleChangeFontSize = (value, style) => {
        let temp = this.state.excel_settings;
        temp[style].font_size = value;
        this.setState({
            excel_settings: temp
        });
    };

    handleChangeAlignment = (e, style) => {
        let temp = this.state.excel_settings;
        temp[style].alignment = e.target.value;
        this.setState({
            excel_settings: temp
        });
    };

    handleChangeListStyle = (value, style) => {
        let temp = this.state.excel_settings;
        temp[style].style_list = value;
        this.setState({
            excel_settings: temp
        });
    };

    handleChangeLineSpacingRule = (value, style) => {
        let temp = this.state.excel_settings;
        temp[style].line_spacing_rule = value;
        if (value === "AT_LEAST" || value === "EXACTLY") {
            temp[style].line_spacing = 18;
        } else if (value === "MULTIPLE") {
            temp[style].line_spacing = 1.05;
        }
        this.setState({
            excel_settings: temp
        });
    };

    handleChangeLineSpacing = (value, style) => {
        let temp = this.state.excel_settings;
        temp[style].line_spacing = value;
        this.setState({
            excel_settings: temp
        });
    };

    handleChangeParaSpacing = (value, style) => {
        let temp = this.state.excel_settings;
        temp[style].para_spacing = value;
        this.setState({
            excel_settings: temp
        });
    };

    handleChangeTableStyle = (value, name) => {
        let temp = this.state.excel_settings;
        temp.table_style[name] = value;
        this.setState({
            excel_settings: temp
        });
    };

    handleChangeHeadingStyle = (e, state) => {
        let temp = this.state.excel_settings;
        const { name, value } = e.target;
        temp.header_style1[state][name] = value;
        this.setState({ excel_settings: temp });
    };

    handleChangeHeadingFontSize = (value, name) => {
        let temp = this.state.excel_settings;
        temp.header_style1[name].font_size = value;
        this.setState({ excel_settings: temp });
    };

    handleChangeHeadingFontColor = (color, name) => {
        let temp = this.state.excel_settings;
        temp.header_style1[name].font_color = color.hex?.replace("#", "");
        this.setState({
            excel_settings: temp,
            openColorModal2: false,
            openColorModal3: false,
            openColorModal4: false
        });
    };

    handleChangeRecomStyle = (e, param) => {
        let temp = this.state.excel_settings;
        if (param === "header_font_color" || param === "para_font_color") {
            let temp = this.state.excel_settings;
            temp.header_style2.recommendations[param] = e.hex?.replace("#", "");
            this.setState({
                excel_settings: temp,
                openColorModal11: false,
                openColorModal12: false
            });
        } else if (param === "para_font_size" || param === "header_font_size" || param === "line_spacing" || param === "para_spacing") {
            temp.header_style2.recommendations[param] = e;
            this.setState({
                excel_settings: temp
            });
        } else {
            const { name, value } = e.target;
            temp.header_style2.recommendations[name] = value;
            if (value === "AT_LEAST" || value === "EXACTLY") {
                temp.header_style2.recommendations.line_spacing = 18;
            } else if (value === "MULTIPLE") {
                temp.header_style2.recommendations.line_spacing = 1.05;
            }
            this.setState({ excel_settings: temp });
        }
    };

    handleChangeBasic = e => {
        const { name, value } = e?.target;
        this.setState({
            excel_settings: {
                ...this.state.excel_settings,
                [name]: value
            }
        });
    };

    validate = () => {
        const {
            header_style1: { trade, system, subsystem },
            header_style2: { recommendations },
            para_style,
            caption_style,
            caption_style1,
            table_style,
            name,
            description
        } = this.state.excel_settings;
        if (
            !name?.trim()?.length ||
            !description?.trim()?.length ||
            !trade.font_id ||
            !trade.font_color ||
            !trade.font_size ||
            !trade.tag ||
            !system.font_id ||
            !system.font_color ||
            !system.font_size ||
            !system.tag ||
            !subsystem.font_id ||
            !subsystem.font_color ||
            !subsystem.font_size ||
            !subsystem.tag ||
            !para_style.font_id ||
            !para_style.font_color ||
            !para_style.font_size ||
            !para_style.style_list ||
            !para_style.line_spacing_rule ||
            (!["SINGLE", "ONE_POINT_FIVE", "DOUBLE"].includes(para_style.line_spacing_rule) && !para_style.line_spacing) ||
            !para_style.para_spacing ||
            !recommendations.text ||
            !recommendations.tag ||
            !recommendations.header_font_id ||
            !recommendations.header_font_size ||
            !recommendations.header_font_color ||
            !recommendations.para_font_id ||
            !recommendations.para_font_size ||
            !recommendations.para_font_color ||
            !recommendations.style_list ||
            !recommendations.line_spacing_rule ||
            (!["SINGLE", "ONE_POINT_FIVE", "DOUBLE"].includes(recommendations.line_spacing_rule) && !recommendations.line_spacing) ||
            !recommendations.para_spacing ||
            !caption_style.font_id ||
            !caption_style.font_size ||
            !caption_style.font_color ||
            !caption_style.alignment ||
            !caption_style1.font_id ||
            !caption_style1.font_size ||
            !caption_style1.font_color ||
            !caption_style1.alignment ||
            !table_style.table_style_id ||
            !table_style.header_font_id ||
            !table_style.header_font_size ||
            !table_style.body_font_id ||
            !table_style.body_font_size ||
            !table_style.body_font_color ||
            !table_style.footer_bkg_color ||
            !table_style.footer_font_id ||
            !table_style.footer_font_size ||
            !table_style.footer_font_color
        ) {
            this.setState({ showErrorBorder: true });
            console.log("error");
            return false;
        }
        return true;
    };

    handleSubmit = () => {
        if (this.validate()) {
            if (this.props.selectedProperty) {
                this.props.handleUpdateProperty(this.state.excel_settings);
            } else {
                this.props.handleAddProperty(this.state.excel_settings);
            }
        }
    };

    cancelForm = () => {
        if (_.isEqual(this.state.initialValues, this.state.excel_settings)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        this.setState({
            excel_settings: initial_state,
            initialValues: initial_state
        });
        this.props.cancelForm();
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
    render() {
        const {
            excel_settings: {
                name,
                description,
                notes,
                header_style1: { trade, system, subsystem },
                header_style2: { recommendations },
                para_style,
                caption_style,
                caption_style1,
                table_style
            },
            showErrorBorder
        } = this.state;
        const {
            dropDownList: { fonts: FONT_FAMILY, table_styles: TABLE_STYLE }
        } = this.props.reportPropertyReducer;
        return (
            <>
                <div className="dtl-sec col-md-12 system-building">
                    <div className="otr-common-edit custom-col new-area">
                        <div className="row m-0 back-show p-2">
                            <div className="col-md-12 p-0">
                                <div className="basic-otr">
                                    <div className="basic-dtl-otr m-0 basic-sec p-0 w-100 row">
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Property Name *</h4>
                                                <input
                                                    autoComplete={"off"}
                                                    autoFill={"off"}
                                                    type="text"
                                                    className={`${
                                                        showErrorBorder && !name?.trim()?.length ? "error-border " : ""
                                                    }custom-input form-control`}
                                                    name="name"
                                                    onChange={e => this.handleChangeBasic(e)}
                                                    value={name}
                                                    placeholder="Enter Property Name"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Description *</h4>
                                                <input
                                                    autoComplete={"off"}
                                                    autoFill={"off"}
                                                    type="text"
                                                    className={`${
                                                        showErrorBorder && !description?.trim()?.length ? "error-border " : ""
                                                    }custom-input form-control`}
                                                    name="description"
                                                    onChange={e => this.handleChangeBasic(e)}
                                                    value={description}
                                                    placeholder="Enter Description"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4 basic-box">
                                            <div className="codeOtr">
                                                <h4>Notes</h4>
                                                <input
                                                    autoComplete={"off"}
                                                    autoFill={"off"}
                                                    type="text"
                                                    className={`custom-input form-control`}
                                                    name="notes"
                                                    onChange={e => this.handleChangeBasic(e)}
                                                    value={notes}
                                                    placeholder="Enter Notes"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="outer-font-section">
                        <div className="style-outer">
                            <div className="styles-box">
                                <h2>Trade Heading</h2>
                                <div className="styles-sec">
                                    <div className="d-flex f-outer">
                                        <div className="font-family font-st col-md-3">
                                            <label>Font Name *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !trade.font_id ? "error-border" : ""}`}
                                                    value={trade?.font_id}
                                                    name="font_id"
                                                    onChange={e => this.handleChangeHeadingStyle(e, "trade")}
                                                >
                                                    <option value="">Select</option>
                                                    {FONT_FAMILY.map(f => (
                                                        <option key={f.id} value={f.id}>
                                                            {f.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="font-size font-st col-md-3">
                                            <label>Font Size *</label>
                                            <div className={`input-ft-size`}>
                                                <NumberFormat
                                                    value={trade.font_size}
                                                    onValueChange={values => this.handleChangeHeadingFontSize(values.floatValue, "trade")}
                                                    allowNegative={false}
                                                    suffix=" Pt"
                                                    className={`${showErrorBorder && !trade.font_size ? "error-border" : ""}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="font-color font-st col-md-3">
                                            <label>Font Color *</label>
                                            <div className={`dropdown ${showErrorBorder && !trade.font_color ? "error-border" : ""}`}>
                                                <div
                                                    className="dropdown-toggle"
                                                    type="button"
                                                    onClick={() => {
                                                        this.setState({
                                                            openColorModal2: !this.state.openColorModal2
                                                        });
                                                    }}
                                                >
                                                    <span>{trade?.font_color || "Select"}</span>
                                                    <span
                                                        className="color-bx"
                                                        style={{ background: trade.font_color ? `#${trade?.font_color}` : "#fff" }}
                                                    ></span>
                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                </div>
                                                {this.state.openColorModal2 ? (
                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                        <CompactPicker
                                                            className="picker"
                                                            colors={FONT_COLOR}
                                                            color={trade?.font_color}
                                                            onChangeComplete={color => this.handleChangeHeadingFontColor(color, "trade")}
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="font-family font-st col-md-3">
                                            <label>Header Type *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !trade.tag ? "error-border" : ""}`}
                                                    name="tag"
                                                    value={trade.tag}
                                                    onChange={e => this.handleChangeHeadingStyle(e, "trade")}
                                                >
                                                    <option value="">Select</option>
                                                    {HEADINGS.map(f => (
                                                        <option key={f.value} value={f.value}>
                                                            {f.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="styles-box">
                                <h2>System Heading</h2>
                                <div className="styles-sec">
                                    <div className="d-flex f-outer">
                                        <div className="font-family font-st col-md-3">
                                            <label>Font Name *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !system.font_id ? "error-border" : ""}`}
                                                    value={system.font_id}
                                                    name="font_id"
                                                    onChange={e => this.handleChangeHeadingStyle(e, "system")}
                                                >
                                                    <option value="">Select</option>
                                                    {FONT_FAMILY.map(f => (
                                                        <option key={f.id} value={f.id}>
                                                            {f.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="font-size font-st col-md-3">
                                            <label>Font Size *</label>
                                            <div className={`input-ft-size`}>
                                                <NumberFormat
                                                    value={system.font_size}
                                                    onValueChange={values => this.handleChangeHeadingFontSize(values.floatValue, "system")}
                                                    allowNegative={false}
                                                    suffix=" Pt"
                                                    className={`${showErrorBorder && !system.font_size ? "error-border" : ""}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="font-color font-st col-md-3">
                                            <label>Font Color *</label>
                                            <div className={`dropdown ${showErrorBorder && !system.font_color ? "error-border" : ""}`}>
                                                <div
                                                    className="dropdown-toggle"
                                                    type="button"
                                                    onClick={() => {
                                                        this.setState({
                                                            openColorModal3: !this.state.openColorModal3
                                                        });
                                                    }}
                                                >
                                                    <span> {system.font_color || "Select"}</span>
                                                    <span className="color-bx" style={{ background: `#${system.font_color || "fff"}` }}></span>
                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                </div>
                                                {this.state.openColorModal3 ? (
                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                        <CompactPicker
                                                            colors={FONT_COLOR}
                                                            className="picker"
                                                            color={system.font_color}
                                                            onChangeComplete={color => this.handleChangeHeadingFontColor(color, "system")}
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="font-family font-st col-md-3">
                                            <label>Header Type *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !system.tag ? "error-border" : ""}`}
                                                    name="tag"
                                                    value={system.tag}
                                                    onChange={e => this.handleChangeHeadingStyle(e, "system")}
                                                >
                                                    <option value="">Select</option>
                                                    {HEADINGS.map(f => (
                                                        <option key={f.value} value={f.value}>
                                                            {f.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="styles-box">
                                <h2>Sub System Heading</h2>
                                <div className="styles-sec">
                                    <div className="d-flex f-outer">
                                        <div className="font-family font-st col-md-3">
                                            <label>Font Name *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !subsystem.font_id ? "error-border" : ""}`}
                                                    value={subsystem.font_id}
                                                    name="font_id"
                                                    onChange={e => this.handleChangeHeadingStyle(e, "subsystem")}
                                                >
                                                    <option value="">Select</option>
                                                    {FONT_FAMILY.map(f => (
                                                        <option key={f.id} value={f.id}>
                                                            {f.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="font-size font-st col-md-3">
                                            <label>Font Size *</label>
                                            <div className={`input-ft-size`}>
                                                <NumberFormat
                                                    value={subsystem.font_size}
                                                    onValueChange={values => this.handleChangeHeadingFontSize(values.floatValue, "subsystem")}
                                                    allowNegative={false}
                                                    suffix=" Pt"
                                                    className={`${showErrorBorder && !subsystem.font_size ? "error-border" : ""}`}
                                                />
                                            </div>
                                        </div>

                                        <div className="font-color font-st col-md-3">
                                            <label>Font Color *</label>
                                            <div className={`dropdown ${showErrorBorder && !subsystem.font_color ? "error-border" : ""}`}>
                                                <div
                                                    className="dropdown-toggle"
                                                    type="button"
                                                    onClick={() => {
                                                        this.setState({
                                                            openColorModal4: !this.state.openColorModal4
                                                        });
                                                    }}
                                                >
                                                    <span> {subsystem.font_color || "Select"}</span>
                                                    <span className="color-bx" style={{ background: `#${subsystem.font_color || "fff"}` }}></span>
                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                </div>
                                                {this.state.openColorModal4 ? (
                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                        <CompactPicker
                                                            className="picker"
                                                            colors={FONT_COLOR}
                                                            color={subsystem.font_color}
                                                            onChangeComplete={color => this.handleChangeHeadingFontColor(color, "subsystem")}
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="font-family font-st col-md-3">
                                            <label>Header Type *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !subsystem.tag ? "error-border" : ""}`}
                                                    name="tag"
                                                    value={subsystem.tag}
                                                    onChange={e => this.handleChangeHeadingStyle(e, "subsystem")}
                                                >
                                                    <option value="">Select</option>
                                                    {HEADINGS.map(f => (
                                                        <option key={f.value} value={f.value}>
                                                            {f.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="styles-box">
                                <h2>Paragraph</h2>
                                <div className="styles-sec">
                                    <div className="d-flex f-outer">
                                        <div className="font-family font-st col-md-3">
                                            <label>Font Name *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !para_style.font_id ? "error-border" : ""}`}
                                                    value={para_style.font_id}
                                                    onChange={e => this.handleChangeFontFamily(e, "para_style")}
                                                >
                                                    <option value="">Select</option>
                                                    {FONT_FAMILY.map(f => (
                                                        <option key={f.id} value={f.id}>
                                                            {f.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="font-size font-st col-md-3">
                                            <label>Font Size *</label>
                                            <div className={`input-ft-size`}>
                                                <NumberFormat
                                                    value={para_style.font_size}
                                                    onValueChange={values => this.handleChangeFontSize(values.floatValue, "para_style")}
                                                    allowNegative={false}
                                                    suffix=" Pt"
                                                    className={`${showErrorBorder && !para_style.font_size ? "error-border" : ""}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="font-color font-st col-md-3">
                                            <label>Font Color *</label>
                                            <div className={`dropdown ${showErrorBorder && !para_style.font_color ? "error-border" : ""}`}>
                                                <div
                                                    className="dropdown-toggle"
                                                    type="button"
                                                    onClick={() => {
                                                        this.setState({
                                                            openColorModal5: !this.state.openColorModal5
                                                        });
                                                    }}
                                                >
                                                    <span>{para_style.font_color || "Select"}</span>
                                                    <span className="color-bx" style={{ background: `#${para_style.font_color || "fff"}` }}></span>
                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                </div>
                                                {this.state.openColorModal5 ? (
                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                        <CompactPicker
                                                            className="picker"
                                                            colors={FONT_COLOR}
                                                            color={para_style.font_color}
                                                            onChangeComplete={color => this.handleChangeFontColor(color, "para_style")}
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex f-outer">
                                        <div className="font-family font-st col-md-3">
                                            <label>List Style *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !para_style.style_list ? "error-border" : ""}`}
                                                    value={para_style.style_list}
                                                    onChange={e => this.handleChangeListStyle(e.target.value, "para_style")}
                                                >
                                                    <option value="">Select</option>
                                                    {LIST_STYLES.map(f => (
                                                        <option key={f.value} value={f.value}>
                                                            {f.value}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="font-size font-st col-md-3">
                                            <label>Para Spacing *</label>
                                            <div className={`input-ft-size`}>
                                                <NumberFormat
                                                    value={para_style.para_spacing}
                                                    onValueChange={values => this.handleChangeParaSpacing(values.floatValue, "para_style")}
                                                    allowNegative={false}
                                                    suffix=" pt"
                                                    className={`${showErrorBorder && !para_style.para_spacing ? "error-border" : ""}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="font-family font-st col-md-3">
                                            <label>Line Spacing Rule *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !para_style.line_spacing_rule ? "error-border" : ""}`}
                                                    value={para_style.line_spacing_rule}
                                                    name="line_spacing_rule"
                                                    onChange={e => this.handleChangeLineSpacingRule(e.target.value, "para_style")}
                                                >
                                                    <option value="">Select</option>
                                                    {SPACING_RULE.map(f => (
                                                        <option key={f.value} value={f.value}>
                                                            {f.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {!["SINGLE", "ONE_POINT_FIVE", "DOUBLE"].includes(para_style?.line_spacing_rule) ? (
                                            <div className="font-size font-st col-md-3">
                                                <label>Line Spacing *</label>
                                                <div className={`input-ft-size`}>
                                                    <NumberFormat
                                                        value={para_style.line_spacing}
                                                        onValueChange={values => this.handleChangeLineSpacing(values.floatValue, "para_style")}
                                                        allowNegative={false}
                                                        suffix={para_style.line_spacing_rule === "MULTIPLE" ? "" : " pt"}
                                                        className={`${showErrorBorder && !para_style.line_spacing ? "error-border" : ""}`}
                                                    />
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="styles-box">
                                <h2>Recommendation</h2>
                                <div className="styles-sec">
                                    <div className="d-flex f-outer">
                                        <div className="font-family font-st col-md-3">
                                            <label>Header Font Name *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !recommendations.header_font_id ? "error-border" : ""}`}
                                                    name="header_font_id"
                                                    value={recommendations.header_font_id}
                                                    onChange={e => this.handleChangeRecomStyle(e)}
                                                >
                                                    <option value="">Select</option>
                                                    {FONT_FAMILY.map(f => (
                                                        <option key={f.id} value={f.id}>
                                                            {f.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="font-size font-st col-md-3">
                                            <label>Header Font Size *</label>
                                            <div className={`input-ft-size`}>
                                                <NumberFormat
                                                    value={recommendations.header_font_size}
                                                    onValueChange={values => this.handleChangeRecomStyle(values.floatValue, "header_font_size")}
                                                    allowNegative={false}
                                                    suffix=" Pt"
                                                    className={`${showErrorBorder && !recommendations.header_font_size ? "error-border" : ""}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="font-color font-st col-md-3">
                                            <label>Header Font Color *</label>
                                            <div
                                                className={`dropdown ${showErrorBorder && !recommendations.header_font_color ? "error-border" : ""}`}
                                            >
                                                <div
                                                    className="dropdown-toggle"
                                                    type="button"
                                                    onClick={() => {
                                                        this.setState({
                                                            openColorModal11: !this.state.openColorModal11
                                                        });
                                                    }}
                                                >
                                                    <span> {recommendations.header_font_color || "Select"}</span>
                                                    <span
                                                        className="color-bx"
                                                        style={{ background: `#${recommendations.header_font_color || "fff"}` }}
                                                    ></span>
                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                </div>
                                                {this.state.openColorModal11 ? (
                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                        <CompactPicker
                                                            className="picker"
                                                            colors={FONT_COLOR}
                                                            color={recommendations.header_font_color}
                                                            onChangeComplete={color => this.handleChangeRecomStyle(color, "header_font_color")}
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="font-family font-st col-md-3">
                                            <label>Header Type *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !recommendations.tag ? "error-border" : ""}`}
                                                    name="tag"
                                                    value={recommendations.tag}
                                                    onChange={e => this.handleChangeRecomStyle(e)}
                                                >
                                                    <option value="">Select</option>
                                                    {HEADINGS.map(f => (
                                                        <option key={f.value} value={f.value}>
                                                            {f.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex f-outer">
                                        <div className="font-size font-st col-md-3">
                                            <label>Header Text *</label>
                                            <div className={`input-ft-text`}>
                                                <input
                                                    type="text"
                                                    onChange={e => this.handleChangeRecomStyle(e)}
                                                    value={recommendations.text}
                                                    name="text"
                                                    className={`${showErrorBorder && !recommendations.text?.trim().length ? "error-border" : ""}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex f-outer">
                                        <div className="font-family font-st col-md-3">
                                            <label>Para Font Name *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !recommendations.para_font_id ? "error-border" : ""}`}
                                                    value={recommendations.para_font_id}
                                                    name="para_font_id"
                                                    onChange={e => this.handleChangeRecomStyle(e)}
                                                >
                                                    <option value="">Select</option>
                                                    {FONT_FAMILY.map(f => (
                                                        <option key={f.id} value={f.id}>
                                                            {f.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="font-size font-st col-md-3">
                                            <label>Para Font Size *</label>
                                            <div className={`input-ft-size`}>
                                                <NumberFormat
                                                    value={recommendations.para_font_size}
                                                    onValueChange={values => this.handleChangeRecomStyle(values.floatValue, "para_font_size")}
                                                    allowNegative={false}
                                                    suffix=" Pt"
                                                    className={`${showErrorBorder && !recommendations.para_font_size ? "error-border" : ""}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="font-color font-st col-md-3">
                                            <label>Para Font Color *</label>
                                            <div className={`dropdown ${showErrorBorder && !recommendations.para_font_color ? "error-border" : ""}`}>
                                                <div
                                                    className="dropdown-toggle"
                                                    type="button"
                                                    onClick={() => {
                                                        this.setState({
                                                            openColorModal12: !this.state.openColorModal12
                                                        });
                                                    }}
                                                >
                                                    <span> {recommendations.para_font_color || "Select"}</span>
                                                    <span
                                                        className="color-bx"
                                                        style={{ background: `#${recommendations.para_font_color || "fff"}` }}
                                                    ></span>
                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                </div>
                                                {this.state.openColorModal12 ? (
                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                        <CompactPicker
                                                            className="picker"
                                                            colors={FONT_COLOR}
                                                            color={recommendations.para_font_color}
                                                            onChangeComplete={color => this.handleChangeRecomStyle(color, "para_font_color")}
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="font-size font-st col-md-3">
                                            <label>Para Spacing *</label>
                                            <div className={`input-ft-size`}>
                                                <NumberFormat
                                                    value={recommendations.para_spacing}
                                                    onValueChange={values => this.handleChangeRecomStyle(values.floatValue, "para_spacing")}
                                                    allowNegative={false}
                                                    suffix=" pt"
                                                    className={`${showErrorBorder && !recommendations.para_spacing ? "error-border" : ""}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex f-outer">
                                        <div className="font-family font-st col-md-3">
                                            <label>List Style *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !recommendations.style_list ? "error-border" : ""}`}
                                                    value={recommendations.style_list}
                                                    name="style_list"
                                                    onChange={e => this.handleChangeRecomStyle(e, "style_list")}
                                                >
                                                    <option value="">Select</option>
                                                    {LIST_STYLES.map(f => (
                                                        <option key={f.value} value={f.value}>
                                                            {f.value}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="font-family font-st col-md-3">
                                            <label>Line Spacing Rule *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${
                                                        showErrorBorder && !recommendations.line_spacing_rule ? "error-border" : ""
                                                    }`}
                                                    value={recommendations.line_spacing_rule}
                                                    name="line_spacing_rule"
                                                    onChange={e => this.handleChangeRecomStyle(e, "line_spacing_rule")}
                                                >
                                                    <option value="">Select</option>
                                                    {SPACING_RULE.map(f => (
                                                        <option key={f.value} value={f.value}>
                                                            {f.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {!["SINGLE", "ONE_POINT_FIVE", "DOUBLE"].includes(recommendations?.line_spacing_rule) ? (
                                            <div className="font-size font-st col-md-3">
                                                <label>Line Spacing *</label>
                                                <div className={`input-ft-size`}>
                                                    <NumberFormat
                                                        value={recommendations.line_spacing}
                                                        onValueChange={values => this.handleChangeRecomStyle(values.floatValue, "line_spacing")}
                                                        allowNegative={false}
                                                        suffix={recommendations.line_spacing_rule === "MULTIPLE" ? "" : " pt"}
                                                        className={`${showErrorBorder && !recommendations.line_spacing ? "error-border" : ""}`}
                                                    />
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="styles-box">
                                <h2>Single Image Caption</h2>
                                <div className="styles-sec">
                                    <div className="d-flex f-outer">
                                        <div className="font-family font-st col-md-3">
                                            <label>Font Name *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !caption_style.font_id ? "error-border" : ""}`}
                                                    value={caption_style.font_id}
                                                    onChange={e => this.handleChangeFontFamily(e, "caption_style")}
                                                >
                                                    <option value="">Select</option>
                                                    {FONT_FAMILY.map(f => (
                                                        <option key={f.id} value={f.id}>
                                                            {f.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="font-size font-st col-md-3">
                                            <label>Font Size *</label>
                                            <div className={`input-ft-size`}>
                                                <NumberFormat
                                                    value={caption_style.font_size}
                                                    onValueChange={values => this.handleChangeFontSize(values.floatValue, "caption_style")}
                                                    allowNegative={false}
                                                    suffix=" Pt"
                                                    className={`${showErrorBorder && !caption_style.font_size ? "error-border" : ""}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="font-color font-st col-md-3">
                                            <label>Font Color *</label>
                                            <div className={`dropdown ${showErrorBorder && !caption_style.font_color ? "error-border" : ""}`}>
                                                <div
                                                    className="dropdown-toggle"
                                                    type="button"
                                                    onClick={() => {
                                                        this.setState({
                                                            openColorModal6: !this.state.openColorModal6
                                                        });
                                                    }}
                                                >
                                                    <span>{caption_style.font_color || "Select"}</span>
                                                    <span className="color-bx" style={{ background: `#${caption_style.font_color || "fff"}` }}></span>
                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                </div>
                                                {this.state.openColorModal6 ? (
                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                        <CompactPicker
                                                            className="picker"
                                                            colors={FONT_COLOR}
                                                            color={caption_style.font_color}
                                                            onChangeComplete={color => this.handleChangeFontColor(color, "caption_style")}
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="font-family font-st col-md-3">
                                            <label>Alignment *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !caption_style.alignment ? "error-border" : ""}`}
                                                    value={caption_style.alignment}
                                                    onChange={e => this.handleChangeAlignment(e, "caption_style")}
                                                >
                                                    <option value="">Select</option>
                                                    {ALIGNMENTS.map(f => (
                                                        <option key={f.value} value={f.value}>
                                                            {f.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="styles-box">
                                <h2>Double Image Caption</h2>
                                <div className="styles-sec">
                                    <div className="d-flex f-outer">
                                        <div className="font-family font-st col-md-3">
                                            <label>Font Name *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !caption_style1.font_id ? "error-border" : ""}`}
                                                    value={caption_style1.font_id}
                                                    onChange={e => this.handleChangeFontFamily(e, "caption_style1")}
                                                >
                                                    <option value="">Select</option>
                                                    {FONT_FAMILY.map(f => (
                                                        <option key={f.id} value={f.id}>
                                                            {f.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="font-size font-st col-md-3">
                                            <label>Font Size *</label>
                                            <div className={`input-ft-size`}>
                                                <NumberFormat
                                                    value={caption_style1.font_size}
                                                    onValueChange={values => this.handleChangeFontSize(values.floatValue, "caption_style1")}
                                                    allowNegative={false}
                                                    suffix=" Pt"
                                                    className={`${showErrorBorder && !caption_style1.font_size ? "error-border" : ""}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="font-color font-st col-md-3">
                                            <label>Font Color *</label>
                                            <div className={`dropdown ${showErrorBorder && !caption_style1.font_color ? "error-border" : ""}`}>
                                                <div
                                                    className="dropdown-toggle"
                                                    type="button"
                                                    onClick={() => {
                                                        this.setState({
                                                            openColorModal7: !this.state.openColorModal7
                                                        });
                                                    }}
                                                >
                                                    <span> {caption_style1.font_color || "Select"}</span>
                                                    <span
                                                        className="color-bx"
                                                        style={{ background: `#${caption_style1.font_color || "fff"}` }}
                                                    ></span>
                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                </div>
                                                {this.state.openColorModal7 ? (
                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                        <CompactPicker
                                                            className="picker"
                                                            colors={FONT_COLOR}
                                                            color={this.state.excel_settings["caption_style1"].font_color || "#006A4D"}
                                                            onChangeComplete={color => this.handleChangeFontColor(color, "caption_style1")}
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="font-family font-st col-md-3">
                                            <label>Alignment *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !caption_style1.alignment ? "error-border" : ""}`}
                                                    value={caption_style1.alignment}
                                                    onChange={e => this.handleChangeAlignment(e, "caption_style1")}
                                                >
                                                    <option value="">Select</option>
                                                    {ALIGNMENTS.map(f => (
                                                        <option key={f.value} value={f.value}>
                                                            {f.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="styles-box">
                                <h2>Table Style</h2>
                                <div className="styles-sec table-sec">
                                    <div className="d-flex f-outer">
                                        <div className="font-family font-st col-md-3">
                                            <label>Table Syle *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !table_style.table_style_id ? "error-border" : ""}`}
                                                    value={table_style?.table_style_id}
                                                    onChange={e => this.handleChangeTableStyle(e.target.value, "table_style_id")}
                                                >
                                                    <option value="">Select</option>
                                                    {TABLE_STYLE.map(f => (
                                                        <option value={f.id} key={f.id}>
                                                            {f.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex f-outer">
                                        <div className="font-family font-st col-md-3">
                                            <label>Header Font Name *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !table_style.header_font_id ? "error-border" : ""}`}
                                                    value={table_style?.header_font_id}
                                                    onChange={e => this.handleChangeTableStyle(e.target.value, "header_font_id")}
                                                >
                                                    <option value="">Select</option>
                                                    {FONT_FAMILY.map(f => (
                                                        <option key={f.id} value={f.id}>
                                                            {f.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="font-size font-st col-md-3">
                                            <label>Header Font Size *</label>
                                            <div className={`input-ft-size`}>
                                                <NumberFormat
                                                    value={table_style?.header_font_size}
                                                    onValueChange={values => this.handleChangeTableStyle(values.floatValue, "header_font_size")}
                                                    allowNegative={false}
                                                    suffix=" Pt"
                                                    className={`${showErrorBorder && !table_style.header_font_size ? "error-border" : ""}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex f-outer">
                                        <div className="font-family font-st col-md-3">
                                            <label>Body Font Name *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !table_style.body_font_id ? "error-border" : ""}`}
                                                    value={table_style.body_font_id}
                                                    onChange={e => this.handleChangeTableStyle(e.target.value, "body_font_id")}
                                                >
                                                    <option value="">Select</option>
                                                    {FONT_FAMILY.map(f => (
                                                        <option key={f.id} value={f.id}>
                                                            {f.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="font-size font-st col-md-3">
                                            <label>Body Font Size *</label>
                                            <div className={`input-ft-size`}>
                                                <NumberFormat
                                                    value={table_style?.body_font_size}
                                                    onValueChange={values => this.handleChangeTableStyle(values.floatValue, "body_font_size")}
                                                    allowNegative={false}
                                                    suffix=" Pt"
                                                    className={`${showErrorBorder && !table_style.body_font_size ? "error-border" : ""}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="font-color font-st col-md-3">
                                            <label>Body Font Color *</label>
                                            <div className={`dropdown ${showErrorBorder && !table_style.body_font_color ? "error-border" : ""}`}>
                                                <div
                                                    className="dropdown-toggle"
                                                    type="button"
                                                    onClick={() => {
                                                        this.setState({
                                                            openColorModal9: !this.state.openColorModal9
                                                        });
                                                    }}
                                                >
                                                    <span> {table_style?.body_font_color || "Select"}</span>
                                                    <span
                                                        className="color-bx"
                                                        style={{ background: `#${table_style?.body_font_color || "fff"}` }}
                                                    ></span>
                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                </div>
                                                {this.state.openColorModal9 ? (
                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                        <CompactPicker
                                                            className="picker"
                                                            colors={FONT_COLOR}
                                                            color={table_style.body_font_color}
                                                            onChangeComplete={color => this.handleChangeFontColorTabelstyle(color, "body_font_color")}
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex f-outer">
                                        <div className="font-family font-st col-md-3">
                                            <label>Footer Font Name *</label>
                                            <div className="font-select">
                                                <select
                                                    className={`dropdown ${showErrorBorder && !table_style.footer_font_id ? "error-border" : ""}`}
                                                    value={table_style.footer_font_id}
                                                    onChange={e => this.handleChangeTableStyle(e.target.value, "footer_font_id")}
                                                >
                                                    <option value="">Select</option>
                                                    {FONT_FAMILY.map(f => (
                                                        <option key={f.id} value={f.id}>
                                                            {f.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="font-size font-st col-md-3">
                                            <label>Footer Font Size *</label>
                                            <div className={`input-ft-size`}>
                                                <NumberFormat
                                                    value={table_style?.footer_font_size}
                                                    onValueChange={values => this.handleChangeTableStyle(values.floatValue, "footer_font_size")}
                                                    allowNegative={false}
                                                    suffix=" Pt"
                                                    className={`${showErrorBorder && !table_style.footer_font_size ? "error-border" : ""}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="font-color font-st col-md-3">
                                            <label>Footer Font Color *</label>
                                            <div className={`dropdown ${showErrorBorder && !table_style.footer_font_color ? "error-border" : ""}`}>
                                                <div
                                                    className="dropdown-toggle"
                                                    type="button"
                                                    onClick={() => {
                                                        this.setState({
                                                            openColorModal10: !this.state.openColorModal10
                                                        });
                                                    }}
                                                >
                                                    <span> {table_style?.footer_font_color || "Select"}</span>
                                                    <span
                                                        className="color-bx"
                                                        style={{ background: `#${table_style?.footer_font_color || "fff"}` }}
                                                    ></span>
                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                </div>
                                                {this.state.openColorModal10 ? (
                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                        <CompactPicker
                                                            className="picker"
                                                            colors={FONT_COLOR}
                                                            color={table_style.footer_font_color}
                                                            onChangeComplete={color =>
                                                                this.handleChangeFontColorTabelstyle(color, "footer_font_color")
                                                            }
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="font-color font-st col-md-3">
                                            <label>Footer Background Color *</label>
                                            <div className={`dropdown ${showErrorBorder && !table_style.footer_bkg_color ? "error-border" : ""}`}>
                                                <div
                                                    className="dropdown-toggle"
                                                    type="button"
                                                    onClick={() => {
                                                        this.setState({
                                                            openColorModal8: !this.state.openColorModal8
                                                        });
                                                    }}
                                                >
                                                    <span> {table_style?.footer_bkg_color || "Select"}</span>
                                                    <span
                                                        className="color-bx"
                                                        style={{ background: `#${table_style?.footer_bkg_color || "fff"}` }}
                                                    ></span>
                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                </div>
                                                {this.state.openColorModal8 ? (
                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                        <CompactPicker
                                                            className="picker"
                                                            colors={FONT_COLOR}
                                                            color={table_style.footer_bkg_color}
                                                            onChangeComplete={color =>
                                                                this.handleChangeFontColorTabelstyle(color, "footer_bkg_color")
                                                            }
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="add-btn-wrapper pt-0 mt-2">
                            <>
                                {showErrorBorder && <span className="errorMessage">* Required fields are missing</span>}
                                <button className="button ml-2 cursor-hand" onClick={() => this.cancelForm()}>
                                    Cancel
                                </button>
                                <button className={`button btn-save ml-2 cursor-hand`} onClick={() => this.handleSubmit()}>
                                    {this.props.selectedProperty ? "Update Property" : "Add Property"}
                                </button>
                            </>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </>
        );
    }
}
const mapStateToProps = state => {
    const { reportPropertyReducer } = state;
    return { reportPropertyReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions
    })(Form)
);
