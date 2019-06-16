import React from "react";
import { Group } from "@vx/group";
import { Tree } from "@vx/hierarchy";
import { hierarchy } from "d3-hierarchy";
import { pointRadial } from "d3-shape";
import {
  LinkHorizontal,
  LinkVertical,
  LinkHorizontalStep,
  LinkVerticalStep,
  LinkHorizontalCurve,
  LinkVerticalCurve,
  LinkHorizontalLine,
  LinkVerticalLine
} from "@vx/shape";
import NodeControlPanel from "./NodeControlPanel";
import * as Constants from "../Constants";

/* state vs props: 
    - props are read-only, passed from parent
    - state is private, can only be set by component
  variable vs state:
    - state, when modified, will call render
    - variable thus should be used for data that would not affect the DOM */

// TODO: Remove logic allowing for different configs, no need for config to be dynamic
// TODO: Set hard limits on tree height and max nodes (per node and for entire tree), ensure restrictions propagated to user
export default class extends React.Component {
  initData = {
    id: 0,
    value: null,
    children: [
      {
        id: 1,
        value: null,
        children: [
          {
            id: 2,
            value: null,
            children: [
              { id: 3, value: 2, children: [] },
              { id: 4, value: 6, children: [] }
            ]
          },
          {
            id: 5,
            value: 1,
            children: []
          },
          {
            id: 6,
            value: null,
            children: [
              {
                id: 7,
                value: 4,
                children: []
              },
              {
                id: 8,
                value: 3,
                children: []
              }
            ]
          }
        ]
      },
      {
        id: 9,
        value: null,
        children: [
          {
            id: 10,
            value: null,
            children: [
              { id: 11, value: 5, children: [] },
              { id: 12, value: 7, children: [] }
            ]
          },
          {
            id: 13,
            value: 2,
            children: []
          }
        ]
      }
    ]
  };

  initIDs = new Set([...Array(14).keys()]);
  initCount = 14;

  state = {
    orientation: "vertical", // vertical || horizontal
    linkType: "line", // diagonal || step || curve || line
    stepPercent: 0.5, // only applicable to step linkType
    data: this.initData,
    selectedNodeID: this.initData.id,
    nodeIDs: this.initIDs,
    nodeCount: this.initCount
  };

  // callback function for NodeControlPanel to modify child count
  updateChildNodes = event => {
    // TODO: Is it ok to modify JSON object directly?
    var nodeData = this.getNodeData(this.state.data, this.state.selectedNodeID);
    var childNodeCount = nodeData.children.length;
    var targetCount = parseInt(event.target.value, 10);
    if (targetCount < childNodeCount) {
      this.removeChildNodes(childNodeCount, targetCount, nodeData);
    } else {
      this.addChildNodes(childNodeCount, targetCount, nodeData);
    }
    this.forceUpdate();
  };

  /*-------------------- Helper Functions -------------------- */
  // traverses tree JSON to get data of node specified by 'id'
  getNodeData(data, id) {
    var result = null;
    if (data instanceof Array) {
      for (var i = 0; i < data.length; i++) {
        result = this.getNodeData(data[i], id);
        if (result) break;
      }
    } else if (data instanceof Object) {
      // console.log("data.id: " + data.id + ", id: " + id);
      if (data.id === id) return data;
      else return this.getNodeData(data.children, id);
    }
    return result;
  }

  // removes child nodes from a node to a specified new count
  removeChildNodes(childNodeCount, targetCount, nodeData) {
    for (var i = childNodeCount - 1; i >= targetCount; i--) {
      var removedNode = nodeData.children.pop();
      var newNodeIDs = new Set(this.state.nodeIDs);
      newNodeIDs.delete(removedNode.id);
      this.setState({ nodeIDs: newNodeIDs });
    }
    // leaf nodes should have values
    if (targetCount === 0) {
      nodeData.value = 0;
    }
  }

  // adds child nodes to a node up until a specified new count
  addChildNodes(childNodeCount, targetCount, nodeData) {
    for (var i = childNodeCount; i < targetCount; i++) {
      var newID = 0;
      // TODO: Refine to ensure no infinite loop
      while (this.state.nodeIDs.has(newID)) {
        newID = Math.floor(
          Math.random() * Math.floor(Constants.TREE_NODE_ID_LIMIT)
        );
      }
      var newNode = {
        id: newID,
        value: 0,
        children: []
      };
      nodeData.children.push(newNode);
    }
    // non-leaf nodes should not have values
    if (targetCount > 0) {
      nodeData.value = null;
    }
  }

  render() {
    const {
      canvasWidth = 800,
      canvasHeight = 800,
      margin = {
        top: 30,
        left: 30,
        right: 30,
        bottom: 30
      }
    } = this.props;
    const nodeControlPanelStyle = {
      float: "right",
      margin: "25px"
    };
    const innerWidth = canvasWidth - margin.left - margin.right;
    const innerHeight = canvasHeight - margin.top - margin.bottom;
    let origin = { x: 0, y: 0 };

    // for ease of reference
    const { orientation, layout, linkType } = this.state;

    /* High Level DOM structure
    TODO: Consider abstracting tree to a separate component, 
    letting this component act as a controller
    -> svg
      -> Group
        -> Tree
          -> Group
            -> Edges 
            -> Nodes
              -> Group
    -> NodeControlPanel
    */
    return (
      <div>
        {/* Canvas */}
        <svg width={canvasWidth} height={canvasHeight}>
          {/* SVG custom elements */}
          <defs>
            <pattern
              id="smallGrid"
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 12 0 L 0 0 0 12"
                fill="none"
                stroke={Constants.TREE_NODE_LINE_COLOR}
                strokeOpacity="0.75"
                strokeWidth="0.5"
              />
            </pattern>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <rect width="60" height="60" fill="url(#smallGrid)" />
              {/* <path
                d="M 80 0 L 0 0 0 80"
                fill="none"
                stroke="gray"
                stroke-width="0.5"
              /> */}
            </pattern>
          </defs>
          <defs>
            <filter id="shadow">
              <feDropShadow dx="1" dy="1" stdDeviation="2" />
            </filter>
          </defs>

          {/* Background */}
          <rect width={canvasWidth} height={canvasHeight} fill="url(#grid)" />

          {/* Group containing Tree */}
          <Group top={margin.top} left={margin.left}>
            <Tree
              root={hierarchy(this.state.data, d =>
                d.isCollapsed ? null : d.children
              )}
              size={[innerWidth, innerHeight]}
              /* if a and b have same parent, separation is half compared to
                 if a and b are from separate parents
                 as a's depth increases, separation between a and b is smaller */
              separation={(a, b) => (a.parent === b.parent ? 1 : 2) / a.depth}
            >
              {rootNode => (
                <Group top={origin.y} left={origin.x}>
                  {/* render edges */}
                  {rootNode.links().map((link, linkKey) => {
                    let LinkComponent;

                    if (orientation === "vertical") {
                      if (linkType === "step") {
                        LinkComponent = LinkVerticalStep;
                      } else if (linkType === "curve") {
                        LinkComponent = LinkVerticalCurve;
                      } else if (linkType === "line") {
                        LinkComponent = LinkVerticalLine;
                      } else {
                        LinkComponent = LinkVertical;
                      }
                    } else {
                      if (linkType === "step") {
                        LinkComponent = LinkHorizontalStep;
                      } else if (linkType === "curve") {
                        LinkComponent = LinkHorizontalCurve;
                      } else if (linkType === "line") {
                        LinkComponent = LinkHorizontalLine;
                      } else {
                        LinkComponent = LinkHorizontal;
                      }
                    }

                    return (
                      <LinkComponent
                        data={link}
                        stroke={Constants.TREE_NODE_LINE_COLOR}
                        strokeWidth="1"
                        fill="none"
                        key={linkKey}
                        onClick={data => event => {
                          // console.log(data);
                        }}
                      />
                    );
                  })}

                  {/* render nodes */}
                  {rootNode.descendants().map((node, nodeKey) => {
                    const radius = Constants.TREE_NODE_DIAMETER;

                    let top;
                    let left;
                    if (layout === "polar") {
                      const [radialX, radialY] = pointRadial(node.x, node.y);
                      top = radialY;
                      left = radialX;
                    } else {
                      if (orientation === "vertical") {
                        top = node.y;
                        left = node.x;
                      } else {
                        top = node.x;
                        left = node.y;
                      }
                    }

                    return (
                      <Group top={top} left={left} key={nodeKey}>
                        {
                          <circle
                            r={radius}
                            style={
                              node.data.id === this.state.selectedNodeID
                                ? { filter: "url(#shadow)" }
                                : {}
                            }
                            fill={
                              node.data.id === this.state.selectedNodeID
                                ? Constants.TREE_NODE_SELECTED_FILL_COLOR
                                : Constants.TREE_NODE_FILL_COLOR
                            }
                            stroke={
                              node.data.id === this.state.selectedNodeID
                                ? Constants.TREE_NODE_SELECTED_LINE_COLOR
                                : Constants.TREE_NODE_LINE_COLOR
                            }
                            strokeWidth={1}
                            // strokeDasharray={!node.data.children ? "2,2" : "0"}
                            // strokeOpacity={!node.data.children ? 0.6 : 1}
                            onClick={() => {
                              this.setState({ selectedNodeID: node.data.id });
                              // node.data.isCollapsed = !node.data.isCollapsed;
                              // console.log(node);
                              this.forceUpdate();
                            }}
                          />
                        }
                        <text
                          dy={".33em"}
                          fontSize={Constants.TREE_NODE_VALUE_FONT_SIZE}
                          fontWeight={Constants.TREE_NODE_VALUE_FONT_WEIGHT}
                          fontFamily="Roboto"
                          textAnchor={"middle"}
                          style={{ pointerEvents: "none" }}
                          fill={Constants.FONT_PRIMARY_COLOR}
                        >
                          {node.data.value}
                        </text>
                      </Group>
                    );
                  })}
                </Group>
              )}
            </Tree>
          </Group>
        </svg>

        {/* Node Control Panel */}
        <div style={nodeControlPanelStyle}>
          <NodeControlPanel
            nodeData={this.getNodeData(
              this.state.data,
              this.state.selectedNodeID
            )}
            updateNodeChildren={this.updateChildNodes}
          />
        </div>
      </div>
    );
  }
}
