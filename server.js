const http = require("http");
const { Server } = require("socket.io");
const express = require("express");

const sockets = require("./sockets.js");

const api = express();

api.use(express.json());

const httpServer = http.createServer(api);

const socketServer = new Server(httpServer, { path: "/sms/socket.io" });

const PORT = 4000;

httpServer.listen(PORT);

sockets.listen(socketServer);

api.post("/sms", (req, res) => {
  const { phoneNumber, message } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  socketServer
    .of("/sms-modem")
    .to("modem")
    .emit("send-sms", phoneNumber, message ?? `votre MTAXI code est : #${otp}`);

  res.json(`${otp}`);
});
