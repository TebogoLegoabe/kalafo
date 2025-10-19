import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { useMemo, useState, useEffect } from 'react'
import { LayoutDashboard, CalendarDays, Users, Stethoscope, FileText, Activity, ClipboardList, User2, ShieldCheck, ShieldAlert, LogOut } from 'lucide-react'
import type { Role } from '@/api/kalafo'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { location } = useRouterState()
  const pathname = location.pathname
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const role: Role = (user?.role as Role) ?? 'patient'
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)

  // Role home routes
  const roleHome: Record<Role, string> = {
    admin: '/dashboard/admin',
    doctor: '/dashboard/doctor',
    patient: '/dashboard',
  }

  // Authorization check per role and path
  const isAllowedPath = (r: Role, path: string) => {
    if (r === 'admin') return path.startsWith('/dashboard')

    if (r === 'doctor') {
      // Allow only doctor section
      return path === '/dashboard/doctor' || path.startsWith('/dashboard/doctor/')
    }

    // patient
    const exact = ['/dashboard']
    const prefixes = [
      '/dashboard/appointments',
      '/dashboard/history',
      '/dashboard/health-data',
      '/dashboard/profile',
    ]
    if (exact.includes(path)) return true
    return prefixes.some((p) => path === p || path.startsWith(`${p}/`))
  }

  const unauthorized = !!user && !isAllowedPath(role, pathname)

  // Auto-redirect if user hits an unauthorized path
  useEffect(() => {
    if (unauthorized) {
      navigate({ to: roleHome[role], replace: true })
    }
  }, [unauthorized, navigate, role, roleHome])

  const handleSignOut = () => {
    logout()
    navigate({ to: '/auth' })
  }

  const initials = useMemo(() => {
    if (!user) return '?'
    const f = user.first_name?.trim()?.[0] || ''
    const l = user.last_name?.trim()?.[0] || ''
    return (f + l).toUpperCase() || user.email?.[0]?.toUpperCase() || '?'
  }, [user])

  const adminNav = [
    { to: '/dashboard/admin', label: 'Admin Dashboard', icon: ShieldCheck },
  ]

  const doctorNav = [
    { to: '/dashboard/doctor', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/dashboard/doctor/schedule', label: 'Schedule', icon: CalendarDays },
    { to: '/dashboard/doctor/patients', label: 'Patients Management', icon: Users },
    { to: '/dashboard/doctor/consultations', label: 'Consultations', icon: Stethoscope },
    { to: '/dashboard/doctor/records', label: 'Medical Records', icon: FileText },
  ]

  const patientNav = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, shortLabel: 'Home' },
    { to: '/dashboard/appointments', label: 'Appointments', icon: CalendarDays, shortLabel: 'Appointments' },
    { to: '/dashboard/history', label: 'Medical History', icon: ClipboardList, shortLabel: 'History' },
    { to: '/dashboard/health-data', label: 'Health Data', icon: Activity, shortLabel: 'Health' },
    { to: '/dashboard/profile', label: 'Profile', icon: User2, shortLabel: 'Profile' },
  ]

  type NavItem = { 
    to: string
    label: string
    shortLabel?: string
    icon: React.ComponentType<{ className?: string }> 
  }
  
  const navGroups: { title: string; items: NavItem[] }[] = useMemo(() => {
    if (role === 'admin') {
      return [
        { title: 'Admin', items: adminNav },
        { title: 'Doctor', items: doctorNav },
        { title: 'Patient', items: patientNav },
      ]
    }
    if (role === 'doctor') {
      return [{ title: 'Doctor', items: doctorNav }]
    }
    return [{ title: 'Patient', items: patientNav }]
  }, [role])

  const isActive = (to: string) => {
    if (pathname === to) return true
    if (to !== '/dashboard' && to !== '/dashboard/doctor' && to !== '/dashboard/admin') {
      return pathname.startsWith(to)
    }
    return false
  }
  
  const baseLink = 'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors'

  // For mobile bottom nav (patient only)
  const showMobileNav = role === 'patient'

  return (
    <>
      <title>Dashboard - Kalafo</title>
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 pb-20 md:pb-8">
          <div className={`grid grid-cols-1 ${!showMobileNav ? 'md:grid-cols-[260px_1fr]' : 'md:grid-cols-[260px_1fr]'} gap-6`}>
            {/* Desktop Sidebar - Hidden on mobile for patients */}
            {user && (
              <aside className={`${showMobileNav ? 'hidden md:block' : ''} md:sticky md:top-6 h-max`}>
                <div className="rounded-xl border border-teal-100 bg-white shadow-sm">
                  {/* User Profile Header */}
                  <div className="px-4 py-3 border-b border-teal-50">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center rounded-full bg-teal-600 text-white font-semibold select-none"
                        style={{ width: 40, height: 40, fontSize: 16 }}
                        aria-label="Profile image"
                      >
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <nav className="p-2 space-y-4">
                    {navGroups.map((group) => (
                      <div key={group.title}>
                        <div className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          {group.title}
                        </div>
                        <div className="mt-1 flex flex-col gap-1">
                          {group.items.map(({ to, label, icon: Icon }) => (
                            <Link
                              key={`${group.title}-${to}`}
                              to={to}
                              className={
                                baseLink +
                                ' ' +
                                (isActive(to)
                                  ? 'bg-teal-600 text-white'
                                  : 'text-slate-700 hover:text-teal-700 hover:bg-teal-50')
                              }
                              aria-current={isActive(to) ? 'page' : undefined}
                            >
                              <Icon
                                className={
                                  'h-4 w-4 ' +
                                  (isActive(to) ? 'text-white' : 'text-teal-600 group-hover:text-teal-700')
                                }
                              />
                              <span>{label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </nav>

                  {/* Sign Out Button */}
                  <div className="p-2 border-t border-teal-50">
                    <button
                      onClick={() => setShowSignOutDialog(true)}
                      className={baseLink + ' w-full text-red-600 hover:text-red-700 hover:bg-red-50'}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </aside>
            )}

            {/* Main content */}
            <main className="min-h-[60vh]">
              <div className="rounded-xl border border-teal-100 bg-white shadow-sm p-4 md:p-6">
                {!user ? (
                  <div className="text-center py-12">
                    <ShieldAlert className="mx-auto h-10 w-10 text-teal-600 mb-3" />
                    <h2 className="text-xl font-semibold mb-2">Not authorized</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      You must be signed in to access this page.
                    </p>
                    <Button asChild className="bg-teal-600 hover:bg-teal-700">
                      <Link to="/auth">Go to Sign In</Link>
                    </Button>
                  </div>
                ) : unauthorized ? (
                  <div className="text-center py-12">
                    <ShieldAlert className="mx-auto h-10 w-10 text-teal-600 mb-3" />
                    <h2 className="text-xl font-semibold mb-2">No permission</h2>
                    <p className="text-sm text-gray-600 mb-6">
                      You do not have permission to view this page.
                    </p>
                    <Button asChild className="bg-teal-600 hover:bg-teal-700">
                      <Link to={roleHome[role]}>Go to my dashboard</Link>
                    </Button>
                  </div>
                ) : (
                  <Outlet />
                )}
              </div>
            </main>
          </div>
        </div>

        {/* Mobile Bottom Navigation - Patient only */}
        {user && showMobileNav && (
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-teal-100 shadow-lg z-50">
            <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
              {patientNav.map(({ to, shortLabel, label, icon: Icon }) => {
                const active = isActive(to)
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                      active
                        ? 'text-teal-600'
                        : 'text-gray-600'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'text-teal-600' : 'text-gray-500'}`} />
                    <span className="text-[10px] font-medium">{shortLabel || label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
        )}

        {/* Sign Out Confirmation Dialog */}
        <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out of your account?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to sign out? You'll need to sign in again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                Sign Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  )
}
