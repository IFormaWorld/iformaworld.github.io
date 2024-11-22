const SHEET_ID = "16hVGHl5vrxMeLj_-Ib3jbpRIIx6vGrlxIYJDNdmYfb8"; // ID vašega Google Sheets dokumenta
const RECORD_SHEET_NAME = "Nege"; // Zavihek za shranjevanje obiskov

// Funkcija za ustvarjanje spletnega uporabniškega vmesnika
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index');
}

// Funkcija za pretvorbo koordinat v naslov (obratno geokodiranje)
function getAddress(lat, lng) {
  const response = Maps.newGeocoder().reverseGeocode(lat, lng);
  const address = response.results[0].formatted_address;
  return address;
}

function submitForm() {
  // Preverimo, če je polje Ime oskrbovanca prazno
  var name = document.getElementById('name').value;
  if (!name) {
    // Če je prazno, prikažemo napako  
    document.getElementById("name-error").style.display = "block";
    return; // Prekine pošiljanje obrazca, dokler ni izpolnjeno
  } else {
    // Če je izpolnjeno, skrijemo napako
    document.getElementById("name-error").style.display = "none";
  }

  // Ostale operacije za pošiljanje obrazca, če je vse v redu
  if (!selectedOption) {
    alert("Prosimo, izberite Prihod ali Odhod.");
    return;
  }

  document.getElementById("loader").style.display = "inline-block";
  document.querySelector('button[type="button"]').disabled = true;
  document.getElementById("success-message").style.display = "none";

  navigator.geolocation.getCurrentPosition(
    function(position) {
      const data = {
        name: name,
        checkInOut: selectedOption,
        services: document.getElementById('services').value,
        lat: position.coords.latitude,
        long: position.coords.longitude
      };

      google.script.run.withSuccessHandler(function(response) {
        document.getElementById("loader").style.display = "none";
        document.querySelector('button[type="button"]').disabled = false;
        document.getElementById("success-message").style.display = "block";
        document.getElementById("visitForm").reset();
        selectedOption = "";
        toggleSelection(""); // odstrani aktivni stil
      }).recordVisit(data);
    },
    function(error) {
      document.getElementById("loader").style.display = "none";
      document.querySelector('button[type="button"]').disabled = false;
      alert("Napaka pri pridobivanju lokacije.");
    }
  );
}

// Shranjevanje podatkov in pridobitev naslova
function recordVisit(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(RECORD_SHEET_NAME);
  const timestamp = new Date();
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.long}`;
  const address = getAddress(data.lat, data.long);

  sheet.appendRow([
    timestamp,                         // Časovni žig
    Session.getActiveUser().getEmail(), // Email naslov
    data.checkInOut,                   // Prihod ali odhod
    data.name,                         // Ime oskrbovanca
    data.services,                     // Opravljene storitve/opombe
    address,                           // Naslov
    mapsLink,                          // Google Maps povezava
    `${data.lat}, ${data.long}`        // Koordinate
  ]);

  return "Podatki uspešno poslani!";
}


