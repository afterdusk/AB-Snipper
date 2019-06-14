import React from "react";
import ReactDOM from "react-dom";
import AppBar from "./components/AppBar";
import NodeControlPanel from "./components/NodeControlPanel";
import TreeCanvas from "./components/TreeCanvas";
import "./App.css";

function App() {
  return (
    <div>
      <AppBar />
      <NodeControlPanel />
      <TreeCanvas />
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
export default App;
