"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/parse-entities@2.0.0";
exports.ids = ["vendor-chunks/parse-entities@2.0.0"];
exports.modules = {

/***/ "(pages-dir-node)/../../../../node_modules/.pnpm/parse-entities@2.0.0/node_modules/parse-entities/decode-entity.js":
/*!********************************************************************************************************!*\
  !*** ../../../../node_modules/.pnpm/parse-entities@2.0.0/node_modules/parse-entities/decode-entity.js ***!
  \********************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar characterEntities = __webpack_require__(/*! character-entities */ \"(pages-dir-node)/../../../../node_modules/.pnpm/character-entities@1.2.4/node_modules/character-entities/index.json\")\n\nmodule.exports = decodeEntity\n\nvar own = {}.hasOwnProperty\n\nfunction decodeEntity(characters) {\n  return own.call(characterEntities, characters)\n    ? characterEntities[characters]\n    : false\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcGFyc2UtZW50aXRpZXNAMi4wLjAvbm9kZV9tb2R1bGVzL3BhcnNlLWVudGl0aWVzL2RlY29kZS1lbnRpdHkuanMiLCJtYXBwaW5ncyI6IkFBQVk7O0FBRVosd0JBQXdCLG1CQUFPLENBQUMsK0lBQW9COztBQUVwRDs7QUFFQSxZQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIi9Vc2Vycy9qYWltZWlzcmFlbGNhbXBlYXMva2V5c3RvbmUvbm9kZV9tb2R1bGVzLy5wbnBtL3BhcnNlLWVudGl0aWVzQDIuMC4wL25vZGVfbW9kdWxlcy9wYXJzZS1lbnRpdGllcy9kZWNvZGUtZW50aXR5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG52YXIgY2hhcmFjdGVyRW50aXRpZXMgPSByZXF1aXJlKCdjaGFyYWN0ZXItZW50aXRpZXMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlY29kZUVudGl0eVxuXG52YXIgb3duID0ge30uaGFzT3duUHJvcGVydHlcblxuZnVuY3Rpb24gZGVjb2RlRW50aXR5KGNoYXJhY3RlcnMpIHtcbiAgcmV0dXJuIG93bi5jYWxsKGNoYXJhY3RlckVudGl0aWVzLCBjaGFyYWN0ZXJzKVxuICAgID8gY2hhcmFjdGVyRW50aXRpZXNbY2hhcmFjdGVyc11cbiAgICA6IGZhbHNlXG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/../../../../node_modules/.pnpm/parse-entities@2.0.0/node_modules/parse-entities/decode-entity.js\n");

/***/ }),

/***/ "../../../../node_modules/.pnpm/parse-entities@2.0.0/node_modules/parse-entities/decode-entity.js":
/*!********************************************************************************************************!*\
  !*** ../../../../node_modules/.pnpm/parse-entities@2.0.0/node_modules/parse-entities/decode-entity.js ***!
  \********************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nvar characterEntities = __webpack_require__(/*! character-entities */ \"../../../../node_modules/.pnpm/character-entities@1.2.4/node_modules/character-entities/index.json\")\n\nmodule.exports = decodeEntity\n\nvar own = {}.hasOwnProperty\n\nfunction decodeEntity(characters) {\n  return own.call(characterEntities, characters)\n    ? characterEntities[characters]\n    : false\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3BhcnNlLWVudGl0aWVzQDIuMC4wL25vZGVfbW9kdWxlcy9wYXJzZS1lbnRpdGllcy9kZWNvZGUtZW50aXR5LmpzIiwibWFwcGluZ3MiOiJBQUFZOztBQUVaLHdCQUF3QixtQkFBTyxDQUFDLDhIQUFvQjs7QUFFcEQ7O0FBRUEsWUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyIvVXNlcnMvamFpbWVpc3JhZWxjYW1wZWFzL2tleXN0b25lL25vZGVfbW9kdWxlcy8ucG5wbS9wYXJzZS1lbnRpdGllc0AyLjAuMC9ub2RlX21vZHVsZXMvcGFyc2UtZW50aXRpZXMvZGVjb2RlLWVudGl0eS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxudmFyIGNoYXJhY3RlckVudGl0aWVzID0gcmVxdWlyZSgnY2hhcmFjdGVyLWVudGl0aWVzJylcblxubW9kdWxlLmV4cG9ydHMgPSBkZWNvZGVFbnRpdHlcblxudmFyIG93biA9IHt9Lmhhc093blByb3BlcnR5XG5cbmZ1bmN0aW9uIGRlY29kZUVudGl0eShjaGFyYWN0ZXJzKSB7XG4gIHJldHVybiBvd24uY2FsbChjaGFyYWN0ZXJFbnRpdGllcywgY2hhcmFjdGVycylcbiAgICA/IGNoYXJhY3RlckVudGl0aWVzW2NoYXJhY3RlcnNdXG4gICAgOiBmYWxzZVxufVxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///../../../../node_modules/.pnpm/parse-entities@2.0.0/node_modules/parse-entities/decode-entity.js\n");

/***/ })

};
;