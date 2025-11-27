import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from "react";

const ReturnsExchanges = () => {

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

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
              <h1 className="text-4xl font-bold mb-2">Retours & Échanges</h1>
              <p className="text-gray-600">Politique de retour et d'échange de 30 jours</p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>1. Période de Retour</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Vous disposez de 30 jours à compter de la date de réception de votre commande pour retourner ou échanger un article. Les retours effectués après cette période ne seront pas acceptés.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>2. Conditions de Retour</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Pour être accepté, l'article doit:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
                  <li>Être dans son emballage d'origine</li>
                  <li>Être non utilisé ou très peu utilisé</li>
                  <li>Avoir ses étiquettes d'origine intactes</li>
                  <li>Ne pas présenter de signes d'usure ou de dommages</li>
                  <li>Être accompagné de tous ses accessoires</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>3. Processus de Retour</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-1">Étape 1: Demande de Retour</h4>
                    <p className="text-sm text-gray-700">Contactez-nous à support@shinecraft.com avec votre numéro de commande</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Étape 2: Approbation</h4>
                    <p className="text-sm text-gray-700">Nous approuverons ou refuserons votre demande dans les 48 heures</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Étape 3: Expédition</h4>
                    <p className="text-sm text-gray-700">Vous recevrez les instructions d'expédition avec une étiquette de retour gratuite</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Étape 4: Remboursement</h4>
                    <p className="text-sm text-gray-700">Une fois reçu et vérifié, votre remboursement sera traité en 5-7 jours ouvrables</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>4. Frais d'Expédition pour Retour</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Les frais d'expédition pour retourner les articles sont gratuits si le retour est dû à une erreur de notre part ou à un article défectueux. Pour les retours sans raison, l'utilisateur assume les frais de retour.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>5. Échanges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Vous pouvez échanger un article contre un autre de même valeur ou de valeur supérieure (frais supplémentaires applicables). Les échanges doivent être demandés dans les 30 jours suivant la réception de votre commande.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>6. Articles Non-Retournables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Les articles suivants ne peuvent pas être retournés:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
                  <li>Articles personnalisés ou sur commande</li>
                  <li>Articles en solde marqués "Non-retournable"</li>
                  <li>Articles endommagés par le client</li>
                  <li>Produits d'hygiène ouverts</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>7. Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Pour toute question concernant les retours et échanges:</p>
                <div className="mt-2 space-y-1">
                  <p><strong>Email:</strong> support@shinecraft.com</p>
                  <p><strong>Téléphone:</strong> +229 XX XX XX XX</p>
                  <p className="text-sm text-gray-600 mt-3">Disponible du lundi au vendredi, 9h-17h</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchanges;
