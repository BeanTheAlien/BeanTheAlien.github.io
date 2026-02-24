const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
// connectionStateRecovery: {} - save and restore after dis-re
const server = http.createServer(app);
const io = new Server(server);
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});
io.on("connection", (socket) => {
    console.log(`User connected. (at ${new Date().toISOString()})`);
    socket.on("disconnect", () => {
        console.log(`User disconnected. (at ${new Date().toISOString()})`);
    });
    // socket.on(MESSAGE, HANDLE(DATA?))
    // io.to(PARTY)
    // io.except(PARTY)
    // socket.join(PARTY)
    // socket.leave(PARTY)

    // CLIENT
    // socket.connect()
    // socket.disconnect()
});
// io.emit(MESSAGE, DATA) - send to all
// socket.broadcast.emit(MESSAGE, DATA) - send to all but this socket
server.listen(3000, () => {
    console.log("Listening on 3000.");
});