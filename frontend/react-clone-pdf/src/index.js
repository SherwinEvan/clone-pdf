import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import axios from "axios";
import { ToastContainer } from 'react-toastify';
import './index.css';
import HomePage from './pages/pdf/home';
import SignUp from './pages/authentication/signup';
import Login from './pages/authentication/login';
import ForgotPassword from './pages/authentication/forgotPassword';
import MyAccount from './pages/authentication/myAccount';
import ReadPDF from './pages/pdf/readPDF';

axios.defaults.baseURL="http://localhost:8080/";
axios.defaults.withCredentials = true;

export default function RouteApp() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/account" element={<MyAccount />} />
        <Route path="/read" element={<ReadPDF />} />
      </Routes>
    </Router>
    <ToastContainer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouteApp />
);

