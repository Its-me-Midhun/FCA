export const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const year = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"];

export const yearCraetor = () => {
    let arr = [];
    let currYear = new Date().getFullYear();
    for (let i = currYear - 10; i <= currYear + 10; i++) {
        arr.push(i.toString());
    }
    return arr;
};

export const disabledRegion = ["regioninfo", "buildinginfo", "siteinfo"];
export const disabledSite = ["buildinginfo", "siteinfo"];
export const disabledBuilding = ["buildinginfo"];
