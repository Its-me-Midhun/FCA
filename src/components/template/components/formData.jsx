import React, { Component } from "react";

class FormData extends Component {
    renderData = () => {
        const { logArray, graphArray, efciArray, formArray, menuArray } = this.props;
        console.log("this.props.tabData", this.props.tabData);

        switch (this.props.tabData) {
            case "form":
                return formArray;
            case "efci":
                return efciArray;
            case "menu":
                return menuArray;
            case "charts_graphs":
                return graphArray;
            case "log":
                return logArray;
        }
    };

    render() {
        const { formContent, logArray, graphArray, efciArray, formArray, fullChecked, menuArray, handleCheck, handleSelectAll } = this.props;
        let currentContent = this.renderData();

        return (
            <div className="table-section table-scroll">
                <table className="table table-common table-min-height mt-0 tbl-area">
                    <thead>
                        <tr>
                            <th className=" cursor-pointer">Title </th>
                            <th className="reg-name cursor-pointer">
                                <label className="container-check">
                                    View
                                    <input
                                        type="checkbox"
                                        checked={fullChecked && fullChecked[this.props.tabData]["view"]}
                                        onChange={e => handleSelectAll(e, "view", this.props.tabData)}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            </th>
                            {this.props.tabData == "form" ? (
                                <th className="client-wid cursor-pointer">
                                    <label className="container-check">
                                        Create
                                        <input
                                            type="checkbox"
                                            checked={fullChecked && fullChecked[this.props.tabData]["create"]}
                                            onChange={e => handleSelectAll(e, "create", this.props.tabData)}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </th>
                            ) : null}
                            {this.props.tabData == "efci" ? (
                                <th className=" cursor-pointer">
                                    <label className="container-check">
                                        Sandbox
                                        <input
                                            type="checkbox"
                                            checked={fullChecked && fullChecked[this.props.tabData]["sandbox"]}
                                            onChange={e => handleSelectAll(e, "sandbox", this.props.tabData)}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </th>
                            ) : null}
                            {this.props.tabData == "form" || this.props.tabData == "efci" ? (
                                <th className=" cursor-pointer">
                                    <label className="container-check">
                                        Edit
                                        <input
                                            type="checkbox"
                                            checked={fullChecked && fullChecked[this.props.tabData]["edit"]}
                                            onChange={e => handleSelectAll(e, "edit", this.props.tabData)}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </th>
                            ) : null}
                            {this.props.tabData == "log" ? (
                                <th className=" cursor-pointer">
                                    <label className="container-check">
                                        Restore
                                        <input
                                            type="checkbox"
                                            checked={fullChecked && fullChecked[this.props.tabData]["restore"]}
                                            onChange={e => handleSelectAll(e, "restore", this.props.tabData)}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </th>
                            ) : null}

                            {this.props.tabData == "form" || this.props.tabData == "log" ? (
                                <th className=" cursor-pointer">
                                    <label className="container-check">
                                        Delete
                                        <input
                                            type="checkbox"
                                            checked={fullChecked && fullChecked[this.props.tabData]["delete"]}
                                            onChange={e => handleSelectAll(e, "delete", this.props.tabData)}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </th>
                            ) : null}
                            {this.props.tabData == "form" || this.props.tabData == "charts_graphs" ? (
                                <th className=" cursor-pointer">
                                    <label className="container-check">
                                        Export
                                        <input
                                            type="checkbox"
                                            checked={fullChecked && fullChecked[this.props.tabData]["export"]}
                                            onChange={e => handleSelectAll(e, "export", this.props.tabData)}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </th>
                            ) : null}
                        </tr>
                    </thead>
                    <tbody>
                        {currentContent
                            ? Object.keys(currentContent).map((fc, i) => {
                                  return (
                                      <tr key={i}>
                                          <td>{fc}</td>
                                          <td>
                                              <label
                                                  className={
                                                      currentContent[fc] && currentContent[fc].hasOwnProperty("view")
                                                          ? "container-check"
                                                          : "container-check disabled"
                                                  }
                                              >
                                                  <input
                                                      type="checkbox"
                                                      onChange={e => handleCheck(e, fc, "view")}
                                                      checked={currentContent[fc] && currentContent[fc].view}
                                                      disabled={currentContent[fc] && !currentContent[fc].hasOwnProperty("view")}
                                                  />
                                                  <span className="checkmark"></span>
                                              </label>
                                          </td>
                                          {this.props.tabData == "form" ? (
                                              <td>
                                                  <label
                                                      className={
                                                          currentContent[fc] && currentContent[fc].hasOwnProperty("create")
                                                              ? "container-check"
                                                              : "container-check disabled"
                                                      }
                                                  >
                                                      <input
                                                          type="checkbox"
                                                          onChange={e => handleCheck(e, fc, "create")}
                                                          checked={currentContent[fc] && currentContent[fc].create}
                                                          disabled={currentContent[fc] && !currentContent[fc].hasOwnProperty("create")}
                                                      />
                                                      <span className="checkmark"></span>
                                                  </label>
                                              </td>
                                          ) : null}
                                          {this.props.tabData == "efci" ? (
                                              <td>
                                                  <label
                                                      className={
                                                          currentContent[fc] && currentContent[fc].hasOwnProperty("sandbox")
                                                              ? "container-check"
                                                              : "container-check disabled"
                                                      }
                                                  >
                                                      <input
                                                          type="checkbox"
                                                          onChange={e => handleCheck(e, fc, "sandbox")}
                                                          checked={currentContent[fc] && currentContent[fc].sandbox}
                                                          disabled={currentContent[fc] && !currentContent[fc].hasOwnProperty("sandbox")}
                                                      />
                                                      <span className="checkmark"></span>
                                                  </label>
                                              </td>
                                          ) : null}
                                          {this.props.tabData == "form" || this.props.tabData == "efci" ? (
                                              <td>
                                                  <label
                                                      className={
                                                          currentContent[fc] && currentContent[fc].hasOwnProperty("edit")
                                                              ? "container-check"
                                                              : "container-check disabled"
                                                      }
                                                  >
                                                      <input
                                                          type="checkbox"
                                                          onChange={e => handleCheck(e, fc, "edit")}
                                                          disabled={currentContent[fc] && !currentContent[fc].hasOwnProperty("edit")}
                                                          checked={currentContent[fc] && currentContent[fc].edit}
                                                      />
                                                      <span className="checkmark"></span>
                                                  </label>
                                              </td>
                                          ) : null}
                                          {this.props.tabData == "log" ? (
                                              <td>
                                                  <label
                                                      className={
                                                          currentContent[fc] && currentContent[fc].hasOwnProperty("restore")
                                                              ? "container-check"
                                                              : "container-check disabled"
                                                      }
                                                  >
                                                      <input
                                                          type="checkbox"
                                                          onChange={e => handleCheck(e, fc, "restore")}
                                                          disabled={currentContent[fc] && !currentContent[fc].hasOwnProperty("restore")}
                                                          checked={currentContent[fc] && currentContent[fc].restore}
                                                      />
                                                      <span className="checkmark"></span>
                                                  </label>
                                              </td>
                                          ) : null}
                                          {this.props.tabData == "form" || this.props.tabData == "log" ? (
                                              <td>
                                                  <label
                                                      className={
                                                          currentContent[fc] && currentContent[fc].hasOwnProperty("delete")
                                                              ? "container-check"
                                                              : "container-check disabled"
                                                      }
                                                  >
                                                      <input
                                                          type="checkbox"
                                                          onChange={e => handleCheck(e, fc, "delete")}
                                                          disabled={currentContent[fc] && !currentContent[fc].hasOwnProperty("delete")}
                                                          checked={currentContent[fc] && currentContent[fc].delete}
                                                      />
                                                      <span className="checkmark"></span>
                                                  </label>
                                              </td>
                                          ) : null}
                                          {this.props.tabData == "form" || this.props.tabData == "charts_graphs" ? (
                                              <td>
                                                  <label
                                                      className={
                                                          currentContent[fc] && currentContent[fc].hasOwnProperty("export")
                                                              ? "container-check"
                                                              : "container-check disabled"
                                                      }
                                                  >
                                                      <input
                                                          type="checkbox"
                                                          onChange={e => handleCheck(e, fc, "export")}
                                                          disabled={currentContent[fc] && !currentContent[fc].hasOwnProperty("export")}
                                                          checked={currentContent[fc] && currentContent[fc].export}
                                                      />
                                                      <span className="checkmark"></span>
                                                  </label>
                                              </td>
                                          ) : null}
                                      </tr>
                                  );
                              })
                            : null}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default FormData;
