var amqp = require('amqplib/callback_api');

module.exports = function(message, done) {

  amqp.connect(`amqp://rabbitmq:5672`, (err, connection) => {

    connection.createChannel(function(err, ch) {
        ch.assertQueue('', { exclusive: true }, function(err, q) {
          var corr = Math.random().toString();

          ch.consume(q.queue, function(msg) {
            if (msg.properties.correlationId == corr) {
              var messagesToSend = JSON.parse(msg.content.toString());

              messagesToSend.forEach((message)=> {
                done(message);
              });

            }
          }, { noAck: true });

          ch.sendToQueue('amqpServer:Chat',
            new Buffer(message), {
              correlationId: corr,
              replyTo: q.queue
            });
        });
      });
    });

}

