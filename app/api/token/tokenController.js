var request = require('superagent');
var google = require('googleapis');
var AccessToken = require('twilio').AccessToken;
var IpMessagingGrant = AccessToken.IpMessagingGrant;
var googleAuth = require(`${__base}/middleware/googleAuth.js`);
var express = require('express');
var router = express.Router();

var auth = new google.auth.OAuth2('176803199914-d0icptds3ur0mrcj20hadptifmk5f4f4.apps.googleusercontent.com', 'ubcxP9IdVjT3DhaEn4CZsmZg', 'http://localhost:3000/redirect')

/* All token routes first require a user to be logged in */
router.use(googleAuth.isAuthenticated);

/* Used for user oAuth2 through google accounts */
router.post('/google', (req, res) => {
  return res.send(req.verifiedPayload);
});

/* Used to get a twilio token for IM */
router.get('/twilio', (req, res) => {
  var appName = 'TwilioChatDemo';
  var identity = Math.random().toString();
  var deviceId = req.query.device;

  // Create a unique ID for the client on their current device
  var endpointId = appName + ':' + identity + ':' + deviceId;

  // Create a "grant" which enables a client to use IPM as a given user,
  // on a given device
  var ipmGrant = new IpMessagingGrant({
    serviceSid: process.env.TWILIO_IPM_SERVICE_SID,
    endpointId: endpointId
  });

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  var token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );

  token.addGrant(ipmGrant);
  token.identity = identity;

  // Serialize the token to a JWT string and include it in a JSON response
  return res.send('Naila Nur')
  res.send({
    identity: identity,
    token: token.toJwt()
  });
});

module.exports = router;
