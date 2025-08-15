// @ts-check
import UIManager from "./uimanager";

class FooterUI {
  #uimanager;
  /**
   * @param {UIManager} uimanager
   */
  constructor(uimanager) {
    this.#uimanager = uimanager;
  }

  /**
   * @method to render the footer of the page
   * @returns {HTMLElement}
   * */
  renderFooter() {
    const footer = document.createElement("footer");
    footer.classList.add("footer");

    const nameSpan = this.#uimanager.addElement("span", footer, "footer-name");
    nameSpan.textContent = "Created by voiceinthedark";
    const logoSpan = this.#uimanager.addElement(
      "span",
      footer,
      "footer-logo-span",
    );
    const logoLink = this.#uimanager.addElement("a", logoSpan, "footer-link");
    if (logoLink instanceof HTMLLinkElement) {
      logoLink.href = "https://github.com/voiceinthedark";
    }
    const githubLink = this.#uimanager.addElement(
      "i",
      logoLink,
      "footer-github",
    );
    if (githubLink instanceof HTMLElement) {
      githubLink.classList.add("fa-brands");
      githubLink.classList.add("fa-github");
    }

    return footer;
  }
}

/** @module FooterUI */
export default FooterUI;
