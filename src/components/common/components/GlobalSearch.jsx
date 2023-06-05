import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class GlobalSearch extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }
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

    toggleShowInputField = async e => {
        await this.setState({ showInputField: !this.state.showInputField });
        if (this.state.showInputField && this.inputRef?.current) {
            this.inputRef.current.focus();
        }
    };

    handleCloseIconClick = () => {
        if (!this.state.inputValue) {
            this.toggleShowInputField();
        }
        this.setState({ inputValue: "" });
        if (this.props.globalSearchKey) {
            this.props.handleGlobalSearch("");
        }
        // this.toggleShowInputField();
    };

    render() {
        const { showInputField } = this.state;
        const { customClass = "" } = this.props;
        return (
            <React.Fragment>
                <div className="search" id="search-global">
                    {showInputField ? (
                        <form id="serach-sec">
                            <input
                                type="search"
                                ref={this.inputRef}
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
                                placeholder="Search"
                            />
                            <i className="fas fa-times" onClick={() => this.handleCloseIconClick()}></i>
                        </form>
                    ) : (
                        <div
                            className={`search-icn ${customClass}`}
                            onClick={() => this.toggleShowInputField()}
                            data-for="table-top-icons"
                            data-tip={`Global Search`}
                        >
                            <img src="/img/search.svg" alt="" />
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(GlobalSearch);
