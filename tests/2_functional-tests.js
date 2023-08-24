const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('Test GET /api/stock-prices/', function() {
        let currentGOOGLikes;
        test('Viewing one stock', function(done) {
            chai.request(server)
            .keepOpen()
            .get('/api/stock-prices?stock=GOOG')
            .end(function(err,res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'stock');
                assert.property(res.body, 'price');
                assert.property(res.body, 'likes');
                currentGOOGLikes = res.body.likes;                
            })
            done();
        });
        test('Viewing one stock and liking it', function(done) {
            chai.request(server)
            .keepOpen()
            .get('/api/stock-prices?stock=GOOG&like=True')
            .end(function(err,res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'stock');
                assert.property(res.body, 'price');
                assert.property(res.body, 'likes');
                assert.equal(res.body.likes, currentGOOGLikes+1)
                currentGOOGLikes = res.body.likes
            })
            done();
        })
        test('Viewing the same stock and liking it again', function(done) {
            chai.request(server)
            .keepOpen()
            .get('/api/stock-prices?stock=GOOG&like=True')
            .end(function(err,res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'stock');
                assert.property(res.body, 'price');
                assert.property(res.body, 'likes');
                assert.equal(res.body.likes, currentGOOGLikes);
            })
            done();
        })
        test('Viewing two stocks', function(done) {
            chai.request(server)
            .keepOpen()
            .get('/api/stock-prices?stock=GOOG&stock=MSFT')
            .end(function(err,res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'stock');
                assert.isArray(res.body.stocks);
                assert.equal(res.body.stocks.length, 2);

            })
            done();
        })
        test('Viewing two stocks and liking them', function(done) {
            chai.request(server)
            .keepOpen()
            .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=True')
            .end(function(err,res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'stock');
                assert.isArray(res.body.stocks);
                assert.equal(res.body.stocks.length, 2);
            })
            done();
        })
    });
});
