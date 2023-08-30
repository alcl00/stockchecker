'use strict';
const StockModel = require('../models').Stock;
const bcrypt = require('bcrypt');

module.exports = function (app) {

  //https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/[symbol]/quote

  async function createStock(stock, like, ip) {
    const newStock = new StockModel({
      symbol: stock,
      likes: like ? [ip] : []
    })

    return await newStock.save();
  }

  async function findStock(stock) {
    return await StockModel.findOne({ symbol: stock }).exec();
  }

  async function saveStock(stock, like, ip) {
    let saved = {};
    const foundStock = await findStock(stock);
    if(!foundStock) {
      saved = await createStock(stock, like, ip);
      return saved;
    }
    else {
      if(like && foundStock.likes.indexOf(ip) === -1) {
        foundStock.likes.push(ip);
      }
      saved = await foundStock.save();
      return saved;
    }
  }

  async function getStock(stock) {
    //console.log(stock)
    const response = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`)
    //console.log(response)

    let { symbol, latestPrice } = await response.json();

    return { symbol, latestPrice };
  }

  async function compareStocks(stocks, like, ip) {
    let results = [];

    for (let i = 0; i < 2; i++) {
      let stock = stocks[i]
      let stockData = {}
      const { symbol, latestPrice } = await getStock(stock);
      if(!symbol) {
        stockData = { likes: like ? 1 : 0 }
      }
      else {
        let savedStock = await saveStock(stock, like, ip)
        stockData = { 'stock': symbol, 'price': latestPrice, 'likes': savedStock.likes.length }
        results.push(stockData);
      }
    }
    
    return results
  }


  app.route('/api/stock-prices')
    .get(async function (req, res){
      //console.log(req.ip)
      const { stock, like } = req.query;

        const ip = req.ip;
        if(Array.isArray(stock)) {
          let stockData = await compareStocks(stock, like, ip)
          res.json({ "stockData": stockData })
          return;
        }
        else {
          const { symbol, latestPrice } = await getStock(stock)
          if(!symbol) {
            res.json({ stockData: { likes: like ? 1 : 0 }})
            return;
          }
          let savedStock = await saveStock(stock, like, ip)
          res.json({ stockData: { 'stock': symbol, 'price': latestPrice, 'likes': savedStock.likes.length } });
        }
      });
};
