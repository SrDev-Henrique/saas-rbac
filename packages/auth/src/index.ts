import {
  createMongoAbility,
  type CreateAbility,
  type MongoAbility,
  AbilityBuilder,
} from '@casl/ability'
import type { User } from './models/user'
import { permissions } from './permissions'
import { userSubject } from './subjects/user'
import { projectSubject } from './subjects/project'
import { inviteSubject } from './subjects/invite'
import { billingSubject } from './subjects/billing'
import { organizationSubject } from './subjects/organization'
import z from 'zod'

export * from './models/user'
export * from './models/project'
export * from './models/organization'
export * from './roles'

const appAbilitiesSchema = z.union([
  projectSubject,
  organizationSubject,
  inviteSubject,
  billingSubject,
  userSubject,

  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permission for role ${user.role} not found.`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })

  return ability
}
