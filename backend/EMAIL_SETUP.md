# Email Automation System - Guide de Configuration

## Vue d'ensemble

Le système ShineCraft inclut l'automatisation des emails pour :
1. **Email de bienvenue** - Envoyé lors de l'inscription
2. **Confirmation de commande** - Envoyée après chaque achat avec facture PDF jointe
3. **Téléchargement de facture** - Disponible dans la page des commandes utilisateur

## Configuration SMTP

### Prérequis

- Un compte email avec accès SMTP
- Variables d'environnement configurées dans `.env`

### Options de fournisseurs SMTP

#### 1. Gmail (Recommandé pour développement)

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-app-password
```

**Comment obtenir un App Password Gmail :**
1. Allez à https://myaccount.google.com/apppasswords
2. Sélectionnez "Mail" et "Windows Computer"
3. Google génère un mot de passe de 16 caractères
4. Utilisez ce mot de passe dans `SMTP_PASSWORD`

#### 2. Outlook/Hotmail

```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@outlook.com
SMTP_PASSWORD=votre-mot-de-passe
```

#### 3. SendGrid

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.votre-clé-api
```

#### 4. AWS SES

```
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-smtp-username
SMTP_PASSWORD=votre-smtp-password
```

#### 5. Mailgun

```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@votre-domaine.mailgun.org
SMTP_PASSWORD=votre-smtp-password
```

## Services Implémentés

### 1. Email Service (`src/services/email.service.ts`)

**Méthodes disponibles :**

#### `sendWelcomeEmail(userEmail, userName)`
Envoie un email de bienvenue avec template HTML stylisé.

**Utilisé dans :** `auth.controller.ts` - Fonction `register()`

#### `sendOrderConfirmationEmail(userEmail, userName, orderNumber, invoiceBuffer)`
Envoie une confirmation de commande avec PDF facture en pièce jointe.

**Utilisé dans :** `order.controller.ts` - Fonction `checkout()`

### 2. Invoice Service (`src/services/invoice.service.ts`)

**Méthodes disponibles :**

#### `generateInvoice(invoiceData): Promise<Buffer>`
Génère une facture PDF avec tous les détails de la commande.

**Paramètres :**
```typescript
{
  orderNumber: string;           // Ex: "SHC-000123"
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
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  shippingCost: number;
  tax?: number;
  total: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
}
```

**Retour :** Buffer PDF prêt à être envoyé ou téléchargé

## Endpoints API

### 1. Télécharger une facture

```
GET /api/orders/:id/invoice
Authorization: Bearer <token>
```

**Réponse :** Fichier PDF
**Format téléchargement :** `facture-SHC-000123.pdf`

**Exemple d'utilisation (Frontend) :**
```typescript
const downloadInvoice = async (orderId: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/orders/${orderId}/invoice`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `facture-${orderId}.pdf`;
  link.click();
};
```

## Contrôleurs Modifiés

### 1. Auth Controller (`src/controllers/auth.controller.ts`)

**Modification :** Lors de l'inscription réussie, un email de bienvenue est envoyé automatiquement.

```typescript
await emailService.sendWelcomeEmail(user.email, user.name)
  .catch((err) => console.error('Failed to send welcome email:', err));
```

### 2. Order Controller (`src/controllers/order.controller.ts`)

**Modifications :**
- **checkout()** - Génère PDF et envoie email de confirmation après création de commande
- **downloadInvoice()** - Nouveau endpoint pour télécharger la facture

```typescript
// Envoi de l'email avec facture après checkout
const invoicePDF = await invoiceService.generateInvoice(invoiceData);
await emailService.sendOrderConfirmationEmail(userEmail, userName, orderNumber, invoicePDF);
```

## Templates d'Email

### Email de Bienvenue

- **Sujet :** "Bienvenue chez ShimeCraft! 🎉"
- **Contenu :**
  - Message de bienvenue personnalisé
  - Liste des fonctionnalités disponibles
  - Call-to-action pour explorer les produits
  - Footer avec informations de contact

### Email de Confirmation de Commande

- **Sujet :** "Confirmation de commande - {orderNumber}"
- **Contenu :**
  - Remerciement et confirmation
  - Statut "En cours de préparation"
  - Numéro de commande et date
  - Informations de la facture jointe
  - Prochaines étapes
  - **Pièce jointe :** Facture PDF

### Facture PDF

- **Header :** Logo ShineCraft et informations de facture
- **Infos client :** Nom, email, téléphone
- **Adresse de livraison** avec détails complets
- **Table des produits** avec :
  - Nom du produit
  - Quantité
  - Prix unitaire
  - Montant total
- **Résumé des coûts :**
  - Sous-total
  - Frais de livraison
  - Taxes (si applicable)
  - **Montant total en XOF**
- **Statut de paiement** avec code couleur

## Frontend Integration

### Page UserOrders.tsx

**Nouvelles fonctionnalités :**
- Bouton "Télécharger la facture" pour chaque commande
- Icône Download pour meilleure UX
- Gestion des erreurs avec toast notifications

```tsx
const downloadInvoice = async (orderId: number) => {
  try {
    const response = await fetch(`${API_URL}/api/orders/${orderId}/invoice`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const blob = await response.blob();
    // Déclenche le téléchargement...
    toast.success('Facture téléchargée avec succès');
  } catch (error) {
    toast.error('Erreur lors du téléchargement');
  }
};
```

## Gestion des Erreurs

### Emails non critiques

Les erreurs d'envoi d'email ne bloquent pas les processus principaux :

```typescript
emailService.sendWelcomeEmail(email, name)
  .catch((err) => console.error('Email failed:', err));
```

### Endpoints de téléchargement

Vérifie la propriété de la commande (sauf admins) :

```typescript
const query = req.user?.role === 'admin'
  ? { id }
  : { id, userId: req.user?.id };
```

## Dépannage

### Les emails ne sont pas envoyés

1. **Vérifiez les variables `.env`**
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
   
2. **Pour Gmail :**
   - Utilisez un App Password, pas votre mot de passe normal
   - Activez l'accès aux "appareils peu sécurisés" si nécessaire

3. **Logs du serveur**
   ```
   node backend/dist/index.js
   # Cherchez les messages d'erreur SMTP
   ```

### Les PDFs ne se téléchargent pas

1. Vérifiez que l'utilisateur possède la commande
2. Confirmez que les paramètres `invoice.ts` sont corrects
3. Vérifiez les logs serveur pour les erreurs PDFKit

### Le lien de téléchargement est invalide

1. Vérifiez le JWT token dans localStorage
2. Confirmez l'endpoint `/api/orders/:id/invoice` exists
3. Vérifiez les logs d'authentification middleware

## Améliorations Futures

- [ ] Envoi d'emails de rappel de commande
- [ ] Notifications d'expédition automatiques
- [ ] Templates d'email personnalisables
- [ ] Support multi-langue pour les emails
- [ ] Archives des emails (stockage BD)
- [ ] Queue d'envoi asynchrone pour haute volume
- [ ] Webhook pour fournisseurs d'email (SendGrid, Mailgun)
- [ ] Tests d'email automatisés

## Fichiers Créés/Modifiés

### Fichiers Créés
- `src/services/email.service.ts` - Service email
- `src/services/invoice.service.ts` - Génération PDF
- `src/routes/order.routes.ts` - Routes commandes
- `.env.example` - Exemple de configuration

### Fichiers Modifiés
- `src/controllers/auth.controller.ts` - +Email bienvenue
- `src/controllers/order.controller.ts` - +Email commande, +Download PDF
- `src/app.ts` - +Routes commandes
- `frontend/src/pages/UserOrders.tsx` - +Bouton téléchargement

## Références

- [Nodemailer Documentation](https://nodemailer.com/)
- [PDFKit Documentation](https://pdfkit.org/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
