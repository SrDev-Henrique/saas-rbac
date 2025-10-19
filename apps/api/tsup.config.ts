import { defineConfig } from 'tsup'
import path from 'path'

export default defineConfig({
  entry: ['src/http/server.ts'],
  outDir: 'dist',
  format: ['cjs'],
  platform: 'node',
  target: 'node18',
  sourcemap: true,
  dts: false,
  splitting: false,
  clean: true,
  skipNodeModulesBundle: false,
  noExternal: ['@saas/auth', '@saas/env', '@t3-oss/env-nextjs', 'zod'],
  external: [
    '@prisma/client',
    'prisma',
    '@fastify/swagger',
    '@fastify/swagger-ui',
    '@supabase/supabase-js',
  ],
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      '.prisma': 'file',
      '.wasm': 'file',
      '.node': 'file',
    }
    // Alias workspace packages to their source during build, ensuring bundling.
    // This helps in CI environments where workspace linking may differ.
    ;(options as any).alias = {
      ...(options as any).alias,
      '@saas/auth': path.resolve(__dirname, '../../packages/auth/src/index.ts'),
      '@saas/env': path.resolve(__dirname, '../../packages/_env/index.ts'),
    }
  },
})
