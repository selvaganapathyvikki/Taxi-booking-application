import React, { useEffect, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";
// import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function MapComponent(props) {
  const [from_location, setFromLocation] = useState([]);
  const [to_location, setToLocation] = useState([]);

  useEffect(() => {
    setFromLocation(props.location1);
    setToLocation(props.location2);
    console.log(from_location);
    console.log(to_location);
  }, [from_location, to_location]);

  return (
    <div>
      <Map
        initialViewState={{
          longitude: 80.0597,
          latitude: 12.8439,
          zoom: 11,
        }}
        style={{ width: "100vw", height: "60vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken="your mapbox access token"
      >
        <Marker longitude={from_location[1]} latitude={from_location[0]}>
          <LocationOnIcon style={{ color: "red" }} />
        </Marker>
        <Marker longitude={to_location[1]} latitude={to_location[0]}>
          <LocationOnIcon style={{ color: "blue" }} />
        </Marker>
        <NavigationControl />
      </Map>
    </div>
  );
}
