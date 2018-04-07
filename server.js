const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	util = require('util'),
	jsonParser = bodyParser.json(),
	app = express(),
	mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/learningLogDev');

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const { Log } = require('./models');


// Create dummy data
// const setTimeoutPromise = util.promisify(setTimeout);
// LogEntries.create('A', 'Lorem ipsum dolor sit amet', 'JavaScript Promises');
// setTimeoutPromise(1000, 'a').then((value) => {
// 	LogEntries.create('B', 'Duis aute irure dolor in reprehenderit', 'Angular');
// }).then((value) => {
// 	setTimeoutPromise(500, 'b').then((value) => {
// 		LogEntries.create('C', 'Excepteur sint occaecat cupidatat non proident', 'MongoDB');
// 	});
// });


app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/views/index.html`);
});

app.get('/view-logs', (req, res) => {
	res.sendFile(`${__dirname}/views/viewLogs.html`);
});

app.get('/add-log', (req, res) => {
	res.sendFile(`${__dirname}/views/addLogs.html`);
});

app.get('/view-log/:logId', (req, res) => {
	res.sendFile(`${__dirname}/views/viewLog.html`);
});

app.get('/edit-log/:logId', (req, res) => {
	res.sendFile(`${__dirname}/views/editLog.html`);
});

// get all of your posts
app.get('/logEntries', (req, res) => {
	Log.find({})
		.then((logs) => {
			console.log(logs);
			res.json(logs.map((log) => {
				return log.serialize();
			}));
		})
		.catch(console.log);
});

// get an individual post
app.get('/logEntries/:logId', (req, res) => {
	Log.findById(req.params.logId)
		.then((log) => {
			res.json(log.serialize());
		})
		.catch(console.log);
});

app.post('/logEntries', jsonParser, (req, res) => {
	Log.create(req.body)
		.then((log) => {
			res.status(201).json(log.serialize());
		})
		.catch(console.log);
});

app.put('/logEntries/:logId', jsonParser, (req, res) => {
	console.log('PUT BODY:', req.body)
	Log.findByIdAndUpdate(req.params.logId, {$set: req.body})
		.then((log) => {
			res.status(204).end();
		})
		.catch(console.log);
});

app.delete('/logEntries/:logId', (req, res) => {
	Log.findByIdAndRemove(req.params.logId)
		.then(() => {
			res.status(204).end();
		})
		.catch(console.log);	
});

// if no routes are hit
app.use((req, res) => {
	res.sendStatus(404);
});


let server;

function runServer() {
	const port = process.env.PORT || 8080;
	return new Promise((resolve, reject) => {
		server = app.listen(port, () => {
			console.log(`App is listening on port ${port}`);
			resolve(server);
		})
			.on('error', err => {
				reject(err);
		});
	});
}

function closeServer() {
	return new Promise((resolve, reject) => {
		console.log('closing server');
		server.close(err => {
			if (err) {
				reject(err);
				// so we don't also call `resolve()`
				return;
			}
			resolve();
		});
	});
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
	runServer().catch(err => console.log(err));
}

module.exports = { runServer, closeServer, app };
