import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);
  
  const faqItems: FAQItem[] = [
    {
      category: 'Commandes',
      question: 'Comment puis-je passer une commande?',
      answer: 'Rendez-vous sur notre page Boutique, sélectionnez les produits, ajoutez-les au panier, puis suivez les étapes de paiement. Vous devez être connecté pour valider votre commande.'
    },
    {
      category: 'Commandes',
      question: 'Puis-je modifier ma commande après l\'avoir passée?',
      answer: 'Si votre commande n\'a pas encore été expédiée, nous pouvons la modifier. Contactez-nous rapidement à support@shinecraft.com avec votre numéro de commande.'
    },
    {
      category: 'Livraison',
      question: 'Quels sont les délais de livraison?',
      answer: 'Les délais de livraison sont généralement de 3-5 jours ouvrables à partir de la date de confirmation de la commande. Les délais peuvent être plus longs lors de périodes de forte activité.'
    },
    {
      category: 'Livraison',
      question: 'Livrez-vous à l\'international?',
      answer: 'Actuellement, nous livrons uniquement au Bénin. Nous travaillons sur l\'expansion vers d\'autres pays.'
    },
    {
      category: 'Paiement',
      question: 'Quels modes de paiement acceptez-vous?',
      answer: 'Nous acceptons les paiements par virement bancaire, mobile money (MTN Mobile Money, Moov Money) et cartes bancaires via Kkiapay.'
    },
    {
      category: 'Paiement',
      question: 'Mon paiement est-il sécurisé?',
      answer: 'Oui, tous les paiements sont traités via des passerelles de paiement sécurisées (Kkiapay). Nous utilisons le cryptage SSL pour protéger vos informations.'
    },
    {
      category: 'Retours',
      question: 'Quelle est votre politique de retour?',
      answer: 'Nous offrons une politique de retour gratuit dans les 30 jours suivant la réception de votre commande, à condition que l\'article soit dans son état d\'origine.'
    },
    {
      category: 'Retours',
      question: 'Comment puis-je retourner un article?',
      answer: 'Contactez-nous à support@shinecraft.com avec votre numéro de commande. Nous vous enverrons une étiquette de retour gratuite et les instructions.'
    },
    {
      category: 'Compte',
      question: 'Comment créer un compte?',
      answer: 'Cliquez sur "S\'enregistrer" en haut de la page, entrez vos informations et créez votre compte. Vous recevrez un email de confirmation.'
    },
    {
      category: 'Compte',
      question: 'Oublié mon mot de passe, que faire?',
      answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion, entrez votre email, et nous vous enverrons un lien pour réinitialiser votre mot de passe.'
    },
    {
      category: 'Produits',
      question: 'Les produits sont-ils de bonne qualité?',
      answer: 'Oui, tous nos produits sont soigneusement sélectionnés et testés pour garantir la meilleure qualité. Consultez les avis des clients pour plus d\'informations.'
    },
    {
      category: 'Produits',
      question: 'Y a-t-il une garantie sur les produits?',
      answer: 'Tous nos produits bénéficient d\'une garantie de qualité. Les défauts de fabrication sont couverts. Contactez-nous pour plus de détails.'
    }
  ];

  const categories = Array.from(new Set(faqItems.map(item => item.category)));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-bold mb-4">Questions Fréquemment Posées</h1>
              <p className="text-gray-600 text-lg">Trouvez des réponses à vos questions les plus courantes</p>
            </div>

            {categories.map((category) => (
              <div key={category} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-primary">{category}</h2>
                <div className="space-y-4">
                  {faqItems
                    .filter(item => item.category === category)
                    .map((item, index) => {
                      const itemId = faqItems.indexOf(item);
                      return (
                        <motion.div
                          key={itemId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => setExpandedId(expandedId === itemId ? null : itemId)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-4">
                                <CardTitle className="text-lg font-semibold">{item.question}</CardTitle>
                                <motion.div
                                  animate={{ rotate: expandedId === itemId ? 180 : 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
                                </motion.div>
                              </div>
                            </CardHeader>
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{
                                height: expandedId === itemId ? 'auto' : 0,
                                opacity: expandedId === itemId ? 1 : 0,
                              }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <CardContent className="pt-0">
                                <p className="text-gray-700">{item.answer}</p>
                              </CardContent>
                            </motion.div>
                          </Card>
                        </motion.div>
                      );
                    })}
                </div>
              </div>
            ))}

            <Card className="mt-12 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle>Vous n'avez pas trouvé votre réponse?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Si vous n'avez pas trouvé la réponse à votre question, n'hésitez pas à nous contacter directement.
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> support@shinecraft.com</p>
                  <p><strong>Téléphone:</strong> +229 XX XX XX XX</p>
                  <p className="text-sm text-gray-600">Du lundi au vendredi, 9h-17h</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
