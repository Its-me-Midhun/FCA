import React, { useEffect, useState } from "react";
import LoadingOverlay from "react-loading-overlay";
import NumberFormat from "react-number-format";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../common/components/Loader";
import actions from "./actions";
import { useLocation } from "react-router-dom";
import "./softCosts.css";
import Portal from "../common/components/Portal";
import ConfirmationModal from "../common/components/ConfirmationModal";
import _ from "lodash";

const SoftCosts = () => {
    const dispatch = useDispatch();
    const { id, section } = useParams();
    const { getSoftCosts, excelData } = useSelector(state => state.softCostReducer);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const projectId = queryParams.get("pid");

    const [recommendations, setRecommendations] = useState([
        { year: null, initialCsp: null, escalation: null, inflation: null, c_inflation: null, contingency: null }
    ]);
    const [initialData, setInitialData] = useState({ recommendations: [], initialInflation: null });
    const [initialInflation, setInitialInflation] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [showConfirmModal, setConfirmationModal] = useState(false);
    const [isExporting, setExporting] = useState(false);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getParams = () => {
        let params = {};
        if (section === "regioninfo") {
            params.region_id = id;
            params.project_id = projectId;
        } else if (section === "siteinfo") {
            params.site_id = id;
            params.project_id = projectId;
        } else if (section === "buildinginfo") {
            params.building_id = id;
            params.project_id = projectId;
        } else {
            params.project_id = id;
        }
        return params;
    };
    const fetchData = async () => {
        let params = getParams();
        await dispatch(actions.getSoftCostsData(params));
        setLoading(false);
    };

    useEffect(() => {
        setSoftCostsData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSoftCosts]);

    const setSoftCostsData = () => {
        let { soft_costs = [], year_totals = {}, initial_inflation_percentage } = getSoftCosts || {};
        Object.keys(year_totals).forEach(year => {
            let index = soft_costs.findIndex(object => object.year === year);
            if (index !== -1) {
                soft_costs[index].year_total = year_totals[year];
            } else {
                soft_costs.push({
                    year,
                    escalation: null,
                    inflation_percentage: null,
                    compound_inflation: 1,
                    contingency_percentage: null,
                    year_total: year_totals[year]
                });
            }
        });
        const recom =
            soft_costs
                ?.filter(item => item.year)
                ?.map((item, idx) => ({
                    year: item.year,
                    initialCsp: item.year_total,
                    escalation: item.escalation,
                    inflation: item.inflation_percentage,
                    c_inflation: item.compound_inflation,
                    contingency: item.contingency_percentage
                }))
                .sort((a, b) => a.year - b.year) || [];
        setRecommendations(recom);
        setInitialInflation(initial_inflation_percentage);
        setInitialData({ recommendations: recom, initialInflation: initial_inflation_percentage });
    };

    const handleChangeInflation = (year, inflation) => {
        let tempRecom = recommendations;
        const indexToChange = tempRecom.findIndex(elem => elem.year === year);
        let prevInflation = tempRecom[indexToChange - 1]?.c_inflation || 1;
        tempRecom = tempRecom.map((elem, idx) => {
            if (idx === indexToChange) {
                const c_inflation = prevInflation + prevInflation * (inflation / 100) || 1;
                prevInflation = c_inflation;
                return { ...elem, c_inflation, inflation };
            } else if (idx > indexToChange) {
                const c_inflation = prevInflation + prevInflation * (elem.inflation / 100) || 1;
                prevInflation = c_inflation;
                return { ...elem, c_inflation };
            } else {
                return elem;
            }
        });
        setRecommendations(tempRecom);
    };
    const handleChangeEscalation = (year, rate) => {
        const updatedRecom = recommendations.map(item => (item.year === year ? { ...item, escalation: rate } : item));
        setRecommendations(updatedRecom);
    };
    const handleChangeContingency = (year, rate) => {
        const updatedRecom = recommendations.map(item => (item.year === year ? { ...item, contingency: rate } : item));
        setRecommendations(updatedRecom);
    };

    const getPercentage = (amount, percentage) => {
        const factor = percentage / 100;
        const percAmount = amount * factor;
        return percAmount;
    };

    const handleChangeInitialInflation = value => {
        setInitialInflation(value);
        setCompountInflationForEachYear(value);
    };
    const setCompountInflationForEachYear = percentage => {
        const percFactor = percentage / 100;
        let prevInflation = 1;
        const updatedRecom = recommendations.map((item, idx) => {
            const newInflation = idx === 0 ? 1 : prevInflation + percFactor * prevInflation;
            prevInflation = newInflation;
            return { ...item, inflation: idx === 0 ? null : percentage, c_inflation: newInflation };
        });
        setRecommendations(updatedRecom);
    };

    const getSubTotal = year => {
        const recom = recommendations.find(item => item.year === year);
        const inflated = recom.initialCsp * recom.c_inflation;
        const subTotal = getPercentage(recom.initialCsp, recom.escalation) + inflated;
        return subTotal;
    };
    const getTotalConstructionCost = year => {
        const recom = recommendations.find(item => item.year === year);
        const subTotal = getSubTotal(year) + getPercentage(getSubTotal(year), recom.contingency);
        return subTotal;
    };

    const getTotalCosts = item => {
        let sum = 0;
        let values = [];
        if (item === "initialCsp") {
            values = recommendations.map(item => item?.initialCsp);
        } else if (item === "escalation") {
            values = recommendations.map(item => getPercentage(item?.initialCsp, item?.escalation));
        } else if (item === "inflated") {
            values = recommendations.map(item => item?.c_inflation * item?.initialCsp);
        } else if (item === "sub_total") {
            values = recommendations.map(item => getSubTotal(item.year));
        } else if (item === "contingency") {
            values = recommendations.map(item => getPercentage(getSubTotal(item?.year), item?.contingency));
        } else if (item === "total") {
            values = recommendations.map(item => getTotalConstructionCost(item.year));
        }
        sum = values.reduce((acc, curr) => {
            return acc + curr;
        }, 0);
        return sum;
    };

    const saveData = async () => {
        let data = {
            project_id: id,
            initial_inflation_percentage: initialInflation,
            soft_costs: recommendations.map(item => ({
                year: item.year,
                escalation: item.escalation,
                inflation_percentage: item.inflation,
                contingency_percentage: item.contingency,
                compound_inflation: item.c_inflation
            }))
        };
        await dispatch(actions.saveSoftCostsData(data));
        setInitialData({ recommendations, initialInflation });
        showAlerts("Saved Successfully");
    };
    const disableInputs = section === "regioninfo" || section === "siteinfo" || section === "buildinginfo" ? true : false;

    const showAlerts = msg => {
        var x = document.getElementById("sucess-alert");
        if (x) {
            x.className = "show";
            x.innerText = msg;
            setTimeout(function () {
                x.className = x.className.replace("show", "");
            }, 3000);
        }
    };

    const onCancel = () => {
        setRecommendations(initialData.recommendations);
        setInitialInflation(initialData.initialInflation);
    };

    const renderConfirmationModal = () => {
        if (!showConfirmModal) return null;
        return (
            <Portal
                body={
                    <ConfirmationModal
                        type="cancel"
                        heading={"Do you want to clear and lose all changes?"}
                        message={"This action cannot be reverted, are you sure that you need to discard changes?"}
                        onNo={() => setConfirmationModal(false)}
                        onYes={() => {
                            setConfirmationModal(false);
                            onCancel();
                        }}
                    />
                }
                onCancel={() => setConfirmationModal(false)}
            />
        );
    };

    const exportExcel = async () => {
        let params = getParams();
        try {
            setExporting(true);
            await dispatch(actions.exportExcel(params));
            setExporting(false);
        } catch (error) {
            console.log(error);
            showAlerts("Export Failed");
        }
    };

    const isDirty = !_.isEqual(recommendations, initialData.recommendations);
    return (
        <LoadingOverlay active={isLoading} spinner={<Loader />} fadeSpeed={10}>
            <div class="tab-active location-sec image-sec tab-grey efci-otr fund-efci pb-0">
                {renderConfirmationModal()}
                <div className={`dtl-sec col-md-12 mt-0`}>
                    <div class="filter-sec-plan col-md-12 d-flex pr-0">
                        <div class="form-group col-md-3 pr-0 mb-0">
                            <label> Inflation</label>
                            <NumberFormat
                                className="form-control"
                                displayType="input"
                                allowNegative={false}
                                value={initialInflation}
                                disabled={disableInputs}
                                onValueChange={(values, sourceInfo) => sourceInfo?.source !== "prop" && handleChangeInitialInflation(values.value)}
                                suffix=" %"
                                allowEmptyFormatting={true}
                                decimalScale={3}
                            />
                        </div>
                        <div className="soft-cost-excel">
                            {isExporting ? (
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ) : (
                                <div className="view-inner" onClick={() => exportExcel()} data-for="table-top-icons" data-tip="Export to Excel">
                                    <img src="/img/excell-new.svg" alt="" className="export" />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* add extra div 'custom-table-scroll' for scroll issue */}
                    <div className="custom-table-scroll">
                        <div className="table-topper efc-topr pb-3">
                            <div className="col-md-12 otr-topr d-flex">
                                <h3>FCA Capital Spending Plan total project costs</h3>
                            </div>
                        </div>
                        <div className="table-section table-plan table-scroll build-fci fc-capital-nw build-efci">
                            <table className="table table-common-outer">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table className="table table-common table-froze">
                                                <thead>
                                                    <tr className="table-head-title">
                                                        <th className="img-sq-box">
                                                            <img src="/img/sq-box.png" alt="" />
                                                        </th>
                                                        <th className="build-add" typeof="input">
                                                            Title
                                                        </th>
                                                        {recommendations.map(item => (
                                                            <th key={item.year} className="build-add">
                                                                {item.year}
                                                            </th>
                                                        ))}
                                                        <th className="action">Total Costs</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="blue-highlight-row">
                                                        <th className="img-sq-box">
                                                            <img src="/img/sq-box.png" alt="" />
                                                        </th>
                                                        <th className="build-add">Total Construction Costs</th>
                                                        {recommendations.map(item => (
                                                            <th key={item.year} className="build-add">
                                                                <NumberFormat
                                                                    displayType="text"
                                                                    value={item.initialCsp}
                                                                    prefix={"$ "}
                                                                    thousandSeparator={true}
                                                                />
                                                            </th>
                                                        ))}
                                                        <th className="build-add">
                                                            <NumberFormat
                                                                displayType="text"
                                                                value={getTotalCosts("initialCsp")}
                                                                decimalScale={0}
                                                                prefix={"$ "}
                                                                thousandSeparator={true}
                                                            />
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th className="img-sq-box">
                                                            <img src="/img/sq-box.png" alt="" />
                                                        </th>
                                                        <th className="build-add">Escalation</th>

                                                        {recommendations.map(item => (
                                                            <th key={item.year} className="build-add">
                                                                <div className="text-seprte">
                                                                    <NumberFormat
                                                                        className="build-add"
                                                                        thousandSeparator={true}
                                                                        displayType="text"
                                                                        value={getPercentage(item.initialCsp, item.escalation)}
                                                                        prefix="$ "
                                                                        decimalScale={0}
                                                                    />
                                                                    <NumberFormat
                                                                        className="build-add"
                                                                        displayType="input"
                                                                        allowNegative={false}
                                                                        value={item.escalation}
                                                                        disabled={disableInputs}
                                                                        onValueChange={value => handleChangeEscalation(item.year, value.value)}
                                                                        suffix=" %"
                                                                        allowEmptyFormatting={true}
                                                                        decimalScale={3}
                                                                    />
                                                                </div>
                                                            </th>
                                                        ))}
                                                        <th className="build-add">
                                                            <NumberFormat
                                                                displayType="text"
                                                                value={getTotalCosts("escalation")}
                                                                decimalScale={0}
                                                                prefix={"$ "}
                                                                thousandSeparator={true}
                                                            />
                                                        </th>
                                                    </tr>
                                                    <tr className="highlight-bg-row">
                                                        <th className="img-sq-box">
                                                            <img src="/img/sq-box.png" alt="" />
                                                        </th>
                                                        <th className="build-add">Inflation</th>
                                                        {recommendations.map(item => (
                                                            <th key={item.year} className="build-add">
                                                                <div className="text-seprte">
                                                                    <NumberFormat
                                                                        className="build-add"
                                                                        displayType="text"
                                                                        value={item.c_inflation}
                                                                        decimalScale={3}
                                                                    />
                                                                    <NumberFormat
                                                                        className="build-add"
                                                                        displayType="input"
                                                                        allowNegative={false}
                                                                        value={item.inflation}
                                                                        suffix=" %"
                                                                        allowEmptyFormatting={true}
                                                                        disabled={disableInputs}
                                                                        onValueChange={(values, sourceInfo) => {
                                                                            if (sourceInfo?.source !== "prop") {
                                                                                handleChangeInflation(item.year, values.value);
                                                                            }
                                                                        }}
                                                                        decimalScale={3}
                                                                    />
                                                                </div>
                                                            </th>
                                                        ))}
                                                        <th className="build-add"></th>
                                                    </tr>
                                                    <tr className="highlight-bg-row">
                                                        <th className="img-sq-box">
                                                            <img src="/img/sq-box.png" alt="" />
                                                        </th>
                                                        <th className="build-add">Inflated</th>
                                                        {recommendations.map(item => (
                                                            <th key={item.year} className="build-add">
                                                                <NumberFormat
                                                                    className="build-add"
                                                                    thousandSeparator={true}
                                                                    displayType="text"
                                                                    value={item.initialCsp * item.c_inflation}
                                                                    prefix="$ "
                                                                    decimalScale={0}
                                                                />
                                                            </th>
                                                        ))}
                                                        <th className="build-add">
                                                            <NumberFormat
                                                                displayType="text"
                                                                value={getTotalCosts("inflated")}
                                                                decimalScale={0}
                                                                prefix={"$ "}
                                                                thousandSeparator={true}
                                                            />
                                                        </th>
                                                    </tr>
                                                    <tr className="blue-highlight-row brd-gap">
                                                        <th className="img-sq-box">
                                                            <img src="/img/sq-box.png" alt="" />
                                                        </th>
                                                        <th className="build-add">Sub Total</th>
                                                        {recommendations.map(item => (
                                                            <th key={item.year} className="build-add">
                                                                <NumberFormat
                                                                    displayType="text"
                                                                    value={getSubTotal(item.year)}
                                                                    thousandSeparator={true}
                                                                    prefix="$ "
                                                                    decimalScale={0}
                                                                />
                                                            </th>
                                                        ))}
                                                        <th className="build-add">
                                                            <NumberFormat
                                                                displayType="text"
                                                                value={getTotalCosts("sub_total")}
                                                                decimalScale={0}
                                                                prefix={"$ "}
                                                                thousandSeparator={true}
                                                            />
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th className="img-sq-box">
                                                            <img src="/img/sq-box.png" alt="" />
                                                        </th>
                                                        <th className="build-add">Construction Contingency</th>
                                                        {recommendations.map(item => (
                                                            <th key={item.year} className="build-add">
                                                                <div className="text-seprte">
                                                                    <NumberFormat
                                                                        className="build-add"
                                                                        thousandSeparator={true}
                                                                        displayType="text"
                                                                        value={getPercentage(getSubTotal(item.year), item.contingency)}
                                                                        prefix="$ "
                                                                        decimalScale={0}
                                                                    />
                                                                    <NumberFormat
                                                                        className="build-add"
                                                                        displayType="input"
                                                                        allowNegative={false}
                                                                        value={item.contingency}
                                                                        disabled={disableInputs}
                                                                        onValueChange={value => handleChangeContingency(item.year, value.value)}
                                                                        suffix=" %"
                                                                        allowEmptyFormatting={true}
                                                                        decimalScale={3}
                                                                    />
                                                                </div>
                                                            </th>
                                                        ))}
                                                        <th className="build-add">
                                                            <NumberFormat
                                                                displayType="text"
                                                                value={getTotalCosts("contingency")}
                                                                decimalScale={0}
                                                                prefix={"$ "}
                                                                thousandSeparator={true}
                                                            />
                                                        </th>
                                                    </tr>
                                                    <tr className="blue-highlight-row">
                                                        <th className="img-sq-box">
                                                            <img src="/img/sq-box.png" alt="" />
                                                        </th>
                                                        <th className="build-add">Total Project Costs</th>
                                                        {recommendations.map(item => (
                                                            <th key={item.year} className="build-add">
                                                                <NumberFormat
                                                                    displayType="text"
                                                                    value={getTotalConstructionCost(item.year)}
                                                                    thousandSeparator={true}
                                                                    decimalScale={0}
                                                                    prefix="$ "
                                                                />
                                                            </th>
                                                        ))}
                                                        <th className="build-add">
                                                            <NumberFormat
                                                                displayType="text"
                                                                value={getTotalCosts("total")}
                                                                decimalScale={0}
                                                                prefix={"$ "}
                                                                thousandSeparator={true}
                                                            />
                                                        </th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {!disableInputs && (
                        <div className="add-btn-wrapper pt-0 mt-4">
                            <button
                                className={`button btn-discard ml-2 ${!isDirty ? "disbled-butn" : ""}`}
                                disabled={!isDirty}
                                onClick={() => setConfirmationModal(true)}
                            >
                                Discard Changes
                            </button>
                            <button
                                className={`button btn-save ml-2 cursor-hand ${!isDirty ? "disbled-butn" : ""}`}
                                disabled={!isDirty}
                                onClick={() => saveData()}
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </LoadingOverlay>
    );
};
export default SoftCosts;
