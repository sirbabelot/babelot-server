var google = require('googleapis');
var _ = require('lodash')

var auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_APP_SECRET,
    'http://localhost:3000/redirect'
);

module.exports = {

  isAuthenticated: function(req, res, next) {

    // Verify the correct headers are present
    var id_token =  req.headers.authorization &&
        req.headers.authorization.split(/Bearer[\s\S]/)[1];


    if (id_token) {
      // Use the google API to verify the token agains their public key
      auth.verifyIdToken(id_token, process.env.GOOGLE_CLIENT_ID, (err, ticket) => {
        var verification = err || ticket.getPayload();
        req.verifiedPayload = verification;
        next();
      });
    } else {
      res.send(401, 'Please include \'idtoken\' property')
    }
  }

};
