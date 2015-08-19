# StormWatchNodePlugin
Node.js StormWatch plugin. [![Build Status](https://travis-ci.org/Thunkar/StormWatchNodePlugin.svg?branch=master)](https://travis-ci.org/Thunkar/StormWatchNodePlugin)

## Installation

`npm install stormwatch --save`

## Usage

1. Download StormWatch app, register, add a service and obtain an API Key (soon)

2. Use the server plugin as follows:

```javascript
var stormWatch = require('stormwatch');

var stormWatchClient = stormWatch(locationCode, apiKey, pingInterval, serviceName);

var answerHeartbeat = function (err) {
    // Do something clever, check other subsystems...
	if(err) return console.log(err.message);
    stormWatchEUW.heartbeat(answerHeartbeat); //Send another heartbeat
}

stormWatchClient.handshake(function(err){
	if(err) return console.log(err.message);
	console.log('Successfully registered with StormWatch!');
	stormWatchClient.heartbeat(answerHeartbeat);
});
```
