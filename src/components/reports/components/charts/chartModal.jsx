import React, { Component } from "react";
import { withRouter, Prompt } from "react-router-dom";
import _ from "lodash";
import * as htmlToImage from "html-to-image";
import qs from "query-string";

import ConfirmationModal from "../../../common/components/ConfirmationModal";
import Portal from "../../../common/components/Portal";
import Loader from "../../../common/components/Loader";
import LoadingOverlay from "react-loading-overlay";
import { convertToXML } from "../../../../config/utils";
import { BandTypes } from "../../constants";
import ChartView from "./chartView";

class ChartModal extends Component {
    constructor(props) {
        super(props);
        this.insert = React.createRef();
    }

    state = {
        uploadAttachment: [],
        tempAttachment: {},
        uploadError: "",
        fileChanged: false,
        isUploading: false,
        missingRequiredFields: false,
        isInvalidFile: false,
        showConfirmModal: false,
        selectedInsert: {},
        isUpdate: null,
        isDeleting: false,
        attachmentChanged: false,
        showNarrCompletedComfirmModal: false,
        chartType: this.props.chartType || "categories"
    };

    componentDidMount = () => {
        this.setState({ tempAttachment: { double_header: false, footer: false } });
        this.setState(
            {
                chartType: "categories"
            },
            () => this.props.getChartDetails("categories")
        );
    };

    componentDidUpdate = prevProps => {
        if (
            qs.parse(prevProps.location?.search)?.narratable_id != qs.parse(this.props.location?.search)?.narratable_id ||
            prevProps.match.params?.tab != this.props.match.params?.tab
        ) {
            this.setState({ tempAttachment: { double_header: false, footer: false } });
        }
    };

    handleChangeChart = data => {
        this.setState({
            attachmentChanged: true,
            tempAttachment: {
                ...this.state.tempAttachment,
                html_format: data
            }
        });
        this.props.setIsUnsaved(true);
    };

    deleteAttachment = async () => {
        this.setState({ isDeleting: true, showConfirmModal: false });
        await this.props.deleteInsert(this.state.selectedInsert.id);
        this.setState({
            tempAttachment: { double_header: false, footer: false },
            isUploading: false,
            missingRequiredFields: false,
            isUpdate: null
        });
        this.setState({ isDeleting: false });
    };

    handleDeleteAttachment = async id => {
        let usedChartFound = this.props.checkIfNarrativeChartUsed(id);
        this.setState({
            showConfirmModal: true,
            selectedInsert: { id: id, usedChartFound }
        });
    };

    handleUpdateInsert = async () => {
        const { tempAttachment } = this.state;
        if (!(tempAttachment.description?.trim()?.length >= 3) || !tempAttachment.html_format) {
            this.setState({
                isUploading: false,
                missingRequiredFields: true
            });
            return false;
        } else if (this.validateChart(tempAttachment)) {
            this.setState({
                missingRequiredFields: true,
                uploadError: "Invalid table format !"
            });
            return false;
        }
        let usedChartFound = this.props.checkIfNarrativeChartUsed(tempAttachment.id);
        if (usedChartFound && this.props.narrativeCompleted) {
            this.setState({ showNarrCompletedComfirmModal: true });
        } else {
            await this.updateInsert();
        }
    };

    updateInsert = async () => {
        const { tempAttachment } = this.state;
        this.setState({
            isUploading: true
        });

        let node = document.getElementsByClassName("ck ck-editor__main")[0];
        let url = await this.printImage(node);
        await this.setState({
            tempAttachment: {
                ...tempAttachment,
                image: url,
                text_format: convertToXML(this.state.tempAttachment, BandTypes.insertBand)
            }
        });

        await this.props.updateInsert(this.state.tempAttachment);
        this.setState({
            tempAttachment: { double_header: false, footer: false },
            isUpdate: null,
            isUploading: false,
            missingRequiredFields: false,
            attachmentChanged: false,
            uploadError: ""
        });
        this.props.setIsUnsaved(false);
    };

    renderConfirmationModal = () => {
        const {
            showConfirmModal,
            selectedInsert: { usedChartFound }
        } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={"Do you really want to delete this Chart?"}
                        message={
                            this.props.narrativeCompleted && usedChartFound
                                ? "The narrative is marked as complete & this table is used in narrative. This action will mark the narrative as incomplete."
                                : "This action cannot be reverted, are you sure that you need to delete this table?"
                        }
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.deleteAttachment}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    renderNarrCompletedConfirmationModal = () => {
        const { showNarrCompletedComfirmModal } = this.state;
        if (!showNarrCompletedComfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you really want to update this Chart?"}
                        message={"The narrative is marked as complete. This action will mark the narrative as incomplete."}
                        onNo={() => this.setState({ showNarrCompletedComfirmModal: false })}
                        onYes={() => {
                            this.setState({ showNarrCompletedComfirmModal: false });
                            this.updateInsert();
                        }}
                    />
                }
                onCancel={() => this.setState({ showNarrCompletedComfirmModal: false })}
            />
        );
    };

    printImage = async node => {
        try {
            let blob = await htmlToImage.toBlob(node);
            return blob;
        } catch (error) {
            console.error("oops, something went wrong!", error);
        }
    };

    addInsert = async () => {
        const { tempAttachment, uploadAttachment } = this.state;
        if (!(tempAttachment.html_format && tempAttachment.description?.trim()?.length >= 3)) {
            this.setState({
                missingRequiredFields: true
            });
            return false;
        } else if (this.validateChart(tempAttachment)) {
            this.setState({
                missingRequiredFields: true,
                uploadError: "Invalid table format !"
            });
            return false;
        }
        this.setState({
            isUploading: true
        });
        let node = document.getElementsByClassName("ck ck-editor__main")[0];
        let url = await this.printImage(node);
        if (!url) {
            this.setState({ isUploading: false });
            return window.alert("failed to take screenshot!");
        }
        await this.setState({
            tempAttachment: {
                ...tempAttachment,
                image: url,
                text_format: convertToXML(this.state.tempAttachment, BandTypes.insertBand)
            }
        });
        await this.props.uploadInsert(this.state.tempAttachment);
        this.setState(
            {
                uploadAttachment: [...uploadAttachment, tempAttachment],
                tempAttachment: { double_header: false, footer: false },
                isUploading: false,
                missingRequiredFields: false,
                uploadError: ""
            },
            () => this.setState({ attachmentChanged: false })
        );
        this.props.setIsUnsaved(false);
    };

    handleChange = e => {
        const { tempAttachment } = this.state;
        const { name, value } = e.target;
        this.setState({ attachmentChanged: true });
        if (name === "description") {
            this.setState({
                tempAttachment: {
                    ...tempAttachment,
                    [name]: value
                }
            });
        } else {
            this.setState({
                tempAttachment: {
                    ...tempAttachment,
                    [name]: !tempAttachment[name]
                }
            });
        }
        this.props.setIsUnsaved(true);
    };

    validateChart = table => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(table.html_format, "text/html");
        let elems = xmlDoc.getElementsByTagName("table");
        let tbody = xmlDoc.getElementsByTagName("tbody")[0];

        if (_.isEmpty(elems)) return true;
        else if (elems.length > 1) return true;
        else if (tbody.childNodes.length === 1 && table.footer) return true;
        else if (tbody.childNodes.length === 1 && table.double_header) return true;
        else if (tbody.childNodes.length === 2 && table.footer && table.double_header) return true;
        else if (this.isContainRowSpan(xmlDoc)) return true;
        else if (this.isNestedTabe(this.insert)) return true;
        else return false;
    };

    isNestedTabe = editor => {
        editor.model.schema.addChildCheck((context, childDefinition) => {
            if (childDefinition.name == "table" && Array.from(context.getNames()).includes("table")) {
                return true;
            }
        });
    };

    isContainRowSpan = xmlDoc => {
        let tds = xmlDoc.getElementsByTagName("td");
        let ths = xmlDoc.getElementsByTagName("th");
        let flag = Array.from(tds)
            .concat(Array.from(ths))
            .some(td => td.hasAttribute("rowspan") && td.getAttribute("rowspan") !== "1");
        return flag;
    };

    clearInsert = () => {
        this.setState(
            {
                tempAttachment: { double_header: false, footer: false },
                missingRequiredFields: false
            },
            () => {
                this.setState({ attachmentChanged: false });
                this.props.setIsUnsaved(false);
            }
        );
    };

    disableCommand = cmd => {
        cmd.on("set:isEnabled", forceDisable, { priority: "highest" });

        cmd.isEnabled = false;

        // Make it possible to enable the command again.
        return () => {
            cmd.off("set:isEnabled", forceDisable);
            cmd.refresh();
        };

        function forceDisable(evt) {
            evt.return = false;
            evt.stop();
        }
    };

    handleChartClick = async item => {
        await this.setState({
            chartType: item.name,
            isLoading: true
        });
        await this.props.getChartDetails(item.name);
        this.setState({
            isLoading: false
        });
    };

    render() {
        const { tempAttachment, isDeleting, chartType, isLoading } = this.state;
        const {
            chartList,
            graphData: { chartData, chartName, projectName }
        } = this.props;
        return (
            <React.Fragment>
                <div id="modalId" className={"insert-tabl modal-region modal-add-img gal-image-modal"} style={{ display: "block" }}>
                    <div className="" role="document">
                        <div className="modal-content">
                            <LoadingOverlay className="insert-tabl-wrap" active={isDeleting} spinner={<Loader />} fadeSpeed={10}>
                                <div className="modal-body region-otr report-chart-outer">
                                    <div className="otr-add-img">
                                        <div className="add-imges add-charts col-md-9 p-0">
                                            {/* <h3 className="mb-0">{chartType || "-"}</h3> */}
                                            <ChartView
                                                graphData={chartData}
                                                chartName={chartName}
                                                chartDetailType={chartType}
                                                projectName={projectName}
                                                isLoading={isLoading}
                                            />
                                        </div>
                                        <div className="upload-fle col-md-3 p-0">
                                            <div class="top-bar-btn table-tab-header">
                                                <h3>Charts</h3>
                                                {/* <button
                                                    class="btn-fci pl-3 cursor-notallowed"
                                                    disabled
                                                    onClick={() => this.props.autoPopulateChartTemplates()}
                                                >
                                                    INITIALIZE CHARTS
                                                </button> */}
                                            </div>

                                            <div className="files">
                                                {chartList?.length ? (
                                                    chartList.map((item, i) => (
                                                        <div
                                                            key={i}
                                                            className={`${chartType === item.name ? "active " : ""}fl-dtl cursor-pointer`}
                                                            onClick={() => this.handleChartClick(item)}
                                                        >
                                                            <img src="/img/chart-default.svg" className="img-fl-dtl wid-unset" alt="" />
                                                            <div className="img-otr">
                                                                <p className="img-nme">{item.name}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span>No Charts Available</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </LoadingOverlay>
                        </div>
                    </div>
                </div>
                {this.renderConfirmationModal()}
                {this.renderNarrCompletedConfirmationModal()}
            </React.Fragment>
        );
    }
}

export default withRouter(ChartModal);
