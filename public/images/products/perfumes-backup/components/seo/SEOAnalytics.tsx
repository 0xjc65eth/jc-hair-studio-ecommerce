/**
 * SEO Analytics Component - Advanced SEO monitoring and reporting
 * Real-time SEO performance tracking and optimization insights
 */

'use client';

import { useState, useEffect } from 'react';
import { validateSchema, validateMetaTags, generateSEOTestReport, TESTING_TOOLS } from '@/lib/utils/seoTesting';

interface SEOAnalyticsProps {
  pageType: 'product' | 'category' | 'homepage' | 'content';
  schemas?: any[];
  metadata?: any;
  url?: string;
  showInProduction?: boolean;
}

interface SEOScores {
  schema: number;
  meta: number;
  overall: number;
}

export default function SEOAnalytics({
  pageType,
  schemas = [],
  metadata,
  url,
  showInProduction = false
}: SEOAnalyticsProps) {
  const [scores, setScores] = useState<SEOScores>({ schema: 0, meta: 0, overall: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const [validationResults, setValidationResults] = useState<any[]>([]);

  // Only show in development unless explicitly enabled for production
  if (process.env.NODE_ENV === 'production' && !showInProduction) {
    return null;
  }

  useEffect(() => {
    analyzePageSEO();
  }, [schemas, metadata]);

  const analyzePageSEO = () => {
    let totalSchemaScore = 0;
    const schemaResults: any[] = [];

    // Analyze schemas
    if (schemas.length > 0) {
      schemas.forEach(schema => {
        const result = validateSchema(schema);
        schemaResults.push(result);
        totalSchemaScore += result.score;
      });
      totalSchemaScore = totalSchemaScore / schemas.length;
    }

    // Analyze meta tags
    const metaResult = validateMetaTags(
      metadata?.title,
      metadata?.description,
      metadata?.keywords,
      metadata?.openGraph,
      metadata?.twitter
    );

    const overallScore = (totalSchemaScore + metaResult.score) / 2;

    setScores({
      schema: totalSchemaScore,
      meta: metaResult.score,
      overall: overallScore
    });

    setValidationResults([...schemaResults, { type: 'meta', ...metaResult }]);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreText = (score: number) => {
    if (score >= 90) return 'Excelente';
    if (score >= 70) return 'Bom';
    if (score >= 50) return 'Regular';
    return 'Precisa Melhorar';
  };

  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <div className="fixed bottom-4 left-4 max-w-md bg-white border-2 border-indigo-200 rounded-lg shadow-lg z-50">
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 bg-indigo-50 rounded-t-lg cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
          <span className="font-semibold text-indigo-800">SEO Analytics</span>
          <span className="text-xs text-indigo-600">{pageType}</span>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(scores.overall)}`}>
          {Math.round(scores.overall)}/100
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-3 space-y-3 max-h-96 overflow-y-auto">
          {/* Score Overview */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-gray-50 rounded">
              <div className={`text-lg font-bold ${getScoreColor(scores.schema)}`}>
                {Math.round(scores.schema)}
              </div>
              <div className="text-xs text-gray-600">Schema</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className={`text-lg font-bold ${getScoreColor(scores.meta)}`}>
                {Math.round(scores.meta)}
              </div>
              <div className="text-xs text-gray-600">Meta</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className={`text-lg font-bold ${getScoreColor(scores.overall)}`}>
                {Math.round(scores.overall)}
              </div>
              <div className="text-xs text-gray-600">Geral</div>
            </div>
          </div>

          {/* Status */}
          <div className={`p-2 rounded text-center text-sm font-medium ${getScoreColor(scores.overall)}`}>
            Status: {getScoreText(scores.overall)}
          </div>

          {/* Validation Issues */}
          {validationResults.length > 0 && (
            <div className="space-y-2">
              <div className="font-semibold text-gray-800 text-sm">Problemas Encontrados:</div>
              {validationResults.map((result, index) => (
                <div key={index} className="text-xs">
                  <div className="font-medium text-gray-700 mb-1">
                    {result.type === 'meta' ? 'Meta Tags' : `Schema: ${result.type}`}
                  </div>
                  {result.issues?.length > 0 && (
                    <div className="pl-2">
                      {result.issues.slice(0, 3).map((issue: string, i: number) => (
                        <div key={i} className="text-red-600 mb-1">• {issue}</div>
                      ))}
                      {result.issues.length > 3 && (
                        <div className="text-gray-500">+ {result.issues.length - 3} mais</div>
                      )}
                    </div>
                  )}
                  {result.recommendations?.length > 0 && (
                    <div className="pl-2">
                      {result.recommendations.slice(0, 2).map((rec: string, i: number) => (
                        <div key={i} className="text-yellow-600 mb-1">→ {rec}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Testing Tools */}
          <div className="space-y-2">
            <div className="font-semibold text-gray-800 text-sm">Ferramentas de Teste:</div>
            <div className="grid grid-cols-1 gap-1">
              <a
                href={`${TESTING_TOOLS.googleRichResults}?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100 transition-colors"
              >
                🔍 Google Rich Results
              </a>
              <a
                href={`${TESTING_TOOLS.facebookDebugger}/?id=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 bg-indigo-50 text-indigo-700 rounded text-xs hover:bg-indigo-100 transition-colors"
              >
                📘 Facebook Debugger
              </a>
              <a
                href={`${TESTING_TOOLS.googlePageSpeed}/?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 bg-green-50 text-green-700 rounded text-xs hover:bg-green-100 transition-colors"
              >
                ⚡ PageSpeed Insights
              </a>
            </div>
          </div>

          {/* Schema Preview */}
          {schemas.length > 0 && (
            <div className="space-y-2">
              <div className="font-semibold text-gray-800 text-sm">Schemas Detectados:</div>
              <div className="space-y-1">
                {schemas.map((schema, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                    <div className="font-medium">{schema['@type']}</div>
                    {schema.name && (
                      <div className="text-gray-600 truncate">{schema.name}</div>
                    )}
                    {schema.offers?.price && (
                      <div className="text-green-600">€{schema.offers.price}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meta Preview */}
          {metadata && (
            <div className="space-y-2">
              <div className="font-semibold text-gray-800 text-sm">Preview SERP:</div>
              <div className="p-2 bg-gray-50 rounded text-xs">
                <div className="text-blue-600 font-medium truncate">
                  {metadata.title || 'Título não definido'}
                </div>
                <div className="text-green-600 truncate">
                  {currentUrl}
                </div>
                <div className="text-gray-600 text-xs mt-1">
                  {metadata.description || 'Descrição não definida'}
                </div>
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          <div className="space-y-2">
            <div className="font-semibold text-gray-800 text-sm">Métricas:</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• Schemas: {schemas.length} detectados</div>
              <div>• Meta tags: {Object.keys(metadata || {}).length} campos</div>
              <div>• Análise em: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2 border-t">
            <button
              onClick={analyzePageSEO}
              className="flex-1 px-3 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600 transition-colors"
            >
              Reanalizar
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Production-safe SEO monitor (lightweight)
export function SEOMonitor({ pageType, schemaCount = 0, metaComplete = false }: {
  pageType: string;
  schemaCount?: number;
  metaComplete?: boolean;
}) {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg p-2 shadow-sm z-50">
      <div className="flex items-center space-x-2 text-xs">
        <div className={`w-2 h-2 rounded-full ${metaComplete ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
        <span className="text-gray-600">
          SEO: {schemaCount} schemas, {metaComplete ? 'meta OK' : 'meta incomplete'}
        </span>
      </div>
    </div>
  );
}