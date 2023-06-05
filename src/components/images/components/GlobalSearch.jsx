import React, { Component } from "react";
import ReactTooltip from "react-tooltip";

export default class GlobalSearch extends Component {
    state = {
        showInputField: this.props.globalSearchKey && this.props.globalSearchKey.length ? true : false,
        inputValue: this.props.globalSearchKey
    };

    componentDidUpdate = prevProps => {
        if (prevProps.globalSearchKey !== this.props.globalSearchKey) {
            this.setState({
                showInputField: this.props.globalSearchKey && this.props.globalSearchKey.length ? true : false,
                inputValue: this.props.globalSearchKey
            });
        }
    };

    handleGlobalSearch = e => {
        e.preventDefault();
        if (e.target.value.trim().length) {
            this.props.handleGlobalSearch(e.target.value);
        }
    };

    handleClickSearch = e => {
        e.preventDefault();
        const { inputValue } = this.state;
        this.setState({ showInputField: true });
        if (inputValue?.trim().length) {
            this.props.handleGlobalSearch(inputValue);
        }
    };

    handleCloseIconClick = () => {
        if (this.state.inputValue) {
            this.setState({ inputValue: "" });
            if (this.props.globalSearchKey) {
                this.props.handleGlobalSearch("");
            }
        } else {
            this.setState({ showInputField: false });
        }
    };
    render() {
        const { showInputField } = this.state;

        return (
            <div className="form-item search">
                {showInputField && (
                    <form id="serach-sec">
                        <input
                            type="text"
                            onKeyPress={event => {
                                if (event.key === "Enter") {
                                    this.handleGlobalSearch(event);
                                }
                            }}
                            onChange={event => {
                                this.setState({ inputValue: event.target.value });
                                if (!event.target.value.trim().length) {
                                    this.props.globalSearchKey && this.props.handleGlobalSearch("");
                                }
                            }}
                            value={this.state.inputValue}
                            className="form-control"
                            placeholder="Search"
                        />
                        <i
                            style={{ position: "absolute", right: 54 }}
                            className="fas fa-times cursor-hand"
                            onClick={() => this.handleCloseIconClick()}
                        ></i>
                    </form>
                )}
                <button
                    data-place="bottom"
                    data-effect="solid"
                    data-tip={`Search`}
                    data-for="global-search"
                    data-background-color="#007bff"
                    className="btn btn-serch"
                    onClick={e => this.handleClickSearch(e)}
                >
                    <svg id="search" xmlns="http://www.w3.org/2000/svg" width="16.621" height="16.621" viewBox="0 0 16.621 16.621">
                        <g id="Group_24" data-name="Group 24">
                            <g id="Group_23" data-name="Group 23">
                                <path
                                    id="Path_41"
                                    data-name="Path 41"
                                    d="M7.32,0a7.32,7.32,0,1,0,7.32,7.32A7.328,7.328,0,0,0,7.32,0Zm0,13.288A5.968,5.968,0,1,1,13.288,7.32,5.975,5.975,0,0,1,7.32,13.288Z"
                                    fill="#8195a5"
                                />
                            </g>
                        </g>
                        <g id="Group_26" data-name="Group 26" transform="translate(11.396 11.396)">
                            <g id="Group_25" data-name="Group 25">
                                <path
                                    id="Path_42"
                                    data-name="Path 42"
                                    d="M356.073,355.117l-3.874-3.874a.676.676,0,0,0-.955.955l3.874,3.874a.676.676,0,0,0,.955-.955Z"
                                    transform="translate(-351.046 -351.046)"
                                    fill="#8195a5"
                                />
                            </g>
                        </g>
                    </svg>
                </button>
                <ReactTooltip id="global-search" />
            </div>
        );
    }
}
