const { JSDOM } = require("jsdom");
const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="content"></div></body></html>`);
global.window = dom.window;
global.document = dom.window.document;
global.Math = Math;
try {
  require('./script.js');
  document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  console.log("Init OK");
} catch(e) {
  console.log("ERROR: " + e.message);
}
