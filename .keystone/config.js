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
var import_core2 = require("@keystone-6/core");
var import_session = require("@keystone-6/core/session");
var import_auth = require("@keystone-6/auth");
var import_bytes = __toESM(require("bytes"));

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");

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
  Role: (0, import_core.list)({
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
  Department: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      slug: (0, import_fields.text)({ validation: { isRequired: true }, isIndexed: "unique" }),
      description: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
      members: (0, import_fields.relationship)({ ref: "User.department", many: true }),
      brands: (0, import_fields.relationship)({ ref: "Brand.department", many: true })
    }
  }),
  Brand: (0, import_core.list)({
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
      guidelines: (0, import_fields_document.document)({ formatting: true, links: true }),
      department: (0, import_fields.relationship)({ ref: "Department.brands" }),
      owners: (0, import_fields.relationship)({ ref: "User", many: true }),
      assets: (0, import_fields.relationship)({ ref: "Asset.brand", many: true }),
      content: (0, import_fields.relationship)({ ref: "Content.brand", many: true })
    }
  }),
  User: (0, import_core.list)({
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
  Tag: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      assets: (0, import_fields.relationship)({ ref: "Asset.tags", many: true }),
      content: (0, import_fields.relationship)({ ref: "Content.tags", many: true }),
      questions: (0, import_fields.relationship)({ ref: "Question.tags", many: true })
    }
  }),
  Asset: (0, import_core.list)({
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
      image: (0, import_fields.image)({ storage: "images" }),
      file: (0, import_fields.file)({ storage: "files" }),
      brand: (0, import_fields.relationship)({ ref: "Brand.assets" }),
      department: (0, import_fields.relationship)({ ref: "Department" }),
      uploadedBy: (0, import_fields.relationship)({ ref: "User" }),
      approvedBy: (0, import_fields.relationship)({ ref: "User" }),
      tags: (0, import_fields.relationship)({ ref: "Tag.assets", many: true })
    }
  }),
  Content: (0, import_core.list)({
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
      body: (0, import_fields_document.document)({ formatting: true, links: true, dividers: true }),
      brand: (0, import_fields.relationship)({ ref: "Brand.content" }),
      department: (0, import_fields.relationship)({ ref: "Department" }),
      assets: (0, import_fields.relationship)({ ref: "Asset", many: true }),
      createdBy: (0, import_fields.relationship)({ ref: "User" }),
      reviewers: (0, import_fields.relationship)({ ref: "User", many: true }),
      tags: (0, import_fields.relationship)({ ref: "Tag.content", many: true })
    },
    ui: { listView: { initialColumns: ["title", "status", "brand", "department"] } }
  }),
  AuditLog: (0, import_core.list)({
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
  AnalyticsEvent: (0, import_core.list)({
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
  Question: (0, import_core.list)({
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
      body: (0, import_fields_document.document)({ formatting: true, links: true }),
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
      // When was the question asked (set at create time via hook to avoid SQLite default limitation)
      askedAt: (0, import_fields.timestamp)(),
      // Roadmap classification: none | blocker | fyi
      roadmapType: (0, import_fields.select)({
        type: "enum",
        options: [
          { label: "None", value: "none" },
          { label: "Blocker", value: "blocker" },
          { label: "FYI", value: "fyi" }
        ],
        defaultValue: "none"
      }),
      department: (0, import_fields.relationship)({ ref: "Department" }),
      askedBy: (0, import_fields.relationship)({ ref: "User" }),
      tags: (0, import_fields.relationship)({ ref: "Tag.questions", many: true })
    },
    ui: {
      listView: {
        initialColumns: ["subject", "status", "askedAt", "roadmapType"]
      },
      labelField: "subject"
    },
    hooks: {
      resolveInput: async ({ operation, resolvedData }) => {
        const data = resolvedData;
        if (operation === "create" && !data.askedAt) {
          data.askedAt = /* @__PURE__ */ new Date();
        }
        return data;
      }
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
        askedAt: /* @__PURE__ */ new Date(),
        roadmapType: "fyi",
        department: { connect: { id: deptBySlug["marketing"].id } },
        askedBy: { connect: { id: userByEmail["vera.viewer@example.com"].id } },
        tags: { connect: tags.slice(0, 2).map((t) => ({ id: t.id })) }
      },
      {
        subject: "Press kit approval timeline",
        status: "triage",
        askedAt: /* @__PURE__ */ new Date(),
        roadmapType: "blocker",
        department: { connect: { id: deptBySlug["marketing"].id } },
        askedBy: { connect: { id: userByEmail["cameron.content@example.com"].id } },
        tags: { connect: tags.slice(1, 4).map((t) => ({ id: t.id })) }
      },
      // --- Adobe FAQ (seeded) ---
      {
        subject: "How does Cursor safeguard Adobe\u2019s source code and sensitive IP?",
        status: "answered",
        askedAt: /* @__PURE__ */ new Date(),
        roadmapType: "fyi",
        department: { connect: { id: deptBySlug["engineering"].id } },
        askedBy: { connect: { id: userByEmail["eliasisrael@adobe.com"].id } },
        tags: { connect: tags.filter((t) => ["Legal"].includes(t.name)).map((t) => ({ id: t.id })) },
        body: [
          {
            type: "paragraph",
            children: [
              {
                text: "Cursor follows industry-standard practices for data security and privacy and operates with enterprise-grade controls. Adobe teams can enable Privacy Mode to prevent code and project files from being uploaded; editing and AI assistance then occur locally."
              }
            ]
          },
          {
            type: "paragraph",
            children: [
              {
                text: "For sensitive environments, Privacy Mode further reduces data surface area while preserving helpful tooling."
              }
            ]
          }
        ]
      },
      {
        subject: "How does Cursor understand our codebase?",
        status: "answered",
        askedAt: /* @__PURE__ */ new Date(),
        roadmapType: "fyi",
        department: { connect: { id: deptBySlug["engineering"].id } },
        askedBy: { connect: { id: userByEmail["eliasisrael@adobe.com"].id } },
        body: [
          {
            type: "paragraph",
            children: [
              {
                text: "Cursor ingests your workspace (code and docs) to build an internal representation. This context allows it to reference surrounding files and project structure when proposing edits and answers."
              }
            ]
          },
          {
            type: "paragraph",
            children: [
              {
                text: "Metaphor: imagine your repository as a large library. Cursor does not read or store every book each time. Instead, it maintains smart index cards summarizing chapters and where to find them. When you ask a question, it uses those cards to locate only the relevant chapters before reading them."
              }
            ]
          }
        ]
      },
      {
        subject: "Can you explain Privacy Mode guarantees?",
        status: "answered",
        askedAt: /* @__PURE__ */ new Date(),
        roadmapType: "fyi",
        department: { connect: { id: deptBySlug["legal"].id } },
        askedBy: { connect: { id: userByEmail["eliasisrael@adobe.com"].id } },
        tags: { connect: tags.filter((t) => ["Legal"].includes(t.name)).map((t) => ({ id: t.id })) },
        body: [
          { type: "paragraph", children: [{ text: "Key guarantees:" }] },
          {
            type: "paragraph",
            children: [
              { text: "\u2022 No training on your code. " },
              { text: "\u2022 No storage of code content. " },
              { text: "\u2022 No logging of code content. " },
              {
                text: "\u2022 Requests are handled by isolated privacy services (including background jobs and queues)."
              }
            ]
          },
          { type: "paragraph", children: [{ text: "Enforcement:" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "\u2022 For team plans, Privacy Mode is enforced by default. Client and server both apply safeguards with conservative fallbacks."
              }
            ]
          },
          { type: "paragraph", children: [{ text: "How it works (at a glance):" }] },
          {
            type: "paragraph",
            children: [
              {
                text: "\u2022 Requests include a privacy flag; they are routed to dedicated privacy-safe services that do not log, store, or retain prompts/completions. If the flag is missing, the system assumes privacy mode to be safe."
              }
            ]
          }
        ]
      },
      {
        subject: "What is your client security model?",
        status: "answered",
        askedAt: /* @__PURE__ */ new Date(),
        roadmapType: "fyi",
        department: { connect: { id: deptBySlug["engineering"].id } },
        askedBy: { connect: { id: userByEmail["eliasisrael@adobe.com"].id } },
        body: [
          {
            type: "paragraph",
            children: [
              {
                text: "Cursor is a fork of VS Code. High-severity upstream security fixes are cherry-picked promptly between merges."
              }
            ]
          }
        ]
      },
      {
        subject: "How can we customize Cursor\u2019s behavior?",
        status: "answered",
        askedAt: /* @__PURE__ */ new Date(),
        roadmapType: "fyi",
        department: { connect: { id: deptBySlug["engineering"].id } },
        askedBy: { connect: { id: userByEmail["eliasisrael@adobe.com"].id } },
        body: [
          {
            type: "paragraph",
            children: [
              {
                text: "Cursor supports Rules \u2014 persistent, system-level instructions that guide style, linting, workflows, and team conventions. Rules can be applied per user and per repository."
              }
            ]
          },
          {
            type: "paragraph",
            children: [
              {
                text: "There are User rules (global to your projects) and Project rules (checked into a repo-specific folder) so teams can enforce standards automatically."
              }
            ]
          }
        ]
      },
      {
        subject: "How do we deploy and manage Cursor across Adobe\u2019s teams?",
        status: "answered",
        askedAt: /* @__PURE__ */ new Date(),
        roadmapType: "fyi",
        department: { connect: { id: deptBySlug["engineering"].id } },
        askedBy: { connect: { id: userByEmail["eliasisrael@adobe.com"].id } },
        body: [
          {
            type: "paragraph",
            children: [
              {
                text: "Cursor Enterprise offers admin controls for rollout, access permissions, SSO/IdP integration, and shared rules. Teams can centrally define rules and context integrations across repositories from day one."
              }
            ]
          }
        ]
      },
      {
        subject: "How does Cursor work with Security and Privacy overall?",
        status: "answered",
        askedAt: /* @__PURE__ */ new Date(),
        roadmapType: "fyi",
        department: { connect: { id: deptBySlug["legal"].id } },
        askedBy: { connect: { id: userByEmail["eliasisrael@adobe.com"].id } },
        tags: { connect: tags.filter((t) => ["Legal"].includes(t.name)).map((t) => ({ id: t.id })) },
        body: [
          {
            type: "paragraph",
            children: [
              { text: "\u2022 Your code is never used to train our models." }
            ]
          },
          {
            type: "paragraph",
            children: [
              { text: "\u2022 Requests are processed securely; code is not sent to public LLMs." }
            ]
          },
          {
            type: "paragraph",
            children: [
              { text: "\u2022 .cursorignore is respected; only explicitly allowed paths are indexed." }
            ]
          },
          {
            type: "paragraph",
            children: [
              { text: "\u2022 Infrastructure is built for auditability, data control, and compliance alignment." }
            ]
          },
          {
            type: "paragraph",
            children: [
              { text: "We can schedule a session with the security team to review architecture and policies in detail." }
            ]
          }
        ]
      },
      {
        subject: "How will the TAM help us?",
        status: "answered",
        askedAt: /* @__PURE__ */ new Date(),
        roadmapType: "fyi",
        department: { connect: { id: deptBySlug["engineering"].id } },
        askedBy: { connect: { id: userByEmail["eliasisrael@adobe.com"].id } },
        body: [
          {
            type: "paragraph",
            children: [
              { text: "Dedicated enablement and support to unblock your team quickly." }
            ]
          },
          {
            type: "paragraph",
            children: [
              { text: "Direct line to product for feedback, roadmap input, and escalations." }
            ]
          },
          {
            type: "paragraph",
            children: [
              { text: "Security and privacy guidance tailored for enterprise workflows." }
            ]
          }
        ]
      },
      {
        subject: "What is the difference between Copilot / Codeium (Windsurf) and Cursor?",
        status: "answered",
        askedAt: /* @__PURE__ */ new Date(),
        roadmapType: "fyi",
        department: { connect: { id: deptBySlug["engineering"].id } },
        askedBy: { connect: { id: userByEmail["eliasisrael@adobe.com"].id } },
        body: [
          {
            type: "paragraph",
            children: [
              {
                text: "Copilot excels at inline suggestions but is weaker on repository-wide context and edit flows. Codeium/Windsurf is fast but lacks full IDE integration, limiting deep repository understanding."
              }
            ]
          },
          {
            type: "paragraph",
            children: [
              {
                text: "Cursor focuses on end-to-end developer UX inside the IDE, combining context awareness with powerful edit workflows to boost productivity. The community continues to grow with events and shared practices."
              }
            ]
          }
        ]
      }
    ].map((q) => context.db.Question.createOne({ data: q }))
  );
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
var { withAuth } = (0, import_auth.createAuth)({
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
  (0, import_core2.config)({
    db: {
      provider: "sqlite",
      url: process.env.DATABASE_URL || "file:./keystone.db",
      // Seed demo data on first run; safe to keep enabled. Use sudo to bypass access checks during seeding.
      onConnect: async (context) => {
        await seedDemoData(context.sudo());
      }
    },
    lists,
    storage: {
      images: {
        kind: "local",
        type: "image",
        storagePath: "public/images",
        serverRoute: {
          path: "/images"
        },
        generateUrl: (path) => `/images${path}`
      },
      files: {
        kind: "local",
        type: "file",
        storagePath: "public/files",
        serverRoute: {
          path: "/files"
        },
        generateUrl: (path) => `/files${path}`
      }
    },
    server: {
      maxFileSize: (0, import_bytes.default)("40Mb")
      // Keystone will serve local storage at serverRoute paths; no manual static routes required
    },
    ui: {
      isAccessAllowed: ({ session: session2 }) => Boolean(session2?.data.role?.canUseAdminUI)
    },
    session
  })
);
//# sourceMappingURL=config.js.map
