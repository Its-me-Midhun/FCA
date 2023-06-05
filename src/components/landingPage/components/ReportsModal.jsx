import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Loader from "../../common/components/Loader";
import documentsActions from "../../documents/actions";
import dashboardActions from "../../dashboard/actions";
import Iframe from "react-iframe";
import { connect } from "react-redux";
import Draggable from "react-draggable";
import LoadingOverlay from "react-loading-overlay";
import Portal from "../../common/components/Portal";
import ReportsFullView from "./ReportsFullView";
import ReactTooltip from "react-tooltip";

class DeliverableReports extends Component {
    state = {
        isLoading: true,
        params: {
            client_id: this.props.clientId
        },
        showFullViewModal: false,
        selectedReport: {},
        documentList: "",
        sort_type: "file_name",
        sort: "asc"
    };

    componentDidMount = async () => {
        let clientId = localStorage.getItem("clientId");
        let { doc_id } = this.props;
        let { doc_name } = this.props;
        if (clientId && clientId !== "null") {
            await this.props.getLandingPageReports({ client_id: clientId, document_type_id: doc_id });
        } else {
            await this.props.getLandingPageReports({ document_type_id: doc_id });
        }
        this.setState({
            isLoading: false,
            documentList:
                this.props.dashboardReducer?.landingPageReport.documents?.sort((a, b) =>
                    a?.file_name.localeCompare(b?.file_name, "en", { numeric: true })
                ) || ""
        });
    };

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.documentList[0]?.file_name !== this.state.documentList[0]?.file_name) {
            ReactTooltip.rebuild();
        }
    };

    viewSingleReport = doc => {
        this.setState({ selectedReport: doc });
        this.toggleFullViewModal();
    };

    toggleFullViewModal = () => {
        this.setState({ showFullViewModal: !this.state.showFullViewModal });
    };

    handleSortBy = async value => {
        await this.setState({ sort_type: value });
        const { sort } = this.state;
        let temp;
        if (value === "file_name") {
            if (sort === "desc") {
                temp = [...this.state.documentList]?.sort((a, b) => b?.file_name.localeCompare(a?.file_name, "en", { numeric: true }));
            } else {
                temp = [...this.state.documentList]?.sort((a, b) => a?.file_name.localeCompare(b?.file_name, "en", { numeric: true }));
            }
        } else if (value === "description") {
            if (sort === "desc") {
                temp = [...this.state.documentList]?.sort((a, b) => b?.description.localeCompare(a?.description, "en", { numeric: true }));
            } else {
                temp = [...this.state.documentList]?.sort((a, b) => a?.description.localeCompare(b?.description, "en", { numeric: true }));
            }
        } else if (value === "identifier") {
            if (sort === "desc") {
                temp = [...this.state.documentList]?.sort((a, b) => b?.identifier.localeCompare(a?.identifier, "en", { numeric: true }));
            } else {
                temp = [...this.state.documentList]?.sort((a, b) => a?.identifier.localeCompare(b?.identifier, "en", { numeric: true }));
            }
        } else {
            if (sort === "desc") {
                temp = [...this.state.documentList]?.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));
            } else {
                temp = [...this.state.documentList]?.sort((a, b) => new Date(a?.created_at) - new Date(b?.created_at));
            }
        }
        this.setState({ documentList: temp });
    };

    handleSortOrder = async value => {
        await this.setState({ sort: value });
        const { sort_type } = this.state;
        let temp;
        if (sort_type === "file_name") {
            if (value === "desc") {
                temp = [...this.state.documentList]?.sort((a, b) => b?.file_name.localeCompare(a?.file_name, "en", { numeric: true }));
            } else {
                temp = [...this.state.documentList]?.sort((a, b) => a?.file_name.localeCompare(b?.file_name, "en", { numeric: true }));
            }
        } else if (sort_type === "description") {
            if (value === "desc") {
                temp = [...this.state.documentList]?.sort((a, b) => b?.description.localeCompare(a?.description, "en", { numeric: true }));
            } else {
                temp = [...this.state.documentList]?.sort((a, b) => a?.description.localeCompare(b?.description, "en", { numeric: true }));
            }
        } else if (sort_type === "identifier") {
            if (value === "desc") {
                temp = [...this.state.documentList]?.sort((a, b) => b?.identifier.localeCompare(a?.identifier, "en", { numeric: true }));
            } else {
                temp = [...this.state.documentList]?.sort((a, b) => a?.identifier.localeCompare(b?.identifier, "en", { numeric: true }));
            }
        } else {
            if (value === "desc") {
                temp = [...this.state.documentList]?.sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));
            } else {
                temp = [...this.state.documentList]?.sort((a, b) => new Date(a?.created_at) - new Date(b?.created_at));
            }
        }

        this.setState({ documentList: temp });
    };

    render() {
        const { isLoading, selectedReport, showFullViewModal, documentList } = this.state;
        const {
            dashboardReducer: { landingPageReport }
        } = this.props;
        return (
            <>
                {showFullViewModal && (
                    <Portal
                        body={<ReportsFullView selectedReport={selectedReport} onCancel={this.toggleFullViewModal} />}
                        onCancel={this.toggleFullViewModal}
                    />
                )}

                <div
                    class={`modal slt-img-modl pdf-mini-mod narr`}
                    style={{ display: "block" }}
                    id="Modal-region"
                    tabindex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <Draggable cancel=".not-dragabble" positionOffset={{ x: "0%", y: "0%" }}>
                        <div>
                            <div class="modal-dialog modal-dialog-centered" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <div className="d-flex col-md-12 pl-0 align-items-center">
                                            <div className="col-md-4 pl-0">
                                                <h5 class="modal-title" id="exampleModalLabel">
                                                    FCA {this.props.doc_name}
                                                </h5>
                                            </div>
                                            <div className="col-md-8 d-flex align-items-center outer-right-sort not-dragabble">
                                                <div className="sort d-flex align-items-center">
                                                    <label className="label-txt d-flex align-items-center">Sort By</label>
                                                    <div className="frm-area">
                                                    <select
                                                        className="form-control"
                                                        value={this.state.sort_type}
                                                        onChange={e => this.handleSortBy(e.target.value)}
                                                    >
                                                        <option value="file_name">File Name</option>
                                                        <option value="created_at">Uploaded Date</option>
                                                        <option value="description">Description</option>
                                                        <option value="identifier">Identifier</option>
                                                    </select>
                                                    <button class="btn-asnd"> <img src="/img/ascending-sort-modal.svg" /></button>
                                                    </div>
                                                </div>
                                                <div className="sort" style={{ marginLeft: "11px" }}>
                                                    <select
                                                        className="form-control"
                                                        value={this.state.sort}
                                                        onChange={e => this.handleSortOrder(e.target.value, "sort")}
                                                    >
                                                        <option value="asc">ASC</option>
                                                        <option value="desc">DESC</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            class="close not-dragabble"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                            onClick={() => this.props.onCancel()}
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                                        <div
                                            class={`modal-body region-otr build-type-mod ${
                                                landingPageReport?.documents?.length ? "pdf-mini-modal" : "no-data-modal"
                                            } `}
                                        >
                                            <div class="pdf-miniature-otr">
                                                {documentList?.length ? (
                                                    documentList.map(doc => (
                                                        <>
                                                            <ReactTooltip id={`${doc.id}description`} effect="solid" />
                                                            <div class="pdf-box" key={doc?.id} onClick={() => this.viewSingleReport(doc)}>
                                                                <h3
                                                                    className="cursor-hand"
                                                                    data-tip={doc.description}
                                                                    data-place="right"
                                                                    data-effect="solid"
                                                                    data-for={`${doc.id}description`}
                                                                >
                                                                    {doc?.file_name}
                                                                </h3>
                                                                <Iframe
                                                                    url={doc?.url || ""}
                                                                    width="95%"
                                                                    height="95%"
                                                                    display="initial"
                                                                    position="relative"
                                                                    className="pdf-view"
                                                                    overflow="hidden"
                                                                />
                                                            </div>
                                                        </>
                                                    ))
                                                ) : (
                                                    <div className={`coming-soon no-data no-dat col-12`}>
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
                                    </LoadingOverlay>
                                </div>
                            </div>
                        </div>
                    </Draggable>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    const { dashboardReducer } = state;
    return { dashboardReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...documentsActions,
        ...dashboardActions
    })(DeliverableReports)
);
