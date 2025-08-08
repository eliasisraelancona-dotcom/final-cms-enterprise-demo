import type { BaseListTypeInfo } from '@keystone-6/core/types'
import type { Session } from '.keystone/types'

export type AccessArgs = {
  session?: Session
}

export const isSignedIn = ({ session }: AccessArgs) => Boolean(session)

export function hasPermission(
  permission: keyof NonNullable<Session>['data']['role']
): (args: AccessArgs) => boolean {
  return ({ session }: AccessArgs) => Boolean(session?.data.role?.[permission])
}

export const permissions = {
  canUseAdminUI: hasPermission('canUseAdminUI'),
  canManageUsers: hasPermission('canManageUsers'),
  canManageAssets: hasPermission('canManageAssets'),
  canApproveAssets: hasPermission('canApproveAssets'),
  canManageBrands: hasPermission('canManageBrands'),
  canManageContent: hasPermission('canManageContent'),
  canPublishContent: hasPermission('canPublishContent'),
  canViewAnalytics: hasPermission('canViewAnalytics'),
  canManageDepartments: hasPermission('canManageDepartments'),
  canAnswerQuestions: hasPermission('canAnswerQuestions'),
  canManageAllDepartments: hasPermission('canManageAllDepartments'),
}

export function departmentFilter<T extends BaseListTypeInfo['fields']>({
  session,
}: AccessArgs): Record<string, unknown> | boolean {
  if (!session) return false
  if (permissions.canManageAllDepartments({ session })) return true
  if (!session.data.department?.id) return false
  return { department: { id: { equals: session.data.department.id } } }
}

