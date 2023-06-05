import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import userActions from "../actions";
import { connect } from "react-redux";
import LoadingOverlay from "react-loading-overlay";
import Loader from "../../common/components/Loader";
import masterSystemActions from "../../master_system/actions";
class MiscSettings extends Component {
    state = {
        isLoading: false
    };

    componentDidMount = async () => {
        await this.props.getTradeDropdown();
    };
    handleChange = async e => {
        const { name, value } = e.target;
        const {
            basicDetails: { client, consultancy, group }
        } = this.props;
        this.props.handleChangeBasicDetails(name, value);
        this.props.updateUser(
            {
                master_trade_id: value,
                client_id: client?.id,
                consultancy_id: consultancy?.id,
                group_id: group?.id
            },
            this.props.match.params.id
        );
    };
    render() {
        const { isLoading } = this.state;
        const {
            masterSystemReducer: { getTradeDropdownResponse },
            basicDetails: { master_trade_id }
        } = this.props;
        return (
            <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                <div className={`dtl-sec floor-detail setting-option-tbl-otr`}>
                    <div className="table-top-menu allign-right"></div>
                    <div className="table-section table-scroll build-fci seting-type table-froze overflow-hght">
                        <table className="table table-common project-settings-building-type-table">
                            <thead>
                                <tr>
                                    <th className="img-sq-box">
                                        <img alt="" src="/img/sq-box.png" />
                                    </th>
                                    <th className="build-add">Type</th>
                                    <th className="build-add option-th">Option</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="img-sq-box">
                                        <img alt="" src="/img/sq-box.png" />
                                    </td>
                                    <td>Default Trade</td>
                                    <td className="fy-dtl">
                                        <div className="form-group">
                                            <div className={`custom-selecbox select-opt-tble`}>
                                                <select
                                                    autoComplete={"nope"}
                                                    name="master_trade_id"
                                                    value={master_trade_id}
                                                    onChange={e => this.handleChange(e)}
                                                >
                                                    <option value="">Select</option>
                                                    {getTradeDropdownResponse?.list?.length > 0 &&
                                                        getTradeDropdownResponse?.list?.map(item => (
                                                            <option value={item.id} key={item.id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { userReducer, masterSystemReducer } = state;
    return { userReducer, masterSystemReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...userActions,
        ...masterSystemActions
    })(MiscSettings)
);
