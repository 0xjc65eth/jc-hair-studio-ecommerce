/**
 * Props do StatusBadge
 */
interface StatusBadgeProps {
  /**
   * Status do pedido
   */
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | string;

  /**
   * Tamanho do badge (padrão: 'md')
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Se deve mostrar ícone (padrão: false)
   */
  showIcon?: boolean;
}

/**
 * StatusBadge Component
 *
 * Badge visual para exibir status de pedidos com cores semânticas.
 *
 * Features:
 * - Cores automáticas baseadas no status
 * - Múltiplos tamanhos
 * - Tradução automática PT-BR
 * - Ícone opcional
 *
 * Cores por status:
 * - pending: amarelo (aguardando)
 * - processing: azul (em processamento)
 * - shipped: roxo (enviado)
 * - delivered: verde (entregue)
 * - cancelled: vermelho (cancelado)
 *
 * @component
 *
 * @example
 * <StatusBadge status="pending" />
 * <StatusBadge status="delivered" size="lg" showIcon />
 */
export function StatusBadge({
  status,
  size = 'md',
  showIcon = false,
}: StatusBadgeProps) {
  /**
   * Mapa de estilos por status
   * Define cores de fundo, texto e borda
   */
  const statusStyles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    default: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  /**
   * Tradução de status para PT-BR
   */
  const statusLabels: Record<string, string> = {
    pending: 'Pendente',
    processing: 'Processando',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  };

  /**
   * Ícones por status (usando emoji simples)
   */
  const statusIcons: Record<string, string> = {
    pending: '⏳',
    processing: '🔄',
    shipped: '📦',
    delivered: '✅',
    cancelled: '❌',
  };

  /**
   * Tamanhos de texto e padding
   */
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  // Determinar estilo com fallback para 'default'
  const style = statusStyles[status] || statusStyles.default;
  const label = statusLabels[status] || status;
  const icon = statusIcons[status];

  return (
    <span
      className={`
        inline-flex items-center gap-1
        ${style}
        ${sizeClasses[size]}
        font-semibold rounded-full border
      `}
    >
      {showIcon && icon && <span>{icon}</span>}
      {label}
    </span>
  );
}
