import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { type Plugin, defineConfig } from 'vite'

// GitHub Pages has no SPA rewrite. Ship a copy of index.html as 404.html so deep
// links and refreshes on client routes (for example /login) boot the app
// instead of returning a hosting 404.
function githubPagesSpaFallback(): Plugin {
  return {
    name: 'github-pages-spa-fallback',
    apply: 'build',
    closeBundle() {
      const dist = resolve(process.cwd(), 'dist')
      const index = resolve(dist, 'index.html')
      if (existsSync(index)) {
        copyFileSync(index, resolve(dist, '404.html'))
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), githubPagesSpaFallback()],
  // GitHub Pages project site: served from https://<user>.github.io/Nixone.github.io/.
  // Every built asset URL and the router basename derive from this.
  base: '/Nixone.github.io/',
})
