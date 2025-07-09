"use client"

import { CheckCircle, AlertCircle, Info, X } from "lucide-react"
import { toast } from "sonner"

interface CustomToastProps {
  title: string
  description?: string
  type?: "success" | "error" | "info"
}

export function showCustomToast({ title, description, type = "info" }: CustomToastProps) {
  const toastFn = type === "success" ? toast.success : type === "error" ? toast.error : toast.info

  toastFn(
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        {type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
        {type === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
        {type === "info" && <Info className="h-5 w-5 text-blue-500" />}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

// Example of a more advanced custom toast component
export function CustomToastComponent({ toast }: { toast: any }) {
  const { id, title, description, type } = toast

  return (
    <div
      className={`
      flex items-center justify-between gap-2 rounded-md border p-4 shadow-sm
      ${type === "success" ? "bg-green-50 border-green-200" : ""}
      ${type === "error" ? "bg-red-50 border-red-200" : ""}
      ${type === "info" ? "bg-blue-50 border-blue-200" : ""}
      ${!type ? "bg-white border-gray-200" : ""}
    `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
          {type === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
          {type === "info" && <Info className="h-5 w-5 text-blue-500" />}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      <button
        title="Close"
        onClick={() => toast.dismiss(id)}
        className="flex-shrink-0 rounded-md p-1 hover:bg-gray-200"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
