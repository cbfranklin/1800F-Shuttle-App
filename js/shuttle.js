var stations = ["NCR", "1800F"];
var schedule = [{
	name: "Shuttle Bus",
	stops: ["NCR", "1800F"],
	addresses: ["7th & D St SW", "E St side, wing 3 exit"],
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

$(function(){
	initShuttle();
	navigation();
});

function initShuttle(){

	if(isWeekDay()) {
		initStations();
		queue();
	}
	else{
		$('#board').append('<div class="item center animate"><h4>No shuttles today.</h4></div>');
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
	
};

function initStations() {
	for (var i = 0; i < stations.length; i++) {
		var stationDiv = '<div class="station" data-station="' + i + '"><h3>Departing ' + stations[i] + '</h3><h4>' + schedule[0].addresses[i] + '</h4></div>';
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
	$('<h4>For: ' + sName + ', ' + removeLeadZero(displayTime) + '</h4>').insertAfter('#shuttle #results h3');
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
		var countdown = '<div id="' + id + '" class="item"><h5></h5></div>';
	} else {
		var countdown = '<h5 id="' + id + '"></h5>';
	}
	if (stationID !== 'user') {
		$('#shuttle #board .station[data-station=' + stationID + ']').append(countdown);
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
			var noShuttlesMessage = '<div class="item animate noShuttles"><h4><strong>No More Shuttles Today</strong></h4></div>';
			var stationID = i;
			$('#shuttle #board .station[data-station=' + stationID + ']').append(noShuttlesMessage);
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