
"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { PortfolioCard } from "@/components/PortfolioCard";
import { projects } from "@/lib/portfolio-data";

export default function PortfolioPage() {
    return (
        <section id="portfolio" className="py-20 md:py-28 bg-background pt-32">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Our Work</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Portfolio
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A glimpse into our creative world and the impact we deliver.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <PortfolioCard project={project} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
}
