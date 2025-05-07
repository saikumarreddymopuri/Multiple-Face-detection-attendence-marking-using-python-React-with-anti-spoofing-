import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import FaceRegister from "./pages/FaceRegister";
import FaceDetect from "./pages/FaceDetect";
import AttendanceLog from "./pages/AttendanceLog";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

<ToastContainer position="top-center" autoClose={3000} />


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<FaceRegister />} />
        <Route path="/detect" element={<FaceDetect />} />
        <Route path="/attendance" element={<AttendanceLog />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={850}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}

export default App;
