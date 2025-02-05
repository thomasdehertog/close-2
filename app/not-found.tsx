import { headers } from 'next/headers'

export default async function NotFound() {
  // Properly await headers
  const headersList = await headers()
  
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-muted-foreground">This page could not be found.</p>
    </div>
  )
} 