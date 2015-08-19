var chai = require('chai'),
    expect = chai.expect,
    stormWatch = require('../stormwatch.js');


describe('StormWatch server plugin tests', function () {
    
    var stormWatchClient = stormWatch("euw", "Y5B1f5YARV1MvFzRNapcjGtZqOVbnqpDdbVLO0o3", 1000, "Test");

    it('handshakes', function (done) {
        expect(stormWatchClient.serviceName()).not.to.be.undefined;
        expect(stormWatchClient.location()).not.to.be.undefined;
        expect(stormWatchClient.apiKey()).not.to.be.undefined;
        stormWatchClient.handshake(function (err, body) {
            if (err) return done(err);
            expect(err).to.be.null;
            expect(body).not.to.be.undefined;
            done();
        });
    });
    it('pings', function (done) {
        expect(stormWatchClient.id()).not.to.be.undefined;
        stormWatchClient.heartbeat(function (err, body) {
            if (err) return done(err);
            expect(err).to.be.null;
            expect(body).to.equal("ACK");
            done();
        });
    });
});