import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService = () => {
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
              <h1 className="text-4xl font-bold mb-2">Conditions d'Utilisation</h1>
              <p className="text-gray-600">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>1. Acceptation des Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  En accédant et en utilisant ce Site, vous acceptez d'être lié par ces Conditions d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce Site.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>2. Licence d'Utilisation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Le contenu de ce Site est fourni à titre informatif uniquement. Vous êtes autorisé à afficher et imprimer des pages du Site pour usage personnel et non commercial, à condition de ne pas modifier le contenu et de conserver tous les avis de droits d'auteur et autres propriétés.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>3. Clause de Non-Responsabilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Le contenu du Site est fourni "en l'état" et "tel que disponible". Shinecraft ne fait aucune déclaration ou garantie de quelque nature que ce soit, expresse ou implicite, concernant le Site, y compris les garanties de qualité marchande, d'adéquation à un usage particulier, ou de non-contrefaçon.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>4. Limitation de Responsabilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  En aucun cas Shinecraft ne sera responsable de tout dommage indirect, accidentel, spécial, consécutif ou punitif découlant de votre utilisation du Site ou de l'impossibilité d'utiliser le Site.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>5. Propriété Intellectuelle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Le contenu du Site, y compris les textes, graphiques, images, logos et logiciels, est la propriété de Shinecraft ou de ses fournisseurs de contenu et est protégé par les lois internationales sur les droits d'auteur.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>6. Comportement Utilisateur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>En utilisant ce Site, vous acceptez de:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
                  <li>Ne pas enfreindre les lois applicables</li>
                  <li>Ne pas violer les droits d'autrui</li>
                  <li>Ne pas envoyer de contenu offensant ou nuisible</li>
                  <li>Ne pas interférer avec le fonctionnement du Site</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>7. Modification des Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Shinecraft se réserve le droit de modifier ces Conditions d'Utilisation à tout moment. Les modifications entreront en vigueur dès leur publication sur le Site.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>8. Résiliation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Shinecraft se réserve le droit de résilier votre accès au Site à tout moment, pour quelque raison que ce soit, sans préavis.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>9. Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Si vous avez des questions concernant ces Conditions d'Utilisation, veuillez nous contacter à:
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

export default TermsOfService;
