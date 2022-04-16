import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Details from "../Details";
import Map from "../Map/Map";
import MapRoute from "../Map/MapRoute";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
// import Header from "./Header";

export default function UserHome() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Book ride");
  const [rideStatus, setRideStatus] = useState(false);
  const [ride_id, setRideId] = useState("");
  const [ride_details, setRideDetails] = useState("No details found");
  const [currentStatus, setCurrentStatus] = useState("Book ride");
  const [driver_location, setDriverLocation] = useState([]);
  const [customer_location, setCustomerLocation] = useState([]);
  const [customer_destination, setCustomerDestination] = useState([]);
  const [fareAmount, setFareAmount] = useState(0.0);
  const [isBooked, setIsBooked] = useState(false);
  const [rideOTP, setRideOTP] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [destinationCoordinates, setDestinationCoordinates] = useState([]);

  let token = localStorage.getItem("token");
  let name = localStorage.getItem("user_name");
  let user_id = localStorage.getItem("user_id");
  let isbooked = localStorage.getItem("isbooked");

  useEffect(() => {
    if (isbooked) {
      fetch(`http://localhost:5000/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          request_type: "ride_details",
          user_id: user_id,
        }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          setCustomerLocation(data.customer_location);
          setCustomerDestination(data.destination_location);
          setIsBooked(true);
          setCurrentStatus("Riding");
          setStatus("Booked a ride");
        });
    }
  }, [isbooked]);

  useEffect(() => {
    if (token === null || token === undefined || user_id == null) {
      navigate("/user/login");
    }
  }, []);

  // checking the ride status if the ride has started

  useEffect(() => {
    let interval = setInterval(() => {
      fetch("http://localhost:5000/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_name: name,
          request_type: "isridestarted",
          ride_id: ride_id,
          user_id: user_id,
        }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          if (data.message === "Accepted a ride") {
            clearInterval(interval);
            setStatus("busy");
            setCurrentStatus("Riding");
            setRideStatus(true);
          } else if (data.message === "Ride started") {
            setStatus("Accepted your ride");
            setCurrentStatus("Riding");
            setRideStatus(true);
            setFareAmount(data.fare);
          } else if (data.message === "Riding to customer") {
            console.log("riding to customer");
            console.log(data.driver_location);
            setRideDetails(
              `Driver ID : ${data.driver_id} Driver phone : ${data.driver_phone}`
            );
            setDriverLocation(data.driver_location);
            setStatus("Driver has coming to pick up you");
            setCurrentStatus("Riding");
            setFareAmount(data.fare);
            setRideStatus(true);
            setRideOTP(data.otp);
          } else if (data.message === "Reached customer location") {
            console.log("Reached customer location");
            setStatus(
              "Your driver has reached your location - please share the OTP with the driver in order to start the ride"
            );
            setCurrentStatus("Riding");
            setRideStatus(true);
            setFareAmount(data.fare);
            setRideOTP(data.otp);
          } else if (data.message === "Riding to destination") {
            console.log("riding to destination");
            setRideDetails(
              `Driver ID : ${data.driver_id} Driver phone : ${data.driver_phone}`
            );
            setStatus("Started riding to destination");
          } else if (data.message === "Payment pending") {
            console.log("Payment pending");
            setStatus("Payment pending");
            setRideStatus(false);
            setPaymentStatus(true);
          } else if (data.message === "Payment done") {
            console.log("Payment done");
            setStatus("Payment done");
            setPaymentStatus(false);
          } else if (data.message === "Ride completed") {
            console.log("Ride completed");
            // setRideDetails(`Driver id ${data.driver_id} Driver phone ${data.driver_phone}`);
            setStatus("Completed ride");
          } else if (data.message === "Wait for ride to start") {
            console.log("Wait for ride to start");
            setStatus("Wait for a driver to accept");
          } else if (data.message === "Book a new ride") {
            console.log("Book a new ride");
            setRideDetails("No details found");
            setStatus("Book a new ride");
            setCurrentStatus("Book ride");
            setIsBooked(false);
            setRideStatus(false);
            setPaymentStatus(false);
          }
        });
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [rideStatus]);

  // payment status
  const payAmount = () => {
    fetch("http://localhost:5000/rides", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_name: name,
        request_type: "payamount",
        ride_id: ride_id,
        user_id: user_id,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Payment done") {
          setStatus("Payment done");
          setPaymentStatus(false);
          setRideStatus(false);
          setStatus("Book new ride");
          setCurrentStatus("Book ride");
          setIsBooked(false);
        }
      });
  };

  // Logout the user
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_id");
    localStorage.removeItem("isbooked");
    navigate("/user/login");
  };
  const navigateToHistory = () => {
    navigate("/user/history");
  };

  return (
    <div>
      {/* Nav bar */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              Metacabs
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              User Home
            </Typography>
            <Button onClick={navigateToHistory} color="inherit">
              History
            </Button>
            <Button onClick={logoutUser} color="inherit">
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <div className="bg">
        <br />
        <div className="container-box container-div">
          <h6>Welcome Mr.{name}</h6>
          <h6>User id {user_id}</h6>
        </div>
        <br />

        {/* Displaying button based on ride status */}
        <div className="container-box container-div">
          <h6>Status :{status}</h6>
          {isBooked ? (
            <button className="btn-info rounded">Busy</button>
          ) : (
            <button
              onClick={() => navigate("/book/map")}
              className="btn-info rounded"
            >
              {currentStatus}
            </button>
          )}
        </div>
        <br />
        <br />

        {/* Displaying ride details if ride started */}
        {rideStatus ? (
          <Details
            data={ride_details}
            location1={customer_location}
            location2={customer_destination}
            user={"customer"}
          />
        ) : null}

        {/* Displaying fare amount and OTP for the current ride */}
        {rideStatus ? (
          <div className="container-box container-div">
            <p>Fare Amount : {fareAmount}</p>
            <p>OTP : {rideOTP}</p>
          </div>
        ) : null}

        {/* Payment box if the ride completed */}
        {paymentStatus ? (
          <div className="container-box container-div container-pay">
            <h6>Pay Rs.{fareAmount}</h6>
            <br />
            <select class="form-select" aria-label="Default select example">
              <option selected>Payment Options</option>
              <option value="1">Cash</option>
              <option value="2">Online payment</option>
              <option value="3">Wallet cash</option>
            </select>
            <br />
            <button onClick={payAmount} className="btn-info rounded">
              Pay
            </button>
          </div>
        ) : null}

        <br />
        <br />
      </div>

      {/* Displaying map for the current ride */}
      {rideStatus ? (
        <Map location1={customer_location} location2={customer_destination} />
      ) : null}
    </div>
  );
}
