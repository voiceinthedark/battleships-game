import { defineConfig } from 'eslint/config'
import js from '@eslint/js'

export default defineConfig([
  {
    files: ['src/**/*.js'],
    ignores: ['src/tests/**', 'dist/**', '**/*.config.js', '/coverage/**'],
    plugins: {
      js,
    },
    extends: ['js/recommended'],
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
  },
])
