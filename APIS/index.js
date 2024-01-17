function initMap() {
  let lat, lon;

  function Ubication(lat, lon, acu) {
    this.lat = lat;
    this.lon = lon;
    this.acu = acu;
  }

  const ubicaciones = JSON.parse(localStorage.getItem("ubiii")) || [];

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      acu = position.coords.accuracy;
      

      const nuevaUbicacion = new Ubication(lat, lon, acu);

      ubicaciones.unshift(nuevaUbicacion);


      ubicaciones.splice(5);


      localStorage.setItem("ubiii", JSON.stringify(ubicaciones));

      initializeMap(ubicaciones);
    });
  } else {
    const mapElement = document.getElementById("map");
    if (mapElement) {
      mapElement.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
}

function initializeMap(ubicaciones) {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: ubicaciones[0].lat, lng: ubicaciones[0].lon },
  });

  for (let i = 0; i < 6; i++) {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${ubicaciones[i].lat},${ubicaciones[i].lon}&key=AIzaSyDI3Wnk0as89bj1u3vPxkis9QTPMUfHPWI`)
      .then((r) => r.json())
      .then((respuesta) => {
        const label1 = {
          text: respuesta.results[0].formatted_address,
          color: "black",
          fontSize: "14px",
        };

        console.log(respuesta);

        const img = src="mano.png"
        new google.maps.Marker({
          position: { lat: ubicaciones[i].lat, lng: ubicaciones[i].lon },
          map,
          title: "Ubicación " + (i + 1),
          label: label1,
          icon: img
        });

         new google.maps.Circle({
          strokeColor: "yellow",
          strokeOpacity: 0.5,
          strokeWeight: 2,
          fillColor: "yellow",
          fillOpacity: 0.15,
          map,
          center: { lat: ubicaciones[0].lat, lng: ubicaciones[0].lon },
          radius: ubicaciones[0].acu,
        });
        
      });
  }
}

window.initMap = initMap;

