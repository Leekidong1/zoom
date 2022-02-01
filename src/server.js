import http from "http";
//import WebSocket from "ws";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');

const httpServer = http.createServer(app); // http서버
const wsServer = SocketIO(httpServer); // SocketIO 서버 불러옴

wsServer.on("connection", (socket) => {
    socket.on("enter_room", (roomName, done) => {
        console.log(roomName);
        setTimeout(() => {
            done("hello from the backend");
        }, 5000);
    });
});

/*
const wss = new WebSocket.Server({ server }); // 1. Websocket 서버생성
const sockets = [];
wss.on("connection", (socket) => { // 2. connection 이벤트 listen
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser");
    socket.on("close", () => console.log("Disconected from Client"));
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);

        switch(message.type){
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload.toString('utf-8')}`)); // 다른 브라우저로 메세진 전달
            case "nickname":
                socket["nickname"] = message.payload;
        }
    });
});
*/
httpServer.listen(3000, handleListen);