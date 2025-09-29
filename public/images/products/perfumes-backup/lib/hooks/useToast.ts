'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from 'zustand'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }))
    
    // Auto remove after duration
    const duration = toast.duration ?? (toast.type === 'error' ? 8000 : 5000)
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id)
      }, duration)
    }
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }))
  },
  
  clearAll: () => {
    set({ toasts: [] })
  }
}))

export function useToast() {
  const { addToast, removeToast, clearAll } = useToastStore()
  
  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    addToast(toast)
  }, [addToast])
  
  const showSuccess = useCallback((message: string, description?: string) => {
    addToast({
      type: 'success',
      message,
      description
    })
  }, [addToast])
  
  const showError = useCallback((message: string, description?: string) => {
    addToast({
      type: 'error',
      message,
      description
    })
  }, [addToast])
  
  const showWarning = useCallback((message: string, description?: string) => {
    addToast({
      type: 'warning',
      message,
      description
    })
  }, [addToast])
  
  const showInfo = useCallback((message: string, description?: string) => {
    addToast({
      type: 'info',
      message,
      description
    })
  }, [addToast])
  
  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAll
  }
}