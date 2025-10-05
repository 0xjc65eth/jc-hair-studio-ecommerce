#!/usr/bin/env node

/**
 * Next.js 15 Params Fix - Codemod
 * Automatically fixes params type from synchronous to Promise<params>
 */

const fs = require('fs');
const path = require('path');

function fixParamsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Pattern to find API route handlers with old params syntax
  const oldPattern = /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)\s*\(\s*([^,]+),\s*\{\s*params\s*\}\s*:\s*\{\s*params\s*:\s*\{([^}]+)\}\s*\}\s*\)/g;

  let newContent = content.replace(oldPattern, (match, method, request, paramsType) => {
    return `export async function ${method}(${request}, { params }: { params: Promise<{${paramsType}}> })`;
  });

  // Pattern to fix the usage of params inside the function
  const paramsUsagePattern = /const\s+([^=]+)\s*=\s*params\.([a-zA-Z0-9_]+);/g;
  newContent = newContent.replace(paramsUsagePattern, (match, varName, paramName) => {
    return `const { ${paramName}: ${varName} } = await params;`;
  });

  // Pattern to fix direct params access
  const directParamsPattern = /params\.([a-zA-Z0-9_]+)/g;
  newContent = newContent.replace(directParamsPattern, (match, paramName) => {
    // Only replace if not already awaited
    if (!newContent.includes(`await params`)) {
      return `(await params).${paramName}`;
    }
    return match;
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log(`✅ Fixed params in: ${filePath}`);
    return true;
  }

  return false;
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith('.') && !file.includes('node_modules')) {
      fixedCount += walkDirectory(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      if (fixParamsInFile(filePath)) {
        fixedCount++;
      }
    }
  }

  return fixedCount;
}

console.log('🔧 Running Next.js 15 params codemod...');
const fixedFiles = walkDirectory('./app');
console.log(`🎉 Fixed ${fixedFiles} files with params issues`);