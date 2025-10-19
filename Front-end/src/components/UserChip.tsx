import { useMemo } from 'react'
import type { User } from '@/api/kalafo'

interface UserChipProps {
  user: Pick<User, 'first_name' | 'last_name' | 'email'>
  size?: number // px
}

export function UserChip({ user, size = 36 }: UserChipProps) {
  const initials = useMemo(() => {
    const f = user.first_name?.trim()?.[0] || ''
    const l = user.last_name?.trim()?.[0] || ''
    return (f + l).toUpperCase() || user.email?.[0]?.toUpperCase() || '?'
  }, [user.first_name, user.last_name, user.email])

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center rounded-full bg-teal-600 text-white font-semibold select-none"
        style={{ width: size, height: size, fontSize: Math.max(12, Math.floor(size * 0.45)) }}
        aria-label="Profile image"
      >
        {initials}
      </div>
      <div className="leading-tight">
        <div className="text-sm font-medium text-gray-900">
          {user.first_name} {user.last_name}
        </div>
        <div className="text-xs text-gray-600">{user.email}</div>
      </div>
    </div>
  )
}