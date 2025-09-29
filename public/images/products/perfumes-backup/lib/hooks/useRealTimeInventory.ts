'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useToast } from './useToast'

interface InventoryUpdate {
  productId: string
  stock: number
  reserved: number
  lastUpdated: string
}

interface UseRealTimeInventoryReturn {
  stock: number
  isConnected: boolean
  error: string | null
  reconnect: () => void
}

export function useRealTimeInventory(productId: string): UseRealTimeInventoryReturn {
  const [stock, setStock] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { showToast } = useToast()

  const connectWebSocket = useCallback(() => {
    try {
      // Use secure WebSocket in production
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${wsProtocol}//${window.location.host}/api/ws/inventory/${productId}`
      
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        setIsConnected(true)
        setError(null)
        console.log(`🔌 Connected to inventory feed for product ${productId}`)
      }

      wsRef.current.onmessage = (event) => {
        try {
          const update: InventoryUpdate = JSON.parse(event.data)
          
          if (update.productId === productId) {
            const previousStock = stock
            setStock(update.stock)

            // Show toast if stock changed significantly
            if (previousStock > 0 && update.stock === 0) {
              showToast({
                type: 'warning',
                message: 'Este produto acabou de sair de estoque!'
              })
            } else if (previousStock === 0 && update.stock > 0) {
              showToast({
                type: 'success', 
                message: 'Produto voltou ao estoque!'
              })
            } else if (update.stock < 5 && update.stock < previousStock) {
              showToast({
                type: 'info',
                message: `Restam apenas ${update.stock} unidades em estoque`
              })
            }
          }
        } catch (err) {
          console.error('Error parsing inventory update:', err)
        }
      }

      wsRef.current.onclose = (event) => {
        setIsConnected(false)
        
        // Reconnect automatically if not closed intentionally
        if (event.code !== 1000 && event.code !== 1001) {
          setError('Conexão perdida. Tentando reconectar...')
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket()
          }, 3000)
        }
      }

      wsRef.current.onerror = (event) => {
        setError('Erro na conexão com atualizações de estoque')
        setIsConnected(false)
        console.error('WebSocket error:', event)
      }

    } catch (err) {
      setError('Falha ao conectar com atualizações de estoque')
      console.error('Failed to connect WebSocket:', err)
    }
  }, [productId, stock, showToast])

  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
    }
    connectWebSocket()
  }, [connectWebSocket])

  // Connect on mount
  useEffect(() => {
    if (productId) {
      connectWebSocket()
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted')
      }
    }
  }, [productId, connectWebSocket])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted')
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])

  return {
    stock,
    isConnected,
    error,
    reconnect
  }
}

// Hook for multiple products inventory
export function useRealTimeInventoryBatch(productIds: string[]) {
  const [inventoryMap, setInventoryMap] = useState<Record<string, number>>({})
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const connectWebSocket = useCallback(() => {
    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${wsProtocol}//${window.location.host}/api/ws/inventory/batch`
      
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        setIsConnected(true)
        setError(null)

        // Subscribe to specific products
        if (productIds.length > 0) {
          wsRef.current?.send(JSON.stringify({
            action: 'subscribe',
            productIds: productIds
          }))
        }
      }

      wsRef.current.onmessage = (event) => {
        try {
          const updates: InventoryUpdate[] = JSON.parse(event.data)
          
          setInventoryMap(prev => {
            const newMap = { ...prev }
            updates.forEach(update => {
              newMap[update.productId] = update.stock
            })
            return newMap
          })
        } catch (err) {
          console.error('Error parsing batch inventory update:', err)
        }
      }

      wsRef.current.onclose = () => {
        setIsConnected(false)
        setTimeout(() => connectWebSocket(), 3000)
      }

      wsRef.current.onerror = () => {
        setError('Erro na conexão com atualizações de estoque')
        setIsConnected(false)
      }

    } catch (err) {
      setError('Falha ao conectar com atualizações de estoque')
      console.error('Failed to connect batch WebSocket:', err)
    }
  }, [productIds])

  useEffect(() => {
    if (productIds.length > 0) {
      connectWebSocket()
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted')
      }
    }
  }, [productIds, connectWebSocket])

  return {
    inventoryMap,
    isConnected,
    error,
    getStock: (productId: string) => inventoryMap[productId] || 0
  }
}