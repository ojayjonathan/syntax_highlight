import { ParserTree, Node } from "./Parser.js";

export class HtmlRender {
  /**
   *
   * @param {HTMLElement} element
   */
  constructor(element) {
    this.element = element;
    this.element.parentNode.classList +="syntax"
  }
  /**
   *
   * @param {ParserTree} parser
   */
  render(parser) {
    this.htmlString = "";
    parser._root.traverse(this.start.bind(this), this.close.bind(this));
    this.element.innerHTML = this.htmlString;
  }
  /**
   *
   * @param {Node} node
   */
  start(node) {
    this.htmlString += `<span class=${node.cssClass || ""}>`;
  }
  /**
   *
   * @param {Node} node
   */
  close(node) {
    this.htmlString += `${node.value || ""}</span>`;
  }
}
