"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMedications } from "@/lib/medications-context"
import { useToast } from "@/hooks/use-toast"

export default function MedicationsPage() {
  const router = useRouter()
  const { medications, loading, deleteMedication, toggleMedicationActive } = useMedications()
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    try {
      await deleteMedication(id)
      toast({
        title: "Đã xóa",
        description: "Thuốc đã được xóa khỏi danh sách",
      })
    } catch (error) {
      console.error("[v0] Error deleting medication:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa thuốc",
        variant: "destructive",
      })
    }
  }

  const formatTimeOfDay = (timeOfDay: string[]) => {
    const map: Record<string, string> = {
      morning: "Sáng",
      afternoon: "Trưa",
      evening: "Tối",
    }
    return timeOfDay.map((t) => map[t] || t).join(", ")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-lg font-semibold">Thuốc của tôi</span>
          </div>
          <Button size="sm" onClick={() => router.push("/add-medicine")}>
            <Plus className="w-4 h-4 mr-1" />
            Thêm
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Đang tải...</div>
          ) : medications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Chưa có thuốc nào</p>
              <Button className="mt-4" onClick={() => router.push("/add-medicine")}>
                Thêm thuốc đầu tiên
              </Button>
            </div>
          ) : (
            medications.map((medication) => (
              <Card key={medication.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{medication.name}</h3>
                    {medication.dosage && <p className="text-sm text-muted-foreground">{medication.dosage}</p>}
                    <div className="mt-2 space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Tần suất:</span> {medication.frequency}
                      </p>
                      <p>
                        <span className="font-medium">Thời gian:</span> {formatTimeOfDay(medication.time_of_day)}
                      </p>
                      <p>
                        <span className="font-medium">Nhắc nhở:</span> {medication.reminder_method}
                      </p>
                      {medication.notes && (
                        <p>
                          <span className="font-medium">Ghi chú:</span> {medication.notes}
                        </p>
                      )}
                    </div>
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant={medication.is_active ? "default" : "outline"}
                        onClick={() => toggleMedicationActive(medication.id)}
                      >
                        {medication.is_active ? "Đang hoạt động" : "Đã tạm dừng"}
                      </Button>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(medication.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
