import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/health-data')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/health"!</div>
}
