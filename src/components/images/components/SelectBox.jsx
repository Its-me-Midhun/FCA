import React from "react";

export default function SelectBox({
    label,
    optionsList,
    handleChange,
    value,
    showErrorBorder,
    disabled,
    className,
    isBuilding,
    hasEmptySelect = true
}) {
    return (
        <div className="form-group">
            <label>{label}</label>
            <div className={`selectOtr ${className}`}>
                <select
                    autoComplete={"nope"}
                    className={`form-control ${disabled ? " cursor-diabled " : ""}${showErrorBorder ? "error-border" : ""}`}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                >
                    {hasEmptySelect && <option value="">Select</option>}
                    {optionsList?.length
                        ? optionsList.map((item, i) => (
                              <option value={item.id} key={i}>
                                  {item.name}
                                  {isBuilding && item.description ? ` (${item.description})` : ""}
                              </option>
                          ))
                        : null}
                </select>
            </div>
        </div>
    );
}
