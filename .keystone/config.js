"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core9 = require("@keystone-6/core");
var import_session = require("@keystone-6/core/session");

// ../../packages/auth/src/schema.ts
var import_graphql2 = require("../../../node_modules/.pnpm/graphql@16.10.0/node_modules/graphql/index.js");
var import_core3 = require("@keystone-6/core");

// ../../packages/auth/src/gql/getBaseAuthSchema.ts
var import_core = require("@keystone-6/core");
var import_password = require("@keystone-6/core/fields/types/password");
var AUTHENTICATION_FAILURE = {
  code: "FAILURE",
  message: "Authentication failed."
};
function getBaseAuthSchema({
  authGqlNames,
  listKey,
  identityField,
  secretField,
  base
}) {
  const kdf = (0, import_password.getPasswordFieldKDF)(base.schema, listKey, secretField);
  if (!kdf) {
    throw new Error(`${listKey}.${secretField} is not a valid password field.`);
  }
  const ItemAuthenticationWithPasswordSuccess = import_core.g.object()({
    name: authGqlNames.ItemAuthenticationWithPasswordSuccess,
    fields: {
      sessionToken: import_core.g.field({ type: import_core.g.nonNull(import_core.g.String) }),
      item: import_core.g.field({ type: import_core.g.nonNull(base.object(listKey)) })
    }
  });
  const ItemAuthenticationWithPasswordFailure = import_core.g.object()({
    name: authGqlNames.ItemAuthenticationWithPasswordFailure,
    fields: {
      message: import_core.g.field({ type: import_core.g.nonNull(import_core.g.String) })
    }
  });
  const AuthenticationResult = import_core.g.union({
    name: authGqlNames.ItemAuthenticationWithPasswordResult,
    types: [ItemAuthenticationWithPasswordSuccess, ItemAuthenticationWithPasswordFailure],
    resolveType(val) {
      if ("sessionToken" in val) return authGqlNames.ItemAuthenticationWithPasswordSuccess;
      return authGqlNames.ItemAuthenticationWithPasswordFailure;
    }
  });
  const extension = {
    query: {
      authenticatedItem: import_core.g.field({
        type: base.object(listKey),
        resolve(rootVal, args, context) {
          const { session: session2 } = context;
          if (!session2?.itemId) return null;
          return context.db[listKey].findOne({
            where: {
              id: session2.itemId
            }
          });
        }
      })
    },
    mutation: {
      endSession: import_core.g.field({
        type: import_core.g.nonNull(import_core.g.Boolean),
        async resolve(rootVal, args, context) {
          await context.sessionStrategy?.end({ context });
          return true;
        }
      }),
      [authGqlNames.authenticateItemWithPassword]: import_core.g.field({
        type: AuthenticationResult,
        args: {
          [identityField]: import_core.g.arg({ type: import_core.g.nonNull(import_core.g.String) }),
          [secretField]: import_core.g.arg({ type: import_core.g.nonNull(import_core.g.String) })
        },
        async resolve(rootVal, { [identityField]: identity, [secretField]: secret }, context) {
          if (!context.sessionStrategy) throw new Error("No session strategy on context");
          const item = await context.sudo().db[listKey].findOne({
            where: { [identityField]: identity }
          });
          if (typeof item?.[secretField] !== "string") {
            await kdf.hash("simulated-password-to-counter-timing-attack");
            return AUTHENTICATION_FAILURE;
          }
          const equal = await kdf.compare(secret, item[secretField]);
          if (!equal) return AUTHENTICATION_FAILURE;
          const sessionToken = await context.sessionStrategy.start({
            data: {
              itemId: item.id
            },
            context
          });
          if (typeof sessionToken !== "string" || sessionToken.length === 0) {
            return AUTHENTICATION_FAILURE;
          }
          return {
            sessionToken,
            item
          };
        }
      })
    }
  };
  return {
    extension,
    ItemAuthenticationWithPasswordSuccess
  };
}

// ../../packages/auth/src/gql/getInitFirstItemSchema.ts
var import_core2 = require("@keystone-6/core");
var import_graphql = require("../../../node_modules/.pnpm/graphql@16.10.0/node_modules/graphql/index.js");
var AUTHENTICATION_FAILURE2 = "Authentication failed.";
function getInitFirstItemSchema({
  authGqlNames,
  listKey,
  fields,
  defaultItemData,
  graphQLSchema,
  ItemAuthenticationWithPasswordSuccess
}) {
  const createInputConfig = (0, import_graphql.assertInputObjectType)(
    graphQLSchema.getType(`${listKey}CreateInput`)
  ).toConfig();
  const fieldsSet = new Set(fields);
  const initialCreateInput = new import_graphql.GraphQLInputObjectType({
    ...createInputConfig,
    fields: Object.fromEntries(
      Object.entries(createInputConfig.fields).filter(([fieldKey]) => fieldsSet.has(fieldKey))
    ),
    name: authGqlNames.CreateInitialInput
  });
  return {
    mutation: {
      [authGqlNames.createInitialItem]: import_core2.g.field({
        type: import_core2.g.nonNull(ItemAuthenticationWithPasswordSuccess),
        args: { data: import_core2.g.arg({ type: import_core2.g.nonNull(initialCreateInput) }) },
        async resolve(rootVal, { data }, context) {
          if (!context.sessionStrategy) throw new Error("No session strategy on context");
          const sudoContext = context.sudo();
          const count = await sudoContext.db[listKey].count();
          if (count !== 0) throw AUTHENTICATION_FAILURE2;
          const item = await sudoContext.db[listKey].createOne({
            data: {
              ...defaultItemData,
              ...data
            }
          });
          const sessionToken = await context.sessionStrategy.start({
            data: {
              listKey,
              itemId: item.id
            },
            context
          });
          if (typeof sessionToken !== "string" || sessionToken.length === 0) {
            throw AUTHENTICATION_FAILURE2;
          }
          return {
            sessionToken,
            item
          };
        }
      })
    }
  };
}

// ../../packages/auth/src/schema.ts
var getSchemaExtension = ({
  authGqlNames,
  listKey,
  identityField,
  secretField,
  initFirstItem,
  sessionData
}) => import_core3.g.extend((base) => {
  const uniqueWhereInputType = (0, import_graphql2.assertInputObjectType)(
    base.schema.getType(authGqlNames.whereUniqueInputName)
  );
  const identityFieldOnUniqueWhere = uniqueWhereInputType.getFields()[identityField];
  if (base.schema.extensions.sudo && identityFieldOnUniqueWhere?.type !== import_graphql2.GraphQLString && identityFieldOnUniqueWhere?.type !== import_graphql2.GraphQLID) {
    throw new Error(
      `createAuth was called with an identityField of ${identityField} on the list ${listKey} but that field doesn't allow being searched uniquely with a String or ID. You should likely add \`isIndexed: 'unique'\` to the field at ${listKey}.${identityField}`
    );
  }
  const baseSchema = getBaseAuthSchema({
    authGqlNames,
    identityField,
    listKey,
    secretField,
    base
  });
  const query = `query($id: ID!) { ${authGqlNames.itemQueryName}(where: { id: $id }) { ${sessionData} } }`;
  let ast;
  try {
    ast = (0, import_graphql2.parse)(query);
  } catch (err) {
    throw new Error(
      `The query to get session data has a syntax error, the sessionData option in your createAuth usage is likely incorrect
${err}`
    );
  }
  const errors = (0, import_graphql2.validate)(base.schema, ast);
  if (errors.length) {
    throw new Error(
      `The query to get session data has validation errors, the sessionData option in your createAuth usage is likely incorrect
${errors.join("\n")}`
    );
  }
  return [
    baseSchema.extension,
    initFirstItem && getInitFirstItemSchema({
      authGqlNames,
      listKey,
      fields: initFirstItem.fields,
      defaultItemData: initFirstItem.itemData,
      graphQLSchema: base.schema,
      ItemAuthenticationWithPasswordSuccess: baseSchema.ItemAuthenticationWithPasswordSuccess
    })
  ].filter((x) => x !== void 0);
});

// ../../packages/auth/src/templates/config.ts
function config_default({ labelField }) {
  return `import { type AdminConfig } from '@keystone-6/core/types'
import makeNavigation from '@keystone-6/auth/components/Navigation'

export const components: AdminConfig['components'] = {
  Navigation: makeNavigation({ labelField: '${labelField}' }),
}
`;
}

// ../../packages/auth/src/templates/signin.ts
function signin_default({
  authGqlNames,
  identityField,
  secretField
}) {
  return `import makeSigninPage from '@keystone-6/auth/pages/SigninPage'

export default makeSigninPage(${JSON.stringify({
    authGqlNames,
    identityField,
    secretField
  })})
`;
}

// ../../packages/auth/src/templates/init.ts
function init_default({
  authGqlNames,
  listKey,
  initFirstItem
}) {
  return `import makeInitPage from '@keystone-6/auth/pages/InitPage'

export default makeInitPage(${JSON.stringify({
    listKey,
    authGqlNames,
    fieldPaths: initFirstItem.fields,
    enableWelcome: !initFirstItem.skipKeystoneWelcome
  })})
`;
}

// ../../packages/auth/src/index.ts
function getAuthGqlNames(singular) {
  const lowerSingularName = singular.charAt(0).toLowerCase() + singular.slice(1);
  return {
    itemQueryName: lowerSingularName,
    whereUniqueInputName: `${singular}WhereUniqueInput`,
    authenticateItemWithPassword: `authenticate${singular}WithPassword`,
    ItemAuthenticationWithPasswordResult: `${singular}AuthenticationWithPasswordResult`,
    ItemAuthenticationWithPasswordSuccess: `${singular}AuthenticationWithPasswordSuccess`,
    ItemAuthenticationWithPasswordFailure: `${singular}AuthenticationWithPasswordFailure`,
    CreateInitialInput: `CreateInitial${singular}Input`,
    createInitialItem: `createInitial${singular}`
  };
}
function createAuth({
  listKey,
  secretField,
  initFirstItem,
  identityField,
  sessionData = "id"
}) {
  const authGetAdditionalFiles = (config2) => {
    const listConfig = config2.lists[listKey];
    const labelField = listConfig.ui?.labelField ?? (listConfig.fields.label ? "label" : listConfig.fields.name ? "name" : listConfig.fields.title ? "title" : "id");
    const authGqlNames = getAuthGqlNames(listConfig.graphql?.singular ?? listKey);
    const filesToWrite = [
      {
        mode: "write",
        src: signin_default({ authGqlNames, identityField, secretField }),
        outputPath: "pages/signin.js"
      },
      {
        mode: "write",
        src: config_default({ labelField }),
        outputPath: "config.ts"
      }
    ];
    if (initFirstItem) {
      filesToWrite.push({
        mode: "write",
        src: init_default({ authGqlNames, listKey, initFirstItem }),
        outputPath: "pages/init.js"
      });
    }
    return filesToWrite;
  };
  function throwIfInvalidConfig(config2) {
    if (!(listKey in config2.lists)) {
      throw new Error(`withAuth cannot find the list "${listKey}"`);
    }
    const list2 = config2.lists[listKey];
    if (!(identityField in list2.fields)) {
      throw new Error(`withAuth cannot find the identity field "${listKey}.${identityField}"`);
    }
    if (!(secretField in list2.fields)) {
      throw new Error(`withAuth cannot find the secret field "${listKey}.${secretField}"`);
    }
    for (const fieldKey of initFirstItem?.fields || []) {
      if (fieldKey in list2.fields) continue;
      throw new Error(`initFirstItem.fields has unknown field "${listKey}.${fieldKey}"`);
    }
  }
  function authSessionStrategy(_sessionStrategy) {
    const { get, ...sessionStrategy } = _sessionStrategy;
    return {
      ...sessionStrategy,
      get: async ({ context }) => {
        const session2 = await get({ context });
        const sudoContext = context.sudo();
        if (!session2?.itemId) return;
        try {
          const data = await sudoContext.query[listKey].findOne({
            where: { id: session2.itemId },
            query: sessionData
          });
          if (!data) return;
          return {
            ...session2,
            itemId: session2.itemId,
            data
          };
        } catch (e) {
          console.error(e);
          return;
        }
      }
    };
  }
  async function hasInitFirstItemConditions(context) {
    if (!initFirstItem) return false;
    if (context.session) return false;
    const count = await context.sudo().db[listKey].count({});
    return count === 0;
  }
  async function authMiddleware({
    context,
    wasAccessAllowed,
    basePath
  }) {
    const { req } = context;
    const { pathname } = new URL(req.url, "http://_");
    if (pathname !== `${basePath}/init` && await hasInitFirstItemConditions(context)) {
      return { kind: "redirect", to: `${basePath}/init` };
    }
    if (pathname === `${basePath}/init` && !await hasInitFirstItemConditions(context)) {
      return { kind: "redirect", to: basePath };
    }
    if (wasAccessAllowed) return;
    return { kind: "redirect", to: `${basePath}/signin` };
  }
  function defaultIsAccessAllowed({ session: session2 }) {
    return session2 !== void 0;
  }
  function defaultExtendGraphqlSchema(schema) {
    return schema;
  }
  function withAuth2(config2) {
    throwIfInvalidConfig(config2);
    let { ui } = config2;
    if (!ui?.isDisabled) {
      const {
        getAdditionalFiles = [],
        isAccessAllowed = defaultIsAccessAllowed,
        pageMiddleware,
        publicPages = []
      } = ui || {};
      const authPublicPages = [`${ui?.basePath ?? ""}/signin`];
      ui = {
        ...ui,
        publicPages: [...publicPages, ...authPublicPages],
        getAdditionalFiles: [...getAdditionalFiles, () => authGetAdditionalFiles(config2)],
        isAccessAllowed: async (context) => {
          if (await hasInitFirstItemConditions(context)) return true;
          return isAccessAllowed(context);
        },
        pageMiddleware: async (args) => {
          const shouldRedirect = await authMiddleware(args);
          if (shouldRedirect) return shouldRedirect;
          return pageMiddleware?.(args);
        }
      };
    }
    if (!config2.session) throw new TypeError("Missing .session configuration");
    const { graphql } = config2;
    const { extendGraphqlSchema = defaultExtendGraphqlSchema } = graphql ?? {};
    const listConfig = config2.lists[listKey];
    const authGqlNames = getAuthGqlNames(listConfig.graphql?.singular ?? listKey);
    const authExtendGraphqlSchema = getSchemaExtension({
      authGqlNames,
      listKey,
      identityField,
      secretField,
      initFirstItem,
      sessionData
    });
    return {
      ...config2,
      graphql: {
        ...config2.graphql,
        extendGraphqlSchema: (schema) => {
          return extendGraphqlSchema(authExtendGraphqlSchema(schema));
        }
      },
      ui,
      session: authSessionStrategy(config2.session),
      lists: {
        ...config2.lists,
        [listKey]: {
          ...listConfig,
          fields: {
            ...listConfig.fields
          }
        }
      }
    };
  }
  return {
    withAuth: withAuth2
  };
}

// keystone.ts
var import_bytes = __toESM(require("bytes"));
var import_express = __toESM(require("express"));

// schema.ts
var import_core8 = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");

// ../../packages/fields-document/src/index.ts
var import_core7 = require("@keystone-6/core");
var import_types2 = require("@keystone-6/core/types");
var import_graphql3 = require("../../../node_modules/.pnpm/graphql@16.10.0/node_modules/graphql/index.js");

// ../../packages/fields-document/src/DocumentEditor/utils.ts
var import_slate = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
var IS_MAC = typeof window != "undefined" && /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);
function moveChildren(editor, parent, to, shouldMoveNode = () => true) {
  const parentPath = import_slate.Path.isPath(parent) ? parent : parent[1];
  const parentNode = import_slate.Path.isPath(parent) ? import_slate.Node.get(editor, parentPath) : parent[0];
  if (!(import_slate.Element.isElement(parentNode) && import_slate.Editor.isBlock(editor, parentNode))) return;
  for (let i = parentNode.children.length - 1; i >= 0; i--) {
    if (shouldMoveNode(parentNode.children[i])) {
      const childPath = [...parentPath, i];
      import_slate.Transforms.moveNodes(editor, { at: childPath, to });
    }
  }
}
function insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, nodes, slate) {
  let pathRefForEmptyNodeAtCursor;
  const entry = import_slate.Editor.above(editor, {
    match: (node) => node.type === "heading" || node.type === "paragraph"
  });
  if (entry && import_slate.Node.string(entry[0]) === "") {
    pathRefForEmptyNodeAtCursor = import_slate.Editor.pathRef(editor, entry[1]);
  }
  import_slate.Transforms.insertNodes(editor, nodes);
  const path = pathRefForEmptyNodeAtCursor?.unref();
  if (path) {
    import_slate.Transforms.removeNodes(editor, { at: path });
    slate?.ReactEditor.focus(editor);
  }
}
function EditorAfterButIgnoringingPointsWithNoContent(editor, at, {
  distance = 1
} = {}) {
  const anchor = import_slate.Editor.point(editor, at, { edge: "end" });
  const focus = import_slate.Editor.end(editor, []);
  const range = { anchor, focus };
  let d = 0;
  let target;
  for (const p of import_slate.Editor.positions(editor, {
    at: range
  })) {
    if (d > distance) break;
    const node = import_slate.Node.get(editor, p.path);
    if (node.text.length === p.offset) continue;
    if (d !== 0) {
      target = p;
    }
    d++;
  }
  return target;
}
function nodeTypeMatcher(...args) {
  if (args.length === 1) {
    const type = args[0];
    return (node) => node.type === type;
  }
  const set = new Set(args);
  return (node) => typeof node.type === "string" && set.has(node.type);
}
function assert(condition) {
  if (!condition) throw new Error("failed assert");
}

// ../../packages/fields-document/src/DocumentEditor/component-blocks/initial-values.ts
function getInitialPropsValue(schema) {
  switch (schema.kind) {
    case "form":
      return schema.defaultValue;
    case "child":
      return null;
    case "relationship":
      return schema.many ? [] : null;
    case "conditional": {
      const defaultValue = schema.discriminant.defaultValue;
      return {
        discriminant: defaultValue,
        value: getInitialPropsValue(schema.values[defaultValue.toString()])
      };
    }
    case "object": {
      const obj = {};
      for (const key of Object.keys(schema.fields)) {
        obj[key] = getInitialPropsValue(schema.fields[key]);
      }
      return obj;
    }
    case "array":
      return [];
  }
  assertNever(schema);
}

// ../../packages/fields-document/src/DocumentEditor/component-blocks/preview-props.ts
var arrayValuesToElementKeys = /* @__PURE__ */ new WeakMap();
var counter = 0;
function getKeysForArrayValue(value) {
  if (!arrayValuesToElementKeys.has(value)) {
    arrayValuesToElementKeys.set(value, Array.from({ length: value.length }, getNewArrayElementKey));
  }
  return arrayValuesToElementKeys.get(value);
}
function setKeysForArrayValue(value, elementIds) {
  arrayValuesToElementKeys.set(value, elementIds);
}
function getNewArrayElementKey() {
  return (counter++).toString();
}

// ../../packages/fields-document/src/DocumentEditor/component-blocks/utils.ts
function findChildPropPathsForProp(value, schema, path) {
  switch (schema.kind) {
    case "form":
    case "relationship":
      return [];
    case "child":
      return [{ path, options: schema.options }];
    case "conditional":
      return findChildPropPathsForProp(
        value.value,
        schema.values[value.discriminant],
        path.concat("value")
      );
    case "object": {
      const paths = [];
      Object.keys(schema.fields).forEach((key) => {
        paths.push(...findChildPropPathsForProp(value[key], schema.fields[key], path.concat(key)));
      });
      return paths;
    }
    case "array": {
      const paths = [];
      value.forEach((val, i) => {
        paths.push(...findChildPropPathsForProp(val, schema.element, path.concat(i)));
      });
      return paths;
    }
  }
}
function findChildPropPaths(value, props) {
  const propPaths = findChildPropPathsForProp(value, { kind: "object", fields: props }, []);
  if (propPaths.length) return propPaths;
  return [
    {
      path: void 0,
      options: { kind: "inline", placeholder: "" }
    }
  ];
}
function assertNever(arg) {
  throw new Error("expected to never be called but received: " + JSON.stringify(arg));
}
function getDocumentFeaturesForChildField(editorDocumentFeatures, options) {
  const inlineMarksFromOptions = options.formatting?.inlineMarks;
  const inlineMarks = inlineMarksFromOptions === "inherit" ? "inherit" : Object.fromEntries(
    Object.keys(editorDocumentFeatures.formatting.inlineMarks).map((mark) => {
      return [mark, !!(inlineMarksFromOptions || {})[mark]];
    })
  );
  if (options.kind === "inline") {
    return {
      kind: "inline",
      inlineMarks,
      documentFeatures: {
        links: options.links === "inherit",
        relationships: options.relationships === "inherit"
      },
      softBreaks: options.formatting?.softBreaks === "inherit"
    };
  }
  return {
    kind: "block",
    inlineMarks,
    softBreaks: options.formatting?.softBreaks === "inherit",
    documentFeatures: {
      layouts: [],
      dividers: options.dividers === "inherit" ? editorDocumentFeatures.dividers : false,
      formatting: {
        alignment: options.formatting?.alignment === "inherit" ? editorDocumentFeatures.formatting.alignment : {
          center: false,
          end: false
        },
        blockTypes: options.formatting?.blockTypes === "inherit" ? editorDocumentFeatures.formatting.blockTypes : {
          blockquote: false,
          code: false
        },
        headingLevels: options.formatting?.headingLevels === "inherit" ? editorDocumentFeatures.formatting.headingLevels : options.formatting?.headingLevels || [],
        listTypes: options.formatting?.listTypes === "inherit" ? editorDocumentFeatures.formatting.listTypes : {
          ordered: false,
          unordered: false
        }
      },
      links: options.links === "inherit",
      relationships: options.relationships === "inherit"
    },
    componentBlocks: options.componentBlocks === "inherit"
  };
}
function getSchemaAtPropPathInner(path, value, schema) {
  if (path.length === 0) return schema;
  if (schema.kind === "child" || schema.kind === "form" || schema.kind === "relationship") return;
  if (schema.kind === "conditional") {
    const key = path.shift();
    if (key === "discriminant")
      return getSchemaAtPropPathInner(path, value.discriminant, schema.discriminant);
    if (key === "value") {
      const propVal = schema.values[value.discriminant];
      return getSchemaAtPropPathInner(path, value.value, propVal);
    }
    return;
  }
  if (schema.kind === "object") {
    const key = path.shift();
    return getSchemaAtPropPathInner(path, value[key], schema.fields[key]);
  }
  if (schema.kind === "array") {
    const index = path.shift();
    return getSchemaAtPropPathInner(path, value[index], schema.element);
  }
  assertNever(schema);
}
function getSchemaAtPropPath(path, value, props) {
  return getSchemaAtPropPathInner([...path], value, {
    kind: "object",
    fields: props
  });
}
function getAncestorSchemas(rootSchema, path, value) {
  const ancestors = [];
  const currentPath = [...path];
  let currentProp = rootSchema;
  let currentValue = value;
  while (currentPath.length) {
    ancestors.push(currentProp);
    const key = currentPath.shift();
    if (currentProp.kind === "array") {
      currentProp = currentProp.element;
      currentValue = currentValue[key];
    } else if (currentProp.kind === "conditional") {
      currentProp = currentProp.values[value.discriminant];
      currentValue = currentValue.value;
    } else if (currentProp.kind === "object") {
      currentValue = currentValue[key];
      currentProp = currentProp.fields[key];
    } else if (currentProp.kind === "child" || currentProp.kind === "form" || currentProp.kind === "relationship") {
      throw new Error(`unexpected prop "${key}"`);
    } else {
      assertNever(currentProp);
    }
  }
  return ancestors;
}
function getValueAtPropPath(value, inputPath) {
  const path = [...inputPath];
  while (path.length) {
    const key = path.shift();
    value = value[key];
  }
  return value;
}
function traverseProps(schema, value, visitor, path = []) {
  if (schema.kind === "form" || schema.kind === "relationship" || schema.kind === "child") {
    visitor(schema, value, path);
    return;
  }
  if (schema.kind === "object") {
    for (const [key, childProp] of Object.entries(schema.fields)) {
      traverseProps(childProp, value[key], visitor, [...path, key]);
    }
    visitor(schema, value, path);
    return;
  }
  if (schema.kind === "array") {
    for (const [idx, val] of value.entries()) {
      traverseProps(schema.element, val, visitor, path.concat(idx));
    }
    return visitor(schema, value, path);
  }
  if (schema.kind === "conditional") {
    const discriminant = value.discriminant;
    visitor(schema, discriminant, path.concat("discriminant"));
    traverseProps(
      schema.values[discriminant.toString()],
      value.value,
      visitor,
      path.concat("value")
    );
    visitor(schema, value, path);
    return;
  }
  assertNever(schema);
}
function replaceValueAtPropPath(schema, value, newValue, path) {
  if (path.length === 0) return newValue;
  const [key, ...newPath] = path;
  if (schema.kind === "object") {
    return {
      ...value,
      [key]: replaceValueAtPropPath(schema.fields[key], value[key], newValue, newPath)
    };
  }
  if (schema.kind === "conditional") {
    const conditionalValue = value;
    assert(key === "value");
    return {
      discriminant: conditionalValue.discriminant,
      value: replaceValueAtPropPath(schema.values[key], conditionalValue.value, newValue, newPath)
    };
  }
  if (schema.kind === "array") {
    const prevVal = value;
    const newVal = [...prevVal];
    setKeysForArrayValue(newVal, getKeysForArrayValue(prevVal));
    newVal[key] = replaceValueAtPropPath(
      schema.element,
      newVal[key],
      newValue,
      newPath
    );
    return newVal;
  }
  assert(schema.kind !== "form" && schema.kind !== "relationship" && schema.kind !== "child");
  assertNever(schema);
}

// ../../packages/fields-document/src/DocumentEditor/component-blocks/field-assertions.ts
function assertValidComponentSchema(schema, lists2, mode) {
  assertValidComponentSchemaInner(schema, [], [], /* @__PURE__ */ new Set(), lists2, mode);
}
function assertValidComponentSchemaInner(schema, schemaAncestors, propPath, seenProps, lists2, mode) {
  if (schema.kind === "form") {
    if (mode === "structure" && !schema.graphql) {
      throw new Error(
        `There is a form field without a configured GraphQL schema at "${propPath.join(".")}", fields used in the structure field must have a GraphQL schema.`
      );
    }
    return;
  }
  if (schema.kind === "child") {
    if (mode === "structure") {
      throw new Error(
        `There is a child field at "${propPath.join(".")}" but child fields are not allowed in structure fields.`
      );
    }
    return;
  }
  if (schema.kind === "relationship") {
    if (lists2.has(schema.listKey)) {
      return;
    }
    throw new Error(
      `The relationship field at "${propPath.join(".")}" has the listKey "${schema.listKey}" but no list named "${schema.listKey}" exists.`
    );
  }
  const ancestor = schemaAncestors.indexOf(schema);
  if (ancestor !== -1) {
    throw new Error(
      `The field "${propPath.join(
        "."
      )}" is the same as it's ancestor. Use an array or conditional field for recursive structures.`
    );
  }
  if (seenProps.has(schema)) {
    return;
  }
  propPath.push(schema.kind);
  try {
    seenProps.add(schema);
    if (schema.kind === "array") {
      assertValidComponentSchemaInner(schema.element, [], propPath, seenProps, lists2, mode);
      return;
    }
    if (schema.kind === "object") {
      schemaAncestors.push(schema);
      for (const [key, innerProp] of Object.entries(schema.fields)) {
        propPath.push(key);
        if (schema.fields[key] !== innerProp) {
          throw new Error(
            `Fields on an object field must not change over time but the field at "${propPath.join(
              "."
            )}" changes between accesses`
          );
        }
        assertValidComponentSchemaInner(
          innerProp,
          schemaAncestors,
          propPath,
          seenProps,
          lists2,
          mode
        );
        propPath.pop();
      }
      schemaAncestors.pop();
      return;
    }
    if (schema.kind === "conditional") {
      schemaAncestors.push(schema);
      const stringifiedDefaultDiscriminant = schema.discriminant.defaultValue.toString();
      for (const [key, innerProp] of Object.entries(schema.values)) {
        propPath.push(key);
        if (schema.values[key] !== innerProp) {
          throw new Error(
            `Fields on a conditional field must not change over time but the field at "${propPath.join(
              "."
            )}" changes between accesses`
          );
        }
        assertValidComponentSchemaInner(
          innerProp,
          key === stringifiedDefaultDiscriminant ? schemaAncestors : [],
          propPath,
          seenProps,
          lists2,
          mode
        );
        propPath.pop();
      }
      schemaAncestors.pop();
      return;
    }
  } finally {
    propPath.pop();
  }
  assertNever(schema);
}

// ../../packages/fields-document/src/relationship-data.ts
var labelFieldAlias = "____document_field_relationship_item_label";
var idFieldAlias = "____document_field_relationship_item_id";
function addRelationshipData(nodes, context, relationships, componentBlocks) {
  return Promise.all(
    nodes.map(async (node) => {
      if (node.type === "relationship") {
        const relationship2 = relationships[node.relationship];
        if (!relationship2) return node;
        return {
          ...node,
          data: await fetchDataForOne(
            context,
            {
              ...relationship2,
              many: false
            },
            node.data
          )
        };
      }
      if (node.type === "component-block") {
        const componentBlock = componentBlocks[node.component];
        if (componentBlock) {
          const [props, children] = await Promise.all([
            addRelationshipDataToComponentProps(
              { kind: "object", fields: componentBlock.schema },
              node.props,
              (relationship2, data) => fetchRelationshipData(context, relationship2, data)
            ),
            addRelationshipData(node.children, context, relationships, componentBlocks)
          ]);
          return {
            ...node,
            props,
            children
          };
        }
      }
      if ("children" in node && Array.isArray(node.children)) {
        return {
          ...node,
          children: await addRelationshipData(
            node.children,
            context,
            relationships,
            componentBlocks
          )
        };
      }
      return node;
    })
  );
}
async function fetchRelationshipData(context, relationship2, data) {
  if (!relationship2.many) return fetchDataForOne(context, relationship2, data);
  const ids = Array.isArray(data) ? data.filter((item) => item.id != null).map((x) => x.id) : [];
  if (!ids.length) return [];
  const list2 = context.__internal.lists[relationship2.listKey];
  const { listQueryName } = list2.graphql.names;
  const labelField = relationship2.labelField ?? list2.ui.labelField;
  const value = await context.graphql.run({
    query: `query($ids: [ID!]!) {items:${listQueryName}(where: { id: { in: $ids } }) {${idFieldAlias}:id ${labelFieldAlias}:${labelField}
${relationship2.selection || ""}}}`,
    variables: { ids }
  });
  return Array.isArray(value.items) ? value.items.map(({ [labelFieldAlias]: label, [idFieldAlias]: id, ...data2 }) => {
    return { id, label, data: data2 };
  }) : [];
}
async function fetchDataForOne(context, relationship2, data) {
  const id = data?.id;
  if (id == null) return null;
  const list2 = context.__internal.lists[relationship2.listKey];
  const { itemQueryName } = list2.graphql.names;
  const labelField = relationship2.labelField ?? list2.ui.labelField;
  const value = await context.graphql.run({
    query: `query($id: ID!) {item:${itemQueryName}(where: { id: $id }) {${labelFieldAlias}:${labelField}
${relationship2.selection || ""}}}`,
    variables: { id }
  });
  if (value.item === null) return { id, data: void 0, label: void 0 };
  return {
    id,
    label: value.item[labelFieldAlias],
    data: (() => {
      const { [labelFieldAlias]: _ignore, ...otherData } = value.item;
      return otherData;
    })()
  };
}
async function addRelationshipDataToComponentProps(schema, value, fetchData) {
  switch (schema.kind) {
    case "child":
      return value;
    case "form":
      return value;
    case "relationship":
      return fetchData(schema, value);
    case "object": {
      return Object.fromEntries(
        await Promise.all(
          Object.keys(schema.fields).map(async (key) => [
            key,
            // if val[key] === undefined, we know a new field was added to the schema
            // but there is old data in the database that doesn't have the new field
            // we're intentionally not just magically adding it because we may want to
            // have a more optimised strategy of hydrating relationships so we don't
            // want to add something unrelated that requires the current "traverse everything" strategy
            value[key] === void 0 ? void 0 : await addRelationshipDataToComponentProps(
              schema.fields[key],
              value[key],
              fetchData
            )
          ])
        )
      );
    }
    case "conditional": {
      return {
        discriminant: value.discriminant,
        value: await addRelationshipDataToComponentProps(
          schema.values[value.discriminant],
          value.value,
          fetchData
        )
      };
    }
    case "array": {
      return await Promise.all(
        value.map(
          async (innerVal) => addRelationshipDataToComponentProps(schema.element, innerVal, fetchData)
        )
      );
    }
  }
  assertNever(schema);
}

// ../../packages/fields-document/src/validation.ts
var import_slate21 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");

// ../../packages/fields-document/src/DocumentEditor/editor-shared.ts
var import_slate20 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
var import_slate_history = require("../../../node_modules/.pnpm/slate-history@0.113.1_slate@0.112.0/node_modules/slate-history/dist/index.js");

// ../../packages/fields-document/src/DocumentEditor/component-blocks/with-component-blocks.tsx
var import_slate3 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
var import_weak_memoize = __toESM(require("../../../node_modules/.pnpm/@emotion+weak-memoize@0.4.0/node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js"));

// ../../packages/fields-document/src/DocumentEditor/document-features-normalization.ts
var import_slate2 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
function areArraysEqual(a, b) {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}
function normalizeTextBasedOnInlineMarksAndSoftBreaks([node, path], editor, inlineMarks, softBreaks) {
  const marksToRemove = Object.keys(node).filter(
    (x) => x !== "text" && x !== "insertMenu" && inlineMarks[x] !== true
  );
  if (marksToRemove.length) {
    import_slate2.Transforms.unsetNodes(editor, marksToRemove, { at: path });
    return true;
  }
  if (!softBreaks) {
    const hasSoftBreaks = node.text.includes("\n");
    if (hasSoftBreaks) {
      const [parentNode] = import_slate2.Editor.parent(editor, path);
      if (parentNode.type !== "code") {
        for (const position of import_slate2.Editor.positions(editor, { at: path })) {
          const character = import_slate2.Node.get(editor, position.path).text[position.offset];
          if (character === "\n") {
            import_slate2.Transforms.delete(editor, { at: position });
            return true;
          }
        }
      }
    }
  }
  return false;
}
function normalizeInlineBasedOnLinksAndRelationships([node, path], editor, links, relationshipsEnabled, relationships) {
  if (node.type === "link" && !links) {
    import_slate2.Transforms.insertText(editor, ` (${node.href})`, { at: import_slate2.Editor.end(editor, path) });
    import_slate2.Transforms.unwrapNodes(editor, { at: path });
    return true;
  }
  if (node.type === "relationship" && (!relationshipsEnabled || relationships[node.relationship] === void 0)) {
    const data = node.data;
    if (data) {
      const relationship2 = relationships[node.relationship];
      import_slate2.Transforms.insertText(
        editor,
        `${data.label || data.id || ""} (${relationship2?.label || node.relationship}:${data.id || ""})`,
        { at: import_slate2.Editor.before(editor, path) }
      );
    }
    import_slate2.Transforms.removeNodes(editor, { at: path });
    return true;
  }
  return false;
}
function normalizeElementBasedOnDocumentFeatures([node, path], editor, {
  formatting,
  dividers,
  layouts,
  links,
  relationships: relationshipsEnabled
}, relationships) {
  if (node.type === "heading" && (!formatting.headingLevels.length || !formatting.headingLevels.includes(node.level)) || node.type === "ordered-list" && !formatting.listTypes.ordered || node.type === "unordered-list" && !formatting.listTypes.unordered || node.type === "code" && !formatting.blockTypes.code || node.type === "blockquote" && !formatting.blockTypes.blockquote || node.type === "layout" && (layouts.length === 0 || !layouts.some((layout) => areArraysEqual(layout, node.layout)))) {
    import_slate2.Transforms.unwrapNodes(editor, { at: path });
    return true;
  }
  if ((node.type === "paragraph" || node.type === "heading") && (!formatting.alignment.center && node.textAlign === "center" || !formatting.alignment.end && node.textAlign === "end" || "textAlign" in node && node.textAlign !== "center" && node.textAlign !== "end")) {
    import_slate2.Transforms.unsetNodes(editor, "textAlign", { at: path });
    return true;
  }
  if (node.type === "divider" && !dividers) {
    import_slate2.Transforms.removeNodes(editor, { at: path });
    return true;
  }
  return normalizeInlineBasedOnLinksAndRelationships(
    [node, path],
    editor,
    links,
    relationshipsEnabled,
    relationships
  );
}
function withDocumentFeaturesNormalization(documentFeatures, relationships, editor) {
  const { normalizeNode } = editor;
  const documentFeaturesForNormalization = { ...documentFeatures, relationships: true };
  editor.normalizeNode = ([node, path]) => {
    if (import_slate2.Text.isText(node)) {
      normalizeTextBasedOnInlineMarksAndSoftBreaks(
        [node, path],
        editor,
        documentFeatures.formatting.inlineMarks,
        documentFeatures.formatting.softBreaks
      );
    } else if (import_slate2.Element.isElement(node)) {
      normalizeElementBasedOnDocumentFeatures(
        [node, path],
        editor,
        documentFeaturesForNormalization,
        relationships
      );
    }
    normalizeNode([node, path]);
  };
  return editor;
}

// ../../packages/fields-document/src/DocumentEditor/component-blocks/with-component-blocks.tsx
function getAncestorComponentBlock(editor) {
  if (editor.selection) {
    const ancestorEntry = import_slate3.Editor.above(editor, {
      match: (node) => import_slate3.Element.isElement(node) && import_slate3.Editor.isBlock(editor, node) && node.type !== "paragraph"
    });
    if (ancestorEntry && (ancestorEntry[0].type === "component-block-prop" || ancestorEntry[0].type === "component-inline-prop")) {
      return {
        isInside: true,
        componentBlock: import_slate3.Editor.parent(editor, ancestorEntry[1]),
        prop: ancestorEntry
      };
    }
  }
  return { isInside: false };
}
var alreadyNormalizedThings = /* @__PURE__ */ new WeakMap();
function normalizeNodeWithinComponentProp([node, path], editor, fieldOptions, relationships) {
  let alreadyNormalizedNodes = alreadyNormalizedThings.get(fieldOptions);
  if (!alreadyNormalizedNodes) {
    alreadyNormalizedNodes = /* @__PURE__ */ new WeakSet();
    alreadyNormalizedThings.set(fieldOptions, alreadyNormalizedNodes);
  }
  if (alreadyNormalizedNodes.has(node)) return false;
  let didNormalization = false;
  if (fieldOptions.inlineMarks !== "inherit" && import_slate3.Text.isText(node)) {
    didNormalization = normalizeTextBasedOnInlineMarksAndSoftBreaks(
      [node, path],
      editor,
      fieldOptions.inlineMarks,
      fieldOptions.softBreaks
    );
  }
  if (import_slate3.Element.isElement(node)) {
    for (const [i, child] of node.children.entries()) {
      if (normalizeNodeWithinComponentProp([child, [...path, i]], editor, fieldOptions, relationships)) {
        return true;
      }
    }
    if (fieldOptions.kind === "block") {
      if (node.type === "component-block") {
        if (!fieldOptions.componentBlocks) {
          import_slate3.Transforms.unwrapNodes(editor, { at: path });
          didNormalization = true;
        }
      } else {
        didNormalization = normalizeElementBasedOnDocumentFeatures(
          [node, path],
          editor,
          fieldOptions.documentFeatures,
          relationships
        );
      }
    } else {
      didNormalization = normalizeInlineBasedOnLinksAndRelationships(
        [node, path],
        editor,
        fieldOptions.documentFeatures.links,
        fieldOptions.documentFeatures.relationships,
        relationships
      );
    }
  }
  if (didNormalization === false) {
    alreadyNormalizedNodes.add(node);
  }
  return didNormalization;
}
function canSchemaContainChildField(rootSchema) {
  const queue = /* @__PURE__ */ new Set([rootSchema]);
  for (const schema of queue) {
    if (schema.kind === "form" || schema.kind === "relationship") continue;
    if (schema.kind === "child") return true;
    if (schema.kind === "array") {
      queue.add(schema.element);
      continue;
    }
    if (schema.kind === "object") {
      for (const innerProp of Object.values(schema.fields)) {
        queue.add(innerProp);
      }
      continue;
    }
    if (schema.kind === "conditional") {
      for (const innerProp of Object.values(schema.values)) {
        queue.add(innerProp);
      }
      continue;
    }
    assertNever(schema);
  }
  return false;
}
function doesSchemaOnlyEverContainASingleChildField(rootSchema) {
  const queue = /* @__PURE__ */ new Set([rootSchema]);
  let hasFoundChildField = false;
  for (const schema of queue) {
    if (schema.kind === "form" || schema.kind === "relationship") continue;
    if (schema.kind === "child") {
      if (hasFoundChildField) return false;
      hasFoundChildField = true;
      continue;
    }
    if (schema.kind === "array") {
      if (canSchemaContainChildField(schema.element)) return false;
      continue;
    }
    if (schema.kind === "object") {
      for (const innerProp of Object.values(schema.fields)) {
        queue.add(innerProp);
      }
      continue;
    }
    if (schema.kind === "conditional") {
      for (const innerProp of Object.values(schema.values)) {
        queue.add(innerProp);
      }
      continue;
    }
    assertNever(schema);
  }
  return hasFoundChildField;
}
function findArrayFieldsWithSingleChildField(schema, value) {
  const propPaths = [];
  traverseProps(schema, value, (schema2, value2, path) => {
    if (schema2.kind === "array" && doesSchemaOnlyEverContainASingleChildField(schema2.element)) {
      propPaths.push([path, schema2]);
    }
  });
  return propPaths;
}
function isEmptyChildFieldNode(element) {
  const firstChild = element.children[0];
  return element.children.length === 1 && (element.type === "component-inline-prop" && firstChild.type === void 0 && firstChild.text === "" || element.type === "component-block-prop" && firstChild.type === "paragraph" && firstChild.children.length === 1 && firstChild.children[0].type === void 0 && firstChild.children[0].text === "");
}
function withComponentBlocks(blockComponents, editorDocumentFeatures, relationships, editor) {
  const memoizedGetDocumentFeaturesForChildField = (0, import_weak_memoize.default)(
    (options) => {
      return getDocumentFeaturesForChildField(editorDocumentFeatures, options);
    }
  );
  const { normalizeNode, deleteBackward, insertBreak } = editor;
  editor.deleteBackward = (unit) => {
    if (editor.selection) {
      const ancestorComponentBlock = getAncestorComponentBlock(editor);
      if (ancestorComponentBlock.isInside && import_slate3.Range.isCollapsed(editor.selection) && import_slate3.Editor.isStart(editor, editor.selection.anchor, ancestorComponentBlock.prop[1]) && ancestorComponentBlock.prop[1][ancestorComponentBlock.prop[1].length - 1] === 0) {
        import_slate3.Transforms.unwrapNodes(editor, { at: ancestorComponentBlock.componentBlock[1] });
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.insertBreak = () => {
    const ancestorComponentBlock = getAncestorComponentBlock(editor);
    if (editor.selection && ancestorComponentBlock.isInside) {
      const {
        prop: [componentPropNode, componentPropPath],
        componentBlock: [componentBlockNode, componentBlockPath]
      } = ancestorComponentBlock;
      const isLastProp = componentPropPath[componentPropPath.length - 1] === componentBlockNode.children.length - 1;
      if (componentPropNode.type === "component-block-prop") {
        const [[paragraphNode, paragraphPath]] = import_slate3.Editor.nodes(editor, {
          match: (node) => node.type === "paragraph"
        });
        const isLastParagraph = paragraphPath[paragraphPath.length - 1] === componentPropNode.children.length - 1;
        if (import_slate3.Node.string(paragraphNode) === "" && isLastParagraph) {
          if (isLastProp) {
            import_slate3.Transforms.moveNodes(editor, {
              at: paragraphPath,
              to: import_slate3.Path.next(ancestorComponentBlock.componentBlock[1])
            });
          } else {
            import_slate3.Transforms.move(editor, { distance: 1, unit: "line" });
            import_slate3.Transforms.removeNodes(editor, { at: paragraphPath });
          }
          return;
        }
      }
      if (componentPropNode.type === "component-inline-prop") {
        import_slate3.Editor.withoutNormalizing(editor, () => {
          const componentBlock = blockComponents[componentBlockNode.component];
          if (componentPropNode.propPath !== void 0 && componentBlock !== void 0) {
            const rootSchema = { kind: "object", fields: componentBlock.schema };
            const ancestorFields = getAncestorSchemas(
              rootSchema,
              componentPropNode.propPath,
              componentBlockNode.props
            );
            const idx = [...ancestorFields].reverse().findIndex((item) => item.kind === "array");
            if (idx !== -1) {
              const arrayFieldIdx = ancestorFields.length - 1 - idx;
              const arrayField = ancestorFields[arrayFieldIdx];
              assert(arrayField.kind === "array");
              const val = getValueAtPropPath(
                componentBlockNode.props,
                componentPropNode.propPath.slice(0, arrayFieldIdx)
              );
              if (doesSchemaOnlyEverContainASingleChildField(arrayField.element)) {
                if (import_slate3.Node.string(componentPropNode) === "" && val.length - 1 === componentPropNode.propPath[arrayFieldIdx]) {
                  import_slate3.Transforms.removeNodes(editor, { at: componentPropPath });
                  if (isLastProp) {
                    import_slate3.Transforms.insertNodes(
                      editor,
                      { type: "paragraph", children: [{ text: "" }] },
                      { at: import_slate3.Path.next(componentBlockPath) }
                    );
                    import_slate3.Transforms.select(editor, import_slate3.Path.next(componentBlockPath));
                  } else {
                    import_slate3.Transforms.move(editor, { distance: 1, unit: "line" });
                  }
                } else {
                  insertBreak();
                }
                return;
              }
            }
          }
          import_slate3.Transforms.splitNodes(editor, { always: true });
          const splitNodePath = import_slate3.Path.next(componentPropPath);
          if (isLastProp) {
            import_slate3.Transforms.moveNodes(editor, {
              at: splitNodePath,
              to: import_slate3.Path.next(componentBlockPath)
            });
          } else {
            moveChildren(editor, splitNodePath, [...import_slate3.Path.next(splitNodePath), 0]);
            import_slate3.Transforms.removeNodes(editor, { at: splitNodePath });
          }
        });
        return;
      }
    }
    insertBreak();
  };
  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (node.type === "component-inline-prop" && !node.propPath && (node.children.length !== 1 || !import_slate3.Text.isText(node.children[0]) || node.children[0].text !== "")) {
      import_slate3.Transforms.removeNodes(editor, {
        at: path
      });
      return;
    }
    if (node.type === "component-block") {
      const componentBlock = blockComponents[node.component];
      if (componentBlock) {
        const rootSchema = { kind: "object", fields: componentBlock.schema };
        const updatedProps = addMissingFields(node.props, rootSchema);
        if (updatedProps !== node.props) {
          import_slate3.Transforms.setNodes(editor, { props: updatedProps }, { at: path });
          return;
        }
        for (const [propPath, arrayField] of findArrayFieldsWithSingleChildField(
          rootSchema,
          node.props
        )) {
          if (node.children.length === 1 && node.children[0].type === "component-inline-prop" && node.children[0].propPath === void 0) {
            break;
          }
          const nodesWithin = [];
          for (const [idx, childNode] of node.children.entries()) {
            if ((childNode.type === "component-block-prop" || childNode.type === "component-inline-prop") && childNode.propPath !== void 0) {
              const subPath = childNode.propPath.concat();
              while (subPath.length) {
                if (typeof subPath.pop() === "number") break;
              }
              if (areArraysEqual(propPath, subPath)) {
                nodesWithin.push([idx, childNode]);
              }
            }
          }
          const arrVal = getValueAtPropPath(node.props, propPath);
          const prevKeys = getKeysForArrayValue(arrVal);
          const prevKeysSet = new Set(prevKeys);
          const alreadyUsedIndicies = /* @__PURE__ */ new Set();
          const newVal = [];
          const newKeys = [];
          const getNewKey = () => {
            let key = getNewArrayElementKey();
            while (prevKeysSet.has(key)) {
              key = getNewArrayElementKey();
            }
            return key;
          };
          for (const [, node2] of nodesWithin) {
            const idxFromValue = node2.propPath[propPath.length];
            assert(typeof idxFromValue === "number");
            if (arrVal.length <= idxFromValue || alreadyUsedIndicies.has(idxFromValue) && isEmptyChildFieldNode(node2)) {
              newVal.push(getInitialPropsValue(arrayField.element));
              newKeys.push(getNewKey());
            } else {
              alreadyUsedIndicies.add(idxFromValue);
              newVal.push(arrVal[idxFromValue]);
              newKeys.push(
                alreadyUsedIndicies.has(idxFromValue) ? getNewKey() : prevKeys[idxFromValue]
              );
            }
          }
          setKeysForArrayValue(newVal, newKeys);
          if (!areArraysEqual(arrVal, newVal)) {
            const transformedProps = replaceValueAtPropPath(
              rootSchema,
              node.props,
              newVal,
              propPath
            );
            import_slate3.Transforms.setNodes(
              editor,
              { props: transformedProps },
              { at: path }
            );
            for (const [idx, [idxInChildrenOfBlock, nodeWithin]] of nodesWithin.entries()) {
              const newPropPath = [...nodeWithin.propPath];
              newPropPath[propPath.length] = idx;
              import_slate3.Transforms.setNodes(
                editor,
                { propPath: newPropPath },
                { at: [...path, idxInChildrenOfBlock] }
              );
            }
            return;
          }
        }
        const missingKeys = new Map(
          findChildPropPaths(node.props, componentBlock.schema).map((x) => [
            JSON.stringify(x.path),
            x.options.kind
          ])
        );
        node.children.forEach((node2) => {
          assert(node2.type === "component-block-prop" || node2.type === "component-inline-prop");
          missingKeys.delete(JSON.stringify(node2.propPath));
        });
        if (missingKeys.size) {
          import_slate3.Transforms.insertNodes(
            editor,
            [...missingKeys].map(([prop, kind]) => ({
              type: `component-${kind}-prop`,
              propPath: prop ? JSON.parse(prop) : prop,
              children: [{ text: "" }]
            })),
            { at: [...path, node.children.length] }
          );
          return;
        }
        const foundProps = /* @__PURE__ */ new Set();
        const stringifiedInlinePropPaths = {};
        findChildPropPaths(node.props, blockComponents[node.component].schema).forEach(
          (x, index) => {
            stringifiedInlinePropPaths[JSON.stringify(x.path)] = { options: x.options, index };
          }
        );
        for (const [index, childNode] of node.children.entries()) {
          if (
            // children that are not these will be handled by
            // the generic allowedChildren normalization
            childNode.type !== "component-inline-prop" && childNode.type !== "component-block-prop"
          ) {
            continue;
          }
          const childPath = [...path, index];
          const stringifiedPropPath = JSON.stringify(childNode.propPath);
          if (stringifiedInlinePropPaths[stringifiedPropPath] === void 0) {
            import_slate3.Transforms.removeNodes(editor, { at: childPath });
            return;
          }
          if (foundProps.has(stringifiedPropPath)) {
            import_slate3.Transforms.removeNodes(editor, { at: childPath });
            return;
          }
          foundProps.add(stringifiedPropPath);
          const propInfo = stringifiedInlinePropPaths[stringifiedPropPath];
          const expectedIndex = propInfo.index;
          if (index !== expectedIndex) {
            import_slate3.Transforms.moveNodes(editor, { at: childPath, to: [...path, expectedIndex] });
            return;
          }
          const expectedChildNodeType = `component-${propInfo.options.kind}-prop`;
          if (childNode.type !== expectedChildNodeType) {
            import_slate3.Transforms.setNodes(editor, { type: expectedChildNodeType }, { at: childPath });
            return;
          }
          const documentFeatures = memoizedGetDocumentFeaturesForChildField(propInfo.options);
          if (normalizeNodeWithinComponentProp(
            [childNode, childPath],
            editor,
            documentFeatures,
            relationships
          )) {
            return;
          }
        }
      }
    }
    normalizeNode(entry);
  };
  return editor;
}
function addMissingFields(value, schema) {
  if (schema.kind === "child" || schema.kind === "form" || schema.kind === "relationship") {
    return value;
  }
  if (schema.kind === "conditional") {
    const conditionalValue = value;
    const updatedInnerValue = addMissingFields(
      conditionalValue.value,
      schema.values[conditionalValue.discriminant.toString()]
    );
    if (updatedInnerValue === conditionalValue.value) {
      return value;
    }
    return { discriminant: conditionalValue.discriminant, value: updatedInnerValue };
  }
  if (schema.kind === "array") {
    const arrValue = value;
    const newArrValue = arrValue.map((x) => addMissingFields(x, schema.element));
    if (areArraysEqual(arrValue, newArrValue)) {
      return value;
    }
    return newArrValue;
  }
  if (schema.kind === "object") {
    const objectValue = value;
    let hasChanged = false;
    const newObjectValue = {};
    for (const [key, innerSchema] of Object.entries(schema.fields)) {
      const innerValue = objectValue[key];
      if (innerValue === void 0) {
        hasChanged = true;
        newObjectValue[key] = getInitialPropsValue(innerSchema);
        continue;
      }
      const newInnerValue = addMissingFields(innerValue, innerSchema);
      if (newInnerValue !== innerValue) {
        hasChanged = true;
      }
      newObjectValue[key] = newInnerValue;
    }
    if (hasChanged) {
      return newObjectValue;
    }
    return value;
  }
  assertNever(schema);
}

// ../../packages/fields-document/src/DocumentEditor/paragraphs.ts
var import_slate4 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
var paragraphElement = () => ({
  type: "paragraph",
  children: [{ text: "" }]
});
function withParagraphs(editor) {
  const { normalizeNode } = editor;
  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (import_slate4.Editor.isEditor(node)) {
      const lastNode = node.children[node.children.length - 1];
      if (lastNode?.type !== "paragraph") {
        import_slate4.Transforms.insertNodes(editor, paragraphElement(), {
          at: [...path, node.children.length]
        });
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

// ../../packages/fields-document/src/DocumentEditor/lists-shared.ts
var import_slate6 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");

// ../../packages/fields-document/src/DocumentEditor/toolbar-state-shared.ts
var import_slate5 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
function getAncestorComponentChildFieldDocumentFeatures(editor, editorDocumentFeatures, componentBlocks) {
  const ancestorComponentProp = import_slate5.Editor.above(editor, {
    match: nodeTypeMatcher("component-block-prop", "component-inline-prop")
  });
  if (ancestorComponentProp) {
    const propPath = ancestorComponentProp[0].propPath;
    const ancestorComponent = import_slate5.Editor.parent(editor, ancestorComponentProp[1]);
    if (ancestorComponent[0].type === "component-block") {
      const component = ancestorComponent[0].component;
      const componentBlock = componentBlocks[component];
      if (componentBlock && propPath) {
        const childField = getSchemaAtPropPath(
          propPath,
          ancestorComponent[0].props,
          componentBlock.schema
        );
        if (childField?.kind === "child") {
          return getDocumentFeaturesForChildField(editorDocumentFeatures, childField.options);
        }
      }
    }
  }
}

// ../../packages/fields-document/src/DocumentEditor/lists-shared.ts
var isListType = (type) => type === "ordered-list" || type === "unordered-list";
var isListNode = (node) => isListType(node.type);
function getAncestorList(editor) {
  if (editor.selection) {
    const listItem = import_slate6.Editor.above(editor, {
      match: nodeTypeMatcher("list-item")
    });
    const list2 = import_slate6.Editor.above(editor, {
      match: isListNode
    });
    if (listItem && list2) {
      return {
        isInside: true,
        listItem,
        list: list2
      };
    }
  }
  return { isInside: false };
}
function withList(editor) {
  const { insertBreak, normalizeNode, deleteBackward } = editor;
  editor.deleteBackward = (unit) => {
    if (editor.selection) {
      const ancestorList = getAncestorList(editor);
      if (ancestorList.isInside && import_slate6.Range.isCollapsed(editor.selection) && import_slate6.Editor.isStart(editor, editor.selection.anchor, ancestorList.list[1])) {
        import_slate6.Transforms.unwrapNodes(editor, {
          match: isListNode,
          split: true
        });
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.insertBreak = () => {
    const [listItem] = import_slate6.Editor.nodes(editor, {
      match: (node) => node.type === "list-item",
      mode: "lowest"
    });
    if (listItem && import_slate6.Node.string(listItem[0]) === "") {
      import_slate6.Transforms.unwrapNodes(editor, {
        match: isListNode,
        split: true
      });
      return;
    }
    insertBreak();
  };
  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (import_slate6.Element.isElement(node) || import_slate6.Editor.isEditor(node)) {
      const isElementBeingNormalizedAList = isListNode(node);
      for (const [childNode, childPath] of import_slate6.Node.children(editor, path)) {
        const index = childPath[childPath.length - 1];
        if (isListNode(childNode)) {
          if (node.children[childPath[childPath.length - 1] + 1]?.type === childNode.type) {
            const siblingNodePath = import_slate6.Path.next(childPath);
            moveChildren(editor, siblingNodePath, [...childPath, childNode.children.length]);
            import_slate6.Transforms.removeNodes(editor, { at: siblingNodePath });
            return;
          }
          if (isElementBeingNormalizedAList) {
            const previousChild = node.children[index - 1];
            if (import_slate6.Element.isElement(previousChild)) {
              import_slate6.Transforms.moveNodes(editor, {
                at: childPath,
                to: [...import_slate6.Path.previous(childPath), previousChild.children.length - 1]
              });
            } else {
              import_slate6.Transforms.unwrapNodes(editor, { at: childPath });
            }
            return;
          }
        }
        if (node.type === "list-item" && childNode.type !== "list-item-content" && index === 0 && import_slate6.Element.isElement(childNode) && import_slate6.Editor.isBlock(editor, childNode)) {
          if (path[path.length - 1] !== 0) {
            const previousChild = import_slate6.Node.get(editor, import_slate6.Path.previous(path));
            if (import_slate6.Element.isElement(previousChild)) {
              import_slate6.Transforms.moveNodes(editor, {
                at: path,
                to: [...import_slate6.Path.previous(path), previousChild.children.length]
              });
              return;
            }
          }
          import_slate6.Transforms.unwrapNodes(editor, { at: childPath });
          return;
        }
        if (node.type === "list-item" && childNode.type === "list-item-content" && index !== 0) {
          import_slate6.Transforms.splitNodes(editor, { at: childPath });
          return;
        }
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

// ../../packages/fields-document/src/DocumentEditor/link-shared.ts
var import_slate7 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
var markdownLinkPattern = /(^|\s)\[(.+?)\]\((\S+)\)$/;
function withLink(editorDocumentFeatures, componentBlocks, editor) {
  const { insertText, isInline, normalizeNode } = editor;
  editor.isInline = (element) => {
    return element.type === "link" ? true : isInline(element);
  };
  if (editorDocumentFeatures.links) {
    editor.insertText = (text2) => {
      insertText(text2);
      if (text2 !== ")" || !editor.selection) return;
      const startOfBlock = import_slate7.Editor.start(
        editor,
        import_slate7.Editor.above(editor, {
          match: (node) => import_slate7.Element.isElement(node) && import_slate7.Editor.isBlock(editor, node)
        })[1]
      );
      const startOfBlockToEndOfShortcutString = import_slate7.Editor.string(editor, {
        anchor: editor.selection.anchor,
        focus: startOfBlock
      });
      const match = markdownLinkPattern.exec(startOfBlockToEndOfShortcutString);
      if (!match) return;
      const ancestorComponentChildFieldDocumentFeatures = getAncestorComponentChildFieldDocumentFeatures(
        editor,
        editorDocumentFeatures,
        componentBlocks
      );
      if (ancestorComponentChildFieldDocumentFeatures?.documentFeatures.links === false) {
        return;
      }
      const [, maybeWhitespace, linkText, href] = match;
      editor.writeHistory("undos", { operations: [], selectionBefore: null });
      const startOfShortcut = match.index === 0 ? startOfBlock : EditorAfterButIgnoringingPointsWithNoContent(editor, startOfBlock, {
        distance: match.index
      });
      const startOfLinkText = EditorAfterButIgnoringingPointsWithNoContent(
        editor,
        startOfShortcut,
        {
          distance: maybeWhitespace === "" ? 1 : 2
        }
      );
      const endOfLinkText = EditorAfterButIgnoringingPointsWithNoContent(editor, startOfLinkText, {
        distance: linkText.length
      });
      import_slate7.Transforms.delete(editor, {
        at: { anchor: endOfLinkText, focus: editor.selection.anchor }
      });
      import_slate7.Transforms.delete(editor, {
        at: { anchor: startOfShortcut, focus: startOfLinkText }
      });
      import_slate7.Transforms.wrapNodes(
        editor,
        { type: "link", href, children: [] },
        { at: { anchor: editor.selection.anchor, focus: startOfShortcut }, split: true }
      );
      const nextNode = import_slate7.Editor.next(editor);
      if (nextNode) {
        import_slate7.Transforms.select(editor, nextNode[1]);
      }
    };
  }
  editor.normalizeNode = ([node, path]) => {
    if (node.type === "link") {
      if (import_slate7.Node.string(node) === "") {
        import_slate7.Transforms.unwrapNodes(editor, { at: path });
        return;
      }
      for (const [idx, child] of node.children.entries()) {
        if (child.type === "link") {
          import_slate7.Transforms.unwrapNodes(editor, { at: [...path, idx] });
          return;
        }
      }
    }
    if (isInlineContainer(node)) {
      let lastMergableLink = null;
      for (const [idx, child] of node.children.entries()) {
        if (child.type === "link" && child.href === lastMergableLink?.node.href) {
          const firstLinkPath = [...path, lastMergableLink.index];
          const secondLinkPath = [...path, idx];
          const to = [...firstLinkPath, lastMergableLink.node.children.length];
          for (let i = child.children.length - 1; i >= 0; i--) {
            const childPath = [...secondLinkPath, i];
            import_slate7.Transforms.moveNodes(editor, { at: childPath, to });
          }
          import_slate7.Transforms.removeNodes(editor, { at: secondLinkPath });
          return;
        }
        if (!import_slate7.Text.isText(child) || child.text !== "") {
          lastMergableLink = null;
        }
        if (child.type === "link") {
          lastMergableLink = { index: idx, node: child };
        }
      }
    }
    normalizeNode([node, path]);
  };
  return editor;
}

// ../../packages/fields-document/src/DocumentEditor/layouts-shared.ts
var import_slate8 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
function withLayouts(editor) {
  const { normalizeNode, deleteBackward } = editor;
  editor.deleteBackward = (unit) => {
    if (editor.selection && import_slate8.Range.isCollapsed(editor.selection) && // this is just an little optimisation
    // we're only doing things if we're at the start of a layout area
    // and the start of anything will always be offset 0
    // so we'll bailout if we're not at offset 0
    editor.selection.anchor.offset === 0) {
      const [aboveNode, abovePath] = import_slate8.Editor.above(editor, {
        match: (node) => node.type === "layout-area"
      }) || [editor, []];
      if (aboveNode.type === "layout-area" && import_slate8.Point.equals(import_slate8.Editor.start(editor, abovePath), editor.selection.anchor)) {
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (import_slate8.Element.isElement(node) && node.type === "layout") {
      if (node.layout === void 0) {
        import_slate8.Transforms.unwrapNodes(editor, { at: path });
        return;
      }
      if (node.children.length < node.layout.length) {
        import_slate8.Transforms.insertNodes(
          editor,
          Array.from({
            length: node.layout.length - node.children.length
          }).map(() => ({
            type: "layout-area",
            children: [paragraphElement()]
          })),
          {
            at: [...path, node.children.length]
          }
        );
        return;
      }
      if (node.children.length > node.layout.length) {
        Array.from({
          length: node.children.length - node.layout.length
        }).map((_, i) => i).reverse().forEach((i) => {
          const layoutAreaToRemovePath = [...path, i + node.layout.length];
          const child = node.children[i + node.layout.length];
          moveChildren(
            editor,
            layoutAreaToRemovePath,
            [
              ...path,
              node.layout.length - 1,
              node.children[node.layout.length - 1].children.length
            ],
            (node2) => node2.type !== "paragraph" || import_slate8.Node.string(child) !== ""
          );
          import_slate8.Transforms.removeNodes(editor, {
            at: layoutAreaToRemovePath
          });
        });
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

// ../../packages/fields-document/src/DocumentEditor/heading-shared.ts
var import_slate9 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
function withHeading(editor) {
  const { insertBreak } = editor;
  editor.insertBreak = () => {
    insertBreak();
    const entry = import_slate9.Editor.above(editor, {
      match: (n) => n.type === "heading"
    });
    if (!entry || !editor.selection || !import_slate9.Range.isCollapsed(editor.selection)) return;
    const path = entry[1];
    if (
      // we want to unwrap the heading when the user inserted a break at the end of the heading
      // when the user inserts a break at the end of a heading, the new heading
      // that we want to unwrap will be empty so the end will be equal to the selection
      import_slate9.Point.equals(import_slate9.Editor.end(editor, path), editor.selection.anchor)
    ) {
      import_slate9.Transforms.unwrapNodes(editor, {
        at: path
      });
      return;
    }
    if (!import_slate9.Path.hasPrevious(path)) return;
    const previousPath = import_slate9.Path.previous(path);
    const previousNode = import_slate9.Node.get(editor, previousPath);
    if (previousNode.type === "heading" && previousNode.children.length === 1 && import_slate9.Text.isText(previousNode.children[0]) && previousNode.children[0].text === "") {
      import_slate9.Transforms.unwrapNodes(editor, {
        at: previousPath
      });
    }
  };
  return editor;
}

// ../../packages/fields-document/src/DocumentEditor/blockquote-shared.ts
var import_slate10 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
function getDirectBlockquoteParentFromSelection(editor) {
  if (!editor.selection) return { isInside: false };
  const [, parentPath] = import_slate10.Editor.parent(editor, editor.selection);
  if (!parentPath.length) {
    return { isInside: false };
  }
  const [maybeBlockquoteParent, maybeBlockquoteParentPath] = import_slate10.Editor.parent(editor, parentPath);
  const isBlockquote = maybeBlockquoteParent.type === "blockquote";
  return isBlockquote ? { isInside: true, path: maybeBlockquoteParentPath } : { isInside: false };
}
function withBlockquote(editor) {
  const { insertBreak, deleteBackward } = editor;
  editor.deleteBackward = (unit) => {
    if (editor.selection) {
      const parentBlockquote = getDirectBlockquoteParentFromSelection(editor);
      if (parentBlockquote.isInside && import_slate10.Range.isCollapsed(editor.selection) && // the selection is at the start of the paragraph
      editor.selection.anchor.offset === 0 && // it's the first paragraph in the panel
      editor.selection.anchor.path[editor.selection.anchor.path.length - 2] === 0) {
        import_slate10.Transforms.unwrapNodes(editor, {
          match: (node) => node.type === "blockquote",
          split: true
        });
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.insertBreak = () => {
    const panel = getDirectBlockquoteParentFromSelection(editor);
    if (editor.selection && panel.isInside) {
      const [node, nodePath] = import_slate10.Editor.node(editor, editor.selection);
      if (import_slate10.Path.isDescendant(nodePath, panel.path) && import_slate10.Node.string(node) === "") {
        import_slate10.Transforms.unwrapNodes(editor, {
          match: (node2) => node2.type === "blockquote",
          split: true
        });
        return;
      }
    }
    insertBreak();
  };
  return editor;
}

// ../../packages/fields-document/src/DocumentEditor/relationship-shared.ts
function withRelationship(editor) {
  const { isVoid, isInline } = editor;
  editor.isVoid = (element) => element.type === "relationship" || isVoid(element);
  editor.isInline = (element) => element.type === "relationship" || isInline(element);
  return editor;
}

// ../../packages/fields-document/src/DocumentEditor/divider-shared.ts
var import_slate11 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
function insertDivider(editor) {
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
    type: "divider",
    children: [{ text: "" }]
  });
  import_slate11.Editor.insertNode(editor, { type: "paragraph", children: [{ text: "" }] });
}
function withDivider(editor) {
  const { isVoid } = editor;
  editor.isVoid = (node) => {
    return node.type === "divider" || isVoid(node);
  };
  return editor;
}

// ../../packages/fields-document/src/DocumentEditor/code-block-shared.ts
var import_slate12 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
function withCodeBlock(editor) {
  const { insertBreak, normalizeNode } = editor;
  editor.insertBreak = () => {
    const [node, path] = import_slate12.Editor.above(editor, {
      match: (n) => import_slate12.Element.isElement(n) && import_slate12.Editor.isBlock(editor, n)
    }) || [editor, []];
    if (node.type === "code" && import_slate12.Text.isText(node.children[0])) {
      const text2 = node.children[0].text;
      if (text2[text2.length - 1] === "\n" && editor.selection && import_slate12.Range.isCollapsed(editor.selection) && import_slate12.Point.equals(import_slate12.Editor.end(editor, path), editor.selection.anchor)) {
        insertBreak();
        import_slate12.Transforms.setNodes(editor, { type: "paragraph", children: [] });
        import_slate12.Transforms.delete(editor, {
          distance: 1,
          at: { path: [...path, 0], offset: text2.length - 1 }
        });
        return;
      }
      editor.insertText("\n");
      return;
    }
    insertBreak();
  };
  editor.normalizeNode = ([node, path]) => {
    if (node.type === "code" && import_slate12.Element.isElement(node)) {
      for (const [index, childNode] of node.children.entries()) {
        if (!import_slate12.Text.isText(childNode)) {
          if (editor.isVoid(childNode)) {
            import_slate12.Transforms.removeNodes(editor, { at: [...path, index] });
          } else {
            import_slate12.Transforms.unwrapNodes(editor, { at: [...path, index] });
          }
          return;
        }
        const marks = Object.keys(childNode).filter((x) => x !== "text");
        if (marks.length) {
          import_slate12.Transforms.unsetNodes(editor, marks, { at: [...path, index] });
          return;
        }
      }
    }
    normalizeNode([node, path]);
  };
  return editor;
}

// ../../packages/fields-document/src/DocumentEditor/marks.tsx
var import_slate13 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
var allMarkdownShortcuts = {
  bold: ["**", "__"],
  italic: ["*", "_"],
  strikethrough: ["~~"],
  code: ["`"]
};
function applyMark(editor, mark, shortcutText, startOfStartPoint) {
  editor.writeHistory("undos", { operations: [], selectionBefore: null });
  const startPointRef = import_slate13.Editor.pointRef(editor, startOfStartPoint);
  import_slate13.Transforms.delete(editor, {
    at: editor.selection.anchor,
    distance: shortcutText.length,
    reverse: true
  });
  import_slate13.Transforms.delete(editor, { at: startOfStartPoint, distance: shortcutText.length });
  import_slate13.Transforms.setNodes(
    editor,
    { [mark]: true },
    {
      match: import_slate13.Text.isText,
      split: true,
      at: { anchor: startPointRef.unref(), focus: editor.selection.anchor }
    }
  );
  editor.removeMark(mark);
}
function withMarks(editorDocumentFeatures, componentBlocks, editor) {
  const { insertText, insertBreak } = editor;
  editor.insertBreak = () => {
    insertBreak();
    const marksAfterInsertBreak = import_slate13.Editor.marks(editor);
    if (!marksAfterInsertBreak || !editor.selection) return;
    const parentBlock = import_slate13.Editor.above(editor, {
      match: (node) => import_slate13.Element.isElement(node) && import_slate13.Editor.isBlock(editor, node)
    });
    if (!parentBlock) return;
    const point = EditorAfterButIgnoringingPointsWithNoContent(editor, editor.selection.anchor);
    const marksAfterInsertBreakArr = Object.keys(
      marksAfterInsertBreak
    );
    if (!point || !import_slate13.Path.isDescendant(point.path, parentBlock[1])) {
      for (const mark of marksAfterInsertBreakArr) {
        editor.removeMark(mark);
      }
      return;
    }
    const textNode = import_slate13.Node.get(editor, point.path);
    for (const mark of marksAfterInsertBreakArr) {
      if (!textNode[mark]) {
        editor.removeMark(mark);
      }
    }
  };
  const selectedMarkdownShortcuts = {};
  const enabledMarks = editorDocumentFeatures.formatting.inlineMarks;
  Object.keys(allMarkdownShortcuts).forEach((mark) => {
    if (enabledMarks[mark]) {
      selectedMarkdownShortcuts[mark] = allMarkdownShortcuts[mark];
    }
  });
  if (Object.keys(selectedMarkdownShortcuts).length === 0) return editor;
  editor.insertText = (text2) => {
    insertText(text2);
    if (editor.selection && import_slate13.Range.isCollapsed(editor.selection)) {
      for (const [mark, shortcuts2] of Object.entries(selectedMarkdownShortcuts)) {
        for (const shortcutText of shortcuts2) {
          if (text2 === shortcutText[shortcutText.length - 1]) {
            const startOfBlock = getStartOfBlock(editor);
            const startOfBlockToEndOfShortcutString = import_slate13.Editor.string(editor, {
              anchor: editor.selection.anchor,
              focus: startOfBlock
            });
            const hasWhitespaceBeforeEndOfShortcut = /\s/.test(
              startOfBlockToEndOfShortcutString.slice(
                -shortcutText.length - 1,
                -shortcutText.length
              )
            );
            const endOfShortcutContainsExpectedContent = shortcutText === startOfBlockToEndOfShortcutString.slice(-shortcutText.length);
            if (hasWhitespaceBeforeEndOfShortcut || !endOfShortcutContainsExpectedContent) {
              continue;
            }
            const strToMatchOn = startOfBlockToEndOfShortcutString.slice(
              0,
              -shortcutText.length - 1
            );
            for (const [offsetFromStartOfBlock] of [...strToMatchOn].reverse().entries()) {
              const expectedShortcutText = strToMatchOn.slice(
                offsetFromStartOfBlock,
                offsetFromStartOfBlock + shortcutText.length
              );
              if (expectedShortcutText !== shortcutText) {
                continue;
              }
              const startOfStartOfShortcut = offsetFromStartOfBlock === 0 ? startOfBlock : EditorAfterButIgnoringingPointsWithNoContent(editor, startOfBlock, {
                distance: offsetFromStartOfBlock
              });
              const endOfStartOfShortcut = import_slate13.Editor.after(editor, startOfStartOfShortcut, {
                distance: shortcutText.length
              });
              if (offsetFromStartOfBlock !== 0 && !/\s/.test(
                import_slate13.Editor.string(editor, {
                  anchor: import_slate13.Editor.before(editor, startOfStartOfShortcut, { unit: "character" }),
                  focus: startOfStartOfShortcut
                })
              )) {
                continue;
              }
              const contentBetweenShortcuts = import_slate13.Editor.string(editor, {
                anchor: endOfStartOfShortcut,
                focus: editor.selection.anchor
              }).slice(0, -shortcutText.length);
              if (contentBetweenShortcuts === "" || /\s/.test(contentBetweenShortcuts[0])) {
                continue;
              }
              if (mark === "italic" && (contentBetweenShortcuts[0] === "_" || contentBetweenShortcuts[0] === "*")) {
                continue;
              }
              const ancestorComponentChildFieldDocumentFeatures = getAncestorComponentChildFieldDocumentFeatures(
                editor,
                editorDocumentFeatures,
                componentBlocks
              );
              if (ancestorComponentChildFieldDocumentFeatures && ancestorComponentChildFieldDocumentFeatures.inlineMarks !== "inherit" && ancestorComponentChildFieldDocumentFeatures.inlineMarks[mark] === false) {
                continue;
              }
              applyMark(editor, mark, shortcutText, startOfStartOfShortcut);
              return;
            }
          }
        }
      }
    }
  };
  return editor;
}
function getStartOfBlock(editor) {
  return import_slate13.Editor.start(
    editor,
    import_slate13.Editor.above(editor, {
      match: (node) => import_slate13.Element.isElement(node) && import_slate13.Editor.isBlock(editor, node)
    })[1]
  );
}

// ../../packages/fields-document/src/DocumentEditor/soft-breaks.ts
var import_slate14 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
function withSoftBreaks(editor) {
  editor.insertSoftBreak = () => {
    import_slate14.Transforms.insertText(editor, "\n");
  };
  return editor;
}

// ../../packages/fields-document/src/DocumentEditor/shortcuts.ts
var import_slate15 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
var shortcuts = {
  "...": "\u2026",
  "-->": "\u2192",
  "->": "\u2192",
  "<-": "\u2190",
  "<--": "\u2190",
  "--": "\u2013"
};
function withShortcuts(editor) {
  const { insertText } = editor;
  editor.insertText = (text2) => {
    insertText(text2);
    if (text2 === " " && editor.selection && import_slate15.Range.isCollapsed(editor.selection)) {
      const selectionPoint = editor.selection.anchor;
      const ancestorBlock = import_slate15.Editor.above(editor, {
        match: (node) => import_slate15.Element.isElement(node) && import_slate15.Editor.isBlock(editor, node)
      });
      if (ancestorBlock) {
        Object.keys(shortcuts).forEach((shortcut) => {
          const pointBefore = import_slate15.Editor.before(editor, selectionPoint, {
            unit: "character",
            distance: shortcut.length + 1
          });
          if (pointBefore && import_slate15.Path.isDescendant(pointBefore.path, ancestorBlock[1])) {
            const range = { anchor: selectionPoint, focus: pointBefore };
            const str = import_slate15.Editor.string(editor, range);
            if (str.slice(0, shortcut.length) === shortcut) {
              editor.writeHistory("undos", { operations: [], selectionBefore: null });
              import_slate15.Transforms.select(editor, range);
              editor.insertText(shortcuts[shortcut] + " ");
            }
          }
        });
      }
    }
  };
  return editor;
}

// ../../packages/fields-document/src/DocumentEditor/insert-menu-shared.ts
var import_slate16 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
var nodeListsWithoutInsertMenu = /* @__PURE__ */ new WeakSet();
var nodesWithoutInsertMenu = /* @__PURE__ */ new WeakSet();
function findPathWithInsertMenu(node, path) {
  if (import_slate16.Text.isText(node)) return node.insertMenu ? path : void 0;
  if (nodeListsWithoutInsertMenu.has(node.children)) return;
  for (const [index, child] of node.children.entries()) {
    if (nodesWithoutInsertMenu.has(child)) continue;
    const maybePath = findPathWithInsertMenu(child, [...path, index]);
    if (maybePath) {
      return maybePath;
    }
    nodesWithoutInsertMenu.add(child);
  }
  nodeListsWithoutInsertMenu.add(node.children);
}
function removeInsertMenuMarkWhenOutsideOfSelection(editor) {
  const path = findPathWithInsertMenu(editor, []);
  if (path && !import_slate16.Editor.marks(editor)?.insertMenu && (!editor.selection || !import_slate16.Path.equals(editor.selection.anchor.path, path) || !import_slate16.Path.equals(editor.selection.focus.path, path))) {
    import_slate16.Transforms.unsetNodes(editor, "insertMenu", { at: path });
    return true;
  }
  return false;
}
function withInsertMenu(editor) {
  const { normalizeNode, apply, insertText } = editor;
  editor.normalizeNode = ([node, path]) => {
    if (import_slate16.Text.isText(node) && node.insertMenu) {
      if (node.text[0] !== "/") {
        import_slate16.Transforms.unsetNodes(editor, "insertMenu", { at: path });
        return;
      }
      const whitespaceMatch = /\s/.exec(node.text);
      if (whitespaceMatch) {
        import_slate16.Transforms.unsetNodes(editor, "insertMenu", {
          at: {
            anchor: { path, offset: whitespaceMatch.index },
            focus: import_slate16.Editor.end(editor, path)
          },
          match: import_slate16.Text.isText,
          split: true
        });
        return;
      }
    }
    if (import_slate16.Editor.isEditor(editor) && removeInsertMenuMarkWhenOutsideOfSelection(editor)) {
      return;
    }
    normalizeNode([node, path]);
  };
  editor.apply = (op) => {
    apply(op);
    if (op.type === "set_selection") {
      removeInsertMenuMarkWhenOutsideOfSelection(editor);
    }
  };
  editor.insertText = (text2) => {
    insertText(text2);
    if (editor.selection && text2 === "/") {
      const startOfBlock = import_slate16.Editor.start(
        editor,
        import_slate16.Editor.above(editor, {
          match: (node) => import_slate16.Element.isElement(node) && import_slate16.Editor.isBlock(editor, node)
        })[1]
      );
      const before = import_slate16.Editor.before(editor, editor.selection.anchor, { unit: "character" });
      if (before && (import_slate16.Point.equals(startOfBlock, before) || before.offset !== 0 && /\s/.test(import_slate16.Node.get(editor, before.path).text[before.offset - 1]))) {
        import_slate16.Transforms.setNodes(
          editor,
          { insertMenu: true },
          {
            at: { anchor: before, focus: editor.selection.anchor },
            match: import_slate16.Text.isText,
            split: true
          }
        );
      }
    }
  };
  return editor;
}

// ../../packages/fields-document/src/DocumentEditor/block-markdown-shortcuts.ts
var import_slate17 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");
function withBlockMarkdownShortcuts(documentFeatures, componentBlocks, editor) {
  const { insertText } = editor;
  const shortcuts2 = /* @__PURE__ */ Object.create(null);
  const editorDocumentFeaturesForNormalizationToCheck = {
    ...documentFeatures,
    relationships: true
  };
  const addShortcut = (text2, insert, shouldBeEnabledInComponentBlock, type = "paragraph") => {
    if (!shouldBeEnabledInComponentBlock(editorDocumentFeaturesForNormalizationToCheck)) return;
    const trigger = text2[text2.length - 1];
    if (!shortcuts2[trigger]) {
      shortcuts2[trigger] = /* @__PURE__ */ Object.create(null);
    }
    shortcuts2[trigger][text2] = {
      insert,
      type,
      shouldBeEnabledInComponentBlock
    };
  };
  addShortcut(
    "1. ",
    () => {
      import_slate17.Transforms.wrapNodes(
        editor,
        { type: "ordered-list", children: [] },
        { match: (n) => import_slate17.Element.isElement(n) && import_slate17.Editor.isBlock(editor, n) }
      );
    },
    (features) => features.formatting.listTypes.ordered
  );
  addShortcut(
    "- ",
    () => {
      import_slate17.Transforms.wrapNodes(
        editor,
        { type: "unordered-list", children: [] },
        { match: (n) => import_slate17.Element.isElement(n) && import_slate17.Editor.isBlock(editor, n) }
      );
    },
    (features) => features.formatting.listTypes.unordered
  );
  addShortcut(
    "* ",
    () => {
      import_slate17.Transforms.wrapNodes(
        editor,
        { type: "unordered-list", children: [] },
        { match: (n) => import_slate17.Element.isElement(n) && import_slate17.Editor.isBlock(editor, n) }
      );
    },
    (features) => features.formatting.listTypes.unordered
  );
  documentFeatures.formatting.headingLevels.forEach((level) => {
    addShortcut(
      "#".repeat(level) + " ",
      () => {
        import_slate17.Transforms.setNodes(
          editor,
          { type: "heading", level },
          { match: (node) => node.type === "paragraph" || node.type === "heading" }
        );
      },
      (features) => features.formatting.headingLevels.includes(level),
      "heading-or-paragraph"
    );
  });
  addShortcut(
    "> ",
    () => {
      import_slate17.Transforms.wrapNodes(
        editor,
        { type: "blockquote", children: [] },
        { match: (node) => node.type === "paragraph" }
      );
    },
    (features) => features.formatting.blockTypes.blockquote
  );
  addShortcut(
    "```",
    () => {
      import_slate17.Transforms.wrapNodes(
        editor,
        { type: "code", children: [] },
        { match: (node) => node.type === "paragraph" }
      );
    },
    (features) => features.formatting.blockTypes.code
  );
  addShortcut(
    "---",
    () => {
      insertDivider(editor);
    },
    (features) => features.dividers
  );
  editor.insertText = (text2) => {
    insertText(text2);
    const shortcutsForTrigger = shortcuts2[text2];
    if (shortcutsForTrigger && editor.selection && import_slate17.Range.isCollapsed(editor.selection)) {
      const { anchor } = editor.selection;
      const block = import_slate17.Editor.above(editor, {
        match: (node) => import_slate17.Element.isElement(node) && import_slate17.Editor.isBlock(editor, node)
      });
      if (!block || block[0].type !== "paragraph" && block[0].type !== "heading") return;
      const start = import_slate17.Editor.start(editor, block[1]);
      const range = { anchor, focus: start };
      const shortcutText = import_slate17.Editor.string(editor, range);
      const shortcut = shortcutsForTrigger[shortcutText];
      if (!shortcut || shortcut.type === "paragraph" && block[0].type !== "paragraph") {
        return;
      }
      const locationDocumentFeatures = getAncestorComponentChildFieldDocumentFeatures(
        editor,
        documentFeatures,
        componentBlocks
      );
      if (locationDocumentFeatures && (locationDocumentFeatures.kind === "inline" || !shortcut.shouldBeEnabledInComponentBlock(locationDocumentFeatures.documentFeatures))) {
        return;
      }
      editor.writeHistory("undos", { operations: [], selectionBefore: null });
      import_slate17.Transforms.select(editor, range);
      import_slate17.Transforms.delete(editor);
      shortcut.insert();
    }
  };
  return editor;
}

// ../../packages/fields-document/src/DocumentEditor/pasting/index.ts
var import_slate19 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");

// ../../packages/fields-document/src/DocumentEditor/isValidURL.ts
var import_sanitize_url = require("../../../node_modules/.pnpm/@braintree+sanitize-url@7.0.4/node_modules/@braintree/sanitize-url/dist/index.js");
function isValidURL(url) {
  return url === (0, import_sanitize_url.sanitizeUrl)(url) || new URL(url, "https://a").toString() === new URL((0, import_sanitize_url.sanitizeUrl)(url), "https://a").toString();
}

// ../../packages/fields-document/src/DocumentEditor/pasting/html.ts
var import_slate18 = require("../../../node_modules/.pnpm/slate@0.112.0/node_modules/slate/dist/index.js");

// ../../packages/fields-document/src/DocumentEditor/pasting/utils.ts
var currentlyActiveMarks = /* @__PURE__ */ new Set();
var currentlyDisabledMarks = /* @__PURE__ */ new Set();
var currentLink = null;
function addMarkToChildren(mark, cb) {
  const wasPreviouslyActive = currentlyActiveMarks.has(mark);
  currentlyActiveMarks.add(mark);
  try {
    return cb();
  } finally {
    if (!wasPreviouslyActive) {
      currentlyActiveMarks.delete(mark);
    }
  }
}
function setLinkForChildren(href, cb) {
  if (currentLink !== null) {
    return cb();
  }
  currentLink = href;
  try {
    return cb();
  } finally {
    currentLink = null;
  }
}
function addMarksToChildren(marks, cb) {
  const marksToRemove = /* @__PURE__ */ new Set();
  for (const mark of marks) {
    if (!currentlyActiveMarks.has(mark)) {
      marksToRemove.add(mark);
    }
    currentlyActiveMarks.add(mark);
  }
  try {
    return cb();
  } finally {
    for (const mark of marksToRemove) {
      currentlyActiveMarks.delete(mark);
    }
  }
}
function forceDisableMarkForChildren(mark, cb) {
  const wasPreviouslyDisabled = currentlyDisabledMarks.has(mark);
  currentlyDisabledMarks.add(mark);
  try {
    return cb();
  } finally {
    if (!wasPreviouslyDisabled) {
      currentlyDisabledMarks.delete(mark);
    }
  }
}
function getInlineNodes(text2) {
  const node = { text: text2 };
  for (const mark of currentlyActiveMarks) {
    if (!currentlyDisabledMarks.has(mark)) {
      node[mark] = true;
    }
  }
  if (currentLink !== null) {
    return [
      { text: "" },
      { type: "link", href: currentLink, children: [node] },
      { text: "" }
    ];
  }
  return [node];
}

// ../../packages/fields-document/src/DocumentEditor/pasting/html.ts
function getAlignmentFromElement(element) {
  const parent = element.parentElement;
  const attribute = parent?.getAttribute("data-align");
  if (attribute === "center" || attribute === "end") {
    return attribute;
  }
  if (element instanceof HTMLElement) {
    const textAlign = element.style.textAlign;
    if (textAlign === "center") {
      return "center";
    }
    if (textAlign === "right" || textAlign === "end") {
      return "end";
    }
  }
}
var headings = {
  H1: 1,
  H2: 2,
  H3: 3,
  H4: 4,
  H5: 5,
  H6: 6
};
var TEXT_TAGS = {
  CODE: "code",
  DEL: "strikethrough",
  S: "strikethrough",
  STRIKE: "strikethrough",
  EM: "italic",
  I: "italic",
  STRONG: "bold",
  U: "underline",
  SUP: "superscript",
  SUB: "subscript",
  KBD: "keyboard"
};
function marksFromElementAttributes(element) {
  const marks = /* @__PURE__ */ new Set();
  const style = element.style;
  const { nodeName } = element;
  const markFromNodeName = TEXT_TAGS[nodeName];
  if (markFromNodeName) {
    marks.add(markFromNodeName);
  }
  const { fontWeight, textDecoration, verticalAlign } = style;
  if (textDecoration === "underline") {
    marks.add("underline");
  } else if (textDecoration === "line-through") {
    marks.add("strikethrough");
  }
  if (nodeName === "SPAN" && element.classList.contains("code")) {
    marks.add("code");
  }
  if (nodeName === "B" && fontWeight !== "normal") {
    marks.add("bold");
  } else if (typeof fontWeight === "string" && (fontWeight === "bold" || fontWeight === "bolder" || fontWeight === "1000" || /^[5-9]\d{2}$/.test(fontWeight))) {
    marks.add("bold");
  }
  if (style.fontStyle === "italic") {
    marks.add("italic");
  }
  if (verticalAlign === "super") {
    marks.add("superscript");
  } else if (verticalAlign === "sub") {
    marks.add("subscript");
  }
  return marks;
}
function deserializeHTML(html) {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  return fixNodesForBlockChildren(deserializeNodes(parsed.body.childNodes));
}
function deserializeHTMLNode(el) {
  if (!(el instanceof globalThis.HTMLElement)) {
    const text2 = el.textContent;
    if (!text2) {
      return [];
    }
    return getInlineNodes(text2);
  }
  if (el.nodeName === "BR") {
    return getInlineNodes("\n");
  }
  if (el.nodeName === "IMG") {
    const alt = el.getAttribute("alt");
    return getInlineNodes(alt ?? "");
  }
  if (el.nodeName === "HR") {
    return [{ type: "divider", children: [{ text: "" }] }];
  }
  const marks = marksFromElementAttributes(el);
  if (el.classList.contains("listtype-quote")) {
    marks.delete("italic");
    return addMarksToChildren(marks, () => [
      { type: "blockquote", children: fixNodesForBlockChildren(deserializeNodes(el.childNodes)) }
    ]);
  }
  return addMarksToChildren(marks, () => {
    const { nodeName } = el;
    if (nodeName === "A") {
      const href = el.getAttribute("href");
      if (href) {
        return setLinkForChildren(
          href,
          () => forceDisableMarkForChildren("underline", () => deserializeNodes(el.childNodes))
        );
      }
    }
    if (nodeName === "PRE" && el.textContent) {
      return [{ type: "code", children: [{ text: el.textContent || "" }] }];
    }
    const deserialized = deserializeNodes(el.childNodes);
    const children = fixNodesForBlockChildren(deserialized);
    if (nodeName === "LI") {
      let nestedList;
      const listItemContent = {
        type: "list-item-content",
        children: children.filter((node) => {
          if (nestedList === void 0 && (node.type === "ordered-list" || node.type === "unordered-list")) {
            nestedList = node;
            return false;
          }
          return true;
        })
      };
      const listItemChildren = nestedList ? [listItemContent, nestedList] : [listItemContent];
      return [{ type: "list-item", children: listItemChildren }];
    }
    if (nodeName === "P") {
      return [{ type: "paragraph", textAlign: getAlignmentFromElement(el), children }];
    }
    const headingLevel = headings[nodeName];
    if (typeof headingLevel === "number") {
      return [
        { type: "heading", level: headingLevel, textAlign: getAlignmentFromElement(el), children }
      ];
    }
    if (nodeName === "BLOCKQUOTE") {
      return [{ type: "blockquote", children }];
    }
    if (nodeName === "OL") {
      return [{ type: "ordered-list", children }];
    }
    if (nodeName === "UL") {
      return [{ type: "unordered-list", children }];
    }
    if (nodeName === "DIV" && !isBlock(children[0])) {
      return [{ type: "paragraph", children }];
    }
    return deserialized;
  });
}
function deserializeNodes(nodes) {
  const outputNodes = [];
  for (const node of nodes) {
    outputNodes.push(...deserializeHTMLNode(node));
  }
  return outputNodes;
}
function fixNodesForBlockChildren(deserializedNodes) {
  if (!deserializedNodes.length) {
    return [{ text: "" }];
  }
  if (deserializedNodes.some(isBlock)) {
    const result = [];
    let queuedInlines = [];
    const flushInlines = () => {
      if (queuedInlines.length) {
        result.push({ type: "paragraph", children: queuedInlines });
        queuedInlines = [];
      }
    };
    for (const node of deserializedNodes) {
      if (isBlock(node)) {
        flushInlines();
        result.push(node);
        continue;
      }
      if (import_slate18.Node.string(node).trim() !== "") {
        queuedInlines.push(node);
      }
    }
    flushInlines();
    return result;
  }
  return deserializedNodes;
}

// ../../packages/fields-document/src/DocumentEditor/pasting/markdown.ts
var import_mdast_util_from_markdown = __toESM(require("../../../node_modules/.pnpm/mdast-util-from-markdown@0.8.5/node_modules/mdast-util-from-markdown/index.js"));
var import_from_markdown = __toESM(require("../../../node_modules/.pnpm/mdast-util-gfm-autolink-literal@0.1.3/node_modules/mdast-util-gfm-autolink-literal/from-markdown.js"));
var import_micromark_extension_gfm_autolink_literal = __toESM(require("../../../node_modules/.pnpm/micromark-extension-gfm-autolink-literal@0.5.7/node_modules/micromark-extension-gfm-autolink-literal/index.js"));
var import_from_markdown2 = __toESM(require("../../../node_modules/.pnpm/mdast-util-gfm-strikethrough@0.2.3/node_modules/mdast-util-gfm-strikethrough/from-markdown.js"));
var import_micromark_extension_gfm_strikethrough = __toESM(require("../../../node_modules/.pnpm/micromark-extension-gfm-strikethrough@0.6.5/node_modules/micromark-extension-gfm-strikethrough/index.js"));
var markdownConfig = {
  mdastExtensions: [import_from_markdown.default, import_from_markdown2.default],
  extensions: [import_micromark_extension_gfm_autolink_literal.default, (0, import_micromark_extension_gfm_strikethrough.default)()]
};
function deserializeMarkdown(markdown) {
  const root = (0, import_mdast_util_from_markdown.default)(markdown, markdownConfig);
  let nodes = root.children;
  if (nodes.length === 1 && nodes[0].type === "paragraph") {
    nodes = nodes[0].children;
  }
  return deserializeChildren(nodes, markdown);
}
function deserializeChildren(nodes, input) {
  const outputNodes = [];
  for (const node of nodes) {
    const result = deserializeMarkdownNode(node, input);
    if (result.length) {
      outputNodes.push(...result);
    }
  }
  if (!outputNodes.length) {
    outputNodes.push({ text: "" });
  }
  return outputNodes;
}
function deserializeMarkdownNode(node, input) {
  switch (node.type) {
    case "blockquote":
      return [{ type: "blockquote", children: deserializeChildren(node.children, input) }];
    case "link": {
      return setLinkForChildren(node.url, () => deserializeChildren(node.children, input));
    }
    case "code":
      return [{ type: "code", children: [{ text: node.value }] }];
    case "paragraph":
      return [{ type: "paragraph", children: deserializeChildren(node.children, input) }];
    case "heading": {
      return [
        {
          type: "heading",
          level: node.depth,
          children: deserializeChildren(node.children, input)
        }
      ];
    }
    case "list": {
      return [
        {
          type: node.ordered ? "ordered-list" : "unordered-list",
          children: deserializeChildren(node.children, input)
        }
      ];
    }
    case "listItem":
      return [{ type: "list-item", children: deserializeChildren(node.children, input) }];
    case "thematicBreak":
      return [{ type: "divider", children: [{ text: "" }] }];
    case "break":
      return getInlineNodes("\n");
    case "delete":
      return addMarkToChildren("strikethrough", () => deserializeChildren(node.children, input));
    case "strong":
      return addMarkToChildren("bold", () => deserializeChildren(node.children, input));
    case "emphasis":
      return addMarkToChildren("italic", () => deserializeChildren(node.children, input));
    case "inlineCode":
      return addMarkToChildren("code", () => getInlineNodes(node.value));
    case "text":
      return getInlineNodes(node.value);
  }
  return getInlineNodes(input.slice(node.position.start.offset, node.position.end.offset));
}

// ../../packages/fields-document/src/DocumentEditor/pasting/index.ts
var urlPattern = /https?:\/\//;
function insertFragmentButDifferent(editor, nodes) {
  const firstNode = nodes[0];
  if (import_slate19.Element.isElement(firstNode) && import_slate19.Editor.isBlock(editor, firstNode)) {
    insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, nodes);
  } else {
    import_slate19.Transforms.insertFragment(editor, nodes);
  }
}
function withPasting(editor) {
  const { insertData, setFragmentData } = editor;
  editor.setFragmentData = (data) => {
    if (editor.selection) {
      data.setData("application/x-keystone-document-editor", "true");
    }
    setFragmentData(data);
  };
  editor.insertData = (data) => {
    if (data.getData("application/x-keystone-document-editor") === "true") {
      insertData(data);
      return;
    }
    const blockAbove = import_slate19.Editor.above(editor, {
      match: (node) => import_slate19.Element.isElement(node) && import_slate19.Editor.isBlock(editor, node)
    });
    if (blockAbove?.[0].type === "code") {
      const plain2 = data.getData("text/plain");
      editor.insertText(plain2);
      return;
    }
    const vsCodeEditorData = data.getData("vscode-editor-data");
    if (vsCodeEditorData) {
      try {
        const vsCodeData = JSON.parse(vsCodeEditorData);
        if (vsCodeData?.mode === "markdown" || vsCodeData?.mode === "mdx") {
          const plain2 = data.getData("text/plain");
          if (plain2) {
            const fragment = deserializeMarkdown(plain2);
            insertFragmentButDifferent(editor, fragment);
            return;
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    const plain = data.getData("text/plain");
    if (
      // isValidURL is a bit more permissive than a user might expect
      // so for pasting, we'll constrain it to starting with https:// or http://
      urlPattern.test(plain) && isValidURL(plain) && editor.selection && !import_slate19.Range.isCollapsed(editor.selection) && // we only want to turn the selected text into a link if the selection is within the same block
      import_slate19.Editor.above(editor, {
        match: (node) => import_slate19.Element.isElement(node) && import_slate19.Editor.isBlock(editor, node) && !(import_slate19.Element.isElement(node.children[0]) && import_slate19.Editor.isBlock(editor, node.children[0]))
      }) && // and there is only text(potentially with marks) in the selection
      // no other links or inline relationships
      import_slate19.Editor.nodes(editor, {
        match: (node) => import_slate19.Element.isElement(node) && import_slate19.Editor.isInline(editor, node)
      }).next().done
    ) {
      import_slate19.Transforms.wrapNodes(editor, { type: "link", href: plain, children: [] }, { split: true });
      return;
    }
    const html = data.getData("text/html");
    if (html) {
      const fragment = deserializeHTML(html);
      insertFragmentButDifferent(editor, fragment);
      return;
    }
    if (plain) {
      const fragment = deserializeMarkdown(plain);
      insertFragmentButDifferent(editor, fragment);
      return;
    }
    insertData(data);
  };
  return editor;
}

// ../../packages/fields-document/src/DocumentEditor/editor-shared.ts
var blockquoteChildren = [
  "paragraph",
  "code",
  "heading",
  "ordered-list",
  "unordered-list",
  "divider"
];
var paragraphLike = [...blockquoteChildren, "blockquote"];
var insideOfLayouts = [...paragraphLike, "component-block"];
var editorSchema = {
  editor: blockContainer({
    allowedChildren: [...insideOfLayouts, "layout"],
    invalidPositionHandleMode: "move"
  }),
  layout: blockContainer({ allowedChildren: ["layout-area"], invalidPositionHandleMode: "move" }),
  "layout-area": blockContainer({
    allowedChildren: insideOfLayouts,
    invalidPositionHandleMode: "unwrap"
  }),
  blockquote: blockContainer({
    allowedChildren: blockquoteChildren,
    invalidPositionHandleMode: "move"
  }),
  paragraph: inlineContainer({ invalidPositionHandleMode: "unwrap" }),
  code: inlineContainer({ invalidPositionHandleMode: "move" }),
  divider: inlineContainer({ invalidPositionHandleMode: "move" }),
  heading: inlineContainer({ invalidPositionHandleMode: "unwrap" }),
  "component-block": blockContainer({
    allowedChildren: ["component-block-prop", "component-inline-prop"],
    invalidPositionHandleMode: "move"
  }),
  "component-inline-prop": inlineContainer({ invalidPositionHandleMode: "unwrap" }),
  "component-block-prop": blockContainer({
    allowedChildren: insideOfLayouts,
    invalidPositionHandleMode: "unwrap"
  }),
  "ordered-list": blockContainer({
    allowedChildren: ["list-item"],
    invalidPositionHandleMode: "move"
  }),
  "unordered-list": blockContainer({
    allowedChildren: ["list-item"],
    invalidPositionHandleMode: "move"
  }),
  "list-item": blockContainer({
    allowedChildren: ["list-item-content", "ordered-list", "unordered-list"],
    invalidPositionHandleMode: "unwrap"
  }),
  "list-item-content": inlineContainer({ invalidPositionHandleMode: "unwrap" })
};
function inlineContainer(args) {
  return {
    kind: "inlines",
    invalidPositionHandleMode: args.invalidPositionHandleMode
  };
}
var inlineContainerTypes = new Set(
  Object.entries(editorSchema).filter(([, value]) => value.kind === "inlines").map(([type]) => type)
);
function isInlineContainer(node) {
  return node.type !== void 0 && inlineContainerTypes.has(node.type);
}
function createDocumentEditor(documentFeatures, componentBlocks, relationships, slate) {
  return withPasting(
    withSoftBreaks(
      withBlocksSchema(
        withLink(
          documentFeatures,
          componentBlocks,
          withList(
            withHeading(
              withRelationship(
                withInsertMenu(
                  withComponentBlocks(
                    componentBlocks,
                    documentFeatures,
                    relationships,
                    withParagraphs(
                      withShortcuts(
                        withDivider(
                          withLayouts(
                            withMarks(
                              documentFeatures,
                              componentBlocks,
                              withCodeBlock(
                                withBlockMarkdownShortcuts(
                                  documentFeatures,
                                  componentBlocks,
                                  withBlockquote(
                                    withDocumentFeaturesNormalization(
                                      documentFeatures,
                                      relationships,
                                      (0, import_slate_history.withHistory)(
                                        slate?.withReact((0, import_slate20.createEditor)()) ?? (0, import_slate20.createEditor)()
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}
function blockContainer(args) {
  return {
    kind: "blocks",
    allowedChildren: new Set(args.allowedChildren),
    blockToWrapInlinesIn: args.allowedChildren[0],
    invalidPositionHandleMode: args.invalidPositionHandleMode
  };
}
var blockTypes = new Set(
  Object.keys(editorSchema).filter((x) => x !== "editor")
);
function isBlock(node) {
  return blockTypes.has(node.type);
}
function withBlocksSchema(editor) {
  const { normalizeNode } = editor;
  editor.normalizeNode = ([node, path]) => {
    if (!import_slate20.Text.isText(node) && node.type !== "link" && node.type !== "relationship") {
      const nodeType = import_slate20.Editor.isEditor(node) ? "editor" : node.type;
      if (typeof nodeType !== "string" || editorSchema[nodeType] === void 0) {
        import_slate20.Transforms.unwrapNodes(editor, { at: path });
        return;
      }
      const info = editorSchema[nodeType];
      if (info.kind === "blocks" && node.children.length !== 0 && node.children.every((child) => !(import_slate20.Element.isElement(child) && import_slate20.Editor.isBlock(editor, child)))) {
        import_slate20.Transforms.wrapNodes(
          editor,
          { type: info.blockToWrapInlinesIn, children: [] },
          { at: path, match: (node2) => !(import_slate20.Element.isElement(node2) && import_slate20.Editor.isBlock(editor, node2)) }
        );
        return;
      }
      for (const [index, childNode] of node.children.entries()) {
        const childPath = [...path, index];
        if (info.kind === "inlines") {
          if (!import_slate20.Text.isText(childNode) && !import_slate20.Editor.isInline(editor, childNode) && // these checks are implicit in Editor.isBlock
          // but that isn't encoded in types so these will make TS happy
          childNode.type !== "link" && childNode.type !== "relationship") {
            handleNodeInInvalidPosition(editor, [childNode, childPath], path);
            return;
          }
        } else {
          if (!(import_slate20.Element.isElement(childNode) && import_slate20.Editor.isBlock(editor, childNode)) || // these checks are implicit in Editor.isBlock
          // but that isn't encoded in types so these will make TS happy
          childNode.type === "link" || childNode.type === "relationship") {
            import_slate20.Transforms.wrapNodes(
              editor,
              { type: info.blockToWrapInlinesIn, children: [] },
              { at: childPath }
            );
            return;
          }
          if (import_slate20.Element.isElement(childNode) && import_slate20.Editor.isBlock(editor, childNode) && !info.allowedChildren.has(childNode.type)) {
            handleNodeInInvalidPosition(editor, [childNode, childPath], path);
            return;
          }
        }
      }
    }
    normalizeNode([node, path]);
  };
  return editor;
}
function handleNodeInInvalidPosition(editor, [node, path], parentPath) {
  const nodeType = node.type;
  const childNodeInfo = editorSchema[nodeType];
  const parentNode = import_slate20.Node.get(editor, parentPath);
  const parentNodeType = import_slate20.Editor.isEditor(parentNode) ? "editor" : parentNode.type;
  const parentNodeInfo = editorSchema[parentNodeType];
  if (!childNodeInfo || childNodeInfo.invalidPositionHandleMode === "unwrap") {
    if (parentNodeInfo.kind === "blocks" && parentNodeInfo.blockToWrapInlinesIn) {
      import_slate20.Transforms.setNodes(
        editor,
        {
          type: parentNodeInfo.blockToWrapInlinesIn,
          ...Object.fromEntries(
            Object.keys(node).filter((key) => key !== "type" && key !== "children").map((key) => [key, null])
          )
          // the Slate types don't understand that null is allowed and it will unset properties with setNodes
        },
        { at: path }
      );
      return;
    }
    import_slate20.Transforms.unwrapNodes(editor, { at: path });
    return;
  }
  const info = editorSchema[parentNode.type || "editor"];
  if (info?.kind === "blocks" && info.allowedChildren.has(nodeType)) {
    if (parentPath.length === 0) {
      import_slate20.Transforms.moveNodes(editor, { at: path, to: [path[0] + 1] });
    } else {
      import_slate20.Transforms.moveNodes(editor, { at: path, to: import_slate20.Path.next(parentPath) });
    }
    return;
  }
  if (import_slate20.Editor.isEditor(parentNode)) {
    import_slate20.Transforms.moveNodes(editor, { at: path, to: [path[0] + 1] });
    import_slate20.Transforms.unwrapNodes(editor, { at: [path[0] + 1] });
    return;
  }
  handleNodeInInvalidPosition(editor, [node, path], parentPath.slice(0, -1));
}

// ../../packages/fields-document/src/structure-validation.ts
var import_zod = require("../../../node_modules/.pnpm/zod@4.0.10/node_modules/zod/index.js");
var zMarkValue = import_zod.z.union([import_zod.z.literal(true), import_zod.z.undefined()]);
var zText = import_zod.z.object({
  type: import_zod.z.literal("text").optional(),
  text: import_zod.z.string(),
  bold: zMarkValue,
  italic: zMarkValue,
  underline: zMarkValue,
  strikethrough: zMarkValue,
  code: zMarkValue,
  superscript: zMarkValue,
  subscript: zMarkValue,
  keyboard: zMarkValue,
  insertMenu: zMarkValue
}).strict();
var zTextAlign = import_zod.z.union([import_zod.z.undefined(), import_zod.z.literal("center"), import_zod.z.literal("end")]);
var zLink = import_zod.z.object({
  type: import_zod.z.literal("link"),
  href: import_zod.z.string().refine((val) => isValidURL(val), {
    error: `This type of URL is not accepted`
  })
}).strict();
var zHeading = import_zod.z.object({
  type: import_zod.z.literal("heading"),
  textAlign: zTextAlign,
  level: import_zod.z.union([
    import_zod.z.literal(1),
    import_zod.z.literal(2),
    import_zod.z.literal(3),
    import_zod.z.literal(4),
    import_zod.z.literal(5),
    import_zod.z.literal(6)
  ])
}).strict();
var zParagraph = import_zod.z.object({
  type: import_zod.z.literal("paragraph"),
  textAlign: zTextAlign
}).strict();
var zBasicElement = (type) => import_zod.z.object({
  type: import_zod.z.literal(type)
}).strict();
var zBasicElements = [
  zBasicElement("blockquote"),
  zBasicElement("layout-area"),
  zBasicElement("code"),
  zBasicElement("divider"),
  zBasicElement("list-item"),
  zBasicElement("list-item-content"),
  zBasicElement("ordered-list"),
  zBasicElement("unordered-list")
];
var zLayout = import_zod.z.object({
  type: import_zod.z.literal("layout"),
  layout: import_zod.z.array(import_zod.z.number())
}).strict();
var zRelationshipData = import_zod.z.object({
  id: import_zod.z.string(),
  label: import_zod.z.string().optional(),
  data: import_zod.z.record(import_zod.z.string(), import_zod.z.any()).optional()
}).strict();
var zRelationship = import_zod.z.object({
  type: import_zod.z.literal("relationship"),
  relationship: import_zod.z.string(),
  data: import_zod.z.union([zRelationshipData, import_zod.z.null()])
}).strict();
var zComponentBlock = import_zod.z.object({
  type: import_zod.z.literal("component-block"),
  component: import_zod.z.string(),
  props: import_zod.z.record(import_zod.z.string(), import_zod.z.any())
}).strict();
var zComponentProp = (type) => import_zod.z.object({
  type: import_zod.z.literal(type),
  propPath: import_zod.z.array(import_zod.z.union([import_zod.z.string(), import_zod.z.number()])).optional()
}).strict();
var zComponentProps = [
  zComponentProp("component-block-prop"),
  zComponentProp("component-inline-prop")
];
var zBlock = import_zod.z.discriminatedUnion("type", [
  zComponentBlock.extend({ children: import_zod.z.lazy(() => zChildren) }),
  ...zComponentProps.map((prop) => prop.extend({ children: import_zod.z.lazy(() => zChildren) })),
  ...zBasicElements.map((prop) => prop.extend({ children: import_zod.z.lazy(() => zChildren) })),
  zHeading.extend({ children: import_zod.z.lazy(() => zChildren) }),
  zLayout.extend({ children: import_zod.z.lazy(() => zChildren) }),
  zParagraph.extend({ children: import_zod.z.lazy(() => zChildren) })
]);
var zInline = import_zod.z.discriminatedUnion("type", [
  zText,
  zLink.extend({ children: import_zod.z.lazy(() => zChildren) }),
  zRelationship.extend({ children: import_zod.z.lazy(() => zChildren) })
]);
var zChildren = import_zod.z.array(import_zod.z.union([zBlock, zInline]));
var zDocument = import_zod.z.array(zBlock);
function isRelationshipData(value) {
  return zRelationshipData.safeParse(value).success;
}
function validateDocumentStructure(value) {
  const result = zDocument.safeParse(value);
  if (!result.success) {
    throw new Error(`Invalid document structure: ${result.error.message}`);
  }
}

// ../../packages/fields-document/src/validation.ts
var PropValidationError = class extends Error {
  path;
  constructor(message, path) {
    super(`${message} at ${path.join(".")}`);
    this.path = path;
  }
};
function validateComponentBlockProps(schema, value, relationships, path) {
  if (schema.kind === "form") {
    value = value === void 0 ? schema.defaultValue : value;
    if (schema.validate(value)) {
      return value;
    }
    throw new PropValidationError(`Invalid form prop value: ${JSON.stringify(value)}`, path);
  }
  if (schema.kind === "child") {
    return null;
  }
  if (schema.kind === "relationship") {
    if (schema.many) {
      if (Array.isArray(value) && value.every(isRelationshipData)) {
        return value.map((x) => ({ id: x.id }));
      } else {
        throw new PropValidationError(`Invalid relationship value: ${JSON.stringify(value)}`, path);
      }
    }
    if (value === null || isRelationshipData(value)) {
      return value === null ? null : { id: value.id };
    } else {
      throw new PropValidationError(`Invalid relationship value: ${JSON.stringify(value)}`, path);
    }
  }
  if (schema.kind === "conditional") {
    if (typeof value !== "object" || value === null) {
      throw new PropValidationError(
        `Conditional value must be an object but is ${typeof value}`,
        path
      );
    }
    for (const key of Object.keys(value)) {
      if (key !== "discriminant" && key !== "value") {
        throw new PropValidationError(
          `Conditional value only allows keys named "discriminant" and "value", not "${key}"`,
          path
        );
      }
    }
    const discriminant = value.discriminant;
    const val = value.value;
    const obj = {};
    const discriminantVal = validateComponentBlockProps(
      schema.discriminant,
      discriminant,
      relationships,
      path.concat("discriminant")
    );
    if (discriminantVal !== void 0) {
      obj.discriminant = discriminantVal;
    }
    const conditionalFieldValue = validateComponentBlockProps(
      schema.values[discriminant],
      val,
      relationships,
      path.concat("value")
    );
    if (conditionalFieldValue !== void 0) {
      obj.value = conditionalFieldValue;
    }
    return obj;
  }
  if (schema.kind === "object") {
    if (typeof value !== "object" || value === null) {
      throw new PropValidationError(`Object value must be an object but is ${typeof value}`, path);
    }
    const val = {};
    for (const key of Object.keys(schema.fields)) {
      const propVal = validateComponentBlockProps(
        schema.fields[key],
        value[key],
        relationships,
        path.concat(key)
      );
      if (propVal !== void 0) {
        val[key] = propVal;
      }
    }
    return val;
  }
  if (schema.kind === "array") {
    if (!Array.isArray(value)) {
      throw new PropValidationError(
        `Array field value must be an array but is ${typeof value}`,
        path
      );
    }
    return value.map((innerVal, i) => {
      return validateComponentBlockProps(schema.element, innerVal, relationships, path.concat(i));
    });
  }
  assertNever(schema);
}
function isText(node) {
  return import_slate21.Text.isText(node);
}
function getValidatedNodeWithNormalizedComponentFormProps(node, componentBlocks, relationships) {
  if (isText(node)) return node;
  if (node.type === "component-block") {
    if (Object.prototype.hasOwnProperty.call(componentBlocks, node.component)) {
      const componentBlock = componentBlocks[node.component];
      node = {
        ...node,
        props: validateComponentBlockProps(
          { kind: "object", fields: componentBlock.schema },
          node.props,
          relationships,
          []
        )
      };
    }
  }
  if (node.type === "relationship") {
    node = {
      type: "relationship",
      data: node.data?.id !== void 0 ? { id: node.data.id, data: void 0, label: void 0 } : null,
      relationship: node.relationship,
      children: node.children
    };
  }
  return {
    ...node,
    children: node.children.map(
      (x) => getValidatedNodeWithNormalizedComponentFormProps(x, componentBlocks, relationships)
    )
  };
}
function validateAndNormalizeDocument(value, documentFeatures, componentBlocks, relationships) {
  validateDocumentStructure(value);
  const children = value.map(
    (x) => getValidatedNodeWithNormalizedComponentFormProps(x, componentBlocks, relationships)
  );
  const editor = createDocumentEditor(documentFeatures, componentBlocks, relationships);
  editor.children = children;
  import_slate21.Editor.normalize(editor, { force: true });
  return editor.children;
}

// ../../packages/fields-document/src/structure.ts
var import_core6 = require("@keystone-6/core");
var import_types = require("@keystone-6/core/types");

// ../../packages/fields-document/src/structure-graphql-input.ts
var import_core4 = require("@keystone-6/core");

// ../../packages/fields-document/src/structure-graphql-output.ts
var import_core5 = require("@keystone-6/core");

// ../../packages/fields-document/src/index.ts
function document({
  componentBlocks = {},
  dividers,
  formatting,
  layouts,
  relationships: configRelationships,
  links,
  ...config2
} = {}) {
  return (meta) => {
    const documentFeatures = normaliseDocumentFeatures({
      dividers,
      formatting,
      layouts,
      links
    });
    const relationships = normaliseRelationships(configRelationships, meta);
    const inputResolver = (data) => {
      if (data === null)
        throw new import_graphql3.GraphQLError("Input error: Document fields cannot be set to null");
      if (data === void 0) return data;
      return validateAndNormalizeDocument(data, documentFeatures, componentBlocks, relationships);
    };
    if (config2.isIndexed === "unique") {
      throw Error("isIndexed: 'unique' is not a supported option for field type document");
    }
    const lists2 = new Set(Object.keys(meta.lists));
    for (const [name, block] of Object.entries(componentBlocks)) {
      try {
        assertValidComponentSchema({ kind: "object", fields: block.schema }, lists2, "document");
      } catch (err) {
        throw new Error(
          `Component block ${name} in ${meta.listKey}.${meta.fieldKey}: ${err.message}`
        );
      }
    }
    const defaultValue = [{ type: "paragraph", children: [{ text: "" }] }];
    return (0, import_types2.fieldType)({
      kind: "scalar",
      scalar: "Json",
      mode: "required",
      default: meta.provider === "sqlite" ? void 0 : {
        kind: "literal",
        // TODO: waiting on https://github.com/prisma/prisma/issues/26571
        //   input.create manages defaultValues anyway
        value: JSON.stringify(defaultValue ?? null)
      },
      map: config2.db?.map,
      extendPrismaSchema: config2.db?.extendPrismaSchema
    })({
      ...config2,
      __ksTelemetryFieldTypeName: "@keystone-6/document",
      input: {
        create: {
          arg: import_core7.g.arg({ type: import_core7.g.JSON }),
          resolve(val) {
            if (val === void 0) {
              val = defaultValue;
            }
            return inputResolver(val);
          }
        },
        update: { arg: import_core7.g.arg({ type: import_core7.g.JSON }), resolve: inputResolver }
      },
      output: import_core7.g.field({
        type: import_core7.g.object()({
          name: `${meta.listKey}_${meta.fieldKey}_Document`,
          fields: {
            document: import_core7.g.field({
              args: {
                hydrateRelationships: import_core7.g.arg({
                  type: import_core7.g.nonNull(import_core7.g.Boolean),
                  defaultValue: false
                })
              },
              type: import_core7.g.nonNull(import_core7.g.JSON),
              resolve({ document: document2 }, { hydrateRelationships }, context) {
                return hydrateRelationships ? addRelationshipData(document2, context, relationships, componentBlocks) : document2;
              }
            })
          }
        }),
        resolve({ value }) {
          if (value === null) return null;
          return { document: value };
        }
      }),
      views: "@keystone-6/fields-document/views",
      getAdminMeta() {
        return {
          relationships,
          documentFeatures,
          componentBlocksPassedOnServer: Object.keys(componentBlocks)
        };
      }
    });
  };
}
function normaliseRelationships(configRelationships, meta) {
  if (!configRelationships) return {};
  const relationships = {};
  for (const [key, relationship2] of Object.entries(configRelationships)) {
    if (meta.lists[relationship2.listKey] === void 0) {
      throw new Error(
        `An inline relationship ${relationship2.label} (${key}) in the field at ${meta.listKey}.${meta.fieldKey} has listKey set to "${relationship2.listKey}" but no list named "${relationship2.listKey}" exists.`
      );
    }
    relationships[key] = {
      ...relationship2,
      labelField: relationship2.labelField ?? null,
      selection: relationship2.selection ?? null
    };
  }
  return relationships;
}
function normaliseDocumentFeatures(config2) {
  const {
    alignment,
    blockTypes: blockTypes2,
    headingLevels,
    inlineMarks,
    listTypes,
    softBreaks
  } = typeof config2.formatting === "boolean" ? {
    alignment: config2.formatting,
    blockTypes: config2.formatting,
    headingLevels: config2.formatting,
    inlineMarks: config2.formatting,
    listTypes: config2.formatting,
    softBreaks: config2.formatting
  } : config2.formatting ?? {};
  const documentFeatures = {
    formatting: {
      alignment: {
        center: typeof alignment === "boolean" ? alignment : !!alignment?.center,
        end: typeof alignment === "boolean" ? alignment : !!alignment?.end
      },
      blockTypes: {
        blockquote: typeof blockTypes2 === "boolean" ? blockTypes2 : !!blockTypes2?.blockquote,
        code: typeof blockTypes2 === "boolean" ? blockTypes2 : !!blockTypes2?.code
      },
      headingLevels: typeof headingLevels === "boolean" ? [1, 2, 3, 4, 5, 6].filter((_) => headingLevels) : [...new Set(headingLevels)].sort(),
      inlineMarks: {
        bold: typeof inlineMarks === "boolean" ? inlineMarks : !!inlineMarks?.bold,
        code: typeof inlineMarks === "boolean" ? inlineMarks : !!inlineMarks?.code,
        italic: typeof inlineMarks === "boolean" ? inlineMarks : !!inlineMarks?.italic,
        strikethrough: typeof inlineMarks === "boolean" ? inlineMarks : !!inlineMarks?.strikethrough,
        underline: typeof inlineMarks === "boolean" ? inlineMarks : !!inlineMarks?.underline,
        keyboard: typeof inlineMarks === "boolean" ? inlineMarks : !!inlineMarks?.keyboard,
        subscript: typeof inlineMarks === "boolean" ? inlineMarks : !!inlineMarks?.subscript,
        superscript: typeof inlineMarks === "boolean" ? inlineMarks : !!inlineMarks?.superscript
      },
      listTypes: {
        ordered: typeof listTypes === "boolean" ? listTypes : !!listTypes?.ordered,
        unordered: typeof listTypes === "boolean" ? listTypes : !!listTypes?.unordered
      },
      softBreaks: typeof softBreaks === "boolean" ? softBreaks : !!softBreaks
    },
    links: !!config2.links,
    layouts: [...new Set((config2.layouts || []).map((x) => JSON.stringify(x)))].map(
      (x) => JSON.parse(x)
    ),
    dividers: !!config2.dividers
  };
  return documentFeatures;
}

// schema.ts
var import_promises = __toESM(require("node:fs/promises"));

// access.ts
var isSignedIn = ({ session: session2 }) => Boolean(session2);
function hasPermission(permission) {
  return ({ session: session2 }) => Boolean(session2?.data.role?.[permission]);
}
var permissions = {
  canUseAdminUI: hasPermission("canUseAdminUI"),
  canManageUsers: hasPermission("canManageUsers"),
  canManageAssets: hasPermission("canManageAssets"),
  canApproveAssets: hasPermission("canApproveAssets"),
  canManageBrands: hasPermission("canManageBrands"),
  canManageContent: hasPermission("canManageContent"),
  canPublishContent: hasPermission("canPublishContent"),
  canViewAnalytics: hasPermission("canViewAnalytics"),
  canManageDepartments: hasPermission("canManageDepartments"),
  canAnswerQuestions: hasPermission("canAnswerQuestions"),
  canManageAllDepartments: hasPermission("canManageAllDepartments")
};
function departmentFilter({
  session: session2
}) {
  if (!session2) return false;
  if (permissions.canManageAllDepartments({ session: session2 })) return true;
  if (!session2.data.department?.id) return false;
  return { department: { id: { equals: session2.data.department.id } } };
}

// schema.ts
var lists = {
  Role: (0, import_core8.list)({
    access: {
      operation: {
        query: permissions.canManageUsers,
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
        delete: permissions.canManageUsers
      }
    },
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      canUseAdminUI: (0, import_fields.checkbox)({ defaultValue: true }),
      canManageUsers: (0, import_fields.checkbox)({ defaultValue: false }),
      canManageAssets: (0, import_fields.checkbox)({ defaultValue: true }),
      canApproveAssets: (0, import_fields.checkbox)({ defaultValue: false }),
      canManageBrands: (0, import_fields.checkbox)({ defaultValue: false }),
      canManageContent: (0, import_fields.checkbox)({ defaultValue: true }),
      canPublishContent: (0, import_fields.checkbox)({ defaultValue: false }),
      canViewAnalytics: (0, import_fields.checkbox)({ defaultValue: false }),
      canManageDepartments: (0, import_fields.checkbox)({ defaultValue: false }),
      canAnswerQuestions: (0, import_fields.checkbox)({ defaultValue: false }),
      canManageAllDepartments: (0, import_fields.checkbox)({ defaultValue: false }),
      users: (0, import_fields.relationship)({ ref: "User.role", many: true })
    }
  }),
  Department: (0, import_core8.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      slug: (0, import_fields.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
      description: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
      members: (0, import_fields.relationship)({ ref: "User.department", many: true }),
      brands: (0, import_fields.relationship)({ ref: "Brand.department", many: true })
    }
  }),
  Brand: (0, import_core8.list)({
    access: {
      operation: {
        query: isSignedIn,
        create: permissions.canManageBrands,
        update: permissions.canManageBrands,
        delete: permissions.canManageBrands
      },
      filter: {
        query: departmentFilter
      }
    },
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      slug: (0, import_fields.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
      description: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
      complianceStatus: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Compliant", value: "compliant" },
          { label: "Needs Review", value: "needs_review" },
          { label: "Non-Compliant", value: "non_compliant" }
        ],
        defaultValue: "needs_review"
      }),
      guidelines: document({ formatting: true, links: true }),
      department: (0, import_fields.relationship)({ ref: "Department.brands" }),
      owners: (0, import_fields.relationship)({ ref: "User", many: true }),
      assets: (0, import_fields.relationship)({ ref: "Asset.brand", many: true }),
      content: (0, import_fields.relationship)({ ref: "Content.brand", many: true })
    }
  }),
  User: (0, import_core8.list)({
    access: {
      operation: {
        query: isSignedIn,
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
        delete: permissions.canManageUsers
      },
      filter: {
        query: ({ session: session2 }) => {
          if (!session2) return false;
          if (permissions.canManageAllDepartments({ session: session2 })) return true;
          if (!session2.data.department?.id) return false;
          return {
            OR: [
              { id: { equals: session2.itemId } },
              { department: { id: { equals: session2.data.department.id } } }
            ]
          };
        }
      }
    },
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      role: (0, import_fields.relationship)({ ref: "Role.users" }),
      department: (0, import_fields.relationship)({ ref: "Department.members" })
    },
    ui: {
      listView: {
        initialColumns: ["name", "email", "role", "department"]
      }
    }
  }),
  Tag: (0, import_core8.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      assets: (0, import_fields.relationship)({ ref: "Asset.tags", many: true }),
      content: (0, import_fields.relationship)({ ref: "Content.tags", many: true }),
      questions: (0, import_fields.relationship)({ ref: "Question.tags", many: true })
    }
  }),
  Asset: (0, import_core8.list)({
    access: {
      operation: {
        query: isSignedIn,
        create: permissions.canManageAssets,
        update: permissions.canManageAssets,
        delete: permissions.canManageAssets
      },
      filter: { query: departmentFilter }
    },
    fields: {
      title: (0, import_fields.text)({ validation: { isRequired: true } }),
      description: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
      status: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Uploaded", value: "uploaded" },
          { label: "In Review", value: "in_review" },
          { label: "Approved", value: "approved" },
          { label: "Archived", value: "archived" }
        ],
        defaultValue: "uploaded"
      }),
      image: (0, import_fields.image)({
        storage: {
          async put(key, data) {
            await import_promises.default.writeFile(`public/images/${key}`, data);
          },
          async delete(key) {
            await import_promises.default.unlink(`public/images/${key}`);
          },
          url(key) {
            return `http://localhost:3000/images/${key}`;
          }
        }
      }),
      file: (0, import_fields.file)({
        storage: {
          async put(key, data) {
            await import_promises.default.writeFile(`public/files/${key}`, data);
          },
          async delete(key) {
            await import_promises.default.unlink(`public/files/${key}`);
          },
          url(key) {
            return `http://localhost:3000/files/${key}`;
          }
        }
      }),
      brand: (0, import_fields.relationship)({ ref: "Brand.assets" }),
      department: (0, import_fields.relationship)({ ref: "Department" }),
      uploadedBy: (0, import_fields.relationship)({ ref: "User" }),
      approvedBy: (0, import_fields.relationship)({ ref: "User" }),
      tags: (0, import_fields.relationship)({ ref: "Tag.assets", many: true })
    }
  }),
  Content: (0, import_core8.list)({
    access: {
      operation: {
        query: isSignedIn,
        create: permissions.canManageContent,
        update: permissions.canManageContent,
        delete: permissions.canManageContent
      },
      filter: { query: departmentFilter }
    },
    fields: {
      title: (0, import_fields.text)({ validation: { isRequired: true } }),
      status: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "Draft", value: "draft" },
          { label: "Review", value: "review" },
          { label: "Approved", value: "approved" },
          { label: "Published", value: "published" }
        ],
        defaultValue: "draft"
      }),
      body: document({ formatting: true, links: true, dividers: true }),
      brand: (0, import_fields.relationship)({ ref: "Brand.content" }),
      department: (0, import_fields.relationship)({ ref: "Department" }),
      assets: (0, import_fields.relationship)({ ref: "Asset", many: true }),
      createdBy: (0, import_fields.relationship)({ ref: "User" }),
      reviewers: (0, import_fields.relationship)({ ref: "User", many: true }),
      tags: (0, import_fields.relationship)({ ref: "Tag.content", many: true })
    },
    ui: { listView: { initialColumns: ["title", "status", "brand", "department"] } }
  }),
  AuditLog: (0, import_core8.list)({
    access: {
      operation: {
        query: ({ session: session2 }) => Boolean(session2 && (permissions.canManageUsers({ session: session2 }) || permissions.canViewAnalytics({ session: session2 }))),
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
        delete: permissions.canManageUsers
      }
    },
    fields: {
      action: (0, import_fields.text)({ validation: { isRequired: true } }),
      entityType: (0, import_fields.text)({ validation: { isRequired: true } }),
      entityId: (0, import_fields.text)(),
      timestamp: (0, import_fields.timestamp)({ defaultValue: { kind: "now" } }),
      meta: (0, import_fields.json)(),
      user: (0, import_fields.relationship)({ ref: "User" }),
      department: (0, import_fields.relationship)({ ref: "Department" })
    }
  }),
  AnalyticsEvent: (0, import_core8.list)({
    access: {
      operation: {
        query: permissions.canViewAnalytics,
        create: import_access.allowAll,
        update: permissions.canViewAnalytics,
        delete: permissions.canViewAnalytics
      }
    },
    fields: {
      eventType: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "View", value: "view" },
          { label: "Download", value: "download" },
          { label: "Share", value: "share" },
          { label: "Search", value: "search" }
        ],
        defaultValue: "view"
      }),
      timestamp: (0, import_fields.timestamp)({ defaultValue: { kind: "now" } }),
      user: (0, import_fields.relationship)({ ref: "User" }),
      entityType: (0, import_fields.text)(),
      entityId: (0, import_fields.text)(),
      meta: (0, import_fields.json)(),
      department: (0, import_fields.relationship)({ ref: "Department" })
    }
  }),
  Question: (0, import_core8.list)({
    access: {
      operation: {
        query: isSignedIn,
        create: isSignedIn,
        update: permissions.canAnswerQuestions,
        delete: permissions.canAnswerQuestions
      },
      filter: { query: departmentFilter }
    },
    fields: {
      subject: (0, import_fields.text)({ validation: { isRequired: true } }),
      body: document({ formatting: true, links: true }),
      status: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "New", value: "new" },
          { label: "Triage", value: "triage" },
          { label: "Answered", value: "answered" },
          { label: "Closed", value: "closed" }
        ],
        defaultValue: "new"
      }),
      department: (0, import_fields.relationship)({ ref: "Department" }),
      askedBy: (0, import_fields.relationship)({ ref: "User" }),
      tags: (0, import_fields.relationship)({ ref: "Tag.questions", many: true }),
      answers: (0, import_fields.relationship)({ ref: "Answer.question", many: true })
    }
  }),
  Answer: (0, import_core8.list)({
    access: {
      operation: {
        query: isSignedIn,
        create: permissions.canAnswerQuestions,
        update: permissions.canAnswerQuestions,
        delete: permissions.canAnswerQuestions
      },
      filter: { query: departmentFilter }
    },
    fields: {
      body: document({ formatting: true, links: true }),
      question: (0, import_fields.relationship)({ ref: "Question.answers" }),
      answeredBy: (0, import_fields.relationship)({ ref: "User" }),
      approved: (0, import_fields.checkbox)({ defaultValue: true }),
      department: (0, import_fields.relationship)({ ref: "Department" })
    }
  })
};

// seed-data.ts
async function ensureSuperAdmin(context) {
  const email = "eliasisrael@adobe.com";
  const existing = await context.db.User.findMany({
    where: { email: { equals: email } },
    take: 1
  });
  if (existing.length > 0) return;
  let adminRole = (await context.db.Role.findMany({ where: { name: { equals: "Admin" } }, take: 1 }))[0];
  if (!adminRole) {
    adminRole = await context.db.Role.createOne({
      data: {
        name: "Admin",
        canUseAdminUI: true,
        canManageUsers: true,
        canManageAssets: true,
        canApproveAssets: true,
        canManageBrands: true,
        canManageContent: true,
        canPublishContent: true,
        canViewAnalytics: true,
        canManageDepartments: true,
        canAnswerQuestions: true,
        canManageAllDepartments: true
      }
    });
  }
  await context.db.User.createOne({
    data: {
      name: "Elias Israel",
      email,
      password: "12345678",
      role: { connect: { id: adminRole.id } }
    }
  });
}
async function seedDemoData(context) {
  const existingDepartments = await context.db.Department.count();
  if (existingDepartments > 0) {
    await ensureSuperAdmin(context);
    return;
  }
  const departments = await Promise.all(
    [
      { name: "Marketing", slug: "marketing", description: "Marketing department" },
      { name: "Sales", slug: "sales", description: "Sales department" },
      { name: "Engineering", slug: "engineering", description: "Engineering department" },
      { name: "Legal", slug: "legal", description: "Legal & compliance" }
    ].map(
      (d) => context.db.Department.createOne({ data: d })
    )
  );
  const deptBySlug = Object.fromEntries(departments.map((d) => [d.slug, d]));
  const roles = await Promise.all(
    [
      {
        name: "Admin",
        canUseAdminUI: true,
        canManageUsers: true,
        canManageAssets: true,
        canApproveAssets: true,
        canManageBrands: true,
        canManageContent: true,
        canPublishContent: true,
        canViewAnalytics: true,
        canManageDepartments: true,
        canAnswerQuestions: true,
        canManageAllDepartments: true
      },
      {
        name: "Content Manager",
        canUseAdminUI: true,
        canManageUsers: false,
        canManageAssets: true,
        canApproveAssets: true,
        canManageBrands: true,
        canManageContent: true,
        canPublishContent: true,
        canViewAnalytics: true,
        canManageDepartments: false,
        canAnswerQuestions: true,
        canManageAllDepartments: false
      },
      {
        name: "Creative",
        canUseAdminUI: true,
        canManageUsers: false,
        canManageAssets: true,
        canApproveAssets: false,
        canManageBrands: false,
        canManageContent: true,
        canPublishContent: false,
        canViewAnalytics: false,
        canManageDepartments: false,
        canAnswerQuestions: false,
        canManageAllDepartments: false
      },
      {
        name: "Viewer",
        canUseAdminUI: true,
        canManageUsers: false,
        canManageAssets: false,
        canApproveAssets: false,
        canManageBrands: false,
        canManageContent: false,
        canPublishContent: false,
        canViewAnalytics: false,
        canManageDepartments: false,
        canAnswerQuestions: false,
        canManageAllDepartments: false
      },
      {
        name: "Compliance",
        canUseAdminUI: true,
        canManageUsers: false,
        canManageAssets: false,
        canApproveAssets: true,
        canManageBrands: false,
        canManageContent: false,
        canPublishContent: false,
        canViewAnalytics: true,
        canManageDepartments: false,
        canAnswerQuestions: true,
        canManageAllDepartments: false
      },
      {
        name: "Brand Manager",
        canUseAdminUI: true,
        canManageUsers: false,
        canManageAssets: true,
        canApproveAssets: true,
        canManageBrands: true,
        canManageContent: true,
        canPublishContent: true,
        canViewAnalytics: true,
        canManageDepartments: false,
        canAnswerQuestions: true,
        canManageAllDepartments: false
      },
      {
        name: "Analyst",
        canUseAdminUI: true,
        canManageUsers: false,
        canManageAssets: false,
        canApproveAssets: false,
        canManageBrands: false,
        canManageContent: false,
        canPublishContent: false,
        canViewAnalytics: true,
        canManageDepartments: false,
        canAnswerQuestions: false,
        canManageAllDepartments: false
      }
    ].map((r) => context.db.Role.createOne({ data: r }))
  );
  const roleByName = Object.fromEntries(roles.map((r) => [r.name, r]));
  const users = await Promise.all(
    [
      {
        name: "Alice Admin",
        email: "alice.admin@example.com",
        password: "password",
        role: { connect: { id: roleByName["Admin"].id } },
        department: { connect: { id: deptBySlug["marketing"].id } }
      },
      {
        name: "Elias Israel",
        email: "eliasisrael@adobe.com",
        password: "12345678",
        role: { connect: { id: roleByName["Admin"].id } }
        // optional department; Admin can access all departments regardless
      },
      {
        name: "Cameron Content",
        email: "cameron.content@example.com",
        password: "password",
        role: { connect: { id: roleByName["Content Manager"].id } },
        department: { connect: { id: deptBySlug["marketing"].id } }
      },
      {
        name: "Chris Creative",
        email: "chris.creative@example.com",
        password: "password",
        role: { connect: { id: roleByName["Creative"].id } },
        department: { connect: { id: deptBySlug["marketing"].id } }
      },
      {
        name: "Vera Viewer",
        email: "vera.viewer@example.com",
        password: "password",
        role: { connect: { id: roleByName["Viewer"].id } },
        department: { connect: { id: deptBySlug["sales"].id } }
      },
      {
        name: "Connie Compliance",
        email: "connie.compliance@example.com",
        password: "password",
        role: { connect: { id: roleByName["Compliance"].id } },
        department: { connect: { id: deptBySlug["legal"].id } }
      },
      {
        name: "Brenda Brand",
        email: "brenda.brand@example.com",
        password: "password",
        role: { connect: { id: roleByName["Brand Manager"].id } },
        department: { connect: { id: deptBySlug["marketing"].id } }
      },
      {
        name: "Andy Analyst",
        email: "andy.analyst@example.com",
        password: "password",
        role: { connect: { id: roleByName["Analyst"].id } },
        department: { connect: { id: deptBySlug["engineering"].id } }
      }
    ].map((u) => context.db.User.createOne({ data: u }))
  );
  const userByEmail = Object.fromEntries(users.map((u) => [u.email, u]));
  const brands = await Promise.all(
    [
      {
        name: "Acme Global",
        slug: "acme",
        description: "Enterprise brand guidelines",
        complianceStatus: "needs_review",
        department: { connect: { id: deptBySlug["marketing"].id } }
      },
      {
        name: "Contoso Health",
        slug: "contoso",
        description: "Healthcare brand",
        complianceStatus: "compliant",
        department: { connect: { id: deptBySlug["legal"].id } }
      }
    ].map((b) => context.db.Brand.createOne({ data: b }))
  );
  const brandBySlug = Object.fromEntries(brands.map((b) => [b.slug, b]));
  const tags = await Promise.all(
    ["Urgent", "Brand", "Campaign", "Legal", "Press"].map(
      (name) => context.db.Tag.createOne({ data: { name } })
    )
  );
  const assets = await Promise.all(
    [
      {
        title: "Acme Logo",
        description: "Primary logo in SVG",
        status: "approved",
        brand: { connect: { id: brandBySlug["acme"].id } },
        department: { connect: { id: deptBySlug["marketing"].id } },
        uploadedBy: { connect: { id: userByEmail["chris.creative@example.com"].id } },
        approvedBy: { connect: { id: userByEmail["connie.compliance@example.com"].id } },
        tags: { connect: tags.slice(0, 2).map((t) => ({ id: t.id })) }
      },
      {
        title: "Press Kit 2025",
        description: "Zip with brand press assets",
        status: "in_review",
        brand: { connect: { id: brandBySlug["acme"].id } },
        department: { connect: { id: deptBySlug["marketing"].id } },
        uploadedBy: { connect: { id: userByEmail["cameron.content@example.com"].id } },
        tags: { connect: tags.slice(1, 4).map((t) => ({ id: t.id })) }
      }
    ].map((a) => context.db.Asset.createOne({ data: a }))
  );
  await Promise.all(
    [
      {
        title: "Spring Campaign Brief",
        status: "review",
        brand: { connect: { id: brandBySlug["acme"].id } },
        department: { connect: { id: deptBySlug["marketing"].id } },
        createdBy: { connect: { id: userByEmail["cameron.content@example.com"].id } },
        reviewers: {
          connect: [
            userByEmail["connie.compliance@example.com"],
            userByEmail["brenda.brand@example.com"]
          ].map((u) => ({ id: u.id }))
        },
        tags: { connect: tags.slice(0, 3).map((t) => ({ id: t.id })) }
      },
      {
        title: "Brand Compliance Checklist",
        status: "approved",
        brand: { connect: { id: brandBySlug["contoso"].id } },
        department: { connect: { id: deptBySlug["legal"].id } },
        createdBy: { connect: { id: userByEmail["connie.compliance@example.com"].id } },
        reviewers: {
          connect: [userByEmail["andy.analyst@example.com"]].map((u) => ({ id: u.id }))
        },
        tags: { connect: tags.slice(2, 5).map((t) => ({ id: t.id })) }
      }
    ].map((c) => context.db.Content.createOne({ data: c }))
  );
  const questions = await Promise.all(
    [
      {
        subject: "Can we use the old logo on social? ",
        status: "new",
        department: { connect: { id: deptBySlug["marketing"].id } },
        askedBy: { connect: { id: userByEmail["vera.viewer@example.com"].id } },
        tags: { connect: tags.slice(0, 2).map((t) => ({ id: t.id })) }
      },
      {
        subject: "Press kit approval timeline",
        status: "triage",
        department: { connect: { id: deptBySlug["marketing"].id } },
        askedBy: { connect: { id: userByEmail["cameron.content@example.com"].id } },
        tags: { connect: tags.slice(1, 4).map((t) => ({ id: t.id })) }
      }
    ].map((q) => context.db.Question.createOne({ data: q }))
  );
  await context.db.Answer.createOne({
    data: {
      question: { connect: { id: questions[0].id } },
      answeredBy: { connect: { id: userByEmail["connie.compliance@example.com"].id } },
      approved: true,
      department: { connect: { id: deptBySlug["legal"].id } }
    }
  });
  await Promise.all(
    [
      {
        eventType: "view",
        user: { connect: { id: userByEmail["vera.viewer@example.com"].id } },
        entityType: "Asset",
        entityId: assets[0].id,
        department: { connect: { id: deptBySlug["marketing"].id } }
      },
      {
        eventType: "download",
        user: { connect: { id: userByEmail["cameron.content@example.com"].id } },
        entityType: "Asset",
        entityId: assets[1].id,
        department: { connect: { id: deptBySlug["marketing"].id } }
      }
    ].map((e) => context.db.AnalyticsEvent.createOne({ data: e }))
  );
  await Promise.all(
    [
      {
        action: "ASSET_APPROVED",
        entityType: "Asset",
        entityId: assets[0].id,
        user: { connect: { id: userByEmail["connie.compliance@example.com"].id } },
        department: { connect: { id: deptBySlug["legal"].id } }
      },
      {
        action: "CONTENT_SUBMITTED",
        entityType: "Content",
        user: { connect: { id: userByEmail["cameron.content@example.com"].id } },
        department: { connect: { id: deptBySlug["marketing"].id } }
      }
    ].map((l) => context.db.AuditLog.createOne({ data: l }))
  );
  await ensureSuperAdmin(context);
}

// keystone.ts
var session = (0, import_session.statelessSessions)();
var { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
    itemData: {
      // Create an Admin role on first run so the initial user has access
      role: {
        create: {
          name: "Admin",
          canUseAdminUI: true,
          canManageUsers: true,
          canManageAssets: true,
          canApproveAssets: true,
          canManageBrands: true,
          canManageContent: true,
          canPublishContent: true,
          canViewAnalytics: true,
          canManageDepartments: true,
          canAnswerQuestions: true,
          canManageAllDepartments: true
        }
      }
    }
  },
  sessionData: `
    name
    email
    department { id name }
    role {
      id
      name
      canUseAdminUI
      canManageUsers
      canManageAssets
      canApproveAssets
      canManageBrands
      canManageContent
      canPublishContent
      canViewAnalytics
      canManageDepartments
      canAnswerQuestions
      canManageAllDepartments
    }
  `
});
var keystone_default = withAuth(
  (0, import_core9.config)({
    db: {
      provider: "sqlite",
      url: process.env.DATABASE_URL || "file:./keystone.db",
      // Seed demo data on first run; safe to keep enabled. Use sudo to bypass access checks during seeding.
      onConnect: async (context) => {
        await seedDemoData(context.sudo());
      }
    },
    lists,
    server: {
      maxFileSize: (0, import_bytes.default)("40Mb"),
      extendExpressApp: (app) => {
        app.use(
          "/images",
          import_express.default.static("public/images", { index: false, redirect: false, lastModified: false })
        );
        app.use(
          "/files",
          import_express.default.static("public/files", {
            setHeaders(res) {
              res.setHeader("Content-Type", "application/octet-stream");
            },
            index: false,
            redirect: false,
            lastModified: false
          })
        );
      }
    },
    ui: {
      isAccessAllowed: ({ session: session2 }) => Boolean(session2?.data.role?.canUseAdminUI)
    },
    session
  })
);
//# sourceMappingURL=config.js.map
