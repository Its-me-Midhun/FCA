import React from "react";
import style from "./SideNav.css";
import { Icon } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { findInfoPathFromBreadCrump } from "../../../../config/utils";

class SideNav extends React.Component {
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
        activeTemp: "",
        subNodeCollapse: [],
        childNodeCollapse: [],
        buildingNodeCollapse: [],
        floorNodeCollapse: [],
        activeStyleTemp: [],
        parentNode: []
    };

    componentDidUpdate(prevProps) {
        const { data } = this.props;
        const pathname = this.props.location.pathname.split("/")[1];
        const defaultHomePage = pathname.charAt(0).toUpperCase() + pathname.slice(1);

        if (prevProps.data !== data) {
            let bcData = findInfoPathFromBreadCrump();
            pathname === data[0].label.toLowerCase().trim()
                ? this.setState({ activeItem: defaultHomePage })
                : this.setState({ activeItem: bcData && bcData.length && bcData.length === 1 ? pathname : "" });
        }

        if (prevProps.collapseAll !== this.props.collapseAll) {
            this.setState({
                activeItem: pathname.charAt(0).toUpperCase() + pathname.slice(1),
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
                subNodeCollapse: [],
                activeStyleTemp: [],
                parentNode: []
            });
        }
    }

    setActiveStyle = async (label, mainItemKey, entity, parentKey) => {
        await this.setState({
            activeStyle: [...this.state.activeStyle, label],
            parentNode: [...this.state.parentNode, parentKey],
            activeStyleTemp: [
                ...this.state.activeStyleTemp,
                {
                    item: mainItemKey,
                    key: label,
                    entity: entity,
                    parentNode: [...this.state.parentNode, parentKey]
                }
            ],
            activeUrl: mainItemKey
        });
        // let activeData = this.state.activeStyleTemp;
        // let result = activeData.filter(i => i.item === mainItemKey).filter(u => u.parentNode.map(o => o === label));
        // debugger;
    };

    clearAllActiveItems = async (key, item) => {
        // let data = this.state.subNode;
        let data = this.state.subNodeCollapse;

        let activeData = this.state.activeStyleTemp;
        let subNode = [];
        // item && item.nodes && item.nodes.map(i => (this.state.subNode.includes(i.key) ? (subNode = data.filter(itm => itm.key !== i.key).filter(u => u.item.toLowerCase() !== key.toLowerCase())) : ""));

        // item && item.nodes && item.nodes.map(i => (this.state.subNode.includes(i.key) ? (subNode = data.filter(itm => itm !== i.key)) : ""));
        // subNode = await this.state.subNodeCollapse.filter(i => i.item !== item.key.charAt(0).toUpperCase() + item.key.slice(1));
        subNode = await this.state.subNodeCollapse.filter(i => i.item && i.item.toLowerCase() !== item.key.toLowerCase());

        let childNode = await this.state.childNodeCollapse.filter(i => i.item && i.item.toLowerCase() !== item.key.toLowerCase());

        // let childNode = await this.state.childNodeCollapse.filter(i => i.item !== item.key.charAt(0).toUpperCase() + item.key.slice(1));
        let buildingNode = await this.state.buildingNodeCollapse.filter(i => i.item && i.item.toLowerCase() !== item.key.toLowerCase());
        let floorNode = await this.state.floorNodeCollapse.filter(i => i.item && i.item.toLowerCase() !== item.key.toLowerCase());
        let tempData = await activeData.filter(i => i.item && i.item.toLowerCase() !== item.key.toLowerCase());

        this.setState({
            ...this.state,
            expandedNodes: this.state.expandedNodes.filter(itm => itm !== key),
            subNode: subNode.map(i => i.key),
            childNode: childNode.map(i => i.key),
            buildingNode: buildingNode.map(i => i.key),
            flooorNode: floorNode.map(i => i.key),
            subNodeCollapse: subNode,
            childNodeCollapse: childNode,
            buildingNodeCollapse: buildingNode,
            floorNodeCollapse: floorNode,
            activeStyle: tempData.map(i => i.key),
            activeStyleTemp: tempData,
            activeTemp: tempData.map(i => i.key),
            activeUrl: tempData.length ? tempData[tempData.length - 1].item : ""
        });
    };

    removeItem = async (key, mainKey, entity, parentKey) => {
        // let c = [];
        // let filteredArray = [];
        // let filteredArray1 = [];

        // let activeData = this.state.activeStyleTemp;
        // let rest = activeData.filter(i => i.item !== mainKey);//other item
        // let result = activeData.filter(i => i.item === mainKey);//selectted item

        // result.map(u => u.parentNode.includes(key) ?
        //     filteredArray1 = [...filteredArray1, u]
        //     :
        //     c = [...c, u]
        // )
        // let resultKey = c.filter(i => i.key !== key);
        // filteredArray = filteredArray1.filter(i => i.key !== key);

        // let array = rest.concat(resultKey);
        // await this.setState({ activeStyleTemp: array });
        // await this.setState({ activeStyle: array.map(i => i.key) });
        // await this.setState({
        //     activeUrl: this.state.activeStyleTemp.length ? this.state.activeStyleTemp[this.state.activeStyleTemp.length - 1].item : ""
        // });
        // debugger;
        // filteredArray.map(i =>
        //     this.state.subNode.includes(i.key) ?

        //         this.setState({
        //             subNode: this.state.subNode.filter(u => u !== i.key)
        //         })
        //         :
        //         this.state.childNode.includes(i.key) ?
        //             this.setState({
        //                 childNode: this.state.childNode.filter(u => u !== i.key)
        //             })
        //             :
        //             this.state.buildingNode.includes(i.key) ?
        //                 this.setState({
        //                     buildingNode: this.state.buildingNode.filter(u => u !== i.key)
        //                 })
        //                 : this.state.flooorNode.includes(i.key) ?
        //                     this.setState({
        //                         flooorNode: this.state.flooorNode.filter(u => u !== i.key)
        //                     }) : ""
        // );

        // }

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
    };

    // removeItem = async (key, mainKey, entity) => {
    //     let mainArray = [];
    //     let entityFilter = this.state.activeStyleTemp.filter(i => i.entity === entity && i.item === mainKey);
    //     let rest = this.state.activeStyleTemp.filter(i => i.entity !== entity).filter(u => u.item === mainKey);
    //     if (entityFilter.length > 1) {
    //         let result = entityFilter.filter(i => i.key !== key);
    //         const pro = this.state.activeStyleTemp.filter(i => i.item !== mainKey);//other item
    //         mainArray = rest.concat(result);
    //         await this.setState({ activeStyleTemp: mainArray });
    //         await this.setState({ activeStyle: mainArray.map(i => i.key) });
    //         await this.setState({
    //             activeUrl: this.state.activeStyleTemp.length ?
    //                 this.state.activeStyleTemp[this.state.activeStyleTemp.length - 1].item
    //                 : "",
    //         });
    //     }
    //     else {
    //         const arr = this.state.activeStyleTemp.filter(i => i.item === mainKey);// project
    //         let d = this.state.activeStyleTemp;
    //         const filtarr = arr.filter(i => i.key !== key);
    //         const pro = this.state.activeStyleTemp.filter(i => i.item !== mainKey);//other item
    //         mainArray = pro.concat(filtarr);

    //         const startIndex = arr.findIndex(i => i.key === key);
    //         const startIndex1 = d.findIndex(i => i.key === key);

    //         let filteredArray = arr.splice(startIndex, arr.length - 1);
    //         mainArray = pro.concat(arr);
    //         // await this.setState({ activeStyleTemp: mainArray });
    //         // await this.setState({ activeStyle: mainArray.map(i => i.key) });
    //         await this.setState({ activeStyleTemp: mainArray });
    //         await this.setState({ activeStyle: mainArray.map(i => i.key) });
    //         await this.setState({
    //             activeUrl: this.state.activeStyleTemp.length ?
    //                 this.state.activeStyleTemp[this.state.activeStyleTemp.length - 1].item
    //                 : "",
    //             // childNode: "",
    //             // buildingNode: "",
    //             // flooorNode: "",
    //         })

    //         filteredArray.map(i =>
    //             this.state.subNode.includes(i.key) ?

    //                 this.setState({
    //                     subNode: this.state.subNode.filter(u => u !== i.key)
    //                 })
    //                 :
    //                 this.state.childNode.includes(i.key) ?
    //                     this.setState({
    //                         childNode: this.state.childNode.filter(u => u !== i.key)
    //                     })
    //                     :
    //                     this.state.buildingNode.includes(i.key) ?
    //                         this.setState({
    //                             buildingNode: this.state.buildingNode.filter(u => u !== i.key)
    //                         })
    //                         : this.state.flooorNode.includes(i.key) ?
    //                             this.setState({
    //                                 flooorNode: this.state.flooorNode.filter(u => u !== i.key)
    //                             }) : ""
    //         );

    //     }

    // }

    setActiveNode(key, mainItemKey, item) {
        this.setState({
            activeNode: key,
            mainElement: mainItemKey,
            activeItem: item.url
        });
    }

    findEntityNameForChild = entity => {
        // eslint-disable-next-line default-case
        switch (entity) {
            case "projects":
                return "project_regions";
            case "regions":
                return "region_sites";
            case "sites":
                return "site_buildings";
            case "reports":
                return "report_regions";
            case "efcis":
                return "efci_regions";
            case "buildings":
                return "building_floors";
        }
    };

    findEntityNameForGrandChild = entity => {
        // eslint-disable-next-line default-case
        switch (entity) {
            case "projects":
                return "project_sites";
            case "reports":
                return "report_sites";
            case "efcis":
                return "efci_sites";
            case "regions":
                return "region_buildings";
            case "sites":
                return "site_floors";
        }
    };

    findEntityNameForGGrandChild = entity => {
        // eslint-disable-next-line default-case
        switch (entity) {
            case "projects":
                return "project_buildings";
            case "reports":
                return "report_buildings";
            case "efcis":
                return "efci_buildings";
            case "regions":
                return "region_floors";
        }
    };

    findEntityNameForFloors = entity => {
        switch (entity) {
            case "projects":
                return "project_floors";
        }
    };

    subMenuCheck = item => {
        if (item && item.view === false) {
            return true;
        } else if (item && item.view === true) {
            return false;
        }
        return item.view;
    };

    render() {
        let hasChild = true;
        return (
            <div>
                {this.props &&
                    this.props.data.map((item, i) => {
                        return item.view == true ? (
                            <React.Fragment key={i}>
                                <div className="main">
                                    <div className={item.url && item.url === this.state.activeItem ? "navTitle active" : "navTitle"}>
                                        <span className="navIcon">
                                            <Icon
                                                name={this.state.expandedNodes.includes(item.key) ? "chevron down" : "chevron right"}
                                                color="grey"
                                                onClick={async () => {
                                                    if (this.state.expandedNodes.includes(item.key)) {
                                                        await this.clearAllActiveItems(item.key, item);
                                                        await this.removeItem(item.key, item.key);
                                                    } else {
                                                        this.props.sideMenuHandler(item.name, item);
                                                        await this.setState({
                                                            ...this.state,
                                                            expandedNodes: [...this.state.expandedNodes, item.key]
                                                        });
                                                        await this.setActiveStyle(item.key, item.key, item.label, item.key);
                                                    }
                                                }}
                                            />
                                        </span>
                                        <span
                                            className="name"
                                            onClick={() => {
                                                // if (item.key !== "efci") {
                                                this.props.onClickItem(item, 0);
                                                this.setState({ activeItem: item.url });
                                                // }
                                            }}
                                        >
                                            <strong>{item.label}</strong>
                                        </span>
                                    </div>

                                    {item && item.nodes && item.nodes.length > 0 ? (
                                        <>
                                            {item &&
                                                item.nodes.map((node, i) => {
                                                    return (
                                                        !this.subMenuCheck(node) && (
                                                            <React.Fragment key={i}>
                                                                {this.state.expandedNodes.includes(item.key) ? (
                                                                    <div className="subMain">
                                                                        <div
                                                                            className={`${
                                                                                this.state.activeNode == node.key &&
                                                                                this.state.mainElement === item.key
                                                                                    ? "activeStyle1"
                                                                                    : ""
                                                                            }
                                                                        ${
                                                                            this.state.activeStyle[this.state.activeStyle.length - 1] == item.key &&
                                                                            this.state.activeUrl === item.key
                                                                                ? "childmain activeStyle"
                                                                                : "childmain"
                                                                        }`}
                                                                        >
                                                                            <span className="child"></span>
                                                                            <span>
                                                                                {
                                                                                    // node && (  !node.nodes || !node.nodes.length)
                                                                                    !node.has_child ? (
                                                                                        <Icon
                                                                                            name="circle"
                                                                                            color={
                                                                                                this.state.activeSubNode1 == node.key
                                                                                                    ? "blue"
                                                                                                    : "grey"
                                                                                            }
                                                                                            size="mini"
                                                                                        />
                                                                                    ) : (
                                                                                        <Icon
                                                                                            name={
                                                                                                this.state.subNode.includes(node.key + item.label)
                                                                                                    ? "minus square"
                                                                                                    : "plus square"
                                                                                            }
                                                                                            color="grey"
                                                                                            onClick={async () => {
                                                                                                if (
                                                                                                    this.state.subNode.includes(node.key + item.label)
                                                                                                ) {
                                                                                                    this.setState({
                                                                                                        ...this.state,
                                                                                                        subNode: this.state.subNode.filter(
                                                                                                            itm => itm !== node.key + item.label
                                                                                                        ),
                                                                                                        subNodeCollapse:
                                                                                                            this.state.subNodeCollapse.filter(
                                                                                                                itm =>
                                                                                                                    itm.key !== node.key + item.label
                                                                                                            )
                                                                                                    });
                                                                                                } else {
                                                                                                    this.props.sideMenuHandler(
                                                                                                        this.findEntityNameForChild(item.name),
                                                                                                        node,
                                                                                                        node.key
                                                                                                    );
                                                                                                    this.setState({
                                                                                                        ...this.state,
                                                                                                        subNode: [
                                                                                                            ...this.state.subNode,
                                                                                                            node.key + item.label
                                                                                                        ],
                                                                                                        subNodeCollapse: [
                                                                                                            ...this.state.subNodeCollapse,
                                                                                                            {
                                                                                                                item: item.url,
                                                                                                                key: node.key + item.label
                                                                                                            }
                                                                                                        ]
                                                                                                    });
                                                                                                }

                                                                                                const flag1 = this.state.activeStyleTemp.some(
                                                                                                    i =>
                                                                                                        i.key === node.key &&
                                                                                                        i.item.toLowerCase() ===
                                                                                                            item.key.toLowerCase()
                                                                                                );
                                                                                                if (flag1) {
                                                                                                    this.removeItem(
                                                                                                        node.key,
                                                                                                        item.key,
                                                                                                        node.entity,
                                                                                                        item.key
                                                                                                    );
                                                                                                } else {
                                                                                                    await this.setActiveStyle(
                                                                                                        node.key,
                                                                                                        item.key,
                                                                                                        node.entity,
                                                                                                        item.key
                                                                                                    );
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                    )
                                                                                }
                                                                            </span>
                                                                            <span
                                                                                className={
                                                                                    node.url
                                                                                        ? "title-tip title-tip-up sideMnu childName"
                                                                                        : "title-tip title-tip-up sideMnu childName cursor-diabled"
                                                                                }
                                                                                onClick={
                                                                                    node.url
                                                                                        ? () => {
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
                                                                                              this.setActiveNode(node.key, item.key, item);
                                                                                          }
                                                                                        : null
                                                                                }
                                                                                title={node.entity}
                                                                                data-multiline={true}
                                                                                data-place="top"
                                                                                data-effect="solid"
                                                                                data-background-color="#007bff"
                                                                                delay-update="1000"
                                                                            >
                                                                                {/* {node && node.entity ? <ReactTooltip /> : null} */}
                                                                                {node.label}
                                                                            </span>
                                                                        </div>

                                                                        {/* till here check */}

                                                                        {this.state.subNode.includes(node.key + item.label) ? (
                                                                            <>
                                                                                {(node &&
                                                                                    node.nodes &&
                                                                                    node.nodes.length > 0 &&
                                                                                    node.nodes.map(nodeItem => {
                                                                                        return (
                                                                                            <>
                                                                                                <div
                                                                                                    className={`${
                                                                                                        this.state.activeNode == nodeItem.key &&
                                                                                                        this.state.mainElement === item.key
                                                                                                            ? "activeStyle1"
                                                                                                            : ""
                                                                                                    }
                                                                                                ${
                                                                                                    this.state.activeStyle[
                                                                                                        this.state.activeStyle.length - 1
                                                                                                    ] == node.key && this.state.activeUrl === item.key
                                                                                                        ? "childmain1 activeStyle"
                                                                                                        : "childmain1"
                                                                                                }`}
                                                                                                >
                                                                                                    <span className="child1"></span>
                                                                                                    <span>
                                                                                                        {
                                                                                                            // nodeItem &&
                                                                                                            // (!nodeItem.nodes ||
                                                                                                            //     !nodeItem.nodes.length)
                                                                                                            !nodeItem.has_child ? (
                                                                                                                <Icon
                                                                                                                    name="circle"
                                                                                                                    color={
                                                                                                                        this.state.activeSubNode2 ==
                                                                                                                        nodeItem.key
                                                                                                                            ? "blue"
                                                                                                                            : "grey"
                                                                                                                    }
                                                                                                                    size="mini"
                                                                                                                />
                                                                                                            ) : (
                                                                                                                <Icon
                                                                                                                    name={
                                                                                                                        this.state.childNode.includes(
                                                                                                                            nodeItem.key + item.label
                                                                                                                        )
                                                                                                                            ? "minus square"
                                                                                                                            : "plus square"
                                                                                                                    }
                                                                                                                    color="grey"
                                                                                                                    onClick={async () => {
                                                                                                                        const flag =
                                                                                                                            this.state.activeStyleTemp.some(
                                                                                                                                i =>
                                                                                                                                    i.key ===
                                                                                                                                        nodeItem.key &&
                                                                                                                                    i.item.toLowerCase() ===
                                                                                                                                        item.key.toLowerCase()
                                                                                                                            );
                                                                                                                        if (
                                                                                                                            this.state.childNode.includes(
                                                                                                                                nodeItem.key +
                                                                                                                                    item.label
                                                                                                                            )
                                                                                                                        ) {
                                                                                                                            this.setState({
                                                                                                                                ...this.state,
                                                                                                                                childNode:
                                                                                                                                    this.state.childNode.filter(
                                                                                                                                        itm =>
                                                                                                                                            itm !==
                                                                                                                                            nodeItem.key +
                                                                                                                                                item.label
                                                                                                                                    ),
                                                                                                                                childNodeCollapse:
                                                                                                                                    this.state.childNodeCollapse.filter(
                                                                                                                                        itm =>
                                                                                                                                            itm.key !==
                                                                                                                                            nodeItem.key +
                                                                                                                                                item.label
                                                                                                                                    )
                                                                                                                            });
                                                                                                                        } else {
                                                                                                                            this.props.sideMenuHandler(
                                                                                                                                this.findEntityNameForGrandChild(
                                                                                                                                    item.name
                                                                                                                                ),
                                                                                                                                nodeItem,
                                                                                                                                node.key,
                                                                                                                                nodeItem.key
                                                                                                                            );
                                                                                                                            this.setState({
                                                                                                                                ...this.state,
                                                                                                                                childNode: [
                                                                                                                                    ...this.state
                                                                                                                                        .childNode,
                                                                                                                                    nodeItem.key +
                                                                                                                                        item.label
                                                                                                                                ],

                                                                                                                                childNodeCollapse: [
                                                                                                                                    ...this.state
                                                                                                                                        .childNodeCollapse,
                                                                                                                                    {
                                                                                                                                        item: item.url,
                                                                                                                                        key:
                                                                                                                                            nodeItem.key +
                                                                                                                                            item.label
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            });
                                                                                                                        }
                                                                                                                        if (flag) {
                                                                                                                            this.removeItem(
                                                                                                                                nodeItem.key,
                                                                                                                                item.key,
                                                                                                                                nodeItem.entity,
                                                                                                                                node.key
                                                                                                                            );
                                                                                                                        } else {
                                                                                                                            await this.setActiveStyle(
                                                                                                                                nodeItem.key,
                                                                                                                                item.key,
                                                                                                                                nodeItem.entity,
                                                                                                                                node.key
                                                                                                                            );
                                                                                                                        }
                                                                                                                    }}
                                                                                                                />
                                                                                                            )
                                                                                                        }
                                                                                                    </span>
                                                                                                    <span
                                                                                                        className={
                                                                                                            nodeItem.url
                                                                                                                ? "title-tip title-tip-up sideMnu childName"
                                                                                                                : "title-tip title-tip-up sideMnu childName cursor-diabled"
                                                                                                        }
                                                                                                        onClick={
                                                                                                            nodeItem.url
                                                                                                                ? () => {
                                                                                                                      this.setState({
                                                                                                                          activeSubNode2: nodeItem.key
                                                                                                                      });
                                                                                                                      this.setState({
                                                                                                                          activeSubNode1: ""
                                                                                                                      });
                                                                                                                      this.setState({
                                                                                                                          activeSubNode3: "",
                                                                                                                          activeSubNode4: "",
                                                                                                                          activeSubNode5: ""
                                                                                                                      });
                                                                                                                      this.props.onClickItem(
                                                                                                                          nodeItem,
                                                                                                                          2
                                                                                                                      );
                                                                                                                      this.setActiveNode(
                                                                                                                          nodeItem.key,
                                                                                                                          item.key,
                                                                                                                          item
                                                                                                                      );
                                                                                                                  }
                                                                                                                : null
                                                                                                        }
                                                                                                        title={nodeItem.entity}
                                                                                                        data-multiline={true}
                                                                                                        data-place="top"
                                                                                                        data-effect="solid"
                                                                                                        data-background-color="#007bff"
                                                                                                        delay-update="1000"
                                                                                                    >
                                                                                                        {/* {nodeItem && nodeItem.entity ? <ReactTooltip /> : null} */}
                                                                                                        {nodeItem && nodeItem.label}
                                                                                                    </span>
                                                                                                </div>
                                                                                                {(nodeItem &&
                                                                                                    nodeItem.nodes &&
                                                                                                    nodeItem.nodes.length > 0 &&
                                                                                                    nodeItem.nodes.map(child => {
                                                                                                        return (
                                                                                                            <>
                                                                                                                {this.state.childNode.includes(
                                                                                                                    nodeItem.key + item.label
                                                                                                                ) ? (
                                                                                                                    <>
                                                                                                                        <div
                                                                                                                            className={`${
                                                                                                                                this.state
                                                                                                                                    .activeNode ==
                                                                                                                                    child.key &&
                                                                                                                                this.state
                                                                                                                                    .mainElement ===
                                                                                                                                    item.key
                                                                                                                                    ? "activeStyle1"
                                                                                                                                    : ""
                                                                                                                            }
                                                                                                                         ${
                                                                                                                             this.state.activeStyle[
                                                                                                                                 this.state
                                                                                                                                     .activeStyle
                                                                                                                                     .length - 1
                                                                                                                             ] == nodeItem.key &&
                                                                                                                             this.state.activeUrl ===
                                                                                                                                 item.key
                                                                                                                                 ? " childmain2 activeStyle"
                                                                                                                                 : "childmain2"
                                                                                                                         }`}
                                                                                                                        >
                                                                                                                            <span className="childspan"></span>
                                                                                                                            <span>
                                                                                                                                {
                                                                                                                                    // child &&
                                                                                                                                    // (!child.nodes ||
                                                                                                                                    //     !child.nodes
                                                                                                                                    //         .length)
                                                                                                                                    !child.has_child ? (
                                                                                                                                        <Icon
                                                                                                                                            name="circle"
                                                                                                                                            // color="grey"
                                                                                                                                            color={
                                                                                                                                                this
                                                                                                                                                    .state
                                                                                                                                                    .activeSubNode3 ==
                                                                                                                                                child.key
                                                                                                                                                    ? "blue"
                                                                                                                                                    : "grey"
                                                                                                                                            }
                                                                                                                                            size="mini"
                                                                                                                                        />
                                                                                                                                    ) : (
                                                                                                                                        <Icon
                                                                                                                                            name={
                                                                                                                                                this.state.buildingNode.includes(
                                                                                                                                                    child.key +
                                                                                                                                                        item.label
                                                                                                                                                )
                                                                                                                                                    ? "minus square"
                                                                                                                                                    : "plus square"
                                                                                                                                            }
                                                                                                                                            color="grey"
                                                                                                                                            onClick={async () => {
                                                                                                                                                const flag2 =
                                                                                                                                                    this.state.activeStyleTemp.some(
                                                                                                                                                        i =>
                                                                                                                                                            i.key ===
                                                                                                                                                                child.key &&
                                                                                                                                                            i.item.toLowerCase() ===
                                                                                                                                                                item.key.toLowerCase()
                                                                                                                                                    );
                                                                                                                                                if (
                                                                                                                                                    this.state.buildingNode.includes(
                                                                                                                                                        child.key +
                                                                                                                                                            item.label
                                                                                                                                                    )
                                                                                                                                                ) {
                                                                                                                                                    this.setState(
                                                                                                                                                        {
                                                                                                                                                            ...this
                                                                                                                                                                .state,
                                                                                                                                                            buildingNode:
                                                                                                                                                                this.state.buildingNode.filter(
                                                                                                                                                                    itm =>
                                                                                                                                                                        itm !==
                                                                                                                                                                        child.key +
                                                                                                                                                                            item.label
                                                                                                                                                                ),
                                                                                                                                                            buildingNodeCollapse:
                                                                                                                                                                this.state.buildingNodeCollapse.filter(
                                                                                                                                                                    itm =>
                                                                                                                                                                        itm.key !==
                                                                                                                                                                        child.key +
                                                                                                                                                                            item.label
                                                                                                                                                                )
                                                                                                                                                        }
                                                                                                                                                    );
                                                                                                                                                } else {
                                                                                                                                                    this.props.sideMenuHandler(
                                                                                                                                                        this.findEntityNameForGGrandChild(
                                                                                                                                                            item.name
                                                                                                                                                        ),
                                                                                                                                                        child,
                                                                                                                                                        node.key,
                                                                                                                                                        nodeItem.key,
                                                                                                                                                        child.key
                                                                                                                                                    );
                                                                                                                                                    this.setState(
                                                                                                                                                        {
                                                                                                                                                            ...this
                                                                                                                                                                .state,
                                                                                                                                                            buildingNode:
                                                                                                                                                                [
                                                                                                                                                                    ...this
                                                                                                                                                                        .state
                                                                                                                                                                        .buildingNode,
                                                                                                                                                                    child.key +
                                                                                                                                                                        item.label
                                                                                                                                                                ],
                                                                                                                                                            buildingNodeCollapse:
                                                                                                                                                                [
                                                                                                                                                                    ...this
                                                                                                                                                                        .state
                                                                                                                                                                        .buildingNodeCollapse,
                                                                                                                                                                    {
                                                                                                                                                                        item: item.url,
                                                                                                                                                                        key:
                                                                                                                                                                            child.key +
                                                                                                                                                                            item.label
                                                                                                                                                                    }
                                                                                                                                                                ]
                                                                                                                                                        }
                                                                                                                                                    );
                                                                                                                                                }

                                                                                                                                                if (
                                                                                                                                                    flag2
                                                                                                                                                ) {
                                                                                                                                                    this.removeItem(
                                                                                                                                                        child.key,
                                                                                                                                                        item.key,
                                                                                                                                                        child.entity,
                                                                                                                                                        nodeItem.key
                                                                                                                                                    );
                                                                                                                                                } else {
                                                                                                                                                    await this.setActiveStyle(
                                                                                                                                                        child.key,
                                                                                                                                                        item.key,
                                                                                                                                                        child.entity,
                                                                                                                                                        nodeItem.key
                                                                                                                                                    );
                                                                                                                                                }
                                                                                                                                            }}
                                                                                                                                        />
                                                                                                                                    )
                                                                                                                                }
                                                                                                                            </span>
                                                                                                                            <span
                                                                                                                                className={
                                                                                                                                    child.url
                                                                                                                                        ? "title-tip title-tip-up sideMnu childName"
                                                                                                                                        : "title-tip title-tip-up sideMnu childName cursor-diabled"
                                                                                                                                }
                                                                                                                                onClick={
                                                                                                                                    child.url
                                                                                                                                        ? () => {
                                                                                                                                              this.setState(
                                                                                                                                                  {
                                                                                                                                                      activeSubNode3:
                                                                                                                                                          child.key
                                                                                                                                                  }
                                                                                                                                              );
                                                                                                                                              this.setState(
                                                                                                                                                  {
                                                                                                                                                      activeSubNode1:
                                                                                                                                                          ""
                                                                                                                                                  }
                                                                                                                                              );
                                                                                                                                              this.setState(
                                                                                                                                                  {
                                                                                                                                                      activeSubNode2:
                                                                                                                                                          "",
                                                                                                                                                      activeSubNode4:
                                                                                                                                                          "",
                                                                                                                                                      activeSubNode5:
                                                                                                                                                          ""
                                                                                                                                                  }
                                                                                                                                              );
                                                                                                                                              this.props.onClickItem(
                                                                                                                                                  child,
                                                                                                                                                  3
                                                                                                                                              );
                                                                                                                                              this.setActiveNode(
                                                                                                                                                  child.key,
                                                                                                                                                  item.key,
                                                                                                                                                  item
                                                                                                                                              );
                                                                                                                                          }
                                                                                                                                        : null
                                                                                                                                }
                                                                                                                                title={child.entity}
                                                                                                                                data-multiline={true}
                                                                                                                                data-place="top"
                                                                                                                                data-effect="solid"
                                                                                                                                data-background-color="#007bff"
                                                                                                                                delay-update="1000"
                                                                                                                            >
                                                                                                                                {/* {child && child.entity ? <ReactTooltip /> : null} */}
                                                                                                                                {child && child.label}
                                                                                                                            </span>
                                                                                                                        </div>
                                                                                                                    </>
                                                                                                                ) : (
                                                                                                                    ""
                                                                                                                )}
                                                                                                                {(child &&
                                                                                                                    child.nodes &&
                                                                                                                    child.nodes.length > 0 &&
                                                                                                                    child.nodes.map(building => {
                                                                                                                        return (
                                                                                                                            <>
                                                                                                                                {this.state.buildingNode.includes(
                                                                                                                                    child.key +
                                                                                                                                        item.label
                                                                                                                                ) ? (
                                                                                                                                    <>
                                                                                                                                        <div
                                                                                                                                            className={`${
                                                                                                                                                this
                                                                                                                                                    .state
                                                                                                                                                    .activeNode ==
                                                                                                                                                    building.key &&
                                                                                                                                                this
                                                                                                                                                    .state
                                                                                                                                                    .mainElement ===
                                                                                                                                                    item.key
                                                                                                                                                    ? "activeStyle1"
                                                                                                                                                    : ""
                                                                                                                                            }
                                                                                                                                         ${
                                                                                                                                             this
                                                                                                                                                 .state
                                                                                                                                                 .activeStyle[
                                                                                                                                                 this
                                                                                                                                                     .state
                                                                                                                                                     .activeStyle
                                                                                                                                                     .length -
                                                                                                                                                     1
                                                                                                                                             ] ==
                                                                                                                                                 child.key &&
                                                                                                                                             this
                                                                                                                                                 .state
                                                                                                                                                 .activeUrl ===
                                                                                                                                                 item.key
                                                                                                                                                 ? " childmain3 activeStyle"
                                                                                                                                                 : "childmain3"
                                                                                                                                         }`}
                                                                                                                                        >
                                                                                                                                            <span className="childspan1"></span>
                                                                                                                                            <span>
                                                                                                                                                {
                                                                                                                                                    // building &&
                                                                                                                                                    // (!building.nodes ||
                                                                                                                                                    //     !building
                                                                                                                                                    //         .nodes
                                                                                                                                                    //         .length) ?
                                                                                                                                                    !building.has_child ? (
                                                                                                                                                        <Icon
                                                                                                                                                            name="circle"
                                                                                                                                                            // color="grey"
                                                                                                                                                            color={
                                                                                                                                                                this
                                                                                                                                                                    .state
                                                                                                                                                                    .activeSubNode4 ==
                                                                                                                                                                building.key
                                                                                                                                                                    ? "blue"
                                                                                                                                                                    : "grey"
                                                                                                                                                            }
                                                                                                                                                            size="mini"
                                                                                                                                                        />
                                                                                                                                                    ) : (
                                                                                                                                                        <Icon
                                                                                                                                                            name={
                                                                                                                                                                this.state.flooorNode.includes(
                                                                                                                                                                    building.key +
                                                                                                                                                                        item.label
                                                                                                                                                                )
                                                                                                                                                                    ? "minus square"
                                                                                                                                                                    : "plus square"
                                                                                                                                                            }
                                                                                                                                                            color="grey"
                                                                                                                                                            onClick={async () => {
                                                                                                                                                                const flag3 =
                                                                                                                                                                    this.state.activeStyleTemp.some(
                                                                                                                                                                        i =>
                                                                                                                                                                            i.key ===
                                                                                                                                                                                building.key &&
                                                                                                                                                                            i.item.toLowerCase() ===
                                                                                                                                                                                item.key.toLowerCase()
                                                                                                                                                                    );
                                                                                                                                                                if (
                                                                                                                                                                    this.state.flooorNode.includes(
                                                                                                                                                                        building.key +
                                                                                                                                                                            item.label
                                                                                                                                                                    )
                                                                                                                                                                ) {
                                                                                                                                                                    this.setState(
                                                                                                                                                                        {
                                                                                                                                                                            ...this
                                                                                                                                                                                .state,
                                                                                                                                                                            flooorNode:
                                                                                                                                                                                this.state.flooorNode.filter(
                                                                                                                                                                                    itm =>
                                                                                                                                                                                        itm !==
                                                                                                                                                                                        building.key +
                                                                                                                                                                                            item.label
                                                                                                                                                                                ),
                                                                                                                                                                            floorNodeCollapse:
                                                                                                                                                                                this.state.floorNodeCollapse.filter(
                                                                                                                                                                                    itm =>
                                                                                                                                                                                        itm.key !==
                                                                                                                                                                                        building.key +
                                                                                                                                                                                            item.label
                                                                                                                                                                                )
                                                                                                                                                                        }
                                                                                                                                                                    );
                                                                                                                                                                } else {
                                                                                                                                                                    this.props.sideMenuHandler(
                                                                                                                                                                        this.findEntityNameForFloors(
                                                                                                                                                                            item.name
                                                                                                                                                                        ),
                                                                                                                                                                        building,
                                                                                                                                                                        node.key,
                                                                                                                                                                        nodeItem.key,
                                                                                                                                                                        child.key,
                                                                                                                                                                        building.key
                                                                                                                                                                    );
                                                                                                                                                                    this.setState(
                                                                                                                                                                        {
                                                                                                                                                                            ...this
                                                                                                                                                                                .state,
                                                                                                                                                                            flooorNode:
                                                                                                                                                                                [
                                                                                                                                                                                    ...this
                                                                                                                                                                                        .state
                                                                                                                                                                                        .flooorNode,
                                                                                                                                                                                    building.key +
                                                                                                                                                                                        item.label
                                                                                                                                                                                ],
                                                                                                                                                                            floorNodeCollapse:
                                                                                                                                                                                [
                                                                                                                                                                                    ...this
                                                                                                                                                                                        .state
                                                                                                                                                                                        .floorNodeCollapse,
                                                                                                                                                                                    {
                                                                                                                                                                                        item: item.url,
                                                                                                                                                                                        key:
                                                                                                                                                                                            building.key +
                                                                                                                                                                                            item.label
                                                                                                                                                                                    }
                                                                                                                                                                                ]
                                                                                                                                                                        }
                                                                                                                                                                    );
                                                                                                                                                                }

                                                                                                                                                                if (
                                                                                                                                                                    // flag3
                                                                                                                                                                    this.state.activeStyle.includes(
                                                                                                                                                                        building.key
                                                                                                                                                                    )
                                                                                                                                                                ) {
                                                                                                                                                                    this.removeItem(
                                                                                                                                                                        building.key,
                                                                                                                                                                        item.key,
                                                                                                                                                                        building.entity,
                                                                                                                                                                        child.key
                                                                                                                                                                    );
                                                                                                                                                                } else {
                                                                                                                                                                    await this.setActiveStyle(
                                                                                                                                                                        building.key,
                                                                                                                                                                        item.key,
                                                                                                                                                                        building.entity,
                                                                                                                                                                        child.key
                                                                                                                                                                    );
                                                                                                                                                                }
                                                                                                                                                            }}
                                                                                                                                                        />
                                                                                                                                                    )
                                                                                                                                                }
                                                                                                                                            </span>
                                                                                                                                            <span
                                                                                                                                                // key={
                                                                                                                                                //     building.key +
                                                                                                                                                //     item.label
                                                                                                                                                // }
                                                                                                                                                id={
                                                                                                                                                    building.key +
                                                                                                                                                    item.label
                                                                                                                                                }
                                                                                                                                                className="title-tip title-tip-up sideMnu childName"
                                                                                                                                                onClick={e => {
                                                                                                                                                    this.setState(
                                                                                                                                                        {
                                                                                                                                                            activeSubNode4:
                                                                                                                                                                building.key
                                                                                                                                                        }
                                                                                                                                                    );
                                                                                                                                                    this.setState(
                                                                                                                                                        {
                                                                                                                                                            activeSubNode1:
                                                                                                                                                                ""
                                                                                                                                                        }
                                                                                                                                                    );
                                                                                                                                                    this.setState(
                                                                                                                                                        {
                                                                                                                                                            activeSubNode3:
                                                                                                                                                                ""
                                                                                                                                                        }
                                                                                                                                                    );
                                                                                                                                                    this.setState(
                                                                                                                                                        {
                                                                                                                                                            activeSubNode2:
                                                                                                                                                                "",
                                                                                                                                                            activeSubNode5:
                                                                                                                                                                ""
                                                                                                                                                        }
                                                                                                                                                    );
                                                                                                                                                    this.props.onClickItem(
                                                                                                                                                        building,
                                                                                                                                                        4
                                                                                                                                                    );
                                                                                                                                                    this.setActiveNode(
                                                                                                                                                        building.key,
                                                                                                                                                        item.key,
                                                                                                                                                        item
                                                                                                                                                    );
                                                                                                                                                }}
                                                                                                                                                title={
                                                                                                                                                    building.entity
                                                                                                                                                }
                                                                                                                                                data-multiline={
                                                                                                                                                    true
                                                                                                                                                }
                                                                                                                                                data-place="top"
                                                                                                                                                data-effect="solid"
                                                                                                                                                data-background-color="#007bff"
                                                                                                                                                delay-update="1000"
                                                                                                                                            >
                                                                                                                                                {/* {building && building.entity ? <ReactTooltip /> : null} */}
                                                                                                                                                {building &&
                                                                                                                                                    building.label}
                                                                                                                                            </span>
                                                                                                                                        </div>
                                                                                                                                    </>
                                                                                                                                ) : (
                                                                                                                                    ""
                                                                                                                                )}
                                                                                                                                {(building &&
                                                                                                                                    building.nodes &&
                                                                                                                                    building.nodes
                                                                                                                                        .length > 0 &&
                                                                                                                                    building.nodes.map(
                                                                                                                                        floor => {
                                                                                                                                            return (
                                                                                                                                                <>
                                                                                                                                                    {this.state.flooorNode.includes(
                                                                                                                                                        building.key +
                                                                                                                                                            item.label
                                                                                                                                                    ) ? (
                                                                                                                                                        <>
                                                                                                                                                            <div
                                                                                                                                                                className={`${
                                                                                                                                                                    this
                                                                                                                                                                        .state
                                                                                                                                                                        .activeNode ==
                                                                                                                                                                        floor.key &&
                                                                                                                                                                    this
                                                                                                                                                                        .state
                                                                                                                                                                        .mainElement ===
                                                                                                                                                                        item.key
                                                                                                                                                                        ? "activeStyle1"
                                                                                                                                                                        : ""
                                                                                                                                                                }
                                                                                                                                                             ${
                                                                                                                                                                 this
                                                                                                                                                                     .state
                                                                                                                                                                     .activeStyle[
                                                                                                                                                                     this
                                                                                                                                                                         .state
                                                                                                                                                                         .activeStyle
                                                                                                                                                                         .length -
                                                                                                                                                                         1
                                                                                                                                                                 ] ==
                                                                                                                                                                     building.key &&
                                                                                                                                                                 this
                                                                                                                                                                     .state
                                                                                                                                                                     .activeUrl ===
                                                                                                                                                                     item.key
                                                                                                                                                                     ? " childmain4 activeStyle"
                                                                                                                                                                     : "childmain4"
                                                                                                                                                             }`}
                                                                                                                                                            >
                                                                                                                                                                <span className="childspan2"></span>
                                                                                                                                                                <span>
                                                                                                                                                                    {floor &&
                                                                                                                                                                    (!floor.nodes ||
                                                                                                                                                                        !floor
                                                                                                                                                                            .nodes
                                                                                                                                                                            .length) ? (
                                                                                                                                                                        <Icon
                                                                                                                                                                            name="circle"
                                                                                                                                                                            // color="grey"
                                                                                                                                                                            color={
                                                                                                                                                                                this
                                                                                                                                                                                    .state
                                                                                                                                                                                    .activeSubNode5 ==
                                                                                                                                                                                floor.key
                                                                                                                                                                                    ? "blue"
                                                                                                                                                                                    : "grey"
                                                                                                                                                                            }
                                                                                                                                                                            size="mini"
                                                                                                                                                                        />
                                                                                                                                                                    ) : (
                                                                                                                                                                        <Icon
                                                                                                                                                                            name={
                                                                                                                                                                                this.state.lastNode.includes(
                                                                                                                                                                                    floor.key
                                                                                                                                                                                )
                                                                                                                                                                                    ? "minus square"
                                                                                                                                                                                    : "plus square"
                                                                                                                                                                            }
                                                                                                                                                                            color="grey"
                                                                                                                                                                            onClick={() => {
                                                                                                                                                                                if (
                                                                                                                                                                                    this.state.lastNode.includes(
                                                                                                                                                                                        floor.key
                                                                                                                                                                                    )
                                                                                                                                                                                ) {
                                                                                                                                                                                    this.setState(
                                                                                                                                                                                        {
                                                                                                                                                                                            ...this
                                                                                                                                                                                                .state,
                                                                                                                                                                                            lastNode:
                                                                                                                                                                                                this.state.lastNode.filter(
                                                                                                                                                                                                    itm =>
                                                                                                                                                                                                        itm !==
                                                                                                                                                                                                        floor.key
                                                                                                                                                                                                )
                                                                                                                                                                                        }
                                                                                                                                                                                    );
                                                                                                                                                                                } else {
                                                                                                                                                                                    this.setState(
                                                                                                                                                                                        {
                                                                                                                                                                                            ...this
                                                                                                                                                                                                .state,
                                                                                                                                                                                            lastNode:
                                                                                                                                                                                                [
                                                                                                                                                                                                    ...this
                                                                                                                                                                                                        .state
                                                                                                                                                                                                        .lastNode,
                                                                                                                                                                                                    floor.key
                                                                                                                                                                                                ],
                                                                                                                                                                                            floorNodeCollapse:
                                                                                                                                                                                                [
                                                                                                                                                                                                    ...this
                                                                                                                                                                                                        .state
                                                                                                                                                                                                        .floorNodeCollapse,
                                                                                                                                                                                                    {
                                                                                                                                                                                                        item: item.url,
                                                                                                                                                                                                        key: floor.key
                                                                                                                                                                                                    }
                                                                                                                                                                                                ]
                                                                                                                                                                                        }
                                                                                                                                                                                    );
                                                                                                                                                                                }
                                                                                                                                                                            }}
                                                                                                                                                                        />
                                                                                                                                                                    )}
                                                                                                                                                                </span>
                                                                                                                                                                <span
                                                                                                                                                                    className="title-tip title-tip-up sideMnu childName"
                                                                                                                                                                    onClick={() => {
                                                                                                                                                                        this.setState(
                                                                                                                                                                            {
                                                                                                                                                                                activeSubNode5:
                                                                                                                                                                                    floor.key
                                                                                                                                                                            }
                                                                                                                                                                        );
                                                                                                                                                                        this.setState(
                                                                                                                                                                            {
                                                                                                                                                                                activeSubNode1:
                                                                                                                                                                                    ""
                                                                                                                                                                            }
                                                                                                                                                                        );
                                                                                                                                                                        this.setState(
                                                                                                                                                                            {
                                                                                                                                                                                activeSubNode3:
                                                                                                                                                                                    ""
                                                                                                                                                                            }
                                                                                                                                                                        );
                                                                                                                                                                        this.setState(
                                                                                                                                                                            {
                                                                                                                                                                                activeSubNode2:
                                                                                                                                                                                    "",
                                                                                                                                                                                activeSubNode4:
                                                                                                                                                                                    ""
                                                                                                                                                                            }
                                                                                                                                                                        );
                                                                                                                                                                        this.props.onClickItem(
                                                                                                                                                                            floor,
                                                                                                                                                                            5
                                                                                                                                                                        );
                                                                                                                                                                        this.setActiveNode(
                                                                                                                                                                            floor.key,
                                                                                                                                                                            item.key,
                                                                                                                                                                            item
                                                                                                                                                                        );
                                                                                                                                                                    }}
                                                                                                                                                                    title={
                                                                                                                                                                        floor.entity
                                                                                                                                                                    }
                                                                                                                                                                    data-multiline={
                                                                                                                                                                        true
                                                                                                                                                                    }
                                                                                                                                                                    data-place="top"
                                                                                                                                                                    data-effect="solid"
                                                                                                                                                                    data-background-color="#007bff"
                                                                                                                                                                    delay-update="1000"
                                                                                                                                                                >
                                                                                                                                                                    {/* {floor && floor.entity ? <ReactTooltip /> : null} */}
                                                                                                                                                                    {floor &&
                                                                                                                                                                        floor.label}
                                                                                                                                                                </span>
                                                                                                                                                            </div>
                                                                                                                                                        </>
                                                                                                                                                    ) : (
                                                                                                                                                        ""
                                                                                                                                                    )}
                                                                                                                                                </>
                                                                                                                                            );
                                                                                                                                        }
                                                                                                                                    )) ||
                                                                                                                                    (building &&
                                                                                                                                    building.nodes &&
                                                                                                                                    building.nodes
                                                                                                                                        .length ==
                                                                                                                                        0 &&
                                                                                                                                    this.state.flooorNode.includes(
                                                                                                                                        building.key +
                                                                                                                                            item.label
                                                                                                                                    ) ? (
                                                                                                                                        <div className="childmain4">
                                                                                                                                            <span className="childspan2"></span>
                                                                                                                                            <span className="title-tip title-tip-up sideMnu childName">
                                                                                                                                                No
                                                                                                                                                Data
                                                                                                                                            </span>
                                                                                                                                        </div>
                                                                                                                                    ) : null)}
                                                                                                                            </>
                                                                                                                        );
                                                                                                                    })) ||
                                                                                                                    (child &&
                                                                                                                    child.nodes &&
                                                                                                                    child.nodes.length == 0 &&
                                                                                                                    this.state.buildingNode.includes(
                                                                                                                        child.key + item.label
                                                                                                                    ) ? (
                                                                                                                        <div className="childmain3">
                                                                                                                            <span className="childspan1"></span>
                                                                                                                            <span className="title-tip title-tip-up sideMnu childName cursor-diabled">
                                                                                                                                No Data
                                                                                                                            </span>
                                                                                                                        </div>
                                                                                                                    ) : null)}
                                                                                                            </>
                                                                                                        );
                                                                                                    })) ||
                                                                                                    (nodeItem &&
                                                                                                    nodeItem.nodes &&
                                                                                                    nodeItem.nodes.length == 0 &&
                                                                                                    this.state.childNode.includes(
                                                                                                        nodeItem.key + item.label
                                                                                                    ) ? (
                                                                                                        <div className="childmain2">
                                                                                                            <span className="childspan"></span>
                                                                                                            <span className="title-tip title-tip-up sideMnu childName cursor-diabled">
                                                                                                                No Data
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    ) : null)}
                                                                                            </>
                                                                                        );
                                                                                    })) ||
                                                                                    (node &&
                                                                                    node.nodes &&
                                                                                    node.nodes.length == 0 &&
                                                                                    this.state.subNode.includes(node.key + item.label) ? (
                                                                                        <div className="childmain1">
                                                                                            <span className="child1"></span>
                                                                                            <span className="title-tip title-tip-up sideMnu childName cursor-diabled">
                                                                                                No Data
                                                                                            </span>
                                                                                        </div>
                                                                                    ) : null)}
                                                                            </>
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </React.Fragment>
                                                        )
                                                    );
                                                })}
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </React.Fragment>
                        ) : null;
                    })}
            </div>
        );
    }
}

export default withRouter(SideNav);
