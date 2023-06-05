import React from "react";

const ViewPropertyFilters = ({ chartData = {}, entity, ...props }) => {
    const getSelectedFilters = () => {
        let filterList = [];
        if (chartData?.[entity]?.band1?.filter_label) {
            Object.keys(chartData[entity].band1.filter_label).map(filterItem => {
                filterList.push({ name: filterItem, values: [...chartData[entity].band1.filter_label[filterItem]] });
            });
        }
        return filterList || [];
    };
    return (
        <div class="list-badge-outer">
            {getSelectedFilters().map((filterItem, index) => (
                <div class="list-inner col-md-6" key={index}>
                    <h3>{filterItem.name}</h3>
                    <ul class="badge-ul">
                        {filterItem.values?.length &&
                            filterItem.values.map((filterValue, i) => (
                                <li class="badge-list">
                                    <span>{filterValue}</span>
                                </li>
                            ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};
export default ViewPropertyFilters;
