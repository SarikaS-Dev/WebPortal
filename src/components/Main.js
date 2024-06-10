import React from "react";
import "./main.css";
import SuppressionList from "./SuppressionList";

function Main() {
  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1 className="span-color">Suppression List</h1>
      </div>
      <SuppressionList />
    </main>
  );
}

export default Main;
