import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import InsertModal from "./InsertModal";
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
        insertList: [],
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
        await this.props.getAllInserts();
        const { insertResponse } = this.props;
        let insertResult = insertResponse
            ? insertResponse.filter((item, i) => {
                  if (item.default_insert) {
                      item.index = i;
                      return item;
                  }
              })
            : [];
        await this.setState({
            insertList: insertResponse,
            selectedInsert: {
                image: (insertResult && insertResult[0]) || (insertResponse && insertResponse[0]),
                index: insertResult && insertResult.length ? insertResult[0].index : 0
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
        const { insertList } = this.state;
        await this.setState({
            selectedInsert: { image: insertList[i], index: i }
        });
    };

    handleKeyPress = e => {
        const { selectedInsert, insertList } = this.state;
        if (e.keyCode === 39 || e.keyCode === 40) {
            e.preventDefault();
            this.setSelectedInsert(selectedInsert.index === insertList.length - 1 ? 0 : selectedInsert.index + 1);
            this.scrollImageList(selectedInsert.index === insertList.length - 1 ? 0 : selectedInsert.index + 1);
        } else if (e.keyCode === 37 || e.keyCode === 38) {
            e.preventDefault();
            this.setSelectedInsert(selectedInsert.index === 0 ? insertList.length - 1 : selectedInsert.index - 1);
            this.scrollImageList(selectedInsert.index === 0 ? insertList.length - 1 : selectedInsert.index - 1);
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
        const { insertList } = this.state;
        const { hasCreate, hasEdit, narrativeCompleted } = this.props;
        return (
            <InsertModal
                setIsUnsaved={this.props.setIsUnsaved}
                uploadInsert={this.uploadInsert}
                deleteInsert={this.deleteInsert}
                updateInsert={this.updateInsert}
                insertList={insertList}
                narrativeCompleted={narrativeCompleted}
                autoPopulateTableTemplates={this.autoPopulateTableTemplates}
                checkIfNarrativeTableUsed={this.props.checkIfNarrativeTableUsed}
                hasEdit={hasEdit}
                hasCreate={hasCreate}
            />
        );
    }
}

export default withRouter(Insert);
