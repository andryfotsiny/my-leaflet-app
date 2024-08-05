// Search.js
import React, { useState } from 'react';
import axios from 'axios';
import { SearchIcon } from '@heroicons/react/outline';

const Search = ({ setCenter, mapRef }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setCenter({ lat: parseFloat(lat), lng: parseFloat(lon) });
        if (mapRef.current) {
          mapRef.current.flyTo([lat, lon], 10);
        }
      }
    } catch (error) {
      console.error('Error searching location', error);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ position: 'absolute', right: '10px', zIndex: 1000 }}>
      <div className="flex items-center">
        <input
          type="text"
          name="query"
          placeholder="Search location..."
          className="p-3 rounded border border-gray-700"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div style={{ position: 'relative', top: '10px' }}>
          <button type="submit" className="p-2 rounded" style={{ paddingBottom: '20px' }}>
            <SearchIcon className="h-10 w-10 text-gray-700 hover:text-gray-900" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default Search;
