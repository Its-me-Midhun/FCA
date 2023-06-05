import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment/moment";
class EmailSingleView extends Component {
    static propTypes = {
        prop: PropTypes
    };

    render() {
        const { singleData } = this.props;

        return (
            <React.Fragment>
                <div className="mail-outer-box ">
                    <div className="container-mail-box">
                        <table className="main-div">
                            <tbody>
                                <tr>
                                    <td className="white-box">
                                        <div className="from-content">
                                            <h4>From</h4>
                                            <div className="form-content">
                                                <p className="from-adr">{singleData.from_mail}</p>
                                                <p className="from-date">{moment(singleData.created_at).format("MM-DD-YYYY h:mm A")}</p>
                                            </div>
                                            <br/>
                                            <h4>To</h4>
                                            <div className="form-content">
                                                <p className="from-adr">{singleData.to_user}</p>
                                                <p className="from-date">{moment(singleData.created_at).format("MM-DD-YYYY h:mm A")}</p>
                                            </div>

                                            <div className="sub-content">
                                                <p className="sub-title">Subject</p>
                                                <p className="sub-main">{singleData.subject}</p>
                                            </div>
                                            <div className="main-content">
                                                <div className="main-note">Hi,</div>
                                                <p className="mail-text">{singleData.description}</p>
                                                <p className="mail-text">
                                                    {/* {"{"}/* Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                                                been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                                                type and scrambled it to make a type specimen book. It has survived not only five centuries, but also
                                                the leap into electronic typesetting, remaining essentially unchanged.Lorem Ipsum is simply dummy text
                                                of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever
                                                since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
                                                specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
                                                remaining essentially unchanged. */}
                                                </p>
                                                <td class="mail-ftr">
                                                    {singleData.files && singleData.files.length ? (
                                                        <>
                                                            <h4>Attachments</h4>
                                                            {singleData.files.map((files, i) => (
                                                                <p>
                                                                    <a href={files} target="_blank">
                                                                        {files.split("/").pop()}
                                                                        {/* {files} */}
                                                                    </a>
                                                                </p>
                                                            ))}
                                                            <br />
                                                        </>
                                                    ) : null}
                                                </td>
                                            </div>

                                            <div className="footer-cont">
                                                <p className="thank-text">Thanks Again</p>
                                                <h3>FCA Team</h3>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="logo-td-ft">
                                        <div className="logo-space">
                                            <img src="/img/fca-logo.png" />
                                            <span className="border" />
                                            <div className="mail-icn-outr">
                                                <img src="/img/mail-icn.png" />
                                                <div className="support-txt"> support@fca.com</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default EmailSingleView;
