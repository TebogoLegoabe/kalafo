import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { register as registerApi, getApiErrorMessage, type Role } from '@/api/kalafo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Heart, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [gender, setGender] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [role, setRole] = useState<Role>('patient')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [registered, setRegistered] = useState(false)

  const mutation = useMutation({
    mutationFn: () =>
      registerApi({
        email,
        password,
        role,
        first_name: firstName,
        last_name: lastName,
      }),
    onSuccess: () => {
      toast.success('Registration successful!')
      setRegistered(true)
    },
    onError: (err) => {
      const msg = getApiErrorMessage(err)
      setError(msg)
      toast.error(msg)
    },
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !firstName.trim() || !lastName.trim() || !gender || !email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      toast.error('Please fill in all fields.')
      return
    }
    setError(null)
    mutation.mutate()
  }

  // Success view after registration
  if (registered) {
    return (
      <>
        <title>Registration Success - Kalafo</title>
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md"
          >
            <Card className="border border-teal-100 shadow-lg">
              <CardHeader className="space-y-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
                  <CheckCircle className="h-7 w-7 text-teal-600" />
                </div>
                <CardTitle className="text-2xl">Account created</CardTitle>
                <CardDescription>Your registration was successful. You can now sign in.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  onClick={() => navigate({ to: '/auth' })}
                >
                  Go to login
                </Button>
                <p className="text-center text-sm text-gray-600">
                  Or{' '}
                  <Link to="/" className="text-teal-600 hover:text-teal-700 hover:underline">
                    return home
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      <title>Register - Kalafo</title>
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
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>Sign up to get started with KALAFO</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={onSubmit} noValidate>
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Select value={title} onValueChange={setTitle}>
                    <SelectTrigger id="title">
                      <SelectValue placeholder="Select your title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mr">Mr</SelectItem>
                      <SelectItem value="ms">Ms</SelectItem>
                      <SelectItem value="mrs">Mrs</SelectItem>
                      <SelectItem value="dr">Dr</SelectItem>
                      <SelectItem value="prof">Prof</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Names */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="first_name"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="last_name"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">I am a</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                    </SelectContent>
                  </Select>
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
                  {mutation.isPending ? 'Creating…' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/auth"
                  className="font-medium text-teal-600 hover:text-teal-700 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
