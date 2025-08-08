"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/mdast-util-to-string@2.0.0";
exports.ids = ["vendor-chunks/mdast-util-to-string@2.0.0"];
exports.modules = {

/***/ "(pages-dir-node)/../../../../node_modules/.pnpm/mdast-util-to-string@2.0.0/node_modules/mdast-util-to-string/index.js":
/*!************************************************************************************************************!*\
  !*** ../../../../node_modules/.pnpm/mdast-util-to-string@2.0.0/node_modules/mdast-util-to-string/index.js ***!
  \************************************************************************************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = toString\n\n// Get the text content of a node.\n// Prefer the node’s plain-text fields, otherwise serialize its children,\n// and if the given value is an array, serialize the nodes in it.\nfunction toString(node) {\n  return (\n    (node &&\n      (node.value ||\n        node.alt ||\n        node.title ||\n        ('children' in node && all(node.children)) ||\n        ('length' in node && all(node)))) ||\n    ''\n  )\n}\n\nfunction all(values) {\n  var result = []\n  var index = -1\n\n  while (++index < values.length) {\n    result[index] = toString(values[index])\n  }\n\n  return result.join('')\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbWRhc3QtdXRpbC10by1zdHJpbmdAMi4wLjAvbm9kZV9tb2R1bGVzL21kYXN0LXV0aWwtdG8tc3RyaW5nL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFZOztBQUVaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBIiwic291cmNlcyI6WyIvVXNlcnMvamFpbWVpc3JhZWxjYW1wZWFzL2tleXN0b25lL25vZGVfbW9kdWxlcy8ucG5wbS9tZGFzdC11dGlsLXRvLXN0cmluZ0AyLjAuMC9ub2RlX21vZHVsZXMvbWRhc3QtdXRpbC10by1zdHJpbmcvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gdG9TdHJpbmdcblxuLy8gR2V0IHRoZSB0ZXh0IGNvbnRlbnQgb2YgYSBub2RlLlxuLy8gUHJlZmVyIHRoZSBub2Rl4oCZcyBwbGFpbi10ZXh0IGZpZWxkcywgb3RoZXJ3aXNlIHNlcmlhbGl6ZSBpdHMgY2hpbGRyZW4sXG4vLyBhbmQgaWYgdGhlIGdpdmVuIHZhbHVlIGlzIGFuIGFycmF5LCBzZXJpYWxpemUgdGhlIG5vZGVzIGluIGl0LlxuZnVuY3Rpb24gdG9TdHJpbmcobm9kZSkge1xuICByZXR1cm4gKFxuICAgIChub2RlICYmXG4gICAgICAobm9kZS52YWx1ZSB8fFxuICAgICAgICBub2RlLmFsdCB8fFxuICAgICAgICBub2RlLnRpdGxlIHx8XG4gICAgICAgICgnY2hpbGRyZW4nIGluIG5vZGUgJiYgYWxsKG5vZGUuY2hpbGRyZW4pKSB8fFxuICAgICAgICAoJ2xlbmd0aCcgaW4gbm9kZSAmJiBhbGwobm9kZSkpKSkgfHxcbiAgICAnJ1xuICApXG59XG5cbmZ1bmN0aW9uIGFsbCh2YWx1ZXMpIHtcbiAgdmFyIHJlc3VsdCA9IFtdXG4gIHZhciBpbmRleCA9IC0xXG5cbiAgd2hpbGUgKCsraW5kZXggPCB2YWx1ZXMubGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IHRvU3RyaW5nKHZhbHVlc1tpbmRleF0pXG4gIH1cblxuICByZXR1cm4gcmVzdWx0LmpvaW4oJycpXG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/../../../../node_modules/.pnpm/mdast-util-to-string@2.0.0/node_modules/mdast-util-to-string/index.js\n");

/***/ }),

/***/ "../../../../node_modules/.pnpm/mdast-util-to-string@2.0.0/node_modules/mdast-util-to-string/index.js":
/*!************************************************************************************************************!*\
  !*** ../../../../node_modules/.pnpm/mdast-util-to-string@2.0.0/node_modules/mdast-util-to-string/index.js ***!
  \************************************************************************************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = toString\n\n// Get the text content of a node.\n// Prefer the node’s plain-text fields, otherwise serialize its children,\n// and if the given value is an array, serialize the nodes in it.\nfunction toString(node) {\n  return (\n    (node &&\n      (node.value ||\n        node.alt ||\n        node.title ||\n        ('children' in node && all(node.children)) ||\n        ('length' in node && all(node)))) ||\n    ''\n  )\n}\n\nfunction all(values) {\n  var result = []\n  var index = -1\n\n  while (++index < values.length) {\n    result[index] = toString(values[index])\n  }\n\n  return result.join('')\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL21kYXN0LXV0aWwtdG8tc3RyaW5nQDIuMC4wL25vZGVfbW9kdWxlcy9tZGFzdC11dGlsLXRvLXN0cmluZy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBWTs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSIsInNvdXJjZXMiOlsiL1VzZXJzL2phaW1laXNyYWVsY2FtcGVhcy9rZXlzdG9uZS9ub2RlX21vZHVsZXMvLnBucG0vbWRhc3QtdXRpbC10by1zdHJpbmdAMi4wLjAvbm9kZV9tb2R1bGVzL21kYXN0LXV0aWwtdG8tc3RyaW5nL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU3RyaW5nXG5cbi8vIEdldCB0aGUgdGV4dCBjb250ZW50IG9mIGEgbm9kZS5cbi8vIFByZWZlciB0aGUgbm9kZeKAmXMgcGxhaW4tdGV4dCBmaWVsZHMsIG90aGVyd2lzZSBzZXJpYWxpemUgaXRzIGNoaWxkcmVuLFxuLy8gYW5kIGlmIHRoZSBnaXZlbiB2YWx1ZSBpcyBhbiBhcnJheSwgc2VyaWFsaXplIHRoZSBub2RlcyBpbiBpdC5cbmZ1bmN0aW9uIHRvU3RyaW5nKG5vZGUpIHtcbiAgcmV0dXJuIChcbiAgICAobm9kZSAmJlxuICAgICAgKG5vZGUudmFsdWUgfHxcbiAgICAgICAgbm9kZS5hbHQgfHxcbiAgICAgICAgbm9kZS50aXRsZSB8fFxuICAgICAgICAoJ2NoaWxkcmVuJyBpbiBub2RlICYmIGFsbChub2RlLmNoaWxkcmVuKSkgfHxcbiAgICAgICAgKCdsZW5ndGgnIGluIG5vZGUgJiYgYWxsKG5vZGUpKSkpIHx8XG4gICAgJydcbiAgKVxufVxuXG5mdW5jdGlvbiBhbGwodmFsdWVzKSB7XG4gIHZhciByZXN1bHQgPSBbXVxuICB2YXIgaW5kZXggPSAtMVxuXG4gIHdoaWxlICgrK2luZGV4IDwgdmFsdWVzLmxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSB0b1N0cmluZyh2YWx1ZXNbaW5kZXhdKVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKVxufVxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///../../../../node_modules/.pnpm/mdast-util-to-string@2.0.0/node_modules/mdast-util-to-string/index.js\n");

/***/ })

};
;