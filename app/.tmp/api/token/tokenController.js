var request = require('superagent');
var google = require('googleapis');
var AccessToken = require('twilio').AccessToken;
var IpMessagingGrant = AccessToken.IpMessagingGrant;
var googleAuth = require(`${__base}/middleware/googleAuth.js`);
var express = require('express');
var router = express.Router();
var auth = new google.auth.OAuth2('176803199914-d0icptds3ur0mrcj20hadptifmk5f4f4.apps.googleusercontent.com', 'ubcxP9IdVjT3DhaEn4CZsmZg', 'http://localhost:3000/redirect');
router.post('/google', (req, res) => {
    return res.send(req.verifiedPayload);
});
router.get('/twilio', (req, res) => {
    var appName = 'Babelot';
    var email = req.verifiedPayload.email;
    var deviceId = req.query.device;
    var endpointId = appName + ':' + email + ':' + deviceId;
    var ipmGrant = new IpMessagingGrant({
        serviceSid: process.env.TWILIO_IPM_SERVICE_SID,
        endpointId: endpointId
    });
    var token = new AccessToken(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET);
    token.addGrant(ipmGrant);
    token.identity = email;
    res.send({
        identity: email,
        token: token.toJwt()
    });
});
module.exports = router;
