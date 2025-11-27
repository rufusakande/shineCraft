/**
 * Routes pour les paiements Kkiapay
 * Gère l'initiation, vérification et webhooks
 */

import { Router, Request, Response } from 'express';
import { kkiapayService } from '../services/kkiapay';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';
import Order from '../models/Order';
import { Payment } from '../models/Payment';
import { OrderAddress } from '../models/types';
import emailService from '../services/email.service';
import invoiceService from '../services/invoice.service';

const router = Router();

/**
 * POST /api/payments/init
 * Initier un paiement - Créer une commande en attente
 */
router.post('/init', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { amount, items, shippingAddress, shippingMethod, email, phone, firstName, lastName } = req.body;
    const userId = req.user?.id;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Montant invalide' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Aucun article' });
    }

    if (!phone || !email) {
      return res.status(400).json({ error: 'Téléphone et email requis' });
    }

    // Générer une référence unique
    const reference = kkiapayService.generateReference();

    // Créer la commande en statut "pending"
    const order = await Order.create({
      userId,
      reference,
      items: items as any,
      amount,
      total: amount,  // total égal à amount
      status: 'pending',
      paymentMethod: 'kkiapay',
      shippingAddress: shippingAddress || undefined,
      shippingMethod: shippingMethod || 'standard',
      customerName: `${firstName} ${lastName}`,
      customerEmail: email,
      customerPhone: phone,
    } as any);

    // Créer l'enregistrement de paiement
    const payment = await Payment.create({
      orderId: order.id!,
      reference,
      amount,
      status: 'pending',
      paymentMethod: 'kkiapay',
      customerPhone: phone,
      customerEmail: email,
      items: items as any,
    } as any);

    kkiapayService.logTransaction(reference, {
      orderId: order.id,
      amount,
      phone,
      email,
    });

    // Retourner la référence et les infos pour le paiement
    res.json({
      success: true,
      reference,
      amount,
      orderId: order.id,
      email,
      phone,
      name: `${firstName} ${lastName}`,
      reason: 'Achat de bijoux ShineCraft',
    });
  } catch (error) {
    console.error('Erreur init paiement:', error);
    res.status(500).json({ error: 'Erreur lors de l\'initiation du paiement' });
  }
});

/**
 * POST /api/payments/verify
 * Vérifier un paiement après la transaction
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({ error: 'Référence manquante' });
    }

    // Chercher le paiement en attente
    const payment = await Payment.findOne({ where: { reference } });

    if (!payment) {
      return res.status(404).json({ error: 'Paiement non trouvé' });
    }

    // Mode développement: accepter les paiements mock
    let verifyResult: any;
    if (reference.startsWith('MOCK-') || reference.startsWith('ORD-')) {
      // Mode développement: accepter automatiquement
      console.log(`[DEV MODE] Acceptation automatique du paiement: ${reference}`);
      verifyResult = {
        success: true,
        transactionId: `MOCK-${Date.now()}`,
        status: 'SUCCESS',
        paymentMethod: 'mock_payment',
      };
    } else {
      // Mode production: vérifier avec Kkiapay
      verifyResult = await kkiapayService.verifyTransaction(reference);
    }

    if (!verifyResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Paiement non validé par Kkiapay',
        status: verifyResult.status,
      });
    }

    // Mettre à jour le paiement
    await payment.update({
      status: 'paid',
      transactionId: verifyResult.transactionId,
      paymentMethod: verifyResult.paymentMethod || 'mobile_money',
      paidAt: new Date(),
    });

    // Mettre à jour la commande
    const order = await Order.findByPk(payment.orderId);
    if (order) {
      await order.update({
        status: 'paid',
        transactionId: verifyResult.transactionId,
      });

      // Send order confirmation email with invoice in background (non-blocking)
      console.log(`📧 Payment verified for order ${order.id} - Sending confirmation email...`);
      (async () => {
        try {
          const customerEmail = order.customerEmail || payment.customerEmail;
          const customerName = order.customerName || 'Client';

          if (!customerEmail) {
            console.warn(`⚠️ No email found for order ${order.id}`);
            return;
          }

          console.log(`🔄 Generating invoice for order ${order.id}...`);

          // Prepare invoice data
          const orderItems = Array.isArray(order.items) ? order.items : [];
          const shippingAddress = order.shippingAddress || {
            street: '',
            city: '',
            postalCode: '',
            country: '',
          };

          const invoiceData = {
            orderNumber: `SHC-${(order.id || 0).toString().padStart(6, '0')}`,
            orderDate: order.createdAt || new Date(),
            customerName: customerName,
            customerEmail: customerEmail,
            customerPhone: order.customerPhone || payment.customerPhone,
            shippingAddress: {
              street: (shippingAddress as any)?.street || '',
              city: (shippingAddress as any)?.city || '',
              postalCode: (shippingAddress as any)?.postalCode || (shippingAddress as any)?.zipCode || '',
              country: (shippingAddress as any)?.country || '',
            },
            items: orderItems.map((item: any) => ({
              productName: `Product #${item.productId}`,
              quantity: item.qty || item.quantity || 1,
              price: Number(item.price) || 0,
              total: (Number(item.price) || 0) * (item.qty || item.quantity || 1),
            })),
            subtotal: Number(order.amount) || Number(order.total) || 0,
            shippingCost: 0,
            tax: 0,
            total: Number(order.total) || Number(order.amount) || 0,
            paymentStatus: 'completed' as const,
          };

          console.log(`📄 Invoice data prepared for order ${order.id}`);

          // Send email with invoice
          console.log(`📧 Sending order confirmation email to ${customerEmail}...`);
          await emailService.sendOrderConfirmationEmail(
            customerEmail,
            customerName,
            order
          );
          console.log(`✅ Order confirmation email sent successfully for order ${order.id}`);
        } catch (emailError) {
          console.error(`❌ Failed to send order confirmation email for order ${order.id}:`, emailError);
          // Don't fail the payment if email fails
        }
      })();
    }

    kkiapayService.logTransaction(reference, {
      status: 'VERIFIED',
      transactionId: verifyResult.transactionId,
      orderId: payment.orderId,
    });

    // Retourner les détails complets de la commande
    res.json({
      success: true,
      orderId: payment.orderId,
      transactionId: verifyResult.transactionId,
      message: 'Paiement validé avec succès',
      order: {
        id: order?.id,
        reference: order?.reference,
        status: order?.status,
        amount: order?.amount,
        total: order?.total,
        paymentMethod: order?.paymentMethod,
        shippingMethod: order?.shippingMethod,
        shippingAddress: order?.shippingAddress,
        customerName: order?.customerName,
        customerEmail: order?.customerEmail,
        customerPhone: order?.customerPhone,
        items: order?.items,
        notes: order?.notes,
        createdAt: order?.createdAt,
        updatedAt: order?.updatedAt,
      },
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        customerEmail: payment.customerEmail,
        customerPhone: payment.customerPhone,
      },
    });
  } catch (error) {
    console.error('Erreur vérification paiement:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification du paiement' });
  }
});

/**
 * POST /api/payments/webhook
 * Webhook de Kkiapay pour les notifications automatiques
 * Ne nécessite pas d'authentification (appel depuis Kkiapay)
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-kkiapay-signature'] as string;
    const payload = req.body;

    // Vérifier la signature du webhook
    if (!signature || !kkiapayService.verifyWebhookSignature(signature, payload)) {
      console.warn('[WEBHOOK] Signature invalide:', signature);
      return res.status(401).json({ error: 'Signature invalide' });
    }

    const { transactionId, status, reference, amount, phone } = payload;

    // Seuls les paiements réussis nous intéressent
    if (status !== 'SUCCESS') {
      console.log('[WEBHOOK] Statut non-SUCCESS:', status);
      return res.json({ success: true, message: 'Webhook traité' });
    }

    // Chercher le paiement
    const payment = await Payment.findOne({
      where: { reference: reference || transactionId },
    });

    if (!payment) {
      console.warn('[WEBHOOK] Paiement non trouvé pour référence:', reference);
      return res.status(404).json({ error: 'Paiement non trouvé' });
    }

    // Si déjà payé, ne pas relancer
    if (payment.status === 'paid') {
      console.log('[WEBHOOK] Paiement déjà validé:', reference);
      return res.json({ success: true, message: 'Déjà payé' });
    }

    // Mettre à jour le paiement
    await payment.update({
      status: 'paid',
      transactionId,
      paidAt: new Date(),
    });

    // Mettre à jour la commande
    const order = await Order.findByPk(payment.orderId);
    if (order) {
      await order.update({
        status: 'paid',
        transactionId,
      });
    }

    kkiapayService.logTransaction(reference, {
      event: 'WEBHOOK_SUCCESS',
      transactionId,
      amount,
      phone,
      orderId: payment.orderId,
    });

    res.json({ success: true, message: 'Paiement enregistré' });
  } catch (error) {
    console.error('[WEBHOOK] Erreur:', error);
    res.status(500).json({ error: 'Erreur du webhook' });
  }
});

/**
 * GET /api/payments/status/:reference
 * Vérifier le statut d'un paiement
 */
router.get('/status/:reference', async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;

    const payment = await Payment.findOne({ where: { reference } });

    if (!payment) {
      return res.status(404).json({ error: 'Paiement non trouvé' });
    }

    res.json({
      success: true,
      reference,
      status: payment.status,
      orderId: payment.orderId,
      amount: payment.amount,
    });
  } catch (error) {
    console.error('Erreur statut paiement:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du statut' });
  }
});

export default router;
