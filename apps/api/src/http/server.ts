import { fastify } from 'fastify'
import fastiyCors from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastifyJwt from '@fastify/jwt'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { createAccount } from './routes/auth/create-account'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { getProfile } from './routes/auth/get-profile'
import { erorrHandler } from './error-handler'
import { requestPasswordRecover } from './routes/auth/request-password-recover'
import { resetPassword } from './routes/auth/reset-password'
import { authenticateWithGithub } from './routes/auth/authenticate-with-github'
import { env } from '@saas/env'
import { createOrganization } from "./routes/orgs/create-organization"
import { getMembership } from "./routes/orgs/get-membership"
import { getOrganizations } from "./routes/orgs/get-organizations"
import { getOrganization } from "./routes/orgs/get-organization"
import { updateOrganization } from "./routes/orgs/update-organization"
import { shutdownOrganization } from "./routes/orgs/shutdown-organization"

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(erorrHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Nexts.js SaaS RBAC',
      description:
        'fullstack SaaS multi-tenant & RBAC with Next.js, Prisma, Fastify, Zod and TypeScript',
      version: '1.0.0',
    },
    servers: [{ url: `http://localhost:${env.SERVER_PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastiyCors)
app.register(createAccount)
app.register(getProfile)
app.register(authenticateWithPassword)
app.register(authenticateWithGithub)
app.register(resetPassword)
app.register(requestPasswordRecover)

app.register(getMembership)

app.register(createOrganization)
app.register(getOrganization)
app.register(getOrganizations)
app.register(updateOrganization)
app.register(shutdownOrganization)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log(`HTTP server running on port ${env.SERVER_PORT}`)
})
