import React from "react";
import style from "./SideNav.css";
import { Icon } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import {
    findInfoPathFromBreadCrump
} from "../../../../config/utils";
import { color } from "highcharts";

class SideMenuTree extends React.Component {
    state = {
        expandedNodes: [],
        subNode: [],
        childNode: [],
        buildingNode: [],
        flooorNode: [],
        lastNode: [],
        activeItem: "",
        activeSubNode1: "",
        activeSubNode2: "",
        activeSubNode3: "",
        activeSubNode4: "",
        activeSubNode5: "",
        activeStyle: [],
        activeTemp: '',
        childNodeCollapse: [],
        buildingNodeCollapse: [],
        floorNodeCollapse: [],
        activeStyleTemp: []
    };

    componentDidUpdate(prevProps) {
        const { data } = this.props;
        // const pathname = this.props.location.pathname.split("/")[1];
        // const defaultHomePage = pathname.charAt(0).toUpperCase() + pathname.slice(1);

        // if (prevProps.data !== data) {
        //     let bcData = findInfoPathFromBreadCrump();
        //     console.log("bcData:", bcData);
        //     pathname === data[0].label.toLowerCase().trim()
        //         ? this.setState({ activeItem: defaultHomePage })
        //         : this.setState({ activeItem: bcData.length === 1 ? pathname : "" });
        // }

        if (prevProps.collapseAll !== this.props.collapseAll) {
            this.setState({
                activeItem: (data && data[0].label.charAt(0).toUpperCase() + data[0].label.slice(1)).trim(),
                // activeItem: "Dashboard",
                mainItemLabel: "",
                activeStyle: "",
                activeSubNode1: "",
                activeSubNode2: "",
                activeSubNode3: "",
                activeSubNode4: "",
                activeSubNode5: "",
                subNode: [],
                childNode: [],
                flooorNode: [],
                buildingNode: [],
                expandedNodes: [],
                activeNode: "",
                childNodeCollapse: [],
                buildingNodeCollapse: [],
                floorNodeCollapse: [],
                activeStyleTemp: []
            });
        }
    }

    clearAllActiveItems = async (key, item) => {
        let data = this.state.subNode;
        let activeData = this.state.activeStyleTemp;
        let subNode = [];
        item.nodes.map(i => (
            this.state.subNode.includes(i.key) ?
                subNode = data.filter(itm => itm !== i.key)
                : ""
        ));
        let childNode = await this.state.childNodeCollapse.filter(i =>
            i.item !== item.key.charAt(0).toUpperCase() + item.key.slice(1));
        let buildingNode = await this.state.buildingNodeCollapse.filter(i =>
            i.item !== item.key.charAt(0).toUpperCase() + item.key.slice(1));
        let floorNode = await this.state.floorNodeCollapse.filter(i =>
            i.item !== item.key.charAt(0).toUpperCase() + item.key.slice(1));
        let tempData = await activeData.filter(i =>
            i.item !== item.key);

        this.setState({
            ...this.state,
            expandedNodes: this.state.expandedNodes.filter(itm => itm !== key),
            subNode: subNode,
            childNode: childNode.map(i => i.key),
            buildingNode: buildingNode.map(i => i.key),
            flooorNode: floorNode.map(i => i.key),
            childNodeCollapse: [],
            buildingNodeCollapse: [],
            floorNodeCollapse: [],
            activeStyle: tempData.map(i => i.key),
            activeStyleTemp: tempData,
            activeTemp: tempData.map(i => i.key),
            activeUrl: tempData.length ? tempData[tempData.length - 1].item : ""
        });
    }

    setActiveStyle = async (label, mainItemKey, entity) => {
        await this.setState({
            activeStyle: [...this.state.activeStyle,
                label
            ],
            activeStyleTemp: [...this.state.activeStyleTemp,
            { "item": mainItemKey, key: label, entity: entity }
            ],
            activeUrl: mainItemKey
        });
        await this.setState({
            ...this.state,
            subNode: [...this.state.subNode, label],
        })
    }

    removeItem = async (key, mainKey, entity) => {
        let mainArray = [];
        let entityFilter = this.state.activeStyleTemp.filter(i => i.entity === entity && i.item === mainKey);
        let rest = this.state.activeStyleTemp.filter(i => i.entity !== entity).filter(u => u.item === mainKey);

        const arr = this.state.activeStyleTemp.filter(i => i.item === mainKey); // project
        let d = this.state.activeStyleTemp;
        const filtarr = arr.filter(i => i.key !== key);
        const pro = this.state.activeStyleTemp.filter(i => i.item !== mainKey); //other item
        mainArray = pro.concat(filtarr);

        // const startIndex = arr.findIndex(i => i.key === key);
        // const startIndex1 = d.findIndex(i => i.key === key);
        // let filteredArray = arr.splice(startIndex, arr.length - 1);
        // mainArray = pro.concat(arr);
        await this.setState({ activeStyleTemp: mainArray });
        await this.setState({ activeStyle: mainArray.map(i => i.key) });
        await this.setState({
            activeUrl: this.state.activeStyleTemp.length ? this.state.activeStyleTemp[this.state.activeStyleTemp.length - 1].item : ""
        });
        await this.setState({
            ...this.state,
            subNode: this.state.subNode.filter(
                itm => itm !== key
            )
        })
    };

    showSiblingsOnParent(nodes, item, width) {
        var classWidth = width ? width : 30;
        var nodeLevel = 1;
        return (
            nodes && nodes.length > 0 && nodes.map(node => {
                return (
                    <>
                        <div class="subMain">
                            <div
                                class={`${this.state.activeNode == node.key && this.state.mainElement === item.key ? "activeStyle1" : ""}
                                                                        ${this.state.activeStyle[this.state.activeStyle.length - 1] == nodes.key
                                        //  && this.state.activeUrl === item.key
                                        ? "childmain activeStyle"
                                        : "childmain"}`}
                            >
                                <span style={{ paddingRight: `${classWidth}px` }}></span>


                                <span>
                                    {node && (!node.nodes || !node.nodes.length) ? (
                                        <Icon
                                            name="circle"
                                            color={this.state.activeSubNode1 == node.key ? "blue" : "grey"}
                                            size="mini"
                                        />
                                    ) : (
                                            <Icon
                                                name={
                                                    this.state.subNode.includes(node.key)
                                                        ? "minus square"
                                                        : "plus square"
                                                }
                                                color="grey"
                                                onClick={async () => {
                                                    // if (this.state.subNode.includes(node.key)) {
                                                    //     this.setState({
                                                    //         ...this.state,
                                                    //         subNode: this.state.subNode.filter(
                                                    //             itm => itm !== node.key
                                                    //         )
                                                    //     });
                                                    // } else {
                                                    //     this.setState({
                                                    //         ...this.state,
                                                    //         subNode: [...this.state.subNode, node.key],
                                                    //     });
                                                    // }

                                                    const flag1 = this.state.activeStyleTemp.some(i => i.key === node.key && i.item.toLowerCase() === item.key.toLowerCase());
                                                    if (flag1) {
                                                        this.removeItem(node.key, item.key);
                                                    }
                                                    else {
                                                        await this.setActiveStyle(node.key, item.key, node.entity);
                                                    }
                                                }}
                                            />
                                        )}
                                </span>
                                <span
                                    class="childName"
                                    onClick={() => {
                                        this.setState({
                                            activeSubNode1: node.key
                                        });
                                        this.setState({
                                            activeSubNode2: ""
                                        });
                                        this.setState({
                                            activeSubNode3: "",
                                            activeSubNode4: "",
                                            activeSubNode5: ""
                                        });
                                        this.props.onClickItem(node, 1);
                                        // this.setActiveNode(node.key, item.key, item);
                                    }}
                                    data-tip={node.entity}
                                    data-multiline={true}
                                    data-place="top"
                                    data-effect="solid"
                                    data-background-color="#007bff"
                                >
                                    {node.entity ? <ReactTooltip /> : null}
                                    {node.label}
                                </span>
                            </div>
                        </div>
                        {
                            this.state.subNode.includes(node.key) ?
                                node && node.nodes && node.nodes && this.showSiblingsOnParent(node.nodes, node, classWidth + 18)
                                :
                                ""
                        }
                    </>

                )
            })
        );
    }

    render() {
        const { data } = this.props;
        return (
            <>
                {data && data.map(item => (
                    <div class="main">
                        <div className={this.state.activeItem == item.url ? "navTitle active" : "navTitle"}>
                            <span class="navIcon">
                                <Icon
                                    name={this.state.expandedNodes.includes(item.key) ? "chevron down" : "chevron right"}
                                    color="grey"
                                    onClick={async () => {
                                        if (this.state.expandedNodes.includes(item.key)) {
                                            await this.clearAllActiveItems(item.key, item);
                                            // await this.removeItem(item.key, item.key);
                                            this.setState({ mainItemLabel: "" })
                                        } else {
                                            await this.setState({
                                                ...this.state,
                                                expandedNodes: [...this.state.expandedNodes, item.key],
                                                mainItemLabel: item.key

                                            });
                                            await this.setActiveStyle(item.key, item.key);
                                        }
                                    }}

                                />
                            </span>
                            <span
                                class="name"
                                onClick={() => {
                                    this.props.onClickItem(item, 0);
                                    this.setState({ activeItem: item.url });
                                }}
                            >
                                <strong>{item.label}</strong>
                            </span>
                        </div>
                        {this.state.expandedNodes.includes(item.key) ?
                            this.showSiblingsOnParent(item.nodes, item)
                            : ""
                        }

                    </div>//main div
                ))}

            </>
        );
    }
}
export default SideMenuTree;