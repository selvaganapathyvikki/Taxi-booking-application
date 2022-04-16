import React, { useState } from "react";
import { useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";

export default function DriverLogin({ setToken }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [jwtToken, setjwtToken] = useState("");
  const [message, setMessage] = useState();
  const [isLogin, setIsLogin] = useState(false);
  const [redirect, setRedirect] = useState(null);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginDriver(credentials)
      .then((data) => {
        setToken(data.token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const navigateHome = () => {
    navigate("/driver/home");
  };

  const loginDriver = (credentials) => {
    return fetch("http://localhost:5000/driver/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);

        if (data.message === "Password is incorrect") {
          setjwtToken("");
          setIsLogin(false);
          setMessage("Invalid login");
        } else {
          if (data.access_token === undefined) {
            setjwtToken(data.access_token);
            setIsLogin(false);
            setMessage("Invalid login");
          } else {
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("driver_name", data.user_name);
            localStorage.setItem("driver_id", data.user_id);
            localStorage.setItem("driver_location", data.location);
            setjwtToken(data.access_token);
            setIsLogin(true);
            setMessage("Your logged in with Authentication token ");
            setRedirect("/home");
            navigateHome();
          }
        }
      });
  };
  return (
    <div className="form d-flex p-5 justify-content-center align-items-center">
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <div className="col-xs-2">
          <input
            type="text"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          className="form-control"
        />
        <br />
        <button type="submit" className="btn-primary rounded">
          Login
        </button>
      </form>
    </div>
  );
}
