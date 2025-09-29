import jsPDF from 'jspdf';
import { COMPANY_DATA } from '../data/company-data';

export interface InvoiceData {
  invoiceNumber: string;
  orderId: string;
  issueDate: Date;
  dueDate: Date;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerTaxId?: string;
  billingAddress: {
    name: string;
    street: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    taxRate?: number;
    category?: string;
  }>;
  subtotal: number;
  taxAmount: number;
  discount?: number;
  shipping?: number;
  total: number;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'overdue';
  notes?: string;
  companyData: {
    name: string;
    address: string;
    taxId: string;
    phone: string;
    email: string;
    website: string;
  };
}

export class InvoiceService {
  // Paleta Brasileira Profissional Premium - Expert Level
  private static readonly BRAND_COLORS = {
    primary: [0, 100, 53] as [number, number, number],
    secondary: [255, 223, 0] as [number, number, number],
    accent: [0, 156, 166] as [number, number, number],
    ocean: [21, 101, 192] as [number, number, number],
    gold: [255, 193, 7] as [number, number, number],
    forest: [76, 175, 80] as [number, number, number],
    emerald: [46, 125, 50] as [number, number, number],
    dark: [27, 94, 32] as [number, number, number],
    light: [232, 245, 233] as [number, number, number],
    cream: [255, 248, 225] as [number, number, number],
    sand: [255, 235, 179] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
    black: [33, 37, 41] as [number, number, number],
    gray: [108, 117, 125] as [number, number, number],
    lightGray: [233, 236, 239] as [number, number, number],
    warmGray: [134, 142, 150] as [number, number, number],
    success: [40, 167, 69] as [number, number, number],
    warning: [255, 193, 7] as [number, number, number],
    danger: [220, 53, 69] as [number, number, number],
    tropical: [255, 152, 0] as [number, number, number],
    sunset: [255, 87, 34] as [number, number, number]
  };

  static generateInvoicePDF(data: InvoiceData): Blob {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Configurações
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
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

    // === CABEÇALHO EXPERT BRASIL PREMIUM ===
    const headerHeight = 50;

    // Fundo principal Verde Brasil
    doc.setFillColor(...this.BRAND_COLORS.primary);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');

    // Faixas decorativas inspiradas na bandeira do Brasil
    doc.setFillColor(...this.BRAND_COLORS.secondary);
    doc.rect(0, 0, pageWidth, 5, 'F'); // Faixa superior amarela

    doc.setFillColor(...this.BRAND_COLORS.gold);
    doc.rect(0, headerHeight - 5, pageWidth, 5, 'F'); // Faixa inferior dourada

    // Losango central da bandeira (decorativo)
    const centerX = pageWidth / 2;
    const diamondY = 15;
    const diamondSize = 16;
    doc.setFillColor(...this.BRAND_COLORS.secondary);
    doc.triangle(centerX - diamondSize/2, diamondY, centerX, diamondY - diamondSize/3, centerX + diamondSize/2, diamondY, 'F');
    doc.triangle(centerX - diamondSize/2, diamondY, centerX, diamondY + diamondSize/3, centerX + diamondSize/2, diamondY, 'F');

    // Elementos decorativos das laterais
    doc.setFillColor(...this.BRAND_COLORS.cream);
    for (let i = 0; i < 5; i++) {
      doc.circle(30 + i * 25, 8, 2, 'F');
      doc.circle(pageWidth - 30 - i * 25, headerHeight - 8, 2, 'F');
    }

    // Logo da empresa brasileira premium
    const logoX = margin;
    const logoY = 12;
    const logoSize = 26;

    // Círculo externo verde floresta
    doc.setFillColor(...this.BRAND_COLORS.forest);
    doc.circle(logoX + logoSize/2, logoY + logoSize/2, logoSize/2, 'F');

    // Círculo médio amarelo ouro
    doc.setFillColor(...this.BRAND_COLORS.gold);
    doc.circle(logoX + logoSize/2, logoY + logoSize/2, logoSize/2 - 4, 'F');

    // Círculo interno branco
    doc.setFillColor(...this.BRAND_COLORS.white);
    doc.circle(logoX + logoSize/2, logoY + logoSize/2, logoSize/2 - 8, 'F');

    // Iniciais estilizadas
    addText("JC", logoX + logoSize/2, logoY + logoSize/2 + 3, 14, true, this.BRAND_COLORS.primary, 'center');

    // Nome da empresa - Dados padronizados
    const nameX = logoX + logoSize + 15;
    addText(COMPANY_DATA.name.replace('\'s', 'S'), nameX, 20, 24, true, this.BRAND_COLORS.white);
    addText(COMPANY_DATA.tagline, nameX, 28, 8, false, this.BRAND_COLORS.cream);
    addText(`${COMPANY_DATA.addresses.headquarters.city} - NIF: PT293147175`, nameX, 34, 8, false, this.BRAND_COLORS.sand);
    addText("PREMIUM HAIR EXTENSIONS", nameX, 40, 8, false, this.BRAND_COLORS.secondary);

    // NOTA FISCAL PREMIUM
    const invoiceBoxX = pageWidth - margin - 75;
    const invoiceBoxY = 8;
    const invoiceBoxW = 70;
    const invoiceBoxH = 32;

    // Fundo branco com sombra
    doc.setFillColor(200, 200, 200);
    doc.rect(invoiceBoxX + 2, invoiceBoxY + 2, invoiceBoxW, invoiceBoxH, 'F'); // Sombra
    doc.setFillColor(...this.BRAND_COLORS.white);
    doc.rect(invoiceBoxX, invoiceBoxY, invoiceBoxW, invoiceBoxH, 'F');

    // Bordas decorativas
    doc.setDrawColor(...this.BRAND_COLORS.gold);
    doc.setLineWidth(3);
    doc.rect(invoiceBoxX, invoiceBoxY, invoiceBoxW, invoiceBoxH, 'D');

    // Faixa superior verde
    doc.setFillColor(...this.BRAND_COLORS.primary);
    doc.rect(invoiceBoxX, invoiceBoxY, invoiceBoxW, 12, 'F');

    addText("NOTA FISCAL", invoiceBoxX + invoiceBoxW/2, invoiceBoxY + 6, 12, true, this.BRAND_COLORS.white, 'center');
    addText("INVOICE - FATURA", invoiceBoxX + invoiceBoxW/2, invoiceBoxY + 10, 8, false, this.BRAND_COLORS.cream, 'center');

    addText(`No. ${data.invoiceNumber}`, invoiceBoxX + invoiceBoxW/2, invoiceBoxY + 18, 12, true, this.BRAND_COLORS.primary, 'center');
    addText("DOCUMENTO FISCAL", invoiceBoxX + invoiceBoxW/2, invoiceBoxY + 24, 8, false, this.BRAND_COLORS.ocean, 'center');
    addText(`Data: ${data.issueDate.toLocaleDateString('pt-BR')}`, invoiceBoxX + invoiceBoxW/2, invoiceBoxY + 28, 8, false, this.BRAND_COLORS.gray, 'center');
    addText("SISTEMA DIGITAL", invoiceBoxX + invoiceBoxW/2, invoiceBoxY + 32, 7, false, this.BRAND_COLORS.accent, 'center');

    yPosition = headerHeight + 20;

    // === INFORMAÇÕES DA EMPRESA E CLIENTE ===
    // Coluna esquerda - Empresa
    doc.setFillColor(...this.BRAND_COLORS.light);
    doc.rect(margin, yPosition - 5, (pageWidth - 3 * margin) / 2, 35, 'F');
    doc.setDrawColor(...this.BRAND_COLORS.primary);
    doc.setLineWidth(1);
    doc.rect(margin, yPosition - 5, (pageWidth - 3 * margin) / 2, 35, 'D');

    addText('DADOS DA EMPRESA', margin + 5, yPosition, 10, true, this.BRAND_COLORS.primary);
    yPosition += 6;
    addText(data.companyData.name, margin + 5, yPosition, 11, true, this.BRAND_COLORS.dark);
    yPosition += 5;
    addText(data.companyData.address, margin + 5, yPosition, 9, false, this.BRAND_COLORS.black);
    yPosition += 4;
    addText(`NIF: ${data.companyData.taxId}`, margin + 5, yPosition, 9, false, this.BRAND_COLORS.black);
    yPosition += 4;
    addText(`Tel: ${data.companyData.phone}`, margin + 5, yPosition, 9, false, this.BRAND_COLORS.black);
    yPosition += 4;
    addText(`Email: ${data.companyData.email}`, margin + 5, yPosition, 9, false, this.BRAND_COLORS.black);
    yPosition += 4;
    addText(`Site: ${data.companyData.website}`, margin + 5, yPosition, 9, false, this.BRAND_COLORS.gray);

    // Voltar para o topo da segunda coluna
    yPosition = headerHeight + 15;

    // Coluna direita - Cliente
    const colRightX = margin + (pageWidth - 3 * margin) / 2 + margin;
    doc.setFillColor(...this.BRAND_COLORS.white);
    doc.rect(colRightX, yPosition, (pageWidth - 3 * margin) / 2, 35, 'F');
    doc.setDrawColor(...this.BRAND_COLORS.secondary);
    doc.setLineWidth(1);
    doc.rect(colRightX, yPosition, (pageWidth - 3 * margin) / 2, 35, 'D');

    addText('FATURAR A', colRightX + 5, yPosition + 5, 10, true, this.BRAND_COLORS.primary);
    addText(data.customerName.toUpperCase(), colRightX + 5, yPosition + 11, 12, true, this.BRAND_COLORS.dark);
    addText(data.billingAddress.street, colRightX + 5, yPosition + 16, 9, false, this.BRAND_COLORS.black);
    addText(`${data.billingAddress.city}, ${data.billingAddress.zipCode}`, colRightX + 5, yPosition + 20, 9, false, this.BRAND_COLORS.black);
    addText(data.billingAddress.country, colRightX + 5, yPosition + 24, 9, false, this.BRAND_COLORS.black);
    if (data.customerTaxId) {
      addText(`NIF: ${data.customerTaxId}`, colRightX + 5, yPosition + 28, 9, false, this.BRAND_COLORS.black);
    }
    addText(`Email: ${data.customerEmail}`, colRightX + 5, yPosition + 32, 8, false, this.BRAND_COLORS.gray);

    yPosition = headerHeight + 60;

    // === INFORMACOES DA FATURA ===
    doc.setFillColor(...this.BRAND_COLORS.secondary);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');

    const infoY = yPosition + 5;
    addText('INFORMACOES DA FATURA', margin + 5, infoY, 11, true, this.BRAND_COLORS.white);

    yPosition += 15;

    // Grid de informacoes - Padrao Contabil
    const col1X = margin + 5;
    const col2X = margin + (pageWidth - 2 * margin) / 3;
    const col3X = margin + 2 * (pageWidth - 2 * margin) / 3;

    addText(`Data de Emissao:`, col1X, yPosition, 9, true, this.BRAND_COLORS.dark);
    addText(data.issueDate.toLocaleDateString('pt-BR'), col1X, yPosition + 5, 9, false, this.BRAND_COLORS.black);

    addText(`Data de Vencimento:`, col2X, yPosition, 9, true, this.BRAND_COLORS.dark);
    addText(data.dueDate.toLocaleDateString('pt-BR'), col2X, yPosition + 5, 9, false, this.BRAND_COLORS.black);

    addText(`Pedido No.:`, col3X, yPosition, 9, true, this.BRAND_COLORS.dark);
    addText(data.orderId, col3X, yPosition + 5, 9, false, this.BRAND_COLORS.black);

    yPosition += 15;

    addText(`Forma de Pagamento:`, col1X, yPosition, 9, true, this.BRAND_COLORS.dark);
    addText(data.paymentMethod || 'A definir', col1X, yPosition + 5, 9, false, this.BRAND_COLORS.black);

    addText(`Status do Pagamento:`, col2X, yPosition, 9, true, this.BRAND_COLORS.dark);
    const statusColor = data.paymentStatus === 'paid' ? this.BRAND_COLORS.success :
                       data.paymentStatus === 'pending' ? this.BRAND_COLORS.warning :
                       this.BRAND_COLORS.danger;
    const statusText = {
      paid: 'PAGO',
      pending: 'PENDENTE',
      partial: 'PARCIAL',
      overdue: 'EM ATRASO'
    }[data.paymentStatus];
    addText(statusText, col2X, yPosition + 5, 9, true, statusColor);

    yPosition += 20;

    // === TABELA DE ITENS ===
    // Cabecalho da tabela - Padrao Contabil
    doc.setFillColor(...this.BRAND_COLORS.primary);
    const tableY = yPosition;
    const rowHeight = 8;
    doc.rect(margin, tableY, pageWidth - 2 * margin, rowHeight, 'F');

    // Colunas da tabela
    const colWidths = {
      description: 80,
      quantity: 20,
      unitPrice: 25,
      total: 25
    };

    let currentX = margin + 5;
    addText('DESCRICAO', currentX, tableY + 5, 10, true, this.BRAND_COLORS.white);
    currentX += colWidths.description;

    addText('QTD', currentX, tableY + 5, 10, true, this.BRAND_COLORS.white, 'center');
    currentX += colWidths.quantity;

    addText('PRECO UNIT.', currentX, tableY + 5, 10, true, this.BRAND_COLORS.white, 'center');
    currentX += colWidths.unitPrice;

    addText('TOTAL', currentX, tableY + 5, 10, true, this.BRAND_COLORS.white, 'center');

    yPosition = tableY + rowHeight + 5;

    // Linhas dos itens
    data.items.forEach((item, index) => {
      const isEven = index % 2 === 0;
      if (isEven) {
        doc.setFillColor(...this.BRAND_COLORS.light);
        doc.rect(margin, yPosition - 3, pageWidth - 2 * margin, rowHeight, 'F');
      }

      currentX = margin + 5;
      addText(item.description, currentX, yPosition, 9, false, this.BRAND_COLORS.black);
      currentX += colWidths.description;

      addText(item.quantity.toString(), currentX + colWidths.quantity/2, yPosition, 9, false, this.BRAND_COLORS.black, 'center');
      currentX += colWidths.quantity;

      addText(`€${item.unitPrice.toFixed(2)}`, currentX + colWidths.unitPrice/2, yPosition, 9, false, this.BRAND_COLORS.black, 'center');
      currentX += colWidths.unitPrice;

      addText(`€${item.total.toFixed(2)}`, currentX + colWidths.total/2, yPosition, 9, true, this.BRAND_COLORS.dark, 'center');

      yPosition += rowHeight;
    });

    yPosition += 10;

    // === TOTAIS ===
    const totalsX = pageWidth - margin - 60;
    const totalsBoxY = yPosition;

    doc.setDrawColor(...this.BRAND_COLORS.secondary);
    doc.setLineWidth(1);
    doc.rect(totalsX - 5, totalsBoxY - 5, 65, 35, 'D');

    addText('Subtotal:', totalsX, yPosition, 10, false, this.BRAND_COLORS.black);
    addText(`€${data.subtotal.toFixed(2)}`, totalsX + 45, yPosition, 10, false, this.BRAND_COLORS.black, 'right');
    yPosition += 6;

    if (data.discount) {
      addText('Desconto:', totalsX, yPosition, 10, false, this.BRAND_COLORS.black);
      addText(`-€${data.discount.toFixed(2)}`, totalsX + 45, yPosition, 10, false, this.BRAND_COLORS.danger, 'right');
      yPosition += 6;
    }

    if (data.shipping) {
      addText('Envio:', totalsX, yPosition, 10, false, this.BRAND_COLORS.black);
      addText(`€${data.shipping.toFixed(2)}`, totalsX + 45, yPosition, 10, false, this.BRAND_COLORS.black, 'right');
      yPosition += 6;
    }

    addText('IVA:', totalsX, yPosition, 10, false, this.BRAND_COLORS.black);
    addText(`€${data.taxAmount.toFixed(2)}`, totalsX + 45, yPosition, 10, false, this.BRAND_COLORS.black, 'right');
    yPosition += 8;

    // Linha divisória
    doc.setLineWidth(1);
    doc.line(totalsX, yPosition - 2, totalsX + 50, yPosition - 2);

    // Total final
    doc.setFillColor(...this.BRAND_COLORS.secondary);
    doc.rect(totalsX - 5, yPosition - 2, 65, 10, 'F');
    addText('TOTAL:', totalsX, yPosition + 3, 12, true, this.BRAND_COLORS.white);
    addText(`€${data.total.toFixed(2)}`, totalsX + 45, yPosition + 3, 12, true, this.BRAND_COLORS.white, 'right');

    yPosition += 20;

    // === NOTAS E CONDICOES ===
    if (data.notes || yPosition < pageHeight - 60) {
      doc.setFillColor(...this.BRAND_COLORS.light);
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');

      addText('NOTAS E CONDICOES:', margin + 5, yPosition + 8, 10, true, this.BRAND_COLORS.primary);

      const notes = data.notes || 'Obrigado pela sua preferencia! Produtos com garantia de qualidade.';
      const conditions = 'Pagamento em ate 30 dias. Produtos sujeitos a disponibilidade.';

      addText(notes, margin + 5, yPosition + 14, 9, false, this.BRAND_COLORS.black);
      addText(conditions, margin + 5, yPosition + 18, 9, false, this.BRAND_COLORS.gray);
      addText('Duvidas? Entre em contato: Tel +351 928 375 226', margin + 5, yPosition + 22, 8, false, this.BRAND_COLORS.gray);
    }

    // === RODAPÉ ===
    const footerY = pageHeight - 20;
    doc.setFillColor(...this.BRAND_COLORS.primary);
    doc.rect(0, footerY, pageWidth, 20, 'F');

    addText(`Nota Fiscal gerada em ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR')}`,
           pageWidth / 2, footerY + 8, 8, false, this.BRAND_COLORS.white, 'center');

    addText('JC Hair Studio\'s 62 - Produtos Premium para Cabelo',
           pageWidth / 2, footerY + 12, 8, false, this.BRAND_COLORS.secondary, 'center');

    addText('Documento gerado digitalmente - Sistema Certificado',
           pageWidth / 2, footerY + 16, 7, false, this.BRAND_COLORS.secondary, 'center');

    return doc.output('blob');
  }

  static downloadInvoice(data: InvoiceData): void {
    const blob = this.generateInvoicePDF(data);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nota-fiscal-${data.invoiceNumber}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  static async printInvoice(data: InvoiceData): Promise<void> {
    const blob = this.generateInvoicePDF(data);
    const url = window.URL.createObjectURL(blob);

    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 10000);
  }
}