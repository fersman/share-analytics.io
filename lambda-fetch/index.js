console.log('Loading function');
var Q = require("q");
var request = Q.denodeify(require("request"));
var uuid = require('node-uuid');
var knex = require('./model.js').knex;

function elapsedTime (start) {
	var precision = 3; // 3 decimal places
	var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
	return process.hrtime(start)[0] + "s, " + elapsed.toFixed(precision) + "ms";
}


function makeRemoteRequest(url, data, context) {
	var start = process.hrtime();

	console.log("Calling remote");

	var p1 = request({
		method: 'GET',
		uri: "http://graph.facebook.com/?id="+url
	}).then(function(response, body) {
//		console.log(response[0], response[0].body);
		var b = JSON.parse(response[0].body);
		data["facebook-shares"] = b['shares'] ? b['shares'] : 0;
		data["facebook-comments"] = b['comments'] ? b['comments'] : 0;
		console.log("Facebook", elapsedTime(start));
	}).fail(function(e) {
		console.log(e);
	});

	var p2 = request({
		method: 'GET',
		uri: "http://cdn.api.twitter.com/1/urls/count.json?url="+url
	}).then(function(response, body) {
		//console.log(response[0], response[0].body);
		var b = JSON.parse(response[0].body);
		data["twitter"] = b['count'] ? b['count'] : 0;
		console.log("Twitter", elapsedTime(start));
	}).fail(function(e) {
		console.log(e);
	});

	var p3 = request({
		method: 'GET',
		uri: "http://www.linkedin.com/countserv/count/share?format=json&url="+url
	}).then(function(response, body) {
		//console.log(response[0], response[0].body);
		var b = JSON.parse(response[0].body);

		console.log("linkedin", elapsedTime(start));
		data["linkedin"] = b['count'] ? b['count'] : 0;
	}).fail(function(e) {
		console.log(e);
	});

	var p4 = request({
		method: 'GET',
		uri: "https://plusone.google.com/_/+1/fastbutton?url="+encodeURIComponent(url)
	}).then(function(response, body) {

		var input = response[0].body;

		var regex = /aggregateCount.*?>(.*?)<.*?/g;
		var matches, output = [];

		while (matches = regex.exec(input)) {
			output.push(matches[1]);
		}

		console.log("googleplus", elapsedTime(start));
		if(output == "Moc")output = -1;
		var cnt = parseInt(output);

		data["googleplus"] = cnt ? cnt : 0;
	}).fail(function(e) {
		console.log(e);
	});

	return Q.allSettled([p1, p2, p3, p4]).then(function() {
		console.log(data);
		var dbEntry = {
			url_response_id: uuid.v4(),
			url_id: data['uuid'],
			googleplus: data['googleplus'],
			linkedin: data['linkedin'],
			twitter: data['twitter'],
			"facebook-shares": data['facebook-shares'],
			"facebook-comments": data['facebook-comments'],
			updated_at: new Date(),
			created_at: new Date()
		};

		knex.table('url_responses').insert(dbEntry).then(function() {
			knex.table('urls').where({
				'url_id': data['uuid']
			}).update({
				updated_at: new Date()
			}).then(function() {
				context.succeed(data);
			});
		});
	});
}

exports.handler = function(event, context) {
    console.log('Received event:', JSON.stringify(event, null, 2));

	if (!event.url || event.url == '') {
		context.fail('Missing parameter url');
		return;
	}

	var data = {url: event['url']};

	data['uuid'] = event['url_id'];

	makeRemoteRequest(event['url'], data, context);
};
