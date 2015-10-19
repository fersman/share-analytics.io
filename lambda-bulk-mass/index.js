console.log('Loading function');
var Q = require("q");
var uuid = require('node-uuid');
var knex = require('./model.js').knex;

var aws = require('aws-sdk');

var lambda = new aws.Lambda({
	region: 'eu-west-1',
	accessKeyId: 'AKIAIBZXUL4J7DZ64O7A',
	secretAccessKey: '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',

	// For every request in this demo, I'm going to be using the same QueueUrl; so,
	// rather than explicitly defining it on every request, I can set it here as the
	// default QueueUrl to be automatically appended to every request.
	params: {
		FunctionName: 'searchSocialBulk', /* required */
		InvocationType: 'RequestResponse',
		LogType: 'None',
	}
});

var invoke = Q.nbind( lambda.invoke, lambda );

function sendMessage(urls) {
	console.log("Sending message");
	var mp = invoke({
		Payload: JSON.stringify({
			'urls': urls.join('\n')
		})
	}).catch(function( error ) {

		console.log( "Unexpected Error:", error.message );

	});

	return mp;
}

exports.handler = function(event, context) {
    console.log('Received event');

	if (!event.urls || event.urls == '') {
		context.fail('Missing parameter urls');
		return;
	}

	var urls = event.urls.split("\n");

	var promise = Q(true);

	var results = {};

	var batch = [];
	urls.forEach(function (url) {
		batch.push(url);

		if (batch.length > 100) {
			var mp = sendMessage(batch).then(function(data) {
				var dt = JSON.parse(data.Payload);
				Object.keys(dt).forEach(function(key) {
					results[key] = dt[key];
				});
			});
			promise = promise.then(function() {
				return mp;
			});
			batch = [];
		}
	});

	if (batch.length > 0) {
		var mp = sendMessage(batch).then(function(data) {
			var dt = JSON.parse(data.Payload);
			Object.keys(dt).forEach(function(key) {
				results[key] = dt[key];
			});
		});

		promise = promise.then(function() {
			return mp;
		});
	}

	promise.then(function() {
		console.log(results);
		context.succeed(results);
	}).catch(function(e) {
		console.trace(e, e.stack.split("\n"));
		throw e;
	}).done();

};
