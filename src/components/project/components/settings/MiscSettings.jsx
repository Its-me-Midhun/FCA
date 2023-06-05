import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { debounce } from "lodash";
import NumberFormat from "react-number-format";
import LoadingOverlay from "react-loading-overlay";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import TableTopIcons from "../../../common/components/TableTopIcons";
import projectActions from "../../actions";
import { connect } from "react-redux";
import Loader from "../../../common/components/Loader";
import { reorderArray } from "../../../../config/utils";
import ConfirmationModal from "../../../common/components/ConfirmationModal";
import Portal from "../../../common/components/Portal";
import { BuildingFieldRows } from "./BuildingFieldRows";

const chartArray = ["trade", "system", "category", "building", "funding_source", "priority", "EFCI", "criticalities", "capital_types"];
const buildingAdditionalFields = [
    {
        label: "Building Primary Uses",
        key: "primary_uses"
    },
    {
        label: "Building Secondary Uses",
        key: "secondary_uses"
    },
    {
        label: "Building Sectors",
        key: "sectors"
    },
    {
        label: "Building Internal Groups",
        key: "internal_groups"
    },
    {
        label: "Building Divisions",
        key: "divisions"
    }
];
class MiscSettings extends Component {
    state = {
        isLoading: false,
        settings: {
            display_unit: false,
            map_view: "silver",
            dashboard_view: "fci chart",
            priority_required: false,
            addition_required: false,
            funding_required: false,
            asset_tag_required: false,
            serial_number_required: false,
            reco_length: "",
            img_length: "",
            chart_display_order: chartArray,
            show_energy_band: false,
            show_water_band: false,
            project_total_required: false,
            criticality_score: "priority",
            divisions: [""],
            primary_uses: [""],
            secondary_uses: [""],
            sectors: [""],
            internal_groups: [""]
        },
        dbvalue: "",
        showOverwriteConfirmation: false,
        selectedValue: { name: "", value: "" }
    };

    componentDidMount = async () => {
        this.setState({ isLoading: true });

        await this.props.getMiscSettings(this.props.match.params.id);
        const {
            miscellaneous: {
                display_unit,
                map_view,
                dashboard_view,
                priority_required = false,
                addition_required = false,
                funding_required = false,
                asset_tag_required = false,
                serial_number_required = false,
                reco_length,
                img_length,
                chart_display_order = [],
                show_energy_band = false,
                show_water_band = false,
                project_total_required = false,
                criticality_score = "priority",
                divisions = [""],
                primary_uses = [""],
                secondary_uses = [""],
                sectors = [""],
                internal_groups = [""]
            }
        } = this.props.projectReducer.miscSettingsResponse;

        let newChartArray = [];
        if (chart_display_order?.length) {
            let newItems = chartArray.filter(item => !chart_display_order.includes(item));
            newChartArray = [...chart_display_order, ...newItems];
        }
        this.setState({
            settings: {
                display_unit: !!display_unit,
                map_view: map_view || "silver",
                dashboard_view: dashboard_view || "fci chart",
                priority_required: priority_required,
                addition_required: addition_required,
                funding_required: funding_required,
                asset_tag_required: asset_tag_required,
                serial_number_required: serial_number_required,
                reco_length: reco_length || "",
                img_length: img_length || "",
                chart_display_order: newChartArray,
                show_energy_band,
                show_water_band,
                project_total_required,
                criticality_score,
                divisions,
                primary_uses,
                secondary_uses,
                sectors,
                internal_groups
            }
        });
        this.setState({ isLoading: false });
    };
    handleClick = async (name, value) => {
        this.setState(
            {
                settings: {
                    ...this.state.settings,
                    [name]: value
                }
            },
            () => {
                this.props.updateMiscSettings(this.props.match.params.id, { miscellaneous: this.state.settings });
            }
        );
    };

    debouncedSave = debounce(() => {
        this.props.updateMiscSettings(this.props.match.params.id, { miscellaneous: this.state.settings });
    }, 1000);

    recommendationClick = async (value, name) => {
        await this.setState({
            settings: {
                ...this.state.settings,
                [name]: value
            }
        });

        this.debouncedSave();
    };
    imageClick = async (value, name) => {
        await this.setState({
            settings: {
                ...this.state.settings,
                [name]: value
            }
        });

        this.debouncedSave();
    };

    onEnd = result => {
        if (!result.destination) {
            return;
        }
        const keyList = reorderArray(this.state.settings.chart_display_order, result.source.index, result.destination.index);
        this.setState(
            {
                settings: {
                    ...this.state.settings,
                    chart_display_order: keyList
                }
            },
            () => {
                this.debouncedSave();
            }
        );
    };

    getDisplayName = key => {
        switch (key) {
            case "trade":
                return "Trade";
            case "category":
                return "Category";
            case "building":
                return "Child Entity";
            case "funding_source":
                return "Funding Source";
            case "priority":
                return "Term";
            case "EFCI":
                return "CSP & EFCI";
            case "criticalities":
                return "Criticality";
            case "capital_types":
                return "Capital Type";
            case "system":
                return "System";
            default:
                break;
        }
    };

    confirmOverwrites = (name, value) => {
        this.setState({ showOverwriteConfirmation: true, selectedValue: { name, value } });
    };

    onOverwriteConfirm = () => {
        this.setState({ showOverwriteConfirmation: false });
        const {
            selectedValue: { name, value }
        } = this.state;
        this.handleClick(name, value);
    };

    renderOverwriteConfirmation = () => {
        const { showOverwriteConfirmation } = this.state;
        if (!showOverwriteConfirmation) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Changing criticality calculation method will OVERWRITE any existing recommendation data"}
                        message={"This action cannot be undone.Are you sure you want to continue?"}
                        onNo={() => this.setState({ showOverwriteConfirmation: false })}
                        onYes={this.onOverwriteConfirm}
                        type={"load"}
                    />
                }
                onCancel={() => this.setState({ showOverwriteConfirmation: false })}
            />
        );
    };

    handleChangeDynamicFields = (field, action = "add", index) => {
        const { settings } = this.state;
        if (action === "add") {
            this.setState({ settings: { ...settings, [field]: settings[field] ? [...settings[field], ""] : [""] } });
        } else {
            const newField = settings[field].filter((elem, idx) => idx !== index);
            this.setState({ settings: { ...settings, [field]: newField } });
        }
        this.debouncedSave();
    };
    handleChangeDynamicFieldValue = (field, value, index) => {
        const { settings } = this.state;
        settings[field][index] = value;
        this.setState({ settings });
        this.debouncedSave();
    };
    render() {
        const {
            settings: {
                display_unit,
                map_view,
                dashboard_view,
                // priority_required,
                show_energy_band,
                show_water_band,
                addition_required,
                funding_required,
                reco_length,
                img_length,
                chart_display_order,
                asset_tag_required,
                serial_number_required,
                project_total_required,
                criticality_score,
                primary_uses,
                divisions,
                secondary_uses,
                sectors,
                internal_groups
            },
            isLoading
        } = this.state;

        return (
            <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                <div className="table-top-menu allign-right">
                    <div className="rgt">
                        <TableTopIcons
                            hasGlobalSearch={false}
                            hasSort={false}
                            hasWildCardFilter={false}
                            hasView={false}
                            isExport={false}
                            hasHelp={true}
                            entity="miscellaneous"
                        />
                    </div>
                </div>
                <div className="table-section table-scroll build-fci seting-type table-froze overflow-hght" id={"miscCont"}>
                    <table className="table table-common project-settings-building-type-table">
                        <thead>
                            <tr>
                                <th className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </th>
                                <th className="build-add">Type</th>
                                <th className="build-add">Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </td>
                                <td>Display Unit</td>
                                <td className="fy-dtl">
                                    <div className="button-group" style={{ margin: "initial" }}>
                                        <div className="yes-button">
                                            <RadioInput
                                                label="Yes"
                                                value={true}
                                                name="display_unit"
                                                checked={display_unit}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                        <div className="no-button">
                                            <RadioInput
                                                label="No"
                                                value={false}
                                                name="display_unit"
                                                checked={display_unit}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </td>
                                <td>Map View</td>
                                <td className="fy-dtl">
                                    <div className="button-group" style={{ margin: "initial" }}>
                                        <div className="yes-button">
                                            <RadioInput label="Silver" value="silver" name="map_view" checked={map_view} setter={this.handleClick} />
                                        </div>
                                        <div className="yes-button ml-2">
                                            <RadioInput
                                                label="Default"
                                                value="default"
                                                name="map_view"
                                                checked={map_view}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                        <div className="yes-button ml-2">
                                            <RadioInput
                                                label="Nigh Mode"
                                                value="night"
                                                name="map_view"
                                                checked={map_view}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                        <div className="no-button">
                                            <RadioInput label="Retro" value="retro" name="map_view" checked={map_view} setter={this.handleClick} />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </td>
                                <td>Dashboard View</td>
                                <td className="fy-dtl">
                                    <div className="button-group" style={{ margin: "initial" }}>
                                        <div className="yes-button">
                                            <RadioInput
                                                label="FCI Chart"
                                                value="fci chart"
                                                name="dashboard_view"
                                                checked={dashboard_view}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                        <div className="no-button ">
                                            <RadioInput
                                                label="Budget Priority"
                                                value="budget priority"
                                                name="dashboard_view"
                                                checked={dashboard_view}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </td>
                                <td>Criticality Scoring System</td>
                                <td className="fy-dtl">
                                    <div className="button-group" style={{ margin: "initial" }}>
                                        <div className="yes-button">
                                            <RadioInput
                                                label="By Priority"
                                                value="priority"
                                                name="criticality_score"
                                                checked={criticality_score}
                                                setter={this.confirmOverwrites}
                                            />
                                        </div>
                                        <div className="no-button ">
                                            <RadioInput
                                                label="By Year"
                                                value="year"
                                                name="criticality_score"
                                                checked={criticality_score}
                                                setter={this.confirmOverwrites}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </td>
                                <td>Show Energy Band</td>
                                <td className="fy-dtl">
                                    <div className="button-group" style={{ margin: "initial" }}>
                                        <div className="yes-button">
                                            <RadioInput
                                                label="Yes"
                                                value={true}
                                                name="show_energy_band"
                                                checked={show_energy_band}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                        <div className="no-button">
                                            <RadioInput
                                                label="No"
                                                value={false}
                                                name="show_energy_band"
                                                checked={show_energy_band}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </td>
                                <td>Show Water Band</td>
                                <td className="fy-dtl">
                                    <div className="button-group" style={{ margin: "initial" }}>
                                        <div className="yes-button">
                                            <RadioInput
                                                label="Yes"
                                                value={true}
                                                name="show_water_band"
                                                checked={show_water_band}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                        <div className="no-button">
                                            <RadioInput
                                                label="No"
                                                value={false}
                                                name="show_water_band"
                                                checked={show_water_band}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </td>
                                <td>Project Total Required</td>
                                <td className="fy-dtl">
                                    <div className="button-group" style={{ margin: "initial" }}>
                                        <div className="yes-button">
                                            <RadioInput
                                                label="Yes"
                                                value={true}
                                                name="project_total_required"
                                                checked={project_total_required}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                        <div className="no-button">
                                            <RadioInput
                                                label="No"
                                                value={false}
                                                name="project_total_required"
                                                checked={project_total_required}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </td>
                                <td>Addition Required</td>
                                <td className="fy-dtl">
                                    <div className="button-group" style={{ margin: "initial" }}>
                                        <div className="yes-button">
                                            <RadioInput
                                                label="Yes"
                                                value={true}
                                                name="addition_required"
                                                checked={addition_required}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                        <div className="no-button">
                                            <RadioInput
                                                label="No"
                                                value={false}
                                                name="addition_required"
                                                checked={addition_required}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </td>
                                <td>Funding Required</td>
                                <td className="fy-dtl">
                                    <div className="button-group" style={{ margin: "initial" }}>
                                        <div className="yes-button">
                                            <RadioInput
                                                label="Yes"
                                                value={true}
                                                name="funding_required"
                                                checked={funding_required}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                        <div className="no-button">
                                            <RadioInput
                                                label="No"
                                                value={false}
                                                name="funding_required"
                                                checked={funding_required}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </td>
                                <td>Asset Tag Required</td>
                                <td className="fy-dtl">
                                    <div className="button-group" style={{ margin: "initial" }}>
                                        <div className="yes-button">
                                            <RadioInput
                                                label="Yes"
                                                value={true}
                                                name="asset_tag_required"
                                                checked={asset_tag_required}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                        <div className="no-button">
                                            <RadioInput
                                                label="No"
                                                value={false}
                                                name="asset_tag_required"
                                                checked={asset_tag_required}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </td>
                                <td>Serial Number Required</td>
                                <td className="fy-dtl">
                                    <div className="button-group" style={{ margin: "initial" }}>
                                        <div className="yes-button">
                                            <RadioInput
                                                label="Yes"
                                                value={true}
                                                name="serial_number_required"
                                                checked={serial_number_required}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                        <div className="no-button">
                                            <RadioInput
                                                label="No"
                                                value={false}
                                                name="serial_number_required"
                                                checked={serial_number_required}
                                                setter={this.handleClick}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </td>
                                <td>Recommendation Length</td>
                                <td className="fy-dtl">
                                    <div className="button-group" style={{ margin: "initial" }}>
                                        <NumberFormat
                                            autoComplete={"nope"}
                                            className="custom-input form-control"
                                            // placeholder="CRV"
                                            name="recommendation_length"
                                            value={parseInt(reco_length)}
                                            displayType={"input"}
                                            onValueChange={(values, sourceInfo) =>
                                                sourceInfo?.source !== "prop" && this.recommendationClick(values.value, "reco_length")
                                            }
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </td>
                                <td>Image Caption Length</td>
                                <td className="fy-dtl">
                                    <div className="button-group" style={{ margin: "initial" }}>
                                        <NumberFormat
                                            autoComplete={"nope"}
                                            className="custom-input form-control"
                                            // placeholder="CRV"
                                            name="imagecaption_length"
                                            value={parseInt(img_length)}
                                            displayType={"input"}
                                            onValueChange={(values, sourceInfo) =>
                                                sourceInfo?.source !== "prop" && this.imageClick(values.value, "img_length")
                                            }
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </td>
                                <td>Charts & Graphs Display Order</td>
                                <td className="chart-order-td">
                                    <DragDropContext onDragEnd={this.onEnd}>
                                        <Droppable droppableId="droppable" direction="horizontal">
                                            {provided => (
                                                <div class="container" ref={provided.innerRef}>
                                                    <div class="row">
                                                        {chart_display_order.slice(0, 3).map((item, i) => (
                                                            <Draggable key={i} draggableId={`draggable-${i}`} index={i}>
                                                                {provided => {
                                                                    return (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            key={`draggable-${i}`}
                                                                            class="col-4 chart-order-cont"
                                                                        >
                                                                            {this.getDisplayName(item)}
                                                                            <span className="chart-order-drag-icon">
                                                                                <img src="/img/Group 2.svg" alt="" />
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                }}
                                                            </Draggable>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </Droppable>
                                        <Droppable droppableId="droppable1" direction="horizontal">
                                            {provided => (
                                                <div class="container" ref={provided.innerRef}>
                                                    <div class="row">
                                                        {chart_display_order.slice(3, 6).map((item, i) => (
                                                            <Draggable key={i + 3} draggableId={`draggable-${i + 3}`} index={i + 3}>
                                                                {provided => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        key={`draggable-${i + 3}`}
                                                                        class="col-4 chart-order-cont"
                                                                    >
                                                                        {this.getDisplayName(item)}
                                                                        <span className="chart-order-drag-icon">
                                                                            <img src="/img/Group 2.svg" alt="" />
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </Droppable>
                                        <Droppable droppableId="droppable2" direction="horizontal">
                                            {provided => (
                                                <div class="container" ref={provided.innerRef}>
                                                    <div class="row">
                                                        {chart_display_order.slice(6, 9).map((item, i) => (
                                                            <Draggable key={i + 6} draggableId={`draggable-${i + 6}`} index={i + 6}>
                                                                {provided => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        key={`draggable-${i + 6}`}
                                                                        class="col-4 chart-order-cont"
                                                                    >
                                                                        {this.getDisplayName(item)}
                                                                        <span className="chart-order-drag-icon">
                                                                            <img src="/img/Group 2.svg" alt="" />
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </td>
                            </tr>
                            {buildingAdditionalFields.map(elem => (
                                <BuildingFieldRows
                                    label={elem.label}
                                    field={elem.key}
                                    options={this.state.settings?.[elem.key] || []}
                                    handleChangeDynamicFieldValue={this.handleChangeDynamicFieldValue}
                                    handleChangeDynamicFields={this.handleChangeDynamicFields}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
                {this.renderOverwriteConfirmation()}
            </LoadingOverlay>
        );
    }
}

const RadioInput = ({ label, value, name, checked, setter }) => {
    return (
        <label className="container">
            <input type="radio" checked={checked === value} onChange={() => setter(name, value)} />
            <span className="checkmark"></span>
            {label}
        </label>
    );
};

const mapStateToProps = state => {
    const { projectReducer } = state;
    return { projectReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...projectActions
    })(MiscSettings)
);
