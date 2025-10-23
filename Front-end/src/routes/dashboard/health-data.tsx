import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/health-data')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <title>Health Data - Kalafo</title>
    health data</div>
}
