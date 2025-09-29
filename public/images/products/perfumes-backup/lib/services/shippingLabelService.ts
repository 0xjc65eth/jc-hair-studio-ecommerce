import jsPDF from 'jspdf';
import { COMPANY_DATA } from '../data/company-data';

export interface ShippingLabelData {
  orderId: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
  }>;
  trackingCode?: string;
  carrier?: string;
  weight?: string;
  dimensions?: string;
  createdAt: Date;
}

export class ShippingLabelService {
  // Paleta Brasileira Profissional - Inspirada nas cores do Brasil
  private static readonly BRAND_COLORS = {
    primary: [0, 100, 53] as [number, number, number],
    secondary: [255, 223, 0] as [number, number, number],
    accent: [0, 156, 166] as [number, number, number],
    ocean: [21, 101, 192] as [number, number, number],
    gold: [255, 193, 7] as [number, number, number],
    forest: [76, 175, 80] as [number, number, number],
    dark: [27, 94, 32] as [number, number, number],
    light: [232, 245, 233] as [number, number, number],
    cream: [255, 248, 225] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
    black: [33, 37, 41] as [number, number, number],
    gray: [108, 117, 125] as [number, number, number],
    lightGray: [233, 236, 239] as [number, number, number],
    warmGray: [134, 142, 150] as [number, number, number],
    success: [40, 167, 69] as [number, number, number],
    warning: [255, 193, 7] as [number, number, number],
    danger: [220, 53, 69] as [number, number, number]
  };

  static generatePDF(data: ShippingLabelData): Blob {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Configurações
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Função helper para adicionar texto
    const addText = (text: string, x: number, y: number, fontSize: number = 10, bold: boolean = false, color: [number, number, number] = this.BRAND_COLORS.black, align?: 'left' | 'center' | 'right') => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color[0], color[1], color[2]);
      if (bold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      if (align) {
        doc.text(text, x, y, { align });
      } else {
        doc.text(text, x, y);
      }
    };

    // === CABEÇALHO EXPERT BRASILEIRO ===
    const headerHeight = 42;

    // Fundo principal Verde Brasil
    doc.setFillColor(...this.BRAND_COLORS.primary);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');

    // Faixa superior amarelo ouro (bandeira do Brasil)
    doc.setFillColor(...this.BRAND_COLORS.secondary);
    doc.rect(0, 0, pageWidth, 4, 'F');

    // Faixa inferior amarelo ouro
    doc.setFillColor(...this.BRAND_COLORS.gold);
    doc.rect(0, headerHeight - 4, pageWidth, 4, 'F');

    // Elementos decorativos brasileiros - losango da bandeira
    doc.setFillColor(...this.BRAND_COLORS.secondary);
    // Losango central (simulado com triângulos)
    const centerX = pageWidth / 2;
    const diamondY = headerHeight / 2;
    const diamondSize = 12;

    // Criar losango com triângulos
    doc.triangle(centerX - diamondSize/2, diamondY, centerX, diamondY - diamondSize/3, centerX + diamondSize/2, diamondY, 'F');
    doc.triangle(centerX - diamondSize/2, diamondY, centerX, diamondY + diamondSize/3, centerX + diamondSize/2, diamondY, 'F');

    // Logo da empresa - Círculo Verde e Amarelo
    const logoX = margin + 5;
    const logoY = 10;
    const logoSize = 22;

    // Círculo externo verde
    doc.setFillColor(...this.BRAND_COLORS.forest);
    doc.circle(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 'F');

    // Círculo interno amarelo
    doc.setFillColor(...this.BRAND_COLORS.gold);
    doc.circle(logoX + logoSize/2, logoY + logoSize/2, logoSize/2 - 3, 'F');

    // Círculo central branco
    doc.setFillColor(...this.BRAND_COLORS.white);
    doc.circle(logoX + logoSize/2, logoY + logoSize/2, logoSize/2 - 6, 'F');

    // Iniciais estilizadas
    addText("JC", logoX + logoSize/2, logoY + logoSize/2 + 2, 11, true, this.BRAND_COLORS.primary, 'center');

    // Nome da empresa - Dados padronizados
    const nameX = logoX + logoSize + 12;
    addText(COMPANY_DATA.name.replace('\'s', 'S'), nameX, 16, 22, true, this.BRAND_COLORS.white);
    addText(COMPANY_DATA.tagline.substring(0, 35) + '...', nameX, 24, 8, false, this.BRAND_COLORS.cream);
    addText(`${COMPANY_DATA.addresses.headquarters.city} PARA O MUNDO`, nameX, 30, 8, false, this.BRAND_COLORS.secondary);

    // Titulo da etiqueta profissional
    const titleX = pageWidth - margin - 65;
    doc.setFillColor(...this.BRAND_COLORS.white);
    doc.rect(titleX - 5, 6, 70, 18, 'F');
    doc.setDrawColor(...this.BRAND_COLORS.gold);
    doc.setLineWidth(1.5);
    doc.rect(titleX - 5, 6, 70, 18, 'D');

    addText("ETIQUETA DE ENVIO", titleX + 30, 12, 11, true, this.BRAND_COLORS.primary, 'center');
    addText("SHIPPING LABEL", titleX + 30, 17, 8, false, this.BRAND_COLORS.ocean, 'center');
    addText("SERVICO PREMIUM", titleX + 30, 22, 7, false, this.BRAND_COLORS.accent, 'center');

    yPosition = headerHeight + 15;
    doc.setTextColor(0, 0, 0);

    // === SEÇÃO REMETENTE EXPERT BRASIL ===
    // Caixa principal com gradiente brasileiro
    doc.setFillColor(...this.BRAND_COLORS.light);
    doc.setDrawColor(...this.BRAND_COLORS.primary);
    doc.setLineWidth(2);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 38, 'FD');

    // Faixa superior verde Brasil
    doc.setFillColor(...this.BRAND_COLORS.primary);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 10, 'F');

    // Detalhes decorativos
    doc.setFillColor(...this.BRAND_COLORS.gold);
    doc.rect(margin + 8, yPosition - 2, pageWidth - 2 * margin - 16, 2, 'F'); // Linha dourada
    doc.rect(margin + 5, yPosition, 4, 30, 'F'); // Barra lateral dourada

    addText('REMETENTE / FROM', margin + 25, yPosition + 1, 12, true, this.BRAND_COLORS.white);
    yPosition += 12;

    // Informacoes da empresa - Dados padronizados
    addText(COMPANY_DATA.name, margin + 12, yPosition, 14, true, this.BRAND_COLORS.dark);
    addText("EXCELENCIA BRASILEIRA", pageWidth - margin - 58, yPosition, 9, false, this.BRAND_COLORS.accent);
    yPosition += 7;

    const address = COMPANY_DATA.addresses.headquarters;
    addText(`${address.street}, ${address.neighborhood}`, margin + 12, yPosition, 10, false, this.BRAND_COLORS.black);
    yPosition += 5;
    addText(`${address.zipCode} ${address.city} - ${address.country}`, margin + 12, yPosition, 10, false, this.BRAND_COLORS.black);
    yPosition += 5;
    addText(`Tel: ${COMPANY_DATA.contact.phones[0].number}`, margin + 12, yPosition, 10, false, this.BRAND_COLORS.ocean);
    yPosition += 5;
    addText("NIF: PT293147175", margin + 12, yPosition, 10, false, this.BRAND_COLORS.gray);
    addText("Site: jchairstudios62.xyz", pageWidth - margin - 58, yPosition, 9, false, this.BRAND_COLORS.accent);
    yPosition += 20;

    // === SEÇÃO DESTINATÁRIO DESTACADA ===
    // Caixa principal branca com sombra (simulada)
    doc.setFillColor(...this.BRAND_COLORS.white);
    doc.setDrawColor(...this.BRAND_COLORS.secondary);
    doc.setLineWidth(2);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 42, 'FD');

    // Faixa superior dourada
    doc.setFillColor(...this.BRAND_COLORS.secondary);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F');

    addText('DESTINATARIO / TO', margin + 5, yPosition, 12, true, this.BRAND_COLORS.white);

    yPosition += 10;

    // Informacoes do destinatario - Padrao Contabil
    addText(data.shippingAddress.name.toUpperCase(), margin + 8, yPosition, 14, true, this.BRAND_COLORS.dark);
    yPosition += 8;

    addText(data.shippingAddress.street, margin + 8, yPosition, 11, false, this.BRAND_COLORS.black);
    yPosition += 6;

    addText(`${data.shippingAddress.city}, ${data.shippingAddress.zipCode}`, margin + 8, yPosition, 11, false, this.BRAND_COLORS.black);
    yPosition += 6;

    addText(data.shippingAddress.country.toUpperCase(), margin + 8, yPosition, 11, true, this.BRAND_COLORS.primary);

    if (data.shippingAddress.phone) {
      addText(`Tel: ${data.shippingAddress.phone}`, pageWidth - margin - 60, yPosition, 10, false, this.BRAND_COLORS.gray);
    }
    yPosition += 18;

    // Código de barras (simulado com retângulos)
    if (data.trackingCode) {
      doc.setFillColor(0, 0, 0);
      const barcodeWidth = pageWidth - 2 * margin;
      const barcodeHeight = 20;
      const barcodeY = yPosition;

      // Simular código de barras
      for (let i = 0; i < 50; i++) {
        const x = margin + (i * barcodeWidth / 50);
        const width = Math.random() > 0.5 ? 2 : 1;
        if (Math.random() > 0.3) {
          doc.rect(x, barcodeY, width, barcodeHeight, 'F');
        }
      }

      yPosition += barcodeHeight + 5;
      doc.setFontSize(12);
      doc.text(data.trackingCode, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
    }

    // Informações do Pedido
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    addText('INFORMAÇÕES DO PEDIDO:', margin, yPosition, 11, true);
    yPosition += 8;

    // Grid de informações
    const col1 = margin;
    const col2 = pageWidth / 2;

    addText(`Nº Pedido: ${data.orderId}`, col1, yPosition, 10);
    addText(`Data: ${data.createdAt.toLocaleDateString('pt-PT')}`, col2, yPosition, 10);
    yPosition += 6;

    if (data.carrier) {
      addText(`Transportadora: ${data.carrier}`, col1, yPosition, 10);
    }
    if (data.weight) {
      addText(`Peso: ${data.weight}`, col2, yPosition, 10);
    }
    yPosition += 6;

    if (data.dimensions) {
      addText(`Dimensões: ${data.dimensions}`, col1, yPosition, 10);
    }
    addText(`Itens: ${data.items.reduce((sum, item) => sum + item.quantity, 0)}`, col2, yPosition, 10);
    yPosition += 15;

    // Lista de Produtos
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F');
    addText('CONTEÚDO DO PACOTE:', margin + 2, yPosition, 10, true);
    yPosition += 10;

    data.items.forEach((item, index) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
      }
      addText(`${index + 1}. ${item.name} (Qtd: ${item.quantity})`, margin + 5, yPosition, 9);
      yPosition += 5;
    });

    yPosition += 10;

    // Instruções de Manuseio
    if (yPosition < pageHeight - 60) {
      doc.setFillColor(255, 250, 205);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');
      doc.setDrawColor(255, 200, 0);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'S');

      addText('INSTRUÇÕES DE MANUSEIO:', margin + 2, yPosition + 6, 10, true);
      addText('• Frágil - Manusear com cuidado', margin + 2, yPosition + 12, 9);
      addText('• Manter em local seco', margin + 2, yPosition + 17, 9);
      addText('• Não expor ao sol', margin + 2, yPosition + 22, 9);
      yPosition += 35;
    }

    // QR Code simulado (quadrado com padrão)
    const qrSize = 25;
    const qrX = pageWidth - margin - qrSize;
    const qrY = pageHeight - margin - qrSize - 10;

    doc.setFillColor(0, 0, 0);
    doc.rect(qrX, qrY, qrSize, qrSize, 'S');

    // Padrão QR simulado
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (Math.random() > 0.5) {
          doc.rect(qrX + i * 3, qrY + j * 3, 3, 3, 'F');
        }
      }
    }

    doc.setFontSize(8);
    doc.text('Rastreamento', qrX + qrSize / 2, qrY + qrSize + 5, { align: 'center' });

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const footer = `Etiqueta gerada em ${new Date().toLocaleString('pt-PT')} | JC Hair Studio's 62`;
    doc.text(footer, pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Adicionar assinatura
    doc.line(margin, pageHeight - 40, margin + 60, pageHeight - 40);
    doc.text('Assinatura do Recebedor', margin, pageHeight - 35, { align: 'left' });

    doc.line(pageWidth - margin - 60, pageHeight - 40, pageWidth - margin, pageHeight - 40);
    doc.text('Data de Recebimento', pageWidth - margin - 60, pageHeight - 35, { align: 'left' });

    return doc.output('blob');
  }

  static downloadLabel(data: ShippingLabelData): void {
    const blob = this.generatePDF(data);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `etiqueta-${data.orderId}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  static async printLabel(data: ShippingLabelData): Promise<void> {
    const blob = this.generatePDF(data);
    const url = window.URL.createObjectURL(blob);

    // Abrir em nova janela para impressão
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }

    // Limpar após alguns segundos
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 10000);
  }

  // Gerar múltiplas etiquetas de uma vez
  static generateBulkLabels(orders: ShippingLabelData[]): Blob {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    orders.forEach((order, index) => {
      if (index > 0) {
        doc.addPage();
      }

      // Reutilizar lógica de geração individual
      // (código simplificado aqui, mas seria a mesma lógica do generatePDF)
      doc.setFontSize(16);
      doc.text(`Etiqueta ${index + 1} de ${orders.length}`, 105, 20, { align: 'center' });
      doc.text(`Pedido: ${order.orderId}`, 105, 30, { align: 'center' });
      // ... resto do conteúdo
    });

    return doc.output('blob');
  }
}