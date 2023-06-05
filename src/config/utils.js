import _ from "lodash";
import { BandTypes } from "../components/reports/constants";
import cssConvert from "css-unit-converter";
import Geocode from "react-geocode";
import moment from "moment";
const GOOGLE_MAP_API_KEY = "AIzaSyBknjmLFtejuWK1m_czDlv6LAn0D_HfnrU";
const addToBreadCrumpData = (newItem = {}, type = "add") => {
    let currentBreadCrumpData = JSON.parse(sessionStorage.getItem("bc-data"));

    if (currentBreadCrumpData) {
        if (!checkItemExistance(newItem)) {
            // to remove the inner tab bc items if the last bc item is inner tab and the new bc item is not
            if (currentBreadCrumpData[currentBreadCrumpData.length - 1]?.isInnerTab && !newItem?.isInnerTab) {
                currentBreadCrumpData.length -= currentBreadCrumpData[currentBreadCrumpData.length - 1]?.key === "info" ? 2 : 1;
            }
            // to remove the last item if it is of the same level
            if (currentBreadCrumpData[currentBreadCrumpData.length - 1]?.key === newItem?.key) {
                currentBreadCrumpData.length -= 1;
            }
            let tempItem = newItem;
            tempItem.index = currentBreadCrumpData.length; // setting index for next object
            let newBreadCrumpData = currentBreadCrumpData;
            newBreadCrumpData.push(tempItem);
            sessionStorage.setItem("bc-data", JSON.stringify(newBreadCrumpData));
        }
    }
    return true;
};

const updateBreadCrumpData = (index, type = "update") => {
    let currentBreadCrumpData = JSON.parse(sessionStorage.getItem("bc-data"));
    if (currentBreadCrumpData) {
        currentBreadCrumpData.length = index + 1; // removing the remaining items form current data
        let newBreadCrumpData = currentBreadCrumpData;
        sessionStorage.setItem("bc-data", JSON.stringify(newBreadCrumpData));
    }
    return true;
};

const popBreadCrumpData = (type = "pop") => {
    let currentBreadCrumpData = JSON.parse(sessionStorage.getItem("bc-data"));
    if (currentBreadCrumpData) {
        if (currentBreadCrumpData.length) currentBreadCrumpData.length -= 1; // removing last items form current data
        let newBreadCrumpData = currentBreadCrumpData;
        sessionStorage.setItem("bc-data", JSON.stringify(newBreadCrumpData));
    }
    return true;
};

const popBreadCrumpRecData = (type = "pop") => {
    let currentBreadCrumpData = JSON.parse(sessionStorage.getItem("bc-data"));
    if (currentBreadCrumpData) {
        if (currentBreadCrumpData.length) currentBreadCrumpData.length -= 2; // removing last 2 items form current data
        let newBreadCrumpData = currentBreadCrumpData;
        sessionStorage.setItem("bc-data", JSON.stringify(newBreadCrumpData));
    }
    return true;
};

const checkItemExistance = newItem => {
    let isAlreadyThereInArray = false;
    let currentBreadCrumpData = JSON.parse(sessionStorage.getItem("bc-data"));
    currentBreadCrumpData.map((item, i) => {
        if (item.key === newItem.key && item.name === newItem.name && item.path === newItem.path) {
            isAlreadyThereInArray = true;
        }
        if (newItem.key === "regionName") {
            if (item.key === "regionName") isAlreadyThereInArray = true;
        } else if (newItem.key === "siteName") {
            if (item.key === "siteName") isAlreadyThereInArray = true;
        } else if (newItem.key === "buildingName") {
            if (item.key === "buildingName") isAlreadyThereInArray = true;
        } else if (newItem.key === "floorName") {
            if (item.key === "floorName") isAlreadyThereInArray = true;
        } else if (newItem.key === "buildingTypeName") {
            if (item.key === "buildingTypeName") isAlreadyThereInArray = true;
        } else if (newItem.key === "userName") {
            if (item.key === "userName") isAlreadyThereInArray = true;
        } else if (newItem.key === "consultancyName") {
            if (item.key === "consultancyName") isAlreadyThereInArray = true;
        }
    });
    return isAlreadyThereInArray;
};

const resetBreadCrumpData = (newItem, type = "reset") => {
    sessionStorage.removeItem("bc-data");
    let BreadCrumpData = [];
    let tempItem = newItem;
    tempItem.index = 0;
    BreadCrumpData.push(tempItem);
    sessionStorage.setItem("bc-data", JSON.stringify(BreadCrumpData));
    return true;
};

const bulkResetBreadCrumpData = (bulkData, type = "reset") => {
    sessionStorage.removeItem("bc-data");
    let BreadCrumpData = [];
    bulkData &&
        bulkData.length &&
        bulkData.map((item, i) => {
            let tempItem = item;
            tempItem.index = i;
            BreadCrumpData.push(tempItem);
        });
    sessionStorage.setItem("bc-data", JSON.stringify(BreadCrumpData));
    return true;
};

const findPrevPathFromBreadCrump = () => {
    let currentBreadCrumpData = JSON.parse(sessionStorage.getItem("bc-data"));

    if (currentBreadCrumpData) {
        return currentBreadCrumpData[currentBreadCrumpData.length - 2] && currentBreadCrumpData[currentBreadCrumpData.length - 2].path;
    }
    return null;
};

const findInfoPathFromBreadCrump = () => {
    let currentBreadCrumpData = JSON.parse(sessionStorage.getItem("bc-data"));

    if (currentBreadCrumpData) {
        return currentBreadCrumpData;
    }
    return null;
};

const findPrevPathFromBreadCrumpData = () => {
    let currentBreadCrumpData = JSON.parse(sessionStorage.getItem("bc-data"));

    if (currentBreadCrumpData) {
        return currentBreadCrumpData[currentBreadCrumpData.length - 1] && currentBreadCrumpData[currentBreadCrumpData.length - 1].path;
    }
    return null;
};

const findPrevNameFromBreadCrumpData = () => {
    let currentBreadCrumpData = JSON.parse(sessionStorage.getItem("bc-data"));

    if (currentBreadCrumpData) {
        return currentBreadCrumpData[currentBreadCrumpData.length - 1] && currentBreadCrumpData[currentBreadCrumpData.length - 1].name;
    }
    return null;
};

const findPrevPathFromBreadCrumpRecData = () => {
    let currentBreadCrumpData = JSON.parse(sessionStorage.getItem("bc-data"));
    if (currentBreadCrumpData) {
        return currentBreadCrumpData;
    }

    return null;
};

const popBreadCrumpOnPageClose = () => {
    let currentBreadCrumpData = JSON.parse(sessionStorage.getItem("bc-data"));
    if (!currentBreadCrumpData) return null;
    // if last bc item is "info" pop 2 items otherwise pop 1 item
    currentBreadCrumpData.length -= currentBreadCrumpData[currentBreadCrumpData.length - 1]?.key === "info" ? 2 : 1;
    sessionStorage.setItem("bc-data", JSON.stringify(currentBreadCrumpData));
    return true;
};

const resetToDashboardBreadCrumpData = () => {
    let currentBreadCrumpData = JSON.parse(sessionStorage.getItem("bc-data"));
    if (currentBreadCrumpData) {
        sessionStorage.setItem("bc-data", currentBreadCrumpData[0]);
        return currentBreadCrumpData[0] && currentBreadCrumpData[0].path;
    }
    return null;
};

const convertToXML = (data, key, subType) => {
    let temp = key === BandTypes.doubleImageBand || key === BandTypes.insertBand ? data : data[0];
    switch (key) {
        case BandTypes.textBand:
            if (temp) {
                let parser = new DOMParser();
                let xmldoc = parser.parseFromString(temp, "text/html");

                // for setting alignment style
                xmldoc = setTextAlign(xmldoc);
                // for setting highlight color
                xmldoc = setHighlightColor(xmldoc);
                // for removing unwanted attr, heads and tags
                xmldoc = removeAttributes(xmldoc);

                let html_format = new XMLSerializer().serializeToString(xmldoc);

                html_format = html_format.replaceAll(` xmlns="http://www.w3.org/1999/xhtml"`, "");
                html_format = html_format.replace("<html>", "");
                html_format = html_format.replace("</html>", "");
                html_format = html_format.replace("<head>", "");
                html_format = html_format.replace("</head>", "");
                html_format = html_format.replace("<body>", "");
                html_format = html_format.replace("</body>", "");
                html_format = html_format.replaceAll("<span>", "");
                html_format = html_format.replaceAll("</span>", "");

                // =====> special characters formatting
                html_format = html_format.replaceAll("&(?!amp;)", "&amp;");
                html_format = html_format.replaceAll("&nbsp;", " ");
                // =====> style tag formatting
                html_format = html_format.replaceAll("<p>", "<p><text>");
                html_format = html_format.replaceAll("</p>", "</text></p>");
                html_format = html_format.replaceAll("<p><text><style>", "<p><style>");
                html_format = html_format.replaceAll("</style>", "</style><text>");
                // =====> style formatting for li tag
                html_format = html_format.replaceAll("<li>", "<li><text>");
                html_format = html_format.replaceAll("</li>", "</text></li>");
                html_format = html_format.replaceAll("<li><text><style>", "<li><style>");
                // =====> highlight tag formatting
                html_format = html_format.replaceAll("<mark>", "<highlight>");
                html_format = html_format.replaceAll("</mark>", "</highlight>");
                html_format = html_format.replaceAll("<highlight>", "</text><highlight><text>");
                html_format = html_format.replaceAll("</highlight>", "</text></highlight><text>");
                html_format = html_format.replaceAll("<color>", "</text><color>");
                html_format = html_format.replaceAll("</color>", "</color><text>");
                // =====> formatting combined complex tags and appending text tag
                html_format = html_format.replaceAll("<strong><u>", "</text><strongline>");
                html_format = html_format.replaceAll("</u></strong>", "</strongline><text>");
                html_format = html_format.replaceAll("<i>", "</text><i><text>");
                html_format = html_format.replaceAll("</i>", "</text></i><text>");
                html_format = html_format.replaceAll("<u>", "</text><u>");
                html_format = html_format.replaceAll("</u>", "</u><text>");
                html_format = html_format.replaceAll("</strong>", "</strong><text>");
                html_format = html_format.replaceAll("<strong>", "</text><strong>");
                // =====> br tag formatting
                html_format = html_format.replaceAll("<br />", "<br>");
                html_format = html_format.replaceAll("<text><br></text>", "<br></br>");
                html_format = html_format.replace(/<br>(?!<\/br>)/g, "</text><br></br><text>");
                html_format = html_format.replaceAll("<text></text>", "");

                html_format = `<doc>${html_format}</doc>`;
                return html_format;
            } else return "";
        case BandTypes.reportNoteBand:
            if (temp) {
                let parser = new DOMParser();
                let xmldoc = parser.parseFromString(temp, "text/html");

                // for setting alignment style
                xmldoc = setTextAlign(xmldoc);
                // for setting highlight color
                xmldoc = setHighlightColor(xmldoc);
                // for removing unwanted attr, heads and tags
                xmldoc = removeAttributes(xmldoc);

                let html_format = new XMLSerializer().serializeToString(xmldoc);

                html_format = html_format.replaceAll(` xmlns="http://www.w3.org/1999/xhtml"`, "");
                html_format = html_format.replace("<html>", "");
                html_format = html_format.replace("</html>", "");
                html_format = html_format.replace("<head>", "");
                html_format = html_format.replace("</head>", "");
                html_format = html_format.replace("<body>", "");
                html_format = html_format.replace("</body>", "");
                html_format = html_format.replaceAll("<span>", "");
                html_format = html_format.replaceAll("</span>", "");

                // =====> special characters formatting
                html_format = html_format.replaceAll("&(?!amp;)", "&amp;");
                html_format = html_format.replaceAll("&nbsp;", " ");
                // =====> style tag formatting
                html_format = html_format.replaceAll("<p>", "<p><text>");
                html_format = html_format.replaceAll("</p>", "</text></p>");
                html_format = html_format.replaceAll("<p><text><style>", "<p><style>");
                html_format = html_format.replaceAll("</style>", "</style><text>");
                // =====> style formatting for li tag
                html_format = html_format.replaceAll("<li>", "<li><text>");
                html_format = html_format.replaceAll("</li>", "</text></li>");
                html_format = html_format.replaceAll("<li><text><style>", "<li><style>");
                // =====> highlight tag formatting
                html_format = html_format.replaceAll("<mark>", "<highlight>");
                html_format = html_format.replaceAll("</mark>", "</highlight>");
                html_format = html_format.replaceAll("<highlight>", "</text><highlight><text>");
                html_format = html_format.replaceAll("</highlight>", "</text></highlight><text>");
                html_format = html_format.replaceAll("<color>", "</text><color>");
                html_format = html_format.replaceAll("</color>", "</color><text>");
                // =====> formatting combined complex tags and appending text tag
                html_format = html_format.replaceAll("<strong><u>", "</text><strongline>");
                html_format = html_format.replaceAll("</u></strong>", "</strongline><text>");
                html_format = html_format.replaceAll("<i>", "</text><i><text>");
                html_format = html_format.replaceAll("</i>", "</text></i><text>");
                html_format = html_format.replaceAll("<u>", "</text><u>");
                html_format = html_format.replaceAll("</u>", "</u><text>");
                html_format = html_format.replaceAll("</strong>", "</strong><text>");
                html_format = html_format.replaceAll("<strong>", "</text><strong>");
                // =====> br tag formatting
                html_format = html_format.replaceAll("<br />", "<br>");
                html_format = html_format.replaceAll("<text><br></text>", "<br></br>");
                html_format = html_format.replace(/<br>(?!<\/br>)/g, "</text><br></br><text>");
                html_format = html_format.replaceAll("<text></text>", "");

                html_format = `<doc>${html_format}</doc>`;
                return html_format;
            } else return "";

        case BandTypes.singleImageBand:
            if (subType === "square") {
                temp = `<image><key>${temp?.image_path || ""}</key><caption>${
                    temp?.description?.replaceAll("&", "&amp;") || ""
                }</caption><type>SQR</type></image>`;
                return temp;
            } else if (subType === "rectangle") {
                temp = `<image><key>${temp?.image_path || ""}</key><caption>${
                    temp?.description?.replaceAll("&", "&amp;") || ""
                }</caption><type>RECT</type></image>`;
                return temp;
            }

        case BandTypes.doubleImageBand:
            temp = `<doubleImage><image><key>${temp[0]?.image_path || ""}</key><caption>${
                temp[0]?.description?.replaceAll("&", "&amp;") || ""
            }</caption></image><image><key>${temp[1]?.image_path || ""}</key><caption>${
                temp[1]?.description?.replaceAll("&", "&amp;") || ""
            }</caption></image></doubleImage>`;
            return temp;

        case BandTypes.insertBand:
            let temp_data = temp?.html_format;
            let headerType = temp?.double_header;
            let parser = new DOMParser();
            let xmldoc = parser.parseFromString(temp_data, "text/html");

            xmldoc = setTableHeader(xmldoc, headerType);
            xmldoc = appendParagraph(xmldoc);
            xmldoc = setMergedCell(xmldoc);
            xmldoc = setTextAlign(xmldoc);
            xmldoc = setTableStyle(xmldoc);
            xmldoc = removeAttributes(xmldoc);

            let html_format = xmldoc.getElementsByTagName("table")[0];
            html_format = new XMLSerializer().serializeToString(html_format);

            html_format = html_format.replaceAll(` xmlns="http://www.w3.org/1999/xhtml"`, "");
            html_format = html_format?.replace("<tbody>", "");
            html_format = html_format?.replace("</tbody>", "");
            html_format = html_format?.replaceAll("&nbsp;", " ");
            html_format = html_format?.replaceAll("&(?!amp;)", "&amp;");
            html_format = html_format?.replaceAll("<th>", "<td>");
            html_format = html_format?.replaceAll("</th>", "</td>");
            html_format = html_format?.replaceAll("<thead><tr>", "<th>");
            html_format = html_format?.replaceAll("</tr></thead>", "</th>");
            html_format = html_format.replaceAll("<span>", "");
            html_format = html_format.replaceAll("</span>", "");

            // =====> style tag formatting
            html_format = html_format.replaceAll("<p>", "<p><text>");
            html_format = html_format.replaceAll("</p>", "</text></p>");
            html_format = html_format.replaceAll("<p><text><style>", "<p><style>");
            html_format = html_format.replaceAll("</style>", "</style><text>");
            html_format = html_format.replaceAll("</style><text><p>", "</style><p>");
            html_format = html_format.replaceAll("</style><text><tm>", "</style><tm>");

            // =====> formatting combined complex tags and appending text tag
            html_format = html_format.replaceAll("<strong><u>", "</text><strongline>");
            html_format = html_format.replaceAll("</u></strong>", "</strongline><text>");
            html_format = html_format.replaceAll("<i>", "</text><i><text>");
            html_format = html_format.replaceAll("</i>", "</text></i><text>");
            html_format = html_format.replaceAll("<u>", "</text><u>");
            html_format = html_format.replaceAll("</u>", "</u><text>");
            html_format = html_format.replaceAll("</strong>", "</strong><text>");
            html_format = html_format.replaceAll("<strong>", "</text><strong>");
            html_format = html_format.replaceAll("<text></text>", "");
            return html_format;

        case BandTypes.recommendationBand:
            let parsers = new DOMParser();
            let xmldocs = parsers.parseFromString(temp, "text/html");
            xmldocs = removeAttributes(xmldocs);
            let html_format1 = new XMLSerializer().serializeToString(xmldocs);

            html_format1 = html_format1.replaceAll(` xmlns="http://www.w3.org/1999/xhtml"`, "");
            html_format1 = html_format1.replace("<html>", "");
            html_format1 = html_format1.replace("</html>", "");
            html_format1 = html_format1.replace("<head>", "");
            html_format1 = html_format1.replace("</head>", "");
            html_format1 = html_format1.replace("<body>", "");
            html_format1 = html_format1.replace("</body>", "");
            html_format1 = html_format1.replaceAll("<span>", "");
            html_format1 = html_format1.replaceAll("</span>", "");
            html_format1 = html_format1.replaceAll("&(?!amp;)", "&amp;");
            html_format1 = html_format1.replaceAll("&nbsp;", " ");
            return html_format1;

        case BandTypes.chartBand:
            //Complete graphData object is passed to backend but chartData is not required for word generation
            temp = `<chart><view>${temp?.name}</view><data>${JSON.stringify(temp?.graphData)}</data><type>${temp?.chartType.slice(
                0,
                -2
            )}</type><plain>${temp?.chartType.slice(-2)}</plain></chart>`;

            return temp;

        default:
            return temp;
    }
};

const setTableHeader = (xmlDoc, double_header) => {
    let table = xmlDoc.getElementsByTagName("table")[0];
    let tbody = table.getElementsByTagName("tbody")[0];
    let thead = table.getElementsByTagName("thead")[0];
    if (thead) {
        let childs = thead.childNodes;
        Array.from(childs).map((child, i) => tbody.insertBefore(child, tbody.childNodes[i]));
        table.removeChild(thead);
    }
    if (tbody.childNodes.length >= 2 && double_header) {
        let header = xmlDoc.createElement("thead");
        let header2 = xmlDoc.createElement("thead");
        let childNode1 = tbody.childNodes[0];
        let childNode2 = tbody.childNodes[1];
        header.appendChild(childNode1.cloneNode(true));
        header2.appendChild(childNode2.cloneNode(true));
        table.insertBefore(header, tbody);
        table.insertBefore(header2, tbody);
        tbody.removeChild(tbody.childNodes[0]);
        tbody.removeChild(tbody.childNodes[0]);
    } else if (table.firstChild.nodeName === "TBODY") {
        let header = table.createTHead();
        let childNode = tbody.firstChild;
        header.appendChild(childNode.cloneNode(true));
        tbody.removeChild(tbody.firstChild);
    }

    return xmlDoc;
};

const setMergedCell = xmlDoc => {
    let tds = xmlDoc.getElementsByTagName("td");
    let ths = xmlDoc.getElementsByTagName("th");
    Array.from(tds)
        .concat(Array.from(ths))
        .map(td => {
            if (td.hasAttribute("colspan")) {
                let val = td.getAttribute("colspan");
                let childs = td.childNodes;
                let emtptyText = xmlDoc.createTextNode(" ");
                for (let i = 0; i < val; i++) {
                    if (i === 0) {
                        let TM = xmlDoc.createElement("tm");
                        Array.from(childs).map(child => {
                            let cld = child.cloneNode(true);
                            TM.appendChild(cld);
                            td.removeChild(child);
                        });
                        td.appendChild(TM);
                    } else {
                        let TM = xmlDoc.createElement("tm");
                        TM.appendChild(emtptyText.cloneNode(true));
                        td.appendChild(TM);
                    }
                }
            }
        });
    return xmlDoc;
};

const appendParagraph = xmlDoc => {
    let tds = xmlDoc.getElementsByTagName("td");
    let ths = xmlDoc.getElementsByTagName("th");
    Array.from(tds).map(td => {
        if (td.hasChildNodes && td.firstChild.nodeName !== "P") {
            let para = xmlDoc.createElement("p");
            let childs = td.childNodes;
            Array.from(childs).map(child => {
                let cld = child.cloneNode(true);
                para.appendChild(cld);
                td.removeChild(child);
            });
            td.appendChild(para);
        }
    });
    Array.from(ths).map(td => {
        if (td.hasChildNodes && td.firstChild.nodeName !== "P") {
            let para = xmlDoc.createElement("p");
            let childs = td.childNodes;
            Array.from(childs).map(child => {
                let cld = child.cloneNode(true);
                para.appendChild(cld);
                td.removeChild(child);
            });
            td.appendChild(para);
        }
    });
    return xmlDoc;
};

const setTextAlign = xmlDoc => {
    //===> for <p> tag
    let elementP = xmlDoc.getElementsByTagName("p");
    //===> for <li> tag
    let elementLI = xmlDoc.getElementsByTagName("li");

    Array.from(elementP)
        .concat(Array.from(elementLI))
        .map(p => {
            if (p.hasAttribute("style")) {
                let attr = p.getAttribute("style");
                let tempAttr = attr.match(/text-align:(.*);/)[1]; //======> NOT A BEST SOLUTION
                let allowed = ["left", "right", "center", "justify"];
                if (tempAttr && allowed.includes(tempAttr)) {
                    let styleTag = xmlDoc.createElement("style");
                    let alignTag = xmlDoc.createElement("align");
                    let textNode = xmlDoc.createTextNode(tempAttr);
                    alignTag.appendChild(textNode);
                    styleTag.appendChild(alignTag);
                    p.insertBefore(styleTag, p.firstChild);
                }
            }
        });
    return xmlDoc;
};

const setHighlightColor = xmlDoc => {
    let elem = xmlDoc.getElementsByTagName("mark");

    Array.from(elem).map(p => {
        if (p.hasAttribute("class")) {
            let attr = p.getAttribute("class");
            let tempAttr =
                attr === "marker-yellow"
                    ? "YELLOW"
                    : attr === "marker-green"
                    ? "BRIGHT_GREEN"
                    : attr === "marker-pink"
                    ? "PINK"
                    : attr === "marker-blue"
                    ? "BLUE"
                    : "YELLOW";
            if (tempAttr) {
                let styleTag = xmlDoc.createElement("color");
                let textNode = xmlDoc.createTextNode(tempAttr);
                styleTag.appendChild(textNode);
                p.insertBefore(styleTag, p.firstChild);
            }
        }
    });
    return xmlDoc;
};

const setTableStyle = xmlDoc => {
    //===> for <td> style formatting
    let elementTR = xmlDoc.getElementsByTagName("tr");
    Array.from(elementTR).map(tr => {
        let elementTH = tr.getElementsByTagName("th");
        let elementTD = tr.getElementsByTagName("td");
        Array.from(elementTH)
            .concat(Array.from(elementTD))
            .map((td, idx) => {
                if (td.hasAttribute("style")) {
                    document.body.appendChild(td);
                    let computed = window.getComputedStyle(td);
                    let bgColor = computed.getPropertyValue("background-color");
                    let width = computed.getPropertyValue("width");
                    let height = computed.getPropertyValue("height");
                    let styleTag = xmlDoc.createElement("style");
                    if (bgColor && bgColor !== "rgba(0, 0, 0, 0)") {
                        let hex = rgb2hex(bgColor);
                        // hex = bgColor === "rgba(0, 0, 0, 0)" ? "FFFFFF" : rgb2hex(bgColor);
                        let colorTag = xmlDoc.createElement("color");
                        let textNode = xmlDoc.createTextNode(hex);
                        colorTag.appendChild(textNode);
                        styleTag.appendChild(colorTag);
                    }
                    if (width && width !== "2.70312px") {
                        width = getUnit(width);
                        let widthTag = xmlDoc.createElement("width");
                        let textNode = xmlDoc.createTextNode(width);
                        widthTag.appendChild(textNode);
                        styleTag.appendChild(widthTag);
                    }
                    if (height && height !== "39.5938px") {
                        height = getUnit(height);
                        let heightTag = xmlDoc.createElement("height");
                        let textNode = xmlDoc.createTextNode(height);
                        heightTag.appendChild(textNode);
                        styleTag.appendChild(heightTag);
                    }
                    td.insertBefore(styleTag, td.firstChild);
                    tr.insertBefore(td, tr.childNodes[idx]);
                }
            });
    });
    return xmlDoc;
};

const getUnit = value => {
    let numeric = value.match(/\d+/);
    if (numeric === null) {
        console.log("Invalid property value returned");
    }
    numeric = numeric[0];

    let unit = value.match(/\D+$/);
    unit = unit == null ? "px" : unit[0];
    // convert all css units to cm round to 10 decimal point
    let convert = cssConvert(numeric, unit, "cm", 10);
    return convert;
};

const reorderArray = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
};

const removeAttributes = xml => {
    let elemns = xml.getElementsByTagNameNS("*", "*");
    Array.from(elemns).map(elm => {
        if (elm.hasAttributes()) {
            let attrs = elm.attributes;
            Array.from(attrs).forEach(attr => elm.removeAttribute(attr.name));
        }
    });
    return xml;
};

const removeAllTags = xml => {
    if (xml === null || xml === "") {
        return "";
    }
    xml = xml.toString();
    return xml.replace(/(<([^>]+)>)/gi, "").replace(/\&nbsp;/g, "");
};

const rgb2hex = rgb => {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return rgb && rgb.length === 4
        ? ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
              ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
              ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2)
        : "";
};
// ===>   regex for remove attribute
// temp = temp.replace(/\s*[^=\s+]+\s*=\s*([^=>]+)?(?=(\s+|>))/g, "")

const checkPermission = (tab, item, subitem) => {
    let user_role = localStorage.getItem("role");
    let user_permissions = JSON.parse(localStorage.getItem("user_permissions"));
    if (user_role !== "super_admin") {
        if (tab === "menu") {
            if (!subitem) {
                return user_permissions && user_permissions[tab] && user_permissions[tab][item] ? user_permissions[tab][item].view || false : false;
            } else {
                return user_permissions && user_permissions[tab] && user_permissions[tab][item] && user_permissions[tab][item][subitem]
                    ? user_permissions[tab][item][subitem].view || false
                    : false;
            }
        } else {
            return user_permissions && user_permissions[tab] && user_permissions[tab][item] ? user_permissions[tab][item][subitem] || false : false;
        }
    }
    return true;
};

const priorityTooltips = {
    0: `<h4>Probability of Failure</h4><p>5 = Unlikely to occur within next 10 years</p><p>10 = May occur within next 10 years</p><p>15 = May occur within next 5 years</p><p>20 = May occur within next year</p><p>25 = Has already occurred</p>`,
    1: `<h4>Risk of Failure</h4><p>6 = Unlikely to affect operations</p><p>12 = Will require additional support measures</p><p>18 = Will negatively affect efficiency</p><p>24 =  Will negatively affect patient and/or staff safety </p><p>30 = Will close facility or portion of facility</p>`,
    2: `<h4>Compliance</h4><p>15 = Yes, there is a compliance issue</p><p>(System is not in compliance w/ specific codes, standards, or guidelines)</p><p>0 = No compliance issue</p>`,
    3: `<h4>Patient Experience</h4><p>10 = Yes, conditions could have an impact on a patient's experience at the facility</p><p>0 = No impact on patients</p>`,
    4: `<h4>Local Priority</h4><p>20 = Highest</p><p>15 = 2nd highest</p><p>10 = 3rd highest</p><p>5 = 4th highest</p><p>0 = 5th highest</p>`
};

const priorityConfig = [
    {
        label: "Probability of Failure",
        options: [
            { name: "5 = Unlikely to occur within next 10 years", value: "5" },
            { name: "10 = May occur within next 10 years", value: "10" },
            { name: "15 = May occur within next 5 years", value: "15" },
            { name: "20 = May occur within next year", value: "20" },
            { name: "25 = Has already occurred", value: "25" }
        ]
    },
    {
        label: "Risk of Failure",
        options: [
            { name: "6 = Unlikely to affect operations", value: "6" },
            { name: "12 = Will require additional support measures", value: "12" },
            { name: "18 = Will negatively affect efficiency", value: "18" },
            { name: "24 = Will negatively affect patient and/or staff safety", value: "24" },
            { name: "30 = Will close facility or portion of facility", value: "30" }
        ]
    },
    {
        label: "Compliance",
        options: [
            { name: "15 = Yes, there is a compliance issue", value: "15" },
            { name: "0 = No compliance issue", value: "0" }
        ]
    },
    {
        label: "Patient Experience",
        options: [
            { name: "10 = Yes, conditions could have an impact on a patient's experience at the facility", value: "10" },
            { name: "0 = No impact on patients", value: "0" }
        ]
    },
    {
        label: "Local Priority",
        options: [
            { name: "20 = Highest", value: "20" },
            { name: "15 = 2nd highest", value: "15" },
            { name: "10 = 3rd highest", value: "10" },
            { name: "5 = 4th highest", value: "5" },
            { name: "0 = 5th highest", value: "0" }
        ]
    }
];

const priorityConfigForTables = {
    priority_element1: {
        5: "5 = Unlikely to occur within next 10 years",
        10: "10 = May occur within next 10 years",
        15: "15 = May occur within next 5 years",
        20: "20 = May occur within next year",
        25: "25 = Has already occurred"
    },
    priority_element2: {
        6: "6 = Unlikely to affect operations",
        12: "12 = Will require additional support measures",
        18: "18 = Will negatively affect efficiency",
        24: "24 = Will negatively affect patient and/or staff safety",
        30: "30 = Will close facility or portion of facility"
    },
    priority_element3: {
        15: "15 = Yes, there is a compliance issue",
        0: "0 = No compliance issue"
    },
    priority_element4: {
        10: "10 = Yes, conditions could have an impact on a patient's experience at the facility",
        0: "0 = No impact on patients"
    },
    priority_element5: {
        20: "20 = Highest",
        15: "15 = 2nd highest",
        10: "10 = 3rd highest",
        5: "5 = 4th highest",
        0: "0 = 5th highest"
    }
};

const passwordStrengthTooltip = `Password must contain: \n-  At least 6 characters \n-  At least one special character \n-  At least one number \n-  At least one uppercase and lowercase letters`;

const getAddressFromCoordinates = async (latitude, longitude) => {
    if (!latitude || !longitude) return "";
    try {
        Geocode.setApiKey(GOOGLE_MAP_API_KEY);
        Geocode.setLocationType("ROOFTOP");
        let response = await Geocode.fromLatLng(latitude, longitude);
        return response.results[0].formatted_address;
    } catch (error) {
        console.error(error);
    }
};

const renderFileSize = size => {
    let text = "";
    if (!size) text = "";
    else if (size > 1000 * 1000) {
        text = `${(size / (1000 * 1000)).toFixed(2)} MB`;
    } else {
        text = `${(size / 1000).toFixed(2)} KB`;
    }
    return text;
};

const thousandsSeparators = num => {
    let n = num.toString();
    let number = n.split(".");
    number[0] = number[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return number.join(".");
};

const removeOwnEntityFromList = (list, field) => {
    list = list ? Object.fromEntries(Object.entries(list)?.filter(([key, value]) => key !== field?.split(".")[0])) : null;
    return list;
};

const toTitleCase = str => {
    let exceptions = [
        "a",
        "an",
        "the",
        "at",
        "off",
        "by",
        "on",
        "down",
        "onto",
        "for",
        "over",
        "from",
        "past",
        "in",
        "to",
        "into",
        "upon",
        "near",
        "with",
        "of",
        "and",
        "so",
        "as",
        "than",
        "but",
        "that",
        "if",
        "when",
        "nor",
        "yet",
        "once",
        "or"
    ];
    let splitStr = str.split(" ");
    for (let i = 0; i < splitStr.length; i++) {
        if (splitStr[i] === splitStr[i]?.toUpperCase()) {
            splitStr[i] = splitStr[i];
        } else {
            if (i > 0 && exceptions.includes(splitStr[i]?.toLowerCase())) {
                splitStr[i] = splitStr[i].toLowerCase();
            } else {
                splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
            }
        }
    }
    const array = splitStr.join(" ");
    array.toString();
    return array;
};

const resetCursor = e => {
    const caret = e.target.selectionStart;
    const element = e.target;
    window.requestAnimationFrame(() => {
        element.selectionStart = caret;
        element.selectionEnd = caret;
    });
};

const dateFinder = (type, hasTime) => {
    let dateRange = { from: "", to: "" };
    const dateFormat = hasTime ? `YYYY-MM-DD hh:mm A z` : "YYYY-MM-DD";
    switch (type) {
        case "yesterday":
            dateRange.from = moment(new Date()).subtract(1, "days").format(dateFormat);
            dateRange.to = moment(new Date()).format(dateFormat);
            break;
        case "today":
            dateRange.from = moment(new Date()).format(dateFormat);
            dateRange.to = moment(new Date()).add(1, "days").format(dateFormat);
            break;
        case "tomorrow":
            dateRange.from = moment(new Date()).add(1, "days").format(dateFormat);
            dateRange.to = moment(new Date()).add(2, "days").format(dateFormat);
            break;
        case "last_month":
            dateRange.from = moment(new Date()).subtract(1, "months").startOf("month").format(dateFormat);
            dateRange.to = moment(new Date()).subtract(1, "months").endOf("month").format(dateFormat);
            break;
        case "this_month":
            dateRange.from = moment(new Date()).startOf("month").format(dateFormat);
            dateRange.to = moment(new Date()).endOf("month").format(dateFormat);
            break;
        case "next_month":
            dateRange.from = moment(new Date()).add(1, "months").startOf("month").format(dateFormat);
            dateRange.to = moment(new Date()).add(1, "months").endOf("month").format(dateFormat);
            break;
        case "last_week":
            dateRange.from = moment(new Date()).subtract(1, "weeks").startOf("week").format(dateFormat);
            dateRange.to = moment(new Date()).subtract(1, "weeks").endOf("week").format(dateFormat);
            break;
        case "this_week":
            dateRange.from = moment(new Date()).startOf("week").format(dateFormat);
            dateRange.to = moment(new Date()).endOf("week").format(dateFormat);
            break;
        case "next_week":
            dateRange.from = moment(new Date()).add(1, "weeks").startOf("week").format(dateFormat);
            dateRange.to = moment(new Date()).add(1, "weeks").endOf("week").format(dateFormat);
            break;
        case "last_year":
            dateRange.from = moment(new Date()).subtract(1, "years").startOf("year").format(dateFormat);
            dateRange.to = moment(new Date()).subtract(1, "years").endOf("year").format(dateFormat);
            break;
        case "this_year":
            dateRange.from = moment(new Date()).startOf("year").format(dateFormat);
            dateRange.to = moment(new Date()).endOf("year").format(dateFormat);
            break;
        case "next_year":
            dateRange.from = moment(new Date()).add(1, "years").startOf("year").format(dateFormat);
            dateRange.to = moment(new Date()).add(1, "years").endOf("year").format(dateFormat);
            break;

        default:
            break;
    }
    return dateRange;
};

const dateTimeFinder = type => {
    let dateRange = { from: "", to: "" };
    const dateFormat = `YYYY-MM-DD hh:mm A z`;
    switch (type) {
        case "yesterday":
            dateRange.from = moment(new Date()).subtract(1, "days").startOf("day").format(dateFormat);
            dateRange.to = moment(new Date()).subtract(1, "days").endOf("day").format(dateFormat);
            break;
        case "today":
            dateRange.from = moment(new Date()).startOf("day").format(dateFormat);
            dateRange.to = moment(new Date()).endOf("day").format(dateFormat);
            break;
        case "last_month":
            dateRange.from = moment(new Date()).subtract(1, "months").startOf("month").format(dateFormat);
            dateRange.to = moment(new Date()).subtract(1, "months").endOf("month").format(dateFormat);
            break;
        case "this_month":
            dateRange.from = moment(new Date()).startOf("month").format(dateFormat);
            dateRange.to = moment(new Date()).endOf("month").format(dateFormat);
            break;
        case "last_week":
            dateRange.from = moment(new Date()).subtract(1, "weeks").startOf("week").format(dateFormat);
            dateRange.to = moment(new Date()).subtract(1, "weeks").endOf("week").format(dateFormat);
            break;
        case "this_week":
            dateRange.from = moment(new Date()).startOf("week").format(dateFormat);
            dateRange.to = moment(new Date()).endOf("week").format(dateFormat);
            break;
        case "last_year":
            dateRange.from = moment(new Date()).subtract(1, "years").startOf("year").format(dateFormat);
            dateRange.to = moment(new Date()).subtract(1, "years").endOf("year").format(dateFormat);
            break;
        case "this_year":
            dateRange.from = moment(new Date()).startOf("year").format(dateFormat);
            dateRange.to = moment(new Date()).endOf("year").format(dateFormat);
            break;
        default:
            break;
    }
    return dateRange;
};

const inrange = (min, number, max) => {
    if (!isNaN(number) && number >= min && number <= max) {
        return true;
    } else {
        return false;
    }
};

const getUsefullLifeRemaining = (installed_year, service_life) => {
    let usefulLifeRemaining =
        parseInt(installed_year) && parseInt(service_life) ? parseInt(installed_year) + parseInt(service_life) - new Date().getFullYear() : "";
    return usefulLifeRemaining;
};
const getCurrentAge = installed_year => {
    let currentAge = parseInt(installed_year) ? new Date().getFullYear() - parseInt(installed_year) : "";
    return currentAge;
};

const fileReader = file => {
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
        fileReader.onerror = () => {
            fileReader.abort();
            reject(new Error("Problem parsing file"));
        };

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.readAsText(file);
    });
};
const getExportErrorMessage = async error => {
    let msg = "";
    try {
        const { data, status } = error.response;
        if (status === 400) {
            msg = "No Data Found";
        } else if (status === 406) {
            const file = await fileReader(data);
            const { message } = JSON.parse(file);
            msg =
                message === "file_not_exist"
                    ? "Uploaded Template File Not Exist. Please Upload a New Template"
                    : message === "file_not_found"
                    ? "Template File Not Found. Please Upload a Template"
                    : message;
        } else {
            msg = "Oops..Export Failed!";
        }
    } catch (error) {
        msg = "Oops..Export Failed!";
    }
    return msg;
};

const MMBTU_TO_kBTU = mmbtu => {
    return 1000 * parseFloat(mmbtu);
};
const kWH_TO_kBTU = kwh => {
    return 3.4128 * parseFloat(kwh);
};
const splitAddressComponents = addressComponents => {
    const addressObj = {};
    addressComponents.forEach(component => {
        if (component.types.includes("street_number")) {
            addressObj.street = component.long_name;
        } else if (component.types.includes("route")) {
            if (addressObj.street) {
                addressObj.street += ` ${component.long_name}`;
            } else {
                addressObj.street = component.long_name;
            }
        } else if (component.types.includes("locality")) {
            addressObj.city = component.long_name;
        } else if (component.types.includes("administrative_area_level_1")) {
            addressObj.state = component.long_name;
        } else if (component.types.includes("country")) {
            addressObj.country = component.long_name;
        } else if (component.types.includes("postal_code")) {
            addressObj.zip_code = component.long_name;
        }
    });
    return addressObj;
};
export {
    addToBreadCrumpData,
    updateBreadCrumpData,
    resetBreadCrumpData,
    findPrevPathFromBreadCrump,
    findPrevPathFromBreadCrumpData,
    findPrevPathFromBreadCrumpRecData,
    popBreadCrumpRecData,
    popBreadCrumpData,
    bulkResetBreadCrumpData,
    findInfoPathFromBreadCrump,
    resetToDashboardBreadCrumpData,
    convertToXML,
    reorderArray,
    dataURLtoFile,
    checkPermission,
    priorityTooltips,
    priorityConfig,
    passwordStrengthTooltip,
    popBreadCrumpOnPageClose,
    priorityConfigForTables,
    getAddressFromCoordinates,
    renderFileSize,
    thousandsSeparators,
    removeOwnEntityFromList,
    toTitleCase,
    dateFinder,
    dateTimeFinder,
    findPrevNameFromBreadCrumpData,
    inrange,
    getUsefullLifeRemaining,
    resetCursor,
    fileReader,
    getExportErrorMessage,
    removeAllTags,
    MMBTU_TO_kBTU,
    kWH_TO_kBTU,
    getCurrentAge,
    splitAddressComponents
};
