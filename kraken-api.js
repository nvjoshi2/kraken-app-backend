const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config();

const {
    KRAKEN_KEY,
    KRAKEN_SECRET
} = process.env;

assert(KRAKEN_KEY, "KRAKEN_KEY is required");
assert(KRAKEN_SECRET, "KRAKEN_SECRET is required");

// const KRAKEN_API_KEY = require('./apiKeys').KRAKEN_KEY;
// const PRIVATE_KRAKEN_API_KEY = require('./apiKeys').PRIVATE_KRAKEN_KEY;
const KrakenClient = require('kraken-api');
const kraken = new KrakenClient(KRAKEN_KEY, KRAKEN_SECRET);

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