let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = "red";
let pencilWidth = "3";

let pencilColors = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");

let mouseDown = false;

let eraserWidthElem = document.querySelector(".eraser-width");

let eraserWidth = "3";
let eraserColor = "white";

let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

let undoTracker = [];

let redoTracker = [];

// API
let tool = canvas.getContext("2d");

// Apply white background to canvas
tool.fillStyle = 'white';
tool.fillRect(0, 0, canvas.width, canvas.height);

undoTracker.push(canvas.toDataURL());

tool.strokeStyle = pencilColor;
tool.lineWidth = pencilWidth;

canvas.addEventListener("mousedown",function(e){
    mouseDown = true;

    let data = {
        x : e.clientX,
        y: e.clientY,
        color: eraserFlag ? eraserColor : pencilColor,
        width: eraserFlag ? eraserWidth : pencilWidth
    };

    socket.emit("beginPath",data);
});

canvas.addEventListener("mousemove",function(e){
    if(mouseDown)
    {
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : pencilColor,
            width: eraserFlag ? eraserWidth : pencilWidth
        };

        socket.emit("drawStroke",data);
    }
});

canvas.addEventListener("mouseup",function(e){
    mouseDown = false;

    let url = canvas.toDataURL();
    undoTracker.push(url);

    let data = {undoTracker,redoTracker,redraw:false};
    socket.emit("undoRedo",data);
})

function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}

function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();
}

pencilColors.forEach(colorItem => {
    colorItem.addEventListener("click",function(e){
        pencilColor = colorItem.classList[1];
    });
});

pencilWidthElem.addEventListener("change",function(e){
    pencilWidth = pencilWidthElem.value;
});

eraserWidthElem.addEventListener("change",function(e){
    eraserWidth = eraserWidthElem.value;
});

download.addEventListener("click",function(e){
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
});

undo.addEventListener("click",function(e){
    if(undoTracker.length > 1)
    {
        let currState = undoTracker.pop();
        redoTracker.push(currState);
   
        let data = {undoTracker,redoTracker,redraw:true};
        socket.emit("undoRedo",data);
    }
});

redo.addEventListener("click",function(e){
    if(redoTracker.length > 0)
    {
        let nextState = redoTracker.pop();
        undoTracker.push(nextState);
        
        let data = {undoTracker,redoTracker,redraw:true};
        socket.emit("undoRedo",data);
    }
});

function undoRedoCanvas(url){
    let img = new Image();
    img.src = url;

    img.onload = function(e){
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }
}

socket.on("beginPath",function(data){
    beginPath(data);
});

socket.on("drawStroke",function(data){
    drawStroke(data);
});

socket.on("undoRedo",function(data){
    undoTracker = data.undoTracker;
    redoTracker = data.redoTracker;

    if(data.redraw == true)
    {
        let url = undoTracker[undoTracker.length-1];
        undoRedoCanvas(url);
    }
});