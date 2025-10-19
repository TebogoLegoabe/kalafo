import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/doctor/schedule')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/doctor/schedule"!</div>
}
