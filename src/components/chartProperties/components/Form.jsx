import React, { Component } from "react";
import { CompactPicker } from "react-color";
import { connect } from "react-redux";
import qs from "query-string";
import NumberFormat from "react-number-format";
import { withRouter } from "react-router-dom";
import _, { property } from "lodash";

import { ALIGNMENTS, FONT_COLOR, HEADINGS, LIST_STYLES, SPACING_RULE, FRAME_STYLES } from "../constants";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import actions from "../actions";
import reportPropertyActions from "../../reportProperties/actions";
import ReactTooltip from "react-tooltip";
import SortedRecommendation from "./SortedRecommendation";


let initial_state = {
    id: "",
    name: "",
    client_id: "",
    description: "",
    notes: "",
    properties: {
        chart: {
            width: 500,
            height: 300,
            alignment: "center",
            frame: false,
            frame_props: {
                size: "6",
                space: "1",
                color: "bfbfbf",
                val: "single"
            }
        },
        header: {
            project: {
                font_id: "",
                font_size: 8.5,
                color: "4b90fa",
                bold: false,
                font_id: ""
            },
            client: {
                font_id: "",
                font_size: 8.5,
                color: "4b90fa",
                bold: false
            }
        },
        heading: {
            bold: true,
            color: "101010",
            alignment: "center",
            font_size: 13,
            font_id: ""
        },
        x_axis: {
            color: "666666",
            font_size: 11
        },
        y_axis: {
            color: "666666",
            font_size: 11
        },
        data_labels: {
            color: "000000",
            font_size: 11
        },
        chart_font: {
            font_id: ""
        },
        legend: {
            show_legend: true,
            backgroundColor: "",
            borderColor: "",
            borderRadius: 0,
            borderWidth: 0,
            font_size: 12,
            bold: true,
            font_color: "333333"
        },
        custom_legend: {
            show_legend: true,
            legend_heading: {
                bold: false,
                color: "101010",
                alignment: "left",
                font_size: 10,
                font_id: ""
            },
            legend_value: {
                bold: false,
                color: "101010",
                alignment: "left",
                font_size: 10,
                font_id: ""
            }
        },
        total: {
            show_total: true,
            bold: false,
            color: "101010",
            alignment: "left",
            font_size: 12,
            font_id: ""
        },
        table: {
            table_style_id: "",
            col_width: 10,
            sub_total: {
                font_id: "",
                alignment: "left",
                font_size: 12,
                font_color: "ffffff",
                bg_color: "4117bf"
            },
            data: {
                font_id: "",
                alignment: "",
                font_size: 13,
                font_color: ""
            },
            heading: {
                font_id: "",
                font_size: 3,
                bg_color: "4117bf",
                alignment: "left",
                // font_size: 14,
                font_color: "fff700"
            },
            custom_head: {
                font_id: "",
                bg_color: "4117bf",
                alignment: "center",
                font_size: 15,
                font_color: "fff700"
            }
            // table_style: ""
        }
    },
    recommendation_props: {
        body: {
            font_size: 9,
            font_id: "",
            font_colour: "",
            background_colour: "",
            border_colour: ""
        },
        site: {
            font_size: 12,
            font_id: "",
            font_colour: "",
            background_colour: "",
            border_colour: ""
        },
        addition: {
            font_size: 10,
            font_id: "",
            font_colour: "",
            background_colour: "",
            border_colour: ""
        },
        building: {
            font_size: 11,
            font_id: "",
            font_colour: "",
            background_colour: "",
            border_colour: ""
        },
        grand_total: {
            font_size: 13,
            font_id: "",
            font_colour: "",
            background_colour: "",
            border_colour: ""
        },
        table_style: {
            style_id: ""
        },
        table_heading: {
            font_size: 13,
            font_id: "",
            font_colour: "",
            background_colour: "",
            border_colour: "",

            border: {
                left: false,
                right: false,
                bottom: false,
                top: false
            }
        },
        custom_heading: {
            font_size: 14,
            font_id: "",
            font_colour: "",
            background_colour: ""
        }
    },
    multi_recommendation_props: {
        heading: {
            font_id: "",
            font_size: 12,
            font_color: "",
            font_family: ""
        },
        caption: {
            font_id: "",
            font_size: 12,
            font_color: "",
            font_family: ""
        },
        body: {
            font_id: "",
            font_size: 12,
            font_color: "",
            font_family: ""
        },
        notes: {
            font_id: "",
            font_size: 12,
            font_color: "",
            font_family: ""
        }
    }
};
class Form extends Component {
    state = {
        showErrorBorder: false,
        property: initial_state,
        colorModalState: null,
        activeDetail: "chart",
        initialValues: {}
    };

    componentDidMount = async () => {
        this.props.getDropdownList("fonts");
        this.props.getDropdownList("table_styles");
        if (this.props.selectedProperty) {
            let propertyData = await this.props.getPropertyDataById();
            await this.setState({
                property: {
                    id: propertyData.id,
                    name: propertyData.name,
                    client_id: propertyData?.client?.id,
                    description: propertyData.description,
                    notes: propertyData.notes,
                    // properties: propertyData.properties,
                    properties: {
                        ...propertyData.properties,
                        chart: {
                            ...propertyData.properties.chart,
                            frame_props: {
                                ...this.state.property.properties.chart.frame_props,
                                ...propertyData.properties.chart.frame_props
                            }
                        },
                        custom_legend: {
                            show_legend: true,
                            ...propertyData.properties.custom_legend
                        },
                        total: {
                            show_total: true,
                            ...propertyData.properties.total
                        },
                        legend: {
                            ...this.state.property.properties.legend,
                            ...propertyData.properties.legend
                        },
                        table: {
                            ...propertyData.properties.table,
                            data: {
                                ...this.state.property.properties.table.data,
                                ...propertyData?.properties?.table?.data
                            },
                            sub_total: {
                                ...this.state.property.properties.table.sub_total,
                                ...propertyData?.properties?.table?.sub_total
                            },
                            heading: {
                                ...this.state.property.properties.table.heading,
                                ...propertyData?.properties?.table?.heading
                            },
                            custom_head: {
                                ...this.state.property.properties.table.custom_head,
                                ...propertyData?.properties?.table?.custom_head
                            }
                        }
                    },
                    recommendation_props: {
                        ...propertyData.recommendation_props,
                        body: {
                            ...this.recommendation_props?.body,
                            ...propertyData?.recommendation_props?.body
                        },
                        site: {
                            ...this.recommendation_props?.site,
                            ...propertyData?.recommendation_props?.site
                        },
                        addition: {
                            ...this.recommendation_props?.addition,
                            ...propertyData?.recommendation_props?.addition
                        },
                        building: {
                            ...this.recommendation_props?.building,
                            ...propertyData?.recommendation_props?.building
                        },
                        grand_total: {
                            ...this.recommendation_props?.grand_total,
                            ...propertyData?.recommendation_props?.grand_total
                        },
                        table_style: {
                            ...this.recommendation_props?.table_style,
                            ...propertyData?.recommendation_props?.table_style
                        },
                        table_heading: {
                            ...this.recommendation_props?.table_heading,
                            ...propertyData?.recommendation_props?.table_heading
                        },
                        custom_heading: {
                            ...this.recommendation_props?.custom_heading,
                            ...propertyData?.recommendation_props?.custom_heading
                        }
                    },
                    multi_recommendation_props: {
                        ...propertyData.multi_recommendation_props,
                        body: {
                            ...this.multi_recommendation_props?.body,
                            ...propertyData?.multi_recommendation_props?.body
                        },
                        heading: {
                            ...this.multi_recommendation_props?.heading,
                            ...propertyData?.multi_recommendation_props?.heading
                        },
                        caption: {
                            ...this.multi_recommendation_props?.caption,
                            ...propertyData?.multi_recommendation_props?.caption
                        },
                        notes: {
                            ...this.multi_recommendation_props?.notes,
                            ...propertyData?.multi_recommendation_props?.notes
                        }
                    }
                }
            });
        } else {
            const {
                location: { search }
            } = this.props;
            const query = qs.parse(search);
            await this.setState({ property: { ...this.state.property, client_id: query?.client_id || "" } });
        }
        this.setState({ initialValues: _.cloneDeep(this.state.property) });
    };

    validate = () => {
        const {
            properties: { header, heading, chart, custom_legend, total },
            name,
            description
        } = this.state.property;
        if (
            !name?.trim()?.length ||
            !description?.trim()?.length ||
            !header?.project?.font_id ||
            !header?.project?.font_size ||
            !header?.project?.color ||
            // !header?.project?.bold ||
            !header?.client?.font_id ||
            !header?.client?.font_size ||
            !header?.client?.color ||
            // !header?.client?.bold ||
            !heading?.font_id ||
            !heading?.font_size ||
            !heading?.color ||
            !heading?.alignment ||
            // !heading?.bold ||
            (custom_legend.show_legend && !custom_legend?.legend_heading?.font_id) ||
            (custom_legend.show_legend && !custom_legend?.legend_heading?.font_size) ||
            !custom_legend?.legend_heading?.color ||
            !custom_legend?.legend_heading?.alignment ||
            // !custom_legend?.legend_heading?.bold ||
            (custom_legend.show_legend && !custom_legend?.legend_value?.font_id) ||
            (custom_legend.show_legend && !custom_legend?.legend_value?.font_size) ||
            !custom_legend?.legend_value?.color ||
            !custom_legend?.legend_value?.alignment ||
            // !custom_legend?.legend_value?.bold ||
            (total.show_total && !total?.font_id) ||
            (total.show_total && !total?.font_size) ||
            !total?.color
            // ||!total?.alignment
            // !total?.bold
        ) {
            this.setState({ showErrorBorder: true });
            return false;
        }
        return true;
    };

    handleSubmit = () => {
        if (this.validate()) {
            if (this.props.selectedProperty) {
                console.log("property", this.state.property);
                this.props.handleUpdateProperty(this.state.property);
            } else {
                this.props.handleAddProperty(this.state.property);
            }
        }
    };

    cancelForm = () => {
        if (_.isEqual(this.state.initialValues, this.state.property)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        this.setState({
            property: initial_state,
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

    handleChangeBasicDetails = e => {
        const { name, value } = e.target;
        const { property } = this.state;
        this.setState({
            property: { ...property, [name]: value }
        });
    };
    handleChangeHeader = (prop, key, value) => {
        const { property } = this.state;
        const { properties } = property;
        const { header } = properties;
        this.setState({
            property: { ...property, properties: { ...properties, header: { ...header, [prop]: { ...header[prop], [key]: value } } } }
        });
    };

    handleChangeCustomLegend = (prop, key, value) => {
        const { property } = this.state;
        const { properties } = property;
        const { custom_legend } = properties;
        this.setState({
            property: {
                ...property,
                properties: { ...properties, custom_legend: { ...custom_legend, [prop]: { ...custom_legend[prop], [key]: value } } }
            }
        });
    };
    handleChangeChart = (masterKey, key, value) => {
        const { property } = this.state;
        const { properties } = property;
        this.setState({
            property: { ...property, properties: { ...properties, [masterKey]: { ...properties[masterKey], [key]: value } } }
        });
    };

    setActiveTab = activeTab => {
        
        // this.setState({ activeDetail: activeTab });
        let tabKeyList = [ "sortedRecommendations", "multiRecommendation"];
        if(activeTab !== "chart"){
            this.props.history.push(`/chartProperties/edit/${this.props.match.params.id}/${tabKeyList.includes(activeTab) ? activeTab : null}`);
        }else{
        this.props.history.push(`/chartProperties/edit/${this.props.match.params.id}`);
        }
    };

    render() {
        const { property, showErrorBorder, colorModalState } = this.state;
        const { name, description, notes, properties, recommendation_props, multi_recommendation_props } = property;
        const { header, heading, chart, legend, custom_legend, total, x_axis, y_axis, data_labels, chart_font, table } = properties;
        const {
            dropDownList: { fonts: FONT_FAMILY, table_styles: TABLE_STYLE }
        } = this.props.reportPropertyReducer;
        const { custom_heading, addition, site, body, building, grand_total, table_heading, table_style } = recommendation_props;
        return (
            <>
                <div className="dtl-sec col-md-12 system-building">
                    <div className="custom-col">
                        <div className="tab-dtl region-mng">
                            <ul>
                                {/* <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div> */}
                                <li
                                    className={!this.props.match.params.tab  ? " cursor-pointer active pl-4" : "cursor-pointer"}
                                    onClick={() => this.setActiveTab("chart")}
                                >
                                    Chart
                                </li>
                                <li
                                    className={this.props.match.params.tab === "sortedRecommendations" ? " cursor-pointer active pl-4" : "cursor-pointer"}
                                    onClick={() => this.setActiveTab("sortedRecommendations")}
                                >
                                    Sorted Recommendations
                                </li>
                                <li
                                    className={this.props.match.params.tab === "multiRecommendation" ? " cursor-pointer active pl-4" : "cursor-pointer"}
                                    onClick={() => this.setActiveTab("multiRecommendation")}
                                >
                                    Multi Recommendation
                                </li>
                                {/* <li
                                    className={activeDetail === "ChartDataTable" ? " cursor-pointer active pl-4" : "cursor-pointer"}
                                    onClick={() => this.setActiveTab("ChartDataTable")}
                                >
                                    Image Gallery
                                </li> */}
                            </ul>

                            <div class="otr-common-edit custom-col new-area">
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
                                                            onChange={e => this.handleChangeBasicDetails(e)}
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
                                                            onChange={e => this.handleChangeBasicDetails(e)}
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
                                                            onChange={e => this.handleChangeBasicDetails(e)}
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
                        </div>

                        <div className="outer-font-section">
                            <div className="style-outer">
                                {/* sorted */}
                                {this.props.match.params.tab === "sortedRecommendations" ? (
                                    // <SortedRecommendation handleSetRecommendationProps={this.handleSetRecommendationProps}/>
                                    <div className="styles-box">
                                        <h2>Table Properties</h2>

                                        <div className="styles-sec">
                                            <div className="d-flex f-outer">
                                                <div className="font-family font-st col-md-3">
                                                    <label>Table Style </label>
                                                    <div className="font-select">
                                                        <select
                                                            // className={`dropdown ${
                                                            //     showErrorBorder && custom_legend?.show_legend && !total?.font_id
                                                            //         ? "error-border"
                                                            //         : ""
                                                            // }`}
                                                            className="dropdown"
                                                            value={table_style?.style_id || "-"}
                                                            // // name="table_style"
                                                            onChange={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            table_style: {
                                                                                ...this.state.property.recommendation_props.table_style,
                                                                                style_id: e.target.value
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {/* <option value="CBRE Table - Emerald Option 2">CBRE Table - Emerald Option 2</option> */}
                                                            {TABLE_STYLE.map(f => (
                                                                <option value={f.id} key={f.id}>
                                                                    {f.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="styles-sec">
                                            <div className="d-flex f-outer">
                                                <div className="font-family font-st col-md-3">
                                                    <label>Custom Heading Font Name</label>
                                                    <div className="font-select">
                                                        <select
                                                            // className={`dropdown ${
                                                            //     showErrorBorder && custom_legend?.show_legend && !total?.font_id
                                                            //         ? "error-border"
                                                            //         : ""
                                                            // }`}
                                                            className="dropdown"
                                                            value={custom_heading?.font_id || "-"}
                                                            // // name="table_style"
                                                            onChange={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            custom_heading: {
                                                                                ...this.state.property.recommendation_props.custom_heading,
                                                                                font_id: e.target.value
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            {/* <option value="">Select</option> */}
                                                            {/* <option value="CBRE Table - Emerald Option 2">CBRE Table - Emerald Option 2</option> */}
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
                                                    <label>Custom Heading Font Size</label>
                                                    <div className={`input-ft-size`}>
                                                        <NumberFormat
                                                            value={custom_heading?.font_size}
                                                            onValueChange={values =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            custom_heading: {
                                                                                ...this.state.property.recommendation_props.custom_heading,

                                                                                font_size: values.floatValue
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            allowNegative={false}
                                                            suffix=" Pt"
                                                            // className={`${
                                                            //     showErrorBorder && custom_legend?.show_legend && !total?.font_size
                                                            //         ? "error-border"
                                                            //         : ""
                                                            // }`}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Custom Heading Font Color </label>
                                                    </div>
                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            custom_heading: {
                                                                                ...this.state.property.recommendation_props.custom_heading,

                                                                                font_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times "></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_custom_heading_font_color"
                                                                            ? null
                                                                            : "table_sort_custom_heading_font_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{custom_heading?.font_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: custom_heading?.font_colour
                                                                        ? `#${custom_heading?.font_colour}`
                                                                        : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_custom_heading_font_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={
                                                                        custom_heading?.font_colour === "#000000" ? "" : custom_heading?.font_colour
                                                                    }
                                                                    onChangeComplete={color => {
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    custom_heading: {
                                                                                        ...this.state.property.recommendation_props.custom_heading,

                                                                                        font_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        });
                                                                        console.log("cod", color);
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Custom Heading Background Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            custom_heading: {
                                                                                ...this.state.property.recommendation_props.custom_heading,

                                                                                background_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_custom_heading_BG_color"
                                                                            ? null
                                                                            : "table_sort_custom_heading_BG_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{custom_heading?.background_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: custom_heading?.background_colour
                                                                        ? `#${custom_heading?.background_colour}`
                                                                        : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_custom_heading_BG_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={custom_heading?.background_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    custom_heading: {
                                                                                        ...this.state.property.recommendation_props.custom_heading,

                                                                                        background_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="styles-sec">
                                            <div className="d-flex f-outer">
                                                <div className="font-family font-st col-md-3">
                                                    <label>Heading Font Name </label>
                                                    <div className="font-select">
                                                        <select
                                                            // className={`dropdown ${
                                                            //     showErrorBorder && custom_legend?.show_legend && !total?.font_id
                                                            //         ? "error-border"
                                                            //         : ""
                                                            // }`}
                                                            className="dropdown"
                                                            value={table_heading?.font_id || "-"}
                                                            // // name="table_style"
                                                            onChange={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            table_heading: {
                                                                                ...this.state.property.recommendation_props.table_heading,
                                                                                font_id: e.target.value
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {/* <option value="CBRE Table - Emerald Option 2">CBRE Table - Emerald Option 2</option> */}
                                                            {/* <option value="">Select</option> */}
                                                            {FONT_FAMILY.map(f => (
                                                                <option key={f.id} value={f.id}>
                                                                    {f.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="font-size font-st col-md-3">
                                                    <label>Heading Font Size</label>
                                                    <div className={`input-ft-size`}>
                                                        <NumberFormat
                                                            value={table_heading?.font_size}
                                                            onValueChange={values =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            table_heading: {
                                                                                ...this.state.property.recommendation_props.table_heading,

                                                                                font_size: values.floatValue
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            allowNegative={false}
                                                            suffix=" Pt"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Heading Font Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            table_heading: {
                                                                                ...this.state.property.recommendation_props.table_heading,

                                                                                font_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_table_heading_font_color"
                                                                            ? null
                                                                            : "table_sort_table_heading_font_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{table_heading?.font_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: table_heading?.font_colour ? `#${table_heading?.font_colour}` : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_table_heading_font_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={table_heading?.font_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    table_heading: {
                                                                                        ...this.state.property.recommendation_props.table_heading,

                                                                                        font_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Heading Background Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            table_heading: {
                                                                                ...this.state.property.recommendation_props.table_heading,

                                                                                background_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_table_heading_BG_color"
                                                                            ? null
                                                                            : "table_sort_table_heading_BG_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{table_heading?.background_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: table_heading?.background_colour
                                                                        ? `#${table_heading?.background_colour}`
                                                                        : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_table_heading_BG_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={table_heading?.background_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    table_heading: {
                                                                                        ...this.state.property.recommendation_props.table_heading,

                                                                                        background_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Heading Border Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            table_heading: {
                                                                                ...this.state.property.recommendation_props.table_heading,

                                                                                border_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_table_heading_border_colour"
                                                                            ? null
                                                                            : "table_sort_table_heading_border_colour"
                                                                });
                                                            }}
                                                        >
                                                            <span>{table_heading?.border_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: table_heading?.border_colour
                                                                        ? `#${table_heading?.border_colour}`
                                                                        : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_table_heading_border_colour" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={table_heading?.border_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    table_heading: {
                                                                                        ...this.state.property.recommendation_props.table_heading,

                                                                                        border_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-size font-st col-md-3">
                                                    <label>Heading Border</label>
                                                    <div className={`input-ft-size`}>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={table_heading?.border?.left}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                table_heading: {
                                                                                    ...this.state.property.recommendation_props.table_heading,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.table_heading
                                                                                            .border,
                                                                                        left: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Left</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={table_heading?.border?.right}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                table_heading: {
                                                                                    ...this.state.property.recommendation_props.table_heading,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.table_heading
                                                                                            .border,
                                                                                        right: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Right</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={table_heading?.border?.top}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                table_heading: {
                                                                                    ...this.state.property.recommendation_props.table_heading,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.table_heading
                                                                                            .border,
                                                                                        top: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Top</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={table_heading?.border?.bottom}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                table_heading: {
                                                                                    ...this.state.property.recommendation_props.table_heading,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.table_heading
                                                                                            .border,
                                                                                        bottom: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Bottom</label>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="styles-sec">
                                            <div className="d-flex f-outer">
                                                <div className="font-family font-st col-md-3">
                                                    <label>Body Font Name </label>
                                                    <div className="font-select">
                                                        <select
                                                            // className={`dropdown ${
                                                            //     showErrorBorder && custom_legend?.show_legend && !total?.font_id
                                                            //         ? "error-border"
                                                            //         : ""
                                                            // }`}tex
                                                            className="dropdown"
                                                            value={body?.font_id || "-"}
                                                            // // name="table_style"
                                                            onChange={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            body: {
                                                                                ...this.state.property.recommendation_props.body,

                                                                                font_id: e.target.value
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {/* <option value="CBRE Table - Emerald Option 2">CBRE Table - Emerald Option 2</option> */}
                                                            {FONT_FAMILY.map(f => (
                                                                <option key={f.id} value={f.id}>
                                                                    {f.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="font-size font-st col-md-3">
                                                    <label>Body Font Size</label>
                                                    <div className={`input-ft-size`}>
                                                        <NumberFormat
                                                            value={body?.font_size}
                                                            onValueChange={values =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            body: {
                                                                                ...this.state.property.recommendation_props.body,

                                                                                font_size: values.floatValue
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            allowNegative={false}
                                                            suffix=" Pt"
                                                            // className={`${
                                                            //     showErrorBorder && custom_legend?.show_legend && !total?.font_size
                                                            //         ? "error-border"
                                                            //         : ""
                                                            // }`}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Body Font Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            body: {
                                                                                ...this.state.property.recommendation_props.body,

                                                                                font_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_body_font_color"
                                                                            ? null
                                                                            : "table_sort_body_font_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{body?.font_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: body?.font_colour ? `#${body?.font_colour}` : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_body_font_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={body?.font_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    body: {
                                                                                        ...this.state.property.recommendation_props.body,

                                                                                        font_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Body Border Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            body: {
                                                                                ...this.state.property.recommendation_props.body,

                                                                                border_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_body_border_colour"
                                                                            ? null
                                                                            : "table_sort_body_border_colour"
                                                                });
                                                            }}
                                                        >
                                                            <span>{body?.border_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: body?.border_colour ? `#${body?.border_colour}` : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_body_border_colour" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={body?.border_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    body: {
                                                                                        ...this.state.property.recommendation_props.body,

                                                                                        border_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-size font-st col-md-3">
                                                    <label>Body Border</label>
                                                    <div className={`input-ft-size`}>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={body?.border?.left}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                body: {
                                                                                    ...this.state.property.recommendation_props.body,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.body.border,
                                                                                        left: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Left</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={body?.border?.right}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                body: {
                                                                                    ...this.state.property.recommendation_props.body,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.body.border,
                                                                                        right: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Right</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={body?.border?.top}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                body: {
                                                                                    ...this.state.property.recommendation_props.body,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.body.border,
                                                                                        top: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Top</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={body?.border?.bottom}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                body: {
                                                                                    ...this.state.property.recommendation_props.body,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.body.border,
                                                                                        bottom: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Bottom</label>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="styles-sec">
                                            <div className="d-flex f-outer">
                                                <div className="font-family font-st col-md-3">
                                                    <label>Site Font Name </label>
                                                    <div className="font-select">
                                                        <select
                                                            // className={`dropdown ${
                                                            //     showErrorBorder && custom_legend?.show_legend && !total?.font_id
                                                            //         ? "error-border"
                                                            //         : ""
                                                            // }`}
                                                            className="dropdown"
                                                            value={site?.font_id || "-"}
                                                            // // name="table_style"
                                                            onChange={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            site: {
                                                                                ...this.state.property.recommendation_props.site,

                                                                                font_id: e.target.value
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {/* <option value="CBRE Table - Emerald Option 2">CBRE Table - Emerald Option 2</option> */}
                                                            {/* <option value="">Select</option> */}
                                                            {FONT_FAMILY.map(f => (
                                                                <option key={f.id} value={f.id}>
                                                                    {f.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="font-size font-st col-md-3">
                                                    <label>Site Font Size</label>
                                                    <div className={`input-ft-size`}>
                                                        <NumberFormat
                                                            value={site?.font_size}
                                                            onValueChange={values =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            site: {
                                                                                ...this.state.property.recommendation_props.site,

                                                                                font_size: values.floatValue
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            allowNegative={false}
                                                            suffix=" Pt"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Site Font Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            site: {
                                                                                ...this.state.property.recommendation_props.site,

                                                                                font_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_site_font_color"
                                                                            ? null
                                                                            : "table_sort_site_font_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{site?.font_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: site?.font_colour ? `#${site?.font_colour}` : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_site_font_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={site?.font_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    site: {
                                                                                        ...this.state.property.recommendation_props.site,

                                                                                        font_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Site Background Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            site: {
                                                                                ...this.state.property.recommendation_props.site,

                                                                                background_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_site_BG_color"
                                                                            ? null
                                                                            : "table_sort_site_BG_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{site?.background_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: site?.background_colour ? `#${site?.background_colour}` : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_site_BG_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={site?.background_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    site: {
                                                                                        ...this.state.property.recommendation_props.site,

                                                                                        background_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Site Border Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            site: {
                                                                                ...this.state.property.recommendation_props.site,

                                                                                border_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_site_border_colour"
                                                                            ? null
                                                                            : "table_sort_site_border_colour"
                                                                });
                                                            }}
                                                        >
                                                            <span>{site?.border_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: site?.border_colour ? `#${site?.border_colour}` : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_site_border_colour" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={site?.border_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    site: {
                                                                                        ...this.state.property.recommendation_props.site,

                                                                                        border_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-size font-st col-md-3">
                                                    <label>Site Border</label>
                                                    <div className={`input-ft-size`}>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={site?.border?.left}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                site: {
                                                                                    ...this.state.property.recommendation_props.site,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.site.border,
                                                                                        left: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Left</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={site?.border?.right}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                site: {
                                                                                    ...this.state.property.recommendation_props.site,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.site.border,
                                                                                        right: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Right</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={site?.border?.top}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                site: {
                                                                                    ...this.state.property.recommendation_props.site,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.site.border,
                                                                                        top: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Top</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={site?.border?.bottom}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                site: {
                                                                                    ...this.state.property.recommendation_props.site,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.site.border,
                                                                                        bottom: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Bottom</label>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="styles-sec">
                                            <div className="d-flex f-outer">
                                                <div className="font-family font-st col-md-3">
                                                    <label>Building Font Name </label>
                                                    <div className="font-select">
                                                        <select
                                                            // className={`dropdown ${
                                                            //     showErrorBorder && custom_legend?.show_legend && !total?.font_id
                                                            //         ? "error-border"
                                                            //         : ""
                                                            // }`}
                                                            className="dropdown"
                                                            value={building?.font_id || "-"}
                                                            // // name="table_style"
                                                            onChange={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            building: {
                                                                                ...this.state.property.recommendation_props.building,

                                                                                font_id: e.target.value
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {/* <option value="CBRE Table - Emerald Option 2">CBRE Table - Emerald Option 2</option> */}
                                                            {/* <option value="">Select</option> */}
                                                            {FONT_FAMILY.map(f => (
                                                                <option key={f.id} value={f.id}>
                                                                    {f.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="font-size font-st col-md-3">
                                                    <label>Building Font Size</label>
                                                    <div className={`input-ft-size`}>
                                                        <NumberFormat
                                                            value={building?.font_size}
                                                            onValueChange={values =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            building: {
                                                                                ...this.state.property.recommendation_props.building,

                                                                                font_size: values.floatValue
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            allowNegative={false}
                                                            suffix=" Pt"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Building Font Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            building: {
                                                                                ...this.state.property.recommendation_props.building,

                                                                                font_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_building_font_color"
                                                                            ? null
                                                                            : "table_sort_building_font_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{building?.font_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: building?.font_colour ? `#${building?.font_colour}` : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_building_font_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={building?.font_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    building: {
                                                                                        ...this.state.property.recommendation_props.building,

                                                                                        font_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Building Background Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            building: {
                                                                                ...this.state.property.recommendation_props.building,

                                                                                background_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_building_BG_color"
                                                                            ? null
                                                                            : "table_sort_building_BG_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{building?.background_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: building?.background_colour
                                                                        ? `#${building?.background_colour}`
                                                                        : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_building_BG_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={building?.background_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    building: {
                                                                                        ...this.state.property.recommendation_props.building,

                                                                                        background_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Building Border Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            building: {
                                                                                ...this.state.property.recommendation_props.building,

                                                                                border_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_building_border_colour"
                                                                            ? null
                                                                            : "table_sort_building_border_colour"
                                                                });
                                                            }}
                                                        >
                                                            <span>{building?.border_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: building?.border_colour ? `#${building?.border_colour}` : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_building_border_colour" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={building?.border_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    building: {
                                                                                        ...this.state.property.recommendation_props.building,

                                                                                        border_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-size font-st col-md-3">
                                                    <label>Building Border</label>
                                                    <div className={`input-ft-size`}>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={building?.border?.left}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                building: {
                                                                                    ...this.state.property.recommendation_props.building,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.building.border,
                                                                                        left: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Left</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={building?.border?.right}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                building: {
                                                                                    ...this.state.property.recommendation_props.building,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.building.border,
                                                                                        right: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Right</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={building?.border?.top}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                building: {
                                                                                    ...this.state.property.recommendation_props.building,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.building.border,
                                                                                        top: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Top</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={building?.border?.bottom}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                building: {
                                                                                    ...this.state.property.recommendation_props.building,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.building.border,
                                                                                        bottom: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Bottom</label>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="styles-sec">
                                            <div className="d-flex f-outer">
                                                <div className="font-family font-st col-md-3">
                                                    <label>Addition Font Name </label>
                                                    <div className="font-select">
                                                        <select
                                                            // className={`dropdown ${
                                                            //     showErrorBorder && custom_legend?.show_legend && !total?.font_id
                                                            //         ? "error-border"
                                                            //         : ""
                                                            // }`}
                                                            className="dropdown"
                                                            value={addition?.font_id || "-"}
                                                            // // name="table_style"
                                                            onChange={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            addition: {
                                                                                ...this.state.property.recommendation_props.addition,

                                                                                font_id: e.target.value
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {/* <option value="CBRE Table - Emerald Option 2">CBRE Table - Emerald Option 2</option> */}
                                                            {/* <option value="">Select</option> */}
                                                            {FONT_FAMILY.map(f => (
                                                                <option key={f.id} value={f.id}>
                                                                    {f.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="font-size font-st col-md-3">
                                                    <label>Addition Font Size</label>
                                                    <div className={`input-ft-size`}>
                                                        <NumberFormat
                                                            value={addition?.font_size}
                                                            onValueChange={values =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            addition: {
                                                                                ...this.state.property.recommendation_props.addition,

                                                                                font_size: values.floatValue
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            allowNegative={false}
                                                            suffix=" Pt"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Addition Font Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            addition: {
                                                                                ...this.state.property.recommendation_props.addition,

                                                                                font_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_addition_font_color"
                                                                            ? null
                                                                            : "table_sort_addition_font_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{addition?.font_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: addition?.font_colour ? `#${addition?.font_colour}` : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_addition_font_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={addition?.font_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    addition: {
                                                                                        ...this.state.property.recommendation_props.addition,

                                                                                        font_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Addition Background Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            addition: {
                                                                                ...this.state.property.recommendation_props.addition,

                                                                                background_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_addition_BG_color"
                                                                            ? null
                                                                            : "table_sort_addition_BG_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{addition?.background_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: addition?.background_colour
                                                                        ? `#${addition?.background_colour}`
                                                                        : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_addition_BG_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={addition?.background_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    addition: {
                                                                                        ...this.state.property.recommendation_props.addition,

                                                                                        background_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Addition Border Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            addition: {
                                                                                ...this.state.property.recommendation_props.addition,

                                                                                border_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_addition_border_colour"
                                                                            ? null
                                                                            : "table_sort_addition_border_colour"
                                                                });
                                                            }}
                                                        >
                                                            <span>{addition?.border_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: addition?.border_colour ? `#${addition?.border_colour}` : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_addition_border_colour" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={addition?.border_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    addition: {
                                                                                        ...this.state.property.recommendation_props.addition,

                                                                                        border_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-size font-st col-md-3">
                                                    <label>Addition Border</label>
                                                    <div className={`input-ft-size`}>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={addition?.border?.left}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                addition: {
                                                                                    ...this.state.property.recommendation_props.addition,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.addition.border,
                                                                                        left: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Left</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={addition?.border?.right}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                addition: {
                                                                                    ...this.state.property.recommendation_props.addition,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.addition.border,
                                                                                        right: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Right</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={addition?.border?.top}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                addition: {
                                                                                    ...this.state.property.recommendation_props.addition,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.addition.border,
                                                                                        top: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Top</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={addition?.border?.bottom}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                addition: {
                                                                                    ...this.state.property.recommendation_props.addition,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.addition.border,
                                                                                        bottom: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Bottom</label>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="styles-sec">
                                            <div className="d-flex f-outer">
                                                <div className="font-family font-st col-md-3">
                                                    <label>Grand Total Font Name </label>
                                                    <div className="font-select">
                                                        <select
                                                            // className={`dropdown ${
                                                            //     showErrorBorder && custom_legend?.show_legend && !total?.font_id
                                                            //         ? "error-border"
                                                            //         : ""
                                                            // }`}
                                                            className="dropdown"
                                                            value={grand_total?.font_id || "-"}
                                                            // // name="table_style"
                                                            onChange={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            grand_total: {
                                                                                ...this.state.property.recommendation_props.grand_total,

                                                                                font_id: e.target.value
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {/* <option value="CBRE Table - Emerald Option 2">CBRE Table - Emerald Option 2</option> */}
                                                            {/* <option value="">Select</option> */}
                                                            {FONT_FAMILY.map(f => (
                                                                <option key={f.id} value={f.id}>
                                                                    {f.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="font-size font-st col-md-3">
                                                    <label>Grand Total Font Size</label>

                                                    <div className={`input-ft-size`}>
                                                        <NumberFormat
                                                            value={grand_total?.font_size}
                                                            onValueChange={values =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            grand_total: {
                                                                                ...this.state.property.recommendation_props.grand_total,

                                                                                font_size: values.floatValue
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            allowNegative={false}
                                                            suffix=" Pt"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Grand Total Font Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            grand_total: {
                                                                                ...this.state.property.recommendation_props.grand_total,

                                                                                font_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_grand_total_font_color"
                                                                            ? null
                                                                            : "table_sort_grand_total_font_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{grand_total?.font_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: grand_total?.font_colour ? `#${grand_total?.font_colour}` : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_grand_total_font_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={grand_total?.font_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    grand_total: {
                                                                                        ...this.state.property.recommendation_props.grand_total,

                                                                                        font_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Grand Total Background Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            grand_total: {
                                                                                ...this.state.property.recommendation_props.grand_total,

                                                                                background_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_grand_total_BG_color"
                                                                            ? null
                                                                            : "table_sort_grand_total_BG_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{grand_total?.background_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: grand_total?.background_colour
                                                                        ? `#${grand_total?.background_colour}`
                                                                        : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_grand_total_BG_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={grand_total?.background_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    grand_total: {
                                                                                        ...this.state.property.recommendation_props.grand_total,

                                                                                        background_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Grand Total Border Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        recommendation_props: {
                                                                            ...this.state.property.recommendation_props,
                                                                            grand_total: {
                                                                                ...this.state.property.recommendation_props.grand_total,

                                                                                border_colour: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "table_sort_grand_total_border_colour"
                                                                            ? null
                                                                            : "table_sort_grand_total_border_colour"
                                                                });
                                                            }}
                                                        >
                                                            <span>{grand_total?.border_colour || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: grand_total?.border_colour ? `#${grand_total?.border_colour}` : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "table_sort_grand_total_border_colour" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={grand_total?.border_colour}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                recommendation_props: {
                                                                                    ...this.state.property.recommendation_props,
                                                                                    grand_total: {
                                                                                        ...this.state.property.recommendation_props.grand_total,

                                                                                        border_colour: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="font-size font-st col-md-3">
                                                    <label>Grand Total Border</label>
                                                    <div className={`input-ft-size`}>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={grand_total?.border?.left}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                grand_total: {
                                                                                    ...this.state.property.recommendation_props.grand_total,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.grand_total
                                                                                            .border,
                                                                                        left: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Left</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={grand_total?.border?.right}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                grand_total: {
                                                                                    ...this.state.property.recommendation_props.grand_total,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.grand_total
                                                                                            .border,
                                                                                        right: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Right</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={grand_total?.border?.top}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                grand_total: {
                                                                                    ...this.state.property.recommendation_props.grand_total,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.grand_total
                                                                                            .border,
                                                                                        top: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Top</label>
                                                        </span>
                                                        <span className="check-align">
                                                            <input
                                                                type="checkbox"
                                                                checked={grand_total?.border?.bottom}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            recommendation_props: {
                                                                                ...this.state.property.recommendation_props,
                                                                                grand_total: {
                                                                                    ...this.state.property.recommendation_props.grand_total,
                                                                                    border: {
                                                                                        ...this.state.property.recommendation_props.grand_total
                                                                                            .border,
                                                                                        bottom: e.target.checked
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            ></input>
                                                            <label>Bottom</label>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : this.props.match.params.tab === "multiRecommendation" ? (
                                    <div className="styles-box">
                                        <h2>Multi Recommendation Properties</h2>

                                        <div className="styles-sec">
                                            <div className="d-flex f-outer">
                                                <div className="font-family font-st col-md-3">
                                                    <label>Heading Font Name </label>
                                                    <div className="font-select">
                                                        <select
                                                            // className={`dropdown ${
                                                            //     showErrorBorder && custom_legend?.show_legend && !total?.font_id
                                                            //         ? "error-border"
                                                            //         : ""
                                                            // }`}
                                                            className="dropdown"
                                                            value={multi_recommendation_props?.heading?.font_id || "-"}
                                                            // // name="table_style"
                                                            onChange={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        multi_recommendation_props: {
                                                                            ...this.state.property.multi_recommendation_props,
                                                                            heading: {
                                                                                ...this.state.property.multi_recommendation_props.heading,
                                                                                font_id: e.target.value
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {/* <option value="CBRE Table - Emerald Option 2">CBRE Table - Emerald Option 2</option> */}
                                                            {FONT_FAMILY.map(f => (
                                                                <option key={f.id} value={f.id}>
                                                                    {f.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="font-size font-st col-md-3">
                                                    <label>Heading Font Size</label>

                                                    <div className={`input-ft-size`}>
                                                        <NumberFormat
                                                            value={multi_recommendation_props?.heading?.font_size || "-"}
                                                            onValueChange={values =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        multi_recommendation_props: {
                                                                            ...this.state.property.multi_recommendation_props,
                                                                            heading: {
                                                                                ...this.state.property.multi_recommendation_props.heading,

                                                                                font_size: values.floatValue
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            allowNegative={false}
                                                            suffix=" Pt"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Heading Font Color </label>
                                                    </div>

                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            style={{ cursor: "pointer" }}
                                                            className="arrow_close"
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        multi_recommendation_props: {
                                                                            ...this.state.property.multi_recommendation_props,
                                                                            heading: {
                                                                                ...this.state.property.multi_recommendation_props.heading,
                                                                                font_color: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "multi_recommendation_heading_font_color"
                                                                            ? null
                                                                            : "multi_recommendation_heading_font_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{multi_recommendation_props?.heading?.font_color || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: multi_recommendation_props?.heading?.font_color
                                                                        ? `#${multi_recommendation_props?.heading?.font_color}`
                                                                        : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "multi_recommendation_heading_font_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={multi_recommendation_props?.heading?.font_color}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                multi_recommendation_props: {
                                                                                    ...this.state.property.multi_recommendation_props,
                                                                                    heading: {
                                                                                        ...this.state.property.multi_recommendation_props.heading,

                                                                                        font_color: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="styles-sec">
                                            <div className="d-flex f-outer">
                                                <div className="font-family font-st col-md-3">
                                                    <label>Body Font Name </label>
                                                    <div className="font-select">
                                                        <select
                                                            // className={`dropdown ${
                                                            //     showErrorBorder && custom_legend?.show_legend && !total?.font_id
                                                            //         ? "error-border"
                                                            //         : ""
                                                            // }`}
                                                            className="dropdown"
                                                            value={multi_recommendation_props?.body?.font_id || "-"}
                                                            // // name="table_style"
                                                            onChange={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        multi_recommendation_props: {
                                                                            ...this.state.property.multi_recommendation_props,
                                                                            body: {
                                                                                ...this.state.property.multi_recommendation_props.body,
                                                                                font_id: e.target.value
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {/* <option value="CBRE Table - Emerald Option 2">CBRE Table - Emerald Option 2</option> */}
                                                            {FONT_FAMILY.map(f => (
                                                                <option key={f.id} value={f.id}>
                                                                    {f.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="font-size font-st col-md-3">
                                                    <label>Body Font Size</label>

                                                    <div className={`input-ft-size`}>
                                                        <NumberFormat
                                                            value={multi_recommendation_props?.body?.font_size || "-"}
                                                            onValueChange={values =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        multi_recommendation_props: {
                                                                            ...this.state.property.multi_recommendation_props,
                                                                            body: {
                                                                                ...this.state.property.multi_recommendation_props.body,

                                                                                font_size: values.floatValue
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            allowNegative={false}
                                                            suffix=" Pt"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Body Font Color </label>
                                                    </div>
                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        multi_recommendation_props: {
                                                                            ...this.state.property.multi_recommendation_props,
                                                                            body: {
                                                                                ...this.state.property.multi_recommendation_props.body,
                                                                                font_color: e.target.value
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "multi_recommendation_body_font_color"
                                                                            ? null
                                                                            : "multi_recommendation_body_font_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{multi_recommendation_props?.body?.font_color || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: multi_recommendation_props?.body?.font_color
                                                                        ? `#${multi_recommendation_props?.body?.font_color}`
                                                                        : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "multi_recommendation_body_font_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={multi_recommendation_props?.body?.font_color}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                multi_recommendation_props: {
                                                                                    ...this.state.property.multi_recommendation_props,
                                                                                    body: {
                                                                                        ...this.state.property.multi_recommendation_props.body,

                                                                                        font_color: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="styles-sec">
                                            <div className="d-flex f-outer">
                                                <div className="font-family font-st col-md-3">
                                                    <label>Caption Font Name </label>
                                                    <div className="font-select">
                                                        <select
                                                            // className={`dropdown ${
                                                            //     showErrorBorder && custom_legend?.show_legend && !total?.font_id
                                                            //         ? "error-border"
                                                            //         : ""
                                                            // }`}
                                                            className="dropdown"
                                                            value={multi_recommendation_props?.caption?.font_id || "-"}
                                                            // // name="table_style"
                                                            onChange={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        multi_recommendation_props: {
                                                                            ...this.state.property.multi_recommendation_props,
                                                                            caption: {
                                                                                ...this.state.property.multi_recommendation_props.caption,
                                                                                font_id: e.target.value
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {/* <option value="CBRE Table - Emerald Option 2">CBRE Table - Emerald Option 2</option> */}
                                                            {FONT_FAMILY.map(f => (
                                                                <option key={f.id} value={f.id}>
                                                                    {f.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="font-size font-st col-md-3">
                                                    <label>Caption Font Size</label>

                                                    <div className={`input-ft-size`}>
                                                        <NumberFormat
                                                            value={multi_recommendation_props?.caption?.font_size || "-"}
                                                            onValueChange={values =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        multi_recommendation_props: {
                                                                            ...this.state.property.multi_recommendation_props,
                                                                            caption: {
                                                                                ...this.state.property.multi_recommendation_props.caption,

                                                                                font_size: values.floatValue
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            allowNegative={false}
                                                            suffix=" Pt"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Caption Font Color </label>
                                                    </div>
                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        multi_recommendation_props: {
                                                                            ...this.state.property.multi_recommendation_props,
                                                                            caption: {
                                                                                ...this.state.property.multi_recommendation_props.caption,
                                                                                font_color: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "multi_recommendation_caption_font_color"
                                                                            ? null
                                                                            : "multi_recommendation_caption_font_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{multi_recommendation_props?.caption?.font_color || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: multi_recommendation_props?.caption?.font_color
                                                                        ? `#${multi_recommendation_props?.caption?.font_color}`
                                                                        : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "multi_recommendation_caption_font_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={multi_recommendation_props?.caption?.font_color}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                multi_recommendation_props: {
                                                                                    ...this.state.property.multi_recommendation_props,
                                                                                    caption: {
                                                                                        ...this.state.property.multi_recommendation_props.caption,

                                                                                        font_color: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="styles-sec">
                                            <div className="d-flex f-outer">
                                                <div className="font-family font-st col-md-3">
                                                    <label>Notes Font Name </label>
                                                    <div className="font-select">
                                                        <select
                                                            // className={`dropdown ${
                                                            //     showErrorBorder && custom_legend?.show_legend && !total?.font_id
                                                            //         ? "error-border"
                                                            //         : ""
                                                            // }`}
                                                            className="dropdown"
                                                            value={multi_recommendation_props?.notes?.font_id || "-"}
                                                            // // name="table_style"
                                                            onChange={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        multi_recommendation_props: {
                                                                            ...this.state.property.multi_recommendation_props,
                                                                            notes: {
                                                                                ...this.state.property.multi_recommendation_props.notes,
                                                                                font_id: e.target.value
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <option value="">Select</option>
                                                            {/* <option value="CBRE Table - Emerald Option 2">CBRE Table - Emerald Option 2</option> */}
                                                            {FONT_FAMILY.map(f => (
                                                                <option key={f.id} value={f.id}>
                                                                    {f.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="font-size font-st col-md-3">
                                                    <label>Notes Font Size</label>

                                                    <div className={`input-ft-size`}>
                                                        <NumberFormat
                                                            value={multi_recommendation_props?.notes?.font_size || "-"}
                                                            onValueChange={values =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        multi_recommendation_props: {
                                                                            ...this.state.property.multi_recommendation_props,
                                                                            notes: {
                                                                                ...this.state.property.multi_recommendation_props.notes,

                                                                                font_size: values.floatValue
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            allowNegative={false}
                                                            suffix=" Pt"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="font-color font-st col-md-3">
                                                    <div className="head_sub">
                                                        <label>Notes Font Color </label>
                                                    </div>
                                                    <div
                                                        // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                        className="dropdown"
                                                    >
                                                        <span
                                                            className="arrow_close"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={e =>
                                                                this.setState({
                                                                    property: {
                                                                        ...this.state.property,
                                                                        multi_recommendation_props: {
                                                                            ...this.state.property.multi_recommendation_props,
                                                                            notes: {
                                                                                ...this.state.property.multi_recommendation_props.notes,
                                                                                font_color: ""
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        >
                                                            <i class="fas fa-times"></i>
                                                        </span>
                                                        <div
                                                            className="dropdown-toggle"
                                                            type="button"
                                                            onClick={() => {
                                                                this.setState({
                                                                    colorModalState:
                                                                        colorModalState === "multi_recommendation_notes_font_color"
                                                                            ? null
                                                                            : "multi_recommendation_notes_font_color"
                                                                });
                                                            }}
                                                        >
                                                            <span>{multi_recommendation_props?.notes?.font_color || "Select"}</span>
                                                            <span
                                                                className="color-bx"
                                                                style={{
                                                                    background: multi_recommendation_props?.notes?.font_color
                                                                        ? `#${multi_recommendation_props?.notes?.font_color}`
                                                                        : "#fff"
                                                                }}
                                                            ></span>
                                                            <i aria-hidden="true" className="grey chevron down icon arrow_right"></i>
                                                        </div>
                                                        {colorModalState === "multi_recommendation_notes_font_color" && (
                                                            <div className="z-index-10" style={{ position: "absolute" }}>
                                                                <CompactPicker
                                                                    className="picker"
                                                                    colors={FONT_COLOR}
                                                                    color={multi_recommendation_props?.notes?.font_color}
                                                                    onChangeComplete={color =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                multi_recommendation_props: {
                                                                                    ...this.state.property.multi_recommendation_props,
                                                                                    notes: {
                                                                                        ...this.state.property.multi_recommendation_props.notes,

                                                                                        font_color: color.hex?.replace("#", "")
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="styles-box">
                                            <h2>Header (Client Template Only)</h2>
                                            <div className="styles-sec">
                                                <div className="d-flex f-outer">
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Client Font Name *</label>
                                                        <div className="font-select">
                                                            <select
                                                                className={`dropdown ${
                                                                    showErrorBorder && !header.client.font_id ? "error-border" : ""
                                                                }`}
                                                                value={header?.client?.font_id}
                                                                name="font_id"
                                                                onChange={e => this.handleChangeHeader("client", "font_id", e.target.value)}
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
                                                        <label>Client Font Size *</label>
                                                        <div className={`input-ft-size`}>
                                                            <NumberFormat
                                                                value={header?.client?.font_size}
                                                                onValueChange={values =>
                                                                    this.handleChangeHeader("client", "font_size", values.floatValue)
                                                                }
                                                                allowNegative={false}
                                                                suffix=" Pt"
                                                                className={`${showErrorBorder && !header?.client?.font_size ? "error-border" : ""}`}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="font-color font-st col-md-3">
                                                        <label>Client Font Color *</label>
                                                        <div
                                                            className={`dropdown ${showErrorBorder && !header?.client?.color ? "error-border" : ""}`}
                                                        >
                                                            <div
                                                                className="dropdown-toggle"
                                                                type="button"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        colorModalState:
                                                                            colorModalState === "header_client_color" ? null : "header_client_color"
                                                                    });
                                                                }}
                                                            >
                                                                <span>{header?.client?.color || "Select"}</span>
                                                                <span
                                                                    className="color-bx"
                                                                    style={{
                                                                        background: header?.client?.color ? `#${header?.client?.color}` : "#fff"
                                                                    }}
                                                                ></span>
                                                                <i aria-hidden="true" className="grey chevron down icon"></i>
                                                            </div>
                                                            {colorModalState === "header_client_color" && (
                                                                <div className="z-index-10" style={{ position: "absolute" }}>
                                                                    <CompactPicker
                                                                        className="picker"
                                                                        colors={FONT_COLOR}
                                                                        color={header?.client?.color}
                                                                        onChangeComplete={color =>
                                                                            this.handleChangeHeader("client", "color", color.hex?.replace("#", ""))
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Client Font Bold</label>
                                                        <div className="font-select">
                                                            <select
                                                                className={`dropdown`}
                                                                name="tag"
                                                                value={header?.client?.bold}
                                                                onChange={e => this.handleChangeHeader("client", "bold", e.target.value === "true")}
                                                            >
                                                                <option value={false}>No</option>
                                                                <option value={true}>Yes</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="styles-sec">
                                                <div className="d-flex f-outer">
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Project Font Name *</label>
                                                        <div className="font-select">
                                                            <select
                                                                className={`dropdown ${
                                                                    showErrorBorder && !header.project.font_id ? "error-border" : ""
                                                                }`}
                                                                value={header?.project?.font_id}
                                                                name="font_id"
                                                                onChange={e => this.handleChangeHeader("project", "font_id", e.target.value)}
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
                                                        <label>Project Font Size *</label>
                                                        <div className={`input-ft-size`}>
                                                            <NumberFormat
                                                                value={header?.project?.font_size}
                                                                onValueChange={values =>
                                                                    this.handleChangeHeader("project", "font_size", values.floatValue)
                                                                }
                                                                allowNegative={false}
                                                                suffix=" Pt"
                                                                className={`${showErrorBorder && !header?.project?.font_size ? "error-border" : ""}`}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="font-color font-st col-md-3">
                                                        <label>Project Font Color *</label>
                                                        <div
                                                            className={`dropdown ${showErrorBorder && !header?.project?.color ? "error-border" : ""}`}
                                                        >
                                                            <div
                                                                className="dropdown-toggle"
                                                                type="button"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        colorModalState:
                                                                            colorModalState === "header_project_color" ? null : "header_project_color"
                                                                    });
                                                                }}
                                                            >
                                                                <span>{header?.project?.color || "Select"}</span>
                                                                <span
                                                                    className="color-bx"
                                                                    style={{
                                                                        background: header?.project?.color ? `#${header?.project?.color}` : "#fff"
                                                                    }}
                                                                ></span>
                                                                <i aria-hidden="true" className="grey chevron down icon"></i>
                                                            </div>
                                                            {colorModalState === "header_project_color" && (
                                                                <div className="z-index-10" style={{ position: "absolute" }}>
                                                                    <CompactPicker
                                                                        className="picker"
                                                                        colors={FONT_COLOR}
                                                                        color={header?.project?.color}
                                                                        onChangeComplete={color =>
                                                                            this.handleChangeHeader("project", "color", color.hex?.replace("#", ""))
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Project Font Bold</label>
                                                        <div className="font-select">
                                                            <select
                                                                className={`dropdown`}
                                                                name="tag"
                                                                value={header?.project?.bold}
                                                                onChange={e => this.handleChangeHeader("project", "bold", e.target.value === "true")}
                                                            >
                                                                <option value={false}>No</option>
                                                                <option value={true}>Yes</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="styles-box">
                                            <h2>Heading</h2>
                                            <div className="styles-sec">
                                                <div className="d-flex f-outer">
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Font Name *</label>
                                                        <div className="font-select">
                                                            <select
                                                                className={`dropdown ${showErrorBorder && !heading?.font_id ? "error-border" : ""}`}
                                                                value={heading?.font_id}
                                                                name="font_id"
                                                                onChange={e => this.handleChangeChart("heading", "font_id", e.target.value)}
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
                                                                value={heading?.font_size}
                                                                onValueChange={values =>
                                                                    this.handleChangeChart("heading", "font_size", values.floatValue)
                                                                }
                                                                allowNegative={false}
                                                                suffix=" Pt"
                                                                className={`${showErrorBorder && !heading?.font_size ? "error-border" : ""}`}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="font-color font-st col-md-3">
                                                        <label>Font Color *</label>
                                                        <div className={`dropdown ${showErrorBorder && !heading?.color ? "error-border" : ""}`}>
                                                            <div
                                                                className="dropdown-toggle"
                                                                type="button"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        colorModalState: colorModalState === "heading_color" ? null : "heading_color"
                                                                    });
                                                                }}
                                                            >
                                                                <span>{heading?.color || "Select"}</span>
                                                                <span
                                                                    className="color-bx"
                                                                    style={{ background: heading?.color ? `#${heading?.color}` : "#fff" }}
                                                                ></span>
                                                                <i aria-hidden="true" className="grey chevron down icon"></i>
                                                            </div>
                                                            {colorModalState === "heading_color" && (
                                                                <div className="z-index-10" style={{ position: "absolute" }}>
                                                                    <CompactPicker
                                                                        className="picker"
                                                                        colors={FONT_COLOR}
                                                                        color={heading?.color}
                                                                        onChangeComplete={color =>
                                                                            this.handleChangeChart("heading", "color", color.hex?.replace("#", ""))
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Font Bold</label>
                                                        <div className="font-select">
                                                            <select
                                                                className={`dropdown`}
                                                                name="tag"
                                                                value={heading?.bold}
                                                                onChange={e => this.handleChangeChart("heading", "bold", e.target.value === "true")}
                                                            >
                                                                <option value={false}>No</option>
                                                                <option value={true}>Yes</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex f-outer">
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Font Alignment</label>
                                                        <div className="font-select">
                                                            <select
                                                                className={`dropdown ${showErrorBorder && !heading?.alignment ? "error-border" : ""}`}
                                                                name="tag"
                                                                value={heading?.alignment}
                                                                onChange={e => this.handleChangeChart("heading", "alignment", e.target.value)}
                                                            >
                                                                <option value={"left"}>Left</option>
                                                                <option value={"center"}>Center</option>
                                                                <option value={"right"}>Right</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="styles-box">
                                            <h2>Chart Outer Frame</h2>
                                            <div className="styles-sec">
                                                <div className="d-flex f-outer">
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Visible</label>
                                                        <div className="font-select">
                                                            <select
                                                                className={`dropdown`}
                                                                name="frame"
                                                                value={chart?.frame}
                                                                onChange={e => this.handleChangeChart("chart", "frame", e.target.value === "true")}
                                                            >
                                                                <option value={false}>No</option>
                                                                <option value={true}>Yes</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {chart?.frame ? (
                                                <div className="styles-sec">
                                                    <div className="d-flex f-outer">
                                                        <div className="font-size font-st col-md-3">
                                                            <label>Frame Width</label>
                                                            <div className={`input-ft-size`}>
                                                                <NumberFormat
                                                                    value={chart?.frame_props?.size}
                                                                    onValueChange={values => {
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                properties: {
                                                                                    ...this.state.property.properties,
                                                                                    chart: {
                                                                                        ...this.state.property.properties.chart,
                                                                                        frame_props: {
                                                                                            ...this.state.property.properties.chart.frame_props,
                                                                                            size: values.value
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        });
                                                                    }}
                                                                    allowNegative={false}
                                                                    suffix=" Pt"
                                                                    // className={`${showErrorBorder && !header?.client?.font_size ? "error-border" : ""}`}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="font-size font-st col-md-3">
                                                            <label>Frame Padding</label>
                                                            <div className={`input-ft-size`}>
                                                                <NumberFormat
                                                                    value={chart?.frame_props?.space}
                                                                    onValueChange={values =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                properties: {
                                                                                    ...this.state.property.properties,
                                                                                    chart: {
                                                                                        ...this.state.property.properties.chart,
                                                                                        frame_props: {
                                                                                            ...this.state.property.properties.chart.frame_props,
                                                                                            space: values.value
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                    allowNegative={false}
                                                                    suffix=" Pt"
                                                                    // className={`${showErrorBorder && !header?.client?.font_size ? "error-border" : ""}`}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="font-color font-st col-md-3">
                                                            <label>Frame Color</label>
                                                            <div className={`dropdown`}>
                                                                <div
                                                                    className="dropdown-toggle"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            colorModalState: colorModalState === "frame_color" ? null : "frame_color"
                                                                        });
                                                                    }}
                                                                >
                                                                    <span>{chart?.frame_props?.color || "Select"}</span>
                                                                    <span
                                                                        className="color-bx"
                                                                        style={{
                                                                            background: chart?.frame_props?.color
                                                                                ? `#${chart?.frame_props?.color}`
                                                                                : "#fff"
                                                                        }}
                                                                    ></span>
                                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                                </div>
                                                                {colorModalState === "frame_color" && (
                                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                                        <CompactPicker
                                                                            className="picker"
                                                                            colors={FONT_COLOR}
                                                                            color={chart?.frame_props?.color}
                                                                            onChangeComplete={color => {
                                                                                this.setState({
                                                                                    property: {
                                                                                        ...this.state.property,
                                                                                        properties: {
                                                                                            ...this.state.property.properties,
                                                                                            chart: {
                                                                                                ...this.state.property.properties.chart,
                                                                                                frame_props: {
                                                                                                    ...this.state.property.properties.chart
                                                                                                        .frame_props,
                                                                                                    color: color.hex?.replace("#", "")
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                });
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="font-family font-st col-md-3">
                                                            <label>Frame Style</label>
                                                            <div className="font-select">
                                                                <select
                                                                    className={`dropdown`}
                                                                    value={chart?.frame_props?.val}
                                                                    name="font_id"
                                                                    onChange={e =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                properties: {
                                                                                    ...this.state.property.properties,
                                                                                    chart: {
                                                                                        ...this.state.property.properties.chart,
                                                                                        frame_props: {
                                                                                            ...this.state.property.properties.chart.frame_props,
                                                                                            val: e.target.value
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                >
                                                                    {/* <option value="">Select</option> */}
                                                                    {FRAME_STYLES.map((fStyle, i) => (
                                                                        <option key={i} value={fStyle.name}>
                                                                            {fStyle.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="styles-box">
                                            <h2>X-Axis</h2>
                                            <div className="styles-sec">
                                                <div className="d-flex f-outer">
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Font Name</label>
                                                        <i
                                                            data-tip="Font Name of X-Axis, Y-Axis, Data Labels and Legends must be the same"
                                                            data-for="chart_property"
                                                            className="fas fa-info-circle ml-2"
                                                        />
                                                        <div className="font-select">
                                                            <select
                                                                className={`dropdown`}
                                                                value={chart_font?.font_id}
                                                                name="font_id"
                                                                onChange={e => this.handleChangeChart("chart_font", "font_id", e.target.value)}
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
                                                        <label>Font Size</label>
                                                        <div className={`input-ft-size`}>
                                                            <NumberFormat
                                                                value={x_axis?.font_size}
                                                                onValueChange={values =>
                                                                    this.handleChangeChart("x_axis", "font_size", values.floatValue)
                                                                }
                                                                allowNegative={false}
                                                                suffix=" px"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="font-color font-st col-md-3">
                                                        <label>Font Color</label>
                                                        <div className={`dropdown`}>
                                                            <div
                                                                className="dropdown-toggle"
                                                                type="button"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        colorModalState: colorModalState === "x_axis_color" ? null : "x_axis_color"
                                                                    });
                                                                }}
                                                            >
                                                                <span>{x_axis?.color || "Select"}</span>
                                                                <span
                                                                    className="color-bx"
                                                                    style={{ background: x_axis?.color ? `#${x_axis?.color}` : "#fff" }}
                                                                ></span>
                                                                <i aria-hidden="true" className="grey chevron down icon"></i>
                                                            </div>
                                                            {colorModalState === "x_axis_color" && (
                                                                <div className="z-index-10" style={{ position: "absolute" }}>
                                                                    <CompactPicker
                                                                        className="picker"
                                                                        colors={FONT_COLOR}
                                                                        color={x_axis?.color}
                                                                        onChangeComplete={color =>
                                                                            this.handleChangeChart("x_axis", "color", color.hex?.replace("#", ""))
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="styles-box">
                                            <h2>Y-Axis</h2>
                                            <div className="styles-sec">
                                                <div className="d-flex f-outer">
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Font Name</label>
                                                        <i
                                                            data-tip="Font Name of X-Axis, Y-Axis, Data Labels and Legends must be the same"
                                                            data-for="chart_property"
                                                            className="fas fa-info-circle ml-2"
                                                        />
                                                        <div className="font-select">
                                                            <select
                                                                className={`dropdown`}
                                                                value={chart_font?.font_id}
                                                                name="font_id"
                                                                onChange={e => this.handleChangeChart("chart_font", "font_id", e.target.value)}
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
                                                        <label>Font Size</label>
                                                        <div className={`input-ft-size`}>
                                                            <NumberFormat
                                                                value={y_axis?.font_size}
                                                                onValueChange={values =>
                                                                    this.handleChangeChart("y_axis", "font_size", values.floatValue)
                                                                }
                                                                allowNegative={false}
                                                                suffix=" px"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="font-color font-st col-md-3">
                                                        <label>Font Color</label>
                                                        <div className={`dropdown`}>
                                                            <div
                                                                className="dropdown-toggle"
                                                                type="button"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        colorModalState: colorModalState === "y_axis_color" ? null : "y_axis_color"
                                                                    });
                                                                }}
                                                            >
                                                                <span>{y_axis?.color || "Select"}</span>
                                                                <span
                                                                    className="color-bx"
                                                                    style={{ background: y_axis?.color ? `#${y_axis?.color}` : "#fff" }}
                                                                ></span>
                                                                <i aria-hidden="true" className="grey chevron down icon"></i>
                                                            </div>
                                                            {colorModalState === "y_axis_color" && (
                                                                <div className="z-index-10" style={{ position: "absolute" }}>
                                                                    <CompactPicker
                                                                        className="picker"
                                                                        colors={FONT_COLOR}
                                                                        color={y_axis?.color}
                                                                        onChangeComplete={color =>
                                                                            this.handleChangeChart("y_axis", "color", color.hex?.replace("#", ""))
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="styles-box">
                                            <h2>Data Labels</h2>
                                            <div className="styles-sec">
                                                <div className="d-flex f-outer">
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Font Name</label>
                                                        <i
                                                            data-tip="Font Name of X-Axis, Y-Axis, Data Labels and Legends must be the same"
                                                            data-for="chart_property"
                                                            className="fas fa-info-circle ml-2"
                                                        />
                                                        <div className="font-select">
                                                            <select
                                                                className={`dropdown`}
                                                                value={chart_font?.font_id}
                                                                name="font_id"
                                                                onChange={e => this.handleChangeChart("chart_font", "font_id", e.target.value)}
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
                                                        <label>Font Size</label>
                                                        <div className={`input-ft-size`}>
                                                            <NumberFormat
                                                                value={data_labels?.font_size}
                                                                onValueChange={values =>
                                                                    this.handleChangeChart("data_labels", "font_size", values.floatValue)
                                                                }
                                                                allowNegative={false}
                                                                suffix=" px"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="font-color font-st col-md-3">
                                                        <label>Font Color</label>
                                                        <div className={`dropdown`}>
                                                            <div
                                                                className="dropdown-toggle"
                                                                type="button"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        colorModalState:
                                                                            colorModalState === "data_labels_color" ? null : "data_labels_color"
                                                                    });
                                                                }}
                                                            >
                                                                <span>{data_labels?.color || "Select"}</span>
                                                                <span
                                                                    className="color-bx"
                                                                    style={{ background: data_labels?.color ? `#${data_labels?.color}` : "#fff" }}
                                                                ></span>
                                                                <i aria-hidden="true" className="grey chevron down icon"></i>
                                                            </div>
                                                            {colorModalState === "data_labels_color" && (
                                                                <div className="z-index-10" style={{ position: "absolute" }}>
                                                                    <CompactPicker
                                                                        className="picker"
                                                                        colors={FONT_COLOR}
                                                                        color={data_labels?.color}
                                                                        onChangeComplete={color =>
                                                                            this.handleChangeChart(
                                                                                "data_labels",
                                                                                "color",
                                                                                color.hex?.replace("#", "")
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="styles-box">
                                            <h2>Legends</h2>
                                            <div className="styles-sec">
                                                <div className="d-flex f-outer">
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Visible</label>
                                                        <div className="font-select">
                                                            <select
                                                                className={`dropdown`}
                                                                name="show_legend"
                                                                value={legend?.show_legend}
                                                                onChange={e =>
                                                                    this.handleChangeChart("legend", "show_legend", e.target.value === "true")
                                                                }
                                                            >
                                                                <option value={false}>No</option>
                                                                <option value={true}>Yes</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {legend?.show_legend && (
                                                <>
                                                    <div className="styles-sec">
                                                        <div className="d-flex f-outer">
                                                            <div className="font-family font-st col-md-3">
                                                                <label>Font Name</label>
                                                                <i
                                                                    data-tip="Font Name of X-Axis, Y-Axis, Data Labels and Legends must be the same"
                                                                    data-for="chart_property"
                                                                    className="fas fa-info-circle ml-2"
                                                                />
                                                                <div className="font-select">
                                                                    <select
                                                                        className={`dropdown`}
                                                                        value={chart_font?.font_id}
                                                                        name="font_id"
                                                                        onChange={e =>
                                                                            this.handleChangeChart("chart_font", "font_id", e.target.value)
                                                                        }
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
                                                                <label>Font Size</label>
                                                                <div className={`input-ft-size`}>
                                                                    <NumberFormat
                                                                        value={legend?.font_size}
                                                                        onValueChange={values =>
                                                                            this.handleChangeChart("legend", "font_size", values.floatValue)
                                                                        }
                                                                        allowNegative={false}
                                                                        suffix=" px"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="font-color font-st col-md-3">
                                                                <label>Font Color</label>
                                                                <div className={`dropdown`}>
                                                                    <div
                                                                        className="dropdown-toggle"
                                                                        type="button"
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                colorModalState:
                                                                                    colorModalState === "legend_font_color"
                                                                                        ? null
                                                                                        : "legend_font_color"
                                                                            });
                                                                        }}
                                                                    >
                                                                        <span>{legend?.font_color || "Select"}</span>
                                                                        <span
                                                                            className="color-bx"
                                                                            style={{
                                                                                background: legend?.font_color ? `#${legend?.font_color}` : "#fff"
                                                                            }}
                                                                        ></span>
                                                                        <i aria-hidden="true" className="grey chevron down icon"></i>
                                                                    </div>
                                                                    {colorModalState === "legend_font_color" && (
                                                                        <div className="z-index-10" style={{ position: "absolute" }}>
                                                                            <CompactPicker
                                                                                className="picker"
                                                                                colors={FONT_COLOR}
                                                                                color={legend?.font_color}
                                                                                onChangeComplete={color =>
                                                                                    this.handleChangeChart(
                                                                                        "legend",
                                                                                        "font_color",
                                                                                        color.hex?.replace("#", "")
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="font-family font-st col-md-3">
                                                                <label>Font Bold</label>
                                                                <div className="font-select">
                                                                    <select
                                                                        className={`dropdown`}
                                                                        name="legend"
                                                                        value={legend?.bold}
                                                                        onChange={e =>
                                                                            this.handleChangeChart("legend", "bold", e.target.value === "true")
                                                                        }
                                                                    >
                                                                        <option value={false}>No</option>
                                                                        <option value={true}>Yes</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="styles-sec">
                                                        <div className="d-flex f-outer">
                                                            <div className="font-color font-st col-md-3">
                                                                <label>Background Color</label>
                                                                <div
                                                                    className={`dropdown ${
                                                                        showErrorBorder && !legend?.backgroundColor ? "error-border" : ""
                                                                    }`}
                                                                >
                                                                    <div
                                                                        className="dropdown-toggle"
                                                                        type="button"
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                colorModalState:
                                                                                    colorModalState === "legend_bg_color" ? null : "legend_bg_color"
                                                                            });
                                                                        }}
                                                                    >
                                                                        <span>{legend?.backgroundColor || "Select"}</span>
                                                                        <span
                                                                            className="color-bx"
                                                                            style={{
                                                                                background: legend?.backgroundColor
                                                                                    ? `#${legend?.backgroundColor}`
                                                                                    : "#fff"
                                                                            }}
                                                                        ></span>
                                                                        <i aria-hidden="true" className="grey chevron down icon"></i>
                                                                    </div>
                                                                    {colorModalState === "legend_bg_color" && (
                                                                        <div className="z-index-10" style={{ position: "absolute" }}>
                                                                            <CompactPicker
                                                                                className="picker"
                                                                                colors={FONT_COLOR}
                                                                                color={legend?.backgroundColor}
                                                                                onChangeComplete={color =>
                                                                                    this.handleChangeChart(
                                                                                        "legend",
                                                                                        "backgroundColor",
                                                                                        color.hex?.replace("#", "")
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="font-color font-st col-md-3">
                                                                <label>Border Color</label>
                                                                <div
                                                                    className={`dropdown ${
                                                                        showErrorBorder && !legend?.borderColor ? "error-border" : ""
                                                                    }`}
                                                                >
                                                                    <div
                                                                        className="dropdown-toggle"
                                                                        type="button"
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                colorModalState:
                                                                                    colorModalState === "legend_border_color"
                                                                                        ? null
                                                                                        : "legend_border_color"
                                                                            });
                                                                        }}
                                                                    >
                                                                        <span>{legend?.borderColor || "Select"}</span>
                                                                        <span
                                                                            className="color-bx"
                                                                            style={{
                                                                                background: legend?.borderColor ? `#${legend?.borderColor}` : "#fff"
                                                                            }}
                                                                        ></span>
                                                                        <i aria-hidden="true" className="grey chevron down icon"></i>
                                                                    </div>
                                                                    {colorModalState === "legend_border_color" && (
                                                                        <div className="z-index-10" style={{ position: "absolute" }}>
                                                                            <CompactPicker
                                                                                className="picker"
                                                                                colors={FONT_COLOR}
                                                                                color={legend?.borderColor}
                                                                                onChangeComplete={color =>
                                                                                    this.handleChangeChart(
                                                                                        "legend",
                                                                                        "borderColor",
                                                                                        color.hex?.replace("#", "")
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="font-size font-st col-md-3">
                                                                <label>Border Width</label>
                                                                <div className={`input-ft-size`}>
                                                                    <NumberFormat
                                                                        value={legend?.borderWidth}
                                                                        onValueChange={values =>
                                                                            this.handleChangeChart("legend", "borderWidth", values.floatValue)
                                                                        }
                                                                        allowNegative={false}
                                                                        suffix=" px"
                                                                        className={`${showErrorBorder && !legend?.borderWidth ? "error-border" : ""}`}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="font-size font-st col-md-3">
                                                                <label>Border Radius</label>
                                                                <div className={`input-ft-size`}>
                                                                    <NumberFormat
                                                                        value={legend?.borderRadius}
                                                                        onValueChange={values =>
                                                                            this.handleChangeChart("legend", "borderRadius", values.floatValue)
                                                                        }
                                                                        allowNegative={false}
                                                                        suffix=" px"
                                                                        className={`${
                                                                            showErrorBorder && !legend?.borderRadius ? "error-border" : ""
                                                                        }`}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="styles-box">
                                            <h2>Custom Legends</h2>
                                            <div className="styles-sec">
                                                <div className="d-flex f-outer">
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Visible</label>
                                                        <div className="font-select">
                                                            <select
                                                                className={`dropdown`}
                                                                name="tag"
                                                                value={custom_legend?.show_legend}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            properties: {
                                                                                ...this.state.property.properties,
                                                                                custom_legend: {
                                                                                    ...this.state.property.properties.custom_legend,
                                                                                    show_legend: e.target.value === "true"
                                                                                }
                                                                            }
                                                                        }
                                                                    });
                                                                }}
                                                            >
                                                                <option value={false}>No</option>
                                                                <option value={true}>Yes</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {custom_legend?.show_legend ? (
                                                <>
                                                    <div className="styles-sec">
                                                        <div className="d-flex f-outer">
                                                            <div className="font-family font-st col-md-3">
                                                                <label>Header Font Name *</label>
                                                                <div className="font-select">
                                                                    <select
                                                                        className={`dropdown ${
                                                                            showErrorBorder &&
                                                                            custom_legend.show_legend &&
                                                                            !custom_legend?.legend_heading?.font_id
                                                                                ? "error-border"
                                                                                : ""
                                                                        }`}
                                                                        value={custom_legend?.legend_heading?.font_id}
                                                                        name="font_id"
                                                                        onChange={e =>
                                                                            this.handleChangeCustomLegend("legend_heading", "font_id", e.target.value)
                                                                        }
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
                                                                        value={custom_legend?.legend_heading?.font_size}
                                                                        onValueChange={values =>
                                                                            this.handleChangeCustomLegend(
                                                                                "legend_heading",
                                                                                "font_size",
                                                                                values.floatValue
                                                                            )
                                                                        }
                                                                        allowNegative={false}
                                                                        suffix=" Pt"
                                                                        className={`${
                                                                            showErrorBorder &&
                                                                            custom_legend.show_legend &&
                                                                            !custom_legend?.legend_heading?.font_size
                                                                                ? "error-border"
                                                                                : ""
                                                                        }`}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="font-color font-st col-md-3">
                                                                <label>Header Font Color *</label>
                                                                <div
                                                                    className={`dropdown ${
                                                                        showErrorBorder && !custom_legend?.legend_heading?.color ? "error-border" : ""
                                                                    }`}
                                                                >
                                                                    <div
                                                                        className="dropdown-toggle"
                                                                        type="button"
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                colorModalState:
                                                                                    colorModalState === "custom_legend_heading_color"
                                                                                        ? null
                                                                                        : "custom_legend_heading_color"
                                                                            });
                                                                        }}
                                                                    >
                                                                        <span>{custom_legend?.legend_heading?.color || "Select"}</span>
                                                                        <span
                                                                            className="color-bx"
                                                                            style={{
                                                                                background: custom_legend?.legend_heading?.color
                                                                                    ? `#${custom_legend?.legend_heading?.color}`
                                                                                    : "#fff"
                                                                            }}
                                                                        ></span>
                                                                        <i aria-hidden="true" className="grey chevron down icon"></i>
                                                                    </div>
                                                                    {colorModalState === "custom_legend_heading_color" && (
                                                                        <div className="z-index-10" style={{ position: "absolute" }}>
                                                                            <CompactPicker
                                                                                className="picker"
                                                                                colors={FONT_COLOR}
                                                                                color={custom_legend?.legend_heading?.color}
                                                                                onChangeComplete={color =>
                                                                                    this.handleChangeCustomLegend(
                                                                                        "legend_heading",
                                                                                        "color",
                                                                                        color.hex?.replace("#", "")
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="font-family font-st col-md-3">
                                                                <label>Header Font Bold</label>
                                                                <div className="font-select">
                                                                    <select
                                                                        className={`dropdown`}
                                                                        name="tag"
                                                                        value={custom_legend?.legend_heading?.bold}
                                                                        onChange={e =>
                                                                            this.handleChangeCustomLegend(
                                                                                "legend_heading",
                                                                                "bold",
                                                                                e.target.value === "true"
                                                                            )
                                                                        }
                                                                    >
                                                                        <option value={false}>No</option>
                                                                        <option value={true}>Yes</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex f-outer">
                                                            <div className="font-family font-st col-md-3">
                                                                <label>Header Font Alignment</label>
                                                                <div className="font-select">
                                                                    <select
                                                                        className={`dropdown ${
                                                                            showErrorBorder && !custom_legend?.legend_heading?.alignment
                                                                                ? "error-border"
                                                                                : ""
                                                                        }`}
                                                                        name="tag"
                                                                        value={custom_legend?.legend_heading?.alignment}
                                                                        onChange={e =>
                                                                            this.handleChangeCustomLegend(
                                                                                "legend_heading",
                                                                                "alignment",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    >
                                                                        <option value={"left"}>Left</option>
                                                                        <option value={"center"}>Center</option>
                                                                        <option value={"right"}>Right</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="styles-sec">
                                                        <div className="d-flex f-outer">
                                                            <div className="font-family font-st col-md-3">
                                                                <label>Value Font Name *</label>
                                                                <div className="font-select">
                                                                    <select
                                                                        className={`dropdown ${
                                                                            showErrorBorder &&
                                                                            custom_legend.show_legend &&
                                                                            !custom_legend?.legend_value?.font_id
                                                                                ? "error-border"
                                                                                : ""
                                                                        }`}
                                                                        value={custom_legend?.legend_value?.font_id}
                                                                        name="font_id"
                                                                        onChange={e =>
                                                                            this.handleChangeCustomLegend("legend_value", "font_id", e.target.value)
                                                                        }
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
                                                                <label>Value Font Size *</label>
                                                                <div className={`input-ft-size`}>
                                                                    <NumberFormat
                                                                        value={custom_legend?.legend_value?.font_size}
                                                                        onValueChange={values =>
                                                                            this.handleChangeCustomLegend(
                                                                                "legend_value",
                                                                                "font_size",
                                                                                values.floatValue
                                                                            )
                                                                        }
                                                                        allowNegative={false}
                                                                        suffix=" Pt"
                                                                        className={`${
                                                                            showErrorBorder &&
                                                                            custom_legend.show_legend &&
                                                                            !custom_legend?.legend_value?.font_size
                                                                                ? "error-border"
                                                                                : ""
                                                                        }`}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="font-color font-st col-md-3">
                                                                <label>Value Font Color *</label>
                                                                <div
                                                                    className={`dropdown ${
                                                                        showErrorBorder && !custom_legend?.legend_value?.color ? "error-border" : ""
                                                                    }`}
                                                                >
                                                                    <div
                                                                        className="dropdown-toggle"
                                                                        type="button"
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                colorModalState:
                                                                                    colorModalState === "custom_legend_value_color"
                                                                                        ? null
                                                                                        : "custom_legend_value_color"
                                                                            });
                                                                        }}
                                                                    >
                                                                        <span>{custom_legend?.legend_value?.color || "Select"}</span>
                                                                        <span
                                                                            className="color-bx"
                                                                            style={{
                                                                                background: custom_legend?.legend_value?.color
                                                                                    ? `#${custom_legend?.legend_value?.color}`
                                                                                    : "#fff"
                                                                            }}
                                                                        ></span>
                                                                        <i aria-hidden="true" className="grey chevron down icon"></i>
                                                                    </div>
                                                                    {colorModalState === "custom_legend_value_color" && (
                                                                        <div className="z-index-10" style={{ position: "absolute" }}>
                                                                            <CompactPicker
                                                                                className="picker"
                                                                                colors={FONT_COLOR}
                                                                                color={custom_legend?.legend_value?.color}
                                                                                onChangeComplete={color =>
                                                                                    this.handleChangeCustomLegend(
                                                                                        "legend_value",
                                                                                        "color",
                                                                                        color.hex?.replace("#", "")
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="font-family font-st col-md-3">
                                                                <label>Value Font Bold</label>
                                                                <div className="font-select">
                                                                    <select
                                                                        className={`dropdown`}
                                                                        name="tag"
                                                                        value={custom_legend?.legend_value?.bold}
                                                                        onChange={e =>
                                                                            this.handleChangeCustomLegend(
                                                                                "legend_value",
                                                                                "bold",
                                                                                e.target.value === "true"
                                                                            )
                                                                        }
                                                                    >
                                                                        <option value={false}>No</option>
                                                                        <option value={true}>Yes</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex f-outer">
                                                            <div className="font-family font-st col-md-3">
                                                                <label>Value Font Alignment</label>
                                                                <div className="font-select">
                                                                    <select
                                                                        className={`dropdown ${
                                                                            showErrorBorder && !custom_legend?.legend_value?.alignment
                                                                                ? "error-border"
                                                                                : ""
                                                                        }`}
                                                                        name="tag"
                                                                        value={custom_legend?.legend_value?.alignment}
                                                                        onChange={e =>
                                                                            this.handleChangeCustomLegend("legend_value", "alignment", e.target.value)
                                                                        }
                                                                    >
                                                                        <option value={"left"}>Left</option>
                                                                        <option value={"center"}>Center</option>
                                                                        <option value={"right"}>Right</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <div className="styles-box">
                                            <h2>Total</h2>
                                            <div className="styles-sec">
                                                <div className="d-flex f-outer">
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Visible</label>
                                                        <div className="font-select">
                                                            <select
                                                                className={`dropdown`}
                                                                name="tag"
                                                                value={total?.show_total}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            properties: {
                                                                                ...this.state.property.properties,
                                                                                total: {
                                                                                    ...this.state.property.properties.total,
                                                                                    show_total: e.target.value === "true"
                                                                                }
                                                                            }
                                                                        }
                                                                    });
                                                                }}
                                                            >
                                                                <option value={false}>No</option>
                                                                <option value={true}>Yes</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {total?.show_total ? (
                                                <div className="styles-sec">
                                                    <div className="d-flex f-outer">
                                                        <div className="font-family font-st col-md-3">
                                                            <label>Font Name *</label>
                                                            <div className="font-select">
                                                                <select
                                                                    className={`dropdown ${
                                                                        showErrorBorder && custom_legend?.show_legend && !total?.font_id
                                                                            ? "error-border"
                                                                            : ""
                                                                    }`}
                                                                    value={total?.font_id}
                                                                    name="font_id"
                                                                    onChange={e => this.handleChangeChart("total", "font_id", e.target.value)}
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
                                                                    value={total?.font_size}
                                                                    onValueChange={values =>
                                                                        this.handleChangeChart("total", "font_size", values.floatValue)
                                                                    }
                                                                    allowNegative={false}
                                                                    suffix=" Pt"
                                                                    className={`${
                                                                        showErrorBorder && custom_legend?.show_legend && !total?.font_size
                                                                            ? "error-border"
                                                                            : ""
                                                                    }`}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="font-color font-st col-md-3">
                                                            <label>Font Color *</label>
                                                            <div className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}>
                                                                <div
                                                                    className="dropdown-toggle"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            colorModalState: colorModalState === "total_color" ? null : "total_color"
                                                                        });
                                                                    }}
                                                                >
                                                                    <span>{total?.color || "Select"}</span>
                                                                    <span
                                                                        className="color-bx"
                                                                        style={{ background: total?.color ? `#${total?.color}` : "#fff" }}
                                                                    ></span>
                                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                                </div>
                                                                {colorModalState === "total_color" && (
                                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                                        <CompactPicker
                                                                            className="picker"
                                                                            colors={FONT_COLOR}
                                                                            color={total?.color}
                                                                            onChangeComplete={color =>
                                                                                this.handleChangeChart("total", "color", color.hex?.replace("#", ""))
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="font-family font-st col-md-3">
                                                            <label>Font Bold</label>
                                                            <div className="font-select">
                                                                <select
                                                                    className={`dropdown`}
                                                                    name="tag"
                                                                    value={total?.bold}
                                                                    onChange={e => this.handleChangeChart("total", "bold", e.target.value === "true")}
                                                                >
                                                                    <option value={false}>No</option>
                                                                    <option value={true}>Yes</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex f-outer">
                                                        <div className="font-family font-st col-md-3">
                                                            <label>Font Alignment</label>
                                                            <div className="font-select">
                                                                <select
                                                                    className={`dropdown ${
                                                                        showErrorBorder && !total?.alignment ? "error-border" : ""
                                                                    }`}
                                                                    name="tag"
                                                                    value={total?.alignment}
                                                                    onChange={e => this.handleChangeChart("total", "alignment", e.target.value)}
                                                                >
                                                                    <option value={"left"}>Left</option>
                                                                    <option value={"center"}>Center</option>
                                                                    <option value={"right"}>Right</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>

                                        {/* table properties */}
                                        <div className="styles-box">
                                            <h2>Table Properties</h2>

                                            <div className="styles-sec">
                                                <div className="d-flex f-outer">
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Table Style </label>
                                                        <div className="font-select">
                                                            <select
                                                                // className={`dropdown ${
                                                                //     showErrorBorder && custom_legend?.show_legend && !total?.font_id
                                                                //         ? "error-border"
                                                                //         : ""
                                                                // }`}
                                                                className="dropdown"
                                                                value={table?.table_style_id || "-"}
                                                                // name="table_style"
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            properties: {
                                                                                ...this.state.property.properties,
                                                                                table: {
                                                                                    ...this.state.property.properties.table,
                                                                                    table_style_id: e.target.value
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            >
                                                                <option value="">Select</option>
                                                                {/* <option value="CBRE Table - Emerald Option 2">CBRE Table - Emerald Option 2</option> */}
                                                                {TABLE_STYLE.map(f => (
                                                                    <option value={f.id} key={f.id}>
                                                                        {f.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="font-size font-st col-md-3">
                                                        <label>Table Column Width</label>
                                                        <div className={`input-ft-size`}>
                                                            <NumberFormat
                                                                value={table?.col_width}
                                                                onValueChange={values =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            properties: {
                                                                                ...this.state.property.properties,
                                                                                table: {
                                                                                    ...this.state.property.properties.table,
                                                                                    col_width: Number(values.value)
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                                allowNegative={false}
                                                                suffix=" inch"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="styles-sec">
                                                    <div className="d-flex f-outer">
                                                        <div className="font-family font-st col-md-3">
                                                            <label>Custom Heading Font Name </label>
                                                            <div className="font-select">
                                                                <select
                                                                    // className={`dropdown ${showErrorBorder && !header.client.font_id ? "error-border" : ""}`}
                                                                    className="dropdown"
                                                                    value={table?.custom_head?.font_id}
                                                                    // name="font_id"
                                                                    onChange={e =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                properties: {
                                                                                    ...this.state.property.properties,
                                                                                    table: {
                                                                                        ...this.state.property.properties.table,
                                                                                        custom_head: {
                                                                                            ...this.state.property.properties.table.custom_head,
                                                                                            font_id: e.target.value
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
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
                                                            <label>Custom Heading Font Size</label>
                                                            <div className={`input-ft-size`}>
                                                                <NumberFormat
                                                                    value={table?.custom_head?.font_size}
                                                                    onValueChange={values =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                properties: {
                                                                                    ...this.state.property.properties,
                                                                                    table: {
                                                                                        ...this.state.property.properties.table,
                                                                                        custom_head: {
                                                                                            ...this.state.property.properties.table.custom_head,
                                                                                            font_size: Number(values.value)
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                    allowNegative={false}
                                                                    suffix=" Pt"
                                                                    // className={`${
                                                                    //     showErrorBorder && custom_legend?.show_legend && !total?.font_size
                                                                    //         ? "error-border"
                                                                    //         : ""
                                                                    // }`}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="font-color font-st col-md-3">
                                                            <label>Custom Heading Font Color </label>
                                                            <div
                                                                // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                                className="dropdown"
                                                            >
                                                                <div
                                                                    className="dropdown-toggle"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            colorModalState:
                                                                                colorModalState === "table_custom_heading_color"
                                                                                    ? null
                                                                                    : "table_custom_heading_color"
                                                                        });
                                                                    }}
                                                                >
                                                                    <span>{table?.custom_head?.font_color || "Select"}</span>
                                                                    <span
                                                                        className="color-bx"
                                                                        style={{
                                                                            background: table?.custom_head?.font_color
                                                                                ? `#${table?.custom_head?.font_color}`
                                                                                : "#fff"
                                                                        }}
                                                                    ></span>
                                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                                </div>
                                                                {colorModalState === "table_custom_heading_color" && (
                                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                                        <CompactPicker
                                                                            className="picker"
                                                                            colors={FONT_COLOR}
                                                                            color={table?.custom_head?.font_color}
                                                                            onChangeComplete={color =>
                                                                                this.setState({
                                                                                    property: {
                                                                                        ...this.state.property,
                                                                                        properties: {
                                                                                            ...this.state.property.properties,
                                                                                            table: {
                                                                                                ...this.state.property.properties.table,
                                                                                                custom_head: {
                                                                                                    ...this.state.property.properties.table
                                                                                                        .custom_head,
                                                                                                    font_color: color.hex?.replace("#", "")
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                })
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="font-color font-st col-md-3">
                                                            <label>Custom Heading Background Color </label>
                                                            <div
                                                                // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                                className="dropdown"
                                                            >
                                                                <div
                                                                    className="dropdown-toggle"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            colorModalState:
                                                                                colorModalState === "table_custom_heading_bg_color"
                                                                                    ? null
                                                                                    : "table_custom_heading_bg_color"
                                                                        });
                                                                    }}
                                                                >
                                                                    <span>{table?.custom_head?.bg_color || "Select"}</span>
                                                                    <span
                                                                        className="color-bx"
                                                                        style={{
                                                                            background: table?.custom_head?.bg_color
                                                                                ? `#${table?.custom_head?.bg_color}`
                                                                                : "#fff"
                                                                        }}
                                                                    ></span>
                                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                                </div>
                                                                {colorModalState === "table_custom_heading_bg_color" && (
                                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                                        <CompactPicker
                                                                            className="picker"
                                                                            colors={FONT_COLOR}
                                                                            color={table?.custom_head?.bg_color}
                                                                            onChangeComplete={color =>
                                                                                this.setState({
                                                                                    property: {
                                                                                        ...this.state.property,
                                                                                        properties: {
                                                                                            ...this.state.property.properties,
                                                                                            table: {
                                                                                                ...this.state.property.properties.table,
                                                                                                custom_head: {
                                                                                                    ...this.state.property.properties.table
                                                                                                        .custom_head,
                                                                                                    bg_color: color.hex?.replace("#", "")
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                })
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="font-family font-st col-md-3">
                                                            <label>Custom Heading Alignment</label>
                                                            <div className="font-select">
                                                                <select
                                                                    // className={`dropdown ${showErrorBorder && !total?.alignment ? "error-border" : ""}`}
                                                                    className="dropdown"
                                                                    name="tag"
                                                                    value={table?.custom_head?.alignment}
                                                                    onChange={e =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                properties: {
                                                                                    ...this.state.property.properties,
                                                                                    table: {
                                                                                        ...this.state.property.properties.table,
                                                                                        custom_head: {
                                                                                            ...this.state.property.properties.table.custom_head,
                                                                                            alignment: e.target.value
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                >
                                                                    {" "}
                                                                    <option value="">Select</option>
                                                                    <option value={"left"}>Left</option>
                                                                    <option value={"center"}>Center</option>
                                                                    <option value={"right"}>Right</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="styles-sec">
                                                    <div className="d-flex f-outer">
                                                        <div className="font-family font-st col-md-3">
                                                            <label>Heading Font Name </label>
                                                            <div className="font-select">
                                                                <select
                                                                    // className={`dropdown ${showErrorBorder && !header.client.font_id ? "error-border" : ""}`}
                                                                    className="dropdown"
                                                                    value={table?.heading?.font_id}
                                                                    // name="font_id"
                                                                    onChange={e =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                properties: {
                                                                                    ...this.state.property.properties,
                                                                                    table: {
                                                                                        ...this.state.property.properties.table,
                                                                                        heading: {
                                                                                            ...this.state.property.properties.table.heading,
                                                                                            font_id: e.target.value
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
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
                                                            <label>Heading Font Size</label>
                                                            <div className={`input-ft-size`}>
                                                                <NumberFormat
                                                                    value={table?.heading?.font_size}
                                                                    onValueChange={values =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                properties: {
                                                                                    ...this.state.property.properties,
                                                                                    table: {
                                                                                        ...this.state.property.properties.table,
                                                                                        heading: {
                                                                                            ...this.state.property.properties.table.heading,
                                                                                            font_size: values.floatValue
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                    allowNegative={false}
                                                                    suffix=" Pt"
                                                                    // className={`${
                                                                    //     showErrorBorder && custom_legend?.show_legend && !total?.font_size
                                                                    //         ? "error-border"
                                                                    //         : ""
                                                                    // }`}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="font-color font-st col-md-3">
                                                            <label>Heading Font Color </label>
                                                            <div
                                                                // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                                className="dropdown"
                                                            >
                                                                <div
                                                                    className="dropdown-toggle"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            colorModalState:
                                                                                colorModalState === "table_heading_color"
                                                                                    ? null
                                                                                    : "table_heading_color"
                                                                        });
                                                                    }}
                                                                >
                                                                    <span>{table?.heading?.font_color || "Select"}</span>
                                                                    <span
                                                                        className="color-bx"
                                                                        style={{
                                                                            background: table?.heading?.font_color
                                                                                ? `#${table?.heading?.font_color}`
                                                                                : "#fff"
                                                                        }}
                                                                    ></span>
                                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                                </div>
                                                                {colorModalState === "table_heading_color" && (
                                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                                        <CompactPicker
                                                                            className="picker"
                                                                            colors={FONT_COLOR}
                                                                            color={table?.heading?.font_color}
                                                                            onChangeComplete={color =>
                                                                                this.setState({
                                                                                    property: {
                                                                                        ...this.state.property,
                                                                                        properties: {
                                                                                            ...this.state.property.properties,
                                                                                            table: {
                                                                                                ...this.state.property.properties.table,
                                                                                                heading: {
                                                                                                    ...this.state.property.properties.table.heading,
                                                                                                    font_color: color.hex?.replace("#", "")
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                })
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="font-color font-st col-md-3">
                                                            <label>Heading Background Color </label>
                                                            <div
                                                                // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                                className="dropdown"
                                                            >
                                                                <div
                                                                    className="dropdown-toggle"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            colorModalState:
                                                                                colorModalState === "table_heading_bg_color"
                                                                                    ? null
                                                                                    : "table_heading_bg_color"
                                                                        });
                                                                    }}
                                                                >
                                                                    <span>{table?.heading?.bg_color || "Select"}</span>
                                                                    <span
                                                                        className="color-bx"
                                                                        style={{
                                                                            background: table?.heading?.bg_color
                                                                                ? `#${table?.heading?.bg_color}`
                                                                                : "#fff"
                                                                        }}
                                                                    ></span>
                                                                    <i aria-hidden="true" className="grey chevron down icon"></i>
                                                                </div>
                                                                {colorModalState === "table_heading_bg_color" && (
                                                                    <div className="z-index-10" style={{ position: "absolute" }}>
                                                                        <CompactPicker
                                                                            className="picker"
                                                                            colors={FONT_COLOR}
                                                                            color={table?.heading?.bg_color}
                                                                            onChangeComplete={color =>
                                                                                this.setState({
                                                                                    property: {
                                                                                        ...this.state.property,
                                                                                        properties: {
                                                                                            ...this.state.property.properties,
                                                                                            table: {
                                                                                                ...this.state.property.properties.table,
                                                                                                heading: {
                                                                                                    ...this.state.property.properties.table.heading,
                                                                                                    bg_color: color.hex?.replace("#", "")
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                })
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="font-family font-st col-md-3">
                                                            <label>Heading Alignment</label>
                                                            <div className="font-select">
                                                                <select
                                                                    // className={`dropdown ${showErrorBorder && !total?.alignment ? "error-border" : ""}`}
                                                                    className="dropdown"
                                                                    name="tag"
                                                                    value={table?.heading?.alignment}
                                                                    onChange={e =>
                                                                        this.setState({
                                                                            property: {
                                                                                ...this.state.property,
                                                                                properties: {
                                                                                    ...this.state.property.properties,
                                                                                    table: {
                                                                                        ...this.state.property.properties.table,
                                                                                        heading: {
                                                                                            ...this.state.property.properties.table.heading,
                                                                                            alignment: e.target.value
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                >
                                                                    {" "}
                                                                    <option value="">Select</option>
                                                                    <option value={"left"}>Left</option>
                                                                    <option value={"center"}>Center</option>
                                                                    <option value={"right"}>Right</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="d-flex f-outer">
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Data Font Name </label>
                                                        <div className="font-select">
                                                            <select
                                                                // className={`dropdown ${showErrorBorder && !header.client.font_id ? "error-border" : ""}`}
                                                                className="dropdown"
                                                                value={table?.data?.font_id}
                                                                // name="font_id"
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            properties: {
                                                                                ...this.state.property.properties,
                                                                                table: {
                                                                                    ...this.state.property.properties.table,
                                                                                    data: {
                                                                                        ...this.state.property.properties.table.data,
                                                                                        font_id: e.target.value
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
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
                                                        <label>Data Font Size</label>
                                                        <div className={`input-ft-size`}>
                                                            <NumberFormat
                                                                value={table?.data?.font_size}
                                                                onValueChange={values =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            properties: {
                                                                                ...this.state.property.properties,
                                                                                table: {
                                                                                    ...this.state.property.properties.table,
                                                                                    data: {
                                                                                        ...this.state.property.properties.table.data,
                                                                                        font_size: values.floatValue
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                                allowNegative={false}
                                                                suffix=" Pt"
                                                                // className={`${
                                                                //     showErrorBorder && custom_legend?.show_legend && !total?.font_size
                                                                //         ? "error-border"
                                                                //         : ""
                                                                // }`}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="font-color font-st col-md-3">
                                                        <label>Data Font Color </label>
                                                        <div
                                                            // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                            className="dropdown"
                                                        >
                                                            <div
                                                                className="dropdown-toggle"
                                                                type="button"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        colorModalState:
                                                                            colorModalState === "table_custom_font_color"
                                                                                ? null
                                                                                : "table_custom_font_color"
                                                                    });
                                                                }}
                                                            >
                                                                <span>{table?.data?.font_color || "Select"}</span>
                                                                <span
                                                                    className="color-bx"
                                                                    style={{
                                                                        background: table?.data?.font_color ? `#${table?.data?.font_color}` : "#fff"
                                                                    }}
                                                                ></span>
                                                                <i aria-hidden="true" className="grey chevron down icon"></i>
                                                            </div>
                                                            {colorModalState === "table_custom_font_color" && (
                                                                <div className="z-index-10" style={{ position: "absolute" }}>
                                                                    <CompactPicker
                                                                        className="picker"
                                                                        colors={FONT_COLOR}
                                                                        color={table?.data?.font_color}
                                                                        onChangeComplete={color =>
                                                                            this.setState({
                                                                                property: {
                                                                                    ...this.state.property,
                                                                                    properties: {
                                                                                        ...this.state.property.properties,
                                                                                        table: {
                                                                                            ...this.state.property.properties.table,
                                                                                            data: {
                                                                                                ...this.state.property.properties.table.data,
                                                                                                font_color: color.hex?.replace("#", "")
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Data Alignment</label>
                                                        <div className="font-select">
                                                            <select
                                                                // className={`dropdown ${showErrorBorder && !total?.alignment ? "error-border" : ""}`}
                                                                className="dropdown"
                                                                name="tag"
                                                                value={table?.data?.alignment}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            properties: {
                                                                                ...this.state.property.properties,
                                                                                table: {
                                                                                    ...this.state.property.properties.table,
                                                                                    data: {
                                                                                        ...this.state.property.properties.table.data,
                                                                                        alignment: e.target.value
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            >
                                                                {" "}
                                                                <option value="">Select</option>
                                                                <option value={"left"}>Left</option>
                                                                <option value={"center"}>Center</option>
                                                                <option value={"right"}>Right</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="styles-sec">
                                                <div className="d-flex f-outer">
                                                    <div className="font-family font-st col-md-3">
                                                        <label>Sub Total Font Name </label>
                                                        <div className="font-select">
                                                            <select
                                                                // className={`dropdown ${showErrorBorder && !header.client.font_id ? "error-border" : ""}`}
                                                                className="dropdown"
                                                                value={table?.sub_total?.font_id}
                                                                // name="font_id"
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            properties: {
                                                                                ...this.state.property.properties,
                                                                                table: {
                                                                                    ...this.state.property.properties.table,
                                                                                    sub_total: {
                                                                                        ...this.state.property.properties.table.sub_total,
                                                                                        font_id: e.target.value
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
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
                                                        <label>Sub Total Font Size</label>
                                                        <div className={`input-ft-size`}>
                                                            <NumberFormat
                                                                value={table?.sub_total?.font_size}
                                                                onValueChange={values =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            properties: {
                                                                                ...this.state.property.properties,
                                                                                table: {
                                                                                    ...this.state.property.properties.table,
                                                                                    sub_total: {
                                                                                        ...this.state.property.properties.table.sub_total,
                                                                                        font_size: values.floatValue
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                                allowNegative={false}
                                                                suffix=" Pt"
                                                                // className={`${
                                                                //     showErrorBorder && custom_legend?.show_legend && !total?.font_size
                                                                //         ? "error-border"
                                                                //         : ""
                                                                // }`}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="font-color font-st col-md-3">
                                                        <label>Sub Total Font Color </label>
                                                        <div
                                                            // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                            className="dropdown"
                                                        >
                                                            <div
                                                                className="dropdown-toggle"
                                                                type="button"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        colorModalState:
                                                                            colorModalState === "table_subtotal_color" ? null : "table_subtotal_color"
                                                                    });
                                                                }}
                                                            >
                                                                <span>{table?.sub_total?.font_color || "Select"}</span>
                                                                <span
                                                                    className="color-bx"
                                                                    style={{
                                                                        background: table?.sub_total?.font_color
                                                                            ? `#${table?.sub_total?.font_color}`
                                                                            : "#fff"
                                                                    }}
                                                                ></span>
                                                                <i aria-hidden="true" className="grey chevron down icon"></i>
                                                            </div>
                                                            {colorModalState === "table_subtotal_color" && (
                                                                <div className="z-index-10" style={{ position: "absolute" }}>
                                                                    <CompactPicker
                                                                        className="picker"
                                                                        colors={FONT_COLOR}
                                                                        color={table?.sub_total?.font_color}
                                                                        onChangeComplete={color =>
                                                                            this.setState({
                                                                                property: {
                                                                                    ...this.state.property,
                                                                                    properties: {
                                                                                        ...this.state.property.properties,
                                                                                        table: {
                                                                                            ...this.state.property.properties.table,
                                                                                            sub_total: {
                                                                                                ...this.state.property.properties.table.sub_total,
                                                                                                font_color: color.hex?.replace("#", "")
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="font-color font-st col-md-3">
                                                        <label>Sub Total Background Color </label>
                                                        <div
                                                            // className={`dropdown ${showErrorBorder && !total?.color ? "error-border" : ""}`}
                                                            className="dropdown"
                                                        >
                                                            <div
                                                                className="dropdown-toggle"
                                                                type="button"
                                                                onClick={() => {
                                                                    this.setState({
                                                                        colorModalState:
                                                                            colorModalState === "table_sub_total_bg_color"
                                                                                ? null
                                                                                : "table_sub_total_bg_color"
                                                                    });
                                                                }}
                                                            >
                                                                <span>{table?.sub_total?.bg_color || "Select"}</span>
                                                                <span
                                                                    className="color-bx"
                                                                    style={{
                                                                        background: table?.sub_total?.bg_color
                                                                            ? `#${table?.sub_total?.bg_color}`
                                                                            : "#fff"
                                                                    }}
                                                                ></span>
                                                                <i aria-hidden="true" className="grey chevron down icon"></i>
                                                            </div>
                                                            {colorModalState === "table_sub_total_bg_color" && (
                                                                <div className="z-index-10" style={{ position: "absolute" }}>
                                                                    <CompactPicker
                                                                        className="picker"
                                                                        colors={FONT_COLOR}
                                                                        color={table?.sub_total?.bg_color}
                                                                        onChangeComplete={color =>
                                                                            this.setState({
                                                                                property: {
                                                                                    ...this.state.property,
                                                                                    properties: {
                                                                                        ...this.state.property.properties,
                                                                                        table: {
                                                                                            ...this.state.property.properties.table,
                                                                                            sub_total: {
                                                                                                ...this.state.property.properties.table.sub_total,
                                                                                                bg_color: color.hex?.replace("#", "")
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="font-family font-st col-md-3">
                                                        <label>Sub Total Alignment</label>
                                                        <div className="font-select">
                                                            <select
                                                                // className={`dropdown ${showErrorBorder && !total?.alignment ? "error-border" : ""}`}
                                                                className="dropdown"
                                                                name="tag"
                                                                value={table?.sub_total?.alignment}
                                                                onChange={e =>
                                                                    this.setState({
                                                                        property: {
                                                                            ...this.state.property,
                                                                            properties: {
                                                                                ...this.state.property.properties,
                                                                                table: {
                                                                                    ...this.state.property.properties.table,
                                                                                    sub_total: {
                                                                                        ...this.state.property.properties.table.sub_total,
                                                                                        alignment: e.target.value
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            >
                                                                {" "}
                                                                <option value="">Select</option>
                                                                <option value={"left"}>Left</option>
                                                                <option value={"center"}>Center</option>
                                                                <option value={"right"}>Right</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
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
                        <ReactTooltip id={`chart_property`} backgroundColor="#007bff" place="top" effect="solid" />
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </>
        );
    }
}
const mapStateToProps = state => {
    const { chartPropertyReducer, reportPropertyReducer } = state;
    return { chartPropertyReducer, reportPropertyReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions,
        ...reportPropertyActions
    })(Form)
);
