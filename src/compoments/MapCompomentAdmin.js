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
          dest = adjustLatLng(dest, 0.01); // Adjust the destination slightly
          routeCoords = await fetchRoute(position, dest);
          passedRiskyFokontany = isRiskyRoute(routeCoords);
          attempts++;
        } while (passedRiskyFokontany && attempts < maxAttempts);

        if (passedRiskyFokontany) {
          alert("Impossible de trouver un itinéraire sécurisé après plusieurs tentatives.");
        } else {
          setRoute(routeCoords);
        }
      } else {
        setRoute(routeCoords);
      }
    } else {
      setRoute(routeCoords);
    }
  }
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/crimes', crimeData);
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
      alert('Crime ajouté avec succès!');

      axios.get('http://127.0.0.1:8000/api/crimes')
        .then(response => {
          setCrimes(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the crime data!', error);
        });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du crime:', error);
      alert('Une erreur est survenue lors de l\'ajout du crime.');
    }
  };

  useEffect(() => {
    if (position) {
      setLoading(false);
    }
  }, [position]);

  return (
    <>
      <Navbar/>
      <div className="flex">
        <div className="w-1/5 p-4">
          <h2 className="text-2xl font-semibold mb-4">Ajouter un Crime</h2>
          <form onSubmit={handleSubmit}>
            <InputGroup name="fokontany" label="Fokontany" value={crimeData.fokontany} onChange={handleChange} required />
            <InputGroup name="commune" label="Commune" value={crimeData.commune} onChange={handleChange} required />
            <InputGroup name="region" label="Region" value={crimeData.region} onChange={handleChange} required />
            <InputGroup name="country" label="Country" value={crimeData.country} onChange={handleChange} required />
            <InputGroup name="lat" label="Latitude" type="number" value={crimeData.lat} onChange={handleChange} required />
            <InputGroup name="log" label="Longitude" type="number" value={crimeData.log} onChange={handleChange} required />
            <InputGroup name="date_crime" label="Date du Crime" type="date" value={crimeData.date_crime} onChange={handleChange} required />
            <InputGroup name="heure_crime" label="Heure du Crime" type="time" value={crimeData.heure_crime} onChange={handleChange} required />
            <InputGroup name="type_crime" label="Type de Crime" value={crimeData.type_crime} onChange={handleChange} required />
            <InputGroup name="description" label="Description" value={crimeData.description} onChange={handleChange} required />
            <div className="relative z-0 w-full mb-5">
              <select
                name="gravité_crime"
                value={crimeData.gravité_crime}
                onChange={handleChange}
                className="peer block py-2.5 px-1 w-full text-sm text-gray-600 bg-transparent border-0 border-b-[2px] appearance-none focus:outline-none focus:ring-0 focus:border-[#FF6464] border-gray-400"
                required
              >
                <option value="" disabled hidden></option>
                <option value="crime">Crime</option>
                <option value="grave">Grave</option>
                <option value="modéré">Modéré</option>
                <option value="mineur">Mineur</option>
              </select>
              <label
                htmlFor="gravité_crime"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#FF6464] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
              >
                Gravité du Crime
              </label>
            </div>

            <button type="submit" className="mt-2 w-full  text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 border border-gray-400"><b>Ajouter</b></button>
          </form>
        </div>
        <div className="w-4/5">
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          )}

          <MapContainer center={center} zoom={13} style={{ height: "80vh" }} ref={mapRef}>
          <div className="absolute top-0 right-2 m-2 p-1 bg-white rounded shadow-md z-[1000]">
  <form onSubmit={handleSearch}>
    <input
      type="text"
      id="destination"
      name="destination"
      placeholder="Rechercher une destination"
      className="p-3 border border-gray-300 rounded"
    />
   <button
  type="submit"
  className="ml-2 p-2  text-white rounded border border-gray-400 hover:bg-gray-200 "
  style={{ position: 'relative', top: 8 }}
>
  <SearchIcon className="h-6 w-6 text-gray-700 hover:bg-gray-200" />
</button>
  </form>
</div>


            <FeatureGroup>
              <EditControl
                position="topleft"
                onCreated={_created}
                draw={{
                  /* rectangle: false,
                  circle: false,
                  circlemarker: false,
                  marker: false,
                  polyline: false, */}}
                onCreated={(e) => {
                  const { lat, lng } = e.layer.getLatLng();
                  if (navigator.onLine) {
                    updateLocationData(lat, lng);
                  } else {
                    alert("Pas de connexion Internet. Impossible de marquer l'emplacement.");
                  }
                }}
              />
            </FeatureGroup>
            <MapEvents />
            <TileLayer
              url={osm.maptiler.url}
             // attribution={osm.maptiler.attribution}
            />

           <div className="absolute top-20 right-0 m-4 z-[1000]">
              <button onClick={handleLocationButtonClick} className="p-2 bg-white text-gray-800 rounded-full shadow-md hover:bg-gray-200">
                <LocationMarkerIcon className="h-6 w-6" />
              </button>
           </div>
            {crimes.map((crime, idx) => (
              <Marker position={[crime.lat, crime.log]} icon={markerIcon} key={idx}>
                <CircleMarker
                  center={[crime.lat, crime.log]}
                  radius={10}
                  className={`circle-marker ${getClassByGravity(crime.gravité_crime)}`}
                />
                <Popup>
                  <div>
                    <h3>{crime.type_crime}</h3>
                    <p>{crime.description}</p>
                    <p>{crime.date_crime} {crime.heure_crime}</p>
                    <p>{crime.fokontany}, {crime.commune}, {crime.region}, {crime.country}</p>
                    <button onClick={() => handleDelete(crime.id)} className="mt-2 w-full bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-700">Supprimer</button>
                  </div>
                </Popup>
              </Marker>
            ))}
           {position && <Marker position={position} icon={initialPositionIcon} />}
            {destination && <Marker position={destination} icon={destinationIcon} />}
            {route && (
              <Polyline positions={route} color="blue" />
            )}

           <div className="absolute bottom-0 right-0 m-2 p-2 bg-white rounded shadow-md z-[1000]">
              <h2 className="text-lg  text-center font-semibold mb-2">Légende</h2>
                   <h4 className=" font-semibold mb-1">pulsation de gravité de la crime</h4>
                <div className="flex items-center mb-2">
                  <div className={`w-4 h-4 bg-gray-700 rounded-full mr-2 ${getClassByGravity('crime')}`}></div>
                  <span className="text-sm">Crime</span>
                </div>
                <div className="flex items-center mb-2">
                  <div className={`w-4 h-4 bg-gray-700 rounded-full mr-2 ${getClassByGravity('grave')}`}></div>
                  <span className="text-sm">Grave</span>
                </div>
                <div className="flex items-center mb-2">
                  <div className={`w-4 h-4 bg-gray-700 rounded-full mr-2 ${getClassByGravity('modéré')}`}></div>
                  <span className="text-sm">Modéré</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-4 h-4 bg-gray-700 rounded-full mr-2 ${getClassByGravity('mineur')}`}></div>
                  <span className="text-sm">Mineur</span>
                </div>
              <h4 className=" font-semibold mb-1">le couleur determine la date de crime</h4>
           </div>



          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default MapComponentAdmin;
