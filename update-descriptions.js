const fs = require('fs');

const descriptions = {
  "liso/40cm/grisalho-mix-liso-1a.jpg": "Mega hair liso tipo 1A com efeito ombré sofisticado de castanho-escuro nas raízes degradê para loiro acinzentado champanhe nas pontas. Textura perfeitamente lisa com brilho intenso e acabamento sedoso. A transição de cores é suave e natural, criando profundidade e dimensão. Ideal para quem deseja um visual moderno com efeito de iluminação natural, proporcionando movimento através do contraste de tons.",
  
  "ondulado/40cm/preto-natural-ondulado-3a.jpg": "Mega hair ondulado tipo 3A em preto natural profundo com reflexos sutis. Ondas bem definidas em padrão S médio, criando movimento loose wave elegante e voluminoso. Aplicação em quatro mechas (weft) com fitas pretas. Textura com ondas consistentes da raiz às pontas, proporcionando volume natural e dimensão. Brilho intenso e acabamento sedoso. Comprimento médio versátil que permite diversos estilos mantendo o movimento natural das ondas.",
  
  "cacheado/45cm/ruivo-cacheado-3c.jpg": "Mega hair cacheado tipo 3C em tom ruivo intenso com nuances alaranjadas e cobre vibrante. Cachos em espiral bem definidos e uniformes ao longo de todo o comprimento. Aplicação em mechas soltas com acabamento em fita prateada. A cor apresenta profundidade com variações naturais de tons quentes, criando dimensão e movimento. Ideal para transformações ousadas e impactantes.",
  
  "liso/50cm/preto-natural-liso-1a.jpg": "Mega hair liso tipo 1A em preto natural profundo com brilho intenso. Textura perfeitamente reta e sedosa com acabamento acetinado premium. Aplicação com micro-presilhas (I-tip) pretas para máxima discrição. Cor uniforme e rica em preto natural com reflexos sutis. O cabelo apresenta caimento perfeito e movimento fluido, ideal para quem busca comprimento com visual clássico e elegante.",
  
  "ondulado/30cm/preto-natural-ondulado-2c.jpg": "Mega hair ondulado tipo 2C em preto natural intenso com brilho acetinado. Ondas definidas em formato S formando padrão body wave clássico e elegante. Aplicação em mechas (weft) com fita azul. As ondas são uniformes e bem estruturadas, criando volume natural e movimento fluido. Textura que proporciona versatilidade para usar ondulado ou alisar conforme desejado. Ideal para quem busca volume moderado com movimento sofisticado.",
  
  "cacheado/35cm/preto-natural-cacheado-3c.jpg": "Mega hair cacheado tipo 3C em preto natural profundo com brilho acetinado. Cachos bem estruturados e definidos em espiral apertada, apresentando textura densa e volumosa. Aplicação em trama costurada (weft) com acabamento em fita cobre/bronze. Os cachos mantêm definição consistente da raiz às pontas, proporcionando volume dramático e textura autêntica.",
  
  "liso/60cm/loiro-platinado-liso-1a.jpg": "Mega hair liso tipo 1A em loiro platinado ultra-claro com nuances prateadas. Textura perfeitamente lisa com brilho espelhado excepcional. Aplicação com micro-presilhas metálicas semi-transparentes. Tom loiro gelo uniforme e luminoso, criando um visual dramático e sofisticado. Comprimento longo ideal para visuais impactantes. Cabelo premium com descoloração profissional e tonalização perfeita para eliminar reflexos amarelados.",
  
  "liso/70cm/preto-natural-liso-1a.jpg": "Mega hair liso tipo 1A em preto natural intenso e profundo. Textura ultra-lisa com brilho acetinado premium e caimento perfeito. Aplicação com micro-presilhas (I-tip) pretas para instalação invisível. Comprimento extra-longo alcançando 70cm, proporcionando transformação dramática. Cor uniforme em preto puro com reflexos naturais sutis. Ideal para quem busca o visual de princesa com comprimento espetacular e movimento fluido.",
  
  "liso/80cm/castanho-chocolate-liso-2a.jpg": "Mega hair liso tipo 2A em tom castanho-chocolate rico e profundo. Textura lisa com leve movimento natural nas pontas, apresentando brilho intenso e acabamento sedoso. Aplicação em mechas (weft) com fita prateada. A cor apresenta profundidade em tons chocolate com reflexos sutis que agregam dimensão. Comprimento excepcional de 80cm para transformações espetaculares. O leve movimento tipo 2A proporciona naturalidade e versatilidade.",
  
  "liso/90cm/preto-natural-liso-2a.jpg": "Mega hair liso tipo 2A em preto natural com comprimento excepcional de 90cm. Textura predominantemente lisa com suave movimento nas extremidades, criando acabamento natural e fluido. Aplicação em mechas (weft) com fita prateada. Brilho intenso e sedoso ao longo de todo o comprimento. Cor uniforme em preto profundo. Comprimento ultra-longo ideal para transformações dramáticas e visuais de grande impacto, mantendo naturalidade e movimento."
};

let content = fs.readFileSync('lib/data/megaHairProducts.ts', 'utf8');

// Map image paths to their descriptions
const imageDescMap = {
  "'/images/mega-hair/liso/40cm/grisalho-mix-liso-1a.jpg']": descriptions["liso/40cm/grisalho-mix-liso-1a.jpg"],
  "'/images/mega-hair/ondulado/40cm/preto-natural-ondulado-3a.jpg']": descriptions["ondulado/40cm/preto-natural-ondulado-3a.jpg"],
  "'/images/mega-hair/cacheado/45cm/ruivo-cacheado-3c.jpg']": descriptions["cacheado/45cm/ruivo-cacheado-3c.jpg"],
  "'/images/mega-hair/liso/50cm/preto-natural-liso-1a.jpg']": descriptions["liso/50cm/preto-natural-liso-1a.jpg"],
  "'/images/mega-hair/ondulado/30cm/preto-natural-ondulado-2c.jpg']": descriptions["ondulado/30cm/preto-natural-ondulado-2c.jpg"],
  "'/images/mega-hair/cacheado/35cm/preto-natural-cacheado-3c.jpg']": descriptions["cacheado/35cm/preto-natural-cacheado-3c.jpg"],
  "'/images/mega-hair/liso/60cm/loiro-platinado-liso-1a.jpg']": descriptions["liso/60cm/loiro-platinado-liso-1a.jpg"],
  "'/images/mega-hair/liso/70cm/preto-natural-liso-1a.jpg']": descriptions["liso/70cm/preto-natural-liso-1a.jpg"],
  "'/images/mega-hair/liso/80cm/castanho-chocolate-liso-2a.jpg']": descriptions["liso/80cm/castanho-chocolate-liso-2a.jpg"],
  "'/images/mega-hair/liso/90cm/preto-natural-liso-2a.jpg']": descriptions["liso/90cm/preto-natural-liso-2a.jpg"]
};

// Update descriptions
for (const [imagePath, newDesc] of Object.entries(imageDescMap)) {
  const regex = new RegExp(`(imagens: \\[${imagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^}]*descricao: ')[^']+(')`,'g');
  content = content.replace(regex, `$1${newDesc}$2`);
}

fs.writeFileSync('lib/data/megaHairProducts.ts', content);
console.log('✅ Descrições atualizadas com sucesso!');
