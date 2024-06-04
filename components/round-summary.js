import availableMethods from "../db/leanmethods.json" with {type: "json"}

class RoundSummary extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        .options-container {
          text-align: center;
          margin: 20px;
        }
        .options-heading {
          font-size: 1.5em;
          margin-bottom: 10px;
        }
        .summary-text {
          margin-bottom: 20px;
        }
        #applied-methods {
          /* Style for applied methods section */
        }

        label {
          position: relative;
          display: inline-block;
          border-bottom: 1px dotted black;
        }
        
        label .tooltip {
          visibility: hidden;
          width: 300px;
          background-color: #555;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 5px 0;
          position: absolute;
          z-index: 1;
          bottom: 125%;
          left: 50%;
          margin-left: -60px;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        label .tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #555 transparent transparent transparent;
        }
        
        label:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
              </style>
      <div id="options-container" class="options-container">
        <h2>Round Summary</h2>
        <h2>Select Lean Method</h2>
        <div id="available-methods" class="options">
        </div>
        <div id="applied-methods" class="options">
        </div>
      </div>
    `;

    this.availableMethods = availableMethods.leanMethods;
  }

  connectedCallback() {
    this.leanMethodRadioButtons = this.shadowRoot.querySelectorAll('input[type="radio"][name="game-option"]');
    this.leanMethodRadioButtons.forEach((radioButton) => {
      radioButton.addEventListener("change", this.handleLeanMethodChange.bind(this));
    });
  }

  showLeanMethods(leanMethods) {
    const availableMethodsContainer = this.shadowRoot.getElementById("available-methods");
    const appliedMethodsContainer = this.shadowRoot.getElementById("applied-methods");

    availableMethodsContainer.innerHTML = ""; // Clear previous options
    appliedMethodsContainer.innerHTML = "";

    this.availableMethods.forEach((leanMethod) => {
      if (!Array.from(leanMethods.keys()).includes(leanMethod.id)) { // Only show non-applied methods
        const option = document.createElement("div");
        option.classList.add("option");

        const radioButton = document.createElement("input");
        radioButton.type = "radio";
        radioButton.id = leanMethod.id; // Use leanMethod as ID
        radioButton.name = "game-option";
        radioButton.value = leanMethod.id;
        radioButton.addEventListener("change", this.handleLeanMethodChange.bind(this));

        const label = document.createElement("label");
        label.textContent = leanMethod.name;
        label.htmlFor = leanMethod.id;

        // Create tooltip element
        const tooltip = document.createElement("span");
        tooltip.classList.add("tooltip");
        tooltip.textContent = leanMethod.description;

        option.appendChild(radioButton);
        option.appendChild(label);
        label.appendChild(tooltip); 

        availableMethodsContainer.appendChild(option);
      } else {
        // Create display for already applied methods (unchanged)
        const appliedMethod = document.createElement("div");
        appliedMethod.classList.add("applied-method");

        const message = document.createElement("span");
        message.textContent = `- ${leanMethod.name} (Already Applied)`;

        appliedMethod.appendChild(message);
        appliedMethodsContainer.appendChild(appliedMethod);
      }
    });
  }

  handleLeanMethodChange(event) {
    const selectedLeanMethod = event.target.value;

    this.dispatchEvent(
      new CustomEvent("leanmethodchange", {
        detail: { selectedLeanMethod },
        bubbles: true,
        composed: true,
      })
    );
  }
  show(){
    this.classList.remove("hidden")
  }
  hide(){
    this.classList.add("hidden")
  }
  
}
customElements.define("round-summary", RoundSummary);
  
export { RoundSummary };