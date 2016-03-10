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
var coMocha = require('mocha-co');
var knex, user;
function initKnex(dbConnection) {
    return require('knex')({
        client: 'pg',
        connection: dbConnection
    });
}
describe('User', () => {
    beforeEach((done) => {
        var dbConnection = {
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
            });
        })
            .then(() => {
            return knex.schema.createTable('connections', function (table) {
                table.string('user_a_id');
                table.string('user_b_id');
                table.primary(['user_a_id', 'user_b_id']);
                done();
            });
        });
    });
    describe('findOrCreate', () => {
        it('should create a user if none exists with the given id', function (done) {
            return __awaiter(this, void 0, void 0, function* () {
                var users = yield knex('users').select('*');
                expect(users.length).to.equal(0);
                var res = yield user.findOrCreate('testId');
                expect(res.created).to.equal(true);
                expect(res.user.id).to.equal('testId');
                done();
            });
        });
    });
});
