import nodemailer, { Transporter } from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

class EmailService {
  private transporter: Transporter | null = null;
  private isConfigured = false;

  private initializeTransporter(): void {
    if (this.transporter) {
      return;
    }

    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPassword = process.env.SMTP_PASSWORD?.trim();
    const smtpHost = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

    if (!smtpUser || !smtpPassword) {
      console.warn('⚠️  SMTP Email Service: Missing credentials');
      console.warn('   Please configure SMTP_USER and SMTP_PASSWORD in .env');
      this.isConfigured = false;
      return;
    }

    this.isConfigured = true;

    try {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      });

      console.log('✅ SMTP Email Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize SMTP transporter:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Send a welcome email to new users
   */
  async sendWelcomeEmail(
    userEmail: string,
    userName: string
  ): Promise<void> {
    this.initializeTransporter();

    if (!this.isConfigured || !this.transporter) {
      console.warn('⚠️  Welcome email skipped: SMTP not configured');
      return;
    }

    const htmlContent = this.getWelcomeTemplate(userName);

    try {
      await this.transporter.sendMail({
        to: userEmail,
        subject: 'Bienvenue chez ShineCraft! 🎉',
        html: htmlContent,
      });
      console.log(`✅ Welcome email sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  /**
   * Send order confirmation email with invoice
   */
  async sendOrderConfirmationEmail(
    userEmail: string,
    userName: string,
    order: any
  ): Promise<void> {
    this.initializeTransporter();

    if (!this.isConfigured || !this.transporter) {
      console.warn('⚠️  Order confirmation email skipped: SMTP not configured');
      return;
    }

    const htmlContent = this.getOrderInvoiceTemplate(userName, order);

    try {
      await this.transporter.sendMail({
        to: userEmail,
        subject: `Confirmation de commande - Facture ${order.reference || order.id}`,
        html: htmlContent,
      });
      console.log(`✅ Order confirmation email sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw new Error('Failed to send order confirmation email');
    }
  }

  /**
   * Template for welcome email
   */
  private getWelcomeTemplate(userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .content p {
              margin: 10px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
            .highlight {
              color: #667eea;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ Bienvenue chez ShineCraft!</h1>
            </div>
            <div class="content">
              <p>Bonjour <span class="highlight">${userName}</span>,</p>
              
              <p>Merci de vous être inscrit(e) chez ShineCraft! Nous sommes ravi(e)s de vous accueillir dans notre communauté.</p>
              
              <p>Vous pouvez maintenant:</p>
              <ul>
                <li>Consulter notre large gamme de produits de qualité</li>
                <li>Accéder à votre profil personnel</li>
                <li>Suivre vos commandes en temps réel</li>
                <li>Recevoir des mises à jour exclusives</li>
              </ul>
              
              <p>Si vous avez des questions, n'hésitez pas à nous contacter à travers notre page de support.</p>
              
              <p>Bonne exploration!<br>
              <span class="highlight">L'équipe ShineCraft</span></p>
            </div>
            <div class="footer">
              <p>ShineCraft © ${new Date().getFullYear()} Tous droits réservés.</p>
              <p>Vous avez reçu cet email car vous avez créé un compte chez ShineCraft</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Template for order confirmation email
   */
  private getOrderConfirmationTemplate(
    userName: string,
    orderNumber: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .content p {
              margin: 10px 0;
            }
            .order-info {
              background: white;
              padding: 20px;
              border-radius: 4px;
              border-left: 4px solid #667eea;
              margin: 20px 0;
            }
            .order-info h3 {
              margin-top: 0;
              color: #667eea;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
            .highlight {
              color: #667eea;
              font-weight: bold;
            }
            .status {
              background: #e8f5e9;
              color: #2e7d32;
              padding: 10px;
              border-radius: 4px;
              text-align: center;
              margin: 20px 0;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Commande Confirmée!</h1>
            </div>
            <div class="content">
              <p>Bonjour <span class="highlight">${userName}</span>,</p>
              
              <p>Merci pour votre commande! Nous vous confirmions que votre commande a été reçue et traitée avec succès.</p>
              
              <div class="status">
                Commande en cours de préparation
              </div>
              
              <div class="order-info">
                <h3>Détails de la Commande</h3>
                <div class="info-row">
                  <span>Numéro de commande:</span>
                  <strong>${orderNumber}</strong>
                </div>
                <div class="info-row">
                  <span>Date:</span>
                  <strong>${new Date().toLocaleDateString('fr-FR')}</strong>
                </div>
              </div>
              
              <p>📎 <strong>Facture jointe:</strong> Vous trouverez la facture détaillée en pièce jointe à cet email. Elle contient tous les détails de votre commande.</p>
              
              <p><strong>Prochaines étapes:</strong></p>
              <ul>
                <li>Votre commande est en cours de préparation</li>
                <li>Vous recevrez une notification lorsque votre colis sera expédié</li>
                <li>Suivez votre commande dans votre espace personnel</li>
              </ul>
              
              <p>Si vous avez des questions, consultez notre FAQ ou contactez notre support client.</p>
              
              <p>Merci pour votre confiance!<br>
              <span class="highlight">L'équipe ShineCraft</span></p>
            </div>
            <div class="footer">
              <p>ShineCraft © 2024. Tous droits réservés.</p>
              <p>Cet email contient des informations importantes concernant votre commande</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Template for order invoice email
   */
  private getOrderInvoiceTemplate(userName: string, order: any): string {
    const items = order.items || [];
    const subtotal = items.reduce((sum: number, item: any) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
    
    const shippingCost = order.shippingCost || 0;
    const tax = order.tax || 0;
    const total = order.total || (subtotal + shippingCost + tax);

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
      }).format(price);
    };

    const formatDate = (date: any) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: #2c3e50;
            line-height: 1.6;
            background: #f5f7fa;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          
          /* Header */
          .header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
            font-weight: 700;
            letter-spacing: 1px;
          }
          .header p {
            font-size: 14px;
            opacity: 0.9;
          }
          
          /* Main Content */
          .content {
            padding: 40px 30px;
          }
          
          .greeting {
            margin-bottom: 30px;
            font-size: 16px;
          }
          .greeting strong {
            color: #1e3c72;
          }
          
          /* Order Status */
          .status-badge {
            display: inline-block;
            background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: 600;
            margin: 20px 0;
            font-size: 14px;
          }
          
          /* Invoice Details */
          .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            flex-wrap: wrap;
            gap: 20px;
            padding-bottom: 20px;
            border-bottom: 2px solid #ecf0f1;
          }
          .invoice-info {
            flex: 1;
            min-width: 200px;
          }
          .invoice-info h3 {
            font-size: 12px;
            text-transform: uppercase;
            color: #7f8c8d;
            margin-bottom: 8px;
            font-weight: 600;
            letter-spacing: 1px;
          }
          .invoice-info p {
            font-size: 15px;
            color: #2c3e50;
            margin-bottom: 5px;
          }
          .invoice-info .highlight {
            font-weight: 700;
            color: #1e3c72;
            font-size: 16px;
          }
          
          /* Items Table */
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          .items-table thead {
            background: #ecf0f1;
          }
          .items-table th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #2c3e50;
            font-size: 14px;
            text-transform: uppercase;
            border-bottom: 2px solid #bdc3c7;
          }
          .items-table td {
            padding: 15px;
            border-bottom: 1px solid #ecf0f1;
            font-size: 14px;
          }
          .items-table tbody tr:hover {
            background: #f9f9f9;
          }
          .item-name {
            font-weight: 600;
            color: #1e3c72;
          }
          .item-price,
          .item-quantity,
          .item-total {
            text-align: right;
            font-weight: 500;
            color: #2c3e50;
          }
          
          /* Summary */
          .summary {
            display: flex;
            justify-content: flex-end;
            margin: 30px 0;
          }
          .summary-box {
            width: 100%;
            max-width: 350px;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            font-size: 14px;
            border-bottom: 1px solid #ecf0f1;
          }
          .summary-row.subtotal {
            color: #7f8c8d;
          }
          .summary-row.shipping {
            color: #7f8c8d;
          }
          .summary-row.tax {
            color: #7f8c8d;
          }
          .summary-row.total {
            padding: 15px 0;
            font-size: 18px;
            font-weight: 700;
            border-bottom: none;
            border-top: 2px solid #1e3c72;
            color: #1e3c72;
          }
          .summary-row strong {
            font-weight: 600;
          }
          
          /* Shipping Address */
          .shipping-section {
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-left: 4px solid #1e3c72;
            border-radius: 4px;
          }
          .shipping-section h3 {
            font-size: 14px;
            text-transform: uppercase;
            color: #1e3c72;
            margin-bottom: 12px;
            font-weight: 600;
            letter-spacing: 0.5px;
          }
          .shipping-section p {
            font-size: 14px;
            color: #2c3e50;
            line-height: 1.8;
            margin-bottom: 5px;
          }
          
          /* Notes */
          .notes {
            background: #ecf9ff;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 13px;
            color: #2c3e50;
          }
          .notes strong {
            color: #1e3c72;
          }
          
          /* Footer */
          .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 2px solid #ecf0f1;
          }
          .footer p {
            font-size: 13px;
            color: #7f8c8d;
            margin-bottom: 10px;
          }
          .footer-brand {
            font-size: 16px;
            font-weight: 700;
            color: #1e3c72;
            margin-bottom: 10px;
          }
          .footer-contact {
            font-size: 12px;
            color: #95a5a6;
            margin-top: 15px;
            border-top: 1px solid #ecf0f1;
            padding-top: 15px;
          }
          
          /* Responsive */
          @media (max-width: 600px) {
            .content {
              padding: 20px;
            }
            .invoice-header {
              flex-direction: column;
            }
            .items-table {
              font-size: 12px;
            }
            .items-table th,
            .items-table td {
              padding: 10px 5px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <h1>✨ ShineCraft</h1>
            <p>Facture de Commande</p>
          </div>
          
          <!-- Content -->
          <div class="content">
            <!-- Greeting -->
            <div class="greeting">
              Bonjour <strong>${userName}</strong>,
              <br><br>
              Merci pour votre achat chez ShineCraft! Veuillez trouver ci-dessous les détails de votre commande.
            </div>
            
            <!-- Status -->
            <div class="status-badge">✓ Commande Confirmée</div>
            
            <!-- Invoice Header -->
            <div class="invoice-header">
              <div class="invoice-info">
                <h3>Référence Commande</h3>
                <p class="highlight">${order.reference || order.id}</p>
              </div>
              <div class="invoice-info">
                <h3>Date de Commande</h3>
                <p>${formatDate(order.createdAt || new Date())}</p>
              </div>
              <div class="invoice-info">
                <h3>Statut</h3>
                <p class="highlight" style="color: #27ae60;">En Préparation</p>
              </div>
            </div>
            
            <!-- Items Table -->
            <table class="items-table">
              <thead>
                <tr>
                  <th>Produit</th>
                  <th style="text-align: right;">Prix Unitaire</th>
                  <th style="text-align: right;">Quantité</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${items.map((item: any) => {
                  const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price || 0;
                  const quantity = item.quantity || 1;
                  const itemTotal = price * quantity;
                  return `
                    <tr>
                      <td class="item-name">${item.name || item.title || 'Produit'}</td>
                      <td class="item-price">${formatPrice(price)}</td>
                      <td class="item-quantity" style="text-align: center;">${quantity}</td>
                      <td class="item-total">${formatPrice(itemTotal)}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            
            <!-- Summary -->
            <div class="summary">
              <div class="summary-box">
                <div class="summary-row subtotal">
                  <span>Sous-total:</span>
                  <strong>${formatPrice(subtotal)}</strong>
                </div>
                <div class="summary-row shipping">
                  <span>Frais de livraison:</span>
                  <strong>${shippingCost > 0 ? formatPrice(shippingCost) : 'Gratuit'}</strong>
                </div>
                <div class="summary-row tax">
                  <span>Taxes:</span>
                  <strong>${formatPrice(tax)}</strong>
                </div>
                <div class="summary-row total">
                  <span>TOTAL:</span>
                  <strong>${formatPrice(total)}</strong>
                </div>
              </div>
            </div>
            
            <!-- Shipping Address -->
            ${order.shippingAddress ? `
            <div class="shipping-section">
              <h3>📦 Adresse de Livraison</h3>
              <p>${order.shippingAddress.firstName || ''} ${order.shippingAddress.lastName || ''}</p>
              <p>${order.shippingAddress.street || order.shippingAddress.address || ''}</p>
              <p>${order.shippingAddress.zipCode || ''} ${order.shippingAddress.city || ''}</p>
              <p>${order.shippingAddress.country || 'Bénin'}</p>
            </div>
            ` : ''}
            
            <!-- Notes -->
            <div class="notes">
              <strong>📌 Important:</strong> Vérifiez votre commande à la réception. En cas de problème, contactez-nous immédiatement.
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <div class="footer-brand">ShineCraft</div>
            <p>Merci de votre confiance!</p>
            <p>Vous pouvez suivre votre commande sur votre compte ShineCraft.</p>
            <div class="footer-contact">
              <p>© ${new Date().getFullYear()} ShineCraft. Tous droits réservés.</p>
              <p>Email: support@shinecraft.com | Tél: +229 XX XX XX XX</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();
