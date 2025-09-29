'use client';

import { useToastStore } from '@/lib/hooks/useToast';
import Toast from './Toast';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          show={true}
          type={toast.type}
          title={toast.message}
          message={toast.description}
          duration={0} // Controle via useToastStore
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}