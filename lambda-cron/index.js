console.log('Loading function');
var Q = require("q");
var uuid = require('node-uuid');
var knex = require('./model.js').knex;
var aws = require('aws-sdk');

var lambda = new aws.Lambda({
	region: 'eu-west-1',
	accessKeyId: 'AKIAIBZXUL4J7DZ64O7A',
	secretAccessKey: '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',

	params: {
		FunctionName: 'searchSocialCronBatch', /* required */
		InvocationType: 'Event',
		LogType: 'None',
	}
});

var invoke = Q.nbind( lambda.invoke, lambda );

function sendMessage(msg) {
	var mp = invoke({
		Payload: JSON.stringify({ "data": msg }),
	}).then(function( data ) {

		console.log( "Messages sent");

	}).catch(function( error ) {

		console.log( "Unexpected Error:", error.message );

	});

	return mp;
}

function handleUrl() {
	var deferred = Q.defer();

	knex.select().table('urls')
		.orderBy('updated_at', 'asc')
		.then(function(list) {
		var promise = Q(true);

		var batch = [];

		list.forEach(function(row) {
			console.log(row.url_id);

			var msg = {
				url_id: row.url_id,
				url: row.url
			};

			batch.push(msg);

			if (batch.length > 100) {
				console.log(batch);
				var mp = sendMessage(batch);

				promise = promise.then(function() {
					return mp;
				});

				batch = [];
			}

		});

		var mp = sendMessage(batch);

		promise = promise.then(function() {
			return mp;
		});

		promise.then(function() {
			console.log("Array Length", list.length);
			deferred.resolve();
		});

		return promise;
	}).catch(function(e) {
		console.trace(e, e.stack.split("\n"));
		throw e;
	});

	return deferred.promise;
}

exports.handler = function(event, context) {
    console.log('Received event');

	handleUrl().then(function() {
		context.succeed("");
	}).catch(function(e) {
		console.trace(e, e.stack.split("\n"));
		throw e;
	}).done();

};
