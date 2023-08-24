'use strict';

module.exports = function (app) {

  //https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/[symbol]/quote

  app.route('/api/stock-prices')
    .get(function (req, res){
      console.log(req.query);
      res.json({});
    });
    
};
