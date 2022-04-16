import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function DriverHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  let token = localStorage.getItem("token");
  let driver_id = localStorage.getItem("driver_id");

  useEffect(() => {
    if (token === null || token === undefined || driver_id == null) {
      navigate("/driver/login");
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        driver_id: driver_id,
        request_type: "driver_history",
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setHistory(data.history);
      });
  }, []);

  // useEffect(() => {
  //   if(history.length === 0){

  console.log(history);
  return (
    <div className="history">
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
              Driver History
            </Typography>
            <Button onClick={() => navigate("/driver/home")} color="inherit">
              HOME
            </Button>
            <Button onClick={() => navigate("/driver/login")} color="inherit">
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <br />
      <div className="container-hs-driver">
        {history.reverse().map((ride, index) => {
          return (
            <div key={index}>
              <div className="container-div-driver">
                <h5>Ride {history.length - index}</h5>
                <div>Customer id : {ride[0]}</div>
                <div>Ride fare : {ride[1]}</div>
                <div>Ride status : {ride[2]}</div>
                <div>Ride date : {ride[3]}</div>
                <div>Ride time : {ride[4]}</div>
                <br />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
