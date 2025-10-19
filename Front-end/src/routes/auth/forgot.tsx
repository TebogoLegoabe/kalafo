import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { healthCheck, getApiErrorMessage } from '@/api/kalafo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Heart, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/auth/forgot')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Forgot Password | Kalafo'
  }, [])

  // Placeholder: no forgot endpoint provided. Do a health check to verify backend up, then show message.
  const mutation = useMutation({
    mutationFn: () => healthCheck(),
    onSuccess: () => {
      setMessage('If an account with that email exists, a reset link has been sent.')
    },
    onError: (err) => setError(getApiErrorMessage(err)),
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Email is required.')
      setMessage(null)
      return
    }
    setError(null)
    setMessage(null)
    await mutation.mutateAsync()
  }

  return (
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
              <CardTitle className="text-2xl">Reset your password</CardTitle>
              <CardDescription>
                Enter your email and we'll send you a reset link
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onSubmit} noValidate>
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

              {error && (
                <p className="text-sm text-red-600" role="alert" aria-live="polite">
                  {error}
                </p>
              )}
              {message && (
                <p className="text-sm text-teal-700" role="status" aria-live="polite">
                  {message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Sending…' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
