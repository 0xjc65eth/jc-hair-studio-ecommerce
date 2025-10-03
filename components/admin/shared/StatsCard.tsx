import { LucideIcon } from 'lucide-react';

/**
 * Props do StatsCard
 */
interface StatsCardProps {
  /**
   * Título do cartão (ex: "Total de Pedidos")
   */
  title: string;

  /**
   * Valor principal a ser exibido (ex: "150" ou "€2,450.00")
   */
  value: string | number;

  /**
   * Informação adicional ou subtítulo (ex: "12 pendentes", "+15% vs mês anterior")
   */
  subtitle?: string;

  /**
   * Ícone do Lucide React a ser exibido
   */
  icon: LucideIcon;

  /**
   * Cor do gradiente (padrão: 'blue')
   * Opções: 'blue', 'green', 'orange', 'purple', 'red', 'pink'
   */
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'pink';

  /**
   * Se está carregando dados (mostra "..." no valor)
   */
  loading?: boolean;

  /**
   * Callback quando o card é clicado (opcional)
   */
  onClick?: () => void;
}

/**
 * StatsCard Component
 *
 * Cartão de estatística reutilizável para dashboard admin.
 * Exibe um valor numérico com ícone, título e informação adicional.
 *
 * Features:
 * - Design com gradiente personalizável
 * - Estado de loading
 * - Ícone personalizado do Lucide React
 * - Subtítulo opcional
 * - Clicável (opcional)
 *
 * @component
 *
 * @example
 * <StatsCard
 *   title="Total de Pedidos"
 *   value={150}
 *   subtitle="12 pendentes"
 *   icon={ShoppingCart}
 *   color="blue"
 * />
 */
export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  loading = false,
  onClick,
}: StatsCardProps) {
  /**
   * Mapa de cores para gradientes
   * Define cores primária e secundária para cada variação
   */
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    pink: 'from-pink-500 to-pink-600',
  };

  /**
   * Mapa de cores para textos e ícones secundários
   */
  const textColorMap = {
    blue: 'text-blue-100',
    green: 'text-green-100',
    orange: 'text-orange-100',
    purple: 'text-purple-100',
    red: 'text-red-100',
    pink: 'text-pink-100',
  };

  /**
   * Mapa de cores para ícones
   */
  const iconColorMap = {
    blue: 'text-blue-200',
    green: 'text-green-200',
    orange: 'text-orange-200',
    purple: 'text-purple-200',
    red: 'text-red-200',
    pink: 'text-pink-200',
  };

  return (
    <div
      className={`
        bg-gradient-to-br ${colorMap[color]}
        rounded-xl p-6 text-white shadow-lg
        ${onClick ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        {/* Conteúdo textual */}
        <div>
          <p className={`${textColorMap[color]} text-sm`}>{title}</p>
          <p className="text-3xl font-bold">
            {loading ? '...' : value}
          </p>
          {subtitle && (
            <p className={`${textColorMap[color]} text-xs mt-2`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Ícone */}
        <Icon className={`w-12 h-12 ${iconColorMap[color]}`} />
      </div>
    </div>
  );
}
