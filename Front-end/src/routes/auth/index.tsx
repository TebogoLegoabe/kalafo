import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {  useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { login as loginApi, getDashboardRoute, getApiErrorMessage } from '@/api/kalafo'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Heart, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/auth/')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  

  const mutation = useMutation({
    mutationFn: () => loginApi({ email, password }),
    onSuccess: (data) => {
      const token = data.access_token || data.token
      if (token) {
        useAuthStore.getState().login(data.user, token)
      }
      toast.success('Logged in successfully!')
      const to = getDashboardRoute(data.user.role)
      navigate({ to })
    },
    onError: (err) => {
      const msg = getApiErrorMessage(err)
      setError(msg)
      toast.error(msg)
    },
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.')
      toast.error('Please enter your email and password.')
      return
    }
    setError(null)
    mutation.mutate()
  }

  return (
    <>
      <title>Login - Kalafo</title>
      <div className="flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border border-teal-100 shadow-lg">
            <CardHeader className="space-y-4">
              <div className="flex justify-center">
                <div className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-teal-600" />
                  <span className="text-2xl font-bold">KALAFO</span>
                </div>
              </div>
              <div className="text-center">
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>Sign in to your account to continue</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onSubmit} noValidate>
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-red-600" role="alert" aria-live="polite">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/auth/register"
                  className="font-medium text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
