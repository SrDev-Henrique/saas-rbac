import { AbilityBuilder } from '@casl/ability'
import type { AppAbility } from './index'
import type { User } from "./models/user"
import type { Role } from "./roles"

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

type Roles = Role

export const permissions: Record<Roles, PermissionsByRole> = {
  ADMIN(_, { can }) {
    can('manage', 'all')
  },
  MEMBER(_, { can }) {
      can('invite', 'User')
      can('create', 'Project')
  },
  BILLING(_, { can }) {
    can('manage', 'all')
  },
}
