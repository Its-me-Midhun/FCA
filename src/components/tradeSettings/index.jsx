import React, { useEffect, useState } from "react";
import { tradeUserTableData } from "../../config/tableData";
import { addToBreadCrumpData } from "../../config/utils";
import TradeUserView from "./components/TradeUserView";
import _ from "lodash";
import Axios from "axios";
import TradeUserAdd from "./components/TradeUserAdd";
import { popBreadCrumpData } from "../../config/utils";

const TradeSettings = props => {
    const {
        match: {
            params: { settingType }
        }
    } = props;
    const initialState = {
        section: settingType,
        tableData: tradeUserTableData,
        paginationParams: {
            totalPages: 0,
            perPage: 100,
            currentPage: 0,
            totalCount: 0
        },
        showWildCardFilter: false,
        params: {},
        selectedRow: null,
        inputs: { name: "", username: "", email: "", phone: "" },
        editId: null
    };
    const [state, setState] = useState(initialState);

    useEffect(() => {
        (async () => {
            const { data } = await Axios.get("https://jsonplaceholder.typicode.com/users");
            setState({ ...state, tableData: { ...state.tableData, data }, paginationParams: { ...state.paginationParams, totalCount: data.length } });
        })();
    }, []);

    useEffect(() => {
        setState({ ...state, section: settingType });
    }, [settingType]);

    useEffect(() => {
        if (state.section === "edit" && state.editId) {
            const user = state.tableData.data.find(i => i.id === state.editId);
            if (user) setState({ ...state, inputs: { name: user.name, username: user.username, email: user.email, phone: user.phone } });
        } else {
            setState({ ...state, inputs: initialState.inputs });
        }
    }, [state.editId, state.section]);
    console.log(state.section);

    const showAddForm = () => {
        const { history } = props;

        setState({ ...state, section: "add" });
        addToBreadCrumpData({ key: "add", name: "Add Trade Users", path: "/tradeSettings/add" });
        history.push(`/tradeSettings/add`);
    };

    const isColunmVisibleChanged = () => {
        let flag = false;
        const {
            tableData: { keys, config }
        } = this.state;
        keys.map(key => {
            if (!_.isEqual(config[key]?.isVisible, tradeUserTableData.config[key]?.isVisible)) {
                flag = true;
            }
        });
        return flag;
    };

    const handlePerPageChange = ({ target: { value } }) => {
        setState({ ...state, paginationParams: { ...state.paginationParams, perPage: value } });
    };

    const toggleWildCardFilter = () => {
        setState({ ...state, showWildCardFilter: !state.showWildCardFilter });
    };

    const resetAllFilters = () => {
        setState({
            ...state,
            paginationParams: { ...state.paginationParams, totalPages: 0, perPage: 100, currentPage: 0 }
        });
    };

    const updateWildCardFilter = newFilter => {
        setState({
            ...state,
            params: {
                ...state.params,
                offset: 0,
                filters: newFilter
            },
            paginationParams: {
                ...state.paginationParams,
                currentPage: 0
            }
        });
    };

    const handleDeleteItem = async id => {
        try {
            const data = await Axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
            console.log(data);
        } catch (err) {
            console.log(err.message);
        }
    };

    const updateSelectedRow = row => {
        setState({ ...state, selectedRow: row });
    };

    const onSubmit = () => {
        console.log(state.inputs);
    };

    const showEditPage = id => {
        const { history } = props;
        setState({ ...state, editId: id, section: "edit" });
        addToBreadCrumpData({ key: "add", name: "Edit Trade Users", path: "/tradeSettings/edit" });
        history.push("/tradeSettings/edit");
    };

    const onCancel = () => {
        const { history } = props;
        setState({ ...state, section: "view" });
        history.push("/tradeSettings/view");
        popBreadCrumpData();
    };

    return (
        <div>
            {state.section === "add" ? (
                <TradeUserAdd values={state.inputs} setState={setState} state={state} onSubmit={onSubmit} onCancel={onCancel} />
            ) : state.section === "edit" ? (
                <TradeUserAdd values={state.inputs} setState={setState} state={state} onSubmit={onSubmit} onCancel={onCancel} />
            ) : (
                <TradeUserView
                    data={state.tableData}
                    showAddForm={showAddForm}
                    isColunmVisibleChanged={isColunmVisibleChanged}
                    paginationParams={state.paginationParams}
                    handlePerPageChange={handlePerPageChange}
                    showWildCardFilter={state.showWildCardFilter}
                    toggleWildCardFilter={toggleWildCardFilter}
                    resetAllFilters={resetAllFilters}
                    updateWildCardFilter={updateWildCardFilter}
                    handleDeleteItem={handleDeleteItem}
                    updateSelectedRow={updateSelectedRow}
                    showEditPage={showEditPage}
                />
            )}
        </div>
    );
};

export default TradeSettings;
