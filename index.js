//index.js
//Adam Sevcik 2022

const JsonLdParser = require("jsonld-streaming-parser").JsonLdParser;


var boxesId=[];
var boxes=[];
var selectedBoxes=[];
var artID=[];
var foundID = false;
var pageWidth;
var pageHeight;
var tree=[];
var boxTree=[];
var target;
var target_element;
var last_active;
var selected_box;
var activeArt;

var id = "12425e9f-6cdd-4700-8e35-6a4c6504a258"

var create= "https://layout.fit.vutbr.cz/api/r/" + id + "/artifact/create";
var base = "https://layout.fit.vutbr.cz/api/r/" + id + "/artifact/item/r:";
var artifact = "https://layout.fit.vutbr.cz/api/r/" + id + "/artifact";
var query = "https://layout.fit.vutbr.cz/api/r/" + id + "/repository/query/"

fetchArts();


function fetchArts() {
    console.log("Fetching arts!");

    artID = [];
    console.log(artID);

    const myParser = new JsonLdParser();
    myParser
        .on('data', artifacts)
        .on('error', console.error)
        .on('end', list);

fetch(artifact)
  .then( body => {
      if(body.ok) {
        return body.text();
    }
      else {
          artifacts(null);  
      }
  })
  .then(data => {
          artID=[];  
          myParser.write(data);
          myParser.end();   
  })
}


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


const modal = document.getElementById("artModal");
const queryModal = document.getElementById("queryModal")

// Get the button that opens the modal
var artBtn = document.getElementById("newArt");
var queryBtn = document.getElementById("newQuery");
var removeBtn = document.getElementById("removeQuery");
// Get the <span> element that closes the modal
var closeArt = document.getElementById("closeNewArt");
var closeQuery = document.getElementById("closeQuery");


// When the user clicks the button, open the modal 
artBtn.onclick = function() {
  modal.style.display = "block";
}

queryBtn.onclick = function() {
    queryModal.style.display = "block";
}

removeBtn.onclick = function() {
    highlightArts();
    highlightQuery();
    
    removeBtn.style.display = "none";

    selectedBoxes = [];
}

// When the user clicks on <span> (x), close the modal
closeArt.onclick = function() {
  modal.style.display = "none";
}

closeQuery.onclick = function() {
    queryModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal || event.target == queryModal) {
    modal.style.display = "none";
    queryModal.style.display = "none";
  }
}

// Add new art
var submit = document.getElementById("submitBtn");

submit.onclick = function(){
    var url = document.getElementById("url").value;
    var widht = document.getElementById("width").value;
    var height = document.getElementById("height").value;

    if(document.getElementById("gridRadios1").checked){
       var service="FitLayout.Puppeteer";
    }
    else{
        var service="FitLayout.CSSBox"
    } 
    
    const data = {
        "params": {
            "width": widht,
            "height": height,
            "url": url
        },
        "serviceId": service
    };
    fetch(create,{
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(response => {
        if(response.status === "error"){
            alert("Wrong URL!")
        }
        else{
        console.log(response);
        fetchArts();}
            });
            
        
    modal.style.display = "none";   
        }




//sparql 

var submitQuery = document.getElementById("submitQuery");

submitQuery.onclick = function(){
    var queryParam = document.getElementById("query").value;
        
    fetch(query,{
        method: 'POST',
        body: `PREFIX fl: <http://fitlayout.github.io/ontology/fitlayout.owl#>
        PREFIX r: <http://fitlayout.github.io/resource/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX box: <http://fitlayout.github.io/ontology/render.owl#>
        PREFIX segm: <http://fitlayout.github.io/ontology/segmentation.owl#>
        
        SELECT ?iri WHERE {  
          ?iri `+ queryParam +`
        }
        ORDER BY ?time
        
        `,
        headers: { 'Content-Type': 'application/sparql-query' }
    })
    .then(response => response.json())
    .then(response => selectBoxes(response))
    .catch( error => {
        alert("Wrong query!");
        console.log(error);
    });

    queryModal.style.display = "none";

   
    }

// change repository

var repo = document.getElementById("set_repository");

repo.onclick = function() {
    
    var repo_id = document.getElementById("repository");
    new_id = repo_id.value;
    if(new_id !== id){
        artID = [];
        document.getElementById("myUL").innerHTML = "";
        id = new_id;
        console.log("Changing repo id to: " + id);
        create= "https://layout.fit.vutbr.cz/api/r/" + id + "/artifact/create";
        base = "https://layout.fit.vutbr.cz/api/r/" + id + "/artifact/item/r:";
        artifact = "https://layout.fit.vutbr.cz/api/r/" + id + "/artifact";
        query = "https://layout.fit.vutbr.cz/api/r/" + id + "/repository/query/"
        //console.log(create);
        fetchArts();
    }
    
}

function main(){

    position();

    boxes.sort(function(a, b){
        return a.documentOrder - b.documentOrder;
    });
    
    const view = document.getElementById("view");
    view.style.width = pageWidth + "px";
    view.style.height = pageHeight + "px";
     
    document.getElementById("loading").style.display = "none";

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
             border-bottom:${ boxes[i].borderB.borderWidth}px ${ boxes[i].borderB.borderStyle } #${ boxes[i].borderB.borderColor };
             white-space: nowrap;">
            ${ boxes[i].text }
            </box-element>
             `;
             view.appendChild(d);

        
     }
     boxTreeMaker();
     box_list(boxTree);
     view.classList.toggle("visibility");
     view.addEventListener("click", function(event){
         console.log(event.target.id + "_node");
         clickFunction(event.target.id + "_node", event.target.id,"box");
     })

     highlightQuery()

}

function getArtfromIRI(iri){
    return iri.substring(iri.lastIndexOf('/')+1, iri.lastIndexOf('#'));
}

function getBoxfromIRI(iri){
    return iri.substring(iri.lastIndexOf('/')+1, iri.lenght);
}

function selectBoxes(result){
       
    highlightQuery();
    highlightArts();
    console.log(result);
    const boxes = result.results.bindings;

    selectedBoxes = [];
  
    boxes.forEach( box => {
        var art = getArtfromIRI(box.iri.value);
        var ID = getBoxfromIRI(box.iri.value);
       
        var found = selectedBoxes.find(Element => Element.art === art);
        if (found) {
           found.boxes.push(ID);
          }
        else {
            var selectedArt = {
                art: art,
                boxes: [ID]
            }
            selectedBoxes.push(selectedArt);
        }         
        });

        if(selectedBoxes.length == 0){
            alert("No boxes match this query!");
            removeBtn.style.display = "none";
        }
        else(removeBtn.style.display = "block")
        
        console.log(selectedBoxes); 

        highlightQuery();
        highlightArts();

}


function highlightQuery(){

    var found = selectedBoxes.find(Element => Element.art === activeArt);
        if (found) {
            found.boxes.forEach(box => {
                document.getElementById(box).classList.toggle("selection");
                document.getElementById(box + "_node").classList.toggle("selection");
            });
        }
}

function highlightArts(){
    selectedBoxes.forEach(element => {
        document.getElementById(element.art).classList.toggle("selection");
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

    //console.log(data);
    if(data != null){
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
    else {
        var list = document.getElementById("list");

        alert("Empty or wrong repository!");
    }
}
function box_list(boxes_list){  
    const box_ul = document.getElementById("myUL2");
    
    main_recursion(boxes_list[0],box_ul.id,"box");

    var toggler = document.getElementsByClassName("caret");
    var i;

    box_ul.addEventListener("click", function(event) {    
        clickFunction(event.target.id,event.target.innerHTML,"box");  
    });
   
    for (i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
        });
    } 
      
}

function main_recursion(Element,box,list){
    if(Element.kids){   
        parent(Element,box,list);
    }
    else{
        child(Element,box,list);
        
    }
}

function parent(Element,box,list){
    var li = document.createElement('li');
    li.setAttribute("id",Element.id);
    var span = document.createElement('span');
    span.setAttribute("class", "caret");
    span.setAttribute("id",Element.id+"_node");
    span.textContent = Element.id;
    li.appendChild(span);

    if(list == 'art'){
        var delete_btn = document.createElement('span');
        delete_btn.setAttribute("id",Element.id+"_delete");
        delete_btn.setAttribute("class","end-0 float-right");
        delete_btn.innerHTML = "&#10060";
        var segment_btn = document.createElement('span');
        segment_btn.setAttribute("id",Element.id+"_segment");
        segment_btn.setAttribute("class","float-right mr-20");
        segment_btn.innerHTML = "SEG";
        li.appendChild(delete_btn);
        li.appendChild(segment_btn);
        
    }
    
    
    

    var ul=document.createElement('ul');
            ul.setAttribute("class", "nested");
            ul.setAttribute("id",Element.id+"_ul");
            li.appendChild(ul);
        document.getElementById(box).appendChild(li);        

    Element.kids.forEach(function(kid){
        if(result = boxTree.find( ({ id }) => id === kid)){
           parent(result,ul.id,list); 
        }
        else{
            child(kid,ul,list);
        }
        
    });
        
}


function child(Element,box,list){
    var kidLi = document.createElement('li');
    kidLi.setAttribute("class","position-relative");
    kidLi.setAttribute("id",Element+"_node");
    kidLi.textContent = Element;
    if(list == 'art'){
        var delete_btn = document.createElement('span');
        delete_btn.setAttribute("id",Element+"_delete");
        delete_btn.setAttribute("class","end-0");
        delete_btn.setAttribute("class","position-absolute end-0");
        delete_btn.textContent = "&#10060";
        kidLi.appendChild(delete_btn);
    }
    
    box.appendChild(kidLi);
}


function clickFunction(listid,boxid,list){      
        if(list == "box"){ 
            if(target_element){
                target_element.classList.remove("highlight");
            }
            if(selected_box){
                selected_box.classList.remove("selected");
            }
            selected_box = document.getElementById(boxid);
            selected_box.classList.add("selected");
            target_element = document.getElementById(listid);
            target_element.classList.add("highlight");
            var parent = target_element.parentElement;
            while(parent != document.getElementById("myUL2")){
                //console.log(parent.id);
                parent.classList.add("active");
                parent = parent.parentElement;

            }

            console.log(target_element);
            //document.getElementById(boxid).scrollIntoView();

            //target_element.parentNode.scrollTop = target_element.offsetTop;
            

            showBoxInfo(boxid);
        }
        else{
            target = event.target.innerHTML; 
            if(listid.includes("_delete")){
                const id = listid.replace("_delete","");

                const arturl = base + id;
                console.log("Fetch DELETE to: " + arturl);
                fetch(arturl, {
                method: 'DELETE',
            })
            .then(res => res.text()) // or res.json()
            .then(res => console.log(res));
            
            var deletedLi = document.getElementById(id);
            deletedLi.remove();

            }
            else if(listid.includes("_segment")){
                const id = listid.replace("_segment","");            
                const parentIri = "http://fitlayout.github.io/resource/" + id;

                const data = {
                    "params": {
                        "pDoC": 9
                    },
                        "serviceId": "FitLayout.VIPS",
                        "parentIti": parentIri
                    };
                    
                    fetch(create,{
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { 'Content-Type': 'application/json' }
                    })
                    .then(response => response.json())
                    .catch((error) => {
                         console.error('Error:', error);
                    });
                    //location.reload()
            }
            else{
            
            if(last_active != document.getElementById(listid)){
                if(last_active){
                    last_active.classList.remove("highlight");
                }
                console.log(last_active)
            last_active = document.getElementById(listid);

            last_active.classList.add("highlight");  

            
            boxes = [];
            boxTree = [];
            //console.log(boxes);
            document.getElementById("bottom").innerHTML = "";
            document.getElementById("myUL2").innerHTML = "";
            document.getElementById("view").innerHTML = "";
            document.getElementById("view").classList.toggle("visibility");
            
            document.getElementById("loading").style.display = "block";

            getArt(target);
            }
        }
    }
}


function list(){
    treeMaker();
        
    const art_ul = document.getElementById("myUL");
    art_ul.innerHTML = "";
    tree.forEach(node => main_recursion(node, art_ul.id, "art"));

    art_ul.addEventListener("click", function(event) {
    clickFunction(event.target.id,0,"art");
    });
    var toggler = document.getElementsByClassName("caret");
  
    for (var i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });
}
    if (art_ul.innerHTML.trim == ""){
        art_ul.innerHTML = "Empty or wrong repository"
    }
    
}

function getArt(target){
    queryBtn.disabled = true;
    artBtn.disabled = true;
    repo.disabled = true;
   
    const artParser = new JsonLdParser();
    artParser
    .on('data', saveArt)
    .on('error', console.error)
    .on('end', main);

    url = base + target;
    activeArt = target;
    console.log(activeArt);

    artID.forEach(function(art){
        
        if(art.id == target && art.parentID != null){
            url = base + art.parentID
        }
    })
    console.log("GET: " + url);

    fetch(url,{
        method: 'GET',
        headers: { 'Accept': 'application/ld+json' }
    })
    .then(function(body){
        return body.text();
    }).then(function(data) {
        //console.log(data);
 
        artParser.write(data);
        queryBtn.disabled = false;
        artBtn.disabled = false;
        repo.disabled = false;
        
        artParser.end();
    });
    
}

function showBoxInfo(id){

    //console.log(id);
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
          <td>${foundBox.borderL.borderWidth}px ${foundBox.borderL.borderStyle} #${foundBox.borderL.borderColor}</td>
        </tr>
        <tr>
          <td>Border top</td>
          <td>${foundBox.borderT.borderWidth}px ${foundBox.borderT.borderStyle} #${foundBox.borderT.borderColor}</td>
        </tr>
        <tr>
          <td>Border right</td>
          <td>${foundBox.borderR.borderWidth}px ${foundBox.borderR.borderStyle} #${foundBox.borderR.borderColor}</td>
        </tr>
        <tr>
          <td>Border bottom</td>
          <td>${foundBox.borderB.borderWidth}px ${foundBox.borderB.borderStyle} #${foundBox.borderB.borderColor}</td>
        </tr>
       
      </table>`
}

function boxTreeMaker(){
    
    var result;
    boxes.forEach(function(box){
    if(box.type == "Box" || box.type == "Border"){
        
        if(box.isChildOf){
            
          if(result = boxTree.find( ({ id }) => id === box.isChildOf)){
                result.kids.push(box.id);

              var node = {
              id: box.id,
              kids:[],
            }
            boxTree.push(node);
          }
        }
        else if(box.isChildOf == null){
            if(result = boxTree.find( ({ id }) => id === box.id)){
                //console.log(box.id);
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
     //console.log(boxTree);
     //console.log(boxes);
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
//console.log(tree);
}

function saveArt(data){
   
    
    var object = data.object.value;

    if(object.includes('width=') && object.includes('height=')){
  
    pageWidth = object.substr(object.indexOf('width=')+6, object.lenght);
    pageWidth = pageWidth.substr(0,pageWidth.indexOf(' '));
    
    
    pageHeight = object.substr(object.indexOf('height=')+7, object.lenght);
    pageHeight = pageHeight.substr(0,pageHeight.indexOf(' '));

    console.log(pageWidth + " " + pageHeight);
    
    }

    var lastIndexO = object.lastIndexOf('#')+1;
    var value = object.substr(lastIndexO,object.lenght);
   

    var subject = data.subject.value;
    var id = subject.substr(subject.lastIndexOf('/')+1,subject.lenght);
  

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

    if(value == "Box"){
        //console.log(id);
        boxesId.push(id);
    }

    var predicate = data.predicate.value; 
    var type = predicate.substr(predicate.lastIndexOf('#')+1, predicate.lenght);

    if(type == "pngImage") pageImg = object.value;

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
                    
                    case "text":
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
                case "label":
                    O.label = value;
                    break;

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
