// Seeds rich demo data on first run. Safe to re-run (no duplicate users).
async function ensureSuperAdmin(context: any) {
  const email = 'eliasisrael@adobe.com'
  const existing = await context.db.User.findMany({
    where: { email: { equals: email } },
    take: 1,
  })
  if (existing.length > 0) return

  let adminRole = (
    await context.db.Role.findMany({ where: { name: { equals: 'Admin' } }, take: 1 })
  )[0]

  if (!adminRole) {
    adminRole = await context.db.Role.createOne({
      data: {
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
        name: 'Alice Admin',
        email: 'alice.admin@example.com',
        password: 'password',
        role: { connect: { id: roleByName['Admin'].id } },
        department: { connect: { id: deptBySlug['marketing'].id } },
      },
      {
        name: 'Elias Israel',
        email: 'eliasisrael@adobe.com',
        password: '12345678',
        role: { connect: { id: roleByName['Admin'].id } },
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
        department: { connect: { id: deptBySlug['marketing'].id } },
        askedBy: { connect: { id: userByEmail['vera.viewer@example.com'].id } },
        tags: { connect: tags.slice(0, 2).map(t => ({ id: t.id })) },
      },
      {
        subject: 'Press kit approval timeline',
        status: 'triage',
        department: { connect: { id: deptBySlug['marketing'].id } },
        askedBy: { connect: { id: userByEmail['cameron.content@example.com'].id } },
        tags: { connect: tags.slice(1, 4).map(t => ({ id: t.id })) },
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

