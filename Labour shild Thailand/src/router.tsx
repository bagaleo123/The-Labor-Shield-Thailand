import { createRouter as createTanStackRouter, createRootRoute, createRoute } from '@tanstack/react-router'
import App from './App'

// Создаем базовый маршрут, который просто показывает твое приложение
const rootRoute = createRootRoute({
  component: App,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
})

const routeTree = rootRoute.addChildren([indexRoute])

export function createRouter() {
  return createTanStackRouter({ routeTree })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
