const mk = (tag, opts = {}) => Object.assign(document.createElement(tag), opts);
const add = (child, parent = document.body) => parent.appendChild(child);
const rem = (child, parent = document.body) => parent.removeChild(child);
const el = (id) => document.getElementById(id);
const style = (element, styles) => Object.assign(element.style, styles);
export { mk, add, rem, el, style };