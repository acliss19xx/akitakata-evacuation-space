import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import './Map.css';

export const Map = () => {
  const MAP_ICON = icon({
    iconUrl: 'images/leaflet/map_marker_icon.png',
    iconSize: [80, 80],
    iconAnchor: [12, 41],
    popupAnchor: [0, -30],
  });
  const [markerData, setMarkerData] = useState([]);
  const position = [34.666523, 132.703694];
  const zoom = 14;

  const url = 'https://akitakata.acliss.com/get_evacuation_space.php';
  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(responseData => {
        setMarkerData(
          responseData.map(line => {
            return {
              'name': line['name'],
              'address' : line['address'],
              'tel' : line['tel'],
              'lat' : line['latitude'],
              'long' : line['longitude'],
              'capacity' : line['capacity'],
            };
          })
        );
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <MapContainer center={position} zoom={zoom} scrollWheelZoom={false}>
      <TileLayer
        attribution='安芸高田市避難所マップ<br/>&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {
        markerData.map((data, index) => {
          return (
            <Marker key={index} position={[data['lat'], data['long']]} icon={MAP_ICON}>
              <Popup>
                <div>
                  <h3>{data['name']}</h3>
                  <p>{data['address']}</p>
                  <p>{data['tel']}</p>
                  <p>{data['capacity']}人</p>
                </div>
              </Popup>
            </Marker>
          );
        })
      }
    </MapContainer>
  )
};