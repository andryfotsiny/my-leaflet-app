// src/App.js

import React from 'react';
import MapComponent from './compoments/MapComponent';
import LineChartExample from './compoments/LineChartExample';
import Navbar from "./compoments/Navbar";
import ListCrim from "./compoments/ListCrim";



import 'tailwindcss/tailwind.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapComponentAdmin from "./compoments/MapCompomentAdmin";
import Login from "./compoments/Login";
import Blog from "./compoments/Blog";

const App = () => {
  return (


   /* <Router>
          <Routes>

       <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />

        </Routes>
     </Router>*/

  <Router>


      <Routes>
           <Route path="/" element={<Login />} />
           <Route path="/admin" element={<MapComponentAdmin />} />
        <Route path="/map" element={<MapComponent />} />
        <Route path="/donne" element={<ListCrim />} />

        <Route path="/Statistique" element={<LineChartExample />} />

      </Routes>
    </Router>
  );
};


export default App;
