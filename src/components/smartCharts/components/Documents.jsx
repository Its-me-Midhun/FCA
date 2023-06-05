import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactPaginate from "react-paginate";
import ReactTooltip from "react-tooltip";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import LoadingOverlay from "react-loading-overlay";

import MasterFilter from "./MasterFilterForSmartChartList";
import DocumentAndImageItem from "./DoumentAndImageItem";
import DocumentUploadModal from "./DocumentUploadModal";
import Portal from "../../common/components/Portal";
import ConfirmationModal from "../../common/components/ConfirmationModal";
import actions from "../actions";
import { reorderArray } from "../../../config/utils";
import Loader from "../../common/components/Loader";
import ImageMasterModal from "../../common/components/ImageMasterModal";
import { entities } from "../../common/constants";
import ImageFullViewModal from "../../common/components/ImageFullViewModal";
import GlobalSearch from "../../common/components/GlobalSearch";

const Documents = ({ getSmartChartMasterFilterDropDown, ...props }) => {
    const [userDocs, setUserDocs] = useState([]);
    const [mFilters, setMFilter] = useState({});
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [showDocumentUploadModal, setShowDocumentUploadModal] = useState(false);
    const [showDocDeleteConfirmModal, setShowDocDeleteConfirmModal] = useState(false);
    const [paginationParams, setPaginationParams] = useState({
        totalPages: 0,
        perPage: 100,
        currentPage: 0
    });
    const [params, setParams] = useState({
        limit: 100,
        offset: 0,
        search: ""
    });
    const [defaultFilterParams, setDefaultFilterParams] = useState({});
    const refreshList = useRef(false);
    const [docRowConstructArray, setDocRowConstructArray] = useState([]);
    const [isDocOrderChanged, setIsDocOrderChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState(0);
    const [showImageAssignModal, setShowImageAssignModal] = useState(false);
    const [showImageViewModal, setShowImageViewModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const tabName = props.isImage ? "Image" : "Document";

    useEffect(() => {
        let currentUser = localStorage.getItem("userId") || "";
        getSmartChartMasterFilterDropDown("clients", "documents", { user_id: currentUser });
        // refreshUploadedDocList();
    }, []);

    const refreshUploadedDocList = async () => {
        const { limit, offset, search } = params;
        let docParams = { limit, offset, search };
        if (mFilters.client_ids) {
            docParams.client_id = mFilters.client_ids?.[0] || "";
        }
        if (props.isImage) {
            docParams.is_image = true;
        }
        setIsLoading(true);
        await props.getUploadedDocList({ ...docParams });
        setIsLoading(false);
    };

    useEffect(() => {
        if (props.smartChartReducer?.masterFilterList?.documents?.clients && !mFilters.client_ids) {
            let clientList = props.smartChartReducer.masterFilterList?.documents?.clients || [];
            if (clientList.length) {
                let defaultClient = clientList.find(client => client.default == true);
                if (defaultClient) {
                    setMFilter(prevFilter => {
                        return {
                            ...prevFilter,
                            client_ids: props.savedParams?.client_ids ? [...props.savedParams?.client_ids] : [defaultClient.id]
                        };
                    });
                    setDefaultFilterParams({
                        client_ids: [defaultClient.id]
                    });
                }
            }
        }
    }, [props.smartChartReducer.masterFilterList]);

    useEffect(() => {
        if (props.smartChartReducer.uploadedDocListResponse?.data) {
            let tempDocRowConstructArray = [];
            let allUserDocs = props.smartChartReducer.uploadedDocListResponse.data || [];
            if (allUserDocs.length) {
                let totalRows = allUserDocs.length / 4 + (allUserDocs.length % 4 ? 1 : 0);
                for (let i = 1; i <= totalRows; i++) {
                    tempDocRowConstructArray.push(i);
                }
            }
            setDocRowConstructArray([...tempDocRowConstructArray]);
            setUserDocs([...props.smartChartReducer.uploadedDocListResponse.data]);
            setCount(props.smartChartReducer.uploadedDocListResponse?.count || 0);
        }
    }, [props.smartChartReducer.uploadedDocListResponse]);

    useEffect(() => {
        if (refreshList.current) {
            refreshList.current = false;
            refreshUploadedDocList();
        }
    }, [params.limit, params.offset, params.search, paginationParams.currentPage, paginationParams.perPage]);

    useEffect(() => {
        if (mFilters.client_ids) {
            refreshUploadedDocList();
        }
    }, [mFilters, props.isImage]);

    useEffect(() => {
        if (props.smartChartReducer.deleteUserDocResponse?.success && selectedDoc) {
            showAlert(`${tabName} deleted successfully`);
            setSelectedDoc("");
        }
    }, [props.smartChartReducer.deleteUserDocResponse]);

    useEffect(() => {
        if (userDocs?.length) {
            ReactTooltip.rebuild();
        }
    }, [userDocs]);

    const uploadOrEditDocument = (doc = null) => {
        setSelectedDoc(doc);
        setShowDocumentUploadModal(true);
    };

    const renderDocumentUploadModal = () => {
        if (!showDocumentUploadModal) return null;
        return (
            <Portal
                body={
                    <DocumentUploadModal
                        onCancel={() => setShowDocumentUploadModal(false)}
                        uploadDocs={uploadDocs}
                        selectedDoc={selectedDoc}
                        editUserDoc={editUserDoc}
                        defaultClient={mFilters.client_ids?.[0] || ""}
                        tabName={tabName}
                    />
                }
                onCancel={() => setShowDocumentUploadModal(false)}
            />
        );
    };

    const uploadDocs = async docParams => {
        let currentUser = localStorage.getItem("userId") || "";
        if (props.isImage) {
            docParams.is_image = true;
        }
        await props.uploadDocsForSmartReport({ ...docParams, user: currentUser });
        await refreshUploadedDocList();
    };

    const editUserDoc = async (id, params) => {
        if (props.isImage) {
            params.is_image = true;
        }
        await props.updateUserDocData(id, params);
        await refreshUploadedDocList();
        showAlert(`${tabName} updated successfully`);
    };

    const showAlert = msg => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = msg;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };

    const handleDeleteUserDocs = id => {
        setShowDocDeleteConfirmModal(true);
        setSelectedDoc(id);
    };

    const renderDocDeleteConfirmationModal = () => {
        if (!showDocDeleteConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        heading={`Do you want to delete this ${tabName}?`}
                        message={"This action cannot be reverted, are you sure that you need to delete this item?"}
                        onNo={() => setShowDocDeleteConfirmModal(false)}
                        onYes={() => deleteDocConfirm()}
                    />
                }
                onCancel={() => setShowDocDeleteConfirmModal(false)}
            />
        );
    };

    const deleteDocConfirm = async () => {
        setShowDocDeleteConfirmModal(false);
        await props.deleteUserDocs(selectedDoc);
        await refreshUploadedDocList();
    };

    const handlePerPageChange = async e => {
        let value = e.target.value;
        setPaginationParams(prevParams => {
            return {
                ...prevParams,
                perPage: value,
                currentPage: 0
            };
        });
        setParams(prevParams => {
            return {
                ...prevParams,
                offset: 0,
                limit: value
            };
        });
        refreshList.current = true;
    };

    const handlePageClick = async page => {
        let value = page.selected;
        setPaginationParams(prevParams => {
            return {
                ...prevParams,
                currentPage: value
            };
        });
        setParams(prevParams => {
            return {
                ...prevParams,
                offset: value
            };
        });

        refreshList.current = true;
    };

    const updateMfilterForSmartChartList = async params => {
        setMFilter(prevFilter => {
            return {
                ...prevFilter,
                client_ids: [...params.filterValues]
            };
        });
        props.updateFiltersForMasterFilter({ client_ids: [...params.filterValues] });
    };

    const downloadDocs = url => {
        const link = document.createElement("a");
        link.href = url;
        link.download = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const onDragEnd = result => {
        if (!result.destination) {
            return;
        }
        let reOrderedDocs = reorderArray([...userDocs], result.source.index, result.destination.index);
        setIsDocOrderChanged(true);
        setUserDocs([...reOrderedDocs]);
    };

    const saveUserDocOrder = async () => {
        let currentDocs = [...userDocs];
        let updatedDocsWithOrder = currentDocs.map((doc, index) => {
            return { id: doc.id, order: index + 1 };
        });
        await props.updateDocOrder({ doc_data: [...updatedDocsWithOrder] });
        setIsDocOrderChanged(false);
        showAlert(`${tabName}s order updated successfully`);
    };

    const resetAllFilters = async () => {
        setParams(prevParams => {
            return {
                ...prevParams,
                search: ""
            };
        });
        setMFilter(prevFilter => {
            return {
                ...defaultFilterParams
            };
        });
        props.updateFiltersForMasterFilter({ ...defaultFilterParams });
    };

    const viewImageAssignModal = () => {
        setShowImageAssignModal(true);
    };

    const renderImageAssignModal = () => {
        if (!showImageAssignModal) return null;
        return (
            <Portal
                body={
                    <ImageMasterModal
                        // basicDetails={basicDetails}
                        entity={entities.SMART_CHARTS}
                        handleAssignImages={handleAssignImagesToSmartChart}
                        onCancel={() => setShowImageAssignModal(false)}
                        selectedFilters={mFilters}
                        isSmartChartView={true}
                        showData={false}
                    />
                }
                onCancel={() => setShowImageAssignModal(false)}
            />
        );
    };

    const handleAssignImagesToSmartChart = async imageList => {
        let selectedClient = mFilters.client_ids?.[0] || "";
        if (imageList?.images?.length) {
            let selectedImageIds = [];
            imageList.images.map(img => selectedImageIds.push(img.id));
            let assignImageParams = {
                image_upload_ids: selectedImageIds,
                client_id: selectedClient,
                user_id: localStorage.getItem("userId")
            };
            await props.assignImagesToSmartCharts(assignImageParams);
            refreshUploadedDocList();
        }
    };

    const viewImage = url => {
        setSelectedImage(url);
        setShowImageViewModal(true);
    };

    const renderImageFullViewModal = () => {
        if (!showImageViewModal) return null;
        return (
            <Portal
                body={<ImageFullViewModal imgSource={selectedImage} onCancel={() => setShowImageViewModal(false)} />}
                onCancel={() => setShowImageViewModal(false)}
            />
        );
    };
    const handleGlobalSearch = async search => {
        setParams(prevParams => {
            return {
                ...prevParams,
                search
            };
        });
        refreshList.current = true;
    };

    let masterFilterList = props.smartChartReducer.masterFilterList;
    return (
        <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
            <div className="tab-active">
                <div className="table-top-menu allign-right align-items-center">
                    <MasterFilter
                        getSmartChartMasterFilterDropDown={getSmartChartMasterFilterDropDown}
                        masterFilterList={masterFilterList?.documents}
                        selectedFiltersList={mFilters}
                        updateMfilterForSmartChartList={updateMfilterForSmartChartList}
                        filterEntity={"documents"}
                    />
                    <div className="rgt">
                        <ReactTooltip
                            id="table-top-icons"
                            effect="solid"
                            place="bottom"
                            backgroundColor="#007bff"
                            // className="rc-tooltip-custom-class"
                        />
                        {isDocOrderChanged ? (
                            <button class="btn btn-save btn-cnl save-order-btn" onClick={() => saveUserDocOrder()}>
                                Save Order Change
                            </button>
                        ) : null}
                        <GlobalSearch handleGlobalSearch={handleGlobalSearch} globalSearchKey={params.search} customClass={"search-sm-chrt"} />
                        <button
                            data-for="table-top-icons"
                            data-tip={`Reset Filters`}
                            className="btn btn-grid filtr-grid"
                            onClick={() => resetAllFilters()}
                        >
                            <img src="/img/refresh-dsh.svg" alt="" className="fil-ico" />
                        </button>
                        {tabName === "Image" ? (
                            <button className="add-build-btn" onClick={() => viewImageAssignModal()}>
                                Assign From Gallery/ Upload New Images
                            </button>
                        ) : (
                            <button className="add-build-btn" onClick={() => uploadOrEditDocument()}>
                                Add {tabName}
                            </button>
                        )}
                    </div>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="location-sec chart-smart">
                        <div className="dtl-sec">
                            <ReactTooltip
                                id="table-top-icons-grid"
                                effect="solid"
                                place="bottom"
                                backgroundColor="#007bff"
                                // className="rc-tooltip-custom-class"
                            />
                            {docRowConstructArray?.length ? (
                                docRowConstructArray.map((dropRow, index) => (
                                    <Droppable droppableId={`USERDOCS-document-${index}`} direction="horizontal">
                                        {(provided, snapshot) => (
                                            <div className="dragable-area" ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
                                                {userDocs.slice(index * 4, (index + 1) * 4).map((doc, i) => (
                                                    <Draggable
                                                        key={`draggable-doc${doc.id}`}
                                                        draggableId={`draggable-doc${doc.id}`}
                                                        index={index * 4 + i}
                                                    >
                                                        {(provided, snapshot) => {
                                                            return (
                                                                <DocumentAndImageItem
                                                                    doc={doc}
                                                                    index={i}
                                                                    uploadOrEditDocument={uploadOrEditDocument}
                                                                    handleDeleteUserDocs={handleDeleteUserDocs}
                                                                    downloadDocs={downloadDocs}
                                                                    provided={provided}
                                                                    isImage={props.isImage}
                                                                    tabName={tabName}
                                                                    viewImage={viewImage}
                                                                />
                                                            );
                                                        }}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                ))
                            ) : (
                                <div class="no-data-section">
                                    <img src="/img/no-data.svg" alt="no-data-img" />
                                    <h3>No Data Found</h3>
                                    <p>There is no data to show you right now!!!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </DragDropContext>
                {userDocs?.length ? (
                    <div className="table-bottom d-flex mt-3">
                        <div className="count d-flex col-md-6">
                            <div className="count-dtl">
                                Total Count: <span>{count}</span>
                            </div>
                            <div className="col-md-2 pr-2 selbx">
                                <select className="form-control" value={paginationParams.perPage} onChange={e => handlePerPageChange(e)}>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="40">40</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="150">150</option>
                                </select>
                            </div>
                        </div>
                        <div className="pagination-sec col-md-6">
                            <ReactPaginate
                                previousLabel={
                                    <span data-place="top" data-effect="solid" data-tip={`Previous`} data-background-color="#007bff">
                                        &lt;
                                    </span>
                                }
                                nextLabel={
                                    <span data-place="top" data-effect="solid" data-tip={`Next`} data-background-color="#007bff">
                                        &gt;
                                    </span>
                                }
                                breakLabel={"..."}
                                breakClassName={"break-me"}
                                pageCount={Math.ceil(count / paginationParams.perPage)}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={"pagination"}
                                subContainerClassName={"pages pagination"}
                                activeClassName={"active"}
                                activeLinkClassName={"active"}
                                forcePage={paginationParams.currentPage}
                            />
                        </div>
                    </div>
                ) : null}
                {renderDocumentUploadModal()}
                {renderDocDeleteConfirmationModal()}
                {renderImageAssignModal()}
                {renderImageFullViewModal()}
            </div>
        </LoadingOverlay>
    );
};
const mapStateToProps = state => {
    const { smartChartReducer } = state;
    return { smartChartReducer };
};

export default withRouter(connect(mapStateToProps, { ...actions })(Documents));
