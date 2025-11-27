import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Produits',
      links: [
        { label: 'Boutique', href: '/shop' },
        { label: 'Nouvelles Arrivées', href: '/shop?sort=new' },
        { label: 'En Promotion', href: '/shop?filter=sale' },
        { label: 'Meilleures Ventes', href: '/shop?sort=best' },
      ],
    },
    {
      title: 'Support Client',
      links: [
        { label: 'Contactez-nous', href: '/contact' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Retours & Échanges', href: '/returns-exchanges' },
        { label: 'Politique de Confidentialité', href: '/privacy-policy' },
      ],
    },
    {
      title: 'À Propos',
      links: [
        { label: 'Qui Sommes-Nous', href: '/about' },
        { label: 'Notre Histoire', href: '/about' },
        { label: 'Conditions d\'Utilisation', href: '/terms-of-service' },
        { label: 'Mentions Légales', href: '/legal-notice' },
      ],
    },
    {
      title: 'Mon Compte',
      links: [
        { label: 'Mon Profil', href: '/profile' },
        { label: 'Mes Commandes', href: '/orders' },
        { label: 'Mes Adresses', href: '#' },
        { label: 'Mes Favoris', href: '#' },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: Phone,
      label: 'Téléphone',
      value: '+229 01 51 08 09 83',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'support@shinecraft.com',
    },
    {
      icon: MapPin,
      label: 'Adresse',
      value: 'Parakou, Bénin',
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 mt-20">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center text-white"
          >
            <h3 className="text-3xl font-bold mb-4">Abonnez-vous à Notre Newsletter</h3>
            <p className="text-lg mb-6 opacity-90">
              Recevez nos meilleures offres et les nouvelles collections directement dans votre boîte mail
            </p>
            <div className="flex gap-3 max-w-md mx-auto flex-wrap">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
              <button className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-slate-100 transition-smooth">
                S'abonner
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <h3 className="text-2xl font-serif font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Shinecraft
              </h3>
            </Link>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Découvrez notre collection exclusive de produits artisanaux de qualité supérieure. Chaque article est soigneusement sélectionné pour vous garantir la meilleure expérience.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.2, color: '#3b82f6' }}
                    className="w-10 h-10 rounded-full bg-slate-800 hover:bg-primary flex items-center justify-center transition-smooth"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index + 1) * 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-slate-400 hover:text-primary transition-smooth flex items-center group"
                    >
                      <span className="inline-block w-0 h-0.5 bg-primary group-hover:w-2 transition-all mr-2"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-t border-slate-800"
        >
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-800/50 transition-smooth"
              >
                <Icon className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-500 mb-1">{info.label}</p>
                  <p className="text-slate-200 font-medium">{info.value}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          {/* Additional Services */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
          >
            <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <div>
                <p className="font-semibold text-white">Livraison Gratuite</p>
                <p className="text-sm text-slate-400">À partir de 50 000 XOF</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <p className="font-semibold text-white">Paiement Sécurisé</p>
                <p className="text-sm text-slate-400">100% sécurisé et protégé</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">↩️</span>
              </div>
              <div>
                <p className="font-semibold text-white">Retour Gratuit</p>
                <p className="text-sm text-slate-400">30 jours pour changer d'avis</p>
              </div>
            </div>
          </motion.div>

          {/* Bottom Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-800">
            <p className="text-slate-400 text-sm text-center sm:text-left">
              © {currentYear} Shinecraft. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              Fait avec
              <Heart className="w-4 h-4 text-red-500" />
              par l'équipe Shinecraft
            </div>
            <div className="flex gap-6">
              <a href="/privacy-policy" className="text-slate-400 hover:text-primary transition-smooth text-sm">
                Politique de Confidentialité
              </a>
              <a href="/terms-of-service" className="text-slate-400 hover:text-primary transition-smooth text-sm">
                Conditions d'Utilisation
              </a>
              <a href="/legal-notice" className="text-slate-400 hover:text-primary transition-smooth text-sm">
                Mentions Légales
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
