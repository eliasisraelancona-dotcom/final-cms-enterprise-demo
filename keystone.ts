import { config } from '@keystone-6/core'
import { statelessSessions } from '@keystone-6/core/session'
import { createAuth } from '@keystone-6/auth'
import bytes from 'bytes'
import express from 'express'

import { lists } from './schema'
import { seedDemoData } from './seed-data'

const session = statelessSessions()

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    itemData: {
      // Create an Admin role on first run so the initial user has access
      role: {
        create: {
          name: 'Admin',
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
          canManageAllDepartments: true,
        },
      },
    },
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
  `,
})

export default withAuth(
  config({
    db: {
      provider: 'sqlite',
      url: process.env.DATABASE_URL || 'file:./keystone.db',
      // Seed demo data on first run; safe to keep enabled. Use sudo to bypass access checks during seeding.
      onConnect: async (context: any) => {
        await seedDemoData(context.sudo())
      },
    },
    lists,
    server: {
      maxFileSize: bytes('40Mb')!,
      extendExpressApp: app => {
        app.use(
          '/images',
          express.static('public/images', { index: false, redirect: false, lastModified: false })
        )
        app.use(
          '/files',
          express.static('public/files', {
            setHeaders(res) {
              res.setHeader('Content-Type', 'application/octet-stream')
            },
            index: false,
            redirect: false,
            lastModified: false,
          })
        )
      },
    },
    ui: {
      isAccessAllowed: ({ session }) => Boolean(session?.data.role?.canUseAdminUI),
    },
    session,
  })
)

