// Script para adicionar canonical metadata em páginas Next.js
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://jchairstudios62.xyz';

function addCanonicalToPage(filePath, route) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Se já tem canonical, pular
    if (content.includes('canonical:')) {
        console.log(`  ✓ ${filePath} já tem canonical`);
        return;
    }

    // Adicionar canonical no metadata
    const metadataRegex = /export\s+const\s+metadata[^{]*{/;
    if (metadataRegex.test(content)) {
        content = content.replace(metadataRegex, (match) => {
            return match + `\n    canonical: '${SITE_URL}${route}',`;
        });

        fs.writeFileSync(filePath, content);
        console.log(`  ✓ Canonical adicionado em: ${filePath}`);
    }
}

// Processar páginas
const pages = [
    { file: 'app/produtos/page.tsx', route: '/produtos' },
    { file: 'app/mega-hair/page.tsx', route: '/mega-hair' },
    { file: 'app/mega-hair-brasileiro/page.tsx', route: '/mega-hair-brasileiro' },
    { file: 'app/maquiagens/page.tsx', route: '/maquiagens' },
    { file: 'app/tratamentos-capilares/page.tsx', route: '/tratamentos-capilares' },
    { file: 'app/progressivas-btx/page.tsx', route: '/progressivas-btx' },
    { file: 'app/shampoos-condicionadores/page.tsx', route: '/shampoos-condicionadores' },
];

pages.forEach(({ file, route }) => {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
        addCanonicalToPage(filePath, route);
    }
});
