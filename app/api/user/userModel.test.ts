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

function initKnex(dbConnection) {
  return require('knex')({
    client: 'pg',
    connection: dbConnection
  });
}

describe('User', ()=> {

  beforeEach(async (done) => {
    var dbConnection = {
      // the address of the docker container
      host: '192.168.99.100',
      user: 'postgres',
      database: 'postgres'
    };

    knex = initKnex(dbConnection);
    user = new User(knex);
    await knex.schema.dropTableIfExists('connections')
    await knex.schema.dropTableIfExists('users')
    await knex.schema.createTable('users', function (table) {
          table.string('id').primary();
          table.string('email');
        })
    await knex.schema.createTable('connections', function (table) {
            table.string('user_a_id');
            table.string('user_b_id');
            table.primary(['user_a_id', 'user_b_id']);
            done()
        })
  })

  describe('findAll', ()=> {
    it('should retrieve all the users from the database', tryCatch(async ()=> {
      await knex('users').insert({id: 'testId'});
      var users = await user.findAll();
      expect(users.length).to.equal(1);
      expect(users[0].id).to.equal('testId');
    });
  });

  describe('findOrCreate', ()=> {
    it('should create a user if none exists with the given id', tryCatch(async ()=> {
      var users = await knex('users').select('*');
      expect(users.length).to.equal(0);
      var res = await user.findOrCreate('testId');
      expect(res.created).to.equal(true);
      expect(res.user.id).to.equal('testId');
    }));

    it('should find a user if it has already been created', tryCatch(async ()=> {
      await knex('users').insert({ id: 'testId' });
      var users = await knex('users').select('*');
      expect(users.length).to.equal(1);
      var res = await user.findOrCreate('testId');
      expect(res.created).to.equal(false);
      expect(res.user.id).to.equal('testId');
    }));
  });

  describe('addConnection', ()=> {

    beforeEach(tryCatch(async ()=>{
      await knex('users').insert({ id: 'idA' });
      await knex('users').insert({ id: 'idB' });
    }))

    it('should add a connection if it doesnt exist', tryCatch(async ()=> {
      var didAdd = await user.addConnection('idA', 'idB');
      expect(didAdd).to.equal(true);
      var connections await knex('connections').select('*');
      expect(connections.length).to.equal(1);
      expect(connections[0].user_a_id).to.equal('idA');
      expect(connections[0].user_b_id).to.equal('idB');
    }))

    it('should not insert a duplicate connection', tryCatch(async ()=> {
      await user.addConnection('idA', 'idB');
      var didAdd = await user.addConnection('idA', 'idB');
      expect(didAdd).to.equal(false);
      var connections await knex('connections').select('*');
      expect(connections.length).to.equal(1);
      expect(connections[0].user_a_id).to.equal('idA');
      expect(connections[0].user_b_id).to.equal('idB');
    }))
  });

  describe('getConnections', ()=> {
    beforeEach(tryCatch(async ()=> {
      await knex('users').insert({ id: 'idA' });
      await knex('users').insert({ id: 'idB' });
    }))

    it('should get all a user\'s connections', tryCatch(async ()=> {
      await user.addConnection('idA', 'idB');
      var connections = await user.getConnections('idA');
      expect(connections.length).to.equal(1);
      expect(connections[0].id).to.equal('idB');

      var connections = await user.getConnections('idB');
      expect(connections.length).to.equal(1);
      expect(connections[0].id).to.equal('idA');
    });

    it('should return an empty array if no connections exist', tryCatch(async ()=> {
      var connections = await user.getConnections('idA');
      expect(connections.length).to.equal(0);
    });
  });

  describe('removeConnection', ()=> {

    beforeEach(tryCatch(async ()=> {
      await knex('users').insert({ id: 'idA' });
      await knex('users').insert({ id: 'idB' });
    }));

    it('should remove the exact connection from the db', tryCatch(async ()=> {
      await user.addConnection('idA', 'idB');
      await user.removeConnection('idA', 'idB');
      var connections = await knex('connections').select('*');
      expect(connections.length).to.equal(0)
    });

    it.only('should remove the opposite pair connection from the db', tryCatch(async ()=> {
      await user.addConnection('idA', 'idB');
      await user.removeConnection('idB', 'idA');
      var connections = await knex('connections').select('*');
      expect(connections.length).to.equal(0)
    });
  });
});
