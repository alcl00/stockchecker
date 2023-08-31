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

    let stock1 = await getStock(stocks[0]);
    let stock2 = await getStock(stocks[1]);

    let stock1Likes = 0;
    let stock2Likes = 0;

    let stock1Data = {}
    let stock2Data = {}
    if(!stock1.symbol) {
      stock1Likes = 1;
    }
    else {
      let savedStock = await saveStock(stocks[0], like, ip);
      stock1Likes = savedStock.likes.length;
      stock1Data = { "stock": stock1.symbol, "price": stock1.latestPrice }
    }

    if(!stock2.symbol) {
      stock2Likes = 1;
    }
    else {
      let savedStock = await saveStock(stocks[1], like, ip);
      stock2Likes = savedStock.likes.length
      stock2Data = { "stock": stock2.symbol, "price": stock2.latestPrice }
    }
    stock1Data["rel_likes"] = stock1Likes - stock2Likes;
    stock2Data["rel_likes"] = stock2Likes - stock1Likes;
    
    return [stock1Data, stock2Data]
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
