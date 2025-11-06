import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message envoyé !", {
      description: "Nous vous répondrons dans les plus brefs délais",
      duration: 4000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={0} />
      
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-6">
              Contactez-nous
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une question ? Un projet sur mesure ? Notre équipe est à votre écoute
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card p-8 rounded-3xl">
                <h2 className="text-3xl font-serif font-bold mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom</label>
                    <Input 
                      type="text" 
                      placeholder="Votre nom"
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input 
                      type="email" 
                      placeholder="votre@email.com"
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea 
                      placeholder="Votre message..."
                      className="rounded-xl min-h-[150px]"
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full rounded-full">
                    Envoyer le message
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              {[
                {
                  icon: <Mail className="h-6 w-6" />,
                  title: "Email",
                  content: "contact@shinecraft.com"
                },
                {
                  icon: <Phone className="h-6 w-6" />,
                  title: "Téléphone",
                  content: "+33 1 23 45 67 89"
                },
                {
                  icon: <MapPin className="h-6 w-6" />,
                  title: "Adresse",
                  content: "123 Rue de l'Artisanat, 75001 Paris, France"
                }
              ].map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="glass-card p-6 rounded-2xl flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{info.title}</h3>
                    <p className="text-muted-foreground">{info.content}</p>
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="glass-card p-6 rounded-2xl"
              >
                <h3 className="text-lg font-semibold mb-4">Horaires d'ouverture</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Lundi - Vendredi : 10h - 19h</p>
                  <p>Samedi : 10h - 18h</p>
                  <p>Dimanche : Fermé</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
