import React, { Component } from "react";
import { connect } from "react-redux";
import regionActions from "../actions";
import RegionListItem from "./RegionListItem";
import Loader from "../../common/components/Loader";

class ViewAllUsers extends Component {
    state = {
        isLoading: true,
        errorMessage: ""
    };

    render() {
        const { isLoading } = this.state;
        const { onCancel, users } = this.props;
        return (
            <React.Fragment>
                <tr>
                    <td colSpan="6" className="viewImg text-center">
                        <div className="txt-cont">
                            {users.length ? (
                                users.map((item, i) => (
                                    <span key={i} className="badge-otr">
                                        <img alt="" src="/img/user-icon.png" />
                                        <span className="nme">
                                            {" "}
                                            {item.name}{" "}
                                            <span aria-hidden="true">
                                                <img src="img/close.svg" alt="" />
                                            </span>
                                        </span>
                                    </span>
                                ))
                            ) : (
                                <div>No users selected</div>
                            )}
                        </div>
                        <div className="view-all">View All</div>
                    </td>
                </tr>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { regionReducer } = state;
    return { regionReducer };
};

export default connect(mapStateToProps, { ...regionActions })(ViewAllUsers);
