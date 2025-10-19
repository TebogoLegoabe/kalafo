import { createFileRoute, Outlet, Link, useRouterState } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/Footer'
import { ArrowLeft, Heart } from 'lucide-react'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouterState()
  const pathname = router.location.pathname

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-sky-50 flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)] bg-[linear-gradient(to_right,rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Header with Logo (left) and Back button (right) */}
      <div className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-teal-600" />
              <span className="text-lg font-semibold text-gray-900">KALAFO</span>
            </div>

            <Button variant="ghost" className="text-gray-700 hover:text-teal-600" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-8 md:py-12 flex-1">
        {/* Tabs Navigation */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-1 rounded-lg bg-white border border-teal-100/80 p-1.5 shadow-md">
            <Link
              to="/auth"
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all ${
                pathname === '/auth'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
              }`}
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all ${
                pathname === '/auth/register'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
              }`}
            >
              Register
            </Link>
            <Link
              to="/auth/forgot"
              className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all ${
                pathname === '/auth/forgot'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
              }`}
            >
              Reset
            </Link>
          </div>
        </div>

        {/* Outlet */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
