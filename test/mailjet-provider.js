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
