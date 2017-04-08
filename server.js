const app = require("express")();
const WebSocket = require("ws");

const PORT_NUMBER = process.env.PORT || 8080;

const wss = new WebSocket.Server({
  perMessageDeflate: false,
  port: PORT_NUMBER
});

wss.on("connection", function(socket) {
  socket.on("message", function(msg) {
    console.log(msg);
    socket.send(msg.toUpperCase());
  });
});

app.listen(PORT, () => {
  console.log("listen at port " + PORT_NUMBER);
});
