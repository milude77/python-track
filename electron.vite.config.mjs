import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import copy from 'rollup-plugin-copy'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin(),
        copy({
        targets: [
          {
            src: 'resources/python_ipc_server.exe',
            dest: 'dist/win-unpacked/resources'
          },
          {
            src: 'notes/*.md',
            dest: 'dist/win-unpacked/resources/notes'
          }
        ]
      })
    ]
  },
  preload: {
    plugins: [
      externalizeDepsPlugin(),
            copy({
        targets: [
          {
            src: 'resources/python_ipc_server.exe',
            dest: 'dist/win-unpacked/resources'
          },
          {
            src: 'notes/*.md',
            dest: 'dist/win-unpacked/resources/notes'
          }
        ]
      })
    ]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true
        }
      }
    },
    plugins: [
      react(),
      copy({
        targets: [
          {
            src: 'resources/python_ipc_server.exe',
            dest: 'dist/win-unpacked/resources'
          },
          {
            src: 'notes/*.md',
            dest: 'dist/win-unpacked/resources/notes'
          }
        ]
      })
    ]
  }
})
