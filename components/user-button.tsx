"use client"

import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export const UserButton = () => {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
      // Force reload as fallback
      window.location.href = "/"
    }
  }

  return (
    <button onClick={handleSignOut}>
      Sign Out
    </button>
  )
} 