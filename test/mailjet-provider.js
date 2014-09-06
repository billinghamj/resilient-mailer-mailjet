var test = require('tape');
var http = require('http');
var MailjetProvider = require('../lib/mailjet-provider');

test('correct types exported', function (t) {
	t.equal(typeof MailjetProvider, 'function');
	t.equal(typeof MailjetProvider.prototype.mail, 'function');

	t.end();
});

test('correct types after initialization', function (t) {
	var provider = new MailjetProvider('api-key', 'api-secret');

	t.assert(provider instanceof MailjetProvider);
	t.equal(typeof provider.mail, 'function');

	t.end();
});

test('invalid initialization causes exception', function (t) {
	t.throws(function () { new MailjetProvider(); });
	t.throws(function () { new MailjetProvider(0); });
	t.throws(function () { new MailjetProvider({}); });
	t.throws(function () { new MailjetProvider([]); });

	t.end();
});

test('empty options doesn\'t cause exception', function (t) {
	t.doesNotThrow(function () { new MailjetProvider('api-key', 'api-secret', {}); });

	t.end();
});

test('invalid message returns error', function (t) {
	var provider = new MailjetProvider('api-key', 'api-secret');

	t.plan(3);

	provider.mail(null, function (error) { t.notEqual(typeof error, 'undefined'); });
	provider.mail({}, function (error) { t.notEqual(typeof error, 'undefined'); });
	provider.mail({to:['']}, function (error) { t.notEqual(typeof error, 'undefined'); });
});

test('handles api errors correctly', function (t) {
	var message = {
		from: 'no-reply@example.com',
		to: ['user@example.net', 'user@example.org'],
		cc: ['user2@example.net'],
		bcc: ['user3@example.net'],
		replyto: 'info@example.com',
		subject: 'testing, 123...',
		textBody: 'please disregard',
		htmlBody: '<p>please disregard</p>'
	};

	t.plan(4);

	var server = setupTestServer(t,
		function (request, response, body) {
			var error = JSON.stringify({ message: 'generic fail' });

			response.writeHead(503, { 'Content-Length': error.length });
			response.write(error);
			response.end();
		},

		function (addr) {
			var options = {
				apiSecure: false,
				apiHostname: addr.address,
				apiPort: addr.port
			};

			var provider = new MailjetProvider('api-key', 'api-secret', options);

			provider.mail(message, function (error) {
				t.notEqual(typeof error, 'undefined');
				t.equal(error.httpStatusCode, 503);

				server.close();
			});
		});
});

test('check lack of callback', function (t) {
	var message = {
		from: 'no-reply@example.com',
		to: ['user@example.net', 'user@example.org'],
		cc: ['user2@example.net'],
		bcc: ['user3@example.net'],
		replyto: 'info@example.com',
		subject: 'testing, 123...',
		textBody: 'please disregard',
		htmlBody: '<p>please disregard</p>'
	};

	t.plan(2);

	var server = setupTestServer(t,
		function (request, response, body) {
			var error = JSON.stringify({ message: 'generic fail' });

			response.writeHead(503, { 'Content-Length': error.length });
			response.write(error);
			response.end();

			server.close();
		},

		function (addr) {
			var options = {
				apiSecure: false,
				apiHostname: addr.address,
				apiPort: addr.port
			};

			var provider = new MailjetProvider('api-key', 'api-secret', options);

			provider.mail(message);
		});
});

// will generate 2 assertions
function setupTestServer(t, handler, callback) {
	var server = http.createServer(function (request, response) {
		t.equal(request.method, 'POST');
		t.equal(request.url, '/v3/send/message');

		body = '';

		request.on('data', function (chunk) {
			body += chunk;
		});

		request.on('end', function () {
			handler(request, response, body);
		});
	});

	server.listen(function () {
		var addr = server.address();

		callback(addr);
	});

	return server;
}
