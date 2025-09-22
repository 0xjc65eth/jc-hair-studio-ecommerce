'use client';

import { useCart } from '@/lib/stores/cartStore';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotalItems,
  } = useCart();

  const totalItems = getTotalItems();

  // Handle Escape key to close cart
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeCart();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset'; // Restore scrolling
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        aria-describedby="cart-drawer-description"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2
            className="text-lg font-semibold flex items-center gap-2"
            id="cart-drawer-title"
            role="heading"
            aria-level={2}
          >
            <ShoppingCart size={20} aria-hidden="true" />
            Carrinho ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
            aria-label="Fechar carrinho"
            title="Fechar carrinho"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div id="cart-drawer-description" className="sr-only">
            Carrinho de compras com {totalItems} {totalItems === 1 ? 'item' : 'itens'}.
            Use as teclas Tab e Shift+Tab para navegar, Enter para ativar botões, e Escape para fechar.
          </div>
          {items.length === 0 ? (
            <div className="text-center py-8" role="status" aria-live="polite">
              <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" aria-hidden="true" />
              <p className="text-gray-500">Seu carrinho está vazio</p>
              <p className="text-sm text-gray-400 mt-2">Adicione produtos para começar suas compras</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex gap-3 p-3 border rounded-lg">
                  {item.image && (
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    {item.variant && (
                      <p className="text-xs text-gray-500">{item.variant}</p>
                    )}
                    {item.color && (
                      <p className="text-xs text-gray-500">Cor: {item.color}</p>
                    )}
                    {item.size && (
                      <p className="text-xs text-gray-500">Tamanho: {item.size}</p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2" role="group" aria-label={`Controles de quantidade para ${item.name}`}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant, item.color, item.size)}
                          className="p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
                          aria-label={`Diminuir quantidade de ${item.name}`}
                          title="Diminuir quantidade"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} aria-hidden="true" />
                        </button>
                        <span
                          className="text-sm font-medium w-8 text-center"
                          role="status"
                          aria-live="polite"
                          aria-label={`Quantidade: ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant, item.color, item.size)}
                          className="p-1 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50"
                          aria-label={`Aumentar quantidade de ${item.name}`}
                          title="Aumentar quantidade"
                        >
                          <Plus size={14} aria-hidden="true" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeItem(item.id, item.variant, item.color, item.size)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                          aria-label={`Remover ${item.name} do carrinho`}
                          title="Remover item"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4" role="contentinfo" aria-label="Resumo do carrinho">
            <div className="space-y-2" role="group" aria-label="Ações do carrinho">
              <Link href="/carrinho" onClick={closeCart}>
                <Button
                  className="w-full"
                  aria-label="Ver carrinho completo - ir para página do carrinho"
                >
                  Ver Carrinho
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}