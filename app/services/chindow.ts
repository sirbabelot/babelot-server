var amqp = require('amqplib/callback_api');

module.exports = function(businessId, done) {
  // connect to the outside docker containers using the env variables docker creates

  amqp.connect(`amqp://${process.env.AMQ_PORT_5672_TCP_ADDR}:${process.env.AMQ_PORT_5672_TCP_PORT}`, (err, conn)=> {
    if (err) {
      return console.log(err);
    }

    conn.createChannel((err, ch)=> {
      ch.assertQueue('', { exclusive: true }, (err, q)=> {
        var corr = Math.random().toString();
        var msgToSend = businessId;

        ch.consume(q.queue, (msg) => {
          if (msg.properties.correlationId == corr) {
            done(msg.content.toString());
            conn.close();
          }
        }, { noAck: true });

        ch.sendToQueue('rpc_queue', new Buffer(msgToSend), {
          correlationId: corr,
          replyTo: q.queue
        });

      });
    });
  });
};