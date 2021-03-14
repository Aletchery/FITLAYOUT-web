const JsonLdParser = require("jsonld-streaming-parser").JsonLdParser;
const fs = require("fs");

var boxesId=[];
var boxes=[];
var artID=[];
var foundID = false;
var base = "http://lotrando.fit.vutbr.cz:8401/service/artifact/item/r:";
var artifact = "http://lotrando.fit.vutbr.cz:8400/service/artifact";
var pageWidth;
var pageHeight;
var tree=[];
var boxTree=[];
var target;
var target_element;
var last_active;


/*var box={
    id: "",
    backgroundColor: "",
    posX: "",
    posY: "",
    widht: "",
    height: "",
    belongsTo:"",
    color:"",
    documentOrder:"",
    fontFamily:"",
    fontSize:"",
    fontStyle:"",
    fontWeight:"",
    hasAttribute:"",
    htmlTagName:"",
    lineThrough:"",
    underline:"",
    visualHeight:"",
    visualWidth:"",
    visualX:"",
    visualY:"",
    type:""
}*/



function main(){

    position();

    boxes.sort(function(a, b){
        return a.documentOrder - b.documentOrder;
    })
    
    const view = document.getElementById("view");
    view.style.width = pageWidth + "px";
    view.style.height = pageHeight + "px";
     
     //console.log(boxesId);
     for(var i = 0; i<boxes.length;i++){
            
            const d = document.createElement('box-element');
            
            d.innerHTML = `
            <box-element id="${boxes[i].id}" style="position: absolute; top: ${boxes[i].posY}px; left: ${ boxes[i].posX }px; width: ${boxes[i].widht}px;
            height: ${ boxes[i].height }px; background-color:#${ boxes[i].backgroundColor }; color:#${boxes[i].color}; font-size:${
            boxes[i].fontSize }px; font-weight: ${ boxes[i].fontWeight}; font-family:${ boxes[i].fontFamily}; font-style: ${boxes[i].fontStyle};
             border-left:${ boxes[i].borderL.borderWidth}px ${ boxes[i].borderL.borderStyle } #${ boxes[i].borderL.borderColor };
             border-right:${ boxes[i].borderR.borderWidth}px ${ boxes[i].borderR.borderStyle } #${ boxes[i].borderR.borderColor };
             border-top:${ boxes[i].borderT.borderWidth}px ${ boxes[i].borderT.borderStyle } #${ boxes[i].borderT.borderColor };
             border-bottom:${ boxes[i].borderB.borderWidth}px ${ boxes[i].borderB.borderStyle } #${ boxes[i].borderB.borderColor };">
            ${ boxes[i].text }
            </box-element>
             `;
             view.appendChild(d);
            
            
         //    }
       //  }
        
     }
     boxTreeMaker();
     box_list(boxTree);
     view.classList.toggle("visibility");
     view.addEventListener("click", function(event){
         console.log(event.target.id + "_node");
         clickFunction(event.target.id + "_node", event.target.id);
     })

}

function position(){
    boxes.forEach(function(box){
        if(result = boxes.find( ({ id }) => id === box.boundsid)){
            box.posX = result.posX;
            box.posY = result.posY;
            box.widht = result.widht;
            box.height = result.height;
            
            const index = boxes.indexOf(result);
            if (index > -1) {
              boxes.splice(index, 1);
            }
        }
    })
}

function artifacts(data){

    var predicate = data.predicate.value;
    var subject = data.subject.value;
    
    var lastIndexS = subject.lastIndexOf('/')+1;
    var id = subject.substr(lastIndexS,subject.lenght);

    if(predicate.includes("hasParentArtifact")){
        var object = data.object.value;
        
        var lastIndexO = object.lastIndexOf('/')+1;
        var parentId = object.substr(lastIndexO,object.lenght);

        var found = false;
        artID.forEach(function(art){
            if(art.id == id){
                found = true;
                art.parentID = parentId;
            }
        })
        
        
    if(found == false){
        var art={
            id: id,
            parentID: parentId
        }
        artID.push(art);
        }
    }
    else{
        var found = false;
        artID.forEach(function(art){
            if(art.id == id){
                found = true;
            }
        })
        if(found == false){
            var art={
                id: id,
                parentID: null
            }
            
            artID.push(art);
        }
    }
}
function box_list(boxes_list){  
    const box_ul = document.getElementById("myUL2");

    

    boxes_list.forEach(function(node){
        /*li.addEventListener("click",function(event){
            target_element = document.getElementById(event.target.id);
            
        });*/

        var li = document.createElement('li');
       target_element = li;
       
        box_ul.appendChild(li);

        if(node.kids){
            var span = document.createElement('span');
            span.setAttribute("class", "caret");
            span.setAttribute("id",node.id+"_node");
            span.innerHTML = node.id;
            li.appendChild(span);

            var ul2=document.createElement('ul');
            ul2.setAttribute("class", "nested")
            li.appendChild(ul2);
            node.kids.forEach(function(kid){
                var kidLi = document.createElement('li');
                kidLi.setAttribute("id",kid+"_node");
                kidLi.innerHTML = kid;
                ul2.appendChild(kidLi);
            })
            
        }
        else{
            var span = document.createElement('span');
            span.innerHTML = node.id;
            li.appendChild(span);
        }

    });

    box_ul.addEventListener("click", function(event) {    
            clickFunction(event.target.id,event.target.innerHTML);  
    });
    var toggler = document.getElementsByClassName("caret");
    var i;

    for (i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
        });
    } 
      
}


function clickFunction(listid,boxid){       
            target_element.classList.remove("highlight");
            target_element = document.getElementById(listid);
            target_element.classList.add("highlight");  

            showBoxInfo(boxid);
}


function list(){
    treeMaker();
    const list = document.getElementById("list");
    

    var ul=document.createElement('ul');
    ul.setAttribute("id", "myUL")
    
    list.appendChild(ul);
    tree.forEach(function(node){
        var li = document.createElement('li');
        last_active = li;
        ul.appendChild(li);
        if(node.kids[0]){
            var span = document.createElement('span');
            span.setAttribute("class", "caret arts");
            span.innerHTML = node.id;
            li.appendChild(span);
        }
        else{
            var span = document.createElement('span');
            span.innerHTML = node.id;
            li.appendChild(span);
        }

        
        
        if(node.kids[0]){ 
            var ul2=document.createElement('ul');
            ul2.setAttribute("class", "nested arts")
            li.appendChild(ul2);
            node.kids.forEach(function(kid){
                var kidLi = document.createElement('li');
                kidLi.innerHTML = kid;
                ul2.appendChild(kidLi);
        });
        }
        
    });
    ul.addEventListener("click", function(event) {
    last_active.classList.remove("highlight");
    last_active = event.target;
    event.target.classList.add("highlight");
    target = event.target.innerHTML; 
    boxes = [];
    boxTree = [];
    //console.log(boxes);
    document.getElementById("bottom").innerHTML = "";
    document.getElementById("myUL2").innerHTML = "";
    document.getElementById("view").innerHTML = "";
    document.getElementById("view").classList.toggle("visibility");
    
    document.getElementById("loading").style.visibility = "visible";
    getArt(target);
    });
    var toggler = document.getElementsByClassName("caret");
    var i;

    for (i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });
}
    
}

function getArt(target){
const artParser = new JsonLdParser();
artParser
  .on('data', saveObject)
  .on('error', console.error)
  .on('end', main);

url = base + target;

artID.forEach(function(art){
    
    if(art.id == target && art.parentID != null){
        url = base + art.parentID
    }
})
console.log(url);

fetch(url)
.then(function(body){
    return body.text();
  }).then(function(data) {
    
    artParser.write(data);
    artParser.end();
  });
}

function showBoxInfo(id){

    console.log(id);
    var foundBox;
    boxes.forEach(function(box){
        if(box.id == id){
            foundBox = box;
        }
    })
        //console.log(foundBox);
        var window = document.getElementById("bottom");
        window.innerHTML = `
        <table>
        <tr>
          <th>Attribute</th>
          <th>Value</th> 
        </tr>
        <tr>
          <td>ID</td>
          <td>${foundBox.id}</td>
        </tr>
        <tr>
          <td>Width</td>
          <td>${foundBox.widht}px</td>
        </tr>
        <tr>
          <td>Height</td>
          <td>${foundBox.height}px</td>
        </tr>
        <tr>
          <td>PosX</td>
          <td>${foundBox.posX}px</td>
        </tr>
        <tr>
          <td>PosY</td>
          <td>${foundBox.posY}px</td>
        </tr>
        <tr>
          <td>Color</td>
          <td>#${foundBox.color}</td>
        </tr>
        <tr>
          <td>Font family</td>
          <td>${foundBox.fontFamily}</td>
        </tr>
        <tr>
          <td>Font weight</td>
          <td>${foundBox.fontWeight}</td>
        </tr>
        <tr>
          <td>Font size</td>
          <td>${foundBox.fontSize}</td>
        </tr>
        <tr>
          <td>Font style</td>
          <td>${foundBox.fontStyle}</td>
        </tr>
        <tr>
          <td>Background color</td>
          <td>#${foundBox.backgroundColor}</td>
        </tr>
        <tr>
          <td>Text</td>
          <td>${foundBox.text}</td>
        </tr>
        <tr>
          <td>Underline</td>
          <td>${foundBox.underLine}</td>
        </tr>
        <tr>
          <td>Line-trough</td>
          <td>${foundBox.lineThrough}</td>
        </tr>
        <tr>
          <td>Visual height</td>
          <td>${foundBox.visualHeight}</td>
        </tr>
        <tr>
          <td>Visual width</td>
          <td>${foundBox.visualWidth}</td>
        </tr>
        <tr>
          <td>Visual X</td>
          <td>${foundBox.visualX}</td>
        </tr>
        <tr>
          <td>Visual Y</td>
          <td>${foundBox.visualY}</td>
        </tr>
        <tr>
          <td>Type</td>
          <td>${foundBox.type}</td>
        </tr>
        <tr>
          <td>Border left</td>
          <td>${foundBox.borderL.borderWidth}px ${foundBox.borderL.borderStyle} ${foundBox.borderL.borderColor}</td>
        </tr>
        <tr>
          <td>Border top</td>
          <td>${foundBox.borderT.borderWidth}px ${foundBox.borderT.borderStyle} ${foundBox.borderT.borderColor}</td>
        </tr>
        <tr>
          <td>Border right</td>
          <td>${foundBox.borderR.borderWidth}px ${foundBox.borderR.borderStyle} ${foundBox.borderR.borderColor}</td>
        </tr>
        <tr>
          <td>Border bottom</td>
          <td>${foundBox.borderB.borderWidth}px ${foundBox.borderB.borderStyle} ${foundBox.borderB.borderColor}</td>
        </tr>
       
      </table>`
}

function boxTreeMaker(){
    var result;
    boxes.forEach(function(box){
    if(box.type == "Box"){
        if(box.isChildOf){
          if(result = boxTree.find( ({ id }) => id === box.isChildOf)){
                result.kids.push(box.id);
          }
          else{
              var node = {
              id: box.isChildOf,
              kids:[box.id],
            }
            boxTree.push(node);
          }
        }
        else if(!box.isChildOf){
            if(result = boxTree.find( ({ id }) => id === box.id)){
                return;
          }
          else{
              var node = {
              id: box.id,
              kids:[],
            }
            boxTree.push(node);
          }
        }
        }
     }) 
    console.log(boxTree);
    }
      


function treeMaker(){
    
    for(var i=0; i<artID.length; i++){
        
        if(!artID[i].parentID){
            //console.log(artID[i]);
            var parent={
                id: artID[i].id,
                kids: []
            }
            for (var j=0; j<artID.length; j++){
                if(artID[j].parentID){
                    if(artID[j].parentID == artID[i].id){
                        parent.kids.push(artID[j].id);
                    }
                }
            }
            tree.push(parent);
    }
    
}
console.log(tree);
}

function saveObject(data){
    //console.log(data);
    
    var object = data.object.value;

    if(object.includes('width=')){
  
    pageWidth = object.substr(object.indexOf('width=')+6, object.lenght);
    pageWidth = pageWidth.substr(0,pageWidth.indexOf(' '));
    
    
    pageHeight = object.substr(object.indexOf('height=')+7, object.lenght);
    pageHeight = pageHeight.substr(0,pageHeight.indexOf(' '));
    
    }
    var lastIndexO = object.lastIndexOf('#')+1;
    var value = object.substr(lastIndexO,object.lenght);
   

    var subject = data.subject.value;
    var lastIndexS = subject.lastIndexOf('/')+1;
    var id = subject.substr(lastIndexS,subject.lenght);

    var borderS = "";

    if(id.includes("Btop")){
        id = id.replace('Btop','');
        borderS = "top";
    }
    if(id.includes("Bbottom")){
        id = id.replace('Bbottom','');
        borderS = "bottom";
    }
    if(id.includes("Bleft")){
        id = id.replace('Bleft','');
        borderS = "left";
    }
    if(id.includes("Bright")){
        id = id.replace('Bright','');
        borderS = "right";
    }

    if(value== "Box"){
        boxesId.push(id);
    }

    var predicate = data.predicate.value;
    var lastIndexP = predicate.lastIndexOf('#')+1;
    var type = predicate.substr(lastIndexP,predicate.lenght);

        for(var i = 0; i<boxes.length;i++){
            
            if(id==boxes[i].id){
                foundID = true;
                
                    if(borderS=="top"){
                    switch (type) {
                    case "borderColor": 
                        boxes[i].borderT.borderColor = value;
                        break;
                    case "borderStyle": 
                        boxes[i].borderT.borderStyle = value;
                        break;
                    case "borderWidth":
                        boxes[i].borderT.borderWidth = value;
                        break;
                    default:
                        break;
                        }
                    }
                    else if(borderS=="left"){
                    switch (type) {
                        case "borderColor": 
                        boxes[i].borderL.borderColor = value;
                        break;
                    case "borderStyle": 
                        boxes[i].borderL.borderStyle = value;
                        break;
                    case "borderWidth":
                        boxes[i].borderL.borderWidth = value;
                        break;
                    default:
                        break;
                        }
                    }
                    else if(borderS=="bottom"){
                    switch (type) {
                        case "borderColor": 
                        boxes[i].borderB.borderColor = value;
                        break;
                    case "borderStyle": 
                        boxes[i].borderB.borderStyle = value;
                        break;
                    case "borderWidth":
                        boxes[i].borderB.borderWidth = value;
                        break;
                    default:
                        break;
                        }
                    }
                    else if(borderS=="right"){
                    switch (type) {
                        case "borderColor": 
                        boxes[i].borderR.borderColor = value;
                        break;
                    case "borderStyle": 
                        boxes[i].borderR.borderStyle = value;
                        break;
                    case "borderWidth":
                        boxes[i].borderR.borderWidth = value;
                        break;
                    default:
                        break;
                        }
                    }
               
                
                switch (type) {
                    case "bounds":
                        boxes[i].boundsid = target + "#" + value;
                        break;
                    case "backgroundColor":
                        boxes[i].backgroundColor = value;                  
                        break;
                    case "positionX":
                        boxes[i].posX = value;                      
                        break;

                    case "positionY":
                        boxes[i].posY = value;
                        break;

                    case "width":
                        boxes[i].widht = value; 
                        break;

                    case "height":
                        boxes[i].height = value;
                        break;

                    case "belongsTo":
                        boxes[i].belongsTo = value;
                        break;
                    
                    case "color":
                        boxes[i].color = value;
                        break;
                    
                    case "documentOrder":
                        boxes[i].documentOrder = value;
                        break;    
                    
                    case "fontFamily":
                        boxes[i].fontFamily = value;
                        break;

                    case "fontSize":
                        boxes[i].fontSize = value;
                        break;

                    case "fontStyle":
                        boxes[i].fontStyle = value;
                        break;

                    case "fontWeight":
                        if(value > 0,5){
                            boxes[i].fontWeight = "bold";
                        }
                        else{
                            boxes[i].fontWeight = "normal";
                        }
                        
                        break;

                    case "hasAttribute":
                        boxes[i].hasAttribute = value;
                        break;

                    case "htmlTagName":
                        boxes[i].htmlTagName = value;
                        break;
                    
                    case "lineTrough":
                        boxes[i].lineTrough = value;
                        break;

                    case "underLine":
                        boxes[i].underLine = value;
                        break;

                    case "visualHeight":
                        boxes[i].visualHeight = value;
                        break;

                    case "visualWidth":
                        boxes[i].visualWidth = value;
                        break;

                    case "visualX":
                        boxes[i].visualX = value;
                        break;

                    case "visualY":
                        boxes[i].visualY = value;
                        break;

                    case "type":
                        boxes[i].type = value;
                        break;

                    case "isChildOf":
                        boxes[i].isChildOf = target + "#" + value;
                        break;
                    
                    case "hasText":
                        boxes[i].text = value;
                        break;

                    default:
                        break;
                }
            }
        }

        if(foundID == false){
            var O ={id: id,
                    boundsid: "",
                    backgroundColor: "none",
                    posX: "0",
                    posY: "0",
                    widht: "0",
                    height: "0",
                    belongsTo:"",
                    color:"",
                    documentOrder:"",
                    fontFamily:"",
                    fontSize:"",
                    fontStyle:"",
                    fontWeight:"",
                    hasAttribute:"",
                    htmlTagName:"",
                    lineThrough:"none",
                    underLine:"none",
                    visualHeight:"",
                    visualWidth:"",
                    visualX:"",
                    visualY:"",
                    type:"",
                    isChildOf: null,
                    text:"",
                    borderL : 
                    {
                    borderColor:"",
                    borderWidth:"0",
                    borderStyle:""},
                    borderR : 
                    {
                    borderColor:"",
                    borderWidth:"0",
                    borderStyle:""},
                    borderT : 
                    {
                    borderColor:"",
                    borderWidth:"0",
                    borderStyle:""},
                    borderB : 
                    {
                    borderColor:"",
                    borderWidth:"0",
                    borderStyle:""}
                    }

                    if(borderS){
                        O.border.side=borderS;
                        switch (type) {
                            case "borderColor": 
                            O.border.borderColor = value;
                            break;
                        case "borderStyle": 
                            O.border.borderStyle = value;
                            break;
                        case "borderWidth":
                            O.border.borderWidth = value;
                            break;
                        default:
                            break;
                        }
                    }

            switch (type) {
                case "backgroundColor":
                    O.backgroundColor = value;                  
                    break;

                case "positionX":
                    O.posX = value;                      
                    break;

                case "positionY":
                    O.posY = value;
                    break;

                case "width":
                    O.widht = value; 
                    break;

                case "height":
                    O.height = value;
                    break;

                case "belongsTo":
                    O.belongsTo = value;
                    break;
                
                case "color":
                    O.color = value;
                    break;
                
                case "documentOrder":
                    O.documentOrder = value;
                    break;    
                
                case "fontFamily":
                    O.fontFamily = value;
                    break;

                case "fontSize":
                    O.fontSize = value;
                    break;

                case "fontStyle":
                    O.fontStyle = value;
                    break;

                case "fontWeight":
                    O.fontWeight = value;
                    break;

                case "hasAttribute":
                    O.hasAttribute = value;
                    break;

                case "htmlTagName":
                    O.htmlTagName = value;
                    break;
                
                case "lineTrough":
                    O.lineTrough = value;
                    break;

                case "underLine":
                    O.underLine = value;
                    break;

                case "visualHeight":
                    O.visualHeight = value;
                    break;

                case "visualWidth":
                    O.visualWidth = value;
                    break;

                case "visualX":
                    O.visualX = value;
                    break;

                case "visualY":
                    O.visualY = value;
                    break;

                case "type":
                    O.type = value;
                    break;

                case "isChildOf":
                    O.type = value;
                    break;
                case "hasText":
                    O.text = value;
                    break;
                

                default:
                    break;
            }
                boxes.push(O);
        }

        foundID = false;
}


const myParser = new JsonLdParser();

myParser
  .on('data', artifacts)
  .on('error', console.error)
  .on('end', list);


fetch(artifact)
.then(function(body){
    return body.text();
  }).then(function(data) {
    
    myParser.write(data);
    myParser.end();
  });

module.exports = [boxes];
