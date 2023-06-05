import React, { Component } from "react";

class FormData extends Component {
    renderData = () => {
        const { logArray, graphArray, efciArray, formArray, menuArray } = this.props;
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
        const { activeTabHeaders, areAllValuesChecked, selectAllValuesInColumn, activeTabItems, activeTab, formParams, updateFormValues } =
            this.props;

        return (
            <div className="table-section table-scroll user-permision">
                <table className="table table-common table-min-height mt-0 tbl-area">
                    <thead>
                        <tr>
                            <th className=" cursor-pointer">Title </th>
                            {activeTabHeaders && activeTabHeaders.length
                                ? activeTabHeaders.map(item => (
                                      <th className=" cursor-pointer">
                                          <label className="container-check">
                                              {item}
                                              <input type="checkbox" checked={areAllValuesChecked(item)} />
                                              <span className="checkmark" onClick={() => selectAllValuesInColumn(item)}></span>
                                          </label>
                                      </th>
                                  ))
                                : null}
                        </tr>
                    </thead>
                    <tbody>
                        {activeTabItems
                            ? Object.keys(activeTabItems).map(item =>
                                  activeTab === "menu" ? (
                                      <>
                                          <tr className="table-row">
                                              <td>{item}</td>
                                              <td>
                                                  <label className={`container-check ${formParams[activeTab][item].view === null ? "disabled" : ""}`}>
                                                      <input
                                                          type="checkbox"
                                                          checked={
                                                              formParams[activeTab] &&
                                                              formParams[activeTab][item].view !== null &&
                                                              formParams[activeTab][item].view
                                                          }
                                                          disabled={formParams[activeTab][item].view === null ? true : false}
                                                          onClick={() => updateFormValues(activeTab, item, null, !formParams[activeTab][item].view)}
                                                      />
                                                      <span className={`checkmark`}></span>
                                                  </label>
                                              </td>
                                          </tr>
                                          {Object.keys(formParams[activeTab][item]).length > 1
                                              ? Object.keys(formParams[activeTab][item]).map(submenu =>
                                                    submenu !== "view" ? (
                                                        <tr className="table-row">
                                                            <td className="template-form-submenu">&nbsp;&nbsp;{submenu}</td>
                                                            <td className="template-form-submenu">
                                                                <label
                                                                    className={`container-check ${
                                                                        formParams[activeTab][item][submenu].view === null ? "disabled" : ""
                                                                    }`}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            formParams[activeTab] &&
                                                                            formParams[activeTab][item][submenu].view !== null &&
                                                                            formParams[activeTab][item][submenu].view
                                                                        }
                                                                        disabled={formParams[activeTab][item][submenu].view === null ? true : false}
                                                                        onClick={() =>
                                                                            updateFormValues(
                                                                                activeTab,
                                                                                item,
                                                                                submenu,
                                                                                !formParams[activeTab][item][submenu].view
                                                                            )
                                                                        }
                                                                    />
                                                                    <span className={`checkmark`}></span>
                                                                </label>
                                                            </td>
                                                        </tr>
                                                    ) : null
                                                )
                                              : null}
                                      </>
                                  ) : (
                                      <tr className="table-row">
                                          <td>{item}</td>
                                          {Object.keys(activeTabItems[item]).map((subItem, i) => (
                                              <td>
                                                  <label
                                                      className={`container-check ${formParams[activeTab][item][subItem] === null ? "disabled" : ""}`}
                                                  >
                                                      <input
                                                          type="checkbox"
                                                          checked={
                                                              formParams[activeTab][item][subItem] !== null && formParams[activeTab][item][subItem]
                                                          }
                                                          disabled={formParams[activeTab][item][subItem] === null ? true : false}
                                                          onClick={() =>
                                                              updateFormValues(activeTab, item, subItem, !formParams[activeTab][item][subItem])
                                                          }
                                                      />
                                                      <span className={`checkmark`}></span>
                                                  </label>
                                              </td>
                                          ))}
                                      </tr>
                                  )
                              )
                            : null}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default FormData;
