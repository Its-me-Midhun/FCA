import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { thousandsSeparators } from "../../../config/utils";
import { addToBreadCrumpData, findPrevPathFromBreadCrumpData, popBreadCrumpOnPageClose, popBreadCrumpData } from "../../../config/utils";
import NumberFormat from "react-number-format";
import ConfirmationModal from "./ConfirmationModal";
import Portal from "./Portal";
import { LockUnlock } from "./LockUnlock";
import { MultiSelectionModal } from "./MultiSelectionModal";

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
class BasicDetails extends Component {
    state = {
        showBenchmarkConfirmation: false,
        multiSelectionModalParams: {}
    };
    showBenchmarkConfirmationModal = e => {
        this.setState({ showBenchmarkConfirmation: true, selectedBenchmark: e.target.checked });
    };
    renderBenchmarkConfirmationModal = () => {
        const { showBenchmarkConfirmation, selectedBenchmark } = this.state;
        if (!showBenchmarkConfirmation) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={
                            selectedBenchmark === false
                                ? "Do you want to remove Asset Benchmarking from this Sub-System?"
                                : "Do you want to Benchmark Assets assigned to this Sub-System?"
                        }
                        // message={"This action cannot be reverted, are you sure ?"}
                        onNo={() => this.setState({ showBenchmarkConfirmation: false })}
                        onYes={this.updateBenchmark}
                    />
                }
                onCancel={() => this.setState({ showBenchmarkConfirmation: false })}
            />
        );
    };
    updateBenchmark = () => {
        const { selectedBenchmark } = this.state;
        this.setState({ showBenchmarkConfirmation: false });
        this.props.updateBenchmark({ benchmark: selectedBenchmark ? "yes" : "no" });
    };

    energyDecimalFormat = num => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    renderMultiSelectionModal = () => {
        const { multiSelectionModalParams } = this.state;
        if (!multiSelectionModalParams.show) return null;
        const { heading, selectedValues } = multiSelectionModalParams || {};
        return (
            <Portal
                body={<MultiSelectionModal viewOnly currentSelection={selectedValues} heading={heading} onCancel={this.cancelMultiSelectionModal} />}
                onCancel={this.cancelMultiSelectionModal}
            />
        );
    };
    cancelMultiSelectionModal = () => {
        this.setState({
            multiSelectionModalParams: { show: false }
        });
    };

    render() {
        const {
            basicDetails,
            keys,
            config,
            history,
            match: {
                params: { section, tab }
            },
            handleDeleteItem,
            isHistoryView = false,
            hasDelete = true,
            hasEdit = true,
            hasLogView = true,
            showEditPage,
            hasLock,
            lockRegion
        } = this.props;
        const {
            location: { search }
        } = this.props;

        const query = qs.parse(search);
        return (
            <React.Fragment>
                <div className="tab-active fund-efci">
                    <div className="otr-edit-delte col-md-12 text-right">
                        <div className={hasLock ? `otr-common-lck` : ""}>
                            <div className="lft ml-2">
                                {hasLock && (
                                    <LockUnlock locked={basicDetails.locked} lockProject={lockRegion} partial_locked={basicDetails.partial_locked} />
                                )}
                            </div>
                            <div className="right-end-icon">
                                {keys.includes("benchmark") && (
                                    <div className="benchmark-icn-rgt ml-3">
                                        <label className="container-check">
                                            <input
                                                type="checkbox"
                                                checked={basicDetails.benchmark === "yes" ? true : false}
                                                onChange={this.showBenchmarkConfirmationModal}
                                            />
                                            <span className="checkmark"></span>Benchmark
                                        </label>
                                    </div>
                                )}
                                {isHistoryView
                                    ? hasLogView && (
                                          <span
                                              onClick={() => {
                                                  this.props.changeToHistory();
                                              }}
                                              className="edit-icn-bx"
                                          >
                                              <i className="fas fa-history"></i> View History
                                          </span>
                                      )
                                    : null}
                                {!query.dashboardView ? (
                                    <span
                                        onClick={() => {
                                            if (
                                                tab === "energyStarRating" ||
                                                tab === "Electricity" ||
                                                tab === "Gas" ||
                                                tab === "Water" ||
                                                tab === "Sewer"
                                            ) {
                                                popBreadCrumpData();
                                                history.push(findPrevPathFromBreadCrumpData());
                                                popBreadCrumpData();
                                                return;
                                            }

                                            popBreadCrumpOnPageClose();
                                            history.push(findPrevPathFromBreadCrumpData());
                                        }}
                                        className="edit-icn-bx"
                                    >
                                        <i className="fas fa-window-close"></i> Close
                                    </span>
                                ) : null}
                                {hasEdit && (
                                    <span
                                        onClick={() => {
                                            if (
                                                tab === "energyStarRating" ||
                                                tab === "Electricity" ||
                                                tab === "Gas" ||
                                                tab === "Water" ||
                                                tab === "Sewer"
                                            ) {
                                                this.props.handleEditItem();
                                                return;
                                            }

                                            if (showEditPage) {
                                                showEditPage(this.props.match.params.id);
                                            } else {
                                                addToBreadCrumpData({
                                                    key: "edit",
                                                    name: `Edit ${this.props.location.pathname.split("/")[1]}`,
                                                    path: `/${this.props.location.pathname.split("/")[1]}/edit/${this.props.match.params.id}`
                                                });
                                                history.push(`/${this.props.location.pathname.split("/")[1]}/edit/${this.props.match.params.id}`);
                                            }
                                        }}
                                        className="edit-icn-bx"
                                    >
                                        <i className="fas fa-pencil-alt"></i> Edit
                                    </span>
                                )}
                                {hasDelete && (
                                    <span onClick={() => handleDeleteItem(this.props.match.params.id)} className="edit-icn-bx">
                                        <i className="fas fa-trash-alt"></i> Delete
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="basic-dtl-otr">
                        {keys && keys.length
                            ? keys.map((keyItem, i) => {
                                  return keyItem !== "comments" &&
                                      keyItem !== "text_format" &&
                                      keyItem !== "html_format" &&
                                      //   keyItem !== "description" &&
                                      config[keyItem]?.label !== "Report Notes" &&
                                      !config[keyItem]?.isTextArea ? (
                                      <React.Fragment key={i}>
                                          {section === "buildinginfo" && i === 0 ? (
                                              <div className="col-12 mt-3 addTxt">
                                                  <h3>
                                                      <div className="nme"> Basic Details</div>
                                                      <div className="line"></div>
                                                  </h3>
                                              </div>
                                          ) : null}
                                          <div key={i} className="col-md-4 basic-box">
                                              <div className="codeOtr">
                                                  <h4>{config[keyItem]?.label}</h4>
                                                  {keyItem === "client" ||
                                                  keyItem === "region" ||
                                                  keyItem === "site" ||
                                                  keyItem === "consultancy" ||
                                                  keyItem === "system" ||
                                                  keyItem === "trade" ||
                                                  keyItem === "floor" ||
                                                  keyItem === "building" ||
                                                  keyItem === "addition" ||
                                                  keyItem === "asset_status" ||
                                                  keyItem === "asset_type" ||
                                                  keyItem === "uniformat_level_1" ||
                                                  keyItem === "uniformat_level_2" ||
                                                  keyItem === "uniformat_level_3" ||
                                                  keyItem === "uniformat_level_4" ||
                                                  keyItem === "uniformat_level_5" ? (
                                                      <h3>
                                                          {(basicDetails[keyItem] &&
                                                          typeof basicDetails[keyItem] === "string" &&
                                                          config[keyItem].type === "string"
                                                              ? basicDetails[keyItem]
                                                              : basicDetails[keyItem]?.name) || "-"}
                                                      </h3>
                                                  ) : keyItem === "regions" || keyItem === "sites" || keyItem === "projects" ? (
                                                      <h3 className="rgn">
                                                          {basicDetails[keyItem] && basicDetails[keyItem].length
                                                              ? basicDetails[keyItem].map((item, i) => (
                                                                    <React.Fragment key={i}>
                                                                        <span key={i} className="rg-txt">
                                                                            {item.name}
                                                                        </span>
                                                                        {i < basicDetails[keyItem].length - 1 ? (
                                                                            <span className="line-txt">|</span>
                                                                        ) : null}
                                                                    </React.Fragment>
                                                                ))
                                                              : null}
                                                      </h3>
                                                  ) : keyItem === "double_header" || keyItem === "footer" ? (
                                                      <h3>{basicDetails[keyItem] ? "Yes" : "No"}</h3>
                                                  ) : keyItem === "users" ? (
                                                      <div
                                                          class="custom-selecbox select-multi-box view-user"
                                                          onClick={() =>
                                                              this.setState({
                                                                  multiSelectionModalParams: {
                                                                      show: true,
                                                                      heading: "Consultancy Users",
                                                                      selectedValues: basicDetails[keyItem]
                                                                  }
                                                              })
                                                          }
                                                      >
                                                          <div class="badge-num"> {basicDetails[keyItem]?.length}</div>
                                                          <div class="badge-sub-txt">View Users</div>
                                                      </div>
                                                  ) : keyItem === "client_users" ? (
                                                      <div
                                                          class="custom-selecbox select-multi-box view-user"
                                                          onClick={() =>
                                                              this.setState({
                                                                  multiSelectionModalParams: {
                                                                      show: true,
                                                                      heading: "Client Users",
                                                                      selectedValues: basicDetails[keyItem]
                                                                  }
                                                              })
                                                          }
                                                      >
                                                          <div class="badge-num"> {basicDetails[keyItem]?.length}</div>
                                                          <div class="badge-sub-txt">View Users</div>
                                                      </div>
                                                  ) : keyItem === "area" ? (
                                                      <h3>
                                                          {basicDetails.area ? (
                                                              <NumberFormat
                                                                  value={parseInt(basicDetails[keyItem])}
                                                                  thousandSeparator={true}
                                                                  displayType={"text"}
                                                              />
                                                          ) : (
                                                              "-"
                                                          )}
                                                      </h3>
                                                  ) : keyItem === "cost" || keyItem === "cost_per_unit" ? (
                                                      <h3>
                                                          {basicDetails[keyItem] ? (
                                                              <NumberFormat
                                                                  value={parseFloat(basicDetails[keyItem])}
                                                                  thousandSeparator={true}
                                                                  displayType={"text"}
                                                                  prefix={"$ "}
                                                              />
                                                          ) : (
                                                              "-"
                                                          )}
                                                      </h3>
                                                  ) : keyItem === "color_code" ? (
                                                      <h3>
                                                          {basicDetails?.color_code || "-"}
                                                          <span
                                                              className="condition-color-span"
                                                              style={{ backgroundColor: `${basicDetails?.color_code}` }}
                                                          ></span>
                                                      </h3>
                                                  ) : keyItem === "mmbtu_usage" ||
                                                    keyItem === "kw_usage" ||
                                                    keyItem === "kwh_usage" ||
                                                    keyItem === "ccf_usage" ? (
                                                      <h3>
                                                          {basicDetails[keyItem]
                                                              ? `${thousandsSeparators(
                                                                    this.energyDecimalFormat(parseFloat(basicDetails[keyItem]))
                                                                ).toString()}`
                                                              : "-"}
                                                      </h3>
                                                  ) : keyItem === "mmbtu_usage" ||
                                                    keyItem === "mmbtu_well_head_cost" ||
                                                    keyItem === "mmbtu_transport_cost" ||
                                                    keyItem === "mmbtu_total_gas_cost" ||
                                                    keyItem === "kw_cost" ||
                                                    keyItem === "total_electric_cost" ||
                                                    keyItem === "kwh_cost" ? (
                                                      <h3>
                                                          {basicDetails[keyItem]
                                                              ? `$ ${thousandsSeparators(
                                                                    this.energyDecimalFormat(parseFloat(basicDetails[keyItem]?.split("$")[1]))
                                                                ).toString()}`
                                                              : "-"}
                                                      </h3>
                                                  ) : (
                                                      <h3>{(basicDetails[keyItem] && basicDetails[keyItem]) || "-"}</h3>
                                                  )}
                                              </div>
                                          </div>
                                          {section === "recommendationsinfo" && i !== 0 && i % 6 === 0 ? <div className="col-12 mt-3"></div> : null}
                                          {section === "buildinginfo" && (i === 6 || i === 16) ? (
                                              <div className="col-12 mt-3 addTxt">
                                                  <h3>
                                                      <div className="nme">{i === 6 ? "More Details" : "Address"}</div>
                                                      <div className="line"></div>
                                                  </h3>
                                              </div>
                                          ) : null}
                                      </React.Fragment>
                                  ) : null;
                              })
                            : null}
                    </div>

                    <div className="col-md-12 otr-user-cmnt">
                        {basicDetails.hasOwnProperty("comments") ? (
                            <div className={`col comment p-0`}>
                                <h3>Comments</h3>
                                <pre>
                                    <div className="contDtl">{basicDetails.comments || "-"}</div>
                                </pre>
                            </div>
                        ) : null}

                        {basicDetails.html_format && basicDetails.useTextEditor ? (
                            <CKEditor
                                editor={Editor}
                                config={editorConfiguration}
                                id={"view_table"}
                                data={basicDetails.html_format || ""}
                                disabled={true}
                            />
                        ) : null}

                        {basicDetails.text_format ? (
                            <div className={`col comment p-0`}>
                                <h3>Template</h3>
                                {/* <pre>
                                    <div className="contDtl">{basicDetails.text_format || "-"}</div>
                                </pre> */}
                                <pre>
                                    <div
                                        className="contDtl notes-template-style"
                                        dangerouslySetInnerHTML={{ __html: basicDetails.text_format }}
                                    ></div>
                                </pre>
                                {/* <pre>
                                    <div className="contDtl">
                                        <CKEditor
                                            editor={Editor}
                                            config={editorConfigurations}
                                            id={"report-template"}
                                            data={basicDetails.text_format || ""}
                                            disabled={true}
                                        />
                                    </div>
                                </pre> */}
                            </div>
                        ) : null}

                        {keys.length > 0 &&
                            keys.map((keyItem, i) => (
                                <>
                                    {config[keyItem]?.label === "Report Notes" ? (
                                        <div className={`col comment p-0 border-left`}>
                                            <h3>Report Notes</h3>
                                            <pre>
                                                <div
                                                    className="contDtl notes-template-style"
                                                    dangerouslySetInnerHTML={{ __html: basicDetails.description }}
                                                ></div>
                                            </pre>
                                        </div>
                                    ) : (
                                        config[keyItem]?.isTextArea && (
                                            <div className={`col comment p-0 border-left`}>
                                                <h3>{config[keyItem]?.label}</h3>
                                                <pre>
                                                    <div className="contDtl">{basicDetails[keyItem] || "-"}</div>
                                                </pre>
                                            </div>
                                        )
                                    )}
                                </>
                            ))}
                    </div>
                </div>
                {this.renderMultiSelectionModal()}
                {this.renderBenchmarkConfirmationModal()}
            </React.Fragment>
        );
    }
}

export default withRouter(BasicDetails);
