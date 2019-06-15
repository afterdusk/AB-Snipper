import React from "react";
import ReactDOM from "react-dom";
import AppBar from "./components/AppBar";
import TreeCanvas from "./components/TreeCanvas";
import "./App.css";

function App() {
  return (
    <div>
      <AppBar />
      <TreeCanvas />
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
export default App;
