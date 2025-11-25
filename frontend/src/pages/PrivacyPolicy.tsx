import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Politique de Confidentialité</h1>
              <p className="text-gray-600">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>1. Introduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Shinecraft ("nous", "notre" ou "nos") exploite le site web shinecraft.com (le "Site"). Cette page vous informe de nos politiques concernant la collecte, l'utilisation et la divulgation de données personnelles lorsque vous utilisez notre Site et des choix que vous avez associés à ces données.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>2. Collecte et Utilisation des Données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">2.1 Types de Données Collectées</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Informations de compte (nom, email, téléphone)</li>
                    <li>Données de paiement (traitées de manière sécurisée)</li>
                    <li>Informations d'adresse de livraison</li>
                    <li>Cookies et données de navigation</li>
                    <li>Historique des commandes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2.2 Utilisation des Données</h3>
                  <p>Nous utilisons les données collectées pour:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
                    <li>Traiter vos commandes</li>
                    <li>Vous envoyer des confirmations et mises à jour</li>
                    <li>Améliorer notre service</li>
                    <li>Vous envoyer des newsletters (avec votre consentement)</li>
                    <li>Respecter les obligations légales</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>3. Sécurité des Données</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  La sécurité de vos données personnelles est importante pour nous, mais rappelez-vous qu'aucune méthode de transmission sur Internet ou de stockage électronique n'est 100% sécurisée. Bien que nous nous efforçons d'utiliser des moyens commercialement acceptables pour protéger vos données personnelles, nous ne pouvons pas garantir leur sécurité absolue.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>4. Cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Notre Site utilise des cookies pour améliorer votre expérience utilisateur. Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour vous avertir quand un cookie est envoyé.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>5. Droits des Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Vous avez le droit de:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
                  <li>Accéder à vos données personnelles</li>
                  <li>Corriger vos données</li>
                  <li>Demander la suppression de vos données</li>
                  <li>Vous opposer à l'utilisation de vos données</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>6. Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Si vous avez des questions sur cette politique de confidentialité, veuillez nous contacter à:
                </p>
                <p className="font-semibold">support@shinecraft.com</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
