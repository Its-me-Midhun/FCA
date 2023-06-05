import React, { Component } from "react";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import Loader from "../../common/components/Loader";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import Portal from "../../common/components/Portal";
import actions from "../actions";
import { connect } from "react-redux";
import { AssetSettingsEntities } from "../config";

import exclmIcon from "../../../assets/img/recom-icon.svg";
import ReactColorPicker from "./ReactColorPicker";
class PieChartForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isUploading: false,
            errorMessage: "",
            data: {
                name: "",
                client_id: "",
                color_code: ""
            },
            errorParams: {
                name: ""
            },
            initialValues: {},
            showConfirmModal: false,
            showErrorBorder: false,
            pieChartData: [
                { title: "2 Years", color: "" },
                { title: "3-5 Years", color: "" },
                { title: "6-10 Years", color: "" },
                { title: "10+ Years", color: "" },
                { title: "Unknown", color: "" },
                { title: "Expired", color: "" },
                { title: "Next year", color: "" }
            ]
        };
    }

    componentDidMount = async () => {
        this.props.getDropdownList("clients", { order: { "clients.name": "asc" } });
        if (this.props.selectedData) {
            let resData = await this.props.getSettingDataById();
            if (resData.success) {
                await this.setState({
                    data: {
                        client_id: resData?.client?.id,
                        name: resData?.client?.name,
                    },
                    pieChartData: [
                        { title: "2 Years", color: resData?.unknown},
                        { title: "3-5 Years", color: resData?.three_to_five },
                        { title: "6-10 Years", color: resData?.six_to_ten },
                        { title: "10+ Years", color: resData?.ten_plus },
                        { title: "Unknown", color: resData?.unknown },
                        { title: "Expired", color: resData?.expired },
                        { title: "Next year", color:  resData?.next_year  }
                    ]

                });
            }
        }
        await this.setState({
            initialValues: this.state.data,
            isLoading: false
        });
    };

    onChange = (color, index) => {
        console.log("fg",color.hex)
        const staticData = this.state.pieChartData;
        staticData[index] = { ...staticData[index], color: color?.hex };
        this.setState({
            pieChartData: staticData
        });
    };

    validate = () => {
        const { data } = this.state;
        let errorParams = {
            name: false
        };
        let showErrorBorder = false;

        // if (!data.name || !data.name?.trim()?.length) {
        //     errorParams.name = true;
        //     showErrorBorder = true;
        // }
        if (!data.client_id || !data.client_id?.trim()?.length) {
            errorParams.client_id = true;
            showErrorBorder = true;
        }
        this.setState({
            showErrorBorder,
            errorParams
        });
        if (showErrorBorder) return false;
        return true;
    };

    // addData = async () => {
    //     const { data } = this.state;
    //     const { handleAddData } = this.props;
    //     if (this.validate()) {
    //         this.setState({
    //             isUploading: true
    //         });
    //         await handleAddData(data);
    //         this.setState({
    //             isUploading: false
    //         });
    //     }
    // };

    updateData = async () => {
        const { data, pieChartData } = this.state;
        const param = { client_id: data.client_id, color_codes: pieChartData.reduce((a, v) => ({ ...a, [v.title]: v.color }), {}) };
        const { handleUpdateData } = this.props;
        if (this.validate()) {
            this.setState({
                isUploading: true
            });
            await handleUpdateData(param);
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
        if (_.isEqual(this.state.initialValues, this.state.data)) {
            this.clearForm();
        } else {
            this.setState({
                showConfirmModal: true
            });
        }
    };

    clearForm = async () => {
        const { cancelForm } = this.props;
        await this.setState({
            data: {
                name: ""
            }
        });
        cancelForm();
    };

    isIterable = obj => {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === "function";
    };

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            data: {
                ...this.state.data,
                [name]: value
            }
        });
    };

    render() {
        const { isLoading } = this.state;
        if (isLoading) return <Loader />;

        const { data, showErrorBorder, errorParams, pieChartData } = this.state;
        const {
            selectedData,
            match: {
                params: { settingType }
            },
            assetSettingsReducer: { dropDownList }
        } = this.props;
        return (
            <React.Fragment>
                <div className="dtl-sec col-md-12">
                    <div className="tab-dtl region-mng">
                        <ul>
                            <div className="recom-notify-img">
                                <img src={exclmIcon} alt="" />
                            </div>
                            <li className="active pl-4">{`Edit ${AssetSettingsEntities[settingType].name}`}</li>
                        </ul>
                        <form autoComplete={"nope"}>
                            <div className="tab-active build-dtl">
                                <div className="otr-common-edit custom-col">
                                    <div className="basic-otr">
                                        <div className="basic-dtl-otr basic-sec">
                                            <div className="col-md-4 basic-box">
                                                <div className="codeOtr">
                                                    <h4>Client *</h4>
                                                    <div className="custom-selecbox">
                                                        <select
                                                            autoComplete={"nope"}
                                                            className={`${
                                                                showErrorBorder && errorParams.client_id ? "error-border " : ""
                                                            }custom-selecbox cursor-notallowed form-control`}
                                                            name="client_id"
                                                            onChange={this.handleChange}
                                                            value={data.client_id}
                                                            disabled={true}
                                                        >
                                                            <option value="">Select</option>
                                                            {dropDownList["clients"]?.length
                                                                ? dropDownList["clients"].map((item, i) => (
                                                                      <option value={item.id} key={i}>
                                                                          {item.name}
                                                                      </option>
                                                                  ))
                                                                : null}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            {pieChartData?.map((item, index) => (
                                                <ReactColorPicker
                                                    onChange={color => this.onChange(color, index)}
                                                    title={item.title}
                                                    color={item.color}
                                                />
                                            ))}
                                            {/* <div className="col-md-4 basic-box">
                                                    <div className="codeOtr">
                                                        <h4>2 Years</h4>
                                                        <div>
                                                            <div style={styles.swatch} onClick={this.onClick}>
                                                                <div style={styles.color} />
                                                            </div>
                                                            {this.state.showPicker1 ? (
                                                                <div style={styles.popover}>
                                                                    <div style={styles.cover} onClick={this.onClose} />
                                                                    <SketchPicker
                                                                        color={this.state.data.color_code1}
                                                                        presetColors={[
                                                                            "#95cd50",
                                                                            "#ffe242",
                                                                            "#ffa105",
                                                                            "#ff0305",
                                                                            "#525252",
                                                                            "#343C65",
                                                                            "#8B572A",
                                                                            "#417505"
                                                                        ]}
                                                                        onChange={this.onChange1}
                                                                    />
                                                                </div>
                                                         ) : null} 
                                                        </div>
                                                    </div>
                                                </div> */}
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

                                    <button type="button" className="btn btn-primary btnRgion col-md-2" onClick={() => this.updateData()}>
                                        Update
                                    </button>
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
    const { assetSettingsReducer } = state;
    return { assetSettingsReducer };
};

export default withRouter(
    connect(mapStateToProps, {
        ...actions
    })(PieChartForm)
);
