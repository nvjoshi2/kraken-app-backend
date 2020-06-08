const krakenApi = require('./kraken-api');
const mysql = require('mysql');
const getTickerPrices = krakenApi.getTickerPrices;
const getAssetPairs = krakenApi.getAssetPairs;
const util = require('util');
var trades = [];
var tickers = [];

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Nvj13130!',
    database : 'CryptoDb',
    multipleStatements: true
  });

const connectSql = () => {
    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected to mySql database')
        setLocalVars();
    
    });
}

const promiseQuery = util.promisify(connection.query).bind(connection);

// sets trades and tickers variables
const setLocalVars = () => {
    var sql = 'SELECT TradeId, Ticker, BoughtPrice, Quantity FROM trade_table'
    connection.query(sql, (err, result) => {
        if (err) throw err;
        trades = result;
        console.log('trades set');
        console.log(trades);
        tickers = []
        trades.forEach((trade) => {
            let ticker = trade.Ticker;
            if (tickers.indexOf(ticker) === -1) {
                tickers.push(ticker)
            }
        })
        console.log('tickers set');
        console.log(tickers)
        
        
        // console.log(tickers)
    })
}



///////////////////
// SQL FUNCTIONS //
///////////////////
const getTrades = async (callback) => {
    if (trades.length > 0) {
        callback(trades)
    } else {
        var sql = 'SELECT TradeId, Ticker, BoughtPrice, Quantity FROM trade_table';
        var tradesRes = await promiseQuery(sql).catch(err => console.log(err));
        callback(tradesRes)
        // return res;

    }
}


const addTrade = async (ticker, quantity, callback) => {
    const tickerPriceObject = await getTickerPrices([ticker]);
    const boughtPrice = tickerPriceObject[ticker];
    const dt = new Date();
    const dtInt = dt.getTime();
    var query = `INSERT INTO trade_table (Ticker, DateTime, BoughtPrice, Quantity) VALUES ('${ticker}', ${dtInt}, ${boughtPrice}, ${quantity})`
    connection.query(query, (err, result) => {
        if (err) throw err;
        callback(result);
        console.log('trade added');
    })
}
//; DELETE FROM trade_profits WHERE tradeId=${tradeId}
const deleteTrade = async (tradeId, callback) => {
    var sql = `DELETE from trade_table WHERE TradeId=${tradeId}; DELETE FROM trade_profits WHERE tradeId=${tradeId}`;
    console.log(sql)
    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log(`trade ${tradeId} deleted`)
        callback(result)
    })
}

const getTradeProfitsMultiple = async (tradeIds) => {
    const tradeProfits = {}
    for (let i = 0; i < tradeIds.length; i++) {
        let tradeId = tradeIds[i];
        var sql = `SELECT DateTime, Profit from trade_profits WHERE tradeId=${tradeId}`;
        var res = await promiseQuery(sql);
        tradeProfits[tradeId] = res
    }
    console.log(tradeProfits)
    return tradeProfits;
}

const getTradeProfits = async (tradeId, callback) => {
    var sql = `SELECT DateTime, Profit from trade_profits WHERE tradeId=${tradeId}`;
    // var tradeProfits = await promiseQuery(sql);
    connection.query(sql, (err, result) => {
        if (err) throw err;
        callback(result)
    })
    
    // return res;
}

const addTradeProfits = async () => {
    const tickerPrices = await getTickerPrices(tickers);
    let sql = 'INSERT INTO trade_profits (tradeId, DateTime, Profit) VALUES ?';
    const dt = new Date();
    const dtInt = dt.getTime();
    const values = []
    
    trades.forEach((trade) => {
        values.push([trade.TradeId, dtInt, trade.Quantity * (tickerPrices[trade.Ticker] - trade.BoughtPrice)] )
    })
    connection.query(sql, [values], (err) => {
        console.log('Profits Added')
        if (err) throw err;
    })
}




//////////////////////////
// TRADE TABLE LISTENER //
//////////////////////////
const tradeTableListener = require('./tradeTableListener');
const ora = require('ora'); // cool spinner
const spinner = ora({
    text: 'Listening for changes to trade_table...',
    color: 'blue',
    spinner: 'dots2'
  });

tradeTableListener(setLocalVars)
  .then(spinner.start.bind(spinner))
  .catch(console.error);




// SQL TESTING


// getAssetPairs();
// setTimeout(() => {
//     // addTrade('XTZUSD', 3)
//     // addTradeProfits();
//     // deleteTrade(4);
//     getTradeProfits([1, 2, 5])
// }, 5000)





module.exports.connectSql = connectSql;

module.exports.getTrades = getTrades;
module.exports.addTrade = addTrade;
module.exports.deleteTrade = deleteTrade;

module.exports.getTradeProfits = getTradeProfits;
module.exports.addTradeProfits = addTradeProfits;










