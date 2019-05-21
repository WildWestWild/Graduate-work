
function getGeolocation(yourLongitude, yourLatitude, yourRadius, arrayOfCompany) {
    var myData = {
        longitude: yourLongitude,
        latitude: yourLatitude,
        radius: yourRadius,
        arrCompany: arrayOfCompany
    };
    
    var data = new FormData();
    data.append("json", JSON.stringify(myData));
    window.fetch('/fetch', {
        method: "POST",
        body: JSON.stringify({myData: 1 }), 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
    }).then(function(response) {
        // Стоит проверить код ответа.
        if (!response.ok) {
            // Сервер вернул код ответа за границами диапазона [200, 299]
            return Promise.reject(new Error(
                'Response failed: ' + response.status + ' (' + response.statusText + ')'
            ));
        }
        // Далее будем использовать только JSON из тела ответа.
        return response.json();
    }).then(function(data) {
        console.log(data);
        // ... Делаем что-то с данными.
    }).catch(function(error) {
        console.error(error);
        // ... Обрабатываем ошибки.
    });
}

getGeolocation(55.76, 37.64, 0.005, [12,14]);