var request = require('request'),
    moment = require('moment'),
    sha256 = require("crypto-js/sha256");

var StormWatchClient = function (location, apiKey, pingInterval, serviceName) {
    
    var _location = location,
        _pingInterval = pingInterval,
        _apiKey = apiKey,
        _serviceName = serviceName,
        _serverAddress = "http://stormwatch.cloudapp.net/api/euw/",
        _id = "",
        _failedHeartbeats = 0;
    
    return {
        
        location: function () { return _location },
        
        serviceName: function () { return _serviceName },
        
        apiKey: function () { return _apiKey },
        
        id: function () { return _id },
        
        handshake : function (callback) {
            var date = moment().format("DD/MM/YYYY_hh:mm:ss");
            var signature = sha256(date + "_" + _apiKey);
            request.post(_serverAddress + _location + "/services/handshake", 
                {
                headers: {
                    'signDate': date, 
                    'signature': signature, 
                    'name': _serviceName,
                    'accept': '*/*'
                },
                json: { name: _serviceName }
            }, function (err, response, body) {
                if (err) {
                    return callback(err);
                } else {
                    if (response.statusCode != 200) {
                        return callback(new Error("Server responded with non-200 code: " + response.statusCode), body)
                    }
                    _id = body;
                    return callback(err, body);
                }
            });
        },
        
        
        heartbeat: function (callback) {
            if (!_id) {
                return callback(new Error("No id for location: " + _location));
            }
            var date = moment().format("DD/MM/YYYY_hh:mm:ss");
            var signature = sha256(date + "_" + _apiKey);
            request.post(_serverAddress + _location + "/services/heartbeat",
                {
                headers: {
                    'signDate': date, 
                    'signature': signature, 
                    'name': _serviceName,
                    'accept': '*/*'
                },
                json: { id: _id, pingInterval: pingInterval }
            }, function (err, response, body) {
                if (err) {
                    _failedHeartbeats++;
                    return callback(err)
                }
                else if (response.statusCode != 200) {
                    if (++_failedHeartbeats > 10) {
                        return callback(new Error("Server responded with non-200 code: " + response.statusCode), body);
                    }
                }
                else {
                    return callback(err, body);
                }
            });
        }
    }
};

module.exports = StormWatchClient;