import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Navbar from "./Navbar";
const ListCrim = () => {
  const [crimes, setCrimes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Add state for search term

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/crimes')
      .then(response => {
        setCrimes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the crime data!', error);
      });
  }, []);

  // Filter crimes based on search term
  const filteredCrimes = crimes.filter(crime => {
    const searchTextLower = searchTerm.toLowerCase();
    return (
      crime.fokontany.toLowerCase().includes(searchTextLower) ||
      crime.commune.toLowerCase().includes(searchTextLower) ||
      crime.region.toLowerCase().includes(searchTextLower) ||
      crime.country.toLowerCase().includes(searchTextLower) ||
      crime.date_crime.toLowerCase().includes(searchTextLower) ||
      crime.heure_crime.toLowerCase().includes(searchTextLower) ||
      crime.type_crime.toLowerCase().includes(searchTextLower) ||
      crime.gravité_crime.toLowerCase().includes(searchTextLower)
    );
  });

  return (
      <>
      <Navbar/>
    <div className="crime-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search crimes"
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fokontany</th>
            <th>Commune</th>
            <th>Region</th>
            <th>Country</th>
            <th>Date</th>
            <th>Time</th>
            <th>Type</th>
            <th>Gravity</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {filteredCrimes.map(crime => (
            <tr key={crime.id_crime}>
              <td>{crime.id_crime}</td>
              <td>{crime.fokontany}</td>
              <td>{crime.commune}</td>
              <td>{crime.region}</td>
              <td>{crime.country}</td>
              <td>{crime.date_crime}</td>
              <td>{crime.heure_crime}</td>
              <td>{crime.type_crime}</td>
              <td>{crime.gravité_crime}</td>
              <td>{crime.lat}</td>
              <td>{crime.log}</td>
            </tr>
          ))}
        </tbody>
      </table>


    </div>
        </>
  );
};

export default ListCrim;
