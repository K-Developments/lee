
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Project } from "@/lib/portfolio-data";
import { Badge } from "./ui/badge";
import { ArrowUpRight } from "lucide-react";

interface PortfolioCardProps {
  project: Project;
}

export function PortfolioCard({ project }: PortfolioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="group overflow-hidden relative h-full transition-shadow duration-300">
        <CardHeader className="p-0">
          <div className="aspect-video overflow-hidden">
            <Image
              src={project.imageUrl}
              alt={project.title}
              width={600}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              data-ai-hint={project.aiHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-card flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="text-2xl font-bold mb-2 font-headline">{project.title}</h3>
            <p className="text-muted-foreground mb-4">{project.description}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <Link href={`/#portfolio`} className="absolute inset-0" aria-label={project.title}></Link>
          <div className="absolute top-4 right-4 bg-background p-2 translate-x-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <ArrowUpRight className="w-5 h-5 text-foreground" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
