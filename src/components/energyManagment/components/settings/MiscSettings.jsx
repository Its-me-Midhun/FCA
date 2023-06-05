import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import TableTopIcons from "../../../common/components/TableTopIcons";
import projectActions from "../../actions";
import { connect } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../../common/components/Loader";
class MiscSettings extends Component {
    state = {
        isLoading: false,
        settings: {
            display_unit: false,
            map_view: "silver",
            dashboard_view: "fci chart"
        }
    };

    componentDidMount = async () => {
        this.setState({ isLoading: true });
        await this.props.getMiscSettings(this.props.match.params.id);
        const {
            miscellaneous: { display_unit, map_view, dashboard_view }
        } = this.props.projectReducer.miscSettingsResponse;
        this.setState({ settings: { display_unit: !!display_unit, map_view: map_view || "silver", dashboard_view: dashboard_view || "fci chart" } });
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
    render() {
        const {
            settings: { display_unit, map_view, dashboard_view },
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
                <div className="table-section table-scroll build-fci seting-type table-froze overflow-hght">
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
                        </tbody>
                    </table>
                </div>
            </LoadingOverlay>
        );
    }
}

const RadioInput = ({ label, value, name, checked, setter }) => {
    return (
        <label className="container">
            <input type="radio" checked={checked == value} onChange={() => setter(name, value)} />
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
