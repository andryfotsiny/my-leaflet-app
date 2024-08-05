import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import logo from '../resources/images/marker.png'; // Assurez-vous de spécifier le chemin correct vers votre logo

const Navbar = () => {
  return (
    <nav className="bg-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className=" h-7 w-7"   /> {/* Affichage du logo */}
          <div className="text-black text-xl text-blue-900  "><b className="text-red-600 font-bold ">web</b> Mapping</div>
        </div>
        <ul className="flex space-x-4">
          <li><Link to="/admin" className="text-gray-600 font-bold hover:text-gray-800">Admin</Link></li>
          <li><Link to="/map" className="text-gray-600 font-bold hover:text-gray-800">Map</Link></li>
          <li><Link to="/donne" className="text-gray-600 font-bold hover:text-gray-800">Donnée</Link></li>
          <li><Link to="/Statistique" className="text-gray-600 font-bold hover:text-gray-800">Statistique</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
