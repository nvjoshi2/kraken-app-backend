const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');

const tradeTableListener = async (eventFunction) => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Nvj13130!'
      });

    const instance = new MySQLEvents(connection, {
      startAtEnd: true // to record only the new binary logs, if set to false or you didn'y provide it all the events will be console.logged after you start the app
    });
  
    await instance.start();
  
    instance.addTrigger({
      name: 'monitoring changes to trade_table',
      expression: 'cryptodb.trade_table', // listen to TEST database !!!
      statement: MySQLEvents.STATEMENTS.ALL, // you can choose only insert for example MySQLEvents.STATEMENTS.INSERT, but here we are choosing everything
      onEvent: e => {
        eventFunction()
        console.log(e);
        console.log('event happens')
        spinner.succeed('EVENT');
        spinner.start();
      }
    });
  
    instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
  };

  module.exports = tradeTableListener;