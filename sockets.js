const newConnection = (socket) => {
  const userRoomName = socket.uuid;
  console.log("new connection", userRoomName);
  socket.join(userRoomName);
  // socket.emit("send-sms", "00212677231503", "Hello from server");
};

function listen(io) {
  const smsModemNameSpace = io.of("/sms-modem");
  smsModemNameSpace.use((socket, next) => {
    const uuid = socket.handshake.auth.uuid;

    if (!uuid) {
      return next(new Error("invalid uuid"));
    }

    socket.uuid = uuid;
    next();
  });

  smsModemNameSpace.on("connection", (socket) => {
    newConnection(socket);

    socket.on("disconnect", (reason) => {
      console.log(`Client ${socket.uuid} disconnected: ${reason}`);
    });
  });
}

module.exports = {
  listen,
};
