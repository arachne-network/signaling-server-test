"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
var path_1 = require("path");
var socket_io_1 = require("socket.io");
var port = 3000;
var streamingRooms = [];
var app = (0, express_1.default)();
var server = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(server);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
function addStreaming(streamerId) {
    var streamingRoom = {
        roomId: "room" + streamerId,
        streamer: streamerId,
    };
    streamingRooms.push(streamingRoom);
}
app.get("/", function (req, res) {
    res.sendFile((0, path_1.join)(__dirname, "index.html"));
});
app.get("/test", function (req, res) {
    res.sendFile((0, path_1.join)(__dirname, "test.html"));
});
app.get("/streamer", function (req, res) {
    res.sendFile((0, path_1.join)(__dirname, "streamer.html"));
});
// roomId를 어떻게 가지고 갈 것인가? parameter로 가지고 가면 될 듯
app.get("/viewer", function (req, res) {
    res.sendFile((0, path_1.join)(__dirname, "viewer.html"));
});
function selectPeer(roomId) {
    // 일단은 streamer에게 쏜다고 하자
    return roomId.substring(4);
}
io.on("connection", function (socket) {
    socket.on("startStream", function () {
        // 해당 socket을 room에 다 넣어야 한다.
        // 일단 이거는 나중에 하고
        addStreaming(socket.id);
    });
    socket.on("joinRoom", function (roomId) {
        // 일단은 streamer와 직접적으로 연결한다.
        // sender와 receiver를 직접 만들어서 메시지에 포함해야 한다.
        var sender = selectPeer(roomId);
        var receiver = socket.id;
        var msg = {
            sender: sender,
            receiver: receiver,
        };
        io.in(sender).emit("makeOffer", msg);
    });
    socket.on("list", function (data, callback) {
        var list = [];
        for (var _i = 0, streamingRooms_1 = streamingRooms; _i < streamingRooms_1.length; _i++) {
            var room = streamingRooms_1[_i];
            list.push(room.roomId);
        }
        callback({
            list: list,
        });
    });
    // callback 함수로 offer를 받았다고 하자. 그럼
    socket.on("getOffer", function (msg) {
        io.in(msg.receiver).emit("makeAnswer", msg);
    });
    socket.on("getAnswer", function (msg) {
        io.in(msg.sender).emit("setAnswer", msg);
    });
    socket.on("getCandidate", function (msg) {
        io.in(msg.sender).emit("setCandidate", msg);
    });
});
server.listen(port, function () {
    console.log("[server]: Serves running at <https://localhost>:".concat(port));
});
