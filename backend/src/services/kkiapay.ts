/**
 * Service Kkiapay pour gérer les paiements
 * Gère les transactions, vérifications et webhooks
 */

import axios from 'axios';
import crypto from 'crypto';

interface KkiapayConfig {
  publicKey: string;
  privateKey: string;
  secret: string;
  sandbox?: boolean;
}

interface TransactionData {
  amount: number;
  email: string;
  name: string;
  phone: string;
  reason: string;
  transactionId: string;
}

interface VerifyTransactionResponse {
  success: boolean;
  transactionId?: string;
  status?: string;
  amount?: number;
  phone?: string;
  email?: string;
  paymentMethod?: string;
  createdAt?: string;
}

class KkiapayService {
  private publicKey: string;
  private privateKey: string;
  private secret: string;
  private baseUrl: string;

  constructor(config: KkiapayConfig) {
    this.publicKey = config.publicKey;
    this.privateKey = config.privateKey;
    this.secret = config.secret;
    // URL de base de l'API Kkiapay (production)
    this.baseUrl = 'https://api.kkiapay.com';
  }

  /**
   * Initier une transaction (appelé par le frontend)
   * Crée une référence de paiement
   */
  async initiateTransaction(data: {
    amount: number;
    email: string;
    name: string;
    phone: string;
    reason: string;
    reference: string;
  }) {
    try {
      // Validation des données
      if (!data.amount || data.amount <= 0) {
        throw new Error('Montant invalide');
      }

      if (!data.phone || !data.email) {
        throw new Error('Téléphone et email requis');
      }

      // Retourner les données pour initier le paiement côté client
      return {
        success: true,
        reference: data.reference,
        amount: data.amount,
        email: data.email,
        name: data.name,
        phone: data.phone,
        reason: data.reason,
      };
    } catch (error) {
      console.error('Erreur lors de l\'initiation de la transaction:', error);
      throw error;
    }
  }

  /**
   * Vérifier une transaction auprès de Kkiapay
   * Appelé après le paiement depuis le frontend
   */
  async verifyTransaction(reference: string): Promise<VerifyTransactionResponse> {
    try {
      // Appel à l'API Kkiapay pour vérifier
      const response = await axios.get(
        `${this.baseUrl}/transactions/verify`,
        {
          headers: {
            'Authorization': `Bearer ${this.privateKey}`,
            'Content-Type': 'application/json',
          },
          params: {
            transactionId: reference,
          },
        }
      );

      // La transaction est valide si status = success
      if (response.data && response.data.status === 'SUCCESS') {
        return {
          success: true,
          transactionId: response.data.transactionId,
          status: response.data.status,
          amount: response.data.amount,
          phone: response.data.phone,
          email: response.data.email,
          paymentMethod: response.data.paymentMethod || 'mobile_money',
          createdAt: response.data.createdAt,
        };
      }

      return {
        success: false,
        status: response.data?.status || 'PENDING',
      };
    } catch (error) {
      console.error('Erreur lors de la vérification de la transaction:', error);
      return {
        success: false,
      };
    }
  }

  /**
   * Vérifier la signature du webhook Kkiapay
   * S'assure que le webhook vient vraiment de Kkiapay
   */
  verifyWebhookSignature(signature: string, payload: any): boolean {
    try {
      // Créer un hash HMAC-SHA256 du payload avec le secret
      const hash = crypto
        .createHmac('sha256', this.secret)
        .update(JSON.stringify(payload))
        .digest('hex');

      // Comparer avec la signature reçue
      return crypto.timingSafeEqual(
        Buffer.from(hash),
        Buffer.from(signature)
      );
    } catch (error) {
      console.error('Erreur lors de la vérification de signature:', error);
      return false;
    }
  }

  /**
   * Générer une référence unique pour une commande
   */
  generateReference(prefix = 'ORD'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Logger une transaction (pour debugging)
   */
  logTransaction(reference: string, data: any): void {
    console.log(`[KKIAPAY] Transaction ${reference}:`, data);
  }
}

// Initialiser le service Kkiapay avec les variables d'environnement
export const kkiapayService = new KkiapayService({
  publicKey: process.env.KKIAPAY_PUBLIC_KEY || '',
  privateKey: process.env.KKIAPAY_PRIVATE_KEY || '',
  secret: process.env.KKIAPAY_SECRET || '',
  sandbox: process.env.NODE_ENV !== 'production',
});

export default KkiapayService;
