import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { UserChip } from '@/components/UserChip'

interface HeaderProps {
  onNavigate: (ref: React.RefObject<HTMLElement | null>) => void
  homeRef: React.RefObject<HTMLElement | null>
  featuresRef: React.RefObject<HTMLElement | null>
  aboutRef: React.RefObject<HTMLElement | null>
  contactRef: React.RefObject<HTMLElement | null>
}

export function Header({ onNavigate, homeRef, featuresRef, aboutRef, contactRef }: HeaderProps) {
  const user = useAuthStore((s) => s.user)

  return (
    <nav className="sticky top-0 z-50 w-full border-b backdrop-blur bg-white/90">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => onNavigate(homeRef)}
          className="flex items-center gap-2"
          aria-label="Go to home"
        >
          <Heart className="h-5 w-5 text-teal-600" />
          <span className="text-xl font-semibold cursor-pointer">KALAFO</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => onNavigate(homeRef)} className="text-sm text-gray-700 hover:text-teal-600 transition">Home</button>
          <button onClick={() => onNavigate(featuresRef)} className="text-sm text-gray-700 hover:text-teal-600 transition">Features</button>
          <button onClick={() => onNavigate(aboutRef)} className="text-sm text-gray-700 hover:text-teal-600 transition">About</button>
          <button onClick={() => onNavigate(contactRef)} className="text-sm text-gray-700 hover:text-teal-600 transition">Contact</button>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" title="Go to dashboard">
              <UserChip user={user} />
            </Link>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-gray-700" asChild>
                <Link to="/auth">Login</Link>
              </Button>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white" asChild>
                <Link to="/auth/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
