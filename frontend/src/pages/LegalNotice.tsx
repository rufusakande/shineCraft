import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LegalNotice = () => {
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
              <h1 className="text-4xl font-bold mb-2">Mentions Légales</h1>
              <p className="text-gray-600">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>1. Identification du Site</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>Nom du site:</strong> Shinecraft</p>
                  <p><strong>Adresse du site:</strong> shinecraft.com</p>
                  <p><strong>Type de site:</strong> Plateforme e-commerce</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>2. Informations de l'Éditeur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>Raison Sociale:</strong> Shinecraft SARL</p>
                  <p><strong>Adresse:</strong> Cotonou, Bénin</p>
                  <p><strong>Téléphone:</strong> +229 XX XX XX XX</p>
                  <p><strong>Email:</strong> support@shinecraft.com</p>
                  <p><strong>Directeur de Publication:</strong> Équipe Shinecraft</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>3. Hébergement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>Prestataire d'hébergement:</strong> [À remplir]</p>
                  <p><strong>Adresse:</strong> [À remplir]</p>
                  <p><strong>Site web:</strong> [À remplir]</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>4. Responsabilités</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">4.1 Editeur</h3>
                  <p>
                    L'éditeur s'efforce de garantir l'exactitude et la mise à jour des informations publiées sur ce site, dont il assume la responsabilité. Toutefois, il ne peut pas garantir l'absence d'erreurs, l'exhaustivité ou la pertinence des informations mises à disposition.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 mt-4">4.2 Utilisateurs</h3>
                  <p>
                    L'utilisateur est responsable de l'utilisation qu'il fait du site et des conséquences qui pourraient en découler. Il s'engage notamment à ne pas transmettre des contenus contraires à l'ordre public, à la morale ou aux droits des tiers.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>5. Propriété Intellectuelle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Tous les éléments du site, y compris les textes, images, vidéos et logos, sont la propriété exclusive de Shinecraft ou sont utilisés avec l'autorisation des titulaires des droits. Toute reproduction, représentation ou adaptation sans autorisation préalable est interdite.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>6. Liens Hypertextes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Le site peut contenir des liens vers d'autres sites. Shinecraft n'est pas responsable du contenu de ces sites externes, de leur politique de confidentialité ou de leurs pratiques.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>7. Modifications du Site</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Shinecraft se réserve le droit de modifier, suspendre ou supprimer le site ou certains de ses éléments à tout moment, sans préavis ni responsabilité envers l'utilisateur.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>8. Données Personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Pour les questions concernant le traitement de vos données personnelles, veuillez consulter notre Politique de Confidentialité.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;
