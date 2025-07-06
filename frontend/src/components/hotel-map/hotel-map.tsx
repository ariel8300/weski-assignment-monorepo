import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './hotel-map.scss';

// Type assertion to fix TypeScript issues with react-leaflet v4
declare module 'react-leaflet' {
  interface MapContainerProps {
    center: [number, number];
    zoom: number;
    style?: React.CSSProperties;
    zoomControl?: boolean;
    scrollWheelZoom?: boolean;
  }
  
  interface TileLayerProps {
    url: string;
    attribution?: string;
  }
}

interface HotelMapProps {
  latitude: string;
  longitude: string;
  hotelName: string;
}

const HotelMap: React.FC<HotelMapProps> = ({ latitude, longitude, hotelName }) => {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  // Check if coordinates are valid
  if (isNaN(lat) || isNaN(lng)) {
    return (
      <div className="map-error">
        <p>Location coordinates are not available</p>
      </div>
    );
  }

  return (
    <div className="hotel-map-container">
      <MapContainer
        center={[lat, lng] as [number, number]}
        zoom={15}
        style={{ height: '300px', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[lat, lng] as [number, number]}>
          <Popup>
            <strong>{hotelName}</strong>
            <br />
            {lat.toFixed(6)}, {lng.toFixed(6)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default HotelMap; 