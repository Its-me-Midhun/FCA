import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";
import LoadingOverlay from "react-loading-overlay";
import TableTopIcons from "../../common/components/TableTopIcons";
import { connect } from "react-redux";
import Loader from "../../common/components/Loader";
import _, { debounce } from "lodash";
class clientSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            settings: { char_limit: null, aging: null, login_limit: null },
            character1: null,
            character2: null,
            character3: null
        };
    }

    componentDidMount() {
        this.userData = JSON.parse(localStorage.getItem("client_password"));
        this.userDachecka = JSON.parse(localStorage.getItem("character1"));
        this.userDacheck1 = JSON.parse(localStorage.getItem("character2"));
        this.userDacheck2 = JSON.parse(localStorage.getItem("character3"));

        if (localStorage.getItem("client_password")) {
            this.setState({
                settings: {
                    char_limit: this.userData.char_limit,
                    aging: this.userData.aging,
                    login_limit: this.userData.login_limit
                }
            });
        }
        console.log(this.userDachecka);
        this.setState({
            character1: this.userDachecka,
            character2: this.userDacheck1,
            character3: this.userDacheck2
        });
    }
    componentWillUpdate(nextProps, prevState) {
        if (prevState.settings !== this.state.settings) {
            const {
                settings: { pass_structure, aging, login_limit, char_limit }
            } = this.state;
            console.log(prevState.settings);
            console.log(this.state.settings);
            localStorage.setItem("client_password", JSON.stringify(prevState.settings));
        }
        if (prevState.character1 !== this.state.character1) {
            localStorage.setItem("character1", prevState.character1);
        }
        if (prevState.character2 !== this.state.character2) {
            localStorage.setItem("character2", prevState.character2);
        }
        if (prevState.character3 !== this.state.character3) {
            localStorage.setItem("character3", prevState.character3);
        }
    }

    minChar = async (value, name) => {
        this.setState({
            settings: {
                ...this.state.settings,
                char_limit: value
            }
        });

        console.log(value);
        console.log(this.state.char_limit);
    };
    Aging = async (value, name) => {
        this.setState({
            settings: {
                ...this.state.settings,
                [name]: value
            }
        });
    };
    loginLimits = async (value, name) => {
        this.setState({
            settings: {
                ...this.state.settings,
                [name]: value
            }
        });
    };
    toggleCheckboxChange = e => {
        e.preventDefault();
        if (e.target.type === "checkbox") {
            localStorage.setItem({ [e.target.id]: e.target.checked });
        }
    };

    render() {
        const {
            settings: { isLoading, pass_structure, aging, login_limit, char_limit },
            character1,
            character2,
            character3
        } = this.state;

        return (
            <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
                <div class="dtl-sec col-md-12">
                    <div className="table-top-menu allign-right">
                        <div className="rgt">
                            <TableTopIcons
                                hasGlobalSearch={false}
                                hasSort={false}
                                hasWildCardFilter={false}
                                hasView={false}
                                isExport={false}
                                hasHelp={true}
                                entity="miscellaneous"
                            />
                        </div>
                    </div>
                    <div className="table-section table-scroll build-fci seting-type table-froze overflow-hght" id={"miscCont"}>
                        <table className="table table-common project-settings-building-type-table  mt-0 ">
                            <thead>
                                <tr>
                                    <th className="img-sq-box">
                                        <img alt="" src="/img/sq-box.png" />
                                    </th>
                                    <th className="build-add">Type</th>
                                    <th className="build-add">Option</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="img-sq-box">
                                        <img alt="" src="/img/sq-box.png" />
                                    </td>
                                    <td> Password Structure</td>
                                    <td className="fy-dtl">
                                        <div className="button-group" style={{ margin: "initial" }}>
                                            <div className="yes-button ml-2">
                                                <input
                                                    type="checkbox"
                                                    value="character1"
                                                    checked={character1}
                                                    name="character1"
                                                    multiple="true"
                                                    onChange={e => {
                                                        this.setState({
                                                            character1: e.target.checked
                                                        });
                                                    }}
                                                />
                                                <label>At least one special character</label>
                                            </div>
                                            <div className="yes-button ml-2">
                                                <input
                                                    type="checkbox"
                                                    value="character2"
                                                    checked={character2}
                                                    name="character2"
                                                    multiple="true"
                                                    onChange={e => {
                                                        this.setState({
                                                            character2: e.target.checked
                                                        });
                                                    }}
                                                />
                                                <label>At least one number</label>
                                            </div>
                                            <div className="yes-button ml-2">
                                                <input
                                                    type="checkbox"
                                                    value="character3"
                                                    checked={character3}
                                                    name="character3"
                                                    multiple="true"
                                                    onChange={e => {
                                                        this.setState({
                                                            character3: e.target.checked
                                                        });
                                                    }}
                                                />
                                                <label>At least one uppercase and lowercase letters</label>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="img-sq-box">
                                        <img alt="" src="/img/sq-box.png" />
                                    </td>
                                    <td>Minimum Characters</td>
                                    <td className="fy-dtl">
                                        <div className="button-group" style={{ margin: "initial" }}>
                                            <NumberFormat
                                                autoComplete={"nope"}
                                                className="custom-input form-control"
                                                // placeholder="CRV"
                                                name="char_limit"
                                                value={char_limit}
                                                displayType={"input"}
                                                onValueChange={values => this.minChar(values.value, "char_limit")}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="img-sq-box">
                                        <img alt="" src="/img/sq-box.png" />
                                    </td>
                                    <td>Aging</td>
                                    <td className="fy-dtl">
                                        <div className="button-group" style={{ margin: "initial" }}>
                                            <NumberFormat
                                                autoComplete={"nope"}
                                                className="custom-input form-control"
                                                placeholder="Months"
                                                name="aging"
                                                value={aging}
                                                displayType={"input"}
                                                suffix={" Months"}
                                                onValueChange={values => this.Aging(values.value, "aging")}
                                            />
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="img-sq-box">
                                        <img alt="" src="/img/sq-box.png" />
                                    </td>
                                    <td>Login Attempts Limit</td>
                                    <td className="fy-dtl">
                                        <div className="button-group" style={{ margin: "initial" }}>
                                            <NumberFormat
                                                autoComplete={"nope"}
                                                className="custom-input form-control"
                                                // placeholder="CRV"
                                                name="Maximum Login Attempts Limit"
                                                value={login_limit}
                                                displayType={"input"}
                                                onValueChange={values => this.loginLimits(values.value, "login_limit")}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = state => {
    const { clientReducer } = state;
    return { clientReducer };
};

export default withRouter(clientSettings);
