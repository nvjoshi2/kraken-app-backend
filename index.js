
//kraken stuff
const KRAKEN_API_KEY = require('./apiKeys').KRAKEN_KEY;
const PRIVATE_KRAKEN_API_KEY = require('./apiKeys').PRIVATE_KRAKEN_KEY;
const KrakenClient = require('kraken-api');
const kraken = new KrakenClient(KRAKEN_API_KEY, PRIVATE_KRAKEN_API_KEY);

const reduceTickerInfo = (tickerInfo) => {
    const prices = {}
    for (var ticker in tickerInfo.result) {
        prices[ticker] = tickerInfo['result'][ticker]['a'][0]
    }
    return prices
}

const getTickerPrices = async () => {
    const commaSepSymbols = tickers.join(',')
    const tickerInfo = await kraken.api('Ticker', { pair : commaSepSymbols }).catch((err) => console.log(err))
    // const price = tickerInfo.result.XXBTZUSD.a[0];
    // console.log(tickerInfo['result'])
    const tickerPrices = reduceTickerInfo(tickerInfo)
    console.log(tickerPrices)

    let sql = 'INSERT INTO trade_profits (tradeId, DateTime, Profit) VALUES ?';
    const dt = new Date();
    const dtInt = dt.getTime();
    const values = []
    
    trades.forEach((trade) => {
        values.push([trade.TradeId, dtInt, tickerPrices[trade.Ticker] - trade.BoughtPrice])
    })
    connection.query(sql, [values], (err) => {
        if (err) throw err;
    })
    //for trade in trades
    //   add to trade_prices (TradeId, DateTime, Profit) VALUES (trade.TradeId, Date.Now, tickerPrices[trade.Ticker] - trade.BoughtPrice)



    // return price
}

const getAssetPairs = async() => {
    const assetPairsRes = await kraken.api('AssetPairs')
    const assetPairs = Object.keys(assetPairsRes.result);
    const filteredPairs = assetPairs.filter((pair) => (pair.endsWith('USD')))
    console.log(filteredPairs)
    return filteredPairs
}



// getTickerPrice(['XXBTZUSD', 'XLTCZUSD'])

//sql stuff
const mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Nvj13130!',
    database : 'CryptoDb'
  });



var trades = [];
var tickers = []

const setLocalVars = () => {
    var query = 'SELECT TradeId, Ticker, BoughtPrice FROM trade_table'
    connection.query(query, (err, result) => {
        if (err) throw err;
        trades = result;
        console.log('trades set')
        tickers = []
        trades.forEach((trade) => {
            let ticker = trade.Ticker;
            if (tickers.indexOf(ticker) === -1) {
                tickers.push(ticker)
            }
        })
        console.log(trades)
        // console.log(tickers)
    })
}

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to mySql database')
    setLocalVars();

});


//Listener stuff
const tradeTableListener = require('./tradeTableListener');
const ora = require('ora'); // cool spinner
const spinner = ora({
    text: '🛸 Waiting for database events... 🛸',
    color: 'blue',
    spinner: 'dots2'
  });

tradeTableListener(setLocalVars)
  .then(spinner.start.bind(spinner))
  .catch(console.error);



// SQL TESTING



const addData = () => {
    const dt = new Date();
    const ticker = 'ALTCOIN';
    const dtInt = dt.getTime();
    const BoughtPrice = 9000;
    const Quantity = 6;
    var query = `INSERT INTO trade_table (Ticker, DateTime, BoughtPrice, Quantity) VALUES ('${ticker}', ${dtInt}, ${BoughtPrice}, ${Quantity})`
    // console.log(query)
    connection.query(query, (err, result) => {
        
        // console.log('test record added')
        // connection.destroy()
    })
}

setTimeout(getTickerPrices, 5000)


// setTimeout(() => {
//     console.log('testing trades after 10 seconds');
//     console.log(trades)
// }, 10000)
// var query = 'SELECT TradeId, Ticker, BoughtPrice FROM trade_table'

// connection.query(query, (err, result) => {
//     if (err) throw err;
//     console.log(result)
//     // connection.destroy()
// })


//getting play detalis to add to play detail table
// SELECT ID, Ticker WHERE ticker is 'XXBTZUSD' or 'XLTCZUSD'

//{ }






//server stuff

// const express = require('express');

// const app = express();

// const PORT = 5000;

// app.listen(PORT, () => {
//     console.log('Server started on port ' + PORT);
// })

// connection.destroy();



