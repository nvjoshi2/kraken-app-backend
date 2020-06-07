const KRAKEN_API_KEY = require('./apiKeys').KRAKEN_KEY;
const PRIVATE_KRAKEN_API_KEY = require('./apiKeys').PRIVATE_KRAKEN_KEY;
const KrakenClient = require('kraken-api');
const kraken = new KrakenClient(KRAKEN_API_KEY, PRIVATE_KRAKEN_API_KEY);



// const addTrade = async (connection, ticker, quantity) => {
//     const dt = new Date();
//     const dtInt = dt.getTime();
//     const tickerInfo = await kraken.api('Ticker', { pair : ticker }).catch((err) => console.log(err));
//     const boughtPrice = tickerInfo['result'][ticker]['a'][0]
//     var query = `INSERT INTO trade_table (Ticker, DateTime, BoughtPrice, Quantity) VALUES ('${ticker}', ${dtInt}, ${boughtPrice}, ${quantity})`
//     connection.query(query, (err, result) => {
//         console.log('trade added')

//     })
// }

const reduceTickerInfo = (tickerInfo) => {
    const prices = {}
    for (var ticker in tickerInfo.result) {
        prices[ticker] = tickerInfo['result'][ticker]['a'][0]
    }
    return prices
}

const getTickerPrices = async (tickers) => {
    const commaSepSymbols = tickers.join(',')
    const tickerInfo = await kraken.api('Ticker', { pair : commaSepSymbols }).catch((err) => console.log(err))
    // const price = tickerInfo.result.XXBTZUSD.a[0];
    // console.log(tickerInfo['result'])
    const tickerPrices = reduceTickerInfo(tickerInfo)
    console.log(tickerPrices)
    return tickerPrices

    // let sql = 'INSERT INTO trade_profits (tradeId, DateTime, Profit) VALUES ?';
    // const dt = new Date();
    // const dtInt = dt.getTime();
    // const values = []
    
    // trades.forEach((trade) => {
    //     values.push([trade.TradeId, dtInt, trade.Quantity * (tickerPrices[trade.Ticker] - trade.BoughtPrice)] )
    // })
    // connection.query(sql, [values], (err) => {
    //     if (err) throw err;
    // })
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

// module.exports.addTrade = addTrade;
module.exports.getTickerPrices = getTickerPrices;
module.exports.getAssetPairs = getAssetPairs;