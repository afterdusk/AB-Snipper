import React from "react";
import ReactDOM from "react-dom";
import AppBar from "./components/AppBar";
import NodeControlPanel from "./components/NodeControlPanel";
import "./App.css";

function App() {
  return (
    <div>
      <AppBar />
      <NodeControlPanel />
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
export default App;
