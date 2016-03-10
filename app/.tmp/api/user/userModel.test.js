var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var expect = require('chai').expect;
var User = require('./userModel.js');
var knex, user;
var tryCatch = (fn) => {
    return (done) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield fn();
            done();
        }
        catch (err) {
            done(err);
        }
    });
};
function initKnex(dbConnection) {
    return require('knex')({
        client: 'pg',
        connection: dbConnection
    });
}
describe('UserModel', () => {
    beforeEach((done) => __awaiter(this, void 0, void 0, function* () {
        var dbConnection = {
            host: '192.168.99.100',
            user: 'postgres',
            database: 'postgres'
        };
        knex = initKnex(dbConnection);
        user = new User(knex);
        yield knex.schema.dropTableIfExists('connections');
        yield knex.schema.dropTableIfExists('users');
        yield knex.schema.createTable('users', function (table) {
            table.string('id').primary();
            table.string('email');
        });
        yield knex.schema.createTable('connections', function (table) {
            table.string('user_a_id');
            table.string('user_b_id');
            table.primary(['user_a_id', 'user_b_id']);
            done();
        });
    }));
    describe('findAll', () => {
        it('should retrieve all the users from the database', tryCatch(() => __awaiter(this, void 0, void 0, function* () {
            yield knex('users').insert({ id: 'testId' });
            var users = yield user.findAll();
            expect(users.length).to.equal(1);
            expect(users[0].id).to.equal('testId');
        })));
    });
    describe('findOrCreate', () => {
        it('should create a user if none exists with the given id', tryCatch(() => __awaiter(this, void 0, void 0, function* () {
            var users = yield knex('users').select('*');
            expect(users.length).to.equal(0);
            var res = yield user.findOrCreate('testId');
            expect(res.created).to.equal(true);
            expect(res.user.id).to.equal('testId');
        })));
        it('should find a user if it has already been created', tryCatch(() => __awaiter(this, void 0, void 0, function* () {
            yield knex('users').insert({ id: 'testId' });
            var users = yield knex('users').select('*');
            expect(users.length).to.equal(1);
            var res = yield user.findOrCreate('testId');
            expect(res.created).to.equal(false);
            expect(res.user.id).to.equal('testId');
        })));
    });
    describe('addConnection', () => {
        beforeEach(tryCatch(() => __awaiter(this, void 0, void 0, function* () {
            yield knex('users').insert({ id: 'idA' });
            yield knex('users').insert({ id: 'idB' });
        })));
        it('should add a connection if it doesnt exist', tryCatch(() => __awaiter(this, void 0, void 0, function* () {
            var didAdd = yield user.addConnection('idA', 'idB');
            expect(didAdd).to.equal(true);
            var connections = yield knex('connections').select('*');
            expect(connections.length).to.equal(1);
            expect(connections[0].user_a_id).to.equal('idA');
            expect(connections[0].user_b_id).to.equal('idB');
        })));
        it('should not insert a duplicate connection', tryCatch(() => __awaiter(this, void 0, void 0, function* () {
            yield user.addConnection('idA', 'idB');
            var didAdd = yield user.addConnection('idA', 'idB');
            expect(didAdd).to.equal(false);
            var connections = yield knex('connections').select('*');
            expect(connections.length).to.equal(1);
            expect(connections[0].user_a_id).to.equal('idA');
            expect(connections[0].user_b_id).to.equal('idB');
        })));
    });
    describe('getConnections', () => {
        beforeEach(tryCatch(() => __awaiter(this, void 0, void 0, function* () {
            yield knex('users').insert({ id: 'idA' });
            yield knex('users').insert({ id: 'idB' });
        })));
        it('should get all a user\'s connections', tryCatch(() => __awaiter(this, void 0, void 0, function* () {
            yield user.addConnection('idA', 'idB');
            var connections = yield user.getConnections('idA');
            expect(connections.length).to.equal(1);
            expect(connections[0].id).to.equal('idB');
            var connections = yield user.getConnections('idB');
            expect(connections.length).to.equal(1);
            expect(connections[0].id).to.equal('idA');
        })));
        it('should return an empty array if no connections exist', tryCatch(() => __awaiter(this, void 0, void 0, function* () {
            var connections = yield user.getConnections('idA');
            expect(connections.length).to.equal(0);
        })));
    });
    describe('removeConnection', () => {
        beforeEach(tryCatch(() => __awaiter(this, void 0, void 0, function* () {
            yield knex('users').insert({ id: 'idA' });
            yield knex('users').insert({ id: 'idB' });
        })));
        it('should remove the exact connection from the db', tryCatch(() => __awaiter(this, void 0, void 0, function* () {
            yield user.addConnection('idA', 'idB');
            var numberRemoved = yield user.removeConnection('idA', 'idB');
            expect(numberRemoved).to.equal(1);
        })));
        it('should remove the opposite pair connection from the db', tryCatch(() => __awaiter(this, void 0, void 0, function* () {
            yield user.addConnection('idA', 'idB');
            var numberRemoved = yield user.removeConnection('idA', 'idB');
            expect(numberRemoved).to.equal(1);
        })));
        it('should not remove non existant pairs', tryCatch(() => __awaiter(this, void 0, void 0, function* () {
            yield user.addConnection('idA', 'idB');
            var numberRemoved = yield user.removeConnection('gibberish', 'idB');
            expect(numberRemoved).to.equal(0);
        })));
    });
});
