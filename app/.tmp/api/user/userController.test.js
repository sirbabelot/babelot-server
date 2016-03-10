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
describe('UserController', () => {
});
describe('GET -> /', () => {
    it('should retrieve all the users from the database', tryCatch(() => __awaiter(this, void 0, void 0, function* () {
    })));
});
;
