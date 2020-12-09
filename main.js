const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false
  },

  init() {
    //create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");
    //setup main elements
    this.elements.main.classList.add("keyboard", "keyboard_hidden");
    this.elements.keysContainer.classList.add("keyboard_keys")
    this.elements.keysContainer.appendChild(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard_key");
    //add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);
    
    //automatically use keyboard for elements
    document.querySelectorAll(".use-keyboard-input").forEach( element => {
      element.addEventListener("focus", () => {
        this.open( element.value, currentValue => {
          element.value = currentValue;
        });
      });
    })
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    const keyLayot = [ 
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
      "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
      "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
      "space"
    ];
  
    //creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayot.forEach( key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;
      //add attributes/class
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard_key");

      switch (key) {
        case "backspace":
          keyElement.classList.add("keyboard_key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            this.properties.value = this.properties.value.substring( 0, this.properties.value.length - 1);
            this._triggerEvent("oninput");
          });
          break;
        
          case "caps":
          keyElement.classList.add("keyboard_key--wide", "keyboard_key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard_key--active", this.properties.capsLock);
          });
          break;

          case "enter":
          keyElement.classList.add("keyboard_key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            this.properties.value += "\n";
            this._triggerEvent("oninput");
          });
          break;

          case "space":
          keyElement.classList.add("keyboard_key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            this.properties.value += " ";
            this._triggerEvent("oninput");
          });
          break;

          case "done":
            keyElement.classList.add("keyboard_key--wide", "keyboard_key--dark");
            keyElement.innerHTML = createIconHTML("check_circle");
  
            keyElement.addEventListener("click", () => {
              this.close();
              this._triggerEvent("onclose");
            });

            break;

            default:
              keyElement.textContent = key.toLowerCase();

              keyElement.addEventListener( "click", () => {
                this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                this._triggerEvent("oninput");
              });
             
              break;
      }
      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });
    return fragment;
    },

    _triggerEvent(handlerName) {
      if(typeof this.eventHandlers[handlerName] == "function") {
        this.eventHandlers[handlerName](this.properties.value);
      }
    },

    _toggleCapsLock() {
      this.properties.capsLock = !this.properties.capsLock;
      
      for (const key of this.elements.keys) {
        if(key.childElementCount === 0) {
          key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
      }
    },

     open( initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard_hidden");
      },

      close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard_hidden");
      }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
  // Keyboard.open("dcode", function (currentValue) {
  //     console.log("value changed! Here it is: " + currentValue);
  //   }, function (currentValue) {
  //     console.log("keyboard closed! Finishing value: " + currentValue);
  // });
});