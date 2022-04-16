import React, { useState, useEffect, useRef } from "react";
import Map, { Marker, NavigationControl, Source, Layer } from "react-map-gl";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";
import { Box, Divider, List, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MapRoute() {
  const navigate = useNavigate();
  let user_id = localStorage.getItem("user_id");
  let token = localStorage.getItem("token");

  const [currentUserCoords, setCurrentUserCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [isBooked, setIsBooked] = useState(false);

  const mapRef = useRef();

  const [viewState, setViewState] = useState({
    longitude: 80.209,
    latitude: 13.0827,
    zoom: 13,
    pitch: 0,
    bearing: 0,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((res) => {
      setCurrentUserCoords({
        longitude: res.coords.longitude,
        latitude: res.coords.latitude,
      });

      setViewState({
        ...viewState,
        longitude: res.coords.longitude,
        latitude: res.coords.latitude,
      });
    });
  }, []);

  const dragEndEvent = (event) => {
    setDestinationCoords({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    });
  };
  const navigateToHome = () => {
    navigate("/user/home");
  };
  const placeMarker = (event) => {
    setDestinationCoords({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    });
  };
  const bookRide = () => {
    return fetch("http://localhost:5000/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        request_type: "book",
        user_id: user_id,
        destination_location: [
          destinationCoords.latitude,
          destinationCoords.longitude,
        ],
        pickup_location: [
          currentUserCoords.latitude,
          currentUserCoords.longitude,
        ],
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("isbooked", true);
        setIsBooked(true);
        navigateToHome();
      });
  };

  return (
    <div>
      <Map
        ref={mapRef}
        mapboxAccessToken="your mapbox access token"
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        onClick={placeMarker}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <button
          onClick={bookRide}
          className="btn-primary rounded position-relative p-2"
        >
          Book ride
        </button>
        {destinationCoords ? (
          <Marker
            longitude={destinationCoords?.longitude}
            latitude={destinationCoords?.latitude}
            anchor="bottom"
            onDragEnd={dragEndEvent}
            draggable={true}
          >
            <LocationOnIcon sx={{ color: "blue" }} />
          </Marker>
        ) : null}
        {currentUserCoords ? (
          <Marker
            longitude={currentUserCoords?.longitude}
            latitude={currentUserCoords?.latitude}
            anchor="bottom"
            onDragEnd={dragEndEvent}
            // draggable={true}
          >
            <PersonPinCircleIcon sx={{ color: "red" }} />
          </Marker>
        ) : null}

        <NavigationControl />
      </Map>
    </div>
  );
}
