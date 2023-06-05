import React, { Component } from "react";
import "../../../assets/css/policy.css";
import history from "../../../config/history";

class PrivacyPolicy extends Component {
    render() {
        return (
            <div className="error-sec">
                <div className="col-md-12 navbarOtr">
                    <nav className="navbar navbar-expand-lg col-md-12">
                        <a className="navbar-brand" onClick={() => history.push("/dashboard")}>
                            <img src="/img/fca-logo.svg" alt="" />
                        </a>
                    </nav>
                </div>
                <div className="dashboard-outer">
                    <div className="outer-detail" id="outr">
                        <div className="right-panel-section expandnavbarr" id="main">
                            <div className="dtl-sec col-md-12">
                                <div className="tab-dtl region-mng policy">
                                    <div className="tab-active ">
                                        <div className="dtl-sec">
                                            <div className="banner">
                                                <h3>We value your privacy and trust</h3>
                                            </div>
                                            <div className="content">
                                                <h3 className="content-hed">About This Statement</h3>
                                                <p className="contents">
                                                    FCA Tracker has created this statement to demonstrate our firm commitment to your privacy. It is
                                                    the policy of FCA Tracker that all confidential information be treated with the utmost care.
                                                    Confidential information is defined, but not limited to information that is not generally known to
                                                    the industry or public. This includes: information systems data, financial information, client
                                                    employer/associate information, operations, information relating to prospective and existing
                                                    client lists, facilities, computer systems, computer terminals, specifications, development plans,
                                                    and business directions or marketing plans, regardless of the storage or transmission media
                                                    utilized.
                                                </p>
                                                <h3 className="content-hed mt-4">Security</h3>
                                                <p className="contents">
                                                    The importance of security for your personally identifiable information is of utmost concern to
                                                    us. We exercise great care in facilitating a secure transmission from your PC to our servers and
                                                    go to extensive lengths to protect the loss, misuse or alteration of the information you provide.
                                                    Your information is secured in a database with limited access. In addition, all paper files are
                                                    stored in a secure location.
                                                </p>
                                                <p className="contents">
                                                    Please note that no data transmission over the Internet can be guaranteed to be 100% secure. As a
                                                    result, while we strive to protect your personal information, FCA Tracker does not ensure or
                                                    warrant the security of any information you transmit to us over the Internet and you do so at your
                                                    own risk. Once we receive your transmission, we make our best effort to ensure its security on our
                                                    systems.
                                                </p>
                                                <h3 className="content-hed mt-4">Anonymous Information</h3>
                                                <p className="contents">
                                                    We gather anonymous profile information about visitors to our site collectively. This information
                                                    provides summarized statistics such as how many people visit our site, which features are used
                                                    most frequently, and which search engines were primarily used to access our site. This information
                                                    assists us in diagnosing problems with our site as well as helping us to deliver a better overall
                                                    experience for our visitors.
                                                </p>
                                                <h3 className="content-hed mt-4">Other Web Sites</h3>
                                                <p className="contents">
                                                    FCA Tracker contains links to various web resources and websites. FCA Tracker is not responsible
                                                    for the privacy policies or content at these sites and we encourage you to review the privacy
                                                    policies at these sites to understand exactly how they collect and use personally identifiable
                                                    information.
                                                </p>
                                                <h3 className="content-hed mt-4">Disclosure of Information:</h3>
                                                <p className="contents">
                                                    Data or information held by us relating to you will be kept confidential, but we may provide such
                                                    data or information to the following parties:
                                                </p>
                                                <p className="contents">
                                                    (a) Any person under a duty of confidentiality to us; and <br />
                                                    (b) We will disclose your personal information to concerned parties when it is necessary to
                                                    process your instructions or requests. We will also disclose your personal information to relevant
                                                    authorities or concerned parties as required by law or as requested by government, regulatory or
                                                    any other legal authorities.
                                                </p>
                                                <h3 className="content-hed mt-4">Public Forums</h3>
                                                <p className="contents">
                                                    This site does not offer its users chat rooms, forums, message boards, or news groups.
                                                </p>
                                                <h3 className="content-hed mt-4">Notification of Changes</h3>
                                                <p className="contents">
                                                    If we plan to make significant changes to our privacy policy, we will post those changes to this
                                                    privacy statement at least 30 days before they take effect.
                                                </p>
                                                <h3 className="content-hed mt-4">Acceptance of Terms</h3>
                                                <p className="contents">
                                                    By using this site, you signify your assent to the terms of this site and to FCA Tracker’s Privacy
                                                    Policy.
                                                </p>
                                                <h3 className="content-hed mt-4">Customer Service</h3>
                                                <p className="contents">
                                                    At FCA Tracker, we are working hard to protect your privacy while delivering innovative facility
                                                    information services. Our privacy principles represent our commitment to ensuring that your
                                                    personal information is safe and secure. Please let us know if you have concerns or questions.
                                                </p>
                                                <div className="info">
                                                    <h3>FCA Tracker, a CBRE partner</h3>
                                                    <div className="phone">
                                                        {" "}
                                                        Phone: <a href="#">(551) 302-3344</a>
                                                    </div>
                                                    <div className="email">
                                                        E-mail:&nbsp;<a href="#">support@fcatarcker.com</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PrivacyPolicy;
