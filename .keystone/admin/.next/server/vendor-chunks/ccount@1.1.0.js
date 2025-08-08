"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/ccount@1.1.0";
exports.ids = ["vendor-chunks/ccount@1.1.0"];
exports.modules = {

/***/ "(pages-dir-node)/../../../../node_modules/.pnpm/ccount@1.1.0/node_modules/ccount/index.js":
/*!********************************************************************************!*\
  !*** ../../../../node_modules/.pnpm/ccount@1.1.0/node_modules/ccount/index.js ***!
  \********************************************************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = ccount\n\nfunction ccount(source, character) {\n  var value = String(source)\n  var count = 0\n  var index\n\n  if (typeof character !== 'string') {\n    throw new Error('Expected character')\n  }\n\n  index = value.indexOf(character)\n\n  while (index !== -1) {\n    count++\n    index = value.indexOf(character, index + character.length)\n  }\n\n  return count\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vY2NvdW50QDEuMS4wL25vZGVfbW9kdWxlcy9jY291bnQvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQVk7O0FBRVo7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EiLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYWltZWlzcmFlbGNhbXBlYXMva2V5c3RvbmUvbm9kZV9tb2R1bGVzLy5wbnBtL2Njb3VudEAxLjEuMC9ub2RlX21vZHVsZXMvY2NvdW50L2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNjb3VudFxuXG5mdW5jdGlvbiBjY291bnQoc291cmNlLCBjaGFyYWN0ZXIpIHtcbiAgdmFyIHZhbHVlID0gU3RyaW5nKHNvdXJjZSlcbiAgdmFyIGNvdW50ID0gMFxuICB2YXIgaW5kZXhcblxuICBpZiAodHlwZW9mIGNoYXJhY3RlciAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGNoYXJhY3RlcicpXG4gIH1cblxuICBpbmRleCA9IHZhbHVlLmluZGV4T2YoY2hhcmFjdGVyKVxuXG4gIHdoaWxlIChpbmRleCAhPT0gLTEpIHtcbiAgICBjb3VudCsrXG4gICAgaW5kZXggPSB2YWx1ZS5pbmRleE9mKGNoYXJhY3RlciwgaW5kZXggKyBjaGFyYWN0ZXIubGVuZ3RoKVxuICB9XG5cbiAgcmV0dXJuIGNvdW50XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/../../../../node_modules/.pnpm/ccount@1.1.0/node_modules/ccount/index.js\n");

/***/ }),

/***/ "../../../../node_modules/.pnpm/ccount@1.1.0/node_modules/ccount/index.js":
/*!********************************************************************************!*\
  !*** ../../../../node_modules/.pnpm/ccount@1.1.0/node_modules/ccount/index.js ***!
  \********************************************************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = ccount\n\nfunction ccount(source, character) {\n  var value = String(source)\n  var count = 0\n  var index\n\n  if (typeof character !== 'string') {\n    throw new Error('Expected character')\n  }\n\n  index = value.indexOf(character)\n\n  while (index !== -1) {\n    count++\n    index = value.indexOf(character, index + character.length)\n  }\n\n  return count\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2Njb3VudEAxLjEuMC9ub2RlX21vZHVsZXMvY2NvdW50L2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFZOztBQUVaOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBIiwic291cmNlcyI6WyIvVXNlcnMvamFpbWVpc3JhZWxjYW1wZWFzL2tleXN0b25lL25vZGVfbW9kdWxlcy8ucG5wbS9jY291bnRAMS4xLjAvbm9kZV9tb2R1bGVzL2Njb3VudC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBjY291bnRcblxuZnVuY3Rpb24gY2NvdW50KHNvdXJjZSwgY2hhcmFjdGVyKSB7XG4gIHZhciB2YWx1ZSA9IFN0cmluZyhzb3VyY2UpXG4gIHZhciBjb3VudCA9IDBcbiAgdmFyIGluZGV4XG5cbiAgaWYgKHR5cGVvZiBjaGFyYWN0ZXIgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBjaGFyYWN0ZXInKVxuICB9XG5cbiAgaW5kZXggPSB2YWx1ZS5pbmRleE9mKGNoYXJhY3RlcilcblxuICB3aGlsZSAoaW5kZXggIT09IC0xKSB7XG4gICAgY291bnQrK1xuICAgIGluZGV4ID0gdmFsdWUuaW5kZXhPZihjaGFyYWN0ZXIsIGluZGV4ICsgY2hhcmFjdGVyLmxlbmd0aClcbiAgfVxuXG4gIHJldHVybiBjb3VudFxufVxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///../../../../node_modules/.pnpm/ccount@1.1.0/node_modules/ccount/index.js\n");

/***/ })

};
;