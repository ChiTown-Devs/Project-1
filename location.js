
$("#currentLocation").on("click", function() {
	//Settings copied from https://rapidapi.com/fcambus/api/telize?endpoint=5c082424e4b067d7d9560ca2
	const geoSettings = {
		"async": true,
		"crossDomain": true,
		"url": "https://telize-v1.p.rapidapi.com/geoip",
		"method": "GET",
		//API access authorization
		"headers": {
			"x-rapidapi-key": "79f7ca8118msh020414b1e09c65cp1220e3jsn80b7757a036d",
			"x-rapidapi-host": "telize-v1.p.rapidapi.com"
		}
	};

	$.ajax(geoSettings).done(function (response) {
		let zipCode = response.postal_code;
		
		retrieveCounty(zipCode)
	});
});

function retrieveCounty(zipCode) {
	const countyKey = "D7K6W4KICQXNF9IXO9DY"
	const zipurl = "https://api.zip-codes.com/ZipCodesAPI.svc/1.0/GetZipCodeDetails/" + zipCode + "?key=" + countyKey;

	//Settings copied from https://api.zip-codes.com/ZipCodesAPI.svc/1.0/GetZipCodeDetails/
	const dataSettings = {
	url: zipurl,
	method: "GET"
	};

	$.ajax(dataSettings).done(function (response) {
		//console.log(response);
		let countyName = response.item.CountyName;
		let stateAbbrName = response.item.State;
		let stateName = statesFullName[statesAbbrev.indexOf(stateAbbrName)];

		covidCall(stateName, countyName);
	});
};

$('#queryCity').on('click', () => {
	let userCity = $('#city').val();
	let stateName = $('#states').val();
	storeCity(userCity, stateName);
	renderStoredCities();
	const settings = {
		"async": true,
		"crossDomain": true,
		"url": `https://geocode-address-to-location.p.rapidapi.com/v1/geocode/search?text=${userCity} ${stateName}&limit=1&lang=en`,
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "79f7ca8118msh020414b1e09c65cp1220e3jsn80b7757a036d",
			"x-rapidapi-host": "geocode-address-to-location.p.rapidapi.com"
		}
	};
	if (userCity) {
		$.ajax(settings).done(function (response) {
			let county = response.features[0].properties.county;
			covidCall(stateName, county);
		});
	} else {
		covidCall(stateName);
	};

});

//Function for storing city locally
const storeCity = (city, state) => {
    //Retrieves previously stored cities
    let storedCities = JSON.parse(localStorage.getItem('cities'));
    //If the storage was empty then an array is created with the first searched city
    if (storedCities) {
        //If the city is already in storage it is not pushed
        if (!storedCities.includes({'state': state,
        'city': city})) {
            storedCities.push({'state': state, 'city': city});
        };
    } else {
        storedCities = [{'state': state, 'city': city}];
    };
    //The stored array is updated
    localStorage.setItem('cities', JSON.stringify(storedCities));
};

const renderStoredCities = () => {
	$('.button-container').html('');
    let cities = JSON.parse(localStorage.getItem('cities'));
    console.log(cities);
    for (let i = 0; cities.length > 5 ? i < 5 : i < cities.length; i++) {
        let cityName = '';
        if (cities[i].hasOwnProperty('city')) {
            cityName = cities[i].city;
        };
        let stateName = cities[i].state;
        let newButton = $('<a class="button city-button"></a>');
        if (cityName) {
			newButton.attr('data-city', cityName);
			cityName += ', ';
        };
        newButton.attr('data-state', stateName);
        newButton.text(`${cityName}${stateName}`);
        $('.button-container').append(newButton);
    };
};

renderStoredCities();

