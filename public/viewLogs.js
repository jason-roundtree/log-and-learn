'use strict'

let logsData = {}

function handleLogs(err, logs) {
	if (err) {
		return console.log(err);
	}
	logsData = logs;
	sortLogs(logsData);
}

function sortLogs(logsData, sortValue) {
	console.log('sortValue:', sortValue);
	console.log('logsData:', logsData);
	if (sortValue === undefined) {
		console.log('if ran');
		// console.log('logs:', logs);
		logsData.sort(function(a, b) {
			return b.publishDate - a.publishDate;
		});
	} else if (sortValue === 'log_newest') {
		logsData.sort(function(a, b) {
			return b.publishDate - a.publishDate;
		});
	} else if (sortValue === 'log_oldest') {
		console.log('log_oldest ran')
		logsData.sort(function(a, b) {
			return a.publishDate - b.publishDate;
		});
	} else if (sortValue === 'tag_a') {
		logsData.sort(function(a, b) {
			let _a = a.tag.toLowerCase();
			let _b = b.tag.toLowerCase();
			if (_a < _b) return -1;
			if (_a > _b) return 1;
			return 0;
		});
	} else {
		logsData.sort(function(a, b) {
			let _a = a.tag.toLowerCase();
			let _b = b.tag.toLowerCase();
			if (_b < _a) return -1;
			if (_b > _a) return 1;
			return 0;
		});
	}
	const logsHTML = renderLogs(logsData);
	$('.render-log-section').empty().append(logsHTML.join(''));

}

function bindHandlers() {
	// Grab entry ID for targeting during log click
	$('.render-log-section').on('click', '.logEntry', function() {
		let logId = $(this).find('.logId').text();
		window.location.href = `/view-log/${logId}`;
	});

	// Grab selected sort-by value 
	$('select').change(function() {
		let sortValue = $(this).val();
		sortLogs(logsData, sortValue);
	});
}

function initViewLogs() {
	bindHandlers();
	Data.getLogs(handleLogs);
}

$(initViewLogs);