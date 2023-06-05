import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import * as htmlToImage from "html-to-image";

import projectActions from "../actions";
import buildingActions from "../../building/actions";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import { popBreadCrumpData, findPrevPathFromBreadCrump, convertToXML } from "../../../config/utils";
import exclmIcon from "../../../assets/img/recom-icon.svg";

const editorConfiguration = {
    // extraPlugins: [DisallowNestingTables],
    toolbar: ["insertTable", "|", "alignment:left", "alignment:right", "alignment:center", "alignment:justify"],
    tableProperties: {
        defaultProperties: {
            alignment: "left"
        }
    },
    table: {
        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells", "tableCellProperties"]
        // defaultHeadings: { rows: 2}
    },
    removePlugins: ["Title"],
    alignment: {
        options: ["left", "right", "center", "justify"]
    }
};

const DISABLE_COMMANDS = [
    "setTableColumnHeader",
    "setTableRowHeader",
    "mergeTableCellUp",
    "mergeTableCellDown",
    "splitTableCellVertically",
    "splitTableCellHorizontally",
    "tableBorderColor",
    "tableBorderStyle",
    "tableBorderWidth",
    "tableAlignment",
    "tableWidth",
    "tableHeight",
    "tableBackgroundColor",
    "tableCellBorderStyle",
    "tableCellBorderColor",
    "tableCellBorderWidth",
    "tableCellHorizontalAlignment",
    // "tableCellWidth",
    // "tableCellHeight",
    "tableCellPadding",
    // "tableCellBackgroundColor",
    "tableCellVerticalAlignment"
];

class From extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            clients: "",
            consultancies: "",
            consultancy_users: [],
            client_users: [],
            buildings: [],
            tableTemplate: {
                name: "",
                double_header: false,
                footer: false,
                html_format: "",
                description: ""
            },
            errorParams: {
                name: "",
                html_format: ""
            },
            initiaValues: {},
            isNewProject: true,
            selectedClient: {},
            regionList: [],
            siteList: [],
            projectList: [],
            selectedConsultancyUsers: [],
            selectedClientUsers: [],

            selectedTableTemplate: props.match.params.id,
            uploadError: "",
            attachmentChanged: false,
            showConfirmModal: false,
            showErrorBorder: false,
            selectedBuilding: qs.parse(this.props.location.search.bid) || null,
            initialConsultancyUsers: [],
            initialClientUsers: [],
            uploadAttachment: []
        };
    }

    componentDidMount = async () => {
        const { selectedTableTemplate } = this.props;
        if (selectedTableTemplate) {
            await this.props.getDataById(selectedTableTemplate);
            const {
                tableTemplateReducer: {
                    getTableTemplateByIdResponse: { success, name, html_format, description, double_header, footer }
                }
            } = this.props;

            if (success) {
                await this.setState({
                    tableTemplate: {
                        name,
                        double_header,
                        footer,
                        html_format,
                        description
                    }
                });
            }
        }

        await this.setState({
            initiaValues: this.state.tableTemplate,
            isLoading: false
        });
    };

    validate = () => {
        const { tableTemplate } = this.state;
        let errorParams = {
            name: false,
            html_format: false
        };
        let showErrorBorder = false;

        if (!tableTemplate.name || !tableTemplate.name.trim().length) {
            errorParams.name = true;
            showErrorBorder = true;
        }
        if (!tableTemplate.html_format || this.validateTable(tableTemplate)) {
            errorParams.html_format = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    addTableTemplate = async () => {
        const { tableTemplate } = this.state;
        const { handleAddTableTemplate } = this.props;
        let narrative_insert = new FormData();
        narrative_insert.append("name", tableTemplate.name);
        narrative_insert.append("image", tableTemplate.image);
        narrative_insert.append("description", tableTemplate.description);
        narrative_insert.append("html_format", tableTemplate.html_format);
        narrative_insert.append("project_id", tableTemplate.project_id);
        narrative_insert.append("building_id", tableTemplate.building_id);
        narrative_insert.append("narratable_id", tableTemplate.narratable_id);
        narrative_insert.append("double_header", tableTemplate.double_header);
        narrative_insert.append("footer", tableTemplate.footer);
        narrative_insert.append("text_format", tableTemplate.text_format);
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleAddTableTemplate(narrative_insert);
            this.setState({
                isUploading: false
            });
        }
    };

    updateTableTemplate = async () => {
        const { tableTemplate } = this.state;
        const tableTemplate_id = this.props.match.params.id;
        const { handleUpdateTableTemplate } = this.props;
        let narrative_insert = new FormData();
        narrative_insert.append("name", tableTemplate.name);
        narrative_insert.append("image", tableTemplate.image);
        narrative_insert.append("description", tableTemplate.description);
        narrative_insert.append("html_format", tableTemplate.html_format);
        narrative_insert.append("double_header", tableTemplate.double_header);
        narrative_insert.append("footer", tableTemplate.footer);
        narrative_insert.append("text_format", tableTemplate.text_format);
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            popBreadCrumpData();
            await handleUpdateTableTemplate(tableTemplate_id, tableTemplate);
            this.setState({
                isUploading: false
            });
        }
    };

    renderConfirmationModal = () => {
        const { showConfirmModal } = this.state;
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to clear and lose all changes?"}
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={this.clearForm}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    cancelForm = () => {
        if (_.isEqual(this.state.initiaValues, this.state.tableTemplate)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        const { history } = this.props;
        await this.setState({
            tableTemplate: {
                name: "",
                comments: "",
                double_header: false,
                footer: false
            },
            selectedClient: {},
            selectedConsultancyUsers: []
        });
        history.goBack();
        // history.push(findPrevPathFromBreadCrump() || "/tableTemplate");
        popBreadCrumpData();
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
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

    validateTable = table => {
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

    printImage = async node => {
        try {
            let blob = await htmlToImage.toBlob(node);
            return blob;
        } catch (error) {
            console.error("oops, something went wrong!", error);
        }
    };

    updateInsert = async () => {
        const { tableTemplate } = this.state;
        this.setState({
            isUploading: true
        });

        let node = document.getElementsByClassName("ck ck-editor__main")[0];
        let url = await this.printImage(node);
        await this.setState({
            tableTemplate: {
                ...tableTemplate,
                image: url,
                text_format: convertToXML(this.state.tableTemplate, 4) // 4 --> BandTypes.insertBand
            }
        });

        await this.updateTableTemplate();
        this.setState({
            tableTemplate: { double_header: false, footer: false },
            isUpdate: null,
            isUploading: false,
            missingRequiredFields: false,
            attachmentChanged: false,
            uploadError: ""
        });
    };

    addInsert = async () => {
        const { tableTemplate, uploadAttachment } = this.state;
        if (!this.validate()) {
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
            tableTemplate: {
                ...tableTemplate,
                image: url,
                text_format: convertToXML(this.state.tableTemplate, 4) // 4 --> BandTypes.insertBand
            }
        });
        await this.addTableTemplate();
        this.setState(
            {
                uploadAttachment: [...uploadAttachment, tableTemplate],
                tableTemplate: { double_header: false, footer: false },
                isUploading: false,
                missingRequiredFields: false,
                uploadError: ""
            },
            () => this.setState({ attachmentChanged: false })
        );
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { tableTemplate, showErrorBorder, errorParams } = this.state;
        const { selectedTableTemplate } = this.props;

        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">{selectedTableTemplate ? "Edit Table Tenplate" : "Add Table Template"}</li>
                        </ul>
                        <form autoComplete={"nope"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-6 basic-box">
                                                <div className="codeOtr">
                                                    <h4>TableTemplate Name *</h4>
                                                    <input
                                                        autoComplete={"nope"}
                                                        type="text"
                                                        className={`${
                                                            showErrorBorder && errorParams.name ? "error-border " : ""
                                                        }custom-input form-control`}
                                                        value={tableTemplate.name}
                                                        onChange={e =>
                                                            this.setState({
                                                                tableTemplate: {
                                                                    ...tableTemplate,
                                                                    name: e.target.value
                                                                }
                                                            })
                                                        }
                                                        placeholder="Enter TableTemplate Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <h4>Description</h4>
                                                    <textarea
                                                        autoComplete={"nope"}
                                                        placeholder="Comments"
                                                        className="custom-input form-control"
                                                        value={tableTemplate.description}
                                                        onChange={e =>
                                                            this.setState({
                                                                tableTemplate: {
                                                                    ...tableTemplate,
                                                                    description: e.target.value
                                                                }
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6 basic-box comment-form">
                                                <div className="codeOtr">
                                                    <div className="form-group">
                                                        <div className="formInp">
                                                            <label>Select Header *</label>
                                                        </div>
                                                        <div class="d-flex hedd-otrr">
                                                            <div className="formInp mr-3">
                                                                <label className="container-check">
                                                                    Single Header
                                                                    <input
                                                                        type="radio"
                                                                        name="double_header"
                                                                        onClick={e =>
                                                                            this.setState({
                                                                                tableTemplate: {
                                                                                    ...tableTemplate,
                                                                                    double_header: !tableTemplate.double_header
                                                                                }
                                                                            })
                                                                        }
                                                                        checked={!tableTemplate.double_header}
                                                                    />
                                                                    <span className="checkmark white" />
                                                                </label>
                                                            </div>
                                                            <div className="formInp">
                                                                <label className="container-check">
                                                                    Double Header
                                                                    <input
                                                                        type="radio"
                                                                        name="double_header"
                                                                        onClick={e =>
                                                                            this.setState({
                                                                                tableTemplate: {
                                                                                    ...tableTemplate,
                                                                                    double_header: !tableTemplate.double_header
                                                                                }
                                                                            })
                                                                        }
                                                                        checked={tableTemplate.double_header}
                                                                    />
                                                                    <span className="checkmark white" />
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 basic-box comment-form template-field">
                                                <div className={`${showErrorBorder && errorParams.html_format ? "error-border " : ""}codeOtr`}>
                                                    <h4>Template *</h4>
                                                    <CKEditor
                                                        editor={Editor}
                                                        config={editorConfiguration}
                                                        id={tableTemplate.name}
                                                        data={tableTemplate.html_format || ""}
                                                        onReady={editor => {
                                                            if (editor) {
                                                                this.insert = editor;
                                                                DISABLE_COMMANDS.map(cmd => this.disableCommand(editor.commands.get(cmd)));
                                                            }
                                                        }}
                                                        onChange={(event, editor) => {
                                                            const data = editor.getData();
                                                            this.setState({
                                                                tableTemplate: {
                                                                    ...tableTemplate,
                                                                    html_format: data
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12 basic-box">
                                                <div className="codeOtr">
                                                    <div className="form-group">
                                                        <div className="formInp">
                                                            <label>Select Footer</label>
                                                        </div>
                                                        <div className="col-md-12 formInp p-0 cmntImg">
                                                            <label className="container-check">
                                                                Footer
                                                                <input
                                                                    type="checkbox"
                                                                    name="footer"
                                                                    checked={tableTemplate.footer}
                                                                    onClick={e =>
                                                                        this.setState({
                                                                            tableTemplate: {
                                                                                ...tableTemplate,
                                                                                footer: !tableTemplate.footer
                                                                            }
                                                                        })
                                                                    }
                                                                />
                                                                <span className="checkmark white" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 text-right btnOtr edit-cmn-btn">
                                    <button
                                        type="button"
                                        className="btn btn-secondary btnClr col-md-2 mr-1"
                                        data-dismiss="modal"
                                        onClick={() => this.cancelForm()}
                                    >
                                        Cancel
                                    </button>
                                    {selectedTableTemplate ? (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.updateInsert()}>
                                            Update Table Template
                                        </button>
                                    ) : (
                                        <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.addInsert()}>
                                            Add Table Template
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {this.renderConfirmationModal()}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    const { projectReducer, buildingReducer, tableTemplateReducer } = state;
    return { projectReducer, buildingReducer, tableTemplateReducer };
};

export default withRouter(connect(mapStateToProps, { ...projectActions, ...buildingActions })(From));
