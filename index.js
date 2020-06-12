const sqlApi = require('./sql-api');
const connectSql = sqlApi.connectSql;
const getTrades = sqlApi.getTrades;
const addTrade = sqlApi.addTrade;
const deleteTrade = sqlApi.deleteTrade;
const getTradeProfits = sqlApi.getTradeProfits;
const addTradeProfits = sqlApi.addTradeProfits;

connectSql();

const tickerMap = require('./tickerMap');


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
app.use(bodyParser.json());
app.use(cors())
const PORT = 5000;

// CONTINOUSLY ADD TRADE PROFITS EVERY 5 MINUTES
var minutes = 5;
var interval = minutes * 60 * 1000;
setInterval(() => {
    addTradeProfits()
}, interval)


// ROUTER

app.get('/api/trades', (req, res) => {
    console.log('GET /api/trades hit');
    getTrades((trades) => res.send(trades));
})

app.post('/api/trades', (req, res) => {
    console.log('POST /api/trades hit');
    addTrade(tickerMap[req.body.ticker], req.body.quantity, (result) => res.send(result));
})

app.delete('/api/trades/:tradeId', (req, res) => {
    console.log('POST /api/trades hit');
    deleteTrade(req.params.tradeId, (result) => res.send(result))
})

app.get('/api/tradeProfits/:tradeId', (req, res) => {
    console.log('GET /api/tradeProfits hit');
    getTradeProfits(req.params.tradeId, (tradeProfits) => res.send(tradeProfits))

})





app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
})

