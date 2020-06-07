const sqlApi = require('./sql-api');
const connectSql = sqlApi.connectSql;
const getTrades = sqlApi.getTrades;
const addTrade = sqlApi.addTrade;
const deleteTrade = sqlApi.deleteTrade;
const getTradeProfits = sqlApi.getTradeProfits;
const addTradeProfits = sqlApi.addTradeProfits;

connectSql();


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
app.use(bodyParser.json());
app.use(cors())
const PORT = 5000;

// CONTINOUSLY ADD TRADE PROFITS EVERY MINUTE


// SET UP ROUTER


// FUNCTIONALITIES
// get trades, add trade, remove trade, 
// get trade profits

app.get('/api/trades', (req, res) => {
    console.log('GET /api/trades hit');
    getTrades((trades) => res.send(trades));
})

app.post('/api/trades', (req, res) => {
    console.log('POST /api/trades hit');
    addTrade(req.body.ticker, req.body.quantity, (result) => res.send(result));
})

app.delete('/api/trades', (req, res) => {
    console.log('POST /api/trades hit');
    deleteTrade(req.body.tradeId, (result) => res.send(result))
})

app.get('/api/tradeProfits/:tradeId', (req, res) => {
    console.log('GET /api/tradeProfits hit');
    getTradeProfits(req.params.tradeId, (tradeProfits) => res.send(tradeProfits))

})





app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
})

