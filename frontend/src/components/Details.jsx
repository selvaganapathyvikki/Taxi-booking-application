import React, { useEffect, useState } from "react";

const Details = (props) => {
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [customer_location, setCustomerLocation] = useState([]);
  const [customer_destination, setCustomerDestination] = useState([]);
  const [user, setUser] = useState("");

  const [ischeck, setIsCheck] = useState(false);

  // Using locationIQ API to get the address using coordinates

  function getCity1() {
    var xhr = new XMLHttpRequest();
    var lat = customer_location[0];
    var lng = customer_location[1];

    xhr.open(
      "GET",
      "https://us1.locationiq.com/v1/reverse.php?key=keyhere&lat=" +
        lat +
        "&lon=" +
        lng +
        "&format=json",
      true
    );
    xhr.send();
    xhr.onreadystatechange = processRequest;
    xhr.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response1 = JSON.parse(xhr.responseText);
        console.log(response1.display_name + "");
        setAddress1(response1.display_name);
        return;
      }
    }
  }
  function getCity2() {
    var xhr1 = new XMLHttpRequest();
    var lat1 = customer_destination[0];
    var lng1 = customer_destination[1];

    xhr1.open(
      "GET",
      "https://us1.locationiq.com/v1/reverse.php?key=keyhere&lat=" +
        lat1 +
        "&lon=" +
        lng1 +
        "&format=json",
      true
    );
    xhr1.send();
    xhr1.onreadystatechange = processRequest;
    xhr1.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
      if (xhr1.readyState === 4 && xhr1.status === 200) {
        var response2 = JSON.parse(xhr1.responseText);
        console.log(response2.display_name);
        setAddress2(response2.display_name);
        return;
      }
    }
  }

  useEffect(() => {
    setCustomerLocation(props.location1);
    setCustomerDestination(props.location2);
    setUser(props.user);
    setIsCheck(true);
  }, []);

  useEffect(() => {
    getCity1();
    getCity2();
  }, [customer_location, customer_destination, user]);

  return (
    <div className="container-box container-div">
      <h5>RIDE DETAILS</h5>
      <br />
      <h6>Data :{props.data}</h6>
      <div className="img-display m-2">
        <div className="px-5">
          <h6>Idetification image</h6>
          <img
            src="https://raw.githubusercontent.com/selvaganapathyvikki/image-store/main/image1.jpg"
            alt=""
            width={"50px"}
          />
        </div>
        {user === "customer" ? (
          <div>
            <h6>Taxi image</h6>
            <img
              src="https://raw.githubusercontent.com/selvaganapathyvikki/image-store/main/image1.jpg"
              alt=""
              width={"50px"}
            />
          </div>
        ) : (
          <div>
            <h6>Customer location image</h6>
            <img
              src="https://raw.githubusercontent.com/selvaganapathyvikki/image-store/main/image1.jpg"
              alt=""
              width={"50px"}
            />
          </div>
        )}
      </div>
      <br />
      <h6>Pickup location : {address1}</h6>
      <h6>Destination location : {address2}</h6>
    </div>
  );
};

export default Details;
