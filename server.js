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
  response.end("Hello from web socket server");
});
server.listen(port_number);

const config = require("./config");
const alerts = require("./alerts");

const AlertAction = require("./actions/alertAction");

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
  const alertAction = new AlertAction(socket, wss, broadcastMessage);

  socket.on("message", message => {
    let sittingTimer = {
      getTime: () => {
        return 50 * 60;
      }
    };
    let lastAlertTime = new Date().getTime();

    try {
    // == Parse data from string
    parsedMessage = JSON.parse(message);
    console.log(`Message received: [type: ${parsedMessage.type}]`);
    console.log(`Message source: [type: ${parsedMessage.source}]`);
    console.log(`Message data: [type: ${parsedMessage.data}]`);

    broadcastMessage(wss, message);

    if (parsedMessage.type === "data" && parsedMessage.source === "iot") {
      alertAction.parseData(parsedMessage);
    }

    if (parsedMessage.type === "data" && parsedMessage.source === "phone") {
      console.log("Phone 11111", parsedMessage.data.moving);
      phoneAction.setState(parsedMessage.data.moving);
    }
    // } catch (err) {
    //   socket.send(
    //     JSON.stringify({
    //       type: "message",
    //       message: JSON.stringify(err)
    //     })
    //   );
    // }
    } catch(err) {
      console.log('Ni chuja, error')
    }  
});

  // The connection was closed
  socket.on("close", () => {
    console.log("Closed Connection ");
  });
});

// Every three seconds broadcast "{ message: 'Hello hello!' }" to all connected clients
// const broadcast = () => {
//   const json = JSON.stringify({
//     message: "PING"
//   });

  // wss.clients is an array of all connected clients
//   wss.clients.forEach(function each(client) {
//     client.send(json);
//     console.log("Sent: " + json);
//   });
// };

// setInterval(broadcast, 10000);

console.log("App started at port " + port_number);
