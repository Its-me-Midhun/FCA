import React, { Component } from "react";
import PropTypes from "prop-types";
import Portal from "../../common/components/Portal";
import EmailSendModal from "./EmailSendModal";

class LeftSideMenue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showComposeModal: false
        };
    }
    toggleCompose = () => {
        const { showComposeModal } = this.state;

        this.setState({ showComposeModal: !showComposeModal });
    };
    toggleComposeModal = () => {
        const { showComposeModal } = this.state;

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
                <div class="dtl-in-tab">
                    <button class="btn btn-compos" onClick={this.toggleCompose}>
                        Compose
                    </button>
                    <ul class="mail-tabs">
                        <li class={`${this.props.section == "inbox" ? "active" : ""}`} onClick={() => this.props.getSection("inbox")}>
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                    <g id="vuesax_linear_sms" data-name="vuesax/linear/sms" transform="translate(-556 -250)">
                                        <g id="sms" transform="translate(556 250)">
                                            <path
                                                id="Vector"
                                                d="M12.5,14.167H4.167C1.667,14.167,0,12.917,0,10V4.167C0,1.25,1.667,0,4.167,0H12.5c2.5,0,4.167,1.25,4.167,4.167V10C16.667,12.917,15,14.167,12.5,14.167Z"
                                                transform="translate(1.667 2.917)"
                                                fill="none"
                                                stroke="#fff"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                            />
                                            <path
                                                id="Vector-2"
                                                data-name="Vector"
                                                d="M8.333,0,5.725,2.083a2.638,2.638,0,0,1-3.125,0L0,0"
                                                transform="translate(5.833 7.5)"
                                                fill="none"
                                                stroke="#878787"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                            />
                                            <path id="Vector-3" data-name="Vector" d="M0,0H20V20H0Z" fill="none" opacity="0" />
                                        </g>
                                    </g>
                                </svg>

                                <span>  Inbox</span>
                            </a>
                        </li>
                        <li class={`${this.props.section == "sent" ? "active" : ""}`} onClick={() => this.props.getSection("sent")}>
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                    <g id="vuesax_linear_sms-tracking" data-name="vuesax/linear/sms-tracking" transform="translate(-620 -250)">
                                        <g id="sms-tracking" transform="translate(620 250)">
                                            <path
                                                id="Vector"
                                                d="M0,4.162C0,1.249,1.666,0,4.165,0h8.329c2.5,0,4.165,1.249,4.165,4.162V9.99c0,2.914-1.666,4.162-4.165,4.162H4.165"
                                                transform="translate(1.671 2.924)"
                                                fill="none"
                                                stroke="#878787"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                            />
                                            <path
                                                id="Vector-2"
                                                data-name="Vector"
                                                d="M8.354,0,5.74,2.089a2.645,2.645,0,0,1-3.133,0L0,0"
                                                transform="translate(5.823 7.497)"
                                                fill="none"
                                                stroke="#878787"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                            />
                                            <path
                                                id="Vector-3"
                                                data-name="Vector"
                                                d="M0,0H5.013"
                                                transform="translate(1.671 13.75)"
                                                fill="none"
                                                stroke="#878787"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                            />
                                            <path
                                                id="Vector-4"
                                                data-name="Vector"
                                                d="M0,0H2.506"
                                                transform="translate(1.671 10.417)"
                                                fill="none"
                                                stroke="#878787"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                            />
                                            <path id="Vector-5" data-name="Vector" d="M0,0H20V20H0Z" fill="none" opacity="0" />
                                        </g>
                                    </g>
                                </svg>
                                <span>  Sent</span>
                            </a>
                        </li>
                        <li class={`${this.props.section == "allsent" ? "active" : ""}`} onClick={() => this.props.getSection("allsent")}>
                            <a>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                    <g
                                        id="vuesax_linear_sms-notification"
                                        data-name="vuesax/linear/sms-notification"
                                        transform="translate(-684 -250)"
                                    >
                                        <g id="sms-notification" transform="translate(684 250)">
                                            <path
                                                id="Vector"
                                                d="M16.667,5.833V10c0,2.917-1.667,4.167-4.167,4.167H4.167C1.667,14.167,0,12.917,0,10V4.167C0,1.25,1.667,0,4.167,0H10"
                                                transform="translate(1.667 2.917)"
                                                fill="none"
                                                stroke="#878787"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                            />
                                            <path
                                                id="Vector-2"
                                                data-name="Vector"
                                                d="M0,0,2.608,2.083a2.638,2.638,0,0,0,3.125,0L6.717,1.3"
                                                transform="translate(5.833 7.5)"
                                                fill="none"
                                                stroke="#878787"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                            />
                                            <path
                                                id="Vector-3"
                                                data-name="Vector"
                                                d="M4.167,2.083A2.083,2.083,0,1,1,2.083,0,2.083,2.083,0,0,1,4.167,2.083Z"
                                                transform="translate(14.167 2.5)"
                                                fill="none"
                                                stroke="#878787"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                            />
                                            <path id="Vector-4" data-name="Vector" d="M0,0H20V20H0Z" fill="none" opacity="0" />
                                        </g>
                                    </g>
                                </svg>
                                <span>  All Sent</span>
                            </a>
                        </li>
                    </ul>
                </div>
                {this.toggleComposeModal()}
            </React.Fragment>
        );
    }
}
export default LeftSideMenue;
