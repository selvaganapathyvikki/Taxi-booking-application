import "./App.css";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function App() {
  const navigate = useNavigate();

  const navigateUserLogin = () => {
    navigate("/user/login");
  };
  const navigateUserSignup = () => {
    navigate("/user/register");
  };
  const navigateDriverLogin = () => {
    navigate("/driver/login");
  };
  const navigateDriverSignup = () => {
    navigate("/driver/register");
  };

  return (
    <div className="bg">
      <h3 className="txt">Welcome to taxi booking application</h3>
      <br />
      <h5 className="txt">Users</h5>
      <br />
      <div>
        <div className="btn">
          <button className="btn-primary m-2" onClick={navigateUserLogin}>
            User Login
          </button>
          <button className="btn-primary m-2" onClick={navigateUserSignup}>
            User Signup
          </button>
        </div>
      </div>
      <h5 className="txt">Drivers</h5>
      <button className="btn-primary m-2" onClick={navigateDriverLogin}>
        Driver Login
      </button>
      <button className="btn-primary m-2" onClick={navigateDriverSignup}>
        Driver Signup
      </button>
    </div>
  );
}

export default App;
