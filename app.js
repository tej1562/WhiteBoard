const express = require("express");
const socket = require("socket.io");

const app = express(); // Initialize server

app.use(express.static("./public"));

const port = process.env.PORT || 3000;

const server = app.listen(port,function(){
    console.log("Server running on port",port);
});

const io = socket(server);

io.on("connection",function(socket){
    console.log("Socket connection established");

    socket.on("beginPath",function(data){
        io.sockets.emit("beginPath",data);
    });

    socket.on("drawStroke",function(data){
        io.sockets.emit("drawStroke",data);
    });

    socket.on("undoRedo",function(data){
        io.sockets.emit("undoRedo",data);
    });

    socket.on("undoRedo",function(data){
        io.sockets.emit("undoRedo",data);
    });
});