import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/doctor/consultations')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/doctor/consultations"!</div>
}
