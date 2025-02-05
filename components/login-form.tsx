import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SignInButton } from "@clerk/nextjs"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-8 md:p-12">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-start text-left space-y-2">
                <h1 className="text-2xl font-bold">Welcome to FinanceHub</h1>
                <p className="text-muted-foreground">
                  Rethink the way you close your books
                </p>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Get started for free</h2>
                <div className="flex flex-col gap-3">
                  <SignInButton mode="modal" provider="google">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2 h-12">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Continue with Google
                    </Button>
                  </SignInButton>
                  
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full h-12">
                      Continue with Email
                    </Button>
                  </SignInButton>
                </div>
              </div>
            </div>
          </div>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/reading.png"
              alt="Login"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-sm text-muted-foreground">
        By proceeding, you agree to our <a href="#" className="underline underline-offset-2 hover:text-primary">Terms of Service</a>
      </div>
    </div>
  )
} 