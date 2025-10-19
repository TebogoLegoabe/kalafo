import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getAdminDashboard, getAllUsers } from '@/api/kalafo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Users, Stethoscope, CalendarCheck, Activity, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

export const Route = createFileRoute('/dashboard/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => getAdminDashboard(),
  })

  const { data: usersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: () => getAllUsers(),
  })

  const stats = dashboardData?.stats
  const users = usersData?.users || []

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default'
      case 'doctor':
        return 'secondary'
      case 'patient':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-600'
      case 'doctor':
        return 'bg-teal-600'
      case 'patient':
        return 'bg-sky-600'
      default:
        return 'bg-gray-600'
    }
  }

  if (isDashboardLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Overview of system statistics and users</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-teal-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Doctors</CardTitle>
            <Stethoscope className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.total_doctors || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Registered doctors</p>
          </CardContent>
        </Card>

        <Card className="border-teal-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.total_patients || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Registered patients</p>
          </CardContent>
        </Card>

        <Card className="border-teal-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Consultations</CardTitle>
            <CalendarCheck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.total_consultations || 0}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="border-teal-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Consultations</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.active_consultations || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Currently active</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-teal-100">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all registered users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {isUsersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No users found</div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-gray-600">{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex items-center justify-center rounded-full ${getRoleColor(
                              user.role
                            )} text-white font-semibold text-xs`}
                            style={{ width: 32, height: 32 }}
                          >
                            {user.first_name?.[0]?.toUpperCase() || '?'}
                            {user.last_name?.[0]?.toUpperCase() || ''}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? 'default' : 'secondary'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {format(new Date(user.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
