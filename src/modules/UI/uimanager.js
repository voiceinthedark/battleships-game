// @ts-check

class UIManager {
  #container;
  #icons;
  /** @type {HTMLElement | null} */
  #loadingElement = null;
  /**
   * @param {Node} appContainer - Node element for the application container
   * @param {Object<string, string>} icons - object containing icon names as keys and values as the path
   * */
  constructor(appContainer, icons) {
    this.#container = appContainer;
    this.#icons = icons;
  }

  /**
   * Shows a loading spinner/message in the main app container.
   */
  showLoading() {
    if (this.#loadingElement) {
      return;
    }

    this.#loadingElement = this.addElement(
      "div",
      this.#container,
      "loading-spinner",
    );
    if (this.#loadingElement instanceof HTMLElement) {
      this.#loadingElement.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Loading data...';
    }
  }

  /**
   * Hides and removes the loading spinner/message.
   */
  hideLoading() {
    if (this.#loadingElement && this.#loadingElement.parentNode) {
      this.#loadingElement.parentNode.removeChild(this.#loadingElement);
      this.#loadingElement = null;
    }
  }

  /**
   * @param {Node} parent - Parent element to add div to
   * @param {string} cls - css class to add to div element
   * */
  addDiv(parent, cls) {
    const div = document.createElement("div");
    div.classList.add(cls);
    parent.appendChild(div);
  }

  /**
   * @param {string} type - type of node element
   * @param {Node} parent - parent node of the element
   * @param {string} cls - css class of the element
   * @returns {HTMLElement} - created element
   * */
  addElement(type, parent, cls) {
    const elem = document.createElement(type);
    elem.classList.add(cls);
    parent.appendChild(elem);

    return elem;
  }

  /**
   * @typedef {[Node, number]} NodeWithCount
   */

  /**
   * @param {Node} parent - parent element of the removed child
   * @param {Node} element - the Element to be removed
   * @returns {NodeWithCount|number} - returns an array containing the removed element and parent childs count
   * */
  removeElement(parent, element) {
    if (parent.childNodes.length === 0) {
      return 0;
    }
    const removed = parent.removeChild(element);
    const parentLength = parent.childNodes.length;

    return [removed, parentLength];
  }

  /**
   * @method to clear all child elements of a parent element
   * @param {HTMLElement} parent
   * @description clear all the elements inside of parent
   **/
  clearElement(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  get container() {
    return this.#container;
  }
  /**
   * @returns {Object<string, string>} The collection of loaded icons.
   */
  get icons() {
    return this.#icons;
  }
}

export default UIManager;
