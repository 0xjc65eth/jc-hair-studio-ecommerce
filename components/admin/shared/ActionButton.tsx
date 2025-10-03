import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * Props do ActionButton
 */
interface ActionButtonProps {
  /**
   * Ícone do Lucide React
   */
  icon: LucideIcon;

  /**
   * Texto do botão
   */
  label: string;

  /**
   * Callback ao clicar
   */
  onClick: () => void;

  /**
   * Variante do botão (padrão: 'default')
   */
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';

  /**
   * Tamanho do botão (padrão: 'sm')
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Se o botão está desabilitado
   */
  disabled?: boolean;

  /**
   * Se está carregando (mostra ícone de loading)
   */
  loading?: boolean;

  /**
   * Classe CSS adicional
   */
  className?: string;
}

/**
 * ActionButton Component
 *
 * Botão de ação reutilizável com ícone.
 * Wrapper do componente Button do UI com suporte a ícones.
 *
 * Features:
 * - Ícone personalizado
 * - Estado de loading
 * - Múltiplas variantes e tamanhos
 * - Totalmente acessível
 *
 * @component
 *
 * @example
 * <ActionButton
 *   icon={Download}
 *   label="Exportar"
 *   onClick={handleExport}
 *   variant="outline"
 * />
 */
export function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant = 'default',
  size = 'sm',
  disabled = false,
  loading = false,
  className = '',
}: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      className={`flex items-center gap-2 ${className}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Icon className="w-4 h-4" />
      )}
      {label}
    </Button>
  );
}
