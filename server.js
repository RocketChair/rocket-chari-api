const http = require("http");
const port_number = process.env.PORT || 8880;
const WSS = require("ws").Server;
const PhoneAction = require("./actions/phoneAction");

const server = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Request-Method", "*");
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  response.setHeader("Access-Control-Allow-Headers", "*");
  if (request.method === "OPTIONS") {
    response.writeHead(200);
    response.end();
    return;
  }
  // console.log("request");
  // response.end("Hello2");
});
server.listen(port_number);

const config = require("./config");
const alerts = require("./alerts");

// Start the server
const wss = new WSS({
  server: server
});

const broadcastMessage = (wss, message) => {
  wss.clients.forEach(client => {
    client.send(message);
  });
};
// When a connection is established
wss.on("connection", socket => {
  console.log("Opened connection ");
  // When data is received
  const phoneAction = new PhoneAction(socket);

  socket.on("message", message => {
    let sittingTimer = {
      getTime: () => {
        return 50 * 60;
      }
    };
    let lastAlertTime = new Date().getTime();

    try {
      //== Parse data from string
      parsedMessage = JSON.parse(message);
      console.log(`Message received: [type: ${parsedMessage.type}]`);
      broadcastMessage(wss, message);
      // console.log(`type: ${parsedMessage.type}`)
      // console.log(`source: ${parsedMessage.source}`)

      if (parsedMessage.type === "data" && parsedMessage.source === "iot") {
        // console.log('Iot messaged')
        //== Add sitting time if sitting

        if (parsedMessage.data.rocketChair) {
          //== Sitting, increase timer
          console.log("Increase sitting");
          // sittingTimer.start()
          // notSittingTimer.stop()
        } else {
          //== Someone is not sitting
          console.log("Increase notsitting");
          // sittingTimer.stop();
          // notSittingTimer.start();
        }

        if (sittingTimer.getTime() > config.MAX_SITTING_TIME) {
          let actualTime = new Date().getTime();

          if (actualTime - lastAlertTime < config.ALERT_TIMEOUT) {
            // if(((new Date()).getTime() - lastAlertSent) < config.ALERT_TIMEOUT) {
            console.log("Alert wykurwił");
            console.log(
              actualTime - lastAlertSent + " < " + config.ALERT_TIMEOUT
            );
            socket.send(JSON.stringify(alerts.GET_UP_FROM_CHAIR));
            lastAlertSent = new Date().getTime();
          } else {
            console.log("Alert niewykurwił");
          }
        }
      }

      if (parsedMessage.type === "data" && parsedMessage.source === "phone") {
        phoneAction.setState(message.data.moving);
      }
    } catch (err) {
      socket.send(
        JSON.stringify({
          type: "message",
          message: JSON.stringify(err)
        })
      );
    }
  });

  // The connection was closed
  socket.on("close", () => {
    console.log("Closed Connection ");
  });
});

// Every three seconds broadcast "{ message: 'Hello hello!' }" to all connected clients
const broadcast = () => {
  const json = JSON.stringify({
    message: "PING"
  });

  // wss.clients is an array of all connected clients
  wss.clients.forEach(function each(client) {
    client.send(json);
    console.log("Sent: " + json);
  });
};

setInterval(broadcast, 30000);

console.log("App started at port " + port_number);
