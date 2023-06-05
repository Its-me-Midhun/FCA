import React from "react";
import { kWH_TO_kBTU, MMBTU_TO_kBTU } from "../../../../config/utils";
import { Band } from "./Band";

export const energy_fields = [
    // {
    //     label: "ECM Description",
    //     key: "ecm_description",
    //     type: "text"
    // },
    {
        label: "10-Year Energy Savings ($)",
        key: "annual_savings",
        type: "number",
        isCost: true
    },
    {
        label: "10-Year Energy Savings (kBTU)",
        key: "total_captial_spending_plan_kbtu_savings",
        type: "number"
    },
    {
        label: "Cost to Implement (ECM)",
        key: "implementation_cost",
        type: "number",
        isCost: true
    },
    {
        label: "Simple Payback (Yrs)",
        key: "simple_payback",
        type: "number"
    },
    {
        label: "Annual Natural Gas Savings (MMBTU)",
        key: "annual_nat_gas_savings",
        type: "number"
    },
    {
        label: "Annual Electricity Savings (kWH)",
        key: "annual_elec_savings",
        type: "number"
    },
    {
        label: "Total Annual Savings (kBTU)",
        key: "total_annual_savings",
        type: "number",
        isReadOnly: true
    },
    {
        label: "Annual Energy Savings ($)",
        key: "annual_energy_savings",
        type: "number",
        isCost: true
    },
    {
        label: "Annual Cost to Implement ECM ($)",
        key: "annual_cost_to_implement_ecm",
        type: "number",
        isCost: true
    },
];

export const EnergyBand = ({ energyData, bandShown, handleBandClick, handleChangeData, bandId }) => {
    const handleChangeEnergyData = (key, value) => {
        if (key === "annual_nat_gas_savings" || key === "annual_elec_savings") {
            setTotalAnnualSavingsKBTU(key, value);
        } else {
            handleChangeData({ energy_band: { ...energyData, [key]: value } });
        }
    };

    const setTotalAnnualSavingsKBTU = (key, value) => {
        const { annual_nat_gas_savings, annual_elec_savings } = energyData;
        let total_annual_savings = "";
        if (key === "annual_nat_gas_savings" && annual_elec_savings) {
            total_annual_savings = (MMBTU_TO_kBTU(value) + kWH_TO_kBTU(annual_elec_savings)).toFixed(2);
        } else if (key === "annual_elec_savings" && annual_nat_gas_savings) {
            total_annual_savings = (MMBTU_TO_kBTU(annual_nat_gas_savings) + kWH_TO_kBTU(value)).toFixed(2);
        }
        handleChangeData({ energy_band: { ...energyData, [key]: value, total_annual_savings } });
    };
    return (
        <div className={`card`}>
            <div className="card-header" id="headingSeven">
                <div className="otr-recom-div">
                    <button
                        className="btn btn-link"
                        data-toggle="collapse"
                        data-target={`#${bandId}`}
                        aria-expanded="false"
                        onClick={() => handleBandClick(bandId, false)}
                    >
                        Energy
                    </button>
                    {energy_fields.slice(0, 3).map(elem => (
                        <Band
                            bandShown={bandShown}
                            bandId={bandId}
                            fieldType={elem.type}
                            onChange={(key, value) => handleChangeEnergyData(key, value)}
                            value={energyData[elem.key] || ""}
                            fieldKey={elem.key}
                            label={elem.label}
                            handleBandClick={() => handleBandClick(bandId, true)}
                            fieldItem={elem}
                        />
                    ))}
                </div>
            </div>

            <div id={bandId} className={bandShown ? "collapse show" : "collapse"} aria-labelledby="headingSeven">
                <div className="card-body">
                    <div className="outer-rcm mt-1">
                        {energy_fields.slice(3).map(elem => (
                            <Band
                                fieldType={elem.type}
                                onChange={(key, value) => handleChangeEnergyData(key, value)}
                                value={energyData[elem.key] || ""}
                                fieldKey={elem.key}
                                label={elem.label}
                                handleBandClick={() => handleBandClick(bandId, true)}
                                fieldItem={elem}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
