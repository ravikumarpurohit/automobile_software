import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import Router from "./router";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <Router />
  </HashRouter>
);
