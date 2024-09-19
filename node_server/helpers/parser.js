const jsdom = require("jsdom");

let parseHtmlResponse = (htmlResponse) => {
    let responseDom = new jsdom.JSDOM(htmlResponse.data);
    let responseDocument = responseDom.window.document;
    let jsonResponse = {};
    let spans = responseDocument.querySelectorAll('span');
    for (let i = 0; i < spans.length; i++) {
      let spanClass = spans[i].className;
      jsonResponse[spanClass] = responseDocument.querySelector(`.${spanClass}`).innerHTML.trim();
    }
    return jsonResponse;
  }
  
  module.exports = { parseHtmlResponse };
