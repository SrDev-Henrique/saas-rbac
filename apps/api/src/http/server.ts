import { fastify } from 'fastify'
import fastiyCors from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { createAccount } from './routes/auth/create-account'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Nexts.js SaaS RBAC',
      description:
        'fullstack SaaS multi-tenant & RBAC with Next.js, Prisma, Fastify, Zod and TypeScript',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastiyCors)

app.register(createAccount)

app.listen({ port: 3000 }).then(() => {
  console.log('HTTP server running on port 3000')
})
