var AccessToken = require('twilio').AccessToken;
var IpMessagingGrant = AccessToken.IpMessagingGrant;

class IpmConnector {

  constructor(){

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    this.token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET
    );

  }
}

module.exports = IpmConnector;
