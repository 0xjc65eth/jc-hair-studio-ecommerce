import { NextRequest, NextResponse } from 'next/server';
import { DataImporter } from '@/lib/data-management/DataImporter';
import { connectDB } from '@/lib/mongodb';

/**
 * Data Import API
 * Provides endpoints for importing orders and customer data
 */

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const importType = formData.get('importType') as string || 'orders';
    const format = formData.get('format') as string || 'csv';
    const validateOnly = formData.get('validateOnly') === 'true';
    const skipDuplicates = formData.get('skipDuplicates') === 'true';
    const updateExisting = formData.get('updateExisting') === 'true';
    const batchSize = parseInt(formData.get('batchSize') as string || '50');

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided'
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: 'File size exceeds 10MB limit'
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = {
      csv: ['text/csv', 'application/csv', 'text/plain'],
      excel: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
      json: ['application/json', 'text/json']
    };

    const validTypes = allowedTypes[format as keyof typeof allowedTypes];
    if (!validTypes || !validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type for ${format} format. Expected: ${validTypes?.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Read file data
    let fileData: string | Buffer;
    if (format === 'excel') {
      fileData = Buffer.from(await file.arrayBuffer());
    } else {
      fileData = await file.text();
    }

    // Parse field mapping if provided
    let mapping: Record<string, string> | undefined;
    const mappingData = formData.get('mapping');
    if (mappingData) {
      try {
        mapping = JSON.parse(mappingData as string);
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid field mapping JSON'
          },
          { status: 400 }
        );
      }
    }

    const options = {
      format: format as 'csv' | 'excel' | 'json',
      validateOnly,
      skipDuplicates,
      updateExisting,
      batchSize,
      mapping
    };

    let result;

    switch (importType) {
      case 'orders':
        result = await DataImporter.importOrders(fileData, options);
        break;

      case 'customers':
        result = await DataImporter.importCustomers(fileData, options);
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unsupported import type: ${importType}`
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: result.success,
      data: {
        summary: {
          totalRecords: result.totalRecords,
          processedRecords: result.processedRecords,
          successfulImports: result.successfulImports,
          skippedRecords: result.skippedRecords,
          failedRecords: result.failedRecords
        },
        errors: result.errors,
        duplicates: result.duplicates,
        warnings: result.warnings,
        validation: validateOnly
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Import API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to import data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Validate import data without actually importing
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const importType = formData.get('importType') as string || 'orders';
    const format = formData.get('format') as string || 'csv';

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided'
        },
        { status: 400 }
      );
    }

    // Read file data
    let fileData: string | Buffer;
    if (format === 'excel') {
      fileData = Buffer.from(await file.arrayBuffer());
    } else {
      fileData = await file.text();
    }

    const result = await DataImporter.validateData(
      fileData,
      importType as 'orders' | 'customers',
      format as 'csv' | 'excel' | 'json'
    );

    return NextResponse.json({
      success: true,
      data: {
        validation: {
          isValid: result.errors.length === 0,
          totalRecords: result.totalRecords,
          errors: result.errors,
          warnings: result.warnings
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Import Validation API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to validate import data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get import templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('dataType') as 'orders' | 'customers' || 'orders';
    const format = searchParams.get('format') as 'csv' | 'excel' || 'csv';

    const template = DataImporter.generateImportTemplate(dataType, format);

    const headers = new Headers();

    if (format === 'csv') {
      headers.set('Content-Type', 'text/csv');
      headers.set('Content-Disposition', `attachment; filename="${dataType}_import_template.csv"`);
    } else if (format === 'excel') {
      headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      headers.set('Content-Disposition', `attachment; filename="${dataType}_import_template.xlsx"`);
    }

    return new NextResponse(template, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Template Generation API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate import template',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}