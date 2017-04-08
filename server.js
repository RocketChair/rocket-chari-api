const app = require("express")();
const WebSocket = require("ws");

const wss = new WebSocket.Server({
  perMessageDeflate: false,
  port: 8080
});

wss.on("connection", function(socket) {
  socket.on("message", function(msg) {
    console.log(msg);

    socket.send(msg.toUpperCase());
  });
});

app.listen(3000, () => {
  console.log("listen at port 3000");
});
