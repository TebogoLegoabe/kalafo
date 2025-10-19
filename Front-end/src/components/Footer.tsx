import { Heart } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="border-t bg-white/80 backdrop-blur py-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-teal-600" />
            <span className="text-lg font-semibold text-gray-900"><Link to="/">Kalafo</Link></span>
          </div>
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} <Link to="/">Kalafo</Link>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}