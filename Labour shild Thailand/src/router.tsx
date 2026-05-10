import { createRouter as createTanStackRouter, createRootRoute, createRoute } from '@tanstack/react-router'
import App from './App'

const rootRoute = createRootRoute({
  component: App,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
})

const routeTree = rootRoute.addChildren([indexRoute])

// Эта функция — то, что ищет ошибка "getRouter is not exported"
export function createRouter() {
  return createTanStackRouter({ routeTree })
}

export const getRouter = createRouter;

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
