const JsonLdParser = require("jsonld-streaming-parser").JsonLdParser;
const fs = require("fs");

var boxesId=[];
var boxes=[];
var foundID = false;


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
     console.log(boxes);

}

function saveObject(data){
    var object = data.object.value;
    var lastIndexO = object.lastIndexOf('#')+1;
    var value = object.substr(lastIndexO,object.lenght);

    var subject = data.subject.value;
    var lastIndexS = subject.lastIndexOf('/')+1;
    var id = subject.substr(lastIndexS,subject.lenght);
    if(value== "Box"){
        boxesId.push(id);
    }

    var predicate = data.predicate.value;
    var lastIndexP = predicate.lastIndexOf('#')+1;
    var type = predicate.substr(lastIndexP,predicate.lenght);
        for(var i = 0; i<boxes.length;i++){
            if(id==boxes[i].id){
                foundID = true;

                switch (type) {
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
                        boxes[i].fontWeight = value;
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

                    default:
                        break;
                }
            }
        }
        if(foundID == false){
            var O ={id: id};
                boxes.push(O);
        }

        foundID = false;
}


const myParser = new JsonLdParser();

myParser
  .on('data', saveObject)
  .on('error', console.error)
  .on('end', main);


myParser.write(`{
  "@graph": [
      {
          "@id": "r:art4",
          "@type": "b:Page",
          "b:hasTitle": "CSSBox - Java HTML rendering engine",
          "b:launchDatetime": {
              "@type": "xsd:dateTime",
              "@value": "2020-10-16T09:14:13.840+02:00"
          },
          "b:sourceUrl": "http://cssbox.sf.net"
      },
      {
          "@id": "r:art4#0",
          "@type": "b:Box",
          "b:backgroundColor": "#fafafa",
          "b:belongsTo": {
              "@id": "r:art4"
          },
          "b:color": "#000000",
          "b:documentOrder": {
              "@type": "xsd:int",
              "@value": "0"
          },
          "b:fontFamily": "Serif",
          "b:fontSize": {
              "@type": "xsd:float",
              "@value": "12.0"
          },
          "b:fontStyle": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:fontWeight": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:hasAttribute": [
              {
                  "@id": "r:art4#0-attr-class"
              },
              {
                  "@id": "r:art4#0-attr-style"
              }
          ],
          "b:height": {
              "@type": "xsd:int",
              "@value": "878"
          },
          "b:htmlTagName": "xdiv",
          "b:lineThrough": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:positionX": {
              "@type": "xsd:int",
              "@value": "0"
          },
          "b:positionY": {
              "@type": "xsd:int",
              "@value": "0"
          },
          "b:underline": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:visualHeight": {
              "@type": "xsd:int",
              "@value": "878"
          },
          "b:visualWidth": {
              "@type": "xsd:int",
              "@value": "1200"
          },
          "b:visualX": {
              "@type": "xsd:int",
              "@value": "0"
          },
          "b:visualY": {
              "@type": "xsd:int",
              "@value": "0"
          },
          "b:width": {
              "@type": "xsd:int",
              "@value": "1200"
          }
      },
      {
          "@id": "r:art4#0-attr-class",
          "rdf:value": "Xanonymous",
          "rdfs:label": "class"
      },
      {
          "@id": "r:art4#0-attr-style",
          "rdf:value": "display:block",
          "rdfs:label": "style"
      },
      {
          "@id": "r:art4#1",
          "@type": "b:Box",
          "b:belongsTo": {
              "@id": "r:art4"
          },
          "b:color": "#000000",
          "b:documentOrder": {
              "@type": "xsd:int",
              "@value": "1"
          },
          "b:fontFamily": "Arial",
          "b:fontSize": {
              "@type": "xsd:float",
              "@value": "10.0"
          },
          "b:fontStyle": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:fontWeight": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:height": {
              "@type": "xsd:int",
              "@value": "863"
          },
          "b:htmlTagName": "body",
          "b:isChildOf": {
              "@id": "r:art4#0"
          },
          "b:lineThrough": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:positionX": {
              "@type": "xsd:int",
              "@value": "8"
          },
          "b:positionY": {
              "@type": "xsd:int",
              "@value": "8"
          },
          "b:underline": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:visualHeight": {
              "@type": "xsd:int",
              "@value": "0"
          },
          "b:visualWidth": {
              "@type": "xsd:int",
              "@value": "0"
          },
          "b:visualX": {
              "@type": "xsd:int",
              "@value": "8"
          },
          "b:visualY": {
              "@type": "xsd:int",
              "@value": "8"
          },
          "b:width": {
              "@type": "xsd:int",
              "@value": "1184"
          }
      },
      {
          "@id": "r:art4#10",
          "@type": "b:Box",
          "b:belongsTo": {
              "@id": "r:art4"
          },
          "b:color": "#343434",
          "b:documentOrder": {
              "@type": "xsd:int",
              "@value": "10"
          },
          "b:fontFamily": "Arial",
          "b:fontSize": {
              "@type": "xsd:float",
              "@value": "10.0"
          },
          "b:fontStyle": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:fontWeight": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:hasAttribute": [
              {
                  "@id": "r:art4#10-attr-style"
              },
              {
                  "@id": "r:art4#10-attr-href"
              }
          ],
          "b:hasText": "more...",
          "b:height": {
              "@type": "xsd:int",
              "@value": "16"
          },
          "b:isChildOf": {
              "@id": "r:art4#0"
          },
          "b:lineThrough": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:positionX": {
              "@type": "xsd:int",
              "@value": "994"
          },
          "b:positionY": {
              "@type": "xsd:int",
              "@value": "176"
          },
          "b:underline": {
              "@type": "xsd:float",
              "@value": "1.0"
          },
          "b:visualHeight": {
              "@type": "xsd:int",
              "@value": "16"
          },
          "b:visualWidth": {
              "@type": "xsd:int",
              "@value": "41"
          },
          "b:visualX": {
              "@type": "xsd:int",
              "@value": "994"
          },
          "b:visualY": {
              "@type": "xsd:int",
              "@value": "176"
          },
          "b:width": {
              "@type": "xsd:int",
              "@value": "41"
          }
      },
      {
          "@id": "r:art4#10-attr-href",
          "rdf:value": "about.php",
          "rdfs:label": "href"
      },
      {
          "@id": "r:art4#10-attr-style",
          "rdf:value": "margin-left: 1em",
          "rdfs:label": "style"
      },
      {
          "@id": "r:art4#11",
          "@type": "b:Box",
          "b:belongsTo": {
              "@id": "r:art4"
          },
          "b:color": "#343434",
          "b:containsImage": {
              "@id": "urn:uuid:c36f2a79-f01d-43bd-8d90-bb55a2d89409"
          },
          "b:documentOrder": {
              "@type": "xsd:int",
              "@value": "11"
          },
          "b:fontFamily": "Arial",
          "b:fontSize": {
              "@type": "xsd:float",
              "@value": "10.0"
          },
          "b:fontStyle": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:fontWeight": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:hasAttribute": [
              {
                  "@id": "r:art4#11-attr-src"
              },
              {
                  "@id": "r:art4#11-attr-href"
              }
          ],
          "b:height": {
              "@type": "xsd:int",
              "@value": "20"
          },
          "b:htmlTagName": "img",
          "b:isChildOf": {
              "@id": "r:art4#0"
          },
          "b:lineThrough": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:positionX": {
              "@type": "xsd:int",
              "@value": "606"
          },
          "b:positionY": {
              "@type": "xsd:int",
              "@value": "234"
          },
          "b:underline": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:visualHeight": {
              "@type": "xsd:int",
              "@value": "20"
          },
          "b:visualWidth": {
              "@type": "xsd:int",
              "@value": "20"
          },
          "b:visualX": {
              "@type": "xsd:int",
              "@value": "606"
          },
          "b:visualY": {
              "@type": "xsd:int",
              "@value": "234"
          },
          "b:width": {
              "@type": "xsd:int",
              "@value": "20"
          }
      },
      {
          "@id": "r:art4#11-attr-href",
          "rdf:value": "http://a.fsdn.com/con/app/proj/cssbox/screenshots/browser1.jpeg",
          "rdfs:label": "href"
      },
      {
          "@id": "r:art4#11-attr-src",
          "rdf:value": "http://a.fsdn.com/con/app/proj/cssbox/screenshots/browser1.jpeg/182/137",
          "rdfs:label": "src"
      },
      {
          "@id": "r:art4#12",
          "@type": "b:Box",
          "b:belongsTo": {
              "@id": "r:art4"
          },
          "b:color": "#000000",
          "b:documentOrder": {
              "@type": "xsd:int",
              "@value": "12"
          },
          "b:fontFamily": "Arial",
          "b:fontSize": {
              "@type": "xsd:float",
              "@value": "10.0"
          },
          "b:fontStyle": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:fontWeight": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:hasAttribute": {
              "@id": "r:art4#12-attr-class"
          },
          "b:hasText": " ",
          "b:height": {
              "@type": "xsd:int",
              "@value": "16"
          },
          "b:isChildOf": {
              "@id": "r:art4#0"
          },
          "b:lineThrough": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:positionX": {
              "@type": "xsd:int",
              "@value": "639"
          },
          "b:positionY": {
              "@type": "xsd:int",
              "@value": "242"
          },
          "b:underline": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:visualHeight": {
              "@type": "xsd:int",
              "@value": "16"
          },
          "b:visualWidth": {
              "@type": "xsd:int",
              "@value": "4"
          },
          "b:visualX": {
              "@type": "xsd:int",
              "@value": "639"
          },
          "b:visualY": {
              "@type": "xsd:int",
              "@value": "242"
          },
          "b:width": {
              "@type": "xsd:int",
              "@value": "4"
          }
      },
      {
          "@id": "r:art4#12-attr-class",
          "rdf:value": "screenshots",
          "rdfs:label": "class"
      },
      {
          "@id": "r:art4#13",
          "@type": "b:Box",
          "b:belongsTo": {
              "@id": "r:art4"
          },
          "b:color": "#343434",
          "b:containsImage": {
              "@id": "urn:uuid:eac14358-2f44-4e85-9c18-3ca7eddc9cb8"
          },
          "b:documentOrder": {
              "@type": "xsd:int",
              "@value": "13"
          },
          "b:fontFamily": "Arial",
          "b:fontSize": {
              "@type": "xsd:float",
              "@value": "10.0"
          },
          "b:fontStyle": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:fontWeight": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:hasAttribute": [
              {
                  "@id": "r:art4#13-attr-src"
              },
              {
                  "@id": "r:art4#13-attr-href"
              }
          ],
          "b:height": {
              "@type": "xsd:int",
              "@value": "20"
          },
          "b:htmlTagName": "img",
          "b:isChildOf": {
              "@id": "r:art4#0"
          },
          "b:lineThrough": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:positionX": {
              "@type": "xsd:int",
              "@value": "657"
          },
          "b:positionY": {
              "@type": "xsd:int",
              "@value": "234"
          },
          "b:underline": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:visualHeight": {
              "@type": "xsd:int",
              "@value": "20"
          },
          "b:visualWidth": {
              "@type": "xsd:int",
              "@value": "20"
          },
          "b:visualX": {
              "@type": "xsd:int",
              "@value": "657"
          },
          "b:visualY": {
              "@type": "xsd:int",
              "@value": "234"
          },
          "b:width": {
              "@type": "xsd:int",
              "@value": "20"
          }
      },
      {
          "@id": "r:art4#13-attr-href",
          "rdf:value": "http://a.fsdn.com/con/app/proj/cssbox/screenshots/318269.jpg",
          "rdfs:label": "href"
      },
      {
          "@id": "r:art4#13-attr-src",
          "rdf:value": "http://a.fsdn.com/con/app/proj/cssbox/screenshots/318269.jpg/182/137",
          "rdfs:label": "src"
      },
      {
          "@id": "r:art4#14",
          "@type": "b:Box",
          "b:belongsTo": {
              "@id": "r:art4"
          },
          "b:color": "#000000",
          "b:documentOrder": {
              "@type": "xsd:int",
              "@value": "14"
          },
          "b:fontFamily": "Arial",
          "b:fontSize": {
              "@type": "xsd:float",
              "@value": "10.0"
          },
          "b:fontStyle": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:fontWeight": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:hasAttribute": {
              "@id": "r:art4#14-attr-class"
          },
          "b:hasText": " ",
          "b:height": {
              "@type": "xsd:int",
              "@value": "16"
          },
          "b:isChildOf": {
              "@id": "r:art4#0"
          },
          "b:lineThrough": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:positionX": {
              "@type": "xsd:int",
              "@value": "690"
          },
          "b:positionY": {
              "@type": "xsd:int",
              "@value": "242"
          },
          "b:underline": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:visualHeight": {
              "@type": "xsd:int",
              "@value": "16"
          },
          "b:visualWidth": {
              "@type": "xsd:int",
              "@value": "4"
          },
          "b:visualX": {
              "@type": "xsd:int",
              "@value": "690"
          },
          "b:visualY": {
              "@type": "xsd:int",
              "@value": "242"
          },
          "b:width": {
              "@type": "xsd:int",
              "@value": "4"
          }
      },
      {
          "@id": "r:art4#14-attr-class",
          "rdf:value": "screenshots",
          "rdfs:label": "class"
      },
      {
          "@id": "r:art4#15",
          "@type": "b:Box",
          "b:belongsTo": {
              "@id": "r:art4"
          },
          "b:color": "#343434",
          "b:containsImage": {
              "@id": "urn:uuid:3f0ff03f-38e0-42df-9500-7064fceea9ac"
          },
          "b:documentOrder": {
              "@type": "xsd:int",
              "@value": "15"
          },
          "b:fontFamily": "Arial",
          "b:fontSize": {
              "@type": "xsd:float",
              "@value": "10.0"
          },
          "b:fontStyle": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:fontWeight": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:hasAttribute": [
              {
                  "@id": "r:art4#15-attr-src"
              },
              {
                  "@id": "r:art4#15-attr-href"
              }
          ],
          "b:height": {
              "@type": "xsd:int",
              "@value": "20"
          },
          "b:htmlTagName": "img",
          "b:isChildOf": {
              "@id": "r:art4#0"
          },
          "b:lineThrough": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:positionX": {
              "@type": "xsd:int",
              "@value": "707"
          },
          "b:positionY": {
              "@type": "xsd:int",
              "@value": "234"
          },
          "b:underline": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:visualHeight": {
              "@type": "xsd:int",
              "@value": "20"
          },
          "b:visualWidth": {
              "@type": "xsd:int",
              "@value": "20"
          },
          "b:visualX": {
              "@type": "xsd:int",
              "@value": "707"
          },
          "b:visualY": {
              "@type": "xsd:int",
              "@value": "234"
          },
          "b:width": {
              "@type": "xsd:int",
              "@value": "20"
          }
      },
      {
          "@id": "r:art4#15-attr-href",
          "rdf:value": "http://a.fsdn.com/con/app/proj/cssbox/screenshots/318271.jpg",
          "rdfs:label": "href"
      },
      {
          "@id": "r:art4#15-attr-src",
          "rdf:value": "http://a.fsdn.com/con/app/proj/cssbox/screenshots/318271.jpg/182/137",
          "rdfs:label": "src"
      },
      {
          "@id": "r:art4#16",
          "@type": "b:Box",
          "b:belongsTo": {
              "@id": "r:art4"
          },
          "b:color": "#000000",
          "b:documentOrder": {
              "@type": "xsd:int",
              "@value": "16"
          },
          "b:fontFamily": "Arial",
          "b:fontSize": {
              "@type": "xsd:float",
              "@value": "12.0"
          },
          "b:fontStyle": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:fontWeight": {
              "@type": "xsd:float",
              "@value": "1.0"
          },
          "b:hasText": "Latest News",
          "b:height": {
              "@type": "xsd:int",
              "@value": "19"
          },
          "b:isChildOf": {
              "@id": "r:art4#0"
          },
          "b:lineThrough": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:positionX": {
              "@type": "xsd:int",
              "@value": "207"
          },
          "b:positionY": {
              "@type": "xsd:int",
              "@value": "297"
          },
          "b:underline": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:visualHeight": {
              "@type": "xsd:int",
              "@value": "19"
          },
          "b:visualWidth": {
              "@type": "xsd:int",
              "@value": "94"
          },
          "b:visualX": {
              "@type": "xsd:int",
              "@value": "207"
          },
          "b:visualY": {
              "@type": "xsd:int",
              "@value": "297"
          },
          "b:width": {
              "@type": "xsd:int",
              "@value": "94"
          }
      },
      {
          "@id": "r:art4#17",
          "@type": "b:Box",
          "b:belongsTo": {
              "@id": "r:art4"
          },
          "b:color": "#000000",
          "b:documentOrder": {
              "@type": "xsd:int",
              "@value": "17"
          },
          "b:fontFamily": "Arial",
          "b:fontSize": {
              "@type": "xsd:float",
              "@value": "8.0"
          },
          "b:fontStyle": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:fontWeight": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:hasAttribute": {
              "@id": "r:art4#17-attr-class"
          },
          "b:hasText": "Fri, 01 Nov 2019 08:56:37 -0000",
          "b:height": {
              "@type": "xsd:int",
              "@value": "13"
          },
          "b:isChildOf": {
              "@id": "r:art4#0"
          },
          "b:lineThrough": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:positionX": {
              "@type": "xsd:int",
              "@value": "208"
          },
          "b:positionY": {
              "@type": "xsd:int",
              "@value": "334"
          },
          "b:underline": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:visualHeight": {
              "@type": "xsd:int",
              "@value": "13"
          },
          "b:visualWidth": {
              "@type": "xsd:int",
              "@value": "155"
          },
          "b:visualX": {
              "@type": "xsd:int",
              "@value": "208"
          },
          "b:visualY": {
              "@type": "xsd:int",
              "@value": "334"
          },
          "b:width": {
              "@type": "xsd:int",
              "@value": "155"
          }
      },
      {
          "@id": "r:art4#17-attr-class",
          "rdf:value": "date",
          "rdfs:label": "class"
      },
      {
          "@id": "r:art4#18",
          "@type": "b:Box",
          "b:belongsTo": {
              "@id": "r:art4"
          },
          "b:color": "#000000",
          "b:documentOrder": {
              "@type": "xsd:int",
              "@value": "18"
          },
          "b:fontFamily": "Arial",
          "b:fontSize": {
              "@type": "xsd:float",
              "@value": "10.0"
          },
          "b:fontStyle": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:fontWeight": {
              "@type": "xsd:float",
              "@value": "1.0"
          },
          "b:hasText": "jStyleParser 3.5 released",
          "b:height": {
              "@type": "xsd:int",
              "@value": "16"
          },
          "b:isChildOf": {
              "@id": "r:art4#0"
          },
          "b:lineThrough": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:positionX": {
              "@type": "xsd:int",
              "@value": "208"
          },
          "b:positionY": {
              "@type": "xsd:int",
              "@value": "349"
          },
          "b:underline": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:visualHeight": {
              "@type": "xsd:int",
              "@value": "16"
          },
          "b:visualWidth": {
              "@type": "xsd:int",
              "@value": "158"
          },
          "b:visualX": {
              "@type": "xsd:int",
              "@value": "208"
          },
          "b:visualY": {
              "@type": "xsd:int",
              "@value": "349"
          },
          "b:width": {
              "@type": "xsd:int",
              "@value": "158"
          }
      },
      {
          "@id": "r:art4#19",
          "@type": "b:Box",
          "b:belongsTo": {
              "@id": "r:art4"
          },
          "b:color": "#000000",
          "b:documentOrder": {
              "@type": "xsd:int",
              "@value": "19"
          },
          "b:fontFamily": "Arial",
          "b:fontSize": {
              "@type": "xsd:float",
              "@value": "10.0"
          },
          "b:fontStyle": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:fontWeight": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:hasText": "The processing of the counter-related properties has been reworked and fixed.",
          "b:height": {
              "@type": "xsd:int",
              "@value": "16"
          },
          "b:isChildOf": {
              "@id": "r:art4#0"
          },
          "b:lineThrough": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:positionX": {
              "@type": "xsd:int",
              "@value": "215"
          },
          "b:positionY": {
              "@type": "xsd:int",
              "@value": "370"
          },
          "b:underline": {
              "@type": "xsd:float",
              "@value": "0.0"
          },
          "b:visualHeight": {
              "@type": "xsd:int",
              "@value": "16"
          },
          "b:visualWidth": {
              "@type": "xsd:int",
              "@value": "448"
          },
          "b:visualX": {
              "@type": "xsd:int",
              "@value": "215"
          },
          "b:visualY": {
              "@type": "xsd:int",
              "@value": "370"
          },
          "b:width": {
              "@type": "xsd:int",
              "@value": "448"
          }
      },
      
  ],
  "@id": "r:art4",
  "@context": {
      "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
      "xsd": "http://www.w3.org/2001/XMLSchema#",
      "b": "http://fitlayout.github.io/ontology/render.owl#",
      "a": "http://fitlayout.github.io/ontology/segmentation.owl#",
      "fl": "http://fitlayout.github.io/ontology/fitlayout.owl#",
      "r": "http://fitlayout.github.io/resource/"
  }
}
`);
myParser.end();
