"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { format, addMonths, subMonths } from "date-fns"

export default function WorkspaceSetupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    workspaceName: "",
    timezone: "europe-amsterdam",
    fiscalYear: "january",
    firstPeriod: "december-2024"
  })

  const create = useMutation(api.workspaces.create)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await create({
        name: formData.workspaceName,
        timezone: formData.timezone,
        fiscalYearEnd: formData.fiscalYear,
        firstPeriod: formData.firstPeriod,
      })
      router.push("/documents")
    } catch (error) {
      console.error("Failed to create workspace:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generatePeriodOptions = () => {
    const currentDate = new Date()
    const periods = []
    
    for (let i = -13; i <= 1; i++) {
      const date = addMonths(currentDate, i)
      const value = format(date, "MMMM-yyyy").toLowerCase()
      const label = `${format(date, "MMMM yyyy")}${i === 0 ? " (current close)" : i === -1 ? " (prev. close)" : i === 1 ? " (next close)" : ""}`
      
      periods.push({ value, label })
    }
    
    return periods
  }

  const periodOptions = generatePeriodOptions()

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-[600px] px-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">Add workspace</h1>
                <p className="text-muted-foreground">
                  Fill out the form below to create your new workspace!
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workspaceName">Workspace Name:</Label>
                  <Input
                    id="workspaceName"
                    placeholder="Enter workspace name"
                    value={formData.workspaceName}
                    onChange={(e) => handleInputChange("workspaceName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Workspace Time Zone:</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) => handleInputChange("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe-amsterdam">
                        Europe - Amsterdam
                      </SelectItem>
                      {/* Add more timezones as needed */}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fiscalYear">Fiscal Year End:</Label>
                  <Select
                    value={formData.fiscalYear}
                    onValueChange={(value) => handleInputChange("fiscalYear", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="january">January</SelectItem>
                      <SelectItem value="february">February</SelectItem>
                      <SelectItem value="march">March</SelectItem>
                      <SelectItem value="april">April</SelectItem>
                      <SelectItem value="may">May</SelectItem>
                      <SelectItem value="june">June</SelectItem>
                      <SelectItem value="july">July</SelectItem>
                      <SelectItem value="august">August</SelectItem>
                      <SelectItem value="september">September</SelectItem>
                      <SelectItem value="october">October</SelectItem>
                      <SelectItem value="november">November</SelectItem>
                      <SelectItem value="december">December</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstPeriod">First Period:</Label>
                  <Select
                    value={formData.firstPeriod}
                    onValueChange={(value) => handleInputChange("firstPeriod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      {periodOptions.map((period) => (
                        <SelectItem 
                          key={period.value} 
                          value={period.value}
                        >
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Submit"}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 