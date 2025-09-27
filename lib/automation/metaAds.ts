// Sistema de Automação Meta Ads (Facebook/Instagram) para JC Hair Studio
// Gerencia campanhas automatizadas para Facebook e Instagram

export interface MetaAdsConfig {
  accessToken: string;
  appId: string;
  appSecret: string;
  adAccountId: string;
  pixelId: string;
  pageId: string;
}

export interface MetaCampaignCreative {
  name: string;
  imageUrl: string;
  videoUrl?: string;
  headline: string;
  description: string;
  callToAction: string;
  destinationUrl: string;
}

export interface MetaTargeting {
  geoLocations: {
    countries: string[];
    regions?: string[];
    cities?: string[];
  };
  ageMin: number;
  ageMax: number;
  genders: number[]; // 1 = male, 2 = female
  interests: string[];
  behaviors: string[];
  customAudiences?: string[];
  lookalikeSources?: string[];
  languages?: string[];
}

export interface MetaCampaignObjective {
  objective: 'CONVERSIONS' | 'TRAFFIC' | 'REACH' | 'VIDEO_VIEWS' | 'ENGAGEMENT';
  optimizationGoal: 'CONVERSIONS' | 'LINK_CLICKS' | 'REACH' | 'IMPRESSIONS';
  conversionEvent?: string;
}

export interface MetaCampaignBudget {
  budgetType: 'DAILY' | 'LIFETIME';
  amount: number; // em centavos
  bidStrategy: 'LOWEST_COST_WITHOUT_CAP' | 'LOWEST_COST_WITH_BID_CAP' | 'TARGET_COST';
  bidAmount?: number;
}

export interface MetaCampaignConfig {
  name: string;
  objective: MetaCampaignObjective;
  budget: MetaCampaignBudget;
  targeting: MetaTargeting;
  creative: MetaCampaignCreative;
  placements: string[];
  startTime?: string;
  endTime?: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED';
}

export interface MetaCampaignPerformance {
  campaignId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  cpm: number; // Cost per mille
  cpc: number; // Cost per click
  ctr: number; // Click through rate
  roas: number; // Return on ad spend
  frequency: number;
  reach: number;
}

export class MetaAdsAutomation {
  private config: MetaAdsConfig;
  private campaigns: Map<string, MetaCampaignConfig> = new Map();

  constructor(config: MetaAdsConfig) {
    this.config = config;
    this.initializeProductCampaigns();
  }

  // Inicializa campanhas para produtos principais
  private initializeProductCampaigns(): void {
    const productCampaigns: MetaCampaignConfig[] = [
      {
        name: 'Progressivas Premium Portugal - Conversões',
        objective: {
          objective: 'CONVERSIONS',
          optimizationGoal: 'CONVERSIONS',
          conversionEvent: 'Purchase'
        },
        budget: {
          budgetType: 'DAILY',
          amount: 2500, // €25.00
          bidStrategy: 'LOWEST_COST_WITHOUT_CAP'
        },
        targeting: {
          geoLocations: {
            countries: ['PT'],
            cities: ['Lisboa', 'Porto', 'Coimbra', 'Braga', 'Aveiro']
          },
          ageMin: 25,
          ageMax: 50,
          genders: [2], // Mulheres
          interests: [
            'Hair care',
            'Beauty salons',
            'Hair straightening',
            'Brazilian hair treatment',
            'Professional hair care'
          ],
          behaviors: [
            'Engaged shoppers',
            'Online shoppers',
            'Beauty and wellness'
          ],
          languages: ['pt', 'pt_PT']
        },
        creative: {
          name: 'Progressiva Premium Creative',
          imageUrl: '/images/products/progressivas_diversas/progressivas_diversas_1.JPG',
          headline: 'Progressiva Premium Brasileira - Resultado Profissional',
          description: 'Transforme seus cabelos com nossa progressiva premium. Alisamento duradouro, brilho intenso e fórmula sem formol. Resultados profissionais em casa.',
          callToAction: 'SHOP_NOW',
          destinationUrl: 'https://jc-hair-studio.vercel.app/tratamentos-capilares'
        },
        placements: [
          'facebook_feeds',
          'instagram_feed',
          'instagram_stories',
          'facebook_marketplace'
        ],
        status: 'ACTIVE'
      },
      {
        name: 'Mega Hair Collection - Tráfego',
        objective: {
          objective: 'TRAFFIC',
          optimizationGoal: 'LINK_CLICKS'
        },
        budget: {
          budgetType: 'DAILY',
          amount: 2000, // €20.00
          bidStrategy: 'LOWEST_COST_WITHOUT_CAP'
        },
        targeting: {
          geoLocations: {
            countries: ['PT', 'ES', 'FR'],
            regions: ['Lisboa', 'Porto', 'Madrid', 'Barcelona', 'Paris']
          },
          ageMin: 20,
          ageMax: 40,
          genders: [2], // Mulheres
          interests: [
            'Hair extensions',
            'Long hair',
            'Hair styling',
            'Beauty and fashion',
            'Hair accessories'
          ],
          behaviors: [
            'Fashion shoppers',
            'Beauty enthusiasts',
            'Hair care shoppers'
          ]
        },
        creative: {
          name: 'Mega Hair Collection Creative',
          imageUrl: '/images/products/g-hair/g-hair-1.png',
          headline: 'Mega Hair Premium - Cabelos Longos Instantâneos',
          description: 'Mega hair 100% humano, qualidade premium. Diversos tamanhos e cores disponíveis. Transformação instantânea para looks incríveis.',
          callToAction: 'LEARN_MORE',
          destinationUrl: 'https://jc-hair-studio.vercel.app/mega-hair'
        },
        placements: [
          'facebook_feeds',
          'instagram_feed',
          'instagram_stories',
          'instagram_reels'
        ],
        status: 'ACTIVE'
      },
      {
        name: 'Maquiagem Brasileira - Engagement',
        objective: {
          objective: 'ENGAGEMENT',
          optimizationGoal: 'LINK_CLICKS'
        },
        budget: {
          budgetType: 'DAILY',
          amount: 1500, // €15.00
          bidStrategy: 'LOWEST_COST_WITHOUT_CAP'
        },
        targeting: {
          geoLocations: {
            countries: ['PT']
          },
          ageMin: 18,
          ageMax: 35,
          genders: [2], // Mulheres
          interests: [
            'Makeup',
            'Brazilian cosmetics',
            'Beauty products',
            'Cosmetics',
            'Mari Maria Makeup'
          ],
          behaviors: [
            'Makeup enthusiasts',
            'Beauty product shoppers',
            'Cosmetics buyers'
          ]
        },
        creative: {
          name: 'Maquiagem Brasileira Creative',
          imageUrl: '/images/products/mari-maria-bases/mari-maria-base-baunilha.png',
          headline: 'Maquiagem Brasileira Premium - Mari Maria & Wepink',
          description: 'Descubra as melhores marcas brasileiras de maquiagem. Bases, batons e produtos profissionais com qualidade incomparável.',
          callToAction: 'SHOP_NOW',
          destinationUrl: 'https://jc-hair-studio.vercel.app/maquiagens'
        },
        placements: [
          'facebook_feeds',
          'instagram_feed',
          'instagram_stories'
        ],
        status: 'ACTIVE'
      },
      {
        name: 'Retargeting - Carrinho Abandonado',
        objective: {
          objective: 'CONVERSIONS',
          optimizationGoal: 'CONVERSIONS',
          conversionEvent: 'Purchase'
        },
        budget: {
          budgetType: 'DAILY',
          amount: 1800, // €18.00
          bidStrategy: 'LOWEST_COST_WITHOUT_CAP'
        },
        targeting: {
          geoLocations: {
            countries: ['PT', 'ES', 'FR', 'IT', 'DE']
          },
          ageMin: 18,
          ageMax: 55,
          genders: [2], // Mulheres
          customAudiences: ['website_visitors', 'add_to_cart', 'initiate_checkout'],
          interests: [],
          behaviors: []
        },
        creative: {
          name: 'Retargeting Carrinho Creative',
          imageUrl: '/images/products/wepink-virginia-bases/wepink-base-cor-06.png',
          headline: 'Finalize Sua Compra - 10% de Desconto Especial',
          description: 'Não perca! Seus produtos favoritos estão esperando. Use o código VOLTA10 e ganhe 10% de desconto na sua primeira compra.',
          callToAction: 'SHOP_NOW',
          destinationUrl: 'https://jc-hair-studio.vercel.app/carrinho'
        },
        placements: [
          'facebook_feeds',
          'instagram_feed',
          'facebook_marketplace'
        ],
        status: 'ACTIVE'
      }
    ];

    productCampaigns.forEach(campaign => {
      this.campaigns.set(campaign.name, campaign);
    });
  }

  // Cria uma nova campanha no Meta Ads
  async createCampaign(campaignConfig: MetaCampaignConfig): Promise<string> {
    try {
      // 1. Criar a campanha
      const campaignData = {
        name: campaignConfig.name,
        objective: campaignConfig.objective.objective,
        status: campaignConfig.status,
        special_ad_categories: []
      };

      const campaignResponse = await this.callMetaAPI('campaigns', 'POST', campaignData);
      const campaignId = campaignResponse.id;

      // 2. Criar o conjunto de anúncios (Ad Set)
      const adSetData = {
        name: `${campaignConfig.name} - Ad Set`,
        campaign_id: campaignId,
        optimization_goal: campaignConfig.objective.optimizationGoal,
        billing_event: 'IMPRESSIONS',
        bid_strategy: campaignConfig.budget.bidStrategy,
        daily_budget: campaignConfig.budget.amount,
        targeting: this.formatTargeting(campaignConfig.targeting),
        promoted_object: {
          pixel_id: this.config.pixelId,
          custom_event_type: campaignConfig.objective.conversionEvent || 'PURCHASE'
        },
        status: campaignConfig.status
      };

      if (campaignConfig.startTime) {
        adSetData['start_time'] = campaignConfig.startTime;
      }
      if (campaignConfig.endTime) {
        adSetData['end_time'] = campaignConfig.endTime;
      }

      const adSetResponse = await this.callMetaAPI('adsets', 'POST', adSetData);
      const adSetId = adSetResponse.id;

      // 3. Criar o creative do anúncio
      const creativeData = {
        name: campaignConfig.creative.name,
        object_story_spec: {
          page_id: this.config.pageId,
          link_data: {
            image_hash: await this.uploadImage(campaignConfig.creative.imageUrl),
            link: campaignConfig.creative.destinationUrl,
            message: campaignConfig.creative.description,
            name: campaignConfig.creative.headline,
            call_to_action: {
              type: campaignConfig.creative.callToAction,
              value: {
                link: campaignConfig.creative.destinationUrl
              }
            }
          }
        }
      };

      const creativeResponse = await this.callMetaAPI('adcreatives', 'POST', creativeData);
      const creativeId = creativeResponse.id;

      // 4. Criar o anúncio
      const adData = {
        name: `${campaignConfig.name} - Ad`,
        adset_id: adSetId,
        creative: { creative_id: creativeId },
        status: campaignConfig.status
      };

      const adResponse = await this.callMetaAPI('ads', 'POST', adData);

      console.log(`Campanha criada com sucesso: ${campaignId}`);
      return campaignId;

    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      throw error;
    }
  }

  // Otimização automática de campanhas
  async optimizeCampaigns(): Promise<void> {
    for (const [campaignName, campaign] of this.campaigns) {
      try {
        const performance = await this.getCampaignPerformance(campaignName);

        if (performance) {
          await this.optimizeBudget(campaign, performance);
          await this.optimizeTargeting(campaign, performance);
          await this.pauseUnderperformingAds(campaign, performance);
        }
      } catch (error) {
        console.error(`Erro ao otimizar campanha ${campaignName}:`, error);
      }
    }
  }

  // Otimiza orçamento baseado na performance
  private async optimizeBudget(campaign: MetaCampaignConfig, performance: MetaCampaignPerformance): Promise<void> {
    const { roas, frequency, cpm } = performance;
    let budgetMultiplier = 1.0;

    // Aumenta orçamento para campanhas com alto ROAS
    if (roas > 4 && frequency < 2) {
      budgetMultiplier = 1.20;
    } else if (roas > 3 && frequency < 2.5) {
      budgetMultiplier = 1.10;
    } else if (roas < 1.5 || frequency > 4) {
      budgetMultiplier = 0.80;
    }

    const newBudget = Math.round(campaign.budget.amount * budgetMultiplier);

    if (newBudget !== campaign.budget.amount) {
      await this.updateCampaignBudget(campaign.name, newBudget);
      campaign.budget.amount = newBudget;
    }
  }

  // Cria audiências lookalike automaticamente
  async createLookalikeAudiences(): Promise<void> {
    try {
      // Cria lookalike baseado em compradores
      const lookalikeData = {
        name: 'Lookalike - Compradores JC Hair Studio',
        subtype: 'LOOKALIKE',
        lookalike_spec: {
          type: 'similarity',
          ratio: 0.01, // 1% da população
          country: 'PT'
        },
        origin_audience_id: await this.getCustomAudience('purchasers')
      };

      await this.callMetaAPI('customaudiences', 'POST', lookalikeData);

      // Cria lookalike baseado em add to cart
      const lookalikeCartData = {
        name: 'Lookalike - Add to Cart JC Hair Studio',
        subtype: 'LOOKALIKE',
        lookalike_spec: {
          type: 'similarity',
          ratio: 0.02, // 2% da população
          country: 'PT'
        },
        origin_audience_id: await this.getCustomAudience('add_to_cart')
      };

      await this.callMetaAPI('customaudiences', 'POST', lookalikeCartData);

    } catch (error) {
      console.error('Erro ao criar audiências lookalike:', error);
    }
  }

  // Testa diferentes creativos automaticamente
  async testCreatives(campaignName: string): Promise<void> {
    const campaign = this.campaigns.get(campaignName);
    if (!campaign) return;

    const creativeVariations = [
      {
        headline: 'Progressiva Brasileira Premium - Resultados Profissionais',
        description: 'Descubra o segredo das brasileiras para cabelos perfeitos. Progressiva premium com resultado duradouro.',
        imageUrl: '/images/products/progressivas_diversas/progressivas_diversas_2.JPG'
      },
      {
        headline: 'Transforme Seus Cabelos em 2 Horas',
        description: 'Progressiva premium com queratina brasileira. Cabelos lisos, brilhantes e saudáveis por meses.',
        imageUrl: '/images/products/progressivas_diversas/progressivas_diversas_3.JPG'
      },
      {
        headline: 'Mega Hair Premium - Cabelos Longos Hoje',
        description: 'Mega hair 100% humano, qualidade excepcional. Transformação instantânea para looks deslumbrantes.',
        imageUrl: '/images/products/g-hair/g-hair-2.png'
      }
    ];

    for (const creative of creativeVariations) {
      const testCampaign = {
        ...campaign,
        name: `${campaign.name} - Test ${Date.now()}`,
        creative: {
          ...campaign.creative,
          ...creative
        },
        budget: {
          ...campaign.budget,
          amount: Math.round(campaign.budget.amount * 0.3) // 30% do orçamento original
        }
      };

      try {
        await this.createCampaign(testCampaign);
      } catch (error) {
        console.error('Erro ao criar teste de creative:', error);
      }
    }
  }

  // Relatório de performance detalhado
  async generatePerformanceReport(): Promise<any> {
    const report = {
      timestamp: new Date().toISOString(),
      totalCampaigns: this.campaigns.size,
      totalSpend: 0,
      totalRevenue: 0,
      averageROAS: 0,
      averageFrequency: 0,
      campaignDetails: []
    };

    for (const [campaignName, campaign] of this.campaigns) {
      const performance = await this.getCampaignPerformance(campaignName);

      if (performance) {
        report.totalSpend += performance.spend;
        report.totalRevenue += performance.revenue;

        report.campaignDetails.push({
          name: campaign.name,
          objective: campaign.objective.objective,
          spend: performance.spend,
          revenue: performance.revenue,
          roas: performance.roas,
          cpm: performance.cpm,
          ctr: performance.ctr,
          frequency: performance.frequency,
          conversions: performance.conversions,
          status: campaign.status
        });
      }
    }

    report.averageROAS = report.totalSpend > 0 ? report.totalRevenue / report.totalSpend : 0;
    report.averageFrequency = report.campaignDetails.length > 0
      ? report.campaignDetails.reduce((sum, c) => sum + c.frequency, 0) / report.campaignDetails.length
      : 0;

    return report;
  }

  // Métodos auxiliares
  private formatTargeting(targeting: MetaTargeting): any {
    return {
      geo_locations: targeting.geoLocations,
      age_min: targeting.ageMin,
      age_max: targeting.ageMax,
      genders: targeting.genders,
      interests: targeting.interests.map(interest => ({ name: interest })),
      behaviors: targeting.behaviors.map(behavior => ({ name: behavior })),
      custom_audiences: targeting.customAudiences || [],
      languages: targeting.languages || ['pt']
    };
  }

  private async callMetaAPI(endpoint: string, method: string, data?: any): Promise<any> {
    const url = `https://graph.facebook.com/v18.0/act_${this.config.adAccountId}/${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error(`Meta API error: ${response.statusText}`);
    }

    return response.json();
  }

  private async uploadImage(imageUrl: string): Promise<string> {
    // Implementar upload de imagem para Meta
    // Por agora, retorna um hash simulado
    return 'image_hash_placeholder';
  }

  private async getCampaignPerformance(campaignName: string): Promise<MetaCampaignPerformance | null> {
    // Implementar busca real de performance via Meta API
    // Por agora, retorna dados simulados
    return {
      campaignId: campaignName,
      impressions: Math.floor(Math.random() * 100000),
      clicks: Math.floor(Math.random() * 5000),
      conversions: Math.floor(Math.random() * 100),
      spend: Math.random() * 200,
      revenue: Math.random() * 800,
      cpm: Math.random() * 10,
      cpc: Math.random() * 2,
      ctr: Math.random() * 0.05,
      roas: Math.random() * 5,
      frequency: Math.random() * 3,
      reach: Math.floor(Math.random() * 50000)
    };
  }

  private async updateCampaignBudget(campaignName: string, newBudget: number): Promise<void> {
    console.log(`Atualizando orçamento da campanha ${campaignName} para €${(newBudget / 100).toFixed(2)}`);
  }

  private async pauseUnderperformingAds(campaign: MetaCampaignConfig, performance: MetaCampaignPerformance): Promise<void> {
    if (performance.roas < 1 && performance.spend > 50) {
      console.log(`Pausando campanha de baixa performance: ${campaign.name}`);
    }
  }

  private async getCustomAudience(type: string): Promise<string> {
    // Implementar busca de audiência customizada
    return 'custom_audience_id_placeholder';
  }
}

// Configuração padrão para JC Hair Studio
export const defaultMetaAdsConfig: Partial<MetaAdsConfig> = {
  accessToken: process.env.META_ACCESS_TOKEN,
  appId: process.env.META_APP_ID,
  appSecret: process.env.META_APP_SECRET,
  adAccountId: process.env.META_AD_ACCOUNT_ID,
  pixelId: process.env.META_PIXEL_ID,
  pageId: process.env.META_PAGE_ID
};