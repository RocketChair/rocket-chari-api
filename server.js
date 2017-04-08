const http = require("http");
const port_number = process.env.PORT || 8880;
const WSS = require("ws").Server;
const server = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Request-Method", "*");
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  response.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    response.writeHead(200);
    response.end();
    return;
  }
  console.log("request");
  response.end("Hello");
});
server.listen(port_number);

// Start the server
const wss = new WSS({
  server: server
});

// When a connection is established
wss.on("connection", socket => {
  console.log("Opened connection ");

  // Send data back to the client
  const json = JSON.stringify({
    message: "Gotcha"
  });
  socket.send(json);

  // When data is received
  socket.on("message", message => {
    socket.send(
      JSON.stringify({
        message: message
      })
    );
    console.log("Received: " + message);
  });

  // The connection was closed
  socket.on("close", () => {
    console.log("Closed Connection ");
  });
});

// Every three seconds broadcast "{ message: 'Hello hello!' }" to all connected clients
const broadcast = () => {
  const json = JSON.stringify({
    message: "Hello from broadcast"
  });

  // wss.clients is an array of all connected clients
  wss.clients.forEach(function each(client) {
    client.send(json);
    console.log("Sent: " + json);
  });
};

setInterval(broadcast, 30000);

console.log("App started at port " + port_number);
