import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Loader from "../../common/components/Loader";
import BuildModalHeader from "../../common/components/BuildModalHeader";
class UploadHelperModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    componentDidMount = async () => {
        this.setState({
            isLoading: false
        });
    };

    renderContent = contenDetails => {
        let imageExt = ["png", "jpg", "gif"];
        if (contenDetails.file_url?.length) {
            if (imageExt.includes(contenDetails["content-type"])) {
                return <img src={contenDetails.file_url} alt="" />;
            } else {
                return <iframe title="helper-iframe" className="helper-iframe" src={contenDetails.file_url} />;
            }
        } else if (contenDetails.description?.length) {
            return <div className="helper-text-contents">{contenDetails.description}</div>;
        }
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;
        const {
            selectedHelperItem: { item, subItem }
        } = this.props;
        let page_info = JSON.parse(localStorage.getItem("page_info"));
        let contenDetails = (page_info[item] && page_info[item][subItem])?.content || null;

        return (
            <React.Fragment>
                <div
                    className="modal modal-region helper-modal"
                    id="modalId"
                    style={{ display: "block" }}
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className={`modal-dialog ${contenDetails && contenDetails.file_url?.length ? "" : "has-text-contents"}`} role="document">
                        <div className="modal-content">
                            <BuildModalHeader title="Help" onCancel={this.props.onCancel} modalClass="helper-modal" />
                            <div className="modal-body region-otr">
                                {contenDetails && (contenDetails.description?.length || contenDetails.file_url?.length) ? (
                                    this.renderContent(contenDetails)
                                ) : (
                                    <div className={`coming-soon no-data no-dat`}>
                                        <div className="coming-soon-img">
                                            <img src="/img/no-data.svg" alt="" />
                                        </div>
                                        <div className="coming-txt">
                                            <h3>NO DATA FOUND</h3>
                                            <h4>There is no data to show you right now!!!</h4>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(UploadHelperModal);
