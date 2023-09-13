let optionsCont = document.querySelector(".options-container");
let toolsCont = document.querySelector(".tools-container");
let pencilModifyCont = document.querySelector(".pencil-modify-container");
let eraserModifyCont = document.querySelector(".eraser-modify-container");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let note = document.querySelector(".note");
let upload = document.querySelector(".upload");
let optionsVis = true;
let pencilFlag = false;
let eraserFlag = false;

optionsCont.addEventListener("click",function(e){
    optionsVis = !optionsVis;

    if(optionsVis)
    {
        openTools();
    }else{
        closeTools();
    }
});

function openTools(){
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-xmark");
    toolsCont.style.display = "flex";
}

function closeTools(){
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-xmark");
    iconElem.classList.add("fa-bars");
    toolsCont.style.display = "none";
    pencilModifyCont.style.display = "none";
    eraserModifyCont.style.display = "none";
}

pencil.addEventListener("click",function(e){
    pencilFlag = !pencilFlag;

    if(pencilFlag)
    {
        eraserFlag = false;
        eraserModifyCont.style.display = "none";
        pencilModifyCont.style.display = "block"
    }else{
        pencilModifyCont.style.display = "none";
    }
});

eraser.addEventListener("click",function(e){
    eraserFlag = !eraserFlag;

    if(eraserFlag)
    {
        pencilFlag = false;
        pencilModifyCont.style.display = "none";
        eraserModifyCont.style.display = "flex";
    }else{
        eraserModifyCont.style.display = "none";
    }
});

note.addEventListener("click",function(e){
    let noteTemplateHtml =  `
        <div class="note-header">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-content">
            <textarea spellcheck="false"></textarea>
        </div>
    `;

     createNote(noteTemplateHtml);
});

function handleNoteActions(minimize,remove,noteEle){
    remove.addEventListener("click",function(e){
        noteEle.remove();
    })

    minimize.addEventListener("click",function(e){
        let noteContent = noteEle.querySelector(".note-content");
        let display = getComputedStyle(noteContent).getPropertyValue("display");

        if(display === "none")
        {
            noteContent.style.display = "block";
        }else{
            noteContent.style.display = "none";
        }
    });
}

function handleDragAndDrop(noteEle){
    let noteHeader = noteEle.querySelector(".note-header");
    
    noteHeader.onmousedown = function(event) {

        let shiftX = event.clientX - noteEle.getBoundingClientRect().left;
        let shiftY = event.clientY - noteEle.getBoundingClientRect().top;
      
        noteEle.style.position = 'absolute';
        noteEle.style.zIndex = 1000;
      
        moveAt(event.pageX, event.pageY);
      
        // moves the ball at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
            noteEle.style.left = pageX - shiftX + 'px';
            noteEle.style.top = pageY - shiftY + 'px';
        }
      
        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }
      
        // move the ball on mousemove
        document.addEventListener('mousemove', onMouseMove);
      
        // drop the ball, remove unneeded handlers
        noteEle.onmouseup = function() {
          document.removeEventListener('mousemove', onMouseMove);
          noteHeader.onmouseup = null;
        };
      };
}

upload.addEventListener("click",function(e){
    // Open file explorer
    let input = document.createElement("input");
    input.setAttribute("type","file");
    input.click();

    input.addEventListener("change",function(e){
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let noteTemplateHtml =  `
            <div class="note-header">
                <div class="minimize"></div>
                <div class="remove"></div>
            </div>
            <div class="note-content">
                <img src="${url}"/>
            </div>
        `;

        createNote(noteTemplateHtml);
    });
});

function createNote(noteTemplateHtml)
{
    let noteEle = document.createElement("div");
    noteEle.innerHTML =  noteTemplateHtml;

    noteEle.classList.add("note-container");
    document.body.appendChild(noteEle);

    handleDragAndDrop(noteEle);

    let minimize = noteEle.querySelector(".minimize");
    let remove = noteEle.querySelector(".remove");
    handleNoteActions(minimize,remove,noteEle);
}