const http = require("http");
const port_number = process.env.PORT || 8880;
const WSS = require("ws").Server;
const PhoneAction = require("./actions/phoneAction");
// const Stoper = require("./stoper");
// const stoper = new Stoper();

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

const { parseAction, parsePhoneData } = require("./actions");

// Start the server
const wss = new WSS({
  server: server
});

const broadcastMessage = (wss, message) => {
  wss.clients.forEach(client => {
    client.send(message);
  });
};
const phoneAction = new PhoneAction({});
// When a connection is established
wss.on("connection", socket => {
  console.log("Opened connection ");
  const phoneAction = new PhoneAction(wss);
  let actionsHistory = ["STITIN", "SITING", "WALKING", "RUNNING", "SITIG"];

  // Send data back to the client
  const json = JSON.stringify({
    message: "Gotcha"
  });
  socket.send(json);

  // When data is received
  socket.on("message", message => {
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
      console.log(`Message received: [type: ${parsedMessage.type}`);
      broadcastMessage(wss, message);

      if (message.type === "data" && message.source === "iot") {
      }

      if (message.type === "data" && message.source === "phone") {
        phoneAction.setState(message.data.moving);
      }
    } catch (err) {
      socket.send(
        JSON.stringify({
          type: "message",
          message: "Error message"
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
