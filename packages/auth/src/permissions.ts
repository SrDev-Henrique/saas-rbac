import { AbilityBuilder } from '@casl/ability'
import type { AppAbility } from './index'
import type { User } from "./models/user"

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

type Role = 'ADMIN' | 'MEMBER'

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(_, { can }) {
    can('manage', 'all')
  },
  MEMBER(_, { can }) {
      can('invite', 'User')
      can('create', 'Project')
  },
}
