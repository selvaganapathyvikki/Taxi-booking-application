import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import Details from "../Details";
import Map from "../Map/Map";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function DriverHome() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Find ride");
  const [currentStatus, setCurrentStatus] = useState("Find ride");
  const [rideStatus, setRideStatus] = useState(false);
  const [customer_location, setCustomerLocation] = useState([]);
  const [customer_destination, setCustomerDestination] = useState([]);
  const [customer_id, setCustomerId] = useState("");
  const [ride_id, setRideId] = useState("");
  const [ride_details, setRideDetails] = useState("No details found");
  const [availableRides, setAvailableRides] = useState(0);
  const [fareAmount, setFareAmount] = useState(0.0);
  const [rideOTP, setRideOTP] = useState("");
  const [otpStatus, setOTPStatus] = useState(false);
  const [paymentStage, setPaymentStage] = useState(false);
  const [ridetoCustomer, setRideToCustomer] = useState(false);
  const [myLocation, setMyLocation] = useState([]);
  const [beforeRide, setBeforeRide] = useState(false);

  let token = localStorage.getItem("token");
  let name = localStorage.getItem("driver_name");
  let driver_id = localStorage.getItem("driver_id");
  let driver_location = localStorage.getItem("driver_location");
  // checking the ride status if the ride has started

  useEffect(() => {
    if (rideStatus) {
      let interval = setInterval(() => {
        fetch("http://localhost:5000/rides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_name: name,
            request_type: "checkstatus",
            driver_id: driver_id,
            driver_location: driver_location,
            customer_id: customer_id,
            customer_location: customer_location,
            customer_destination: customer_destination,
            ride_id: ride_id,
          }),
        })
          .then((resp) => resp.json())
          .then((data) => {
            if (data.message === "Accepted a ride") {
              clearInterval(interval);
              setStatus("busy");
              setCurrentStatus("busy");
            } else if (data.message === "Ride started") {
              clearInterval(interval);
              setStatus("Finding..");
              setFareAmount(data.fare);
            } else if (data.message === "Riding to customer") {
              console.log("riding to customer");
              setStatus("riding to customer location");
              setRideDetails(`Customer ID : ${customer_id} `);
              setFareAmount(data.fare);
              setBeforeRide(true);
              console.log(ride_details);
            } else if (data.message === "Reached customer location") {
              console.log("reached customer location");
              setStatus("Reached customer location");
              setOTPStatus(true);
              setRideStatus(false);
              clearInterval(interval);
            } else if (data.message === "Riding to destination") {
              console.log("riding to destination");
              setBeforeRide(false);
              setStatus("riding to destination");
            } else if (data.message === "Completed") {
              console.log("Ride completed");
              setStatus("Completed ride");
            } else if (data.message === "Payment pending") {
              console.log("Payment pending");
              setStatus("Payment pending");
              // setRideStatus(false);
              // clearInterval(interval);
              // setPaymentStage(true);
            } else if (data.message === "Accept new ride") {
              console.log("Ready for next ride");
              setStatus("Find ride");
              setRideDetails("No details found");
              setRideStatus(false);
              setCurrentStatus("Find ride");
            }
          });
      }, 10000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [rideStatus]);

  // To update available rides to the driver

  useEffect(() => {
    let interval = setInterval(() => {
      fetch("http://localhost:5000/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          driver_id: driver_id,
          request_type: "checkrides",
        }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          setAvailableRides(data.available_rides);
        });
    }, 4000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (token === null) {
      navigate("/driver/login");
    }
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("driver_name");
    localStorage.removeItem("driver_id");
    localStorage.removeItem("driver_location");
    navigate("/driver/login");
  };

  // Accepting the ride available

  const acceptRide = () => {
    return fetch("http://localhost:5000/driver", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_name: name,
        request_type: "accept",
        driver_id: driver_id,
        driver_location: driver_location,
        ride_id: ride_id,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.message === "Accepted a ride") {
          console.log("accepted");
          setStatus("busy");
          setCurrentStatus("busy");
          setRideId(data.ride_id);
          setCustomerId(data.customer_id + "");
          setCustomerLocation(data.customer_location);
          setCustomerDestination(data.customer_destination);
          setRideStatus(true);
        } else if (data.message === "No rides available") {
          console.log("No rides available");
          setStatus("No rides available");
          setCurrentStatus("Find ride");
        }
      });
  };
  const enterOTP = () => {
    return fetch("http://localhost:5000/rides", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_name: name,
        request_type: "checkotp",
        driver_id: driver_id,
        driver_location: driver_location,
        customer_id: customer_id,
        customer_location: customer_location,
        customer_destination: customer_destination,
        ride_id: ride_id,
        otp: rideOTP,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.message === "OTP verified") {
          console.log("OTP verified");
          setStatus("Verified OTP");
          setRideStatus(true);
          setOTPStatus(false);
        } else if (data.message === "OTP not verified") {
          console.log("OTP not verified");
          setStatus("OTP is wrong");
          setRideStatus(false);
          setOTPStatus(true);
        }
      });
  };
  const navigateToHistory = () => {
    navigate("/driver/history");
  };

  const cancelRide = () => {};
  return (
    <div>
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
              Driver Home
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
        <div className="container-box container-div-driver">
          <h6>Welcome Mr. {name}</h6>
          <h6>Driver id : {driver_id}</h6>
        </div>
        <br />
        {rideStatus ? null : <h6>Available rides : {availableRides}</h6>}
        <div className="container-box container-div-driver px-5">
          <h6>Status : {status}</h6>
          {rideStatus ? (
            <button className="btn-info rounded">Riding</button>
          ) : (
            <button onClick={acceptRide} className="btn-info rounded">
              {currentStatus}
            </button>
          )}
        </div>
        <br />
        <br />
        {otpStatus ? (
          <div className="container-box container-div-driver">
            <h6>Enter OTP to start the ride</h6>
            <input
              type="number"
              className="bg-grey m-2 rounded"
              placeholder="Enter OTP"
              onChange={(e) => setRideOTP(e.target.value)}
            />
            <button onClick={enterOTP} className="btn-info rounded-3">
              Start ride
            </button>
          </div>
        ) : null}
        {rideStatus ? (
          <div>
            <Details
              data={ride_details}
              location1={customer_location}
              location2={customer_destination}
              user={"driver"}
            />
          </div>
        ) : null}
        {rideStatus ? <p>Fare Amount : {fareAmount}</p> : null}
        <br />
      </div>
      {rideStatus && !beforeRide ? (
        <Map location1={customer_location} location2={customer_destination} />
      ) : null}
      {rideStatus && beforeRide ? (
        <Map location1={customer_location} location2={customer_location} />
      ) : null}
    </div>
  );
}
