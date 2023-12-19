import http from "http";
import { Server } from "socket.io";
import express from "express";

import sockets from "./sockets.js";

const api = express();

api.use(express.json());

const httpServer = http.createServer(api);

const socketServer = new Server(httpServer, { path: "/sms/socket.io" });

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
