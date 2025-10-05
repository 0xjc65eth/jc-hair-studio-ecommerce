'use client';

import { forwardRef, useEffect, HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'luxury' | 'centered';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({
    isOpen,
    onClose,
    title,
    description,
    size = 'md',
    variant = 'default',
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    preventScroll = true,
    className,
    children,
    ...props
  }, ref) => {
    // Handle body scroll prevention
    useEffect(() => {
      if (isOpen && preventScroll) {
        document.body.style.overflow = 'hidden';
      }
      
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, preventScroll]);

    // Handle escape key
    useEffect(() => {
      if (!isOpen || !closeOnEscape) return;
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEscape, onClose]);

    if (!isOpen) return null;

    const overlayClasses = `
      fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50
      flex items-center justify-center p-4 animate-fade-in
    `;

    const sizeClasses = {
      sm: 'max-w-md w-full',
      md: 'max-w-lg w-full',
      lg: 'max-w-2xl w-full',
      xl: 'max-w-4xl w-full',
      full: 'max-w-full w-full h-full',
    };

    const variantClasses = {
      default: `
        bg-white border border-gray-200 shadow-xl rounded-none
        max-h-[90vh] overflow-hidden
      `,
      luxury: `
        bg-white border border-gray-100 shadow-2xl rounded-none
        backdrop-blur-sm bg-white/95 max-h-[90vh] overflow-hidden
      `,
      centered: `
        bg-white shadow-2xl rounded-lg max-h-[90vh] overflow-hidden
        border-0
      `,
    };

    const modalClasses = clsx(
      'relative animate-scale-in',
      sizeClasses[size],
      variantClasses[variant],
      className
    );

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && closeOnOverlayClick) {
        onClose();
      }
    };

    const modalContent = (
      <div
        className={overlayClasses}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        <div
          ref={ref}
          className={modalClasses}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex-1">
                {title && (
                  <h2
                    id="modal-title"
                    className="text-xl font-playfair font-medium text-gray-900"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id="modal-description"
                    className="text-sm text-gray-600 mt-1"
                  >
                    {description}
                  </p>
                )}
              </div>
              
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="flex-shrink-0 ml-4"
                  aria-label="Fechar modal"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    );

    // Render in portal
    if (typeof window !== 'undefined') {
      return createPortal(modalContent, document.body);
    }

    return null;
  }
);

Modal.displayName = 'Modal';

// Sub-components for better composition
const ModalHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('p-6 border-b border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  )
);

ModalHeader.displayName = 'ModalHeader';

const ModalContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('p-6 overflow-auto flex-1', className)}
      {...props}
    >
      {children}
    </div>
  )
);

ModalContent.displayName = 'ModalContent';

const ModalFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'p-6 border-t border-gray-100 flex items-center justify-end gap-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

ModalFooter.displayName = 'ModalFooter';

// Specialized modal variants
interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  type?: 'warning' | 'danger' | 'info';
}

const ConfirmModal = forwardRef<HTMLDivElement, ConfirmModalProps>(
  ({
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onClose,
    isLoading = false,
    type = 'warning',
    title,
    description,
    ...props
  }, ref) => {
    const typeConfig = {
      warning: {
        icon: '⚠️',
        confirmVariant: 'primary' as const,
      },
      danger: {
        icon: '🚨',
        confirmVariant: 'destructive' as const,
      },
      info: {
        icon: 'ℹ️',
        confirmVariant: 'primary' as const,
      },
    };

    const config = typeConfig[type];

    return (
      <Modal
        ref={ref}
        onClose={onClose}
        size="sm"
        variant="centered"
        {...props}
      >
        <ModalContent>
          <div className="text-center">
            <div className="text-4xl mb-4">{config.icon}</div>
            {title && (
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-gray-600 mb-6">
                {description}
              </p>
            )}
          </div>
        </ModalContent>
        
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
);

ConfirmModal.displayName = 'ConfirmModal';

export {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ConfirmModal,
};