var map;
var infowindow = new google.maps.InfoWindow();
currentFeature_or_Features = null;
var geojson;
var apikey  = 'AIzaSyCdIsH3I_VQC8s42u-D7gqj5DeoN3nQlUU';

function init(){
	map = new google.maps.Map(document.getElementById('map'),{
		zoom: 11,
		center: new google.maps.LatLng(1.3567, 103.82),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	geojson = {
		"type": "FeatureCollection",
		"features": []
	};
}
function ClearMap(){
	if (!currentFeature_or_Features)
		return;
	if (currentFeature_or_Features.length){
		for (var i = 0; i < currentFeature_or_Features.length; i++){
			if(currentFeature_or_Features[i].length){
				for(var j = 0; j < currentFeature_or_Features[i].length; j++){
					currentFeature_or_Features[i][j].setMap(null);
				}
			}
			else{
				currentFeature_or_Features[i].setMap(null);
			}
		}
	}else{
		currentFeature_or_Features.setMap(null);
	}
	if (infowindow.getMap()){
		infowindow.close();
	}
}
function SetCenter(lat, lng) {
	var myLatLng = new google.maps.LatLng(lat, lng);
	map.SetCenter(myLatLng)
}

function PlotGeoJSON(){
	ClearMap();
	currentFeature_or_Features = new GeoJSON(JSON.parse(JSON.stringify(geojson,null,'  ')));
	if (currentFeature_or_Features.length){
		for (var i = 0; i < currentFeature_or_Features.length; i++){
			if(currentFeature_or_Features[i].length){
				for(var j = 0; j < currentFeature_or_Features[i].length; j++){
					currentFeature_or_Features[i][j].setMap(map);
					if(currentFeature_or_Features[i][j].geojsonProperties) {
						SetInfoWindow(currentFeature_or_Features[i][j]);
					}
				}
			}
			else{
				currentFeature_or_Features[i].setMap(map);
			}
			if (currentFeature_or_Features[i].geojsonProperties) {
				SetInfoWindow(currentFeature_or_Features[i]);
			}
		}
	}else{
		currentFeature_or_Features.setMap(map);
		if (currentFeature_or_Features.geojsonProperties) {
			SetInfoWindow(currentFeature_or_Features);
		}
	}
}
function SetInfoWindow (feature) {
	google.maps.event.addListener(feature, "click", function(event) {
		var content = "<div id='infoBox'><strong>Who's this idiot?</strong><br />";
		for (var j in this.geojsonProperties) {
			content += this.geojsonProperties[j] + "<br />";
		}
		content += "</div>";
		infowindow.setContent(content);
		infowindow.position = event.latLng;
		infowindow.open(map);
	});
}

function ViewGeoJSON()
{
	document.getElementById("put_geojson_string_here").value = JSON.stringify(geojson,null,'  ');
};

function AddOneGeoJSON(name, lati, longi)
{
	geojson.features.push({
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [longi, lati]
		},
		"properties": {
			"Name": name
		}
	})
};

function RemoveLastIdiot()
{
	geojson.features.pop();
	if (geojson.features.length == 0)
	{
		geojson = {
			"type": "FeatureCollection",
			"features": []
		};
		ClearMap();
	}
	else
	{				
		PlotGeoJSON();
	}
	ViewGeoJSON();
}

function AddIdiot(){
	idiot_name = document.getElementById("name_string").value;
	idiot_lat = document.getElementById("lat_string").value;
	idiot_long = document.getElementById("long_string").value;
	AddOneGeoJSON(idiot_name,idiot_lat,idiot_long);
	ViewGeoJSON();
	PlotGeoJSON();
}

function CalculateCentre(){
	var avg_lat = 0.00;
	var avg_long = 0.00;
	var i;
	for (i in geojson.features) {
		avg_long += parseFloat(geojson.features[i].geometry.coordinates[0]);
		avg_lat += parseFloat(geojson.features[i].geometry.coordinates[1]);
		window.alert(avg_long);
		window.alert(avg_lat);
		window.alert(i);
	}
	i = parseInt(i)+1;
	avg_lat = avg_lat / i;
	avg_long = avg_long / i;
	window.alert("Average Long " + avg_long + " Average Lat " + avg_lat + " " + i + "objects");
	AddOneGeoJSON("WE EAT HERE",avg_lat,avg_long);
	ViewGeoJSON();
	PlotGeoJSON();
};

function ClearText(){
	document.getElementById("put_geojson_string_here").value = "";
	geojson = {
		"type": "FeatureCollection",
		"features": []
	};
	ClearMap();
}

function PostalToLatLng(){	
	postalCode = document.getElementById("postal_string").value;
	geocoder = new google.maps.Geocoder();
	geocoder.geocode( {'address' : postalCode}, function (results, status) { 

	if (status == google.maps.GeocoderStatus.OK) { 
		document.getElementById("lat_string").value = results[0].geometry.location.lat();
		document.getElementById("long_string").value = results[0].geometry.location.lng();
	} else{ 
		alert('Postal code seems incorrect')
	}
	});
}
