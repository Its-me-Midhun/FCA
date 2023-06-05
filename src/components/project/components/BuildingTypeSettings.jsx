import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import Portal from "../../common/components/Portal";
import TableTopIcons from "../../common/components/TableTopIcons";
import ConfirmationModal from "../../common/components/ConfirmationModal";

class BuildingTypeSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allSelectTrue: [],
            columnSelect: {},
            data1: [],
            buttonDisable: true,
            array1: [],
            commonParams: {},
            idList: [],
            rowSeleted: false,
            columnSelectData: {},
            toggleData: {},
            showConfirmModal: false
        };
    }

    componentDidMount() {
        this.setState({
            initialState: this.props.buildingTypetableData
        });
    }
    initialstatevalues = {
        allSelectTrue: [],
        columnSelect: {},
        data1: [],
        buttonDisable: true,
        array1: [],
        commonParams: {},
        idList: [],
        rowSeleted: false,
        columnSelectData: {},
        toggleData: {},
        showConfirmModal: false,
        initialState: this.props.buildingTypetableData
    };
    // componentDidUpdate(prevProps) {
    //     if (prevProps.buildingTypetableData !== this.props.buildingTypetableData) {
    //         this.setState({
    //             initialState: this.props.buildingTypetableData
    //         })
    //     }
    // }

    handleRowSelect = async dataItem => {
        await this.setState({
            buttonDisable: false,
            initialState: this.props.buildingTypetableData
        });

        const {
            match: {
                params: { id: project_id }
            },
            buildingTypetableData: { keys },
            updateBuildingTypeSettings,
            toggleLoader
        } = this.props;
        let params = { [dataItem.id]: {} };
        keys.map(keyItem => {
            if (keyItem !== "name") {
                params[dataItem.id][keyItem] = !this.isRowTure(dataItem);
            }
        });
        this.setState({
            allSelectTrue: params,
            projectId: project_id,
            rowCheckbox: true
        });
    };

    // handleColumnSelect = async columnKey => {
    //     const {
    //         match: {
    //             params: { id: project_id }
    //         },
    //         buildingTypetableData: { data },
    //         updateBuildingTypeSettings,
    //         toggleLoader
    //     } = this.props;
    //     let params = {};
    //     data.map(dataItem => {
    //         params[dataItem.id] = {};
    //         params[dataItem.id][columnKey] = !this.isColumnTure(columnKey);
    //     });

    //     this.setState({
    //         columnSelect: params,
    //         projectId: project_id
    //     });
    //     await toggleLoader();
    //     await updateBuildingTypeSettings(project_id, params);
    //     await toggleLoader();
    // };

    isColumnTure = columnKey => {
        const {
            buildingTypetableData: { data }
        } = this.props;
        let returnVal = true;
        data.map(dataItem => {
            if (dataItem[columnKey] === false) {
                returnVal = false;
            }
        });
        return returnVal;
    };

    isRowTure = dataItem => {
        const {
            buildingTypetableData: { keys }
        } = this.props;
        let returnVal = true;
        keys.map(keyItem => {
            if (keyItem !== "name") {
                if (dataItem[keyItem] === false) {
                    returnVal = false;
                }
            }
        });
        return returnVal;
    };

    updateBuildingType = async () => {
        const { toggleLoader, updateBuildingTypeSettings } = this.props;
        const { toggleData } = this.state;
        await toggleLoader();
        await updateBuildingTypeSettings(this.props.match.params.id, toggleData);
        await toggleLoader();
    };

    rowSelect = async (key, event) => {
        console.log("rowSelect");
        let rowSelect = this.state.toggleData;
        this.props.handleSelectRow(key, event.target.checked);
        this.props.buildingTypetableData.data.map(item => {
            const idExist = Object.keys(this.state.toggleData).includes(item.id);
            if (idExist) {
                rowSelect = { ...rowSelect, [item.id]: { ...rowSelect[item.id], [key]: event.target.checked } };
            } else {
                rowSelect = { ...rowSelect, [item.id]: { [key]: event.target.checked } };
            }
        });
        this.setState({
            toggleData: rowSelect
        });
    };

    columnSelect = (id, event) => {
        const { buildingTypetableData } = this.props;
        this.props.handleColumnselect(id, event.target.checked);
        let tempData1 = buildingTypetableData;
        let params = { ...this.state.toggleData, [id]: {} };
        tempData1.keys.map(keyItem => {
            if (keyItem !== "name") {
                params[id][keyItem] = event.target.checked;
            }
        });
        this.setState({
            columnSelectData: params,
            toggleData: params
        });
    };

    handleSelectData = (id, key, value) => {
        this.props.handleSelectTrue(id, key, value);
        let data = this.state.toggleData;
        const idExist = Object.keys(this.state.toggleData).includes(id);
        if (idExist) {
            data = { ...data, [id]: { ...data[id], [key]: value } };
        } else {
            data = { ...data, [id]: { [key]: value } };
        }
        this.setState({
            toggleData: data
        });
    };

    rowChecked = key => {
        const {
            buildingTypetableData: { keys, data }
        } = this.props;
        let returnVal = true;
        data &&
            data.map(keyItem => {
                if (keyItem !== "name") {
                    if (keyItem[key] === false) {
                        returnVal = false;
                    }
                }
            });
        return returnVal;
    };

    columnChecked = dataItem => {
        const {
            buildingTypetableData: { keys }
        } = this.props;
        let returnVal = true;
        keys.map(keyItem => {
            if (keyItem !== "name") {
                if (dataItem[keyItem] === false) {
                    returnVal = false;
                }
            }
        });
        return returnVal;
    };

    // openCancelPanel = () => {
    //     this.setState({
    //         showConfirmModal: true
    //     })
    // }

    openCancelPanel = () => {
        this.setState({
            allSelectTrue: [],
            columnSelect: {},
            data1: [],
            buttonDisable: true,
            array1: [],
            commonParams: {},
            idList: [],
            rowSeleted: false,
            columnSelectData: {},
            toggleData: {}
        });
        if (_.isEqual(this.state, this.initialstatevalues)) {
            this.setState({
                showConfirmModal: false
            });
        } else {
            this.setState({
                showConfirmModal: true
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
                        heading={"Do you want to clear and lose all changes?"}
                        type="cancel"
                        message={"This action cannot be reverted, are you sure that you need to cancel?"}
                        onNo={() => this.setState({ showConfirmModal: false })}
                        onYes={() => {
                            this.revertBuildingData();
                        }}
                    />
                }
                onCancel={() => this.setState({ showConfirmModal: false })}
            />
        );
    };

    revertBuildingData = async () => {
        await this.props.revertBuildingData(this.state.initialState);
        this.setState({
            showConfirmModal: false
        });
    };

    render() {
        const {
            match: {
                params: { id: project_id }
            },
            buildingTypetableData
        } = this.props;

        return (
            <>
                <div className="table-top-menu allign-right">
                    <div className="rgt">
                        <TableTopIcons
                            hasGlobalSearch={false}
                            hasSort={false}
                            hasWildCardFilter={false}
                            hasView={false}
                            isExport={false}
                            hasHelp={true}
                            entity="building_types"
                        />
                    </div>
                </div>
                <div className="table-section table-scroll build-fci seting-type table-froze height-auto">
                    <table className="table table-common project-settings-building-type-table">
                        <thead>
                            <tr>
                                <th className="img-sq-box">
                                    <img alt="" src="/img/sq-box.png" />
                                </th>
                                <th className="build-add">Building Type</th>
                                {buildingTypetableData && buildingTypetableData.data && buildingTypetableData.data.length
                                    ? buildingTypetableData.data.map(item => (
                                          <th className="fy-dtl">
                                              <div className="hed-cheker">
                                                  <label className="container-checkbox">
                                                      <input
                                                          type="checkbox"
                                                          onClick={event => this.columnSelect(item.id, event)}
                                                          checked={this.columnChecked(item)}
                                                      />
                                                      <span className="checkmark"></span>
                                                  </label>
                                                  {item.name}
                                              </div>
                                          </th>
                                      ))
                                    : null}
                            </tr>
                        </thead>
                        <tbody>
                            {buildingTypetableData && buildingTypetableData.keys && buildingTypetableData.keys.length ? (
                                buildingTypetableData.keys
                                    .filter(f => f !== "name")
                                    .map(key => (
                                        <>
                                            <tr>
                                                <td>
                                                    <label className="container-checkbox cursor-hand">
                                                        <input
                                                            type="checkbox"
                                                            onClick={event => this.rowSelect(key, event)}
                                                            checked={this.rowChecked(key)}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </td>
                                                <td>{buildingTypetableData && buildingTypetableData.config[key].label}</td>
                                                {buildingTypetableData && buildingTypetableData.data.length
                                                    ? buildingTypetableData.data.map(data => (
                                                          <td className="fy-dtl">
                                                              <div className="button-group">
                                                                  <div className="yes-button">
                                                                      <label className="container cursor-hand">
                                                                          <input
                                                                              type="radio"
                                                                              checked={data[key] ? true : false}
                                                                              onClick={() => this.handleSelectData(data.id, key, true)}
                                                                          />
                                                                          <span className="checkmark"></span>
                                                                          Yes
                                                                      </label>
                                                                  </div>
                                                                  <div className="no-button">
                                                                      <label className="container">
                                                                          <input
                                                                              type="radio"
                                                                              checked={data[key] ? false : true}
                                                                              onClick={() => this.handleSelectData(data.id, key, false)}
                                                                          />
                                                                          <span className="checkmark"></span>
                                                                          NO
                                                                      </label>
                                                                  </div>
                                                              </div>
                                                          </td>
                                                      ))
                                                    : null}
                                            </tr>
                                        </>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>No data found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="add-btn-wrapper pt-0">
                    <button className="button btn-save ml-2" onClick={() => this.openCancelPanel()}>
                        Cancel
                    </button>
                    <button className="button btn-save ml-2 cursor-hand" onClick={() => this.updateBuildingType()}>
                        Save
                    </button>
                </div>
                {this.renderConfirmationModal()}
            </>
        );
    }
}

export default withRouter(BuildingTypeSettings);
