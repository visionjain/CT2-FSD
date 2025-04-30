"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            className={variant === "destructive" 
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className={variant === "destructive" ? "text-red-800" : "text-emerald-800"}>
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className={variant === "destructive" ? "text-red-700" : "text-emerald-700"}>
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className={
              variant === "destructive" 
                ? "text-red-800 hover:bg-red-100" 
                : "text-emerald-800 hover:bg-emerald-100"
            } />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
