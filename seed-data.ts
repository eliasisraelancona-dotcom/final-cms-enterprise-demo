// Seeds rich demo data on first run. Safe to re-run (no duplicate users).
async function ensureSuperAdmin(context: any) {
  const email = 'eliasisrael@adobe.com'
  const existing = await context.db.User.findMany({
    where: { email: { equals: email } },
    take: 1,
  })
  if (existing.length > 0) return

  let adminRole = (
    await context.db.Role.findMany({ where: { name: { equals: 'Administrator' } }, take: 1 })
  )[0]

  if (!adminRole) {
    adminRole = await context.db.Role.createOne({
      data: {
        name: 'Administrator',
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
    })
  }

  await context.db.User.createOne({
    data: {
      name: 'Elias Israel',
      email,
      password: '12345678',
      role: { connect: { id: adminRole.id } },
    },
  })
}

export async function seedDemoData(context: any) {
  // If departments already exist, only ensure the super admin user exists
  const existingDepartments = await context.db.Department.count()
  if (existingDepartments > 0) {
    await ensureSuperAdmin(context)
    return
  }

  // Departments
  const departments = await Promise.all(
    [
      { name: 'Marketing', slug: 'marketing', description: 'Marketing department' },
      { name: 'Sales', slug: 'sales', description: 'Sales department' },
      { name: 'Engineering', slug: 'engineering', description: 'Engineering department' },
      { name: 'Legal', slug: 'legal', description: 'Legal & compliance' },
    ].map((d: { name: string; slug: string; description: string }) =>
      context.db.Department.createOne({ data: d })
    )
  )

  const deptBySlug = Object.fromEntries(departments.map(d => [d.slug!, d]))

  // Roles (7)
  const roles = await Promise.all(
    [
      {
        name: 'Administrator',
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
      {
        name: 'Content Manager',
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
        canManageAllDepartments: false,
      },
      {
        name: 'Creative',
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
        canManageAllDepartments: false,
      },
      {
        name: 'Viewer',
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
        canManageAllDepartments: false,
      },
      {
        name: 'Compliance',
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
        canManageAllDepartments: false,
      },
      {
        name: 'Brand Manager',
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
        canManageAllDepartments: false,
      },
      {
        name: 'Analyst',
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
        canManageAllDepartments: false,
      },
    ].map((r: any) => context.db.Role.createOne({ data: r }))
  )

  const roleByName = Object.fromEntries(roles.map(r => [r.name!, r]))

  // Users
  const users = await Promise.all(
    [
      {
        name: 'Alice Administrator',
        email: 'alice.admin@example.com',
        password: 'password',
        role: { connect: { id: roleByName['Administrator'].id } },
        department: { connect: { id: deptBySlug['marketing'].id } },
      },
      {
        name: 'Elias Israel',
        email: 'eliasisrael@adobe.com',
        password: '12345678',
        role: { connect: { id: roleByName['Administrator'].id } },
        // optional department; Admin can access all departments regardless
      },
      {
        name: 'Cameron Content',
        email: 'cameron.content@example.com',
        password: 'password',
        role: { connect: { id: roleByName['Content Manager'].id } },
        department: { connect: { id: deptBySlug['marketing'].id } },
      },
      {
        name: 'Chris Creative',
        email: 'chris.creative@example.com',
        password: 'password',
        role: { connect: { id: roleByName['Creative'].id } },
        department: { connect: { id: deptBySlug['marketing'].id } },
      },
      {
        name: 'Vera Viewer',
        email: 'vera.viewer@example.com',
        password: 'password',
        role: { connect: { id: roleByName['Viewer'].id } },
        department: { connect: { id: deptBySlug['sales'].id } },
      },
      {
        name: 'Connie Compliance',
        email: 'connie.compliance@example.com',
        password: 'password',
        role: { connect: { id: roleByName['Compliance'].id } },
        department: { connect: { id: deptBySlug['legal'].id } },
      },
      {
        name: 'Brenda Brand',
        email: 'brenda.brand@example.com',
        password: 'password',
        role: { connect: { id: roleByName['Brand Manager'].id } },
        department: { connect: { id: deptBySlug['marketing'].id } },
      },
      {
        name: 'Andy Analyst',
        email: 'andy.analyst@example.com',
        password: 'password',
        role: { connect: { id: roleByName['Analyst'].id } },
        department: { connect: { id: deptBySlug['engineering'].id } },
      },
    ].map((u: any) => context.db.User.createOne({ data: u }))
  )

  const userByEmail = Object.fromEntries(users.map(u => [u.email!, u]))

  // Brands
  const brands = await Promise.all(
    [
      {
        name: 'Acme Global',
        slug: 'acme',
        description: 'Enterprise brand guidelines',
        complianceStatus: 'needs_review',
        department: { connect: { id: deptBySlug['marketing'].id } },
      },
      {
        name: 'Contoso Health',
        slug: 'contoso',
        description: 'Healthcare brand',
        complianceStatus: 'compliant',
        department: { connect: { id: deptBySlug['legal'].id } },
      },
    ].map((b: any) => context.db.Brand.createOne({ data: b }))
  )

  const brandBySlug = Object.fromEntries(brands.map(b => [b.slug!, b]))

  // Tags
  const tags = await Promise.all(
    ['Urgent', 'Brand', 'Campaign', 'Legal', 'Press'].map((name: string) =>
      context.db.Tag.createOne({ data: { name } })
    )
  )

  // Assets
  const assets = await Promise.all(
    [
      {
        title: 'Acme Logo',
        description: 'Primary logo in SVG',
        status: 'approved',
        brand: { connect: { id: brandBySlug['acme'].id } },
        department: { connect: { id: deptBySlug['marketing'].id } },
        uploadedBy: { connect: { id: userByEmail['chris.creative@example.com'].id } },
        approvedBy: { connect: { id: userByEmail['connie.compliance@example.com'].id } },
        tags: { connect: tags.slice(0, 2).map(t => ({ id: t.id })) },
      },
      {
        title: 'Press Kit 2025',
        description: 'Zip with brand press assets',
        status: 'in_review',
        brand: { connect: { id: brandBySlug['acme'].id } },
        department: { connect: { id: deptBySlug['marketing'].id } },
        uploadedBy: { connect: { id: userByEmail['cameron.content@example.com'].id } },
        tags: { connect: tags.slice(1, 4).map(t => ({ id: t.id })) },
      },
    ].map((a: any) => context.db.Asset.createOne({ data: a }))
  )

  // Content
  await Promise.all(
    [
      {
        title: 'Spring Campaign Brief',
        status: 'review',
        brand: { connect: { id: brandBySlug['acme'].id } },
        department: { connect: { id: deptBySlug['marketing'].id } },
        createdBy: { connect: { id: userByEmail['cameron.content@example.com'].id } },
        reviewers: {
          connect: [
            userByEmail['connie.compliance@example.com'],
            userByEmail['brenda.brand@example.com'],
          ].map((u: any) => ({ id: u.id })),
        },
        tags: { connect: tags.slice(0, 3).map((t: any) => ({ id: t.id })) },
      },
      {
        title: 'Brand Compliance Checklist',
        status: 'approved',
        brand: { connect: { id: brandBySlug['contoso'].id } },
        department: { connect: { id: deptBySlug['legal'].id } },
        createdBy: { connect: { id: userByEmail['connie.compliance@example.com'].id } },
        reviewers: {
          connect: [userByEmail['andy.analyst@example.com']].map((u: any) => ({ id: u.id })),
        },
        tags: { connect: tags.slice(2, 5).map((t: any) => ({ id: t.id })) },
      },
    ].map((c: any) => context.db.Content.createOne({ data: c }))
  )

  // Questions & Answers
  const questions = await Promise.all(
    [
      {
        subject: 'Can we use the old logo on social? ',
        status: 'new',
        askedAt: new Date(),
        roadmapType: 'fyi',
        department: { connect: { id: deptBySlug['marketing'].id } },
        askedBy: { connect: { id: userByEmail['vera.viewer@example.com'].id } },
        tags: { connect: tags.slice(0, 2).map(t => ({ id: t.id })) },
      },
      {
        subject: 'Press kit approval timeline',
        status: 'triage',
        askedAt: new Date(),
        roadmapType: 'blocker',
        department: { connect: { id: deptBySlug['marketing'].id } },
        askedBy: { connect: { id: userByEmail['cameron.content@example.com'].id } },
        tags: { connect: tags.slice(1, 4).map(t => ({ id: t.id })) },
      },
      // --- Adobe FAQ (seeded) ---
      {
        subject: 'How does Cursor safeguard Adobe’s source code and sensitive IP?',
        status: 'answered',
        askedAt: new Date(),
        roadmapType: 'fyi',
        department: { connect: { id: deptBySlug['engineering'].id } },
        askedBy: { connect: { id: userByEmail['eliasisrael@adobe.com'].id } },
        tags: { connect: tags.filter(t => ['Legal'].includes(t.name!)).map(t => ({ id: t.id })) },
        body: [
          {
            type: 'paragraph',
            children: [
              {
                text:
                  'Cursor follows industry-standard practices for data security and privacy and operates with enterprise-grade controls. Adobe teams can enable Privacy Mode to prevent code and project files from being uploaded; editing and AI assistance then occur locally.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                text:
                  'For sensitive environments, Privacy Mode further reduces data surface area while preserving helpful tooling.',
              },
            ],
          },
        ],
      },
      {
        subject: 'How does Cursor understand our codebase?',
        status: 'answered',
        askedAt: new Date(),
        roadmapType: 'fyi',
        department: { connect: { id: deptBySlug['engineering'].id } },
        askedBy: { connect: { id: userByEmail['eliasisrael@adobe.com'].id } },
        body: [
          {
            type: 'paragraph',
            children: [
              {
                text:
                  'Cursor ingests your workspace (code and docs) to build an internal representation. This context allows it to reference surrounding files and project structure when proposing edits and answers.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                text:
                  'Metaphor: imagine your repository as a large library. Cursor does not read or store every book each time. Instead, it maintains smart index cards summarizing chapters and where to find them. When you ask a question, it uses those cards to locate only the relevant chapters before reading them.',
              },
            ],
          },
        ],
      },
      {
        subject: 'Can you explain Privacy Mode guarantees?',
        status: 'answered',
        askedAt: new Date(),
        roadmapType: 'fyi',
        department: { connect: { id: deptBySlug['legal'].id } },
        askedBy: { connect: { id: userByEmail['eliasisrael@adobe.com'].id } },
        tags: { connect: tags.filter(t => ['Legal'].includes(t.name!)).map(t => ({ id: t.id })) },
        body: [
          { type: 'paragraph', children: [{ text: 'Key guarantees:' }] },
          {
            type: 'paragraph',
            children: [
              { text: '• No training on your code. ' },
              { text: '• No storage of code content. ' },
              { text: '• No logging of code content. ' },
              {
                text:
                  '• Requests are handled by isolated privacy services (including background jobs and queues).',
              },
            ],
          },
          { type: 'paragraph', children: [{ text: 'Enforcement:' }] },
          {
            type: 'paragraph',
            children: [
              {
                text:
                  '• For team plans, Privacy Mode is enforced by default. Client and server both apply safeguards with conservative fallbacks.',
              },
            ],
          },
          { type: 'paragraph', children: [{ text: 'How it works (at a glance):' }] },
          {
            type: 'paragraph',
            children: [
              {
                text:
                  '• Requests include a privacy flag; they are routed to dedicated privacy-safe services that do not log, store, or retain prompts/completions. If the flag is missing, the system assumes privacy mode to be safe.',
              },
            ],
          },
        ],
      },
      {
        subject: 'What is your client security model?',
        status: 'answered',
        askedAt: new Date(),
        roadmapType: 'fyi',
        department: { connect: { id: deptBySlug['engineering'].id } },
        askedBy: { connect: { id: userByEmail['eliasisrael@adobe.com'].id } },
        body: [
          {
            type: 'paragraph',
            children: [
              {
                text:
                  'Cursor is a fork of VS Code. High-severity upstream security fixes are cherry-picked promptly between merges.',
              },
            ],
          },
        ],
      },
      {
        subject: 'How can we customize Cursor’s behavior?',
        status: 'answered',
        askedAt: new Date(),
        roadmapType: 'fyi',
        department: { connect: { id: deptBySlug['engineering'].id } },
        askedBy: { connect: { id: userByEmail['eliasisrael@adobe.com'].id } },
        body: [
          {
            type: 'paragraph',
            children: [
              {
                text:
                  'Cursor supports Rules — persistent, system-level instructions that guide style, linting, workflows, and team conventions. Rules can be applied per user and per repository.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                text:
                  'There are User rules (global to your projects) and Project rules (checked into a repo-specific folder) so teams can enforce standards automatically.',
              },
            ],
          },
        ],
      },
      {
        subject: 'How do we deploy and manage Cursor across Adobe’s teams?',
        status: 'answered',
        askedAt: new Date(),
        roadmapType: 'fyi',
        department: { connect: { id: deptBySlug['engineering'].id } },
        askedBy: { connect: { id: userByEmail['eliasisrael@adobe.com'].id } },
        body: [
          {
            type: 'paragraph',
            children: [
              {
                text:
                  'Cursor Enterprise offers admin controls for rollout, access permissions, SSO/IdP integration, and shared rules. Teams can centrally define rules and context integrations across repositories from day one.',
              },
            ],
          },
        ],
      },
      {
        subject: 'How does Cursor work with Security and Privacy overall?',
        status: 'answered',
        askedAt: new Date(),
        roadmapType: 'fyi',
        department: { connect: { id: deptBySlug['legal'].id } },
        askedBy: { connect: { id: userByEmail['eliasisrael@adobe.com'].id } },
        tags: { connect: tags.filter(t => ['Legal'].includes(t.name!)).map(t => ({ id: t.id })) },
        body: [
          {
            type: 'paragraph',
            children: [
              { text: '• Your code is never used to train our models.' },
            ],
          },
          {
            type: 'paragraph',
            children: [
              { text: '• Requests are processed securely; code is not sent to public LLMs.' },
            ],
          },
          {
            type: 'paragraph',
            children: [
              { text: '• .cursorignore is respected; only explicitly allowed paths are indexed.' },
            ],
          },
          {
            type: 'paragraph',
            children: [
              { text: '• Infrastructure is built for auditability, data control, and compliance alignment.' },
            ],
          },
          {
            type: 'paragraph',
            children: [
              { text: 'We can schedule a session with the security team to review architecture and policies in detail.' },
            ],
          },
        ],
      },
      {
        subject: 'How will the TAM help us?',
        status: 'answered',
        askedAt: new Date(),
        roadmapType: 'fyi',
        department: { connect: { id: deptBySlug['engineering'].id } },
        askedBy: { connect: { id: userByEmail['eliasisrael@adobe.com'].id } },
        body: [
          {
            type: 'paragraph',
            children: [
              { text: 'Dedicated enablement and support to unblock your team quickly.' },
            ],
          },
          {
            type: 'paragraph',
            children: [
              { text: 'Direct line to product for feedback, roadmap input, and escalations.' },
            ],
          },
          {
            type: 'paragraph',
            children: [
              { text: 'Security and privacy guidance tailored for enterprise workflows.' },
            ],
          },
        ],
      },
      {
        subject: 'What is the difference between Copilot / Codeium (Windsurf) and Cursor?',
        status: 'answered',
        askedAt: new Date(),
        roadmapType: 'fyi',
        department: { connect: { id: deptBySlug['engineering'].id } },
        askedBy: { connect: { id: userByEmail['eliasisrael@adobe.com'].id } },
        body: [
          {
            type: 'paragraph',
            children: [
              {
                text:
                  'Copilot excels at inline suggestions but is weaker on repository-wide context and edit flows. Codeium/Windsurf is fast but lacks full IDE integration, limiting deep repository understanding.',
              },
            ],
          },
          {
            type: 'paragraph',
            children: [
              {
                text:
                  'Cursor focuses on end-to-end developer UX inside the IDE, combining context awareness with powerful edit workflows to boost productivity. The community continues to grow with events and shared practices.',
              },
            ],
          },
        ],
      },
    ].map((q: any) => context.db.Question.createOne({ data: q }))
  )

  // Answers removed from schema; skip creating answers

  // Analytics Events
  await Promise.all(
    [
      {
        eventType: 'view',
        user: { connect: { id: userByEmail['vera.viewer@example.com'].id } },
        entityType: 'Asset',
        entityId: assets[0].id,
        department: { connect: { id: deptBySlug['marketing'].id } },
      },
      {
        eventType: 'download',
        user: { connect: { id: userByEmail['cameron.content@example.com'].id } },
        entityType: 'Asset',
        entityId: assets[1].id,
        department: { connect: { id: deptBySlug['marketing'].id } },
      },
    ].map((e: any) => context.db.AnalyticsEvent.createOne({ data: e }))
  )

  // Audit logs
  await Promise.all(
    [
      {
        action: 'ASSET_APPROVED',
        entityType: 'Asset',
        entityId: assets[0].id,
        user: { connect: { id: userByEmail['connie.compliance@example.com'].id } },
        department: { connect: { id: deptBySlug['legal'].id } },
      },
      {
        action: 'CONTENT_SUBMITTED',
        entityType: 'Content',
        user: { connect: { id: userByEmail['cameron.content@example.com'].id } },
        department: { connect: { id: deptBySlug['marketing'].id } },
      },
    ].map((l: any) => context.db.AuditLog.createOne({ data: l }))
  )

  // Ensure requested super admin user exists (in case user list was changed)
  await ensureSuperAdmin(context)
}

