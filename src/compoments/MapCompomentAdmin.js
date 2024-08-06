import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, CircleMarker, FeatureGroup } from "react-leaflet";
import L from "leaflet";
import { EditControl } from "react-leaflet-draw";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import osm from "./osm-providers";
import { LocationMarkerIcon } from '@heroicons/react/outline';
import { SearchIcon } from '@heroicons/react/outline';
import "./ca.css"
import Navbar from "./Navbar";

const InputGroup = ({ name, label, type = "text", value, onChange, required = false, disabled = false }) => {
  return (
    <div className="relative z-0 w-full mb-5">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`peer block py-2.5 px-1 w-full text-sm text-gray-600 bg-transparent border-0 border-b-[2px] appearance-none focus:outline-none focus:ring-0 focus:border-[#FF6464] ${
          disabled ? "border-gray-300" : "border-gray-400"
        }`}
        placeholder=" "
        disabled={disabled}
        required={required}
      />
      <label
        htmlFor={name}
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#FF6464] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
      >
        {label}
      </label>
    </div>
  );
};

const markerIcon = new L.Icon({
  iconUrl: require("../resources/images/marker.png"),
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -46],
});

const initialPositionIcon = new L.Icon({
  iconUrl: require("../resources/images/iconb.jpg"), // chemin vers votre icône de position initiale
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -46],
});

const destinationIcon = new L.Icon({
  iconUrl: require("../resources/images/iconb.jpg"), // chemin vers votre icône de destination
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -46],
});

const MapComponentAdmin = () => {
  const _created = (e) => console.log(e);
  const [center, setCenter] = useState({ lat: -21.4527, lng: 47.0855 });
  const [crimes, setCrimes] = useState([]);
  const [position, setPosition] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [crimeData, setCrimeData] = useState({
    fokontany: '',
    commune: '',
    region: '',
    country: '',
    description: '',
    date_crime: '',
    heure_crime: '',
    type_crime: '',
    gravité_crime: '',
    lat: '',
    log: ''
  });
  const mapRef = useRef();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/crimes')
      .then(response => {
        setCrimes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the crime data!', error);
      });

    getUserLocation();
    getCurrentPosition();
  }, []);

  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.error(err);
        }
      );
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          if (mapRef.current) {
            mapRef.current.flyTo([position.coords.latitude, position.coords.longitude], 13);
          }
        },
        (error) => {
          console.error('Erreur lors de l\'obtention de l\'emplacement', error);
        }
      );
    } else {
      console.error('Erreur lors de l\'obtention de l\'emplacement');
    }
  };

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/crimes/${id}`)
      .then(() => {
        setCrimes(crimes.filter(crime => crime.id !== id));
      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la suppression des données sur la criminalité!', error);
      });
  };

  const getClassByGravity = (gravity) => {
    switch (gravity.toLowerCase()) {
      case 'crime':
        return 'pulse-crime';
      case 'grave':
        return 'pulse-grave';
      case 'modéré':
        return 'pulse-modere';
      case 'mineur':
        return 'pulse-mineur';
      default:
        return '';
    }
  };

  const handleLocationButtonClick = () => {
    getUserLocation();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCrimeData({ ...crimeData, [name]: value });
  };

  const updateLocationData = async (lat, lng) => {
    setCrimeData({ ...crimeData, lat, log: lng });

    if (navigator.onLine) {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const address = response.data.address;
        setCrimeData({
          ...crimeData,
          fokontany: address.suburb || "",
          commune: address.city || address.town || "",
          region: address.state || "",
          country: address.country || "",
          lat,
          log: lng
        });
      } catch (error) {
        alert("Erreur lors de la récupération des données de localisation.");
      }
    } else {
      alert("Pas de connexion Internet. Impossible de récupérer les données de localisation.");
    }
  };

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (navigator.onLine) {
          updateLocationData(lat, lng);
        } else {
          alert("Pas de connexion Internet. Impossible de marquer l'emplacement.");
        }
      }
    });
    return null;
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    const destinationInput = event.target.elements.destination.value;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${destinationInput}`);
    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      setDestination([parseFloat(lat), parseFloat(lon)]);
      await drawRoute([parseFloat(lat), parseFloat(lon)]);
    }
    setLoading(false);
  };

  const drawRoute = async (dest) => {
    if (position && dest) {
      const fetchRoute = async (from, to) => {
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`);
        const data = await response.json();
        return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      };

      const isRiskyRoute = (routeCoords) => {
        return routeCoords.some(coord => {
          return crimes.some(crime => {
            const crimeLatLng = L.latLng(crime.lat, crime.log);
            const routeLatLng = L.latLng(coord[0], coord[1]);
            return crimeLatLng.distanceTo(routeLatLng) < 100; // Adjust the distance threshold as needed
          });
        });
      };

      let routeCoords = await fetchRoute(position, dest);
      let passedRiskyFokontany = isRiskyRoute(routeCoords);

      if (passedRiskyFokontany) {
        if (window.confirm("Votre itinéraire passe par une zone à risque. Voulez-vous modifier l'itinéraire le plus possible pour aller au destination?")) {
          let attempts = 0;
          const maxAttempts = 10; // Maximum number of attempts to find a safe route
          const adjustLatLng = (latlng, factor) => [latlng[0] + (Math.random() - 0.5) * factor, latlng[1] + (Math.random() - 0.5) * factor];

          do {
            dest = adjustLatLng(dest, 0.01); // Adjust destination coordinates slightly
            routeCoords = await fetchRoute(position, dest);
            passedRiskyFokontany = isRiskyRoute(routeCoords);
            attempts++;
          } while (passedRiskyFokontany && attempts < maxAttempts);

          if (attempts === maxAttempts) {
            alert("Nous n'avons pas pu trouver un itinéraire sûr vers la destination.");
          }
        }
      }

      setRoute(routeCoords);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post("http://127.0.0.1:8000/api/crimes", crimeData)
      .then((response) => {
        alert("Crime ajouté avec succès");
        setCrimes([...crimes, response.data]);
        setCrimeData({
          fokontany: '',
          commune: '',
          region: '',
          country: '',
          description: '',
          date_crime: '',
          heure_crime: '',
          type_crime: '',
          gravité_crime: '',
          lat: '',
          log: ''
        });
      })
      .catch((error) => {
        alert("Une erreur s'est produite lors de l'ajout du crime");
        console.error(error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="main">
        <div className="row">
          <div className="col-sm-6 map-section">
            <MapContainer center={center} zoom={13} ref={mapRef} className="map-container">
              <TileLayer url={osm.maptiler.url} attribution={osm.maptiler.attribution} />
              {position && (
                <CircleMarker center={position} pathOptions={{ color: 'blue' }} radius={10}>
                  <Popup>Vous êtes ici</Popup>
                </CircleMarker>
              )}
              {destination && (
                <Marker position={destination} icon={destinationIcon}>
                  <Popup>Destination</Popup>
                </Marker>
              )}
              {route && (
                <Polyline positions={route} color="green" />
              )}
              {crimes.map((crime, index) => (
                <Marker
                  key={index}
                  position={[crime.lat, crime.log]}
                  icon={markerIcon}
                >
                  <Popup>
                    <div>
                      <h3>{crime.type_crime}</h3>
                      <p>{crime.description}</p>
                      <button
                        onClick={() => handleDelete(crime.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Supprimer
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <MapEvents />
              <FeatureGroup>
                <EditControl position="topright" onCreated={_created} draw={{
                  rectangle: false,
                  circle: false,
                  circlemarker: false,
                  marker: false,
                  polyline: false
                }} />
              </FeatureGroup>
            </MapContainer>
            <button onClick={handleLocationButtonClick} className="absolute top-10 right-10 z-50 p-2 bg-white shadow-md rounded-full focus:outline-none">
              <LocationMarkerIcon className="h-6 w-6 text-blue-500" />
            </button>
          </div>
          <div className="col-sm-6 form-section">
            <form onSubmit={handleSubmit}>
              <InputGroup name="fokontany" label="Fokontany" value={crimeData.fokontany} onChange={handleChange} required />
              <InputGroup name="commune" label="Commune" value={crimeData.commune} onChange={handleChange} required />
              <InputGroup name="region" label="Region" value={crimeData.region} onChange={handleChange} required />
              <InputGroup name="country" label="Country" value={crimeData.country} onChange={handleChange} required />
              <InputGroup name="description" label="Description" value={crimeData.description} onChange={handleChange} required />
              <InputGroup name="date_crime" label="Date de Crime" type="date" value={crimeData.date_crime} onChange={handleChange} required />
              <InputGroup name="heure_crime" label="Heure de Crime" type="time" value={crimeData.heure_crime} onChange={handleChange} required />
              <InputGroup name="type_crime" label="Type de Crime" value={crimeData.type_crime} onChange={handleChange} required />
              <InputGroup name="gravité_crime" label="Gravité de Crime" value={crimeData.gravité_crime} onChange={handleChange} required />
              <InputGroup name="lat" label="Latitude" value={crimeData.lat} onChange={handleChange} required disabled />
              <InputGroup name="log" label="Longitude" value={crimeData.log} onChange={handleChange} required disabled />
              <button type="submit" className="w-full bg-[#FF6464] text-white p-2 mt-2 rounded">Ajouter Crime</button>
            </form>
            <form onSubmit={handleSearch} className="mt-10">
              <div className="flex items-center">
                <input
                  type="text"
                  name="destination"
                  id="destination"
                  placeholder="Rechercher destination"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className="ml-2 p-2 bg-blue-500 text-white rounded"
                  disabled={loading}
                >
                  {loading ? "Recherche..." : <SearchIcon className="h-5 w-5" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapComponentAdmin;
