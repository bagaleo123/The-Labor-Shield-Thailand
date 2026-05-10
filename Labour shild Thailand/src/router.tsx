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

export function createRouter() {
  return createTanStackRouter({ 
    routeTree,
    defaultPreload: 'intent',
  })
}

// КРИТИЧЕСКИ ВАЖНО для TanStack Start
export const getRouter = createRouter;

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
