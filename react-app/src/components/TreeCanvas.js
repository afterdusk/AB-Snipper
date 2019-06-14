import React from "react";
import { Group } from "@vx/group";
import { Tree } from "@vx/hierarchy";
import { LinearGradient } from "@vx/gradient";
import { hierarchy } from "d3-hierarchy";
import { pointRadial } from "d3-shape";

import {
  LinkHorizontal,
  LinkVertical,
  LinkRadial,
  LinkHorizontalStep,
  LinkVerticalStep,
  LinkRadialStep,
  LinkHorizontalCurve,
  LinkVerticalCurve,
  LinkRadialCurve,
  LinkHorizontalLine,
  LinkVerticalLine,
  LinkRadialLine
} from "@vx/shape";

const data = {
  name: "T",
  children: [
    {
      name: "A",
      children: [
        { name: "A1" },
        { name: "A2" },
        { name: "A3" },
        {
          name: "C",
          children: [
            {
              name: "C1"
            },
            {
              name: "D",
              children: [
                {
                  name: "D1"
                },
                {
                  name: "D2"
                },
                {
                  name: "D3",
                  children: [
                    {
                      name: "D1"
                    },
                    {
                      name: "D2"
                    }
                  ]
                },
                {
                  name: "D4",
                  children: [
                    {
                      name: "D1"
                    },
                    {
                      name: "D2"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    { name: "Z" },
    {
      name: "B",
      children: [{ name: "B1" }, { name: "B2" }, { name: "B3" }]
    }
  ]
};

export default class extends React.Component {
  state = {
    layout: "cartesian",
    orientation: "vertical",
    linkType: "diagonal"
  };

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

    const {
      layout = "vertical", // horizontal
      orientation = "cartesian", // polar
      linkType = "diagonal" // step || curve || line
    } = this.state;

    const innerWidth = canvasWidth - margin.left - margin.right;
    const innerHeight = canvasHeight - margin.top - margin.bottom;

    let origin;
    let sizeWidth;
    let sizeHeight;

    origin = { x: 0, y: 0 };
    sizeWidth = innerWidth;
    sizeHeight = innerHeight;

    return (
      <div>
        <svg width={canvasWidth} height={canvasHeight}>
          <LinearGradient id="lg" from="#03c0dc" to="#03c0dc" />
          <rect
            width={canvasWidth}
            height={canvasHeight}
            rx={14}
            fill="#ffffff"
          />
          <Group top={margin.top} left={margin.left}>
            <Tree
              root={hierarchy(data, d => (d.isExpanded ? null : d.children))}
              size={[sizeWidth, sizeHeight]}
              separation={(a, b) => (a.parent === b.parent ? 1 : 0.5) / a.depth}
            >
              {data => (
                <Group top={origin.y} left={origin.x}>
                  {data.links().map((link, i) => {
                    let LinkComponent;

                    if (layout === "polar") {
                      if (linkType === "step") {
                        LinkComponent = LinkRadialStep;
                      } else if (linkType === "curve") {
                        LinkComponent = LinkRadialCurve;
                      } else if (linkType === "line") {
                        LinkComponent = LinkRadialLine;
                      } else {
                        LinkComponent = LinkRadial;
                      }
                    } else {
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
                    }

                    return (
                      <LinkComponent
                        data={link}
                        stroke="#374469"
                        strokeWidth="1"
                        fill="none"
                        key={i}
                        onClick={data => event => {
                          console.log(data);
                        }}
                      />
                    );
                  })}

                  {data.descendants().map((node, key) => {
                    const width = 25;
                    const height = 25;

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
                      <Group top={top} left={left} key={key}>
                        {node.depth === 0 && (
                          <circle
                            r={12}
                            fill="url('#lg')"
                            onClick={() => {
                              node.data.isExpanded = !node.data.isExpanded;
                              console.log(node);
                              this.forceUpdate();
                            }}
                          />
                        )}
                        {node.depth !== 0 && (
                          <rect
                            height={height}
                            width={width}
                            y={-height / 2}
                            x={-width / 2}
                            fill={"#272b4d"}
                            stroke={node.data.children ? "#03c0dc" : "#26deb0"}
                            strokeWidth={1}
                            strokeDasharray={!node.data.children ? "2,2" : "0"}
                            strokeOpacity={!node.data.children ? 0.6 : 1}
                            rx={!node.data.children ? 14 : 14}
                            // onClick={() => {
                            //   node.data.isExpanded = !node.data.isExpanded;
                            //   console.log(node);
                            //   this.forceUpdate();
                            // }}
                          />
                        )}
                        <text
                          dy={".33em"}
                          fontSize={9}
                          fontFamily="Arial"
                          textAnchor={"middle"}
                          style={{ pointerEvents: "none" }}
                          fill={
                            node.depth === 0
                              ? "#71248e"
                              : node.children
                              ? "white"
                              : "#26deb0"
                          }
                        >
                          {node.data.name}
                        </text>
                      </Group>
                    );
                  })}
                </Group>
              )}
            </Tree>
          </Group>
        </svg>
      </div>
    );
  }
}
