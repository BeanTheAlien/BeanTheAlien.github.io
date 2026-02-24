const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cluster = require("cluster");
const os = require("os");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");

if(cluster.isPrimary) {
    for(let i = 0; i < os.availableParallelism(); i++) {
        cluster.fork({
            PORT: 3000 + i
        });
    }
    return setupPrimary();
}

async function main() {
    const app = express();
    // connectionStateRecovery: {} - save and restore after dis-re
    const server = http.createServer(app);
    const io = new Server(server, {
        connectionStateRecovery: {},
        adapter: createAdapter()
    });
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
    server.listen(process.env.PORT, () => {
        console.log("Listening on 3000.");
    });
}
main();