import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/doctor/records')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/doctor/records"!</div>
}
