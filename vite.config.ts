/// <reference types="vitest/config" />
import { createHash } from 'crypto'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// GitHub Pages cannot send response headers, so the policy ships as a <meta> tag. The two inline scripts in
// index.html are allowed by hash. Skipped when VITE_API_URL is unset (E2E and local builds), since the
// allowed API origin is unknown then.
function contentSecurityPolicy(apiUrl: string | undefined): Plugin {
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (!apiUrl) return html
        const inlineScripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
          (match) => `'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`,
        )
        const policy = [
          "default-src 'self'",
          `script-src 'self' ${inlineScripts.join(' ')}`,
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self' data:",
          `connect-src 'self' ${new URL(apiUrl).origin} https://www.googleapis.com https://openlibrary.org`,
          "manifest-src 'self'",
          "worker-src 'self'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; ')
        return html.replace('<meta charset="UTF-8" />', `$&
    <meta http-equiv="Content-Security-Policy" content="${policy}" />`)
      },
    },
  }
}

export default defineConfig(({ mode }) => ({
  // GitHub Pages serves the app at https://tsundoku-books.github.io/bookshelf-frontend/.
  // Everywhere else (dev, Docker, E2E suites) it is served from the root.
  base: process.env.GITHUB_PAGES === 'true' ? '/bookshelf-frontend/' : '/',
  plugins: [react(), contentSecurityPolicy(loadEnv(mode, process.cwd(), 'VITE_').VITE_API_URL)],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/test/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/@types/**',
        'src/components/ui/**',
      ],
      reporter: ['text-summary', 'text', 'lcov'],
    },
  },
  server: {
    host: true,
    port: 5173,
    // Vite 7 blocks unknown hosts by default. In Docker, Chromium reaches the
    // dev server via the "frontend" hostname, which must be allow-listed.
    allowedHosts: ['frontend', 'localhost'],
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL ?? 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
}))
