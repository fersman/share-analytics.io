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
		FunctionName: 'searchSocialFetch', /* required */
		InvocationType: 'Event',
		LogType: 'None',
	}
});

var invoke = Q.nbind( lambda.invoke, lambda );

function sendMessage(msg) {
	var mp = invoke({
		Payload: JSON.stringify(msg),
	}).then(function( data ) {

		console.log( "Messages sent");

	}).catch(function( error ) {

		console.log( "Unexpected Error:", error.message );

	});

	return mp;
}

function handleUrl(list) {
		var promise = Q(true);

		list.forEach(function(row) {
			console.log(row.url_id);

			var msg = {
				url_id: row.url_id,
				url: row.url
			};

			var mp = sendMessage(msg);

			promise = promise.then(function() {
				return mp;
			});
		});

		promise.then(function() {
			console.log("Array Length", list.length);
		});

		return promise;
}

exports.handler = function(event, context) {
    console.log('Received event');

	if (!event.data || event.data == '') {
		context.fail('Missing parameter data');
		return;
	}

	var data = event.data;


	handleUrl(data).then(function() {
		context.succeed("");
	}).catch(function(e) {
		console.trace(e, e.stack.split("\n"));
		throw e;
	}).done();

};
