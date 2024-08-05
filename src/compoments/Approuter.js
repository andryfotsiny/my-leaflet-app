// src/App.js

import React from 'react';


import { GoogleOAuthProvider } from '@react-oauth/google';


import 'tailwindcss/tailwind.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Home";
import Login from "./Login";
import Admin from "./Admin";
import MapComponentAdmin from "./MapCompomentAdmin";
import MapComponent from "./MapComponent";
import ListCrim from "./ListCrim";
import LineChartExample from "./LineChartExample";
import Navbar from "./Navbar";
const Approuter = () => {
  return (







  <Router>
 <Login/>
      <Navbar/>
      <Routes>
           <Route path="/admin" element={<MapComponentAdmin />} />
        <Route path="/map" element={<MapComponent />} />
        <Route path="/donne" element={<ListCrim />} />

        <Route path="/Statistique" element={<LineChartExample />} />

      </Routes>
    </Router>
  );
};


export default App;
