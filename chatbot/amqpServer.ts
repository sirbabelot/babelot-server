var amqp = require('amqplib');
var engine = require('./chatEngine.js');
const BROKER_URL = `amqp://rabbitmq:5672`

// Continuously tries to connect to the rabbitMQ broker
function rabbitConnect() {
  return amqp.connect(BROKER_URL)
    .catch((err)=> {
      return rabbitConnect();
    });
}


rabbitConnect().then((connection)=> {
  return connection.createChannel().then((ch)=> {
    console.log('connection established');

    var q = 'amqpServer:Chat';
    ch.assertQueue(q);
    ch.prefetch(1);

    ch.consume(q, function(msg) {
      engine(ch, msg);
    }, { noAck: true });
});