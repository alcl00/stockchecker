const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('Test GET /api/stock-prices/', function() {
        let currentGOOGLikes = 0;
        test('Viewing one stock', function(done) {
            chai.request(server)
            .keepOpen()
            .get('/api/stock-prices?stock=GOOG')
            .end((err,res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'stockData');
                assert.property(res.body.stockData, 'stock');
                assert.property(res.body.stockData, 'price');
                assert.property(res.body.stockData, 'likes');
                currentGOOGLikes = res.body.stockData.likes;
                done();                
            })
        });
        test('Viewing one stock and liking it', function(done) {
            chai.request(server)
            .keepOpen()
            .get('/api/stock-prices?stock=GOOG&like=True')
            .end((err,res) => {
                assert.equal(res.status, 200)
                assert.property(res.body, 'stockData');
                assert.property(res.body.stockData, 'stock');
                assert.property(res.body.stockData, 'price');
                assert.property(res.body.stockData, 'likes');
                assert.equal(res.body.stockData.likes, currentGOOGLikes+1)
                currentGOOGLikes = res.body.likes
                done();
            })
        })
        test('Viewing the same stock and liking it again', function(done) {
            chai.request(server)
            .keepOpen()
            .get('/api/stock-prices?stock=GOOG&like=True')
            .end(function(err,res) {
                assert.equal(res.status, 200)
                assert.property(res.body.stockData, 'stock');
                assert.property(res.body.stockData, 'price');
                assert.property(res.body.stockData, 'likes');
                assert.equal(res.body.likes, currentGOOGLikes);
                done();
            })
        })
        currentMSFTLikes = 0;
        test('Viewing two stocks', function(done) {
            chai.request(server)
            .keepOpen()
            .get('/api/stock-prices?stock=GOOG&stock=MSFT')
            .end(function(err,res) {
                assert.equal(res.status, 200)
                assert.property(res.body, 'stockData');
                assert.isArray(res.body.stockData);
                assert.property(res.body.stockData[0], "rel_likes")
                assert.equal(res.body.stockData.length, 2);
                done();
            })
        })
        test('Viewing two stocks and liking them', function(done) {
            chai.request(server)
            .keepOpen()
            .get('/api/stock-prices?stock=TSLA&stock=DIS&like=True')
            .end(function(err,res) {
                let currentDISLikes = 0;
                let currentTSLALikes = 0;
                assert.equal(res.status, 200)
                assert.property(res.body, 'stockData');
                assert.isArray(res.body.stockData);
                assert.equal(res.body.stockData.length, 2);
                assert.property(res.body.stockData[0], "rel_likes")
                done();
            })
        })
    });
});
