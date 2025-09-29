"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Camera } from "lucide-react"
import { useRouter } from "next/navigation"

type Step = "method" | "scan" | "manual" | "schedule"

export default function AddMedicinePage() {
  const [currentStep, setCurrentStep] = useState<Step>("method")
  const [isScanning, setIsScanning] = useState(false)
  const [medicineData, setMedicineData] = useState({
    name: "",
    duration: "",
    frequency: "Day",
    session: "Morning",
    reminder: "Whatsapp",
  })

  const router = useRouter()

  const handleScanPrescription = () => {
    setCurrentStep("scan")
    setIsScanning(true)
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false)
      setCurrentStep("manual")
    }, 3000)
  }

  const handleManualEntry = () => {
    setCurrentStep("manual")
  }

  const handleNext = () => {
    if (currentStep === "manual") {
      setCurrentStep("schedule")
    } else {
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    switch (currentStep) {
      case "scan":
      case "manual":
        setCurrentStep("method")
        break
      case "schedule":
        setCurrentStep("manual")
        break
      default:
        router.back()
        break
    }
  }

  if (currentStep === "method") {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 p-4 border-b">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-lg font-semibold">Add Medicines</span>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
            <Card className="w-full max-w-sm bg-card border-0 shadow-none">
              <div className="p-8 text-center space-y-8">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <div className="text-4xl">💊</div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-4">
                  <Button onClick={handleScanPrescription} className="w-full h-12 text-base font-medium">
                    Scan your prescription
                  </Button>

                  <Button
                    onClick={handleManualEntry}
                    variant="outline"
                    className="w-full h-12 text-base font-medium bg-transparent"
                  >
                    Add manually
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (currentStep === "scan") {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 p-4 border-b">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-lg font-semibold">OCR scanning</span>
          </div>

          {/* Camera View */}
          <div className="flex-1 bg-gray-900 relative">
            {/* Simulated prescription image */}
            <div className="absolute inset-4 bg-white rounded-lg p-4 opacity-80">
              <div className="grid grid-cols-7 gap-1 text-xs">
                {/* Simulated prescription table */}
                {Array.from({ length: 70 }).map((_, i) => (
                  <div key={i} className="h-6 bg-gray-100 border border-gray-300 flex items-center justify-center">
                    {i < 7 ? ["M", "T", "W", "T", "F", "S", "S"][i] : Math.floor(Math.random() * 10)}
                  </div>
                ))}
              </div>
            </div>

            {/* Scanning Overlay */}
            {isScanning && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Card className="bg-primary text-primary-foreground p-6 mx-6">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-foreground mx-auto"></div>
                    <div className="text-lg font-semibold">Scanning...</div>
                  </div>
                </Card>
              </div>
            )}

            {/* Camera Controls */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <Button size="lg" className="w-16 h-16 rounded-full bg-white text-black hover:bg-gray-100">
                <Camera className="w-8 h-8" />
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (currentStep === "manual") {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 p-4 border-b">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-lg font-semibold">Choose Remidi</span>
          </div>

          {/* Form */}
          <div className="flex-1 p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medicineName" className="text-sm font-medium text-primary">
                  Medicine Name
                </Label>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Add name" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aspirin">Aspirin</SelectItem>
                    <SelectItem value="ibuprofen">Ibuprofen</SelectItem>
                    <SelectItem value="paracetamol">Paracetamol</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium text-primary">
                  Duration
                </Label>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Add course Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">7 Days</SelectItem>
                    <SelectItem value="14days">14 Days</SelectItem>
                    <SelectItem value="30days">30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-primary">Every</Label>
                <div className="flex gap-2">
                  <Button
                    variant={medicineData.frequency === "Day" ? "default" : "outline"}
                    onClick={() => setMedicineData((prev) => ({ ...prev, frequency: "Day" }))}
                    className="flex-1 h-12"
                  >
                    Day
                  </Button>
                  <Button
                    variant={medicineData.frequency === "Week" ? "default" : "outline"}
                    onClick={() => setMedicineData((prev) => ({ ...prev, frequency: "Week" }))}
                    className="flex-1 h-12"
                  >
                    Week
                  </Button>
                  <Button
                    variant={medicineData.frequency === "Month" ? "default" : "outline"}
                    onClick={() => setMedicineData((prev) => ({ ...prev, frequency: "Month" }))}
                    className="flex-1 h-12"
                  >
                    Month
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-primary">How often</Label>
                <div className="flex gap-2">
                  <Button variant="default" className="flex-1 h-12">
                    Once
                  </Button>
                  <Button variant="outline" className="flex-1 h-12 bg-transparent">
                    Twice
                  </Button>
                  <Button variant="outline" className="flex-1 h-12 bg-transparent">
                    More
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-primary">Session</Label>
                <div className="flex gap-2">
                  <Button
                    variant={medicineData.session === "Morning" ? "default" : "outline"}
                    onClick={() => setMedicineData((prev) => ({ ...prev, session: "Morning" }))}
                    className="flex-1 h-12"
                  >
                    Morning
                  </Button>
                  <Button
                    variant={medicineData.session === "Noon" ? "default" : "outline"}
                    onClick={() => setMedicineData((prev) => ({ ...prev, session: "Noon" }))}
                    className="flex-1 h-12"
                  >
                    Noon
                  </Button>
                  <Button
                    variant={medicineData.session === "Night" ? "default" : "outline"}
                    onClick={() => setMedicineData((prev) => ({ ...prev, session: "Night" }))}
                    className="flex-1 h-12"
                  >
                    Night
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-primary">Pill reminder</Label>
                <div className="flex gap-2">
                  <Button
                    variant={medicineData.reminder === "Whatsapp" ? "default" : "outline"}
                    onClick={() => setMedicineData((prev) => ({ ...prev, reminder: "Whatsapp" }))}
                    className="flex-1 h-12"
                  >
                    Whatsapp
                  </Button>
                  <Button
                    variant={medicineData.reminder === "Call" ? "default" : "outline"}
                    onClick={() => setMedicineData((prev) => ({ ...prev, reminder: "Call" }))}
                    className="flex-1 h-12"
                  >
                    Call
                  </Button>
                  <Button
                    variant={medicineData.reminder === "Text" ? "default" : "outline"}
                    onClick={() => setMedicineData((prev) => ({ ...prev, reminder: "Text" }))}
                    className="flex-1 h-12"
                  >
                    Text
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <div className="p-6">
            <Button onClick={handleNext} className="w-full h-12 text-base font-medium">
              Next
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (currentStep === "schedule") {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 p-4 border-b">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-lg font-semibold">Your prescription</span>
          </div>

          {/* Schedule */}
          <div className="flex-1 p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Morning ☀️</h2>
                <span className="text-sm text-muted-foreground">7 Days</span>
              </div>

              <div className="space-y-3">
                <div className="bg-card rounded-lg p-4 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">T-HCQ, AF</h3>
                      <p className="text-sm text-muted-foreground">T-DATO-P, BF T-OMACORTIL, AF T-PARACOT, AF</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Afternoon ☀️</h2>
                <span className="text-sm text-muted-foreground">7 Days</span>
              </div>

              <div className="space-y-3">
                <div className="bg-card rounded-lg p-4 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">T-IMCEE, AF</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Night 🌙</h2>
                <span className="text-sm text-muted-foreground">7 Days</span>
              </div>

              <div className="space-y-3">
                <div className="bg-card rounded-lg p-4 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">T-HCQ, AF</h3>
                      <p className="text-sm text-muted-foreground">CAP RECOUSULE, AF T-OMACORTIL, AF T-PARACOT, AF</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <div className="p-6">
            <Button onClick={handleNext} className="w-full h-12 text-base font-medium">
              Next
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return null
}
