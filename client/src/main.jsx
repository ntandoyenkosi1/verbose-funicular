import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./app";
import {Register} from "../pages/Register"; // Register page in pages folder
import { Login } from "../pages/Login";
/**
 *@TODO Import the Login page component and Portal Page component once implemented and add its route
 * */ 

const root = document.getElementById("root");
/**
 * @documentation https://reactrouter.com/start/declarative/routing#routing
 */
ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>,
);
