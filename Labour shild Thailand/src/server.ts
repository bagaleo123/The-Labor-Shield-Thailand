import { createStartHandler, defaultRenderHandler } from '@tanstack/react-start/server'
import { createRouter } from './router'

export default createStartHandler({
  createRouter,
  getRouterManifest: () => {
    // В режиме SPA манифест не всегда нужен, но для билда он обязателен
    return {
      routes: {},
    }
  },
})(defaultRenderHandler)
