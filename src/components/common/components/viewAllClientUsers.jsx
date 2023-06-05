import React, { Component } from "react";
import Highlighter from "react-highlight-words";

class ViewAllUsers extends Component {
    state = {
        isLoading: true,
        errorMessage: ""
    };

    render() {
        const { isLoading } = this.state;
        const { users, colSpan, globalSearchKey, client_users, isViewClient } = this.props;
        return (
            <React.Fragment>
                {!isViewClient ? <tr>
                    <td colSpan={colSpan} className="viewImg text-center">
                        <div className="txt-cont">
                            {/* {users.length ? (
                                users.map((item, i) => (
                                    <span key={i} className="badge-otr">
                                        <img alt="" src="/img/user-icon.png" />
                                        <span className="nme">
                                            <Highlighter searchWords={[globalSearchKey]} textToHighlight={item.name} />
                                        </span>
                                    </span>
                                ))
                            ) : (
                                    <div>No users selected</div>
                                )} */}
                            {client_users.length ? (
                                client_users.map((item, i) => (
                                    <span key={i} className="badge-otr">
                                        <img alt="" src={`${item.url ? item.url : "/img/user-icon.png"}`} />
                                        <span className="nme">
                                            <Highlighter searchWords={[globalSearchKey]} textToHighlight={item.name} />
                                        </span>
                                    </span>
                                ))
                            ) : (
                                    <div>No users selected</div>
                                )}
                        </div>
                        <div className="view-all">View All</div>
                    </td>
                </tr> : null}
            </React.Fragment>
        );
    }
}

export default ViewAllUsers;
