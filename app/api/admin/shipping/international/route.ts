import { NextRequest, NextResponse } from 'next/server';

/**
 * International Shipping Compliance API
 * GET /api/admin/shipping/international - Get international shipping requirements
 * POST /api/admin/shipping/international/customs - Generate customs documentation
 * GET /api/admin/shipping/international/restrictions - Check shipping restrictions
 */

interface CustomsItem {
  description: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  weight: number;
  hsCode?: string;
  originCountry: string;
  category: string;
}

interface CustomsDeclaration {
  orderId: string;
  recipient: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
    email?: string;
    taxId?: string;
  };
  sender: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    email: string;
    taxId?: string;
  };
  items: CustomsItem[];
  shippingCost: number;
  insuranceValue?: number;
  currency: string;
  purpose: 'gift' | 'commercial' | 'sample' | 'return' | 'personal';
  totalValue: number;
  totalWeight: number;
}

/**
 * GET - Get international shipping requirements and restrictions
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destinationCountry = searchParams.get('country');
    const action = searchParams.get('action') || 'requirements';

    if (!destinationCountry) {
      return NextResponse.json(
        { error: 'Missing destination country parameter' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'requirements':
        return getShippingRequirements(destinationCountry);
      case 'restrictions':
        return getShippingRestrictions(destinationCountry);
      case 'duties':
        return getDutiesAndTaxes(destinationCountry);
      default:
        return getShippingRequirements(destinationCountry);
    }

  } catch (error) {
    console.error('Error in international shipping API:', error);
    return NextResponse.json(
      { error: 'Failed to get international shipping information' },
      { status: 500 }
    );
  }
}

/**
 * POST - Generate customs documentation
 */
export async function POST(request: NextRequest) {
  try {
    const customsData: CustomsDeclaration = await request.json();

    if (!customsData.orderId || !customsData.recipient || !customsData.items) {
      return NextResponse.json(
        { error: 'Missing required customs data' },
        { status: 400 }
      );
    }

    // Validate destination country
    const restrictions = await getCountryRestrictions(customsData.recipient.country);
    const prohibitedItems = checkProhibitedItems(customsData.items, restrictions.prohibited);

    if (prohibitedItems.length > 0) {
      return NextResponse.json(
        {
          error: 'Order contains prohibited items for destination country',
          prohibitedItems,
          restrictions: restrictions.prohibited
        },
        { status: 400 }
      );
    }

    // Generate customs forms
    const customsForms = await generateCustomsForms(customsData);

    // Calculate duties and taxes
    const dutiesAndTaxes = await calculateDutiesAndTaxes(customsData);

    // Generate commercial invoice if needed
    const commercialInvoice = customsData.totalValue > 50 || customsData.purpose === 'commercial'
      ? await generateCommercialInvoice(customsData)
      : null;

    // Check for additional requirements
    const additionalDocs = await getAdditionalDocuments(customsData);

    return NextResponse.json({
      success: true,
      orderId: customsData.orderId,
      customsForms,
      commercialInvoice,
      dutiesAndTaxes,
      additionalDocuments: additionalDocs,
      estimatedClearanceTime: getEstimatedClearanceTime(customsData.recipient.country),
      warnings: generateShippingWarnings(customsData),
      tracking: {
        customsTrackingEnabled: true,
        estimatedClearance: getEstimatedClearanceDate(customsData.recipient.country)
      }
    });

  } catch (error) {
    console.error('Error generating customs documentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate customs documentation' },
      { status: 500 }
    );
  }
}

/**
 * Get shipping requirements for a country
 */
function getShippingRequirements(country: string) {
  const requirements = getCountryRequirements(country);

  return NextResponse.json({
    success: true,
    country,
    requirements: {
      customsDeclaration: requirements.customsDeclaration,
      commercialInvoice: requirements.commercialInvoice,
      certificateOfOrigin: requirements.certificateOfOrigin,
      additionalDocuments: requirements.additionalDocuments,
      maxValue: requirements.maxValue,
      prohibitedItems: requirements.prohibited,
      restrictedItems: requirements.restricted,
      dutyFreeThreshold: requirements.dutyFreeThreshold,
      taxRate: requirements.taxRate,
      processingTime: requirements.processingTime
    },
    supportedCarriers: getSupportedCarriers(country),
    estimatedDeliveryTime: getEstimatedDeliveryTime(country)
  });
}

/**
 * Get shipping restrictions for a country
 */
function getShippingRestrictions(country: string) {
  const restrictions = getCountryRestrictions(country);

  return NextResponse.json({
    success: true,
    country,
    restrictions: {
      prohibited: restrictions.prohibited,
      restricted: restrictions.restricted,
      maxWeight: restrictions.maxWeight,
      maxDimensions: restrictions.maxDimensions,
      maxValue: restrictions.maxValue,
      requiresLicense: restrictions.requiresLicense,
      additionalFees: restrictions.additionalFees
    },
    cosmetics: {
      allowed: restrictions.cosmeticsAllowed,
      requirements: restrictions.cosmeticsRequirements,
      labeling: restrictions.cosmeticsLabeling,
      testing: restrictions.cosmeticsTesting
    }
  });
}

/**
 * Get duties and taxes information
 */
function getDutiesAndTaxes(country: string) {
  const taxInfo = getCountryTaxInfo(country);

  return NextResponse.json({
    success: true,
    country,
    taxation: {
      dutyFreeThreshold: taxInfo.dutyFreeThreshold,
      dutyRate: taxInfo.dutyRate,
      vatRate: taxInfo.vatRate,
      handlingFee: taxInfo.handlingFee,
      currency: taxInfo.currency,
      calculationMethod: taxInfo.calculationMethod
    },
    examples: generateTaxExamples(taxInfo)
  });
}

/**
 * Get country-specific requirements
 */
function getCountryRequirements(country: string) {
  const requirements: { [key: string]: any } = {
    'US': {
      customsDeclaration: true,
      commercialInvoice: true,
      certificateOfOrigin: false,
      additionalDocuments: ['FDA compliance for cosmetics'],
      maxValue: 2500,
      prohibited: ['Liquids over 100ml in personal care', 'Aerosols'],
      restricted: ['Professional hair chemicals', 'Certain preservatives'],
      dutyFreeThreshold: 20,
      taxRate: 6.5,
      processingTime: '2-5 days'
    },
    'GB': {
      customsDeclaration: true,
      commercialInvoice: true,
      certificateOfOrigin: false,
      additionalDocuments: ['UKCA marking for cosmetics'],
      maxValue: 1000,
      prohibited: ['Certain chemicals', 'Unlabeled cosmetics'],
      restricted: ['Professional treatments'],
      dutyFreeThreshold: 15,
      taxRate: 20,
      processingTime: '1-3 days'
    },
    'DE': {
      customsDeclaration: true,
      commercialInvoice: true,
      certificateOfOrigin: false,
      additionalDocuments: ['CE marking', 'INCI labeling'],
      maxValue: 1000,
      prohibited: ['Certain preservatives', 'Unlicensed chemicals'],
      restricted: ['Professional salon products'],
      dutyFreeThreshold: 22,
      taxRate: 19,
      processingTime: '1-2 days'
    },
    'BR': {
      customsDeclaration: true,
      commercialInvoice: true,
      certificateOfOrigin: true,
      additionalDocuments: ['ANVISA registration', 'Portuguese labeling'],
      maxValue: 500,
      prohibited: ['Unlicensed cosmetics', 'Certain chemicals'],
      restricted: ['Professional treatments', 'Imported cosmetics'],
      dutyFreeThreshold: 50,
      taxRate: 60,
      processingTime: '5-15 days'
    },
    'AU': {
      customsDeclaration: true,
      commercialInvoice: true,
      certificateOfOrigin: false,
      additionalDocuments: ['TGA compliance', 'ACCC labeling'],
      maxValue: 1000,
      prohibited: ['Certain preservatives', 'Unlabeled products'],
      restricted: ['Professional chemicals', 'Therapeutic goods'],
      dutyFreeThreshold: 1000,
      taxRate: 10,
      processingTime: '2-7 days'
    }
  };

  return requirements[country] || {
    customsDeclaration: true,
    commercialInvoice: true,
    certificateOfOrigin: false,
    additionalDocuments: [],
    maxValue: 1000,
    prohibited: [],
    restricted: [],
    dutyFreeThreshold: 22,
    taxRate: 20,
    processingTime: '3-7 days'
  };
}

/**
 * Get country restrictions
 */
function getCountryRestrictions(country: string) {
  const restrictions: { [key: string]: any } = {
    'US': {
      prohibited: ['Aerosols', 'Flammable liquids', 'Unlabeled cosmetics'],
      restricted: ['Professional chemicals', 'Certain preservatives'],
      maxWeight: 30,
      maxDimensions: { length: 108, width: 108, height: 108 },
      maxValue: 2500,
      requiresLicense: ['Professional treatments'],
      additionalFees: { handling: 5, inspection: 15 },
      cosmeticsAllowed: true,
      cosmeticsRequirements: ['FDA compliance', 'English labeling'],
      cosmeticsLabeling: ['INCI names', 'Ingredients list', 'Warnings'],
      cosmeticsTesting: 'Not required for most products'
    },
    'GB': {
      prohibited: ['Certain chemicals', 'Unlabeled products'],
      restricted: ['Professional treatments'],
      maxWeight: 30,
      maxDimensions: { length: 150, width: 80, height: 80 },
      maxValue: 1000,
      requiresLicense: [],
      additionalFees: { handling: 8 },
      cosmeticsAllowed: true,
      cosmeticsRequirements: ['UKCA marking', 'English labeling'],
      cosmeticsLabeling: ['INCI names', 'Responsible person details'],
      cosmeticsTesting: 'Animal testing banned'
    },
    'AU': {
      prohibited: ['Quarantine materials', 'Unlicensed therapeutics'],
      restricted: ['Professional chemicals', 'TGA regulated items'],
      maxWeight: 30,
      maxDimensions: { length: 105, width: 105, height: 105 },
      maxValue: 1000,
      requiresLicense: ['Therapeutic goods'],
      additionalFees: { handling: 10, quarantine: 20 },
      cosmeticsAllowed: true,
      cosmeticsRequirements: ['TGA compliance', 'English labeling'],
      cosmeticsLabeling: ['INCI names', 'Australian distributor details'],
      cosmeticsTesting: 'Restricted animal testing'
    }
  };

  return restrictions[country] || {
    prohibited: [],
    restricted: [],
    maxWeight: 30,
    maxDimensions: { length: 100, width: 100, height: 100 },
    maxValue: 1000,
    requiresLicense: [],
    additionalFees: {},
    cosmeticsAllowed: true,
    cosmeticsRequirements: [],
    cosmeticsLabeling: [],
    cosmeticsTesting: 'Varies by country'
  };
}

/**
 * Get country tax information
 */
function getCountryTaxInfo(country: string) {
  const taxInfo: { [key: string]: any } = {
    'US': { dutyFreeThreshold: 20, dutyRate: 6.5, vatRate: 0, handlingFee: 5, currency: 'USD', calculationMethod: 'CIF' },
    'GB': { dutyFreeThreshold: 15, dutyRate: 12, vatRate: 20, handlingFee: 8, currency: 'GBP', calculationMethod: 'CIF+Duty' },
    'DE': { dutyFreeThreshold: 22, dutyRate: 12, vatRate: 19, handlingFee: 6, currency: 'EUR', calculationMethod: 'CIF+Duty' },
    'BR': { dutyFreeThreshold: 50, dutyRate: 60, vatRate: 0, handlingFee: 15, currency: 'BRL', calculationMethod: 'CIF' },
    'AU': { dutyFreeThreshold: 1000, dutyRate: 5, vatRate: 10, handlingFee: 10, currency: 'AUD', calculationMethod: 'CIF+Duty' }
  };

  return taxInfo[country] || {
    dutyFreeThreshold: 22,
    dutyRate: 12,
    vatRate: 20,
    handlingFee: 5,
    currency: 'EUR',
    calculationMethod: 'CIF+Duty'
  };
}

/**
 * Check for prohibited items
 */
function checkProhibitedItems(items: CustomsItem[], prohibited: string[]): string[] {
  const prohibitedFound: string[] = [];

  items.forEach(item => {
    prohibited.forEach(prohibitedItem => {
      if (item.description.toLowerCase().includes(prohibitedItem.toLowerCase()) ||
          item.category.toLowerCase().includes(prohibitedItem.toLowerCase())) {
        prohibitedFound.push(item.description);
      }
    });
  });

  return [...new Set(prohibitedFound)];
}

/**
 * Generate customs forms
 */
async function generateCustomsForms(customsData: CustomsDeclaration) {
  return {
    cn22: customsData.totalValue <= 300 ? await generateCN22(customsData) : null,
    cn23: customsData.totalValue > 300 ? await generateCN23(customsData) : null,
    customsInvoice: await generateCustomsInvoice(customsData)
  };
}

/**
 * Generate CN22 form (for packages up to €300)
 */
async function generateCN22(customsData: CustomsDeclaration) {
  return {
    formType: 'CN22',
    downloadUrl: `/api/shipping/customs/download/cn22_${customsData.orderId}.pdf`,
    data: {
      orderNumber: customsData.orderId,
      purpose: customsData.purpose,
      totalWeight: customsData.totalWeight,
      totalValue: customsData.totalValue,
      currency: customsData.currency,
      itemsCount: customsData.items.length
    }
  };
}

/**
 * Generate CN23 form (for packages over €300)
 */
async function generateCN23(customsData: CustomsDeclaration) {
  return {
    formType: 'CN23',
    downloadUrl: `/api/shipping/customs/download/cn23_${customsData.orderId}.pdf`,
    data: {
      orderNumber: customsData.orderId,
      purpose: customsData.purpose,
      detailedItems: customsData.items,
      totalWeight: customsData.totalWeight,
      totalValue: customsData.totalValue,
      currency: customsData.currency,
      senderDetails: customsData.sender,
      recipientDetails: customsData.recipient
    }
  };
}

/**
 * Generate customs invoice
 */
async function generateCustomsInvoice(customsData: CustomsDeclaration) {
  return {
    formType: 'CustomsInvoice',
    downloadUrl: `/api/shipping/customs/download/invoice_${customsData.orderId}.pdf`,
    data: customsData
  };
}

/**
 * Generate commercial invoice
 */
async function generateCommercialInvoice(customsData: CustomsDeclaration) {
  return {
    invoiceNumber: `INV-${customsData.orderId}`,
    downloadUrl: `/api/shipping/customs/download/commercial_${customsData.orderId}.pdf`,
    data: {
      ...customsData,
      invoiceDate: new Date().toISOString(),
      paymentTerms: 'Prepaid',
      shippingTerms: 'DDP'
    }
  };
}

/**
 * Calculate duties and taxes
 */
async function calculateDutiesAndTaxes(customsData: CustomsDeclaration) {
  const taxInfo = getCountryTaxInfo(customsData.recipient.country);

  const dutyableValue = Math.max(0, customsData.totalValue - taxInfo.dutyFreeThreshold);
  const dutyAmount = dutyableValue * (taxInfo.dutyRate / 100);
  const taxableValue = customsData.totalValue + dutyAmount + customsData.shippingCost;
  const vatAmount = taxableValue * (taxInfo.vatRate / 100);
  const totalTaxes = dutyAmount + vatAmount + taxInfo.handlingFee;

  return {
    breakdown: {
      itemValue: customsData.totalValue,
      shippingCost: customsData.shippingCost,
      dutyFreeThreshold: taxInfo.dutyFreeThreshold,
      dutyableValue,
      dutyRate: taxInfo.dutyRate,
      dutyAmount,
      vatRate: taxInfo.vatRate,
      vatAmount,
      handlingFee: taxInfo.handlingFee,
      totalTaxes
    },
    currency: taxInfo.currency,
    payableByRecipient: totalTaxes > 0,
    estimatedTotal: customsData.totalValue + customsData.shippingCost + totalTaxes
  };
}

/**
 * Get additional required documents
 */
async function getAdditionalDocuments(customsData: CustomsDeclaration) {
  const requirements = getCountryRequirements(customsData.recipient.country);
  const docs = [];

  if (requirements.certificateOfOrigin) {
    docs.push({
      type: 'Certificate of Origin',
      required: true,
      downloadUrl: `/api/shipping/customs/download/origin_${customsData.orderId}.pdf`
    });
  }

  requirements.additionalDocuments?.forEach((doc: string) => {
    docs.push({
      type: doc,
      required: true,
      description: `Required for ${customsData.recipient.country}`,
      instructions: getDocumentInstructions(doc)
    });
  });

  return docs;
}

/**
 * Get document instructions
 */
function getDocumentInstructions(docType: string): string {
  const instructions: { [key: string]: string } = {
    'FDA compliance for cosmetics': 'Ensure all cosmetic products comply with FDA regulations and labeling requirements',
    'UKCA marking for cosmetics': 'Products must have UKCA marking and responsible person details',
    'CE marking': 'Products must have CE marking indicating conformity with EU regulations',
    'ANVISA registration': 'Cosmetics must be registered with ANVISA for import to Brazil',
    'TGA compliance': 'Products must comply with Australian Therapeutic Goods Administration requirements'
  };

  return instructions[docType] || 'Ensure compliance with local regulations';
}

/**
 * Get supported carriers for country
 */
function getSupportedCarriers(country: string): string[] {
  const carriers: { [key: string]: string[] } = {
    'US': ['UPS', 'DHL', 'CTT'],
    'GB': ['DPD', 'UPS', 'DHL'],
    'DE': ['DPD', 'DHL', 'UPS'],
    'BR': ['Correios', 'DHL'],
    'AU': ['UPS', 'DHL']
  };

  return carriers[country] || ['DHL', 'UPS'];
}

/**
 * Get estimated delivery time
 */
function getEstimatedDeliveryTime(country: string): string {
  const deliveryTimes: { [key: string]: string } = {
    'US': '3-5 business days',
    'GB': '2-3 business days',
    'DE': '2-3 business days',
    'BR': '7-15 business days',
    'AU': '5-8 business days'
  };

  return deliveryTimes[country] || '3-7 business days';
}

/**
 * Get estimated customs clearance time
 */
function getEstimatedClearanceTime(country: string): string {
  const clearanceTimes: { [key: string]: string } = {
    'US': '1-2 days',
    'GB': '1 day',
    'DE': '1 day',
    'BR': '3-10 days',
    'AU': '1-3 days'
  };

  return clearanceTimes[country] || '1-3 days';
}

/**
 * Get estimated clearance date
 */
function getEstimatedClearanceDate(country: string): Date {
  const clearanceDays: { [key: string]: number } = {
    'US': 2,
    'GB': 1,
    'DE': 1,
    'BR': 7,
    'AU': 2
  };

  const days = clearanceDays[country] || 2;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Generate shipping warnings
 */
function generateShippingWarnings(customsData: CustomsDeclaration): string[] {
  const warnings: string[] = [];
  const restrictions = getCountryRestrictions(customsData.recipient.country);

  if (customsData.totalValue > 500) {
    warnings.push('High-value shipment may require additional documentation and face longer customs clearance times');
  }

  if (customsData.totalWeight > 10) {
    warnings.push('Heavy package may incur additional handling fees');
  }

  if (restrictions.additionalFees && Object.keys(restrictions.additionalFees).length > 0) {
    warnings.push('Additional fees may apply at destination');
  }

  const hairProducts = customsData.items.filter(item =>
    item.category.toLowerCase().includes('hair') ||
    item.description.toLowerCase().includes('hair')
  );

  if (hairProducts.length > 0) {
    warnings.push('Hair care products may require special labeling or compliance certificates');
  }

  return warnings;
}

/**
 * Generate tax calculation examples
 */
function generateTaxExamples(taxInfo: any) {
  const examples = [
    { value: 50, description: 'Small package' },
    { value: 100, description: 'Medium package' },
    { value: 200, description: 'Large package' }
  ];

  return examples.map(example => {
    const dutyableValue = Math.max(0, example.value - taxInfo.dutyFreeThreshold);
    const dutyAmount = dutyableValue * (taxInfo.dutyRate / 100);
    const vatAmount = (example.value + dutyAmount) * (taxInfo.vatRate / 100);
    const totalTaxes = dutyAmount + vatAmount + taxInfo.handlingFee;

    return {
      packageValue: example.value,
      description: example.description,
      dutyAmount: Math.round(dutyAmount * 100) / 100,
      vatAmount: Math.round(vatAmount * 100) / 100,
      handlingFee: taxInfo.handlingFee,
      totalTaxes: Math.round(totalTaxes * 100) / 100,
      currency: taxInfo.currency
    };
  });
}