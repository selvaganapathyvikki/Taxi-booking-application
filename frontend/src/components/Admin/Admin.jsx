import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function Admin() {
  const navigate = useNavigate();
  const [showUsers, setShowUsers] = useState(false);
  const [showDrivers, setShowDrivers] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showRides, setShowRides] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentData, setCurrentData] = useState([]);

  //function to fetch all users from database
  const fetchUsers = () => {
    fetch("http://localhost:5000/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        request_type: "user_details",
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setCurrentData(data.user_details);
        setShowUsers(true);
        setShowDrivers(false);
        setShowRequests(false);
        setShowRides(false);
        setShowHistory(false);
      });
  };

  const fetchDrivers = () => {
    fetch("http://localhost:5000/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        request_type: "driver_details",
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setCurrentData(data.driver_details);
        setShowDrivers(true);
        setShowUsers(false);
        setShowRequests(false);
        setShowRides(false);
        setShowHistory(false);
      });
  };
  const fetchRequests = () => {
    fetch("http://localhost:5000/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        request_type: "request_details",
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setCurrentData(data.request_details);
        setShowUsers(false);
        setShowDrivers(false);
        setShowRequests(true);
        setShowRides(false);
        setShowHistory(false);
      });
  };

  const fetchRides = () => {
    fetch("http://localhost:5000/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        request_type: "rides_details",
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setCurrentData(data.rides_details);
        setShowUsers(false);
        setShowDrivers(false);
        setShowRequests(false);
        setShowRides(true);
        setShowHistory(false);
      });
  };

  const fetchHistory = () => {
    fetch("http://localhost:5000/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        request_type: "full_history",
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setCurrentData(data.full_history);
        setShowUsers(false);
        setShowDrivers(false);
        setShowRequests(false);
        setShowRides(false);
        setShowHistory(true);
      });
  };
  const goHome = () => {
    setCurrentData([]);
    setShowUsers(false);
    setShowDrivers(false);
    setShowRequests(false);
    setShowRides(false);
  };
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "blue" }}>
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
              Admin home
            </Typography>
            <Button onClick={fetchUsers} color="inherit">
              Users
            </Button>
            <Button onClick={fetchDrivers} color="inherit">
              Drivers
            </Button>
            <Button onClick={fetchRequests} color="inherit">
              Requests
            </Button>
            <Button onClick={fetchRides} color="inherit">
              Rides
            </Button>
            <Button onClick={fetchHistory} color="inherit">
              History
            </Button>
            <Button onClick={goHome} color="inherit">
              HOME
            </Button>
            <Button onClick={() => navigate("/admin/login")} color="inherit">
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      {showUsers ? (
        <div className="container-hs">
          {currentData.map((user, index) => {
            return (
              <div key={index}>
                <div className="container-div">
                  <h5>User {index + 1}</h5>
                  <div>User id : {user[0]}</div>
                  <div>FirstName : {user[1]}</div>
                  <div>LastName : {user[2]}</div>
                  <div>Phone Number : {user[3]}</div>
                  <div>Email : {user[4]}</div>
                  <br />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      {showDrivers ? (
        <div className="container-hs">
          {currentData.map((user, index) => {
            return (
              <div key={index}>
                <div className="container-div">
                  <h5>Driver {index + 1}</h5>
                  <div>Driver id : {user[0]}</div>
                  <div>FirstName : {user[1]}</div>
                  <div>LastName : {user[2]}</div>
                  <div>Phone Number : {user[3]}</div>
                  <div>Email : {user[4]}</div>
                  <br />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      {showRequests ? (
        <div className="container-hs">
          {currentData.map((user, index) => {
            return (
              <div key={index}>
                <div className="container-div">
                  <h5>Request {index + 1}</h5>
                  <div>User id : {user[0]}</div>
                  <div>FirstName : {user[1]}</div>
                  <div>Request type : {user[2]}</div>
                  <div>Status : {user[3]}</div>
                  <br />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      {showRides ? (
        <div className="container-hs">
          {currentData.map((data, index) => {
            return (
              <div key={index}>
                <div className="container-div">
                  <h5>Ride {index + 1}</h5>
                  <div>Ride id : {data[0]}</div>
                  <div>User id : {data[1]}</div>
                  <div>Driver id : {data[2]}</div>
                  <div>Status : {data[3]}</div>
                  <div>Date : {data[4]}</div>
                  <div>Time : {data[5]}</div>
                  <div>Fare : {data[6]}</div>
                  <br />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      {showHistory ? (
        <div className="container-hs">
          {currentData.map((data, index) => {
            return (
              <div key={index}>
                <div className="container-div mx-2">
                  <h5>Ride {currentData.length - index}</h5>
                  <div>Ride id : {data[2]}</div>
                  <div>User id : {data[0]}</div>
                  <div>Driver id : {data[1]}</div>
                  <div>Status : {data[3]}</div>
                  <div>Date : {data[5]}</div>
                  <div>Time : {data[6]}</div>
                  <div>Fare : {data[4]}</div>
                  <br />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
