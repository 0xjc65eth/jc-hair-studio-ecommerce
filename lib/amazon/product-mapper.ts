import { AMAZON_CATEGORIES, AMAZON_PRODUCT_TYPES } from './config';

interface UnifiedProduct {
  id: string;
  name: string;
  brand: string;
  description: string;
  images: string[];
  price?: number;
  preco_eur?: number;
  stock?: number;
  category?: string;
  shade?: string;
  size?: string;
  weight?: string;
}

interface AmazonProductListing {
  sku: string;
  productType: string;
  attributes: {
    item_name: [{
      value: string;
      language_tag: string;
    }];
    brand: [{
      value: string;
    }];
    description: [{
      value: string;
      language_tag: string;
    }];
    bullet_point: [{
      value: string;
      language_tag: string;
    }][];
    main_product_image_locator: [{
      media_location: string;
    }];
    other_product_image_locator: [{
      media_location: string;
    }][];
    list_price: [{
      Amount: number;
      CurrencyCode: string;
    }];
    fulfillment_availability: [{
      fulfillment_channel_code: string;
      quantity: number;
    }];
    product_category: [{
      value: string;
    }];
    generic_keyword: [{
      value: string;
      language_tag: string;
    }][];
    item_weight: [{
      value: number;
      unit: string;
    }];
    item_dimensions: [{
      length: { value: number; unit: string; };
      width: { value: number; unit: string; };
      height: { value: number; unit: string; };
    }];
  };
}

export class AmazonProductMapper {
  static mapProductToAmazonListing(product: UnifiedProduct): AmazonProductListing {
    // Determine Amazon product type based on category
    let productType = AMAZON_PRODUCT_TYPES.BEAUTY;
    let category = AMAZON_CATEGORIES.HAIR_CARE;

    if (product.category?.includes('mega-hair')) {
      category = AMAZON_CATEGORIES.HAIR_EXTENSIONS;
    } else if (product.category?.includes('tinta')) {
      category = AMAZON_CATEGORIES.HAIR_TREATMENTS;
    } else if (product.category?.includes('esmalte')) {
      category = AMAZON_CATEGORIES.NAIL_POLISH;
    } else if (product.category?.includes('maquiagem')) {
      category = AMAZON_CATEGORIES.MAKEUP;
    } else if (product.category?.includes('perfume')) {
      category = AMAZON_CATEGORIES.PERFUMES;
    }

    // Create bullet points from product details
    const bulletPoints = [
      `Categoria: ${product.category}`,
      product.brand ? `Marca: ${product.brand}` : null,
      product.shade ? `Cor/Tom: ${product.shade}` : null,
      product.size ? `Tamanho: ${product.size}` : null,
      product.weight ? `Peso: ${product.weight}` : null
    ].filter(Boolean).map(point => ({
      value: point!,
      language_tag: 'pt_BR'
    }));

    // Generate keywords from product data
    const keywords = [
      product.name.split(' '),
      product.category ? product.category.split('-') : [],
      product.brand ? [product.brand] : [],
      product.shade ? [product.shade] : [],
      ['cabelo', 'hair', 'beleza', 'beauty']
    ].flat().filter(Boolean).map(keyword => ({
      value: keyword,
      language_tag: 'pt_BR'
    }));

    return {
      sku: product.id,
      productType: productType,
      attributes: {
        item_name: [{
          value: product.name,
          language_tag: 'pt_BR'
        }],
        brand: [{
          value: product.brand || 'JC Hair Studio'
        }],
        description: [{
          value: product.description || `${product.name} - Produto de alta qualidade para cuidados capilares.`,
          language_tag: 'pt_BR'
        }],
        bullet_point: [bulletPoints],
        main_product_image_locator: [{
          media_location: product.images[0] || ''
        }],
        other_product_image_locator: product.images ?
          product.images.slice(1).map(img => ({ media_location: img })) : [],
        list_price: [{
          Amount: product.price || product.preco_eur || 0,
          CurrencyCode: 'BRL'
        }],
        fulfillment_availability: [{
          fulfillment_channel_code: 'MERCHANT',
          quantity: product.stock || 100
        }],
        product_category: [{
          value: category
        }],
        generic_keyword: [keywords],
        item_weight: product.weight ? [{
          value: parseFloat(product.weight.replace(/[^\d.]/g, '')) || 0,
          unit: 'grams'
        }] : [{
          value: 100,
          unit: 'grams'
        }],
        item_dimensions: [{
          length: { value: 10, unit: 'centimeters' },
          width: { value: 5, unit: 'centimeters' },
          height: { value: 15, unit: 'centimeters' }
        }]
      }
    };
  }

  static createInventoryFeed(products: UnifiedProduct[]): string {
    const headers = [
      'sku',
      'quantity',
      'price',
      'minimum-seller-allowed-price',
      'maximum-seller-allowed-price',
      'item-condition',
      'quantity-in-stock',
      'handling-time'
    ];

    const rows = products.map(product => {
      const price = product.price || product.preco_eur || 0;
      const stock = product.stock || 100;
      return [
        product.id,
        stock,
        price.toFixed(2),
        (price * 0.8).toFixed(2), // 20% below list price
        (price * 1.2).toFixed(2), // 20% above list price
        'New',
        stock,
        '2' // 2 days handling time
      ];
    });

    return [
      headers.join('\t'),
      ...rows.map(row => row.join('\t'))
    ].join('\n');
  }

  static createProductFeed(products: UnifiedProduct[]): string {
    const headers = [
      'sku',
      'product-id',
      'product-id-type',
      'item-condition',
      'price',
      'quantity',
      'product-name',
      'product-description',
      'brand-name',
      'item-type-keyword',
      'main-image-url',
      'other-image-url1',
      'other-image-url2',
      'other-image-url3',
      'parent-child',
      'relationship-type',
      'variation-theme',
      'size',
      'color',
      'material',
      'target-audience'
    ];

    const rows = products.map(product => {
      const price = product.price || product.preco_eur || 0;
      const stock = product.stock || 100;
      return [
        product.id,
        '', // Product ID (EAN/UPC) - needs to be provided
        '', // Product ID type
        'New',
        price.toFixed(2),
        stock,
        product.name,
        product.description || `${product.name} - Produto de alta qualidade`,
        product.brand || 'JC Hair Studio',
        this.getItemTypeKeyword(product.category),
        product.images?.[0] || '',
        product.images?.[1] || '',
        product.images?.[2] || '',
        product.images?.[3] || '',
        'Parent', // For variation products
        'Variation',
        'ColorSize',
        product.size || '',
        product.shade || '',
        'Hair Extensions',
        'Women'
      ];
    });

    return [
      headers.join('\t'),
      ...rows.map(row => row.join('\t'))
    ].join('\n');
  }

  private static getItemTypeKeyword(category?: string): string {
    if (!category) return 'hair-care';

    if (category.includes('mega-hair')) return 'hair-extensions';
    if (category.includes('tinta')) return 'hair-color';
    if (category.includes('esmalte')) return 'nail-polish';
    if (category.includes('maquiagem')) return 'makeup';
    if (category.includes('perfume')) return 'perfume';

    return 'hair-care';
  }
}