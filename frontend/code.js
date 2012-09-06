
var Mixer = function(elementid) {
	this.element = document.getElementById(elementid);
	this.targetvalue = 0;
	this.currentvalue = 0;
};

Mixer.prototype.update = function(value) {
	value = Math.round(value);
	if (value != this.targetvalue)
		console.log('update mixer to value', value );
	this.targetvalue = value;
};

Mixer.prototype.tick = function() {
	this.currentvalue += (this.targetvalue - this.currentvalue) / 27.0;
	// console.log('current value:', this.currentvalue, this.targetvalue);
	this.element.volume = this.currentvalue / 100.0;
};

Mixer.prototype.start = function() {
	var that = this;
	setInterval(function() {
		that.tick();
	}, 20);
};

Mixer.prototype.play = function() {
	this.element.play();
	if (this.element.duration)
		this.element.currentTime = Math.random() * this.element.duration;
};

Mixer.prototype.stop = function() {
	this.element.pause();
}

var m1, m2, m3, m4, m5;
var lat=58, lon=18;

var updateData = function() {
	var url = 'http://citykontrol.loopfools.com/api/channel/wheater/?lat='+lat+'&lon='+lon;
	console.log('calling', url);
	$.ajax({
	  type: 'GET',
	  url: url,
	  dataType: 'json',
	  timeout: 300,
	  success: function(data) {
	  	console.log('Got data', data);
	  	m1.update(data.pressure);
	  	m2.update(data.wind_direction);
		m3.update(data.cloudiness);
		m4.update(data.temperature);
		m5.update(Math.random() * 100);
	  },
	  error: function(xhr, type) {
	  	console.log('failed', xhr, type);
	    m1.update(Math.random() * 100);
		m2.update(Math.random() * 100);
		m3.update(Math.random() * 100);
		m4.update(Math.random() * 100);
		m5.update(Math.random() * 100);
	  }
	});
};

setInterval(function() {
	updateData();
}, 10000);

function setStatus(msg) {
	if (msg) {
		$('#status').text(msg);
		setTimeout(function() {
			$('#status').text('');
		}, 1000)
		// console.log('show throbber', msg);
	} else {
		$('#status').text('');
		// console.log('hide throbber');
	}
}

function gotoLocation(str) {
	setStatus('Looking up '+str);
	console.log('goto location', str);
	var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + 
	encodeURIComponent(str) + '&sensor=false&callback=?';

	// url = 'https://maps.googleapis.com/maps/api/js/GeocodeService.Search?4sstockholm&7sUS&9sen-US&callback=?'

	$.getJSON(
	  url,
	  function(data) {
	  	console.log('got geo data', data);
	  	setStatus('Found it!');
		updateData();
	  }
	);
}

function gotoCoordinate(_lat, _lon) {
	lat = _lat;
	lon = _lon;
	console.log('goto coordinate', lat, lon);
	updateData();
}

function init(){
	m1 = new Mixer('a1');
	m2 = new Mixer('a2');
	m3 = new Mixer('a3');
	m4 = new Mixer('a4');
	m5 = new Mixer('a5');

	m1.play();
	m2.play();
	m3.play();
	m4.play();
	m5.play();

	var c = document.getElementById('q');
	c.addEventListener('change', function() {
		gotoLocation(c.value);
	});

	var d = document.getElementById('shortcuts');
	d.addEventListener('click', function(e) {
		var anch = e.srcElement;
		if (anch && anch.tagName == 'A') {
			var _lat = parseFloat($(anch).attr('data-lat'));
			var _lon = parseFloat($(anch).attr('data-lon'));
			// gotoLocation(anch.innerText);
			gotoCoordinate(_lat, _lon);
			$('#q').val(anch.innerText);
		}
	});

	var e = document.getElementById('here');
	e.addEventListener('click', function() {
		// check location
		if (navigator.geolocation) {
			setStatus('Finding your location...');
			navigator.geolocation.getCurrentPosition(function(position) {
				setStatus('Got ya!');
				$('#q').val('Your location');
				console.log('got location.', position.coords.latitude, position.coords.longitude);
				gotoCoordinate(position.coords.latitude, position.coords.longitude);
			}, function(e) {
				setStatus('Failed to get your location');
			});
		} else {
			setStatus('Not supported.');
		}
	});

	m1.start();
	m2.start();
	m3.start();
	m4.start();
	m5.start();

	setTimeout(function() {
		setStatus();
		updateData();
	}, 2000);
}
