import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/doctor/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
     <title>Doctor's Dashboard - Kalafo</title>
    doctor's dashboard</div>
}
