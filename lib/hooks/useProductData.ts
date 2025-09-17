import { useMemo } from 'react';
import productData from '@/lib/data/products-reorganized.json';

interface ProductData {
  catalogoCompleto: {
    resumoGeral: {
      totalProdutos: number;
      estoqueTotal: number;
      valorTotal: number;
      dataAtualizacao: string;
    };
    categorias: {
      produtosCapilares: CategoryData;
      progressivas: CategoryData;
      cosmeticos: CategoryData;
    };
    analiseEstrategica: {
      distribuicao: {
        porCategoria: Record<string, string>;
        porEstoque: Record<string, string>;
      };
      ticketMedio: Record<string, number>;
      qualidade: {
        ratingMedio: number;
        top5Avaliados: string[];
      };
      recomendacoes: string[];
    };
  };
}

interface CategoryData {
  nome: string;
  descricao: string;
  icone: string;
  resumo: {
    totalProdutos: number;
    estoqueTotal: number;
    valorTotal: number;
    ticketMedio: number;
    participacaoCategoria: string;
    participacaoEstoque: string;
  };
  produtos?: Product[];
  subcategorias?: Record<string, SubcategoryData>;
  destaques: {
    maisBemAvaliado: string;
    maiorEstoque: string;
    melhorCustoBeneficio?: string;
    premium?: string;
    maisPremium?: string;
    maisAcessivel?: string;
  };
}

interface SubcategoryData {
  nome: string;
  totalProdutos: number;
  marcas: string[];
}

interface Product {
  id: string;
  nome: string;
  marca: string;
  preco: number;
  precoOriginal?: number;
  desconto?: string;
  estoque: number;
  rating: number;
  avaliacoes: number;
  categoria: string;
  features: string[];
  images: string[];
}

export const useProductData = () => {
  const data = useMemo(() => {
    return productData as ProductData;
  }, []);

  const getCategoryByKey = (categoryKey: string) => {
    switch (categoryKey) {
      case 'produtos-capilares':
      case 'hidratacao':
        return data.catalogoCompleto.categorias.produtosCapilares;
      case 'progressivas':
      case 'progressivas-alisamentos':
        return data.catalogoCompleto.categorias.progressivas;
      case 'cosmeticos':
      case 'tintas-cabelo':
      case 'relaxamentos':
        return data.catalogoCompleto.categorias.cosmeticos;
      default:
        return null;
    }
  };

  const getAllProducts = () => {
    const { produtosCapilares, progressivas, cosmeticos } = data.catalogoCompleto.categorias;
    return [
      ...(produtosCapilares.produtos || []),
      ...(progressivas.produtos || []),
      // Note: cosmeticos has subcategorias structure, would need to extract products differently
    ];
  };

  const getProductsByCategory = (categoryKey: string) => {
    const category = getCategoryByKey(categoryKey);
    return category?.produtos || [];
  };

  const getProductById = (productId: string) => {
    const allProducts = getAllProducts();
    return allProducts.find(product => product.id === productId);
  };

  const getCategoryStats = () => {
    return data.catalogoCompleto.resumoGeral;
  };

  const getStrategicAnalysis = () => {
    return data.catalogoCompleto.analiseEstrategica;
  };

  return {
    data,
    getCategoryByKey,
    getAllProducts,
    getProductsByCategory,
    getProductById,
    getCategoryStats,
    getStrategicAnalysis,
  };
};

export default useProductData;