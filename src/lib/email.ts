import nodemailer from 'nodemailer';
import { logger } from './logger';

interface QuoteEmailData {
  quoteId: number;
  customerName: string;
  customerEmail: string;
  company?: string;
  country?: string;
  currency: string;
  totalAmount?: number;
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  message?: string;
  quoteNumber: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendQuoteEmail(quoteData: QuoteEmailData, recipientEmail: string): Promise<boolean> {
    try {
      const htmlContent = this.generateQuoteHTML(quoteData);

      const mailOptions = {
        from: `"ZIVAH International" <${process.env.EMAIL_FROM}>`,
        to: recipientEmail,
        subject: `Cotización ${quoteData.quoteNumber} - ZIVAH International`,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Quote email sent successfully', { quoteId: quoteData.quoteId, messageId: info.messageId });
      return true;
    } catch (error) {
      logger.error('Failed to send quote email', { error: error instanceof Error ? error.message : String(error), quoteId: quoteData.quoteId });
      return false;
    }
  }

  private generateQuoteHTML(data: QuoteEmailData): string {
    const itemsHTML = data.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${data.currency} ${item.unitPrice.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${data.currency} ${item.totalPrice.toFixed(2)}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Cotización ${data.quoteNumber}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50;">ZIVAH International</h1>
            <p style="color: #7f8c8d;">Productos Premium de Ecuador</p>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h2>Cotización ${data.quoteNumber}</h2>
            <p><strong>Cliente:</strong> ${data.customerName}</p>
            ${data.company ? `<p><strong>Empresa:</strong> ${data.company}</p>` : ''}
            ${data.country ? `<p><strong>País:</strong> ${data.country}</p>` : ''}
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #3498db; color: white;">
                <th style="padding: 10px; text-align: left;">Producto</th>
                <th style="padding: 10px; text-align: center;">Cantidad</th>
                <th style="padding: 10px; text-align: right;">Precio Unit.</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            ${data.totalAmount ? `
            <tfoot>
              <tr style="background: #ecf0f1;">
                <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px;">${data.currency} ${data.totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
            ` : ''}
          </table>

          ${data.message ? `
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3>Mensaje del Cliente:</h3>
            <p>${data.message}</p>
          </div>
          ` : ''}

          <div style="background: #d4edda; padding: 15px; border-radius: 5px;">
            <h3>Información de Contacto:</h3>
            <p>Email: ${data.customerEmail}</p>
            <p>Teléfono: +593 4 234 5678</p>
            <p>Website: www.zivahinternational.com</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #7f8c8d; font-size: 12px;">
            <p>Esta cotización es válida por 30 días a partir de la fecha de emisión.</p>
            <p>ZIVAH International S.A. - Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();