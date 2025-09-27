// Test script for header dropdown functionality
import puppeteer from 'puppeteer';

const TEST_BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';

async function testHeaderDropdown() {
  console.log('🎯 Testando funcionalidade do dropdown do header...');

  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    slowMo: 100 // Slower interactions to see what's happening
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    console.log('📱 Navegando para homepage...');
    await page.goto(`${TEST_BASE_URL}`, {
      waitUntil: 'networkidle2',
      timeout: 10000
    });

    // Wait for header to load
    console.log('⏳ Aguardando header carregar...');
    await page.waitForSelector('nav', { timeout: 5000 });

    // Test 1: Find the "Produtos Capilares" dropdown trigger
    console.log('🔍 Procurando botão "Produtos Capilares"...');
    const dropdownTrigger = await page.$('nav button:has-text("Produtos Capilares")') ||
                           await page.$('nav [data-testid="produtos-capilares-dropdown"]') ||
                           await page.$('nav button[aria-haspopup="true"]');

    if (!dropdownTrigger) {
      console.log('⚠️ Testando com seletor genérico...');
      const buttons = await page.$$('nav button');
      console.log(`📊 Encontrados ${buttons.length} botões no nav`);

      for (let i = 0; i < buttons.length; i++) {
        const text = await buttons[i].evaluate(el => el.textContent);
        console.log(`  Botão ${i}: "${text}"`);
        if (text && text.includes('Produtos')) {
          console.log('✅ Encontrado dropdown trigger!');

          // Test hover interaction
          console.log('🖱️ Testando hover no trigger...');
          await buttons[i].hover();
          await page.waitForTimeout(500); // Wait for dropdown to appear

          // Check if dropdown appeared
          const dropdown = await page.$('[role="menu"]') ||
                          await page.$('.dropdown-menu') ||
                          await page.$('[data-testid="dropdown-content"]');

          if (dropdown) {
            console.log('✅ Dropdown apareceu após hover!');

            // Test moving mouse to dropdown content
            console.log('🖱️ Movendo mouse para dentro do dropdown...');
            const dropdownBox = await dropdown.boundingBox();
            if (dropdownBox) {
              await page.mouse.move(
                dropdownBox.x + dropdownBox.width / 2,
                dropdownBox.y + dropdownBox.height / 2
              );
              await page.waitForTimeout(1000); // Wait to see if dropdown stays

              // Check if dropdown is still visible
              const isStillVisible = await dropdown.isIntersectingViewport();
              if (isStillVisible) {
                console.log('✅ Dropdown permanece visível ao mover mouse para dentro!');

                // Test clicking on dropdown item
                console.log('🖱️ Testando clique em item do dropdown...');
                const dropdownItems = await dropdown.$$('a, button');
                if (dropdownItems.length > 0) {
                  const firstItem = dropdownItems[0];
                  const itemText = await firstItem.evaluate(el => el.textContent);
                  console.log(`  Clicando em: "${itemText}"`);

                  await firstItem.click();
                  await page.waitForTimeout(2000); // Wait for navigation

                  const currentUrl = page.url();
                  console.log(`✅ Navegou para: ${currentUrl}`);
                } else {
                  console.log('⚠️ Nenhum item encontrado no dropdown');
                }
              } else {
                console.log('❌ Dropdown desapareceu ao mover mouse para dentro');
              }
            }
          } else {
            console.log('❌ Dropdown não apareceu após hover');
          }
          break;
        }
      }
    }

    // Test 2: Check CSS hover states
    console.log('\n🎨 Verificando estados CSS...');
    const hoverCSS = await page.evaluate(() => {
      const dropdownElements = document.querySelectorAll('[data-testid*="dropdown"], .dropdown');
      const results = [];

      dropdownElements.forEach((el, index) => {
        const computedStyle = window.getComputedStyle(el);
        results.push({
          element: index,
          display: computedStyle.display,
          visibility: computedStyle.visibility,
          opacity: computedStyle.opacity,
          zIndex: computedStyle.zIndex
        });
      });

      return results;
    });

    console.log('CSS States:', JSON.stringify(hoverCSS, null, 2));

    console.log('\n✅ Teste do header dropdown concluído!');

  } catch (error) {
    console.error('❌ Erro durante teste do header:', error.message);
  } finally {
    await browser.close();
  }
}

testHeaderDropdown().catch(console.error);