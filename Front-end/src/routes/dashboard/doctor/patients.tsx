import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { getAllPatients, type PatientSummary } from '@/api/kalafo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Activity, History, Loader2, Search, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'

export const Route = createFileRoute('/dashboard/doctor/patients')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [activityFilter, setActivityFilter] = useState<'all' | 'with' | 'without'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['doctor-patients'],
    queryFn: () => getAllPatients(),
    staleTime: 5 * 60 * 1000,
  })

  const patients: PatientSummary[] = data ?? []

  // Derived stats for header cards
  const totalPatients = patients.length
  const activePatients = useMemo(() => patients.filter(p => p.is_active).length, [patients])
  const withConsultations = useMemo(() => patients.filter(p => (p.consultation_count ?? 0) > 0).length, [patients])

  // Client-side search + filters
  const filtered = useMemo(() => {
    let result = [...patients]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((p) =>
        p.first_name?.toLowerCase().includes(q) ||
        p.last_name?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(q)
      )
      // search should not chain on other filters
      return result
    }

    if (statusFilter !== 'all') {
      const active = statusFilter === 'active'
      result = result.filter((p) => Boolean(p.is_active) === active)
    }

    if (activityFilter !== 'all') {
      if (activityFilter === 'with') {
        result = result.filter((p) => (p.consultation_count ?? 0) > 0)
      } else {
        result = result.filter((p) => (p.consultation_count ?? 0) === 0)
      }
    }

    return result
  }, [patients, searchQuery, statusFilter, activityFilter])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filtered.slice(start, end)
  }, [filtered, currentPage, itemsPerPage])

  const handleFilterChange = () => setCurrentPage(1)

  const roleAvatarBg = 'bg-sky-600' // all are patients

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Patients</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your patient list</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-teal-100 transition-all  hover:scale-105 hover:shadow-lg animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalPatients}</div>
            <p className="text-xs text-gray-500 mt-1">All registered patients</p>
          </CardContent>
        </Card>

        <Card className="border-teal-100 transition-all  hover:scale-105 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Patients</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{activePatients}</div>
            <p className="text-xs text-gray-500 mt-1">Active accounts</p>
          </CardContent>
        </Card>

        <Card className="border-teal-100 transition-all  hover:scale-105 hover:shadow-lg animate-in fade-in slide-in-from-right-4 duration-500 delay-[200ms]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">With Consultations</CardTitle>
            <History className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{withConsultations}</div>
            <p className="text-xs text-gray-500 mt-1">Has at least one consult</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-teal-100 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <CardHeader className="flex items-start sm:items-center gap-3 sm:flex-row sm:justify-between">
          <div>
            <CardTitle>Patients</CardTitle>
            <CardDescription className="transition-opacity duration-300">
              Showing {paginated.length} of {filtered.length} patients
              {filtered.length !== patients.length && ` (filtered from ${patients.length} total)`}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            title="Refresh list"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  // search clears other filters
                  setStatusFilter('all')
                  setActivityFilter('all')
                  handleFilterChange()
                }}
                className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as typeof statusFilter)
                handleFilterChange()
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px] transition-all duration-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={activityFilter}
              onValueChange={(v) => {
                setActivityFilter(v as typeof activityFilter)
                handleFilterChange()
              }}
            >
              <SelectTrigger className="w-full sm:w-[220px] transition-all duration-200">
                <SelectValue placeholder="Consultation activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="with">With consultations</SelectItem>
                <SelectItem value="without">Without consultations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table container to minimize layout shift */}
          <div className="transition-all duration-300 ease-in-out" style={{ minHeight: '420px' }}>
            {isLoading ? (
              <div className="flex items-center justify-center py-12 animate-in fade-in duration-300">
                <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-500 animate-in fade-in zoom-in-95 duration-300">
                {searchQuery || statusFilter !== 'all' || activityFilter !== 'all'
                  ? 'No patients match your filters'
                  : 'No patients found'}
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="w-[56px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Consultations</TableHead>
                        <TableHead>Last Consultation</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginated.map((p, index) => (
                        <TableRow
                          key={p.id}
                          className="transition-all duration-200 hover:bg-slate-50 animate-in fade-in slide-in-from-left-2"
                          style={{ animationDelay: `${index * 50}ms`, animationDuration: '300ms' }}
                        >
                          <TableCell className="font-medium text-gray-600">{p.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex items-center justify-center rounded-full ${roleAvatarBg} text-white font-semibold text-xs transition-transform duration-200 hover:scale-110`}
                                style={{ width: 32, height: 32 }}
                              >
                                {p.first_name?.[0]?.toUpperCase() || '?'}
                                {p.last_name?.[0]?.toUpperCase() || ''}
                              </div>
                              <div className="font-medium text-gray-900">
                                {p.first_name} {p.last_name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">{p.email}</TableCell>
                          <TableCell>
                            <Badge variant={p.is_active ? 'default' : 'secondary'}>
                              {p.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {p.consultation_count ?? 0}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {p.last_consultation
                              ? format(new Date(p.last_consultation), 'MMM dd, yyyy')
                              : '—'}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {p.created_at ? format(new Date(p.created_at), 'MMM dd, yyyy') : '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rows per page:</span>
                    <Select
                      value={String(itemsPerPage)}
                      onValueChange={(v) => {
                        setItemsPerPage(Number(v))
                        setCurrentPage(1)
                      }}
                    >
                      <SelectTrigger className="w-[80px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
