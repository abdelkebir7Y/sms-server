const http = require("http");
const io = require("socket.io");

const express = require("express");

const api = express();

api.use(express.json());

const httpServer = http.createServer(api);

const socketServer = io(httpServer);

const sockets = require("./sockets");

const PORT = 4000;

httpServer.listen(PORT);

sockets.listen(socketServer);

api.post("/sms", (req, res) => {
  const { phoneNumber, message } = req.body;

  console.log("sms", phoneNumber, message);

  socketServer
    .of("/sms-modem")
    .to("modem")
    .emit("send-sms", phoneNumber, message);

  res.send("ok");
});
