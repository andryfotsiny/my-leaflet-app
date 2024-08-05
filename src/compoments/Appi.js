import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import osm from "./osm-providers";

const Appi = () => {
  const [center, setCenter] = useState({ lat: -21.4527, lng: 47.0855 });
  const mapRef = useRef();

  return (
    <>
      <div className="flex">
        <div className="w-4/5">
          <MapContainer center={center} zoom={13} style={{ height: "80vh" }} ref={mapRef}>
            <div className="absolute top-0 right-2 m-2 p-1 bg-white rounded shadow-md z-[1000]">
            </div>
            <TileLayer
              url={osm.maptiler.url}
              attribution={osm.maptiler.attribution}
            />
            <Marker position={center}>
              <Popup>
                <div>djzhadjezjdf</div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default Appi;
