
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