# resilient-mailer-mailjet

`resilient-mailer-mailjet` implements Mailjet as an email provider for
[`resilient-mailer`](https://github.com/billinghamj/resilient-mailer).

[![NPM Version](https://img.shields.io/npm/v/resilient-mailer-mailjet.svg?style=flat)](https://www.npmjs.org/package/resilient-mailer-mailjet)
[![Build Status](https://img.shields.io/travis/billinghamj/resilient-mailer-mailjet.svg?style=flat)](https://travis-ci.org/billinghamj/resilient-mailer-mailjet)
[![Coverage Status](https://img.shields.io/coveralls/billinghamj/resilient-mailer-mailjet.svg?style=flat)](https://coveralls.io/r/billinghamj/resilient-mailer-mailjet)

```js
var MailjetProvider = require('resilient-mailer-mailjet');

var mailjet = new MailjetProvider('MyApiKey', 'MyApiSecret');

var mailer; // ResilientMailer instance
mailer.registerProvider(mailjet);
```

## Installation

```bash
$ npm install resilient-mailer-mailjet
```

## Usage

Create an instance of the provider. There are also a number of options you can
alter:

```js
var MailjetProvider = require('resilient-mailer-mailjet');

var options = {
	apiSecure: false,         // allows the use of HTTP rather than HTTPS
	apiHostname: '127.0.0.1', // allows alternative hostname
	apiPort: 8080             // allows unusual ports
};

var mailjet = new MailjetProvider('MyApiKey', 'MyApiSecret', options);
```

To register the provider with your `ResilientMailer` instance:

```js
var mailer; // ResilientMailer instance
mailer.registerProvider(mailjet);
```

In the event that you want to use `MailjetProvider` directly (rather than the
usual way - via `ResilientMailer`):

```js
var message = {
	from: 'no-reply@example.com',
	to: ['user@example.net'],
	subject: 'Testing my new email provider',
	textBody: 'Seems to be working!',
	htmlBody: '<p>Seems to be working!</p>'
};

mailjet.send(message, function (error) {
	if (!error)
		console.log('Success! The message sent successfully.');

	else
		console.log('Message sending failed - ' + error.message);
});
```

To see everything available in the `message` object, refer to
[resilient-mailer](https://github.com/billinghamj/resilient-mailer).

## Testing

Install the development dependencies first:

```bash
$ npm install
```

Then the tests:

```bash
$ npm test
```

## Support

Please open an issue on this repository.

## Authors

- James Billingham <james@jamesbillingham.com>

## License

MIT licensed - see [LICENSE](LICENSE) file
