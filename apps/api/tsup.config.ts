import { defineConfig } from 'tsup'

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
  skipNodeModulesBundle: true,
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
  },
})
