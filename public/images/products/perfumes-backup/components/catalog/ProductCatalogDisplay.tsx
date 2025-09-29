'use client';

import React from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Star, ShoppingCart, TrendingUp, Award } from 'lucide-react';
import { useProductData } from '@/lib/hooks/useProductData';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface ProductCatalogDisplayProps {
  categoryKey?: string;
  showSummary?: boolean;
  showAnalysis?: boolean;
}

export const ProductCatalogDisplay: React.FC<ProductCatalogDisplayProps> = ({
  categoryKey,
  showSummary = true,
  showAnalysis = false,
}) => {
  const { data, getCategoryByKey, getCategoryStats, getStrategicAnalysis } = useProductData();

  if (!data) {
    return <div>Carregando dados dos produtos...</div>;
  }

  const category = categoryKey ? getCategoryByKey(categoryKey) : null;
  const stats = getCategoryStats();
  const analysis = getStrategicAnalysis();

  const renderCategorySummary = (categoryData: any) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{categoryData.icone}</span>
          {categoryData.nome}
          <Badge variant="secondary">{categoryData.resumo.totalProdutos} produtos</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {categoryData.resumo.totalProdutos}
            </div>
            <div className="text-sm text-gray-600">Produtos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {categoryData.resumo.estoqueTotal}
            </div>
            <div className="text-sm text-gray-600">Estoque Total</div>
          </div>
          <div className="text-center">
          </div>
          <div className="text-center">
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">🏆 Destaques da Categoria:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {Object.entries(categoryData.destaques).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <Award size={16} className="text-yellow-500" />
                <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderProductCard = (product: any) => (
    <Card key={product.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="aspect-square mb-3 overflow-hidden rounded-lg">
          <OptimizedImage
            src={product.images[0]}
            alt={product.nome}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2">{product.nome}</h3>
          <p className="text-xs text-gray-600">{product.marca}</p>

          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.avaliacoes})</span>
          </div>


          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Estoque: {product.estoque}</span>
            <ShoppingCart size={16} className="text-blue-500" />
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {product.features.slice(0, 2).map((feature: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderOverallSummary = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="text-blue-500" />
          Visão Geral do Catálogo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.totalProdutos}</div>
            <div className="text-sm text-gray-600">Total de Produtos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.estoqueTotal}</div>
            <div className="text-sm text-gray-600">Estoque Total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStrategicAnalysis = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>📊 Análise Estratégica</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Distribuição por Categoria</h4>
            {Object.entries(analysis.distribuicao.porCategoria).map(([key, value]) => (
              <div key={key} className="flex justify-between mb-2">
                <span className="capitalize">{key}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>

          <div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold mb-3">🏆 Top 5 Mais Bem Avaliados</h4>
          <div className="space-y-2">
            {analysis.qualidade.top5Avaliados.map((product, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="secondary">{index + 1}</Badge>
                <span className="text-sm">{product}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-semibold mb-3">💡 Recomendações Estratégicas</h4>
          <div className="space-y-2">
            {analysis.recomendacoes.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2">
                <Badge variant="secondary">{index + 1}</Badge>
                <span className="text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {showSummary && !category && renderOverallSummary()}
      {showAnalysis && renderStrategicAnalysis()}

      {category ? (
        <div>
          {renderCategorySummary(category)}

          {category.produtos && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Produtos da Categoria</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.produtos.map(renderProductCard)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-6">Todas as Categorias</h2>

          {/* Produtos Capilares */}
          <div className="mb-8">
            {renderCategorySummary(data.catalogoCompleto.categorias.produtosCapilares)}
            {data.catalogoCompleto.categorias.produtosCapilares.produtos && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {data.catalogoCompleto.categorias.produtosCapilares.produtos.map(renderProductCard)}
              </div>
            )}
          </div>

          {/* Progressivas */}
          <div className="mb-8">
            {renderCategorySummary(data.catalogoCompleto.categorias.progressivas)}
            {data.catalogoCompleto.categorias.progressivas.produtos && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {data.catalogoCompleto.categorias.progressivas.produtos.map(renderProductCard)}
              </div>
            )}
          </div>

          {/* Cosméticos */}
          <div className="mb-8">
            {renderCategorySummary(data.catalogoCompleto.categorias.cosmeticos)}
            <div className="text-center py-8 text-gray-500">
              <p>Produtos de cosméticos disponíveis nas subcategorias específicas</p>
              <p className="text-sm">Acesse: Tintas de Cabelo, Relaxamentos, Maquiagem</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCatalogDisplay;