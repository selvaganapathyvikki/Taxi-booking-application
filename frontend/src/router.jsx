import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import UserLogin from "./components/User/UserLogin";
import UserRegistration from "./components/User/UserRegistration";
import UserHome from "./components/User/UserHome";
import DriverHome from "./components/Driver/DriverHome";
import Notfound from "./components/Notfound";
import DriverLogin from "./components/Driver/DriverLogin";
import DriverRegistration from "./components/Driver/DriverRegistration";
import AdminLogin from "./components/Admin/AdminLogin";
import Admin from "./components/Admin/Admin";
import UserHistory from "./components/User/UserHistory";
import DriverHistory from "./components/Driver/DriverHistory";
import MapRoute from "./components/Map/MapRoute";

const Router = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<App />} />
          <Route exact path="/admin/login" element={<AdminLogin />} />
          <Route exact path="/admin/home" element={<Admin />} />
          <Route exact path="/user/home" element={<UserHome />} />
          <Route exact path="/driver/home" element={<DriverHome />} />
          <Route exact path="/user/login" element={<UserLogin />} />
          <Route exact path="/driver/login" element={<DriverLogin />} />
          <Route exact path="/user/register" element={<UserRegistration />} />
          <Route exact path="user/history" element={<UserHistory />} />
          <Route exact path="/driver/history" element={<DriverHistory />} />
          <Route exact path="/book/map" element={<MapRoute />} />
          <Route
            exact
            path="/driver/register"
            element={<DriverRegistration />}
          />
          <Route exact path="/NotFound" element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Router;
