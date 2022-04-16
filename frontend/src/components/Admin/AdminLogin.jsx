import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function UserLogin({ setToken }) {
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
    loginUser(credentials)
      .then((data) => {
        setToken(data.token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const navigateHome = () => {
    navigate("/admin/home");
  };

  const loginUser = (credentials) => {
    return fetch("http://localhost:5000/user/login", {
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
            localStorage.setItem("user_name", data.user_name);
            localStorage.setItem("user_id", data.user_id);
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
    <div className="d-flex p-5 justify-content-center align-items-center">
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          className="form-control"
        />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          className="form-control"
        />
        <br />
        <button type="submit" className="btn-primary m-auto rounded">
          Login
        </button>
      </form>
    </div>
  );
}
