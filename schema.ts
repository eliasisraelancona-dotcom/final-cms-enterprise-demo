import { list } from '@keystone-6/core'
import { allowAll } from '@keystone-6/core/access'
import {
  checkbox,
  json,
  password,
  relationship,
  select,
  text,
  timestamp,
  image,
  file,
} from '@keystone-6/core/fields'
import { document } from '@keystone-6/fields-document'

import type { Lists } from '.keystone/types'
import { isSignedIn, permissions, departmentFilter } from './access'

export const lists = {
  Role: list({
    access: {
      operation: {
        query: permissions.canManageUsers,
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
        delete: permissions.canManageUsers,
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      canUseAdminUI: checkbox({ defaultValue: true }),
      canManageUsers: checkbox({ defaultValue: false }),
      canManageAssets: checkbox({ defaultValue: true }),
      canApproveAssets: checkbox({ defaultValue: false }),
      canManageBrands: checkbox({ defaultValue: false }),
      canManageContent: checkbox({ defaultValue: true }),
      canPublishContent: checkbox({ defaultValue: false }),
      canViewAnalytics: checkbox({ defaultValue: false }),
      canManageDepartments: checkbox({ defaultValue: false }),
      canAnswerQuestions: checkbox({ defaultValue: false }),
      canManageAllDepartments: checkbox({ defaultValue: false }),
      users: relationship({ ref: 'User.role', many: true }),
    },
  }),

  Department: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      slug: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
      description: text({ ui: { displayMode: 'textarea' } }),
      members: relationship({ ref: 'User.department', many: true }),
      brands: relationship({ ref: 'Brand.department', many: true }),
    },
  }),

  Brand: list({
    access: {
      operation: {
        query: isSignedIn,
        create: permissions.canManageBrands,
        update: permissions.canManageBrands,
        delete: permissions.canManageBrands,
      },
      filter: {
        query: departmentFilter,
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      slug: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
      description: text({ ui: { displayMode: 'textarea' } }),
      complianceStatus: select({
        type: 'enum',
        options: [
          { label: 'Compliant', value: 'compliant' },
          { label: 'Needs Review', value: 'needs_review' },
          { label: 'Non-Compliant', value: 'non_compliant' },
        ],
        defaultValue: 'needs_review',
      }),
      guidelines: document({ formatting: true, links: true }),
      department: relationship({ ref: 'Department.brands' }),
      owners: relationship({ ref: 'User', many: true }),
      assets: relationship({ ref: 'Asset.brand', many: true }),
      content: relationship({ ref: 'Content.brand', many: true }),
    },
  }),

  User: list({
    access: {
      operation: {
        query: isSignedIn,
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
        delete: permissions.canManageUsers,
      },
      filter: {
        query: ({ session }) => {
          if (!session) return false
          if (permissions.canManageAllDepartments({ session })) return true
          if (!session.data.department?.id) return false
          return {
            OR: [
              { id: { equals: session.itemId } },
              { department: { id: { equals: session.data.department.id } } },
            ],
          }
        },
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
      password: password({ validation: { isRequired: true } }),
      role: relationship({ ref: 'Role.users' }),
      department: relationship({ ref: 'Department.members' }),
    },
    ui: {
      listView: {
        initialColumns: ['name', 'email', 'role', 'department'],
      },
    },
  }),

  Tag: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      assets: relationship({ ref: 'Asset.tags', many: true }),
      content: relationship({ ref: 'Content.tags', many: true }),
      questions: relationship({ ref: 'Question.tags', many: true }),
    },
  }),

  Asset: list({
    access: {
      operation: {
        query: isSignedIn,
        create: permissions.canManageAssets,
        update: permissions.canManageAssets,
        delete: permissions.canManageAssets,
      },
      filter: { query: departmentFilter },
    },
    fields: {
      title: text({ validation: { isRequired: true } }),
      description: text({ ui: { displayMode: 'textarea' } }),
      status: select({
        type: 'enum',
        options: [
          { label: 'Uploaded', value: 'uploaded' },
          { label: 'In Review', value: 'in_review' },
          { label: 'Approved', value: 'approved' },
          { label: 'Archived', value: 'archived' },
        ],
        defaultValue: 'uploaded',
      }),
      image: image({ storage: 'images' }),
      file: file({ storage: 'files' }),
      brand: relationship({ ref: 'Brand.assets' }),
      department: relationship({ ref: 'Department' }),
      uploadedBy: relationship({ ref: 'User' }),
      approvedBy: relationship({ ref: 'User' }),
      tags: relationship({ ref: 'Tag.assets', many: true }),
    },
  }),

  Content: list({
    access: {
      operation: {
        query: isSignedIn,
        create: permissions.canManageContent,
        update: permissions.canManageContent,
        delete: permissions.canManageContent,
      },
      filter: { query: departmentFilter },
    },
    fields: {
      title: text({ validation: { isRequired: true } }),
      status: select({
        type: 'enum',
        options: [
          { label: 'Draft', value: 'draft' },
          { label: 'Review', value: 'review' },
          { label: 'Approved', value: 'approved' },
          { label: 'Published', value: 'published' },
        ],
        defaultValue: 'draft',
      }),
      body: document({ formatting: true, links: true, dividers: true }),
      brand: relationship({ ref: 'Brand.content' }),
      department: relationship({ ref: 'Department' }),
      assets: relationship({ ref: 'Asset', many: true }),
      createdBy: relationship({ ref: 'User' }),
      reviewers: relationship({ ref: 'User', many: true }),
      tags: relationship({ ref: 'Tag.content', many: true }),
    },
    ui: { listView: { initialColumns: ['title', 'status', 'brand', 'department'] } },
  }),

  AuditLog: list({
    access: {
      operation: {
        query: ({ session }) =>
          Boolean(session && (permissions.canManageUsers({ session }) || permissions.canViewAnalytics({ session }))),
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
        delete: permissions.canManageUsers,
      },
    },
    fields: {
      action: text({ validation: { isRequired: true } }),
      entityType: text({ validation: { isRequired: true } }),
      entityId: text(),
      timestamp: timestamp({ defaultValue: { kind: 'now' } }),
      meta: json(),
      user: relationship({ ref: 'User' }),
      department: relationship({ ref: 'Department' }),
    },
  }),

  AnalyticsEvent: list({
    access: {
      operation: {
        query: permissions.canViewAnalytics,
        create: allowAll,
        update: permissions.canViewAnalytics,
        delete: permissions.canViewAnalytics,
      },
    },
    fields: {
      eventType: select({
        type: 'enum',
        options: [
          { label: 'View', value: 'view' },
          { label: 'Download', value: 'download' },
          { label: 'Share', value: 'share' },
          { label: 'Search', value: 'search' },
        ],
        defaultValue: 'view',
      }),
      timestamp: timestamp({ defaultValue: { kind: 'now' } }),
      user: relationship({ ref: 'User' }),
      entityType: text(),
      entityId: text(),
      meta: json(),
      department: relationship({ ref: 'Department' }),
    },
  }),

  Question: list({
    access: {
      operation: {
        query: isSignedIn,
        create: isSignedIn,
        update: permissions.canAnswerQuestions,
        delete: permissions.canAnswerQuestions,
      },
      filter: { query: departmentFilter },
    },
    fields: {
      subject: text({ validation: { isRequired: true } }),
      body: document({ formatting: true, links: true }),
      status: select({
        type: 'enum',
        options: [
          { label: 'New', value: 'new' },
          { label: 'Triage', value: 'triage' },
          { label: 'Answered', value: 'answered' },
          { label: 'Closed', value: 'closed' },
        ],
        defaultValue: 'new',
      }),
      // When was the question asked (set at create time via hook to avoid SQLite default limitation)
      askedAt: timestamp(),
      // The `roadmapType` field is an enum select field for the Question list.
      // It lets users categorize a question's relevance to the product roadmap.
      // Options:
      //   - None: Not related to the roadmap.
      //   - Blocker: This question highlights a blocking issue.
      //   - FYI: For informational purposes only.
      //   - In Progress: The issue is being worked on.
      // The default value is 'none'.
      roadmapType: select({
        type: 'enum',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Blocker', value: 'blocker' },
          { label: 'FYI', value: 'fyi' },
          { label: 'In Progress', value: 'in_progress' },
        ],
        defaultValue: 'none',
      }),
      department: relationship({ ref: 'Department' }),
      askedBy: relationship({ ref: 'User' }),
      tags: relationship({ ref: 'Tag.questions', many: true }),
    },
    ui: {
      listView: {
        initialColumns: ['subject', 'status', 'askedAt', 'roadmapType'],
      },
      labelField: 'subject',
    },
    hooks: {
      resolveInput: async ({ operation, resolvedData }) => {
        const data = resolvedData as any
        if (operation === 'create' && !data.askedAt) {
          data.askedAt = new Date()
        }
        return data
      },
    },
  }),
} satisfies Lists

