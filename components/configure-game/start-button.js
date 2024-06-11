class StartButton extends HTMLElement {
  constructor(playerName) {
    super();
    this.playerName = playerName;
    this.attachShadow({ mode: "open" });

    const shadowRoot = this.shadowRoot;

    //this.classList.add("start-button-container");

    shadowRoot.innerHTML = `
      <link rel="stylesheet" href="styles.css">
      <button id="startButton">Start Game!</button>
    `;

    const startButton = shadowRoot.querySelector("#startButton");

    startButton.addEventListener("click", () => {
      // const playerName = playerNameInput.value.trim();
      // const allowedChars = /^[A-Za-z0-9 ]+$/;
      // if (
      //   playerName.length < 3 ||
      //   playerName.length > 15 ||
      //   !allowedChars.test(playerName)
      // ) {
      //   alert(
      //     "Please enter a valid name (minimum 3 characters, maximum 15. Only letters, numbers, and spaces are allowed)."
      //   );
      //   return;
      // }
      const playerName = this.playerName;
      this.dispatchEvent(
        new CustomEvent("startgame", {
          bubbles: true,
          composed: true,
          detail: { playerName },
        })
      );
    });
  }
  show() {
    this.classList.remove("hidden");
  }
  hide() {
    this.classList.add("hidden");
  }
}

customElements.define("start-button", StartButton);
export { StartButton };
