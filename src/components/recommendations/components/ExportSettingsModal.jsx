import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { reorderArray } from "../../../config/utils";
import actions from "../actions";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import _ from "lodash";
import qs from "query-string";
import NumberFormat from "react-number-format";
import Dropzone from "react-dropzone";
import ReactTooltip from "react-tooltip";
import ReactSelect from "react-select";

const initialState = {
    isLoading: true,
    viewFilter: "all",
    keyList: [],
    searchKey: "",
    alertMessage: "",
    initialValues: {},
    showConfirmationModal: false,
    newFile: {},
    download_file: "",
    exportProperties: [],
    recom_property: "",
    initial_recom_property: ""
};
class ViewExportModal extends Component {
    state = initialState;
    componentDidMount = async () => {
        const {
            location: { search }
        } = this.props;
        ReactTooltip.rebuild();

        const query = qs.parse(search);
        await this.setState({
            isLoading: false
        });
        await this.props.getExportRecom({ project_id: query.pid || this.props.match.params.id });
        await this.props.getExportPropertyDropdown({ project_id: query.pid || this.props.match.params.id });
        const { properties, file, recom_property } = this.props.recommendationsReducer?.getExportItems?.data || {};
        let exportProperties = this.props.recommendationsReducer?.exportPropertyList || {};

        let master_props = [];
        let local_props = [];
        if (exportProperties?.without_client?.length) {
            exportProperties.without_client.forEach(elem => master_props.push({ value: elem.id, label: elem.name }));
        }
        if (exportProperties?.with_client?.length) {
            exportProperties.with_client.forEach(elem => local_props.push({ value: elem.id, label: elem.name }));
        }
        let selectedRecomProperty = [...master_props, ...local_props].find(elem => elem?.value === recom_property);
        exportProperties = [
            {
                label: "From Local",
                options: local_props
            },
            {
                label: "From Master",
                options: master_props
            }
        ];
        this.setState({
            keyList: properties,
            download_file: file,
            initialValues: _.cloneDeep(properties),
            recom_property: selectedRecomProperty || "",
            initial_recom_property: selectedRecomProperty || "",
            exportProperties
        });
    };

    handleDropdownChange = (event = null) => {
        this.setState({
            viewFilter: event.target.value
        });
    };

    isAllSelected = () => {
        const { keyList } = this.state;
        let count = 0;
        keyList.map(keyItem => {
            if (keyItem["is_active"]) {
                count++;
            }
        });
        if (keyList.length === count) {
            return true;
        }
        return false;
    };

    handleWidth = async (e, keyItem) => {
        const newArray = this.state.keyList;
        const newKeyItem = newArray.findIndex(item => item.heading === keyItem.heading);
        newArray[newKeyItem] = { ...keyItem, width: Number(e) };
        await this.setState({
            keyList: newArray
        });
    };

    handleHideColumn = async keyItem => {
        if (keyItem !== "selectAll" && keyItem !== "deselectAll") {
            const newArray = this.state.keyList;
            const newKeyItem = newArray.findIndex(item => item.heading === keyItem.heading);
            newArray[newKeyItem] = { ...keyItem, is_active: !keyItem.is_active };
            await this.setState({
                keyList: newArray
            });
        } else {
            this.setState({
                keyList:
                    keyItem === "selectAll"
                        ? this.state.keyList.map(item => ({ ...item, is_active: true }))
                        : this.state.keyList.map(item => ({ ...item, is_active: false }))
            });
        }
        return true;
    };

    handleColumn = async keyItem => {
        await this.handleHideColumn(keyItem);
    };

    handleSearch = event => {
        let tempKeys =
            this.props.recommendationsReducer.getExportItems &&
            this.props.recommendationsReducer.getExportItems.data &&
            this.props.recommendationsReducer.getExportItems.data.properties;
        let searchValue = (event && event.target && event.target.value) || this.state.searchKey;
        if (searchValue && searchValue.trim().length) {
            tempKeys = tempKeys.filter(keyItem => {
                return keyItem["heading"].toString().toLowerCase().includes(searchValue.toLowerCase());
            });
        }
        if (this.state.viewFilter === "visible") {
            tempKeys = tempKeys.filter(keyItem => keyItem["is_active"] === true);
        } else if (this.state.viewFilter === "notVisible") {
            tempKeys = tempKeys.filter(keyItem => keyItem["is_active"] === false);
        }
        this.setState({
            keyList: tempKeys
        });
    };

    onEnd = result => {
        if (!result.destination) {
            return;
        }
        const keyList = reorderArray(this.state.keyList, result.source.index, result.destination.index);
        this.setState({
            keyList
        });
    };

    handleSave = async () => {
        const { keyList, newFile, recom_property } = this.state;
        let data = {
            project_id: this.props.match.params.id,
            properties: keyList,
            recom_property: recom_property?.value || ""
        };
        if (newFile?.path) {
            data.file = newFile;
        }
        await this.props.postExportRecom(data);
        const { status, error, message } = this.props.recommendationsReducer.AddExportItems;
        if (status) {
            await this.setState({ alertMessage: message, initialValues: keyList }, () => this.showLongAlert());
            this.props.onCancel();
        }
    };

    handleDownloadWord = () => {
        const { download_file } = this.state;
        if (download_file) {
            const link = document.createElement("a");
            link.href = download_file;
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    };

    showLongAlert = () => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show-long-alert";
            x.innerText = this.state.alertMessage;
            setTimeout(function () {
                x.className = x.className.replace("show-long-alert", "");
            }, 6000);
        }
    };

    confirmCancel = () => {
        const { initialValues, keyList, newFile, initial_recom_property, recom_property } = this.state;
        if (_.isEqual(initialValues, keyList) && _.isEqual(initial_recom_property, recom_property) && !newFile?.path) {
            this.props.onCancel();
        } else {
            this.setState({
                showConfirmationModal: true
            });
        }
    };
    renderConfirmationModal = () => {
        const { showConfirmationModal } = this.state;
        if (!showConfirmationModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to clear and lose all changes?"}
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => this.setState({ showConfirmationModal: false })}
                        onYes={() => {
                            this.setState(initialState);
                            this.props.onCancel();
                        }}
                        cancel={() => this.setState({ showConfirmationModal: false })}
                    />
                }
                onCancel={() => this.setState({ showConfirmationModal: false })}
            />
        );
    };

    render() {
        const { keyList, viewFilter, download_file, newFile, exportProperties, recom_property } = this.state;
        const { onCancel } = this.props;
        let KeyLists =
            viewFilter === "all"
                ? keyList
                : viewFilter === "visible"
                ? keyList.filter(item => item.is_active === true)
                : viewFilter === "notVisible"
                ? keyList.filter(item => item.is_active === false)
                : keyList;
        let file_name_recommendation = download_file?.split("/");
        file_name_recommendation = file_name_recommendation ? file_name_recommendation[file_name_recommendation?.length - 1] : "";

        return (
            <React.Fragment>
                <div className="modal modal-region modal-view reco-view-mdl" id="modalId" style={{ display: "block" }} tabIndex="-1">
                    {this.renderConfirmationModal()}
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    <div className="txt-hed">Export Settings</div>
                                    <div className="selct-otr">
                                        <select className="form-control" onChange={e => this.handleDropdownChange(e)} value={this.state.viewFilter}>
                                            <option value="all">All</option>
                                            <option value="visible">Visible</option>
                                            <option value="notVisible">Not Visible</option>
                                        </select>
                                    </div>
                                </h5>
                                <button type="button" className="close" onClick={this.confirmCancel}>
                                    <span aria-hidden="true">
                                        <img src="/img/close.svg" alt="" />
                                    </span>
                                </button>
                            </div>
                            <div className="modal-body region-otr">
                                <DragDropContext onDragEnd={this.onEnd}>
                                    <Droppable droppableId="droppable">
                                        {provided => (
                                            <div ref={provided.innerRef} className="col-md-12 check-otr d-flex checkbox-sec">
                                                <div className="col-md-12 p-0 d-flex">
                                                    {viewFilter === "all" ? (
                                                        <div className="col-md-4 box-otr">
                                                            <div className="rem-txt">
                                                                <label className="container-check">
                                                                    Select All
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={this.isAllSelected()}
                                                                        onChange={() =>
                                                                            this.handleColumn(this.isAllSelected() ? "deselectAll" : "selectAll")
                                                                        }
                                                                    />
                                                                    <span className="checkmark" />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                    <div className="col-md-8 formInp search pl-0">
                                                        <i className="fas fa-search" />
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            onChange={async e => {
                                                                await this.setState({
                                                                    searchKey: e.target.value
                                                                });
                                                                await this.handleSearch(e);
                                                            }}
                                                            value={this.state.searchKey}
                                                            placeholder="Search Columns"
                                                        />
                                                    </div>
                                                </div>

                                                <Dropzone
                                                    accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword"
                                                    onDrop={acceptedFiles => {
                                                        this.setState({ newFile: acceptedFiles[0] });
                                                    }}
                                                    multiple={false}
                                                >
                                                    {({ getRootProps, getInputProps, isDragActive }) => (
                                                        <section class="drag-otr col-md-12" {...getRootProps()} style={{ cursor: "pointer" }}>
                                                            {/* <div> */}
                                                            <img src="/img/download-icon-upload.svg" />
                                                            <div>
                                                                <input {...getInputProps()} />
                                                                <h3 class="drag-txt">{`Drag and drop file here or click to ${
                                                                    file_name_recommendation ? "change" : "select"
                                                                } file`}</h3>
                                                                <p class="doc-name">{newFile?.path || file_name_recommendation || "Supports Docx"}</p>
                                                            </div>
                                                            {/* </div> */}
                                                        </section>
                                                    )}
                                                </Dropzone>

                                                <div className="col-md-12 box-otr box-wide">
                                                    <div className="">
                                                        <label className="container-check pl-0 mb-0">Export Property</label>
                                                    </div>
                                                    <div className="export-property-select-box">
                                                        {/* <select
                                                            autoComplete="off"
                                                            name=""
                                                            className={`custom-selecbox form-control`}
                                                            onChange={e => this.setState({ recom_property: e.target.value })}
                                                            value={recom_property}
                                                        >
                                                            <option value="">Select</option>
                                                            {exportProperties.map(item => (
                                                                <option key={item.id} value={item.id}>
                                                                    {item.name}
                                                                </option>
                                                            ))}
                                                        </select> */}

                                                        <ReactSelect
                                                            options={exportProperties}
                                                            value={recom_property}
                                                            isClearable
                                                            classNamePrefix="react-select"
                                                            onChange={value => this.setState({ recom_property: value })}
                                                        />
                                                    </div>
                                                </div>
                                                {KeyLists.map((keyItem, i) => (
                                                    <Draggable key={i} draggableId={`draggable-${i}`} index={i}>
                                                        {provided => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                key={`draggable-${i}`}
                                                                className="col-md-12 box-otr box-wide "
                                                            >
                                                                <div className="rem-txt">
                                                                    <label className="container-check">
                                                                        {keyItem["heading"]}

                                                                        <input
                                                                            type="checkbox"
                                                                            checked={keyItem["is_active"]}
                                                                            onChange={() => this.handleColumn(keyItem)}
                                                                        />
                                                                        <span className="checkmark" />
                                                                    </label>
                                                                </div>
                                                                <div className="right-box-content">
                                                                    <div class="input-box">
                                                                        <NumberFormat
                                                                            autoComplete={"nope"}
                                                                            className="custom-input form-control"
                                                                            value={keyItem["width"]}
                                                                            suffix={" inch"}
                                                                            thousandSeparator={true}
                                                                            onValueChange={values => {
                                                                                const { value } = values;
                                                                                this.handleWidth(value, keyItem);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="image-drag">
                                                                        <img src="/img/Group 2.svg" alt="" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {!KeyLists?.length ? <div className="col-md-12 text-center mt-5">No records found!</div> : ""}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                                <div class="col-md-12 p-0 mt-4 text-right btnOtr d-flex col-md-12">
                                    {download_file?.length ? (
                                        <div className="col-md-2 p-0 text-center">
                                            <button
                                                onClick={this.handleDownloadWord}
                                                className="btn-download"
                                                data-place="top"
                                                data-tip={"Download Uploaded Template"}
                                                data-for="export"
                                            >
                                                <img src="/img/file-download.svg" />
                                                <ReactTooltip id="export" effect="solid" />
                                            </button>
                                        </div>
                                    ) : null}
                                    <div className="tot-btr">
                                        <button
                                            type="button"
                                            onClick={this.confirmCancel}
                                            className="btn btn-secondary btnClr col-md-3 mr-1"
                                            data-dismiss="modal"
                                        >
                                            Cancel
                                        </button>
                                        <button type="button" onClick={this.handleSave} className="btn btn-primary btnRgion btn-wid">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { recommendationsReducer } = state;
    return { recommendationsReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(ViewExportModal));
