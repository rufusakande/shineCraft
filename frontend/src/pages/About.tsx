import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Heart, Users, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-6">
              Notre Histoire
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Shinecraft est née d'une passion pour l'artisanat et le désir de créer des bijoux uniques qui racontent une histoire
            </p>
          </motion.div>

          {/* Story */}
          <div className="max-w-4xl mx-auto mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 sm:p-12 rounded-3xl mb-12"
            >
              <h2 className="text-3xl font-serif font-bold mb-6">L'Artisanat au Cœur de Nos Créations</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Chaque bijou Shinecraft est le fruit d'un travail minutieux et passionné. Nos artisans sélectionnent avec soin les matériaux les plus nobles pour créer des pièces uniques qui traverseront le temps.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                De l'esquisse initiale à la finition finale, chaque étape est réalisée à la main avec une attention particulière aux détails. Cette approche artisanale garantit que chaque création est unique et porte en elle l'empreinte de son créateur.
              </p>
              <p className="text-lg text-muted-foreground">
                Notre mission est de perpétuer des savoir-faire ancestraux tout en y apportant une touche de modernité et d'élégance contemporaine.
              </p>
            </motion.div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {[
              {
                icon: <Heart className="h-10 w-10" />,
                title: "Passion",
                description: "Chaque création est réalisée avec amour et dévouement"
              },
              {
                icon: <Users className="h-10 w-10" />,
                title: "Savoir-faire",
                description: "Des techniques artisanales transmises de génération en génération"
              },
              {
                icon: <Award className="h-10 w-10" />,
                title: "Excellence",
                description: "Des matériaux nobles pour des créations d'exception"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass-card p-8 rounded-2xl text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-serif font-semibold mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
