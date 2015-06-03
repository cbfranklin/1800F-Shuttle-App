var stations = ["NCR", "1800F"];
var schedule = [{
	name: "Shuttle Bus",
	stops: ["NCR", "1800F"],
	addresses: ["7th & D St SW", "E St side, wing 3 exit"],
	maps: ["https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d776.4285708937543!2d-77.02207866235736!3d38.884778314271614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7b79d4d62e08b%3A0xe2e23b0130745bbd!2zMzjCsDUzJzA1LjMiTiA3N8KwMDEnMTkuMyJX!5e0!3m2!1sen!2sus!4v1425308849009",
			"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d776.298781415795!2d-77.041817!3d38.89665299999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDUzJzQ4LjAiTiA3N8KwMDInMzAuNSJX!5e0!3m2!1sen!2sus!4v1425309535211"],
	timetable: [
		["08:30", "08:30"],
		["08:50", "08:50"],
		["09:10", "09:10"],
		["09:30", "09:30"],
		["09:50", "09:50"],
		["10:10", "10:10"],
		["10:30", "10:30"],
		["10:50", "10:50"],
		["11:10", "11:10"],
		["11:30", "11:30"],
		["12:30", "12:30"],
		["12:50", "12:50"],
		["13:10", "13:10"],
		["13:30", "13:30"],
		["13:50", "13:50"],
		["14:10", "14:10"],
		["14:30", "14:30"],
		["14:50", "14:50"],
		["15:10", "15:10"],
		["15:30", "15:30"],
		["15:50", "15:50"],
		["16:10", "16:10"],
		["16:30", "16:30"],
		["16:50", "16:50"]
	]
}];
var today = moment().format('YYYY-MM-DD');
var tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');

function initShuttle(){

	if(isWeekDay()) {
		initStations();
		queue();
	}
	else{
		$('#board').append('<div class="item center wobble animated timeRed"><h4><em>No Shuttles Today</em></h4></div>');
		$('#board .item').addClass('animate');
	}
	$('#shuttle #search .search').on('click', function() {
		searchSchedule();
		return false;
	});
	$('#shuttle #results .searchAgain').on('click', function() {
		searchAgain();
		return false;
	});

	$('#shuttle .show-map').on('click',function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active').siblings('iframe').hide().removeClass('active');
		}
		else{
			var station = $(this).parents('.station').attr('data-station');
			$(this).addClass('active').siblings('iframe').show().addClass('active').attr('src',schedule[0].maps[station]);
		}
	})

	$('.btn-anchor').on('click',function(){
		var anchor = $(this).attr('data-anchor');
		$('#'+anchor).scrollToAnchor(-65);
	});
	
};

function initStations() {
	for (var i = 0; i < stations.length; i++) {
		//var stationDiv = '<div class="station col-sm-6" data-station="' + i + '"><div class="station-timer"><h3>Departing ' + stations[i] + '</h3><h4>' + schedule[0].addresses[i] + '</h4></div><div class="station-map"><button class="btn btn-default btn-block show-map"><span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span>Map</button><iframe style="display:none" src=""frameborder="0"></iframe></div></div>';
		var stationDiv = '<div class="station col-sm-6" data-station="' + i + '"><div class="station-timer"><h3>Departing ' + stations[i] + '</h3><h4>' + schedule[0].addresses[i] + '</h4></div></div>';
		$('#board').append(stationDiv);
		var stationOpt = '<option value="' + i + '">' + stations[i] + '</option>';
		$('#search select#stations').append(stationOpt);
	}
}

function searchSchedule() {
	$('#shuttle #search').hide();
	$('#shuttle #results').show();
	var s = $('#shuttle #search select#stations option:selected').val();
	var sName = $('#shuttle #search select#stations option:selected').text();
	var time = $('#shuttle #search #time option:selected').attr('val');
	var displayTime = moment(time, 'HH:mm').format('hh:mm A');
	var time2 = moment(today + ' ' + time).add(90, 'minutes').format('HH:mm');
	if (typeof ga !== "undefined") {
        ga('send', 'event', 'Trip Planner', sName, displayTime);
    } else {
        console.log('send', 'event', 'Trip Planner', sName, removeLeadZero(displayTime));
    }
	$('<h4 class="results-for">' + sName + ', ' + removeLeadZero(displayTime) + '</h4><br>').insertAfter('#shuttle #results h3');
	for (var m = 0; m < schedule[0].timetable.length; m++) {
		var testTime = moment(today + ' ' + schedule[0].timetable[m][s]);
		if ((testTime.isAfter(moment(today + ' ' + time)) && testTime.isBefore(moment(today + ' ' + time2))) || testTime.format('HH:mm') === time) {
			var nextDeparture = schedule[0].timetable[m][s];
			startCountdown(schedule[0].name, 0, 'user', nextDeparture);
		}
	}
}

function startCountdown(name, busID, stationID, time) {
	var eventTime = moment(today + ' ' + time).unix();
	var currentTime = moment().unix();
	var diffTime = eventTime - currentTime;
	var duration = moment.duration(diffTime * 1000, 'milliseconds');
	var id = busID + '-' + stationID + '-' + eventTime;
	if (stationID !== 'user') {
		var countdown = '<div id="' + id + '" class="item zoomIn"><h5></h5></div>';
	} else {
		var countdown = '<h5 id="' + id + '"></h5>';
	}
	if (stationID !== 'user') {
		$('#shuttle #board .station[data-station=' + stationID + '] .station-timer').append(countdown);
	} else {
		$('#shuttle #results div').append(countdown);
	}
	if (stationID !== 'user') {
		var timer = setInterval(function() {
			duration = moment.duration(duration - 1000, 'milliseconds');
			$('#' + id + ' h5').text(duration.hours() + ":" + leadZero(duration.minutes()) + ":" + leadZero(duration.seconds()));
			if (duration.minutes() < 5 && duration.hours() === 0) {
				$('#' + id + ' h5').addClass('timeRed');
			}
		}, 1000);
	} else {
		var displayTime = removeLeadZero(moment(today + ' ' + time).format('hh:mm A'));
		$('h5#' + id).text(displayTime).addClass('timeBlack');
	}
	$('#board #' + id).attr('data-time', eventTime);
	setTimeout(function() {
		$('img.load').remove();
		$('#' + id).show();
	}, 1100);
	if (stationID !== 'user') {
		setTimeout(function() {
			clearInterval(timer);
			$('#' + id + ' h5').text('0:00:00').addClass('blink');
			setTimeout(function() {
				$('#' + id).remove();
				queue();
			}, 10000);
		}, diffTime * 1000 + 1);
	}
}

function searchAgain() {
	$('#shuttle #results h4,#results h5').remove();
	$('#shuttle #results').hide();
	$('#shuttle #search').show();
}

function queue() {
	for (var i = 0; i < stations.length; i++) {
		var noShuttles = true;
		for (var j = 0; j < getSize(schedule); j++) {
			if (schedule[j].stops.indexOf(stations[i]) > -1) {
				for (var k = 0; k < schedule[j].timetable.length; k++) {
					if (moment(today + ' ' + schedule[j].timetable[k][schedule[j].stops.indexOf(stations[i])]).isAfter(moment())) {
						if ($('#shuttle #board .station[data-station=' + schedule[j].stops.indexOf(stations[i]) + '] .item').length === 0) {
							var nextDeparture = schedule[j].timetable[k][schedule[j].stops.indexOf(stations[i])];
							startCountdown(schedule[j].name, j, i, nextDeparture);
							noShuttles = false;
						}
						break;
					}
				}
			}
		}
		if (noShuttles === true && $('#shuttle #board .station[data-station=' + i + '] .item').length === 0) {
			var noShuttlesMessage = '<div class="item zoomIn animated noShuttles timeRed"><h4><em>No More Shuttles Today</em></h4></div>';
			var stationID = i;
			$('#shuttle #board .station[data-station=' + stationID + '] .station-timer').append(noShuttlesMessage);
			$('#shuttle #board .station[data-station=' + stationID + '] .load').hide();
			$('#shuttle #board .noShuttles').show();
		}
	}
}

function getSize(obj) {
	var size = 0,
		key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
}

function isWeekDay() {
	if (moment().format('dd') !== 'Sun' && moment().format('dd') !== 'Sat') {
		var value = true;
	} else {
		var value = false;
	}
	return value;
}

function leadZero(val) {
	if (val < 10) {
		var fixed = '0' + val;
	} else {
		fixed = val;
	}
	return fixed;
}

function removeLeadZero(val) {
	if (val.charAt(0) === '0') {
		var fixed = val.substr(1);
	} else {
		var fixed = val;
	}
	return fixed;
}

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt) {
		var len = this.length >>> 0;
		var from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0) from += len;
		for (; from < len; from++) {
			if (from in this && this[from] === elt) return from;
		}
		return -1;
	};
}
jQuery.fn.extend({
    scrollToAnchor: function(theOffset, theTime) {
        var theSelector = this;
        if (!theTime) {
            var theTime = 500
        }
        if (!theOffset) {
            var theOffset = 0;
        }
        $('html,body').animate({
            scrollTop: theSelector.offset().top + theOffset
        }, theTime);
    }
});