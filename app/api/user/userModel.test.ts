var expect = require('chai').expect
var User = require('./userModel.js');
var coMocha = require('mocha-co')
var knex, user;


function initKnex(dbConnection) {
  return require('knex')({
    client: 'pg',
    connection: dbConnection
  });
}

describe('User', ()=> {

  beforeEach((done) => {
    var dbConnection = {
      // the address of the docker container
      host: '192.168.99.100',
      user: 'postgres',
      database: 'postgres'
    };

    knex = initKnex(dbConnection);
    user = new User(knex);
    knex.schema.dropTableIfExists('connections')
      .then(() => knex.schema.dropTableIfExists('users'))
      .then(() => {
        return knex.schema.createTable('users', function (table) {
          table.string('id').primary();
          table.string('email');
        })
      })
      .then(()=> {
        return knex.schema.createTable('connections', function (table) {
            table.string('user_a_id');
            table.string('user_b_id');
            table.primary(['user_a_id', 'user_b_id']);
            done()
        })
      })
  })

  describe('findOrCreate', ()=> {

    it('should create a user if none exists with the given id', async function (done) {
        // var users = yield knex('users').select('*');
        // expect(0).to.equal(2)
        console.log('oko')
        // var res = yield user.findOrCreate('testId');
        // expect(res.created).to.equal(true);
        // expect(res.user.id).to.equal('testIds');
        done();
    });
  })
});
