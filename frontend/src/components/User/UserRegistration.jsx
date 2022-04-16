import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function UserRegistration({ setToken }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
  });
  const [message, setMessage] = useState();
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(credentials)
      .then((data) => {
        setToken(data.token);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const navigateToLogin = () => {
    navigate("/user/login");
  };
  const registerUser = (credentials) => {
    return fetch("http://localhost:5000/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.message === "User Already Exist") {
          setMessage("User Already Exist");
          navigateToLogin();
        } else {
          if (data.message === "User created sucessfully.Please log in") {
            setMessage("User Created Successfully.Please log in");
            navigateToLogin();
          } else {
            setMessage("Invalid login");
          }
        }
      });
  };
  return (
    <div className="d-flex p-5 justify-content-center align-items-center">
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          className="form-control"
        />
        <br />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          className="form-control"
        />
        <br />
        <label>Firstname :</label>
        <input
          type="text"
          name="firstname"
          value={credentials.firstname}
          onChange={handleChange}
          className="form-control"
        />
        <br />
        <label>Lastname:</label>
        <input
          type="text"
          name="lastname"
          value={credentials.lastname}
          onChange={handleChange}
          className="form-control"
        />
        <br />
        <label>Phone number:</label>
        <input
          type="number"
          name="phone"
          value={credentials.phone}
          onChange={handleChange}
          className="form-control"
        />
        <br />
        <button type="submit" className="btn-primary rounded">
          Signup
        </button>
      </form>
    </div>
  );
}
