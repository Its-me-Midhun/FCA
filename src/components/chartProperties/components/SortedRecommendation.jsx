import React, { Component } from "react";
import { CompactPicker } from "react-color";
import NumberFormat from "react-number-format";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import qs from "query-string";
import actions from "../actions";
import reportPropertyActions from "../../reportProperties/actions";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
let initial_state = {
    recommendation_props: {
        body: {
            font_size: 9,
            font_id: "",
            font_colour:"",
            background_colour:""
        },
        site: {
            font_size: 12,
            font_id: "",
            font_colour:"",
            background_colour:""
        },
        addition: {
            font_size: 10,
            font_id: "",
            font_colour:"",
            background_colour:""
        },
        building: {
            font_size: 11,
            font_id: "",
            font_colour:"",
            background_colour:""
        },
        grand_total: {
            font_size: 13,
            font_id: "",
            font_colour:"",
            background_colour:""
        },
        table_style: {
            style_id: ""
        },
        table_heading: {
            font_size: 13,
            font_id: "",
            font_colour:"",
            background_colour:""
        },
        custom_heading: {
            font_size: 14,
            font_id: "",
            font_colour:"",
            background_colour:""
        }
    }
};
export class SortedRecommendation extends Component {
    state = {
        showErrorBorder: false,
        recommendation_props: initial_state,
        colorModalState: null,
        activeDetail: "Chart",
        initialValues: {}
    };

    componentDidMount = async () => {
        this.props.getDropdownList("fonts");
        this.props.getDropdownList("table_styles");
        if (this.props.selectedProperty) {
            let propertyData = await this.props.getPropertyDataById();
            await this.setState({
                // properties: propertyData.properties,

                recommendation_props: {
                    ...propertyData.recommendation_props,
                    body: {
                        ...this.recommendation_props.body,
                        ...propertyData?.recommendation_props?.body
                    },
                    site: {
                        ...this.recommendation_props.site,
                        ...propertyData?.recommendation_props?.site
                    },
                    addition: {
                        ...this.recommendation_props.addition,
                        ...propertyData?.recommendation_props?.addition
                    },
                    building: {
                        ...this.recommendation_props.building,
                        ...propertyData?.recommendation_props?.building
                    },
                    grand_total: {
                        ...this.recommendation_props.grand_total,
                        ...propertyData?.recommendation_props?.grand_total
                    },
                    table_style: {
                        ...this.recommendation_props.table_style,
                        ...propertyData?.recommendation_props?.table_style
                    },
                    table_heading: {
                        ...this.recommendation_props.table_heading,
                        ...propertyData?.recommendation_props?.table_style
                    },
                    custom_heading: {
                        ...this.recommendation_props.custom_heading,
                        ...propertyData?.recommendation_props?.table?.custom_heading
                    }
                }
            });
        } else {
            const {
                location: { search }
            } = this.props;
            const query = qs.parse(search);
            await this.setState({ recommendation_props: { ...this.state.recommendation_props, client_id: query?.client_id || "" } });
        }
        this.setState({ initialValues: _.cloneDeep(this.state.recommendation_props) });
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
        // if (this.validate()) {
        //     if (this.props.selectedProperty) {
        //         console.log("property", this.state.property);
        //         this.props.handleUpdateProperty(this.state.property);
        //     } else {
        //         this.props.handleAddProperty(this.state.property);
        //     }
        // }
    };

    cancelForm = () => {
        if (_.isEqual(this.state.initialValues, this.state.recommendation_props)) {
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

    render() {
        const { recommendation_props } = this.state;
        const {
            dropDownList: { fonts: FONT_FAMILY, table_styles: TABLE_STYLE }
        } = this.props.reportPropertyReducer;
        const { custom_heading, addition, site, body, building, grand_total, table_heading, table_style } = recommendation_props;

        return (
            <div className="styles-box">
                <h2>Table Recommendation Properties (Chart Data Export Only)</h2>

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
                                            recommendation_props: {
                                                ...this.state.recommendation_props,
                                                table_style: {
                                                    ...this.state.recommendation_props.table_style,
                                                    style_id: e.target.value
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
                            <label>Table Body Font Family</label>
                            <div className={`input-ft-size`}>
                                <NumberFormat
                                    value={body?.font_size}
                                    onValueChange={values =>
                                        this.setState({
                                            recommendation_props: {
                                                ...this.state.recommendation_props,
                                                body: {
                                                    ...this.state.recommendation_props.body,

                                                    font_size: values.floatValue
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
                        <div className="font-family font-st col-md-3">
                            <label>Table body Font family </label>
                            <div className="font-select">
                                <select
                                    // className={`dropdown ${
                                    //     showErrorBorder && custom_legend?.show_legend && !total?.font_id
                                    //         ? "error-border"
                                    //         : ""
                                    // }`}
                                    className="dropdown"
                                    value={body?.font_id || "-"}
                                    // // name="table_style"
                                    onChange={e =>
                                        this.setState({
                                            recommendation_props: {
                                                ...this.state.recommendation_props,
                                                body: {
                                                    ...this.state.recommendation_props.body,

                                                    font_id: e.target.value
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
                            <label>Table Heading Font Size</label>
                            <div className={`input-ft-size`}>
                                <NumberFormat
                                    value={table_heading?.font_size}
                                    onValueChange={values =>
                                        this.setState({
                                            recommendation_props: {
                                                ...this.state.recommendation_props,
                                                table_heading: {
                                                    ...this.state.recommendation_props.table_heading,

                                                    font_size: values.floatValue
                                                }
                                            }
                                        })
                                    }
                                    allowNegative={false}
                                    suffix=" Pt"
                                />
                            </div>
                        </div>
                        <div className="font-family font-st col-md-3">
                            <label>Table Heading Font Family </label>
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
                                            recommendation_props: {
                                                ...this.state.recommendation_props,
                                                table_heading: {
                                                    ...this.state.recommendation_props.table_heading,
                                                    font_id: e.target.value
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
                            <label>Table Custom Heading Font Size</label>
                            <div className={`input-ft-size`}>
                                <NumberFormat
                                    value={custom_heading?.font_size}
                                    onValueChange={values =>
                                        this.setState({
                                            recommendation_props: {
                                                ...this.state.recommendation_props,
                                                table_heading: {
                                                    ...this.state.recommendation_props.custom_heading,

                                                    font_size: values.floatValue
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

                        <div className="font-family font-st col-md-3">
                            <label>Table Custom Heading Font Family</label>
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
                                            recommendation_props: {
                                                ...this.state.recommendation_props,
                                                custom_heading: {
                                                    ...this.state.recommendation_props.custom_heading,
                                                    font_id: e.target.value
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
                            <label>Site Font Size</label>
                            <div className={`input-ft-size`}>
                                <NumberFormat
                                    value={site?.font_size}
                                    onValueChange={values =>
                                        this.setState({
                                            recommendation_props: {
                                                ...this.state.recommendation_props,
                                                site: {
                                                    ...this.state.recommendation_props.site,

                                                    font_size: values.floatValue
                                                }
                                            }
                                        })
                                    }
                                    allowNegative={false}
                                    suffix=" Pt"
                                />
                            </div>
                        </div>

                        <div className="font-family font-st col-md-3">
                            <label>Site Font Family </label>
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
                                            recommendation_props: {
                                                ...this.state.recommendation_props,
                                                site: {
                                                    ...this.state.recommendation_props.site,

                                                    font_id: e.target.value
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
                                            recommendation_props: {
                                                ...this.state.recommendation_props,
                                                building: {
                                                    ...this.state.recommendation_props.building,

                                                    font_size: values.floatValue
                                                }
                                            }
                                        })
                                    }
                                    allowNegative={false}
                                    suffix=" Pt"
                                />
                            </div>
                        </div>
                        <div className="font-family font-st col-md-3">
                            <label>Building Font Family </label>
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
                                            recommendation_props: {
                                                ...this.state.recommendation_props,
                                                building: {
                                                    ...this.state.recommendation_props.building,

                                                    font_id: e.target.value
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
                                            recommendation_props: {
                                                ...this.state.recommendation_props,
                                                site: {
                                                    ...this.state.recommendation_props.addition,

                                                    font_size: values.floatValue
                                                }
                                            }
                                        })
                                    }
                                    allowNegative={false}
                                    suffix=" Pt"
                                />
                            </div>
                        </div>
                        <div className="font-family font-st col-md-3">
                            <label>Addition Font Family </label>
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
                                            recommendation_props: {
                                                ...this.state.recommendation_props,
                                                addition: {
                                                    ...this.state.recommendation_props.addition,

                                                    font_id: e.target.value
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
                                            recommendation_props: {
                                                ...this.state.recommendation_props,
                                                grand_total: {
                                                    ...this.state.recommendation_props.grand_total,

                                                    font_size: values.floatValue
                                                }
                                            }
                                        })
                                    }
                                    allowNegative={false}
                                    suffix=" Pt"
                                />
                            </div>
                        </div>
                        <div className="font-family font-st col-md-3">
                            <label>Grand Total Font Family </label>
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
                                            recommendation_props: {
                                                ...this.state.recommendation_props,
                                                grand_total: {
                                                    ...this.state.recommendation_props.grand_total,

                                                    font_id: e.target.value
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
                    </div>
                </div>
            </div>
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
    })(SortedRecommendation)
);

// export default SortedRecommendation;
