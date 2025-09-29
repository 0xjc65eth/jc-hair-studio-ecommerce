// Sistema de Filtros e Funcionalidades Especiais
// JC Hair Studio's 62's 62 E-commerce

export { default as FiltrosSistema } from './FiltrosSistema';
export { default as PorQueComprar } from './PorQueComprar';
export { default as WhatsAppButton } from './WhatsAppButton';
export { default as WishlistButton } from './WishlistButton';
export { default as CompareButton, CompareBar } from './CompareButton';
export { default as SocialProof } from './SocialProof';
export { default as CalculadoraFrete } from './CalculadoraFrete';
export { default as ReviewsComFotos } from './ReviewsComFotos';

// Brazilian Catalog Components
export { default as ProgressivasTratamentos } from './ProgressivasTratamentos';
export { default as ShampoosMaquiagem } from './ShampoosMaquiagem';
export { default as EsmaltesCorpo } from './EsmaltesCorpo';

// Re-export types for convenience
export type {
  ProductFilters,
  AdvancedFilters,
  ProductBrand,
  HairTypeFilter,
  WishlistItem,
  ProductComparison,
  ReviewWithPhotos,
  ShippingCalculation,
} from '../../types/product';