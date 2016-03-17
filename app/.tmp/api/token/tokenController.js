var request = require('superagent');
var google = require('googleapis');
var AccessToken = require('twilio').AccessToken;
var IpMessagingGrant = AccessToken.IpMessagingGrant;
var googleAuth = require(`${__base}/middleware/googleAuth.js`);
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var authenticate = jwt({
    secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    audience: process.env.AUTH0_CLIENT_ID
});
router.use(authenticate);
router.get('/twilio', (req, res) => {
    var appName = 'Babelot';
    var userId = req.user.sub;
    var deviceId = req.query.device;
    var endpointId = appName + ':' + userId + ':' + deviceId;
    var ipmGrant = new IpMessagingGrant({
        serviceSid: process.env.TWILIO_IPM_SERVICE_SID,
        endpointId: endpointId
    });
    var token = new AccessToken(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_API_KEY, process.env.TWILIO_API_SECRET);
    token.addGrant(ipmGrant);
    token.identity = userId;
    res.send({
        identity: userId,
        token: token.toJwt()
    });
});
module.exports = router;
