import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "./index.css";
import theme from "./service/theme";
import { ThemeProvider } from '@mui/material/styles';
import HomePage from "./pages/home";
import SignUp from "./pages/authentication/signup";
import Login from "./pages/authentication/login";
import ForgotPassword from "./pages/authentication/forgotPassword";
import MyAccount from "./pages/authentication/myAccount";
import ReadPDF from "./pages/pdf/readPDF";
import CompressPDF from "./pages/pdf/compressPDF";
import MergePDFs from "./pages/pdf/mergePDF";
import ProtectPDF from "./pages/pdf/protectPDF";
import CreatePDF from "./pages/pdf/createPDF";

axios.defaults.baseURL = "http://localhost:8080/";
axios.defaults.withCredentials = true;

export default function RouteApp() {

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/read" element={<ReadPDF />} />
          <Route path="/compress" element={<CompressPDF />} />
          <Route path="/merge" element={<MergePDFs />} />
          <Route path="/create" element={<CreatePDF />} />
          <Route path="/protect" element={<ProtectPDF />} />
        </Routes>
      </Router>
      <ToastContainer />
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouteApp />);
