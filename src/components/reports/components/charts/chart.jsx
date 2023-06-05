import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import ChartModal from "./chartModal";
import qs from "query-string";

class Insert extends Component {
    state = {
        uploadAttachmentsHeader: "Add",
        uploadAttachment: [],
        uploadError: "",
        fileChanged: false,
        showImagesModal: false,
        isLoading: true,
        showImageModal: false,
        chartList: [],
        selectedInsert: "",
        showEdit: false
    };

    componentDidMount = async () => {
        document.addEventListener("keydown", this.handleKeyPress);
        await this.refreshInsertList();
    };

    componentDidUpdate = async prevProps => {
        if (
            qs.parse(prevProps.location?.search)?.narratable_id != qs.parse(this.props.location?.search)?.narratable_id ||
            prevProps.match.params?.tab != this.props.match.params?.tab
        ) {
            this.setState({ isLoading: true });
            await this.refreshInsertList();
        }
    };

    componentWillUnmount = () => {
        document.removeEventListener("keydown", this.handleKeyPress);
    };

    refreshInsertList = async () => {
        await this.props.getNarrativeChart();
        const { chartList } = this.props;
        await this.props.getChartDetails(chartList && chartList[0]?.name);
        await this.setState({
            chartList,
            selectedInsert: {
                image: chartList && chartList[0],
                index: chartList && chartList.length ? chartList[0].index : 0
            },
            isLoading: false
        });
    };

    uploadInsert = async insertData => {
        this.setState({
            isloading: true
        });
        await this.props.uploadInsert(insertData);
        await this.refreshInsertList();
    };

    deleteInsert = async insertId => {
        this.setState({
            isloading: true
        });
        await this.props.deleteInsert(insertId);
        await this.refreshInsertList();
    };

    updateInsert = async insertData => {
        this.setState({
            isloading: true
        });
        await this.props.updateInsert(insertData);
        await this.refreshInsertList();
    };
    setSelectedInsert = async i => {
        const { chartList } = this.state;
        await this.setState({
            selectedInsert: { image: chartList[i], index: i }
        });
    };

    handleKeyPress = e => {
        const { selectedInsert, chartList } = this.state;
        if (e.keyCode === 39 || e.keyCode === 40) {
            e.preventDefault();
            this.setSelectedInsert(selectedInsert.index === chartList.length - 1 ? 0 : selectedInsert.index + 1);
            this.scrollImageList(selectedInsert.index === chartList.length - 1 ? 0 : selectedInsert.index + 1);
        } else if (e.keyCode === 37 || e.keyCode === 38) {
            e.preventDefault();
            this.setSelectedInsert(selectedInsert.index === 0 ? chartList.length - 1 : selectedInsert.index - 1);
            this.scrollImageList(selectedInsert.index === 0 ? chartList.length - 1 : selectedInsert.index - 1);
        }
    };

    scrollElement = area => {
        area === 1 ? document.getElementById("sliderSection").scrollBy(0, -50) : document.getElementById("sliderSection").scrollBy(0, 50);
    };

    scrollImageList = id => {
        let elmnt = document.getElementById(`img_id_${id}`);

        elmnt && elmnt.scrollIntoView();
    };

    openImageModal = () => {
        this.setState({
            showImageModal: true
        });
    };

    closeImageModal = () => {
        this.setState({
            showImageModal: false
        });
    };

    autoPopulateTableTemplates = async () => {
        this.setState({
            isloading: true
        });
        await this.props.autoPopulateTableTemplates();
        await this.refreshInsertList();
    };

    render() {
        const { chartList } = this.state;
        const { hasCreate, hasEdit, narrativeCompleted, getChartDetails, graphData } = this.props;
        return (
            <ChartModal
                setIsUnsaved={this.props.setIsUnsaved}
                uploadInsert={this.uploadInsert}
                deleteInsert={this.deleteInsert}
                updateInsert={this.updateInsert}
                chartList={chartList}
                getChartDetails={getChartDetails}
                narrativeCompleted={narrativeCompleted}
                autoPopulateTableTemplates={this.autoPopulateTableTemplates}
                checkIfNarrativeTableUsed={this.props.checkIfNarrativeTableUsed}
                hasEdit={hasEdit}
                hasCreate={hasCreate}
                graphData={graphData}
            />
        );
    }
}

export default withRouter(Insert);
