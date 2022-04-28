//index.js
//Adam Sevcik 2022
// FitLayout web 

const JsonLdParser = require("jsonld-streaming-parser").JsonLdParser;
var id = require("./config.js").repo_id;  // Repository ID from config file
const url = require("./config.js").url;   // Base url from config file

// Set default repo
document.getElementById("repository").value = id;
document.getElementById("loading").style.display = "block";

// Global variables.
var boxesId = [];           // Array of IDs of boxes
var boxes = [];             // Array of boxes
var selectedBoxes = [];     // Array of selected boxes from querry
var Arts = [];              // Array of artifacts    
var boxTree = [];           // Tree of boxes
var targetBox;              // Targeted box
var last_active;            // Last selected artifact
var selected_box;           // Selected box
var activeArt;              // Currently selected artifact
var lastID;                 // ID of last working repository
var target;                 // Selected artifact

// URLs to REST API.
var prefix = url + "/r/" + id
var create = prefix + "/artifact/create";
var base = prefix + "/artifact/item/r:";
var artifact = prefix + "/artifact";
var query = prefix + "/repository/query/"

// Modal windows
const modal = document.getElementById("artModal");
const queryModal = document.getElementById("queryModal")

// Navigation buttons
var artBtn = document.getElementById("newArt");
var queryBtn = document.getElementById("newQuery");
var removeBtn = document.getElementById("removeQuery");

// Modal closing buttons
var closeArt = document.getElementById("closeNewArt");
var closeQuery = document.getElementById("closeQuery");

// Open modal window to create new artifact on click
artBtn.onclick = function () {
    modal.style.display = "block";
}

// Open modal window to search boxes by querry on click
queryBtn.onclick = function () {
    queryModal.style.display = "block";
}

// Remove query search on click
removeBtn.onclick = function () {
    removeSearch();
}

// When the user clicks on (x), close the modal
closeArt.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks on (x), close the modal
closeQuery.onclick = function () {
    queryModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal || event.target == queryModal) {
        modal.style.display = "none";
        queryModal.style.display = "none";
    }
}

// New artifact submit button
var submit = document.getElementById("submitBtn");

// Add new art on click
submit.onclick = function () {
    // Get all information
    var url = document.getElementById("url").value;
    var widht = document.getElementById("width").value;
    var height = document.getElementById("height").value;

    if (document.getElementById("gridRadios1").checked) {
        var service = "FitLayout.Puppeteer";
    }
    else {
        var service = "FitLayout.CSSBox"
    }

    // Body of POST request
    const data = {
        "params": {
            "width": widht,
            "height": height,
            "url": url
        },
        "serviceId": service
    };
    // Fetch request
    fetch(create, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(response => {
            if (response.status === "error") {
                alert("Wrong URL!")
            }
            else {
                console.log(response);
                fetchArts();
            }
        });

    // Close window
    modal.style.display = "none";
}

// Search querry submit button
var submitQuery = document.getElementById("submitQuery");

// Serch by input query on click
submitQuery.onclick = function () {
    // Users query
    var queryParam = document.getElementById("query").value;
    // Fetch request
    fetch(query, {
        method: 'POST',
        body: `PREFIX fl: <http://fitlayout.github.io/ontology/fitlayout.owl#>
        PREFIX r: <http://fitlayout.github.io/resource/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX box: <http://fitlayout.github.io/ontology/render.owl#>
        PREFIX segm: <http://fitlayout.github.io/ontology/segmentation.owl#>
        
        SELECT ?iri WHERE {  
          ?iri `+ queryParam + `
        }
        ORDER BY ?time
        
        `,
        headers: { 'Content-Type': 'application/sparql-query' }
    })
        .then(response => response.json())
        .then(response => selectBoxes(response))
        .catch(error => {
            alert("Wrong query!");
            console.log(error);
        });

    // Close window
    queryModal.style.display = "none";
}

// Change repository button
var repo = document.getElementById("set_repository");

// Change repository on click
repo.onclick = function () {
    var repo_id = document.getElementById("repository");
    var newID = repo_id.value;
    if (newID != id) {
        removeSearch();
        noArt();
        lastID = id;
        id = newID;
        changeRepo(id);
        disabler();
    }

}

// Function to draw selected artifact on screen
function drawArt() {
    // Get position of each box
    position();

    // Sort boxes by order
    boxes.sort(function (a, b) {
        return a.documentOrder - b.documentOrder;
    });

    const view = document.getElementById("view");

    document.getElementById("loading").style.display = "none";

    // Go trough all boxes to make custom element and draw them on screen
    for (var i = 0; i < boxes.length; i++) {

        const d = document.createElement('box-element');
        
        d.innerHTML = `
            <box-element id="${boxes[i].id}" style="position: absolute; top: ${boxes[i].posY}px; left: ${boxes[i].posX}px; width: ${boxes[i].widht}px;
            height: ${boxes[i].height}px; background-color:#${boxes[i].backgroundColor}; color:#${boxes[i].color}; font-size:${boxes[i].fontSize}px; font-weight: ${boxes[i].fontWeight}; font-family:${boxes[i].fontFamily}; font-style: ${boxes[i].fontStyle};
             border-left:${boxes[i].borderL.borderWidth}px ${boxes[i].borderL.borderStyle} #${boxes[i].borderL.borderColor};
             border-right:${boxes[i].borderR.borderWidth}px ${boxes[i].borderR.borderStyle} #${boxes[i].borderR.borderColor};
             border-top:${boxes[i].borderT.borderWidth}px ${boxes[i].borderT.borderStyle} #${boxes[i].borderT.borderColor};
             border-bottom:${boxes[i].borderB.borderWidth}px ${boxes[i].borderB.borderStyle} #${boxes[i].borderB.borderColor};
             white-space: nowrap;">
            ${boxes[i].text}
            </box-element>
             `;
        view.appendChild(d);


    }
    boxTreeMaker();
    box_list(boxTree);

    // onClick function to all boxes in order to interact with them
    view.onclick = function (event) {
        clickFunction(event.target.id + "_node", event.target.id, "box");
    };

    highlightQuery()

}

// Start of script
fetchArts();

// Function to fetch repository from REST API
function fetchArts() {


    const myParser = new JsonLdParser();
    myParser
        .on('data', artifacts)
        .on('error', () => {
            console.error;
        })
        .on('end', list);

    fetch(artifact)
        .then(body => {
            if (body.ok) {
                return body.text();
            }
            else {
                artifacts(null);
            }
        })
        .then(data => {
            myParser.write(data);
            myParser.end();
        })
}

// Change used repository
function changeRepo(id) {
    prefix = url + "/r/" + id;
    // Set all URLs to new repository id
    create = prefix + "/artifact/create";
    base = prefix + "/artifact/item/r:";
    artifact = prefix + "/artifact";
    query = prefix + "/repository/query/";

    cleanRepo();
    fetchArts();
}

// Remove search 
function removeSearch() {
    highlightArts();
    highlightQuery();

    document.getElementById("removeQuery").style.display = "none";
    selectedBoxes = [];
}

// Extract artifact id from IRI
function getArtfromIRI(iri) {
    return iri.substring(iri.lastIndexOf('/') + 1, iri.lastIndexOf('#'));
}

// Extract box id from IRI
function getIDfromIRI(iri) {
    return iri.substring(iri.lastIndexOf('/') + 1, iri.lenght);
}

// Clean list of artifacts used when changing repository
function cleanRepo() {
    Arts = [];
    document.getElementById("myUL").innerHTML = "";
}

// Find boxes and artifacts with selected boxes across whole repository
function selectBoxes(result) {
    highlightQuery();
    highlightArts();
    
    const boxes = result.results.bindings;

    selectedBoxes = [];

    boxes.forEach(box => {
        var art = getArtfromIRI(box.iri.value);
        var ID = getIDfromIRI(box.iri.value);

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

    if (selectedBoxes.length == 0) {
        alert("No boxes match this query!");
        removeBtn.style.display = "none";
    }
    else (removeBtn.style.display = "block")

    console.log(selectedBoxes);
    highlightQuery();
    highlightArts();

}

// Highlight found boxes 
function highlightQuery() {

    var found = selectedBoxes.find(Element => Element.art === activeArt);
    if (found) {
        found.boxes.forEach(box => {
            document.getElementById(box).classList.toggle("selection");
            document.getElementById(box + "_node").classList.toggle("selection");
        });
    }
}

// Highlight artifacts containing found boxes
function highlightArts() {
    selectedBoxes.forEach(element => {
        document.getElementById(element.art).classList.toggle("selection");
    })
}

// Set position to boxes 
function position() {
    boxes.forEach(function (box) {
        if (result = boxes.find(({ id }) => id === box.boundsid)) {
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

// Save artifacts from parser to list  
function artifacts(data) {
    document.getElementById("loading").style.display = "none";

    if (data != null) {
        var predicate = data.predicate.value;
        var subject = data.subject.value;

        var id = getIDfromIRI(subject);
        // Check if artifact has parent
        if (predicate.includes("hasParentArtifact")) {
            var object = data.object.value;

            var parentId = getIDfromIRI(object);

            var found = false;
            Arts.forEach(function (art) {
                if (art.id == id) {
                    found = true;
                    art.parentID = parentId;
                }
            })
            // Artifact already exists in list
            if (found == false) {
                var art = {
                    id: id,
                    parentID: parentId
                }
                Arts.push(art);
            }
        }
        // Artifact without parent
        else {
            var found = false;
            Arts.forEach(function (art) {
                if (art.id == id) {
                    found = true;
                }
            })
            if (found == false) {
                var art = {
                    id: id,
                    parentID: null
                }

                Arts.push(art);
            }
        }
    }
    else {
        alert("Empty or wrong repository!");
        disabler();
        id = lastID;
        changeRepo(id);
    }
}

// Make list out of tree of boxes
function box_list(boxesTree) {
    const box_ul = document.getElementById("myUL2");

    main_recursion(boxesTree[0], box_ul.id, "box");

    var toggler = document.getElementsByClassName("caret");
    var i;

    // onClick on list of boxes in order to interact with boxes
    box_ul.onclick = function (event) {
        clickFunction(event.target.id, event.target.innerHTML, "box");
    };

    for (i = 0; i < toggler.length; i++) {
        toggler[i].onclick = function () {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        };
    }

}


// Main recursion to make tree of boxes from array
function main_recursion(Element, box, list) {
    if (Element.kids) {
        parent(Element, box, list);
    }
    else {
        child(Element, box, list);

    }
}

// Helping function to make tree of boxes
function parent(Element, box, list) {
    var li = document.createElement('li');
    li.setAttribute("id", Element.id);
    var span = document.createElement('span');
    span.setAttribute("class", "caret");
    span.setAttribute("id", Element.id + "_node");
    span.textContent = Element.id;
    li.appendChild(span);

    if (list == 'art') {
        var delete_btn = document.createElement('span');
        delete_btn.setAttribute("id", Element.id + "_delete");
        delete_btn.setAttribute("class", "end-0 float-right");
        delete_btn.innerHTML = "&#10060";
        var segment_btn = document.createElement('span');
        segment_btn.setAttribute("id", Element.id + "_segment");
        segment_btn.setAttribute("class", "float-right mr-20");
        segment_btn.innerHTML = "SEG";
        li.appendChild(delete_btn);
        li.appendChild(segment_btn);

    }

    var ul = document.createElement('ul');
    ul.setAttribute("class", "nested");
    ul.setAttribute("id", Element.id + "_ul");
    li.appendChild(ul);
    document.getElementById(box).appendChild(li);

    Element.kids.forEach(function (kid) {
        if (result = boxTree.find(({ id }) => id === kid)) {
            parent(result, ul.id, list);
        }
        else {
            child(kid, ul, list);
        }

    });
}

// Helping function to make tree of boxes
function child(Element, box, list) {
    var kidLi = document.createElement('li');
    kidLi.setAttribute("class", "position-relative");
    kidLi.setAttribute("id", Element + "_node");
    kidLi.textContent = Element;
    if (list == 'art') {
        var delete_btn = document.createElement('span');
        delete_btn.setAttribute("id", Element + "_delete");
        delete_btn.setAttribute("class", "end-0");
        delete_btn.setAttribute("class", "position-absolute end-0");
        delete_btn.innerHTML = "&#10060";
        kidLi.appendChild(delete_btn);
    }

    box.appendChild(kidLi);
}

// Interact with artifacts and boxes by clicking
function clickFunction(listid, boxid, list) {

    // Interact with boxes
    if (list == "box") {
        if (targetBox) {
            targetBox.classList.remove("highlight");
        }
        if (selected_box) {
            selected_box.classList.remove("selected");
        }
        selected_box = document.getElementById(boxid);
        selected_box.classList.add("selected");
        targetBox = document.getElementById(listid);
        targetBox.classList.add("highlight");
        var parent = targetBox.parentElement;
        while (parent != document.getElementById("myUL2")) {
            parent.classList.add("active");
            parent = parent.parentElement;
        }

        showBoxInfo(boxid);
    }
    // Interact with artifacts
    else {
        var id = event.target.id; 

        if (listid.includes("_node")){
            id = listid.replace("_node", "");
        }
        // Delete artifact
        if (listid.includes("_delete")) {
            id = listid.replace("_delete", "");

            const arturl = base + id;
            fetch(arturl, {
                method: 'DELETE',
            })
                .then(res => res.text()) 
                .then(res => console.log(res));

            var deletedLi = document.getElementById(id);
            deletedLi.remove();

        }
        // Segment artifact
        else if (listid.includes("_segment")) {
            id = listid.replace("_segment", "");
            const parentIri = "http://fitlayout.github.io/resource/" + id;

            const data = {
                "params": {
                    "pDoC": 9
                },
                "serviceId": "FitLayout.VIPS",
                "parentIri": parentIri
            };

            fetch(create, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .catch((error) => {
                    console.error('Error:', error);
                });

        }
        // Choose artifact
        else {

            if (last_active != document.getElementById(id + "_node") && last_active != document.getElementById(id)) {
                if (last_active) {
                    last_active.classList.remove("highlight");
                }
                
                last_active = document.getElementById(id + "_node");

                last_active.classList.add("highlight");

                noArt();
                target = id;
                getArt(id);
            }
        }
    }
}

// Helping function to remove selection of artifact
function noArt() {
    boxes = [];
    boxTree = [];

    document.getElementById("bottom").innerHTML = "";
    document.getElementById("myUL2").innerHTML = "";
    document.getElementById("view").innerHTML = "";

    document.getElementById("loading").style.display = "block";
}

// Make list of artifact out of tree of artifacts
function list() {
    disabler();
    treeMaker();

    var art_ul = document.getElementById("myUL");
    art_ul.innerHTML = "";

    tree.forEach(node => main_recursion(node, art_ul.id, "art"));

    art_ul.onclick = function (event) {
        clickFunction(event.target.id, 0, "art");
    };
    var toggler = document.getElementsByClassName("caret");

    for (var i = 0; i < toggler.length; i++) {
        toggler[i].onclick = function () {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        };
    }
    if (art_ul.innerHTML.trim == "") {
        art_ul.innerHTML = "Empty or wrong repository"
    }

}

// Fetch selected artifact from REST API
function getArt(target) {
    disabler();

    const artParser = new JsonLdParser();
    artParser
        .on('data', saveArt)
        .on('error', console.error)
        .on('end', drawArt);

    targetUrl = base + target;
    activeArt = target;

    
    console.log("GET: " + targetUrl);
    fetch(targetUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/ld+json' }
    })
        .then(function (body) {
            return body.text();
        }).then(function (data) {
            console.log(data);
            artParser.write(data);
            disabler();
            artParser.end();
        });

}

// Helping function to enable/disable buttons
function disabler() {
    queryBtn.disabled = !queryBtn.disabled;
    artBtn.disabled = !artBtn.disabled;
    repo.disabled = !repo.disabled;
    removeBtn.disabled = !removeBtn.disabled;
}

// Write info about selected box to table
function showBoxInfo(id) {

    var foundBox;
    boxes.forEach(function (box) {
        if (box.id == id) {
            foundBox = box;
        }
    })
    // Create table with info
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

// Helping function to make tree out of array of boxes
function boxTreeMaker() {

    var result;
    boxes.forEach(function (box) {
        if (box.type == "Box" || box.type == "Border") {

            if (box.isChildOf) {
                if (result = boxTree.find(({ id }) => id === box.isChildOf)) {
                    result.kids.push(box.id);

                    var node = {
                        id: box.id,
                        kids: [],
                    }
                    boxTree.push(node);
                }
            }
            else if (box.isChildOf == null) {
                if (result = boxTree.find(({ id }) => id === box.id)) {
                    return;
                }
                else {
                    var node = {
                        id: box.id,
                        kids: [],
                    }
                    boxTree.push(node);
                }
            }
        }
    })
}

// Helping function to make tree out of array of artifacts
function treeMaker() {
    tree = [];
    for (var i = 0; i < Arts.length; i++) {

        if (!Arts[i].parentID) {

            var parent = {
                id: Arts[i].id,
                kids: []
            }
            for (var j = 0; j < Arts.length; j++) {
                if (Arts[j].parentID) {
                    if (Arts[j].parentID == Arts[i].id) {
                        parent.kids.push(Arts[j].id);
                    }
                }
            }
            tree.push(parent);
        }
    }
}

// Main function to save all info about selected artifact into object
function saveArt(data) {

    var object = data.object.value;

    var lastIndexO = object.lastIndexOf('#') + 1;
    var value = object.substr(lastIndexO, object.lenght);


    var subject = data.subject.value;
    var id = subject.substr(subject.lastIndexOf('/') + 1, subject.lenght);


    var borderS = "";

    if (id.includes("Btop")) {
        id = id.replace('Btop', '');
        borderS = "top";
    }
    if (id.includes("Bbottom")) {
        id = id.replace('Bbottom', '');
        borderS = "bottom";
    }
    if (id.includes("Bleft")) {
        id = id.replace('Bleft', '');
        borderS = "left";
    }
    if (id.includes("Bright")) {
        id = id.replace('Bright', '');
        borderS = "right";
    }

    if (value == "Box") {
        boxesId.push(id);
    }

    var predicate = data.predicate.value;
    var type = predicate.substr(predicate.lastIndexOf('#') + 1, predicate.lenght);

    var foundID = false;

    if (type == "pngImage") pageImg = object.value;

    for (var i = 0; i < boxes.length; i++) {
        // Box already exists in array
        if (id == boxes[i].id) {
            foundID = true;

            if (borderS == "top") {
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
            else if (borderS == "left") {
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
            else if (borderS == "bottom") {
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
            else if (borderS == "right") {
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
                    if (value > 0, 5) {
                        boxes[i].fontWeight = "bold";
                    }
                    else {
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
    // New box 
    if (foundID == false) {
        var O = {
            id: id,
            boundsid: "",
            backgroundColor: "none",
            posX: "0",
            posY: "0",
            widht: "0",
            height: "0",
            belongsTo: "",
            color: "",
            documentOrder: "",
            fontFamily: "",
            fontSize: "",
            fontStyle: "",
            fontWeight: "",
            hasAttribute: "",
            htmlTagName: "",
            lineThrough: "none",
            underLine: "none",
            visualHeight: "",
            visualWidth: "",
            visualX: "",
            visualY: "",
            type: "",
            isChildOf: null,
            text: "",
            borderL:
            {
                borderColor: "",
                borderWidth: "0",
                borderStyle: ""
            },
            borderR:
            {
                borderColor: "",
                borderWidth: "0",
                borderStyle: ""
            },
            borderT:
            {
                borderColor: "",
                borderWidth: "0",
                borderStyle: ""
            },
            borderB:
            {
                borderColor: "",
                borderWidth: "0",
                borderStyle: ""
            }
        }

        if (borderS) {
            O.border.side = borderS;
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
