

function calculateAndDisplayRoute(directionsDisplay, directionsService, markers, stepDisplay, map){
			directionsService.route({
				origin: closestCenter.getPosition(),
				destination: closestCenter.getPosition(),
				waypoints:waypts,
				optimizeWaypoints:true,
				travelMode: google.maps.TravelMode.DRIVING
			}, function(response, status) {
			    // Route the directions and pass the response to a function to create
			    // markers for each step.
			    if (status === google.maps.DirectionsStatus.OK) {
			        directionsDisplay.setDirections(response);
			        directionsDisplay.setPanel(document.getElementById('right-panel'));
			    } else {
			        window.alert('Directions request failed due to ' + status);
			    }
		 	 });

	  	}

function getLongestDist(start,markers) { //gets the trash can furthest away from a center
    var farthestMarker;
    var dist = 0;
    var xStart = start.getPosition().lat();
    var yStart = start.getPosition().lng();

    markers.forEach(function(marker) {
        var x = marker.getPosition().lat();
        var y = marker.getPosition().lng();
        if (dist < Math.pow((xStart - x),2) + Math.pow((yStart-y),2)) {//sqrt
            dist = Math.pow((xStart - x),2) + Math.pow((yStart-y),2);
            farthestMarker = marker;
        }
    });
    return farthestMarker;
}

function getClosestCenter(markers, centers) { //gets the closest center to all cans in a district (array containing lat + long)
    var avg = avgCoords(markers);
    var avgX = avg['lat'];
    var avgY = avg['lng'];
    var count = 0

    var dist = Math.pow(centers[0]['lat']-avgX,2)
                + Math.pow(centers[0]['lng']-avgY,2);
    var closestCenter = centers[count];

    centers.forEach(function(coords){
        var x = coords['lat'];
        var y = coords['lng'];
        var pythag = Math.pow((avgX - x),2) + Math.pow((avgY-y),2);
        if (dist > pythag) {//sqrt
            dist = pythag;
            closestCenter = count;
        }
        count += 1
    });
    return closestCenter;
}

function avgCoords(markers) { //finds average coordinates of trash cans
    var xCoordSum = 0;
    var yCoordSum = 0;
    markers.forEach(function(marker) {
        xCoordSum += marker[0];
        yCoordSum += marker[1];
    });

    return {lat:xCoordSum/markers.length,lng:yCoordSum/markers.length};
}

function initDirections(fullMarks, map) {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({ 
        map: map,
        suppressMarkers:true
    });
    var stepDisplay = new google.maps.InfoWindow; // Instantiate an info window to hold step text.

    if(fullMarks.length > 0){
        calculateAndDisplayRoute(directionsDisplay, directionsService, fullMarks, stepDisplay, map);
    }
    else {
        $('.directions-btn').css({
            visibility: 'hidden'
        });
    }
}

$('document').ready(function(){ //On page load
    //Event handlers
   $('input[value="Directions"]').click(function(){
       if($("#right-panel").css("right") == "0px") {
           $("#map").animate({
               width: "100%"
           },400);
           $("#right-panel").animate({
               right:"-25%"
           },400);
       }
       else {
           $("#map").animate({
               width:"75%"
           },400);
           $("#right-panel").animate({
               right:"0%"
           },400);
       }
   });

    $('input[value="Legend"]').click(function(){
       if($(".legend dl").css("display") == "none") {
            $(".legend dl").show(200);
            $(".legend hr").show(100);
        }
        else {
            $(".legend dl").hide(200);
            $(".legend hr").hide(100);
        }
    });
});