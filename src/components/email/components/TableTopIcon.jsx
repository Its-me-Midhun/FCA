import React, { Component } from "react";
import PropTypes from "prop-types";
import Portal from "../../common/components/Portal";
import EmailSendModal from "./EmailSendModal";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import actions from "../actions";
class TableTopIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showComposeModal: false
        };
    }
    toggleCompose = () => {
        const { showComposeModal } = this.state;
        console.log(this.state.showComposeModal);
        this.setState({ showComposeModal: !showComposeModal });
    };
    toggleComposeModal = () => {
        const { showComposeModal } = this.state;
        console.log(showComposeModal);
        if (!showComposeModal) return null;

        return (
            <Portal
                body={
                    <EmailSendModal
                        onCancel={() => this.setState({ showComposeModal: false })}
                        entity={"Email"}
                        reportParams={null}
                        tableParams={null}
                        hasAttachment={true}
                        refreshMails={this.getEmailData}
                    />
                }
                onCancel={() => this.setState({ showComposeModal: false })}
            />
        );
    };

    render() {
        return (
            <React.Fragment>
                <div class="table-top-menu">
                    <div class="lft">
                        <h3 class="page-hed">Inbox</h3>
                    </div>
                    <div class="rgt">
                        <div class="search-inbox-area">
                            <button class="btn refresh-btn">
                                <img src="/img/refresh-button-inbox.svg" />
                            </button>

                            <div class="search-form">
                                <input type="text" class="form-control" placeholder="Search Mailbox" />
                              
                            </div>
                        </div>
                    </div>
                </div>
                {this.toggleComposeModal()}
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    const { emailReducer } = state;
    return { emailReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(TableTopIcon));
