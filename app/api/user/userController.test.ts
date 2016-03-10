var expect = require('chai').expect
var User = require('./userModel.js');
var knex, user;

// Helper function to poropgate errors to mocha's done
var tryCatch = (fn) => {
  return async (done) => {
    try {
      await fn();
      done();
    } catch (err) {
      done(err);
    }
  };
};

describe('UserController', ()=> {
  })

  describe('GET -> /', ()=> {
    it('should retrieve all the users from the database', tryCatch(async ()=> {

    }));
  });

});
