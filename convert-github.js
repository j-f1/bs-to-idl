// usage: node convert-github https://github.com/whatwg/dom/blob/master/dom.bs
const url = new URL(process.argv[2]);
console.log(
  "https://raw.githubusercontent.com" + url.pathname.replace("/blob/", "/")
);
