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

const httpServer = http.createServer(app); // http서버
const wsServer = SocketIO(httpServer); // SocketIO 서버 불러옴

const handleListen = () => console.log('Listening on http://localhost:3000');
httpServer.listen(3000, handleListen);

/*********************************** SocketIO 버전 ****************************

const httpServer = http.createServer(app); // http서버
const wsServer = SocketIO(httpServer); // SocketIO 서버 불러옴

function publicRooms(){
    const {
        sockets: { // wsServer.sockets.adapter에서 sids, rooms 가져오기
            adapter: {sids, rooms},
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if ( sids.get(key) === undefined ) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size; // ?.size는 size가 있을 수도 있고 없을 수도 있다는 의미
}

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(wsServer.sockets.adapter);
        console.log(`Socket Event:${event}`);
    });

    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName); // room을 만들기
        done();// **app.js 에 있는 showRoom 메소드를 작동시킨다.
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName)); // 해당 방에 존재하는 모든이들에게 메시지 전송
        wsServer.sockets.emit("room_change", publicRooms()); // 모든이에게 메시지 전송
    });
    
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => 
            socket.to(room).emit("bye", socket.nickname, countRoom(room)-1)
        );
    });

    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    });

    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
        done();
    });

    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});
*/

/*********************************** Websocket 버전 ****************************
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