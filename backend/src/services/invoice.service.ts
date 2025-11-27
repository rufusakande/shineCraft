import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

interface InvoiceItem {
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoiceData {
  orderNumber: string;
  orderDate: Date;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  shippingCost: number;
  tax?: number;
  total: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
}

class InvoiceService {
  /**
   * Generate a PDF invoice buffer
   */
  async generateInvoice(invoiceData: InvoiceData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
        });

        // Collect PDF data
        const chunks: Buffer[] = [];
        doc.on('data', (chunk: any) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        this.addHeader(doc, invoiceData);

        // Customer Info
        this.addCustomerInfo(doc, invoiceData);

        // Items Table
        this.addItemsTable(doc, invoiceData);

        // Totals
        this.addTotals(doc, invoiceData);

        // Footer
        this.addFooter(doc, invoiceData);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private addHeader(doc: any, data: InvoiceData): void {
    // Background color for header
    doc
      .fillColor('#1e3c72')
      .rect(0, 0, 595, 120)
      .fill();

    // Company Name with styling
    doc
      .fillColor('white')
      .fontSize(28)
      .font('Helvetica-Bold')
      .text('✨ ShineCraft', 50, 30);

    // Invoice label
    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('FACTURE', 400, 35);

    // Invoice number and date
    doc
      .fontSize(11)
      .font('Helvetica')
      .text(`Numéro: ${data.orderNumber}`, 400, 55)
      .text(`Date: ${data.orderDate.toLocaleDateString('fr-FR', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, 400, 70);

    // Reset for content
    doc.fillColor('black');
  }

  private addCustomerInfo(doc: any, data: InvoiceData): void {
    const startY = 135;

    // Two columns layout
    const leftCol = 50;
    const rightCol = 320;
    const colWidth = 240;

    // LEFT COLUMN - Invoice Details
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#1e3c72')
      .text('INFORMATIONS DE COMMANDE', leftCol, startY);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('black');

    const boxHeight = 70;
    // Draw box
    doc
      .strokeColor('#e0e0e0')
      .lineWidth(1)
      .rect(leftCol - 5, startY + 15, colWidth, boxHeight)
      .stroke();

    doc
      .text('Numéro de commande:', leftCol + 8, startY + 22)
      .font('Helvetica-Bold')
      .text(data.orderNumber, leftCol + 8, startY + 35)
      .font('Helvetica')
      .text('Statut de paiement:', leftCol + 8, startY + 52)
      .font('Helvetica-Bold')
      .fillColor(data.paymentStatus === 'completed' ? '#4caf50' : '#ff9800')
      .text(data.paymentStatus === 'completed' ? '✓ Payé' : '⏳ En attente', leftCol + 8, startY + 65)
      .fillColor('black');

    // RIGHT COLUMN - Company Info
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#1e3c72')
      .text('INFORMATIONS SHIECRAFT', rightCol, startY);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('black');

    doc
      .rect(rightCol - 5, startY + 15, colWidth, boxHeight)
      .stroke();

    doc
      .text('ShineCraft', rightCol + 8, startY + 22)
      .text('Email: support@shinecraft.com', rightCol + 8, startY + 35)
      .text('Tél: +229 XX XX XX XX', rightCol + 8, startY + 48)
      .text('Cotonou, Bénin', rightCol + 8, startY + 61);

    // CUSTOMER INFO SECTION
    const customerStartY = startY + 100;
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#1e3c72')
      .text('INFORMATIONS CLIENT', leftCol, customerStartY);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('black');

    const customerBoxHeight = 55;
    doc
      .strokeColor('#e0e0e0')
      .rect(leftCol - 5, customerStartY + 15, colWidth, customerBoxHeight)
      .stroke();

    doc
      .font('Helvetica-Bold')
      .text(data.customerName, leftCol + 8, customerStartY + 22)
      .font('Helvetica')
      .text(data.customerEmail, leftCol + 8, customerStartY + 35);
    if (data.customerPhone) {
      doc.text(`Tél: ${data.customerPhone}`, leftCol + 8, customerStartY + 48);
    }

    // SHIPPING ADDRESS SECTION
    const shippingStartY = customerStartY;
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#1e3c72')
      .text('ADRESSE DE LIVRAISON', rightCol, shippingStartY);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('black');

    doc
      .strokeColor('#e0e0e0')
      .rect(rightCol - 5, shippingStartY + 15, colWidth, customerBoxHeight)
      .stroke();

    doc
      .text(data.shippingAddress.street, rightCol + 8, shippingStartY + 22)
      .text(`${data.shippingAddress.postalCode} ${data.shippingAddress.city}`, rightCol + 8, shippingStartY + 35)
      .text(data.shippingAddress.country, rightCol + 8, shippingStartY + 48);
  }

  private addItemsTable(doc: any, data: InvoiceData): void {
    const tableTop = 320;
    const itemHeight = 25;
    const col1 = 50;      // Product name
    const col2 = 310;     // Quantity
    const col3 = 375;     // Unit price
    const col4 = 470;     // Total

    // Table Headers with background
    doc
      .fillColor('#1e3c72')
      .rect(col1 - 5, tableTop - 5, 505, 25)
      .fill();

    doc
      .fillColor('white')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('PRODUIT', col1, tableTop + 5)
      .text('QTÉ', col2, tableTop + 5)
      .text('PRIX UNITAIRE', col3, tableTop + 5)
      .text('MONTANT', col4, tableTop + 5);

    // Table Rows
    doc.fillColor('black').font('Helvetica').fontSize(9);
    let yPosition = tableTop + 30;
    let rowIndex = 0;

    data.items.forEach((item) => {
      // Alternating row background
      if (rowIndex % 2 === 0) {
        doc
          .fillColor('#f5f5f5')
          .rect(col1 - 5, yPosition - 5, 505, itemHeight)
          .fill();
        doc.fillColor('black');
      }

      const priceFormatted = this.formatPrice(item.price);
      const totalFormatted = this.formatPrice(item.total);

      doc
        .text(item.productName, col1, yPosition, { width: 250 })
        .text(item.quantity.toString(), col2, yPosition)
        .text(priceFormatted, col3, yPosition)
        .text(totalFormatted, col4, yPosition);

      yPosition += itemHeight;
      rowIndex++;
    });

    // Table Bottom Border
    doc
      .strokeColor('#1e3c72')
      .lineWidth(2)
      .moveTo(col1 - 5, yPosition)
      .lineTo(col1 + 500, yPosition)
      .stroke();
  }

  private formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  private addTotals(doc: any, data: InvoiceData): void {
    const startY = 530;
    const labelCol = 330;
    const valueCol = 470;

    doc.fontSize(10).font('Helvetica');

    // Subtotal
    doc
      .fillColor('#333')
      .text('Sous-total:', labelCol, startY);
    doc
      .font('Helvetica-Bold')
      .text(this.formatPrice(data.subtotal), valueCol, startY, { align: 'right' });

    // Shipping
    doc
      .font('Helvetica')
      .fillColor('#333')
      .text('Frais de livraison:', labelCol, startY + 18);
    doc
      .font('Helvetica-Bold')
      .text(
        data.shippingCost > 0 ? this.formatPrice(data.shippingCost) : 'Gratuit',
        valueCol,
        startY + 18,
        { align: 'right' }
      );

    // Tax (if applicable)
    if (data.tax && data.tax > 0) {
      doc
        .font('Helvetica')
        .fillColor('#333')
        .text('Taxes:', labelCol, startY + 36);
      doc
        .font('Helvetica-Bold')
        .text(this.formatPrice(data.tax), valueCol, startY + 36, { align: 'right' });
    }

    // Total with background
    const totalBoxTop = startY + (data.tax && data.tax > 0 ? 54 : 36);
    doc
      .fillColor('#1e3c72')
      .rect(labelCol - 10, totalBoxTop, 170, 28)
      .fill();

    doc
      .fillColor('white')
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('TOTAL:', labelCol - 5, totalBoxTop + 6);
    doc.text(this.formatPrice(data.total), valueCol, totalBoxTop + 6, { align: 'right' });

    // Payment Status
    const statusBoxTop = totalBoxTop + 35;
    const statusText =
      data.paymentStatus === 'completed'
        ? '✓ PAIEMENT REÇU'
        : '⏳ PAIEMENT EN ATTENTE';
    const statusColor = data.paymentStatus === 'completed' ? '#4caf50' : '#ff9800';

    doc
      .fillColor(statusColor)
      .rect(labelCol - 10, statusBoxTop, 170, 22)
      .fill();

    doc
      .fillColor('white')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text(statusText, labelCol - 5, statusBoxTop + 4);
  }

  private addFooter(doc: any, data: InvoiceData): void {
    const footerY = 720;

    // Horizontal line
    doc
      .strokeColor('#1e3c72')
      .lineWidth(2)
      .moveTo(50, footerY)
      .lineTo(545, footerY)
      .stroke();

    // Footer Text - Thank you message
    doc
      .fontSize(10)
      .fillColor('#555')
      .font('Helvetica')
      .text(
        'Merci pour votre achat! Pour toute question ou besoin d\'assistance, veuillez nous contacter.',
        50,
        footerY + 12,
        { align: 'center', width: 495 }
      );

    // Contact info
    doc
      .fontSize(9)
      .fillColor('#666')
      .text(
        'support@shinecraft.com | +229 XX XX XX XX | www.shinecraft.com',
        50,
        footerY + 28,
        { align: 'center', width: 495 }
      );

    // Copyright with dynamic year
    const currentYear = new Date().getFullYear();
    doc
      .fontSize(8)
      .fillColor('#999')
      .font('Helvetica')
      .text(
        `ShineCraft © ${currentYear} - Tous droits réservés`,
        50,
        footerY + 42,
        { align: 'center', width: 495 }
      );
  }
}

export default new InvoiceService();
