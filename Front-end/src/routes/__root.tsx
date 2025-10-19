import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth'

function RootComponent() {
  const navigate = Route.useNavigate()
  const { location } = useRouterState()
  const pathname = location.pathname
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    const isDashboard = pathname.startsWith('/dashboard')
    if (user && !isDashboard) {
      navigate({ to: '/dashboard', replace: true })
    } else if (!user && isDashboard) {
      navigate({ to: '/auth', replace: true })
    }
  }, [user, pathname, navigate])

  return (
    <div className="inter-light">
      <Outlet />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
})
