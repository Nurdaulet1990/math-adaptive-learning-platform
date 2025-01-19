"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(event.target as HTMLFormElement)
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      const result = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl,
      })

      setIsLoading(false)
      
      if (result?.error) {
        setError("Invalid credentials")
      }
    } catch (error) {
      setIsLoading(false)
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <label htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              className="w-full rounded-md border p-2"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              className="w-full rounded-md border p-2"
            />
          </div>
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
          <Button disabled={isLoading}>
            {isLoading && (
              <span className="mr-2">Loading...</span>
            )}
            Sign In
          </Button>
        </div>
      </form>
    </div>
  )
}
