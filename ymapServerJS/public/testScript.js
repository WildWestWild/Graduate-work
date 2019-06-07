
function getGeolocation(yourLongitude, yourLatitude, destLongitude, destLatitude, yourRadius, arrayOfCompany) {
    var myData = {
        longitude: yourLongitude,
        latitude: yourLatitude,
        deLatitude: destLatitude,
        deLongitude: destLongitude,
        radius: yourRadius,
        arrCompany: arrayOfCompany
    };
    console.log(JSON.stringify(myData));
    {
      var xhr = new XMLHttpRequest();
      var url = "/fetch";
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
              var json = JSON.parse(xhr.responseText);
              console.log(json);
          }
      };
      var data = JSON.stringify(myData);
      xhr.send(data);
    };
}


getGeolocation(55.76, 37.64, 55.768, 37.642, 0.005, [12,14]);