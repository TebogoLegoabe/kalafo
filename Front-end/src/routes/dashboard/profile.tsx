import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <title>Profile - Kalafo</title>
    profile</div>
}
