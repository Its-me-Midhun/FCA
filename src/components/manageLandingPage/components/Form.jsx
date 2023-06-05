import React, { Component } from "react";
import { CompactPicker } from "react-color";

import { FONT_COLOR, FONT_FAMILY, FEEDS, WIDGETS } from "../constants";
import NumberFormat from "react-number-format";
import { withRouter } from "react-router-dom";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import { popBreadCrumpOnPageClose } from "../../../config/utils";

let initial_state = {
    header_style: { tag: "", font_size: null, font_name: "", font_color: "", is_bold: false },
    client_name_style: { tag: "", font_size: null, font_name: "", font_color: "", is_bold: false },
    feed: "",
    logo: "",
    image: "",
    header: "",
    widget: "",
    feed_id: "",
    logo_url_link: "",
    cbre_url: "",
    cbre_logo: "",
    client_name: ""
};

class Form extends Component {
    state = {
        selectedFeed: null,
        cbreLogoPreview: null,
        showErrorBorder: false,
        openColorModal1: false,
        openColorModal2: false,
        clientLogoPreview: null,
        showConfirmModal: false,
        clientImagePreview: null,
        landing_pages: initial_state,
        initialValues: initial_state,
        file_change: {
            logo_change: false,
            image_change: false,
            cbre_logo_change: false
        }
    };

    componentDidMount = async () => {
        // if (this.props.selectedProperty) {
        let id = this.props.match.params.id;
        let propertyData = await this.props.getLandingPageData({ client_id: id });
        this.setState(
            {
                landing_pages: {
                    client_id: id,
                    id: propertyData.id,
                    header: propertyData.header,
                    client_name: propertyData.client_name,
                    header_style: propertyData.header_style || initial_state.header_style,
                    client_name_style: propertyData.client_name_style || initial_state.client_name_style,
                    feed: propertyData?.feed,
                    feed_id: propertyData?.feed_id,
                    widget: propertyData?.widget,
                    image: propertyData.image,
                    logo: propertyData.logo,
                    logo_url_link: propertyData.logo_url_link,
                    cbre_logo: propertyData?.cbre_logo,
                    cbre_url: propertyData.cbre_url
                }
            },
            () => this.setState({ initialValues: this.state.landing_pages })
        );
    };

    handleCbreLogoChange = e => {
        const uploadedImg = e.target.files[0];
        let temp = this.state.landing_pages;
        temp.cbre_logo = uploadedImg;
        this.setState({
            cbreLogoPreview: URL.createObjectURL(uploadedImg),
            landing_pages: temp,
            file_change: { ...this.state.file_change, cbre_logo_change: true }
        });
        console.log(this.state.landing_pages);
    };
    handleClientLogoChange = e => {
        const uploadedImg = e.target.files[0];
        let temp = this.state.landing_pages;
        temp.logo = uploadedImg;
        this.setState({
            landing_pages: temp,
            clientLogoPreview: URL.createObjectURL(uploadedImg),
            file_change: { ...this.state.file_change, logo_change: true }
        });
    };
    handleClientImageChange = e => {
        const uploadedImg = e.target.files[0];
        let temp = this.state.landing_pages;
        temp.image = uploadedImg;
        this.setState({
            landing_pages: temp,
            clientImagePreview: URL.createObjectURL(uploadedImg),
            file_change: { ...this.state.file_change, image_change: true }
        });
    };
    handleUrlChange = e => {
        const { name, value } = e?.target;
        let temp = this.state.landing_pages;
        temp[name] = value;
        this.setState({ landing_pages: temp });
    };
    handleHeaderChange = e => {
        let temp = this.state.landing_pages;
        const { name, value } = e.target;
        temp[name] = value;
        this.setState({ landing_pages: temp });
    };
    handleFontNameChange = (e, state) => {
        let temp = this.state.landing_pages;
        const { name, value } = e.target;
        temp[state][name] = value;
        this.setState({ landing_pages: temp });
    };
    handleFontColorChange = (color, state, name) => {
        let temp = this.state.landing_pages;
        temp[state][name] = color.hex?.replace("#", "");
        this.setState({ landing_pages: temp, openColorModal1: false, openColorModal2: false });

        console.log(this.state.landing_pages);
    };
    handleFontSizeChange = (value, state, name) => {
        let temp = this.state.landing_pages;
        temp[state][name] = value;
        this.setState({ landing_pages: temp });
    };
    handleIsBoldChange = (e, state) => {
        let temp = this.state.landing_pages;
        const { name } = e.target;
        temp[state][name] = e.target.checked;
        this.setState({ landing_pages: temp });
    };
    handleFeedChange = e => {
        let temp = this.state.landing_pages;
        const {  value } = e.target;
        temp.feed = value;
        this.setState({ landing_pages: temp });
    };
    handleFeedIdChange = e => {
        let temp = this.state.landing_pages;
        const {  value } = e.target;
        temp.feed_id = value;
        this.setState({ landing_pages: temp });
    };
    handleWidgetChange = e => {
        let temp = this.state.landing_pages;
        const {  value } = e.target;
        temp.widget = value;
        this.setState({ landing_pages: temp });
    };

    validate = () => {
        const { id, header, client_name, header_style, client_name_style, feed, feed_id, widget, cbre_url, logo_url_link } = this.state.landing_pages;
        // if (
        // !header
        // !client_name ||
        // !header_style.font_color ||
        // !header_style.font_name ||
        // !header_style.font_size ||
        // !client_name_style.font_color ||
        // !client_name_style.font_name ||
        // !client_name_style.font_size ||
        // !feed ||
        // !feed_id ||
        // !widget ||
        // !cbre_url ||
        // !logo_url_link
        // ) {
        //     this.setState({ showErrorBorder: true });
        //     console.log("error");
        //     return false;
        // }
        return true;
    };

    cancelForm = () => {
        this.setState({
            showConfirmModal: true
        });
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

    clearForm = async () => {
        this.setState({ showConfirmModal: false });
        const { history } = this.props;
        popBreadCrumpOnPageClose();
        history.push(`/settings/manageLandingPage`);
    };

    handleSubmit = async () => {
        if (this.validate()) {
            if (this.state.landing_pages?.id) {
                await this.props.updateLandingPageData(this.state.landing_pages, this.state.file_change);
            } else {
                await this.props.addLandingPageData(this.state.landing_pages, this.state.file_change);
            }
        }
    };

    render() {
        const {
            history,
            landing_pages: {
                id,
                header,
                client_name,
                header_style,
                client_name_style,
                feed,
                feed_id,
                widget,
                cbre_url,
                logo_url_link,
                image,
                logo,
                cbre_logo
            },
            showErrorBorder
        } = this.state;
        return (
            <>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl land-manage">
                        <div className="file-mlt-up-area">
                            <div className="items">
                                <div className="heading">
                                    <h3>Cbre Logo</h3>
                                </div>
                                <div className="cnt-area">
                                    <div className="fileupload">
                                        <label className="nme">Image Upload</label>
                                        <div className="file-area">
                                            <input
                                                type="file"
                                                className={`file-inp`}
                                                onChange={e => this.handleCbreLogoChange(e)}
                                                accept="image/*"
                                            />
                                            <button className="btn btn-line-land">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="17.648" height="17.648" viewBox="0 0 17.648 17.648">
                                                    <g id="vuesax_bold_export" data-name="vuesax/bold/export" transform="translate(-492 -444)">
                                                        <g id="export" transform="translate(492 444)">
                                                            <path
                                                                id="Vector"
                                                                d="M14.074,0H7.9V4.03a.552.552,0,0,1-1.1,0V0H.632A.628.628,0,0,0,0,.632,7.034,7.034,0,0,0,7.353,7.986,7.034,7.034,0,0,0,14.707.632.628.628,0,0,0,14.074,0Z"
                                                                transform="translate(1.471 7.28)"
                                                                fill="#1383d9"
                                                            />
                                                            <path
                                                                id="Vector-2"
                                                                data-name="Vector"
                                                                d="M3.2,1.881,4.346,3.028a.551.551,0,1,0,.779-.779L3.03.16a.555.555,0,0,0-.779,0L.162,2.256A.578.578,0,0,0,0,2.645a.545.545,0,0,0,.162.39.555.555,0,0,0,.779,0L2.088,1.888V4.9h1.1V1.881Z"
                                                                transform="translate(6.177 2.384)"
                                                                fill="#1383d9"
                                                            />
                                                            <path
                                                                id="Vector-3"
                                                                data-name="Vector"
                                                                d="M0,0H17.648V17.648H0Z"
                                                                transform="translate(17.648 17.648) rotate(180)"
                                                                fill="none"
                                                                opacity="0"
                                                            />
                                                        </g>
                                                    </g>
                                                </svg>
                                                Upload Your File
                                            </button>
                                        </div>
                                        <label className="nme name-10">Link</label>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className={`form-control ${showErrorBorder && !cbre_url ? "error-border" : ""}`}
                                                placeholder="Enter link"
                                                name="cbre_url"
                                                value={cbre_url}
                                                onChange={e => this.handleUrlChange(e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="preview-area">
                                        <label className="nme"> Image Preview</label>
                                        <div className="img-area">
                                            {this.state.cbreLogoPreview || this.state.landing_pages.cbre_logo?.url ? (
                                                <img src={this.state.cbreLogoPreview || this.state.landing_pages.cbre_logo?.url} alt="" />
                                            ) : (
                                                <div class="no-img-grid">
                                                    <img src="/img/no-image.svg" alt="" />
                                                    <h3>No image uploaded</h3>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="items">
                                <div className="heading">
                                    <h3>Client Logo</h3>
                                </div>
                                <div className="cnt-area">
                                    <div className="fileupload">
                                        <label className="nme">Image Upload</label>
                                        <div className="file-area">
                                            <input
                                                type="file"
                                                className="file-inp"
                                                onChange={e => this.handleClientLogoChange(e)}
                                                accept="image/*"
                                            />{" "}
                                            <button className="btn btn-line-land">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="17.648" height="17.648" viewBox="0 0 17.648 17.648">
                                                    <g id="vuesax_bold_export" data-name="vuesax/bold/export" transform="translate(-492 -444)">
                                                        <g id="export" transform="translate(492 444)">
                                                            <path
                                                                id="Vector"
                                                                d="M14.074,0H7.9V4.03a.552.552,0,0,1-1.1,0V0H.632A.628.628,0,0,0,0,.632,7.034,7.034,0,0,0,7.353,7.986,7.034,7.034,0,0,0,14.707.632.628.628,0,0,0,14.074,0Z"
                                                                transform="translate(1.471 7.28)"
                                                                fill="#1383d9"
                                                            />
                                                            <path
                                                                id="Vector-2"
                                                                data-name="Vector"
                                                                d="M3.2,1.881,4.346,3.028a.551.551,0,1,0,.779-.779L3.03.16a.555.555,0,0,0-.779,0L.162,2.256A.578.578,0,0,0,0,2.645a.545.545,0,0,0,.162.39.555.555,0,0,0,.779,0L2.088,1.888V4.9h1.1V1.881Z"
                                                                transform="translate(6.177 2.384)"
                                                                fill="#1383d9"
                                                            />
                                                            <path
                                                                id="Vector-3"
                                                                data-name="Vector"
                                                                d="M0,0H17.648V17.648H0Z"
                                                                transform="translate(17.648 17.648) rotate(180)"
                                                                fill="none"
                                                                opacity="0"
                                                            />
                                                        </g>
                                                    </g>
                                                </svg>
                                                Upload Your File
                                            </button>
                                        </div>
                                        <label className="nme name-10">Link</label>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className={`form-control ${showErrorBorder && !logo_url_link ? "error-border" : ""}`}
                                                name="logo_url_link"
                                                value={logo_url_link}
                                                placeholder="Enter link"
                                                onChange={e => this.handleUrlChange(e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="preview-area">
                                        <label className="nme"> Image Preview</label>
                                        <div className="img-area">
                                            {this.state.clientLogoPreview || this.state.landing_pages.logo?.url ? (
                                                <img src={this.state.clientLogoPreview || this.state.landing_pages.logo?.url} alt="" />
                                            ) : (
                                                <div class="no-img-grid">
                                                    <img src="/img/no-image.svg" alt="" />
                                                    <h3>No image uploaded</h3>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="items">
                                <div className="heading">
                                    <h3>Client Image</h3>
                                </div>
                                <div className="cnt-area">
                                    <div className="fileupload">
                                        <label className="nme">Image Upload</label>
                                        <div className="file-area">
                                            <input
                                                type="file"
                                                className="file-inp"
                                                onChange={e => this.handleClientImageChange(e)}
                                                accept="image/*"
                                            />
                                            <button className="btn btn-line-land">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="17.648" height="17.648" viewBox="0 0 17.648 17.648">
                                                    <g id="vuesax_bold_export" data-name="vuesax/bold/export" transform="translate(-492 -444)">
                                                        <g id="export" transform="translate(492 444)">
                                                            <path
                                                                id="Vector"
                                                                d="M14.074,0H7.9V4.03a.552.552,0,0,1-1.1,0V0H.632A.628.628,0,0,0,0,.632,7.034,7.034,0,0,0,7.353,7.986,7.034,7.034,0,0,0,14.707.632.628.628,0,0,0,14.074,0Z"
                                                                transform="translate(1.471 7.28)"
                                                                fill="#1383d9"
                                                            />
                                                            <path
                                                                id="Vector-2"
                                                                data-name="Vector"
                                                                d="M3.2,1.881,4.346,3.028a.551.551,0,1,0,.779-.779L3.03.16a.555.555,0,0,0-.779,0L.162,2.256A.578.578,0,0,0,0,2.645a.545.545,0,0,0,.162.39.555.555,0,0,0,.779,0L2.088,1.888V4.9h1.1V1.881Z"
                                                                transform="translate(6.177 2.384)"
                                                                fill="#1383d9"
                                                            />
                                                            <path
                                                                id="Vector-3"
                                                                data-name="Vector"
                                                                d="M0,0H17.648V17.648H0Z"
                                                                transform="translate(17.648 17.648) rotate(180)"
                                                                fill="none"
                                                                opacity="0"
                                                            />
                                                        </g>
                                                    </g>
                                                </svg>
                                                Upload Your File
                                            </button>
                                        </div>
                                    </div>
                                    <div className="preview-area">
                                        <label className="nme"> Image Preview</label>
                                        <div className="img-area">
                                            {this.state.clientImagePreview || this.state.landing_pages.image?.url ? (
                                                <img src={this.state.clientImagePreview || this.state.landing_pages.image?.url} alt="" />
                                            ) : (
                                                <div class="no-img-grid">
                                                    <img src="/img/no-image.svg" alt="" />
                                                    <h3>No image uploaded</h3>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-form">
                            <h3>Client Heading</h3>
                            <div className="form-otr">
                                <div className="form-inp">
                                    <div className="col-12 form-grp pr-0 pl-3">
                                        <label>Heading</label>
                                        <input
                                            type="text"
                                            className={`form-control ${showErrorBorder && !header ? "error-border" : ""}`}
                                            placeholder="Enter Text"
                                            value={header}
                                            name="header"
                                            onChange={e => this.handleHeaderChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="form-inp">
                                    <div className="col-12 form-grp pr-0 pl-3">
                                        <label>Font Name</label>
                                        <select
                                            value={header_style?.font_name}
                                            className={`form-control ${showErrorBorder && !header_style.font_name ? "error-border" : ""}`}
                                            name="font_name"
                                            onChange={e => this.handleFontNameChange(e, "header_style")}
                                        >
                                            <option value="">Choose Font Name</option>
                                            {FONT_FAMILY.map(f => (
                                                <option>{f}</option>
                                            ))}{" "}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-inp">
                                    <div className="col-12 form-grp pr-0 pl-3">
                                        <label>Font Size</label>
                                        <NumberFormat
                                            value={header_style?.font_size}
                                            onValueChange={values => this.handleFontSizeChange(values.floatValue, "header_style", "font_size")}
                                            allowNegative={false}
                                            suffix=" px"
                                            className={`form-control ${showErrorBorder && !header_style.font_size ? "error-border" : ""}`}
                                        />
                                    </div>
                                </div>
                                <div className="form-inp">
                                    <div className="col-12 form-grp pr-0 pl-3 position-relative">
                                        <label>Font Color</label>
                                        <input
                                            type="button"
                                            name="font_color"
                                            className={`form-control ${showErrorBorder && !header_style.font_color ? "error-border" : ""}`}
                                            value={header_style?.font_color || "Choose Color"}
                                            style={{ "text-align": `left` }}
                                            onClick={() => {
                                                this.setState({
                                                    openColorModal1: !this.state.openColorModal1
                                                });
                                            }}
                                        />
                                        {header_style?.font_color && (
                                            <div class="color-palete" style={{ backgroundColor: `#${header_style.font_color}` }}></div>
                                        )}
                                        {this.state.openColorModal1 ? (
                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                <CompactPicker
                                                    className="picker"
                                                    colors={FONT_COLOR}
                                                    color={header_style.font_color}
                                                    onChangeComplete={color => this.handleFontColorChange(color, "header_style", "font_color")}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="form-inp">
                                    <div className="col-12 form-grp pr-0 pl-3">
                                        <label className="container-check" for="01">
                                            <span>Is Bold</span>

                                            <input
                                                type="checkbox"
                                                id="01"
                                                name="is_bold"
                                                className={`${showErrorBorder && !header_style.bold ? "error-border" : ""}`}
                                                checked={header_style?.is_bold || false}
                                                onChange={e => this.handleIsBoldChange(e, "header_style")}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-form">
                            <h3>Client Name</h3>
                            <div className="form-otr">
                                <div className="form-inp">
                                    <div className="col-12 form-grp pr-0 pl-3">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${showErrorBorder && !client_name ? "error-border" : ""}`}
                                            placeholder="Enter Text"
                                            name="client_name"
                                            value={client_name}
                                            onChange={e => this.handleHeaderChange(e)}
                                        />
                                    </div>
                                </div>
                                <div className="form-inp">
                                    <div className="col-12 form-grp pr-0 pl-3">
                                        <label>Font Name</label>
                                        <select
                                            className={`form-control ${showErrorBorder && !client_name_style.font_name ? "error-border" : ""}`}
                                            name="font_name"
                                            value={client_name_style?.font_name}
                                            onChange={e => this.handleFontNameChange(e, "client_name_style")}
                                        >
                                            <option value="">Choose Font Name</option>
                                            {FONT_FAMILY.map(f => (
                                                <option>{f}</option>
                                            ))}{" "}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-inp">
                                    <div className="col-12 form-grp pr-0 pl-3">
                                        <label>Font Size</label>
                                        <NumberFormat
                                            value={client_name_style.font_size}
                                            onValueChange={values => this.handleFontSizeChange(values.floatValue, "client_name_style", "font_size")}
                                            allowNegative={false}
                                            suffix=" px"
                                            className={`form-control ${showErrorBorder && !client_name_style.font_size ? "error-border" : ""}`}
                                        />
                                    </div>
                                </div>
                                <div className="form-inp">
                                    <div className="col-12 form-grp pr-0 pl-3 position-relative">
                                        <label>Font Color</label>
                                        <input
                                            type="button"
                                            name="font_color"
                                            className={`form-control ${showErrorBorder && !client_name_style.font_color ? "error-border" : ""}`}
                                            value={client_name_style?.font_color || "Choose Color"}
                                            style={{ "text-align": `left` }}
                                            onClick={() => {
                                                this.setState({
                                                    openColorModal2: !this.state.openColorModal2
                                                });
                                            }}
                                        />
                                        {client_name_style?.font_color && (
                                            <div class="color-palete" style={{ backgroundColor: `#${client_name_style.font_color}` }}></div>
                                        )}
                                        {this.state.openColorModal2 ? (
                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                <CompactPicker
                                                    className="picker"
                                                    colors={FONT_COLOR}
                                                    color={client_name_style.font_color}
                                                    onChangeComplete={color => this.handleFontColorChange(color, "client_name_style", "font_color")}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="form-inp">
                                    <div className="col-12 form-grp pr-0 pl-3">
                                        <label className="container-check" for="02">
                                            <span>Is Bold</span>

                                            <input
                                                type="checkbox"
                                                id="02"
                                                name="is_bold"
                                                checked={client_name_style?.is_bold || false}
                                                onChange={e => this.handleIsBoldChange(e, "client_name_style")}
                                                className={` ${showErrorBorder && !client_name_style.is_bold ? "error-border" : ""}`}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="feed-otr col-md-12 d-flex p-0">
                            <div className="col-md-6 feed-sec pl-0 pr-2">
                                <div className="card-form col-md-12">
                                    <h3>Feed</h3>
                                    <div className="form-otr">
                                        <div className="form-inp col-6 p-0">
                                            <div className="col-12 form-grp pl-0 pr-3">
                                                <label>Select Feed</label>
                                                <select
                                                    className={`form-control ${showErrorBorder && !feed ? "error-border" : ""}`}
                                                    value={feed}
                                                    onChange={e => this.handleFeedChange(e)}
                                                >
                                                    <option value="">Choose Feed</option>
                                                    {FEEDS.map(f => (
                                                        <option>{f}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-inp col-6 p-0">
                                            <div className="col-12 form-grp p-0">
                                                <label>{`${feed||""} Username`}</label>
                                                <input
                                                    type="text"
                                                    disabled={!feed}
                                                    className={`form-control ${!feed ? "cursor-notallowed" : ""} ${
                                                        showErrorBorder && !feed_id ? "error-border" : ""
                                                    }`}
                                                    value={feed_id}
                                                    placeholder={`${feed||""} Username`}
                                                    name={feed}
                                                    onChange={e => this.handleFeedIdChange(e)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 widget-otr pr-0 pl-2">
                                <div className="card-form col-md-12">
                                    <h3>Widget</h3>
                                    <div className="form-otr">
                                        <div className="form-inp col-12 p-0">
                                            <div className="col-12 form-grp p-0">
                                                <label>Name</label>
                                                <select
                                                    className={`form-control ${showErrorBorder && !widget ? "error-border" : ""}`}
                                                    value={widget}
                                                    onChange={e => this.handleWidgetChange(e)}
                                                >
                                                    <option value="">Choose Widget</option>
                                                    {WIDGETS.map(f => (
                                                        <option>{f}</option>
                                                    ))}{" "}
                                                </select>
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
                                    {"Update Property"}
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
export default withRouter(Form);
