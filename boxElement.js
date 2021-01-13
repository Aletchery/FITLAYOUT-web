const boxes = require('./index');

    
class BoxElement extends HTMLDivElement {
    constructor() {
        super();
        const temp = document.createElement('template');
        

       this.attachShadow({mode: 'open'}); 
       
      }
    }
    customElements.define("box-element", BoxElement,{extends : 'div'});

  

  /*for(var i = 0;i<boxes.length;i++){
      boxCreator(boxes[i]);
        var box = document.createElement("box-element");
        var body = document.getElementById("body");
        body.appendChild(box);
  }*/

  