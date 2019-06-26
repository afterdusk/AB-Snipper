// Adapted from https://github.com/qiaolb/react-dragscroll/blob/master/src/DragScroll.jsx
import React from "react";

export default class DragScroll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.dataSource,
      isDragging: false
    };
  }

  render() {
    let style = null;
    if (this.props.height && this.props.width) {
      style = {
        style: {
          height: this.props.height,
          width: this.props.width,
          overflow: this.props.overflow
        }
      };
    }
    return (
      <div
        className={this.props.className}
        {...style}
        onMouseUp={this.mouseUpHandle.bind(this)}
        onMouseMove={this.mouseMoveHandle.bind(this)}
        ref="container"
      >
        {this.props.children && this.renderChildren(this.props.children)}
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener("mouseup", this.mouseUpHandle.bind(this));
    window.addEventListener("mousemove", this.mouseMoveHandle.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.mouseUpHandle.bind(this));
    window.removeEventListener("mousemove", this.mouseMoveHandle.bind(this));
  }

  mouseUpHandle(e) {
    if (this.state.isDragging) {
      this.setState({ isDragging: false });
      this.setState(this.state);
    }
  }

  mouseDownHandle(e) {
    if (!this.state.isDragging) {
      this.setState({ isDragging: true });
      this.lastClientX = e.clientX;
      this.lastClientY = e.clientY;
      e.preventDefault();
    }
  }

  mouseMoveHandle(e) {
    if (this.state.isDragging) {
      this.refs.container.scrollLeft -=
        -this.lastClientX + (this.lastClientX = e.clientX);
      this.refs.container.scrollTop -=
        -this.lastClientY + (this.lastClientY = e.clientY);
    }
  }

  renderChildren(dom, type) {
    if (this.isArray(dom)) {
      return dom.map((item, index) => {
        return React.cloneElement(item, {
          key: item.key || index,
          onMouseUp: this.mouseUpHandle.bind(this),
          onMouseDown: this.mouseDownHandle.bind(this)
        });
      });
    } else if ("object" == typeof dom) {
      return React.cloneElement(dom, {
        onMouseUp: this.mouseUpHandle.bind(this),
        onMouseDown: this.mouseDownHandle.bind(this)
      });
    }
  }

  isArray(object) {
    return (
      object &&
      typeof object === "object" &&
      typeof object.length === "number" &&
      typeof object.splice === "function" &&
      !object.propertyIsEnumerable("length")
    );
  }
}
