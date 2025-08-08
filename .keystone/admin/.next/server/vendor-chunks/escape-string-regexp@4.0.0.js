"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/escape-string-regexp@4.0.0";
exports.ids = ["vendor-chunks/escape-string-regexp@4.0.0"];
exports.modules = {

/***/ "(pages-dir-node)/../../../../node_modules/.pnpm/escape-string-regexp@4.0.0/node_modules/escape-string-regexp/index.js":
/*!************************************************************************************************************!*\
  !*** ../../../../node_modules/.pnpm/escape-string-regexp@4.0.0/node_modules/escape-string-regexp/index.js ***!
  \************************************************************************************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = string => {\n\tif (typeof string !== 'string') {\n\t\tthrow new TypeError('Expected a string');\n\t}\n\n\t// Escape characters with special meaning either inside or outside character sets.\n\t// Use a simple backslash escape when it’s always valid, and a \\unnnn escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.\n\treturn string\n\t\t.replace(/[|\\\\{}()[\\]^$+*?.]/g, '\\\\$&')\n\t\t.replace(/-/g, '\\\\x2d');\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vZXNjYXBlLXN0cmluZy1yZWdleHBANC4wLjAvbm9kZV9tb2R1bGVzL2VzY2FwZS1zdHJpbmctcmVnZXhwL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBIiwic291cmNlcyI6WyIvVXNlcnMvamFpbWVpc3JhZWxjYW1wZWFzL2tleXN0b25lL25vZGVfbW9kdWxlcy8ucG5wbS9lc2NhcGUtc3RyaW5nLXJlZ2V4cEA0LjAuMC9ub2RlX21vZHVsZXMvZXNjYXBlLXN0cmluZy1yZWdleHAvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmluZyA9PiB7XG5cdGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgc3RyaW5nJyk7XG5cdH1cblxuXHQvLyBFc2NhcGUgY2hhcmFjdGVycyB3aXRoIHNwZWNpYWwgbWVhbmluZyBlaXRoZXIgaW5zaWRlIG9yIG91dHNpZGUgY2hhcmFjdGVyIHNldHMuXG5cdC8vIFVzZSBhIHNpbXBsZSBiYWNrc2xhc2ggZXNjYXBlIHdoZW4gaXTigJlzIGFsd2F5cyB2YWxpZCwgYW5kIGEgXFx1bm5ubiBlc2NhcGUgd2hlbiB0aGUgc2ltcGxlciBmb3JtIHdvdWxkIGJlIGRpc2FsbG93ZWQgYnkgVW5pY29kZSBwYXR0ZXJuc+KAmSBzdHJpY3RlciBncmFtbWFyLlxuXHRyZXR1cm4gc3RyaW5nXG5cdFx0LnJlcGxhY2UoL1t8XFxcXHt9KClbXFxdXiQrKj8uXS9nLCAnXFxcXCQmJylcblx0XHQucmVwbGFjZSgvLS9nLCAnXFxcXHgyZCcpO1xufTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(pages-dir-node)/../../../../node_modules/.pnpm/escape-string-regexp@4.0.0/node_modules/escape-string-regexp/index.js\n");

/***/ }),

/***/ "../../../../node_modules/.pnpm/escape-string-regexp@4.0.0/node_modules/escape-string-regexp/index.js":
/*!************************************************************************************************************!*\
  !*** ../../../../node_modules/.pnpm/escape-string-regexp@4.0.0/node_modules/escape-string-regexp/index.js ***!
  \************************************************************************************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = string => {\n\tif (typeof string !== 'string') {\n\t\tthrow new TypeError('Expected a string');\n\t}\n\n\t// Escape characters with special meaning either inside or outside character sets.\n\t// Use a simple backslash escape when it’s always valid, and a \\unnnn escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.\n\treturn string\n\t\t.replace(/[|\\\\{}()[\\]^$+*?.]/g, '\\\\$&')\n\t\t.replace(/-/g, '\\\\x2d');\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2VzY2FwZS1zdHJpbmctcmVnZXhwQDQuMC4wL25vZGVfbW9kdWxlcy9lc2NhcGUtc3RyaW5nLXJlZ2V4cC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQSIsInNvdXJjZXMiOlsiL1VzZXJzL2phaW1laXNyYWVsY2FtcGVhcy9rZXlzdG9uZS9ub2RlX21vZHVsZXMvLnBucG0vZXNjYXBlLXN0cmluZy1yZWdleHBANC4wLjAvbm9kZV9tb2R1bGVzL2VzY2FwZS1zdHJpbmctcmVnZXhwL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmcgPT4ge1xuXHRpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIHN0cmluZycpO1xuXHR9XG5cblx0Ly8gRXNjYXBlIGNoYXJhY3RlcnMgd2l0aCBzcGVjaWFsIG1lYW5pbmcgZWl0aGVyIGluc2lkZSBvciBvdXRzaWRlIGNoYXJhY3RlciBzZXRzLlxuXHQvLyBVc2UgYSBzaW1wbGUgYmFja3NsYXNoIGVzY2FwZSB3aGVuIGl04oCZcyBhbHdheXMgdmFsaWQsIGFuZCBhIFxcdW5ubm4gZXNjYXBlIHdoZW4gdGhlIHNpbXBsZXIgZm9ybSB3b3VsZCBiZSBkaXNhbGxvd2VkIGJ5IFVuaWNvZGUgcGF0dGVybnPigJkgc3RyaWN0ZXIgZ3JhbW1hci5cblx0cmV0dXJuIHN0cmluZ1xuXHRcdC5yZXBsYWNlKC9bfFxcXFx7fSgpW1xcXV4kKyo/Ll0vZywgJ1xcXFwkJicpXG5cdFx0LnJlcGxhY2UoLy0vZywgJ1xcXFx4MmQnKTtcbn07XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///../../../../node_modules/.pnpm/escape-string-regexp@4.0.0/node_modules/escape-string-regexp/index.js\n");

/***/ })

};
;