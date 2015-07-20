$(document).ready(function(){
	$('#title').hide();
	$('#splash-section').find('a').hide();
	window.setTimeout(function(){
		$('#title').fadeIn(1300);

		// making nodes invisible on map2 after load
		$('#track_map2').contents().find("circle").attr('opacity', '0');
		// calling render for map 2 at initial slider setting
		renderMap2()
	}, 3000)
	window.setTimeout(function(){
		$('#splash-section').find('a').fadeIn(1300);
	}, 5000)
})

// FOLLOWING CODE IS FOR THE FIRST MAP
// ====================================================================================

// this will search through data and return everything from the passed in
// year and earlier
var getDataByYearRange = function(year) {
	var riderArray = $.grep( data, function( n, i ) {
	  return n.Date.replace(/\d\d\/\d\d\//,"") <= year;
	});
	// create a new hash to store year as key with places as value
	var yearsPlaces = {};
	// push key year and place value in checking to see if year already exists
	for (i=0; i<riderArray.length; i++) {
		var key = riderArray[i].Date.replace(/\d\d\/\d\d\//,"");
		if (key in yearsPlaces) {
			yearsPlaces[key].push(riderArray[i].Place)
		}
		else {
			yearsPlaces[key] = [riderArray[i].Place]
		}
	}
	// now return the final hash of year/places key value pairs
	// this will be what is used to render and increase in circle diameter
	// year over year at each place
	return yearsPlaces;
}

// built the above to be used with a slider, but decided to just make it 
// one playthrough using a counter. So just calling it below with the current
// year, along with counter. Retained code to be used with slider later on,
// if desired.
var yearsPlaces = getDataByYearRange(2015);
var yearCounter = 1911;
var counter = 0;

// this actually takes the data and does the work to render circles bigger
// everytime it's called
var renderMap = function() {
	var places = yearsPlaces[yearCounter];
	// at this point I have the places for the starting year
	// if there are no entries for this year, increase counter and recall
	if (isNaN(yearCounter)) {
		$('#track_map').contents().find("circle").on("mouseover", showMap1Data)
		$('#track_map').contents().find("circle").on("mouseout", hideMap1Data)
		hideMap1Data()
		yearCounter = 2015;
		return
	}
	else {
		// increase the diameter of each place circle 
		// __TODO__ change color?
		for (i=0; i < places.length; i++) {
			var place = places[i].replace(/ /g,"").replace(/'/g,"").toLowerCase();
			var svg = $('#track_map').contents();
			var currentRad = parseInt(svg.find('#'+place).attr('r'));
			svg.find('#'+place).attr('r', (currentRad+1));
		}
		// will have to use current radius minus starting radius to determine
		// total deaths at this location
		// add one to the counter
		// Then use counter to grab next year key in yearsPlaces
		// (can't just iterate here because some years are skipped and if you 
		//  try and select a nonexistant key, it returns undefined)
		$('#map1-year').html(yearCounter);
		counter += 1;
		yearCounter = parseInt(Object.keys(yearsPlaces)[counter]);

	}
	// how about just so a set timeout to call function again
	// can't miss the counter because each call is only setting up one
	// additional call after increasing the count
	window.setTimeout(renderMap, 300)
}

$('#map1-start').on("click", function(e) {
	e.preventDefault();
	renderMap();
})

var showMap1Data = function() {
	$(this).attr('opacity', '1')
	var currentRad = $(this).attr('r');
	var place = uniquePlacesHash[$(this).attr('id')];
	var totalDeaths = (parseInt(currentRad)-3);
	$('#map1-info').html("<br><br><h2>"+place+"</h2><br><p>Since the race began in 1911,</p><p><span>"+totalDeaths+"<span></p><p> deaths have occured at this location.</p>")
}

var hideMap1Data = function() {
	$(this).attr('opacity', '0.4')
	$('#map1-info').html("<br><br><br><br><br><br><br><p>Hover over a circle for more information</p>")
}

// FOLLOWING CODE IS FOR THE SECOND MAP
// ====================================================================================

$('#slider').on("change", renderMap2); 

// so I can remove slider steps that won't do anything
var uniqueYears = Object.keys(yearsPlaces)

// here's where map 2 magic happens
var renderMap2 = function() {	
	// when slider is changed, grab value and select objects from that year
	var sliderYear = uniqueYears[$('#slider').val()]
	$('#map2-year').html(sliderYear)
	var riderArray = $.grep( data, function( n, i ) {
	  return n.Date.replace(/\d\d\/\d\d\//,"") == sliderYear;
	});
	// grab svg in both vanilla JS as well as JQuery
	var theMapSVG = document.getElementById("track_map2").contentDocument;
	var svg = $('#track_map2').contents();
	// remove previously appended nodes
	if (svg.find('.rider-circle')) {
		svg.find('.rider-circle').remove()
	}
	// make sure I actually have something for this year
	// now error checking so I should
	if (riderArray.length > 0) {

		for (i=0; i<riderArray.length; i++) {
			
			// set some variables, do some formatting
			var rider = riderArray[i];
			var name = (rider.Rider).replace(/ /g,"").replace(/\./g,"").replace(/'/g,"").replace(/’/g,"").replace(/-/g,"").replace(/\(/g,"").replace(/\)/g,"").toLowerCase();
			var place = (rider.Place).replace(/ /g,"").replace(/'/g,"").toLowerCase();
			var cx = svg.find('#'+place).attr('cx');
			var cy = svg.find('#'+place).attr('cy');

			// weird vanilla JS stuff needed to attach svg elements to object embed
			var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
	    newElement.setAttribute('cx', cx)
	    newElement.setAttribute('cy', cy)
	    newElement.setAttribute('r', '2.5')
	    newElement.setAttribute('fill', 'red')
	    newElement.setAttribute('opacity', '0.6')
	    newElement.setAttribute('id', name)
	    newElement.setAttribute('class', 'rider-circle') 
	    theMapSVG.getElementsByTagName('svg')[0].appendChild(newElement);
	  }
	}
	// handling slider so that empty years aren't slected so else shoudln't trigger
  else {
  	console.log("Thankfully, no deaths for the selected year")
  }
  // set up event listeners for new DOM elements
  svg.find('.rider-circle').on('mouseover', showMap2Info);
	svg.find('.rider-circle').on('mouseout', hideMap2Info);	
}



var showMap2Info = function(){
	var name = $(this).attr('id');
	$(this).attr('opacity', '1')
	var rider = uniqueRiderHash[name];
	var riderObj = $.grep( data, function( n, i ) {
	  return n.Rider == rider;
	});
	riderObj = riderObj[0];
	$('#map2-info').html("<br><br><br><br><h2>"+rider+"</h2><p>"+riderObj.Date+"</p><p>"+riderObj.Race+"</p><p>Turn: "+riderObj.Place+"</p><p>Event: "+riderObj.Event+"</p>")
}

var hideMap2Info = function(){
	$(this).attr('opacity', '0.6');
	$('#map2-info').html("<br><br><br><br><br><p>Move the slider below to filter by year.</p><p>Each circle represents a single fatality.</p><p>Hover over the circles for more info.</p><br>")
}
